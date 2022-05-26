<?php

class Session
{
	public $id, $path;

	public function __construct($id)
	{
		$default = [
			'cwd' => '/'
		];
		$this->id = $id;
		$this->path = "sessions/$id.json";
		if (!file_exists("sessions")) {
			if (!mkdir("sessions") && !is_dir("sessions")) {
				throw new \RuntimeException(sprintf('Directory "%s" was not created', "sessions"));
			}
		}
		if (!file_exists($this->path)) {
			try {
				file_put_contents($this->path, json_encode($default, JSON_THROW_ON_ERROR));
			} catch (JsonException $e) {
				die("JSON Exception: " . $e->getMessage());
			}
		}
	}

	public function get($key)
	{
		try {
			$data = json_decode(file_get_contents($this->path), true, 512, JSON_THROW_ON_ERROR);
		} catch (JsonException $e) {
			die("JSON Exception: " . $e->getMessage());
		}
		return $data[$key] ?? false;
	}

	public function set($key, $value)
	{
		$data = json_decode(file_get_contents($this->path), true);
		$data[$key] = $value;
		try {
			$data = json_encode($data, JSON_THROW_ON_ERROR);
			if (file_put_contents($this->path, $data)) {
				return true;
			}
			die('Unable to write to session');
		} catch (JsonException $e) {
			die("JSON Exception: " . $e->getMessage());
		}
	}

	public function remove($key)
	{
		try {
			$data = json_decode(file_get_contents($this->path), true, 512, JSON_THROW_ON_ERROR);
			if (isset($data[$key])) {
				unset($data[$key]);
			}
			if (file_put_contents($this->path, json_encode($data, JSON_THROW_ON_ERROR))) {
				return true;
			}
			die('Unable to write to session');
		} catch (JsonException $e) {
			die("JSON Exception: " . $e->getMessage());
		}
	}
}