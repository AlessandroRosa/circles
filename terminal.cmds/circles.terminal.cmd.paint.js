function circles_terminal_cmd_paint()
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
     if ( _params.length > 0 )
     {
             _params_assoc_array['action'] = "" ;
             _params_assoc_array['all'] = 0 ;
             _params_assoc_array['dump'] = NO ;
             _params_assoc_array['dump_array'] = null ;
             _params_assoc_array['dump_operator_index'] = UNDET ;
             _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
             _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
             _params_assoc_array['index'] = null ;
             _params_assoc_array['symbol'] = null ;
             _params_assoc_array['color'] = "" ;
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "show", "compute", "release", "all", "html", "help" );
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
              else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p.toLowerCase();
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.stricmp( "all" ) ) _params_assoc_array['all'] = YES ;
              else if ( _p.length == 1 && _p.isAlpha() ) _symbols_array.push( _p );
              else if ( _p.stricmp( "none" ) ) _params_assoc_array['color'] = "transparent" ;
              else if ( circles_lib_colors_is_def( _p ) ) _params_assoc_array['color'] = _p ;
              else
              {
                   _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
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
         else
         {
             var _action = _params_assoc_array['action'] ;
             switch( _action )
             {
                  case "release":
                  circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
                  // convert input symbols into an array of indexes to be applied to next actions
                  var _selection_indexes_array = [] ;
                  var _all = _params_assoc_array['all'] != null ? _params_assoc_array['all'] : NO ;
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
    
                  _symbols_array = ( is_array( _symbols_array ) ) ? _symbols_array.unique().sort() : [] ;
    
                  var _sel_n = safe_size( _symbols_array, 0 );
                  if ( _sd_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "The list of registered items is empty", _par_1, _cmd_tag );
                  else if ( _sel_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing input symbols", _par_1, _cmd_tag );
                  else if ( _params_assoc_array['color'].length == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing input color", _par_1, _cmd_tag );
                  else
                  {
                       var ITEM = null, _index = UNFOUND ;
                       for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
                       {
                            ITEM = circles_lib_find_item_obj_by_symbol( _glob_seeds_array, _symbols_array[_i] );
                            _index = circles_lib_find_item_index_by_symbol( _glob_seeds_array, _symbols_array[_i] );
                            if ( is_item_obj( ITEM ) && _index != UNFOUND )
                            {
                                 if ( is_circle( ITEM.complex_circle ) && is_circle( ITEM.screen_circle ) )
                                 {
                                      ITEM.complex_circle.fill = YES ;
                                      ITEM.complex_circle.fillcolor = _params_assoc_array['color'] ;
                                      ITEM.screen_circle.fill = YES ;
                                      ITEM.screen_circle.fillcolor = _params_assoc_array['color'] ;
                                      circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Paint color set up with success for item '"+_symbols_array[_i]+"'", _par_1, _cmd_tag );
                                 }
                                 else
                                 {
                                      _b_fail = YES, _error_str = "There exists no item with symbol '"+_symbols_array[_i]+"' in the current archive" ;
                                      break ;
                                 }
                            }
                            else
                            {
                                _b_fail = YES, _error_str = "There exists no item with symbol '"+_symbols_array[_i]+"' in the current archive" ;
                                break ;
                            }
                       }
    
                       if ( !_b_fail )
                       {
                           circles_lib_output( _output_channel, DISPATCH_INFO, "Refreshing the Z-plane", _par_1, _cmd_tag );
                           _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _output_channel );
											     var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
												   var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "54Unknown error" ;
												   if ( _ret_id == RET_ERROR )
												   {
													 		 _b_fail = YES, _error_str = _ret_msg ;
													 }
                       }
                  }
                  break ;
             }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
     }

     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}