function CIRCLESformsBIPclose() { return circles_lib_plugin_dispatcher_unicast_message( "bip", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsBIPhelp()
{
    var _msg = "&lsquo;Bip&rsquo; is the acronym of &lsquo;Batch Image Processing&rsquo;" + _glob_crlf.repeat(2) ;
        _msg += "The goal is to draw the Z-plane or the W-plane inside a new area with arbitrary cartesian coordinates and logical extents, larger than screen size, for example into pix being 2000x2000 pixels." + _glob_crlf.repeat(2) ;
        _msg += "The pile of layered contents for the bip box can be managed by" ;
        _msg += " analogue actions in the W-plane layers pile, available <A HREF=\"#\" ONCLICK=\"javascript:alertCLOSE();circles_lib_plugin_load('forms','general.options',YES,3);return false;\">at this link</A>" + _glob_crlf.repeat(2) ;
        _msg += "Any action in the W-plane will be mirrored to the bip box, when renderings are redirected to the latter environment." ;
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, _msg, _glob_app );
}

function CIRCLESformsBIPproperties()
{
   var _canvas_w = safe_int( _glob_bip_canvas.get_width(), 0 );
   var _canvas_bk_color = _glob_bip_canvas ? _glob_bip_canvas.get_backgroundcolor() + "" : "" ;
   if ( _canvas_bk_color.length == 0 || _canvas_bk_color == UNDEF ) _canvas_bk_color = "transparent" ;

   var _center_x = is_point( _glob_bip_box_center_pt ) ? ( ( _glob_bip_use || _glob_bip_box_center_pt.x > 0 ) ? _glob_bip_box_center_pt.x : ( wplane_sm.get_coords_rect().center() )['x'] ) : 0 ;
   var _center_y = is_point( _glob_bip_box_center_pt ) ? ( ( _glob_bip_use || _glob_bip_box_center_pt.y > 0 ) ? _glob_bip_box_center_pt.y : ( wplane_sm.get_coords_rect().center() )['y'] ) : 0 ;
      
   var _x_extent = ( _glob_bip_use || _glob_bip_x_extent > 0 ) ? _glob_bip_x_extent : wplane_sm.get_coords_rect().width();
   var _y_extent = ( _glob_bip_use || _glob_bip_y_extent > 0 ) ? _glob_bip_y_extent : wplane_sm.get_coords_rect().height();

	 return [ _canvas_bk_color, _canvas_w, _center_x, _center_y, _x_extent, _y_extent ] ;
}

function CIRCLESformsBIPmain( _base_id, _move )
{
   CIRCLESformsBIPbaseid = safe_string( _base_id, "" ) ;
   _move = safe_int( _move, YES );
   var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
   var _items_n = circles_lib_count_items( _items_array ) ;
      
   wplane_sm.reload();
   _glob_bipLEFT = _glob_dlocusLEFT, _glob_bipTOP = _glob_dlocusTOP ;
   _glob_bipRIGHT = _glob_dlocusRIGHT, _glob_bipBOTTOM = _glob_dlocusBOTTOM ;
   circles_lib_bip_mapper_init();
      
   var CLOSE_FN = "CIRCLESformsBIPclose();" ;
   var WIDTH = Math.max( Math.min( safe_int( _glob_bip_canvas.get_width(), 0 ), 400 ), 400 ) + 20, HEIGHT = "auto", _subset = "forms" ;
   var _div_id = CIRCLESformsBIPdiv_id = circles_lib_plugin_build_divid( _subset, _base_id ) ;
   var _run = _items_n > 0 ;
   var _properties = CIRCLESformsBIPproperties() ;
	 var _src_canvas_rect = new rect();
	 if ( _glob_bip_original_plane_data == Z_PLANE ) _src_canvas_rect = zplane_sm.get_display_rect();
	 else if ( _glob_bip_original_plane_data == W_PLANE ) _src_canvas_rect = wplane_sm.get_display_rect();
	 else if ( _glob_bip_original_plane_data == D_LOCUS ) _src_canvas_rect = dlocus_sm.get_display_rect();
	 var _src_aspect_ratio = _src_canvas_rect.get_aspect_ratio() ;
	 var _preview_canvas_w = Math.floor( WIDTH * 0.45 ) ;
	 var _preview_canvas_h = _preview_canvas_w / _src_aspect_ratio ;
	 
   var HTMLcode = "<INPUT TYPE=\"HIDDEN\" ID=\"CIRCLESrepetendsCURRENTkey\" VALUE=\"\">" ;
   HTMLcode += "<table WIDTH=\""+WIDTH+"\">" ;
   HTMLcode += circles_lib_plugin_caption_code( _run, CIRCLESformsBIPcaption, 3, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "gearwheel/gearwheel.icon.01.16x16.png", null, "CIRCLESformsBIPhelp()" );
   HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
   HTMLcode += "<tr><td HEIGHT=\"18\" ID=\"CIRCLESformsBIPoutputMSG\" ALIGN=\"center\"></td></tr>" ;
   HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
   HTMLcode += "<tr><td VALIGN=\"top\">" ;

   HTMLcode += "<div ID=\"CIRCLESBIPmainDIV\" STYLE=\"position:relative;width:99%;height:94%;\" VALIGN=\"top\" class=\"tabber\">" ;

   HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:99%;height:94%;\" VALIGN=\"top\" ID=\"CIRCLESBIP_TAB_01\">" ;
   HTMLcode += "<h2>Main properties</h2>" ;
   HTMLcode += "<table><tr><td VALIGN=\"CIRCLESformsBIPtabcontainer1\">" ;
   HTMLcode += CIRCLESbipFORMtabMAINhtml();
   HTMLcode += "</td></tr></table>" ;
   HTMLcode += "</DIV>" ;

   HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:99%;height:94%;\" VALIGN=\"top\" ID=\"CIRCLESBIP_TAB_02\">" ;
   HTMLcode += "<h2>Display and metrics</h2>" ;
   HTMLcode += "<table><tr><td VALIGN=\"CIRCLESformsBIPtabcontainer2\">" ;
   HTMLcode += CIRCLESbipFORMtabPROPERTIEShtml( _properties );
   HTMLcode += "</td></tr></table>" ;
   HTMLcode += "</DIV>" ;

   HTMLcode += "</DIV>" ;
   HTMLcode += "</td></tr>" ;
   HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;

   HTMLcode += "<tr>" ;
   HTMLcode += "<td VALIGN=\"top\" ALIGN=\"center\" WIDTH=\"100%\">" ;
   HTMLcode += "<DIV ALIGN=\"center\" ID=\"copy_bip_canvasDIV\" STYLE=\"position:relative;width:"+(WIDTH-10)+"px;height:auto;display:none;background-color:white;border:1px solid #E7E7E7;\" CLASS=\"general_rounded_corners\">" ;
   HTMLcode += "<table WIDTH=\"100%\">" ;
   HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
   HTMLcode += "<tr>" ;
   HTMLcode += "<td STYLE=\"margin:5px;background-color:#F6F6F6;\" CLASS=\"general_rounded_corners\"><CANVAS ALIGN=\"center\" WIDTH=\""+_preview_canvas_w+"\" HEIGHT=\""+_preview_canvas_h+"\" STYLE=\"background-color:white;width:"+_preview_canvas_w+"px;height:"+_preview_canvas_h+"px;\" CLASS=\"general_rounded_corners\" ID=\"copy_bip_canvas\"></CANVAS></td>" ;
   HTMLcode += "<td WIDTH=\"1\"></td>" ;
   HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding:5px;background-color:#F2F2F2;\" CLASS=\"general_rounded_corners\" ID=\"CIRCLESformsBIPcanvasMETRICS\">"+CIRCLESbipFORMcanvasMETRICShtml(YES)+"</td>" ;
   HTMLcode += "<tr>" ;

   HTMLcode += "<tr><td HEIGHT=\"5\"></td><tr>" ;
   HTMLcode += "</table>" ;
   HTMLcode += "</DIV>" ;
   HTMLcode += "</td></tr>" ;
   HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;

   HTMLcode += "<tr>" ;
   HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
   HTMLcode += "<table>" ;
   HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
   HTMLcode += "<tr>" ;
   HTMLcode += "<td WIDTH=\"6\"></td>" ;
   HTMLcode += "<td ID=\"BIPinitBTN\" "+( _glob_bip_use ? "CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_items_to_init=NO;$('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);CIRCLESformsBIPtrigger(1,YES,NO,YES);circles_lib_items_init(null,NO,YES);\" " : "CLASS=\"linkdead\"" )+">Init</td>" ;
   HTMLcode += "<td WIDTH=\"6\"></td>" ;
   HTMLcode += "<td WIDTH=\"12\" STYLE=\"padding-top:1px;\"><IMG SRC=\"%imgpath%icons/arrows/double/blue/double.arrow.blue.12x12.png\"></td>" ;
   HTMLcode += "<td WIDTH=\"6\"></td>" ;
   HTMLcode += "<td ID=\"BIPrenderBTN\" "+( _glob_bip_use ? "CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsBIPcanvasmirrorSHOW(HIDE);CIRCLESformsBIPtrigger(1,YES,YES,NO);\" " : "CLASS=\"linkdead\"" )+">Render</td>" ;
   HTMLcode += "<td WIDTH=\"6\"></td>" ;
   HTMLcode += "<td WIDTH=\"12\" STYLE=\"padding-top:1px;\"><IMG SRC=\"%imgpath%icons/arrows/double/blue/double.arrow.blue.12x12.png\"></td>" ;
   HTMLcode += "<td WIDTH=\"6\"></td>" ;
   HTMLcode += "<td ID=\"BIPsaveBTN\" "+( _glob_bip_use ? "CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsBIPsavePIX();\" " : "CLASS=\"linkdead\"" )+">Save</td>" ;
   HTMLcode += "<td WIDTH=\"40\"></td>" ;
   HTMLcode += "<td ID=\"BIPpreviewBTN\" "+( _glob_bip_use ? "CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsBIPcanvasmirrorSHOW(SHOW);CIRCLESbipFORMcanvasMETRICShtml(NO);\" " : "CLASS=\"linkdead\"" )+">Preview</td>" ;
   HTMLcode += "<td WIDTH=\"6\"></td>" ;
   HTMLcode += "<td ID=\"BIPrealdimsBTN\" "+( _glob_bip_use ? "CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsBIPcanvasREALDIMS();\" " : "CLASS=\"linkdead\"" )+">Real dims</td>" ;
   HTMLcode += "<td WIDTH=\"6\"></td>" ;
   HTMLcode += "<td ID=\"CIRCLESbipLISTbtn\" "+( _glob_bip_use ? "CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsBIPlistSETTINGS();\" " : "CLASS=\"linkdead\"" )+">Review settings</td>" ;
   HTMLcode += "<td WIDTH=\"5\"></td>" ;
   HTMLcode += "</tr>" ;
   HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
   HTMLcode += "</table>" ;
   HTMLcode += "</td>" ;
   HTMLcode += "</tr>" ;

   HTMLcode += "</table>" ;
   HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
   GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
   if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
   _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
   var _div = circles_lib_plugin_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
   circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsBIPcaption, CLOSE_FN );
   if ( _move && _div != null ) move_div( _div.id, "LEFT", "TOP" );
   CIRCLESformsBIPcoordsMANAGER( _glob_bip_original_plane_coords );
          
   tabberAutomatic( CIRCLESBIPtabberOptions, "CIRCLESBIP" );
   clrtable.setHANDLERonselectcolor( function() { CIRCLESformsBIPcolorBTNS( YES ); } );
}

