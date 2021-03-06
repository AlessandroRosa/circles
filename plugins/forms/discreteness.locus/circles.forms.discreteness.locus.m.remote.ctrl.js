function CIRCLESformsDISCRETENESSLOCUS_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESformsDISCRETENESSLOCUSremotectrl( _options, _return_fn, _ret_array, _out_channel )
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
        var _sub = "forms", _base_id = "discreteness.locus".replace( /[\.\_\-]/g, '' ) ;
		CIRCLESformsDISCRETENESSLOCUSdispatcher(POPUP_DISPATCHER_UNICAST_EVENT_CLOSE);
        circles_lib_plugin_activate( NO, _base_id, '', '', _sub, CLOSE, _div_id );
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
  		case "tab":
		var _found = 0 ;
		var _tab_name = _options[1].toLowerCase().trim() ;
		switch( _tab_name )
		{
			case "diagram":
			$('#CIRCLESformsDISCRETENESSLOCUSmainDIV').get(0).tabber.tabShow(0);
			_found = 1 ;
			break ;
			case "calcs":
			$('#CIRCLESformsDISCRETENESSLOCUSmainDIV').get(0).tabber.tabShow(1);
			_found = 1 ;
			break ;
			case "points":
			$('#CIRCLESformsDISCRETENESSLOCUSmainDIV').get(0).tabber.tabShow(2);
			_found = 1 ;
			break ;
			case "farey":
			$('#CIRCLESformsDISCRETENESSLOCUSmainDIV').get(0).tabber.tabShow(3);
			_found = 1 ;
			break ;
			case "tunings":
			$('#CIRCLESformsDISCRETENESSLOCUSmainDIV').get(0).tabber.tabShow(4);
			_found = 1 ;
			break ;
			case "benchmark":
			$('#CIRCLESformsDISCRETENESSLOCUSmainDIV').get(0).tabber.tabShow(5);
			_found = 1 ;
			break ;
			case "misc":
			$('#CIRCLESformsDISCRETENESSLOCUSmainDIV').get(0).tabber.tabShow(6);
			_found = 1 ;
			break ;
			default: break ;
		}
		_tab_name = _tab_name.replace( /\./g, ' ' );
		_ret_array.push( _found, !_found ? "<red>Fail to switch to unknown tab '"+_tab_name+"'</red>" : "<green>Switched to tab '"+_tab_name+"' with success</green>" ) ;
		return YES ;
		break ;
		default:
	    _ret_array.push( 0, "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ) ;
        return NO ;
		break ;
	}

	if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}