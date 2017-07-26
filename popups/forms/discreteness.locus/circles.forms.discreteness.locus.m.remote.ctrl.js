function CIRCLESformsDISCRETENESSLOCUS_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESformsDISCRETENESSLOCUSremotectrl( _options, _return_fn )
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
        case "get.point":
        console.log( _options[1] );
        $( "#CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT" ).val( _options[1] );
        CIRCLESformsDISCRETENESSLOCUSplotCOMPLEXPT( null, 1 ) ;
        break ;
				case "move":
				var _ret = move_div( _plugin_tmp_vars_config_array['forms']['discreteness.locus'], _options[1] != null ? _options[1].toLowerCase() : "LEFT", _options[2] != null ? _options[2].toLowerCase() : "TOP" );
				break ;
				default:
				_out_msg = "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}