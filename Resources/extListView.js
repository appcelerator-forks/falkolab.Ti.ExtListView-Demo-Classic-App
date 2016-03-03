	
exports.createListView = function(opts) {	
	if (opts.sections) {
		_.each(opts.sections, function(sectionOpts) {
			if (!opts.columns) {
				throw "You must define `columns` property in ListView. It can be same value or greater.";
			} else if (opts.columns < sectionOpts.columns) {
				throw "ListView.columns property must be greater or equal ListViewSection.columns";
			}			
		});
	}
	
	if (!opts.columns) return Ti.UI.createListView(opts);
	
	// to preserve original options unchanged
	opts = _.extend({}, opts);
	var columns = opts.columns || 1;
	
	if (!_.isEmpty(opts.templates)) {
		var templates = transformTemplates(opts.templates, columns);			
		
		// to preserve original templates set to be unchanged
		opts.templates = _.extend({}, opts.templates, templates);
		printDebug(opts.templates, 'templates.json');	
		
		if (Ti.Platform.osname == 'android') {
			for (var binding in opts.templates) {
				var currentTemplate = opts.templates[binding];
				//process template
				processTemplate(currentTemplate);
				//process child templates
				processChildTemplates(currentTemplate);
			}
		}
	}
	
	// do not omit additional properties because they needed for validation etc
	var list = Ti.UI.createListView(opts);
	opts = undefined;
	
	list.appendSection = _.wrap(list.appendSection, function(func, section, animation) {
		if (!this.columns) {
			throw "You must define `columns` property in ListView. It can be same value or greater.";
		} else if (this.columns < section.columns) {
			throw "ListView.columns property must be greater or equal ListViewSection.columns";
		}			
				
		func.call(this, section, animation);
	});	
	
	function setAddMarker(func, markerProps) {
		var section = this.sections[markerProps.sectionIndex];
		if(section.columns) {
			markerProps = {
				sectionIndex: markerProps.sectionIndex,
				itemIndex: Math.floor(markerProps.itemIndex/section.columns)
			};
		}
		func.call(this, markerProps);
	}
	
	list.setMarker = _.wrap(list.setMarker, setAddMarker);
	list.addMarker = _.wrap(list.addMarker, setAddMarker);
	
	list.fixEvent = function(evt) {
		if(evt.corrected === true) return;
		if(evt.type == 'move') {
			Ti.API.warn('targetItemIndex property was not corrected.');
		}
		
		if(evt.section && evt.section.columns) { 
			var section = evt.section;
			if(evt.hasOwnProperty('bindId')) {
				var parts = evt.bindId.split('@');
				if(parts.length == 2) {
					evt.bindId = parts[0];
					if(evt.hasOwnProperty('itemIndex')) {
						evt.itemIndex = evt.itemIndex * section.columns + parseInt(parts[1]);
					}
				}		
			}
		}
		
		if(['scrollend', 'scrollstart'].indexOf(evt.type) >-1 && evt.firstVisibleSection.columns) {	
			evt.firstVisibleItemIndex = evt.firstVisibleItemIndex * evt.firstVisibleSection.columns;
			evt.visibleItemCount = Math.min(evt.firstVisibleSection.getItems().length - evt.firstVisibleItemIndex, 
				evt.visibleItemCount * evt.firstVisibleSection.columns);
			evt.firstVisibleItem = evt.firstVisibleSection.getItemAt(evt.firstVisibleItemIndex);
		}
		
		evt.corrected = true;
	};
	
	// list.addEventListener('itemclick', function(evt) {
		// if(!evt.section.columns || evt.ext === true) return;		
		// //this.fireEvent(evt.type, evt);		
	// });	
	
	return list;
};