function CIRCLESbipFORMtabMAINhtml( _show_entries_array, _return_html )
{
	 if ( !is_array( _show_entries_array ) ) _show_entries_array = [] ;
	 $.each( _show_entries_array, function( _i, _str ){ _show_entries_array[_i] = ( _str + "" ).toLowerCase(); } ) ;
	 var _empty_filter = safe_size( _show_entries_array, 0 ) == 0 ? YES : NO ;
	 _return_html = safe_int( _return_html, YES );

   var HTMLcode = "<table>" ;
   if ( _show_entries_array.includes( "activation" ) || _empty_filter )
   {
	   HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
	   HTMLcode += "<tr>" ;
	   HTMLcode += "<td VALIGN=\"top\">" ;
	   HTMLcode += "<table>" ;
	   HTMLcode += "<tr>" ;
	   HTMLcode += "<td WIDTH=\"5\"></td>" ;
	   HTMLcode += "<td>Activate Batch Image Processing</td>" ;
	   HTMLcode += "<td WIDTH=\"5\"></td>" ;
	   HTMLcode += "<td><INPUT TYPE=\"checkbox\" "+( _glob_bip_use ? "CHECKED" : "" )+" ONCLICK=\"javascript:_glob_bip_use=(this.checked)?YES:NO;circles_lib_bip_activate( _glob_bip_use );CIRCLESformsBIPbuttons( _glob_bip_use );CIRCLESformsBIPcolorBTNS( YES );\"></td>" ;
	   HTMLcode += "</tr>" ;
	   HTMLcode += "</table>" ;
	   HTMLcode += "</td>" ;
	   HTMLcode += "</tr>" ;
	 }

   if ( _show_entries_array.includes( "pickdata" ) || _empty_filter )
   {
     HTMLcode += "<tr><td HEIGHT=\"6\"></td><tr>" ;
     HTMLcode += "<tr>" ;
     HTMLcode += "<td VALIGN=\"top\">" ;
     HTMLcode += "<table>" ;
     HTMLcode += "<tr>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
	   HTMLcode += "<td WIDTH=\"120\">Pick up data from</td>" ;
	   HTMLcode += "<td WIDTH=\"5\"></td>" ;
	   HTMLcode += "<td><INPUT TYPE=\"radio\" "+( _glob_bip_original_plane_data == Z_PLANE ? "CHECKED" : "" )+" NAME=\"CIRCLESapplytoRADIO\" ID=\"CIRCLESapplytoRADIO_01\" ONCLICK=\"javascript:_glob_bip_original_plane_data = Z_PLANE;CIRCLESformsBIPcolorBTNS( YES );\"></td>" ;
	   HTMLcode += "<td WIDTH=\"5\"></td>" ;
	   HTMLcode += "<td>Z-plane</td>" ;
	   HTMLcode += "<td WIDTH=\"15\"></td>" ;
	   HTMLcode += "<td><INPUT TYPE=\"radio\" "+( _glob_bip_original_plane_data == W_PLANE ? "CHECKED" : "" )+" NAME=\"CIRCLESapplytoRADIO\" ID=\"CIRCLESapplytoRADIO_02\" ONCLICK=\"javascript:_glob_bip_original_plane_data = W_PLANE;CIRCLESformsBIPcolorBTNS( YES );\"></td>" ;
	   HTMLcode += "<td WIDTH=\"5\"></td>" ;
	   HTMLcode += "<td>W-plane</td>" ;
     HTMLcode += "<td WIDTH=\"15\"></td>" ;
     HTMLcode += "<td><INPUT TYPE=\"radio\" "+( _glob_bip_original_plane_data == D_LOCUS ? "CHECKED" : "" )+" NAME=\"CIRCLESdiagramRADIO\" ID=\"CIRCLESapplytoRADIO_03\" ONCLICK=\"javascript:_glob_bip_original_plane_data = D_LOCUS;CIRCLESformsBIPcolorBTNS( YES );\"></td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td>Discreteness locus</td>" ;
	   HTMLcode += "</tr>" ;
	   HTMLcode += "</table>" ;
	   HTMLcode += "</td>" ;
	   HTMLcode += "</tr>" ;
   }

   if ( _show_entries_array.includes( "pickcoords" ) || _empty_filter )
   {
     HTMLcode += "<tr><td HEIGHT=\"6\"></td><tr>" ;
     HTMLcode += "<tr>" ;
     HTMLcode += "<td VALIGN=\"top\">" ;
     HTMLcode += "<table>" ;
     HTMLcode += "<tr>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td WIDTH=\"120\">Pick up coords from</td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td><INPUT TYPE=\"radio\" "+( _glob_bip_original_plane_coords == Z_PLANE ? "CHECKED" : "" )+" NAME=\"CIRCLESdiagramRADIO\" ID=\"CIRCLESdiagramRADIO_01\" ONCLICK=\"javascript:CIRCLESformsBIPcoordsMANAGER(Z_PLANE);CIRCLESformsBIPcolorBTNS( YES );\"></td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td>Z-plane</td>" ;
     HTMLcode += "<td WIDTH=\"15\"></td>" ;
     HTMLcode += "<td><INPUT TYPE=\"radio\" "+( _glob_bip_original_plane_coords == W_PLANE ? "CHECKED" : "" )+" NAME=\"CIRCLESdiagramRADIO\" ID=\"CIRCLESdiagramRADIO_02\" ONCLICK=\"javascript:CIRCLESformsBIPcoordsMANAGER(W_PLANE);CIRCLESformsBIPcolorBTNS( YES );\"></td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td>W-plane</td>" ;
     HTMLcode += "<td WIDTH=\"15\"></td>" ;
     HTMLcode += "<td><INPUT TYPE=\"radio\" "+( _glob_bip_original_plane_coords == BIP_BOX ? "CHECKED" : "" )+" NAME=\"CIRCLESdiagramRADIO\" ID=\"CIRCLESdiagramRADIO_04\" ONCLICK=\"javascript:$('#CIRCLESBIPmainDIV').get(0).tabber.tabShow(1);CIRCLESformsBIPcoordsMANAGER(BIP_BOX);CIRCLESformsBIPcolorBTNS( YES );\"></td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td>User-defined</td>" ;
     HTMLcode += "</tr>" ;
     HTMLcode += "</table>" ;
     HTMLcode += "</td>" ;
     HTMLcode += "</tr>" ;
   }

   if ( _show_entries_array.includes( "export" ) || _empty_filter )
   {
     HTMLcode += "<tr><td HEIGHT=\"12\"></td><tr>" ;
     HTMLcode += "<tr>" ;
     HTMLcode += "<td VALIGN=\"top\">" ;
     HTMLcode += "<table>" ;
     HTMLcode += "<tr>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td>... and then export the current rendering into this format</td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td><SELECT ID=\"BIPexportCOMBO\" ONCHANGE=\"javascript:_glob_export_format=$('#BIPexportCOMBO').val();$('[id$=exportCOMBO]').val(this.selectedIndex);\">" ;
     HTMLcode += "<OPTION VALUE=\""+EXPORT_NONE+"\" "+( _glob_export_format == EXPORT_NONE ? "SELECTED=\"selected\"" : "" )+">None" ;
     HTMLcode += "<OPTION VALUE=\""+EXPORT_EPS+"\" "+( _glob_export_format == EXPORT_EPS ? "SELECTED=\"selected\"" : "" )+">EPS" ;
     HTMLcode += "<OPTION VALUE=\""+EXPORT_PS+"\" "+( _glob_export_format == EXPORT_PS ? "SELECTED=\"selected\"" : "" )+">PS" ;
     HTMLcode += "<OPTION VALUE=\""+EXPORT_SVG+"\" "+( _glob_export_format == EXPORT_SVG ? "SELECTED=\"selected\"" : "" )+">SVG" ;
     HTMLcode += "<OPTION VALUE=\""+EXPORT_LATEX+"\" "+( _glob_export_format == EXPORT_LATEX ? "SELECTED=\"selected\"" : "" )+">LaTeX" ;
     HTMLcode += "</SELECT></td>" ;
     HTMLcode += "</tr>" ;
     HTMLcode += "</table>" ;
     HTMLcode += "</td>" ;
     HTMLcode += "</tr>" ;
   }
 
   HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
   HTMLcode += "</table>" ;
   if ( _return_html ) return HTMLcode ;
   else $( "#CIRCLESformsBIPtabcontainer1" ).html( HTMLcode );
}

