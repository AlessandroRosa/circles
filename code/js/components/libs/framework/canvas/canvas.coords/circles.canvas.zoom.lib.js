function circles_lib_canvas_coords_reset( _plane_type, _render, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
  	_render = safe_int( _render, YES ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    switch( _plane_type )
    {
         case Z_PLANE:
         _glob_zplaneLEFT = -DEFAULT_PLANE_COORD ;
         _glob_zplaneRIGHT = DEFAULT_PLANE_COORD ;
         _glob_zplaneTOP = DEFAULT_PLANE_COORD ;
         _glob_zplaneBOTTOM = -DEFAULT_PLANE_COORD ;
         return circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, _render, NO, YES, _out_channel );
         break ;
         case W_PLANE:
         _glob_wplaneLEFT = -DEFAULT_PLANE_COORD ;
         _glob_wplaneRIGHT = DEFAULT_PLANE_COORD ;
         _glob_wplaneTOP = DEFAULT_PLANE_COORD ;
         _glob_wplaneBOTTOM = -DEFAULT_PLANE_COORD ;
         return circles_lib_canvas_render_wplane( null, wplane_sm, null, NO, YES, _render, YES, NO, YES, _out_channel );
         break ;
         case BIP_BOX:
         _glob_bipLEFT = -DEFAULT_PLANE_COORD ;
         _glob_bipRIGHT = DEFAULT_PLANE_COORD ;
         _glob_bipTOP = DEFAULT_PLANE_COORD ;
         _glob_bipBOTTOM = -DEFAULT_PLANE_COORD ;
         return circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, null, YES, YES, _render, YES, NO, YES, _out_channel );
         break ;
         default:
         return [ RET_ERROR, "Can't reset: improper plane type" ] ;
         break ;
    }
}

function circles_lib_canvas_coords_shift( _where, _plane_type, _silent, _render, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
	  _silent = safe_int( _silent, NO ), _render = safe_int( _render, YES );
    _where = is_string( _where ) ? ( _where + "").toLowerCase() : "" ;
    var LEFT = 0, RIGHT = 0, TOP = 0, BOTTOM = 0 ;
    switch( _plane_type )
    {
        case Z_PLANE:
        LEFT = _glob_zplaneLEFT ;
        RIGHT = _glob_zplaneRIGHT ;
        TOP = _glob_zplaneTOP ;
        BOTTOM = _glob_zplaneBOTTOM ;
        break ;
        case W_PLANE:
        LEFT = _glob_wplaneLEFT ;
        RIGHT = _glob_wplaneRIGHT ;
        TOP = _glob_wplaneTOP ;
        BOTTOM = _glob_wplaneBOTTOM ;
        break ;
        case BIP_BOX:
        LEFT = _glob_bipLEFT ;
        RIGHT = _glob_bipRIGHT ;
        TOP = _glob_bipTOP ;
        BOTTOM = _glob_bipBOTTOM ;
        break ;
        default: break ;
    }

    var dX = RIGHT - LEFT , dY = TOP - BOTTOM ;
    var factor = Math.pow( 2, 3 );
    if ( dX != 0 && dY != 0 )
    {
       switch( _where.toLowerCase() )
       {
                case "left" :
                LEFT -= dX / factor, RIGHT -= dX / factor ;
                break ;
                case "right" :
                LEFT += dX / factor, RIGHT += dX / factor ;
                break ;
                case "up" :
                TOP += dY / factor, BOTTOM += dY / factor ;
                break ;
                case "down" :
                TOP -= dY / factor, BOTTOM -= dY / factor ;
                break ;
                default:
                break ;
       }

       if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
       {
           _glob_zplaneLEFT = LEFT, _glob_zplaneRIGHT = RIGHT, _glob_zplaneTOP = TOP, _glob_zplaneBOTTOM = BOTTOM ;
       }
       else if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
       {
           _glob_wplaneLEFT = LEFT, _glob_wplaneRIGHT = RIGHT, _glob_wplaneTOP = TOP, _glob_wplaneBOTTOM = BOTTOM ;
       }
       else if ( _plane_type == BIP_BOX )
       {
           _glob_bipLEFT = LEFT, _glob_bipRIGHT = RIGHT, _glob_bipTOP = TOP, _glob_bipBOTTOM = BOTTOM ;
       }
    }
    else
    {
       if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
       {
           _glob_zplaneLEFT = -DEFAULT_PLANE_COORD ;
           _glob_zplaneRIGHT = DEFAULT_PLANE_COORD ;
           _glob_zplaneTOP = DEFAULT_PLANE_COORD ;
           _glob_zplaneBOTTOM = -DEFAULT_PLANE_COORD ;
       }
       else if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
       {
           _glob_wplaneLEFT = -DEFAULT_PLANE_COORD2 ;
           _glob_wplaneRIGHT = DEFAULT_PLANE_COORD ;
           _glob_wplaneTOP = DEFAULT_PLANE_COORD ;
           _glob_wplaneBOTTOM = -DEFAULT_PLANE_COORD ;
       }
       else if ( _plane_type == BIP_BOX )
       {
           _glob_bipLEFT = -DEFAULT_PLANE_COORD2 ;
           _glob_bipRIGHT = DEFAULT_PLANE_COORD ;
           _glob_bipTOP = DEFAULT_PLANE_COORD ;
           _glob_bipBOTTOM = -DEFAULT_PLANE_COORD ;
       }

       var _msg = "Can't zoom: coordinates are improper and they will be reset to default values" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
       return [ RET_ERROR, _msg ] ;
    }
          
    if ( _render && _plane_type.is_one_of( Z_PLANE ) )
    {
       var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, _render, NO, YES, _out_channel );
       var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
       var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
       return [ _ret_id ? RET_OK : RET_ERROR, _ret_id ? "Z-plane coordinates shifted with success. Now rendering in action" : _ret_msg ] ;
    }
    else if ( _render && _plane_type.is_one_of( W_PLANE ) )
    {
       var _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, _glob_wplane_selected_items_array, NO, YES, _render, YES, NO, YES, _out_channel );
       var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
       var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
       return [ _ret_id ? RET_OK : RET_ERROR, _ret_id ? "W-plane coordinates shifted with success. Now rendering in action" : _ret_msg ] ;
    }
    else if ( _render && _plane_type == BIP_BOX )
    {
       var _sel_array ;
       if ( _glob_bip_original_plane_data == Z_PLANE ) _sel_array = _glob_zplane_selected_items_array ;
       else if ( _glob_bip_original_plane_data == W_PLANE ) _sel_array = _glob_wplane_selected_items_array ;

       var _ret_chunk = circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, _sel_array, YES, YES, _render, YES, NO, YES, _out_channel );
       var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
       var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
       return [ _ret_id ? RET_OK : RET_ERROR, _ret_id ? "Bip box coordinates shifted with success. Now rendering in action" : _ret_msg ] ;
    }
}

