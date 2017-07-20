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
         for( var i = 0 ; i < arrayOUT.length ; i++ )
         {
              var VALUE = arrayOUT[ i ] ;
              if ( VALUE.length == 0 ) arrayOUT.remove( i, i ) ;
         }
         
         return arrayOUT ;
    }
}

function implodePACKEDarray( arrayIN, LEFTdelimiter, RIGHTdelimiter )
{
    if ( arrayIN.length == 0 || LEFTdelimiter.length == 0 && RIGHTdelimiter.length == 0 ) return "" ;
    else if ( arrayIN.length > 0 )
    {
         var stringOUT = "" ;
         for( var i = 0 ; i < arrayIN.length ; i++ ) stringOUT += ( LEFTdelimiter + "[" + VALUE + "]" + RIGHTdelimiter ) ;

         return stringOUT ;
    }
    else return false ;
}

function array_keys( _obj )
{
    var _a = [] ;
    for ( var property in _obj ) if ( _obj.hasOwnProperty( property ) && !( /^\d+$/.test( property ) ) ) _a.push( property ) ;
    return _a ;
}