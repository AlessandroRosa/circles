/*
    JS Complex Number Library is free software: you can redistribute it and/or modify
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

var COMPLEX_MAX_FLOAT = Number.MAX_VALUE / Math.pow( 10, 3 ), COMPLEX_MIN_FLOAT = Number.MIN_VALUE * Math.pow( 10, 3 ) ;
var COMPLEX_CLASS_MAX_ACCURACY = 12 ; // suggested value for all accuracy tests. Never exceed 20, which is max value allowed by javascript .toPrecision built-in function

if ( typeof is_array != "function" ) function is_array( _obj ) { return _obj instanceof Array ? 1 : 0 ; }
if ( typeof is_complex != "function" ) function is_complex( _obj ) { return _obj instanceof complex ? 1 : 0 ; }
if ( typeof is_integer != "function" ) function is_integer( _obj ) { return is_number( _obj ) ? ( Math.floor( _obj ) == _obj ? 1 : 0 ) : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj ) { return ( typeof _obj == "number" || _obj instanceof Number ) ; }
if ( typeof is_rational != "function" ) function is_rational( _obj ) { return is_number( _obj ) ? !is_integer( _obj ) : 0 ; }
if ( typeof is_string != "function" ) function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; }

if ( typeof is_infinity != "function" ) function is_infinity( _n ) { return _n == Infinity || _n == -Infinity ? 1 : 0 ; }
if ( typeof is_positive_infinity != "function" ) function is_positive_infinity( _n ) { return _n == Infinity ? 1 : 0 ; }
if ( typeof is_negative_infinity != "function" ) function is_negative_infinity( _n ) { return _n == -Infinity ? 1 : 0 ; }
if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof sci_to_dec != "function" )
{
    function sci_to_dec( _number )
    {
        var data= String(_number).split(/[eE]/);
        if(data.length== 1) return data[0];

        var  z= '', sign= _number < 0? '-':'',
        str= data[0].replace('.', ''),
        mag= Number(data[1])+ 1;

        if(mag<0){
            z= sign + '0.';
            while(mag++) z += '0';
            return z + str.replace(/^\-/,'');
        }
        mag -= str.length;
        while(mag--) z += '0';
        return str + z;
    }
}

if ( typeof degree != "function" )    function degree( rad ) { return ( rad % ( 2 * Math.PI ) ) / Math.PI * 180 ; }
if ( typeof radians != "function" )   function radians( deg ) { return ( deg % 360 ) / 180 * Math.PI ; }
if ( typeof frompolar != "function" ) function frompolar( r, theta ) { return arguments.length == 2 ? new complex( r * Math.cos(theta), r * Math.sin(theta) ) : null ; }

function complex( r, i ) { this.real = safe_float( r, 0 ), this.imag = safe_float( i, 0 ) ; this.customclass = arguments.callee.name ; }
complex.prototype.init_from_obj = function( _c2 ) { if ( is_complex( _c2 ) ) { this.real = _c2.real, this.imag = _c2.imag } ; }
complex.prototype.copy = function() { return new complex( this.real, this.imag ) ; }
complex.prototype.clone = function() { return new complex( this.real, this.imag ) ; }
complex.prototype.clean_round_off = function( _accuracy, _self )
{
		_self = safe_int( _self, 0 );
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), COMPLEX_CLASS_MAX_ACCURACY ), COMPLEX_CLASS_MAX_ACCURACY ) ;
		if ( _self )
		{
				this.real = this.real.clean_round_off( _accuracy ) ;
				this.imag = this.imag.clean_round_off( _accuracy ) ;
		}
		else return new complex( this.real.clean_round_off( _accuracy ), this.imag.clean_round_off( _accuracy ) );
}

complex.prototype.roundTo = function( _accuracy, _self )
{
    // it's a sort of truncation
		_self = safe_int( _self, 0 );
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), COMPLEX_CLASS_MAX_ACCURACY ), COMPLEX_CLASS_MAX_ACCURACY ) ;
    _accuracy = Math.pow( 10, _accuracy ) ;
    if ( _self )
    {
				this.real = Math.round ( this.real * _accuracy ) / _accuracy ;
				this.imag = Math.round ( this.imag * _accuracy ) / _accuracy ;
		}
    else return new complex( Math.round ( this.real * _accuracy ) / _accuracy, Math.round ( this.imag * _accuracy ) / _accuracy );
}

complex.prototype.no_trailing_zeros = function( _up_to_digit, _overwrite )
{
    _overwrite = safe_int( _overwrite, 1 );
    var _real_parts = ( this.real + "" ).indexOf(".") != -1 ? ( this.real + "" ).split(".") : [ this.real + "", "" ] ;
    var _real_decs = ( this.real + "" ).indexOf(".") != -1 ? _real_parts[1].replace( "0.", "" ) : "" ;
    var _r1 = _real_decs.indexOf( "00" ) ;
    _real_decs = _real_decs.substring( 0, _r1 != -1 ? ( _r1 < _up_to_digit ? _up_to_digit : _m1 ) : _real_decs.length ) ;

    var _imag_parts = ( this.imag + "" ).indexOf(".") != -1 ? ( this.imag + "" ).split(".") : [ this.imag + "", "" ] ;
    var _imag_decs = ( this.imag + "" ).indexOf(".") != -1 ? _imag_parts[1].replace( "0.", "" ) : "" ;
    var _r1 = _imag_decs.indexOf( "00" ) ;
    _imag_decs = _imag_decs.substring( 0, _r1 != -1 ? ( _r1 < _up_to_digit ? _up_to_digit : _m1 ) : _imag_decs.length ) ;
    
    if ( _overwrite )
    {
       this.real = safe_float( _real_parts[0] + "." + _real_decs ) ;
       this.imag = safe_float( _imag_parts[0] + "." + _imag_decs ) ;
    }
    else return new complex( safe_float( _real_parts[0] + "." + _real_decs ), safe_float( _imag_parts[0] + "." + _imag_decs ) ) ;
}

complex.prototype.safe_complex = function( _safe_c )
{
    if ( !is_complex( _safe_c ) ) return this ;
    this.real = safe_float( this.real, _safe_c.real ) ;
    this.imag = safe_float( this.imag, _safe_c.real ) ;
}

complex.prototype.write = function()           			 { document.write( "r:" + this.real.toString() + " i:" + this.imag.toString() ) ; }
complex.prototype.output = function( _round_digits ) { return this.formula() ; }
complex.prototype.formula = function( _b_unit, _b_approx, _round_digits )
{
    _round_digits = safe_int( _round_digits, COMPLEX_CLASS_MAX_ACCURACY );
    _b_unit = safe_int( _b_unit, 0 );
    if ( this.imag != 0 ) _b_unit = 1 ;

    if ( _b_approx == null || _b_approx == "undefined" ) _b_approx = 1 ;
    _b_approx = safe_int( _b_approx, 1 );

    var _r = _b_approx ? this.real.toFixed(_round_digits) : this.real ;
    var _i = _b_approx ? this.imag.toFixed(_round_digits) : this.imag ;
    var bRE = safe_float( _r, 0 ) != 0 ? 1 : 0, bIM = safe_float( _i, 0 ) != 0 ? 1 : 0 ;
    var RE = "", IM = "" ;

    if ( this.real == 1 ) RE = "1" ;
    else if ( this.real == -1 ) RE = ( _b_unit || !bIM ) ? "-1" : "-" ;
    else if ( this.real != 0 ) RE = _r + "" ;
    else RE = "" ;

    // remove trailing zeros after comma
    if ( RE.indexOf( "." ) != -1 ) RE = sci_to_dec( safe_float( RE, 0 ) ) ;

    if ( this.imag == 1 ) IM = "i" ;
    else if ( this.imag == -1 ) IM = "-i" ;
    else if ( this.imag != 0 ) IM = _i + "" ;
    else IM = "" ;

    // remove trailing zeros after comma
    if ( IM.indexOf( "." ) != -1 ) IM = sci_to_dec( safe_float( IM, 0 ) );

    var open = ( bRE && bIM ) ? "(" : "" ;
    var close = ( bRE && bIM ) ? ")" : "" ;
    var frm = open ;
        frm += ( bRE ) ? RE : "" ;
        frm += ( bIM ) ? ( ( bRE ? "+" : "" ) + IM + ( this.imag != 1 ? "i" : "" ) ) : "" ;
        if ( !bRE && !bIM ) frm = "0" ;
        frm += close ;

    frm = frm.replace( "ii", "i" );
    frm = frm.replace( "\+\+", "+" ).replace( "\-\-", "+" );
    frm = frm.replace( "\+\-", "-" ).replace( "\-\+", "-" );
    frm = frm.replace( /\s+/g, "" ).replace( /\(/g, "" ).replace( /\)/g, "" ) ;
    return frm ;
}

complex.prototype.r = function() { return this.real ; }
complex.prototype.i = function() { return this.imag ; }

// define constants
complex.prototype.zero = function() { return new complex(0.0,0.0) ; }
complex.prototype.origin = function()    { return new complex(0.0,0.0) ; }
complex.prototype.real_unit = function() { return new complex(1.0,0.0) ; }
complex.prototype.imag_unit = function() { return new complex(0.0,1.0) ; }

complex.prototype.angle = function()            { return Math.atan2( this.imag, this.real ); } // returns in radians from -PI to +PI
complex.prototype.angle2PI = function() { return Math.PI * 2.0 - Math.atan2( this.imag, this.real ); } // returns in radians from 0 to + 2PI
complex.prototype.arg = function()         			{ return this.angle() ; } // alias of angle
complex.prototype.arg2PI = function()      			{ return this.angle2PI() ; } // alias of angle2PI
complex.prototype.argument = function() { return this.angle() ; } // alias of angle
complex.prototype.argument2PI = function() { return this.angle2PI() ; } // alias of angle2PI
complex.prototype.conj = function()        			{ return new complex( this.real, -this.imag ); }
complex.prototype.conj_x = function()      			{ return new complex( -this.real, this.imag ); }
complex.prototype.opposite = function() { return new complex( -this.real, -this.imag ); }
complex.prototype.distance = function( z ) { return Math.sqrt( Math.pow( this.real - z.real, 2.0 ) + Math.pow( this.imag - z.imag, 2.0 ) ) ; }
complex.prototype.frompolar = function( r, th ) { return new complex( r * Math.cos(th), r * Math.sin(th) ) ; }
complex.prototype.polar = function() 						{ return { 'radius' : this.radius(), 'arg' : this.arg2PI() } ; }
complex.prototype.inv = function()              { return ( new complex( 1.0, 0.0 ) ).div( this ) ; }
complex.prototype.norm = function()             { return ( this.real * this.real + this.imag * this.imag ) ; }
complex.prototype.radius = function() { return Math.sqrt( this.norm() ) ;	}
complex.prototype.abs = function()           		{ return this.radius() ; }
complex.prototype.infinity_complex = function() { return new complex( Infinity, Infinity ) ; }

complex.prototype.is_real = function() { return ( this.imag == 0 ) ? 1 : 0 ; }
complex.prototype.is_imaginary = function()    { return ( this.real == 0 && this.imag != 0 ) ? 1 : 0 ; }
complex.prototype.is_complex = function() { return ( this.real != 0 && this.imag != 0 ) ? 1 : 0 ; }
complex.prototype.is_zero = function() { return ( this.real == 0 && this.imag == 0 ) ? 1 : 0 ; }
complex.prototype.is_real_unit = function()    { return ( this.real == 1 && this.imag == 0 ) ? 1 : 0 ; }
complex.prototype.is_imag_unit = function()    { return ( this.real == 0 && this.imag == 1 ) ? 1 : 0 ; }
complex.prototype.is_complex_unit = function() { return ( this.radius() == 1 && this.argument() != 0 ) ? 1 : 0 ; }
complex.prototype.is_gaussian_int = function() { return ( this.real == safe_int( this.real, 0 ) && this.imag == safe_int( this.imag, 0 ) ) ; }
complex.prototype.is_finite = function()			 { return is_infinity( this.real ) || is_infinity( this.imag ) ? 0 : 1 ; }
complex.prototype.is_infinity_complex = function() { return !this.is_finite() ; }

complex.prototype.set_real = function( r ) { this.real = r ; }
complex.prototype.set_imag = function( i ) { this.imag = i ; }
complex.prototype.set_coords = function( r, i ) { this.real = r, this.imag = i ; }

complex.prototype.is_equal_to = function( _z, _tolerance )  { _tolerance = safe_float( _tolerance, 0 ) ; return this.distance( _z ) <= _tolerance ? 1 : 0 ; }
complex.prototype.is_not_equal_to = function( _z, _tolerance )  { _tolerance = safe_float( _tolerance, 0 ) ; return this.distance( _z ) <= _tolerance ? 0 : 1 ; }
complex.prototype.isNaN = function() { return ( isNaN( this.r() ) || isNaN( this.i() ) ) ? 1 : 0 ; }

complex.prototype.add = function( a2 )
{
    if ( !is_complex( a2 ) ) a2 = new complex( safe_float( a2, 0 ), 0.0 ) ;
    return new complex( this.real + a2.real, this.imag + a2.imag ) ;
}

complex.prototype.sub = function( s2 )
{
    if ( !is_complex( s2 ) ) s2 = new complex( safe_float( s2, 0 ), 0.0 ) ;
    return new complex( this.real - s2.real, this.imag - s2.imag ) ;
}

complex.prototype.mul = function( c_mul2 )
{
    if ( !is_complex( c_mul2 ) ) c_mul2 = new complex( safe_float( c_mul2, 0 ), 0.0 ) ;
    return new complex ( this.real * c_mul2.real - this.imag * c_mul2.imag, this.real * c_mul2.imag + this.imag * c_mul2.real ) ;
}

complex.prototype.div = function( c_divisor, _approx )
{
    _approx = safe_int( _approx, 0 );
    if ( !is_complex( c_divisor ) ) c_divisor = new complex( safe_float( c_divisor, 0 ), 0.0 ) ;
    else if ( c_divisor.is_infinity_complex() && !_approx ) return this.zero();
  	var norm = c_divisor.norm();
    if ( norm == Infinity && _approx == 1 ) { c_divisor.real = c_divisor.imag = COMPLEX_MAX_FLOAT, norm = COMPLEX_MAX_FLOAT ; }
    else if ( norm == -Infinity && _approx == 1 ) { c_divisor.real = c_divisor.imag = -COMPLEX_MAX_FLOAT, norm = -COMPLEX_MAX_FLOAT ; }
  	else if ( norm == 0 && _approx == 0 ) return new complex( Infinity, Infinity ) ;
  	else if ( norm == 0 && _approx == 1 ) { c_divisor.real = c_divisor.imag = COMPLEX_MIN_FLOAT, norm = COMPLEX_MIN_FLOAT ; }
    return new complex( ( this.real * c_divisor.real + this.imag * c_divisor.imag ) / norm,
  	  									( this.imag * c_divisor.real - this.real * c_divisor.imag ) / norm );
}

complex.prototype.pow = function( exponent )
{
   if ( this.radius() == 0 ) return new complex( 0.0, 0.0 ) ;
   else
   {
       if ( !is_complex( exponent ) ) exponent = new complex( exponent, 0.0 ) ;
       return ( exponent.mul( this.ln() ) ).exp() ;
   }
}
complex.prototype.sqrt = function()		{	return this.pow( new complex( 0.5, 0.0 ) ) ; }
// Neperian (natural) Logarithm
complex.prototype.ln = function() { return new complex( Math.log( this.radius() ), this.angle() ) ; }
// Base 10 Logarithm
complex.prototype.log = function()		{ return ( this.ln() ).div( ( new complex( 10.0, 0.0 ) ).ln() ) ; }
complex.prototype.exp = function()    { return new complex( Math.exp( this.real ) * Math.cos( this.imag ), Math.exp( this.real ) * Math.sin( this.imag ) ) ; }
// Trigonometric
complex.prototype.sin = function()
{
	/*
               e^(iz) - e^(-i*z)
      sin(z) = -----------------
                      2i
  */
	var num = _CONSTANT_COMPLEX_I.mul( this ).exp().sub( ( ( _CONSTANT_COMPLEX_I.mul( this ) ).opposite() ).exp() );
	return num.div( _CONSTANT_COMPLEX_I.mul(2.0) );
}

