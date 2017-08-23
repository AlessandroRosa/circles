function CIRCLESformsEDITDISKeventsHANDLER( _ctrl_id, _event )
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
    if ( _ctrl_id.one_in( "THREEPOINTSpt1x", "THREEPOINTSpt1y",
                          "THREEPOINTSpt2x", "THREEPOINTSpt2y",
                          "THREEPOINTSpt3x", "THREEPOINTSpt3y" ) )
    {
        CIRCLESformsEDITDISKdisk_from_3points();
        var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, YES, NO, YES, OUTPUT_SCREEN );
    }
    else if ( _ctrl_id.one_in( "CIRCLEselectedALPHA", "CIRCLEselectedBETA", "CIRCLEselectedGAMMA" ) )
    {
        CIRCLESformsEDITDISKdisk_from_equation();
        var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, YES, NO, YES, OUTPUT_SCREEN );
    }
}