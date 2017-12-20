function circles_terminal_cmd_figures()
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
    var _cmd_params = [];
    var _rec_chunk = null ;
    var _fn_ret_val = null ;

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['keywords'] = NO ;

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" );

    	var _cmd_terms_dict = [ "assemble", "bomb", "close", "copy", "disassemble",
                "delete", "disable", "drop", "bordercolor", "enable", "fill", "fillcolor", "isolate",
                "keep", "line", "list", "long", "open", "permanent", "polygon", "radius", "rec",
                "rebuild", "render", "rotate", "shift", "swap", "transfer", "update", "html" ];
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
        _cmd_params['plane'] = NO_PLANE ;
        _cmd_params['help'] = NO ;
        _cmd_params['reverse'] = NO ;
        _cmd_params['all'] = NO ;
        _cmd_params['close'] = null ;
        _cmd_params['action'] = "" ;
        _cmd_params['figures_ref'] = [] ;
        _cmd_params['nodes_ref'] = [] ;
        _cmd_params['hash'] = [] ;
        _cmd_params['inherit'] = YES ;
        _cmd_params['labels'] = [];
        _cmd_params['long'] = NO ;
        _cmd_params['open'] = NO ;
        _cmd_params['update_props'] = [] ;
        var _p, current_stage = 0 ;
        // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
        var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
        for( var _i = 0 ; _i < _up_to_index ; _i++ )
        {
            _p = _params_array[_i];
            if ( _p.stricmp( "noinherit" ) ) _cmd_params['inherit'] = NO ;
            else if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.start_with_i( "$" ) ) _cmd_params['labels'].push( _p );
			else if ( /^\@[0-9]+\-\@[0-9]+$/g.test( _p ) )
			{
				_p = _p.replace( /\@/g, "" ) ;
				_p = _p.split( "-" ); _p[0] = safe_int( _p[0], 0 ); _p[1] = safe_int( _p[1], 0 ); 
				_cmd_params['range_start'] = _p[0], _cmd_params['range_end'] = _p[1] ;
			}
			else if ( /^(?:rad|deg)\:[\+\-]*([0-9\.]+)$/g.test( _p ) && _cmd_params['rotationangle'] == null )
			{
				var _is_degree = /^(?:deg)/g.test( _p ) ? 1 : 0 ;
				_p = safe_float( _p.replace( /(?:rad|deg)\:/gi, "" ), 0 ) ;
				if ( _is_degree ) _p = radians( _p );
				if ( _p == 0 ) { _b_fail = YES, _error_str = "Invalid or zero input rotation angle" ; }
				else _cmd_params['rotationangle'] = _p ;
			}
            else if ( /^\@[0-9]+$/g.test( _p ) ) // figures ref
            {
				var _candidate_index = safe_int( _p.replace( /^\@/gi, "" ), UNDET ) ;
                if ( _candidate_index == UNDET || _glob_figures_array[_candidate_index-1] == null )
                     circles_lib_output( _out_channel, DISPATCH_WARNING, _cmd_params['action'] + " failure: missing figure with index '"+_candidate_index+"'", _par_1, _cmd_tag );
                else
				{
					_cmd_params['figures_ref'].push( _candidate_index );
					if ( _cmd_params['action'] == "update" )
					{
						if ( !is_array( _cmd_params['update_props']['figures_ref'] ) ) _cmd_params['update_props']['figures_ref'] = [] ;
						_cmd_params['update_props']['figures_ref'].push( _candidate_index );
					}
				}
            }
            else if ( _p.is_one_of_i( "assemble", "bomb", "copy", "connect", "delete", "disable", "disassemble",
									  "disconnect", "enable", "hide", "isolate", "list", "render", "rotate", "show",
									  "transfer", "release", "shift", "rebuild", "swap", "update" ) )
			{
				if ( _cmd_params['action'] == "update" )
				{
					if ( _p == "hide" ) _cmd_params['update_props']['enabled'] = 0 ;
					else if ( _p == "show" ) _cmd_params['update_props']['enabled'] = 1 ;
				}
				else if ( _p == "hide" ) { _cmd_params['action'] = "update" ; _cmd_params['update_props']['enabled'] = 0 ; }
				else if ( _p == "show" ) { _cmd_params['action'] = "update" ; _cmd_params['update_props']['enabled'] = 1 ; }
				else _cmd_params['action'] = _p ;
			}
            else if ( _p.is_one_of_i( "zplane", "z-plane", "wplane", "w-plane", "bip", "bipbox", "allplanes" ) )
			{
				_cmd_params['planedef'] = _p ;
				_cmd_params['plane'] = circles_lib_plane_get_value( _p );
				if ( _cmd_params['action'] == "update" ) _cmd_params['update_props']['plane'] = _cmd_params['plane'] ;
			}
            else if ( _p.is_one_of_i( "all", "close", "drop", "keep", "line", "long", "open", "permanent", "polygon",
									  "rec", "reverse", "silent" ) )
			{
				if ( _cmd_params['action'] == "update" ) _cmd_params['update_props'][ _p ] = YES ;
			    _cmd_params[ _p ] = YES ;
			}
			else if ( _p.toLowerCase().start_with( "layer:" ) && _cmd_params['layer'] == null )
			{
				_cmd_params['layer'] = _p = safe_string( _p.replace( /^layer:/gi, "" ), "" ) ;
				if ( _cmd_params['action'] == "update" ) _cmd_params['update_props']['layer'] = _p ;
			}
			else if ( _p.toLowerCase().start_with( "bordercolor:" ) && _cmd_params['bordercolor'] == null )
			{
				_p = safe_string( _p.replace( /^bordercolor:/gi, "" ), "" ) ;
				if ( _cmd_params['action'] == "update" ) _cmd_params['update_props']['bordercolor'] = _p ;
				if ( circles_lib_colors_is_def( _p ) ) _cmd_params['bordercolor'] = _p;
				else { _b_fail = YES, _error_str = "Invalid draw color '"+_p+"' definition" ; }
			}
			else if ( _p.toLowerCase().start_with( "bordersize:" ) && _cmd_params['bordersize'] == null )
			{
				_p = safe_string( _p.replace( /^bordersize:/gi, "" ), "" ) ;
				if ( _cmd_params['action'] == "update" ) _cmd_params['update_props']['bordersize'] = _p ;
				if ( _p.testME( _glob_positive_float_regex_pattern ) ) _cmd_params['bordersize'] = _p ;
				else { _b_fail = YES, _error_str = "Invalid border size "+_p ; }
			}
			else if ( _p.toLowerCase().start_with( "borderradius:" ) && _cmd_params['borderradius'] == null )
			{
				_p = safe_string( _p.replace( /^borderradius:/gi, "" ), "" ) ;
				if ( _cmd_params['action'] == "update" ) _cmd_params['update_props']['borderradius'] = _p ;
				if ( _p.testME( _glob_positive_float_regex_pattern ) ) _cmd_params['borderradius'] = _p ;
				else { _b_fail = YES, _error_str = "Invalid border radius "+_p ; }
			}
			else if ( _p.toLowerCase().start_with( "radius:" ) && _cmd_params['radius'] == null )
			{
				_p = safe_string( _p.replace( /^radius:/gi, "" ), "" ) ;
				if ( _cmd_params['action'] == "update" ) _cmd_params['update_props']['radius'] = _p ;
				if ( _p.testME( _glob_positive_float_regex_pattern ) ) _cmd_params['radius'] = _p ;
				else { _b_fail = YES, _error_str = "Invalid radius "+_p ; }
			}
			else if ( _p.toLowerCase().start_with( "fillcolor:" ) && _cmd_params['fillcolor'] == null )
			{
				_p = safe_string( _p.replace( /fillcolor:/gi, "" ), "" ) ;
				if ( _cmd_params['action'] == "update" ) _cmd_params['update_props']['fillcolor'] = _p ;
				if ( circles_lib_colors_is_def( _p ) ) _cmd_params['fillcolor'] = _p;
				else { _b_fail = YES, _error_str = "Invalid fill color '"+_p+"' definition" ; }
			}
			else if ( _p.toLowerCase().start_with( "opacity:" ) && _cmd_params['opacity'] == null )
			{
				_p = safe_string( _p.replace( /opacity:/gi, "" ), "" ) ;
				if ( _cmd_params['action'] == "update" ) _cmd_params['update_props']['opacity'] = _p ;
				if ( _p.testME( _glob_positive_float_regex_pattern ) ) _cmd_params['opacity'] = _p ;
				else { _b_fail = YES, _error_str = "Invalid opacity '"+_p+"' value" ; }
			}
			else if ( _p.toLowerCase().start_with( "width:" ) && _cmd_params['width'] == null )
			{
				_p = safe_float( _p.replace( /width:/gi, "" ), "" ) ;
				if ( _cmd_params['action'] == "update" ) _cmd_params['update_props']['width'] = _p ;
				if ( _p.testME( _glob_positive_float_regex_pattern ) ) _cmd_params['width'] = _p ;
				else { _b_fail = YES, _error_str = "Invalid width '"+_p+"' value" ; }
			}
			else if ( _p.toLowerCase().start_with( "height:" ) && _cmd_params['height'] == null )
			{
				_p = safe_string( _p.replace( /height:/gi, "" ), "" ) ;
				if ( _cmd_params['action'] == "update" ) _cmd_params['update_props']['height'] = _p ;
				if ( _p.testME( _glob_positive_float_regex_pattern ) ) _cmd_params['height'] = _p ;
				else { _b_fail = YES, _error_str = "Invalid height '"+_p+"' value" ; }
			}
            else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
            {
				switch( _cmd_params['action'] )
				{
					case "rotate":
					if ( _cmd_params['center'] == null )
					{
						var _pt_array = _p.replaceAll( [ "(", ")" ], "" ).split( "," );
						_cmd_params['center'] = new point( safe_float( _pt_array[0], 0 ), safe_float( _pt_array[1], 0 ) );
						_msg = "<lightblue>Center has been set to</lightblue> <snow>"+_p+"</snow>" ;
						circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					}
					break ;
					case "shift":
					if ( _cmd_params['shift_pt'] == null )
					{
						var _pt_array = _p.replaceAll( [ "(", ")" ], "" ).split( "," );
						_cmd_params['shift_pt'] = new point( safe_float( _pt_array[0], 0 ), safe_float( _pt_array[1], 0 ) );
						_msg = "<lightblue>Shift point has been set to</lightblue> <snow>"+_p+"</snow>" ;
						circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					}
					break ;
					case "update":
					_cmd_params['update_props']['center'] = _p ;
					break ;
					default: break ;
				}
            }
            else { _b_fail = YES, _error_str = "Unknown parameter " + _p ; break ; }
        }
    }
    else { _b_fail = YES, _error_str = "Missing input params" ; }

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
        var _action = _cmd_params['action'], _all = _cmd_params['all'] ? 1 : 0 ;
		var _n_input_index = _cmd_params['figures_ref'].length, _rec = _cmd_params['rec'] != null ? 1 : 0 ;
        if ( _all || safe_size( _cmd_params['labels'], 0 ) > 0 )
        {
            if ( _glob_figures_array.length > 0 && _all )
            {
                for( var _i = 0 ; _i < _glob_figures_array.length ; _i++ )
                {
                    if ( _cmd_params['action'].is_one_of( "delete", "transfer", "update", "shift" ) )
                        _cmd_params['figures_ref'].push( _i + 1 ); // 1-based index is assumed here
                    else if ( _glob_figures_array[_i]['myhash'] != null )
                        _cmd_params['hash'].push( _glob_figures_array[_i]['myhash'] );
                    else { _b_fail = YES, _error_str = "Memory lacks: use 'rebuild' action to fix this issue" ; }
                }
            }
            else if ( safe_size( _cmd_params['labels'], 0 ) > 0 && _glob_figures_array.length > 0 )  // if label exists, get the related index
            {
                var _l, _x, _len = safe_size( _glob_figures_array, 0 );
                for( _l = 0 ; _l < _cmd_params['labels'].length ; _l++ )
                {
                    for( _x = 0 ; _x < _len ; _x++ )
                    {
                        if ( _glob_figures_array[_x]['label'].strcmp( _cmd_params['labels'][_l] ) )
                        _cmd_params['figures_ref'].push( _x + 1 ); // input index are 1-based
                    }
                }
			}
            else circles_lib_output( _out_channel, DISPATCH_WARNING, "The list of recorded figures is empty: check if 'rec' param has been previously input", _par_1, _cmd_tag );
        }

		_cmd_params['figures_ref'] = _cmd_params['figures_ref'].unique();
		
            switch( _action )
            {
				case "assemble":
				var _cmd = "line" ;
				if ( _cmd_params['line'] ) _cmd = "line" ;
				else if ( _cmd_params['polygon'] ) _cmd = "polygon" ;

				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
                else if ( _n_input_index == 0 && !_all ) { _b_fail = YES, _error_str = "Fail to assemble: missing input indexes" ; }
                else if ( _n_input_index == 1 && !_all ) { _b_fail = YES, _error_str = "Fail to assemble: select at least two elements" ; }
				else if ( _n_figures < 3 && _n_input_index < 3 && !_all && _cmd == "polygon" ) { _b_fail = YES, _error_str = "Fail to assemble: at least 3 points are required to assemble a polygon" ; }
                else if ( _n_input_index > 1 || _all )
				{
					var _figures_ref = _all ? _glob_figures_array : _cmd_params['figures_ref'] ;
					var _virtual_index, _zerobased_index, _rec_chunk ;
					var _pts_idx_array = [], _drop_ids = [], _b_drop = _cmd_params['drop'] != null ;
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
								if ( _cmd_params["drop"] ) _drop_ids.push( _zerobased_index );
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
						var _cmd = [ _cmd ] ; _pts_idx_array.forEach( function( _idx ){ _cmd.push( _glob_figures_array[_idx]['obj'].output("cartesian") ); } ) ;
							if ( _rec ) _cmd.push( "rec" );
							if ( _cmd_params['planedef'] ) _cmd.push( _cmd_params['planedef'] );
							if ( _cmd_params['layer'] ) _cmd.push( "layer:"+_cmd_params['layer'] );

							if ( _cmd_params['bordercolor'] ) _cmd.push( "bordercolor:"+_cmd_params['bordercolor'] );
							if ( _cmd_params['bordersize'] ) _cmd.push( "bordersize:"+_cmd_params['bordersize'] );
							if ( _cmd_params['fillcolor'] ) _cmd.push( "fillcolor:"+_cmd_params['fillcolor'] );
							if ( _cmd_params['opacity'] ) _cmd.push( "opacity:"+_cmd_params['opacity'] );
						circles_lib_terminal_interpreter( _cmd.join( " " ), _glob_terminal, _out_channel );
					}
					
					if( !_b_fail && _drop_ids.length > 0 && _b_drop )
					{
						_drop_ids.sort( function( _a, _b ){ return _b - _a ; } ) ; // descending order to drop index safely
						_drop_ids.forEach( function( _i ){
							_glob_figures_array.remove( _i, _i ) ;
							circles_lib_output( _out_channel, DISPATCH_INFO, "Point @"+(_i+1)+" has been dropped with success", _par_1, _cmd_tag );
							} ) ;
					}

					if ( !_b_fail && _rec ) circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
				}
				break;
				case "bomb":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
				else
				{
                   	var _params_array = [], _pre_prompt = null ;
					_params_array['prepromptquestion'] = null ;
                   	_params_array['promptquestion'] = _prompt_question = "Confirm to delete ("+_n_figures+") all recorded figures (y|n) ? " ;
                   	_params_array['yes_fn'] = function() { _glob_figures_array = []; circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
						circles_lib_output( _out_channel, DISPATCH_SUCCESS, "All recorded figures have been deleted with success.", _par_1, _cmd_tag );
					}
                   	_params_array['ifquestiondisabled_fn'] = function() { _glob_figures_array = []; circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES ); }
					if ( !_glob_terminal_echo_flag || _cmd_params["silent"] ) _params_array['yes_fn'].call(this);
                   	else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
				}
				break ;
                case "copy":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
                else if ( _n_input_index == 0 ) { _b_fail = YES, _error_str = "Copy failure: missing input indexes" ; }
                else if ( _n_input_index > 0 )
                {
                    var _myhash = "", _candidate_hash, _rec_chunk = null, _copy_array = [], _i, _x, _new_item ;
                    circles_lib_output( _out_channel, DISPATCH_INFO, "Copying input items", _par_1, _cmd_tag );
                    for( _i = 0 ; _i < _cmd_params['figures_ref'].length ; _i++ )
                    {
                        _myhash = "rec"+(_cmd_params['figures_ref'][_i]-1) ;
                        for( _x = 0 ; _x < _glob_figures_array.length ; _x++ )
                        {
                            _candidate_hash = _glob_figures_array[_x]['myhash'] ;
                            if ( _candidate_hash.stricmp( _myhash ) )
                            {
                                _new_item = _glob_figures_array[_x].clone_associative();
                                _copy_array.push( _new_item );
								circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Found figure @"+(_x+1)+" and copied with success", _par_1, _cmd_tag );
                            }
                        }
                    }

					var _n_copy = _copy_array.length ;
					if ( _n_copy > 0 )
					{
						_glob_figures_array = _glob_figures_array.concat( _copy_array );
						// rebuild hash tags after previous operations
						circles_lib_output( _out_channel, DISPATCH_INFO, "Rebuilding hash tags", _par_1, _cmd_tag );
						circles_lib_figures_rehash();
						circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Copied "+_n_copy+" figure"+(_n_copy==1?"":"s")+" with success", _par_1, _cmd_tag );
					}
					else circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to copy: check indexes", _par_1, _cmd_tag );
                }
                break ;
				case "disassemble":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
                else if ( _n_input_index == 0 && !_all ) { _b_fail = YES, _error_str = "Fail to "+_action+" : missing input indexes" ; }
                else
				{
					var _figures_ref = _all ? _glob_figures_array : _cmd_params['figures_ref'] ;
					var _virtual_index, _zerobased_index, _rec_chunk ;
					var _pts_idx_array = [], _cmd_lines = [], _drop_ids = [], _b_drop = _cmd_params["drop"] != null ;
					disassembleloop:
					for( var _idx = 0 ; _idx < _figures_ref.length ; _idx++ )
					{
						if ( !_all )
						{
							_virtual_index = _figures_ref[_idx] ;
							_zerobased_index = _virtual_index - 1, _index = UNDET, _b_drop = _cmd_params['drop'] != null ;
							_rec_chunk = _glob_figures_array[_zerobased_index] ;
						}
						else { _virtual_index = _idx + 1; _zerobased_index = _idx ; _rec_chunk = _glob_figures_array[_idx] ; }

                        if ( _rec_chunk != null )
                        {
							switch( _rec_chunk['class'] )
							{
								case FIGURE_CLASS_CIRCLE:
								_b_fail = YES ; _error_str = "Fail to disassemble: figure @"+_virtual_index+" cannot be disconnected" ;
								break disassembleloop ;
								break ;
								case FIGURE_CLASS_LINE:
								var _cmd = [] ;
									if ( is_point( _rec_chunk['obj'][0] ) ) _cmd.push( _rec_chunk['obj'][0].output("cartesian") ) ;
									if ( is_point( _rec_chunk['obj'][1] ) ) _cmd.push( _rec_chunk['obj'][1].output("cartesian") ) ;
									if ( _rec ) _cmd.push( "rec" );
									if ( _rec_chunk['planedef'] != null ) _cmd.push( _rec_chunk['planedef'] );
									if ( _rec_chunk['layer'] != null ) _cmd.push( "layer:"+_rec_chunk['layer'] );
									
									if ( _cmd_params['radius'] != null ) _cmd.push( "radius:"+_cmd_params['radius'] );
									else if ( _rec_chunk['radius'] != null ) _cmd.push( "radius:"+_rec_chunk['radius'] );

									if ( _cmd_params['fillcolor'] != null ) _cmd.push( "fillcolor:"+_cmd_params['fillcolor'] );
									else if ( _rec_chunk['fillcolor'] != null ) _cmd.push( "fillcolor:"+_rec_chunk['fillcolor'] );

									if ( _cmd_params['bordercolor'] != null ) _cmd.push( "bordercolor:"+_cmd_params['bordercolor'] );
									else if ( _rec_chunk['bordercolor'] != null ) _cmd.push( "bordercolor:"+_rec_chunk['bordercolor'] );
									
									if ( _cmd_params['bordersize'] != null ) _cmd.push( "bordersize:"+_cmd_params['bordersize'] );
									else if ( _rec_chunk['bordersize'] != null ) _cmd.push( "bordersize:"+_rec_chunk['bordersize'] );

									circles_lib_terminal_interpreter( "point "+( _cmd.join(" ") ), _glob_terminal, _out_channel );
									if ( _b_drop ) _drop_ids.push( _zerobased_index );
								break ;
								case FIGURE_CLASS_POLYGON:
								var _pts = _rec_chunk['obj'] ;
								var _cmd = [] ;
									_pts.forEach( function( _pt ){ if ( is_point( _pt ) ) _cmd.push( _pt.output("cartesian") ) ; } ) ;
									if ( _rec ) _cmd.push( "rec" );
									if ( _rec_chunk['planedef'] != null ) _cmd.push( _rec_chunk['planedef'] );
									if ( _rec_chunk['layer'] != null ) _cmd.push( "layer:"+_rec_chunk['layer'] );

									if ( _cmd_params['fillcolor'] != null ) _cmd.push( "fillcolor:"+_cmd_params['fillcolor'] );
									else if ( _rec_chunk['fillcolor'] != null ) _cmd.push( "fillcolor:"+_rec_chunk['fillcolor'] );

									if ( _cmd_params['bordercolor'] != null ) _cmd.push( "bordercolor:"+_cmd_params['bordercolor'] );
									else if ( _rec_chunk['bordercolor'] != null ) _cmd.push( "bordercolor:"+_rec_chunk['bordercolor'] );
									
									if ( _cmd_params['bordersize'] != null ) _cmd.push( "bordersize:"+_cmd_params['bordersize'] );
									else if ( _rec_chunk['bordersize'] != null ) _cmd.push( "bordersize:"+_rec_chunk['bordersize'] );

									circles_lib_terminal_interpreter( "point "+( _cmd.join(" ") ), _glob_terminal, _out_channel );
									if ( _b_drop ) _drop_ids.push( _zerobased_index );
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
					
					if( !_b_fail && _drop_ids.length > 0 && _b_drop )
					{
						_drop_ids.sort( function( _a, _b ){ return _b - _a ; } ) ; // descending order to remove index safely
						_drop_ids.forEach( function( _i ){
							var _class_def = _figures_cmd_get_class_def( _glob_figures_array[_i]['class'] ) ;
							_glob_figures_array.remove( _i, _i ) ;
							circles_lib_output( _out_channel, DISPATCH_INFO, _class_def+" @"+(_i+1)+" removed with success", _par_1, _cmd_tag );
							} ) ;
					}

					if ( !_b_fail && _rec ) circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
				}
				break ;
                case "delete":
                case "disable":
                case "enable":
                case "transfer":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
                else if ( _n_input_index == 0 && !_all ) { _b_fail = YES, _error_str = "Fail to "+_action+" : missing input indexes" ; }
                else
                {
					var _params_array = [] ;
					_params_array['prepromptquestion'] = null ;
					_params_array['promptquestion'] = "Confirm to "+_action+" "+( _all == 0 ? ( _n_input_index+" input entr" + ( _n_input_index != 1 ? "ies" : "y" ) ) : "all entries" ) +"? ";
					_params_array['yes_fn'] = function()
					{
						var _ret_chunk = circles_lib_figures_action( _out_channel, _action, _cmd_params['figures_ref'], _cmd_params['plane'], YES, _par_1, _cmd_tag );
						_b_fail = _ret_chunk[0], _error_str = _ret_chunk[1] ;
					}
					_params_array['ifquestiondisabled_fn'] = function()
					{
						var _ret_chunk = circles_lib_figures_action( _out_channel, _action, _cmd_params['figures_ref'], _cmd_params['plane'], YES, _par_1, _cmd_tag );
						_b_fail = _ret_chunk[0], _error_str = _ret_chunk[1] ;
					}
					if ( !_glob_terminal_echo_flag || _cmd_params["silent"] ) _params_array['yes_fn'].call(this);
					else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                }
                break ;
				case "isolate":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
                else if ( _n_input_index > 0 || _all )
				{
					var _figures_ref = _all ? _glob_figures_array : _cmd_params['figures_ref'] ;
					var _permanent = _cmd_params['permanent'] != null ? 1 : 0 ;
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
							if ( _cmd_params['plane'].is_one_of( NO_PLANE, ALL_PLANES, _rec_chunk['plane'] ) )
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
						circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lime>Temporary graphic isolation performed with success for figures</lime> <white>"+_pts_idx_array.join( ", " )+"</white>", _par_1, _cmd_tag );
						circles_lib_canvas_afterrender_figures_draw( [], YES, ALL_PLANES );

						if ( _permanent )
						{
							_glob_figures_array.forEach( function( _rec_chunk ){
								var _idx = safe_int( _rec_chunk['myhash'].replace( /^rec/g, "" ), -1 ) ;
								if ( _unflagged.includes( _idx+1 ) ) _glob_figures_array[_idx]['enabled'] = 1 ;
							} );
							circles_lib_output( _out_channel, DISPATCH_INFO, "Permament flag is on: visibility for hidden elements has been restored after visualization", _par_1, _cmd_tag );
						}
						else circles_lib_output( _out_channel, DISPATCH_INFO, "Permament flag is off: visibility for hidden elements has not been restored after visualization", _par_1, _cmd_tag );
					}
				}
				break
                case "list":
				var _n_figures = safe_size( _glob_figures_array, 0 ), _row ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
                else
                {
                    var _reverse = _cmd_params['reverse'] ;
                    _row = "Found <yellow>"+_n_figures+"</yellow> element" + ( _n_figures == 1 ? "" : "s" ) + ( _reverse ? " - Reverse list" : "" );
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                    var _counter = 1 ;
                    for( var _i = ( _reverse ? _n_figures - YES : NO ); _reverse ? _i >= 0 : _i < _n_figures ; _reverse ? _i-- : _i++ )
                    {
                        _row = _figures_cmd_display_list_item( _counter, _glob_figures_array[_i], _cmd_params );
                        _counter++ ;
                        if ( safe_size( _row, 0 ) > 0 )
                        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                        else 
                        circles_lib_output( _out_channel, DISPATCH_ERROR, "Fail to display figure item indexed at "+(_i+1), _par_1, _cmd_tag );
                    }
                }
                break ;
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "rebuild":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
                else
                {
                    // rebuild hash tags after previous deletion
                    circles_lib_output( _out_channel, DISPATCH_INFO, "Rebuilding the hash table", _par_1, _cmd_tag );
                    _b_fail = !circles_lib_figures_rehash();
                    if ( !_b_fail )
                    circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Hash table has been rebuilt with success", _par_1, _cmd_tag );
                }
                break;
                case "render":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
				else
				{
					if ( _cmd_params['plane'] == NO_PLANE ) _cmd_params['plane'] = ALL_PLANES ;
					var _plane_def = circles_lib_plane_def_get( _cmd_params['plane'] ) ;
					circles_lib_canvas_afterrender_figures_draw( [], YES, _cmd_params['plane'] );
					circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Rendering the figures list on "+_plane_def, _par_1, _cmd_tag );
				}
                break ;
				case "rotate":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
				else if ( _cmd_params['center'] == null ) { _b_fail = YES ; _error_str = "Missing rotation center" ; }
				else if ( _cmd_params['rotationangle'] == null ) { _b_fail = YES ; _error_str = "Missing rotation angle" ; }
                else if ( _n_input_index == 0 && !_all ) { _b_fail = YES, _error_str = "Missing input indexes" ; }
				else
				{
					var _rec = _cmd_params['rec'], _center = _cmd_params['center'] ;
					var _rot_angle = _cmd_params['rotationangle'] ;
					var _figures_ref = _all ? _glob_figures_array : _cmd_params['figures_ref'] ;
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
								circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Figure @"+_virtual_index+" has been rotated and cloned with success", _par_1, _cmd_tag );
							}
							else
							{
								if ( _class == FIGURE_CLASS_RECT ) _class = FIGURE_CLASS_POLYGON ;
								_glob_figures_array[_zerobased_index]['obj'] = _new_obj.clone() ;
								_glob_figures_array[_zerobased_index]['class'] = _class ;
								circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Figure @"+_virtual_index+" has been rotated with success", _par_1, _cmd_tag );
							}
						}
					}

					if ( !_b_fail ) circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
				}	
				break ;
                case "shift":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
                else if ( _n_input_index == 0 && !_all ) { _b_fail = YES, _error_str = "Missing input indexes" ; }
                else
                {
					var _shift_pt = _cmd_params['shift_pt'], _figure_label = "", _layer = null ;
					var _figures_ref = _all ? _glob_figures_array : _cmd_params['figures_ref'] ;
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
								circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Shifting "+_rec_label+" @"+_virtual_index+" performed with success", _par_1, _cmd_tag );
							}
                        }
                        else { _b_fail = YES, _error_str = "Memory failure: no figure indexed @"+_virtual_index ; }
                    }
					
					if ( !_b_fail ) circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
                }
                break;
                case "swap":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
                else if ( _n_input_index != 2 ) { _b_fail = YES, _error_str = "Swap failure: 2 indexes are required" ; }
                else
                {
					var _figs = _glob_figures_array ;
                    var _index_1 = _cmd_params['figures_ref'][0] - 1, _index_2 = _cmd_params['figures_ref'][1] - 1 ; // zerobased idx conversion
					if ( _figs[ _index_1 ] != null && _figs[ _index_2 ] != null )
					{
						[ _figs[ _index_2 ], _figs[ _index_1 ] ] = [ _figs[ _index_1 ], _figs[ _index_2 ] ] ;
					}
					else if ( _figs[ _index_1 ] == null ) { _b_fail = YES, _error_str = "Swap failure: index #"+(_index_1+1)+" does not refer to any archive item" ; }
					else if ( _figs[ _index_2 ] == null ) { _b_fail = YES, _error_str = "Swap failure: index #"+(_index_2+1)+" does not refer to any archive item" ; }
                    else { _b_fail = YES, _error_str = "Swap failure: input indexes do not refer to consistent entries in the archive" ; }

					if ( !_b_fail )
					{
						circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Swap performed with success", _par_1, _cmd_tag );
						circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
					}
                }
                break ;
                case "update":
				var _n_figures = safe_size( _glob_figures_array, 0 ) ;
				if ( _n_figures == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to perform "+_action+" action: the list of recorded figures is empty ", _par_1, _cmd_tag );
                else if ( _n_input_index == 0 && !_all ) { _b_fail = YES, _error_str = "Fail to update: missing input index" ; }
                else
				{
					circles_lib_figures_update_manager( _out_channel, _cmd_params['update_props'] );
					circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Properties have been updated with success", _par_1, _cmd_tag );
					circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
				}
                break ;
			    default: _b_fail = YES, _error_str = "Unknown action '"+_action+"'" ; break ;
            }
    }

    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
		circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function _figures_cmd_get_class_def( _cls = FIGURES_CLASS_NONE )
{
	switch( _cls )
	{
		case FIGURE_CLASS_CIRCLE: return "circle" ; break ;
		case FIGURE_CLASS_POLYGON: return "polygon" ; break ;
		case FIGURE_CLASS_LINE: return "line" ; break ;
		case FIGURE_CLASS_POINT: return "point" ; break ;
		case FIGURE_CLASS_RECT: return "rectangle" ; break ;
		default: return "unknown figure" ; break ;
	}
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