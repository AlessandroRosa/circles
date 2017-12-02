function circles_terminal_cmd_storage()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _output_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose && _glob_terminal_echo_flag )
     circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _plane = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];
     var _out_stream = [] ;

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
        _params_assoc_array['help'] = NO ;
        _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
        _params_assoc_array['keywords'] = NO ;
        _params_assoc_array['all'] = NO ;
        _params_assoc_array['action'] = "" ;
        _params_assoc_array['extras'] = [] ;
        _params_assoc_array['index'] = [] ;
        _params_assoc_array['labels'] = [] ;
        _params_assoc_array['roundto'] = _glob_accuracy ;

        var _operators = [ "<", "<=", "=", ">", ">=" ] ;
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); 

 			  var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
	 		  _params_assoc_array['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
			  _params_assoc_array['dump_operator_index'] = _dump_operator_index ;
			  _params_assoc_array['dump_array'] = [];

	 		  _params_assoc_array['transfer_to'] = ( _params_array.indexOf( TERMINAL_TRANSFER_TO_OPERATOR ) != UNFOUND ) ? YES : NO ;
	 		  _params_assoc_array['transfer_from'] = ( _params_array.indexOf( TERMINAL_TRANSFER_FROM_OPERATOR ) != UNFOUND ) ? YES : NO ;

			  // gather all dump parameters into one array
        if ( _params_assoc_array['dump'] )
        {
  				 for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
  				 if ( _params_array[_i].trim().length > 0 ) _params_assoc_array['dump_array'].push( _params_array[_i] );
        }

         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "add", "datatypes", "keys", "list", "long", "reset", "restore", "purge", "exists",
						 																"remove", "copy", "size", "screen", "search", "subkeys", "release", "html", "help",
						 																"check", "complex", "farey", "fraction", "line", "point", "rect", "string" );
         _local_cmds_params_array = _local_cmds_params_array.concat( _glob_storage.keys_associative() );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p, _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
              _p = _params_array[_i].trim() ;
              if ( safe_size( _p, 0 ) == 0 ) continue ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.is_one_of_i( "all", "export" ) ) _params_assoc_array['extras'].push( _p.toLowerCase() ); // 'all' can't be applied to send/pull action
              else if ( _p.is_one_of_i( "add", "copy", "create", "datatypes", "exists", "reset", "search", "keys", "list",
                                        "purge", "remove", "restore", "size", "subkeys", "release" ) )
                   _params_assoc_array['action'] = _p.toLowerCase();
              else if ( circles_lib_storage_parse_dependencies_syntax( _p, "check" ) )
              {
									 if ( !is_array( _params_assoc_array['extras']['storageref'] ) ) _params_assoc_array['extras']['storageref'] = [] ;
									 _params_assoc_array['extras']['storageref'].push( _p ) ;
							}
              else if ( _p.testME( _glob_integer_regex_pattern ) ) _params_assoc_array['index'].push( _p );
              else if ( /([0-9\.]{1,})/.test( _p ) )
              {
									 if ( !is_array( _params_assoc_array['numbers'] ) ) _params_assoc_array['numbers'] = [] ;
									 _params_assoc_array['numbers'].push( _p );
							}
              else if ( _operators.includes( _p ) )
              {
									 if ( !is_array( _params_assoc_array['operators'] ) ) _params_assoc_array['operators'] = [] ;
									 _params_assoc_array['operators'].push( _p );
							}
              else if ( _p.one_in_i( "circle", "complex", "farey", "fraction", "line", "point", "rect", "string" ) )
              {
									 if ( !is_array( _params_assoc_array['extras']['items'] ) ) _params_assoc_array['extras']['items'] = [] ;
									 _params_assoc_array['extras']['items'].push( _p ) ;
							}
              else if ( _p.toLowerCase().start_with( "roundto:" ) )
              {
                  _p = safe_int( _p.replaceAll( "roundto:", "" ), 0 ) ;
                  if ( _p <= 0 )
                  {
                      _p = _glob_accuracy ;
                      circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid value or zero detected for 'roundto' param: reset to current setting ("+_glob_accuracy+")", _par_1, _cmd_tag );
                  }
                  else if ( _p > DEFAULT_MAX_ACCURACY )
                  {
                      _p = _glob_accuracy ;
                      circles_lib_output( _output_channel, DISPATCH_WARNING, "Maximum ("+DEFAULT_MAX_ACCURACY+") exceeded by 'roundto' param: reset to current setting ("+_glob_accuracy+")", _par_1, _cmd_tag );
                  }
                   
                  _params_assoc_array['roundto'] = _p ;
              }
			else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
         }
         
         if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _output_channel );
         else if ( _params_assoc_array['keywords'] )
         {
             var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
             if ( _msg.length == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
             else
             {
                 _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                 circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
             }
         }
         else if ( !_b_fail )
         {
              var _action = _params_assoc_array['action'] ;
              var _extras = _params_assoc_array['extras'] ;
              var _extras_all = _extras.includes( "all" );
              var _round_to = _params_assoc_array['roundto'] ;
              switch( _action )
              {
                    case "release":
                    circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                    break ;
                    case "add":
                    var _ret = 0, _size = 0 ;
                    var _all = _extras_all ? YES : NO ;
                    var _storageref = _all ? circles_lib_storage_parse_dependencies_syntax( null, "all" ) : _params_assoc_array['extras']['storageref'] ;
                    if ( !is_array( _storageref ) ) _storageref = [ _storageref ] ;
                    var _n_dependencies = safe_size( _storageref, 0 );
                    var _items = _params_assoc_array['extras']['items'], _items_n = safe_size( _items, 0 ) ;
                    if ( is_array( _storageref ) && _n_dependencies > 0 && _items_n > 0 )
                    {
												var _datatypes = [] ;
                        $.each( _items, function( _i, _expr ){ _datatypes.push( circles_lib_datatype_detect_from_expression( _expr ) ) ; } ) ;
                        var _datatypes_expr = safe_size( _datatypes, 0 ) > 1 ? "objects" : _datatypes.subset(1).join( "" ) ;
                        var _n_expr = safe_size( _datatypes_expr, 0 );
                        
                        $.each( _storageref,
																function( _i, _dependency )
																{
																		_ret = circles_lib_storage_parse_dependencies_syntax( _dependency, _action, _items ) ;
																		switch( _ret )
																		{
																				case YES:
																				_items_n = safe_size( _items, 0 );
																				_error_str = "<green>"+_items_n+" "+_datatypes_expr+( _items_n == 1 ? " has" : " have" )+" been correctly added to storage subset</green> <snow>"+_dependency+"</snow>" ;
                                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _error_str, _par_1, _cmd_tag );
																				break ;												
																				case NO:
																				_error_str = "<orange>No objects have been added to</orange> <snow>"+_dependency+"</snow>" ;
                                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _error_str, _par_1, _cmd_tag );
																				break ;
																				default:
																				_error_str = "<red>Unknown error while trying to add object"+(_n_expr==1?"":"s")+" to storage subset</red> <snow>"+_dependency+"</snow>" ;
                                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _error_str, _par_1, _cmd_tag );
																				break ;												
																		}
																}
															) ;
										}
										else
										{
												if ( !is_array( _storageref ) || _n_dependencies == 0 )
												circles_lib_output( OUTPUT_TERMINAL, DISPATCH_ERROR, "Fail to add: invalid storage subset", _par_1, _cmd_tag );
												else if ( _items == 0 )
												circles_lib_output( OUTPUT_TERMINAL, DISPATCH_ERROR, "Fail to add: missing or invalid input item", _par_1, _cmd_tag );
										}
                    break ;
                    case "copy":
                    var _ret = 0, _size = 0, _check, _msg ;
                    var _all = _extras_all ? YES : NO ;
                    var _storageref = _all ? circles_lib_storage_parse_dependencies_syntax( null, "all" ) : _params_assoc_array['extras']['storageref'] ;
                    if ( !is_array( _storageref ) ) _storageref = [ _storageref ] ;
                    var _n_dependencies = safe_size( _storageref, 0 );

                    if ( is_array( _storageref ) && _n_dependencies > 0 )
                    {
			                    $.each( _storageref,
			                            function( _i, _dependency )
			                            {
			                                if ( !circles_lib_storage_parse_dependencies_syntax( _dependency, "exists" ) ) return YES ;
			                                _storage_ref = circles_lib_storage_parse_dependencies_syntax( _dependency, "get" ) ;
																			switch( _dependency )
									                    {
                                           case "dict":
									                         if ( is_array( _glob_original_dict ) )
									                         {
											                          if ( _glob_original_dict.size_recursive() > 0 )
											                          {
												                             _storage_ref = _glob_original_dict.clone();
												                             _check = 1 ;
												                             _check &= is_array( _storage_ref ) ;
												                             _check &= _storage_ref.size_recursive() > 0 ? 1 : 0 ;
												                             _msg = _check ? "<green>All words in the dictionary have been copied into storage space</green> <snow>"+_dependency+"</snow> <green>with success</green>" : "<red>Storage destination error: can't perform copy of the whole dictionary into</red> <snow>"+_dependency+"</snow>" ;
                                                     circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _par_1, _cmd_tag );
											                          }
											                          else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<red>Can't copy : " + _ERR_33_04 + "</red>", _par_1, _cmd_tag );
																					 }
																					 else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<red>Can't copy : " + _ERR_33_04 + "</red>", _par_1, _cmd_tag );
									                         break ;
									                         case "farey":
			                                     if ( circles_lib_plugin_find_index( { subset : "forms", base_id : 'discreteness.locus' }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_SUBSET ) != UNFOUND )
			                                     {
			                                          var _ret_chunk = CIRCLESformsDISCRETENESSLOCUSfareyCOPY( NO, YES );
			                                          var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
			                                          var _ret_msg = safe_string( _ret_chunk[1], "Unknown response" );
                                                circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
			                                     }
			                                     else circles_lib_output( _output_channel, DISPATCH_WARNING, "Restoration can be currently performed when the Discreteness form form is active exclusively.", _par_1, _cmd_tag );
									                         break ;
									                         case "figures":
									                         break ;
									                         case "seeds":
									                         var _sd_n = safe_size( _glob_seeds_array, 0 );
									                         if ( _sd_n > 0 )
									                         {
									                             _storage_ref = _glob_seeds_array.clone();
									                             var _check = 1 ;
									                             _check &= is_array( _storage_ref ) ;
									                             _check &= safe_size( _storage_ref, 0 ) > 0 ? 1 : 0 ;
									                             var _msg = _check ? "<green>" + _sd_n + " seed"+( _sd_n == 1 ? " has" : "s have" )+" been copied into storage space</green> <snow>seeds</snow> <green>with success</green>" : "<red>Storage destination error: can't perform copy of the seeds</red>" ;
									                             circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
									                         }
									                         else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't copy seeds: " + _ERR_33_01, _par_1, _cmd_tag );
									                         break ;
									                         case "words":
									                         break ;
									                         default: // any other data type
									                         _b_fail = NO ;
									                         _error_str = "Can't copy: unknown '"+_dependency+"' data type" ;
									                         break ;
																			}
																	}
																);
		                    circles_lib_plugin_dispatcher_unicast_message( "storage.space", "forms", 1.0 );
                    }
                    break ;
                    case "create":
                    var _ret = 0, _level = 0, _subset ;
                    var _all = _extras_all ? YES : NO ;
                    var _storageref = _all ? circles_lib_storage_parse_dependencies_syntax( null, "all" ) : _params_assoc_array['extras']['storageref'] ;
                    if ( !is_array( _storageref ) ) _storageref = [ _storageref ] ;
                    var _n_dependencies = safe_size( _storageref, 0 );

                    if ( is_array( _storageref ) && _n_dependencies > 0 )
                    {
		                    $.each( _storageref,
		                    			  function( _i, _dependency )
		                    			  {
																		_ret = circles_lib_storage_parse_dependencies_syntax( _dependency, _action ) ;
                                    _level = _dependency.count( "@" );
																		if ( _ret.is_one_of( YES, NO, EXISTS ) )
																		{
																				switch( _ret )
																				{
																						case YES:
                                            _subset = _dependency.includes( "@" ) ? _dependency.split( "@" ).get_last() : _dependency ;
																						_error_str = "<green>Storage space</green> <snow>"+_subset+"</snow> <green>of level</green> <snow>"+_level+"</snow> <green>with path</green> <snow>"+_storageref+"</snow> <green>has been created with success</green>" ;
                                            circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _error_str, _par_1, _cmd_tag );
																						break ;												
																						case NO:
																						_error_str = "<orange>Storage space</orange> <snow>"+_dependency+"</snow> <orange>has not been created</orange>" ;
                                            circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _error_str, _par_1, _cmd_tag );
																						break ;												
																						case EXISTS:
																						_error_str = "<orange>Storage space</orange> <snow>"+_dependency+"</snow> <orange>already exists</orange>" ;
                                            circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _error_str, _par_1, _cmd_tag );
																						break ;
																						default:
																						_error_str = "<red>Unknown error while trying to create the storage subset</red> <snow>"+_dependency+"</snow>" ;
                                            circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _error_str, _par_1, _cmd_tag );
																						break ;												
																				}
																		}
																		else
																		{
																				_error_str = "<red>Storage space</red> <snow>"+_dependency+"</snow> <red>has not been created due to a memory failure</red>" ;
                                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _error_str, _par_1, _cmd_tag );
																		}
																}
															) ;
										}
										else
										{
												_b_error = YES ;
												_error_str = "Missing input params" ;
										}
                    break ;
                    case "datatypes":
                    circles_lib_files_load_default_datatypes();
                    circles_lib_output( _output_channel, DISPATCH_INFO, "Currently registered datatypes", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_INFO, "\n", _par_1, _cmd_tag );
                    var _datatypes = circles_lib_datatype_get_table(YES), _notes_rows, _keys ;
                    var _columns = [], _out, _keys, _startINDEX = 0 ;
                        _columns.push( [ "Datatype", 12, "white" ] );
                        _columns.push( [ "Label", 12, "lightblue" ] );
                        _columns.push( [ "Notes (object)", 52, "white" ] );

  									// compute max length per each column
                    $.each( _datatypes,
										function( _i, _item )
										{
                        _keys = _item.keys_associative();
                        for( var _k = 0 ; _k < _keys.length ; _k++ )
                        {
                            if ( _keys[_k].toLowerCase() == "datatype_public" )
                            _columns[_k][1] = Math.max( _columns[_k][1], _item['datatype_public'].trim().length );
                            else if ( _keys[_k].toLowerCase() == "datatype_dev" )
                            _columns[_k][1] = Math.max( _columns[_k][1], _item['datatype_dev'].trim().length );
                        }
                    } );
                    
                    var _full_width = 0, _startINDEX = 0 ;
                    _columns[_startINDEX][1] += 2 ;
                    _full_width += _columns[_startINDEX][1] ;
                    
                    _startINDEX++ ;
                    _columns[_startINDEX][1] += 2 ;
                    _full_width += _columns[_startINDEX][1] ;

                    _startINDEX++ ;
                    _columns[_startINDEX][1] += 2 ;
                    _full_width += _columns[_startINDEX][1] ;

                    _full_width += 7 ;

                    _startINDEX = 0 ;
                    _out = "<"+_columns[_startINDEX][2]+">" + ( _columns[_startINDEX][0] ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                    _startINDEX++ ;
                    _out += "<"+_columns[_startINDEX][2]+">" + ( _columns[_startINDEX][0] ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                    _startINDEX++ ;
                    _out += "<"+_columns[_startINDEX][2]+">" + ( _columns[_startINDEX][0] ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;

                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out, _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_INFO, "\n", _par_1, _cmd_tag );

  									$.each( _datatypes,
										function( _i, _item )
										{
                        _startINDEX = 0 ;
                        if ( _item['datatype_public'] != null )
                        _out =  "<"+_columns[_startINDEX][2]+">" + _item['datatype_public'].trim().rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                        else
                        _out = "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;

                        _startINDEX++ ;
                        if ( _item['datatype_dev'] != null )
                        _out +=  "<"+_columns[_startINDEX][2]+">" + _item['datatype_dev'].trim().rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                        else
                        _out += "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                        
                        _startINDEX++ ;
                        if ( _item['notes'] != null )
                        {
                             _notes_rows = _item['notes'].length > _columns[_startINDEX][1] ? _item['notes'].match(new RegExp( ".{1,"+(_columns[_startINDEX][1]-7)+"}", "g" )) : [ _item['notes'] ] ;
                             _out += "<"+_columns[_startINDEX][2]+">" + _notes_rows[0].trim().rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                        }
                        else
                        _out += "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                        
                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out, _par_1, _cmd_tag );
                        
                        for( _k = 1 ; _k < _notes_rows.length ; _k++ )
                        {
                            _startINDEX = 0 ;
                            _out =  "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;

                            _startINDEX++ ;
                            _out +=  "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;

                            _startINDEX++ ;
                            if ( _notes_rows[_k] != null )
                            _out += "<"+_columns[_startINDEX][2]+">" + _notes_rows[_k].trim().rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                            else
                            _out += "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                            circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out, _par_1, _cmd_tag );
                        }
                        
                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, ("<lightgray>"+ new String( "" ) ).rpad( "-", _full_width )+"</lightgray>", _par_1, _cmd_tag );
                    }
                    );
                    break ;
                    case "exists":
                    var _ret = 0, _subset ;
                    var _all = _extras_all ? YES : NO ;
                    var _storageref = _all ? circles_lib_storage_parse_dependencies_syntax( null, "all" ) : _params_assoc_array['extras']['storageref'] ;
                    if ( !is_array( _storageref ) ) _storageref = [ _storageref ] ;
                    var _n_dependencies = safe_size( _storageref, 0 );

                    if ( is_array( _storageref ) && _n_dependencies > 0 )
                    {
		                    $.each( _storageref,
		                    			  function( _i, _dependency )
		                    			  {
																		_ret = circles_lib_storage_parse_dependencies_syntax( _dependency, _action ) ;
																		if ( _ret.is_one_of( YES, NO, EXISTS, NOT_EXISTS ) )
																		{
																				 switch( _ret )
																				 {
																				 		 case EXISTS:
																				 		 case YES:
																						 _error_str = "<green>Storage space</green> <snow>"+_dependency+"</snow> <green>exists</green>" ;
                                             circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _error_str, _par_1, _cmd_tag );
																				 		 break ;
                                             case NOT_EXISTS:
																				 		 case NO:
																						 _error_str = "<orange>Storage space</orange> <snow>"+_dependency+"</snow> <orange>does not exist</orange>" ;
                                             circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _error_str, _par_1, _cmd_tag );
																				 		 break ;
							                               default: break ;
																				 }
																		}
		                    			  }
		                    			);
		                }
										else
										{
												_b_error = YES ;
												_error_str = "Missing input params" ;
										}
                    break ;
                    case "keys":
                    var _keys = _glob_storage.keys_associative(), _out, _keys_size, _subkey_syntax, _subkeys, _n_subkeys, _key_size ;
                    var _n_keys = safe_size( _keys, 0 );
                    if ( !is_array( _keys ) ) _keys = [ "<orange>unknown</orange" ] ;
                    else if ( safe_size( _keys, 0 ) == 0 ) _keys = [ "<orange>no registered subsets</orange" ] ;
                    else
                    {
											_out = [], _keys_size = [] ;
	                    $.each( _keys, function( _i, _subkey )
	                    			  {
														 		_subkey_syntax = _subkey ;
														 		_subkeys = circles_lib_storage_parse_dependencies_syntax( _subkey_syntax, "subkeys" ) ;
                                _key_size = safe_size( _glob_storage[ _subkey ], 0 ) ;
														 		_n_subkeys = safe_size( _subkeys, 0 ) ;
                                _keys_size.push( "<snow>"+_subkey+"</snow>("+( _key_size == 0 ? "<gray>"+_key_size+"</gray>" : "<green>"+_key_size+"</green>" )+")" );
  													 		_out.push( "<snow>"+_subkey+"</snow>("+( _n_subkeys == 0 ? "<gray>"+_n_subkeys+"</gray>" : "<green>"+_n_subkeys+"</green>" )+")" );
															} );

											 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Found "+_n_keys+" storage subset"+(_n_keys==1?"":"s")+"</lightblue>", _par_1, _cmd_tag );
											 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<yellow>Keys and size are reported in parentheses per each entry</yellow>", _par_1, _cmd_tag );
											 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>"+_n_keys+"</snow> <lightblue>key"+( _n_keys == 1 ? "" : "s" )+" :</lightblue> "+_keys_size.join( ", " ), _par_1, _cmd_tag );
											 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<yellow>Subkeys amount is reported in parentheses per each entry</yellow>", _par_1, _cmd_tag );
											 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>subkey"+( _n_keys == 1 ? "" : "s" )+" :</lightblue> "+_out.join( ", " ), _par_1, _cmd_tag );
										}
                    break ;
                    case "list":
                    var _ret = 0, _subset, _dataformat ;
                    var _all = _extras_all ? YES : NO ;
                    var _storageref = _all ? circles_lib_storage_parse_dependencies_syntax( null, "all" ) : _params_assoc_array['extras']['storageref'] ;
                    if ( !is_array( _storageref ) ) _storageref = [ _storageref ] ;
                    var _n_dependencies = safe_size( _storageref, 0 );

                    var _k, _ref, _ret_filter, _ret_parse_group, _ret_parse_type, _ret_parse_array = [], _b_go, _out ;
                    var _dump = _params_assoc_array['dump'], _export = _extras.includes( "export" );
                    if ( _dump ) _glob_text = [] ;

                    _ref = _storageref ; // TEST IT !
                    if ( _ref == null )
                    {
                         _b_fail = YES, _error_str = "Can't return the list: invalid data type specification" ;
                    }
                    else if ( safe_size( _ref, 0 ) == 0 )
                    {
                         _b_fail = YES, _error_str = "Can't return the list: no elements found in storage space" ;
                         if ( _dump ) _error_str += _glob_crlf + "No dumping" ;
                    }
                    else
                    {
												var _max_length = 0, _n_formats = 0, _datatypes_array, _ref_size = 0 ;
                        var _html_columns = Math.floor( _glob_terminal.cols() / _max_length ) - 2 ;
                        var _html = "" ;
                        
                        _html += "<table>" ;
                   			$.each(	_storageref,
                   							function( _i, _dependency )
                   							{
																		if ( !circles_lib_storage_parse_dependencies_syntax( _dependency, "exists" ) )
                                    {
                                         circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Subset "+_dependency+"</lightblue> <orange>does not exist</orange>", _par_1, _cmd_tag );
                                         return YES ;
                                    }

																		_datatypes_array = circles_lib_storage_detect_dependency_datatype( _dependency ) ;
																		_n_dataformats = safe_size( _datatypes_array, 0 );

																		if ( _dependency.one_in_i( "dict", "farey" ) )
									                  {
									                      if ( _dependency.includes( "dict" ) )
									                      _ret_parse_array.work( function( _w ){ _max_length = Math.max( _max_length, _w.length ); } );
									                      else if ( _dependency.includes( "farey" ) )
									                      _ret_parse_array.work( function( _f ){ _max_length = Math.max( _max_length, _f.output( "std", "/" ).length ); } );
								                    }
                                    else _ret_parse_array = circles_lib_storage_parse_dependencies_syntax( _dependency, "get" ) ;
                                    
                                    _ref_size = safe_size( _ret_parse_array, 0 );

																		if ( !_datatypes_array.one_in_i( "dict", "farey" ) )
                                    {
    											              circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Data types pre-scan for storage subset</lightblue> <snow>"+_dependency+"</snow>", _par_1, _cmd_tag );
    											              circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected "+_n_dataformats+" data type"+(_n_dataformats==1?"":"s")+"</lightblue> <snow>"+_datatypes_array.join( ", " )+"</snow> <lightblue>in subset</lightblue> <snow>"+_dependency+"</snow>", _par_1, _cmd_tag );
                                        if ( _ref_size == 0 )
    											              circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>Subset</orange> <snow>"+_dependency+"</snow> <orange>is empty</orange>", _par_1, _cmd_tag );
                                        else
    											              circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Subset</lightblue> <snow>"+_dependency+"</snow> <lightblue>includes</lightblue> <snow>"+_ref_size+"</snow> <lightblue>element"+(_ref_size==1?"":"s")+"</lightblue>", _par_1, _cmd_tag );
                                    }
                                    else
                                    {
    										             	  _html += "<tr><td COLSPAN=\"5\">Data types pre-scan for storage subset "+_dependency+"</td></tr>" ;
    										             	  if ( _n_dataformats > 1 ) _html += "<tr><td COLSPAN=\"5\">Storage subset "+_dependency+" is hybrid</td></tr>" ;
    										             	  else if ( _n_dataformats == 1 ) _html += "<tr><td COLSPAN=\"5\">Detected "+_n_dataformats+" data type "+(_n_dataformats==1?"":"s")+" "+_datatypes_array.join( ", " )+" in "+_dependency+"</td></tr>" ;
                                        else if ( _n_dataformats == 0 ) _html += "<tr><td COLSPAN=\"5\">No data types detected</td></tr>" ;

                                        if ( _ref_size == 0 )
                                        _html += "<tr><td COLSPAN=\"5\">Subset "+_dependency+" is empty</td></tr>" ;
                                        else _html += "<tr><td COLSPAN=\"5\">Subset "+_dependency+" includes "+_ref_size+" element"+(_ref_size==1?"":"s")+"</td></tr>" ;
                                    }
											              
											              // read and process each item in the given storage subspace, according to its data type
                                    if ( _ref_size > 0 )
                                    $.each( _ret_parse_array,
	                                          function( _i, _item )
                                            {
                                                 _dataformat = circles_lib_datatype_detect_from_obj( _item );
                                                 switch( _dataformat )
						                                     {
						                                          case "circle":
						                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>"+(_i+1)+")</snow> "+_dataformat+" <snow>" + _item.output( "", _round_to ) + "</snow>", _par_1, _cmd_tag );
						                                          break ;
						                                          case "complex":
						                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>"+(_i+1)+")</snow> "+_dataformat+" <snow>" + _item.formula(0,1,_round_to) + "</snow>", _par_1, _cmd_tag );
						                                          break ;
						                                          case "2d point":
						                                          if ( is_point( _item ) )
						                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>"+(_i+1)+")</snow> "+_dataformat+" <snow>"+_item.output( "cartesian", _round_to ) + "</snow>", _par_1, _cmd_tag );
						                                          else
						                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>"+(_i+1)+" ) item does not include valid point data</orange>", _par_1, _cmd_tag );
						                                          break ;
						                                          case "dict":
						                                          if ( _i % _html_columns == 0 ) _html += "<tr>" ;
						                                          _html += "<td>"+_item+"</td>" ;
						                                          if ( _i % _html_columns == ( _html_columns - 1 ) ) _html += "</tr>" ;
						                                          else _html += "<td WIDTH=\"5\"></td>" ;
						                                          break ;
						                                          case "farey":
						                                          if ( _i % _html_columns == 0 ) _html += "<tr>" ;
						                                          _html += "<td>"+( is_array( _item ) ? _item.join( "/" ) : _item.output() )+"</td>" ;
						                                          if ( _i % _html_columns == ( _html_columns - 1 ) ) _html += "</tr>" ;
						                                          else _html += "<td WIDTH=\"5\"></td>" ;
						                                          break ;
						                                          case "figures":
						                                          _row = _CIRCLESfigure_display_list_item( _i, _item, _params_assoc_array );
						                                          if ( safe_size( _row, 0 ) > 0 )
						                                          {
						                                               circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
						                                               if ( _dump ) _glob_text.push( _row );
						                                          }
						                                          else 
						                                          circles_lib_output( _output_channel, DISPATCH_WARNING, "Fail to display figure item indexed at "+(_i+1), _par_1, _cmd_tag );
						                                          break ;
						                                          case "mobius map":
						                                          if ( is_mobius_map( _item ) )
						                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>"+(_i+1)+")</snow> "+_dataformat+" <snow>"+_item.output( " ", "coeffs", _round_to ) + "</snow>", _par_1, _cmd_tag );
						                                          else
						                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>"+(_i+1)+" ) item does not include valid mobius map data</orange>", _par_1, _cmd_tag );
						                                          break ;
						                                          case "seed":
						                                          if ( is_item_obj( _item ) )
                                                      {
                                                          var _msg = _item.output( "%%%", _round_to ) ;
                                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>#"+(_i+1)+") </snow> <white>"+_dataformat+"</white>", _par_1, _cmd_tag );
    						                                          circles_lib_terminal_multicolor_echo( _msg.replaceAll( "%%%", _glob_crlf ) );
    						                                          circles_lib_output( _output_channel, DISPATCH_INFO, "", _par_1, _cmd_tag );
                                                      }
						                                          else
						                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>"+(_i+1)+") item does not include valid seeds data</orange>", _par_1, _cmd_tag );
						                                          break ;
						                                          case "string":
						                                          if ( is_string( _item ) )
						                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>"+(_i+1)+")</snow> "+_dataformat+" <snow>" + _item + "</snow>" + ( _i < ( _n_parse - 1 ) ? _glob_crlf : "" ), _par_1, _cmd_tag );
						                                          else
						                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>"+(_i+1)+") item is nota valid string</orange>", _par_1, _cmd_tag );
						                                          break ;
						                                          case "words":
						                                          if ( is_string( _item ) )
						                                          {
						                                              _item = _item.strip_tags();
						                                              circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>"+(_i+1)+"</snow> <snow>" + _item + "</snow>", _par_1, _cmd_tag );
						                                              if ( _dump ) _glob_text.push( _item );
						                                          }
						                                          break ;
						                                          default: // any other data type
						                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>"+(_i+1)+"</snow> unknown <snow>" + JSON.stringify( $.terminal.escape_brackets( _item ) ) + "</snow>", _par_1, _cmd_tag );
						                                          if ( _dump ) _glob_text.push( _item );
						                                          break ;
						                                     }
																						}
																		 			) ;
																		else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>The storage subset</orange> <snow>"+_dependency+"</snow> <orange>is empty</orange>", _par_1, _cmd_tag );
																		_glob_terminal.echo( "" ); // a blank line
																}
												 			);

                        if ( _datatypes_array.one_of_i( "dict", "farey" ) )
                        {
                            _html += "</table>" ;
                            circles_lib_terminal_html_display( _glob_terminal, _html );
                        }
                        if ( _dump ) circles_lib_dump_data_to_format( _glob_text, _params_assoc_array['dump_array'][0] );
                        if ( _extras.includes( "export" ) )
												{
													 if ( _ret_id == RET_ERROR )
													 {
		 													 circles_lib_output( _output_channel, DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
		 													 circles_lib_output( _output_channel, DISPATCH_WARNING, "Export option has been switched off: no file will be thus created", _par_1, _cmd_tag );
		 													 _extras.delete_entry( "export" );
													 }
													 else
													 {
		 												 	 circles_lib_output( _output_channel, DISPATCH_INFO, "List filtered with success and exported to a file", _par_1, _cmd_tag );
															 _out_stream = _ret_parse_array.clone();
													 }
												}
                    }
                    break ;
                    case "purge":
                    var _ret = 0, _size = 0 ;
                    var _all = _extras_all ? YES : NO ;
                    var _storageref = _all ? circles_lib_storage_parse_dependencies_syntax( null, "all" ) : _params_assoc_array['extras']['storageref'] ;
                    if ( !is_array( _storageref ) ) _storageref = [ _storageref ] ;
                    var _n_dependencies = safe_size( _storageref, 0 );

                    var _count_contents = 0 ;
                    $.each( _storageref, function( _i, _ref ) { _count_contents += safe_size( _glob_storage[_ref], 0 ) ; } ) ;
                    if ( _count_contents == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "Storage subset '"+_storageref[0]+"' is already empty", _par_1, _cmd_tag );
                    else
                    {
                        var _data_str = _all ? "all" : _storageref.join( ", " ) ;
                        var _pre_prompt_question = _n_dependencies == 1 ? "Counting " + _count_contents + " element" + (_count_contents==1?"":"s") + " in the subset '"+_storageref[0]+"'" : "Counting " + _count_contents + " element" + (_count_contents==1?"":"s") + " from the whole selections" ;
                            _pre_prompt_question += _glob_crlf + ( _n_dependencies > 1 ? _n_dependencies + " purges will be applied." + _glob_crlf : "" ) ;
                        var _prompt_question = _all ? "Confirm to purge all storage subsets ?" : "Confirm to purge the storage subset"+( _n_dependencies == 1 ? "" : "s" )+" "+_data_str+" ? " ;
    					     		  var _question_array = [] ;
    							     	  	_question_array['prepromptquestion'] = _pre_prompt_question ;
    					             	_question_array['promptquestion'] = _prompt_question ;
    												_question_array['yes_fn'] = function()
    												 													  {
    											                                $.each( _storageref,
    											                                				function( _i, _dependency )
    											                                				{
                                                                      _size = _all ? 1 : circles_lib_storage_parse_dependencies_syntax( _dependency, "size" ) ;
    																																	if ( _size > 0 )
    																							                    {
    																																			_ret = circles_lib_storage_parse_dependencies_syntax( _dependency, "purge" ) ;
    																			                                if ( _ret.is_one_of( YES, NO, NOT_EXISTS ) )
    																			                                {
    																																					 switch( _ret )
    																																					 {
    																																					 		case YES:
    																								                              circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<green>Storage subset</green> <snow>"+_dependency+"</snow> <green>has been correctly purged</green>", _par_1, _cmd_tag );
    																																					 		break ;
    																																					 		case NO:
    																								                              circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>Can't purge storage subset</orange> <snow>"+_dependency+"</snow>", _par_1, _cmd_tag );
    																																					 		break ;
    																																					 		case NOT_EXISTS :
    																								                              circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>Can't purge: storage subset</orange> <snow>"+_dependency+"</snow> <orange>does not exist</orange>", _par_1, _cmd_tag );
    																																					 		break ;
																										                              default: break ;
    																																					 }
    																																			}
    																							                    }
    																							                    else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>Can't purge: the storage subspace</orange> <snow>"+_dependency+"</snow> <orange>is already empty</orange>", _par_1, _cmd_tag );
    																															}
    																														) ;
    																									  }
						if ( !_glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
    					else circles_lib_terminal_cmd_ask_yes_no( _question_array, _output_channel );
                        circles_lib_plugin_dispatcher_unicast_message( "storage.space", "forms", 1.0 );
                    }
                    break ;
                    case "remove":
                    var _ret = 0, _size = 0 ;
                    var _all = _extras_all ? YES : NO ;
                    var _storageref = _all ? circles_lib_storage_parse_dependencies_syntax( null, "all" ) : _params_assoc_array['extras']['storageref'] ;
                    if ( !is_array( _storageref ) ) _storageref = [ _storageref ] ;
                    var _n_dependencies = safe_size( _storageref, 0 );

                    var _data_str = _all ? "all" : _storageref.join( ", " ) ;
                    var _pre_prompt_question = _n_dependencies > 1 ? _n_dependencies + " removals will be applied." + _glob_crlf : "" ;
                    var _prompt_question = _all ? "Confirm to remove all storage subsets ?" : "Confirm to remove the storage subset"+( _n_dependencies == 1 ? "" : "s" )+" "+_data_str+" ? " ;
					     		  var _question_array = [] ;
							     	  	_question_array['prepromptquestion'] = _pre_prompt_question ;
					             	_question_array['promptquestion'] = _prompt_question ;
												_question_array['yes_fn'] = function()
														 											  {
													                             $.each( _storageref,
											                                				function( _i, _dependency )
											                                				{
																								                  _exists = circles_lib_storage_parse_dependencies_syntax( _dependency, "exists" ) ;
				  																												if ( _exists )
																							                    {
																			                                _ret = circles_lib_storage_parse_dependencies_syntax( _dependency, "remove" ) ;
																			                                if ( _ret.is_one_of( YES, NO, NOT_EXISTS ) )
																			                                {
																																					 switch( _ret )
																																					 {
																																					 			case YES:
																								                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<green>Storage subset</green> <snow>"+_dependency+"</snow> <green>has been correctly removed</green>", _par_1, _cmd_tag );
																																					 			break ;
																																					 			case NO:
																								                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>Can't remove storage subset</orange> <snow>"+_dependency+"</snow>", _par_1, _cmd_tag );
																																					 			break ;
																																					 			case NOT_EXISTS :
																								                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>Can't remove: storage subset</orange> <snow>"+_dependency+"</snow> <orange>does not exist</orange>", _par_1, _cmd_tag );
																																					 			break ;
																									                              default: break ;
																																					 }
																																			}
																													        }
																			                            else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>Can't remove: the storage subspace</orange> <snow>"+_dependency+"</snow> <orange>does not exist</orange>", _par_1, _cmd_tag );
																									     				}
																									     );
																									}
					if ( !_glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
					else circles_lib_terminal_cmd_ask_yes_no( _question_array, _output_channel );
                    circles_lib_plugin_dispatcher_unicast_message( "storage.space", "forms", 1.0 );
                    break ;
                    case "reset":
                    var _prompt_question = "Confirm to reset the storage space ?"  ;
					     		  var _question_array = [] ;
							     	  	_question_array['prepromptquestion'] = "Reset will takethe whole storage space back to the original status" ;
					             	_question_array['promptquestion'] = _prompt_question ;
												_question_array['yes_fn'] = function()
														 											  {
                                                          var _old_keys_n = circles_lib_storage_reset() ;
                                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<green>"+_old_keys_n+" key" + ( _old_keys_n == 1 ? " has" : "s have" ) + " been removed.</green>", _par_1, _cmd_tag );
                                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<green>Storage space has been reset to the original status with success</green>", _par_1, _cmd_tag );
                                                          var _new_keys = _glob_storage.keys_associative() ;
                                                          var _new_keys_n = safe_size( _new_keys, 0 );
                                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<green>Storage space now includes "+_new_keys_n+" new key" + ( _new_keys_n == 1 ? "" : "s" )+ "</green>", _par_1, _cmd_tag );
                                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<green>The new keys are</green> <snow>"+_new_keys.join( "</snow><green>,</green><snow>" )+"</snow>", _par_1, _cmd_tag );
																									  }
					if ( !_glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
					else circles_lib_terminal_cmd_ask_yes_no( _question_array, _output_channel );
                    circles_lib_plugin_dispatcher_unicast_message( "storage.space", "forms", 1.0 );
                    break ;
                    case "restore":
                    var _ret = 0, _size = 0 ;
                    var _all = _extras_all ? YES : NO ;
                    var _storageref = _all ? circles_lib_storage_parse_dependencies_syntax( null, "all" ) : _params_assoc_array['extras']['storageref'] ;
                    if ( _storageref == null )
                    {
                         circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't restore: missing input storage space subset", _par_1, _cmd_tag );
                         break ;
                    }
                    if ( !is_array( _storageref ) ) _storageref = [ _storageref ] ;
                    var _n_dependencies = safe_size( _storageref, 0 );
                    
                    var _data_str = _storageref.join( ", " ) ;
                    var _pre_prompt_question = "Restorations will copy the contents of the "+_glob_crlf+"storage subset to the proper data container" ;
                        if ( _n_dependencies > 1 ) _pre_prompt_question += _glob_crlf + _n_dependencies + " restorations will be applied." ;
                    var _prompt_question = "Confirm to restore the storage subset"+( _n_dependencies == 1 ? "" : "s" )+" "+_data_str+" ? " ;

					     		  var _question_array = [] ;
							     	  	_question_array['prepromptquestion'] = _pre_prompt_question ;
					             	_question_array['promptquestion'] = _prompt_question ;
												_question_array['yes_fn'] = function()
                                                  {
                    										$.each( _storageref,
                    										        function( _i, _dependency )
                    										        {
                                                    if ( !circles_lib_storage_parse_dependencies_syntax( _dependency, "exists" ) ) return YES ;
                                                    _storage_ref = circles_lib_storage_parse_dependencies_syntax( _dependency, "get" ) ;
                                                    _datatypes_array = circles_lib_storage_detect_dependency_datatype( _dependency ) ;

                    						                    switch( _dependency )
                    						                    {
                    						                         case "dict":
                    						                         if ( _storage_ref.size_recursive() > 0 )
                    						                         {
                    						                              _glob_original_dict = _storage_ref.clone();
                    						                              var _check = 1 ;
                    						                              _check &= is_array( _glob_original_dict ) ;
                    						                              _check &= _glob_original_dict.size_recursive() > 0 ;
                    						                              var _msg = _check ? "All words in the dictionary have been restored into current dictionary with success" : "Storage destination error: can't perform whole dictionary restoration" ;
                    						                              circles_lib_output( _output_channel, _check ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                    						                         }
                    						                         else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't restore data: the storage space includes no dictionary", _par_1, _cmd_tag );
                    						                         break ;
                    						                         case "farey":
                                                         if ( circles_lib_plugin_find_index( { subset : "forms", base_id : 'discreteness.locus' }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_SUBSET ) != UNFOUND )
                                                         {
                                                              var _ret_chunk = CIRCLESformsDISCRETENESSLOCUSfareyRESTORE( NO, YES );
                                                              var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
                                                              var _ret_msg = safe_string( _ret_chunk[1], "Unknown response" );
                                                              circles_lib_output( _output_channel, _ret_id? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                                                         }
                                                         else circles_lib_output( _output_channel, DISPATCH_WARNING, "Restoration can be currently performed when the Discreteness locus form is active exclusively.", _par_1, _cmd_tag );
                    						                         break ;
                    						                         case "figures":
                    						                         break ;
                    						                         case "seeds":
                    						                         if ( safe_size( _storage_ref, 0 ) > 0 )
                    						                         {
                    						                              _glob_seeds_array = _storage_ref.clone();
                    						                              var _check = 1 ;
                    						                              _check &= is_array( _glob_seeds_array ) ;
                    						                              _check &= safe_size( _glob_seeds_array, 0 ) > 0 ;
                    						                              var _msg = _check ? "All seeds have been restored into storage space with success" : "Storage destination error: can't restore seeds data" ;
                    						                              circles_lib_output( _output_channel, _check ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                    						                         }
                    						                         else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't restore data: the storage space includes no seeds", _par_1, _cmd_tag );
                    						                         break ;
                    						                         case "words":
                    						                         break ;
                    						                         default: // any other data type
                    						                         _b_fail = YES ;
                    						                         _error_str = "Can't restore: unknown '"+_datatypes_array+"' data type" ;
                    						                         break ;
                    																}
                    														}
                    												  );
                                                  }
					if ( !_glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
					else circles_lib_terminal_cmd_ask_yes_no( _question_array, _output_channel );
                    circles_lib_plugin_dispatcher_unicast_message( "storage.space", "forms", 1.0 );
                    break ;
                    case "search":
                    var _ret = 0, _size = 0 ;
                    var _all = _extras_all ? YES : NO ;
                    var _storageref = _all ? circles_lib_storage_parse_dependencies_syntax( null, "all" ) : _params_assoc_array['extras']['storageref'] ;
                    if ( !is_array( _storageref ) ) _storageref = [ _storageref ] ;
                    var _n_dependencies = safe_size( _storageref, 0 );

                    var _items = _params_assoc_array['extras']['items'], _items_n = 0, _ret = 0 ;
                        _items_n = safe_size( _items, 0 );
                    if ( is_array( _storageref ) && _n_dependencies > 0 && _items_n > 0 )
                    {
                        $.each( _storageref,
																function( _i, _dependency )
																{
																		_ret = circles_lib_storage_parse_dependencies_syntax( _dependency, _action, _items ) ;
                                    if ( is_array( _ret ) )
                                    {
                                         if ( safe_size( _ret, 0 ) == 0 )
                                         circles_lib_output( _output_channel, DISPATCH_CRITICAL, "Invalid or missing input data for performing the search", _par_1, _cmd_tag );
                                         else
                                         {
                                              var _subset = safe_string( _ret[0], "unknown" ).trim() ;
                                              var _datatype = safe_string( _ret[1], "unknown" ).trim() ;
                                              var _n_found = safe_int( _ret[2], 0 );
                                              
                                              if ( _n_found == 0 )
                                              circles_lib_output( _output_channel, DISPATCH_CRITICAL, "No elements of type '"+_datatype+"' found in storage subset '"+_subset+"'", _par_1, _cmd_tag );
                                              else
                                              circles_lib_output( _output_channel, DISPATCH_CRITICAL, _n_found + " element"+(_n_found==1?"":"s")+" of type '"+_datatype+"' found in storage subset '"+_subset+"'", _par_1, _cmd_tag );
                                         }
                                    }
                                    else circles_lib_output( _output_channel, DISPATCH_CRITICAL, "Invalid output data", _par_1, _cmd_tag );
                                }
                              );
                    }
                    else
                    {
                        if ( !is_array( _storageref ) )
                        circles_lib_output( _output_channel, DISPATCH_WARNING, "Search operation aborted: missing storage subset", _par_1, _cmd_tag );
                        if ( _items_n == 0 )
                        circles_lib_output( _output_channel, DISPATCH_WARNING, "Search operation aborted: missing input term to search", _par_1, _cmd_tag );
                    }
                    break ;
                    case "size":
                    var _ret = 0, _size = 0, _exists ;
                    var _all = _extras_all ? YES : NO ;
                    var _storageref = _all ? circles_lib_storage_parse_dependencies_syntax( null, "all" ) : _params_assoc_array['extras']['storageref'] ;
                    if ( !is_array( _storageref ) ) _storageref = [ _storageref ] ;
                    var _n_dependencies = safe_size( _storageref, 0 );

                    if ( !_all && _storageref.length == 0 )
                    circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing input storage subspace", _par_1, _cmd_tag );
                    else
                    {
                         if ( _all )
                         {
                              _storageref = _glob_storage.keys_associative() ;
                              circles_lib_output( _output_channel, DISPATCH_INFO, "Size report for all storage subsets", _par_1, _cmd_tag );
                         }
                    		 $.each( _storageref,
                    		 				 function( _i, _dependency )
                    		 				 {
																		 _exists = circles_lib_storage_parse_dependencies_syntax( _dependency, "exists" ) ;
                                     if ( _exists == NOT_EXISTS )
						                         circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>Storage space</orange> <snow>"+_dependency+"</snow> <orange>does not exist</orange>", _par_1, _cmd_tag );
                                     else
                                     {
    																		 _size = circles_lib_storage_parse_dependencies_syntax( _dependency, "size" ) ;
                                         _size = safe_int( _size, 0 );
    						                         circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Storage space</lightblue> <yellow>"+_dependency+"</yellow> <lightblue>subset includes</lightblue> <yellow>"+_size+"</yellow> <lightblue>entr" + ( _size == 1 ? "y" : "ies" ) + "</lightblue>", _par_1, _cmd_tag );
                                     }
																 }
												 			 ) ;
										}
                    break ;
                    case "subkeys":
                    var _ret = 0, _size = 0, _exists ;
                    var _all = _extras_all ? YES : NO ;
                    var _storageref = _all ? circles_lib_storage_parse_dependencies_syntax( null, "all" ) : _params_assoc_array['extras']['storageref'] ;
                    if ( !is_array( _storageref ) ) _storageref = [ _storageref ] ;
                    var _n_dependencies = safe_size( _storageref, 0 );

										var _keys = 0, _n_keys = 0, _subkey_syntax = "", _out = [], _subkeys, _n_subkeys ;
                    if ( is_array( _storageref ) )
                    {
                    		if ( _n_dependencies > 0 )
		                    $.each( _storageref,
		                    			  function( _i, _dependency )
		                    			  {
																		_keys = circles_lib_storage_parse_dependencies_syntax( _dependency, _action ) ;
																		if ( is_array( _keys ) )
																		{
																				 _n_keys = safe_size( _keys, 0 );
																				 _out = [] ;
																				 $.each( _keys, function( _i, _subkey )
																				 								{
																												 		_subkey_syntax = _dependency+"@"+_subkey ;
																												 		_subkeys = circles_lib_storage_parse_dependencies_syntax( _subkey_syntax, _action ) ;
																												 		_n_subkeys = safe_size(_subkeys,0) ;
																												 		_out.push( "<snow>"+_subkey+"</snow>("+( _n_subkeys == 0 ? "<gray>"+_n_subkeys+"</gray>" : "<green>"+_n_subkeys+"</green>" )+")" );
																												}
																							 ) ;
																				 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Found</lightblue> <snow>"+_n_keys+"</snow> <lightblue>subkey"+( _n_keys == 1 ? "" : "s" )+" of</lightblue> <yellow>"+_dependency+"</yellow> <lightblue>:</lightblue> "+_out.join( ", " ), _par_1, _cmd_tag );
																		}
																		else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>"+_dependency+"</snow> <lightblue>includes no subkeys</lightblue>", _par_1, _cmd_tag ); 
																}
															);
										}
										else circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing input subkeys", _par_1, _cmd_tag );
                    break ;
                    default:
                    if ( !_extras.includes( "export" ) )
                    {
    						        _b_fail = YES, _error_str = "Unknown action '"+_action+"'" ;
                    }
                    break ;
              }
              
              if ( _extras.includes( "export" ) )
              {
                   var _subset = safe_string( _datatypes_array[0], "" );
                   if ( safe_string( _subset, "" ).trim().length == 0 )
                   circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't export to a file: missing storage space subset specification", _par_1, _cmd_tag );
                   else
                   {
                       if ( _out_stream.size_recursive() == 0 && safe_string( _subset, "" ).trim().length > 0 )
                       _out_stream = _glob_storage[ _subset ] ;
                       
                       if ( !is_array( _out_stream ) )
                       circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't export to a file: storage space subset '"+_subset+"' is not consistent", _par_1, _cmd_tag );
                       else if ( _out_stream.size_recursive() > 0 )
                       {
                        	  circles_lib_output( _output_channel, DISPATCH_INFO, "Exporting '"+_subset+"' subset of storage space to a file", _par_1, _cmd_tag );
                            var _out_string = "" ;
                            switch( _subset )
                            {
                                 case "complex":
                                 $.each( _out_stream, function( _i, _z ) { _out_string += _z.formula() + _glob_crlf ; } );
                                 break ;
                                 case "farey":
                                 $.each( _out_stream, function( _i, _frac ) { _out_string += _frac.output( "std", "/" ) + _glob_crlf ; } );
                                 break ;
                                 case "circle":
                                 $.each( _out_stream, function( _i, _c ) { _out_string += _c.output() + _glob_crlf ; } );
                                 break ;
                                 case "point":
                                 $.each( _out_stream, function( _i, _pt ) { _out_string += _pt.output( "cartesian" ) + _glob_crlf ; } );
                                 break ;
                                 case "dict":
                                 _out_string = _out_stream.get_linear_array().join( _glob_crlf != null ? _glob_crlf : "\r\n" );
                                 break ;
                                 case "seeds":
                                 $.each( _out_stream, function( _i, _item ) { _out_string += _item.output() + _glob_crlf ; } );
                                 break ;
                                 case "words":
                                 _out_string = _glob_storage[_subset].join( _glob_crlf != null ? _glob_crlf : "\r\n" );
                                 break ;
                                 default: break ;
                            }

                            var _filename = "circles.storage." + _datatypes_array[0] + ".txt" ;
                            var blob = new Blob( [ _out_string ], { type: 'plain/text', endings: 'native' });
                            saveAs( blob, _filename );
                       }
                       else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't export to a file: storage space subset '"+_subset+"' is empty", _par_1, _cmd_tag );
                   }
              }
         }
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }

     if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}