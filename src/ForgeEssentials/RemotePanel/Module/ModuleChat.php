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
		$message = $data->message;

		if ($message[0] == '/') {
			$this->post('command', substr($data->message, 1));
			try {
				$messages = array();
				while (true) {
					$remote = $this->panel->getRemoteClient();
					$remote->setTimeout(1);
					$response = $remote->waitForResponse();
					if ($response->id == 'command' && $response->rid == $remote->getLastRid()) {
						$t = $response->timestamp;
						$this->panel->handleRemoteResponse($response);
						break;
					}
					if ($response->id == 'chat') {
						$t = $response->data->timestamp;
						while (array_key_exists(strval($t), $messages))
							$t++;
						$messages[strval($t++)] = $response->data->message;
					}
				}
			} catch (\ForgeEssentials\Remote\SocketException $e) {
				/* do nothing */
			} catch (\Exception $e) {
				$messages[strval($t)] = '<span class="mcfc">' . $e->getMessage() . '</span>';
			}
			return array('messages' => $messages);
		} else {
			return $this->query('chat', $data->message);
		}
	}

}
