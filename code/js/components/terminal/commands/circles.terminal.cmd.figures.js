function circles_terminal_cmd_figures()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose )
     circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _params_assoc_array = [];
     var _rec_chunk = null ;
     var _fn_ret_val = null ;
     var _current_figures_plane_type = NO_PLANE ;

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );

    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "begin", "close", "connect", "copy",
                                            "delete", "disable", "disconnect", "drawcolor",
                                            "end", "enable", "fill", "fillcolor", "filter",
                                            "keep", "list", "long", "mark", "mergerect", "open",
                                            "polyadd", "polydelete", "polysort", "polyupdate",
                                            "rebuild", "render", "shift", "sort", "swap", "transfer",
                                            "update", "unmark", "help", "html" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
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
				 
         // distribute all input values into arrays of categories
         _params_assoc_array['plane'] = NO_PLANE ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['reverse'] = NO ;
         _params_assoc_array['all'] = NO ;
         _params_assoc_array['close'] = null ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['input_params'] = [] ;
         _params_assoc_array['input_values'] = [] ;
         _params_assoc_array['inherit'] = YES ;
         _params_assoc_array['labels'] = [];
         _params_assoc_array['long'] = NO ;
         _params_assoc_array['open'] = NO ;
         var _p, current_stage = 0 ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         var _index_associations = [];
             _index_associations['action'] = 0 ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
              _p = _params_array[_i] ;
              if ( _p.stricmp( "noinherit" ) ) _params_assoc_array['inherit'] = NO ;
              else if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.start_with_i( "$" ) ) _params_assoc_array['labels'].push( _p );
              else if ( _p.start_with_i( "@" ) )
              {
                   var _candidate_index = safe_int( _p.replaceAll( "@", "" ), UNDET );
                   if ( _candidate_index == UNDET || _glob_figures_array[_candidate_index-1] == null )
                        circles_lib_output( _out_channel, DISPATCH_WARNING, _params_assoc_array['action'] + " failure: no figure indexed at '"+_candidate_index+"' has been registered", _par_1, _cmd_tag );
                   else
                   {
                       _params_assoc_array['input_params'].push( "entryindex" );
                       _params_assoc_array['input_values'].push( _candidate_index );
                       _index_associations['index'] = _i ;
                   }
              }
              else if ( _p.start_with_i( "#" ) ) // nodes refs
              {
                   var _candidate_index = safe_int( _p.replaceAll( "#", "" ), UNDET );
                       _params_assoc_array['input_params'].push( "nodeindex" );
                       _params_assoc_array['input_values'].push( _candidate_index );
                       _index_associations['index'] = _i ;
              }
              else if ( _p.is_one_of_i( "connect", "copy",
                                        "delete", "disable", "disconnect", "render",
                                        "enable", "filter", "mergerect", "list", "transfer",
                                        "polyadd", "polydelete", "shift", "polysort", "polyupdate", "release",
                                        "rebuild", "swap", "sort", "update" )
                        && _params_assoc_array['action'].length == 0 )
              {
                  _params_assoc_array['action'] = _p ;
                  _index_associations['action'] = _i ;
              }
              else if ( _p.is_one_of_i( "zplane", "wplane", "bip", "allplanes" ) )
              {
                  _params_assoc_array['plane'] = circles_lib_plane_get_value( _p );
                  _index_associations['plane'] = _i ;
                  if ( _params_assoc_array['action'].includes( "render" ) && _p.stricmp( "allplanes" ) )
                  _current_figures_plane_type = UNDET ;
                  else _current_figures_plane_type = _params_assoc_array['plane'] ;
              }
              else if ( _p.is_one_of_i( "all", "keep", "long", "reverse" ) )
              {
                  _params_assoc_array[ _p ] = YES ;
                  _index_associations[ _p ] = _i ;
              }
              else if ( _p.is_one_of_i( "close", "mark", "open", "unmark" ) )
              {
                   if ( _p.is_one_of_i( "mark", "unmark" ) )
                   {
                       _params_assoc_array['input_params'].push( "mark" );
                       _params_assoc_array['input_values'].push( _p.stricmp( "mark" ) ? YES : NO );
                   }
                   else if ( _p.is_one_of_i( "close", "open" ) )
                   {
                       _params_assoc_array['input_params'].push( "close" );
                       _params_assoc_array['input_values'].push( _p.stricmp( "close" ) ? YES : NO );
                   }
              }
              else if ( _p.is_one_of_i( "begin", "end" ) )
              {
                  if ( _params_assoc_array['pos'] == null ) _params_assoc_array['pos'] = _p ;
                  _index_associations['pos'] = _i ;
              }
              else if ( _params_assoc_array['action'].is_one_of_i( "polyadd", "polydelete", "polysort", "polyupdate", "shift" ) )
              {
                  if ( _p.testME( _glob_integer_regex_pattern ) )
                  {
                       _params_assoc_array['input_params'].push( "entryindex" );
                       _params_assoc_array['input_values'].push( safe_int( _p, UNDET ) );
                  }
                  else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
                  {
                       _params_assoc_array['input_params'].push( "coords" );
                       _params_assoc_array['input_values'].push( _p );
                  }
              }
              else if ( _p.is_one_of_i( "center", "drawcolor", "fillcolor", "opacity", "width", "height", "thick" ) ) _index_associations[''+_p] = _i ;
              else if ( circles_lib_colors_is_def( _p ) )
              {
                   if ( _i == _index_associations['drawcolor'] + 1 )
                   {
                       _params_assoc_array['input_params'].push( "drawcolor" );
                       _params_assoc_array['input_values'].push( _p );
                   }
                   else if ( _i == _index_associations['fillcolor'] + 1 )
                   {
                       _params_assoc_array['input_params'].push( "fillcolor" );
                       _params_assoc_array['input_values'].push( _p );
                   }
              }
              else if ( _p.testME( _glob_positive_float_regex_pattern ) )
              {
                   if ( _i == _index_associations['opacity'] + 1 )
                   {
                       _params_assoc_array['input_params'].push( "opacity" );
                       _params_assoc_array['input_values'].push( _p );
                   }
                   else if ( _i == _index_associations['thick'] + 1 )
                   {
                       _params_assoc_array['input_params'].push( "linewidth" );
                       _params_assoc_array['input_values'].push( _p );
                   }
                   else if ( _i == _index_associations['width'] + 1 )
                   {
                       _params_assoc_array['input_params'].push( "width" );
                       _params_assoc_array['input_values'].push( _p );
                   }
                   else if ( _i == _index_associations['height'] + 1 )
                   {
                       _params_assoc_array['input_params'].push( "height" );
                       _params_assoc_array['input_values'].push( _p );
                   }
              }
              else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
              {
                   if ( _i == _index_associations['center'] + 1 )
                   {
                       _params_assoc_array['input_params'].push( "center" );
                       _params_assoc_array['input_values'].push( _p );
                   }
              }
              else
              {
                  _b_fail = YES, _error_str = "Unknown parameter " + _p ;
              }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
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
           var _action = _params_assoc_array['action'] ;
           var _all = _params_assoc_array['all'] ;
           if ( _all || safe_size( _params_assoc_array['labels'], 0 ) > 0 )
           {
                if ( _glob_figures_array.length > 0 && _all )
                {
                    for( var _i = 0 ; _i < _glob_figures_array.length ; _i++ )
                    {
                        if ( _params_assoc_array['action'].is_one_of( "connect", "delete", "disconnect", "transfer", "update", "shift" ) )
                        {
                             _params_assoc_array['input_params'].push( "entryindex" );
                             _params_assoc_array['input_values'].push( _i + 1 );       // 1-based index is assumed here
                        }
                        else if ( _glob_figures_array[_i]['myhash'] != null )
                        {
                             _params_assoc_array['input_params'].push( "entryhash" ); // virtual index is assumed here
                             _params_assoc_array['input_values'].push( _glob_figures_array[_i]['myhash'] );
                        }
                        else
                        {
                             _b_fail = YES, _error_str = "Memory lacks: use 'rebuild' action to fix this issue" ;
                        }
                    }
                }
                else if ( safe_size( _params_assoc_array['labels'], 0 ) > 0 && _glob_figures_array.length > 0 )  // if label exists, get the related index
                {
                    var _l, _x, _len = safe_size( _glob_figures_array, 0 );
                    for( _l = 0 ; _l < _params_assoc_array['labels'].length ; _l++ )
                    {
                        for( _x = 0 ; _x < _len ; _x++ )
                        {
                             if ( _glob_figures_array[_x]['label'].strcmp( _params_assoc_array['labels'][_l] ) )
                             {
                                 _params_assoc_array['input_params'].push( "entryindex" );
                                 _params_assoc_array['input_values'].push( _x + 1 ); // input index are 1-based
                             }
                        }
                    }
                }
                else circles_lib_output( _out_channel, DISPATCH_WARNING, "The list of recorded figures is empty: check if 'rec' param has been previously input", _par_1, _cmd_tag );
           }

           var _index_vals_array = [], _index_ref_array = [], _other_params = [], _other_values = [];
           $.each( _params_assoc_array['input_params'],
                   function( _i, _param )
                   {
                       if ( _param.is_one_of( "entryindex", "entryhash" ) )
                       {
                            _index_ref_array.push( _param );
                            _index_vals_array.push( _params_assoc_array['input_values'][_i] );
                       }
                       else
                       {
                            _other_params.push( _param );
                            _other_values.push( _params_assoc_array['input_values'][_i] );
                       }
                   }
                 );

           var _n_input_index = safe_size( _index_ref_array, 0 );
           switch( _action )
           {
                case "connect":
                if ( _n_input_index > 0 )
                {
                    // check for inconsistent entries to connect
                    var _index, _i, _c ;
                    for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                    {
                         _index = safe_int( _index_vals_array[_i], UNDET ) - 1 ;
                         if ( _index < 0 )
                         {
                              _b_fail = YES, _error_str = "Connect failure: inconsistent input index " + _index ;
                              break ;
                         }
                         else if ( _glob_figures_array[ _index ] == null )
                         {
                              _b_fail = YES, _error_str = "Connect failure: inconsistent archive index " + _index ;
                              break ;
                         }
                         else if ( _index < 0 || _index > safe_size( _glob_figures_array, 0 ) )
                         {
                              _b_fail = YES, _error_str = "Connect failure: index " + _index + " is out of range" ;
                              break ;
                         }
                    }

                    var _index, _rec_chunk ;
                    if ( !_b_fail ) // validates objs for further connection
                    {
                         var _plane_check = 0 ;
                         for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                         {
                              _index = safe_int( _index_vals_array[_i], 0 ) - 1 ;
                              _rec_chunk = _glob_figures_array[_index] ;
                              if ( _plane_check == 0 ) _plane_check = _rec_chunk['plane'] ;
                              else if ( _rec_chunk['plane'] != _plane_check )
                              {
                                   _b_fail = YES, _error_str = "Not all the input items for connection belong to the same plane" ;
                                   break ;
                              }

                              if ( _rec_chunk['class'].is_one_of( FIGURE_CLASS_CIRCLE ) )
                              {
                                   _b_fail = YES, _error_str = "Circles can't be connected" ;
                                   break ;
                              }
                         }
                    }

                    if ( !_b_fail )
                    {
                         // collect items to be connected
                         circles_lib_output( _out_channel, DISPATCH_INFO, "Collecting items to be connected", _par_1, _cmd_tag );
                         var _remove_array = [], _tmp_array = [];
                         var _reference_rec_chunk = null ;
                         for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                         {
                              _index = safe_int( _index_vals_array[_i], 0 ) - 1 ;
                              _rec_chunk = _glob_figures_array[_index] ;

                              if ( _i == 0 && _params_assoc_array['inherit'] )
                              {
                                   _params_assoc_array['plane'] = _rec_chunk['plane'] ;
                                   _params_assoc_array['draw'] = _rec_chunk['draw'] ;
                                   _params_assoc_array['drawcolor'] = _rec_chunk['drawcolor'] ;
                                   _params_assoc_array['fill'] = _rec_chunk['fill'] ;
                                   _params_assoc_array['fillcolor'] = _rec_chunk['fillcolor'] ;
                              }

                              if ( _rec_chunk['class'] == FIGURE_CLASS_LINE )
                              {
                                   _tmp_array = _tmp_array.concat( _rec_chunk['obj'] );
                                   // if a line obj occurs, it will be taked as ref obj for properties
                                   if ( _reference_rec_chunk == null ) _reference_rec_chunk = _rec_chunk ;
                              }
                              else if ( _rec_chunk['class'] == FIGURE_CLASS_POINT )
                                   _tmp_array.push( _rec_chunk['obj'] );
                              else if ( _rec_chunk['class'] == FIGURE_CLASS_RECT )
                                   _tmp_array = _tmp_array.concat( _rec_chunk['obj'].corners() );

                              _remove_array.push( _rec_chunk['myhash'] );
                         }

                         circles_lib_output( _out_channel, DISPATCH_INFO, _tmp_array.length + " item" + ( ( _tmp_array.length == 1 ) ? "" : "s" ) + " found for connection" , _par_1, _cmd_tag );
                         // delete each single item to be connected
                         circles_lib_output( _out_channel, DISPATCH_INFO, "Replacing connected items", _par_1, _cmd_tag );
                         for( _i = 0 ; _i < _remove_array.length ; _i++ )
                         {
                              for( _c = 0 ; _c < _glob_figures_array.length ; _c++ )
                              {
                                 if ( _remove_array[_i].stricmp( _glob_figures_array[_c]['myhash'] ) )
                                 {
                                     _glob_figures_array.remove( _c, _c );
                                     break ;
                                 }
                              }
                         }

          // rebuild hash tags after previous deletion
          circles_lib_output( _out_channel, DISPATCH_INFO, "Rebuilding hash tags", _par_1, _cmd_tag );
          circles_lib_figures_rehash();

          var _plane = _params_assoc_array['plane'] ;
          var _drawcolor = _params_assoc_array['drawcolor'] ;
          var _draw = _drawcolor != null ? ( ( _drawcolor.length > 0 && !_drawcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
          var _fillcolor = _params_assoc_array['fillcolor'] ;
          var _fill = ( _fillcolor != null ) ? ( ( _fillcolor.length > 0 && !_fillcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;

                         var _rec_chunk = [];
                         _rec_chunk['class'] = FIGURE_CLASS_LINE ;
                         _rec_chunk['obj'] = _tmp_array.clone();
                         if ( _reference_rec_chunk == null ) // construct a line obj
                         {
                              _rec_chunk['plane'] = _params_assoc_array['plane'] ;
                              _rec_chunk['draw'] = _draw ;
                              _rec_chunk['fill'] = _fill ;
                              _rec_chunk['drawcolor'] = ( _draw ) ? _drawcolor : "" ;
                              _rec_chunk['fillcolor'] = ( _fill ) ? _fillcolor : "" ;
                              _rec_chunk['opacity'] = ( _params_assoc_array['opacity'] != null ) ? _params_assoc_array['opacity'] : 1.0 ;
                              _rec_chunk['linewidth'] = ( _params_assoc_array['linewidth'] != null ) ? _params_assoc_array['linewidth'] : 1 ;
                              _rec_chunk['enabled'] = YES ;
                              _rec_chunk['label'] = "" ;
                              if ( _params_assoc_array['close'] != null ) _rec_chunk['close'] = YES ;
                              else if ( _params_assoc_array['open'] != null ) _rec_chunk['close'] = NO ;
                         }
                         else
                         {
                              _rec_chunk['plane'] = _params_assoc_array['plane'] ;
                              _rec_chunk['draw'] = _reference_rec_chunk['draw'] ;
                              _rec_chunk['fill'] = NO ;
                              _rec_chunk['drawcolor'] = ( _draw ) ? _drawcolor : ( ( _reference_rec_chunk['drawcolor'] ? _reference_rec_chunk['drawcolor'] : "" ) );
                              _rec_chunk['fillcolor'] = ( _fill ) ? _fillcolor : ( ( _reference_rec_chunk['fillcolor'] ? _reference_rec_chunk['fillcolor'] : "" ) );
                              _rec_chunk['opacity'] = ( _params_assoc_array['opacity'] != null ) ? _params_assoc_array['opacity'] : _reference_rec_chunk['opacity'] ;
                              _rec_chunk['linewidth'] = ( _params_assoc_array['linewidth'] != null ) ? _params_assoc_array['linewidth'] : ( _reference_rec_chunk['opacity'] != null ? _reference_rec_chunk['opacity'] : 1 );
                              _rec_chunk['enabled'] = YES ;
                              _rec_chunk['close'] = ( _params_assoc_array['close'] == null ) ? _reference_rec_chunk['close'] : _params_assoc_array['close'] ;
                         }

                         _rec_chunk['propertiesmask'] = 0 ;
                         circles_lib_figures_add( _rec_chunk );
                         circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Items #"+( _params_assoc_array['input_values'].join( "," ) )+" connected into a new polyline figure", _par_1, _cmd_tag );
                         circles_lib_canvas_after_process_figures( null, YES, _current_figures_plane_type );
                    }
                }
                else if ( _n_input_index == 0 )
                {
                    _b_fail = YES, _error_str = "Connection failure: missing input indexes" ;
                }
                break ;
                case "copy":
                if ( _n_input_index > 0 )
                {
                     var _myhash = "", _candidate_hash, _rec_chunk = null, _copy_array = [], _i, _x ;
                     circles_lib_output( _out_channel, DISPATCH_INFO, "Copying input items", _par_1, _cmd_tag );
                     for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                     {
                          _myhash = _index_vals_array[_i] ;
                          for( _x = 0 ; _x < _glob_figures_array.length ; _x++ )
                          {
                               _candidate_hash = _glob_figures_array[_x]['myhash'] ;
                               if ( _candidate_hash.stricmp( _myhash ) )
                               {
                                    var _new_item = _glob_figures_array[_x].clone_associative();
                                    _copy_array.push( _new_item );
                               }
                          }
                     }

                     _glob_figures_array = _glob_figures_array.concat( _copy_array );

                     // rebuild hash tags after previous operations
                     circles_lib_output( _out_channel, DISPATCH_INFO, "Rebuilding hash tags", _par_1, _cmd_tag );

                     for( var _i = 0 ; _i < _glob_figures_array.length ; _i++ )
                     _glob_figures_array[_i]['myhash'] = "rec" + ( _i + 1 );
                }
                else if ( _n_input_index == 0 )
                {
                    _b_fail = YES, _error_str = "Copy failure: missing input indexes" ;
                }
                break ;
                case "disconnect":
                if ( _n_input_index > 0 )
                {
                    var _index, _rec_chunk, _plane_check = 0, _i ;
                    // check for inconsistent entries to connect
                    for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                    {
                         _index = safe_int( _index_vals_array[_i], 0 ) - 1 ;
                         if ( _index == UNDET )
                         {
                              _b_fail = YES, _error_str = "Disconnect failure: inconsistent input index " + _index ;
                              break ;
                         }
                         else if ( _glob_figures_array[ _index ] == null )
                         {
                              _b_fail = YES, _error_str = "Disconnect failure: inconsistent archive index " + _index ;
                              break ;
                         }
                         else if ( _index < 0 || _index > safe_size( _glob_figures_array, 0 ) )
                         {
                              _b_fail = YES, _error_str = "Disconnect failure: index " + _index + " is out of range" ;
                              break ;
                         }
                    }

                    if ( !_b_fail ) // validates objs for further dis-connection
                    {
                         for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                         {
                              _index = safe_int( _index_vals_array[_i], 0 ) - 1 ;
                              _rec_chunk = _glob_figures_array[_index] ;
                              if ( _rec_chunk['class'].is_one_of( FIGURE_CLASS_CIRCLE, FIGURE_CLASS_POINT ) )
                              {
                                  _b_fail = YES, _error_str = "Only lines and rects can be disconnected" ;
                                  break ;
                              }
                         }
                    }

                    if ( !_b_fail )
                    {
                         // collect items to be disconnected
                         circles_lib_output( _out_channel, DISPATCH_INFO, "Collecting items to be disconnected", _par_1, _cmd_tag );
                         var _remove_array = [], _tmp_array = [], _c ;
                         for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                         {
                              _index = safe_int( _index_vals_array[_i], 0 ) - 1 ;
                              _rec_chunk = _glob_figures_array[_index] ;
                              if ( _rec_chunk['class'].is_one_of( FIGURE_CLASS_LINE, FIGURE_CLASS_RECT ) )
                              {
                                  // removable entries match the ones to disconnect
                                  _remove_array.push( _rec_chunk['myhash'] );
                                  _tmp_array.push( _rec_chunk );
                              }
                         }

                         circles_lib_output( _out_channel, DISPATCH_INFO, _tmp_array.length + " item" + ( ( _tmp_array.length == 1 ) ? "" : "s" ) + " collected" , _par_1, _cmd_tag );
                         // delete each single item to be disconnected
                         circles_lib_output( _out_channel, DISPATCH_INFO, "Removing items to disconnect", _par_1, _cmd_tag );
                         for( _i = 0 ; _i < _remove_array.length ; _i++ )
                         {
                              for( _c = 0 ; _c < _glob_figures_array.length ; _c++ )
                              {
                                 if ( _remove_array[_i].stricmp( _glob_figures_array[_c]['myhash'] ) )
                                 {
                                     _glob_figures_array.remove( _c, _c );
                                     break ;
                                 }
                              }
                         }

                         var _disconnected_pts = circles_lib_figures_disconnect( _out_channel, _tmp_array, _par_1, _cmd_tag );
                         _glob_figures_array = _glob_figures_array.concat( _disconnected_pts );
                         // rebuild hash tags after previous operations
                         circles_lib_output( _out_channel, DISPATCH_INFO, "Rebuilding hash tags", _par_1, _cmd_tag );

                         for( _i = 0 ; _i < _glob_figures_array.length ; _i++ )
                         {
                              _glob_figures_array[_i]['myhash'] = "rec" + ( _i + 1 );
                              _glob_figures_array[_i]['label'] = "" ;
                         }

                         circles_lib_canvas_after_process_figures( null, YES, _current_figures_plane_type );
                         circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Disconnection performed", _par_1, _cmd_tag );
                    }
                }
                else if ( _n_input_index == 0 )
                {
                    _b_fail = YES, _error_str = "Disconnection failure: missing input indexes" ;
                }
                break ;
                case "delete":
                case "disable":
                case "enable":
                case "transfer":
                if ( _n_input_index == 0 )
                {
                    _b_fail = YES, _error_str = "Can't "+_action+" : missing input indexes" ;
                }
                else
                {
						     		 var _params_array = [] ;
								     	   _params_array['prepromptquestion'] = null ;
					     		 			 _params_array['promptquestion'] = "Confirm to "+_action+" "+( ( _all == 0 ) ? ( "the input item" + ( _n_input_index != 1 ? "s" : "" ) ) : "all items" ) +"? " ;
									     	 _params_array['yes_fn'] = function()
																									 {
																									 		var _ret_chunk = circles_lib_figures_action( _out_channel, _action, _index_vals_array, _params_assoc_array['plane'], YES, _par_1, _cmd_tag );
																									 		_b_fail = _ret_chunk[0], _error_str = _ret_chunk[1] ;
																									 }
									     	 _params_array['ifquestiondisabled_fn'] = function()
																																	{
																																			var _ret_chunk = circles_lib_figures_action( _out_channel, _action, _index_vals_array, _params_assoc_array['plane'], YES, _par_1, _cmd_tag );
																																	 		_b_fail = _ret_chunk[0], _error_str = _ret_chunk[1] ;
																																	}
								     circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                }
                break ;
                case "render":
                var _filter_array = [] ;
                if ( _n_input_index > 0 )
                {
                     circles_lib_output( _out_channel, DISPATCH_INFO, "Checking input index(es) to be coherent with archived items", _par_1, _cmd_tag );
                     // gets input hash values
                     for( var _x = 0 ; _x < _index_vals_array.length ; _x++ )
                     {
                          _index = _index_vals_array[_x] - 1 ;
                          _rec_chunk = _glob_figures_array[_index] ;
                          _filter_array.push( _rec_chunk['myhash'] );
                     }
                }
                
                circles_lib_canvas_after_process_figures( _filter_array, YES, _current_figures_plane_type );
                circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Drawing "+( ( _n_input_index > 0 ) ? "filtered" : "" )+" figures list", _par_1, _cmd_tag );
                break ;
                case "filter":
                if ( safe_size( _index_vals_array, 0 ) > 0 ) circles_lib_canvas_after_process_figures( _index_vals_array, YES, _current_figures_plane_type );
                else
                {
                     _b_fail = YES, _error_str = "Can't isolate: no input entries" ;
                }
                break ;
                case "mergerect":
                if ( _n_input_index > 0 )
                {
                     var _index = 0, _rec_chunk, _i, _c ;
                     // check indexes to be coherent with the archived items
                     circles_lib_output( _out_channel, DISPATCH_INFO, "Checking input index(es) to be coherent with archived items", _par_1, _cmd_tag );
                     for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                     {
                         _index = _index_vals_array[_i] - 1 ;
                         if ( _glob_figures_array[ _index ] == null )
                         {
                            _b_fail = YES, _error_str = "Incomplete cmd: missing item indexed at " + _index_ref_array[_i] ;
                            break ;
                         }
                     }
                     
                     // check input items to be of rect kind
                     circles_lib_output( _out_channel, DISPATCH_INFO, "Checking items to be of rect class", _par_1, _cmd_tag );
                     if ( !_b_fail )
                     {
                         for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                         {
                              _index = _index_vals_array[_i] - 1 ;
                              _rec_chunk = _glob_figures_array[_index] ;
                              if ( _rec_chunk[ "class" ] != FIGURE_CLASS_RECT )
                              {
                                  _b_fail = YES, _error_str = "Item #" + _index_ref_array[_i] + " is not a rect" ;
                                  break ;
                              }
                         }
                     }

                     if ( !_b_fail )
                     {
                         // let's merge !
                         circles_lib_output( _out_channel, DISPATCH_INFO, "Attempting to merge input rects", _par_1, _cmd_tag );
                         var _rect, _tmp_rect, _remove_array = [] ;
                         for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                         {
                              _index = _index_vals_array[_i] - 1 ;
                              _rec_chunk = _glob_figures_array[_i] ;
                              if ( _i == 0 ) _rect = _rec_chunk['obj'] ;
                              else
                              {
                                  _tmp_rect = _rect.join_rect( _rec_chunk['obj'] );
                                  if ( !is_rect( _tmp_rect ) )
                                  {
                                     _b_fail = YES, _error_str = "Rect #" + _index_vals_array[_i] + " can't be merged: probably has no common side with other input rects" ;
                                  }
                                  else
                                  {
                                     _remove_array.push( _rec_chunk['myhash'] );
                                     _rect.from_rect( _tmp_rect );
                                  }
                              }
                         }
                         
                         if ( !_b_fail )
                         {
                             if ( _params_assoc_array[ "keep" ] == null )
                             {
                                 circles_lib_output( _out_channel, DISPATCH_INFO, "Discarding merged input rects", _par_1, _cmd_tag );
                                 for( _i = 0 ; _i < _remove_array.length ; _i++ )
                                 {
                                      for( _c = 0 ; _c < _glob_figures_array.length ; _c++ )
                                      {
                                         if ( _remove_array[_i].stricmp( _glob_figures_array[_c]['myhash'] ) )
                                         {
                                             _glob_figures_array.remove( _c, _c );
                                             break ;
                                         }
                                      }
                                 }
                             }
                             else circles_lib_output( _out_channel, DISPATCH_INFO, "Joint input rects won't be discarded", _par_1, _cmd_tag );

                             _rec_chunk['obj'] = _rect ;
                             circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Input rects have been merged", _par_1, _cmd_tag );
                             circles_lib_canvas_after_process_figures( null, YES, _current_figures_plane_type );
                         }
                     }
                }
                else
                {
                    _b_fail = YES, _error_str = "Incomplete cmd: missing input indexes" ;
                }
                break ;
                case "list":
                var _n = safe_size( _glob_figures_array, 0 );
                var _row ;
                if ( _n > 0 )
                {
                    var _reverse = _params_assoc_array['reverse'] ;
                    _row = "Found <yellow>"+_n+"</yellow> element" + ( ( _n == 1 ) ? "" : "s" ) + ( _reverse ? " - Reverse list" : "" );
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                    var _counter = 1 ;
                    for( var _i = ( _reverse ? _n - YES : NO ); ( _reverse ) ? _i >= 0 : _i < _n ; ( _reverse ) ? _i-- : _i++ )
                    {
                         _row = _CIRCLESfigure_display_list_item( _counter, _glob_figures_array[_i], _params_assoc_array );
                         _counter++ ;
                         if ( safe_size( _row, 0 ) > 0 )
                         circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                         else 
                         circles_lib_output( _out_channel, DISPATCH_ERROR, "Fail to display figure item indexed at " + ( _i + 1 ), _par_1, _cmd_tag );
                    }
                }
                else if ( _n == 0 )
                {
                    var _msg = "<orange>The list of figures is empty.</orange>" + _glob_crlf ;
                        _msg += "<lightgray>To fulfill this list, include 'rec' param"  + _glob_crlf + "in circle | rect | line | point cmds</lightgray>" ;
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                }
                break ;
                case "polyadd":
                // separate entries of indexes from properties to be updated
                if ( _n_input_index == 0 )
                    circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing all input params", _par_1, _cmd_tag );
                else if ( _n_input_index == 1 && _other_params.filtering( function( _v ) { return ( _v.stricmp( "coords" ) ) ? YES : NO ; } ).length == 0 )
                    circles_lib_output( _out_channel, DISPATCH_WARNING, "Incomplete cmd: one index and at least one coords pair are required", _par_1, _cmd_tag );
                else
                {
                    var _index = UNDET, _input = safe_int( _index_vals_array[0], UNDET ), _coords_array = [], _pt_coords;
                    circles_lib_output( _out_channel, DISPATCH_INFO, "Scanning input values", _par_1, _cmd_tag );
                    for( var _i = 0 ; _i < _other_params.length ; _i++ )
                    {
                         _input = new String( _index_vals_array[_i] );
                         if ( _input.testME( _glob_integer_regex_pattern ) ) _index = safe_int( _input, UNDET );
                         if ( _other_params[_i].stricmp( "coords" ) &&
                              _other_values[_i].testME( _glob_cartesian_coords_regex_pattern )
                            )
                         {
                             _pt_coords = _other_values[_i].replaceAll( [ "(", ")" ], "").split( "," );
                             _coords_array.push( new point( parseFloat( _pt_coords[0] ), parseFloat( _pt_coords[1] ) ) );
                         }
                         else
                         {
                             _b_fail = YES, _error_str = "Input value " + _input + " is of unknown type for polyadd operation" ;
                             break ;
                         }
                    }

                    if ( !_b_fail )
                    {
                         _rec_chunk = _glob_figures_array[ _index - 1 ] ;
                         if ( _rec_chunk == null )
                         {
                            _b_fail = YES, _error_str = "Input index " + _index + " does not refer to any consistent entry" ;
                         }
                         else if ( _rec_chunk['class'] != FIGURE_CLASS_LINE )
                         {
                            _b_fail = YES, _error_str = "Input index " + _index + " does not refer a (poly)line entry" ;
                         }
                         else
                         {
                            var _polyline_array = _rec_chunk['obj'] ;
                            var _old_n = safe_size( _polyline_array, 0 ), _n_coords = safe_size( _coords_array, 0 );
                            if ( _polyline_array == null || !is_array( _polyline_array ) ) _polyline_array = [];
                            var _pos = ( _params_assoc_array['pos'] != null ) ? _params_assoc_array['pos'] : "end" ;
                            var _resulting_array = ( _pos.stricmp( "begin" ) ) ? _coords_array.concat( _polyline_array ) : _polyline_array.concat( _coords_array );
                            _rec_chunk['obj'] = _resulting_array.clone();

                            var _new_n = _resulting_array.length ;
                            var _b_go = ( _new_n > _old_n ) ? YES : NO ;
                            var _msg = _b_go ? ( "Item #"+ (_index) + ":" + + _n_coords + " entr" + ( ( _n_coords == 1 ) ? "y" : "ies" ) + " added" ) : "No entries added" ;

                            if ( _b_go )
                            circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                            else
                            {
                               _b_fail = YES, _error_str = _msg ;
                            }

                            if ( _b_go ) circles_lib_canvas_after_process_figures( null, YES, _current_figures_plane_type );
                         }
                    }
                }
                break ;
                case "polydelete":
                var _nodes_index_array = [];
                $.each( _params_assoc_array['input_params'], function( _i, _v ){ if ( _v.stricmp( "nodeindex" ) ) _nodes_index_array.push( _i ); } );
                var _nodes_values_array = [] ;
                $.each( _nodes_index_array, function( _i, _v ){ _nodes_values_array.push( _params_assoc_array['input_values'][ _v ] ); } )
                _nodes_values_array = _nodes_values_array.unique();
                var _n_nodes = _nodes_index_array.length ;
                if ( _n_nodes == 0 )
                {
                     _b_fail = YES, _error_str = "Missing input nodes: each node index shall be announced by prefix '#'" ;
                }
                else if ( _n_input_index > 0 )
                {
                     var _item_index = safe_int( _index_vals_array[0], 0 );
                     if ( _item_index == 0 )
                     {
                          _b_fail = YES, _error_str = "Unreferenced input item" ;
                     }
                     else
                     {
                          var _zerobased_index = _item_index - 1 ;
                          var _rec_chunk = _glob_figures_array[_zerobased_index] ;
                          if ( _rec_chunk != null )
                          {
                               var _is_polyline = ( _rec_chunk['class'] == FIGURE_CLASS_LINE ) ? ( _rec_chunk['obj'].length > 2 ? YES : NO ) : NO ;
                               if ( _is_polyline )
                               {
                                   var _points_array = _rec_chunk['obj'], _i ;
                                   var _index = UNDET, _accepted_array = [], _discarded_array = [] ;
                                   circles_lib_output( _out_channel, DISPATCH_INFO, "Checking input index(es) to be coherent with archived items", _par_1, _cmd_tag );
                                   // check existence of all nodes
                                   for( _i = 0 ; _i < _n_nodes.length ; _i++ )
                                   {
                                        _index = _other_values[ _nodes_index_array[_i] ] - 1 ;
                                        if ( _points_array[ _index ] == null )
                                        {
                                             _b_fail = YES, _error_str = "Incomplete cmd: missing item indexed at " + _params_assoc_array['input_values'][_i] ;
                                             break ;
                                        }
                                   }

                                   if ( !_b_fail )
                                   {
                                        for( _i = 0 ; _i < _points_array.length ; _i++ )
                                        {
                                             if ( _points_array[ _i ] != null )
                                             {
                                                 ( _other_values.includes( _i + 1 ) ) ? _discarded_array.push( _points_array[ _i ] ) : _accepted_array.push( _points_array[ _i ] );
                                             }
                                             else
                                             {
                                                 _b_fail = YES, _error_str = "Incomplete cmd: missing item indexed at " + _params_assoc_array['input_values'][_i] ;
                                                 break ;
                                             }
                                        }
                                    }

                                    if ( !_b_fail )
                                    {
                                        _rec_chunk['obj'] = _accepted_array.clone();
                                        if ( _params_assoc_array['close'] != null ) _rec_chunk['close'] = YES ;
                                        else if ( _params_assoc_array['open'] != null ) _rec_chunk['close'] = NO ;
                                        circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Polydelete of nodes "+_nodes_values_array.join( "," )+" performed on entry " + _item_index, _par_1, _cmd_tag );
                                        circles_lib_canvas_after_process_figures( null, YES, _current_figures_plane_type );
                                    }
                               }
                               else
                               {
                                  _b_fail = YES, _error_str = "Input item is not a polyline" ;
                               }
                          }
                          else
                          {
                               _b_fail = YES, _error_str = "Memory failure" ;
                          }
                     }
                }
                else
                {
                    _b_fail = YES, _error_str = "Incomplete cmd: missing input indexes" ;
                }
                break;
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "shift":
                var _nodes_index_array = [];
                $.each( _params_assoc_array['input_params'], function( _i, _v ){ if ( _v.stricmp( "nodeindex" ) ) _nodes_index_array.push( _i ); } );
                var _nodes_values_array = [] ;
                $.each( _nodes_index_array, function( _i, _v ){ _nodes_values_array.push( _params_assoc_array['input_values'][ _v ] ); } )
                _nodes_values_array = _nodes_values_array.unique();
                var _n_nodes = _nodes_index_array.length ;

                var _coords_index_array = [];
                $.each( _params_assoc_array['input_params'], function( _i, _v ){ if ( _v.stricmp( "coords" ) ) _coords_index_array.push( _i ); } );
                var _coords_values_array = [] ;
                $.each( _coords_index_array, function( _i, _v ){ _coords_values_array.push( _params_assoc_array['input_values'][ _v ] ); } )
                _coords_values_array = _coords_values_array.unique();

                     if ( safe_size( _index_ref_array, 0 ) == 0 )
                     {
                          _b_fail = YES, _error_str = "Missing input items" ;
                     }
                     else if ( safe_size( _coords_values_array, 0 ) == 0 )
                     {
                          _b_fail = YES, _error_str = "Missing input coords" ;
                     }
                     else
                     {
                          // take all input shifting points and sum them all so to have a unique shifting point
                          var _shift_point_ref = "", _pt_coords, _shift_point = new point( 0, 0 );
                          var _idx, _i, _c ;
                          for( _c = 0 ; _c < _coords_values_array.length ; _c++ )
                          {
                               _shift_point_ref = _coords_values_array[_c].replaceAll( [ "(", ")" ], "" );
                               _pt_coords = _shift_point_ref.split( "," );
                               _shift_point.x += safe_float( _pt_coords[0], 0 );
                               _shift_point.y += safe_float( _pt_coords[1], 0 );
                          }

                          var _virtual_index, _zerobased_index, _rec_chunk, _rec_label ;
                          var _is_circle, _is_line, _is_point, _is_rect ;
                          var _points_array, _all ;
                          for( _idx = 0 ; _idx < _index_vals_array.length ; _idx++ )
                          {
                              if ( _b_fail ) break ;
                              _virtual_index = _index_vals_array[_idx] ;
                              _zerobased_index = _virtual_index - 1, _index = UNDET ;
                              _rec_chunk = _glob_figures_array[_zerobased_index] ;
                              if ( _rec_chunk != null )
                              {
                                   _rec_label = safe_string( _rec_chunk['label'], "" );
                                   _is_circle = ( _rec_chunk['class'] == FIGURE_CLASS_CIRCLE ) ? YES : NO ;
                                   _is_line = ( _rec_chunk['class'] == FIGURE_CLASS_LINE ) ? YES : NO ;
                                   _is_point = ( _rec_chunk['class'] == FIGURE_CLASS_POINT ) ? YES : NO ;
                                   _is_rect = ( _rec_chunk['class'] == FIGURE_CLASS_RECT ) ? YES : NO ;
                                   if ( _is_line )
                                   {
                                       _points_array = _rec_chunk['obj'] ;
                                       if ( _nodes_values_array.length == 0 ) // if no nodes are input, include them all
                                       {
                                            circles_lib_output( _out_channel, DISPATCH_INFO, "No input nodes: the whole line "+( _rec_label.length > 0 ? _rec_label : "@" + _virtual_index )+" will be processed", _par_1, _cmd_tag );
                                            for( var _i = 0 ; _i < _points_array.length ; _i++ )
                                            _nodes_values_array.push( _i + 1 );
    
                                            _all = YES ;
                                       }
                                       else _all = NO ;

                                       circles_lib_output( _out_channel, DISPATCH_INFO, "Checking input index(es) to be coherent with archived items", _par_1, _cmd_tag );
                                       for( _i = 0 ; _i < _nodes_values_array.length ; _i++ )
                                       {
                                            _index = safe_int( _nodes_values_array[_i] - 1, UNDET );
                                            if ( _points_array[ _index ] == null )
                                            {
                                                 _b_fail = YES, _error_str = "Invalid node indexed at #" + _nodes_values_array[_i] ;
                                                 break ;
                                            }
                                       }
    
                                       if ( !_b_fail )
                                       {
                                           circles_lib_output( _out_channel, DISPATCH_INFO, "Shifting "+( ( _all ) ? "all" : "input" )+" input polyline points by " + _shift_point.output( "cartesian" ), _par_1, _cmd_tag );
                                           for( _i = 0 ; _i < _nodes_values_array.length ; _i++ )
                                           {
                                                _index = _nodes_values_array[_i] - 1 ;
                                                _points_array[ _index ].x += _shift_point.x ;
                                                _points_array[ _index ].y += _shift_point.y ;
                                           }
    
                                           circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Shift performed with success", _par_1, _cmd_tag );
                                           circles_lib_canvas_after_process_figures( null, YES, _current_figures_plane_type );
                                       }
                                   }
                                   else if ( _is_rect || _is_circle || _is_point )
                                   {
                                       var _primitive_obj = _rec_chunk['obj'] ;
                                       circles_lib_output( _out_channel, DISPATCH_INFO, "Checking input index(es) to be coherent with archived items", _par_1, _cmd_tag );
                                       if ( _primitive_obj == null )
                                       {
                                           _b_fail = YES, _error_str = "Incomplete cmd: missing figure indexed at " + _nodes_values_array[_i] ;
                                           break ;
                                       }
                                       
                                       if ( !_b_fail )
                                       {
                                           var _figure_label = "" ;
                                           if ( _is_rect ) _figure_label = "rect" ;
                                           else if ( _is_circle ) _figure_label = "circle" ;
                                           else if ( _is_point ) _figure_label = "point" ;
    
                                           circles_lib_output( _out_channel, DISPATCH_INFO, "Shifting "+( ( _all ) ? "all" : "input" )+" input "+_figure_label+" by " + _shift_point.output( "cartesian" ), _par_1, _cmd_tag );
                                           if ( _is_rect || _is_circle || _is_point ) _primitive_obj.shift( _shift_point.x, _shift_point.y );
                                           circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Shift performed with success", _par_1, _cmd_tag );
                                           circles_lib_canvas_after_process_figures( null, YES, _current_figures_plane_type );
                                       }
                                   }
                                   else
                                   {
                                      _b_fail = YES, _error_str = "Input item is not a rect or a (poly)line" ;
                                   }
                              }
                              else
                              {
                                  _b_fail = YES, _error_str = "Memory failure" ;
                              }
                          }
                     }
                break;
                case "polysort":
                var _nodes_index_array = [];
                $.each( _params_assoc_array['input_params'], function( _i, _v ){ if ( _v.stricmp( "nodeindex" ) ) _nodes_index_array.push( _i ); } );
                var _nodes_values_array = [] ;
                $.each( _nodes_index_array, function( _i, _v ){ _nodes_values_array.push( _params_assoc_array['input_values'][ _v ] ); } )
                _nodes_values_array = _nodes_values_array.unique();
                var _n_nodes = _nodes_index_array.length ;

                var _coords_index_array = [];
                $.each( _params_assoc_array['input_params'], function( _i, _v ){ if ( _v.stricmp( "coords" ) ) _coords_index_array.push( _i ); } );
                var _coords_values_array = [] ;
                $.each( _coords_index_array, function( _i, _v ){ _coords_values_array.push( _params_assoc_array['input_values'][ _v ] ); } )
                _coords_values_array = _coords_values_array.unique();

                if ( _n_input_index > 0 )
                {
                     var _item_index = safe_int( _index_vals_array[0], UNDET );
                     if ( _item_index == UNDET )
                     {
                          _b_fail = YES, _error_str = "Unreferenced input item" ;
                     }
                     else if ( _nodes_values_array.length == 0 )
                     {
                          _b_fail = YES, _error_str = "Missing input nodes for sorting" ;
                     }
                     else
                     {
                          var _zerobased_index = _item_index - 1, _index = UNDET ;
                          var _rec_chunk = _glob_figures_array[_zerobased_index] ;
                          if ( _rec_chunk != null )
                          {
                               var _is_polyline = ( _rec_chunk['class'] == FIGURE_CLASS_LINE ) ? ( _rec_chunk['obj'].length > 2 ? YES : NO ) : NO ;
                               if ( _is_polyline )
                               {
                                   var _points_array = _rec_chunk['obj'], _i ;
                                   var _accepted_array = [], _discarded_array = [] ;
                                   if ( _points_array != null )
                                   {
                                        circles_lib_output( _out_channel, DISPATCH_INFO, "Checking input index(es) to be coherent with archived items", _par_1, _cmd_tag );
                                        for( _i = 0 ; _i < _nodes_values_array.length ; _i++ )
                                        {
                                            _index = safe_int( _nodes_values_array[_i] - 1, UNDET );
                                            if ( _points_array[ _index ] == null )
                                            {
                                                _b_fail = YES, _error_str = "Polysort (0.1): missing item indexed at " + _nodes_values_array[_i] ;
                                                break ;
                                            }
                                        }

                                        if ( !_b_fail )
                                        {
                                            for( _i = 0 ; _i < _points_array.length ; _i++ )
                                            {
                                                if ( _points_array[ _i ] != null )
                                                {
                                                    if ( _nodes_values_array.includes( _i + 1 ) )
                                                    _accepted_array.push( _points_array[ _i ] );
                                                    else
                                                    _discarded_array.push( _points_array[ _i ] );
                                                }
                                                else
                                                {
                                                    _b_fail = YES, _error_str = "Polysort (0.4): missing item indexed at " + _params_assoc_array['input_values'][_i] ;
                                                    break ;
                                                }
                                            }
                                        }

                                        if ( !_b_fail )
                                        {
                                            _rec_chunk['obj'] = _accepted_array.clone().concat( _discarded_array.clone() );
                                            circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Polysort performed on entry " + _item_index, _par_1, _cmd_tag );
                                            circles_lib_canvas_after_process_figures( null, YES, _current_figures_plane_type );
                                        }
                                   }
                                   else
                                   {
                                        _b_fail = YES, _error_str = "Incomplete cmd: missing point(s) reference(s)" ;
                                   }
                               }
                               else
                               {
                                    _b_fail = YES, _error_str = "Input item is not a polyline" ;
                               }
                          }
                          else
                          {
                              _b_fail = YES, _error_str = "Memory failure" ;
                          }
                     }     
                }
                else
                {
                    _b_fail = YES, _error_str = "Incomplete cmd: missing input indexes" ;
                }
                break ;
                case "polyupdate":
                var _nodes_index_array = [];
                $.each( _params_assoc_array['input_params'], function( _i, _v ){ if ( _v.stricmp( "nodeindex" ) ) _nodes_index_array.push( _i ); } );
                var _nodes_values_array = [] ;
                $.each( _nodes_index_array, function( _i, _v ){ _nodes_values_array.push( _params_assoc_array['input_values'][ _v ] ); } )
                _nodes_values_array = _nodes_values_array.unique();
                var _n_nodes = _nodes_index_array.length ;

                var _coords_index_array = [];
                $.each( _params_assoc_array['input_params'], function( _i, _v ){ if ( _v.stricmp( "coords" ) ) _coords_index_array.push( _i ); } );
                var _coords_values_array = [] ;
                $.each( _coords_index_array, function( _i, _v ){ _coords_values_array.push( _params_assoc_array['input_values'][ _v ] ); } )
                _coords_values_array = _coords_values_array.unique();

                if ( _n_input_index > 0 )
                {
                     var _item_index = safe_int( _index_vals_array[0], UNDET );
                     if ( _item_index == UNDET )
                     {
                          _b_fail = YES, _error_str = "Unreferenced input item" ;
                     }
                     else if ( _nodes_values_array.length == 0 )
                     {
                          _b_fail = YES, _error_str = "Missing input nodes for sorting" ;
                     }
                     else if ( _nodes_values_array.length != _coords_values_array.length )
                     {
                          _b_fail = YES, _error_str = "Mismatch error: the number of nodes refs and coords shall be the same" ;
                     }
                     else
                     {
                          var _zerobased_index = _item_index - 1 ;
                          var _rec_chunk = _glob_figures_array[_zerobased_index] ;
                          if ( _rec_chunk != null )
                          {
                               var _is_polyline = ( _rec_chunk['class'] == FIGURE_CLASS_LINE ) ? ( _rec_chunk['obj'].length > 2 ? YES : NO ) : NO ;
                               if ( _is_polyline )
                               {
                                   var _points_array = _rec_chunk['obj'], _x ;
                                   var _new_indexes = [], _new_coords = [], _item ;
                                   for( _x = 0 ; _x < _nodes_values_array.length ; _x++ )
                                   {
                                      _item = new String( _index_vals_array[_x] );
                                      _new_indexes.push( _nodes_values_array[_x] );
                                      _new_coords.push( _coords_values_array[_x] );
                                   }

                                   var _new_index = 0, _new_item = 0 ;
                                   for( _x = 0 ; _x < _new_indexes.length ; _x++ )
                                   {
                                       _new_index = _new_indexes[_x] ;
                                       _new_item = _new_coords[_x] ;
                                       _new_item = _new_item.replaceAll( [ "(", ")" ], "" );
                                       _new_item = _new_item.split( "," );
                                       _new_item = new point( parseFloat( _new_item[0] ), parseFloat( _new_item[1] ) );
                                       if ( _points_array[ _new_index - 1 ] != null )
                                       _points_array[ _new_index - 1 ] = _new_item  ;
                                       else
                                       {
                                           _b_fail = YES, _error_str = "Unreferenced point #" + _new_index ;
                                           break ;
                                       }
                                   }

                                   if ( !_b_fail )
                                   {
                                       _ret_flag = YES ;
                                       circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Item #"+_item_index+" (poly)updated", _par_1, _cmd_tag );
                                       circles_lib_canvas_after_process_figures( null, YES, _current_figures_plane_type );
                                   }
                               }
                               else
                               {
                                  _b_fail = YES, _error_str = "Input item is not a polyline" ;
                               }
                          }
                          else
                          {
                              _b_fail = YES, _error_str = "Memory failure" ;
                          }
                     }
                }
                else if ( _n_input_index == 0 )
                {
                    _b_fail = YES, _error_str = "Incomplete cmd: missing input indexes" ;
                }
                break;
                case "rebuild":
                if ( _glob_figures_array.length > 0 )
                {
                    // rebuild hash tags after previous deletion
                    circles_lib_output( _out_channel, DISPATCH_INFO, "Rebuilding hash tags", _par_1, _cmd_tag );
                    for( var _i = 0 ; _i < _glob_figures_array.length ; _i++ )
                    {
                         if ( _glob_figures_array.check_descendent_properties( _i, 'myhash' ) != null )
                              _glob_figures_array[_i]['myhash'] = "rec" + ( _i + 1 );
                         else
                         {
                             _b_fail = YES, _error_str = "Can't rebuild: memory failure at index " + ( _i + 1 );
                             break ;
                         }
                    }
    
                    if ( !_b_fail )
                    circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Hash tags rebuilt with success", _par_1, _cmd_tag );
                }
                else circles_lib_output( _out_channel, DISPATCH_WARNING, "Figures list is empty", _par_1, _cmd_tag );
                break;
                case "sort":
                if ( _n_input_index > 0 )
                {
                    var _index, _i, _x ;
                    // check for inconsistent entries
                    for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                    {
                         _index = safe_int( _index_vals_array[_i], 0 ) - 1 ;
                         if ( _index == UNDET )
                         {
                              _b_fail = YES, _error_str = "Sort failure: inconsistent input index " + _index ;
                              break ;
                         }
                         else if ( _glob_figures_array[ _index ] == null )
                         {
                              _b_fail = YES, _error_str = "Sort failure: inconsistent input index " + _index ;
                              break ;
                         }
                         else if ( _index < 0 || _index > safe_size( _glob_figures_array, 0 ) )
                         {
                              _b_fail = YES, _error_str = "Sort failure: index " + _index + " is out of range" ;
                              break ;
                         }
                    }
                    
                    if ( !_b_fail )
                    {
                         var _tmp_array = [], _tmp_remove_index = [], _index;
                         // collecting items to be sorted
                         circles_lib_output( _out_channel, DISPATCH_INFO, "Collecting items to be sorted", _par_1, _cmd_tag );
                         for( _i = 0 ; _i < _index_vals_array.length ; _i++ )
                         {
                              _index = safe_int( _index_vals_array[_i], 0 ) - 1 ;
                              _tmp_array.push( _glob_figures_array[ _index ].clone_associative() );
                              _tmp_remove_index.push( _glob_figures_array[ _i ]['myhash'] );
                         }

                         for( _i = 0 ; _i < _tmp_remove_index.length ; _i++ )
                         {
                              for( _x = 0 ; _x < _glob_figures_array.length ; _x++ )
                              {
                                   if ( _glob_figures_array[_x]['myhash'].stricmp( _tmp_remove_index[_i] ) )
                                   {
                                        _glob_figures_array.remove( _x, _x );
                                        break ;
                                   }
                              }
                         }
                         
                         if ( _glob_figures_array.length > 0 )
                         {
                              var _MSG = "Detected residual entries after sorting: input indexes don't cover the whole list" ;
                                  _MSG += _glob_crlf + "After this partial sorting, the original sequence will follow" ;
                              circles_lib_output( _out_channel, DISPATCH_WARNING, _MSG, _par_1, _cmd_tag );
                              for( var _x = 0 ; _x < _glob_figures_array.length ; _x++ )
                              _tmp_array.push( _glob_figures_array[ _x ].clone_associative() );
                         }

                         _glob_figures_array.flush();
                         _glob_figures_array = _tmp_array.clone();
                         
                         circles_lib_output( _out_channel, DISPATCH_INFO, "Rebuilding hash tags", _par_1, _cmd_tag );
                         circles_lib_figures_rehash();
                         circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Sort performed with success", _par_1, _cmd_tag );
                         circles_lib_canvas_after_process_figures( null, YES, _current_figures_plane_type );
                    }
                }
                else
                {
                    _b_fail = YES, _error_str = "Incomplete cmd: missing parameters" ;
                }
                break ;
                case "swap":
                if ( _n_input_index != 2 )
                {
                    _b_fail = YES, _error_str = "Swap requires 2 parameters" ;
                }
                else
                {
                    var _zerobased_index_1 = _index_vals_array[0] - 1 ;
                    var _zerobased_index_2 = _index_vals_array[1] - 1 ;
                    var _entry_1 = _glob_figures_array[ _zerobased_index_1 ].clone_associative();
                    var _entry_2 = _glob_figures_array[ _zerobased_index_2 ].clone_associative();
                    if ( _entry_1 != null && _entry_2 != null )
                    {
                        _glob_figures_array[ _zerobased_index_1 ] = _entry_2 ;
                        _glob_figures_array[ _zerobased_index_2 ] = _entry_1 ;
                        circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Swap performed", _par_1, _cmd_tag );
                        circles_lib_canvas_after_process_figures( null, YES, _current_figures_plane_type );
                    }
                    else
                    {
                        _b_fail = YES, _error_str = "Swap failure: input indexes do not refer to consistent entries in the archive" ;
                    }
                }
                break ;
                case "update":
                if ( _n_input_index == 0 )
                {
                     _b_fail = YES, _error_str = "Can't update: missing input index" ;
                }
                else
								{
		 								 var _ret_chunk = circles_lib_figures_update_manager( _out_channel, _params_assoc_array, _par_1, _cmd_tag );
		 								 _b_fail = _ret_chunk[0], _error_str = _ret_chunk[1] ;
								}
                break ;
			          default: break ;
           }
     }

     if ( _b_fail )
     circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function _CIRCLESfigure_display_list_item( _i, _rec_chunk, _options )
{
     var _row = "" ;
     if ( _rec_chunk != null )
     {
         var _margin_str = ( new String( "" ) ).rpad( " ", 4 );
         _row = ( _i + 1 ) + ")" + _margin_str ;
         var _label = _rec_chunk['label'] != null ? ( _rec_chunk['label'].length > 0 ? "<lemon>"+_rec_chunk['label']+"</lemon>" : "<lightgray>no label</lightgray>" ) : "" ;
             _label = _label.lpad( " ", 12 );
         var _enabled = _rec_chunk['enabled'] ? "enabled" : "disabled" ;
             _enabled = _enabled.rpad( " ", 8 );
             _enabled = _rec_chunk['enabled'] ? "<greenshock>"+_enabled+"</greenshock>" : "<red>"+_enabled+"</red>" ;
         var _plane_str = "" ;
         switch( _rec_chunk['plane'] )
         {
            case Z_PLANE: _plane_str = "zplane" ; break ;
            case W_PLANE: _plane_str = "wplane" ; break ;
            case BIP_BOX: _plane_str = "bip" ; break ;
            default: _plane_str = "unknown" ; break ;
         }

         _obj = _rec_chunk['obj'] ;

         switch( _rec_chunk['class'] )
         {
              case FIGURE_CLASS_CIRCLE:
              _row += "<snow>" + ( new String( "circle" ) ).rpad( " ", 9 ) + "</snow>" ;
              _row += ( new String( _plane_str ) ).rpad( " ", 14 );
              break ;
              case FIGURE_CLASS_LINE:
              _row += "<snow>" + ( new String( _obj.length > 2 ? "polyline" : "line" ) ).rpad( " ", 9 ) + "</snow>" ;
            	_row += ( new String( _plane_str ) ).rpad( " ", 14 );
              break ;
              case FIGURE_CLASS_RECT:
              _row += "<snow>" + ( new String( "rect" ) ).rpad( " ", 9 ) + "</snow>" ;
              _row += ( new String( _plane_str ) ).rpad( " ", 14 );
              break ;
              case FIGURE_CLASS_POINT:
              _row += "<snow>" + ( new String( "point" ) ).rpad( " ", 9 ) + "</snow>" ;
              _row += ( new String( _plane_str ) ).rpad( " ", 14 );
              break ;
			        default: break ;
         }

         _row +=  ( new String( "" ) ).rpad( " ", 4 );
         if ( _obj != null )
         {
            	if ( _rec_chunk['class'].is_one_of( FIGURE_CLASS_CIRCLE ) )
              _row += "<snow>" + _obj.output() + "</snow>" ;
              else if ( _rec_chunk['class'].is_one_of( FIGURE_CLASS_RECT ) )
              _row += "vertices: <snow>" + _obj.output( "cartesian" ) + "</snow>" ;
            	else if ( _rec_chunk['class'].is_one_of( FIGURE_CLASS_POINT ) )
              _row += "<snow>" + _obj.output( "cartesian" ) + "</snow>" ;
              else if ( _rec_chunk['class'] == FIGURE_CLASS_LINE )
              {
                  _row += "points: " ;
                  var _obj_len = _obj != null ? _obj.length : 0 ;
                  for( var _i = 0 ; _i < _obj_len ; _i++ )
                  {
                       if ( _obj[_i] != null )
                       _row += "<snow>"+_obj[_i].output( "cartesian" )+"</snow> " ;
                       else
                       _row += "<red>(missing)</red> " ;
                  }
              }
         }

         _row += _glob_crlf + _margin_str + _enabled + _margin_str + "<yellow>Label</yellow> " + _label ;

         if ( _options['long'] )
         {
             var _drawcolor = _rec_chunk['drawcolor'] != null ? _rec_chunk['drawcolor'].trim() : "" ;
             if ( circles_lib_colors_is_tag( _drawcolor ) ) _drawcolor = circles_lib_colors_get_def_from_tag( _drawcolor );
             var _fillcolor = _rec_chunk['fillcolor'] != null ? _rec_chunk['fillcolor'].trim() : "" ;
             if ( circles_lib_colors_is_tag( _fillcolor ) ) _fillcolor = circles_lib_colors_get_def_from_tag( _fillcolor );
             var _properties = [];
             _properties.push( _glob_crlf + _margin_str );
             _properties.push( ( _rec_chunk['draw'] == YES && _drawcolor.length > 0 ) ? "<yellow>Draw</yellow> ("+_drawcolor+")" : "<gray>No draw</gray>" );
             _properties.push( ( _rec_chunk['fill'] == YES && _fillcolor.length > 0 ) ? "<yellow>Fill</yellow> ("+_fillcolor+")" : "<gray>No fill</gray>" );
             if ( _rec_chunk['linewidth'] != null ) _properties.push( "<yellow>Line thickness</yellow> " + _rec_chunk['linewidth'] );
             if ( _rec_chunk['borderradius'] != null && _rec_chunk['class'].is_one_of( FIGURE_CLASS_RECT ) )
             _properties.push( "<yellow>Border radius</yellow> " + _rec_chunk['borderradius'] );
             if ( _rec_chunk['opacity'] != null ) _properties.push( "<yellow>Opacity</yellow> " + _rec_chunk['opacity'] );

             _row += _properties.join( " " );
         }
     }

     return _row ;
}