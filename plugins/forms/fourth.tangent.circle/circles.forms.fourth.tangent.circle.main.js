function CIRCLESformsFOURTHTANGENTCIRCLEclose() { return circles_lib_plugin_dispatcher_unicast_message( "fourth.tangent", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsFOURTHTANGENTCIRCLEmain( _base_id, _move )
{
    CIRCLESformsFOURTHTANGENTCIRCLEbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _dest_ref = _glob_items_switch == ITEMS_SWITCH_SEEDS ? "seeds" : "gens" ;
    var _category_ref = _glob_items_switch == ITEMS_SWITCH_SEEDS ? "seed" : "gen" ;
    var _items_n = circles_lib_count_items( _items_array );
    if ( _glob_method == METHOD_ALGEBRAIC ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ERR_33_05, _glob_app );
    else if ( _items_n >= 3 )
    {
        var _check_group = circles_lib_symbol_check_group( _items_array );
        var _items_error = circles_lib_items_check_data_coherence(), _subset = "forms" ;
        var CLOSE_FN = "CIRCLESformsFOURTHTANGENTCIRCLEclose()" ;
        var _div_id = CIRCLESformsFOURTHTANGENTCIRCLEdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
        var WIDTH = 400, HEIGHT = "auto" ;
        var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsFOURTHTANGENTCIRCLEcaption + " - " + _dest_ref, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset );
        HTMLcode += "<tr><td VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
    
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td COLSPAN=\"6\" VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr><td>This algorithm uses both Descartes' circles theorem and complex Descartes' theorem to determine both centers and radii</td></tr>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>1st circle</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<SELECT ID=\"CIRCLEScombo01\" ONCHANGE=\"javascript:CIRCLESformsFOURTHTANGENTCIRCLEgatherSELECTIONS();\">" ;
        HTMLcode += "<OPTION VALUE=\"\">" ;
         var _candidate_item, _candidate_symbol ;
             for( var c = 0 ; c < _items_n ; c++ )
             {
                 _candidate_item = _items_array[c] ;
                 _candidate_symbol = is_item_obj( _candidate_item ) ? _candidate_item.symbol.trim() : "" ;
                 _candidate_symbol = _candidate_symbol.length > 0 ? _candidate_symbol : "< unknown >" ;
                 HTMLcode += "<OPTION VALUE=\""+c+"\">" + _candidate_symbol ;
             }
    
             HTMLcode += "</SELECT>" ;
             HTMLcode += "</td>" ;
             HTMLcode += "</tr>" ;
   
             HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;

             HTMLcode += "<tr>" ;
             HTMLcode += "<td WIDTH=\"5\"></td>" ;
             HTMLcode += "<td>2nd circle</td>" ;
             HTMLcode += "<td WIDTH=\"5\"></td>" ;
             HTMLcode += "<td VALIGN=\"top\">" ;
             HTMLcode += "<SELECT ID=\"CIRCLEScombo02\" ONCHANGE=\"javascript:CIRCLESformsFOURTHTANGENTCIRCLEgatherSELECTIONS();\">" ;
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
             HTMLcode += "</tr>" ;
    
             HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;

             HTMLcode += "<tr>" ;
             HTMLcode += "<td WIDTH=\"5\"></td>" ;
             HTMLcode += "<td>3rd circle</td>" ;
             HTMLcode += "<td WIDTH=\"5\"></td>" ;
             HTMLcode += "<td VALIGN=\"top\">" ;
             HTMLcode += "<SELECT ID=\"CIRCLEScombo03\" ONCHANGE=\"javascript:CIRCLESformsFOURTHTANGENTCIRCLEgatherSELECTIONS();\">" ;
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
             HTMLcode += "</tr>" ;
    
        HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>3 circles Configuration</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<SELECT ID=\"CIRCLEconfCOMBO\" ONCHANGE=\"javascript:CIRCLESformsFOURTHTANGENTCIRCLEgatherSELECTIONS();\">" ;
        HTMLcode += "<OPTION VALUE=\"1\">First two tangent to and inside the third one" ;
        HTMLcode += "<OPTION VALUE=\"2\">Two tangent to a line" ;
        HTMLcode += "<OPTION VALUE=\"0\">All other cases" ;
        HTMLcode += "</SELECT>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
    
        HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;

        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>Accuracy power</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td>n</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"ACCURACYpowerEDIT\" STYLE=\"width:30px;text-align:center;\" VALUE=\""+_glob_accuracy+"\"></td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td>1/( 10<sup>n</sup> )</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\" COLSPAN=\"4\" CLASS=\"popup_buttons_bar\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsFOURTHTANGENTCIRCLEgatherSELECTIONS();\">Find</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        if ( _glob_method != METHOD_ALGEBRAIC )
        {
             HTMLcode += "<td ID=\"FOURTHTANGENTinitBTN\" "+( ( _items_n == 0 || _glob_method == METHOD_NONE ) ? "CLASS=\"link_rounded_dead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:$('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);circles_lib_items_init();circles_lib_plugin_load('forms','fourth.tangent.circle');\"" )+">Init</td>";
             HTMLcode += "<td WIDTH=\"10\"></td>" ;
             HTMLcode += "<td "+( ( _items_n == 0 || _glob_method == METHOD_NONE ) ? "CLASS=\"link_rounded_dead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_alphabet_autoconfig_all_symbols(YES,NO,NO);circles_lib_plugin_load('forms','fourth.tangent.circle');\"" )+">Set symbols</td>" ;
             HTMLcode += "<td WIDTH=\"10\"></td>" ;
             HTMLcode += "<td ID=\"FOURTHTANGENTsymbolsBTN\" "+( ( _items_n == 0 || _glob_method == METHOD_NONE ) ? "CLASS=\"link_rounded_dead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_symbol_zplane_display(null,null,null,YES,YES);CIRCLESformsFOURTHTANGENTCIRCLEgatherSELECTIONS();\"" )+">"+( _glob_show_symbols_zplane ? "Hide seeds" : "Show seeds" )+"</td>" ;
        }

        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsFOURTHTANGENTCIRCLEcleanCANVAS( YES, YES );\">Clean canvas</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td "+( _items_n == 0 ? "CLASS=\"link_rounded_dead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','seeds.list');\"" )+">List</td>" ;

        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
              
        HTMLcode += "<tr><td VALIGN=\"top\" ALIGN=\"center\" COLSPAN=\"4\">" ;
        HTMLcode += "<table WIDTH=\"99%\">" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td ID=\"CIRCLEfourthTANGENTcontents\" VALIGN=\"top\" WIDTH=\"100%\" ALIGN=\"center\" STYLE=\"padding:3px;height:180px;background-color:#232323;color:lime;\" CLASS=\"general_rounded_corners\">Output data</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        if ( _items_error == ITEM_ERR_UNDET )
        {
           HTMLcode += "<tr><td VALIGN=\"top\" ALIGN=\"center\" COLSPAN=\"4\">" ;
           HTMLcode += "<table>" ;
           HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
           HTMLcode += "<tr><td STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">"+_ERR_24_02+"</td></tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
           HTMLcode += "</table>" ;
           HTMLcode += "</td>" ;
           HTMLcode += "</tr>" ;
        }
    
        HTMLcode += "</table>" ;
        HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                         
        GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
        var _div = circles_lib_plugin_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
        circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsFOURTHTANGENTCIRCLEcaption, CLOSE_FN );
        if ( _move && _div != null ) move_div( _div.id, "RIGHT", "TOP" );
    }
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "This service is available only if at least 3 circles have been generated", _glob_app );
}