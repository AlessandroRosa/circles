function CIRCLESformsTANGENTCIRCLEclose() { return circles_lib_popup_dispatcher_unicast_message( "tangentcircle", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }

function CIRCLESformsTANGENTCIRCLEmain( _base_id, _move )
{
    CIRCLESformsTANGENTCIRCLEbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    if ( _glob_method == METHOD_ALGEBRAIC )
    {
        circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ERR_33_05, _glob_app );
        return ;
    }
      
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ) ;
    var _subset = "forms";
    var _div_id = CIRCLESformsTANGENTCIRCLEdiv_id = circles_lib_popup_build_divid( _subset, _base_id );
    var CLOSE_FN = "CIRCLESformsTANGENTCIRCLEclose();";
    if ( _items_n > 0 )
    {
        var _check_group = circles_lib_symbol_check_group( _items_array );
        var _items_error = circles_lib_items_check_data_coherence();
        _glob_zplaneMOUSEprocSWITCH = MOUSE_TANGENTCIRCLE_PROC_ID ;
        var WIDTH = 370, HEIGHT = "auto" ;
        var _fontcolor = _glob_method == METHOD_NONE ? DEFAULT_EDIT_COLOR_DISABLED : DEFAULT_COLOR_STD ;
        var _candidate_item, _candidate_symbol ;
        var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
              HTMLcode += circles_lib_popup_caption_code( YES, CIRCLESformsTANGENTCIRCLEcaption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset );
              HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"2\"></td>" ;
              HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"padding:5px;color:"+_fontcolor+";\">Select circle</td>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding-top:2px;\">" ;
              HTMLcode += "<SELECT "+( _glob_method == METHOD_NONE ? "DISABLED" : "" )+" ID=\"CIRCLEScombo01\" ONCHANGE=\"javascript:CIRCLESformsTANGENTCIRCLEselection();\">" ;
              HTMLcode += "<OPTION VALUE=\"\">" ;
                     
              for( var c = 0 ; c < _items_n ; c++ )
              {
                 _candidate_item = _items_array[c] ;
                 _candidate_symbol = is_item_obj( _candidate_item ) ? _candidate_item.symbol.trim() : "" ;
                 _candidate_symbol = _candidate_symbol.length > 0 ? _candidate_symbol : "< unknown >" ;
                 HTMLcode += "<OPTION VALUE=\""+c+"\">" + _candidate_symbol ;
              }
    
              HTMLcode += "</SELECT>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"padding:5px;color:"+_fontcolor+";\">and click on a Z-plane point to get the tangent one</td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;

              HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
              HTMLcode += "<tr><td ID=\"CIRCLEconstructTANGENTcontainer\" STYLE=\"height:140px;vertical-align:middle;background-color:#232323;color:lime;\" ALIGN=\"center\" CLASS=\"general_rounded_corners\">Output data</td></tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;

              if ( _glob_method == METHOD_NONE )
              HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"color:orange;\">Choose a method and reload this panel to activate this service</td></tr>" ;
              else
              {
                  HTMLcode += "<tr><td VALIGN=\"top\" COLSPAN=\"4\" CLASS=\"popup_buttons_bar\">" ;
                  HTMLcode += "<table>" ;
                  HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
                  HTMLcode += "<tr>" ;
                  HTMLcode += "<td "+( ( _items_n == 0 || _glob_method == METHOD_NONE ) ? "CLASS=\"link_rounded_dead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsTANGENTCIRCLEsetSYMBOLS();\"" )+">Set symbols</td>" ;
                  HTMLcode += "<td WIDTH=\"10\"></td>" ;
                  HTMLcode += "<td ID=\"CONSTRUCTTANGENTinitBTN\" "+( ( _items_n == 0 || _glob_method == METHOD_NONE ) ? "CLASS=\"link_rounded_dead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:$('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);circles_lib_items_init();circles_lib_popup_load('forms','construct.tangent.circle');\"" )+">Init</td>";
                  HTMLcode += "<td WIDTH=\"10\"></td>" ;
                  HTMLcode += "<td ID=\"CONSTRUCTTANGENTsymbolsBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_symbol_zplane_display(null,null,null,YES,YES,YES);\">"+( _glob_show_symbols_zplane ? "Hide seeds" : "Show seeds" )+"</td>" ;
                  HTMLcode += "<td WIDTH=\"10\"></td>" ;
                  HTMLcode += "<td "+( _items_n == 0 ? "CLASS=\"link_rounded_dead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_popup_load('forms','seeds.list');\"" )+">List</td>" ;
                  HTMLcode += "</tr>" ;
                  HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
                  HTMLcode += "</table>" ;
                  HTMLcode += "</td>" ;
                  HTMLcode += "</tr>" ;
              }

              HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
              HTMLcode += "</table>" ;
      }
      else
      {
          var WIDTH = 360, HEIGHT = "auto" ;
          var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
              HTMLcode += circles_lib_popup_caption_code( NO, CIRCLESformsTANGENTCIRCLEcaption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id );
              HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td ALIGN=\"center\" STYLE=\"font-size:12pt;color:"+DEFAULT_COLOR_ERROR+";\">Service unavailable because<br>"+_ERR_33_01+"</td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
              HTMLcode += "</table>" ;
      }

      HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

      GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
      if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
      _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
      var _div = circles_lib_popup_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
      circles_lib_popup_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsTANGENTCIRCLEcaption, CLOSE_FN );
      if ( _move && _div != null ) move_div( _div.id, "RIGHT", "TOP" );
}