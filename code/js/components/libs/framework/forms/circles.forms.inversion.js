function circles_lib_forms_play_inversion( _b_enable, _silent )
{
   _silent = safe_int( _silent, NO );
   _glob_play_inversion = safe_int( _b_enable, _glob_play_inversion );
   _glob_play_inversion = safe_int( _glob_play_inversion, NO );
   if ( $("#PLAYINVERSIONbtn").get(0) != null ) $("#PLAYINVERSIONbtn").val( _glob_play_inversion ? "Playing inversion" : "Play inversion" );
   else _glob_play_inversion = NO ;
   if ( _glob_play_inversion )
   {
      var DIV = document.createElement( "DIV" );
      if ( DIV != null )
      {
         var HTMLcode = "<table>" ;
         HTMLcode += "<tr STYLE=\"background-color:#6C94C6;\">" ;
         HTMLcode += "<td STYLE=\"padding:4px;color:white;font-size:10pt;\">"+_CAPTION_02+"</td>" ;
         HTMLcode += "<td WIDTH=\"20\"></td>" ;
         HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" ONCLICK=\"javascript:circles_lib_forms_play_inversion(NO,YES);\"><IMG TITLE=\"Quit to play inversion\" SRC=\"%imgpath%icons/close/close.icon.01.20x20.png\"></td>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td STYLE=\"padding:4px;color:#454545;\">Move the mouse pointer in blue and see the resulting orange point by circle inversion</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
              
         DIV.style.backgroundColor = "#ABC7EC" ;
         DIV.style.border = "1px solid #F4F4F4" ;
         DIV.style.left = "2px" ;
         DIV.style.top = ( getViewportExtents()[1] - 70 ) + "px" ;
         DIV.style.width = "270px" ;
         DIV.style.height = "60px" ;
         DIV.style.position = "absolute" ;
         DIV.id = "HELPERdiv" ;
         DIV.style.display = "block" ;
         DIV.style.zIndex = 2 ;
				 DIV.setAttribute( "class", "popup_wnd" );
         DIV.innerHTML = HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
         document.body.appendChild(DIV);
      }
   }
   else
   {
      var _helper_div = $( "#HELPERdiv" ).get(0);
      if ( _helper_div != null ) document.body.removeChild( _helper_div );
      var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, YES, _silent, YES, OUTPUT_SCREEN );
      var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
      var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
      if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
   }
}