function circles_lib_bip_activate( bACTIVATE )
{
    _glob_persistent_vars['old_target_plane'] = _glob_target_plane ;
		_glob_target_plane = bACTIVATE ? BIP_BOX : ( circles_lib_plugin_find_index( { base_id : "discreteness.locus" }, POPUP_SEARCH_BY_BASE_ID ) != UNFOUND ? D_LOCUS : W_PLANE ) ;
    bACTIVATE ? circles_lib_statusbar_set_config_icon( CONFIG_BIPBOX ) : circles_lib_statusbar_set_config_icon( CONFIG_STD );

    var _popups = [ [ "forms", "general.options" ], [ "forms", "discreteness.locus" ] ] ;
    _popups.forEach( function( _chunk )
    {
      if ( circles_lib_plugin_find_index( _chunk[1], POPUP_SEARCH_BY_BASE_ID ) != UNFOUND )
      circles_lib_plugin_dispatcher_unicast_message( _chunk[1], _chunk[0], POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS, 1 );
    }
    );
}

function circles_lib_bip_apply_settings( _out_channel, _question, _silent, _update,
			                                   _center, _x_extent, _y_extent,
			                                   _smallerside, _coords_diagram, _data_diagram, _bk )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _x_extent = safe_int( _x_extent, 0 ), _y_extent = safe_int( _y_extent, 0 );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var MSG = "Do you confirm to apply these settings ?" ;
    var _b_go = ( _out_channel == OUTPUT_SCREEN && _question ) ? ( confirm( MSG ) ? YES : NO ) : YES ;
    var _b_fail = 0, _error_str = "", _memo = [] ;
    if ( _b_go )
    {
        if ( _out_channel == OUTPUT_SCREEN )
        {
            hideCOLORTABLE();

            if ( $("#CIRCLESapplytoRADIO_01").is( ":checked" ) ) _glob_bip_original_plane_data = Z_PLANE ;
            else if ( $("#CIRCLESapplytoRADIO_02").is( ":checked" ) ) _glob_bip_original_plane_data = W_PLANE ;

            if ( $("#CIRCLESdiagramRADIO_01").is( ":checked" ) ) _glob_bip_original_plane_coords = Z_PLANE ;
            else if ( $("#CIRCLESdiagramRADIO_02").is( ":checked" ) ) _glob_bip_original_plane_coords = W_PLANE ;
            else if ( $("#CIRCLESdiagramRADIO_03").is( ":checked" ) ) _glob_bip_original_plane_coords = D_LOCUS ;
            else if ( $("#CIRCLESdiagramRADIO_04").is( ":checked" ) ) _glob_bip_original_plane_coords = BIP_BOX ;

            _glob_bip_shorterside_pixels = safe_float( $("#BIPcanvasSHORTERSIDEpixels").val(), 0 );
            _glob_bip_pixel_size = safe_float( $("#BIPcanvasPIXELsize").val(), 0 );
            _glob_bip_x_extent = safe_float( $("#BIPcanvasEXTENTx").val(), 0 );
            _glob_bip_y_extent = safe_float( $("#BIPcanvasEXTENTy").val(), 0 );
            _glob_bip_box_center_pt = new point( safe_float( $("#BIPcanvasCENTERx").val(), 0 ), safe_float( $("#BIPcanvasCENTERy").val(), 0 ) );
            _glob_bip_bk = $("#canvas_bk_color").css( "background-color" );
            _glob_bip_bk = safe_size( _glob_bip_bk, 0 ) > 0 ? _glob_bip_bk : "transparent" ;
        }
        else
        {
            if ( _data_diagram.is_one_of( Z_PLANE, W_PLANE ) ) _glob_bip_original_plane_data = safe_int( _data_diagram, Z_PLANE );
            if ( _coords_diagram.is_one_of( Z_PLANE, W_PLANE, D_LOCUS, BIP_BOX ) ) _glob_bip_original_plane_coords = safe_int( _coords_diagram, Z_PLANE );
            if ( _smallerside > 0 ) _glob_bip_shorterside_pixels = safe_int( _smallerside, 1 );
            if ( _x_extent > 0 ) _glob_bip_x_extent = safe_float( _x_extent, 0 );
            if ( _y_extent > 0 ) _glob_bip_y_extent = safe_float( _y_extent, 0 );
            if ( is_point( _center ) ) _glob_bip_box_center_pt = _center ;
            if ( is_string( _bk ) ) _glob_bip_bk = _bk.length > 0 ? _bk : "transparent" ;
        }

        if ( _b_fail == 0 && _glob_bip_halt == NO )
        {
            var _canvas_width = 0, _canvas_height = 0 ;
            // settings coordinates
            _glob_target_plane = BIP_BOX ;
            if ( is_point( _glob_bip_box_center_pt ) )
            {
                _glob_bipLEFT = _glob_bip_box_center_pt.x - _glob_bip_x_extent / 2.0 ;
                _glob_bipRIGHT = _glob_bip_box_center_pt.x + _glob_bip_x_extent / 2.0 ;
                _glob_bipTOP = _glob_bip_box_center_pt.y + _glob_bip_y_extent / 2.0 ;
                _glob_bipBOTTOM = _glob_bip_box_center_pt.y - _glob_bip_y_extent / 2.0 ;
                bipbox_sm.set_coords_corners( new point( _glob_bipLEFT, _glob_bipTOP ), new point( _glob_bipRIGHT, _glob_bipBOTTOM ) );
            }

            if ( _glob_bip_shorterside_pixels > 0 && _glob_bip_x_extent > 0 && _glob_bip_y_extent > 0 )
            {
                var _choice = _glob_bip_x_extent <= _glob_bip_y_extent ? 1 : 2 ;
                // resize canvas width/height
                if ( _choice == 1 )
                {
                    _canvas_width = _glob_bip_shorterside_pixels ;
                    _canvas_height = _glob_bip_shorterside_pixels * _glob_bip_y_extent / _glob_bip_x_extent ;
                    _canvas_height = safe_int( _canvas_height, DEFAULT_BIP_SIZE );
                }
                else if ( _choice == 2 )
                {
                    _canvas_height = _glob_bip_shorterside_pixels ;
                    _canvas_width = _glob_bip_shorterside_pixels * _glob_bip_x_extent / _glob_bip_y_extent ;
                    _canvas_width = safe_int( _canvas_width, DEFAULT_BIP_SIZE );
                }
            }

            CIRCLESformsBIPcalculatePIXELside( _update );
            
            if ( is_html_canvas( _glob_bip_canvas ) )
            {
                $('[id$=renderBTN]').css('color',COLOR_ERROR) ;
                _glob_bip_canvas.set_label( "bip" ) ;
                _glob_bip_canvas.set_width( _canvas_width );
                _glob_bip_canvas.set_height( _canvas_height );
                _glob_bip_canvas.set_backgroundcolor( _glob_bip_bk ) ;
                circles_lib_canvas_clean( _glob_bip_canvas, _glob_bip_bk, _out_channel );
                var _rect = new rect( 0, 0, _canvas_width, _canvas_height );
								circles_lib_bip_mapper_init() ;
                return [ RET_OK, "BIP settings have been applied with success." + _glob_crlf + "You can start the rendering now.", 0 ];
            }
            else return [ RET_ERROR, "Missing canvas component: please, reload this page.", _err_mask ];
        }
        else return [ RET_ERROR, "An error occurred while setting params: please, check all values are correct.", _err_mask ];
    }
    else return [ UNDET, "", 0 ];
}

