function CIRCLEStoolsFUNDAMENTALREGIONclose() { return circles_lib_plugin_dispatcher_unicast_message( "fundamental.region", "tools", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLEStoolsFUNDAMENTALREGIONmaximize()
{
    var _full_width = safe_int( arguments[1], 0 );
    var _full_height = safe_int( arguments[2], 0 );
    CIRCLEStoolsFUNDAMENTALREGIONresize( _full_width, _full_height );
    CIRCLEStoolsFUNDAMENTALREGIONstopresize();
    if ( $( "#" + CIRCLEStoolsFUNDAMENTALREGIONdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLEStoolsFUNDAMENTALREGIONdiv_id).resizable('enable');
}

function CIRCLEStoolsFUNDAMENTALREGIONminimize()
{
    var _original_width = safe_int( arguments[1], 0 );
    var _original_height = safe_int( arguments[2], 0 );
    var _min_width = safe_int( arguments[3], 0 );
    var _min_height = safe_int( arguments[4], 0 );
    CIRCLEStoolsFUNDAMENTALREGIONresize( _min_width, _min_height );
    CIRCLEStoolsFUNDAMENTALREGIONstopresize();
    if ( !( $( "#" + CIRCLEStoolsFUNDAMENTALREGIONdiv_id ).resizable( "option", "disabled" ) ) )
    $("#" + CIRCLEStoolsFUNDAMENTALREGIONdiv_id).resizable('disable');
}

function CIRCLEStoolsFUNDAMENTALREGIONnormalize()
{
    var _original_width = safe_int( arguments[1], 0 );
    var _original_height = safe_int( arguments[2], 0 );
    CIRCLEStoolsFUNDAMENTALREGIONresize( _original_width, _original_height );
    CIRCLEStoolsFUNDAMENTALREGIONstopresize();
    if ( $( "#" + CIRCLEStoolsFUNDAMENTALREGIONdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLEStoolsFUNDAMENTALREGIONdiv_id).resizable('enable');
}

function CIRCLEStoolsFUNDAMENTALREGIONmain( _base_id, _move )
{
    CIRCLEStoolsFUNDAMENTALREGIONuniqueid = _base_id ;
    _move = safe_int( _move, YES );
		_glob_current_tab['fundamentalregion'] = 0 ;
    var _min_dim_type = $( window ).height() < $( window ).width() ? 1 : 2 ;
    var _max_dim_type = $( window ).height() > $( window ).width() ? 1 : 2 ;
    var _dim = _max_dim_type == 1 ? $( window ).height() : $( window ).width();
    var WIDTH = safe_int( _dim * 0.6, 400 ), HEIGHT = $( window ).height() - 134 ;
    var _run = YES, _subset = "tools" ;
    var _div_id = CIRCLEStoolsFUNDAMENTALREGIONdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    var CLOSE_FN = "CIRCLEStoolsFUNDAMENTALREGIONclose();" ;
	  var HTMLcode = "<table ID=\"CIRCLEStoolsFUNDAMENTALREGIONmasterTABLE\" WIDTH=\"100%\" HEIGHT=\"100%\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLEStoolsFUNDAMENTALREGIONcaption, 5, 1, CLOSE_FN,
																				 WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "gearwheel/gearwheel.icon.01.16x16.png",
																				 "", null, "" );
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\">" ;

        HTMLcode += "<div ID=\"CIRCLEStoolsFUNDAMENTALREGIONmainDIV\" STYLE=\"position:relative;width:99%;height:94%;\" VALIGN=\"top\" class=\"tabber\">" ;

        HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:99%;height:94%;\" VALIGN=\"top\" ID=\"CIRCLEStoolsFUNDAMENTALREGION_TAB_01\">" ;
        HTMLcode += "<h2>Diagram</h2>" ;
        HTMLcode += "<table><tr><td ID=\"CIRCLEStoolsFUNDAMENTALREGIONdiagramCONTAINER\">"+CIRCLEStoolsFUNDAMENTALREGIONdiagramBOX( WIDTH - 30, HEIGHT )+"</td></tr></table>" ;
        HTMLcode += "</DIV>" ;

        HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:99%;height:94%;\" VALIGN=\"top\" ID=\"CIRCLEStoolsFUNDAMENTALREGION_TAB_02\">" ;
        HTMLcode += "<h2>Params</h2>" ;
        HTMLcode += "<table WIDTH=\"100%\">" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td CLASS=\"general_rounded_corners\" STYLE=\"padding:4px;background-color:#FAFAFA;\" ID=\"CIRCLEStoolsFUNDAMENTALREGIONcurrentALPHABET\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
				HTMLcode += "<tr><td CLASS=\"popup_buttons_bar\" ID=\"CIRCLEStoolsFUNDAMENTALREGIONparamsBAR\">"+CIRCLEStoolsFUNDAMENTALREGIONparamsBARcreate()+"</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
				HTMLcode += "<tr><td ID=\"CIRCLEStoolsFUNDAMENTALREGIONparamsCONTAINER\">"+CIRCLEStoolsFUNDAMENTALREGIONparamsCONTAINERcreate( WIDTH )+"</td></tr>" ;
				HTMLcode += "</table>" ;
        HTMLcode += "</DIV>" ;

				HTMLcode += "</div>" ;

        HTMLcode += "</td></tr>" ;
		 		HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
		 		HTMLcode += "</table>" ;
    
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, 'tools', OPEN, _div_id, CIRCLEStoolsFUNDAMENTALREGIONcaption, CLOSE_FN,
                      [ "CIRCLEStoolsFUNDAMENTALREGIONnormalize", _div_id, WIDTH, HEIGHT ],
                      [ "CIRCLEStoolsFUNDAMENTALREGIONminimize", _div_id ],
                      [ "CIRCLEStoolsFUNDAMENTALREGIONmaximize", _div_id ],
                      _run ? "popup_caption_bk_enabled" : "popup_caption_bk_alert" );
    if ( _move && _div != null ) move_div( _div_id, "LEFT", "TOP" );

    tabberAutomatic( CIRCLESFUNDAMENTALREGIONtabberOptions, "CIRCLEStoolsFUNDAMENTALREGION" );

    var _canvas = $( "#CIRCLESfundamentalregiondiagramCANVAS" ).get(0);
    var _canvas_w = is_html_canvas( _canvas ) ? _canvas.get_width() : 0 ;
    var _canvas_h = is_html_canvas( _canvas ) ? _canvas.get_height() : 0 ;

    if ( _run )
    {
      if ( $("#"+_div_id ).resizable('instance') != undefined )
      $("#"+_div_id).resizable('destroy').resizable(
      {
	      start: function( event, ui ) { CIRCLEStoolsFUNDAMENTALREGIONstartresize( ui.size.width, ui.size.height ) },
	      resize: function( event, ui ) { CIRCLEStoolsFUNDAMENTALREGIONresize( ui.size.width, ui.size.height ); },
	      stop: function( event, ui )   { CIRCLEStoolsFUNDAMENTALREGIONstopresize( ui.size.width, ui.size.height ) }
      } );
      else
      {
        $("#"+_div_id).resizable(
        {
  	      start: function( event, ui ) { CIRCLEStoolsFUNDAMENTALREGIONstartresize( ui.size.width, ui.size.height ) },
  	      resize: function( event, ui ) { CIRCLEStoolsFUNDAMENTALREGIONresize( ui.size.width, ui.size.height ); },
  	      stop: function( event, ui )   { CIRCLEStoolsFUNDAMENTALREGIONstopresize( ui.size.width, ui.size.height ) }
        } );
      }
      $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
    }

    if ( CIRCLEStoolsFUNDAMENTALREGIONwork_layer == null )
    {
        $( "#CIRCLEStoolsFUNDAMENTALREGIONleftPANELcontainer" ).css( "width", WIDTH );
      	$( "#CIRCLEStoolsFUNDAMENTALREGIONleftPANEL" ).css( "width", WIDTH );
        $( "#CIRCLESfundamentalregiondiagramCANVAS" ).get(0).set_height( HEIGHT - 212 ) ;
      
        _canvas_w = $( "#CIRCLESfundamentalregiondiagramCANVAS" ).get(0).get_width();
        _canvas_h = $( "#CIRCLESfundamentalregiondiagramCANVAS" ).get(0).get_height();
          
        CIRCLEStoolsFUNDAMENTALREGIONwork_layer = document.createElement("div");
        if ( CIRCLEStoolsFUNDAMENTALREGIONwork_layer != null )
        {
		         CIRCLEStoolsFUNDAMENTALREGIONwork_layer.id = "CIRCLEStoolsFUNDAMENTALREGIONworkLAYER" ;
		         CIRCLEStoolsFUNDAMENTALREGIONwork_layer.position = "absolute" ;
		
		         document.body.appendChild( CIRCLEStoolsFUNDAMENTALREGIONwork_layer );
		
		         $( "#CIRCLEStoolsFUNDAMENTALREGIONworkLAYER" ).width( _canvas_w );
		         $( "#CIRCLEStoolsFUNDAMENTALREGIONworkLAYER" ).height( _canvas_h );
		         CIRCLEStoolsFUNDAMENTALREGIONwork_layer.style.zIndex = safe_int( $("#"+_div_id).css( "z-index" ), 1 ) + 1 ;
		         CIRCLEStoolsFUNDAMENTALREGIONwork_layer.innerHTML = "<CANVAS ID=\"CIRCLESfundamentalregionworklayerCANVAS\" WIDTH=\""+_canvas_w+"\" HEIGHT=\""+_canvas_w+"\" STYLE=\"width:"+_canvas_w+"px;height:"+_canvas_h+"px;background-color:transparent;\"></CANVAS>" ;
		         $( "#CIRCLEStoolsFUNDAMENTALREGIONworkLAYER" ).offset( $( "#CIRCLESfundamentalregiondiagramCANVAS" ).offset() );
		          
		         circles_lib_plugin_dragstart_override_fn = function() { $( "#CIRCLEStoolsFUNDAMENTALREGIONworkLAYER" ).offset( $( "#CIRCLESfundamentalregiondiagramCANVAS" ).offset() ); };
		         circles_lib_plugin_drag_override_fn = function() { $( "#CIRCLEStoolsFUNDAMENTALREGIONworkLAYER" ).offset( $( "#CIRCLESfundamentalregiondiagramCANVAS" ).offset() ); };
		         POPUPlibMOVEendOVERRIDEfn = function() { $( "#CIRCLEStoolsFUNDAMENTALREGIONworkLAYER" ).offset( $( "#CIRCLESfundamentalregiondiagramCANVAS" ).offset() ); };
				}
     }

    CIRCLEStoolsFUNDAMENTALREGIONwork_layer_canvas = $( "#CIRCLESfundamentalregionworklayerCANVAS" ).get(0);
    CIRCLEStoolsFUNDAMENTALREGIONbindCANVASevents();

    if ( is_html_canvas( _canvas ) )
    {
         CIRCLEStoolsFUNDAMENTALREGIONmapperINIT( _canvas_w, _canvas_h, YES );
         CIRCLEStoolsFUNDAMENTALREGIONdrawCANVAS( [ 2, 8, 1 ] );
    }
    
    $( "[id^=CIRCLEStoolsFUNDAMENTALREGION_TAB_]" ).height( HEIGHT - 90 );
	  CIRCLEStoolsFUNDAMENTALREGIONprocedureCOMBOonchange();
		CIRCLEStoolsFUNDAMENTALREGIONcurrentALPHABETupdate();
}

function CIRCLEStoolsFUNDAMENTALREGIONstartresize( _new_width, _new_height ) { $( "#CIRCLEStoolsFUNDAMENTALREGIONpickedCOMPLEXPT,#CIRCLEStoolsFUNDAMENTALREGIONplotCOMPLEXPTicon" ).css( "display", "none" ); }
function CIRCLEStoolsFUNDAMENTALREGIONstopresize( _new_width, _new_height )
{
    $( "#CIRCLEStoolsFUNDAMENTALREGIONpickedCOMPLEXPT,#CIRCLEStoolsFUNDAMENTALREGIONplotCOMPLEXPTicon" ).css( "display", "block" );
    $( "#CIRCLESfundamentalregiondiagramCANVAS" ).get(0).set_height( _new_height - 152 ) ;
    $( "#CIRCLEStoolsFUNDAMENTALREGIONleftPANEL" ).width( _new_width - 12 );
 		var _options = [ 2, 8, 1 ] ;
    CIRCLEStoolsFUNDAMENTALREGIONdrawCANVAS( _options, YES );
    $( "[id^=CIRCLEStoolsFUNDAMENTALREGION_TAB_]" ).width( _new_width - 10 );
    $( "[id^=CIRCLEStoolsFUNDAMENTALREGION_TAB_]" ).height( _new_height - 88 );
		circles_lib_plugin_dispatcher_unicast_message( "fundamentalregion", "tools", POPUP_DISPATCHER_UNICAST_EVENT_FOCUS );
		CIRCLEStoolsFUNDAMENTALREGIONparamsCONTAINERresize( _new_width );
}

function CIRCLEStoolsFUNDAMENTALREGIONresize( _new_width, _new_height )
{
    $( "#CIRCLEStoolsFUNDAMENTALREGIONmasterTABLE" ).css( "width", _new_width );
    $( "[id^=CIRCLEStoolsFUNDAMENTALREGION_TAB_]" ).width( _new_width - 10 );
    $( "[id^=CIRCLEStoolsFUNDAMENTALREGION_TAB_]" ).height( _new_height - 88 );
    $( "#CIRCLEStoolsFUNDAMENTALREGIONleftPANEL" ).width( _new_width - 36 );
    $( "#CIRCLESfundamentalregiondiagramCANVAS" ).get(0).set_width( $( "#CIRCLEStoolsFUNDAMENTALREGIONleftPANEL" ).width() - 12 );
    $( "#CIRCLESfundamentalregiondiagramCANVAS" ).get(0).set_height( $( "[id^=CIRCLEStoolsFUNDAMENTALREGION_TAB_]" ).height() - 60 );
    $( "#CIRCLEStoolsFUNDAMENTALREGIONpickedCOMPLEXPT" ).width( $( "#CIRCLESfundamentalregiondiagramCANVAS" ).get(0).get_width() - 100 );
		CIRCLEStoolsFUNDAMENTALREGIONparamsCONTAINERresize( _new_width );
}