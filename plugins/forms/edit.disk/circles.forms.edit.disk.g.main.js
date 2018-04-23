function CIRCLESformsEDITDISKclose() { return circles_lib_plugin_dispatcher_unicast_message( 'edit.disk', "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsEDITDISKwatchformulaASK( _item_index )
{
    _item_index = safe_int( _item_index, UNDET );
    if ( _item_index != UNDET )
    {
       if ( _glob_to_save == YES )
       {
          alert_plug_label( ALERT_YES, "Continue" );
          alert_plug_label( ALERT_NO, "No, stay here" );
          alert_plug_fn( ALERT_YES, "alertCLOSE();circles_lib_plugin_load('forms','watch.formula',YES,'"+_item_index+"', 0 )" );
          alert_plug_fn( ALERT_NO, "alertCLOSE();" );
          alert_set_btns_width( "90px" );
          circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING | DISPATCH_YESNO, _QUESTION_07, _glob_app_title );
       }
       else circles_lib_plugin_load('forms','watch.formula', YES, _item_index, 0 );
    }
}

function CIRCLESformsEDITDISKask( _item_index, _items_switch )
{
    _item_index = safe_int( _item_index, UNDET );
    var _chunk = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _chunk['count'], _items_array = _chunk['array'], _caption = _chunk['label'], _items_switch = _chunk['switch'] ;
    if ( _item_index != UNDET )
    {
       var _b_colorize = $( "#CIRCLESformsEDITDISKcolorizeCHECKBOX" ).prop( "checked" ) ? YES : NO ;
       var _options = [ _b_colorize ] ;
       _glob_persistent_vars['tmp_arg'] = _options.clone();
       if ( _glob_to_save == YES )
       {
          alert_plug_label( ALERT_YES, "Continue" );
          alert_plug_label( ALERT_NO, "No, stay here" );
          alert_plug_fn( ALERT_YES, "alertCLOSE();circles_lib_plugin_load('forms','edit.disk',NO,"+_item_index+","+_items_switch+",_glob_persistent_vars['tmp_arg'])" );
          alert_plug_fn( ALERT_NO, "alertCLOSE();" );
          alert_set_btns_width( "90px" );
          circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING | DISPATCH_YESNO, _QUESTION_07, _glob_app_title );
       }
       else
       {
          $("#CIRCLESeditPANELpreviousBTN").attr( "class", ( _item_index > 0 && _item_index <= ( _items_n - 1 ) ) ? "link" : "linkdead" );
          $("#CIRCLESeditPANELnextBTN").attr( "class", (_item_index >= 0 && _item_index < ( _items_n - 1 ) ) ? "link" : "linkdead" );
          if ( _item_index >= 0 && _item_index <= ( _items_n - 1 ) ) circles_lib_plugin_load('forms','edit.disk',NO,_item_index,_items_switch,_options );
          else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "This item index is out of current range.", 'CIRCLESformsEDITDISKoutMSG', 3000, YES ) ;
       }
    }
}

