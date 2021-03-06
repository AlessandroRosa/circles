/*
    JS line class library is free software: you can redistribute it and/or modify
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

  /*frameworkdatatype
     datatype_dev : line
     datatype_public : line
     constructor1 : line(x1,y1,x2,y2)
     notes_constructor1 : custom datatype
     constructor2 : line( point1, point2 )
     notes_constructor2 : custom datatype
     output method: output
     comparison method: is_equal_to
     typization method : is_line
     notes: line object - custom datatype
     frameworkdatatype*/

var LINE_MAX_ACCURACY = 12 ; // suggested value for all accuracy tests. Never exceed 20, which is max value allowed by javascript .toPrecision built-in function
var LINE_CLASS_ERROR_NONE = 0, LINE_CLASS_ERROR_PARALLEL = 1, LINE_CLASS_ERROR_COINCIDENT = 2, LINE_CLASS_ERROR_UNKNOWN = 3 ;

if ( typeof is_array != "function" ) function is_array( _obj ) { return _obj instanceof Array ? 1 : 0 ; }
if ( typeof is_complex != "function" ) function is_complex( _obj ) { return _obj instanceof complex ? 1 : 0 ; }
if ( typeof is_integer != "function" ) function is_integer( _obj ) { return is_number( _obj ) ? ( Math.floor( _obj ) == _obj ? 1 : 0 ) : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj ) { return ( typeof _obj == "number" || _obj instanceof Number ) ; }
if ( typeof is_rational != "function" ) function is_rational( _obj ) { return is_number( _obj ) ? !is_integer( _obj ) : 0 ; }
if ( typeof is_string != "function" ) function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; }

if ( typeof is_line != "function" ) function is_line( _a ) 		{ return _a instanceof line ? 1 : 0 ; }
if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ) ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

function line()
{
	this.customclass = arguments.callee.name ;
    if ( is_point( arguments[0] ) && is_point( arguments[1] ) )
    {
        this.start_pt = arguments[0] ;
        this.end_pt = arguments[1] ;
        this.bordersize = safe_int( arguments[2], 1 ) ;
        this.bordercolor = safe_string( arguments[3], "" ) ;
        this.slope = this.slope() ;
        this.length = this.get_length() ;
        this.error = 0 ;
    }
    else if ( is_line( arguments[0] ) )
    {
        this.start_pt = arguments[0].start_pt ;
        this.end_pt = arguments[0].end_pt ;
        this.bordersize = arguments[0].bordersize ;
        this.bordercolor = arguments[0].bordercolor ;
        this.slope = this.slope() ;
        this.length = this.get_length() ;
        this.error = 0 ;
    }
    else
    {
        this.start_pt = new point( arguments[0], arguments[1] ) ;
        this.end_pt = new point( arguments[2], arguments[3] ) ;
        this.bordersize = safe_int( arguments[4], 1 ) ;
        this.bordercolor = safe_string( arguments[5], "" ) ;
        this.slope = this.slope() ;
        this.length = this.get_length() ;
        this.error = 0 ;
    }
}

line.prototype.set_coords = function( startX, startY, endX, endY, bordersize, bordercolor )
{
    this.start_pt = new point( startX, startY ) ;
    this.end_pt = new point( endX, endY ) ;
    this.bordersize = safe_int( bordersize, 1 ) ;
    this.bordercolor = safe_string( bordercolor, "" ) ;
    this.slope = this.slope() ;
    this.length = this.get_length() ;
    this.error = 0 ;
}

