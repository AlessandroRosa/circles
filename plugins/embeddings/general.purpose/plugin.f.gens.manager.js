function CIRCLESembeddingsGENERALPURPOSE_GEN_MANAGER( _opcode, _silent, _output_channel )
{
	_silent = safe_int( _silent, NO ), _opcode = safe_int( _opcode, CIRCLESembeddingsGENERALPURPOSE_ADD );
	_output_channel = safe_int( _output_channel, OUTPUT_SPECIAL_FX );
    var _entries = $( "[id^=PLUGIN_PARAM_]" );
    $.each( _entries, function( _i, _id ) { $( _id ).val( $( _id ).val().replaceAll( ",", "." ) ); } );
    var _index_ref = _plugin_last_ref, _opcode_str = "" ;
    if ( _opcode == CIRCLESembeddingsGENERALPURPOSE_ADD )
	{
		CIRCLESembeddingsGENERALPURPOSEcurr_sel = UNDET ;
		_opcode_str = "add" ;
	}
    else if ( _opcode == CIRCLESembeddingsGENERALPURPOSE_UPDATE ) _opcode_str = "update" ;
    else if ( _opcode == CIRCLESembeddingsGENERALPURPOSE_DELETE ) _opcode_str = "delete" ;
    else if ( _opcode == CIRCLESembeddingsGENERALPURPOSE_NEW ) _opcode_str = "new" ;

    CIRCLESembeddingsGENERALPURPOSE_a_formula = $("#PLUGIN_PARAM_A").val();
    CIRCLESembeddingsGENERALPURPOSE_b_formula = $("#PLUGIN_PARAM_B").val();
    CIRCLESembeddingsGENERALPURPOSE_c_formula = $("#PLUGIN_PARAM_C").val();
    CIRCLESembeddingsGENERALPURPOSE_d_formula = $("#PLUGIN_PARAM_D").val();

    if ( _opcode == CIRCLESembeddingsGENERALPURPOSE_NEW )
    {
        var _b_go = ( CIRCLESembeddingsGENERALPURPOSE_a_formula.length == 0 && CIRCLESembeddingsGENERALPURPOSE_b_formula.length == 0 &&
                      CIRCLESembeddingsGENERALPURPOSE_c_formula.length == 0 && CIRCLESembeddingsGENERALPURPOSE_a_formula.length == 0 ) ? YES : confirm( "Do you want to clean all input boxes ?" );
        if ( _b_go )
        {
           $("#CIRCLESGENERALPURPOSEmainDIV").get(0).tabber.tabShow(0);
           $("#PLUGIN_PARAM_A").val( "" );
           $("#PLUGIN_PARAM_B").val( "" );
           $("#PLUGIN_PARAM_C").val( "" );
           $("#PLUGIN_PARAM_D").val( "" );
           $("#PLUGIN_PARAM_A").focus();
		   CIRCLESembeddingsGENERALPURPOSEcurr_sel = UNDET ;
		   circles_lib_output( _output_channel, DISPATCH_WARNING, "Form has been cleaned for a new entry", 'PLUGIN_OUTMSG' ) ;
		   return YES ;
        }
        else return NO ;
    }

    var _IS_DUPLICATE = CIRCLESembeddingsGENERALPURPOSE_CHECK_DUPLICATE( CIRCLESembeddingsGENERALPURPOSE_a_formula, CIRCLESembeddingsGENERALPURPOSE_b_formula, CIRCLESembeddingsGENERALPURPOSE_c_formula, CIRCLESembeddingsGENERALPURPOSE_d_formula );
    if ( _opcode == CIRCLESembeddingsGENERALPURPOSE_ADD && _IS_DUPLICATE )
    {
	  var _MSG = "", _index = CIRCLESembeddingsGENERALPURPOSE_FIND_INDEX( CIRCLESembeddingsGENERALPURPOSE_a_formula, CIRCLESembeddingsGENERALPURPOSE_b_formula, CIRCLESembeddingsGENERALPURPOSE_c_formula, CIRCLESembeddingsGENERALPURPOSE_d_formula );
      if ( _index == CIRCLESembeddingsGENERALPURPOSEcurr_sel ) _MSG = "Update won't be performed: no modifications detected in this generator" ;
      else
      {
         _MSG = "There exists already one generator including the same parameter values in this list." ;
	     _MSG += _glob_crlf + "Duplicates will be not admitted into the current candidate group," ;
		 _MSG += _glob_crlf.repeat(2)+"This entry won't be inserted !" ;
      }
	  circles_lib_output( _output_channel, DISPATCH_WARNING, _MSG, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
	  return NO ;
	}
	else if ( _opcode == CIRCLESembeddingsGENERALPURPOSE_UPDATE && CIRCLESembeddingsGENERALPURPOSEcurr_sel == UNDET )
	{
	  circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't "+_opcode_str+" this gen: missing reference index.", 'PLUGIN_OUTMSG' ) ;
	  return NO ;
	}
	else if ( _opcode == CIRCLESembeddingsGENERALPURPOSE_UPDATE && CIRCLESembeddingsGENERALPURPOSE_gens_container[ CIRCLESembeddingsGENERALPURPOSEcurr_sel ] == null )
	{
	  circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't "+_opcode_str+" this gen: unfound referenced element.", 'PLUGIN_OUTMSG' ) ;
	  return NO ;
	}
    else
    {
		CIRCLESembeddingsGENERALPURPOSE_SET_REGISTEREDVARS_IN_PARAMS( YES, null );
        console.log( "IN1", CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array );
		var _ret_scan = CIRCLESembeddingsGENERALPURPOSE_VAR_ALL_REPLACE_WITH_VAL();
        console.log( "IN2", _ret_scan );
        var _RET_CHUNK = CIRCLESembeddingsGENERALPURPOSE_PARSE( CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array[0],
			CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array[1],
			CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array[2],
			CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array[3] );

	    var _start_index = 0 ;
	    var _RET_MASK = _RET_CHUNK[_start_index] ;
    		_start_index++ ;
	    var _A_COMPLEX = _RET_CHUNK[_start_index] ;
    		_start_index++ ;
	    var _B_COMPLEX = _RET_CHUNK[_start_index] ;
    		_start_index++ ;
	    var _C_COMPLEX = _RET_CHUNK[_start_index] ;
     		_start_index++ ;
	    var _D_COMPLEX = _RET_CHUNK[_start_index] ;

	    $("#PLUGIN_PARAM_A").css( "background-color", _RET_MASK & 1 == 0 ? DEFAULT_COLOR_ERROR : DEFAULT_EDIT_BKCOLOR_ENABLED );
	    $("#PLUGIN_PARAM_B").css( "background-color", _RET_MASK & 2 == 0 ? DEFAULT_COLOR_ERROR : DEFAULT_EDIT_BKCOLOR_ENABLED );
	    $("#PLUGIN_PARAM_C").css( "background-color", _RET_MASK & 4 == 0 ? DEFAULT_COLOR_ERROR : DEFAULT_EDIT_BKCOLOR_ENABLED );
	    $("#PLUGIN_PARAM_D").css( "background-color", _RET_MASK & 8 == 0 ? DEFAULT_COLOR_ERROR : DEFAULT_EDIT_BKCOLOR_ENABLED );

	    if ( _RET_MASK == 15 ) // all entries are ok
	    {
			_A_COMPLEX = parse_complex_from_string( _A_COMPLEX + "" );
			_B_COMPLEX = parse_complex_from_string( _B_COMPLEX + "" );
			_C_COMPLEX = parse_complex_from_string( _C_COMPLEX + "" );
			_D_COMPLEX = parse_complex_from_string( _D_COMPLEX + "" );
			if ( is_complex( _A_COMPLEX ) && is_complex( _B_COMPLEX ) && is_complex( _C_COMPLEX ) && is_complex( _D_COMPLEX ) )
		    {
				if ( _opcode == CIRCLESembeddingsGENERALPURPOSE_ADD )
		  		{
					var _old_n = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 );
					CIRCLESembeddingsGENERALPURPOSE_gens_container.push( [ CIRCLESembeddingsGENERALPURPOSE_a_formula, CIRCLESembeddingsGENERALPURPOSE_b_formula, CIRCLESembeddingsGENERALPURPOSE_c_formula, CIRCLESembeddingsGENERALPURPOSE_d_formula ] );
					var _new_n = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 );
					CIRCLESembeddingsGENERALPURPOSEcurr_sel = UNDET ;
					CIRCLESembeddingsGENERALPURPOSE_CLEAN(NO,YES);
					$("#PLUGIN_PARAM_A").focus();
					$("#PLUGIN_GENERATE_GROUP_BTN").css( "color", _new_n > 0 ? DEFAULT_COLOR_GO : DEFAULT_COLOR_ERROR );
					if ( $("#PLUGINrenderBTN").get(0) != null ) $("#PLUGINrenderBTN").get(0).setAttribute( "class", "linkdead" );
					$("[id$=initBTN]").css( "color", COLOR_DISABLED );
					$("[id$=renderBTN]").css( "color", COLOR_DISABLED );

					var _ret = NO ;
					if ( _new_n > _old_n )
					{
						circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Generator #"+_new_n+" has been added with success to the candidate group!", 'PLUGIN_OUTMSG' ) ;
						_ret = YES ;
					}
				}
				else if ( _opcode == CIRCLESembeddingsGENERALPURPOSE_UPDATE )
				{
					var _b_go = _silent ? YES : confirm( "Confirm to "+_opcode_str+" params for generator #"+(CIRCLESembeddingsGENERALPURPOSEcurr_sel+1)+" ?" );
 					if ( _b_go )
 					{
						var _old_n = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 );
						CIRCLESembeddingsGENERALPURPOSE_gens_container[ CIRCLESembeddingsGENERALPURPOSEcurr_sel ] = [ CIRCLESembeddingsGENERALPURPOSE_a_formula, CIRCLESembeddingsGENERALPURPOSE_b_formula, CIRCLESembeddingsGENERALPURPOSE_c_formula, CIRCLESembeddingsGENERALPURPOSE_d_formula ] ;
						var _new_n = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 );
   						$("#PLUGIN_GENERATE_GROUP_BTN").css( "color", _new_n > 0 ? DEFAULT_COLOR_GO : DEFAULT_COLOR_ERROR );
   						$("#CIRCLESembeddingsGENERALPURPOSE_UPDATE_BTN").css( "color", "black" );
						if ( $("#PLUGINrenderBTN").get(0) != null ) $("#PLUGINrenderBTN").get(0).setAttribute( "class", "linkdead" );
						$("[id$=initBTN]").css( "color", COLOR_DISABLED );
						$("[id$=renderBTN]").css( "color", COLOR_DISABLED );
						if ( _new_n == _old_n )
						{
							circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Gen #"+(CIRCLESembeddingsGENERALPURPOSEcurr_sel+1)+" has been updated with success!", 'PLUGIN_OUTMSG' ) ;
							_ret = YES ;
						}
					}
				}

				if ( _ret == YES )
				{
					jQuery.extend( _plugin_rec_configs_array[ _index_ref ], CIRCLESembeddingsGENERALPURPOSE_gens_container );
					CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(YES);
				}
				return _ret ;
			}
			else
			{
			    circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't "+_opcode_str+" the generator: some entries could be empty.", 'PLUGIN_OUTMSG' ) ;
				return NO ;
			}
		}
		else
        {
            var _msg = "Can't "+_opcode_str+" the generator: some entries have not been correctly parsed." ;
                _msg += _glob_crlf.repeat(2) + "The input params might include invalid chars or unregistered vars." ;
            circles_lib_output( _output_channel, DISPATCH_WARNING, _msg, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
			return NO ;
        }
	}
	return NO ;
}

