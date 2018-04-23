/*
    JS Mobius map class library is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Code by Alessandro Rosa - alessandro.a.rosa@gmail.com
/*
    az + b
    ------
    cz + d
    
    with complex entries a, b, c, d
*/

  /*frameworkdatatype
     datatype_dev : mobius_map
     datatype_public : mobius_map
     constructor1 : mobius_map( array_of_four_complex_numbers )
     notes_constructor1 : 
     constructor2 : mobius_map(mobius_map)
     notes_constructor2 : copy constructor
     output method: output()
     comparison method: is_equal_to
     typization method : is_mobius_map
     notes: mobius_map
     frameworkdatatype*/

if ( typeof is_array != "function" ) function is_array( _obj ) { return _obj instanceof Array ? 1 : 0 ; }
if ( typeof is_complex != "function" ) function is_complex( _obj ) { return _obj instanceof complex ? 1 : 0 ; }
if ( typeof is_integer != "function" ) function is_integer( _obj ) { return is_number( _obj ) ? ( Math.floor( _obj ) == _obj ? 1 : 0 ) : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj ) { return ( _obj instanceof Number || typeof _obj == "number" ) ? 1 : 0 ; }
if ( typeof is_rational != "function" ) function is_rational( _obj ) { return is_number( _obj ) ? !is_integer( _obj ) : 0 ; }
if ( typeof is_string != "function" ) function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; }

if ( typeof is_infinity != "function" ) function is_infinity( _n ) { return _n == Infinity || _n == -Infinity ? 1 : 0 ; }
if ( typeof is_positive_infinity != "function" ) function is_positive_infinity( _n ) { return _n == Infinity ? 1 : 0 ; }
if ( typeof is_negative_infinity != "function" ) function is_negative_infinity( _n ) { return _n == -Infinity ? 1 : 0 ; }
if ( typeof is_mobius_map != "function" ) function is_mobius_map( _obj ) { return _obj instanceof mobius_map ; }
if ( typeof is_circle != "function" ) function is_circle( _c ) { return _c instanceof circle ? 1 : 0 ; }
if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ) ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof XOR != "function" ) function XOR(a,b) { return ( a ? 1 : 0 ) ^ ( b ? 1 : 0 ); }

var MOBIUS_MAP_MAX_ACCURACY = 14 ; // don't exceed 20, which is max value allowed by javascript .toPrecision built-in function
var MOBIUS_MAP_ZERO_LIMIT = new complex( Math.pow( 10, -MOBIUS_MAP_MAX_ACCURACY ), Math.pow( 10, -MOBIUS_MAP_MAX_ACCURACY ) ) ;
var MOBIUS_MAP_UNKNOWN_CLASS = -1, MOBIUS_MAP_UNKNOWN_KIND = -1, MOBIUS_MAP_SKIP_ACCURACY = -1 ;
var MOBIUS_MAP_CIRCULAR_CLASS = 1 ;
var MOBIUS_MAP_HYPERBOLIC_CLASS = 2 ;
var MOBIUS_MAP_LOXODROMIC_CLASS = 4 ;
var MOBIUS_MAP_PARABOLIC_CLASS = 8 ;
var MOBIUS_MAP_NEARLY_PARABOLIC_CLASS = 16 ;
var MOBIUS_MAP_ELLIPTIC_CLASS = 32 ;

var MOBIUS_MAP_SCALING_KIND = 64 ;
var MOBIUS_MAP_CONTRACTION_KIND = 128 ;
var MOBIUS_MAP_DILATION_KIND = 256 ;
var MOBIUS_MAP_ROTATION_KIND = 512 ;
var MOBIUS_MAP_TRANSLATION_KIND = 1024 ;
var MOBIUS_MAP_INVERSION_KIND = 2048 ;
var MOBIUS_MAP_INVOLUTION_KIND = 4096 ;
var MOBIUS_MAP_FRACTIONALMAP_KIND = 8192 ;
var MOBIUS_MAP_CONSTANT_KIND = 16384 ;
var MOBIUS_MAP_IDENTITY_KIND = 32768 ;
var MOBIUS_MAP_ZERO_CLASS = 65536 ;

var MOBIUS_MAP_ANTI_HOMOGRAPHY_MASK_NUM = 1 ;
var MOBIUS_MAP_ANTI_HOMOGRAPHY_MASK_DEN = 2 ;

