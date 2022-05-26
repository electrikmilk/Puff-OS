<?php

class Cache
{
	private $id, $app, $path;

	public function __construct()
	{
		$this->app = APP;
		$this->id = uniqid('', true);
		$this->path = "{$_SERVER['DOCUMENT_ROOT']}/tmp";
		if (!file_exists($this->app)) Files::dir($this->app);
		if (!file_exists($this->id)) Files::dir("$this->app/$this->id");
	}

	public function get(string $name, string $group = null)
	{
		$tmp = Files::file("$this->path/$this->app/$this->id/$group/$name");
		if (file_exists($name)) {
			return $tmp;
		} else {
			return false;
		}
	}

	public function group(string $name)
	{
		$tmp = Files::dir("$this->app/$this->id/$name");
		if (file_exists($this->app)) {
			return false;
		}
		if ($tmp) {
			return true;
		} else {
			return false;
		}
	}

	public function set(string $group = null, string $file, string $content = null)
	{
		$tmp = Files::dir("$this->path/$this->app/$this->id/$group");
		if ($tmp) {
			return true;
		} else {
			return false;
		}
	}

	public function remove(string $name, string $group = null)
	{
		return (new File("$this->path/$this->app/$this->id/$group/$name"))->remove($name);
	}
}
