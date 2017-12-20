function circles_terminal_cmd_new()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _glob_verbose && _glob_terminal_echo_flag )
     circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

		 var _last_release_date = get_file_modify_date( _glob_paths['terminal_abs_cmds'], "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _cmd_params = [];
         _cmd_params['mask'] = UNDET ;
         _cmd_params['clean'] = NO ;

     _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
     _cmd_params['help'] = NO ;
     _cmd_params['keywords'] = NO ;
         
     var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
     _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
     _cmd_params['mask'] = RESET_NONE ;
     // pre-scan for levenshtein correction
	 var _cmd_terms_dict = [];
 		 _cmd_terms_dict.push( "release", "bip", "clean", "coords", "generals", "none", "plugins", "terminal", "html", "help" );
     circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
     var _p ;
     for( var _i = 0 ; _i < _params_array.length ; _i++ )
     {
             _p = _params_array[_i].toLowerCase();
             if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
             else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
             else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
             else if ( _p.is_one_of_i( "html", "silent" ) ) _cmd_params[_p] = YES ;
             else if ( _p.stricmp( "bip" ) ) _cmd_params['mask'] |= RESET_BIP ;
             else if ( _p.stricmp( "clean" ) ) _cmd_params['clean'] = YES ;
             else if ( _p.stricmp( "coords" ) ) _cmd_params['mask'] |= RESET_COORDS ;
             else if ( _p.stricmp( "dict" ) ) _cmd_params['mask'] |= RESET_DICT ;
             else if ( _p.stricmp( "generals" ) ) _cmd_params['mask'] |= RESET_GENERALS ;
             else if ( _p.stricmp( "gensset" ) ) _cmd_params['mask'] |= RESET_GENS_SET ;
             else if ( _p.stricmp( "none" ) ) _cmd_params['mask'] = RESET_NONE ;
             else if ( _p.stricmp( "plugins" ) ) _cmd_params['mask'] |= RESET_PLUGINS ;
             else if ( _p.stricmp( "terminal" ) ) _cmd_params['mask'] |= RESET_TERMINAL ;
             else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
     }

         if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
         else if ( _cmd_params['keywords'] )
         {
             var _msg = circles_lib_terminal_tabular_arrange_data( _cmd_terms_dict.sort() ) ;
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
                  default:
                    var _new_proc = function()
                    {
                        if ( _cmd_params['mask'] == UNDET || _params_array.length == 0 ) _cmd_params['mask'] = ( ~RESET_NONE >>> 0 ) ;
                        var _ret_chunk = circles_lib_config_create_new_proc( _cmd_params['mask'], YES, _cmd_params['clean'], NO, YES, _out_channel );
                        var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                        if ( _ret_id == 1 )
                        {
                             if ( _out_channel == OUTPUT_SCRIPT )
                             {
                                  $("#CIRCLESbatchcompilerWARNINGSlabel").html( "" );
                                  $("#CIRCLESbatchcompilerERRORSlabel").html( "" );
                                  $("#CIRCLESbatchcompilerOKlabel").html( "" );
                             }
          
                             circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                        }
                        else circles_lib_output( _out_channel, DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                    }

                  if ( _cmd_params['silent'] ) _new_proc.apply();
                  else
                  {
                    var _prompt_question = "Are you sure to set up a new config ?" ;
               		  var _params_array = [] ;
          		     	  _params_array['prepromptquestion'] = null ;
                       	  _params_array['promptquestion'] = _prompt_question ;
                       	  _params_array['yes_fn'] = function() { _new_proc(); }
                       	  _params_array['ifquestiondisabled_fn'] = function() { _new_proc(); }
					if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
                    else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                  }
                  break ;
             }
     }

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}