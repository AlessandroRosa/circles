function CIRCLESformsSVGEDITOReventsHANDLER( _event, _ctrl_id )
{
	  if ( _event.stopPropagation )      _event.stopPropagation();
	  if ( _event.cancelBubble != null ) _event.cancelBubble = true;

  	var _alt_pressed = _event.altKey ;
    var _del_pressed = _event.keyCode == 8 ? YES : NO ;
    var _canc_pressed = _event.keyCode == 46 ? YES : NO ;
	  var _ctrl_pressed = _event.ctrlKey ;
    var _esc_pressed = _event.keyCode == 27 ? YES : NO ;
		var _shift_pressed = _event.shiftKey ;
    var _return_pressed = _event.keyCode == 13 ? YES : NO ;

    if ( _return_pressed )
    {
				 switch( _ctrl_id )
				 {
			 			case "CIRCLESformsSVGEDITORcurrentPAGE":
			 			CIRCLESformsSVGEDITORdisplayPAGE( safe_int( $( "#CIRCLESformsSVGEDITORcurrentPAGE" ).val(), 1 ), NO ) ;
		 				break ;
		        default: break ;
				 }
    }
}

function CIRCLESformsSVGEDITORcanvasONMOUSEMOVE( canvas, event )
{
     _glob_coords_array = circles_lib_events_get_mouse_pos_rel( canvas, event );
     _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
     _glob_mouse_x = _svg_editor_ref_canvas_dims_array != null ? _glob_mouse_x / canvas.get_width() * _svg_editor_ref_canvas_dims_array[0] : 0 ;
     _glob_mouse_x = safe_int( _glob_mouse_x, 0 );
     _glob_mouse_y = _svg_editor_ref_canvas_dims_array != null ? _glob_mouse_y / canvas.get_height() * _svg_editor_ref_canvas_dims_array[1] : 0 ;
     _glob_mouse_y = safe_int( _glob_mouse_y, 0 );
     $("#CIRCLESformsSVGEDITORmouseX").html( _glob_mouse_x );
     $("#CIRCLESformsSVGEDITORmouseY").html( _glob_mouse_y );
}