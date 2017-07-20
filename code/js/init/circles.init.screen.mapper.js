function circles_lib_zplane_mapper_init( _side, _border, _recalc )
{
    _size = safe_int( _side, 0 ), _border = safe_int( _border, 0 ), _recalc = safe_int( _recalc, NO );
    if ( _recalc )
    {
        var MASTER_SIDE = _side, MASTER_BORDER = _border ;
        var display_rect = new rect( MASTER_BORDER, MASTER_BORDER, MASTER_SIDE - MASTER_BORDER, MASTER_SIDE - MASTER_BORDER, _RECT_ORIENTATION_SCREEN, "display rect" );
        var client_rect = new rect( 0, 0, MASTER_SIDE - MASTER_BORDER, MASTER_SIDE - MASTER_BORDER, _RECT_ORIENTATION_SCREEN, "client rect" );
        zplane_sm.set_client_rect( client_rect );
        zplane_sm.set_display_rect( display_rect );
 				zplane_sm.set_coords_rect( new rect( _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) );
    }
    zplane_sm.accuracy = DEFAULT_MAX_ACCURACY ;
}

function circles_lib_wplane_mapper_init( _side, _border, _recalc )
{
    _size = safe_int( _side, 0 ), _border = safe_int( _border, 0 ), _recalc = safe_int( _recalc, NO );
    if ( _recalc )
    {
        var MASTER_SIDE = _side, MASTER_BORDER = _border ;
        var display_rect = new rect( MASTER_BORDER, MASTER_BORDER, MASTER_SIDE - MASTER_BORDER, MASTER_SIDE - MASTER_BORDER, _RECT_ORIENTATION_SCREEN, "display rect" );
        var client_rect = new rect( 0, 0, MASTER_SIDE - MASTER_BORDER, MASTER_SIDE - MASTER_BORDER, _RECT_ORIENTATION_SCREEN, "client rect" );
        wplane_sm.set_client_rect( client_rect );
        wplane_sm.set_display_rect( display_rect );
		 		wplane_sm.set_coords_rect( new rect( _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) );
    }
    wplane_sm.accuracy = DEFAULT_MAX_ACCURACY ;
}

function circles_lib_bip_mapper_init( LEFT, TOP, RIGHT, BOTTOM )
{
		LEFT = safe_float( LEFT, _glob_bipLEFT );			TOP = safe_float( TOP, _glob_bipTOP );
		RIGHT = safe_float( RIGHT, _glob_bipRIGHT );	BOTTOM = safe_float( BOTTOM, _glob_bipBOTTOM );
		var _bip_canvas = $( "#CIRCLESbipCANVAS" ).get(0) ;
		var _side_x = safe_int( _bip_canvas.get_width(), 0 ), _side_y = safe_int( _bip_canvas.get_height(), 0 );
    var _d_rect = new rect( 0, 0, _side_x, _side_y, _RECT_ORIENTATION_SCREEN, "display rect" );
    var _c_rect = new rect( 0, 0, _side_x, _side_y, _RECT_ORIENTATION_SCREEN, "client rect" );
    bipbox_sm.set_client_rect( _d_rect );
    bipbox_sm.set_display_rect( _c_rect );
    bipbox_sm.set_coords_rect( new rect( LEFT, TOP, RIGHT, BOTTOM, _RECT_ORIENTATION_CARTESIAN ) );
    bipbox_sm.accuracy = DEFAULT_MAX_ACCURACY ;
}

function circles_lib_dlocus_mapper_init( _side_x, _side_y, _recalc, _client_rect, _display_rect )
{
    _size_x = safe_int( _side_x, 0 ), _side_y = safe_int( _side_y, 0 ), _recalc = safe_int( _recalc, NO );
    if ( _recalc )
    {
        var _d_rect = is_rect( _client_rect ) ? _client_rect : new rect( 0, 0, _side_x, _side_y, _RECT_ORIENTATION_SCREEN, "display rect" );
        var _c_rect = is_rect( _display_rect ) ? _display_rect : new rect( 0, 0, _side_x, _side_y, _RECT_ORIENTATION_SCREEN, "client rect" );
        dlocus_sm.set_client_rect( _d_rect );
        dlocus_sm.set_display_rect( _c_rect );
		 		dlocus_sm.set_coords_rect( new rect( _glob_dlocusLEFT, _glob_dlocusTOP, _glob_dlocusRIGHT, _glob_dlocusBOTTOM, _RECT_ORIENTATION_CARTESIAN ) );
    }

    dlocus_sm.accuracy = DEFAULT_MAX_ACCURACY ;
}