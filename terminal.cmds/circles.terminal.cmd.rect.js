function circles_terminal_cmd_rect()
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
        _params_assoc_array['coords'] = [] ;
        _params_assoc_array['copy'] = NO ;
        _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
        _params_assoc_array['help'] = NO ;
        _params_assoc_array['keywords'] = NO ;
        _params_assoc_array['label'] = "" ;
		_params_assoc_array['layerdef'] = "work" ;
        _params_assoc_array['plane'] = Z_PLANE ;
        _params_assoc_array['syntax'] = [] ;
        _params_assoc_array['syntax']['inequality'] = [] ;
        _params_assoc_array['rec'] = NO ;
        _params_assoc_array['storagesubset'] = "" ;
        _params_assoc_array['xsyntax'] = [] ;
        _params_assoc_array['ysyntax'] = [] ;

		var _labels = [ "x1", "y1", "x2", "y2" ], _coords_got_em = [] ;
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [ "release", "clean", "zplane", "wplane", "html", "rec" ];
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
        var _p, _layer ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i].toLowerCase().trim();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
			else if ( _p.start_with_i( "$" ) )
            {
                for( _l = 0 ; _l < _glob_figures_array.length ; _l++ )
                {
                    if ( _p.stricmp( _glob_figures_array[_l]['label'] ) )
                    {
                        _b_fail = YES, _error_str = "There exists already another figure saved and labelled as '"+_p+"'" ;
                        break ;
                    }
                }
                if ( !_b_fail ) _params_assoc_array['label'] = _p ;
            }
            else if ( _p.start_with( "storagesubset:" ) ) _params_assoc_array['storagesubset'] = _p.replaceAll( "storagesubset:", "" ) ;
            else if ( _p.is_one_of_i( "x", "y" ) )
            {
                if ( _p.stricmp( "x" ) )
                {
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected inequality X-syntax</lightblue>", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<gray>start of input X-syntax</gray>", _par_1, _cmd_tag );
                    _params_assoc_array['xsyntax']['status'] = OPEN ;
                    _params_assoc_array['xsyntax']['coord'] = YES ;
                }
                else if ( _p.stricmp( "y" ) )
                {
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected inequality Y-syntax</lightblue>", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<gray>start of input Y-syntax</gray>", _par_1, _cmd_tag );
                    _params_assoc_array['ysyntax']['status'] = OPEN ;
                    _params_assoc_array['ysyntax']['coord'] = YES ;
                }
            }
            else if ( _params_assoc_array['xsyntax']['status'] == OPEN )
            {
                if ( _p.is_one_of( "<", ">", "<=", ">=" ) )
                {
                    _params_assoc_array['xsyntax']['operator'] = _p ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected operator</lightblue> <snow>"+_p+"</snow> <lightblue>for input X-syntax</lightblue>", _par_1, _cmd_tag );
                }
                else if ( _p.testME( _glob_float_regex_pattern ) )
                {
                    _params_assoc_array['xsyntax']['operand'] = safe_float( _p, 0 ) ;
                    _params_assoc_array['xsyntax']['status'] = CLOSE ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected operand</lightblue> <snow>"+_p+"</snow> <lightblue>for input X-syntax</lightblue>", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<gray>end of input X-syntax</gray>", _par_1, _cmd_tag );
					if ( _params_assoc_array['syntax']['inequality']['x'] == null ) _params_assoc_array['syntax']['inequality']['x'] = [] ;
					_params_assoc_array['syntax']['inequality']['x'].push( [ "x", _params_assoc_array['xsyntax']['operator'], _params_assoc_array['xsyntax']['operand'] ] )
                }
				else { _b_fail = YES ; _error_str = "Invalid string '"+_p+"' during input X-syntax" ; }
            }
            else if ( _params_assoc_array['ysyntax']['status'] == OPEN )
            {
                if ( _p.is_one_of( "<", ">", "<=", ">=" ) )
                {
                    _params_assoc_array['ysyntax']['operator'] = _p ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected operator</lightblue> <snow>"+_p+"</snow> <lightblue>for input Y-syntax</lightblue>", _par_1, _cmd_tag );
                }
                else if ( _p.testME( _glob_float_regex_pattern ) )
                {
                    _params_assoc_array['ysyntax']['operand'] = safe_float( _p, 0 ) ;
                    _params_assoc_array['ysyntax']['status'] = CLOSE ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Detected operand</lightblue> <snow>"+_p+"</snow> <lightblue>for input Y-syntax</lightblue>", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<gray>end of input Y-syntax</gray>", _par_1, _cmd_tag );
					if ( _params_assoc_array['syntax']['inequality']['y'] == null ) _params_assoc_array['syntax']['inequality']['y'] = [] ;
					_params_assoc_array['syntax']['inequality']['y'].push( [ "y", _params_assoc_array['ysyntax']['operator'], _params_assoc_array['ysyntax']['operand'] ] )
                }
				else { _b_fail = YES ; _error_str = "Invalid string '"+_p+"' during input X-syntax" ; }
            }
            else if ( _p.is_one_of_i( "zplane", "wplane", "z-plane", "w-plane", "bip", "bipbox" ) )
            {
           		switch( _p.toLowerCase() )
              	{
					case "zplane":
					case "z-plane":
						_params_assoc_array['plane'] = _p ;
                        _params_assoc_array['planeval'] = Z_PLANE ;
						_msg = "<lightblue>Selected work layer on the</lightblue> <snow>Z-plane</snow>" ;
						circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					break ;
					case "wplane":
					case "w-plane":
						_params_assoc_array['plane'] = _p ;
                        _params_assoc_array['planeval'] = W_PLANE ;
						_msg = "<lightblue>Selected work layer on the </lightblue> <snow>W-plane</snow>" ;
						circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					break ;
					case "bip":
					case "bipbox":
						_params_assoc_array['plane'] = _p ;
                        _params_assoc_array['planeval'] = BIP_BOX ;
						_msg = "<lightblue>Selected work layer on the </lightblue> <snow>Bip box</snow>" ;
						circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					break ;
					default: break ;
				}
			}
            else if ( _p.toLowerCase().start_with( "layer:" ) && _params_assoc_array['layer'] == null )
            {
				if ( _params_assoc_array['plane'] == null ) { _b_fail = 1 ; _error_str = "Layer argument shall be preceeded by plane definition" ; }
				else
				{
					_params_assoc_array['layerdef'] = safe_string( _p.replace( /layer:/gi, "" ), "" ) ; ;
					var _layer = _params_assoc_array['layer'] = circles_lib_canvas_layer_find( _params_assoc_array['plane'], FIND_LAYER_BY_ROLE_DEF, _params_assoc_array['layerdef'] ) ;
					if ( is_html_canvas( _layer ) ) circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lime>Selected</lime> <snow>"+_params_assoc_array['layerdef']+" layer</snow> <lime>for rect rendering</lime>", _par_1, _cmd_tag );
					else { _b_fail = 1 ; _error_str = "Invalid layer '"+_p+"' definition: check the correct spelling or the belonging to the proper plane" ; }
				}
            }
			else if ( _p.toLowerCase().start_with( "width:" ) && _params_assoc_array['width'] == null )
			{
				_params_assoc_array['width'] = safe_string( _p.replace( /width:/gi, "" ), "" ) ;
				if ( _params_assoc_array['width'].testME( _glob_positive_float_regex_pattern ) )
				{
					_params_assoc_array['width'] = safe_float( _params_assoc_array['width'], 0 ) ;
					_msg = "<lightblue>Width has been set to</lightblue> <snow>"+_params_assoc_array['width']+"</snow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid width definition" ; break ; }
			}
			else if ( _p.toLowerCase().start_with( "height:" ) && _params_assoc_array['height'] == null )
			{
				_params_assoc_array['height'] = safe_string( _p.replace( /height:/gi, "" ), "" ) ;
				if ( _params_assoc_array['height'].testME( _glob_positive_float_regex_pattern ) )
				{
					_params_assoc_array['height'] = safe_float( _params_assoc_array['height'], 0 ) ;
					_msg = "<lightblue>Height has been set to</lightblue> <snow>"+_params_assoc_array['height']+"</snow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid height definition" ; break ; }
			}
			else if ( _p.toLowerCase().start_with( "borderradius:" ) && _params_assoc_array['borderradius'] == null )
			{
				_params_assoc_array['borderradius'] = safe_string( _p.replace( /borderradius:/gi, "" ), "" ) ;
				if ( _params_assoc_array['borderradius'].testME( _glob_positive_float_regex_pattern ) )
				{
					_msg = "<lightblue>Border radius has been set to</lightblue> <snow>"+_params_assoc_array['borderradius']+"</snow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid border radius definition" ; break ; }
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
            else if ( _p.start_with( "opacity:" ) && _params_assoc_array['opacity'] == null )
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
				_params_assoc_array['opacity'] = _opacity ;
			}
            else if ( _p.start_with( "bordersize:" ) && _params_assoc_array['bordersize'] == null )
            {
				var _bordersize = safe_int( _p.replace( /bordersize:/gi, "" ), 0 );
                if ( _bordersize < 0 )
                {
                    _msg = "<orange>Detected invalid border size input</lime> <snow>"+_bordersize+"</snow> <orange>and reset to default</orange> <snow>0</snow>" ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                    _bordersize = 0 ;
                }
                _params_assoc_array['bordersize'] = _bordersize ;
            }
			else if ( _p.includes( "," ) && _p.count( "," ) == 3 && _p.split( "," ).length == 4 )
			{
				_msg = "<gray>Detected 4 comma-separated coordinates syntax</gray>" + _glob_crlf + "<gray>Attempting to parse and resolve</gray>" ;
				circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				var _params = _p.split( "," ), _coord, _def, _pi = 0 ;
				_params.forEach( function( _c ) { _coord = parseFloat( _c ) ;
					if ( isNaN( _coord ) )
					{
						circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
						_b_fail = YES, _error_str = "Invalid input coord operand '"+_c+"' at param #"+(++_pi) ;
					}
					else
					{
                        switch( _pi )
                        {
                            case 0: _def = "left coord" ; break ;
                            case 1: _def = "top coord" ; break ;
                            case 2: _def = "right coord" ; break ;
                            case 3: _def = "bottom coord" ; break ;
         			        default: _def = "unknown coord" ; break ;
                        }
		 				_params_assoc_array['coords'].push( _coord );
						_msg = "<lime>Detected rect coord</lime> <snow>"+_coord+"</snow> <lime>and saved with success as</lime> <snow>"+_def+"</snow>" ;
						_coords_got_em.push( _pi++ );
						circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					} } );
			}
            else if ( _p.is_one_of_i( "clean", "html", "rec" ) ) _params_assoc_array[_p] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
			else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
			{
				if ( _params_assoc_array['left_top'] == null )
				{
					_p = safe_string( _p.replace( /startpt:/gi, "" ), "" ) ;
					if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
					{
						_p = _p.replaceAll( [ "(", ")" ], "" );
						var _pt_array = _p.split( "," );
						_params_assoc_array['left_top'] = new point( safe_float( _pt_array[0] ), safe_float( _pt_array[1] ) );
						_msg = "<lightblue>Start point has been set to</lightblue> <snow>"+_params_assoc_array['left_top'].output()+"</snow>" ;
						circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					}
					else { _b_fail = YES, _error_str = "Invalid start point definition" ; break ; }
				}
				else if ( _params_assoc_array['right_bottom'] == null )
				{
					_p = safe_string( _p.replace( /endpt:/gi, "" ), "" ) ;
					if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
					{
						_p = _p.replaceAll( [ "(", ")" ], "" );
						var _pt_array = _p.split( "," );
						_params_assoc_array['right_bottom'] = new point( safe_float( _pt_array[0] ), safe_float( _pt_array[1] ) );
						_msg = "<lightblue>End point has been set to</lightblue> <snow>"+_params_assoc_array['right_bottom'].output()+"</snow>" ;
						circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					}
					else { _b_fail = YES, _error_str = "Invalid end point definition" ; break ; }
				}
			}
            else if ( _p.testME( _glob_float_regex_pattern ) )
            {
                var _n_coords = safe_size( _params_assoc_array['coords'], 0 ) ;
                if ( _n_coords <= 4 )
                {
                    _params_assoc_array['coords'].push( safe_float( _p, 0 ) );
                    _msg = "<lime>Detected rect coord</lime> <snow>"+_p+"</snow> <lime>and saved with success</lime>" ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                    _coords_got_em.push( _coords_got_em.length );
                }
                else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<orange>Skipped redundant input data detected at</orange> <snow>"+_p+"</snow>", _par_1, _cmd_tag );
            }
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
        }

        var _input_rect_flag = safe_size( _coords_got_em, 0 ) == 4 ? YES : NO ;
        var _x_syntax_flag = _params_assoc_array['xsyntax'].associative_key_exists('status') ? ( _params_assoc_array['xsyntax']['status'] == CLOSE ? YES : NO ) : NO ;
        var _y_syntax_flag = _params_assoc_array['ysyntax'].associative_key_exists('status') ? ( _params_assoc_array['ysyntax']['status'] == CLOSE ? YES : NO ) : NO ;
                if ( _x_syntax_flag )
                {
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Found input X-syntax", _par_1, _cmd_tag );
                    var _ret_chunk = circles_terminal_cmd_rect_check_syntax( _params_assoc_array['xsyntax'] ) ;
                    var _ret_id = _ret_chunk[0], _ret_mask = _ret_chunk[1] ;
                    if ( !_ret_id )
                    {
                        _b_fail = YES, _error_str = "Found invalid input X-syntax: process aborted" ;
                        if ( _ret_mask & 1 ) _error_str += _glob_crlf + "Found incomplete syntax" ;
                        if ( _ret_mask & 2 ) _error_str += _glob_crlf + "Missing coord identifier" ;
                        if ( _ret_mask & 4 ) _error_str += _glob_crlf + "Missing operator symbol" ;
                        if ( _ret_mask & 8 ) _error_str += _glob_crlf + "Missing operand identifier" ;
						_x_syntax_flag = NO ;
                    }
                    else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lime>Coord X-syntax has been validated with success</lime>", _par_1, _cmd_tag );
                }

                if ( _y_syntax_flag )
                {
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Found input Y-syntax", _par_1, _cmd_tag );
                    var _ret_chunk = circles_terminal_cmd_rect_check_syntax( _params_assoc_array['ysyntax'] ) ;
                    var _ret_id = _ret_chunk[0], _ret_mask = _ret_chunk[1] ;
                    if ( !_ret_id )
                    {
                        _b_fail = YES, _error_str = "Found invalid input Y-syntax: process aborted" ;
                        if ( _ret_mask & 1 ) _error_str += _glob_crlf + "Found incomplete syntax" ;
                        if ( _ret_mask & 2 ) _error_str += _glob_crlf + "Missing coord identifier" ;
                        if ( _ret_mask & 4 ) _error_str += _glob_crlf + "Missing operator symbol" ;
                        if ( _ret_mask & 8 ) _error_str += _glob_crlf + "Missing operand identifier" ;
						_y_syntax_flag = NO ;
                    }
                    else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lime>Coord Y-syntax has been validated with success</lime>", _par_1, _cmd_tag );
                }

        var _action = _params_assoc_array['action'] ;
        if ( safe_string( _action, "" ).trim().length == 0 ) _action = "draw" ;
        if ( _params_assoc_array['layer'] == null )
        _params_assoc_array['layer'] = circles_lib_canvas_layer_find( _params_assoc_array['planeval'], FIND_LAYER_BY_ROLE_DEF, "work" ) ;
         
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
        else if ( _action.strcmp( "draw" ) && _params_assoc_array['plane'] == null ) { _b_fail = YES, _error_str = "Missing input plane" ; }
        else if ( !_b_fail )
		{
            var _storage_queue_request = _params_assoc_array['params'] != null ? ( _params_assoc_array['params'].includes_i( "storagein" ) ? YES : NO ) : NO ;
		    switch( _action )
		    {
                case "draw":
				var _rect_obj = null ;
				var _check_coords_mask = is_point( _params_assoc_array['left_top'] ) ? 1 : 0 ;
					_check_coords_mask |= is_point( _params_assoc_array['right_bottom'] ) ? 2 : 0 ;
					_check_coords_mask |= _params_assoc_array['width'] != null ? 4 : 0 ;
					_check_coords_mask |= _params_assoc_array['height'] != null ? 8 : 0 ;

				circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>End of input stage</snow>", _par_1, _cmd_tag );
                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "", _par_1, _cmd_tag );
                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>Begin to process rectangle data</snow>", _par_1, _cmd_tag );
				// COORDINATES MANAGEMENT
				if ( _check_coords_mask == (1|4|8) ) // left top pt + width + height
				{
					// compute the end point from the start point
					_params_assoc_array['right_bottom'] = _params_assoc_array['left_top'].shift( _params_assoc_array['width'], _params_assoc_array['height'], NO );
					_rect_obj = new rect( _params_assoc_array['left_top'], _params_assoc_array['right_bottom'], _RECT_ORIENTATION_CARTESIAN );
					_rect_obj.correct();
					circles_lib_output( _output_channel, DISPATCH_INFO, "Rectangle end point missing and recalculated, from width and height, to "+_params_assoc_array['right_bottom'].output(), _par_1, _cmd_tag );
					_check_coords_mask |= 2 ;
				}
				else if ( _check_coords_mask == (1|2) ) // left top pt and right bottom pt
				{
					_rect_obj = new rect( _params_assoc_array['left_top'], _params_assoc_array['right_bottom'], _RECT_ORIENTATION_CARTESIAN );
					_rect_obj.correct();
					_check_coords_mask |= 16 ;
				}
				else if ( _x_syntax_flag || _y_syntax_flag ) // syntax x,y inequality coordinate
                {
                    var MAX = CIRCLES_MAX_COORD, _operand, _operator, _rect_coords = [ -MAX, MAX, MAX, -MAX ] ;
					var _x_array = _params_assoc_array['syntax']['inequality']['x'], _y_array = _params_assoc_array['syntax']['inequality']['y'] ;
					if ( is_consistent_array( _x_array ) == YES )
					{
						_x_array.forEach( function( _chunk )
						{
							_operator = _chunk[1], _operand = _chunk[2] ;
							if ( _operator.is_one_of( "<", "<=" ) ) _rect_coords[2] = _operand ;
							else if ( _operator.is_one_of( ">", ">=" ) ) _rect_coords[0] = _operand ;
						} ) ;
					}

					if ( is_consistent_array( _y_array ) == YES )
					{
						_y_array.forEach( function( _chunk )
						{
							_operator = _chunk[1], _operand = _chunk[2] ;
							if ( _operator.is_one_of( "<", "<=" ) ) _rect_coords[1] = _operand ;
							else if ( _operator.is_one_of( ">", ">=" ) ) _rect_coords[3] = _operand ;
						} ) ;
					}
                    _rect_obj = ( new rect( _rect_coords, _RECT_ORIENTATION_CARTESIAN ) );
					_rect_obj.correct();
					_check_coords_mask |= 32 ;
				}
                else if ( safe_size( _coords_got_em, 0 ) > 0 ) // 4 floating numbers regrouped into left-top and right-bottom points
                {
					_params_assoc_array['left_top_flag'] = _coords_got_em.includes(0) && _coords_got_em.includes( 1 ) ? YES : NO ;
               		_params_assoc_array['right_bottom_flag'] = _coords_got_em.includes( 2 ) && _coords_got_em.includes( 3 ) ? YES : NO ;
					if ( _params_assoc_array['left_top_flag'] )
    				{
    					_params_assoc_array['left_top'] = new point( _params_assoc_array['coords'][0], _params_assoc_array['coords'][1] );
						_msg = "<lightblue>Rectangle left top corner</lightblue> <lime>has been filled with success</lime> <lightblue>"+_params_assoc_array['left_top'].output("cartesian")+"</lightblue>" ;
    					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
     				}

     				if ( _params_assoc_array['right_bottom_flag'] )
     				{
     					_params_assoc_array['right_bottom'] = new point( _params_assoc_array['coords'][2], _params_assoc_array['coords'][3] );
     					_msg = "<lightblue>Rectangle right bottom corner</lightblue> <lime>has been filled with success and set at</lime> <lightblue>"+_params_assoc_array['right_bottom'].output("cartesian")+"</lightblue>" ;
     					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
     				}
					
					_rect_obj = new rect( _params_assoc_array['left_top'], _params_assoc_array['right_bottom'], _RECT_ORIENTATION_CARTESIAN );
					_rect_obj.correct();
					_check_coords_mask |= 64 ;
                }

                var _area = is_rect( _rect_obj ) ? _rect_obj.area() : 0 ;
				if ( _params_assoc_array['plane'] == NO_PLANE ) { _b_fail = YES, _error_str = "Can't plot rect: missing plane reference" ; }
				else if ( _check_coords_mask == 0 ) { _b_fail = YES, _error_str = "Can't plot rect: missing coordinates" ; }
                else if ( _area == 0 ) { _b_fail = YES, _error_str = "Input rect is of zero area: process aborted" ; }

      		    var _plane_type = circles_lib_plane_get_value( _params_assoc_array['plane'] ) ;
                var _canvas, _mapper = null, _context = null, _plane_rect = null ;
                if ( _plane_type == Z_PLANE )
                {
					_plane_rect = zplane_sm.get_coords_rect();
					var _layer_def = _params_assoc_array['layerdef'] ;
					var _layer = _params_assoc_array['layer'] = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_DEF, _layer_def ) ;
					if ( is_html_canvas( _layer ) ) circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lime>Selected</lime> <snow>"+_layer_def+" layer</snow> <lime>for rect rendering</lime>", _par_1, _cmd_tag );
					else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid layer '"+_layer_def+"' definition: check the correct spelling or the belonging to the proper plane\nRectangle will be draw on the 'work' layer of the Z-plane", _par_1, _cmd_tag );

					_mapper = zplane_sm, _canvas = is_html_canvas( _layer ) ? _layer : _glob_zplane_work_layer_placeholder ;
					_context = _canvas.getContext( _glob_canvas_ctx_2D_mode ) ;
				}
                else if ( _plane_type == W_PLANE )
                {
					_plane_rect = wplane_sm.get_coords_rect();
					var _layer_def = _params_assoc_array['layerdef'] ;
					var _layer = _params_assoc_array['layer'] = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_DEF, _layer_def ) ;
					if ( is_html_canvas( _layer ) ) circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lime>Selected</lime> <snow>"+_layer_def+" layer</snow> <lime>for rect rendering</lime>", _par_1, _cmd_tag );
					else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid layer '"+_layer_def+"' definition: check the correct spelling or the belonging to the proper plane\nRectangle will be draw on the 'work' layer of the W-plane", _par_1, _cmd_tag );

					_mapper = wplane_sm, _canvas = is_html_canvas( _layer ) ? _layer : _glob_wplane_work_layer_placeholder ;
					_context = _canvas.getContext( _glob_canvas_ctx_2D_mode ) ;
				}
                else if ( _plane_type == BIP_BOX )
                {
					_plane_rect = bipbox_sm.get_coords_rect();
					_mapper = bipbox_sm, _canvas = _glob_bip_canvas ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lime>Selected</lime> <snow>BIP box</snow> <lime>for rectangle rendering</lime>", _par_1, _cmd_tag );
					_context = _canvas.getContext( _glob_canvas_ctx_2D_mode ) ;
				}
                else { _b_fail = YES, _error_str = "Missing input reference plane: process aborted" ; }
                  
                if ( safe_int( _params_assoc_array["clean"], 0 ) )
                {
                    circles_lib_canvas_clean( _canvas, _canvas.get_backgroundcolor(), _output_channel );
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>"+_params_assoc_array['plane']+"</snow> <lightblue>has been cleaned before drawing</lightblue>", _par_1, _cmd_tag );
                }

             	var _border = _params_assoc_array['bordercolor'] != null ? YES : NO ;
             	var _fill = _params_assoc_array['fillcolor'] != null ? YES : NO ;
             	var _bordercolor = _border ? _params_assoc_array['bordercolor'] : "transparent" ;
             	var _fillcolor = _fill ? _params_assoc_array['fillcolor'] : "transparent" ;
             	var _opacity = _params_assoc_array['opacity'] != null ? safe_float( _params_assoc_array['opacity'], DEFAULT_OPACITY ) : DEFAULT_OPACITY ;
             	var _bordersize = _params_assoc_array['bordersize'] != null ? safe_int( _params_assoc_array['bordersize'], 0 ) : 0 ;
				var _borderradius = _params_assoc_array['borderradius'] == null ? 0 : safe_int( _params_assoc_array['borderradius'], 0 );
				if ( _borderradius < 0 ) _borderradius = -_borderradius ;

				if ( !_border && !_fill )
				circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing both draw and fill colors: rectangle won't be visible", _par_1, _cmd_tag );

				if ( !_b_fail )
                {
					if ( _borderradius )
					circles_lib_draw_rounded_rect( _context, _mapper, _rect_obj, _border, _bordercolor, _fill, _fillcolor, _border ? _bordersize : 0, _borderradius, YES, _opacity, 0 );
					else
					circles_lib_draw_rect( _context, _mapper, _rect_obj, _border, _bordercolor, _fill, _fillcolor, _border ? _bordersize : 0, YES, _opacity, 0 ) ;

					if ( _params_assoc_array['rec'] == YES )
					{
						var _rec_chunk = [];
						_rec_chunk['borderradius'] = _borderradius ;
						_rec_chunk['class'] = FIGURE_CLASS_RECT ;
						_rec_chunk['border'] = _fill ;
						_rec_chunk['bordercolor'] = _bordercolor ;
						_rec_chunk['enabled'] = YES ;
						_rec_chunk['fill'] = _fill ;
						_rec_chunk['fillcolor'] = _fillcolor ;
						_rec_chunk['label'] = _params_assoc_array['label'] ;
						_rec_chunk['layer'] = _params_assoc_array['layerdef'] ;
						_rec_chunk['bordersize'] = _bordersize ;
						_rec_chunk['myhash'] = "rec" + _glob_figures_array.length ;
						_rec_chunk['obj'] = _rect_obj ;
						_rec_chunk['opacity'] = _opacity ;
						_rec_chunk['plane'] = _params_assoc_array['planeval'] ;
						_glob_figures_array.push( _rec_chunk );

						 var _subset = safe_string( _params_assoc_array['storagesubset'], "" ).trim() ;
						 if ( _subset.length > 0 )
						 {
							 if ( !is_array( _glob_storage[_subset] ) )
							 {
								_glob_storage[_subset] = [] ;
								var _msg = "Storage space <white>'"+_subset+"'</white> has been created with success" ;
								circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
							 }

							 if ( is_array( _glob_storage[_subset] ) )
							 {
								_glob_storage[_subset].push( _rec_chunk );
								var _default_space = _subset == "rect" ? 1 : 0 ;
								var _msg = "<green>Rectangle "+( _rec_chunk['label'].length > 0 ? "'"+_rec_chunk['label']+"' " : "" )+"has been recorded into "+(_default_space?"default ":"")+"'"+_subset+"' storage space</green>" ;
								circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
							 }
							 else circles_lib_output( _output_channel, DISPATCH_WARNING, "Storage space '"+_subset+"' does not exist", _par_1, _cmd_tag );
						 }
					}
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

function circles_terminal_cmd_rect_check_syntax( _syntax_array )
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