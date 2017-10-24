function CIRCLESembeddingsGRANDMAPARABOLIC_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESembeddingsGRANDMAPARABOLICremotectrl( _options, _return_fn, _ret_array, _output_channel )
{
		if ( !is_array( _options ) )
		{
       if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
			 return 0 ;
		}

		var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "embeddings", base_id : "grandma.parabolic" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
		switch( _options[0].toLowerCase() )
		{
        case "close":
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        var _sub = "embeddings", _base_id = "grandma.parabolic" ;
        circles_lib_plugin_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ] );
        
        return 1 ;
        break ;
				case "focus":
        var _sub = "embeddings", _base_id = "grandma.parabolic" ;
        circles_lib_plugin_focus( _div_id );
        _ret_array.push( YES, "<green>Plug-in has been focused with success</green>" ) ;
        return 1;
        break ;
				case "move":
        var _sub = "embeddings", _base_id = "grandma.parabolic" ;
				var _ret = move_div( _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toUpperCase() : "TOP" );
        _ret_array.push( YES, "<green>Plug-in has been moved with success</green>" ) ;
        return 1 ;
				break ;
				case "info.params":
        _ret_array.push( YES, "<green>Param identifiers for the Earle plugin: 'a', 'b'</green> and 'p' for the solutions selector" ) ;
				break ;
				case "update.params":
				var _switch_to = 0, _param_id = "" ;
				for( var _i = 1 ; _i < _options.length ; _i++ )
				{
					_param_id = _options[_i].trim().toLowerCase();
					if ( _param_id.length == 0 ) continue ;
					else if ( _param_id == "a" ) _switch_to = 1 ;
					else if ( _param_id == "b" ) _switch_to = 2 ;
					else if ( _param_id == "p" ) _switch_to = 3 ;
					else
					{
						switch( _switch_to )
						{
							case 1:
							CIRCLESembeddingsGRANDMAPARABOLIC_trA = _options[_i] ;
							$("#PLUGIN_PARAM_A").val( CIRCLESembeddingsGRANDMAPARABOLIC_trA );
							break ;
							case 2:
							CIRCLESembeddingsGRANDMAPARABOLIC_trB = _options[_i] ;
							$("#PLUGIN_PARAM_B").val( CIRCLESembeddingsGRANDMAPARABOLIC_trB );
							break ;
							case 3:
							CIRCLESembeddingsGRANDMAPARABOLIC_param = _options[_i] ;
							break ;
							default:
							_ret_array.push( NO, "<orange>Unknown input param name</orange>" ) ;
							return 0 ;
							break ;
						}
					}
				}
				_ret_array.push( YES, "<green>Params have been updated with success</green>" ) ;
				return 1 ;
				break ;
				default:
				        _ret_array.push( NO, "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ) ;
        return 0 ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}