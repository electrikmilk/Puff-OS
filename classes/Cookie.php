<?php
/*
 * Created by @electrikmilk, 01-27-2021
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
*/
class Cookie {
  public static function get( $name ) {
    return $_COOKIE[ $name ];
  }
  public static function set( $name, $value, $time ) {
    $expire = 86400; // 1 day in seconds
    if ( $time )$expire = strtotime( $time, 0 );
    setcookie( $name, $value, time() + ( $expire * 30 ), "/" );
  }
  public static function delete( $name ) {
    if ( isset( $_COOKIE[ $name ] ) ) {
      unset( $_COOKIE[ $name ] );
      setcookie( $name, null, -1, '/' );
      return true;
    } else return false;
  }
}
