/*  this class requires the following components
    * 2d.point.class.js
    * circle.class.js
    * complex.number.class.js
    * mobius.map.class.js

*/
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

function poincare_disk_model()
{
    this.unit_circle = new circle( new point( 0, 0 ), 1 ) ;
}

poincare_disk_model.prototype.is_internal_line = function( _circle )
{
		var _coeffs = _circle.equation();
		return ( _coeffs[0] * _coeffs[0] + _coeffs[1] * _coeffs[1] ) > 4 ? 1 : 0 ; 
}

poincare_disk_model.prototype.hyperbolic_reflection = function( _alpha, _z )
{
    // _alpha is the center of reflection
		if ( is_point( _alpha ) ) _alpha = new complex( _alpha.x, _alpha.y ) ;
    else if ( !is_complex( _alpha ) ) return null ;
    if ( _alpha.radius() < 1 ) return null ; // this condition is required for reflections inside the disk model
    return _alpha.mul( _z ).sub( 1.0 ).div( _z.conj().sub( _alpha.conj() ) ) ;
}

poincare_disk_model.prototype.get_circle_from_two_points = function( _pt1, _pt2 )
{
    if ( !is_point( _pt1 ) || !is_point( _pt2 ) ) return null ;
    else
    {
         /* f(x,y) : x^2 + y^2 - 2ax - 2by + 1 = 0, with center at \alpha = a+ib
            this is the equation of the Euclidean circle including the d-line (being
            the portion of that same circle inside the Poincarè unit disk)
         */
         
         /* applying pt1 to f(x,y), we get
            ax1 - by1 = (x1^2 - y1^2 - 1)/2 ... k1 = (x1^2 - y1^2 - 1)/2
         */
         var _k1 = ( _pt1.x * _pt1.x - _pt1.y * _pt1.y - 1 ) / 2.0 ;

         /* applying pt2 to f(x,y), we get
            ax2 - by2 = (x2^2 - y2^2 - 1)/2 ... k2 = (x2^2 - y2^2 - 1)/2
         */
         var _k2 = ( _pt2.x * _pt2.x - _pt2.y * _pt2.y - 1 ) / 2.0 ;
         
         /* after substitutions and further manipulation in a system of two equations and two unknowns
            we get to
         */
         var _b = ( _k2 * _pt1.x - _k1 * _pt2.x ) / ( _pt1.y * _pt2.x - _pt1.x * _pt2.y ) ;
         // and finally
         var _a = _k1 + _b * _pt1.y / _pt1.x ;
         
         return new circle( new point( _a, _b ), _center.distance( _pt1 ) ) ;
    }
}
