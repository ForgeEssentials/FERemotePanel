<?php

namespace ForgeEssentials\RemotePanel\Module;

use ForgeEssentials\RemotePanel\RemotePanel;

use ForgeEssentials\Remote\Client;

use Twig_Environment;

class ModuleGraphs extends Module {

	public function getId() {
		return 'graphs';
	}

	public function getData() {
		$data = array();
		$data['capabilities'] = $this->query('query_remote_capabilities', null, false, array('No permission'));
		return $data;
	}

}
