function CIRCLESembeddingsGENERALPURPOSE_REMOTE_CTRL_KEYWORDS_INIT()
{
    CIRCLESembeddingsGENERALPURPOSEremotectrl_keywords = [ "capture.gens", "capture.seeds" ] ;
}

function CIRCLESembeddingsGENERALPURPOSEremotectrl( _options, _return_fn, _ret_array, _out_channel )
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
			 case "add.mobius.map":
  			 if ( _options[1] != null ) $( "#PLUGIN_PARAM_A" ).val( _options[1].replaceAll( [ ",", ";" ], "" ) );
  			 if ( _options[2] != null ) $( "#PLUGIN_PARAM_B" ).val( _options[2].replaceAll( [ ",", ";" ], "" ) );
  			 if ( _options[3] != null ) $( "#PLUGIN_PARAM_C" ).val( _options[3].replaceAll( [ ",", ";" ], "" ) );
  			 if ( _options[4] != null ) $( "#PLUGIN_PARAM_D" ).val( _options[4].replaceAll( [ ",", ";" ], "" ) );
  			 CIRCLESembeddingsGENERALPURPOSE_GEN_UPDATE(CIRCLESembeddingsGENERALPURPOSE_ADD,YES);
		   _ret_array.push( 1, "<green>Mobius map has been added with success to the candidate group</green>" ) ;
         return 1 ;
  			 break ;
  			 case "bomb":
  			 CIRCLESembeddingsGENERALPURPOSE_BOMB();
		   _ret_array.push( 1, "<green>Group has been bombed with success: all generators have been deleted</green>" ) ;
         return 1 ;
  			 break ;
  			 case "capture.seeds":
  			 CIRCLESembeddingsGENERALPURPOSE_CAPTURE(1);
		   _ret_array.push( 1, "<green>Seeds have been captured with success</green>" ) ;
         return 1 ;
  			 break ;
  			 case "capture.gens":
  			 CIRCLESembeddingsGENERALPURPOSE_CAPTURE(1);
		   _ret_array.push( 1, "<green>Generators have been captured with success</green>" ) ;
         return 1 ;
  			 break ;
  			 case "clean":
  			 CIRCLESembeddingsGENERALPURPOSE_CLEAN();
		   _ret_array.push( 1, "<green>Plug-in have been cleaned with success</green>" ) ;
         return 1 ;
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
  			 CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(YES,NO,YES,_glob_seeds_array);
		   _ret_array.push( 1, "<green>The list of generators have been displayed with success</green>" ) ;
         return 1 ;
  			 break ;
  			 case "generate.group":
  			 CIRCLESembeddingsGENERALPURPOSE_GENERATE_GROUP(YES,NO);
		   _ret_array.push( 1, "<green>Group has been generated with success</green>" ) ;
         return 1 ;
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
				 case "input.form":
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
			 _ret_array.push( _found, !_found ? "<orange>Can't switch to unknown tab '"+_tab_name+"'</orange>" : "<green>Switched to tab '"+_tab_name+"' with success</green>" ) ;
			 return 1 ;
			 break ;
  			 case "new.mobius.map":
  			 CIRCLESembeddingsGENERALPURPOSE_GEN_UPDATE(CIRCLESembeddingsGENERALPURPOSE_NEW,YES);
         return 1 ;
  			 break ;
  			 case "refresh":
  			 CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(NO,YES);
        _ret_array.push( 1, "<green>Plug-in has been refreshed with success</green>" ) ;
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
       			  _out_msg = "<orange>Unknown parameter letter '"+_letter+"'</orange>" ;
			  _ret_array.push( 0, _out_msg ) ;
              return 0 ;
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
					CIRCLESembeddingsGENERALPURPOSE_GEN_UPDATE(CIRCLESembeddingsGENERALPURPOSE_ADD,YES);
					_ret_array.push( 1, "<green>Params "+_params.join( "," )+" have been been added with success</green>" ) ;
				}
				else _ret_array.push( 0, "<orange>No input params have been specified</orange>" ) ;
                break ;
                default: break ;
              }
           }
         }
         return 1 ;
		 break ;
         case "type":
         var _var_id = safe_string( _options[1], "" ), _var_value = safe_string( _options[2], "" );
         if ( _var_id.length > 0 && _var_value.length > 0 )
         {
            if ( !CIRCLESembeddingsGENERALPURPOSE_VAR_CHECK_SYNTAX( _var_id ) )
            {
               var _out_msg = "The candidate var name '" + _var_id + "' does not match the correct pattern. So check" + _glob_crlf ;
                   _out_msg += _glob_crlf + "* that var name starts with '_', for example : _a ;" ;
                   _out_msg += _glob_crlf + "* to use alphanumeric chars + underscore only ;" ;
			   _ret_array.push( 0, _out_msg ) ;
               return 0 ;
            }
            else if ( CIRCLESembeddingsGENERALPURPOSEillegals.includes_i( _var_id.replaceAll( "_", "" ) ) )
            {
                 var _out_msg = "The candidate var name '" + _var_id + "' is a reserved keyword" ;
			   _ret_array.push( 0, _out_msg ) ;
                 return 0 ;
            }
            else
            {
              var _v_complex = circles_lib_math_parse_formula( _var_value );
              _v_complex = parse_complex_from_string( _v_complex + "" );
              if ( !is_complex( _v_complex ) )
              {
                  _out_msg = "<orange>The input var value of "+_var_id+" is not a complex formula.</orange>" ;
			   _ret_array.push( 0, _out_msg ) ;
                  return 0 ;
              }
              else
              {
                  if ( !is_array( _plugin_user_vars[''+_var_id] ) ) _plugin_user_vars[''+_var_id] = [] ;
                  if ( !_plugin_user_vars[''+_var_id].includes( _var_value ) )
                  _plugin_user_vars[''+_var_id].push( _var_value );
                  else
                  {
              			 _out_msg = "<orange>Already existing value for var '"+_var_id+"'</orange>" ;
			   _ret_array.push( 0, _out_msg ) ;
                     return 0 ;
                  }
                  _out_msg = "<green>Var "+_var_id+" has been added with success</green>" ;
			   _ret_array.push( 1, _out_msg ) ;
                  return 1 ;
              }
            }
         }
         else
         {
      			 _out_msg = "<orange>Can't add the var to the listing: please, input both var ID and VALUE</orange>" ;
			   _ret_array.push( 0, _out_msg ) ;
             return 0 ;
         }
         break ;
		 case "var.bomb":
		 CIRCLESembeddingsGENERALPURPOSE_VAR_BOMB(1,1,OUTPUT_TERMINAL);
		 _ret_array.push( 1, "<green>All vars have been deleted with success</green>" ) ;
         CIRCLESembeddingsGENERALPURPOSE_VAR_REFRESH_PANEL();
		 return 1 ;
		 break ;
         case "var.delete":
         var _var_id = safe_string( _options[1], "" );
         if ( _var_id.length > 0 )
         {
            if ( !is_array( _plugin_user_vars[''+_var_id] ) )
            {
               _out_msg = "<orange>Can't delete: missing declaration of var "+_var_id+".</orange>" ;
			   _ret_array.push( 0, _out_msg ) ;
               return 0 ;
            }
            else
            {
               _plugin_user_vars.remove_key( _var_id );
               var _exists = _plugin_user_vars[ _var_id ] == null ? 0 : 1 ;
			   if ( !_exists ) CIRCLESembeddingsGENERALPURPOSE_VAR_REFRESH_PANEL();
               _out_msg = _exists ? "<orange>Fail to remove var '"+_var_id+"'</orange>" : "<green>Var '"+_var_id+"' has been removed with success</green>" ;
			   _ret_array.push( _exists ? 0 : 1, _out_msg ) ;
               return _exists ? 0 : 1 ;
            }
         }
         else
         {
      			 _out_msg = "<orange>Can't delete the var from the list: please, input var ID</orange>" ;
			   _ret_array.push( 0, _out_msg ) ;
             return 0 ;
         }
         break ;
         case "var.help":
         var _ret = CIRCLESembeddingsGENERALPURPOSE_VAR_HELP( 1, OUTPUT_TERMINAL ) ;
   	     _out_msg = _ret ? "<green>Operation accomplished with success</green>" : "<orange>Fail to accomplish the operation</orange>" ;
		 _ret_array.push( _ret, _out_msg ) ;
         return _ret ;
         break ;
         case "var.list":
         var _ret = CIRCLESembeddingsGENERALPURPOSE_VAR_LIST( OUTPUT_HTML ) ;
   	     _out_msg = _ret ? "<green>Operation accomplished with success</green>" : "<orange>Fail to accomplish the operation</orange>" ;
		 _ret_array.push( _ret, _out_msg ) ;
         return _ret ;
         break ;
		 case "var.save":
         var _var_id = safe_string( _options[1], "" ), _var_value = safe_string( _options[1], "" );
         if ( _var_id.length > 0 && _var_value.length > 0 )
         {
            var _ret = CIRCLESembeddingsGENERALPURPOSE_VAR_DECLARE( 1, 0, OUTPUT_TERMINAL, _var_id, _var_value );
      	    _out_msg = _ret ? "<green>Operation accomplished with success</green>" : "<orange>Fail to accomplish the operation</orange>" ;
			_ret_array.push( _ret, _out_msg ) ;
            return _ret ;
         }
         else
         {
      	    _out_msg = "<orange>Can't add the var to the list: please, input both var ID and VALUE</orange>" ;
			_ret_array.push( 0, _out_msg ) ;
            return 0 ;
         }
         break ;
		 default:
         _ret_array.push( 0, "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ) ;
         return 0 ;
		 break ;
  		}
    }
    else return 0 ;

	if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
    return 1 ;
}