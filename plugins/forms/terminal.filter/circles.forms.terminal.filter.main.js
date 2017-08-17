function CIRCLESformsTERMINALFILTERclose() { return circles_lib_plugin_dispatcher_unicast_message( "terminal.filter", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsTERMINALFILTERmain( _base_id, _move )
{
    CIRCLESformsTANGENTCIRCLEbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    var CLOSE_FN = "CIRCLESformsTERMINALFILTERclose()" ;
    var WIDTH = $(window).width() / 2 - 100, HEIGHT = 340, _subset = "forms" ;
    var _div_id = CIRCLESformsTERMINALFILTERdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );

	  var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
    HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsTERMINALFILTERcaption, 5, 1, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "filter/filter.icon.01.16x16.png" );
    HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
		HTMLcode += "<tr><td>Write the filter code below</td></tr>" ;
		HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
		HTMLcode += "<tr><td ALIGN=\"center\"><TEXTAREA ID=\"CIRCLESfilterTEXTAREA\" CLASS=\"scripttext\" STYLE=\"width:"+(WIDTH-20)+"px;height:"+(HEIGHT-100)+"px;\">"+_glob_filter+"</TEXTAREA></td></tr>" ;
		HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
		HTMLcode += "<tr>" ;
		HTMLcode += "<td VALIGN=\"top\" ALIGN=\"right\">" ;
		HTMLcode += "<table>" ;
		HTMLcode += "<tr>" ;
    if ( !circles_lib_terminal_batch_script_exists() )
		HTMLcode += "<td STYLE=\"color:orange;\" ALIGN=\"center\">No code has been input yet</td><td WIDTH=\"50\"></td>" ;

		HTMLcode += "<td STYLE=\"padding-right:6px;color:"+get_rgb_from_color_tag( "gray" )+";\" CLASS=\"link\" ID=\"CIRCLESfilterTESTbtn\" ONCLICK=\"javascript:CIRCLESformsTERMINALFILTERTEST();\">Test filter</td>" ;
		HTMLcode += "<td WIDTH=\"10\"></td>" ;
		HTMLcode += "<td STYLE=\"padding-right:6px;color:"+get_rgb_from_color_tag( "gray" )+";\" CLASS=\"link\" ID=\"CIRCLESfilterSAVEbtn\" ONCLICK=\"javascript:CIRCLESformsTERMINALFILTERSAVE(YES,2);\">Save filter</td>" ;
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

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsTERMINALFILTERcaption, CLOSE_FN );
    if ( _move && _div != null ) move_div( _div.id, "LEFT", "TOP" );

    $("#CIRCLESfilterTEXTAREA").bind( "keyup", function() { $("#CIRCLESfilterTESTbtn").css( "color", DEFAULT_COLOR_STD ); $("#CIRCLESfilterSAVEbtn").css( "color", DEFAULT_COLOR_STD ); } );
}

function CIRCLESformsTERMINALFILTERTEST() { circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, "Work in progress.", _glob_app_title ); }

function CIRCLESformsTERMINALFILTERSAVE( _question, _opcode )
{
     _question = safe_int( _question, YES );
     var _candidate_filter = $("#CIRCLESfilterTEXTAREA").val();
     if ( _candidate_filter.length == 0 && _glob_filter.length > 0 )
     {
          var _msg = "No filter code was found in the textbox, but there's one stored in memory.\nConfirm to erase all contents then ?" ;
          var _b_go = !_question ? YES : confirm( _msg );
          if ( _b_go ) _glob_filter = "" ;
     }
     else _glob_filter = _candidate_filter ;

     if ( _glob_filter.length > 0 )
     circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Filter has been saved with success.", _glob_app_title );
     else
     circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Problems while saving the filter.\nPlease, try again.", _glob_app_title );
}