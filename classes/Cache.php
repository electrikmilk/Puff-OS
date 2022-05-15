<?php

class Cache
{
	private $id, $app, $path;

	public function __construct()
	{
		$this->app = $_GLOBALS['Application'];
		$this->id = uniqid('', true);
		$this->path = "{$_SERVER['DOCUMENT_ROOT']}/tmp";
		$tmp = Files::getInstance($this->path, false);
		if (!$tmp->exists($this->app)) $tmp->dir($this->app);
		if (!$tmp->exists($this->id)) $tmp->dir("$this->app/$this->id");
	}

	public function get(string $name, string $group = null)
	{
		$tmp = Files::getInstance("$this->path/$this->app/$this->id/$group", false);
		if ($tmp->exists($name)) return $tmp->file($name);
		else return false;
	}

	public function group(string $name)
	{
		$tmp = Files::getInstance($this->path, false);
		if ($tmp->exists($app)) return;
		if ($tmp->dir("$this->app/$this->id/$name")) return true;
		else return false;
	}

	public function set(string $group = null, string $file, string $content = null)
	{
		$tmp = Files::getInstance("$this->path/$this->app/$this->id/$group", false);
		if ($tmp->file($file, $content)) return true;
		else return false;
	}

	public function remove(string $name, string $group = null)
	{
		$tmp = Files::getInstance("$this->path/$this->app/$this->id/$group", false);
		if ($tmp->exists($name)) return $tmp->delete($name);
		else return false;
	}
}