complex.prototype.cos = function()
{
	/*
               e^(iz) + e^(-i*z)
      cos(z) = -----------------
                      2
  */
	
	return ( _CONSTANT_COMPLEX_I.mul( this ).exp() ).add( ( ( _CONSTANT_COMPLEX_I.mul( this ) ).opposite() ).exp() ).div( 2.0 ) ;
}

complex.prototype.tg = function()
{
	/*
                  e^(iz) - e^(-i*z)
      tg(z) = -------------------------
              i * ( e^(iz) + e^(-i*z) )
  */
  var num = ( _CONSTANT_COMPLEX_I.mul( this ).exp() ).sub( ( _CONSTANT_COMPLEX_I.mul( this ).opposite() ).exp() );
  var den = ( ( _CONSTANT_COMPLEX_I.mul( this ).exp() ).add( ( _CONSTANT_COMPLEX_I.mul( this ).opposite() ).exp() ) ).mul(_CONSTANT_COMPLEX_I);
	return num.div( den ) ;
}

complex.prototype.ctg = function()
{
	/*
               i * ( e^(iz) + e^(-i*z) )
      ctg(z) = -------------------------
                   e^(iz) - e^(-i*z)
  */
  var num = ( ( _CONSTANT_COMPLEX_I.mul( this ).exp() ).add( ( ( _CONSTANT_COMPLEX_I.mul( this ) ).opposite() ).exp() ) ).mul(_CONSTANT_COMPLEX_I);
  var den = ( _CONSTANT_COMPLEX_I.mul( this ).exp() ).sub( ( ( _CONSTANT_COMPLEX_I.mul( this ) ).opposite() ).exp() );
	return num.div( den ) ;
}

