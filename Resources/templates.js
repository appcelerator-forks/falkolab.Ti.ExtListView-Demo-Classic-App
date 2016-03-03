exports.templates = function() {	
 	return {
		'template1' : {
			properties : {
				name : "template1"
			},
			childTemplates : [{
				type : "Ti.UI.View",				
				properties : {
					height : Ti.UI.Fill,
					width : Ti.UI.Fill
				},
				childTemplates : [{
					type : "Ti.UI.ImageView",
					bindId : "avatar",
					properties : {
						bindId : "avatar",
						width : Titanium.UI.FILL,
						height : Titanium.UI.FILL
					}
				}, {
					type : "Ti.UI.View",										
					childTemplates : [{
						type : "Ti.UI.Label",
						bindId : "name",
						properties : {
							left : 4,
							top : 4,
							right : 4,
							bottom : 4,
							font : {
								fontSize : 11
							},
							bindId : "name",
							color : "#000"
						}
					}],
					properties : {
						opacity : .8,
						backgroundColor : "#ffffff",
						left : 5,
						top : 5,
						right : 5,
						width : Titanium.UI.SIZE,
						height : Titanium.UI.SIZE
					}
				}, {
					type : "Ti.UI.Label",
					bindId : "index",
					properties : {
						right : 5,
						bottom : 5,
						font : {
							fontSize : 10
						},
						color : "#4c4c4c",
						backgroundColor : "#ffffff",
						bindId : "index"
					}
				}]
			}]
		},
		
		'template2' : {
			properties : {
				name : "template2"
			},
			childTemplates : [{
				type : "Ti.UI.View",
				properties : {
					height : Ti.UI.FILL,
					width : Ti.UI.FILL
				},
				childTemplates : [{
					type : "Ti.UI.ImageView",
					bindId : "avatar",
					properties : {
						bindId : "avatar",
						width : 50,
						height : 50,
						right: 0,
						bottom: 0
					}
				}, {
					type : "Ti.UI.View",					
					childTemplates : [{
						type : "Ti.UI.Label",
						bindId : "name",
						properties : {
							left : 4,
							top : 4,
							right : 4,
							bottom : 4,
							font : {
								fontSize : 18,
								fontWeight: 'bold'
							},
							bindId : "name",
							color : "#000"
						}
					}],
					properties : {
						opacity : .8,
						backgroundColor : "#ffffff",
						left : 5,
						top : 5,
						right : 5,
						width : Titanium.UI.SIZE,
						height : Titanium.UI.SIZE
					}
				}, {
					type : "Ti.UI.Label",
					bindId : "index",
					properties : {
						right : 5,
						bottom : 5,
						font : {
							fontSize : 10
						},
						color : "#4c4c4c",
						backgroundColor : "#ffffff",
						bindId : "index"
					}
				}]
			}]
		}
	};
};