define(['app'], function(app) {

	var module = {
		id : 'map',
		order : 5,
		label : 'Map',
		interval : 1 * 1000,
		neededCapabilities : ['mapper.query.region'],
		data : {},
	};

	module.controller = ['$scope',
	function($scope) {
		$scope.data = module.data;
		module.scope = $scope;

		var map = L.map('map', {
			zoom : 0,
			center : new L.LatLng(0, 0),
			zoomAnimation : true,
			attributionControl : false,
			continuousWorld : true,
			worldCopyJump : false,
			crs : L.extend({}, L.CRS.EPSG3857, {
				projection : {
					project : function(latlng) {
						return new L.Point(latlng.lat, latlng.lng);
					},
					unproject : function(point) {
						return new L.LatLng(point.x, point.y);
					}
				},
				code : 'simple',
				transformation : new L.Transformation(1, 0, 1, 0),
				scale : function(zoom) {
					return (1 << zoom); // Equivalent to 2 raised to the power of zoom
				}
			}),
		});
		//map.setView([0, 0], 0);

		L.tileLayer('module/map/data?dim={id}&x={x}&z={y}', {// &zoom={z}
			attribution : 'Map data &copy; FE',
			continuousWorld : true,
			minZoom : 0,
			maxZoom : 6,
			maxNativeZoom : 0,
			noWrap : true,
			id : '0',
			//zoomReverse : true,
		}).addTo(map);
	}];

	app.registerModule(module);

});
