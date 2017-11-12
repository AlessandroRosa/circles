function circles_terminal_cmd_run()
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
     var _fn_ret_val = null ;
     var _out_text_string = "" ;

     var _params_assoc_array = [];
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else
              {
                   _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
              }
         }

         if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
         else if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _output_channel );
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
                 if ( _glob_terminal != null && _output_channel == OUTPUT_TERMINAL && _params_assoc_array['help'] != YES )
                 {
        					    var _script_code = $("#CIRCLESbatchcompilerTEXT" + _glob_terminal_form_suffix ).val();
        					    if ( _script_code.length > 0 )
        							{
        		 							 circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Batch script found and run", _par_1, _cmd_tag );
        		 							 circles_lib_output( _output_channel, DISPATCH_INFO, "Check debug tab for report", _par_1, _cmd_tag );
        		 							 circles_lib_output( _output_channel, DISPATCH_INFO, "Type 'stop' to halt the current process", _par_1, _cmd_tag );
        									 _glob_terminal_questions_enabled = NO ;
                           _glob_terminal_run_code_from = RUN_CODE_FROM_TERMINAL ;
                           circles_lib_batch_compiler_run();
        									 _glob_terminal_questions_enabled = YES ;
        									 _glob_terminal_change = NO ;
        							}
        							else circles_lib_output( _output_channel, DISPATCH_WARNING, "No code to run", _par_1, _cmd_tag );         
                 }
                 break ;
             }
         }

     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}