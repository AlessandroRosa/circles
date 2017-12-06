_glob_terminal_cmd_files_include[ "plane" ] = [ "init", "refresh" ] ;

function circles_terminal_cmd_plane()
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
     var _context_plane_label = "" ;
     var _help = NO ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _cmd_params = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _cmd_params['help'] = NO ;
         _cmd_params['keywords'] = NO ;
         _cmd_params['plane'] = W_PLANE ;
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "all", "bip", "wplane", "zplane", "none", "release", "html" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
              else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
              else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
              else if ( _p.stricmp( "all" ) ) _cmd_params['plane'] = BIP_BOX | W_PLANE | Z_PLANE ;
              else if ( _p.stricmp( "bip" ) ) _cmd_params['plane'] = BIP_BOX ;
              else if ( _p.stricmp( "none" ) ) _cmd_params['plane'] = NO_PLANE ;
              else if ( _p.stricmp( "zplane" ) ) _cmd_params['plane'] = _glob_target_plane = Z_PLANE ;
              else if ( _p.stricmp( "wplane" ) ) _cmd_params['plane'] = _glob_target_plane = W_PLANE ;
              else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
         }

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
             var _action = _cmd_params['action'] ;
             switch( _action )
             {
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
				        default: break ;
             }
             
             var _plane_type = _cmd_params['plane'] ;
             _context_plane_label = "Selected plane: " + circles_lib_plane_def_get( _plane_type );
             var _plane_cmd = circles_lib_plane_def_get_for_cmds( _plane_type );
             if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _out_channel );
             if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh "+_plane_cmd+" clean silent", _glob_terminal, _out_channel );

             switch( _cmd_params['plane'] )
             {
                 case NO_PLANE :
                 _context_plane_label = "Warning! No selected plane(s)" ;
                 var _plane_ref = circles_lib_plane_def_get( _plane_type );
                 circles_lib_output( _out_channel, DISPATCH_INFO, "Deselection of "+_plane_ref+" context", _par_1, _cmd_tag );
                 break ;
                 default :
                 break ;
             }
             
             if ( _params.length > 0 ) circles_lib_output( _out_channel, _plane_type == NO_PLANE ? DISPATCH_WARNING : DISPATCH_SUCCESS, _context_plane_label, _par_1, _cmd_tag );
             else circles_lib_output( _out_channel, DISPATCH_INFO, _context_plane_label, _par_1, _cmd_tag );
         }
     }
     else
     {
          var _plane_ref = "Current selected plane : " + circles_lib_plane_def_get( _plane_type );
          circles_lib_output( _out_channel, DISPATCH_INFO, _plane_ref, _par_1, _cmd_tag );
     }
     
     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}