/* POPUP OBJ FIELDS MAP
   0 : unique id        1 : div id             2 : caption             3 : status
   4 : visible          5 : height             6 : focus flag          7 : caption class
   8 : subset           9: calling fn (name)  10 : calling fn (params) 11: array of additional fns in the context menu
   12 : base_id (for dynamical reload of the pop-up wnd)
   13 : allow multiple instances of pop-up
   14 : rect obj for popup wnd pos and extents
*/

function circles_lib_plugin_dispatcher_unicast_message()
{
		if ( arguments.length > 0 )
		{
			var _base_id = safe_string( arguments[0], "" ).trim().replace( /[\.\_\-]/g, "" );
			var _subset = safe_string( arguments[1], "" ).trim().replace( /[\.\_\-]/g, "" );
			var _message_id = safe_string( arguments[2], POPUP_DISPATCHER_UNICAST_EVENT_UNKNOWN ).trim();
			if ( _base_id.length > 0 && _subset.length > 0 && _message_id.length > 0 &&
           _message_id != POPUP_DISPATCHER_MULTICAST_EVENT_UNKNOWN )
			{
				 var _popup_index = circles_lib_plugin_find_index( { unique_id : _base_id, base_id : _base_id }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_UNIQUE_ID, 0 ) ;
				 _base_id = circles_lib_plugin_clean_baseid( _base_id ) ;
				 var _dispatcher_cmd = "CIRCLES" + _subset.toLowerCase() + _base_id.toUpperCase() + "dispatcher" ;
				 var _original_cmd = _dispatcher_cmd ;
				 var _j_args = [ "'"+_message_id+"'" ] ;
             _dispatcher_cmd += "(" ;
				 for( var _a = 3 ; _a < arguments.length ; _a++ ) _j_args.push( "'"+arguments[_a]+"'" );
				 _dispatcher_cmd += _j_args.join( "," );
				 _dispatcher_cmd += ( _j_args.length > 0 ? "," : "" ) + _popup_index;
				 _dispatcher_cmd += ");" ;
         if ( function_exists( _original_cmd ) )
         {
           var _ret = YES ;
 			 	   try { window.eval( _dispatcher_cmd ) ; }
     			 catch( _err ) { _ret = NO ; circles_lib_error_obj_handler( _err ); }
           return _ret ;
         }
         else return NO ;
			}
      else return NO ;
		}
    else return NO ;
}

function circles_lib_plugin_dispatcher_multicast_message()
{
	var _message_id = safe_string( arguments[0], POPUP_DISPATCHER_MULTICAST_EVENT_UNKNOWN );
    if ( _message_id != POPUP_DISPATCHER_MULTICAST_EVENT_UNKNOWN && _message_id.length > 0 )
    {
      var _base_id, _dispatcher_cmd, _j_args, _a, _original_cmd, _subset ;
      $.each( _glob_popups_array, function( _i, _popup_chunk )
      {
        _subset = safe_string( _popup_chunk[8], "" );
			  _base_id = safe_string( circles_lib_plugin_clean_baseid( _popup_chunk[12] ), "" );
        _dispatcher_cmd = "CIRCLES" + _subset.toLowerCase() + _base_id.replaceAll( [ "_", "." ], "" ).toUpperCase() + "dispatcher" ;
      	_original_cmd = _dispatcher_cmd ;
      	_j_args = [ "'"+_message_id+"'", _i ] ;
        _dispatcher_cmd += "(" ;
       	for( _a = 3 ; _a < arguments.length ; _a++ ) _j_args.push( "i" + arguments[_a] + "'" );
       	_dispatcher_cmd += _j_args.join( "," );
       	_dispatcher_cmd += ");" ;
        if ( function_exists( _original_cmd ) )
        {
          try{ return eval( _dispatcher_cmd ); }
          catch( _err ) { circles_lib_error_obj_handler( _err ); }
        }
      } );
    }
}

