function CIRCLESembeddingsGENERALPURPOSE_REMOTE_CTRL_KEYWORDS_INIT()
{
    CIRCLESembeddingsGENERALPURPOSEremotectrl_keywords = [ "capture.gens", "capture.seeds" ] ;
}

function CIRCLESembeddingsGENERALPURPOSEremotectrl( _options, _return_fn, _out_channel )
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
         return 1 ;
  			 break ;
  			 case "add.mobius.map":
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
         case "close":
         GLOB_PLUGIN_DESTROY_POPUP_VARS();
         var _sub = "forms", _base_id = "general.purpose" ;
         circles_lib_plugin_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ] );
         break ;
  			 case "focus":
         var _sub = "embeddings", _base_id = "general.purpose" ;
         circles_lib_plugin_focus( _base_id, _sub );
         return 1;
         break ;
  			 case "full.group":
  			 CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(YES,NO,YES,_glob_seeds_array);
         return 1 ;
  			 break ;
  			 case "generate.group":
  			 CIRCLESembeddingsGENERALPURPOSE_GENERATE_GROUP(YES,NO);
         return 1 ;
  			 break ;
  			 case "move":
         var _sub = "embeddings", _base_id = "general.purpose" ;
  			 var _ret = move_div( _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toUpperCase() : "TOP" );
         return _ret ;
  			 break ;
  			 case "new.mobius.map":
  			 CIRCLESembeddingsGENERALPURPOSE_GEN_UPDATE(CIRCLESembeddingsGENERALPURPOSE_NEW,YES);
         return 1 ;
  			 break ;
  			 case "refresh":
  			 CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(NO,YES);
         return 1 ;
  			 break ;
         case "vars.list":
         var _v = [ "gx_n" ] ;
         var _output = [] ;
             _output.push( "General Purpose Plug-in --- Internal variables\n" ) ;
             _output.push( "Each parameter shall be mentioned in the form g<generator-index>_<parameter-index>" ) ;
             _output.push( "<generator-index> shall be strictly positive, i.e., > 0" ) ;
             _output.push( "<parameter-index> shall range from 1 to 4, bounds included" ) ;
         return _output.join( "\n" ) ;
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