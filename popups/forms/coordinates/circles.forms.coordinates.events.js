function CIRCLESformsCOORDINATESeventsHANDLER( _ctrl_id, _event )
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

    var _param_01 = arguments[2], _param2 = arguments[3] ;

  	event.preventDefault();
    if ( _ctrl_id.stricmp( "CIRCLESformsCOORDINATESplaneWIDTH" ) )
    {
				var _w = $( "#"+_ctrl_id ).val();
				var _h = _w / _glob_interface_aspect_ratio ;
				$( "#CIRCLESformsCOORDINATESplaneHEIGHT" ).val( _h.roundTo( _glob_accuracy ) );
		}
    else if ( _ctrl_id.stricmp( "CIRCLESformsCOORDINATESplaneHEIGHT" ) )
    {
				var _h = $( "#"+_ctrl_id ).val();
				var _w = _h * _glob_interface_aspect_ratio ;
				$( "#CIRCLESformsCOORDINATESplaneWIDTH" ).val( _w.roundTo( _glob_accuracy ) );
		}
    else if ( _ctrl_id.stricmp( "CIRCLESformsCOORDINATESplaneCENTER" ) )
    {
		
		}
}