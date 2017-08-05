function CIRCLESformsDISCRETENESSLOCUShelp() { circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, "This form implements David Wright's application of Farey fractions", _glob_app ); }
function CIRCLESformsDISCRETENESSLOCUSclose()
{
	circles_lib_plugin_dispatcher_unicast_message( 'discreteness.locus', "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE );
  return YES ;
}

function CIRCLESformsDISCRETENESSLOCUSmaximize()
{
  var _full_width = safe_int( arguments[1], 0 );
  var _full_height = safe_int( arguments[2], 0 );
  CIRCLESformsDISCRETENESSLOCUSresize( _full_width, _full_height );
  CIRCLESformsDISCRETENESSLOCUSstopresize();
  if ( $( "#" + CIRCLESformsDISCRETENESSLOCUSdiv_id ).resizable( "option", "disabled" ) )
  $("#"+CIRCLESformsDISCRETENESSLOCUSdiv_id).resizable('enable');
}

function CIRCLESformsDISCRETENESSLOCUSminimize()
{
  var _original_width = safe_int( arguments[1], 0 );
  var _original_height = safe_int( arguments[2], 0 );
  var _min_width = safe_int( arguments[3], 0 );
  var _min_height = safe_int( arguments[4], 0 );
  CIRCLESformsDISCRETENESSLOCUSresize( _min_width, _min_height );
  CIRCLESformsDISCRETENESSLOCUSstopresize();
  if ( !( $( "#" + CIRCLESformsDISCRETENESSLOCUSdiv_id ).resizable( "option", "disabled" ) ) )
  $("#"+CIRCLESformsDISCRETENESSLOCUSdiv_id).resizable('disable');
}

function CIRCLESformsDISCRETENESSLOCUSnormalize()
{
  var _original_width = safe_int( arguments[1], 0 );
  var _original_height = safe_int( arguments[2], 0 );
  CIRCLESformsDISCRETENESSLOCUSresize( _original_width, _original_height );
  CIRCLESformsDISCRETENESSLOCUSstopresize();
  if ( $( "#" + CIRCLESformsDISCRETENESSLOCUSdiv_id ).resizable( "option", "disabled" ) )
  $("#"+CIRCLESformsDISCRETENESSLOCUSdiv_id).resizable('enable');
}

function CIRCLESformsDISCRETENESSLOCUSmain( _base_id, _move )
{
		_glob_persistent_vars['old_target_plane'] = _glob_target_plane ;
		_glob_target_plane = D_LOCUS ;
    CIRCLESformsDISCRETENESSLOCUSbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ) ;
    var CLOSE_FN = "CIRCLESformsDISCRETENESSLOCUSclose();" ;
    var _run = YES, _subset = "forms" ;
    var _min_dim_type = $( window ).height() < $( window ).width() ? 1 : 2 ;
    var _max_dim_type = $( window ).height() > $( window ).width() ? 1 : 2 ;
    var _dim = _max_dim_type == 1 ? $( window ).height() : $( window ).width();
    var WIDTH = safe_int( _dim * 0.6, 400 ), HEIGHT = $( window ).height() - 70 ;
    var _div_id = CIRCLESformsDISCRETENESSLOCUSdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    var _help_fn = "CIRCLESformsDISCRETENESSLOCUShelp();" ;
    _glob_current_tab['dlocus'] = 0 ;
    var HTMLcode = "<table ID=\"CIRCLESformsDISCRETENESSLOCUSmasterTABLE\" WIDTH=\"100%\">" ;
        HTMLcode += circles_lib_plugin_caption_code( _run, CIRCLESformsDISCRETENESSLOCUScaption, 5, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name,
                    _base_id, _div_id, _subset, "gearwheel/gearwheel.icon.01.16x16.png", "", _help_fn, "CIRCLESformsDISCRETENESSLOCUS" );

    HTMLcode += "<tr><td VALIGN=\"top\">" + CIRCLESformsDISCRETENESSLOCUSupperMENU() + "</td></tr>";
    HTMLcode += "<tr><td VALIGN=\"top\" ID=\"CIRCLESformsDISCRETENESSLOCUSupperbar\" CLASS=\"popup_buttons_bar\">" + CIRCLESformsDISCRETENESSLOCUSupperBAR() + "</td></tr>";

    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\" WIDTH=\"100%\">" ;
    HTMLcode += "<div id=\"CIRCLESformsDISCRETENESSLOCUSmainDIV\" STYLE=\"width:auto;height:auto;\" class=\"tabber\">" ;

    HTMLcode += "<div class=\"tabbertab\" VALIGN=\"top\" STYLE=\"width:auto;height:auto;\" ID=\"CIRCLESformsDISCRETENESSLOCUS_TAB_01\">" ;
    HTMLcode += "<h2>Diagram</h2>" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td ALIGN=\"center\" VALIGN=\"top\" ID=\"CIRCLESformsDISCRETENESSLOCUSdiagramLEFTPANELcontainer\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F4F4F4;padding:4px;\">"+CIRCLESformsDISCRETENESSLOCUSdiagramBOX( WIDTH - CIRCLESformsDISCRETENESSLOCUSright_panel_w, HEIGHT )+"</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td WIDTH=\""+CIRCLESformsDISCRETENESSLOCUSright_panel_w+"\" ALIGN=\"center\" VALIGN=\"top\" ID=\"CIRCLESformsDISCRETENESSLOCUSdiagramCOMMANDSBARcontainer\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F0F0F0;padding:4px;\">" ;
    HTMLcode += CIRCLESformsDISCRETENESSLOCUSdiagramCMDSbar( CIRCLESformsDISCRETENESSLOCUSright_panel_w );
    HTMLcode += "</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td COLSPAN=\"4\" ALIGN=\"center\" VALIGN=\"top\"><DIV ALIGN=\"center\" ID=\"CIRCLESformsDISCRETENESSLOCUSdiagramHIDDENalert\" STYLE=\"position:relative;display:none;\" ID=\"\"></DIV></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</div>" ;

    HTMLcode += "<div class=\"tabbertab\" VALIGN=\"top\" STYLE=\"width:auto;height:auto;\" ID=\"CIRCLESformsDISCRETENESSLOCUS_TAB_02\">" ;
    HTMLcode += "<h2>Calcs</h2>" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F4F4F4;padding:4px;\" ID=\"CIRCLESformsDISCRETENESSLOCUScuspBOXcontainer\">" + CIRCLESformsDISCRETENESSLOCUScuspBOX() + "</td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F4F4F4;padding:4px;\" ID=\"CIRCLESformsDISCRETENESSLOCUScalcBOXcontainer\">" + CIRCLESformsDISCRETENESSLOCUScalcBOX() + "</td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</div>" ;

    HTMLcode += "<div class=\"tabbertab\" VALIGN=\"top\" STYLE=\"width:auto;height:auto;\" ID=\"CIRCLESformsDISCRETENESSLOCUS_TAB_03\">" ;
    HTMLcode += "<h2>Selection list</h2>" ;
    HTMLcode += CIRCLESformsDISCRETENESSLOCUSselectionlistBOX();
    HTMLcode += "</div>" ;
     
    HTMLcode += "<div class=\"tabbertab\" VALIGN=\"top\" STYLE=\"width:auto;height:auto;\" ID=\"CIRCLESformsDISCRETENESSLOCUS_TAB_04\">" ;
    HTMLcode += "<h2>Farey sequence</h2>" ;
    HTMLcode += "<table ID=\"CIRCLESformsDISCRETENESSLOCUSfareysequenceBOXcontainer\">" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F4F4F4;padding:4px;\">"+CIRCLESformsDISCRETENESSLOCUSfareyBOX() + "</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\"><DIV ID=\"CIRCLESformsDISCRETENESSLOCUScustomPARAMScontainer\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F2F2F2;padding:4px;display:none;\">"+CIRCLESformsDISCRETENESSLOCUStraceBOX()+"</DIV></td>" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

    HTMLcode += "<tr>" ;
        
    HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\">" ;
    HTMLcode += "<DIV ID=\"CIRCLESformsDISCRETENESSLOCUSsettingsCONTAINER\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F2F2F2;padding:4px;display:none;\">"

    HTMLcode += "<table>" ;
    HTMLcode += "<tr><td COLSPAN=\"3\" ID=\"CIRCLESformsDISCRETENESSLOCUSsettingsLABEL\" STYLE=\"padding:4px;\"></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" ID=\"CIRCLESformsDISCRETENESSLOCUSsettingsCONTAINER01\"></td></tr>" ;
    HTMLcode += "</table>" ;

    HTMLcode += "</DIV>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "</table>" ;
    HTMLcode += "</div>" ;

    HTMLcode += "<div class=\"tabbertab\" VALIGN=\"top\" STYLE=\"width:auto;height:auto;\" ID=\"CIRCLESformsDISCRETENESSLOCUS_TAB_05\">" ;
    HTMLcode += "<h2>Tunings</h2>" ;
    HTMLcode += CIRCLESformsDISCRETENESSLOCUStuningsBOX();
    HTMLcode += "</div>" ;

    HTMLcode += "<div class=\"tabbertab\" VALIGN=\"top\" STYLE=\"width:auto;height:auto;\" ID=\"CIRCLESformsDISCRETENESSLOCUS_TAB_06\">" ;
    HTMLcode += "<h2>Coords</h2>" ;
    HTMLcode += CIRCLESformsDISCRETENESSLOCUScoordsBOX();
    HTMLcode += "</div>" ;

    HTMLcode += "<div class=\"tabbertab\" VALIGN=\"top\" STYLE=\"width:auto;height:auto;\" ID=\"CIRCLESformsDISCRETENESSLOCUS_TAB_07\">" ;
    HTMLcode += "<h2>Misc</h2>" ;
    HTMLcode += "<table ALIGN=\"center\" WIDTH=\"100%\">" ;
    HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
    HTMLcode += "<tr><td ALIGN=\"center\" ID=\"CIRCLESformsDISCRETENESSLOCUSmiscCONTAINER\" STYLE=\"font-size:16pt;color:gray;\">This box could include contents<br>of different type,<br>depending on current panel settings</td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</div>" ;

    HTMLcode += "<div class=\"tabbertab\" VALIGN=\"top\" STYLE=\"width:auto;height:auto;\" ID=\"CIRCLESformsDISCRETENESSLOCUS_TAB_07\">" ;
    HTMLcode += "<h2>Benchmark</h2>" ;
    HTMLcode += "<table ALIGN=\"center\" WIDTH=\"100%\">" ;
    HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    HTMLcode += "<tr><td WIDTH=\"10\"></td><td ID=\"CIRCLESformsDISCRETENESSLOCUSbenchmarkCONTAINER\" STYLE=\"font-size:16pt;color:#D0D0D0;\">This tab includes the benchmarking data after the last discreteness locus computation</td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</div>" ;

    HTMLcode += "</div>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

    HTMLcode += "</table>" ;
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;

    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsDISCRETENESSLOCUScaption, "",
                      [ "CIRCLESformsDISCRETENESSLOCUSnormalize", _div_id, WIDTH, HEIGHT ],
                      [ "CIRCLESformsDISCRETENESSLOCUSminimize", _div_id ],
                      [ "CIRCLESformsDISCRETENESSLOCUSmaximize", _div_id ],
                      _run ? "popup_caption_bk_enabled" : "popup_caption_bk_alert" );
    if ( _move && _div != null ) move_div( _div.id, "LEFT", "TOP" );

    tabberAutomatic( CIRCLESformsDISCRETENESSLOCUStabberOptions, "CIRCLESformsDISCRETENESSLOCUS" );
    var _canvas = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0);
    var _canvas_w = is_html_canvas( _canvas ) ? _canvas.get_width() : 0 ;
    var _canvas_h = is_html_canvas( _canvas ) ? _canvas.get_height() : 0 ;

    if ( _run )
    {
      if ( $("#"+_div_id ).resizable('instance') != undefined )
      $("#"+_div_id).resizable('destroy').resizable(
      {
        start: function( event, ui ) { CIRCLESformsDISCRETENESSLOCUSstartresize( ui.size.width, ui.size.height ) },
        resize: function( event, ui ) { CIRCLESformsDISCRETENESSLOCUSresize( ui.size.width, ui.size.height ); },
        stop: function( event, ui )   { CIRCLESformsDISCRETENESSLOCUSstopresize( ui.size.width, ui.size.height ) }
      } );
      else
      {
        $("#"+_div_id).resizable(
        {
          start: function( event, ui ) { CIRCLESformsDISCRETENESSLOCUSstartresize( ui.size.width, ui.size.height ) },
          resize: function( event, ui ) { CIRCLESformsDISCRETENESSLOCUSresize( ui.size.width, ui.size.height ); },
          stop: function( event, ui )   { CIRCLESformsDISCRETENESSLOCUSstopresize( ui.size.width, ui.size.height ) }
        } );
      }
      $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
    }

    CIRCLESformsDISCRETENESSLOCUSselectionlistUPDATE();
    if ( CIRCLESformsDISCRETENESSLOCUSwork_layer == null )
    {
    	var _hide_bar = WIDTH < 410 || HEIGHT < 400 ;
      var _left_panel_width = WIDTH - CIRCLESformsDISCRETENESSLOCUSright_panel_w - ( _hide_bar ? 0 : 30 );
      $( "#CIRCLESformsDISCRETENESSLOCUSdiagramLEFTPANELcontainer" ).css( "width", _left_panel_width );
    	$( "#CIRCLESformsDISCRETENESSLOCUSleftPANEL" ).css( "width", _left_panel_width );
      $( "#CIRCLESdlocusdiagramCANVAS" ).get(0).set_height( HEIGHT - 212 ) ;
      
      _canvas_w = _canvas.get_width(), _canvas_h = _canvas.get_height();
      CIRCLESformsDISCRETENESSLOCUSwork_layer = document.createElement("div");
      if ( CIRCLESformsDISCRETENESSLOCUSwork_layer != null )
      {
        CIRCLESformsDISCRETENESSLOCUSworkLAYERmanagement( _div_id, YES ) ;
        circles_lib_plugin_dragstart_override_fn = function() { $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).offset( $( "#CIRCLESdlocusdiagramCANVAS" ).offset() ); };
        circles_lib_plugin_drag_override_fn = function() { $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).offset( $( "#CIRCLESdlocusdiagramCANVAS" ).offset() ); };
        POPUPlibMOVEendOVERRIDEfn = function() { $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).offset( $( "#CIRCLESdlocusdiagramCANVAS" ).offset() ); };
   	  }
    }

    //CIRCLESformsDISCRETENESSLOCUSbindCANVASevents();
    CIRCLESformsDISCRETENESSLOCUSfixtraceMANAGER();
    if ( is_html_canvas( _canvas ) )
    {
   		switch( _glob_target_plane )
   		{
 				case D_LOCUS: circles_lib_dlocus_mapper_init( _canvas_w, _canvas_h, YES ); break ;
 				case BIP_BOX: circles_lib_bip_mapper_init( _glob_dlocusLEFT, _glob_dlocusTOP, _glob_dlocusRIGHT, _glob_dlocusBOTTOM ); break ;
				default: break ;
			}

      var _den = 10 ;
      for( var _i = 0 ; _i <= _den ; _i++ ) CIRCLESformsDISCRETENESSLOCUSdisplay_fracs_array.push( _i + "/" + _den );
			CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( [ 2, 8, 1 ], YES );
    }

    $( "[id^=CIRCLESformsDISCRETENESSLOCUS_TAB_]" ).height( HEIGHT - 134 );
    $( "#CIRCLESformsDISCRETENESSLOCUSstartFRAC" ).val( "0/1" );
    $( "#CIRCLESformsDISCRETENESSLOCUSendFRAC" ).val( "1/1" );
	  $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESformsDISCRETENESSLOCUSloadCONFIG ) } ;
}

