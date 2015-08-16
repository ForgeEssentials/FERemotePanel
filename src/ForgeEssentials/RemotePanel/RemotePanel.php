<?php

namespace ForgeEssentials\RemotePanel;

use ForgeEssentials\RemotePanel\Module\Module;

use ForgeEssentials\Remote\Client;

class RemotePanel {

	public $environment = 'dev';

	public $env;

	/************************************************************/

	/**
	 * @var Client
	 */
	private $remote;

	/**
	 * @var \Twig_Environment
	 */
	private $twig;

	private $modules = array();

	/************************************************************/

	public function __construct() {
		$this->env = Utils::getEnvironment();
	}

	public function run() {
		if (preg_match("@^/module/([^/]+)/data/?$@", $this->env->path, $matches)) {
			$this->handleModuleData($matches[1]);
		} else if (preg_match("@^/module/([^/]+)/view/?$@", $this->env->path, $matches)) {
			$this->handleModuleView($matches[1]);
		} else if (preg_match("@^/module/([^/]+)/?$@", $this->env->path, $matches)) {
			$this->handleModule($matches[1]);
		} else if (preg_match("@^/?$@", $this->env->path, $matches)) {
			$this->render();
		} else {
			Utils::setHeaderStatus(404);
			echo "404 - Not found";
		}
	}

	public function handleModuleData($name) {
		$module = $this->getModule($name);
		if ($module === false) {
			echo json_encode(array('error' => 'This module does not exist'));
			return;
		}

		$data = $module->getData();
		if ($data === false) {
			echo json_encode(array('error' => 'Unable to retrieve module data'));
			return;
		}

		header('Content-Type: application/json');
		echo json_encode($data);
	}

	public function handleModuleView($name) {
		$module = $this->getModule($name);
		if ($module === false) {
			echo "This module does not exist";
			return;
		}
		echo $module->render($this->getTwig());
	}

	public function handleModule($name) {
		$module = $this->getModule($name);
		if ($module === false) {
			$this->renderError("This module does not exist");
			return;
		}
		echo $this->getTwig()->render('index.html.twig', array('content' => $module->render($this->getTwig())));
	}

	public function render() {
		echo $this->getTwig()->render('index.html.twig');
	}

	public function renderError($message) {
		echo $this->getTwig()->render('error.html.twig', array('error' => $message));
	}

	/************************************************************/

	public function getModules() {
		return array(
			'dashboard',
			'graphs',
			'serverlog',
		);
	}

	/**
	 * Get a module. Instantiates the module if not loaded yet.
	 *
	 * @return \ForgeEssentials\RemotePanel\Module\Module
	 */
	public function getModule($name) {
		if (!isset($this->modules[$name])) {
			if (!in_array($name, $this->getModules()))
				return false;
			$class = '\\ForgeEssentials\\RemotePanel\\Module\\Module' . ucfirst($name);
			if (!class_exists($class))
				return false;
			$module = @new $class($this);
			$this->modules[$name] = $module;
		}
		return $this->modules[$name];
	}

	/************************************************************/

	/**
	 * @return Client
	 */
	public function getRemoteClient() {
		if (empty($this->remote)) {
			$fn = PROJECT_ROOT . '/config/config.json';
			if (!file_exists($fn))
				throw new \Exception("Config file not found");

			$configText = @file_get_contents($fn);
			if ($configText === false)
				throw new \Exception("Config file could not be read");

			$config = Utils::json_decode_nice($configText);
			if (json_last_error() != 0)
				throw new \Exception("Config file could not be loaded: " . json_last_error_msg());

			if (empty($config->username))
				$config->username = null;
			if (empty($config->passkey))
				$config->passkey = null;
			if (!isset($config->port))
				$config->address = 27020;
			if (!isset($config->address))
				$config->address = 'localhost';
			if (!isset($config->port))
				$config->address = 27020;

			$this->remote = new Client($config->address, $config->port, $config->username, $config->passkey);
			$this->remote->connect();
		}
		return $this->remote;
	}

	/************************************************************/

	public function getTwig() {
		if (empty($this->twig))
			$this->initTwig();
		return $this->twig;
	}

	protected function initTwig() {
		$loader = new \Twig_Loader_Filesystem(__DIR__ . '/Resources/views');
		$this->twig = new \Twig_Environment($loader, array(
			'cache' => PROJECT_ROOT . '/var/cache',
			'debug' => true,
		));
		$this->twig->addFunction(new \Twig_SimpleFunction('angular', function($value) {
			return '{{' . $value . '}}';
		}));
		$this->twig->addFunction(new \Twig_SimpleFunction('asset', function($value) {
			return $this->env->basePath . '/' . $value;
		}));
		$this->twig->addFunction(new \Twig_SimpleFunction('path', function($value) {
			return $this->env->baseUrl . '/' . $value;
		}));

		$this->twig->addGlobal('app', $this);
	}

	/************************************************************/

}
