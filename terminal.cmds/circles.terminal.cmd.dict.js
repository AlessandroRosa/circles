function circles_terminal_cmd_dict()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _output_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose && _glob_terminal_echo_flag )
     circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

	 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _help = NO ;
     var _action_id = 0 ;
     var _opcode = 0 ;
     var _start_token_str = "", _include_token_str = "", _end_token_str = "", _concat_token_str = "" ;
     var _general_token_str = "" ;
     var _first_n_words = 0, _last_n_words = 0 ;
     var _length_from = UNDET, _length_to = UNDET ;
     var _index_from = UNDET, _index_to = UNDET ;
     var _general_from = UNDET, _general_to = UNDET ;
     var _crash_words_context = NO, _crash_word = "" ;
     var _counter = 0 ;
     var _entries_per_page = 80 ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
        var _index_associations = [];
            _params_assoc_array['action'] = "" ;
            _params_assoc_array["copy"] = NO ;
            _params_assoc_array['features'] = [];
            _params_assoc_array['force'] = NO ;
            _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;
            _params_assoc_array['opcode'] = "" ;

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); 
        var _p, _w ;

 			  var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
	 		  _params_assoc_array['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
			  _params_assoc_array['dump_operator_index'] = _dump_operator_index ;
			  _params_assoc_array['dump_array'] = [];

	 		  _params_assoc_array['transfer_to'] = ( _params_array.indexOf( TERMINAL_TRANSFER_TO_OPERATOR ) != UNFOUND ) ? YES : NO ;
	 		  _params_assoc_array['transfer_from'] = ( _params_array.indexOf( TERMINAL_TRANSFER_FROM_OPERATOR ) != UNFOUND ) ? YES : NO ;

			  // gather all dump parameters into one array
        if ( _params_assoc_array['dump'] )
        {
  				 for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
  				 if ( _params_array[_i].trim().length > 0 ) _params_assoc_array['dump_array'].push( _params_array[_i] );
        }

        // pre-scan for levenshtein correction
				var _local_cmds_params_array = [];
						_local_cmds_params_array.push( "add", "append", "apply", "build", "concatword", "copy", "crashstring", "createflag",
                                           "delete", "destroy", "flipword", "flush", "keepword", "html",
                                           "find", "flush", "list", "prepend", "help",
                                           "remove", "removeword", "reverse", "reverseword", "release",
                                           "sortbyval", "sortbylen", "save", "size" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
              _p = _params_array[_i];
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
              else if ( _p.is_one_of_i( "on", "off" ) ) _params_assoc_array['go'] = _p ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.stricmp( "copy" ) )
              {
                    // it might be a parameter or an action to be performed
                    // if it has been input isolatedly
                   _params_assoc_array["copy"] = YES ;
                   _params_assoc_array['action'] = _p.toLowerCase();
              }
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.stricmp( "force" ) ) _params_assoc_array['force'] = YES ;
              else if ( _p.stricmp( "createflag" ) ) _params_assoc_array['action'] = _p.toLowerCase();
              else if ( _p.stricmp( "crashstring" ) ) _crash_words_context = YES ;
              else if ( _p.stricmp( "add" ) )
              {
                   if ( _crash_words_context ) _action_id = 1 ;
                   _params_assoc_array['action'] = _p.toLowerCase();
              }
              else if ( _p.stricmp( "list" ) )
              {
                   _action_id = _crash_words_context ? 3 : UNDET ;
                   _params_assoc_array['action'] = _p.toLowerCase();
              }
              else if ( _p.stricmp( "remove" ) )
              {
                   if ( _crash_words_context ) _action_id = 2 ;
                   _params_assoc_array['action'] = _p.toLowerCase();
              }
              else if ( _p.stricmp( "concatword" ) )
              {
                   _action_id = 5 ;
                   _params_assoc_array['action'] = _p.toLowerCase();
              }
              else if ( _p.stricmp( "keepword" ) )
              {
                   _action_id = 1 ;
                   _params_assoc_array['action'] = _p.toLowerCase();
              }
              else if ( _p.stricmp( "removeword" ) )
              {
                   _action_id = 2 ;
                   _params_assoc_array['action'] = _p.toLowerCase();
              }
              else if ( _p.stricmp( "flipword" ) )
              {
                   _action_id = 3 ;
                   _params_assoc_array['action'] = _p.toLowerCase();
              }
              else if ( _p.stricmp( "reverseword" ) )
              {
                   _action_id = 4 ;
                   _params_assoc_array['action'] = _p.toLowerCase();
              }
              else if ( _p.is_one_of_i( "append", "apply", "build", "delete", "find", "flush", "prepend", "release",
                                        "reverse", "save", "size", "sortbyval", "sortbylen" ) )
              {
                   _params_assoc_array['action'] = _p.toLowerCase();
              }
              else if ( _params_assoc_array['action'].stricmp( "list" ) )
              {
                   if ( _p.stricmp( "full" ) ) _params_assoc_array['full'] = YES ;
                   if ( _p.is_one_of_i( "length", "page", "word" ) )
                   {
                       _params_assoc_array['features'].push( _p );
                       _index_associations[ '' + _p ] = _i ;
                   }
                   else if ( _params_assoc_array['features'].includes_i( "length" ) && _i == _index_associations[ 'length' ] + 1 && _p.testME( _glob_positive_integer_regex_pattern ) )
                   _params_assoc_array['lengthfilter'] = safe_int( _p, 0 );
                   else if ( _params_assoc_array['features'].includes_i( "page" ) && _i == _index_associations[ 'page' ] + 1 && _p.testME( _glob_positive_integer_regex_pattern ) )
                   _params_assoc_array['pagefilter'] = safe_int( _p, 0 );
                   else if ( _params_assoc_array['features'].includes_i( "word" ) && _i == _index_associations[ 'word' ] + 1 && _p.testME( "^([A-Za-z\*]{1,})$" ) )
                   _params_assoc_array['wordfilter'] = _p ;
              }
              else
              {
                   if ( _params_assoc_array['action'].is_one_of_i( "append", "prepend", "find" ) )
                   {
									 			_counter++ ;
									 			if ( _counter == 1 ) _general_token_str = _p ;
									 }
                   else if ( _crash_words_context && _action_id.is_one_of( 1, 2 ) ) _crash_word = _p ;
                   else if ( _p.toLowerCase().start_with( "length:" ) )
                   {
                        _opcode = 1.1 ;
                        var _length_str = _p.replaceAll( "length:", "" );
                        if ( circles_lib_count_dict() == 0 )
                        {
                             _b_fail = YES, _error_str = "Dictionary is empty: can't set up any range" ;
                        }
                        else if ( !( _length_str.includes( "," ) ) && !_length_str.isNumber() )
                        {
                             _b_fail = YES, _error_str = "Syntax error in range definition" ;
                        }
                        else
                        {
                            var _separator = "" ;
                            if ( _length_str.includes( "," ) ) _separator = "," ;
                            else if ( _length_str.includes( "-" ) ) _separator = "-" ;
                            var _length_array = _length_str.includes( _separator ) ? _length_str.split( _separator ) :( _length_str.length > 0 ? [ _length_str ] : [] );
                            var _candidate_from = 0, _candidate_to = 0 ;
                            if ( _length_array.length == 0 )
                            {
                                 _b_fail = YES, _error_str = "Syntax error in range definition" ;
                            }
                            else if ( _length_array.length == 1 )
                                 _candidate_from = _candidate_to = _length_array[0] ;
                            else _candidate_from = _length_array[0], _candidate_to = _length_array[1] ;

                               var _dict_size = circles_lib_count_dict();
                               if ( !( _candidate_from.isNumber() ) || !( _candidate_to.isNumber() ) )
                               {
                                   _b_fail = YES, _error_str = "Both input values ("+_candidate_from+","+_candidate_to+") must be numbers" ;
                               }
                        }
                   }
                   else if ( _p.toLowerCase().start_with( "first:" ) )
                   {
                        _opcode = 2.1 ;
                        _first_n_words = _p.replaceAll( "first:", "" );
                        if ( _first_n_words == UNDET )
                        {
														 _b_fail = YES, _error_str = "Input value ("+_first_n_words+") must be a number" ;
												}
									 }
                   else if ( _p.toLowerCase().start_with( "last:" ) )
                   {
                        _opcode = 2.2 ;
                        _last_n_words = _p.replaceAll( "last:", "" );
                        if ( _last_n_words == UNDET )
                        {
														 _b_fail = YES, _error_str = "Input value ("+_last_n_words+") must be a number" ;
												}
									 }
                   else if ( _p.toLowerCase().start_with( "startwith:" ) )
                   {
                        _opcode = 3.1 ;
                        _general_token_str = _start_token_str = _p.replaceAll( "startwith:", "" );
									 }
                   else if ( _p.toLowerCase().start_with( "include:" ) )
                   {
                        _opcode = 3.2 ;
                        _general_token_str = _include_token_str = _p.replaceAll( "include:", "" );
									 }
                   else if ( _p.toLowerCase().start_with( "endwith:" ) )
                   {
                        _opcode = 3.3 ;
                        _general_token_str = _end_token_str = _p.replaceAll( "endwith:", "" );
									 }
                   else if ( _p.toLowerCase().start_with( "concat:" ) )
                        _general_token_str = _concat_token_str = _p.replaceAll( "concat:", "" );
                   else
                   {
                       _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
                   }
              }
         }

 	 			 var _action = _params_assoc_array['action'], _force = _params_assoc_array['force'] ;
         if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _output_channel );
         else if ( _params_assoc_array['keywords'] )
         {
             var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
             if ( _msg.length == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
             else
             {
                 _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                 circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
             }
         }
         else if ( _action.length == 0 )
         {
              _b_fail = YES ;
              _glob_terminal_critical_halt_msg = _error_str = "Missing action specification" ;
              _glob_terminal_critical_halt = YES ;
         }
         else if ( !_b_fail )
         {
              switch( _action )
				 			{
									 case "add":
                   if ( _crash_words_context && _action_id == 1 && _crash_word.length > 0 )
                   {
                        var _alphabet = circles_lib_alphabet_get();
												var _b_go = circles_lib_word_check( _crash_word, _alphabet );
												if ( _b_go )
												{
													  var _packed = _dictionary_init_settings_array['crash_words_packed'] ;
														var _current_crash_words_array = ( _packed.includes( "|" ) ) ? _packed.split( "|" ) : ( ( _packed.length > 0 ) ? [ _packed ] : [] );
		                        if ( _current_crash_words_array.includes( _crash_word ) )
		                        {
																 _b_fail = YES, _error_str = "The crash word '"+_crash_word+"' is already in" ;
														}
														else
														{
																_current_crash_words_array.push( _crash_word );
																_dictionary_init_settings_array['crash_words_packed'] = _current_crash_words_array.join( "|" );
									 						  circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Crash word '"+_crash_word+"' is now in", _par_1, _cmd_tag );
														}
												}
												else
												{
														_b_fail = YES, _error_str = "The candidate crash word '"+_crash_word+"' does not match the current alphabet" ;
												}
                   }
                   else
                   {
									 			_b_fail = YES, _error_str = "Wrong coordinates to perform crash word insertion" ;
									 			if ( _crash_words_context == 0 ) _error_str += _glob_crlf + "Please, put 'crashstring' context into the cmd" ;
									 			if ( _action_id != 1 ) _error_str += _glob_crlf + "Action has been not properly coded" ;
									 			if ( _crash_word.length == 0 ) _error_str += _glob_crlf + "Crash word is empty" ;
									 }
                   break ;
									 case "append":
                   var _alphabet = circles_lib_alphabet_get();
									 var _b_go = circles_lib_word_check( _general_token_str, _alphabet );
                   if ( _b_go.is_one_of( UNDET, CIRCLES_MISSING_INPUT ) )
                   {
 										    _b_fail = YES, _error_str = "The input word '"+_general_token_str+"' or the current alphabet is empty/undefined" ;
                   }
                   else if ( _b_go )
									 {
									 			if ( _glob_original_dict.includes( _general_token_str ) )
									 			{
													  _b_fail = YES, _error_str = "This dictionary already includes the word '"+_general_token_str+"'" ;
												}
												else
												{
													  var _old_size = circles_lib_count_dict();
													  _glob_original_dict.push( _general_token_str );
											 			var _new_size = circles_lib_count_dict();
											 			
											 			if ( _old_size == _new_size - 1 )
											 			{
											 					var _msg = "Word '"+_general_token_str+"' has been appended with success" ;
							 								  circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
														}
														else
														{
															  _b_fail = YES, _error_str = "Can't append the word '"+_general_token_str+"': memory failure" ;
														}
												}
									 }
									 else
									 {
											  _b_fail = YES, _error_str = "The candidate word '"+_general_token_str+"' to be appended does not match the current alphabet" ;
									 }
                   break ;
									 case "apply":
                   _glob_dict_check = SKIP, _glob_dict_create = NO ;
                   _glob_dict_processor.dictionary_array = _glob_original_dict.clone();
                   var _b_go = ( circles_lib_count_dict() > 0 ) ? YES : NO ;
                   var _msg = _b_go ? "Dictionary has been applied to diagram with success !" : "Dictionary has not been applied" ;
                       if ( _b_go ) _msg += "Now render for settings to take effect" ;
									 var _ret_id = _b_go ? YES : NO, _ret_text = _msg ;
 								   circles_lib_output( _output_channel, ( _ret_id == 1 ) ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_text, _par_1, _cmd_tag );
									 break ; 
									 case "build":
                   if ( circles_lib_count_dict() == 0 || _force )
                   {
    									 if ( _force ) circles_lib_output( _output_channel, DISPATCH_INFO, "Forcing dict creation", _par_1, _cmd_tag );
                       var _settings = _dictionary_init_settings_array ;
                       _glob_original_dict = circles_lib_dict_progressive_generation( _glob_dict_processor, _glob_alphabet, _glob_depth,
                                                                                     _settings['use_reduced_words'],
                                                                                     _glob_construction_mode,
                                                                                     _settings['allow_repetition'],
                                                                                     _settings['compute_inv_symbol'],
                                                                                     _settings['crash_words_packed'],
																																										 NO );

         							 var _ret_id = circles_lib_count_dict() > 0 ? YES : NO ;
                       var _ret_msg = _ret_id ? "Dictionary built with success" : "Fail tu build the dictionary" ;
    			 						 circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                   }
                   else
                   {
                       _b_fail = YES, _error_str = "Can't build: the current dictionary is not empty" ;
                       _error_str += _glob_crlf + "Try to empty it or input the 'force' param" ;
                   }
									 break ;
									 case "copy":
                   if ( _glob_original_dict.size_recursive() > 0 )
                   {
                       _glob_storage['dict'] = _glob_original_dict.clone();
                       var _check = 1 ;
                       _check &= is_array( _glob_storage['dict'] ) ;
                       _check &= _glob_storage['dict'].size_recursive() > 0 ;
                       var _msg = _check ? "All words in the dictionary have been copied into storage space with success" : "Storage destination error: can't perform copy of the whole dictionary" ;
                       circles_lib_output( _output_channel, _check ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                   }
                   else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't copy : " + _ERR_33_04, _par_1, _cmd_tag );
									 break ;
				   case "createflag":
				   var _bGO = _params_assoc_array['go'] != null ? ( _params_assoc_array['go'] == "on" ? YES : NO ) : NO ;
				   _glob_dict_create = _bGO ;
				   circles_lib_output( _output_channel, _params_assoc_array['go'] != null ? DISPATCH_SUCCESS : DISPATCH_INFO, "The flag for dictionary has been set to '"+ _params_assoc_array['go']+"'", _par_1, _cmd_tag );
				   break ;
				   case "find":
                   if ( circles_lib_count_dict() > 0 && _output_channel == OUTPUT_TERMINAL )
                   {
                        if ( _general_token_str.length > 0 )
                        {
                             if ( _glob_original_dict.includes( _general_token_str ) )
                             {
                                 var _index = _glob_original_dict.indexOf( _general_token_str );
              			 						 circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The input word '"+_general_token_str+"' is indexed at "+( _index + 1 )+"", _par_1, _cmd_tag );
                             }
                             else circles_lib_output( _output_channel, DISPATCH_WARNING, "The current dictionary does not include the word '"+_general_token_str+"'", _par_1, _cmd_tag );
                        }
                        else
                        {
                           _b_fail = YES, _error_str = "Can't find: the input word is empty" ;
                        }
                   }
                   else if ( _output_channel != OUTPUT_TERMINAL )
     			 						  circles_lib_output( _output_channel, DISPATCH_WARNING, "The dictionary finder is available in console mode exclusively", _par_1, _cmd_tag );
                   else if ( circles_lib_count_dict() == 0 )
                   {
                       _b_fail = YES, _error_str = "Can't find: the current dictionary is empty" ;
                   }
									 break ;
									 case "flush":
                   if ( circles_lib_count_dict() > 0 && _output_channel == OUTPUT_TERMINAL )
                   {
                   		 var _params_array = [] ;
									      	 _params_array['prepromptquestion'] = "This action is irreversible: all flushed data cannot be recovered, unless" ;
									      	 _params_array['prepromptquestion'] += _glob_crlf + "the dictionary itself will be generated again with the same params" ;
                   		 		 _params_array['promptquestion'] = "Confirm to erase the whole dictionary ?" ;
                   		 		 _params_array['yes_fn'] = function() { var _ret = circles_lib_dict_destroy(); circles_lib_output( _output_channel, _ret ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret ? "Dictionary flushed with success" : "Can't flush the dictionary away", _par_1, _cmd_tag ); }
                   		 		 _params_array['ifquestiondisabled_fn'] = function() { circles_lib_dict_destroy(); }
                   		 circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                   }
                   else if ( _output_channel != OUTPUT_TERMINAL )
     			 						  circles_lib_output( _output_channel, DISPATCH_WARNING, "Flushing option is available in console mode exclusively", _par_1, _cmd_tag );
                   else
                   {
                       _b_fail = YES, _error_str = "Can't flush: the current dictionary is empty" ;
                   }
                   break ;
									 case "list":
                   var _size = circles_lib_count_dict();
                   if ( _output_channel != OUTPUT_TERMINAL ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Dictionary list is available in console mode exclusively", _par_1, _cmd_tag );
                   else if ( _size == 0 )
                   {
		 			 						  circles_lib_output( _output_channel, DISPATCH_WARNING, "The dictionary is currently empty", _par_1, _cmd_tag );
                   }
                   else if ( _crash_words_context && _action_id == 3 )
                   {
											  var _packed = _dictionary_init_settings_array['crash_words_packed'] ;
												var _current_crash_words_array = ( _packed.includes( "|" ) ) ? _packed.split( "|" ) : ( ( _packed.length > 0 ) ? [ _packed ] : [] );
												if ( safe_size( _current_crash_words_array, 0 ) == 0 )
		 			 						  circles_lib_output( _output_channel, DISPATCH_WARNING, "The crash words list is empty", _par_1, _cmd_tag );
		 			 						  else 
		 			 						  circles_lib_output( _output_channel, DISPATCH_INFO, "The crash words list is "+_current_crash_words_array.join( "," )+"", _par_1, _cmd_tag );
                   }
                   else if ( _action_id == UNDET )
                   {
                        var _features_array = _params_assoc_array['features'].length > 0 ? _params_assoc_array['features'] : "" ;
                        var _full = ( _params_assoc_array['full'] != null ) ? YES : NO ;
                        var _length_filter_exists = ( _features_array.includes( "length" ) && _params_assoc_array['lengthfilter'] != null ) ? YES : NO ;
                        var _length_filter = ( _length_filter_exists ) ? safe_int( _params_assoc_array['lengthfilter'], 1 ) : 0 ;
                        var _page_filter_exists = ( _features_array.includes( "page" ) && _params_assoc_array['pagefilter'] != null ) ? YES : NO ;
                        var _page_filter = ( _page_filter_exists ) ? safe_int( _params_assoc_array['pagefilter'], 1 ) : UNDET ;
                        var _word_filter_exists = ( _features_array.includes( "word" ) && _params_assoc_array['wordfilter'] != null ) ? YES : NO ;
                        var _word_filter = ( _word_filter_exists ) ? _params_assoc_array['wordfilter'] : "" ;

                        var _dump = _params_assoc_array['dump'] && safe_size( _params_assoc_array['dump_array'][0], 0 ) > 0 ? YES : NO ;
                        var _filters_on = ( _page_filter_exists || _length_filter_exists || _word_filter_exists ) ? YES : NO ;

                        var _filter_existence_mask = 0 ;
                        if ( _length_filter_exists ) _filter_existence_mask |= 1 ;
                        if ( _page_filter_exists ) _filter_existence_mask |= 2 ;
                        if ( _word_filter_exists ) _filter_existence_mask |= 4 ;

                        _glob_storage['words'].flush();
                        circles_lib_output( _output_channel, DISPATCH_INFO, "Purging word data storage for next list", _par_1, _cmd_tag );

                        if ( _full && _output_channel != OUTPUT_TEXT )
                        circles_lib_output( _output_channel, DISPATCH_WARNING, "'Full' parameter is skipped for console input", _par_1, _cmd_tag );

                        if ( _length_filter_exists )
                        circles_lib_output( _output_channel, DISPATCH_INFO, "Filter : length ("+_length_filter+")", _par_1, _cmd_tag );
                        if ( _page_filter_exists )
                        circles_lib_output( _output_channel, DISPATCH_INFO, "Filter : page number ("+_page_filter+")", _par_1, _cmd_tag );
                        if ( _word_filter_exists )
                        circles_lib_output( _output_channel, DISPATCH_INFO, "Filter : word ("+_word_filter+")", _par_1, _cmd_tag );

                        var _pages = Math.floor( _size / _entries_per_page );
                        if ( ( _size % _entries_per_page ) > 0 ) _pages++ ;
  
                             if ( _page_filter > _pages )
                             {
                                  var _msg = "Input page number ("+_page_filter+") exceeds current page length ("+_pages+")" ;
                                      _msg += _glob_crlf + "Dictionary set to page " + _pages ;
                                      _page_filter = _pages ;
                                  circles_lib_output( _output_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                             }

                            _page_filter = Math.min( Math.max( _page_filter, 0 ), _pages );
                            _page_filter-- ;

                        var _dict_array = _glob_original_dict ;
                        var _subset = ( _page_filter_exists ) ? _dict_array.slice( _entries_per_page * _page_filter, _entries_per_page * _page_filter + _entries_per_page + 1 ) : _dict_array ;

                        var _word_max_length = 0 ;
                        for( var _i = 0 ; _i < _subset.length ; _i++ ) _word_max_length = Math.max( _word_max_length, _subset[_i].length );
                        
                        var _terminal_cols = _glob_terminal.cols();
                        var _cols = Math.ceil( _terminal_cols / ( _word_max_length + 1 ) - 2 );
                            _cols = Math.max( 1, _cols );
                            
                        var _row_str = "", _word = "", _append_count = 0, _found = 0, _mask = 0 ;
                        if ( ( ( _output_channel == OUTPUT_TERMINAL && !_filters_on && !_dump )
                                 || _output_channel == OUTPUT_SCRIPT )
                             && _cmd_mode == TERMINAL_CMD_MODE_ACTIVE )
                        {
                            _b_fail = YES, _error_str = "Filters are missing and dumping is off: list won't be processed" ;
                        }
                        else if ( _cmd_mode == TERMINAL_CMD_MODE_PASSIVE )
                        {
                            var _starting_with = /^\*([A-Za-z]{1,})+$/.test( _word_filter );
                            var _including_with = /^\*([A-Za-z]{1,})\*+$/.test( _word_filter );
                            var _ending_with = /^([A-Za-z]{1,})\*+$/.test( _word_filter );
                            var _matching_with = /^([A-Za-z]{1,})+$/.test( _word_filter );

                            var _word_check_fn = null ;
                            _word_filter = _word_filter.replaceAll( "*", "" );

                            if ( _ending_with ) _word_check_fn = function( _w, _substr ) { return ( _w.left( _substr.length ).strcmp( _substr ) ) ? YES : NO ; }
                            else if ( _including_with ) _word_check_fn = function( _w, _substr ) { return _w.includes( _substr ) ? YES : NO ; }
                            else if ( _starting_with ) _word_check_fn = function( _w, _substr ) { return ( _w.right( _substr.length ).strcmp( _substr ) ) ? YES : NO ; }
                            else if ( _matching_with ) _word_check_fn = function( _w, _substr ) { return ( _w.strcmp( _substr ) ) ? YES : NO ; }
                            else _word_check_fn = function( _w, _substr ) { return YES ; }
                             
                            var _length = _subset.length ;
                            for( var _i = 0 ; _i < _length ; _i++ )
                            {
                                  if ( _append_count > 0 && _append_count % _cols == 0 )
                                  {
                                      circles_lib_output( _output_channel, DISPATCH_STANDARD, _row_str, _par_1, _cmd_tag );
                                      _out_text_string += _row_str ;
                                      _append_count = 0 ;
                                      _row_str = "" ;
                                  }
                        
                                  _word = _subset[_i] ;
                                  if ( _filter_existence_mask & 1 && _word.length == _length_filter ) _mask |= 1 ;
                                  if ( _filter_existence_mask & 2 ) _mask |= 2 ;
                                  if ( _filter_existence_mask & 4 && _word_check_fn( _word, _word_filter ) ) _mask |= 4 ;
                        
                                  _word = _subset[_i].rpad( " ", _word_max_length + 1 );
                                  if ( _mask & 4 ) _word = _word.replaceAll( _word_filter, "<yellow>"+_word_filter+"</yellow>" );
                        
                                  if ( _mask == _filter_existence_mask )
                                  {
                                     _row_str += _word ;
                                     _append_count++ ;
                                     _found++ ;
                                  }
                                  _mask = 0 ;
                            }
                        }
                        else if ( ( _filters_on || _dump ) && _output_channel.match_bit_mask( OUTPUT_TERMINAL, OUTPUT_TEXT, OUTPUT_HTML ) )
                        {
                            var _display = ( _filters_on && !_dump ) ? YES : NO ;
                            if ( _dump ) circles_lib_output( _output_channel, DISPATCH_INFO, "Dumping into file " + _params_assoc_array['dump_array'][0], _par_1, _cmd_tag );
                            if ( !_display ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Filters off and dumping on: resulting entries will be exported but not displayed in order to prevent one very long video data queue", _par_1, _cmd_tag );

            		            var JS_FOLDER_COMPONENTS = "code/js/components/" ;
                            var MULTITHREAD_FOLDER = JS_FOLDER_COMPONENTS + "multi.threading/cmds.support/dict.filter/" ;
            		            var JS_FOLDER_SUPPORT = _glob_path_to_support + "code/js/basements/" ;
            		            var JS_FOLDER_CLASSES = JS_FOLDER_SUPPORT + "classes/load/" ;
                            circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Processing the dictionary ..", _par_1, _cmd_tag );
                            $.ajaxSetup( {async:false} );
                            var _code_array = [], _load_failure = 0 ;
                            _code_array.push( $.getScript( MULTITHREAD_FOLDER + "multithread.dict.filter.worker.js" ).responseText );
                            if ( _load_failure )
                            {
																 _b_fail = YES, _error_str = "Fail to load multithread component" ;
														}
														else
														{
	                            // join the above code into one piece and give it to the worker
	                            var _inline_worker_code = _code_array.join( _glob_crlf );
	                            // import this code for worker to process input data
	                            _glob_inline_worker = new inline_worker( _inline_worker_code,
	                                                                     [ MULTITHREAD_FOLDER + "multithread.dict.filter.process.js",
												                                                 JS_FOLDER_SUPPORT + "basics/a-basics/json.lib.js",
	                                                                       JS_FOLDER_SUPPORT + "basics/a-basics/number.js",
	                                                                       JS_FOLDER_SUPPORT + "basics/a-basics/string.js",
	                                                                       JS_FOLDER_SUPPORT + "basics/array.js" ] );
	                            // feed some input vars
	                            _glob_inline_worker.init_vars( { out_channel : _output_channel,
	                                                             param_01 : _par_1,
	                                                             dict : _dict_array.clone(),
	                                                             word_filter : _word_filter,
	                                                             length_filter : _length_filter,
	                                                             page_filter : _page_filter,
	                                                             filter_existence_mask : _filter_existence_mask,
	                                                             cols : _cols,
	                                                             display : _display,
	                                                             copy : _params_assoc_array["copy"],
	                                                             entries_per_page : _entries_per_page,
	                                                             word_max_length : _word_max_length,
	                                                             dump: _params_assoc_array['dump'],
	                                                             end_fn : ( _params_assoc_array['dump'] ) ? circles_terminal_cmd_dict_dump_end_fn.myname() : "",
	                                                             dump_params : ( _params_assoc_array['dump'] ) ? _params_assoc_array['dump_array'] : []
	                                                           } );
	                            // run the worker and output data to the DOM
	                            _glob_inline_worker.run();
														}
                        }
                   }
                   else
                   {
									 			_b_fail = YES, _error_str = "Wrong coordinates to perform crash words list" ;
									 			if ( _crash_words_context == 0 ) _error_str += "\nPlease, put 'crashstring' context into the cmd" ;
									 			if ( _action_id != 3 ) _error_str += "\nAction has been not properly coded" ;
									 }
                   break ;
                   case "concatword":
                   case "keepword":
                   case "removeword":
                   case "flipword":
                   case "reverseword":
                   if ( _action_id == 1 && _opcode.is_one_of( 1, 5 ) )
                   {
                        _b_fail = YES, _error_str = "The range of words to be keep has not been defined" ;
                   }
                   else if ( _action_id == 5 && _general_token_str.length == 0 )
                   {
                        _b_fail = YES, _error_str = "Concatenating input word has not been defined" ;
                   }
                   else if ( ( _opcode.is_one_of( 1.1 ) ) && ( _general_from == UNDET || _general_to == UNDET ) )
                   {
                        _b_fail = YES, _error_str = "Input range bounds have not been defined" ;
                   }
                   else if ( ( _opcode.is_one_of( 3.1, 3.2, 3.3 ) ) && ( _general_token_str.length == 0 ) )
                   {
                        _b_fail = YES, _error_str = "Input range bounds have not been defined" ;
                   }
                   else
                   {
     			 						 circles_lib_output( _output_channel, DISPATCH_INFO, "Multitasking mode: wait for response", _par_1, _cmd_tag );
                       var _options_chunk = [ _caller_id, _opcode, _action_id,
   							 									            _length_from, _length_to,
   							 									            _index_from, _index_to,
   							 									            _first_n_words, _last_n_words,
   																            _start_token_str, _include_token_str, _end_token_str, _concat_token_str,
   																            _glob_original_dict.join( "@" ) ] ;
                       CIRCLESmultithreadingPROCESSdictionary( _options_chunk );
                   }
                   break ;
									 case "prepend":
                   var _alphabet = circles_lib_alphabet_get();
									 var _b_go = circles_lib_word_check( _general_token_str, _alphabet );
									 if ( _b_go.is_one_of( UNDET, CIRCLES_MISSING_INPUT ) )
                   {
 										    _b_fail = YES, _error_str = "The input word or the current alphabet are empty or undefined" ;
                   }
                   else if ( _b_go )
									 {
									 			if ( _glob_original_dict.includes( _general_token_str ) )
									 			{
													  _b_fail = YES, _error_str = "This dictionary already includes the word '"+_general_token_str+"'" ;
												}
												else
												{
													  var _old_size = circles_lib_count_dict();
													  var _a = [ _general_token_str ];
													  _glob_original_dict = _a.concat( _glob_original_dict );
											 			var _new_size = circles_lib_count_dict();
											 			if ( _old_size == _new_size - 1 )
											 			{
											 					 var _msg = "Word '"+_general_token_str+"' has been appended with success" ;
										 						 circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
														}
														else
														{
															  _b_fail = YES, _error_str = "Can't append the word '"+_general_token_str+"': memory failure" ;
														}
												}
									 }
									 else
									 {
											  _b_fail = YES, _error_str = "The candidate word '"+_general_token_str+"' to append does not match the current alphabet: "+_alphabet.join(",")+"" ;
									 }
                   break ;
                   case "release":
                   circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                   break ;
									 case "remove":
                   if ( _crash_words_context && _action_id == 2 && _crash_word.length > 0 )
                   {
                        var _alphabet = circles_lib_alphabet_get();
												var _b_go = circles_lib_word_check( _crash_word, _alphabet );
												if ( _b_go )
												{
													  var _packed = _dictionary_init_settings_array['crash_words_packed'] ;
														var _current_crash_words_array = ( _packed.includes( "|" ) ) ? _packed.split( "|" ) : ( ( _packed.length > 0 ) ? [ _packed ] : [] );
		                        if ( !_current_crash_words_array.includes( _crash_word ) )
		                        {
																 _b_fail = YES, _error_str = "The crash word '"+_crash_word+"' is not in, thus can't be removed" ;
														}
														else
														{
																_current_crash_words_array.delete_entry( _crash_word );
																_dictionary_init_settings_array['crash_words_packed'] = _current_crash_words_array.join( "|" );
									 						  circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Crash word '"+_crash_word+"' has been removed", _par_1, _cmd_tag );
														}
												}
												else
												{
														_b_fail = YES, _error_str = "The candidate crash word '"+_crash_word+"' does not match the current alphabet" ;
												}
                   }
                   else
                   {
									 			_b_fail = YES, _error_str = "Wrong coordinates to perform crash word removal" ;
									 			if ( _crash_words_context == 0 ) _error_str += _glob_crlf + "Please, put 'crashstring' context into the cmd" ;
									 			if ( _action_id != 2 ) _error_str += _glob_crlf + "Action has been not properly coded" ;
									 			if ( _crash_word.length == 0 ) _error_str += _glob_crlf + "Crash word is empty" ;
									 }
                   break ;
									 case "sortbyval":
									 if ( circles_lib_count_dict() > 0 )
                   {
    			 						 circles_lib_output( _output_channel, DISPATCH_INFO, "Sorting the dictionary by value ..", _par_1, _cmd_tag );
     			 						 circles_lib_output( _output_channel, DISPATCH_INFO, "Multitasking mode: wait for response", _par_1, _cmd_tag );
                       circles_lib_dict_run( 'Dictionary',0.2,null,NO,YES,_output_channel);
                   }
                   else
                   {
                       _b_fail = YES, _error_str = "Can't sort by value: the current dictionary is empty" ;
                   }
 									 break ; 
									 case "sortbylen":
									 if ( circles_lib_count_dict() > 0 )
                   {
    			 						 circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Sorting the dictionary by length", _par_1, _cmd_tag );
     			 						 circles_lib_output( _output_channel, DISPATCH_INFO, "Multitasking mode: wait for response", _par_1, _cmd_tag );
     									 circles_lib_dict_run('Dictionary',0.3,null,NO,YES,_output_channel);
                   }
                   else
                   {
                       _b_fail = YES, _error_str = "Can't sort by length: the current dictionary is empty" ;
                   }
									 break ;
									 case "reverse":
									 if ( circles_lib_count_dict() > 0 )
                   {
    									 _glob_original_dict.reverse();
     								   circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Reversing the dictionary", _par_1, _cmd_tag );
                   }
                   else
                   {
                       _b_fail = YES, _error_str = "Can't reverse: the current dictionary is empty" ;
                   }
									 break ;
									 case "save":
									 if ( circles_lib_count_dict() > 0 ) circles_lib_dict_save();
                   else
                   {
                       _b_fail = YES, _error_str = "Can't save: the current dictionary is empty" ;
                   }
									 break ;
									 case "size":
									 var _size = circles_lib_count_dict();
                   var _pages = Math.floor( _size / _entries_per_page );
                   if ( ( _size % _entries_per_page ) > 0 ) _pages++ ;
                   
                   var _msg = "Current dictionary size: " + _size + " word" + ( ( _size != 1 ) ? "s" : "" );
                       _msg += _glob_crlf + "Estimated pages length : " + _pages + " (each including " + _entries_per_page + " entries)" ;
                       if ( _glob_verbose && _glob_terminal_echo_flag ) _msg += _glob_crlf + "Type '"+_cmd_tag+" /h' for syntax to display pages contents in this console" ;

 								   circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
									 break ;
					         default: break ;
							}
				 }
     }
     else
     {
		 		 _b_fail = YES, _error_str = "Missing input params" ;
		 }

     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function circles_terminal_cmd_dict_dump_end_fn()
{
    var _dump_params = arguments[0] ;
    var _tmp_array = [] ;
    var _ret_chunk = circles_lib_dump_data_to_format( _glob_storage['words'], _dump_params[0], "cols:4", "savepix" );
		var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
		var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation";
		if ( _ret_id == 0 )
  	{
				_b_fail = YES, _error_str = _ret_msg ;
		}
		else circles_lib_output( OUTPUT_TERMINAL, DISPATCH_SUCCESS, _ret_msg, 0 );
}