function CIRCLESembeddingsGENERALPURPOSE_GEN_DELETE( _index, _question, _silent, _output_channel )
{
	_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
	_index = Math.max( safe_int( _index, UNFOUND ), UNFOUND ), _output_channel = safe_int( _output_channel, OUTPUT_SPECIAL_FX );
	if ( _index != UNFOUND )
	{
		var _candidate_entry = CIRCLESembeddingsGENERALPURPOSE_gens_container[_index] ;
		if ( _candidate_entry != null )
		{
            var _b_go = !_question ? YES : confirm( "Confirm to delete generator #"+( _index + 1 )+" ?" );
			if ( _b_go )
			{
                var _index_ref = _plugin_last_ref, _old_length = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 );
				CIRCLESembeddingsGENERALPURPOSE_gens_container.remove( _index, _index );
				var _new_length = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 );
				if ( _new_length == _old_length - 1 )
				{
				    CIRCLESembeddingsGENERALPURPOSEcurr_sel = UNDET ;
					_plugin_rec_configs_array[ _index_ref ] = [] ;
					jQuery.extend( _plugin_rec_configs_array[ _index_ref ], CIRCLESembeddingsGENERALPURPOSE_gens_container );
					CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(YES);
					$("#PLUGIN_GENERATE_GROUP_BTN").css( "color", DEFAULT_COLOR_GO );
					if ( $("#PLUGINrenderBTN").get(0) != null ) $("#PLUGINrenderBTN").get(0).setAttribute( "class", "linkdead" );
					$("[id$=initBTN]").css( "color", COLOR_DISABLED );
					$("[id$=renderBTN]").css( "color", COLOR_DISABLED );
					circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Deletion of entry '"+( _index + 1 )+"' has been successful.", 'PLUGIN_OUTMSG' ) ;
					return YES ;
				}
				else
				{
					circles_lib_output( _output_channel, DISPATCH_WARNING, "Deletion of entry '"+( _index + 1 )+"' has failed.", 'PLUGIN_OUTMSG' ) ;
					return NO ;
				}
			}
			else
			{
				circles_lib_output( _output_channel, DISPATCH_WARNING, "Deletion stopped by user.", 'PLUGIN_OUTMSG' ) ;
				return NO ;
			}
		}
		else
		{
			circles_lib_output( _output_channel, DISPATCH_ERROR, "Can't delete entry '"+( _index + 1 )+"': invalid referenced data.", 'PLUGIN_OUTMSG' ) ;
			return NO ;
		}
	}
	else
	{
		circles_lib_output( _output_channel, DISPATCH_ERROR, "Can't delete entry '"+( _index + 1 )+"': missing reference data.", 'PLUGIN_OUTMSG' ) ;
		return NO ;
	}
}

