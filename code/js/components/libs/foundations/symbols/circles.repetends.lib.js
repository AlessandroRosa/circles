function circles_lib_repetends_count() { return safe_int( _glob_repetends_array.size_associative(), 0 ); }
function circles_lib_repetends_exist() { return circles_lib_repetends_count() > 0 ? YES : NO ; }
function circles_lib_repetends_find_index( _symbol )
{
    _symbol = safe_string( _symbol, "" ).trim() ;
		var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    return circles_lib_find_item_index_by_symbol( _items_array, _symbol );
}
function circles_lib_repetends_compress( _input_word )
{
   _input_word = safe_string( _input_word, "" ).trim() ;
   var _compressed_str = "", _last_char = "", _current_char, _run_length = 0 ;
   for( var _i = 1 ; _i < _input_word.length ; _i++ )
   {
      _last_char = _input_word.charAt( _i - 1 ), _current_char = _input_word.charAt( _i );
      if ( _current_char != _last_char )
      {
         _compressed_str += _run_length == 0 ? _last_char : "["+_last_char+"*"+_run_length+"]" ;
         _run_length = 0 ;
      }
           
      _run_length++, _last_char = _current_char ;
   }
      
   if ( _run_length > 0 ) _compressed_str += _run_length == 1 ? _last_char : "["+_last_char+"*"+_run_length+"]" ;
   return _compressed_str ;
}

function circles_lib_repetends_resolve( _input_rep )
{
   _input_rep = safe_string( _input_rep.trim(), "" ) ;
	 if ( _input_rep.length > 0 )
	 {
	    var _repetends_array = explodePACKEDarray( _input_rep, "[", "]" );
	    if ( !is_array( _repetends_array ) ) return _input_rep ;
	   	var _word_token, _unpacked_repetend_array, _repetend_str, _repetend_times ;
	        _input_rep = "" ;
	    for( var _w = 0 ; _w < _repetends_array.length ; _w++ )
	    {
	       _word_token = _repetends_array[_w] ;
	       if ( !( _word_token.includes( "*" ) ) ) _input_rep += _word_token ;
	       else
	       {
	          _unpacked_repetend_array = _word_token.split( "*" );
	          _repetend_str = new String( _unpacked_repetend_array[0] );
	          _repetend_times = safe_int( _unpacked_repetend_array[1], 0 );
	          if ( _repetend_str.isAlpha() && _repetend_times > 0 )
	          _input_rep += _repetend_str.repeat( _repetend_times );
	       }
	    }
	 }
      
   return _input_rep ;
}

function circles_lib_repetends_check_syntax( _items_array = [], _input_rep, _strict_check )
{
	_items_array = circles_lib_items_set( _items_array ), _strict_check = safe_int( _strict_check, YES );
	var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
   // strick check : include the chars [,],: while checking the syntax
   _input_rep = safe_string( _input_rep, "" ).trim();
   // each input string may contain more concatenated repetends
   // such as [b*12][ab*2] for example
   var _repetends_array = explodePACKEDarray( _input_rep, "[", "]" ), _ret = REPETEND_TEST_ERR_OK ;
   // alphabet shall be filled-in by the original seeds array
   var _sd_n = safe_size( _items_array, 0 ) ;
   if ( _sd_n == 0 ) _ret = REPETEND_TEST_ERR_EMPTY_GROUP ;
   else if ( !is_array( _repetends_array ) ) _ret = REPETEND_TEST_ERR_MISSING_INPUT_WORD ;
   else
   {
       var _alphabet = [], _special_chars = [ "[", "]", "*" ] ;
       // extend the alphabet to check the repetend syntax
       // ... first the special chars
       if ( _strict_check )
       {
          $.each( _special_chars, function( _i, _ch ) { _alphabet.push( _ch ) } );
          // ... then digits from 0 to 9
          for( var i = 0 ; i <= 9 ; i++ ) _alphabet.push( i + "" );
		  console.log( _input_rep, _special_chars );
          for( var _c = 0 ; _c < _special_chars.length ; _c++ )
          {
             if ( !( _input_rep.includes( _special_chars[_c] ) ) )
             {
                return REPETEND_TEST_ERR_INVALID_CHARS ;
                break ;
             }
          }
       }
       // ... finally the generator symbols
       for( var _i = 0 ; _i < _sd_n ; _i++ )
       if ( safe_string( _items_array[_i].symbol, "" ).trim().length > 0 ) _alphabet.push( _items_array[_i].symbol );

       if ( _alphabet.length == 0 ) return REPETEND_TEST_ERR_MISSING_ALPHABET ;
       // test if all special chars are in: they are essential for each repetend declaration
       repetends_loop:
       var _input_rep, _input_rep_array, _iw_len, _plain_string, _ch, _w, _i ;
       for( _w = 0 ; _w < _repetends_array.length ; _w++ )
       {
          _input_rep = _repetends_array[_w] ;
          _plain_string = _input_rep.replaceAll( [ "[", "]" ], "" );
          _input_rep_array = _input_rep.split( "" );
          _iw_len = safe_size( _input_rep_array, 0 ) ;
          if ( _iw_len > 0 )
          {
             _ret = REPETEND_TEST_ERR_OK ;
             check_loop:
             for( _i = 0 ; _i < _iw_len ; _i++ )
             {
                _ch = _input_rep_array[_i] ;
                if ( _ch.length == 0 || !( _alphabet.includes( _ch ) ) )
                {
                   _ret = REPETEND_TEST_ERR_INVALID_CHARS ;
                   break check_loop ;
                }
             }
           }
           else _ret = REPETEND_TEST_ERR_INVALID_CHARS ;
       }
   }

   return _ret ;
}

function circles_lib_repetends_resolve_array()
{
   var _word, _repetend, _cand_index ;
   var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
	 for( var _key in _glob_repetends_array )
   {
   		 if ( _key.includes( "rep." ) )
       {
          _word = _key.replaceAll( "rep.", "" ).trim();
          _repetend = _glob_repetends_array[_key] ;
          _cand_index = circles_lib_find_item_index_by_symbol( _items_array, _word );
          if ( _cand_index != UNFOUND ) _glob_repetends_array[_cand_index] = _repetend ;
       }
   }

   _glob_repetends_array.ksort();
}