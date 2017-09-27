function circles_lib_statusbar_drag_enable() { $( '#CIRCLESbarsSTATUSBARdiv' ).draggable('enable'); $('#STATUSBARdragICON').prop( "src", _glob_path_to_img+"icons/drag/drag.icon.01.20x20.png" ) ; }
function circles_lib_statusbar_drag_disable() { $('#CIRCLESbarsSTATUSBARdiv').draggable('disable'); $('#STATUSBARdragICON').prop( "src", _glob_path_to_img+"icons/hand/hand.icon.01.20x20.png" ) ; }
function circles_lib_statusbar_toggle() { $("#CIRCLESbarsSTATUSBARdiv" ).toggle( "slow", function() { circles_lib_menu_entries_update(); } ); }
function CIRCLESbarsSTATUSBARdispatcher() // keep this fn name due to std naming convention
{
   /* INDEX <---> arguments mapping
      0: message ID : identifier related to the message sent to this dispatcher function
      1: pop-up window ID : archive index of the registered pop-up window: it is required to find the related obj
                            and gain access to the stored features
      2 and more: arguments with index greater than 1 supply additional parameters, customizable for each message
   */ 
	 if ( arguments.length > 0 )
	 {
	 	 var MESSAGE_ID = safe_string( arguments[0], POPUP_DISPATCHER_UNICAST_EVENT_UNKNOWN );
		 var POPUP_INDEX = safe_int( arguments[1], 0 );
		 switch( MESSAGE_ID )
		 {
        case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
        var _sw = $(window).width(), _sh = $(window).height() ;
        var _div_id = _glob_popups_array[ POPUP_INDEX ][1] ;
        var _crossing_borders = circles_lib_forms_adjust_position( _div_id ) ;
        if( !_crossing_borders ) $("#"+_div_id).css( "left", _sw - $( "#"+_div_id ).width() - 5 );
        break ;
        case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
        break ;
        case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
        break ;
        case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
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

function circles_lib_statusbar_log_icon_show( _show )
{
	 _show = safe_int( _show, NO );
	 $( "#STATUSBARextras" ).html( _show ? "<IMG TITLE=\"Detected run-time errors\" SRC=\""+_glob_path_to_img+"/icons/error/error.01.20x20.png\">" : "" );
	 $( "#STATUSBARextras" ).css( "cursor", _show ? "pointer" : "default" ) ;
	 $( "#STATUSBARotherAPPENDIX" ).html( _show ? "<SUB>("+safe_size( _glob_app_log, 0 )+")</SUB>" : "" ) ;
	 if ( _show ) $( "#STATUSBARextras" ).bind( "mousedown", function(){ circles_lib_plugin_load( 'forms', 'log' ) ; } ) ;
	 else $( "#STATUSBARextras" ).unbind( "mousedown" ) ;
}

function circles_lib_statusbar_dropdown_zoom_populate()
{
   var _percs = [ 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50 ] ;
   var _dropdown = $("#statusbarWORKAREAWIDTHcombo");
   $.each( _percs, function( _i, _perc ) { _dropdown.append( $("<option />").val( _perc ).text( _perc + "%" ) ); });
}

function circles_lib_statusbar_reset()
{
   if ( is_array( _glob_status_bar_settings ) )
   {
      _glob_status_bar_settings['orientation'] = "" ;
   	  _glob_status_bar_settings['xloc'] = "" ;
   	  _glob_status_bar_settings['yloc'] = "" ;
      return YES ;
   }
   else
   {
      _glob_status_bar_settings = [] ;
      _glob_status_bar_settings['orientation'] = "" ;
   	  _glob_status_bar_settings['xloc'] = "" ;
   	  _glob_status_bar_settings['yloc'] = "" ;
      return NO ;
   }
}

function circles_lib_statusbar_load( _orientation, _xloc, _yloc, _show, _xpos, _ypos, _callback_fn )
{
	 _show = safe_int( _show, YES ), _orientation = safe_string( _orientation, "horz" );
   _xpos = safe_int( _xpos, UNDET ), _ypos = safe_int( _ypos, UNDET );
   if ( _glob_status_bar_settings['orientation'] != _orientation )
   {
       var _abs_folder_path = "screen/" ;
       var vars = { tip: "",
                    folder : _abs_folder_path,
                    filter : "/status.bar."+_orientation+".php$/",
   							    exact : 0,
                    search_params : "1,0,0,0" } ;
       var _result = get_filedata_from_folder( "support/code/phpcode/svc/svc.filelist.contents.php", "POST", false, vars );
       		 _result = is_string( _result ) ? _result.replaceAll( "%path_to_img%", _glob_path_to_img ) : "" ;
       
       if ( _show ) $( "#CIRCLESbarsSTATUSBARdiv" ).hide();
       if ( _orientation.stricmp( "horz" ) ) { $( "#CIRCLESbarsSTATUSBARdiv" ).width( 722 ); $( "#CIRCLESbarsSTATUSBARdiv" ).height( 30 ); }
       if ( _orientation.stricmp( "vert" ) ) { $( "#CIRCLESbarsSTATUSBARdiv" ).width( 72 ); $( "#CIRCLESbarsSTATUSBARdiv" ).height( "auto" ); }
       $( "#CIRCLESbarsSTATUSBARdiv" ).html( _result );
       if ( _show ) $( "#CIRCLESbarsSTATUSBARdiv" ).show();
       
       $('#CIRCLESbarsSTATUSBARdiv').draggable( { disabled: true } );

       circles_lib_depth_set( _glob_depth );
       if ( $( "#STATUSBARcounting_entity_leftLABEL" ).get(0) != null )
       $( "#STATUSBARcounting_entity_leftLABEL" ).html( _glob_process == PROCESS_RANDOM ? "2<sup>^</sup>steps" : "Depth" );
           
       if ( _glob_statusbarMOUSEprocSWITCH == MOUSE_STATUSBAR_PROC_ID )
       circles_lib_statusbar_drag_enable() ;

       if ( _xloc.stricmp( "left" ) ) $( "#CIRCLESbarsSTATUSBARdiv" ).css( "left", 2 );
       else if ( _xloc.stricmp( "right" ) ) $( "#CIRCLESbarsSTATUSBARdiv" ).css( "left", $(window).width() - $( "#CIRCLESbarsSTATUSBARdiv" ).width() - 2 );
       if ( _yloc.stricmp( "top" ) ) $( "#CIRCLESbarsSTATUSBARdiv" ).css( "top", _glob_top_border_rect.get_bottom() );
       else if ( _yloc.stricmp( "bottom" ) ) $( "#CIRCLESbarsSTATUSBARdiv" ).css( "top", $(window).height() - $( "#CIRCLESbarsSTATUSBARdiv" ).height() - 2 );
       
       _glob_status_bar_settings['orientation'] = _orientation ;
       _glob_status_bar_settings['xloc'] = _xloc ;
       _glob_status_bar_settings['yloc'] = _yloc ;
       
       if ( _xpos > 0 ) $( "#CIRCLESbarsSTATUSBARdiv" ).css( "left", _xpos );
       if ( _ypos > 0 ) $( "#CIRCLESbarsSTATUSBARdiv" ).css( "top", _ypos );
       
       $( "#CIRCLESbarsSTATUSBARdiv" ).css( "display", _show ? "block" : "none" );

       circles_lib_statusbar_set_config_icon( _glob_bip_use ? CONFIG_BIPBOX : CONFIG_STD ) ;
       circles_lib_statusbar_update_list_icon() ;
       circles_lib_statusbar_set_output_stream( _glob_output_channel );
       circles_lib_statusbar_dropdown_zoom_populate();
       
       circles_lib_plugin_register( null, "CIRCLESbarsSTATUSBARdiv", "", OPEN, SHOW, "", "bars", "status.bar", NO ) ;
       
       if ( typeof _callback_fn === "function" ) _callback_fn.call( this ) ;
       return YES ;
   }
   else return NO ;
}

function circles_lib_statusbar_init( _show )
{
	 _show = safe_int( _show, YES );
   if ( $( "#CIRCLESbarsSTATUSBARdiv" ).get(0) != null )
   {
    	 $( "#CIRCLESbarsSTATUSBARdiv" ).width( $( "#STATUSBAR" ).width() + 4 );
    	 var _top_z_canvas = circles_lib_canvas_layer_get_topmost( Z_PLANE );
    	 var _top_w_canvas = circles_lib_canvas_layer_get_topmost( W_PLANE );
    	 var _max_z_index = Math.max( _top_z_canvas['zindex'], _top_w_canvas['zindex'] );
    	 $( "#CIRCLESbarsSTATUSBARdiv" ).zIndex( _max_z_index + 1 );
       circles_lib_statusbar_set_border_rects() ;
    	 if ( _show )
       {
          $( "#CIRCLESbarsSTATUSBARdiv" ).css( "left", $( window ).width() - $( "#CIRCLESbarsSTATUSBARdiv" ).width() - 5 );
          $( "#CIRCLESbarsSTATUSBARdiv" ).css( "display", "block" );
       }
       return YES ;
   }
   else return NO ;
}

function circles_lib_statusbar_set_border_rects()
{
   var _x_extent = 54, _y_extent = 14, _menu_height = $("#menu").height(), _extras = 12 ;
   _glob_top_border_rect.width_height_constructor( _extras, _menu_height + _extras,
																									 $(window).width() - _extras, _y_extent );
   _glob_bottom_border_rect.width_height_constructor( 0, $(window).height() - _y_extent - _extras,
																										  $(window).width() - _extras, _y_extent );

   _glob_left_border_rect.width_height_constructor( 0, _glob_top_border_rect.get_bottom() + _extras,
																									  _x_extent, $(window).height() - _menu_height - _glob_top_border_rect.height() - _glob_bottom_border_rect.height() );

   _glob_right_border_rect.width_height_constructor( $(window).width() - _x_extent, _glob_top_border_rect.get_bottom() + _extras,
																									   _x_extent, $(window).height() - _menu_height - _glob_top_border_rect.height() - _glob_bottom_border_rect.height() );
}

function circles_lib_statusbar_set_extras_icon( _e )
{
   if ( $("#STATUSBARextras").get(0) != null )
   {
      var _icon_code = "", ICONSIZE = "20x20" ;
      switch( _e )
      {
         case OTHER_ZOOM : _icon_code = "<IMG TITLE=\"Zoom\" SRC=\"%imgpath%icons/lens/lens.icon.01."+ICONSIZE+".png\">" ; break ;
         case OTHER_NONE :
         default : _icon_code = "" ; break ;
      }
          
      _icon_code = _icon_code.replaceAll( "%imgpath%", _glob_path_to_img );
      $("#STATUSBARextras").html( _icon_code );
   } 
}

function circles_lib_statusbar_update_list_icon()
{
   var _len = safe_size( _glob_popups_array, 0 );
   $("#STATUSBARpopuplist").bind( "mouseover", _len > 0 ? function() { this.style.cursor = 'pointer' ; } : function() {} );
   $("#STATUSBARpopuplist").bind( "mousedown", _len > 0 ? function() { circles_lib_plugin_show_list(YES); } : function() {} );
   $("#STATUSBARpopuplist").html( _len > 0 ? "<IMG TITLE=\"Pop-ups List\" SRC=\""+_glob_path_to_img+"icons/menu/menu.icon.01.20x20.png\">" : "" );
   if ( _len == 0 ) circles_lib_plugin_show_list( HIDE );
}

function circles_lib_statusbar_set_config_icon( _e )
{
   if ( $("#STATUSBARconfig").get(0) != null )
   {
      var _icon_code = "", ICONSIZE = "20x20" ;
      switch( _e )
      {
         case CONFIG_STD : _icon_code = "<IMG TITLE=\"Config : normal\" SRC=\"%imgpath%icons/screen/screen.icon.02."+ICONSIZE+".png\">" ; break ;
         case CONFIG_BIPBOX : _icon_code = "<IMG TITLE=\"Config : bip canvas\" SRC=\"%imgpath%icons/batch/batch.icon.02."+ICONSIZE+".png\">" ; break ;
         default : _icon_code = "<IMG TITLE=\"Config : unknown\" SRC=\"%imgpath%icons/questionmark/question.mark.icon.01."+ICONSIZE+".png\">" ; break ;
      }
      _icon_code = _icon_code.replaceAll( "%imgpath%", _glob_path_to_img );
      $("#STATUSBARconfig").html( _icon_code );
      return YES ;
   }
   else return NO ;
}

function circles_lib_statusbar_set_output_stream( _out_channel )
{
   _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
   _glob_output_channel = _out_channel ;
   if ( $("#STATUSBARoutput").get(0) != null )
   {
      var _icon_code = "", ICONSIZE = "20x20" ;
      switch( _out_channel )
      {
         case OUTPUT_SCREEN : _icon_code = "<IMG TITLE=\"Output : screen\" SRC=\"%imgpath%icons/screen/screen.icon.01."+ICONSIZE+".png\">" ; break ;
         case OUTPUT_TERMINAL : _icon_code = "<IMG TITLE=\"Output : terminal console\" SRC=\"%imgpath%icons/cmd.prompt/cmd.prompt.icon.01."+ICONSIZE+".png\">" ; break ;
         case OUTPUT_SCRIPT : _icon_code = "<IMG TITLE=\"Output : batch compiler\" SRC=\"%imgpath%icons/batch/batch.icon.01."+ICONSIZE+".png\">" ; break ;
         default : _icon_code = "<IMG TITLE=\"Output : unknown\" SRC=\"%imgpath%icons/questionmark/question.mark.icon.01."+ICONSIZE+".png\">" ; break ;
      }
         
      _icon_code = _icon_code.replaceAll( "%imgpath%", _glob_path_to_img );
      $("#STATUSBARoutput").html( _icon_code );
      return YES ;
   }
   else return NO ;
}

function circles_lib_statusbar_update_elements()
{
   $( "#STATUSBARdrawdisksBTN" ).css( "color", _glob_zplaneMOUSEprocSWITCH == MOUSE_DRAWDISKS_PROC_ID ? "blue" : "black" );
}

function circles_lib_statusbar_set_depth( _depth )
{
   _depth = Math.max( 1, safe_int( _depth, 1 ) );
	 //if ( event.stopPropagation )      event.stopPropagation();
	 //if ( event.cancelBubble != null ) event.cancelBubble = true;
   circles_lib_depth_set( _depth, YES );
   $('[id$=renderBTN]').css('color',COLOR_ERROR) ;
}