  /* framework data type
     datatype_dev : Number
     datatype_public : Number
     constructor1 : Number(number)
     notes_constructor1 : built-in number datatype
     constructor2 : Number()
     notes_constructor2 : built-in number datatype
     output method:
     comparison method: =
     typization method : is_number
     notes: built-in number object
     framework data type */

if ( typeof is_array != "function" )  function is_array( _a ) { return _a instanceof Array ? 1 : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj ) { return ( typeof _obj == "number" || _obj instanceof Number ) ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

Number.prototype.clean_round_off = function( _accuracy ) { return safe_float( this.toPrecision( _accuracy - 1 ), 0 ) ; }
Number.prototype.getString = function() { return this + "" + '' ; }
Number.prototype.intME = function()     { return ~~this ; }
Number.prototype.floatME = function()   { return safe_float( this, 0 ); }
Number.prototype.tolerate = function( _cmp_value, _error ) { return Math.abs( this - _cmp_value ) <= _error ? 1 : 0 ; }
Number.prototype.getDecimals = function() { return this - ~~this ; }
Number.prototype.countDecimals = function() { return ( "" + this ).indexOf( "." ) != -1 ? ( ( ( ( "" + this ).split(".") )[1] ).length ) : 0 ; }
Number.prototype.ranges_in = function( _min, _max, _include_bounds ) { return _include_bounds ? ( ( this < _min || this > _max ) ? 0 : 1 ) : ( ( this <= _min || this >= _max ) ? 0 : 1 ) ; }
Number.prototype.enable_bit_pos = function( _bit_pos ) { return this | Math.pow( 2, _bit_pos ); }
Number.prototype.disable_bit_pos = function( _bit_pos ) { return this & ~Math.pow( 2, _bit_pos ); }
Number.prototype.roundTo = function( _decimal_digits ) { return Math.round( this * Math.pow( 10, _decimal_digits ) ) / Math.pow( 10, _decimal_digits ); }

Number.prototype.countDecimalDigits = function()
{
    var ORIGINALvalue = safe_float( this, 0 ).toString() ;
    if ( ORIGINALvalue.indexOf( "." ) != -1 )
    {
         var a = ORIGINALvalue.toString().split( "." ) ;
         var decimal_part = a[1] ;
         return a[1].length ;
    }
    else return 0 ;        
}

Number.prototype.trunc = function( decimals, separator )
{
    var v = this + '' ;
    if ( separator.length == 0 ) separator = "." ;
    if ( v.indexOf( "." ) != -1 ) // comma is in, so we can split it
    {
        var piecesARRAY = v.split( "." ), integerPART = piecesARRAY[0], decimalPART = piecesARRAY[1] ;
        decimalPART = decimalPART.substr( 0, decimalPART.length >= decimals ? decimals : decimalPART.length ) ;
        if ( decimalPART.length < decimals ) for ( var i = decimalPART.length ; i < decimals ; i++ ) decimalPART += "0" ;
        return "" + integerPART + separator + decimalPART ;
    }
    else
    {
        v += separator ;
        for ( var decimalsCOUNTER = 0 ; decimalsCOUNTER < decimals ; decimalsCOUNTER++ ) v += "0" ;
        return v ;
    }
}

Number.prototype.is_not_one_of = function( _input )
{
    var _test_array = is_array( _input ) ? _input : arguments, _b_found = 0 ;
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found |= this == _test_array[_i] ? 1 : 0 ;
    return !_b_found ? 1 : 0 ;
}

Number.prototype.is_one_of = function( _input )
{
    var _test_array = is_array( _input ) ? _input : arguments, _b_found = 0 ;
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found |= this == _test_array[_i] ? 1 : 0 ;
    return _b_found ;
}

Number.prototype.match_bit_mask = function( _input )
{
    var _test_array = is_array( _input ) ? _input : arguments, _b_found = 0 ;
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found |= ( this & _test_array[_i] ) ? 1 : 0 ;
    return _b_found ;
}

Number.prototype.get_closer_value_from = function( _input )
{
    if ( _input != null )
    {
       if ( !is_array( _input ) ) _input = [ _input ] ;
       else if ( _input.length > 0 )
       {
          var _min = 0, _i, _tmp = null, _ret_value = null, _ret_index = null ;
          for( _i = 0 ; _i < _input.length ; _i++ )
          {
             _tmp = Math.abs( this - _input[_i] ) ;
             if ( _min == 0 || _tmp < _min )
             {
                 _min = _tmp ;
                 _ret_index = _i ;
                 _ret_value = _input[_i] ;
                 if ( _tmp == 0 ) break ;
             }
          }

          return [ _ret_index, _ret_value ] ;
       }
       else return null ;
    }
    else null ;
}

Number.prototype.sci_to_dec = function()
{
    var data= String(this).split(/[eE]/);
    if(data.length== 1) return data[0];

    var z= '', sign = this < 0? '-':'',
    str = data[0].replace('.', ''),
    mag = Number(data[1])+ 1;

    if(mag<0)
		{
        z= sign + '0.';
        while(mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;
    while(mag--) z += '0';
    return str + z;
}