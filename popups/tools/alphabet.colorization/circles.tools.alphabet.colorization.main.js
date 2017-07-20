function CIRCLEStoolsALPHABETCOLORIZATIONclose() { return YES ; }

function CIRCLEStoolsALPHABETCOLORIZATIONmain( _base_id, _move )
{
     CIRCLEStoolsALPHABETCOLORIZATIONuniqueid = _base_id ;
     _move = safe_int( _move, YES );
     var WIDTH = 360, HEIGHT = "auto", _run = YES, _subset = "tools" ;
     var CLOSE_FN = "CIRCLEStoolsALPHABETCOLORIZATIONclose()" ;
     var _div_id = circles_lib_popup_build_divid( _subset, _base_id );
		 var HTMLcode = "<table WIDTH=\""+WIDTH+"\" HEIGHT=\"100%\">" ;
         HTMLcode += circles_lib_popup_caption_code( YES, CIRCLEStoolsALPHABETCOLORIZATIONcaption, 5, 1, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "abc/abc.icon.01.16x16.png" );
         HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
		 		 HTMLcode += "<tr>" ;
		 		 HTMLcode += "<td ID=\"CIRCLEStoolsALPHABETCOLORIZATIONlistCONTAINER\" VALIGN=\"top\" HEIGHT=\"100%\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F1F1F5;padding:5px;\">" ;
         HTMLcode += CIRCLEStoolsALPHABETCOLORIZATIONlist( 1 );
		 		 HTMLcode += "</td>" ;
		 		 HTMLcode += "</tr>" ;
		 		 HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
		 		 HTMLcode += "</table>" ;
    
         HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
     var _div = circles_lib_popup_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
     circles_lib_popup_activate( NO, _base_id, arguments.callee.name, arguments, 'tools', OPEN, _div_id, CIRCLEStoolsALPHABETCOLORIZATIONcaption, CLOSE_FN );
     if ( _move && _div != null ) move_div( _div.id, "LEFT", "MIDDLE" );
     
     CIRCLEStoolsALPHABETCOLORIZATIONcomboHANDLER();
}