function circles_terminal_cmd_point()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose && _glob_terminal_echo_flag )
     circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );

    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "fill", "draw", "rec", "zplane", "wplane", "bip",
                                            "drawcolor", "fillcolor", "opacity", "thick", "release", "html", "help" );
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
         var _index_associations = [];
             _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
             _params_assoc_array['settings'] = [] ;
             _params_assoc_array['settings']['propertiesmask'] = 0 ;
             _params_assoc_array['settings']['rec'] = NO ;
             _params_assoc_array['settings']['copy'] = NO ;
             _params_assoc_array['settings']['label'] = "" ;
             _params_assoc_array['settings']['plane'] = NO_PLANE ;
             _params_assoc_array['settings']['pt'] = [] ;
         _params_assoc_array['settings']['storagequeue'] = [] ;
         _params_assoc_array['settings']['storagesubset'] = "circles" ;
         var _p,  _b_cmd_open = NO, _i, _l ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( _i = 0 ; _i < _up_to_index ; _i++ )
         {
             _p = _params_array[_i] ;
             if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
             else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
             else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
             else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
             else if ( _p.stricmp( "rec" ) ) _params_assoc_array['settings']['rec'] = YES ;
             else if ( _p.is_one_of_i( "storagein" ) ) _params_assoc_array['settings']['params'].push( _p ) ;
             else if ( _p.start_with( "storagesubset:" ) ) _params_assoc_array['settings']['storagesubset'] = _p.replaceAll( "storagesubset:", "" ) ;
             else if ( _p.start_with_i( "$" ) )
             {
                   for( _l = 0 ; _l < _glob_figures_array.length ; _l++ )
                   {
                        if ( _p.stricmp( _glob_figures_array[_l]['label'] ) )
                        {
                             _b_fail = YES, _error_str = "There exists already another figure labelled as '"+_p+"'" ;
                             break ;
                        }
                   }

                   if ( !_b_fail ) _params_assoc_array['settings']['label'] = _p ;
             }
             else if ( _p.is_one_of_i( "zplane", "wplane", "bip" ) )
             {
                  if ( _p.stricmp( "zplane" ) ) _params_assoc_array['settings']['plane'] = Z_PLANE ;
                  else if ( _p.stricmp( "wplane" ) ) _params_assoc_array['settings']['plane'] = W_PLANE ;
                  else if ( _p.stricmp( "bip" ) ) _params_assoc_array['settings']['plane'] = BIP_BOX ;
             }
 						 else if ( circles_lib_colors_is_def( _p ) )
						 {
								 if ( _params_assoc_array['settings']['drawcolor'] == null )
								 {
							 		   _params_assoc_array['settings']['drawcolor'] = _p ;
							 		   _msg = "<lightblue>Border color has been set to</lightblue> <snow>"+_p+"</snow>" ;
						  			 circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
								 }
								 else if ( _params_assoc_array['settings']['fillcolor'] == null )
								 {
										 _params_assoc_array['settings']['fillcolor'] = _p ;
										 _msg = "<lightblue>Fill color has been set to</lightblue> <snow>"+_p+"</snow>" ;
										 circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
								 }
								 else
								 {
										 _msg = "<orange>Redundant input color params found in '"+_p+"': skipped</orange>" ;
										 circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
								 }
						 }
             else if ( _p.testME( _glob_positive_float_regex_pattern ) )
             {
                 if ( _params_assoc_array['settings']['borderradius'] == null )
                 {
                      _params_assoc_array['settings']['borderradius'] = safe_int( _p, 1 );
										  _msg = "<lightblue>Border radius has been set to</lightblue> <snow>"+_p+"</snow>" ;
										  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                 }
                 else if ( _params_assoc_array['settings']['linethick'] == null )
                 {
                      _params_assoc_array['settings']['linethick'] = safe_int( _p, 1 );
										  _msg = "<lightblue>Line thickness has been set to</lightblue> <snow>"+_p+"</snow>" ;
										  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                 }
                 else if ( _params_assoc_array['settings']['opacity'] == null )
                 {
                      _params_assoc_array['settings']['opacity'] = safe_float( _p, DEFAULT_MAX_OPACITY );
										  _msg = "<lightblue>Opacity has been set to</lightblue> <snow>"+_p+"</snow>" ;
										  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                 }
             }
             else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
             {
                  _p = _p.replaceAll( [ "(", ")" ], "" );
                  var _pt_array = _p.split( "," );
                  _params_assoc_array['settings']['pt'].push( new point( parseFloat( _pt_array[0] ), parseFloat( _pt_array[1] ) ) );
                  _index_associations['pt'] = _i ;
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
             var _action = _params_assoc_array['action'] ;
             var _storage_queue_request = _params_assoc_array['settings']['params'].includes_i( "storagein" ) ? YES : NO ;
             switch( _action )
             {
                 case "release":
                 circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                 break ;
                 default:
                 if ( _params_assoc_array['settings']['label'].length > 0 && _params_assoc_array['settings']['rec'] == NO )
                 {
                      circles_lib_output( _out_channel, DISPATCH_INFO, "Skipped label param. Mismatch setting: no rec param input", _par_1, _cmd_tag );
                      if ( _glob_verbose && _glob_terminal_echo_flag )
                      circles_lib_output( _out_channel, DISPATCH_INFO, "Label param is useless if this figure is not going to be recorded", _par_1, _cmd_tag );
                 }
                 else if ( _params_assoc_array['settings']['plane'] == NO_PLANE )
                 {
                      _b_fail = YES, _error_str = "Can't plot point: missing plane reference" ;
                 }
        
                 // beware of some missing color param, so let's check'em deeper
                 if ( _params_assoc_array['settings']['drawcolor'] == null && _params_assoc_array['settings']['fillcolor'] == null )
                 {
                     _b_fail = YES, _error_str = "Missing draw and filling colors: this circle won't be visible" ;
                 }
                 else
                 {
                     var _drawcolor = _params_assoc_array['settings']['drawcolor'] ;
                     var _draw = _drawcolor != null ? ( ( _drawcolor.length > 0 && !_drawcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
                     var _fillcolor = _params_assoc_array['settings']['fillcolor'] ;
                     var _fill = _fillcolor != null ? ( ( _fillcolor.length > 0 && !_fillcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
                     if ( _draw == NO && _fill == NO )
                     {
                          _b_fail = YES, _error_str = "Missing draw and filling colors: this point won't be visible" ;
                     }
                 }

                  // take coordinates, colors and plot point
                  var _canvas_context, _mapper ;
                  switch( _params_assoc_array['settings']['plane'] )
                  {
                      case Z_PLANE:
                      _canvas_context = _glob_zplane_freedraw_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode );
                      _mapper = zplane_sm ;
                      break ;
                      case W_PLANE:
                      _canvas_context = _glob_wplane_work_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode );
                      _mapper = wplane_sm ;
                      break ;
                      case BIP_BOX:
                      _canvas_context = _glob_BIP_BOX.getContext( _glob_canvas_ctx_2D_mode );
                      _mapper = bipbox_sm ;
                      break ;
							        default: break ;
                  }
        
                  var _drawcolor = _params_assoc_array['settings']['drawcolor'] ;
                  var _draw = _drawcolor != null ? ( ( _drawcolor.length > 0 && !_drawcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
                  var _fillcolor = _params_assoc_array['settings']['fillcolor'] ;
                  var _fill = _fillcolor != null ? ( ( _fillcolor.length > 0 && !_fillcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
                  var _opacity = safe_float( _params_assoc_array['settings']['opacity'], DEFAULT_MAX_OPACITY ) ;
                  var _linewidth = safe_int( _params_assoc_array['settings']['linethick'], 1 );
                  if ( _linewidth == 0 ) { _draw = NO ; _drawcolor = "" ; }
                  var _border = safe_int( _params_assoc_array['settings']['borderradius'], _glob_pt_border ) ;
        
                  var _pt_obj = null ;
                  // switch to different constructors, according to input data
                  for( var _i = 0 ; _i < _params_assoc_array['settings']['pt'].length ; _i++ )
                  {
                      if ( _params_assoc_array['settings']['pt'][_i] != null ) _pt_obj = _params_assoc_array['settings']['pt'][_i] ;
                      if ( is_point( _pt_obj ) )
                      {
                          circles_lib_draw_point( _canvas_context, _mapper, _pt_obj.x, _pt_obj.y,
                                            _draw, _drawcolor, _fill, _fillcolor, _border, _glob_pt_radius, _opacity, _params_assoc_array['settings']['propertiesmask'] );
                          circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<snow>(" + circles_lib_plane_get_def( _params_assoc_array['settings']['plane'] ) + ")</snow> <green>Point "+_pt_obj.output("cartesian")+" processed with success</green>", _par_1, _cmd_tag );
        
                          if ( _params_assoc_array['settings']['rec'] == YES || _storage_queue_request )
                          {
                               var _rec_chunk = [];
                               _rec_chunk['class'] = FIGURE_CLASS_POINT ;
                               _rec_chunk['obj'] = _pt_obj ;
                               _rec_chunk['plane'] = _params_assoc_array['settings']['plane'] ;
                               _rec_chunk['draw'] = _draw ;
                               _rec_chunk['drawcolor'] = _drawcolor ;
                               _rec_chunk['fill'] = _fill ;
                               _rec_chunk['fillcolor'] = _fillcolor ;
                               _rec_chunk['opacity'] = _opacity ;
                               _rec_chunk['linewidth'] = _linewidth ;
                               _rec_chunk['enabled'] = YES ;
                               _rec_chunk['label'] = _params_assoc_array['settings']['label'].length > 0 ? _params_assoc_array['settings']['label'] : "" ;
                               _rec_chunk['myhash'] = "rec" + _glob_figures_array.length ;
                               _glob_figures_array.push( _rec_chunk );
        
                               if ( _storage_queue_request )
                               {
                                   var _subset = _params_assoc_array['settings']['storagesubset'] ;
                                   if ( is_array( _glob_storage[_subset] ) )
                                   {
                                       _glob_storage[_subset].push( _rec_chunk );
                                       var _msg = "<green>Point "+( _rec_chunk['label'].length > 0 ? "'"+_rec_chunk['label']+"'" : "" )+" has been copied into data storage space</green>" ;
                                       circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                                   }
                                   else circles_lib_output( _out_channel, DISPATCH_WARNING, "'"+_subset+"' does not refer to any valid storage space subset", _par_1, _cmd_tag );
                               }
        
                               circles_lib_output( _out_channel, DISPATCH_INFO, "Point "+_pt_obj.output("cartesian")+" recorded", _par_1, _cmd_tag );
                          }
                      }
                      else
                      {
                          _b_fail = YES, _error_str = "Can't plot point: memory failure. Free some resources" ;
                          break ;
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

     if ( _b_fail )
     circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}