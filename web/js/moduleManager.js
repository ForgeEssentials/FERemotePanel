define(['app'], function(app) {
	var ModuleManager = ['$rootScope', '$http', '$location', 'sidebar',
	function($rootScope, $http, $location, sidebar) {
		var manager = this;
		var timer;
		var activeModule;
		var openendAuthPopup = false;
		this.modules = [];

		function startUpdateTimer() {
			if (activeModule.interval && activeModule.interval > 0)
				timer = setTimeout(manager.update, activeModule.interval, activeModule);
		}


		manager.add = function(module) {
			sidebar.add(module);
			this.modules[module.id] = module;
		};

		manager.setModule = function(id) {
			var module = this.modules[id];
			if (!module)
				return false;

			if (activeModule)
				clearTimeout(timer);

			activeModule = module;
			// openendAuthPopup = false;
			$rootScope.lastError = null;
			sidebar.select(id);
			manager.update(activeModule);
			// if (activeModule.interval && activeModule.interval > 0)
			//	timer = setTimeout(manager.update, activeModule.interval, activeModule);
		};

		manager.update = function(module) {
			if (!module.interval || module.interval <= 0)
				return;
			// TODO: Change to use base URL + module.id instead
			$url = $location.absUrl() + '/data';
			$http.get($url).then(function(response) {
				startUpdateTimer();

				var data = response.data;

				$rootScope.lastError = data.error ? data.error : null;
				if (data.needsAuthentication) {
					$rootScope.lastError = 'You need to log in to access all data';
					if (!openendAuthPopup) {
						openendAuthPopup = true;
						app.loginPopup.modal();
					}
				}

				if (data.hasOwnProperty('loggedIn'))
					$rootScope.loggedIn = data.loggedIn;

				if (data.error)
					return;
					
				if (module.update)
					module.update(data);
				else
					angular.extend(module.data, data);
			}, function(response) {
				startUpdateTimer();
				$rootScope.lastError = response.statusText;
			});
		};

	}];
	app.service('moduleManager', ModuleManager);
	return ModuleManager;
});
