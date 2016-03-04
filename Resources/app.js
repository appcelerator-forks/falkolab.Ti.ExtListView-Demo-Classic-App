Titanium.UI.setBackgroundColor('#000');
var _ = require('underscore');

function transform(items) {
	var result = [];
	for(var i=0, l=items.length; i<l; i++) {
		var item = items[i];
		result.push({
			avatar: {
				image: item.owner.avatar_url
			},
			name: {
				text: item.name
			},
			index: {
				text: i
			},
			properties: {height:100, width:100}
		});
	}	
	return result;
}

var win1 = Titanium.UI.createWindow({
	title : 'ListView test',
	backgroundColor : '#fff'		
});

var container = Ti.UI.createView({
	layout: "vertical",
	height: Ti.UI.SIZE
});

var button1 = Ti.UI.createButton({
	title : 'Open base list'
});

button1.addEventListener('click', function() {
	require('listRunner').openBaseList(
		require('testData').testData(), 
		require('templates').templates()
	);
});

container.add(button1);

var button2 = Ti.UI.createButton({
	title : 'Open ext list'
});

button2.addEventListener('click', function() {
	require('listRunner').openExtList();
});

container.add(button2);
win1.add(container);


win1.open();


//require('listRunner').openExtList();