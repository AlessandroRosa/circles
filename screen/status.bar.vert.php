<table cellpadding=0 cellspacing=0 valign="top" WIDTH="80" ID="STATUSBAR" ALIGN="center"
			 ONMOUSEDOWN="javascript:CIRCLESbarsSTATUSBAReventsMOUSE( this.id, event );"
       STYLE="background-color:#EFEFEF;" CLASS="general_rounded_corners">
<tr><td HEIGHT="2"></td></tr>
<tr>
    <td WIDTH="1"></td>
    <td VALIGN="top">
    <table ALIGN="center" WIDTH="67">
    <tr><td HEIGHT="2"></td></tr>
    <tr>
    <td WIDTH="2"></td>
    <td>
    <table>
    <tr>
    <td WIDTH="2"></td>
    <td ONMOUSEDOWN="javascript:circles_lib_statusbar_drag_enable();CIRCLESbarsSTATUSBAReventsMOUSE( this.id, event );"
        ONMOUSEMOVE="javascript:CIRCLESbarsSTATUSBAReventsMOUSE( this.id, event );"
        ONMOUSEUP="javascript:circles_lib_statusbar_drag_disable();CIRCLESbarsSTATUSBAReventsMOUSE( this.id, event );"
        ID="STATUSBARdrag" WIDTH="20" ALIGN="center" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners"><IMG ID="STATUSBARdragICON" TITLE="Drag me" SRC="%path_to_img%icons/hand/hand.icon.01.20x20.png"></td>
    <td WIDTH="2"></td>
    <td VALIGN="top">
    <table>
    <tr>
        <td CLASS="link" WIDTH="16" ONCLICK="javascript:circles_lib_statusbar_reset();circles_lib_statusbar_load( 'vert', 'left', 'top', YES );"><IMG TITLE="Move left" SRC="%path_to_img%icons/bullets/bullet.left.12x12.png"></td>
        <td WIDTH="2"></td>
        <td CLASS="link" WIDTH="16" ONCLICK="javascript:circles_lib_statusbar_reset();circles_lib_statusbar_load( 'vert', 'right', 'top', YES );"><IMG TITLE="Move right" SRC="%path_to_img%icons/bullets/bullet.right.12x12.png"></td>
    </tr>
    <tr><td HEIGHT="2"></td></tr>
    <tr>
        <td CLASS="link" WIDTH="16" ONCLICK="javascript:circles_lib_statusbar_reset();circles_lib_statusbar_load( 'horz', 'left', 'top', YES );"><IMG TITLE="Move top" SRC="%path_to_img%icons/bullets/bullet.up.12x12.png"></td>
        <td WIDTH="2"></td>
        <td CLASS="link" WIDTH="16" ONCLICK="javascript:circles_lib_statusbar_reset();circles_lib_statusbar_load( 'horz', 'left', 'bottom', YES );"><IMG TITLE="Move bottom" SRC="%path_to_img%icons/bullets/bullet.down.12x12.png"></td>
    </tr>
    </table>
    <td WIDTH="2"></td>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr><td HEIGHT="2"></td></tr>
    <tr>
    <td WIDTH="2"></td>
    <td VALIGN="top">
    <table>
    <tr>
    <td ID="STATUSBARconfig" HEIGHT="20" WIDTH="32" ALIGN="center" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners"></td>
    <td WIDTH="2"></td>
    <td ID="STATUSBARpopuplist" HEIGHT="20" WIDTH="32" ALIGN="center" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners"><!--<IMG TITLE="Pop-ups List" SRC="%path_to_img%icons/menu/menu.icon.01.20x20.png">--></td>
    </tr>
    </table>
    <td WIDTH="2"></td>
    </td>
    </tr>
    <tr><td HEIGHT="2"></td></tr>
    <tr>
    <td WIDTH="2"></td>
    <td VALIGN="top">
    <table>
    <tr>
    <td ID="STATUSBARoutput" HEIGHT="20" WIDTH="32" ALIGN="center" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners"></td>
    <td WIDTH="2"></td>
    <td ID="STATUSBARscreenshot" HEIGHT="20" WIDTH="32" ALIGN="center" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners" ONMOUSEOVER="javascript:this.style.cursor='pointer';" ONCLICK="javascript:circles_lib_extras_capture_full_screenshot();"><IMG TITLE="Screenshot" SRC="%path_to_img%icons/eye/eye.01.20x20.png"></td>
    </tr>
    </table>
    <td WIDTH="2"></td>
    </td>
    </tr>
    <tr><td HEIGHT="2"></td></tr>

    <tr>
    <td WIDTH="2"></td>
    <td HEIGHT="20" WIDTH="50" CLASS="link_rounded" ALIGN="center" ID="STATUSBARdrawdisksBTN" ONCLICK="javascript:_glob_zplaneMOUSEprocSWITCH=MOUSE_DRAWDISKS_PROC_ID;circles_lib_menu_entries_update();circles_lib_canvas_update_icons_bar('CANVASzplaneBAR');circles_lib_statusbar_update_elements();">Draw circles</td>
    </tr>
    <tr><td HEIGHT="2"></td></tr>

    <tr>
    <td WIDTH="2"></td>
    <td HEIGHT="20" WIDTH="50" CLASS="link_rounded" ALIGN="center" ID="STATUSBARdrawdisksBTN" ONCLICK="javascript:circles_lib_alphabet_autoconfig_all_symbols(!_glob_terminal_echo_flag,_glob_terminal_echo_flag,NO);">Auto-config</td>
    </tr>
    <tr><td HEIGHT="2"></td></tr>

    <tr>
    <td WIDTH="2"></td>
    <td HEIGHT="20" WIDTH="50" CLASS="link_rounded" ALIGN="center" ID="STATUSBARinitBTN" ONCLICK="javascript:circles_lib_items_init_wrapper_fn(null,YES,NO,_glob_init_mask,OUTPUT_SCREEN);">Init</td>
    </tr>
    <tr><td HEIGHT="2"></td></tr>
    <tr>
    <td WIDTH="2"></td>
    <td HEIGHT="20" WIDTH="50" CLASS="link_rounded" ALIGN="center" ID="STATUSBARrenderBTN" ONCLICK="javascript:circles_lib_set_target_plane(_glob_target_plane,YES);circles_lib_items_switch_to(_glob_items_switch,YES);circles_lib_canvas_process_ask(YES,NO,_glob_bip_use?BIP_BOX:_glob_target_plane,YES,YES,CHECK);">Render</td>
    </tr>
    <tr><td HEIGHT="2"></td></tr>
    <tr>
    <td WIDTH="2"></td>
    <td HEIGHT="20" WIDTH="50" CLASS="link_rounded" ALIGN="center" ID="STATUSBARstopBTN" STYLE="color:#C0C0C0;" ONCLICK="javascript:CIRCLESmultithreadingSTOPworker();">Stop</td>
    </tr>

    <tr><td HEIGHT="4"></td></tr>
    <tr>
    <td WIDTH="2"></td>
    <td WIDTH="50" VALIGN="top">
    <table>
    <tr>
    <td COLSPAN="3" WIDTH="50" VALIGN="top" ALIGN="center">
    <table ALIGN="center">
    <tr>
    <td WIDTH="2"></td>
    <td HEIGHT="20" STYLE="font-size:7pt;" ID="STATUSBARcounting_entity_leftLABEL">Depth</td>
    <td WIDTH="2"></td>
    <td HEIGHT="20" WIDTH="50" ALIGN="center"><INPUT ID="STATUSBARdepthEDIT" TYPE="edit" CLASS="datainput" STYLE="text-align:center;width:20px;" VALUE="1" ONKEYUP="javascript:CIRCLESbarsSTATUSBAReventsKEYCODE(this.id,event);"></td>
    <td WIDTH="2"></td>
    <td HEIGHT="20" STYLE="font-size:7pt;" ID="STATUSBARcounting_entity_rightLABEL"></td>
    <td WIDTH="2"></td>
    </tr>
    </table>
    </td>
    </tr>
    
    <tr><td HEIGHT="4"></td></tr>
    <tr>
    <td HEIGHT="20" WIDTH="50" CLASS="link_rounded" STYLE="font-size:10pt;" ALIGN="center" ONCLICK="javascript:circles_lib_depth_set( safe_int( $( '#STATUSBARdepthEDIT' ).val(), 0 ) + 1 );$('[id$=renderBTN]').css('color',COLOR_ERROR) ;">+</td>
    <td WIDTH="2"></td>
    <td HEIGHT="20" WIDTH="50" CLASS="link_rounded" STYLE="font-size:10pt;" ALIGN="center" ONCLICK="javascript:circles_lib_depth_set( safe_int( $( '#STATUSBARdepthEDIT' ).val(), 0 ) - 1 );$('[id$=renderBTN]').css('color',COLOR_ERROR) ;">-</td>
    </tr>
    </table>
    </td>
    </tr>

    <tr><td HEIGHT="6"></td></tr>
    <tr>
    <td WIDTH="2"></td>
    <td WIDTH="50" VALIGN="top" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners">
    <table>
    <tr>
    <td HEIGHT="20" WIDTH="50" ALIGN="right">Men&uacute;</td>
    <td WIDTH="2"></td>
    <td HEIGHT="20" WIDTH="50" ALIGN="center"><INPUT TYPE="checkbox" CHECKED ID="CIRCLEScheckboxMENU" ONCLICK="javascript:circles_lib_menu_show_top();"></td>
    </tr>
    <tr><td HEIGHT="2"></td></tr>
    <tr>
    <td WIDTH="50" COLSPAN="3" ALIGN="center">
    <SELECT ID="statusbarWORKAREAWIDTHcombo" ONCHANGE="javascript:circles_lib_canvas_layer_mastertable_resize( safe_int( this.options[ this.selectedIndex ].value, 100 ) );">
    </SELECT>
    </td>
    </tr>
    </table>
    </td>
    </tr>

    <tr><td HEIGHT="2"></td></tr>
    <tr>
    <td WIDTH="2"></td>
    <td VALIGN="top">
    <table>
    <tr>
    <td HEIGHT="20" WIDTH="32" VALIGN="top" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners">
    <table ALIGN="center">
    <tr><td VALIGN="bottom" ALIGN="center" ID="STATUSBARextras"><td VALIGN="bottom" ID="STATUSBARotherAPPENDIX" STYLE="font-size:7pt;width:8px;"></td></tr>
    </table>
    </td>
    <td WIDTH="2"></td>
    <td HEIGHT="20" WIDTH="32" ID="STATUSBARaltKEY" ALIGN="center" CLASS="status_bar_key_btn_cell"></td>
    </tr>
    </table>
    </td>
    </tr>

    <tr><td HEIGHT="2"></td></tr>
    <tr>
    <td WIDTH="2"></td>
    <td VALIGN="top">
    <table>
    <tr>
    <td HEIGHT="20" WIDTH="32" ID="STATUSBARctrlKEY" ALIGN="center" CLASS="status_bar_key_btn_cell"></td>
    <td WIDTH="2"></td>
    <td HEIGHT="20" WIDTH="32" ID="STATUSBARshiftKEY" ALIGN="center" CLASS="status_bar_key_btn_cell"></td>
    </tr>
    </table>
    </td>
    </tr>

    <tr><td HEIGHT="2"></td></tr>
    </table>
    </td>
    <td WIDTH="2"></td>
    <td WIDTH="6" ONCLICK="javascript:circles_lib_plugin_hide_all();" TITLE="Hide all pop-ups" CLASS="status_bar_hide_all_popups"></td>
</tr>
<tr><td HEIGHT="2"></td></tr>
</table>