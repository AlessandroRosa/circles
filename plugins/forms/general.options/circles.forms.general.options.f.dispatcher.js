function CIRCLESformsGENERALOPTIONSdispatcher()
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
          var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "general.options" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 )
         if ( _idx == -1 ) return 0 ;
			 switch( MESSAGE_ID )
			 {
          case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
          var _sw = $(window).width(), _sh = $(window).height() ;
          var _div_id = _glob_popups_array[ POPUP_INDEX ][1] ;
          var _suffix = _glob_popups_array[ POPUP_INDEX ][9] ;
          var _popup_height = $(window).height() - 90 ;
          if ( CIRCLESformsGENERALOPTIONStabindex.is_one_of( 2, 3 ) )
          {
              $("#"+_div_id).height( _sh - 70 ) ;
              $( "#GENERALOPTIONSlayerslistCONTAINER" ).height( _popup_height - 95 );
          }

          circles_lib_forms_adjust_position( _div_id ) ;
          break ;
          case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
          break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
          break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
          break ;
		      case POPUP_DISPATCHER_UNICAST_EVENT_RELOAD:
              var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
		      circles_lib_plugin_load( _subset, _base_id, NO ) ;
		      break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
          _glob_wplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID ;
					if ( $("#" + CIRCLESformsGENERALOPTIONSdiv_id).resizable('instance') != undefined )
          $("#" + CIRCLESformsGENERALOPTIONSdiv_id).resizable('destroy');

          var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
          circles_lib_plugin_activate( NO, _base_id, '', '', _subset, CLOSE, _glob_popups_array[ _idx ][1],'' );
          break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
      		var TAB_INDEX = safe_float( arguments[2], CIRCLESformsGENERALOPTIONStabindex );
          circles_lib_plugin_load('forms','general.options', NO, TAB_INDEX );
          break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
              var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
          circles_lib_plugin_remotectrl_dispatch_to_service( _subset, _base_id, arguments ) ;
          break ;
					case 2.1:
				  CIRCLESformsGENERALOPTIONSlayersINITcanvasTHUMBNAILS( W_PLANE, [] );
					break ;
          case 2.2:
          _glob_current_tab['generaloptions'] = safe_int( _glob_current_tab['generaloptions'], 0 ) ;
          if ( _glob_current_tab['generaloptions'] == 1 ) // basics
          {
              $( "#CIRCLESgeneraloptionsLASTPTcoordsEDIT" ).val( is_complex( _glob_last_pt ) ? _glob_last_pt.formula() : "0" );
          }
          break ;
	        default: break ;
			 }
		}
}