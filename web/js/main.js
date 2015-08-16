/* override angular import */
define('angular', [], function() {
	return angular;
});
require.config({
	baseUrl : 'js',
	paths : {
		lib : '../lib',
		jquery : '../lib/jquery/jquery-2.1.4.min',
		chart : '../lib/chart/Chart.min',
		angularchart : '../lib/angular-chart/angular-chart',
		n3 : '../lib/n3-line-chart/line-chart',
	},
	deps : ['app', 'filters', 'sidebar', 'moduleManager', 'chart', 'angularchart', '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js'].concat(moduleDependencies),
	callback : function(app) {
		angular.bootstrap(document, ['app']);
	},
}); 