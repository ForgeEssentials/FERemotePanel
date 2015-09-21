<?php

namespace ForgeEssentials\RemotePanel\Module;

class ModuleMap extends Module {

	public function getId() {
		return 'map';
	}

	public function getData() {
		if (isset($_REQUEST['dim']) && isset($_REQUEST['x']) && isset($_REQUEST['z'])) {
			$args = array(
				'dim' => $_REQUEST['dim'],
				'x' => $_REQUEST['x'],
				'z' => $_REQUEST['z'],
			);
			$data = $this->query('mapper.query.region', $args, false, array());
			header('Content-Type: image/png');
			echo base64_decode($data);
			exit ;
		}

		$data = array();
		// TODO: Return worlds, players, areas, whatever
		return $data;
	}

}
