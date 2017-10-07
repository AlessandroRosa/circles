function CIRCLESformsEPSEDITORclose() { return circles_lib_plugin_dispatcher_unicast_message( "eps.editor", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsEPSEDITORresize( _new_width, _new_height, _out_channel )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _extras_h = 84 ; // caption + row bar + blank rows
    $( "#CIRCLESformsEPSEDITORtextarea" ).width( _new_width - 5 );
    $( "#CIRCLESepseditorSEARCHstr" ).width( _new_width - 240 );
    
    $( "#CIRCLESformsEPSEDITORdisplayrowsPANEL" ).css( "display", _new_width > 540 ? "block" : "none" );
    $( "#CIRCLESepseditorOUTPUT" ).css( "display", _new_width > 540 ? "block" : "none" );
    $( "#CIRCLESformsEPSEDITORbuttonsBAR" ).css( "display", _new_width > 380 ? "block" : "none" );
    	 if ( _new_width > 380 ) _extras_h += 34 ;
    $( "#CIRCLESformsEPSEDITORsearchBAR" ).css( "display", _new_width > 380 ? "block" : "none" );
    	 if ( _new_width > 380 ) _extras_h += 34 ;
    	 
    $( "#CIRCLESformsEPSEDITORpagespanelLABEL" ).css( "display", _new_width > 380 ? "block" : "none" );
    $( "#CIRCLESformsEPSEDITORtextarea" ).height( _new_height - _extras_h );
}

function CIRCLESformsEPSEDITORmain( _base_id, _move )
{
    CIRCLESformsEPSEDITORbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    var _codelist_ref = _glob_js_e_ps_obj.get_codelist_ref();
    CIRCLESformsEPSEDITORcomputePAGES();

    var _eps_code = CIRCLESformsEPSEDITOR_pages > 0 ? _codelist_ref.from_to( 0, CIRCLESformsEPSEDITOR_max_entries_per_page ).join( _glob_crlf ) : _glob_js_e_ps_obj.export_eps( _glob_crlf );
    var _from = 0, _to = CIRCLESformsEPSEDITOR_max_entries_per_page ;
    var _viewport_dims = getViewportExtents(), _subset = "forms" ;
    var WIDTH = Math.max( safe_int( _viewport_dims[0] * 0.45, 560 ), 560 ), HEIGHT = safe_int( _viewport_dims[1] - 70, 450 );
    var _div_id = CIRCLESformsEPSEDITORdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    var CLOSE_FN = "CIRCLESformsEPSEDITORclose();" ;
    var HTMLcode = "<table ID=\"wnd_container_"+_div_id+"\" WIDTH=\"100%\" STYLE=\"background-color:white;\">" ;
    HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsEPSEDITORcaption, 3, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "e.ps/e.ps.icon.01.20x20.png", "" );

    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" ID=\"CIRCLESformsEPSEDITORbuttonsBAR\" WIDTH=\"99%\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;

    HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_canvas_save_to_e_ps('');\">Save file</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsEPSEDITORsavepage();\">Save page</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsEPSEDITORreloadPAGE();\">Reload page</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:$('#CIRCLESformsEPSEDITORtextarea').get(0).select();\">Select All</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"eps_copy\" ONCLICK=\"javascript:copy_to_clipboard($('#CIRCLESformsEPSEDITORtextarea').val());\">Copy</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;

    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td>" ;
    HTMLcode += "<table ID=\"CIRCLESformsEPSEDITORdisplayrowsPANEL\">" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td>Display rows from</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td WIDTH=\"35\" STYLE=\"text-align:center;\" ID=\"CIRCLESepseditorPAGEfrom\">1</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td>to</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td WIDTH=\"35\" STYLE=\"text-align:center;\"ID=\"CIRCLESepseditorPAGEto\">"+_to+"</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td>of</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>"+safe_size( _codelist_ref, 0 )+"</td>" ;
    HTMLcode += "</td></tr>" ;
    HTMLcode += "</table>" ;

    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td></tr>" ;

    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\"><TEXTAREA CLASS=\"linenumberstextarea\" ID=\"CIRCLESformsEPSEDITORtextarea\" STYLE=\"width:"+( WIDTH - 5 )+"px;height:"+( HEIGHT - 152 )+"px;overflow:auto;padding:1px;\">"+_eps_code+"</TEXTAREA></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"middle\" WIDTH=\"99%\">" ;
    HTMLcode += "<table ID=\"CIRCLESformsEPSEDITORsearchBAR\" CLASS=\"popup_buttons_bar\">" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>Search for</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td STYLE=\"text-align:center;\"><INPUT TYPE=\"edit\" STYLE=\"width:"+( WIDTH - 240 )+"px;\" ID=\"CIRCLESepseditorSEARCHstr\" ONKEYUP=\"javascript:CIRCLESformsEPSEDITOR_EVENTS( this.id, event );\"></td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:20px;\" ONCLICK=\"javascript:CIRCLESformsEPSEDITORsearch( $('#CIRCLESepseditorSEARCHstr').val() );\">Go</td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td ID=\"CIRCLESepseditorSEARCHoutput\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td></tr>" ;

    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" ID=\"CIRCLESepseditorBAR\" CLASS=\"popup_buttons_bar\" WIDTH=\"99%\" HEIGHT=\"18\">" ;
    HTMLcode += "<table><tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>Row</td><td WIDTH=\"4\"></td><td ALIGN=\"center\" ID=\"EPSeditorROW\" WIDTH=\"22\"></td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td><td>Col</td><td WIDTH=\"4\"></td><td ALIGN=\"center\" ID=\"EPSeditorCOL\" WIDTH=\"22\"></td>" ;

    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESformsEPSEDITORpagespanelLABEL\"></td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td WIDTH=\"160\" STYLE=\"text-align:center;\" ID=\"CIRCLESepseditorOUTPUT\"></td>" ;

    HTMLcode += "</tr></table></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;

    HTMLcode += "</table>" ;
    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsEPSEDITORcaption, CLOSE_FN );
    if ( _move && _div != null ) move_div( _div_id, "LEFT", "TOP" );

    $("#CIRCLESformsEPSEDITORtextarea" ).bind( "click focus keydown",
                                              function( event )
                                              {
                                                  var _xy = getCursorXY( "CIRCLESformsEPSEDITORtextarea" );
                                                  $("#EPSeditorCOL" ).html( _xy[ 0 ] + 1 );
                                                  $("#EPSeditorROW" ).html( _xy[ 1 ] + 1 );
                                              }
                                             );
    CIRCLESformsEPSEDITORpagespanel();
    $("#"+_div_id).resizable( { resize: function (event, ui)
                                {
                                	   if ( event.stopPropagation )      event.stopPropagation();
                                 	   if ( event.cancelBubble != null ) event.cancelBubble = true;
                                     CIRCLESformsEPSEDITORresize( ui.size.width, ui.size.height );
                                }
                              });
    $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
}

