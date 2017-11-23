function CIRCLESembeddingsMASKITONCE_PRESETS_INIT()
{
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.61688i+0.70567", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.41421356237i", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.555i-0.444", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.501347474085i-0.865385203320", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.501347474169i+0.865385203218", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.616888739343i-1.294321525602", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.61803398875i", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.6168866453i+0.7056734968", 1, [ -2.3, 2.3, 2.3, -2.3 ], "Indra's p. 318 - plate 1" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.62i-0.3", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.658312i-0.5", 1, [ -2, 2, 2, -2 ], "Indra's p. 308" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.77i-0.4", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.781i-0.1", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.77i-0.1", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.80785524i-0.136998688", 1 , [ -2, 2, 2, -2 ], "Indra's p. 295" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.83785524i-0.096998688", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.84i-0.2", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.875i-0.06", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.9175i-0.025", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.92i-0.04", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.92i-0.03", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.92i-0.02", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.95i-0.02", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "1.96i-0.01", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "2i", 1, [ -2, 2, 2, -2 ], "" ] );
    CIRCLESembeddingsMASKITONCE_PRESETSarray.push( [ "2i-1", 1, [ -2, 2, 2, -2 ], "" ] );
}

function CIRCLESembeddingsMASKITONCE_PRESETS( _opcode, _init )
{
    _opcode = safe_float( _opcode, UNDET ), _init = safe_int( _init, NO );
    switch( _opcode )
    {
        case 1: // display
        var _html = "<SELECT ID=\"PLUGINpresetsCOMBO\" ONCHANGE=\"javascript:CIRCLESembeddingsMASKITONCE_PRESETS(2,YES);\">" ;
        _html += "<OPTION VALUE=\""+UNDET+"\" SELECTED=\"selected\">" ;
        $.each( CIRCLESembeddingsMASKITONCE_PRESETSarray, function( _i, _v ) { _html += "<OPTION VALUE=\""+_i+"\">#"+(_i+1) + ( _v[3] != null ? " - " + _v[3] : "" ) } );
        _html += "</SELECT>" ;
        return _html ;
        break ;
        case 2: // select
        var _index = $( "#PLUGINpresetsCOMBO" ).val(), _chunk = CIRCLESembeddingsMASKITONCE_PRESETSarray[_index] ;
        if ( _chunk != null )
        {
            $( "#PLUGIN_PARAM_MU" ).val( _chunk[0] );
            var _comp = Math.max( 1, Math.abs( safe_int( _chunk[1], 1 ) ) );
            var _coords = _chunk[2] ;
            
            if ( is_array( _coords ) && safe_size( _coords, 0 ) == 4 && _glob_interface_index == INTERFACE_EXTEND_NONE )
            {
               var _ret_chunk = circles_lib_canvas_coords_correct_aspectratio( W_PLANE );
               if ( _ret_chunk[0] != RET_IRRELEVANT ) circles_lib_canvas_layer_pile_resize_to_default();
            }
            else
               _coords = circles_lib_interface_recalc_bounding_coords( INTERFACE_INPUT_HEIGHT,
                         _glob_wplaneLEFT, safe_float( _coords[1], DEFAULT_PLANE_COORD ),
                         _glob_wplaneRIGHT, safe_float( _coords[3], -DEFAULT_PLANE_COORD ) ) ;

            _glob_zplaneLEFT = _glob_wplaneLEFT = _glob_bipLEFT = safe_float( _coords[0], -DEFAULT_PLANE_COORD );
            _glob_zplaneTOP = _glob_wplaneTOP = _glob_bipTOP = safe_float( _coords[1], DEFAULT_PLANE_COORD );
            _glob_zplaneRIGHT = _glob_wplaneRIGHT = _glob_bipRIGHT = safe_float( _coords[2], DEFAULT_PLANE_COORD );
            _glob_zplaneBOTTOM = _glob_wplaneBOTTOM = _glob_bipBOTTOM = safe_float( _coords[3], -DEFAULT_PLANE_COORD );

            circles_lib_canvas_coords_acquire( ALL_PLANES );
            CIRCLESembeddingsMASKITONCE_INIT(NO,YES);
					  CIRCLESembeddingsMASKITONCE_COMP(_init);
            CIRCLESembeddingsMASKITONCE_CONFIG();
            GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
            GLOB_PLUGIN_WIZARD_STEP(1.1,YES);
						circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;

            if( $( "#CIRCLESembeddingsMASKITONCE_CANVAS" ).is( ":visible" ) )
            {
                var _fn_str = "circles_lib_plugin_render_preview", _fn = null ;
                try{ eval( "_fn = " + _fn_str ) ; } catch( _err ){ circles_lib_error_obj_handler( _err ); }
                if ( typeof _fn === "function" ) _fn.call( this, "maskit.once", "embeddings", Z_PLANE ) ;
            }
            _glob_target_plane = W_PLANE ;
        }
        return null ;
        break ;
        default: break ;
    }

    return null ;
}

