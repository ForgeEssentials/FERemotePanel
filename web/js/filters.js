define(['app'], function(app) {

	app.filter('join', function() {
		return function(array) {
			return array.join(', ');
		};
	});

	app.filter('ifUndefined', function() {
		return function(input, defaultValue) {
			if (angular.isUndefined(input) || input === null)
				return defaultValue;
			return input;
		};
	});

	app.filter('orderObjectBy', function() {
		return function(items, field, reverse) {
			var filtered = [];
			angular.forEach(items, function(item) {
				filtered.push(item);
			});
			filtered.sort(function(a, b) {
				if (a[field] == undefined)
					return 1;
				if (b[field] == undefined)
					return -1;
				return (a[field] > b[field] ? 1 : -1);
			});
			if (reverse)
				filtered.reverse();
			return filtered;
		};
	});

});
