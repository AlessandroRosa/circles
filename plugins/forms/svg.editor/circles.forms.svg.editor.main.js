function CIRCLESformsSVGEDITORclose() { circles_lib_plugin_dispatcher_unicast_message( "svg.editor", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); return YES ; }

function CIRCLESformsSVGEDITORmain( _base_id, _move )
{
    CIRCLESformsSVGEDITORbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    var _n_lines = _svg_editor_line_end = CIRCLESformsSVGEDITORcountLINES();
    var _run = CIRCLESformsSVGEDITORrun = ( _n_lines > 0 && circles_lib_files_get_export_format() == EXPORT_SVG ) ? YES : NO ;
    var _viewport_dims = getViewportExtents();
    var WIDTH = _run ? Math.floor( _viewport_dims[0] * 0.7 ) : 350, HEIGHT = _run ? _viewport_dims[1] - 70 : "auto" ;
    var _plane_label = circles_lib_plane_get_def( _svg_editor_coords_ref ), _subset = "forms" ;
    var _div_id = CIRCLESformsSVGEDITORdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    var CLOSE_FN = "CIRCLESformsSVGEDITORclose();", _click_fn = "$('#terminal_div').click();" ;
    var HTMLcode = "<table ID=\"wnd_container_"+_div_id+"\" BORDER=\"0\" WIDTH=\"100%\" STYLE=\"background-color:white;\">" ;
    HTMLcode += circles_lib_plugin_caption_code( _run, CIRCLESformsSVGEDITORcaption, 3, YES, CLOSE_FN,
																		 WIDTH, HEIGHT, arguments.callee.name,
																		 _base_id, _div_id, _subset, "cmd.prompt/cmd.prompt.icon.01.16x16.png", _click_fn );

    if ( _run )
    {
    		var _rows = safe_size( _glob_export_code_array, 0 );
    		CIRCLESformsSVGEDITORpagesCOUNT = Math.floor( _rows / CIRCLESformsSVGEDITORrowsPERpage ) ;
    		if ( _rows % CIRCLESformsSVGEDITORrowsPERpage > 0 ) CIRCLESformsSVGEDITORpagesCOUNT++ ;
    
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;

        HTMLcode += "<table VALIGN=\"top\">" ;
        HTMLcode += "<tr>" ;

        HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESformsSVGEDITORbuttonsBAR\">" ;
        HTMLcode += "<table VALIGN=\"top\">" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:30px;\" ONCLICK=\"javascript:CIRCLESformsSVGEDITORcleanCODE();\">Clean</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:30px;\" ONCLICK=\"javascript:CIRCLESformsSVGEDITORupdateSVGcode();\">Update</td>" ;
        HTMLcode += "<td WIDTH=\"12\"></td>" ;
        HTMLcode += "<td>Render</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:30px;\" ONCLICK=\"javascript:CIRCLESformsSVGEDITORrenderPAGE();\">Page</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:30px;\" ONCLICK=\"javascript:CIRCLESformsSVGEDITORrenderSVG();\">SVG</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:30px;\" ONCLICK=\"javascript:CIRCLESformsSVGEDITORcheckSVGcode();\">Check</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:$('#customloader').val('');$('#customloader').trigger('click');\">Load</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:30px;\" ONCLICK=\"javascript:CIRCLESformsSVGEDITORsaveCODE();\">Save</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;

        HTMLcode += "<td WIDTH=\"10\"></td>" ;

        HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESformsSVGEDITORlinesBAR\">" ;
        HTMLcode += "<table VALIGN=\"top\">" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td ID=\"CIRCLESlinesLABELS\">Full code of "+_n_lines +" line"+( _n_lines == 1 ? "" : "s" )+"</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td>Display from</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td ID=\"CIRCLESformsSVGEDITORlineSTART\" STYLE=\"color:#57839F;width:30px;text-align:center;\">"+_svg_editor_line_start+"</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>to</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td ID=\"CIRCLESformsSVGEDITORlineEND\" STYLE=\"color:#57839F;width:30px;text-align:center;\">"+_svg_editor_line_end+"</td>" ;
        
        HTMLcode += "<td WIDTH=\"20\"></td>" ;
        HTMLcode += "<td>Page</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:30px;text-align:center;\" ONKEYUP=\"javascript:CIRCLESformsSVGEDITOReventsHANDLER( event, this.id );\" ID=\"CIRCLESformsSVGEDITORcurrentPAGE\" VALUE=\""+(CIRCLESformsSVGEDITORpagesCOUNTER+1)+"\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>of "+CIRCLESformsSVGEDITORpagesCOUNT+"</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;

        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"3\" HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"3\" VALIGN=\"top\"><TEXTAREA CLASS=\"linenumberstextarea\" ID=\"CIRCLESformsSVGEDITORtextarea\" STYLE=\"width:"+( WIDTH - CIRCLESformsSVGEDITORcanvasSIDE - 20 )+"px;height:"+(HEIGHT-110)+"px;overflow:auto;padding:1px;\"></TEXTAREA></td></tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"3\" HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td COLSPAN=\"3\" VALIGN=\"top\" ALIGN=\"right\">" ;
        HTMLcode += "<table VALIGN=\"top\" ALIGN=\"right\">" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"130\" ID=\"CIRCLESformsSVGEDITORcheckingLABEL\" STYLE=\"color:#2D7BC5;\"></td>" ;

        HTMLcode += "<td></td>" ;
        HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESformsSVGEDITORcodeLABEL\">" ;
        HTMLcode += "<table VALIGN=\"top\" ALIGN=\"right\">" ;
        HTMLcode += "<td WIDTH=\"20\"></td>" ;
        HTMLcode += "<td>The code above applies to</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"radio\" NAME=\"CIRCLESformsSVGEDITORcoordsRADIO\" ID=\"CIRCLESformsSVGEDITORcoordsRADIO_01\" "+( _svg_editor_coords_ref == Z_PLANE ? "CHECKED" : "" )+" ONCLICK=\"javascript:CIRCLESformsSVGEDITORcanvasREF(Z_PLANE);\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>Z-plane</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"radio\" NAME=\"CIRCLESformsSVGEDITORcoordsRADIO\" ID=\"CIRCLESformsSVGEDITORcoordsRADIO_02\" "+( ( _svg_editor_coords_ref == W_PLANE || _svg_editor_coords_ref == NO_PLANE ) ? "CHECKED" : "" )+" ONCLICK=\"javascript:CIRCLESformsSVGEDITORcanvasREF(W_PLANE);\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>W-plane</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"radio\" NAME=\"CIRCLESformsSVGEDITORcoordsRADIO\" ID=\"CIRCLESformsSVGEDITORcoordsRADIO_03\" "+( _svg_editor_coords_ref == BIP_BOX ? "CHECKED" : "" )+" ONCLICK=\"javascript:CIRCLESformsSVGEDITORcanvasREF(BIP_BOX);\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>Bip box</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;

        HTMLcode += "</tr>" ;

        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;

        HTMLcode += "</td>" ;
        HTMLcode += "<td ROWSPAN=\"4\" WIDTH=\"5\"></td>" ;
        HTMLcode += "<td ROWSPAN=\"4\" ID=\"CIRCLESformsSVGEDITORcanvasCONTAINER\" WIDTH=\""+(CIRCLESformsSVGEDITORcanvasSIDE+8)+"\" VALIGN=\"top\">" ;
        HTMLcode += "<table ALIGN=\"right\">" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td STYLE=\"padding:3px;\">Preview</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsSVGEDITORrenderPAGE();\">Render</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td>Mouse</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td WIDTH=\"10\">X</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td WIDTH=\"20\" ALIGN=\"right\" STYLE=\"color:#57839F;\" ID=\"CIRCLESformsSVGEDITORmouseX\"></td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td WIDTH=\"10\">Y</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td WIDTH=\"20\" ALIGN=\"right\" STYLE=\"color:#57839F;\" ID=\"CIRCLESformsSVGEDITORmouseY\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"14\" HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"14\" STYLE=\"border:1px solid #D7D7D7;background-color:white;\"><CANVAS WIDTH=\""+CIRCLESformsSVGEDITORcanvasSIDE+"\" HEIGHT=\""+CIRCLESformsSVGEDITORcanvasSIDE+"\" STYLE=\"width:"+CIRCLESformsSVGEDITORcanvasSIDE+"px;height:"+CIRCLESformsSVGEDITORcanvasSIDE+"px;\" ID=\"CIRCLESsvgCANVAS\" STYLE=\"background-color:transparent;\"></CANVAS></td></tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"14\" HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"14\"><DIV STYLE=\"position:relative;width:100%;height:100%;\" ID=\"CIRCLESformsSVGEDITORaddobjCONTAINER\"></DIV></td></tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "<td ROWSPAN=\"4\" WIDTH=\"5\"></td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "</tr>" ;
    }
    else
    {
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"color:red;font-size:14pt;\" ALIGN=\"center\">No SVG code has been produced yet</td></tr>" ;          
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"color:#C0C0C0;font-size:10pt;\" ALIGN=\"center\">Did you set the export option to SVG ?</td></tr>" ;          
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    }

    HTMLcode += "</table>" ;
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsSVGEDITORcaption, CLOSE_FN );
    if ( _move && _div != null ) move_div( _div_id, "LEFT", "TOP" );

    $('#CIRCLESformsSVGEDITORtextarea').css( "font-size", "8pt" );
    $('#CIRCLESformsSVGEDITORtextarea').bind( "keyup change", function() { CIRCLESformsSVGEDITORupdated( 1 ); } );

    _glob_svg_canvas = $( "#CIRCLESsvgCANVAS" ).get(0);
    if ( is_html_canvas( _glob_svg_canvas ) )
    {
       _glob_svg_canvas.id = "CIRCLESsvgCANVAS" ;
       var _pos_chunk = $( "#" + _glob_svg_canvas.id ).offset();
       _glob_svg_canvas.xpos = _pos_chunk['left'];
       _glob_svg_canvas.ypos = _pos_chunk['top'];
       _glob_svg_canvas.set_type( W_PLANE ) ;
       _glob_svg_canvas.set_label( "svg canvas" ) ;
       _glob_svg_canvas.set_width( CIRCLESformsSVGEDITORcanvasSIDE );
       _glob_svg_canvas.set_height( CIRCLESformsSVGEDITORcanvasSIDE );

       CIRCLESformsSVGEDITORaddobjPANELupdate();
       CIRCLESformsSVGEDITORbind_events( _glob_svg_canvas );
       CIRCLESformsSVGEDITORcanvasREF( _glob_svg_canvas.get_type() );
    }

    if ( $('#CIRCLESformsSVGEDITORtextarea').get( 0 ) != null )
    {
        if ( _glob_export_code_array.length > 0 )
        {
        		CIRCLESformsSVGEDITORdisplayPAGE( 0, YES ) ;
            //CIRCLESformsSVGEDITORcheckSVGcode( YES );
            CIRCLESformsSVGEDITORrenderSVG();
        }
    }

    if ( _run )
    {
      if ( $("#"+_div_id ).resizable('instance') != undefined )
      $("#"+_div_id).resizable('destroy').resizable(
      {
	      start: function( event, ui ) { CIRCLESformsSVGEDITORstartresize( ui.size.width, ui.size.height ) },
	      resize: function( event, ui ) { CIRCLESformsSVGEDITORresize( ui.size.width, ui.size.height ); },
	      stop: function( event, ui ) { CIRCLESformsSVGEDITORstopresize( ui.size.width, ui.size.height ) }
      } );
      else
      {
        $("#"+_div_id).resizable(
        {
		      start: function( event, ui ) { CIRCLESformsSVGEDITORstartresize( ui.size.width, ui.size.height ) },
		      resize: function( event, ui ) { CIRCLESformsSVGEDITORresize( ui.size.width, ui.size.height ); },
		      stop: function( event, ui ) { CIRCLESformsSVGEDITORstopresize( ui.size.width, ui.size.height ) }
        } );
      }
      $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
    }

    $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESformsSVGEDITORload ) } ;
}

