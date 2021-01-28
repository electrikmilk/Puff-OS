<?php

class Cache {
  private $id,$app;
  public function __construct() {
    $this->app = $_GLOBALS['Application'];
    $this->id = uniqid();
    $tmp = Files::getInstance("tmp",false);
    if(!$tmp->exists($app))$tmp->dir($app);
  }
  public static function get( string $name, string $group = null ) {
    $tmp = Files::getInstance("tmp/$this->app/$this->id/$group",false);
    if($tmp->exists($name))return $tmp->file($name);
    else return false;
  }
  public static function group( string $name ) {
    $tmp = Files::getInstance("tmp",false);
    if($tmp->exists($app))return;
    if($tmp->dir("$this->app/$this->id/$name")) return true;
    else return false;
  }
  public static function set( string $group = null, string $file, string $content = null ) {
    $tmp = Files::getInstance("tmp/$this->app/$this->id/$group",false);
    if($tmp->file($file,$content))return true;
    else return false;
  }
  public static function remove( string $name, string $group = null ) {
    $tmp = Files::getInstance("tmp/$this->app/$this->id/$group",false);
    if($tmp->exists($name))return $tmp->delete($name);
    else return false;
  }
}
