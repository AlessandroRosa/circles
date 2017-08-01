<table cellpadding=0 cellspacing=0 valign="top" HEIGHT="30" WIDTH="auto" ID="STATUSBAR"
			 ONMOUSEDOWN="javascript:CIRCLESbarsSTATUSBAReventsMOUSE( this.id, event );"
       STYLE="background-color:#EFEFEF;" CLASS="general_rounded_corners">
<tr><td HEIGHT="2"></td></tr>
<tr>
    <td VALIGN="top" HEIGHT="26">
    <table>
    <tr>
    <td WIDTH="2"></td>
    <td>
    <table>
    <tr>
    <td ONMOUSEDOWN="javascript:circles_lib_statusbar_drag_enable();CIRCLESbarsSTATUSBAReventsMOUSE( this.id, event );"
        ONMOUSEMOVE="javascript:CIRCLESbarsSTATUSBAReventsMOUSE( this.id, event );"
        ONMOUSEUP="javascript:circles_lib_statusbar_drag_disable();CIRCLESbarsSTATUSBAReventsMOUSE( this.id, event );"
        ID="STATUSBARdrag" WIDTH="26" ALIGN="center" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners"><IMG ID="STATUSBARdragICON" TITLE="Drag me" SRC="%path_to_img%icons/hand/hand.icon.01.20x20.png">
    </td>
    
    <td WIDTH="2"></td>
    <td>
    <table>
    <tr><td CLASS="link" ONCLICK="javascript:circles_lib_statusbar_reset();circles_lib_statusbar_load( 'vert', 'left', 'top', YES );"><IMG TITLE="Move left" SRC="%path_to_img%icons/bullets/bullet.left.12x12.png"></td></tr>
    <tr><td HEIGHT="2"></td></tr>
    <tr><td CLASS="link" ONCLICK="javascript:circles_lib_statusbar_reset();circles_lib_statusbar_load( 'vert', 'right', 'top', YES );"><IMG TITLE="Move right" SRC="%path_to_img%icons/bullets/bullet.right.12x12.png"></td></tr>
    </table>
    </td>
    
    <td WIDTH="2"></td>
    
    <td>
    <table>
    <tr><td><IMG CLASS="link" ONCLICK="javascript:circles_lib_statusbar_reset();circles_lib_statusbar_load( 'horz', 'left', 'top', YES );" TITLE="Move top" SRC="%path_to_img%icons/bullets/bullet.up.12x12.png"></td></tr>
    <tr><td HEIGHT="2"></td></tr>
    <tr><td><IMG CLASS="link" ONCLICK="javascript:circles_lib_statusbar_reset();circles_lib_statusbar_load( 'horz', 'left', 'bottom', YES );" TITLE="Move bottom" SRC="%path_to_img%icons/bullets/bullet.down.12x12.png"></td></tr>
    </table>
    </td>

    </tr>
    </table>
    </td>
    <td WIDTH="2"></td>
    <td ID="STATUSBARconfig" WIDTH="26" ALIGN="center" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners"></td>
    <td WIDTH="2"></td>
    <td ID="STATUSBARpopuplist" WIDTH="26" ALIGN="center" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners"><!--<IMG TITLE="Pop-ups List" SRC="%path_to_img%icons/menu/menu.icon.01.20x20.png">--></td>
    <td WIDTH="2"></td>
    <td ID="STATUSBARoutput" WIDTH="26" ALIGN="center" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners"></td>
    <td WIDTH="2"></td>
    <td ID="STATUSBARscreenshot" WIDTH="26" ALIGN="center" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners" ONMOUSEOVER="javascript:this.style.cursor='pointer';" ONCLICK="javascript:circles_lib_extras_capture_full_screenshot();"><IMG TITLE="Screenshot" SRC="%path_to_img%icons/eye/eye.01.20x20.png"></td>
    <td WIDTH="15"></td>
    <td HEIGHT="20" WIDTH="50" CLASS="link_rounded" ALIGN="center" ID="STATUSBARdrawdisksBTN" ONCLICK="javascript:_glob_zplaneMOUSEprocSWITCH=MOUSE_DRAWDISKS_PROC_ID;circles_lib_menu_entries_update();circles_lib_canvas_update_icons_bar('CANVASzplaneBAR');circles_lib_statusbar_update_elements();">Draw circles</td>
    <td WIDTH="1"></td>
    <td WIDTH="25" CLASS="link_rounded" ALIGN="center" ID="STATUSBARinitBTN" ONCLICK="javascript:circles_lib_items_init_wrapper_fn(null,YES,NO,_glob_init_mask,OUTPUT_SCREEN);">Init</td>
    <td WIDTH="1"></td>
    <td WIDTH="25" CLASS="link_rounded" ALIGN="center" ID="STATUSBARrenderBTN" ONCLICK="javascript:circles_lib_items_switch_to(_glob_items_switch,YES);circles_lib_canvas_process_ask(YES,NO,_glob_bip_use?BIP_BOX:_glob_target_plane,YES,YES,CHECK);">Render</td>
    <td WIDTH="1"></td>
    <td WIDTH="25" CLASS="link_rounded" ALIGN="center" ID="STATUSBARstopBTN" STYLE="color:#C0C0C0;" ONCLICK="javascript:CIRCLESmultithreadingSTOPworker();">Stop</td>
    <td WIDTH="10"></td>
    <td WIDTH="12" ID="STATUSBARcounting_entity_leftLABEL">Depth</td>
    <td WIDTH="2"></td>
    <td WIDTH="25" ALIGN="center"><INPUT ID="STATUSBARdepthEDIT" TYPE="edit" CLASS="datainput" STYLE="text-align:center;width:20px;" VALUE="1" ONKEYUP="javascript:CIRCLESbarsSTATUSBAReventsKEYCODE(this.id,event);"></td>
    <td WIDTH="2"></td>
    <td WIDTH="12" ID="STATUSBARcounting_entity_rightLABEL"></td>
    <td WIDTH="10"></td>
    <td WIDTH="20" CLASS="link_rounded" STYLE="font-size:10pt;" ALIGN="center" ONCLICK="javascript:circles_lib_depth_set( safe_int( $( '#STATUSBARdepthEDIT' ).val(), 0 ) + 1 );$('[id$=renderBTN]').css('color',COLOR_ERROR) ;">+</td>
    <td WIDTH="1"></td>
    <td WIDTH="20" CLASS="link_rounded" STYLE="font-size:10pt;" ALIGN="center" ONCLICK="javascript:circles_lib_depth_set( safe_int( $( '#STATUSBARdepthEDIT' ).val(), 0 ) - 1 );$('[id$=renderBTN]').css('color',COLOR_ERROR) ;">-</td>
    <td WIDTH="5"></td>
    <td WIDTH="10" ALIGN="right">Men&uacute;</td>
    <td WIDTH="2"></td>
    <td WIDTH="12" ALIGN="center"><INPUT TYPE="checkbox" CHECKED ID="CIRCLEScheckboxMENU" ONCLICK="javascript:circles_lib_menu_show_top();"></td>
    <td WIDTH="2"></td>
    <td WIDTH="50">
    <SELECT ID="statusbarWORKAREAWIDTHcombo" ONCHANGE="javascript:circles_lib_canvas_layer_mastertable_resize( safe_int( this.options[ this.selectedIndex ].value, 100 ) );">
    </SELECT>
    </td>
    <td></td>
    <td WIDTH="32" VALIGN="top" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners">
    <table ALIGN="center">
    <tr><td ALIGN="center" ID="STATUSBARextras"><td VALIGN="bottom" ID="STATUSBARotherAPPENDIX" STYLE="font-size:7pt;width:8px;"></td></tr>
    </table>
    </td>
    <td WIDTH="32" ALIGN="center" STYLE="background-color:#E8E8E8;padding-top:3px;" CLASS="general_rounded_corners"></td>
    <td WIDTH="1"></td>
    <td WIDTH="32" ID="STATUSBARaltKEY" ALIGN="center" CLASS="status_bar_key_btn_cell"></td>
    <td WIDTH="1"></td>
    <td WIDTH="32" ID="STATUSBARctrlKEY" ALIGN="center" CLASS="status_bar_key_btn_cell"></td>
    <td WIDTH="1"></td>
    <td WIDTH="32" ID="STATUSBARshiftKEY" ALIGN="center" CLASS="status_bar_key_btn_cell"></td>
    </tr>
    </table>
    </td>
    <td WIDTH="1"></td>
    <td WIDTH="12" ONCLICK="javascript:circles_lib_plugin_hide_all();" TITLE="Hide all pop-ups" CLASS="status_bar_hide_all_popups"></td>
</tr>
<tr><td HEIGHT="2"></td></tr>
</table>