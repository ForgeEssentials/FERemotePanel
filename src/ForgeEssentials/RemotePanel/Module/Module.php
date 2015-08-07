<?php

namespace ForgeEssentials\RemotePanel\Module;

use ForgeEssentials\RemotePanel\RemotePanel;

use ForgeEssentials\Remote\Client;

use Twig_Environment;

abstract class Module {

	/**
	 * @var RemotePanel
	 */
	protected $panel;

	public function __construct($panel) {
		$this->panel = $panel;
	}

	public abstract function getId();

	public abstract function getData();

	public function render(Twig_Environment $twig) {
		return $this->panel->getTwig()->render('module/' . $this->getId() . '.html.twig', array('module' => $this));
	}

	public function query($id, $data = null, $assoc = false, $defaultValue = null) {
		try {
			$response = $this->getRemoteClient()->query($id, $data, $assoc, false);
			$responseObj = (object)$response;
			if (!empty($responseObj->success))
				return $responseObj->data;
			$error = !empty($responseObj->message) ? $responseObj->message : 'error';
			if (!$defaultValue || $error == 'authentication failed') {
				echo json_encode(array('error' => $error));
				exit ;
			}
			return $defaultValue;
		} catch (\ForgeEssentials\Remote\SocketException $e) {
			echo json_encode(array('error' => $e->getMessage()));
			exit ;
		}
	}

	/**
	 * @return \ForgeEssentials\Remote\Client
	 */
	public function getRemoteClient() {
		return $this->panel->getRemoteClient();
	}

}
