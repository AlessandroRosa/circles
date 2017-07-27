function CIRCLEStoolsGROUPTABLEeventsHANDLER( _event, _ctrl_id )
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
            case "CIRCLEStoolsGROUPTABLEroundtoEDIT":
            CIRCLEStoolsGROUPTABLEroundto = safe_int( $( "#" + _ctrl_id ).val(), 0 );
            CIRCLEStoolsGROUPTABLEfill_div_with_mobius_maps();
            break ;
            default: break ;
         }
    }
}
