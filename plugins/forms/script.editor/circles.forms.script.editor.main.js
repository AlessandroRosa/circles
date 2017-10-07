function CIRCLESformsSCRIPTEDITORclose() { return circles_lib_plugin_dispatcher_unicast_message( "script.editor", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsSCRIPTEDITORmaximize()
{
    var _full_width = safe_int( arguments[3], 0 );
    var _full_height = safe_int( arguments[4], 0 );
    CIRCLESformsSCRIPTEDITORresize( _full_width, _full_height );
    CIRCLESformsSCRIPTEDITORstopresize();
    if ( $( "#" + CIRCLESformsSCRIPTEDITORdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLESformsSCRIPTEDITORdiv_id).resizable('enable');
}

function CIRCLESformsSCRIPTEDITORminimize()
{
    var _original_width = safe_int( arguments[1], 0 );
    var _original_height = safe_int( arguments[2], 0 );
    var _min_width = safe_int( arguments[3], 0 );
    var _min_height = safe_int( arguments[4], 0 );
    CIRCLESformsSCRIPTEDITORresize( _min_width, _min_height );
    CIRCLESformsSCRIPTEDITORstopresize();
    if ( !( $( "#" + CIRCLESformsSCRIPTEDITORdiv_id ).resizable( "option", "disabled" ) ) )
    $("#" + CIRCLESformsSCRIPTEDITORdiv_id).resizable('disable');
}

function CIRCLESformsSCRIPTEDITORnormalize()
{
    var _original_width = safe_int( arguments[1], 0 );
    var _original_height = safe_int( arguments[2], 0 );
    CIRCLESformsSCRIPTEDITORresize( _original_width, _original_height );
    CIRCLESformsSCRIPTEDITORstopresize();
    if ( $( "#" + CIRCLESformsSCRIPTEDITORdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLESformsSCRIPTEDITORdiv_id).resizable('enable');
}

function CIRCLESformsSCRIPTEDITORmain( _base_id, _move )
{
    CIRCLESformsSCRIPTEDITORbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES ) ;
    var TOP = 40 ;
    var WIDTH = Math.floor( $( window ).width() * 0.85 ), HEIGHT = $( window ).height() - ( TOP + 15 ) ;
    var _subset = "forms" ;
    var _div_id = CIRCLESformsSCRIPTEDITORdiv_id = circles_lib_plugin_build_divid( _subset, _base_id ), CLOSE_FN = "CIRCLESformsSCRIPTEDITORclose()" ;
		CIRCLESformsSCRIPTEDITORdims = [ WIDTH, HEIGHT ] ;    
    var HTMLcode = "<table WIDTH=\""+WIDTH+"\" HEIGHT=\""+HEIGHT+"\">" ;
    HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsSCRIPTEDITORcaption, 3, YES, CLOSE_FN, "100%", HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "gearwheel/gearwheel.icon.01.16x16.png",
																		            "", "", "CIRCLESformsSCRIPTEDITOR",
													                      [ "CIRCLESformsSCRIPTEDITORnormalize", _div_id, WIDTH, HEIGHT ],
													                      [ "CIRCLESformsSCRIPTEDITORminimize", _div_id, WIDTH, HEIGHT ],
													                      [ "CIRCLESformsSCRIPTEDITORmaximize", _div_id, WIDTH, HEIGHT ] );
    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td COLSPAN=\"3\" HEIGHT=\"24\">" ;
    HTMLcode += "<table HEIGHT=\"24\"><tr><td HEIGHT=\"24\" ID=\"CIRCLESformsSCRIPTEDITORmenuCONTAINER\">"

    var _abs_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
    var _rel_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
    $.ajaxSetup( { async:false } );
    $.get( _rel_folder_path + "menu.html", function( response ) { HTMLcode += response ; } );
    HTMLcode += "</td>" ;
    HTMLcode += "<td WIDTH=\"25\"></td>" ;
    HTMLcode += "<td ALIGN=\"right\" ID=\"CIRCLESformsSCRIPTEDITORsearchlibEDITcontainer\"><table><tr><td>Search in libs</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" STYLE=\"width:200px;\" ID=\"CIRCLESformsSCRIPTEDITORsearchlibEDIT\" ONKEYUP=\"javascript:CIRCLESformsSCRIPTEDITOReventsHANDLER( event, this.id );\"></td><td WIDTH=\"10\"></td></tr></table></td>" ;
    HTMLcode += "</tr></table>"
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;

    var RIGHTBARwidth = ( WIDTH - 16 ) * 0.33 ;//			if ( RIGHTBARwidth > 340 ) RIGHTBARwidth = 340 ;
    var TEXTAREAwidth = ( WIDTH - 16 - RIGHTBARwidth ) ;
    var TEXTAREAheight = ( HEIGHT - 95 ) * 0.75 ;
    var CODELISTheight = 200 ;
    var HELPheight = TEXTAREAheight - CODELISTheight - 4 ;
    var OUTPUTAREAwidth = ( WIDTH - 14 ) ;
    var OUTPUTAREAheight = ( HEIGHT - 95 ) * 0.25 - 5 ;

    HTMLcode += "<tr><td WIDTH=\"100%\" ID=\"CIRCLESformsSCRIPTEDITORpaneCONTAINER\">" ;
    HTMLcode += "<div id=\"CIRCLESformsSCRIPTEDITORupperplane\" class=\"splitter split-horizontal\">" ;
      HTMLcode += "<div id=\"CIRCLESformsSCRIPTEDITORupperplaneCONTAINER\" class=\"splitter content\">" ;

		    HTMLcode += "<div id=\"CIRCLESformsSCRIPTEDITORupperplaneLEFT\" class=\"splitter split-horizontal\">" ;
		    HTMLcode += "<TEXTAREA ID=\"CIRCLESformsSCRIPTEDITORtextarea\" STYLE=\"width:"+(TEXTAREAwidth-5)+"px;height:"+TEXTAREAheight+"px;\"></TEXTAREA><TEXTAREA STYLE=\"display:none;\" ID=\"CIRCLESformsSCRIPTEDITORtextareaHIDDEN\"></TEXTAREA>" ;
				HTMLcode += "</div>" ;
		    HTMLcode += "<div id=\"CIRCLESformsSCRIPTEDITORupperplaneRIGHT\" class=\"splitter split-horizontal\">" ;
				    HTMLcode += "<table>" ;
				    HTMLcode += "<tr><td VALIGN=\"top\" STYLE=\"padding-right:2px;\"><DIV ID=\"CIRCLESformsSCRIPTEDITORrightboxUPPER\" CLASS=\"general_rounded_corners\" STYLE=\"position:relative;width:"+RIGHTBARwidth+"px;height:"+CODELISTheight+"px;background-color:#232323;padding:2px;overflow:auto;\"></DIV></td></tr>" ;
				    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
				    HTMLcode += "<tr><td VALIGN=\"top\" STYLE=\"padding-right:2px;\"><DIV ID=\"CIRCLESformsSCRIPTEDITORrightboxLOWER\" CLASS=\"general_rounded_corners\" STYLE=\"position:relative;width:"+RIGHTBARwidth+"px;height:"+HELPheight+"px;background-color:#232323;padding:2px;overflow:auto;\"></DIV></td></tr>" ;
				    HTMLcode += "</table>" ;
				HTMLcode += "</div>" ;

			HTMLcode += "</div>" ;
      HTMLcode += "<div id=\"CIRCLESformsSCRIPTEDITORlowerplane\" class=\"splitter content\">" ;
			    HTMLcode += "<DIV ID=\"CIRCLESformsSCRIPTEDITORoutputTABLE\" CLASS=\"general_rounded_corners\" STYLE=\"position:relative;width:"+OUTPUTAREAwidth+"px;height:"+OUTPUTAREAheight+"px;background-color:#232323;padding:6px;overflow:auto;text-align:left;\"></DIV>" ;
			HTMLcode += "</div>" ;
    HTMLcode += "</div>" ;
    HTMLcode += "</td></tr>"

    HTMLcode += "</table>" ;
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode, null, null, null, TOP );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsSCRIPTEDITORcaption, CLOSE_FN,
					                      [ "CIRCLESformsSCRIPTEDITORnormalize", _div_id, WIDTH, HEIGHT ],
					                      [ "CIRCLESformsSCRIPTEDITORminimize", _div_id, WIDTH, HEIGHT ],
					                      [ "CIRCLESformsSCRIPTEDITORmaximize", _div_id, WIDTH, HEIGHT ] );

      if ( $("#"+_div_id ).resizable('instance') != undefined )
      $("#"+_div_id).resizable('destroy').resizable(
      {
        start: function( event, ui ) { CIRCLESformsSCRIPTEDITORstartresize( ui.size.width, ui.size.height ) },
        resize: function( event, ui ) { CIRCLESformsSCRIPTEDITORresize( ui.size.width, ui.size.height ); },
        stop: function( event, ui ) { CIRCLESformsSCRIPTEDITORstopresize( ui.size.width, ui.size.height ) }
      } );
      else
      {
        $("#"+_div_id).resizable(
        {
          start: function( event, ui ) { CIRCLESformsSCRIPTEDITORstartresize( ui.size.width, ui.size.height ) },
          resize: function( event, ui ) { CIRCLESformsSCRIPTEDITORresize( ui.size.width, ui.size.height ); },
          stop: function( event, ui ) { CIRCLESformsSCRIPTEDITORstopresize( ui.size.width, ui.size.height ) }
        } );
      }
      $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });

    Split(['#CIRCLESformsSCRIPTEDITORupperplane'], {
      gutterSize: 8,
      cursor: 'col-resize'
    })

    Split(['#CIRCLESformsSCRIPTEDITORupperplaneLEFT','#CIRCLESformsSCRIPTEDITORupperplaneRIGHT'], {
      gutterSize: 8,
      direction: 'horizontal',
      sizes: [75, 25],
      cursor: 'row-resize',
      onDrag: function()
			{
					var _scroll_info = CIRCLESformsSCRIPTEDITORcodemirrorOBJ.getScrollInfo() ;
			    CIRCLESformsSCRIPTEDITORcodemirrorOBJ.setSize( $( "#CIRCLESformsSCRIPTEDITORupperplaneLEFT" ).width() - 3, _scroll_info.height );
			    $( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).width( $( "#CIRCLESformsSCRIPTEDITORupperplaneRIGHT" ).width() - 12 );
			    $( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).width( $( "#CIRCLESformsSCRIPTEDITORupperplaneRIGHT" ).width() - 12 );
					$( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).height( Math.floor( $( "#CIRCLESformsSCRIPTEDITORupperplaneRIGHT" ).height() / 2 ) - 6 );
					$( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).height( Math.floor( $( "#CIRCLESformsSCRIPTEDITORupperplaneRIGHT" ).height() / 2 ) - 6 );
			}
    })

    Split(['#CIRCLESformsSCRIPTEDITORupperplaneCONTAINER', '#CIRCLESformsSCRIPTEDITORlowerplane'], {
      direction: 'vertical',
      sizes: [75, 25],
      gutterSize: 8,
      cursor: 'row-resize',
      onDrag: function()
			{
					var _scroll_info = CIRCLESformsSCRIPTEDITORcodemirrorOBJ.getScrollInfo() ;
			    CIRCLESformsSCRIPTEDITORcodemirrorOBJ.setSize( _scroll_info.width, $( "#CIRCLESformsSCRIPTEDITORupperplaneLEFT" ).height(), _scroll_info.height );
			    $( "#CIRCLESformsSCRIPTEDITORoutputTABLE" ).height( $( "#CIRCLESformsSCRIPTEDITORlowerplane" ).height() - 3 );
					$( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).height( Math.floor( $( "#CIRCLESformsSCRIPTEDITORupperplaneRIGHT" ).height() / 2 ) - 6 );
					$( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).height( Math.floor( $( "#CIRCLESformsSCRIPTEDITORupperplaneRIGHT" ).height() / 2 ) - 6 );
			}
    })

    CIRCLESformsSCRIPTEDITORcodemirrorOBJ = CodeMirror(function(elt) { $("#CIRCLESformsSCRIPTEDITORtextarea").get(0).parentNode.replaceChild(elt, $("#CIRCLESformsSCRIPTEDITORtextarea").get(0) ); },
    {
      	value: $("#CIRCLESformsSCRIPTEDITORtextarea").get(0).value,
        mode: "custom.mode",
      	lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        theme: "code",
        gutters: ["CodeMirror-linenumbers", "breakpoints"]
    }
    );
    
    CIRCLESformsSCRIPTEDITORresize( WIDTH, HEIGHT ) ;
    CIRCLESformsSCRIPTEDITORcodemirrorOBJ.on( "keydown", function(){ CIRCLESformsSCRIPTEDITOReventsHANDLER( event, "CIRCLESformsSCRIPTEDITORtextarea" ) ; } ) ;
    CIRCLESformsSCRIPTEDITORcodemirrorOBJ.on( "keyup", function(){ CIRCLESformsSCRIPTEDITOReventsHANDLER( event, "CIRCLESformsSCRIPTEDITORtextarea" ) ; } ) ;

    CIRCLESformsSCRIPTEDITORcodemirrorOBJ.on("gutterClick", function(cm, n)
    {
        var info = cm.lineInfo(n);
        var _mod_index = circles_lib_js_manager_find_module_index( CIRCLESformsSCRIPTEDITORmodulelabelCURRENT,
                                                                   CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
        if ( _mod_index != UNFOUND )
        {
            var _module_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT][_mod_index] ;
            var _breakpoint_number = safe_int( _module_ref[3], UNFOUND ) ;

            if ( _breakpoint_number != UNFOUND ) // clean old marker
            CIRCLESformsSCRIPTEDITORcodemirrorOBJ.setGutterMarker(_breakpoint_number, "breakpoints", null );

            _module_ref[3] = n ;
            CIRCLESformsSCRIPTEDITORcodemirrorOBJ.setGutterMarker(n, "breakpoints",
                                                                  info.gutterMarkers ? null : CIRCLESformsSCRIPTEDITORmakeMarker());
        }
        else if ( circles_lib_js_manager_projs_count() == 0 )
        circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "No break-point can be set: no module has been saved yet", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
        else
        circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "No break-point can be set: please, select a module first", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
    });

		CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay() ;
		$( "#CIRCLESformsSCRIPTEDITORlistCOMBOcontainer").html( CIRCLESformsSCRIPTEDITORcodemanagerLISTprojectsCOMBO() );
		CIRCLESformsSCRIPTEDITORcodemanagerSETloadACTION(1) ;

		if ( html5_files_support() )
		{
				addEventHandler( $( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).get(0), "dragenter", function( event ){ CIRCLESformsSCRIPTEDITORdrop( event ) ; } ) ;
				addEventHandler( $( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).get(0), "dragover", function( event ){ CIRCLESformsSCRIPTEDITORdrop( event ) ; } ) ;
				addEventHandler( $( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).get(0), "dragleave", function( event ){ CIRCLESformsSCRIPTEDITORdrop( event ) ; } ) ;
				addEventHandler( $( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).get(0), "drag", function( event ){ CIRCLESformsSCRIPTEDITORdrop( event ) ; } ) ;
				addEventHandler( $( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).get(0), "drop", function( event ){ CIRCLESformsSCRIPTEDITORdrop( event ) ; } ) ;
				addEventHandler( $( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).get(0), "dragend", function( event ){ CIRCLESformsSCRIPTEDITORdrop( event ) ; } ) ;
		}

    var _proj_array_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
    if ( is_array( _proj_array_ref ) && _proj_array_ref.length > 0 )
		CIRCLESformsSCRIPTEDITORcodemanagerLISTshowCODE( _proj_array_ref.length - 1 );
}

