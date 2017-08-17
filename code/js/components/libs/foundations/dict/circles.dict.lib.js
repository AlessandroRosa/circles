function circles_lib_dict_run( _caller_id, _opcode, _action_id, _question, _silent, _out_channel )
{
    _opcode = safe_float( _opcode, 0 ), _action_id = safe_int( _action_id, 0 );
    _question = safe_int( _question, 0 ), _silent = safe_int( _silent, 0 );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
		var _options_chunk = [];
    if ( _opcode.is_one_of( 0.1, 0.2 ) )
    {
    	 switch( _opcode )
    	 {
					case 0.1:
		      var _alphabet = circles_lib_alphabet_get(), _packed_alphabet = _alphabet.join( "@" );
					_options_chunk = [ _caller_id, _opcode, _glob_depth, _glob_method, _packed_alphabet, _glob_original_dict ] ;
				  return CIRCLESmultithreadingPROCESSdictionary( _options_chunk, _silent, _out_channel );
					break ;
					case 0.2:
					_glob_dict_processor.sliced_dict_flush();
					CIRCLESformsDICTIONARYdisplayPAGE( 0, "", YES );
			    $("#CIRCLESdictionaryFORMbtn5").attr( "class", "link_rounded" );
			    $("#CIRCLESdictionaryFORMbtn5").bind( "click", function() { CIRCLESformsDICTIONARYapply() } );
					return [ RET_OK, "Operation performed with success" ] ;
					break ;
          default: return [ RET_ERROR, "Unknown operation" ] ; break ;
			 }
		}
    else if ( _opcode >= 1.1 && _opcode <= 3.3 )
    {
	     var _length_from = safe_int( $("#DICTIONARYPANELoptionsEDIT1").val(), 0 );
	     var _length_to = safe_int( $("#DICTIONARYPANELoptionsEDIT2").val(), 0 );

		   var _first_n = safe_int( $("#DICTIONARYPANELoptionsEDIT3").val(), 0 );
		   var _last_n = safe_int( $("#DICTIONARYPANELoptionsEDIT4").val(), 0 );

		   var _start_with = $("#DICTIONARYPANELoptionsEDIT5").val();
		   var _includes = $("#DICTIONARYPANELoptionsEDIT6").val();
		   var _end_with = $("#DICTIONARYPANELoptionsEDIT7").val();

			 _options_chunk = [ _caller_id, _opcode, _action_id,
				 									_length_from, _length_to,
				 									_first_n, _last_n,
													_start_with, _includes, _end_with,
													_glob_original_dict ] ;
       return CIRCLESmultithreadingPROCESSdictionary( _options_chunk, _silent, _out_channel );
    }
    else if ( _opcode == 4 )
    {
			 _options_chunk = [ _caller_id, _opcode, _glob_depth, _glob_method, _packed_alphabet, _glob_original_dict ] ;
       return CIRCLESmultithreadingPROCESSdictionary( _options_chunk, _silent, _out_channel );
		}
    else
    {
       var _msg = "Operation halted by user" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ] ;
    }
}

function circles_lib_dict_delete_word( WORD, PAGENUM, INDEX )
{
    var _old_size = circles_lib_count_dict();
    _glob_original_dict[PAGENUM].remove( INDEX, INDEX );
    var _new_size = circles_lib_count_dict();
    return ( _new_size == _old_size - 1 ) ? YES : NO ;
}

function circles_lib_dict_destroy()
{
    _glob_original_dict.flush();
    var _new_size = circles_lib_count_dict();
    return _new_size == 0 ? YES : NO ;
}

function circles_lib_dict_save( _filename )
{
	  var _filename = ( _filename != null && _filename != UNDEF ) ? _filename : "dictionary.txt" ;
    var _basename = basename( _filename );
    var _extension = _filename.includes( "." ) ? _filename.split( ".").get_last() : "" ;
		_filename = _glob_title.length > 0 ? ( _glob_title + "." + _basename + "." +  _extension ) : "circles." + _filename ;
    var blob = new Blob( [ _glob_dict_processor.sliced_dict_get_linear_array().join( _glob_crlf != null ? _glob_crlf : "\r\n" ) ], { type: 'plain/text', endings: 'native' });
    saveAs( blob, _filename );
    return YES ;
}

