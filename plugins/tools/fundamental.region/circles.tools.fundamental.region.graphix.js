function CIRCLEStoolsFUNDAMENTALREGIONmapperINIT( _side_x, _side_y, _recalculate, _client_rect, _display_rect )
{
    _size_x = safe_int( _side_x, 0 ), _side_y = safe_int( _side_y, 0 );
    _recalculate = safe_int( _recalculate, NO );
    if ( _recalculate )
    {
        var _d_rect = is_rect( _client_rect ) ? _client_rect : new rect( 0, 0, _side_x, _side_y, _RECT_ORIENTATION_SCREEN, "display rect" );
        var _c_rect = is_rect( _display_rect ) ? _display_rect : new rect( 0, 0, _side_x, _side_y, _RECT_ORIENTATION_SCREEN, "client rect" );
        CIRCLEStoolsFUNDAMENTALREGIONmapper.set_client_rect( _d_rect );
        CIRCLEStoolsFUNDAMENTALREGIONmapper.set_display_rect( _c_rect );
        CIRCLEStoolsFUNDAMENTALREGIONmapper.set_coords_corners( new point( _glob_wplaneLEFT, _glob_wplaneTOP ),
																																new point( _glob_wplaneRIGHT, _glob_wplaneBOTTOM ) );
    }

    CIRCLEStoolsFUNDAMENTALREGIONmapper.accuracy = DEFAULT_MAX_ACCURACY ;
}

function CIRCLEStoolsFUNDAMENTALREGIONdrawCANVAS( _options_array, _silent )
{
    if( !is_array( _options_array ) ) _options_array = [] ;
    _silent = safe_int( _silent, NO );
    var _canvas = $( "#CIRCLESfundamentalregiondiagramCANVAS" ).get(0);
    if ( is_html_canvas( _canvas ) )
    {
        var _canvas_w = safe_int( _canvas.get_width(), 0 ), _canvas_h = safe_int( _canvas.get_height(), 0 );
        if ( _canvas_w > 0 && _canvas_h > 0 )
        {
            // in canvas logical coords
            CIRCLEStoolsFUNDAMENTALREGIONrect = new rect( 0, _canvas_h, _canvas_w, 0 );
            CIRCLEStoolsFUNDAMENTALREGIONmapper.set_client_rect( CIRCLEStoolsFUNDAMENTALREGIONrect );
            CIRCLEStoolsFUNDAMENTALREGIONmapper.set_display_rect( CIRCLEStoolsFUNDAMENTALREGIONrect );
            _options_array = _options_array.unique();
            $.each( _options_array,
                    function( _i, _option )
                    {
                    		_option = safe_int( _option, 0 );
                        if ( _option == 1 ) circles_lib_grid_draw( _canvas, CIRCLEStoolsFUNDAMENTALREGIONmapper, W_PLANE, YES, _glob_ticks_count, OUTPUT_SCREEN );
                        if ( _option == 2 ) CIRCLEStoolsFUNDAMENTALREGIONmapperINIT( _canvas_w, _canvas_h, YES );
                        if ( _option == 8 ) circles_lib_canvas_clean( _canvas, "white" );
                    }
                  );
        }
    }
}