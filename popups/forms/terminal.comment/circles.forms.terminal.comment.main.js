function CIRCLESformsTERMINALCOMMENTclose()    { return YES ; }

function CIRCLESformsTERMINALCOMMENTmain( _base_id, _move )
{
    CIRCLESformsTERMINALCOMMENTbaseid = safe_string( _base_id, "" ) ;
     _move = safe_int( _move, YES );
     var CLOSE_FN = "CIRCLESformsTERMINALCOMMENTclose();" ;
     var WIDTH = $(window).width() / 2 - 100, HEIGHT = 250, _subset = "forms" ;
     var _div_id = CIRCLESformsTERMINALCOMMENTdiv_id = circles_lib_popup_build_divid( _subset, _base_id );

		 var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
         HTMLcode += circles_lib_popup_caption_code( YES, CIRCLESformsTERMINALCOMMENTcaption, 5, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "balloon/balloon.icon.01.16x16.png" );
         HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
		 		 HTMLcode += "<tr><td>Write the comment to the code below</td></tr>" ;
		 		 HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
		 		 HTMLcode += "<tr><td ALIGN=\"center\"><TEXTAREA ID=\"CIRCLEScommentTEXTAREA\" CLASS=\"scripttext\" STYLE=\"width:"+(WIDTH-20)+"px;height:"+(HEIGHT-100)+"px;\">"+_glob_comment+"</TEXTAREA></td></tr>" ;
		 		 HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
		 		 HTMLcode += "<tr>" ;
		 		 HTMLcode += "<td VALIGN=\"top\" ALIGN=\"right\">" ;
		 		 HTMLcode += "<table>" ;
		 		 HTMLcode += "<tr>" ;
         if ( !circles_lib_terminal_batch_script_exists() )
		 		 HTMLcode += "<td STYLE=\"color:orange;\" ALIGN=\"center\">No code has been input yet</td><td WIDTH=\"50\"></td>" ;
         
		 		 HTMLcode += "<td STYLE=\"padding-right:6px;color:"+get_color_tag_value( "gray" )+";\" ID=\"CIRCLEScommentSAVEbtn\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsTERMINALCOMMENTSAVE();\">Save comment</td>" ;
		 		 HTMLcode += "<td WIDTH=\"10\"></td>" ;
		 		 HTMLcode += "</tr>" ;
		 		 HTMLcode += "</table>" ;
		 		 HTMLcode += "</td>" ;
		 		 HTMLcode += "</tr>" ;
		 		 HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
		 		 HTMLcode += "</table>" ;
    
         HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
     GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
     if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
     _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

     var _div = circles_lib_popup_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
     circles_lib_popup_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsTERMINALCOMMENTcaption, CLOSE_FN );
     if ( _move && _div != null ) move_div( _div.id, "LEFT", "TOP" );
     
     $("#CIRCLEScommentTEXTAREA").bind( "keyup", function() { $("#CIRCLEScommentSAVEbtn").css( "color", DEFAULT_COLOR_STD ); } );
}

function CIRCLESformsTERMINALCOMMENTSAVE( _question )
{
     _question = safe_int( _question, YES );
     var _candidate_comment = _$("#CIRCLEScommentTEXTAREA").val();
     if ( _candidate_comment.length == 0 && _glob_comment.length > 0 )
     {
          var _msg = "No comment was found in the textbox, but there's one stored in memory.\nConfirm to erase all contents then ?" ;
          var _b_go = !_question ? YES : confirm( _msg );
          if ( _b_go ) _glob_comment = "" ;
     }
     else _glob_comment = _candidate_comment ;

     if ( _glob_comment.length > 0 )
     circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Comment has been saved with success.", _glob_app );
     else
     circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Problems while saving the comment.\nPlease, try again.", _glob_app );
}