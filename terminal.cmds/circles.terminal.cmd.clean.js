function circles_terminal_cmd_clean()
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

	var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
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
        _cmd_params['help'] = NO ;
         
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); _params_array.clean_from( "" );
        // pre-scan for levenshtein correction
  		var _local_cmds_params_array = [];
   				 _local_cmds_params_array.push( "release", "html", "help", "zplane", "z-plane", "wplane", "w-plane", "bip", "bipbox" );
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
            else if ( _p.is_one_of_i( "terminal", "console" ) ) _cmd_params['action'] = "" ; // default action: clean the console
            else if ( _p.is_one_of_i( "zplane", "z-plane", "wplane", "w-plane", "bip", "bipbox" ) )
			{
				_cmd_params['action'] = "clean.plane" ;
				if ( !is_array( _cmd_params['plane'] ) ) _cmd_params['plane'] = [] ;
				_cmd_params['plane'].push( _p ) ;
			}
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else { _b_fail = YES ; _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
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
			case "clean.plane":
			_cmd_params['plane'].forEach( function( _plane_def )
			{
				switch( _plane_def )
				{
					case "z-plane":
					case "zplane":
					var _layers_pile = circles_lib_canvas_layer_pile_get(Z_PLANE) ;
					_layers_pile.forEach( function( _layer ) { circles_lib_canvas_clean( _layer, _layer.get_backgroundcolor(), _out_channel ); } );
					circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, NO, NO, YES, NO, _out_channel ) ;
					circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Z-plane has been cleaned with success", _par_1, _cmd_tag );
					break ;
					case "w-plane":
					case "wplane":
					var _layers_pile = circles_lib_canvas_layer_pile_get(W_PLANE) ;
					_layers_pile.forEach( function( _layer ) { circles_lib_canvas_clean( _layer, _layer.get_backgroundcolor(), _out_channel ); } );
					circles_lib_canvas_render_wplane( null, wplane_sm, null, YES, YES, NO, NO, NO, YES, _out_channel ) ;
					circles_lib_output( _out_channel, DISPATCH_SUCCESS, "W-plane has been cleaned with success", _par_1, _cmd_tag );
					break ;
					case "bip":
					case "bipbox":
					circles_lib_canvas_clean( _glob_bipbox_canvas, _glob_bipbox_canvas.get_backgroundcolor(), _out_channel );
					circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Bip Box has been cleaned with success", _par_1, _cmd_tag );
					break ;
					default:
					_b_fail = 1 ; _error_str = "Invalid input plane" ;
					break ;
				}
			} ) ;
			break ;
            case "release":
            circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
            break ;
            default:
            if ( _glob_terminal != null && _out_channel == OUTPUT_TERMINAL ) { _glob_terminal.clear(); _glob_terminal.greetings(); }
            else if ( _out_channel == OUTPUT_SCRIPT ) $("#POPUPbatchCOMPILERoutputDIV").html( "" );
            break ;
        }
    }

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}