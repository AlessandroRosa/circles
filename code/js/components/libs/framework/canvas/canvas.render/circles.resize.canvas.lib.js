function circles_lib_canvas_redraw_wplane_entities( _update_plane, _process_title_str, _output_channel )
{
    if ( _glob_rec_canvas_entities_array.size_associative() > 0 )
    {
       _update_plane = safe_int( _update_plane, YES );
       _process_title_str = safe_string( _process_title_str, "Resizing - stage 1/2" )
       _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
       if ( _update_plane )
			 {
					var _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, null, NO, NO, NO, YES, NO, YES, _output_channel );
	        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
				  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "27Unknown error" ;
				  if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
			 }
       var _options_chunk = [] ;
       var _corners = wplane_sm.get_coords_corners() ;
       var _canvas = _glob_wplane_rendering_layer_placeholder ;
       _options_chunk['plane_type'] = W_PLANE ;
       _options_chunk['draw_entity'] = _glob_drawentity ;
       _options_chunk['canvas_id'] = _canvas.get_idcanvas() ;
       _options_chunk['canvas_dims'] = [ _canvas.get_width(), _canvas.get_height() ] ;
       _options_chunk['left_up_pt'] = _corners['lu'] ;
       _options_chunk['process_title'] = _process_title_str ;
       _options_chunk['right_down_pt'] = _corners['rd'] ;
       _options_chunk['entities_array'] = _glob_rec_canvas_entities_array ;
       CIRCLESmultithreadingPROCESSwindowresize( _options_chunk, YES, _output_channel ) ;
    }
}