function CIRCLESformsDISCRETENESSLOCUSworkLAYERmanagement( _div_id, _create, _show )
{
    _create = safe_int( _create, 0 ), _show = safe_int( _show, 0 );
    if ( _create )
    {
        CIRCLESformsDISCRETENESSLOCUSwork_layer.id = "CIRCLESformsDISCRETENESSLOCUSworkLAYER" ;
        CIRCLESformsDISCRETENESSLOCUSwork_layer.position = "absolute" ;
        document.body.appendChild( CIRCLESformsDISCRETENESSLOCUSwork_layer );
    }
     
    if ( _show )
    {
				$( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).css( "display", "block" ) ;
				$( "#CIRCLESdlocusworklayerCANVAS" ).css( "display", "block" ) ;
		}

    var _canvas = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0);
    var _canvas_w = is_html_canvas( _canvas ) ? _canvas.get_width() : 0 ;
    var _canvas_h = is_html_canvas( _canvas ) ? _canvas.get_height() : 0 ;

    $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).width( _canvas_w );
    $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).height( _canvas_h );
    $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).css( "z-index", safe_int( $("#"+_div_id).css( "z-index" ), 1 ) + 1 ) ;
    if ( _create ) $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).html( "<CANVAS ID=\"CIRCLESdlocusworklayerCANVAS\" WIDTH=\""+_canvas_w+"\" HEIGHT=\""+_canvas_w+"\" STYLE=\"width:"+_canvas_w+"px;height:"+_canvas_h+"px;background-color:transparent;\"></CANVAS>" ) ;
    else
    {
        if ( $( "#CIRCLESdlocusworklayerCANVAS" ).get(0) != null )
        {
            if ( !( $( "#CIRCLESdlocusworklayerCANVAS" ).css( "display" ).toLowerCase().strcmp( "none" ) ) )
            $( "#CIRCLESdlocusworklayerCANVAS" ).get(0).set_dims( _canvas_w, _canvas_h );
        }
    }

		if ( _create ) $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).offset( $( "#CIRCLESdlocusdiagramCANVAS" ).offset() );
}

