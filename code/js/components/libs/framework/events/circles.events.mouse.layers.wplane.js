function W_PLANE_work_canvas_onmouseover( obj, event )
{
    _glob_canvas_obj_ref = obj ;
		if ( _glob_wplane_canvas_timerID == null ) circles_lib_canvas_wplane_start_timer();
    if ( _glob_wplaneMOUSEprocSWITCH == MOUSE_ZOOM_PROC_ID )
		$( "#"+_glob_wplane_work_layer_placeholder.id ).css('cursor','zoom-in');
    else if ( _glob_wplaneMOUSEprocSWITCH == MOUSE_PICK_LASTPT_PROC_ID )
		$( "#" + _glob_wplane_work_layer_placeholder.id ).css('cursor', "url("+_glob_path_to_img+"icons/picker/picker.icon.01.20x20.png), auto" );
    else $( "#" + _glob_wplane_work_layer_placeholder.id ).css('cursor','default');
}

function W_PLANE_work_canvas_onmouseout( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    if ( $('#'+_glob_canvas_obj_ref.get_idcanvas()).css( 'cursor' ) != "default" )
    $('#'+_glob_canvas_obj_ref.get_idcanvas()).css( 'cursor', "default" );

    $("#WplaneX").html( "" ), $("#WplaneY").html( "" );
    var _bound_rect = obj.getBoundingClientRect(), _rect = new rect();
    _rect.width_height_constructor( _bound_rect.left, _bound_rect.top, _bound_rect.width, _bound_rect.height );
    _glob_coords_array = circles_lib_events_get_mouse_pos_abs( event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
    if ( !_rect.is_pt_inside( _glob_mouse_x, _glob_mouse_y ) )
    {
       circles_lib_canvas_wplane_stop_timer();
       circles_lib_canvas_wplane_hide_bar();
    }
}

function W_PLANE_work_canvas_onmousedown( obj, event )
{
		EVENTSstopDISPATCHING( event );
    _glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
    switch( event.which )
    {
       case 1: // left btn
       break;
       case 2: // mid btn
       break;
       case 3: // right btn
       _glob_wplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID  ;
       obj.style.cursor = "default" ;
       circles_lib_reset_coords();
       break;
       default: break ;
    }

    if ( _glob_wplaneMOUSEprocSWITCH == MOUSE_PICK_LASTPT_PROC_ID )
    {
        var _pt = wplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
        $( "#CIRCLESgeneraloptionsLASTPTcoordsEDIT" ).val( ( new complex( _pt.x, _pt.y ) ).formula() );
    }
    else if ( _glob_wplaneMOUSEprocSWITCH == MOUSE_ZOOM_PROC_ID )
    {
	     if ( !is_rect( _glob_zoom_rect ) )
	     {
	        _glob_zoom_rect = new rect();
	        _glob_zoomSTARTpt = wplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
	        $("#ZOOMINGREGIONlabel").html( "2. Finally, release the mouse button as the zoom region fits as desired" );
	     }
    }
    else if ( _glob_wplaneMOUSEprocSWITCH == MOUSE_PICK_POINTS_PROC_ID )
    {
       var _pt = wplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
       var _is_dupl = circles_lib_figures_find_duplicates( FIGURE_CLASS_POINT, W_PLANE, _pt, _glob_storage['figures'] );
       if ( !_is_dupl )
       {
           var _tmp_chunk = [];
           _tmp_chunk['class'] = FIGURE_CLASS_POINT ;
           _tmp_chunk['obj'] = _pt ;
           _tmp_chunk['plane'] = W_PLANE ;
           _tmp_chunk['draw'] = YES ;
           _tmp_chunk['bordercolor'] = DEFAULT_INTERSECTION_POINT_BORDER_COLOR ;
           _tmp_chunk['fill'] = YES ;
           _tmp_chunk['fillcolor'] = DEFAULT_INTERSECTION_POINT_INTERIOR_COLOR ;
           _tmp_chunk['opacity'] = DEFAULT_MAX_OPACITY ;
           _tmp_chunk['bordersize'] = 2 ;
           _tmp_chunk['enabled'] = YES ;
           _tmp_chunk['myhash'] = "rec" + ( safe_size( _glob_storage['figures'], UNDET ) + 1 );
           _tmp_chunk['label'] = "" ;
           _tmp_chunk['propertiesmask'] = 0 ;
           _glob_storage['figures'].push( _tmp_chunk );
           circles_lib_draw_point( _glob_canvas_obj_ref.getContext( _glob_canvas_ctx_2D_mode ), wplane_sm, _pt.x, _pt.y,
                             YES, DEFAULT_INTERSECTION_POINT_BORDER_COLOR, YES, DEFAULT_INTERSECTION_POINT_INTERIOR_COLOR,
                             _tmp_chunk['bordersize'], 3, DEFAULT_MAX_OPACITY, 0 );
       }
    }
}
                                                              
function W_PLANE_work_canvas_onmousemove( obj, event )
{
    _glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
    if ( _glob_wplane_coords_map == CANVAS_CARTESIAN_MAP )
    _mouse_event_curr_pt = wplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y ) ;
    else _mouse_event_curr_pt.acquire_from_coords( _glob_mouse_x, _glob_mouse_y ) ;
    $("#WplaneX").html( _mouse_event_curr_pt.x );
    $("#WplaneY").html( _mouse_event_curr_pt.y );

    if ( _glob_wplaneMOUSEprocSWITCH == MOUSE_ZOOM_PROC_ID )
    {
       if ( is_rect( _glob_zoom_rect ) )
       {
          _glob_zoomENDpt = wplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
          _glob_zoom_rect.x1 = _glob_zoomSTARTpt.x ;   _glob_zoom_rect.y1 = _glob_zoomSTARTpt.y ;
          _glob_zoom_rect.x2 = _glob_zoomENDpt.x ;     _glob_zoom_rect.y2 = _glob_zoomENDpt.y ;
          // zoom region shall be a square
          _mouse_event_dx = _glob_zoom_rect.width();      _mouse_event_zoom_rect_sign_x = _glob_zoomENDpt.x < _glob_zoomSTARTpt.x ? -1 : 1 ;
          _mouse_event_dy = _glob_zoom_rect.height();     _mouse_event_zoom_rect_sign_y = _glob_zoomENDpt.y > _glob_zoomSTARTpt.y ? 1 : -1 ;
          if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
          _mouse_event_zoom_rect_side_x = _mouse_event_zoom_rect_side_y = Math.max( _mouse_event_dx, _mouse_event_dy );
          else
          {
             _mouse_event_zoom_rect_side_x = _mouse_event_dx ;
             _mouse_event_zoom_rect_side_y = _mouse_event_zoom_rect_side_x / _glob_interface_aspect_ratio ;
          }
          // correction
          if ( _mouse_event_dx != _mouse_event_dy )
          {
             _glob_zoom_rect.x2 = _glob_zoom_rect.x1 + _mouse_event_zoom_rect_side_x * _mouse_event_zoom_rect_sign_x ;
             _glob_zoom_rect.y2 = _glob_zoom_rect.y1 + _mouse_event_zoom_rect_side_y * _mouse_event_zoom_rect_sign_y ;
          }
                       
          _glob_zoom_rect.correct();
          circles_lib_canvas_clean( obj );
          _mouse_event_context = obj.getContext( _glob_canvas_ctx_2D_mode );
          circles_lib_draw_polyline( _mouse_event_context, wplane_sm, _glob_zoom_rect.corners(), "lime", "", 1, YES, DEFAULT_MAX_OPACITY, UNDET, 0, YES );
       }
    }
}

