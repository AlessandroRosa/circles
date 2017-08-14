function CIRCLESformsDICTIONARYinfo() { circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, "Words reading direction goes from right to left", _glob_app + " - Info - Dictionary" ); }
function CIRCLESformsDICTIONARYclose() { return circles_lib_plugin_dispatcher_unicast_message( "dictionary", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsDICTIONARYmaximize()
{
    var _full_width = safe_int( arguments[1], 0 );
    var _full_height = safe_int( arguments[2], 0 );
    CIRCLESformsDICTIONARYresize( _full_width, _full_height );
    CIRCLESformsDICTIONARYstopresize();
    if ( $( "#" + CIRCLESformsDICTIONARYdiv_id ).resizable( "option", "disabled" ) )
    $( "#" + CIRCLESformsDICTIONARYdiv_id ).resizable( 'enable' );
}

function CIRCLESformsDICTIONARYminimize()
{
    var _original_width = safe_int( arguments[1], 0 );
    var _original_height = safe_int( arguments[2], 0 );
    var _min_width = safe_int( arguments[3], 0 );
    var _min_height = safe_int( arguments[4], 0 );
    CIRCLESformsDICTIONARYresize( _min_width, _min_height );
    CIRCLESformsDICTIONARYstopresize();
    if ( !( $( "#" + CIRCLESformsDICTIONARYdiv_id ).resizable( "option", "disabled" ) ) )
    $("#" + CIRCLESformsDICTIONARYdiv_id).resizable('disable');
}

function CIRCLESformsDICTIONARYnormalize()
{
    var _original_width = safe_int( arguments[1], 0 );
    var _original_height = safe_int( arguments[2], 0 );
    CIRCLESformsDICTIONARYresize( _original_width, _original_height );
    CIRCLESformsDICTIONARYstopresize();
    if ( $( "#" + CIRCLESformsDICTIONARYdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLESformsDICTIONARYdiv_id).resizable('enable');
}

function CIRCLESformsDICTIONARYmain( _base_id, _move )
{
    CIRCLESformsDICTIONARYbaseid = safe_string( _base_id, "dictionary" );
    _move = safe_int( _move, YES );
    _glob_dict_selected_page = safe_int( _glob_dict_selected_page, 0 );
    var _dict_size = circles_lib_count_dict();
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ), _run = _items_n > 0 ;
    if ( _glob_method == METHOD_ALGEBRAIC && _glob_process == PROCESS_RANDOM )
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The dictionary is not available for random process.", _glob_app );
    else if ( _items_n >= 0 )
    {
        var bGETsymbols = safe_size( _glob_alphabet, 0 ) == 0 ? 1 : 0 ;
				_glob_original_dict = _glob_dict_processor.sliced_dict_resize( CIRCLESformsDICTIONARYmax_entries_per_page, YES );
        if ( bGETsymbols == 1 )
        {
            if ( _items_n > 0 ) // try to get the alphabet from seeds
            {
                 _glob_alphabet = [];
                 var ITEM, _symbol ;
                 for( var i = 0 ; i < _items_n ; i++ )
                 {
                     ITEM = _items_array[i] ;
                     _symbol = is_item_obj( ITEM ) ? ITEM.symbol : "" ;
                     if ( _symbol.length > 0 ) _glob_alphabet.push( _symbol );
                 }
            }
        }

        var _viewport_array = getViewportExtents();
        var _viewport_width = _viewport_array[0], _viewport_height = _viewport_array[1] ;

        var WIDTH = _items_n > 0 ? safe_int( _viewport_width * 0.55, 450 ) : 450, HEIGHT = _items_n > 0 ? $(window).height() - 80 : 100, PALETTEcontainerWIDTH = 150 ;
        var CLOSE_FN = "CIRCLESformsDICTIONARYclose();" ;      
        var _caption = CIRCLESformsDICTIONARYcaption01, _subset = "forms" ;
        var _div_id = CIRCLESformsDICTIONARYdiv_id = circles_lib_plugin_build_divid( _subset, _base_id ) ;
        var HTMLcode = "<table WIDTH=\"100%\">" ;
        HTMLcode += circles_lib_plugin_caption_code( _run, _caption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "abc/abc.icon.01.16x16.png", "", "CIRCLESformsDICTIONARYinfo()" );
        HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESformsDICTIONARYalphabetFORMcontainerUPPER\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td STYLE=\"padding:2px;\">Selected word</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td STYLE=\"padding:2px;font-weight:bold;\" ID=\"CIRCLESformsDICTIONARYselectedWORD\">None</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td STYLE=\"padding:2px;\">Alphabet</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td STYLE=\"padding:2px;\" ID=\"CIRCLESformsDICTIONARYalphabetSYMBOL\">"+( safe_size( _glob_alphabet, 0 ) > 0 ? CIRCLESformsDICTIONARYgetALPHABETcomboCODE() : "<SPAN STYLE=\"color:#909090;\">None</SPAN>" ) +"</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"CIRCLESformsDICTIONARYalphabetEDIT\" STYLE=\"width:70px;text-align:center;\" ONKEYUP=\"javascript:CIRCLESformsDICTIONARYeventsHANDLER( event, this.id );\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CIRCLESdictionaryFORMalphabetBTN1\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYalphabetADD();\">Add</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CIRCLESdictionaryFORMalphabetBTN2\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYalphabetREMOVE();\">Remove</td>" ;
        HTMLcode += "<td WIDTH=\"6\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CIRCLESdictionaryFORMalphabetBTN3\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYalphabetREMOVE('',YES);\">Erase alphabet</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;

        var FN = "CIRCLESformsDICTIONARYselectWORD( this.value );", BTN_LABEL = "" ;

        if ( _glob_method == METHOD_INVERSION )
        {
            FN += "circles_lib_draw_word_inversion( _glob_wplane_freedraw_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), wplane_sm, null, YES, this.value );" ;
            BTN_LABEL = "Draw orbit" ;
        }
        else if ( _glob_method == METHOD_ALGEBRAIC )
        {
            // no action to perform
            FN = "" ;
            BTN_LABEL = "Analyze" ;
        }
        else
        {
            FN += "circles_lib_draw_word_circlewise( _glob_wplane_freedraw_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), wplane_sm, null, YES, this.value );" ;
            BTN_LABEL = "Draw orbit" ;
        }

        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESformsDICTIONARYalphabetFORMcontainerLOWER\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>Input word</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td><INPUT "+( FN.length > 0 ? "ONKEYUP=\"javascript:"+FN+"\" ONCHANGE=\"javascript:"+FN+"\"" : "" )+" TYPE=\"edit\" ID=\"CIRCLESdictUSERDEFINEDwordEDIT\" STYLE=\"width:200px;\"></td>" ;
        if ( _glob_method == METHOD_ALGEBRAIC )
        {
            HTMLcode += "<td WIDTH=\"5\"></td>" ;
            HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYtrackorbitVIAterminal();\">Track orbit</td>" ;
        }
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYfindWORD();\">Find</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYappendWORD();\">Append</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" WIDTH=\"100%\">" ;
        HTMLcode += "<DIV ID=\"CIRCLESformsDICTIONARY\" STYLE=\"position:relative;display:"+( safe_size( _glob_alphabet, 0 ) > 0 || _dict_size > 0 ? "block" : "none" )+";\">" ;
        HTMLcode += "<table WIDTH=\"100%\">" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\" WIDTH=\"100%\">" ;
        HTMLcode += "<table ID=\"CIRCLESformsDICTIONARYbtnsBAR\">" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded_dead\" ID=\"CIRCLESdictionaryFORMbtn5\">Apply</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

        _glob_using_automaton = circles_lib_plugin_check_property( "automaton", YES, POPUP_SEARCH_BY_VISIBLE ) ;

        if ( !_glob_using_automaton )
        {
            HTMLcode += "<tr>" ;
            HTMLcode += "<td VALIGN=\"top\" WIDTH=\"100%\" ID=\"CIRCLESformsDICTIONARYcheckboxBARcontainer\">" ;
            HTMLcode += "<table WIDTH=\"100%\">" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
            HTMLcode += "<table>" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td WIDTH=\"3\"></td>" ;
            HTMLcode += "<td><INPUT "+( _dictionary_init_settings_array['use_reduced_words'] ? "CHECKED" : "" )+" TYPE=\"checkbox\" ONCLICK=\"javascript:_dictionary_init_settings_array['use_reduced_words']=this.checked?1:0;\"></td>" ;
            HTMLcode += "<td WIDTH=\"1\"></td>" ;
            HTMLcode += "<td CLASS=\"link\">Use reduced words</td>" ;
            HTMLcode += "<td WIDTH=\"8\"></td>" ;
            HTMLcode += "<td><INPUT "+( _dictionary_init_settings_array['allow_repetition'] ? "CHECKED" : "" )+" TYPE=\"checkbox\" ONCLICK=\"javascript:_dictionary_init_settings_array['compute_inv_symbol']=this.checked?1:0;\"></td>" ;
            HTMLcode += "<td WIDTH=\"1\"></td>" ;
            HTMLcode += "<td CLASS=\"link\">Allow repetition</td>" ;
            HTMLcode += "<td WIDTH=\"8\"></td>" ;
            HTMLcode += "<td><INPUT "+( _dictionary_init_settings_array['compute_inv_symbol'] ? "CHECKED" : "" )+" TYPE=\"checkbox\" ONCLICK=\"javascript:_dictionary_init_settings_array['compute_inv_symbol']=this.checked?1:0;\"></td>" ;
            HTMLcode += "<td WIDTH=\"1\"></td>" ;
            HTMLcode += "<td CLASS=\"link\">Compute inverse symbols</td>" ;
            HTMLcode += "<td WIDTH=\"8\"></td>" ;
            HTMLcode += "<td><INPUT "+( _dictionary_init_settings_array['longest_words_only'] ? "CHECKED" : "" )+" TYPE=\"checkbox\" ONCLICK=\"javascript:_dictionary_init_settings_array['longest_words_only']=this.checked?1:0;\"></td>" ;
            HTMLcode += "<td WIDTH=\"1\"></td>" ;
            HTMLcode += "<td CLASS=\"link\">Longest words only</td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "</table>" ;
            HTMLcode += "</td>" ;
            HTMLcode += "<td WIDTH=\"15\"></td>" ;
            HTMLcode += "<td ALIGN=\"center\" STYLE=\"color:#A6A6CA;\">Automaton is off</td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "</table>" ;
            HTMLcode += "</td>" ;
            HTMLcode += "</tr>" ;
        }
        else HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"color:#A6A6CA;\" ID=\"CIRCLESformsDICTIONARYcheckboxBARcontainer\" HEIGHT=\"24\">Automaton is on. Dictionary structure features are not available</td></tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\">" ;
        HTMLcode += "<table WIDTH=\"100%\">" ;
        HTMLcode += "<tr>" ;

        HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\" ID=\"CIRCLESformsDICTIONARYentriesCONTAINER\">" ;
        HTMLcode += "<table VALIGN=\"top\">" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td STYLE=\"padding:2px;\" ID=\"CIRCLESformsDICTIONARYfoundENTRIESlabel\">"+( "Found "+_dict_size+" word"+( ( _dict_size == 1 ) ? "" : "s" ) )+"</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\" ID=\"PAGING_CONTAINER\" CLASS=\"popup_buttons_bar\">" ;

        CIRCLESformsDICTIONARYPAGES = safe_int( _glob_dict_processor.sliced_dict_get_chunks_number(), 0 );
        if ( CIRCLESformsDICTIONARYPAGES > 1 ) HTMLcode += CIRCLESformsDICTIONARYpagingPROCESS(0);

			  HTMLcode += "</td>" ;
			  HTMLcode += "<td WIDTH=\"10\"></td>" ;
			  HTMLcode += "<td>Each page includes</td>" ;
			  HTMLcode += "<td WIDTH=\"2\"></td>" ;
			  HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"CIRCLESformsDICTIONARYeachPAGEcardinality\" STYLE=\"width:40px;text-align:center;\" VALUE=\""+CIRCLESformsDICTIONARYmax_entries_per_page+"\" ONKEYUP=\"javascript:CIRCLESformsDICTIONARYeventsHANDLER( event, this.id );\"></td>" ;
			  HTMLcode += "<td WIDTH=\"2\"></td>" ;
			  HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYpageRESIZE();\">Resize</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table></td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr><td VALIGN=\"top\"><DIV ID=\"CIRCLESformsDICTIONARYpageDIV\" CLASS=\"general_rounded_corners\" STYLE=\"position:relative;padding:4px;background-color:black;overflow:auto;width:"+(WIDTH-PALETTEcontainerWIDTH-16)+"px;height:"+( HEIGHT - 222 )+"px;\"></DIV></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" ALIGN=\"right\" ID=\"CIRCLESformsDICTIONARYlistcommandsbarDIV\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>Depth</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"CIRCLESdictionaryFORMdepthEDIT\" VALUE=\""+_glob_depth+"\" ONKEYUP=\"javascript:CIRCLESformsDICTIONARYeventsHANDLER( event, this.id );\" STYLE=\"width:30px;text-align:center;\"></td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"26\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYperformACTIONask('"+_caption+"',0.1);\" ID=\"CIRCLESdictionaryFORMbtn1\">Build</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"30\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYperformACTIONask('"+_caption+"',4.0);\" ID=\"CIRCLESdictionaryFORMbtn1\">Inverse</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"30\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYperformACTIONask('"+_caption+"',0.2);\" ID=\"CIRCLESdictionaryFORMbtn2\">Destroy</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"40\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYactionsCRASHSTRINGform();\">Crash words</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"30\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:circles_lib_dict_save();\" ID=\"CIRCLESdictionaryFORMbtn6\">Save</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"30\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYactionsIMPORTform();\">Import</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"40\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:circles_lib_canvas_process_ask(YES,NO,"+(_glob_bip_use?BIP_BOX:_glob_target_plane)+",YES,YES,CHECK);\">Render</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"34\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYcopyPAGE();\">Copy page</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"34\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYcopyDICT();\">Copy dict</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"40\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYrestoreDICT();\">Restore dict</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;

        HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESformsDICTIONARYpaletteDIV\" WIDTH=\""+PALETTEcontainerWIDTH+"\" STYLE=\"padding:5px;\">" ;
        HTMLcode += "<table><tr>" ;
        HTMLcode += "<td ID=\"colorLABEL\">Start</td>";
        HTMLcode += "<td WIDTH=\"3\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:16px;width:16px;background-color:"+_glob_palette_start_rgb+";\" ID=\"CANVAScolorCELLgradientSTART\"></td>";
        HTMLcode += "<td WIDTH=\"3\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'CANVAScolorCELLgradientSTARTICON', 'CANVAScolorCELLgradientSTART' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"CANVAScolorCELLgradientSTARTICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
        HTMLcode += "<td></td>";
        HTMLcode += "<td WIDTH=\"15\"></td>";
        HTMLcode += "<td ID=\"colorLABEL\">End</td>";
        HTMLcode += "<td WIDTH=\"3\"></td>";
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:16px;width:16px;background-color:"+_glob_palette_end_rgb+";\" ID=\"CANVAScolorCELLgradientEND\"></td>";
        HTMLcode += "<td WIDTH=\"3\"></td>";
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
        HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'CANVAScolorCELLgradientENDICON', 'CANVAScolorCELLgradientEND' );\"";
        HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"CANVAScolorCELLgradientENDICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"14\" VALIGN=\"top\" ID=\"PALETTEcontainer\" WIDTH=\""+PALETTEcontainerWIDTH+"\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"14\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYcomputeGRADIENT('"+PALETTEcontainerWIDTH+"');\">Compute gradient</td></tr>";
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"3\" VALIGN=\"top\">" + CIRCLESformsDICTIONARYactionTABLECODE() + "</td></tr>" ;

        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

        HTMLcode += "</table>" ;
        HTMLcode += "</DIV>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "</table>" ;

        HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

        GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
        var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
        circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments,
                   _subset, OPEN, _div.id, _caption, CLOSE_FN,
                   [ "CIRCLESformsDICTIONARYnormalize", _div_id, WIDTH, HEIGHT ],
                   [ "CIRCLESformsDICTIONARYminimize", _div_id, WIDTH, HEIGHT ],
                   [ "CIRCLESformsDICTIONARYmaximize", _div_id, WIDTH, HEIGHT ] );
        if ( _move && _div != null ) move_div( _div.id, "LEFT", "TOP" );

				if ( _items_n > 0 )
        {
          if ( $("#"+_div_id ).resizable('instance') != undefined )
          $("#"+_div_id).resizable('destroy').resizable(
          {
    	      start: function( event, ui ) { CIRCLESformsDICTIONARYstartresize( ui.size.width, ui.size.height ) },
    	      resize: function( event, ui ) { CIRCLESformsDICTIONARYresize( ui.size.width, ui.size.height ); },
    	      stop: function( event, ui )   { CIRCLESformsDICTIONARYstopresize( ui.size.width, ui.size.height ) }
          } );
          else
          {
            $("#"+_div_id).resizable(
            {
      	      start: function( event, ui ) { CIRCLESformsDICTIONARYstartresize( ui.size.width, ui.size.height ) },
      	      resize: function( event, ui ) { CIRCLESformsDICTIONARYresize( ui.size.width, ui.size.height ); },
      	      stop: function( event, ui )   { CIRCLESformsDICTIONARYstopresize( ui.size.width, ui.size.height ) }
            } );
          }
          $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
        }

        CIRCLESformsDICTIONARYresize( WIDTH, HEIGHT );
        if ( _dict_size > 0 )
        {
            CIRCLESformsDICTIONARYdisplayPAGE( _glob_dict_selected_page, "", YES );
            CIRCLESformsDICTIONARYcomputeGRADIENT(PALETTEcontainerWIDTH);
        }

        if ( _items_n > 0 ) $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESformsDICTIONARYload ) } ;
    }
}

