define(['app'], function(app) {

	var module = {
		id : 'playerlogger',
		order : 0,
		label : 'Playerlogger',
		interval : 10000,
		neededCapabilities : ['pl.log.blocks', 'pl.log.commands'],
		data : {
			players : {},
		},
	};

	module.controller = ['$scope', function($scope) {
		$scope.data = module.data;
		module.scope = $scope;
		
		module.scope.actionTypes = {
			1: "Block",
			2: "Command",
		};
	}];

	app.registerModule(module);
});
