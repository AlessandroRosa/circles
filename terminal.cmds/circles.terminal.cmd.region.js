function circles_terminal_cmd_region()
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
    var _error_str = "", _msg = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _params_assoc_array = [];

	if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['props'] = [] ;
         _params_assoc_array['roundto'] = _glob_accuracy ;
         _params_assoc_array['syntax'] = [] ;
         _params_assoc_array['syntax']['coords'] = [] ;
         _params_assoc_array['syntax']['inequality'] = [] ;
         _params_assoc_array['settings'] = [] ;
         _params_assoc_array['settings']['label'] = "" ;
         _params_assoc_array['settings']['rec'] = NO ;
         _params_assoc_array['settings']['storagesubset'] = "regions" ;
         _params_assoc_array['settings']['xsyntax'] = [] ;
         _params_assoc_array['settings']['ysyntax'] = [] ;

		var _labels = [ "x1", "y1", "x2", "y2" ], _got_it = [] ;
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "release", "clean", "x", "y", "<", ">", "zplane", "wplane", "html", "rec" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p, _layer ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
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
            else if ( _p.stricmp( "rec" ) ) _params_assoc_array['settings']['rec'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
            else if ( _p.is_one_of_i( "clean" ) ) _params_assoc_array['props'].push( "clean" ) ;
            else if ( _p.is_one_of_i( "x", "y" ) )
            {
                   if ( _p.stricmp( "x" ) )
                   {
                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected inequality syntax for coord x</lightblue>", _par_1, _cmd_tag );
                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<gray>start of coord x syntax</gray>", _par_1, _cmd_tag );
                        _params_assoc_array['settings']['xsyntax']['status'] = OPEN ;
                        _params_assoc_array['settings']['xsyntax']['coord'] = YES ;
                   }
                   else if ( _p.stricmp( "y" ) )
                   {
                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected inequality syntax for coord y</lightblue>", _par_1, _cmd_tag );
                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<gray>start of coord y syntax</gray>", _par_1, _cmd_tag );
                        _params_assoc_array['settings']['ysyntax']['status'] = OPEN ;
                        _params_assoc_array['settings']['ysyntax']['coord'] = YES ;
                   }
            }
            else if ( _params_assoc_array['settings']['xsyntax']['status'] == OPEN )
            {
                   if ( _p.is_one_of( "<", ">" ) )
                   {
                       _params_assoc_array['settings']['xsyntax']['operator'] = _p ;
                       circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected operator</lightblue> <snow>"+_p+"</snow> <lightblue>for coord x syntax</lightblue>", _par_1, _cmd_tag );
                   }
                   else if ( _p.testME( _glob_float_regex_pattern ) )
                   {
                       _params_assoc_array['settings']['xsyntax']['operand'] = safe_float( _p, 0 ) ;
                       _params_assoc_array['settings']['xsyntax']['status'] = CLOSE ;
                       circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected operand</lightblue> <snow>"+_p+"</snow> <lightblue>for coord x syntax</lightblue>", _par_1, _cmd_tag );
                       circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<gray>end of coord x syntax</gray>", _par_1, _cmd_tag );
                   }
            }
            else if ( _params_assoc_array['settings']['ysyntax']['status'] == OPEN )
            {
                   if ( _p.is_one_of( "<", ">" ) )
                   {
                       _params_assoc_array['settings']['ysyntax']['operator'] = _p ;
                       circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected operator</lightblue> <snow>"+_p+"</snow> <lightblue>for coord y syntax</lightblue>", _par_1, _cmd_tag );
                       circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected operand</lightblue> <snow>"+_p+"</snow> <lightblue>for coord y syntax</lightblue>", _par_1, _cmd_tag );
                       circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<gray>end of coord y syntax</gray>", _par_1, _cmd_tag );
                   }
                   else if ( _p.testME( _glob_float_regex_pattern ) )
                   {
                       _params_assoc_array['settings']['ysyntax']['operand'] = safe_float( _p, 0 ) ;
                       _params_assoc_array['settings']['ysyntax']['status'] = CLOSE ;
                   }
            }
            else if ( _p.is_one_of_i( "zplane", "wplane" ) )
            {
              		 switch( _p.toLowerCase() )
              		 {
												case "zplane":
												if ( _params_assoc_array['props']['plane'] == null )
												{
														_params_assoc_array['props']['plane'] = _p ;
                            _params_assoc_array['props']['planeval'] = Z_PLANE ;
														_msg = "<lightblue>Selected work layer on the</lightblue> <snow>Z-plane</snow>" ;
														circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
												}
												else
												{
														var _pt = _glob_plane_cmd_type_array[ _params_assoc_array['props']['plane'] ] ;
														_msg = "<orange>Skipped param '"+_p+"' : input plane has been already set to "+_glob_plane_defs_array[_pt]+"</orange>" ;
														circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
												}
												break ;
												case "wplane":
												if ( _params_assoc_array['props']['plane'] == null )
												{
														_params_assoc_array['props']['plane'] = _p ;
                            _params_assoc_array['props']['planeval'] = W_PLANE ;
														_msg = "<lightblue>Selected work layer on the </lightblue> <snow>W-plane</snow>" ;
														circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
												}
												else
												{
														var _pt = _glob_plane_cmd_type_array[ _params_assoc_array['props']['plane'] ] ;
														_msg = "<orange>Skipped param '"+_p+"' : input plane has been already set to "+_glob_plane_defs_array[_pt]+"</orange>" ;
														circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
												}
												break ;
												default: break ;
									 }
							}
            else if ( _p.toLowerCase().start_with( "layer:" ) && _params_assoc_array['settings']['layer'] == null )
            {
				if ( _params_assoc_array['props']['plane'] == null )
				{
					_b_fail = 1 ; _error_str = "Layer argument shall be preceeded by plane definition" ;
				}
				else
				{
					var _layer = _p ;
					_layer = _params_assoc_array['settings']['layer'] = circles_lib_canvas_layer_find( _params_assoc_array['props']['plane'], FIND_LAYER_BY_ROLE_DEF, _layer ) ;
					if ( is_html_canvas( _layer ) )
					{
						_params_assoc_array['settings']['layerdef'] = _params_assoc_array['settings']['layer'].getContext(_glob_canvas_ctx_2D_mode).role_def ;
						circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lime>Selected</lime> <snow>"+_params_assoc_array['settings']['layerdef']+" layer</snow> <lime>for region rendering</lime>", _par_1, _cmd_tag );
					}
					else { _b_fail = 1 ; _error_str = "Invalid layer '"+_p+"' definition: check the correct spelling or the belonging to the proper plane" ; }
				}
            }
			else if ( _p.toLowerCase().start_with( "drawcolor:" ) && _params_assoc_array['settings']['drawcolor'] == null )
			{
				if ( !is_array( _params_assoc_array['props']['colors'] ) ) _params_assoc_array['props']['colors'] = [] ;
				_params_assoc_array['props']['colors']['drawcolor'] = safe_string( _p.replace( /drawcolor:/gi, "" ), "" ) ;
				if ( circles_lib_colors_is_def( _params_assoc_array['props']['colors']['drawcolor'] ) )
				{
					_msg = "<lightblue>Draw color has been set to</lightblue> <snow>"+_params_assoc_array['props']['colors']['drawcolor']+"</snow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid draw color definition" ; }
			}
			else if ( _p.toLowerCase().start_with( "fillcolor:" ) && _params_assoc_array['props']['colors']['fillcolor'] == null )
			{
				_params_assoc_array['props']['colors']['fillcolor'] = safe_string( _p.replace( /fillcolor:/gi, "" ), "" ) ;
				if ( circles_lib_colors_is_def( _params_assoc_array['props']['colors']['fillcolor'] ) )
				{
					_msg = "<lightblue>Fill color has been set to</lightblue> <snow>"+_params_assoc_array['props']['colors']['fillcolor']+"</snow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid fill color definition" ; break ; }
			}
            else if ( _p.start_with( "opacity:" ) && _params_assoc_array['props']['opacity'] == null )
            {
				var _opacity = safe_float( _p.replace( /opacity:/gi, "" ), 0 );
				if ( _opacity < 0 || _opacity > 1 )
				{
                    _msg = "<orange>Detected invalid opacity input</lime> <snow>"+_opacity+"</snow> <orange>and reset to default</orange> <snow>"+DEFAULT_OPACITY+"</snow>" ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                    _opacity = DEFAULT_OPACITY ;
				}
				else
				{
                    _msg = "<lightblue>Detected opacity input</lightblue> <snow>"+_opacity+"</snow>" ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}

				_params_assoc_array['props']['opacity'] = _opacity ;
			}
            else if ( _p.start_with( "linethick:" ) && _params_assoc_array['props']['linethick'] != null )
            {
				var _linethick = safe_int( _p.replace( /linethick:/gi, "" ), 0 );
                if ( _linethick < 0 )
                {
                    _msg = "<orange>Detected invalid line thickness input</lime> <snow>"+_linethick+"</snow> <orange>and reset to default</orange> <snow>0</snow>" ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                    _linethick = 0 ;
                }
                   
                _params_assoc_array['props']['linethick'] = _linethick ;
            }
			else if ( _p.includes( "," ) && _p.count( "," ) == 3 && _p.split( "," ).length == 4 )
			{
								 	 _msg = "<gray>Detected complex coordinates syntax</gray>" + _glob_crlf + "<gray>Attempting to parse and resolve</gray>" ;
									 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
									 var _params = _p.split( "," ), _coord, _def ;
									 $.each( _params,
									 				 function( _i, _p )
													 {
													 		_coord = isNaN( _p ) ? "nan" : safe_float( _p, 0 ) ;
													 		if ( _coord == "nan" )
													 		{
																	 _msg = "<orange>Invalid input coord operand '"+_p+"' at param #"+(_i+1)+"</orange>" ;
																	 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
																	 _b_fail = YES, _error_str = "Process aborted" ;
															}
															else
															{
                                  switch( _i )
                                  {
                                      case 0: _def = "left coord" ; break ;
                                      case 1: _def = "top coord" ; break ;
                                      case 2: _def = "right coord" ; break ;
                                      case 3: _def = "bottom coord" ; break ;
         				                      default: break ;
                                  }
		 															_params_assoc_array['syntax']['coords'].push( _coord );
																	_msg = "<lime>Detected region coord</lime> <snow>"+_coord+"</snow> <lime>and saved with success as</lime> <snow>"+_def+"</snow>" ;
																	_got_it.push( _i ) ;
																	circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
															}
													 }
												 ) ;
			}
            else if ( _p.testME( _glob_float_regex_pattern ) )
            {
                var _n_coords = safe_size( _params_assoc_array['syntax']['coords'], 0 ) ;
                if ( _n_coords <= 4 )
                {
                    _params_assoc_array['syntax']['coords'].push( safe_float( _p, 0 ) );
                    _msg = "<lime>Detected region coord</lime> <snow>"+_p+"</snow> <lime>and saved with success</lime>" ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                    _got_it.push( _got_it.length );
                }
                else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>Skipped redundant input data detected at</orange> <snow>"+_p+"</snow>", _par_1, _cmd_tag );
            }
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
         }

        var _x_syntax_flag = _params_assoc_array['settings']['xsyntax'].associative_key_exists('status') ? ( _params_assoc_array['settings']['xsyntax']['status'] == CLOSE ? YES : NO ) : NO ;
        var _y_syntax_flag = _params_assoc_array['settings']['ysyntax'].associative_key_exists('status') ? ( _params_assoc_array['settings']['ysyntax']['status'] == CLOSE ? YES : NO ) : NO ;
        var _input_rect_flag = safe_size( _got_it, 0 ) == 4 ? YES : NO ;
        var _action = _params_assoc_array['action'] ;
        if ( safe_string( _action, "" ).trim().length == 0 ) _action = "draw" ;
         
        if ( _params_assoc_array['settings']['layer'] == null )
        _params_assoc_array['settings']['layer'] = circles_lib_canvas_layer_find( _params_assoc_array['props']['planeval'], FIND_LAYER_BY_ROLE_DEF, "work" ) ;
         
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
        else if ( !_x_syntax_flag && !_y_syntax_flag && !_input_rect_flag ) { _b_fail = YES, _error_str = "Missing input coords" ; }
        else if ( _action.strcmp( "draw" ) && !( _params_assoc_array['props'].associative_key_exists('plane') ) )
        {
			_b_fail = YES, _error_str = "Missing input plane" ;
		}
         else if ( !_b_fail )
				 {
             var _round_to = _params_assoc_array['roundto'] ;
		         switch( _action )
		         {
                  case "draw":
                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>End of input stage</snow>", _par_1, _cmd_tag );
                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "", _par_1, _cmd_tag );
                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>Begin to process data</snow>", _par_1, _cmd_tag );
                  if ( safe_size( _got_it, 0 ) > 0 )
                  {
                  		_params_assoc_array['props']['left_top_flag'] = _got_it.includes(0) && _got_it.includes( 1 ) ? YES : NO ;
                   		_params_assoc_array['props']['right_bottom_flag'] = _got_it.includes( 2 ) && _got_it.includes( 3 ) ? YES : NO ;
                      if ( _params_assoc_array['props']['left_top_flag'] )
    									{
    											_params_assoc_array['props']['left_top_pt'] = new point( _params_assoc_array['syntax']['coords'][0], _params_assoc_array['syntax']['coords'][1] );
                          _msg = "<lightblue>Region left top corner</lightblue> <lime>has been filled with success</lime> <lightblue>"+_params_assoc_array['props']['left_top_pt'].output("cartesian",_round_to)+"</lightblue>" ;
    											circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
     									}

     									if ( _params_assoc_array['props']['right_bottom_flag'] )
     									{
     											_params_assoc_array['props']['right_bottom_pt'] = new point( _params_assoc_array['syntax']['coords'][2], _params_assoc_array['syntax']['coords'][3] );
     											_msg = "<lightblue>Region right bottom corner</lightblue> <lime>has been filled with success and set at</lime> <lightblue>"+_params_assoc_array['props']['right_bottom_pt'].output("cartesian",_round_to)+"</lightblue>" ;
     											circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
     									}
                  }

                  if ( _params_assoc_array['settings']['xsyntax']['status'] == CLOSE )
                  {
                      circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Found coord x syntax", _par_1, _cmd_tag );
                      var _ret_chunk = circles_terminal_cmd_region_check_syntax( _params_assoc_array['settings']['xsyntax'] ) ;
                      var _ret_id = _ret_chunk[0], _ret_mask = _ret_chunk[1] ;
                      if ( !_ret_id )
                      {
                          _b_fail = YES, _error_str = "Detected invalid coord x syntax: process aborted" ;
                          if ( _ret_mask & 1 ) _error_str += _glob_crlf + "Found incomplete syntax" ;
                          if ( _ret_mask & 2 ) _error_str += _glob_crlf + "Missing coord identifier" ;
                          if ( _ret_mask & 4 ) _error_str += _glob_crlf + "Missing operator symbol" ;
                          if ( _ret_mask & 8 ) _error_str += _glob_crlf + "Missing operand identifier" ;
                      }
                      else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lime>Coord x syntax has been validated with success</lime>", _par_1, _cmd_tag );
                  }

                  if ( _params_assoc_array['settings']['ysyntax']['status'] == CLOSE )
                  {
                       circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Found coord y syntax", _par_1, _cmd_tag );
                       var _ret_chunk = circles_terminal_cmd_region_check_syntax( _params_assoc_array['settings']['ysyntax'] ) ;
                       var _ret_id = _ret_chunk[0], _ret_mask = _ret_chunk[1] ;
                       if ( !_ret_id ) { _b_fail = YES, _error_str = "Detected invalid coord y syntax: process aborted" ; }
                       else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lime>Coord x syntax has been validated with success</lime>", _par_1, _cmd_tag );
                  }

      		    var _plane_type = circles_lib_plane_get_value( _params_assoc_array['props']['plane'] ) ;
                var _rect_region = null, _canvas, _mapper = null, _context = null ;
                var _plane_rect = null ;
                if ( _plane_type == Z_PLANE )
                {
					_plane_rect = zplane_sm.get_coords_rect();
					_mapper = zplane_sm, _canvas = _params_assoc_array['settings']['layer'] != null ? _params_assoc_array['settings']['layer'] : _glob_zplane_work_layer_placeholder ;
					_context = _canvas.getContext( _glob_canvas_ctx_2D_mode ) ;
				}
                else if ( _plane_type == W_PLANE )
                {
					_plane_rect = wplane_sm.get_coords_rect();
					_mapper = wplane_sm, _canvas = _params_assoc_array['settings']['layer'] != null ? _params_assoc_array['settings']['layer'] : _glob_wplane_work_layer_placeholder ;
					_context = _canvas.getContext( _glob_canvas_ctx_2D_mode ) ;
				}
                  
                if ( _params_assoc_array['props'].includes( "clean" ) )
                {
                    circles_lib_canvas_clean( _canvas, "transparent", _output_channel );
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>"+_params_assoc_array['props']['plane']+"</snow> <lightblue>has been cleaned before drawing</lightblue>", _par_1, _cmd_tag );
                }

             	var _draw = _params_assoc_array['props']['colors']['drawcolor'] != null ? YES : NO ;
             	var _drawcolor = _draw ? _params_assoc_array['props']['colors']['drawcolor'] : "transparent" ;
             	var _fill = _params_assoc_array['props']['colors']['fillcolor'] != null ? YES : NO ;
             	var _fillcolor = _fill ? _params_assoc_array['props']['colors']['fillcolor'] : "transparent" ;
             	var _opacity = _params_assoc_array['props']['opacity'] != null ? safe_float( _params_assoc_array['props']['opacity'], DEFAULT_OPACITY ) : DEFAULT_OPACITY ;
             	var _linethick = _params_assoc_array['props']['linethick'] != null ? safe_int( _params_assoc_array['props']['linethick'], 0 ) : 0 ;

                if ( _input_rect_flag )
                {
                       _rect_region = new rect( _params_assoc_array['syntax']['coords'], _RECT_ORIENTATION_CARTESIAN );
                       _rect_region.correct();
                       var _area = _rect_region.area() ;
                       if ( _area == 0 ) { _b_fail = YES, _error_str = "Input rect region is of zero area: process aborted" ; }
                       else circles_lib_draw_rect( _context, _mapper, _rect_region,
								 	   	_draw, _drawcolor, _fill, _fillcolor,
										_draw ? _linethick : 0, YES, _opacity, 0 ) ;
                }
                  else if ( _x_syntax_flag || _y_syntax_flag )
                  {
                       var MAX = CIRCLES_MAX_COORD, _operand, _operator ;
                       var _rect = [ -MAX, MAX, MAX, -MAX ] ;
                       if ( _x_syntax_flag )
                       {
                            _operand = _params_assoc_array['settings']['xsyntax']['operand'] ;
                            _operator = _params_assoc_array['settings']['xsyntax']['operator'] ;
                            if ( _operator == "<" ) _rect[2] = _operand ;
                            else if ( _operator == ">" ) _rect[0] = _operand ;
                       }

                       if ( _y_syntax_flag )
                       {
                            _operand = _params_assoc_array['settings']['ysyntax']['operand'] ;
                            _operator = _params_assoc_array['settings']['ysyntax']['operator'] ;
                            if ( _operator == "<" ) _rect[1] = _operand ;
                            else if ( _operator == ">" ) _rect[3] = _operand ;
                       }

                       _rect_region = new rect( _rect );
                       _rect_region.correct();

                       var _area = _rect_region.area() ;
                       if ( _area == 0 ) { _b_fail = YES, _error_str = "Input rect region is of zero area: process aborted" ; }
                       else circles_lib_draw_rect( _context, _mapper, _rect_region,
					 									_draw, _drawcolor, _fill, _fillcolor,
														_draw ? _linethick : 0, YES, _opacity, 0 ) ;
									}
                  else { _b_fail = YES, _error_str = "Missing input reference plane: process aborted" ; }

                  if ( _params_assoc_array['settings']['rec'] == YES )
                  {
                     var _rec_chunk = [];
                     _rec_chunk['class'] = FIGURE_CLASS_REGION ;
                     _rec_chunk['draw'] = _fill ;
                     _rec_chunk['drawcolor'] = _drawcolor ;
                     _rec_chunk['enabled'] = YES ;
                     _rec_chunk['fill'] = _fill ;
                     _rec_chunk['fillcolor'] = _fillcolor ;
                     _rec_chunk['label'] = _params_assoc_array['settings']['label'] ;
                     _rec_chunk['linethick'] = _linethick ;
                     _rec_chunk['myhash'] = "rec" + _glob_figures_array.length ;
                     _rec_chunk['obj'] = _rect_region ;
                     _rec_chunk['opacity'] = _opacity ;
                     _rec_chunk['plane'] = _params_assoc_array['props']['planeval'] ;
                     _glob_figures_array.push( _rec_chunk );

                     var _subset = _params_assoc_array['settings']['storagesubset'] ;
                     if ( !is_array( _glob_storage[_subset] ) )
                     {
                        _glob_storage[_subset] = [] ;
                        var _msg = "Storage space <white>'"+_subset+"'</white> has been created with success" ;
                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                     }

                     if ( is_array( _glob_storage[_subset] ) )
                     {
                        _glob_storage[_subset].push( _rec_chunk );
                        var _default_space = _subset == "regions" ? 1 : 0 ;
                        var _msg = "<green>Region "+( _rec_chunk['label'].length > 0 ? "'"+_rec_chunk['label']+"' " : "" )+"has been recorded into "+(_default_space?"default ":"")+"'"+_subset+"' storage space</green>" ;
                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                     }
                     else circles_lib_output( _output_channel, DISPATCH_WARNING, "Storage space '"+_subset+"' does not exist", _par_1, _cmd_tag );
                  }
                  break ;
		              case "release":
		              circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
		              break ;
		              default: break ;
		         }
				 }
    }
    else if ( _params.length == 0 ) { _b_fail = YES, _error_str = "Missing all input params" ; }

     if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function circles_terminal_cmd_region_check_syntax( _syntax_array )
{
     if ( is_array( _syntax_array ) )
     {
        var _mask = 0 ;
        if ( _syntax_array['status'] != CLOSE ) _mask |= 1 ;
        if ( _syntax_array['coord'] != YES ) _mask |= 2 ;
        if ( _syntax_array['operator'] == null ) _mask |= 4 ;
        if ( _syntax_array['operand'] == null ) _mask |= 8 ;
        return [ _mask == 0 ? YES : NO, _mask ] ;
     }
     else return [ UNDET, NO ] ;
}