function CIRCLESbipFORMtabPROPERTIEShtml( _properties, _return_html )
{
   _return_html = safe_int( _return_html, YES );
   var _canvas_bk_color = _properties[0] ;
   var WIDTH = _properties[1] ;
   var _center_x = _properties[2] ;
   var _center_y = _properties[3] ;
   var _x_extent = _properties[4] ;
   var _y_extent = _properties[5] ;

   var HTMLcode = "<table>" ;
      HTMLcode += "<tr><td STYLE=\"padding-left:5px;font-size:12pt;\"></td></tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F7F7F7;padding:3px;\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td>Background color</td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>";
      HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:18px;width:30px;text-align:center;background-color:"+_canvas_bk_color+";\" ID=\"canvas_bk_color\">"+( ( _glob_bip_canvas.get_backgroundcolor().length == 0 || _canvas_bk_color == "transparent" ) ? "none" : "" )+"</td>";
      HTMLcode += "<td WIDTH=\"5\"></td>";
      HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
      HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'canvas_bk_colorICON', 'canvas_bk_color' );\"";
      HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\"canvas_bk_colorICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
      HTMLcode += "<td WIDTH=\"15\"></td>";
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:$('#canvas_bk_color').css('background-color','transparent');$('#canvas_bk_color').html('none');\">Set transparent</td>";
      HTMLcode += "</tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;

      HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td VALIGN=\"top\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td>Shorter side</td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td><INPUT ID=\"BIPcanvasSHORTERSIDEpixels\" TYPE=\"edit\" STYLE=\"text-align:center;width:36px;\" VALUE=\""+_glob_bip_shorterside_pixels+"\" ONKEYUP=\"javascript:CIRCLESformsBIPcolorBTNS( YES );\"></td>" ;
      HTMLcode += "<td WIDTH=\"15\"></td>" ;
      HTMLcode += "<td>Pixel size</td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td><INPUT ID=\"BIPcanvasPIXELsize\" TYPE=\"edit\" STYLE=\"text-align:center;width:24px;\" VALUE=\""+_glob_bip_pixel_size+"\" ONKEYUP=\"javascript:CIRCLESformsBIPcolorBTNS( YES );_glob_bip_pixel_size=Math.max(1,safe_int(this.value,1));\"></td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsBIPcalculatePIXELside(YES);\">Recalc</td>" ;
      HTMLcode += "<td WIDTH=\"10\"></td>" ;
      HTMLcode += "<td>Grid ticks</td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td><INPUT ID=\"BIPcanvasTICKS\" ONKEYUP=\"javascript:_glob_bip_ticks=safe_int(this.value,DEFAULT_TICKS); if( _glob_bip_ticks <= 0 ){ _glob_bip_ticks = DEFAULT_TICKS;this.value=_glob_bip_ticks;};CIRCLESformsBIPcolorBTNS( YES );\" TYPE=\"edit\" STYLE=\"width:22px;text-align:center;\" VALUE=\""+_glob_bip_ticks+"\"></td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:$('#BIPcanvasTICKS').val(CIRCLESformsBIPticksGEToptimal());CIRCLESformsBIPcolorBTNS( YES );\">Optimize</td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;

      HTMLcode += "<tr><td HEIGHT=\"12\"></td><tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td VALIGN=\"top\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr><td WIDTH=\"5\"></td><td COLSPAN=\"9\">Cartesian metrics of the region to be displayed in the bip box</td></tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td>Center</td>" ;
      HTMLcode += "<td WIDTH=\"10\"></td>" ;
      HTMLcode += "<td>X</td>" ;
      HTMLcode += "<td WIDTH=\"2\"></td>" ;
      HTMLcode += "<td><INPUT ID=\"BIPcanvasCENTERx\" ONKEYUP=\"javascript:_glob_bip_original_plane_coords=BIP_BOX;$('#CIRCLESdiagramRADIO_04').attr('checked',YES);CIRCLESformsBIPcolorBTNS( YES );\" TYPE=\"edit\" STYLE=\"width:130px;\" VALUE=\""+_center_x+"\"></td>" ;
      HTMLcode += "<td WIDTH=\"20\"></td>" ;
      HTMLcode += "<td>Y</td>" ;
      HTMLcode += "<td WIDTH=\"2\"></td>" ;
      HTMLcode += "<td><INPUT ID=\"BIPcanvasCENTERy\" ONKEYUP=\"javascript:_glob_bip_original_plane_coords=BIP_BOX;$('#CIRCLESdiagramRADIO_04').attr('checked',YES);CIRCLESformsBIPcolorBTNS( YES );\" TYPE=\"edit\" STYLE=\"width:130px;\" VALUE=\""+_center_y+"\"></td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;

      HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td VALIGN=\"top\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td>Width</td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td><INPUT ID=\"BIPcanvasEXTENTx\" ONKEYUP=\"javascript:_glob_bip_original_plane_coords=BIP_BOX;$('#CIRCLESdiagramRADIO_04').attr('checked',YES);CIRCLESformsBIPcolorBTNS( YES );\" TYPE=\"edit\" STYLE=\"width:130px;\" VALUE=\""+_x_extent+"\"></td>" ;
      HTMLcode += "<td WIDTH=\"20\"></td>" ;
      HTMLcode += "<td>Height</td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td><INPUT ID=\"BIPcanvasEXTENTy\" ONKEYUP=\"javascript:_glob_bip_original_plane_coords=BIP_BOX;$('#CIRCLESdiagramRADIO_04').attr('checked',YES);CIRCLESformsBIPcolorBTNS( YES );\" TYPE=\"edit\" STYLE=\"width:130px;\" VALUE=\""+_y_extent+"\"></td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;

      HTMLcode += "<tr><td HEIGHT=\"3\"></td><tr>" ;
      HTMLcode += "</table>" ;

   if ( _return_html ) return HTMLcode ;
   else $( "#CIRCLESformsBIPtabcontainer2" ).html( HTMLcode );
}