complex.prototype.sec = function()	 { return this.cos().inv() ; }
complex.prototype.cosec = function() { return this.sin().inv() ; }
// Hyperbolic
complex.prototype.cosh = function()
{
   /*             e^z + e^(-z)
        cosh(z) : ------------
                      2.0
   */
	 return this.exp().add( this.opposite().exp() ).div( 2.0 ) ;
}

complex.prototype.sinh = function()
{
   /*            e^z - e^(-z)
      cosh(z) : ------------
                    2.0
   */
	 return this.exp().sub( ( this.opposite() ).exp() ).div( 2.0 ) ;
}

complex.prototype.tgh = function()
{
   /*            e^z - e^(-z)
        tgh(z) : ------------
                 e^z + e^(-z)
   */
   return this.exp().sub( this.opposite().exp() ).div( this.exp().add( this.opposite().exp() ) );
}

complex.prototype.ctgh = function()
{
    /*          e^z + e^(-z)
       ctgh(z): ------------
                e^z - e^(-z)
    */
    return this.exp().add( this.opposite().exp() ).div( this.exp().sub( this.opposite().exp() ) );
}

complex.prototype.sech = function()		{ return this.cosh().inv() ; }
complex.prototype.cosech = function()	{ return this.sinh().inv() ; }
// Inverse Trigonometric
complex.prototype.asin = function()
{
  	/*
  	             ln( iz - sqrt(1-z^2) )
  	   asin(z) : ----------------------
  	                      i
  	*/
	
  	var iz = _CONSTANT_COMPLEX_I.mul(this) ;
  	var _1_sqrt = ( ( this.real_unit() ).sub( this.mul( this ) ) ).sqrt() ;
  	var numerator = ( iz.sub( _1_sqrt ) ).ln() ;
  	return numerator.div( _CONSTANT_COMPLEX_I ) ;
}

