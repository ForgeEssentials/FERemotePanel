<?php

namespace ForgeEssentials\RemotePanel\Module;

use ForgeEssentials\RemotePanel\RemotePanel;

class ModuleGraphs extends Module {

	public function getId() {
		return 'graphs';
	}

	public function getData() {
		$data = array();
		$data['availableStats'] = $this->query('query_stats', null, false, array());
		$data['stats'] = $this->query('query_stats', array('graphs' => $data['availableStats']), false, array());
		return $data;
	}

}
