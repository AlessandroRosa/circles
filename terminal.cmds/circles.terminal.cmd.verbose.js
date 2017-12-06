function circles_terminal_cmd_verbose()
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
     var _help = NO ;
     var _fn_ret_val = null ;
     var _cmd_params = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _cmd_params['help'] = NO ;
         _cmd_params['keywords'] = NO ;
         _cmd_params['mode'] = 0 ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "on", "off", "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else if ( _p.stricmp( "off" ) ) _cmd_params['mode'] = OFF ;
            else if ( _p.stricmp( "on" ) ) _cmd_params['mode'] = ON ;
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
         }

         var _already = ( _glob_verbose == _cmd_params['mode'] ) ? YES : NO ;

         if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
         else if ( _cmd_params['keywords'] )
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
             _glob_verbose = _cmd_params['mode'] ;
             var _action = _cmd_params['action'] ;
             switch( _action )
             {
                  case "release":
                  circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
                   var _verbose_label = "" ;
                   switch( _glob_verbose )
                   {
                       case YES:
                       _verbose_label = "<green>verbose mode is "+( _already ? "already " : "" )+"on" + ( _already ? "" : "</green>"+_glob_crlf+"<gray>where required, output responses will be richer of details</gray>" );
                       break ;
                       default:
                       _verbose_label = "<green>verbose mode is "+( _already ? "already " : "" )+"off" + ( _already ? "" : "</green>"+_glob_crlf+"<gray>standard output responses</gray>" );
                       break ;
                   }
                       
                   if ( _params.length == 0 ) _verbose_label = "Current " + _verbose_label.toLowerCase();
                   if ( _params.length > 0 )
                   circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _verbose_label, _par_1, _cmd_tag );
                   else 
                   circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _verbose_label, _par_1, _cmd_tag );
          
                   if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
            			 {
          							_glob_terminal_change = YES ;
          	            circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
          				 }
                  break ;
             }
         }
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
     circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}