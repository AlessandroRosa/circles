/*
    JS p-adic class library is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Code by Alessandro Rosa - zandor_zz@yahoo.it

  /* framework data type
     datatype_dev : p_adic
     datatype_public : p-adic number
     constructor1 : p_adic(number,number)
     notes_constructor1 : number and base
     comparison method: is_equal_to
     typization method : is_p_adic
     output method: output()
     notes : p-adic numbers class manager
     framework data type */

if ( typeof is_array != "function" ) function is_array( _obj ) { return _obj instanceof Array ? 1 : 0 ; }
if ( typeof is_complex != "function" ) function is_complex( _obj ) { return _obj instanceof complex ? 1 : 0 ; }
if ( typeof is_integer != "function" ) function is_integer( _obj ) { return is_number( _obj ) ? ( Math.floor( _obj ) == _obj ? 1 : 0 ) : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj ) { return ( typeof _obj == "number" || _obj instanceof Number ) ; }
if ( typeof is_rational != "function" ) function is_rational( _obj ) { return is_number( _obj ) ? !is_integer( _obj ) : 0 ; }
if ( typeof is_string != "function" ) function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; }
if ( typeof is_p_adic != "function" )  function is_p_adic( _obj )  { return _obj instanceof p_adic ; }

if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

var P_ADIC_CLASS_MAX_DIGITS = 20 ;

function p_adic( _n, _base )
{
    _n = safe_float( _n, 0 ), _base = safe_int( _base, 10 ) ;
    this.n = _n, this.base = safe_int( _base ), this.expansion = "" ;
    this.max_digits = P_ADIC_CLASS_MAX_DIGITS ;
    
    this.alphabet = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
                      "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                      "U", "V", "X", "Y", "Z" ] ;
}

p_adic.prototype.output = function() { return this.expansion ; }
p_adic.prototype.reverse_str = function( _str ) { return is_string( _str ) ? _str.split('').reverse().join('') : _str ; }
p_adic.prototype.set_max_digits = function( _s ) { this.max_digits = _s ; }
p_adic.prototype.get_max_digits = function()     { return this.max_digits ; }
p_adic.prototype.set_base = function( _base ) { this.base = safe_int( Math.min( Math.max( 2, Math.abs( _base ) ), this.alphabet.length ), 10 ) ; }
p_adic.prototype.get_base = function() { return this.base ; }
p_adic.prototype.gcd = function( _p, _q ) // greatest common divisor
{
    if ( !_q ) return _p ;
    return this.gcd( _q, _p % _q );
}

p_adic.prototype.reduce = function( _p, _q )
{
    var _gcd = this.gcd() ;
    return [ _p / _gcd, _q / _gcd ] ;
}

p_adic.prototype.get_fraction_from_decimal = function( _dec )
{
    _self = safe_int( _self, 0 );
		var _dec_str = _dec + "" ;
		var _exponent = _dec_str.indexOf( "." ) != -1 ? ( ( _dec_str.split( "." ) )[1] ).length : 0 ;
		var p = _dec * Math.pow( 10, _exponent + 1 ) ;
		var q = 10 * Math.pow( 10, _exponent ) ;
    if ( _self )
    {
    		p = _dec * Math.pow( 10, _exponent + 1 ) ;
    		q = 10 * Math.pow( 10, _exponent ) ;
    }
    else return [ p, q ];
}

p_adic.prototype.change_base = function( _n, _base, _neg_powers )
{
    var _r = 0, _q = 0, _out = "" ;
    _neg_powers = safe_int( _neg_powers, 0 );
    if ( !_neg_powers )
    {
        while( true )
        {
            _r = _n % _base, _out = this.alphabet[_r] + _out, _n = ( _n / _base ) >> 0 ;
            if ( _n == 0 ) break ;
        }
    }
    else
    {
        var _cnt = 0, _t = 0 ;
        while( true )
        {
            _q = _n * _base, _t = _q >> 0, _out = _out + this.alphabet[_t], _n = _q - _t ;
            if ( _n == 0 || _cnt == this.max_digits ) break ;
            _cnt++ ;
        }
    }
    
    return _out ;
}

p_adic.prototype.ary_convert = function( _n, _base )
{
    _n = safe_float( _n, this.n );
    _base = safe_int( Math.min( Math.max( 2, Math.abs( _base ) ), this.alphabet.length ), this.base ) ;
    var _is_neg = _n < 0 ? 1 : 0, _out = "" ;
    _n = Math.abs( _n );
    var _n_decs = ( "" + _n ).indexOf( "." ) != -1 ? ( ( ( ( "" + _n ).split(".") )[1] ).length ) : 0 ;
    var _int_n = ~~_n, _dec_n = _n - _int_n ;
    _out += ( _int_n > 0 ) ? this.change_base( Math.abs( _int_n ), _base ) : "0" ;
    if ( _dec_n > 0 ) _out += "." + this.change_base( _dec_n, _base, 1 );
    _out = ( _is_neg ? "-" : "" ) + _out ;
    this.base = _base, this.expansion = _out ;
    return { 'expr' : _out, 'base' : _base, 'maxdigits' : this.max_digits, 'representation' : 'ary' } ;
}

p_adic.prototype.adic_convert = function( _n, _base )
{
    _n = safe_float( _n, this.n );
    _base = safe_int( Math.min( Math.max( 2, Math.abs( _base ) ), this.alphabet.length ), this.base ) ;
    var _is_neg = _n < 0 ? 1 : 0, _out = "" ;
    _n = Math.abs( _n );
    var _n_decs = ( "" + _n ).indexOf( "." ) != -1 ? ( ( ( ( "" + _n ).split(".") )[1] ).length ) : 0 ;
    var _int_n = ~~_n, _dec_n = _n - _int_n ;
    _out += ( _int_n > 0 ) ? this.reverse_str( this.change_base( Math.abs( _int_n ), _base ) ) : "0" ;
    if ( _dec_n > 0 ) _out += "." + this.change_base( _dec_n, _base, 1 );
    _out = ( _is_neg ? "-" : "" ) + _out ;
    this.base = _base, this.expansion = _out ;
    return { 'expr' : _out, 'base' : _base, 'maxdigits' : this.max_digits, 'representation' : 'adic' } ;
}

p_adic.prototype.back_to_dec = function()
{
    var _chunks = this.expansion.indexOf( "." ) != -1 ? this.expansion.split(".") : [ this.expansion, "" ] ;
    var _int_digits = _chunks[0], _dec_digits = _chunks[1] ;
    var _int = 0, _dec = 0, _i ;
    for( _i = _int_digits.length ; _i > 0 ; _i-- )
    _int += Math.pow( _base * safe_int( _int_digits[_i], 0 ), _int_digits.length - _i );

    for( _i = 0 ; _i < _dec_digits.length ; _i++ )
    _dec += Math.pow( _base * safe_int( _dec_digits[_i], 0 ), -_i );

    return _int + _dec ;
}