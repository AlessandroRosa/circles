function CIRCLESformsTINYRENDERINGclose( _REF_ID ) { circles_lib_plugin_dispatcher_unicast_message( "tiny.rendering", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE, ""+_REF_ID ); }
function CIRCLESformsTINYRENDERINGfocus( _REF_ID ) { circles_lib_plugin_dispatcher_unicast_message( "tiny.rendering", "forms", POPUP_DISPATCHER_UNICAST_EVENT_FOCUS, ""+_REF_ID ); }
function CIRCLESformsTINYRENDERINGmain( _base_id, _move, _show_code, _clone_ref_id )
{
   CIRCLESformsTINYRENDERINGbaseid = safe_string( _base_id, "" ) ;
   _move = safe_int( _move, YES ), _show_code = safe_int( _show_code, YES );
   var _settings_array = [] ;
       _settings_array['target_plane_type'] = "bip" ;
   var _filename = "circles.terminal.cmd.code.js" ;
   if ( check_file_exists( _glob_paths['terminal_cmds_path'] + _filename ) )
   {
       var _plain_code = "", _load_failure = 0 ;
       $.ajaxSetup( {async:false} );
       $.getScript( _glob_paths['terminal_cmds_path'] + _filename).done( function() { _load_failure = 0, _plain_code = _show_code ? circles_terminal_cmd_code_assemble( null, _settings_array ) : "" ; } ).fail( function() { load_failure = 1 ; circles_lib_log_add_entry( "Component '"+_filename+"' code can't be loaded to support tiny rendering service", LOG_ERROR ); } ) ;

       var unixtime_ms = new Date().getTime();
       if ( !is_array( _glob_tinyrender_code_array ) ) _glob_tinyrender_code_array = [];
       _glob_tinyrender_code_array[unixtime_ms+""] = _plain_code ;
       var WIDTH = $( window ).width() * 0.5, HEIGHT = "auto", _subset = "forms" ;
       var _CANVAS_W = WIDTH - 16, _CANVAS_H = 160 ;
       var _div_id = CIRCLESformsTINYRENDERINGdiv_id = circles_lib_plugin_build_divid( _subset, _base_id, unixtime_ms ) ;
       var _REF_ID = unixtime_ms ;
       var CLOSE_FN = "CIRCLESformsTINYRENDERINGclose("+unixtime_ms+");" ;
       var FOCUS_FN = "CIRCLESformsTINYRENDERINGfocus("+unixtime_ms+");" ;
       var HTMLcode = "<table WIDTH=\"100%\">" ;
       HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsTINYRENDERINGcaption, 3, YES, CLOSE_FN,
                   "auto", HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "", FOCUS_FN );
       HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td VALIGN=\"top\">" ;
       HTMLcode += "<table WIDTH=\"100%\">" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td VALIGN=\"top\">" ;
       HTMLcode += "<div id=\"CIRCLESformsTINYRENDERING"+_REF_ID+"mainDIV\" STYLE=\"width:"+(WIDTH-12)+"px;height:auto;\" class=\"tabber\">" ;

       HTMLcode += "<div class=\"tabbertab\" VALIGN=\"top\" STYLE=\"width:"+(WIDTH-12)+"px;height:auto;\" ID=\"CIRCLESformsTINYRENDERING"+_REF_ID+"_TAB_01\">" ;
       HTMLcode += "<h2>Script</h2>" ;
       HTMLcode += "<TEXTAREA ID=\"CANVASscripttextarea"+_REF_ID+"\" STYLE=\"width:"+(WIDTH-20)+"px;height:"+(_CANVAS_H-15)+"px;overflow:auto;\" CLASS=\"scripttext\">"+_plain_code+"</TEXTAREA>" ;
       HTMLcode += "</div>" ;

       HTMLcode += "<div class=\"tabbertab\" VALIGN=\"top\" STYLE=\"width:"+(WIDTH-12)+"px;height:auto;\" ID=\"CIRCLESformsTINYRENDERING"+_REF_ID+"_TAB_02\">" ;
       HTMLcode += "<h2>Debug</h2>" ;
       HTMLcode += "<DIV ID=\"CANVASdebugdiv"+_REF_ID+"\" STYLE=\"position:relative;width:"+_CANVAS_W+"px;height:"+(_CANVAS_H-15)+"px;\" CLASS=\"scripttext\"></DIV>" ;
       HTMLcode += "</div>" ;

       HTMLcode += "<div class=\"tabbertab\" VALIGN=\"top\" STYLE=\"width:"+(WIDTH-12)+"px;height:auto;\" ID=\"CIRCLESformsTINYRENDERING"+_REF_ID+"_TAB_03\">" ;
       HTMLcode += "<h2>Preview</h2>" ;
       HTMLcode += "<CANVAS ID=\"CANVASrendering"+_REF_ID+"\" WIDTH=\""+_CANVAS_W+"\" HEIGHT=\""+_CANVAS_H+"\" STYLE=\"border:1px dotted #C0C0C0;width:"+_CANVAS_W+"px;height:"+_CANVAS_H+"px;\"></CANVAS>" ;
       HTMLcode += "</div>" ;

       HTMLcode += "</div>" ;

       HTMLcode += "</td>" ;
       HTMLcode += "<td WIDTH=\"5\"></td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode += "</td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;

       HTMLcode += "<tr>" ;
       HTMLcode += "<td VALIGN=\"top\" WIDTH=\"100%\" CLASS=\"popup_buttons_bar\">" ;
       HTMLcode += "<table WIDTH=\"100%\">" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td CLASS=\"general_rounded_corners\" HEIGHT=\"16\" STYLE=\"padding:5px;background-color:#FAFAFA;\" ID=\"CANVASwarningsSTATUS"+_REF_ID+"\" ALIGN=\"center\"></td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"general_rounded_corners\" HEIGHT=\"16\" STYLE=\"padding:5px;background-color:#FAFAFA;\" ID=\"CANVASerrorsSTATUS"+_REF_ID+"\" ALIGN=\"center\"></td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"general_rounded_corners\" HEIGHT=\"16\" STYLE=\"padding:5px;background-color:#FAFAFA;\" ID=\"CANVASokSTATUS"+_REF_ID+"\" ALIGN=\"center\"></td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode += "</td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;

       HTMLcode += "<tr>" ;
       HTMLcode += "<td VALIGN=\"top\" WIDTH=\"100%\" CLASS=\"popup_buttons_bar\">" ;
       HTMLcode += "<table>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td WIDTH=\"5\"></td>" ;
       HTMLcode += "<td WIDTH=\"25\">Code</td>" ;
       HTMLcode += "<td WIDTH=\"5\"></td>" ;
       HTMLcode += "<td "+(_load_failure?"":"CLASS=\"link_rounded\"")+" "+(_load_failure?"":"ONCLICK=\"javascript:CIRCLESformsTINYRENDERINGgetCODE('"+_div_id+"','"+_REF_ID+"');\"")+" STYLE=\"color:"+(_load_failure?DEFAULT_EDIT_COLOR_DISABLED:DEFAULT_EDIT_COLOR_ENABLED)+";\">Get</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsTINYRENDERINGscriptRUN('"+_div_id+"','"+_REF_ID+"');\">Run</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsTINYRENDERINGcleanCODE('"+_div_id+"','"+_REF_ID+"');\">Clean</td>" ;
       HTMLcode += "<td WIDTH=\"10\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CANVASbtn04"+_REF_ID+"\" ONCLICK=\"javascript:CIRCLESformsTINYRENDERINGscriptSAVEFILE('"+_div_id+"','"+_REF_ID+"');\">Save to file</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CANVASbtn05"+_REF_ID+"\" ONCLICK=\"javascript:CIRCLESformsTINYRENDERINGpdf('"+_div_id+"','"+_REF_ID+"');\">PDF</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CANVASbtn08"+_REF_ID+"\" ONCLICK=\"javascript:circles_lib_plugin_load('"+_subset+"','"+_base_id+"',NO,'"+_REF_ID+"',YES);\">Clone me</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td WIDTH=\"110\" ID=\"CIRCLEStinyrenderingOUTPUT"+_REF_ID+"\"></td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode += "</td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td VALIGN=\"top\" WIDTH=\"100%\" CLASS=\"popup_buttons_bar\">" ;
       HTMLcode += "<table>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td WIDTH=\"2\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CANVASbtn07"+_REF_ID+"\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','tiny.rendering', NO, '', NO );\">New</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" id=\"clipboard_code"+_REF_ID+"\" WIDTH=\"100\" ONCLICK=\"javascript:copy_to_clipboard('CANVASscripttextarea"+_REF_ID+"');\">Script into clipboard</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" id=\"clipboard_debug"+_REF_ID+"\" WIDTH=\"100\" ONCLICK=\"javascript:copy_to_clipboard('CANVASdebugdiv"+_REF_ID+"');\">Debug into clipboard</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CANVASbtn06"+_REF_ID+"\" WIDTH=\"100\" ONCLICK=\"javascript:CIRCLESformsTINYRENDERINGcopyCANVAS('"+_div_id+"','"+_REF_ID+"', YES );\">Copy from W-plane</td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode += "</td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

       CIRCLESformsTINYRENDERINGtabberOptions['prefix'] = "CIRCLESformsTINYRENDERING" +_REF_ID ;

       GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
       if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
       _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

       var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
       circles_lib_plugin_activate( YES, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsTINYRENDERINGcaption );
       if ( _move && _div != null ) move_div( _div.id, "LEFT", "TOP" );
              
       tabberAutomatic( CIRCLESformsTINYRENDERINGtabberOptions, "CIRCLESformsTINYRENDERING"+_REF_ID );

       if ( object_exists( _clone_ref_id ) ) CIRCLESformsTINYRENDERINGclonePOPUP( _clone_ref_id, _div_id, _REF_ID );
       else CIRCLESformsTINYRENDERINGcopyCANVAS( _div_id, _REF_ID, NO );

       var _tabber_w = safe_int( $("#"+_div_id).width() - $( "#CANVASrendering" + _REF_ID ).width(), 0 ) ;
       var _tabber_h = safe_int( $("#"+_div_id).height() - $( "#CANVASrendering" + _REF_ID ).height(), 0 ) ;
       $( "#CIRCLESformsTINYRENDERING"+_REF_ID+"mainDIV" ).width( _tabber_w - 12 ) ;
       $( "#CANVASscripttextarea"+_REF_ID ).width( _tabber_w - 10 - 16 ) ;
       $( "#CANVASscripttextarea"+_REF_ID ).height( _tabber_h - 10 - 24 ) ;
       $( "#CANVASscriptdiv"+_REF_ID ).height( $( "#CANVASscriptdiv"+_REF_ID ).height() - 10 );
       $("#CANVASrendering" + _REF_ID ).get(0).set_type( BIP_BOX ) ;
   }
   else
   {
       var _msg = "Missing or corrupted component 'code' cmd to support tiny rendering service" ;
       circles_lib_log_add_entry( _msg, LOG_ERROR );
       circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
   }
}

