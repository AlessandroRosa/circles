function isIE()
{
    var navNAME = navigator.appName.toLowerCase();
    var navUSERAGENT = navigator.userAgent.toLowerCase();
    return ( navNAME.indexOf( "explorer" ) == -1 &&
             navUSERAGENT.indexOf( "explorer" ) == -1 ) ? 0 : 1 ;
}

function isFIREFOX()
{
    var navNAME = navigator.appName.toLowerCase();
    var navUSERAGENT = navigator.userAgent.toLowerCase();
    return ( navNAME.indexOf( "firefox" ) == -1 &&
             navUSERAGENT.indexOf( "firefox" ) == -1 ) ? 0 : 1 ;
}

function isCHROME()
{
    var navNAME = navigator.appName.toLowerCase();
    var navUSERAGENT = navigator.userAgent.toLowerCase();
    return ( navNAME.indexOf( "chrome" ) == -1 &&
             navUSERAGENT.indexOf( "chrome" ) == -1 ) ? 0 : 1 ;
}

function getBROWSER() { return navigator.appName.toLowerCase() ;   }
function getUSERAGENT() { return navigator.userAgent.toLowerCase() ; }
function getPLATFORM()  { return navigator.platform.toLowerCase() ;  }