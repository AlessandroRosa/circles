function CIRCLESembeddingsJORGENSEN_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESembeddingsJORGENSENremotectrl( _options, _return_fn )
{
		if ( !is_array( _options ) )
		{
				if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
				return ;
		}
	  
		var _out_msg = "" ;
		switch( _options[0].toLowerCase() )
		{
				case "/*anyaction*/":
				break ;
        case "alpha":
        if ( _options[1] != null ) $("#PLUGIN_PARAM_ALPHA").val( _options[1] );
        break ;
        case "beta":
        if ( _options[1] != null ) $("#PLUGIN_PARAM_BETA").val( _options[1] );
        break ;
        case "close":
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        circles_lib_popup_activate( NO, GLOB_PLUGIN_SUBSET, '', '', GLOB_PLUGIN_BASE_ID, CLOSE, GLOB_PLUGIN_DIV_ID );
        break ;
				case "ifslastpt":
				break ;
        case "params":
        if ( _options[1] != null ) $("#PLUGIN_PARAM_ALPHA").val( _options[1] );
        if ( _options[2] != null ) $("#PLUGIN_PARAM_BETA").val( _options[2] );
        break ;
				case "move":
				var _ret = move_div( GLOB_PLUGIN_DIV_ID, _options[1] != null ? _options[1].toLowerCase() : "LEFT", _options[2] != null ? _options[2].toUpperCase() : "TOP" );
				break ;
				default:
				_out_msg = "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}