function CIRCLESformsDICTIONARYstartresize( _new_width, _new_height ) {}
function CIRCLESformsDICTIONARYstopresize( _new_width, _new_height ) {}

function CIRCLESformsDICTIONARYresize( _new_width, _new_height )
{
    var _hide_palette = _new_width < 640 ;
    var _popup_w = safe_int( $( "#" + CIRCLESformsDICTIONARYdiv_id ).width(), 400 );
    var _palette_w = _hide_palette ? 0 : safe_int( $( "#CIRCLESformsDICTIONARYpaletteDIV" ).width(), 120 );
    var _extra_w = _hide_palette ? 8 : 24 ;

    $( "[id^=CIRCLESdictionaryFORMalphabetBTN]" ).css( "display", _new_width < 510 ? "none" : "block" );
    $( "#CIRCLESformsDICTIONARYpaletteDIV" ).css( "display", _hide_palette ? "none" : "block" );
    
    var _extras_h = 46 ; // caption + menu (FIXED)
    $( "#CIRCLESformsDICTIONARYalphabetFORMcontainerUPPER,#CIRCLESformsDICTIONARYalphabetFORMcontainerLOWER" ).css( "display", _new_width < 440 ? "none" : "block" );
    if ( _new_width >= 440 ) _extras_h += 56 ;

        _extras_h += 38 ; // BUTTONS BAR (with APPLY BTN)
        _extras_h += 14 ; // blank separating lines

    $( "#CIRCLESformsDICTIONARYcheckboxBARcontainer" ).css( "display", _new_width < 590 ? "none" : "block" );
    if ( _new_width >= 590 ) _extras_h += 38 ;

    $( "#CIRCLESformsDICTIONARYlistcommandsbarDIV" ).css( "display", _new_width < 630 ? "none" : "block" );
    if ( _new_width >= 630 ) _extras_h += 40 ;

    $( "#CIRCLESformsDICTIONARYentriesCONTAINER" ).css( "display", _new_width < 330 ? "none" : "block" );
    if ( _new_width >= 330 ) _extras_h += 26 ;

    $( "#CIRCLESformsDICTIONARYactionCONTAINER" ).css( "display", _new_width < 280 ? "none" : "block" );
    if ( _new_width >= 280 ) _extras_h += 28 ;

    $( "#CIRCLESformsDICTIONARYpageDIV" ).width( _popup_w - ( _palette_w + _extra_w ) );
    $( "#CIRCLESformsDICTIONARYpageDIV" ).height( _new_height - _extras_h );
    CIRCLESformsDICTIONARYdisplayPAGE( _glob_dict_selected_page, "", YES );
}

