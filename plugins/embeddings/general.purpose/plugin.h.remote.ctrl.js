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
       			  _out_msg = "<orange>Unknown parameter letter '"+_letter+"'</orange>" ;
              return 0 ;
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
         case "type":
         var _var_id = safe_string( _options[1], "" ), _var_value = safe_string( _options[2], "" );
         if ( _var_id.length > 0 && _var_value.length > 0 )
         {
            if ( !CIRCLESembeddingsGENERALPURPOSE_VAR_CHECK_SYNTAX( _var_id ) )
            {
               var _out_msg = "The candidate var name '" + _var_id + "' does not match the correct pattern. So check" + _glob_crlf ;
                   _out_msg += _glob_crlf + "* that var name starts with '_', for example : _a ;" ;
                   _out_msg += _glob_crlf + "* to use alphanumeric chars + underscore only ;" ;
               return 0 ;
            }
            else if ( CIRCLESembeddingsGENERALPURPOSEillegals.includes_i( _var_id.replaceAll( "_", "" ) ) )
            {
                 var _out_msg = "The candidate var name '" + _var_id + "' is a reserved keyword" ;
                 return 0 ;
            }
            else
            {
              var _v_complex = circles_lib_math_parse_formula( _var_value );
              _v_complex = parse_complex_from_string( _v_complex + "" );

              if ( !is_complex( _v_complex ) )
              {
                  _out_msg = "<orange>The input var value of "+_var_id+" is not a complex formula.</orange>" ;
                  return 0 ;
              }
              else
              {
                  if ( !is_array( _plugin_rec_var_vals[''+_var_id] ) ) _plugin_rec_var_vals[''+_var_id] = [] ;
                  if ( !_plugin_rec_var_vals[''+_var_id].includes( _var_value ) )
                  _plugin_rec_var_vals[''+_var_id].push( _var_value );
                  else
                  {
              			 _out_msg = "<orange>Already existing value for var '"+_var_id+"'</orange>" ;
                     return 0 ;
                  }
                  _out_msg = "<green>Var "+_var_id+" has been added with success</green>" ;
                  return 1 ;
              }
            }
         }
         else
         {
      			 _out_msg = "<orange>Can't add the var to the listing: please, input both var ID and VALUE</orange>" ;
             return 0 ;
         }
         break ;
         case "var.update":
         var _var_id = safe_string( _options[1], "" ), _var_value = safe_string( _options[1], "" );
         if ( _var_id.length > 0 && _var_value.length > 0 )
         {
            if ( !CIRCLESembeddingsGENERALPURPOSE_VAR_CHECK_SYNTAX( _var_id ) )
            {
               var _out_msg = "The candidate var name '" + _var_id + "' does not match the correct pattern. So check" + _glob_crlf ;
                   _out_msg += _glob_crlf + "* that var name starts with '_', for example : _a ;" ;
                   _out_msg += _glob_crlf + "* to use alphanumeric chars + underscore only ;" ;
               return 0 ;
            }
            else if ( CIRCLESembeddingsGENERALPURPOSEillegals.includes_i( _var_id.replaceAll( "_", "" ) ) )
            {
                 var _out_msg = "The candidate var name '" + _var_id + "' is a reserved keyword" ;
                 return 0 ;
            }
            else
            {
              var _v_complex = circles_lib_math_parse_formula( _var_value );
              _v_complex = parse_complex_from_string( _v_complex + "" );

              if ( !is_complex( _v_complex ) )
              {
                _out_msg = "<orange>The input var value of "+_var_id+" is not a complex formula.</orange>" ;
                return 0 ;
              }
              else
              {
                if ( !is_array( _plugin_rec_var_vals[''+_var_id] ) )
                {
                  _out_msg = "<orange>Can't update: missing declaration of var "+_var_id+".</orange>" ;
                  return 0 ;
                }
                else
                {
                  _plugin_rec_var_vals[''+_var_id][0] = _var_value ;
                  _out_msg = "<green>Var "+_var_id+" has been updated to '"+_var_value+"' with success</green>" ;
                  return 1 ;
                }
              }
            }
         }
         else
         {
      			_out_msg = "<orange>Can't update the var inside the list: please, input both var ID and VALUE</orange>" ;
            return 0 ;
         }
         break ;
         case "var.delete":
         var _var_id = safe_string( _options[1], "" );
         if ( _var_id.length > 0 )
         {
            if ( !is_array( _plugin_rec_var_vals[''+_var_id] ) )
            {
               _out_msg = "<orange>Can't delete: missing declaration of var "+_var_id+".</orange>" ;
               return 0 ;
            }
            else
            {
               _plugin_rec_var_vals.remove_key( _var_id );
               var _exists = _plugin_rec_var_vals[ _var_id ] == null ? 0 : 1 ;
               _out_msg = _exists ? "<orange>Fail to remove var '"+_var_id+"'</orange>" : "<green>Var '"+_var_id+"' has been removed with success</green>" ;
               return _exists ? 0 : 1 ;
            }
         }
         else
         {
      			 _out_msg = "<orange>Can't delete the var from the list: please, input var ID</orange>" ;
             return 0 ;
         }
         break ;
         case "var.list":
         var _keys = _plugin_rec_var_vals.keys_associative();
         if ( _keys.length == 0 )
         {
     			  _out_msg = "<orange>The variables list is currently empty</orange>" ;
            return 0 ;
         }
         else
         {
            switch( _out_channel )
            {
                case OUTPUT_TERMINAL:
                var _html = "<table>" ;
                    _keys.forEach( function( _element, _index ) { _html += "<tr><td STYLE=\"color:yellow;\">"+_element+"</td><td></td><td STYLE=\"color:white;\">"+_plugin_rec_var_vals[_element]+"</td></tr>" ; }; );
                    _html += "</table>" ;
                circles_lib_terminal_html_display( _glob_terminal, _html );
                return 1 ;
                break ;
                case OUTPUT_SCRIPT:
                break ;
                case OUTPUT_CONSOLE:
                var _html = "<table>" ;
                    _keys.forEach( function( _element, _index ) { _html += "<tr><td STYLE=\"color:yellow;\">"+_element+"</td><td></td><td STYLE=\"color:white;\">"+_plugin_rec_var_vals[_element]+"</td></tr>" ; }; );
                    _html += "</table>" ;
                circles_lib_terminal_html_display( _glob_terminal, _html );
                return 1 ;
                break ;
                default:
         			  _out_msg = "<orange>Can't display the variables list: unknown output channel</orange>" ;
                return 0 ;
                break ;
            }
         }
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