function CIRCLESformsDISCRETENESSLOCUSstartresize( _new_width, _new_height ) {}
function CIRCLESformsDISCRETENESSLOCUSstopresize( _new_width, _new_height )
{
		var _hide_bar = _new_width < 410 || _new_height < 410 ;
    var _left_panel_width = _new_width - CIRCLESformsDISCRETENESSLOCUSright_panel_w - ( _hide_bar ? 0 : 40 );
    $( "#CIRCLESformsDISCRETENESSLOCUSdiagramLEFTPANELcontainer" ).css( "width", _left_panel_width );
		$( "#CIRCLESformsDISCRETENESSLOCUSleftPANEL" ).css( "width", _left_panel_width );
    $( "#CIRCLESdlocusdiagramCANVAS" ).get(0).set_height( _new_height - 212 ) ;

 		var _options = [] ;
 		if ( !$( "#CIRCLESformsDISCRETENESSLOCUSfixregionCHECKBOX" ).prop( "checked" ) ) _options.push( 128 );
 		_options = _options.concat( [ 2, 8, 1, 64, 16, 32 ] );
    CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( _options, YES );

    $( "[id^=CIRCLESformsDISCRETENESSLOCUS_TAB_]" ).height( _new_height - 134 );
		circles_lib_plugin_dispatcher_unicast_message( 'discreteness.locus', "forms", POPUP_DISPATCHER_UNICAST_EVENT_FOCUS );

    CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX_CLICK(NO);
    CIRCLESformsDISCRETENESSLOCUSinitZOOMproc(NO);

    var _canvas_w = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0).get_width();
    var _canvas_h = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0).get_height();
    CIRCLESformsDISCRETENESSLOCUStmpVARS['aspectratio'] = _canvas_w / _canvas_h ;
		if ( _glob_target_plane == D_LOCUS ) circles_lib_dlocus_mapper_init( _canvas_w, _canvas_h, YES );
}

function CIRCLESformsDISCRETENESSLOCUSresize( _new_width, _new_height )
{
    $( "#CIRCLESformsDISCRETENESSLOCUSmasterTABLE" ).css( "width", _new_width );
		var _hide_bar = _new_width < 410 || _new_height < 410 ;
    var _left_panel_width = _new_width - CIRCLESformsDISCRETENESSLOCUSright_panel_w - ( _hide_bar ? 0 : 40 );
    $( "#CIRCLESformsDISCRETENESSLOCUSdiagramCOMMANDSBARcontainer" ).css( "display", _hide_bar ? "none" : "block" );
    
    var _hide_diagram = _new_height < 220 || _new_width < 360 ; 
    if ( _hide_diagram )
		{
		    $( "#CIRCLESformsDLOCUSmsgboxCONTAINER" ).css( "display", "none" );
				$( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).css( "display", "none" );
				$( "#CIRCLESformsDISCRETENESSLOCUSleftPANEL" ).css( "display", "none" );

        $( "#CIRCLESformsDISCRETENESSLOCUSdiagramHIDDENalert" ).css( "display", "block" );
        $( "#CIRCLESformsDISCRETENESSLOCUSdiagramHIDDENalert" ).height( "200px" );
        $( "#CIRCLESformsDISCRETENESSLOCUSdiagramHIDDENalert" ).width( "100%" );
        $( "#CIRCLESformsDISCRETENESSLOCUSdiagramHIDDENalert" ).html( "<SPAN STYLE=\"font-size:14pt;color:#FFCC00;\">This viewport is too small now<br>to display the diagram</SPAN>" );
		}
    else
    {
		    $( "#CIRCLESformsDLOCUSmsgboxCONTAINER" ).css( "display", "block" );
        $( "#CIRCLESformsDISCRETENESSLOCUSdiagramHIDDENalert" ).css( "display", "none" );
    		$( "#CIRCLESformsDISCRETENESSLOCUSleftPANEL" ).css( "display", "block" );
		    $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).css( "display", "block" );
		    $( "#CIRCLESformsDISCRETENESSLOCUSdiagramLEFTPANELcontainer" ).css( "width", _left_panel_width );
		    $( "#CIRCLESformsDISCRETENESSLOCUSleftPANEL" ).css( "width", _left_panel_width );
		}

    $( "#CIRCLESformsDISCRETENESSLOCUSdiagramCOMMANDSBARcontainer" ).css( "width", CIRCLESformsDISCRETENESSLOCUSright_panel_w );
    $( "#CIRCLESformsDISCRETENESSLOCUSrightPANEL" ).css( "width", CIRCLESformsDISCRETENESSLOCUSright_panel_w );

    var _canvas_w = _left_panel_width - 6 ;
    $( "#CIRCLESdlocusdiagramCANVAS" ).get(0).set_width( _canvas_w );
    $( "#CIRCLESdlocusdiagramCANVAS" ).get(0).set_height( _new_height - 212 );

    		_canvas_w = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0).get_width();
    var _canvas_h = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0).get_height();
    
    CIRCLESformsDISCRETENESSLOCUSworkLAYERmanagement( CIRCLESformsDISCRETENESSLOCUSdiv_id, NO ) ;
    CIRCLESformsDISCRETENESSLOCUSbindCANVASevents();

    var _coords_width = _left_panel_width / 2 - 25 ;
    $( "#CIRCLESformsDISCRETENESSLOCUScoordsX" ).width( _coords_width );
    $( "#CIRCLESformsDISCRETENESSLOCUScoordsY" ).width( _coords_width );
    
    $( "[id^=CIRCLESformsDISCRETENESSLOCUS_TAB_]" ).height( _new_height - 134 );

    $("#POPUPdiscretenesslocusDIV_caption_container" ).css( "width", _new_width + "px" );
    $("#POPUPdiscretenesslocusDIV_caption" ).css( "width", _new_width + "px" );

    $( "#CIRCLESformsDISCRETENESSLOCUScheckboxCONTAINER" ).css( "display", _new_width < 410 ? "none" : "block" );
    $( "#CIRCLESformsDISCRETENESSLOCUScombosCONTAINER" ).css( "display", _new_width < 640 ? "none" : "block" );
    $( "#CIRCLESformsDISCRETENESSLOCUSfareysequenceBOXcontainer" ).css( "display", _new_width < 450 ? "none" : "block" );
    
    // calc tab
    $( "#CIRCLESformsDISCRETENESSLOCUScuspBOXcontainer" ).css( "display", _new_width < 520 ? "none" : "block" );
    $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXcontainer" ).css( "display", _new_width < 380 ? "none" : "block" );
    $( "#CIRCLESformsDISCRETENESSLOCUStuningsBOXcontainer" ).css( "display", _new_width < 420 ? "none" : "block" );
}

