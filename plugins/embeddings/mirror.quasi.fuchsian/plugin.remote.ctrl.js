function CIRCLESembeddingsMIRRORQUASIFUCHSIAN_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESembeddingsMIRRORQUASIFUCHSIANremotectrl( _options, _return_fn, _ret_array, _out_channel )
{
	if ( !is_array( _options ) )
	{
       if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
	   return NO ;
	}

	var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "embeddings", base_id : "mirror.quasi.fuchsian" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
	switch( _options[0].toLowerCase() )
	{
        case "close":
        var _sub = "embeddings", _base_id = "mirror.quasi.fuchsian".replace( /[\.\_\-]/g, '' ) ;
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        circles_lib_plugin_activate( NO, _base_id, '', '', _sub, CLOSE, _div_id );
        _ret_array.push( YES, "<green>Plug-in has been closed with success</green>" ) ;
        return YES ;
        break ;
		case "focus":
        var _sub = "embeddings", _base_id = "mirror.quasi.fuchsian" ;
        circles_lib_plugin_focus( _div_id );
        _ret_array.push( YES, "<green>Plug-in has been focused with success</green>" ) ;
        return YES;
        break ;
		case "info.params":
        _ret_array.push( YES, "<green>Param identifiers for the Earle plugin: 'tau'</green> and 'p' for the solutions selector" ) ;
		return YES ;
		break ;
		case "init":
        CIRCLESembeddingsMIRRORQUASIFUCHSIAN_INIT(NO,YES);
	    CIRCLESembeddingsMIRRORQUASIFUCHSIAN_COMP();
		GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
        CIRCLESembeddingsMIRRORQUASIFUCHSIAN_CONFIG(); GLOB_PLUGIN_WIZARD_STEP(1.1,YES); GLOB_PLUGIN_GENS_SHOW(YES);
		CIRCLESembeddingsMIRRORQUASIFUCHSIAN_RECORD_PARAMS();
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;
        _ret_array.push( YES, "<green>Group has been init with success</green>" ) ;
		return YES ;
		break ;
		case "move":
        var _sub = "embeddings", _base_id = "mirror.quasi.fuchsian" ;
		var _ret = move_div( _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toUpperCase() : "TOP" );
        _ret_array.push( YES, "<green>Plug-in has been moved with success</green>" ) ;
        return YES ;
		break ;
		case "open":
        _ret_array.push( 1, "<green>Plug-in has been opened with success</green>" ) ;
        return YES ;
		break ;
		case "render":
		GLOB_PLUGIN_WIZARD_STEP(2.1,null,null,W_PLANE,YES);
        _ret_array.push( YES, "<green>Rendering has been started up</green>" ) ;
		return YES ;
		break ;
		case "update.params":
		var _switch_to = 0, _param_id = "", _param_ids = [ "tau" ], _p_sum = 0 ;
		for( var _i = 1 ; _i < _options.length ; _i++ )
		{
			_param_id = _options[_i].trim().toLowerCase();
			if ( _param_id.length == 0 ) continue ;
			else if ( _param_ids.includes( _param_id ) ) _switch_to = _param_ids.indexOf( _param_id )+1 ;
			else
			{
				switch( _switch_to )
				{
					case 1:
					CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau = _options[_i] ;
					$("#PLUGIN_PARAM_TAU").val( CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau );
					_p_sum++ ;
					break ;
					default:
					_ret_array.push( NO, "<orange>Unknown input param ID '"+_param_id+"'</orange>" ) ;
					return NO ;
					break ;
				}
			}
		}
		_out_msg = _p_sum != 0 ? "<green>Params have been updated with success</green>" : "<orange>Not all params have been set up. Allowed ids for this plug-in are: "+_param_ids.join(", ")+"</orange>" ;
		_ret_array.push( YES, _out_msg ) ;
		return YES ;
		break ;
		default:
        _ret_array.push( NO, "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ) ;
        return NO ;
		break ;
	}

	if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}