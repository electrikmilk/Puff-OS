<?php

class Cache
{
	private $id, $path;

	public function __construct()
	{
		$this->id = uniqid('', true);
		$this->path = "{$_SERVER['DOCUMENT_ROOT']}/tmp";
		if (!file_exists(APP)) Files::dir(APP);
		if (!file_exists($this->id)) Files::dir(APP . "/$this->id");
	}

	public function get(string $name, string $group = null)
	{
		$tmp = Files::file("$this->path/" . APP . "/$this->id/$group/$name");
		if (file_exists($name)) {
			return $tmp;
		} else {
			return false;
		}
	}

	public function group(string $name)
	{
		$tmp = Files::dir(APP . "/$this->id/$name");
		if (file_exists(APP)) {
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
		$tmp = Files::dir("$this->path/" . APP . "/$this->id/$group");
		if ($tmp) {
			return true;
		} else {
			return false;
		}
	}

	public function remove(string $name, string $group = null)
	{
		return (new File("$this->path/" . APP . "/$this->id/$group/$name"))->remove($name);
	}
}
