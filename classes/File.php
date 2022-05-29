<?php

class File
{
	private $path;

	public function __construct(string $path)
	{
		if (!file_exists($path)) {
			throw new Error("File '$path' does not exist!");
		}
		$this->path = $path;
	}

	public function info()
	{
		return Files::info($this->path);
	}

	public function size()
	{
		return Files::size($this->path);
	}

	public function contents()
	{
		if (!file_exists($this->path)) {
			return false;
		}
		if (!is_readable($this->path)) {
			throw new Error("Unable to read file '$this->path'.");
		}
		return file_get_contents($this->path);
	}

	public function update(string $new_content)
	{
		if (!file_exists($this->path)) {
			throw new Error("File '$this->path' does not exist!");
		}
		if (!is_writable($this->path)) {
			return false;
		}
		if (!isset($new_content)) {
			return false;
		}
		if (file_put_contents($this->path, $new_content)) {
			return true;
		}
		throw new Error("Unable to write to file '$this->path'.");
	}

	public function remove($safe = true)
	{
		$path = $this->path;
		if (is_dir($path)) {
			if ($safe === false) {
				if ($path[strlen($path) - 1] !== '/') {
					$path .= '/';
				}
				$files = glob($path . '*', GLOB_MARK);
				foreach ($files as $file) {
					if (is_dir($file)) {
						$this->remove($path, false);
					} else {
						unlink($file);
					}
				}
				if (rmdir($path)) {
					return true;
				}
				return false;
			}
		} elseif (unlink($path)) {
			return true;
		} else {
			return false;
		}
	}
}