function Z_PLANE_rendering_layer_canvas_play_inversion_onmousemove( obj, event )
{
      _glob_canvas_obj_ref = obj ;
      _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
      _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
      _mouse_event_curr_pt = zplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
      var _mm, _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
      if ( _glob_disk_sel_index != UNDET )
      {
           circles_lib_canvas_clean( _glob_zplane_rendering_canvas_placeholder );
           circles_lib_grid_draw( _glob_zplane_grid_canvas_placeholder, zplane_sm, Z_PLANE, YES, _glob_ticks_count );
           circles_lib_draw_all_complex_disks( _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, [ _glob_disk_sel_index ], NO );
           
           _mm = circles_lib_items_create_from_disk( 2, _items_array[_glob_disk_sel_index].complex_circle );

           _glob_inversion_circle_pre.center.x = _mouse_event_curr_pt.x ;
           _glob_inversion_circle_pre.center.y = _mouse_event_curr_pt.y ;
           _glob_inversion_circle_pre.radius = 0.2 ;
           _glob_inversion_circle_post = _mm.invert_circle( _glob_inversion_circle_pre );

           _glob_play_inversion_screen_pt = zplane_sm.from_cartesian_to_client( _glob_inversion_circle_pre.center.x, _glob_inversion_circle_pre.center.y );
           _glob_play_inversion_screen_pt1 = zplane_sm.from_cartesian_to_client( _glob_inversion_circle_pre.center.x + _glob_inversion_circle_pre.radius, _glob_inversion_circle_pre.center.y );
           _glob_play_inversion_dx = _glob_play_inversion_screen_pt.x - _glob_play_inversion_screen_pt1.x, dY = _glob_play_inversion_screen_pt.y - _glob_play_inversion_screen_pt1.y ;
           _glob_play_inversion_radius = Math.sqrt( _glob_play_inversion_dx * _glob_play_inversion_dx + dY * dY );

           _glob_play_inversion_screen_pt_ret = zplane_sm.from_cartesian_to_client( _glob_inversion_circle_post.center.x, _glob_inversion_circle_post.center.y );
           _glob_play_inversion_screen_pt1_ret = zplane_sm.from_cartesian_to_client( _glob_inversion_circle_post.center.x + _glob_inversion_circle_post.radius, _glob_inversion_circle_post.center.y );
           _glob_play_inversion_dx = _glob_play_inversion_screen_pt_ret.x - _glob_play_inversion_screen_pt1_ret.x, dY = _glob_play_inversion_screen_pt_ret.y - _glob_play_inversion_screen_pt1_ret.y ;
           _glob_play_inversion_radius_ret = Math.sqrt( _glob_play_inversion_dx * _glob_play_inversion_dx + dY * dY );

           _mouse_event_context = _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode );

           _mouse_event_context.beginPath();
           _mouse_event_context.lineWidth = 2 ;
           _mouse_event_context.arc( _glob_play_inversion_screen_pt.x, _glob_play_inversion_screen_pt.y, _glob_play_inversion_radius, 0, CIRCLES_TWO_PI );
           _mouse_event_context.strokeStyle = _glob_draw_seed_color ;
           _mouse_event_context.stroke();
           _mouse_event_context.closePath();

           _mouse_event_context.beginPath();
           _mouse_event_context.lineWidth = 2 ;
           _mouse_event_context.arc( _glob_play_inversion_screen_pt_ret.x, _glob_play_inversion_screen_pt_ret.y, _glob_play_inversion_radius_ret, 0, CIRCLES_TWO_PI );
           _mouse_event_context.strokeStyle = _glob_draw_seed_color ;
           _mouse_event_context.stroke();
           _mouse_event_context.closePath();
           
           _glob_currentX = _glob_mouse_x, _glob_currentY = _glob_mouse_y ;
           _glob_inversionX = _glob_play_inversion_screen_pt_ret.x, _glob_inversionY = _glob_play_inversion_screen_pt_ret.y ;
      }
}