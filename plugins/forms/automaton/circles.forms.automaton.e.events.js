function CIRCLESformsAUTOMATONeventsHANDLER( _event, _ctrl_id )
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
       if ( _ctrl_id.is_one_of( "CIRCLESformsAUTOMATONsrcWORD" ) ) CIRCLESformsAUTOMATONsrcWORDadd();
			 else if ( _ctrl_id.is_one_of( "CIRCLESformsAUTOMATONtableNEWwordEDIT" ) ) CIRCLESformsAUTOMATONtableAPPENDENTRY('','',YES);
			 else if ( _ctrl_id.start_with( "AUTOMATON_ENTRY_WORD_" ) ) CIRCLESformsAUTOMATONtableSAVEENTRY( arguments[2] );
    }
}