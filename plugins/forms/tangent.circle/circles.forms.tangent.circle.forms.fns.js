function CIRCLESformsTANGENTCIRCLEsetSYMBOLS()
{
    var _ret_chunk = circles_lib_alphabet_autoconfig_all_symbols(NO,YES,NO);
    var _ret_id = safe_int( _ret_chunk[0], RET_ERROR );
    var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
    if ( _ret_id == RET_ERROR ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app_title );
    else circles_lib_plugin_load('forms','construct.tangent.circle');
}

function CIRCLESformsTANGENTCIRCLEprocess( X, Y )
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ) ;
    var C2 = zplane_sm.from_client_to_cartesian( X, Y );
    if ( _glob_disk_sel_index != UNDET )
    {
        var ITEM = _glob_disk_sel_index < _items_n ? _items_array[_glob_disk_sel_index] : null ;
        if ( is_item_obj( ITEM ) )
        {
           var HTMLcode = "<table WIDTH=\"100%\">" ;
           var selected_circle = ITEM.complex_circle ;
           if ( selected_circle.center.is_equal_to( C2 ) ) HTMLcode += "<tr><td STYLE=\"padding:3px;\" ALIGN=\"center\">Circles match: cannot construct the new tangent circle</td></tr>" ;
           else
           {
                  var context = _glob_zplane_rendering_layer_pointer.getContext( _glob_canvas_ctx_2D_mode );
                  var C1 = selected_circle.center ;
                  var d = C1.distance( C2 );
                  var r1 = selected_circle.radius, r2 = 0 ;
                  if ( d < r1 ) r2 = r1 - d ;
                  else if ( d > r1 ) r2 = d - r1 ;
                        
                  var new_circle = r2 > 0 ? new circle( C2, r2 ) : null ;
                  if ( is_circle( new_circle ) )
                  {
                      HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                      HTMLcode += "<tr><td WIDTH=\"5\"></td><td>Candidate circle</td></tr>" ;
                      HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                      HTMLcode += "<tr><td WIDTH=\"5\"></td><td>Center : "+new_circle.center.output()+"</td></tr>" ;
                      HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                      HTMLcode += "<tr><td WIDTH=\"5\"></td><td>Radius : "+new_circle.radius+"</td></tr>" ;
                      HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;

                      circles_lib_draw_point( context, zplane_sm, C2.x, C2.y, YES, _glob_pt_border_color, YES, _glob_pt_interior_color, _glob_pt_border, _glob_pt_radius );
                      var SCREENcircle = circles_lib_screendisk_mark( C2.x, C2.y, r2 ), RADIUS = SCREENcircle['radius'] ;
                      var ITEM2, C, symbol, RETarray, N, INTERSECTsymbol ;
                      for( var i = 0 ; i < _items_n ; i++ )
                      {
                           ITEM2 = _items_array[i] ;
                           C = is_item_obj( ITEM2 ) ? ITEM2.complex_circle : null ;
                           symbol = is_item_obj( ITEM2 ) ? ( ITEM2.symbol.length == 0 ? "< unknown >" : ITEM2.symbol ) : "" ;
                           RETarray = is_circle( C ) ? C.intersection( new_circle, _glob_accuracy, 0 ) : null ;
                           N = is_array( RETarray ) ? RETarray['n'] : 0, INTERSECTsymbol = "" ;
                           switch( N )
                           {
                               case 0: INTERSECTsymbol = "<SPAN STYLE=\"color:"+get_rgb_from_color_tag( "gray" )+";\">No intersection with circle '"+symbol+"'</SPAN>" ; break ;
                               case 1: INTERSECTsymbol = "<SPAN STYLE=\"color:lime;\">Tangent with circle '"+symbol+"'</SPAN>" ; break ;
                               case 2: INTERSECTsymbol = "<SPAN STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">Secant with circle '"+symbol+"'</SPAN>" ; break ;
												       default: break ;
                           }
                                  
                           HTMLcode += "<tr><td WIDTH=\"5\"></td><td>"+INTERSECTsymbol+"</td></tr>" ;
                           HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                      }
                             
                      HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
                      HTMLcode += "<tr>" ;
                      HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"background-color:#484848;padding:5px;\" COLSPAN=\"2\">" ;
                      HTMLcode += "<table>" ;
                      HTMLcode += "<tr><td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_complexdisk_addfrom_screendisk("+X+","+Y+","+RADIUS+");_glob_wnd_pending_status=NO;\">Add it to gens</td></tr>" ;
                      HTMLcode += "</tr>" ;
                      HTMLcode += "</table>" ;
                      HTMLcode += "</td>" ;
                      HTMLcode += "</tr>" ;

                      _glob_wnd_pending_status = YES ;
                  }
           }
                   
           HTMLcode += "</table>" ;
           $("#CIRCLEconstructTANGENTcontainer").html( HTMLcode );
        }
    }
}

function CIRCLESformsTANGENTCIRCLEselection()
{
    var SEL1 = safe_int( $("#CIRCLEScombo01").val(), 0 );
    _glob_zplaneMOUSEprocSWITCH = MOUSE_TANGENTCIRCLE_PROC_ID ;
    _glob_zplane_selected_items_array = [];
    circles_lib_helper_div_remove();
    if ( CIRCLEScombo01.selectedIndex > 0 ) _glob_zplane_selected_items_array.push( SEL1 );
    if ( _glob_zplane_selected_items_array.length > 0 )
    var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, OUTPUT_SCREEN );
    var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
    if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
    _glob_disk_sel_index = SEL1 ;
    circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
    circles_lib_statusbar_update_elements();
}