function circles_lib_canvas_zoom( _plane_type, _mode /* 1: ZOOM IN, 2: ZOOM OUT */, _question, _silent, _render, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
  	_question = safe_int( _question, YES ), _render = safe_int( _render, YES );
  	_silent = safe_int( _silent, NO ), _mode = safe_int( _mode, 1 );
    var LEFT = 0, RIGHT = 0, TOP = 0, BOTTOM = 0 ;
    switch( _plane_type )
    {
        case Z_PLANE:
        LEFT = _glob_zplaneLEFT, RIGHT = _glob_zplaneRIGHT, TOP = _glob_zplaneTOP, BOTTOM = _glob_zplaneBOTTOM ;
        break ;
        case W_PLANE:
        LEFT = _glob_wplaneLEFT, RIGHT = _glob_wplaneRIGHT, TOP = _glob_wplaneTOP, BOTTOM = _glob_wplaneBOTTOM ;
        break ;
        case BIP_BOX:
        LEFT = _glob_bipLEFT, RIGHT = _glob_bipRIGHT, TOP = _glob_bipTOP, BOTTOM = _glob_bipBOTTOM ;
        break ;
        default: return [ RET_ERROR, "Missing input plane to zoom" ] ; break ;
    }

    var dX = Math.abs( RIGHT - LEFT ), dY = Math.abs( TOP - BOTTOM );

    if ( _mode == 1 )
    {
        var midX = ( LEFT + RIGHT ) / 2.0, midY = ( TOP + BOTTOM ) / 2.0 ;
        LEFT = midX - ( dX / 4.0 ), RIGHT = midX + ( dX / 4.0 ), TOP = midY + ( dY / 4.0 ), BOTTOM = midY - ( dY / 4.0 );
    }
    else if ( _mode == 2 )
    {
        LEFT = LEFT - ( dX / 4.0 ), RIGHT = RIGHT + ( dX / 4.0 ), TOP = TOP + ( dY / 4.0 ), BOTTOM = BOTTOM - ( dY / 4.0 );
    }

    switch( _plane_type )
    {
        case Z_PLANE:
        _glob_zplaneLEFT = LEFT, _glob_zplaneRIGHT = RIGHT, _glob_zplaneTOP = TOP, _glob_zplaneBOTTOM = BOTTOM ;
        if ( _render ) return circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, _render, _question, _silent, _out_channel );
        break ;
        case W_PLANE:
        _glob_wplaneLEFT = LEFT, _glob_wplaneRIGHT = RIGHT, _glob_wplaneTOP = TOP, _glob_wplaneBOTTOM = BOTTOM ;
        if ( _render ) return circles_lib_canvas_render_wplane( null, wplane_sm, _glob_wplane_selected_items_array, NO, YES, _render, YES, _question, _silent, _out_channel );
        break ;
        case BIP_BOX:
        _glob_bipLEFT = LEFT, _glob_bipRIGHT = RIGHT, _glob_bipTOP = TOP, _glob_bipBOTTOM = BOTTOM ;
        var _sel_array = [] ;
        if ( _glob_bip_original_plane_data == Z_PLANE ) _sel_array = _glob_zplane_selected_items_array ;
        else if ( _glob_bip_original_plane_data == W_PLANE ) _sel_array = _glob_wplane_selected_items_array ;
        if ( _render ) return circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, _sel_array, YES, YES, _render, YES, NO, YES, _out_channel );
        break ;
        default: break ;
    }

    return circles_lib_coordinates_set_core( null, null, _plane_type, _silent, _render, NO, _out_channel );
}