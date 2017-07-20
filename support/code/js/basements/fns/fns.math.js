function is_infinity( _n ) { return _n == Infinity || _n == -Infinity ? 1 : 0 ; }
function is_positive_infinity( _n ) { return _n == Infinity ? 1 : 0 ; }
function is_negative_infinity( _n ) { return _n == -Infinity ? 1 : 0 ; }
function round_to_decimals( n, d ) { return ( Math.round( n * Math.pow( 10, d ) ) / Math.pow( 10, d ) ) ; }
function factorize(num)
{
    var root = Math.sqrt(num),
    result = arguments[1] || [],  //get unnamed paremeter from recursive calls
    x = 2;

    if(num % x){//if not divisible by 2
     x = 3;//assign first odd
     while((num % x) && ((x = x + 2) < root)){}//iterate odds
    }
    //if no factor found then num is prime
    x = x <= root ? x : num;
    result.push(x);//push latest prime factor

    //if num isn't prime factor make recursive call
    return x === num ? result : factorize(num/x, result) ;
}

function continuous_frac_convergents( _p, _q )
{
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

function euler_phi( _n ) // finds the number of unique fractions with input denominator _n in the farey tree
{
    var _factors = factorize( _n ) ; // each factor has unit exponent
    _factors.sort( function(a, b){return a-b} );
    var _ret = 1, _exponent, _x, _exponents_array = new Array(), _i ;
    for( _i = 0 ; _i < _factors.length ; _i++ ) _exponents_array[ ""+_factors[_i] ] = 0 ; // zero init fill
    for( _i = 0 ; _i < _factors.length ; _i++ ) _exponents_array[ ""+_factors[_i] ] += 1 ; // fill with number of occurrences
    var _unique_factors = _factors.unique();
    for( _i = 0 ; _i < _unique_factors.length ; _i++ )
    {
        _exponent = parseInt( _exponents_array[ ""+_unique_factors[_i] ], 10 ) ;
        _x = Math.pow( _unique_factors[_i], _exponent - 1 ) * ( _unique_factors[_i] - 1 ) ;
        _ret *= _x ;
    }
    return _ret ;
}

function randomFromTo( from, to )
{
    from = parseInt( from, 10 );   if ( isNaN( from ) ) from = 0 ;
    to = parseInt( to, 10 );       if ( isNaN( to ) ) to = 0 ;
    return Math.floor( Math.random() * (to - from + 1) + from );
}

function attempt_to_closest_int( _n, accuracy )
{
    var _floor_n = Math.floor( _n );
    var _ceil_n = Math.ceil( _n );
    var _tenth_accuracy = Math.pow( 10, -accuracy ) ;
    if ( Math.abs( _n - _floor_n ) <= _tenth_accuracy ) return _floor_n ;
    else if ( Math.abs( _n - _ceil_n ) <= _tenth_accuracy ) return _ceil_n ;
    else return _n ;
}

function gcd(a, b) // greatest common divisor
{
    if ( ! b) return a ;
    return gcd(b, a % b);
}

function safe_int( _val, _set_if_nan )
{
    _val = parseInt( _val, 10 );
    return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ;
}

function safe_float( _val, _set_if_nan )
{
    _val = parseFloat( _val );
    return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ;
}

function deg( _radians )
{
     var PI = 3.14159265358979323846 ;
     var _rad = safe_float( _radians, 0.0 );
     return _rad / ( 2.0 * PI ) * 360.0 ;
}

function rad( _degrees )
{
     var PI = 3.14159265358979323846 ;
     var _deg = safe_float( _degrees, 0 );
     return _deg / 360.0 * ( 2.0 * PI ) ;
}