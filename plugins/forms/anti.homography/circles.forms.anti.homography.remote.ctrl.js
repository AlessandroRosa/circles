function CIRCLESformsANTIHOMOGRAPHY_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESformsANTIHOMOGRAPHYremotectrl( _options, _return_fn, _out_channel )
{
		if ( !is_array( _options ) )
		{
       if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
			 return 0 ;
		}

		var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "anti.homography" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
		switch( _options[0].toLowerCase() )
		{
				case "/*anyaction*/":
        return 1 ;
				break ;
        case "check":
        var _symbol = safe_string( _options[1], "" ) ;
        var _position = safe_string( _options[2], "num" ) ;
        var _ctrl_id = "CIRCLESformsANTIHOMOGRAPHYcheckbox_mask_"+_position+"_"+_symbol ;
        if ( $( "#"+_ctrl_id ).get(0) != null )$( "#"+_ctrl_id ).prop( "checked", true );
				break ;
        case "close":
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        var _sub = "forms", _base_id = "anti.homography" ;
        circles_lib_plugin_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ] );
        return 1 ;
        break ;
				case "focus":
        var _sub = "forms", _base_id = "anti.homography" ;
        circles_lib_plugin_focus( _div_id );
        return 1;
        break ;
				case "move":
        var _sub = "forms", _base_id = "anti.homography" ;
				var _ret = move_div( _plugin_tmp_vars_array[ _sub ][ _base_id ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toLowerCase() : "TOP" );
        return 1 ;
				break ;
        case "uncheck":
        var _symbol = safe_string( _options[1], "" ) ;
        var _position = safe_string( _options[2], "num" ) ;
        var _ctrl_id = "CIRCLESformsANTIHOMOGRAPHYcheckbox_mask_"+_position+"_"+_symbol ;
        if ( $( "#"+_ctrl_id ).get(0) != null )$( "#"+_ctrl_id ).prop( "checked", false );
				break ;
				default:
				_out_msg = "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ;
        return 0 ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}