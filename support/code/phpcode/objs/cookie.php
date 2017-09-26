<?php

$cookieEXPIREafterSECS = 3600 * 5 ;
$cookieDOMAIN = "/" ;

function CookieExists( $name ) { return array_key_exists( $name, $_COOKIE ) ; }
function GetCookie( $name ) { return $_COOKIE[ $name ] ; }
function delete_cookie( $name )  { setcookie( $name, "", time()-3600, $GLOBALS['cookieDOMAIN'], false ); }
function setCOOKIEuserdefined( $cookiename, $item )
{
    // this is a special syntax to let it work on Apache localhost
    setcookie( "$cookiename", "$item",
               time()+$GLOBALS['cookieEXPIREafterSECS'],
               $GLOBALS['cookieDOMAIN'],
               false );
}
?>