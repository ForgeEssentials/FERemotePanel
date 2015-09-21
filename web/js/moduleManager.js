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
		};

		function handleResponse(data) {
			$rootScope.lastError = (data.error && data.error != 'no permission') ? data.error : null;
			if (data.needsAuthentication) {
				$rootScope.needsAuthentication = true;
				if (!openendAuthPopup) {
					openendAuthPopup = true;
					app.loginPopup.modal();
				}
			}
			if (data.hasOwnProperty('loggedIn'))
				$rootScope.loggedIn = data.loggedIn;
		};

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
				
			$('#header-collapse').collapse('hide');

			activeModule = module;
			$rootScope.needsAuthentication = false;
			$rootScope.lastError = null;
			sidebar.select(id);
			manager.update(activeModule);
			// if (activeModule.interval && activeModule.interval > 0)
			//	timer = setTimeout(manager.update, activeModule.interval, activeModule);
		};

		manager.request = function(request, successCallback, errorCallback) {
			$http(request).then(function(response) {
				handleResponse(response.data);
				if (response.data.error) {
					if (errorCallback)
						errorCallback(response.data.error);
				} else {
					if (successCallback)
						successCallback(response.data);
				}
			}, function(response) {
				$rootScope.lastError = response.statusText;
				if (errorCallback)
					errorCallback(response.statusText);
			});
		};

		manager.get = function(url, data, successCallback, errorCallback) {
			manager.request({
				url : url,
				params : data,
			}, successCallback, errorCallback);
		};

		manager.post = function(url, data, successCallback, errorCallback) {
			manager.request({
				method : 'POST',
				url : url,
				data : data,
			}, successCallback, errorCallback);
		};

		manager.forceUpdate = function() {
			clearTimeout(timer);
			if (activeModule.interval && activeModule.interval > 0)
				timer = setTimeout(manager.update, 50, activeModule);
		};

		manager.update = function(module) {
			if (!module.interval || module.interval <= 0)
				return;
			var url = 'module/' + module.id + '/data';
			var data = {
				t : module.lastTimestamp
			};
			manager.get(url, data, function(data) {
				startUpdateTimer();
				module.lastTimestamp = data.timestamp;
				if (data) {
					if (module.update)
						module.update(data);
					else
						angular.extend(module.data, data);
				}
			}, function(error) {
				startUpdateTimer();
			});
		};

	}];

	app.service('moduleManager', ModuleManager);

	return ModuleManager;
});
