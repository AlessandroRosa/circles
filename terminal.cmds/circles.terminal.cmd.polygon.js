function circles_terminal_cmd_polygon()
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
    var _params_assoc_array = [];
    var _fn_ret_val = null ;

	if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
        _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [ "zplane", "wplane", "bip", "rec", "release", "html", "help" ];
        //circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
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
        _params_assoc_array['help'] = NO ;
        _params_assoc_array['keywords'] = NO ;
        _params_assoc_array['rec'] = NO ;
        _params_assoc_array['label'] = "" ;
        _params_assoc_array['plane'] = Z_PLANE ;
        _params_assoc_array['layer'] = "work" ;
		_params_assoc_array['vertexes'] = [] ;
        _params_assoc_array['storagesubset'] = "polygons" ;
        var _p,  _b_cmd_open = NO ;
        // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
        var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
        var _index_associations = [], _i, _l ;
        for( _i = 0 ; _i < _up_to_index ; _i++ )
        {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.start_with( "storagesubset:" ) ) _params_assoc_array['storagesubset'] = _p.replaceAll( "storagesubset:", "" ) ;
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

                if ( !_b_fail ) _params_assoc_array['label'] = _p ;
            }
            else if ( _p.stricmp( "rec" ) ) _params_assoc_array['rec'] = YES ;
            else if ( _p.is_one_of_i( "zplane", "z-plane", "wplane", "w-plane", "bip", "bipbox" ) )
            {
                if ( _p.is_one_of_i( "zplane", "z-plane" ) ) _params_assoc_array['plane'] = Z_PLANE ;
                else if ( _p.is_one_of_i( "wplane", "w-plane" ) ) _params_assoc_array['plane'] = W_PLANE ;
                else if ( _p.is_one_of_i( "bip", "bipbox" ) ) _params_assoc_array['plane'] = BIP_BOX ;
            }
            else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
            {
                var _pt = _p.replaceAll( [ "(", ")" ], "" ).split( "," );
                _pt = new point( safe_float( _pt[0], 0 ), safe_float( _pt[1], 0 ) );
                _params_assoc_array['vertexes'].push( _pt );
            }
			else if ( _p.toLowerCase().start_with( "layer:" ) && _params_assoc_array['layer'] == null )
			{
				_params_assoc_array['layer'] = safe_string( _p.replace( /layer:/gi, "" ), "" ) ;
				_msg = "<lightblue>Layer has been set to</lightblue> <snow>"+_params_assoc_array['layer']+"</snow>" ;
				circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
			}
			else if ( _p.toLowerCase().start_with( "bordercolor:" ) && _params_assoc_array['bordercolor'] == null )
			{
				_params_assoc_array['bordercolor'] = safe_string( _p.replace( /bordercolor:/gi, "" ), "" ) ;
				if ( circles_lib_colors_is_def( _params_assoc_array['bordercolor'] ) )
				{
					_msg = "<lightblue>Draw color has been set to</lightblue> <snow>"+_params_assoc_array['bordercolor']+"</snow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid draw color definition" ; }
			}
			else if ( _p.toLowerCase().start_with( "fillcolor:" ) && _params_assoc_array['fillcolor'] == null )
			{
				_params_assoc_array['fillcolor'] = safe_string( _p.replace( /fillcolor:/gi, "" ), "" ) ;
				if ( circles_lib_colors_is_def( _params_assoc_array['fillcolor'] ) )
				{
					_msg = "<lightblue>Fill color has been set to</lightblue> <snow>"+_params_assoc_array['fillcolor']+"</snow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid fill color definition" ; break ; }
			}
			else if ( _p.toLowerCase().start_with( "opacity:" ) && _params_assoc_array['opacity'] == null )
			{
				_params_assoc_array['opacity'] = safe_string( _p.replace( /opacity:/gi, "" ), "" ) ;
				if ( _params_assoc_array['opacity'].testME( _glob_positive_float_regex_pattern ) )
				{
					_msg = "<lightblue>Opacity has been set to</lightblue> <snow>"+_params_assoc_array['opacity']+"</snow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid opacity definition" ; break ; }
			}
			else if ( _p.toLowerCase().start_with( "bordersize:" ) && _params_assoc_array['bordersize'] == null )
			{
				_params_assoc_array['bordersize'] = safe_string( _p.replace( /bordersize:/gi, "" ), "" ) ;
				if ( _params_assoc_array['bordersize'].testME( _glob_positive_float_regex_pattern ) )
				{
					_msg = "<lightblue>Border size has been set to</lightblue> <snow>"+_params_assoc_array['bordersize']+"</snow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid border size definition" ; break ; }
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
        else if ( !_b_fail )
        {
            var _action = _params_assoc_array['action'] ;
            switch( _action )
            {
                case "release":
                circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                default:
                if ( _params_assoc_array['label'].length > 0 && _params_assoc_array['rec'] == NO )
                {
                    circles_lib_output( _output_channel, DISPATCH_INFO, "Skipped label param. Mismatch setting: no rec param input", _par_1, _cmd_tag );
                    if ( _glob_verbose && _glob_terminal_echo_flag ) circles_lib_output( _output_channel, DISPATCH_INFO, "Label param is useless if this figure is not going to be recorded", _par_1, _cmd_tag );
                }
                else if ( _params_assoc_array['plane'] == NO_PLANE ) { _b_fail = YES, _error_str = "Can't plot polygon: missing plane reference" ; }
                else if ( _params_assoc_array['vertexes'].length == 0 ) { _b_fail = YES, _error_str = "Can't plot polygon: missing coordinates" ; }
                else if ( _params_assoc_array['vertexes'].length < 3 ) { _b_fail = YES, _error_str = "Can't plot polygon: points must be at least 2" ; }
          
                // beware of some missing color param, so let's check'em deeper
                if ( _params_assoc_array['bordercolor'] == null ) { _b_fail = YES, _error_str = "Missing 'bordercolor' attribute: this polygon won't be visible" ; }
                else
                {
                    var _bordercolor = _params_assoc_array['bordercolor'] ;
                    var _border = _bordercolor != null ? ( ( _bordercolor.length > 0 && !_bordercolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
                    if ( _border == NO ) { _b_fail = YES, _error_str = "Missing draw color: this polygon won't be visible" ; }
                }

                var _canvas_context, _mapper ;
                var _bordercolor = _params_assoc_array['bordercolor'] ;
                var _border = _bordercolor != null ? ( ( _bordercolor.length > 0 && !_bordercolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
                var _fillcolor = _params_assoc_array['fillcolor'] ;
                var _fill = _fillcolor != null ? ( ( _fillcolor.length > 0 && !_fillcolor.stricmp( "noclr" ) ) ? YES : NO ) : NO ;
                var _bordersize = _params_assoc_array['bordersize'] == null ? 1 : safe_int( _params_assoc_array['bordersize'], 1 );
                if ( _bordersize == 0 ) { _border = NO ; _bordercolor = "" ; }
                var _opacity = _params_assoc_array['opacity'] == null ? 1.0 : _params_assoc_array['opacity'] ;
				var _layer = circles_lib_canvas_layer_find( _params_assoc_array['plane'], FIND_LAYER_BY_ROLE_DEF, _params_assoc_array['layer'], _output_channel );
				if ( is_html_canvas( _layer ) )
				{
					switch( _params_assoc_array['plane'] )
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
				else { _b_fail = YES ; _error_str = "Invalid input layer '"+_params_assoc_array['layer']+"'" ; }
				  
				  if ( !_b_fail )
				  {
					  circles_lib_draw_polyline( _canvas_context, _mapper, _params_assoc_array['vertexes'], _bordercolor, _fillcolor, _bordersize, YES, _opacity, UNDET, _params_assoc_array['propertiesmask'], YES );
					  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>(" + circles_lib_plane_def_get( _params_assoc_array['plane'] ) + ")</snow> <green>Polygon processed with success</green>", _par_1, _cmd_tag );

					  if ( _params_assoc_array['rec'] == YES )
					  {
						var _rec_chunk = [];
						_rec_chunk['class'] = FIGURE_CLASS_POLYGON ;
						_rec_chunk['close'] = YES ;
						_rec_chunk['border'] = _border ;
						_rec_chunk['bordercolor'] = _bordercolor ;
						_rec_chunk['enabled'] = YES ;
						_rec_chunk['fill'] = _fill ;
						_rec_chunk['fillcolor'] = _fillcolor ;
						_rec_chunk['label'] = _params_assoc_array['label'] ;
						_rec_chunk['bordersize'] = _bordersize ;
						_rec_chunk['myhash'] = "rec" + _glob_figures_array.length ;
						_rec_chunk['obj'] = _params_assoc_array['vertexes'].clone();
						_rec_chunk['opacity'] = _opacity ;
						_rec_chunk['plane'] = _params_assoc_array['plane'] ;
                        _rec_chunk['layer'] = _params_assoc_array['layer'] ;
						_glob_figures_array.push( _rec_chunk );

						 var _subset = _params_assoc_array['storagesubset'] ;
						 if ( !is_array( _glob_storage[_subset] ) )
						 {
							_glob_storage[_subset] = [] ;
							var _msg = "Storage space <white>'"+_subset+"'</white> has been created with success" ;
							circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
						 }

						 if ( is_array( _glob_storage[_subset] ) )
						 {
							_glob_storage[_subset].push( _rec_chunk );
							var _default_space = _subset == "polygons" ? 1 : 0 ;
							var _msg = "<green>Polygon "+( _rec_chunk['label'].length > 0 ? "'"+_rec_chunk['label']+"' " : "" )+"has been recorded into "+(_default_space?"default ":"")+"'"+_subset+"' storage space</green>" ;
							circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
						 }
						 else circles_lib_output( _output_channel, DISPATCH_WARNING, "Storage space '"+_subset+"' does not exist", _par_1, _cmd_tag );
					  }
				  }
                  else { _b_fail = YES ; _error_str = "Can't draw circle: memory failure. Free some resources" ; }
                  break ;
            }
        }
    }
    else { _b_fail = YES, _error_str = "Missing input params" ; }
	 
    if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}