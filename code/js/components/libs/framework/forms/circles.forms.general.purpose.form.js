function CIRCLESformsGENERALPURPOSEdispatcher()
{
		if ( arguments.length > 0 )
		{
			 var MESSAGE_ID = safe_string( arguments[0], POPUP_DISPATCHER_UNICAST_EVENT_UNKNOWN );
			 var POPUP_INDEX = safe_int( arguments[1], 0 );
			 switch( MESSAGE_ID )
			 {
           case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
           var _sw = $(window).width(), _sh = $(window).height() ;
           var _div_id = _glob_popups_array[ POPUP_INDEX ][1] ;
           circles_lib_forms_adjust_position( _div_id ) ;
           break ;
           case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
           var _div_id = _glob_popups_array[ POPUP_INDEX ][1] ;
           if ( $("#" + _div_id).resizable('instance') != undefined )
           $("#" + _div_id).resizable('destroy');
           break ;
		       case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
		       var _subset = _glob_popups_array[ POPUP_INDEX ][8] ;
		       var _base_id = _glob_popups_array[ POPUP_INDEX ][12] ;
		       circles_lib_plugin_remotectrl_dispatch_to_service( _glob_popups_array[_idx][1], arguments ) ;
		       break ;
		       default: break ;
			 }
		}
}

function CIRCLESgeneralpurposeFORMnormalize( _div, _original_w, _original_h )
{
    _original_w = safe_int( _original_w, UNDET );
    _original_h = safe_int( _original_h, UNDET );
    if ( _original_w != UNDET ) $("#"+_div_id ).css( "width", _original_w + "px" );
    if ( _original_h != UNDET ) $("#"+_div_id ).css( "height", _original_h + "px" );
    $( "#PLUGINmasterTABLE" ).css( "width", _original_w );
    CIRCLESgeneralpurposeRESIZE( _original_w, _original_h );
}

function CIRCLESgeneralpurposeFORMminimize( _div_id, _original_w, _original_h )
{
    _original_w = safe_int( _original_w, UNDET );
    _original_h = safe_int( _original_h, UNDET );
    $( "#PLUGINmasterTABLE" ).css( "width", _original_w + "px" );
    $( "#PLUGINmasterTABLE" ).css( "height", CIRCLES_POPUP_CAPTION_HEIGHT + "px" );
    CIRCLESgeneralpurposeRESIZE( _original_w, CIRCLES_POPUP_CAPTION_HEIGHT );
}

function CIRCLESgeneralpurposeFORMmaximize( _div_id, _original_w, _original_h )
{
    _original_w = safe_int( _original_w, UNDET );
    _original_h = safe_int( _original_h, UNDET );
    $( "#PLUGINmasterTABLE" ).css( "width", _original_w + "px" );
    $( "#PLUGINmasterTABLE" ).css( "height", CIRCLES_POPUP_CAPTION_HEIGHT + "px" );
    CIRCLESgeneralpurposeRESIZE( _original_w, CIRCLES_POPUP_CAPTION_HEIGHT );
}

function CIRCLESgeneralpurposeFORMclose( _div_id ) { $("#POPUPgeneralpurposeDIV").resizable('destroy'); return YES ; }

function CIRCLESgeneralpurposeFORM( _subset, _base_id, _move, _w, _h, _caption, _x_pos_tag, _y_pos_tag, _bkcolor, _word_wrap, _html_code, _resizable )
{
    _base_id = safe_string( _base_id, POPUP_NO_ID );
    _move = safe_int( _move, YES );
    _bkcolor = safe_string( _bkcolor, "transparent" );
    _x_pos_tag = safe_string( _x_pos_tag, "LEFT" ), _y_pos_tag = safe_string( _y_pos_tag, "TOP" );
    _caption = safe_string( _caption, 'General Purpose' );
    _word_wrap = safe_int( _word_wrap, NO ), _resizable = safe_int( _resizable, NO );
    var WIDTH = safe_int( _w, 350 ), HEIGHT = safe_int( _h, "auto" );
    var _div_id = circles_lib_plugin_build_divid( _subset, _base_id );
    if ( $("#" + _div_id).resizable('instance') != undefined ) $("#" + _div_id).resizable('destroy');
    if ( circles_lib_plugin_find_index( { subset : _subset, base_id : _base_id }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_SUBSET ) != UNFOUND )
    circles_lib_plugin_destroy_wnd( _div_id );

    var CLOSE_FN = "CIRCLESgeneralpurposeFORMclose();", _subset = "forms" ;
    var HTMLcode =  "<table ID=\"POPUPgeneralpurposesMASTERTABLE\" WIDTH=\"99%\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, _caption, 5, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "info/info.icon.01.16x16.png" );
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\"><DIV ID=\"CIRCLESgeneralpurposeDIV\" STYLE=\"position:relative;"+( _word_wrap ? "word-wrap:break-word;" : "" )+"background-color:"+_bkcolor+";padding:6px;width:"+( WIDTH - 10 )+"px;height:"+(_h-7)+"px;overflow:auto;\" CLASS=\"general_rounded_corners\">"+_html_code+"</DIV></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
    HEIGHT += 58 ;
    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( YES, _base_id, arguments.callee.name, "", _subset, OPEN, _div_id, _caption, CLOSE_FN,
                      [ "CIRCLESgeneralpurposeFORMnormalize", _div_id, _w, _h ],
                      [ "CIRCLESgeneralpurposeFORMminimize", _div_id, _w, _h ],
                      [ "CIRCLESgeneralpurposeFORMmaximize", _div_id, _w, _h ] );
    if ( _move && _div != null ) move_div( _div.id, _x_pos_tag, _y_pos_tag );

    if ( _resizable )
		{
      if ( $("#"+_div_id ).resizable('instance') != undefined )
      $("#"+_div_id).resizable('destroy').resizable(
      {
				start: function( event, ui ) { },
				resize: function( event, ui ) { CIRCLESgeneralpurposeRESIZE( ui.size.width, ui.size.height, _div_id ); },
				stop: function( event, ui ) { }
      } );
      else
      {
        $("#"+_div_id).resizable(
        {
					start: function( event, ui ) { },
					resize: function( event, ui ) { CIRCLESgeneralpurposeRESIZE( ui.size.width, ui.size.height, _div_id ); },
					stop: function( event, ui ) { }
        } );
      }
      $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
		}
}

function CIRCLESgeneralpurposeRESIZE( _new_width, _new_height, _div_id )
{
    _new_width = safe_int( _new_width, UNDET );
    _new_height = safe_int( _new_height, UNDET );

    var _popup_div_id = _div_id ;
    if ( _new_width == UNDET ) _new_width = $("#"+_div_id).width();
    if ( _new_height == UNDET ) _new_height = $("#"+_div_id).height();

    var _extra_height = safe_int( $("#" + _div_id + "_caption").height(), 0 );
        _extra_height += safe_int( $("#" + _div_id + "_method").height(), 0 );
        _extra_height += 13 ;

    var _popup_width = _new_width - 10 ; // left + right margin between popup and viewport border
    var _popup_height = _new_height - 10 ; // top + bottom margin

    var _div_width = _new_width - 10, _div_height = _new_height - _extra_height - 20 ;
    $("#CIRCLESgeneralpurposeDIV").width( _div_width );
    $("#CIRCLESgeneralpurposeDIV").height( _div_height );
}