function W_PLANE_work_canvas_onmouseup( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    if ( $('#'+_glob_canvas_obj_ref.get_idcanvas()).css( 'cursor' ) != "default" )
    $('#'+_glob_canvas_obj_ref.get_idcanvas()).css( 'cursor', "default" );

    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;

    if ( _glob_wplaneMOUSEprocSWITCH == MOUSE_ZOOM_PROC_ID )
    {
       if ( is_rect( _glob_zoom_rect ) )
       {
           _glob_zoomENDpt = wplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
           _glob_zoom_rect.x1 = _glob_zoomSTARTpt.x ;   _glob_zoom_rect.y1 = _glob_zoomSTARTpt.y ;
           _glob_zoom_rect.x2 = _glob_zoomENDpt.x ;     _glob_zoom_rect.y2 = _glob_zoomENDpt.y ;
           // zoom region shall be a square
           _mouse_event_dx = _glob_zoom_rect.width();    _mouse_event_zoom_rect_sign_x = _glob_zoomENDpt.x < _glob_zoomSTARTpt.x ? -1 : 1 ;
           _mouse_event_dy = _glob_zoom_rect.height();   _mouse_event_zoom_rect_sign_y = _glob_zoomENDpt.y > _glob_zoomSTARTpt.y ? 1 : -1 ;

           if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
           _mouse_event_zoom_rect_side_x = _mouse_event_zoom_rect_side_y = Math.max( _mouse_event_dx, _mouse_event_dy );
           else
           {
              _mouse_event_zoom_rect_side_x = _mouse_event_dx ;
              _mouse_event_zoom_rect_side_y = _mouse_event_zoom_rect_side_x / _glob_interface_aspect_ratio ;
           }
           // correction
           if ( _mouse_event_dx != _mouse_event_dy )
           {
              _glob_zoom_rect.x2 = _glob_zoom_rect.x1 + _mouse_event_zoom_rect_side_x * _mouse_event_zoom_rect_sign_x ;
              _glob_zoom_rect.y2 = _glob_zoom_rect.y1 + _mouse_event_zoom_rect_side_y * _mouse_event_zoom_rect_sign_y ;
           }
                    
           circles_lib_canvas_clean( obj );
           _mouse_event_context = obj.getContext( _glob_canvas_ctx_2D_mode );
           circles_lib_draw_polyline( _mouse_event_context, wplane_sm, _glob_zoom_rect.corners(), "lime", "", 1, YES, DEFAULT_MAX_OPACITY, UNDET, 0, YES );

           alert_plug_label( ALERT_YES, "Yes" );
           alert_plug_label( ALERT_NO, "No" );
           alert_plug_fn( ALERT_YES, "alertCLOSE();circles_lib_coords_confirm_zoom( W_PLANE, "+safe_int( obj.get_role_id(), ROLE_NONE )+", NO, YES );" );
           alert_plug_fn( ALERT_NO, "circles_lib_coords_pickupyours_close_proc(NO);alertCLOSE();" )
           alert_set_btns_width( "70px" );

           var _canvas_thumb_w = 140, _canvas_thumb_h = Math.ceil( _canvas_thumb_w / _glob_interface_aspect_ratio ) ;
           var HTMLcode = "<table>" ;
           HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
           HTMLcode += "<tr><td VALIGN=\"top\" COLSPAN=\"3\" ALIGN=\"center\">Zoom this region ?</td>" ;
           HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
           HTMLcode += "<tr>" ;
           HTMLcode += "<td VALIGN=\"top\"><table><tr>" ;
           HTMLcode += "<td VALIGN=\"top\" STYLE=\"border:1px solid #EAEAEA;padding:3px;\"><CANVAS ID=\"ZOOMthumbCANVAS\" WIDTH=\""+_canvas_thumb_w+"\" HEIGHT=\""+_canvas_thumb_h+"\" STYLE=\"width:"+_canvas_thumb_w+"px;height:"+_canvas_thumb_h+"px;\"></CANVAS></td>" ;
           HTMLcode += "<td WIDTH=\"24\"></td>" ;
           HTMLcode += "<td VALIGN=\"top\"><table>" ;
           HTMLcode += "<tr><td>Left</td><td WIDTH=\"5\"></td><td>"+_glob_zoomSTARTpt.x+"</td></tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
           HTMLcode += "<tr><td>Top</td><td WIDTH=\"5\"></td><td>"+_glob_zoomSTARTpt.y+"</td></tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
           HTMLcode += "<tr><td>Right</td><td WIDTH=\"5\"></td><td>"+_glob_zoomENDpt.x+"</td></tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
           HTMLcode += "<tr><td>Bottom</td><td WIDTH=\"5\"></td><td>"+_glob_zoomENDpt.y+"</td></tr>" ;
           HTMLcode += "</table></td>" ;
           HTMLcode += "</tr></table></td>" ;
           HTMLcode += "</tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
           HTMLcode += "</table>" ;

           alert_msg( ALERT_YESNO | ALERT_QUESTION, HTMLcode, _glob_app_title + " - " + circles_lib_plane_def_get( W_PLANE ), 430 );
           var screen_left_top_pt = wplane_sm.from_cartesian_to_client( _glob_zoom_rect.x1, _glob_zoom_rect.y1 );
           var screen_right_bottom_pt = wplane_sm.from_cartesian_to_client( _glob_zoom_rect.x2, _glob_zoom_rect.y2 );
           circles_lib_canvas_blowup( _glob_wplane_rendering_layer_placeholder,
                               $('#ZOOMthumbCANVAS').get(0),
                               screen_left_top_pt.x, screen_left_top_pt.y,
                               Math.abs( screen_left_top_pt.x - screen_right_bottom_pt.x ),
                               Math.abs( screen_left_top_pt.y - screen_right_bottom_pt.y ) );
       }
    }
}

function W_PLANE_work_canvas_onclick( obj, event )
{
		EVENTSstopDISPATCHING( event );
    _glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
}