complex.prototype.acos = function()
{
  	/*
  	             ln( z - sqrt(1-z^2) * i )
  	   asin(z) : -------------------------
  	                      i
  	*/
  	var _1_sqrt = ( this.real_unit().sub( this.mul( this ) ) ).pow( 0.5 ) ;
  	var numerator = ( this.sub( _1_sqrt.mul( _CONSTANT_COMPLEX_I ) ) ).ln() ;
  	return numerator.div( _CONSTANT_COMPLEX_I ) ;
}

complex.prototype.atg = function()
{
  	/*
  	             ln( iz - sqrt(1-z^2) )
  	   atg(z) : -------------------------
  	            ln( z - sqrt(1-z^2) * i )
  	*/
  	var iz = _CONSTANT_COMPLEX_I.mul(this) ;
   	var _1_sqrt = ( this.real_unit().sub( this.mul( this ) ) ).sqrt() ;
   	var numerator = ( iz.sub( _1_sqrt ) ).ln() ;
   	var denominator = ( this.sub( i.mul( _1_sqrt ) ) ).ln() ;
  	return numerator.div( denominator ) ;
}

complex.prototype.actg = function()
{
  	/*
  	             ln( z - sqrt(1-z^2) * i )
  	   actg(z) : -------------------------
    	            ln( iz - sqrt(1-z^2) )
  	*/

  	var iz = _CONSTANT_COMPLEX_I.mul(this) ;
   	var _1_sqrt = ( ( this.real_unit() ).sub( this.mul( this ) ) ).sqrt() ;
   	var denominator = ( iz.sub( _1_sqrt ) ).ln() ;
   	var numerator = ( this.sub( i.mul( _1_sqrt ) ) ).ln() ;
	  return numerator.div( denominator ) ;
}