function CIRCLESembeddingsMASKITONCE_COMP( _init )
{
		_init = safe_int( _init, YES );
    var _mu = CIRCLESembeddingsMASKITONCE_mu_complex ;
    if ( !is_complex( _mu ) ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "The input trace is not a complex formula.", 'PLUGIN_OUTMSG') ;
    else
    {
        if ( is_array( _glob_seeds_array ) ) _glob_seeds_array = [];
        var _unit = new complex( 1, 0 ), _zero = new complex( 0, 0 ), _imag = new complex( 0, 1 );
        var MM_01_a = _mu.mul( _imag.mul(-1) );
        var MM_01_b = _imag.mul(-1);
        var MM_01_c = _imag.mul(-1);
        var MM_01_d = _zero ;
          
        var MM_02_a = _unit ;
        var MM_02_b = _unit.mul(2);
        var MM_02_c = _zero ;
        var MM_02_d = _unit ;

        var MM_01 = new mobius_map( MM_01_a, MM_01_b, MM_01_c, MM_01_d );
        var MM_02 = new mobius_map( MM_02_a, MM_02_b, MM_02_c, MM_02_d );
        CIRCLESembeddingsMASKITONCE_OUTPUT( MM_01, MM_02, _init );
          
        $("#PLUGINsetBTN").attr('class', 'linkdead');
        _glob_items_to_init = YES ;
        $('[id$=initBTN]').css('color',COLOR_ERROR) ;
    }
}

function CIRCLESembeddingsMASKITONCE_OUTPUT( MM_01, MM_02, _init )
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

    _glob_seeds_array = [];
    _glob_seeds_array.push( new item_obj( MM_01, _circle01, screen_CC_01, "a", 0, YES, screen_CC_01.drawcolor, NO, screen_CC_01.drawcolor, "A", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( MM_02, _circle02, screen_CC_02, "b", 0, YES, screen_CC_02.drawcolor, NO, screen_CC_02.drawcolor, "B", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( inverse_MM_01, _inv_circle01, screen_INV_CC_01.drawcolor, "A", 0, YES, screen_INV_CC_01.drawcolor, NO, _glob_fill_inverse_seed_color, "a", 1, ITEM_TYPE_CIRCLE ) );
    _glob_seeds_array.push( new item_obj( inverse_MM_02, _inv_circle02, screen_INV_CC_02.drawcolor, "B", 0, YES, screen_INV_CC_02.drawcolor, NO, _glob_fill_inverse_seed_color, "b", 1, ITEM_TYPE_CIRCLE ) );

 		CIRCLESembeddingsMASKITONCE_active = _glob_dict_create = _glob_items_to_init = YES ;
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
            $("#PLUGIN_CONTAINER_PARAMS").html( GLOB_PLUGIN_GENS_TABLE_SHOW('maskit.once') );
            
        }
        else
        {
            $('[id$=initBTN]').css('color',COLOR_ERROR);
            circles_lib_log_add_entry( _ret_msg, LOG_WARNING );
        }
    }
}

function CIRCLESembeddingsMASKITONCE_INIT( _skip_edit_acquisition, _calc )
{
    _skip_edit_acquisition = safe_int( _skip_edit_acquisition, NO ), _calc = safe_int( _calc, NO );
    var CIRCLESembeddingsMASKITONCE_mu_formula = !_skip_edit_acquisition ? ( $("#PLUGIN_PARAM_MU").val().length > 0 ? $("#PLUGIN_PARAM_MU").val() : CIRCLESembeddingsMASKITONCE_mu ) : CIRCLESembeddingsMASKITONCE_mu ;
    _glob_init_mask = INIT_FROM_MAPS | INIT_PAIRED_ITEMS ;
    CIRCLESembeddingsMASKITONCE_PARSE( CIRCLESembeddingsMASKITONCE_mu_formula );
}

function CIRCLESembeddingsMASKITONCE_PARSE( CIRCLESembeddingsMASKITONCE_mu_formula )
{
    var _entries = $( "[id^=PLUGIN_PARAM_]" );
    $.each( _entries, function( _i, _id ) { $( _id ).val( $( _id ).val().replaceAll( ",", "." ) ); } );

  	var _index_ref = _plugin_last_ref + "";
    if ( new String( CIRCLESembeddingsMASKITONCE_mu_formula ).trim().length == 0 ) CIRCLESembeddingsMASKITONCE_mu_formula = "0" ;

		CIRCLESembeddingsMASKITONCE_mu_formula = circles_lib_parse_fix_formula( CIRCLESembeddingsMASKITONCE_mu_formula );
    if ( $("#PLUGIN_PARAM_MU").get(0) != null ) $("#PLUGIN_PARAM_MU").val( CIRCLESembeddingsMASKITONCE_mu_formula );

    CIRCLESembeddingsMASKITONCE_mu = CIRCLESembeddingsMASKITONCE_mu_formula ;
    CIRCLESembeddingsMASKITONCE_mu = circles_lib_parse_fix_formula( CIRCLESembeddingsMASKITONCE_mu );
    CIRCLESembeddingsMASKITONCE_mu_complex = circles_lib_math_parse_formula( CIRCLESembeddingsMASKITONCE_mu );
    CIRCLESembeddingsMASKITONCE_mu_complex = parse_complex_from_string( CIRCLESembeddingsMASKITONCE_mu_complex + "" );

    if ( _plugin_tmp_vars_array['embeddings@maskitonce'] == null ) _plugin_tmp_vars_array['embeddings@maskitonce'] = [] ;
    _plugin_tmp_vars_array['embeddings@maskitonce']['mu'] = CIRCLESembeddingsMASKITONCE_mu ;

    _plugin_tmp_vars_array['mu'] = CIRCLESembeddingsMASKITONCE_mu ;
    if ( _plugin_vars_array[_index_ref]['mu']['value'] != null ) _plugin_vars_array[_index_ref]['mu']['value'] = CIRCLESembeddingsMASKITONCE_mu_complex ;

    GLOB_PLUGIN_VARS_PATTERN_SAVE(_index_ref);
}