_glob_terminal_cmd_files_include[ "init" ] = [ "refresh" ] ;

function circles_terminal_cmd_init()
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

    var _items_n = circles_lib_count_items();
	var _last_release_date = get_file_modify_date( _glob_paths['terminal_abs_cmds'], "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;

    var _cmd_params = [];
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['keywords'] = NO ;
        _cmd_params['zplaneitems'] = "" ;
        _cmd_params['initmask'] = INIT_NONE ;
        _cmd_params['grammars'] = [];
        _cmd_params['symbols'] = NO ;
        _cmd_params['auto'] = NO;
        _cmd_params['force'] = NO;

    var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" );
        // pre-scan for levenshtein correction
    var _cmd_terms_dict = [];
    	_cmd_terms_dict.push( "auto", "disks", "force", "symbols", "lock", "maps", "paired", "singly",
                                       "unlock", "release", "html", "help", "options" );
    circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );

    var _p ;
    for( var _i = 0 ; _i < _params_array.length ; _i++ )
    {
        _p = _params_array[_i].toLowerCase();
        if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
        else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
        else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
        else if ( _p.is_one_of( "html", "lock", "force", "symbols", "options" ) ) _cmd_params[_p] = YES ;
        else if ( _p.is_one_of( "all" ) ) _cmd_params['initmask'] = INIT_ALL ;
        else if ( _p.stricmp( "auto" ) )
        {
            _cmd_params['initmask'] = circles_lib_items_auto_recognition_group_params();
            _cmd_params['auto'] = YES ;
        }
        else if ( _p.stricmp( "disks" ) ) _cmd_params['initmask'] |= INIT_FROM_DISKS ;
        else if ( _p.stricmp( "maps" ) ) _cmd_params['initmask'] |= INIT_FROM_MAPS | INIT_CALC_CIRCLES ;
        else if ( _p.stricmp( "paired" ) ) _cmd_params['initmask'] |= INIT_PAIRED_ITEMS ;
        else if ( _p.stricmp( "singly" ) ) _cmd_params['initmask'] |= INIT_SINGLE_ITEMS ;
        else if ( _p.stricmp( "unlock" ) ) _cmd_params['lock'] = NO ;
        else if ( _p.is_one_of_i( "and", "from" ) ) _cmd_params['grammars'].push( _p );
        else if ( _p.length > 0 ) { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
    }

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    else if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
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
            var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
            if ( ( _glob_init_mask & INIT_LOCK ) != 0 && ( _cmd_params['initmask'] != INIT_NONE || _cmd_params['symbols'] ) )
            {
                var _msg = "<orange>Init options have been locked.</orange>"+_glob_crlf ;
                    _msg += "<orange>No modifications can be achieved.</orange>" ;
                circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
            }
            else if ( _cmd_params['options'] && !_b_fail )
            {
                var _none = _glob_init_mask == INIT_NONE ? YES : NO ;
                var _locked = _glob_init_mask & INIT_LOCK ? YES : NO ;
                var _use_disks = _glob_init_mask & INIT_FROM_DISKS ? YES : NO ;
                var _use_maps = _glob_init_mask & INIT_FROM_MAPS ? YES : NO ;
                var _singly_elements = _glob_init_mask & INIT_SINGLE_ITEMS ? YES : NO ;
                var _paired_elements = _glob_init_mask & INIT_PAIRED_ITEMS ? YES : NO ;
                var _options_report = [];
                    _options_report.push( "<snow>Reporting current init options</snow>" );
                    _options_report.push( "<lightblue>Current method</lightblue> " + ( _glob_method == METHOD_NONE ? "<red>Unknown</red>" : "<snow>"+circles_lib_method_get_def( _glob_method )+"</snow>" ) );
                    _options_report.push( "<lightblue>Options locked</lightblue> " + ( _locked ? "<green>yes</green>" : "<lightgray>no</lightgray>" ) );
                    _options_report.push( "<yellow>Init features</yellow>" );
                    _options_report.push( "<lightblue>Source item elements</lightblue> <green>"+( _use_disks ? "disks" : "maps" )+"</green>" );
                    _options_report.push( "<lightblue>Each item is picked up</lightblue> <green>" + ( _singly_elements ? "singly" : "paired entries" )+"</green>" );
                circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _options_report.join( _glob_crlf ), _par_1, _cmd_tag );
            }
            else if ( !is_array( _items_array ) )
            {
                _b_fail = YES, _error_str = "Memory failure: init mode has not been switched to seeds nor to gens yet" ;
                _error_str += _glob_crlf + "Use cmd 'config set items seeds' or 'config set items gens'" ;
            }
            else if ( _items_n == 0 && _glob_terminal_errors_switch )
            {
                _b_fail = YES, _error_str = "the maps list is empty" ;
                _glob_terminal_critical_halt = YES ;
                _glob_terminal_critical_halt_msg = _error_str ;
            }
            else if ( _cmd_params['lock'] != null && !_b_fail )
            {
                var _lock = _cmd_params['lock'] ? YES : NO ;
                if ( _lock ) _glob_init_mask |= INIT_LOCK ;
                else _glob_init_mask &= ~INIT_LOCK ;
                if ( ( _glob_init_mask & INIT_LOCK ) != 0 )
                {
                    var _msg = "<green>Init options have been locked.</green>"+_glob_crlf ;
                    _msg += "<lightgray>From now on, no modifications could be pursued.</lightgray>" ;
                    _msg += _glob_crlf + "<lightgray>Type 'init unlock' for reverse action.</lightgray>" ;
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                }
                else
                {
                    var _msg = "<green>Init options have been unlocked.</green>"+_glob_crlf ;
                    _msg += "<lightgray>Modifications can be pursued.</lightgray>" ;
                    _msg += _glob_crlf + "<lightgray>Type 'init lock' for reverse action.</lightgray>" ;
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                }
            }
            else if ( _items_n > 0 && !_b_fail )
            {
				var _init_mask = _glob_init_mask, _ret_chunk, _ret_id, _ret_msg ;
                if ( _cmd_params['auto'] )
                {
        			if ( _glob_method == METHOD_NONE )
        			{
      		            _ret_chunk = circles_lib_method_guess();
       		            _ret_id = safe_int( _ret_chunk[0], RET_IRRELEVANT );
        		    	var _ret_method = safe_int( _ret_chunk[1], METHOD_NONE );
						circles_lib_method_set( _ret_method ) ;
        		        var _method_str = circles_lib_method_get_def( _glob_method );
        		        circles_lib_output( _out_channel, DISPATCH_ERROR, "Method has not been set up yet, as required by init cmd", _par_1, _cmd_tag );
        		        circles_lib_output( _out_channel, DISPATCH_INFO, "From current group config, method has been guessed as '"+_method_str+"'", _par_1, _cmd_tag );
        		        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightgray>Automatic reset of init options.</lightgray>", _par_1, _cmd_tag );
        			}
        			else circles_lib_output( _out_channel, DISPATCH_INFO, "Current method is '"+circles_lib_method_get_def( _glob_method )+"'", _par_1, _cmd_tag );

                    _init_mask = safe_int( _cmd_params['initmask'], INIT_NONE );
                    _ret_chunk = circles_lib_items_init( UNDET, NO, YES, _init_mask | INIT_SYMBOLS, YES, _cmd_params['force'], _out_channel );
                    _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                    _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
            		if ( _ret_id.is_one_of( RET_OK, RET_IRRELEVANT ) ) circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _ret_msg, _par_1, _cmd_tag );
                    else { _b_fail = YES, _error_str = _ret_msg ; }
                }
                else
                {
                    if ( _cmd_params['symbols'] )
                    {
                        _ret_chunk = circles_lib_alphabet_autoconfig_all_symbols( !_glob_terminal_echo_flag, _glob_terminal_echo_flag, YES, YES, _out_channel );
                        _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                        _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Memory failure" ;
                        if ( _ret_id ) circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg.strip_tags(), _par_1, _cmd_tag );
                        else if ( _glob_terminal_errors_switch )
                        {
                          _b_fail = YES, _error_str = _ret_msg.strip_tags();
                          _glob_terminal_critical_halt = _ret_msg ;
                        }
                    }
                    else
                    {
                        _init_mask = safe_int( _cmd_params['initmask'], INIT_NONE ) ;
                        if ( _init_mask == INIT_NONE ) circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing init options", _par_1, _cmd_tag );
                        else
                        {
							var _ret_chunk = circles_lib_items_init( null, NO, YES, _init_mask, _glob_verbose, YES, _out_channel );
							var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
							var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
							switch( _ret_id )
							{
								case RET_OK:
								if ( _init_mask & INIT_SINGLE_ITEMS ) _ret_msg += _glob_crlf + "Letters assignment has been set to: singly items" ;
								else if ( _init_mask & INIT_PAIRED_ITEMS ) _ret_msg += _glob_crlf + "Items composition init has been set to: paired items" ;
                                        
								if ( _ret_id == RET_IRRELEVANT ) circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _ret_msg.strip_tags(), _par_1, _cmd_tag );
								else if ( _ret_id == RET_OK )
								{
									circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg.strip_tags(), _par_1, _cmd_tag );
									_glob_items_to_init = NO ;
									$('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
									$('[id$=renderBTN]').css('color',COLOR_ERROR) ;
								}
								else if ( _ret_id == RET_WARNING ) circles_lib_output( _out_channel, DISPATCH_WARNING, _ret_msg.strip_tags(), _par_1, _cmd_tag );
								else if ( _ret_id == RET_ERROR && _glob_terminal_errors_switch )
								{
									_glob_terminal_critical_halt = _b_fail = YES ;
									_glob_terminal_critical_halt_msg = _ret_msg.strip_tags();
									_error_str = "" ;
								}
								break ;
								case RET_ERROR:
								_b_fail = YES, _error_str = _ret_msg ;
								break ;
								case RET_WARNING:
								circles_lib_output( _out_channel, DISPATCH_WARNING, _ret_msg.strip_tags(), _par_1, _cmd_tag );
								break ;
								case RET_IRRELEVANT:
								default:
								circles_lib_output( _out_channel, DISPATCH_INFO, _ret_msg.strip_tags(), _par_1, _cmd_tag );
								break ;
							}
                        }
                    }
                }
        
                if ( _init_mask != INIT_NONE ) _glob_init_mask = _init_mask ;
                if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _out_channel );
            }
            break ;
         }

		_glob_items_to_init = NO ;
		$('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
    }
     
    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
    {
		_glob_items_to_init = YES ;
        $('[id$=initBTN]').css('color',COLOR_ERROR) ;
        circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ).strip_tags()+_glob_crlf+"Type '"+_cmd_tag+" /h' for syntax help", _par_1, _cmd_tag );
    }

    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}