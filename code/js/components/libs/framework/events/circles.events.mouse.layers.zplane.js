function Z_PLANE_work_canvas_onmouseover( obj, event )
{
    _glob_canvas_obj_ref = obj ;
    if ( _glob_zplane_canvas_timerID == null ) circles_lib_canvas_zplane_start_timer();
    if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_ZOOM_PROC_ID )
		$( "#"+_glob_zplane_work_layer_placeholder.id ).css('cursor','zoom-in');
    else if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_PICK_LASTPT_PROC_ID )
		$( "#" + _glob_zplane_work_layer_placeholder.id ).css('cursor', "url("+_glob_path_to_img+"icons/picker/picker.icon.01.20x20.png), auto" );
    else if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_DRAWDISKS_PROC_ID )
    {
       _glob_zplaneMOUSEleftBTNstatus = OFF, _glob_centerX = _glob_centerY = UNDET ;
			 $('#'+_glob_canvas_obj_ref.get_idcanvas()).css( 'cursor', "pointer" );
    }
}

function Z_PLANE_work_layer_onmousedown( obj, event )
{
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
      _glob_zplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID ;
      circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
      circles_lib_statusbar_update_elements();
      circles_lib_reset_coords();
      event.preventDefault();
      return false ;
      break;
      default: break ;
    }
       
		EVENTSstopDISPATCHING( event );
    if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_ZOOM_PROC_ID )
    {
      if ( !is_rect( _glob_zoom_rect ) )
      {
        _glob_zoom_rect = new rect();
        _glob_zoomSTARTpt = zplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
        $("#ZOOMINGREGIONlabel").html( "2. Finally, release the mouse button as the zoom region fits as desired" );
      }
    }
    else if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_TANGENTCIRCLE_PROC_ID )
    {
      // construct a tangent circle to the selected one
      // it's blank now for further use
    }
    else if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_DRAWDISKS_PROC_ID )
    {
      _glob_centerX = _glob_coords_array["x"], _glob_centerY = _glob_coords_array["y"] ;
      _glob_zplaneMOUSEleftBTNstatus = ON ;
    }
    else if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_SELECTDISKS_PROC_ID )
    {
      if ( !is_rect( _glob_zoom_rect ) )
      {
         _glob_zoom_rect = new rect();
         _glob_zoomSTARTpt = zplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
      }
    }
    else if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_PICK_POINTS_PROC_ID )
    {
      var _pt = zplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
      var _is_dupl = circles_lib_figures_find_duplicates( FIGURE_CLASS_POINT, Z_PLANE, _pt, _glob_storage['figures'] );
      if ( !_is_dupl )
      {
         var _tmp_chunk = [];
         _tmp_chunk['class'] = FIGURE_CLASS_POINT ;
         _tmp_chunk['obj'] = _pt ;
         _tmp_chunk['plane'] = Z_PLANE ;
         _tmp_chunk['border'] = YES ;
         _tmp_chunk['bordercolor'] = DEFAULT_INTERSECTION_POINT_BORDER_COLOR ;
         _tmp_chunk['fill'] = YES ;
         _tmp_chunk['fillcolor'] = DEFAULT_INTERSECTION_POINT_INTERIOR_COLOR ;
         _tmp_chunk['opacity'] = DEFAULT_MAX_OPACITY ;
         _tmp_chunk['bordersize'] = 2 ;
         _tmp_chunk['enabled'] = YES ;
         _tmp_chunk['myhash'] = "rec" + ( safe_size( _glob_storage['figures'], UNDET ) );
         _tmp_chunk['label'] = "" ;
         _tmp_chunk['propertiesmask'] = 0 ;
         _glob_storage['figures'].push( _tmp_chunk );
         circles_lib_draw_point( _glob_canvas_obj_ref.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm,
                _pt.x, _pt.y, YES, DEFAULT_INTERSECTION_POINT_BORDER_COLOR, YES, DEFAULT_INTERSECTION_POINT_INTERIOR_COLOR,
                _tmp_chunk['bordersize'], 3, DEFAULT_MAX_OPACITY, 0 );
      }
    }
}

