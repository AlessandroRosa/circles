function circles_terminal_cmd_new()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _output_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _glob_verbose && _glob_terminal_echo_flag )
     circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];
         _params_assoc_array['mask'] = UNDET ;
         _params_assoc_array['clean'] = NO ;

     _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
     _params_assoc_array['help'] = NO ;
     _params_assoc_array['keywords'] = NO ;
         
     var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
     _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
     _params_assoc_array['mask'] = RESET_NONE ;
     _params_assoc_array['silent'] = NO ;
     // pre-scan for levenshtein correction
	 var _local_cmds_params_array = [];
 		 _local_cmds_params_array.push( "release", "bip", "clean", "coords", "generals", "none", "plugins", "terminal", "html", "help" );
     circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
     var _p ;
     for( var _i = 0 ; _i < _params_array.length ; _i++ )
     {
             _p = _params_array[_i].toLowerCase();
             if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
             else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
             else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
             else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
             else if ( _p.stricmp( "bip" ) ) _params_assoc_array['mask'] |= RESET_BIP ;
             else if ( _p.stricmp( "clean" ) ) _params_assoc_array['clean'] = YES ;
             else if ( _p.stricmp( "coords" ) ) _params_assoc_array['mask'] |= RESET_COORDS ;
             else if ( _p.stricmp( "dict" ) ) _params_assoc_array['mask'] |= RESET_DICT ;
             else if ( _p.stricmp( "generals" ) ) _params_assoc_array['mask'] |= RESET_GENERALS ;
             else if ( _p.stricmp( "gensset" ) ) _params_assoc_array['mask'] |= RESET_GENS_SET ;
             else if ( _p.stricmp( "none" ) ) _params_assoc_array['mask'] = RESET_NONE ;
             else if ( _p.stricmp( "plugins" ) ) _params_assoc_array['mask'] |= RESET_PLUGINS ;
             else if ( _p.stricmp( "terminal" ) ) _params_assoc_array['mask'] |= RESET_TERMINAL ;
             else if ( _p.stricmp( "silent" ) ) _params_assoc_array['silent'] = YES ;
             else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
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
                    var _new_proc = function()
                    {
                        if ( _params_assoc_array['mask'] == UNDET || _params_array.length == 0 ) _params_assoc_array['mask'] = ( ~RESET_NONE >>> 0 ) ;
                        var _ret_chunk = circles_lib_config_create_new_proc( _params_assoc_array['mask'], YES, _params_assoc_array['clean'], NO, YES, _output_channel );
                        var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                        if ( _ret_id == 1 )
                        {
                             if ( _output_channel == OUTPUT_SCRIPT )
                             {
                                  $("#CIRCLESbatchcompilerWARNINGSlabel").html( "" );
                                  $("#CIRCLESbatchcompilerERRORSlabel").html( "" );
                                  $("#CIRCLESbatchcompilerOKlabel").html( "" );
                             }
          
                             circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                        }
                        else circles_lib_output( _output_channel, DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                    }

                  if ( _params_assoc_array['silent'] ) _new_proc.apply();
                  else
                  {
                    var _prompt_question = "Are you sure to set up a new config ?" ;
               		  var _params_array = [] ;
          		     	  _params_array['prepromptquestion'] = null ;
                       	  _params_array['promptquestion'] = _prompt_question ;
                       	  _params_array['yes_fn'] = function() { _new_proc(); }
                       	  _params_array['ifquestiondisabled_fn'] = function() { _new_proc(); }
					if ( !_glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
                    else circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                  }
                  break ;
             }
     }

     if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}