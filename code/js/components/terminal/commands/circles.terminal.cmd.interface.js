function circles_terminal_cmd_interface()
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
     var _long_mode = 0 ;
     var _help = NO ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['settings'] = [] ;
         
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "extend", "default", "release", "reset", "html", "wplane", "zplane" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.is_one_of_i( "default", "extend", "reset" ) ) _params_assoc_array['action'] = _p ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "zplane", "wplane" ) ) _params_assoc_array['settings']['plane'] = _p ;
              else
              {
                  _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
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
         else
         {
             var _action = _params_assoc_array['action'] ;
             switch( _action )
             {
                  case "default":
									var _params_array = [] ;
									 	  _params_array['prepromptquestion'] = null ;
								  		_params_array['promptquestion'] = "Confirm to restore the default interface ? " ;
									   	_params_array['yes_fn'] = function() { circles_lib_interface_reset( INTERFACE_EXTEND_NONE, YES, NO, YES ); }
									   	_params_array['ifquestiondisabled_fn'] = function() { circles_lib_interface_reset( INTERFACE_EXTEND_NONE, YES, NO, YES ); }
									circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                  break ;
                  case "extend":
                  if ( _params_assoc_array['settings']['plane'] != null )
                  {
										  var _plane_type = circles_lib_plane_get_value( _params_assoc_array['settings']['plane'] ) ;
										  if ( _plane_type.is_one_of( Z_PLANE, W_PLANE ) )
										  {
													var _plane_def = circles_lib_plane_get_def( _plane_type ) ;
													var _opt = 0 ;
													if ( _plane_type == Z_PLANE ) _opt = INTERFACE_EXTEND_ZPLANE ;
													else if ( _plane_type == W_PLANE ) _opt = INTERFACE_EXTEND_WPLANE ;

									     		var _params_array = [] ;
											     	  _params_array['prepromptquestion'] = null ;
								     		 			_params_array['promptquestion'] = "Confirm to extend "+_plane_def+" ? " ;
												     	_params_array['yes_fn'] = function() { circles_lib_interface_extend( _opt, NO, null, _output_channel ); }
												     	_params_array['ifquestiondisabled_fn'] = function() { circles_lib_interface_extend( _opt, YES, null, _output_channel ); }
											    circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
											}
									    else
									    {
				                  _b_fail = YES, _error_str = "Missing input plane specification" ;
											}
                  }
							    else
							    {
		                  _b_fail = YES, _error_str = "Missing input plane specification" ;
									}
                  break ;
                  case "hide":
					     		var _params_array = [] ;
							     	  _params_array['prepromptquestion'] = null ;
				     		 			_params_array['promptquestion'] = "Confirm to hide the interface? " ;
								     	_params_array['yes_fn'] = function() { circles_lib_interface_toggle( INTERFACE_FORCE_HIDE, _output_channel ); }
								     	_params_array['ifquestiondisabled_fn'] = function() { circles_lib_interface_toggle( INTERFACE_FORCE_HIDE, _output_channel ); }
							    circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                  break ;
                  case "reset":
                  if ( _params_assoc_array['settings']['plane'] != null )
                  {
										  var _plane_type = circles_lib_plane_get_value( _params_assoc_array['settings']['plane'] ) ;
										  if ( _plane_type != NO_PLANE )
										  {
													var _plane_def = circles_lib_plane_get_def( _plane_type ) ;
													var _opt = 0 ;
													if ( _plane_type == Z_PLANE ) _opt = INTERFACE_EXTEND_ZPLANE ;
													else if ( _plane_type == W_PLANE ) _opt = INTERFACE_EXTEND_WPLANE ;

									     		var _params_array = [] ;
											     	  _params_array['prepromptquestion'] = null ;
								     		 			_params_array['promptquestion'] = "Confirm to reset "+_plane_def+" ? " ;
												     	_params_array['yes_fn'] = function() { circles_lib_interface_reset( _opt, YES, NO, YES, _output_channel ); }
												     	_params_array['ifquestiondisabled_fn'] = function() { circles_lib_interface_reset( _opt, YES, NO, YES, _output_channel ); }
											    circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
											}
									    else
									    {
				                  _b_fail = YES, _error_str = "Missing input plane specification" ;
											}
									}
							    else
							    {
		                  _b_fail = YES, _error_str = "Missing input plane specification" ;
									}
                  break ;
                  case "release":
                  circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  case "show":
					     		var _params_array = [] ;
							     	  _params_array['prepromptquestion'] = null ;
				     		 			_params_array['promptquestion'] = "Confirm to show the interface? " ;
								     	_params_array['yes_fn'] = function() { circles_lib_interface_toggle( INTERFACE_FORCE_SHOW, _output_channel ); }
								     	_params_array['ifquestiondisabled_fn'] = function() { circles_lib_interface_toggle( INTERFACE_FORCE_SHOW, _output_channel ); }
							    circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                  break ;
                  default: break ;
             }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing params" ;
     }
     
     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}