function CIRCLESformsSCRIPTEDITORmakeMarker()
{
  var marker = document.createElement("div");
  marker.style.color = "#FF0000";
  marker.style.fontsize = "12t";
  marker.innerHTML = "&bull;";
  return marker;
}



function CIRCLESformsSCRIPTEDITORdrop( _event )
{
		_event = _event || window.event ;   
  	if ( _event.preventDefault ) { _event.preventDefault(); }
  	switch( _event.type.toLowerCase() )
  	{
				case "drop":
  			CIRCLESformsSCRIPTEDITORloadFILES( _event.dataTransfer.files ) ;
				break ;
		}
}

function CIRCLESformsSCRIPTEDITORstartresize( _new_width, _new_height ) {}
function CIRCLESformsSCRIPTEDITORstopresize( _new_width, _new_height ) {}
function CIRCLESformsSCRIPTEDITORresize( _new_width, _new_height )
{
		$( "#CIRCLESformsSCRIPTEDITORmenuCONTAINER" ).css( "height", 24 );

$( "#CIRCLESformsSCRIPTEDITORupperplaneCONTAINER" ).width( _new_width ) ;
$( "#CIRCLESformsSCRIPTEDITORlowerplane" ).width( _new_width ) ;

    var LEFTPANEwidth = $( "#CIRCLESformsSCRIPTEDITORupperplaneLEFT" ).width() ;
    var RIGHTPANEwidth = $( "#CIRCLESformsSCRIPTEDITORupperplaneRIGHT" ).width() ;
    var RIGHTPANEheight = $( "#CIRCLESformsSCRIPTEDITORupperplaneRIGHT" ).height() ;

    var UPPERPANEheight = ( _new_height - 95 ) * 0.75 ;
    var LOWERPANEheight = ( _new_height - 95 ) * 0.25 - 5 ;

$( "#CIRCLESformsSCRIPTEDITORupperplaneCONTAINER" ).height( UPPERPANEheight ) ;
$( "#CIRCLESformsSCRIPTEDITORlowerplane" ).height( LOWERPANEheight ) ;

CIRCLESformsSCRIPTEDITORcodemirrorOBJ.setSize( LEFTPANEwidth, UPPERPANEheight );

$( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).width( RIGHTPANEwidth - 8 );
$( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).width( RIGHTPANEwidth - 8 );
$( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).height( Math.floor( UPPERPANEheight / 2 ) - 4 );
$( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).height( Math.floor( UPPERPANEheight / 2 ) - 4 );

$( "#CIRCLESformsSCRIPTEDITORoutputTABLE" ).width( _new_width - 14 );
$( "#CIRCLESformsSCRIPTEDITORoutputTABLE" ).height( LOWERPANEheight - 14 );

    $( "#CIRCLESformsSCRIPTEDITORmenuCONTAINER" ).css( "display", _new_width < 360 ? "none" : "block" );
    $( "#CIRCLESformsSCRIPTEDITORsearchlibEDITcontainer" ).css( "display", _new_width < 600 ? "none" : "block" );
}

