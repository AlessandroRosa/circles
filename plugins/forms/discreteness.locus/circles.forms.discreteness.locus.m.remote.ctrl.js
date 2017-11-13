function CIRCLESformsDISCRETENESSLOCUS_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESformsDISCRETENESSLOCUSremotectrl( _options, _return_fn, _ret_array, _output_channel )
{
	if ( !is_array( _options ) )
	{
       if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
	   return NO ;
	}

	var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "discreteness.locus" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
	switch( _options[0].toLowerCase() )
	{
        case "close":
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        var _sub = "forms", _base_id = "discreteness.locus" ;
        circles_lib_plugin_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ] );
		_ret_array.push( 1, "<green>Plug-in has been closed with success</green>" ) ;
        return YES ;
        break ;
		case "focus":
        var _sub = "forms", _base_id = "discreteness.locus" ;
		circles_lib_plugin_focus( _div_id );
        _ret_array.push( 1, "<green>Plug-in has been focused with success</green>" ) ;
        return YES;
        break ;
        case "get.point":
        $( "#CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT" ).val( _options[1] );
        CIRCLESformsDISCRETENESSLOCUSplotCOMPLEXPT( null, 1 ) ;
        GLOB_PLUGIN_PARAMS_FILLER( parse_complex_from_string( _options[1] ) );
		_ret_array.push( 1, "<green>Point at "+_options[1]+" has been picked up with success</green>" ) ;
        return 1 ;
        break ;
		case "move":
        var _sub = "forms", _base_id = "discreteness.locus" ;
		var _ret = move_div( _plugin_tmp_vars_array[_sub][_base_id.replace( /[\.\_\-]/g, '' )], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toLowerCase() : "TOP" );
        _ret_array.push( 1, "<green>Plug-in has been moved with success</green>" ) ;
        return YES ;
		break ;
		case "open":
        _ret_array.push( 1, "<green>Plug-in has been opened with success</green>" ) ;
        return YES ;
		break ;
		default:
	    _ret_array.push( 0, "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ) ;
        return NO ;
		break ;
	}

	if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}