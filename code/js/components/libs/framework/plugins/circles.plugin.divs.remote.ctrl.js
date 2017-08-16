/* PLUGIN OBJ FIELDS MAP
   0 : unique id        1 : div id             2 : caption             3 : status
   4 : visible          5 : height             6 : focus flag          7 : caption class
   8 : subset           9: calling fn (name)  10 : calling fn (params) 11: array of additional fns in the context menu
   12 : base_id (for dynamical reload of the pop-up wnd)
   13 : allow multiple instances of pop-up
   14 : rect obj for popup wnd pos and extents
*/

function circles_lib_plugin_remotectrl_dispatch_to_service( _div_id )
{
    _subset = safe_string( _subset, "" ), _base_id = safe_string( _base_id, "" ) ;
    var _idx = circles_lib_plugin_find_index( { div_id : _div_id }, POPUP_SEARCH_BY_DIV_ID, 0 )
    var _action = safe_string( arguments[4], "" ).trim(), _options = [] ;
    // gathering input options
    for( var _a = 2 ; _a <= arguments.length ; _a++ ) _options.push( arguments[_a] ) ;
    var _return_fn = arguments[ arguments.length - 1 ] ;
    var _subset = _idx != UNFOUND ? _glob_popups_array[_idx][8] : "", _base_id = _idx != UNFOUND ? _glob_popups_array[_idx][12] : "" ;
    var _clean_base_id = _base_id.replace( /[\.\_\-]/g, "" ) ;
    switch( _action.toLowerCase() )
    {
				case "commands":
				var _commands = null ;
				var _cmd = "_commands = " + "CIRCLES"+_subset.toLowerCase()+_clean_base_id.toUpperCase()+"remotectrlCOMMANDS" ;
				try{ eval( _cmd ) ; }
				catch( _err ){ circles_lib_error_obj_handler( _err ); _return_fn.call( this, "Commands have not been registered for '"+ _base_id.replaceAll( /[\.\_\-]/g, " " ) + "' service" ); }
				if ( _commands != null )
				{
						var _cols_width = [ 20 ], _startINDEX = 0, _row ;
       		  _row = "<lightgray>List of remote control actions for '"+_clean_base_id+"' service</lightgray>" ;
            _row += _glob_crlf + "<white>"+( new String( "Action" ) ).rpad( " ", _cols_width[_startINDEX] )+"</white>" ;
            _startINDEX++ ;
            _row += "<lightblue>Description</lightblue>" ;
            _return_fn.call( this, _row );
            var _keys = [] ;
            for( var _k in _commands ) _keys.push( _k );
            _keys.sort();
            $.each( _keys, function( _i, _k )
            				{
											_startINDEX = 0 ;
						          _row = _glob_crlf + "<white>"+_k.rpad( " ", _cols_width[_startINDEX] )+"</white>" ;
											_startINDEX++ ;
						          _row += _commands[_k] ;
						          _return_fn.call( this, _row );
										} ) ;
				}
				else
				{
						var _cmd_list = "<red>Critical error: can't return the command list for '"+_clean_base_id+"' service</red>" ;
						_return_fn.call( this, _cmd_list );
				}
				break ;
				case "open.params":
        var _params = null, _row = [] ;
				try{ eval( "_params = CIRCLES"+_subset.toLowerCase()+_clean_base_id.toUpperCase()+"openPARAMS;" ) ; }
				catch( _err ){ circles_lib_error_obj_handler( _err ); _return_fn.call( this, _err.message ) ; }
        if ( is_json( _params ) )
        {
        		 var _keys_lev_1 = json_keys( _params ) ;
             $.each( _keys_lev_1, function( _j, _key_l1 )
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
										 } ) ;
        }
        else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing opening params specifications", _glob_app );
				break ;
				default:
				var _fn = "CIRCLES"+_subset.toUpperCase()+_clean_base_id.toUpperCase()+"remotectrl( _options, _return_fn, _out_channel )" ;
				try{ eval( _fn ) ; } catch( _err ){ circles_lib_error_obj_handler( _err ); }
				break ;
		}
}