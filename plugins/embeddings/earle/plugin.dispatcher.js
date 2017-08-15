function CIRCLESembeddingsEARLEdispatcher()
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
       var _idx = circles_lib_plugin_find_index( { subset : "embeddings", base_id : "earle" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 )
       if ( _idx == UNFOUND ) return 0 ;
			 switch( MESSAGE_ID )
			 {
          case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
	        circles_lib_forms_adjust_position( _glob_popups_array[_idx][1] ) ;
	        var _plugin_width = $( "#"+GLOB_PLUGIN_DIV_ID ).width(), _sw = $(window).width()
			    if ( _sw < _plugin_width ) circles_lib_plugin_maximize( _glob_popups_array[_idx][1] );
          break ;
		 			case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
          GLOB_PLUGIN_EVENT_PROPAGATION_MANAGEMENT( 1 );
		 			break ;
		 			case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
          GLOB_PLUGIN_EVENT_PROPAGATION_MANAGEMENT( 0 );
		 			break ;
		 			case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
          var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
          circles_lib_plugin_activate(NO,_base_id,'','',_subset,CLOSE,_glob_popups_array[_idx][1],'');
		 			break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_RELOAD:
          var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
          circles_lib_plugin_load( _subset, _base_id, NO ) ;
          break ;
          case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
          var _subset = _glob_popups_array[_idx][8], _base_id = _glob_popups_array[_idx][12] ;
          circles_lib_plugin_remotectrl_dispatch_to_service( _glob_popups_array[_idx][1], arguments ) ;
          break ;
          case POPUP_DISPATCHER_MULTICAST_EVENT_REMOTE_CONTROL:
          break ;
          default: break ;
			 }
	 }
}

function CIRCLESembeddingsEARLE_EVENTS( ctrl_id, event )
{
	  if ( event.stopPropagation )      event.stopPropagation();
	  if ( event.cancelBubble != null ) event.cancelBubble = true;

		switch( event.keyCode )
		{
			 case 13: // return
			 if ( ctrl_id == "PLUGIN_PARAM_D" )
			 {
 					 if ( _plugin_step_index == 0 )
           {
              CIRCLESembeddingsEARLE_INIT(NO,YES);
    				  CIRCLESembeddingsEARLE_COMP();
           }
           if ( _plugin_step_index == 0 ) GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
           else if ( _plugin_step_index == 0.1 ) { CIRCLESembeddingsEARLE_CONFIG(); GLOB_PLUGIN_WIZARD_STEP(1.1,YES); GLOB_PLUGIN_GENS_SHOW( YES ); }
           else if ( _plugin_step_index.is_one_of( 1.1, 2.1 ) )
           {
              if ( _plugin_step_index == 1.1 ) CIRCLESembeddingsEARLE_RECORD_PARAMS();
              GLOB_PLUGIN_WIZARD_STEP(2.1);
              GLOB_PLUGIN_GENS_SHOW( YES );
							circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;
           }
			 }
			 break ;
       default:
       if ( _plugin_step_index.is_one_of( UNDET, 2.1 ) ) GLOB_PLUGIN_WIZARD_STEP(0,NO);
       _plugin_step_index = 0 ;
       GLOB_PLUGIN_WIZARD_STEP(0,NO);
       break ;
		}
}