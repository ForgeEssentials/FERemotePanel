<?php

namespace ForgeEssentials\RemotePanel\Module;

class ModuleDashboard extends Module {

	public function getId() {
		return 'dashboard';
	}

	public function getData() {
		// session_start();
		// $_SESSION['remote_log_timestamp']

		$data = array();
		$data['players'] = $this->query('query_player', array('flags' => array('location', 'detail')), true, array('players' => array()))['players'];
		$data['capabilities'] = $this->query('query_remote_capabilities', null, true, array('handlers' => array('No permission')))['handlers'];
		$data['log'] = $this->query('query_log_server', 12, false, array('No permission'));
		return $data;
	}

}
