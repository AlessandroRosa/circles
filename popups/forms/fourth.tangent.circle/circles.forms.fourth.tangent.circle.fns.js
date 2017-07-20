function CIRCLESformsFOURTHTANGENTCIRCLEcleanCANVAS( _question, _silent, _out_channel )
{
   _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
   _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
   var _b_go = !_question ? YES : confirm( "Confirm to clean all selections ?" );
   if ( _b_go )
   {
      var CIRCLEScombo01 = $("#CIRCLEScombo01").prop( "selectedIndex", 0 );
      var CIRCLEScombo02 = $("#CIRCLEScombo02").prop( "selectedIndex", 0 );
      var CIRCLEScombo03 = $("#CIRCLEScombo03").prop( "selectedIndex", 0 );
      var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, _question, _silent, _out_channel );
      var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
      var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] + "" : "" ;
      return _ret_id ? [ 1, "Canvas has been cleaned with success" ] : _ret_chunk ;
   }
   else return [ RET_ERROR, "Operation halted by user" ] ;
}

function CIRCLESformsFOURTHTANGENTCIRCLEgatherSELECTIONS()
{
   var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
   var _dest_ref = _glob_items_switch == ITEMS_SWITCH_SEEDS ? "seeds" : "gens" ;
   var _category_ref = _glob_items_switch == ITEMS_SWITCH_SEEDS ? "seed" : "gen" ;
   var _items_n = circles_lib_count_items( _items_array );

   var SEL1 = safe_int( $("#CIRCLEScombo01").val(), 0 );
   var SEL2 = safe_int( $("#CIRCLEScombo02").val(), 0 );
   var SEL3 = safe_int( $("#CIRCLEScombo03").val(), 0 );

   _glob_zplane_selected_items_array.flush();
   circles_lib_helper_div_remove();

   if ( $("#CIRCLEScombo01 option:selected").index() > 0 ) _glob_zplane_selected_items_array.push( SEL1 );
   if ( $("#CIRCLEScombo02 option:selected").index() > 0 ) _glob_zplane_selected_items_array.push( SEL2 );
   if ( $("#CIRCLEScombo03 option:selected").index() > 0 ) _glob_zplane_selected_items_array.push( SEL3 );
   if ( _glob_zplane_selected_items_array.length > 0 )
   var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, OUTPUT_SCREEN );
	 var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
	 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "10Unknown error" ;
	 if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
	 else if ( SEL1 != SEL2 && SEL1 != SEL3 && SEL2 != SEL3 )
   {
      $("#CIRCLEfourthTANGENTcontents").html( "" );
      if ( _glob_zplane_selected_items_array.length == 3 && is_array( _glob_zplane_selected_items_array ) )
      {
         var accuracy = safe_int( $("#ACCURACYpowerEDIT").val(), DEFAULT_MAX_ACCURACY );
         $("#ACCURACYpowerEDIT").val( accuracy );

         var C1 = _items_array[SEL1].complex_circle ;
         var C2 = _items_array[SEL2].complex_circle ;
         var C3 = _items_array[SEL3].complex_circle ;
                         
         var conf = $("#CIRCLEconfCOMBO").val();
         var C4array = find_fourth_tangent_circle( C1, C2, C3, conf, accuracy );
         var n = safe_size( C4array, 0 );
         if ( n > 0 )
         {
            var HTMLcode = "<table>" ;
            HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td WIDTH=\"5\"></td>" ;
            HTMLcode += "<td COLSPAN=\"7\">This is the set of candidates to be the fourth tangent circle ("+_dest_ref+")</td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;

            var C4, X, Y, RADIUS, DISABLED ;
            for( var i = 0 ; i < n ; i++ )
            {
                C4 = C4array[i] ;
                X = round_to_decimals( C4.center.x, _glob_accuracy );
                Y = round_to_decimals( C4.center.y, _glob_accuracy );
                RADIUS = round_to_decimals( C4.radius, _glob_accuracy );
                DISABLED = ( isNaN( X ) || isNaN( Y ) || isNaN( RADIUS ) ) ? "DISABLED" : "" ;
                HTMLcode += "<tr>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "<td VALIGN=\"top\">"+(i+1)+"</td>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "<td VALIGN=\"top\">" ;
                HTMLcode += "<table>" ;
                HTMLcode += "<tr>" ;
                HTMLcode += "<td>Center (x)</td><td WIDTH=\"10\"></td><td>"+X+"</td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "<tr>" ;
                HTMLcode += "<td>Center (y)</td><td WIDTH=\"10\"></td><td>"+Y+"</td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "<tr>" ;
                HTMLcode += "<td>Radius</td><td WIDTH=\"10\"></td><td>"+RADIUS+"</td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "</table>" ;
                HTMLcode += "</td>" ;
                HTMLcode += "<td WIDTH=\"15\"></td>" ;
                HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding:6px;background-color:#A0A0A0;\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_screendisk_mark("+X+","+Y+","+RADIUS+");\">Mark circle</td>" ;
                HTMLcode += "<td WIDTH=\"1\"></td>" ;
                HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding:6px;background-color:#A0A0A0;\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_screendisk_add_from_coords("+X+","+Y+","+RADIUS+");circles_lib_popup_load('forms','fourth.tangent.circle');\">Add circle</td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"7\"></td></tr>" ;
            }

            HTMLcode += "</table>" ;
         }
         else
         {
            var HTMLcode = "<table>" ;
            HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
            HTMLcode += "<tr><td>The three selected circles are not mutually tangent</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
            HTMLcode += "</table>" ;
         }

         $("#CIRCLEfourthTANGENTcontents").html( HTMLcode );
      }
      else $("#CIRCLEfourthTANGENTcontents").html( "" );
   }
   else
   {
      var MSG = "Can't find the fourth tangent circle.<br>User must select 3 different elements" ;
      $("#CIRCLEfourthTANGENTcontents").html( MSG );
   }
}