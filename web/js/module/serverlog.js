define(['app'], function(app) {

	var module = {
		id : 'serverlog',
		order : 5,
		label : 'Logs',
		interval : 1000,
		data : {
			log : ['Loading... Please wait'],
		},
	}; 
	
	module.controller = ['$scope', 'moduleManager',
	function($scope, moduleManager) {
		$scope.data = module.data;
		module.scope = $scope;
		this.sendCommand = function(command) {
			moduleManager.post('module/chat/data', {
				message : "/" + command,
			}, function(data) {
				/*if (data.messages) {
					angular.merge(module.data.chat, data.messages);
					module.data.chatlines = '';
					forEachSorted(module.data.chat, function(e) {
						module.data.chatlines += e + '<br>';
					});
				}*/
			});
			moduleManager.forceUpdate();
		};
	}];

	module.update = function(data) {
		// TODO: APPEND serverlog instead of replacing it!
		angular.extend(module.data, data);
		var el = document.getElementById("serverlog");
		el.scrollTop = el.scrollHeight;
	};

	app.registerModule(module);

});
