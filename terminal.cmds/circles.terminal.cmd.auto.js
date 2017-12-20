_glob_terminal_cmd_files_include[ "auto" ] = [ "refresh" ] ;

function circles_terminal_cmd_auto()
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
    var _b_fail = 0 ;
    var _curr_autorefresh_set = _glob_terminal_autorefresh ;
    var _curr_autoinit_set = _glob_terminal_autoinit_enable ;
    var _fail_flag_array = [];
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    else if ( _params.length > 0 )
    {
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['keywords'] = NO ;
        _cmd_params['mode'] = 0 ;
        _cmd_params['action'] = "" ;
        _cmd_params['all'] = NO ;
        _cmd_params['plane'] = "wplane" ;
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
		var _cmd_terms_dict = [];
   		_cmd_terms_dict.push( "all", "init", "wplane", "off", "on", "refresh", "zplane", "html" );
        circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else if ( _p.is_one_of_i( "html", "init", "refresh", "release" ) ) _cmd_params['action'] = _p ;
            else if ( _p.is_one_of_i( "zplane", "wplane" ) ) _cmd_params['plane'] = _p ;
            else if ( _p.stricmp( "off" ) ) _cmd_params['mode'] = OFF ;
            else if ( _p.stricmp( "on" ) ) _cmd_params['mode'] = ON ;
            else if ( _p.stricmp( "all" ) ) _cmd_params['all'] = YES ;
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
        }
         
        var _items_n = circles_lib_count_items(), _action = _cmd_params['action'] ;
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
        else if ( _action.strcmp( "release" ) ) circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
        else if ( !_b_fail )
        {
            var _all = _cmd_params['all'], _mode = _cmd_params['mode'] ;

            if ( _action.stricmp( "init" ) || _all ) _glob_terminal_autoinit_enable = _mode ;
            var _autorefresh_label = "" ;
            if ( _action.stricmp( "refresh" ) || _all )
            {
				_glob_terminal_autorefresh = _mode ;
				var _already_refresh = ( _curr_autorefresh_set == _glob_terminal_autorefresh && _fail_flag_array['refresh'] != 1 ) ? "already " : "" ;
				var _already_init = ( _curr_autoinit_set == _glob_terminal_autoinit_enable && _fail_flag_array['init'] != 1 ) ? "already " : "" ;

				switch( _glob_terminal_autorefresh )
				{
					case 1 : _autorefresh_label = "Auto-refresh is "+_already_refresh+"on" ; break ;
					default : _autorefresh_label = "Auto-refresh is "+_already_refresh+"off" ; break ;
				}

                if ( _fail_flag_array['refresh'] != 1 )
                {
                    if ( _params.length == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, _autorefresh_label, _par_1, _cmd_tag );
                    else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _autorefresh_label, _par_1, _cmd_tag );
                }
            }

            var _autoinit_label = "" ;
            switch( _glob_terminal_autoinit_enable )
            {
                case 1 : _autoinit_label = "Auto-initialization of groups is "+_already_init+"on" ; break ;
                default : _autoinit_label = "Auto-initialization of groups is "+_already_init+"off" ; break ;
            }

            if ( _all || _action.stricmp( "init" ) )
            {
                if ( _params.length == 0 ) _autoinit_label = "Current " + _autoinit_label.toLowerCase();
                if ( _fail_flag_array['init'] != 1 )
                {
                    if ( _params.length == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, _autoinit_label, _par_1, _cmd_tag );
                    else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _autoinit_label, _par_1, _cmd_tag );
                }
            }
        }
    }
    else {
		circles_lib_output( _out_channel, DISPATCH_INFO, "Auto-refresh is "+(_glob_terminal_autorefresh?"on":"off"), _par_1, _cmd_tag );
		circles_lib_output( _out_channel, DISPATCH_INFO, "Auto-initialization of groups is "+(_glob_terminal_autoinit_enable?"on":"off"), _par_1, _cmd_tag );
	}
	
    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
		circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}