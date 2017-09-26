/*
    JS Complex Matrix class Library is free software: you can redistribute it and/or modify
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

var _CM_UNDEF = "undefined" ;
var _CM_NO_FILL = 0 ;
var _CM_FILL = 1 ;

if ( typeof is_array != "function" ) function is_array( _obj ) { return _obj instanceof Array ? 1 : 0 ; }
if ( typeof is_complex != "function" ) function is_complex( _obj ) { return _obj instanceof complex ? 1 : 0 ; }
if ( typeof is_integer != "function" ) function is_integer( _obj ) { return is_number( _obj ) ? ( Math.floor( _obj ) == _obj ? 1 : 0 ) : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj ) { return ( _obj instanceof Number || typeof _obj == "number" ) ? 1 : 0 ; }
if ( typeof is_rational != "function" ) function is_rational( _obj ) { return is_number( _obj ) ? !is_integer( _obj ) : 0 ; }
if ( typeof is_string != "function" ) function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; }

if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

if ( typeof safe_size != "function" )
{
		function safe_size( _obj, _ret_val )
		{
		   if ( _ret_val == "undefined" || _ret_val == null ) _ret_val = 0 ;
		   if ( _obj == null || _obj == "undefined" ) return _ret_val ;
		   else if ( typeof _obj == "string" || _obj instanceof String || is_array( _obj ) || _obj instanceof Object ) return _obj.length ;
		   else return _ret_val ;
		}
}

if ( typeof is_number != "function" ) function is_number( _obj )  { return ( typeof _obj == "number" || _obj instanceof Number ) ; }
if ( typeof is_complex != "function" ) function is_complex( _obj ){ return ( _obj instanceof complex ) ; }
if ( typeof is_string != "function" ) function is_string( _obj )  { return ( typeof _obj == "string" || _obj instanceof String ) ; }
if ( typeof is_complex_matrix != "function" ) function is_complex_matrix( _obj ) { return _obj instanceof complex_matrix ? 1 : 0 ; }

// COMPLEX NUMBERS MATRIX

function complex_matrix()
{
		this.customclass = arguments.callee.name ;
		// #01. new complex_matrix( [ 1, 2, 3, 4 ] );    --> a square matrix 2x2 is constructed
		// #02. new complex_matrix( [ 1, 2, 3, 4, 5 ] ); --> a square matrix 2x2 is constructed (truncated at 4)
		// #02. new complex_matrix( [ 1, 2, 3, 4, 5, 6 ], 2, 3 ); --> a matrix 2x3 is constructed
		// #03. new complex_matrix( [ 1, 2, 3, 4, 5 ], "exceed" ); --> a square matrix 3x3 is constructed: missing values are set to zero
		// #04. new complex_matrix( [ 1, 2, 3, 4, 5 ], "exceed", "1+i" ); --> a square matrix 3x3 is constructed: missing values are set to complex 1+i
		// #05. new complex_matrix( [ 1, 2, 3, 4, 5 ], "exceed", new complex( 1, 1 ) ); --> equivalent to previous example, but using a complex object
		// #06. new complex_matrix( 2, 2 ); --> a square matrix 2x2 is constructed and filled with 0
		// #07. new complex_matrix( 2, 2, _CM_NO_FILL ); --> a square grid 2x2 is set but the matrix is not initialized
		// #08. new complex_matrix( 4, 4, _CM_FILL, 1 ); --> a square matrix 4x4 is constructed and filled (argument indexed at 2 is 1) with 1
		// #09. new complex_matrix( 4, 4, _CM_FILL, new complex( 1, 1 ) ); --> a square matrix 4x4 is constructed and filled with complex obj equalling 1+i
		// #10. new complex_matrix( 4, 4, _CM_FILL, "2+2i" ); --> a square matrix 4x4 is constructed and filled with complex obj equalling 1+i
		// #11. new complex_matrix( 2, 2, _CM_FILL, [ 1, 2, 3, 4 ] ); --> a square matrix 2x2 is constructed and filled with this input array (1, 2, 3, 4)
		// #12. new complex_matrix( 2, 2, _CM_FILL, [ 1, new complex( 2, 1 ), "i", 1 ] ); --> a square matrix 2x2 is constructed and filled with complex entries

    this.grid = [];
    if ( is_array( arguments[0] ) )
    {
				this.grid = arguments[0].clone();
    		if ( is_number( arguments[1] ) && is_number( arguments[2] ) )
    		{
	 		      this.rows = safe_int( arguments[1], 0 ), this.cols = safe_int( arguments[2], 1 ) ;
				}
				else
				{
						// in this case we assume that the input matrix is a square matrix
						this.rows = Math.sqrt( this.grid.length );
						this.rows = ( is_string( arguments[1] ) && arguments[1] === "exceed" ) ? Math.ceil( this.rows ) : Math.floor( this.rows );
					  this.cols = this.rows ;
				}
    
			  this.grid = this.grid.trunc( this.rows * this.cols );
			  for( var _i = 0 ; _i < this.grid.length ; _i++ )
			  {
		 				if ( is_number( this.grid[_i] ) ) this.grid[_i] = new complex( this.grid[_i], 0 ) ;
		 				else if ( is_string(  this.grid[_i]  ) ) this.grid[_i] = parse_complex_from_string( this.grid[_i] );
				}
			  
        // at last, it must be a complex number
			  var _fill_val = arguments[1] === "exceed" ? arguments[2] : arguments[3] ;
        if ( is_string( _fill_val ) ) _fill_val = parse_complex_from_string( _fill_val );
				else if ( is_number( _fill_val ) ) _fill_val =  new complex( _fill_val, 0.0 ) ; 
				else if ( !is_complex( _fill_val ) ) _fill_val = new complex( 0, 0 ) ;

			  var _diff = Math.abs( this.cols * this.rows ) - this.grid.length ;
				this.grid = this.grid.append( _fill_val, _diff ) ;
		}
		else if ( is_number( arguments[0] ) && is_number( arguments[1] ) )
    {
		    this.rows = safe_int( arguments[0], 0 ), this.cols = safe_int( arguments[1], 0 ) ;
		    var _fill_bool = safe_int( arguments[2], 1 ), _fill_val = arguments[3] ;
		    var _size = this.size(), _default_value = new complex( 0, 0 ) ;
		    if ( is_array( _fill_val ) )
		    {
						this.grid = _fill_val.clone();
						var _diff = _size - this.grid.length ;
						if ( _diff < 0 ) this.grid = _fill_val.trunc( _size ) ;
						else if ( _diff > 0 ) for( var _d = 0 ; _d < _diff ; _d++ ) this.grid = this.grid.append( _default_value ) ;
					  for( var _i = 0 ; _i < this.grid.length ; _i++ )
					  {
				 				if ( is_number( this.grid[_i] ) ) this.grid[_i] = new complex( this.grid[_i], 0 ) ;
				 				else if ( is_string( this.grid[_i] ) ) this.grid[_i] = parse_complex_from_string( this.grid[_i] );
						}
				}
		    else if ( is_number( _fill_val ) || is_complex( _fill_val ) || is_string( _fill_val ) )
		    {
		        // at last, it must be a complex number
		        if ( is_string( _fill_val ) ) _default_value = parse_complex_from_string( _fill_val );
						else if ( is_number( _fill_val ) ) _default_value =  new complex( _fill_val, 0.0 ) ; 
						else if ( is_complex( _fill_val ) ) _default_value = _fill_val ;
						else _default_value = new complex( 0, 0 ) ;
		        if ( _fill_bool ) for( var _i = 0 ; _i < _size ; _i++ ) this.grid.push( _default_value ) ;
		    }
		    else if ( _fill_bool ) for( var _i = 0 ; _i < _size ; _i++ ) this.grid.push( _default_value ) ;
		}
		else
		{
				this.rows = this.cols = 0 ;
				this.grid = [] ;
		}

    this.err_log = [] ;
    this.stream_lines = [] ;
    this.parser_obj_ref = null ;
    this.parser_eval_fn_tag = null ;
}

complex_matrix.prototype.get_stream = function() { return this.stream_lines.clone() ; }
complex_matrix.prototype.get_log = function() { return this.err_log.clone() ; }
complex_matrix.prototype.copy = function() { var _cm = new complex_matrix( this.rows, this.cols ) ; _cm.grid = this.grid.clone() ; return _cm ; }
complex_matrix.prototype.size = function() { return safe_int( this.rows * this.cols, 0 ) ; }
complex_matrix.prototype.count_rows = function() { return safe_int( this.rows, 0 ) ; }
complex_matrix.prototype.count_cols = function() { return safe_int( this.cols, 0 ) ; }
complex_matrix.prototype.set_parser_refs = function( _parser_obj_ref, _parser_eval_fn_tag )
{
		this.parser_obj_ref = _parser_obj_ref ;
		this.parser_eval_fn_tag = _parser_eval_fn_tag ;
}

// -- START -- grid management
complex_matrix.prototype.insert_row = function( _i, _input_row, _overwrite )
{
    if ( !is_array( _input_row ) )
    {
        this.err_log.push( arguments.callee.caller + " : Input row must be of array type" );
        return null ;
    }
    else if ( _input_row.length == 0 )
    {
        this.err_log.push( arguments.callee.caller + " : Input row is empty" );
        return null ;
    }
    else if ( _input_row.length != this.cols )
    {
        this.err_log.push( arguments.callee.caller + " : Input row size does not match complex matrix dimensions" );
        return null ;
    }

    _i = Math.min( Math.max( 0, safe_int( _i, 0 ) ), this.rows );
    _overwrite = safe_int( _overwrite, 0 ) ;
    var _r, _row, _x, _cm = new complex_matrix( this.rows, this.cols ), _inserted = 0 ;
    _cm.grid.flush();
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        _row = this.get_row( _r );
        if ( _r == _i )
        {
            for( _x = 0 ; _x < _input_row.length ; _x++ ) _cm.grid.push( _input_row[_x] );
            _inserted = 1 ;
        }

        for( _x = 0 ; _x < _row.length ; _x++ ) _cm.grid.push( _row[_x] );
    }

    if ( _inserted ) _cm.rows += 1 ;
    if ( _overwrite )
    {
        this.grid = _cm.grid.clone();
        this.rows = _cm.rows ;
        this.cols = _cm.cols ;
    }
    else return _cm ;
}

complex_matrix.prototype.insert_col = function( _i, _input_col, _overwrite )
{
    _old_size = safe_int( this.grid.length, 0 ) ;
    if ( !is_array( _input_col ) )
    {
        this.err_log.push( arguments.callee.caller + " : Input column must be of array type" );
        return null ;
    }
    else if ( _input_col.length == 0 )
    {
        this.err_log.push( arguments.callee.caller + " : Input column is empty" );
        return null ;
    }
    else if ( _input_col.length != this.rows )
    {
        this.err_log.push( arguments.callee.caller + " : Input column size does not match complex matrix dimensions" );
        return null ;
    }

    _i = Math.min( Math.max( 0, safe_int( _i, 0 ) ), this.cols );
    _overwrite = safe_int( _overwrite, 0 ) ;
    var _r, _row, _x, _cm = new complex_matrix( this.rows, this.cols ), _inserted = 0 ;
    _cm.grid.flush();

    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        _row = this.get_row( _r );
        for( _x = 0 ; _x < _row.length ; _x++ )
        {
            if ( _x == _i ) _cm.grid.push( _input_col[_r] );
            _cm.grid.push( _row[_x] );
        }
    }
    
    _inserted = ( _old_size + _input_col.length == _cm.grid.length ) ? 1 : 0 ;

    if ( _inserted ) _cm.cols += 1 ;
    if ( _overwrite )
    {
        this.grid = _cm.grid.clone();
        this.rows = _cm.rows ;
        this.cols = _cm.cols ;
    }
    else return _cm ;
}

complex_matrix.prototype.delete_row = function()
{
    _overwrite = safe_int( arguments[0], 0 ) ;
    _old_size = safe_int( this.grid.length, 0 ) ;
    if ( _old_size == 0 )
    {
        this.err_log.push( arguments.callee.caller + " : this complex matrix is empty" );
        return null ;
    }
    
    var _a, _i, _r, _row, _x, _cm = new complex_matrix( this.rows, this.cols ), _deleted = 0 ;
    for( _a = 1 ; _a < arguments.length ; _a++ )
    {
        _i = Math.min( Math.max( 0, safe_int( arguments[_a], 0 ) ), this.rows );
        _overwrite = safe_int( _overwrite, 0 ) ;
        _cm.grid.flush();
        for( _r = 0 ; _r < this.rows ; _r++ )
        {
            _row = this.get_row( _r );
            if ( _r != _i ) for( _x = 0 ; _x < _row.length ; _x++ ) _cm.grid.push( _row[_x] );
            else _deleted = 1 ;
        }
    
        if ( _deleted ) _cm.rows -= 1 ;
    }

    if ( _overwrite )
    {
        this.grid = _cm.grid.clone();
        this.rows = _cm.rows, this.cols = _cm.cols ;
    }
    else return _cm ;
}

complex_matrix.prototype.delete_col = function( _i, _overwrite )
{
    _overwrite = safe_int( arguments[0], 0 ) ;
    _old_size = safe_int( this.grid.length, 0 ) ;
    if ( _old_size == 0 )
    {
        this.err_log.push( arguments.callee.caller + " : this complex matrix is empty" );
        return null ;
    }

    var _a, _i, _r, _row, _x, _cm = new complex_matrix( this.rows, this.cols ), _deleted = 0 ;
    for( _a = 1 ; _a < arguments.length ; _a++ )
    {
        _i = Math.min( Math.max( 0, safe_int( arguments[_a], 0 ) ), this.rows );
        _overwrite = safe_int( _overwrite, 0 ) ;
        _cm.grid.flush();
        for( _r = 0 ; _r < this.rows ; _r++ )
        {
           _row = this.get_row( _r );
           for( _x = 0 ; _x < _row.length ; _x++ ) if ( _x != _i ) _cm.grid.push( _row[_x] );
        }
        
        _deleted = ( _old_size - this.rows == _cm.grid.length ) ? 1 : 0 ;
        if ( _deleted ) _cm.cols -= 1 ;
    }

    if ( _overwrite )
    {
        this.grid = _cm.grid.clone();
        this.rows = _cm.rows, this.cols = _cm.cols ;
    }
    else return _cm ;
}

// -- START -- check operations --
complex_matrix.prototype.is_binary_matrix = function() { return this.is_boolean_matrix(); }
complex_matrix.prototype.is_singular_matrix = function() { return this.det().radius() == 0 ? 1 : 0 ; }
complex_matrix.prototype.is_logical_matrix = function() { return this.is_boolean_matrix() ; }
complex_matrix.prototype.is_consistent_matrix = function() { return ( ( this.rows + this.cols ) % 2 == 0 ) ; }
complex_matrix.prototype.is_row_matrix = function() { return ( this.rows == 1 && this.cols == 0 ) ? 1 : 0 ; }
complex_matrix.prototype.is_column_matrix = function()       { return ( this.rows == 0 && this.cols == 1 ) ? 1 : 0 ; }
complex_matrix.prototype.is_rectangular_matrix = function()  { return this.rows != this.cols ? 1 : 0 ; }
complex_matrix.prototype.is_square_matrix = function()       { return this.rows == this.cols ? 1 : 0 ; }
complex_matrix.prototype.is_symmetric_matrix = function()    { return this.is_equal_to( this.get_transpose_matrix() ) ? 1 : 0 ; }
complex_matrix.prototype.is_skewsymmetric_matrix = function() { return this.is_equal_to( this.get_transpose_matrix().get_negative_matrix() ) ? 1 : 0 ; }
complex_matrix.prototype.is_nilpotent_matrix_of_order = function( _k )  { return this.pow( _k ).is_equal_to( this.get_zero_matrix() ) ? 1 : 0 ; }
complex_matrix.prototype.is_periodic_matrix_of_order = function( _k ) { return this.is_equal_to( this.pow( _k ) ) ? 1 : 0 ; }
complex_matrix.prototype.is_idempotent_matrix = function()            { return this.is_periodic_matrix_of_order( 2 ) ? 1 : 0 ; }
complex_matrix.prototype.is_hermitian_matrix = function() { return this.is_equal_to( this.get_adjoint_matrix() ) ? 1 : 0 ; }
complex_matrix.prototype.is_antihermitian_matrix = function() { return this.get_negative_matrix().is_equal_to( this.get_adjoint_matrix() ) ? 1 : 0 ; }
complex_matrix.prototype.is_involutive_matrix = function()    { return this.pow( 2 ).is_equal_to( this.get_identity_matrix() ) ? 1 : 0 ; }
complex_matrix.prototype.is_orthogonal_matrix = function()    { return this.mul( this.get_transpose_matrix() ).is_equal_to( this.get_identity_matrix() ) ? 1 : 0 ; }
complex_matrix.prototype.is_normal_matrix = function() { return this.mul( this.get_transpose_matrix() ).is_equal_to( this.get_transpose_matrix().mul( this ) ) ? 1 : 0 ; }
complex_matrix.prototype.is_zero_matrix = function()
{
    var _b_ok = 1, _r ;
    for( _r = 0 ; _r < this.grid.length ; _r++ )
    {
        if ( this.grid[ _r ].radius() > 0 )
        {
           _b_ok = 0 ;
           break ;
        }
    }
    
    return _b_ok ;
}

complex_matrix.prototype.is_boolean_matrix = function()
{
    var _b_ok = 1, _unit = new complex( 1, 0 ), _zero = new complex( 0, 0 ), _r ;
    for( _r = 0 ; _r < this.grid.length ; _r++ )
    {
        if ( !this.grid[ _r ].is_equal_to( _unit ) && !this.grid[ _r ].is_equal_to( _zero ) )
        {
           _b_ok = 0 ;
           break ;
        }
    }
    
    return _b_ok ;
}

complex_matrix.prototype.is_identity_matrix = function()
{
    var _b_ok = 1, _item, _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = 0 ; _c < this.cols ; _c++ )
        {
           _item = this.grid[ _r * this.cols + _c ] ;
           if ( ( !_item.is_zero() && _r != _c ) || ( !_item.is_real_unit() && _r == _c ) )
           {
              _b_ok = 0 ;
              break ;
           }
        }
    }
    return _b_ok ;
}

complex_matrix.prototype.is_permutation_matrix = function()
{
    var _b_ok = 1, _row, _r, _count = 0, _runner, _unit = new complex( 1, 0 ), _zero = new complex( 0, 0 ) ;
    mainfor:
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        _row = this.get_row( _r ), _count = 0;
        for( _runner = 0 ; _runner < _row.length ; _runner++ )
        {
            if ( _row[ _runner ].is_equal_to( _unit ) ) _count++ ;
            else if ( !( _row[ _runner ].is_equal_to( _zero ) ) )
            {
               _b_ok = 0 ;
               break mainfor ;
            }
        }

        if ( _count != 1 )
        {
           _b_ok = 0 ;
           break mainfor ;
        }
    }
    return _b_ok ;
}

complex_matrix.prototype.is_diagonal_matrix = function()
{
    var _b_ok = 1, _item, _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = 0 ; _c < this.cols ; _c++ )
        {
           _item = this.grid[ _r * this.cols + _c ] ;
           if ( !_item.is_zero() && _r != _c )
           {
              _b_ok = 0 ;
              break ;
           }
        }
    }
    return _b_ok ;
}

complex_matrix.prototype.is_antidiagonal_matrix = function()
{
    var _b_ok = 1, _item, _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = 0 ; _c < this.cols ; _c++ )
        {
            _item = this.grid[ _r * this.cols + _c ] ;
            if ( !_item.is_zero() && _c != ( this.rows - _r - 1 ) )
            {
               _b_ok = 0 ;
               break ;
            }
        }
    }
    return _b_ok ;
}

complex_matrix.prototype.is_scalar_matrix = function()
{
    if ( !this.is_diagonal ) return 0 ;
    var _b_ok = 1, _item = null, _rec_item = null, _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = 0 ; _c < this.cols ; _c++ )
        {
           _item = this.grid[ _r * this.cols + _c ] ;
           if ( !_item.is_zero() && _r != _c )
           {
              _b_ok = 0 ;
              break ;
           }
           else if ( _r == _c )
           {
              if ( _rec_item == null ) _rec_item = _item ;
              else if ( !_item.is_equal_to( _rec_item ) )
              {
                 _b_ok = 0 ;
                 break ;
              }
           }
        }
    }
    return _b_ok ;
}

complex_matrix.prototype.is_equal_to = function( _cm )
{
    if ( !is_complex_matrix( _cm ) ) return 0 ;
    else if ( _cm.rows != this.rows || _cm.cols != this.cols ) return 0 ;
    else
    {
        var _b_ok = 1, _r, _c ;
        for( _r = 0 ; _r < this.rows ; _r++ )
        {
           for( _c = 0 ; _c < this.cols ; _c++ )
           {
              if ( !( _cm.grid[ _r * this.cols + _c ].is_equal_to( this.grid[ _r * this.cols + _c ] ) ) )
              {
                 _b_ok = 0 ;
                 break ;
              }
           }
        }
        
        return _b_ok ;
    }
}

complex_matrix.prototype.commute_with = function( _cm ) { return ( is_complex_matrix( _cm ) ) ? ( ( this.mul( _cm ).is_equal_to( _cm.mul( this ) ) ) ? 1 : 0 ) : 0 ; }
complex_matrix.prototype.anticommute_with = function( _cm ) { return ( is_complex_matrix( _cm ) ) ? ( ( this.mul( _cm ).is_equal_to( _cm.mul( this ).get_negative_matrix() ) ) ? 1 : 0 ) : 0 ; }

// -- END -- check operations --

complex_matrix.prototype.set_in = function( _input_val ) { for( var _i = 0 ; _i < arguments.length ; _i++ ) if ( is_complex_matrix( arguments[_i] ) ) this.grid.push( arguments[_i] ) ; }
complex_matrix.prototype.set_params = function()
{
    var _c = null, _a, _i ;
    this.grid.flush();
    if ( is_complex_matrix( arguments[0] ) )
    {
        this.grid = arguments[0].grid.clone();
        this.cols = arguments[0].cols, this.rows = arguments[0].rows ;
        return 1 ;
    }
    else if ( safe_size( arguments, 0 ) > 0 )
    {
        for( _a = 0 ; _a < arguments.length ; _a++ )
        {
           if ( is_array( arguments[_a] ) )
           {
              for( _i = 0 ; _i < arguments[_a].length ; _i++ )
              {
                 if ( is_string( arguments[_a][_i] ) ) arguments[_a][_i] = parse_complex_from_string( arguments[_a][_i] );
                 _c = is_number( arguments[_a][_i] ) ? new complex( safe_float( arguments[_a][_i], 0 ), 0 ) : ( is_complex( arguments[_a][_i] ) ? arguments[_a][_i] : null ) ;
                 if ( _c == null ) this.err_log.push( arguments.callee.caller + " : Invalid input " + arguments[_a] );
                 this.grid.push( _c == null ? new complex( 0, 0 ) : _c );
              }
           }
           else
           {
              _c = is_number( arguments[_a] ) ? new complex( arguments[_a], 0 ) : ( is_string( arguments[_a] ) ? parse_complex_from_string( arguments[_a] ) : null ) ;
              if ( _c == null ) this.err_log.push( arguments.callee.caller + " : Invalid input " + arguments[_a] );
              this.grid.push( _c == null ? new complex( 0, 0 ) : _c );
           }
        }
        
        return 1 ;
    }
    else return 0 ;
}

complex_matrix.prototype.set_formal_params = function()
{
    var _c = null, _a, _i ;
    if ( is_complex_matrix( arguments[0] ) )
    {
        this.grid.flush();
				this.grid = arguments[0].grid.clone();
        this.cols = arguments[0].cols, this.rows = arguments[0].rows ;
				return 1 ;
    }
    else if ( safe_size( arguments, 0 ) > 0 )
    {
				this.grid.flush();
				for( _a = 0 ; _a < arguments.length ; _a++ ) this.grid.push( arguments[_a] );
				return 1 ;
		}
		else return 0 ;
}

complex_matrix.prototype.resolve_parametrization = function( _params_tags, _params_complex_vals )
{
		if ( !is_array( _params_tags ) && !is_array( _params_complex_vals ) ) return null ;
		var _cm_copy = this.copy(), _grid_len = safe_size( _cm_copy.grid, 0 );
		var _i, _p ;
		// 1. it replaces the formal parameters with input values
		for( _i = 0 ; _i < _grid_len ; _i++ )
		{
				if ( is_string( _cm_copy.grid[_i] ) )
				{
 			 	   for( _p = 0 ; _p < _params_tags.length ; _p++ )
				  _cm_copy.grid[_i] = _cm_copy.grid[_i].replaceAll( _params_tags[_p], "("+_params_complex_vals[_p].formula()+")" ); 
				}
		}
		
		// 2. evaluates complex matrix elements
		if ( this.parser_obj_ref != null && this.parser_eval_fn_tag != null )
		{
		    var _parser = this.parser_obj_ref, _fn = this.parser_eval_fn_tag, _result ;
				for( _i = 0 ; _i < _grid_len ; _i++ )
				{
					 eval( "_result = _parser."+_fn+"( '"+_cm_copy.grid[_i]+"' );" ) ;
					 _cm_copy.grid[_i] = _result.re != null ? new complex( _result.re, _result.im ) : new complex( _result, 0 ) ;
				}

				return _cm_copy ;
		}
		else return null ;
}

complex_matrix.prototype.set_value_at = function( _x, _y, _val )
{
    if ( this.grid[ _y * this.rows + _x ] != null && is_complex( _val ) )
    {
        this.grid[ _y * this.rows + _x ] = _val ;
        return 1 ;
    }
    else
    {
        if ( !is_complex( _val ) ) this.err_log.push( arguments.callee.caller + " : Invalid input complex value" );
        else this.err_log.push( arguments.callee.caller + " : Invalid coords " + _x + ", " + _y );
        return 0 ;
    }
}

complex_matrix.prototype.work = function( fn )
{
    if ( typeof fn != "function" ) throw new TypeError();
    var _cm = new complex_matrix( this.cols, this.rows, 0 ), _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = 0 ; _c < this.cols ; _c++ ) _cm.grid.push( fn.call( null, _r, _c, this.grid[ _r * this.cols + _c ] ) );
    }

    return _cm ;
};

// START - arithmetics

complex_matrix.prototype.add = function( _add2 )
{
    if ( is_complex_matrix( _add2 ) )
    {
        var _add1 = this.copy(), _i;
        for( _i = 0 ; _i < _add1.grid.length ; _i++ ) _add1.grid[_i] = _add1.grid[_i].add( _add2.grid[_i] );
        return _add1 ;
    }
    else
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex matrix type" );
        return null ;
    }
}

complex_matrix.prototype.sub = function( _sub2 )
{
    if ( is_complex_matrix( _sub2 ) )
    {
        var _sub1 = this.copy(), _i ;
        for( _i = 0 ; _i < _sub1.grid.length ; _i++ ) _sub1.grid[_i] = _sub1.grid[_i].sub( _sub2.grid[_i] );
        return _sub1 ;
    }
    else
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex matrix type" );
        return null ;
    }
}

// MATRIX MULTIPLICATION

complex_matrix.prototype.mul = function( _m2 )
{
    if ( !is_complex_matrix( _m2 ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex matrix type" );
        return null ;
    }
    else if ( this.rows != _m2.cols || this.cols != _m2.rows )
    {
        this.err_log.push( arguments.callee.caller + " : input matrix dimensions are not congruent to caller matrix size" );
        return null ;
    }

    var _ret_matrix = new complex_matrix( this.rows, this.cols );
    var _row, _col, _ret_complex = new complex( 0, 0 ), _r, _c, _runner ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
       _row = this.get_row( _r );
       for( _c = 0 ; _c < _m2.cols ; _c++ )
       {
          _col = _m2.get_col( _c );
          _ret_complex.real = 0, _ret_complex.imag = 0 ;
          for( _runner = 0 ; _runner < _row.length ; _runner++ ) _ret_complex = _ret_complex.add( _row[ _runner ].mul( _col[ _runner ] ) );
          _ret_matrix.set_value_at( _c, _r, _ret_complex.copy() );
       }
    }

    return _ret_matrix ;
}

complex_matrix.prototype.mul_formal = function( _m2 )
{
    if ( ! is_complex_matrix( _m2 ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex matrix type" );
        return null ;
    }
    else if ( this.rows != _m2.cols || this.cols != _m2.rows )
    {
        this.err_log.push( arguments.callee.caller + " : input matrix dimensions are not congruent to caller matrix size" );
        return null ;
    }

    var _ret_matrix = new complex_matrix( this.rows, this.cols );
    var _row, _col, _ret_complex_array = [], _ret_1, _ret_2, _r, _c, _runner ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
       _row = this.get_row( _r );
       for( _c = 0 ; _c < _m2.cols ; _c++ )
       {
          _col = _m2.get_col( _c );
          _ret_complex_array = [] ;
          for( _runner = 0 ; _runner < _row.length ; _runner++ )
          {
             _ret_1 = "("+( is_complex( _row[ _runner ] ) ? _row[ _runner ].formula() : _row[ _runner ] )+")" ;
             _ret_2 = "("+( is_complex( _col[ _runner ] ) ? _col[ _runner ].formula() : _col[ _runner ] )+")" ;
             _ret_complex_array.push(  _ret_1 +"*"+ _ret_2 ) ;
          }

          _ret_matrix.set_value_at( _c, _r, _ret_complex_array.join("+") );
       }
    }

    return _ret_matrix ;
}

complex_matrix.prototype.hadamard_product = function( _m2 )
{
    if ( is_array( _m2 ) ) _m2 = new complex_matrix( this.rows, this.cols, _m2 ) ;
		if ( ! is_complex_matrix( _m2 ) ) return null ;
    else if ( this.size() == _m2.size() )
    {
       var _ret_matrix = new complex_matrix( this.rows, this.cols );
       for( var _runner = 0 ; _runner < this.size() ; _runner++ )
       _ret_matrix.grid[_runner] = this.grid[_runner].mul( _m2.grid[_runner] );
       return _ret_matrix ;
    }
    else return null ;
}

complex_matrix.prototype.dot_product = function( _m2 )
{
    if ( ! is_complex_matrix( _m2 ) ) return null ;
    else if ( this.size() == _m2.size() )
    {
       var _ret = new complex( 0, 0 ) ;
       for( var _runner = 0 ; _runner < this.size() ; _runner++ )
       _ret = _ret.add( this.grid[_runner].mul( _m2[_runner] ) );
       return _ret ;
    }
    else return null ;
}

// END - arithmetics

complex_matrix.prototype.trace = function()
{
		if ( this.is_square_matrix() )
		{
	     var _tr = new complex( 0, 0 ), _y = 0, _i ;
		   for( _i = 0 ; _i < this.rows ; _i++, _y++ )
		   {
		      _pos = _i * this.cols + _y ;
		      _tr = _tr.add( this.grid[ _pos ] );
		   }
		   return _tr ;
		}
		else return null ;
}

complex_matrix.prototype.antitrace = function()
{
		if ( this.is_square_matrix() )
		{
		    var _tr = new complex( 0, 0 ), _y = this.count_cols()-1, _i ;
		    for( _i = 0 ; _i < this.rows ; _i++, _y-- )
		    {
		       _pos = _i * this.cols + _y ;
		       _tr = _tr.add( this.grid[ _pos ] );
		    }
		    return _tr ;
		}
		else return null ;
}

complex_matrix.prototype.det = function()
{
    // temporary code ... looking forward to implement a more performant algorithm
    //return ( this.rows == 2 && this.cols == 2 ) ? this.grid[0].mul( this.grid[3] ).sub( this.grid[1].mul( this.grid[2] ) ) : new complex( 0, 0 ) ;
    
    var _array_of_indexes = [];
    for( var _i = 0 ; _i < this.cols ; _i++ ) _array_of_indexes.push( _i );
    var _all_permutations = _array_of_indexes.permute(), _sign, _determinant = new complex( 0, 0 ), _row_product, _permutation ;
    var _p1, _p2, _row_pos ;

    for( _p1 = 0 ; _p1 < _all_permutations.length ; _p1++ )
    {
       _permutation = _all_permutations[_p1] ;
       _sign = _p1 % 2 == 0 ? 1 : -1 ;
       _row_product = new complex( 1, 0 ).mul( _sign ) ;
         
       for( _p2 = 0, _row = 0 ; _p2 < _permutation.length ; _p2++, _row++ )
       _row_product = _row_product.mul( this.grid[ _row * this.cols + _permutation[_p2] ] );         

       _determinant = _determinant.add( _row_product );
    }
    
    return _determinant ;
}

complex_matrix.prototype.normalize = function( _overwrite )
{
    _overwrite = safe_int( _overwrite, 0 );
    var _cm = this.copy(), _det = this.det() ;
    if ( _det.radius() == 0 ) return this ;
    for( var _i = 0 ; _i < _cm.grid.length ; _i++ ) _cm.grid[_i] = _cm.grid[_i].div( _det );
    
    if ( !_overwrite ) return _cm ;
    else
    {
        this.grid = _cm.grid.clone();
        return null ;
    }
}

// -- START -- elementary operations --
complex_matrix.prototype.get_item_at = function( _x, _y ) { _x = parseInt( _x ); _y = parseInt( _y ); return this.grid[ _y * this.rows + _x ] ; }
complex_matrix.prototype.get_row = function( _nth_row )
{
    if ( _nth_row < 0 || _nth_row > this.rows )
    {
       this.err_log.push( arguments.callee.caller + " : input row index is out of range" );
       return null ;
    }
    var _out = [], _i ;
    for( _i = 0 ; _i < this.cols ; _i++ ) _out.push( this.grid[ _nth_row * this.cols + _i ] );
    return _out ;
}

complex_matrix.prototype.get_col = function( _nth_col )
{
    if ( _nth_col < 0 || _nth_col > this.cols )
    {
       this.err_log.push( arguments.callee.caller + " : input columns index is out of range" );
       return null ;
    }
    var _out = [], _r ;
    for( _r = 0 ; _r < this.rows ; _r++ ) _out.push( this.grid[ _r * this.cols + _nth_col ] );
    return _out ;
}

complex_matrix.prototype.set_row = function( _i, _arr )
{
    if ( is_array( _arr ) )
    {
       if ( _i < 0 || _i > this.rows )
       {
          this.err_log.push( arguments.callee.caller + " : input row index is out of range" );
          return 0 ;
       }
       else if ( _arr.length == this.cols )
       {
          var _pos = _i * this.cols, _a ;
          for( _a = 0 ; _a < _arr.length ; _a++, _pos++ )
          {
             if ( is_complex( _arr[_a] ) ) this.grid[_pos] = _arr[_a] ;
             else
             {
                this.err_log.push( arguments.callee.caller + " : input item, with index "+_a+", is not of complex type" );
                return 0 ;
             }
          }
          return 1 ;
       }
       else
       {
          this.err_log.push( arguments.callee.caller + " : undetermined error" );
          return 0 ;
       }
    }
    else
    {
       this.err_log.push( arguments.callee.caller + " : input is not of array type" );
       return 0 ;
    }
}

complex_matrix.prototype.set_col = function( _i, _arr )
{
    if ( is_array( _arr ) )
    {
       if ( _i < 0 || _i > this.cols ) return 0 ;
       else if ( _arr.length == this.rows )
       {
          var _pos = _i, _a ;
          for( _a = 0 ; _a < _arr.length ; _a++ )
          {
             if ( is_complex( _arr[_a] ) ) this.grid[_pos+_a*this.rows] = _arr[_a] ;
             else
             {
                this.err_log.push( arguments.callee.caller + " : input item, with index "+_a+", is not of complex type" );
                return 0 ;
             }
          }
          return 1 ;
       }
       else
       {
          this.err_log.push( arguments.callee.caller + " : undetermined error" );
          return 0 ;
       }
    }
    else
    {
       this.err_log.push( arguments.callee.caller + " : input is not of array type" );
       return 0 ;
    }
}

complex_matrix.prototype.add_to_row = function( _row_index, _value, _overwrite )
{
		if ( is_array( _value ) )
		{
       if ( _value.length != this.cols )
       {
           this.err_log.push( arguments.callee.caller + " : incongruent row size" );
           return null ;
       }
 		}
    else if ( !is_complex( _value ) )
    {
       this.err_log.push( arguments.callee.caller + " : input is not of allowed type (complex or array of complexes)" );
       return null ;
    }
		
		_overwrite = safe_int( _overwrite, 1 );
		var _grid = [], _c ;
    for( _c = 0 ; _c < this.cols ; _c++ )
    {
    		if ( _overwrite )
		    this.grid[ _row_index * this.cols + _c ] = this.grid[ _row_index * this.cols + _c ].add( is_array( _value ) ? _value[_c] : _value );
		    else
		    _grid.push( this.grid[ _row_index * this.cols + _c ].add( is_array( _value ) ? _value[_c] : _value ) );
		}

    return _overwrite ? null : _grid.clone();
}

complex_matrix.prototype.sub_from_row = function( _row_index, _value, _overwrite )
{
		if ( is_array( _value ) )
		{
			  if ( _value.length != this.cols )
        {
           this.err_log.push( arguments.callee.caller + " : incongruent column size" );
           return null ;
        }
		}
    else if ( !is_complex( _value ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of allowed type (complex or array of complexes)" );
        return null ;
    }

		_overwrite = safe_int( _overwrite, 1 );
		var _grid = [], _c ;
    for( _c = 0 ; _c < this.cols ; _c++ )
    {
   		 if ( _overwrite ) this.grid[ _row_index * this.cols + _c ] = this.grid[ _row_index * this.cols + _c ].sub( is_array( _value ) ? _value[_c] : _value );
		   else _grid.push( this.grid[ _row_index * this.cols + _c ].sub( is_array( _value ) ? _value[_c] : _value ) );
		}
    
    return _overwrite ? null : _grid.clone();
}

complex_matrix.prototype.mul_row_by = function( _row_index, _value, _overwrite )
{
    if ( !is_complex( _value ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex type" );
        return null ;
    }

		_overwrite = safe_int( _overwrite, 1 );
		var _grid = [], _c ;
    for( _c = 0 ; _c < this.cols ; _c++ )
    {
    		if ( _overwrite ) this.grid[ _row_index * this.cols + _c ] = this.grid[ _row_index * this.cols + _c ].mul( _value );
		    else _grid.push( this.grid[ _row_index * this.cols + _c ].mul( _value ) );
		}
    
    return _overwrite ? null : _grid.clone();
}

complex_matrix.prototype.div_row_by = function( _row_index, _value, _overwrite )
{
    if ( !is_complex( _value ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex type" );
        return null ;
    }

		_overwrite = safe_int( _overwrite, 1 );
		var _grid = [], _c ;
    for( _c = 0 ; _c < this.cols ; _c++ )
    {
    		if ( _overwrite ) this.grid[ _row_index * this.cols + _c ] = this.grid[ _row_index * this.cols + _c ].div( _value );
		    else _grid.push( this.grid[ _row_index * this.cols + _c ].div( _value ) );
		}
    
    return _overwrite ? null : _grid.clone();
}

complex_matrix.prototype.add_to_col = function( _col_index, _value, _overwrite )
{
    if ( !is_complex( _value ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex type" );
        return null ;
    }

		_overwrite = safe_int( _overwrite, 1 );
		var _grid = [], _r ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
    		if ( _overwrite ) this.grid[ _r * this.cols + _col_index ] = this.grid[ _r * this.cols + _col_index ].add( is_array( _value ) ? _value[_c] : _value );
		    else _grid.push( this.grid[ _r * this.cols + _col_index ].add( is_array( _value ) ? _value[_c] : _value ) );
		}
    
    return _overwrite ? null : _grid.clone();
}

complex_matrix.prototype.sub_from_col = function( _col_index, _value, _overwrite )
{
    if ( !is_complex( _value ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex type" );
        return null ;
    }

		_overwrite = safe_int( _overwrite, 1 );
		var _grid = [], _r ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
    		if ( _overwrite ) this.grid[ _r * this.cols + _col_index ] = this.grid[ _r * this.cols + _col_index ].sub( is_array( _value ) ? _value[_c] : _value );
		    else _grid.push( this.grid[ _r * this.cols + _col_index ].sub( is_array( _value ) ? _value[_c] : _value ) );
		}
    
    return _overwrite ? null : _grid.clone();
}

complex_matrix.prototype.mul_col_by = function( _col_index, _value, _overwrite )
{
    if ( !is_complex( _value ) )
    {
       this.err_log.push( arguments.callee.caller + " : input is not of complex type" );
       return null ;
    }

		_overwrite = safe_int( _overwrite, 1 );
		var _grid = [], _r ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
    	 if ( _overwrite ) this.grid[ _r * this.cols + _col_index ] = this.grid[ _r * this.cols + _col_index ].mul( _value );
		   else _grid.push( this.grid[ _r * this.cols + _col_index ].mul( _value ) );
		}
    
    return _overwrite ? null : _grid.clone();
}

complex_matrix.prototype.div_col_by = function( _col_index, _value, _overwrite )
{
    if ( !is_complex( _value ) )
    {
       this.err_log.push( arguments.callee.caller + " : input is not of complex type" );
       return null ;
    }

		_overwrite = safe_int( _overwrite, 1 );
		var _grid = [], _r ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
   		 if ( _overwrite ) this.grid[ _r * this.cols + _col_index ] = this.grid[ _r * this.cols + _col_index ].div( _value );
	     else _grid.push( this.grid[ _r * this.cols + _col_index ].div( _value ) );
		}
    
    return _overwrite ? null : _grid.clone();
}

complex_matrix.prototype.add_scalar = function( _val, _overwrite )
{
    if ( !is_complex( _val ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex type" );
        return null ;
    }

    _overwrite = safe_int( _overwrite, 0 );
    if ( is_number( _val ) ) _val = new complex( _val, 0.0 );
    if ( _overwrite )
    {
        for( var _i = 0 ; _i < this.grid.length ; _i++ ) this.grid[_i] = this.grid[_i].add( _val );
        return 1 ;
    }
    else
    {
        var _cm = this.copy() ;
        for( var _i = 0 ; _i < _cm.grid.length ; _i++ ) _cm.grid[_i] = _cm.grid[_i].add( _val );
        return _cm ;
    }
}

complex_matrix.prototype.sub_scalar = function( _val, _overwrite )
{
    if ( !is_complex( _val ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex type" );
        return null ;
    }

    _overwrite = safe_int( _overwrite, 0 );
    if ( is_number( _val ) ) _val = new complex( _val, 0.0 );

    if ( _overwrite )
    {
        for( var _i = 0 ; _i < this.grid.length ; _i++ ) this.grid[_i] = this.grid[_i].sub( _val );
        return 1 ;
    }
    else
    {
        var _cm = this.copy() ;
        for( var _i = 0 ; _i < _cm.grid.length ; _i++ ) _cm.grid[_i] = _cm.grid[_i].sub( _val );
        return _cm ;
    }
}

complex_matrix.prototype.mul_scalar = function( _val, _overwrite )
{
    if ( !is_complex( _val ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex type" );
        return null ;
    }

    _overwrite = safe_int( _overwrite, 0 );
    if ( is_number( _val ) ) _val = new complex( _val, 0.0 );

    if ( _overwrite )
    {
        for( var _i = 0 ; _i < this.grid.length ; _i++ ) this.grid[_i] = this.grid[_i].mul( _val );
        return 1 ;
    }
    else
    {
        var _cm = this.copy() ;
        for( var _i = 0 ; _i < _cm.grid.length ; _i++ ) _cm.grid[_i] = _cm.grid[_i].mul( _val );
        return _cm ;
    }
}

complex_matrix.prototype.div_scalar = function( _val, _overwrite )
{
    if ( !is_complex( _val ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of complex type" );
        return null ;
    }

    _overwrite = safe_int( _overwrite, 0 );
    if ( is_number( _val ) ) _val = new complex( _val, 0.0 );

    if ( _overwrite )
    {
        for( var _i = 0 ; _i < this.grid.length ; _i++ ) this.grid[_i] = this.grid[_i].div( _val );
        return 1 ;
    }
    else
    {
        var _cm = this.copy() ;
        for( var _i = 0 ; _i < _cm.grid.length ; _i++ ) _cm.grid[_i] = _cm.grid[_i].div( _val );
        return _cm ;
    }
}

complex_matrix.prototype.swap_rows = function( _i1, _i2 )
{
    var _row1 = this.get_row( _i1 ), _row2 = this.get_row( _i2 );
    this.set_row( _i1, _row2 );
    this.set_row( _i2, _row1 );
}

complex_matrix.prototype.swap_cols = function( _i1, _i2 )
{
    var _col1 = this.get_col( _i1 ), _col2 = this.get_col( _i2 );
    this.set_col( _i1, _col2 );
    this.set_col( _i2, _col1 );
}
// -- END -- elementary operations --

// -- START -- extract special matrixes --
complex_matrix.prototype.get_uppertriangular_matrix = function()
{
    var _cm = new complex_matrix( this.rows, this.cols ), _runner = 0, _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = 0 ; _c < this.cols ; _c++ ) _cm.grid[ _r * this.cols + _c ] = _c >= _runner ? this.grid[ _r * this.cols + _c ] : new complex( 0, 0 ) ;
        _runner++ ;
    }
    return _cm ;
}

complex_matrix.prototype.get_lowertriangular_matrix = function()
{
    var _cm = new complex_matrix( this.rows, this.cols ), _runner = 1, _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = 0 ; _c < this.cols ; _c++ ) _cm.grid[ _r * this.cols + _c ] = _c < _runner ? this.grid[ _r * this.cols + _c ] : new complex( 0, 0 ) ;
        _runner++ ;
    }
    return _cm ;
}

complex_matrix.prototype.get_conjugate_matrix = function()
{
    var _cm = new complex_matrix( this.rows, this.cols ), _i ;
    for( _i = 0 ; _i < this.grid.length ; _i++ ) _cm.grid[ _i ] = this.grid[ _i ].conj();
    return _cm ;
}

complex_matrix.prototype.get_transpose_matrix = function()
{
    var _cm = new complex_matrix( this.cols, this.rows ), _i ;
    for( _i = 0 ; _i < this.rows ; _i++ ) _cm.set_col( _i, this.get_row( _i ) );
    return _cm ;
}

complex_matrix.prototype.get_adjoint_matrix = function() { return this.get_transpose_matrix().get_conjugate_matrix() ; }
complex_matrix.prototype.get_zero_matrix = function()
{
    var _cm = new complex_matrix( this.cols, this.rows ), _i ;
    for( _i = 0 ; _i < this.grid.length ; _i++ ) this.grid[ _i ] = new complex( 0, 0 ) ;
    return _cm ;
}

complex_matrix.prototype.get_negative_matrix = function()
{
    var _cm = new complex_matrix( this.cols, this.rows ), _i ;
    for( _i = 0 ; _i < this.grid.length ; _i++ ) _cm.grid[ _i ] = this.grid[ _i ].mul( -1 ) ;
    return _cm ;
}

complex_matrix.prototype.get_diagonal_matrix = function()
{
    if ( this.cols != this.rows )
    {
        this.err_log.push( arguments.callee.caller + " : this is not a square matrix" );
        return null ;
    }
    var _cm = new complex_matrix( this.cols, this.rows ), _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = 0 ; _c < this.cols ; _c++ )
        if ( _c == _r ) _cm.set_value_at( _r, _c, this.get_item_at( _r, _c ) ) ;
    }

    return _cm ;
}

complex_matrix.prototype.get_identity_matrix = function()
{
    if ( this.cols != this.rows )
    {
        this.err_log.push( arguments.callee.caller + " : this is not a square matrix" );
        return null ;
    }
    var _cm = new complex_matrix( this.cols, this.rows ), _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = 0 ; _c < this.cols ; _c++ ) if ( _c == _r ) _cm.set_value_at( _r, _c, new complex( 1, 0 ) ) ;
        else _cm.set_value_at( _r, _c, new complex( 0, 0 ) ) ;
    }

    return _cm ;
}

complex_matrix.prototype.get_unit_matrix = function()
{
    if ( this.cols != this.rows )
    {
        this.err_log.push( arguments.callee.caller + " : this is not a square matrix" );
        return null ;
    }
    var _cm = new complex_matrix( this.cols, this.rows ), _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = 0 ; _c < this.cols ; _c++ ) if ( _c == _r ) _cm.set_value_at( _r, _c, new complex( 1, 0 ) ) ;
    }

    return _cm ;
}

complex_matrix.prototype.inv = function( _print_process )
{
    if ( this.rows != this.cols ) return null ;
    
    _print_process = safe_int( _print_process, 0 );
    var _original = this.copy();
    var _cm1 = _original.join_right( _original.get_identity_matrix() );
    var _current_pivot_row, _pivot1, _row, _pivot2, _k, _tmp_row, _row_index1, _row_index2 ;

    this.stream_lines.flush();
    if ( _print_process )
    {
        this.stream_lines.push( "START" );
        this.stream_lines.push( _cm1.output( "htmlgrid" ) );
    }

    for( _row_index1 = 0 ; _row_index1 < _cm1.rows ; _row_index1++ )
    {
       _current_pivot_row = _cm1.get_row( _row_index1 );
       _pivot1 = _current_pivot_row[_row_index1] ;
       if ( _pivot1.radius() != 1 )
       {
           _cm1.div_row_by( _row_index1, _pivot1, 1 );
           _pivot1 = 1 ;
       }

       for( _row_index2 = 0 ; _row_index2 < _cm1.rows ; _row_index2++ )
       {
           if ( _row_index1 != _row_index2 )
           {
              _row = _cm1.get_row( _row_index2 );
              _pivot2 = _row[_row_index1] ;
              _k = _pivot2.div( _pivot1 ).opposite() ;
              _tmp_row = _cm1.mul_row_by( _row_index1, _k, 0 );
              _tmp_row = _cm1.add_to_row( _row_index2, _tmp_row, 1 );
           }
       }

       if ( _print_process )
       {
           this.stream_lines.push( "STEP " + _row_index1 );
           this.stream_lines.push( _cm1.output( "htmlgrid" ) );
       }
    }

    // invert sign, if required
    for( _row_index1 = 0 ; _row_index1 < _cm1.rows ; _row_index1++ )
    {
       _current_pivot_row = _cm1.get_row( _row_index1 );
       _pivot1 = _current_pivot_row[_row_index1] ;
       if ( _pivot1.is_equal_to( new complex( -1, 0 ) ) )
       _cm1.mul_row_by( _row_index1, _pivot1, 1 );
    }

    if ( _print_process )
    {
       this.stream_lines.push( "FINAL STEP" );
       this.stream_lines.push( _cm1.output( "htmlgrid" ) );
    }

    var _inverse = _cm1.sub_matrix( 0, _cm1.cols / 2, _cm1.rows, _cm1.cols / 2 ) ;

    if ( _print_process )
    {
       this.stream_lines.push( "INVERSE MATRIX" );
       this.stream_lines.push( _inverse.output( "htmlgrid" ) );
    }

    if ( _print_process )
    {
       this.stream_lines.push( "MULTIPLICATION TEST - ORIGINAL x INVERSE" );
       this.stream_lines.push( _original.mul( _inverse ).output( "htmlgrid" ) );
    }

    return _inverse ;
}

// -- END -- extract type of matrix --

complex_matrix.prototype.set_diagonal_matrix = function( _input_array )
{
    if ( this.cols != this.rows )
    {
        this.err_log.push( arguments.callee.caller + " : this is not a square matrix" );
        return null ;
    }
    else if ( !is_array( _input_array ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of array type" );
        return null ;
    }
    else if ( _input_array.length != this.rows )
    {
        this.err_log.push( arguments.callee.caller + " : input size is not congruent to rows number" );
        return null ;
    }

    var _cm = new complex_matrix( this.cols, this.rows ), _runner = 0, _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = 0 ; _c < this.cols ; _c++ )
        {
            if ( _c == _r )
            {
                _cm.set_value_at( _r, _c, _input_array[_runner] ) ;
                _runner++ ;
            }
            else _cm.set_value_at( _r, _c, new complex( 0, 0 ) ) ;
        }
    }

    return _cm ;
}

complex_matrix.prototype.set_antidiagonal_matrix = function( _input_array )
{
    if ( this.cols != this.rows )
    {
        this.err_log.push( arguments.callee.caller + " : this is not a square matrix" );
        return null ;
    }
    else if ( !is_array( _input_array ) )
    {
        this.err_log.push( arguments.callee.caller + " : input is not of array type" );
        return null ;
    }
    else if ( _input_array.length != this.rows )
    {
        this.err_log.push( arguments.callee.caller + " : input size is not congruent to rows number" );
        return null ;
    }

    var _cm = new complex_matrix( this.cols, this.rows ), _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = this.cols - 1 ; _c >= 0 ; _c-- ) _cm.set_value_at( _r, _c, _c == ( this.rows - _r - 1 )? _input_array[_runner] : new complex( 0, 0 ) ) ;
    }

    return _cm ;
}

complex_matrix.prototype.set_exchange_matrix = function()
{
    var _cm = new complex_matrix( this.cols, this.rows ), _r, _c ;
    for( _r = 0 ; _r < this.rows ; _r++ )
    {
        for( _c = this.cols - 1 ; _c >= 0 ; _c-- )
				_cm.set_value_at( _r, _c, _c == ( this.rows - _r - 1 ) ? new complex( 1, 0 ) : new complex( 0, 0 ) ) ;
    }

    return _cm ;
}

complex_matrix.prototype.pow = function( _exponent )
{
    _exponent = safe_int( _exponent, 1 ) ;
    if ( _exponent < 0 )
    {
        this.err_log.push( arguments.callee.caller + " : exponent must be > 0" );
        return null ;
    }
    else if ( _exponent == 0 ) this.get_identity_matrix() ;
    else
    {
        var _cm = this.copy(), _e ;
        for( _e = 0 ; _e < _exponent - 1 ; _e++ ) _cm = _cm.mul( _cm );
        return _cm ;
    }
}

complex_matrix.prototype.find_period = function( _max_period_test )
{
    _max_period_test = safe_int( _max_period_test, 0 ) ;
    if ( _max_period_test == 0 )
    {
       this.stream_lines.push( "missing max input period test" );
       return 0 ;
    }
    else
    {
       // period rule : A^(k+1) = A, where k > 0
       var _cm = this.copy(), _test_matrix = this.pow(2), _ret = 0, _p ;
       for( _p = 2 ; _p <= _max_period_test ; _p++ )
       {
           _cm = _cm.mul( _cm );
           if( _cm.is_equal_to( _test_matrix ) )
           {
              _ret = _p ;
              break ;
           }
       }

       return _ret ;
    }
}

// -- START -- output members --
complex_matrix.prototype.array = function() { return this.grid.clone() ; }
complex_matrix.prototype.output_row = function( _row_index, _format, _colbreak_cmd )
{
    _format = ( _format == null || _format == _CM_UNDEF || !is_string( _format ) ) ? "plain" : _format.toLowerCase() ;
    _row_index = safe_int( _row_index, 0 ) ;
    _colbreak_cmd = safe_string( _colbreak_cmd, "&nbsp;" );
    var _row = this.get_row( _row_index ), _i ;
    if ( _row != null )
    {
        var _str = "" ;
        switch( _format.toLowerCase() )
        {
           case "grid":
           case "plain":
           for( _i = 0 ; _i < _row.length ; _i++ ) _str += ( is_complex( _row[ _i ] ) ? _row[ _i ].formula() : _row[ _i ] ) + _colbreak_cmd ;
           break ;
           case "htmlgrid":
           _str = "<table><tr>" ;
           for( _i = 0 ; _i < _row.length ; _i++ )
           _str += "<td>" + ( is_complex( _row[ _i ] ) ? _row[ _i ].formula() : _row[ _i ] ) + "</td><td WIDTH=\"5\"></td>" ;
           _str += "</tr></table>" ;
           break ;
        }

        return _str ;
    }
    else return "error" ;
}

complex_matrix.prototype.output_col = function( _col_index, _format, _linebreak_cmd )
{
    _format = ( _format == null || _format == _CM_UNDEF || !is_string( _format ) ) ? "plain" : _format.toLowerCase() ;
    _col_index = safe_int( _col_index, 0 ) ;
    _linebreak_cmd = safe_string( _linebreak_cmd, "\n" ) ;
    var _col = this.get_col( _col_index ), _i ;
    if ( _col != null )
    {
        var _str = "" ;
        switch( _format.toLowerCase() )
        {
            case "plain":
            case "grid":
            for( _i = 0 ; _i < _col.length ; _i++ ) _str += ( is_complex( _col[ _i ] ) ? _col[ _i ].formula() : _col[ _i ] ) + _linebreak_cmd ;
            break ;
            case "htmlgrid":
            _str = "<table>" ;
            for( _i = 0 ; _i < _col.length ; _i++ ) _str += "<tr><td>" + ( is_complex( _col[ _i ] ) ? _col[ _i ].formula() : _col[ _i ] ) + "</td></tr>" ;
            _str += "</table>" ;
            break ;
        }

        return _str ;
    }
    else return "error" ;
}

complex_matrix.prototype.output = function( _format, _linebreak_cmd, _rowlabels_array )
{
    _format = ( _format == null || _format == _CM_UNDEF || !is_string( _format ) ) ? "plain" : _format.toLowerCase() ;
    if ( _rowlabels_array == null || _rowlabels_array == _CM_UNDEF ) _rowlabels_array = [] ;
    _linebreak_cmd = safe_string( _linebreak_cmd, "\n" ) ;
    var _str = "" ;
    switch( _format.toLowerCase() )
    {
        case "plain":
        for( var _i = 0 ; _i < this.grid.length ; _i++ )
        _str += ( _rowlabels_array[_i] != null ? _rowlabels_array[_i] + " : " : "" ) + ( is_complex( this.grid[ _i ] ) ? this.grid[ _i ].formula() : this.grid[ _i ] ) + _linebreak_cmd ;
        break ;
        case "grid":
        for( var _i = 0 ; _i < this.grid.length ; _i++ )
        {
            _str += ( _rowlabels_array[_i] != null ? _rowlabels_array[_i] + " : " : "" ) + ( is_complex( this.grid[ _i ] ) ? this.grid[ _i ].formula() : this.grid[ _i ] ) ;
            if ( _i % this.cols < ( this.cols - 1 ) ) _str += "&nbsp;&nbsp;" ;
            if ( _i % this.cols == ( this.cols - 1 ) ) _str += _linebreak_cmd ;
        }
        break ;
        case "htmlgrid":
        _str = "<table>" ;
        for( var _i = 0 ; _i < this.grid.length ; _i++ )
        {
            if ( _i % this.cols == 0 ) _str += "<tr>" ;
            _str += "<td>" + ( _rowlabels_array[_i] != null ? _rowlabels_array[_i] + " : " : "" ) + ( is_complex( this.grid[ _i ] ) ? this.grid[ _i ].formula() : this.grid[ _i ] ) + "</td>" ;
            if ( _i % this.cols < ( this.cols - 1 ) ) _str += "<td WIDTH=\"5\"></td>" ;
            if ( _i % this.cols == ( this.cols - 1 ) ) _str += "</tr>" ;
        }
        _str += "</table>" ;
        break ;
    }

    return _str ;
}

// -- END -- output members --

// -- START -- join members --
complex_matrix.prototype.join_right = function( _cm )
{
    if ( is_complex_matrix( _cm ) )
    {
        var _total_cols = this.cols + _cm.cols, _row_runner, _col_runner ;
        var _join = new complex_matrix( this.rows, _total_cols );
        _join.grid.flush();
        for( _row_runner = 0 ; _row_runner < this.rows ; _row_runner++ )
        {
            for( _col_runner = 0 ; _col_runner < _total_cols ; _col_runner++ )
            {
                if ( _col_runner < this.rows )
                _join.grid.push( this.grid[ _row_runner * this.cols + _col_runner ] );
                else if ( _col_runner < _total_cols )
                _join.grid.push( _cm.grid[ _row_runner * this.cols + ( _col_runner - _cm.cols ) ] );
            }
        }

        return _join ;
    }
    else
    {
        this.err_log.push( arguments.callee.caller + " : input is not a complex matrix" );
        return null ;
    }
}

complex_matrix.prototype.join_down = function( _cm )
{
    if ( is_complex_matrix( _cm ) )
    {
       var _total_rows = this.rows + _cm.rows, _row_runner, _col_runner ;
       var _join = new complex_matrix( _total_rows, this.cols );
       _join.grid.flush();
       for( _row_runner = 0 ; _row_runner < _total_rows ; _row_runner++ )
       {
           for( _col_runner = 0 ; _col_runner < this.cols ; _col_runner++ )
           {
               if ( _row_runner < this.rows )
               _join.grid.push( this.grid[ _row_runner * this.cols + _col_runner ] );
               else if ( _row_runner < _total_rows )
               _join.grid.push( _cm.grid[ ( _row_runner - this.rows ) * this.cols + _col_runner ] );
           }
       }

       return _join ;
    }
    else
    {
       this.err_log.push( arguments.callee.caller + " : input is not a complex matrix" );
       return null ;
    }
}

complex_matrix.prototype.join_downleft = function( _cm )
{
    if ( is_complex_matrix( _cm ) )
    {
        var _total_rows = this.rows + _cm.rows, _total_cols = this.cols + _cm.cols ;
        var _row_runner, _col_runner ;
        var _join = new complex_matrix( _total_rows, _total_cols );
        _join.grid.flush();

        for( _row_runner = 0 ; _row_runner < _total_rows ; _row_runner++ )
        {
            for( _col_runner = 0 ; _col_runner < _total_cols ; _col_runner++ )
            {
                if ( _row_runner < this.rows && _col_runner < this.cols )
                _join.grid.push( this.grid[ _row_runner * this.cols + _col_runner ] );
                else if ( ( _row_runner >= this.rows && _row_runner < _total_rows )
                          &&
                         ( _col_runner >= this.cols && _col_runner < _total_cols )
                        )
                _join.grid.push( _cm.grid[ ( _row_runner - _cm.rows ) * this.cols + ( _col_runner - _cm.cols ) ] );
                else _join.grid.push( new complex( 0, 0 ) );
            }
        }

        return _join ;
    }
    else
    {
        this.err_log.push( arguments.callee.caller + " : input is not a complex matrix" );
        return null ;
    }
}

complex_matrix.prototype.get_minor_matrix = function( _row_i, _col_j, _overwrite )
{
    _row_i = safe_int( _row_i, 0 ), _col_j = safe_int( _col_j, 0 );
    _overwrite = safe_int( _overwrite, 0 ) ;
    if ( _row_i < 0 || _row_i > this.rows || _col_j < 0 || _col_j > this.cols ) return null ;

    var _cm = this.copy() ;
    _cm = _cm.delete_row( _row_i ).delete_col( _col_j ) ;
    if ( _overwrite )
    {
        this.cols = _cm.cols, this.rows = _cm.rows, this.grid = _cm.grid.clone();
        return this ;
    }
    else return _cm ;
}

complex_matrix.prototype.get_minor = function( _row_i, _col_j )
{
    var _mm = this.get_minor_matrix( _row_i, _col_j );
    return _mm == null ? null : _mm.det();
}

complex_matrix.prototype.get_cofactor_matrix = function()
{
    var _r, _c, _minor, _det, _cm = new complex_matrix( this.rows, this.cols );
    _cm.grid.flush();
    for( _r = 0 ; _r < this.rows ; _r++ )
        for( _c = 0 ; _c < this.cols ; _c++ ) _cm.grid.push( this.get_minor( _r, _c ) );
    return _cm ;
}

complex_matrix.prototype.get_cofactor = function( _row_i, _col_j ) { return this.get_minor( _row_i, _col_j ).mul( new complex( -1, 0 ).pow( _row_i + _col_j ) ); }
complex_matrix.prototype.sub_matrix = function( _start_index_row, _start_index_col, _rows, _cols )
{
    _start_index_row = safe_int( _start_index_row, 0 ), _start_index_col = safe_int( _start_index_col, 0 );
    _rows = safe_int( _rows, 0 ), _cols = safe_int( _cols, 0 );
    var _r, _c, _cm = new complex_matrix( _rows, _cols, 0 ) ;
    var _row_index_end = _start_index_row + _rows - 1, _col_index_end = _start_index_col + _cols - 1 ;
    if ( _row_index_end > this.rows - 1 || _col_index_end > this.cols - 1 )
    {
        this.err_log.push( arguments.callee.caller + " : Invalid input values" );
        return null ;
    }
    for( _r = _start_index_row ; _r <= _row_index_end ; _r++ )
    {
        for( _c = _start_index_col ; _c <= _col_index_end ; _c++ ) _cm.grid.push( this.grid[ _r * this.cols + _c ] ) ;
    }
    return _cm ;
}

// -- END -- join members --

// -- START -- ALIASES

complex_matrix.prototype.inner_product = function( _m2 )       { return this.dot_product( _m2 ); }
complex_matrix.prototype.scalar_product = function( _m2 ) { return this.dot_product( _m2 ); }
complex_matrix.prototype.parallel_product = function( _m2 )    { return this.mul( _m2 ); }
complex_matrix.prototype.elementwise_product = function( _m2 ) { return this.hadamard_product( _m2 ); }
complex_matrix.prototype.entrywise_product = function( _m2 ) { return this.hadamard_product( _m2 ); }
complex_matrix.prototype.pointwise_product = function( _m2 ) { return this.hadamard_product( _m2 ); }
complex_matrix.prototype.schur_product = function( _m2 )       { return this.hadamard_product( _m2 ); }

// -- END -- ALIASES