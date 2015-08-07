/* override angular import */
define('angular', [], function() {
	return angular;
});
require.config({
	baseUrl : 'js',
	paths : {
		jquery : 'lib/jquery/jquery-2.1.4.min',
		chart : 'lib/chart/Chart.min',
		angularchart : 'lib/angular-chart/angular-chart',
	},
	deps : ['app', 'filters', 'sidebar', 'moduleManager'/*, 'chart', 'angularchart'*/].concat(moduleDependencies),
	callback : function(app) {
		angular.bootstrap(document, ['app']);
	},
});