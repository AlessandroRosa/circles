function CIRCLESembeddingsGENERALPURPOSE_PRESETS_INIT()
{
    CIRCLESembeddingsGENERALPURPOSEpresets = [] ;
    CIRCLESembeddingsGENERALPURPOSEpresets.push( [
                                                   [ "1", "1", "0", "1", UNDET, [ -1.3, 1.3, 1.3, -1.3 ], "" ],
                                                   [ "1", "0", "i", "1", UNDET, [ -1.3, 1.3, 1.3, -1.3 ], "" ]
                                                 ]
                                               );
}

function CIRCLESembeddingsGENERALPURPOSE_PRESETS( _opcode )
{
    _opcode = safe_float( _opcode, UNDET );
    switch( _opcode )
    {
        case 1: // display
        var _html = "<SELECT ID=\"PLUGINpresetsCOMBO\" ONCHANGE=\"javascript:CIRCLESembeddingsGENERALPURPOSE_PRESETS(2);\">" ;
        _html += "<OPTION VALUE=\""+UNDET+"\" SELECTED=\"selected\">" ;
        $.each( CIRCLESembeddingsGENERALPURPOSEpresets, function( _i, _v ) { _html += "<OPTION VALUE=\""+_i+"\">#" + ( _i + 1 ) + ( _v[6] != null ? " - " + _v[6] : "" ) } );
        _html += "</SELECT>" ;
        return _html ;
        break ;
        case 2: // select
        var _index = $( "#PLUGINpresetsCOMBO" ).val();
        var _preset_data = CIRCLESembeddingsGENERALPURPOSEpresets[_index] ;
        var _previous_saved = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 ) > 0 ? YES : NO ;
        var _b_go = _previous_saved ? confirm( "A set of gens has been already registered."+_glob_crlf+"Do you want to overwrite it ?" ) : YES ;
        if ( is_array( _preset_data ) & _b_go )
        {
            CIRCLESembeddingsGENERALPURPOSE_CONFIG();
            $.each( _preset_data,
                    function( _i, _chunk )
                    {
                        $( "#PLUGIN_PARAM_A" ).val( _chunk[0] );
                        $( "#PLUGIN_PARAM_B" ).val( _chunk[1] );
                        $( "#PLUGIN_PARAM_C" ).val( _chunk[2] );
                        $( "#PLUGIN_PARAM_D" ).val( _chunk[3] );
                        var _comp = Math.max( 1, Math.abs( safe_int( _chunk[4], 1 ) ) );
                        var _coords = _chunk[5] ;
                        
						            if ( is_array( _coords ) && safe_size( _coords, 0 ) == 4 && _glob_interface_index == INTERFACE_EXTEND_NONE )
						            {
						               var _ret_chunk = circles_lib_canvas_coords_correct_aspectratio( W_PLANE );
						               if ( _ret_chunk[0] != RET_IRRELEVANT ) circles_lib_canvas_layer_pile_resize_to_default();
						            }
						            else
						            {
						               _coords = circles_lib_interface_recalc_bounding_coords( INTERFACE_INPUT_HEIGHT,
						                         _glob_wplaneLEFT, safe_float( _coords[1], DEFAULT_PLANE_COORD ),
						                         _glob_wplaneRIGHT, safe_float( _coords[3], -DEFAULT_PLANE_COORD ) ) ;
						            }
						
						            _glob_zplaneLEFT = _glob_wplaneLEFT = _glob_bipLEFT = safe_float( _coords[0], -DEFAULT_PLANE_COORD );
						            _glob_zplaneTOP = _glob_wplaneTOP = _glob_bipTOP = safe_float( _coords[1], DEFAULT_PLANE_COORD );
						            _glob_zplaneRIGHT = _glob_wplaneRIGHT = _glob_bipRIGHT = safe_float( _coords[2], DEFAULT_PLANE_COORD );
						            _glob_zplaneBOTTOM = _glob_wplaneBOTTOM = _glob_bipBOTTOM = safe_float( _coords[3], -DEFAULT_PLANE_COORD );
						            circles_lib_canvas_coords_acquire( ALL_PLANES );
            
                        CIRCLESembeddingsGENERALPURPOSE_GEN_UPDATE( CIRCLESembeddingsGENERALPURPOSE_ADD, YES );
                        CIRCLESembeddingsGENERALPURPOSE_REGISTER_PARAMS();
                        _glob_target_plane = W_PLANE ;
                    }
                  ) ;
        
            CIRCLESembeddingsGENERALPURPOSE_GENERATE_GROUP( YES, NO );
            GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
            GLOB_PLUGIN_WIZARD_STEP(1.1,NO);
            $("#CIRCLESGENERALPURPOSEmainDIV").get(0).tabber.tabShow(1);
        }
        return null ;
        break ;
        default: break ;
    }

    return null ;
}