function Z_PLANE_work_canvas_onmousemove( obj, event )
{
    _glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
    _glob_mouse_curr = [ _glob_mouse_x, _glob_mouse_y ] ;
    if ( _glob_zplane_coords_map == CANVAS_CARTESIAN_MAP )
    _mouse_event_curr_pt = zplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y ) ;
    else _mouse_event_curr_pt.acquire_from_coords( _glob_mouse_x, _glob_mouse_y ) ;

    $("#ZplaneX").html( _mouse_event_curr_pt.x ), $("#ZplaneY").html( _mouse_event_curr_pt.y );

    if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_DRAGDISKS_PROC_ID && _glob_disk_sel_locked )
    {
         if ( _glob_disk_sel_index == UNFOUND && is_item_obj( _glob_seeds_array[_glob_disk_sel_index] ) )
         {
             _glob_seeds_array[_glob_disk_sel_index].screen_circle.center = new point( _glob_mouse_x, _glob_mouse_y );
             circles_lib_draw_all_screen_disks( _glob_zplane_rendering_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, null, YES );
         }
         else if ( is_item_obj( _glob_seeds_array[_glob_disk_sel_index] ) )
         {
             _glob_mouse_dx = _glob_mouse_curr[0] - _glob_mouse_prev[0] ;
             _glob_mouse_dy = _glob_mouse_curr[1] - _glob_mouse_prev[1] ;
             _mouse_event_dx = _mouse_event_curr_pt.x - _mouse_event_prev_pt.x ;
             _mouse_event_dy = _mouse_event_curr_pt.y - _mouse_event_prev_pt.y ;

             _glob_mouse_prev.x = _glob_mouse_x ;
             _glob_mouse_prev.y = _glob_mouse_y ;
             _mouse_event_prev_pt.x = _mouse_event_curr_pt.x ;
             _mouse_event_prev_pt.y = _mouse_event_curr_pt.y ;

             for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
             {
                _glob_seeds_array[ _glob_zplane_selected_items_array[_i] ].screen_circle.center.x += _glob_mouse_dx ;
                _glob_seeds_array[ _glob_zplane_selected_items_array[_i] ].screen_circle.center.y += _glob_mouse_dy ;
             }

             circles_lib_draw_all_screen_disks( _glob_zplane_rendering_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, _glob_zplane_selected_items_array, YES );
         }
    }
	  else if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_DRAWDISKS_PROC_ID && _glob_zplaneMOUSEleftBTNstatus == ON )
    {
        _mouse_event_disk_sqrt_radius = Math.pow( _glob_mouse_x - _glob_centerX, 2 ) + Math.pow( _glob_mouse_y - _glob_centerY, 2 );
        _glob_centerRADIUS = Math.sqrt( _mouse_event_disk_sqrt_radius );
        _glob_centerRADIUS = attempt_to_closest_int( _glob_centerRADIUS, _glob_accuracy );
                          
        _mouse_event_context = obj.getContext( _glob_canvas_ctx_2D_mode );
        _mouse_event_dx = ( _glob_currentX != UNDET ? _glob_currentX : _glob_mouse_x ) - _glob_centerX ;
        _mouse_event_dy = ( _glob_currentY != UNDET ? _glob_currentY : _glob_mouse_y ) - _glob_centerY ;
                
        _glob_persistent_vars['dragdisk_radius'] = Math.sqrt( Math.pow( _glob_centerX - _glob_mouse_x, 2 ) + Math.pow( _glob_centerY - _glob_mouse_y, 2 ) ) ;
        if ( _glob_currentX != UNDET && _glob_currentY != UNDET )
        {
            _mouse_event_rect_left = _glob_centerX - _glob_persistent_vars['dragdisk_radius'];
            _mouse_event_rect_top = _glob_centerY - _glob_persistent_vars['dragdisk_radius'];
            _mouse_event_rect_width = 2.3 * _glob_persistent_vars['dragdisk_radius'];
            _mouse_event_rect_height = 2.3 * _glob_persistent_vars['dragdisk_radius'];
            _mouse_event_context.clearRect( _mouse_event_rect_left - 10,
                                 _mouse_event_rect_top - 10,
                                 _mouse_event_rect_width + 10,
                                 _mouse_event_rect_height + 10 );
        }

        _mouse_event_context.beginPath();
        _mouse_event_context.arc( _glob_centerX, _glob_centerY, _glob_persistent_vars['dragdisk_radius'], 0, CIRCLES_TWO_PI );
        _mouse_event_context.strokeStyle = '#8FCBF1';
        _mouse_event_context.stroke();
        _mouse_event_context.closePath();

        // plot center
        _mouse_event_context.beginPath();
        _mouse_event_context.lineWidth = 2 ;
        _mouse_event_context.arc( _glob_centerX, _glob_centerY, 3, 0, CIRCLES_TWO_PI );
        _mouse_event_context.fillStyle = 'white';
        _mouse_event_context.fill();
        _mouse_event_context.strokeStyle = "#538FB5" ;
        _mouse_event_context.stroke();
        _mouse_event_context.closePath();

        _glob_currentX = _glob_mouse_x, _glob_currentY = _glob_mouse_y ;
    }
    else if ( _glob_zplaneMOUSEprocSWITCH.is_one_of( MOUSE_ZOOM_PROC_ID, MOUSE_SELECTDISKS_PROC_ID ) &&
              is_rect( _glob_zoom_rect ) && is_html_canvas( obj ) )
    {
        _glob_zoomENDpt = _mouse_event_curr_pt ;
        _glob_zoom_rect.x1 = _glob_zoomSTARTpt.x ;  _glob_zoom_rect.y1 = _glob_zoomSTARTpt.y ;
        _glob_zoom_rect.x2 = _glob_zoomENDpt.x ;    _glob_zoom_rect.y2 = _glob_zoomENDpt.y ;
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
        // force to be a square if zooming
        if ( _mouse_event_dx != _mouse_event_dy && _glob_zplaneMOUSEprocSWITCH == MOUSE_ZOOM_PROC_ID )
        {
            _glob_zoom_rect.x2 = _glob_zoom_rect.x1 + _mouse_event_zoom_rect_side_x * _mouse_event_zoom_rect_sign_x ;
            _glob_zoom_rect.y2 = _glob_zoom_rect.y1 + _mouse_event_zoom_rect_side_y * _mouse_event_zoom_rect_sign_y ;
        }
                   
        _glob_zoom_rect.correct();
        _mouse_event_context = obj.getContext( _glob_canvas_ctx_2D_mode );
        circles_lib_canvas_clean( obj );
        circles_lib_draw_polyline( _mouse_event_context, zplane_sm, _glob_zoom_rect.corners(), _glob_zplaneMOUSEprocSWITCH == MOUSE_ZOOM_PROC_ID ? "lime" : "cadetblue", "", 1, YES, DEFAULT_MAX_OPACITY, UNDET, 0, YES );
    }
}

