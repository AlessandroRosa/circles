function circles_lib_coords_pickupyours_close_proc( _redraw, _question, _silent )
{
   _redraw = safe_int( _redraw, YES ), _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
   circles_lib_helper_div_remove();
   if ( _redraw == YES )
   {
     var _ret_chunk = null ;
     if ( _glob_target_plane.is_one_of( Z_PLANE, ALL_PLANES ) && circles_lib_count_items() > 0 )
     _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, _question, _silent, OUTPUT_SCREEN );
     else if ( _glob_target_plane.is_one_of( W_PLANE, ALL_PLANES ) )
     _ret_chunk_ask = circles_lib_canvas_process_ask(_question,_silent,W_PLANE,YES,YES,CHECK);

     var _ret_id = _ret_chunk_ask != null ? safe_int( _ret_chunk_ask[0], 0 ) : 0 ;
     var _ret_msg = _ret_chunk_ask != null ? _ret_chunk_ask[1] : _ERR_00_00 ;
   }
   else
   {
     if ( _glob_target_plane.is_one_of( Z_PLANE, ALL_PLANES ) )
     {
       _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, [ ROLE_WORK ], YES, YES, YES, _question, _silent, OUTPUT_SCREEN );
       var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
			 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "1Unknown error" ;
			 if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
		 }
     if ( _glob_target_plane.is_one_of( W_PLANE, ALL_PLANES ) )
     {
       _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, [ ROLE_WORK ], YES, YES, YES, _question, _silent, OUTPUT_SCREEN );
       var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
			 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "2Unknown error" ;
			 if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
		 }
   }

   _glob_zoom_rect = _glob_canvas_obj_ref = null ;
   _glob_zplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID ;
   circles_lib_statusbar_set_extras_icon( OTHER_NONE );
   circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
   circles_lib_statusbar_update_elements();
}

function circles_lib_coords_confirm_zoom( _plane_type, _canvas_role, _question, _silent )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _canvas_role = safe_int( _canvas_role, 0 );
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    var canvas = circles_lib_canvas_get_from_role( _plane_type, _canvas_role );
    if ( !is_rect( _glob_zoom_rect ) ) return NO ;
    if ( _plane_type == Z_PLANE )
    {
        _glob_zplaneLEFT = _glob_zoom_rect.x1 ; 
        _glob_zplaneTOP = _glob_zoom_rect.y1 ; 
        _glob_zplaneRIGHT = _glob_zoom_rect.x2 ; 
        _glob_zplaneBOTTOM = _glob_zoom_rect.y2 ; 
    }
    else if ( _plane_type == W_PLANE )
    {
        _glob_wplaneLEFT = _glob_zoom_rect.x1 ; 
        _glob_wplaneTOP = _glob_zoom_rect.y1 ; 
        _glob_wplaneRIGHT = _glob_zoom_rect.x2 ; 
        _glob_wplaneBOTTOM = _glob_zoom_rect.y2 ; 
    }
    else if ( _plane_type == BIP_BOX )
    {
        _glob_bipLEFT = _glob_zoom_rect.x1 ; 
        _glob_bipTOP = _glob_zoom_rect.y1 ; 
        _glob_bipRIGHT = _glob_zoom_rect.x2 ; 
        _glob_bipBOTTOM = _glob_zoom_rect.y2 ; 
    }
    
    circles_lib_coordinates_set_core( null, null, _plane_type, YES, YES );
    circles_lib_coords_pickupyours_close_proc( YES, _question, _silent );
    circles_lib_plugin_reload_basic_forms();
    return YES ;
}

function circles_lib_coords_pickupyours_open_proc( _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _glob_zplaneMOUSEprocSWITCH = _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) ? MOUSE_ZOOM_PROC_ID  : MOUSE_NO_PROC_ID  ;
    _glob_wplaneMOUSEprocSWITCH = _plane_type.is_one_of( W_PLANE, ALL_PLANES ) ? MOUSE_ZOOM_PROC_ID  : MOUSE_NO_PROC_ID  ;
    _plane_type = safe_int( _plane_type, _glob_target_plane != NO_PLANE ? _glob_target_plane : Z_PLANE );
    _glob_zoom_rect = null ;
    
    var _text = "1. Click the left mouse button to pick up the <b>left top corner</b> and hold it, while dragging the mouse pointer" ;
    circles_lib_helper_div_create( _plane_type, "Zoom", _text, 270, 90 );

    circles_lib_statusbar_set_extras_icon( OTHER_ZOOM );
    circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
    circles_lib_statusbar_update_elements();
}