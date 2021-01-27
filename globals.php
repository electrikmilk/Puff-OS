<?php
// Autoload Classes
spl_autoload_register( function ( $className ) {
  $url = $_SERVER[ 'REQUEST_URI' ];
  $path = $_SERVER[ 'DOCUMENT_ROOT' ] . "/classes/";
  $className = str_replace( "\\", "/", $className );
  $class_path = "$path$className.php";
  if ( !file_exists( $class_path ) ) return false;
  require_once $class_path;
} );
