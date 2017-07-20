function setCookie( cName, sValore, secs )
{
    var dtOggi = new Date() ;
    var dtExpires = new Date() ;
    dtExpires.setTime( dtOggi.getTime() + secs * 1000 ) ;
    document.cookie = cName + "=" + escape( sValore ) + ";"
                      + " expires=" + dtExpires.toGMTString() + ";"
                      + " path=/" + ";" ;
                      + " domain=/" + ";" ;
}

function existsCookie( cName ) { return getCookie( cName ) == "" ? 0 : 1 ; }
function delCookie( cName ) { setCookie( cName, "" ); }

function getCookie( cName )
{
  var asCookies = document.cookie.split("; "), asCookie ;
  for ( var _i = 0; _i < asCookies.length; _i++ )
  {
      asCookie = asCookies[_i].split( "=" );
      if ( cName == asCookie[0] ) return ( unescape( asCookie[1] ) );
  }

  return( "" );
}