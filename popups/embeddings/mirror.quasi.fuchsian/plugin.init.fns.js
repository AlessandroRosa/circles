function CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETS_INIT()
{
    CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETSarray.push( [ "-1", 1, [ -1.5, 1.5, 1.5, -1.5 ], "" ] );
    CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETSarray.push( [ "-0.5", 1, [ -1.5, 1.5, 1.5, -1.5 ], "" ] );
    CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETSarray.push( [ "1.9+0.5i", 1, [ -5.5, 5.5, 5.5, -5.5 ], "" ] );
    CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETSarray.push( [ "2", 1, [ -1.5, 1.5, 1.5, -1.5 ], "" ] );
    CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETSarray.push( [ "2.0-0.4i", 1, [ -3, 3, 3, -3 ], "" ] );
    CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETSarray.push( [ "2.2-0.1i", 1, [ -2.5, 2.5, 2.5, -2.5 ], "" ] );
}

function CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETS( _opcode, _init )
{
    _opcode = safe_float( _opcode, UNDET );
		_init = safe_int( _init, NO );
    switch( _opcode )
    {
        case 1: // display
        var _html = "<SELECT ID=\"PLUGINpresetsCOMBO\" ONCHANGE=\"javascript:CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETS(2,YES);\">" ;
            _html += "<OPTION VALUE=\""+UNDET+"\" SELECTED=\"selected\">" ;
            $.each( CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETSarray, function( _i, _v ) { _html += "<OPTION VALUE=\""+_i+"\">#" + ( _i + 1 ) + ( _v[3] != null ? " - " + _v[3] : "" ) } );
            _html += "</SELECT>" ;
        return _html ;
        break ;
        case 2: // select
        var _index = $( "#PLUGINpresetsCOMBO" ).val();
        var _chunk = CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETSarray[_index] ;
        if ( _chunk != null )
        {
            $( "#PLUGIN_PARAM_TAU" ).val( _chunk[0] );
            var _comp = Math.max( 1, Math.abs( safe_int( _chunk[1], 1 ) ) );
            var _coords = _chunk[2] ;
            
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

            CIRCLESembeddingsMIRRORQUASIFUCHSIAN_INIT(NO,YES);
					  CIRCLESembeddingsMIRRORQUASIFUCHSIAN_COMP(_init);
            CIRCLESembeddingsMIRRORQUASIFUCHSIAN_CONFIG();
            GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
            GLOB_PLUGIN_WIZARD_STEP(1.1,YES);
				    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;

            if( $( "#CIRCLESembeddingsMIRRORQUASIFUCHSIAN_CANVAS" ).is( ":visible" ) )
            {
                var _fn_str = "CIRCLESembeddingsMIRRORQUASIFUCHSIAN_RENDER_PREVIEW", _fn = null ;
                try{ eval( "_fn = " + _fn_str ) ; } catch( _err ){ circles_lib_error_obj_handler( _err ); }
                if ( typeof _fn === "function" ) _fn.call( this, "MIRRORQUASIFUCHSIAN", Z_PLANE ) ;
            }
            _glob_target_plane = W_PLANE ;
        }
        return null ;
        break ;
        default: break ;
    }

    return null ;
}

function CIRCLESembeddingsMIRRORQUASIFUCHSIAN_COMP( _init )
{
		_init = safe_int( _init, YES );
    var _tau = CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau_complex ;
    if ( !is_complex( _tau ) ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "The input trace is not a complex formula.", 'PLUGIN_OUTMSG') ;
    else
    {
       if ( is_array( _glob_seeds_array ) ) _glob_seeds_array.flush();
       if ( is_array( _glob_seeds_array ) ) _glob_seeds_array.flush();

       /*
       START 
       t^2 - 4s1s2 = 4
       |s1|^2 + |s2|^2 = 2

       my goal is to have an elementary system of two equations 
       in the absolute values (s_1)^2 = |s_1|^2 and (s_2)^2 = |s_2|^2
             
       Then I proceed with substitutions
       s1s2 = (4-t^2)/(-4s2)
       |s1|^2 = 2 - |s2|^2
          
       and I arrange the first formula as follows
       eq 1: (s1s2)^2 => |s1s2|^2 => ((t^2-4)/4)^2
       eq 2: |s1|^2 + |s2|^2 = 2
          
       eq 1 allows me to consider the absolute values
       */
          
       var _prod = ( ( _tau.pow( 2.0 ).sub( 4.0 ) ).div( 4.0 ) ).pow( 2.0 );
       var _sum = new complex( 2.0, 0.0 );
          
       /* 
       I can solve such system in |s_1|^2 and |s_2|^2 through the 2nd order equation
       ax^2 + bx + c
       where a = 1, b = -sum, c = prod

       given sum = s1|^2 + |s2|^2 and prod = (s1s2)^2 => |s1s2|^2
       */
          
       var _a = new complex( 1.0, 0.0 ), _b = _sum.opposite(), _c = _prod ;
       var _delta = ( _b.pow( 2.0 ) ).sub( _a.mul( _c ).mul( 4.0 ) );

       var _s1_squared_abs = ( _b.opposite().add( _delta.sqrt() ) ).div( _a.mul( 2.0 ) );
       var _s2_squared_abs = ( _b.opposite().sub( _delta.sqrt() ) ).div( _a.mul( 2.0 ) );
          
       var _s1 = _s1_squared_abs.sqrt();
       var _s2 = _s2_squared_abs.sqrt();
          
       var _unit_imag = new complex( 0.0, 1.0 ); 
          
       var MM_01_a = _tau.div(2.0);
       var MM_01_b = _s1 ;
       var MM_01_c = _s2 ;
       var MM_01_d = MM_01_a ;
          
       var MM_02_a = _tau.conj().div( 2.0 ); 
       var MM_02_b = _s2.conj().mul( _unit_imag ); 
       var MM_02_c = ( _s1.conj().mul( _unit_imag ) ).opposite(); 
       var MM_02_d = MM_02_a ;
          
       var MM_01 = new mobius_map( MM_01_a, MM_01_b, MM_01_c, MM_01_d );
       var MM_02 = new mobius_map( MM_02_a, MM_02_b, MM_02_c, MM_02_d );
       CIRCLESembeddingsMIRRORQUASIFUCHSIAN_OUTPUT( MM_01, MM_02, _init );
          
       $("#PLUGINparamsBTN").attr('class', 'linkdead');
	     CIRCLESembeddingsMIRRORQUASIFUCHSIAN_active = _glob_dict_create = _glob_items_to_init = YES ;
       $('[id$=initBTN]').css('color',COLOR_ERROR) ;
    }
}

