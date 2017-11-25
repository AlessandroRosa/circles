_glob_terminal_cmd_files_include[ "disk" ] = [ "init", "refresh" ] ;

function circles_terminal_cmd_disk()
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
    var _b_fail = 0, _cnt = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _symbols_array = [] ;
    var _inv_symbols_array = [] ;
    var _rotation_degree = 0, _rotation_radians = 0 ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _params_assoc_array = [];

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
        _params_assoc_array['settings'] = [] ;
        _params_assoc_array['settings']['params'] = [] ;
        _params_assoc_array['settings']['action'] = "" ;

        _params_assoc_array['all'] = NO ;
        _params_assoc_array['center'] = null ;
        _params_assoc_array['draw'] = UNDET ;
        _params_assoc_array['drawcolor'] = null ;
        _params_assoc_array['dump'] = NO ;
        _params_assoc_array['dump_array'] = null ;
        _params_assoc_array['dump_operator_index'] = UNDET ;
        _params_assoc_array['dx'] = null ;
        _params_assoc_array['dy'] = null ;
        _params_assoc_array['extras'] = [] ;
        _params_assoc_array['fill'] = UNDET ;
        _params_assoc_array['fillcolor'] = null ;
        _params_assoc_array['help'] = NO ;
        _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
        _params_assoc_array['keywords'] = NO ;
        _params_assoc_array['index'] = null ;
        _params_assoc_array['inv_symbol'] = null ;
        _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
        _params_assoc_array['symbol'] = null ;
        _params_assoc_array['linewidth'] = null ;
        _params_assoc_array['mirrorx'] = null ;
        _params_assoc_array['mirrory'] = null ;
        _params_assoc_array['off'] = NO ;
        _params_assoc_array['on'] = NO ;
        _params_assoc_array['properties'] = [] ;
        _params_assoc_array['radius'] = null ;
        _params_assoc_array['rotate'] = 0 ;
        _params_assoc_array['roundto'] = _glob_accuracy ;
        _params_assoc_array['settings']['storagequeue'] = [] ;
        _params_assoc_array['settings']['storagesubset'] = "seeds" ;
        _params_assoc_array['table'] = 0 ;
        _params_assoc_array['x'] = null ;
        _params_assoc_array['y'] = null ;
        _params_assoc_array['notesflag'] = NO ;
        _params_assoc_array['notes'] = [] ;

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); 
        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [];
    	_local_cmds_params_array.push( "add", "attr", "coords", "changesymbol", "changeinvsymbol", "check", "copy",
                                       "delete", "find", "fill", "nofill", "draw", "nodraw", "table", "off", "on",
                                       "intersect", "symbol", "list", "mirror", "move", "notes", "select", "html", "help",
                                       "disabled", "area", "center", "circumference", "curvature", "diameter", "pair", "set",
                                       "radius", "mirror", "update", "rotate", "round", "plot", "release", "seeds", "generators",
                                       "colorize" );
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

        var _p ;
        // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
        var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
        for( var _i = 0 ; _i < _up_to_index ; _i++ )
        {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.stricmp( "seeds" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
            else if ( _p.stricmp( "generators" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_GENS ;
            else if ( _p.is_one_of_i( "storagein" ) ) _params_assoc_array['settings']['params'].push( _p ) ;
            else if ( _params_assoc_array['settings']['params'].includes( "storagein" ) &&
                      ( is_array( _glob_storage[ _p ] ) || _p.testME( _glob_storage_key_regex_pattern ) ) )
					_params_assoc_array['settings']['storagesubset'] = _p ;
            else if ( _p.stricmp( "all" ) ) _params_assoc_array['all'] = YES ;
            else if ( _p.stricmp( "fill" ) ) _params_assoc_array['fill'] = YES ;
            else if ( _p.stricmp( "nofill" ) ) _params_assoc_array['fill'] = NO ;
            else if ( _p.stricmp( "draw" ) ) _params_assoc_array['draw'] = YES ;
            else if ( _p.stricmp( "nodraw" ) ) _params_assoc_array['draw'] = NO ;
            else if ( _p.stricmp( "table" ) ) _params_assoc_array['table'] = YES ;
            else if ( _p.stricmp( "off" ) ) _params_assoc_array['off'] = YES ;
            else if ( _p.stricmp( "on" ) ) _params_assoc_array['on'] = YES ;
            else if ( _p.is_one_of_i( "generators", "seeds" ) ) _params_assoc_array['settings']['params'].push( _p ) ;
            else if ( _p.is_one_of_i( "add", "changesymbol", "changeinvsymbol", "check", "colorize", "decolorize", "copy", "delete", "find",
                                      "intersect", "symbol", "list", "mirror", "move", "notes", "pair", "select", "release",
                                      "rotate", "update" ) )
					_params_assoc_array['settings']['action'] = _p.toLowerCase();
            else if ( _p.is_one_of_i( "area", "center", "circumference", "curvature", "diameter", "radius" ) )
                    _params_assoc_array['properties'].push( _p.toLowerCase() );
            else if ( _p.is_one_of_i( "attr", "coords", "set" ) )
					_params_assoc_array['extras'].push( _p.toLowerCase() );
            else if ( ( ( _p.length == 1 && _p.isAlpha() ) || _p.isNumber() )
                        && !( _params_assoc_array['settings']['action'].stricmp( "notes" ) ) )
            {
                _symbols_array.push( _p );
                if ( _params_assoc_array['settings']['action'].is_one_of_i( "add" )
                     ||
                     _params_assoc_array['properties'].one_in( "area", "radius" ) )
                {
                    if ( !is_string( _inv_symbols_array[0] ) ) _inv_symbols_array.push( _p );
                }
            }
            else if ( _p.toLowerCase().stricmp( "auto" ) ) _symbols_array.push( _p );
            else if ( _p.toLowerCase().start_with( "notes:" ) )
            {
                _p = safe_string( _p.replaceAll( "notes:", "" ), "" ) ;
                _params_assoc_array['notes'].push( _p ) ;
                _params_assoc_array['notesflag'] = YES ;
                _params_assoc_array['settings']['action'] = "notes" ;
            }
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
            else if ( _p.toLowerCase().start_with( "deg:" ) )
                 _rotation_degree = safe_float( _p.replaceAll( "deg:", "" ), 0 );
            else if ( _p.toLowerCase().start_with( "rad:" ) )
                 _rotation_radians = safe_float( _p.replaceAll( "rad:", "" ), 0 );
			else if ( _p.toLowerCase().start_with( "drawcolor:" ) && _params_assoc_array['drawcolor'] == null )
			{
				_params_assoc_array['drawcolor'] = safe_string( _p.replace( /drawcolor:/gi, "" ), "" ) ;
				if ( circles_lib_colors_is_def( _params_assoc_array['drawcolor'] ) )
				{
					_params_assoc_array['draw'] = _params_assoc_array['drawcolor'].stricmp("transparent") ? 0 : 1 ;
					_msg = "<lightblue>Draw color has been set to</lightblue> <snow>"+_params_assoc_array['drawcolor']+"</snow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid draw color definition" ; break ; }
			}
			else if ( _p.toLowerCase().start_with( "fillcolor:" ) && _params_assoc_array['fillcolor'] == null )
			{
				_params_assoc_array['fillcolor'] = safe_string( _p.replace( /fillcolor:/gi, "" ), "" ) ;
				if ( circles_lib_colors_is_def( _params_assoc_array['fillcolor'] ) )
				{
					_params_assoc_array['fill'] = _params_assoc_array['fillcolor'].stricmp("transparent") ? 0 : 1 ;
					_msg = "<lightblue>Fill color has been set to</lightblue> <snow>"+_params_assoc_array['fillcolor']+"</snow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				}
				else { _b_fail = YES, _error_str = "Invalid fill color definition" ; break ; }
			}
            else if ( _p.toLowerCase().start_with( "radius:" ) )
                _params_assoc_array['radius'] = safe_float( _p.replaceAll( "radius:", "" ), 0 );
            else if ( _p.toLowerCase().start_with( "dx:" ) )
                _params_assoc_array['dx'] = safe_float( _p.replaceAll( "dx:", "" ), 0 );
            else if ( _p.toLowerCase().start_with( "dy:" ) )
                _params_assoc_array['dy'] = safe_float( _p.replaceAll( "dy:", "" ), 0 );
            else if ( _p.toLowerCase().start_with( "x:" ) )
                _params_assoc_array['x'] = safe_float( _p.replaceAll( "x:", "" ), 0 );
            else if ( _p.toLowerCase().start_with( "y:" ) )
                _params_assoc_array['y'] = safe_float( _p.replaceAll( "y:", "" ), 0 );
            else if ( _p.stricmp( "x" ) ) _params_assoc_array['mirrorx'] = 1 ;
            else if ( _p.stricmp( "y" ) ) _params_assoc_array['mirrory'] = 1 ;
            else if ( _p.toLowerCase().start_with( "linewidth:" ) )
            {
                _params_assoc_array['linewidth'] = safe_float( _p.replaceAll( "linewidth:", "" ), 0 );
                if ( _params_assoc_array['linewidth'] < 0 )
                {
                    _b_fail = YES, _error_str = "input line thickness is not a number or it is not strictly positive" ; break ;
                }
            }
            else if ( _p.toLowerCase().start_with( "center:" ) && _p.includes_i( "," ) )
            {
                var _p_array = _p.split( ":" );
                var _cmd = _p_array != null ? _p_array[0] : "" ;
                var _value = _p_array != null ? _p_array[1].replaceAll( "(", "").replaceAll( ")", "" ) : "" ;
                var _v_array = _value.split( "," );
                var _x = _v_array != null ? safe_float( _v_array[0], 0 ) : 0 ;
                var _y = _v_array != null ? safe_float( _v_array[1], 0 ) : 0 ;
                _params_assoc_array['center'] = new point(_x,_y);
            }
            else
            {
                if ( _params_assoc_array['settings']['action'].stricmp( "notes" ) && _params_assoc_array['notesflag'] )
                _params_assoc_array['notes'].push( _p ) ;
                else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
            }
        }

        var _action = _params_assoc_array['settings']['action'] ;
        var _storage_queue_request = _params_assoc_array['settings']['params'].includes_i( "storagein" ) ? YES : NO ;
        var _items_array = _params_assoc_array["item"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
        var _dest_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
        var _category_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
		var _items_n = circles_lib_count_items( _items_array );
        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Working on the current group of</lightgray> <white>"+_dest_ref+"</white>", _par_1, _cmd_tag );

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
        else if ( _params_assoc_array['settings']['action'].length == 0 && _params_assoc_array['properties'].length == 0 )
        {
            _b_fail = YES, _error_str = "Missing action or property" ;
        }
        else if ( !_b_fail )
        {
            // convert input numbers or symbols into an array of indexes to be applied to next actions
            var _index_selection_array = [] ;
            var _all = _params_assoc_array['all'] != null ? _params_assoc_array['all'] : NO ;
            if ( _all )
            {
                if ( is_array( _symbols_array ) ) _symbols_array.flush();
                else _symbols_array = [];
                for( var _i = 0 ; _i < _items_n ; _i++ )
                {
                    ITEM = _items_array[_i] ;
                    if ( is_item_obj( ITEM ) )
                    {
                        _symbols_array.push( ITEM.symbol );
                        _index_selection_array.push( _i );
                    }
                }
            }

            if ( safe_size( _symbols_array, 0 ) > 0 )
            {
                var _candidate_index = 0 ;
                for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
                {
                    if ( _symbols_array[_i].isNumber() )
                    {
                        _candidate_index = safe_int( _symbols_array[_i], UNDET ) - 1 ;
                        if ( _candidate_index >= 0 )
                        {
                            if ( is_item_obj( _items_array[_candidate_index] ) )
                            {
                                _index_selection_array.push( _candidate_index );
                                if ( _items_array[_candidate_index].symbol > 0 )
                                _symbols_array[_i] = _items_array[_candidate_index].symbol ; // symbol is recovered from index for output messages
                            }
                        }
                    }
                    else if ( _symbols_array[_i].isAlpha() )
                    {
                        _l = circles_lib_find_item_index_by_symbol( _items_array, _symbols_array[_i] );
                        if ( _l != UNFOUND ) _index_selection_array.push( _l );
                    }
                }
                  
                _index_selection_array = _index_selection_array.unique();
            }

            var _round_to = _params_assoc_array['roundto'] ;
			var _cc_center = _params_assoc_array['center'] ;
			var _cc_radius = _params_assoc_array['radius'] ;
            var _cc = new circle( _cc_center, _cc_radius );
            if( _params_assoc_array['properties'].length > 0 )
            {
                var _symbol = "", _index, _value = 0, _complex_circle, _prop,_pr ;
                if ( !is_array( _symbols_array ) || !is_array( _symbols_array ) )
                {
                    _b_fail = YES, _error_str = "Missing input symbol(s)" ;
                }
                else
                {
                    for( var _cnt = 0 ; _cnt < _symbols_array.length ; _cnt++ )
                    {
                            _symbol = _symbols_array[_cnt] ;
                            if ( _symbol.length == 1 )
                            {
                                _index = circles_lib_find_item_index_by_symbol( _items_array, _symbol );
                                if ( _index != UNFOUND )
                                {
                                    _complex_circle = _items_array[_index].complex_circle ;
                                    if ( is_circle( _complex_circle ) )
                                    {
                                        for( _pr = 0 ; _pr < _params_assoc_array['properties'].length ; _pr++ )
                                        {
                                            _prop = _params_assoc_array['properties'][_pr] ;
                                            switch( _prop )
                                            {
                                                case "area":
                                                _value = _complex_circle.area();
                                                // implement display separately
                                                _msg = "The area of disk " + _symbol + " is " + _value ;
                                                circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
                                                break ;
                                                case "center":
                                                _value = _complex_circle.get_center();
                                                // implement display separately
                                                _msg = "The center of disk " + _symbol + " is " + _value.output( null, _round_to );
                                                circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
                                                break ;
                                                case "circumference":
                                                _value = _complex_circle.circumference();
                                                // implement display separately
                                                _msg = "The circumference of disk " + _symbol + " is " + _value ;
                                                circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
                                                break ;
                                                case "curvature":
                                                _value = _complex_circle.get_curvature();
                                                // implement display separately
                                                _msg = "The curvature of disk " + _symbol + " is " + _value ;
                                                circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
                                                break ;
                                                case "diameter":
                                                _value = _complex_circle.diameter();
                                                // implement display separately
                                                _msg = "The diameter of disk " + _symbol + " is " + _value ;
                                                circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
                                                break ;
                                                case "radius":
                                                _value = _complex_circle.get_radius();
                                                // implement display separately
                                                _msg = "<lightgray>The radius of disk " + _symbol + " is </lightgray>" + ( _value == 0 ? "<red>" : "<snow>" ) + _value + "" + ( _value == 0 ? "</red>" : "</snow>" );
                                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                                                break ;
												default: break ;
                                            }
                                        }
                                    }
                                }
                                else
								{
									circles_lib_output( _output_channel, DISPATCH_WARNING, "There exists no disk with symbol '"+_symbol+"'", _par_1, _cmd_tag );
									break ;
								}
                            }
                            else
							{
								circles_lib_output( _output_channel, DISPATCH_WARNING, "Syntax error for disk '"+_symbol+"': symbols must be one letter long", _par_1, _cmd_tag );
								break ;
							}
                    }
                }
            }

             switch( _action )
             {
                case "add" :
                var _ret_i = circles_lib_find_item_index_by_symbol( _items_array, _symbols_array[0] );
                if ( _cc_radius == null || isNaN( _cc_radius ) ) { _b_fail = YES, _error_str = "Disk radius has not been input" ; }
				else if ( _cc_radius <= 0 ) { _b_fail = YES, _error_str = "Disk radius must be strictly positive" ; }
                else if ( _cc_center == null ) { _b_fail = YES, _error_str = "Disk center coordinates are missing" ; }
                else if ( _index_selection_array.length > 1 ) { _b_fail = YES, _error_str = "Only one symbol must be input" ; }                                        
                else if ( _ret_i != UNDET )
                {
					_b_fail = YES, _error_str = "Can't add: the input disk '"+_symbols_array[0]+"' already exists" ;
                    _error_str += _glob_crlf + "Use 'update' action instead" ;
                }
                else
                {
					var _old_sd_n = circles_lib_count_items( _items_array );
                    if ( !is_array( _symbols_array ) ) _symbols_array = [];
                    if ( safe_size( _symbols_array, 0 ) == 0 )
                    {
                       _symbols_array.push( "auto" );
                       circles_lib_output( _output_channel, DISPATCH_INFO, "Missing input symbol: set to 'auto' definition", _par_1, _cmd_tag );
                    }
                    var _symbol = _symbols_array.includes_i( "auto" ) ? circles_lib_alphabet_suggest_symbol() : _symbols_array[0] ;

                    var _ret_chunk = circles_lib_complexdisk_add( _items_array, _cc, _symbol, _output_channel );
                    var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], UNDET ) : UNDET ;
                    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : [] ;
                    var _ret_last_index = is_array( _ret_chunk ) ? _ret_chunk[2] : [] ;
                    if ( _ret_id == 1 )
                    {
                        var _new_sd_n = circles_lib_count_items( _items_array );
                        if ( _new_sd_n == UNDET ) { _b_fail = YES, _error_str = "Memory failure while trying to add a new complex disk" ; }
                        else
                        {
							var _obj_index = _ret_last_index ;
                            var _last_item_obj_symbol = is_item_obj( _items_array[_obj_index] ) ? _items_array[_obj_index].symbol : "" ;
                            if ( _params_assoc_array['fill'] != UNDET ) _items_array[_obj_index].complex_circle.fill = _params_assoc_array['fill'] ;
                            if ( _params_assoc_array['draw'] != UNDET ) _items_array[_obj_index].complex_circle.draw = _params_assoc_array['draw'] ;
                            if ( _params_assoc_array['drawcolor'] != null ) _items_array[_obj_index].complex_circle.drawcolor = _params_assoc_array['drawcolor'] ;
                            if ( _params_assoc_array['fillcolor'] != null ) _items_array[_obj_index].complex_circle.fillcolor = _params_assoc_array['fillcolor'] ;
                            _items_array[_obj_index].complex_circle.linewidth = ( _params_assoc_array['linewidth'] != null ) ? _params_assoc_array['linewidth'] : 1 ;
                            if ( _new_sd_n == _old_sd_n + 1 ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The new disk '"+_last_item_obj_symbol+"' has been added", _par_1, _cmd_tag );

                            var _ret_chunk = circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _output_channel );
                            var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                            var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
                            if ( _ret_id == RET_OK )
                            {
                                if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _output_channel );
                                if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _output_channel );
                                if ( _storage_queue_request ) _params_assoc_array['settings']['storagequeue'].push( _items_array[_obj_index].copy() );
    							if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
    							{
    								_glob_terminal_change = YES ;
    							    circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
    							}
							}
							else { _b_fail = YES, _error_str = _ret_msg ; }
                        }
                    }
                    else { _b_fail = YES, _error_str = _ret_msg ; }
                }
                break ;
                case "changesymbol":
                    if ( !is_array( _symbols_array ) ) { _b_fail = YES, _error_str = "Missing input symbols" ; }
                    else if ( _symbols_array.length == 0 ) { _b_fail = YES, _error_str = "Missing input symbols" ; }
                    else if ( _symbols_array.length != 2 ) { _b_fail = YES, _error_str = "Two input symbols must be input" ; }
                    else
                    {
                       var _old_symbol = _symbols_array[0] ;
                       var _inverse_old_symbol = circles_lib_word_inverse_get( _symbols_array[0] );
                       var _new_symbol = _symbols_array[1] ;
                         
                       var _index_old = circles_lib_find_item_index_by_symbol( _items_array, _old_symbol );
                       var _inverse_index_old = circles_lib_find_item_index_by_symbol( _items_array, _inverse_old_symbol );
                       var _index_new = circles_lib_find_item_index_by_symbol( _items_array, _new_symbol );
                         
                       if ( _index_old == UNFOUND )
                       {
                          _b_fail = YES, _error_str = "Can't change: the input source symbol '"+_old_symbol+"' does not exist in the current alphabet" ;
                       }
                       else
                       {
                          _items_array[_index_old].original_word = _items_array[_index_old].symbol = _new_symbol.trim();
                          if ( is_array( _glob_alphabet ) )
                          {
                             _glob_alphabet.delete_entry( _old_symbol );
                             _glob_alphabet.delete_entry( circles_lib_word_inverse_get( _old_symbol ) );
                             _glob_alphabet.push( _new_symbol );
                             _glob_alphabet.push( circles_lib_word_inverse_get( _new_symbol ) );

                             var _MSG =  "Symbol '"+_old_symbol+"' has been changed to '"+_new_symbol+"'" ;
                             circles_lib_output( _output_channel, DISPATCH_SUCCESS, _MSG, _par_1, _cmd_tag );

                             _MSG =  "Current alphabet is : " + _glob_alphabet.join( "," );
                             circles_lib_output( _output_channel, DISPATCH_INFO, _MSG, _par_1, _cmd_tag );
                           }
                       }
                    }
                break ;
                case "changeinvsymbol":
                    if ( !is_array( _symbols_array ) ) { _b_fail = YES, _error_str = "Missing input symbols" ; }
                    else if ( _symbols_array.length == 0 ) { _b_fail = YES, _error_str = "Missing input symbols" ; }
                    else if ( _symbols_array.length != 2 ) { _b_fail = YES, _error_str = "Two input symbols must be input" ; }
                    else
                    {
                         var _old_symbol = _symbols_array[0] ;
                         var _inverse_old_symbol = circles_lib_word_inverse_get( _symbols_array[0] );
                         var _new_symbol = _symbols_array[1] ;
                         
                         var _index_old = circles_lib_find_item_index_by_symbol( _items_array, _old_symbol );
                         var _inverse_index_old = circles_lib_find_item_index_by_inverse_symbol( _items_array, _inverse_old_symbol );
                         var _index_new = circles_lib_find_item_index_by_inverse_symbol( _items_array, _new_symbol );
                         
                         if ( _index_old == UNFOUND )
                         {
                              _b_fail = YES, _error_str = "Can't change: the input source symbol '"+_old_symbol+"' does not exist in the current alphabet" ;
                         }
                         else
                         {
                            _items_array[_index_old].inverse_symbol = _new_symbol.trim();
                            if ( is_array( _glob_alphabet ) )
                            {
                                _glob_alphabet.delete_entry( circles_lib_word_inverse_get( _old_symbol ) );
                                _glob_alphabet.delete_entry( _old_symbol );
                                _glob_alphabet.push( circles_lib_word_inverse_get( _new_symbol ) );
                                _glob_alphabet.push( _new_symbol );
                                circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Inverse symbol '"+_old_symbol+"' has been changed to '"+_new_symbol+"'", _par_1, _cmd_tag );
                                circles_lib_output( _output_channel, DISPATCH_INFO, "Current alphabet is : " + _glob_alphabet.join( "," ), _par_1, _cmd_tag );
                            }
                         }
                    }
                break ;
                case "check":
                var _out_text = circles_lib_terminal_disks_check( _output_channel );
                    if ( _params_assoc_array['dump'] )
                    {
 											 _params_assoc_array['dump_array'] = is_array( _params_assoc_array['dump_array'] ) ? _params_assoc_array['dump_array'][0] : "circles.disk.check.txt" ;
											var _ret_chunk = circles_lib_dump_data_to_format( _out_text.strip_tags(), _params_assoc_array['dump_array'] );
											var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
											var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                      circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                      _out_text_string = _ret_msg ;
                    }
                break ;
				case "colorize":
           if ( _items_n > 0 )
           {
    	     		 var _params_array = [] ;
    					 _params_array['prepromptquestion'] = null ;
    					 _params_array['promptquestion'] = "Confirm to colorize all "+_dest_ref+"? " ;
    					 _params_array['yes_fn'] = function()
               {
                  var _ret_chunk = circles_lib_colors_colorize_group( _dest_ref, YES, YES, _output_channel );
                  var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
                  circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
               }
    					 _params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_colorize_group( _dest_ref, YES, YES, _output_channel ); }
     			     circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
           }
           else { _b_fail = YES, _error_str = "The list of seeds is empty" ; }
				break ;
                case "copy":
                    if ( _symbols_array.length > 0 )
                    {
												 var _array = [] ;
												 		 _array['params'] = [] ;
                         for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
                         {
                              if ( is_string( _symbols_array[_i] ) )
                              {
                                   if ( _symbols_array[_i].length == 1 )
                                   {
                                        switch( _i )
                                        {
                                            case 0:
                                            if ( _array['src'] == null ) _array['src'] = _symbols_array[_i] ;
                                            break ;                                        
                                            case 1:
                                            if ( _array['dest'] == null ) _array['dest'] = _symbols_array[_i] ;
                                            break ;
																						default: break ;                                        
                                        }
                                   }
                                   else _array['params'].push( _symbols_array[_i] );
                              }
                         }
                         
                         var _src_symbol = _array['src'], _dest_symbol = _array['dest'] ;
                         var _src_index = circles_lib_find_item_index_by_symbol( _items_array, _src_symbol );
                         var _dest_index = circles_lib_find_item_index_by_symbol( _items_array, _dest_symbol );
                         if ( _src_index == UNFOUND )
                         {
                              _b_fail = YES, _error_str = "Can't copy: there exists no source disk with symbol '"+_src_symbol+"'" ;
                         }
                         else
                         {
                              var _src_mm = circles_lib_find_item_obj_by_symbol( _items_array, _src_symbol );
                              var _dest_mm = new item_obj();
                                  _dest_mm.init_from_obj( _src_mm );
                              // config src symbols for copy object
                              _dest_mm.original_word = _dest_mm.symbol = _dest_symbol.trim();
                              _dest_mm.inverse_symbol = circles_lib_word_inverse_get( _dest_symbol );
                              if ( _dest_index == UNFOUND )
                              {
                                   if ( !_glob_alphabet.includes( _dest_symbol ) )
                                   _glob_alphabet.push( _dest_symbol.trim() );
                                   
                                   var _old_n = circles_lib_count_items( _items_array );
                                   _items_array.push( _dest_mm );
                                   var _new_n = circles_lib_count_items( _items_array );

                                   circles_lib_output( _output_channel, DISPATCH_INFO, "A new disk '"+_dest_symbol+"' has been created", _par_1, _cmd_tag );
                                   circles_lib_output( _output_channel,
                                                              ( _old_n == _new_n - 1 ) ? DISPATCH_SUCCESS : DISPATCH_ERROR,
                                                              ( _old_n == _new_n - 1 ) ? "Disk copy from '"+_src_symbol+"' to '"+_dest_symbol+"' has been performed with success" : "Disk copy from '"+_src_symbol+"' to '"+_dest_symbol+"' has failed", _par_1, _cmd_tag );
                              }
                              else
                              {
                                   _items_array[_dest_index] = _dest_mm ;
                                   circles_lib_output( _output_channel,
                                                              ( _items_array[_dest_index] != null ) ? DISPATCH_SUCCESS : DISPATCH_ERROR,
                                                              ( _items_array[_dest_index] != null ) ? "Disk copy from '"+_src_symbol+"' to '"+_dest_symbol+"' has been performed with success" : "Disk copy from '"+_src_symbol+"' to '"+_dest_symbol+"' has failed", _par_1, _cmd_tag );
                              }

                              circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _output_channel );
                              var _ret_chunk = circles_lib_items_init( null, !_glob_terminal_silent, _glob_terminal_silent, _glob_init_mask, NO, YES, _output_channel );
                              var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                              var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
                              if ( _ret_id == RET_OK )
                              {
                                  if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _output_channel );
                                  if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _output_channel );
                                  _glob_alphabet = _glob_alphabet.unique();
                              }
                              else
                              {
                                  _b_fail = YES, _error_str = _ret_msg ;
                              }
                         }
                    }
                    else if ( _symbols_array.length == 0 )
                    {
                         _b_fail = YES, _error_str = "Missing input params for disk copy" ;
                    }
                    else
                    {
                         _b_fail = YES, _error_str = "Input parameters for disk copy must be two" ;
                    }
                break ;
 			    case "decolorize":
 			    if ( _items_n > 0 )
			    {
					var _params_array = [] ;
					_params_array['prepromptquestion'] = null ;
					_params_array['promptquestion'] = "Confirm to decolorize all "+_dest_ref+"? " ;
					_params_array['yes_fn'] = function() {
					  var _ret_chunk = circles_lib_colors_decolorize( _dest_ref, YES, YES, _output_channel );
					  var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
					  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
					  circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
					}
					_params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_decolorize( _dest_ref, YES, YES, _output_channel ); }
					circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
			    }
			    else { _b_fail = YES, _error_str = "The list of seeds is empty" ; }
			    break ;
                case "delete" :
                    var _all = _params_assoc_array['all'] != null ? _params_assoc_array['all'] : NO ;
                    var _old_sd_n = _items_n ;
                    var _sel_n = safe_size( _index_selection_array, 0 );
                    var _delete_disk = function()
                    {
                        if ( _all == NO )
                        {
                            var _obj_index, _inv_obj_index, _current_symbol = "" ;
														for( var _i = 0 ; _i < _index_selection_array.length ; _i++ )
                            {
                                _obj_index = safe_int( _index_selection_array[_i], UNDET );
                                _current_symbol = ( _obj_index != UNFOUND ) ? _items_array[_obj_index].symbol : "" ;
                                if ( _obj_index != UNFOUND )
                                {
                                    _items_array.remove( _obj_index, _obj_index );
                                    circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Disk tagged '"+_current_symbol+"' has been deleted with success", _par_1, _cmd_tag );
                                }
                                else circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: there's no disk with symbol '"+_current_symbol+"' or index "+_index_selection_array+"", _par_1, _cmd_tag );

                                _inv_obj_index = circles_lib_find_item_index_by_inverse_symbol( _items_array, _current_symbol.trim() );
                                _current_symbol = ( _inv_obj_index != UNFOUND ) ? _items_array[_inv_obj_index].symbol : "" ;

                                if ( _inv_obj_index != UNFOUND )
                                {
                                    _items_array.remove( _inv_obj_index, _inv_obj_index );
                                    circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Disk tagged '"+_current_symbol+"' has been deleted with success", _par_1, _cmd_tag );
                                }
                                else circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: there's no disk with symbol '"+_current_symbol+"' or index "+_index_selection_array+"", _par_1, _cmd_tag );
                            }
                        }
                        else if ( _all == YES ) _items_array.flush();

                        var _new_sd_n = circles_lib_count_items( _items_array );
                        if ( _new_sd_n > 0 && _new_sd_n == ( _old_sd_n - _sel_n ) )
                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, ( _sel_n == 1 ) ? "Disk '"+_symbols_array.join( "," )+"' has been deleted" : "Disks '"+_symbols_array.join( "," )+"' have been deleted", _par_1, _cmd_tag );
                        if ( _new_sd_n == 0 )
                        {
                            if ( _all ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "All disks have been deleted", _par_1, _cmd_tag );
                            circles_lib_output( _output_channel, DISPATCH_WARNING, "The disks list is now empty", _par_1, _cmd_tag );
                            if ( !_glob_terminal_autorefresh )
                            circles_lib_output( _output_channel, DISPATCH_INFO, "Refresh Z-plane for deletion to take effect", _par_1, _cmd_tag );
                        }
                        
                        circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _output_channel );
                        var _ret_chunk = circles_lib_items_init( null, !_glob_terminal_silent, _glob_terminal_silent, _glob_init_mask, NO, YES, _output_channel );
                        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
                        if ( _ret_id == RET_OK )
                        {
                            if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _output_channel );
                            if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _output_channel );
    					              if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
    					  						{
    														_glob_terminal_change = YES ;
    						                circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
    												}
                        }
                        else
                        {
                            _b_fail = YES, _error_str = _ret_msg ;
                        }
                    }
                    
                    if ( _sel_n == 0 && _all == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: no group element matches the input selection", _par_1, _cmd_tag );
                    else if ( _glob_terminal_silent ) _delete_disk();
                    else if ( is_array( _items_array ) )
                    {
								     		var _params_array = [] ;
										     	  _params_array['prepromptquestion'] = null ;
							     		 			_params_array['promptquestion'] = "Confirm to delete "+( ( _sel_n == 1 && _all == 0 ) ? "this disk and the one of the related inverse group element" : ( ( _all ) ? "all disks" : "these disks and the ones of the related inverse group elements" ) )+"? " ;
											     	_params_array['yes_fn'] = function() { _delete_disk(); }
											     	_params_array['ifquestiondisabled_fn'] = function() { _delete_disk(); }
										    circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                    }
                    else
                    {
                        _b_fail = YES, _error_str = "Memory failure: can't get current disks" ;
                    }
                break ;
                case "find":
                    var ITEM = null, _b_found = NO, a = [], _sel ;
                    if ( _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ) _glob_zplane_selected_items_array = [];
                    circles_lib_helper_div_remove();
                    for( var _i = 0 ; _i < _index_selection_array.length ; _i++ )
                    {
                         _sel = _index_selection_array[_i], ITEM = _items_array[ _sel ] ;
                         if ( is_item_obj( ITEM ) )
                         {
                              circle_terminal_cmd_display_disk_item( ITEM, _sel, _glob_terminal_out_stream, _params_assoc_array );                             
                              _glob_zplane_selected_items_array.push( _sel );
                              _b_found |= YES ;
                         }
                    }

                    if ( _glob_zplane_selected_items_array.length > 0 && _b_found )
                    {
                        var _layer_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );
                        var _ret_chunk = circles_lib_canvas_render_zplane( _layer_placeholder, zplane_sm, null, YES, YES, YES, NO, YES, _output_channel );
											  var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
 												var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                        circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                    }
                    else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't find the required map(s)", _par_1, _cmd_tag );
                break ;
                case "intersect" :
                if ( _symbols_array.length > 0 )
                    {
                         // spread input values into an associative array for distinguish data type
                         var _array = [];
                             _array['params'] = [] ;
                         for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
                         {
                              if ( is_string( _symbols_array[_i] ) )
                              {
                                   if ( _symbols_array[_i].length == 1 )
                                   {
                                        switch( _i )
                                        {
                                            case 0:
                                            if ( _array['src'] == null ) _array['src'] = _symbols_array[_i] ;
                                            break ;                                        
                                            case 1:
                                            if ( _array['dest'] == null ) _array['dest'] = _symbols_array[_i] ;
                                            break ;                                        
                                        }
                                   }
                                   else _array['params'].push( _symbols_array[_i] );
                              }
                         }

                         var _src_symbol = _array['src'], _dest_symbol = _array['dest'] ;
                         var _src_index = circles_lib_find_item_index_by_symbol( _items_array, _src_symbol );
                         var _dest_index = circles_lib_find_item_index_by_symbol( _items_array, _dest_symbol );
                         if ( _src_index == UNFOUND && _dest_index == UNFOUND )
                              circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't intersect: both input disks do not exist", _par_1, _cmd_tag );
                         else if ( _src_index == _dest_index )
                              circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't intersect: input disks match", _par_1, _cmd_tag );
                         else if ( _src_index == UNFOUND || _dest_index == UNFOUND )
                         {
                              _b_fail = YES ;
                              var _l = [] ;
                              if ( _src_index == UNFOUND ) _l.push( _src_symbol );
                              if ( _dest_index == UNFOUND ) _l.push( _dest_symbol );
                              _error_str = "Can't intersect: the following items"+( ( _l.length == 1 ) ? " is " : "s are " )+" missing: "+_l.join(",")+"" ;
                         }
                         else
                         {
                              var _src_mm = circles_lib_find_item_obj_by_symbol( _items_array, _src_symbol );
                              var _dest_mm = circles_lib_find_item_obj_by_symbol( _items_array, _dest_symbol );
                              var _src_circle = _src_mm.complex_circle, _dest_circle = _dest_mm.complex_circle ;
                              var _p, _canvas, _opacity, _context ;
                              if ( _src_circle != null || _dest_circle != null )
                              {
                                   var _ret_chunk = _src_circle.intersection( _dest_circle );
                                   var _ret_n = safe_int( _ret_chunk['n'], 0 );
                                   var _ret_pt1 = _ret_chunk['pt1'], _ret_pt2 = _ret_chunk['pt2'] ;
                                   
                                   if ( _ret_n == 0 )
                                       circles_lib_output( _output_channel, DISPATCH_WARNING, "No intersection points found", _par_1, _cmd_tag );
                                   else
                                   {
                                       circles_lib_output( _output_channel, DISPATCH_INFO, _ret_n + " intersection point" + ( _ret_n == 1 ? "" : "s" ) + " found", _par_1, _cmd_tag );
                                       if ( _ret_pt1 != null )
                                       circles_lib_output( _output_channel, DISPATCH_INFO, "Intersection point #1: " + _ret_pt1.output("cartesian",_round_to), _par_1, _cmd_tag );
                                       if ( _ret_pt2 != null && _ret_n == 2 )
                                       circles_lib_output( _output_channel, DISPATCH_INFO, "Intersection point #2: " + _ret_pt2.output("cartesian",_round_to), _par_1, _cmd_tag );
                                   }

                                   for( var _p = 0 ; _p < _array['params'].length ; _p++ )
                                   {
                                        switch( _array['params'][_p] )
                                        {
                                            case "plot":
                                            _canvas = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_WORK );
                                            _opacity = $("#"+_canvas.get_iddiv() ).css( "opacity" );
                                            _context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
                                            if ( _ret_pt1 != null )
                                            circles_lib_draw_point( _context, zplane_sm, _ret_pt1.x, _ret_pt1.y, YES, _glob_pt_border_color, YES, _glob_pt_interior_color, _glob_pt_border, _glob_pt_radius, _opacity );
                                            if ( _ret_pt2 != null )
                                            circles_lib_draw_point( _context, zplane_sm, _ret_pt2.x, _ret_pt2.y, YES, _glob_pt_border_color, YES, _glob_pt_interior_color, _glob_pt_border, _glob_pt_radius, _opacity );
                                            break ;
                                        }
                                   }
                              }
                              else
                              {
                                  _b_fail = YES ;
                                  var _l = [] ;
                                  if ( _src_circle == null ) _l.push( _src_symbol );
                                  if ( _dest_circle == null ) _l.push( _dest_symbol );
                                  _error_str = "Can't intersect: the following disk"+( ( _l.length == 1 ) ? " is " : "s are " )+" have not been defined: "+_l.join(",")+"" ;
                              }
                         }
                    }
                    else if ( _symbols_array.length == 0 )
                    {
                         _b_fail = YES, _error_str = "Missing input params for disk intersection" ;
                    }
                    else
                    {
                         _b_fail = YES, _error_str = "Input parameters for disk intersection must be two" ;
                    }
                break ;
                case "list" :
                    var _html = _params_assoc_array['html'] ;
                    if ( _items_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "The "+_dest_ref+" list is empty", _par_1, _cmd_tag );
                    else if ( _items_n > 0 && is_array( _items_array ) )
                    {
                        var _selected_symbol = _params_assoc_array['symbol'] ;
                        var _selected_index = safe_int( _params_assoc_array['index'], UNDET );
                        _selected_index-- ; // index input starts from 1, whereas arrays are indexed at 0
                        circles_lib_output( _output_channel, DISPATCH_STANDARD, "Retrieving the disks list ...", _par_1, _cmd_tag );
                        var _out_file_txt = "" ;
                    
                        if ( _params_assoc_array['table'] )
                        {
                            var _out_string = ( new String( "Symbol" ) ).lpad( " ", 8 );
                            _out_string += ( new String( "Inverse" ) ).lpad( " ", 10 );
                            _out_string += ( new String( "Center (x)" ) ).lpad( " ", _glob_accuracy + 1 );
                            _out_string += ( new String( "Center (y)" ) ).lpad( " ", _glob_accuracy + 1 );
                            _out_string += ( new String( "Radius" ) ).lpad( " ", _glob_accuracy + 1 );
                            _out_file_txt += _out_string + _glob_crlf ;
                            circles_lib_output( _output_channel, DISPATCH_STANDARD, _out_string, _par_1, _cmd_tag );
                        }

												var ITEM, _row, _exists, _print, _n_display ;
                        for( var _i = 0 ; _i < _items_n ; _i++ )
                        {
                             ITEM = _items_array[_i] ;
                             _exists = is_item_obj( ITEM ) ? YES : NO ;
                             if ( _exists )
                             {
                                 _print = ( _symbols_array.length == 0 || ( _symbols_array.length > 0 && _symbols_array.includes( ITEM.symbol ) ) ) ? YES : NO ;
                                 if ( _print )
                                 {
                                     _row = is_item_obj( ITEM ) ? circle_terminal_cmd_display_disk_item( ITEM, _i, _output_channel, _params_assoc_array ) : "null disk" ;
                                     _out_file_txt += _row + _glob_crlf ;
                                     _n_display++ ;
                                     if ( _output_channel == OUTPUT_SCRIPT && _params_assoc_array['dump'] )
                                     circles_lib_output( _output_channel, DISPATCH_INFO, _row, _par_1, _cmd_tag );
                                 }
                             }
                             else
                             {
                                 _row = "Memory leak: detected null map at place " + _i ;
                                 circles_lib_output( _output_channel, DISPATCH_WARNING, _row, _par_1, _cmd_tag );
                             }
                        }

                        if ( _n_display == 0 ) _out_file_text += "No maps match the input filters" ;

                        if ( _html ) circles_lib_terminal_color_decode_htmltext( "<gray>" + _out_file_txt + "</gray>", 'bip', 'right', 'top' );
                        else if ( _params_assoc_array['dump'] )
                        {
		 											  _params_assoc_array['dump_array'] = is_array( _params_assoc_array['dump_array'] ) ? _params_assoc_array['dump_array'][0] : "circles.disk.list.txt" ;
														var _ret_chunk = circles_lib_dump_data_to_format( _out_file_txt.strip_tags(), _params_assoc_array['dump_array'], "savepix" );
														var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
														var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "" ;
														circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                        }

                        _out_text_string = _out_file_txt ;
                    }
                    else
                    {
                        _b_fail = YES, _error_str = "Memory failure: can't get current items" ;
                    }
                break ;
                case "mirror":
                    var _selected_symbol = "" ;
                    for( var _l = 0 ; _l < _symbols_array.length ; _l++ )
                    {
                         if ( _symbols_array[_l].stricmp( "x" ) )
                         {
                             _params_assoc_array['mirrorx'] = YES ;
                             _symbols_array.remove( _l, _l );
                             _l = -1 ;
                         }
                         else if ( _symbols_array[_l].stricmp( "y" ) )
                         {
                             _params_assoc_array['mirrory'] = YES ;
                             _symbols_array.remove( _l, _l );
                             _l = -1 ;
                         }
                    }

                    var _search_index = UNDET, _old_obj, ITEM, _mirror_x, _mirror_y, _old_symbol, _new_symbol ;
                    for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
                    {
                        _search_index = circles_lib_find_item_index_by_symbol( _items_array, _symbols_array[_i] );
                        if ( _search_index != UNFOUND && is_array( _items_array ) )
                        {
                            _old_obj = _items_array[_search_index] ;
                            ITEM = clone(_old_obj);
                            if ( is_item_obj( ITEM ) )
                            {
                                _mirror_x = _params_assoc_array['mirrorx'], _mirror_y = _params_assoc_array['mirrory'] ;
                                if ( _mirror_x == 1 ) ITEM.complex_circle.center.x = -( ITEM.complex_circle.center.x );
                                if ( _mirror_y == 1 ) ITEM.complex_circle.center.y = -( ITEM.complex_circle.center.y );
                                    
                                _old_symbol = ITEM.symbol, _new_symbol = circles_lib_alphabet_suggest_symbol();
                                ITEM.original_word = ITEM.symbol = _new_symbol ;
                                ITEM.inverse_symbol = circles_lib_alphabet_suggest_inverse_symbol( _new_symbol );
                                    
                                _items_array.push( ITEM );
                                circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Disk '"+_old_symbol+"' mirrored to '"+_new_symbol+"' with success", _par_1, _cmd_tag );
                                circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _output_channel );
                                if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _output_channel );
                                if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _output_channel );
    							              if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
    							  						{
    																_glob_terminal_change = YES ;
    								                circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
    														}
                            }
                            else
                            {
                                _b_fail = YES, _error_str = "Can't mirror: memory failure" ;
                            }
                        }
                        else if ( _search_index == UNFOUND )
                        {
                            _b_fail = YES, _error_str = "Can't mirror: no such element is found" ;
                        }
                        else if ( !is_array( _items_array ) )
                        {
                            _b_fail = YES, _error_str = "Memory failure: can't get current items" ;
                        }
                    }
                break ;
                case "move":
                    if ( _index_selection_array.length > 0 && is_array( _items_array ) )
                    {
                        var _obj_index, _msg, _symbol, _ret_chunk, _ret_id, _ret_msg ;
												for( var _i = 0 ; _i < _index_selection_array.length ; _i++ )
                        {
                            _obj_index = _index_selection_array[_i] ;
                            if ( _params_assoc_array['center'] != null )
                            {
                               _items_array[_obj_index].complex_circle.center = _params_assoc_array['center'] ;
                               _msg = "Disk '"+_symbol+"' is now centered at " + _items_array[_obj_index].complex_circle.center.output(null,_round_to);
                               circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                            }
                            else if ( _params_assoc_array['dx'] != null ||
                                      _params_assoc_array['dy'] != null )
                            {
                               _symbol = _items_array[_obj_index].symbol ;
                               if ( _params_assoc_array['dx'] != null ) _items_array[_obj_index].complex_circle.center.x += _params_assoc_array['dx'] ;
                               if ( _params_assoc_array['dy'] != null ) _items_array[_obj_index].complex_circle.center.y += _params_assoc_array['dy'] ;
                                     
                               _msg = "Disk '"+_symbol+"' has been moved by " ;
                               if ( _params_assoc_array['dx'] != null ) _msg += "dx:" + _params_assoc_array['dx'] ;
                               if ( _params_assoc_array['dy'] != null ) _msg += "dy:" + _params_assoc_array['dy'] ;
                                     
                               circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                            }
                            else circles_lib_output( _output_channel, DISPATCH_ERROR, "Can't move the chosen element: please check parameters syntax", _par_1, _cmd_tag );
    
                            _ret_chunk = circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _output_channel );
        										_ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
         										_ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                            if ( _ret_id )
                            {
                               if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _output_channel );
                               if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _output_channel );
                            }
                            else
                            {
                               _b_fail = YES, _error_str = _ret_msg ;
                            }

                            if ( _storage_queue_request )
                            _params_assoc_array['settings']['storagequeue'].push( _items_array[_obj_index].copy() );
                        }
                        
					              if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
					  						{
														_glob_terminal_change = YES ;
						                circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
												}
                    }
                    else if ( !is_array( _items_array ) )
                    {
                        _b_fail = YES, _error_str = "Memory failure: can't get current items" ;
                    }
                    else circles_lib_output( _output_channel, DISPATCH_WARNING, "No items moved because none matches the selection parameter", _par_1, _cmd_tag );
                break ;
                case "notes":
                    var _array = null, _msg = "" ;
                    var _symbol = safe_string( _symbols_array[0], "" ).trim() ;
                    var _seeds_ret_i = circles_lib_find_item_index_by_symbol( _items_array, _symbol );
                    if ( _symbol.length == 0 )
                    {
                        _b_fail = YES, _error_str = "Missing disk ref to complete operation on notes" ;
                    }
                    else
                    {
                        if ( _seeds_ret_i == UNDET )
                        {
                            _msg = "Invalid letter reference ("+_symbols_array[0]+") in " + _dest_ref ;
                            circles_lib_output( _output_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                        }
                        else
                        {
                            _items_array[_seeds_ret_i].notes = _params_assoc_array['notes'].join( " " );
                            _msg = "Notes for seed ("+_symbols_array[0]+") have been saved with success" ;
                            circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );

                            if ( _storage_queue_request )
                            _params_assoc_array['settings']['storagequeue'].push( _items_array[_seeds_ret_i].copy() );
                        }
                    }
                break ;
                case "pair":
                    _symbols_array = _symbols_array.unique();
                    var _input_params = _params_assoc_array['settings']['params'] ;
                    var _src_items_set_ref = _input_params.includes( "generators" ) ? 2 : ( _input_params.includes( "seeds" ) ? 1 : 0 ) ;
                    var _src_items_set_name = "" ;
                 		if ( !_src_items_set_ref.is_one_of( 1, 2 ) )
                 		{
												circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing source set for disks pairing action: seeds will be assumed by default", _par_1, _cmd_tag );
												_src_items_set_ref = 1 ;
										}
										
                 		switch( _src_items_set_ref )
										{
												case 1:
												circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Pairing action will be performed on the</lightgray> <snow>seed</snow> <lightgray>set</lightgray>", _par_1, _cmd_tag );
												_src_items_set_ref = _items_array ;
												_src_items_set_name = "seeds" ;
												break ;
												case 2:
												circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Pairing action will be performed on the</lightgray> <snow>gens</snow> <lightgray>set</lightgray>", _par_1, _cmd_tag );
												_src_items_set_ref = _glob_gens_array ;
												_src_items_set_name = "generators" ;
												break ;
										}
										 
                    var _set = _params_assoc_array['extras'].includes_i( "set" ) ? YES : NO ;
                    var _n_symbols = safe_size( _symbols_array, 0 );
                    var _n_alphabet = safe_size( _glob_alphabet, 0 ) ;
                    var _n_zplane_items = safe_size( _items_array, 0 );
                    var _index_count_tmp = 0, _letters_count_tmp = 0 ;
                    if ( _n_zplane_items == 0 )
                    {
                        _b_fail = YES, _error_str = "No disks detected to be paired: try some draws in the Z-plane first" ;
                    }
                    else if ( _n_symbols > 0 )
                    {
                        $.each( _symbols_array,
                                function( _i, _l )
                                {
                                    if ( ( _l + "" ).isAlpha() ) _letters_count_tmp++ ;
                                    else if ( ( _l + "" ).isNumber() ) _index_count_tmp++ ;
                                }
                                ) ;
                                
                        if ( _index_count_tmp > 0 && _letters_count_tmp > 0 )
                        {
                           _b_fail = YES, _error_str = "Input items could be not of hybrid type: they all should be numerical indexes or letters" ;
                        }
                        else if ( _letters_count_tmp > 0 )
                        {
                           if ( _n_alphabet == 0 )
                           {
															circles_lib_output( _output_channel, DISPATCH_WARNING, "The current alphabet is still empty: items must be registered and grouped first, in order to be referenced by symbols", _par_1, _cmd_tag );
															circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<yellow>System will attempt to get them through indexes</yellow>", _par_1, _cmd_tag );
															var _tmp_index = [] ;
															$.each( _symbols_array, function( _i, _sym ) { var _index = circles_lib_find_item_index_by_symbol( _src_items_set_ref, _sym ); if ( _index != UNFOUND ) _tmp_index.push( _index ) ; } ) ;
															if ( _tmp_index.length == _letters_count_tmp )
															{
																	circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lime>Indexes "+_tmp_index.join( ", " )+" for entries "+_symbols_array.join( ", " )+" have been detected with success</lime>", _par_1, _cmd_tag );
																	_symbols_array = _tmp_index.clone() ;
															}
															else if ( _tmp_index.length != _letters_count_tmp )
															{
																	_b_fail = YES ;
																	var _diff = _symbols_array.difference( _tmp_index, function( _a, _b ) { return _a.strcmp( _b ) ; } );
				                          _error_str = "Some symbols '"+_diff.join( ", " )+"' do not refer to any entry in the archive" ;
				                          var _alphabet = circles_lib_alphabet_get();
				                          if ( !is_array( _alphabet ) ) _alphabet = [] ;
				                          _error_str += _glob_crlf + ( safe_size( _alphabet, 0 ) > 0 ? "Current available symbols are '"+_alphabet.join( ", " )+"'" : "There are no available symbols: items shall be accessed through indexes" ) ;
				                          _error_str += _glob_crlf + "Current index range is : 0 - " + Math.max( 0, safe_size( _src_items_set_ref, 0 ) - 1 ) ;
															}
                           }
                           else if ( _n_alphabet == 1 )
                           {
                              _b_fail = YES, _error_str = "The size ("+_n_alphabet+") of current alphabet is insufficient: it shall be populated by two entries at least" ;
                           }
                        }
                    }
                    else if ( _n_symbols == 0 )
                    {
                        _b_fail = YES, _error_str = "Missing input letters: can't pair items" ;
                    }
                    else if ( _n_symbols == 1 )
                    {
                        _b_fail = YES, _error_str = "Insufficient input letters: pairing action requires two entries" ;
                    }
                    else if ( _n_symbols > 2 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Exceeding input entries ("+_n_symbols+"): only the first two letters will be acquired to pair items", _par_1, _cmd_tag );

                    if ( !_b_fail )
                    {
                        var _symbols = _symbols_array.subset( 2 ), _report = [], _existence_flag = YES ;
                        circles_lib_output( _output_channel, DISPATCH_INFO, "No errors detected, starting to work on symbols "+_symbols_array.join( ", " ), _par_1, _cmd_tag );
												if ( _letters_count_tmp > 0 )
                        {
                            circles_lib_output( _output_channel, DISPATCH_WARNING, "Input symbols are of alphabetic type: the items with symbols "+_symbols_array.join( ", " )+ " will be detached from current symbols", _par_1, _cmd_tag );
                            $.each( _src_items_set_ref, function( _i, _item ) { if ( _symbols_array.includes_i( _item.symbol ) ) _src_items_set_ref[_i].original_word = _src_items_set_ref[_i].symbol = "" ; } ) ;

                            circles_lib_output( _output_channel, DISPATCH_INFO, "Input symbols are of alphabetic type: they will be converted into numerical indexes to items", _par_1, _cmd_tag );
                            $.each( _symbols, function( _i, _sym ) { var _index = circles_lib_find_item_index_by_symbol( _src_items_set_ref, _sym ); if ( !is_item_obj( _src_items_set_ref[_index] ) ) _report.push( _index + 1 ); } ) ;
                        }

                        if ( _index_count_tmp > 0 )
                        {
                            circles_lib_output( _output_channel, DISPATCH_WARNING, "Input symbols are of numerical type: the items indexed as "+_symbols_array.join( ", " )+ " will be cleared to acquire the new settings", _par_1, _cmd_tag );
                            var _inv_i = 0 ;
                            $.each( _src_items_set_ref,
																		function( _i, _item )
																		{
																				_inv_i = circles_lib_find_item_index_by_symbol( _src_items_set_ref, _src_items_set_ref[_i].inverse_symbol );
																				_src_items_set_ref[_i].original_word = _src_items_set_ref[_i].symbol = _src_items_set_ref[_i].inverse_symbol = "" ;
																				if ( _inv_i != UNFOUND )
																				_src_items_set_ref[_inv_i].original_word = _src_items_set_ref[_inv_i].symbol = _src_items_set_ref[_inv_i].inverse_symbol = "" ;
																		} ) ;

                            circles_lib_output( _output_channel, DISPATCH_INFO, "Input symbols are of numerical type: they will be used as numerical indexes to items", _par_1, _cmd_tag );
                            $.each( _symbols, function( _i, _sym ) { _sym = safe_int( _sym, 0 ) - 1 ; if ( !is_item_obj( _src_items_set_ref[_sym] ) ) _report.push( _sym + 1 ); } ) ;
                        }

                        if ( safe_size( _report, 0 ) > 0 )
                        {
                           _b_fail = YES ;
                           _error_str = "The following symbols ("+_report.join( ", " )+") do not refer to registered items or just disks on the Z-plane" ;
                           if ( _report.includes(0) && _index_count_tmp > 0 )
                           _error_str += _glob_crlf + "Input indexes are 1-based, hence index 0 is not permitted" ;
                        }
                        else
                        {
                           var _zero_based_indexes = _index_count_tmp > 0 ? _symbols.work( function( _sym ) { return safe_int( _sym, 1 ) - 1 ; } ) : _symbols.copy() ;
                           var _item_1 = _items_array[ _zero_based_indexes[0] ] ;
                           var _item_2 = _items_array[ _zero_based_indexes[1] ] ;
                           if ( is_item_obj( _item_1 ) && is_item_obj( _item_2 ) )
                           {
                               var _disk_1 = _item_1.complex_circle, _disk_2 = _item_2.complex_circle ;
                               var _mm = new mobius_map();
                                   _mm.init_inversion_from_two_circles( _disk_1, _disk_2 );
                               var _mm_params = _mm.get_params(YES);

                               var _msg = "The resulting Mobius map is" + _glob_crlf ;
                               circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                               $.each( _mm_params[0], function( _i, _param ) { circles_lib_output( _output_channel, DISPATCH_SUCCESS, _mm_params[1][_i] + ": " + _param.formula(), _par_1, _cmd_tag ); } ) ;

                               var _new_symbol = circles_lib_alphabet_suggest_symbol( _src_items_set_ref, CAPS_LETTER ) ;
                               circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Suggested new symbol <snow>"+_new_symbol+"</snow>", _par_1, _cmd_tag );
                                     
                               _glob_zplane_selected_items_array = _zero_based_indexes.clone();
                               var _ret_chunk = circles_lib_canvas_render_zplane( null, null, null, NO, YES, YES, NO, YES, _output_channel ) ;
													     var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
														   var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
														   
							   if ( _ret_id == RET_ERROR ) { _b_fail = YES, _error_str = _ret_msg ; }
							   else if ( _ret_id == RET_OK )
                               circles_lib_output( _output_channel, DISPATCH_INFO, "Selected items have been hightlighted on the z-plane", _par_1, _cmd_tag );
                                     
                               if ( _set && !_b_fail )
                               {
																	 _src_items_set_ref[ _zero_based_indexes[0] ].map = _mm.copy();
																	 _src_items_set_ref[ _zero_based_indexes[0] ].original_word = _src_items_set_ref[ _zero_based_indexes[0] ].symbol = _new_symbol ;
																	 _src_items_set_ref[ _zero_based_indexes[0] ].inverse_symbol = circles_lib_word_inverse_get( _new_symbol ) ;
																	 _src_items_set_ref[ _zero_based_indexes[0] ].complex_circle.drawcolor = DEFAULT_DRAW_SEED_COLOR ;
																	 _src_items_set_ref[ _zero_based_indexes[0] ].complex_circle.fillcolor = DEFAULT_FILL_SEED_COLOR ;
																	 _src_items_set_ref[ _zero_based_indexes[0] ].screen_circle.drawcolor = DEFAULT_DRAW_SEED_COLOR ;
																	 _src_items_set_ref[ _zero_based_indexes[0] ].screen_circle.fillcolor = DEFAULT_FILL_SEED_COLOR ;

                                   _src_items_set_ref[ _zero_based_indexes[1] ].map = _mm.inv().copy();
																	 _src_items_set_ref[ _zero_based_indexes[1] ].original_word = _src_items_set_ref[ _zero_based_indexes[1] ].symbol = circles_lib_word_inverse_get( _new_symbol ) ;
																	 _src_items_set_ref[ _zero_based_indexes[1] ].inverse_symbol = _new_symbol ;
																	 _src_items_set_ref[ _zero_based_indexes[1] ].complex_circle.drawcolor = DEFAULT_DRAW_INVERSE_SEED_COLOR ;
																	 _src_items_set_ref[ _zero_based_indexes[1] ].complex_circle.fillcolor = DEFAULT_FILL_INVERSE_SEED_COLOR ;
																	 _src_items_set_ref[ _zero_based_indexes[1] ].screen_circle.drawcolor = DEFAULT_DRAW_SEED_COLOR ;
																	 _src_items_set_ref[ _zero_based_indexes[1] ].screen_circle.fillcolor = DEFAULT_FILL_SEED_COLOR ;

                                   circles_lib_output( _output_channel, DISPATCH_SUCCESS, "This Mobius map has been correctly linked to disks", _par_1, _cmd_tag );
                                   circles_lib_output( _output_channel, DISPATCH_SUCCESS, "and referred by symbol '"+_new_symbol+"'", _par_1, _cmd_tag );

                                   if ( _items_array[ _zero_based_indexes[0] ].symbol.length == 0 ||
                                        _items_array[ _zero_based_indexes[1] ].symbol.length == 0 )
                                   circles_lib_output( _output_channel, DISPATCH_WARNING, "Letters have not been associated: use 'init' cmd", _par_1, _cmd_tag );

                                   $('[id$=initBTN]').css('color',COLOR_ERROR) ;
                               }
                               else circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing input 'set' option: this is just a simulation and no pairing action will be performed on the "+_src_items_set_name+" set", _par_1, _cmd_tag );

                               if ( _storage_queue_request )
                               {
                                  circles_lib_output( _output_channel, DISPATCH_INFO, "> Detected request for saving items into '"+_params_assoc_array['settings']['storagesubset']+"' storage subset", _par_1, _cmd_tag );
                                  circles_lib_output( _output_channel, DISPATCH_INFO, "> Both map and its inverse are being computed and stored", _par_1, _cmd_tag );
                                  _params_assoc_array['settings']['storagequeue'].push( _src_items_set_ref[ _zero_based_indexes[0] ] );
                                  _params_assoc_array['settings']['storagequeue'].push( _src_items_set_ref[ _zero_based_indexes[1] ] );
                               }
                           }
                           else
                           {
                              if ( !is_circle( _disk_1 ) )
                              circles_lib_output( _output_channel, DISPATCH_WARNING, "Index " + _symbols[0] + " does not refer to any valid disk to be paired", _par_1, _cmd_tag );
                              if ( !is_circle( _disk_2 ) )
                              circles_lib_output( _output_channel, DISPATCH_WARNING, "Index " + _symbols[1] + " does not refer to any valid disk to be paired", _par_1, _cmd_tag );
                           }
                        }
                    }
                break ;
                case "release":
                circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "rotate":
                    var _ret_chunk = [] ;
                    if ( _params_assoc_array['all'] )
                    {
                         if ( is_array( _ret_chunk ) )
                         {
                             _ret_chunk.flush();
                             for( var _i = 0 ; _i < _items_n ; _i++ ) _ret_chunk.push( _i );
                         }
                         else { _b_fail = YES, _error_str = "Memory failure" ; }
                    }
                    else _ret_chunk = _index_selection_array ;

                    if ( _ret_chunk.length > 0 && is_array( _items_array ) )
                    {
                        var _angle_rad = 0, _rotated_center, _index, _cc, _complex_center, _msg, _origin = new complex( 0, 0 ), _str, _symbol, _i ;
                        var _tmp_rot_center = _params_assoc_array['center'] ;
                        var _rotation_center = is_point( _tmp_rot_center ) ? new complex( _tmp_rot_center.x, _tmp_rot_center.y ) : _origin ;
												// cleaning
                        for( _i = 0 ; _i < _ret_chunk.length ; _i++ ) _ret_chunk[_i] = ( _ret_chunk[_i] + "").trim();

                        if ( _rotation_radians != 0 ) _angle_rad = _rotation_radians ;
                        else if ( _rotation_degree != 0 ) _angle_rad = _rotation_degree / 180.0 * Math.PI ;
                             
                        for( _i = 0 ; _i < _ret_chunk.length ; _i++ )
                        {
                            _index = ( _ret_chunk[_i] != null ) ? safe_int( _ret_chunk[_i], UNDET ) : UNDET ;
                            _cc = ( _index != UNDET ) ? _items_array[_index].complex_circle : null ;
                            if ( is_circle( _cc ) )
                            {
                                _complex_center = new complex( _cc.center.x, _cc.center.y );
 								_symbol = _items_array[_i].symbol ;
                                _rotated_center = _complex_center.rotate( _rotation_center, _angle_rad );
								_items_array[_i].complex_circle.center = new point( _rotated_center.real, _rotated_center.imag );
 								circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Disk '"+_symbol+"' rotated", _par_1, _cmd_tag );
                            }
                            else circles_lib_output( _output_channel, DISPATCH_WARNING, "No circles found at index "+(_i+1), _par_1, _cmd_tag );         

                            if ( _storage_queue_request )
                            _params_assoc_array['settings']['storagequeue'].push( _items_array[_index].copy() );
                        }

                        circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _output_channel );
                        if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _output_channel );
                        if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _output_channel );
					    if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
					  	{
							_glob_terminal_change = YES ;
						    circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
						}
                    }
                    else if ( !is_array( _items_array ) ) { _b_fail = YES, _error_str = "Memory failure: can't get current items" ; }
                break ;
                case "select":
                    var _ret_chunk = [];
                    if ( _index_selection_array != null ) _glob_zplane_selected_items_array = _index_selection_array.clone();
                    var _n_sel = safe_size( _glob_zplane_selected_items_array, 0 );
                    if ( _n_sel > 0 && is_array( _items_array ) )
                    {
                        var _layer_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );
                        if ( is_html_canvas( _layer_placeholder ) )
                        {
                            var _need_symbol = 0 ;
                            $.each( _items_array, function( _i, _item_obj ){ if ( safe_string( _item_obj.symbol, "" ).trim().length == 0 ) _need_symbol++ ; } ) ;
                            var _ret_chunk = circles_lib_canvas_render_zplane( _layer_placeholder, zplane_sm, null, YES, YES, YES, NO, YES, _output_channel );
						    var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
         					var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                            if ( _ret_id == 0 ) { _b_fail = YES, _error_str = _ret_msg ; }
                            else 
                            {
                                circles_lib_output( _output_channel, DISPATCH_SUCCESS, _n_sel + " disk"+( _n_sel != 1 ? "s" : "" )+" selected: " + ( _symbols_array.join( "," ) ), _par_1, _cmd_tag );
                                if ( _storage_queue_request )
                                $.each( _glob_zplane_selected_items_array, function( _i, _index ) { _params_assoc_array['settings']['storagequeue'].push( _items_array[_index].copy() ); } ) ;
                            }
                             
                            if ( _need_symbol > 0 )
                            circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning! The symbol for "+_need_symbol+" disk"+( _need_symbol != 1 ? "s" : "" )+" has not been registered yet", _par_1, _cmd_tag );
                        }
                        else { _b_fail = YES, _error_str = "Memory failure" ; }
                    }
                    else if ( !is_array( _items_array ) ) { _b_fail = YES, _error_str = "Memory failure: can't get current items" ; }
                    else { _b_fail = YES, _error_str = "No items selected" ; }
                break ;
                case "symbol" :
                _glob_show_symbols_zplane = _params_assoc_array['on'] ? 1 : 0 ;
                circles_lib_symbol_zplane_display();
                break ;
                case "update" :
                    var _all = _params_assoc_array['all'] != null ? _params_assoc_array['all'] : NO ;
                    if ( ( _index_selection_array != null || _all ) && is_array( _items_array ) )
                    {
                        var _sel_n = _index_selection_array.length ;
                        if ( _sel_n > 0 || _all )
                        {
                            var _entries_n = _all ? _items_n : _sel_n, ITEM, _l_array ;
                            for( var _i = 0 ; _i < _entries_n ; _i++ )
                            {
                                _obj_index = _all ? _i : _index_selection_array[_i] ;
                                ITEM = _items_array[_obj_index] ;
                                if ( _obj_index != UNDET && is_item_obj( ITEM ) )
                                {
                                    if ( _params_assoc_array['x'] != null ) _items_array[_obj_index].complex_circle.center.x = _params_assoc_array['x'] ;
                                    if ( _params_assoc_array['y'] != null ) _items_array[_obj_index].complex_circle.center.y = _params_assoc_array['y'] ;
                                    if ( _params_assoc_array['symbol'] != null )
                                    {
                                        _items_array[_obj_index].original_word = _items_array[_obj_index].symbol = _params_assoc_array['symbol'][0].trim();
                                        _items_array[_obj_index].inverse_symbol = circles_lib_word_inverse_get( _items_array[_obj_index].symbol );
                                    }

                                    if ( _params_assoc_array['center'] != null ) _items_array[_obj_index].complex_circle.center = _params_assoc_array['center'] ;
                                    if ( _params_assoc_array['radius'] != null ) _items_array[_obj_index].complex_circle.radius = _params_assoc_array['radius'] ;
                                    if ( _params_assoc_array['fill'] != UNDET ) _items_array[_obj_index].complex_circle.fill = _params_assoc_array['fill'] ;
                                    if ( _params_assoc_array['draw'] != UNDET ) _items_array[_obj_index].complex_circle.draw = _params_assoc_array['draw'] ;
                                    if ( _params_assoc_array['linewidth'] != null ) _items_array[_obj_index].complex_circle.linewidth = _params_assoc_array['linewidth'] ;
                                    if ( _params_assoc_array['drawcolor'] != null ) _items_array[_obj_index].complex_circle.drawcolor = _params_assoc_array['drawcolor'] ;
                                    if ( _params_assoc_array['fillcolor'] != null ) _items_array[_obj_index].complex_circle.fillcolor = _params_assoc_array['fillcolor'] ;

                                    _l_array = _symbols_array.filtering( function( _p ){ return _p.isAlpha() } );
                                    if ( safe_size( _l_array, 0 ) > 0 )
                                    {
                                        if ( _l_array.length == 1 && _l_array[0].isAlpha() && _items_array[_obj_index].symbol.length == 0 )
                                        _items_array[_obj_index].original_word = _items_array[_obj_index].symbol = _l_array[0] ;
                                    }

                                    circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Disk "+_items_array[_obj_index].symbol+" has been updated", _par_1, _cmd_tag );
                                }
                                else circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: there's no element related to that symbol or index", _par_1, _cmd_tag );

                                if ( _storage_queue_request )
                                _params_assoc_array['settings']['storagequeue'].push( _items_array[_obj_index].copy() );
                            }

                            var _ret_chunk = circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _output_channel );
   							var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
         					var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                            if ( _ret_id )
                            {
                                if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _output_channel );
                                if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _output_channel );
    							if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
    							{
    								_glob_terminal_change = YES ;
    							    circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
    							}
                            }
                            else { _b_fail = YES, _error_str = _ret_msg ; }
                        }
                        else
                        {
                            _msg = "Error: no chosen disk for update" ;
                            if ( _params_assoc_array['symbol'] == null || !is_array( _params_assoc_array['symbol'] ) ) _msg += "Missing input symbol" ;
                            circles_lib_output( _output_channel, DISPATCH_ERROR, _msg, _par_1, _cmd_tag );                        
                        }
                    }
                    else if ( !is_array( _items_array ) ) { _b_fail = YES, _error_str = "Memory failure: can't get current items" ; }
                    else circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: there's no disk related to that symbol or index", _par_1, _cmd_tag );

                    if ( _glob_method == METHOD_NONE ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: set up a method before continuing", _par_1, _cmd_tag ); 
                break ;
				default: break ;
             }

             if ( _storage_queue_request )
             {
                 var _n_queue = safe_size( _params_assoc_array['settings']['storagequeue'], 0 );
                 var _subset = safe_string( _params_assoc_array['settings']['storagesubset'], "seeds" ) ;
                 var _exists = circles_lib_storage_parse_dependencies_syntax( _subset, "exists" ) ;
                 if ( !_exists ) circles_lib_storage_parse_dependencies_syntax( _subset, "create" ) ;
                 var _exists = circles_lib_storage_parse_dependencies_syntax( _subset, "exists" ) ;
                 if ( _n_queue > 0 && _exists )
                 {
                    circles_lib_output( _output_channel, DISPATCH_INFO, "Found "+_n_queue+" candidate Mobius map"+(_n_queue==1?"":"s")+" in the storage queue", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_INFO, "to be stored in '"+_subset+"' storage subset", _par_1, _cmd_tag );
                    var _old_n = circles_lib_storage_parse_dependencies_syntax( _subset, "size" ) ;
                    var _storage_subset_ref = circles_lib_storage_parse_dependencies_syntax( _subset, "get" );
                    var _level = _subset.count( "@" );
                    $.each( _params_assoc_array['settings']['storagequeue'], function( _i, _item_obj )
                            {
                               if ( is_item_obj( _item_obj ) )
                               {
                                   if ( _subset.start_with( "seeds" ) ) circles_lib_storage_parse_dependencies_syntax( _subset, "add", _item_obj ) ;
                                   else if ( _subset.start_with( "mobius" ) )
                                   {
                                      // find duplicates
                                      var _found = NO ;
                                      if ( _old_n > 0 ) $.each( _storage_subset_ref, function( _i, _map ){ if ( _map.is_equal_to( _item_obj.map ) ) { _found = YES ; return NO ; } } ) ;
                                      if ( _found ) circles_lib_output( _output_channel, DISPATCH_ERROR, "Storage failure: detected duplicate item inside level "+(_level-1)+" subset '"+_subset+"'", _par_1, _cmd_tag );                                
                                      else circles_lib_storage_parse_dependencies_syntax( _subset, "add", _item_obj.map ) ;
                                   }
                                   else circles_lib_output( _output_channel, DISPATCH_ERROR, "Invalid destination subset '"+_subset+"' for the storage queue: operation has been aborted", _par_1, _cmd_tag ); 
                               }
                               else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid input item: can't save into storage subset", _par_1, _cmd_tag );
                            } ) ;
                            
                    var _new_n = circles_lib_storage_parse_dependencies_syntax( _subset, "size" );
                    var _diff = _new_n - _old_n ;
                    if ( _diff == _n_queue )
                    circles_lib_output( _output_channel, DISPATCH_INFO, ( _n_queue == 1 ? "The only entry" : "All " + _n_queue + " entries" ) + " in this queue "+(_n_queue==1?"has":"have")+" been saved into level "+(_level-1)+" storage subset '"+_subset+"'", _par_1, _cmd_tag );
                    else if ( _diff < _n_queue && _diff > 0 )
                    circles_lib_output( _output_channel, DISPATCH_WARNING, "Just "+_n_queue+" entr"+(_n_queue==1?"y":"ies")+" in the queue have been saved into level "+(_level-1)+" storage subset '"+_subset+"'", _par_1, _cmd_tag );
                      
                    circles_lib_plugin_dispatcher_unicast_message('storage.space','forms',POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS);
                  }
                  else if ( !is_array( _glob_storage[ _subset ] ) )
                  circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid level "+(_level-1)+" storage subset '"+_subset+"'", _par_1, _cmd_tag );
             }
        }
    }
    else { _b_fail = YES, _error_str = "Missing input params" ; }

    if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}