function CIRCLESformsSCRIPTEDITORclean( _silent )
{
		_silent = safe_int( _silent, NO ) ;
		var _b_go = !_silent ? confirm( "Confirm to clean the current log ?" ) : YES ;
		if ( _b_go )
		{
				_glob_app_log = [] ;
				CIRCLESformsSCRIPTEDITORlist() ;
				circles_lib_statusbar_log_icon_show( NO );
		}
}

function CIRCLESformsSCRIPTEDITORlist()
{
    var _last_entries_n = 50 ;
    _glob_app_log = _glob_app_log.from_to( 0, _last_entries_n ) ;
    var _n_log = safe_size( _glob_app_log, 0 ) ;
    var HTMLcode = "<table WIDTH=\"100%\">" ;
    if ( _n_log > 0 )
    {
        var _textcolor = "" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"5\"></td><td STYLE=\"color:white;\" COLSPAN=\"3\">Displaying the last "+_last_entries_n+" entr"+(_last_entries_n==1?"y":"ies")+"</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        $.each( _glob_app_log,
                function( _i, _log_chunk )
                {
                   switch( _log_chunk[2] )
                   {
                      case LOG_SUCCESS:
                      _textcolor = DEFAULT_COLOR_GO ;
                      break ;
                      case LOG_ERROR:
                      _textcolor = DEFAULT_COLOR_ERROR ;
                      break ;
                      case LOG_WARNING:
                      _textcolor = DEFAULT_COLOR_WARNING ;
                      break ;
                      default:
                      _textcolor = DEFAULT_EDIT_COLOR_DISABLED ;
                      break ;
                   }
                        
                   // keep the ending CRLF for clipboard copy
                   HTMLcode += "<tr><td WIDTH=\"5\"></td><td STYLE=\"color:white;\" VALIGN=\"top\">"+_log_chunk[0]+"</td><td WIDTH=\"10\"></td><td VALIGN=\"top\" STYLE=\"color:"+_textcolor+";\">"+_log_chunk[1]+"</td></tr>" + _glob_crlf ;
                }
              ) ;
    }
    else
    {
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"color:#EAEAEA;font-size:16pt;\" ALIGN=\"center\">Log is empty</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    }
        
    HTMLcode += "</table>" ;
    $( "#CIRCLESformsSCRIPTEDITORdivLIST" ).html( HTMLcode );
}

