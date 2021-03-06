_glob_terminal_cmd_files_include[ "dg" ] = [ "init", "circle", "refresh" ] ;

function circles_terminal_cmd_dg()
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
    var _help = NO ;
    var _cmd_params = [];
    var _sd_n = circles_lib_count_seeds();
    var _begin_flag = 0 ;
    var _fn_ret_val = null ;
    var _conjugation_service_cat = [ "apply", "init", "rec", "refresh", "render" ] ;
    var _subgroup_service_cat = [ "info", "init", "rec", "refresh", "render", "show" ] ;
     
    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['keywords'] = NO ;
        _cmd_params['action'] = "" ;
        _cmd_params['class'] = FN_DEF_NONE ;
        _cmd_params['index'] = null ;
        _cmd_params['tag'] = [] ;
        _cmd_params['renametag'] = [] ;
        _cmd_params['map'] = [] ;
        _cmd_params['plane'] = _glob_target_plane ;
        _cmd_params['service'] = [] ;
        _cmd_params['drawentity'] = DRAWENTITY_ISOMETRIC_CIRCLE ;
        _cmd_params['roundto'] = _glob_accuracy ;
        _cmd_params['short'] = NO ;
        _cmd_params['vars'] = [] ;
        _cmd_params['words'] = [] ;
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _cmd_terms_dict = [];
    	_cmd_terms_dict.push( "bomb", "call", "clean", "conjugate", "delete", "defaultmaps", "init", "html",
                    "inversion", "isometric", "list", "renametag", "release", "rec", "refresh", "render",
                    "save", "short", "show", "subgroup", "wplane", "zplane" );
        circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "html", "short", "silent" ) ) _cmd_params[_p] = YES ;
            else if ( _p.includes_i( ":", "$" ) && !( _p.start_with_i( "map:" ) ) )
            {
                var _chunk = _p.split( ":" );
                _cmd_params['vars'][_chunk[0].replaceAll('$','')] = _chunk[1] ;
            }
            else if ( _p.toLowerCase().start_with( "map:" ) )
            {
                _p = _p.replaceAll( "map:", "" );
                var _n = ( _p.includes_i( "," ) ) ? _p.split( "," ).length : 1 ;
                if ( _n == 4 )
                {
                    circles_lib_output( _out_channel, DISPATCH_INFO, "Found input syntax for possible Mobius map", _par_1, _cmd_tag );
                    _cmd_params['class'] = FN_DEF_MOBIUS ;
                }
                var _p1 = _p.count( "(" ), _p2 = _p.count( ")" );
                if ( _p1 + _p2 == 2 && _p.start_with_i( "(" ) && _p.end_with_i( ")" ) ) _p = _p.replaceAll( [ "(", ")" ], "" );
                _cmd_params['map'].push( _p );
                _begin_flag = 2 ;
            }
            else if ( _p.start_with_i( "tag:" ) )
            {
                _cmd_params['tag'].push( _p.replaceAll( "tag:", "" ) );
                _begin_flag = 1 ;
            }
            else if ( _p.toLowerCase().start_with( "roundto:" ) )
            {
                _p = safe_int( _p.replaceAll( "roundto:", "" ), 0 ) ;
                if ( _p <= 0 )
                {
                    _p = _glob_accuracy ;
                    circles_lib_output( _out_channel, DISPATCH_WARNING, "Invalid value or zero detected for 'roundto' param: reset to current setting ("+_glob_accuracy+")", _par_1, _cmd_tag );
                }
                else if ( _p > DEFAULT_MAX_ACCURACY )
                {
                    _p = _glob_accuracy ;
                    circles_lib_output( _out_channel, DISPATCH_WARNING, "Maximum ("+DEFAULT_MAX_ACCURACY+") exceeded by 'roundto' param: reset to current setting ("+_glob_accuracy+")", _par_1, _cmd_tag );
                }
                   
                _cmd_params['roundto'] = _p ;
            }
            else if ( _p.stricmp( "isometric" ) )
            {
                _glob_drawentity = _cmd_params['drawentity'] = DRAWENTITY_ISOMETRIC_CIRCLE ;
                circles_lib_output( _out_channel, DISPATCH_INFO, "Items will be associated to isometric circles", _par_1, _cmd_tag );
            }
            else if ( _p.stricmp( "inversion" ) )
            {
                _glob_drawentity = _cmd_params['drawentity'] = DRAWENTITY_INVERSION_CIRCLE ;
                circles_lib_output( _out_channel, DISPATCH_INFO, "Items will be associated to inversion circles", _par_1, _cmd_tag );
            }
            else if ( _p.is_one_of_i( "zplane", "wplane" ) )
            {
                if ( _p.stricmp( zplane ) ) _cmd_params['plane'] = Z_PLANE ;
                else if ( _p.stricmp( wplane ) ) _cmd_params['plane'] = W_PLANE ;
                _begin_flag = 0 ;
            }
            else if ( _p.is_one_of_i( "bomb", "call", "clean", "conjugate", "delete", "defaultmaps", "list", "renametag", "release", "save", "subgroup" ) )
            {
                _cmd_params['action'] = _p.toLowerCase();
                _begin_flag = 0 ;
            }
            else if ( _p.testME( _glob_positive_integer_regex_pattern ) )
            {
                _cmd_params['index'] = safe_int( _p, UNDET );
                _begin_flag = 0 ;
            }
            else if ( _cmd_params['action'] == "renametag" )
			{
				if ( _cmd_params['tag'].length == 0 ) _cmd_params['tag'] = _p ;
				else if ( _cmd_params['renametag'].length == 0 ) _cmd_params['renametag'] = _p ;
			}
            else if ( _cmd_params['action'].stricmp( "conjugate" ) &&
                      _p.is_one_of_i( "apply", "init", "rec", "refresh", "render" ) )
            {
                _begin_flag = 0 ;
                _cmd_params['service'].push( _p.toLowerCase() );
                if ( _cmd_params['service'].includes( "init", "render" ) )
                {
                    var _msg = "'Render' implies 'init', the latter service will be disabled" ;
                    _cmd_params['service'].delete_entry( "init" );
                    circles_lib_output( _out_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                }
            }
            else if ( _cmd_params['action'].stricmp( "subgroup" ) &&
					 ( _p.is_one_of_i( "info", "init", "rec", "refresh", "render", "show" ) ||
                       _p.testME( _glob_word_regex_pattern ) || circles_lib_repetends_check_syntax( null, _p ) ) )
            {
                   _begin_flag = 0 ;
                   if ( _p.is_one_of_i( "init", "info", "rec", "refresh", "render", "show" ) ) _cmd_params['service'].push( _p.toLowerCase() );
                   else if ( _p.testME( _glob_word_regex_pattern ) && circles_lib_word_check( _p, _glob_alphabet ) ) _cmd_params['words'].push( _p );
                   else if ( circles_lib_repetends_check_syntax( null, _p ) )
                   {
                        var _new_p = circles_lib_repetends_resolve( _p );
                        if ( circles_lib_word_check( _new_p, _glob_alphabet ) ) _cmd_params['words'].push( _p );
                   }

                   if ( _cmd_params['service'].includes_i( "init", "render" ) )
                   {
                        var _msg = "'Render' implies 'init', the latter service will be disabled" ;
                        _cmd_params['service'].delete_entry( "init" );
                        circles_lib_output( _out_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                   }
            }
            else if ( _begin_flag != 0 )
            {
                // left blank for further use
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
        else if ( _cmd_params['service'].includes( "info", "show" ) ) // test if it includes both terms
        {
              _b_fail = YES, _error_str = "Services 'info' and 'show' are not compatible. Just input one" ;
        }
        else if ( !_b_fail )
        {
           var _action = _cmd_params['action'] ;
           var _round_to = _cmd_params['roundto'] ;
           var _service_array = _cmd_params['service'].unique();
           _cmd_params['words'] = _cmd_params['words'].unique();

           switch( _action )
           {
			    case "bomb":
				if ( _glob_groups_table.length > 0 )
				{
					var _params_array = [] ;
					_params_array['prepromptquestion'] = null ;
					_params_array['promptquestion'] = "Confirm to delete all registered groups ? " ;
					_params_array['yes_fn'] = function() { _glob_groups_table = []; circles_lib_output( _out_channel, DISPATCH_SUCCESS, "All entries have been deleted", _par_1, _cmd_tag ); }
					_params_array['ifquestiondisabled_fn'] = function() { _glob_groups_table = []; }
					if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
					else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
				}
				else circles_lib_output( _out_channel, DISPATCH_INFO, "No registered entries", _par_1, _cmd_tag );
				break ;
                case "call":
                var _index = safe_int( _cmd_params['index'], UNDET );
                var _zero_based = ( _index > 0 ) ? _index - 1 : UNDET ;
                var _tag = safe_string( _cmd_params['tag'][0], "" ) ;
                if ( _zero_based == UNDET )
                {
                    _b_fail = YES, _error_str = "Fail to call group #"+_index+": missing or invalid input group index" ;
                }
                else if ( !is_array( _glob_groups_table[_zero_based] ) )
                {
                    _b_fail = YES, _error_str = "Fail to call group #"+_index+": unreferenced input group index" ;
                }
                else
                {
                    function _call_group()
                    {
                        circles_lib_output( _out_channel, DISPATCH_INFO, "Overwriting current group maps", _par_1, _cmd_tag );
                        var _error_append = "" ;
                        var _group_chunk = _glob_groups_table[_zero_based] ;
                        if ( _group_chunk != null )
                        {
                            var _seeds_array = _group_chunk[0] ;
                            var _n_seeds = safe_int( _group_chunk[1], 0 );
                            if ( _n_seeds > 0 && _n_seeds % 2 == 0 )
                            {
                                circles_lib_output( _out_channel, DISPATCH_INFO, "Removing previous entries", _par_1, _cmd_tag );
                                if ( circles_lib_count_seeds() > 0 )
                                {
                                    _glob_seeds_array = [];
                                    for( var _g = 0 ; _g < _n_seeds ; _g++ ) _glob_seeds_array.push( _seeds_array[_g] );
                                }
                                else circles_lib_output( _out_channel, DISPATCH_WARNING, "Operation aborted: can't remove previous entries", _par_1, _cmd_tag );
                            }
                            else if ( _n_seeds == 0 ) _error_append = "Archival group data is empty" ;
                            else _error_append = "Invalid group entries number : " + _n_seeds ;
                        }

                        if ( circles_lib_count_seeds() > 0 && safe_size( _error_append, 0 ) == 0 )
                        {
                            circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Current group has been called with success", _par_1, _cmd_tag );
                            var _ret_id = _dg_cmd_init( _par_1, _out_channel, _cmd_tag );
                            if ( _ret_id == RET_OK ) circles_lib_output( _out_channel, DISPATCH_SUCCESS, "All group members have been init with success", _par_1, _cmd_tag );
							else circles_lib_output( _out_channel, DISPATCH_WARNING, "All group members have not been init with success", _par_1, _cmd_tag );
                        }
                        else circles_lib_output( _out_channel, DISPATCH_ERROR, "Memory error: can't call input group" + ( _glob_crlf + _error_append ) , _par_1, _cmd_tag );
                    }

					var _params_array = [] ;
					_params_array['prepromptquestion'] = "This operation overwrites the current config definitely," ;
					_params_array['prepromptquestion'] += _glob_crlf + "so that previous maps will be unrecoverable" ;
					_params_array['promptquestion'] = "Confirm to call the group #"+_index+" in ? (y/n) : " ;
					_params_array['yes_fn'] = function() { _call_group(); }
					_params_array['ifquestiondisabled_fn'] = function() { _call_group(); }
					if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
					else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                }
                break ;
                case "clean":
                var _len = safe_size( _glob_groups_table, 0 );
                if ( _len == 0 ) circles_lib_output( _out_channel, DISPATCH_WARNING, "The groups list is already empty", _par_1, _cmd_tag );
                else
                {
		     		var _params_array = [] ;
						_params_array['prepromptquestion'] = "Cleaning is irreversible and the whole groups table will be unrecoverable" ;
						_params_array['promptquestion'] = "Confirm to clean the whole groups list ?" ;
						_params_array['yes_fn'] = function() { _glob_groups_table.flush(); }
						_params_array['ifquestiondisabled_fn'] = function() { _glob_groups_table.flush(); }
					if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
					else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                }
                break ;
                case "conjugate":
                var _err_array = [] ;
                var _sd_n = circles_lib_count_seeds();
                var _maps_ref = _cmd_params['map'] ;
                var _maps_n = safe_size( _maps_ref, 0 );
                if ( _sd_n == 0 ) _err_array.push( "No group in use" );
                else if ( _maps_n == 0 ) _err_array.push( "Missing input map(s): type 'map list' or input a valid Mobius map formula to return all available entries" );

                if ( safe_size( _err_array, 0 ) > 0 )
                {
                    _b_fail = YES, _error_str = "Fail to conjugate the current group." + _glob_crlf + _err_array.join( _glob_crlf );
                }
                else if ( safe_size( _service_array, 0 ) == 0 )
                {
                    _b_fail = YES, _error_str = "Missing service(s) param";
                    _error_str += _glob_crlf + "Choose one among: " + _conjugation_service_cat.join( ", " );
                }
                else if ( _sd_n == 0 )
                {
                    _b_fail = YES, _error_str = "Fail to conjugate: missing input seeds";
                }
                else
                {
                    circles_lib_output( _out_channel, DISPATCH_INFO, "Counting input maps: " + _maps_n, _par_1, _cmd_tag );
                    $.each( _maps_ref, function( _i, _map_tag )
                            {
                                circles_lib_output( _out_channel, DISPATCH_INFO, "Candidate map #"+(_i+1)+" tag : '"+_map_tag+"'", _par_1, _cmd_tag );
                                var _chunk = clone( _glob_maps[ _map_tag ] );
                                    if ( safe_size( _chunk, 0 ) == 0 ) _chunk = null ;
                                var _is_built_in = ( _chunk != null ) ? YES : NO ;
                                var _class = ( _cmd_params['class'] != FN_DEF_NONE ) ? _cmd_params['class'] : ( _is_built_in ? safe_int( _chunk[1], FN_DEF_NONE ) : FN_DEF_NONE );
                                var _mobius_params_array = _map_tag.includes( "," ) ? _map_tag.split( "," ) : ( !_is_built_in ? circles_lib_mobius_mng_extract_params( _map_tag ) : null );
                                    if ( safe_size( _mobius_params_array, 0 ) == 0 ) _mobius_params_array = null ;
                                var _is_user_tagined = ( is_array( _mobius_params_array ) );

                                if ( !_is_built_in && !_is_user_tagined )
                                {
                                   _b_fail = YES, _error_str = "There exists no map tagged in the archive as '"+_map_tag+"'" ;
                                   _error_str += _glob_crlf + "or it's invalid because the formula includes syntax errors." ;
                                }
                                else if ( _is_built_in && _class != FN_DEF_MOBIUS )
                                {
                                   _b_fail = YES, _error_str += _glob_crlf + "Map "+_map_tag+" : conjugation applied to entries of 'Mobius map' class exclusively" ;
                                }
                            }
                          );

                    if ( _b_fail ) _error_str += _glob_crlf + "Type 'map list' to return the available maps" ;
                    else
                    {
                        // conjugate the input maps in sequence
                        var _ret_chunk ;
                        $.each( _maps_ref, function( _i, _map_tag ) {
                                    _ret_chunk = _dg_cmd_conjugation( _cmd_params, _service_array, _map_tag, _par_1, _out_channel, _cmd_tag );
                                    if ( _ret_chunk[0] == RET_ERROR )
                                    {
                                       _b_fail = YES, _error_str = _ret_chunk[1] ;
                                       return ;
                                    }
                                } );
                    }
                }
                break ;
                case "defaultmaps":
				var _keys = _glob_maps.keys_associative();
					_keys.sort(function (a, b) {return a.toLowerCase().localeCompare(b.toLowerCase());});
				var _desc = "" ;
				circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightblue>This is the list of default transformations</lightblue>", _par_1, _cmd_tag );
				circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightblue>Refer to 'conjugate' action in the dg help file</lightblue>", _par_1, _cmd_tag );
				_keys.forEach( function( _key )
				{
					_desc =  _glob_maps[_key][6] ;
					_key = _key.rpad( " ", 16 ) ;
					circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<white>"+_key+"</white> <yellow>"+_desc+"</yellow>", _par_1, _cmd_tag );
				} );
                break ;
                case "delete":
                var _tag = is_array( _cmd_params['tag'] ) ? ( _cmd_params['tag'][0] != null ? _cmd_params['tag'][0] : "" ) : "" ;
                var _index = safe_int( _cmd_params['index'], UNDET );
                var _zero_based = _tag.length > 0 ? _dg_cmd_find( _tag ) : ( _index > 0 ? _index - 1 : UNDET ) ;
                if ( _zero_based == UNDET )
                {
                    _b_fail = YES, _error_str = "Missing or invalid input group index" ;
                }
                else if ( !is_array( _glob_groups_table[_zero_based] ) )
                {
                    _b_fail = YES, _error_str = "Invalid input group index" ;
                }
                else
                {
                    function _delete_group()
                    {
                        var _old_n = safe_size( _glob_groups_table, 0 );
                        _glob_groups_table.remove( _zero_based, _zero_based );
                        var _new_n = safe_size( _glob_groups_table, 0 );
                        if ( _new_n == _old_n - 1 )
						{
							if ( _tag.length > 0 )
							circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Group entry tagged as '"+_tag+"' has been deleted with success", _par_1, _cmd_tag );
							else
							circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Group entry indexed as "+_index+" has been deleted with success", _par_1, _cmd_tag );
						}
                        else
                        {
                            _b_fail = YES, _error_str = "Memory error: can't delete input group" ;
                        }
                    }

					var _params_array = [] ;
					_params_array['prepromptquestion'] = null ;
					if ( _tag.length > 0 ) _params_array['promptquestion'] = "Confirm to delete the registered group tagged as '"+_tag+"' ? " ;
					else _params_array['promptquestion'] = "Confirm to delete the registered group with index #"+_index+" ? " ;
					_params_array['yes_fn'] = function() { _delete_group(); }
					_params_array['ifquestiondisabled_fn'] = function() { _delete_group(); }
					if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
					else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                }
                break ;
                case "list":
                var _len = safe_size( _glob_groups_table, 0 );
                var _index = _cmd_params['index'] != null ? safe_int( _cmd_params['index'], 0 ) : null ;
                var _short = safe_int( _cmd_params['short'], NO );
                var _cols = 4, _b_go = 1 ;
				if ( _len == 0 )
				{
					_b_go = 0, _b_fail = YES, _error_str = "List is empty" ;
				}
				if ( _index != null )
				{
					if ( _index == 0 )
					{
						_index = 1 ;
						circles_lib_output( _out_channel, DISPATCH_INFO, "Zero-based index are not allowed: 0 will be turned into 1", _par_1, _cmd_tag );
						_b_go = 1 ;
					}
					if ( _len == 0 ) { _b_go = 0 ; circles_lib_output( _out_channel, DISPATCH_WARNING, "The groups list is empty", _par_1, _cmd_tag ); }
					else if ( _index < 0 ) { _b_go = 0 ; circles_lib_output( _out_channel, DISPATCH_WARNING, "Negative indexes are not allowed", _par_1, _cmd_tag ); }
					else if ( _index > _len )
					{
						var _range_str = _len == 1 ? "(1)" : "(1-"+_len+")" ;
						_b_go = 0 ;
						circles_lib_output( _out_channel, DISPATCH_WARNING, "Index #"+_index+" is out of range "+_range_str, _par_1, _cmd_tag );
					}
				}
                
				if ( _b_go )
                {
                   var _html = "<table><tr><td HEIGHT=\"8\"></td></tr>" ;
                   var _group_chunk = null, _tag, _size ;
                   for( var _i = 0 ; _i < _len ; _i++ )
                   {
                      _group_chunk = _glob_groups_table[ _i ] ;
                      if ( _group_chunk != null )
                      {
                        if ( _index != null && _index != (_i+1) ) continue ;
						_size = safe_int( _group_chunk[1], 0 );
                        _tag = safe_string( _group_chunk[2], "" ).trim();
                        if ( _short ) _html += "<tr><td CLASS=\"general_rounded_corners\" STYLE=\"background-color:#00B900;padding:5px;color:white;\">Group #"+(_i+1)+( safe_size( _tag, 0 ) > 0 ? " - &lsquo;" + _tag + "&rsquo;" : "" )+" - entries "+_size+"</td></tr>" ;
                        else
                        {
                           _html += "<tr><td CLASS=\"general_rounded_corners\" STYLE=\"background-color:#C8C8C8;padding:5px;\" VALIGN=\"top\">" ;
                           _html += "<table>" ;
                           _html += "<tr><td CLASS=\"general_rounded_corners\" COLSPAN=\""+_cols+"\" STYLE=\"background-color:#00B900;padding:5px;color:white;\">Group #"+(_i+1)+( safe_size( _tag, 0 ) > 0 ? " - &lsquo;" + _tag + "&rsquo;" : "" )+"</td></tr>" ;
                           _html += "<tr><td HEIGHT=\"1\"></td></tr>" ;
                           _html += "<tr><td VALIGN=\"top\">" + _dg_cmd_show_group( _group_chunk, _cols ) + "</td></tr>" ;
                           _html += "<tr><td HEIGHT=\"1\"></td></tr>" ;
                           _html += "</table>" ;
                           _html += "</td></tr>" ;
                        }

                        _html += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                      }
                   }

                   _html += "</table>" ;
                   circles_lib_terminal_html_display( _glob_terminal, _html );
                }
                break ;
				case "renametag":
				if ( _cmd_params['tag'] == null )
				circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing source tag", _par_1, _cmd_tag );
				else if ( _cmd_params['renametag'] == null )
				circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing new tag", _par_1, _cmd_tag );
				else
				{
					var _idx = _dg_cmd_find( _cmd_params['tag'] );
					if ( _idx != UNDET )
					{
						_glob_groups_table[_idx][2] = _cmd_params['renametag'] ;
						circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Old tag '"+_cmd_params['tag']+"' has been renamed into '"+_cmd_params['renametag']+"' with success", _par_1, _cmd_tag );
					}
				}
				break ;
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "save":
                var _tag = is_array( _cmd_params['tag'] ) ? ( _cmd_params['tag'][0] != null ? _cmd_params['tag'][0] : "" ) : "" ;
                var _ref_mm_array = _glob_seeds_array ;
                if ( safe_size( _tag, 0 ) == 0 ) circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing group tag", _par_1, _cmd_tag );
                else if ( safe_size( _ref_mm_array, 0 ) > 0 )
                {
                    var _input_group = [];
                    $.each( _ref_mm_array, function( _i, ITEM ) { _input_group.push( ITEM ); } );
                    var _ret_chunk = _dg_cmd_scan_for_duplicates( [ _input_group, safe_size( _input_group, 0 ), _tag ] );
                    var _is_duplicate = safe_int( _ret_chunk[0], NO );
                    var _entry_zero_based_index = _is_duplicate ? safe_int( _ret_chunk[1], UNDET ) : UNDET ;
                    var _entry_tag = _is_duplicate ? safe_string( _ret_chunk[2], "" ) : "" ;
                    if ( _is_duplicate ) circles_lib_output( _out_channel, DISPATCH_WARNING, "Current group has already been tagged as '"+_entry_tag+"', with index #"+(_entry_zero_based_index+1), _par_1, _cmd_tag );
                    else
                    {
                        var _old_n = safe_size( _glob_groups_table, 0 );
                        _glob_groups_table.push( [ _input_group, safe_size( _input_group, 0 ), _tag ] );
                        var _new_n = safe_size( _glob_groups_table, 0 );
                        if ( _new_n == _old_n + 1 ) circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Group in use has been tagged as '"+_tag+"' and saved with success", _par_1, _cmd_tag );
                        else
                        {
                            _b_fail = YES, _error_str = "Fail to save the group in use: memory error" ;
                        }
                    }
                }
                else
                {
                    _b_fail = YES, _error_str = "Fail to save the the group in use: there's no group initialized at the moment" ;
                }
                break ;
                case "subgroup":
                var _tag = is_array( _cmd_params['tag'] ) ? ( _cmd_params['tag'][0] != null ? _cmd_params['tag'][0] : "" ) : "" ;
                var _input_words = _cmd_params['words'] ;
                var _alphabet = circles_lib_alphabet_get();
                var _ws_len = safe_size( _input_words, 0 );
                var _alpha_len = safe_size( _alphabet, 0 );
                if ( safe_size( _tag, 0 ) == 0 ) circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing group tag", _par_1, _cmd_tag );
                else if ( _alpha_len == 0 )
                {
                    _b_fail = YES, _error_str = "Current alphabet is empty: no subgroup can be created" ;
                }
                else if ( safe_size( _service_array, 0 ) == 0 )
                {
                    _b_fail = YES, _error_str = "Missing service(s) param";
                    _error_str += _glob_crlf + "Choose one among: " + _subgroup_service_cat.join( ", " );
                }
                else if ( _ws_len > 0 )
                {
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<yellow>Creation of the input subgroup</yellow>", _par_1, _cmd_tag );
                    circles_lib_output( _out_channel, DISPATCH_INFO, "Checking input words consistence", _par_1, _cmd_tag );
                    var _consistence_check = YES, _consistence_fault_word = "" ;
                    var _word = "", _w_len = 0, _is_repetend = NO, _i, _x ;
                    for( _i = 0 ; _i < _ws_len ; _i++ )
                    {
                        _word = _input_words[_i], _is_repetend = circles_lib_repetends_check_syntax( null, _input_words[_i] ) ? YES : NO ;
                        if ( _is_repetend )
                        {
                            _word = circles_lib_repetends_resolve( _word );
                            circles_lib_output( _out_channel, DISPATCH_INFO, "Found repetend syntax in '"+_input_words[_i]+"' | Resolved to '"+_word+"'", _par_1, _cmd_tag );
                            _input_words[_i] = _word ;
                        }
                        _w_len = _word.length ;
                        for( _x = 0 ; _x < _w_len ; _x++ )
                        {
                            if ( !_alphabet.includes( _word[_x] ) )
                            {
                                _consistence_check = NO ;
                                _consistence_fault_word = _word ;
                                break ;
                            }
                        }
                    }

                    if ( _consistence_check )
                    {
                        circles_lib_output( _out_channel, DISPATCH_INFO, "Building symbols/maps table", _par_1, _cmd_tag );
                        var _symbols_index_array = [] ;
                        for( var _i = 0 ; _i < _sd_n ; _i++ ) _symbols_index_array[ _glob_seeds_array[_i].symbol ] = _i ;

                        circles_lib_output( _out_channel, DISPATCH_INFO, "Computing input words", _par_1, _cmd_tag );
                        var INDEX, _mm = null, G = null, WORD, _symbol, _inv_symbol, _new_group = [];
                        // read each word, build the map, get a symbol, build item obj, add to _new_group
                        for( var _i = 0 ; _i < _ws_len ; _i++ )
                        {
                            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<peacock>>> Computing input word '"+_input_words[_i]+"'</peacock>", _par_1, _cmd_tag );
                            WORD = _input_words[_i] ;
                            _mm = circles_lib_word_mobiusmap_get( WORD, _glob_seeds_array, _out_channel );
                            _symbol = circles_lib_alphabet_suggest_symbol( _new_group, CAPS_LETTER );
                            _inv_symbol = ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) ) ? circles_lib_word_inverse_get( _symbol ) : "" ;
                            _new_group.push( new item_obj( _mm, null, null, _symbol, 0,
                                                           YES, _glob_draw_seed_color, NO, "",
                                                           _inv_symbol, 1, ITEM_TYPE_MOBIUS ) );
                            if ( safe_size( _inv_symbol, 0 ) > 0 )
                            _new_group.push( new item_obj( _mm.inv(), null, null, _inv_symbol, 0,
                                                           YES, _glob_draw_seed_color, NO, "",
                                                           _symbol, 1, ITEM_TYPE_MOBIUS ) );
                            circles_lib_output( _out_channel, DISPATCH_INFO, "word "+_input_words[_i]+" has been computed and resulting map is with symbol '"+_symbol+"'", _par_1, _cmd_tag );
                        }

                        var _g_n = safe_size( _new_group, 0 );
                        if ( _g_n > 0 && _g_n % 2 == 0 )
                        {
                            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lime>Subgroup has been created with success and tagged as '"+_tag+"'</lime>", _par_1, _cmd_tag );
                            if ( safe_size( _service_array, 0 ) == 0 )
                            {
                                circles_lib_output( _out_channel, DISPATCH_INFO, "Missing service: default set to 'show'", _par_1, _cmd_tag );
                                _service_array.push( "show" );
                            }

                            if ( _service_array.includes( "info" ) )
                            {
                                var _html = _dg_cmd_info_group( [ _new_group, safe_size( _new_group, 0 ), _tag  ] );
                                circles_lib_terminal_html_display( _glob_terminal, _html );
                            }
                            else if ( _service_array.includes( "show" ) )
                            {
                                var _html = _dg_cmd_show_group( [ _new_group, safe_size( _new_group, 0 ), _tag  ], 4 );
                                circles_lib_terminal_html_display( _glob_terminal, _html );
                            }

                            if ( _service_array.includes( "rec" ) )
                            {
								var _ret_chunk = _dg_cmd_scan_for_duplicates( [ _new_group, safe_size( _new_group, 0 ), _tag ] );
								var _is_duplicate = safe_int( _ret_chunk[0], NO );
								var _entry_zero_based_index = _is_duplicate ? safe_int( _ret_chunk[1], UNDET ) : UNDET ;
								var _entry_tag = _is_duplicate ? safe_string( _ret_chunk[2], "" ) : "" ;
								if ( _is_duplicate ) circles_lib_output( _out_channel, DISPATCH_WARNING, "Current group has already been tagged as '"+_entry_tag+"', with index #"+(_entry_zero_based_index+1), _par_1, _cmd_tag );
								else
								{
									var _ret_chunk = _dg_cmd_record_group( _new_group, _tag );
									_b_fail = ( safe_int( _ret_chunk[0], RET_ERROR ) == RET_ERROR ) ? YES : NO ;
									var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
									if ( _b_fail ) _error_str = _ret_msg ;
									else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
								}
                            }

                            if ( !_b_fail && _service_array.includes( "render" ) )
                            {
                                var _ret_id = _dg_cmd_init( _par_1, _out_channel, _cmd_tag );
                                if ( _ret_id != RET_ERROR )
                                circles_lib_terminal_interpreter( "refresh wplane silent clean", _glob_terminal, _out_channel );
                            }

                            if ( !_b_fail && _service_array.includes( "refresh" ) )
                            circles_lib_terminal_interpreter( "refresh zplane silent clean", _glob_terminal, _out_channel );
                         }
                         else
                         {
                            _b_fail = YES, _error_str = "Fail to create the subgroup" ;
                         }
                    }
                    else
                    {
                       _b_fail = YES, _error_str = "Consistence check has failed" ;
                       _error_str += _glob_crlf + "The word '"+_word+"' includes letters not matching current alphabet: " + _alphabet.join( ", " );
                    }
                }
                else { _b_fail = YES, _error_str = "Missing words to build up the new subgroup" ; }
                break ;
                default:
                _b_fail = YES, _error_str = "Unknown action '"+_action+"'" ;
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

function _dg_cmd_conjugation( _cmd_params, _service_array, _map_tag, _par_1, _out_channel, _cmd_tag )
{
    var _sd_n = circles_lib_count_seeds();
    var _chunk = clone( _glob_maps[ _map_tag ] );
        if ( safe_size( _chunk, 0 ) == 0 ) _chunk = null ;
    var _is_built_in = ( _chunk != null ) ? YES : NO ;
    var _class = ( _cmd_params['class'] != FN_DEF_NONE ) ? _cmd_params['class'] : ( _is_built_in ? safe_int( _chunk[1], FN_DEF_NONE ) : FN_DEF_NONE );
    var _mobius_params_array = _map_tag.includes( "," ) ? _map_tag.split( "," ) : ( ( !_is_built_in ) ? circles_lib_mobius_mng_extract_params( _map_tag ) : null );
        if ( safe_size( _mobius_params_array, 0 ) == 0 ) _mobius_params_array = null ;
    var _is_user_tagined = ( is_array( _mobius_params_array ) ) ? YES : NO ;
    var _params = [], _b_fail, _error_str ;
    // test if it's a user-defined map or it's taken from the built-in map catalogue
	if ( _is_built_in )
    {
        _params.push( _chunk[2], _chunk[3], _chunk[4], _chunk[5] );
        circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Found input map '"+_map_tag+"'", _par_1, _cmd_tag );
    }
    else if ( _is_user_tagined )
    {
        _params.push( _mobius_params_array[0], _mobius_params_array[1],
                      _mobius_params_array[2], _mobius_params_array[3] );
        circles_lib_output( _out_channel, DISPATCH_INFO, "Input conjugation map: " + _map_tag, _par_1, _cmd_tag );
    }

    var _ref_params = ( _is_built_in ) ? _params : _mobius_params_array ;
    circles_lib_output( _out_channel, DISPATCH_INFO, "Found input param 'a' as " + _ref_params[0], _par_1, _cmd_tag );
    circles_lib_output( _out_channel, DISPATCH_INFO, "Found input param 'b' as " + _ref_params[1], _par_1, _cmd_tag );
    circles_lib_output( _out_channel, DISPATCH_INFO, "Found input param 'c' as " + _ref_params[2], _par_1, _cmd_tag );
    circles_lib_output( _out_channel, DISPATCH_INFO, "Found input param 'd' as " + _ref_params[3], _par_1, _cmd_tag );

    // check consistence of parameters
    if ( _params[0] == null || _params[1] == null || _params[2] == null || _params[3] == null )
    {
        _b_fail = YES, _error_str = "Conjugation failure: not all params are consistent" ;
        _error_str += _glob_crlf + "Please, check maps definition of '"+_map_tag+"'" ;
    }
    else // now validate params
    {
        var _b_ret = YES, _new_group = [];
        // check for variables and replace the related value
        var _n_vars = _cmd_params['vars'].size_associative();
        if ( _n_vars > 0 )
        {
            circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Found "+_n_vars+" user-defined input var" + ( _n_vars == 1 ? "" : "s" ), _par_1, _cmd_tag );
            var _keys = _cmd_params['vars'].keys_associative();
            var _values = _cmd_params['vars'].values_associative();
            $.each( _keys, function( _i, _key )
                    {
                        circles_lib_output( _out_channel, DISPATCH_INFO, "Setting param '"+_key+"' -> " + _cmd_params['vars'][_key], _par_1, _cmd_tag );
                        if ( _params[0].includes( "$" + _key ) ) _params[0] = _params[0].replaceAll( "$" + _key, "("+_cmd_params['vars'][_key]+")" );
                        if ( _params[1].includes( "$" + _key ) ) _params[1] = _params[1].replaceAll( "$" + _key, "("+_cmd_params['vars'][_key]+")" );
                        if ( _params[2].includes( "$" + _key ) ) _params[2] = _params[2].replaceAll( "$" + _key, "("+_cmd_params['vars'][_key]+")" );
                        if ( _params[3].includes( "$" + _key ) ) _params[3] = _params[3].replaceAll( "$" + _key, "("+_cmd_params['vars'][_key]+")" );
                    } );
            circles_lib_output( _out_channel, DISPATCH_INFO, "Validating input params", _par_1, _cmd_tag );
        }

        if ( ( _params[0].includes( "$" ) || _params[1].includes( "$" ) ||
               _params[2].includes( "$" ) || _params[3].includes( "$" ) ) && _glob_terminal_errors_switch )
        {
            _b_fail = _glob_terminal_critical_halt = 1 ;
            _glob_terminal_critical_halt_msg = "Validation failure: var patterns need to be replaced with complex values" ;
            var _param_loc = { 0: "a", 1 : "b", 2 : "c", 3 : "d" } ;
            $.each( _params, function( _i, _p )
                    {
                        if ( _p.includes_i( "$" ) )
                        {
                            var _v = _p.match( /([\$][a-zA-Z]{1,})/g );
                            _glob_terminal_critical_halt_msg += _glob_crlf + _v.length + " unparsed var"+(_v.length!=1?"s":"")+" in param "+_param_loc[_i]+" : " + _v ;
                        }
                    }
                );
              
            _glob_terminal_critical_halt_msg += _glob_crlf + ( _is_built_in ? "Type 'map list' and check built-in formula" : "Check user-defined formula" );
            if ( _out_channel == OUTPUT_TERMINAL )
            circles_lib_output( _out_channel, DISPATCH_WARNING, _glob_terminal_critical_halt_msg, _par_1, _cmd_tag );
        }
        else
        {
            var _parsed_map = circles_lib_mobius_mng_pull_from( _params );
            circles_lib_output( _out_channel, DISPATCH_INFO, "Resulting map " + _glob_crlf + _parsed_map + " after parsing", _par_1, _cmd_tag );
        }

          var _a_complex = circles_lib_math_parse_formula( _params[0] ); // return a string
              _a_complex = parse_complex_from_string( _a_complex + "" ); // return a complex obj
          var _b_complex = circles_lib_math_parse_formula( _params[1] );
              _b_complex = parse_complex_from_string( _b_complex + "" );
          var _c_complex = circles_lib_math_parse_formula( _params[2] );
              _c_complex = parse_complex_from_string( _c_complex + "" );
          var _d_complex = circles_lib_math_parse_formula( _params[3] );
              _d_complex = parse_complex_from_string( _d_complex + "" );

          if ( is_complex( _a_complex ) && is_complex( _b_complex ) &&
               is_complex( _c_complex ) && is_complex( _d_complex ) && !_b_fail )
          {
               circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Validation has been successful", _par_1, _cmd_tag );
               var _mm = new mobius_map( _a_complex, _b_complex, _c_complex, _d_complex );
               var _inv_mm = _mm.inv(), _kg_item = null, _kg_map = null, _tmp ;
               for( var _i = 0 ; _i < _sd_n ; _i++ )
               {
                    _kg_item = _glob_seeds_array[_i], _kg_map = _kg_item.map ;
                    if ( _kg_map != null )
                    {
                        circles_lib_output( _out_channel, DISPATCH_INFO, "Conjugation of seed '"+_kg_item.symbol+"' now", _par_1, _cmd_tag );
                        _kg_map = _mm.composition( _kg_map ).composition( _inv_mm );
                        circles_lib_output( _out_channel, is_mobius_map( _kg_map ) ? DISPATCH_SUCCESS : DISPATCH_WARNING, is_mobius_map( _kg_map ) ? "Conjugation of '"+_kg_item.symbol+"' performed with success" : "Conjugation of '"+_kg_item.symbol+"' failed", _par_1, _cmd_tag );

						var ITEM = new item_obj();
                        ITEM.init_from_obj( _glob_seeds_array[_i] );
                        ITEM.map = _kg_map ;
                        switch( _cmd_params['drawentity'] )
                        {
                            case DRAWENTITY_ISOMETRIC_CIRCLE:
                            ITEM.complex_circle.init_coords_only( _kg_map.isometric_circle() );
                            break ;
                            case DRAWENTITY_INVERSION_CIRCLE:
                            ITEM.complex_circle.init_coords_only( _kg_map.inversion_circle() );
                            break ;
							default: break ;
                        }
                        ITEM.screen_circle = circles_lib_get_screendisk_from_complexdisk( zplane_sm, _glob_seeds_array[_i].complex_circle );
                        _new_group.push( ITEM );
                        if ( _service_array.includes( "apply" ) ) _glob_seeds_array[_i].init_from_obj( ITEM );
                    }
                    else
                    {
                        _b_ret &= NO ;
       					circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing seed map in the current group" + _glob_crlf + "Please, check group consistence", _par_1, _cmd_tag );
                        break ;
                    }
               }

               if ( _service_array.includes( "apply" ) )
               {
               	    circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Conjugation applied to input entries with success", _par_1, _cmd_tag );
                    var _msg = "All entries have been set into the current group" ;
                    if ( !( _service_array.includes( "init" ) ) ) _msg += _glob_crlf + "Now init it and render" ;
               	    circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
               }

               if ( _service_array.includes( "init" ) ) _dg_cmd_init( _par_1, _out_channel, _cmd_tag );
               if ( _service_array.includes( "rec" ) )
               {
                   var _tag = is_array( _cmd_params['tag'] ) ? ( _cmd_params['tag'][0] != null ? _cmd_params['tag'][0] : "" ) : "" ;
                   if ( safe_size( _tag, 0 ) == 0 ) _tag = "Missing definition for group symbol" ;
                   var _ret_chunk = _dg_cmd_record_group( _new_group, _tag );
                       _b_ret = safe_int( _ret_chunk[0], RET_ERROR );
                   var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                   if ( _b_ret == RET_ERROR )
                   circles_lib_output( _out_channel, DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                   else
                   circles_lib_output( _out_channel, _b_ret == RET_WARNING ? DISPATCH_WARNING : DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
               }

               if ( _b_ret != RET_ERROR && _service_array.includes( "render", "refresh" ) )
               jQuery.extend( _glob_seeds_array, _new_group );
               if ( _b_ret != RET_ERROR && _service_array.includes( "render" ) )
               {
                   var _ret_id = _dg_cmd_init( _par_1, _out_channel, _cmd_tag )
                   if ( _ret_id == RET_ERROR ) circles_lib_output( _out_channel, DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                   else circles_lib_output( _out_channel, DISPATCH_SUCCESS,  "All group members have been init with success", _par_1, _cmd_tag );
                   if ( _ret_id != RET_ERROR )
                   circles_lib_terminal_interpreter( "refresh wplane silent clean", _glob_terminal, _out_channel );
               }

               if ( _b_ret != RET_ERROR && _service_array.includes( "refresh" ) )
               circles_lib_terminal_interpreter( "refresh zplane silent clean", _glob_terminal, _out_channel );
          }
          else { _b_fail = YES, _error_str = "Input params validation has failed. Check entries again." ; }
    }

    return [ _b_fail ? RET_ERROR : RET_OK, _error_str ] ;
}

function _dg_cmd_init( _par_1, _out_channel, _cmd_tag )
{
    _glob_init_mask &= ~INIT_FROM_DISKS ;
    _glob_init_mask |= INIT_FROM_MAPS ;
    var _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, YES, YES, _out_channel );
    var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
	if ( _ret_id == RET_OK ) circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _ret_msg, _par_1, _cmd_tag );
    else
	{
		_b_fail = YES, _error_str = _ret_msg ;
        _ret_id = RET_ERROR ;
    }
    return _ret_id ;
}

function _dg_cmd_find( _tag = "" )
{
	var _ret = UNDET ;
	if ( _tag == "" ) return _ret ;
	else
	{
		var _group_chunk ;
		for( var _i = 0 ; _i < _glob_groups_table.length ; _i++ )
		{
			_group_chunk = _glob_groups_table[_i] ;
			if ( _group_chunk != null )
			{
				if ( _group_chunk[2] == _tag )
				{
					_ret = _i ;
					break ;
				}
			}
		}
	}
	return _ret ;
}

function _dg_cmd_scan_for_duplicates( _input_group_chunk )
{
    var _is_duplicate = NO, _group_chunk, _input_group_n = safe_size( _input_group_chunk[0], 0 );
    var _matches = 0, _group, _group_n, _tag = "", _candidate_group = [], _candidate_len = 0, _candidate_tag = "", _t, _g, _i ;
    if ( _input_group_n > 0 )
    {
		_candidate_group = _input_group_chunk[0], _candidate_len = _input_group_chunk[1], _candidate_tag = _input_group_chunk[2] ;
		external_for:
        for( _t = 0 ; _t < _glob_groups_table.length ; _t++ )
        {
            _group = _glob_groups_table[_t][0], _group_n = _glob_groups_table[_t][1], _tag = _glob_groups_table[_t][2] ;
			if ( _candidate_tag.stricmp( _tag ) ) return [ YES, _t, _tag ] ;
			else if ( _group_n != _candidate_len ) continue ;
            _matches = 0 ;
			for( _i = 0 ; _i < _group.length ; _i++ )
			if ( _group[_i].map.is_equal_to( _input_group_chunk[0][_i].map ) ) _matches++ ;

			if ( _matches == _candidate_len )
			{
				_is_duplicate = YES ;
				break external_for ;
			}
        }
    }
    return [ _is_duplicate, UNDET, "" ] ;
}

function _dg_cmd_record_group( _new_group, _tag )
{
    var _ret_chunk = _dg_cmd_scan_for_duplicates( [ _new_group, safe_size( _new_group, 0 ), _tag ] );
    var _is_duplicate = safe_int( _ret_chunk[0], NO );
    var _entry_index = _is_duplicate ? safe_int( _ret_chunk[1], UNDET ) : UNDET ;
    if ( safe_size( _new_group, 0 ) == 0 ) return [ RET_ERROR, "The resulting input subgroup is empty: can't record it" ] ;
    else if ( _is_duplicate ) return [ RET_WARNING, "Found duplicate entry #"+_entry_index+" for input subgroup: can't record" ] ;
    else
    {
        var _old_n = safe_size( _glob_groups_table, 0 );
        _glob_groups_table.push( [ _new_group, safe_size( _new_group, 0 ), _tag ] );
        var _new_n = safe_size( _glob_groups_table, 0 );
        if ( _new_n == _old_n + 1 ) return [ RET_OK, "Input new subgroup "+( safe_size( _tag, 0 ) > 0 ? "'"+_tag+"'" : "" )+" has been recorded with success" ] ;
        else return [ RET_ERROR, "Fail to record the input subgroup: memory error" ] ;
    }
}

function _dg_cmd_show_group( _group_chunk, _cols = 1 )
{
    var _html = "<table>" ;
    var _mm, _symbol, _inv_symbol, _trace ;
    var _entries = ( _group_chunk != null ) ? _group_chunk[0] : [] ;
    var _entries_n = safe_int( _group_chunk[1], 0 );
    var _tag = safe_string( _group_chunk[2], "" );
    for( var _x = 0 ; _x < _entries_n ; _x++ )
    {
        _symbol = _entries[_x].symbol, _inv_symbol = _entries[_x].inverse_symbol ;
        _mm = _entries[_x].map ;
        _trace = _mm != null ? _mm.trace() : new complex(0,0);
		if ( _x % _cols == 0 ) _html += "<tr>" ;
		_html += "<td><table>" ;
        _html += "<tr><td CLASS=\"general_rounded_corners\" STYLE=\"background-color:lime;color:white;padding:5px;\">Symbol <b>"+_symbol+"</b></td></tr>" ;
        _html += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        _html += "<tr><td COLSPAN=\"15\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#3C6FA1;color:white;padding:5px;\">Trace "+_trace.formula(YES,YES,_glob_accuracy)+"</td></tr>" ;
        _html += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        _html += "<tr><td COLSPAN=\"15\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#EAEAEA;padding:5px;\"><table>" ;
        _html += "<tr><td CLASS=\"general_rounded_corners\" STYLE=\"background-color:#D0D0D0;padding:4px;color:#3C6FA1;\">a</td><td WIDTH=\"5\"></td><td ALIGN=\"right\" STYLE=\"color:blue;\">"+( _mm.a.formula(YES,YES,_glob_accuracy) )+"</td></tr>" ;
        _html += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        _html += "<tr><td CLASS=\"general_rounded_corners\" STYLE=\"background-color:#D0D0D0;padding:4px;color:#3C6FA1;\">b</td><td WIDTH=\"5\"></td><td ALIGN=\"right\" STYLE=\"color:blue;\">"+( _mm.b.formula(YES,YES,_glob_accuracy) )+"</td></tr>" ;
        _html += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        _html += "<tr><td CLASS=\"general_rounded_corners\" STYLE=\"background-color:#D0D0D0;padding:4px;color:#3C6FA1;\">c</td><td WIDTH=\"5\"></td><td ALIGN=\"right\" STYLE=\"color:blue;\">"+( _mm.c.formula(YES,YES,_glob_accuracy) )+"</td></tr>" ;
        _html += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        _html += "<tr><td CLASS=\"general_rounded_corners\" STYLE=\"background-color:#D0D0D0;padding:4px;color:#3C6FA1;\">d</td><td WIDTH=\"5\"></td><td ALIGN=\"right\" STYLE=\"color:blue;\">"+( _mm.d.formula(YES,YES,_glob_accuracy) )+"</td></tr>" ;
        _html += "</table></td>" ;
        _html += "</tr></table></td>" ;
		if ( _x % _cols == ( _cols - 1 ) )
		{
			_html += "</tr>" ;
			_html += "<tr><td HEIGHT=\"2\"></td></tr>" ;
		}
		else _html += "<td WIDTH=\"2\"></td>" ;
    }
    _html += "</table>" ;
    return _html ;
}

function _dg_cmd_info_group( _group_chunk )
{
     var _entries = ( _group_chunk != null ) ? _group_chunk[0] : [] ;
     var _entries_n = safe_int( _group_chunk[1], 0 );
     var _tag = safe_string( _group_chunk[2], "" );
     var _html = "<table><tr><td HEIGHT=\"8\"></td></tr>" ;
     for( var _x = 0 ; _x < _entries_n ; _x++ )
     {
         _symbol = _entries[_x].symbol, _inv_symbol = _entries[_x].inverse_symbol ;
         _mm = _entries[_x].map ;
         _trace = _mm.trace();
         _html += "<tr><td COLSPAN=\"3\" CLASS=\"general_rounded_corners_top\" STYLE=\"background-color:#3C6FA1;color:white;padding:5px;\">"+_symbol+" <---> "+_inv_symbol+"</td></tr>" ;
         _html += "<tr><td HEIGHT=\"1\"></td></tr>" ;
         _html += "<tr><td COLSPAN=\"3\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"background-color:#EAEAEA;padding:5px;\"><table WIDTH=\"100%\" STYLE=\"color:#3C6FA1;\">" ;
         _html += "<tr><td WIDTH=\"25\">Trace</td><td WIDTH=\"5\"></td><td ALIGN=\"right\">"+( _trace.formula(YES,YES,_round_to) )+"</td></tr>" ;
         _html += "</table></td></tr>" ;
         _html += "<tr><td HEIGHT=\"5\"></td></tr>" ;
     }
     _html += "</table>" ;
     return _html ;
}