line.prototype.set_start_pt = function( _pt ) { if ( is_point( _pt ) ) { this.start_pt.x = _pt.x, this.start_pt.y = _pt.y ; } }
line.prototype.set_end_pt = function( _pt ) { if ( is_point( _pt ) ) { this.end_pt.x = _pt.x, this.end_pt.y = _pt.y ; } }
line.prototype.get_start_pt = function() { return this.start_pt ; }
line.prototype.get_end_pt = function() { return this.end_pt ; }
line.prototype.get_both_end_pts = function() { return [ this.start_pt, this.end_pt ]; }
line.prototype.get_error = function() { return this.error ; }
line.prototype.copy = function() { return new line( this.start_pt.x, this.start_pt.y, this.end_pt.x, this.end_pt.y, this.bordersize, this.bordercolor ); }
line.prototype.is_parallel_to = function() { return !this.intersect_test.apply( this, arguments ) ; }
line.prototype.is_equal_to = function( L2 ) { return is_line( L2 ) ? ( ( this.start_pt.is_equal_to( L2.start_pt ) && this.end_pt.is_equal_to( L2.end_pt ) ) ? 1 : 0 ) : 0 ; }
line.prototype.roundTo = function( _round_digits )
{
    _round_digits = safe_int( _round_digits, LINE_MAX_ACCURACY );
    return new line( this.start_pt, this.end_pt, this.bordersize, this.bordercolor );
}

line.prototype.output = function( _round_digits )
{
    _round_digits = safe_int( _round_digits, LINE_MAX_ACCURACY );
    return ( "(" + this.start_pt.x.roundTo(_round_digits).toString().replace( '\\.0*$', '' ) + "," + this.start_pt.y.roundTo(_round_digits).toString().replace( '\\.0*$', '' ) + ")-(" + this.end_pt.x.roundTo(_round_digits).toString().replace( '\\.0*$', '' ) + "," + this.end_pt.y.roundTo(_round_digits).toString().replace( '\\.0*$', '' ) + ")" ) ;
}

line.prototype.get_length = function()
{
    var distX = Math.abs( this.start_pt.x - this.end_pt.x );
    var distY = Math.abs( this.start_pt.y - this.end_pt.y );
    this.length = Math.sqrt( distX * distX + distY * distY );
    return this.length ;
}

line.prototype.slope = function()
{
    var distX = Math.abs( this.start_pt.x - this.end_pt.x );
    var distY = Math.abs( this.start_pt.y - this.end_pt.y );
    this.slope = distY == 0 ? 0 : Math.atan2( distY, distX );
    if ( this.slope < 0 )
    {
        this.slope += 2.0 * Math.PI ;
        this.slope %= 2.0 * Math.PI ;
    }
    return this.slope ;
}

line.prototype.shift = function()
{
	var _self = 1, _mask = 0 ;
	if ( is_point( arguments[0] ) ) { _self = safe_int( arguments[1], 1 ) ; _mask = 1 ; }
	else if ( is_number( arguments[0] ) && is_number( arguments[1] ) ) { _self = safe_int( arguments[2], 1 ) ; _mask = 2 ; }
	if ( _self )
	{
		switch( _mask )
		{
			case 1: this.start_pt.shift( arguments[0] ); this.end_pt.shift( arguments[0] ); return 1 ; break ;
			case 2: this.start_pt.shift( arguments[0], arguments[1] ); this.end_pt.shift( arguments[0], arguments[1] ); return 1 ; break ;
			default: return 0 ; break ;
		}
	}
	else
	{
		var _c = this.copy();
		switch( _mask )
		{
			case 1: _c.start_pt.shift( arguments[0] ); _c.end_pt.shift( arguments[0] ); break ;
			case 2: _c.start_pt.shift( arguments[0], arguments[1] ); _c.end_pt.shift( arguments[0], arguments[1] ); break ;
			default: return null ; break ;
		}
		return _c ;
	}
}