function CIRCLESformsEPSEDITORpagespanel()
{
    if ( CIRCLESformsEPSEDITOR_pages > 1 )
    {
        var HTMLcode  = "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td>Page</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"edit\" VALUE=\"1\" ID=\"CIRCLESepseditorPAGEedit\" STYLE=\"width:25px;text-align:center;\" ONKEYUP=\"javascript:CIRCLESformsEPSEDITOR_EVENTS( this.id, event );\"></td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td WIDTH=\"40\" ID=\"CIRCLESepseditorPAGESrangeLABEL\">(1-"+(CIRCLESformsEPSEDITOR_pages)+")</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsEPSEDITORopenPAGE( $( '#CIRCLESepseditorPAGEedit' ).val(), "+CIRCLESformsEPSEDITOR_pages+");\">Go</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CIRCLESepseditorPAGESforwardLABEL\" ONCLICK=\"javascript:CIRCLESformsEPSEDITORforwardPAGE();\">+</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CIRCLESepseditorPAGESbackwardLABEL\" ONCLICK=\"javascript:CIRCLESformsEPSEDITORbackwardPAGE();\">-</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;

        $( "#CIRCLESformsEPSEDITORpagespanelLABEL" ).html( HTMLcode );
    }
}

function CIRCLESformsEPSEDITORopenPAGE( _page, _max_page )
{
    var _codelist_ref = _glob_js_e_ps_obj.get_codelist_ref();
    var _code_size = safe_size( _codelist_ref, 0 );
    var _page = safe_int( _page, 0 ) - 1;
    if ( _page < 0 || _page > ( _max_page - 1 ) && _code_size > 0 )
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Invalid input page number: it shall range from 1 to " + ( _max_page ), _glob_app_title );
    else if ( _code_size > 0 )
    {
         CIRCLESformsEPSEDITOR_current_page = _page ;
         var _from = CIRCLESformsEPSEDITOR_max_entries_per_page * _page ;
         var _to = Math.min( _from + CIRCLESformsEPSEDITOR_max_entries_per_page, safe_size( _codelist_ref, 0 ) );
         var _eps_code = CIRCLESformsEPSEDITOR_pages > 0 ? _codelist_ref.from_to( _from, _to ).join( _glob_crlf ) : _glob_js_e_ps_obj.export_eps( _glob_crlf );
         $( "#CIRCLESepseditorPAGEfrom" ).html( _from + 1 );
         $( "#CIRCLESepseditorPAGEto" ).html( _to );
         $( "#CIRCLESformsEPSEDITORtextarea" ).val( _eps_code );
    }
}