exports.createListSection = function(opts) {
	if (!opts.columns) return Ti.UI.createListSection(opts);
	// to preserve original options unchanged
	opts = _.extend({}, opts);	

	// do not omit additional properties because they needed for validation etc
	var section = Ti.UI.createListSection(_.omit(opts, 'items'));	
				
	section.setItems = _.wrap(section.setItems, function(func, items) {				
		var transformedItems = transformDataItems(items, this.columns, this.defaultItemTemplate);
		//printDebug(transformedItems, 'dataItems.json');
		func.call(this, transformedItems);
	});
	section._getItems = section.getItems;
	section.getItems = _.wrap(section.getItems, function(func) {
		return clone(
			Array.prototype.concat.apply([], 
				_.map(this._getItems(), function(item) {
					return item.properties.originalItems;
				})
			)
		);
	});

	section.appendItems = _.wrap(section.appendItems, function(func, items, animation) {
		if(!items || !items.length) return;		
		
		var offset = 0, currentItems = this._getItems(), last = _.last(currentItems);
		if(last) {
			offset = last.properties.originalItems.length % this.columns;
		}
						 				
		var transformedItems = transformDataItems(items, this.columns, this.defaultItemTemplate, offset);
		
		if(last && offset) {					
			var item = _.extend(clone(last), transformedItems.shift());
			this._updateItemAt(currentItems.length-1, item);
		}			
		func.call(this, transformedItems, animation);
	});
	
	section._deleteItemsAt = section.deleteItemsAt;
	
	section.deleteItemsAt = _.wrap(section.deleteItemsAt, function(func, itemIndex, count, animation) {
		// if(!count) return;
		// var internalIndex = Math.floor(itemIndex/this.columns),
			// offset = itemIndex % this.columns;
// 					
		// func.call(this, internalIndex, this._items.length - internalIndex, animation);
// 				
		// var itemsForRebuild = this._items.splice(internalIndex);
		// var originalItems = Array.prototype.concat.apply([], 
			// _.map(itemsForRebuild, function(item) {
				// return item.properties.originalItems;
			// })
		// );								
		// originalItems.splice(offset, count);
		// this.appendItems(originalItems, animation);
		
		this.replaceItemsAt(itemIndex, count, [], animation);
	});			
	
	section._getItemAt = section.getItemAt;			
	section.getItemAt = _.wrap(section.getItemAt, function(func, itemIndex) {
		var internalIndex = Math.floor(itemIndex/this.columns),
			offset = itemIndex % this.columns,
			currentItems = this._getItems();
			
		return currentItems[internalIndex].properties.originalItems[offset];
	});
	
	section.insertItemsAt = _.wrap(section.insertItemsAt, function(func, itemIndex, dataItems, animation) {		
		if(!dataItems || !dataItems.length) return;		
		
		var internalIndex = Math.floor(itemIndex/this.columns),
			offset = itemIndex % this.columns, currentItems = this._getItems();
			
		this._deleteItemsAt(internalIndex, currentItems.length - internalIndex);
		
		var itemsForRebuild = currentItems.splice(internalIndex);

		var originalItems = Array.prototype.concat.apply([], 
			_.map(itemsForRebuild, function(item) {
				return item.properties.originalItems;
			})
		);
		
		originalItems.splice.apply(originalItems, [offset, 0].concat(dataItems));				
		this.appendItems(originalItems, animation);
	});
	
	section.replaceItemsAt = _.wrap(section.replaceItemsAt, function(func, itemIndex, count, dataItems, animation) {
		if(!count) return;		
		var internalIndex = Math.floor(itemIndex/this.columns),
			offset = itemIndex % this.columns,
			currentItems = this._getItems();
			
		this._deleteItemsAt.call(this, internalIndex, currentItems.length - internalIndex,
			// need animation if called from deleteItemsAt
			dataItems.length == 0 ? animation: undefined);
		
		var itemsForRebuild = currentItems.splice(internalIndex);
		
		var originalItems = Array.prototype.concat.apply([], 
			_.map(itemsForRebuild, function(item) {
				return item.properties.originalItems;
			})
		);								
		originalItems.splice.apply(originalItems, [offset, count].concat(dataItems));
		this.appendItems(originalItems,
			// NOT need animation if called from deleteItemsAt 
			dataItems.length == 0 ? undefined: animation);
	});
	
	section._updateItemAt = section.updateItemAt;			
	section.updateItemAt = _.wrap(section.updateItemAt, function(func, index, dataItem, animation) {
		var internalIndex = Math.floor(index/this.columns),
			offset = index % this.columns;
			
		var originalItems = this._getItemAt(internalIndex).properties.originalItems;				
		originalItems.splice(offset, 1, dataItem);
		
		var transformed = transformDataItems(originalItems, this.columns, this.defaultItemTemplate);
		func.call(this, internalIndex, transformed[0], animation);
	});
	
	Object.defineProperty(section, 'items', {
		get: section.getItems,
		set: section.setItems
	});
	
	if(opts.items) section.setItems(opts.items);
	return section;	
};

