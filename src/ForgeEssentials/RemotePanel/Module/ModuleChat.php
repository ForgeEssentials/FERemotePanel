<?php

namespace ForgeEssentials\RemotePanel\Module;

class ModuleChat extends Module {

	public function getId() {
		return 'chat';
	}

	public function getData() {
		$data = array();
		$data['chat'] = $this->query('query_chat', array(
			'timestamp' => $this->panel->getTimestamp(),
			'format' => 'html'
		), false, array('No permission'));
		return $data;
	}

	public function postData($data) {
		if (!isset($data->message))
			throw new \Exception('Missing message');
		return $this->query('chat', $data->message);
	}

}
