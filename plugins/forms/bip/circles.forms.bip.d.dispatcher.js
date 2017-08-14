function CIRCLESformsBIPdispatcher()
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
          var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "bip" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 )
         if ( _idx == UNFOUND ) return 0 ;
					 switch( MESSAGE_ID )
					 {
                case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
                circles_lib_forms_adjust_position( CIRCLESformsBIPdiv_id ) ;
                break ;
                case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
								CIRCLESformsBIPcanvasmirrorSHOW(SHOW);
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
								CIRCLESformsBIPcanvasmirrorSHOW(SHOW);
								CIRCLESbipFORMcanvasMETRICShtml(NO);
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
                _glob_bip_use = NO, _glob_target_plane = _glob_persistent_vars['old_target_plane'];
                clrtable.setHANDLERonselectcolor( null );

              var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
              circles_lib_plugin_activate( NO, _base_id, '', '', _subset, CLOSE, _glob_popups_array[_idx][1],'' );
                break ;
			          case POPUP_DISPATCHER_UNICAST_EVENT_RELOAD:
              var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
			          circles_lib_plugin_load( _subset, _base_id, NO ) ;
			          break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
			          CIRCLESformsBIPupdateCOORDS();
			          if ( $( "#BIPcanvasPIXELsize" ).get(0) != null ) $( "#BIPcanvasPIXELsize" ).val( _glob_bip_pixel_size );
			          if ( _glob_bip_use )
			          {
										CIRCLESformsBIPcanvasmirrorSHOW(SHOW);
										CIRCLESbipFORMcanvasMETRICShtml(NO);
								}

			          CIRCLESbipFORMtabMAINhtml( null, NO );
							  var _properties = CIRCLESformsBIPproperties() ;
			          CIRCLESbipFORMtabPROPERTIEShtml( _properties, NO );
								break ;
			          case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
              var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
			          circles_lib_plugin_remotectrl_dispatch_to_service( _glob_popups_array[_idx][1], arguments ) ;
			          break ;
                default:
                break ;
					 }
			}
}