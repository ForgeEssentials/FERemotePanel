<?php

namespace ForgeEssentials\RemotePanel\Module;

class ModulePlayerlogger extends Module {

	public function getId() {
		return 'playerlogger';
	}

	public function getData() {
		$query = $this->query('pl.log', array(/* 'flags' => array('location', 'detail') */), true, array());
		$data = array();
		$data['worlds'] = isset($query['worlds']) ? $query['worlds'] : array();
		$data['players'] = isset($query['players']) ? $query['players'] : array();
		$data['blocks'] = isset($query['blocks']) ? $query['blocks'] : array();
		$data['actions'] = $query['result'];
		return $data;
	}

}