function CIRCLESformsDISCRETENESSLOCUSsquareresize()
{
		var _canvas_w = $( "#CIRCLESdlocusdiagramCANVAS" ).width() ;
		var _canvas_h = $( "#CIRCLESdlocusdiagramCANVAS" ).height() ;
		var _screen_h = $( window ).height() * 0.6 ;
		var _min_dim = Math.max( _canvas_h, _screen_h ) ; // Math.min( _canvas_w, _canvas_h ) ;
		var _min_dim_w = _min_dim, _min_dim_h = _min_dim ;

				_min_dim_w += 28 ; // border
				_min_dim_h += 26 ; // caption
				_min_dim_h += 26 ; // upper menu
				_min_dim_h += 20 ; // tabs labels
				_min_dim_h += 30 ; // extra height
		var _arr = [] ;
				_arr.push( [ "CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT", "h", 12 ] );
				_arr.push( [ "CIRCLESformsDISCRETENESSLOCUSdiagramCOMMANDSBARcontainer", "w", 12 ] );
				_arr.push( [ "CIRCLESformsDISCRETENESSLOCUSmousecoordsPANEL", "h", 14 ] );
				_arr.push( [ "CIRCLESformsDISCRETENESSLOCUSupperbar", "h", 10 ] );

		$.each( _arr,
						function( _i, _chunk )
						{
								if ( $( "#" + _chunk[0] ).css( "display" ) != "none" )
								{
										if ( _chunk[1] == "w" ) _min_dim_w += safe_int( $( "#" + _chunk[0] ).width(), 0 ) + safe_int( _chunk[2], 0 ) ;	
										else if ( _chunk[1] == "h" ) _min_dim_h += safe_int( $( "#" + _chunk[0] ).height(), 0 ) + safe_int( _chunk[2], 0 ) ;
								}
						}
					);
					
    $( "#" + CIRCLESformsDISCRETENESSLOCUSdiv_id ).width( _min_dim_w ) ;
    $( "#" + CIRCLESformsDISCRETENESSLOCUSdiv_id ).height( _min_dim_h ) ;
		CIRCLESformsDISCRETENESSLOCUSresize( _min_dim_w, _min_dim_h ) ;
    CIRCLESformsDISCRETENESSLOCUSstopresize( _min_dim_w, _min_dim_h ) ;
}

function CIRCLESformsDISCRETENESSLOCUSresetFAREY( _question )
{
    _question = safe_int( _question, YES );
    var _b_go = _question ? confirm( "Reset all params for Farey sequence ?" ) : YES ;
    if ( _b_go )
    {
        $( '#CIRCLESformsDISCRETENESSLOCUSorder' ).val(48);
        $( '#CIRCLESformsDISCRETENESSLOCUSticks' ).val(16);
        $( '#CIRCLESformsDISCRETENESSLOCUSstartFRAC' ).val( "0/1" );
        $( '#CIRCLESformsDISCRETENESSLOCUSendFRAC' ).val( "1/1" );
    }
}

function CIRCLESformsDISCRETENESSLOCUSreset( _question )
{
    _question = safe_int( _question, YES );
    var _b_go = _question ? confirm( "Reset all params and view ?" ) : YES ;
    if ( _b_go )
    {
        CIRCLESformsDISCRETENESSLOCUSresetFAREY( NO );
        $( '#CIRCLESformsDISCRETENESSLOCUSclipboardcopyCHECKBOX' ).prop( "checked", NO );
        $( '#CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX' ).prop( "checked", NO );
        $( '#CIRCLESformsDISCRETENESSLOCUSrescaleCHECKBOX' ).prop( "checked", YES );
        
        $( "#CIRCLESformsDISCRETENESSLOCUSfixregionCHECKBOX" ).prop( "checked", false );
        
        var _canvas_w = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0).get_width();
        var _canvas_h = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0).get_height();

        _glob_dlocusLEFT = -DEFAULT_PLANE_COORD ;
        _glob_dlocusRIGHT = DEFAULT_PLANE_COORD ;
        _glob_dlocusTOP = DEFAULT_PLANE_COORD ;
        _glob_dlocusBOTTOM = -DEFAULT_PLANE_COORD ;
        
        CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch = MOUSE_NO_PROC_ID ;
		    CIRCLESformsDISCRETENESSLOCUSworkLAYERmanagement( CIRCLESformsDISCRETENESSLOCUSdiv_id, NO ) ;
				CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX_CLICK( NO ) ;
				CIRCLESformsDISCRETENESSLOCUSinitZOOMproc( NO ) ;

        CIRCLESformsDISCRETENESSLOCUSdisplayBOUNDARYcoords();
        
        circles_lib_canvas_clean( $( "#CIRCLESdlocusdiagramCANVAS" ).get(0) );
        if ( _glob_target_plane == D_LOCUS )
				circles_lib_dlocus_mapper_init( _canvas_w, _canvas_h, YES );
        else if ( _glob_target_plane == BIP_BOX )
				circles_lib_bip_mapper_init( _glob_dlocusLEFT, _glob_dlocusTOP, _glob_dlocusRIGHT, _glob_dlocusBOTTOM );

        CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( [ 8, 1, 2, 16, 32 ] );
    }
}

function CIRCLESformsDISCRETENESSLOCUScustomPARAMSget()
{
    var _starting_trace = circles_lib_math_parse_formula( $( "#CIRCLESformsDISCRETENESSLOCUStraceSTART" ).val() );
        _starting_trace = parse_complex_from_string( _starting_trace + "" );
    var _tr_A = circles_lib_math_parse_formula( $( "#CIRCLESformsDISCRETENESSLOCUStraceA" ).val() );
        _tr_A = parse_complex_from_string( _tr_A + "" );
    var _tr_B = circles_lib_math_parse_formula( $( "#CIRCLESformsDISCRETENESSLOCUStraceB" ).val() );
        _tr_B = parse_complex_from_string( _tr_B + "" );
    var _tr_ABab = circles_lib_math_parse_formula( $( "#CIRCLESformsDISCRETENESSLOCUStraceCOMMUTATOR" ).val() );
        _tr_ABab = parse_complex_from_string( _tr_ABab + "" );
    var _eq_solution = circles_lib_math_parse_formula( $( "#CIRCLESformsDISCRETENESSLOCUSeqSOLUTION" ).val() );
        _eq_solution = parse_complex_from_string( _eq_solution + "" );
    return [ _starting_trace, _tr_A, _tr_B, _tr_ABab, _eq_solution ] ;
}

function CIRCLESformsDISCRETENESSLOCUScustomPARAMSset( _silent )
{
		_silent = safe_int( _silent, NO );
		var _custom_params = CIRCLESformsDISCRETENESSLOCUScustomPARAMSget()
    if ( is_complex( _custom_params[0] ) && is_complex( _custom_params[1] ) &&
         is_complex( _custom_params[2] ) && is_complex( _custom_params[3] ) )
    {
        var _startINDEX = 0 ;
        CIRCLESformsDISCRETENESSLOCUSstarting_value = _custom_params[_startINDEX] ;
            _startINDEX++ ;
        CIRCLESformsDISCRETENESSLOCUStr_A = _custom_params[_startINDEX] ;
            _startINDEX++ ;
        CIRCLESformsDISCRETENESSLOCUStr_B = _custom_params[_startINDEX] ;
            _startINDEX++ ;
        CIRCLESformsDISCRETENESSLOCUStr_ABab = _custom_params[_startINDEX] ;
            _startINDEX++ ;
        CIRCLESformsDISCRETENESSLOCUSeq_solution = _custom_params[_startINDEX] ;
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Params have been set up with success", "CIRCLESformsDLOCUSoutMSG" ) ;
        return YES ;
    }
    else
    {
				circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't set up custom params: all params must be complex", "CIRCLESformsDLOCUSoutMSG" ) ;
				return NO ;
		}
}

