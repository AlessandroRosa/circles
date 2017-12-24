if ( is_canvas_supported() && is_multithreading_compatible() )
{
    var _sw = $(window).width(), _sh = $(window).height() ;
    alert_plug_label( ALERT_YES, "Start the application" );
    alert_plug_label( ALERT_NO, "Are you a newbie ? ... read the docs" );
    var _cmd = "_glob_app_run=YES;circles_lib_lang_init();circles_lib_canvas_coords_acquire( ALL_PLANES );circles_lib_menu_resize_top();circles_lib_interface_prepare();circles_lib_interface_render();" ;
        _cmd += "circles_lib_canvas_layer_pile_init(ALL_PLANES,"+_glob_canvas_width+",YES);";
        _cmd += "circles_lib_recalc_screen_disks_coords( zplane_sm );";
        _cmd += "circles_lib_masterdiv_display(1);";
        _cmd += "circles_lib_canvas_render_zplane(null,null,null,YES,YES,YES,NO,YES,YES,OUTPUT_SCREEN);" ;
        _cmd += "circles_lib_canvas_render_wplane(null,null,null,YES,YES,NO,YES,NO,YES,OUTPUT_SCREEN);" ;
        _cmd += "CIRCLESgetMETRICS();circles_lib_statusbar_init();circles_lib_menu_entries_update();_window_resize_ext();" ;
    alert_set_fontsize( "12pt" ) ;
    alert_set_btns_height( "32px" ) ;
    alert_plug_fn( ALERT_YES, "alertCLOSE();" + _cmd );
    alert_plug_fn( ALERT_NO, "window.open( _glob_path_to_circles + 'docs/circles.docs.php', 'CIRCLESdocsWND', '' );" );
    alert_msg( ALERT_YESNO | ALERT_NOICON | ALERT_NOCAPTION, circles_lib_splash_screen_code(), _glob_app_title, _sw > 690 ? 690 : _sw - 30, 0, null, 0, 100 );
}
else
{
    var _html_code = circles_lib_splash_screen_code( _glob_appLASTreleaseDATE );
        _html_code += "<table cellpadding=0 cellspacing=0 valign=\"top\" ALIGN=\"center\">" ;
        _html_code += "<tr><td HEIGHT=\"12\"></td></tr>" ;
				_html_code += "<tr><td STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\" ALIGN=\"center\">I'm sorry but this application can't run on your system:</td></tr>";
				if ( !is_canvas_supported() ) _html_code += "<tr><td>your browser does not support canvas</td></tr><tr><td HEIGHT=\"12\"></td></tr>";
				if ( !is_multithreading_compatible() ) _html_code += "<tr><td>your browser version does not support multi-threading</td></tr>";
        _html_code += "<tr><td HEIGHT=\"12\"></td></tr>" ;
				_html_code += "</table>" ; 
    alert_msg( ALERT_NOBUTTON | ALERT_NOICON | ALERT_NOCAPTION, _html_code, _glob_app_title, 580, 0, null, 0, 100 );
}