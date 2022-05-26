<?php

class Files
{
	public static function file($path)
	{
		if (!file_exists($path)) {
			return false;
		}
		return file_get_contents($path);
	}

	public static function info($path)
	{
		if (!file_exists($path)) {
			return false;
		}
		$pathinfo = pathinfo($path);
		$info = array(
			'name' => $pathinfo['basename'],
			'filename' => $pathinfo['filename'],
			'type' => filetype($path),
			'last_access' => fileatime($path),
			'last_mod' => filemtime($path),
			'created' => filectime($path),
			'size' => self::size($path)
		);
		if (!is_dir($path)) {
			$info['mime'] = mime_content_type($path);
			$info['ext'] = $pathinfo['extension'];
		}
		return $info;
	}

	public static function dir($path)
	{
		if (!file_exists($path)) {
			return false;
		}
		if (!is_dir($path)) {
			return false;
		}
		$files = scandir($path);
		if (!$files) {
			return false;
		}
		$files_array = [];
		foreach ($files as $file) {
			if ($file !== "." && $file !== "..") {
//				$pathinfo = pathinfo($file);
//				if ($pathinfo['dirname'] !== ".") {
//					$path = "{$pathinfo['dirname']}$file";
//				}
				$files_array[] = self::info("$path/$file");
			}
		}
		return $files_array;
	}

	public static function size($path)
	{
		if (!file_exists($path)) {
			return false;
		}
		$bytes = filesize($path);
		if ($bytes >= 1073741824) {
			$bytes = number_format($bytes / 1073741824, 2) . ' GB';
		} elseif ($bytes >= 1048576) {
			$bytes = number_format($bytes / 1048576, 2) . ' MB';
		} elseif ($bytes >= 1024) {
			$bytes = number_format($bytes / 1024, 2) . ' KB';
		} elseif ($bytes > 1) {
			$bytes .= ' bytes';
		} elseif ($bytes == 1) {
			$bytes .= ' byte';
		} else {
			$bytes = '0 bytes';
		}
		return $bytes;
	}

	public static function count($path)
	{
		if (!file_exists($path)) {
			return false;
		}
		if (!is_dir($path)) {
			return false;
		}
		$files = scandir($path);
		if (!$files) {
			return false;
		}
		return count($files);
	}

	public static function createFile($path, $content = null): bool
	{
		if (file_exists($path)) {
			return false;
		}
		if (file_put_contents($path, $content)) {
			return true;
		}
		return false;
	}

	public static function createDir($path): bool
	{
		if (file_exists($path) && is_dir($path)) {
			return false;
		}
		if (!mkdir($path) && !is_dir($path)) {
			throw new Error("Directory '$path' was not created");
		}
		return true;
	}
}