function CIRCLESembeddingsGENERALPURPOSE_GEN_SELECT( _index, _N_GENS, _src_mask, _output_channel )
{
    _index = safe_int( _index, UNDET ), _N_GENS = safe_int( _N_GENS, 0 ), _src_mask = safe_int( _src_mask, 1 ) ;
	_output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _input_maps_array = _src_mask == 1 ? CIRCLESembeddingsGENERALPURPOSE_gens_container : _glob_seeds_array ;
	var GEN_CHUNK = _input_maps_array[_index] ;
  	if ( GEN_CHUNK != null )
	{
        for( var _i = 0 ; _i < _N_GENS; _i++ ) $("#PLUGIN_PAGINATION_" + _i ).css( "font-weight", _i == _index ? "bold" : "normal" );

		var _A_COMPLEX = _src_mask == 1 ? GEN_CHUNK[0] : GEN_CHUNK.map.a.formula() ;
        var _B_COMPLEX = _src_mask == 1 ? GEN_CHUNK[1] : GEN_CHUNK.map.b.formula() ;
        var _C_COMPLEX = _src_mask == 1 ? GEN_CHUNK[2] : GEN_CHUNK.map.c.formula() ;
        var _D_COMPLEX = _src_mask == 1 ? GEN_CHUNK[3] : GEN_CHUNK.map.d.formula() ;
	 	$("#PLUGIN_PARAM_A").val( _A_COMPLEX );
	 	$("#PLUGIN_PARAM_B").val( _B_COMPLEX );
	 	$("#PLUGIN_PARAM_C").val( _C_COMPLEX );
	 	$("#PLUGIN_PARAM_D").val( _D_COMPLEX );
	 	CIRCLESembeddingsGENERALPURPOSEcurr_sel = _index ;

        _glob_disk_sel_index = _index ;
        _glob_zplane_selected_items_array.flush();
        _glob_zplane_selected_items_array.push( _index );
        var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _output_channel );
	    var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
		var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
		if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
        else $( "#CIRCLESGENERALPURPOSEmainDIV" ).get(0).tabber.tabShow(0);
		return YES ;
	}
	else
	{
		circles_lib_output( _output_channel, DISPATCH_ERROR, "Selection aborted: missing reference index.", 'PLUGIN_OUTMSG' ) ;
		return NO ;
	}
}

