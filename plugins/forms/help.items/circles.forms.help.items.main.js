function CIRCLESformsHELPITEMSclose() { return circles_lib_plugin_dispatcher_unicast_message( "help.items", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsHELPITEMSmain( _base_id, _move, _items_switch )
{
    _move = safe_int( _move, YES );
    var _chunk = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _chunk['count'], _items_array = _chunk['array'], _caption = _chunk['label'], _items_switch = _chunk['switch'] ;
    CIRCLESformsHELPITEMSbaseid = safe_string( _base_id, "" ) ;

    var _err_mask_whole = 0 ; // keeps track of which errors have been found
    var WIDTH = 320, HEIGHT = "auto", _subset = "forms" ;
    var CLOSE_FN = "CIRCLESformsHELPITEMSclose()" ;
    var _div_id = CIRCLESformsHELPITEMSdiv_id = circles_lib_plugin_build_divid( _subset, _base_id ) ;
    var _caption = _items_switch == ITEMS_SWITCH_SEEDS ? CIRCLESformsHELPITEMScaption01 : CIRCLESformsHELPITEMScaption02 ;
    var _are_seeds_switched = _items_switch == ITEMS_SWITCH_SEEDS ? YES : NO ;
    var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
        HTMLcode += circles_lib_plugin_caption_code( _items_n > 0 ? YES : NO, _caption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "aid/aid.16x16.png" );
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" ALIGN=\"center\" WIDTH=\"100%\" ALIGN=\"center\">" ;
        HTMLcode += "<table ALIGN=\"center\" WIDTH=\""+WIDTH+"\">" ;
    if ( _items_n > 0 )
    {
        var OKcode = "<td ALIGN=\"center\"><IMG %addon% SRC=\"%imgpath%icons/checked/checked.icon.01.12x12.png\"></td>" ;
        var FAILcode = "<td ALIGN=\"center\" ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" %onclick% ><IMG %addon% SRC=\"%imgpath%icons/unchecked/unchecked.icon.01.12x12.png\"></td>" ;
        var DISABLEDcode = "<td ALIGN=\"center\"><IMG TITLE=\"Missing inverse symbol for this method\" SRC=\"%imgpath%icons/disabled/disabled.icon.01.16x16.png\"></td>" ;
                
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\"></td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td COLSPAN=\"3\" VALIGN=\"top\" STYLE=\"color:#57839F;\">Symbols</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td COLSPAN=\"3\" VALIGN=\"top\" STYLE=\"color:#57839F;\">Seed</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td COLSPAN=\"3\" VALIGN=\"top\" STYLE=\"color:#57839F;\">Gen</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">&nbsp;</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">Direct</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">Inverse</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">Circle</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">Map</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">Circle</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\">Map</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;

        var ITEM, _symbol, _inv_symbol, _complex_circle, _mobius_map, _err_mask ;
        for( var i = 0 ; i < _items_n ; i++ )
        {
            ITEM = _items_array[i] ;
            if ( is_item_obj( ITEM ) )
            {
                _err_mask = 0 ;
                _symbol = ITEM.symbol, _inv_symbol = ITEM.inverse_symbol ;
                _complex_circle = ITEM.complex_circle, _mobius_map = ITEM.map ;
                if ( _symbol.length == 0 ) _err_mask |= 1 ;
                if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) && _inv_symbol.length == 0 ) _err_mask |= 2 ;
                if ( !is_circle( _complex_circle ) ) _err_mask |= 4 ;
                if ( !is_mobius_map( _mobius_map ) ) _err_mask |= 16 ;
                if ( _err_mask != 0 ) FAILcode = FAILcode.replaceAll( "%onclick%", "ONCLICK=\"javascript:CIRCLESformsHELPGENERATORSdisplayERROR( "+_err_mask+");\"" );

                HTMLcode += "<tr>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "<td WIDTH=\"15\">"+( _symbol.length == 0 ? "<IMG ALIGN=\"center\" SRC=\"%imgpath%icons/questionmark/question.mark.icon.01.16x16.png\">" : _symbol )+"</td>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += _err_mask & 1 ? FAILcode : OKcode ;
                HTMLcode = HTMLcode.replaceAll( "%addon%", "TITLE=\""+_symbol+"\"" );
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += ( circles_lib_method_check() && _glob_method.is_one_of( METHOD_ALGEBRAIC ) ) ? ( _err_mask & 2 ? FAILcode : OKcode ) : DISABLEDcode ;
                HTMLcode += "<td WIDTH=\"15\"></td>" ;
                HTMLcode += _err_mask & 16 ? FAILcode : OKcode ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += ( _err_mask & 4 || _err_mask & 8 ) ? FAILcode : OKcode ;
                HTMLcode += "<td WIDTH=\"15\"></td>" ;
                HTMLcode += _err_mask & 64 ? FAILcode : OKcode ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += _err_mask & 32 ? FAILcode : OKcode ;
                HTMLcode += "<td WIDTH=\"10\"></td>" ;
                HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','edit.disk', NO, "+i+");\">Edit</td>" ;
                HTMLcode += "<td WIDTH=\"1\"></td>" ;

                if ( _err_mask & 16 || _err_mask & 32 || _err_mask & 64 )
                HTMLcode += "<td "+( _glob_method == METHOD_NONE ? "CLASS=\"linkdead\"" : "CLASS=\"link\" ONCLICK=\"javascript:circles_lib_items_init_wrapper_fn("+i+",_glob_init_mask,YES,NO);CIRCLESformsHELPITEMSmain(CIRCLESformsHELPITEMSbaseid);\"" )+">Init</td>" ;
                else HTMLcode += "<td COLSPAN=\"3\"></td>" ;

                HTMLcode += "<td WIDTH=\"1\"></td>" ;
                HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:event.stopPropagation();_glob_zplane_selected_items_array.flush();_glob_zplane_selected_items_array.push("+i+");_glob_disk_sel_index="+i+";circles_lib_canvas_render_zplane( null, zplane_sm, null,YES,YES,YES,NO,YES);\">Select</td>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
                              
                if ( _err_mask & 1 ) _err_mask_whole |= 1 ;
                if ( _err_mask & 2 ) _err_mask_whole |= 2 ;
                if ( _err_mask & 4 ) _err_mask_whole |= 4 ;
                if ( _err_mask & 16 ) _err_mask_whole |= 16 ;
                if ( _err_mask & 32 ) _err_mask_whole |= 32 ;
                if ( _err_mask & 64 ) _err_mask_whole |= 64 ;
             }
        }
               
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        if ( _glob_method == METHOD_NONE )
        {
            HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            HTMLcode += "<tr><td ALIGN=\"center\">Critical error</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td VALIGN=\"top\" ALIGN=\"center\">" ;
            HTMLcode += "<table ALIGN=\"center\">" ;
            HTMLcode += "<tr><td VALIGN=\"top\" STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">"+_ERR_00_01+"</td></tr>" ;
            HTMLcode += "</table>" ;
            HTMLcode += "</td>" ;
            HTMLcode += "</tr>" ;
        }
        else if ( _glob_method.is_one_of( METHOD_INVERSION, METHOD_ALGEBRAIC ) )
        {
            HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td VALIGN=\"top\" ALIGN=\"center\">" ;
            HTMLcode += "<table ALIGN=\"center\">" ;
            HTMLcode += "<tr>" ;
            if ( _err_mask_whole & 4 || _err_mask_whole & 32 )
            {
              HTMLcode += "<td STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">Some circles need to be re-computed</td>" ;
              HTMLcode += "<td WIDTH=\"10\"></td>" ;
              HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:if ( confirm( _QUESTION_20_03 ) ) { circles_lib_items_init_group_from_maps( YES, NO );circles_lib_canvas_render_zplane(_glob_zplane_rendering_canvas_placeholder,zplane_sm,null,YES,YES,YES,NO,YES);CIRCLESformsHELPITEMSmain(CIRCLESformsHELPITEMSbaseid);}\">Create circles</td>" ;
            }
            HTMLcode += "</tr>" ;
            HTMLcode += "</table>" ;
            HTMLcode += "</td>" ;
            HTMLcode += "</tr>" ;
        }
    }
    else
    {
        var _symbol = _are_seeds_switched ? _ERR_33_01 : _ERR_33_02 ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"color:red;font-size:14pt;\">"+_symbol+"</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    }
          
    if ( _are_seeds_switched ) HTMLcode += CIRCLESformsHELPGENERATORSbarHTMLCODE( _err_mask_whole );

    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    
    
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, _caption, CLOSE_FN );
    if ( _move && _div != null ) move_div( _div.id, "CENTER", "TOP" );
}

