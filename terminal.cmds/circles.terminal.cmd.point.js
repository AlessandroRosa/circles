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
     var _cmd_params = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 

    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "fill", "draw", "rec", "zplane", "wplane", "bip",
                                            "bordercolor", "fillcolor", "opacity", "thick", "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );

				 var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
				 _cmd_params['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
				 _cmd_params['dump_operator_index'] = _dump_operator_index ;
				 _cmd_params['dump_array'] = [];
				
				 // gather all dump parameters into one array
         if ( _cmd_params['dump'] )
         {
    				 for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
    				 if ( _params_array[_i].trim().length > 0 ) _cmd_params['dump_array'].push( _params_array[_i] );
         }
				 
         // distribute all input values into arrays of categories
        var _index_associations = [];
        _cmd_params['help'] = NO ;
        _cmd_params['keywords'] = NO ;
        _cmd_params = [] ;
        _cmd_params['propertiesmask'] = 0 ;
        _cmd_params['rec'] = NO ;
        _cmd_params['copy'] = NO ;
        _cmd_params['label'] = "" ;
        _cmd_params['plane'] = Z_PLANE ;
		_cmd_params['layer'] = "work" ;
        _cmd_params['pt'] = [] ;
        _cmd_params['storagequeue'] = [] ;
        _cmd_params['storagesubset'] = "circles" ;
         var _p,  _b_cmd_open = NO, _i, _l ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( _i = 0 ; _i < _up_to_index ; _i++ )
         {
             _p = _params_array[_i] ;
             if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
             else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
             else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
             else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
             else if ( _p.stricmp( "rec" ) ) _cmd_params['rec'] = YES ;
             else if ( _p.is_one_of_i( "storagein" ) ) _cmd_params['params'].push( _p ) ;
             else if ( _p.start_with( "storagesubset:" ) ) _cmd_params['storagesubset'] = _p.replaceAll( "storagesubset:", "" ) ;
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

                if ( !_b_fail ) _cmd_params['label'] = _p ;
             }
             else if ( _p.is_one_of_i( "zplane", "wplane", "bip" ) )
             {
                  if ( _p.stricmp( "zplane" ) ) _cmd_params['plane'] = Z_PLANE ;
                  else if ( _p.stricmp( "wplane" ) ) _cmd_params['plane'] = W_PLANE ;
                  else if ( _p.stricmp( "bip" ) ) _cmd_params['plane'] = BIP_BOX ;
             }
			else if ( _p.toLowerCase().start_with( "layer:" ) && _cmd_params['layer'] == null )
			{
				_cmd_params['layer'] = safe_string( _p.replace( /layer:/gi, "" ), "" ) ;
				_msg = "<lightblue>Layer has been set to</lightblue> <snow>"+_cmd_params['layer']+"</snow>" ;
				circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
			}
			else if ( _p.toLowerCase().start_with( "bordercolor:" ) && _cmd_params['bordercolor'] == null )
			{
				_cmd_params['bordercolor'] = safe_string( _p.replace( /bordercolor:/gi, "" ), "" ) ;
				if ( circles_lib_colors_is_def( _cmd_params['bordercolor'] ) )
				{
					_msg = "<lightblue>Border color has been set to</lightblue> <snow>"+_cmd_params['bordercolor']+"</snow>" ;
					circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid border color value" ; }
			}
			else if ( _p.toLowerCase().start_with( "fillcolor:" ) && _cmd_params['fillcolor'] == null )
			{
				_cmd_params['fillcolor'] = safe_string( _p.replace( /fillcolor:/gi, "" ), "" ) ;
				if ( circles_lib_colors_is_def( _cmd_params['fillcolor'] ) )
				{
					_msg = "<lightblue>Fill color has been set to</lightblue> <snow>"+_cmd_params['fillcolor']+"</snow>" ;
					circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid fill color value" ; break ; }
			}
			else if ( _p.toLowerCase().start_with( "opacity:" ) && _cmd_params['opacity'] == null )
			{
				_cmd_params['opacity'] = safe_string( _p.replace( /opacity:/gi, "" ), "" ) ;
				if ( _cmd_params['opacity'].testME( _glob_positive_float_regex_pattern ) )
				{
					_msg = "<lightblue>Opacity has been set to</lightblue> <snow>"+_cmd_params['opacity']+"</snow>" ;
					circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid opacity value" ; break ; }
			}
			else if ( _p.toLowerCase().start_with( "radius:" ) && _cmd_params['radius'] == null )
			{
				_cmd_params['radius'] = safe_string( _p.replace( /radius:/gi, "" ), "" ) ;
				if ( _cmd_params['radius'].testME( _glob_positive_float_regex_pattern ) )
				{
					_msg = "<lightblue>Radius has been set to</lightblue> <snow>"+_cmd_params['radius']+"</snow>" ;
					circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid radius value" ; break ; }
			}
			else if ( _p.toLowerCase().start_with( "bordersize:" ) && _cmd_params['bordersize'] == null )
			{
				_cmd_params['bordersize'] = safe_string( _p.replace( /bordersize:/gi, "" ), "" ) ;
				if ( _cmd_params['bordersize'].testME( _glob_positive_float_regex_pattern ) )
				{
					_msg = "<lightblue>Border size has been set to</lightblue> <snow>"+_cmd_params['bordersize']+"</snow>" ;
					circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid border size" ; break ; }
			}
            else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
            {
                _p = _p.replaceAll( [ "(", ")" ], "" );
                var _pt_array = _p.split( "," );
                _cmd_params['pt'].push( new point( safe_float( _pt_array[0], 0 ), safe_float( _pt_array[1], 0 ) ) );
                _index_associations['pt'] = _i ;
            }
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
             var _storage_queue_request = _cmd_params['params'] != null ? ( _cmd_params['params'].includes_i( "storagein" ) ? YES : NO ) : NO ;
             switch( _action )
             {
                 case "release":
                 circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                 break ;
                 default:
                 if ( _cmd_params['label'].length > 0 && _cmd_params['rec'] == NO )
                 {
                      circles_lib_output( _out_channel, DISPATCH_INFO, "Skipped label param. Mismatch setting: no rec param input", _par_1, _cmd_tag );
                      if ( _glob_verbose && _glob_terminal_echo_flag )
                      circles_lib_output( _out_channel, DISPATCH_INFO, "Label param is useless if this figure is not going to be recorded", _par_1, _cmd_tag );
                 }
                 else if ( _cmd_params['plane'] == NO_PLANE ) { _b_fail = YES, _error_str = "Can't plot point: missing plane reference" ; }
        
                // beware of some missing color param, so let's check'em deeper
                if ( _cmd_params['bordercolor'] == null && _cmd_params['fillcolor'] == null )
                {
                    _b_fail = YES, _error_str = "Missing draw and filling colors: this circle won't be visible" ;
                }
                else if ( _cmd_params['pt'].length == 0 ) { _b_fail = YES, _error_str = "Missing point(s) coordinate(s)" ; }
                else
                {
                    var _bordercolor = _cmd_params['bordercolor'] ;
                    var _border = _bordercolor != null ? ( ( _bordercolor.length > 0 && !_bordercolor.is_one_of_i( "noclr", "transparent" ) ) ? YES : NO ) : NO ;
                    var _fillcolor = _cmd_params['fillcolor'] ;
                    var _fill = _fillcolor != null ? ( ( _fillcolor.length > 0 && !_fillcolor.is_one_of_i( "noclr", "transparent" ) ) ? YES : NO ) : NO ;
                    if ( _border == NO && _fill == NO ) { _b_fail = YES, _error_str = "Missing colors: this point won't be visible" ; }
                }

                // take coordinates, colors and plot point
                var _canvas_context = null, _mapper = null ;
				var _layer = circles_lib_canvas_layer_find( _cmd_params['plane'], FIND_LAYER_BY_ROLE_DEF, _cmd_params['layer'], _out_channel );
				if ( is_html_canvas( _layer ) )
				{
					switch( _cmd_params['plane'] )
					{
						case Z_PLANE:
						_canvas_context = _layer.getContext( _glob_canvas_ctx_2D_mode );
						_mapper = zplane_sm ;
						break ;
						case W_PLANE:
						_canvas_context = _layer.getContext( _glob_canvas_ctx_2D_mode );
						_mapper = wplane_sm ;
						break ;
						case BIP_BOX:
						_canvas_context = _glob_BIP_BOX.getContext( _glob_canvas_ctx_2D_mode );
						_mapper = bipbox_sm ;
						break ;
						default: break ;
					}
        		}
				else { _b_fail = YES ; _error_str = "Invalid input layer '"+_cmd_params['layer']+"'" ; }

				var _bordercolor = _cmd_params['bordercolor'] ;
                var _border = _bordercolor != null ? ( ( _bordercolor.length > 0 && !_bordercolor.is_one_of_i( "noclr", "transparent" ) ) ? YES : NO ) : NO ;
                var _fillcolor = _cmd_params['fillcolor'] ;
                var _fill = _fillcolor != null ? ( ( _fillcolor.length > 0 && !_fillcolor.is_one_of_i( "noclr", "transparent" ) ) ? YES : NO ) : NO ;
                var _opacity = safe_float( _cmd_params['opacity'], DEFAULT_MAX_OPACITY ) ;
                var _bordersize = safe_int( _cmd_params['bordersize'], _glob_pt_border );
                if ( _bordersize == 0 ) { _border = NO ; _bordercolor = "" ; }
                var _radius = safe_float( _cmd_params['radius'], _glob_pt_radius ) ;
        
                var _pt_obj = null ;
                // switch to different constructors, according to input data
                  for( var _i = 0 ; _i < _cmd_params['pt'].length ; _i++ )
                  {
                      if ( _cmd_params['pt'][_i] != null ) _pt_obj = _cmd_params['pt'][_i] ;
                      if ( is_point( _pt_obj ) )
                      {
                          circles_lib_draw_point( _canvas_context, _mapper, _pt_obj.x, _pt_obj.y,
                                            _border, _bordercolor, _fill, _fillcolor, _bordersize, _radius, _opacity, _cmd_params['propertiesmask'] );
                          circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<snow>(" + circles_lib_plane_def_get( _cmd_params['plane'] ) + ")</snow> <green>Point "+_pt_obj.output("cartesian")+" processed with success</green>", _par_1, _cmd_tag );
        
                          if ( _cmd_params['rec'] == YES || _storage_queue_request )
                          {
                               var _rec_chunk = [];
                               _rec_chunk['class'] = FIGURE_CLASS_POINT ;
                               _rec_chunk['obj'] = _pt_obj ;
                               _rec_chunk['plane'] = _cmd_params['plane'] ;
                               _rec_chunk['layer'] = _cmd_params['layer'] ;
                               _rec_chunk['border'] = _border ;
                               _rec_chunk['bordercolor'] = _bordercolor ;
                               _rec_chunk['fill'] = _fill ;
                               _rec_chunk['fillcolor'] = _fillcolor ;
                               _rec_chunk['opacity'] = _opacity ;
                               _rec_chunk['bordersize'] = _bordersize ;
                               _rec_chunk['enabled'] = YES ;
                               _rec_chunk['radius'] = _radius ;
                               _rec_chunk['label'] = _cmd_params['label'].length > 0 ? _cmd_params['label'] : "" ;
                               _rec_chunk['myhash'] = "rec" + _glob_figures_array.length ;
                               _glob_figures_array.push( _rec_chunk );
        
                               if ( _storage_queue_request )
                               {
                                   var _subset = _cmd_params['storagesubset'] ;
                                   if ( is_array( _glob_storage[_subset] ) )
                                   {
                                       _glob_storage[_subset].push( _rec_chunk );
                                       var _msg = "<green>Point "+( _rec_chunk['label'].length > 0 ? "'"+_rec_chunk['label']+"'" : "" )+" has been copied into data storage space</green>" ;
                                       circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                                   }
                                   else circles_lib_output( _out_channel, DISPATCH_WARNING, "'"+_subset+"' does not refer to any valid storage space subset", _par_1, _cmd_tag );
                               }
        
                               circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Point "+_pt_obj.output("cartesian")+" recorded with success", _par_1, _cmd_tag );
                          }
                      }
                      else { _b_fail = YES, _error_str = "Can't plot point: memory failure. Free some resources" ; break ; }
                  }
                 break ;
             }
         }
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
     circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}