function CIRCLESformsDICTIONARYactionsIMPORTform()
{
     var _div_id = "POPUPdictionaryinputformDIV" ;
     var WIDTH = 340, HEIGHT = 450, boxHEIGHT = HEIGHT - 110 ;
     var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
         HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsDICTIONARYcaption02, 1, YES, "", WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "book/book.icon.16x16.png", "", "" );
         HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;

         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
         HTMLcode += "<table>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#customloader').val('');$('#customloader').trigger('click');\">Load</td>" ;
         HTMLcode += "<td WIDTH=\"10\"></td>" ;
         HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYinputformIMPORT(1);\">Replace</td>" ;
         HTMLcode += "<td WIDTH=\"10\"></td>" ;
         HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYinputformIMPORT(2);\">Append</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;

         HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
         HTMLcode += "<tr><td WIDTH=\"100%\" VALIGN=\"top\" ALIGN=\"center\"><TEXTAREA CLASS=\"linenumberstextarea\" ID=\"CIRCLESdictionaryINPUTtext\"></TEXTAREA></td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;

         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\" HEIGHT=\"22\" CLASS=\"popup_buttons_bar\">" ;
         HTMLcode += "<table>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>Paste a dictionary inside the text box above: one word per row and/or separated by comma</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;

         HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
         HTMLcode += "</table>" ;

         HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
         var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
         circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div.id, CIRCLESformsDICTIONARYcaption02 );
         if ( _div != null ) move_div( _div.id, "RIGHT", "TOP" );

         var _linenumbers_residual_height = boxHEIGHT - 15 ;

         $('document').ready(
         function()
         {
        		$('#CIRCLESdictionaryINPUTtext').linenumbers(
                { col_width: '45px',
                  height: _linenumbers_residual_height + "px",
                  width: ( WIDTH - 10 ) + "px",
                  start: 1 }
            );
            
            $('#CIRCLESdictionaryINPUTtext').css( "height", _linenumbers_residual_height + "px" );
         } );
}