function CIRCLESembeddingsGENERALPURPOSE_GENS_RESTORE()
{
    var _index_ref = _plugin_last_ref;
        CIRCLESembeddingsGENERALPURPOSE_gens_container.flush();
    if ( safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 ) == 0 )
    jQuery.extend( CIRCLESembeddingsGENERALPURPOSE_gens_container, _plugin_rec_configs_array[ _index_ref ] );
}

function CIRCLESembeddingsGENERALPURPOSE_GENS_REGISTER()
{
    var _index_ref = _plugin_last_ref;
    if ( safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 ) > 0 )
    jQuery.extend( _plugin_rec_configs_array[ _index_ref ], CIRCLESembeddingsGENERALPURPOSE_gens_container );
}

function CIRCLESembeddingsGENERALPURPOSE_GEN_LIST( _resolve_formula, _restore, _show, _input_maps_array )
{
    _resolve_formula = safe_int( _resolve_formula, NO ), _restore = safe_int( _restore, NO ), _show = safe_int( _show, NO );
    var _src_mask = !is_array( _input_maps_array ) ? 1 : 2 ;
    if ( _src_mask == 1 ) _input_maps_array = CIRCLESembeddingsGENERALPURPOSE_gens_container ;
    var _index_ref = _plugin_last_ref;
    if ( _restore ) CIRCLESembeddingsGENERALPURPOSE_GENS_RESTORE();
    var _N_GENS = safe_size( _input_maps_array, 0 );
 	var HTMLcode = "<table WIDTH=\"100%\">" ;
	HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    if ( _N_GENS > 0 )
    {
		HTMLcode += "<tr>" ;
		HTMLcode += "<td WIDTH=\"100%\" VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#DCEDE7;padding:3px;\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td>" ;
        if ( _N_GENS > 0 )
        {
            HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F5F5F5;padding:3px;\"><table><tr>" ;
            var _scroll_to = 0, _bold ;
            for( var _i = 0 ; _i < _N_GENS; _i++ )
            {
                _scroll_to = _i * 128, _bold = _i == CIRCLESembeddingsGENERALPURPOSEcurr_sel ? "font-weight:bold;" : "" ;
                HTMLcode += "<td ID=\"PLUGIN_PAGINATION_"+_i+"\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_GEN_SELECT("+_i+","+_N_GENS+","+_src_mask+");$('#PLUGIN_GEN_LIST_DIV').scrollTop("+_scroll_to+");circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, 'Change above params and update', 'PLUGIN_OUTMSG' )\" CLASS=\"link\" STYLE=\"width:20px;text-align:center;"+_bold+"\">"+(_i+1)+"</td>" ;
            }
            HTMLcode += "</tr></table></td>" ;
        }

        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td ALIGN=\"right\">"+_N_GENS+" entr"+( _N_GENS == 1 ? "y" : "ies" )+"</td>" ;
        if ( _src_mask == 1 )
        HTMLcode += "<td WIDTH=\"5\"></td><td VALIGN=\"middle\"><IMG SRC=\"%imgpath%icons/arrows/single/arrow.right.02.12x12.png\"></td><td WIDTH=\"5\"></td><td ALIGN=\"right\">"+(_N_GENS*2)+" gens group</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        if ( _src_mask == 2 )
        {
			HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
   		 	HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"color:#3E99DB;font-size:10pt;\">Full group list</td></tr>" ;
  		 	HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        }
    	else if ( _resolve_formula )
   		{
			HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
			HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"color:#3E99DB;font-size:10pt;\">List with formulas resolved into values</td></tr>" ;
  		 	HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
   		}
    }

    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
 	HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\"100%\">" ;
	HTMLcode += "<div ID=\"PLUGIN_GEN_LIST_DIV\" STYLE=\"position:relative;width:100%;height:"+( $( "#CIRCLESGENERALPURPOSE_TAB_01" ).height() - 40 )+"px;overflow:auto;padding:1px;\">" ;
	HTMLcode += "<table WIDTH=\"100%\">" ;
	if ( _N_GENS > 0 )
	{
		var GEN_CHUNK = null, _GEN_CHECK_MASK ;
        var _A_FORMULA, _B_FORMULA, _C_FORMULA, _D_FORMULA ;
        var _CALC_A_FORMULA, _CALC_B_FORMULA, _CALC_C_FORMULA, _CALC_D_FORMULA ;
        var _is_normalized, _mm, _including_vars, _i, _c, _mm, _src_mask = 0 ;
		for( _i = 0 ; _i < _N_GENS ; _i++ )
	  	{
			GEN_CHUNK = _input_maps_array[_i], _including_vars = NO ;
			if ( GEN_CHUNK != null )
			{
				if ( is_item_obj( GEN_CHUNK ) )
                {
                    _A_FORMULA = GEN_CHUNK.map.a.formula();
                    _B_FORMULA = GEN_CHUNK.map.b.formula();
                    _C_FORMULA = GEN_CHUNK.map.c.formula();
                    _D_FORMULA = GEN_CHUNK.map.d.formula();
                    _GEN_CHECK_MASK = 15 ;
                    _src_mask = 2 ;
                }
                else
                {
                    _GEN_CHECK_MASK = 0 ;
                    _src_mask = 1 ;
    				for( _c = 0 ; _c < 4 ; _c++ ) if ( GEN_CHUNK[_c] != null ) _GEN_CHECK_MASK |= GEN_CHUNK[_c].length > 0 ? Math.pow(2,_c) : 0 ;
    
					_A_FORMULA = GEN_CHUNK[0], _B_FORMULA = GEN_CHUNK[1], _C_FORMULA = GEN_CHUNK[2], _D_FORMULA = GEN_CHUNK[3] ;
                    // resolve values in generators formula
                    var _vars_names = _plugin_rec_var_vals.keys_associative();
                    var _n_vars = safe_size( _vars_names, 0 ) ;
                    for( var _x = 0 ; _x < _n_vars ; _x++ )
                    {
                      _A_FORMULA = _A_FORMULA.replaceAll( _vars_names[_x], "("+_plugin_rec_var_vals[ _vars_names[_x] ]+")" );
                      _B_FORMULA = _B_FORMULA.replaceAll( _vars_names[_x], "("+_plugin_rec_var_vals[ _vars_names[_x] ]+")" );
                      _C_FORMULA = _C_FORMULA.replaceAll( _vars_names[_x], "("+_plugin_rec_var_vals[ _vars_names[_x] ]+")" );
                      _D_FORMULA = _D_FORMULA.replaceAll( _vars_names[_x], "("+_plugin_rec_var_vals[ _vars_names[_x] ]+")" );
                    }

					_CALC_A_FORMULA = circles_lib_math_parse_formula( _A_FORMULA );
					_CALC_B_FORMULA = circles_lib_math_parse_formula( _B_FORMULA );
					_CALC_C_FORMULA = circles_lib_math_parse_formula( _C_FORMULA );
					_CALC_D_FORMULA = circles_lib_math_parse_formula( _D_FORMULA );
    
                    _CALC_A_FORMULA = parse_complex_from_string( _CALC_A_FORMULA );
           			_CALC_B_FORMULA = parse_complex_from_string( _CALC_B_FORMULA );
           			_CALC_C_FORMULA = parse_complex_from_string( _CALC_C_FORMULA );
               		_CALC_D_FORMULA = parse_complex_from_string( _CALC_D_FORMULA );
    
                    $.each( GEN_CHUNK, function( _i, _param ) { if ( _param.includes( "$" ) ) { _including_vars = YES ; return ; } } );
          
                    _mm = new mobius_map( _CALC_A_FORMULA, _CALC_B_FORMULA, _CALC_C_FORMULA, _CALC_D_FORMULA );
                    _is_normalized = _including_vars ? NO : _mm.is_normalized();
    				if ( _resolve_formula )
    				{
                       _A_FORMULA = _CALC_A_FORMULA.formula();
                       _B_FORMULA = _CALC_B_FORMULA.formula();
                       _C_FORMULA = _CALC_C_FORMULA.formula();
                       _D_FORMULA = _CALC_D_FORMULA.formula();
    				}
                }

				HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
				HTMLcode += "<tr>" ;
				HTMLcode += "<td ROWSPAN=\"3\" WIDTH=\"4\"></td>" ;
				HTMLcode += "<td VALIGN=\"top\">" ;
				HTMLcode += "<A ID=\"generalpurposegen"+_i+"\"></A>" ;
				HTMLcode += "<table WIDTH=\"100%\">" ;
				HTMLcode += "<tr>" ;
                HTMLcode += "<td VALIGN=\"top\">" ;
                HTMLcode += "<table>" ;
				HTMLcode += "<tr>" ;
                HTMLcode += "<td STYLE=\"color:"+( _GEN_CHECK_MASK == 15 ? "#27C427" : DEFAULT_COLOR_ERROR )+";\">Generator #"+(_i+1)+"</td>";
				HTMLcode += "<td WIDTH=\"10\"></td>" ;
  				HTMLcode += CIRCLESembeddingsGENERALPURPOSEcurr_sel == _i ? "<td WIDTH=\"40\" STYLE=\"color:#3E99DB;\">Selected</td>" : "<td WIDTH=\"40\"></td>" ;
  				HTMLcode += "<td WIDTH=\"5\"></td>" ;
				HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_GEN_SELECT("+_i+", "+_N_GENS+","+_src_mask+");\">Select</td>" ;
                if ( _src_mask == 1 )
                {
		 			HTMLcode += "<td WIDTH=\"2\"></td>" ;
		 			HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_GEN_DELETE("+_i+");\">Delete</td>" ;
					HTMLcode += "<td WIDTH=\"2\"></td>" ;
    				HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_MOBIUS_INFO("+_i+");\">Info</td>" ;
                }
                if ( !_is_normalized && !_including_vars )
                {
					HTMLcode += "<td WIDTH=\"5\"></td>" ;
     				HTMLcode += !_resolve_formula ? "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_GEN_NORMALIZE("+_i+");\">Normalize</td>" : "<td WIDTH=\"40\"></td>" ;
                }
  				HTMLcode += "<td WIDTH=\"5\"></td>" ;
				HTMLcode += "</tr>" ;
                HTMLcode += "</table>" ;
                HTMLcode += "</td>" ;
                HTMLcode += "</tr>" ;
				HTMLcode += "</table>" ;
				HTMLcode += "</td>" ;
				HTMLcode += "</tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
				HTMLcode += "<tr>" ;
				HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#E2F1F1;\">" ;
                HTMLcode += "<table WIDTH=\"100%\" WIDTH=\"220\">" ;
				HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"padding:3px;background-color:#DDE3F4;color:"+( _GEN_CHECK_MASK & 1 ? DEFAULT_COLOR_STD : DEFAULT_COLOR_ERROR )+";\">a: "+_A_FORMULA+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"padding:3px;color:"+( _GEN_CHECK_MASK & 2 ? DEFAULT_COLOR_STD : DEFAULT_COLOR_ERROR )+";\">b: "+_B_FORMULA+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"padding:3px;background-color:#DDE3F4;color:"+( _GEN_CHECK_MASK & 4 ? DEFAULT_COLOR_STD : DEFAULT_COLOR_ERROR )+";\">c: "+_C_FORMULA+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"padding:3px;color:"+( _GEN_CHECK_MASK & 8 ? DEFAULT_COLOR_STD : DEFAULT_COLOR_ERROR )+";\">d: "+_D_FORMULA+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                HTMLcode += "</table>" ;
				HTMLcode += "</td>" ;
				HTMLcode += "</tr>" ;
				if ( _i < ( _N_GENS - 1 ) ) HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
				else HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
			}
			else
			{
				HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
				HTMLcode += "<tr><td ALIGN=\"right\" STYLE=\"color:#FF5050;\">Fail to load generator #"+(_i+1)+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
			}
		}
	}
	else if ( _N_GENS == 0 )
	{
		HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
		HTMLcode += "<tr><td ALIGN=\"center\" ALIGN=\"center\" STYLE=\"font-size:12pt;color:"+get_rgb_from_color_tag("gray")+";\">The input list of generators<br>is empty</td></tr>" ;
		HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
	}

	HTMLcode += "</table>" ;
	HTMLcode += "</div>" ;
	HTMLcode += "</td>" ;
	HTMLcode += "</tr>" ;
	HTMLcode += "</table>" ;
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
    $("#PLUGIN_LIST_CONTAINER").html( HTMLcode );
}

