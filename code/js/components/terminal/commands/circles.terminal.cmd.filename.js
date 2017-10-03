function circles_terminal_cmd_filename()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose && _glob_terminal_echo_flag )
     circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _filename = "" ;
     var _params_assoc_array = [];
     var _fn_ret_val = null ;
     var _illegal_tokens = [ "pdf", "png", "svg", "txt" ] ;

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );

         _params_assoc_array['mask'] = RESET_NONE ;
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
         var _p, _inserted = NO, _counter = 0 ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['aqtion'] = _p ;
              else if ( !_p.testME( _glob_filename_regex_pattern ) )
              {
                   _b_fail = YES, _error_str = "Detected illegal chars inside candidate file name '"+_p+"'" ;
              }
              else if ( _p.one_in_i( _illegal_tokens ) )
              {
                   _b_fail = YES, _error_str = "Detected forbidden terms while assigning the file name" ;
                   _error_str += _glob_crlf + "Forbidden list: " + _illegal_tokens.join( ", " );
              }
              else if ( _filename.length == 0 )
              {
                  _glob_export_filename = _filename = _p ;
                  _inserted = YES ;
              }
              else if ( _inserted && _counter == 0 )
              {
                   var _msg = "Only the first param is applied to assign the file name" ;
                   circles_lib_output( _out_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                   _counter++ ;
              }
         }

         if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _out_channel );
         else if ( _params_assoc_array['keywords'] )
         {
             var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
             if ( _msg.length == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
             else
             {
                 _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                 circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
             }
         }
         else if ( !_b_fail )
         {
             var _action = _params_assoc_array['action'] ;
             switch( _action )
             {
                  case "release":
                  circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
                  if ( _inserted )
                  {
                      var _msg = "New filename is '"+_glob_export_filename+"'" ;
                      circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                  }
                  break;
             }
         }
     }
     else
     {
         var _msg = "Current file name is "+( ( _glob_export_filename.length == 0 ) ? "empty" : "'"+_glob_export_filename+"'" )+"" ;
         circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
     }


     if ( _b_fail && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}