function circles_terminal_cmd_plot()
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
     var _b_fail = 0, _cnt = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _symbols_array = [] ;
     var _inv_symbols_array = [] ;
     var _rotation_degree = 0, _rotation_radians = 0 ;
     var _sd_n = circles_lib_count_seeds();
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
             _params_assoc_array['action'] = "" ;
             _params_assoc_array['dump'] = NO ;
             _params_assoc_array['dump_array'] = null ;
             _params_assoc_array['dump_operator_index'] = UNDET ;
             _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
             _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
             _params_assoc_array['index'] = null ;
             _params_assoc_array['symbol'] = null ;
             _params_assoc_array['extras'] = [] ;
             
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "draw", "show", "compute", "all", "none", "map", "release", "exists", "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );

				 var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
				 _params_assoc_array['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
				 _params_assoc_array['dump_operator_index'] = _dump_operator_index ;
				 _params_assoc_array['dump_array'] = [];
				
				 // gather all dump parameters into one array
         if ( _params_assoc_array['dump'] )
         {
    				 for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
    				 if ( _params_array[_i].trim().length > 0 ) _params_assoc_array['dump_array'].push( _params_array[_i] );
         }
				 
         var _p ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
              _p = _params_array[_i] ;
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.is_one_of_i( "release", "draw" ) ) _params_assoc_array['action'] = _p.toLowerCase();
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.stricmp( "all" ) ) _params_assoc_array['extras']['all'] = YES ;
              else if ( _p.testME( _glob_symbol_regex_pattern ) )
              {
		 							 _symbols_array.push( _p );
                   circles_lib_output( _output_channel, DISPATCH_INFO, "Letter '"+_p+"' acquired as seed reference", _par_1, _cmd_tag );
							}
              else if ( circles_lib_storage_parse_dependencies_syntax( _p, "exists" ) )
              {
              		 if ( !is_array( _params_assoc_array['extras']['storageref'] ) )
              		 _params_assoc_array['extras']['storageref'] = [] ;
									 _params_assoc_array['extras']['storageref'].push( _p );
                   circles_lib_output( _output_channel, DISPATCH_INFO, "Term '"+_p+"' acquired as storage subset", _par_1, _cmd_tag );
							}
              else if ( circles_lib_datatype_detect_from_expression( _p ).trim().length > 0 )
              {
                   if ( !is_array( _params_assoc_array['extras']['items'] ) ) _params_assoc_array['extras']['items'] = [] ;
									 _params_assoc_array['extras']['items'].push( _p ) ;
                   circles_lib_output( _output_channel, DISPATCH_INFO, "The expression '"+_p+"' has been acquired as graphic object expression", _par_1, _cmd_tag );
							}
              else if ( _p.testME( _glob_number_regex_pattern ) )
              {
                   if ( _params_assoc_array['extras']['bordersize'] == null )
                   {
											 _params_assoc_array['extras']['bordersize'] = safe_float( _p, 0 ) ;
			                 circles_lib_output( _output_channel, DISPATCH_INFO, "Found integer #1: border size has been set to " + _p, _par_1, _cmd_tag );
									 }
									 else if ( _params_assoc_array['extras']['radius'] == null )
									 {
											 _params_assoc_array['extras']['radius'] = safe_float( _p, 0 ) ;
			                 circles_lib_output( _output_channel, DISPATCH_INFO, "Found integer #2: point radius has been set to " + _p, _par_1, _cmd_tag );
									 }
              }
              else if ( _p.stricmp( "none" ) )
              {
                   if ( _params_assoc_array['extras']['bordercolor'] == null )
                   {
                       _params_assoc_array['extras']['bordercolor'] = "transparent" ;
                       circles_lib_output( _output_channel, DISPATCH_INFO, "The color shade for drawing has been set to 'transparent'", _par_1, _cmd_tag );
                   }
                   else if ( _params_assoc_array['extras']['fillcolor'] == null )
                   {
                       _params_assoc_array['extras']['fillcolor'] = "transparent" ;
                       circles_lib_output( _output_channel, DISPATCH_INFO, "The color shade for filling has been set to 'transparent'", _par_1, _cmd_tag );
                   }
              }
              else if ( circles_lib_colors_is_def( _p ) )
              {
                   if ( _params_assoc_array['extras']['bordercolor'] == null )
                   {
                       _params_assoc_array['extras']['bordercolor'] = _p ;
                       circles_lib_output( _output_channel, DISPATCH_INFO, "'" + _p + "' has been acquired as color shade for drawing", _par_1, _cmd_tag );
                   }
                   else if ( _params_assoc_array['extras']['fillcolor'] == null )
                   {
                       _params_assoc_array['extras']['fillcolor'] = _p ;
                       circles_lib_output( _output_channel, DISPATCH_INFO, "'" + _p + "' has been acquired as color shade for filling", _par_1, _cmd_tag );
                   }
              }
              else if ( _p.is_one_of_i( "map" ) ) _params_assoc_array['extras'].push( _p ) ;
              else if ( _p.is_one_of_i( "zplane", "wplane" ) )
              {
									 _params_assoc_array['extras']['plane'] = _p ;
									 if ( _p.stricmp( "zplane" ) ) _p = "Z-plane" ;
									 else if ( _p.stricmp( "wplane" ) ) _p = "W-plane" ;
                   circles_lib_output( _output_channel, DISPATCH_INFO, "Selected plane for plot : " + _p, _par_1, _cmd_tag );
							}
              else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
         }

         var _selection_indexes_array = [], _obj_to_draw = [] ;
         var _all = _params_assoc_array['extras']['all'] != null ? _params_assoc_array['extras']['all'] : NO ;
         var _action = safe_string( _params_assoc_array['action'], "" ).trim() ;
         var _map_it = _params_assoc_array['extras'].includes_i( "map" ) ? YES : NO ;
         var _bordersize = safe_float( _params_assoc_array['extras']['bordersize'], UNDET ) ;
         var _radius = safe_float( _params_assoc_array['extras']['radius'], UNDET ) ;
         if ( _action.length == 0 )
         {
              circles_lib_output( _output_channel, DISPATCH_WARNING, "No valid input action detected: auto set to 'border'", _par_1, _cmd_tag );
              _action = "draw" ;
         }
         
				 /*  inputs gathering into one array of objects
				 		 list of sources
				 		 symbols >> Mobius maps
				 		 storage_ref >> subset of the storage space
				 		 items >> objects such as points, complexes, segments, circles ...
				 */
				 // SYMBOLS
         if ( _all )
         {
              if ( is_array( _symbols_array ) ) _symbols_array.flush();
              else _symbols_array = [];
              for( var _i = 0 ; _i < _sd_n ; _i++ )
              {
                   ITEM = _glob_seeds_array[_i] ;
                   if ( is_item_obj( ITEM ) ) _symbols_array.push( ITEM.symbol );
              }
         }

         _symbols_array = is_array( _symbols_array ) ? _symbols_array.unique().sort() : [] ;
         var _sel_n = safe_size( _symbols_array, 0 );
         if ( _sel_n > 0 && _sd_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't plot Mobius maps: no registered entries", _par_1, _cmd_tag );
         else if ( is_array( _symbols_array ) )
         {
             var ITEM = null, _index = UNFOUND ;
             $.each( _symbols_array,
             				 function( _i, _symbol )
             				 {
					                ITEM = circles_lib_find_item_obj_by_symbol( _glob_seeds_array, _symbol ).copy() ;
					                if ( is_item_obj( ITEM ) )
					                {
					                    if ( is_circle( ITEM.complex_circle ) && is_circle( ITEM.screen_circle ) )
					                    {
					                         if ( safe_size( _params_assoc_array['extras']['bordercolor'], 0 ) > 0 )
					                         {
					                             ITEM.screen_circle.draw = ITEM.complex_circle.draw = YES ;
					                             ITEM.screen_circle.bordercolor = ITEM.complex_circle.bordercolor = _params_assoc_array['extras']['bordercolor'] ;
					                             circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Border color set up to '"+_params_assoc_array['extras']['bordercolor']+"' with success for item '"+_symbol+"'", _par_1, _cmd_tag );
					                         }
					
					                         if ( safe_size( _params_assoc_array['extras']['fillcolor'], 0 ) > 0 )
					                         {
					                              ITEM.complex_circle.fill = YES ;
					                              ITEM.screen_circle.fill = YES ;
					                              ITEM.complex_circle.fillcolor = _params_assoc_array['extras']['fillcolor'] ;
					                              ITEM.screen_circle.fillcolor = _params_assoc_array['extras']['fillcolor'] ;
					                              circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Fill color set up to '"+_params_assoc_array['extras']['fillcolor']+"' with success for item '"+_symbol+"'", _par_1, _cmd_tag );
					                         }
					
					                         _obj_to_draw.push( ITEM );
					                         circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Circle obj in seed '"+_symbol+"' has been included with success", _par_1, _cmd_tag );
					                    }
					                    else circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing circle obj in seed '"+_symbol+"'", _par_1, _cmd_tag );
					                 }
					                 else circles_lib_output( _output_channel, DISPATCH_WARNING, "There exists no seed '"+_symbol+"' in the current archive", _par_1, _cmd_tag );
										}
						 			);
         }
				 // STORAGE SUBSETS
         var _storage_ref = _params_assoc_array['extras']['storageref'] ;
         if ( is_array( _storage_ref ) )
         {
              $.each( _storage_ref,
											function( _i, _ref )
											{
													_obj_to_draw = _obj_to_draw.concat( circles_lib_storage_parse_dependencies_syntax( _ref, "get" ) ) ;
													circles_lib_output( _output_channel, DISPATCH_INFO, "Storage subset '"+_ref+"' has been selected as input", _par_1, _cmd_tag );
											}
										) ;
         }
				 // ITEMS
         if ( is_array( _params_assoc_array['extras']['items'] ) )
         {
             var _datatypes = circles_lib_storage_detect_dependency_datatype( _params_assoc_array['extras']['items'] ) ;
             var _n_datatypes = safe_size( _datatypes, 0 ) ;
             if ( _n_datatypes > 0 )
             {
                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Scanning the input storage subset</lightblue> <snow>"+_storage_ref+"</snow> <lightblue>for datatypes</lightblue>" );
                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Found entries of type"+( _n_datatypes == 1 ? "" : "s" )+" : </lightblue><snow>" + _datatypes.join( "," ) + "</snow>" );
             }

						 var _cmd = "", _ret = YES, _added_items = 0, _how_many = safe_size( _params_assoc_array['extras']['items'], 0 ) ;
				 		 $.each( _params_assoc_array['extras']['items'],
				 		 				 function( _i, _obj )
				 		 				 {
			 		 				 		  _ret = YES ;
                        if ( is_string( _obj ) && circles_lib_datatype_is_string( _obj ) )
                        {
                        	 if ( _obj.includes( "complex" ) )
                        	 {
		 													  _obj = _obj.replaceAll( "complex", "point" ) ;
							                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Input</lightblue> <snow>complex</snow> <lightblue>number remapped to</lightblue> <snow>point</snow> <lightblue>for drawing</lightblue>" );
													 }
													 _cmd = "_obj_to_draw.push( new "+_obj.stripslashes()+" )" ;
												 	 try { eval( _cmd ) ; }
													 catch( _err )
													 {
													  	 _ret = NO ;
													  	 circles_lib_error_obj_handler( _err ) ;
													 }
												}
                        else _obj_to_draw.push( _obj );
												if ( _ret ) _added_items++ ;
										 }
									 );

         		 if ( _how_many > 0 )
         		 {
         				 if ( _added_items > 0 )
                 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<green>" + _added_items + " custom object over "+_how_many+" input entr" + ( _how_many == 1 ? "y" : "ies" ) + ( _added_items == 1 ? " has" : " have" )+" been sent to the plot / "+_action+" process </green>" );
         				 else
         				 circles_lib_output( _output_channel, DISPATCH_WARNING, "No custom objects have been added to the plot / "+_action+" process over "+_how_many+" input" + ( _how_many == 1 ? "" : "s" ), _par_1, _cmd_tag );
         	   }
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
         if ( !_b_fail && _params_assoc_array['help'] == NO )
         {
             if ( !_b_fail )
             {
                  var _plane = safe_string( _params_assoc_array['extras']['plane'], "zplane" ) ;
                  if ( safe_size( _plane, 0 ) == 0 ) _plane = "zplane" ;

				          switch( _action )
							    {
							        case "release":
							        circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
							        break ;
							        case "draw":
							        var _mapper = null, _context = null, _bordercolor = "", _fillcolor = "" ;
                      switch( _plane.toLowerCase() )
                      {
                           case "zplane":
													 _mapper = zplane_sm ;
													 _context = _glob_zplane_work_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ) ;
                           break ;
                           case "wplane":
													 _mapper = wplane_sm ;
													 _context = _glob_wplane_work_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ) ;
                           break ;
				 					         default: break ;
                      }
                      
                      if ( _plane.trim().length == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Plot aborted: missing output plane specification", _par_1, _cmd_tag );
                      else
                      {
    							         if ( safe_size( _obj_to_draw, 0 ) > 0 )
    							         {
    									          $.each( _obj_to_draw,
    									           				function( _i, _obj )
    									           				{
    																				if ( is_item_obj( _obj ) )
    																				{
                                                 _bordercolor = _obj.screen_circle.bordercolor.length == 0 ? safe_string( _params_assoc_array['extras']['bordercolor'], "" ) : _obj.screen_circle.bordercolor ;
                                                 _fillcolor = _obj.screen_circle.fillcolor.length == 0 ? safe_string( _params_assoc_array['extras']['fillcolor'], "" ) : _obj.screen_circle.fillcolor ;
    																						 circles_lib_draw_screen_disk( _context, "",
    																																	  _obj.screen_circle,
    																																		_obj.screen_circle.draw, _bordercolor,
    																																		_obj.screen_circle.fill, _fillcolor,
    																																		_bordersize > UNDET ? _bordersize : _obj.screen_circle.bordersize,
																																				_glob_opacity, 0 ) ;
    																				}
    																				else if ( is_point( _obj ) )
    																				{
                                                 _bordercolor = _obj.bordercolor.length == 0 ? safe_string( _params_assoc_array['extras']['bordercolor'], "" ) : _obj.bordercolor ;
                                                 _fillcolor = _obj.fillcolor.length == 0 ? safe_string( _params_assoc_array['extras']['fillcolor'], "" ) : _obj.fillcolor ;
                                                 _obj.radius = ( _obj.radius == 0 && _radius > 0 ) ? _radius : DEFAULT_PT_RADIUS ;
                                                 var _pt = circles_lib_draw_point( _context, _mapper,
              																															 _obj.x, _obj.y,
              																															 _bordercolor.length > 0 ? YES : NO, _bordercolor,
              																															 _fillcolor.length > 0 ? YES : NO, _fillcolor,
              																															 _bordersize > UNDET ? _bordersize : DEFAULT_PT_BORDER,
              																															 safe_float( _obj.radius, DEFAULT_PT_RADIUS ),
              																															 _glob_opacity, 0, _map_it ) ;
    																				}
    																				else if ( is_complex( _obj ) )
    																				{
                                                 _bordercolor = _obj.bordercolor.length == 0 ? safe_string( _params_assoc_array['extras']['bordercolor'], "" ) : DEFAULT_PT_BORDER_COLOR ;
                                                 _fillcolor = _obj.fillcolor.length == 0 ? safe_string( _params_assoc_array['extras']['fillcolor'], "" ) : DEFAULT_PT_INTERIOR_COLOR ;
    																						 circles_lib_draw_point( _context, _mapper,
    																															 _obj.real, _obj.imag,
    																															 _bordercolor.length > 0 ? YES : NO, _bordercolor,
                                                                   _fillcolor.length > 0 ? YES : NO, _fillcolor,
    																															 _bordersize > UNDET ? _bordersize : DEFAULT_PT_BORDER,
    																															 safe_float( _obj.radius, DEFAULT_PT_RADIUS ),
    																															 _glob_opacity, 0, YES ) ;
    																				}
    																				else if ( is_circle( _obj ) )
    																				{
                                                 _bordercolor = _obj.bordercolor.length == 0 ? safe_string( _params_assoc_array['extras']['bordercolor'], "" ) : _obj.bordercolor ;
                                                 _fillcolor = _obj.fillcolor.length == 0 ? safe_string( _params_assoc_array['extras']['fillcolor'], "" ) : _obj.fillcolor ;
   																							 if ( !_map_it )
    																						 circles_lib_draw_screen_disk( _context, "", _obj,
    																																	  _bordercolor.length > 0 ? YES : NO, _bordercolor,
                                                                        _fillcolor.length > 0 ? YES : NO, _fillcolor,
    																																		_bordersize > UNDET ? _bordersize : _obj.bordersize, _glob_opacity, 0 ) ;
    																						 else
    																						 circles_lib_draw_complex_disk( _context, _mapper,
    																								 										 _obj.center.x, _obj.center.y, _obj.radius,
    																																		 _bordercolor.length > 0 ? YES : NO, _bordercolor,
                                                                         _fillcolor.length > 0 ? YES : NO, _fillcolor,
    																																		 _bordersize > UNDET ? _bordersize : _obj.bordersize, _glob_opacity, null, null "", 0 ) ;
    																				}
    																				else if ( is_line( _obj ) )
    																				{
                                                 _bordercolor = _obj.bordercolor.length == 0 ? safe_string( _params_assoc_array['extras']['bordercolor'], "" ) : DEFAULT_PT_BORDER_COLOR ;
    																						 circles_lib_draw_segment( _context, _mapper,
    																						 										 _obj.start_pt.x, _obj.start_pt.y,
    																																 _obj.end_pt.x, _obj.end_pt.y,
    																																 _bordercolor,
																																		 _bordersize > UNDET ? _bordersize : _obj.bordersize,
																																		 _glob_opacity, 0, _map_it ) ;
    																				}
    																		}
    																	) ;
    											 }
    											 else
    											 {
    													 _b_fail = YES, _error_str = "Missing input objects for draw action" ;
    											 }
                      }
							        break ;
                      default: break ;
							    }
             }
         }
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }

     if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}