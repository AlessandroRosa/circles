/*
    JS fraction class library is free software: you can redistribute it and/or modify
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
     datatype_dev : fraction
     datatype_public : fraction
     constructor1 : fraction(number,number)
     notes_constructor1 : numerator and denominator
     constructor2 : fraction(string)
     notes_constructor2 : input string of fraction
     constructor3 : fraction(fraction)
     notes_constructor3 : copy constructor
     comparison method: is_equal_to
     typization method : is_fraction
     output method: output('std')
     notes: rational fraction
     framework data type */

if ( typeof is_array != "function" ) function is_array( _obj ) { return _obj instanceof Array ? 1 : 0 ; }
if ( typeof is_complex != "function" ) function is_complex( _obj ) { return _obj instanceof complex ? 1 : 0 ; }
if ( typeof is_integer != "function" ) function is_integer( _obj ) { return is_number( _obj ) ? ( Math.floor( _obj ) == _obj ? 1 : 0 ) : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj ) { return ( typeof _obj == "number" || _obj instanceof Number ) ; }
if ( typeof is_rational != "function" ) function is_rational( _obj ) { return is_number( _obj ) ? !is_integer( _obj ) : 0 ; }
if ( typeof is_string != "function" ) function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; }

if ( typeof is_fraction != "function" )  function is_fraction( _obj )  { return _obj instanceof fraction ; }
if ( typeof is_infinity != "function" ) function is_infinity( _n ) { return _n == Infinity || _n == -Infinity ? 1 : 0 ; }
if ( typeof is_positive_infinity != "function" ) function is_positive_infinity( _n ) { return _n == Infinity ? 1 : 0 ; }
if ( typeof is_negative_infinity != "function" ) function is_negative_infinity( _n ) { return _n == -Infinity ? 1 : 0 ; }
if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

function fraction()
{
		switch( arguments.length )
		{
				case 1:
		    var _frac = arguments[0] ;

				if ( is_fraction( _frac ) )
				{
						this.p = arguments[0].p, this.q = arguments[1].q ;
				}
		    else if ( is_number( _frac ) || typeof _frac == "number" )
		    {
		         if ( _frac == 0 )
		         {
		              this.p = 0, this.q = 1 ;
		         }
		         else this.get_fraction_from_decimal( _frac, 1 );
		    }
		    else if ( is_array( _frac ) )
		    {
		         if ( _frac.length == 2 )
		         {
		              this.p = safe_int( _frac[0], 0 ), this.q = safe_int( _frac[1], 0 );
		         }
		         else this.p = this.q = 0 ;
		    }
		    else if ( /^([0-9\.]{1,})$/.test( _frac ) ) this.get_fraction_from_decimal( _frac, 1 );
		    else if ( /^([0-9\-\+]{1,})[\/]([0-9\-\+]{1,})$/.test( _frac ) )
		    {
		         var _arr = _frac.split( "/" );
		         this.p = safe_int( _arr[0], 0 ), this.q = safe_int( _arr[1], 0 );
		    }
				break ;
				case 2: this.p = safe_int( arguments[0], 0 ), this.q = safe_int( arguments[1], 0 ); break ;
				default: this.p = this.q = 0 ; break ;
		}

    this.self_reduce();
		this.correct();
}

fraction.prototype.correct = function()
{
		if ( this.is_limit_to_zero() )
		{
				 this.p = 0, this.q = 1 ;
		}
		else if ( !this.is_indeterminate() )
		{
				if ( this.p > 0 && this.q < 0 )
				{
						 this.p *= -1 ;
						 this.q *= -1 ;
				}
		}
}

fraction.prototype.is_indeterminate = function() { return ( ( is_infinity( this.p ) && is_infinity( this.q ) ) || ( this.p == 0 && this.q == 0 ) ) ? 1 : 0 ; }
fraction.prototype.zero_over_zero = function() { return ( this.p == 0 && this.q == 0 ) ? 1 : 0 ; }
fraction.prototype.infinity_over_infinity = function() { return ( is_infinity( this.p ) && is_infinity( this.q ) ) ? 1 : 0 ; }
fraction.prototype.is_infinity = function() { return ( is_infinity( this.p ) && !is_infinity( this.q ) ) ? 1 : 0 ; }
fraction.prototype.is_limit_to_zero = function() { return ( !is_infinity( this.p ) && is_infinity( this.q ) ) ? 1 : 0 ; }

