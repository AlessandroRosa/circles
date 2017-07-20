<DIV STYLE="position:absolute;display:none;
						width:270px;
						padding:3px;
						background-color:#323232;
						opacity:0.86;
            -moz-opacity:0.86;
						z-index:8;
						filter:alpha('opacity=86');"
		 CLASS="general_rounded_corners"
		 ID="CANVASzplaneBAR">
<table cellpadding=0 cellspacing=0 valign="top" ALIGN="center">
<tr>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_zoom(Z_PLANE,1,NO,YES,YES);}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Zoom in" SRC="support/img/icons/zoom.in/zoom.in.icon.01.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_zoom(Z_PLANE,2,NO,YES,YES);}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Zoom out" SRC="support/img/icons/zoom.out/zoom.out.icon.01.16x16.png"></td>
    <td WIDTH="12"></td>
    <td><IMG CLASS="link" ONCLICK="javascript:circles_lib_coords_pickupyours_open_proc( Z_PLANE );" TITLE="Pick up your coordinates" SRC="support/img/icons/lens/lens.icon.01.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_process_ask(NO,YES,Z_PLANE,YES,YES,CHECK);}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Redraw Z-plane" SRC="support/img/icons/brush/brush.icon.01.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_coords_shift('left',Z_PLANE,YES,YES);}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Left" SRC="support/img/icons/bullets/bullet.left.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_coords_shift('right',Z_PLANE,YES,YES);}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Right" SRC="support/img/icons/bullets/bullet.right.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_coords_shift('up',Z_PLANE,YES,YES);}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Up" SRC="support/img/icons/bullets/bullet.up.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_coords_shift('down',Z_PLANE,YES,YES);}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Down" SRC="support/img/icons/bullets/bullet.down.16x16.png"></td>
		<td WIDTH="12"></td>
		<td ID="CANVASzplaneBARdrawdisks" STYLE="padding:2px;" CLASS="general_rounded_corners"><IMG CLASS="link" ONCLICK="javascript:_glob_zplaneMOUSEprocSWITCH=MOUSE_DRAWDISKS_PROC_ID;circles_lib_menu_entries_update();circles_lib_canvas_update_icons_bar('CANVASzplaneBAR');circles_lib_statusbar_update_elements();" TITLE="Draw disks" SRC="support/img/icons/select/select.icon.02.16x16.png"></td>
		<td WIDTH="12"></td>
		<td ID="CANVASzplaneBARselectdisks" STYLE="padding:2px;" CLASS="general_rounded_corners"><IMG CLASS="link" ONCLICK="javascript:_glob_zplaneMOUSEprocSWITCH=MOUSE_SELECTDISKS_PROC_ID;circles_lib_menu_entries_update();circles_lib_canvas_update_icons_bar('CANVASzplaneBAR');circles_lib_statusbar_update_elements();" TITLE="Select disks" SRC="support/img/icons/select/select.icon.01.16x16.png"></td>
		<td WIDTH="20"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_coords_reset( Z_PLANE );}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Reset" SRC="support/img/icons/refresh/refresh.01.icon.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:_glob_zplaneMOUSEprocSWITCH=MOUSE_PICK_POINTS_PROC_ID;var _layer_chunk=circles_lib_canvas_layer_get_topmost(Z_PLANE);$('#'+_layer_chunk['idcanvas']).css('cursor','crosshair');" TITLE="Pick points" SRC="support/img/icons/picker/picker.icon.01.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:_glob_zplaneMOUSEprocSWITCH=MOUSE_NO_PROC_ID;var _layer_chunk=circles_lib_canvas_layer_get_topmost(Z_PLANE);$('#'+_layer_chunk['idcanvas']).css('cursor','default');" TITLE="Default pointer" SRC="support/img/icons/mouse.pointers/cursor.icon.01.16x16.png"></td>
		<td WIDTH="12"></td>
		<td STYLE="color:white;font-size:7pt;" CLASS="link" ONCLICK="javascript:circles_lib_canvas_zplane_hide_bar();">Hide</td>
		<td WIDTH="12"></td>
</tr>
</table>
</DIV>

<DIV STYLE="position:absolute;display:none;
						width:210px;
						padding:3px;
						background-color:#323232;
						opacity:0.86;
            -moz-opacity:0.86;
						z-index:8;
						filter:alpha('opacity=86');"
		 CLASS="general_rounded_corners"
		 ID="CANVASwplaneBAR">
<table cellpadding=0 cellspacing=0 valign="top" ALIGN="center">
<tr>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_zoom(W_PLANE,1,YES,YES,NO);$('[id$=renderBTN]').css('color',COLOR_ERROR) ;}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Zoom in" SRC="support/img/icons/zoom.in/zoom.in.icon.01.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_zoom(W_PLANE,2,YES,YES,NO);$('[id$=renderBTN]').css('color',COLOR_ERROR) ;}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Zoom out" SRC="support/img/icons/zoom.out/zoom.out.icon.01.16x16.png"></td>
    <td WIDTH="12"></td>
    <td><IMG CLASS="link" ONCLICK="javascript:circles_lib_coords_pickupyours_open_proc( W_PLANE );" TITLE="Pick up coordinates" SRC="support/img/icons/lens/lens.icon.01.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_process_ask(NO,YES,W_PLANE,YES,YES,CHECK);}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Redraw W-plane" SRC="support/img/icons/brush/brush.icon.01.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_coords_shift( 'left', W_PLANE,YES,NO);circles_lib_canvas_redraw_wplane_entities( YES );}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Left" SRC="support/img/icons/bullets/bullet.left.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_coords_shift( 'right', W_PLANE,YES,NO);circles_lib_canvas_redraw_wplane_entities( YES );}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Right" SRC="support/img/icons/bullets/bullet.right.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_coords_shift( 'up', W_PLANE,YES,NO);circles_lib_canvas_redraw_wplane_entities( YES );}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Up" SRC="support/img/icons/bullets/bullet.up.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_coords_shift( 'down', W_PLANE,YES,NO);circles_lib_canvas_redraw_wplane_entities( YES );}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Down" SRC="support/img/icons/bullets/bullet.down.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:if(!_glob_worker_lock){circles_lib_canvas_coords_reset( W_PLANE );$('[id$=renderBTN]').css('color',COLOR_ERROR) ;}else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING,CIRCLES_WARNING_LABEL_03,_glob_app);" TITLE="Reset" SRC="support/img/icons/refresh/refresh.01.icon.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:_glob_wplaneMOUSEprocSWITCH=MOUSE_PICK_POINTS_PROC_ID;var _layer_chunk=circles_lib_canvas_layer_get_topmost(W_PLANE);$('#'+_layer_chunk['idcanvas']).css('cursor','crosshair');" TITLE="Pick points" SRC="support/img/icons/picker/picker.icon.01.16x16.png"></td>
		<td WIDTH="12"></td>
		<td><IMG CLASS="link" ONCLICK="javascript:_glob_wplaneMOUSEprocSWITCH=MOUSE_NO_PROC_ID;var _layer_chunk=circles_lib_canvas_layer_get_topmost(W_PLANE);$('#'+_layer_chunk['idcanvas']).css('cursor','default');" TITLE="Default pointer" SRC="support/img/icons/mouse.pointers/cursor.icon.01.16x16.png"></td>
		<td WIDTH="12"></td>
		<td STYLE="color:white;font-size:7pt;" CLASS="link" ONCLICK="javascript:circles_lib_canvas_wplane_hide_bar();">Hide</td>
		<td WIDTH="12"></td>
</tr>
</table>
</DIV>