complex.prototype.asec = function()   { return this.acos().inv() ; }
complex.prototype.acosec = function() { return this.asin().inv() ; }
// Inverse Hyperbolic
complex.prototype.asinh = function()  { return ( _CONSTANT_COMPLEX_I.mul(this).asin() ).div( _CONSTANT_COMPLEX_I ); }
complex.prototype.acosh = function()  { return this.acos().div( _CONSTANT_COMPLEX_I ); }
complex.prototype.atgh = function()
{
  	var asin_iz = _CONSTANT_COMPLEX_I.mul(this).asin();
  	return asin_iz.div( this.acos() );
}

complex.prototype.actgh = function()
{
   	var asin_iz = _CONSTANT_COMPLEX_I.mul( this ).asin();
    return this.acos().div( asin_iz );
}

complex.prototype.asech = function()   { return this.acosh().inv() ; }
complex.prototype.acosech = function() { return this.asinh().inv() ; }

// Miscellaneous
complex.prototype.euclidean_dist = function( z_to ) { return Math.sqrt( ( this.real - z_to.real ) * ( this.real - z_to.real ) + ( this.imag - z_to.imag ) * ( this.imag - z_to.imag ) ) ; }
complex.prototype.rotate = function( center, angle /*radians*/ )
{
    angle = safe_float( angle, 0 );
    var t = this.sub( center ), r = t.radius(), a = t.angle() ;
    var rotated_point = new complex( r * Math.cos( a + angle ), r * Math.sin( a + angle ) );    
	  return rotated_point.add( center ) ;
}