fraction.prototype.read_fraction = function( _frac )
{
    if ( is_fraction( _frac ) )
    {
         this.p = safe_int( _frac.p, 0 );
         this.q = safe_int( _frac.q, 0 );
    }
    else if ( is_array( _frac ) )
    {
         if ( _frac.length == 2 )
         {
              this.p = safe_int( _frac[0], 0 );
              this.q = safe_int( _frac[1], 0 );
         }
         else this.p = this.q = 0 ;
    }
    else if ( /^([0-9]{1,})[\/]([0-9]{1,})$/.test( _frac ) )
    {
         var _arr = _frac.split( "/" );
         this.p = safe_int( _arr[0], 0 );
         this.q = safe_int( _arr[1], 0 );
    }
    else if ( is_number( number ) || typeof _frac == "number" ) // it's rational number
    {
				 var _f = this.get_fraction_from_decimal( _frac );
				 this.p = _f.p, this.q = _f.q ;
		}
    else this.p = this.q = 0 ;
}

fraction.prototype.match_signature = function( _f2 ) { return ( this.p == _f2.p && this.q == _f2.q ) ; }
fraction.prototype.is_indeterminate = function() { return ( this.p == 0 && this.q == 0 ) ? 1 : 0 ; }
fraction.prototype.array = function() { return [ this.p,  this.q ] ; }
fraction.prototype.output = function( _format, _separator )
{
   _format = safe_string( _format, "std" ), _separator = safe_string( _separator, "/" );
   switch( _format )
   {
      case "std": return this.p + _separator + this.q ; break ;
      case "html": return "<table><tr><td>" + this.p + "</td></tr><tr><td>" + this.q + "</td></tr></table>" ; break ;
      case "pq": return [ this.p, this.q ] ; break ;
      default: return this.p + _separator + this.q ; break ;
   }
}

fraction.prototype.ratio = function() { return this.p / this.q ; }
fraction.prototype.clone = function() { return new fraction( this.p, this.q ) ; }
fraction.prototype.copy = function( _f2 ) { if ( is_fraction( _f2 ) ) { this.p = _f2.p, this.q = _f2.q ; } }
fraction.prototype.set = function( _p, _q ) { this.p = _p, this.q = _q ;  }
fraction.prototype.get_num = function() { return this.p ; }
fraction.prototype.get_den = function() { return this.q ; }
fraction.prototype.set_num = function( _p ) { this.p = safe_int( _p, 0 ) ; }
fraction.prototype.set_den = function( _q ) { this.q = safe_int( _q, 0 ) ; }

fraction.prototype.get_fraction_from_decimal = function( _dec, _self )
{
    _self = safe_int( _self, 0 );
		var _dec_str = _dec + "" ;
		var _exponent = _dec_str.indexOf( "." ) != -1 ? ( ( _dec_str.split( "." ) )[1] ).length : 0 ;
		this.p = _dec * Math.pow( 10, _exponent + 1 ) ;
		this.q = 10 * Math.pow( 10, _exponent ) ;
    if ( _self )
    {
    		this.p = _dec * Math.pow( 10, _exponent + 1 ) ;
    		this.q = 10 * Math.pow( 10, _exponent ) ;
    }
    else return new fraction( _dec * Math.pow( 10, _exponent + 1 ), 10 * Math.pow( 10, _exponent ) );
}

fraction.prototype.gcd = function() { return this.gcd_params( this.q, this.p % this.q ); }
fraction.prototype.gcd_params = function(a, b) // greatest common divisor
{
    if ( !b ) return a ;
    else if ( b == 0 ) return NO ;
    return this.gcd_params(b, a % b);
}

