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

	app.filter('toArray', function() {
		return function(obj, addKey) {
			if (!angular.isObject(obj))
				return obj;
			if (addKey === false) {
				return Object.keys(obj).map(function(key) {
					return obj[key];
				});
			} else {
				var result = Object.keys(obj).map(function(key) {
					var value = obj[key];
					return angular.isObject(value) ? Object.defineProperty(value, '$key', {
						enumerable : false,
						value : key
					}) : {
						$key : key,
						$value : value
					};
				});
				return result;
			}
		};
	});

	app.filter('orderObjectBy', function() {
		return function(items, field, reverse) {
			var filtered = [];
			angular.forEach(items, function(item, key) {
				item.$key = key;
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

	app.filter('unsafe', ['$sce',
	function($sce) {
		return $sce.trustAsHtml;
	}]);

});
