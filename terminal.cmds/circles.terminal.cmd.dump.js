function circles_terminal_cmd_dump()
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
    var _error_str = "" ;
    var _dumping_obj = "" ;
    var _out_text_str = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['obj'] = null ;
		_cmd_params['def'] = "" ;
        _cmd_params['keywords'] = NO ;
		
		var _OK_ASSIGN = 1, _NO_ASSIGN = 0 ;
		var _components = [] ;
			_components['seeds'] = "_glob_seeds_array";
			_components['generators'] = "_glob_gens_array" ;
			_components['stdpalette'] = "_glob_def_clrs_tags" ;
			_components['alphabet'] = "_glob_alphabet" ;
			_components['popups'] = "_glob_popups_array" ;
			_components['repetends'] = "_glob_repetends_array" ;
			_components['storage'] = "_glob_storage" ;
			_components['stdmaps'] = "_glob_maps" ;
			_components['automatons'] = "_glob_automatons_src_words_array" ;
			_components['latexoptions'] = "_glob_latex_options" ;
			_components['statusbar'] = "_glob_status_bar_settings" ;
			_components['terminalcounter'] = "_glob_terminal_windows_counter" ;
			
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        //pre-scan for levenshtein correction
    	var _cmd_terms_dict = [];
    	_cmd_terms_dict.push( "exec", "release", "html", "help", "seeds", "generators" );
        circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i];
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else if ( _p.stricmp( "seeds" ) ) { _cmd_params['def'] = _p ; _cmd_params['obj'] = "_glob_seeds_array" ; }
            else if ( _p.stricmp( "generators" ) ) { _cmd_params['def'] = _p ; _cmd_params['obj'] = "_glob_gens_array" ; }
			else if ( _cmd_params['action'] == "exec" ) _cmd_params['exec_str'].push( _p );
            else _cmd_params['obj'] = _p ;
        }

        if ( _cmd_params['help'] )
		{
			circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
			var _keys = _components.keys_associative();
			circles_lib_output( _out_channel, DISPATCH_INFO, "", _msg, _par_1, _cmd_tag );
			circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "Standard objects : <white>"+_keys.join( ", " )+"</white>", _msg, _par_1, _cmd_tag );
		}
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
				_dumping_obj = _components[ _cmd_params['obj'] ] != null ? _components[ _cmd_params['obj'] ] : _cmd_params['obj'] ;
                try{ eval( "_out_text_str = dump( "+_dumping_obj+" );" ); }
                catch( _err ){ circles_lib_error_obj_handler( _err ); }

				_out_text_str = _out_text_str.replace( /(\')(.*?)(\')/gi, "$1<yellow>$2</yellow>$3" );
				_out_text_str = _out_text_str.replace( /(\")(.*?)(\")/gi, "$1<lightblue>$2</lightblue>$3" );
				_out_text_str = _out_text_str.replaceAll( "=>", "<white>:</white>" );

                if ( _out_text_str.length == 0 )
                circles_lib_output( _out_channel, DISPATCH_INFO, "Object '"+_cmd_params['def']+"' is empty", _par_1, _cmd_tag );
                else circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _out_text_str, _par_1, _cmd_tag );
                break;
            }
        }
    }
    else { _b_fail = YES, _error_str = "Missing obj to dump" ; }
     
    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
		 circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ).strip_tags()+_glob_crlf+"Type '"+_cmd_tag+" /h' for syntax help", _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_str ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}