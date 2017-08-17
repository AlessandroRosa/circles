function circles_lib_alphabet_get_cap_symbols()      { return is_array( _glob_alphabet ) ? _glob_alphabet.filtering( function( _v ) { return _v.isAlphaUpper(); } ).purge(0).sort() : []; }
function circles_lib_alphabet_get_small_symbols()    { return is_array( _glob_alphabet ) ? _glob_alphabet.filtering( function( _v ) { return _v.isAlphaLower(); } ).purge(0).sort() : []; }
function circles_lib_alphabet_count_cap_symbols()    { return safe_size( circles_lib_alphabet_get_cap_symbols(), 0 ); }
function circles_lib_alphabet_count_small_symbols() { return safe_size( circles_lib_alphabet_get_small_symbols(), 0 ); }
function circles_lib_alphabet_get_color_from_symbol( _sym )
{
    _sym = safe_string( _sym, "" ).trim();
    if ( safe_size( _sym, 0 ) == 0 ) return null ;
    else if ( _sym.isAlphaLower() ) return _glob_lower_alphabet_colorization_array[ _sym ] ;
    else if ( _sym.isAlphaUpper() ) return _glob_upper_alphabet_colorization_array[ _sym ] ;
    else return null ;
}

function circles_lib_alphabet_get( _items_array )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( !_test ) return "" ;
    var _n = _test ? safe_size( _items_array, 0 ) : 0 ;
    if ( _n == 0 ) return _glob_alphabet ;
    else
    {
        _glob_alphabet = [] ;
        var _l, _i ;
        for( _i = 0 ; _i < _n ; _i++ )
        {
           _l = safe_string( _items_array[_i].symbol, "" ) ;
           if ( _l.length > 0 ) _glob_alphabet.push( _l );
        }

        return _glob_alphabet.clone() ;
    }
}

function circles_lib_alphabet_suggest_symbol( _items_array, _symbol_case )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( !_test ) return "" ;
    _symbol_case = safe_int( _symbol_case, CAPS_LETTER );
    var _suggested_symbol = "", _symbol, _inv_symbol, ITEMOBJ, _symbols = null ;
    _symbols = _symbol_case == SMALL_LETTER ? _glob_small_letters_array : _glob_caps_letters_array ;
    var _len = safe_size( _symbols, 0 ) ;
    switch( circles_lib_method_get() )
    {
         case METHOD_ALGEBRAIC:
         var _mask ;
         for( var _i = 0 ; _i < _len ; _i++ )
         {
             _mask = 0, _symbol = safe_string( _symbols[_i], "" ), _inv_symbol = _symbol.flipCase() ;
             if ( is_item_obj( circles_lib_find_item_obj_by_symbol( _items_array, _symbol ) ) ) _mask |= 1 ;
             if ( is_item_obj( circles_lib_find_item_obj_by_symbol( _items_array, _inv_symbol ) ) ) _mask |= 2 ;
             if ( _mask != (1|2) ) return ( _mask & 1 ) == 0 ? _symbol : _inv_symbol ;
         }
         break ;
         case METHOD_INVERSION:
         for( var _i = 0 ; _i < _len ; _i++ )
         {
             _symbol = safe_string( _symbols[_i], "" ) ;
             ITEMOBJ = circles_lib_find_item_obj_by_symbol( _items_array, _symbol );
             if ( !is_item_obj( ITEMOBJ ) )
             {
                _suggested_symbol = _symbol ;
                break ;
             }
         }
         break ;
    }
    
    return _suggested_symbol.trim();
}

function circles_lib_alphabet_suggest_inverse_symbol( _input_symbol )
{
    _input_symbol = safe_string( _input_symbol, "" ).trim();
    return _input_symbol.length > 0 ? safe_string( circles_lib_word_inverse_get( _input_symbol ), "" ) : "" ;
}

