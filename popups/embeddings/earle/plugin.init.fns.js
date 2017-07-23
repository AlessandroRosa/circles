function CIRCLESembeddingsEARLE_PRESETS_INIT()
{
    CIRCLESembeddingsEARLE_PRESETSarray.push( [ "0.58+1.0i", UNDET, [ -1.3, 1.3, 1.3, -1.3 ], "" ] );
    CIRCLESembeddingsEARLE_PRESETSarray.push( [ "0.78+0.9i", UNDET, [ -1.3, 1.3, 1.3, -1.3 ], "" ] );
    CIRCLESembeddingsEARLE_PRESETSarray.push( [ "0.55+0.55i", UNDET, [ -1.3, 1.3, 1.3, -1.3 ], "" ] );
    CIRCLESembeddingsEARLE_PRESETSarray.push( [ "0.55+0.45i", UNDET, [ -1.3, 1.3, 1.3, -1.3 ], "" ] );
    CIRCLESembeddingsEARLE_PRESETSarray.push( [ "0.5+0.55i", UNDET, [ -1.3, 1.3, 1.3, -1.3 ], "" ] );
    CIRCLESembeddingsEARLE_PRESETSarray.push( [ "0.49+0.54i", UNDET, [ -1.3, 1.3, 1.3, -1.3 ], "" ] );
    CIRCLESembeddingsEARLE_PRESETSarray.push( [ "0.491+0.587i", UNDET, [ -1.3, 1.3, 1.3, -1.3 ], "" ] );
    CIRCLESembeddingsEARLE_PRESETSarray.push( [ "0.4+0.49i", UNDET, [ -1.3, 1.3, 1.3, -1.3 ], "" ] );
}

function CIRCLESembeddingsEARLE_PRESETS( _opcode, _init )
{
		_init = safe_int( _init, NO );
    _opcode = safe_float( _opcode, UNDET );
    switch( _opcode )
    {
        case 1: // display
        var _html = "<SELECT ID=\"PLUGINpresetsCOMBO\" ONCHANGE=\"javascript:CIRCLESembeddingsEARLE_PRESETS(2,YES);\">" ;
            _html += "<OPTION VALUE=\""+UNDET+"\" SELECTED=\"selected\">" ;
            $.each( CIRCLESembeddingsEARLE_PRESETSarray, function( _i, _v ) { _html += "<OPTION VALUE=\""+_i+"\">#" + ( _i + 1 ) + ( _v[3] != null ? " - " + _v[3] : "" ) } );
            _html += "</SELECT>" ;
        return _html ;
        break ;
        case 2: // select
        var _index = $( "#PLUGINpresetsCOMBO" ).val();
        var _chunk = CIRCLESembeddingsEARLE_PRESETSarray[_index] ;
        if ( _chunk != null )
        {
            $( "#PLUGIN_PARAM_D" ).val( _chunk[0] );
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

            CIRCLESembeddingsEARLE_INIT(NO,YES);
					  CIRCLESembeddingsEARLE_COMP(_init);
            CIRCLESembeddingsEARLE_CONFIG();
            GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
            GLOB_PLUGIN_WIZARD_STEP(1.1,_init);
				    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;

            if( $( "#CIRCLESembeddingsEARLE_CANVAS" ).is( ":visible" ) )
            {
                var _fn_str = "CIRCLESembeddingsEARLE_RENDER_PREVIEW", _fn = null ;
                try{ eval( "_fn = " + _fn_str ) ; } catch( _err ){ circles_lib_error_obj_handler( _err ); }
                if ( typeof _fn === "function" ) _fn.call( this, "EARLE", Z_PLANE ) ;
            }

            _glob_target_plane = W_PLANE ;
        }
        return null ;
        break ;
        default: break ;
    }

    return null ;
}