line.prototype.rotate = function( _center = null, _rad = 0, _self = 1 )
{
	if ( !is_point( _center ) ) _center = new point( ( this.start_pt.x + this.end_pt.x ) / 2.0, ( this.start_pt.y + this.end_pt.y ) / 2.0 );
	if ( _self )
	{
		this.start_pt.rotate( _center, _rad );
		this.end_pt.rotate( _center, _rad );
		return is_point( this.start_pt ) && is_point( this.end_pt ) ? 1 : 0 ;
	}
	else
	{
		var _c = this.copy();
		_c.start_pt = _c.start_pt.rotate( _center, _rad, 1 );
		_c.end_pt = _c.end_pt.rotate( _center, _rad, 1 );
		return _c ;
	}
}

line.prototype.intersection = function()
{
	var _start_pt = null, _end_pt = null, _line = null ;
	if ( arguments.length == 0 ) return NO ;
	else if ( is_line( arguments[0] ) )
	{
		_start_pt = arguments[0].start_pt, _end_pt = arguments[0].end_pt ;
	}
	else if ( is_point( arguments[0] ) && is_point( arguments[1] ) )
	{
		_start_pt = arguments[0], _end_pt = arguments[1] ;
	}
	else if ( arguments.length == 4 ) // supposed they are all float values
	{
		_start_pt = new point(), _end_pt = new point();
		_start_pt.x = arguments[0], _start_pt.y = arguments[1] ;
		_end_pt.x = arguments[2], _end_pt.y = arguments[3] ;
	}
	else return NO ;

    var x1 = this.start_pt.x, y1 = this.start_pt.y ;
    var x2 = this.end_pt.x, y2 = this.end_pt.y ;
    var x3 = _start_pt.x, y3 = _start_pt.y ;
    var x4 = _end_pt.x, y4 = _end_pt.y ;
    var _den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4) ;
    if ( _den == 0 )
    {
        if ( this.is_equal_to( new line( x3, y3, x4, y4 ) ) )
        {
            this.error = LINE_CLASS_ERROR_COINCIDENT ;
            return null ;
        }
        else if ( this.slope() == ( new line( x3, y3, x4, y4 ) ).slope() )
        {
            this.error = LINE_CLASS_ERROR_PARALLEL ;
            return null ;
        }
        else
        {
            this.error = LINE_CLASS_ERROR_UNKNOWN ;
            return null ;
        }
    }

    var _num1 = (x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4) ;
    var _num2 = (x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4) ;
    return new point( _num1 / _den, _num2 / _den ) ;
}

line.prototype.intersect_test = function()
{
	var _start_pt = null, _end_pt = null, _line = null ;
	if ( arguments.length == 0 ) return NO ;
	else if ( is_line( arguments[0] ) )
	{
		_start_pt = arguments[0].start_pt, _end_pt = arguments[0].end_pt ;
	}
	else if ( is_point( arguments[0] ) && is_point( arguments[1] ) )
	{
		_start_pt = arguments[0], _end_pt = arguments[1] ;
	}
	else if ( arguments.length == 4 ) // supposed they are all float values
	{
		_start_pt = new point(), _end_pt = new point();
		_start_pt.x = arguments[0], _start_pt.y = arguments[1] ;
		_end_pt.x = arguments[2], _end_pt.y = arguments[3] ;
	}
	else return NO ;
		
	_line = new line( _start_pt.x, _start_pt.y, _end_pt.x, _end_pt.y ) ;
	var _cross_prod = ( this.start_pt.x - this.end_pt.x ) * ( _line.start_pt.y - _line.end_pt.y ) ;
		_cross_prod -= ( this.start_pt.y - this.end_pt.y ) * ( _line.start_pt.x - _line.end_pt.x ) ;
	return _cross_prod == 0 ? 0 : 1 ;
}

line.prototype.get_equation = function( _point1, _point2 )
{
    // ref. eq. model y = mx + q
    if ( _point1.is_equal_to( _point2 ) || ( _point1.x == _point2.x ) ) return null ;
    var _m = ( _point1.y - _point2.y ) / ( _point1.x - _point2.x ) ;
    var _q = _point1.y - _m * _point1.x ;
    return [ _m, _q ] ;
}