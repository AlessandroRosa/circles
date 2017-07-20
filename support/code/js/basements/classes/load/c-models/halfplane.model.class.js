/*  this class requires the following components
    * 2d.point.class.js
    * circle.class.js
    * complex.number.class.js
    * mobius.map.class.js

*/

// all members of this class are intended to work
// on the closed upper complex half-plane H = { z \in C : Im(z) >= 0 }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

function halfplane_model()
{
}

halfplane_model.prototype.geodesic = function( _z1, _z2 )
{
		if ( is_complex( _z1 ) && is_complex( _z2 ) )
		{
				 // assume a point z_0 on the real axis, hence the problem boils down to find out x0, given z_0 = (x0;0)
				 // assume that the distance from z0 to _z1 is equal to the distance from z_0 to z_2
				 // Let x1 = z1.real, y1 = z1.imag
				 // Let x2 = z2.real, y2 = z2.imag
				 // then we have sqrt( (x1-x0)^2+(y1-y0)^2 ) = sqrt( (x2-x0)^2+(y2-y0)^2 )
				 // ... expanding and solving, we have finally the following straight-line equation
				 // ax0 + by0 + c = 0
				 // where a = 2(x2-x1), b = 2(y2-y1), c = x1^2 - x2^2 + y1^2 - y2^2

				 var _a = 2.0 * ( _z2.real - _z1.real );
				 var _b = 2.0 * ( _z2.imag - _z1.imag );
				 var _c = _z1.real * _z1.real - _z2.real * _z2.real ;
				     _c += _z1.imag * _z1.imag - _z2.imag * _z2.imag ;

				 // ax0 + by0 + c = 0, then x0 = ( -by0 - c ) / a
				 var _y0 = 0.0 ; // the center lies on the real axis
				 var _z0 = new complex( ( -_b * _y0 -_c ) / _a, 0.0 );
				 // we also compute the resulting angle of the sector between z1 and z2
				 // first move both z_1 and z_2 so that they lie now on a circle centered at the origin
				 var _ang_z1 = _z1.sub( _z0 ).angle2PI(), _ang_z2 = _z2.sub( _z0 ).angle2PI();
				 // angles will be arranged clockwisely from the positive real axis
				 var _radius = _z0.distance( _z1 ), _sector = Math.abs( _ang_z1 - _ang_z2 );
				 var _arc_length = _radius * _sector ;
				 return { 'center' : _z0,
				 					'sector' : _sector,
				 					'sector_start' : _ang_z1, // from 0 to 2PI clockwise
				 					'sector_end' : _ang_z2, // from 0 to 2PI clockwise
									'radius' : _radius,
									'chord' : _z1.distance( _z2 ),
									'arclength' : _arc_length,
									'orientation' : ( ( _ang_z1 < _ang_z2 ) ? "clockwise" : "counter" )
								} ;
		}
		else return null ;
}

halfplane_model.prototype.bisector = function( _z0, _radius, _z1, _z2 )
{
		if ( is_complex( _z0 ) && is_complex( _z1 ) && is_complex( _z2 ) )
		{
				 var _mid_point = _z1.add( _z2 ).div( 2.0 );
				 var _r2 = _radius * _radius ;
				 var _x_x0 = _mid_point.real - _z0.real ;
				 var _y_y0 = _mid_point.imag - _z0.imag ;

				 var _inverse_pt_x = _z0.real + ( _r2 * _x_x0 ) / ( Math.pow( _x_x0, 2 ) + Math.pow( _y_y0, 2 ) );
				 var _inverse_pt_y = _z0.imag + ( _r2 * _y_y0 ) / ( Math.pow( _x_x0, 2 ) + Math.pow( _y_y0, 2 ) );

				 var _inverse_pt = new complex( _inverse_pt_x, _inverse_pt_y );
				 return this.geodesic( _mid_point, _inverse_pt );
		}
		else return null ;
}

halfplane_model.prototype.polyline = function( _context, _mapper, _pts_array, _draw, _drawcolor, _fill, _fillcolor, _linewidth, _close )
{
    if ( !object_exists( _context ) || !object_exists( _mapper ) ) return false ;
		if ( !is_array( _pts_array ) ) return false ;
    _draw = safe_int( _draw, YES ), _fill = safe_int( _fill, NO );
    _opacity = safe_float( _opacity, DEFAULT_MAX_OPACITY );
    _linewidth = safe_int( _linewidth, 1 );
		_close = safe_int( _close, 0 );
		if ( _close ) _pts_array.push( _pts_array[0] );

	  _context.globalAlpha = _opacity ;
		_context.strokeStyle = safe_string( _drawcolor, "transparent" );
		_context.fillStyle = safe_string( _fillcolor, "transparent" );
	  _context.lineWidth = _linewidth ;

		_context.beginPath();
		var _z0, _z1, _z2, _ret_data ;
		var _radius, _sector, _orientation, _screen_z0  ;
		var _ret_data = [] ;

		for( var _i = 1 ; _i < _pts_array.length ; _i++ )
		{
				_z1 = _pts_array[_i-1], _z2 = _pts_array[_i] ;
				_ret_data = this.geodesic( _z1, _z2 );
				_z0 = _ret_data['center'] ;
				_radius = _ret_data['radius'] ;
				_sector = _ret_data['sector'] ;
				_orientation = _ret_data['orientation'] ;

		    _screen_z0 = _mapper.from_cartesian_to_client( _z0.real, _z0.imag );
		    _screen_z1 = _mapper.from_cartesian_to_client( _z1.real, _z1.imag );

				if ( _draw )
				{
						_context.arc( _screen_z0.x, _screen_z0.y,
													_screen_z0.distance( _screen_z1 ),
													_ret_data['sector_start'],
													_ret_data['sector_end'],
													_orientation == "clockwise" ? false : true );
						_context.stroke();
				}
		}

    if ( _fill && _fillcolor.length > 0 )
	  {
	       _context.fillStyle = _fillcolor ;
	       _context.fill();
	  }

		_context.closePath();
		return true ;
}