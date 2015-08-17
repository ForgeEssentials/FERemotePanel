<?php

namespace ForgeEssentials\RemotePanel;

abstract class Utils {

	public static function getEnvironment() {
		return (object) array(
			'webRoot' => dirname($_SERVER['SCRIPT_FILENAME']),
			'projectRoot' => dirname(WEB_ROOT),
			'basePath' => isset($_SERVER['BASE']) ? $_SERVER['BASE'] : (isset($_SERVER['REDIRECT_BASE']) ? $_SERVER['REDIRECT_BASE'] : dirname($_SERVER['SCRIPT_NAME'])),
			'baseUrl' => (isset($_SERVER['BASE']) || isset($_SERVER['REDIRECT_BASE'])) && basename($_SERVER['SCRIPT_NAME']) == 'app.php' ? BASE_PATH : $_SERVER['SCRIPT_NAME'],
			'path' => isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : substr($_SERVER['REQUEST_URI'], strlen(BASE_URL)),
		);
	}

	public static function startsWith($haystack, $needle) {
		return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
	}

	public static function endsWith($haystack, $needle) {
		return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
	}

	public static function json_decode_nice($json, $assoc = FALSE) {
		$json = str_replace(array(
			"\n",
			"\r"
		), "", $json);
		$json = preg_replace('/([{,]+)(\s*)([^"]+?)\s*:/', '$1"$3":', $json);
		$json = preg_replace('/(,)\s*}$/', '}', $json);
		return json_decode($json, $assoc);
	}

	public static function setHeaderStatus($statusCode) {
		static $status_codes = null;
		if ($status_codes === null) {
			$status_codes = array(
				100 => 'Continue',
				101 => 'Switching Protocols',
				102 => 'Processing',
				200 => 'OK',
				201 => 'Created',
				202 => 'Accepted',
				203 => 'Non-Authoritative Information',
				204 => 'No Content',
				205 => 'Reset Content',
				206 => 'Partial Content',
				207 => 'Multi-Status',
				300 => 'Multiple Choices',
				301 => 'Moved Permanently',
				302 => 'Found',
				303 => 'See Other',
				304 => 'Not Modified',
				305 => 'Use Proxy',
				307 => 'Temporary Redirect',
				400 => 'Bad Request',
				401 => 'Unauthorized',
				402 => 'Payment Required',
				403 => 'Forbidden',
				404 => 'Not Found',
				405 => 'Method Not Allowed',
				406 => 'Not Acceptable',
				407 => 'Proxy Authentication Required',
				408 => 'Request Timeout',
				409 => 'Conflict',
				410 => 'Gone',
				411 => 'Length Required',
				412 => 'Precondition Failed',
				413 => 'Request Entity Too Large',
				414 => 'Request-URI Too Long',
				415 => 'Unsupported Media Type',
				416 => 'Requested Range Not Satisfiable',
				417 => 'Expectation Failed',
				422 => 'Unprocessable Entity',
				423 => 'Locked',
				424 => 'Failed Dependency',
				426 => 'Upgrade Required',
				500 => 'Internal Server Error',
				501 => 'Not Implemented',
				502 => 'Bad Gateway',
				503 => 'Service Unavailable',
				504 => 'Gateway Timeout',
				505 => 'HTTP Version Not Supported',
				506 => 'Variant Also Negotiates',
				507 => 'Insufficient Storage',
				509 => 'Bandwidth Limit Exceeded',
				510 => 'Not Extended'
			);
		}
		if ($status_codes[$statusCode] !== null) {
			$status_string = $statusCode . ' ' . $status_codes[$statusCode];
			header($_SERVER['SERVER_PROTOCOL'] . ' ' . $status_string, true, $statusCode);
		}
	}

	public static function getJsonPost() {
		if ($_SERVER["CONTENT_TYPE"] == 'application/json') {
			$input = @file_get_contents('php://input');
			if ($input === false)
				throw new \Exception("No input");
			$request = Utils::json_decode_nice($input);
			if (json_last_error() != 0)
				throw new \Exception("Error reading post data: " . json_last_error_msg());
			return $request;
		} else {
			return (object)$_POST;
		}
	}

}
