function CIRCLESunpairedinversionDICTIONARYcreate( objs, settings )
{
      var _items_array = objs['items'] ;
      var _items_n = safe_size( _items_array, 0 );
      		_glob_multithread_dictionary_obj.flush();
      var _config = settings['config'].split( "@" );
      var _depth = safe_int( settings['depth'], 1 );
      var _construction_mode = safe_int( _config[2], CONSTRUCTION_NONE );
      var _dict_process = safe_int( settings['dict_process'], _DICTIONARY_NONE_PROCESS );
      var dict_init_settings_packed = settings['dict_init_settings_packed'] ;
      var dict_init_settings_array = dict_init_settings_packed.split( "@" );

      var _startINDEX = 0 ;
      var _use_reduced_words = safe_int( dict_init_settings_array[_startINDEX], 0 );
          _startINDEX++ ;
      var _allow_repetition = safe_int( dict_init_settings_array[_startINDEX], 0 );
          _startINDEX++ ;
      var _compute_inv_symbol = safe_int( dict_init_settings_array[_startINDEX], 0 );
          _startINDEX++ ;
      var _longest_words_only = safe_int( dict_init_settings_array[_startINDEX], 0 );

      // create one associative array to keep the symbol-index connection
      // and consult it later, by inputting the symbol as the key to the array element
      _glob_multithread_symbols_index_array = [];
      var _ret_dictionary = null ;
              
      for( var i = 0 ; i < _items_n ; i++ ) _glob_multithread_symbols_index_array[_items_array[i].symbol] = i ;
    
      // gathers all symbols into one array
      var _alphabet = [];
      for( i = 0 ; i < _items_n ; i++ ) _alphabet.push( _items_array[i].symbol );
      
      switch( _dict_process )
      {
          case _DICTIONARY_PROGRESSIVE_PROCESS:
          _startINDEX++ ;
          _glob_multithread_crash_words_packed = dict_init_settings_array[_startINDEX] ;
          var _ret = _items_n > 0 ? circles_lib_dict_progressive_generation( _glob_multithread_dictionary_obj, _alphabet, _depth, _use_reduced_words, _construction_mode, _allow_repetition, _compute_inv_symbol, _glob_multithread_crash_words_packed, 1 ) : null ;
          _glob_multithread_crash_words_packed = _glob_multithread_dictionary_obj.get_crash_words().join( "|" );
          return _ret ;
          break ;
          case _DICTIONARY_AUTOMATON_PROCESS:
          _glob_multithread_dictionary_obj.set_max_depth( _depth );
          var _ret = circles_lib_dict_automaton_generation( _glob_multithread_dictionary_obj, _depth, _construction_mode, 1 );
          return _ret ;
          break ;
          default: return [] ; break ;
      }
}