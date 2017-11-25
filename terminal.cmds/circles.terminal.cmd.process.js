_glob_terminal_cmd_files_include[ "process" ] = [ "init", "refresh" ] ;

function circles_terminal_cmd_process()
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
        _params_assoc_array['method'] = METHOD_NONE ;
        _params_assoc_array['process'] = PROCESS_NONE ;
        _params_assoc_array['process_def'] = "" ;
         
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); 
        // pre-scan for levenshtein correction
  		var _local_cmds_params_array = [];
    	_local_cmds_params_array.push( PROCESS_BREADTHFIRST_CMD_DEF, PROCESS_RANDOM_CMD_DEF, PROCESS_INDEXSEARCH_CMD_DEF,
						 															  "release", "reset", "none", "html", "help" );
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.stricmp( "reset" ) ) _params_assoc_array['reset'] = YES ;
            else if ( _p.stricmp( PROCESS_BREADTHFIRST_CMD_DEF ) ) { _params_assoc_array['process_def'] = _p ; _params_assoc_array['process'] = PROCESS_BREADTHFIRST ; }
            else if ( _p.stricmp( PROCESS_INDEXSEARCH_CMD_DEF ) )  { _params_assoc_array['process_def'] = _p ; _params_assoc_array['process'] = PROCESS_INDEXSEARCH ; }
            else if ( _p.stricmp( PROCESS_RANDOM_CMD_DEF ) ) { _params_assoc_array['process_def'] = _p ; _params_assoc_array['process'] = PROCESS_RANDOM ; }
            else if ( _p.stricmp( "none" ) ) { _params_assoc_array['process_def'] = _p ; _params_assoc_array['process'] = PROCESS_NONE ; }
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
            var _current_method = circles_lib_method_get() ;
            switch( _action )
            {
                case "release":
                circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                default:
           		if ( _current_method == METHOD_NONE )
           		{
					_glob_terminal_critical_halt = _b_fail = YES ;
      				_glob_terminal_critical_halt_msg = _error_str = "No method has been chosen yet" ;
      			}
      			else
      			{
      		        var _method_str = "", _pr = _params_assoc_array['process'] ;
      		        if ( _params_assoc_array['reset'] != null || ( _current_method == METHOD_NONE && _pr == PROCESS_NONE ) )
      		        {
      		            if ( _params_assoc_array['reset'] != null ) { _current_method = METHOD_NONE, _pr = PROCESS_NONE ; }
      		            circles_lib_process_set( _pr ), circles_lib_method_set( _current_method ) ;
      		        }
      		        else if ( _current_method.is_one_of( METHOD_INVERSION, METHOD_NONE ) )
      		        {
      		            circles_lib_process_set( PROCESS_NONE );
      		            circles_lib_method_set( _current_method );
						var _msg = "Current method is set to 'Inversion'" ;
						_msg += _glob_crlf + "Therefore no process has to be chosen and it will be set to 'none'" ;
						circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
      		        }
      		        else if ( _current_method == METHOD_ALGEBRAIC )
      		        {
                        if ( _pr == PROCESS_NONE ) _pr = PROCESS_BREADTHFIRST ;
      		            if ( _pr.is_one_of( PROCESS_BREADTHFIRST, PROCESS_INDEXSEARCH, PROCESS_RANDOM ) ) circles_lib_process_set( _pr );
      		            else { _b_fail = YES, _error_str = "Invalid input process for 'algebraic' method" ; }
      		        }
                    circles_lib_menu_entries_update();
      			}
                break ;
            }
        }
    }
     
    if ( !_b_fail )
    {
        var _method_label = circles_lib_method_get_def( _glob_method ), _process_label = circles_lib_process_get_def( _glob_process );
        var _prefix = _params.length == 0 ? "Current" : "New" ;
        var _MSG_TYPE = _params.length == 0 ? DISPATCH_INFO : DISPATCH_SUCCESS ;
        if ( _glob_method == METHOD_NONE ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Current method is none", _par_1, _cmd_tag );
        else
		{
			circles_lib_output( _output_channel, _MSG_TYPE, "Current method is " + _method_label, _par_1, _cmd_tag );
            if ( _glob_method == METHOD_ALGEBRAIC )
			circles_lib_output( _output_channel, _glob_process == PROCESS_NONE ? DISPATCH_WARNING : DISPATCH_SUCCESS , _prefix + " process is " + _process_label, _par_1, _cmd_tag );
		}
    }
    else if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION )
		circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}