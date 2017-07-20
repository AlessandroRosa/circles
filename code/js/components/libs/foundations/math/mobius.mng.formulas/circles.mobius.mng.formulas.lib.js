function circles_lib_mobius_mng_pull_from()
{
    var _out_str = "" ;
    if ( is_mobius_map( arguments[0] ) )
        _out_str = "(" + _mm.a.formula() + ")z+" + _mm.b.formula() + ")/(" + _mm.b.formula() + ")z+" + _mm.c.formula() + ")" ;
    else if ( safe_size( arguments[0], 0 ) == 4 )
    {
       var _a_str = arguments[0][0] ;
       var _a_val = parse_complex_from_string( circles_lib_math_parse_formula( _a_str ) );
       var _a_is_zero = _a_val.radius() == 0 ? YES : NO ;
       var _a_is_one = _a_val.is_real_unit() ? YES : NO ;

       var _b_str = arguments[0][1] ;
       var _b_val = parse_complex_from_string( circles_lib_math_parse_formula( _b_str ) );
       var _b_is_zero = _b_val.radius() == 0 ? YES : NO ;
       var _b_is_one = _b_val.is_real_unit() ? YES : NO ;

       var _c_str = arguments[0][2] ;
       var _c_val = parse_complex_from_string( circles_lib_math_parse_formula( _c_str ) );
       var _c_is_zero = _c_val.radius() == 0 ? YES : NO ;
       var _c_is_one = _c_val.is_real_unit() ? YES : NO ;

       var _d_str = arguments[0][3] ;
       var _d_val = parse_complex_from_string( circles_lib_math_parse_formula( _d_str ) );
       var _d_is_zero = _d_val.radius() == 0 ? YES : NO ;
       var _d_is_one = _d_val.is_real_unit() ? YES : NO ;

       var _num_consistent = ( !_a_is_zero || !_b_is_zero ) ? YES : NO ;
       var _den_consistent = ( !_c_is_zero != 0 || !_d_is_zero ) ? YES : NO ;
       var _num = _num_consistent ? ( !_a_is_zero ? _a_str + "z" : "" )+( !_b_is_zero ? "+"+_b_str : "" ) : "0" ;
       var _den = _den_consistent ? ( !_c_is_zero ? _c_str + "z" : "" )+( !_d_is_zero ? "+"+_d_str : "" ) : "0" ;
       _out_str = "(" + _num + ")/(" + _den + ")" ;
    }

    _out_str = _out_str.replaceAll( "1z", "z" );
    _out_str = _out_str.replaceAll( [ "(1)", "(+1)" ], "1" ).replaceAll( [ "(-1)" ], "-1" );
    _out_str = _out_str.replaceAll( [ "(i)", "(+i)" ], "i" ).replaceAll( [ "(-i)" ], "-i" );
    _out_str = _out_str.replaceAll( [ "/1" ], "" );
    _out_str = _out_str.replaceAll( "+-", "-" ).replaceAll( "-+", "-" ).replaceAll( "+-", "+" ).replaceAll( "--", "+" )

    return _out_str ;
}

function circles_lib_mobius_mng_find_slash_pos( _mobius_map_expr )
{
    /* it scans the input formula and returns the index position of
       the slash between numerator and denominator
    */
    var _hiders = [ /\s/g, /([\e])\^/gi, /\([^\)]+\)/gi, /([a-z]{1,})/gi, /[\-\+\*\(\)\{\}]/g, /([0-9]{1,})/g ] ;
    var _test = _mobius_map_expr, _match, _slash_pos, _i, _c ;
    for( _i = 0 ; _i < _hiders.length ; _i++ )
    {
       _match = _test.match( _hiders[_i] );
       if ( _match != null )
       for( _c = 0 ; _c < _match.length ; _c++ ) _test = _test.replaceAll( _match[_c], ( new String( "*" ) ).repeat( _match[_c].length ) );
    }
        
    _slash_pos = _test.indexOf( "/" );
    return _slash_pos ;
}

