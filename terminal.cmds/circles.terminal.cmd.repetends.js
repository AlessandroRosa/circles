function circles_terminal_cmd_repetends()
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
     var _sd_n = circles_lib_count_seeds();
     var _help = 0 ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _termination = "" ;
     var _repetend = "" ;
     var _counter = 0 ;
     var _repetend_length = 0 ;
     var _append_str = "", _replace_str = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array["copy"] = NO ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "copy", "html", "set", "remove", "flush", "list", "suggest", "release", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.stricmp( "copy" ) ) _params_assoc_array["copy"] = YES ;
            else if ( _p.is_one_of_i( "set", "remove", "flush", "list", "suggest", "release" ) ) _params_assoc_array['action'] = _p ;
            else
            {
                switch( _params_assoc_array['action'].toLowerCase() )
                {
                    case "remove": if ( _counter == 0 ) _termination = _p.trim(); break ;
                    case "set":
                    if ( _counter == 0 ) _termination = _p.trim();
                    else if ( _counter == 1 ) _repetend = _p.trim();
                    break ;
                    case "suggest": if ( _counter == 0 ) _repetend_length = safe_int( _p.trim(), 0 ); break ;
                    default: _b_fail = YES _error_str = "Unknown parameter '"+_p+"'" ; break ;
                }
                _counter++ ;
            }
         }
         
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
         else if ( !_b_fail )
         {
              if ( !_glob_method.is_one_of( METHOD_ALGEBRAIC )
                   && !_glob_process.is_one_of( PROCESS_RANDOM ) )
              {
                   _b_fail = YES, _error_str = "Repetends can be managed when method is 'algebraic' and process is not 'random'" ;
              }
              else if ( _sd_n > 0 )
              {
                   var _alphabet = [], ITEM, _symbol ;
                   for( var i = 0 ; i < _sd_n ; i++ )
                   {
                        ITEM = _glob_seeds_array[i] ;
                        _symbol = is_item_obj( ITEM ) ? ITEM.symbol : "" ;
                        if ( _symbol.length > 0 ) _alphabet.push( _symbol );
                   }
                   
                   var _action = _params_assoc_array['action'].toLowerCase();
                   switch( _action )
                   {
                        case "flush":
                        var _entries_n = circles_lib_repetends_count(), _question_counter = 1 ;
                        var _prompt_question = "Are you sure to flush the whole repetend list away ?" ;
                        var flush_fn = function()
                        {
                           _glob_repetends_array.flush_associative();
                           var _entries_n = circles_lib_repetends_count();
                           var _b_go = ( _entries_n == 0 ) ? YES : NO ;
                           var _msg = _b_go ? "The repetends list has been flushed away" : "Memory failure: can't flush the repetends list away" ;
                           var _msg_type = _b_go ? DISPATCH_SUCCESS : DISPATCH_ERROR ;
                           circles_lib_output( _output_channel, _msg_type, _msg, _par_1, _cmd_tag );
                        }

                        if ( _entries_n > 0 )
                        {
									     		  var _params_array = [] ;
											     	  	_params_array['prepromptquestion'] = null ;
									             	_params_array['promptquestion'] = _prompt_question ;
									             	_params_array['yes_fn'] = function()
																 													{
													                                    flush_fn();
																										          if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
																										  				{
																																	_glob_terminal_change = YES ;
																											            circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
																															}
																													}
							             	_params_array['ifquestiondisabled_fn'] = function() { circles_lib_terminal_close( _output_channel ); }
							if ( !_glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
							else circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                         }
                         else circles_lib_output( _output_channel, DISPATCH_WARNING, "The repetends list is already empty", _par_1, _cmd_tag );
                         break ;
                         case "list":
                         var _out_text = circles_terminal_cmd_repetends_list( _output_channel );
                         if ( _params_assoc_array['dump'] )
                         {
                              var _ret_chunk = circles_lib_dump_data_to_format( _out_text, "circles.repetends.list.txt" );
                              var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                              var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Memory failure - Err. 0.2" ;
                              if ( _ret_id == 0 ) circles_lib_output( _output_channel, DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                         }
                         break ;
                         case "release":
                         circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                         break ;
                         case "remove":
                         var _entries_n = circles_lib_repetends_count();
                         var _prompt_question = "Are you sure to remove this repetend ?" ;
                         var removal_fn = function( _termination )
                         {
                             var _old_counter = circles_lib_repetends_count();
                             _glob_repetends_array.remove_key( _termination );
                             var _new_counter = circles_lib_repetends_count();
                             var _b_go = ( _new_counter < _old_counter ) ? YES : NO ;
                             var _msg_type = _b_go ? DISPATCH_SUCCESS : DISPATCH_ERROR ;
                             var _msg = _b_go ? "Repetend with termination '"+_termination+"' has been removed with success" : "Memory failure: can't find termination '"+_termination+"' for removal" ;
                             circles_lib_output( _output_channel, _msg_type, _msg, _par_1, _cmd_tag );
                             if ( _new_counter == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "The repetends list is empty", _par_1, _cmd_tag );
                         }

                         if ( _entries_n > 0 )
                         {
									     		   var _params_array = [] ;
									     	  	 _params_array['prepromptquestion'] = null ;
									           _params_array['promptquestion'] = _prompt_question ;
									           _params_array['yes_fn'] = function()
														 													 {
													                                 var _b_found = ( _glob_repetends_array[ _termination ] == null ) ? NO : YES ;
													                                 if ( _b_found )
																													 {
																															removal_fn( _termination );
																										          if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
																										  				{
																																	_glob_terminal_change = YES ;
																											            circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
																															}
																													 }
													                                 else
													                                 {
													                                    var _remove_word_err = "Can't remove the repetend: " ;
													                                    switch( _b_found )
													                                    {
													                                        case -1:
													                                        circles_lib_output( _output_channel, DISPATCH_WARNING, _remove_word_err + "the repetends list is empty", _par_1, _cmd_tag );
													                                        break ;
													                                        case -2:
													                                        circles_lib_output( _output_channel, DISPATCH_WARNING, _remove_word_err + "the input symbol is empty", _par_1, _cmd_tag );
													                                        break ;
													                                        case -3:
													                                        circles_lib_output( _output_channel, DISPATCH_WARNING, _remove_word_err + "parsing error", _par_1, _cmd_tag );
													                                        break ;
														          				                    default: break ;
													                                    }
													                                 }
																											 }
									             	_params_array['ifquestiondisabled_fn'] = function() { removal_fn( _termination ); }
								if ( !_glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
								else circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                            }
                            else circles_lib_output( _output_channel, DISPATCH_WARNING, "The repetends list is already empty", _par_1, _cmd_tag );
                            break ;
                            case "set":
                            if ( _repetend.length > 0 )
                            {
                                    var _ret = circles_lib_repetends_check_syntax( _repetend, "", YES );
                                    if ( _ret == 1 )
                                    {
                                        var _old_counter = circles_lib_repetends_count();
                                        _glob_repetends_array[ _termination ] = _repetend ;
                                        if ( _params_assoc_array["copy"] && !_glob_storage['words'].includes( _repetend ) )
                                        {
                                             _glob_storage['words'].push( _repetend );
                                             circles_lib_output( _output_channel, DISPATCH_INFO, "Repetend '"+_repetend+"' has been copied into the data storage space with success", _par_1, _cmd_tag );
                                        }

                                        var _new_counter = circles_lib_repetends_count();
                                        var _b_go = ( _new_counter >= _old_counter ) ? YES : NO ;
                                        var _msg_type = _b_go ? DISPATCH_SUCCESS : DISPATCH_ERROR ;
                                        var _msg = _b_go ? "Repetend '"+_repetend+"' has been set up with success" : "Memory failure: can't set the repetend '"+_repetend+"'" ;
                                        circles_lib_output( _output_channel, _msg_type, _msg, _par_1, _cmd_tag );
                                        if ( _b_go ) circles_lib_repetends_resolve_array();

										if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
										{
											_glob_terminal_change = YES ;
										    circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
										}
                                    }
                                    else if ( _glob_terminal_errors_switch )
                                    {
                                        var _add_error_str = "Can't set this repetend: " ;
                                        switch( _ret )
                                        {
                                            case -4:
                                            circles_lib_output( _output_channel, DISPATCH_ERROR, _add_error_str + "syntax error", _par_1, _cmd_tag );
                                            break ;
                                            case -3:
                                            circles_lib_output( _output_channel, DISPATCH_ERROR, _add_error_str + "the input repetend is an empty string", _par_1, _cmd_tag );
                                            break ;
                                            case -2:
                                            circles_lib_output( _output_channel, DISPATCH_ERROR, _add_error_str + "the alphabet is empty, maybe the disks list is either", _par_1, _cmd_tag );
                                            break ;
                                            case -1:
                                            circles_lib_output( _output_channel, DISPATCH_ERROR, _add_error_str + _ERR_33_01, _par_1, _cmd_tag );
                                            break ;
                                            case 0:
                                            break ;
         				                    default: break ;
                                        }

                                        _glob_terminal_critical_halt = YES ;
                                    }
                            }
                            else circles_lib_output( _output_channel, DISPATCH_ERROR, "The input repetend is an empty string", _par_1, _cmd_tag );
                            break ;
                            case "suggest":
                            _repetend_length = safe_int( _repetend_length, 0 );
                            if ( _repetend_length == 0 )
                                 circles_lib_output( _output_channel, DISPATCH_ERROR, "Length shall be a positive integer number", _par_1, _cmd_tag );
                            else if ( _alphabet.length == 0 )
                                 circles_lib_output( _output_channel, DISPATCH_ERROR, _ERR_33_01, _par_1, _cmd_tag );
                            else
                            {
                                _glob_repetends_array.flush();
                                for( var _a = 0 ; _a < _alphabet.length ; _a++ ) _glob_repetends_array[ _alphabet[ _a ] ] = "["+_alphabet[_a]+"*"+_repetend_length+"]" ;
                                circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Repetends list has been filled with suggestions", _par_1, _cmd_tag );
                            }
                            break ;
			                default: break ;
                      }
              }
              else { _b_fail = YES, _error_str = _ERR_33_01 ; }
         }	
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }

     if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function circles_terminal_cmd_repetends_list( _output_channel, _par_1 )
{
     _par_1 = safe_string( _par_1, "" );
     var _counter = circles_lib_repetends_count();
     var _out_text = "" ;
     if ( _counter > 0 )
     {
          var _html_code = "<table>" ;
              _html_code += "<tr><td STYLE=\"color:lightblue;\">Repetend</td><td WIDTH=\"10\"></td><td STYLE=\"color:snow;\">Words terminating with</td></tr>" ;
          var _symbol, _repetend, _row, _keys = _glob_repetends_array.keys_associative();
          for( var _k = 0 ; _k < _keys.length ; _k++ )
          {
              _html_code += "<tr>" ;
              _html_code += "<td STYLE=\"color:lightblue;\">"+_glob_repetends_array[ _keys[_k] ]+"</td>" ;
              _html_code += "<td WIDTH=\"10\"></td>" ;
              _html_code += "<td STYLE=\"color:snow;\">"+_keys[_k]+"</td>" ;
              _html_code += "</tr>" ;
              _html_code += "<tr><td HEIGHT=\"4\"></td></tr>" ;
          }

          _html_code += "</table>" ;
          circles_lib_terminal_html_display( _glob_terminal, _html_code );
     }
     else if ( _counter == 0 )
     {
         _out_text = "The repetends list is empty" ;
         circles_lib_output( _output_channel, DISPATCH_WARNING, _out_text, _par_1, _cmd_tag );
     }
     
     return _out_text ;
}