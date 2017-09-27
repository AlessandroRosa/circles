function CIRCLEStoolsCANVASCOMPOSITIONclose() { return circles_lib_plugin_dispatcher_unicast_message( "canvas.composition", "tools", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLEStoolsCANVASCOMPOSITIONmaximize()
{
    var _full_width = safe_int( arguments[1], 0 ), _full_height = safe_int( arguments[2], 0 );
    CIRCLEStoolsCANVASCOMPOSITIONresize( _full_width, _full_height );
    CIRCLEStoolsCANVASCOMPOSITIONstopresize();
    if ( $( "#" + CIRCLEStoolsCANVASCOMPOSITIONdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLEStoolsCANVASCOMPOSITIONdiv_id).resizable('enable');
}

function CIRCLEStoolsCANVASCOMPOSITIONminimize()
{
    var _original_width = safe_int( arguments[1], 0 ), _original_height = safe_int( arguments[2], 0 );
    var _min_width = safe_int( arguments[3], 0 );
    var _min_height = safe_int( arguments[4], 0 );
    CIRCLEStoolsCANVASCOMPOSITIONresize( _min_width, _min_height );
    CIRCLEStoolsCANVASCOMPOSITIONstopresize();
    if ( !( $( "#" + CIRCLEStoolsCANVASCOMPOSITIONdiv_id ).resizable( "option", "disabled" ) ) )
    $("#" + CIRCLEStoolsCANVASCOMPOSITIONdiv_id).resizable('disable');
}

function CIRCLEStoolsCANVASCOMPOSITIONnormalize()
{
    var _original_width = safe_int( arguments[1], 0 ), _original_height = safe_int( arguments[2], 0 );
    CIRCLEStoolsCANVASCOMPOSITIONresize( _original_width, _original_height );
    CIRCLEStoolsCANVASCOMPOSITIONstopresize();
    if ( $( "#" + CIRCLEStoolsCANVASCOMPOSITIONdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLEStoolsCANVASCOMPOSITIONdiv_id).resizable('enable');
}

function CIRCLEStoolsCANVASCOMPOSITIONmain( _base_id, _move )
{
    CIRCLEStoolsCANVASCOMPOSITIONuniqueid = _base_id ;
    _move = safe_int( _move, YES );
    var _min_dim_type = $( window ).height() < $( window ).width() ? 1 : 2 ;
    var _max_dim_type = $( window ).height() > $( window ).width() ? 1 : 2 ;
    var _dim = _max_dim_type == 1 ? $( window ).height() : $( window ).width();
    var _dim = Math.min( $(window).width() - 130, $(window).height() - 130 ) ;
    var WIDTH = _dim, HEIGHT = _dim, _run = YES, _subset = "tools" ;
    var _div_id = CIRCLEStoolsCANVASCOMPOSITIONdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    var CLOSE_FN = "CIRCLEStoolsCANVASCOMPOSITIONclose();" ;
	  var HTMLcode = "<table ID=\"CIRCLEStoolsCANVASCOMPOSITIONmasterTABLE\" WIDTH=\"100%\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLEStoolsCANVASCOMPOSITIONcaption, 5, 1, CLOSE_FN,
																				 WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "gearwheel/gearwheel.icon.01.16x16.png",
																				 "", null, "" );
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"3\" STYLE=\"height:18px;\" ALIGN=\"center\" WIDTH=\"100%\"><table ALIGN=\"center\" STYLE=\"height:18px;\" WIDTH=\"100%\"><tr><td STYLE=\"height:18px;\" ALIGN=\"center\" ID=\"CIRCLEStoolsCANVASCOMPOSITIONoutputBOX\"></td></tr></table></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;

        HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" WIDTH=\"160\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F7F7F7;padding:6px;\">" ;
        HTMLcode += "<table WIDTH=\"160\">" ;

        HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>Z-plane</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>Action</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>"+circles_lib_canvas_layer_pile_build_dropdown( "CIRCLEStoolsCANVASCOMPOSITIONzplaneCOMBO", "", Z_PLANE )+"</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<SELECT ID=\"CIRCLEStoolsCANVASCOMPOSITIONzplaneactionCOMBO\" ONCHANGE=\"javascript:CIRCLEStoolsCANVASCOMPOSITIONactionCOMBOselect("+Z_PLANE+");\">" ;
        HTMLcode += "<OPTION VALUE=\"0\">" ;
        HTMLcode += "<OPTION VALUE=\"1\">Add" ;
        HTMLcode += "<OPTION VALUE=\"2\">Preview" ;
        HTMLcode += "</SELECT>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</table></td></tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;

        HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>W-plane</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>Action</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>"+circles_lib_canvas_layer_pile_build_dropdown( "CIRCLEStoolsCANVASCOMPOSITIONwplaneCOMBO", "", W_PLANE )+"</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<SELECT ID=\"CIRCLEStoolsCANVASCOMPOSITIONwplaneactionCOMBO\" ONCHANGE=\"javascript:CIRCLEStoolsCANVASCOMPOSITIONactionCOMBOselect("+W_PLANE+");\">" ;
        HTMLcode += "<OPTION VALUE=\"0\">" ;
        HTMLcode += "<OPTION VALUE=\"1\">Add" ;
        HTMLcode += "<OPTION VALUE=\"2\">Preview" ;
        HTMLcode += "</SELECT>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</table></td></tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td ID=\"CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBOpanel\" STYLE=\"display:none;\">" ;
        HTMLcode += "<table WIDTH=\"100%\">" ;
        HTMLcode += "<tr><td>Selected layers pile</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td ID=\"CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBOcontainer\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
        HTMLcode += "<tr><td>Action</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<SELECT ID=\"CIRCLEStoolsCANVASCOMPOSITIONactionCOMBO\" ONCHANGE=\"javascript:CIRCLEStoolsCANVASCOMPOSITIONactionSELECT();\">" ;
        HTMLcode += "<OPTION VALUE=\"0\">" ;
        HTMLcode += "<OPTION VALUE=\"1\">Clean composition" ;
        HTMLcode += "<OPTION VALUE=\"2\">Swap selected layer up" ;
        HTMLcode += "<OPTION VALUE=\"3\">Swap selected layer down" ;
        HTMLcode += "<OPTION VALUE=\"4\">Remove selected layer" ;
        HTMLcode += "<OPTION VALUE=\"5\">Render composition" ;
        HTMLcode += "<OPTION VALUE=\"6\">Save composition as" ;
        HTMLcode += "<OPTION VALUE=\"7\">Delete composition" ;
        HTMLcode += "</SELECT>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
        HTMLcode += "<tr><td>Save as</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td>" ;
      	HTMLcode += "<SELECT ID=\"CIRCLEStoolsCANVASCOMPOSITIONexportCOMBO\" ONCHANGE=\"javascript:_glob_export_format=safe_int( this.options[this.selectedIndex].value, EXPORT_NONE );_glob_export_code_array=[];$('[id$=exportCOMBO]').get(0).selectedIndex=this.selectedIndex;CIRCLEStoolsCANVASCOMPOSITIONcanvasSAVEASform();\">" ;
        HTMLcode += "<OPTION "+( _glob_export_format == EXPORT_NONE ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+EXPORT_NONE+"\">None" ;
        HTMLcode += "<OPTION "+( _glob_export_format == EXPORT_PNG ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+EXPORT_PNG+"\">PNG" ;
        HTMLcode += "<OPTION "+( _glob_export_format == EXPORT_SVG ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+EXPORT_SVG+"\">SVG" ;
        HTMLcode += "<OPTION "+( _glob_export_format == EXPORT_PS ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+EXPORT_PS+"\">PS" ;
        HTMLcode += "<OPTION "+( _glob_export_format == EXPORT_EPS ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+EXPORT_EPS+"\">Encapsulated PS" ;
        HTMLcode += "<OPTION "+( _glob_export_format == EXPORT_LATEX ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+EXPORT_LATEX+"\">LaTeX" ;
        HTMLcode += "</SELECT>" ;
				HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>"

        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;

        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td ALIGN=\"center\" VALIGN=\"top\"><CANVAS STYLE=\"border:1px solid #D0D0D0;\" ID=\"CIRCLEStoolsCANVASCOMPOSITIONcanvas\"></CANVAS></td>" ;

        HTMLcode += "</tr>"
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;

        HTMLcode += "</table></td></tr>" ;
		 		HTMLcode += "</table>" ;
    
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, 'tools', OPEN, _div_id, CIRCLEStoolsCANVASCOMPOSITIONcaption, CLOSE_FN,
                      [ "CIRCLEStoolsCANVASCOMPOSITIONnormalize", _div_id, WIDTH, HEIGHT ],
                      [ "CIRCLEStoolsCANVASCOMPOSITIONminimize", _div_id ],
                      [ "CIRCLEStoolsCANVASCOMPOSITIONmaximize", _div_id ],
                      _run ? "popup_caption_bk_enabled" : "popup_caption_bk_alert" );
    if ( _move && _div != null ) move_div( _div_id, "LEFT", "TOP" );

    if ( _run )
    {
      if ( $("#"+_div_id ).resizable('instance') != undefined )
      $("#"+_div_id).resizable('destroy').resizable(
      {
	      start: function( event, ui ) { CIRCLEStoolsCANVASCOMPOSITIONstartresize( ui.size.width, ui.size.height ) },
	      resize: function( event, ui ) { CIRCLEStoolsCANVASCOMPOSITIONresize( ui.size.width, ui.size.height ); },
	      stop: function( event, ui ) { CIRCLEStoolsCANVASCOMPOSITIONstopresize( ui.size.width, ui.size.height ) }
      } );
      else
      {
        $("#"+_div_id).resizable(
        {
  	      start: function( event, ui ) { CIRCLEStoolsCANVASCOMPOSITIONstartresize( ui.size.width, ui.size.height ) },
  	      resize: function( event, ui ) { CIRCLEStoolsCANVASCOMPOSITIONresize( ui.size.width, ui.size.height ); },
  	      stop: function( event, ui ) { CIRCLEStoolsCANVASCOMPOSITIONstopresize( ui.size.width, ui.size.height ) }
        } );
      }
      $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
    }

    var _side = _dim - 180 ;
    $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvas" ).get(0).set_width( _side );
    $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvas" ).get(0).set_height( _side );
}

function CIRCLEStoolsCANVASCOMPOSITIONstartresize( _new_width, _new_height ) {  }
function CIRCLEStoolsCANVASCOMPOSITIONstopresize( _new_width, _new_height )
{
    var _side = Math.min( $("#"+CIRCLEStoolsCANVASCOMPOSITIONdiv_id).width() - 180, $("#"+CIRCLEStoolsCANVASCOMPOSITIONdiv_id).height() - 100 );
    $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvas" ).get(0).set_width( _side );
    $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvas" ).get(0).set_height( _side );

		CIRCLEStoolsCANVASCOMPOSITIONcompositionRENDER(YES);
}

function CIRCLEStoolsCANVASCOMPOSITIONresize( _new_width, _new_height )
{
    var _side = Math.min( $("#"+CIRCLEStoolsCANVASCOMPOSITIONdiv_id).width() - 180, $("#"+CIRCLEStoolsCANVASCOMPOSITIONdiv_id).height() - 100 );
    $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvas" ).get(0).set_width( _side );
    $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvas" ).get(0).set_height( _side );
		CIRCLEStoolsCANVASCOMPOSITIONcompositionRENDER(YES);
}