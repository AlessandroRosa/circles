function CIRCLEStoolsALPHABETCOLORIZATIONeventsHANDLER( _ctrl_id, _event )
{
    var _return_pressed = _event.keyCode == 13 ? YES : NO ;
		if( _return_pressed )  // return key code
		{
				_event.preventDefault();
		}
    else
    {
    }
}

function CIRCLEStoolsALPHABETCOLORIZATIONcomboHANDLER()
{
    var _case_id = safe_int( $( "#CIRCLEStoolsALPHABETCOLORIZATIONlettercaseCOMBO" ).val(), 1 );
    $( "#CIRCLEStoolsALPHABETCOLORIZATIONcopyLABEL" ).html( ( _case_id == 1 ? "Upper" : "Lower" ) + " letters" );
}