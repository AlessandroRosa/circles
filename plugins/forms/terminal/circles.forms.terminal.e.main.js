function CIRCLESformsTERMINALclose( _suffix ) { return circles_lib_plugin_dispatcher_unicast_message( "terminal", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsTERMINALmaximize()
{
    var _div_id = arguments[0] ;
    var _suffix = arguments[1] ;
    var _original_width = safe_int( arguments[2], 0 );
    var _original_height = safe_int( arguments[3], 0 );
    var _full_width = safe_int( arguments[4], 0 );
    var _full_height = safe_int( arguments[5], 0 );
    CIRCLESformsTERMINALresize( _full_width, _full_height, _suffix, OUTPUT_SCREEN );
}

function CIRCLESformsTERMINALminimize()
{
    var _div_id = arguments[0] ;
    var _suffix = arguments[1] ;
    var _original_width = safe_int( arguments[2], 0 );
    var _original_height = safe_int( arguments[3], 0 );
    var _min_width = safe_int( arguments[4], 0 );
    var _min_height = safe_int( arguments[5], 0 );
    CIRCLESformsTERMINALresize( _min_width, _min_height, _suffix, OUTPUT_SCREEN );
}

function CIRCLESformsTERMINALnormalize()
{
    var _div_id = arguments[0] ;
    var _suffix = arguments[1] ;
    var _original_width = safe_int( arguments[2], 0 );
    var _original_height = safe_int( arguments[3], 0 );
    CIRCLESformsTERMINALresize( _original_width, _original_height, _suffix, OUTPUT_SCREEN );
}

function CIRCLESformsTERMINALmain( _base_id, _move, _tab, _new, _term_width, _term_height )
{
		if ( is_string( _tab ) )
    {
        if ( _tab.isAlpha() )
    		switch( _tab.toLowerCase() )
    		{
    				case "console": _tab = 0 ; break ;
    				case "batch": _tab = 1 ; break ;
    				case "debug": _tab = 2 ; break ;
    				default: _tab = 0 ; break ;
    		}
        else _tab = Math.abs( safe_int( _tab, 0 ) );
        if ( !_tab.is_one_of( 0, 1, 2 ) ) _tab = 0 ;
    }
    else _tab = safe_int( _tab, 0 );

    CIRCLESformsTERMINALbaseid = safe_string( _base_id, "" ) ;

    _glob_terminal_windows_counter++ ;
    _move = safe_int( _move, YES ), _tab = safe_int( _tab, 0 ), _new = safe_int( _new, NO );
    var _extras_menu_height = 52 ;
    var WIDTH = Math.floor( $( window ).width() / 2 ), HEIGHT = $( window ).height() - ( _extras_menu_height + 18 ); // menu height
    WIDTH = _term_width = safe_int( _term_width, WIDTH );
    WIDTH = Math.max( 0, Math.min( WIDTH, $(window).width() ) ) ;
    HEIGHT = _term_height = safe_int( _term_height, HEIGHT );
    HEIGHT = Math.max( 0, Math.min( HEIGHT, $(window).height() ) ) ;

    var _suffix = _glob_terminal_form_suffix = _glob_terminal_windows_counter, _subset = "forms" ;
    var _div_id = CIRCLESformsTERMINALdiv_id = circles_lib_plugin_build_divid( _subset, _base_id ) + _suffix ;
    var HTMLcode = CIRCLESformsTERMINALgetHTML( _div_id, YES, WIDTH, HEIGHT, _suffix, _glob_popups_array.length );
    var _caption = CIRCLESformsTERMINALcaption + " #" + ( _glob_terminal_popup_active + 1 );

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    var CLOSE_FN = "CIRCLESformsTERMINALclose("+_suffix+");" ;
    circles_lib_plugin_activate( YES, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, _caption, CLOSE_FN,
                      [ "CIRCLESformsTERMINALnormalize", _div_id, _suffix, WIDTH, HEIGHT ],
                      [ "CIRCLESformsTERMINALminimize", _div_id, _suffix, WIDTH, HEIGHT ],
                      [ "CIRCLESformsTERMINALmaximize", _div_id, _suffix, WIDTH, HEIGHT ] );
    _glob_popups_array.get_last().push( _suffix ) ;
    var _idx = _glob_popups_array.length - 1 ;
    CIRCLESformsTERMINALactivate( WIDTH, HEIGHT, _div_id, _suffix );
    CIRCLESformsTERMINALresize( WIDTH, HEIGHT, _suffix );
    if ( _tab == 0 ) _glob_output_channel = OUTPUT_TERMINAL ;
    else if ( _tab == 1 ) _glob_output_channel = OUTPUT_SCRIPT ;
    else if ( _tab == 2 ) _glob_output_channel = OUTPUT_CONSOLE ;

    var _terminal_tabber = $( "#CIRCLESTERMINAL"+_suffix+"mainDIV" ).get(0);
    if ( _terminal_tabber != null ) _terminal_tabber.tabber.tabShow( _tab );
    if ( _move && _div != null )
    {
       if ( safe_float( _plugin_main_ref, 0 ) > 0 )
       {
          var _viewport_width = $(window).width();
          var _plugin_left_pos = safe_int( $("#"+GLOB_PLUGIN_DIV_ID).css( "left" ) );
          var _candidate_x = Math.max( 0, _viewport_width - _plugin_left_pos - WIDTH - 15 );
          if ( _candidate_x == 0 ) _candidate_x += 5 ;
          move_div( _div.id, _candidate_x, "TOP" );
       }
       else move_div( _div.id, "LEFT", "TOP" );
    }

		$("#"+CIRCLESformsTERMINALdiv_id ).bind( "keypress keydown keyup", function() { _glob_wnd_onkeyup_event_halt = YES ; } );
		$("#"+CIRCLESformsTERMINALdiv_id ).bind( "mousedown mouseup click", function() { _glob_wnd_onkeyup_event_halt = YES ; } );

    //if ( _run )
    //{
      if ( $("#"+_div_id ).resizable('instance') != undefined )
      $("#"+_div_id).resizable('destroy').resizable(
      {
         start: function( event, ui ) { CIRCLESformsTERMINALstartresize( ui.size.width, ui.size.height ) },
         resize: function( event, ui ) { CIRCLESformsTERMINALresize( ui.size.width, ui.size.height, _suffix, OUTPUT_SCREEN ); },
         stop: function( event, ui ) { CIRCLESformsTERMINALstopresize( ui.size.width, ui.size.height ) }
      } );
      else
      {
        $("#"+_div_id).resizable(
        {
           start: function( event, ui ) { CIRCLESformsTERMINALstartresize( ui.size.width, ui.size.height ) },
           resize: function( event, ui ) { CIRCLESformsTERMINALresize( ui.size.width, ui.size.height, _suffix, OUTPUT_SCREEN ); },
           stop: function( event, ui ) { CIRCLESformsTERMINALstopresize( ui.size.width, ui.size.height ) }
        } );
      }
      $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
    //}

    _glob_terminal_popup_active++ ;
    $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESformsTERMINALlistingsLOAD ) } ;
}

