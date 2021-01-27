<?php
/*
 * Created by @electrikmilk, 01-27-2021
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
*/
class Files {
    private static $instance = null;
    private $path;
    private $script;
    private function __construct(string $path = null) {
        $this->script = $_SERVER['DOCUMENT_ROOT'].trim(str_replace(pathinfo($_SERVER['SCRIPT_NAME'],PATHINFO_BASENAME),"",$_SERVER['SCRIPT_NAME']));
        try {
            if(!$path)$path = $this->script;
            if (!file_exists($path)) throw new Exception("Path '$path' does not appear to exist.");
            if (!is_readable($path)) throw new Exception("Path '$path' does not appear to be readable.");
            if (!is_writeable($path)) trigger_error("Path '$path' appears to be read-only.", E_USER_NOTICE);
            $this->path = "$this->script$path";
        }
        catch(Exception $e) {
            die($e);
        }
    }
    public static function getInstance(string $path = null) {
        if (!isset(self::$_instance)) {
            self::$instance = new Files($path);
        }
        return self::$instance;
    }
    public function path($path = null) {
        try {
            if(!$path)$path = $this->script;
            if (!file_exists($path)) throw new Exception("Path '$path' does not appear to exist.");
            if (!is_readable($path)) throw new Exception("Path '$path' does not appear to be readable.");
            if (!is_writeable($path)) trigger_error("Path '$path' appears to be read-only.", E_USER_NOTICE);
            $this->path = "$this->script$path";
        }
        catch(Exception $e) {
            die($e);
        }
    }
    public function file(string $name = null, $content = null) {
        if (is_dir($this->path)) {
            if (!$name) return;
            else {
                $path = "$this->path/$name";
                if (!file_exists($path) || file_exists($path) && is_writeable($path) && $content) {
                    if (file_put_contents($path, $content)) return true;
                    else return false;
                } else if (!is_writeable($path)) {
                    return false;
                } else {
                    if (is_readable($path)) return file_get_contents($path);
                    else return false;
                }
            }
        } else {
            $content = $name;
            if ($content) {
                if (is_writeable($this->path)) {
                    if (file_put_contents($this->path, $content)) return true;
                    else return false;
                } else return false;
            } else return file_get_contents($this->path);
        }
    }
    public function dir(string $name = null, string $time = null, bool $order = true, int $perm = 0755) {
        $path = $this->path;
        if ($name) $path = "$path/$name";
        $path .= "/";
        if (is_file($this->path)) return;
        else {
            if (!file_exists($path)) {
                if (!$name) return;
                if (mkdir($path, $perm, true)) return true;
                else return false;
            } else {
                if (!is_dir($path)) return;
                else {
                    if (is_readable($path)) {
                        $files = array();
                        if ($handle = opendir($path)) {
                            while (false !== ($entry = readdir($handle))) {
                                if ($entry != "." && $entry != ".." && $entry[0] !== ".") {
                                    switch ($time) {
                                        case "m":
                                            $time = filemtime("$path/$entry");
                                        break;
                                        case "c":
                                            $time = filectime("$path/$entry");
                                        break;
                                        case "a":
                                            $time = fileatime("$path/$entry");
                                        break;
                                        default:
                                            $time = filemtime("$path/$entry");
                                    }
                                    $mod = date("Y-m-d H:i:s", $time);
                                    $files[uniqid()."_".$mod] = $this->info("$entry");
                                }
                            }
                            closedir($handle);
                        }
                        if (empty($files)) return NULL;
                        else {
                            if ($order === true) ksort($files);
                            else krsort($files);
                            return $files;
                        }
                    } else return false;
                }
            }
        }
    }
    public function info(string $name = null) {
        $path = $this->path;
        if ($name) $path = "$path/$name";
        $info = array();
        $parts = pathinfo($path);
        $info['name'] = $parts['filename'];
        $info['type'] = filetype($path);
        if (is_file($path)) {
            $info['mime'] = mime_content_type($path);
            $info['base'] = $parts['basename'];
            $info['ext'] = $parts['extension'];
        }
        $info['dir'] = $parts['dirname'];
        $info['mod'] = date("Y-m-d H:i:s",filemtime($path));
        $info['change'] = date("Y-m-d H:i:s",filectime($path));
        $info['access'] = date("Y-m-d H:i:s",fileatime($path));
        return $info;
    }
    public function size(string $name = null, bool $format = false) {
        if ($name === true && is_file($this->path)) {
            unset($name);
            $format = true;
        }
        $path = $this->path;
        if ($name) $path = "$path/$name";
        if ($name && !is_dir($this->path)) return;
        else {
            $bytes = filesize($path);
            if ($format === true) { // make it readable
                if ($bytes >= 1073741824) $bytes = number_format($bytes / 1073741824, 2) . ' GB';
                elseif ($bytes >= 1048576) $bytes = number_format($bytes / 1048576, 2) . ' MB';
                elseif ($bytes >= 1024) $bytes = number_format($bytes / 1024, 2) . ' KB';
                elseif ($bytes > 1) $bytes = $bytes . ' bytes';
                elseif ($bytes == 1) $bytes = $bytes . ' byte';
                else $bytes = '0 bytes';
            }
            return $bytes;
        }
    }
    public function count(string $name = null) {
        $path = $this->path;
        if ($name) $path = "$path/$name";
        if (!is_dir($path)) return;
        else {
            $count['files'] = 0;
            $count['folders'] = 0;
            $count['total'] = 0;
            $path = realpath($path);
            $dir = opendir($path);
            while (($file = readdir($dir)) !== false) {
                if ($file != "." && $file != "..") {
                    if (is_file("$path/$file")) {
                        $count['files']++;
                        $count['total']++;
                    }
                    if (is_dir("$path/$file")) {
                        $count['folders']++;
                        $count['total']++;
                        $counts = $this->count("$path/$file");
                        $count['folders']+= $counts['folders'];
                        $count['files']+= $counts['files'];
                    }
                }
            }
            closedir($dir);
            return $count;
        }
    }
    public function empty(string $name = null) {
        $path = $this->path;
        if ($name) $path = "$path/$name";
        if (!is_dir($path)) return;
        else {
            if (!is_readable($path)) return false;
            return (count(scandir($path)) == 2);
        }
    }
    public function rename(string $name, string $newname) {
        if (!$name || !$newname) return;
        else {
            $path = "$this->path/$name";
            $newpath = "$this->path/$newname";
            if (file_exists($path) && !file_exists($newpath)) {
                if (rename($path, $newpath)) return true;
                else return false;
            } else return NULL;
        }
    }
    public function copy($item, $newpath = null, $force = false) {
        $path = $this->path;
        if (is_dir($this->path) && $item) $path = "$path/$item";
        if (file_exists($path)) return $this->transfer("copy", $path, $newpath, $force);
        else return NULL;
    }
    public function move($item, $newpath, $force = false) {
        $path = $this->path;
        if ($item) $path = "$path/$item";
        if (file_exists($path)) return $this->transfer("move", $path, $newpath, $force);
        else return NULL;
    }
    private function transfer($action, $path, $newpath, $force) { // TODO: make it so you could write a funciton like this copy("file","directory"), not copy("file","directory/file");
        if (is_file($path)) {
            if ($action === "copy") {
                if (!$newpath) {
                    $info = pathinfo($path);
                    $basename = $info['basename'];
                    $filename = $info['filename'];
                    $ext = $info['extension'];
                    $dir = str_replace($basename, "", $path);
                    $name = "$filename";
                    while (file_exists("$dir/$name.$ext")) {
                        $name.= " copy";
                    }
                    $newname = "$name.$ext";
                    $newpath = str_replace($name, $newname, $path);
                }
                if ($path !== $newpath) {
                    if (file_exists($newpath) && $force === true) {
                        if (copy($path, $newpath)) return true;
                        else return false;
                    } else return false;
                } else return false;
            } else if ($newpath && $path !== $newpath) {
                if (file_exists($newpath) && $force === true) {
                    if (rename($path, $newpath)) return true;
                    else return false;
                } else return false;
            } else return false;
        } else return $this->copy_dir($path, $newpath);
    }
    private function copy_dir(string $path, string $newpath = null) { // not properly tested yet, not sure if this will work correctly
        $dir = opendir($path);
        @mkdir($newpath);
        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                $name = $file;
                if (is_dir("$path/$file")) {
                    if ($path === $newpath) {
                        $newname = "$file copy";
                        while (file_exists("$newpath/$newname")) {
                            $newname.= " copy";
                        }
                    }
                    $this->copy_dir("$path/$file", "$newpath/$newname");
                } else {
                    $info = pathinfo($path);
                    $basename = $info['basename'];
                    if ($path === $newpath) {
                        $filename = $info['filename'];
                        $ext = $info['extension'];
                        $dir = str_replace($basename, "", $newpath);
                        $name = "$filename";
                        while (file_exists("$dir/$name.$ext")) {
                            $name.= " copy";
                        }
                        $newname = "$name.$ext";
                    } else $newname = $basename;
                    copy("$path/$file", "$newpath/$newname");
                }
            }
        }
        closedir($dir);
        return true;
    }
    public function delete(string $name = null, bool $safe = true, bool $sub = false) {
        $path = $this->path;
        if ($name && $sub === false) $path = "$this->path/$name";
        else $path = $name;
        if (is_dir($path)) {
            if ($safe === false) {
                if (substr($path, strlen($path) - 1, 1) != '/') $path.= '/';
                $files = glob($path . '*', GLOB_MARK);
                foreach ($files as $file) {
                    if (is_dir($file)) $this->delete($file,$safe,true);
                    else unlink($file);
                }
                if (rmdir($path)) return true;
                else return false;
            } else {
                if (rmdir($path) && $this->empty($name)) return true;
                else return false;
            }
        } else {
            if (unlink($path)) return true;
            else return false;
        }
        // if we just deleted what was $this->path, this instance needs to be unset
        if (!file_exists($this->path)) $instance = null;
    }
    public function destroy() {
        $instance = null; // destroy the instance

    }
}
