<?php
/*
 * Created by @electrikmilk, 01-27-2021
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
*/
class Database {
  private static $instance = null;
  private $pdo, $query, $error = false, $results, $rowsCount = 0;
  private $opts = array( "=", ">", "<", ">=", "<=" );

  private function __construct( $db ) {
    try {
      $this->pdo = new PDO( "mysql:host=localhost;dbname=$db;", "", "" );
    } catch ( PDOException $e ) {
      die( $e->getMessage() );
    }
  }

  public static function getInstance( $db ) {
    if ( !isset( self::$_instance ) ) {
      self::$instance = new Database( $db );
    }
    return self::$instance;
  }

  public function query( $sql, $params = array() ) {
    $this->error = false;
    if ( $this->query = $this->pdo->prepare( $sql ) ) {
      $i = 1;
      if ( count( $params ) ) {
        foreach ( $params as $param ) {
          $this->query->bindValue( $i, $param );
          ++$i;
        }
      }
      if ( $this->query->execute() ) {
        $this->results = $this->query->fetchAll( PDO::FETCH_OBJ );
        $this->rowsCount = $this->query->rowCount();
      } else {
        $this->error = true;
      }
    }
    return $this;
  }
  public function error() {
    return $this->error;
  }
  public function results() {
    return $this->results;
  }
  public function count() {
    return $this->rowsCount;
  }

  private function action( $action, $table, $where, $orderby, $limit ) {
    $orders = array( "asc", "desc" );
    $sql = "{$action} from {$table}";
    if ( $where )$sql .= " where {$where}";
    if($orderby) {
      if(is_array($orderby)) {
        $order_count = count( $orderby );
        if ( $order_count === 2 ) {
          $col = $orderby[ 0 ];
          $by = $orderby[ 1 ];
          if ( $col && in_array( $by, $orders ) !== false )$sql .= " order by {$col} {$by}";
        }
      } else $sql .= " order by $orderby";
    }
    if ( $limit && is_numeric( $limit ) !== false )$sql .= " limit " . number_format( intVal( $limit ) );
    if ( $sql ) {
      if ( !$this->query( $sql )->error() ) return $this;
    }
    return false;
  }

  public function modify( $action, $table, $fields = array(), $where = array() ) {
    if ( count( $fields ) ) {
      $cols = array_keys( $fields );
      if ( $action === "insert" ) {
        $values = "";
        foreach ( $fields as $field ) {
          $values .= "?";
          if ( $field !== end( $fields ) )$values .= ",";
        }
      } else if ( $action === "update" ) {
        $sets = array();
        foreach ( $fields as $field ) {
          array_push( $sets, "$field = ?" );
        }
        if ( count( $where ) >= 3 ) {
          $col = $where[ 0 ];
          $opt = $where[ 1 ];
          $val = $where[ 2 ];
          if ( in_array( $opt, $this->opts ) !== false ) {
            $wheres = "where {$col} {$opt} ?";
          }
        }
      }
      if ( $action === "insert" )$sql = "insert into {$table} (`" . implode( '`,`', $cols ) . "`) values ({$values})";
      else if ( $action === "update" )$sql = "update {$table} set " . implode( ', ', $sets ) . " {$wheres}";
      if ( !$this->query( $sql, $fields )->error() ) {
        return $this->pdo->lastInsertId();
      }
    }
    return false;
  }

  public function insert( $table, $fields ) {
    return $this->modify( 'insert', $table, $fields );
  }
  public function get( $table, $where, $order, $limit ) {
    return $this->action( 'select *', $table, $where, $order, $limit );
  }
  public function update( $table, $fields, $where ) {
    return $this->modify( 'update', $table, $fields, $where );
  }
  public function delete( $table, $where ) {
    return $this->action( 'delete', $table, $where );
  }
}
