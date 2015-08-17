define(['n3'], function() {
	var app = angular.module('app', ['ngRoute', 'n3-line-chart']);

	//------------------------------------------------------------
	
	app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$routeProvider.otherwise({
			redirectTo : 'module/dashboard',
		});
	}]);

	app.run(['$rootScope', 'sidebar', 'moduleManager', function($rootScope, sidebar, moduleManager) {
		$rootScope.sidebar = sidebar;
		$rootScope.$on('$routeChangeSuccess', function(event, route) {
			if (route.moduleId)
				moduleManager.setModule(route.moduleId);
		});
	}]);

	app.registerModule = function(module) {
		app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
			$routeProvider.when('/module/' + module.id, {
				moduleId : module.id,
				templateUrl : 'module/' + module.id + '/view',
				controller : 'module_' + module.id,
				controllerAs : 'module',
			});
		}]); 

		
		app.run(['moduleManager', function(moduleManager) {
			moduleManager.add(module);
		}]);
		
		if (!module.controller) {
			module.controller = ['$scope', function($scope) {
				$scope.data = module.data;
				module.scope = $scope;
			}];
		}
		app.controller('module_' + module.id, module.controller);
	};

	//------------------------------------------------------------

	return app;
});
