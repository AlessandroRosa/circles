function circles_terminal_cmd_circle()
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
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );

    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "draw", "drawcolor", "fill", "fillcolor", "opacity", "radius",
						 																"wplane", "zplane", "bip", "rec", "thick", "release", "help", "html" );
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
 				 _params_assoc_array['settings'] = [] ;
         _params_assoc_array['settings']['rec'] = NO ;
         _params_assoc_array['settings']['copy'] = NO ;
         _params_assoc_array['settings']['label'] = "" ;
         _params_assoc_array['settings']['propertiesmask'] = 0 ;
         _params_assoc_array['settings']['plane'] = NO_PLANE ;
         _params_assoc_array['settings']['sector_start'] = 0 ;
         _params_assoc_array['settings']['sector_end'] = CIRCLES_TWO_PI ;
         _params_assoc_array['settings']['storagequeue'] = [] ;
         _params_assoc_array['settings']['storagesubset'] = "circles" ;
         var _p,  _b_cmd_open = NO ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         var _index_associations = [], _i, _l ;
         for( _i = 0 ; _i < _up_to_index ; _i++ )
         {
              _p = _params_array[_i] ;
              if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p.toLowerCase();
              else if ( _p.stricmp( "rec" ) ) _params_assoc_array['settings']['rec'] = YES ;
              else if ( _p.is_one_of_i( "storagein" ) ) _params_assoc_array['settings']['params'].push( _p ) ;
              else if ( _p.start_with( "storagesubset:" ) ) _params_assoc_array['settings']['storagesubset'] = _p.replaceAll( "storagesubset:", "" ) ;
              else if ( _p.start_with_i( "$" ) )
              {
                 for( _l = 0 ; _l < _glob_figures_array.length ; _l++ )
                 {
                    if ( _p.stricmp( _glob_figures_array[_l]['label'] ) )
                    {
                       var _class = _glob_figures_array[_l]['class'] ;
                       if ( _class == FIGURE_CLASS_CIRCLE ) _class = "circle" ;
                       else if ( _class == FIGURE_CLASS_LINE ) _class = "line" ;
                       else if ( _class == FIGURE_CLASS_POINT ) _class = "point" ;
                       else if ( _class == FIGURE_CLASS_RECT ) _class = "rect" ;
                       _b_fail = YES ;
                       _error_str = "There exists "+_class+" already labelled as '"+_p+"'" ;
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

								  _msg = "<lightblue>Plane has been set to</lightblue> <snow>"+_p+"</snow>" ;
									circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
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
              else if ( _p.testME( _glob_sector_regex_pattern ) )
              {
                   _p = _p.replaceAll( [ "[", "]" ], "" );
                   _p = _p.split( "," );
									 _msg = "<lightblue>Detected sector range syntax</lightblue> <snow>from "+_p[0]+"</snow> to <snow>"+_p[1]+"</snow>" ;
									 circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                   // before converting to radians, values will be adapted for
                   // rendering sectors according to the standard counter-clockwise orientation
                   _params_assoc_array['settings']['sector_start'] = radians( -_p[1] );
                   _params_assoc_array['settings']['sector_end'] = radians( -_p[0] );
              }
              else if ( _p.testME( _glob_positive_float_regex_pattern ) )
              {
                   if ( _params_assoc_array['settings']['radius'] == null )
                   {
                       _params_assoc_array['settings']['radius'] = safe_float( _p, 1 );
											 _msg = "<lightblue>Radius has been set to</lightblue> <snow>"+_p+"</snow>" ;
											 circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                   }
                   else if ( _params_assoc_array['settings']['linewidth'] == null )
                   {
                       _params_assoc_array['settings']['linewidth'] = safe_int( _p, 1 );
											 _msg = "<lightblue>Line width has been set to</lightblue> <snow>"+_p+"</snow>" ;
											 circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                   }
                   else if ( _params_assoc_array['settings']['opacity'] == null )
                   {
                       _params_assoc_array['settings']['opacity'] = safe_float( _p, 1 );
											 _msg = "<lightblue>Opacity has been set to</lightblue> <snow>"+_p+"</snow>" ;
											 circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                   }
              }
              else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
              {
                  if ( !is_point( _params_assoc_array['settings']['center'] ) )
                  {
                      _p = _p.replaceAll( [ "(", ")" ], "" );
                      var _pt_array = _p.split( "," );
                      _params_assoc_array['settings']['center'] = new point( parseFloat( _pt_array[0] ), parseFloat( _pt_array[1] ) );
    								  _msg = "<lightblue>Circle center has been set to</lightblue> <snow>"+_p+"</snow>" ;
    									circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                  }
              }
         }
     }
     else
     {
         _b_fail = YES ;
         _error_str = "Missing input params" ;
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
              // checking input errors
              if ( _params_assoc_array['help'] == NO && !_b_fail )
              {
                   if ( _params_assoc_array['settings']['label'].length > 0 && _params_assoc_array['settings']['rec'] == NO )
                   {
                      circles_lib_output( _out_channel, DISPATCH_INFO, "Skipped symbol param. Mismatch setting: no rec param input", _par_1, _cmd_tag );
                      if ( _glob_verbose )
                      circles_lib_output( _out_channel, DISPATCH_INFO, "Symbol param is useless if this figure is not going to be recorded", _par_1, _cmd_tag );
                   }
                   else if ( _params_assoc_array['settings']['plane'] == NO_PLANE )
                   {
                      _b_fail = YES ;
                      _error_str = "Can't plot circle: missing plane reference" ; 
                   }
                   else if ( !is_point( _params_assoc_array['settings']['center'] ) )
                   {
                      _b_fail = YES ;
                      _error_str = "Can't plot circle: missing center coords" ;
                   }
                   else if ( _params_assoc_array['settings']['radius'] == null )
                   {
                      _b_fail = YES ;
                      _error_str = "Can't plot circle: missing radius" ;
                   }
          
                   // beware of some missing color param, so let's check'em deeper
                   if ( _params_assoc_array['settings']['drawcolor'] == null &&
                        _params_assoc_array['settings']['fillcolor'] == null )
                   {
                       _b_fail = YES ;
                       _error_str = "Missing draw and filling colors: this circle won't be visible" ;
                   }
                   else
                   {
                       var _drawcolor = _params_assoc_array['settings']['drawcolor'] ;
                       var _draw = _drawcolor != null ? ( ( _drawcolor.length > 0 && !_drawcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
                       var _fillcolor = _params_assoc_array['settings']['fillcolor'] ;
                       var _fill = _fillcolor != null ? ( ( _fillcolor.length > 0 && !_fillcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
                       if ( _draw == NO && _fill == NO )
                       {
                            _b_fail = YES ;
                            _error_str = "Missing draw and filling colors: this circle won't be visible" ; 
                       }
                   }
              }

              // elaborating the params
              if ( !_b_fail && _params_assoc_array['help'] == NO )
              {
                   var _canvas_context, _mapper ;
                   var _drawcolor = _params_assoc_array['settings']['drawcolor'] ;
                   var _draw = _drawcolor != null ? ( ( _drawcolor.length > 0 && !_drawcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
                   var _fillcolor = _params_assoc_array['settings']['fillcolor'] ;
                   var _fill = _fillcolor != null ? ( ( _fillcolor.length > 0 && !_fillcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
          
                   var _linewidth = ( _params_assoc_array['settings']['linethick'] == null ) ? 1 : safe_int( _params_assoc_array['settings']['linethick'], 1 );
                   if ( _linewidth == 0 ) { _draw = NO ; _drawcolor = "" ; }
                   var _border_radius = ( _params_assoc_array['settings']['borderradius'] == null ) ? 0 : safe_int( _params_assoc_array['settings']['borderradius'], 0 );
                   var _opacity = ( _params_assoc_array['settings']['opacity'] == null ) ? 1.0 : safe_float( _params_assoc_array['settings']['opacity'], DEFAULT_MAX_OPACITY );
                    
                   var _circle_obj = new circle( _params_assoc_array['settings']['center'], _params_assoc_array['settings']['radius'],
                   															 _draw, _fill, _drawcolor, _fillcolor, _linewidth );
                   switch( _params_assoc_array['settings']['plane'] )
                   {
                       case Z_PLANE:
                       _canvas_context = _glob_zplane_work_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode );
                       _mapper = zplane_sm ;
                       break ;
                       case W_PLANE:
                       _canvas_context = _glob_wplane_work_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode );
                       _mapper = wplane_sm ;
                       break ;
                       case BIP_BOX:
                       _canvas_context = _glob_bip_canvas.getContext( _glob_canvas_ctx_2D_mode );
                       _mapper = bipbox_sm ;
                       break ;
								       default: break ;
                   }
          
                   if ( is_circle( _circle_obj ) )
                   {
                       var _screen_circle = circles_lib_draw_complex_disk( _canvas_context, _mapper,
                                                                    _circle_obj.center.x, _circle_obj.center.y, _circle_obj.radius,
                                                                    _draw, _drawcolor, _fill, _fillcolor,
                                                                    _linewidth, _opacity,
                                                                    _params_assoc_array['settings']['sector_start'],
																																		_params_assoc_array['settings']['sector_end'],
																																		"", _params_assoc_array['settings']['propertiesmask'] );
                       if ( !is_circle( _screen_circle ) )
                       {
                           _b_fail = YES ;
                           _error_str = "Fail to draw the circle: invalid object declation" ;
                       }
                       else
                       {
                           circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<snow>(" + circles_lib_plane_get_def( _params_assoc_array['settings']['plane'] ) + ")</snow> <green>Circle processed with success</green>", _par_1, _cmd_tag );
                           if ( _params_assoc_array['settings']['rec'] == YES || _storage_queue_request )
                           {
                               var _rec_chunk = [];
                                   _rec_chunk['class'] = FIGURE_CLASS_CIRCLE ;
                                   _rec_chunk['obj'] = _circle_obj ;
                                   _rec_chunk['plane'] = _params_assoc_array['settings']['plane'] ;
                                   _rec_chunk['draw'] = _draw ;
                                   _rec_chunk['drawcolor'] = _drawcolor ;
                                   _rec_chunk['fill'] = _fill ;
                                   _rec_chunk['fillcolor'] = _fillcolor ;
                                   _rec_chunk['opacity'] = _opacity ;
                                   _rec_chunk['linewidth'] = _linewidth ;
                                   _rec_chunk['enabled'] = YES ;
                                   _rec_chunk['label'] = _params_assoc_array['settings']['label'].length > 0 ? _params_assoc_array['settings']['label'] : new String( "" );
                                   _rec_chunk['myhash'] = "rec" + _glob_figures_array.length ;
                                   _rec_chunk['propertiesmask'] = _params_assoc_array['settings']['propertiesmask'] ;
                                   _glob_figures_array.push( _rec_chunk );
          
                                   if ( _storage_queue_request )
                                   {
                                       var _subset = _params_assoc_array['settings']['storagesubset'] ;
                                       if ( is_array( _glob_storage[_subset] ) )
                                       {
                                           _glob_storage[_subset].push( _rec_chunk );
                                           var _msg = "<green>Circle "+( _rec_chunk['settings']['label'].length > 0 ? "'"+_rec_chunk['settings']['label']+"'" : "" )+" has been copied into data storage space</green>" ;
                                           circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                                       }
                                       else circles_lib_output( _out_channel, DISPATCH_WARNING, "'"+_subset+"' does not refer to any valid storage space subset", _par_1, _cmd_tag );
                                   }
          
                                   circles_lib_output( _out_channel, DISPATCH_INFO, "Circle recorded", _par_1, _cmd_tag );
                            }
                       }
                   }
                   else
                   {
                       _b_fail = YES ;
                       _error_str = "Can't draw circle: memory failure. Free some resources" ;
                   }
              }
              break ;
         }
     }

     if ( _b_fail )
     circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}