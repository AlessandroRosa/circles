function CIRCLESformsTINYRENDERING_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESformsTINYRENDERINGremotectrl( _options, _return_fn )
{
		if ( !is_array( _options ) && typeof _return_fn === "function" )
		{
			 _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
			 return 0 ;
		}

		var _out_msg = "" ;
		switch( _options[0].toLowerCase() )
		{
				case "/*anyaction*/":
        return 1 ;
				break ;
        case "close":
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        var _sub = "forms", _base_id = "tiny.rendering" ;
        circles_lib_popup_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[_sub][_base_id] );
        return 1 ;
        break ;
				case "focus":
        var _sub = "forms", _base_id = "tiny.rendering" ;
        circles_lib_popup_focus( _base_id, _sub );
        return 1;
        break ;
				case "move":
        var _sub = "forms", _base_id = "tiny.rendering" ;
 				var _ret = move_div( _plugin_tmp_vars_array[ _sub ][ _base_id ], _options[1] != null ? _options[1].toLowerCase() : "LEFT", _options[2] != null ? _options[2].toUpperCase() : "TOP" );
        return 1 ;
				break ;
				default:
				_out_msg = "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ;
        return 0 ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}