function CIRCLESformsTERMINALgetHTML( _div_id, _is_popup, _input_w, _input_h, _suffix, _idx )
{
    _is_popup = safe_int( _is_popup, YES );
    _input_w = safe_int( _input_w, 200 ), _input_h = safe_int( _input_h, 200 );
		var _n_commands = safe_size( _glob_code_run_cmds_array, 0 );
    var WIDTH = _input_w, HEIGHT = _input_h, _subset = "forms" ;
    var _caption = CIRCLESformsTERMINALcaption + " #" + ( _glob_terminal_popup_active + 1 );
    var CLOSE_FN = "CIRCLESformsTERMINALclose("+_suffix+");" ;
    var _click_fn = "_glob_terminal.focus();_glob_terminal_form_suffix='"+_suffix+"';" ;
    var _table_style = _is_popup ? "background-color:white;" : "" ;
    var HTMLcode = "<table ID=\"wnd_container_"+_div_id+"\" WIDTH=\""+WIDTH+"\" HEIGHT=\""+HEIGHT+"\" STYLE=\""+_table_style+"\" VALIGN=\"top\">" ;
    if ( _is_popup ) HTMLcode += circles_lib_plugin_caption_code( YES, _caption, 3, YES, CLOSE_FN, WIDTH, HEIGHT,
                     arguments.callee.name, CIRCLESformsTERMINALbaseid, _div_id,
                     _subset, "cmd.prompt/cmd.prompt.icon.01.16x16.png",
                     _click_fn, null, "CIRCLESformsTERMINAL" + _suffix,
                		 [ "CIRCLESformsTERMINALnormalize", _div_id, _suffix, WIDTH, HEIGHT ],
                		 [ "CIRCLESformsTERMINALminimize", _div_id, _suffix, WIDTH, HEIGHT ],
                		 [ "CIRCLESformsTERMINALmaximize", _div_id, _suffix, WIDTH, HEIGHT ] );
    HTMLcode += "<tr>" ;
    HTMLcode += "<td ID=\"CIRCLESTERMINALcontainer"+_suffix+"\" VALIGN=\"top\" STYLE=\"padding-left:1px;padding-right:1px;\" WIDTH=\"100%\" HEIGHT=\"100%\">" ;
    HTMLcode += "<div ID=\"CIRCLESTERMINAL"+_suffix+"mainDIV\" STYLE=\"position:relative;width:99%;height:94%;\" VALIGN=\"top\" class=\"tabber\">" ;

    var terminalWIDTH = !( ( new String( WIDTH ) ).includes( "%" ) ) ? ( WIDTH - 35 ) + "px" : WIDTH ;

    _glob_terminal_current_id = "terminal_div" + _suffix ;

    HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:99%;height:94%;\" VALIGN=\"top\" ID=\"CIRCLESTERMINAL"+_suffix+"_TAB_01\">" ;
    HTMLcode += "<h2>Console</h2>" ;
    HTMLcode += "<table WIDTH=\"100%\" HEIGHT=\"100%\">" ;
    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" ID=\"CIRCLESterminalCONTAINER"+_suffix+"\" WIDTH=\"100%\" HEIGHT=\"100%\"><DIV ID=\"terminal_div"+_suffix+"\" STYLE=\"position:relative;height:100%;width:97%;overflow:auto;\"></DIV></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESterminalBAR1"+_suffix+"\" CLASS=\"popup_buttons_bar\" WIDTH=\"100%\" HEIGHT=\"18\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td ID=\"CIRCLESTERMINAL_TAB_01_BAR_BTN_01"+_suffix+"\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsTERMINALhistoryDISPLAYtoggle("+_suffix+",YES,OUTPUT_SCREEN);\">History</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td ID=\"CIRCLESTERMINAL_TAB_01_BAR_BTN_02"+_suffix+"\" CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_terminal.clear();_glob_terminal.greetings();_glob_terminal.enable();\">Clean</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td ID=\"CIRCLESTERMINAL_TAB_01_BAR_PURGE_BTN"+_suffix+"\" "+( _n_commands > 0 ? "CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsTERMINALpurgeCMDS("+_suffix+",0);\"" : "CLASS=\"linkdead\"" )+" STYLE=\"display:none;\">Purge</td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td ID=\"CIRCLESTERMINAL_TAB_01_BAR_BTN_03"+_suffix+"\" WIDTH=\"20\" HEIGHT=\"20\" ALIGN=\"center\"></td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td ID=\"CIRCLESTERMINAL_TAB_01_BAR_OUTPUT"+_suffix+"\" ALIGN=\"center\"></td>" ;
    HTMLcode += "<td></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
		HTMLcode += "<tr><td WIDTH=\"99%\" HEIGHT=\"0\" ID=\"TERMINALhistoryCONTAINER"+_suffix+"\" STYLE=\"display:none;\"></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</div>" ;

    HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:99%;height:94%;\" VALIGN=\"top\" ID=\"CIRCLESTERMINAL"+_suffix+"_TAB_02\">" ;
    HTMLcode += "<h2>Batch script compiler</h2>" ;
    HTMLcode += "<table WIDTH=\"auto\" HEIGHT=\"auto\">" ;
    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESbatchcompilerBAR1"+_suffix+"\" CLASS=\"popup_buttons_bar\" WIDTH=\"100%\" HEIGHT=\"18\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td WIDTH=\"110\" ID=\"CIRCLESbatchcompilerOKlabel"+_suffix+"\" CLASS=\"general_rounded_corners\" ALIGN=\"center\" STYLE=\"background-color:white;color:#00CA00;height:16px;\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td WIDTH=\"110\" ID=\"CIRCLESbatchcompilerERRORSlabel"+_suffix+"\" CLASS=\"general_rounded_corners\" ALIGN=\"center\" STYLE=\"background-color:white;color:red;height:16px;\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td WIDTH=\"110\" ID=\"CIRCLESbatchcompilerWARNINGSlabel"+_suffix+"\" CLASS=\"general_rounded_corners\" ALIGN=\"center\" STYLE=\"background-color:white;color:orange;height:16px;\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" ID=\"CIRCLESbatchcompilerBAR2"+_suffix+"\" CLASS=\"popup_buttons_bar\" WIDTH=\"100%\" HEIGHT=\"18\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:"+_click_fn+";CIRCLESformsTERMINALextractLISTING('"+_suffix+"');\">Extract listing</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:"+_click_fn+";_glob_terminal_run_code_from=RUN_CODE_FROM_TERMINAL;circles_lib_batch_compiler_run('CIRCLESbatchcompilerTEXT"+_suffix+"','CIRCLESdebugDIV"+_suffix+"',['CIRCLESbatchcompilerWARNINGSlabel"+_suffix+"','CIRCLESbatchcompilerERRORSlabel"+_suffix+"','CIRCLESbatchcompilerOKlabel"+_suffix+"'],YES,YES);\">Run</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" ID=\"batch_copy"+_suffix+"\" ONCLICK=\"javascript:copy_to_clipboard('CIRCLESbatchcompilerTEXT"+_suffix+"');\">Copy</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:"+_click_fn+";$('#customloader').val('');$('#customloader').trigger('click');\">Load</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:"+_click_fn+";CIRCLESformsTERMINALbatchcompilerSAVEFILE("+_suffix+");\">Save</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:"+_click_fn+";CIRCLESformsTERMINALbatchcompilerCLEANcode( YES, NO, "+_suffix+");\">Clean code</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:"+_click_fn+";CIRCLESformsTERMINALbatchcompilerCLEANall( YES, NO, "+_suffix+");\">Clean all</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td ID=\"CIRCLESTERMINAL_TAB_02_BAR_PURGE_BTN"+_suffix+"\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsTERMINALpurgeCMDS("+_suffix+",1);\" STYLE=\"display:none;\">Purge</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" ID=\"CIRCLESbatchcompilertextCONTAINER"+_suffix+"\" WIDTH=\"99%\" HEIGHT=\"100%\"><textarea STYLE=\"height:99%;width:"+terminalWIDTH+";overflow:auto;\" CLASS=\"linenumberstextarea\" ID=\"CIRCLESbatchcompilerTEXT"+_suffix+"\"></textarea></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" ID=\"CIRCLESbatchcompilerBAR3"+_suffix+"\" CLASS=\"popup_buttons_bar\" WIDTH=\"99%\" HEIGHT=\"18\"><table><tr><td WIDTH=\"15\"></td><td>Row</td><td WIDTH=\"4\"></td><td ID=\"BATCHscriptROW"+_suffix+"\" WIDTH=\"30\"></td><td WIDTH=\"15\"></td><td>Col</td><td WIDTH=\"4\"></td><td ID=\"BATCHscriptCOL"+_suffix+"\" WIDTH=\"30\"></td><td WIDTH=\"4\"></td><td ID=\"BATCHscriptOUTPUT"+_suffix+"\" WIDTH=\"240\"></td></tr></table></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</div>" ;

    HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:99%;height:94%;\" VALIGN=\"top\" ID=\"CIRCLESTERMINAL"+_suffix+"_TAB_03\">" ;
    HTMLcode += "<h2>Debug</h2>" ;
    HTMLcode += "<TEXTAREA STYLE=\"display:none;\" ID=\"debugtextareahidden"+_suffix+"\"></TEXTAREA>" ;
    HTMLcode += "<table WIDTH=\"100%\" HEIGHT=\"100%\">" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESdebugBAR1"+_suffix+"\" CLASS=\"popup_buttons_bar\" HEIGHT=\"18\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsTERMINALdebugSAVEFILE('"+_suffix+"');\">Save</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_terminal_run_code_from=RUN_CODE_FROM_OUTER_SRC;circles_lib_batch_compiler_run('CIRCLESbatchcompilerTEXT"+_suffix+"','CIRCLESdebugDIV"+_suffix+"',['"+"CIRCLESbatchcompilerWARNINGSlabel"+_suffix+"','"+"CIRCLESbatchcompilerERRORSlabel"+_suffix+"','"+"CIRCLESbatchcompilerOKlabel"+_suffix+"'],YES,YES);\">Run</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsTERMINALbatchcompilerCLEANdebug(YES,NO,'"+_suffix+"');\">Clean debug</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"debug_copy"+_suffix+"\" ONCLICK=\"javascript:copy_to_clipboard('debugtextareahidden"+_suffix+"');\">Copy</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsTERMINALbatchcompilerCLEANall(YES,NO,'"+_suffix+"');\">Clean all</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td ID=\"CIRCLESTERMINAL_TAB_03_BAR_PURGE_BTN"+_suffix+"\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsTERMINALpurgeCMDS("+_suffix+",2);\" STYLE=\"display:none;\">Purge</td>" ;
    HTMLcode += "" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" ID=\"CIRCLESdebugCONTAINER"+_suffix+"\" HEIGHT=\"100%\"><DIV ID=\"CIRCLESdebugDIV"+_suffix+"\" STYLE=\"position:relative;width:100%;height:100%;overflow:auto;padding:3px;word-wrap:break-word;\" CLASS=\"linenumberstextarea\"></DIV></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" ID=\"CIRCLESdebugOUTPUTCONTAINER"+_suffix+"\" CLASS=\"popup_buttons_bar\" WIDTH=\"99%\" HEIGHT=\"18\"><table><tr><td WIDTH=\"15\"></td><td ID=\"CIRCLESTERMINAL_TAB_03_BAR_OUTPUT"+_suffix+"\" ALIGN=\"center\"></td></tr></table></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</div>" ;

    HTMLcode += "</div>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode = HTMLcode.replaceAll( [ CRLF_WIN, CRLF_NO_WIN, '<br>' ], "<br>" ).replaceAll( "%imgpath%", _glob_path_to_img );

    return HTMLcode ;
}