// stereographic projection
// from the Riemann sphere (diameter 1, center at the origin) to the complex plane
// u,v,w are coordinates over the sphere
complex.prototype.inverse_stereographic = function( u, v, w )   { return new complex( u / ( 1 - w ), v / ( 1 - w ) ) ; }
// from the complex plane to the Riemann sphere
complex.prototype.sphere = function()
{
    var r = this.real, i = this.imag ;
  	var den = r * r + i * i + 1 ;
  	var u = r / den , v = i / den, w = ( r * r + i * i ) / den ;
  	return [ u, v, w ] ;
}

complex.prototype.circle_inversion = function( circle_x_center, circle_y_center, circle_radius, z /* of complex type */ )
{
    var dX = ( z.r() - circle_x_center ), dY = ( z.i() - circle_y_center ) ;
    var R2 = ( circle_radius * circle_radius ) ;
    var x1 = ( dX != 0 && dY != 0 ) ? circle_x_center + ( R2 * dX ) / ( dX * dX + dY * dY ) : "inf" ;
    var y1 = ( dX != 0 && dY != 0 ) ? circle_y_center + ( R2 * dY ) / ( dX * dX + dY * dY ) : "inf" ;
    return new complex( x1, y1 );
}

// EXTERNALS
function cross_ratio( _z1, _z2, _z3, _z4 )
{
		if ( !is_complex( _z1 ) || !is_complex( _z2 ) || !is_complex( _z3 ) || !is_complex( _z4 ) ) return null ;
		else return ( _z1.sub( _z3 ) ).div( _z1.sub( _z4 ) ).div( ( _z2.sub( _z3 ) ).div( _z2.sub( _z4 ) ) );
}

