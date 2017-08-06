function CIRCLEStoolsFZdispatcher()
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
          var _idx = circles_lib_plugin_find_index( { subset : "tools", base_id : "f.z" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 )
         if ( _idx == UNFOUND ) return 0 ;
					 switch( MESSAGE_ID )
					 {
                case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
                var _div_id = _glob_popups_array[ POPUP_INDEX ][1] ;
                circles_lib_forms_adjust_position( _div_id ) ;
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
                $( "#popup_floating_box" ).hide();
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
                $( "#popup_floating_box" ).hide();
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
                $( "#popup_floating_box" ).hide();

              var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
              circles_lib_plugin_activate( NO, _base_id, '', '', _subset, CLOSE, _glob_popups_array[ _idx ][1],'' );
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_RELOAD:
              var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
                circles_lib_plugin_load( _subset, _base_id, NO ) ;
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
                break ;
			          case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
              var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
			          circles_lib_plugin_remotectrl_dispatch_to_service( _subset, _base_id, arguments ) ;
			          break ;
			          case POPUP_DISPATCHER_MULTICAST_EVENT_REMOTE_CONTROL:
			          break ;
                default: break ;
					 }
			}
}

function CIRCLEStoolsFZremotectrl( _options, _return_fn, _out_channel )
{
		if ( !is_array( _options ) && typeof _return_fn === "function" )
		{
			 _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
			 return 0 ;
		}

		var _out_msg = "" ;
		switch( _options[0].toLowerCase() )
		{
				case "/*anyaction*/":
        return 1 ;
				break ;
				default:
        _out_msg = "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ;
        return 0 ;
        break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}