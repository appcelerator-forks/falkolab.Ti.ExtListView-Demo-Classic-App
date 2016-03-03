exports.testData = function() {
	return [{
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/2918581?v=3"
		},
		"name" : {
			"text" : "bootstrap"
		},
		"index" : {
			"text" : 0
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		}
	}, {
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/9892522?v=3"
		},
		"name" : {
			"text" : "FreeCodeCamp"
		},
		"index" : {
			"text" : 1
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		}
	}, {
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/2022803?v=3"
		},
		"name" : {
			"text" : "free-programming-books"
		},
		"index" : {
			"text" : 2
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		}
	}, {
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/139426?v=3"
		},
		"name" : {
			"text" : "angular.js"
		},
		"index" : {
			"text" : 3
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		}
	}, {
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/230541?v=3"
		},
		"name" : {
			"text" : "d3"
		},
		"index" : {
			"text" : 4
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		}
	}, {
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/1505683?v=3"
		},
		"name" : {
			"text" : "Font-Awesome"
		},
		"index" : {
			"text" : 5
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		}
	}
	];
};

exports.testDataWithMixedTempaltes = function() {
	return [{
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/2918581?v=3"
		},
		"name" : {
			"text" : "bootstrap"
		},
		"index" : {
			"text" : 0
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		}
	}, {
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/9892522?v=3"
		},
		"name" : {
			"text" : "FreeCodeCamp"
		},
		"index" : {
			"text" : 1
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		},
		"template" : "template2"
	}, {
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/2022803?v=3"
		},
		"name" : {
			"text" : "free-programming-books"
		},
		"index" : {
			"text" : 2
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		}
	}, {
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/139426?v=3"
		},
		"name" : {
			"text" : "angular.js"
		},
		"index" : {
			"text" : 3
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		},
		"template" : "template2"
	}, {
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/230541?v=3"
		},
		"name" : {
			"text" : "d3"
		},
		"index" : {
			"text" : 4
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		}
	}, {
		"avatar" : {
			"image" : "https://avatars.githubusercontent.com/u/1505683?v=3"
		},
		"name" : {
			"text" : "Font-Awesome"
		},
		"index" : {
			"text" : 5
		},
		"properties" : {
			"height" : 150,
			"width" : 150
		},
		"template" : "template2"
	}];
};

/*
 var url = "https://api.github.com/search/repositories?q=pushed:>2015-09-01&order=desc";

 var client = Ti.Network.createHTTPClient({
 onload : function(e) {
 var reps = JSON.parse(this.responseText);
 openTestWin(transform(reps.items));
 transform(reps.items).forEach(function(item) {
 Ti.API.info(JSON.stringify(item));
 });
 },
 timeout : 5000
 });

 client.open("GET", url);
 client.send();
 */