function Z_PLANE_work_canvas_onclick( obj, event )
{
		EVENTSstopDISPATCHING( event );
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
    if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_TANGENTCIRCLE_PROC_ID ) // construct a tangent circle to the selected one
    {
        if ( _glob_disk_sel_index != UNDET )
        {
            CIRCLESformsCONSTRUCTTANGENTCIRCLEprocess( _glob_mouse_x, _glob_mouse_y );
            _glob_disk_sel_index = UNDET ;
	          _glob_disk_sel_locked = NO ;
				    _glob_zplane_selected_items_array = [];
					  _glob_screencircles_sel_array.flush();
            circles_lib_helper_div_remove();
        }
    }
}

function Z_PLANE_work_canvas_ondblclick( obj, event )
{
		EVENTSstopDISPATCHING( event );
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    var X = _glob_coords_array["x"], Y = _glob_coords_array["y"], _pt = zplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
    _glob_mouse_prev = [ _glob_mouse_x, _glob_mouse_y ] ;
    _mouse_event_prev_pt = zplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
	  _glob_disk_sel_index = circles_lib_complexdisk_find_index_from_pt( _pt );
    if ( _glob_disk_sel_index != UNDET )
    {
        var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
 				if ( !_glob_zplane_selected_items_array.includes( _glob_disk_sel_index ) )
				{
						if ( !_glob_shift_key ) { _glob_zplane_selected_items_array = []; circles_lib_helper_div_remove(); }
						_glob_zplane_selected_items_array.push( _glob_disk_sel_index );
				}
				else _glob_zplane_selected_items_array.delete_entry( _glob_disk_sel_index );

		 	  _glob_screencircles_sel_array.flush();
        var _l = safe_size( _glob_zplane_selected_items_array, 0 );

			  for( var _i = 0 ; _i < _l ; _i++ )
			  _glob_screencircles_sel_array.push( _items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle );

        var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, OUTPUT_SCREEN );
        if ( circles_lib_plugin_find_index( { subset : "forms", base_id : "edit.disk" }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_SUBSET ) != UNFOUND )
				circles_lib_plugin_dispatcher_unicast_message( 'edit.disk', "forms", 1 );
    }
    else
    {
        _glob_disk_sel_locked = NO ;
 				_glob_screencircles_sel_array.flush();
 				_glob_zplane_selected_items_array = [];
 	      _glob_zplaneMOUSEleftBTNstatus = OFF ;
 	      _glob_zplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID ;
        circles_lib_helper_div_remove();
        var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, OUTPUT_SCREEN );
        circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
        circles_lib_statusbar_update_elements();
    }
}

