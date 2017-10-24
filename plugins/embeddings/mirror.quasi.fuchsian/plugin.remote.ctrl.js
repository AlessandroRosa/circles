function CIRCLESembeddingsMIRRORQUASIFUCHSIAN_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESembeddingsMIRRORQUASIFUCHSIANremotectrl( _options, _return_fn, _ret_array, _output_channel )
{
		if ( !is_array( _options ) )
		{
       if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
			 return 0 ;
		}

		var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "embeddings", base_id : "mirror.quasi.fuchsian" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
		switch( _options[0].toLowerCase() )
		{
        case "close":
        var _sub = "embeddings", _base_id = "mirror.quasi.fuchsian" ;
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        circles_lib_plugin_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ] );
        
        return 1 ;
        break ;
				case "focus":
        var _sub = "embeddings", _base_id = "mirror.quasi.fuchsian" ;
        circles_lib_plugin_focus( _div_id );
        _ret_array.push( YES, "<green>Plug-in has been focused with success</green>" ) ;
        return 1;
        break ;
				case "move":
        var _sub = "embeddings", _base_id = "mirror.quasi.fuchsian" ;
				var _ret = move_div( _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toUpperCase() : "TOP" );
        _ret_array.push( YES, "<green>Plug-in has been moved with success</green>" ) ;
        return 1 ;
				break ;
				case "info.params":
        _ret_array.push( YES, "<green>Param identifiers for the Earle plugin: 'tau'</green> and 'p' for the solutions selector" ) ;
				break ;
				case "update.params":
				var _var_id = safe_string( _options[1], "" ).trim().toLowerCase() ;
				if ( _var_id == "mu" ) 
				{
					CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau = _options[2] ;
					$("#PLUGIN_PARAM_TAU").val( CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau );
					_ret_array.push( YES, "<green>Params have been updated with success</green>" ) ;
					return 1 ;
				}
				_ret_array.push( NO, "<orange>Missing param 'mu' specification</orange>" ) ;
				return 0 ;
				break ;
				default:
        _ret_array.push( NO, "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ) ;
        return 0 ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}