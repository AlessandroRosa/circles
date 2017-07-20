function circles_lib_word_inverse_get( _w ) { return safe_string( _w, "" ).trim().flipCase().reverse(); }
function circles_lib_word_check( _input_word, _alphabet )
{
    if ( safe_string( _input_word, 0 ) == 0 ) return CIRCLES_MISSING_INPUT ;
    else if ( safe_size( _alphabet, 0 ) == 0 ) return CIRCLES_MISSING_ALPHABET ;
    else
    {
       // test if all letters in the input_word are valid as they all match the current alphabet
       var _input_word_array = _input_word.split( "" ), _b_go = YES ;
       for( var _i = 0 ; _i < _input_word_array.length ; _i++ )
       {
           if ( !( _alphabet.includes( _input_word_array[_i] ) ) )
           {
              _b_go = NO ;
              break ;
           }
       }

       return _b_go ;
    }
}

function circles_lib_word_commutator_get( _start_from_symbol, _items_array )
{
    _start_from_symbol = safe_string( _start_from_symbol, "" );
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( _start_from_symbol.length == 0 || !_test ) return "" ;
    else
    {
        var _commutator = _start_from_symbol, _items_n = safe_size( _items_array, 0 ), _b_go = 1, _symbol ;
        for( var _i = 0 ; _i < _items_n ; _i++ )
        {
           _symbol = _items_array[_i].symbol.trim();
           if ( _symbol.length == 0 )
           {
              _b_go = 0 ;
              break ;
           }
           else if ( ( _start_from_symbol.isAlphaLower() && _symbol.isAlphaLower() ) ||
                     ( _start_from_symbol.isAlphaUpper() && _symbol.isAlphaUpper() )
                   ) _commutator += _start_from_symbol != _symbol ? _symbol : "" ;
        }

        if ( _start_from_symbol.isAlphaLower() ) _commutator += _commutator.toUpperCase();
        else if ( _start_from_symbol.isAlphaUpper() ) _commutator += _commutator.toLowerCase();
        return _b_go ? _commutator : "" ;
    }
}

function circles_lib_word_mobiusmap_get( _word, _items_array, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    var _symbols_index_array = circles_lib_symbol_get_indexes_mapping_array( _items_array,  NO, _out_channel );
    _word = safe_string( _word, "" ).trim();
    if ( _word.length > 0 && _test )
    {
        var _index = UNDET, G = new mobius_map( 1, 0, 0, 1 ) ;
        for( var runner = 0 ; runner < _word.length ; runner++ )
        {
           _index = _symbols_index_array[ _word[runner] ] ;
           G = G.composition( _items_array[_index].map );
        }

				return G ;
    }

    return null ;
}

function circles_lib_word_fixedpoints_get( _input_word, _items_array, _prog, _out_channel )
{
    _input_word = safe_string( _input_word, "" ), _prog = safe_int( _prog, NO );
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _sd_n = safe_size( _items_array, 0 ) ;
    if ( !_test ) return [ CIRCLES_INVALID_ITEMS_CONTAINER, null ] ;
		else if ( _sd_n.length == 0 ) return [ CIRCLES_MISSING_SEEDS, null ] ;
    else if ( _input_word.length == 0 ) return [ CIRCLES_MISSING_INPUT, null ] ;
    else if ( _glob_alphabet.length == 0 ) return [ CIRCLES_MISSING_ALPHABET, null ] ;
    else
    {
       var _symbols_index_array = circles_lib_symbol_get_indexes_mapping_array( null,  NO, _out_channel );
       var _points = [], _words = [], _word ;
       var INDEX, G, _mm, _fp, _type ;
       if ( _prog ) for( var _w = 0 ; _w < _input_word.length ; _w++ ) _words.push( _input_word.left( _w + 1 ) );
       else _words.push( _input_word );

       for( var _w = 0 ; _w < _words.length ; _w++ )
       {
          _mm = circles_lib_word_mobiusmap_get( _words[_w], _items_array, _out_channel );
          _fp = is_mobius_map( _mm ) ? _mm.fixed_points() : [] ;
          if ( is_complex( _fp[0] ) )
          {
             _type = FIXEDPOINT_NONE ;
             if ( _mm.is_sink_pt( _fp[0] ) ) _type = FIXEDPOINT_SINK ;
             else if ( _mm.is_source_pt( _fp[0] ) ) _type = FIXEDPOINT_SOURCE ;
             else _type = FIXEDPOINT_NEUTRAL ;
             _points.push( [ _fp[0], _words[_w], circles_lib_fixedpoints_get_def( _type ) ] );
          }

          if ( is_complex( _fp[1] ) )
          {
             _type = FIXEDPOINT_NONE ;
             if ( _mm.is_sink_pt( _fp[1] ) ) _type = FIXEDPOINT_SINK ;
             else if ( _mm.is_source_pt( _fp[1] ) ) _type = FIXEDPOINT_SOURCE ;
             else _type = FIXEDPOINT_NEUTRAL ;
             _points.push( [ _fp[1], _words[_w], circles_lib_fixedpoints_get_def( _type ) ] );
          }
       }

       return [ YES, _points ] ;
    }
}

