function CIRCLESformsTERMINALdispatcher()
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
           var _suffix = _glob_popups_array[ POPUP_INDEX ][9] ;
           $( "[id^=wnd_container_POPUPterminalDIV"+_suffix+"]" ).height(_sh - 76 ) ;
           $("#CIRCLESTERMINAL"+_suffix+"_TAB_01").css( "height", $( "#" + _div_id ).height() - 76 );
           $("#CIRCLESTERMINAL"+_suffix+"_TAB_02").css( "height", $( "#" + _div_id ).height() - 76 );
           $("#CIRCLESTERMINAL"+_suffix+"_TAB_03").css( "height", $( "#" + _div_id ).height() - 76 );
                
           CIRCLESformsTERMINALresize( $( "[id^=wnd_container_POPUPterminalDIV"+_suffix+"]" ).width(),
																			 $( "[id^=wnd_container_POPUPterminalDIV"+_suffix+"]" ).height(),
																			 _suffix ) ;
           circles_lib_forms_adjust_position( _div_id ) ;
           break ;
           case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
           _glob_wnd_onkeyup_event_halt = YES ;
           _glob_terminal_current_id = CIRCLESformsTERMINALdiv_id ;
           $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESformsTERMINALlistingsLOAD ) } ;
           break ;
		       case POPUP_DISPATCHER_UNICAST_EVENT_RELOAD:
		       var _subset = _glob_popups_array[ POPUP_INDEX ][8] ;
		       var _base_id = _glob_popups_array[ POPUP_INDEX ][12] ;
		       circles_lib_plugin_load( _subset, _base_id, NO ) ;
		       break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
           _glob_wnd_onkeyup_event_halt = NO ;
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
           var _div_id = _glob_popups_array[ POPUP_INDEX ][1] ;
           if ( $( "#" + _div_id ).resizable('instance') != undefined )
           $("#" + _div_id).resizable('destroy');
           _glob_wnd_onkeyup_event_halt = NO ;
           var _suffix = _glob_popups_array[ POPUP_INDEX ][9] ;
			     if ( _glob_terminal_popup_active > 0 ) _glob_terminal_popup_active--;
					 circles_lib_statusbar_set_output_stream( OUTPUT_SCREEN );
					 CIRCLESformsTERMINALbatchcompilerCLOSE( _suffix );
					 circles_lib_unload_cmd();

          circles_lib_plugin_activate( NO, GLOB_PLUGIN_BASE_ID, '', '', GLOB_PLUGIN_SUBSET, CLOSE, GLOB_PLUGIN_DIV_ID,'' );
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
           break ;
		       case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
		       var _subset = _glob_popups_array[ POPUP_INDEX ][8] ;
		       var _base_id = _glob_popups_array[ POPUP_INDEX ][12] ;
		       circles_lib_plugin_remotectrl_dispatch_to_service( _subset, _base_id, arguments ) ;
		       break ;
		       default: break ;
			 }
		}
}