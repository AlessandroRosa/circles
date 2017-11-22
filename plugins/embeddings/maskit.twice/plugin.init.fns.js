function CIRCLESembeddingsMASKITTWICE_PRESETS_INIT()
{
    CIRCLESembeddingsMASKITTWICE_PRESETSarray.push( [ "i", "-i", 1, [ -1, 1, 1, -1 ], "" ] );
    CIRCLESembeddingsMASKITTWICE_PRESETSarray.push( [ "-0.04+0.97i", "-0.16+3.87i", 1, [ -1, 1, 1, -1 ], "" ] );
    CIRCLESembeddingsMASKITTWICE_PRESETSarray.push( [ "-0.04+0.9651i", "-0.16+3.861i", 1, [ -1, 1, 1, -1 ], "" ] );
    CIRCLESembeddingsMASKITTWICE_PRESETSarray.push( [ "4i", "4i", 1, [ -1, 1, 1, -1 ], "" ] );
}

function CIRCLESembeddingsMASKITTWICE_PRESETS( _opcode, _init )
{
    _opcode = safe_float( _opcode, UNDET );
		_init = safe_int( _init, NO );
    switch( _opcode )
    {
        case 1: // display
        var _html = "<SELECT ID=\"PLUGINpresetsCOMBO\" ONCHANGE=\"javascript:CIRCLESembeddingsMASKITTWICE_PRESETS(2,YES);\">" ;
            _html += "<OPTION VALUE=\""+UNDET+"\" SELECTED=\"selected\">" ;
            $.each( CIRCLESembeddingsMASKITTWICE_PRESETSarray, function( _i, _v ) { _html += "<OPTION VALUE=\""+_i+"\">#" + ( _i + 1 ) + ( _v[4] != null ? " - " + _v[4] : "" ) } );
            _html += "</SELECT>" ;
        return _html ;
        break ;
        case 2: // select
        var _index = $( "#PLUGINpresetsCOMBO" ).val();
        var _chunk = CIRCLESembeddingsMASKITTWICE_PRESETSarray[_index] ;
        if ( _chunk != null )
        {
            $( "#PLUGIN_PARAM_TAU_1" ).val( _chunk[0] );
            $( "#PLUGIN_PARAM_TAU_2" ).val( _chunk[1] );
            var _comp = Math.max( 1, Math.abs( safe_int( _chunk[2], 1 ) ) );
            var _coords = _chunk[3] ;
            
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

            CIRCLESembeddingsMASKITTWICE_INIT(NO,YES);
					  CIRCLESembeddingsMASKITTWICE_COMP(_init);
            CIRCLESembeddingsMASKITTWICE_CONFIG();
            GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
            GLOB_PLUGIN_WIZARD_STEP(1.1,YES);
				    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;

            if( $( "#CIRCLESembeddingsMASKITTWICE_CANVAS" ).is( ":visible" ) )
            {
                var _fn_str = "circles_lib_plugin_render_preview", _fn = null ;
                try{ eval( "_fn = " + _fn_str ) ; } catch( _err ){ circles_lib_error_obj_handler( _err ); }
                if ( typeof _fn === "function" ) _fn.call( this, "maskit.twice", "embeddings", Z_PLANE ) ;
            }
            _glob_target_plane = W_PLANE ;
        }
        return null ;
        break ;
        default: break ;
    }

    return null ;
}

function CIRCLESembeddingsMASKITTWICE_COMP( _init )
{
		_init = safe_int( _init, YES );
    var _tau1 = CIRCLESembeddingsMASKITTWICE_TAU_1_complex, _tau2 = CIRCLESembeddingsMASKITTWICE_TAU_2_complex ;
    if ( !is_complex( _tau1 ) || !is_complex( _tau2 ) )
    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "At least one of the two traces is not a complex formula.", 'PLUGIN_OUTMSG' ) ;
    else
    {
       if ( is_array( _glob_seeds_array ) ) _glob_seeds_array = [];
       if ( is_array( _glob_seeds_array ) ) _glob_seeds_array = [];

       var _unit = new complex( 1, 0 ), _zero = new complex( 0, 0 );

       var MM_01_a = _unit, MM_01_b = _unit.mul(2), MM_01_c = _zero, MM_01_d = _unit ;
       var MM_02_a = _unit, MM_02_b = _zero, MM_02_c = _unit.mul(2), MM_02_d = _unit ;
          
       var MM_03_a = ( _tau1.mul( _tau2 ) ).add( _unit );
       var MM_03_b = _tau1, MM_03_c = _tau2 ;
       var MM_03_d = _unit ;
          
       var MM_01 = new mobius_map( MM_01_a, MM_01_b, MM_01_c, MM_01_d );
       var MM_02 = new mobius_map( MM_02_a, MM_02_b, MM_02_c, MM_02_d );
       var MM_03 = new mobius_map( MM_03_a, MM_03_b, MM_03_c, MM_03_d );
       CIRCLESembeddingsMASKITTWICE_OUTPUT( MM_01, MM_02, MM_03, _init );
          
       $("#PLUGINsetBTN").attr('class', 'linkdead');
	     _glob_items_to_init = YES ;
       $('[id$=initBTN]').css('color',COLOR_ERROR) ;
    }
}

