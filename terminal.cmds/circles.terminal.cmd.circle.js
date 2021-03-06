function circles_terminal_cmd_circle()
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
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    else if ( _params.length > 0 )
    {
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['help'] = NO ;
        _cmd_params['keywords'] = NO ;
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 

    	var _cmd_terms_dict = [ "draw", "bordercolor", "fill", "fillcolor", "opacity", "radius",
						 				 "wplane", "zplane", "bip", "rec", "thick", "release", "html" ];
        circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
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
        _cmd_params['rec'] = NO ;
        _cmd_params['copy'] = NO ;
        _cmd_params['rad'] = NO ;
        _cmd_params['label'] = "" ;
		_cmd_params['layer'] = "work" ;
        _cmd_params['propertiesmask'] = 0 ;
        _cmd_params['plane'] = Z_PLANE ;
        _cmd_params['sector_start'] = 0 ;
        _cmd_params['sector_end'] = CIRCLES_TWO_PI ;
        _cmd_params['storagequeue'] = [] ;
        _cmd_params['storagesubset'] = "circles" ;
		_cmd_params['word'] = "" ;
        var _p,  _b_cmd_open = NO ;
        // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
        var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
        var _index_associations = [], _i, _l ;
        for( _i = 0 ; _i < _up_to_index ; _i++ )
        {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p.toLowerCase();
            else if ( _p.is_one_of_i( "compute", "deg", "html", "inversion", "isometric", "rec" ) ) _cmd_params[_p] = YES ;
            else if ( _p.start_with( "storagesubset:" ) ) _cmd_params['storagesubset'] = _p.replaceAll( "storagesubset:", "" ) ;
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
                       
					   _b_fail = YES ; _error_str = "There exists "+_class+" already labelled as '"+_p+"'" ;
                       break ;
                    }
                }

                if ( !_b_fail ) _cmd_params['label'] = _p ;
            }
            else if ( _p.is_one_of_i( "zplane", "z-plane", "wplane", "w-plane", "bip", "bipbox" ) )
            {
                if ( _p.stricmp( "zplane", "z-plane" ) ) _cmd_params['plane'] = Z_PLANE ;
                else if ( _p.stricmp( "wplane", "w-plane" ) ) _cmd_params['plane'] = W_PLANE ;
                else if ( _p.stricmp( "bip", "bipbox" ) ) _cmd_params['plane'] = BIP_BOX ;

				_msg = "<lightblue>Plane has been set to</lightblue> <snow>"+_p+"</snow>" ;
				circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
            }
			else if ( _p.toLowerCase().start_with( "sector:" ) )
			{
				_p = safe_string( _p.replace( /sector:/gi, "" ), 1 ) ;
				if ( _p.testME( _glob_sector_regex_pattern ) )
				{
					_p = _p.replaceAll( [ "[", "]" ], "" ).split( "," );
					_msg = "<lightblue>Found sector range syntax</lightblue> <snow>from "+_p[0]+"</snow> to <snow>"+_p[1]+"</snow>" ;
					_msg += "<gray>"+_glob_crlf+"Input angle mode in "+(_cmd_params['rad']?"radians":"degrees")+"</gray>" ;
					circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					//before converting to radians, values will be adapted for
					//rendering sectors according to the standard counter-clockwise orientation
					_cmd_params['sector_start'] = _cmd_params['rad'] ? safe_float(-_p[1],0) : radians( -_p[1] );
					_cmd_params['sector_end'] = _cmd_params['rad'] ? safe_float(-_p[0],0) : radians( -_p[0] );
					_msg = "<lightblue>Sector has been set </lightblue> <snow>from "+_p[1]+" to "+_p[0]+"</snow>" ;
					circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES ; _error_str = "Bad circle sector format: '"+_p+"'" ; break ; }
			}
			else if ( _p.toLowerCase().start_with( "layer:" ) )
			{
				_cmd_params['layer'] = safe_string( _p.replace( /layer:/gi, "" ), "" ) ;
				_msg = "<lightblue>Layer has been set to</lightblue> <snow>"+_cmd_params['layer']+"</snow>" ;
				circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
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
			else if ( _p.toLowerCase().start_with( "bordersize:" ) && _cmd_params['bordersize'] == null )
			{
				_cmd_params['bordersize'] = safe_string( _p.replace( /bordersize:/gi, "" ), "" ) ;
				if ( _cmd_params['bordersize'].testME( _glob_positive_float_regex_pattern ) )
				{
					_msg = "<lightblue>Border size has been set to</lightblue> <snow>"+_cmd_params['bordersize']+"</snow>" ;
					circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid border size value" ; break ; }
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
			else if ( _p.toLowerCase().start_with( "label:" ) )
			{
				_cmd_params['label'] = safe_string( _p.replace( /label:/gi, "" ), "" ) ;
				_msg = "<lightblue>Label has been set to</lightblue> <snow>"+_cmd_params['label']+"</snow>" ;
				circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
			}
            else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) && _cmd_params['center'] == null )
            {
                if ( !is_point( _cmd_params['center'] ) )
                {
                    var _pt_array = _p.replaceAll( [ "(", ")" ], "" ).split( "," );
                    _cmd_params['center'] = new point( safe_float( _pt_array[0], 0 ), safe_float( _pt_array[1], 0 ) );
					_msg = "<lightblue>Circle center has been set to</lightblue> <snow>"+_p+"</snow>" ;
    				circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                }
            }
            else if ( _p.testME( _glob_simple_string_regex_pattern ) ) { _cmd_params['compute'] = YES ; _cmd_params['word'] = _p ; }
        }
    }
    else { _b_fail = YES ; _error_str = "Missing input params" ; }

    if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
    else if ( _cmd_params['keywords'] )
    {
        var _msg = circles_lib_terminal_tabular_arrange_data( _cmd_terms_dict.sort() ) ;
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
            if ( _cmd_params['help'] == NO && !_b_fail )
            {
                   if ( _cmd_params['label'].length > 0 && _cmd_params['rec'] == NO )
                   {
                      circles_lib_output( _out_channel, DISPATCH_INFO, "Skipped 'label' param. Mismatch setting: no rec param input", _par_1, _cmd_tag );
                      if ( _glob_verbose && _glob_terminal_echo_flag )
                      circles_lib_output( _out_channel, DISPATCH_INFO, "'Label' param has been skipped because this circle is not going to be recorded", _par_1, _cmd_tag );
                   }
                   else if ( _cmd_params['plane'] == NO_PLANE ) { _b_fail = YES ; _error_str = "Fail to plot the circle: missing plane reference" ;  }
                   else if ( !is_point( _cmd_params['center'] ) && !_cmd_params['compute'] ) { _b_fail = YES ; _error_str = "Fail to plot the circle: missing center coords" ; }
                   else if ( _cmd_params['radius'] == null && !_cmd_params['compute'] ) { _b_fail = YES ; _error_str = "Fail to plot the circle: missing radius" ; }
          
                   // beware of some missing color param, so let's check'em deeper
                   if ( _cmd_params['bordercolor'] == null && _cmd_params['fillcolor'] == null )
                   {
                       _b_fail = YES ; _error_str = "Missing draw and filling colors: this circle won't be visible" ;
                   }
                   else
                   {
                       var _bordercolor = _cmd_params['bordercolor'] ;
                       var _border = _bordercolor != null ? ( ( _bordercolor.length > 0 && !_bordercolor.is_one_of_i( "noclr", "transparent" ) ) ? YES : NO ) : NO ;
                       var _fillcolor = _cmd_params['fillcolor'] ;
                       var _fill = _fillcolor != null ? ( ( _fillcolor.length > 0 && !_fillcolor.is_one_of_i( "noclr", "transparent" ) ) ? YES : NO ) : NO ;
                       if ( _border == NO && _fill == NO ) { _b_fail = YES ; _error_str = "Missing draw and filling colors: this circle won't be visible" ; }

					   if ( _cmd_params['word'].length > 0 )
					   {
						   var _word = _cmd_params['word'], _mm ;
						   circles_lib_output( _out_channel, DISPATCH_INFO, "Computing the isometric circle for word '"+_word+"' ", _par_1, _cmd_tag );
						   circles_lib_output( _out_channel, DISPATCH_INFO, "Checking '"+_word+"' for coherence with current alphabet ", _par_1, _cmd_tag );
						   for( var _runner = 0 ; _runner < _word.length ; _runner++ )
						   {
								if ( !_glob_alphabet.includes( _word[_runner] ) )
								{
									_b_fail = YES, _error_str = "Symbol '"+_word[_runner]+"' is not included in the current alphabet: " + _glob_alphabet.join( ", " );
								}
						   }

						   if ( !_b_fail )
						   {
							   circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Coherence test passed with success", _par_1, _cmd_tag );
							   var _resolved_word = circles_lib_repetends_resolve( _word );
							   if ( !_word.strcmp( _resolved_word ) )
							   circles_lib_output( _out_channel, DISPATCH_INFO, "Input word"+_glob_crlf+_word+_glob_crlf+"has been resolved to"+_glob_crlf+_resolved_word, _par_1, _cmd_tag );

							   circles_lib_output( _out_channel, DISPATCH_INFO, "Mobius map composition from word '" + _word + "'", _par_1, _cmd_tag );
							   _mm = circles_lib_word_mobiusmap_get( _word, _glob_seeds_array, _out_channel );
							   var _cc = _cmd_params['inversion'] ? _mm.inversion_circle() : _mm.isometric_circle();
							   _cmd_params['center'] = _cc.get_center();
							   _cmd_params['radius'] = _cc.get_radius();
							   circles_lib_output( _out_channel, DISPATCH_INFO, "Resulting circle " + _glob_crlf + _cc.output( "" ), _par_1, _cmd_tag );
						   }
					   }
				   }
            }

              // elaborating the params
              if ( !_b_fail && _cmd_params['help'] == NO )
              {
                   var _canvas_context, _mapper ;
                   var _bordercolor = _cmd_params['bordercolor'] ;
                   var _border = _bordercolor != null ? ( ( _bordercolor.length > 0 && !_bordercolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
                   var _fillcolor = _cmd_params['fillcolor'] ;
                   var _fill = _fillcolor != null ? ( ( _fillcolor.length > 0 && !_fillcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
          
                   var _bordersize = _cmd_params['bordersize'] == null ? 1 : safe_int( _cmd_params['bordersize'], 1 );
                   if ( _bordersize == 0 ) { _border = NO ; _bordercolor = "" ; }
                   var _opacity = ( _cmd_params['opacity'] == null ) ? 1.0 : safe_float( _cmd_params['opacity'], DEFAULT_MAX_OPACITY );
                   var _circle_obj = new circle( _cmd_params['center'], _cmd_params['radius'], _border, _fill, _bordercolor, _fillcolor, _bordersize );
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
							_canvas_context = _glob_bipbox_canvas.getContext( _glob_canvas_ctx_2D_mode );
							_mapper = bipbox_sm ;
							break ;
							default: break ;
					   }
				   }
				   else { _b_fail = YES ; _error_str = "Invalid input layer '"+_cmd_params['layer']+"'" ; }

                   if ( !_b_fail && is_circle( _circle_obj ) )
                   {
                       var _screen_circle = circles_lib_draw_complex_disk( _canvas_context, _mapper,
								_circle_obj.center.x, _circle_obj.center.y, _circle_obj.radius,
                                _border, _bordercolor, _fill, _fillcolor, _bordersize, _opacity,
                                _cmd_params['sector_start'], _cmd_params['sector_end'],
								"", _cmd_params['propertiesmask'] );
                       if ( !is_circle( _screen_circle ) ) { _b_fail = YES ; _error_str = "Fail to draw the circle: invalid object declation" ; }
                       else
                       {
                           circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<snow>(" + circles_lib_plane_def_get( _cmd_params['plane'] ) + ")</snow> <green>Circle drawn with success</green>", _par_1, _cmd_tag );
                           if ( _cmd_params['rec'] == YES )
                           {
                               var _rec_chunk = [];
                                   _rec_chunk['class'] = FIGURE_CLASS_CIRCLE ;
                                   _rec_chunk['obj'] = _circle_obj ;
                                   _rec_chunk['plane'] = _cmd_params['plane'] ;
                                   _rec_chunk['layer'] = _cmd_params['layer'] ;
                                   _rec_chunk['border'] = _border ;
                                   _rec_chunk['bordercolor'] = _bordercolor ;
                                   _rec_chunk['fill'] = _fill ;
                                   _rec_chunk['fillcolor'] = _fillcolor ;
                                   _rec_chunk['opacity'] = _opacity ;
                                   _rec_chunk['bordersize'] = _bordersize ;
                                   _rec_chunk['enabled'] = YES ;
                                   _rec_chunk['label'] = _cmd_params['label'].length > 0 ? _cmd_params['label'] : new String( "" );
                                   _rec_chunk['myhash'] = "rec" + _glob_figures_array.length ;
                                   _rec_chunk['propertiesmask'] = _cmd_params['propertiesmask'] ;
                                   _glob_figures_array.push( _rec_chunk );
          
                                       var _subset = _cmd_params['storagesubset'] ;
                                       if ( is_array( _glob_storage[_subset] ) )
                                       {
                                           _glob_storage[_subset].push( _rec_chunk );
                                           var _msg = "<green>Circle "+( _rec_chunk['label'].length > 0 ? "'"+_rec_chunk['label']+"'" : "" )+" has been copied into data storage space</green>" ;
                                           circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                                       }
                                       else circles_lib_output( _out_channel, DISPATCH_WARNING, "'"+_subset+"' does not refer to any valid storage space subset", _par_1, _cmd_tag );

							    circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Circle recorded with success", _par_1, _cmd_tag );
                            }
                       }
                   }
                   else { _b_fail = YES ; _error_str = "Fail to draw circle: memory failure. Free some resources" ; }
              }
              break ;
         }
    }

    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}