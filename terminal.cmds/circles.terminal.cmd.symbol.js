function circles_terminal_cmd_symbol()
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

    var _sd_n = circles_lib_count_seeds();
	var _last_release_date = get_file_modify_date( _glob_paths['terminal_abs_cmds'], "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

	if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
        _cmd_params['action'] = null ;
        _cmd_params['all'] = NO ;
        _cmd_params['auto'] = NO ;
        _cmd_params['back'] = NO ;
        _cmd_params['force'] = NO ;
        _cmd_params['forward'] = NO ;
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['help'] = NO ;
        _cmd_params["item"] = ITEMS_SWITCH_SEEDS ;
        _cmd_params['keywords'] = NO ;
        _cmd_params['param'] = "" ;
         
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _cmd_terms_dict = [ "all", "auto", "change", "clean", "force", "forward", "back",
            "clean", "hide", "init", "list", "shift", "show", "html", "release", "generators", "seeds", "colorize", "decolorize" ];
        circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i];
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "all", "auto", "back", "force", "forward", "html", "silent" ) ) _cmd_params[_p] = YES ;
            else if ( _p.stricmp( "seeds" ) ) _cmd_params["item"] = ITEMS_SWITCH_SEEDS ;
            else if ( _p.stricmp( "generators" ) ) _cmd_params["item"] = ITEMS_SWITCH_GENS ;
            else if ( _p.is_one_of_i( "from", "to" ) ) _cmd_params['param'] = _p.toLowerCase();
            else if ( _p.is_one_of_i( "clean", "colorize", "decolorize", "change", "hide", "init", 
									  "list", "release", "shift", "show" ) ) _cmd_params['action'] = _p.toLowerCase();
            else if ( _p.testME( _glob_symbol_regex_pattern ) )
            {
                if ( _cmd_params['param'].strcmp( "from" ) )
                {
                  if ( _cmd_params['change_from'] == null ) _cmd_params['change_from'] = [] ;
                  _cmd_params['change_from'].push( _p );
                }
                else if ( _cmd_params['param'].strcmp( "to" ) )
                {
                  if ( _cmd_params['change_to'] == null ) _cmd_params['change_to'] = [] ;
                  _cmd_params['change_to'].push( _p );
                }
            }
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
        }
         
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
            var _items_array = _cmd_params["item"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    		var _items_n = circles_lib_count_items( _items_array );
            var _dest_ref = _cmd_params["item"] == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
            var _category_ref = _cmd_params["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
            var _action = _cmd_params['action'] ;
            var _all = _cmd_params['all'] ;
            var _auto = _cmd_params['auto'] ;
            var _back = _cmd_params['back'] ;
            var _force = _cmd_params['force'] ;
            var _forward = _cmd_params['forward'] ;

            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightgray>Working on the current group of</lightgray> <white>"+_dest_ref+"</white>", _par_1, _cmd_tag );
            switch( _action )
            {
                case "change":
                var _change_in_len = ( _cmd_params['change_from'] != null ) ? _cmd_params['change_from'].length : 0 ;
                var _change_out_len = ( _cmd_params['change_to'] != null ) ? _cmd_params['change_to'].length : 0 ;
                var _candidate_letters_n = _change_in_len + _change_out_len ;
                var ALPHABET = circles_lib_alphabet_get();
                if ( _sd_n == 0 ) { _b_fail = YES, _error_str = "Missing input gens or symbols" ; }
                else if ( _candidate_letters_n != _sd_n * 2 )
                {
                    _b_fail = YES, _error_str = "Fail to change symbols" ;
                    _error_str += _glob_crlf + "The 'FROM' group size shall equal the 'TO' group size" ;
                    if ( _change_in_len != _sd_n )
                    _error_str += _glob_crlf + ( ( _change_in_len > 0 ) ? "The 'FROM' group size ("+_change_in_len+") shall equal seeds amount (currently, it's "+_sd_n+")" : "The 'FROM' group is empty." );
                    if ( _change_out_len != _sd_n )
                    _error_str += _glob_crlf + ( ( _change_out_len > 0 ) ? "The 'TO' group size ("+_change_out_len+") shall equal seeds amount (currently, it's "+_sd_n+")" : "The 'TO' group is empty." );
                }
                else if ( ALPHABET.length == 0 )
                {
                    _b_fail = YES, _error_str = "Current alphabet is not available" ;
                    if ( _glob_verbose && _glob_terminal_echo_flag ) _error_str += _glob_crlf + "Try to init the input gens first" ;
                }
                else if ( _change_in_len == 0 ) { _b_fail = YES, _error_str = "Missing 'FROM' group of symbols" ; }
                else if ( _change_out_len == 0 ) { _b_fail = YES, _error_str = "Missing 'TO' group of symbols" ; }
                else
                {
                    var _err_report = [], _tmp_error_count = 0, _err_count = 0, _i ;
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightblue>Current alphabet</lightblue> <snow>"+ALPHABET.join( ", " )+"</snow>", _par_1, _cmd_tag );
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "", _par_1, _cmd_tag );
                    circles_lib_output( _out_channel, DISPATCH_INFO, "Scanning the 'FROM' group for invalid inputs", _par_1, _cmd_tag );
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightblue>'FROM' group is</lightblue> <snow>"+ _cmd_params['change_from'].join(", ")+"</snow>", _par_1, _cmd_tag );
                    for( _i = 0 ; _i < _cmd_params['change_from'].length ; _i++ )
                    {
                        if ( !ALPHABET.includes( _cmd_params['change_from'][_i] ) )
                        {
                            _err_count++ ;
                            _tmp_error_count++ ;
                            _err_report.push( "Found invalid symbol '"+_cmd_params['change_from'][_i]+"', not matching the current alphabet." );
                        }
                    }
                       
                    if ( _tmp_error_count == 0 )
                    {
                        circles_lib_output( _out_channel, DISPATCH_SUCCESS, "The 'FROM' group entries have been validated with success", _par_1, _cmd_tag );
                        circles_lib_output( _out_channel, DISPATCH_SUCCESS, "", _par_1, _cmd_tag );
                    }
    
                    circles_lib_output( _out_channel, DISPATCH_INFO, "Scanning the 'TO' group for invalid inputs", _par_1, _cmd_tag );
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightblue>'TO' group is</lightblue> <snow>"+ _cmd_params['change_to'].join(", ")+"</snow>", _par_1, _cmd_tag );
    
                    _tmp_error_count = 0 ;
                    for( _i = 0 ; _i < _cmd_params['change_to'].length ; _i++ )
                    {
                        if ( !ALPHABET.includes( _cmd_params['change_to'][_i] ) )
                        {
                            _err_count++ ;
                            _tmp_error_count++ ;
                            _err_report.push( "Found invalid symbol '"+_cmd_params['change_to'][_i]+"', not matching the current alphabet." );
                        }
                    }
    
                    if ( _tmp_error_count == 0 )
                    {
                        circles_lib_output( _out_channel, DISPATCH_SUCCESS, "The 'TO' group entries have been validated with success", _par_1, _cmd_tag );
                        circles_lib_output( _out_channel, DISPATCH_SUCCESS, "", _par_1, _cmd_tag );
                    }
                       
                    if ( _err_report.length > 0 ) { _b_fail = YES, _error_str = _err_report.join( _glob_crlf ); }
                    else
                    {
                        if ( _cmd_params['change_from'].compare_to( _cmd_params['change_to'] ) )
                            circles_lib_output( _out_channel, DISPATCH_WARNING, "Symbols change aborted: 'FROM' group matches the 'TO' group", _par_1, _cmd_tag );
                        else if ( _cmd_params['change_from'].has_duplicates() )
                            circles_lib_output( _out_channel, DISPATCH_WARNING, "Symbols change aborted: 'FROM' group includes duplicate entries", _par_1, _cmd_tag );
                        else if ( _cmd_params['change_to'].has_duplicates() )
                            circles_lib_output( _out_channel, DISPATCH_WARNING, "Symbols change aborted: 'TO' group includes duplicate entries", _par_1, _cmd_tag );
                        else
                        {
                            _tmp_error_count = 0, _err_report.flush();
                            circles_lib_output( _out_channel, DISPATCH_INFO, "Collecting indexes from the 'FROM' group", _par_1, _cmd_tag );
                            var _tmp_var = UNFOUND, _i, _c ;
                            for( _c = 0 ; _c < _cmd_params['change_from'].length ; _c++ )
                            {
                                _tmp_var = circles_lib_find_item_index_by_symbol( null, _cmd_params['change_from'][_c] );
                                if ( _tmp_var == UNFOUND )
                                {
                                    _tmp_error_count++ ;
                                    _err_report.push( "Seed '"+_cmd_params['change_from'][_c]+"' not found in the 'FROM' group." );
                                }
                            }
    
                                 if ( _tmp_error_count == 0 )
                                 circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Indexes collected from the 'FROM' group with success", _par_1, _cmd_tag );
                                 else circles_lib_output( _out_channel, DISPATCH_WARNING, _err_report.join( _glob_crlf ), _par_1, _cmd_tag );
    
                                 circles_lib_output( _out_channel, DISPATCH_INFO, "Collecting index from the 'TO' group", _par_1, _cmd_tag );
                                    _tmp_error_count = 0, _tmp_var = UNFOUND ;
                                 for( _c = 0 ; _c < _cmd_params['change_to'].length ; _c++ )
                                 {
                                      _tmp_var = circles_lib_find_item_index_by_symbol( null, _cmd_params['change_to'][_c] );
                                      if ( _tmp_var == UNFOUND )
                                      {
                                           _tmp_error_count++ ;
                                           _err_report.push( "Seed '"+_cmd_params['change_to'][_c]+"' not found in the 'TO' group." );
                                      }
                                 }
    
                                 if ( _tmp_error_count == 0 )
                                 circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Indexes collected from the 'TO' group with success", _par_1, _cmd_tag );
                                 else circles_lib_output( _out_channel, DISPATCH_WARNING, _err_report.join( _glob_crlf ), _par_1, _cmd_tag );
                                 
                                 if ( _tmp_error_count == 0 )
                                 {
                                      var _map = [], _chunk, _symbol_from = "", _symbol_to = "" ;
                                      // proceed to map indexes
                                      circles_lib_output( _out_channel, DISPATCH_INFO, "Mapping indexes for final change", _par_1, _cmd_tag );
                                      for( _i = 0 ; _i < _cmd_params['change_from'].length ; _i++ )
                                      {
                                         _symbol_from = _cmd_params['change_from'][_i] ;
                                         _symbol_to = _cmd_params['change_to'][_i] ;
                                         _map.push( [ _i, _symbol_from, _symbol_to ] );
                                      }
    
                                      for( _i = 0 ; _i < _map.length ; _i++ )
                                      {
                                         _chunk = _map[_i] ;
                                         _items_array[ _chunk[0] ].original_word = _items_array[ _chunk[0] ].symbol = _chunk[2] ;
                                         circles_lib_output( _out_channel, DISPATCH_INFO, "Turning old '"+_chunk[1]+"' to new '"+_chunk[2]+"'", _par_1, _cmd_tag );
                                         if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) )
                                         _items_array[ _chunk[0] ].inverse_symbol = circles_lib_word_inverse_get( _chunk[2] );
                                      }
                                      
                                      circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Symbols have been changed with success", _par_1, _cmd_tag );
                                      if ( _glob_terminal_autorefresh && _glob_show_symbols_zplane )
                                      circles_lib_symbol_zplane_display();
                                 }
                        }
                    }
                }
                break ;
                case "clean":
                if ( _sd_n > 0 )
                {
                       var _clean_fn = function()
                       {
                           var _out_array = [], ITEM ;
                           for( var _i = 0 ; _i < _sd_n ; _i++ )
                           {
                               ITEM = _items_array[_i] ;
                               if ( !is_item_obj( ITEM ) && _force == NO )
                               {
                                    _b_fail = YES, _error_str = "Memory failure at generator indexed at "+_i+": symbols elimination aborted" ;
                                    break ;
                               }
        
                               if ( _all ) _items_array[_i].original_word = _items_array[_i].symbol = _items_array[_i].inverse_symbol = "" ;
                           }
                           
                           var _msg = " have been cleaned" ;
                           _msg = !_all ? "Symbols" + _msg : "All entries " + _msg ;
                           circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                       }
    
                       if ( _glob_terminal_echo_flag ) _clean_fn();
                       else
                       {
                       		var _params_array = [] ;
    						_params_array['prepromptquestion'] = null ;
    	                   	_params_array['promptquestion'] = "Are you sure to clean all symbols ?" ;
    	                   	_params_array['yes_fn'] = function() { _clean_fn(); }
    	                   	_params_array['ifquestiondisabled_fn'] = function() { _clean_fn(); }
							if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
    	                   	else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                       }
                }
                else { _b_fail = YES, _error_str = _ERR_33_01 ; }
                break ;
                case "colorize":
                if ( _items_n > 0 )
                {
           	     	var _params_array = [] ;
           			_params_array['prepromptquestion'] = null ;
           			_params_array['promptquestion'] = "Confirm to colorize all "+_dest_ref+"? " ;
           			_params_array['yes_fn'] = function() {
                        var _ret_chunk = circles_lib_colors_colorize_group( _dest_ref, YES, YES, _out_channel );
                        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
                        circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                    }
           			_params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_colorize_group( _dest_ref, YES, YES, _out_channel ); }
					if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
           			else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                }
                else { _b_fail = YES, _error_str = "The list of seeds is empty" ; }
                break ;
			    case "decolorize":
			    if ( _items_n > 0 )
			    {
					var _params_array = [] ;
					_params_array['prepromptquestion'] = null ;
					_params_array['promptquestion'] = "Confirm to decolorize all "+_dest_ref+"? " ;
					_params_array['yes_fn'] = function() {
						var _ret_chunk = circles_lib_colors_decolorize_group( _dest_ref, YES, YES, _out_channel );
						var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
						var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
						circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
					}
					_params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_decolorize_group( _dest_ref, YES, YES, _out_channel ); }
					if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
					else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
			    }
			    else { _b_fail = YES, _error_str = "The list of seeds is empty" ; }
			    break ;
                case "init":
                var _auto = _cmd_params['auto'] ;
                var _ret_chunk = circles_lib_alphabet_autoconfig_all_symbols( !_glob_terminal_echo_flag, _glob_terminal_echo_flag, _auto, YES, _out_channel );
                var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
                var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Symbols setting proc: memory failure" ;
                if ( _ret_id == 1 ) circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                else if ( _ret_id == 0 && _glob_terminal_errors_switch )
                {
                    _b_fail = YES, _glob_terminal_critical_halt_msg = _error_str = _ret_msg ;
                    _glob_terminal_critical_halt = YES ;
                }
                break ;
                case "list":
                if ( _sd_n > 0 )
                {
                    var _out_array = [], ITEM, _symbol, _inv_symbol ;
                    for( var _i = 0 ; _i < _sd_n ; _i++ )
                    {
                        ITEM = _items_array[_i], _symbol = ITEM.symbol, _inv_symbol = ITEM.inverse_symbol ;
                        _out_array.push( _symbol );
                    }
                       
                    var _counter = _out_array.length, _out = "" ;
                    if ( _counter > 0 ) _out = _counter + " symbol" + ( _counter == 1 ? "" : "s" ) + " used : " + _out_array.join( "," );
                    else _out = "No symbols used" ;
                           
                    circles_lib_output( _out_channel, DISPATCH_INFO, _out, _par_1, _cmd_tag );
                }
                else { _b_fail = YES, _error_str = _ERR_33_01 ; }
                break ;
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "shift":
                if ( _forward && _back ) { _b_fail = YES, _error_str = "Parameters crash: can't declare both forward and backward direction" ; }
                else
                {
                    var _ret_chunk = circles_lib_symbol_shift( null, ( _forward ? YES : ( _back ? NO : YES ) ), NO, YES, _out_channel );
                    var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
                    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Shifting symbols: memory failure" ;
                    if ( _ret_id == 1 )
                    {
                        circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                        if ( _auto )
                        {
                            _glob_show_symbols_zplane = NO ;
                            var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _out_channel );
                            var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
                            var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Shifting symbols: memory failure" ;
                            if ( _ret_id )
                            {
                                _glob_show_symbols_zplane = YES ;
                                circles_lib_symbol_zplane_display();
                                circles_lib_menu_entries_update();
                            }
                            else { _b_fail = YES, _error_str = _ret_msg ; }
                        }
						if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
    					{
    						_glob_terminal_change = YES ;
    					    circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
    					}
                    }
                    else if ( _ret_id == 0 && _glob_terminal_errors_switch )
                    {
                        _b_fail = YES, _glob_terminal_critical_halt_msg = _error_str = _ret_msg ;
                        _glob_terminal_critical_halt = YES ;
                    }
                }
                break ;
                case "hide":
                case "show":
				_glob_show_symbols_zplane = _action == "show" ? YES : NO ;
				var _ret_chunk = circles_lib_symbol_zplane_display(null,null,null,NO,NO,_out_channel);
                var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
                var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Shifting symbols: memory failure" ;
                if ( _ret_id )
                {
					circles_lib_output( _out_channel, DISPATCH_SUCCESS, "symbols are " + ( _glob_show_symbols_zplane ? "shown" : "hidden" ), _par_1, _cmd_tag );
					circles_lib_canvas_render_zplane();
                    if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
              		{
            			_glob_terminal_change = YES ;
                        circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
            		}
                }
                else { _b_fail = YES, _error_str = _ret_msg ; }
                break ;
                default: break ;
            }
         }
    }
    else { _b_fail = YES, _error_str = "Missing input params" ; }
     
    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}