function circles_lib_plugin_focus_render( _b_update_list, _b_dispatch_focus_msg )
{
		_b_update_list = safe_int( _b_update_list, NO ), _b_dispatch_focus_msg = safe_int( _b_dispatch_focus_msg, YES ) ;
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), startINDEX ;
    var _unique_id, _div_id, _base_id, _subset, _caption_box, _caption_class, _status, _div, _b_sel, _focus_flag, _dispatch_cmd ;
    for( var _i = 0 ; _i < _len ; _i++ )
    {
      if ( is_array( _array[_i] ) )
      {
        startINDEX = 0 ;
        _unique_id = _array[_i][startINDEX].replaceAll( "#", "" );
        startINDEX++ ;
        _div_id = _array[_i][startINDEX] ;
        startINDEX++ ;
        _caption = _array[_i][startINDEX] ;
        startINDEX++ ;
        _status = safe_int( _array[_i][startINDEX], CLOSE );
        startINDEX = 6 ;
        _focus_flag = _array[_i][startINDEX] ;
        startINDEX = 8 ;
        _subset = _array[_i][startINDEX] ;
        startINDEX = 12 ;
        _base_id = _array[_i][startINDEX] ;

        _b_sel = _glob_popup_sel_unique_id.is_one_of_i( _unique_id, _div_id, _base_id ) ? YES : NO ;
        _div = $("#"+_div_id).get(0), _caption_box = $("#"+_div_id + "_caption").get(0);
        if ( _div != null ) $("#"+_div_id).zIndex( _b_sel ? 11 : 10 ) ;
        if ( _caption_box != null )
        {
          _caption_class = safe_string( _array[_i][7], "" ).trim() ;
          if ( _caption_class.length == 0 ) _caption_class = "popup_caption_bk_enabled" ;
          _caption_box.setAttribute( "class", _b_sel ? _caption_class : "popup_caption_bk_disabled" );
          _caption_box.style.color = _b_sel ? "white" : "#B0B0B0" ;
          _caption_box.style.fontWeight = _b_sel ? "bold" : "normal" ;
        }

        _glob_popups_array[_i][3] = _b_sel ? OPEN : CLOSE ;
        _glob_popups_array[_i][6] = _b_sel ? YES : NO ; // focus flag
        // dispatch notifications to all pop-ups here
        if ( _b_dispatch_focus_msg && _focus_flag != _glob_popups_array[_i][6] )
        {
          _dispatch_cmd = "CIRCLES"+_subset.toLowerCase()+( _base_id.replace( /[\.\_\-]/g, "" ) ).toUpperCase()+"dispatcher" ;
          if ( typeof _dispatch_cmd === "function" )
          {
            _dispatch_cmd += "('"+( _b_sel ? POPUP_DISPATCHER_UNICAST_EVENT_FOCUS : POPUP_DISPATCHER_UNICAST_EVENT_BLUR )+"',"+_i+")" ;
            try { eval( _dispatch_cmd ); } catch( _err ) { circles_lib_error_obj_handler( _err ); }
          }
        }
      }
    }

    if ( _b_update_list && _len > 0 )
    {
      var _ret_code = circles_lib_plugin_get_list();
      $("#POPUPDIVSarrayDIV").html( _ret_code != null ? _ret_code[0] : "" );
    }
}

function circles_lib_plugin_focus( _div_id, _dispatch_msg, event )
{
 		_div_id = safe_string( _div_id, "" ), _dispatch_msg = safe_int( _dispatch_msg, NO );
    if ( !_glob_popup_sel_unique_id.stricmp( _div_id ) )
    {
      // dispatch notifications to all pop-ups here
      _dispatch_msg = safe_int( _dispatch_msg, NO );
      _glob_popup_sel_unique_id = _glob_last_focus_divid = _div_id ;
      var _popup_obj = _div_id.length > 0 ? circles_lib_plugin_find_wnd( { div_id : _div_id }, POPUP_SEARCH_BY_DIV_ID, YES ) : null ;
    	circles_lib_plugin_focus_render( YES, _dispatch_msg );
    	// ... and to other classes of popups
    	if ( _glob_last_focus_divid.strcmp( "CIRCLESbarsSTATUSBARdiv" ) )
      $( "#CIRCLESbarsSTATUSBARdiv" ).zIndex( $( "#CIRCLESbarsSTATUSBARdiv" ).zIndex() - 1 ) ;
      return is_array( _popup_obj ) ? 1 : 0 ;
    }
    else return NO ;
}

function circles_lib_plugin_blur( _div_id, _dispatch_msg )
{
 		_div_id = safe_string( _div_id, "" ), _dispatch_msg = safe_int( _dispatch_msg, NO );
    var _ret = false, _cmd_str ;
    var _popup_obj = circles_lib_plugin_find_wnd( { div_id : _div_id }, POPUP_SEARCH_BY_DIV_ID, YES ) ;
    if ( is_array( _popup_obj ) )
    {
        _base_id = _popup_obj[12] ;
        if ( _popup_obj[6] )
        {
            try
            {
               _popup_obj[6] = NO ;
               if ( _dispatch_msg )
               {
                   _popup_div_id = _popup_div_id.replace( /([0-9]{1,})/g, "" );
                   _cmd_str = "CIRCLES"+_subset.toLowerCase()+_base_id.replace( /[\.\_\-]/g, "" ).toUpperCase()+"dispatcher( POPUP_DISPATCHER_UNICAST_EVENT_BLUR );" ;
                   eval( _cmd_str );
               }
            }
            catch( _err ) { circles_lib_error_obj_handler( _err ); }
        }
        
        _ret = true ;
    }
    return _ret ;
}