function circles_lib_dict_invert_words( _input_dict, _opcode, _action_id, _multithread )
{
		_multithread = safe_int( _multithread, 0 );
    var _dict = is_array( _input_dict ) ? _input_dict : _glob_original_dict ;
    var _dict_size = circles_lib_count_dict(), _opcode = safe_float( _opcode, 0 );
    if ( !_dict.is_multidimensional() ) return [ DICTIONARY_ERR_INCOHERENT_INPUT, "Can't perform this action: the input dictionary is not of valid type.", [] ] ;
		else if ( _dict_size == 0 ) return [ DICTIONARY_ERR_EMPTY_INPUT, "Can't perform this action: the input dictionary is empty.", [] ] ;
		else
		{
    	 var _dict_slices_n = safe_size( _dict, 0 );
    	 var _i, _w, _ret_dict = [] ;
			 outer_loop:
    	 for( _i = 0 ; _i < _dict_slices_n ; _i++ )
    	 {
				  for( _w = 0 ; _w < _dict[_i].length ; _w++ )
				  {
	 				  _ret_dict.push( circles_lib_word_inverse_get( _dict[_i][_w] ) );
	 				  if ( _multithread )
	 				  {
							 if ( _glob_multithread_running ) break outer_loop ;
						}
					  else
					  {
							 if ( _glob_process_running_flag ) break outer_loop ;
						}
					}
			 }
				 
       return [ RET_OK, "Dictionary inversion performed with success !", _ret_dict ] ;
		}
}

function circles_lib_dict_work_on_length( _input_dict, _opcode, _action_id, _from, _to, _multithread )
{
		_multithread = safe_int( _multithread, 0 );
    var _dict = is_array( _input_dict ) ? _input_dict : _glob_original_dict ;
    var _dict_size = circles_lib_count_dict(), _msg = "", _opcode = safe_float( _opcode, 0 );
    _from = safe_int( _from, UNDET ), _to = safe_int( _to, UNDET ), _action_id = safe_int( _action_id, 0 );
    if ( _action_id == 0 )
    {
       _action_id = 1 ;
       _msg += "Missing action specification: default set to 'keepword'" ;
    }

    if ( !_dict.is_multidimensional() ) return [ DICTIONARY_ERR_INCOHERENT_INPUT, "Can't perform this action: the input dictionary is not of valid type.", [] ] ;
		else if ( _dict_size == 0 ) return [ DICTIONARY_ERR_EMPTY_INPUT, "Can't perform this action: the input dictionary is empty.", [] ] ;
    else if ( _from == UNDET || _to == UNDET ) return [ DICTIONARY_ERR_INCOHERENT_INPUT, "Can't perform this action: numerical values are not consistent.", [] ] ;
    else if ( _to < _from ) return [ DICTIONARY_ERR_INCOHERENT_INPUT, "Can't perform this action: interval limits are not coherent.", [] ] ;
    else
    {
    	 var _dict_slices_n = safe_size( _dict, 0 ), _rec_slice_from = 0, _rec_slice_to = 0, _len = 0 ;
    	 var _i, _w, _ret_dict = [], _word, _len = 0, _next_len ;
			 outer_loop:
    	 for( _i = 0 ; _i < _dict_slices_n ; _i++ )
    	 {
				  for( _w = 0 ; _w < _dict[_i].length ; _w++ )
				  {
					 		_word = _dict[_i][_w], _len = _word.length ;
		          if ( ( _action_id == 1 && ( _len >= _from && _len <= _to ) )    // keep   (include items inside the interval)
			             || ( _action_id == 2 && ( _len < _from && _len > _to ) )   // remove (include items outside the interval)
									 || ( _action_id == 3 && ( _len >= _from && _len <= _to ) ) // flip   (apply to items inside the interval)
			           )
              _ret_dict.push( _action_id.is_one_of( 1, 2 ) ? _word : circles_lib_word_inverse_get( _word ) );
						  if ( _multithread )
						  {
								 if ( _glob_multithread_running ) break outer_loop ;
							}
						  else
						  {
								 if ( _glob_process_running_flag ) break outer_loop ;
							}
					}
			 }

       var _action = _action_id == 1 ? "Keep word" : "Remove word" ;
       var _char_str = _from == _to ? ( _from == 1 ? "char" : "chars" ) : ( _to > 1 ? "chars" : "char" );
       _msg += ( _msg.length > 0 ? _glob_crlf : "" ) + _action + " words long "+( _from == _to ? _from : " from "+_from+" to "+_to )+ " " + _char_str + ": performed with success !"
       return [ RET_OK, _msg, _ret_dict ] ;
     }
}