exports.DIVIDER = '@';

function printDebug(data, fileName) {
	//return;
	if (Ti.App.deployType == "development") {			
		var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, fileName);
		file.write(JSON.stringify(data, null, '\t'));
		file = null;
		//alert(JSON.stringify(items, null, '\t'));
	}
}

function clone(obj) {
	var copy;
	var omit = Array.prototype.slice.call(arguments, 1);

	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj)
		return obj;

	// Handle Date
	if ( obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if ( obj instanceof Array) {
		copy = [];
		for (var i = 0,
		    len = obj.length; i < len; i++) {
			copy[i] = clone.apply(null, [obj[i]].concat(omit));
		}
		return copy;
	}

	// Handle Object
	if ( obj instanceof Object) {
		copy = {};
		for (var attr in obj) {			
			if(omit && omit.indexOf(attr)>=0) {				
				continue;
			}
			if (obj.hasOwnProperty(attr))
				copy[attr] = clone.apply(null, [obj[attr]].concat(omit));
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}

function transformDataItems(items, columns, defaultItemTemplate, offset) {
	var firstChunk,
	    offset = offset || 0;
	    
	// to preserve original items unchanged
	//items = clone(items);

	if(!defaultItemTemplate) {
		_.each(items, function(item) {
			if (!_.has(item, 'template')) {			
				throw "You must to set defaultItemTemplate for section or for each items";			
			}
		});
	}

	if (offset < columns) {
		firstChunk = items.splice(offset, columns - offset);
	}

	var chunks = _.chain(items).groupBy(function(element, index) {
		return Math.floor(index / columns);
	}).toArray().value();

	if (firstChunk) {
		chunks.unshift(firstChunk);
	}

	return _.map(chunks, function(itemsChunk) {
		
		var dataItem = {
			template : 'extlist@' + _.map(itemsChunk, function(item) {return item.template || defaultItemTemplate;}).join(exports.DIVIDER),
			properties : {
				originalItems: itemsChunk
			}
		};

		for (var i = 0, l = itemsChunk.length; i < l; i++) {
		   	// WARN: references to original `item` object is preserved here
			var sourceItem = itemsChunk[i];
			
			for (var attr in sourceItem) {			
				if(attr == 'properties' || attr == 'template') continue;
				dataItem[attr + exports.DIVIDER + i] = sourceItem[attr];
			}
	
			if (sourceItem.properties) {
				dataItem['itemContainer@' + i] = sourceItem.properties;
			}
		}
		return dataItem;
	});
}

function transformTemplates(templates, columns) {	
	function renameBindIds(template, suffix, index) {
		index = index || 0;	
		
		if(template.bindId) {
			if(template.bindId.split(exports.DIVIDER).length!==2) {
				template.bindId = template.bindId + suffix;
			}
		} else {
			// it need for index conversion in fixEvent
			template.bindId = '_' + (index++) + suffix;
		}
		
		if (template.childTemplates) {
			_.each(template.childTemplates, function(template) {
				renameBindIds(template, suffix, index);
			});
		}
	}
	
	function combinator(source, n) {
		var matrix = [];
		while (n--) {
			matrix.push(source);
		}
	
		return matrix.reduceRight(function(combination, x) {
			var result = [];
			x.forEach(function(a) {
				combination.forEach(function(b) {
					result.push([a].concat(b));
				});
			});
			return result;
		});
	};

	var names = Object.keys(templates);

	var result = [];
	for (var n = 1; n <= columns; n++) {
		result.push.apply(result, _.chain(combinator(names, n)).map(function(combination, rowIndex) {
			if(!_.isArray(combination)) {
				combination = [combination];
			}
			var name = 'extlist@' + combination.join(exports.DIVIDER);
			var containerTemplate = {
				type : 'Ti.UI.View',
				bindId : 'rowContainer@' + rowIndex,
				properties : {					
					layout : 'horizontal',
					horizontalWrap : false,
					width : Ti.UI.FILL,
					height : Ti.UI.SIZE
					//name: name
				}
			};

			var template = {
				properties : {
					name : name
				},
				childTemplates : [containerTemplate]
			};

			if (names.length == 1) {
				_.extend(template.properties, _.omit(clone(templates[names[0]].properties), 'name'));
			}

			containerTemplate.childTemplates = _.map(combination, function(templateName, index) {
				var itemContainerTemplate = {
					type : 'Ti.UI.View',
					bindId : 'itemContainer@' + index,
					properties : {
						height : Ti.UI.SIZE,
						width : Ti.UI.SIZE,
						left : 0
					}
				};

				var childTemplates = templates[templateName].childTemplates;
				if (childTemplates) {
					childTemplates = clone(childTemplates, 'tiProxy' /*omit this property*/);					
					itemContainerTemplate.childTemplates = childTemplates;
				}

				renameBindIds(itemContainerTemplate, exports.DIVIDER + index);
				return itemContainerTemplate;
			});

			return [name, template];
		}).value());
	}
	return _.object(result);
}


if (Ti.Platform.osname == 'android') {
	//******************
	// Android Platform code
	//Create ListItemProxy, add events, then store it in 'tiProxy' property
	function processTemplate(properties) {
		var cellProxy = Titanium.UI.createListItem();
		properties.tiProxy = cellProxy;
		var events = properties.events;
		addEventListeners(events, cellProxy);
	}

	//Recursive function that process childTemplates and append corresponding proxies to
	//property 'tiProxy'. I.e: type: "Titanium.UI.Label" -> tiProxy: LabelProxy object
	function processChildTemplates(properties) {
		if (!properties.hasOwnProperty('childTemplates'))
			return;

		var childProperties = properties.childTemplates;
		if (childProperties ===	void 0 || childProperties === null)
			return;

		for (var i = 0; i < childProperties.length; i++) {
			var child = childProperties[i];
			var proxyType = child.type;
			if (proxyType !== void 0 && child.tiProxy === void 0) {
				var creationProperties = child.properties;
				var creationFunction = lookup(proxyType);
				var childProxy;
				//create the proxy
				if (creationProperties !== void 0) {
					childProxy = creationFunction(creationProperties);
				} else {
					childProxy = creationFunction();
				}
				//add event listeners
				var events = child.events;
				addEventListeners(events, childProxy);
				//append proxy to tiProxy property
				child.tiProxy = childProxy;
			}

			processChildTemplates(child);
		}
	}

	//add event listeners
	function addEventListeners(events, proxy) {
		if (events !== void 0) {
			for (var eventName in events) {
				proxy.addEventListener(eventName, events[eventName]);
			}
		}
	}

	//convert name of UI elements into a constructor function.
	//I.e: lookup("Titanium.UI.Label") returns Titanium.UI.createLabel function
	function lookup(name) {
		var lastDotIndex = name.lastIndexOf('.');
		var proxy = eval(name.substring(0, lastDotIndex));
		if ( typeof (proxy) == undefined)
			return;

		var proxyName = name.slice(lastDotIndex + 1);
		return proxy['create' + proxyName];
	}
}
