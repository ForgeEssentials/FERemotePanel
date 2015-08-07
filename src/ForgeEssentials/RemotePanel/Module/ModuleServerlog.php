<?php

namespace ForgeEssentials\RemotePanel\Module;

class ModuleServerlog extends Module {

	public function getId() {
		return 'serverlog';
	}

	public function getData() {
		// TODO: Get only serverlog since last request!
		return array('log' => $this->query('query_log_server', 60, false, array('No permission')));
	}

}