function Z_PLANE_work_canvas_onmouseup( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    if ( $('#'+_glob_canvas_obj_ref.get_idcanvas()).css( 'cursor' ) != "default" )
    $('#'+_glob_canvas_obj_ref.get_idcanvas()).css( 'cursor', "default" );

    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;

    switch( event.which )
    {
      case 1: // left btn
      break;
      case 2: // mid btn
      break;
      case 3: // right btn
      _glob_zplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID ;
      circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
      circles_lib_statusbar_update_elements();
      circles_lib_reset_coords();
      event.preventDefault();
      return false ;
      break;
      default: break ;
    }
 
    if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_DRAWDISKS_PROC_ID &&
         _glob_zplaneMOUSEleftBTNstatus && _glob_centerRADIUS > 0 )
    {
      // x,y and radius are not mapped to the complex plane,
      // just given according to the canvas coordinates
      var center = new point( _glob_centerX, _glob_centerY );
      var c = new circle( center, _glob_centerRADIUS, YES, NO, DEFAULT_DRAW_SEED_COLOR, DEFAULT_FILL_SEED_COLOR );
      var _items_array =_glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
      var _ret_chunk = circles_lib_screendisk_add( _items_array, c, YES );
      var _last_index = _ret_chunk[2], _a = [];
      if ( _last_index != UNDET ) _a.push( _last_index );
      _glob_disk_sel_index = _last_index ;
               
      circles_lib_canvas_clean( obj );
      var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, OUTPUT_SCREEN );
      _glob_dict_create = _glob_items_to_init = YES ;
      if ( _glob_method == METHOD_NONE )
      {
         circles_lib_method_set( METHOD_INVERSION );
         circles_lib_set_target_plane( W_PLANE ) ;
      }
      if ( _glob_drawentity == DRAWENTITY_NONE ) _glob_drawentity = DRAWENTITY_ISOMETRIC_CIRCLE ;
      circles_lib_plugin_dispatcher_multicast_message( POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL );
    }
    else if ( _glob_zplaneMOUSEprocSWITCH.is_one_of( MOUSE_ZOOM_PROC_ID, MOUSE_SELECTDISKS_PROC_ID ) &&
              is_rect( _glob_zoom_rect ) )
    {
         var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
         var complex_pt = zplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
         _glob_zoomENDpt = complex_pt ;

         _glob_zoom_rect.x1 = _glob_zoomSTARTpt.x ;   _glob_zoom_rect.y1 = _glob_zoomSTARTpt.y ;
         _glob_zoom_rect.x2 = _glob_zoomENDpt.x ;     _glob_zoom_rect.y2 = _glob_zoomENDpt.y ;

         var dX = _glob_zoom_rect.width(), _signX = _glob_zoomENDpt.x < _glob_zoomSTARTpt.x ? -1 : 1 ;
         var dY = _glob_zoom_rect.height(), _signY = _glob_zoomENDpt.y > _glob_zoomSTARTpt.y ? 1 : -1 ;
         if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_ZOOM_PROC_ID )
         {
             // zoom region shall be a square, if zooming
             var side = Math.max( dX, dY );
             // correction
             if ( dX != dY )
             {
                 _glob_zoom_rect.x2 = _glob_zoom_rect.x1 + side * _signX ;
                 _glob_zoom_rect.y2 = _glob_zoom_rect.y1 + side * _signY ;
             }
         }

         _glob_zoom_rect.correct();
         var _canvas_role = safe_int( obj.get_role_id(), UNDET );
         if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_ZOOM_PROC_ID )
         {
           alert_plug_label( ALERT_YES, "Yes" );
           alert_plug_label( ALERT_NO, "No" );
           alert_plug_fn( ALERT_YES, "alertCLOSE();circles_lib_coords_confirm_zoom( Z_PLANE, "+_canvas_role+", NO, YES );circles_lib_helper_div_remove();" );
           alert_plug_fn( ALERT_NO, "alertCLOSE();circles_lib_helper_div_remove();circles_lib_coords_pickupyours_close_proc(NO,NO,YES);" )
           alert_set_btns_width( "70px" ); alert_set_btns_height( "30px" ) ;
           alert_set_fontsize( "12pt" ) ;

           var _canvas_thumb_w = 190, _canvas_thumb_h = Math.ceil( _canvas_thumb_w / _glob_interface_aspect_ratio ) ;
           var HTMLcode = "<table>" ;
           HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
           HTMLcode += "<tr><td VALIGN=\"top\" COLSPAN=\"3\" ALIGN=\"center\" STYLE=\"font-size:12pt;\">Do you confirm to zoom the selected region ?</td>" ;
           HTMLcode += "<tr><td HEIGHT=\"18\"></td></tr>" ;
           HTMLcode += "<tr>" ;
           HTMLcode += "<td VALIGN=\"top\"><table><tr>" ;
           HTMLcode += "<td WIDTH=\"24\"></td>" ;
           HTMLcode += "<td VALIGN=\"top\">" ;
           HTMLcode += "<table>" ;
           HTMLcode += "<tr><td STYLE=\"font-size:10pt;\">Left</td></tr>" ;
           HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:blue;\">"+_glob_zoomSTARTpt.x+"</td></tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
           HTMLcode += "<tr><td STYLE=\"font-size:10pt;\">Top</td></tr>" ;
           HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:blue;\">"+_glob_zoomSTARTpt.y+"</td></tr>" ;
           HTMLcode += "</table>" ;
           HTMLcode += "</td>" ;

           HTMLcode += "<td VALIGN=\"top\" STYLE=\"border:1px solid #EAEAEA;padding:3px;\"><CANVAS ID=\"ZOOMthumbCANVAS\" WIDTH=\""+_canvas_thumb_w+"\" HEIGHT=\""+_canvas_thumb_h+"\" STYLE=\"width:"+_canvas_thumb_w+"px;height:"+_canvas_thumb_h+"px;\"></CANVAS></td>" ;

           HTMLcode += "<td VALIGN=\"bottom\">" ;
           HTMLcode += "<table>" ;
           HTMLcode += "<tr><td STYLE=\"font-size:10pt;\">Right</td></tr>" ;
           HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:blue;\">"+_glob_zoomENDpt.x+"</td></tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
           HTMLcode += "<tr><td STYLE=\"font-size:10pt;\">Bottom</td></tr>" ;
           HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:blue;\">"+_glob_zoomENDpt.y+"</td></tr>" ;
           HTMLcode += "</table>" ;
           HTMLcode += "</td>" ;

           HTMLcode += "</tr></table></td>" ;
           HTMLcode += "</tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
           HTMLcode += "</table>" ;

           alert_msg( ALERT_YESNO | ALERT_QUESTION, HTMLcode, _glob_app_title + " - " + circles_lib_plane_def_get( Z_PLANE ), 640 );
           var screen_left_top_pt = zplane_sm.from_cartesian_to_client( _glob_zoom_rect.x1, _glob_zoom_rect.y1 );
           var screen_right_bottom_pt = zplane_sm.from_cartesian_to_client( _glob_zoom_rect.x2, _glob_zoom_rect.y2 );
           circles_lib_canvas_blowup( [ _glob_zplane_grid_layer_placeholder, _glob_zplane_rendering_layer_placeholder,
                                        _glob_zplane_work_layer_placeholder, _glob_zplane_freedraw_layer_placeholder ],
                               $('#ZOOMthumbCANVAS').get(0),
                               screen_left_top_pt.x, screen_left_top_pt.y,
                               screen_right_bottom_pt.x - screen_left_top_pt.x,
                               screen_right_bottom_pt.y - screen_left_top_pt.y );
         }
         else if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_SELECTDISKS_PROC_ID )
         {
             var _sd_n = circles_lib_count_seeds(), ITEM ;
             if ( _sd_n > 0 )
             {
                 _glob_zplane_selected_items_array = [];
                 for( var _i = 0 ; _i < _sd_n ; _i++ )
                 {
                     ITEM = _items_array[_i] ;
                     if ( is_item_obj( ITEM ) )
                     {
                         if ( is_circle( ITEM.complex_circle ) )
                         {
                             if ( _glob_zoom_rect.includes_pt( ITEM.complex_circle.center.x, ITEM.complex_circle.center.y ) )
                             _glob_zplane_selected_items_array.push( _i );
                         }
                     }
                 }

                 var _text = "1. Hold shift + arrows keys or ctrl down + mouse to drag selection" ;
                     _text += "<br>2. Release shift to drop current selection" ;
                     _text += "<br>3. Push canc to delete selection" ;
                 circles_lib_helper_div_create( Z_PLANE, "Disks selection", _text, 270, 110 );

                 circles_lib_canvas_clean( _glob_zplane_rendering_layer_placeholder );
                 var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, OUTPUT_SCREEN );
             }
         }

         _glob_zplaneMOUSEleftBTNstatus = OFF ;
         circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
         circles_lib_statusbar_update_elements();
    }
}