function on_a_same_circle_test( _z1, _z2, _z3, _z4 )
{
		var _cr = cross_ratio( _z1, _z2, _z3, _z4 );
		return is_complex( _cr ) ? _cr.is_real() : 0 ;
}

function is_complex_number( _input_str )  { return ( ( parse_complex_from_string( _input_str ) ) == null ) ? 0 : 1 ; }
function parse_complex_from_string( str )
{
    if ( safe_string( str, "" ).trim().length == 0 ) return null ;
    str += "" ;
    str = str.toLowerCase().trim();
    str = str.replace( /\s+/g, "" ) ;
    str = str.replace(/[\,]/g, ".").replace(/[^\i\e\^\(\)0-9\.\-\+]/g, "").replace(/([i]{2,})/g, "i");
    // this regex pattern checks input to be a complex number in the following formats
    // a+bi, a-bi, ai+b, ai-b where both a,b are float
    var rect_fmt = new RegExp( "^([\-\+]{0,})([0-9i\.]{0,})([\-\+]{0,})([0-9i\.]{0,})$" ) ;
    var polar_fmt = new RegExp( "^([\-\+]{0,})([0-9\.]{0,})\e([\^]{1})([\(]{1})([\-\+]{0,})([0-9\.]{0,})([\i]{1})([\)]{1})$" ) ;
    var _mask = ( rect_fmt.test( str ) ? 1 : 0 ) | ( polar_fmt.test( str ) ? 2 : 0 ) ;

    if ( !_mask ) return null ;

    if ( _mask & 1 )
    {
        var complexARRAY = null, sign1 = str.charAt(0), sign2 = "" ;
        if ( sign1 != "+" && sign1 != "-" ) sign1 = "+" ;
        else str = str.substr( 1, str.length - 1 );

        if ( str.indexOf( "+" ) != -1 ) sign2 = "+" ;
        else if ( str.indexOf( "-" ) != -1 ) sign2 = "-" ;

        complexARRAY = ( sign2.length > 0 ) ? str.split( sign2 ) : new Array( str ) ;
        if ( complexARRAY.length == 2 )
        {
            var real = "0", imag = "0" ;
            if ( complexARRAY[0].indexOf( "i" ) != -1 ) imag = complexARRAY[0] ;
            else real = complexARRAY[0] ;
            if ( complexARRAY[1].indexOf( "i" ) != -1 ) imag = complexARRAY[1] ;
            else real = complexARRAY[1] ;

            imag = imag == "i" ? 1.0 : imag.replace( "i", "" );
            if ( real.length == 0 ) real = 0 ;
            if ( imag.length == 0 ) imag = 0 ;

            return new complex( safe_float( sign1+real, 0 ), safe_float( sign2+imag, 0 ) ) ;
        }
        else if ( complexARRAY.length == 1 )
        {
            var _d = complexARRAY[0] ;
            var _is_real = ( sign1 + _d ).indexOf( "i" ) == -1 ? 1 : 0 ;
            if ( _d == "i" ) _d = 1.0 ;
            var _v = safe_int( _is_real ? sign1+_d : ( sign1+_d ).replace( "i", "" ), 0 ) ;
            return isNaN( _v ) ? null : ( _is_real ? new complex( safe_float( sign1+_d ), 0.0 ) : new complex( 0.0, safe_float( sign1+_d ), 0 ) ) ;
        }
        else return null ;
    }
    else
    {
        var _tokens = str.split( "e" );
        var _rad = safe_float( _tokens[0], 1 );
        var _ang = _tokens[1].replace( /[\i\e\^\(\)]/g, "" ) ;    if ( _ang == "-" || _ang == "+" || _ang.length == 0 ) _ang = safe_float( _ang + "1", 0 ) ;
        return frompolar( _rad, _ang * Math.PI ) ;
    }
}

// COMPLEX CONSTANTS
var _CONSTANT_COMPLEX_I = ( new complex() ).imag_unit();