function CIRCLESformsDISCRETENESSLOCUSdisplayPARAMS()
{
    var _starting_trace = CIRCLESformsDISCRETENESSLOCUSstarting_value != null ? CIRCLESformsDISCRETENESSLOCUSstarting_value.formula() : "0" ;
    var _tr_A = CIRCLESformsDISCRETENESSLOCUStr_A != null ? CIRCLESformsDISCRETENESSLOCUStr_A.formula() : "0" ;
    var _tr_B = CIRCLESformsDISCRETENESSLOCUStr_B != null ? CIRCLESformsDISCRETENESSLOCUStr_B.formula() : "0" ;
    var _tr_ABab = CIRCLESformsDISCRETENESSLOCUStr_ABab != null ? CIRCLESformsDISCRETENESSLOCUStr_ABab.formula() : "-2" ;
    var _eq_solution = CIRCLESformsDISCRETENESSLOCUSeq_solution != null ? CIRCLESformsDISCRETENESSLOCUSeq_solution.formula() : "0" ;
    $( "#CIRCLESformsDISCRETENESSLOCUStraceSTART" ).val( _starting_trace );
    $( "#CIRCLESformsDISCRETENESSLOCUStraceA" ).val( _tr_A );
    $( "#CIRCLESformsDISCRETENESSLOCUStraceB" ).val( _tr_B );
    $( "#CIRCLESformsDISCRETENESSLOCUStraceCOMMUTATOR" ).val( _tr_ABab );
    $( "#CIRCLESformsDISCRETENESSLOCUSeqSOLUTION" ).val( _eq_solution );
}

function CIRCLESformsDISCRETENESSLOCUScomputeSETTINGS( _settings_chunk )
{
    var _chunk_selection = $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).val();
    var _init_mode = _chunk_selection.includes( "@" ) ? safe_int( ( _chunk_selection.split( "@" ) )[0], _DLOCUS_NONE ) : _DLOCUS_NONE ;
    if ( _init_mode != DISCRETENESS_LOCUS_NONE )
    {
        var _tmp_discreteness_locus = new discreteness_locus();
            _tmp_discreteness_locus.set_init_mode( _init_mode );
        var _settingsARRAY = _settings_chunk.includes( "|" ) ? _settings_chunk.split( "|" ) : [ 0, 0, 0, -2, 0 ];
        var _startINDEX = 0 ;
        CIRCLESformsDISCRETENESSLOCUSstarting_value = parse_complex_from_string( circles_lib_math_parse_formula( _settingsARRAY[_startINDEX] ) );
            _startINDEX++ ;
        CIRCLESformsDISCRETENESSLOCUStr_A = parse_complex_from_string( circles_lib_math_parse_formula( _settingsARRAY[_startINDEX] ) );
            _startINDEX++ ;
        CIRCLESformsDISCRETENESSLOCUStr_B = parse_complex_from_string( circles_lib_math_parse_formula( _settingsARRAY[_startINDEX] ) );
            _startINDEX++ ;
        CIRCLESformsDISCRETENESSLOCUStr_ABab = parse_complex_from_string( circles_lib_math_parse_formula( _settingsARRAY[_startINDEX] ) );
            _startINDEX++ ;
        CIRCLESformsDISCRETENESSLOCUSeq_solution = parse_complex_from_string( circles_lib_math_parse_formula( _settingsARRAY[_startINDEX] ) );
        CIRCLESformsDISCRETENESSLOCUSdisplayPARAMS();
    }
}

function CIRCLESformsDISCRETENESSLOCUSembeddingCOMBOCHANGE()
{
    var _tmp_discreteness_locus = new discreteness_locus();
    var _chunk_selection = $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).val();
    var _init_mode = _chunk_selection.includes( "@" ) ? safe_int( ( _chunk_selection.split( "@" ) )[0], _DLOCUS_NONE ) : _DLOCUS_NONE ;
    var _trace_transform = _chunk_selection.includes( "@" ) ? safe_string( ( _chunk_selection.split( "@" ) )[1], "%mu%" ) : "%mu%" ;
    $( "#CIRCLESformsDISCRETENESSLOCUStraceTRANSFORMformula" ).val( _trace_transform );

    CIRCLESformsDISCRETENESSLOCUSdisplayPARAMS();

    var _presets = _tmp_discreteness_locus.get_preset( _init_mode );
    if ( _presets != null )
    {
				 if ( is_array( _presets ) )
				 {
              var _startINDEX = 0 ;
					    if ( _presets[_startINDEX] != null ) $( "#CIRCLESformsDISCRETENESSLOCUStraceSTART" ).val( _presets[_startINDEX].formula() );
              _startINDEX++ ;
					    if ( _presets[_startINDEX] != null ) $( "#CIRCLESformsDISCRETENESSLOCUStraceA" ).val( _presets[_startINDEX].formula() );
              _startINDEX++ ;
					    if ( _presets[_startINDEX] != null ) $( "#CIRCLESformsDISCRETENESSLOCUStraceB" ).val( _presets[_startINDEX].formula() );
              _startINDEX++ ;
					    if ( _presets[_startINDEX] != null ) $( "#CIRCLESformsDISCRETENESSLOCUStraceCOMMUTATOR" ).val( _presets[_startINDEX].formula() );
              _startINDEX++ ;
					    if ( _presets[_startINDEX] != null ) $( "#CIRCLESformsDISCRETENESSLOCUSeqSOLUTION" ).val( _presets[_startINDEX].formula() );
				 }
		}
}

