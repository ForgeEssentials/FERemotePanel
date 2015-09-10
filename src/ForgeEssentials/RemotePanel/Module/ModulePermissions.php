<?php

namespace ForgeEssentials\RemotePanel\Module;

class ModulePermissions extends Module {

	public function getId() {
		return 'permissions';
	}

	public function getData() {
		return array('root' => $this->query('query_permissions', null, false, array('No permission')));
	}

	public function postData($data) {
		if (empty($data->id) || empty($data->key) || (empty($data->group) && empty($data->player)))
			throw new \Exception('Missing data');
		
		$query = array(
			'zoneId' => $data->id,
			'permission' => $data->key,
		);
		$query['group'] = isset($data->group) ? $data->group : null;
		$query['user'] = isset($data->player) ? $data->player : null;
		$query['value'] = isset($data->value) ? $data->value : null;
		
		return $this->query('set_permission', $query, false, array('No permission'));
	}

}