function CIRCLESformsTERMINALstartresize( _new_width, _new_height ) {}
function CIRCLESformsTERMINALstopresize( _new_width, _new_height ) {}
function CIRCLESformsTERMINALresize( _new_width, _new_height, _suffix, _out_channel )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _terminal_div_id = CIRCLESformsTERMINALdiv_id ;
    if ( _glob_terminal == null || $("#" + _terminal_div_id ).get(0) == null )
    return [ RET_ERROR, "Can't resize: console not available" ] ;

    var _popup_width = _new_width - 6 ;    // left + right margin between popup and viewport border
    var _popup_height = _new_height - 10 ; // top + bottom margin

    $("#"+_terminal_div_id ).css( "width", _new_width );
    $("#"+_terminal_div_id ).css( "height", _new_height );

    $("#wnd_container_" + _terminal_div_id ).css( "width", _new_width + "px" );
    $("#wnd_container_" + _terminal_div_id ).css( "height", _new_height + "px" );

    var _extra_height = safe_int( $("#" + _terminal_div_id + "_caption").height(), 0 );
        _extra_height += safe_int( $("#" + _terminal_div_id + "_method").height(), 0 );

    var _tab_width = _popup_width, _tab_height = _popup_height - _extra_height ;
    $("#CIRCLESTERMINAL"+_suffix+"mainDIV").css( "width", _tab_width );
    $("#CIRCLESTERMINAL"+_suffix+"mainDIV").css( "height", _tab_height - 24 );
    var _tab_interior_width = _tab_width - 4 ; // left + right margin
    var _tab_interior_height = _tab_height - 30 ; // tab label height
    $("#CIRCLESTERMINAL"+_suffix+"_TAB_01").css( "width", _tab_interior_width );
    $("#CIRCLESTERMINAL"+_suffix+"_TAB_01").css( "height", _tab_interior_height );
    $("#CIRCLESterminalBAR1" + _suffix ).css( "width", _tab_interior_width - 4 );
    $("#terminal_div" + _suffix ).css( "width", _tab_interior_width - 20 );

    $("#CIRCLESTERMINAL"+_suffix+"_TAB_02").css( "width", _tab_interior_width );
    $("#CIRCLESTERMINAL"+_suffix+"_TAB_02").css( "height", _tab_interior_height );
    var _bar_1_h = safe_int( $("#CIRCLESbatchcompilerBAR1" + _suffix ).height(), 0 );
    var _bar_2_h = safe_int( $("#CIRCLESbatchcompilerBAR2" + _suffix ).height(), 0 );
    var _bar_3_h = safe_int( $("#CIRCLESbatchcompilerBAR3" + _suffix ).height(), 0 );
        _extra_height = safe_int( _bar_1_h + _bar_2_h + _bar_3_h + 44, 0 );
    $("#CIRCLESbatchcompilerBAR1" + _suffix ).css( "width", _tab_interior_width - 20 )
    $("#CIRCLESbatchcompilerBAR2" + _suffix ).css( "width", _tab_interior_width - 20 )
    $("#CIRCLESbatchcompilerBAR3" + _suffix ).css( "width", _tab_interior_width - 20 )
    $("#CIRCLESbatchcompilertextCONTAINER" + _suffix ).css( "width", _tab_interior_width - 24 );

    $("#CIRCLESbatchcompilerTEXT" + _suffix ).css( "width", _tab_interior_width - 12 );
    $("#CIRCLESbatchcompilerTEXT" + _suffix ).css( "height", _tab_interior_height - _extra_height - 2 );

    $("#CIRCLESTERMINAL"+_suffix+"_TAB_03").css( "width", _tab_interior_width );
    $("#CIRCLESTERMINAL"+_suffix+"_TAB_03").css( "height", _tab_interior_height );
        _extra_height = safe_int( $("#CIRCLESdebugBAR1" + _suffix ).height(), 0 ) + safe_int( $("#CIRCLESdebugOUTPUTCONTAINER" + _suffix ).height(), 0 ) + 30 ;
    $("#CIRCLESdebugBAR1" + _suffix ).css( "width", _tab_interior_width - 16 )
    $("#CIRCLESdebugDIV" + _suffix ).css( "width", _tab_interior_width - 10 );
    $("#CIRCLESdebugDIV" + _suffix ).css( "height", _tab_interior_height - ( _extra_height + 2 ) );

    if ( _glob_terminal != null ) _glob_terminal.resize();

    $("#"+_terminal_div_id+"_caption_container" ).css( "width", _new_width + "px" );
    $("#"+_terminal_div_id+"_caption" ).css( "width", _new_width + "px" );

    return [ RET_OK, "Console resized" ] ;
}

