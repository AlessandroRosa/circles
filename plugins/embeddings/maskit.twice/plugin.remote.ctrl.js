function CIRCLESembeddingsMASKITTWICE_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESembeddingsMASKITTWICEremotectrl( _options, _return_fn, _ret_array, _output_channel )
{
		if ( !is_array( _options ) )
		{
       if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
			 return 0 ;
		}

		var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "embeddings", base_id : "maskit.twice" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
		switch( _options[0].toLowerCase() )
		{
        case "close":
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        var _sub = "embeddings", _base_id = "maskit.twice" ;
        circles_lib_plugin_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ] );
        
        return YES ;
        break ;
				case "focus":
        var _sub = "embeddings", _base_id = "maskit.twice" ;
        circles_lib_plugin_focus( _div_id );
        _ret_array.push( YES, "<green>Plug-in has been focused with success</green>" ) ;
        return YES;
        break ;
				case "move":
        var _sub = "embeddings", _base_id = "maskit.twice" ;
				var _ret = move_div( _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toUpperCase() : "TOP" );
        _ret_array.push( YES, "<green>Plug-in has been moved with success</green>" ) ;
        return YES ;
		break ;
		case "info.params":
        _ret_array.push( YES, "<green>Param identifiers for the Earle plugin: 'tau1', 'tau2'</green>" ) ;
		return YES ;
		break ;
		case "init":
        CIRCLESembeddingsMASKITTWICE_INIT(NO,YES);
    	CIRCLESembeddingsMASKITTWICE_COMP();
		GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
		CIRCLESembeddingsMASKITTWICE_CONFIG(); GLOB_PLUGIN_WIZARD_STEP(1.1,YES); GLOB_PLUGIN_GENS_SHOW(YES);
		CIRCLESembeddingsMASKITTWICE_RECORD_PARAMS();
		GLOB_PLUGIN_WIZARD_STEP(2.1);
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;
        _ret_array.push( YES, "<green>Group has been init with success</green>" ) ;
		return YES ;
		break ;
		case "render":
		GLOB_PLUGIN_WIZARD_STEP(2.1,null,null,W_PLANE,YES);
        _ret_array.push( YES, "<green>Rendering has been started up</green>" ) ;
		return YES ;
		break ;
				case "update.params":
				var _switch_to = 0, _param_id = "" ;
				for( var _i = 1 ; _i < _options.length ; _i++ )
				{
					_param_id = _options[_i].trim().toLowerCase();
					if ( _param_id.length == 0 ) continue ;
					else if ( _param_id == "tau1" ) _switch_to = 1 ;
					else if ( _param_id == "tau2" ) _switch_to = 2 ;
					else
					{
						switch( _switch_to )
						{
							case 1:
							CIRCLESembeddingsMASKITTWICE_TAU_1 = _options[_i] ;
							$("#PLUGIN_PARAM_TAU_1").val( CIRCLESembeddingsMASKITTWICE_TAU_1 );
							break ;
							case 2:
							CIRCLESembeddingsMASKITTWICE_TAU_2 = _options[_i] ;
							$("#PLUGIN_PARAM_TAU_2").val( CIRCLESembeddingsMASKITTWICE_TAU_2 );
							break ;
							default:
							_ret_array.push( NO, "<orange>Unknown input param name</orange>" ) ;
							return 0 ;
							break ;
						}
					}
				}
				_ret_array.push( YES, "<green>Params have been updated with success</green>" ) ;
				return YES ;
				break ;
				default:
		        _ret_array.push( NO, "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ) ;
				return 0 ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}