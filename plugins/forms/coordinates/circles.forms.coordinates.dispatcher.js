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
       var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "coordinates" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 )
       if ( _idx == UNFOUND ) return NO ;
			 switch( MESSAGE_ID )
			 {
          case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
          circles_lib_forms_adjust_position( CIRCLESformsCOORDINATESdiv_id ) ;
          break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_UPDATE:
          case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
          var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
          CIRCLESformsCOORDINATESmain( _base_id, NO ) ;
          _glob_target_plane = D_LOCUS ;
          break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
          break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
          break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
					circles_lib_statusbar_set_extras_icon( OTHER_NONE );
          _glob_persistent_vars.remove_key('CIRCLESformsCOORDINATESmapped_pt');
          _glob_persistent_vars.remove_key('CIRCLESformsCOORDINATESmobiusmap');
          _glob_persistent_vars.remove_key('CIRCLESformsCOORDINATESsymbol');
          _glob_persistent_vars.remove_key('CIRCLESformsCOORDINATESitemobj');

          var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
          circles_lib_plugin_activate( NO, _base_id, '', '', _subset, CLOSE, _glob_popups_array[_idx][1],'' );
          break ;
		    case POPUP_DISPATCHER_MULTICAST_EVENT_REFRESH_CONTENTS:
            case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
          CIRCLESformsCOORDINATESform( CIRCLESformsCOORDINATESplane_type, NO, [] ) ;
			    CIRCLESformsDISCRETENESSLOCUSdrawBOUNDARY(YES);
					break ;
			    case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
              var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
			    circles_lib_plugin_remotectrl_dispatch_to_service( _glob_popups_array[_idx][1], arguments ) ;
			    break ;
          default: break ;
			 }
		}
}