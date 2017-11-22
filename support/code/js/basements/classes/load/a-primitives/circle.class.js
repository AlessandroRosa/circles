/*
    JS circle class library is free software: you can redistribute it and/or modify
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

var _CIRCLE_OBJ_MAX_ACCURACY = 10 ; // the orthogonality test fails for accuracy > 10, but 20 is max value allowed by javascript .toPrecision built-in function

if ( typeof is_array != "function" ) function is_array( _obj ) { return _obj instanceof Array ? 1 : 0 ; }
if ( typeof is_complex != "function" ) function is_complex( _obj ) { return _obj instanceof complex ? 1 : 0 ; }
if ( typeof is_integer != "function" ) function is_integer( _obj ) { return is_number( _obj ) ? ( Math.floor( _obj ) == _obj ? 1 : 0 ) : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj ) { return ( typeof _obj == "number" || _obj instanceof Number ) ; }
if ( typeof is_rational != "function" ) function is_rational( _obj ) { return is_number( _obj ) ? !is_integer( _obj ) : 0 ; }
if ( typeof is_string != "function" ) function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; }

if ( typeof is_circle != "function" ) function is_circle( _a ) { return _a instanceof circle ? 1 : 0 ; }
if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

function circle()
{
	this.customclass = arguments.callee.name ;
    if ( is_circle( arguments[0] ) )
    {
       this.center = is_point( arguments[0].center ) ? arguments[0].center : new point( 0, 0 ) ;
       this.radius = arguments[0].radius ;
       this.draw = safe_int( arguments[0].draw, 1 ) ;
       this.fill = safe_int( arguments[0].fill, 0 ) ;
       this.drawcolor = safe_string( arguments[0].drawcolor, "blue" ) ;
       this.fillcolor = safe_string( arguments[0].fillcolor, "" ) ;
       this.linewidth = safe_int( arguments[0].linewidth, 1 ) ;
       this.notes = safe_string( arguments[0].notes, "" ) ;
    }
    else if ( is_point( arguments[0] ) && !isNaN( arguments[1] ) )
    {
       this.center = is_point( arguments[0] ) ? arguments[0] : new point( 0, 0 ) ;
       this.radius = arguments[1] ;
       this.draw = safe_int( arguments[2], 1 ) ;
       this.fill = safe_int( arguments[3], 0 ) ;
       this.drawcolor = safe_string( arguments[4], "blue" ) ;
       this.fillcolor = safe_string( arguments[5], "" ) ;
       this.linewidth = safe_int( arguments[6], 1 ) ;
       this.notes = safe_string( arguments[7], "" ) ;
    }
    else if ( !isNaN( arguments[0] ) && !isNaN( arguments[1] ) && !isNaN( arguments[2] ) )
    {
       this.center = new point( arguments[0], arguments[1] ) ;
       this.radius = arguments[2] ;
       this.draw = safe_int( arguments[3], 1 ) ;
       this.fill = safe_int( arguments[4], 0 ) ;
       this.drawcolor = safe_string( arguments[5], "blue" ) ;
       this.fillcolor = safe_string( arguments[6], "" ) ;
       this.linewidth = safe_int( arguments[7], 1 ) ;
       this.notes = safe_string( arguments[8], "" ) ;
    }
    else if ( is_string( arguments[0] ) )
    {
       switch( arguments[0].toLowerCase() )
       {
           case "unitcircle":
           this.center = new point( 0, 0 ) ;
           this.radius = 1 ;
           break ;
       }

       this.draw = safe_int( arguments[1], 1 ) ;
       this.fill = safe_int( arguments[2], 0 ) ;
       this.drawcolor = safe_string( arguments[3], "blue" ) ;
       this.fillcolor = safe_string( arguments[4], "" ) ;
       this.linewidth = safe_int( arguments[5], 1 ) ;
       this.notes = safe_string( arguments[6], "" ) ;
    }
    else
    {
       this.center = new point( 0, 0 ) ;
       this.radius = 0 ;
    }
}

circle.prototype.init_from_obj = function( c )
{
    // don't check c because this function could be called
    // from the multi-tasking environment, where data are de-typified
    this.center.x = c.center.x ;
    this.center.y = c.center.y ;
    this.radius = c.radius ;
    this.fill = c.fill ;
    this.draw = c.draw ;
    this.drawcolor = c.drawcolor ;
    this.fillcolor = c.fillcolor ;
    this.linewidth = c.linewidth ;
    this.notes = c.notes ;
}

circle.prototype.init_properties_from_obj = function( c )
{
    this.fill = c.fill ;
    this.draw = c.draw ;
    this.drawcolor = c.drawcolor ;
    this.fillcolor = c.fillcolor ;
    this.linewidth = c.linewidth ;
    this.notes = c.notes ;
}

circle.prototype.init_coords_only = function( c )
{
    this.center.x = c.center.x ;
    this.center.y = c.center.y ;
    this.radius = c.radius ;
}

circle.prototype.get_center = function() { return this.center ; }
circle.prototype.get_radius = function() { return this.radius ; }
circle.prototype.set_center = function( c ) { this.center = c ; }
circle.prototype.set_radius = function( r ) { this.radius = r ; }

circle.prototype.fixer = function( _max )
{
    if ( this.center != null && this.center instanceof point )
    {
       this.center.x = this.center.x < 0 ? Math.max( this.center.x, -_max ) : Math.min( this.center.x, _max ) ;
       this.center.y = this.center.y < 0 ? Math.max( this.center.y, -_max ) : Math.min( this.center.y, _max ) ;
    }
    this.radius = Math.min( this.radius, _max ) ;
}

circle.prototype.get_representative_pts = function() { return [ this.center, this.center.shift( this.radius, 0, 0 ) ] ; }
circle.prototype.copy = function()            { return new circle( this.center, this.radius, this.draw, this.fill, this.drawcolor, this.fillcolor, this.linewidth, this.notes ); }
circle.prototype.is_null = function() { return ( ( this.center.is_null() || !this.center.is_consistent() ) && this.radius == 0 ) ? 1 : 0 ; }
circle.prototype.is_point = function() { return this.radius == 0 ? 1 : 0 ; }
circle.prototype.is_equal_to = function( C )  { return ( C.center.is_equal_to( this.center ) && this.radius == C.radius ) ? 1 : 0 ; }
circle.prototype.get_notes = function() { return this.notes ; }
circle.prototype.set_notes = function( L ) { this.notes = "" + L ; }
circle.prototype.diameter = function() { return 2.0 * this.radius ; }
circle.prototype.circumference = function() { return 2.0 * Math.PI * this.radius ; }
circle.prototype.arc = function( rad ) { return ( this.circumference() / ( 2.0 * Math.PI ) * rad ) ; }
circle.prototype.area = function()            { return Math.PI * this.radius * this.radius ; }
circle.prototype.get_curvature = function() { return this.radius == 0 ? 0 : ( 1.0 / this.radius ) ; }
circle.prototype.set_curvature = function( c ) { this.radius = c == 0 ? 0 : ( 1.0 / c ) ; }
circle.prototype.rotate = function( center_pt, rot_rad ) { this.center = this.center.rotate( center_pt, rot_rad ); }
circle.prototype.move = function( _move_x, _move_y )
{
		if ( arguments.length == 1 && is_point( arguments[0] ) )
		{
				this.center.x += arguments[0].x, this.center.y += arguments[0].y ;
		}
		else if ( arguments.length == 2 && is_number( arguments[0] ) && is_number( arguments[1] ) )
		{
				this.center.x += arguments[0], this.center.y += arguments[1] ;
		}
}

circle.prototype.include = function( C2 ) { return ( ( this.center.distance( C1.center ) + C2.radius ) <= this.radius ) ? 1 : 0 ; }
circle.prototype.include_point = function( pt )  { return this.center.distance( pt ) <= this.radius ? 1 : 0 ; }
circle.prototype.is_boundary_point = function( pt, _tolerance )
{
    _tolerance = Math.abs( safe_float( _tolerance, 0 ) );
    return Math.abs( this.center.distance( pt ) - this.radius ) <= error ? 1 : 0 ;
}

circle.prototype.is_secant = function( C2 ) { return ( this.center.distance( C1.center ) < ( this.radius + C2.radius ) ) ? 1 : 0 ; }
circle.prototype.is_intersecting = function( C2 ) { return ( this.center.distance( C1.center ) > ( this.radius + C2.radius ) ) ? 0 : 1 ; }
circle.prototype.is_tangent = function( C2 ) { return ( this.center.distance( C1.center ) == ( this.radius + C2.radius ) ) ? 1 : 0 ; }
circle.prototype.is_internally_tangent = function( C2 )
{
    var dX = this.center.x - C2.center.x ;
    var dY = this.center.y - C2.center.y ;
    var dR = this.radius - C2.radius ;
    return ( ( dX*dX + dY*dY ) == dR*dR ) ? 1 : 0 ;
}

circle.prototype.is_internally_tangent = function( C2 )
{
    var dX = this.center.x - C2.center.x ;
    var dY = this.center.y - C2.center.y ;
    var dR = this.radius + C2.radius ;
    return ( ( dX*dX + dY*dY ) == dR*dR ) ? 1 : 0 ;
}

circle.prototype.write = function() { document.write( this.output() ) ; }
circle.prototype.fulloutput = function() { return ( this.output() + " Draw : " + this.draw + "/" + this.drawcolor + " Fill : " + this.fill + "/" + this.fillcolor ) ; }
circle.prototype.pack = function() { return this.center.x + "@" + this.center.y + "@" + this.radius ; }
circle.prototype.unpack = function( _packed_input )
{
    if ( _packed_input.includes( "@" ) )
    {
       var _tmp = _packed_input.split( "@" );
       if ( _tmp.length == 3 )
       {
          this.center.x = safe_float( _tmp[0], 0 );
          this.center.y = safe_float( _tmp[1], 0 );
          this.radius = safe_float( _tmp[2], 0 );
          return YES ;
       }
       else return NO ;
    }
    else return NO ;
}

circle.prototype.roundTo = function( _round_digits )
{
    _round_digits = safe_int( _round_digits, _CIRCLE_OBJ_MAX_ACCURACY );
    return new circle( this.center.roundTo( _round_digits ), this.radius.roundTo( _round_digits ),
                       this.draw, this.fill, this.drawcolor, this.fillcolor, this.linewidth, this.notes
                     );
}

circle.prototype.output = function( _format, _round_digits, _include_notes )
{
    _round_digits = safe_int( _round_digits, _CIRCLE_OBJ_MAX_ACCURACY );
    _include_notes = safe_int( _include_notes, YES );
    _format = safe_string( _format, "" ) ;
    var _out = "" ;
 		if ( !is_point( this.center ) || isNaN( this.radius ) ) return "" ;
    var _center_x = this.center.x == 0 ? this.center.x : this.center.x.roundTo(_round_digits).toString().replace( '\\.0*$', '' ) ;
    var _center_y = this.center.y == 0 ? this.center.y : this.center.y.roundTo(_round_digits).toString().replace( '\\.0*$', '' ) ;
    var _radius = this.radius == 0 ? this.radius : this.radius.roundTo(_round_digits).toString().replace( '\\.0*$', '' ) ;

    switch( _format )
    {
       case "triplet":
       _out = "(" + _center_x + "," + _center_y + "," + _radius + ")" ;
       break ;
       case "plain":
       _out = _center_x + "," + _center_y + "," + _radius ;
       break ;
       default:
       _out = ( "center: (" + _center_x + "," + _center_y + ") radius:" + _radius ) ;
       break ;
    }
    
    if ( safe_size( this.notes, 0 ) > 0 && _include_notes ) _out += " - notes : " + this.notes ;
    return _out ;
}

circle.prototype.get_square_matrix = function()
{
    if ( this.radius <= 0 ) return this.get_matrix_from_line() ;
    else
    {
        return [ new complex( this.center.x / this.radius, this.center.y / this.radius ),
                 new complex( this.radius - ( this.center.x * this.center.x + this.center.y * this.center.y ) / this.radius, 0 ),
                 new complex( 1.0 / this.radius, 0 ),
                 new complex( -this.center.x / this.radius, this.center.y / this.radius ) ] ;
    }
}

circle.prototype.get_matrix_from_line = function()
{
    var _i = new complex( 0, 1 ) ;
    var _unit = new complex( -Math.PI * Math.cos( this.radius ), -Math.PI * Math.sin( this.radius ) );
    var _center_complex = new complex( this.center.x, this.center.y ) ;
    return [ _i.mul( _unit ),
             _i.mul( _i, ( _unit.conj().mul( _center_complex ) ).sub( unit.mul( _center_complex.conj() ) ) ),
             new complex( 0, 0 ),
             _i.mul( _unit.conj() ) ] ;
}

circle.prototype.isometric_circle_from_matrix = function( _a, _b, _c, _d, _fix_it )
{
    _fix_it = safe_int( _fix_it, 0 );
    var _a_c = _a.div( _c ), _unit = new complex( 1.0, 0.0 ) ;
    this.center = _c.radius() > 0 ? new point( _a_c.real, _a_c.imag ) : new point( Infinity, Infinity ) ;
    this.radius = _c.real > 0 ? _unit.div( _c ).radius() : 0.0 ;
    if ( _fix_it ) this.fixer();
}

circle.prototype.orthogonality_test = function( _C2, _accuracy )
{
		// ref. "geometry" by Brannan, Esplen, Gray - page 9
    _accuracy = safe_float( _accuracy, _CIRCLE_OBJ_MAX_ACCURACY );
		if ( !is_circle( _C2 ) ) return NO ;
		var _coeffs_1 = this.equation( _accuracy );
		var _f1 = _coeffs_1[0], _g1 = _coeffs_1[1], _h1 = _coeffs_1[2] ;
		var _coeffs_2 = _C2.equation( _accuracy );
		var _f2 = _coeffs_2[0], _g2 = _coeffs_2[1], _h2 = _coeffs_2[2] ;
		var _ret = Math.abs( _f1 * _f2 + _g1 * _g2 - 2.0 * ( _h1 + _h2 ) ) ;
		return _ret <= Math.pow( 10, -_accuracy ) ? 1 : 0 ; 
}

circle.prototype.equation = function( _accuracy )
{
    _accuracy = safe_float( _accuracy, _CIRCLE_OBJ_MAX_ACCURACY );
    // assuming the complete equation of a circle
    // x^2 + y^2 + \alpha x + \beta y + \gamma = 0
    var _alpha = -this.center.x * 2.0 ;
    var _beta = -this.center.y * 2.0 ;
    var r = this.radius, c_x = this.center.x, c_y = this.center.y ;
    var _gamma = -r * r + c_x * c_x + c_y * c_y ;
    return [ safe_float( _alpha.toFixed( _accuracy ), 0 ),
						 safe_float( _beta.toFixed( _accuracy ), 0 ),
						 safe_float( _gamma.toFixed( _accuracy , 0) ) ] ;
}

circle.prototype.intersection = function( C2, _accuracy, strict )
{
    strict = safe_float( strict, 0 );
    _accuracy = safe_float( _accuracy, _CIRCLE_OBJ_MAX_ACCURACY );
    var C1 = this ;
    // delta
    var x1 = C1.center.x, y1 = C1.center.y, r1 = C1.radius ;
    var x2 = C2.center.x, y2 = C2.center.y, r2 = C2.radius ;
    var x12 = x1 * x1, y12 = y1 * y1 ;
    var x22 = x2 * x2, y22 = y2 * y2 ;
    var r12 = r1 * r1, r22 = r2 * r2 ;
    var approximation = Math.pow( 2, -_accuracy ) ;
    var _delta = -((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)-(r1-r2)*(r1-r2))*((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)-(r1+r2)*(r1+r2)) ;
    if ( strict == 0 && Math.abs( _delta ) <= approximation ) _delta = 0 ;
    else if ( _delta < 0 ) return { n : 0 } ;
      
    var _delta_sqrt = Math.sqrt( _delta ) ;
    var den = 2.0*(x1-x2)*(x1-x2)+2.0*(y1-y2)*(y1-y2) ;
        if ( den == 0 ) den = approximation ;
      
    //pt1
    var pt1x = (-(x1-x2)*(r12-r22-x12+x22)+(x1+x2)*(y1-y2)*(y1-y2)+(y1-y2)*_delta_sqrt)/den ;
    var pt1y = (-(y1-y2)*(r12-r22-y12+y22)+(y1+y2)*(x1-x2)*(x1-x2)-(x1-x2)*_delta_sqrt)/den ;
      
    //pt2
    var pt2x = (-(x1-x2)*(r12-r22-x12+x22)+(x1+x2)*(y1-y2)*(y1-y2)-(y1-y2)*_delta_sqrt)/den ;
    var pt2y = (-(y1-y2)*(r12-r22-y12+y22)+(y1+y2)*(x1-x2)*(x1-x2)+(x1-x2)*_delta_sqrt)/den ;

    var _pt1 = ( isNaN( pt1x ) || isNaN( pt1y ) ) ? null : new point( pt1x, pt1y );
    var _pt2 = ( isNaN( pt2x ) || isNaN( pt2y ) ) ? null : new point( pt2x, pt2y );

    var _n = 0 ;
    if ( _pt1 != null ) _n++ ;
    if ( _pt2 != null ) _n++ ;
      
    if ( _pt1 != null && _pt2 != null )
    {
        if ( _pt1.distance( _pt2 ) <= approximation ) _pt2 = _pt1 ;
        _n = ( _pt1.is_equal_to( _pt2 ) ) ? 1 : 2 ;
    }

    return { n : _n, pt1 : _pt1, pt2 : _pt2 } ;
}

// EXTERNAL FUNCTIONS
function read_circle()
{
    if ( arguments.length == 0 ) return null ;
    else if ( arguments.length == 2 && is_point( arguments[0] ) && safe_float( arguments[1], 0 ) > 0 )
    return new circle( arguments[0], arguments[1] );
    else if ( arguments.length == 3 )
    return new circle( new point( safe_float( arguments[0], 0 ), safe_float( arguments[1], 0 ) ), safe_float( arguments[0], 0 ) ) ;
    else return null ;
}

function circle_move_to_tangency( C1, C2 )
{
    var _dist = C1.center.distance( C2.center ), _diff = 0 ;
    if ( _dist > C1.radius && _dist > C2.radius )
    {
      var _d1 = _dist - C1.radius, _d2 = _dist - C2.radius ;
      _diff = _dist - _d1 - _d2 ;
    }
    else if ( _dist > C1.radius && _dist < C2.radius ) _diff = C2.radius - _dist + C1.radius ;
    else _diff = C1.radius - _dist + C2.radius ;
    if ( _diff == 0 ) _diff = C1.radius ;
    var _slope = C1.center.slope( C2.center );
    C1.center.shift( -Math.cos( _slope ) * _diff, -Math.sin( _slope ) * _diff );
    return C1 ;
}

function circle_resize_to_tangency( C1, C2, alwayexternal )
{
    var C1_coeffs = C1.equation(), C2_coeffs = C2.equation();
    var _alpha_1 = C1_coeffs['alpha'], _beta_1 = C1_coeffs['beta'], _gamma_1 = C1_coeffs['gamma'] ;
    var _alpha_2 = C2_coeffs['alpha'], _beta_2 = C2_coeffs['beta'], _gamma_2 = C2_coeffs['gamma'] ;
    // intersecting the two circle equations, we get
    // (_alpha_1-_alpha_2)x + (_beta_1-_beta_2)y + (_gamma_1-gamma_2) = 0 ;
      
    var a = _alpha_1 - _alpha_2 ;
    var b = _beta_1 - _beta_2 ;
    var c = _gamma_1 - _gamma_2 ;

    // and it turns into
    // (0) : ax + by + c = 0
    // and we have the more readable form
    // x = ( -c - by ) / a
    // y = ( -c - ax ) / b
    // notice that (a != 0) and ( b != 0 ) for computing x and y respectively 

    // if we replace x into (0), the latter becomes
    // (2) : ((-c-by)^2/a^2) + y^2 + \alpha_1 * (-c-by)/a + \beta_1 * y + \gamma_1 = 0

    // we replace y into (0), the latter becomes
    // (2) : x^2 +((-c-ax)^2/b^2) + \alpha_1 * x + \beta_1 * ((-c-ax )/b) + \gamma_1 = 0
      
    // expanding and rewriting (2),
    // we have the following coefficients
      
    var k = a * a + b * b ; // either if x or y is computed
    var j = 0 ;
        //if ( a != 0 ) 
        //j = 2.0 * b * c - a * _alpha_1 * c + a * a * _beta_1 ; // compute y
        //else if ( b != 0 ) 
        j = 2.0 * a * c + _alpha_1 * b * b - a * b * _beta_1 ; // compute x
    var l = 0 ;
        //if ( a != 0 )
        //l = c * c - a * _alpha_1 * b + a * a * _gamma_1 ; // compute y
        //else if ( b != 0 )
        l = c * c - b * _beta_1 * c + b * b * _gamma_1 ; // compute x

        // (2) is now kx^2 + jx + l = 0

    if ( a == 0 && b == 0 && c == 0 )
    {
       // equation (3) degenerates into 0 = 0
       return null ; // circles match  
    }
    else if ( a == 0 && b == 0 )
    {
       // equation (3) degenerates into the constant value l = 0
       return null ; // circles are concentric  
    }
    else
    {
       var _delta = j * j - 4.0 * k * l ;
       if ( _delta != 0 )
       {
          var r1 = C1.radius, r2 = C2.radius, distance = C1.center.distance( C2.center );
          var dX = ( r1 + r2 ) - distance ;
              r1 = r1 - dX ;
              C1.radius = r1 ;
          return C1 ;
       }
       else return C1 ;
    }
}

function circle_from_equation( _alpha, _beta, _gamma, _fix_it )
{
    // circle eq. : x^2 + y^2 + \alpha x + \beta y + \gamma = 0
    // X center = -\alpha / 2.0
    // Y center = -\beta / 2.0
    // radius = sqrt( X_center ^ 2 + Y_center ^2 - \gamma )
    _fix_it = safe_int( _fix_it, 0 );
    var center_x = -_alpha / 2.0, center_y = -_beta / 2.0 ;
    var radius = Math.sqrt( center_x * center_x + center_y * center_y - _gamma ) ;
    return new circle( new point( center_x, center_y ), radius ) ;
}