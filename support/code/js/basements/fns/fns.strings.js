function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }
function explodePACKEDarray( PACKEDarrayIN, LEFTdelimiter, RIGHTdelimiter )
{
    var arrayOUT = new Array();
    if ( PACKEDarrayIN.length == 0 || ( LEFTdelimiter.length == 0 && RIGHTdelimiter.length == 0 ) ) { return arrayOUT ; }
    else
    {
         if ( LEFTdelimiter ) PACKEDarrayIN = PACKEDarrayIN.replaceAll( RIGHTdelimiter, "" );
         else if ( RIGHTdelimiter ) PACKEDarrayIN = PACKEDarrayIN.replaceAll( LEFTdelimiter, "" );
         
         if ( LEFTdelimiter ) arrayOUT = PACKEDarrayIN.split( LEFTdelimiter ) ;
         else if ( RIGHTdelimiter ) arrayOUT = PACKEDarrayIN.split( RIGHTdelimiter ) ;
         
         // clean fake entries
         for( var _i = 0 ; _i < arrayOUT.length ; _i++ ) if ( arrayOUT[ _i ].length == 0 ) arrayOUT.remove( _i, _i ) ;
         return arrayOUT ;
    }
}

function implodePACKEDarray( arrayIN, LEFTdelimiter, RIGHTdelimiter )
{
    if ( arrayIN.length == 0 || LEFTdelimiter.length == 0 && RIGHTdelimiter.length == 0 ) return "" ;
    else if ( arrayIN.length > 0 )
    {
         var stringOUT = "" ;
         for( var _i = 0 ; _i < arrayIN.length ; _i++ ) stringOUT += ( LEFTdelimiter + "[" + arrayIN[_i] + "]" + RIGHTdelimiter ) ;
         return stringOUT ;
    }
    else return false ;
}