function CIRCLESformsDISCRETENESSLOCUSsettingsLABELsSET()
{
    var _chunk_selection = $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).val();
    var _init_mode = _chunk_selection.includes( "@" ) ? safe_int( ( _chunk_selection.split( "@" ) )[0], _DLOCUS_NONE ) : _DLOCUS_NONE ;
    $( "#CIRCLESformsDISCRETENESSLOCUScustomPARAMScontainer" ).css( "display", _init_mode.is_one_of( _DLOCUS_MASKIT, _DLOCUS_GRANDMA, _DLOCUS_EARLE, _DLOCUS_JORGENSEN ) ? "block" : "none" );
    $( "#CIRCLESformsDISCRETENESSLOCUSsettingsCONTAINER" ).css( "display", _init_mode.is_one_of( _DLOCUS_MASKIT, _DLOCUS_GRANDMA, _DLOCUS_EARLE, _DLOCUS_JORGENSEN ) ? "block" : "none" );
    if ( _init_mode.is_one_of( _DLOCUS_MASKIT, _DLOCUS_GRANDMA, _DLOCUS_EARLE ) )
    {
    		 if ( _init_mode == _DLOCUS_GRANDMA )
         $( "#CIRCLESformsDISCRETENESSLOCUSsettingsLABEL" ).html( "Grandma's embedding params" );
    		 else if ( _init_mode == _DLOCUS_MASKIT )
         $( "#CIRCLESformsDISCRETENESSLOCUSsettingsLABEL" ).html( "Maskit embedding params" );
    		 else if ( _init_mode == _DLOCUS_EARLE )
         $( "#CIRCLESformsDISCRETENESSLOCUSsettingsLABEL" ).html( "Earle embedding params" );
         
         var COMBOcode = "<SELECT ONCHANGE=\"javascript:CIRCLESformsDISCRETENESSLOCUScomputeSETTINGS( this.value );\">" ;
             COMBOcode += "<OPTION VALUE=\"\">(choose a preset)" ;
             if ( _init_mode.is_one_of( _DLOCUS_MASKIT ) )
             {
		             COMBOcode += "<OPTION VALUE=\"2.0|2.0|2.0|-2.0|2.0\">#2" ;
             }
             else if ( _init_mode.is_one_of( _DLOCUS_GRANDMA ) )
             {
		             COMBOcode += "<OPTION VALUE=\"2.0|2.0|1.91+0.05i|-2.0|2.0\">#1" ;
		             COMBOcode += "<OPTION VALUE=\"2.0|2.0|2.0|-2.0|2.0\">#2" ;
		             COMBOcode += "<OPTION VALUE=\"2.0|2.0|2+2i|-2.0|2.0\">#3" ;
		             COMBOcode += "<OPTION VALUE=\"3.0001|3.0001|3.0001|-2.0|3.0001\">#4" ;
						 }
             else if ( _init_mode.is_one_of( _DLOCUS_EARLE ) )
             {
		             COMBOcode += "<OPTION VALUE=\"2.0|2.0|2.0|-2.0|2.0\">#2" ;
             }
             COMBOcode += "</SELECT>" ;

         var FIXTRACECOMBOcode = "<SELECT ID=\"FIXTRACECOMBO\" ONCHANGE=\"javascript:CIRCLESformsDISCRETENESSLOCUSfixtraceMANAGER();\">" ;
             FIXTRACECOMBOcode += "<OPTION "+( CIRCLESformsDISCRETENESSLOCUStrace_fix_op == _DLOCUS_TRACE_FIX_DEFAULT_OP ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+_DLOCUS_TRACE_FIX_DEFAULT_OP+"\">Default behavior (no fix)" ;
             if ( !_init_mode.is_one_of( _DLOCUS_MASKIT, _DLOCUS_EARLE ) )
             FIXTRACECOMBOcode += "<OPTION "+( CIRCLESformsDISCRETENESSLOCUStrace_fix_op == _DLOCUS_TRACE_FIX_A_OP ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+_DLOCUS_TRACE_FIX_A_OP+"\">Fix trace A" ;
             FIXTRACECOMBOcode += "<OPTION "+( CIRCLESformsDISCRETENESSLOCUStrace_fix_op == _DLOCUS_TRACE_FIX_B_OP ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+_DLOCUS_TRACE_FIX_B_OP+"\">Fix trace B" ;
             FIXTRACECOMBOcode += "<OPTION "+( CIRCLESformsDISCRETENESSLOCUStrace_fix_op == _DLOCUS_TRACE_FIX_ABab_OP ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+_DLOCUS_TRACE_FIX_ABab_OP+"\">Fix trace ABab" ;
             FIXTRACECOMBOcode += "</SELECT>" ;

         $( "#CIRCLESformsDISCRETENESSLOCUSsettingsCONTAINER01" ).html( "<table><tr><td>Presets</td><td WIDTH=\"5\"></td><td>"+COMBOcode+"</td></tr><tr><td HEIGHT=\"4\"></td></tr><tr><td>Trace fix</td><td WIDTH=\"5\"></td><td>"+FIXTRACECOMBOcode+"</td></tr></table>" );
         $( "[id^=CIRCLESformsDISCRETENESSLOCUSsetting]" ).val('0');
    }
    else if ( _init_mode == _DLOCUS_JORGENSEN )
    {
         $( "#CIRCLESformsDISCRETENESSLOCUSsettingsLABEL" ).html( "Jorgensen's embedding params" );
         var COMBOcode = "<SELECT ONCHANGE=\"javascript:CIRCLESformsDISCRETENESSLOCUScomputeSETTINGS( this.value );\">" ;
             COMBOcode += "<OPTION VALUE=\"\">(choose a preset)" ;
             COMBOcode += "<OPTION VALUE=\"2.0|2.0|2.0|-2.0|2.0\">#1" ;
             COMBOcode += "<OPTION VALUE=\"2.0|2.0|2+2i|-2.0|2.0\">#2" ;
             COMBOcode += "<OPTION VALUE=\"2.0|2.0|3|-2.0|2.0\">#3" ;
             COMBOcode += "<OPTION VALUE=\"2.0+i|2.0+i|2.0+i|-2.0|2.0\">#4" ;
             COMBOcode += "<OPTION VALUE=\"2.0+i|2.0+i|3|-2.0|2.0\">#5" ;
             COMBOcode += "</SELECT>" ;

         var FIXTRACECOMBOcode = "<SELECT ID=\"FIXTRACECOMBO\" ONCHANGE=\"javascript:CIRCLESformsDISCRETENESSLOCUSfixtraceMANAGER();\">" ;
             FIXTRACECOMBOcode += "<OPTION "+( CIRCLESformsDISCRETENESSLOCUStrace_fix_op == _DLOCUS_TRACE_FIX_DEFAULT_OP ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+UNDET+"\">Default behavior (no fix)" ;
             FIXTRACECOMBOcode += "<OPTION "+( CIRCLESformsDISCRETENESSLOCUStrace_fix_op == _DLOCUS_TRACE_FIX_A_OP ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+_DLOCUS_TRACE_FIX_A_OP+"\">Fix trace A" ;
             FIXTRACECOMBOcode += "<OPTION "+( CIRCLESformsDISCRETENESSLOCUStrace_fix_op == _DLOCUS_TRACE_FIX_B_OP ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+_DLOCUS_TRACE_FIX_B_OP+"\">Fix trace B" ;
             FIXTRACECOMBOcode += "<OPTION "+( CIRCLESformsDISCRETENESSLOCUStrace_fix_op == _DLOCUS_TRACE_FIX_ABab_OP ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+_DLOCUS_TRACE_FIX_ABab_OP+"\">Fix trace ABab" ;
             FIXTRACECOMBOcode += "</SELECT>" ;

         $( "#CIRCLESformsDISCRETENESSLOCUSsettingsCONTAINER01" ).html( "<table><tr><td>"+COMBOcode+"</td></tr><tr><td HEIGHT=\"4\"></td></tr><tr><td>"+FIXTRACECOMBOcode+"</td></tr></table>" );
         $( "[id^=CIRCLESformsDISCRETENESSLOCUSsetting]" ).val('0');
    }
}

function CIRCLESformsDISCRETENESSLOCUSfixtraceMANAGER()
{
		CIRCLESformsDISCRETENESSLOCUStrace_fix_op = safe_int( $('#FIXTRACECOMBO option:selected').val(), _DLOCUS_TRACE_FIX_DEFAULT_OP );
		switch( CIRCLESformsDISCRETENESSLOCUStrace_fix_op )
		{
				case _DLOCUS_TRACE_FIX_DEFAULT_OP:
				$( "#CIRCLESformsDISCRETENESSLOCUStracefixLABEL" ).css( "color", "#B0B0B0" );
				$( "#CIRCLESformsDISCRETENESSLOCUStracefixLABEL" ).html( "No trace fixed" );
				break ;
				case _DLOCUS_TRACE_FIX_A_OP:
				$( "#CIRCLESformsDISCRETENESSLOCUStracefixLABEL" ).css( "color", "#5393CD" );
				$( "#CIRCLESformsDISCRETENESSLOCUStracefixLABEL" ).html( "Fixed trace A" );
				break ;
				case _DLOCUS_TRACE_FIX_B_OP:
				$( "#CIRCLESformsDISCRETENESSLOCUStracefixLABEL" ).css( "color", "#B17E9A" );
				$( "#CIRCLESformsDISCRETENESSLOCUStracefixLABEL" ).html( "Fixed trace B" );
				break ;
				case _DLOCUS_TRACE_FIX_ABab_OP:
				$( "#CIRCLESformsDISCRETENESSLOCUStracefixLABEL" ).css( "color", "#F4AE5B" );
				$( "#CIRCLESformsDISCRETENESSLOCUStracefixLABEL" ).html( "Fixed trace ABab" );
				break ;
				default:
				$( "#CIRCLESformsDISCRETENESSLOCUStracefixLABEL" ).css( "color", "#B0B0B0" );
				$( "#CIRCLESformsDISCRETENESSLOCUStracefixLABEL" ).html( "No trace fixed" );
				break ;
		}
}

function CIRCLESformsDISCRETENESSLOCUSpopupPROCESSstart( _process_type, _embedding )
{
    _embedding = safe_string( _embedding, "" );
    _embedding = safe_size( _embedding, 0 ) == 0 ? $( '#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected' ).text() : _embedding ;

    var _label_array = [] ; 
    var _pl_rays_flag = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    var _pl_rays_positive = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayspositiveCHECKBOX" ).prop( "checked" ) ? YES : NO ;
        if ( _pl_rays_positive ) _label_array.push( "positive" );
    var _pl_rays_negative = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysnegativeCHECKBOX" ).prop( "checked" ) ? YES : NO ;
        if ( _pl_rays_negative ) _label_array.push( "negative" );
    var HTMLcode = "<table ALIGN=\"center\">" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        if ( _process_type.stricmp( "dlocus" ) )
        {
            HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;\">COMPUTING THE DISCRETENESS LOCUS<br>IN THE "+_embedding.toUpperCase()+" EMBEDDING</td></tr>" ;
						if ( _pl_rays_flag )
            HTMLcode += "<tr><td ALIGN=\"center\">(including "+_label_array.join( " and " )+" pleating rays)</td></tr>" ;
				}
        else if ( _process_type.stricmp( "cusp" ) )
            HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;\">COMPUTING TRACE FOR CUSP "+ $( "#CIRCLESformsDISCRETENESSLOCUScuspFRAC" ).val() +"<br>IN THE "+_embedding.toUpperCase()+"</td></tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"font-size:10pt;\" ID=\"CIRCLESformsDISCRETENESSLOCUSsplashTEXT\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\"><table><tr><td CLASS=\"link_rounded\" WIDTH=\"120\" STYLE=\"padding:6px;font-size:12pt;\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYstop();\">Stop process</td></tr></table></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "</table>" ;

		var HEIGHT = "auto" ;
    SPLASHanimated( HTMLcode, YES, 560, HEIGHT, 24, 140 );
}

function CIRCLESformsDISCRETENESSLOCUSpopupPROCESSupdateTEXT( _text, _features )
{
    if ( is_string( _text ) )
    $( "#CIRCLESformsDISCRETENESSLOCUSsplashTEXT" ).html( _text.replaceAll( " ", "&nbsp;" ).replaceAll( "\n", "<br>" ) );
}

function CIRCLESformsDISCRETENESSLOCUSstoreRAYS( _rays_array )
{
		CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array = CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array.concat( _rays_array );
}

function CIRCLESformsDISCRETENESSLOCUScomputeCUSPupdateTEXT( _text, _pq_word, _features, _fill, _init, _out_channel )
{
    _fill = safe_int( _fill, NO ), _init = safe_int( _init, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _transform_map = ( $( "#CIRCLESformsDISCRETENESSLOCUStraceTRANSFORMformula" ).val() + "" ).trim();
        if ( _transform_map.length == 0 ) _transform_map = "%mu%" ;
        _transform_map = _transform_map.replaceAll( "%mu%", "("+_text+")" );

    var _ret_trace = circles_lib_math_parse_formula( _transform_map );
        _ret_trace = parse_complex_from_string( _ret_trace + "" );
    if ( is_string( _text ) ) $( "#CIRCLESformsDISCRETENESSLOCUScuspVALUE" ).val( _ret_trace.formula() );
    if ( is_string( _pq_word ) ) $( "#CIRCLESformsDISCRETENESSLOCUScuspWORD" ).val( _pq_word );

    var _pl_rays_flag = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    
    if ( _pl_rays_flag )
    {
         var _tmp_discreteness_locus = new discreteness_locus();
         var _pq_farey = new farey( $( "#CIRCLESformsDISCRETENESSLOCUScuspFRAC" ).val() );
         var _bounding_rect = new rect( _glob_dlocusLEFT, _glob_dlocusTOP, _glob_dlocusRIGHT, _glob_dlocusBOTTOM, _RECT_ORIENTATION_CARTESIAN );
         var _pl_rays_keepgoing = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayskeepgoingCHECKBOX" ).prop( "checked" ) ? YES : NO ;
         var _pl_rays_correction = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayscorrectionCHECKBOX" ).prop( "checked" ) ? YES : NO ;
     		 var _pl_rays_max_steps = safe_int( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITmaxsteps" ).val(), _tmp_discreteness_locus.get_pleating_rays_max_iterate() );
     		 		 _pl_rays_max_steps = Math.max( _pl_rays_max_steps, _tmp_discreteness_locus.get_pleating_rays_max_iterate() );
    		 var _pl_rays_step_rate = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITsteprate" ).val(), _tmp_discreteness_locus.get_pleating_rays_step_rate() );
    		 var _pl_rays_threshold_accuracy = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITaccuracy" ).val(), _tmp_discreteness_locus.get_pleating_rays_threshold_accuracy() );
    		 var _pl_rays_forward_factor = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITforwardfactor" ).val(), _tmp_discreteness_locus.get_pleating_rays_forward_factor() );
    		 var _pl_rays_backward_factor = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITbackwardfactor" ).val(), _tmp_discreteness_locus.get_pleating_rays_backward_factor() );

         var _eq_solution = circles_lib_math_parse_formula( $( "#CIRCLESformsDISCRETENESSLOCUSeqSOLUTION" ).val() );
             _eq_solution = parse_complex_from_string( _eq_solution + "" );
    
         var _pl_ray_orbit = _tmp_discreteness_locus.pleating_positive_ray( _pq_farey, _ret_trace,
                                                                 _eq_solution,
                                                                 _pl_rays_max_steps,
                                                                 _bounding_rect, null,
                                                                 _pl_rays_keepgoing, _pl_rays_correction );
         if ( safe_size( _pl_ray_orbit, 0 ) > 0 )
         CIRCLESformsDISCRETENESSLOCUScomputeCUSPupdatePLEATINGrayORBITlist( $( "#CIRCLESformsDISCRETENESSLOCUScuspFRAC" ).val(), _pl_ray_orbit );
    }

    if ( _fill )
    {
        var _ret_fill = GLOB_PLUGIN_PARAMS_FILLER( _ret_trace, NO );
        if ( _ret_fill == NO && _out_channel == OUTPUT_TERMINAL )
        circles_lib_terminal_warning_echo( "Can't fill: no plug-in activated yet" );
    }
    if ( _init )
    {
        var _ret_init = GLOB_PLUGIN_PARAMS_FILLER( _ret_trace, YES );
        if ( _ret_init == NO && _out_channel == OUTPUT_TERMINAL )
        circles_lib_terminal_warning_echo( "Can't init: no plug-in activated yet" );
    }
}

function CIRCLESformsDISCRETENESSLOCUSdisplayBOUNDARYcoords()
{
    $( "#CIRCLESformsDISCRETENESSLOCUSregionCOORDSleft" ).html( _glob_dlocusLEFT );
    $( "#CIRCLESformsDISCRETENESSLOCUSregionCOORDSright" ).html( _glob_dlocusRIGHT );
    $( "#CIRCLESformsDISCRETENESSLOCUSregionCOORDStop" ).html( _glob_dlocusTOP );
    $( "#CIRCLESformsDISCRETENESSLOCUSregionCOORDSbottom" ).html( _glob_dlocusBOTTOM );
}

function CIRCLESformsDISCRETENESSLOCUScuspCOMBO()
{
    var _keys = CIRCLESformsDISCRETENESSLOCUSoriginal_fracs_pts_array.keys_associative();
    var _n_cusp = safe_size( _keys, 0 );
    if ( _n_cusp > 0 )
    {
       var HTMLcode = "<SELECT ID=\"CIRCLESformsDISCRETENESSLOCUScuspCOMBO\" ONCHANGE=\"javascript:CIRCLESformsDISCRETENESSLOCUScuspCOMBOonchange();\">" ;
           HTMLcode += "<OPTION SELECTED=\"selected\" VALUE=\"\">" ;
           $.each( _keys, function( _i, _k ) { HTMLcode += "<OPTION VALUE=\""+CIRCLESformsDISCRETENESSLOCUSoriginal_fracs_pts_array[_k].formula()+"\">" + _k ; } );
           HTMLcode += "</SELECT>" ;
       $( "#CIRCLESformsDISCRETENESSLOCUScuspcomboCONTAINER" ).html( HTMLcode );
    }
    else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Build combo with current cusps", "CIRCLESformsDLOCUSoutMSG" ) ;
}

function CIRCLESformsDISCRETENESSLOCUScuspCOMBOonchange()
{
    var _cusp_frac = $( "#CIRCLESformsDISCRETENESSLOCUScuspCOMBO option:selected" ).text();
    var _cusp_value = $( "#CIRCLESformsDISCRETENESSLOCUScuspCOMBO option:selected" ).val();
        $( "#CIRCLESformsDISCRETENESSLOCUScuspFRAC" ).val( _cusp_frac );
        $( "#CIRCLESformsDISCRETENESSLOCUScuspVALUE" ).val( _cusp_value );
    var _farey_frac = new farey( _cusp_frac );
    var PQword = circles_lib_word_pq_translate( _farey_frac.p, _farey_frac.q );
        $( "#CIRCLESformsDISCRETENESSLOCUScuspWORD" ).val( PQword );
}

function CIRCLESformsDISCRETENESSLOCUSfareyCOPY( _question, _silent )
{
    _question = safe_int( _question, YES );
    _silent = safe_int( _silent, NO );
    var _old_n_farey = safe_size( CIRCLESformsDISCRETENESSLOCUSpq_fracs_array, 0 ), _ret_id = 0, _ret_msg = "" ;
    if ( _old_n_farey > 0 )
    {
         var _b_go = _question ? confirm( "Confirm to copy the current Farey sequence into storage space ?" ) : YES ;
         if ( _b_go )
         {
             _glob_storage["farey"] = CIRCLESformsDISCRETENESSLOCUSpq_fracs_array.clone();
             _new_n_farey = safe_size( _glob_storage["farey"], 0 );
             if ( _new_n_farey == _old_n_farey )
             {
                  circles_lib_plugin_dispatcher_unicast_message( "storage.space", "forms", 1.0 );
                  _ret_id = RET_OK ;
                  _ret_msg = "The current Farey sequence has been properly copied into 'farey' subset of storage space" ;
                  if ( !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, _ret_msg, "CIRCLESformsDLOCUSoutMSG" ) ;
                  return [ _ret_id, _ret_msg ] ;
             }
             else
             {
                  _ret_id = RET_WARNING ;
                  _ret_msg = "Problems while trying to copy the current Farey sequence into storage space" + _glob_crlf.repeat(2) + "Please, retry" ;
                  if ( !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _ret_msg, "CIRCLESformsDLOCUSoutMSG" ) ; 
                  return [ _ret_id, _ret_msg ] ;
             }
         }
    }
    else
    {
         _ret_id = RET_WARNING ;
         _ret_msg = "The current Farey sequence is empty" ;
         if ( !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _ret_msg, "CIRCLESformsDLOCUSoutMSG" ) ;
         return [ _ret_id, _ret_msg ] ;
    }
}

function CIRCLESformsDISCRETENESSLOCUSsaveCOMBOonchange()
{
    var _sel_index = safe_int( $( "#CIRCLESformsDISCRETENESSLOCUSsaveCOMBO" ).val(), 0 );
    switch( _sel_index )
    {
       case 1:
       CIRCLESformsDISCRETENESSLOCUSsaveCOORDS(NO);
       break ;
       case 2:
       circles_lib_files_pix_save(D_LOCUS,$('#CIRCLESdlocusdiagramCANVAS').get(0),'circles.discreteness.locus.png');
       break ;
       case 3:
       CIRCLESformsDISCRETENESSLOCUSsaveEPSask(NO);
       break ;
       case 4:
       CIRCLESformsDISCRETENESSLOCUSsaveCOORDS(YES);
       break ;
       default: break ;
    }
}

function CIRCLESformsDISCRETENESSLOCUScopyCOMBOonchange()
{
    var _sel_index = safe_int( $( "#CIRCLESformsDISCRETENESSLOCUScopyCOMBO" ).val(), 0 );
    switch( _sel_index )
    {
          case 1: // copy discreteness locus complex points into storage space
          var _mask = safe_size( CIRCLESformsDISCRETENESSLOCUScomplex_pts_array, 0 ) > 0 ? 1 : 0 ;
          if ( _mask & 1 )
          {
							 if ( _glob_storage['complex'] != null ) _glob_storage['complex'] = [] ;
							 _glob_storage['complex'] = CIRCLESformsDISCRETENESSLOCUScomplex_pts_array.clone();
               circles_lib_plugin_dispatcher_unicast_message( "storage.space", "forms", 1.0 );
					}
					else
					{
							 var _msg = "Can't copy the discreteness locus points to storage space: no embedding has been computed" ;
							 circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "CIRCLESformsDLOCUSoutMSG" ) ;
					}
          break ;
          case 2: // copy farey sequence into storage space
          var _mask = safe_size( CIRCLESformsDISCRETENESSLOCUSpq_fracs_array, 0 ) > 0 ? 1 : 0 ;
          if ( _mask & 1 )
          {
							 if ( _glob_storage['farey'] != null ) _glob_storage['farey'] = [] ;
							 _glob_storage['farey'] = CIRCLESformsDISCRETENESSLOCUSpq_fracs_array.clone();
               circles_lib_plugin_dispatcher_unicast_message( "storage.space", "forms", 1.0 );
					}
					else
					{
							 var _msg = "Can't copy the discreteness locus points to storage space: no embedding has been computed" ;
							 circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "CIRCLESformsDLOCUSoutMSG" ) ;
					}
          break ;
          case 3: // copy both discreteness complex points and farey sequence into storage space (PACKED)
          var _mask  = safe_size( CIRCLESformsDISCRETENESSLOCUScomplex_pts_array, 0 ) > 0 ? 1 : 0 ;
          		_mask |= safe_size( CIRCLESformsDISCRETENESSLOCUSpq_fracs_array, 0 ) > 0 ? 2 : 0 ;
          if ( _mask & 1 )
          {
							 if ( _glob_storage['complex'] != null ) _glob_storage['complex'] = [] ;
							 _glob_storage['complex'] = CIRCLESformsDISCRETENESSLOCUScomplex_pts_array.clone();
               circles_lib_plugin_dispatcher_unicast_message( "storage.space", "forms", 1.0 );
					}

          if ( _mask & 2 )
          {
							 if ( _glob_storage['farey'] != null ) _glob_storage['farey'] = [] ;
							 _glob_storage['farey'] = CIRCLESformsDISCRETENESSLOCUSpq_fracs_array.clone();
               circles_lib_plugin_dispatcher_unicast_message( "storage.space", "forms", 1.0 );
					}

					if ( _mask != ( 1 | 2 ) )
					{
							 var _msg = "Storage space copy report" + _glob_crlf ;
							 		 _msg += "* Discreteness locus points have "+( _mask & 1 ? "" : "not" )+" been copied into storage space" ;
							 		 _msg += "* Farey sequence have "+( _mask & 2 ? "" : "not" )+" been copied into storage space" ;
							 circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
					}
          break ;
          default: break ;
    }
}

function CIRCLESformsDISCRETENESSLOCUSfareyRESTORE( _question, _silent )
{
    _question = safe_int( _question, YES );
    _silent = safe_int( _silent, NO );
    var _old_n_farey = safe_size( _glob_storage["farey"], 0 ), _ret_id = 0, _ret_msg = "" ;
    if ( _old_n_farey > 0 )
    {
       var _b_go = _question ? confirm( "Confirm to restore the Farey sequence from storage space ?" ) : YES ;
       if ( _b_go )
       {
           CIRCLESformsDISCRETENESSLOCUSpq_fracs_array = _glob_storage["farey"].clone();
           _new_n_farey = safe_size( CIRCLESformsDISCRETENESSLOCUSpq_fracs_array, 0 );
           if ( _new_n_farey == _old_n_farey )
           {
              var _start = CIRCLESformsDISCRETENESSLOCUSpq_fracs_array[0] ;
              var _end = CIRCLESformsDISCRETENESSLOCUSpq_fracs_array.get_last();
              if ( $( "#CIRCLESformsDISCRETENESSLOCUSstartFRAC" ).get(0) != null ) $( "#CIRCLESformsDISCRETENESSLOCUSstartFRAC" ).val( _start.output( "std", "/" ) );
              if ( $( "#CIRCLESformsDISCRETENESSLOCUSendFRAC" ).get(0) != null ) $( "#CIRCLESformsDISCRETENESSLOCUSendFRAC" ).val( _end.output( "std", "/" ) );
              CIRCLESformsDISCRETENESSLOCUSfractionsCORRECT();
              _ret_id = RET_OK ;
              _ret_msg = "The current Farey sequence has been properly restored from 'farey' subset of storage space into the discreteness locus form" ;
				  		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, _ret_msg, "CIRCLESformsDLOCUSoutMSG" ) ;
              return [ _ret_id, _ret_msg ] ;
           }
           else
           {
              _ret_id = RET_WARNING ;
              _ret_msg = "Problems while trying to restore the current Farey sequence from storage space" + _glob_crlf.repeat(2) + "Please, retry" ;
							circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _ret_msg, "CIRCLESformsDLOCUSoutMSG" ) ;
              return [ _ret_id, _ret_msg ] ;
           }
       }
    }
    else
    {
       _ret_id = RET_WARNING ;
       _ret_msg = "The current Farey sequence is empty" ;
			 circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _ret_msg, "CIRCLESformsDLOCUSoutMSG" ) ;
    }
}