function CIRCLESformsTINYRENDERINGcleanCODE( _div_id, _REF_ID, _silent )
{
    _silent = safe_int( _silent, NO );
    var _code = $( "#CANVASscripttextarea" + _REF_ID ).val().trim() ;
    if ( _code.length > 0 )
    {
      var _msg = "Do you want to overwrite the existing code ?" ;
      var _b_go = _code.length > 0 ? ( _silent ? YES : confirm( _msg ) ) : YES ;
      if ( _b_go ) $( "#CANVASscripttextarea" + _REF_ID ).val( "" );
      return _b_go ;
    }
    else return YES ;
}

function CIRCLESformsTINYRENDERINGgetCODE( _div_id, _REF_ID, _silent )
{
    _silent = safe_int( _silent, NO );
    var _code = $( "#CANVASscripttextarea" + _REF_ID ).val().trim(), _b_set = NO ;
    var _settings_array = [] ;
        _settings_array['target_plane_type'] = "bip" ;
    var _plain_code = circles_terminal_cmd_code_assemble( null, _settings_array ) ;
    if ( _plain_code.length > 0 ) _b_set = CIRCLESformsTINYRENDERINGcleanCODE( _div_id, _REF_ID, _silent ) ;
    else _b_set = YES ;
    if ( _b_set ) $( "#CANVASscripttextarea" + _REF_ID ).val( _plain_code );
}

