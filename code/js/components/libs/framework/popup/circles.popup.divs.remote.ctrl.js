/* POPUP OBJ FIELDS MAP
   0 : unique id        1 : div id             2 : caption             3 : status
   4 : visible          5 : height             6 : focus flag          7 : caption class
   8 : subset           9: calling fn (name)  10 : calling fn (params) 11: array of additional fns in the context menu
   12 : base_id (for dynamical reload of the pop-up wnd)
   13 : allow multiple instances of pop-up
   14 : rect obj for popup wnd pos and extents
*/

function circles_lib_popup_remotectrl_send()
{
    var _n_args = arguments.length ;
    var _unicast_flag = safe_int( arguments[0], NO );
    var _options_array = arguments[1] ;
    var _subset = is_array( _options_array ) ? safe_string( _options_array[0], "" ).trim().toLowerCase() : "" ;
    var _base_id = is_array( _options_array ) ? safe_string( _options_array[1], "" ).trim().toLowerCase() : "" ;
    var _cmd_id = is_array( _options_array ) ? safe_string( _options_array[2], "" ).trim().toLowerCase() : "" ;
    var _add_args = is_array( _options_array ) ? ( _options_array.length > 3 ? _options_array.from_to( 3, _options_array.length ) : [] ) : [] ;
    var _return_fn = arguments[2] ;
    var _return_fn_exists = typeof( _return_fn ) === "function" ? YES : NO ;
    if ( _n_args == 0 || _base_id.length == 0 ) return [ RET_ERROR, "Insufficient input params for activating the remote control" ] ;
    else
    {
    	 var _popup_obj_ref = circles_lib_popup_find_wnd( _base_id, POPUP_SEARCH_BY_BASE_ID, YES ) ;
    	 if ( _popup_obj_ref == null ) return [ RET_ERROR, "Please, open the window before activating the remote control" ] ;
    	 var _popup_index = circles_lib_popup_exists( _base_id, POPUP_SEARCH_BY_BASE_ID, YES ) ;
       var _msg_id = _unicast_flag ? "POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL" : "POPUP_DISPATCHER_MULTICAST_EVENT_REMOTE_CONTROL" ;
       var _prefix = "CIRCLES" + _subset.toLowerCase() + _base_id.replaceAll( [ "." ], "" ).toUpperCase() ;
       var _call_fn = _prefix + "dispatcher( " + _msg_id + ", " + _popup_index + ", " ;
           _call_fn += _options_array.work( function( _item ) { return "'"+_item+"'" ; } ).join( "," ) ;
           _call_fn += ", _return_fn );" ;
       try { eval( _call_fn ); }
       catch( _err ) { circles_lib_error_obj_handler( _err ); return [ RET_ERROR, "Please, open the window before activating the remote control" ] ; }
       return [ RET_OK, "Remote control activated with success" ] ;
    }
}

function circles_lib_popup_remotectrl_dispatch_to_service( _subset, _base_id, arguments )
{
    var _action = safe_string( arguments[4], "" ), _options = [] ;
    // gathering input options
    for( var _a = 4 ; _a <= arguments.length - 2 ; _a++ ) _options.push( arguments[_a] ) ;
    var _return_fn = arguments[ arguments.length - 1 ] ;
    var _caption = _base_id.replaceAll( [ ".", "_" ], " " ) ;
    switch( _action.toLowerCase() )
    {
				case "commands":
				var _commands = null ;
				var _cmd = "_commands = CIRCLES"+_subset.toLowerCase()+( _base_id.replaceAll( [ ".", "_" ], "" ).toUpperCase() )+"remotectrlCOMMANDS" ;
				try{ eval( _cmd ) ; }
				catch( _err ){ circles_lib_error_obj_handler( _err ); _return_fn.call( this, "Commands have not been registered for '"+ _base_id.replaceAll( [ ".", "_" ], " " ) + "' service" ); }
				if ( _commands != null )
				{
						var _cols_width = [ 20 ], _startINDEX = 0, _row ;
       		  _row = "<lightgray>List of remote control actions for '"+_caption+"' service</lightgray>" ;
            _row += _glob_crlf + "<white>"+( new String( "Action" ) ).rpad( " ", _cols_width[_startINDEX] )+"</white>" ;
            _startINDEX++ ;
            _row += "<lightblue>Description</lightblue>" ;
            _return_fn.call( this, _row );
            var _keys = [] ;
            for( var _k in _commands ) _keys.push( _k );
            _keys.sort();
            $.each( _keys,
            				function( _i, _k )
            				{
											_startINDEX = 0 ;
						          _row = _glob_crlf + "<white>"+_k.rpad( " ", _cols_width[_startINDEX] )+"</white>" ;
											_startINDEX++ ;
						          _row += _commands[_k] ;
						          _return_fn.call( this, _row );
										}
									) ;
				}
				else
				{
						var _cmd_list = "<red>Critical error: can't return the command list for '"+_caption+"' service</red>" ;
						_return_fn.call( this, _cmd_list );
				}
				break ;
				case "open.params":
        var _params = null, _row = [] ;
				try{ eval( "_params = CIRCLES"+_subset+( _base_id.replaceAll( [ ".", "_" ], "" ).toUpperCase() )+"openPARAMS;" ) ; }
				catch( _err ){ circles_lib_error_obj_handler( _err ); _return_fn.call( this, _err.message ) ; }
        if ( is_json( _params ) )
        {
        		 var _keys_lev_1 = json_keys( _params ) ;
             $.each( _keys_lev_1,
             				 function( _j, _key_l1 )
             				 {
	             				 		_row = [] ;
	             				 		_row.push( "Param #"+(_j+1)+" <yellow>" + _key_l1 + "</yellow>" ) ;
             				 		  $.each( _params[ _key_l1 ],
																	function( _k, _key_l2 )
																	{
																			switch( _k.toLowerCase() )
																			{
																					case "desc": _row.push( _k.ucfirst() + " <lightblue>" + _key_l2 + "</lightblue>" ) ; break ;
																					case "values": _row.push( _k.ucfirst() + " <white>" + _key_l2 + "</white>" ) ; break ;
																			}
																	}
																);
													_row.push( "----------------" ) ;
             				 		  _return_fn.call( this, _row.join( _glob_crlf ) );
										 }
						 			 ) ;
        }
        else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing opening params specifications", _glob_app );
				break ;
				default:
				var _fn = "CIRCLES"+_subset+( _base_id.replaceAll( [ ".", "_" ], "" ).toUpperCase() )+"remotectrl( _options, _return_fn )" ;
				try{ eval( _fn ) ; } catch( _err ){ circles_lib_error_obj_handler( _err ); }
				break ;
		}
}