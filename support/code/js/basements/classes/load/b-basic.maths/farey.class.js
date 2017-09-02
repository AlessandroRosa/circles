/*
    JS Farey number class Library is free software: you can redistribute it and/or modify
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
     datatype_dev : farey
     datatype_public : farey number
     constructor1 : farey(number,number)
     notes_constructor1 : numerator and denominator
     constructor2 : farey(string)
     notes_constructor2 : input string of fraction
     constructor3 : farey(farey)
     notes_constructor3 : copy constructor
     constructor4 : farey(fraction)
     notes_constructor4 : copy constructor (fraction object)
     comparison method: is_equal_to
     typization method : is_farey
     output method: output('std')
     notes: farey numbers arithmetics manager
     framework data type */

if ( typeof is_array != "function" ) function is_array( _obj ) { return _obj instanceof Array ? 1 : 0 ; }
if ( typeof is_complex != "function" ) function is_complex( _obj ) { return _obj instanceof complex ? 1 : 0 ; }
if ( typeof is_integer != "function" ) function is_integer( _obj ) { return is_number( _obj ) ? ( Math.floor( _obj ) == _obj ? 1 : 0 ) : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj ) { return ( typeof _obj == "number" || _obj instanceof Number ) ; }
if ( typeof is_rational != "function" ) function is_rational( _obj ) { return is_number( _obj ) ? !is_integer( _obj ) : 0 ; }
if ( typeof is_string != "function" ) function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; }

if ( typeof is_farey != "function" )  function is_farey( _obj )  { return _obj instanceof farey ; }
if ( typeof is_fraction != "function" )  function is_fraction( _obj )  { return _obj instanceof fraction ; }
if ( typeof is_infinity != "function" ) function is_infinity( _n ) { return _n == Infinity || _n == -Infinity ? 1 : 0 ; }
if ( typeof is_positive_infinity != "function" ) function is_positive_infinity( _n ) { return _n == Infinity ? 1 : 0 ; }
if ( typeof is_negative_infinity != "function" ) function is_negative_infinity( _n ) { return _n == -Infinity ? 1 : 0 ; }
if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

