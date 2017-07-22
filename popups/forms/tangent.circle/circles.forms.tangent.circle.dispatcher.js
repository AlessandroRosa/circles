function CIRCLESformsTANGENTCIRCLEdispatcher()
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
                circles_lib_forms_adjust_position( CIRCLESformsTANGENTCIRCLEdiv_id ) ;
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
					      var _sd_n = circles_lib_count_seeds();
					      if ( _sd_n > 0 )
						    {
						        if ( _glob_wnd_pending_status )
						        {
						            var _msg = "There is still one pending circle to be added to gens." ;
						                _msg += _glob_crlf + "Do you want to close this pop-up anyway ?" ;
						                _msg += _glob_crlf + "(if so, the circle will be lost)" ;
						            if ( confirm( _msg ) )
						            {
						                _glob_zplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID;
						                var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES,OUTPUT_SCREEN );
									          var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
										        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "18Unknown error" ;
										        if ( _ret_id == RET_ERROR )
										        {
																circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
																return NO ;
														}
														else
														{
								                circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
                                circles_lib_statusbar_update_elements();
								                return YES ;
														}
						            }
						            else return NO ;
						        }
						        else return YES ;
						    }
						    else
						    {
                    _glob_zplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID;
						        circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES,OUTPUT_SCREEN );
					          var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
						        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "19Unknown error" ;
						        if ( _ret_id == RET_ERROR )
						        {
												circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
												return NO ;
										}
										else
										{
				                circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
                        circles_lib_statusbar_update_elements();
				                return YES ;
										}
						    }
          circles_lib_popup_activate( NO, GLOB_PLUGIN_BASE_ID, '', '', GLOB_PLUGIN_SUBSET, CLOSE, GLOB_PLUGIN_DIV_ID,'' );
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
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