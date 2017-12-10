function circles_terminal_cmd_benchmark()
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
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    else if ( _params.length > 0 )
    {
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['keywords'] = NO ;
         
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [];
			_local_cmds_params_array.push( "release", "html" );
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
		var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
		_cmd_params['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
		_cmd_params['dump_operator_index'] = _dump_operator_index ;
		_cmd_params['dump_array'] = [];
				
		// gather all dump parameters into one array
        if ( _cmd_params['dump'] )
        {
    		for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
    		if ( _params_array[_i].trim().length > 0 ) _cmd_params['dump_array'].push( _params_array[_i] );
        }
				 
        var _p ;
        // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
        var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
        for( var _i = 0 ; _i < _up_to_index ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
        }
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
            default:
            var _diff = _glob_benchmark_end_microtime - _glob_benchmark_start_microtime ;
			var _start_date = ( new Date( _glob_benchmark_start_microtime * 1000 ) ).toString();
				_start_date = _start_date.substr( 0, _start_date.indexOf( "GMT" ) ) ;
			var _end_date = ( new Date( _glob_benchmark_end_microtime * 1000 ) ).toString();
				_end_date = _end_date.substr( 0, _end_date.indexOf( "GMT" ) ) ;
				
            var _msg = "" ;
				_msg += "Process started at " + _start_date ;
				_msg += "\nDuration : " + safe_int( _diff, 0 ) + " second" + ( _diff == 1 ? "" : "s" );
				_msg += "\nProcess closed at " + _end_date ;
            circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );     
            if ( _cmd_params['dump'] )
            {
				_cmd_params['dump_array'] = is_array( _cmd_params['dump_array'] ) ? _cmd_params['dump_array'][0] : "circles.benchmark.txt" ;
    			var _ret_chunk = circles_lib_dump_data_to_format( _msg.strip_tags(), _cmd_params['dump_array'] );
    			var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
    			var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform dumping";
    			if ( _ret_id == 0 ) { _b_fail = YES, _error_str = _ret_msg ; }
    			else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
            }
            _out_text_string = _msg ;
             
            _fn_ret_val = { "duration" : secs, "start_unixtime" : _glob_benchmark_end_microtime, "end_unixtime" : _glob_benchmark_end_microtime } ;
            break ;
        }
    }

    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
		 circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}