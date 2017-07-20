function CIRCLESbarsSTATUSBAReventsKEYCODE( _ctrl_id, _event )
{
    var _ctrl_pressed = _event.ctrlKey ;
		var _shift_pressed = _event.shiftKey ;
		var _alt_pressed = _event.altKey ;
    var _del_pressed = _event.keyCode == 8 ? YES : NO ;
    var _esc_pressed = _event.keyCode == 27 ? YES : NO ;
    var _canc_pressed = _event.keyCode == 46 ? YES : NO ;
    var _return_pressed = _event.keyCode == 13 ? YES : NO ;

    _glob_alt_key = _alt_pressed ? YES : NO ;
    _glob_canc_key = _canc_pressed ? YES : NO ;
    _glob_ctrl_key = _ctrl_pressed ? YES : NO ;
    _glob_esc_key = _esc_pressed ? YES : NO ;
    _glob_shift_key = _shift_pressed ? YES : NO ;

    if ( _return_pressed )
    {
       switch( _ctrl_id )
       {
          case "STATUSBARdepthEDIT": circles_lib_statusbar_set_depth( $( "#"+_ctrl_id ).val() ); break ;
          default: break ;
       }
    }
}

function CIRCLESbarsSTATUSBAReventsMOUSE( _ctrl_id, _event )
{
		switch( _event.type.toLowerCase() )
		{
			 case "mousedown":
			 var zIndex = 0 ;
			 $.each( $( "div" ),
			 				 function( _i, _div_obj )
			 				 {
									if( _div_obj.id.start_with( "POPUP", "CANVAS" ) )
									zIndex = Math.max( zIndex, $( "#" + _div_obj.id ).zIndex() ) ;	
							 }
			 			 );
				 
			 circles_lib_popup_deactivate_all( NO ) ;
			 circles_lib_popup_list_selection_render( YES, YES ) ;
			 $( "#CIRCLESbarsSTATUSBARdiv" ).zIndex( zIndex + 1 ) ;
			 _glob_last_focus_divid = "CIRCLESbarsSTATUSBARdiv" ;
			 _glob_statusbarMOUSEprocSWITCH = MOUSE_STATUSBAR_PROC_ID ;
			 break ;
			 case "mousemove":
			 if ( _glob_statusbarMOUSEprocSWITCH == MOUSE_STATUSBAR_PROC_ID )
			 {
			     _glob_coords_array = circles_lib_events_get_mouse_pos_abs( _event );
			     _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
           if ( _glob_left_border_rect.includes_pt( _glob_mouse_x, _glob_mouse_y ) )
					 circles_lib_statusbar_load( "vert", "left", "top", YES ) ;
           else if ( _glob_right_border_rect.includes_pt( _glob_mouse_x, _glob_mouse_y ) )
           circles_lib_statusbar_load( "vert", "right", "top", YES ) ;
           else if ( _glob_top_border_rect.includes_pt( _glob_mouse_x, _glob_mouse_y ) )
           circles_lib_statusbar_load( "horz", "left", "top", YES ) ;
           else if ( _glob_bottom_border_rect.includes_pt( _glob_mouse_x, _glob_mouse_y ) )
           circles_lib_statusbar_load( "horz", "left", "bottom", YES ) ;
			 }
			 break ;
			 case "mouseup": _glob_statusbarMOUSEprocSWITCH = MOUSE_NO_PROC_ID ; break ;
       default: break ;
		}
}