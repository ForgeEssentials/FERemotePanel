/* override angular import */
define('angular', [], function() {
	return angular;
});
require.config({
	baseUrl : 'js',
	paths : {
		lib : '../lib',
		jquery : '../lib/jquery/jquery-2.1.4.min',
		n3 : '../lib/n3-line-chart/line-chart',
		d3 : '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min',
		leaflet : '../lib/leaflet/leaflet',
	},
	deps : ['app', 'filters', 'sidebar', 'moduleManager', 'd3', 'leaflet'].concat(moduleDependencies),
	callback : function(app) {
		angular.bootstrap(document, ['app']);
	},
});
