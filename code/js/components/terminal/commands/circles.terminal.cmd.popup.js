function circles_terminal_cmd_popup()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _help = NO ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['id'] = "" ;
         _params_assoc_array['all'] = NO ;
         _params_assoc_array['settings'] = [] ;
         _params_assoc_array['settings']['remote'] = [] ;
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "all", "available", "close", "list", "off", "on", "open", "release", "remote", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
             _p = _params_array[_i];
             if ( _p.toLowerCase().is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
             else if ( _p.toLowerCase().is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
             else if ( _p.toLowerCase().stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
             else if ( _p.toLowerCase().stricmp( "all" ) ) _params_assoc_array['all'] = YES ;
             else if ( _p.toLowerCase().is_one_of_i( "available", "close", "list", "open", "release", "remote" ) ) _params_assoc_array['action'] = _p ;
             else if ( _params_assoc_array['action'].toLowerCase().stricmp( "remote" ) ) _params_assoc_array['settings']['remote'].push( _p );
             else if ( _params_assoc_array['action'].toLowerCase().is_one_of( "available", "open" ) )
             {
             		if ( !is_array( _params_assoc_array['settings'][ _params_assoc_array['action'] ] ) )
								_params_assoc_array['settings'][ _params_assoc_array['action'] ] = [] ;
								
								_params_assoc_array['settings'][ _params_assoc_array['action'] ].push( _p );
						 }
             else if ( _p.testME( _glob_popup_id_regex_pattern ) ) _params_assoc_array['id'] = _p ;
             else
             {
                _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
             }
         }

         if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _out_channel );
         else if ( _params_assoc_array['keywords'] )
         {
             var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
             if ( _msg.length == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
             else
             {
                _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
             }
         }
         else if ( !_b_fail )
         {
             var _action = _params_assoc_array['action'], _row = "" ;
             switch( _action )
             {
             		 case "available" :
                 var _settings = _params_assoc_array['settings'][ 'available' ] ;
                 var _subset = is_array( _settings ) ? safe_string( _settings[0], "" ) : "" ;
                 if ( _subset.length == 0 )
                 {
                     _b_fail = YES, _error_str = "Missing input subset" ;
                 }
                 else
                 {
							       var vars = { tip: "",
							                    folder : "popups/" + _subset + "/",
							                    filter : "/^.*\.(ini)$/i",
																  exact : 0,
							                    search_params : "1,1,1,0" } ;
							       var _result = get_filedata_from_folder( "support/code/phpcode/svc/svc.filelist.php", "POST", false, vars );
							       if ( safe_size( _result, 0 ) == 0 )
							       {
												 circles_lib_output( _out_channel, DISPATCH_WARNING, "No available popup windows for subset '"+_subset+"'", _par_1, _cmd_tag );
										 		 break ;
										 }
							       var _rows = null, _crlf = "", _item, _archive = [] ;
										 var _extract_entries = [ "caption", "subset", "baseid", "starting_params" ] ;
							       $.each( _result,
							       				 function( _i, _data_chunk )
							       				 {
													      // crlf detection
 												        _crlf = _data_chunk.includes( CRLF_WIN ) ? CRLF_WIN : CRLF_NO_WIN ;
																_rows = _data_chunk.split( _crlf );
																_item = [] ;
																$.each( _rows,
																				function( _r, _row )
																				{
																						if ( _row.count( "=" ) == 1 ) // check syntax
																						{
																								$.each( _extract_entries,
																								function( _e, _ee )
																								{
																										if ( _row.toLowerCase().start_with( _ee ) )
																										_item[""+_ee] = ( _row.split( "=" ) )[1];
																								}
																								) ;
																						}
																				}
																		  ) ;
																_archive.push( _item ) ;
														 }
										 			 ) ;

		                 var _cols_width = [ 15, 25, 25, 36 ], _startINDEX = 0 ;
		                 			_row += "<lightgray>List of available pop-up windows in the '"+_subset+"' subset</lightgray>" ;
		                 			_row += _glob_crlf + "<gold>Open syntax example</gold> <lightgreen>popup open "+_subset+" general.options no zplane</lightgreen>" ;
		                      _row += _glob_crlf + "<snow>"+( new String( "Subset" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</snow>" ;
		                      _startINDEX++ ;
		                      _row += "<white>"+( new String( "Opening id" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</white>" ;
		                      _startINDEX++ ;
		                      _row += "<lightblue>"+( new String( "Popup caption" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</lightblue>" ;
		                      _startINDEX++ ;
		                      _row += "<snow>"+( new String( "Starting params" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</snow>" ;
		                 circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
		                 var _subset, _base_id, _caption, _visible ;
		                 $.each( _archive,
		                         function( _i, _chunk )
		                         {
																_subset = _chunk['subset'], _base_id = _chunk['baseid'], _caption = _chunk['caption'], _starting_params = _chunk['starting_params'] ;
		                         		_startINDEX = 0 ;
															  _row  = "<snow>"+_subset.rpad( " ", _cols_width[_startINDEX] )+"</snow>" ;
		                            _startINDEX++ ;
															  _row += "<lightblue>"+_base_id.rpad( " ", _cols_width[_startINDEX] )+"</lightblue>" ;
		                            _startINDEX++ ;
															  _row += "<white>"+_caption.rpad( " ", _cols_width[_startINDEX] )+"</white>" ;
		                            _startINDEX++ ;
		                            _row += "<lightblue>"+_starting_params.rpad( " ", _cols_width[_startINDEX] )+"</lightblue>" ;
		                            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
		                         }
		                       );
								 }
             		 break ;
                 case "close":
                 var _id = _params_assoc_array['id'] ;
                 if ( _params_assoc_array['all'] ) circles_lib_popup_close_all();
                 else if ( _caption.length == 0 )
                 {
                      var _msg = "Can't close: missing popup identifier" ;
                      circles_lib_output( _out_channel, DISPATCH_WARNING, _error_str, _par_1, _cmd_tag );
                 }
                 else
                 {
                      var _popup_ref_obj = circles_lib_popup_find_wnd( _id, POPUP_SEARCH_BY_BASE_ID, YES ) ;
                      var _subset = is_array( _popup_ref_obj ) ? _popup_ref_obj[8] : "" ;
                      var _base_id = is_array( _popup_ref_obj ) ? _popup_ref_obj[12] : "" ;
                      if ( _subset.length > 0 && _base_id ) circles_lib_popup_dispatcher_unicast_message( _subset, _base_id, POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ) ;
                 }
                 break ;
                 case "list":
                 var _cols_width = [ 14, 25, 30, 10 ], _startINDEX = 0 ;
                		 _row += "<lightgray>List of current open pop-up windows</lightgray>" ;
                     _row += _glob_crlf + "<lightblue>"+( new String( "Subset" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</lightblue>" ;
                     _startINDEX++ ;
                     _row += "<white>"+( new String( "Opening id" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</white>" ;
                     _startINDEX++ ;
                     _row += "<lightblue>"+( new String( "Popup caption" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</lightblue>" ;
                     _startINDEX++ ;
                     _row += "<snow>"+( new String( "Visible" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</snow>" ;
                 circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                 var _subset, _base_id, _caption, _visible ;
                 $.each( _glob_popups_array,
                         function( _i, _chunk )
                         {
                            _base_id = _chunk[12], _caption = _chunk[2], _visible = _chunk[4], _subset = _chunk[8] ;
                         		_startINDEX = 0 ;
													  _row  = "<lightblue>"+_subset.rpad( " ", _cols_width[_startINDEX] )+"</lightblue>" ;
                            _startINDEX++ ;
													  _row  += "<white>"+_base_id.rpad( " ", _cols_width[_startINDEX] )+"</white>" ;
                            _startINDEX++ ;
                            _row += "<lightblue>"+_caption.rpad( " ", _cols_width[_startINDEX] )+"</lightblue>" ;
                            _startINDEX++ ;
                            _row += "<"+(_visible?"green":COLOR_ERROR)+">"+(_visible?"yes":"no").rpad( " ", _cols_width[_startINDEX] )+"</"+(_visible?"green":COLOR_ERROR)+">" ;
                            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                         }
                       );
                 break ;
                 case "open":
                 var _open_settings = is_array( _params_assoc_array['settings']['open'] ) ? _params_assoc_array['settings']['open'] : [] ;
                 if ( safe_size( _open_settings, 0 ) == 0 )
                 {
                    var _msg = "Missing params to open the pop-up window" ;
                    circles_lib_output( _out_channel, DISPATCH_WARNING, _error_str, _par_1, _cmd_tag );
                 }
                 else if ( safe_size( _open_settings, 0 ) < 2 )
                 {
                 		_b_fail = YES, _error_str = "Insufficient open params: the subset and the caption must be specified" ;
                 }
                 else
                 {
										var _n_open = safe_size( _open_settings, 0 );
										var _subset = safe_string( _open_settings[0], "").toLowerCase() ;
                 		var _base_id = safe_string( _open_settings[1], "" );
                  	var _open_cmd = "circles_lib_popup_load( '"+_subset+"', '"+_base_id+"' %additional_arguments% );" ;
                  	if ( _n_open > 2 )
                  	{
		                  	var _params = [] ;
		                  	for( var _a = 2 ; _a < _n_open ; _a++ ) _params.push( "'"+_open_settings[_a]+"'" );
		                  	_open_cmd = _open_cmd.replaceAll( "%additional_arguments%", ", " + _params.join( "," ) ) ;
										}
										else _open_cmd = _open_cmd.replaceAll( "%additional_arguments%", "" ) ;
                    var _return_open = NO ;
                  	try{ eval( "var _return_open = " + _open_cmd + ";" ) }
                  	catch( _err ) { circles_lib_error_obj_handler( _err ) ; }
                    circles_lib_output( _out_channel, _return_open ? DISPATCH_SUCCESS : DISPATCH_ERROR, ( _return_open ? "Success" : "Failure" )+" in opening "+_subset+" "+_base_id, _par_1, _cmd_tag );
                    if ( !_return_open )
                    circles_lib_output( _out_channel, DISPATCH_WARNING, "Check whether input '"+_base_id+"' could have been mispelled or '"+_subset+"' is not the correct category, or mandatory params are missing", _par_1, _cmd_tag );
                 }
                 break ;
                 case "release":
                 circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                 break ;
                 case "remote":
                 var _options = is_array( _params_assoc_array['settings']['remote'] ) ? _params_assoc_array['settings']['remote'] : [] ;
                 var _n_options = safe_size( _options, 0 ) ;
                 if ( _n_options == 0 ) circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing options: remote control can't be activated", _par_1, _cmd_tag );
                 else if ( _out_channel == OUTPUT_TERMINAL )
                 {
							 		  var _remote_action = safe_string( _options[0], "" ) ;
							 		  var _ret_fn = function( _ret_msg ){ circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _ret_msg, _par_1, _cmd_tag ); }
							 		  var _ret_chunk = circles_lib_popup_remotectrl_send( YES, _options, _ret_fn ) ;
							 		  var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
							 		  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Incoherent return message" ;
							 		  if ( _ret_id == RET_ERROR )
							 		  {
												_b_fail = YES, _error_str = _ret_msg ;
										}
										else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
								 }
                 else circles_lib_output( _out_channel, DISPATCH_INFO, "Popup cmd works only in console mode", _par_1, _cmd_tag );
                 break ;
                 default: break ;
             }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
     }

     if ( _b_fail )
     circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}