function mobius_map()
{
	this.customclass = arguments.callee.name ;
    this.notes = "" ;
    this.anti_homography_mask = 0 ;
    this.accuracy = MOBIUS_MAP_MAX_ACCURACY ;
    if ( is_string( arguments[0] ) ) this.init_model( arguments[0] );
    else
    {
       var a = null, b = null, c = null, d = null ;
       if ( is_mobius_map( arguments[0] ) )
       {
          a = arguments[0].a, b = arguments[0].b, c = arguments[0].c, d = arguments[0].d ;
          if ( is_string( arguments[1] ) ) this.notes = arguments[1] ;
          this.anti_homography_mask = safe_int( arguments[2], 0 ) ;
          this.accuracy = Math.min( safe_int( Math.abs( arguments[3] ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
       }
       else if ( is_array( arguments[0] ) )
       {
          if ( arguments[0].length == 4 )
          {
             a = arguments[0][0], b = arguments[0][1], c = arguments[0][2], d = arguments[0][3] ;
             if ( is_string( arguments[1] ) ) this.notes = arguments[1] ;
             this.anti_homography_mask = safe_int( arguments[2], 0 ) ;
		     this.accuracy = Math.min( safe_int( Math.abs( arguments[3] ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
          }
       }
       else
       {
          if ( arguments.length >= 4 )
          {
             a = arguments[0], b = arguments[1], c = arguments[2], d = arguments[3] ;
             this.notes = safe_string( arguments[4], "" ) ;
             this.anti_homography_mask = safe_int( arguments[5], 0 ) ;
		         this.accuracy = Math.min( safe_int( Math.abs( arguments[6] ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
          }
       }

       this.a = is_complex(a) ? a : ( !isNaN( a ) ? new complex( a, 0 ) : new complex( 0, 0 ) ) ;
       this.b = is_complex(b) ? b : ( !isNaN( b ) ? new complex( b, 0 ) : new complex( 0, 0 ) ) ;
       this.c = is_complex(c) ? c : ( !isNaN( c ) ? new complex( c, 0 ) : new complex( 0, 0 ) ) ;
       this.d = is_complex(d) ? d : ( !isNaN( d ) ? new complex( d, 0 ) : new complex( 0, 0 ) ) ;
    }
}

mobius_map.prototype.is_equal_to = function( _m, _tolerance ) { _tolerance = safe_float( _tolerance, 0 ) ; return ( this.a.is_equal_to( _m.a, _tolerance ) && this.b.is_equal_to( _m.b, _tolerance ) && this.c.is_equal_to( _m.c, _tolerance ) && this.d.is_equal_to( _m.d, _tolerance ) ) ? 1 : 0 ; }
mobius_map.prototype.is_consistent = function() { return ( this.a == null || this.b == null || this.c == null || this.d == null ) ? 0 : 1 ; }
mobius_map.prototype.is_constant = function() { return ( this.det.radius() == 0 ) ? 1 : 0 ; }
mobius_map.prototype.is_anti_homography = function() { return this.anti_homography_mask & ( 1|2 ) ? 1 : 0 ; }
mobius_map.prototype.is_upper_half_plane_preserving = function() { return ( this.a.is_real() && this.b.is_real() && this.c.is_real() && this.d.is_real() ) ? 1 : 0 ; }
mobius_map.prototype.output = function( _sep = "\n", _fmt = "coeffs", _accuracy, _style_for_html )
{
	_accuracy = Math.min( safe_int( Math.abs( _accuracy ), COMPLEX_CLASS_MAX_ACCURACY ), COMPLEX_CLASS_MAX_ACCURACY ) ;
    _fmt = safe_string( _fmt, "coeffs" ).toLowerCase() ;
    if ( _fmt.length == 0 ) _fmt = "coeffs" ;
    if ( _sep.length == 0 ) _sep = "\n" ;
    var _floatREGEXpattern = "^([0-9\.\+\-]{1,})$" ;
    var _a_mask = 0, _b_mask = 0, _c_mask = 0, _d_mask = 0 ;

    if ( this.a.is_imaginary() ) _a_mask |= 1 ;
    if ( this.a.is_real() ) _a_mask |= 2 ;
    if ( this.a.is_zero() ) _a_mask |= 4 ;
    if ( this.a.is_complex() ) _a_mask |= 8 ;

    if ( this.b.is_imaginary() ) _b_mask |= 1 ;
    if ( this.b.is_real() ) _b_mask |= 2 ;
    if ( this.b.is_zero() ) _b_mask |= 4 ;
    if ( this.b.is_complex() ) _b_mask |= 8 ;

    if ( this.c.is_imaginary() ) _c_mask |= 1 ;
    if ( this.c.is_real() ) _c_mask |= 2 ;
    if ( this.c.is_zero() ) _c_mask |= 4 ;
    if ( this.c.is_complex() ) _c_mask |= 8 ;

    if ( this.d.is_imaginary() ) _d_mask |= 1 ;
    if ( this.d.is_real() ) _d_mask |= 2 ;
    if ( this.d.is_zero() ) _d_mask |= 4 ;
    if ( this.d.is_complex() ) _d_mask |= 8 ;

		var _out_a = "" ;
		if ( _a_mask & 4 ) _out_a = "0" ;
		else if ( _a_mask & 1 || _a_mask & 2 || _a_mask & 8 )
		{
				if ( _a_mask & 2 ) _out_a = this.a.real.roundTo(_accuracy) ;
				else _out_a = "("+this.a.roundTo(_accuracy).formula(YES,YES,_accuracy)+")" ;
		}

		var _out_b = "" ;
		if ( _b_mask & 4 ) _out_b = _fmt == "coeffs" ? "0" : "" ;
		else if ( _b_mask & 1 || _b_mask & 2 || _b_mask & 8 )
		{
				if ( _b_mask & 8 || _b_mask & 1 )
				{
					_out_b = this.b.roundTo(_accuracy).formula(YES,YES,_accuracy) ;
					if ( _b_mask & 8 && this.b.real > 0 ) _out_b = ( _fmt != "coeffs" ? "+" : "" ) + _out_b ;
					else _out_b = ( this.b.imag > 0 ? "+" : "" ) + this.b.roundTo(_accuracy).formula(YES,YES,_accuracy) ;
				}
				else if ( _b_mask & 2 ) _out_b = ( this.b.real > 0 && _fmt != "coeffs" ? "+" : "" ) + this.b.real.roundTo(_accuracy) ;
		}

		var _out_c = "" ;
		if ( _c_mask & 4 ) _out_c = "0" ;
		else if ( _c_mask & 1 || _c_mask & 2 || _c_mask & 8 )
		{
				if ( _c_mask & 2 ) _out_c = this.c.real.roundTo(_accuracy) ;
				else _out_c = "("+this.c.roundTo(_accuracy).formula(YES,YES,_accuracy)+")" ;
		}

		var _out_d = "" ;
		if ( _d_mask & 4 ) _out_d = _fmt == "coeffs" ? "0" : "" ;
		else if ( _d_mask & 1 || _d_mask & 2 || _d_mask & 8 )
		{
				if ( _d_mask & 8 || _d_mask & 1 )
				{
					_out_d = this.d.roundTo(_accuracy).formula(YES,YES,_accuracy) ;
					if ( _d_mask & 8 && this.b.real > 0 ) _out_d = ( _fmt != "coeffs" ? "+" : "" ) + _out_d ;
					else _out_d = ( this.b.imag > 0 ? "+" : "" ) + this.d.roundTo(_accuracy).formula(YES,YES,_accuracy) ;
				}
				else if ( _d_mask & 2 ) _out_d = ( this.d.real > 0 && _fmt != "coeffs" ? "+" : "" ) + this.d.real.roundTo(_accuracy) ;
		}
		    
    function _clean( _str )
    {
        _str = _str.replaceAll( [ "((", "))" ], [ "(", ")" ] ) ;
        _str = _str.replaceAll( [ "(1)", "(0)z", "0z" ], "" ) ;
        _str = _str.replaceAll( [ "(-1)" ], "-1" ) ;
        _str = _str.replaceAll( [ "-1z", "+1z", "1z" ], [ "-z", "+z", "z" ] ) ;
        _str = _str.replaceAll( [ "(i)", "(-i)" ], [ "i", "-i" ] ) ;
        _str = _str.replaceAll( [ "+-", "-+" ], "-" ).replaceAll( [ "++", "--" ], "+" ) ;
        if ( _str[0] == "+" ) _str = _str.substr( 1, _str.length ) ;
        return _str ;
    }

    switch( _fmt )
    {
        case "coeffs":
        var str = "a: " + _out_a ;
            str += _sep + "b: " + _out_b ;
            str += _sep + "c: "+ _out_c ;
            str += _sep + "d: " + _out_d ;
        return _clean( str ) ;
        break ;
        case "frac":
        var num = _out_a + "z" + _out_b ;
        var den = _out_c + "z" + _out_d ;
        var line = _sep + ( "-" ).repeat( Math.max( num.length, den.length ) ) + _sep ;
        return _clean( num + line + den ) ;
        break ;
        case "rowfrac": return _clean( "("+_out_a + "z" + _out_b + ")/(" + _out_c + "z" + _out_d+")" ) ; break ;
        case "html":
        var num = _clean( _out_a + "z" + _out_b ) ;
        var den = _clean( _out_c + "z" + _out_d ) ;
            if ( den == "1" ) den = "" ;
        var _line_code = "<tr><td><hr noshade></td></tr>" ;
        var _html_code = "<table>" ;
            _html_code += "<tr><td ALIGN=\"center\" STYLE=\""+_style_for_html+"\">" + num + "</td></tr>" ;
            if ( den.length > 0 )
            _html_code += _line_code + "<tr><td ALIGN=\"center\" STYLE=\""+_style_for_html+"\">" + den + "</td></tr>" ;
            
            _html_code += "</table>" ;
        return _html_code ;
        break ;
        case "plain": return _clean( _out_a + _sep + _out_b + _sep + _out_c + _sep + _out_d ) ; break ;
    }
}

mobius_map.prototype.pack = function( _sep = "," )
{
    var str = ( ( this.get_a() != null ) ? this.get_a().formula() : "0" ) ;
    str += _sep + ( this.get_b() != null ? this.get_b().formula() : "0" ) ;
    str += _sep + ( this.get_c() != null ? this.get_c().formula() : "0" ) ;
    str += _sep + ( this.get_d() != null ? this.get_d().formula() : "0" ) ;
    return str ;
}

// INIT members
mobius_map.prototype.init_from_obj = function( mm = null )
{
    if ( is_mobius_map( mm ) ) // keep this raw check here
    {
        this.a = mm.a, this.b = mm.b, this.c = mm.c, this.d = mm.d ;
        this.notes = mm.notes, this.anti_homography_mask = mm.anti_homography_mask ;
        this.accuracy = mm.accuracy ;
    }
    else if ( mm != null ) // keep this raw check here
    {
        this.a = new complex( mm.a.real, mm.a.imag ), this.b = new complex( mm.b.real, mm.b.imag ) ;
        this.c = new complex( mm.c.real, mm.c.imag ), this.d = new complex( mm.d.real, mm.d.imag ) ;
        this.notes = mm.notes, this.anti_homography_mask = mm.anti_homography_mask ;
        this.accuracy = mm.accuracy ;
    }
    else this.a = this.b = this.c = this.d = new complex( 0, 0 ) ;
}

mobius_map.prototype.init_inversion_from_one_circle = function( C1, _notes, _normalize )
{
    _normalize = safe_int( _normalize, 1 );
		if ( !is_circle( C1 ) ) return NO ;
		var _c = new complex( C1.center.x, C1.center.y ), _radius = C1.radius ;
    this.a = _c ;
    this.b = new complex( _radius * _radius - ( _c.real * _c.real + _c.imag * _c.imag ), 0 ) ;
    this.c = new complex( 1.0, 0.0 ) ;
    this.d = _c.conj().opposite() ;
    this.notes = safe_string( _notes, "" ) ;
    this.anti_homography_mask = 0 ;
    this.accuracy = MOBIUS_MAP_MAX_ACCURACY ;
    if ( _normalize ) this.normalize();
    return YES ;
}

mobius_map.prototype.get_inversion_from_one_circle = function( C1 )
{
		var _mm = new mobius_map() ;
		var _ret = _mm.init_inversion_from_one_circle( C1 );
		return _ret ? _mm : null ;
}

mobius_map.prototype.init_inversion_from_two_circles = function( C1, C2, _normalize ) /* input params are both circle objs */
{
    _normalize = safe_int( _normalize, 1 );
    // inputs are supposed to be the isometric circles
		if ( !is_circle( C1 ) || !is_circle( C2 ) )
    {
        this.a = this.b = this.c = this.d = new complex( 0, 0 );
        return NO ;
    }
    // cast values to complex for performing calculations
    var P = new complex( C1.center.x, C1.center.y ), r = new complex( C1.radius, 0 ) ;
    var Q = new complex( C2.center.x, C2.center.y ), s = new complex( C2.radius, 0 ) ;
    this.a = Q ;
    this.b = r.mul( s ).sub( P.mul( Q ) ) ;
    this.c = new complex( 1.0, 0.0 ) ;
    this.d = P.opposite();
    this.anti_homography_mask = 0 ;
    this.accuracy = MOBIUS_MAP_MAX_ACCURACY ;
    this.notes = "" ;
    if ( _normalize ) this.normalize();
    return YES ;
}

mobius_map.prototype.get_inversion_from_two_circles = function( C1, C2 )
{
		var _mm = new mobius_map() ;
		var _ret = _mm.init_inversion_from_two_circles( C1, C2 );
		return _ret ? _mm : null ;
}

mobius_map.prototype.get_map_from_triplets = function( _z1, _z2, _z3, _w1, _w2, _w3, _normalize )
{
    _normalize = safe_int( _normalize, 1 );
		// input points are assumed as complex variables
		var H1 = this.init_map_to_zero_unit_infinity( _z1, _z2, _z3 ), H2 = this.init_map_to_zero_unit_infinity( _w1, _w2, _w3 ) ;
    return _normalize ? H2.inv().composition( H1 ).normalize() : H2.inv().composition( H1 );
}

mobius_map.prototype.init_map_to_zero_unit_infinity = function( _z1 /*to zero*/ ,
    																													  _z2 /*to unit*/,
    																													  _z3 /*to infinity*/ )
{
		// input points are assumed as complex variables
		// if infinity maps to itself, the mobius formula is assumed as: az+b
		var _mask = 0 ;
		if ( _z1.is_finite() ) _mask |= 1 ;
		if ( _z2.is_finite() ) _mask |= 2 ;
		if ( _z3.is_finite() ) _mask |= 4 ;

		if ( _mask == 7 ) // no input pt maps to infinity
		{
				var _b = _z1.opposite() ;
				var _c = new complex( 1.0, 0.0 ) ;
				var _d = _z3.opposite() ;
				var K = ( _c.mul( _z2 ).add( _d ) ).div( _z2.add( _b ) ) ;
				return new mobius_map( K, _b.mul( K ), _c, _d, "", this.anti_homography_mask, this.accuracy ) ;
		}
		else if ( _mask == 6 ) // infinity -> 0, z2 -> 1, z3 -> infinity
		{
				var _b = new complex( 0, 0 ) ;
				var _c = new complex( 1.0, 0.0 ) ;
				var _d = _z3.opposite() ;
				var K = _c.mul( _z2 ).add( _d ) ;
				return new mobius_map( new complex( 0, 0 ), K, _c, _d, "", this.anti_homography_mask, this.accuracy ) ;
		}
		else if ( _mask == 5 ) // z1 -> 0, infinity -> 1, z3 -> infinity
		{
				var _b = _z1.opposite(), _d = _z3.opposite() ;
				return new mobius_map( new complex( 1, 0 ), _b, new complex( 1, 0 ), _d, "", this.anti_homography_mask, this.accuracy ) ;
		}
		else if ( _mask == 3 ) // z1 -> 0, z2 -> 1, infinity -> infinity
		{
				var _b = _z1.opposite() ;
				var K = new complex( 1.0, 0.0 ).div( _z2.add( _b ) ) ;
				return new mobius_map( K, _b.mul( K ), new complex( 0, 0 ), new complex( 1, 0 ), "", this.anti_homography_mask, this.accuracy ) ;
		}
}

mobius_map.prototype.init_model = function( _model, _overwrite )
{
    _overwrite = safe_int( _overwrite, 1 ) ;
    switch( _model.toLowerCase() )
    {
       case "inversion": // inversion in the unit disk
       if ( _overwrite )
       {
          this.a = new complex( 0, 0 ), this.b = new complex( 1, 0 ), this.c = new complex( 1, 0 ), this.d = new complex( 0, 0 ) ;
       }
       else return new mobius_map( new complex( 0, 0 ), new complex( 1, 0 ), new complex( 1, 0 ), new complex( 0, 0 ), "", this.anti_homography_mask, this.accuracy ) ;
       break ;
       case "dtoi": // from unit disk D to imaginary axis
       if ( _overwrite )
       {
          this.a = new complex( -1, 0 ), this.b = new complex( -1, 0 ), this.c = new complex( 1, 0 ), this.d = new complex( -1, 0 ) ;
       }
       else return new mobius_map( new complex( -1, 0 ), new complex( -1, 0 ), new complex( 1, 0 ), new complex( -1, 0 ), "", this.anti_homography_mask, this.accuracy ) ;
       break ;
       case "itod": // from imaginary axis to unit disk D
       if ( _overwrite )
       {
          this.a = new complex( 1, 0 ), this.b = new complex( -1, 0 ), this.c = new complex( 1, 0 ), this.d = new complex( 1, 0 ) ;
       }
       else return new mobius_map( new complex( 1, 0 ), new complex( -1, 0 ), new complex( 1, 0 ), new complex( 1, 0 ), "", this.anti_homography_mask, this.accuracy ) ;
       break ;
       case "dtoh": // from unit disk D to upper half-plane H
       if ( _overwrite )
       {
          this.a = new complex( 1, 0 ), this.b = new complex( 0, 1 ), this.c = new complex( 0, 1 ), this.d = new complex( 1, 0 ) ;
       }
       else return new mobius_map( new complex( 1, 0 ), new complex( 0, 1 ), new complex( 0, 1 ), new complex( 1, 0 ), "", this.anti_homography_mask, this.accuracy ) ;
       break ;
       case "htod": // from upper half-plane H to unit disk D
       if ( _overwrite )
       {
          this.a = new complex( 1, 0 ), this.b = new complex( 0, -1 ), this.c = new complex( 0, -1 ), this.d = new complex( 1, 0 ) ;
       }
       else return new mobius_map( new complex( 1, 0 ), new complex( 0, -1 ), new complex( 0, -1 ), new complex( 1, 0 ), "", this.anti_homography_mask, this.accuracy ) ;
       break ;
       default:
       if ( _overwrite )
       {
          this.a = this.b = this.c = this.d = 0 ;
       }
       else return new mobius_map( 0, 0, 0, 0, "", this.anti_homography_mask, this.accuracy ) ;
       break ;
    }
}

// I/O
mobius_map.prototype.set_accuracy = function( _a ) { this.accuracy = Math.min( safe_int( Math.abs( _a ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ; }
mobius_map.prototype.get_accuracy = function() { return this.accuracy ; }
mobius_map.prototype.set_anti_homography_mask = function( _hm ) { this.anti_homography_mask = safe_int( Math.abs( _hm ), 0 ) ; }
mobius_map.prototype.get_anti_homography_mask = function() { return this.anti_homography_mask ; }
mobius_map.prototype.get_a = function() { return this.a ; }
mobius_map.prototype.get_b = function() { return this.b ; }
mobius_map.prototype.get_c = function() { return this.c ; }
mobius_map.prototype.get_d = function() { return this.d ; }

mobius_map.prototype.get_params = function( _include_params )
{
   _include_params = safe_int( _include_params, 0 );
   return _include_params ? [ [ this.a, this.b, this.c, this.d ], [ "a", "b", "c", "d" ] ] : [ this.a, this.b, this.c, this.d ] ;
}

mobius_map.prototype.set_a = function( a ) { this.a = is_complex( a ) ? a : ( !isNaN( a ) ? new complex( a, 0 ) : new complex( 0, 0 ) ) ; }
mobius_map.prototype.set_b = function( b ) { this.b = is_complex( b ) ? b : ( !isNaN( b ) ? new complex( b, 0 ) : new complex( 0, 0 ) ) ; }
mobius_map.prototype.set_c = function( c ) { this.c = is_complex( c ) ? c : ( !isNaN( c ) ? new complex( c, 0 ) : new complex( 0, 0 ) ) ; }
mobius_map.prototype.set_d = function( d ) { this.d = is_complex( d ) ? d : ( !isNaN( d ) ? new complex( d, 0 ) : new complex( 0, 0 ) ) ; }
mobius_map.prototype.set_params = function()
{
    if ( is_mobius_map( arguments[0] ) )
    {
        this.a = new complex( arguments[0].a.real, arguments[0].a.imag ) ;
        this.b = new complex( arguments[0].b.real, arguments[0].b.imag ) ;
        this.c = new complex( arguments[0].c.real, arguments[0].c.imag ) ;
        this.d = new complex( arguments[0].d.real, arguments[0].d.imag ) ;
    }
    else if ( is_array( arguments[0] ) )
    {
        this.a = is_complex( arguments[0][0] ) ? arguments[0][0] : ( !isNaN( arguments[0][0] ) ? new complex( arguments[0][0], 0 ) : new complex( 0, 0 ) ) ;
        this.b = is_complex( arguments[0][1] ) ? arguments[0][1] : ( !isNaN( arguments[0][1] ) ? new complex( arguments[0][1], 0 ) : new complex( 0, 0 ) ) ;
        this.c = is_complex( arguments[0][2] ) ? arguments[0][2] : ( !isNaN( arguments[0][2] ) ? new complex( arguments[0][2], 0 ) : new complex( 0, 0 ) ) ;
        this.d = is_complex( arguments[0][3] ) ? arguments[0][3] : ( !isNaN( arguments[0][3] ) ? new complex( arguments[0][3], 0 ) : new complex( 0, 0 ) ) ;
    }
    else if ( arguments.length <= 4 )
    {
        this.a = is_complex( arguments[0] ) ? arguments[0] : ( !isNaN( arguments[0] ) ? new complex( arguments[0], 0 ) : new complex( 0, 0 ) ) ;
        this.b = is_complex( arguments[1] ) ? arguments[1] : ( !isNaN( arguments[1] ) ? new complex( arguments[1], 0 ) : new complex( 0, 0 ) ) ;
        this.c = is_complex( arguments[2] ) ? arguments[2] : ( !isNaN( arguments[2] ) ? new complex( arguments[2], 0 ) : new complex( 0, 0 ) ) ;
        this.d = is_complex( arguments[3] ) ? arguments[3] : ( !isNaN( arguments[3] ) ? new complex( arguments[3], 0 ) : new complex( 0, 0 ) ) ;
    }
}

// MISC

mobius_map.prototype.swap_parts = function( _overwrite )
{
    _overwrite = safe_int( _overwrite, 0 );
    var _params = this.get_params();
    if ( _overwrite )
    {
        this.a = _params[2], this.b = _params[3];
        this.c = _params[0], this.d = _params[1];
        return null ;
    }
    else return new mobius_map( _params[2], _params[3], _params[0], _params[1], this.notes, this.anti_homography_mask, this.accuracy );
}

mobius_map.prototype.copy = function() { return new mobius_map( this.get_a(), this.get_b(), this.get_c(), this.get_d(), this.notes, this.anti_homography_mask, this.accuracy ) ; }
mobius_map.prototype.pole = function() { return this.c.radius() == 0 ? new complex( Infinity, Infinity ) : ( new complex( 0.0, 0.0 ) ).sub( this.d ).div( this.c ) ; }
mobius_map.prototype.trace = function() { return this.a.add( this.d ) ; }
mobius_map.prototype.antitrace = function() { return this.a.sub( this.d ) ; }
mobius_map.prototype.norm = function() { return this.a.pow(2).add( this.b.pow(2) ).add( this.c.pow(2) ).add( this.d.pow(2) ) ; }
mobius_map.prototype.add_scalar = function( k ) { return new mobius_map( this.a.add( k ), this.b.add( k ), this.c.add( k ), this.d.add( k ), this.notes, this.anti_homography_mask, this.accuracy ) ; }
mobius_map.prototype.sub_scalar = function( k ) { return new mobius_map( this.a.sub( k ), this.b.sub( k ), this.c.sub( k ), this.d.sub( k ), this.notes, this.anti_homography_mask, this.accuracy ) ; }
mobius_map.prototype.mul_scalar = function( k ) { return new mobius_map( this.a.mul( k ), this.b.mul( k ), this.c.mul( k ), this.d.mul( k ), this.notes, this.anti_homography_mask, this.accuracy ) ; }
mobius_map.prototype.div_scalar = function( k ) { return k == 0 ? new mobius_map( new complex( Infinity, Infinity ), new complex( Infinity, Infinity ), new complex( Infinity, Infinity ), new complex( Infinity, Infinity ) ) : new mobius_map( this.a.div( k ), this.b.div( k ), this.c.div( k ), this.d.div( k ), this.notes, this.anti_homography_mask, this.accuracy ) ; }
mobius_map.prototype.det = function() { return ( this.a.mul( this.d ).sub( this.b.mul( this.c ) ) ) ; }
mobius_map.prototype.derivative_at = function( z ) { return this.det().div( ( this.c.mul( z ).add( this.d ) ).pow(2.0) ) ; }
mobius_map.prototype.inv = function() { return new mobius_map( this.d, this.b.opposite(), this.c.opposite(), this.a, this.notes, this.anti_homography_mask, this.accuracy ); }
mobius_map.prototype.characteristic = function() { return this.a.pow( 2.0 ) ; }
mobius_map.prototype.multiplier = function()
{
    // definition found in Discontinuous groups of Isometries in the Hyperbolic plane
    // by Werner Fenchel - Jakob Nielsen, page 8
    return ( this.d.add( this.a ).sub( this.det().sqrt() ) ).div( ( this.d.add( this.a ).add( this.det().sqrt() ) ) ) ;
}

mobius_map.prototype.translation_length = function( _z )
{
		// definition found in The Geometry of Riemann surfaces by Alan Beardon, page 9
		return _z.distance( this.compute( _z ) ) ;
}

mobius_map.prototype.displacement = function( _z )
{
		// definition found in The Geometry of Riemann surfaces by Alan Beardon, page 9
		return ( new complex( this.translation_length( _z ), 0.0 ) ).div(2.0).sinh() ;
}

mobius_map.prototype.isometric_circle = function()
{
    var _c = this.c.radius() == 0 ? MOBIUS_MAP_ZERO_LIMIT : this.c ;
    var _center = this.d.opposite().div( _c ), _radius = this.det().sqrt().radius() / _c.radius() ;
    return new circle( new point( _center.real, _center.imag ), _radius ) ;
}

mobius_map.prototype.inversion_circle = function()
{
    var _center = this.a ;
    var _radius = this.b.add( this.a.mul( this.a.conj() ) ).sqrt().radius() ;
    return new circle( new point( _center.real, _center.imag ), _radius ) ;
}

mobius_map.prototype.rotation_axis = function()
{
    if ( this.is_parabolic() ) return null ;
    else
    {
        var _fp_s = this.fixed_points() ;
        var _fp_1 = _fp_s[0], _fp_2 = _fp_s[1] ;
        // ref. eq. model y = mx + q
        if ( _fp_1.is_equal_to( _fp_2 ) || ( _fp_1.real == _fp_2.real ) ) return null ;
        var _m = ( _fp_1.imag - _fp_2.imag ) / ( _fp_1.real - _fp_2.real ) ;
        var _q = _fp_1.imag - _m * _fp_1.real ;
        return [ _m, _q ] ;
    }
}

mobius_map.prototype.compute = function( z ) { return ( this.a.mul( this.anti_homography_mask & 1 ? z.conj() : z ).add( this.b ) ).div( this.c.mul( this.anti_homography_mask & 2 ? z.conj() : z ).add( this.d ) ).roundTo( this.accuracy ) ; }
mobius_map.prototype.compute_multi_pts = function( z_array )
{
  if ( is_complex( z_array ) ) z_array = [ z_array ] ;
  else if ( !is_array( z_array ) ) return null ;

  var _out = [] ;
  for( var _i = 0 ; _i < z_array.length ; _i++ ) _out.push( this.compute( z_array[_i] ) ) ;
  return _out.clone() ;
}

// matrix operations
mobius_map.prototype.sum = function( mm )	{ return new mobius_map( this.a.add( mm.a ), this.b.add( mm.b ), this.c.add( mm.c ), this.d.add( mm.d ), this.notes, this.anti_homography_mask, this.accuracy ); }
mobius_map.prototype.sub = function( mm )	{ return new mobius_map( this.a.sub( mm.a ), this.b.sub( mm.b ), this.c.sub( mm.c ), this.d.sub( mm.d ), this.notes, this.anti_homography_mask, this.accuracy ); }
mobius_map.prototype.div = function( mm )	{ return this.mul( mm.inv() ) ; }
mobius_map.prototype.mul = function( mm )
{
    return new mobius_map( this.a.mul( mm.a ).add( this.b.mul( mm.c ) ),
		this.a.mul( mm.b ).add( this.b.mul( mm.d ) ),
		this.c.mul( mm.a ).add( this.d.mul( mm.c ) ),
		this.c.mul( mm.b ).add( this.d.mul( mm.d ) ), this.notes, this.anti_homography_mask, this.accuracy );
}

mobius_map.prototype.distance_from = function( _mm = null )
{
	if ( is_mobius_map( _mm ) ) return -1 ;
	else
	{
		var _dist = this.a.sub( _mm.a ).pow( 2.0 ) ;
		_dist = _d.add( this.b.sub( _mm.b ).pow( 2.0 ) );
		_dist = _d.add( this.c.sub( _mm.c ).pow( 2.0 ) );
		_dist = _d.add( this.d.sub( _mm.d ).pow( 2.0 ) );
		return _dist.sqrt().radius() ;
	}
}

mobius_map.prototype.normalize = function( _self = 1 )
{
    _self = safe_int( _self, 1 );
    var det = this.det() ;
    if ( det.radius() == 0 ) det = MOBIUS_MAP_ZERO_LIMIT ;
    var _q = det.sqrt() ;
    if ( _self ) { this.a = this.a.div( _q ), this.b = this.b.div( _q ), this.c = this.c.div( _q ), this.d = this.d.div( _q ) ; }
    else return new mobius_map( this.a.div( _q ), this.b.div( _q ), this.c.div( _q ), this.d.div( _q ), this.notes, this.anti_homography_mask, this.accuracy ) ;
}

// mappings
mobius_map.prototype.invert_circle = function( C1 )    // C1 is the circle object to be inverted
{
    var work_c = this.c.radius() == 0 ? MOBIUS_MAP_ZERO_LIMIT : this.c ;
    var complexR1 = new complex( C1.radius, 0.0 );
    var complexR2 = new complex( C1.radius * C1.radius, 0.0 );
    // inversion: the next line differs from mapping (due to conjugacy)
    var complexC1center = new complex( C1.center.x, C1.center.y ).conj();
    var z = complexC1center.sub( complexR2.div( ( this.d.div( work_c ) ).add( complexC1center ).conj() ) ) ;
    var z1 = this.compute( z );
    var radius = z1.distance( ( this.compute( complexC1center.add( complexR1 ) ) ) ) ;
    return new circle( new point( z1.real, z1.imag ), radius,
                       C1.draw, C1.fill, C1.bordercolor, C1.fillcolor, C1.bordersize, C1.notes );
}

mobius_map.prototype.map_circle = function( C1 )   // C1 is the be circle object mapped onto
{
    var work_c = this.c.radius() == 0 ? MOBIUS_MAP_ZERO_LIMIT : new complex( this.c.real, this.c.imag ) ;
    var complexR1 = new complex( C1.radius, 0.0 ), complexR2 = new complex( C1.radius * C1.radius, 0.0 );
    // mapping: the next line differs from inversion (due to conjugacy)
    var complexC1center = new complex( C1.center.x, C1.center.y );
    var z = complexC1center.sub( complexR2.div( ( this.d.div( work_c ) ).add( complexC1center ).conj() ) ) ;
    var z1 = this.compute( z );
    return new circle( new point( z1.real, z1.imag ),
                       z1.distance( this.compute( complexC1center.add( complexR1 ) ) ),
                       C1.draw, C1.fill, C1.bordercolor, C1.fillcolor, C1.bordersize, C1.notes );
}

// compositions
mobius_map.prototype.composition = function( w )
{
    return new mobius_map( this.a.mul( w.a ).add( this.b.mul( w.c ) ),
                           this.a.mul( w.b ).add( this.b.mul( w.d ) ),
                           this.c.mul( w.a ).add( this.d.mul( w.c ) ),
                           this.c.mul( w.b ).add( this.d.mul( w.d ) ), this.notes, this.anti_homography_mask, this.accuracy );
}

mobius_map.prototype.advanced_composition = function()
{
    var _input_args = new Array(), _i ;
    for( _i = 0 ; _i < arguments.length ; _i++ )
    {
       if ( is_array( arguments[_i] ) ) _input_args = _input_args.concat( arguments[_i] );
       else if ( is_mobius_map( arguments[_i] ) ) _input_args.push( arguments[_i] );
    }

    var _mobius_map = _input_args[0] ;
    for( _i = 1 ; _i < _input_args.length ; _i++ )
    {
       if ( is_mobius_map( _input_args[_i] ) )
       _mobius_map = new mobius_map( _mobius_map.a.mul( _input_args[_i].a ).add( _mobius_map.b.mul( _input_args[_i].c ) ),
                                     _mobius_map.a.mul( _input_args[_i].b ).add( _mobius_map.b.mul( _input_args[_i].d ) ),
                                     _mobius_map.c.mul( _input_args[_i].a ).add( _mobius_map.d.mul( _input_args[_i].c ) ),
                                     _mobius_map.c.mul( _input_args[_i].b ).add( _mobius_map.d.mul( _input_args[_i].d ) ),
                                     this.notes, this.anti_homography_mask, this.accuracy );
    }
    return _mobius_map ;
}

// fixed points function members
mobius_map.prototype.eigen_values = function() // return an array of complex bounded eigen values
{
    var _tr = this.trace(), _sqrt_det = _tr.pow(2.0).sub(4.0).sqrt() ;
    return [ _tr.add( _sqrt_det ).div(2.0), _tr.sub( _sqrt_det ).div(2.0) ] ;
}

mobius_map.prototype.fixed_points = function() // return an array of complex bounded fixed points
{
    // eq is : -cz^2 + (a-d)z + b = 0
    var _a_sub_d = this.antitrace() ;
    if ( this.c.radius() == 0 ) return _a_sub_d.radius() == 0 ? [] : [ this.b.opposite().div( _a_sub_d ) ] ; // 1 or no bounded fixed point
    else
    {
		 	  var _den = this.c.mul( 2.0 ), _delta_sqrt = ( _a_sub_d.pow( 2.0 ).add( this.c.mul( this.b ).mul(4.0) ) ).sqrt() ;
				if ( _delta_sqrt.radius() == 0 ) return _a_sub_d.div( _den ) ; // 1 bounded fixed point
				else // 2 bounded fixed points
			  return [ _a_sub_d.add( _delta_sqrt ).div( _den ), _a_sub_d.sub( _delta_sqrt ).div( _den ) ] ;	
		}
}

mobius_map.prototype.commute_with = function( _mm )
{
		if ( !is_mobius_map( _mm ) ) return NO ;
		else
		{
				// See Marden's book 'Outer circles', p. 19
				var _this_fp = this.fixed_points(), _mm_fp = _mm.fixed_points() ;
				if ( _this_fp.length == _mm_fp.length )
				{
						var _mask = 1 ;
						for( var _m = 0 ; _m < _this_fp.length ; _m++ )
						{
								if ( !_this_fp[_m].is_equal_to( _mm_fp[_m] ) )
								{
										_mask &= 0 ;
										break ;
								}
						}
						return _mask ;
				}
				else return NO ;
		}
}

mobius_map.prototype.sink = function()
{
    var _f = this.fixed_points(), _n = _f.length ;
    if ( _n == 1 ) return this.is_source_pt( _f['fp1'] ) ? _f['fp1'] : null ;
    else if ( _n == 2 ) return ( this.is_sink_pt( _f['fp1'] ) ) ? _f['fp1'] : ( this.is_sink_pt( _f['fp2'] ) ? _f['fp2'] : null ) ;
}

mobius_map.prototype.source = function()
{
    var _f = this.fixed_points(), _n = _f.length ;
    if ( _n == 1 ) return this.is_source_pt( _f['fp1'] ) ? _f['fp1'] : null ;
    else if ( _n == 2 ) return ( this.is_source_pt( _f['fp1'] ) ) ? _f['fp1'] : ( this.is_source_pt( _f['fp2'] ) ? _f['fp2'] : null ) ;
}

mobius_map.prototype.neutral = function()
{
    var _f = this.fixed_points(), _n = _f.length ;
    if ( _n == 1 ) return this.is_neutral_pt( _f['fp1'] ) ? _f['fp1'] : null ;
    else if ( _n == 2 ) return ( this.is_neutral_pt( _f['fp1'] ) ) ? _f['fp1'] : ( this.is_neutral_pt( _f['fp2'] ) ? _f['fp2'] : null ) ;
}

mobius_map.prototype.is_sink_pt = function( _complex_pt ) { return ( this.derivative_at( _complex_pt ).radius() < 1 ) ? 1 : 0 ; }
mobius_map.prototype.is_neutral_pt = function( _complex_pt ) { return ( this.derivative_at( _complex_pt ).radius() == 1 ) ? 1 : 0 ; }
mobius_map.prototype.is_source_pt = function( _complex_pt ) { return ( this.derivative_at( _complex_pt ).radius() > 1 ) ? 1 : 0 ; }

// categories function members
mobius_map.prototype.is_null = function( _accuracy )
{
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    var MASK = 0 ;
        MASK |= is_complex( this.a ) ? ( this.a.roundTo( _accuracy ).is_zero() ? 1 : 0 ) : 0 ;
        MASK |= is_complex( this.b ) ? ( this.b.roundTo( _accuracy ).is_zero() ? 2 : 0 ) : 0 ;
        MASK |= is_complex( this.c ) ? ( this.c.roundTo( _accuracy ).is_zero() ? 4 : 0 ) : 0 ;
        MASK |= is_complex( this.d ) ? ( this.d.roundTo( _accuracy ).is_zero() ? 8 : 0 ) : 0 ;
    return MASK == 15 ? 1 : 0 ;
}

mobius_map.prototype.is_similar = function( _mm /* input a mobius_map */, _accuracy )
{
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    var this_trace_squared = this.trace().roundTo( _accuracy ).mul( this.trace().roundTo( _accuracy ) ) ;
    var this_det = new complex( this.det().roundTo( _accuracy ).radius() ) ;
    var _mm_trace_squared = _mm.trace().roundTo( _accuracy ).mul( w.trace() ) ;
    var _mm_det = new complex( _mm.det().roundTo( _accuracy ).radius() ) ;
    return ( this_trace_squared.div( this_det ) == _mm_trace_squared.div( _mm_det ) ) ? 1 : 0 ;
}

mobius_map.prototype.is_normalized = function( _accuracy )
{
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    return this.det().radius().roundTo( _accuracy ) == 1 ? 1 : 0 ;
}

mobius_map.prototype.is_conjugate_to = function( _m_map ) { return is_mobius_map( _m_map ) ? ( _m_map.trace() == this.trace() ? 1 : 0 ) : 0 ; }

// functions members to check mobius map categories 
mobius_map.prototype.is_constant = function(_accuracy)
{
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    return this.det().roundTo(_accuracy).radius() == 0 ? 1 : 0 ;
}

mobius_map.prototype.is_identity = function( _accuracy )
{
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    return ( this.a.roundTo( _accuracy ).is_real_unit() && this.b.roundTo( _accuracy ).is_zero() &&
						 this.c.roundTo( _accuracy ).is_zero() && this.d.roundTo( _accuracy ).is_real_unit() ) ? 1 : 0 ;
}

mobius_map.prototype.is_zero_map = function( _accuracy )
{
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    return ( this.a.roundTo( _accuracy ).is_zero() && this.b.roundTo( _accuracy ).is_zero() &&
             this.c.roundTo( _accuracy ).is_zero() && this.d.roundTo( _accuracy ).is_zero() ) ? 1 : 0 ;
}

mobius_map.prototype.is_fractional_map = function( _accuracy )
{
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    return ( !this.a.roundTo( _accuracy ).is_zero() && !this.c.roundTo( _accuracy ).is_zero() &&
             !this.d.roundTo( _accuracy ).is_zero() /* this.b might be zero or not */ ) ? 1 : 0 ;
}

mobius_map.prototype.is_isometry = function() { return ( this.is_identity() || this.is_translation() || is_rotation() ) ? 1 : 0 ; }
mobius_map.prototype.is_affine = function( _accuracy )
{
    // az + b
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    return ( !this.a.roundTo( _accuracy ).is_zero() && !this.b.roundTo( _accuracy ).is_zero() &&
						 this.c.roundTo( _accuracy ).is_zero() && this.d.roundTo( _accuracy ).is_real_unit() ) ? 1 : 0 ;
}

mobius_map.prototype.is_translation = function( _accuracy )
{
    // z + k
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    return ( this.a.roundTo( _accuracy ).is_real_unit() && !this.b.roundTo( _accuracy ).is_zero() &&
						 this.c.roundTo( _accuracy ).is_zero() && this.d.roundTo( _accuracy ).is_real_unit() ) ? 1 : 0 ;
}

mobius_map.prototype.is_scaling = function( _accuracy )
{
    // kz with |k| <> 1
    // az+b >> a != 0, b = 0   >> az
    // ----                       --
    // cz+d >> c == 0, d != 0     d
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    // a: (1.96+0.01i) b: -i c: -i d: 0
    return ( !this.a.roundTo( _accuracy ).is_zero() &&
						 this.b.roundTo( _accuracy ).is_zero() &&
						 this.c.roundTo( _accuracy ).is_zero() &&
						 !this.d.roundTo( _accuracy ).is_zero() &&
						 ( this.a.roundTo( _accuracy ).div( this.d.roundTo( _accuracy ) ).radius() != 1 ) ) ? 1 : 0 ;
}

mobius_map.prototype.is_contraction = function( _accuracy )
{
		// kz with |k| < 1
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
		return ( this.is_scaling( _accuracy ) && this.a.roundTo( _accuracy ).radius() < 1 ) ? 1 : 0 ;
}

mobius_map.prototype.is_dilation = function( _accuracy )
{
		// kz with |k| > 1
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
		return ( this.is_scaling() && this.a.roundTo( _accuracy ).radius() > 1 ) ? 1 : 0 ;
}

mobius_map.prototype.is_rotation = function( _accuracy )
{
    // Lemma 1.10 (p. 16) in Magnus' 'Non-euclidean tesselations' book
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    return ( this.d.roundTo( _accuracy ) == this.a.conj().roundTo( _accuracy ) &&
						 this.c.roundTo( _accuracy ) == this.b.conj().opposite().roundTo( _accuracy ) ) ? 1 : 0 ;
}

mobius_map.prototype.is_inversion = function( _accuracy )
{
    // k/z
    // az+b >> a = 0, b != 0  >> b
    // ----                      --
    // cz+d >> c != 0, d = 0     cz
		_accuracy = Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ;
    return ( this.a.roundTo( _accuracy ).is_zero() &&
						 !this.b.roundTo( _accuracy ).is_zero() &&
						 !this.c.roundTo( _accuracy ).is_zero() &&
						 this.d.roundTo( _accuracy ).is_zero() ) ? 1 : 0 ;
}

// check map classification function members
mobius_map.prototype.is_circular = function(_accuracy)
{
		if ( _accuracy == MOBIUS_MAP_SKIP_ACCURACY ) _accuracy = MOBIUS_MAP_MAX_ACCURACY ;
		return ( this.is_normalized(_accuracy) && this.trace().roundTo( _accuracy ).pow(2.0).radius() == 0 ) ? 1 : 0 ;
}

mobius_map.prototype.is_elliptic = function(_accuracy)
{
		if ( _accuracy == MOBIUS_MAP_SKIP_ACCURACY ) _accuracy = MOBIUS_MAP_MAX_ACCURACY ;
		return ( this.is_normalized(_accuracy) && this.trace().roundTo( _accuracy ).pow(2.0).radius() < 4 ) ? 1 : 0 ;
}

mobius_map.prototype.is_parabolic = function(_accuracy)
{
		if ( _accuracy == MOBIUS_MAP_SKIP_ACCURACY ) _accuracy = 0 ;
		return ( this.is_normalized(_accuracy) && !this.is_identity() &&  this.trace().roundTo( _accuracy ).pow(2.0).radius() == 4 ) ? 1 : 0 ;
}

mobius_map.prototype.is_nearly_parabolic = function( _accuracy )
{
		var _trace_squared = this.trace().pow(2.0).radius().roundTo( _accuracy ) ;
		return ( Math.abs( this.trace().pow(2.0).radius() - 4.0 ).roundTo( _accuracy ) <= Math.pow( 10, -_accuracy+2 ) ) ? 1 : 0 ;
}

mobius_map.prototype.is_hyperbolic = function(_accuracy)
{
		if ( _accuracy == MOBIUS_MAP_SKIP_ACCURACY ) _accuracy = MOBIUS_MAP_MAX_ACCURACY ;
		return ( this.is_normalized(_accuracy) && this.trace().roundTo( _accuracy ).pow(2.0).radius() > 4 ) ? 1 : 0 ;
}

mobius_map.prototype.is_loxodromic = function(_accuracy)
{
		if ( _accuracy == MOBIUS_MAP_SKIP_ACCURACY ) _accuracy = MOBIUS_MAP_MAX_ACCURACY ;
		return ( this.is_normalized(_accuracy) && this.trace().roundTo( _accuracy ).i() != 0 ) ? 1 : 0 ;
}

mobius_map.prototype.is_involution = function(_accuracy)
{
		if ( _accuracy == MOBIUS_MAP_SKIP_ACCURACY ) _accuracy = MOBIUS_MAP_MAX_ACCURACY ;
		return ( this.is_normalized(_accuracy) && this.trace().roundTo( _accuracy ).is_zero() ) ? 1 : 0 ;
}

mobius_map.prototype.classification = function( _return_int, _accuracy, _nearly_test )
{
    _return_int = safe_int( _return_int, 1 ) ;
		_accuracy = _accuracy == MOBIUS_MAP_SKIP_ACCURACY ? MOBIUS_MAP_MAX_ACCURACY : ( Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ) ;
    _nearly_test = safe_int( _nearly_test, 0 ) ;
    if ( _nearly_test )
    {
        if ( this.is_nearly_parabolic( _accuracy ) ) return _return_int ? MOBIUS_MAP_NEARLY_PARABOLIC_CLASS : "nearly parabolic" ;
    }

    if ( this.is_zero_map( _accuracy ) )        return _return_int ? MOBIUS_MAP_ZERO_CLASS : "zero map" ;
    else if ( this.is_circular( _accuracy ) )   return _return_int ? MOBIUS_MAP_CIRCULAR_CLASS : "circular" ;
    else if ( this.is_elliptic( _accuracy ) )   return _return_int ? MOBIUS_MAP_ELLIPTIC_CLASS : "elliptic" ;
    else if ( this.is_hyperbolic( _accuracy ) ) return _return_int ? MOBIUS_MAP_HYPERBOLIC_CLASS : "hyperbolic" ;
    else if ( this.is_loxodromic( _accuracy ) ) return _return_int ? MOBIUS_MAP_LOXODROMIC_CLASS : "loxodromic" ;
    else if ( this.is_parabolic( _accuracy ) )  return _return_int ? MOBIUS_MAP_PARABOLIC_CLASS : "parabolic" ;
    
		return _return_int ? MOBIUS_MAP_UNKNOWN_CLASS : "unknown" ;
}

mobius_map.prototype.kind = function( _return_int, _accuracy )
{
    _return_int = safe_int( _return_int, 1 ) ;
		_accuracy = _accuracy == MOBIUS_MAP_SKIP_ACCURACY ? MOBIUS_MAP_MAX_ACCURACY : ( Math.min( safe_int( Math.abs( _accuracy ), MOBIUS_MAP_MAX_ACCURACY ), MOBIUS_MAP_MAX_ACCURACY ) ) ;
    if ( this.is_constant(_accuracy) ) return _return_int ? MOBIUS_MAP_CONSTANT_KIND : "constant" ;
    else if ( this.is_scaling(_accuracy) ) return _return_int ? MOBIUS_MAP_SCALING_KIND : "scaling" ;
    else if ( this.is_identity(_accuracy) ) return _return_int ? MOBIUS_MAP_IDENTITY_KIND : "identity" ;
    else if ( this.is_contraction(_accuracy) ) return _return_int ? MOBIUS_MAP_CONTRACTION_KIND : "contraction" ;
    else if ( this.is_dilation(_accuracy) ) return _return_int ? MOBIUS_MAP_DILATION_KIND : "dilation" ;
    else if ( this.is_rotation(_accuracy) ) return _return_int ? MOBIUS_MAP_ROTATION_KIND : "rotation" ;
    else if ( this.is_translation(_accuracy) ) return _return_int ? MOBIUS_MAP_TRANSLATION_KIND : "translation" ;
    else if ( this.is_inversion(_accuracy) ) return _return_int ? MOBIUS_MAP_INVERSION_KIND : "inversion" ;
    else if ( this.is_involution(_accuracy) ) return _return_int ? MOBIUS_MAP_INVOLUTION_KIND : "involution" ;
    else if ( this.is_fractional_map(_accuracy) ) return _return_int ? MOBIUS_MAP_FRACTIONALMAP_KIND : "fractional map" ;
    else return _return_int ? MOBIUS_MAP_UNKNOWN_KIND : "unknown" ;
}