function CIRCLESformsTINYRENDERINGpdf( _div_id, _REF_ID )
{
    var _tiny_canvas = $("#CANVASrendering" + _REF_ID ).get(0);
    circles_lib_files_pdf_save_ask( circles_lib_files_pdf_save_report, NO, OUTPUT_SCREEN, CALLER_TYPE_NONE,
											 is_html_canvas( _tiny_canvas ) ? _tiny_canvas.get_type() : NO_PLANE, "#CANVASrendering" + _REF_ID, NO, YES );
}

function CIRCLESformsTINYRENDERINGclonePOPUP( _clone_ref_id, _div_id, _REF_ID )
{
    $("#CANVASscripttextarea" + _REF_ID ).val( $("#CANVASscripttextarea" + _clone_ref_id ).val() );

    var _src_debug_div = $( "#CANVASdebugdiv" + _clone_ref_id ).get(0);
    var _dest_debug_div = $( "#CANVASdebugdiv" + _REF_ID ).get(0);
    if ( _src_debug_div != null && _dest_debug_div != null ) $( "#CANVASdebugdiv" + _REF_ID ).html( _src_debug_div.innerHTML ) ;

    var _src_canvas = $( "#CANVASrendering" + _clone_ref_id ).get(0);
    var _dest_canvas = $( "#CANVASrendering" + _REF_ID ).get(0);
    var _dest_context = is_html_canvas( _dest_canvas ) ? _dest_canvas.getContext( _glob_canvas_ctx_2D_mode ) : null ;

    var _zplane_size = is_html_canvas( _src_canvas ) ? _src_canvas.get_width() : 0 ;
    var _dest_size = is_html_canvas( _dest_canvas ) ? _dest_canvas.get_width() : 0 ;
    if ( is_html_canvas( _src_canvas ) && is_html_canvas( _dest_canvas ) ) _dest_context.drawImage( _src_canvas, 0, 0, _dest_size, _dest_size );
}

