define(['app'], function(app) {

	var MAX_GRAPH_WIDTH = 800;
	var DATA_INTERVAL = 4;

	var module = {
		id : 'graphs',
		order : 1,
		label : 'Graphs',
		interval : 5000
	};

	function Graph(label, type, color, unit) {
		return {
			label : label,
			data : [{
				x : new Date(new Date().getTime() - 60 * 1000),
				y : 0
			}, {
				x : new Date(),
				y : 0
			}],
			options : {
				drawLegend : false,
				axes : {
					x : {
						type : "date",
						ticksFormatter : function(v) {
							return module.filter('date')(v, 'mm');
						}
					},
					y : !unit ? {} : {
						ticksFormatter : function(v) {
							return v + " " + unit;
						}
					},
				},
				series : [{
					y : "y",
					label : label,
					color : color,
					type : type,
					drawDots : false
				}],
				tooltip : {
					formatter : function(x, y, series) {
						return module.filter('date')(x, 'hh:mm:ss') + " - " + ( unit ? y + unit : y);
					}
				}
			}
		};
	}


	module.data = {
		stats : {
			ram : Graph("Ram Usage", "area", "#ff0000", " MB"),
			playercount : Graph("Players", "area", "#aaaa00"),
		}
	};

	module.update = function(data) {
		var now = new Date().getTime();
		for (var stat in data.stats) {
			if (!data.stats.hasOwnProperty(stat))
				continue;
			var graph = data.stats[stat],
			    count = graph.data.length;
			var step = Math.ceil(count / (MAX_GRAPH_WIDTH / DATA_INTERVAL));
			var newData = [];
			for (var i = 0; i < count; i += step) {
				newData.push({
					x : new Date(now - (count - i) * graph.interval * 1000),
					y : graph.data[i]
				});
			}
			module.data.stats[stat].data = newData;
		}
		// angular.extend(module.data, data);
	};

	module.controller = ['$scope', '$filter', function($scope, $filter) {
		$scope.data = module.data;
		module.filter = $filter;
	}];

	app.registerModule(module);

});
