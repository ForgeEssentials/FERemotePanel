define(['app'], function(app) {

	var module = {
		id : 'permissions',
		order : 10,
		label : 'Permissions',
		interval : 60000,
		data : {
			permissions : {},
		},
	};

	app.directive('groupPerms', function() {
		return {
			restrict : 'A',
			replace : 'true',
			template : '<li class="glyphicon" ng-class="data.zone == permZone && data.group != null ? \'glyphicon-menu-down\' : \'glyphicon-menu-right\'"> ' + //
			'    <a href="#" ng-click="data.zone = permZone; selectGroup(false)">Groups</a>' + //
			'    <ul ng-show="data.zone == permZone && data.group != null">' + //
			'        <li ng-repeat="(name, perms) in permZone.groupPermissions | orderBy: \'name\'" ' + //
			'                class="glyphicon" ng-class="data.group == name ? \'glyphicon-menu-down\' : \'glyphicon-menu-right\'">' + //
			'            <a href="#" ng-click="selectGroup(name)" ng-class="{active: data.group == name}" ng-bind="name"></a>' + //
			'            <ul ng-show="data.group == name">' + //
			'                <li ng-repeat="(key, value) in perms | orderBy: \'key\'">' + //
			'                    <a class="btn btn-xs btn-danger" href="#">-</a>' + //
			'                    {{ key }} = {{ value }}' + //
			'                </li>' + //
			'            </ul>' + //
			'        </li>' + //
			'    </ul>' + //
			'</li>',
			scope : {
				permZone : '=groupPerms'
			},
			link : function(scope, element, attrs) {
				scope.data = module.data;
				scope.selectGroup = function(group) {
					module.data.group = (module.data.group != null && group == false) ? null : group;
					module.data.player = null;
				};
			},
		};
	});

	app.directive('playerPerms', function() {
		return {
			restrict : 'A',
			replace : 'true',
			template : '<li class="glyphicon" ng-class="data.zone == permZone && data.player != null ? \'glyphicon-menu-down\' : \'glyphicon-menu-right\'"> ' + //
			'    <a href="#" ng-click="data.zone = permZone; selectPlayer(false)">Players</a>' + //
			'    <ul ng-show="data.zone == permZone && data.player != null">' + //
			'        <li ng-repeat="(name, perms) in permZone.playerPermissions | orderBy: \'name\'" ' + //
			'                class="glyphicon" ng-class="data.player == name ? \'glyphicon-menu-down\' : \'glyphicon-menu-right\'">' + //
			'            <a href="#" ng-click="selectPlayer(name)" ng-class="{active: data.player == name}" ng-bind="name"></a>' + //
			'            <ul ng-show="data.player == name">' + //
			'                <li ng-repeat="(key, value) in perms | orderBy: \'key\'">' + //
			'                    {{ key }} = {{ value }}' + //
			'                    <a class="btn btn-sm btn-warning" href="#"><span class="glyphicon glyphicon-minus"></span></a>' + //
			'                </li>' + //
			'            </ul>' + //
			'        </li>' + //
			'    </ul>' + //
			'</li>',
			scope : {
				permZone : '=playerPerms'
			},
			link : function(scope, element, attrs) {
				scope.data = module.data;
				scope.selectPlayer = function(player) {
					module.data.player = (module.data.player != null && player == false) ? null : player;
					module.data.group = null;
				};
			},
		};
	});

	module.controller = ['$scope', 'moduleManager',
	function($scope, moduleManager) {
		$scope.data = module.data;
		module.scope = $scope;

		this.selectWorld = function(world) {
			if (module.data.worldZone == world)
				world = null;
			module.data.zone = world;
			module.data.worldZone = world;
			module.data.group = null;
			module.data.player = null;
		};

		this.selectArea = function(area) {
			if (module.data.zone == area)
				world = null;
			module.data.zone = area;
			module.data.group = null;
			module.data.player = null;
		};

		this.selectGroup = function(group) {
			module.data.group = (module.data.group != null && group == false) ? null : group;
			module.data.player = null;
		};

		this.selectPlayer = function(player) {
			module.data.player = (module.data.player != null && player == false) ? null : player;
			module.data.group = null;
		};

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
		angular.extend(module.data, data);
		// TODO: Reassign data.zone from data.root.XX
	};

	app.registerModule(module);

});
