function CIRCLESformsINTERSECTIONPOINTSresizeTANGENCYask( index1, index2 )
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    index1 = safe_int( index1, UNDET ), index2 = safe_int( index2, UNDET );
    var _item_obj_1 = _items_array[index1], _item_obj_2 = _items_array[index2] ;
    var _symbol_1 = is_item_obj( _item_obj_1 ) ? safe_string( _item_obj_1.symbol, "" ) : "", _symbol_2 = is_item_obj( _item_obj_2 ) ? safe_string( _item_obj_2.symbol, "" ) : "" ;
    if ( _symbol_2.length > 0 && _symbol_2.length > 0 )
    {
       var MSG  = "<table>" ;
           MSG += "<tr><td HEIGHT=\"5\"></td></tr>" ;
           MSG += "<tr><td>This operation corrects radius, so that\ncircle "+_symbol_1+" will be tangent to circle " + _symbol_2 + "</td></tr>" ;
           MSG += "<tr><td HEIGHT=\"15\"></td></tr>" ;
           MSG += "<tr><td>Proceed ?</td></tr>" ;
           MSG += "</table>" ;
    
       alert_plug_label( ALERT_YES, "Yes" );
       alert_plug_label( ALERT_NO, "No" );
       alert_plug_fn( ALERT_YES, "alertCLOSE();circles_lib_complexdisk_resize_tangency( null, "+index1+", "+index2+" );CIRCLESformsINTERSECTIONPOINTSfind();" );
       alert_plug_fn( ALERT_NO, "alertCLOSE();" );
       alert_set_btns_width( "70px" );
       circles_lib_output( OUTPUT_SCREEN, DISPATCH_QUESTION | DISPATCH_YESNO, MSG, _glob_app_title );
    }
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't perform this operation: elements need to be tagged first.", _glob_app_title );
}

function CIRCLESformsINTERSECTIONPOINTSmoveTANGENCYask( index1, index2 )
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    index1 = safe_int( index1, UNDET ), index2 = safe_int( index2, UNDET );
    var _item_obj_1 = _items_array[index1], _item_obj_2 = _items_array[index2] ;
    var _symbol_1 = is_item_obj( _item_obj_1 ) ? safe_string( _item_obj_1.symbol, "" ) : "", _symbol_2 = is_item_obj( _item_obj_2 ) ? safe_string( _item_obj_2.symbol, "" ) : "" ;
    if ( _symbol_2.length > 0 && _symbol_2.length > 0 )
    {
       var MSG  = "<table>" ;
           MSG += "<tr><td HEIGHT=\"5\"></td></tr>" ;
           MSG += "<tr><td>This operation shift the disk, so that\ncircle "+_symbol_1+" will be tangent to circle " + _symbol_2 + "</td></tr>" ;
           MSG += "<tr><td HEIGHT=\"15\"></td></tr>" ;
           MSG += "<tr><td>Proceed ?</td></tr>" ;
           MSG += "</table>" ;

       alert_plug_label( ALERT_YES, "Yes" );
       alert_plug_label( ALERT_NO, "No" );
       alert_plug_fn( ALERT_YES, "alertCLOSE();circles_lib_complexdisk_move_tangency( null, "+index1+", "+index2+" );CIRCLESformsINTERSECTIONPOINTSfind();" );
       alert_plug_fn( ALERT_NO, "alertCLOSE();" );
       alert_set_btns_width( "70px" );
       circles_lib_output( OUTPUT_SCREEN, DISPATCH_QUESTION | DISPATCH_YESNO, MSG, _glob_app_title );
    }
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't perform this operation: elements need to be tagged first.", _glob_app_title );
}

