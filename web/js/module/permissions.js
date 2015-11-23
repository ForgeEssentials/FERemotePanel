define(['app'], function(app) {

	var module = {
		id : 'permissions',
		order : 10,
		label : 'Permissions',
		interval : 60000,
		neededCapabilities : ['query_permissions'],
		data : {
			permissions : {},
		},
	};

	app.directive('groupPerms', function() {
		return {
			restrict : 'A',
			replace : 'true',
			template : '<li class="node" ng-class="{active: expanded}"> ' + //
			'    <a href="#" ng-click="expanded = !expanded">Groups</a>' + //
			'    <ul>' + //
			'        <li class="node" ng-repeat="(name, perms) in zone.groupPermissions | orderBy: \'name\'" ng-class="{active: nodeExpanded}" ng-init="nodeExpanded = false">' + //
			'            <a href="#" ng-click="nodeExpanded = !nodeExpanded" ng-bind="name"></a>' + //
			'            <ul>' + //
			'                <a class="btn btn-xs btn-success" href="#" ng-click="editGroupPerm(name)">Add permission</a></li>' + //
			'                <li ng-repeat="(key, value) in perms">' + //
			'                    <a class="btn btn-xs btn-danger" href="#" ng-click="deleteGroupPerm(name, key)">-</a>' + //
			'                    <a href="#" ng-click="editGroupPerm(name, key, value)">{{ key }} = {{ value }}</a>' + //
			'                </li>' + //
			'            </ul>' + //
			'        </li>' + //
			'    </ul>' + //
			'</li>',
			scope : {
				zone : '=groupPerms'
			},
			link : function(scope, element, attrs) {
				scope.editGroupPerm = function(name, key, value) {
					module.editGroupPerm(scope.zone, name, key, value);
				};
				scope.deleteGroupPerm = function(name, key) {
					module.deleteGroupPerm(scope.zone, name, key);
				};
			},
		};
	});

	app.directive('playerPerms', function() {
		return {
			restrict : 'A',
			replace : 'true',
			template : '<li class="node" ng-class="{active: expanded}"> ' + //
			'    <a href="#" ng-click="expanded = !expanded">Players</a>' + //
			'    <ul>' + //
			'        <li class="node" ng-repeat="(name, perms) in zone.playerPermissions | orderBy: \'name\'" ng-class="{active: nodeExpanded}" ng-init="nodeExpanded = false">' + //
			'            <a href="#" ng-click="nodeExpanded = !nodeExpanded" ng-bind="name"></a>' + //
			'            <ul>' + //
			'                <a class="btn btn-xs btn-success" href="#" ng-click="editPlayerPerm(name)">Add permission</a></li>' + //
			'                <li ng-repeat="(key, value) in perms | orderBy: \'key\'">' + //
			'                    <a class="btn btn-xs btn-danger" href="#" ng-click="deletePlayerPerm(name, key)">-</a>' + //
			'                    <a href="#" ng-click="editPlayerPerm(name, key, value)">{{ key }} = {{ value }}</a>' + //
			'                </li>' + //
			'            </ul>' + //
			'        </li>' + //
			'    </ul>' + //
			'</li>',
			scope : {
				zone : '=playerPerms'
			},
			link : function(scope, element, attrs) {
				scope.editPlayerPerm = function(name, key, value) {
					module.editPlayerPerm(scope.zone, name, key, value);
				};
				scope.deletePlayerPerm = function(name, key) {
					module.deletePlayerPerm(scope.zone, name, key);
				};
			},
		};
	});

	module.controller = ['$scope', '$q', 'moduleManager',
	function($scope, $q, moduleManager) {
		$scope.data = module.data;
		module.scope = $scope;
		
		this.refresh = function() {
			moduleManager.forceUpdate();
		};

		$scope.tmp = {};
		var permPromise;
		this.submit = function() {
			if (permPromise) {
				permPromise.resolve({
					key: $scope.tmp.key,
					value: $scope.tmp.value,
				});
				permPromise = null;
			}
		};
		module.permPopup = function(key, value, callback) {
			permPromise = $q.defer();
			$scope.tmp.key = key;
			$scope.tmp.value = value;
			$('#perm-popup').modal();
			return permPromise.promise;
		};

		module.editGroupPerm = function(zone, name, key, value) {
			module.permPopup(key, value).then(function(data) {
				zone.groupPermissions[name][data.key] = data.value;
				moduleManager.post('module/permissions/data', {
					id : zone.id,
					group : name,
					key : data.key,
					value : data.value,
				}, function(data) {
					// OK!
				});
				moduleManager.forceUpdate();
			});
		};
		module.editPlayerPerm = function(zone, name, key, value) {
			module.permPopup(key, value).then(function(data) {
				zone.playerPermissions[name][data.key] = data.value;
				moduleManager.post('module/permissions/data', {
					id : zone.id,
					player : name,
					key : data.key,
					value : data.value,
				}, function(data) {
					// OK!
				});
				moduleManager.forceUpdate();
			});
		};
		module.deleteGroupPerm = function(zone, name, key) {
			delete zone.groupPermissions[name][key];
			moduleManager.post('module/permissions/data', {
				id : zone.id,
				group : name,
				key : key,
				value : null,
			}, function(data) {
				// OK!
			});
			moduleManager.forceUpdate();
		};
		module.deletePlayerPerm = function(zone, name, key) {
			delete zone.playerPermissions[name][key];
			moduleManager.post('module/permissions/data', {
				id : zone.id,
				player : name,
				key : key,
				value : null,
			}, function(data) {
				// OK!
			});
			moduleManager.forceUpdate();
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

		$('#perm-popup').on('hide.bs.modal', function() {
			$scope.$apply(function() {

			});
		});
	}];

	module.update = function(data) {
		angular.extend(module.data, data);
		// TODO: Reassign data.zone from data.root.XX
	};

	app.registerModule(module);

});
