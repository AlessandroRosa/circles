function CIRCLESembeddingsRILEYSLICE_PRESETS_INIT()
{
    CIRCLESembeddingsRILEYSLICE_PRESETSarray.push( [ "i", 1, [ -1.6, 1.6, 1.6, -1.6 ], "" ] );
    CIRCLESembeddingsRILEYSLICE_PRESETSarray.push( [ "0.75+1.4i", 1, [ -1.6, 1.6, 1.6, -1.6 ], "" ] );
    CIRCLESembeddingsRILEYSLICE_PRESETSarray.push( [ "1.7+i", 1, [ -1.6, 1.6, 1.6, -1.6 ], "" ] );
    CIRCLESembeddingsRILEYSLICE_PRESETSarray.push( [ "2.75+0.44i", 1, [ -1.6, 1.6, 1.6, -1.6 ], "" ] );
    CIRCLESembeddingsRILEYSLICE_PRESETSarray.push( [ "1.5+1.4i", 1, [ -1.1, 1.1, 1.1, -1.1 ], "" ] );
    CIRCLESembeddingsRILEYSLICE_PRESETSarray.push( [ "1.7+0.535i", 1, [ -1.1, 1.1, 1.1, -1.1 ], "" ] );
    CIRCLESembeddingsRILEYSLICE_PRESETSarray.push( [ "0.82+1.24i", 1, [ -1.1, 1.1, 1.1, -1.1 ], "" ] );
}

function CIRCLESembeddingsRILEYSLICE_PRESETS( _opcode, _init )
{
		_init = safe_int( _init, NO );
    _opcode = safe_float( _opcode, UNDET );
    switch( _opcode )
    {
        case 1: // display
        var _html = "<SELECT ID=\"PLUGINpresetsCOMBO\" ONCHANGE=\"javascript:CIRCLESembeddingsRILEYSLICE_PRESETS(2,YES);\">" ;
            _html += "<OPTION VALUE=\""+UNDET+"\" SELECTED=\"selected\">" ;
            $.each( CIRCLESembeddingsRILEYSLICE_PRESETSarray, function( _i, _v ) { _html += "<OPTION VALUE=\""+_i+"\">#" + ( _i + 1 ) + ( _v[3] != null ? " - " + _v[3] : "" ) } );
            _html += "</SELECT>" ;
        return _html ;
        break ;
        case 2: // select
        var _index = $( "#PLUGINpresetsCOMBO" ).val();
        var _chunk = CIRCLESembeddingsRILEYSLICE_PRESETSarray[_index] ;
        if ( _chunk != null )
        {
            $( "#PLUGIN_PARAM_RHO" ).val( _chunk[0] );
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

            CIRCLESembeddingsRILEYSLICE_INIT(NO,YES);
					  CIRCLESembeddingsRILEYSLICE_COMP( _init );
            CIRCLESembeddingsRILEYSLICE_CONFIG();
            GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
            GLOB_PLUGIN_WIZARD_STEP(1.1,YES);
				    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;

            if( $( "#CIRCLESembeddingsRILEYSLICE_CANVAS" ).is( ":visible" ) )
            {
                var _fn_str = "CIRCLESembeddingsRILEYSLICE_RENDER_PREVIEW", _fn = null ;
                try{ eval( "_fn = " + _fn_str ) ; } catch( _err ){ circles_lib_error_obj_handler( _err ); }
                if ( typeof _fn === "function" ) _fn.call( this, "RILEYSLICE", Z_PLANE ) ;
            }
            _glob_target_plane = W_PLANE ;
        }
        return null ;
        break ;
        default: break ;
    }

    return null ;
}

