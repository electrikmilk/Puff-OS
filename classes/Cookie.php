<?php

class Cookie {
  public static function get( $name ) {
    return $_COOKIE[ $name ];
  }
  public static function set( $name, $value, $time ) {
    $expire = 86400; // 1 day in seconds
    if ( $time )$expire = strtotime( $time, 0 );
    setcookie( $name, $value, time() + ( $expire * 30 ), "/" );
  }
  public static function remove( $name ) {
    if ( isset( $_COOKIE[ $name ] ) ) {
      unset( $_COOKIE[ $name ] );
      setcookie( $name, null, -1, '/' );
      return true;
    } else return false;
  }
}