function CIRCLESembeddingsMIRRORQUASIFUCHSIAN_OUTPUT( MM_01, MM_02, _init )
{
		_init = safe_int( _init, YES );
    var inverse_MM_01 = MM_01.inv(), inverse_MM_02 = MM_02.inv();
    var _mm01_trace_squared = MM_01.trace().pow( 2.0 ).radius();
    var _mm02_trace_squared = MM_02.trace().pow( 2.0 ).radius();

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

    var screen_CC_01 = circles_lib_complex_to_screen_disk( _circle01, zplane_sm, circles_lib_alphabet_get_color_from_symbol('a') );
    var screen_CC_02 = circles_lib_complex_to_screen_disk( _circle02, zplane_sm, circles_lib_alphabet_get_color_from_symbol('b') );
    var screen_INV_CC_01 = circles_lib_complex_to_screen_disk( _inv_circle01, zplane_sm, circles_lib_alphabet_get_color_from_symbol('A') );
    var screen_INV_CC_02 = circles_lib_complex_to_screen_disk( _inv_circle02, zplane_sm, circles_lib_alphabet_get_color_from_symbol('B') );

    _glob_seeds_array.flush();
    _glob_seeds_array.push( new item_obj( MM_01, _circle01, screen_CC_01, "a", 0, YES, screen_CC_01.drawcolor, NO, screen_CC_01.drawcolor, "A", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( MM_02, _circle02, screen_CC_02, "b", 0, YES, screen_CC_02.drawcolor, NO, screen_CC_02.drawcolor, "B", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( inverse_MM_01, _inv_circle01, screen_INV_CC_01, "A", 0, YES, screen_INV_CC_01.drawcolor, NO, screen_INV_CC_01.drawcolor, "a", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( inverse_MM_02, _inv_circle02, screen_INV_CC_02, "B", 0, YES, screen_INV_CC_02.drawcolor, NO, screen_INV_CC_02.drawcolor, "b", 1, ITEM_TYPE_CIRCLE ) );

 		_glob_dict_create = _glob_items_to_init = YES ;
    var _index_ref = _plugin_last_ref;
    GLOB_PLUGIN_APPLY_SETTINGS(_index_ref) ;
    circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, YES, _glob_output_channel );
    if ( _init )
    {
        var _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, NO, NO, _glob_output_channel );
        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "75Unknown error" ;
        if ( _ret_id == RET_OK )
        {
            $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
            $("#PLUGIN_CONTAINER_PARAMS").html( GLOB_PLUGIN_GENS_TABLE_SHOW() );
            circles_lib_popup_dispatcher_unicast_message( 'dictionary', 'forms', POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS ) ;
        }
        else
        {
            $('[id$=initBTN]').css('color',COLOR_ERROR);
            circles_lib_log_add_entry( _ret_msg, LOG_WARNING );
        }
    }
}

function CIRCLESembeddingsMIRRORQUASIFUCHSIAN_INIT( _skip_edit_acquisition, _calc )
{
    _skip_edit_acquisition = safe_int( _skip_edit_acquisition, NO );
    _calc = safe_int( _calc, NO );
    var CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau_formula = !_skip_edit_acquisition ? ( $("#PLUGIN_PARAM_TAU").val().length > 0 ? $("#PLUGIN_PARAM_TAU").val() : CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau ) : CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau ;
    _glob_init_mask = INIT_FROM_MAPS | INIT_PAIRED_ITEMS ;
    CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PARSE( CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau_formula );
}

function CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PARSE( _tau_formula )
{
    var _entries = $( "[id^=PLUGIN_PARAM_]" );
    $.each( _entries, function( _i, _id ) { $( _id ).val( $( _id ).val().replaceAll( ",", "." ) ); } );

  	var _index_ref = _plugin_last_ref + "";
    if ( new String( _tau_formula ).trim().length == 0 ) _tau_formula = "0" ;

		_tau_formula = circles_lib_parse_fix_formula( _tau_formula );
    if ( $("#PLUGIN_PARAM_TAU").get(0) != null ) $("#PLUGIN_PARAM_TAU").val( _tau_formula );

    CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau = _tau_formula ;
    CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau_complex = circles_lib_math_parse_formula( CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau );
    CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau_complex = parse_complex_from_string( CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau_complex + "" );

    _plugin_tmp_vars_config_array['tau'] = CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau ;
    if ( _plugin_vars_array[_index_ref]['tau']['value'] != null ) _plugin_vars_array[_index_ref]['tau']['value'] = CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau_complex ;

    GLOB_PLUGIN_VARS_PATTERN_SAVE(_index_ref);
}