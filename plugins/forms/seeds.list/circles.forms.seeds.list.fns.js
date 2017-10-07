function CIRCLESformsSEEDSLISTswapSEEDitem( _index01, _index02 )
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    if ( is_item_obj( _items_array[_index01] ) && is_item_obj( _items_array[_index02] ) )
    {
		    var _tmp = _items_array[_index01] ;
		    _items_array[_index01] = _items_array[_index02].copy() ;
		    _items_array[_index02] = _tmp ;
		    return YES ;
		}
		else return NO ;
}

function CIRCLESformsSEEDSLISTgeneratorsPANELask()
{
    if ( _glob_to_save == NO )
    {
       var YES_CMD = "circles_lib_items_init_wrapper_fn(null,YES,NO,_glob_init_mask);" ;
       if ( circles_lib_plugin_find_index( { subset : "forms", base_id : 'edit.disk' }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_SUBSET ) != UNFOUND ) circles_lib_plugin_load('forms','edit.disk', NO,_glob_disk_sel_index );
       else if ( circles_lib_plugin_find_index( { subset : "forms", base_id : 'seeds.list' }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_SUBSET ) != UNFOUND ) circles_lib_plugin_load('forms','seeds.list', NO, _glob_disk_sel_index );
       alert_plug_label( ALERT_YES, "Init" );
       alert_plug_fn( ALERT_YES, "alertCLOSE();"+YES_CMD );
       alert_plug_fn( ALERT_NO, "alertCLOSE();" );
       alert_set_btns_width( "90px" );
       circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING | DISPATCH_YESNO, _QUESTION_28, _glob_app_title );
    }
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _QUESTION_06, _glob_app_title );
}

function CIRCLESformsSEEDSLISTbarHTMLCODE( _selected_index, _index )
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_ref = _glob_items_switch == ITEMS_SWITCH_GENS ? "generators" : "seeds" ;
    var _items_n = circles_lib_count_items( _items_array ) ;
    var HTMLcode =  "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    if ( _items_n > 0 )
    {
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td WIDTH=\"35\">Gens</td>" ;
        HTMLcode += "<td ID=\"LISTshowBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsSEEDSLISTtoggleGENSlist();\">Show</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td ID=\"LISTinitBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_items_init_wrapper_fn(null,YES,NO,_glob_init_mask,OUTPUT_SCREEN);\">Init</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','check.items');\">Help</td>" ;
        HTMLcode += "<td WIDTH=\"25\"></td>" ;
        HTMLcode += "<td WIDTH=\"35\">Seeds</td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:var go = circles_lib_symbol_shift(null,YES);if (go){_glob_items_to_init=YES;$('[id$=initBTN]').css('color',COLOR_ERROR) ;CIRCLESformsSEEDSLISTmain(CIRCLESformsSEEDSLISTbaseid);circles_lib_canvas_render_zplane(null,null,null,YES,YES,YES,NO,YES,YES,OUTPUT_SCREEN);}\">Shift forward</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:var go = circles_lib_symbol_shift(null,NO);if (go){_glob_items_to_init=YES;$('[id$=initBTN]').css('color',COLOR_ERROR) ;CIRCLESformsSEEDSLISTmain(CIRCLESformsSEEDSLISTbaseid);circles_lib_canvas_render_zplane(null,null,null,YES,YES,YES,NO,YES,YES,OUTPUT_SCREEN);}\">Shift backward</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_symbol_remove_all('"+_items_ref+"',1,NO);\">Bomb</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td WIDTH=\"45\">Symbols</td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_alphabet_autoconfig_all_symbols(YES,NO,NO);CIRCLESformsSEEDSLISTmain(CIRCLESformsSEEDSLISTbaseid,NO,"+_selected_index+");\">Set</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td ID=\"CIRCLESlistPANELshowsymbolsBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_symbol_zplane_display(null,null,null,YES,YES,YES);\">"+( _glob_show_symbols_zplane ? "Hide" : "Show" )+"</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_items_to_init=YES;$('[id$=initBTN]').css('color',COLOR_ERROR) ;circles_lib_symbol_swap(null,null,NO,YES);\">Swap</td>" ;

        if ( _glob_method == METHOD_NONE )
        HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"background-color:#E80000;color:white;padding:5px;\">Alert: choose a method</td>" ;

        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
    }

    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    if ( _glob_method == METHOD_ALGEBRAIC )
    {
        HTMLcode += "<td WIDTH=\"55\">"+METHOD_ALGEBRAIC_DEF+"</td>" ;
        HTMLcode += "<td>Show</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td><INPUT "+( _glob_options_mask & 8 ? "CHECKED" : "" )+" TYPE=\"checkbox\" ID=\"CIRCLESlistFIXEDPOINTSshowCHECKBOX\"></td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
    }
    HTMLcode += "<td WIDTH=\"40\">Extras</td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','edit.disk',NO,ITEM_TYPE_CIRCLE);\">Add circle</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','edit.disk',NO,ITEM_TYPE_MOBIUS);\">Add map</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_coordinates_zoomtofit(Z_PLANE,YES);circles_lib_plugin_load('forms','coordinates',NO,Z_PLANE);\">Zoom to fit</td>" ;
    HTMLcode += "<td WIDTH=\"1\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_colors_colorize( _glob_items_switch, NO );\">Colorize</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    return HTMLcode ;
}