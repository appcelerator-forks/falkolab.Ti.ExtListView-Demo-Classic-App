var _ = require('underscore');

function getScreenSize() {
	var height = Ti.Platform.displayCaps.platformHeight;
    var width = Ti.Platform.displayCaps.platformWidth;
    var dpi = Ti.Platform.displayCaps.dpi;
                
    if(Ti.Platform.osname =='android') {
        height = height/dpi*160;
        width = width/dpi*160;
    }
    
    return {
    	width: width,
    	height: height
    };
}

function adjustItemsSize(items, columns) {
	var size = getScreenSize();
	return _.map(items, function(item) {
		item.properties.width = size.width/columns;
		item.properties.height = item.properties.width;		
		return item;		
	});
}

function baseList(items, templates) {
	var demoWin = Titanium.UI.createWindow({
		title : 'ListView',
		backgroundColor : '#fff'
	});
	var section = Ti.UI.createListSection({
		items: items
	});	

	var list = Ti.UI.createListView({
		defaultItemTemplate : "template1",
		sections : [section],
		templates : templates
	});

	demoWin.add(list);
	demoWin.open();
}

function extList() {
	var testData = require('testData').testData, 
		testDataMixed = require('testData').testDataWithMixedTempaltes,
		templates = require('templates').templates();	
		
	var demoWin = Titanium.UI.createWindow({
		title : 'ext ListView',
		backgroundColor : '#fff'
	});	
	
	var sections = [];

	var extListView = require('extListView');
	var section1 = extListView.createListSection({
		items: adjustItemsSize(testData(), 3),
		defaultItemTemplate: "template1",
		columns: 3,
		headerTitle: "Three column"
	});
	sections.push(section1);
		
	var section2 = extListView.createListSection({		
		//items: adjustItemsSize(testDataMixed(), 3),
		defaultItemTemplate: "template1",
		columns: 3,
		headerTitle: "Mixed templates"
	});	
	
	section2.items = adjustItemsSize(testDataMixed(), section2.columns);
	sections.push(section2);
	
	var section3 = extListView.createListSection({
		items: adjustItemsSize(testData(), 2),
		defaultItemTemplate: "template1",
		columns: 2,
		headerTitle: "Two column"
	});
	sections.push(section3);
	
	var section4 = Ti.UI.createListSection({
		items: testDataMixed(),
		headerTitle: "Base section from SDK"
	});
	sections.push(section4);

	var list = extListView.createListView({		
		sections : sections,
		templates : templates,
		defaultItemTemplate: "template1",		
		columns: 3
	});
	
	
	list.addEventListener('itemclick', function(evt) {
		this.fixEvent(evt);
		alert('`itemclick` event:\n'+ JSON.stringify(_.omit(evt, 'source', 'section'), null, '\t'));
	});
	list.addEventListener('scrollend', function(evt) {
		this.fixEvent(evt);
		Ti.API.info('`scrollend` event:\n'+ JSON.stringify(_.omit(evt, 'source', 'firstVisibleSection'), null, '...'));
	});
	
	// ***************************
	// Uncomment lines for testing
	// ***************************
	// test for getItemAt, updateItemAt
	var dataItem = section1.getItemAt(4);	
	dataItem.name.text = 'This title changed!';
	dataItem.name.color = "#ff0000";	
	section1.updateItemAt(4, dataItem);
	// ***************************
	// test for deleteItemsAt
	//section1.deleteItemsAt(1, 2);
	// ***************************
	//test for insertItemsAt
	// section1.insertItemsAt(4, [section1.getItemAt(0)]);
	// ***************************
	//test for replaceItemsAt
	// section1.replaceItemsAt(2, 4, [section1.getItemAt(0)]);
	// ***************************

	demoWin.add(list);
	demoWin.open();
}
exports.openBaseList = baseList;
exports.openExtList = extList;