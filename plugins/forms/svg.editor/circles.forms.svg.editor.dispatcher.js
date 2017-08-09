function CIRCLESformsSVGEDITORdispatcher()
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
          var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "svg.editor" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 )
         if ( _idx == UNFOUND ) return 0 ;
					 switch( MESSAGE_ID )
					 {
                case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
                var _sw = $(window).width(), _sh = $(window).height() ;
                var _div_id = _glob_popups_array[ _idx ][1] ;
                var _suffix = _glob_popups_array[ _idx ][9] ;
                var _popup_height = $(window).height() - 90 ;
                $("#"+_div_id).height( _popup_height ) ;
                
                var _tab_height = _popup_height - 120 ;
                $( "#CIRCLESAUTOMATONmainDIV" ).height( _tab_height - 4 );
                $( "[id^=CIRCLESAUTOMATON_TAB_]" ).height( _tab_height - 10 );

                circles_lib_forms_adjust_position( _div_id ) ;
		            var _sw = $(window).width(), _sh = $(window).height() ;
		            if ( _sw < $( "#"+_div_id ).width() )
		            {
		            		var _resize_fns = [ "CIRCLESformsSVGEDITORmaximize", _div_id, "", "" ] ; 
				            circles_lib_plugin_maximize( _div_id, _resize_fns.join( "|" ) ) ;
								}
                break ;
                case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
                $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESformsSVGEDITORload ) } ;
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
						    _glob_svg_canvas = null;

              var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
              circles_lib_plugin_activate( NO, _base_id, '', '', _subset, CLOSE, _glob_popups_array[ _idx ][1],'' );
                break ;
		          case POPUP_DISPATCHER_UNICAST_EVENT_RELOAD:
              var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
		          circles_lib_plugin_load( _subset, _base_id, NO ) ;
		          break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
                if ( CIRCLESformsSVGEDITORrun )
                CIRCLESformsSVGEDITORdisplayPAGE( CIRCLESformsSVGEDITORpagesCOUNTER ) ;
                else CIRCLESformsSVGEDITORmain( 'svg.editor' ) ;
                break ;
			          case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
              var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
			          circles_lib_plugin_remotectrl_dispatch_to_service( _subset, _base_id, arguments ) ;
			          break ;
				        default: break ;
					 }
			}
}