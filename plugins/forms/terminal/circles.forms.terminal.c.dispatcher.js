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
       var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "terminal" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
       if ( _idx == UNFOUND ) return 0 ;
       switch( MESSAGE_ID )
		   {
           case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
           var _sw = $(window).width(), _sh = $(window).height() ;
           var _div_id = _glob_popups_array[_idx][1] ;
           var _suffix = _glob_popups_array[_idx][9] ;
           $( "[id^=wnd_container_POPUPterminalDIV"+_suffix+"]" ).height(_sh - 76 ) ;
           $("#CIRCLESTERMINAL"+_suffix+"_TAB_01").css( "height", $("#"+_div_id).height() - 76 );
           $("#CIRCLESTERMINAL"+_suffix+"_TAB_02").css( "height", $("#"+_div_id).height() - 76 );
           $("#CIRCLESTERMINAL"+_suffix+"_TAB_03").css( "height", $("#"+_div_id).height() - 76 );
                
           CIRCLESformsTERMINALresize( $( "[id^=wnd_container_POPUPterminalDIV"+_suffix+"]" ).width(),
																			 $( "[id^=wnd_container_POPUPterminalDIV"+_suffix+"]" ).height(),
																			 _suffix ) ;
           circles_lib_forms_adjust_position( _div_id ) ;
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_UPDATE:
           case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
           var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
           CIRCLESformsTERMINALmain( _base_id, NO ) ;
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
           _glob_wnd_onkeyup_event_halt = YES ;
           _glob_terminal_current_id = CIRCLESformsTERMINALdiv_id ;
           $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESformsTERMINALlistingsLOAD ) } ;
           var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
           _glob_wnd_onkeyup_event_halt = NO ;
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
           var _div_id = _glob_popups_array[_idx][1] ;
           if ( $("#"+_div_id).resizable('instance') != undefined ) $("#" + _div_id).resizable('destroy');
           _glob_wnd_onkeyup_event_halt = NO ;
           var _suffix = _glob_popups_array[_idx][9] ;
			     if ( _glob_terminal_popup_active > 0 ) _glob_terminal_popup_active--;

					 circles_lib_statusbar_set_output_stream( OUTPUT_SCREEN );
					 CIRCLESformsTERMINALbatchcompilerCLOSE( _suffix );
					 circles_lib_unload_cmd();

           var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
           circles_lib_plugin_activate( NO, _base_id, '', '', _subset, CLOSE, _glob_popups_array[_idx][1],'' );
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
           break ;
           case POPUP_DISPATCHER_MULTICAST_EVENT_REMOTE_CONTROL:
		       case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
           var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
		       circles_lib_plugin_remotectrl_dispatch_to_service( _glob_popups_array[_idx][1], arguments ) ;
		       break ;
		       default: break ;
			 }
		}
}