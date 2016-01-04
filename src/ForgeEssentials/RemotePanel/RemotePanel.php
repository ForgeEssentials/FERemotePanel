<?php

namespace ForgeEssentials\RemotePanel;

use ForgeEssentials\RemotePanel\Module\Module;

use ForgeEssentials\Remote\Client;

class RemotePanel {

	public $environment = 'dev';

	public $env;

	public $loggedIn = false;

	/************************************************************/

	private $address = 'localhost';

	private $port = 27020;

	private $username;

	private $passkey;

	private $needsAuthentication = false;

	private $remoteTimestamp = 0;

	private $newRemoteTimestamp = 0;

	/**
	 * @var Client
	 */
	private $remote;

	/************************************************************/

	/**
	 * @var \Twig_Environment
	 */
	private $twig;

	private $modules = array();

	/************************************************************/

	public function __construct() {
		$this->env = Utils::getEnvironment();
		$this->loadConfig();
		$this->loadSession();
	}

	private function loadConfig() {
		$fn = PROJECT_ROOT . '/config/config.json';
		if (!file_exists($fn)) {
			return;
			// throw new \Exception("Config file not found");
		}

		$configText = @file_get_contents($fn);
		if ($configText === false)
			throw new \Exception("Config file could not be read");

		$config = Utils::json_decode_nice($configText);
		if (json_last_error() != 0)
			throw new \Exception("Config file could not be loaded: " . json_last_error_msg());

		if (!empty($config->username))
			$this->username = $config->username;
		if (!empty($config->passkey))
			$this->passkey = $config->passkey;
		if (!empty($config->address))
			$this->address = $config->address;
		if (!empty($config->port) && is_numeric($config->port))
			$this->port = $config->port;
	}

	private function loadSession() {
		session_start();
		if (!empty($_SESSION['username'])) {
			$this->loggedIn = true;
			$this->username = $_SESSION['username'];
		}
		if (!empty($_SESSION['passkey']))
			$this->passkey = $_SESSION['passkey'];
	}

	/************************************************************/

	public function run() {
		if (preg_match("@^/module/([^/\\?]+)/data/?$@", $this->env->path, $matches)) {
			$this->handleModuleData($matches[1]);
		} else if (preg_match("@^/module/([^/\\?]+)/view/?$@", $this->env->path, $matches)) {
			$this->handleModuleView($matches[1]);
		} else if (preg_match("@^/module/([^/\\?]+)/?$@", $this->env->path, $matches)) {
			$this->handleModule($matches[1]);
		} else if (preg_match("@^/login/?$@", $this->env->path, $matches)) {
			$this->handleLogin();
		} else if (preg_match("@^/logout/?$@", $this->env->path, $matches)) {
			$this->handleLogout();
		} else if (preg_match("@^/?$@", $this->env->path, $matches)) {
			$this->handleModule($this->getModules()[0]);
		} else {
			Utils::setHeaderStatus(404);
			$this->renderError("404 - Not found");
			//echo "404 - Not found";
		}
	}

	public function handleLogin() {
		header('Content-Type: application/json');
		header("Location: " . (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : $this->env->baseUrl));
		try {
			$request = Utils::getJsonRequest();
			if (!isset($request->username) || !isset($request->passkey))
				throw new \Exception('Username and passkey required');

			$this->username = $_SESSION['username'] = $request->username;
			$this->passkey = $_SESSION['passkey'] = $request->passkey;
			echo json_encode(array('success' => true));
		} catch (\Exception $e) {
			echo json_encode(RemotePanel::error($e->getMessage()));
		}
	}

	public function handleLogout() {
		header('Content-Type: application/json');
		header("Location: " . (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : $this->env->baseUrl));
		$this->username = $_SESSION['username'] = null;
		$this->passkey = $_SESSION['passkey'] = null;
		echo json_encode(array('success' => true));
	}

	/************************************************************/

	public function getModules() {
		return array(
			'dashboard',
			'chat',
			'serverlog',
			'graphs',
			'permissions',
			'map',
			'playerlogger',
		);
	}

