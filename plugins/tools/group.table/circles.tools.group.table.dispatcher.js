function CIRCLEStoolsGROUPTABLEdispatcher()
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
         var _idx = circles_lib_plugin_find_index( { subset : "tools", base_id : "group.table" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 )
         if ( _idx == UNFOUND ) return NO ;
				 switch( MESSAGE_ID )
				 {
           case POPUP_DISPATCHER_UNICAST_EVENT_UPDATE:
           case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
           var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
           CIRCLEStoolsGROUPTABLEmain( _base_id, NO ) ;
           break ;
           case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
           var _div_id = _glob_popups_array[_idx][1] ;
           var _items_n = _glob_items_switch == ITEMS_SWITCH_SEEDS ? circles_lib_count_seeds() : circles_lib_gens_count();
           var OLD_W = $("#"+_div_id).width() ;
           var WIDTH = Math.max( Math.min( $(window).width(), _items_n * 140 ), OLD_W );

					 $("#"+_div_id).resizable( "option", "minWidth", 220 );
					 $("#"+_div_id).resizable( "option", "maxWidth", $( window ).width() );
           $("#"+_div_id).width( WIDTH );
           CIRCLEStoolsGROUPTABLEfill_div_with_mobius_maps();
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
           break ;
           case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
           var _div_id = _glob_popups_array[_idx][1] ;
           if ( $('#'+_div_id).resizable('instance') != undefined ) $("#"+_div_id).resizable('destroy');
           var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
           circles_lib_plugin_activate( NO, _base_id, '', '', _subset, CLOSE, _glob_popups_array[_idx][1],'' );
           break ;
		    case POPUP_DISPATCHER_MULTICAST_EVENT_REFRESH_CONTENTS:
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