function circles_lib_bip_check_params()
{
    var _err_mask = 0 ;
    if ( _glob_bip_x_extent <= 0 ) _err_mask |= 1 ;
    if ( _glob_bip_y_extent <= 0 ) _err_mask |= 2 ;
    if ( !is_point( _glob_bip_box_center_pt ) ) _err_mask |= 4 ;
    if ( _glob_bip_shorterside_pixels <= 0 ) _err_mask |= 8 ;
    if ( _glob_bip_original_plane_data == NO_PLANE ) _err_mask |= 16 ;
    if ( _glob_bip_original_plane_coords == NO_PLANE ) _err_mask |= 32 ;
    if ( _glob_bip_ticks <= 0 ) _err_mask |= 64 ;
    return _err_mask ;
}

function circles_lib_bip_render( _silent, _out_channel )
{
		_silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _msg = "" ;
    if ( _glob_bip_original_plane_data == NO_PLANE )
    {
        _msg = "A plane shall be selected to perform the drawing" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ];
    }
    else if ( _glob_bip_original_plane_coords == NO_PLANE )
    {
        _msg = "A diagram shall be selected to perform the drawing" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ];
    }
    else if ( _glob_bip_original_plane_coords == BIP_BOX && ( _glob_bip_x_extent == 0 || _glob_bip_x_extent == 0 ) )
    {
        _msg = "One of the two user-defined region extension is zero" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ];
    }
    else if ( _glob_bip_halt )
    {
        _msg = "An error occurred while setting params: please, check all values are correct" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ];
    }
    else if ( is_html_canvas( _glob_bip_canvas ) )
    {
        var _ret_chunk = null ;
        switch( _glob_bip_original_plane_data )
        {
            case Z_PLANE:
            _plane_label = "Z-plane" ;
            _svg_destroy( _glob_export_code_array );
            circles_lib_canvas_clean( _glob_bip_canvas, "", _out_channel );
            _ret_chunk = circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, null, YES, YES, YES, YES, !_silent, _silent, _out_channel );
            break ;
            case W_PLANE:
            _plane_label = "W-plane" ;
            _svg_destroy( _glob_export_code_array );
            // _glob_bip_original_plane_data
            circles_lib_canvas_clean( _glob_bip_canvas, "", _out_channel );
            _ret_chunk = circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, null, YES, YES, YES, YES, !_silent, _silent, _out_channel );
            break ;
            default: _plane_label = "Undetermined" ; break ;
        }

        var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
        _glob_bip_use = NO, _glob_bip_halt = NO ;
        var _msg = _ret_id ? "("+_plane_label+") Diagram has been rendered in BIP mode" : _ret_msg ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _msg, _glob_app_title );
        return [ _ret_id, _msg ];
    }
    else
    {
        var _msg = "Memory error: BIP feature is not available" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ];
    }
}