function CIRCLESembeddingsGENERALPURPOSE_GEN_NORMALIZE( _index, _output_channel )
{
	_index = Math.max( safe_int( _index, UNFOUND ), UNFOUND ), _output_channel = safe_int( _output_channel, OUTPUT_SPECIAL_FX ) ;
	if ( _index != UNFOUND )
	{
		var GEN_CHUNK = CIRCLESembeddingsGENERALPURPOSE_gens_container[_index] ;
		if ( GEN_CHUNK != null )
		{
 			if ( confirm( "Confirm to normalize generator #"+( _index + 1 )+" ?" ) )
			{
      			if ( GEN_CHUNK != null )
      			{
   				    _GEN_CHECK_MASK = 0 ;
					for( var _c = 0 ; _c < 4 ; _c++ )
   					if ( GEN_CHUNK[_c] != null ) _GEN_CHECK_MASK |= ( GEN_CHUNK[_c].length > 0 ) ? Math.pow(2,_c) : 0 ;

      				var _A_FORMULA = GEN_CHUNK[0], _B_FORMULA = GEN_CHUNK[1], _C_FORMULA = GEN_CHUNK[2], _D_FORMULA = GEN_CHUNK[3] ;
   					_A_FORMULA = circles_lib_math_parse_formula( _A_FORMULA );
   					_B_FORMULA = circles_lib_math_parse_formula( _B_FORMULA );
   					_C_FORMULA = circles_lib_math_parse_formula( _C_FORMULA );
   					_D_FORMULA = circles_lib_math_parse_formula( _D_FORMULA );
      
					_A_FORMULA = parse_complex_from_string( _A_FORMULA );
            		_B_FORMULA = parse_complex_from_string( _B_FORMULA );
            		_C_FORMULA = parse_complex_from_string( _C_FORMULA );
            		_D_FORMULA = parse_complex_from_string( _D_FORMULA );
            
					_mm = new mobius_map( _A_FORMULA, _B_FORMULA, _C_FORMULA, _D_FORMULA );
					_mm.normalize();
                          
					CIRCLESembeddingsGENERALPURPOSE_gens_container[_index][0] = _mm.a.formula();
					CIRCLESembeddingsGENERALPURPOSE_gens_container[_index][1] = _mm.b.formula();
					CIRCLESembeddingsGENERALPURPOSE_gens_container[_index][2] = _mm.c.formula();
					CIRCLESembeddingsGENERALPURPOSE_gens_container[_index][3] = _mm.d.formula();
					CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(YES);
					circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Generator normalized wirh success", 'PLUGIN_OUTMSG' ) ;
					return YES ;
				}
				else
				{
					circles_lib_output( _output_channel, DISPATCH_ERROR, "Can't find generator at index '"+( _index+1 )+"'", 'PLUGIN_OUTMSG' ) ;
					return NO ;
				}
			}
        }
    }
	else
	{
		circles_lib_output( _output_channel, DISPATCH_ERROR, "Invalid selection", 'PLUGIN_OUTMSG' ) ;
		return NO ;
	}
}