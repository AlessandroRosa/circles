function circles_terminal_cmd_figures()
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
    var _rec_chunk = null ;
    var _fn_ret_val = null ;

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
        _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
        _params_assoc_array['keywords'] = NO ;

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" );

    	var _local_cmds_params_array = [ "assemble", "bomb", "close", "copy", "disassemble",
                "delete", "disable", "bordercolor", "enable", "fill", "fillcolor", "isolate",
                "keep", "list", "long", "open", "permanent", "rec", "remove",
                "rebuild", "render", "rotate", "shift", "swap", "transfer", "update", "html" ];
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
				 
        // distribute all input values into arrays of categories
        _params_assoc_array['plane'] = NO_PLANE ;
        _params_assoc_array['help'] = NO ;
        _params_assoc_array['reverse'] = NO ;
        _params_assoc_array['all'] = NO ;
        _params_assoc_array['close'] = null ;
        _params_assoc_array['action'] = "" ;
        _params_assoc_array['figures_ref'] = [] ;
        _params_assoc_array['nodes_ref'] = [] ;
        _params_assoc_array['hash'] = [] ;
        _params_assoc_array['inherit'] = YES ;
        _params_assoc_array['labels'] = [];
        _params_assoc_array['long'] = NO ;
        _params_assoc_array['open'] = NO ;
        _params_assoc_array['update_props'] = [] ;
        var _p, current_stage = 0 ;
        // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
        var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
        for( var _i = 0 ; _i < _up_to_index ; _i++ )
        {
            _p = _params_array[_i];
            if ( _p.stricmp( "noinherit" ) ) _params_assoc_array['inherit'] = NO ;
            else if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.start_with_i( "$" ) ) _params_assoc_array['labels'].push( _p );
            else if ( /^\@[0-9]+/g.test( _p ) ) // figures ref
            {
				var _candidate_index = safe_int( _p.replace( /^\@/gi, "" ), UNDET ) ;
                if ( _candidate_index == UNDET || _glob_figures_array[_candidate_index-1] == null )
                     circles_lib_output( _output_channel, DISPATCH_WARNING, _params_assoc_array['action'] + " failure: missing figure with index '"+_candidate_index+"'", _par_1, _cmd_tag );
                else
				{
					_params_assoc_array['figures_ref'].push( _candidate_index );
					if ( _params_assoc_array['action'] == "update" )
					{
						if ( !is_array( _params_assoc_array['update_props']['figures_ref'] ) )
							_params_assoc_array['update_props']['figures_ref'] = [] ;
						_params_assoc_array['update_props']['figures_ref'].push( _candidate_index );
					}
				}
            }
            else if ( _p.is_one_of_i( "bomb", "copy", "connect", "disconnect", "isolate", "delete", "disable", "render", "hide", "show", "rotate",
                      "enable", "list", "transfer", "release", "shift", "rebuild", "swap", "update" ) )
			{
				if ( _params_assoc_array['action'] == "update" )
				{
					if ( _p == "hide" ) _params_assoc_array['update_props']['enabled'] = 0 ;
					else if ( _p == "show" ) _params_assoc_array['update_props']['enabled'] = 1 ;
				}
				else _params_assoc_array['action'] = _p ;
			}
            else if ( _p.is_one_of_i( "zplane", "z-plane", "wplane", "w-plane", "bip", "bipbox", "allplanes" ) )
			{
				_params_assoc_array['planedef'] = _p ;
				_params_assoc_array['plane'] = circles_lib_plane_get_value( _p );
				if ( _params_assoc_array['action'] == "update" ) _params_assoc_array['update_props']['plane'] = _params_assoc_array['plane'] ;
			}
            else if ( _p.is_one_of_i( "all", "keep", "long", "reverse", "rec", "close", "open", "permanent", "remove", "silent" ) )
			{
				if ( _params_assoc_array['action'] == "update" ) _params_assoc_array['update_props'][ _p ] = YES ;
			    _params_assoc_array[ _p ] = YES ;
			}
			else if ( _p.toLowerCase().start_with( "layer:" ) && _params_assoc_array['layer'] == null )
			{
				_params_assoc_array['layer'] = _p = safe_string( _p.replace( /^layer:/gi, "" ), "" ) ;
				if ( _params_assoc_array['action'] == "update" ) _params_assoc_array['update_props']['layer'] = _p ;
			}
			else if ( _p.toLowerCase().start_with( "bordercolor:" ) && _params_assoc_array['bordercolor'] == null )
			{
				_p = safe_string( _p.replace( /^bordercolor:/gi, "" ), "" ) ;
				if ( _params_assoc_array['action'] == "update" ) _params_assoc_array['update_props']['bordercolor'] = _p ;
				if ( circles_lib_colors_is_def( _p ) ) _params_assoc_array['bordercolor'] = _p;
				else { _b_fail = YES, _error_str = "Invalid draw color '"+_p+"' definition" ; }
			}
			else if ( _p.toLowerCase().start_with( "bordersize:" ) && _params_assoc_array['bordersize'] == null )
			{
				_p = safe_string( _p.replace( /^bordersize:/gi, "" ), "" ) ;
				if ( _params_assoc_array['action'] == "update" ) _params_assoc_array['update_props']['bordersize'] = _p ;
				if ( _p.testME( _glob_positive_float_regex_pattern ) ) _params_assoc_array['bordersize'] = _p ;
				else { _b_fail = YES, _error_str = "Invalid border size "+_p ; }
			}
			else if ( _p.toLowerCase().start_with( "borderradius:" ) && _params_assoc_array['borderradius'] == null )
			{
				_p = safe_string( _p.replace( /^borderradius:/gi, "" ), "" ) ;
				if ( _params_assoc_array['action'] == "update" ) _params_assoc_array['update_props']['borderradius'] = _p ;
				if ( _p.testME( _glob_positive_float_regex_pattern ) ) _params_assoc_array['borderradius'] = _p ;
				else { _b_fail = YES, _error_str = "Invalid border radius "+_p ; }
			}
			else if ( _p.toLowerCase().start_with( "fillcolor:" ) && _params_assoc_array['fillcolor'] == null )
			{
				_p = safe_string( _p.replace( /fillcolor:/gi, "" ), "" ) ;
				if ( _params_assoc_array['action'] == "update" ) _params_assoc_array['update_props']['fillcolor'] = _p ;
				if ( circles_lib_colors_is_def( _p ) ) _params_assoc_array['fillcolor'] = _p;
				else { _b_fail = YES, _error_str = "Invalid fill color '"+_p+"' definition" ; }
			}
			else if ( _p.toLowerCase().start_with( "opacity:" ) && _params_assoc_array['opacity'] == null )
			{
				_p = safe_string( _p.replace( /opacity:/gi, "" ), "" ) ;
				if ( _params_assoc_array['action'] == "update" ) _params_assoc_array['update_props']['opacity'] = _p ;
				if ( _p.testME( _glob_positive_float_regex_pattern ) ) _params_assoc_array['opacity'] = _p ;
				else { _b_fail = YES, _error_str = "Invalid opacity '"+_p+"' value" ; }
			}
			else if ( /^(?:rad|deg)\:[\+\-]*([0-9\.]+)$/g.test( _p ) && _params_assoc_array['rotationangle'] == null )
			{
				var _is_degree = /^(?:deg)/g.test( _p ) ? 1 : 0 ;
				_p = safe_float( _p.replace( /(?:rad|deg)\:/gi, "" ), 0 ) ;
				if ( _is_degree ) _p = radians( _p );
				if ( _p == 0 ) { _b_fail = YES, _error_str = "Invalid or zero input rotation angle" ; }
				else _params_assoc_array['rotationangle'] = _p ;
			}
			else if ( _p.toLowerCase().start_with( "width:" ) && _params_assoc_array['width'] == null )
			{
				_p = safe_float( _p.replace( /width:/gi, "" ), "" ) ;
				if ( _params_assoc_array['action'] == "update" ) _params_assoc_array['update_props']['width'] = _p ;
				if ( _p.testME( _glob_positive_float_regex_pattern ) ) _params_assoc_array['width'] = _p ;
				else { _b_fail = YES, _error_str = "Invalid width '"+_p+"' value" ; }
			}
			else if ( _p.toLowerCase().start_with( "height:" ) && _params_assoc_array['height'] == null )
			{
				_p = safe_string( _p.replace( /height:/gi, "" ), "" ) ;
				if ( _params_assoc_array['action'] == "update" ) _params_assoc_array['update_props']['height'] = _p ;
				if ( _p.testME( _glob_positive_float_regex_pattern ) ) _params_assoc_array['height'] = _p ;
				else { _b_fail = YES, _error_str = "Invalid height '"+_p+"' value" ; }
			}
            else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
            {
				switch( _params_assoc_array['action'] )
				{
					case "rotate":
					if ( _params_assoc_array['center'] == null )
					{
						var _pt_array = _p.replaceAll( [ "(", ")" ], "" ).split( "," );
						_params_assoc_array['center'] = new point( safe_float( _pt_array[0], 0 ), safe_float( _pt_array[1], 0 ) );
						_msg = "<lightblue>Center has been set to</lightblue> <snow>"+_p+"</snow>" ;
						circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					}
					break ;
					case "shift":
					if ( _params_assoc_array['shift_pt'] == null )
					{
						var _pt_array = _p.replaceAll( [ "(", ")" ], "" ).split( "," );
						_params_assoc_array['shift_pt'] = new point( safe_float( _pt_array[0], 0 ), safe_float( _pt_array[1], 0 ) );
						_msg = "<lightblue>Shift point has been set to</lightblue> <snow>"+_p+"</snow>" ;
						circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					}
					break ;
					default: break ;
				}
            }
            else { _b_fail = YES, _error_str = "Unknown parameter " + _p ; break ; }
        }
    }
    else { _b_fail = YES, _error_str = "Missing input params" ; }

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
        var _action = _params_assoc_array['action'], _all = _params_assoc_array['all'] ? 1 : 0 ;
		var _n_input_index = _params_assoc_array['figures_ref'].length, _rec = _params_assoc_array['rec'] != null ? 1 : 0 ;
        if ( _all || safe_size( _params_assoc_array['labels'], 0 ) > 0 )
        {
            if ( _glob_figures_array.length > 0 && _all )
            {
                for( var _i = 0 ; _i < _glob_figures_array.length ; _i++ )
                {
                    if ( _params_assoc_array['action'].is_one_of( "delete", "transfer", "update", "shift" ) )
                        _params_assoc_array['figures_ref'].push( _i + 1 ); // 1-based index is assumed here
                    else if ( _glob_figures_array[_i]['myhash'] != null )
                        _params_assoc_array['hash'].push( _glob_figures_array[_i]['myhash'] );
                    else { _b_fail = YES, _error_str = "Memory lacks: use 'rebuild' action to fix this issue" ; }
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
                        _params_assoc_array['figures_ref'].push( _x + 1 ); // input index are 1-based
                    }
                }
			}
            else circles_lib_output( _output_channel, DISPATCH_WARNING, "The list of recorded figures is empty: check if 'rec' param has been previously input", _par_1, _cmd_tag );
        }

            switch( _action )
            {
				case "bomb":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _output_channel, DISPATCH_WARNING, "The list of recorded figures is empty: no need to delete'em all", _par_1, _cmd_tag );
				else
				{
                   	var _params_array = [], _pre_prompt = null ;
					_params_array['prepromptquestion'] = null ;
                   	_params_array['promptquestion'] = _prompt_question = "Confirm to delete all figures ("+_n_figures+") ? " ;
                   	_params_array['yes_fn'] = function() { _glob_figures_array = []; circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
						circles_lib_output( _output_channel, DISPATCH_SUCCESS, "All recorded figures have been deleted with success.", _par_1, _cmd_tag );
					}
                   	_params_array['ifquestiondisabled_fn'] = function() { _glob_figures_array = []; circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES ); }
					if ( !_glob_terminal_echo_flag || _params_assoc_array["silent"] ) _params_array['yes_fn'].call(this);
                   	else circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
				}
				break ;
				case "assemble":
				_params_assoc_array['figures_ref'] = _params_assoc_array['figures_ref'].unique();
                if ( _n_input_index > 0 || _all )
				{
					var _figures_ref = _all ? _glob_figures_array : _params_assoc_array['figures_ref'] ;
					var _virtual_index, _zerobased_index, _rec_chunk ;
					var _pts_idx_array = [], _remove_ids = [] ;
					assembleloop:
					for( var _idx = 0 ; _idx < _figures_ref.length ; _idx++ )
					{
						if ( !_all )
						{
							_virtual_index = _figures_ref[_idx] ;
							_zerobased_index = _virtual_index - 1, _index = UNDET ;
							_rec_chunk = _glob_figures_array[_zerobased_index] ;
						}
						else { _virtual_index = _idx + 1; _rec_chunk = _glob_figures_array[_idx] ; }
                        if ( _rec_chunk != null )
                        {
							switch( _rec_chunk['class'] )
							{
								case FIGURE_CLASS_CIRCLE:
								case FIGURE_CLASS_LINE:
								case FIGURE_CLASS_POLYGON:
								case FIGURE_CLASS_RECT:
								_b_fail = YES ; _error_str = "Fail to assemble: figure @"+_virtual_index+" is not a point" ;
								break assembleloop ;
								break ;
								case FIGURE_CLASS_POINT:
								_pts_idx_array.push( _virtual_index-1 );
								if ( _params_assoc_array["remove"] ) _remove_ids.push( _zerobased_index );
								break ;
								default:
								_b_fail = YES ; _error_str = "Fail to assemble: figure @"+_virtual_index+" is of unknown type" ;
								break assembleloop ;
								break ;
							}
						}
					}
					
					if ( _pts_idx_array.length == 0 ) { _b_fail = YES, _error_str = "Fail to assemble: no index refers to a point" ; }
					else if ( _pts_idx_array.length == 1 ) { _b_fail = YES, _error_str = "Fail to assemble: only one index refers to a point" ; }
					else
					{
						var _cmd = [ 'line' ] ; _pts_idx_array.forEach( function( _idx ){ _cmd.push( _glob_figures_array[_idx]['obj'].output("cartesian") ); } ) ;
							if ( _rec ) _cmd.push( "rec" );
							if ( _params_assoc_array['planedef'] ) _cmd.push( _params_assoc_array['planedef'] );
							if ( _params_assoc_array['layer'] ) _cmd.push( "layer:"+_params_assoc_array['layer'] );
							if ( _params_assoc_array['bordercolor'] ) _cmd.push( "bordercolor:"+_params_assoc_array['bordercolor'] );
							if ( _params_assoc_array['bordersize'] ) _cmd.push( "bordersize:"+_params_assoc_array['bordersize'] );
						circles_lib_terminal_interpreter( _cmd.join( " " ), _glob_terminal, _output_channel );
					}
					
					if( !_b_fail && _remove_ids.length > 0 )
					{
						_remove_ids.sort( function( _a, _b ){ return _b - _a ; } ) ; // descending order to remove index safely
						_remove_ids.forEach( function( _i ){
							_glob_figures_array.remove( _i, _i ) ;
							circles_lib_output( _output_channel, DISPATCH_INFO, "Figure @"+(_idx+1)+" removed with success", _par_1, _cmd_tag );
							} ) ;
					}

					if ( !_b_fail && _rec ) circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
				}
                else if ( _n_input_index == 0 ) { _b_fail = YES, _error_str = "Fail to assemble: missing input indexes" ; }
				break;
                case "copy":
				_params_assoc_array['figures_ref'] = _params_assoc_array['figures_ref'].unique();
                if ( _n_input_index > 0 )
                {
                    var _myhash = "", _candidate_hash, _rec_chunk = null, _copy_array = [], _i, _x, _new_item ;
                    circles_lib_output( _output_channel, DISPATCH_INFO, "Copying input items", _par_1, _cmd_tag );
                    for( _i = 0 ; _i < _params_assoc_array['figures_ref'].length ; _i++ )
                    {
                        _myhash = "rec"+(_params_assoc_array['figures_ref'][_i]-1) ;
                        for( _x = 0 ; _x < _glob_figures_array.length ; _x++ )
                        {
                            _candidate_hash = _glob_figures_array[_x]['myhash'] ;
                            if ( _candidate_hash.stricmp( _myhash ) )
                            {
                                _new_item = _glob_figures_array[_x].clone_associative();
                                _copy_array.push( _new_item );
								circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Found figure @"+(_x+1)+" and copied with success", _par_1, _cmd_tag );
                            }
                        }
                    }

					var _n_copy = _copy_array.length ;
					if ( _n_copy > 0 )
					{
						_glob_figures_array = _glob_figures_array.concat( _copy_array );
						// rebuild hash tags after previous operations
						circles_lib_output( _output_channel, DISPATCH_INFO, "Rebuilding hash tags", _par_1, _cmd_tag );
						circles_lib_figures_rehash();
						circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Copied "+_n_copy+" figure"+(_n_copy==1?"":"s")+" with success", _par_1, _cmd_tag );
					}
					else circles_lib_output( _output_channel, DISPATCH_WARNING, "Fail to copy: check indexes", _par_1, _cmd_tag );
                }
                else if ( _n_input_index == 0 ) { _b_fail = YES, _error_str = "Copy failure: missing input indexes" ; }
                break ;
				case "disassemble":
				_params_assoc_array['figures_ref'] = _params_assoc_array['figures_ref'].unique();
                if ( _n_input_index == 0 && !_all ) { _b_fail = YES, _error_str = "Can't "+_action+" : missing input indexes" ; }
                else
				{
					var _figures_ref = _all ? _glob_figures_array : _params_assoc_array['figures_ref'] ;
					var _virtual_index, _zerobased_index, _rec_chunk ;
					var _pts_idx_array = [], _cmd_lines = [], _remove_ids = [] ;
					disassembleloop:
					for( var _idx = 0 ; _idx < _figures_ref.length ; _idx++ )
					{
						if ( !_all )
						{
							_virtual_index = _figures_ref[_idx] ;
							_zerobased_index = _virtual_index - 1, _index = UNDET ;
							_rec_chunk = _glob_figures_array[_zerobased_index] ;
						}
						else { _virtual_index = _idx + 1; _zerobased_index = _idx ; _rec_chunk = _glob_figures_array[_idx] ; }
                        if ( _rec_chunk != null )
                        {
							switch( _rec_chunk['class'] )
							{
								case FIGURE_CLASS_CIRCLE:
								_b_fail = YES ; _error_str = "Fail to disassemble: figure @"+_virtual_index+" cannot be disconnected" ;
								break connectloop ;
								break ;
								case FIGURE_CLASS_LINE:
								var _cmd = [] ;
									if ( is_point( _rec_chunk['obj'][0] ) ) _cmd.push( _rec_chunk['obj'][0].output("cartesian") ) ;
									if ( is_point( _rec_chunk['obj'][1] ) ) _cmd.push( _rec_chunk['obj'][1].output("cartesian") ) ;
									if ( _rec ) _cmd.push( "rec" );
									if ( _rec_chunk['planedef'] != null ) _cmd.push( _rec_chunk['planedef'] );
									if ( _rec_chunk['layer'] != null ) _cmd.push( "layer:"+_rec_chunk['layer'] );
									if ( _rec_chunk['bordercolor'] != null ) _cmd.push( "bordercolor:"+_rec_chunk['bordercolor'] );
									if ( _rec_chunk['bordersize'] != null ) _cmd.push( "bordersize:"+_rec_chunk['bordersize'] );
									circles_lib_terminal_interpreter( "point "+( _cmd.join(" ") ), _glob_terminal, _output_channel );
									if ( _params_assoc_array["remove"] ) _remove_ids.push( _zerobased_index );
								break ;
								case FIGURE_CLASS_POLYGON:
								var _pts = _rec_chunk['obj'].get_vertexes();
								var _cmd = [] ;
									_pts.forEach( function( _pt ){ if ( is_point( _pt ) ) _cmd.push( _rec_chunk['obj'][0].output("cartesian") ) ; } ) ;
									if ( _rec ) _cmd.push( "rec" );
									if ( _rec_chunk['planedef'] != null ) _cmd.push( _rec_chunk['planedef'] );
									if ( _rec_chunk['layer'] != null ) _cmd.push( "layer:"+_rec_chunk['layer'] );
									if ( _rec_chunk['bordercolor'] != null ) _cmd.push( "bordercolor:"+_rec_chunk['bordercolor'] );
									if ( _rec_chunk['bordersize'] != null ) _cmd.push( "bordersize:"+_rec_chunk['bordersize'] );
									circles_lib_terminal_interpreter( "point "+( _cmd.join(" ") ), _glob_terminal, _output_channel );
									if ( _params_assoc_array["remove"] ) _remove_ids.push( _zerobased_index );
								break ;
								case FIGURE_CLASS_RECT:
								_pts_idx_array = _pts_idx_array.concat( _rec_chunk['obj'].get_corners() );
								break ;
								case FIGURE_CLASS_POINT:
								_b_fail = YES ; _error_str = "Fail to disassemble: figure @"+_virtual_index+" is already a point cannot be disconnected" ;
								break ;
								default:
								_b_fail = YES ; _error_str = "Fail to perform disassemble: figure @"+_virtual_index+" is of unknown type" ;
								break disassembleloop ;
								break ;
							}
						}
					}
					
					if( !_b_fail && _remove_ids.length > 0 )
					{
						_remove_ids.sort( function( _a, _b ){ return _b - _a ; } ) ; // descending order to remove index safely
						_remove_ids.forEach( function( _i ){
							_glob_figures_array.remove( _i, _i ) ;
							circles_lib_output( _output_channel, DISPATCH_INFO, "Figure @"+(_idx+1)+" removed with success", _par_1, _cmd_tag );
							} ) ;
					}

					if ( !_b_fail && _rec ) circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
				}
				break ;
                case "delete":
                case "disable":
                case "enable":
                case "hide":
                case "show":
                case "transfer":
                if ( _n_input_index == 0 && !_all ) { _b_fail = YES, _error_str = "Can't "+_action+" : missing input indexes" ; }
                else
                {
					var _params_array = [] ;
					_params_array['prepromptquestion'] = null ;
					_params_array['promptquestion'] = "Confirm to "+_action+" "+( _all == 0 ? ( _n_input_index+" input entr" + ( _n_input_index != 1 ? "ies" : "y" ) ) : "all entries" ) +"? ";
					_params_array['yes_fn'] = function()
					{
						var _ret_chunk = circles_lib_figures_action( _output_channel, _action, _params_assoc_array['figures_ref'], _params_assoc_array['plane'], YES, _par_1, _cmd_tag );
						_b_fail = _ret_chunk[0], _error_str = _ret_chunk[1] ;
					}
					_params_array['ifquestiondisabled_fn'] = function()
					{
						var _ret_chunk = circles_lib_figures_action( _output_channel, _action, _params_assoc_array['figures_ref'], _params_assoc_array['plane'], YES, _par_1, _cmd_tag );
						_b_fail = _ret_chunk[0], _error_str = _ret_chunk[1] ;
					}
					if ( !_glob_terminal_echo_flag || _params_assoc_array["silent"] ) _params_array['yes_fn'].call(this);
					else circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                }
                break ;
				case "isolate":
				_params_assoc_array['figures_ref'] = _params_assoc_array['figures_ref'].unique();
                if ( _n_input_index > 0 || _all )
				{
					var _figures_ref = _all ? _glob_figures_array : _params_assoc_array['figures_ref'] ;
					var _permanent = _params_assoc_array['permanent'] != null ? 1 : 0 ;
					var _virtual_index, _zerobased_index, _rec_chunk ;
					var _pts_idx_array = [] ;
					connectloop:
					for( var _idx = 0 ; _idx < _figures_ref.length ; _idx++ )
					{
						if ( !_all )
						{
							_virtual_index = _figures_ref[_idx] ;
							_zerobased_index = _virtual_index - 1, _index = UNDET ;
							_rec_chunk = _glob_figures_array[_zerobased_index] ;
						}
						else { _virtual_index = _idx + 1; _rec_chunk = _glob_figures_array[_idx] ; }
                        if ( _rec_chunk != null )
                        {
							if ( _params_assoc_array['plane'].is_one_of( NO_PLANE, ALL_PLANES, _rec_chunk['plane'] ) )
							{
								switch( _rec_chunk['class'] )
								{
									case FIGURE_CLASS_CIRCLE:
									case FIGURE_CLASS_LINE:
									case FIGURE_CLASS_POLYGON:
									case FIGURE_CLASS_RECT:
									case FIGURE_CLASS_POINT:
									_pts_idx_array.push( _virtual_index );
									break ;
									default:
									_b_fail = YES ; _error_str = "Fail to perform isolation: figure @"+_virtual_index+" is of unknown type" ;
									break connectloop ;
									break ;
								}
							}
						}
					}

					if ( _pts_idx_array.length == 0 ) { _b_fail = YES, _error_str = "Fail to perform isolation: no index refers to a valid object" ; }
					else
					{
						var _unflagged = [] ;
						_glob_figures_array.forEach( function( _rec_chunk ){
							var _idx = safe_int( _rec_chunk['myhash'].replace( /^rec/g, "" ), -1 ) ;
							if ( !_pts_idx_array.includes( _idx+1 ) ) _unflagged.push( _idx+1 );
							_glob_figures_array[_idx]['enabled'] = _pts_idx_array.includes( _idx+1 ) ? 1 : 0 ;
						} );
						
						_pts_idx_array = _pts_idx_array.map( function( _i ){ return "@"+_i ; } )
						circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lime>Temporary graphic isolation performed with success for figures</lime> <white>"+_pts_idx_array.join( ", " )+"</white>", _par_1, _cmd_tag );
						circles_lib_canvas_afterrender_figures_draw( [], YES, ALL_PLANES );

						if ( _permanent )
						{
							_glob_figures_array.forEach( function( _rec_chunk ){
								var _idx = safe_int( _rec_chunk['myhash'].replace( /^rec/g, "" ), -1 ) ;
								if ( _unflagged.includes( _idx+1 ) ) _glob_figures_array[_idx]['enabled'] = 1 ;
							} );
							circles_lib_output( _output_channel, DISPATCH_INFO, "Permament flag is on: visibility for hidden elements has been restored after visualization", _par_1, _cmd_tag );
						}
						else circles_lib_output( _output_channel, DISPATCH_INFO, "Permament flag is off: visibility for hidden elements has not been restored after visualization", _par_1, _cmd_tag );
					}
				}
				break
                case "list":
                var _n = safe_size( _glob_figures_array, 0 ), _row ;
                if ( _n > 0 )
                {
                    var _reverse = _params_assoc_array['reverse'] ;
                    _row = "Found <yellow>"+_n+"</yellow> element" + ( ( _n == 1 ) ? "" : "s" ) + ( _reverse ? " - Reverse list" : "" );
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                    var _counter = 1 ;
                    for( var _i = ( _reverse ? _n - YES : NO ); _reverse ? _i >= 0 : _i < _n ; _reverse ? _i-- : _i++ )
                    {
                        _row = _figures_cmd_display_list_item( _counter, _glob_figures_array[_i], _params_assoc_array );
                        _counter++ ;
                        if ( safe_size( _row, 0 ) > 0 )
                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                        else 
                        circles_lib_output( _output_channel, DISPATCH_ERROR, "Fail to display figure item indexed at "+(_i+1), _par_1, _cmd_tag );
                    }
                }
                else if ( _n == 0 )
                {
                    var _msg = "<orange>The list of figures is empty.</orange>" + _glob_crlf ;
                        _msg += "<lightgray>To fill this list, include 'rec' param"  + _glob_crlf + "in circle | rect | line | point | region cmds</lightgray>" ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                }
                break ;
                case "release":
                circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "rebuild":
                if ( _glob_figures_array.length > 0 )
                {
                    // rebuild hash tags after previous deletion
                    circles_lib_output( _output_channel, DISPATCH_INFO, "Rebuilding the hash table", _par_1, _cmd_tag );
                    _b_fail = !circles_lib_figures_rehash();
                    if ( !_b_fail )
                    circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Hash table has been rebuilt with success", _par_1, _cmd_tag );
                }
                else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't rebuild the hash table: figures list is empty", _par_1, _cmd_tag );
                break;
                case "render":
				if ( _params_assoc_array['plane'] == NO_PLANE ) _param_assoc_array['plane'] = ALL_PLANES ;
                circles_lib_canvas_afterrender_figures_draw( [], YES, _params_assoc_array['plane'] );
                circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Rendering the figures list", _par_1, _cmd_tag );
                break ;
				case "rotate":
				if ( _params_assoc_array['center'] == null ) { _b_fail = YES ; _error_str = "Missing rotation center" ; }
				else if ( _params_assoc_array['rotationangle'] == null ) { _b_fail = YES ; _error_str = "Missing rotation angle" ; }
                else if ( _n_input_index == 0 && !_all ) { _b_fail = YES, _error_str = "Missing input indexes" ; }
				else
				{
					var _rec = _params_assoc_array['rec'], _center = _params_assoc_array['center'] ;
					var _rot_angle = _params_assoc_array['rotationangle'] ;
					var _figures_ref = _all ? _glob_figures_array : _params_assoc_array['figures_ref'] ;
					var _virtual_index, _zerobased_index, _rec_chunk ;
					var _obj = null, _new_obj = null, _idx, _class ;
					rotateloop:
					for( var _idx = 0 ; _idx < _figures_ref.length ; _idx++ )
					{
						if ( !_all )
						{
							_virtual_index = _figures_ref[_idx] ;
							_zerobased_index = _virtual_index - 1, _index = UNDET ;
							_rec_chunk = _glob_figures_array[_zerobased_index] ;
						}
						else { _virtual_index = _idx + 1; _rec_chunk = _glob_figures_array[_idx].clone_associative() ; }
                        if ( _rec_chunk != null )
                        {
							_obj = _rec_chunk['obj'], _class = _rec_chunk['class'] ;
							switch( _class )
							{
								case FIGURE_CLASS_CIRCLE:
								_new_obj = _obj.rotate( _center, _rot_angle, 0 ) ;
								break ;
								case FIGURE_CLASS_POLYGON:
								case FIGURE_CLASS_LINE:
								_new_obj = [] ; _obj.forEach( function( _pt ) { _new_obj.push( _pt.rotate( _center, _rot_angle, 0 ) ); } ) ;
								break ;
								case FIGURE_CLASS_POINT:
								_new_obj = _obj.rotate( _center, _rot_angle, 0 ) ;
								break ;
								case FIGURE_CLASS_RECT:
								_new_obj = _obj.rotate( _center, _rot_angle, 0 ).get_vertexes() ;
								break ;
								default:
								break rotateloop ;
								break ;
							}
								
							if ( _rec ) 
							{
								var _new_fig = _glob_figures_array[_zerobased_index].clone_associative();
								_new_fig['obj'] = _new_obj ;
								if ( _class == FIGURE_CLASS_RECT ) _new_fig['class'] = FIGURE_CLASS_POLYGON ;
								_glob_figures_array.push( _new_fig );
								_new_fig['myhash'] = "rec"+(_glob_figures_array.length-1);
								circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Figure @"+_virtual_index+" has been rotated and cloned with success", _par_1, _cmd_tag );
							}
							else
							{
								if ( _class == FIGURE_CLASS_RECT ) _class = FIGURE_CLASS_POLYGON ;
								_glob_figures_array[_zerobased_index]['obj'] = _new_obj.clone() ;
								_glob_figures_array[_zerobased_index]['class'] = _class ;
								circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Figure @"+_virtual_index+" has been rotated with success", _par_1, _cmd_tag );
							}
						}
					}

					if ( !_b_fail ) circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
				}	
				break ;
                case "shift":
                if ( _n_input_index == 0 && !_all ) { _b_fail = YES, _error_str = "Missing input indexes" ; }
                else
                {
					var _shift_pt = _params_assoc_array['shift_pt'], _figure_label = "", _layer = null ;
					var _figures_ref = _all ? _glob_figures_array : _params_assoc_array['figures_ref'] ;
					var _virtual_index, _zerobased_index, _rec_chunk ;
                    for( var _idx = 0 ; _idx < _figures_ref.length ; _idx++ )
                    {
						if ( !_all )
						{
							_virtual_index = _figures_ref[_idx] ;
							_zerobased_index = _virtual_index - 1, _index = UNDET ;
							_rec_chunk = _glob_figures_array[_zerobased_index] ;
						}
						else { _virtual_index = _idx + 1; _rec_chunk = _glob_figures_array[_idx] ; }
                        if ( _rec_chunk != null )
                        {
                            _rec_label = safe_string( _rec_chunk['label'], "" ), _figure_label = "" ;
							switch( _rec_chunk['class'] )
							{
							    case FIGURE_CLASS_CIRCLE: _rec_label = "circle" ; _primitive_obj = _rec_chunk['obj'] ; break ;
								case FIGURE_CLASS_LINE: _rec_label = "line" ; _primitive_obj = _rec_chunk['obj'] ; break ;
								case FIGURE_CLASS_POINT: _rec_label = "point" ; _primitive_obj = _rec_chunk['obj'] ; break ;
								case FIGURE_CLASS_RECT: _rec_label = "rect" ; _primitive_obj = _rec_chunk['obj'] ; break ;
								case FIGURE_CLASS_POLYGON: _rec_label = "polygon" ; _primitive_obj = _rec_chunk['obj'] ; break ;
								default: _rec_label = "undefined figure" ; _primitive_obj = null ; break ;
							}

							if ( _primitive_obj != null )
							{
								if ( is_array( _primitive_obj ) )
								{
									for( var _i = 0 ; _i < _primitive_obj.length ; _i++ )
									_primitive_obj[_i] = _primitive_obj[_i].shift( _shift_pt, 0 );
								}
								else if ( _primitive_obj ) _glob_figures_array[_virtual_index-1]['obj'] = _primitive_obj.shift( _shift_pt, 0 );
								circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Shifting "+_rec_label+" @"+_virtual_index+" performed with success", _par_1, _cmd_tag );
							}
                        }
                        else { _b_fail = YES, _error_str = "Memory failure: no figure indexed @"+_virtual_index ; }
                    }
					
					if ( !_b_fail ) circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
                }
                break;
                case "swap":
                if ( _n_input_index != 2 ) { _b_fail = YES, _error_str = "Swap failure: 2 consistent figures indexes are required" ; }
                else
                {
					var _figs = _glob_figures_array ;
                    var _index_1 = _params_assoc_array['figures_ref'][0] - 1, _index_2 = _params_assoc_array['figures_ref'][1] - 1 ; // zerobased idx conversion
					if ( _figs[ _index_1 ] != null && _figs[ _index_2 ] != null )
					{
						[ _figs[ _index_2 ], _figs[ _index_1 ] ] = [ _figs[ _index_1 ], _figs[ _index_2 ] ] ;
					}
					else if ( _figs[ _index_1 ] == null ) { _b_fail = YES, _error_str = "Swap failure: index #"+(_index_1+1)+" does not refer to any archive item" ; }
					else if ( _figs[ _index_2 ] == null ) { _b_fail = YES, _error_str = "Swap failure: index #"+(_index_2+1)+" does not refer to any archive item" ; }
                    else { _b_fail = YES, _error_str = "Swap failure: input indexes do not refer to consistent entries in the archive" ; }

					if ( !_b_fail )
					{
						circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Swap performed with success", _par_1, _cmd_tag );
						circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
					}
                }
                break ;
                case "update":
                if ( _n_input_index == 0 && !_all ) { _b_fail = YES, _error_str = "Can't update: missing input index" ; }
                else
				{
		 			circles_lib_figures_update_manager( _output_channel, _params_assoc_array['update_props'], _par_1, _cmd_tag );
					circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Properties have been updated with success", _par_1, _cmd_tag );
					circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
				}
                break ;
			    default: _b_fail = YES, _error_str = "Unknown action '"+_action+"'" ; break ;
            }
    }

    if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION )
		circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function _figures_cmd_display_list_item( _i, _rec_chunk, _options )
{
     var _row = "" ;
     if ( _rec_chunk != null )
     {
         var _margin_str = ( new String( "" ) ).rpad( " ", 4 );
         _row = _i + ")" + _margin_str ;
         var _label = _rec_chunk['label'] != null ? ( _rec_chunk['label'].length > 0 ? "<lemon>"+_rec_chunk['label']+"</lemon>" : "<lightgray><no-label></lightgray>" ) : "" ;
             _label = _label.lpad( " ", 12 );
         var _enabled = _rec_chunk['enabled'] ? "enabled" : "disabled" ;
             _enabled = _enabled.rpad( " ", 8 );
             _enabled = _rec_chunk['enabled'] ? "<greenshock>"+_enabled+"</greenshock>" : "<red>"+_enabled+"</red>" ;
         var _plane_str = "", _layer = _rec_chunk['layer'] ;
         switch( _rec_chunk['plane'] )
         {
            case Z_PLANE: _plane_str = _layer+"@zplane" ; break ;
            case W_PLANE: _plane_str = _layer+"@wplane" ; break ;
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
            case FIGURE_CLASS_POINT:
            _row += "<snow>" + ( new String( "point" ) ).rpad( " ", 9 ) + "</snow>" ;
            _row += ( new String( _plane_str ) ).rpad( " ", 14 );
            break ;
            case FIGURE_CLASS_POLYGON:
            _row += "<snow>" + ( new String( "polygon" ) ).rpad( " ", 9 ) + "</snow>" ;
            _row += ( new String( _plane_str ) ).rpad( " ", 14 );
            break ;
            case FIGURE_CLASS_RECT:
            _row += "<snow>" + ( new String( "rect" ) ).rpad( " ", 9 ) + "</snow>" ;
            _row += ( new String( _plane_str ) ).rpad( " ", 14 );
            break ;
			default: break ;
         }

         _row +=  ( new String( "" ) ).rpad( " ", 4 );
         if ( _obj != null )
         {
			switch( _rec_chunk['class'] )
			{
				case FIGURE_CLASS_CIRCLE: _row += "<snow>" + _obj.output() + "</snow>" ; break ;
				case FIGURE_CLASS_RECT: _row += "vertices: <snow>" + _obj.output( "cartesian" ) + "</snow>" ; break ;
				case FIGURE_CLASS_POINT: _row += "<snow>" + _obj.output( "cartesian" ) + "</snow>" ; break ;
				case FIGURE_CLASS_POLYGON: // entries of polygon or of line type do not exactly include such obj, but the array of points
				case FIGURE_CLASS_LINE:
                _row += "points: " ;
                var _obj_len = _obj != null ? _obj.length : 0 ;
                for( var _i = 0 ; _i < _obj_len ; _i++ )
                {
                    if ( _obj[_i] != null ) _row += "<snow>"+_obj[_i].output( "cartesian" )+"</snow> " ;
                    else _row += "<red>(missing)</red> " ;
                }
				break ;
				default: _row += "<red>unknown primitive object</red> " ; break ;
			}
         }

        _row += _margin_str + _enabled + _margin_str + "<yellow>Label</yellow> " + _label ;

        if ( _options['long'] )
        {
            var _bordercolor = _rec_chunk['bordercolor'] != null ? _rec_chunk['bordercolor'].trim() : "" ;
            if ( circles_lib_colors_is_tag( _bordercolor ) ) _bordercolor = circles_lib_colors_get_def_from_tag( _bordercolor );
            var _fillcolor = _rec_chunk['fillcolor'] != null ? _rec_chunk['fillcolor'].trim() : "" ;
            if ( circles_lib_colors_is_tag( _fillcolor ) ) _fillcolor = circles_lib_colors_get_def_from_tag( _fillcolor );
            var _properties = [];
            _properties.push( _glob_crlf + _margin_str );
            _properties.push( ( _rec_chunk['border'] == YES && _bordercolor.length > 0 ) ? "<yellow>Border</yellow> ("+_bordercolor+")" : "<gray>No draw</gray>" );
            _properties.push( ( _rec_chunk['fill'] == YES && _fillcolor.length > 0 ) ? "<yellow>Fill</yellow> ("+_fillcolor+")" : "<gray>No fill</gray>" );
            if ( _rec_chunk['bordersize'] != null ) _properties.push( "<yellow>Border size</yellow> " + _rec_chunk['bordersize'] );
            if ( _rec_chunk['borderradius'] != null && _rec_chunk['class'].is_one_of( FIGURE_CLASS_RECT ) )
            _properties.push( "<yellow>Rect border radius</yellow> " + _rec_chunk['borderradius'] );
            if ( _rec_chunk['opacity'] != null ) _properties.push( "<yellow>Opacity</yellow> " + _rec_chunk['opacity'] );
            if ( _rec_chunk['radius'] != null ) _properties.push( "<yellow>Radius</yellow> " + _rec_chunk['radius'] );

            _row += _properties.join( " " );
        }
     }

     return _row ;
}