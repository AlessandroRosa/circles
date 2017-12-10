function circles_lib_batch_compiler_run( _script_ctrl_id, _debug_ctrl_id, _id_boxes_array, _debug_flag, _output_flag )
{
   _script_ctrl_id = safe_string( _script_ctrl_id, "CIRCLESbatchcompilerTEXT" + _glob_terminal_form_suffix ).trim();
   _debug_ctrl_id = safe_string( _debug_ctrl_id, "CIRCLESdebugDIV" ).trim();
   _debug_flag = safe_int( _debug_flag, YES ), _output_flag = safe_int( _output_flag, YES );
   var _script_code = $("#"+_script_ctrl_id ).val();
   if ( _script_code.length > 0 )
   {
       if ( _debug_flag && $("#"+_debug_ctrl_id ).get(0) != null ) $("#"+_debug_ctrl_id ).html( "" );
       circles_lib_unload_cmd();

       _glob_terminal_current_cmd = "" ;
       _script_code = _script_code.replaceAll( [ CRLF_WIN, CRLF_NO_WIN, '<br>' ], _glob_crlf );
       var _script_code_lines_array = _script_code.split( _glob_crlf );
       var _tmp_array = [], _code_row ;
       // cleaning from blank rows
       for( var _i = 0 ; _i < _script_code_lines_array.length ; _i++ )
       {
          _code_row = _script_code_lines_array[_i].trim();
          if ( _code_row.length > 0 ) _tmp_array.push( _code_row ); 
       }
         
       _script_code_lines_array = _tmp_array.clone();
       if ( _output_flag ) circles_lib_output( OUTPUT_SCRIPT, DISPATCH_INFO, "Code start", _debug_ctrl_id );
         
       var _open_comment = 0, _msg ;
       var _cmd_line, _out_cmd, _cmd_line_len, _dslash_comment_index, _open_comment_index, _close_comment_index ;
       var _filter_flag = NO, _comment_flag = NO ;
       var _old_doc_title = document.title, _SL = _script_code_lines_array.length, _cmd_array, _cmd_str, _params_str  ;
       var _filter_array = [], _comment_array = [];

       _glob_terminal_critical_halt = _glob_terminal_coderun_break = NO ;
       _glob_terminal_current_line_number = 1 ;
       _glob_terminal_errors_counter = _glob_terminal_warnings_counter = 0 ;
       
       for( var _i = 0 ; _i < _SL ; _i++, _glob_terminal_current_line_number++ )
       {
          _cmd_line = _script_code_lines_array[_i].trim();
          _out_cmd = "", _cmd_line_len = _cmd_line.length ;
          _dslash_comment_index = _cmd_line.indexOf( "//" );
          _open_comment_index = _cmd_line.indexOf( "/*" );
          _close_comment_index = _cmd_line.indexOf( "*/" );
             
          if ( _cmd_line.toLowerCase().strcmp( "filter:" ) ) // filter begins
          {
						 _glob_filter = "" ;
						 _filter_array.flush();
				 		 _filter_flag = YES ;
				 		 continue ;
					}
					else if ( _filter_flag )
					{
						 if ( _cmd_line.strcmp( "[" ) ) _filter_flag = 2 ;
 						 else if ( _cmd_line.strcmp( "]" ) && _filter_flag == 2 ) _filter_flag = NO ;
						 else if ( _cmd_line.length > 0 && _filter_flag == 2 ) _filter_array.push( _cmd_line );
 						 continue ;
					}

          if ( _cmd_line.toLowerCase().strcmp( "comment:" ) ) // comment begins
          {
						 _glob_comment = "" ;
						 _comment_array.flush();
						 _comment_flag = YES ;
						 continue ;
					}
					else if ( _comment_flag )
					{
						 if ( _cmd_line.strcmp( "[" ) ) _comment_flag = 2 ; 
		 				 else if ( _cmd_line.strcmp( "]" ) && _comment_flag == 2 ) _comment_flag = NO ;
						 else if ( _cmd_line.length > 0 && _comment_flag == 2 ) _comment_array.push( _cmd_line );
		 				 continue ;
					}

          if ( _dslash_comment_index != UNFOUND )
          {
             // up to the end of the line
             _cmd_line = _cmd_line.substr( 0, _dslash_comment_index );
             _out_cmd = _cmd_line.trim();
          }
          else if ( _open_comment_index != UNFOUND && _close_comment_index != UNFOUND )
          {
             // open and close within a same command line
             var _comment_length = _close_comment_index - _open_comment_index ;
             _cmd_line = _cmd_line.substr( 0, _open_comment_index ) + " " + _cmd_line.substr( _close_comment_index + 2, _cmd_line_len );
             _out_cmd = _cmd_line.trim();
          }
          else if ( _open_comment_index != UNFOUND && _close_comment_index == UNFOUND )
          {
             // multiple line - open
             _cmd_line = _cmd_line.substr( 0, _open_comment_index );
             _out_cmd = _open_comment == 0 ? _cmd_line.trim() : "" ;
             _open_comment = 1 ;
          }
          else if ( _open_comment_index == UNFOUND && _close_comment_index != UNFOUND )
          {
             // multiple line - close
             _open_comment = 0 ;
             _cmd_line = _cmd_line.substr( _close_comment_index + 2, _cmd_line_len );
             _out_cmd = _cmd_line.trim();
          }
          else if ( _open_comment == 0 ) _out_cmd = _cmd_line ;

          if ( _out_cmd.length > 0 )
          {
             _cmd_array = circles_lib_terminal_parse_cmd( _out_cmd );
             _cmd_str = ( _glob_terminal_keepcmd.length > 0 && _cmd_array['cmd'].toLowerCase() != "keepcmd" ) ? _glob_terminal_keepcmd : _cmd_array['cmd'].trim();
             _params_str = ( _glob_terminal_keepcmd.length > 0 && _cmd_str.toLowerCase() != "keepcmd" ) ? ( _cmd_array['cmd'].trim() + " " + _cmd_array['params'].trim() ) : _cmd_array['params'].trim();
             _glob_terminal_current_cmd = _cmd_str ;
             circles_lib_batch_compiler_exec( _cmd_str, _params_str, _debug_ctrl_id, TERMINAL_CMD_MODE_ACTIVE );
          }

          var _warning_ctrl_id = safe_string( _id_boxes_array[0], "" ).trim() ;
          var _errors_ctrl_id = safe_string( _id_boxes_array[1], "" ).trim() ;
          var _ok_ctrl_id = safe_string( _id_boxes_array[2], "" ).trim() ;
          
          if ( $( "#" + _warning_ctrl_id ).get(0) != null )
          $( "#" + _warning_ctrl_id ).html( ( _glob_terminal_warnings_counter > 0 && _output_flag ) ? _glob_terminal_warnings_counter + " warning" + ( _glob_terminal_warnings_counter != 1 ? "s" : "" ) : "" );

          if ( $( "#" + _errors_ctrl_id ).get(0) != null )
          $( "#" + _errors_ctrl_id ).html( ( _glob_terminal_errors_counter > 0 && _output_flag ) ? _glob_terminal_errors_counter + " error" + ( _glob_terminal_errors_counter != 1 ? "s" : "" ) : "" );

          if ( $( "#" + _ok_ctrl_id ).get(0) != null )
          $( "#" + _ok_ctrl_id ).html( ( _glob_terminal_errors_counter == 0 && _output_flag ) ? "No errors: code is OK !" : "" );

          if ( _glob_terminal_coderun_break == YES && _output_flag )
          {
             circles_lib_output( OUTPUT_SCRIPT, DISPATCH_INFO, "Code run break", _debug_ctrl_id );
             break ;
          } 
          else if ( _glob_terminal_user_halt == YES && _output_flag )
          {
             circles_lib_output( OUTPUT_SCRIPT, DISPATCH_INFO, "Run has been aborted by user.", _debug_ctrl_id );
             break ;
          }
          else if ( _glob_terminal_critical_halt == YES && _glob_terminal_errors_switch && _output_flag )
          {
             _msg = "A critical error has been caught.\nCode run has been halted.\n" ;
             _msg += _glob_terminal_critical_halt_msg.length > 0 ? _glob_terminal_critical_halt_msg : "unknown reason" ;
             circles_lib_output( OUTPUT_SCRIPT, DISPATCH_ERROR, _msg, _debug_ctrl_id );
             if ( $("#"+_debug_ctrl_id).get(0) != null )
             {
                 var _prev = $("#"+_debug_ctrl_id).html();
                 $("#"+_debug_ctrl_id).html( _msg + "\nHalt at line " + _glob_terminal_current_line_number );
             }
             break ;
          }

          document.title = "Parse line " + _i + "/" + _SL + " - " + safe_int( _i / _SL * 100.0, 0 ) + " %" ;
       }
         
       document.title = _old_doc_title ;

       if ( function_exists( "CIRCLESformsTERMINALpurgecmdUPDATEstatus" ) )
			 CIRCLESformsTERMINALpurgecmdUPDATEstatus( _glob_terminal_form_suffix ) ;

       if ( _glob_comment ) _glob_comment = NO ;
       if ( _glob_filter ) _glob_filter = NO ;
         
       _glob_comment = _comment_array.length > 0 ? _comment_array.join( _glob_crlf ) : "" ;
       _glob_filter = _filter_array.length > 0 ? _filter_array.join( _glob_crlf ) : "" ;

       // silent mode default status is always resumed to default value at the end of the run
       // in order to preserve question in the beginning, if any
       _glob_terminal_echo_flag = DISABLED ;
       _glob_terminal_current_cmd = "" ;
       if ( _output_flag ) circles_lib_output( OUTPUT_SCRIPT, DISPATCH_INFO, "Code end", _debug_ctrl_id );
   }
   else circles_lib_output( OUTPUT_SCRIPT, DISPATCH_ERROR, "No code to run" );
}

