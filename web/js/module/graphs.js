define(['app'], function(app) {

	var module = {
		id : 'graphs',
		order : 1,
		label : 'Graphs',
		interval : 60000,
		data : { },
		controller : ['$scope', function($scope) {
			$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
			$scope.series = ['Series A', 'Series B'];
			$scope.data = [[65, 59, 80, 81, 56, 55, 40], [28, 48, 40, 19, 86, 27, 90]];
		}],
	};

	//module.update = function(data) {
	//	angular.extend(module.data, data);
	//};

	//module.controller = ['$scope', function($scope) {
	//	$scope.data = module.data;
	//}];

	app.registerModule(module);

});