fraction.prototype.lcm_params = function( a, b ) { return a * b / this.gcd_params( a, b ) ; }
fraction.prototype.lcm = function() { return this.lcm_params( this.p, this.q ); }

fraction.prototype.self_reduce = function()
{
    var _gcd = Math.abs( this.gcd() ) ;
    this.p = _gcd != 0 ? this.p / _gcd : Infinity ;
    this.q = _gcd != 0 ? this.q / _gcd : Infinity ;
}

fraction.prototype.reduce = function()
{
    var _gcd = this.gcd() ;
    return _gcd == 0 ? new fraction( Infinity, Infinity ) : new fraction( this.p / _gcd, this.q / _gcd ) ;
}

fraction.prototype.is_equal_to = function( _f2 ) { return ( ( this.p * _f2.q - _f2.p * this.q ) == 0 ) ? 1 : 0 ; }
fraction.prototype.is_not_equal_to = function( _f2 )  { return ( ( this.p * _f2.q - _f2.p * this.q ) != 0 ) ? 1 : 0 ; }
fraction.prototype.is_lesser = function( _f2 ) { return ( ( this.p * _f2.q - _f2.p * this.q ) < 0 ) ? 1 : 0 ; }
fraction.prototype.is_lesser_eq = function( _f2 )  { return ( ( this.p * _f2.q - _f2.p * this.q ) <= 0 ) ? 1 : 0 ; }
fraction.prototype.is_greater = function( _f2 ) { return ( ( this.p * _f2.q - _f2.p * this.q ) > 0 ) ? 1 : 0 ; }
fraction.prototype.is_greater_eq = function( _f2 ) { return ( ( this.p * _f2.q - _f2.p * this.q ) >= 0 ) ? 1 : 0 ; }

fraction.prototype.sum = function( _f2 )
{
		if ( is_number( _f2 ) ) _f2 = new fraction( _f2 ) ;
		return new fraction( this.p * _f2.q + this.q * _f2.p, this.q * _f2.q ).reduce() ;
}

fraction.prototype.sub = function( _f2 )
{
		if ( is_number( _f2 ) ) _f2 = new fraction( _f2 ) ;
		return new fraction( this.p * _f2.q - this.q * _f2.p, this.q * _f2.q ).reduce() ;
}

fraction.prototype.mul = function( _f2 )
{
		if ( is_number( _f2 ) ) _f2 = new fraction( _f2 ) ;
		return new fraction( this.p * _f2.p, this.q * _f2.q ).reduce() ;
}

fraction.prototype.div = function( _f2 )
{
		if ( is_number( _f2 ) ) _f2 = new fraction( _f2 ) ;
		return new fraction( this.p * _f2.q, this.q * _f2.p ).reduce() ;
}

// continuous fractions support
fraction.prototype.convergents = function()
{
    var _p = this.p, _q = this.q ;
    var _quot, _remainder, _convergents = [] ;
    while( 1 )
    {
        _quot = Math.floor( _p / _q ), _remainder = _p % _q ;
        _convergents.push( _quot ) ;
        if ( _remainder == 0 ) break ;
        _p = _q, _q = _remainder ;
    }

    return _convergents ;
}

fraction.prototype.remainders = function()
{
    var _p = this.p, _q = this.q, _quot, _remainder, _remainders = [] ;
    while( 1 )
    {
        _quot = Math.floor( _p / _q ), _remainder = _p % _q ;
        _remainders.push( _remainder ) ;
        if ( _remainder == 0 ) break ;
        _p = _q, _q = _remainder ;
    }

    return _remainders ;
}

fraction.prototype.extended_euclid = function()
{
    var _convergents = this.convergents(), _remainders = this.remainders();
    var _s_array = [ 1, 0 ], _t_array = [ 0, 1 ], _i ;
    for( _i = 1 ; _i <= _convergents.length ; _i++ )
    {
         _s_array.push( _s_array[_i-1] - _convergents[_i-1] * _s_array[_i] ) ;
         _t_array.push( _t_array[_i-1] - _convergents[_i-1] * _t_array[_i] ) ;
    }
}