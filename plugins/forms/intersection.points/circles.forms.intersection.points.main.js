function CIRCLESformsINTERSECTIONPOINTSclose() { return YES ; }
function CIRCLESformsINTERSECTIONPOINTSmain( _base_id, _move )
{
    CIRCLESformsINTERSECTIONPOINTSbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ) ;
    var _run = _items_n > 1, _subset = "forms" ;
    var WIDTH = 350, HEIGHT = "auto" ;
    var _div_id = CIRCLESformsINTERSECTIONPOINTSdiv_id = circles_lib_popup_build_divid( _subset, _base_id );
    var CLOSE_FN = "CIRCLESformsINTERSECTIONPOINTSclose();" ;
    var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
        HTMLcode += circles_lib_popup_caption_code( _run, CIRCLESformsINTERSECTIONPOINTScaption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset );
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

    if ( _items_n > 1 )
    {
        var _check_group = circles_lib_symbol_check_group( _items_array );
        var _items_error = circles_lib_items_check_data_coherence();

        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F0F0F0;padding:4px;\">" ;

        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>Pick up disk</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<SELECT ID=\"CIRCLEScombo1\" ONCHANGE=\"javascript:CIRCLESformsINTERSECTIONPOINTScomboONCHANGE();\">" ;
        HTMLcode += "<OPTION VALUE=\""+UNDET+"\">" ;
        var SELECTED, _candidate_item, _candidate_symbol ;
        for( var c = 0 ; c < _items_n ; c++ )
        {
            _candidate_item = _items_array[c] ;
            _candidate_symbol = is_item_obj( _candidate_item ) ? _candidate_item.symbol.trim() : "" ;
            _candidate_symbol = _candidate_symbol.length > 0 ? _candidate_symbol : "< unknown >" ;
            HTMLcode += "<OPTION "+SELECTED+" VALUE=\""+c+"\">" + _candidate_symbol ;
        }

        HTMLcode += "</SELECT>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_popup_load('forms','edit.disk',NO,$('#CIRCLEScombo1').val());\">Edit</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_coordinates_zoom_in_disk(YES,$('#CIRCLEScombo1').val(),YES,YES);\">Zoom</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>Pick up disk</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<SELECT ID=\"CIRCLEScombo2\" ONCHANGE=\"javascript:CIRCLESformsINTERSECTIONPOINTScomboONCHANGE();\">" ;
        HTMLcode += "<OPTION VALUE=\""+UNDET+"\">" ;
                 
        for( var c = 0 ; c < _items_n ; c++ )
        {
            _candidate_item = _items_array[c] ;
            _candidate_symbol = is_item_obj( _candidate_item ) ? _candidate_item.symbol.trim() : "" ;
            _candidate_symbol = _candidate_symbol.length > 0 ? _candidate_symbol : "< unknown >" ;
            HTMLcode += "<OPTION "+SELECTED+" VALUE=\""+c+"\">" + _candidate_symbol ;
        }

        HTMLcode += "</SELECT>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_popup_load('forms','edit.disk',NO,$('#CIRCLEScombo2').val());\">Edit</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_coordinates_zoom_in_disk(YES,$('#CIRCLEScombo2').val(),YES,YES);\">Zoom</td>" ;

        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#EBEBEB;padding:4px;\">" ;

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

        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\" ID=\"intersectionpointsRESULTcontainer\" WIDTH=\"98%\" ALIGN=\"center\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#EBEBEB;padding:4px;\">Output data</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_coordinates_zoomtofit( Z_PLANE, YES );\">Zoom to fit</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    }
    else
    {
      HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;padding:3px;color:red;\">This panel is available only when at least two circles have been set up</td></tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    }

    HTMLcode += "</table>" ;
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_popup_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
    circles_lib_popup_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsINTERSECTIONPOINTScaption, CLOSE_FN );
    if ( _move && _div != null ) move_div( _div.id, "RIGHT", "TOP" );
}