function CIRCLESformsINTERSECTIONPOINTScopyPOINTS( packed_pts )
{
    var _pts_array = packed_pts.split( "@" );
    if ( safe_size( _pts_array, 0 ) % 2 == 0 )
    {
           var _out_pts_array = [];
           if ( _pts_array.length >= 2 ) _out_pts_array.push( new point( safe_float( _pts_array[0], 0 ), safe_float( _pts_array[1], 0 ) ) );
           if ( _pts_array.length == 4 ) _out_pts_array.push( new point( safe_float( _pts_array[2], 0 ), safe_float( _pts_array[3], 0 ) ) );
           var _added = 0, _duplicates = 0 ;
           if ( !is_array( _glob_storage['points'] ) ) _glob_storage['points'] = [] ;

           $.each( _out_pts_array,
                   function( _i, _pt )
                   {
                       var _is_dupl = circles_lib_figures_find_duplicates( FIGURE_CLASS_POINT, Z_PLANE, _pt, _glob_storage['figures'] );
                       if ( !_is_dupl )
                       {
                           var _tmp_chunk = [];
                           _tmp_chunk['class'] = FIGURE_CLASS_POINT ;
                           _tmp_chunk['obj'] = _pt ;
                           _tmp_chunk['plane'] = Z_PLANE ;
                           _tmp_chunk['draw'] = YES ;
                           _tmp_chunk['drawcolor'] = DEFAULT_INTERSECTION_POINT_BORDER_COLOR ;
                           _tmp_chunk['fill'] = YES ;
                           _tmp_chunk['fillcolor'] = DEFAULT_INTERSECTION_POINT_INTERIOR_COLOR ;
                           _tmp_chunk['opacity'] = DEFAULT_MAX_OPACITY ;
                           _tmp_chunk['linewidth'] = 1 ;
                           _tmp_chunk['enabled'] = YES ;
                           _tmp_chunk['myhash'] = "rec" + ( _i + 1 );
                           _tmp_chunk['label'] = "" ;
                           _tmp_chunk['propertiesmask'] = 0 ;
                           _glob_storage['points'].push( _tmp_chunk );
                           _added++ ;
                       }
                       else _duplicates++ ;
                   }
                 );

            var _msg = _added + " intersection point"+(_added==1?"":"s")+" copied with success into storage container" ;
            if ( _duplicates > 0 ) _msg += _glob_crlf.repeat(2) + "Found " + _duplicates + " duplicate" + ( _duplicates == 1 ? "" : "s" );
            circles_lib_output( OUTPUT_SCREEN, _added > 0 ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, _glob_app_title );
    }
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Incomplete copy operation", _glob_app_title );
}

function CIRCLESformsINTERSECTIONPOINTScomboONCHANGE()
{
    var index1 = safe_int( $("#CIRCLEScombo1").val(), UNDET ), index2 = safe_int( $("#CIRCLEScombo2").val(), UNDET );
    _glob_zplane_selected_items_array.flush();
    circles_lib_helper_div_remove();
    if ( index1 != UNDET ) _glob_zplane_selected_items_array.push( index1 );
    if ( index2 != UNDET ) _glob_zplane_selected_items_array.push( index2 );

 	  _glob_screencircles_sel_array.flush();
    var l = safe_size( _glob_zplane_selected_items_array, 0 );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
		for( var _i = 0 ; _i < l ; _i++ ) _glob_screencircles_sel_array.push( _items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle );

    var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, OUTPUT_SCREEN );
    var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "12Unknown error" ;
    if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );

    if ( index1 != UNDET && index2 != UNDET ) CIRCLESformsINTERSECTIONPOINTSfind( YES );
}

function CIRCLESformsINTERSECTIONPOINTSresizeTANGENTdisks()
{
    var _index1 = safe_int( $("#CIRCLEScombo1 option:selected").val(), UNDET ), _index2 = safe_int( $("#CIRCLEScombo2 option:selected").val(), UNDET );
    if ( _index1 != UNDET && _index2 != UNDET && ( _index1 != _index2 ) ) CIRCLESformsINTERSECTIONPOINTSresizeTANGENCYask( _index1, _index2 );
    else if ( _index1 != UNDET && _index2 != UNDET && ( _index1 == _index2 ) )
         circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't perform this operation: a same circle has been chosen.", _glob_app_title );
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Can't perform this operation: choose two circles first.", _glob_app_title );
}

function CIRCLESformsINTERSECTIONPOINTSmoveTANGENTdisks()
{
    var _index1 = safe_int( $("#CIRCLEScombo1 option:selected").val(), UNDET ), _index2 = safe_int( $("#CIRCLEScombo2 option:selected").val(), UNDET );
    if ( _index1 != UNDET && _index2 != UNDET && ( _index1 != _index2 ) ) CIRCLESformsINTERSECTIONPOINTSmoveTANGENCYask( _index1, _index2 );
    else if ( _index1 != UNDET && _index2 != UNDET && ( _index1 == _index2 ) )
         circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't perform this operation: a same circle has been chosen.", _glob_app_title );
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Can't perform this operation: choose two circles first.", _glob_app_title );
}