function farey()
{
		switch( arguments.length )
		{
				case 1:
		    var _frac = arguments[0] ;
				if ( is_fraction( _frac ) || is_farey( _frac ) )
		    {
		         this.p = safe_int( _frac.p, 0 ), this.q = safe_int( _frac.q, 0 );
		    }
		    else if ( is_number( _frac ) )
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

    if ( this.q != 0 )
    {
        this.self_reduce();
    		this.correct();
    }
}

farey.prototype.read_fraction = function()
{
		if ( arguments.length == 2 )
		{
        this.p = safe_int( arguments[0], 0 ), this.q = safe_int( arguments[1], 0 );
		}
		else if ( arguments.length == 1 )
		{
		    var _frac = arguments[0] ;
				if ( is_fraction( _frac ) || is_farey( _frac ) )
		    {
		         this.p = safe_int( _frac.p, 0 ), this.q = safe_int( _frac.q, 0 );
		    }
		    else if ( /^([0-9\-\+]{1,})[\/]([0-9\-\+]{1,})$/.test( _frac ) )
		    {
		         var _arr = _frac.split( "/" );
		         this.p = safe_int( _arr[0], 0 ), this.q = safe_int( _arr[1], 0 );
		    }
		    else if ( is_array( _frac ) )
		    {
		         if ( _frac.length == 2 )
		         {
		              this.p = safe_int( _frac[0], 0 ), this.q = safe_int( _frac[1], 0 );
		         }
		         else this.p = this.q = 0 ;
		    }
        else if ( is_string( _frac ) )
        {
             _frac = safe_float( _frac, 0 );
						 var _f = this.get_fraction_from_decimal( _frac );
						 this.p = _f.p, this.q = _f.q ;
        }
        if ( is_number( _frac ) )
		    {
						 var _f = this.get_fraction_from_decimal( _frac );
						 this.p = _f.p, this.q = _f.q ;
		    }
		}
    else this.p = this.q = 0 ;

    this.self_reduce();
		this.correct();
}

farey.prototype.correct = function()
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

farey.prototype.is_indeterminate = function() { return ( ( is_infinity( this.p ) && is_infinity( this.q ) ) || ( this.p == 0 && this.q == 0 ) ) ? 1 : 0 ; }
farey.prototype.zero_over_zero = function() { return ( this.p == 0 && this.q == 0 ) ? 1 : 0 ; }
farey.prototype.infinity_over_infinity = function() { return ( is_infinity( this.p ) && is_infinity( this.q ) ) ? 1 : 0 ; }
farey.prototype.is_infinity = function() { return ( is_infinity( this.p ) && !is_infinity( this.q ) ) ? 1 : 0 ; }
farey.prototype.is_limit_to_zero = function() { return ( !is_infinity( this.p ) && is_infinity( this.q ) ) ? 1 : 0 ; }

farey.prototype.indet = function()    { this.p = 0, this.q = 0 ; }
farey.prototype.zero = function() { this.p = 0, this.q = 1 ; }
farey.prototype.unit = function() { this.p = 1, this.q = 1 ; }
farey.prototype.infinity = function() { this.p = 1, this.q = 0 ; }

farey.prototype.match_signature = function( _f2 ) { return ( this.p == _f2.p && this.q == _f2.q ) ; }
farey.prototype.is_indeterminate = function() 		{ return ( this.p == 0 && this.q == 0 ) ? 1 : 0 ; }
farey.prototype.array = function()       					{ return [ this.p,  this.q ] ; }
farey.prototype.output = function( _format, _separator )
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

// check members
farey.prototype.is_neighbor = function( _f2 )   { return is_farey( _f2 ) ? ( ( Math.abs( _f2.p * this.q - this.p * _f2.q ) == 1 ) ? 1 : 0 ) : 0 ; }
farey.prototype.is_equal_to = function( _f2 )   { return is_farey( _f2 ) ? ( this.p / this.q == _f2.p / _f2.q ) : 0 ; }
farey.prototype.is_not_equal_to = function( _f2 ) { return is_farey( _f2 ) ? ( this.p / this.q != _f2.p / _f2.q ) : 0 ; }
farey.prototype.is_lesser = function( _f2 ) { return is_farey( _f2 ) ? ( this.p / this.q < _f2.p / _f2.q ) : 0 ;  }
farey.prototype.is_lesser_eq = function( _f2 )  { return is_farey( _f2 ) ? ( this.p / this.q <= _f2.p / _f2.q ) : 0 ; }
farey.prototype.is_greater = function( _f2 )    { return is_farey( _f2 ) ? ( this.p / this.q > _f2.p / _f2.q ) : 0 ;  }
farey.prototype.is_greater_eq = function( _f2 ) { return is_farey( _f2 ) ? ( this.p / this.q >= _f2.p / _f2.q ) : 0 ; }
farey.prototype.is_contiguous = function( _c, _d, _order )
{
    /*  If a/b and c/d belongs to order n of the farey's tree, then
        theorem
        | p    p+c |      1        1
        | -  - --- | = ------ <= -----
        | q    q+d |   q(q+d)    q(n+1)

        where n is the order level of the farey's tree
    */

    _tree_order = Math.max( 1, safe_int( _tree_order, 0 ) );
    var _row = this.init_seq( _tree_order ) ;
    if ( _row.includes( this.output() ) && _row.includes( _c + "/" + _d ) )
    {
        _c = safe_int( _c, 0 ), _d = safe_int( _d, 0 );
        return ( 1.0/(this.q*( this.q+_d)) <= 1.0/( this.q*(_tree_order+1)) ) ? 1 : 0 ;
    }
    else return 0 ;
}

farey.prototype.ratio = function() { return ( !isNaN( this.p ) && !isNaN( this.q ) && this.q != 0 ) ? this.p / this.q : "error" ; }
farey.prototype.distance = function( _f2 ) { return Math.abs( this.ratio() - _f2.ratio() ) ; }
farey.prototype.clone = function()       { return new farey( this.p, this.q ) ; }
farey.prototype.copy = function( _f2 )   { if ( is_farey( _f2 ) ) { this.p = _f2.p, this.q = _f2.q ; return false ; } else { return true ; } }
farey.prototype.set = function( _p, _q ) { this.p = safe_int( _p, 0 ), this.q = safe_int( _q, 0 ) ; }
farey.prototype.sum = function( _f2 )    { return new farey( this.p + _f2.p, this.q + _f2.q ) ; }
farey.prototype.median = function( _f2 ) { return this.sum( _f2 ) ; } // alias of sum
farey.prototype.sub = function( _f2 )   { return new farey( this.p - _f2.p, this.q - _f2.q ) ; }
farey.prototype.get_num = function() { return this.p ; }
farey.prototype.get_den = function() { return this.q ; }
farey.prototype.set_num = function( _p ) { this.p = safe_int( _p, 0 ) ; }
farey.prototype.set_den = function( _q )  { this.q = safe_int( _q, 0 ) ; }
farey.prototype.get_absolute = function() { return new farey( Math.abs( this.p ), Math.abs( this.q ) ) ; }

farey.prototype.get_fraction_from_decimal = function( _dec, _self )
{
    _self = safe_int( _self, 0 );
		var _dec_str = _dec + "", _exponent = _dec_str.indexOf( "." ) != -1 ? ( ( _dec_str.split( "." ) )[1] ).length : 0 ;
    if ( _self )
    {
    		this.p = _dec * Math.pow( 10, _exponent + 1 ) ;
    		this.q = 10 * Math.pow( 10, _exponent ) ;
    }
    else return new farey( _dec * Math.pow( 10, _exponent + 1 ), 10 * Math.pow( 10, _exponent ) );
}

// greatest common divisor
farey.prototype.gcd = function() { return this.gcd_params( this.q, this.p % this.q ); }
farey.prototype.gcd_params = function(a, b) // greatest common divisor
{
    if ( !b ) return a ;
    else if ( b == 0 ) return 0 ;
    return this.gcd_params(b, a % b);
}

// least common multiplier
farey.prototype.lcm_params = function( a, b ) { return a * b / this.gcd_params( a, b ) ; }
farey.prototype.lcm = function() { return this.lcm_params( this.p, this.q ); }

farey.prototype.self_reduce = function()
{
    var _gcd = Math.abs( this.gcd() ) ;
    this.p = _gcd != 0 ? this.p / _gcd : Infinity ;
    this.q = _gcd != 0 ? this.q / _gcd : Infinity ;
}

farey.prototype.reduce = function()
{
    var _gcd = this.gcd() ;
    return _gcd == 0 ? new farey( Infinity, Infinity ) : new farey( this.p / _gcd, this.q / _gcd ) ;
}

farey.prototype.std_sum = function( _f2 )
{
		if ( is_number( _f2 ) ) _f2 = new farey( _f2 ) ;
		return is_farey( _f2 ) ? new farey( this.p * _f2.q + this.q * _f2.p, this.q * _f2.q ).reduce() : null ;
}

farey.prototype.std_sub = function( _f2 )
{
		if ( is_number( _f2 ) ) _f2 = new farey( _f2 ) ;
		return is_farey( _f2 ) ? new farey( this.p * _f2.q - this.q * _f2.p, this.q * _f2.q ).reduce() : null ;
}

farey.prototype.std_mul = function( _f2 )
{
		if ( is_number( _f2 ) ) _f2 = new farey( _f2 ) ;
		return is_farey( _f2 ) ? new farey( this.p * _f2.p, this.q * _f2.q ).reduce() : null ;
}

farey.prototype.std_div = function( _f2 )
{
		if ( is_number( _f2 ) ) _f2 = new farey( _f2 ) ;
		return is_farey( _f2 ) ? new farey( this.p * _f2.q, this.q * _f2.p ).reduce() : null ;
}

farey.prototype.farey_sequence = function( _max_sequence_order, _start_frac, _end_frac, _callback_fn )
{
    var _start_farey = _start_frac != null ? new farey( _start_frac ) : [ 0, 1 ] ;
    var _end_farey = _end_frac != null ? new farey( _end_frac ) : [ 1, 1 ] ;
    var _record_start_ratio = _start_farey.ratio(), _record_end_ratio = _end_farey.ratio() ;
    if ( _record_start_ratio >= _record_end_ratio ) return [] ;
    var _positive_start = _record_start_ratio >= 0 ? 1 : 0 ;
    var _positive_end = _record_end_ratio >= 0 ? 1 : 0 ;
    var _abs_start_farey = _start_farey.get_absolute() ;
    var _abs_end_farey = _end_farey.get_absolute() ;
		_max_sequence_order = safe_int( _max_sequence_order, 1 ) ;
    var _farey = [] ;

    if ( _positive_start && _positive_end )
    		 _farey = this.farey_seq_sub( _max_sequence_order, _end_farey ) ;
    else if ( !_positive_start && _positive_end )
    {
   		 var _neg_farey = this.farey_seq_sub( _max_sequence_order, _abs_start_farey.get_absolute() ) ;
       var _tmp = _glob_array_recursive_run ;
       _glob_array_recursive_run = 0 ;
       var _neg_filtered_farey = _neg_farey.work( function( _frac ) { return [ -_frac[0], _frac[1] ] } ).reverse().filtering( function( _f ) { var _quot = _f[0] / _f[1] ; return ( _quot != 0 ) ; } ) ;
       _glob_array_recursive_run = _tmp ;
   		 var _pos_farey = this.farey_seq_sub( _max_sequence_order, _abs_end_farey.get_absolute() ) ;
       _farey = _neg_filtered_farey.concat( _pos_farey );
    }
    else if ( !_positive_start && !_positive_end )
    {
   		 _farey = this.farey_seq_sub( _max_sequence_order, _abs_start_farey.get_absolute() ) ;
       var _tmp = _glob_array_recursive_run ;
       _glob_array_recursive_run = 0 ;
       _farey = _farey.work( function( _frac ) { return [ -_frac[0], _frac[1] ] } ).reverse() ;
       _glob_array_recursive_run = _tmp ;
    }

    var _tmp = _glob_array_recursive_run ;
    _glob_array_recursive_run = 0 ;
    // filters and finally reset index from 0 to n
    var _filtered_farey = _farey.filtering( function( _f ) { var _quot = _f[0] / _f[1] ; return ( _quot >= _record_start_ratio && _quot <= _record_end_ratio ) ; } ).reset_index() ;
    _glob_array_recursive_run = _tmp ;
		return _filtered_farey ;
}

farey.prototype.farey_seq_sub = function( _order, _end_farey )
{
		var _farey = [ [ 0, 1 ] , [ 1, _order ] ] ;
		var _p, _q, _p1, _q1, _p2 = 0, _q2 = 0, _runner = 2, _k ;
		while( true )
		{
			 _p1 = _farey[ _runner - 1 ][0], _q1 = _farey[ _runner - 1 ][1] ;
			 _p = _farey[ _runner - 2 ][0], _q = _farey[ _runner - 2 ][1] ;
			 _k = Math.floor( ( _order + _q ) / _q1 ) ;
			 _p2 = _k * _p1 - _p, _q2 = _k * _q1 - _q ;
			 _farey.push( [ _p2, _q2 ] ) ;
			 _runner++ ;

       if ( typeof _callback_fn === "function" && _runner % 20 == 0 )
       _callback_fn.call( this, [ _p2, _q2 ], _p2 / _q2, _upper_bound_int ) ;

			 if ( ( _p2 / _q2 ) >= _end_farey.ratio() ) break ;
		}

    return _farey.clone();
}

farey.prototype.path = function( _farey_input, _approx, _max_steps )
{
		var _default_approx = Math.pow( 10, -8 ) ;
		_approx = safe_float( Math.abs( _approx ), _default_approx );
		if ( _approx == 0 || _approx >= 1 ) _approx = _default_approx ;
		var _find_what = is_farey( _farey_input ) ? _farey_input : new farey( _farey_input ) ;
		if ( _find_what == null ) return null ;
		else
		{
			 var _ratio = _find_what.ratio(), _left_bound = null, _right_bound = null, _median = null ;
			 var _path = [] ;
			 if ( _ratio >= 0 && _ratio <= 1 )
			 {
		 		  _left_bound = new farey( 0, 1 ), _right_bound = new farey( 1, 1 ) ;
			 }
			 else if ( _ratio > 1 )
			 {
		 		  _left_bound = new farey( 1, 1 ), _right_bound = new farey( 1, 0 ) ;
			 }

			 if ( _left_bound != null && _right_bound != null )
			 {
					  var _cnt = 0 ;
            _median = _left_bound.median( _right_bound );
					  _path.push( [ "start", _median, _left_bound, _right_bound ] );
					  while( true )
					  {
								_median = _left_bound.median( _right_bound );
								if ( _find_what.is_lesser_eq( _median ) ) // left turn
								{
									 _right_bound = _median ;
									 _path.push( [ "left", _median, _left_bound, _right_bound ] );
								}
								else // right turn
								{
									 _left_bound = _median ;
									 _path.push( [ "right", _median, _left_bound, _right_bound ] );
								}

								if ( _find_what.distance( _median ) <= _approx ) break ;
								_cnt++ ;
						}

						return _path ;
			 }
			 else return null ;
		}
}

// read the next term from the input sequence whose order equals the denominator of the farey obj
farey.prototype.next_term_params = function( _pq, _sequence_order, _input_seq, _curr_index )
{
    _curr_index = safe_int( _curr_index, -1 );
    _sequence_order = safe_int( _sequence_order, -1 );
    var _den = _sequence_order >= 1 ? _sequence_order : ( is_farey( _pq ) ? _pq.q : -1 ) ;
        _den = safe_int( _den, -1 );
    if ( !is_farey( _pq ) ) return [ -1, null ] ;
    else if ( _den < 1 || _sequence_order < _pq.q ) return [ -1, null ] ;
    if ( !is_array( _input_seq ) ) _input_seq = this.farey_sequence( _den );
    if ( is_array( _input_seq ) )
    {
       var _index = _curr_index != -1 ? _curr_index : _input_seq.indexOf( [ _pq.p, _pq.q ] ), _ret_farey ;
       if ( _index == -1 ) // try searching the next term through ratio computation
       {
						for( var _i = 0 ; _i < _input_seq.length ; _i++ )
						{
							 if (  _input_seq[_i][0] / _input_seq[_i][1] > _pq.ratio() )
							 {
					 			 _index = _i ;
								 break ;
							 }
						}
			 }
			 else if ( _input_seq[_index+1] != null ) return [_index+1, new farey(_input_seq[_index+1][0],_input_seq[_index+1][1])] ;

       if ( _index == -1 ) return [ -1, null ] ;
       _index++ ;
       _ret_farey = _input_seq[ _index ] != null ? new farey( _input_seq[ _index ][0], _input_seq[ _index ][1] ) : null ;
       return [ _index, _ret_farey ] ;
    }
    else return [ -1, null ] ;
}

// read the previous term from the input sequence whose order equals the denominator of the farey obj
farey.prototype.prev_term_params = function( _pq, _sequence_order, _input_seq )
{
    _sequence_order = safe_int( _sequence_order, -1 );
    var _den = _sequence_order >= 1 ? _sequence_order : ( is_farey( _pq ) ? _pq.q : -1 ) ;
    _den = safe_int( _den, -1 );
    if ( !is_farey( _pq ) ) return null ;
    else if ( _den < 1 || _sequence_order < _pq.q ) return null ;
    if ( !is_array( _input_seq ) ) _input_seq = this.farey_sequence( _den );
    if ( is_array( _input_seq ) )
    {
       var _index = _input_seq.indexOf( [ _pq.p, _pq.q ] ), _ret_farey ;
       if ( _index == -1 ) // try searching the next term through ratio computation
       {
		 			for( var _i = 0 ; _i < _input_seq.length ; _i++ )
		 			{
						 if (  _input_seq[_i][0] / _input_seq[_i][1] > _pq.ratio() )
						 {
					 			 _index = _i ;
								 break ;
						 }
					}
			 }
			 else if ( _input_seq[_index-1] != null ) return [_index-1, new farey(_input_seq[_index+1][0],_input_seq[_index+1][1])] ;

       if ( _index == -1 ) return [ -1, null ] ;
       _index-- ;
       _ret_farey = _input_seq[ _index ] != null ? new farey( _input_seq[ _index ][0], _input_seq[ _index ][1] ) : null ;
       return [ _index, _ret_farey ] ;
    }
    else return null ;
}

// continuous fractions support
farey.prototype.convergents = function()
{
    var _p = this.p, _q = this.q, _quot, _remainder, _convergents = [] ;
    while( 1 )
    {
        _quot = Math.floor( _p / _q ), _remainder = _p % _q ;
        _convergents.push( _quot ) ;
        if ( _remainder == 0 ) break ;
        _p = _q, _q = _remainder ;
    }

    return _convergents ;
}

farey.prototype.continued_frac_html = function( _color )
{
    _color = safe_string( _color, "black" ) ;
		var _convergents = this.convergents().reverse() ;
		if ( _convergents.length > 0 )
		{
				var FRAC_CONTAINER_TEMPLATE = "<table BORDER=\"0\" STYLE=\"font-size:7pt;font-family:arial;\">" ;
					  FRAC_CONTAINER_TEMPLATE += "<tr><td VALIGN=\"bottom\" ALIGN=\"center\">%num%</td></tr>" ;
						FRAC_CONTAINER_TEMPLATE += "<tr><td><hr noshade HEIGHT=\"1\"></td></tr>" ;
						FRAC_CONTAINER_TEMPLATE += "<tr><td VALIGN=\"middle\"\">%den%</td></tr>" ;
						FRAC_CONTAINER_TEMPLATE += "</table>" ;
				var _out = FRAC_CONTAINER_TEMPLATE, _conv, _tmp ;

				for( var _k = 0 ; _k < _convergents.length ; _k++ )
				{
						_conv = _convergents[_k] ;
						if ( _k == 0 ) _out = _out.replaceAll( "%num%", "1" ).replaceAll( "%den%", "<SPAN STYLE=\"color:"+_color+";\">"+_conv+"</SPAN>" );
						else
						{
			         _tmp = FRAC_CONTAINER_TEMPLATE ;
			         _tmp = _tmp.replaceAll( "%num%", 1 );
				       _tmp = _tmp.replaceAll( "%den%", "<table STYLE=\"font-size:7pt;font-family:arial;\"><tr><td VALIGN=\"top\" STYLE=\"padding-top:11pt;padding-left:5px;padding-right:5px;\"><SPAN STYLE=\"color:"+_color+";\">"+_conv+"</SPAN></td><td VALIGN=\"top\" STYLE=\"padding-top:11pt;padding-left:5px;padding-right:5px;\">+</td><td VALIGN=\"top\">"+_out+"</td></tr></table>" );
				       _out = _tmp ;
						}
				}

				return _out ;
		}
		else return "" ;
}


farey.prototype.remainders = function()
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

farey.prototype.extended_euclid = function()
{
    var _convergents = this.convergents(), _remainders = this.remainders();
    var _s_array = [ 1, 0 ], _t_array = [ 0, 1 ], _i ;
    for( _i = 1 ; _i <= _convergents.length ; _i++ )
    {
       _s_array.push( _s_array[_i-1] - _convergents[_i-1] * _s_array[_i] ) ;
       _t_array.push( _t_array[_i-1] - _convergents[_i-1] * _t_array[_i] ) ;
    }
}

// computes the natural next term, that is,
// it yields the term following a/b in the farey sequence of order b
farey.prototype.natural_next_term = function( a, b )
{
    if ( a == Math.floor( a ) && b == Math.floor( b ) ) // check they're all integers
    {
        if ( a == 0 && b == 0 ) return new farey( 0, 0 ) ;
        else if ( a == 1 && b == 1 ) return new farey( -1, 0 ) ;
        else if ( a == 0 && b == 1 ) return new farey( 1, 1 ) ;
        else if ( a == -1 && b == 0 ) return new farey( 0, 1 ) ;
        var c = 0, d = b - 1 ;
        while( d > 0 )
        {
           if ( ( a * d + 1 ) % b == 0 ) return new farey( ( a * d + 1 ) / b, d ) ;
           d-- ;
        }
    }
    else return new farey( 0, 0 ) ;
}

// computes the natural next term, that is,
// it yields the term preceeding a/b in the farey sequence of order b
farey.prototype.natural_prev_term = function( a, b )
{
    if ( a == Math.floor( a ) && b == Math.floor( b ) ) // check they're all integers
    {
        if ( a == 0 && b == 0 ) return new farey( 0, 0 ) ;
        else if ( a == 1 && b == 1 ) return new farey( 0, 1 ) ;
        else if ( a == 0 && b == 1 ) return new farey( -1, 0 ) ;
        else if ( a == -1 && b == 0 ) return new farey( 1, 1 ) ;
        var c = 0, d = 0 ;
        while( d <= b - 1 )
        {
           if ( ( a * d - 1 ) % b == 0 ) return new farey( ( a * d - 1 ) / b, d ) ;
           d++ ;
        }
    }
    else return new farey( 0, 0 ) ;
}

// EXTERNAL FUNCTIONS
function _ext_farey_sum( _a, _b, _c, _d ) { return [ _a + _c, _b + _d ] ; }
function _ext_farey_return( _pq_array )		{ return new farey( _pq_array[0], _pq_array[1] ) ; }