function CIRCLESformsSVGEDITORstartresize( _new_width, _new_height ) {  }
function CIRCLESformsSVGEDITORstopresize( _new_width, _new_height ) {}
function CIRCLESformsSVGEDITORresize( _new_width, _new_height )
{
		var _extras_w = 20 ; // blank space
		var _extras_h = 50 ; // caption + blank space
		$( "#CIRCLESformsSVGEDITORcanvasCONTAINER" ).css( "display", _new_width > 790 ? "block" : "none" ) ;
		_extras_w += _new_width > 790 ? CIRCLESformsSVGEDITORcanvasSIDE : 0 ;

		$( "#CIRCLESformsSVGEDITORlinesBAR" ).css( "display", _new_width > 630 ? "block" : "none" ) ;

		$( "#CIRCLESformsSVGEDITORcodeLABEL" ).css( "display", _new_width > 510 ? "block" : "none" ) ;
		_extras_h += _new_width > 510 ? 32 : 0 ;

		$( "#CIRCLESformsSVGEDITORbuttonsBAR" ).css( "display", _new_width > 240 ? "block" : "none" ) ;
		_extras_h += _new_width > 240 ? 32 : 0 ;

		$( "#CIRCLESformsSVGEDITORtextarea" ).width( _new_width - _extras_w ) ;
		$( "#CIRCLESformsSVGEDITORtextarea" ).height( _new_height - _extras_h ) ;
}