function circles_lib_alphabet_autoconfig_all_symbols( _question, _silent, _force, _out_channel )
{
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _force = safe_int( _force, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items(_items_array);
    if ( _glob_method == METHOD_NONE )
    {
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ERR_24_02, _glob_app_title );
        return [ RET_ERROR, _ERR_24_02 ];
    }
    else if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) && _items_n % 2 == 1 )
    {
        var _msg = "Can't set symbols when method is <b>" + circles_lib_method_get_def( _glob_method ) + "</b>" ;
            _msg += _glob_crlf.repeat(2) + _ERR_33_06 + _glob_crlf + ": it's currently " + _items_n ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ];
    }
    else
    {
        var _b_go = ( _out_channel == OUTPUT_SCREEN && _question ) ? confirm( _QUESTION_24 ) : YES ;
        if ( _b_go )
        {
           if ( _items_n > 0 )
           {
            	 var _i, _x, _mm, _inv_mm, _symbol, _resident_symbol, _resident_inv_symbol, _inv_symbol, _inverse_mm_index ;
               _glob_alphabet.flush();
               for( _i = 0 ; _i < _items_n ; _i++ )
               {
                   switch( _glob_method )
                   {
                       case METHOD_ALGEBRAIC:
                       _mm = _items_array[_i].map ;
                       if ( is_mobius_map( _mm ) )
                       {
                           _symbol = _items_array[_i].symbol ;
                           _inv_symbol = circles_lib_word_inverse_get( _symbol );

                           // search for inverse map through the coefficients
                           _inverse_mm_index = UNFOUND ;
                           for( _x = 0 ; _x < _items_n ; _x++ )
                           {
                               if ( _inv_symbol.strcmp( _items_array[_x].symbol ) )
                               {
                                   _inverse_mm_index = _x ;
                                   break ;
                               }
                           }

                           _resident_symbol = safe_string( _items_array[_i].symbol, "" ) ;
                           _resident_inv_symbol = safe_string( _items_array[_i].inverse_symbol, "" ) ;
                           if ( _resident_symbol.length == 0 )
                           {
                              _items_array[_i].original_word = _items_array[_i].symbol = circles_lib_alphabet_suggest_symbol( _items_array, CAPS_LETTER );
                              _resident_inv_symbol = _items_array[_i].inverse_symbol = circles_lib_word_inverse_get( _items_array[_i].symbol );
                           }
                           
                           if ( _resident_inv_symbol.length == 0 )
                           {
                              _symbol = _items_array[_i].symbol = safe_string( _items_array[_i].symbol.trim(), "" ) ;
                              _inv_symbol = _symbol.length > 0 ? circles_lib_word_inverse_get( _symbol ) : "" ;
                              _items_array[_i].inverse_symbol = _inv_symbol ;
                              if ( !_glob_alphabet.includes( _symbol ) ) _glob_alphabet.push( _symbol );
                              if ( !_glob_alphabet.includes( _inv_symbol ) ) _glob_alphabet.push( _inv_symbol );
                              if ( _inverse_mm_index != UNFOUND )
                              {
                                 _items_array[_inverse_mm_index].original_word = _items_array[_inverse_mm_index].symbol = _inv_symbol ;
                                 _items_array[_inverse_mm_index].inverse_symbol = _symbol ;
                              }
                           }
                       }
                       else
                       {
                           var _msg = "Can't set symbols: at least one item is not correctly saved" ;
                           if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
                           return [ RET_ERROR, _msg ];
                           break ;
                       }
                       break ;
                       case METHOD_INVERSION:
                       _symbol = _glob_caps_letters_array[_i].trim();
                       if ( _items_array[_i].symbol.trim().length == 0 || _force == YES )
                       _items_array[_i].original_word = _items_array[_i].symbol = _symbol ;

                       _items_array[_i].inverse_symbol = "" ;
                       if ( !_glob_alphabet.includes( _symbol ) ) _glob_alphabet.push( _symbol );
                       break ;
                       default:
                       break ;
                   }
               }

               var _msg = "All symbols have been successfully set up" ;
               if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
               return [ RET_OK, _msg ];
          }
          else
     		  {
				  		var _msg = "Can't set up symbols: " + _ERR_33_01 ;
					 		if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
              return [ RET_ERROR, _msg ] ;
					}
        }
    }
}