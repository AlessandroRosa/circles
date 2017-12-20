function circles_terminal_cmd_triggers()
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
	
	var _plugin_on = typeof CIRCLESformsTRIGGERSremotectrl === "function" ? true : false ;

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    else if ( _params.length > 0 )
    {
		_cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
		_cmd_params['keywords'] = NO ;
		_cmd_params['help'] = NO ;
         
		var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
		_params_array.clean_from( " " ); _params_array.clean_from( "" );
		// pre-scan for levenshtein correction
		var _cmd_terms_dict = [];
			_cmd_terms_dict.push( "all-on", "check", "all-off", "html", "help", "list", "release", "run", "uncheck", "verbose" );
		circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
		var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "all-off", "all-on", "check", "list", "release", "run", "uncheck" ) ) _cmd_params['action'] = _p ;
			else if ( _p.stricmp( "verbose" ) ) _cmd_params['verbose'] = YES ;
			else if ( is_string( _cmd_params['action'] ) )
			{
				if ( _cmd_params['action'].is_one_of_i( "check", "uncheck" ) )
				{
					if ( _cmd_params['checklist'] == null ) _cmd_params['checklist'] = [] ;
					if ( _p.testME( _glob_positive_integer_regex_pattern ) ) _cmd_params['checklist'].push( _p );
				}
			}
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else { _b_fail = YES ; _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
        }
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
         var _action = _cmd_params['action'] != null ? _cmd_params['action'] : "" ;
         switch( _action )
         {
			case "all-off":
			var _keys = _glob_triggers_table.is_associative() ? _glob_triggers_table.keys_associative() : _glob_triggers_table ;
			var _n_triggers = safe_size( _keys, 0 );
			if ( _n_triggers > 0 )
			{
				for( _k = 0 ; _k < _n_triggers ; _k++ ) _glob_triggers_table[''+_keys[_k]][4] = NO ;
				circles_lib_output( _out_channel, DISPATCH_SUCCESS, "All triggers have been set to 'off'", _par_1, _cmd_tag );
				if ( _plugin_on ) CIRCLESformsTRIGGERSremotectrl( [ "updatelist" ] );
			}
			else circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform operation: no triggers found", _par_1, _cmd_tag );
			break ;
			case "all-on":
			var _keys = _glob_triggers_table.is_associative() ? _glob_triggers_table.keys_associative() : _glob_triggers_table ;
			var _n_triggers = safe_size( _keys, 0 );
			if ( _n_triggers > 0 )
			{
				for( _k = 0 ; _k < _n_triggers ; _k++ ) _glob_triggers_table[''+_keys[_k]][4] = YES ;
				circles_lib_output( _out_channel, DISPATCH_SUCCESS, "All triggers have been set to 'on'", _par_1, _cmd_tag );
				if ( _plugin_on ) CIRCLESformsTRIGGERSremotectrl( [ "updatelist" ] );
			}
			else circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform operation: no triggers found", _par_1, _cmd_tag );
			break ;
			case "check":
			if ( is_consistent_array( _cmd_params['checklist'] ) )
			{	
				_cmd_params['checklist'].sort();
				var _keys = _glob_triggers_table.is_associative() ? _glob_triggers_table.keys_associative() : _glob_triggers_table ;
				var _n_triggers = safe_size( _keys, 0 );
				if ( _n_triggers > 0 )
				{
					_cmd_params['checklist'].forEach( function( _i )
					{
						if ( _i > 0 )
						{
							if ( _glob_triggers_table[''+_keys[_i-1]] != null )
							{
								_glob_triggers_table[''+_keys[_i-1]][4] = YES ;
								var _title = _glob_triggers_table[''+_keys[_i-1]][0] ;
								circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lime>Trigger #"+_i+"</lime> <white>"+_title+"</white> <lime>has been checked with success</lime>", _par_1, _cmd_tag );
							}
							else circles_lib_output( _out_channel, DISPATCH_WARNING, "No trigger matches to index #"+_i, _par_1, _cmd_tag );
						}
					} );
					if ( _plugin_on ) CIRCLESformsTRIGGERSremotectrl( [ "updatelist" ] );
				}
				else circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform check: no triggers found", _par_1, _cmd_tag );
			}
			else circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing indexed list to check the triggers", _par_1, _cmd_tag );
			break ;
			case "list":
			var _v = safe_int( _cmd_params['verbose'], 0 ) ;
			var _keys = _glob_triggers_table.is_associative() ? _glob_triggers_table.keys_associative() : _glob_triggers_table ;
			var _n_triggers = safe_size( _keys, 0 );
		    var _trigger_chunk, _title, _desc, _k ;
			circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<white>Found "+_n_triggers+" trigger"+(_n_triggers==1?"":"s")+"</white>", _par_1, _cmd_tag );
		    for( _k = 0 ; _k < _n_triggers ; _k++ )
		    {
				_trigger_chunk = _glob_triggers_table[''+_keys[_k]];
				if ( _trigger_chunk != null )
				{
				   _title = _trigger_chunk[0].stripslashes(), _desc = _trigger_chunk[1].stripslashes(), _auto = safe_int( _trigger_chunk[4], 0 );
				   circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, (_k+1)+") <yellow>"+_title+"</yellow> | <"+(_auto?"green":"orange")+">"+(_auto?"":"no ")+"autorun</"+(_auto?"green":"orange")+">", _par_1, _cmd_tag );
				   if ( _v ) circles_lib_output( _out_channel, DISPATCH_INFO, _desc, _par_1, _cmd_tag );
				}
		    }
			break ;
            case "release":
            circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
            break ;
			case "run":
			var _ret_chunk = circles_lib_triggers_open_all_automated_entries(NO, _out_channel);
			circles_lib_output( _out_channel, _ret_chunk[0] == RET_OK ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_chunk[1], _par_1, _cmd_tag ) ;
			circles_lib_output( _out_channel, _ret_chunk[0] == RET_OK ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_chunk[4], _par_1, _cmd_tag ) ;
			break ;
			case "uncheck":
			if ( is_consistent_array( _cmd_params['checklist'] ) )
			{	
				_cmd_params['checklist'].sort();
				var _keys = _glob_triggers_table.is_associative() ? _glob_triggers_table.keys_associative() : _glob_triggers_table ;
				var _n_triggers = safe_size( _keys, 0 );
				if ( _n_triggers > 0 )
				{
					_cmd_params['checklist'].forEach( function( _i )
					{
						if ( _i > 0 )
						{
							if ( _glob_triggers_table[''+_keys[_i-1]] != null )
							{
								_glob_triggers_table[''+_keys[_i-1]][4] = NO ;
								var _title = _glob_triggers_table[''+_keys[_i-1]][0] ;
								circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lime>Trigger #"+_i+"</lime> <white>"+_title+"</white> <lime>has been unchecked with success</lime>", _par_1, _cmd_tag );
							}
							else circles_lib_output( _out_channel, DISPATCH_WARNING, "No trigger matches to index #"+_i, _par_1, _cmd_tag );
						}
					} );
					if ( _plugin_on ) CIRCLESformsTRIGGERSremotectrl( [ "updatelist" ] );
				}
				else circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform uncheck: no triggers found", _par_1, _cmd_tag );
			}
			else circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing indexed list to uncheck the triggers", _par_1, _cmd_tag );
			break ;
            default:
			_b_fail = YES, _error_str = _action ? "Unknown action '"+_action+"'" : "Missing action specification" ;
			break ;
         }
     }

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}