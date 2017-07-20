function CIRCLESformsDISCRETENESSLOCUSdiagramBOX( POPUP_WIDTH, POPUP_HEIGHT )
{
    POPUP_WIDTH -= 4 ;
    var _coords_width = POPUP_WIDTH / 3 - 25 ;
    var _canvas_w = POPUP_WIDTH - 32, _canvas_h = POPUP_HEIGHT - 130 ;
    var HTMLcode = "<table ID=\"CIRCLESformsDISCRETENESSLOCUSleftPANEL\" WIDTH=\""+POPUP_WIDTH+"\">" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\">";
        HTMLcode += "<table>";
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td>Complex pt<td><td WIDTH=\"4\"></td><td HEIGHT=\"22\"><INPUT TYPE=\"edit\" STYLE=\"width:240px;\" ID=\"CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT\"></td>";
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSplotCOMPLEXPT(null,1);\"><IMG TITLE=\"Plot point\" ID=\"CIRCLESformsDISCRETENESSLOCUSplotCOMPLEXPTicon\" SRC=\"%imgpath%icons/brush/brush.icon.01.16x16.png\"></td>" ;
        HTMLcode += "</tr>";
        HTMLcode += "</table>";
        HTMLcode += "</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"left\"><CANVAS ID=\"CIRCLESdlocusdiagramCANVAS\" WIDTH=\""+_canvas_w+"\" HEIGHT=\""+_canvas_h+"\" STYLE=\"border:1px solid #E7E7E7;width:"+_canvas_w+"px;height:"+_canvas_h+"px;\" STYLE=\"background-color:white;\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\" ID=\"CIRCLESformsDISCRETENESSLOCUSmousecoordsPANEL\">";
        HTMLcode += "<table ALIGN=\"center\">";
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>X<td><td WIDTH=\"4\"></td><td CLASS=\"general_rounded_corners\" HEIGHT=\"16\" WIDTH=\""+_coords_width+"\" STYLE=\"font-size:7pt;background-color:#EAEAFB;padding:4px;\" ID=\"CIRCLESformsDISCRETENESSLOCUScoordsX\"></td>";
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td>Y<td><td WIDTH=\"4\"></td><td CLASS=\"general_rounded_corners\" HEIGHT=\"16\" WIDTH=\""+_coords_width+"\" STYLE=\"font-size:7pt;background-color:#EAEAFB;padding:4px;\" ID=\"CIRCLESformsDISCRETENESSLOCUScoordsY\"></td>";
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td CLASS=\"general_rounded_corners\" HEIGHT=\"16\" ALIGN=\"center\" WIDTH=\""+_coords_width+"\" STYLE=\"font-size:7pt;background-color:#F7F7F7;padding:4px;\" ID=\"CIRCLESformsDISCRETENESSLOCUStracefixLABEL\"></td>";
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "</tr>";
        HTMLcode += "</table>";
        HTMLcode += "</td></tr>" ;
        HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUSselectionlistBOX()
{
    var HTMLcode = "<table WIDTH=\"100%\" BORDER=\"0\">";
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\"><DIV ID=\"CIRCLESformsDISCRETENESSLOCUSselectionlistDIV\" STYLE=\"position:relative;width:100%;height:100%;overflow:auto;\"></DIV></td></tr>" ;
        HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUSfareyBOX()
{
    var HTMLcode  = "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td COLSPAN=\"3\">Farey sequence</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Order</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" VALUE=\"48\" ID=\"CIRCLESformsDISCRETENESSLOCUSorder\" STYLE=\"width:32px;text-align:center;\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Start frac</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ID=\"CIRCLESformsDISCRETENESSLOCUSstartFRAC\" STYLE=\"text-align:center;width:50px;\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" ALIGN=\"center\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Right frac</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ID=\"CIRCLESformsDISCRETENESSLOCUSendFRAC\" STYLE=\"text-align:center;width:50px;\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" ALIGN=\"center\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\" COLSPAN=\"3\"><table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td COLSPAN=\"3\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSfareyCOPY();\">Copy</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td COLSPAN=\"3\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSfareyRESTORE();\">Restore</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td COLSPAN=\"3\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSresetFAREY(YES);\">Reset</td>" ;
        HTMLcode += "</table></td></tr>" ;
        HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUScoordsBOX()
{
    var HTMLcode  = "<table>" ;
				HTMLcode += "<tr>" ;
				
				HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F6F6F6;padding:4px;\">" ;
				HTMLcode += "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td COLSPAN=\"3\">Locus coords</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Left</td><td WIDTH=\"5\"></td><td ID=\"CIRCLESformsDISCRETENESSLOCUSregionCOORDSleft\"></td><td WIDTH=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Right</td><td WIDTH=\"5\"></td><td ID=\"CIRCLESformsDISCRETENESSLOCUSregionCOORDSright\"></td><td WIDTH=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Top</td><td WIDTH=\"5\"></td><td ID=\"CIRCLESformsDISCRETENESSLOCUSregionCOORDStop\"></td><td WIDTH=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Bottom</td><td WIDTH=\"5\"></td><td ID=\"CIRCLESformsDISCRETENESSLOCUSregionCOORDSbottom\"></td><td WIDTH=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "</table>" ;
				HTMLcode += "</td>" ;

				HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUStuningsBOX()
{
    var HTMLcode = "<table WIDTH=\"100%\" BORDER=\"0\" ID=\"CIRCLESformsDISCRETENESSLOCUStuningsBOXcontainer\">";
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F8F8F8;padding:4px;\" VALIGN=\"top\">"+CIRCLESformsDISCRETENESSLOCUSmainBOX()+"</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F8F8F8;padding:4px;\" VALIGN=\"top\">"+CIRCLESformsDISCRETENESSLOCUSpleatingraysBOX()+"</td>" ;
        HTMLcode += "</tr>"
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

        HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUSdiagramCMDSbar( _w )
{
    var HTMLcode = "<table ALIGN=\"center\" WIDTH=\""+_w+"\" ALIGN=\"center\">";
        HTMLcode += "<tr><td ALIGN=\"center\" CLASS=\"link\" ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARmoveTOP\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSmoveCOORDS(1);\"><IMG SRC=\"%imgpath%icons/arrows/single/arrow.up.01.20x20.png\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" CLASS=\"link\" ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARmoveLEFT\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSmoveCOORDS(-2);\"><IMG SRC=\"%imgpath%icons/arrows/single/arrow.left.01.20x20.png\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" CLASS=\"link\" ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARmoveRIGHT\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSmoveCOORDS(2);\"><IMG SRC=\"%imgpath%icons/arrows/single/arrow.right.01.20x20.png\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" CLASS=\"link\" ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARmoveBOTTOM\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSmoveCOORDS(-1);\"><IMG SRC=\"%imgpath%icons/arrows/single/arrow.down.01.20x20.png\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" CLASS=\"link\" ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARzoomIN\" TITLE=\"Zoom in\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSzoom(+1);\"><IMG SRC=\"%imgpath%icons/zoom.in/zoom.in.icon.01.20x20.png\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" CLASS=\"link\" ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARzoomOUT\" TITLE=\"Zoom out\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSzoom(-1);\"><IMG SRC=\"%imgpath%icons/zoom.out/zoom.out.icon.01.20x20.png\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" CLASS=\"link\" ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARselectREGION\" TITLE=\"Zoom region\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSinitZOOMproc(YES,YES);\"><IMG ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARselectREGIONicon\" SRC=\"%imgpath%icons/lens/lens.icon.01.20x20.png\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" CLASS=\"link\" ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARpicker\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX_CLICK();\"><IMG TITLE=\"Pick for plug-ins\" ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARpickerICON\" SRC=\"%imgpath%icons/picker/picker.icon.00.20x20.png\"></td>" ;
        HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" CLASS=\"link\" ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARscreenshot\" ONCLICK=\"javascript:circles_lib_extras_capture_wnd_screenshot( 'CIRCLESdlocusdiagramCANVAS', 'circles.discreness.locus.screenshot.png' );\"><IMG TITLE=\"Screenshot\" SRC=\"%imgpath%icons/eye/eye.01.20x20.png\"></td>" ;
        HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" CLASS=\"link\" ID=\"CIRCLESformsDISCRETENESSLOCUSbuttonBARboundaryLIST\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSlistBOUNDARY();\"><IMG TITLE=\"Locus points list\" SRC=\"%imgpath%icons/list/list.icon.01.20x20.png\"></td>" ;
        HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUSupperMENU()
{
    var HTMLcode = "<table WIDTH=\"100%\">";
        HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
    		HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
    		HTMLcode += "<td VALIGN=\"middle\">" ;
    		HTMLcode += "<table>" ;
    		HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"25\" CLASS=\"link\" ONCLICK=\"javascript:$('#customloader').val('');$('#customloader').trigger('click');\" ID=\"CIRCLESformsDISCRETENESSLOCUSloadBTN\">Load</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td WIDTH=\"25\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSsaveCONFIG();\" ID=\"CIRCLESformsDISCRETENESSLOCUSsaveBTN\">Save</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td WIDTH=\"80\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSsquareresize();\" ID=\"CIRCLESformsDISCRETENESSLOCUSsquareresizeBTN\">Square diagram</td>" ;
        HTMLcode += "<td WIDTH=\"25\"></td>" ;
        HTMLcode += "<td ID=\"CIRCLESformsDLOCUSoutMSG\"></td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
    		HTMLcode += "</tr>" ;
    		HTMLcode += "</table>" ;
    		HTMLcode += "</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td ALIGN=\"center\" HEIGHT=\"18\" ID=\"CIRCLESformsDLOCUSmsgboxCONTAINER\"></td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
    		HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
    		HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUSupperBAR()
{
    var HTMLcode = "<table>";
       HTMLcode += "<tr><td WIDTH=\"5\"><td>Embedding</td><td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td>" ;
       HTMLcode += "<SELECT ID=\"CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO\" ONCHANGE=\"javascript:CIRCLESformsDISCRETENESSLOCUSsettingsLABELsSET();CIRCLESformsDISCRETENESSLOCUSembeddingCOMBOCHANGE();\">" ;
       HTMLcode += "<OPTION VALUE=\""+_DLOCUS_NONE+"\">" ;
       HTMLcode += "<OPTION VALUE=\""+_DLOCUS_MASKIT+"@%mu%\">Maskit T1,1" ;
       HTMLcode += "<OPTION VALUE=\""+_DLOCUS_GRANDMA+"@%mu%/i\">Grandma" ;
       HTMLcode += "<OPTION VALUE=\""+_DLOCUS_EARLE+"@%mu%\">Earle" ;
       HTMLcode += "<OPTION VALUE=\""+_DLOCUS_JORGENSEN+"@%mu%\">Jorgensen" ;
       HTMLcode += "</SELECT>" ;
       HTMLcode += "</td><td WIDTH=\"4\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( [ 4 ], YES );\">Render</td>";
       HTMLcode += "<td WIDTH=\"1\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:$('#CIRCLESformsDISCRETENESSLOCUSmainDIV').get(0).tabber.tabShow(0);CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( [ 8, 1, 64, 16, 32 ], YES );\">Redraw</td>";
       HTMLcode += "<td WIDTH=\"1\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSreset();\">Reset</td>";

       HTMLcode += "<td WIDTH=\"12\"></td>" ;
       HTMLcode += "<td ID=\"CIRCLESformsDISCRETENESSLOCUScheckboxCONTAINER\">" ;
       HTMLcode += "<table>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSfixregionCHECKBOX\"></td>";
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td>Fix region</td>";
       HTMLcode += "</tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode += "</td>" ;

       HTMLcode += "<td WIDTH=\"12\"></td>" ;
       HTMLcode += "<td ID=\"CIRCLESformsDISCRETENESSLOCUScombosCONTAINER\">" ;
       HTMLcode += "<table>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSsaveCOMBOonchange();\">Save</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td>" ;
       HTMLcode += "<SELECT ID=\"CIRCLESformsDISCRETENESSLOCUSsaveCOMBO\" ONCHANGE=\"javascript:CIRCLESformsDISCRETENESSLOCUSsaveCOMBOonchange();\">" ;
       HTMLcode += "<OPTION VALUE=\"0\">" ;
       HTMLcode += "<OPTION VALUE=\"1\">Locus" ;
       HTMLcode += "<OPTION VALUE=\"2\">Pix" ;
       HTMLcode += "<OPTION VALUE=\"3\">Eps" ;
       HTMLcode += "<OPTION VALUE=\"4\">Locus (csv)" ;
       HTMLcode += "</SELECT>" ;
       HTMLcode += "<td WIDTH=\"8\"></td>" ;
       HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUScopyCOMBOonchange();\">Copy</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td>" ;
       HTMLcode += "<SELECT ID=\"CIRCLESformsDISCRETENESSLOCUScopyCOMBO\" ONCHANGE=\"javascript:CIRCLESformsDISCRETENESSLOCUScopyCOMBOonchange();\">" ;
       HTMLcode += "<OPTION VALUE=\"0\">" ;
       HTMLcode += "<OPTION VALUE=\"1\">Locus" ;
       HTMLcode += "<OPTION VALUE=\"2\">Farey" ;
       HTMLcode += "<OPTION VALUE=\"3\">Both" ;
       HTMLcode += "</SELECT>" ;
       HTMLcode += "</td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode += "</td>" ;

       HTMLcode += "<td WIDTH=\"4\"></td>" ;
       HTMLcode += "</tr>";
       HTMLcode += "</table>";
       
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUSmainBOX()
{
    var _tmp_discreteness_locus = new discreteness_locus();
    var HTMLcode = "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Ticks (axes)</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" VALUE=\"16\" ID=\"CIRCLESformsDISCRETENESSLOCUSticks\" STYLE=\"width:32px;text-align:center;\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Clipboard copy</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSclipboardcopyCHECKBOX\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Pick for plug-ins</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX_CLICK();\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Record selected points</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSrecordselectedptsCHECKBOX\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Adapt view coords</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSrescaleCHECKBOX\" CHECKED></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Display fractions</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"checkbox\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSfracsCHECKBOX_CLICK();CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" ID=\"CIRCLESformsDISCRETENESSLOCUSdisplayfracsCHECKBOX\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>at every steps</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" STYLE=\"width:40px;text-align:center;color:#C0C0C0;\" VALUE=\"30\" ID=\"CIRCLESformsDISCRETENESSLOCUSdisplayfracstepsEDIT\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Show arrows</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"checkbox\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSarrowsCHECKBOX_CLICK();\" ID=\"CIRCLESformsDISCRETENESSLOCUSarrowsCHECKBOX\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>at every steps</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" STYLE=\"width:40px;text-align:center;color:#C0C0C0;\" DISABLED VALUE=\"20\" ID=\"CIRCLESformsDISCRETENESSLOCUSarrowstepsEDIT\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>arrow head size</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" STYLE=\"width:40px;text-align:center;color:#C0C0C0;\" DISABLED VALUE=\"10\" ID=\"CIRCLESformsDISCRETENESSLOCUSarrowheadsizeEDIT\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>arrow line size</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" STYLE=\"width:40px;text-align:center;color:#C0C0C0;\" DISABLED VALUE=\"2\" ID=\"CIRCLESformsDISCRETENESSLOCUSarrowlinewidth\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Draw shaft</td><td WIDTH=\"3\"></td><td><INPUT DISABLED CHECKED TYPE=\"checkbox\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSarrowsCHECKBOX_CLICK();CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" ID=\"CIRCLESformsDISCRETENESSLOCUSarrowsdrawshaftCHECKBOX\"></td></tr>" ;

        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td>Arrow color</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:16px;width:16px;text-align:center;background-color:"+CIRCLESformsDISCRETENESSLOCUSarrow_color+";\" ID=\"CIRCLESformsDISCRETENESSLOCUSarrowcolor\">"+( CIRCLESformsDISCRETENESSLOCUSarrow_color.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"5\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'CIRCLESformsDISCRETENESSLOCUSarrowcolorICON', 'CIRCLESformsDISCRETENESSLOCUSarrowcolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"CIRCLESformsDISCRETENESSLOCUSarrowcolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUSpleatingraysBOX()
{
    var _tmp_discreteness_locus = new discreteness_locus();
    var HTMLcode = "<table>" ;

        HTMLcode += "<tr><td WIDTH=\"3\"></td><td COLSPAN=\"3\">Pleating rays</td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Display</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSpleatingraysCHECKBOX\" ONCLICK=\"javascript:$('[id^=CIRCLESformsDISCRETENESSLOCUSpleatingraysEDIT]').prop('disabled',!this.checked);if(!this.checked)$('#CIRCLESformsDISCRETENESSLOCUSpleatingrayspositiveCHECKBOX,CIRCLESformsDISCRETENESSLOCUSpleatingraysnegativeCHECKBOX').prop('checked',false);\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Positive rays</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSpleatingrayspositiveCHECKBOX\"></td></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Negative rays</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSpleatingraysnegativeCHECKBOX\"></td></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Correction</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSpleatingrayscorrectionCHECKBOX\"></td></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Keep goin' up to max steps</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSpleatingrayskeepgoingCHECKBOX\"></td></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Max steps per each ray</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" VALUE=\""+( _tmp_discreteness_locus.get_pleating_rays_max_iterate() )+"\" ID=\"CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITmaxsteps\" STYLE=\"width:60px;text-align:center;\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Step rate</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" VALUE=\""+( _tmp_discreteness_locus.get_pleating_rays_step_rate() )+"\" ID=\"CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITsteprate\" STYLE=\"width:60px;text-align:center;\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Accuracy</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" VALUE=\""+( _tmp_discreteness_locus.get_pleating_rays_threshold_accuracy() )+"\" ID=\"CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITaccuracy\" STYLE=\"width:60px;text-align:center;\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Acceleration factor</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" VALUE=\""+( _tmp_discreteness_locus.get_pleating_rays_forward_factor() )+"\" ID=\"CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITforwardfactor\" STYLE=\"width:60px;text-align:center;\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Deceleration factor</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" VALUE=\""+( _tmp_discreteness_locus.get_pleating_rays_backward_factor() )+"\" ID=\"CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITbackwardfactor\" STYLE=\"width:60px;text-align:center;\"></td></tr>" ;

        HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUScalcBOX()
{
    var HTMLcode = "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Apply</td><td WIDTH=\"3\"></td><td COLSPAN=\"3\">" ;
        HTMLcode += "<SELECT ID=\"CIRCLESformsDISCRETENESSLOCUScalcBOXcombo\">" ;
        HTMLcode += "<OPTION VALUE=\"1\">Markov identity" ;
        HTMLcode += "</SELECT>" ;
        HTMLcode += "</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"60\">Trace a</td><td WIDTH=\"3\"></td><td WIDTH=\"180\"><INPUT TYPE=\"edit\" STYLE=\"width:180px;\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id, 1 );\" ID=\"CIRCLESformsDISCRETENESSLOCUScalcBOXtrA\"></td><td WIDTH=\"3\"></td><td WIDTH=\"20\"><INPUT TYPE=\"radio\" ID=\"CIRCLESformsDISCRETENESSLOCUScalcBOXradioA\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUScalcDISPATCHER( 'CIRCLESformsDISCRETENESSLOCUScalcBOXtrA' );\" NAME=\"CIRCLESformsDISCRETENESSLOCUScalcBOXradio\" CHECKED></td><td WIDTH=\"3\"></td><td>Calc me</td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"60\">Trace b</td><td WIDTH=\"3\"></td><td WIDTH=\"180\"><INPUT TYPE=\"edit\" STYLE=\"width:180px;\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id, 2 );\" ID=\"CIRCLESformsDISCRETENESSLOCUScalcBOXtrB\"></td><td WIDTH=\"3\"></td><td WIDTH=\"20\"><INPUT TYPE=\"radio\" ID=\"CIRCLESformsDISCRETENESSLOCUScalcBOXradioB\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUScalcDISPATCHER( 'CIRCLESformsDISCRETENESSLOCUScalcBOXtrB' );\" NAME=\"CIRCLESformsDISCRETENESSLOCUScalcBOXradio\"></td><td WIDTH=\"3\"></td><td>Calc me</td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"60\">Trace ab</td><td WIDTH=\"3\"></td><td WIDTH=\"180\"><INPUT TYPE=\"edit\" STYLE=\"width:180px;\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id, 3 );\" ID=\"CIRCLESformsDISCRETENESSLOCUScalcBOXtrAB\"></td><td WIDTH=\"3\"></td><td WIDTH=\"20\"><INPUT TYPE=\"radio\" ID=\"CIRCLESformsDISCRETENESSLOCUScalcBOXradioAB\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUScalcDISPATCHER( 'CIRCLESformsDISCRETENESSLOCUScalcBOXtrAB' );\" NAME=\"CIRCLESformsDISCRETENESSLOCUScalcBOXradio\"></td><td WIDTH=\"3\"></td><td>Calc me</td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"60\">Trace ABab</td><td WIDTH=\"3\"></td><td WIDTH=\"180\"><INPUT TYPE=\"edit\" STYLE=\"width:180px;\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id, 4 );\" ID=\"CIRCLESformsDISCRETENESSLOCUScalcBOXtrABab\"></td><td WIDTH=\"3\"></td><td WIDTH=\"20\"><INPUT TYPE=\"radio\" ID=\"CIRCLESformsDISCRETENESSLOCUScalcBOXradioABab\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUScalcDISPATCHER( 'CIRCLESformsDISCRETENESSLOCUScalcBOXtrABab' );\" NAME=\"CIRCLESformsDISCRETENESSLOCUScalcBOXradio\"></td><td WIDTH=\"3\"></td><td>Calc me</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td COLSPAN=\"7\" ID=\"CIRCLESformsDISCRETENESSLOCUScalcBOXoutMSG\"></td></tr>" ;
        HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUStraceBOX()
{
    var _tmp_discreteness_locus = new discreteness_locus();
    var HTMLcode = "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Start at</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" STYLE=\"width:120px;\" ID=\"CIRCLESformsDISCRETENESSLOCUStraceSTART\" VALUE=\"\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\"></td><td WIDTH=\"5\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Trace</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" STYLE=\"width:120px;\" ID=\"CIRCLESformsDISCRETENESSLOCUStraceA\" VALUE=\"\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\"></td><td WIDTH=\"5\"></td><td>of gen a</td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Trace</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" STYLE=\"width:120px;\" ID=\"CIRCLESformsDISCRETENESSLOCUStraceB\" VALUE=\"\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\"></td><td WIDTH=\"5\"></td><td>of gen b</td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Trace</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" STYLE=\"width:120px;\" ID=\"CIRCLESformsDISCRETENESSLOCUStraceCOMMUTATOR\" VALUE=\"\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\"></td><td WIDTH=\"5\"></td><td>of commutator ABab</td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Solution</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" STYLE=\"width:120px;\" ID=\"CIRCLESformsDISCRETENESSLOCUSeqSOLUTION\" VALUE=\"\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\"></td><td WIDTH=\"5\"><td>to converge</td><td WIDTH=\"5\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Accuracy</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" STYLE=\"width:120px;\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" VALUE=\""+( _tmp_discreteness_locus.get_accuracy() )+"\" ID=\"CIRCLESformsDISCRETENESSLOCUSaccuracy\"></td><td WIDTH=\"5\"></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Max iterate</td><td WIDTH=\"3\"></td><td><INPUT TYPE=\"edit\" STYLE=\"width:120px;\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\" VALUE=\""+( _tmp_discreteness_locus.get_max_iterate() )+"\" ID=\"CIRCLESformsDISCRETENESSLOCUSmaxstep\"></td><td WIDTH=\"5\"></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
		    HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsDISCRETENESSLOCUScuspBOX()
{
    var HTMLcode = "<table WIDTH=\"100%\">";

       HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
       HTMLcode += "<tr>";
       HTMLcode += "<td VALIGN=\"top\">";

       HTMLcode += "<table>";
       HTMLcode += "<tr>";
       HTMLcode += "<td WIDTH=\"10\"></td>" ;
       HTMLcode += "<td>Cusp</td>" ;
       HTMLcode += "<td WIDTH=\"6\"></td>" ;
       HTMLcode += "<td>p/q fraction</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td><INPUT ID=\"CIRCLESformsDISCRETENESSLOCUScuspFRAC\" TYPE=\"edit\" STYLE=\"width:80px;text-align:center;\" ONKEYUP=\"javascript:CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( event, this.id );\"></td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td>=</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td>Trace</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td><INPUT ID=\"CIRCLESformsDISCRETENESSLOCUScuspVALUE\" TYPE=\"edit\" STYLE=\"width:250px;\"></td>" ;
       HTMLcode += "</tr>";
       HTMLcode += "<tr>";
       HTMLcode += "<td COLSPAN=\"7\"></td>";
       HTMLcode += "<td>=</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td>Word</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td><INPUT ID=\"CIRCLESformsDISCRETENESSLOCUScuspWORD\" TYPE=\"edit\" STYLE=\"width:250px;\"></td>" ;
       HTMLcode += "</tr>";
       HTMLcode += "<tr>" ;
       HTMLcode += "<td COLSPAN=\"9\"></td>" ;
       HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\">" ;
       HTMLcode += "<table>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td>Trace transform</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:200px;\" ID=\"CIRCLESformsDISCRETENESSLOCUStraceTRANSFORMformula\" VALUE=\"%mu%\"></td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode += "</td>" ;
       HTMLcode += "</tr>" ;

       HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\" COLSPAN=\"12\">" ;

       HTMLcode += "<table>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td STYLE=\"color:#276BA8;\">Cusps</td>" ;
       HTMLcode += "<td WIDTH=\"5\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUScomputeCUSP();\">Compute</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSplotCOMPLEXPT(null,2);\">Plot</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUScuspCOMBO();\">List</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td ID=\"CIRCLESformsDISCRETENESSLOCUScuspcomboCONTAINER\" WIDTH=\"55\"></td>" ;
       HTMLcode += "<td WIDTH=\"23\"></td>" ;
       HTMLcode += "<td STYLE=\"color:#276BA8;\">Pleating ray</td>" ;
       HTMLcode += "<td WIDTH=\"5\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSpleatingrayLIST();\">List</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSpleatingrayDRAW();\">Draw</td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "</table>" ;

       HTMLcode += "</td>" ;
       HTMLcode += "</tr>" ;

       HTMLcode += "</table>";
       HTMLcode += "</td>";
       HTMLcode += "</tr>";

       HTMLcode += "</table>" ;
       
       return HTMLcode ;
}