function CIRCLESformsEDITDISKmain( _base_id, _move, _item_index, _items_switch )
{
    var _this_fn_name = "CIRCLESformsEDITDISKmain" ;
    var _options = is_array( arguments[4] ) ? arguments[4] : [] ;
    var _chunk = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _chunk['count'], _items_array = _chunk['array'], _caption = _chunk['label'], _items_switch = _chunk['switch'] ;
    if ( is_string( _item_index ) ) _item_index = _item_index.isNumber() ? safe_int( _item_index, _glob_disk_sel_index ) : circles_lib_find_item_index_by_symbol( _items_array, _item_index ) ;
    else _item_index = safe_int( _item_index, UNDET );
    
    CIRCLESformsEDITDISKbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    _glob_to_save = NO, _glob_current_tab['editdisk'] = 0 ;
    if ( _items_n == 1 || ( _items_n > 1 && _item_index == UNDET ) ) _item_index = 0 ;

    var ITEM = is_array( _items_array ) ? _items_array[_item_index] : null ;
    var _b_exists = is_item_obj( ITEM );
    var _mm = _b_exists ? ITEM.map : null ;
    var _mm_exists = is_mobius_map( _mm ) ? 1 : 0 ;
    var complex_circle = _b_exists ? ITEM.complex_circle : new circle( new point( 0, 0 ), 0 );
    var PARAMSinputTYPEmask = _b_exists ? ITEM.params_mask : 0 ;
    var bordersize = ( _b_exists && is_circle( complex_circle ) ) ? ITEM.complex_circle.bordersize : "" ;
    var symbol = _b_exists ? safe_string( ITEM.symbol, "" ) : "" ;
    var inv_symbol = _b_exists ? ITEM.inverse_symbol : "" ;
    var fill = ( _b_exists && is_circle( complex_circle ) ) ? ITEM.complex_circle.fill : NO ;
    var draw = ( _b_exists && is_circle( complex_circle ) ) ? ITEM.complex_circle.draw : NO ;
    var bordercolor = ( _b_exists && is_circle( complex_circle ) ) ? ITEM.complex_circle.bordercolor : "" ;
    var fillcolor = ( _b_exists && is_circle( complex_circle ) ) ? ITEM.complex_circle.fillcolor : "" ;
    var null_map_flag = _b_exists ? ( is_mobius_map( ITEM.map ) ? NO : YES ) : NO ;
                 
    // input points are in complex coordinates
    var complex_center_pt = is_circle( complex_circle ) ? complex_circle.center : new point( 0, 0 );
    var complex_radius = is_circle( complex_circle ) ? complex_circle.radius : 0 ;
    var complex_radius_pt = is_circle( complex_circle ) ? new point( complex_circle.center.x + complex_circle.radius, complex_circle.center.y ) : new point( 0, 0 );
                 
    // parameters a,b,c,d are of complex class
    var MOBIUSparamA = _mm_exists ? _mm.get_a() : new complex( 0.0, 0.0 );
    var MOBIUSparamB = _mm_exists ? _mm.get_b() : new complex( 0.0, 0.0 );
    var MOBIUSparamC = _mm_exists ? _mm.get_c() : new complex( 0.0, 0.0 );
    var MOBIUSparamD = _mm_exists ? _mm.get_d() : new complex( 0.0, 0.0 );

    var WIDTH = 450, HEIGHT = "auto", _subset = "forms" ;
    var _div_id = CIRCLESformsEDITDISKdiv_id = circles_lib_plugin_build_divid( _subset, _base_id ) ;
    var CLOSE_FN = "CIRCLESformsEDITDISKclose();" ;
    var _caption = _items_switch == ITEMS_SWITCH_SEEDS ? CIRCLESformsEDITDISKcaption01 : CIRCLESformsEDITDISKcaption02 ;
    _caption += " - index #" + _item_index + ( ( symbol.length > 0 ) ? " - Symbol : " + symbol : "" ) ;
    var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, _caption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, _this_fn_name, _base_id, _div_id, _subset );

    if ( _items_n > 0 )
    {
        HTMLcode += "<tr><td HEIGHT=\"6\" COLSPAN=\"3\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\">" ;

        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>Pick</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<SELECT ID=\"CIRCLESseedsCOMBO\" ONCHANGE=\"javascript:circles_lib_plugin_load('forms','edit.disk', NO, this.options[this.selectedIndex].value, "+_items_switch+" );\">" ;
        HTMLcode += "<OPTION VALUE=\"\">" ;
                 
        var SELECTED, _candidate_item_obj, _candidate_symbol ;
        for( var _c = 0 ; _c < _items_n ; _c++ )
        {
            SELECTED = _item_index == _c ? "SELECTED=\"selected\"" : "" ;
            _candidate_item_obj = _items_array[_c] ;
            _candidate_symbol = is_item_obj( _candidate_item_obj ) ? _candidate_item_obj.symbol.trim() : "" ;
            _candidate_symbol = _candidate_symbol.length > 0 ? _candidate_symbol : "undet #"+_c+"" ;
            HTMLcode += "<OPTION "+SELECTED+" VALUE=\""+_c+"\">" + _candidate_symbol ;
        }

        HTMLcode += "</SELECT>" ;
        HTMLcode += "</td>" ;

        if ( _item_index >= 0 )
        {
            HTMLcode += "<td WIDTH=\"3\"></td>" ;
            var _enable = ( _item_index > 0 && _item_index <= ( _items_n - 1 ) ) ? YES : NO ;
            var _class = _enable ? "link_rounded" : "link_rounded_dead" ;
            var _onclick = _enable ? "ONCLICK=\"javascript:CIRCLESformsEDITDISKask('"+(_item_index-1)+"','"+_items_switch+"');\"" : "" ;
            HTMLcode += "<td CLASS=\""+_class+"\" ID=\"CIRCLESeditPANELpreviousBTN\" "+_onclick+">Prev</td>" ;
            HTMLcode += "<td WIDTH=\"1\"></td>" ;
            _enable = ( _item_index >= 0 && _item_index < ( _items_n - 1 ) ) ? YES : NO ;
            _class = _enable ? "link_rounded" : "link_rounded_dead" ;
            _onclick = _enable ? "ONCLICK=\"javascript:CIRCLESformsEDITDISKask('"+(_item_index+1)+"','"+_items_switch+"');\"" : "" ;
            HTMLcode += "<td CLASS=\""+_class+"\" ID=\"CIRCLESeditPANELnextBTN\" "+_onclick+">Next</td>" ;
        }

        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsEDITDISKobjectAPPLY("+UNDET+",ITEM_TYPE_CIRCLE,"+_items_switch+",YES,NO);\">Add new item</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CIRCLESformsEDITDISKapplyBTN\" ONCLICK=\"javascript:CIRCLESformsEDITDISKobjectAPPLY("+_item_index+",ITEM_TYPE_CIRCLE,"+_items_switch+",YES,NO);\">Apply changes</td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        if ( symbol.isAlpha() && _items_n > 0 )
        {
            HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:var last_id = CIRCLESformsEDITDISKcreate_inverse_element(null,'"+_item_index+"');if ( last_id != "+UNDET+" ) circles_lib_plugin_load('forms','edit.disk',NO,last_id);\">Create inverse</td>" ;
            HTMLcode += "<td WIDTH=\"2\"></td>" ;
        }

        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','seeds.list', NO,"+_item_index+");\">List</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','check.items');\">Help</td>" ;
        HTMLcode += "<td WIDTH=\"20\"></td>" ;

        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;

        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    }

    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
                         
    var _tab_width = WIDTH - 10 ;
    HTMLcode += "<div id=\"CIRCLESEDITmainDIV\" STYLE=\"width:"+_tab_width+"px;height:128px;\" class=\"tabber\">" ;

    HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:"+_tab_width+"px;height:120px;\" VALIGN=\"top\" ID=\"CIRCLESEDIT_TAB_01\">" ;
    HTMLcode += "<h2>Coordinates</h2>" ;
    HTMLcode += CIRCLESformsEDITDISKcoordinatesCODE(_item_index);
    HTMLcode += "</div>" ;

    HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:"+_tab_width+"px;height:120px;\" VALIGN=\"top\" ID=\"CIRCLESEDIT_TAB_02\">" ;
    HTMLcode += "<h2>Map parameters</h2>" ;
    HTMLcode += CIRCLESformsEDITDISKmobiusmapCODE(_item_index);
    HTMLcode += "</div>" ;

    HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:"+_tab_width+"px;height:120px;\" VALIGN=\"top\" ID=\"CIRCLESEDIT_TAB_03\">" ;
    HTMLcode += "<h2>Graphix</h2>" ;
    HTMLcode += CIRCLESformsEDITDISKgraphixCODE(_item_index);
    HTMLcode += "</div>" ;

    HTMLcode += "</div>" ;

    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
                         
    HTMLcode += "<tr><td HEIGHT=\"13\"></td></tr>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td COLSPAN=\"3\" VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>Symbol</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td>Map</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td><INPUT ID=\"CIRCLEselectedSYMBOL\" TYPE=\"edit\" ONKEYUP=\"javascript:EVENTSstopDISPATCHING( event );\" STYLE=\"width:20px;text-align:center;\" VALUE=\""+symbol+"\"></td>" ;
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsEDITDISKsuggestSYMBOL('direct');\">Suggest</td>" ;
        if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) ) // Inverse symbol is required for paired circles exclusively
        {
            HTMLcode += "<td WIDTH=\"10\"></td>" ;
            HTMLcode += "<td>Inverse</td>" ;
            HTMLcode += "<td WIDTH=\"3\"></td>" ;
            HTMLcode += "<td><INPUT ID=\"CIRCLEselectedINVERSESYMBOL\" TYPE=\"edit\" ONKEYUP=\"javascript:EVENTSstopDISPATCHING( event );\" STYLE=\"width:20px;text-align:center;\" VALUE=\""+inv_symbol+"\"></td>" ;
            HTMLcode += "<td WIDTH=\"1\"></td>" ;
            HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsEDITDISKsuggestSYMBOL('inverse');\">Suggest</td>" ;
        }

        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td>Colorize</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"checkbox\" "+( safe_int( _options[0], NO ) == YES ? "CHECKED" : "" )+" ID=\"CIRCLESformsEDITDISKcolorizeCHECKBOX\"></td>" ;
		    HTMLcode += "</tr>" ;
	      HTMLcode += "</table>" ;
		    HTMLcode += "</td>" ;
		    HTMLcode += "</tr>" ;
		    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONMOUSEMOVE=\"javascript:this.style.cursor='pointer';\" ID=\"CIRCLESeditBARMENUentry_1\" ONCLICK=\"javascript:CIRCLESformsEDITDISKbtnbarSHOW(1);\">Disks</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONMOUSEMOVE=\"javascript:this.style.cursor='pointer';\" ID=\"CIRCLESeditBARMENUentry_2\" ONCLICK=\"javascript:CIRCLESformsEDITDISKbtnbarSHOW(2);\">Zoom</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONMOUSEMOVE=\"javascript:this.style.cursor='pointer';\" ID=\"CIRCLESeditBARMENUentry_3\" ONCLICK=\"javascript:CIRCLESformsEDITDISKbtnbarSHOW(3);\">Map</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONMOUSEMOVE=\"javascript:this.style.cursor='pointer';\" ID=\"CIRCLESeditBARMENUentry_4\" ONCLICK=\"javascript:CIRCLESformsEDITDISKbtnbarSHOW(4);\">Group</td>" ;
    HTMLcode += "<td WIDTH=\"25\"></td>" ;
    HTMLcode += "<td ID=\"CIRCLESformsEDITDISKoutMSG\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                     
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<DIV CLASS=\"general_rounded_corners\" STYLE=\"position:relative;display:none;height:auto;background-color:#F7F7F7;\"\" ID=\"CIRCLESeditBARDIV_1\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td WIDTH=\"70\">Disks</td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_disk_sel_index="+_item_index+";circles_lib_complexdisk_remove('"+_items_switch+"',YES,NO,YES,YES,NO);\">Remove item</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsEDITDISKremoveMOBIUSfillCOLOR("+_item_index+",YES);\" "+( fillcolor.length == 0 ? "DISABLED" : "" )+">Remove color</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</DIV>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<DIV CLASS=\"general_rounded_corners\" STYLE=\"position:relative;display:none;height:auto;background-color:#F7F7F7;\"\" ID=\"CIRCLESeditBARDIV_2\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td WIDTH=\"70\">Zoom</td>" ;
    HTMLcode += "<td WIDTH=\"11\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_coordinates_zoom_in_disk( YES, "+_item_index+");\">Zoom</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_coordinates_zoomtofit( Z_PLANE, YES );\">Zoom to fit</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</DIV>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<DIV CLASS=\"general_rounded_corners\" STYLE=\"position:relative;display:none;height:auto;background-color:#F7F7F7;\"\" ID=\"CIRCLESeditBARDIV_3\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td WIDTH=\"70\">Map</td>" ;
    HTMLcode += "<td WIDTH=\"11\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','mobius.maps.properties',NO,"+_item_index+");\">Properties</td>";
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsEDITDISKwatchformulaASK("+_item_index+");\">Watch formula</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_disk_sel_index="+_item_index+";circles_lib_forms_play_inversion(YES,YES);\" ID=\"PLAYINVERSIONbtn\">Play inversion</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</DIV>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<DIV CLASS=\"general_rounded_corners\" STYLE=\"position:relative;display:none;height:auto;background-color:#F7F7F7;\"\" ID=\"CIRCLESeditBARDIV_4\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td WIDTH=\"70\">Group</td>" ;
    HTMLcode += "<td WIDTH=\"11\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_alphabet_autoconfig_all_symbols(YES,NO,NO);circles_lib_plugin_load('forms','seeds.list',NO,"+_item_index+");\">Set symbols</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>";
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_items_init_wrapper_fn(null,_glob_init_mask,YES,NO);\" ID=\"EDITDISKinitBTN\">Init</td>";
    HTMLcode += "<td WIDTH=\"2\"></td>";
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_items_to_init=NO;$('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);circles_lib_plugin_load('forms','edit.disk',NO,"+_item_index+");\">Fix</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_items_group_test();\">Check</td>" ;
    HTMLcode += "</tr>" ;
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
    tabberAutomatic( CIRCLESEDITtabberOptions, "CIRCLESEDIT" );

    circles_lib_plugin_activate( NO, _base_id, _this_fn_name, arguments, _subset, OPEN, _div_id, _caption, CLOSE_FN );
    if ( _move && _div != null ) move_div( _div_id, "RIGHT", "TOP" );

    $("#CIRCLESEDITmainDIV").get(0).tabber.tabShow( _glob_current_tab['editdisk'] );
    $("#CIRCLEselectedSYMBOL").focus();

    // highlight the selected object on the screen as its data
    // are displayed in this pop-up window
    if ( _item_index != UNDET )
    {
        _glob_zplane_selected_items_array = [];
        _glob_zplane_selected_items_array.push( _item_index );
        circles_lib_helper_div_remove();
        var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, OUTPUT_SCREEN );
        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
        if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
    }
         
    _glob_disk_sel_index = _item_index ;
}