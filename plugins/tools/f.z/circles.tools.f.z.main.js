function CIRCLEStoolsFZclose() { circles_lib_plugin_dispatcher_unicast_message( "f.z", "tools", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLEStoolsFZmaximize()
{
    var _full_width = safe_int( arguments[1], 0 ), _full_height = safe_int( arguments[2], 0 );
    CIRCLEStoolsFZresize( _full_width, _full_height );
    var _curr_w = $( "#" + CIRCLEStoolsFZdiv_id ).width() ;
}

function CIRCLEStoolsFZminimize()
{
    var _original_width = safe_int( arguments[1], 0 ), _original_height = safe_int( arguments[2], 0 );
    var _min_width = safe_int( arguments[3], 0 );
    var _min_height = safe_int( arguments[4], 0 );
    CIRCLEStoolsFZresize( _min_width, _min_height );
}

function CIRCLEStoolsFZnormalize()
{
    var _original_width = safe_int( arguments[1], 0 ), _original_height = safe_int( arguments[2], 0 );
    CIRCLEStoolsFZresize( _original_width, _original_height );
    var _curr_w = $( "#" + CIRCLEStoolsFZdiv_id ).width() ;
}

function CIRCLEStoolsFZhelp()
{
		var _msg = "As long as this service is open, it will work together with the diagram rendering process," ;
				_msg += "\nwhich will output the points after they have been mapped through this formula." ;
		circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, _msg, _glob_app_title ) ;
}

function CIRCLEStoolsFZmain( _base_id, _move )
{
    CIRCLEStoolsFZuniqueid = _base_id ;
    _move = safe_int( _move, YES );
    var WIDTH = 520, HEIGHT = "auto", _run = YES, _subset = "tools" ;
    var _div_id = CIRCLEStoolsFZdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    var CLOSE_FN = "CIRCLEStoolsFZclose();" ;
    var _n_screen_pts = _glob_rec_canvas_entities_array.size_associative() ;
    CIRCLEStoolsFZformula = safe_string( _glob_volatile_settings['f.z.formula'], "" );
	  var HTMLcode = "<table ID=\"CIRCLEStoolsFZmasterTABLE\" WIDTH=\"100%\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLEStoolsFZcaption, 5, 1, CLOSE_FN,
																				 WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "gearwheel/gearwheel.icon.01.20x20.png",
																				 "", _n_screen_pts > 0 ? "CIRCLEStoolsFZhelp()" : "", "" );
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
    if ( _n_screen_pts == 0 )
    {
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"color:"+COLOR_WARNING+";font-size:16pt;\" ALIGN=\"center\">Missing diagram points</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"color:"+COLOR_WARNING+";font-size:12pt;\" ALIGN=\"center\">Service is not available</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"color:"+DEFAULT_COLOR_INFO_FOR_TEXT+";font-size:12pt;\" ALIGN=\"center\">Please, perform a rendering first</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
		}
		else
		{
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"font-size:12pt;\" ALIGN=\"center\">Write down a formula in z to re-map all rendered points</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td STYLE=\"font-size:12pt;\">F(z)</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"CIRCLEStoolsFZformulaEDIT\" VALUE=\""+CIRCLEStoolsFZformula+"\" ONFOCUS=\"javascript:CIRCLEStoolsFZeventsHANDLER( event, this.id );\" ONKEYUP=\"javascript:CIRCLEStoolsFZeventsHANDLER( event, this.id );\" STYLE=\"width:"+(WIDTH-60)+"px;\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table ALIGN=\"right\">" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLEStoolsFZclean();\" ID=\"CIRCLEStoolsFZcleanBTN\">Clean</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLEStoolsFZmemo();\" ID=\"CIRCLEStoolsFZmemoBTN\">Memo</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLEStoolsFZapply();\" ID=\"CIRCLEStoolsFZapplyBTN\">Apply</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLEStoolsFZredraw();\" ID=\"CIRCLEStoolsFZredrawBTN\">Redraw</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLEStoolsFZrender();\" ID=\"CIRCLEStoolsFZrenderBTN\">Render</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded_dead\" ID=\"CIRCLEStoolsFZstopBTN\">Stop</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"font-size:12pt;height:50px;\" ID=\"CIRCLEStoolsFZoutMSG\" ALIGN=\"center\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\"><table WIDTH=\"100%\" ALIGN=\"center\">" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td HEIGHT=\"50\" VALIGN=\"middle\" ALIGN=\"center\" STYLE=\"font-size:12pt;height:50px;\" ID=\"CIRCLEStoolsFZprocessREPORT\"></td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table></td></tr>" ;
		}

        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
		 		HTMLcode += "</table>" ;
    
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, 'tools', OPEN, _div_id, CIRCLEStoolsFZcaption, CLOSE_FN,
                      [ "CIRCLEStoolsFZnormalize", _div_id, WIDTH, HEIGHT ],
                      [ "CIRCLEStoolsFZminimize", _div_id ],
                      [ "CIRCLEStoolsFZmaximize", _div_id ],
                      _run ? "popup_caption_bk_enabled" : "popup_caption_bk_alert" );
    if ( _move && _div != null ) move_div( _div_id, "RIGHT", "TOP" );
    $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLEStoolsFZload ) } ;
    $( "#popup_floating_box" ).hide();    
}