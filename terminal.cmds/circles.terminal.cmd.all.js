_glob_terminal_cmd_files_include[ "all" ] = [ "init", "refresh" ] ;

function circles_terminal_cmd_all()
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
    else if ( _params.length > 0 )
    {
        _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
        _params_assoc_array['keywords'] = NO ;
        _params_assoc_array['mode'] = UNDET ;
        _params_assoc_array['action'] = "" ;
        _params_assoc_array['palette'] = 0 ;
        _params_assoc_array['list'] = 0 ;
         
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [];
    	    _local_cmds_params_array.push( "draw", "fill", "on", "off", "html", "release" );
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.stricmp( "off" ) ) _params_assoc_array['mode'] = OFF ;
            else if ( _p.stricmp( "on" ) ) _params_assoc_array['mode'] = ON ;
            else if ( _p.is_one_of_i( "draw", "fill", "release" ) ) _params_assoc_array['action'] = _p ;
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
        else
        {
            var _action = _params_assoc_array['action'], _mode = _params_assoc_array['mode'] ;
            var _items_n = circles_lib_count_items();
            if ( _action.length == 0 )
            {
                _glob_terminal_echo_flag = _mode ;
                circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Silent mode is " + ( _glob_terminal_echo_flag == ENABLED ? "on" : "off" ), _par_1, _cmd_tag );

                if ( _glob_target_plane == NO_PLANE && _mode == 1 )
                circles_lib_output( _output_channel, DISPATCH_WARNING, "A plane must be chosen before setting the autorefresh on", _par_1, _cmd_tag );
                else
                {
                   _glob_terminal_autorefresh = _mode ;
                   circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Autorefresh is " + ( _glob_terminal_autorefresh == ENABLED ? "on" : "off" ), _par_1, _cmd_tag );
                }

                _glob_terminal_autoinit_enable = _mode ;
                circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Autoinit is " + ( _glob_terminal_autoinit_enable == ENABLED ? "on" : "off" ), _par_1, _cmd_tag );
                _glob_palette_use = _mode ;
                circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Palette is " + ( _glob_palette_use == 1 ? "on" : "off" ), _par_1, _cmd_tag );
            }
            else
            {
                switch( _action )
                {
                    case "release":
                    circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                    break ;
                    default:
                    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
					if ( _items_n > 0 )
		            {
	                    for( var _i = 0 ; _i < _items_n ; _i++ )
	                    {
	                        if ( is_circle( _items_array[_i].complex_circle ) )
	                        {
			                    if ( _action.length > 0 )
			                    {
									if ( _action == "draw" ) _items_array[_i].complex_circle.draw = _mode ;
					                else if ( _action == "fill" ) _items_array[_i].complex_circle.fill = _mode ;
								}
	                        }
			                else
			                {
			                    _b_fail = YES, _error_str = "At least one disk has not been initialized" ;
			                    break ;
			                }
			            }
			
	                    if ( !_b_fail )
			            {
			            	if ( _action.length > 0 )
			            	{
					            if ( _action == "draw" )
					            circles_lib_output( _output_channel, DISPATCH_SUCCESS, "All disks will" + ( _mode ? "" : " not" ) + " be drawn", _par_1, _cmd_tag );
					            else if ( _action == "fill" )
					            circles_lib_output( _output_channel, DISPATCH_SUCCESS, "All disks will" + ( _mode ? "" : " not" ) + " be filled", _par_1, _cmd_tag );
							}
			            }
			            else
			            {
			                if ( _action.length > 0 )
			                {
								if ( _action == "draw" )
				                circles_lib_output( _output_channel, DISPATCH_ERROR, "Fail to set " + ( _mode ? "up" : "down" ) + " draw option", _par_1, _cmd_tag );
				                else if ( _action == "fill" )
				                circles_lib_output( _output_channel, DISPATCH_ERROR, "Fail to set " + ( _mode ? "up" : "down" ) + " fill option", _par_1, _cmd_tag );
							}
			            }
			    
		                if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _output_channel );
		                if ( _glob_terminal_autorefresh )  circles_lib_terminal_interpreter( "refresh zplane wplane clean silent", _glob_terminal, _output_channel );
			
		                if ( _action.length > 0 )
		                {
	                        var _draw_affected = circles_lib_terminal_all_action_check( "draw" );
	                        var _fill_affected = circles_lib_terminal_all_action_check( "fill" );
	                        if ( _draw_affected == 0 && _fill_affected == 0 )
	                        circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: both draw and fill params are off, so W-plane disks won't be drawn and filled", _par_1, _cmd_tag );
	                        else if ( _fill_affected > 0 && circles_lib_terminal_all_fillcolor_not_set_check() > 0 && !_glob_palette_use )
	                        circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: some disks won't be filled cause the fill color property is missing", _par_1, _cmd_tag );
		                }
			        }
			        else circles_lib_output( _output_channel, DISPATCH_WARNING, "No action performed: " + _ERR_33_01, _par_1, _cmd_tag );
                    break ;
                }
            }
        }
    }
    else { _b_fail = YES, _error_str = "Missing input params" ; }

    if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function circles_lib_terminal_all_action_check( _action = "" )
{
    _action = safe_string( _action, "" ).trim();
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items();
    if ( _action.length == 0 || _items_n == 0 ) return UNDET ;
    else
    {
        var _n_affected = 0, _cc = null ;
        for( var _i = 0 ; _i < _items_n ; _i++ )
        {
            _cc = _items_array[_i].complex_circle ;
            if ( is_circle( _cc ) )
            {
                switch( _action )
                {
                    case "draw": if ( _items_array[_i].complex_circle.draw ) _n_affected++ ; break ;
                    case "fill": if ( _items_array[_i].complex_circle.fill ) _n_affected++ ; break ;
			        default: break ;
                }
            }
        }
            
        return _n_affected == 0 ? 0 : 1 ;
    }
}

function circles_lib_terminal_all_fillcolor_not_set_check()
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array );
    if ( _items_n == 0 ) return UNDET ;
    else
    {
        var _n_fillcolor_not_set = 0 ;
        for( var _i = 0 ; _i < _items_n ; _i++ )
        if ( _items_array[_i].complex_circle.fillcolor.length == 0 ) _n_fillcolor_not_set++ ;
        return _n_fillcolor_not_set ;
    }
}