function CIRCLESembeddingsRILEYSLICE_TOGGLE_PREVIEW()
{
		$( "#PLUGIN_PREVIEW" ).toggle( "slow",
																	 function()
																	 {
																	 		CIRCLESembeddingsRILEYSLICE_RENDER_PREVIEW( "RILEYSLICE", Z_PLANE );
																	 		var _visible = $( "#PLUGIN_PREVIEW" ).is(":visible") ;
																			$( "#PLUGIN_TOGGLE_PREVIEW_BTN" ).html( _visible ? "Hide preview" : "Show preview" );
																			if ( _visible )
																			{
																					var _plugin_width = $( "#"+GLOB_PLUGIN_DIV_ID ).width() ;
																					var _canvas = $( "#CIRCLESembeddingsRILEYSLICE_CANVAS" ).get(0) ;
																					_canvas.set_width( _plugin_width - 5 );
																			}
																	 } );
}

function CIRCLESembeddingsRILEYSLICE_RENDER_PREVIEW( _base_id, _plane_type )
{
		var _b_found = NO, _canvas ;
    var CTRLbaseID = _base_id.replace( /[\-\.\_]/, "" ) ;
		if ( $( "#CIRCLESchoose"+CTRLbaseID+"canvasDROPDOWN" ).get(0) != null )
		{
				 var _key = $( "#CIRCLESchoose"+CTRLbaseID+"canvasDROPDOWN option:selected" ).val();
				 var _entry = _glob_available_curr_canvas_array[_key] ;
				 if ( _entry != null )
				 {
				 		  _plane_type = circles_lib_return_plane_type( _plane_type );
				 		  if ( _plane_type != NO_PLANE )
				 		  {
							 		 _b_found = YES ;
							 		 _canvas = $( "#"+_key ).get(0)							 		 
							}
				 }
		}
		
		if ( !_b_found )
		{
				_plane_type = safe_int( _plane_type, W_PLANE );
				_base_id = safe_string( _base_id, "" ) ;
				_canvas = $( "#CIRCLESembeddings"+CTRLbaseID+"_CANVAS" ).get(0) ;
		}

		if ( is_html_canvas( _canvas ) )
		{
				var _mapper = null ;
				switch( _plane_type ) // just to start from something we already have ...
				{
						case Z_PLANE: _mapper = zplane_sm.copy(); break ;
						case W_PLANE: _mapper = wplane_sm.copy(); break ;
						default: break ;
				}

				if ( _mapper == null ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Missing component: try to reload this plug-in again", 'PLUGIN_OUTMSG' )
				else
				{
				    var _aspect_ratio = _canvas.getContext( _glob_canvas_ctx_2D_mode ).get_aspect_ratio() ;
				    var _coords_rect = _mapper.get_coords_rect();
				    var _center = _coords_rect.center(), _coords_w = _coords_rect.width(), _coords_h = _coords_rect.height();
				    var _new_coords_w = ( _aspect_ratio * _coords_h ).roundTo(2) ;
				    var _new_left_top = new point( _center.x - _new_coords_w / 2.0, _center.y + _coords_h / 2.0 ) ;
				    var _new_right_bottom = new point( _center.x + _new_coords_w / 2.0, _center.y - _coords_h / 2.0 ) ;
				    var _new_rect = new rect( _new_left_top, _new_right_bottom, _RECT_ORIENTATION_CARTESIAN );
            var _display_rect = new rect( 0, 0, _canvas.get_width(), _canvas.get_height() ) ;

            _mapper.label = "Plug-in screen mapper" ;
            _mapper.set_coords_rect( _new_rect );
            _mapper.set_client_rect( _display_rect );
            _mapper.set_display_rect( _display_rect );

						switch( _plane_type )
						{
								case Z_PLANE:
                _canvas.set_type( Z_PLANE );
                _canvas.clean();
                circles_lib_grid_draw( _canvas, _mapper, CUSTOM_PLANE, YES, _glob_ticks_count, OUTPUT_SCREEN ) ;
                if ( circles_lib_count_seeds() > 0 )
                circles_lib_draw_all_complex_disks( _canvas.getContext( _glob_canvas_ctx_2D_mode ), _mapper, null, NO, YES, OUTPUT_SCREEN );
								break ;
								case W_PLANE:
                _canvas.set_type( W_PLANE );
                _canvas.clean();
                circles_lib_grid_draw( _canvas, _mapper, CUSTOM_PLANE, YES, _glob_ticks_count, OUTPUT_SCREEN ) ;
                if ( circles_lib_count_seeds() > 0 )
                {
										 circles_lib_triggers_open_all_automated_entries();
		                 _ret_chunk = circles_lib_canvas_render_process( _canvas, _mapper, CUSTOM_PLANE, NO, OUTPUT_SCREEN );
								}
								break ;
								default: break ;
						}
				}
		}
		else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Missing component: try to reload this plug-in again", 'PLUGIN_OUTMSG' )
}