function CIRCLESformsSCRIPTEDITORcodemanagerINFO()
{
		var MSG = "Circles (Java)script editor\n\n" ;
				MSG += "is supported by Codemirror editor\n" ;
				MSG += "Visit <A STYLE=\"color:blue;\" HREF=\"https://codemirror.net/\" TARGET=\"_blank\">codemirror official website</A>" ;
		circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, MSG, _glob_app_title );
}

function CIRCLESformsSCRIPTEDITORcodemanagerBUILTIN()
{
      var _array_ref = _glob_script_editor_builtin_data_types, HTMLcode ;
      // 
          HTMLcode = "<table>" ;
          HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
      if ( safe_size( _array_ref, 0 ) > 0 )
      {
          HTMLcode += "<tr><td WIDTH=\"8\"></td><td COLSPAN=\"3\" STYLE=\"font-size:12pt;color:"+get_rgb_from_color_tag( "white" )+";\">Built-in data types</td></tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"8\"></td><td STYLE=\"color:"+get_rgb_from_color_tag( "lightblue" )+";\">Original data name</td>" ;
          HTMLcode += "<td WIDTH=\"16\"></td><td STYLE=\"color:"+get_rgb_from_color_tag( "white" )+";\">Shortcut for editor</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
          var _original, _short ;
          $.each( _array_ref,
                  function( _i, _data_type )
                  {
                      _original = _data_type[0], _short = _data_type[1] ;
                      HTMLcode += "<tr>" ;
                      HTMLcode += "<td WIDTH=\"8\"></td><td STYLE=\"color:"+get_rgb_from_color_tag( "lightblue" )+";\">"+_original+"</td>" ;
                      HTMLcode += "<td WIDTH=\"16\"></td><td STYLE=\"color:"+get_rgb_from_color_tag( "white" )+";\">"+_short+"</td>" ;
                      HTMLcode += "</tr>" ;
                      HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
                  }
                );      
      }
      else
      {
          HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:orange;\">No built-in<br>data types<br>registered</td></tr>" ;
      }

      HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
      HTMLcode += "</table>" ;
      $( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).html( HTMLcode );
}