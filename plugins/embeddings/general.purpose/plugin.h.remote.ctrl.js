function CIRCLESembeddingsGENERALPURPOSE_REMOTE_CTRL_KEYWORDS_INIT()
{
    CIRCLESembeddingsGENERALPURPOSEremotectrl_keywords = [ "capture.gens", "capture.seeds" ] ;
}

function CIRCLESembeddingsGENERALPURPOSEremotectrl( _options, _return_fn, _ret_array, _output_channel )
{
	if ( !is_array( _options ) )
	{
       if ( typeof _return_fn === "function" ) _return_fn.call( this, "<red>Invalid input data for remote control management</red>" );
	   return NO ;
	}

	var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "embeddings", base_id : "general.purpose" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
    if ( is_array( _options ) )
    {
		var _opt = _options[0].toLowerCase() ;
		switch( _opt )
  		{
		 case "add.mobius.map":
  			if ( _options[1] != null ) $( "#PLUGIN_PARAM_A" ).val( _options[1].replaceAll( [ ",", ";" ], "" ) );
  			if ( _options[2] != null ) $( "#PLUGIN_PARAM_B" ).val( _options[2].replaceAll( [ ",", ";" ], "" ) );
  			if ( _options[3] != null ) $( "#PLUGIN_PARAM_C" ).val( _options[3].replaceAll( [ ",", ";" ], "" ) );
  			if ( _options[4] != null ) $( "#PLUGIN_PARAM_D" ).val( _options[4].replaceAll( [ ",", ";" ], "" ) );
  			CIRCLESembeddingsGENERALPURPOSE_GEN_MANAGER(CIRCLESembeddingsGENERALPURPOSE_ADD,YES);
		    _ret_array.push( 1, "<green>Mobius map has been added with success to the candidate group</green>" ) ;
			return YES ;
  			break ;
  		 case "bomb":
  			CIRCLESembeddingsGENERALPURPOSE_BOMB();
		    _ret_array.push( 1, "<green>Group has been bombed with success: all generators have been deleted</green>" ) ;
			return YES ;
  			break ;
  		 case "capture.seeds":
  			CIRCLESembeddingsGENERALPURPOSE_CAPTURE(1);
		    _ret_array.push( 1, "<green>Seeds have been captured with success</green>" ) ;
			return YES ;
  			break ;
  		 case "capture.gens":
  			CIRCLESembeddingsGENERALPURPOSE_CAPTURE(1);
		    _ret_array.push( 1, "<green>Generators have been captured with success</green>" ) ;
		 return YES ;
  		 break ;
  		 case "clean":
  		 CIRCLESembeddingsGENERALPURPOSE_CLEAN();
		 _ret_array.push( 1, "<green>Plug-in have been cleaned with success</green>" ) ;
		 return YES ;
  		 break ;
         case "close":
         GLOB_PLUGIN_DESTROY_POPUP_VARS();
         var _sub = "forms", _base_id = "general.purpose" ;
         circles_lib_plugin_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ] );
         _ret_array.push( 1, "<green>Plug-in has been closed with success</green>" ) ;
         break ;
  		 case "focus":
         var _sub = "embeddings", _base_id = "general.purpose" ;
         circles_lib_plugin_focus( _div_id );
         _ret_array.push( 1, "<green>Plug-in has been focused with success</green>" ) ;
         return 1;
         break ;
  		 case "full.group":
  		 var _ret = CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(YES,NO,YES,_glob_seeds_array);
		 _ret_array.push( 1, "<green>The list of generators have been displayed with success</green>" ) ;
         return YES ;
  		 break ;
		 case "generate.group":
		 var _ret = CIRCLESembeddingsGENERALPURPOSE_GENERATE_GROUP(YES,NO,_output_channel);
		 console.log( _ret );
		 _out_msg = _ret ? "<green>Group has been generated with success</green>" : "<red>Fail to perform the group generation</red>" ;
	     _ret_array.push( _ret, _out_msg ) ;
         return _ret ;
  		 break ;
  		 case "move":
         var _sub = "embeddings", _base_id = "general.purpose" ;
  		 var _ret = move_div( _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toUpperCase() : "TOP" );
         _ret_array.push( 1, "<green>Plug-in has been moved with success</green>" ) ;
         return _ret ;
  		 break ;
  		 case "tab":
		 var _found = 0 ;
		 var _tab_name = _options[1].toLowerCase().trim() ;
		 switch( _tab_name )
		 {
			case "input.maps":
			$('#CIRCLESGENERALPURPOSEmainDIV').get(0).tabber.tabShow(0);
			_found = 1 ;
			break ;
			case "maps.list":
			$('#CIRCLESGENERALPURPOSEmainDIV').get(0).tabber.tabShow(1);
			_found = 1 ;
			break ;
			case "custom.vars":
			$('#CIRCLESGENERALPURPOSEmainDIV').get(0).tabber.tabShow(2);
			_found = 1 ;
			break ;
			case "comment":
			$('#CIRCLESGENERALPURPOSEmainDIV').get(0).tabber.tabShow(3);
			_found = 1 ;
			break ;
			case "preview":
			$('#CIRCLESGENERALPURPOSEmainDIV').get(0).tabber.tabShow(4);
			_found = 1 ;
			break ;
			default: break ;
		}
		_tab_name = _tab_name.replace( /\./g, ' ' );
		_ret_array.push( _found, !_found ? "<red>Can't switch to unknown tab '"+_tab_name+"'</red>" : "<green>Switched to tab '"+_tab_name+"' with success</green>" ) ;
		return YES ;
		break ;
  		case "new.mobius.map":
  		CIRCLESembeddingsGENERALPURPOSE_GEN_MANAGER(CIRCLESembeddingsGENERALPURPOSE_NEW,YES,_output_channel);
        return YES ;
  		break ;
  		case "refresh":
  		CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(NO,YES);
        _ret_array.push( 1, "<green>Plug-in has been refreshed with success</green>" ) ;
        return YES ;
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
       		  _out_msg = "<red>Unknown parameter letter '"+_letter+"'</red>" ;
			  _ret_array.push( 0, _out_msg ) ;
              return NO ;
              break ;
           }
		   _ret_array.push( 1, "<green>Param '"+_letter+"' has been set up with success</green>" ) ;
        }
        else
        {
		   var _params = [] ;
           if ( _options[1] != null ) { _params.push('A'); $( "#PLUGIN_PARAM_A" ).val( _options[1].replaceAll( [ ",", ";" ], "" ) ); }
           if ( _options[2] != null ) { _params.push('B'); $( "#PLUGIN_PARAM_B" ).val( _options[2].replaceAll( [ ",", ";" ], "" ) ); }
           if ( _options[3] != null ) { _params.push('C'); $( "#PLUGIN_PARAM_C" ).val( _options[3].replaceAll( [ ",", ";" ], "" ) ); }
           if ( _options[4] != null ) { _params.push('D'); $( "#PLUGIN_PARAM_D" ).val( _options[4].replaceAll( [ ",", ";" ], "" ) ); }
           if ( _options[5] != null )
           {
              var _cmd = safe_string( _options[5], "" );
              switch( _cmd )
              {
                case "add":
				if ( _params.length > 0 )
				{
					var _ret = CIRCLESembeddingsGENERALPURPOSE_GEN_MANAGER(CIRCLESembeddingsGENERALPURPOSE_ADD,YES,_output_channel);
					_out_msg = _ret ? "<green>Params "+_params.join( "," )+" have been been added with success</green>" : "Fail to perform operation" ;
					_ret_array.push( 1, _out_msg ) ;
				}
				else _ret_array.push( 0, "<red>No input params have been specified</red>" ) ;
                break ;
                default: break ;
              }
           }
        }
        return YES ;
		break ;
		case "var.bomb":
		CIRCLESembeddingsGENERALPURPOSE_VAR_BOMB(YES,YES,_output_channel);
		_ret_array.push( 1, "<green>All vars have been deleted with success</green>" ) ;
        CIRCLESembeddingsGENERALPURPOSE_VAR_REFRESH_PANEL();
		return YES ;
		break ;
        case "var.delete":
        var _var_id = safe_string( _options[1], "" );
        if ( _var_id.length > 0 )
        {
			var _ret = CIRCLESembeddingsGENERALPURPOSE_VAR_DELETE( YES, NO, _var_id, _output_channel ) ;
            return _ret ;
        }
        else
        {
		   _out_msg = "<red>Can't delete the var from the list: please, input var ID</red>" ;
		   _ret_array.push( NO, _out_msg ) ;
           return NO ;
        }
         break ;
         case "var.help":
         var _ret = CIRCLESembeddingsGENERALPURPOSE_VAR_HELP( YES, _output_channel ) ;
   	     _out_msg = _ret ? "<green>Operation accomplished with success</green>" : "<red>Fail to accomplish the operation</red>" ;
		 _ret_array.push( _ret, _out_msg ) ;
         return _ret ;
         break ;
         case "var.list":
		 var _dispatch_mode = DISPATCH_INFO ;
		 if ( _output_channel == OUTPUT_TERMINAL ) { _output_channel = OUTPUT_HTML ; }
         var _ret = CIRCLESembeddingsGENERALPURPOSE_VAR_REGISTER_LIST_BUILD( _output_channel ) ;
   	     _out_msg = _ret ? "<green>Operation accomplished with success</green>" : "<red>Fail to accomplish the operation</red>" ;
		 _ret_array.push( _ret, _out_msg ) ;
         return _ret ;
         break ;
		 case "var.register":
         var _var_id = safe_string( _options[1], "" ), _var_value = safe_string( _options[2], "" );
		 var _b_go = _var_id.length > 0 && _var_value.length > 0;
         if ( _b_go )
         {
            var _ret = CIRCLESembeddingsGENERALPURPOSE_VAR_REGISTER( _output_channel, _var_id, _var_value );
      	    _out_msg = _ret ? "<green>Operation accomplished with success</green>" : "<red>Fail to accomplish the operation</red>" ;
			_ret_array.push( _ret, _out_msg );
            return _ret ;
         }
         else
         {
			_out_msg = "<red>Can't add the var to the list: please, input var ID and VALUE</red>" ;
			_ret_array.push( 0, _out_msg ) ;
            return NO ;
         }
         break ;
		 case "var.register.select":
		 var _idx = safe_int( _options[1], 0 ) ;
		 console.log( _options, _idx );
		 if ( _idx >= 0 )
		 {
			if ( $("#PLUGINregisteredvarsCOMBO").get(0) != null )
			{
				var _n_options = $("#PLUGINregisteredvarsCOMBO option").length ;
				if ( _idx < _n_options )
				{
					$("#PLUGINregisteredvarsCOMBO").get(0).selectedIndex = _idx ;
					$("#PLUGINregisteredvarsCOMBO").trigger("change") ;
					_out_msg = "<green>Selected entry #"+_idx+"</green>" ;
					_ret_array.push( 1, _out_msg ) ;
					return YES ;
				}
				else
				{
					_out_msg = "<orange>Allowed index range for dropdown selection goes from 0 to "+(_n_options-1)+"</orange>" ;
					_ret_array.push( 1, _out_msg ) ;
					return NO ;
				}
			}
			else
			{
				_out_msg = "<red>Missing dropdown menu for selection: please register a var before</red>" ;
				_ret_array.push( 0, _out_msg ) ;
				return NO ;
			}
		 }
		 else
		 {
			_out_msg = "<red>Negative indexes are not allowed for selection</red>" ;
			_ret_array.push( 0, _out_msg ) ;
            return NO ;
		 }
		 break ;
		 default:
         _ret_array.push( 0, "<red>Unknown remote control command '"+_options[0].toLowerCase()+"'</red>" ) ;
         return NO ;
		 break ;
  		}
    }
    else return NO ;

	if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
    return YES ;
}