function CIRCLESformsDICTIONARYactionsCRASHSTRINGform()
{
     var _current_crash_words_array = _dictionary_init_settings_array['crash_words_packed'].split( "|" );
     var _div_id = "POPUPdictionaryinputformDIV" ;
     var WIDTH = 340, HEIGHT = 450, boxHEIGHT = HEIGHT - 140 ;
     var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
         HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsDICTIONARYcaption03, 1, YES, "", WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "book/book.icon.16x16.png", "", "" );
         HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;

         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\" HEIGHT=\"22\" CLASS=\"popup_buttons_bar\">" ;
         HTMLcode += "<table>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>Dictionaries compilation won't list words including crash words</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;

         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
         HTMLcode += "<table>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYcrashstringsFORMimport(1);\">Replace</td>" ;
         HTMLcode += "<td WIDTH=\"10\"></td>" ;
         HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYcrashstringsFORMimport(2);\">Append</td>" ;
         HTMLcode += "<td WIDTH=\"40\"></td>" ;
         HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYcrashstringsFORMimport(3);\">Clean</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;

         HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
         HTMLcode += "<tr><td WIDTH=\"100%\" VALIGN=\"top\" ALIGN=\"center\"><TEXTAREA CLASS=\"linenumberstextarea\" ID=\"CIRCLESdictionaryCRASHSTRINGStext\">"+( _current_crash_words_array.join( "," ) )+"</TEXTAREA></td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;

         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\" HEIGHT=\"22\" CLASS=\"popup_buttons_bar\">" ;
         HTMLcode += "<table>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>Paste the crash words into the text box above: one string per row and/or separated by comma</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;

         HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
         HTMLcode += "</table>" ;

         HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
         var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
         circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div.id, CIRCLESformsDICTIONARYcaption03 );
         if ( _div != null ) move_div( _div.id, "RIGHT", "TOP" );

         var _linenumbers_residual_height = boxHEIGHT - 15 ;

         $('document').ready(
         function()
         {
        		$('#CIRCLESdictionaryCRASHSTRINGStext').linenumbers(
                { col_width: '45px',
                  height: _linenumbers_residual_height + "px",
                  width: ( WIDTH - 10 ) + "px",
                  start: 1 }
            );
            
            $('#CIRCLESdictionaryCRASHSTRINGStext').css( "height", _linenumbers_residual_height + "px" );
         } );
}