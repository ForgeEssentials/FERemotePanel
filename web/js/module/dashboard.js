define(['app'], function(app) {

	var module = {
		id : 'dashboard',
		order : 0,
		label : 'Dashboard',
		interval : 1000,
		data : {
			players : {},
			capabilities : ['Loading... Please wait'],
			log : ['Loading... Please wait'],
		},
	};

	//module.controller = ['$scope', function($scope) {
	//	$scope.data = module.data;
	//}];

	app.registerModule(module);
});
