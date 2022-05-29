<?php

class Log
{
	private $path = 'res/logs/puff.log';

	private function __construct(string $type, string $message, array $object = [])
	{
		$log = fopen($this->path, 'ab');
		fwrite($log, "[" . date('Y-m-d H:i:s') . "] [$type]: $message " . print_r($object, true));
		fclose($log);
	}

	public static function debug($message, $object)
	{
		new Log('debug', $message, $object);
	}

	public static function error($message, $object)
	{
		new Log('error', $message, $object);
	}

	public static function info($message, $object)
	{
		new Log('info', $message, $object);
	}

	public static function success($message, $object)
	{
		new Log('success', $message, $object);
	}
}

Log::debug('test');