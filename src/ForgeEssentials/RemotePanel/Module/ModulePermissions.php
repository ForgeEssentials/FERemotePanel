<?php

namespace ForgeEssentials\RemotePanel\Module;

class ModulePermissions extends Module {

	public function getId() {
		return 'permissions';
	}

	public function getData() {
		return array('root' => $this->query('query_permissions', null, false, array('No permission')));
	}

}
