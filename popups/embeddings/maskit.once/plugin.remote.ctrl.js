function CIRCLESembeddingsMASKITONCE_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESembeddingsMASKITONCEremotectrl( _options, _return_fn )
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
				case "move":
				var _ret = move_div( GLOB_PLUGIN_DIV_ID, _options[1] != null ? _options[1].toLowerCase() : "LEFT", _options[2] != null ? _options[2].toUpperCase() : "TOP" );
				break ;
				default:
				_out_msg = "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}