function CIRCLESembeddingsGRANDMA4ALARM_PRESETS_INIT()
{
    CIRCLESembeddingsGRANDMA4ALARM_PRESETSarray.push( [ "1.9247306-0.0449408i", "1.91+0.2i", "i", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsGRANDMA4ALARM_PRESETSarray.push( [ "2.2", "2.2", "i", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsGRANDMA4ALARM_PRESETSarray.push( [ "2.6131259", "2.6131259", "i", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsGRANDMA4ALARM_PRESETSarray.push( [ "i", "i", "i", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsGRANDMA4ALARM_PRESETSarray.push( [ "i", "i+1", "i", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsGRANDMA4ALARM_PRESETSarray.push( [ "i+1", "i", "i", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsGRANDMA4ALARM_PRESETSarray.push( [ "i", "i", "i+1", 1, [ -2, 2, 2, -2 ], "" ] );
}

function CIRCLESembeddingsGRANDMA4ALARM_PRESETS( _opcode, _init )
{
		_init = safe_int( _init, NO );
    _opcode = safe_float( _opcode, UNDET );
    switch( _opcode )
    {
        case 1: // display
        var _html = "<SELECT ID=\"PLUGINpresetsCOMBO\" ONCHANGE=\"javascript:CIRCLESembeddingsGRANDMA4ALARM_PRESETS(2,YES);\">" ;
            _html += "<OPTION VALUE=\""+UNDET+"\" SELECTED=\"selected\">" ;
            $.each( CIRCLESembeddingsGRANDMA4ALARM_PRESETSarray, function( _i, _v ) { _html += "<OPTION VALUE=\""+_i+"\">#" + ( _i + 1 ) + ( _v[5] != null ? " - " + _v[5] : "" ) } );
            _html += "</SELECT>" ;
        return _html ;
        break ;
        case 2: // select
        var _index = $( "#PLUGINpresetsCOMBO" ).val();
        var _chunk = CIRCLESembeddingsGRANDMA4ALARM_PRESETSarray[_index] ;
        if ( _chunk != null )
        {
            $( "#PLUGIN_PARAM_A" ).val( _chunk[0] );
            $( "#PLUGIN_PARAM_B" ).val( _chunk[1] );
            $( "#PLUGIN_PARAM_AB" ).val( _chunk[2] );
            var _comp = Math.max( 1, Math.abs( safe_int( _chunk[3], 1 ) ) );
            var _coords = _chunk[4] ;
            
            if ( is_array( _coords ) && safe_size( _coords, 0 ) == 4 && _glob_interface_index == INTERFACE_EXTEND_NONE )
            {
               var _ret_chunk = circles_lib_canvas_coords_correct_aspectratio( W_PLANE );
               if ( _ret_chunk[0] != RET_IRRELEVANT ) circles_lib_canvas_layer_pile_resize_to_default();
            }
            else
            {
               _coords = circles_lib_interface_recalc_bounding_coords( INTERFACE_INPUT_HEIGHT,
                                                    _glob_wplaneLEFT, safe_float( _coords[1], DEFAULT_PLANE_COORD ),
                                                    _glob_wplaneRIGHT, safe_float( _coords[3], -DEFAULT_PLANE_COORD )
                                                   ) ;
            }

            _glob_zplaneLEFT = _glob_wplaneLEFT = _glob_bipLEFT = safe_float( _coords[0], -DEFAULT_PLANE_COORD );
            _glob_zplaneTOP = _glob_wplaneTOP = _glob_bipTOP = safe_float( _coords[1], DEFAULT_PLANE_COORD );
            _glob_zplaneRIGHT = _glob_wplaneRIGHT = _glob_bipRIGHT = safe_float( _coords[2], DEFAULT_PLANE_COORD );
            _glob_zplaneBOTTOM = _glob_wplaneBOTTOM = _glob_bipBOTTOM = safe_float( _coords[3], -DEFAULT_PLANE_COORD );
            circles_lib_canvas_coords_acquire( ALL_PLANES );

            CIRCLESembeddingsGRANDMA4ALARM_INIT(NO,YES);
					  CIRCLESembeddingsGRANDMA4ALARM_COMP( _comp, _init );
            CIRCLESembeddingsGRANDMA4ALARM_CONFIG();
            GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
            GLOB_PLUGIN_WIZARD_STEP(1.1,YES);
				    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;

            if( $( "#CIRCLESembeddingsGRANDMA4ALARM_CANVAS" ).is( ":visible" ) )
            {
                var _fn_str = "circles_lib_plugin_render_preview", _fn = null ;
                try{ eval( "_fn = " + _fn_str ) ; } catch( _err ){ circles_lib_error_obj_handler( _err ); }
                if ( typeof _fn === "function" ) _fn.call( this, "grandma.4.alarm", "embeddings", Z_PLANE ) ;
            }
            _glob_target_plane = W_PLANE ;
        }
        return null ;
        break ;
        default: break ;
    }

    return null ;
}

function CIRCLESembeddingsGRANDMA4ALARM_COMP( _param, _init )
{
		_init = safe_int( _init, YES );
    _param = Math.min( Math.max( safe_int( _param, 1 ), 1 ), 2 ) ; /* input param : 1 or 2 */
    CIRCLESembeddingsGRANDMA4ALARM_param = _param ;
    var _index_ref = _plugin_last_ref;
    var trA = CIRCLESembeddingsGRANDMA4ALARM_trA_complex, trB = CIRCLESembeddingsGRANDMA4ALARM_trB_complex, trAB = CIRCLESembeddingsGRANDMA4ALARM_trAB_complex ;
    if ( !is_complex( trA ) || !is_complex( trB ) || !is_complex( trAB ) )
    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "The input trace is not a complex formula.", 'PLUGIN_OUTMSG') ;
    else
    {
        $('#PLUGIN1stSOLUTIONid').css('font-weight',CIRCLESembeddingsGRANDMA4ALARM_param==1?'bold':'');
        $('#PLUGIN2ndSOLUTIONid').css('font-weight',CIRCLESembeddingsGRANDMA4ALARM_param==2?'bold':'');

  			var tC = trA.pow(2).add( trB.pow(2) ).add( trAB.pow(2) ).sub( trA.mul(trB).mul(trAB) ).sub(2);
   			var Q1 = ( ( new complex(2) ).sub(tC) ).sqrt();
   			var Q2 = Q1.opposite();
   			var Q = "" ;
   			if ( _param == 1 ) Q = Q1 ;
   			else if ( _param == 2 ) Q = Q2 ;

   			if ( !is_complex( Q ) )
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Incorrect option: can't compute Q for further calculations", 'PLUGIN_OUTMSG' ) ;
   			else
   			{
            if ( is_array( _glob_seeds_array ) ) _glob_seeds_array = [];
            if ( is_array( _glob_seeds_array ) ) _glob_seeds_array = [];

   					var _imag = new complex( 0, 1 );
   					var _choice_1 = ( tC.add( ( _imag.mul(Q).mul( tC.add(2).sqrt() ) ) ) ).radius(); // sign '+'
   					var _choice_2 = ( tC.sub( ( _imag.mul(Q).mul( tC.add(2).sqrt() ) ) ) ).radius(); // sign '-'
   					var _choice_1_work = _choice_1 >= 2 ? YES : NO ;
   					var _choice_2_work = _choice_2 >= 2 ? YES : NO ;

   					var R = "" ;
   					if ( _choice_1_work > 0 ) R = ( tC.add(2) ).sqrt();
   					else if ( _choice_2_work > 0 ) R = ( tC.add(2) ).sqrt().opposite();

   					if ( !is_complex( R ) )
            circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Incorrect option: can't compute R for further calculations.", 'PLUGIN_OUTMSG' ) ;
   					else
   					{
   							var _z0_num = ( trAB.sub(2) ).mul( trB.add(R) );
   							var _z0_den = trB.mul(trAB).sub( trA.mul(2) ).add( _imag.mul(Q).mul(trAB) );
   							var _z0 = _z0_num.div( _z0_den );

   							var MM_01_a = trA.div(2);

								var MM_01_b_num = ( trA.mul(trAB).sub( trB.mul(2) ).add( _imag.mul(Q).mul(2) ) );
								var MM_01_b_den = ( trAB.mul(2).add(4) ).mul(_z0);
  							var MM_01_b = MM_01_b_num.div( MM_01_b_den );

								var MM_01_c_num = ( trA.mul(trAB).sub( trB.mul(2) ).sub( _imag.mul(Q).mul(2) ) ).mul(_z0);
								var MM_01_c_den = trAB.mul(2).sub(4);
  							var MM_01_c = MM_01_c_num.div( MM_01_c_den );

  							var MM_01_d = MM_01_a ;

   							var MM_02_a = ( trB.sub( Q.mul(_imag) ) ).div(2);

								var MM_02_b_num = trB.mul(trAB).sub( trA.mul(2) ).sub( Q.mul( _imag ).mul(trAB) );
								var MM_02_b_den = ( trAB.mul(2).add(4) ).mul(_z0);
   							var MM_02_b = MM_02_b_num.div( MM_02_b_den );

								var MM_02_c_num = ( trB.mul( trAB ).sub( trA.mul(2) ).add( Q.mul(_imag).mul( trAB ) ) ).mul(_z0 );
								var MM_02_c_den = trAB.mul(2).sub(4);
   							var MM_02_c = MM_02_c_num.div( MM_02_c_den );

   							var MM_02_d = ( trB.add( Q.mul(_imag) ) ).div(2);

  				      var MM_01 = new mobius_map( MM_01_a, MM_01_b, MM_01_c, MM_01_d );
   				      var MM_02 = new mobius_map( MM_02_a, MM_02_b, MM_02_c, MM_02_d );
   				      CIRCLESembeddingsGRANDMA4ALARM_OUTPUT( MM_01, MM_02, _init );

   				      $("#PLUGINsetBTN").attr('class', 'linkdead');
				        _glob_items_to_init = YES ;
                $('[id$=initBTN]').css('color',COLOR_ERROR) ;
  					}
   			}
    }
}

function CIRCLESembeddingsGRANDMA4ALARM_OUTPUT( MM_01, MM_02, _init )
{
		_init = safe_int( _init, YES );
    var _mm01_trace_squared = MM_01.trace().pow( 2.0 ).radius();
    var _mm02_trace_squared = MM_02.trace().pow( 2.0 ).radius();
    var inverse_MM_01 = MM_01.inv(), inverse_MM_02 = MM_02.inv();

    GLOB_PLUGIN_CIRCLE_TYPE = $( "#PLUGINcircleCOMBO option:selected" ).val();
    if ( GLOB_PLUGIN_CIRCLE_TYPE == 0 ) GLOB_PLUGIN_CIRCLE_TYPE = DRAWENTITY_ISOMETRIC_CIRCLE ;

    var _CC_01 = MM_01.inversion_circle();
    var _IS_01 = MM_01.isometric_circle();
    var _circle01 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _IS_01 : _CC_01 ;

    var _CC_02 = MM_02.inversion_circle();
    var _IS_02 = MM_02.isometric_circle();
    var _circle02 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _IS_02 : _CC_02 ;

    var _INV_CC_01 = inverse_MM_01.inversion_circle();
    var _INV_IS_01 = inverse_MM_01.isometric_circle();
    var _inv_circle01 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _INV_IS_01 : _INV_CC_01 ;

    var _INV_CC_02 = inverse_MM_02.inversion_circle();
    var _INV_IS_02 = inverse_MM_02.isometric_circle();
    var _inv_circle02 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _INV_IS_02 : _INV_CC_02 ;

    var screen_CC_01 = circles_lib_complex_to_screen_disk( _circle01, zplane_sm, _glob_draw_seed_color );
    var screen_CC_02 = circles_lib_complex_to_screen_disk( _circle02, zplane_sm, _glob_draw_seed_color );
    var screen_INV_CC_01 = circles_lib_complex_to_screen_disk( _inv_circle01, zplane_sm, _glob_draw_seed_color );
    var screen_INV_CC_02 = circles_lib_complex_to_screen_disk( _inv_circle02, zplane_sm, _glob_draw_seed_color );

    _glob_seeds_array = [];
    _glob_seeds_array.push( new item_obj( MM_01, _circle01, screen_CC_01, "a", 0, YES, _glob_draw_seed_color, NO, _glob_fill_seed_color, "A", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( MM_02, _circle02, screen_CC_02, "b", 0, YES, _glob_draw_seed_color, NO, _glob_fill_seed_color, "B", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( inverse_MM_01, _inv_circle01, screen_INV_CC_01, "A", 0, YES, _glob_draw_inverse_seed_color, NO, _glob_fill_inverse_seed_color, "a", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( inverse_MM_02, _inv_circle02, screen_INV_CC_02, "B", 0, YES, _glob_draw_inverse_seed_color, NO, _glob_fill_inverse_seed_color, "b", 1, ITEM_TYPE_CIRCLE ) );

 		CIRCLESembeddingsGRANDMA4ALARM_active = _glob_dict_create = _glob_items_to_init = YES ;
    var _index_ref = _plugin_last_ref;
    GLOB_PLUGIN_APPLY_SETTINGS(_index_ref) ;
    circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, YES, _glob_output_channel );
    if ( _init )
    {
        var _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, NO, NO, _glob_output_channel );
        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
        if ( _ret_id == RET_OK )
        {
            $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
            $("#PLUGIN_CONTAINER_PARAMS").html( GLOB_PLUGIN_GENS_TABLE_SHOW('grandma.4.alarm') );
            
        }
        else
        {
            $('[id$=initBTN]').css('color',COLOR_ERROR);
            circles_lib_log_add_entry( _ret_msg, LOG_WARNING );
        }
    }
}

function CIRCLESembeddingsGRANDMA4ALARM_INIT( _skip_edit_acquisition, _calc )
{
    // by default, no operation is performed: better to explicit it through params
    _skip_edit_acquisition = safe_int( _skip_edit_acquisition, YES );
    _calc = safe_int( _calc, NO );
    _glob_init_mask = INIT_FROM_MAPS | INIT_PAIRED_ITEMS ;
    var trA_formula, trB_formula, trAB_formula ;
    if ( !_skip_edit_acquisition )
    {
        trA_formula = $("#PLUGIN_PARAM_A").val().length > 0 ? $("#PLUGIN_PARAM_A").val() : "0.0" ;
        trB_formula = $("#PLUGIN_PARAM_B").val().length > 0 ? $("#PLUGIN_PARAM_B").val() : "0.0" ;
        trAB_formula = $("#PLUGIN_PARAM_AB").val().length > 0 ? $("#PLUGIN_PARAM_AB").val() : "0.0" ;
    }
    else
    {
        trA_formula = CIRCLESembeddingsGRANDMA4ALARM_trA, trB_formula = CIRCLESembeddingsGRANDMA4ALARM_trB, trAB_formula = CIRCLESembeddingsGRANDMA4ALARM_trAB ;
    }

    CIRCLESembeddingsGRANDMA4ALARM_PARSE( trA_formula, trB_formula, trAB_formula );
    if ( !is_complex( CIRCLESembeddingsGRANDMA4ALARM_trA_complex ) || !is_complex( CIRCLESembeddingsGRANDMA4ALARM_trB_complex ) || !is_complex( CIRCLESembeddingsGRANDMA4ALARM_trAB_complex ) )
    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "At least one of the two traces is not a complex formula.", 'PLUGIN_OUTMSG' ) ;
    else
    {
       CIRCLESembeddingsGRANDMA4ALARM_trA = trA_formula, CIRCLESembeddingsGRANDMA4ALARM_trB = trB_formula, CIRCLESembeddingsGRANDMA4ALARM_trAB = trAB_formula ;
       var HTMLcode = "<table WIDTH=\"100%\">" ;
           HTMLcode += "<tr>" ;
           HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F3F3F3;\">" ;
           HTMLcode += "<table>" ;

       if ( is_string( CIRCLESembeddingsGRANDMA4ALARM_trAB ) )
       {
            var _BOLD = CIRCLESembeddingsGRANDMA4ALARM_param == 1 ? "font-weight:bold;" : "" ;
            HTMLcode += "<tr><td WIDTH=\"3\"></td><td>1st Q solution</td><td WIDTH=\"5\"></td><td CLASS=\"link_rounded\" STYLE=\"width:45px;"+_BOLD+"\" ID=\"PLUGIN1stSOLUTIONid\" ONCLICK=\"javascript:$('#PLUGIN2ndSOLUTIONid').css('font-weight','');$(this).css('font-weight','bold');CIRCLESembeddingsGRANDMA4ALARM_COMP(1);CIRCLESembeddingsGRANDMA4ALARM_CONFIG();GLOB_PLUGIN_WIZARD_STEP(1.1,YES);CIRCLESembeddingsGRANDMA4ALARM_RECORD_PARAMS();\">Apply</td></tr>" ;

            _BOLD = CIRCLESembeddingsGRANDMA4ALARM_param == 2 ? "font-weight:bold;" : "" ;
            HTMLcode += "<tr><td WIDTH=\"3\"></td><td>2nd Q solution</td><td WIDTH=\"5\"></td><td CLASS=\"link_rounded\" STYLE=\"width:45px;"+_BOLD+"\" ID=\"PLUGIN2ndSOLUTIONid\" ONCLICK=\"javascript:$('#PLUGIN1stSOLUTIONid').css('font-weight','');$(this).css('font-weight','bold');CIRCLESembeddingsGRANDMA4ALARM_COMP(2);CIRCLESembeddingsGRANDMA4ALARM_CONFIG();GLOB_PLUGIN_WIZARD_STEP(1.1,YES);CIRCLESembeddingsGRANDMA4ALARM_RECORD_PARAMS();\">Apply</td></tr>" ;
       }

       HTMLcode += "</table>" ;
       HTMLcode += "</td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
       HTMLcode += "<tr><td VALIGN=\"top\" ID=\"PLUGIN_CONTAINER_PARAMS\"></td></tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
       HTMLcode += "</table>" ;
                       
       if ( CIRCLESembeddingsGRANDMA4ALARM_form_flag == 0 )
       {
					$("#PLUGIN_CONTAINER").html( HTMLcode );
	        $("#PLUGIN_CONTAINER").show( "slow", function() { circles_lib_forms_adjust_position( GLOB_PLUGIN_DIV_ID ) ; } );
			 }
    }
}

function CIRCLESembeddingsGRANDMA4ALARM_PARSE( _tr_a_formula, _tr_b_formula, _tr_ab_formula )
{
    var _entries = $( "[id^=PLUGIN_PARAM_]" );
    $.each( _entries, function( _i, _id ) { $( _id ).val( $( _id ).val().replaceAll( ",", "." ) ); } );

    var _index_ref = _plugin_last_ref;
    if ( new String( _tr_a_formula ).trim().length == 0 ) _tr_a_formula = "0" ;
    if ( new String( _tr_b_formula ).trim().length == 0 ) _tr_b_formula = "0" ;
    if ( new String( _tr_ab_formula ).trim().length == 0 ) _tr_ab_formula = "0" ;

  	_tr_a_formula = circles_lib_parse_fix_formula( _tr_a_formula );
		_tr_b_formula = circles_lib_parse_fix_formula( _tr_b_formula );
		_tr_ab_formula = circles_lib_parse_fix_formula( _tr_ab_formula );

    if ( $("#PLUGIN_PARAM_A").get(0) != null ) $("#PLUGIN_PARAM_A").val( _tr_a_formula );
    if ( $("#PLUGIN_PARAM_B").get(0) != null ) $("#PLUGIN_PARAM_B").val( _tr_b_formula );
    if ( $("#PLUGIN_PARAM_AB").get(0) != null ) $("#PLUGIN_PARAM_AB").val( _tr_ab_formula );

    CIRCLESembeddingsGRANDMA4ALARM_trA = _tr_a_formula ;
    CIRCLESembeddingsGRANDMA4ALARM_trB = _tr_b_formula ;
    CIRCLESembeddingsGRANDMA4ALARM_trAB = _tr_ab_formula ;
      
    CIRCLESembeddingsGRANDMA4ALARM_trA_complex = circles_lib_math_parse_formula( CIRCLESembeddingsGRANDMA4ALARM_trA + "" );
    CIRCLESembeddingsGRANDMA4ALARM_trB_complex = circles_lib_math_parse_formula( CIRCLESembeddingsGRANDMA4ALARM_trB + "" );
    CIRCLESembeddingsGRANDMA4ALARM_trAB_complex = circles_lib_math_parse_formula( CIRCLESembeddingsGRANDMA4ALARM_trAB + "" );
      
    CIRCLESembeddingsGRANDMA4ALARM_trA_complex = parse_complex_from_string( CIRCLESembeddingsGRANDMA4ALARM_trA_complex + "" );
    CIRCLESembeddingsGRANDMA4ALARM_trB_complex = parse_complex_from_string( CIRCLESembeddingsGRANDMA4ALARM_trB_complex + "" );
    CIRCLESembeddingsGRANDMA4ALARM_trAB_complex = parse_complex_from_string( CIRCLESembeddingsGRANDMA4ALARM_trAB_complex + "" );

    if ( _plugin_tmp_vars_array['embeddings@grandma4alarm'] == null ) _plugin_tmp_vars_array['embeddings@grandma4alarm'] = [] ;
    _plugin_tmp_vars_array['embeddings@grandma4alarm']['a'] = CIRCLESembeddingsGRANDMA4ALARM_trA ;
    _plugin_tmp_vars_array['embeddings@grandma4alarm']['b'] = CIRCLESembeddingsGRANDMA4ALARM_trB ;
    _plugin_tmp_vars_array['embeddings@grandma4alarm']['ab'] = CIRCLESembeddingsGRANDMA4ALARM_trAB ;
    _plugin_tmp_vars_array['embeddings@grandma4alarm']['p'] = CIRCLESembeddingsGRANDMA4ALARM_param ;

    _plugin_tmp_vars_array['a'] = CIRCLESembeddingsGRANDMA4ALARM_trA ;
    _plugin_tmp_vars_array['b'] = CIRCLESembeddingsGRANDMA4ALARM_trB ;
    _plugin_tmp_vars_array['ab'] = CIRCLESembeddingsGRANDMA4ALARM_trAB ;
    _plugin_tmp_vars_array['p'] = CIRCLESembeddingsGRANDMA4ALARM_param ;

    if ( _plugin_vars_array[_index_ref]['a']['value'] != null ) _plugin_vars_array[_index_ref]['a']['value'] = CIRCLESembeddingsGRANDMA4ALARM_trA_complex ;
    if ( _plugin_vars_array[_index_ref]['b']['value'] != null ) _plugin_vars_array[_index_ref]['b']['value'] = CIRCLESembeddingsGRANDMA4ALARM_trB_complex ;
    if ( _plugin_vars_array[_index_ref]['ab']['value'] != null ) _plugin_vars_array[_index_ref]['ab']['value'] = CIRCLESembeddingsGRANDMA4ALARM_trAB_complex ;
    if ( _plugin_vars_array[_index_ref]['p']['value'] != null ) _plugin_vars_array[_index_ref]['p']['value'] = CIRCLESembeddingsGRANDMA4ALARM_param ;

    GLOB_PLUGIN_VARS_PATTERN_SAVE(_index_ref);
}