function CIRCLESformsTINYRENDERINGcopyCANVAS( _div_id, _REF_ID, _clean )
{
    _clean = safe_int( _clean, YES );
    var _dest_canvas = $("#CANVASrendering" + _REF_ID ).get(0);
    var _dest_context = is_html_canvas( _dest_canvas ) ? _dest_canvas.getContext( _glob_canvas_ctx_2D_mode ) : null ;
    if ( _dest_context != null )
    {
        if ( _clean ) circles_lib_canvas_clean( _dest_canvas, "transparent" );
        circles_lib_canvas_copy( _glob_wplane_rendering_layer_placeholder, _dest_canvas ) ;
    }
}

function CIRCLESformsTINYRENDERINGscriptRUN( _div_id, _REF_ID )
{
    $( "#CIRCLESformsTINYRENDERING"+_REF_ID+"mainDIV" ).get(0).tabber.tabShow(1);

    var _tiny_canvas = $( "#CANVASrendering" + _REF_ID ).get(0);
    _glob_tiny_rendering_ref_id = _REF_ID ;
		_glob_output_channel = OUTPUT_SCRIPT ;
    _glob_bipbox_canvas = _tiny_canvas ;
    _glob_bipbox_canvas.set_dims( _tiny_canvas.get_width(), _tiny_canvas.get_height() );
    _glob_bipbox_canvas.set_type( BIP_BOX ) ;
    _glob_bip_use = YES ;
    _glob_persistent_vars['old_plane_type'] = _glob_target_plane ;
    _glob_target_plane = BIP_BOX ;
    _glob_bip_original_plane_data = W_PLANE ;    // what to draw
    _glob_bip_original_plane_coords = W_PLANE ;  // where to pick up coordinates from
    
    var coords_pts_array = wplane_sm.get_coords_corners();
    var _lu_pt = coords_pts_array['lu'], _rd_pt = coords_pts_array['rd'] ;
    bipbox_sm.set_coords_corners( _lu_pt, _rd_pt );

    var _canvas_side = _glob_bipbox_canvas.get_width(), _rect = new rect();
    _rect.width_height_constructor( 0, 0, _canvas_side, _canvas_side );
    bipbox_sm.set_client_rect( _rect );
    bipbox_sm.set_display_rect( _rect );

    _glob_terminal_run_code_from = RUN_CODE_FROM_OUTER_SRC ;
    circles_lib_batch_compiler_run( "CANVASscripttextarea"+_REF_ID, "CANVASdebugdiv"+_REF_ID, [ "CANVASwarningSTATUS"+_REF_ID, "CANVASerrorsSTATUS"+_REF_ID, "CANVASokSTATUS"+_REF_ID ], YES, YES );

    $("#CANVASerrorsSTATUS" + _REF_ID ).css( "color", _glob_terminal_errors_counter > 0 ? DEFAULT_COLOR_ERROR : DEFAULT_COLOR_STD );
    $("#CANVASerrorsSTATUS" + _REF_ID ).html( _glob_terminal_errors_counter > 0 ? _glob_terminal_errors_counter + " error" + ( _glob_terminal_errors_counter == 1 ? "" : "s" ) : "" );
    $("#CANVASwarningsSTATUS" + _REF_ID ).css( "color", _glob_terminal_warnings_counter > 0 ? DEFAULT_COLOR_WARNING : DEFAULT_COLOR_STD );
    $("#CANVASwarningsSTATUS" + _REF_ID ).html( _glob_terminal_warnings_counter > 0 ? _glob_terminal_warnings_counter + " warning" + ( _glob_terminal_errors_counter == 1 ? "" : "s" ) : "" );
    $("#CANVASokSTATUS" + _REF_ID ).css( "color", _glob_terminal_errors_counter == 0 ? DEFAULT_COLOR_SUCCESS : DEFAULT_COLOR_STD );
    $("#CANVASokSTATUS" + _REF_ID ).html( _glob_terminal_errors_counter == 0 ? "Success" : "" );
    _glob_target_plane = _glob_persistent_vars['old_plane_type'] ;
}

function CIRCLESformsTINYRENDERINGscriptSAVEFILE( _div_id, _REF_ID )
{
    var _code = $( "#CANVASscripttextarea" + _REF_ID ).val().trim();
    if ( _code.length > 0 )
    {
        var _filename = "tiny.rendering.code.txt" ;
        var _basename = basename( _filename );
 		    var _extension = _filename.includes( "." ) ? _filename.split( ".").get_last() : "" ;
				_filename = _glob_title.length > 0 ? _glob_title + "." + _basename + "." +  _extension : "circles." + _filename ;
        var blob = new Blob( [ _code ], { type: 'plain/text', endings: 'native' } );
        saveAs( blob, _filename );
    }
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't save code to a file: text is empty.", _glob_app_title );
}

function CIRCLESformsTINYRENDERINGremove( _div_id, _REF_ID )
{
    _glob_tinyrender_code_array.remove_key( _REF_ID );
    var _ret = _glob_tinyrender_code_array.keys_associative();
    if ( !object_exists( _ret ) ) _glob_tiny_rendering_ref_id = 0 ;
}