function circles_terminal_cmd_symbol()
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

    var _sd_n = circles_lib_count_seeds();
	var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _params_assoc_array = [];

	if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
        _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
        _params_assoc_array['help'] = NO ;
        _params_assoc_array['keywords'] = NO ;
        _params_assoc_array['action'] = null ;
        _params_assoc_array['all'] = NO ;
        _params_assoc_array['auto'] = NO ;
        _params_assoc_array['backward'] = NO ;
        _params_assoc_array['force'] = NO ;
        _params_assoc_array['forward'] = NO ;
        _params_assoc_array['inverse'] = NO ;
        _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
        _params_assoc_array['param'] = "" ;
         
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); 
        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [];
    	_local_cmds_params_array.push( "all", "auto", "change", "clean", "force", "forward", "backward",
                    "clean", "hide", "init", "list", "shift", "show", "inverse",
                    "html", "release", "generators", "seeds", "colorize", "decolorize"
																					);
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i];
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.stricmp( "all" ) ) _params_assoc_array['all'] = YES ;
            else if ( _p.stricmp( "auto" ) ) _params_assoc_array['auto'] = YES ;
            else if ( _p.stricmp( "force" ) ) _params_assoc_array['force'] = NO ;
            else if ( _p.stricmp( "seeds" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
            else if ( _p.stricmp( "generators" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_GENS ;
            else if ( _p.stricmp( "forward" ) ) _params_assoc_array['forward'] = YES ;
            else if ( _p.stricmp( "backward" ) ) _params_assoc_array['backward'] = YES ;
            else if ( _p.stricmp( "inverse" ) ) _params_assoc_array['inverse'] = YES ;
            else if ( _p.is_one_of_i( "from", "to" ) ) _params_assoc_array['param'] = _p.toLowerCase();
            else if ( _p.is_one_of_i( "clean", "colorize", "decolorize", "change", "hide", "init", "list", "release", "shift", "show" ) )
            _params_assoc_array['action'] = _p.toLowerCase();
            else if ( _p.testME( _glob_symbol_regex_pattern ) )
            {
                if ( _params_assoc_array['param'].strcmp( "from" ) )
                {
                  if ( _params_assoc_array['change_from'] == null ) _params_assoc_array['change_from'] = [] ;
                  _params_assoc_array['change_from'].push( _p );
                }
                else if ( _params_assoc_array['param'].strcmp( "to" ) )
                {
                  if ( _params_assoc_array['change_to'] == null ) _params_assoc_array['change_to'] = [] ;
                  _params_assoc_array['change_to'].push( _p );
                }
            }
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
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
            var _items_array = _params_assoc_array["item"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    		var _items_n = circles_lib_count_items( _items_array );
            var _dest_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
            var _category_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
            var _action = _params_assoc_array['action'] ;
            var _all = _params_assoc_array['all'] ;
            var _auto = _params_assoc_array['auto'] ;
            var _backward = _params_assoc_array['backward'] ;
            var _force = _params_assoc_array['force'] ;
            var _forward = _params_assoc_array['forward'] ;
            var _inverse = _params_assoc_array['inverse'] ;

            circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Working on the current group of</lightgray> <white>"+_dest_ref+"</white>", _par_1, _cmd_tag );
            switch( _action )
            {
                case "change":
                var _change_in_len = ( _params_assoc_array['change_from'] != null ) ? _params_assoc_array['change_from'].length : 0 ;
                var _change_out_len = ( _params_assoc_array['change_to'] != null ) ? _params_assoc_array['change_to'].length : 0 ;
                var _candidate_letters_n = _change_in_len + _change_out_len ;
                var ALPHABET = circles_lib_alphabet_get();
                if ( _sd_n == 0 ) { _b_fail = YES, _error_str = "Missing input gens or symbols" ; }
                else if ( _candidate_letters_n != _sd_n * 2 )
                {
                    _b_fail = YES, _error_str = "Can't change symbols" ;
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
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Current alphabet</lightblue> <snow>"+ALPHABET.join( ", " )+"</snow>", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_INFO, "Scanning the 'FROM' group for invalid inputs", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>'FROM' group is</lightblue> <snow>"+ _params_assoc_array['change_from'].join(", ")+"</snow>", _par_1, _cmd_tag );
                    for( _i = 0 ; _i < _params_assoc_array['change_from'].length ; _i++ )
                    {
                        if ( !ALPHABET.includes( _params_assoc_array['change_from'][_i] ) )
                        {
                            _err_count++ ;
                            _tmp_error_count++ ;
                            _err_report.push( "Found invalid symbol '"+_params_assoc_array['change_from'][_i]+"', not matching the current alphabet." );
                        }
                    }
                       
                    if ( _tmp_error_count == 0 )
                    {
                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The 'FROM' group entries have been validated with success", _par_1, _cmd_tag );
                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, "", _par_1, _cmd_tag );
                    }
    
                    circles_lib_output( _output_channel, DISPATCH_INFO, "Scanning the 'TO' group for invalid inputs", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>'TO' group is</lightblue> <snow>"+ _params_assoc_array['change_to'].join(", ")+"</snow>", _par_1, _cmd_tag );
    
                    _tmp_error_count = 0 ;
                    for( _i = 0 ; _i < _params_assoc_array['change_to'].length ; _i++ )
                    {
                        if ( !ALPHABET.includes( _params_assoc_array['change_to'][_i] ) )
                        {
                            _err_count++ ;
                            _tmp_error_count++ ;
                            _err_report.push( "Found invalid symbol '"+_params_assoc_array['change_to'][_i]+"', not matching the current alphabet." );
                        }
                    }
    
                    if ( _tmp_error_count == 0 )
                    {
                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The 'TO' group entries have been validated with success", _par_1, _cmd_tag );
                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, "", _par_1, _cmd_tag );
                    }
                       
                    if ( _err_report.length > 0 ) { _b_fail = YES, _error_str = _err_report.join( _glob_crlf ); }
                    else
                    {
                        if ( _params_assoc_array['change_from'].compare_to( _params_assoc_array['change_to'] ) )
                            circles_lib_output( _output_channel, DISPATCH_WARNING, "Symbols change aborted: 'FROM' group matches the 'TO' group", _par_1, _cmd_tag );
                        else if ( _params_assoc_array['change_from'].has_duplicates() )
                            circles_lib_output( _output_channel, DISPATCH_WARNING, "Symbols change aborted: 'FROM' group includes duplicate entries", _par_1, _cmd_tag );
                        else if ( _params_assoc_array['change_to'].has_duplicates() )
                            circles_lib_output( _output_channel, DISPATCH_WARNING, "Symbols change aborted: 'TO' group includes duplicate entries", _par_1, _cmd_tag );
                        else
                        {
                            _tmp_error_count = 0, _err_report.flush();
                            circles_lib_output( _output_channel, DISPATCH_INFO, "Collecting indexes from the 'FROM' group", _par_1, _cmd_tag );
                            var _tmp_var = UNFOUND, _i, _c ;
                            for( _c = 0 ; _c < _params_assoc_array['change_from'].length ; _c++ )
                            {
                                _tmp_var = circles_lib_find_item_index_by_symbol( null, _params_assoc_array['change_from'][_c] );
                                if ( _tmp_var == UNFOUND )
                                {
                                    _tmp_error_count++ ;
                                    _err_report.push( "Seed '"+_params_assoc_array['change_from'][_c]+"' not found in the 'FROM' group." );
                                }
                            }
    
                                 if ( _tmp_error_count == 0 )
                                 circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Indexes collected from the 'FROM' group with success", _par_1, _cmd_tag );
                                 else circles_lib_output( _output_channel, DISPATCH_WARNING, _err_report.join( _glob_crlf ), _par_1, _cmd_tag );
    
                                 circles_lib_output( _output_channel, DISPATCH_INFO, "Collecting index from the 'TO' group", _par_1, _cmd_tag );
                                    _tmp_error_count = 0, _tmp_var = UNFOUND ;
                                 for( _c = 0 ; _c < _params_assoc_array['change_to'].length ; _c++ )
                                 {
                                      _tmp_var = circles_lib_find_item_index_by_symbol( null, _params_assoc_array['change_to'][_c] );
                                      if ( _tmp_var == UNFOUND )
                                      {
                                           _tmp_error_count++ ;
                                           _err_report.push( "Seed '"+_params_assoc_array['change_to'][_c]+"' not found in the 'TO' group." );
                                      }
                                 }
    
                                 if ( _tmp_error_count == 0 )
                                 circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Indexes collected from the 'TO' group with success", _par_1, _cmd_tag );
                                 else circles_lib_output( _output_channel, DISPATCH_WARNING, _err_report.join( _glob_crlf ), _par_1, _cmd_tag );
                                 
                                 if ( _tmp_error_count == 0 )
                                 {
                                      var _map = [], _chunk, _symbol_from = "", _symbol_to = "" ;
                                      // proceed to map indexes
                                      circles_lib_output( _output_channel, DISPATCH_INFO, "Mapping indexes for final change", _par_1, _cmd_tag );
                                      for( _i = 0 ; _i < _params_assoc_array['change_from'].length ; _i++ )
                                      {
                                         _symbol_from = _params_assoc_array['change_from'][_i] ;
                                         _symbol_to = _params_assoc_array['change_to'][_i] ;
                                         _map.push( [ _i, _symbol_from, _symbol_to ] );
                                      }
    
                                      for( _i = 0 ; _i < _map.length ; _i++ )
                                      {
                                         _chunk = _map[_i] ;
                                         _items_array[ _chunk[0] ].original_word = _items_array[ _chunk[0] ].symbol = _chunk[2] ;
                                         circles_lib_output( _output_channel, DISPATCH_INFO, "Turning old '"+_chunk[1]+"' to new '"+_chunk[2]+"'", _par_1, _cmd_tag );
                                         if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) )
                                         _items_array[ _chunk[0] ].inverse_symbol = circles_lib_word_inverse_get( _chunk[2] );
                                      }
                                      
                                      circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Symbols have been changed with success", _par_1, _cmd_tag );
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
        
                               if ( !_inverse || _all ) _items_array[_i].original_word = _items_array[_i].symbol = "" ;
                               if ( _inverse || _all ) _items_array[_i].inverse_symbol = "" ;
                           }
                           
                           var _msg = " have been cleaned" ;
                           _msg = ( !_all ) ? ( ( _inverse ) ? "Inverse symbols" : "Symbols" ) + _msg : "All entries " + _msg ;
                           circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                       }
    
                       if ( _glob_terminal_silent ) _clean_fn();
                       else
                       {
                       		  var _params_array = [] ;
    										     	  _params_array['prepromptquestion'] = null ;
    	                   		 		_params_array['promptquestion'] = "Are you sure to clean all symbols ?" ;
    	                   		 		_params_array['yes_fn'] = function() { _clean_fn(); }
    	                   		 		_params_array['ifquestiondisabled_fn'] = function() { _clean_fn(); }
    	                   		circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
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
                case "init":
                var _auto = _params_assoc_array['auto'] ;
                var _ret_chunk = circles_lib_alphabet_autoconfig_all_symbols( !_glob_terminal_silent, _glob_terminal_silent, _auto, YES, _output_channel );
                var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
                var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Symbols setting proc: memory failure" ;
                if ( _ret_id == 1 ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
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
                        if ( ( !_inverse && _symbol.length > 0 ) || ( _inverse && _inv_symbol.length > 0 ) )
                        _out_array.push( ( !_inverse ) ? _symbol : _inv_symbol );
                    }
                       
                    var _counter = _out_array.length, _out = "" ;
                    if ( _counter > 0 ) _out = _counter + " symbol" + ( ( _counter == 1 ) ? "" : "s" ) + " used : " + _out_array.join( "," );
                    else _out = "No symbols used" ;
                           
                    if ( _inverse ) circles_lib_output( _output_channel, "Inverse param: skipped.", _out, _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_INFO, _out, _par_1, _cmd_tag );
                }
                else { _b_fail = YES, _error_str = _ERR_33_01 ; }
                break ;
                case "release":
                circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "shift":
                if ( _forward && _backward ) { _b_fail = YES, _error_str = "Parameters crash: can't declare both forward and backward direction" ; }
                else
                {
                    var _ret_chunk = circles_lib_symbol_shift( null, ( _forward ? YES : ( ( _backward ) ? NO : YES ) ), NO, YES, _output_channel );
                    var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
                    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Shifting symbols: memory failure" ;
                    if ( _ret_id == 1 )
                    {
                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                        if ( _auto )
                        {
                            _glob_show_symbols_zplane = NO ;
                            var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _output_channel );
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
						if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
    					{
    						_glob_terminal_change = YES ;
    					    circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
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
				var _ret_chunk = circles_lib_symbol_zplane_display(null,null,null,NO,NO,_output_channel);
                var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
                var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Shifting symbols: memory failure" ;
                if ( _ret_id )
                {
					circles_lib_output( _output_channel, DISPATCH_SUCCESS, "symbols are " + ( _glob_show_symbols_zplane ? "shown" : "hidden" ), _par_1, _cmd_tag );
					circles_lib_canvas_render_zplane();
                    if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
              		{
            			_glob_terminal_change = YES ;
                        circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
            		}
                }
                else { _b_fail = YES, _error_str = _ret_msg ; }
                break ;
                default: break ;
            }
         }
    }
    else { _b_fail = YES, _error_str = "Missing input params" ; }
     
    if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}