function CIRCLESformsGENERALOPTIONScolorsTAB()
{
    var HTMLcode  = "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"10\"></td><tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>Line</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_default_line_clr+";\" ID=\"DEFAULTlinecolor\">"+( _glob_default_line_clr.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTlinecolorICON', 'DEFAULTlinecolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTlinecolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "<td WIDTH=\"30\"></td>" ;
        HTMLcode += "<td>Text</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_default_text_clr+";\" ID=\"DEFAULTtextcolor\">"+( _glob_default_text_clr.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTtextcolorICON', 'DEFAULTtextcolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTtextcolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "<td WIDTH=\"30\"></td>" ;
        HTMLcode += "<td>Axis</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_axis_color+";\" ID=\"DEFAULTaxiscolor\">"+( _glob_axis_color.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTaxiscolorICON', 'DEFAULTaxiscolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTaxiscolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"10\"></td><tr>" ;
        HTMLcode += "<tr>" ;

        HTMLcode += "<td WIDTH=\"30\"></td>" ;
        HTMLcode += "<td>Label text</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_label_text_color+";\" ID=\"DEFAULTlabeltextcolor\">"+( _glob_label_text_color.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTlabeltextcolorICON', 'DEFAULTlabeltextcolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTlabeltextcolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "<td WIDTH=\"30\"></td>" ;
        HTMLcode += "<td>Label dot</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_label_dot_color+";\" ID=\"DEFAULTlabeldotcolor\">"+( _glob_label_dot_color.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTlabeldotcolorICON', 'DEFAULTlabeldotcolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTlabeldotcolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"10\"></td><tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>Draw (seed)</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_draw_seed_color+";\" ID=\"DEFAULTdrawseedcolor\">"+( _glob_draw_seed_color.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTdrawseedcolorICON', 'DEFAULTdrawseedcolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTdrawseedcolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "<td WIDTH=\"30\"></td>" ;
        HTMLcode += "<td>Draw (inverse seed)</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_draw_inverse_seed_color+";\" ID=\"DEFAULTdrawinverseseedcolor\">"+( _glob_draw_inverse_seed_color.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTdrawinverseseedcolorICON', 'DEFAULTdrawinverseseedcolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTdrawinverseseedcolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "<td WIDTH=\"30\"></td>" ;
        HTMLcode += "<td>Draw (point)</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_pt_border_color+";\" ID=\"DEFAULTpointbordercolor\">"+( _glob_pt_border_color.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTpointbordercolorICON', 'DEFAULTpointbordercolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTpointbordercolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"10\"></td><tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>Fill (seed)</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_fill_seed_color+";\" ID=\"DEFAULTfillseedcolor\">"+( _glob_fill_seed_color.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTfillseedcolorICON', 'DEFAULTfillseedcolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTfillseedcolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "<td WIDTH=\"30\"></td>" ;
        HTMLcode += "<td>Fill (inverse seed)</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_fill_inverse_seed_color+";\" ID=\"DEFAULTfillinverseseedcolor\">"+( _glob_fill_inverse_seed_color.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTfillinverseseedcolorICON', 'DEFAULTfillinverseseedcolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTfillinverseseedcolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "<td WIDTH=\"30\"></td>" ;
        HTMLcode += "<td>Fill (point)</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_pt_interior_color+";\" ID=\"DEFAULTpointinteriorcolor\">"+( _glob_pt_interior_color.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTpointinteriorcolorICON', 'DEFAULTpointinteriorcolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTpointinteriorcolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
        HTMLcode += "<td WIDTH=\"5\"></td>" ;

        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"10\"></td><tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>Discreteness locus</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_default_discreteness_locus_clr+";\" ID=\"DEFAULTboundarycolor\">"+( _glob_default_discreteness_locus_clr.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTboundarycolorICON', 'DEFAULTboundarycolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTboundarycolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "<td WIDTH=\"30\"></td>" ;
        HTMLcode += "<td>Pleating ray</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_default_pleating_ray_clr+";\" ID=\"DEFAULTpleatingraycolor\">"+( _glob_default_pleating_ray_clr.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTpleatingraycolorICON', 'DEFAULTpleatingraycolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTpleatingraycolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "<td WIDTH=\"30\"></td>" ;
        HTMLcode += "<td>Pleating ray (selected)</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:24px;width:40px;text-align:center;background-color:"+_glob_default_pleating_ray_selected_clr+";\" ID=\"DEFAULTpleatingrayselectedcolor\">"+( _glob_default_pleating_ray_selected_clr.length == 0 ? "none" : "" )+"</td>";
        HTMLcode += "<td WIDTH=\"10\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'DEFAULTpleatingrayselectedcolorICON', 'DEFAULTpleatingrayselectedcolor' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"DEFAULTpleatingrayselectedcolorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";

        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"10\"></td><tr>" ;
        HTMLcode += "</table>" ;
        
        HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
          
        return HTMLcode ;
}

function CIRCLESformsGENERALOPTIONSbasicsTAB()
{
    var _sd_n = circles_lib_count_seeds(), _draw_color_check = 1, _fill_color_check = 1 ;
    for( var _i = 0 ; _i < _sd_n ; _i++ )
    {
        _draw_color_check &= is_circle( _glob_seeds_array[_i].complex_circle ) ? _glob_seeds_array[_i].complex_circle.draw : 0 ;
        _fill_color_check &= is_circle( _glob_seeds_array[_i].complex_circle ) ? _glob_seeds_array[_i].complex_circle.fill : 0 ;
    }

    var HTMLcode =  "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>Redirect actions to plane</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<SELECT ID=\"CIRCLESplaneredirectCOMBO\" ONCHANGE=\"javascript:CIRCLESformsGENERALOPTIONSredirectCOMBOonchange();\">" ;
        HTMLcode += "<OPTION "+( _glob_target_plane == Z_PLANE ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+Z_PLANE+"\">Z-plane</OPTION>" ;
        HTMLcode += "<OPTION "+( _glob_target_plane == W_PLANE ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+W_PLANE+"\">W-plane</OPTION>" ;
        HTMLcode += "<OPTION "+( _glob_target_plane == BIP_BOX ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+BIP_BOX+"\">Bip</OPTION>" ;
        HTMLcode += "</SELECT>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>Show symbols (Z-plane)</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"checkbox\" "+( _glob_show_symbols_zplane ? "CHECKED" : "" )+" ID=\"CIRCLEScheckboxSYMBOLSdisplayZPLANE\" ONCLICK=\"javascript:_glob_show_symbols_zplane=(this.checked)?1:0;\"></td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<td>Display limit sets by</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<SELECT ID=\"CIRCLESdisplayLScombo\" ONCHANGE=\"javascript:_glob_drawentity=this.options[this.selectedIndex].value;\">" ;
        HTMLcode += "<OPTION "+( _glob_drawentity == DRAWENTITY_PIXEL ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+DRAWENTITY_PIXEL+"\">Pixel</OPTION>" ;
        HTMLcode += "<OPTION "+( _glob_drawentity == DRAWENTITY_ISOMETRIC_CIRCLE ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+DRAWENTITY_ISOMETRIC_CIRCLE+"\">Circle</OPTION>" ;
        HTMLcode += "<OPTION "+( _glob_drawentity == DRAWENTITY_POINT ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+DRAWENTITY_POINT+"\">Point</OPTION>" ;
        HTMLcode += "</SELECT>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>Draw disks</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"checkbox\" "+( _sd_n > 0 ? ( _draw_color_check ? "CHECKED" : "" ) : _glob_wplane_disk_draw )+" ID=\"CIRCLEScheckboxDISKSdraw\" ONCLICK=\"javascript:_glob_wplane_disk_draw=(this.checked)?1:0;CIRCLESformsGENERALOPTIONSdisksdrawOPTIONSask();\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>Draw disk borders</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"checkbox\" "+( _glob_activate_dashed_border ? "CHECKED" : "" )+" ID=\"CIRCLEScheckboxBORDERdraw\" ONCLICK=\"javascript:_glob_activate_dashed_border=(this.checked)?1:0;$('[id$=renderBTN]').css('color',COLOR_ERROR) ;\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>(for layers not belonging to Z-plane)</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>Fill disks</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"checkbox\" "+( _sd_n > 0 ? ( _fill_color_check ? "CHECKED" : "" ) : _glob_wplane_disk_fill )+" ID=\"CIRCLEScheckboxDISKSfill\" ONCLICK=\"javascript:_glob_wplane_disk_fill=(this.checked)?1:0;CIRCLESformsGENERALOPTIONSdisksfillOPTIONSask();\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>Use colors palette</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"checkbox\" "+( _glob_palette_use ? "CHECKED" : "" )+" ID=\"CIRCLEScheckboxPALETTEuse\" ONCLICK=\"javascript:_glob_palette_use=(this.checked)?1:0;\"></td>" ;
        HTMLcode += "</tr>" ;
        
        var _check_ifs_random = ( _glob_method == METHOD_ALGEBRAIC && _glob_process == PROCESS_RANDOM ) ? YES : NO ;
        
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td COLSPAN=\"6\" VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr><td ID=\"CIRCLESgeneraloptionsIFSRANDOMlabel\" STYLE=\"color:"+DEFAULT_EDIT_COLOR_DISABLED+";\"><b>IFS Random Process</b></td><td WIDTH=\"30\"></td><td ID=\"CIRCLESgeneraloptionsLASTPT_OUTMSGlabel\"></td></tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">Use last point to seed the next rendering</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\"><INPUT TYPE=\"checkbox\" "+(_check_ifs_random?"":"DISABLED")+" "+( _glob_use_last_pt && _check_ifs_random ? "CHECKED" : "" )+" ID=\"CIRCLESgeneraloptionsUSELASTPTcheckbox\" ONCLICK=\"javascript:_glob_use_last_pt=(this.checked)?1:0;CIRCLESformsGENERALOPTIONSifsrandomOPTIONSmanager();\"></td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td ID=\"CIRCLESgeneraloptionsPICKUPonepointBTN\" STYLE=\"width:105px;background-color:#F4F4F4;color:"+DEFAULT_EDIT_COLOR_DISABLED+";\" CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_wplaneMOUSEprocSWITCH = _glob_wplaneMOUSEprocSWITCH == MOUSE_NO_PROC_ID ? MOUSE_PICK_LASTPT_PROC_ID : MOUSE_NO_PROC_ID ;this.value=_glob_wplaneMOUSEprocSWITCH==MOUSE_NO_PROC_ID?'Pick a point':'Switch picking off';\">Pick up one point</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">Scheduled rendering</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\"><INPUT TYPE=\"checkbox\" "+(_glob_use_last_pt && _check_ifs_random?"":"DISABLED")+" "+( _glob_scheduled_rendering_flag ? "CHECKED" : "" )+" ID=\"CIRCLESgeneraloptionsSCHEDULEDRENDERINGcheckbox\" ONCLICK=\"javascript:_glob_scheduled_rendering_flag=(this.checked)?1:0;CIRCLESformsGENERALOPTIONSifsrandomOPTIONSmanager();\"></td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td>Render again every</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<INPUT "+( ( !_check_ifs_random || !_glob_use_last_pt || !_glob_scheduled_rendering_flag ) ?"DISABLED":"")+" TYPE=\"edit\" VALUE=\""+_glob_scheduled_rendering_interval+"\" ID=\"CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeEDIT\" ONKEYUP=\"javascript:CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\" STYLE=\"color:"+(_glob_scheduled_rendering_flag?DEFAULT_EDIT_COLOR_ENABLED:DEFAULT_EDIT_COLOR_DISABLED)+";background-color:"+(_glob_scheduled_rendering_flag?DEFAULT_EDIT_BKCOLOR_ENABLED:DEFAULT_EDIT_BKCOLOR_DISABLED)+";width:30px;text-align:center;\">" ;
        HTMLcode += "</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td ID=\"CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeMINUTESlabel\">minute"+(_glob_scheduled_rendering_interval==1?"":"s")+"</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"2\"></td><tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td COLSPAN=\"5\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td>Last point</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<INPUT "+(!_glob_use_last_pt?"DISABLED":"")+" TYPE=\"edit\" ID=\"CIRCLESgeneraloptionsLASTPTcoordsEDIT\" VALUE=\""+( is_complex( _glob_last_pt ) ? _glob_last_pt.formula() : "" )+"\" ONKEYUP=\"javascript:CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\" STYLE=\"color:"+(_glob_use_last_pt?DEFAULT_COLOR_STD:DEFAULT_EDIT_COLOR_DISABLED)+";background-color:"+(_glob_use_last_pt?DEFAULT_EDIT_BKCOLOR_ENABLED:"#FAFAFA")+";width:320px;\">" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td COLSPAN=\"5\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">Density scan to pick up last pt</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\"><INPUT TYPE=\"checkbox\" "+(_glob_use_last_pt && _check_ifs_random?"":"DISABLED")+" "+( _glob_density_scan_flag ? "CHECKED" : "" )+" ID=\"CIRCLESgeneraloptionsDENSITYWEIGHTcheckbox\" ONCLICK=\"javascript:_glob_density_scan_flag=this.checked;circles_lib_extras_htmlctrl_enable('CIRCLESgeneraloptionsDENSITYWEIGHTcombo',_glob_density_scan_flag);\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">Pick up from regions with</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<SELECT "+(_glob_density_scan_flag?"":"DISABLED")+" STYLE=\"color:"+(_glob_density_scan_flag?DEFAULT_EDIT_COLOR_ENABLED:DEFAULT_EDIT_COLOR_DISABLED)+";background-color:"+(_glob_density_scan_flag?DEFAULT_EDIT_BKCOLOR_ENABLED:DEFAULT_EDIT_BKCOLOR_DISABLED)+";\" ONCHANGE=\"javascript:CIRCLESformsGENERALOPTIONSdensityCOMBOchange();\" ID=\"CIRCLESgeneraloptionsDENSITYWEIGHTcombo\">" ;
        var _levels = [ [ 0.1, "Desert", 30 ],
        								[ 0.5, "Pour", 30 ],
        								[ 1.0, "Unweighted", 30 ],
        								[ 1.3, "Crowded", 30 ],
        								[ 1.5, "Maximal", 30 ] ] ;
				$.each( _levels, function( _i, _chunk ) { HTMLcode += "<OPTION "+( _chunk[0]==_glob_density_weight_coeff?"SELECTED=\"selected\"":"" )+" VALUE=\""+_chunk[0]+"@"+_chunk[2]+"\">" + _chunk[1] ; } );
        HTMLcode += "</SELECT></td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">density</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"6\"></td><tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"6\" ALIGN=\"right\" STYLE=\"color:#454545;\">" ;
				HTMLcode += "<table><tr><td CLASS=\"link_rounded\" STYLE=\"width:110px;background-color:#F4F4F4;\" ONCLICK=\"javascript:CIRCLESformsGENERALOPTIONSscheduledrenderingAPPLY();\">Apply all settings</td></tr></table>" ;
				HTMLcode += "</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td><tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\" COLSPAN=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td><tr>" ;
        HTMLcode += "</table>" ;
        return HTMLcode ;
}

function CIRCLESformsGENERALOPTIONSzplanelayersTAB( this_fn_name ) { return CIRCLESformsGENERALOPTIONSlayersLIST( Z_PLANE, this_fn_name ); }
function CIRCLESformsGENERALOPTIONSwplanelayersTAB( this_fn_name ) { return CIRCLESformsGENERALOPTIONSlayersLIST( W_PLANE, this_fn_name ); }

function CIRCLESformsGENERALOPTIONSexportTAB()
{
      var HTMLcode  = "<table>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
          HTMLcode += "<tr><td STYLE=\"padding-left:10px;\"><b>SVG options</b></td><tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"175\">Draw dash line when border is off</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td><INPUT "+( _svg_allow_dashline_for_border_off ? "CHECKED" : "" )+" TYPE=\"radio\" NAME=\"SVGCANVASoriginRADIO\" ONCLICK=\"javascript:_svg_allow_dashline_for_border_off=YES;\"></td>" ;
          HTMLcode += "<td WIDTH=\"2\"></td>" ;
          HTMLcode += "<td>Yes</td>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td><INPUT "+( !_svg_allow_dashline_for_border_off ? "CHECKED" : "" )+" TYPE=\"radio\" NAME=\"SVGCANVASoriginRADIO\" ONCLICK=\"javascript:_svg_allow_dashline_for_border_off=NO;\"></td>" ;
          HTMLcode += "<td WIDTH=\"2\"></td>" ;
          HTMLcode += "<td>No</td>" ;
          HTMLcode += "<td WIDTH=\"20\"></td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "<td WIDTH=\"20\"></td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"15\"></td><tr>" ;

          HTMLcode += "<tr><td STYLE=\"padding-left:10px;\"><b>PS/EPS options</b></td><tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td>EPS language level</td>" ;
          HTMLcode += "<td WIDTH=\"3\"></td>" ;
          HTMLcode += "<td><SELECT ID=\"GENERALOPTIONSepsLANGLEVELcombo\" ONCHANGE=\"javascript:_glob_e_ps_language_level=$('#GENERALOPTIONSepsLANGLEVELcombo').val();\">" ;
          HTMLcode += "<OPTION VALUE=\"1\" "+( _glob_e_ps_language_level == 1 ? "SELECTED=\"selected\"" : "" )+">1" ;
          HTMLcode += "<OPTION VALUE=\"2\" "+( _glob_e_ps_language_level == 2 ? "SELECTED=\"selected\"" : "" )+">2" ;
          HTMLcode += "<OPTION VALUE=\"3\" "+( _glob_e_ps_language_level == 3 ? "SELECTED=\"selected\"" : "" )+">3" ;
          HTMLcode += "</SELECT></td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "<td WIDTH=\"20\"></td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"15\"></td><tr>" ;

          HTMLcode += "</table>" ;
          return HTMLcode ;
}

function CIRCLESformsGENERALOPTIONSextrasTAB()
{
      var HTMLcode  = "<table>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
          HTMLcode += "<tr>" ;                                                                  
          HTMLcode += "<td VALIGN=\"top\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"100\">Round values up to</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td><INPUT ID=\"CIRCLESgeneraloptionsSETTINGSaccuracyEDIT\" STYLE=\"width:40px;text-align:center;\" TYPE=\"edit\" VALUE=\""+_glob_accuracy+"\" ONCHANGE=\"javascript:CIRCLESformsGENERALOPTIONSaccuracyMANAGE();this.value=_glob_accuracy;\" ONKEYUP=\"javascript:_glob_accuracy=safe_int(this.value,DEFAULT_MAX_ACCURACY);CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\"></td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td>decimals (accuracy)</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"100\">Grid ticks</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td><INPUT ID=\"CIRCLESgeneraloptionsSETTINGSticksEDIT\" STYLE=\"width:40px;text-align:center;\" TYPE=\"edit\" VALUE=\""+_glob_ticks_count+"\" ONCHANGE=\"javascript:_glob_ticks_count=safe_int(this.value,8);this.value=_glob_ticks_count}; if (_glob_bip_use) _glob_bip_ticks = _glob_ticks_count ;this.value=_glob_ticks_count;\" ONKEYUP=\"javascript:_glob_ticks_count=safe_int(this.value,8);CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\"></td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "<td WIDTH=\"20\"></td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;

          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"100\">Disk visibility radius</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td><INPUT ID=\"SETTINGSdiskvisibilityradiusEDIT\" STYLE=\"width:80px;text-align:center;\" TYPE=\"edit\" VALUE=\""+_glob_disk_visibility_radius+"\" ONCHANGE=\"javascript:_glob_disk_visibility_radius=safe_float(this.value,DEFAULT_VISIBILITY_RADIUS);this.value=_glob_disk_visibility_radius;\" ONKEYUP=\"javascript:_glob_disk_visibility_radius=safe_float(this.value,DEFAULT_VISIBILITY_RADIUS);CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\"></td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;

          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"100\">Disk threshold radius</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td><INPUT ID=\"SETTINGSdiskthresholdradiusEDIT\" STYLE=\"width:80px;text-align:center;\" TYPE=\"edit\" VALUE=\""+_glob_disk_threshold_radius+"\" ONCHANGE=\"javascript:_glob_disk_threshold_radius=safe_float(this.value,0);\" ONKEYUP=\"javascript:_glob_disk_threshold_radius=safe_float(this.value,0);CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\"></td>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td>Operator</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td><SELECT ONCHANGE=\"javascript:_glob_disk_threshold_operator=this.options[this.selectedIndex].value\" ID=\"SETTINGSdiskthresholdradiusCOMBO\">" ;
          HTMLcode += "<OPTION "+( _glob_disk_threshold_operator == "" ? "SELECTED" : "" )+" VALUE=\"\">" ;
          HTMLcode += "<OPTION "+( _glob_disk_threshold_operator == "<" ? "SELECTED" : "" )+" VALUE=\"<\"><" ;
          HTMLcode += "<OPTION "+( _glob_disk_threshold_operator == "=" ? "SELECTED" : "" )+" VALUE=\"=\">=" ;
          HTMLcode += "<OPTION "+( _glob_disk_threshold_operator == ">" ? "SELECTED" : "" )+" VALUE=\">\">>" ;
          HTMLcode += "</SELECT>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;

  				var _smpr_perc = safe_int( _glob_smpr / _glob_zplane_rendering_layer_pointer.get_width() * 100.0, 1 );
          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"100\">Map precision</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td><INPUT ID=\"SETTINGSsmprEDIT\" STYLE=\"width:40px;text-align:center;\" TYPE=\"edit\" VALUE=\""+_glob_smpr+"\" ONBLUR=\"javascript:CIRCLESformsGENERALOPTIONSsmprMANAGER(3);\" ONCHANGE=\"javascript:CIRCLESformsGENERALOPTIONSsmprMANAGER();\" ONKEYUP=\"javascript:CIRCLESformsGENERALOPTIONSsmprMANAGER();CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\"></td>" ;
          HTMLcode += "<td WIDTH=\"2\"></td>" ;
          HTMLcode += "<td>pt</td>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td><INPUT ID=\"SETTINGSsmprPERC\" STYLE=\"width:40px;text-align:center;\" TYPE=\"edit\" VALUE=\""+_smpr_perc+"\" ONBLUR=\"javascript:CIRCLESformsGENERALOPTIONSsmprMANAGER(3);\" ONCHANGE=\"javascript:CIRCLESformsGENERALOPTIONSsmprMANAGER(2);\" ONKEYUP=\"javascript:CIRCLESformsGENERALOPTIONSsmprMANAGER(2);CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\"></td>" ;
          HTMLcode += "<td WIDTH=\"2\"></td>" ;
          HTMLcode += "<td>%</td>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"100\" CLASS=\"link_rounded\" ID=\"SETTINGSsmprBTN\" ONCLICK=\"javascript:CIRCLESformsGENERALOPTIONSsmprMANAGER(1);\">Set max precision</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;

          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"100\">Distance tolerance</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td COLSPAN=\"3\"><INPUT ID=\"SETTINGSdistancetoleranceEDIT\" STYLE=\"width:100px;\" TYPE=\"edit\" VALUE=\""+_glob_distance_tolerance+"\" ONCHANGE=\"javascript:_glob_distance_tolerance=safe_float(this.value,0.01);this.value=_glob_distance_tolerance;\" ONKEYUP=\"javascript:CIRCLESformsGENERALOPTIONSsmprMANAGER();CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\"></td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td>Type '-1' to force polyline drawing</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;

          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"100\">Workarea width</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td>" ;
          HTMLcode += "<SELECT ID=\"CIRCLESgeneraloptionsWORKAREAWIDTHcombo\" ONCHANGE=\"javascript:CIRCLESformsGENERALOPTIONSmastertableRESIZE();\">" ;
          var _percs = [ 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50 ] ;
          $.each( _percs, function( _i, _perc ) { HTMLcode += "<OPTION "+( _glob_masterdiv_width_percentage == _perc ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+_perc+"\">"+_perc+" %</OPTION>" ; } );
          HTMLcode += "</SELECT>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;

          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"100\">Pixel size</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td><INPUT ID=\"CIRCLESgeneraloptionsSETTINGSpixelsizeEDIT\" STYLE=\"width:26px;text-align:center;\" TYPE=\"edit\" VALUE=\""+_glob_pixel_size+"\" ONKEYUP=\"javascript:_glob_pixel_size=safe_float(this.value,0.01);this.value=_glob_pixel_size;CIRCLESformsGENERALOPTIONSsmprMANAGER();CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\"></td>" ;
          HTMLcode += "<td WIDTH=\"30\"></td>" ;
          HTMLcode += "<td>Redraw pass counter</td>" ;
          HTMLcode += "<td WIDTH=\"3\"></td>" ;
          HTMLcode += "<td><INPUT ID=\"CIRCLESgeneraloptionsSETTINGSredrawpasscounterEDIT\" STYLE=\"width:26px;text-align:center;\" TYPE=\"edit\" VALUE=\""+_glob_redraw_pass_counter+"\" ONKEYUP=\"javascript:_glob_redraw_pass_counter=Math.min( Math.abs( safe_int(this.value,1) ), 20 );this.value=_glob_redraw_pass_counter;\"></td>" ;
          HTMLcode += "<td WIDTH=\"3\"></td>" ;
          HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_canvas_redraw_wplane_entities(NO,'Multi-pass redrawing');\">Redraw</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;

          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"100\">Line width</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td><INPUT ID=\"CIRCLESgeneraloptionsSETTINGSbordersizeEDIT\" STYLE=\"width:40px;text-align:center;\" TYPE=\"edit\" VALUE=\""+_glob_line_width+"\" ONCHANGE=\"javascript:_glob_line_width=Math.max(0,safe_int(this.value,0));this.value=_glob_line_width;\" ONKEYUP=\"javascript:CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\"></td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;

          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td WIDTH=\"100\">Point border</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td><INPUT ID=\"SETTINGSpointborderEDIT\" STYLE=\"width:40px;text-align:center;\" TYPE=\"edit\" VALUE=\""+_glob_pt_border+"\" ONCHANGE=\"javascript:_glob_pt_border=safe_float(this.value,0);this.value=_glob_pt_border;\" ONKEYUP=\"javascript:CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\"></td>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "<td>Point radius</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td><INPUT ID=\"SETTINGSpointradiusEDIT\" STYLE=\"width:40px;text-align:center;\" TYPE=\"edit\" VALUE=\""+_glob_pt_radius+"\" ONCHANGE=\"javascript:_glob_pt_radius=safe_float(this.value,1);this.value=_glob_pt_radius;\" ONKEYUP=\"javascript:CIRCLESformsGENERALOPTIONSeventHANDLER( this.id, event );\"></td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;

          HTMLcode += "</table>" ;
          
          return HTMLcode ;
}