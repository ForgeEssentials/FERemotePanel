define(['app'], function(app) {

	var module = {
		id : 'serverlog',
		order : 2,
		label : 'Logs',
		interval : 1000,
		data : {
			log : ['Loading... Please wait'],
		},
	}; 

	module.update = function(data) {
		// TODO: APPEND serverlog instead of replacing it!
		angular.extend(module.data, data);
		var el = document.getElementById("serverlog_log");
		el.scrollTop = el.scrollHeight;
	};

	app.registerModule(module);

});