function CIRCLESformsSVGEDITORaddobjPANEL( _mode )
{
    var HTMLcode = "<table WIDTH=\"100%\">" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding:4px;background-color:#EBEBEB;\" CLASS=\"general_rounded_corners_top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>Add to SVG code</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<select ID=\"CIRCLESformsSVGEDITORobjMODEcombo\" ONCHANGE=\"javascript:CIRCLESformsSVGEDITORaddobjPANELupdate();\">" ;
        HTMLcode += "<OPTION VALUE=\"0\" "+( _mode == 0 ? "SELECTED=\"selected\"" : "" )+">" ;
        HTMLcode += "<OPTION VALUE=\"1\" "+( _mode == 1 ? "SELECTED=\"selected\"" : "" )+">Line" ;
        HTMLcode += "<OPTION VALUE=\"2\" "+( _mode == 2 ? "SELECTED=\"selected\"" : "" )+">Circle" ;
        HTMLcode += "<OPTION VALUE=\"3\" "+( _mode == 3 ? "SELECTED=\"selected\"" : "" )+">Rect" ;
        HTMLcode += "<OPTION VALUE=\"4\" "+( _mode == 4 ? "SELECTED=\"selected\"" : "" )+">Text" ;
        HTMLcode += "<OPTION VALUE=\"5\" "+( _mode == 5 ? "SELECTED=\"selected\"" : "" )+">Comment" ;
        HTMLcode += "</select>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsSVGEDITORaddobj("+_mode+");\">Draw</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table STYLE=\"padding:4px;background-color:#E6E6E6;\" CLASS=\"general_rounded_corners_bottom\" WIDTH=\"100%\">" ;

        switch( _mode )
        {
              case 1: // LINE
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding:4px;\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td COLSPAN=\"3\">Start (x,y)</td>" ;
              HTMLcode += "<td WIDTH=\"15\"></td>" ;
              HTMLcode += "<td COLSPAN=\"3\">End (x,y)</td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:30px;\" ID=\"LINEstartX\"></td>" ;
              HTMLcode += "<td WIDTH=\"1\"></td>" ;
              HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:30px;\" ID=\"LINEstartY\"></td>" ;
              HTMLcode += "<td WIDTH=\"15\"></td>" ;
              HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:30px;\" ID=\"LINEendX\"></td>" ;
              HTMLcode += "<td WIDTH=\"1\"></td>" ;
              HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:30px;\" ID=\"LINEendY\"></td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;

              HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td>Draw color</td>" ;
              HTMLcode += "<td WIDTH=\"2\"></td>";
              HTMLcode += "<td STYLE=\"height:14px;width:24px;text-align:center;\" CLASS=\"general_rounded_corners\" ID=\"LINEcolor\"></td>";
              HTMLcode += "<td WIDTH=\"10\"></td>";
              HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
              HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'LINEcolorICON', 'LINEcolor' );\"";
              HTMLcode += "    WIDTH=\"16\" VALIGN=\"middle\" ID=\"LINEcolorICON\"><IMG SRC=\""+_glob_path_to_circles+"img/colortable/img/btns/spectrum16x16.png\"></td>";
              HTMLcode += "<td WIDTH=\"10\"></td>";
              HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#LINEcolor').css('background-color','transparent');$('#LINEcolor').html('none');\">Remove</td>";
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;

              HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>";
              HTMLcode += "<td>Thickness</td><td WIDTH=\"2\"></td><td><INPUT TYPE=\"edit\" STYLE=\"width:20px;\" ID=\"LINEthickness\"></td>" ;
              HTMLcode += "<td WIDTH=\"15\"></td>" ;
              HTMLcode += "<td>Dashed</td>" ;
              HTMLcode += "<td WIDTH=\"8\"></td>";
              HTMLcode += "<td>Yes</td>";
              HTMLcode += "<td WIDTH=\"1\"></td>";
              HTMLcode += "<td><INPUT TYPE=\"radio\" NAME=\"LINEdashedRADIO\" ID=\"LINEdashedRADIO_01\"></td>";
              HTMLcode += "<td WIDTH=\"10\"></td>";
              HTMLcode += "<td>No</td>";
              HTMLcode += "<td WIDTH=\"1\"></td>";
              HTMLcode += "<td><INPUT TYPE=\"radio\" CHECKED NAME=\"LINEdashedRADIO\" ID=\"LINEdashedRADIO_02\"></td>";
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;
              break ;
              case 2: // CIRCLE
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding:4px;\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr><td WIDTH=\"5\"></td><td COLSPAN=\"7\">Center</td><td WIDTH=\"15\"></td><td>Radius</td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td>X</td><td WIDTH=\"2\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:30px;\" ID=\"CIRCLEcenterX\"></td>" ;
              HTMLcode += "<td WIDTH=\"10\"></td>" ;
              HTMLcode += "<td>Y</td><td WIDTH=\"2\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:30px;\" ID=\"CIRCLEcenterY\"></td>" ;
              HTMLcode += "<td WIDTH=\"15\"></td>" ;
              HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:30px;\" ID=\"CIRCLEradius\"></td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;

              HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>";
              HTMLcode += "<td>Draw color</td>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>";
              HTMLcode += "<td STYLE=\"height:14px;width:24px;text-align:center;\" CLASS=\"general_rounded_corners\" ID=\"CIRCLEdrawcolor\"></td>";
              HTMLcode += "<td WIDTH=\"10\"></td>";
              HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
              HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'CIRCLEdrawcolorICON', 'CIRCLEdrawcolor');\"";
              HTMLcode += "    WIDTH=\"16\" VALIGN=\"middle\" ID=\"CIRCLEdrawcolorICON\"><IMG SRC=\""+_glob_path_to_circles+"img/colortable/img/btns/spectrum16x16.png\"></td>";
              HTMLcode += "<td WIDTH=\"10\"></td>";
              HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#CIRCLEdrawcolor').css('background-color','transparent');$('#CIRCLEdrawcolor')..html('none');\">Remove</td>";
              HTMLcode += "</tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>";
              HTMLcode += "<td>Fill color</td>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>";
              HTMLcode += "<td STYLE=\"height:14px;width:24px;text-align:center;\" CLASS=\"general_rounded_corners\" ID=\"CIRCLEfillcolor\"></td>";
              HTMLcode += "<td WIDTH=\"10\"></td>";
              HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
              HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'CIRCLEfillcolorICON', 'CIRCLEfillcolor' );\"";
              HTMLcode += "    WIDTH=\"16\" VALIGN=\"middle\" ID=\"CIRCLEfillcolorICON\"><IMG SRC=\""+_glob_path_to_circles+"img/colortable/img/btns/spectrum16x16.png\"></td>";
              HTMLcode += "<td WIDTH=\"10\"></td>";
              HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#CIRCLEfillcolor').css('background-color','transparent');$('#CIRCLEfillcolor')..html('none');\">Remove</td>";
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;

              HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>";
              HTMLcode += "<td>Dashed</td>" ;
              HTMLcode += "<td WIDTH=\"20\"></td>";
              HTMLcode += "<td>Yes</td>";
              HTMLcode += "<td WIDTH=\"3\"></td>";
              HTMLcode += "<td><INPUT TYPE=\"radio\" NAME=\"CIRCLEdashedRADIO\" ID=\"CIRCLEdashedRADIO_01\"></td>";
              HTMLcode += "<td WIDTH=\"15\"></td>";
              HTMLcode += "<td>No</td>";
              HTMLcode += "<td WIDTH=\"3\"></td>";
              HTMLcode += "<td><INPUT TYPE=\"radio\" CHECKED NAME=\"CIRCLEdashedRADIO\" ID=\"CIRCLEdashedRADIO_02\"></td>";
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;
              break ;
              case 3: // RECT
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding:4px;\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td>X</td><td WIDTH=\"1\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:25px;\" ID=\"RECTx\"></td>" ;
              HTMLcode += "<td WIDTH=\"10\"></td>" ;
              HTMLcode += "<td>Y</td><td WIDTH=\"1\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:25px;\" ID=\"RECTy\"></td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td>Width</td><td WIDTH=\"1\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:25px;\" ID=\"RECTwidth\"></td>" ;
              HTMLcode += "<td WIDTH=\"10\"></td>" ;
              HTMLcode += "<td>Height</td><td WIDTH=\"1\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:25px;\" ID=\"RECTheight\"></td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;

              HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td>Line thickness</td><td WIDTH=\"1\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:25px;\" ID=\"RECTlinewidth\"></td>" ;
              HTMLcode += "<td WIDTH=\"25\"></td>" ;
              HTMLcode += "<td>Opacity</td><td WIDTH=\"1\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:30px;\" ID=\"RECTopacity\"></td>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td>(0-1)</td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;

              HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>";
              HTMLcode += "<td>Draw color</td>" ;
              HTMLcode += "<td WIDTH=\"2\"></td>";
              HTMLcode += "<td STYLE=\"height:14px;width:24px;text-align:center;\" CLASS=\"general_rounded_corners\" ID=\"RECTdrawcolor\"></td>";
              HTMLcode += "<td WIDTH=\"10\"></td>";
              HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
              HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'RECTdrawcolorICON', 'RECTdrawcolor' );\"";
              HTMLcode += "    WIDTH=\"16\" VALIGN=\"middle\" ID=\"RECTdrawcolorICON\"><IMG SRC=\""+_glob_path_to_circles+"img/colortable/img/btns/spectrum16x16.png\"></td>";
              HTMLcode += "<td WIDTH=\"10\"></td>";
              HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#RECTdrawcolor').css('background-color','transparent');$('#RECTdrawcolor').html('none');\">Remove</td>";
              HTMLcode += "</tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>";
              HTMLcode += "<td>Fill color</td>" ;
              HTMLcode += "<td WIDTH=\"2\"></td>";
              HTMLcode += "<td STYLE=\"height:14px;width:24px;text-align:center;\" CLASS=\"general_rounded_corners\" ID=\"RECTfillcolor\"></td>";
              HTMLcode += "<td WIDTH=\"10\"></td>";
              HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
              HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'RECTfillcolorICON', 'RECTfillcolor' );\"";
              HTMLcode += "    WIDTH=\"16\" VALIGN=\"middle\" ID=\"RECTfillcolorICON\"><IMG SRC=\""+_glob_path_to_circles+"img/colortable/img/btns/spectrum16x16.png\"></td>";
              HTMLcode += "<td WIDTH=\"10\"></td>";
              HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#RECTfillcolor').css('background-color','transparent');$('#RECTfillcolor').html('none');\">Remove</td>";
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;
              break ;
              case 4: // TEXT
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding:4px;\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td>X</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:30px;\" ID=\"TEXTx\"></td>" ;
              HTMLcode += "<td WIDTH=\"10\"></td>" ;
              HTMLcode += "<td>Y</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:30px;\" ID=\"TEXTy\"></td>" ;
              HTMLcode += "<td WIDTH=\"10\"></td>" ;
              HTMLcode += "<td>Opacity</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:20px;\" ID=\"TEXTopacity\"></td><td WIDTH=\"5\"></td><td>(0-1)</td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;

              HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td>Text</td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"3\"></td>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td><TEXTAREA ID=\"TEXTarea\" STYLE=\"width:215px;height:40px;padding:2px;overflow:auto;\"></TEXTAREA></td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;

              HTMLcode += "<tr><td HEIGHT=\"3\"></td>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>";
              HTMLcode += "<td>Font color</td>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>";
              HTMLcode += "<td STYLE=\"height:14px;width:24px;text-align:center;\" CLASS=\"general_rounded_corners\" ID=\"TEXTcolor\"></td>";
              HTMLcode += "<td WIDTH=\"3\"></td>";
              HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
              HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE( 'TEXTcolorICON' 'TEXTcolor' );\"";
              HTMLcode += "    WIDTH=\"16\" VALIGN=\"middle\" ID=\"TEXTcolorICON\"><IMG SRC=\""+_glob_path_to_circles+"img/colortable/img/btns/spectrum16x16.png\"></td>";
              HTMLcode += "<td WIDTH=\"3\"></td>";
              HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#TEXTdrawcolor').css('background-color','transparent');$('#TEXTdrawcolor').html('none');\">Remove</td>";
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;

              HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>";
              HTMLcode += "<td>Font family</td>" ;
              HTMLcode += "<td WIDTH=\"2\"></td>";
              HTMLcode += "<td>" ;
              HTMLcode += "<select ID=\"TEXTfontfamilyCOMBO\">" ;
              HTMLcode += "<OPTION VALUE=\"arial\">Arial" ;
              HTMLcode += "<OPTION VALUE=\"courier new\">Courier new" ;
              HTMLcode += "<OPTION VALUE=\"georgia\">Georgia" ;
              HTMLcode += "<OPTION VALUE=\"tahoma\">Tahoma" ;
              HTMLcode += "<OPTION VALUE=\"times\">Times" ;
              HTMLcode += "<OPTION VALUE=\"verdana\">Verdana" ;
              HTMLcode += "</select>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "<td WIDTH=\"15\"></td>";
              HTMLcode += "<td>Size</td><td WIDTH=\"2\"></td><td><INPUT TYPE=\"edit\" STYLE=\"text-align:center;width:20px;\" ID=\"TEXTfontsize\"></td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;
              break ;
              case 5: // COMMENT
              HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td>Comment</td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"3\"></td>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
              HTMLcode += "<td><TEXTAREA ID=\"COMMENTarea\" STYLE=\"width:215px;height:40px;padding:2px;overflow:auto;\"></TEXTAREA></td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;
              break ;
			        default: break ;
        }

    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsSVGEDITORaddobjPANELupdate()
{
    if ( $("#CIRCLESformsSVGEDITORobjMODEcombo").get(0) != null &&
         $("#CIRCLESformsSVGEDITORaddobjCONTAINER").get(0) != null )
    {
        var _mode = safe_int( $("#CIRCLESformsSVGEDITORobjMODEcombo").val(), 0 );
        $("#CIRCLESformsSVGEDITORaddobjCONTAINER").html( CIRCLESformsSVGEDITORaddobjPANEL( _mode ) ); 
    }
}