function circles_lib_batch_compiler_parse_cmd( _cmd )
{
   var _cmd_array = [], _array = _cmd.split( " " );
   _cmd_array['cmd'] = _array[0] ;
   _array.remove( 0, 0 );
   _cmd_array['params'] = _array.length == 0 ? "" : _array.join( " " );
   return _cmd_array ; 
}

function circles_lib_batch_compiler_exec( _cmd_str, _params_str, _param_01, _cmd_mode, _force_cmd_exec )
{
   _force_cmd_exec = safe_int( _force_cmd_exec, NO ); // to skip if statements and let the cmd be executed
   if ( circles_lib_terminal_cmdfile_exists( _cmd_str ) )
   {
			var _filename = "circles.terminal.cmd." + _cmd_str + ".js", _ret_load ;
      if ( check_file_exists( _glob_paths['terminal_cmds_path'] + _filename ) )
      {
          $.ajaxSetup( {async:false} );
          $.getScript( _glob_paths['terminal_cmds_path'] + _filename ).done( function()
                       {
                          if ( !_glob_code_run_cmds_array.includes( _cmd_str ) ) _glob_code_run_cmds_array.push( _cmd_str );
                          var _include_files = is_array( _glob_terminal_cmd_files_include[ _cmd_str ] ) ? _glob_terminal_cmd_files_include[ _cmd_str ].clone() : [] ;
                    	    if ( safe_size( _include_files, 0 ) > 0 )
                    	    {
                    	        for( var _i = 0 ; _i < _include_files.length ; _i++ )
                    	        {
                    	           if ( circles_lib_terminal_cmdfile_exists( _include_files[_i] ) )
                    	           {
                    	               _filename = "circles.terminal.cmd." + _include_files[_i] + ".js" ;
                    	               if ( check_file_exists( _glob_paths['terminal_cmds_path'] + _filename ) )
                                     circles_lib_batch_compiler_exec( _include_files[_i], "", _param_01, TERMINAL_CMD_MODE_INCLUSION, _force_cmd_exec ) ;
                                     else circles_lib_output( OUTPUT_SCRIPT, DISPATCH_ERROR, "Missing or corrupted complement cmd '"+_include_files[_i]+"'" );
                    	           }
                                 else circles_lib_output( OUTPUT_SCRIPT, DISPATCH_WARNING, "Missing or corrupted cmd component '" + _include_files[_i] + "'" );
                    	        }
                    	     }

                           var _sub_fn = "circles_terminal_cmd_" + _cmd_str ;
                           try{ eval( _sub_fn + "( '"+_params_str+"', "+OUTPUT_SCRIPT+", '"+_param_01+"', "+_cmd_mode+" )" ) }
                           catch( _err )
						   {
								circles_lib_error_obj_handler( _err ) ;
								circles_lib_log_add_entry( "Cmd '"+_cmd_str+"': " + _err.message );
						   }

                       } ).fail( function()
                       {
                          circles_lib_log_add_entry( "Cmd '"+_cmd_str+"' can't be loaded: suspected invalid filename or internal code error" , LOG_ERROR ) ;
                       }
                       );
      }
      else circles_lib_log_add_entry( "Missing or corrupted cmd '"+_cmd_str+"'", LOG_ERROR ) ;
   }
   else
   {
      _glob_terminal_critical_halt = _glob_terminal_coderun_break = YES ;
      _glob_terminal_critical_halt_msg = "Code run has been halted: cmd '"+_cmd_str+"' corrupted or not found" ;
      circles_lib_output( OUTPUT_SCRIPT, DISPATCH_WARNING, _glob_terminal_critical_halt_msg, _param_01 );
   }   
}