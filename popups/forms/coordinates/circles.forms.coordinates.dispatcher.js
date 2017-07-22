function CIRCLESformsCOORDINATESdispatcher()
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
          circles_lib_forms_adjust_position( CIRCLESformsCOORDINATESdiv_id ) ;
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
					circles_lib_statusbar_set_extras_icon( OTHER_NONE );
          _glob_persistent_vars.remove_key('CIRCLESformsCOORDINATESmapped_pt');
          _glob_persistent_vars.remove_key('CIRCLESformsCOORDINATESmobiusmap');
          _glob_persistent_vars.remove_key('CIRCLESformsCOORDINATESsymbol');
          _glob_persistent_vars.remove_key('CIRCLESformsCOORDINATESitemobj');

          circles_lib_popup_activate( NO, GLOB_PLUGIN_BASE_ID, '', '', GLOB_PLUGIN_SUBSET, CLOSE, GLOB_PLUGIN_DIV_ID,'' );
          break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
          CIRCLESformsCOORDINATESform( CIRCLESformsCOORDINATESplane_type, NO, [] ) ;
			    CIRCLESformsDISCRETENESSLOCUSdrawBOUNDARY( YES );
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