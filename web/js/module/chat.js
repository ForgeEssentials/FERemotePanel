define(['app'], function(app) {

	var module = {
		id : 'chat',
		order : 1,
		label : 'Chat',
		interval : 1000,
		neededCapabilities : ['query_chat'],
		data : {
			chat : {},
			chatlines : 'Loading... Please wait',
		}
	};

	module.controller = ['$scope', 'moduleManager',
	function($scope, moduleManager) {
		$scope.data = module.data;
		module.scope = $scope;
		this.sendMessage = function(msg) {
			moduleManager.post('module/chat/data', {
				message : msg,
			}, function(data) {
				if (data.messages) {
					angular.merge(module.data.chat, data.messages);
					module.data.chatlines = '';
					forEachSorted(module.data.chat, function(e) {
						module.data.chatlines += e + '<br>';
					});
				}
			});
			moduleManager.forceUpdate();
		};
	}];

	module.update = function(data) {
		angular.merge(module.data.chat, data.chat);

		module.data.chatlines = '';
		forEachSorted(module.data.chat, function(e) {
			module.data.chatlines += e + '<br>';
		});

		var el = document.getElementById("chatlog");
		el.scrollTop = el.scrollHeight;
	};

	app.registerModule(module);

	function forEachSorted(obj, worker) {
		var keys = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key))
				keys.push(key);
		}
		keys.sort();
		for (var i = 0; i < keys.length; i++) {
			worker(obj[keys[i]]);
		}
	};

});
