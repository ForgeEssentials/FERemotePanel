define(['app'], function(app) {
	app.service('sidebar', function() {
		var sidebar = this;

		sidebar.items = {};
		sidebar.selected = null;

		sidebar.add = function(element) {
			sidebar.items[element.id] = element;
		};

		sidebar.select = function(id) {
			sidebar.selected = id;
		};

		return this;
	});
});
