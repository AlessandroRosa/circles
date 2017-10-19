function CIRCLESembeddingsGENERALPURPOSE_VAR_ALL_REPLACE_WITH_VAL()
{
    var _vars_names = _plugin_user_vars.keys_associative();
    var _vars_values = _plugin_user_vars.values_associative();
    var _n_vars = safe_size( _vars_names, 0 ), _i, _p, _x, _resolved ;
    if ( _n_vars > 0 )
    {
      for( _i = 0 ; _i < 4 ; _i++ )
      {
        _p = CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array[_i] ;
        _resolved = CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array[_i] ;
        for( _x = 0 ; _x < _n_vars ; _x++ ) _resolved = _resolved.replaceAll( _vars_names[_x], "("+_vars_values[_x]+")" );
        CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array[_i] = _resolved ;
      }
    }
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_CHECK_SYNTAX( _var ) { return _var.testME( _glob_varname_regex_pattern ); }

function CIRCLESembeddingsGENERALPURPOSE_VAR_DECLARE( _question, _silent, _out_channel, _id, _val )
{
	_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN ) ;
	_id = safe_string( _id, "" ), _val = safe_string( _val, "" );
    var _var_id = _id.length > 0 ? _id : $("#PLUGINvaridEDIT").val(), _var_value = _val.length > 0 ? _val : $("#PLUGINvarvalueEDIT").val();
    if ( _var_id.length == 0 || _var_value.length == 0 )
    {
        var _msg = "Can't set on the var params:" + _glob_crlf ;
        if ( _var_id.length == 0 ) _msg += _glob_crlf + "- missing var name;" ;
        if ( _var_value.length == 0 ) _msg += _glob_crlf + "- missing var value;" ;
        if ( !_silent ) circles_lib_output( _out_channel, DISPATCH_WARNING, _msg, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
        return NO ;
    }
    else
    {
        // this is the functions list of mathjs component
        if ( !CIRCLESembeddingsGENERALPURPOSE_VAR_CHECK_SYNTAX( _var_id ) )
        {
             var _msg = "The candidate var name '" + _var_id + "' does not match the correct pattern. So check" + _glob_crlf ;
                 _msg += _glob_crlf + "* that var name starts with '_', for example : _a ;" ;
                 _msg += _glob_crlf + "* to use alphanumeric chars + underscore only ;" ;
             if ( !_silent ) circles_lib_output( _out_channel, DISPATCH_WARNING, _msg, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
             return NO ;
        }
        else if ( CIRCLESembeddingsGENERALPURPOSEillegals.includes_i( _var_id.replaceAll( "_", "" ) ) )
        {
             var _msg = "The candidate var name '" + _var_id + "' is a reserved keyword" ;
             if ( !_silent ) circles_lib_output( _out_channel, DISPATCH_WARNING, _msg, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
             return NO ;
        }
        else if ( _var_value.includes( _var_id ) )
        {
             var _msg = "Detected cyclic reference of var"+_glob_crlf+_glob_crlf+" '"+_var_id+"'"+_glob_crlf+_glob_crlf+"inside input value"+_glob_crlf+_glob_crlf+"'"+_var_value+"'" ;
             if ( !_silent ) circles_lib_output( _out_channel, DISPATCH_WARNING, _msg, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
             return NO ;
        }
        else if ( !_var_id.testME( _glob_varname_regex_pattern ) )
        {
             var _msg = "The candidate var name '" + _var_id + "' includes invalid chars" ;
             if ( !_silent ) circles_lib_output( _out_channel, DISPATCH_WARNING, _msg, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
             return NO ;
        }

        var _v_complex = circles_lib_math_parse_formula( _var_value );
        _v_complex = parse_complex_from_string( _v_complex + "" );

        if ( !is_complex( _v_complex ) )
        {
            if ( !_silent ) circles_lib_output( _out_channel, DISPATCH_ERROR, "The input var is not a complex formula.", _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
            return NO ;
        }

        _plugin_user_vars[ ""+_var_id ] = _var_value ;
        CIRCLESembeddingsGENERALPURPOSE_VAR_REFRESH_PANEL( YES, NO );
        return YES ;
    }
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_REFRESH_PANEL( _refresh_vars_combo, _refresh_vals_combo )
{
    _refresh_vars_combo = safe_int( _refresh_vars_combo, YES );
    _refresh_vals_combo = safe_int( _refresh_vals_combo, YES );
    if ( _refresh_vars_combo )
    {
        var _combo_code = CIRCLESembeddingsGENERALPURPOSE_VAR_DECLARE_COMBO_BUILD();
        $("#PLUGINregisteredvarsCOMBOcontainer").html( _combo_code );
    }
    
    if ( _refresh_vals_combo )
    {
        var _combo_code = CIRCLESembeddingsGENERALPURPOSE_VAR_VALS_RECORD_COMBO_BUILD();
        $("#PLUGINrecordedvaluesCOMBOcontainer").html( _combo_code );
    }

    var _new_n = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 );
    $("#PLUGIN_GENERATE_GROUP_BTN").css( "color", _new_n > 0 ? DEFAULT_COLOR_GO : DEFAULT_COLOR_STD );
    if ( $("#PLUGINrenderBTN").get(0) != null ) $("#PLUGINrenderBTN").get(0).setAttribute( "class", "linkdead" );
    $("[id$=initBTN]").css( "color", COLOR_DISABLED );
    $("[id$=renderBTN]").css( "color", COLOR_DISABLED );
    $("#PLUGINparam_declareBTN").css( "color", DEFAULT_COLOR_STD );
    $("#CIRCLESembeddingsGENERALPURPOSE_ADD_BTN").css( "color", DEFAULT_COLOR_STD );
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_LIST( _output_channel )
{
    _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
	var _keys = _plugin_user_vars.keys_associative(), _n_keys = safe_size( _keys, 0 ), _html_code = "" ;
    if ( _n_keys > 0 )
    {
        _html_code += "<table>" ;
        _html_code += "<tr><td COLSPAN=\"3\">"+_n_keys+" key"+( _n_keys == 1 ? "" : "s" )+" ha"+( _n_keys == 1 ? "s" : "ve" )+" been registered</td></tr>" ;
        if ( _n_keys > 10 )
        {
            _html_code += "<tr><td VALIGN=\"top\">" ;
            _html_code += "<DIV STYLE=\"position:relative;width:auto;height:220px;overflow:auto;padding:3px;\">" ;
            _html_code += "<table>" ;
        }
        _html_code += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        _html_code += "<tr><td>Var name</td><td WIDTH=\"5\"></td><td ALIGN=\"right\">Var value</td></tr>" ;
        _html_code += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        $.each( _keys, function( _i, _key )
                {
                    _html_code += "<tr><td>"+_key+"</td><td WIDTH=\"5\"></td><td ALIGN=\"right\">"+_plugin_user_vars[_key]+"</td></tr>" ;
                    _html_code += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                } );
        if ( _n_keys > 10 )
        {
            _html_code = "</table>" ;
            _html_code = "</DIV>" ;
            _html_code = "</td></tr>" ;
        }
        _html_code += "</table>" ;
        circles_lib_output( _output_channel, DISPATCH_INFO, _html_code, _glob_app_title + " - Vars list" );
		return YES ;
    }
    else
    {
        _html_code += "<table><tr><td ALIGN=\"center\">The vars list is empty</td></tr></table>" ;
        circles_lib_output( _output_channel, DISPATCH_WARNING, _html_code, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
		return NO ;
    }
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_CHANGE() { CIRCLESembeddingsGENERALPURPOSE_VAR_DECLARE(); }

function CIRCLESembeddingsGENERALPURPOSE_VAR_VAL_REGISTER( _output_channel, _id, _val )
{
    _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
	_id = safe_string( _id, "" ), _val = safe_string( _val, "" );
    var _var_id = _id.length > 0 ? _id : $("#PLUGINvaridEDIT").val(), _var_value = _val.length > 0 ? _val : $("#PLUGINvarvalueEDIT").val();
    if ( _var_id.length > 0 && _var_value.length > 0 )
    {
        var _v_complex = circles_lib_math_parse_formula( _var_value );
        _v_complex = parse_complex_from_string( _v_complex + "" );
        if ( !is_complex( _v_complex ) )
        {
            circles_lib_output( _output_channel, DISPATCH_ERROR, "The input var is not a complex formula.", _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
            return NO ;
        }
        else
        {
            if ( !is_array( _plugin_rec_var_vals[''+_var_id] ) ) _plugin_rec_var_vals[''+_var_id] = [] ;
            if ( !_plugin_rec_var_vals[''+_var_id].includes( _var_value ) )
            _plugin_rec_var_vals[''+_var_id].push( _var_value );
            else
            {
			   switch( _output_channel )
			   {
				  case OUTPUT_SCREEN:
                  $( "#PLUGINrecordedvaluesCOMBOoutput" ).css( "color", DEFAULT_COLOR_WARNING );
                  $( "#PLUGINrecordedvaluesCOMBOoutput" ).html( "Already existing value" );
                  setTimeout( function() { $( "#PLUGINrecordedvaluesCOMBOoutput" ).html( "" ); }, 2500 );
				  break ;
				  case OUTPUT_TERMINAL:
				  circles_lib_output( _output_channel, DISPATCH_WARNING, "Already existing value", _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
				  break ;
				  default: break ;
			   }
            }
            
            var _combo_code = CIRCLESembeddingsGENERALPURPOSE_VAR_VALS_RECORD_COMBO_BUILD();
            $("#PLUGINrecordedvaluesCOMBOcontainer").html( _combo_code );
			return YES ;
        }
    }
    else
	{
		circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing or incomplete input vars data.", _glob_app_title );
		return NO ;
	}
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_VAL_DELETE( _question, _silent, _output_channel )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _ENTRY = $( "#PLUGINvarsvalsrecCOMBO" ).get(0) != null ? $( "#PLUGINvarsvalsrecCOMBO" ).val() : "" ;
    if ( safe_size( _ENTRY, 0 ) > 0 )
    {
       if ( _ENTRY.includes( ":" ) && _ENTRY.count( ":" ) == 1 )
       {
          _ENTRY = _ENTRY.split( ":" );
          var _var = _ENTRY[0], _val = _ENTRY[1] ;
          var _b_go = _question ? confirm( "Do you want to remove var '"+_var+"' with value '"+_val+"' ?" ) : YES ;
          if ( _b_go )
          {
             var _old_size = _plugin_rec_var_vals[''+_var].size_recursive();
             _plugin_rec_var_vals[''+_var].delete_entry( _val );
             var _new_size = _plugin_rec_var_vals[''+_var].size_recursive();
             if ( _new_size == _old_size - 1 )
             {
                if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_WARNING, "The value '"+_val+"' of var '"+_var+"' has been removed with success.", _glob_app_title );
                var _combo_code = CIRCLESembeddingsGENERALPURPOSE_VAR_VALS_RECORD_COMBO_BUILD();
                $("#PLUGINrecordedvaluesCOMBOcontainer").html( _combo_code );
                $("#PLUGINvaridEDIT").val( "" );
                $("#PLUGINvarvalueEDIT").val( "" );
             }
             else if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Problems while removing the value '"+_val+"' of var '"+_var+"'.", _glob_app_title );
          }
       }
    }
    else if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Please, select one entry to be removed.", _glob_app_title );
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_BOMB( _question, _silent, _output_channel )
{
	_question = safe_int( _question, 1 ), _silent = safe_int( _silent, 0 ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN ) ;
    if ( _question ? confirm( "Confirm to delete all vars permanently ?" ) : YES )
    {
		var _keys = _plugin_user_vars.keys_associative();
		if ( safe_size( _keys, 0 ) > 0 )
		{
		  	 $.each( _keys, function( _i, _input ) { _plugin_user_vars.remove_key( _input ) } );	 
		     _keys = _plugin_user_vars.keys_associative();
			 if ( !_silent )
			 circles_lib_output( _output_channel, safe_size( _keys, 0 ) == 0 ? DISPATCH_SUCCESS : DISPATCH_ERROR,
						 safe_size( _keys, 0 ) == 0 ? "All user-defined vars have been deleted with success" : "Fail to delete user-defined vars",
						 _glob_app_title );				 
		}
		else if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_WARNING, "No used-defined vars have been declared yet", _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
    }
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_CLEAN( _question, _silent )
{
   _question = safe_int( _question, 1 ), _silent = safe_int( _silent, 0 );
   if ( _question ? confirm( "Confirm to clean the edit boxes ?" ) : YES )
   {
      $("#PLUGINvaridEDIT").val(""), $("#PLUGINvarvalueEDIT").val("");
   }
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_DELETE( _question, _silent )
{
	_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _var_id = $("#PLUGINvaridEDIT").val(), _var_value = $("#PLUGINvarvalueEDIT").val();
    if ( _var_id.length == 0 || _var_value.length == 0 )
    {
        var _msg = "Can't delete var params:" + _glob_crlf ;
        if ( _var_id.length == 0 ) _msg += _glob_crlf + "missing var name" ;
        if ( _var_value.length == 0 ) _msg += _glob_crlf + "missing var value" ;
        if ( !_silent ) circles_lib_output( _out_channel, DISPATCH_WARNING, _msg, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
        return NO ;
    }
    else
    {
        if ( _question ? confirm( "Confirm to delete var '"+_var_id+"' ?" ) : YES )
        {
            _plugin_user_vars.remove_key( _var_id );
            var _deleted = _plugin_user_vars[ _var_id ] == null ? YES : NO ;
            var _msg = _deleted ? "Var '"+_var_id+"' has been deleted with success" : "Fail to delete var '"+_var_id+"'" ;
            if ( !_silent ) circles_lib_output( _out_channel, _deleted ? DISPATCH_SUCCESS : DISPATCH_ERROR, _msg, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
            if ( _deleted ) CIRCLESembeddingsGENERALPURPOSE_VAR_REFRESH_PANEL();
            return _deleted ? YES : NO ;
        }
        else return NO ;
    }
}

function CIRCLESembeddingsGENERALPURPOSE_SET_USERVARS_IN_PARAMS( _edit_acquisition, _gen_chunk )
{
	_edit_acquisition = safe_int( _edit_acquisition, YES );
    if ( _gen_chunk != null )
    {
         if ( _gen_chunk.length != 4 ) return NO ;
    }

    CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array.flush();
    if ( $("#PLUGIN_PARAM_A").get(0) != null && _edit_acquisition )
    {
        CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array.push( $("#PLUGIN_PARAM_A").val().length > 0 ? $("#PLUGIN_PARAM_A").val() : 0.0 );
    }
    else if ( _gen_chunk != null ) CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array.push( _gen_chunk[0] );

    if ( $("#PLUGIN_PARAM_B").get(0) != null && _edit_acquisition )
    {
        CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array.push( $("#PLUGIN_PARAM_B").val().length > 0 ? $("#PLUGIN_PARAM_B").val() : 0.0 );
    }
    else if ( _gen_chunk != null ) CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array.push( _gen_chunk[1] );

    if ( $("#PLUGIN_PARAM_C").get(0) != null && _edit_acquisition )
    {
        CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array.push( $("#PLUGIN_PARAM_C").val().length > 0 ? $("#PLUGIN_PARAM_C").val() : 0.0 );
    }
    else if ( _gen_chunk != null ) CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array.push( _gen_chunk[2] );

    if ( $("#PLUGIN_PARAM_D").get(0) != null && _edit_acquisition )
    {
        CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array.push( $("#PLUGIN_PARAM_D").val().length > 0 ? $("#PLUGIN_PARAM_D").val() : 0.0 );
    }
    else if ( _gen_chunk != null ) CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array.push( _gen_chunk[3] );

    if ( CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array.length != 4 ) return NO ;
    else
    {
        CIRCLESembeddingsGENERALPURPOSE_VAR_ALL_REPLACE_WITH_VAL();
        return YES ;
    }
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_IS_INCLUDED( _formula ) { return safe_size( _formula.match( /\$([a-zA-B]{1,})/gi ), 0 ) > 0 ? YES : NO ; }
function CIRCLESembeddingsGENERALPURPOSE_VAR_EXTRACT( _formula ) { return safe_size( _formula.match( /\$([a-zA-B]{1,})/gi ), 0 ) > 0 ? _matches : null ; }

function CIRCLESembeddingsGENERALPURPOSE_VAR_COMPUTE( _param_id, _output_channel )
{
	_out_channel = safe_int( _out_channel, OUTPUT_SCREEN ) ;
    var _ID = "PLUGIN_PARAM_" + _param_id, _param_formula = $( "#" + _ID ).val();
    if ( _param_formula.length == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Param '"+_param_id+"' is empty.", "CIRCLESformsGENERALOPTIONSoutputBOX" ) ;
    else
    {
        var _matches = CIRCLESembeddingsGENERALPURPOSE_VAR_EXTRACT( _param_formula );
        var _n_found = _matches == null ? 0 : safe_size( _matches, 0 );
        var _vars_names = _plugin_user_vars.keys_associative();
        var _vars_values = _plugin_user_vars.values_associative();
        var _n_vars = safe_size( _vars_names, 0 );
        if ( _n_vars > 0 )
        for( var _x = 0 ; _x < _n_vars ; _x++ ) _param_formula = _param_formula.replaceAll( _vars_names[_x], "("+_vars_values[_x]+")" );

        var _complex = circles_lib_math_parse_formula( _param_formula );
        var _html_code  = "<table>" ;
        _html_code += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        _html_code += "<tr><td>" + ( _n_found == 0 ? "No user-defined vars found inside param '"+_param_id+"'" : _n_found + " var" + ( _n_found == 1 ? "" : "s" ) + " found in param '"+_param_id+"'" ) + "</td></tr>" ;
        _html_code += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        if ( _n_found > 0 )
        {
           _html_code += "<tr><td>Detected vars: "+_matches.join( ", " )+"</td></tr>" ;
           _html_code += "<tr><td HEIGHT=\"5\"></td></tr>" ;
           _html_code += "<tr><td>Re-parsed formula : "+_param_formula+"</td></tr>" ;
           _html_code += "<tr><td HEIGHT=\"15\"></td></tr>" ;
        }
        _html_code += "<tr><td>The resulting value of param '"+_param_id+"' is</td></tr>" ;
        _html_code += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        _html_code += "<tr><td>"+_complex+"</td></tr>" ;
        _html_code += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        _html_code += "</table>" ;

        circles_lib_output( _out_channel, DISPATCH_INFO, _html_code, _glob_app_title + " - Compute param '"+_param_id+"'" );
    }
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_WATCH( _param_id, _out_channel )
{
	_out_channel = safe_int( _out_channel, OUTPUT_SCREEN ) ;
    var _ID = "PLUGIN_PARAM_" + _param_id ;
    var _param_formula = $( "#" + _ID ).val();
    if ( _param_formula.length == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Param '"+_param_id+"' is empty.", "CIRCLESformsGENERALOPTIONSoutputBOX" ) ;
    else if ( CIRCLESembeddingsGENERALPURPOSE_VAR_IS_INCLUDED( _param_formula ) )
    {
       var _vars = CIRCLESembeddingsGENERALPURPOSE_VAR_EXTRACT( _param_formula );
       var _n_extracted = _vars == null ? 0 : safe_size( _vars, 0 );
       var _html_code = "<table>" ;
       if ( _n_extracted == 0 ) _html_code += "<tr><td>No user-defined vars are included in param '"+_param_id+"'</td></tr>" ;
       else
       {
          _html_code += "<tr><td HEIGHT=\"6\"></td></tr>" ;
          _html_code += "<tr><td>Var name</td><td WIDTH=\"5\"></td><td ALIGN=\"right\">Var value</td></tr>" ;
          _html_code += "<tr><td HEIGHT=\"3\"></td></tr>" ;
          $.each( _vars, function( _i, _key )
                  {
                     _html_code += "<tr><td>"+_key+"</td><td WIDTH=\"5\"></td><td ALIGN=\"right\">"+_plugin_user_vars[_key]+"</td></tr>" ;
                     _html_code += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                  } );
       }
       _html_code += "</table>" ;
       circles_lib_output( _out_channel, _n_extracted == 0 ? DISPATCH_WARNING : DISPATCH_INFO, _html_code, _glob_app_title + " - Extracted vars from param '"+_param_id+"'" );
    }
    else circles_lib_output( _out_channel, DISPATCH_WARNING, "Param '"+_param_id+"' does not include any user-defined var.", _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_DECLARE_COMBO_BUILD()
{
    if ( _plugin_user_vars.is_associative() )
    {
        var _keys = _plugin_user_vars.keys_associative(), _values = _plugin_user_vars.values_associative();
        if ( _keys.length > 0 && _values.length > 0 )
        {
            var _n_vars = _keys.length ;
            var _msg = ( _n_vars == 0 ? "No" : _n_vars ) + " registered var" + ( _n_vars == 1 ? "" : "s" );
            $( "#PLUGINregisteredvarsLABEL" ).css( "color", _n_vars == 0 ? "#909090" : DEFAULT_COLOR_STD );
            $( "#PLUGINregisteredvarsLABEL" ).html( _msg );
        
            var _html_code = "<SELECT ONCHANGE=\"javascript:$('#PLUGINvaridEDIT').val(this.options[this.selectedIndex].text);$('#PLUGINvarvalueEDIT').val(this.value);\" ID=\"PLUGINuservarsCOMBO\">" ;
            _html_code += "<OPTION SELECTED VALUE=\"\">" ;
            for( var _i = 0 ; _i < _keys.length ; _i++ ) _html_code += "<OPTION VALUE=\""+_values[_i]+"\">" + _keys[_i] ;
            _html_code += "</SELECT>" ;
            return _html_code ;
        }
        else return "" ;
    }
    else return "" ;
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_VALS_RECORD_COMBO_BUILD()
{
    if ( _plugin_rec_var_vals.is_associative() )
    {
        var _n_vals = _plugin_rec_var_vals.size_associative();
        if ( _n_vals > 0 )
        {
            $( "#PLUGINregisteredvalsLABEL" ).html( ( _n_vals == 0 ? "No" : _n_vals )+" registered value"+( _n_vals == 1 ? "" : "s" ) );
            var _html_code = "<SELECT ONCHANGE=\"javascript:CIRCLESembeddingsGENERALPURPOSE_VARS_VALS_RECORD_COMBO_SELECT();\" ID=\"PLUGINvarsvalsrecCOMBO\">" ;
                _html_code += "<OPTION SELECTED VALUE=\"\">" ;
            var _keys = _plugin_rec_var_vals.keys_associative();
            if ( !is_array( _keys ) ) _keys = [] ;
            for( var _k = 0 ; _k < _keys.length ; _k++ )
               $.each( _plugin_rec_var_vals[ ""+_keys[_k] ], function( _i, _item ) { _html_code += "<OPTION VALUE=\""+_keys[_k]+":"+_item+"\">" + _keys[_k] + ":" + _item ; } );                

		   _html_code += "</SELECT>" ;
            return _html_code ;
        }
        else return "" ;
    }
    else return "" ;
}

function CIRCLESembeddingsGENERALPURPOSE_VARS_VALS_RECORD_COMBO_SELECT()
{
    var _combo = $( "#PLUGINvarsvalsrecCOMBO" ).get(0);
    var _entry = _combo.options[_combo.selectedIndex].text ;
    if ( _entry.includes( ":" ) && _entry.count( ":" ) == 1 )
    {
       var _entryARRAY = _entry.split( ":" );
       $('#PLUGINvaridEDIT').val( _entryARRAY[0] );
       $('#PLUGINvarvalueEDIT').val( _entryARRAY[1] );
       $("#PLUGIN_GENERATE_GROUP_BTN").css( "color", DEFAULT_COLOR_GO );
       CIRCLESembeddingsGENERALPURPOSE_VAR_DECLARE( NO, YES );
    }
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_HELP( _section, _output_channel )
{
    _section = safe_int( _section, 1 ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN ) ;
    var _msg = "" ;
    switch( _section )
    {
        case 1: // vars info
        _msg += "Var name shall start with '_' (underscore), for example : _a ;" ;
        _msg += "\n\nYou can use alphanumeric chars and underscore exclusively ;" ;
        break ;
        default: break ;
    }
    circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_EXPORT()
{
    var _exported_code = [];
    var _index_ref = _plugin_last_ref;
    var _desc = _plugin_definitions_array[_plugin_last_ref] ;
    var _info = _plugin_info_array[_index_ref] ;
    if ( _plugin_user_vars.size_associative > 0 || CIRCLESembeddingsGENERALPURPOSE_gens_container.length > 0 )
    {
       _exported_code.push( "plugin set " + _index_ref );
       if ( safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 ) > 0 )
       $.each( CIRCLESembeddingsGENERALPURPOSE_gens_container, function( _i, _chunk )
               {
                 _exported_code.push( "plugin type a" + " " + _chunk[0] );
                 _exported_code.push( "plugin type b" + " " + _chunk[1] );
                 _exported_code.push( "plugin type c" + " " + _chunk[2] );
                 _exported_code.push( "plugin type d" + " " + _chunk[3] );
               } );

       if ( _plugin_user_vars.is_associative() )
       {
           var _keys = _plugin_user_vars.keys_associative();
           var _values = _plugin_user_vars.values_associative();
           if ( _keys.length > 0 && _values.length > 0 )
           {
               for( var _i = 0 ; _i < _keys.length ; _i++ )
               _exported_code.push( "plugin send var.save "+_keys[_i]+" "+_values[_i] );
           }
       }

       _exported_code.push( "plugin run" );
    }
    return _exported_code.clone();
}

function CIRCLESembeddingsGENERALPURPOSE_VAR_IMPORT( _one_row_of_code )
{
    var _tokens = _one_row_of_code.split( " " ), _action = "", _tok = "" ;
    var _index_ref = _plugin_last_ref;
    if ( _plugin_user_vars.size_associative() > 0 && _plugin_import_mask & 1 == 0 )
    {
         _plugin_user_vars.flush_associative();
         _plugin_import_mask |= 1 ;
    }
    if ( CIRCLESembeddingsGENERALPURPOSE_gens_container.length > 0 && _plugin_import_mask & 2 == 0 )
    {
         CIRCLESembeddingsGENERALPURPOSE_gens_container.flush();
         _plugin_import_mask |= 2 ;
    }

    var _i, _cmd_array, _cmd_str, _params_str, _pieces, _vartype, _var_value, _var_array ;
    for( var _i = 0 ; _i < _tokens.length ; _i++ )
    {
         _tok = _tokens[ _i ] ;
         if ( _tok.is_one_of_i( "open", "run", "set", "var" ) ) _action = _tok ;
         else if ( _action.is_one_of_i( "open", "run", "set" ) )
         {
            // usual parse of cmd line as in the compiler
            _cmd_array = circles_lib_terminal_parse_cmd( _one_row_of_code );
            _cmd_str = _cmd_array['cmd'].trim();
            _params_str = _cmd_array['params'].trim();
            circles_lib_batch_compiler_exec( _cmd_str, _params_str, "", YES );
         }
         else if ( _action.stricmp( "var" ) )
         {
            if ( _tok.includes( "=" ) && _tok.count( "=" ) == 1 )
            {
               _pieces = _tok.split( "=" ), _vartype = _pieces[0].charAt(0), _var_value = _pieces[1] ;
               if ( _vartype.stricmp( "v" ) ) // it's a user var
               {
                  _var_array = _var_value.replaceAll( [ "[", "]" ], "").split( "@" );
                  _plugin_user_vars[ _var_array[0] ] = _var_array[1] ;
                  circles_lib_output( OUTPUT_SCRIPT, DISPATCH_SUCCESS, "Plug-in user var '"+_var_array[0]+"' imported with success.", "CIRCLESdebugDIV" );
               }
               else if ( _vartype.stricmp( "g" ) ) // it's generator param
               {
                  _plugin_import_chunk.push( _var_value );
                  if ( _plugin_import_chunk.length == 4 )
                  {
                     _plugin_import_gens.push( _plugin_import_chunk.clone() );
                     _plugin_import_chunk.flush();
                     if ( _plugin_rec_configs_array[_index_ref] == null ) _plugin_rec_configs_array[ _index_ref ] = [] ;
                     jQuery.extend( _plugin_rec_configs_array[_index_ref], _plugin_import_gens );
                     circles_lib_output( OUTPUT_SCRIPT, DISPATCH_SUCCESS, "Plug-in generator var '"+_vartype+"' imported with success.", "CIRCLESdebugDIV" );
                  }
               }
            }
            else
            {
               _glob_terminal_coderun_break = _glob_terminal_critical_halt = YES ;
               circles_lib_output( OUTPUT_SCRIPT, DISPATCH_ERROR, "Plug-in var syntax error.", _debug_ctrl_id );
               break ;
            }
         }
    }
}