Math.sec = function( _x ) { return 1.0 / Math.cos(_x) ; }
Math.cosec = function( _x ) { return 1.0 / Math.sin(_x) ; }

Math.cot = function( _x ) { return 1.0 / Math.tan(_x) ; }
Math.cotn = function( _x ) { return 1.0 / Math.tan(_x) ; }
Math.cotg = function( _x ) { return 1.0 / Math.tan(_x) ; }
Math.cotan = function( _x ) { return 1.0 / Math.tan(_x) ; }
Math.ctg = function( _x ) { return 1.0 / Math.tan(_x) ; }

Math.radius = function( _x, _y ) { return Math.sqrt( Math.pow(_x,2,0)+Math.pow(_y,2.0) ) ; }
Math.factorial = function( _n ) { var _p = 1 ; while( _n > 0 ) { _p *= _n-- ; } return _p ; }
Math.sum_n = function( _n ) { return _n % 2 == 1 ? ( _n * ( ( _n - 1 ) / 2 ) + _n ) : ( ( _n + 1 ) * _n / 2 ) ; } 