function CIRCLESembeddingsMASKITONCE_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESembeddingsMASKITONCEremotectrl( _options, _return_fn, _ret_array, _out_channel )
{
		if ( !is_array( _options ) )
		{
       if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
			 return 0 ;
		}

		var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "embeddings", base_id : "maskit.once" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
		switch( _options[0].toLowerCase() )
		{
        case "close":
        var _sub = "embeddings", _base_id = "maskit.once" ;
        circles_lib_plugin_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ] );
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        _ret_array.push( 1, "<green>Plug-in has been closed with success</green>" ) ;
        return 1 ;
        break ;
				case "focus":
        var _sub = "embeddings", _base_id = "maskit.once" ;
        circles_lib_plugin_focus( _div_id );
        _ret_array.push( 1, "<green>Plug-in has been focused with success</green>" ) ;
        return 1;
        break ;
				case "move":
        var _sub = "embeddings", _base_id = "maskit.once" ;
				var _ret = move_div( _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toUpperCase() : "TOP" );
        _ret_array.push( 1, "<green>Plug-in has been closed with success</green>" ) ;
        return 1 ;
				break ;
				case "update.params":
				if ( _options[1].includes( "=" ) )
				{
					var _toks = _options[1].split( "=" );
					var _param = _toks[0].trim(), _val = _toks[1].trim();
					if ( _param.length == 0 )
					{
            _ret_array.push( 0, "<orange>Invalid syntax: missing left-hand param</orange>" ) ;
            return 0 ;
					}
					else if ( _param != 'mu' )
					{
            _ret_array.push( 0, "<orange>Invalid syntax: left-hand param shall be defined as 'mu'</orange>" ) ;
        return 0 ;
					}
					else if ( _val.length == 0 )
					{
            _ret_array.push( 0, "<orange>Invalid syntax: missing right-hand value</orange>" ) ;
        return 0 ;
					}
					else
					{
        CIRCLESembeddingsMASKITONCE_mu = _options[1] ;
        $("#PLUGIN_PARAM_MU").val( CIRCLESembeddingsMASKITONCE_mu );
        _ret_array.push( 1, "<green>Params have been updated with success</green>" ) ;
        return 1 ;
					}
				}
				else
				{
            _ret_array.push( 0, "<orange>Invalid syntax: missing equal operator</orange>" ) ;
					return 0 ;
				}
				break ;
				default:
        _ret_array.push( 0, "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ) ;
        return 0 ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}