	public function handleModuleData($name) {
		header('Content-Type: application/json');
		try {
			$module = $this->getModule($name);
			if ($this->env->method == 'POST') {
				$request = Utils::getJsonRequest();
				$data = $module->postData($request);
			} else {
				if (isset($_REQUEST['t']))
					$this->newRemoteTimestamp = $this->remoteTimestamp = Utils::bigintval($_REQUEST['t']);
				$data = $module->getData();
			}
			if ($data === false)
				$data = array('error' => 'Unable to retrieve module data');
			if (!$data || $data === true)
				$data = array('success' => true);
			if (!is_array($data))
				throw new \Exception('Invalid data returned');
		} catch (\Exception $e) {
			$data = array('error' => $e->getMessage());
		}
		$data['needsAuthentication'] = $this->needsAuthentication;
		$data['loggedIn'] = $this->loggedIn;
		$data['timestamp'] = $this->newRemoteTimestamp;
		echo json_encode($data);
	}

	public function handleModuleView($name) {
		try {
			$module = $this->getModule($name);
			echo $module->render($this->getTwig());
		} catch (\Exception $e) {
			echo $e->getMessage();
		}
	}

	public function handleModule($name) {
		try {
			$module = $this->getModule($name);
			echo $this->getTwig()->render('index.html.twig', array('content' => $module->render($this->getTwig())));
		} catch (\Exception $e) {
			$this->renderError($e->getMessage());
		}
	}

	public function render() {
		echo $this->getTwig()->render('index.html.twig');
	}

	public function renderError($message) {
		echo $this->getTwig()->render('error.html.twig', array('error' => $message));
	}

	/************************************************************/

	/**
	 * Get a module. Instantiates the module if not loaded yet.
	 *
	 * @return \ForgeEssentials\RemotePanel\Module\Module
	 */
	public function getModule($name) {
		if (!isset($this->modules[$name])) {
			if (!in_array($name, $this->getModules()))
				throw new \Exception('Unknown module');
			$class = '\\ForgeEssentials\\RemotePanel\\Module\\Module' . ucfirst($name);
			if (!class_exists($class))
				throw new \Exception('Module class not found');
			$module = @new $class($this);
			$this->modules[$name] = $module;
		}
		return $this->modules[$name];
	}

	/************************************************************/

	/**
	 * @return \ForgeEssentials\Remote\Client
	 */
	public function getRemoteClient() {
		if (empty($this->remote)) {
			$this->remote = new Client($this->address, $this->port, $this->username, $this->passkey);
			$this->remote->connect();
		}
		return $this->remote;
	}

	public function handleRemoteResponse($response, $defaultValue = null) {
		$responseObj = (object)$response;
		if (!empty($responseObj->success)) {
			if (isset($responseObj->timestamp))
				$this->newRemoteTimestamp = $responseObj->timestamp;
			if (isset($responseObj->data))
				return $responseObj->data;
			else
				return array();
		}

		$error = !empty($responseObj->message) ? $responseObj->message : 'error';
		switch ($error) {
			case 'no permission' :
				$this->needsAuthentication = true;
				break;
			case 'authentication failed' :
				$this->needsAuthentication = true;
				$this->loggedIn = false;
				break;
		}
		if ($defaultValue)
			return $defaultValue;
		throw new \Exception($error);
	}

	public function query($id, $data = null, $assoc = false, $defaultValue = null) {
		return $this->handleRemoteResponse($this->getRemoteClient()->query($id, $data, $assoc, false), $defaultValue);
	}

	public function post($id, $data = null) {
		$this->getRemoteClient()->sendRequest($id, $data);
	}

	public function getTimestamp() {
		return $this->remoteTimestamp;
	}

	/************************************************************/

	public function getTwig() {
		if (empty($this->twig)) {
			$loader = new \Twig_Loader_Filesystem(__DIR__ . '/Resources/views');
			$this->twig = new \Twig_Environment($loader, array(
				'cache' => PROJECT_ROOT . '/var/cache',
				'debug' => true,
			));
			$this->initTwig();
		}
		return $this->twig;
	}

	protected function initTwig() {
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

	public static function error($message) {
		return array('error' => $message);
	}

}
