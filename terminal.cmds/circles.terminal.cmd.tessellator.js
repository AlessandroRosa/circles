_glob_terminal_cmd_files_include[ "tessellator" ] = [ "figures" ] ;

function circles_terminal_cmd_tessellator()
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

		 var _last_release_date = get_file_modify_date( _glob_paths['terminal_abs_cmds'], "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _sd_n = circles_lib_count_seeds();
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _help = NO ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _cmd_params = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _cmd_params['help'] = NO ;
         _cmd_params['keywords'] = NO ;
         _cmd_params['plane'] = _glob_target_plane ;
         _cmd_params['rec'] = NO ;
         _cmd_params['span'] = NO ;
         _cmd_params['tessellation'] = "" ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "grid", "radial", "span", "wave", "rec", "zplane", "wplane", "release",
						 															  "startcenter", "radius", "html", "shiftvert", "shifthorz", "cols", "rows",
						 															  "amplitude", "height", "reps", "circles",
						 															  "radial", "sector", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
              else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
              else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
              else if ( _p.is_one_of_i( "grid", "radial", "wave" ) ) _cmd_params['tessellation'] = _p ;
              else if ( _p.is_one_of_i( "rec" ) ) _cmd_params['rec'] = YES ;
              else if ( _p.is_one_of_i( "span" ) ) _cmd_params['span'] = YES ;
              else if ( _p.is_one_of_i( "zplane" ) ) _cmd_params['plane'] = Z_PLANE ;
              else if ( _p.is_one_of_i( "wplane" ) ) _cmd_params['plane'] = W_PLANE ;
              else if ( _p.start_with_i( "startcenter:" ) )
              {
                   _p = _p.replaceAll( "startcenter:", "" );
                   if ( _p.testME( _glob_cartesian_coords_regex_pattern ) ) _cmd_params['startcenter'] = _p ;
                   else { _b_fail = YES, _error_str = "Incorrect syntax for start center coords" ; break ; }
              }
              else if ( _p.start_with_i( "radius:" ) )
              {
                   _p = _p.replaceAll( "radius:", "" );
                   if ( _p.testME( _glob_float_regex_pattern ) ) _cmd_params['radius'] = Math.max( safe_float( _p, 0 ), 0 );
                   else { _b_fail = YES, _error_str = "Incorrect syntax for disk radius" ; break ; }
              }
              else if ( _cmd_params['tessellation'].strcmp( "grid" ) )
              {
                   if ( _p.start_with_i( "shifthorz:" ) ) _cmd_params['shifthorz'] = Math.abs( safe_float( _p.replaceAll( "shifthorz:", "" ), 0 ) );
                   if ( _p.start_with_i( "shiftvert:" ) ) _cmd_params['shiftvert'] = Math.abs( safe_float( _p.replaceAll( "shiftvert:", "" ), 0 ) );
                   if ( _p.start_with_i( "cols:" ) ) _cmd_params['cols'] = Math.max( safe_int( _p.replaceAll( "cols:", "" ), 0 ), 0 );
                   if ( _p.start_with_i( "rows:" ) ) _cmd_params['rows'] = Math.max( safe_int( _p.replaceAll( "rows:", "" ), 0 ), 0 );
              }
              else if ( _cmd_params['tessellation'].strcmp( "wave" ) )
              {
                   if ( _p.start_with_i( "amplitude:" ) ) _cmd_params['amplitude'] = Math.abs( safe_float( _p.replaceAll( "amplitude:", "" ), 0 ) );
                   if ( _p.start_with_i( "height:" ) ) _cmd_params['height'] = Math.abs( safe_float( _p.replaceAll( "height:", "" ), 0 ) );
                   if ( _p.start_with_i( "reps:" ) ) _cmd_params['reps'] = Math.abs( safe_int( _p.replaceAll( "reps:", "" ), 0 ) );
                   if ( _p.start_with_i( "circles:" ) ) _cmd_params['circles'] = Math.abs( safe_int( _p.replaceAll( "circles:", "" ), 0 ) );
              }
              else if ( _cmd_params['tessellation'].strcmp( "radial" ) )
              {
                   if ( _p.start_with_i( "sector:" ) )
                   {
                       _p = _p.replaceAll( "sector:", "" );
                       if ( _p.testME( _glob_float_regex_pattern ) || _p.testME( "([0-9\-\.]{1,})\*([PI|pi]{2})" ) )
                       {
                            var _sec = circles_lib_math_parse_formula( _p );
                            _cmd_params['sector'] = safe_float( _sec, 0 ).roundTo( 6 ) ;
                       }
                       else { _b_fail = YES, _error_str = "Incorrect syntax for sector amplitude" ; break ; }
                   }

                   if ( _p.start_with_i( "rotationcenter:" ) )
                   {
                       _p = _p.replaceAll( "rotationcenter:", "" );
                       if ( _p.testME( _glob_cartesian_coords_regex_pattern ) ) _cmd_params['rotationcenter'] = _p ;
                       else { _b_fail = YES, _error_str = "Incorrect syntax for circles number" ; break ; }
                   }

                   if ( _p.start_with_i( "circles:" ) ) _cmd_params['circles'] = Math.abs( safe_int( _p.replaceAll( "circles:", "" ), 0 ) );
              }
              else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
         }

         if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
         else if ( _cmd_params['keywords'] )
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
             var _action = _cmd_params['action'] ;
             switch( _action )
             {
                 case "release":
                 circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                 break ;
                 default:
                 var _tessellate_fn = function()
                 {
                     var _tessellation = _cmd_params['tessellation'] ;
                     if ( _cmd_params['sector'] == null && _tessellation.strcmp( "radial" ) )
                     {
                          _cmd_params['sector'] = CIRCLES_TWO_PI ;
                          circles_lib_output( _out_channel, DISPATCH_INFO, "Missing input sector amplitude. Set to default: 2PI", _par_1, _cmd_tag );
                     }
                     else if ( Math.abs( _cmd_params['sector'] ) > CIRCLES_TWO_PI && _tessellation.strcmp( "radial" ) )
                     {
                          circles_lib_output( _out_channel, DISPATCH_INFO, "Input sector amplitude ("+_cmd_params['sector']+") exceeding radians range (2PI)", _par_1, _cmd_tag );
                          _cmd_params['sector'] = rad( _cmd_params['sector'] );
                          circles_lib_output( _out_channel, DISPATCH_INFO, "Assumed to be in degrees and converted to "+_cmd_params['sector']+" radians", _par_1, _cmd_tag );
                     }

                     if ( _cmd_params['span'] && !( _tessellation.strcmp( "radial" ) ) )
                          circles_lib_output( _out_channel, DISPATCH_INFO, "Skipped 'span' param for "+_tesselation+" tesselation", _par_1, _cmd_tag );

                     if ( _tessellation.length == 0 )
                     {
                          _b_fail = YES, _error_str = "Missing tessellation: tessellation aborted" ;
                     }
                     else if ( _glob_method == METHOD_NONE )
                     {
                         _b_fail = YES, _error_str += "Can't tessellate. Choose one among these methods first:" ;
                         _error_str += _glob_crlf + "inversion   algebraic" ;
                     }
                     else if (
                               ( _tessellation.strcmp( "grid" ) && _cmd_params['cols'] * _cmd_params['rows'] > _glob_caps_letters_array.length )
                               ||
                               ( _tessellation.strcmp( "radial" ) && _cmd_params['circles'] > _glob_caps_letters_array.length )
                             )
                     {
                          _b_fail = YES, _error_str = "Candidate number of gens exceed maximum ("+_glob_caps_letters_array.length+")" ;
                     }
                     else
                     {
                          if ( _cmd_params['plane'] == NO_PLANE )
                          {
                              _cmd_params['plane'] = Z_PLANE ;
                              circles_lib_output( _out_channel, DISPATCH_INFO, "Missing plane definition: default setting to 'zplane'", _par_1, _cmd_tag );
                          }

                          switch( _tessellation )
                          {
                               case "grid":
                               if ( _cmd_params['radius'] == null ) _cmd_params['radius'] = 0 ;
                               if ( _cmd_params['cols'] == null ) _cmd_params['cols'] = 0 ;
                               if ( _cmd_params['rows'] == null ) _cmd_params['rows'] = 0 ;

                               if ( _cmd_params['startcenter'] == null ||
                                    _cmd_params['radius'] == 0 || _cmd_params['cols'] == 0 || _cmd_params['rows'] == 0
                                  )
                               {
                                    _b_fail = YES ;
                                    var _ret_msg_array = [];
                                    if ( _cmd_params['radius'] == 0 ) _ret_msg_array.push( "* Missing radius" );
                                    if ( _cmd_params['startcenter'] == null ) _ret_msg_array.push( "* Missing start center point" );
                                    if ( _cmd_params['cols'] == 0 ) _ret_msg_array.push( "* Missing number of columns of grid tessellation" );
                                    if ( _cmd_params['rows'] == 0 ) _ret_msg_array.push( "* Missing number of rows of grid tessellation" );

                                    _error_str = "Can't process grid tessellation" + _glob_crlf + _ret_msg_array.join( _glob_crlf );
                               }
                               else
                               {
                                    var _cols = _cmd_params['cols'], _rows = _cmd_params['rows'] ;
                                    var _start_pt_array = _cmd_params['startcenter'].replaceAll( [ "(", ")" ], "").split( "," );
                                    var _start_pt = new point( safe_float( _start_pt_array[0], 0 ), safe_float( _start_pt_array[1], 0 ) );
                                    var _radius = Math.abs( safe_float( _cmd_params['radius'], 0 ) );
                                    var _shifthorz = safe_float( _cmd_params['shifthorz'], 0 );
                                    var _shiftvert = safe_float( _cmd_params['shiftvert'], 0 );
                                    var _cx, _cy, _complex_circle, _screen_circle, _x, _y ;
                                    _glob_seeds_array = [];
                                    for( _x = 0 ; _x < _cols ; _x++ )
                                    {
                                        _cx = _start_pt.x + _shifthorz * _x ;
                                        for( _y = 0 ; _y < _rows ; _y++ )
                                        {
                                            _cy = _start_pt.y + _shiftvert * _y ;
                                            _glob_seeds_array.push( new item_obj( null, new circle( new point( _cx, _cy ), _radius ), null,
                                                                                  "", 0,
                                                                                  YES, _glob_draw_seed_color, NO, "",
                                                                                  "", 1, ITEM_TYPE_CIRCLE ) );
                                        }
                                    }
                               }
                               break ;
                               case "radial":
                               if ( _cmd_params['radius'] == null ) _cmd_params['radius'] = 0 ;
                               if ( _cmd_params['sector'] == null ) _cmd_params['sector'] = 0 ;
                               if ( _cmd_params['circles'] == null ) _cmd_params['circles'] = 0 ;

                               if ( _cmd_params['startcenter'] == null ||
                                    _cmd_params['radius'] == 0 ||
                                    _cmd_params['sector'] == 0 ||
                                    _cmd_params['circles'] == 0
                                  )
                               {
                                    _b_fail = YES ;
                                    var _ret_msg_array = [];
                                    if ( _cmd_params['radius'] == 0 ) _ret_msg_array.push( "* Missing disk radius for radial tessellation" );
                                    if ( _cmd_params['startcenter'] == null ) _ret_msg_array.push( "* Missing start center point for radial tessellation" );
                                    if ( _cmd_params['sector'] == 0 && _cmd_params['circles'] == 0 ) _ret_msg_array.push( "* Missing sector amplitude for radial tessellation." );
                                    if ( _cmd_params['circles'] == 0 ) _ret_msg_array.push( "* Missing circles number for radial tessellation" );
                                    _error_str = "Can't process radial tessellation" + _glob_crlf + _ret_msg_array.join( _glob_crlf );
                               }
                               else
                               {
                                    var _n_circles = Math.abs( safe_int( _cmd_params['circles'], 0 ) );
                                    var _den = (  _cmd_params['span'] ) ? ( _n_circles - 1 ) : _n_circles ;
                                    var _sector_rad = ( _den == 1 ) ? _cmd_params['sector'] : safe_float( _cmd_params['sector'], 0 ) / _den ;
                                    var _start_pt_array = _cmd_params['startcenter'].replaceAll( [ "(", ")" ], "").split( "," );
                                    var _start_pt = new point( safe_float( _start_pt_array[0], 0 ), safe_float( _start_pt_array[1], 0 ) );
                                    var _radius = Math.abs( safe_float( _cmd_params['radius'], 0 ) );

                                    var _rotation_center_array = ( _cmd_params['rotationcenter'] != null ) ? _cmd_params['rotationcenter'].replaceAll( [ "(", ")" ], "").split( "," ) : [ 0, 0 ] ;
                                    var _rotation_center = new point( safe_float( _rotation_center_array[0], 0 ), safe_float( _rotation_center_array[1], 0 ) );

                                    var _complex_circle = null, _complex_center ;
                                    var _complex_circle = new circle( _start_pt, _radius );
                                    var _complex_center = new complex( _complex_circle.center.x, _complex_circle.center.y );
                                    var _center_pt = null, _rotated_pt ;
                                    _glob_seeds_array = [];
                                    for( var _i = 0 ; _i < _n_circles ; _i++ )
                                    {
                                        _rotated_pt = _complex_center.rotate( new complex( _rotation_center.x, _rotation_center.y ), _i * _sector_rad, 0 );
                                        _center_pt = new point( _rotated_pt.real, _rotated_pt.imag );
                                        _glob_seeds_array.push( new item_obj( null, new circle( _center_pt, _radius ), null,
                                                                              "", 0,
                                                                              YES, _glob_draw_seed_color, NO, "",
                                                                              "", 1, ITEM_TYPE_CIRCLE ) );
                                    }
                               }
                               break ;
                               case "wave":
                               if ( _cmd_params['amplitude'] == null ) _cmd_params['amplitude'] = 0 ;
                               if ( _cmd_params['height'] == null ) _cmd_params['height'] = 0 ;
                               if ( _cmd_params['circles'] == null ) _cmd_params['circles'] = 0 ;
                               if ( _cmd_params['radius'] == null ) _cmd_params['radius'] = 0 ;
                               if ( _cmd_params['reps'] == null ) _cmd_params['reps'] = 0 ;

                               if ( _cmd_params['startcenter'] == null ||
                                    _cmd_params['radius'] == 0 ||
                                    _cmd_params['amplitude'] == 0 ||
                                    _cmd_params['height'] == 0 ||
                                    _cmd_params['reps'] == 0 ||
                                    _cmd_params['circles'] == 0 )
                               {
                                    _b_fail = YES ;
                                    var _ret_msg_array = [];
                                    if ( _cmd_params['radius'] == 0 ) _ret_msg_array.push( "* Missing disk radius for wave tessellation" );
                                    if ( _cmd_params['amplitude'] == 0 ) _ret_msg_array.push( "* Missing amplitude for wave tessellation" );
                                    if ( _cmd_params['height'] == 0 ) _ret_msg_array.push( "* Missing height for wave tessellation" );
                                    if ( _cmd_params['startcenter'] == null ) _ret_msg_array.push( "* Missing start center point for wave tessellation" );
                                    if ( _cmd_params['circles'] == 0 ) _ret_msg_array.push( "* Missing circles number for wave tessellation" );
                                    if ( _cmd_params['reps'] == 0 ) _ret_msg_array.push( "* Missing repetitions number for wave tessellation" );

                                    _error_str = "Can't process wave tessellation" + _glob_crlf + _ret_msg_array.join( _glob_crlf );
                               }
                               else
                               {
                                    var _n_circles = Math.abs( safe_int( _cmd_params['circles'], 0 ) );
                                    var _n_reps = Math.abs( safe_int( _cmd_params['reps'], 0 ) );
                                    var _start_pt_array = _cmd_params['startcenter'].replaceAll( [ "(", ")" ], "").split( "," );
                                    var _start_pt = new point( safe_float( _start_pt_array[0], 0 ), safe_float( _start_pt_array[1], 0 ) );
                                    var _radius = Math.abs( safe_float( _cmd_params['radius'], 0 ) );
                                    var _height = safe_float( _cmd_params['height'], 0 );
                                    var _amplitude = Math.abs( safe_float( _cmd_params['amplitude'], 0 ) );

                                    var _shift_amplitude = _amplitude / _n_circles ;
                                    var _shift_height = _height / _n_circles ;
                                    var _direction_flag = false ;

                                    var _complex_circle = null, _complex_center ;
                                    var _complex_circle = new circle( _start_pt, _radius );
                                    var _complex_center = new complex( _complex_circle.center.x, _complex_circle.center.y );
                                    var _center_pt = _start_pt ;
                                    var _min_height = _start_pt.y - _height ;
                                    var _max_height = _start_pt.y + _height ;
                                    var _cx = _center_pt.x, _cy = _center_pt.y ;
                                    var _r, _c ;

                                    _glob_seeds_array = [];
                                    for( _r = 0 ; _r < _n_reps * 2 ; _r++ )
                                    {
                                        for( _c = 0 ; _c < _n_circles ; _c++ )
                                        {
                                            _glob_seeds_array.push( new item_obj( null, new circle( new point( _cx, _cy ), _radius ), null,
                                                                                  "", 0, YES, _glob_draw_seed_color, NO, "", "", 1, 0 ) );
                                            _cx += _shift_amplitude ;
                                            if ( !_direction_flag ) _cy += _shift_height ;
                                            else _cy -= _shift_height ;
                                            if ( _cy <= _min_height || _cy >= _max_height ) _direction_flag = !_direction_flag ;
                                        }
                                    }
                               }
                               break ;
                               default: break ;
                          }

                          if ( !_b_fail )
                          {
                              var _ret_chunk = circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, _glob_terminal_echo_flag, _out_channel );
                              circles_lib_recalc_screen_disks_coords( zplane_sm );
                              if ( _glob_method.is_one_of( METHOD_INVERSION ) )
                              circles_lib_alphabet_autoconfig_all_symbols( NO, YES, NO, YES, _out_channel );
                              else 
                              {
                                   circles_lib_output( _out_channel, DISPATCH_WARNING, "Current method requires symbols to be manually set", _par_1, _cmd_tag );
                                   circles_lib_output( _out_channel, DISPATCH_INFO, "Input cmd 'disk %index% %symbol%'. Ex: 'disk 0 A'", _par_1, _cmd_tag );
                              }

                              _glob_items_to_init = YES ;
                              var _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, _glob_verbose, YES, YES, _out_channel );
                              var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                              var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
                              if ( _ret_id == RET_OK )
                              {
                                  if ( _cmd_params['plane'] == Z_PLANE )
                                  {
                                  	 var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _out_channel );
																     var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
																	   var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
																	   if ( _ret_id == RET_ERROR )
																	   {
																		 		 _b_fail = YES, _error_str = _ret_msg ;
																		 }
																	}
                                  else if ( _cmd_params['plane'] == W_PLANE )
                                  circles_lib_draw_all_screen_disks( _glob_wplane_rendering_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ), wplane_sm, null, YES, YES, _out_channel );
                                  var _plane_def = circles_lib_plane_def_get( _cmd_params['plane'] );
                                  circles_lib_output( _out_channel, DISPATCH_SUCCESS, _plane_def + ": " + _tessellation + " tessellation performed with success", _par_1, _cmd_tag );
                              }
                              else
                              {
                                  _b_fail = YES, _error_str = _ret_msg ;
                              }
                          }
                     }
                 }

                 if ( _sd_n > 0 && _out_channel == OUTPUT_TERMINAL )
                 {
                    circles_lib_output( _out_channel, DISPATCH_WARNING, "A set of seeds has been detected", _par_1, _cmd_tag );
                    var _prompt_question = "Do you want to delete'em and replace with current tessellation ?" ;
  			     		    var _params_array = [] ;
  								   	  _params_array['prepromptquestion'] = null ;
   							        _params_array['promptquestion'] = _prompt_question ;
   							        _params_array['yes_fn'] = function() { _tessellate_fn(); }
   							        _params_array['ifquestiondisabled_fn'] = function() { _tessellate_fn(); }
					if ( !_glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
   					else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                 }
                 else _tessellate_fn();
    
                 _items_n = circles_lib_count_items();
                 if ( _cmd_params['rec'] )
                 {
                     if ( _items_n > 0 )
                     {
                          var _chunk = null, _complex_circle, _found, _tmp_chunk ;
                          for( var _i = 0 ; _i < _items_n ; _i++ )
                          {
                              _chunk = _glob_seeds_array[ _i ] ;
                              _complex_circle = _chunk.complex_circle ;
                              _found = circles_lib_figures_find_duplicates( FIGURE_CLASS_CIRCLE, _cmd_params['plane'], _complex_circle );
                              if ( !_found )
                              {
                                   _tmp_chunk = [];
                                   _tmp_chunk['class'] = FIGURE_CLASS_CIRCLE ;
                                   _tmp_chunk['obj'] = new circle( _complex_circle.get_center(), _complex_circle.get_radius() );
                                   _tmp_chunk['plane'] = _cmd_params['plane'] ;
                                   _tmp_chunk['border'] = _chunk.complex_circle.draw ;
                                   _tmp_chunk['bordercolor'] = _chunk.complex_circle.bordercolor ;
                                   _tmp_chunk['fill'] = _chunk.complex_circle.fill ;
                                   _tmp_chunk['fillcolor'] = _chunk.complex_circle.fillcolor ;
                                   _tmp_chunk['opacity'] = DEFAULT_MAX_OPACITY ;
                                   _tmp_chunk['bordersize'] = _chunk.complex_circle.bordersize ;
                                   _tmp_chunk['enabled'] = _chunk.enabled ;
                                   _tmp_chunk['symbol'] = "" ;
                                   circles_lib_figures_add( _tmp_chunk );
                              }
                          }
                     }
                     else circles_lib_output( _out_channel, DISPATCH_WARNING, _ERR_33_01 + ": no figures to rec", _par_1, _cmd_tag );
                 }
                 break ;
             }
         }
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}