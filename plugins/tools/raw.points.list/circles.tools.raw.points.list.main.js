function CIRCLEStoolsRAWPOINTSLISTclose()
{
		circles_lib_plugin_dispatcher_unicast_message( CIRCLEStoolsRAWPOINTSLISTuniqueid, "tools", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE );
		return YES ;
}

function CIRCLEStoolsRAWPOINTSLISTmaximize()
{
    var _full_width = safe_int( arguments[1], 0 ), _full_height = safe_int( arguments[2], 0 );
    CIRCLEStoolsRAWPOINTSLISTresize( _full_width, _full_height );
    var _curr_w = $( "#" + CIRCLEStoolsRAWPOINTSLISTdiv_id ).width() ;
    $( "#CIRCLEStoolsRAWPOINTSLISTtextareaCONTAINER" ).width( _curr_w - 10 );
    $( "#CIRCLEStoolsRAWPOINTSLISTtextarea" ).width( _curr_w - 12 );
}

function CIRCLEStoolsRAWPOINTSLISTminimize()
{
    var _original_width = safe_int( arguments[1], 0 ), _original_height = safe_int( arguments[2], 0 );
    var _min_width = safe_int( arguments[3], 0 );
    var _min_height = safe_int( arguments[4], 0 );
    CIRCLEStoolsRAWPOINTSLISTresize( _min_width, _min_height );
}

function CIRCLEStoolsRAWPOINTSLISTnormalize()
{
    var _curr_w = $( "#" + CIRCLEStoolsRAWPOINTSLISTdiv_id ).width() ;
    $( "#CIRCLEStoolsRAWPOINTSLISTtextareaCONTAINER" ).width( _curr_w - 16 );
    $( "#CIRCLEStoolsRAWPOINTSLISTtextarea" ).width( _curr_w - 18 );
}

function CIRCLEStoolsRAWPOINTSLISTmain( _base_id, _move )
{
    CIRCLEStoolsRAWPOINTSLISTuniqueid = _base_id ;
    _move = safe_int( _move, YES );
    var WIDTH = 340, HEIGHT = "auto", _run = YES, _subset = "tools" ;
    var _div_id = CIRCLEStoolsRAWPOINTSLISTdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    var CLOSE_FN = "CIRCLEStoolsRAWPOINTSLISTclose();" ;
	  var HTMLcode = "<table ID=\"CIRCLEStoolsRAWPOINTSLISTmasterTABLE\" WIDTH=\"100%\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLEStoolsRAWPOINTSLISTcaption, 5, 1, CLOSE_FN,
																				 WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "gearwheel/gearwheel.icon.01.16x16.png",
																				 "", null, "" );
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#customloader').val('');$('#customloader').trigger('click');\">Load</td>" ;
        HTMLcode += "<td WIDTH=\"12\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTsaveTEXT();\">Save</td>" ;
        HTMLcode += "<td WIDTH=\"12\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ID=\"rawpoints_copy\" ONCLICK=\"javascript:copy_to_clipboard('CIRCLEStoolsRAWPOINTSLISTtextarea');\">Copy</td>" ;
        HTMLcode += "<td WIDTH=\"12\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTcopyintoSTORAGE();\">Storage</td>" ;
        HTMLcode += "<td WIDTH=\"12\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTcleanTEXT();\">Clean</td>" ;
        HTMLcode += "<td WIDTH=\"12\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTdraw();\">Draw</td>" ;
        HTMLcode += "<td WIDTH=\"12\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTlatticeFORM(SHOW);\">Lattice</td>" ;
        HTMLcode += "<td WIDTH=\"12\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISThelp();\">Help</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;

        HTMLcode += "<tr><td COLSPAN=\"3\" STYLE=\"height:18px;\" ALIGN=\"center\" WIDTH=\"100%\"><table ALIGN=\"center\" STYLE=\"height:18px;\" WIDTH=\"100%\"><tr><td STYLE=\"height:18px;\" ALIGN=\"center\" ID=\"CIRCLEStoolsRAWPOINTSLISToutputBOX\"></td></tr></table></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"padding-left:7px;\">Insert one point coords per each row in the box below</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\" ALIGN=\"center\"><DIV STYLE=\"position:relative;width:auto;height:auto;\" ID=\"CIRCLEStoolsRAWPOINTSLISTtextareaCONTAINER\"><TEXTAREA ID=\"CIRCLEStoolsRAWPOINTSLISTtextarea\" STYLE=\"background-color:#232323;color:lime;font-size:10pt;overflow:auto;width:"+(WIDTH-20)+"px;height:220px;\"></TEXTAREA></DIV></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\"><DIV CLASS=\"general_rounded_corners\" STYLE=\"position:relative;width:"+( WIDTH - 20 )+";height:220px;display:none;background-color:#323232;color:lime;font-size:10pt;overflow:auto;padding:4px;\" ID=\"CIRCLEStoolsRAWPOINTSLISTlogCONTAINER\"></DIV></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"7\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"checkbox\" ID=\"CIRCLEStoolsRAWPOINTSLISTconnectCHECKBOX\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>Connect</td>" ;
        HTMLcode += "<td WIDTH=\"12\"></td>" ;
		    HTMLcode += "<td CLASS=\"link\" ID=\"CIRCLEStoolsRAWPOINTSLISTlogBTN\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"7\"></td>" ;
        HTMLcode += "<td>Points in</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><SELECT ID=\"CIRCLEStoolsRAWPOINTSLISTmapCOMBO\"><OPTION VALUE=\"1\">Cartesian coords<OPTION VALUE=\"2\">Screen coords<OPTION VALUE=\"3\">Complex coords</SELECT></td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td>Output plane</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><SELECT ID=\"CIRCLEStoolsRAWPOINTSLISTplaneCOMBO\"><OPTION VALUE=\""+Z_PLANE+"\">Z-plane<OPTION VALUE=\""+W_PLANE+"\">W-plane</SELECT></td>" ;
        HTMLcode += "<td WIDTH=\"8\"></td>" ;
        HTMLcode += "<td WIDTH=\"16\" ID=\"CIRCLEStoolsRAWPOINTSLISTlogCONTAINER\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table></td></tr>" ;


        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;

		 		HTMLcode += "</table>" ;
    
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, 'tools', OPEN, _div_id, CIRCLEStoolsRAWPOINTSLISTcaption, CLOSE_FN,
                      [ "CIRCLEStoolsRAWPOINTSLISTnormalize", _div_id, WIDTH, HEIGHT ],
                      [ "CIRCLEStoolsRAWPOINTSLISTminimize", _div_id ],
                      [ "CIRCLEStoolsRAWPOINTSLISTmaximize", _div_id ],
                      _run ? "popup_caption_bk_enabled" : "popup_caption_bk_alert" );
    if ( _move && _div != null ) move_div( _div_id, "RIGHT", "TOP" );
    $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLEStoolsRAWPOINTSLISTload ) } ;
}