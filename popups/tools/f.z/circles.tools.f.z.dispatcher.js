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
					 var POPUP_INDEX = safe_int( arguments[1], 0 );
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

          circles_lib_popup_activate( NO, GLOB_PLUGIN_BASE_ID, '', '', GLOB_PLUGIN_SUBSET, CLOSE, GLOB_PLUGIN_DIV_ID,'' );
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_RELOAD:
                var _subset = _glob_popups_array[ POPUP_INDEX ][8] ;
                var _base_id = _glob_popups_array[ POPUP_INDEX ][12] ;
                circles_lib_popup_load( _subset, _base_id, NO ) ;
                break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
                break ;
			          case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
			          var _subset = _glob_popups_array[ POPUP_INDEX ][8] ;
			          var _base_id = _glob_popups_array[ POPUP_INDEX ][12] ;
			          circles_lib_popup_remotectrl_dispatch_to_service( _subset, _base_id, arguments ) ;
			          break ;
			          case POPUP_DISPATCHER_MULTICAST_EVENT_REMOTE_CONTROL:
			          break ;
                default: break ;
					 }
			}
}

function CIRCLEStoolsFZremotectrl( _options, _return_fn )
{
		if ( !is_array( _options ) )
		{
				if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
				return ;
		}
	  
		var _out_msg = "" ;
		switch( _options[0].toLowerCase() )
		{
				case "/*anyaction*/":
				break ;
				default: _out_msg = "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ; break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}