function CIRCLESformsSVGEDITORaddobj( _mode )
{
    var _selection_pos_array = $("#CIRCLESformsSVGEDITORtextarea").selection( 'getPos' );
    var _caret_x = _selection_pos_array['start'], _caret_y = _selection_pos_array['end'] ;
    var _mode = safe_int( $("#CIRCLESformsSVGEDITORobjMODEcombo").val(), 0 ), _code = "" ;
    switch( _mode )
    {
          case 1: // LINE
          var _start_x = $("#LINEstartX").val();
          var _start_y = $("#LINEstartY").val();
          var _end_x = $("#LINEendX").val();
          var _end_y = $("#LINEendY").val();
          var _linewidth = $("#LINEthickness").val();
          var _drawcolor = $("#LINEcolor").css( "background-color" );
              _drawcolor = circles_lib_colors_rgb_dec_to_hex( _drawcolor );
          var _dashed = $("#LINEdashedRADIO_01").prop( "checked" ) ? YES : NO ;

          var _dash_attr = _dashed ? "stroke-dasharray=\"2,2,2\"" : "" ;
          var _draw_attr = _linewidth != 0 ? "stroke=\""+_drawcolor+"\"" : "stroke=\"transparent\"" ;
          var _linewidth_attr = "stroke-width=\""+_linewidth+"\"" ;

          _code = "<line "+_linewidth_attr+" "+_draw_attr+" "+_dash_attr+" x1=\""+_start_x+"\" y1=\""+_start_y+"\" x2=\""+_end_x+"\" y2=\""+_end_y+"\" />" ;
          break ;
          case 2: // CIRCLE
          var _center_x = $("#CIRCLEcenterX").val();
          var _center_y = $("#CIRCLEcenterY").val();
          var _radius = $("#CIRCLEradius").val();
          var _drawcolor = $("#CIRCLEdrawcolor").css( "background-color" );
              _drawcolor = circles_lib_colors_rgb_dec_to_hex( _drawcolor );
          var _fillcolor = $("#CIRCLEfillcolor").css( "background-color" );
              _fillcolor = circles_lib_colors_rgb_dec_to_hex( _fillcolor );
          var _dashed = $("#CIRCLEdashedRADIO_01").prop( "checked" ) ? YES : NO ;
    
          var _dash_attr = _dashed ? "stroke-dasharray=\"2,2,2\"" : "" ;
          var _linewidth_attr = _linewidth != 0 ? "stroke-width=\""+_linewidth+"\"" : "" ;
          var _draw_attr = _drawcolor.length > 0 ? "stroke=\""+_drawcolor+"\"" : "" ;
          var _fill_attr = ( _fill != 0 && _fillcolor.length > 0 ) ? "fill=\""+_fillcolor+"\"" : "fill=\"transparent\"" ;
         
          _code = "<circle "+_dash_attr+" "+_linewidth_attr+" "+_draw_attr+" "+_fill_attr+" cx=\""+_center_x+"\" cy=\""+_center_y+"\" r=\""+_radius+"\"/>" ;
          break ;
          case 3: // RECT
          var _x = $("#RECTx").val(), _y = $("#RECTy").val();
          var _w = $("#RECTwidth").val(), _h = $("#RECTheight").val();
          var _linewidth = $("#RECTlinewidth").val();
          var _opacity = safe_float( $("#RECTopacity").val(), DEFAULT_MAX_OPACITY );
               if ( _opacity < 0.0 || _opacity > DEFAULT_MAX_OPACITY )
               {
                   _opacity = DEFAULT_MAX_OPACITY ;
                   $("#RECTopacity").val( _opacity );
               }
          var _drawcolor = $("#RECTdrawcolor").css( "background-color" );
              _drawcolor = circles_lib_colors_rgb_dec_to_hex( _drawcolor );
          var _fillcolor = $("#RECTfillcolor").css( "background-color" );
              _fillcolor = circles_lib_colors_rgb_dec_to_hex( _fillcolor );

          var _style = "style=\"" ;
              if ( _drawcolor.length > 0 ) _style += "stroke:" + _drawcolor + ";" ;
              if ( _fillcolor.length > 0 ) _style += "fill:" + _fillcolor + ";" ;
              if ( _linewidth > 0 )   _style += "stroke-width:" + _linewidth + ";" ;
              if ( _opacity > 0 )
              {
                  _style += "stroke-opacity:" + _opacity + ";" ;
                  _style += "fill-opacity:" + _opacity + ";" ;
              }
              _style += "\"" ;
              
          _code = "<rect x=\""+_x+"\" y=\""+_y+"\" width=\""+_w+"\" height=\""+_h+"\" "+_style+" />" ;
          break ;
          case 4: // TEXT
          var _x = $("#TEXTx").val(), _y = $("#TEXTy").val();
          var _opacity = safe_float( $("#TEXTopacity").val(), DEFAULT_MAX_OPACITY );
               if ( _opacity < 0.0 || _opacity > DEFAULT_MAX_OPACITY ) $("#TEXTopacity").val( DEFAULT_MAX_OPACITY );
          var _font_color = $("#TEXTcolor").css( "background-color" );
              _font_color = circles_lib_colors_rgb_dec_to_hex( _font_color );
          var _font_size = Math.max( 0, safe_int( $("#TEXTfontsize").val(), 8 ) );
              $("#TEXTfontsize").val( _font_size );
          var _font_family = $("#TEXTfontfamilyCOMBO").val();
          var _text = $("#TEXTarea").val();

          var _style = "style=\"" ;
              _style += "stroke:" + ( _font_color.length > 0 ? _font_color : "none" ) + ";" ;
              _style += "fill:" + ( _font_color.length > 0 ? _font_color : "none" ) + ";" ;
              if ( _opacity > 0 )
              {
                  _style += "fill-opacity:" + _opacity + ";" ;
                  _style += "stroke-opacity:" + _opacity + ";" ;
              }
              _style += "\"" ;

          _code = "<text x=\""+_x+"\" y=\""+_y+"\" "+( _style.length > 0 ? _style : "" )+" font-family=\""+_font_family+"\" font-size=\""+_font_size+"\">"+_text+"</text>" ;
          break ;
          case 5: // COMMENT
          var _comment = $("#COMMENTarea").val();
          _code = "<!-- "+_comment+" -->" ;
          break ;
	        default: break ;
    }
    
    $("#CIRCLESformsSVGEDITORtextarea").selection( 'setPos', { start : _caret_x, end : _caret_y } );
    $("#CIRCLESformsSVGEDITORtextarea").selection( 'insert', { text : _code, caret : "keep" } );
}



function CIRCLESformsSVGEDITORbind_events( canvas )
{
    if ( is_html_canvas( canvas ) )
    {
         canvas.onmousemove = function( event )
         {
							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}

              _glob_canvas_obj_ref = this ;
              CIRCLESformsSVGEDITORcanvasONMOUSEMOVE( this, event );
         }
    }
    else return [ RET_ERROR, "Missing svg editor canvas to bind" ] ;
}