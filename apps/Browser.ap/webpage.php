<?php
require_once "../../lib/apis/application.php";
require_once "frameworks/simple_html_dom.php";
require_once "frameworks/favicon.php";

function clean( $string ) { // Used for making feature and listing identifiers, etc.
  return strtolower( preg_replace( '/-+/', '-', preg_replace( '/[^A-Za-z0-9\-]/', '', preg_replace( "/[\"\']/", " ", preg_replace( "/[\/\&%#\$]/", "_", str_replace( ' ', '-', trim( strip_tags( $string ) ) ) ) ) ) ) );
}

function getDomain( $url, $tld = false ) {
  $pieces = parse_url( $url );
  $domain = isset( $pieces[ 'host' ] ) ? $pieces[ 'host' ] : '';
  if ( preg_match( '/(?P<domain>[a-z0-9][a-z0-9\-]{1,63}\.[a-z\.]{2,6})$/i', $domain, $m ) ) {
    return ( $tld === true ) ? substr( $m[ 'domain' ], ( $pos = strpos( $m[ 'domain' ], '.' ) ) !== false ? $pos + 1 : 0 ) : $m[ 'domain' ];
  }
  return false;
}

$url = $_GET['url'];

if(!$url) {
  echo "<p>Enter a url above</p>";
  return;
}

$parts = pathinfo($url);
$domain = getDomain($url);
if($parts['extension'] && mime_content_type($url))header( "Content-Type: ".mime_content_type($url)."; charset=UTF-8" );

define('VERSION','1.0');
// $agent = "Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/BuildID) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36";
// make agent
$split = explode(")",$_SERVER['HTTP_USER_AGENT']);
$agent = "Mozilla/5.0 (compatible; Puff OS Browser/" . VERSION . ", https://puff.com)";
$i = 0;
foreach($split as $part) {
  if($i !== 0) {
    $agent .= $part;
  }
  if($i === 1)$agent .= ")";
  ++$i;
}
ini_set("user_agent",$agent);

if(file_get_contents($url)) {
  $ch = curl_init();
  curl_setopt ($ch, CURLOPT_AUTOREFERER, true);
  curl_setopt ($ch, CURLOPT_URL, $url);
  curl_setopt ($ch, CURLOPT_USERAGENT, $agent);
  curl_setopt ($ch, CURLOPT_VERBOSE, 1);
  curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
  curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt ($ch, CURLOPT_HEADER, 0);
  curl_setopt ($ch, CURLOPT_FOLLOWLOCATION, 1);
  curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 5);

  $data = curl_exec($ch);
  curl_close($ch);

  if($data) {
    $path = "../../tmp/browser/".clean($url).".html";
    unlink($path); // debug
    if(!file_exists("../../tmp/browser"))mkdir("tmp/browser");
    if(!file_exists("../../tmp/browser/favicons"))mkdir("tmp/browser/favicons");
    // if(!file_exists())file_put_contents("tmp/browser") // use to cache in the future
    file_put_contents($path,$data);
    // $html = file_get_contents( $path );
    $html = $data;
    // echo "<textarea style='width:100%;height:100%'>$html</textarea>";
    $doc = new simple_html_dom();
    $doc->load( $html );
    $pageTitle = $doc->find("title");
    foreach ( $doc->find( "a" ) as $node ) {
      // $node->innertext = "<b>{$node->innertext}</b>";
      // if(stripos($node->href,"http") === false)$node->setAttribute( "href", "https://$domain/$node->href" );
      // $node->setAttribute( "href", "webpage?url=$node->href" );
      echo $a->href,"<br/>";
    }
    // foreach ( $doc->find( "script,img" ) as $node ) {
    //   if(stripos($node->src,"http") === false)$node->setAttribute( "src", "https://$domain/$node->src" );
    // }
    // foreach ( $doc->find( "link" ) as $node ) {
    //   if(stripos($node->href,"http") === false)$node->setAttribute( "href", "https://$domain/$node->href" );
    // }
    $doc->save( $path );
    if(!file_exists("../../tmp/browser/favicon/$domain.png")) {
      $grap_favicon = array(
        'URL' => "https://$domain",   // URL of the Page we like to get the Favicon from
        'SAVE'=> true,   // Save Favicon copy local (true) or return only favicon url (false)
        'DIR' => 'tmp/browser/favicons/',   // Local Dir the copy of the Favicon should be saved
        'TRY' => true,   // Try to get the Favicon frome the page (true) or only use the APIs (false)
        'DEV' => null,   // Give all Debug-Messages ('debug') or only make the work (null)
      );
      $favicon = grap_favicon($grap_favicon);
    } else $favicon = file_get_contents("../../tmp/browser/$domain.png");
    echo file_get_contents($path);
    echo "<script>parent.finish(true,'".$favicon."');</script>";
  } else echo "Error: request was blocked or not recieved from $url.<script>parent.finish(false);</script>";
} else echo "Error: webpage at $url does not exist or was blocked.<script>parent.finish(false);</script>";
