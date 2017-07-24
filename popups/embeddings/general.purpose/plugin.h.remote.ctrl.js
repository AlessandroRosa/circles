function CIRCLESembeddingsGENERALPURPOSE_REMOTE_CTRL_KEYWORDS_INIT()
{
    CIRCLESembeddingsGENERALPURPOSEremotectrl_keywords = [ "capture.gens", "capture.seeds" ] ;
}

function CIRCLESembeddingsGENERALPURPOSEremotectrl( _options, _return_fn )
{
		if ( !is_array( _options ) )
		{
				if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
				return 0 ;
		}
	  
		var _out_msg = "" ;
    if ( is_array( _options ) )
    {
      switch( _options[0].toLowerCase() )
  		{
  				case "/*anyaction*/":
  				break ;
  				case "addmobius":
  				if ( _options[1] != null ) $( "#PLUGIN_PARAM_A" ).val( _options[1].replaceAll( [ ",", ";" ], "" ) );
  				if ( _options[2] != null ) $( "#PLUGIN_PARAM_B" ).val( _options[2].replaceAll( [ ",", ";" ], "" ) );
  				if ( _options[3] != null ) $( "#PLUGIN_PARAM_C" ).val( _options[3].replaceAll( [ ",", ";" ], "" ) );
  				if ( _options[4] != null ) $( "#PLUGIN_PARAM_D" ).val( _options[4].replaceAll( [ ",", ";" ], "" ) );
  				CIRCLESembeddingsGENERALPURPOSE_GEN_UPDATE(CIRCLESembeddingsGENERALPURPOSE_ADD,YES);
          return 1 ;
  				break ;
  				case "bomb":
  				CIRCLESembeddingsGENERALPURPOSE_BOMB();
          return 1 ;
  				break ;
  				case "capture.seeds":
  				CIRCLESembeddingsGENERALPURPOSE_CAPTURE(1);
          return 1 ;
  				break ;
  				case "capture.gens":
  				CIRCLESembeddingsGENERALPURPOSE_CAPTURE(1);
          return 1 ;
  				break ;
  				case "clean":
  				CIRCLESembeddingsGENERALPURPOSE_CLEAN();
          return 1 ;
  				break ;
  				case "fullgroup":
  				CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(YES,NO,YES,_glob_seeds_array);
          return 1 ;
  				break ;
  				case "generate.group":
  				CIRCLESembeddingsGENERALPURPOSE_GENERATE_GROUP(YES,NO);
          return 1 ;
  				break ;
  				case "move":
  				var _ret = move_div( GLOB_PLUGIN_DIV_ID, _options[1] != null ? _options[1].toLowerCase() : "LEFT", _options[2] != null ? _options[2].toUpperCase() : "TOP" );
          return _ret ;
  				break ;
  				case "newmobius":
  				CIRCLESembeddingsGENERALPURPOSE_GEN_UPDATE(CIRCLESembeddingsGENERALPURPOSE_NEW,YES);
          return 1 ;
  				break ;
  				case "refresh":
  				CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(NO,YES);
          return 1 ;
  				break ;
  				default:
  				_out_msg = "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ;
          return 0 ;
  				break ;
  		}
    }
    else return 0 ;

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
    return 1 ;
}