function CIRCLESembeddingsMASKITTWICE_OUTPUT( MM_01, MM_02, MM_03, _init )
{
		_init = safe_int( _init, YES );
    var _mm01_trace_squared = MM_01.trace().pow( 2.0 ).radius();
    var _mm02_trace_squared = MM_02.trace().pow( 2.0 ).radius();
    var _mm03_trace_squared = MM_03.trace().pow( 2.0 ).radius();

    var inverse_MM_01 = MM_01.inv();
    var inverse_MM_02 = MM_02.inv();
    var inverse_MM_03 = MM_03.inv();

    GLOB_PLUGIN_CIRCLE_TYPE = $( "#PLUGINcircleCOMBO option:selected" ).val();
    if ( GLOB_PLUGIN_CIRCLE_TYPE == 0 ) GLOB_PLUGIN_CIRCLE_TYPE = DRAWENTITY_ISOMETRIC_CIRCLE ;

    var _CC_01 = MM_01.inversion_circle();
    var _IS_01 = MM_01.isometric_circle();
    var _circle01 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _IS_01 : _CC_01 ;

    var _CC_02 = MM_02.inversion_circle();
    var _IS_02 = MM_02.isometric_circle();
    var _circle02 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _IS_02 : _CC_02 ;

    var _CC_03 = MM_03.inversion_circle();
    var _IS_03 = MM_03.isometric_circle();
    var _circle03 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _IS_03 : _CC_03 ;

    var _INV_CC_01 = inverse_MM_01.inversion_circle();
    var _INV_IS_01 = inverse_MM_01.isometric_circle();
    var _inv_circle01 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _INV_IS_01 : _INV_CC_01 ;

    var _INV_CC_02 = inverse_MM_02.inversion_circle();
    var _INV_IS_02 = inverse_MM_02.isometric_circle();
    var _inv_circle02 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _INV_IS_02 : _INV_CC_02 ;

    var _INV_CC_03 = inverse_MM_03.inversion_circle();
    var _INV_IS_03 = inverse_MM_03.isometric_circle();
    var _inv_circle03 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _INV_IS_03 : _INV_CC_03 ;

    var screen_CC_01 = circles_lib_complex_to_screen_disk( _circle01, zplane_sm, circles_lib_alphabet_get_color_from_symbol('a') );
    var screen_CC_02 = circles_lib_complex_to_screen_disk( _circle02, zplane_sm, circles_lib_alphabet_get_color_from_symbol('b') );
    var screen_CC_03 = circles_lib_complex_to_screen_disk( _circle03, zplane_sm, circles_lib_alphabet_get_color_from_symbol('c') );
    var screen_INV_CC_01 = circles_lib_complex_to_screen_disk( _inv_circle01, zplane_sm, circles_lib_alphabet_get_color_from_symbol('A') );
    var screen_INV_CC_02 = circles_lib_complex_to_screen_disk( _inv_circle02, zplane_sm, circles_lib_alphabet_get_color_from_symbol('B') );
    var screen_INV_CC_03 = circles_lib_complex_to_screen_disk( _inv_circle03, zplane_sm, circles_lib_alphabet_get_color_from_symbol('C') );

    _glob_seeds_array = [];
    _glob_seeds_array.push( new item_obj( MM_01, _circle01, screen_CC_01, "a", 0, YES, screen_CC_01.drawcolor, NO, screen_CC_01.drawcolor, "A", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( MM_02, _circle02, screen_CC_02, "b", 0, YES, screen_CC_02.drawcolor, NO, screen_CC_02.drawcolor, "B", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( MM_03, _circle03, screen_CC_03, "c", 0, YES, screen_CC_03.drawcolor, NO, screen_CC_03.drawcolor, "C", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( inverse_MM_01, _inv_circle01, screen_INV_CC_01, "A", 0, YES, screen_INV_CC_01.drawcolor, NO, screen_INV_CC_01.drawcolor, "a", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( inverse_MM_02, _inv_circle02, screen_INV_CC_02, "B", 0, YES, screen_INV_CC_02.drawcolor, NO, screen_INV_CC_02.drawcolor, "b", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( inverse_MM_03, _inv_circle03, screen_INV_CC_03, "C", 0, YES, screen_INV_CC_03.drawcolor, NO, screen_INV_CC_03.drawcolor, "c", 1, ITEM_TYPE_CIRCLE ) );

 		CIRCLESembeddingsMASKITTWICE_active = _glob_dict_create = _glob_items_to_init = YES ;
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
            $("#PLUGIN_CONTAINER_PARAMS").html( GLOB_PLUGIN_GENS_TABLE_SHOW('maskit.twice') );
            
        }
        else
        {
            $('[id$=initBTN]').css('color',COLOR_ERROR);
            circles_lib_log_add_entry( _ret_msg, LOG_WARNING );
        }
    }
}

function CIRCLESembeddingsMASKITTWICE_INIT( _skip_edit_acquisition, _calc )
{
    _skip_edit_acquisition = safe_int( _skip_edit_acquisition, NO );
    _calc = safe_int( _calc, NO );
    var tau1_formula = !_skip_edit_acquisition ? ( $("#PLUGIN_PARAM_TAU_1").val().length > 0 ? $("#PLUGIN_PARAM_TAU_1").val() : CIRCLESembeddingsMASKITTWICE_TAU_1 ) : CIRCLESembeddingsMASKITTWICE_TAU_1 ;
    var tau2_formula = !_skip_edit_acquisition ? ( $("#PLUGIN_PARAM_TAU_2").val().length > 0 ? $("#PLUGIN_PARAM_TAU_2").val() : CIRCLESembeddingsMASKITTWICE_TAU_2 ) : CIRCLESembeddingsMASKITTWICE_TAU_2 ;
    _glob_init_mask = INIT_FROM_MAPS | INIT_PAIRED_ITEMS ;
    CIRCLESembeddingsMASKITTWICE_PARSE( tau1_formula, tau2_formula );
    CIRCLESembeddingsMASKITTWICE_COMP();
}

function CIRCLESembeddingsMASKITTWICE_PARSE( _tau_1_formula, _tau_2_formula )
{
    var _entries = $( "[id^=PLUGIN_PARAM_]" );
    $.each( _entries, function( _i, _id ) { $( _id ).val( $( _id ).val().replaceAll( ",", "." ) ); } );

  	var _index_ref = _plugin_last_ref + "";
    if ( new String( _tau_1_formula ).trim().length == 0 ) _tau_1_formula = "0" ;
    if ( new String( _tau_2_formula ).trim().length == 0 ) _tau_2_formula = "0" ;

  	_tau_1_formula = circles_lib_parse_fix_formula( _tau_1_formula );
		_tau_2_formula = circles_lib_parse_fix_formula( _tau_2_formula );

    if ( $("#PLUGIN_PARAM_TAU_1").get(0) != null ) $("#PLUGIN_PARAM_TAU_1").val( _tau_1_formula );
    if ( $("#PLUGIN_PARAM_TAU_2").get(0) != null ) $("#PLUGIN_PARAM_TAU_2").val( _tau_2_formula );

    CIRCLESembeddingsMASKITTWICE_TAU_1 = _tau_1_formula, CIRCLESembeddingsMASKITTWICE_TAU_2 = _tau_2_formula ;
      
    CIRCLESembeddingsMASKITTWICE_TAU_1_complex = circles_lib_math_parse_formula( CIRCLESembeddingsMASKITTWICE_TAU_1 );
    CIRCLESembeddingsMASKITTWICE_TAU_2_complex = circles_lib_math_parse_formula( CIRCLESembeddingsMASKITTWICE_TAU_2 );
      
    CIRCLESembeddingsMASKITTWICE_TAU_1_complex = parse_complex_from_string( CIRCLESembeddingsMASKITTWICE_TAU_1_complex + "" );
    CIRCLESembeddingsMASKITTWICE_TAU_2_complex = parse_complex_from_string( CIRCLESembeddingsMASKITTWICE_TAU_2_complex + "" );

    if ( _plugin_tmp_vars_array['embeddings@maskittwice'] == null ) _plugin_tmp_vars_array['embeddings@maskittwice'] = [] ;
    _plugin_tmp_vars_array['embeddings@maskittwice']['tau1'] = CIRCLESembeddingsMASKITTWICE_TAU_1 ;
    _plugin_tmp_vars_array['embeddings@maskittwice']['tau2'] = CIRCLESembeddingsMASKITTWICE_TAU_2 ;

    _plugin_tmp_vars_array['tau1'] = CIRCLESembeddingsMASKITTWICE_TAU_1 ;
    _plugin_tmp_vars_array['tau2'] = CIRCLESembeddingsMASKITTWICE_TAU_2 ;

    if ( _plugin_vars_array[_index_ref]['tau1']['value'] != null ) _plugin_vars_array[_index_ref]['tau1']['value'] = CIRCLESembeddingsMASKITTWICE_TAU_1_complex ;
    if ( _plugin_vars_array[_index_ref]['tau2']['value'] != null ) _plugin_vars_array[_index_ref]['tau2']['value'] = CIRCLESembeddingsMASKITTWICE_TAU_2_complex ;

    GLOB_PLUGIN_VARS_PATTERN_SAVE(_index_ref);
}