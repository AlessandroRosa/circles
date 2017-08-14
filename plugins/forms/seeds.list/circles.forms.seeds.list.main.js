function CIRCLESformsSEEDSLISTclose() { return circles_lib_plugin_dispatcher_unicast_message( "seeds.list", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsSEEDSLISTtoggleGENSlist()
{
		$('#CIRCLESformsSEEDSLISTdivLIST').toggle( 'slow', function()
			 {
			  	var _closed = $('#CIRCLESformsSEEDSLISTdivLIST').css('display') == 'none' ;
					$('#LISTshowBTN').html( _closed ? 'Show' : 'Hide' ) ;
					$( "#"+CIRCLESformsSEEDSLISTdiv_id ).width( _closed ? 420 : 650 ) ;
			 } );
}

function CIRCLESformsSEEDSLISTmain( _base_id, _move, _selected_index, _items_switch )
{
    _move = safe_int( _move, YES );
    _selected_index = ( is_string( _selected_index ) ) ? circles_lib_find_item_index_by_symbol( null, _selected_index ) : safe_int( _selected_index, 0 ) ;
    var _chunk = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _chunk['count'], _items_array = _chunk['array'], _caption = _chunk['label'], _items_switch = _chunk['switch'] ;
    CIRCLESformsSEEDSLISTbaseid = safe_string( _base_id, "" ) ;
    _selected_index = safe_int( _selected_index, UNDET );
    if ( _selected_index != UNDET ) _glob_disk_sel_index = _selected_index ;
    var _subset = "forms" ;
    var _div_id = CIRCLESformsSEEDSLISTdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    var CLOSE_FN = "CIRCLESformsSEEDSLISTclose();" ;
    if ( _items_n > 0 )
    {
         /* LIST STRUCTURE
            COLS ROLE   HEADER
            1    blank 
            1    header Fill Color
            (3)
            1    header Label
            1    blank
            1    header Inverse
            (3)
            5    header Actions
            (3)
            7    header Remove
            (3)
            1    header Select
            1    blank  
            1    header Type
            1    blank  
            1    header Sort display
            1    blank  
            1    header Notes
            1    blank  
            1    header Class
         */

         var _check_group = circles_lib_symbol_check_group( _items_array );
         var _items_error = circles_lib_items_check_data_coherence() ;
         var dims = getViewportExtents();
         var WIDTH = 650, HEIGHT = "auto" ;
         var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
             HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsSEEDSLISTcaption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "info/info.icon.01.16x16.png" );
             HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
             HTMLcode += "<tr>" ;
             HTMLcode += "<td STYLE=\"padding-left:5px;\">"+( "Found <b>"+_items_n+"</b> "+( _items_n == 1 ? "entry" : "entries" ) )+"</td>" ;
             HTMLcode += "</tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
             HTMLcode += "<tr>" ;
             HTMLcode += "<td VALIGN=\"top\">" ;
             HTMLcode += "<DIV ID=\"CIRCLESformsSEEDSLISTdivLIST\" STYLE=\"position:relative;width:auto;height:"+( Math.min( 220, _items_n * 24 + 46 ) )+"px;overflow:auto;\">" ;
             HTMLcode += "<table>" ;
         
         var _rowspan = (_items_n+1)*2 ;

             HTMLcode += "<tr>" ;
             HTMLcode += "<td WIDTH=\"1\"></td>" ;
             HTMLcode += "<td WIDTH=\"45\" ALIGN=\"center\">Fill color</td>" ;
             HTMLcode += "<td WIDTH=\"8\" ROWSPAN=\""+_rowspan+"\"></td>" ;
             HTMLcode += "<td WIDTH=\"1\" ROWSPAN=\""+_rowspan+"\" STYLE=\"background-color:#E4E4E4;\"></td>" ;
             HTMLcode += "<td WIDTH=\"8\" ROWSPAN=\""+_rowspan+"\"></td>" ;
             HTMLcode += "<td>Symbol</td>" ;
             if ( _glob_method != METHOD_INVERSION )
             {
                 HTMLcode += "<td WIDTH=\"1\"></td>" ;
                 HTMLcode += "<td>Inverse</td>" ;
             }
             HTMLcode += "<td WIDTH=\"8\" ROWSPAN=\""+_rowspan+"\"></td>" ;
             HTMLcode += "<td WIDTH=\"1\" ROWSPAN=\""+_rowspan+"\" STYLE=\"background-color:#E4E4E4;\"></td>" ;
             HTMLcode += "<td WIDTH=\"8\" ROWSPAN=\""+_rowspan+"\"></td>" ;

             HTMLcode += "<td COLSPAN=\"5\" ALIGN=\"center\" STYLE=\"background-color:#EAEAF4;\" CLASS=\"general_rounded_corners\">Actions</td>" ;
             HTMLcode += "<td WIDTH=\"5\" ROWSPAN=\""+_rowspan+"\"></td>" ;
             HTMLcode += "<td WIDTH=\"1\" ROWSPAN=\""+_rowspan+"\" STYLE=\"background-color:#E4E4E4;\"></td>" ;
             HTMLcode += "<td WIDTH=\"5\" ROWSPAN=\""+_rowspan+"\"></td>" ;
             
             HTMLcode += "<td COLSPAN=\""+( _glob_method != METHOD_INVERSION ? 5 : 4 )+"\" STYLE=\"background-color:#EAEAF4;\" CLASS=\"general_rounded_corners\" ALIGN=\"center\">Remove</td>" ;
             
             HTMLcode += "<td WIDTH=\"5\" ROWSPAN=\""+_rowspan+"\"></td>" ;
             HTMLcode += "<td WIDTH=\"1\" ROWSPAN=\""+_rowspan+"\" STYLE=\"background-color:#E4E4E4;\"></td>" ;
             HTMLcode += "<td WIDTH=\"5\" ROWSPAN=\""+_rowspan+"\"></td>" ;

             HTMLcode += "<td ALIGN=\"center\">Select</td>" ;
             HTMLcode += "<td WIDTH=\"1\"></td>" ;
             HTMLcode += "<td ALIGN=\"center\">Type</td>" ;
             HTMLcode += "<td WIDTH=\"1\"></td>" ;
             HTMLcode += "<td ALIGN=\"center\">Sort display</td>" ;
             HTMLcode += "<td WIDTH=\"1\"></td>" ;
             HTMLcode += "<td ALIGN=\"center\">Class</td>" ;
             HTMLcode += "<td WIDTH=\"1\"></td>" ;
             HTMLcode += "<td ALIGN=\"center\" WIDTH=\"50\" STYLE=\"background-color:#EAEAF4;\" CLASS=\"general_rounded_corners\">Notes</td>" ;

             HTMLcode += "</tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
             var BTNstyle, ITEM, _notes, _symbol, _inv_symbol, item_type ;
             var _mobius_map, _mobius_map_class, complex_circle, color, complex_center_pt, complex_radius ;
             var symbolFONTcolor, inversesymbolFONTcolor, bIN, bOUT ;
             for( var i = 0 ; i < _items_n ; i++ )
             {
                  BTNstyle = _selected_index == i ? "font-weight:bold;" : "" ;
                  ITEM = _items_array[i] ;
                  _notes = safe_string( ITEM.notes, "" ), _symbol = safe_string( ITEM.symbol, "" );
                  _inv_symbol = safe_string( ITEM.inverse_symbol, "" );
                  item_type = safe_int( ITEM.item_type, UNDET );
                  switch( item_type )
                  {
                      case ITEM_TYPE_CIRCLE: item_type = "Circle" ; break ;
                      case ITEM_TYPE_MOBIUS: item_type = "Map" ; break ;
                      default: item_type = "Unknown" ; break ;
                  }
                              
                  _mobius_map = ITEM.map ;
                  _mobius_map_class = is_mobius_map( _mobius_map ) ? _mobius_map.classification(NO) : UNDEF ;
                  complex_circle = is_item_obj( ITEM ) ? ITEM.complex_circle : null ;
                  color = is_circle( complex_circle ) ? complex_circle.fillcolor : 0 ;
                  complex_center_pt = is_circle( complex_circle ) ? complex_circle.center : new point( 0, 0 );
                  complex_radius = is_circle( complex_circle ) ? complex_circle.radius : 0 ;
                  symbolFONTcolor = ( _symbol != null ? ( _symbol.length == 0 ? DEFAULT_COLOR_ERROR : _glob_draw_seed_color ) : _glob_draw_seed_color );
                  inversesymbolFONTcolor = ( _inv_symbol != null ? ( _inv_symbol.length == 0 ? DEFAULT_COLOR_ERROR : _glob_draw_seed_color ) : _glob_draw_seed_color );

                  if ( _symbol.length == 0 ) _symbol = "<SPAN STYLE=\"color:"+symbolFONTcolor+";\">Missing</SPAN>" ;
                  if ( _inv_symbol.length == 0 ) _inv_symbol = "<SPAN STYLE=\"color:"+inversesymbolFONTcolor+";\">Missing</SPAN>" ;
                          
                  bIN = i == _glob_disk_sel_index ? "<b>" : "" ;
                  bOUT = i == _glob_disk_sel_index ? "</b>" : "" ;

                  HTMLcode += "<tr>" ;
                  HTMLcode += "<td WIDTH=\"1\"></td>" ;
                  HTMLcode += "<td ALIGN=\"center\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:"+color+";\">"+( color.length == 0 ? "<SPAN STYLE=\"color:#A0A0A0;\">none</SPAN>" : "" )+"</td>" ;
                  HTMLcode += "<td ALIGN=\"center\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F4F4F4;color:"+symbolFONTcolor+"\">"+bIN+_symbol+bOUT+"</td>" ;
                  if ( _glob_method != METHOD_INVERSION )
                  {
                       HTMLcode += "<td WIDTH=\"1\"></td>" ;
                       HTMLcode += "<td ALIGN=\"center\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#E1E1F0;color:"+symbolFONTcolor+"\">"+bIN+_inv_symbol+bOUT+"</td>" ;
                  }

                  // ACTIONS
                  _glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

                  HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_zplane_selected_items_array.flush();_glob_zplane_selected_items_array.push("+i+");_glob_disk_sel_index="+i+";circles_lib_canvas_render_zplane(_glob_zplane_rendering_canvas_placeholder,zplane_sm,null,YES,YES,YES,NO,YES);circles_lib_plugin_load('forms','edit.disk',NO,"+i+",ITEMS_SWITCH_SEEDS);\">Edit</td>" ;
                  HTMLcode += "<td WIDTH=\"1\"></td>" ;
                  HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:event.stopPropagation();_glob_zplane_selected_items_array.flush();_glob_zplane_selected_items_array.push("+i+");_glob_disk_sel_index="+i+";circles_lib_canvas_render_zplane(null,zplane_sm,null,YES,YES,YES,NO,YES);\">Select</td>" ;
                  HTMLcode += "<td WIDTH=\"1\"></td>" ;

                  HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_coordinates_zoom_in_disk(YES,"+i+");\">Zoom</td>" ;

                  // REMOVE
                  HTMLcode += "<td "+( ITEM.symbol.length > 0 ? "CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_zplane_selected_items_array.flush();_glob_zplane_selected_items_array.push("+i+");_glob_disk_sel_index="+i+";circles_lib_symbol_remove(null,a,1,NO,NO);\"" : "CLASS=\"linkdead\"" )+">Symbol</td>" ;
                  if ( _glob_method != METHOD_INVERSION )
                  {
                      HTMLcode += "<td WIDTH=\"1\"></td>" ;
                      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_zplane_selected_items_array.flush();_glob_zplane_selected_items_array.push("+i+");_glob_disk_sel_index="+i+";circles_lib_symbol_remove(null,a,1,YES,NO);\">Inverse</td>" ;
                  }
                  HTMLcode += "<td WIDTH=\"1\"></td>" ;
                  HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_disk_sel_index="+i+";circles_lib_complexdisk_remove('"+_items_switch+"',YES,NO,YES,YES,NO,);\">circle</td>" ;

                  HTMLcode += "<td ALIGN=\"center\"><INPUT TYPE=\"checkbox\" ID=\"CIRCLESLISTinvertSYMBOLcheckbox."+i+"\"></td>" ;
                  HTMLcode += "<td WIDTH=\"1\"></td>" ;
                  HTMLcode += "<td>"+item_type+"</td>" ;
                  if ( _items_n > 1 )
                  {
                       var BTNlabel = i != 0 ? "Down" : "Up" ;
                       var BTNonclick = i == 0 ? "CIRCLESformsSEEDSLISTswapSEEDitem( "+i+", "+(i+1)+" )" : "CIRCLESformsSEEDSLISTswapSEEDitem( "+(i-1)+", "+(i)+" )" ; 
                       HTMLcode += "<td WIDTH=\"1\"></td>" ;
                       HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:"+BTNonclick+";circles_lib_canvas_render_zplane(Z_PLANE,zplane_sm,null,YES,YES,YES,NO,YES);CIRCLESformsSEEDSLISTmain(CIRCLESformsSEEDSLISTbaseid);\">"+BTNlabel+"</td>";
                  }
                  else HTMLcode += "<td COLSPAN=\"2\"></td>" ;

                  HTMLcode += "<td WIDTH=\"1\"></td>" ;
                  HTMLcode += "<td VALIGN=\"top\" WIDTH=\"60\" ALIGN=\"center\" STYLE=\"color:#2BB95B;\">"+_mobius_map_class+"</td>" ;
                  HTMLcode += "<td WIDTH=\"1\"></td>" ;
                  if ( safe_size( _notes, 0 ) >= 0 )
                  HTMLcode += "<td VALIGN=\"top\" STYLE=\"color:#2B6E9D;\" ALIGN=\"center\" CLASS=\"link\" ONCLICK=\"javascript:circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, '"+_notes+"', _glob_app );\"><IMG TITLE=\"Read notes\" SRC=\"%imgpath%icons/doc/doc.01.16x16.png\"></td>" ;
                  else
                  HTMLcode += "<td></td>" ;
                  HTMLcode += "</tr>" ;
                  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
             }

             HTMLcode += "</table>" ;
             HTMLcode += "</DIV>" ;
             HTMLcode += "</td>" ;
             HTMLcode += "</tr>" ;

             HTMLcode += CIRCLESformsSEEDSLISTbarHTMLCODE( _selected_index, i );

             HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
             HTMLcode += "</table>" ;

             // highlight the selected object on the screen as its data
             // are displayed in this pop-up window
             if ( _selected_index != UNDET )
             {
                 _glob_zplane_selected_items_array.flush();
                 _glob_zplane_selected_items_array.push( _selected_index );
                 _glob_disk_sel_index = _selected_index ;
                 var _ret_chunk = circles_lib_canvas_render_zplane( null,zplane_sm,null,YES,YES,YES,NO,YES);
				         var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
				         var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "15Unknown error" ;
				         if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
             }
    }
    else
    {
        var WIDTH = 370, HEIGHT = "auto" ;
        var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
            HTMLcode += circles_lib_plugin_caption_code( NO, CIRCLESformsSEEDSLISTcaption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id );
            HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
            HTMLcode += "<tr><td ALIGN=\"center\">"+( "Found <b>"+_items_n+"</b> Entr"+( _items_n == 1 ? "y" : "ies" ) )+"</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
            if ( _glob_items_switch == ITEMS_SWITCH_SEEDS )
            {
                HTMLcode += "<tr>" ;
                HTMLcode += "<td COLSPAN=\"3\" VALIGN=\"top\" CLASS=\"popup_buttons_bar\" WIDTH=\"100%\">" ;
                HTMLcode += "<table>" ;
                HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                HTMLcode += "<tr>" ;
                HTMLcode += "<td WIDTH=\"1\"></td>" ;
                HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','edit.disk',NO,ITEM_TYPE_MOBIUS);\">Add map</td>" ;
                HTMLcode += "<td WIDTH=\"1\"></td>" ;
                HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','edit.disk',NO,ITEM_TYPE_CIRCLE);\">Add circle</td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
                HTMLcode += "</table>" ;
                HTMLcode += "</td>" ;
                HTMLcode += "</tr>" ;
            }
            HTMLcode += "</table>" ;
    }

    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsSEEDSLISTcaption, CLOSE_FN );
    if ( _move && _div != null ) move_div( _div.id, "CENTER", "TOP" );
}