function Z_PLANE_work_canvas_onmouseout( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    if ( $('#'+_glob_canvas_obj_ref.get_idcanvas()).css( 'cursor' ) != "default" )
    $('#'+_glob_canvas_obj_ref.get_idcanvas()).css( 'cursor', "default" );

    if ( _glob_zplaneMOUSEprocSWITCH.is_one_of( MOUSE_TANGENTCIRCLE_PROC_ID ) )
    {
    }
    else if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_DRAWDISKS_PROC_ID )
    {
    
    }
    else if ( _glob_zplaneMOUSEprocSWITCH == MOUSE_DRAGDISKS_PROC_ID )
    {
        var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    		var ITEM = _items_array[_glob_disk_sel_index] ;
    		if ( is_item_obj( ITEM ) )
    		{
						circles_lib_complexdisk_update( ITEMS_SWITCH_SEEDS, ITEM.screen_circle, _glob_disk_sel_index );
						_glob_disk_sel_index = UNDET ;
		        _glob_disk_sel_locked = NO ;
		        _glob_zplane_selected_items_array = [];
						_glob_screencircles_sel_array.flush();
			      _glob_zplaneMOUSEleftBTNstatus = OFF ;
		        circles_lib_helper_div_remove();
				}
		}

    _glob_zplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID ;
    obj.style.cursor = "default" ;
    circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
    circles_lib_statusbar_update_elements();

    $("#ZplaneX").html( "" ), $("#ZplaneY").html( "" );
    var _bound_rect = obj.getBoundingClientRect(), _rect = new rect();
    _rect.width_height_constructor( _bound_rect.left, _bound_rect.top, _bound_rect.width, _bound_rect.height );
    _glob_coords_array = circles_lib_events_get_mouse_pos_abs( event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
    if ( !_rect.includes_pt( _glob_mouse_x, _glob_mouse_y ) )
    {
         circles_lib_canvas_zplane_stop_timer();
         circles_lib_canvas_zplane_hide_bar();
    }
}