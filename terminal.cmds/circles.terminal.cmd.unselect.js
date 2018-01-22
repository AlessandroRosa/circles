_glob_terminal_cmd_files_include[ "unselect" ] = [ "refresh" ] ;

function circles_terminal_cmd_unselect()
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
    var _items_n = circles_lib_count_items();
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
        _cmd_params['plane'] = _glob_target_plane ;
        _cmd_params['help'] = NO ;
        _cmd_params['keywords'] = NO ;
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['symbol'] = [] ;

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _cmd_terms_dict = [];
    		_cmd_terms_dict.push( "zplane", "release", "html", "help" );
        circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
            else if ( _p.is_one_of( "html", "all" ) ) _cmd_params[_p] = YES ;
            else if ( _p.length == 1 && _p.isAlpha() ) _cmd_params['symbol'].push( _p );
            else if ( _p.stricmp( "zplane" ) ) _cmd_params['plane'] = _p.trim();
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
                if ( _items_n == 0 ) { _b_fail = YES, _error_str = "Fail to unselect: " + _ERR_33_01 ; }
                else if ( _cmd_params['symbol'].length == 0 && _cmd_params['all'] == null )  { _b_fail = YES, _error_str = "Missing input symbols" ; }
                else if ( _glob_alphabet.length > 0 && ( _cmd_params['symbol'].length > 0 || _cmd_params['all'] != null ) )
                {
                    circles_lib_items_unselect(NO,NO,_out_channel);
					var _remains = [] ;
					if ( _cmd_params['all'] == null || _cmd_params['symbol'].length > 0 )
					_glob_alphabet.forEach( function( _sym ){ if ( _cmd_params['symbol'].not_includes( _sym ) ) _remains.push( _sym ); } )
					
					var _plane_str = "" ;
                    if ( _glob_target_plane != NO_PLANE )
                    {
                        if ( _glob_target_plane.is_one_of( Z_PLANE, ALL_PLANES ) ) _plane_str = "zplane" ;
                        else { _b_fail = YES, _error_str = "Unselect is available for Z-plane exclusively" ; }
                    }
                    else
                    {
                        _plane_str = is_array( _cmd_params ) ? _cmd_params['plane'] : "zplane" ;
                        _plane_str = _plane_str.trim();
                        if ( _plane_str.length == 0 ) _plane_str = "zplane" ;
                    }
                        
                    _plane_str += " silent" ; // no need to confirm anything for unselection
                    if ( _plane_str.length > 0 ) circles_lib_terminal_interpreter( "refresh "+_plane_str, _glob_terminal, _out_channel );
					
					if ( _cmd_params['symbol'].length > 0 )
					circles_lib_output( _out_channel, DISPATCH_INFO, "Unselecting disks: "+_cmd_params['symbol'].join(","), _par_1, _cmd_tag );
					
					if ( _remains.length > 0 ) circles_lib_terminal_interpreter( "disk select " + _remains.join( " " ), _glob_terminal, _out_channel );
					else { _b_fail = YES, _error_str = "Missing input symbol(s)" ; }
                }
                break ;
            }
        }
    }
    else{ _b_fail = YES, _error_str = "Missing input" ; }

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}