function CIRCLESbipFORMcanvasMETRICShtml( _return_html )
{
	var _bip_coords_rect = bipbox_sm.get_coords_rect() ;
	var _bip_canvas = $( "#CIRCLESbipCANVAS" ).get(0) ;
	var _bip_w = _bip_canvas.get_width(), _bip_h = _bip_canvas.get_height();
		
   _return_html = safe_int( _return_html, YES );
   var HTMLcode  = "<table>" ;
   HTMLcode += "<tr><td>Coords rect</td></tr>" ;
   HTMLcode += "<tr><td HEIGHT=\"4\"></td><tr>" ;
   HTMLcode += "<tr><td VALIGN=\"top\">"+_bip_coords_rect.output("html").replaceAll( [ "x1", "y1", "x2", "y2" ], [ "left", "top", "right", "bottom" ] );+"</td></tr>" ;
   HTMLcode += "<tr><td HEIGHT=\"12\"></td><tr>" ;
   HTMLcode += "<tr><td>Bip box extents</td></tr>" ;
   HTMLcode += "<tr><td HEIGHT=\"4\"></td><tr>" ;
   HTMLcode += "<tr><td ID=\"BIPBOX_EXTENT_W\">Width "+_bip_w+"</td></tr>" ;
   HTMLcode += "<tr><td HEIGHT=\"2\"></td><tr>" ;
   HTMLcode += "<tr><td ID=\"BIPBOX_EXTENT_H\">Height "+_bip_h+"</td></tr>" ;
   HTMLcode += "<tr><td HEIGHT=\"16\"></td><tr>" ;
   HTMLcode += "<tr>" ;
   HTMLcode += "<td VALIGN=\"top\">" ;
   HTMLcode += "<table>" ;
   HTMLcode += "<tr>" ;
   HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsBIPcanvasmirrorSHOW(HIDE);\">Hide preview</td>" ;
   HTMLcode += "</tr>" ;
   HTMLcode += "</table>" ;
   HTMLcode += "</td>" ;
   HTMLcode += "</tr>" ;
   HTMLcode += "</table>" ;

   if ( _return_html ) return HTMLcode ;
   else $( "#CIRCLESformsBIPcanvasMETRICS" ).html( HTMLcode );
}