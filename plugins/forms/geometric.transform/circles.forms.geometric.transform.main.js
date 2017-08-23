function CIRCLESformsGEOMETRICTRANSFORMclose() { return circles_lib_plugin_dispatcher_unicast_message( "geometric.transform", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsGEOMETRICTRANSFORMmain( _base_id, _move )
{
    CIRCLESformsGEOMETRICTRANSFORMbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
	  var _dest_ref = _glob_items_switch == ITEMS_SWITCH_SEEDS ? "seeds" : "gens" ;
	  var _category_ref = _glob_items_switch == ITEMS_SWITCH_SEEDS ? "seed" : "gen" ;
	  var _items_n = circles_lib_count_items( _items_array ), _subset = "forms" ;
    var _run = _items_n > 0 ? YES : NO ;
    var CLOSE_FN = "CIRCLESformsGEOMETRICTRANSFORMclose();" ;
    if ( _items_n > 0 )
    {
         var WIDTH = 350, HEIGHT = "auto" ;
         var _div_id = CIRCLESformsGEOMETRICTRANSFORMdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
         var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
         HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsGEOMETRICTRANSFORMcaption+" - " + _dest_ref, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset );
         HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
         HTMLcode += "<tr><td STYLE=\"padding:6px;background-color:#F0F0F0;\" ALIGN=\"right\" CLASS=\"general_rounded_corners\">"+( "Found <b>"+_items_n+"</b> "+( _items_n == 1 ? "entry" : "entries" ) )+"</td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
         HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:#707070;\">Transforms are applied to seeds only</td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\">" ;
         if ( _items_n > 10 ) HTMLcode += "<DIV STYLE=\"position:relative;width:auto;height:250px;overflow:auto;\">" ;
          
         HTMLcode += "<table>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>Symbol</td>" ;
         HTMLcode += "<td WIDTH=\"15\"></td>" ;
         HTMLcode += "<td COLSPAN=\"3\" ALIGN=\"center\">Actions</td>" ;
         HTMLcode += "<td WIDTH=\"15\"></td>" ;
         HTMLcode += "<td COLSPAN=\"3\" ALIGN=\"center\">Include</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
          
         var ITEM, _symbol, complex_circle, complex_center_pt, complex_radius, bIN, bOUT ;
         for( var i = 0 ; i < _items_n ; i++ )
         {
              ITEM = _items_array[i] ;
              _symbol = is_item_obj( ITEM ) ? ITEM.symbol : "" ;
              complex_circle = is_item_obj( ITEM ) ? ITEM.complex_circle : null ;
              complex_center_pt = is_circle( complex_circle ) ? complex_circle.center : new point( 0, 0 );
              complex_radius = is_circle( complex_circle ) ? complex_circle.radius : 0 ;
               
              if ( _symbol.length == 0 ) _symbol = "<SPAN STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">Missing</SPAN>" ;
               
              bIN = i == _glob_disk_sel_index ? "<b>" : "" ;
              bOUT = i == _glob_disk_sel_index ? "</b>" : "" ;
          
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td>"+bIN+_symbol+bOUT+"</td>" ;
              HTMLcode += "<td WIDTH=\"15\"></td>" ;
              HTMLcode += "<td CLASS=\"link_rounded_smaller\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','edit.disk',NO,"+i+");\">Info</td>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td CLASS=\"link_rounded_smaller\" ONCLICK=\"javascript:CIRCLESformsGEOMETRICTRANSFORMselectDISK( "+i+" );\">View</td>" ;
              HTMLcode += "<td WIDTH=\"15\"></td>" ;
              HTMLcode += "<td><INPUT TYPE=\"checkbox\" ID=\"CIRCLESLISTtransformLABELcheckbox_"+i+"\"></td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
         }
          
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td></td>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td></td>" ;
         HTMLcode += "<td WIDTH=\"2\"></td>" ;
         HTMLcode += "<td>Include all</td>" ;
         HTMLcode += "<td WIDTH=\"2\"></td>" ;
         HTMLcode += "<td><INPUT TYPE=\"checkbox\" ONCLICK=\"javascript:CIRCLESformsGEOMETRICTRANSFORMselectALL( this.checked ? YES : NO );\"></td>" ;
         HTMLcode += "</tr>" ;
          
         HTMLcode += "</table>" ;
         if ( _items_n > 10 ) HTMLcode += "</DIV>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#E6E6E6;padding:2px;\" WIDTH=\"100%\">" ;
         HTMLcode += "<table WIDTH=\"100%\">" ;
         HTMLcode += "<tr><td CLASS=\"general_rounded_corners_top\" ALIGN=\"center\" STYLE=\"background-color:#EFEFEF;padding:5px;\" STYLE=\"padding:3px;\">Apply to selected entries, according to the parameters below</td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
         
         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\">" ;
         HTMLcode += "<table>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"10\"></td>" ;
         HTMLcode += "<td CLASS=\"link_rounded_smaller\" ONCLICK=\"javascript:CIRCLESformsGEOMETRICTRANSFORMshift();\">Shift</td>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>Along the x axis</td>" ;
         HTMLcode += "<td WIDTH=\"2\"></td>" ;
         HTMLcode += "<td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:if(event.keyCode==13)CIRCLESformsGEOMETRICTRANSFORMshift();\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" VALUE=\""+_glob_transform_x_shift+"\" ID=\"TRANSFORMSshiftXedit\" STYLE=\"width:50px;\" ></td>" ;
         HTMLcode += "<td WIDTH=\"15\"></td>" ;
         HTMLcode += "<td>Along the y axis</td>" ;
         HTMLcode += "<td WIDTH=\"2\"></td>" ;
         HTMLcode += "<td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:if(event.keyCode==13)CIRCLESformsGEOMETRICTRANSFORMshift();\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" VALUE=\""+_glob_transform_y_shift+"\" ID=\"TRANSFORMSshiftYedit\" STYLE=\"width:50px;\" ></td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;

         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\">" ;
         HTMLcode += "<table>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"10\"></td>" ;
         HTMLcode += "<td CLASS=\"link_rounded_smaller\" ONCLICK=\"javascript:CIRCLESformsGEOMETRICTRANSFORMrotate();\">Rotate</td>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>by sexagesimal angle</td>" ;
         HTMLcode += "<td WIDTH=\"2\"></td>" ;
         HTMLcode += "<td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:if(event.keyCode==13)CIRCLESformsGEOMETRICTRANSFORMrotate();\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" VALUE=\""+_glob_transform_rotate_angle+"\" ID=\"TRANSFORMSrotateANGLEedit\" STYLE=\"width:50px;\" ></td>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td COLSPAN=\"3\">around the origin</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;

         HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
         HTMLcode += "</table>" ;
    }
    else
    {
         var WIDTH = 370, HEIGHT = "auto" ;
         var _div_id = "POPUPgeometrictransformDIV" ;
         var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
             HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsGEOMETRICTRANSFORMcaption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id );
             HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
             HTMLcode += "<tr><td STYLE=\"color:red;font-size:14pt;\" ALIGN=\"center\">"+_ERR_33_01+"</td></tr>" ;          
             HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
             HTMLcode += "</table>" ;
    }

    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    if ( _move && _div != null )
    {
        _div.style.width = WIDTH + "px" ;
        move_div( _div_id, "RIGHT", "TOP" );
        circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsGEOMETRICTRANSFORMcaption, CLOSE_FN );
    }
}

function CIRCLESformsGEOMETRICTRANSFORMselectDISK( index )
{
    _glob_zplane_selected_items_array.flush();
    _glob_zplane_selected_items_array.push( index );
    _glob_disk_sel_index = index ;
    circles_lib_helper_div_remove();
    return circles_lib_canvas_render_zplane( null, zplane_sm, null,YES,YES,YES,NO,YES,YES,OUTPUT_SCREEN);
}