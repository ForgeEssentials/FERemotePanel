define(['app'], function(app) {

	var module = {
		id : 'dashboard',
		order : 0,
		label : 'Dashboard',
		interval : 1000,
		data : {
			capabilities : ['Loading... Please wait'],
			log : ['Loading... Please wait'],
		},
	}; 

	//module.update = function(data) {
	//	angular.extend(module.data, data);
	//};

	//module.controller = ['$scope', function($scope) {
	//	$scope.data = module.data;
	//}];

	app.registerModule(module);

});