function CIRCLESembeddingsRILEYSLICE_COMP( _init )
{
		_init = safe_int( _init, YES );
    var _rho = CIRCLESembeddingsRILEYSLICE_rho_complex ;
    if ( !is_complex( _rho ) ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "The input trace is not a complex formula.", 'PLUGIN_OUTMSG') ;
    else
    {
        if ( is_array( _glob_seeds_array ) ) _glob_seeds_array.flush();
        if ( is_array( _glob_seeds_array ) ) _glob_seeds_array.flush();

        var _unit = new complex( 1, 0 ), _zero = new complex( 0, 0 ), _imag = new complex( 0, 1 );
        var MM_01_a = _unit ;
        var MM_01_b = _unit ;
        var MM_01_c = _zero ;
        var MM_01_d = _unit ;
          
        var MM_02_a = _unit ;
        var MM_02_b = _zero ;
        var MM_02_c = _rho ; 
        var MM_02_d = _unit ;
          
        var MM_01 = new mobius_map( MM_01_a, MM_01_b, MM_01_c, MM_01_d );
        var MM_02 = new mobius_map( MM_02_a, MM_02_b, MM_02_c, MM_02_d );
        CIRCLESembeddingsRILEYSLICE_OUTPUT( MM_01, MM_02, _init );
          
        $("#PLUGINparamsBTN").attr('class', 'linkdead');
        CIRCLESembeddingsRILEYSLICE_active = _glob_dict_create = _glob_items_to_init = YES ;
        $('[id$=initBTN]').css('color',COLOR_ERROR) ;
    }
}

function CIRCLESembeddingsRILEYSLICE_OUTPUT( MM_01, MM_02, _init )
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
    _glob_items_to_init = YES ;
    circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, YES, _glob_output_channel );
    if ( _init )
    {
        var _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, NO, NO, _glob_output_channel );
        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "73Unknown error" ;
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

function CIRCLESembeddingsRILEYSLICE_INIT( _skip_edit_acquisition, _calc )
{
    _skip_edit_acquisition = safe_int( _skip_edit_acquisition, NO );
    _calc = safe_int( _calc, NO );
    var CIRCLESembeddingsRILEYSLICE_rho_formula = !_skip_edit_acquisition ? ( $("#PLUGIN_PARAM_RHO").val().length > 0 ? $("#PLUGIN_PARAM_RHO").val() : CIRCLESembeddingsRILEYSLICE_rho ) : CIRCLESembeddingsRILEYSLICE_rho ;
    _glob_init_mask = INIT_FROM_MAPS | INIT_PAIRED_ITEMS ;
    CIRCLESembeddingsRILEYSLICE_PARSE( CIRCLESembeddingsRILEYSLICE_rho_formula );
}

function CIRCLESembeddingsRILEYSLICE_PARSE( _rho_formula )
{
    var _entries = $( "[id^=PLUGIN_PARAM_]" );
    $.each( _entries, function( _i, _id ) { $( _id ).val( $( _id ).val().replaceAll( ",", "." ) ); } );

  	var _index_ref = _plugin_last_ref + "";
    if ( new String( _rho_formula ).trim().length == 0 ) _rho_formula = "0" ;

  	_rho_formula = circles_lib_parse_fix_formula( _rho_formula );
    if ( $("#PLUGIN_PARAM_RHO").get(0) != null ) $("#PLUGIN_PARAM_RHO").val( _rho_formula );

    CIRCLESembeddingsRILEYSLICE_rho = _rho_formula ;
    CIRCLESembeddingsRILEYSLICE_rho_complex = circles_lib_math_parse_formula( CIRCLESembeddingsRILEYSLICE_rho + "" );
    CIRCLESembeddingsRILEYSLICE_rho_complex = parse_complex_from_string( CIRCLESembeddingsRILEYSLICE_rho_complex + "" );
	  if ( _plugin_vars_array[_index_ref]['rho']['value'] != null ) _plugin_vars_array[_index_ref]['rho']['value'] = CIRCLESembeddingsRILEYSLICE_rho_complex ;

    GLOB_PLUGIN_VARS_PATTERN_SAVE(_index_ref);
}