function CIRCLESformsTERMINALactivate( WIDTH, HEIGHT, _div_id, _suffix )
{
    // terminal tab
    jQuery(document).ready(
    function($)
    {
        var _term = $('#terminal_div'+_suffix).terminal
        (
           function( command, terminal ){ circles_lib_terminal_interpreter( command, terminal, OUTPUT_TERMINAL ); },
           {
               greetings: ["Circles terminal console",
                           "Powered by Jquery terminal",
                           "Type 'help' for commands list"].join('\n'),
               prompt: _glob_terminal_default_prompt
           }
        );

        $('#terminal_div'+_suffix).click(); // put the focus on the terminal console
    }
    );

    CIRCLESformsTERMINALform_div = $( "#"+_div_id ).get(0);
    CIRCLESformsTERMINALtab_container = $( "#CIRCLESTERMINAL"+_suffix+"mainDIV" ).get(0);
    CIRCLESformsTERMINALtab_01 = $( "#CIRCLESTERMINAL"+_suffix+"_TAB_01" ).get(0);
    CIRCLESformsTERMINALtab_02 = $( "#CIRCLESTERMINAL"+_suffix+"_TAB_02" ).get(0);
    CIRCLESformsTERMINALtab_03 = $( "#CIRCLESTERMINAL"+_suffix+"_TAB_03" ).get(0);

    _glob_terminal = $("#terminal_div"+_suffix).terminal();
    _glob_terminal.bind('blur', function(e) { _glob_wnd_onkeyup_event_halt = NO ; this.active().disable(); });
    _glob_terminal.bind('keydown keyup keypress', function(e)
    {
        _glob_wnd_onkeyup_event_halt = YES ;
        if ( e.stopImmediatePropagation() ) e.stopImmediatePropagation() ;
        if ( e.stopPropagation ) e.stopPropagation();
        if ( e.cancelBubble ) e.cancelBubble = true;
        e.preventDefault();
    }
    );

    _glob_terminal.bind( 'click focus mousedown mouseup',
                         function(e)
                         {
                            _glob_wnd_onkeyup_event_halt = YES ;
                            circles_lib_plugin_focus( _div_id );
                            if ( e.stopImmediatePropagation() ) e.stopImmediatePropagation() ;
                            if ( e.stopPropagation ) e.stopPropagation();
                            if ( e.cancelBubble ) e.cancelBubble = true;
                             e.preventDefault();
                         }
                      );
    
    if ( DEFAULT_TERMINAL_FONT_FAMILY == null ) DEFAULT_TERMINAL_FONT_FAMILY = $("#terminal_div"+_suffix).css( "font-family" );
    if ( DEFAULT_TERMINAL_FONT_SIZE == null ) DEFAULT_TERMINAL_FONT_SIZE = $("#terminal_div"+_suffix).css( "fontSize" );
    
    $( "#CIRCLESbatchcompilerTEXT"+_suffix ).bind( 'click focus keyup keydown keypress',
    function( e )
    {
        _glob_wnd_onkeyup_event_halt = YES ;
     		circles_lib_plugin_focus( _div_id );
        if ( e.stopPropagation ) e.stopPropagation();
        if ( e.cancelBubble != null ) e.cancelBubble = true;
    } );

    $("#terminal_div" + _suffix ).focus();
    var _opts = {} ;
    jQuery.extend( _opts, CIRCLESTERMINALtabberOptions );
    _opts.prefix = "CIRCLESTERMINAL" + _suffix ;
    tabberAutomatic( _opts, "CIRCLESTERMINAL" + _suffix );
          
    var _w = $( "#terminal_div"+_suffix ).width() ;
    var _h = $( "#terminal_div"+_suffix ).height() ;
    if ( CIRCLESformsTERMINALform_width_px == null && CIRCLESformsTERMINALform_height_px == null )
    CIRCLESformsTERMINALform_width_px = _w - 20, CIRCLESformsTERMINALform_height_px = _h - 5 ;
    
    $("#CIRCLESbatchcompilerTEXT"+_suffix ).css( "width", _w );
    $("#CIRCLESbatchcompilerTEXT"+_suffix ).css( "height", _h - 60 );
    $("#CIRCLESbatchcompilerTEXT"+_suffix ).bind( "keydown",
                                                 function( event )
                                                 {
                                                    var _xy = getCursorXY( "CIRCLESbatchcompilerTEXT"+_suffix );
                                                    $("#BATCHscriptCOL"+_suffix ).html( _xy[ 0 ] + 1 );
                                                    $("#BATCHscriptROW"+_suffix ).html( _xy[ 1 ] + 1 );
                                                 }
                                               );

    circles_lib_statusbar_set_output_stream( OUTPUT_TERMINAL );
    if ( safe_size( _glob_terminal_codelist, "" ).length > 0 ) $("#CIRCLESbatchcompilerTEXT"+_suffix ).val( _glob_terminal_codelist );
    $("#"+CIRCLESformsTERMINALdiv_id+_suffix).resizable({ resize: function( event, ui ) { CIRCLESformsTERMINALresize( ui.size.width, ui.size.height, _suffix ); } });
    $("#"+CIRCLESformsTERMINALdiv_id+_suffix).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
}