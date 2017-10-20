function circles_terminal_cmd_keepcmd()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _output_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
         // 1: toggle echo off (temporaneously, i.e. this cmd run life)
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose && _glob_terminal_echo_flag )
     circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

     var _this_cmd_tag = "keepcmd" ;
		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
		 var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _help = NO ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['settings'] = [] ;
         _params_assoc_array['settings']['expression'] = [] ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "off", "release", "help", "html" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
            else if ( _p.is_one_of_i( "off" ) && _i == 0 )
            {
                _params_assoc_array['action'] = _p ;
                break ; // no further input allowed
            }
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.length > 0 ) _params_assoc_array['settings']['expression'].push( _p ) ;
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
             var _expr = _params_assoc_array['settings']['expression'] ;
             var _action = ( safe_size( _expr, 0 ) > 0 && !( _params_assoc_array['action'].strcmp( "off" ) ) ) ? "keep" : _params_assoc_array['action'] ;
             switch( _action )
             {
                  case "release":
                  circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  case "keep":
                  var _expression = _params_assoc_array['settings']['expression'].length > 0 ? _params_assoc_array['settings']['expression'].join( " " ) : "" ;
                  var _b_exists = circles_lib_terminal_cmdfile_exists( _expression.toLowerCase() );
                  if ( _b_exists )
                  {
                      var _b_compound_expr = ( _expression.includes( " " ) && !_expression.includes_i( "off" ) ) ? YES : NO ;
                      if ( _b_compound_expr )
                      circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Detected compound expression</lightgray> <yellow>"+_expression+"</yellow>", _par_1, _cmd_tag );
                      
                      var _cmd_tag = _b_compound_expr ? ( _expression.split( " " ) )[0] : _expression ;
                      var _b_already = _glob_terminal_keepcmd.strcmp( _cmd_tag );
                      if ( _glob_terminal_echo_flag )
                      {
												 circles_lib_output( _output_channel, DISPATCH_SUCCESS, "'Keep command' mode has been"+( _b_already ? " already" : "" )+" toggled on to '" + _cmd_tag + "'", _par_1, _cmd_tag );
												 circles_lib_output( _output_channel, DISPATCH_INFO, "Type 'keepcmd off' to disable the keeping mode", _par_1, _cmd_tag );
										  }
                      _glob_terminal_keepcmd = _expression ;
		                  _glob_terminal.set_prompt( "["+_glob_terminal_keepcmd+"]" + _glob_terminal_default_prompt );
                  }
                  else
                  {
                      _b_fail = YES, _error_str = "Can't keep: the command '" + _p + "' is unknown" ;
                  } 
                  break ;
                  case "off":
                  _params_assoc_array['settings'].push( "off" ) ;
                  if ( _glob_terminal_keepcmd.length == 0 && _glob_terminal_echo_flag )
                  circles_lib_output( _output_channel, DISPATCH_WARNING, "'Keep command' mode was already toggled off", _par_1, _cmd_tag );
                  else
                  {
                      _glob_terminal_keepcmd = "" ;
                      _glob_terminal.set_prompt( _glob_terminal_default_prompt );
                      if ( _glob_terminal_echo_flag ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Keeping command mode has been toggled off", _par_1, _cmd_tag );
                  }
                  break ;
                  default: break ;
             }
         }
     }
		 else
		 {
		 		 _b_fail = YES, _error_str = "No input cmd to keep" ;
		 }	
				
     if ( !_b_fail && _glob_terminal_echo_flag && !_help && _glob_terminal_keepcmd.length > 0 )
         circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Currently kept command is</lightgray> <white>" + _glob_terminal_keepcmd + "</white>", _par_1, _this_cmd_tag );
     else if ( _b_fail && _glob_terminal_echo_flag )
         circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _this_cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}