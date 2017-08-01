function CIRCLESformsPALETTEclose() { circles_lib_plugin_dispatcher_unicast_message( "palette", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); return YES ; }

function CIRCLESformsPALETTEmain( _base_id, _move )
{
    CIRCLESformsPALETTEbaseid = safe_string( _base_id, "" ) ;
	  _move = safe_int( _move, YES );
	  var _palette_len = safe_size( _glob_palette_array, 0 );
	  var _palette_start_clr = _palette_len > 0 ? _glob_palette_array[0] : "" ;
	      _glob_palette_start_rgb = _palette_start_clr ;
	  var _palette_end_clr = _palette_len > 0 ? _glob_palette_array[_palette_len-1] : "" ;
	      _glob_palette_end_rgb = _palette_end_clr ;

  var CLOSE_FN = "CIRCLESformsPALETTEclose();", _subset = "forms" ;
	var WIDTH = 300, HEIGHT = "auto" ;
  var _div_id = CIRCLESformsPALETTEdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
  var HTMLcode = "<table WIDTH=\""+WIDTH+"\">";
      HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsPALETTEcaption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "palette/palette.icon.01.16x16.png" );
      HTMLcode += "<tr>" ;
      HTMLcode += "<td VALIGN=\"top\">" ;

      HTMLcode += "<table>" ;
      HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
      HTMLcode += "<tr><td ALIGN=\"center\">Click on the spectrum icons below to choose colors</td></tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
      HTMLcode += "<tr>";
      HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners_top\" STYLE=\"padding:5px;background-color:#F0F0F0;\">" ;

      HTMLcode += "<table>" ;
      HTMLcode += "<tr>";
      HTMLcode += "<td WIDTH=\"5\"></td>";
      HTMLcode += "<td WIDTH=\"75\">Selected color</td>";
      HTMLcode += "<td WIDTH=\"5\"></td>";
      HTMLcode += "<td STYLE=\"height:20px;width:20px;\" CLASS=\"general_rounded_corners\" ID=\"CANVAScolorCELL\">&nbsp;</td>";
      HTMLcode += "<td WIDTH=\"5\"></td>";
      HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
      HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'CANVAScolorCELLICON', 'CANVAScolorCELL' );\"";
      HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"CANVAScolorCELLICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
      HTMLcode += "<td></td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsPALETTEaddCOLOR();\">Add this</td>";
      HTMLcode += "<td WIDTH=\"10\"></td>";
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsPALETTEupdateCOLOR();\">Change this</td>";
      HTMLcode += "</tr>";
      HTMLcode += "</table>" ;

      HTMLcode += "</td>" ;
      HTMLcode += "</tr>";

      HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;

      HTMLcode += "<tr>";
      HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"padding:5px;background-color:#F0F0F0;\">" ;

      HTMLcode += "<table>" ;
      HTMLcode += "<tr>";
      HTMLcode += "<td WIDTH=\"5\"></td>";
      HTMLcode += "<td>Gradient</td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td>Start</td>";
      HTMLcode += "<td WIDTH=\"3\"></td>";
      HTMLcode += "<td STYLE=\"height:20px;width:20px;background-color:"+_glob_palette_start_rgb+";\" CLASS=\"general_rounded_corners\" ID=\"CANVAScolorCELLgradientSTART\"></td>";
      HTMLcode += "<td WIDTH=\"3\"></td>";
      HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:displayCOLORTABLE( 'CANVAScolorCELLgradientSTARTICON', 'CANVAScolorCELLgradientSTART' );\"";
      HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"CANVAScolorCELLgradientSTARTICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#CANVAScolorCELLgradientSTART').css( 'background-color', $('#CANVAScolorCELL').css('background-color') );\"><IMG TITLE=\"Get selected color\" SRC=\"%imgpath%icons/bullets/bullet.down.12x12.png\"></td>" ;
      HTMLcode += "<td WIDTH=\"2\"></td>";
      HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#CANVAScolorCELL').css( 'background-color', $('#CANVAScolorCELLgradientSTART').css('background-color') );\"><IMG TITLE=\"Set selected color\" SRC=\"%imgpath%icons/bullets/bullet.up.12x12.png\"></td>" ;
      HTMLcode += "<td></td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsPALETTEswapCOLORS();\"><IMG TITLE=\"Swap colors\" SRC=\"%imgpath%icons/reload/reload.01.16x16.png\"></td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td>End</td>";
      HTMLcode += "<td WIDTH=\"3\"></td>";
      HTMLcode += "<td STYLE=\"height:20px;width:20px;background-color:"+_glob_palette_end_rgb+";\" CLASS=\"general_rounded_corners\" ID=\"CANVAScolorCELLgradientEND\"></td>";
      HTMLcode += "<td WIDTH=\"3\"></td>";
      HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:displayCOLORTABLE( 'CANVAScolorCELLgradientENDICON', 'CANVAScolorCELLgradientEND' );\"";
      HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"CANVAScolorCELLgradientENDICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#CANVAScolorCELLgradientEND').css( 'background-color', $('#CANVAScolorCELL').css('background-color') );\"><IMG TITLE=\"Get selected color\" SRC=\"%imgpath%icons/bullets/bullet.down.12x12.png\"></td>" ;
      HTMLcode += "<td WIDTH=\"2\"></td>";
      HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#CANVAScolorCELL').css( 'background-color', $('#CANVAScolorCELLgradientEND').css('background-color') );\"><IMG TITLE=\"Set selected color\" SRC=\"%imgpath%icons/bullets/bullet.up.12x12.png\"></td>" ;
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "</tr>";
      HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>";
      HTMLcode += "<tr><td WIDTH=\"5\"></td><td COLSPAN=\"24\" VALIGN=\"top\"><DIV ID=\"CIRCLESpaletteGRADIENTpreview\" STYLE=\"display:none;position:relative;overflow:auto;\"></td></tr>";
      HTMLcode += "</table>" ;

      HTMLcode += "</td>" ;
      HTMLcode += "</tr>";

      HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;

      HTMLcode += "<tr>";
      HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners_top\" STYLE=\"padding:5px;background-color:#EAEAED;\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr>";
      HTMLcode += "<td WIDTH=\"5\"></td>";
      HTMLcode += "<td>Gradient steps</td>";
      HTMLcode += "<td WIDTH=\"3\"></td>";
      HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"CANVAScolorCELLgradientSTEPS\" VALUE=\""+_glob_palette_steps+"\" STYLE=\"width:30px;text-align:center;\" ONKEYDOWN=\"javascript:CIRCLESformsPALETTEeventDISPATCHER( event, this.id );\"></td>";
      HTMLcode += "<td WIDTH=\"3\"></td>";
      HTMLcode += "<td ID=\"CANVASpaletteLABEL_01\"></td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "</tr>";
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>";

      HTMLcode += "<tr><td HEIGHT=\"1\"></td><tr>" ;

      HTMLcode += "<tr>";
      HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"padding:5px;background-color:#EAEAED;\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr>";
      HTMLcode += "<td WIDTH=\"5\"></td>";
      HTMLcode += "<td>Range</td>";
      HTMLcode += "<td WIDTH=\"3\"></td>";
      HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:130px;\" ID=\"CANVAScolorCELLdeleteRANGE\" ONKEYDOWN=\"javascript:CIRCLESformsPALETTEeventDISPATCHER( event, this.id );\"></td>";
      HTMLcode += "<td WIDTH=\"3\"></td>";
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_palette_delete_interval( $( '#CANVAScolorCELLdeleteRANGE' ).val() );\">Delete</td>";
      HTMLcode += "<td WIDTH=\"12\"></td>";
      HTMLcode += "<td>Ex: 2-5,8</td>";
      HTMLcode += "</tr>";
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>";

      HTMLcode += "</table>" ;

      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;
      
      HTMLcode += "<tr><td HEIGHT=\"15\"></td><tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td COLSPAN=\"3\" STYLE=\"padding-left:5px;\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td>Current Palette</td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td ID=\"CIRCLEScolorPALETTEcount\">("+_palette_len+")</td>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"5\"></td><tr>" ;
      HTMLcode += "<tr><td STYLE=\"padding:5px;background-color:#F3F3F3;\" CLASS=\"general_rounded_corners\" COLSPAN=\"3\" VALIGN=\"top\" ID=\"CIRCLEScolorsPALETTEcontainer\">%palettecode%</td></tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"1\"></td><tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>";
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsPALETTEcomputeGRADIENTpre();\">Rebuild</td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsPALETTEshow();\">Refresh</td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_palette_init(YES);CIRCLESformsPALETTEshow();\">Default</td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_palette_destroy();CIRCLESformsPALETTEshow();\">Flush</td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:if ( _glob_palette_array.length > 0 ) { _glob_palette_array.reverse(); CIRCLESformsPALETTEshow(); }\">Reverse</td>";
      HTMLcode += "</tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;
      
      HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;

      HTMLcode += "<tr>" ;
      HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>";
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsPALETTEappend();\">Append gradient</td>";
      HTMLcode += "<td WIDTH=\"5\"></td>";
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsPALETTEpreviewAPPEND(NO,YES);\">Preview gradient</td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td ID=\"PALETTErenderBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_method_set( _glob_method );circles_lib_canvas_process_ask(YES,NO,_glob_bip_use?BIP_BOX:_glob_target_plane,YES,YES,CHECK);\">Render</td>";
      HTMLcode += "</tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;

      HTMLcode += "</table>";
      
      var PALETTEhtmlCODE = CIRCLESformsPALETTEdisplayTABLE( WIDTH );
      HTMLcode = HTMLcode.replaceAll( "%palettecode%", PALETTEhtmlCODE ).replaceAll( "%imgpath%", _glob_path_to_img );

      GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
      if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
      _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

      var _div = circles_lib_plugin_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
      circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div.id, CIRCLESformsPALETTEcaption );
      if ( _move && _div != null ) move_div( _div.id, "LEFT", "TOP" );
}

function CIRCLESformsPALETTEeventDISPATCHER( _event, _ctrl_id )
{
      if ( _ctrl_id.strcmp( "CANVAScolorCELLgradientSTEPS" ) )
      {
           switch( _event.keyCode )
           {
              case 13: // return
              CIRCLESformsPALETTEcomputeGRADIENTpre();
              break ;
			        default: break ;
           }
      }
      else if ( _ctrl_id.strcmp( "CANVAScolorCELLdeleteRANGE" ) )
      {
           switch( _event.keyCode )
           {
              case 13: // return
              var _range_str = $("#CANVAScolorCELLdeleteRANGE").val();
              circles_lib_palette_delete_interval( _range_str );
              break ;
              default: break ;
			     }
      }
}