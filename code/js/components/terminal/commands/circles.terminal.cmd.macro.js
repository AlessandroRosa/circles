var _glob_macros_array = [];
var _glob_macros_current_sel = "" ;

function circles_terminal_cmd_macro()
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
     var _counter = 0 ;
     var _fn_ret_val = null ;
     var _input_array = [] ;

     var _params_assoc_array = [];
     _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
     _params_assoc_array['help'] = NO ;
     _params_assoc_array['keywords'] = NO ;
     _params_assoc_array['action'] = "" ;
     _params_assoc_array['input'] = [] ;
     _params_assoc_array['dump'] = NO ;
     _params_assoc_array['dump_array'] = null ;
     _params_assoc_array['dump_operator_index'] = UNDET ;

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "arrange", "exec", "flush", "init", "kill", "list", "merge", "release",
                                            "rec", "remove", "save", "show", "select", "unselect", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
				 var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
				 _params_assoc_array['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
				 _params_assoc_array['dump_operator_index'] = _dump_operator_index ;
				 _params_assoc_array['dump_array'] = [];
				
				 // gather all dump parameters into one array
         if ( _params_assoc_array['dump'] )
         {
    				 for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
    				 if ( _params_array[_i].trim().length > 0 ) _params_assoc_array['dump_array'].push( _params_array[_i] );
         }
         
         // distribute all input values into arrays of categories
             _params_assoc_array['macrolabel'] = [];
             _params_assoc_array['entries'] = [];
             _params_assoc_array['params'] = [];
             _params_assoc_array['indexes'] = [];
             _params_assoc_array['labels'] = [];
         var _p,  _b_cmd_open = NO ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
              _p = _params_array[_i];
              if ( is_array( _glob_macros_array[ "MACRO." + _p ] ) ) _params_assoc_array['macrolabel'].push( _p );
              else if ( _local_cmds_params_array.includes( _p ) ) _params_assoc_array['params'].push( _p );
              else if ( _p.isNumber() ) _params_assoc_array['indexes'].push( _p );
              else if ( _p.isAlphanumeric() ) _params_assoc_array['labels'].push( _p );
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p.toLowerCase();
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
             var _action = _params_assoc_array['action'] ;
             switch( _action )
             {
                  case "release":
                  circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
                  if ( _params_assoc_array['dump_array'].length > 0 )
                  _params_assoc_array['entries'].push( _params_assoc_array['dump_array'].join( " " ) );
                  else if ( _params_assoc_array['params'].length == 0 )
                  {
                     _b_fail = YES, _error_str = "No action has been input" ;
                  }
                  else if ( _params_assoc_array['params'].length != 1 )
                  {
                     _b_fail = YES, _error_str = "Just one action per cmd call can be input" ;
                  }
                  else
                  {
          					  switch( _params_assoc_array['params'][0] )
          					  {
          										case "arrange":
                              var _macro_label = ( _params_assoc_array['macrolabel'][0] != null ) ? _params_assoc_array['macrolabel'][0] : "" ;
          										var _macro_chunk = circles_terminal_cmd_macro_get( _macro_label );
                              if ( _macro_label.length == 0 )
                              {
          												 _b_fail = YES, _error_str = "Can't arrange macro: the input label is empty" ;
                              }
            									else if ( !circles_terminal_cmd_macro_exists( _macro_label ) )
          										{
          												 _b_fail = YES, _error_str = "Can't arrange: the macro '"+_macro_label+"' does not exist in the archive" ;
          										}
          										else if ( _params_assoc_array['params'].length == 0 )
          										{
          												_b_fail = YES, _error_str = "Can't arrange cmds: no input indexes" ;
          										}
          										else if ( _params_assoc_array['indexes'].length > _macro_chunk.length )
          										{
          												_b_fail = YES, _error_str = "Can't arrange cmds: the amount of indexes shall not exceed the number of cmds in the macro '"+_macro_label_array+"' (currently, it's "+_macro_chunk.length+")" ;
          										}
          										else if ( _params_assoc_array['indexes'].has_duplicates() )
          										{
          												_b_fail = YES, _error_str = "Can't arrange cmds: there are duplicate input indexes. Each index must be mentioned once" ;
          										}
          										else
          										{
                                  var _passed_1 = _params_assoc_array['indexes'].test( function( _x ) { _x == safe_int( _x, 0 ) ? YES : NO ; } );
                                  var _passed_2 = _params_assoc_array['indexes'].test( function( _x ) { _x-- ; return ( _x < 0 || _x > _macro_chunk.length ) ? 0 : 1 ; } );
                                  if ( !_passed_1 )
                                  {
          											 			_b_fail = YES, _error_str = "Can't arrange cmds: at least one index is not a number" ;
                                  }
                                  else if ( !_passed_2 )
                                  {
          											 			_b_fail = YES, _error_str = "Can't arrange cmds: at least one index is out of range" ;
                                  }
                                  else
                                  {
                                      var _i ;
              												for( _i = 0 ; _i < _params_assoc_array['indexes'].length ; _i++ )
              												{
              														 var _candidate = safe_int( _params_assoc_array['indexes'][_i] + "", 0 );
              													 			 _candidate-- ; // shift to values starting from zero
              														 _input_array[_i] = _candidate ;
              												}

          														// record the full list of indexes of cmds inside the macro
                                      var _record_array = [];
          														for( _i = 0 ; _i < _macro_chunk.length ; _i++ ) _record_array.push( _i );

          														var _new_macro = [] ;
          														// assemble the input indexes
                                      for( _i = 0 ; _i < _input_array.length ; _i++ )
          														{
          																_new_macro.push( _macro_chunk[ _input_array[ _i ] ] );
          																_record_array.delete_entry( _input_array[ _i ] );
          														}

          														// copy the rest of items as referenced in the records array
          														if ( _record_array != null && _record_array != UNDEF && is_array( _record_array ) )
          														{
          																for( _i = 0 ; _i < _record_array.length ; _i++ )
          																_new_macro.push( _macro_chunk[ _record_array[ _i ] ] );

          																_glob_macros_array[ "MACRO." + _macro_label ].flush();
          																_glob_macros_array[ "MACRO." + _macro_label ] = _new_macro.clone();

          			 												  circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Macro '"+_macro_label+"' has been arranged with success", _par_1, _cmd_tag );
          														}
                                  }
          										}
          										break ;
          										case "exec":
                              var _macro_label = ( _params_assoc_array['macrolabel'][0] != null ) ? _params_assoc_array['macrolabel'][0] : "" ;
                              if ( _macro_label.length == 0 )
                              {
          												 _b_fail = YES, _error_str = "Can't exec macro: the input label is empty" ;
                              }
            									else if ( !circles_terminal_cmd_macro_exists( _macro_label ) )
          										{
          												 _b_fail = YES, _error_str = "Can't execute the macro '"+_macro_label+"': it does not exist in the archive" ;
          										}
          										else
          										{
           											  var _macro_array = circles_terminal_cmd_macro_get( _macro_label );
          											  if ( _macro_array == null || !is_array( _macro_array ) )
          												circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Macro '"+_macro_label+"' does not appear to be valid", _par_1, _cmd_tag );
          												else if ( _macro_array.length == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Macro '"+_macro_label+"' is empty", _par_1, _cmd_tag );
          												else
          												{
          													 circles_lib_output( _output_channel, DISPATCH_STANDARD, "Executing macro '"+_macro_label+"'", _par_1, _cmd_tag );
          													 var _macro_cmd = "", _counter = 1 ;
          													 for( var _i = 0 ; _i < _macro_array.length ; _i++ )
          													 {
          												 			_macro_cmd = _macro_array[_i] ;
          												 			_macro_cmd = _macro_cmd == null ? "" : _macro_cmd.trim();
          												 			if ( _macro_cmd.length > 0 ) circles_lib_terminal_interpreter( _macro_cmd, _glob_terminal, _output_channel );
          													 }
          												}
          										}
          										break ;
          										case "flush":
          										var _n_macros = circles_terminal_cmd_macro_count();
          										if ( _n_macros == 0 )
          										{
          											 _b_fail = YES, _error_str = "Can't flush: no macros recorded" ;
          										}
          										else
          										{
                             		  var _params_array = [] ;
          										     	  _params_array['prepromptquestion'] = null ;
          	                   		 		_params_array['promptquestion'] = "Confirm to flush all macros away ?" ;
          	                   		 		_params_array['yes_fn'] = function() { _flush_macros(); }
          	                   		 		_params_array['ifquestiondisabled_fn'] = function() { _flush_macros(); }
          	                   		circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
          										}
          										break ;
          										case "init":
                              // init can't pick up the macro label from _params_assoc_array['macrolabel'], because
                              // the input macro label supposed to be new and then not be stored yet
                              var _macro_label = ( _params_assoc_array['labels'][0] != null ) ? _params_assoc_array['labels'][0] : "" ;
          										if ( _params_assoc_array['macrolabel'].length > 0 )
                              {
                                   _b_fail = YES, _error_str = "Can't init macro: the input label '"+_params_assoc_array['macrolabel'][0]+"' already exists" ;
                              }
          										else if ( _macro_label.length == 0 )
                              {
          												 // if it's empty, then the candidate macro label could have been put into _params_assoc_array['macrolabel']
                                   _b_fail = YES, _error_str = "Can't init macro: the input label is empty" ;
                              }
            									else if ( _macro_label.length > 0 )
          										{
          										    var regularEXPR = new RegExp( "^[A-Za-z0-9]{1,}$" );
          										    if ( !regularEXPR.test( _macro_label ) )
          										    {
          														 _b_fail = YES, _error_str = "Can't initialize the macro: the label includes invalid chars (only alphanumeric chars allowed)" ;
          												}
          												else if ( circles_terminal_cmd_macro_exists( _macro_label ) )
          												{
          														 _b_fail = YES, _error_str = "Can't initialize the macro '"+_macro_label+"': the label already exists" ;
          												}
          												else
          												{
          														 _glob_macros_array[ "MACRO." + _macro_label ] = [] ;
          														 if ( is_array( _glob_macros_array[ "MACRO." + _macro_label ] ) )
          																 circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Macro '"+_macro_label+"' has been initialized with success!", _par_1, _cmd_tag );
          														 else
          														 {
          														 		 _b_fail = YES, _error_str = "Memory failure: can't initialize macro '"+_macro_label+"'" ;
          														 }
          												}
          										}
          										break ;
          										case "kill":
                              var _macro_label = ( _params_assoc_array['macrolabel'][0] != null ) ? _params_assoc_array['macrolabel'][0] : "" ;
                              if ( _macro_label.length == 0 )
                              {
          												 _b_fail = YES, _error_str = "Can't kill macro: the input label is empty" ;
                              }
            									else if ( !circles_terminal_cmd_macro_exists( _macro_label ) )
          										{
          												 _b_fail = YES, _error_str = "Can't kill the macro '"+_macro_label+"': it does not exist in the archive" ;
          										}
          										else
          										{
                             		  var _params_array = [] ;
          										     	  _params_array['prepromptquestion'] = null ;
          	                   		 		_params_array['promptquestion'] = "Confirm to delete the macro '"+_macro_label+"' ?" ;
          	                   		 		_params_array['yes_fn'] = function() { _kill_macro( _macro_label ); }
          	                   		 		_params_array['ifquestiondisabled_fn'] = function() { _kill_macro( _macro_label ); }
          	                   		circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
          										}
          										break ;
          										case "list":
          										var _n_macros = safe_int( circles_terminal_cmd_macro_count(), 0 );
                              var _html = _params_assoc_array['html'] != null ? YES : NO ;
          										if ( _n_macros == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "No macros recorded in the archive", _par_1, _cmd_tag );
          										else
          										{
          									 			 var _macros_list_array = [];
                                   var _macro_label = "", _macro_chunk, _macro_n_cmds = 0, _out_text = "" ;
          												 for( var _key in _glob_macros_array )
          												 if ( _key.includes( "MACRO." ) )
                                   {
                                        _macro_label = _key.replaceAll( "MACRO.", "" );
                                        _macro_chunk = _glob_macros_array[ _key ] ;
                                        _macro_n_cmds = _macro_chunk == null ? UNDET : _macro_chunk.length ;
                                        _macros_list_array.push( [ _macro_label, _macro_n_cmds ] );
                                   }

            											 circles_lib_output( _output_channel, DISPATCH_STANDARD, _n_macros + " macro" + ( ( _n_macros != 1 ) ? "s" : "" ) + " recorded", _par_1, _cmd_tag );
                                   var _macro_list_chunk = null, _out_type, _row ;
          	  										 for( var _i = 0 ; _i < _macros_list_array.length ; _i++ )
                                   {
                                        _macro_list_chunk = _macros_list_array[_i] ;
                                        if ( _macro_list_chunk == null )
                                        circles_lib_output( _output_channel, DISPATCH_ERROR, ( _i + 1 ) + ") null macro", _par_1, _cmd_tag );
                                        else
                                        {
                                            _macro_label = _macro_list_chunk[0] + "" ;
                                            _macro_n_cmds = safe_int( _macro_list_chunk[1], 0 );
                                            _out_type = ( _macro_label.length == 0 || _macro_n_cmds == 0 ) ? DISPATCH_WARNING : DISPATCH_INFO ;
                                            if ( _macro_label.length == 0 ) _macro_label = "(Unknown label)" ;
                                            _macro_label = _macro_label.rpad( " ", 18 - _macro_label.length );
                                            _macro_n_cmds = ( _macro_n_cmds == 0 ) ? "No cmds" : ( _macro_n_cmds + " command" + ( ( _macro_n_cmds == 1 ) ? "" : "s" ) );
                                            _row = ( _i + 1 ) + ") " + _macro_label + " " + _macro_n_cmds ;
                                            _out_text += _row ;
                                            circles_lib_output( _output_channel, _out_type, _row );
                                        }
                                   }

                                  if ( _html ) circles_lib_terminal_color_decode_htmltext( "<gray>"+_out_text+"</gray>", 'macro', 'right', 'top' );
                                  if ( _params_assoc_array['dump'] )
                                  {
          		 												 _params_assoc_array['dump_array'] = _params_assoc_array['dump_array'][0] == null ? _params_assoc_array['dump_array'][0] : "circles.macros.list.txt" ;
                                       var _ret_chunk = circles_lib_dump_data_to_format( _out_text, _params_assoc_array['dump_array'] );
          														 var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
          														 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation";
          														 if ( _ret_id == 0 )
          														 {
          														 		_b_fail = YES, _error_str = _ret_msg ;
          														 }
          														 else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                                  }
          										}
          										break ;
          										case "merge":
                              var _macro_label = ( _params_assoc_array['macrolabel'][0] != null ) ? _params_assoc_array['macrolabel'][0] : "" ;
                              var _candidate_label = ( _params_assoc_array['labels'][0] != null ) ? _params_assoc_array['labels'][0] : "" ;
          						 			  var _resulting_macro_label = ( _macro_label ) ? _macro_label : _candidate_label ;
                              if ( _resulting_macro_label.length == 0 )
                              {
          												 _b_fail = YES, _error_str = "Can't merge: no resulting macro label has been input" ;
          										}
                              else if ( _params_assoc_array['dump_array'].length == 0 )
                              {
          												 _b_fail = YES, _error_str = "Can't merge: no macro labels have been input for merging" ;
                              }
                              else if ( _params_assoc_array['dump_array'].length == 1 )
                              {
          												 _b_fail = YES, _error_str = "Can't merge: macro label shall be at least two" ;
                              }
          										else
          										{
          												 // count inputs
                                   _input_array = _params_assoc_array['dump_array'].clone();
          												 var _candidate_macros = [], _candidate_additionals_cmds = [];
                                   var _candidate_label = "", _i ;

          												 for( _i = 0 ; _i < _input_array.length ; _i++ )
          												 {
          												 			_candidate_label = _input_array[_i] ;
          												 			if ( circles_terminal_cmd_macro_exists( _candidate_label ) ) _candidate_macros.push( _candidate_label );
          												 			else _candidate_additionals_cmds.push( _candidate_label.toLowerCase() );
          												 }

          												 			var _other_macros_array = _candidate_macros ;
          			 		                    var _prompt_question = "" ;
                                        var _resulting_macro_exists = circles_terminal_cmd_macro_exists( _resulting_macro_label );
                                        if ( _resulting_macro_exists ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: macro '"+_resulting_macro_label+"' already exists and its contents will be erased after merging", _par_1, _cmd_tag );
                                        _prompt_question += "Confirm to merge the input macros into '"+_resulting_macro_label+"' ?" ;

          														  circles_lib_output( _output_channel, DISPATCH_INFO, "Next actions scenario", _par_1, _cmd_tag );
          															circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "1. macros (<yellow>"+_other_macros_array.join(",")+"</yellow>) will be merged into '<yellow>"+_resulting_macro_label+"</yellow>'", _par_1, _cmd_tag );
          															if ( _candidate_additionals_cmds.includes( "destroy" ) )
          															circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "2. macros (<yellow>"+_other_macros_array.join(",")+"</yellow>) will be destroyed after merging", _par_1, _cmd_tag );
                                        circles_lib_output( _output_channel, DISPATCH_INFO, _glob_crlf, _par_1, _cmd_tag );

          												 			var _macro_merge = function()
          												 			{
          																	var _new_macro = [], _flush_macro_label, _still_alive ;
          														 			var _failures = 0, _old_length, _new_length, _macro, _i, _m ;
                                            circles_lib_output( _output_channel, DISPATCH_INFO, _glob_crlf, _par_1, _cmd_tag );
          																	for( _i = 0 ; _i < _candidate_macros.length ; _i++ )
          														 			{
          																			circles_lib_output( _output_channel, DISPATCH_INFO, "Trying to merge '" + _candidate_macros[ _i ] + "' into '"+_resulting_macro_label+"'" , _par_1, _cmd_tag );
          																			if ( circles_terminal_cmd_macro_exists( _candidate_macros[ _i ] ) )
          																			{
          																				   _macro = circles_terminal_cmd_macro_get( _candidate_macros[ _i ] );
          																					 if ( _macro.length > 0 )
          																					 {
          					 																	  _old_length = _new_macro.length ;
          																							_new_macro = _new_macro.concat( _macro );
          					 																	  _new_length = _new_macro.length ;
          										                          if ( _old_length < _new_length ) circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<greenyellow>Macro '" + _candidate_macros[ _i ] + "' has been merged with success</greenyellow>", _par_1, _cmd_tag );
          																							else
          																							{
          																									_failures++ ;
          																									circles_lib_output( _output_channel, DISPATCH_ERROR, "Fail to merge '" + _candidate_macros[ _i ] + "'", _par_1, _cmd_tag );
          																							}
          																					 }
          						                               else
          																					 circles_lib_output( _output_channel, DISPATCH_INFO, "No merge for macro '" + _candidate_macros[ _i ]+"' : it's empty", _par_1, _cmd_tag );
          																			}
          					                            else circles_lib_output( _output_channel, DISPATCH_WARNING, "Macro '" + _candidate_macros[ _i ] + "' does not exist", _par_1, _cmd_tag );
          																	}

          																	if ( _candidate_additionals_cmds.length > 0 )
          																	{
          																			 for( _i = 0 ; _i < _candidate_additionals_cmds.length ; _i++ )
          																			 {
          																			 			switch( _candidate_additionals_cmds[_i] )
          																			 			{
          																								case "destroy": // flush all other input macros
          																							  circles_lib_output( _output_channel, DISPATCH_INFO, "\nDestroy param selected: attempting to remove merged macros", _par_1, _cmd_tag );
          																								for( _m = 0 ; _m < _candidate_macros.length ; _m++ )
          																								{
          																										 _flush_macro_label = _candidate_macros[_m] ;
          																										 if ( circles_terminal_cmd_macro_exists( _flush_macro_label ) )
          																										 _glob_macros_array.remove_key(  "MACRO." + _flush_macro_label );

          																										 _still_alive = circles_terminal_cmd_macro_exists( _flush_macro_label );
           																										 if ( !_still_alive )
          																										 circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Macro '" + _flush_macro_label + "' removed with success", _par_1, _cmd_tag );
          																										 else if ( _still_alive )
          																										 circles_lib_output( _output_channel, DISPATCH_WARNING, "Macro '" + _flush_macro_label + "' has not been removed", _par_1, _cmd_tag );
          																								}
          																								break ;
																									        default: break ;
          																						}
          																			 }
          																	}

          																	_new_macro = _new_macro.unique();
          																	var _out_type = 0 ;
          																	var _out_text = "" ;
          																	if ( _new_macro.length > 0 && _failures == 0 )
          																	{
          																			_out_text = "\nAll macros have been merged into '"+_resulting_macro_label+"' with success" ;
          																			_out_type = DISPATCH_SUCCESS ;
          																	}
          																	else if ( _new_macro.length > 0 && _failures != 0 )
          																	{
          																			_out_text = "\nNot all macros have been merged into '"+_resulting_macro_label+"' with success" ;
          																			_out_type = DISPATCH_WARNING ;
          																	}
          																	else
          																	{
          																			_out_text = "\nThe resulting macro '"+_resulting_macro_label+"' is empty" ;
          																			_out_type = DISPATCH_ERROR ;
          																	}

          		                              circles_terminal_cmd_macro_set( _resulting_macro_label, _new_macro );
          																	circles_lib_output( _output_channel, _out_type, _out_text, _par_1, _cmd_tag );
          															}

                             		  var _params_array = [] ;
          										     	  _params_array['prepromptquestion'] = null ;
          	                   		 		_params_array['promptquestion'] = _prompt_question ;
          	                   		 		_params_array['yes_fn'] = function() { _macro_merge(); }
          	                   		 		_params_array['ifquestiondisabled_fn'] = function() { _macro_merge(); }
          	                   		circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
          										}
          										break ;
          										case "rec":
                              var _macro_label = ( _params_assoc_array['macrolabel'][0] != null ) ? _params_assoc_array['macrolabel'][0] : "" ;
          										if ( _macro_label.length == 0 )
                              {
          												 _b_fail = YES, _error_str = "Can't rec into macro: the input macro label is empty" ;
                              }
          										else if ( !circles_terminal_cmd_macro_exists( _macro_label ) )
          										{
          												 _b_fail = YES, _error_str = "Can't record this command into the macro '"+_macro_label+"': you should initialize one with this label first" ;
          										}
          										else
          										{
                                   var _cmd = "", _ret_op, _out_type, _out_text ;
          												 for( var _e = 0 ; _e < _params_assoc_array['entries'].length ; _e++ )
                                   {
                                        _cmd = _params_assoc_array['entries'][_e].trim();
                                        _cmd = _cmd.replaceAll( _local_cmds_params_array, "" );
                      									if ( _cmd.length == 0 )
                    										{
                    												 _b_fail = YES, _error_str = "Empty command: macro recording has failed" ;
                    										}
               												  else if ( !circles_terminal_cmd_macro_validate_cmd( _cmd ) )
                                        {
                                            if ( _cmd.length > 22 ) _cmd = _cmd.left( 0, 20 ) + " .." ;
                											 	   _b_fail = YES, _error_str = "The entry '"+_cmd+"' does not refer to any among the terminal cmds" ;
                                        }
                                        else if ( circles_terminal_cmd_macro_includes_cmd( _macro_label, _cmd ) )
                												{
                                           if ( _cmd.length > 22 ) _cmd = _cmd.left( 0, 20 ) + " .." ;
                											 	   _b_fail = YES, _error_str = "The macro '"+_macro_label+"' already includes the cmd '"+_cmd+"'" ;
                                        }
                                        else
                                        {
                                           _ret_op = circles_terminal_cmd_macro_add_cmd( _macro_label, _cmd );
                                           _out_type = ( _ret_op ) ? DISPATCH_SUCCESS : DISPATCH_ERROR ;
                                           _out_text = ( _ret_op ) ? "Add cmd '"+_cmd+"' to macro '"+_macro_label+"' with success !" : "Failure: can't add cmd '"+_cmd+"'' to macro '"+_macro_label+"'" ;
                                           circles_lib_output( _output_channel, DISPATCH_SUCCESS, _out_text, _par_1, _cmd_tag );
                												}
                                   }
          										}
          										break ;
          										case "remove":
                              _input_array = _params_assoc_array['indexes'] ;
                              var _cmd = _params_assoc_array['labels'].join( " ", _par_1, _cmd_tag );
                              var _macro_label = ( _params_assoc_array['macrolabel'][0] != null ) ? _params_assoc_array['macrolabel'][0] : "" ;
                              var _macro_chunk_array = circles_terminal_cmd_macro_get( _macro_label );
          										if ( _macro_label.length == 0 )
                              {
          												 _b_fail = YES, _error_str = "Can't remove cmd from macro: the input macro label is empty" ;
                              }
          										else if ( _macro_chunk_array.length == 0 )
                              {
          												 _b_fail = YES, _error_str = "Can't remove cmd from macro '"+_macro_label+"', because it's empty" ;
                              }
            									else if ( !circles_terminal_cmd_macro_exists( _macro_label ) )
          										{
          												 _b_fail = YES, _error_str = "Can't remove this command : no macro '"+_macro_label+"' was found in the archive" ;
          										}
                              else if ( _input_array.length == 0 )
                              {
          												 _b_fail = YES, _error_str = "Can't remove: no input index or cmd" ;
                              }
                              else
                              {
                                   var _candidate_index = UNFOUND ;
                                   var _old_size, _new_size, _out_type, _out_text, _real_index, _cmd_text ;
                                   var _cmd_text_array = [], _c ;
                                   for( _c = 0 ; _c < _input_array.length ; _c++ )
                                   {
                                        _candidate_index = safe_int( _input_array[_c], UNDET );
                                        _macro_chunk_array = circles_terminal_cmd_macro_get( _macro_label );
                                        _real_index = _candidate_index - 1 ;
                                        _cmd_text = _macro_chunk_array[_real_index] ;
                                        if ( _macro_chunk_array != null && _cmd_text != null )
                                            _cmd_text_array.push( _cmd_text );
                                        else if ( _macro_chunk_array == null )
                                            circles_lib_output( _output_channel, DISPATCH_WARNING, "Memory failure: macro '"+_macro_label+"' does not exist", _par_1, _cmd_tag );
                                        else if ( _macro_chunk_array[_real_index] == null )
                                            circles_lib_output( _output_channel, DISPATCH_WARNING, "The input index '"+_candidate_index+"' does not refer to any cmd entry in macro '"+_macro_label+"'", _par_1, _cmd_tag );
                                   }

                                   for( _c = 0 ; _c < _cmd_text_array.length ; _c++ )
                                   {
                                        _cmd_text = _cmd_text_array[_c] ;
                                        _candidate_index = circles_terminal_cmd_macro_find_cmd_index( _macro_label, _cmd );

                                        _old_size = _macro_chunk_array.length ;
                                        _macro_chunk_array.remove( _candidate_index, _candidate_index );
                                        _new_size = _macro_chunk_array.length ;
                                        _out_type = ( _new_size == ( _old_size - 1 ) ) ? DISPATCH_SUCCESS : DISPATCH_WARNING ;

                                        _out_text = "<gray>" + _cmd_text + "</gray>" + "" + _glob_crlf ;
                                        _out_text += ( _new_size == ( _old_size - 1 ) ) ? "<greenshock>" : "<red>" ;
                                        _out_text += ( _new_size == ( _old_size - 1 ) ) ? "Cmd removed with success" : "Can't remove this command" ;
                                        _out_text += " from macro '"+_macro_label+"'" ;
                                        _out_text += ( _new_size == ( _old_size - 1 ) ) ? "</greenshock>" : "</red>" ;
                                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out_text, _par_1, _cmd_tag );
                                   }
                              }
                              break ;
          										case "save":
                              var _macro_label = ( _params_assoc_array['macrolabel'][0] != null ) ? _params_assoc_array['macrolabel'][0] : "" ;
                              var _filename = "" ;
          										if ( _macro_label.length == 0 )
                              {
          												 _b_fail = YES, _error_str = "Can't save macro: the input label is empty" ;
                              }
            									else if ( !circles_terminal_cmd_macro_exists( _macro_label ) )
          										{
          												 _b_fail = YES, _error_str = "Can't save the macro '"+_macro_label+"': it does not exist in the archive" ;
          										}
          										else if ( _params_assoc_array['dump_array'].length == 0 )
                              {
                                   _filename = _macro_label + ".txt" ;
            											 circles_lib_output( _output_channel, DISPATCH_STANDARD, "No filename was input. The macro label '"+_macro_label+"' will be used then", _par_1, _cmd_tag );
                              }

                              if ( !_b_fail && _params_assoc_array['dump_array'] )
          	                  {
          												 var _macro_array = _glob_macros_array[ "MACRO." + _macro_label] ;
          												 if ( _macro_array == null || !is_array( _macro_array ) )
          												 circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Macro '"+_macro_label+"' does not appear to be valid", _par_1, _cmd_tag );
          												 else if ( _macro_array.length == 0 )
          											   circles_lib_output( _output_channel, DISPATCH_WARNING, "Macro '"+_macro_label+"' is empty", _par_1, _cmd_tag );
          												 else
          												 {
                                      var _row_array = [], _i;
                                      _row_array.push( "macro init " + _macro_label );
                                      var _macro_chunk = circles_terminal_cmd_macro_get( _macro_label );
                                      if ( _macro_chunk.length > 0 )
                                      {
                                          _row_array.push( "macro select " + _macro_label );
                                          for( _i = 0 ; _i < _macro_chunk.length ; _i++ )
                                          _row_array.push( "macro rec " + _macro_chunk[_i] );
                                      }
                                      _row_array.push( "macro unselect" );

          	 												 _filename = is_array( _params_assoc_array['dump_array'] ) ? _params_assoc_array['dump_array'][0] : "circles.macro.txt" ;
          													 var _ret_chunk = circles_lib_dump_data_to_format( _row_array.join( _glob_crlf ), _filename );
          													 var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
          													 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation";
          													 if ( _ret_id == 0 )
          													 {
          																_b_fail = YES, _error_str = _ret_msg ;
          													 }
          													 else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
          												}
          	                  }
                              else
          										{
          												 _b_fail = YES, _error_str = "Can't save the macro '"+_macro_label+"' into a file. Please, input a filename" ;
          										}
          										break ;
          										case "select":
                              var _macro_label = ( _params_assoc_array['macrolabel'][0] != null ) ? _params_assoc_array['macrolabel'][0] : "" ;
                              if (  _macro_label.length == 0 )
                              {
                                   if ( _glob_macros_current_sel.length == 0 )
                                   circles_lib_output( _output_channel, DISPATCH_STANDARD, "No current macro selection", _par_1, _cmd_tag );
                                   else
                                   circles_lib_output( _output_channel, DISPATCH_INFO, "Current macro selection : " + _glob_macros_current_sel, _par_1, _cmd_tag );
                              }
            									else if ( !circles_terminal_cmd_macro_exists( _macro_label ) )
          										{
          												 _b_fail = YES, _error_str = "Can't select the macro '"+_macro_label+"': it does not exist in the archive" ;
          										}
                              else
                              {
                                   _glob_macros_current_sel = _macro_label ;
                                   var _msg = "Macro '"+_macro_label+"' has been selected" ;
                                       _msg += _glob_crlf + "Further operations will be automatically re-directed to this macro" ;
           												 circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                              }
          										break ;
          										case "show":
                              var _macro_label = ( _params_assoc_array['macrolabel'][0] != null ) ? _params_assoc_array['macrolabel'][0] : "" ;
                              if ( _macro_label.length == 0 )
                              {
          												 _b_fail = YES, _error_str = "Can't show: input macro label is empty" ;
                              }
            									else if ( !circles_terminal_cmd_macro_exists( _macro_label ) )
          										{
          												 _b_fail = YES, _error_str = "Can't show the macro '"+_macro_label+"': it does not exist in the archive" ;
          										}
          										else
          										{
          												 var _n_cmds = circles_terminal_cmd_macro_count_cmds( _macro_label );
                                   if ( !circles_terminal_cmd_macro_exists( _macro_label ) )
          												 circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Macro '"+_macro_label+"' does not appear to be valid", _par_1, _cmd_tag );
          												 else if ( _n_cmds == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Macro '"+_macro_label+"' is empty", _par_1, _cmd_tag );
          												 else
          												 {
          												     var _macro_array = circles_terminal_cmd_macro_get( _macro_label );
          												 		 circles_lib_output( _output_channel, DISPATCH_STANDARD, "Macro '"+_macro_label+"' includes commands in the order below:", _par_1, _cmd_tag );
          												 		 var _macro_cmd = "", _counter = 1 ;
          												 		 for( var _i = 0 ; _i < _n_cmds ; _i++, _counter++ )
          												 		 {
          											 		 			_macro_cmd = _macro_array[_i] ;
          											 		 			_macro_cmd = _macro_cmd == null ? "" : _macro_cmd.trim();
          											 		 			if ( _macro_cmd ) circles_lib_output( _output_channel, DISPATCH_INFO, _counter + ") " + _macro_cmd, _par_1, _cmd_tag );
          														 }
          												 }
          										}
          										break ;
          										case "unselect":
                              var _macro_label = ( _params_assoc_array['macrolabel'][0] != null ) ? _params_assoc_array['macrolabel'][0] : "" ;
                              var _last_selection = _glob_macros_current_sel ;
            									if ( _last_selection.length == 0 )
          										{
          												 _b_fail = YES, _error_str = "Can't unselect: no previous selection has been set up" ;
          										}
                              else
                              {
            											 _glob_macros_current_sel = "" ;
                                   if ( _glob_macros_current_sel.length == 0 )
                                   {
                                       var _msg = "Macro '"+_last_selection+"' has been unselected" ;
              												 circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                                   }
                                   else
                                   {
              												 _b_fail = YES, _error_str = "Can't unselect: memory failure" ;
                                   }
                              }
          										break ;
											        default: break ;
        							}
          				}
                  break ;
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

function circles_terminal_cmd_macro_validate_cmd( _cmd )
{
			var _input_array = ( _cmd == null || _cmd == UNDEF ) ? [] : ( ( _cmd.length == 0 ) ? [] : _cmd.split( " " ) );
			if ( _input_array.length == 0 ) return NO ;
			else
			{
           var _b_found = 0 ;
					 for( var _c = 0 ; _c < _input_array.length ; _c++ )
 		 			 if ( circles_lib_terminal_cmdfile_exists( _input_array[_c] ) ) _b_found |= 1 ;
					 return _b_found ;
			}
}

function circles_terminal_cmd_macro_extract_operation_from_cmd( _cmd )
{
			var _input_array = ( _cmd == null || _cmd == UNDEF ) ? [] : ( ( _cmd.length == 0 ) ? [] : _cmd.split( " " ) );
			if ( _input_array.length == 0 ) return "" ;
			else
			{
           var _operation = "" ;
					 for( var _c = 0 ; _c < _input_array.length ; _c++ ) if ( circles_lib_terminal_cmdfile_exists( _input_array[_c] ) ) _operation = _input_array[_c] ;
					 return _operation ;
			}
}

function circles_terminal_cmd_macro_exists( _label )
{
      if ( !is_string( _label ) ) return NO ;
			else if ( _label.length == 0 || _glob_macros_array[ "MACRO." + _label ] == null ) return NO ;
			else if ( _glob_macros_array[ "MACRO." + _label ] != null ) return YES ;
}

function circles_terminal_cmd_macro_add_cmd( _label, _cmd )
{
      if ( !circles_terminal_cmd_macro_exists( _label ) ) return NO ;
			else
      {
          _glob_macros_array[ "MACRO." + _label].push( _cmd );
          return YES ;
      }
}

function circles_terminal_cmd_macro_includes_cmd( _label, _cmd )
{
      if ( !circles_terminal_cmd_macro_exists( _label ) ) return NO ;
			else
      {
          var _scan_array = _glob_macros_array[ "MACRO." + _label] ;
          if ( _scan_array == null ) return NO ;
          else
          {
               var _b_found = 0, _candidate_cmd = "" ;
               for( var _i = 0 ; _i < _scan_array.length ; _i++ )
               {
                    _candidate_cmd = _scan_array[_i] ;
                    if ( _candidate_cmd.stricmp( _cmd ) )
                    {
                         _b_found = 1 ;
                         break ;
                    }
               }
               
               return _b_found ;
          }
      }
}

function circles_terminal_cmd_macro_find_cmd_index( _macro_label, _cmd )
{
      if ( !circles_terminal_cmd_macro_exists( _macro_label ) ) return UNFOUND ;
			else
      {
          var _scan_array = _glob_macros_array[ "MACRO." + _macro_label ] ;
          if ( _scan_array == null ) return UNFOUND ;
          else
          {
               var _index = UNFOUND, _candidate_cmd = "" ;
               for( var _i = 0 ; _i < _scan_array.length ; _i++ )
               {
                    _candidate_cmd = _scan_array[_i] ;
                    if ( _candidate_cmd.stricmp( _cmd ) )
                    {
                         _index = _i ;
                         break ;
                    }
               }
               
               return _index ;
          }
      }
}

function circles_terminal_cmd_macro_get( _label )
{
      if ( !circles_terminal_cmd_macro_exists( _label ) ) return null ;
			else return _glob_macros_array[ "MACRO." + _label ] ;
}

function circles_terminal_cmd_macro_set( _label, _macro ) { _glob_macros_array[ "MACRO." + _label ] = _macro.clone(); }

function circles_terminal_cmd_macro_count_cmds( _label )
{
      if ( !circles_terminal_cmd_macro_exists( _label ) ) return NO ;
			else return _glob_macros_array[ "MACRO." + _label ].length ;
}

function circles_terminal_cmd_macro_count()
{
			var _counter = 0 ;
			for( var _key in _glob_macros_array ) if ( _key.includes( "MACRO." ) ) _counter++ ;
			return _counter ;
}