function CIRCLESformsHELPGENERATORSbarHTMLCODE( _err_mask_whole )
{
    var HTMLcode  = "<tr><td HEIGHT=\"20\"></td></tr><tr>" ;
        HTMLcode += "<td COLSPAN=\"3\" VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>";
        HTMLcode += "<td WIDTH=\"5\"></td>";
        HTMLcode += "<td WIDTH=\"50\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','edit.disk',NO,ITEM_TYPE_CIRCLE);\">Add circle</td>";
        HTMLcode += "<td WIDTH=\"1\"></td>";
        HTMLcode += "<td WIDTH=\"50\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','edit.disk',NO,ITEM_TYPE_MOBIUS);\">Add map</td>";
    if ( _err_mask_whole & 8 || _err_mask_whole & 16 )
    {
        HTMLcode += "<td WIDTH=\"1\"></td>";
        HTMLcode += "<td ID=\"HELPinitBTN\" CLASS=\"link_rounded\" "+( _glob_method == METHOD_NONE ? "DISABLED" : "" )+" ONCLICK=\"javascript:circles_lib_items_init_wrapper_fn(null,_glob_init_mask,YES,NO);CIRCLESformsHELPITEMSmain(CIRCLESformsHELPITEMSbaseid);\">Init</td>" ;
    }
    else HTMLcode += "<td COLSPAN=\"4\"></td>" ;

    HTMLcode += "<td WIDTH=\"1\"></td>";
    HTMLcode += "<td CLASS=\"link_rounded\" "+( _glob_method == METHOD_NONE ? "DISABLED" : "" )+" ONCLICK=\"javascript:circles_lib_plugin_load('forms','seeds.list');\">List</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
          
    return HTMLcode ;
}

function CIRCLESformsHELPGENERATORSdisplayERROR( _err_mask, _sep )
{
    if ( !is_string( _sep ) ) _sep = "\n" ;
    var _title = "" ;
    if ( _err_mask > 0 ) _title = "Some error have been found for this Mobius object.\n" ;
     
    if ( _err_mask & 1 )  _title += _sep + "* Missing symbol" ;
    if ( _err_mask & 2 )  _title += _sep + "* Missing inverse symbol" ;
    if ( _err_mask & 4 )  _title += _sep + "* Complex circle object is null" ;
    if ( _err_mask & 8 )  _title += _sep + "* Complex circle is a point" ;
    if ( _err_mask & 16 ) _title += _sep + "* Mobius map is null" ;
    if ( _err_mask & 32 ) _title += _sep + "* Generator circle is a point" ;
    if ( _err_mask & 64 ) _title += _sep + "* Generator is null" ;
     
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _title, _glob_app_title );
}