function CIRCLEStoolsGROUPTABLEclose() { return circles_lib_plugin_dispatcher_unicast_message( "group.table", "tools", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLEStoolsGROUPTABLEmaximize()
{
    var _full_width = safe_int( arguments[1], 0 ), _full_height = safe_int( arguments[2], 0 );
    CIRCLEStoolsGROUPTABLEresize( _full_width, _full_height );
    CIRCLEStoolsGROUPTABLEstopresize();
    if ( $( "#" + CIRCLEStoolsGROUPTABLEdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLEStoolsGROUPTABLEdiv_id).resizable('enable');
}

function CIRCLEStoolsGROUPTABLEminimize()
{
    var _original_width = safe_int( arguments[1], 0 ), _original_height = safe_int( arguments[2], 0 );
    var _min_width = safe_int( arguments[3], 0 );
    var _min_height = safe_int( arguments[4], 0 );
    CIRCLEStoolsGROUPTABLEresize( _min_width, _min_height );
    CIRCLEStoolsGROUPTABLEstopresize();
    if ( !( $( "#" + CIRCLEStoolsGROUPTABLEdiv_id ).resizable( "option", "disabled" ) ) )
    $("#" + CIRCLEStoolsGROUPTABLEdiv_id).resizable('disable');
}

function CIRCLEStoolsGROUPTABLEnormalize()
{
    var _original_width = safe_int( arguments[1], 0 ), _original_height = safe_int( arguments[2], 0 );
    CIRCLEStoolsGROUPTABLEresize( _original_width, _original_height );
    CIRCLEStoolsGROUPTABLEstopresize();
    if ( $( "#" + CIRCLEStoolsGROUPTABLEdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLEStoolsGROUPTABLEdiv_id).resizable('enable');
}

function CIRCLEStoolsGROUPTABLEmain( _base_id, _move )
{
    _move = safe_int( _move, YES );
    CIRCLEStoolsGROUPTABLEuniqueid = _base_id ;
		var _items_n = _glob_items_switch == ITEMS_SWITCH_SEEDS ? circles_lib_count_seeds() : circles_lib_count_gens();
    var WIDTH = Math.max( Math.min( $(window).width(), _items_n * 140 ), 480 ), HEIGHT = 250 ;
    var CLOSE_FN = "CIRCLEStoolsGROUPTABLEclose();", _run = YES, _subset = "tools" ;
    var _div_id = CIRCLEStoolsGROUPTABLEdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
	  var HTMLcode = "<table ID=\"CIRCLEStoolsGROUPTABLEmasterTABLE\" WIDTH=\"100%\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLEStoolsGROUPTABLEcaption, 5, 1, CLOSE_FN,
										WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "gearwheel/gearwheel.icon.01.20x20.png",
										"", null, "" );
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td HEIGHT=\"12\" ID=\"CIRCLEStoolsGROUPTABLElabel\" STYLE=\"padding-left:6px;\"></td>" ;
        HTMLcode += "<td WIDTH=\"35\"></td>" ;
        HTMLcode += "<td>View</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td><SELECT ID=\"CIRCLEStoolsGROUPTABLEviewCOMBO\" ONCLICK=\"javascript:CIRCLEStoolsGROUPTABLEfill_div_with_mobius_maps(this.options[this.selectedIndex].value);\"><OPTION "+(_glob_items_switch == ITEMS_SWITCH_SEEDS ? "SELECTED=\"selected\"":"")+" VALUE=\""+ITEMS_SWITCH_SEEDS+"\">Seeds<OPTION "+(_glob_items_switch == ITEMS_SWITCH_GENS ? "SELECTED=\"selected\"":"")+" VALUE=\""+ITEMS_SWITCH_GENS+"\">Gens</SELECT></td>" ;
        HTMLcode += "<td WIDTH=\"35\"></td>" ;
        HTMLcode += "<td>Font size</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td><SELECT ID=\"CIRCLEStoolsGROUPTABLEfontsizeCOMBO\" ONCLICK=\"javascript:CIRCLEStoolsGROUPTABLEfontsize=this.options[this.selectedIndex].value;CIRCLEStoolsGROUPTABLEfill_div_with_mobius_maps();\"><OPTION "+(CIRCLEStoolsGROUPTABLEfontsize==7 ? "SELECTED=\"selected\"":"")+" VALUE=\"7\">Tiny<OPTION "+(CIRCLEStoolsGROUPTABLEfontsize==8 ? "SELECTED=\"selected\"":"")+" VALUE=\"8\">Normal<OPTION "+(CIRCLEStoolsGROUPTABLEfontsize==10 ? "SELECTED=\"selected\"":"")+" VALUE=\"10\">Large</SELECT></td>" ;
        HTMLcode += "<td WIDTH=\"35\"></td>" ;
        HTMLcode += "<td>Round to</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td><INPUT ID=\"CIRCLEStoolsGROUPTABLEroundtoEDIT\" TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLEStoolsGROUPTABLEeventsHANDLER( event, this.id );\" STYLE=\"width:30px;text-align:center;\" VALUE=\""+CIRCLEStoolsGROUPTABLEroundto+"\"></td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" ALIGN=\"left\" CLASS=\"general_rounded_corners\" WIDTH=\"100%\">" ;
        HTMLcode += "<DIV ALIGN=\"left\" ID=\"CIRCLEStoolsGROUPTABLEdiv\" CLASS=\"general_rounded_corners\" STYLE=\"position:relative;width:"+(WIDTH-10)+"px;height:"+(HEIGHT-88)+"px;padding:2px;overflow-x:auto;overflow-y:hidden;background-color:#232323;\"></DIV>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>"
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;

		 		HTMLcode += "</table>" ;
    
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, 'tools', OPEN, _div_id, CIRCLEStoolsGROUPTABLEcaption, CLOSE_FN,
                      [ "CIRCLEStoolsGROUPTABLEnormalize", _div_id, WIDTH, HEIGHT ],
                      [ "CIRCLEStoolsGROUPTABLEminimize", _div_id ],
                      [ "CIRCLEStoolsGROUPTABLEmaximize", _div_id ],
                      _run ? "popup_caption_bk_enabled" : "popup_caption_bk_alert" );
    if ( _move && _div != null ) move_div( _div_id, "LEFT", "TOP" );

    if ( _run )
    {
      if ( $("#"+_div_id ).resizable('instance') != undefined )
      $("#"+_div_id).resizable('destroy').resizable(
      {
  				minWidth: 220,
  				maxWidth: $(window).width() - 20,
  				maxHeight: HEIGHT,
    			minHeight: HEIGHT,
  		    handles: 'e, w',
  				start: function( event, ui ) { CIRCLEStoolsGROUPTABLEstartresize( ui.size.width, ui.size.height ) },
  	      resize: function( event, ui ) { CIRCLEStoolsGROUPTABLEresize( ui.size.width, ui.size.height ); },
  	      stop: function( event, ui ) { CIRCLEStoolsGROUPTABLEstopresize( ui.size.width, ui.size.height ) }
      } );
      else
      {
        $("#"+_div_id).resizable(
        {
  				minWidth: 220,
  				maxWidth: $(window).width() - 20,
  				maxHeight: HEIGHT,
    			minHeight: HEIGHT,
  		    handles: 'e, w',
  				start: function( event, ui ) { CIRCLEStoolsGROUPTABLEstartresize( ui.size.width, ui.size.height ) },
  	      resize: function( event, ui ) { CIRCLEStoolsGROUPTABLEresize( ui.size.width, ui.size.height ); },
  	      stop: function( event, ui ) { CIRCLEStoolsGROUPTABLEstopresize( ui.size.width, ui.size.height ) }
        } );
      }
      $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
    }

    $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
    CIRCLEStoolsGROUPTABLEfill_div_with_mobius_maps();
}

function CIRCLEStoolsGROUPTABLEstartresize( _new_width, _new_height ) {  }
function CIRCLEStoolsGROUPTABLEstopresize( _new_width, _new_height )
{
		CIRCLEStoolsGROUPTABLEcompositionRENDER( _new_width, _new_height );
}

function CIRCLEStoolsGROUPTABLEresize( _new_width, _new_height )
{
		CIRCLEStoolsGROUPTABLEcompositionRENDER( _new_width, _new_height );
}

function CIRCLEStoolsGROUPTABLEcompositionRENDER( _new_width, _new_height )
{
		$( "#CIRCLEStoolsGROUPTABLEdiv" ).width( _new_width - 15 );
}