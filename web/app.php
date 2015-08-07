<?php

define('WEB_ROOT', dirname($_SERVER['SCRIPT_FILENAME']));
define('PROJECT_ROOT', dirname(WEB_ROOT));
define('BASE_PATH', isset($_SERVER['BASE']) ? $_SERVER['BASE'] : (isset($_SERVER['REDIRECT_BASE']) ? $_SERVER['REDIRECT_BASE'] : dirname($_SERVER['SCRIPT_NAME'])));
define('BASE_URL', isset($_SERVER['BASE']) || isset($_SERVER['REDIRECT_BASE']) ? BASE_PATH : $_SERVER['SCRIPT_NAME']);
define('PATH', isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : substr($_SERVER['REQUEST_URI'], strlen(BASE_URL)));

$loader =
require_once __DIR__ . '/../vendor/autoload.php';

use ForgeEssentials\RemotePanel\RemotePanel;

$panel = new RemotePanel();
$panel->run();
