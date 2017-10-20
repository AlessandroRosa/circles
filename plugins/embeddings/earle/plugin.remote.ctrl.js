function CIRCLESembeddingsEARLE_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESembeddingsEARLEremotectrl( _options, _return_fn, _ret_array, _output_channel )
{
		if ( !is_array( _options ) )
		{
       if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
			 return 0 ;
		}

		var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "embeddings", base_id : "earle" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
		switch( _options[0].toLowerCase() )
		{
        case "close":
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        var _sub = "embeddings", _base_id = "earle" ;
        circles_lib_plugin_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ] );
        _ret_array.push( 1, "<green>Plug-in has been closed with success</green>" ) ;
        return 1 ;
        break ;
				case "focus":
        var _sub = "embeddings", _base_id = "earle" ;
        circles_lib_plugin_focus( _div_id );
        _ret_array.push( 1, "<green>Plug-in has been focused with success</green>" ) ;
        return 1;
        break ;
				case "move":
        var _sub = "embeddings", _base_id = "earle" ;
				var _ret = move_div( _plugin_tmp_vars_array[ _sub ][ _base_id ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toLowerCase() : "TOP" );
        _ret_array.push( 1, "<green>Plug-in has been moved with success</green>" ) ;
        return 1 ;
				break ;
				case "info.params":
        _ret_array.push( 1, "<green>Param identifiers for the Earle plugin: 'd'</green>" ) ;
				break ;
				case "update.params":
				var _switch_to = 0, _param_id = "" ;
				for( var _i = 1 ; _i < _options.length ; _i++ )
				{
					_param_id = _options[_i].trim().toLowerCase();
					if ( _param_id.length == 0 ) continue ;
					else if ( _param_id == "d" ) _switch_to = 1 ;
					else
					{
						switch( _switch_to )
						{
							case 1:
							CIRCLESembeddingsEARLE_d = _options[_i] ;
							$("#PLUGIN_PARAM_D").val( CIRCLESembeddingsEARLE_d );
							break ;
							default:
							_ret_array.push( 0, "<orange>Unknown input param name</orange>" ) ;
							return 0 ;
							break ;
						}
					}
				}
				_ret_array.push( 1, "<green>Params have been updated with success</green>" ) ;
				return 1 ;
				break ;
				default:
				        _ret_array.push( 0, "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ) ;
        return 0 ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}