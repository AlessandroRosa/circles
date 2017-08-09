function CIRCLESformsDISCRETENESSLOCUSdispatcher()
{
  /* INDEX <---> arguments mapping
     0: message ID : identifier related to the message sent to this dispatcher function
     1: pop-up window ID : archive index of the registered pop-up window: it is required to find the related obj
                           and gain access to the stored features
     2 and more: arguments with index greater than 1 supply additional parameters, customizable for each message
  */
	if ( arguments.length > 0 )
  {
		var MESSAGE_ID = safe_string( arguments[0], POPUP_DISPATCHER_UNICAST_EVENT_UNKNOWN ), _idx = safe_int( arguments[1], 0 );
    var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "discreteness.locus" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 )
    if ( _idx == UNFOUND ) return 0 ;
		switch( MESSAGE_ID )
		{
      case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
      var _sw = $(window).width(), _sh = $(window).height() ;
      var _div_id = _glob_popups_array[ _idx ][1] ;
      var _suffix = _glob_popups_array[ _idx ][9] ;
      $("#"+_div_id).height( _sh - 70 ) ;
      CIRCLESformsDISCRETENESSLOCUSresize( $("#"+_div_id).width(), _sh - 70 ) ;
      CIRCLESformsDISCRETENESSLOCUSstopresize( $("#"+_div_id).width(), _sh - 70 ) ;

      circles_lib_forms_adjust_position( _div_id ) ;
      var _sw = $(window).width(), _sh = $(window).height() ;
      if ( _sw < $( "#"+_div_id ).width() )
      {
     		 var _resize_fns = [ "CIRCLESformsDISCRETENESSLOCUSmaximize", _div_id, "", "" ] ;
         circles_lib_plugin_maximize( _div_id, _resize_fns.join( "|" ) ) ;
			}
      break ;
      case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
      _glob_target_plane = D_LOCUS ;
			break ;
      case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
      _glob_target_plane = D_LOCUS ;
      CIRCLESformsDISCRETENESSLOCUSbindCANVASevents();
			CIRCLESformsDISCRETENESSLOCUSdrawCANVAS() ;
      var _ok_tab_0 = safe_int( _glob_current_tab['dlocus'], 0 ) == 0 ? YES : NO ;
      $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).css( "display", _ok_tab_0 ? "block" : "none" );
      $( "#CIRCLESdlocusworklayerCANVAS" ).css( "display", _ok_tab_0 ? "block" : "none" );
      if ( _ok_tab_0 )
      {
		     CIRCLESformsDISCRETENESSLOCUSworkLAYERmanagement( CIRCLESformsDISCRETENESSLOCUSdiv_id, NO, YES ) ;
			   $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).offset( $( "#CIRCLESdlocusdiagramCANVAS" ).offset() );
			}
      break ;
      case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
      CIRCLESformsDISCRETENESSLOCUSunbindCANVASevents();
      var _ret = circles_lib_plugin_blur( CIRCLESformsDISCRETENESSLOCUSbaseid, "forms", NO ) ;
      $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).css( "display", "none" );
      $( "#CIRCLESdlocusworklayerCANVAS" ).css( "display", "none" );
      CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX_CLICK(NO);
      CIRCLESformsDISCRETENESSLOCUSinitZOOMproc(NO);
      break ;
      case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
      if ( $("#"+CIRCLESformsDISCRETENESSLOCUSdiv_id ).resizable('instance') != undefined )
      $("#"+CIRCLESformsDISCRETENESSLOCUSdiv_id).resizable('destroy');

      if ( $("#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).get(0) != null )
      {
		    $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).css( "display", "none" );
		    $( "#CIRCLESdlocusworklayerCANVAS" ).css( "display", "none" );
        if ( $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).get(0) != null ) document.body.removeChild( $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).get(0) );
        if ( $( "#CIRCLESdlocusworklayerCANVAS" ).get(0) != null ) document.body.removeChild( $( "#CIRCLESdlocusworklayerCANVAS" ).get(0) );
			}
			if ( _glob_target_plane == D_LOCUS ) _glob_target_plane = _glob_persistent_vars['old_target_plane'] ;

      var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
      circles_lib_plugin_activate( NO, _base_id, '', '', _subset, CLOSE, _glob_popups_array[ _idx ][1],'' );
      break ;
		  case POPUP_DISPATCHER_UNICAST_EVENT_RELOAD:
      _glob_target_plane = D_LOCUS ;
              var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
		  circles_lib_plugin_load( _subset, _base_id, NO ) ;
		  break ;
      case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
      _glob_target_plane = D_LOCUS ;
			CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( [ 2, 8, 1, 64 ], YES ) ;
			break ;
		  case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
      _glob_target_plane = D_LOCUS ;
              var _subset = _glob_popups_array[ _idx ][8], _base_id = _glob_popups_array[ _idx ][12] ;
		  circles_lib_plugin_remotectrl_dispatch_to_service( _subset, _base_id, arguments ) ;
		  break ;
      default: break ;
		}
	}
}