function CIRCLESformsINTERSECTIONPOINTSfind( _mark_points )
{
    _mark_points = safe_int( _mark_points, NO );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var index1 = safe_int( $("#CIRCLEScombo1").val(), UNDET );
    var index2 = safe_int( $("#CIRCLEScombo2").val(), UNDET );
    var tolerance = Math.pow( 10, -_glob_accuracy );
    if ( index1 == index2 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't perform this operation: the same circle has been selected.", _glob_app_title );
    else if ( index1 != index2 )
    {
         var CIRCLE_01 = is_item_obj( _items_array[index1] ) ? _items_array[index1].complex_circle : null ;
         var CIRCLE_02 = is_item_obj( _items_array[index2] ) ? _items_array[index2].complex_circle : null ;
         if ( is_circle( CIRCLE_01 ) && is_circle( CIRCLE_02 ) && ACCURACYpowerEDIT != null )
         {
              var accuracypower = safe_int( $("#ACCURACYpowerEDIT").val(), 7 );
              ACCURACYpowerEDIT.value = accuracypower ;
          
              var symbol_1 = _items_array[index1].symbol ;
              var symbol_2 = _items_array[index2].symbol ;
              var coeffs_1 = CIRCLE_01.equation( DEFAULT_MAX_ACCURACY );
              var coeffs_2 = CIRCLE_02.equation( DEFAULT_MAX_ACCURACY );
              var RET = CIRCLE_01.intersection( CIRCLE_02, accuracypower, 0 );
              var N = RET['n'], store_pts = [] ;
                   
              var HTMLcode = "<table WIDTH=\"100%\">" ;
                  HTMLcode += "<tr>" ;
                  HTMLcode += "<td VALIGN=\"top\">" ;
                  HTMLcode += "<DIV CLASS=\"general_rounded_corners\" STYLE=\"position:relative;background-color:#454545;color:lime;padding:5px;height:276px;overflow:auto;\">" ;
                  HTMLcode += "<table>" ;
               
              var alpha_1 = safe_float( coeffs_1[0], 0 ), alpha_2 = safe_float( coeffs_2[0], 0 );
              var beta_1 = safe_float( coeffs_1[1], 0 ), beta_2 = safe_float( coeffs_2[1], 0 );
              var gamma_1 = safe_float( coeffs_1[2], 0 ), gamma_2 = safe_float( coeffs_2[2], 0 );
                   
              HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
              HTMLcode += "<tr><td>Disk '"+symbol_1+"'</td></tr>" ;
              HTMLcode += "<tr><td>Center : "+CIRCLE_01.center.output('cartesian')+"</td></tr>" ;
              HTMLcode += "<tr><td>Radius : "+CIRCLE_01.radius+"</td></tr>" ;
              HTMLcode += "<tr><td>Eq: x<sup>2</sup> + y<sup>2</sup> "+( alpha_1 != 0 ? "+"+alpha_1+"x" : "" )+" "+( beta_1 != 0 ? "+"+beta_1+"y" : "" )+" "+( gamma_1 != 0 ? "+"+gamma_1 : "" )+"</td></tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
              HTMLcode += "<tr><td>Disk '"+symbol_2+"'</td></tr>" ;
              HTMLcode += "<tr><td>Center : "+CIRCLE_02.center.output('cartesian')+"</td></tr>" ;
              HTMLcode += "<tr><td>Radius : "+CIRCLE_02.radius+"</td></tr>" ;
              HTMLcode += "<tr><td>Eq: x<sup>2</sup> + y<sup>2</sup> "+( alpha_2 != 0 ? "+"+alpha_2+"x" : "" )+" "+( beta_2 != 0 ? "+"+beta_2+"y" : "" )+" "+( gamma_2 != 0 ? "+"+gamma_2 : "" )+"</td></tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
               
              HTMLcode = HTMLcode.replaceAll( "++", "+" );
              HTMLcode = HTMLcode.replaceAll( "--", "+" );
              HTMLcode = HTMLcode.replaceAll( "+-", "-" );
              HTMLcode = HTMLcode.replaceAll( "-+", "-" );
                   
              if ( index1 == index2 )
              {
                   HTMLcode += "<tr><td>The same circle has been picked up twice</td></tr>" ;
                   HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
              }
              else if ( N == -2 )
              {
                   HTMLcode += "<tr><td>Selected circles match</td></tr>" ;
                   HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
              }
              else if ( N == -1 )
              {
                   HTMLcode += "<tr><td>Selected circles are concentric</td></tr>" ;
                   HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
              }
              else if ( N == 0 ) HTMLcode += "<tr><td STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">No intersection</td></tr>" ;
              else if ( N > 1 )
              {
                   HTMLcode += "<tr><td>Found "+N+" intersection point"+( N == 1 ? "" : "s" )+"</td></tr>" ;
                   HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                   HTMLcode += "<tr><td>Selected circles are <b>"+( N == 1 ? "tangent" : "secant" )+"</b></td></tr>" ;

                   HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
                   var PT1 = RET['pt1'] ;
                   if ( is_point( PT1 ) )
                   {
                       HTMLcode += "<tr><td>X : "+PT1.x+"</td></tr>" ;
                       HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                       HTMLcode += "<tr><td>Y : "+PT1.y+"</td></tr>" ;
                       store_pts.push( PT1.x, PT1.y );
                   }

                   var PT2 = RET['pt2'] ;
                   if ( is_point( PT2 ) )
                   {
                       HTMLcode += "<tr><td>X : "+PT2.x+"</td></tr>" ;
                       HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                       HTMLcode += "<tr><td>Y : "+PT2.y+"</td></tr>" ;

                       HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
                       HTMLcode += "<tr><td>DISTANCE : "+PT1.distance( PT2 )+"</td></tr>" ;
                       HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
                       store_pts.push( PT2.x, PT2.y );
                   }
              }

              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;
              if ( N > 1 )
              {
                  HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
                  HTMLcode += "<tr>" ;
                  HTMLcode += "<td VALIGN=\"top\" ALIGN=\"right\">" ;
                  HTMLcode += "<table>" ;
                  HTMLcode += "<tr>" ;
                  HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"30\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsINTERSECTIONPOINTSfind(YES);\">Find</td>" ;
                  HTMLcode += "<td WIDTH=\"5\"></td>" ;
                  HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"80\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsINTERSECTIONPOINTSmoveTANGENTdisks();\">Move to Tangency</td>" ;
                  HTMLcode += "<td WIDTH=\"5\"></td>" ;
                  HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"80\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsINTERSECTIONPOINTSresizeTANGENTdisks();\">Resize to Tangency</td>" ;
                  HTMLcode += "<td WIDTH=\"5\"></td>" ;
                  HTMLcode += "<td HEIGHT=\"18\" WIDTH=\"30\" ALIGN=\"center\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"cursor:pointer;background-color:#BECDCD;padding:4px;\" ONCLICK=\"javascript:CIRCLESformsINTERSECTIONPOINTScopyPOINTS('"+store_pts.join( "@" )+"');\">Copy</td>" ;
                  HTMLcode += "<td WIDTH=\"5\"></td>" ;
                  HTMLcode += "</tr>" ;
                  HTMLcode += "</table>" ;
                  HTMLcode += "</td>" ;
                  HTMLcode += "</tr>" ;
                  HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
              }

              $("#intersectionpointsRESULTcontainer").html( HTMLcode );
              if ( _mark_points && N > 0 )
              {
                   var context = _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode );
                   if ( N >= 1 )
                   {
                        var pt = RET['pt1'] ;
                        var screen_radius = 3 ;
                        var _screen_circle = circles_lib_get_screendisk_from_complexdisk( zplane_sm, new circle( new point( pt.x, pt.y ), screen_radius ) );
                        context.beginPath();
                        context.lineWidth = 3 ;
                        context.arc( _screen_circle.center.x, _screen_circle.center.y, screen_radius, 0, CIRCLES_TWO_PI );
                        context.strokeStyle = DEFAULT_INTERSECTION_POINT_BORDER_COLOR ;
                        context.stroke();
                        context.fillStyle = DEFAULT_INTERSECTION_POINT_INTERIOR_COLOR ;
                        context.fill();
                        context.closePath();
                   }

                   if ( N == 2 )
                   {
                        var pt = RET['pt2'] ;
                        var screen_radius = 3 ;
                        var _screen_circle = circles_lib_get_screendisk_from_complexdisk( zplane_sm, new circle( new point( pt.x, pt.y ), screen_radius ) );
                        context.beginPath();
                        context.lineWidth = 3 ;
                        context.arc( _screen_circle.center.x, _screen_circle.center.y, screen_radius, 0, CIRCLES_TWO_PI );
                        context.strokeStyle = DEFAULT_INTERSECTION_POINT_BORDER_COLOR ;
                        context.stroke();
                        context.fillStyle = DEFAULT_INTERSECTION_POINT_INTERIOR_COLOR ;
                        context.fill();
                        context.closePath();
                   }
              }
         }
         else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Please, init the generator to complete this operation", _glob_app_title );
    }
}