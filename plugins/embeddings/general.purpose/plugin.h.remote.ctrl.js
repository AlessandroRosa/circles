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
    var _idx = circles_lib_plugin_find_index( { subset : "embeddings", base_id : "general.purpose" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
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
         case "add.var":
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
         circles_lib_plugin_focus( _div_id );
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
         case "type":
         var _letter = safe_string( _options[1], "" ) ;
         if ( _letter.length == 1 && _letter.is_one_of( "a", "b", "c", "d" ) )
         {
           switch( _letter )
           {
              case "a":
              $( "#PLUGIN_PARAM_A" ).val( _options[2].replaceAll( [ ",", ";" ], "" ) );
              break ;
              case "b":
              $( "#PLUGIN_PARAM_B" ).val( _options[2].replaceAll( [ ",", ";" ], "" ) );
              break ;
              case "c":
              $( "#PLUGIN_PARAM_C" ).val( _options[2].replaceAll( [ ",", ";" ], "" ) );
              break ;
              case "d":
              $( "#PLUGIN_PARAM_D" ).val( _options[2].replaceAll( [ ",", ";" ], "" ) );
              break ;
              default:
              break ;
           }
         }
         else
         {
           if ( _options[1] != null ) $( "#PLUGIN_PARAM_A" ).val( _options[1].replaceAll( [ ",", ";" ], "" ) );
           if ( _options[2] != null ) $( "#PLUGIN_PARAM_B" ).val( _options[2].replaceAll( [ ",", ";" ], "" ) );
           if ( _options[3] != null ) $( "#PLUGIN_PARAM_C" ).val( _options[3].replaceAll( [ ",", ";" ], "" ) );
           if ( _options[4] != null ) $( "#PLUGIN_PARAM_D" ).val( _options[4].replaceAll( [ ",", ";" ], "" ) );
           if ( _options[5] != null )
           {
              var _cmd = safe_string( _options[5], "" );
              switch( _cmd )
              {
                case "add":
                CIRCLESembeddingsGENERALPURPOSE_GEN_UPDATE(CIRCLESembeddingsGENERALPURPOSE_ADD,YES);
                break ;
                default: break ;
              }
           }
         }
         return 1 ;
  			 break ;
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