function circles_lib_mobius_mng_extract_params( _mobius_map_expr )
{
    // pre-check
    _mobius_map_expr = safe_string( _mobius_map_expr, "" );
    if ( safe_size( _mobius_map_expr, 0 ) == 0 ) return [] ;

    var _slash_pos = circles_lib_mobius_mng_find_slash_pos( _mobius_map_expr );
    var _is_frac = _slash_pos != UNFOUND ? YES : NO ;
    var _mobius_array = [] ;
    if ( _is_frac )
    {
       _mobius_array.push( _mobius_map_expr.substring( 0, _slash_pos ) );
       _mobius_array.push( _mobius_map_expr.substring( _slash_pos + 1, _mobius_map_expr.length ) );
    }
    else _mobius_array.push( _mobius_map_expr );
    var _num = _mobius_array[0].trim(), _den = _is_frac ? _mobius_array[1].trim() : "" ;

    if ( _num.length == 0 ) return [] ;
    else
    {
       // parse numerator
       var _num_params =  circles_lib_mobius_mng_parse( _num );
       // parse denominator
       var _den_params =  circles_lib_mobius_mng_parse( _den );
       if ( _num_params.length == 0 && _den_params.length == 0 ) return [];
       else if ( _num_params.length > 0 && _den_params.length == 0 ) return _num_params ;
       else return _num_params.concat( _den_params );
    }
}

function circles_lib_mobius_mng_parse( _token_str )
{
    if ( !circles_lib_mobius_mng_check_parentheses( _token_str ) ) return [] ;
    var _token_chunks, _z_count = _token_str.count( "z" ), _z_pow = _token_str.count( "z^" );
    if ( _z_pow > 0 ) return [] ; // exponent of 'z' must be 1 
    else if ( _z_count == 0 ) // simplest case: it's a constant
    {
        _token_chunks = [ "0", _token_str.length == 0 ? "1" : _token_str ] ;
    }
    else if ( _z_count == 1 && _token_str.length == 1 ) // it includes only 'z'
    {
        // []z[]
        _token_chunks = [ "1", "0" ] ;
    }
    else if ( _z_count == 1 ) // it does not includes only 'z'
    {
        if ( _token_str.left(1) == "(" && _token_str.right(1) == ")" ) // remove parentheses enclosing the whole token
        _token_str = _token_str.substr( 1, _token_str.length - 2 );
          
        if ( _token_str.right(1) == "z" )
        {
           var _open = 0, _close = 0, _separator_index = -1 ;
           for( var _i = _token_str.length - 1 ; _i >= 0 ; _i-- )
           {
               if ( _token_str[_i] == "(" ) _open++ ;
               else if ( _token_str[_i] == ")" ) _close++ ;
                 
               if ( _token_str[_i].is_one_of( "+", "-" ) && ( _open - _close == 0 ) )
               {
                  _separator_index = _i ;
                  break ;
           		 }
        	 }
               
        	 if ( _separator_index != -1 )
           {
              var _param01 = _separator_index <= 1 ? _token_str.left(1) : _token_str.substring( 0, _separator_index );
              if ( _param01.is_one_of( "+", "-" ) ) _param01 += "1" ;
              var _z_pos = _token_str.indexOf( "z" );
              var _param02 = _token_str.substring( _separator_index, _z_pos );
              if ( _param02.is_one_of( "+", "-" ) ) _param02 += "1" ;
              // according to standard input, params seq has been inverted: first d, then c follows
              if ( _param01.start_with( "+" ) ) _param01 = _param01.substr( 1, _param01.length );
              if ( _param02.start_with( "+" ) ) _param02 = _param02.substr( 1, _param02.length );
              _token_chunks = [ _param02, _param01 ] ;
           }
           else _token_chunks = [ _token_str.replaceAll( "z", "" ), "0" ] ;
        }
        else
        {
           var _token_chunks = _token_str.split( "z" );
           if ( _token_chunks[0].length == 0 ) _token_chunks[0] = "1" ;
           if ( _token_chunks[1].length == 0 ) _token_chunks[1] = "0" ;

           if ( _token_chunks[0].start_with( "+" ) ) _token_chunks[0] = _token_chunks[0].substr( 1, _token_chunks[0].length );
           if ( _token_chunks[1].start_with( "+" ) ) _token_chunks[1] = _token_chunks[1].substr( 1, _token_chunks[1].length );
        }
    }
    else if ( _z_count > 1 ) _token_chunks = [] ;
     
    $.each( _token_chunks,
            function( _i, _chunk )
            {
               // cleaning
               if ( _chunk.right(1).is_one_of( "*", "+", "-", "/" ) )
               _token_chunks[_i] = _chunk.substr( 0, _chunk.length - 1 );
            }
          );

    return _token_chunks ;
}

function circles_lib_mobius_mng_check_parentheses( _input_str )
{
     var _open = 0, _close = 0 ;
     _input_str = _input_str.replaceAll( ",", "." ).replaceAll( "[", "(" ).replaceAll( "]", ")" );
     for( var _i = 0 ; _i < _input_str.length ; _i++ )
     {
        if ( _input_str[_i] == "(" ) _open++ ;
        else if ( _input_str[_i] == ")" ) _close++ ;
     }
     
     return _open == _close ? 1 : 0 ;
}