function circles_lib_dict_work_on_words( _input_dict, _opcode, _action_id, _start_token_str, _include_token_str, _end_token_str, _multithread )
{
		_multithread = safe_int( _multithread, 0 );
    var _dict = is_array( _input_dict ) ? _input_dict : _glob_original_dict ;
    _start_token_str = safe_string( _start_token_str, "" );
    _include_token_str = safe_string( _include_token_str, "" );
    _end_token_str = safe_string( _end_token_str, "" );

    if ( !_dict.is_multidimensional() ) return [ DICTIONARY_ERR_INCOHERENT_INPUT, "Can't perform this action: the input dictionary is not of valid type.", [] ] ;
    else if ( safe_size( _dict, 0 ) == 0 ) return [ DICTIONARY_ERR_EMPTY, "Can't perform this action: the input dictionary is empty.", [] ] ;
    else if ( ( _opcode == 3.1 && _start_token_str.length == 0 ) ||
					    ( _opcode == 3.2 && _include_token_str.length == 0 ) ||
			   			( _opcode == 3.3 && _end_token_str.length == 0 )
			 			) return [ DICTIONARY_ERR_MISSING_INPUT, "Can't perform this action: missing input value", [] ];
    else
    {
       var _collection_array = [], _word, _i, _w ;
			 outer_loop:
    	 for( _i = 0 ; _i < _dict.length ; _i++ )
    	 {
		      for( _w = 0 ; _w < _dict[_i].length ; _w++ )
		      {
		          _word = _dict[_i][_w] ;
		          if ( _opcode == 3.1 )
							{
									switch( _action_id )
									{
		  								case 1: // keep
											if ( _word.start_with( _start_token_str ) ) _collection_array.push( _word );
											break ;
											case 2: // remove
											if ( !( _word.start_with( _start_token_str ) ) ) _collection_array.push( _word );
											break ;
											case 3: // flip case + reverse = inverse word
											if ( _word.start_with( _start_token_str ) ) _dict[_i][_w] = circles_lib_word_inverse_get( _word );
											break ;
											default: return [ DICTIONARY_ERR_MISSING_INPUT, "Unknown action" ]; break ;
									}
							}
		          else if ( _opcode == 3.2 )
							{
									switch( _action_id )
									{
											case 1: // keep
											if ( _word.includes( _include_token_str ) ) _collection_array.push( _word );
											break ;
											case 2: // remove
											if ( !( _word.includes( _include_token_str ) ) ) _collection_array.push( _word );
											break ;
											case 3: // flip case + reverse = inverse word
											if ( _word.includes( _include_token_str ) ) _dict[_i][_w] = circles_lib_word_inverse_get( _word );
											break ;
											default: return [ DICTIONARY_ERR_MISSING_INPUT, "Unknown action" ]; break ;
									}
							}
		          else if ( _opcode == 3.3 )
							{
									switch( _action_id )
									{
											case 1: // keep
											if ( _word.end_with( _end_token_str ) ) _collection_array.push( _word );
											break ;
											case 2: // remove
											if ( !( _word.end_with( _end_token_str ) ) ) _collection_array.push( _word );
											break ;
											case 3: // flip case + reverse = inverse word
											if ( _word.end_with( _end_token_str ) ) _dict[_i][_w] = circles_lib_word_inverse_get( _word );
											break ;
											default: return [ DICTIONARY_ERR_MISSING_INPUT, "Unknown action" ]; break ;
									}
							}
								 
 							if ( _multithread )
	 						{
								 if ( _glob_multithread_running ) break outer_loop ;
							}
	 						else
	 						{
								 if ( _glob_process_running_flag ) break outer_loop ;
							}
		      }
    	 }

       var _ret_dict = _action_id.is_one_of( 1, 2 ) ? _collection_array.clone() : _dict ;
       return [ RET_OK, "Action on the dictionary has been performed with success !", _ret_dict ] ;
    }
}

function circles_lib_dict_progressive_generation( _dictionary_obj, _alphabet, _depth, _word_type, _construction_mode, _allow_repetition, _compute_inv_symbol, _crash_words_packed, _multithread )
{
		_multithread = safe_int( _multithread, 0 );
    var _crash_words_array = _crash_words_packed != null ? _crash_words_packed.split( "|" ) : [] ;
    var _csl = safe_size( _crash_words_array, 0 );
    if ( _dictionary_obj != null ) _dictionary_obj.flush();
    if ( _csl > 0 ) for( var _i = 0 ; _i < _csl ; _i++ ) _dictionary_obj.add_crash_word( _crash_words_array[_i] );

    _dictionary_obj.set_alphabet( _alphabet, _compute_inv_symbol );
    _dictionary_obj.set_max_depth( _depth );
    _dictionary_obj.set_word_type( _word_type );
    _dictionary_obj.set_construction_mode( _construction_mode );
    _dictionary_obj.set_process( _DICTIONARY_PROGRESSIVE_PROCESS );
    _dictionary_obj.set_repetition( _allow_repetition );
    _dictionary_obj.create_rules();
    _dictionary_obj.start(); // set the running flag on
		_dictionary_obj.create_dictionary( null );
    return _dictionary_obj.sliced_dictionary != null ? _dictionary_obj.sliced_dictionary : null ;
}

function circles_lib_dict_automaton_generation( _dictionary_obj, _depth, _construction_mode, _multithread )
{
		_multithread = safe_int( _multithread, 0 );
    _dictionary_obj.set_process( _DICTIONARY_AUTOMATON_PROCESS );
    _dictionary_obj.set_max_depth( _depth );
    _dictionary_obj.set_construction_mode( _construction_mode );
    _dictionary_obj.start(); // set the running flag on
		_dictionary_obj.create_dictionary( null );
    return _dictionary_obj.sliced_dictionary != null ? _dictionary_obj.sliced_dictionary : null ;
}