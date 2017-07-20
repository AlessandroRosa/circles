function CIRCLESformsEPSEDITORdispatcher()
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
                $( "#" + _div_id ).height( _sh - 70 ) ;
                circles_lib_forms_adjust_position( _div_id ) ;
		            var _sw = $(window).width(), _sh = $(window).height() ;
		            if ( _sw < $( "#"+_div_id ).width() )
		            {
		            		var _resize_fns = [ "CIRCLESformsEPSEDITORmaximize", _div_id, "", "" ] ; 
				            circles_lib_popup_maximize( _div_id, _resize_fns.join( "|" ) ) ;
								}
                break ;
                case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
                break ;
		          case POPUP_DISPATCHER_UNICAST_EVENT_RELOAD:
		          var _subset = _glob_popups_array[ POPUP_INDEX ][8] ;
		          var _base_id = _glob_popups_array[ POPUP_INDEX ][12] ;
		          circles_lib_popup_load( _subset, _base_id, NO ) ;
		          break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
						    if ( $("#" + CIRCLESformsEPSEDITORdiv_id).resizable('instance') != undefined )
                $("#" + CIRCLESformsEPSEDITORdiv_id).resizable('destroy');
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
			          CIRCLESformsEPSEDITORcomputePAGES(NO);
			          CIRCLESformsEPSEDITORreloadPAGE();
			          CIRCLESformsEPSEDITORpagespanel();
			          CIRCLESformsEPSEDITORcomputePAGES(YES);
								break ;
		          case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
		          var _subset = _glob_popups_array[ POPUP_INDEX ][8] ;
		          var _base_id = _glob_popups_array[ POPUP_INDEX ][12] ;
		          circles_lib_popup_remotectrl_dispatch_to_service( _subset, _base_id, arguments ) ;
		          break ;
              default: break ;
					 }
			}
}