function circles_terminal_cmd_interface()
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

	var _last_release_date = get_file_modify_date( _glob_paths['terminal_abs_cmds'], "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _sd_n = circles_lib_count_seeds();
    var _long_mode = 0 ;
    var _help = NO ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

	if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _cmd_params['help'] = NO ;
         _cmd_params['keywords'] = NO ;
         
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
         // pre-scan for levenshtein correction
    		 var _cmd_terms_dict = [ "extend", "default", "silent", "release", "reset", "html", "wplane", "zplane" ];
         circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
              else if ( _p.is_one_of_i( "default", "extend", "reset" ) ) _cmd_params['action'] = _p ;
              else if ( _p.is_one_of_i( "html", "silent" ) ) _cmd_params[_p] = YES ;
              else if ( _p.is_one_of_i( "zplane", "wplane" ) ) _cmd_params['plane'] = _p ;
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
         else
         {
            var _action = _cmd_params['action'] ;
            switch( _action )
            {
                case "default":
				var _params_array = [] ;
				_params_array['prepromptquestion'] = null ;
				_params_array['promptquestion'] = "Confirm to restore the default interface (y|n) ? " ;
				_params_array['yes_fn'] = function() { circles_lib_interface_reset( INTERFACE_EXTEND_NONE, YES, NO, YES ); }
				_params_array['ifquestiondisabled_fn'] = function() { circles_lib_interface_reset( INTERFACE_EXTEND_NONE, YES, NO, YES ); }
				if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
				else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                break ;
                case "extend":
                if ( _cmd_params['plane'] != null )
                {
					var _plane_type = circles_lib_plane_get_value( _cmd_params['plane'] ) ;
					if ( _plane_type.is_one_of( Z_PLANE, W_PLANE ) )
					{
						var _plane_def = circles_lib_plane_def_get( _plane_type ) ;
						var _opt = 0 ;
						if ( _plane_type == Z_PLANE ) _opt = INTERFACE_EXTEND_ZPLANE ;
						else if ( _plane_type == W_PLANE ) _opt = INTERFACE_EXTEND_WPLANE ;

						var _params_array = [] ;
					  	_params_array['prepromptquestion'] = null ;
						_params_array['promptquestion'] = "Confirm to extend "+_plane_def+" (y|n) ? " ;
						_params_array['yes_fn'] = function() { circles_lib_interface_extend( _opt, NO, null, _out_channel ); }
						_params_array['ifquestiondisabled_fn'] = function() { circles_lib_interface_extend( _opt, YES, null, _out_channel ); }
						if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
						else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
					}
					else { _b_fail = YES, _error_str = "Missing input plane specification" ; }
                }
				else { _b_fail = YES, _error_str = "Missing input plane specification" ; }
                break ;
                case "hide":
				var _params_array = [] ;
				_params_array['prepromptquestion'] = null ;
				_params_array['promptquestion'] = "Confirm to hide the interface? " ;
				_params_array['yes_fn'] = function() { circles_lib_interface_toggle( INTERFACE_FORCE_HIDE, _out_channel ); }
				_params_array['ifquestiondisabled_fn'] = function() { circles_lib_interface_toggle( INTERFACE_FORCE_HIDE, _out_channel ); }
				if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
				else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                break ;
                case "reset":
                if ( _cmd_params['plane'] != null )
                {
										  var _plane_type = circles_lib_plane_get_value( _cmd_params['plane'] ) ;
										  if ( _plane_type != NO_PLANE )
										  {
													var _plane_def = circles_lib_plane_def_get( _plane_type ) ;
													var _opt = 0 ;
													if ( _plane_type == Z_PLANE ) _opt = INTERFACE_EXTEND_ZPLANE ;
													else if ( _plane_type == W_PLANE ) _opt = INTERFACE_EXTEND_WPLANE ;

									     		var _params_array = [] ;
											     	  _params_array['prepromptquestion'] = null ;
								     		 			_params_array['promptquestion'] = "Confirm to reset "+_plane_def+" ? " ;
												     	_params_array['yes_fn'] = function() { circles_lib_interface_reset( _opt, YES, NO, YES, _out_channel ); }
												     	_params_array['ifquestiondisabled_fn'] = function() { circles_lib_interface_reset( _opt, YES, NO, YES, _out_channel ); }
						if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
						else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
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
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "show":
				var _params_array = [] ;
				_params_array['prepromptquestion'] = null ;
				_params_array['promptquestion'] = "Confirm to show the interface (y|n) ? " ;
				_params_array['yes_fn'] = function() { circles_lib_interface_toggle( INTERFACE_FORCE_SHOW, _out_channel ); }
				_params_array['ifquestiondisabled_fn'] = function() { circles_lib_interface_toggle( INTERFACE_FORCE_SHOW, _out_channel ); }
				if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
				else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                break ;
                default: break ;
            }
         }
     }
     else { _b_fail = YES, _error_str = "Missing params" ; }
     
     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}