function CIRCLESembeddingsEARLE_COMP( _init )
{
		_init = safe_int( _init, YES );
    var _index_ref = _plugin_last_ref;
    var _D = CIRCLESembeddingsEARLE_d_complex ;
    if ( !is_complex( _D ) ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "The input trace is not a complex formula.", 'PLUGIN_OUTMSG') ;
    else
    {
       if ( is_array( _glob_seeds_array ) ) _glob_seeds_array.flush();
       if ( is_array( _glob_seeds_array ) ) _glob_seeds_array.flush();

       var _unit = new complex( 1, 0 );
       var MM_01_a = _D.add( _D.inv() );
       var MM_01_b = ( _D.pow( 3 ) ).div( ( _D.pow( 2.0 ).mul( 2.0 ) ).add( _unit ) );
       var MM_01_c = ( _D.mul( 2.0 ) ).add( _D.inv() );
       var MM_01_d = _D ;

       var MM_02_a = MM_01_a ; 
       var MM_02_b = MM_01_b.opposite(); 
       var MM_02_c = MM_01_c.opposite(); 
       var MM_02_d = MM_01_d ;

       var MM_01 = new mobius_map( MM_01_a, MM_01_b, MM_01_c, MM_01_d );
       var MM_02 = new mobius_map( MM_02_a, MM_02_b, MM_02_c, MM_02_d );
       CIRCLESembeddingsEARLE_OUTPUT( MM_01, MM_02, _init );
          
       $("#PLUGINparamsBTN").attr('class', 'linkdead');
	     CIRCLESembeddingsEARLE_active = _glob_dict_create = _glob_items_to_init = YES ;
       $('[id$=initBTN]').css('color',COLOR_ERROR) ;
    }
}

function CIRCLESembeddingsEARLE_OUTPUT( MM_01, MM_02, _init )
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
        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "62Unknown error" ;
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

function CIRCLESembeddingsEARLE_INIT( _skip_edit_acquisition, _calc )
{
    _skip_edit_acquisition = safe_int( _skip_edit_acquisition, NO );
    _calc = safe_int( _calc, NO );
    var CIRCLESembeddingsEARLE_d_formula = !_skip_edit_acquisition ? ( $("#PLUGIN_PARAM_D").val().length > 0 ? $("#PLUGIN_PARAM_D").val() : CIRCLESembeddingsEARLE_d ) : CIRCLESembeddingsEARLE_d ;
    _glob_init_mask = INIT_FROM_MAPS | INIT_PAIRED_ITEMS ;
    CIRCLESembeddingsEARLE_PARSE( CIRCLESembeddingsEARLE_d_formula );
}

function CIRCLESembeddingsEARLE_PARSE( _d_formula )
{
    var _entries = $( "[id^=PLUGIN_PARAM_]" );
    $.each( _entries, function( _i, _id ) { $( _id ).val( $( _id ).val().replaceAll( ",", "." ) ); } );

    var _index_ref = _plugin_last_ref;
    if ( new String( _d_formula ).trim().length == 0 ) _d_formula = "0" ;

		_d_formula = circles_lib_parse_fix_formula( _d_formula );
    $("#PLUGIN_PARAM_D").val( _d_formula );

    CIRCLESembeddingsEARLE_d = _d_formula ;
    CIRCLESembeddingsEARLE_d_complex = circles_lib_math_parse_formula( CIRCLESembeddingsEARLE_d );
    CIRCLESembeddingsEARLE_d_complex = parse_complex_from_string( CIRCLESembeddingsEARLE_d_complex + "" );

    if ( _plugin_tmp_vars_config_array['embeddings@earle'] == null ) _plugin_tmp_vars_config_array['embeddings@earle'] = [] ;
    _plugin_tmp_vars_config_array['embeddings@earle']['d'] = CIRCLESembeddingsEARLE_d ;

    _plugin_tmp_vars_config_array['d'] = CIRCLESembeddingsEARLE_d ;
    if ( _plugin_vars_array[_index_ref]['d']['value'] != null ) _plugin_vars_array[_index_ref]['d']['value'] = CIRCLESembeddingsEARLE_d_complex ;

    GLOB_PLUGIN_VARS_PATTERN_SAVE(_index_ref);
}