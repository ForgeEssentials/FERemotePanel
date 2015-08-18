<?php

namespace ForgeEssentials\RemotePanel\Module;

use ForgeEssentials\RemotePanel\RemotePanel;

use ForgeEssentials\Remote\Client;

use Twig_Environment;

abstract class Module {

	/**
	 * @var \ForgeEssentials\RemotePanel\RemotePanel
	 */
	protected $panel;

	public function __construct($panel) {
		$this->panel = $panel;
	}

	public abstract function getId();

	public abstract function getData();

	public function postData($data) {
	}

	public function render(Twig_Environment $twig) {
		return $this->panel->getTwig()->render('module/' . $this->getId() . '.html.twig', array('module' => $this));
	}

	public function query($id, $data = null, $assoc = false, $defaultValue = null) {
		return $this->panel->query($id, $data, $assoc, $defaultValue);
	}

	public function post($id, $data = null) {
		return $this->panel->post($id, $data);
	}

}