function circles_lib_word_pq_translate( _p, _q )
{
    var ORIGp = safe_int( _p, 0 ), ORIGq = safe_int( _q, 1 );
    _p = Math.abs( ORIGp ), _q = Math.abs( ORIGq );
    var _symbol01 = _glob_small_letters_array[0], _symbol02 = ORIGp < 0 ? _glob_small_letters_array[1] : _glob_caps_letters_array[1] ;
    var liminf = 1, limsup = _p + _q, word = "", direction = 0 ; // ( 1 --> -_p, 0 --> +_q )
    var runner = 1, candidate = runner ;
    if ( _p == 0 && _q == 1 ) word = _glob_small_letters_array[0] ;
    else
    {
       while( true )
       {
          candidate += direction == 1 ? -_p : _q ;
          if ( candidate > limsup || candidate < liminf )
          {
             direction = !direction, candidate = runner ;
          }
          else
          {
             runner = candidate, word = ( direction ? _symbol01 : _symbol02 ) + word ;
          }
            
          if ( runner == 1 ) break ;
       }
    }
    
    return word ;
}

function circles_lib_word_pq_find_powers( _p, _q )
{
    _p = Math.abs( safe_int( _p, 0 ) ), _q = Math.abs( safe_int( _q, 0 ) );
		var _a = [] ;
		for( var _j = 1 ; _j <= _p ; _j++ ) _a.push( Math.floor( _j * _q / _p ) - Math.floor( ( _j - 1 ) * _q / _p ) );
		_a = _a.sort( function( x, y ) { return x < y ; } );
		var _out = [] ;
		$.each( _a, function( _i, _item ){ _out.push( _item, 1 ); } );
		return _out.clone();
}

function circles_lib_word_orbit_calc( _items_array, _word, _start_pt )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
		_word = safe_string( _word, "" );
    if ( safe_size( _word, 0 ) == 0 || !is_point( _start_pt ) || !_test ) return null ;
    else
    {
       var _symbols_index_array = circles_lib_symbol_get_indexes_mapping_array( null,  NO ) ;
       var _orbit = [ _start_pt ] ;
       for ( var _i = 0 ; _i < _word.length ; _i++ )
       {
          _start_pt = _items_array[ _symbols_index_array[ _word[_i] ] ].map.compute( _start_pt ) ;
          _orbit.push( new point( _start_pt.real, _start_pt.imag ) );
       }
       return _orbit ;
    }
}

function circles_lib_word_is_cyclically_reduced( _word, _alphabet )
{
    _word = safe_string( _word, "" );
    if ( !is_array( _alphabet ) ) _alphabet = _glob_alphabet() ;
    return ( circles_lib_word_is_reduced( _word, _alphabet ) && _word[0].strcmp( _word[ _word.length - 1 ].flipCase() ) ) ? 0 : 1 ;
}

function circles_lib_word_is_reduced( _word, _alphabet )
{
		if ( !is_array( _alphabet ) ) _alphabet = _glob_alphabet ;
		var _a_size = is_array( _alphabet ) ? safe_size( _alphabet, 0 ) : 0 ;
		_word = safe_string( _word, "" );
		if ( _a_size == 0 || safe_size( _word, 0 ) == 0 ) return UNDET ;
		var _crash_strings = [] ;
		$.each( _alphabet, function( _x, _l1 ) { _crash_strings.push( _l1 + circles_lib_word_inverse_get( _l1 ) ) ; } ) ;
		if ( safe_size( _crash_strings, 0 ) == 0 ) return UNDET * 2 ;
		var _b_isreduced = YES ;
		$.each( _crash_strings,
						function( _i, _csh )
						{
							if ( _word.includes( _csh ) )
							{
								 _b_isreduced &= 0 ;
								 return NO ;
							}
						}
				 ) ;
		 
		return _b_isreduced ;
}

function circles_lib_word_reduce( _word, _alphabet )
{
		if ( !is_array( _alphabet ) ) _alphabet = _glob_alphabet ;
		var _a_size = is_array( _alphabet ) ? safe_size( _alphabet, 0 ) : 0 ;
		_word = safe_string( _word, "" );
		if ( _a_size == 0 || safe_size( _word, 0 ) == 0 ) return UNDET ;
		var _crash_strings = [] ;
		$.each( _alphabet, function( _x, _l1 ) { _crash_strings.push( _l1 + circles_lib_word_inverse_get( _l1 ) ) ; } ) ;
		if ( safe_size( _crash_strings, 0 ) == 0 ) return UNDET * 2 ;
		$.each( _crash_strings, function( _i, _csh ) { _word = _word.replaceAll( _csh, "" ) ; } ) ;
		return _word ;
}

function circles_lib_word_cyclic_permutation( _word )
{
    _word = safe_string( _word, "" );
    return _word.substr( 1, _word.length ) + _word[0] ;
}