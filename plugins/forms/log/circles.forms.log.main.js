function CIRCLESformsLOGclose() { return circles_lib_plugin_dispatcher_unicast_message( "log", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsLOGmaximize()
{
    var _full_width = safe_int( arguments[1], 0 );
    var _full_height = safe_int( arguments[2], 0 );
    CIRCLESformsLOGresize( _full_width, _full_height );
    CIRCLESformsLOGstopresize();
    if ( $( "#" + CIRCLESformsLOGdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLESformsLOGdiv_id).resizable('enable');
}

function CIRCLESformsLOGminimize()
{
    var _original_width = safe_int( arguments[1], 0 );
    var _original_height = safe_int( arguments[2], 0 );
    var _min_width = safe_int( arguments[3], 0 );
    var _min_height = safe_int( arguments[4], 0 );
    CIRCLESformsLOGresize( _min_width, _min_height );
    CIRCLESformsLOGstopresize();
    if ( !( $( "#" + CIRCLESformsLOGdiv_id ).resizable( "option", "disabled" ) ) )
    $("#" + CIRCLESformsLOGdiv_id).resizable('disable');
}

function CIRCLESformsLOGnormalize()
{
    var _original_width = safe_int( arguments[1], 0 );
    var _original_height = safe_int( arguments[2], 0 );
    CIRCLESformsLOGresize( _original_width, _original_height );
    CIRCLESformsLOGstopresize();
    if ( $( "#" + CIRCLESformsLOGdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLESformsLOGdiv_id).resizable('enable');
}

function CIRCLESformsLOGmain( _base_id, _move )
{
    CIRCLESformsLOGbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES ) ;
    var WIDTH = Math.floor( Math.min( 420, $( window ).width() / 2 ) ), HEIGHT = $( window ).height() - 140 ; // menu height
    var _subset = "forms" ;
    var _div_id = CIRCLESformsLOGdiv_id = circles_lib_plugin_build_divid( _subset, _base_id ), CLOSE_FN = "CIRCLESformsLOGclose()" ;
    var HTMLcode = "<table WIDTH=\"100%\">" ;
    HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsLOGcaption, 3, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "gearwheel/gearwheel.icon.01.16x16.png",
																		            "", "", "CIRCLESformsLOG" );
    HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    HTMLcode += "<tr><td><table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsLOGclean();\">Clean log</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"log_copy\" ONCLICK=\"javascript:copy_to_clipboard($('#CIRCLESformsLOGdivLIST').html());\">Copy log</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsLOGtableSAVE();\">Export log</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td ID=\"CIRCLESlogOUTPUTbox\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\"100%\"><DIV CLASS=\"general_rounded_corners\" ID=\"CIRCLESformsLOGdivLIST\" STYLE=\"overflow:auto;position:relative;width:"+(WIDTH-5)+"px;height:"+(HEIGHT-86)+"px;background-color:#323232;padding:2px;\"></td></DIV>" ;
    HTMLcode += "</table>" ;
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments,
               _subset, OPEN, _div_id, CIRCLESformsLOGcaption, CLOSE_FN,
               [ "CIRCLESformsLOGnormalize", _div_id, WIDTH, HEIGHT ],
               [ "CIRCLESformsLOGminimize", _div_id, WIDTH, HEIGHT ],
               [ "CIRCLESformsLOGmaximize", _div_id, WIDTH, HEIGHT ] );

      if ( $("#"+_div_id ).resizable('instance') != undefined )
      $("#"+_div_id).resizable('destroy').resizable(
      {
        start: function( event, ui ) { CIRCLESformsLOGstartresize( ui.size.width, ui.size.height ) },
        resize: function( event, ui ) { CIRCLESformsLOGresize( ui.size.width, ui.size.height ); },
        stop: function( event, ui ) { CIRCLESformsLOGstopresize( ui.size.width, ui.size.height ) }
      } );
      else
      {
        $("#"+_div_id).resizable(
        {
          start: function( event, ui ) { CIRCLESformsLOGstartresize( ui.size.width, ui.size.height ) },
          resize: function( event, ui ) { CIRCLESformsLOGresize( ui.size.width, ui.size.height ); },
          stop: function( event, ui ) { CIRCLESformsLOGstopresize( ui.size.width, ui.size.height ) }
        } );
      }
      $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });

    CIRCLESformsLOGlist();
}

function CIRCLESformsLOGstartresize( _new_width, _new_height ) {}
function CIRCLESformsLOGstopresize( _new_width, _new_height ) {}
function CIRCLESformsLOGresize( _new_width, _new_height )
{
    $( "#CIRCLESformsLOGdivLIST" ).width( _new_width - 5 ) ;
    $( "#CIRCLESformsLOGdivLIST" ).height( _new_height - 86 ) ;
}

function CIRCLESformsLOGclean( _silent )
{
		_silent = safe_int( _silent, NO ) ;
		var _b_go = !_silent ? confirm( "Confirm to clean the current log ?" ) : YES ;
		if ( _b_go )
		{
				_glob_app_log = [] ;
				CIRCLESformsLOGlist() ;
				circles_lib_statusbar_log_icon_show( NO );
		}
}

function CIRCLESformsLOGlist()
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
        $.each( _glob_app_log, function( _i, _log_chunk )
                {
                   switch( _log_chunk[2] )
                   {
                      case LOG_SUCCESS: _textcolor = DEFAULT_COLOR_GO ; break ;
                      case LOG_ERROR: _textcolor = DEFAULT_COLOR_ERROR ; break ;
                      case LOG_WARNING: _textcolor = DEFAULT_COLOR_WARNING ; break ;
                      default: _textcolor = DEFAULT_EDIT_COLOR_DISABLED ; break ;
                   }
                   // keep the ending CRLF for clipboard copy
                   HTMLcode += "<tr><td WIDTH=\"5\"></td><td STYLE=\"color:white;\" VALIGN=\"top\">"+_log_chunk[0]+"</td><td WIDTH=\"10\"></td><td VALIGN=\"top\" STYLE=\"color:"+_textcolor+";\">"+_log_chunk[1]+"</td></tr>" ;
                   HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
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
    $( "#CIRCLESformsLOGdivLIST" ).html( HTMLcode );
}

function CIRCLESformsLOGtableSAVE()
{
		switch( _ret_chunk[0] )
		{
				case YES:
				var _out_array = [] ;
						_out_array.push( _glob_app_title, _glob_app_subtitle, "", "Log", "" );
            if ( _glob_app_log.length > 0 )
            _out_array = _out_array.concat( _glob_app_log.from_to( 0, 50 ) ) ;
            else _out_array.push( "Log is empty" ) ;
				var _filename = "circles.log.txt" ;
				var blob = new Blob( [ _out_array.join( _glob_crlf != null ? _glob_crlf : "\r\n" ) ], { type: 'plain/text', endings: 'native' });
			  saveAs( blob, _filename );
				break ;
        default:
        CIRCLESformsAUTOMATONtableCHECKprocessOUTPUT( _ret_chunk ) ;
        break ;
		}
}