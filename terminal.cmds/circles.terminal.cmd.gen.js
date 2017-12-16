function circles_terminal_cmd_gen()
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
    var _help = NO ;
    var _counter = 0, _skip_final_warning = 0 ;
    var _semaphore_mask = 0 ;
    var _report = [];
    var _fn_ret_val = null ;
    var _cmd_params = [];

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    else if ( _params.length > 0 )
    {
        _cmd_params['action'] = "" ;
        _cmd_params["copy"] = NO ;
        _cmd_params['dump'] = NO ;
        _cmd_params['dump_array'] = null ;
        _cmd_params['dump_operator_index'] = UNDET ;
        _cmd_params['extras'] = [] ;
        _cmd_params['force'] = NO ;
        _cmd_params['items'] = ITEMS_SWITCH_SEEDS ;
        _cmd_params['gens'] = [] ;
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['keywords'] = NO ;
        _cmd_params['inverse'] = NO ;
        _cmd_params['map'] = [] ;
        _cmd_params['plane'] = _glob_target_plane ;
        _cmd_params['rec'] = NO ;
        _cmd_params['reset'] = NO ;
        _cmd_params['roundto'] = _glob_accuracy ;
        _cmd_params['short'] = NO ;
        _cmd_params['words'] = [] ;

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [];
    	_local_cmds_params_array.push( "short", "inverse", "add", "count", "exact", "bomb", "model", "init",
			"list", "noclear", "seeds", "generators", "copy", "force", "reset", "zplane", "wplane", "bip",
    		"html", "release" );
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

        var _p ;
        // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
        var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
        for( var _i = 0 ; _i < _up_to_index ; _i++ )
        {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "add", "count", "exact", "flush", "bomb", "init", "list", "model", "release" ) ) _cmd_params['action'] = _p.toLowerCase();
            else if ( _p.toLowerCase().start_with( "roundto:" ) )
            {
               _p = safe_int( _p.replaceAll( "roundto:", "" ), 0 );
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
            else if ( _p.stricmp( "noclear" ) ) _cmd_params["clear"] = NO ;
            else if ( _p.stricmp( "seeds" ) ) _cmd_params["items"] = ITEMS_SWITCH_SEEDS ;
            else if ( _p.stricmp( "generators" ) ) _cmd_params["items"] = ITEMS_SWITCH_GENS ;
            else if ( _p.is_one_of_i( "copy", "html", "force", "inverse", "rec", "reset", "short", "silent" ) ) _cmd_params[_p] = YES ;
            else if ( _p.is_one_of_i( "zplane", "wplane", "bip" ) )
            {
               if ( _p.stricmp( "zplane" ) ) _cmd_params['plane'] = Z_PLANE ;
               else if ( _p.stricmp( "wplane" ) ) _cmd_params['plane'] = W_PLANE ;
               else if ( _p.is_one_of_i( "bip" ) ) _cmd_params['plane'] = BIP_BOX ;
            }
            else if ( _p.is_one_of_i( "params" ) ) _cmd_params['extras'].push( _p.toLowerCase() );
            else if ( _p.toLowerCase().start_with( "map:" ) )
            {
               _p = _p.replaceAll( "map:", "" );
               var _n = ( _p.includes_i( "," ) ) ? _p.split( "," ).length : 1 ;
               if ( _n == 4 && _semaphore_mask & 1 == 0 )
               {
                  circles_lib_output( _out_channel, DISPATCH_INFO, "Matching input syntax for possible Mobius map", _par_1, _cmd_tag );
                  _cmd_params['class'] = FN_DEF_MOBIUS ;
                  _semaphore_mask |= 1 ;
               }
               var _p1 = _p.count( "(" ), _p2 = _p.count( ")" );
               if ( _p1 + _p2 == 2 && _p.start_with_i( "(" ) && _p.end_with_i( ")" ) )
               _p = _p.replaceAll( [ "(", ")" ], "" );

               _cmd_params['map'].push( _p );
            }
            else if ( _cmd_params['action'].stricmp( "add" ) )
            {
					if ( _cmd_params['inverse'] ) _p = circles_lib_word_inverse_get( _p );
					var _strict_check = _p.one_in( "[", "]", "*" ) ? YES : NO ;
					var _ret = circles_lib_repetends_check_syntax( _glob_seeds_array, _p, _strict_check );
                        _ret = safe_float( _ret, 0 );
                    if ( _ret == REPETEND_TEST_ERR_UNDET )
                    {
                       _b_fail = YES ;
                       _report.push( "The input word '"+_p+"' does not match the current alphabet" );
                       _report.push( "Can't add the input word '"+_p+"' to the gens list" );
                    }
                    else if ( _ret == REPETEND_TEST_ERR_EMPTY_GROUP )
                    {
                       _b_fail = YES ;
                       _report.push( "The "+( _glob_items_switch == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" )+" list is empty, together with the alphabet" );
                       _report.push( "You must input the Mobius maps first" );
                       _report.push( "Can't add the input word '"+_p+"' to the gens list" );
                    }
                    else if ( _ret == REPETEND_TEST_ERR_INVALID_CHARS )
                    {
                       _b_fail = YES ;
                       _report.push( "Found invalid chars in the repetend syntax" );
                       _report.push( "Can't add the input word '"+_p+"' to the gens list" );
                    }
                    else if ( _ret == REPETEND_TEST_ERR_MISSING_ALPHABET ) { _b_fail = YES ; _report.push( "The input generator symbol is empty" ); }
                    else if ( _ret == REPETEND_TEST_ERR_MISSING_INPUT_WORD ) { _b_fail = YES ; _report.push( "Syntax error in the input word '"+_p+"': probably missing brackets or asterisk" ); }
                    else if ( circles_lib_gens_find_entry( _p ) ) { _b_fail = YES ; _report.push( "The input word '"+_p+"' has been already used to build up the model" ); }
                    else
                    {
                       circles_lib_output( _out_channel, DISPATCH_INFO, "Acquired word: "+$.terminal.escape_brackets( _p ), _par_1, _cmd_tag );
					   _cmd_params['gens'].push( _p );
					}

                    if ( safe_size( _report, 0 ) > 0 ) _error_str = _report.join( _glob_crlf );
            }
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
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
            var _round_to = _cmd_params['roundto'], _action = _cmd_params['action'], _gen_symbol = "" ;
            switch( _action )
            {
               case "add":
               var _maps_ref = _cmd_params['map'], _maps_n = safe_size( _maps_ref, 0 );
               if ( _maps_n > 0 )
               {
                  circles_lib_output( _out_channel, DISPATCH_INFO, "Counting input maps: " + _maps_n, _par_1, _cmd_tag );
                  $.each( _maps_ref, function( _i, _map_tag ) {
                            circles_lib_output( _out_channel, DISPATCH_INFO, "Candidate Mobius map for generator #"+(_i+1)+" "+( _b_params_list ? "params list" : "definition" )+" : '"+_map_tag+"'", _par_1, _cmd_tag );
                            var _b_params_list = _map_tag.includes( "," ) ? YES : NO, _mobius_params_array = null ;
                            var _is_repetend = circles_lib_repetends_check_syntax( null, _map_tag );
                            if ( _is_repetend ) _map_tag = circles_lib_repetends_resolve( _map_tag );
                            var _is_word = circles_lib_word_check( _map_tag, _glob_alphabet ) == YES ? YES : NO ;
                            if ( _is_word )
                            {
                              circles_lib_output( _out_channel, DISPATCH_INFO, "Computing the resulting Mobius map from word '"+_map_tag+"'", _par_1, _cmd_tag );
                              if ( safe_size( _glob_alphabet, 0 ) == 0 )
                              {
                                _b_fail = YES, _error_str = "Fail to compute the Mobius map from word '"+_map_tag+"': the current alphabet is empty" ;
                              }
                              else if ( safe_size( _glob_seeds_array, 0 ) == 0 )
                              {
                                _b_fail = YES, _error_str = "Fail to compute the Mobius map from word '"+_map_tag+"': the current seeds list is empty" ;
                              }
                              else
                              {
                                var _mm = circles_lib_word_mobiusmap_get( _map_tag, _glob_seeds_array, _out_channel );
                                if ( is_mobius_map( _mm ) ) _mobius_params_array = _mm.get_params();
                                else
                                {
                                  _b_fail = YES, _error_str = "Fail to compute the Mobius map from word '"+_map_tag+"'" ;
                                }
                              }
                            }
                            else
                            {
                              _mobius_params_array = _b_params_list ? _map_tag.split( "," ) : circles_lib_mobius_mng_extract_params( _map_tag );
                              if ( safe_size( _mobius_params_array, 0 ) == 0 ) _mobius_params_array = null ;
                            }

                            if ( is_array( _mobius_params_array ) && !_b_fail )
                            {
                              if ( safe_size( _mobius_params_array, 0 ) == 4 )
                              {
                                for( var _c = 0 ; _c < 4 ; _c++ )
                                {
                                  if ( is_string( _mobius_params_array[_c] ) )
                                  _mobius_params_array[_c] = parse_complex_from_string( _mobius_params_array[_c] + "" ) ;
                                }

                                var _out_msg = "Extracing params:" ;
                                    _out_msg += _glob_crlf + "a: " + _mobius_params_array[0].formula(YES,YES,_round_to);
                                    _out_msg += _glob_crlf + "b: " + _mobius_params_array[1].formula(YES,YES,_round_to);
                                    _out_msg += _glob_crlf + "c: " + _mobius_params_array[2].formula(YES,YES,_round_to);
                                    _out_msg += _glob_crlf + "d: " + _mobius_params_array[3].formula(YES,YES,_round_to);
                                circles_lib_output( _out_channel, DISPATCH_INFO, _out_msg, _par_1, _cmd_tag );

                                var _mm = new mobius_map( _mobius_params_array );
                                if ( circles_lib_find_item_index_by_map( _glob_seeds_array, _mm ) != UNFOUND )
                                     circles_lib_output( _out_channel, DISPATCH_WARNING, "Can't add entry '"+_map_tag+"': found duplicate Mobius map inside the generators", _par_1, _cmd_tag );
                                else
                                {
                                  var _symbol_lowercase = circles_lib_alphabet_suggest_symbol( _glob_seeds_array, SMALL_LETTER );
                                  var _symbol_uppercase = _symbol_lowercase.toUpperCase();
                                  var _inverse_mm = _mm.inv();
                                  var _array_ref = _cmd_params["items"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
                                  var _dest_ref = _cmd_params["items"] == ITEMS_SWITCH_SEEDS ? "seeds" : "generators" ;

                                  var _CC_01 = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? _mm.inversion_circle() : _mm.isometric_circle();
                                  var screen_CC_01 = circles_lib_complex_to_screen_disk( _CC_01, zplane_sm, _glob_draw_seed_color );
                                  circles_lib_output( _out_channel, DISPATCH_INFO, ( _glob_drawentity == DRAWENTITY_ISOMETRIC_CIRCLE ? "Inversion" : "Isometric" ) + " circle is being associated to map #"+(_i+1), _par_1, _cmd_tag );

                                  var _INV_CC_01 = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? _inverse_mm.inversion_circle() : _inverse_mm.isometric_circle();
                                  circles_lib_output( _out_channel, DISPATCH_INFO, ( _glob_drawentity == DRAWENTITY_ISOMETRIC_CIRCLE ? "Inversion" : "Isometric" ) + " circle is being associated to inverse map #"+(_i+1), _par_1, _cmd_tag );
                                  var screen_INV_CC_01 = circles_lib_complex_to_screen_disk( _INV_CC_01, zplane_sm, _glob_draw_seed_color );

                                  var _old_size = safe_size( _glob_seeds_array, 0 );
                                  _glob_seeds_array.push( new item_obj( _mm, _CC_01, screen_CC_01, _symbol_lowercase, 0,
                                                    YES, _glob_draw_seed_color, NO, _glob_fill_seed_color,
                                                    _symbol_uppercase, 1, ITEM_TYPE_MOBIUS ) );
                                  _glob_seeds_array.push( new item_obj( _inverse_mm, _INV_CC_01, screen_INV_CC_01, _symbol_uppercase, 0,
                                                    YES, _glob_draw_seed_color, NO, _glob_fill_seed_color,
                                                    _symbol_lowercase, 1, ITEM_TYPE_MOBIUS ) );

                                  var _new_size = safe_size( _glob_seeds_array, 0 );
                                  if ( _new_size == _old_size + 2 )
                                  {
                                     _glob_items_to_init = YES ;
                                     circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, _glob_terminal_echo_flag, _out_channel );
                                     circles_lib_output( _out_channel, DISPATCH_SUCCESS, "The input map #"+(_i+1)+" '"+_map_tag+"' has been tagged as '"+_dest_ref+"', parsed and added with success to seeds", _par_1, _cmd_tag );
									 _skip_final_warning = 1 ;
                                     circles_lib_terminal_interpreter( "gen add "+_symbol_lowercase, _glob_terminal, _out_channel );
                                  }
                                  else { _b_fail = YES, _error_str += "Error while trying to register '"+_map_tag+"' definition" + _glob_crlf ; }
                                }
                              }
                              else { _b_fail = YES, _error_str += _glob_crlf + "Invalid input '"+_map_tag+"' definition" ; }
                            }
                            else if ( !is_array( _mobius_params_array ) && !_b_fail )
                            {
                              _b_fail = YES, _error_str += _glob_crlf + "Input '"+_map_tag+"' definition does not refer to a valid Mobius map" ;
                            }
                              }
                            );
               }
               else
               {
                      var _n_gens = safe_size( _cmd_params['gens'], 0 );
                      if ( _n_gens > 0 )
                      {
                          var _added = 0, _copied = 0 ;
                          $.each( _cmd_params['gens'], function( _i, _word ) {
                                if ( !_glob_gens_model_array.includes( _word ) ) { _added++ ; _glob_gens_model_array.push( _word ); }
                                if ( _cmd_params["copy"] && !_glob_storage['words'].includes( _word ) )
                                {
                                    _copied++ ;
                                    _glob_gens_model_array.push( _word );
                                } } );

                          var _msg = _added + " entr" + ( ( _added == 1 ) ? "y" : "ies" ) + " added to the model" ;
                          circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                          if ( circles_lib_plugin_is_visible( "method", "forms" ) ) circles_lib_plugin_dispatcher_unicast_message( 'method', 'forms', 3.21 ) ;
                          if ( _cmd_params["copy"] )
                          {
                              _msg = _copied + " entr" + ( _copied == 1 ? "y" : "ies" ) + " copied into the data storage space" ;
		                          circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
													}
    				              if ( _added > 0 && _out_channel == OUTPUT_TERMINAL )
    				  						{
    													_glob_terminal_change = _glob_gens_set_to_init = YES ;
                              if ( circles_lib_terminal_batch_script_exists() )
    					                circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
    											}
                      }
                      else
                      {
                          if ( _report.length > 0 ) for( var _r = 0 ; _r < _report.length ; _r++ ) circles_lib_output( _out_channel, DISPATCH_WARNING, _report[_r], _par_1, _cmd_tag );
                      }
               }
               break ;
               case "bomb":
               case "flush":
               var _force = _cmd_params['force'] ;
               var _bomb_set = function()
               {
                 circles_lib_gens_bomb();
                 var _sch_n = circles_lib_gens_model_count();
                 if ( _sch_n == 0 )
                 {
                    var _msg = ( _force ? " (force)" : "" ) + " Generators have been "+_action+"ed with success" ;
                    circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
					if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
					{
						_glob_terminal_change = YES ;
					    circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
					}
                    if ( circles_lib_plugin_is_visible( "method", "forms" ) ) circles_lib_plugin_dispatcher_unicast_message( 'method', 'forms', 3.21 ) ;
                 }
                 else circles_lib_output( _out_channel, DISPATCH_ERROR, "Can't flush the generators away: memory failure", _par_1, _cmd_tag );
               }

               var _sch_n = circles_lib_gens_model_count();
               if ( _force ) _bomb_set();
               else if ( _sch_n > 0 )
               {
              		var _params_array = [] ;
					_params_array['prepromptquestion'] = null ;
			        _params_array['promptquestion'] = "Confirm to delete all generators (y|n) ?" ;
			        _params_array['yes_fn'] = function() { _bomb_set(); }
			        _params_array['ifquestiondisabled_fn'] = function() { _bomb_set(); }
					if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
			        else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
               }
               else circles_lib_output( _out_channel, DISPATCH_INFO, "The generators have been already "+_action+"ed", _par_1, _cmd_tag );
               break ;
			   case "count":
               var _html = _cmd_params['html'] ;
               var _gg_n = circles_lib_gens_count();
			   var _msg = _gg_n == 0 ? "The generators list is empty" : "Found "+_gg_n+" generator"+(_gg_n==1?"":"s") ;
               circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
			   break ;
               case "exact":
               var _exact_fn = function()
               {
                   var _ret = circles_lib_gens_model_create_exact( _out_channel );
                   if ( !_ret )
                   {
                      _b_fail = YES, _error_str = "The "+(  _glob_items_switch == ITEMS_SWITCH_SEEDS ? "seed" : "generator" )+", indexed at "+_i+", lacks of symbol.\nGenerators construction has been aborted." ;
                      return NO ;
                   }
                   else return _ret ;
               }

               if ( _sd_n > 0 )
               {
                    var _b_go = 0, _question_counter = 0, _msg = "", _sch_n = circles_lib_gens_model_count();
                    if ( _sch_n > 0 )
                    {
						var _q_params_array = [], _ret, _i ;
						_q_params_array['prepromptquestion'] = "Generators have been already initialized" ;
						_q_params_array['promptquestion'] = "Confirm to overwrite the current model ?" ;
						_q_params_array['yes_fn'] = function() {
							_ret = _exact_fn();
							for( _i = 0 ; _i < _question_counter ; _i++ ) _glob_terminal_out_stream.pop();
							_msg = "The 'exact' generators model has been built with success:" ;
							_msg += _glob_crlf + _sch_n + " new entr" + ( ( _sch_n == 1 ) ? "y" : "ies" );
							circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
						}
						_q_params_array['ifquestiondisabled_fn'] = function() { _exact_fn(); }
						if ( !_glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
        				else circles_lib_terminal_cmd_ask_yes_no( _q_params_array, _out_channel );
                    }
                    else
                    {
						var _ret_id = _exact_fn(), _sch_n = circles_lib_gens_model_count();
						_b_go = _ret_id ;
						if ( _b_go )
						{
							var _msg = "Generators have been built with success." + _glob_crlf ;
	                        _msg += _sch_n + " new entr" + ( _sch_n == 1 ? "y" : "ies" );
							circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
							if ( circles_lib_plugin_is_visible( "method", "forms" ) )
							circles_lib_plugin_dispatcher_unicast_message( 'method', 'forms', 3.21 ) ;
						}
						else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                    }
               }
               else { _b_fail = YES, _error_str = "Can't construct the generators." + _ERR_33_01 ; }
               break ;
               case "init":
               if ( circles_lib_gens_model_exists() )
               {
                    var _ret_chunk = circles_lib_gens_build( _out_channel, YES, _cmd_params['force'], NO, YES );
    				var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
    				var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Memory failure : unknown response" ;
    				if ( _ret_id == NO && _glob_terminal_errors_switch )
    				{
    					_glob_terminal_critical_halt = _b_fail = YES ;
    					_glob_terminal_critical_halt_msg = _error_str = _ret_msg ;
    				}
    				else if ( _ret_id == YES ) circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
    				else circles_lib_output( _out_channel, DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
               }
               else { _b_fail = YES, _error_str = "Missing generators model for initialization" ; }
               break ;
               case "list" :
                var _html = _cmd_params['html'] ;
                var _set_n = circles_lib_gens_model_count(), _gg_n = circles_lib_gens_count();
                if ( _set_n > 0 && _gg_n == 0 )
                circles_lib_output( _out_channel, DISPATCH_WARNING, "Generators need to be initialized first: type 'gen init'", _par_1, _cmd_tag );
				if ( _gg_n == 0 )
				circles_lib_output( _out_channel, DISPATCH_INFO, "The generators list is empty", _par_1, _cmd_tag );
               else if ( _gg_n > 0 )
               {
                    circles_lib_output( _out_channel, DISPATCH_STANDARD, "Retrieving the generators list with maps ...", _par_1, _cmd_tag );
                    var _out_file_txt = "Current Mobius maps" + _glob_crlf.repeat(2), ITEM, _row ;
                    for( var _i = 0 ; _i < _gg_n ; _i++ )
                    {
						ITEM = _glob_gens_array[_i] ;
						_row = is_item_obj( ITEM ) ? circle_terminal_cmd_display_mobiusmap_item( ITEM, _i, _glob_terminal_out_stream, _cmd_params ) : "null map" ;
						if ( _out_channel == OUTPUT_SCRIPT )
						circles_lib_output( _out_channel, DISPATCH_INFO, _row, _par_1, _cmd_tag );
						_out_file_txt += _row + _glob_crlf.repeat(2) ;
                    }

					if ( _html ) circles_lib_terminal_color_decode_htmltext( "<gray>"+_out_file_txt+"</gray>", 'generator', 'right', 'top' );
					if ( _cmd_params['dump'] )
					{
		 				_cmd_params['dump_array'] = is_array( _cmd_params['dump_array'] ) ? _cmd_params['dump_array'][0] : "circles.gens.set.list.txt" ;
						var _ret_chunk = circles_lib_dump_data_to_format( _out_file_txt, _cmd_params['dump_array'] );
						var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
						var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation";
						if ( _ret_id == 0 ) { _b_fail = YES, _error_str = _ret_msg ; }
						else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
					}
               }
               break ;
                case "model":
                var _sch_n = circles_lib_gens_model_count();
                if ( _sch_n > 0 )
                {
                    var _ks = _glob_gens_set_symbols_map_array.keys_associative();
                    var _vs = _glob_gens_set_symbols_map_array.values_associative();
                    var _rs = _glob_rnd_probability_array ;
					var _PROBS_EXIST = is_array( _rs ) ? ( safe_size( _rs, 0 ) > 0 ? YES : NO ) : NO ;
                    var _items_str = "" ;
                    if ( _glob_items_switch == ITEMS_SWITCH_SEEDS ) _items_str = "seeds" ;
                    else if ( _glob_items_switch == ITEMS_SWITCH_GENS ) _items_str = "generators" ;
                    var _row = "<lightblue>Current workarea </lightblue><snow>"+_items_str+"</snow>" ;
                    if ( _PROBS_EXIST )
                    {
		                _row += _glob_crlf + "<banana>Detected random probability table: values will be displayed aside</banana>" ;
		                _row += _glob_crlf + "<khaki>Use 'probability' cmd for random values management</khaki>" ;
					}

                    _row += _glob_crlf.repeat( 2 ) + "<white>The current generators model is</white>" ;
                    _row += _glob_crlf + ( "N." ).rpad( " ", 5 );
                    _row += "<lightblue>"+( "New symbol" ).rpad( " ", 16 )+"</lightblue>";
                    _row += "<lightblue>"+( "Source word" ).rpad( " ", 20 )+"</lightblue>";
                    _row += "<cadetblue>"+( "Resolved word" ).rpad( " ", 20 ) + "</cadetblue>";
                    if ( _PROBS_EXIST ) _row += "<white>"+( new String( "Rnd probability" ) ).rpad( " ", 16 )+"</white>";

                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                    var _gen, _gen_resolved, _symbol ;
                    for( var _i = 0 ; _i < _sch_n ; _i++ )
                    {
						_sym = _ks!= null?_ks[_i]:"", _original = _vs!=null?_vs[_i]:"", _prob = _rs!=null?_rs[_i]:"" ;
						_gen = ( new String( _glob_gens_model_array[_i] ) ).trim();
                        if ( _gen.length > 0 )
                        {
                            _gen_resolved = circles_lib_repetends_resolve( _gen );
                            _symbol = _glob_gens_set_symbols_map_array[ _gen ] ;
                            _row = ( new String( _i + 1 ) ).rpad( " ", 5 );

                            if ( _symbol == undefined )
                            _row += "<gray>" + ( "missing" ).rpad( " ", 16 ) + "</gray>" ;
                            else
                            _row += "<lightblue>" + _symbol.rpad( " ", 16 ) + "</lightblue>" ;

                            _row += "<lightblue>" + $.terminal.escape_brackets( _gen ) + ( new String( "" ) ).rpad( " ", 20 - _gen.length ) + "</lightblue>" ;
                            _row += "<cadetblue>" + _gen_resolved.rpad( " ", 20 ) + "</cadetblue>" ;

					        if ( _PROBS_EXIST ) _row += "<white>"+( new String( _prob + " ("+(_prob*100.0).roundTo(3)+" %)" ).rpad( " ", 16 ) )+"</white>";
							circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                        }
                    }
				}
                else circles_lib_output( _out_channel, DISPATCH_WARNING, "The generators list is empty", _par_1, _cmd_tag );
                break ;
                  case "release":
                  circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default: _b_fail = 1 ; _error_str = "Missing action" ; break ;
            }

            if ( _cmd_params['rec'] || _cmd_params["copy"] )
            {
                var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array, _rec_chunk ;
                if ( _items_array.length > 0 )
                {
                   if ( _cmd_params['reset'] ) _glob_figures_array.flush();
                   var _msg = "" ;

                   if ( _glob_items_switch == ITEMS_SWITCH_SEEDS )
      						 circles_lib_output( _out_channel, "Attempting to register seeds into the figures list", _msg, _par_1, _cmd_tag );
                   else if ( _glob_items_switch == ITEMS_SWITCH_GENS )
          				 circles_lib_output( _out_channel, "Attempting to register gens into the figures list", _msg, _par_1, _cmd_tag );

                   for( var _i = 0 ; _i < _items_array.length ; _i++ )
                   {
                       _rec_chunk = [];
                       _rec_chunk['class'] = FIGURE_CLASS_CIRCLE ;
                       _rec_chunk['obj'] = new circle( _items_array[_i].complex_circle.center, _items_array[_i].complex_circle.radius );
                       _rec_chunk['plane'] = _cmd_params['plane'] ;
                       _rec_chunk['border'] = _items_array[_i].complex_circle.draw ;
                       _rec_chunk['bordercolor'] = _items_array[_i].complex_circle.bordercolor ;
                       _rec_chunk['fill'] = _items_array[_i].complex_circle.fill ;
                       _rec_chunk['fillcolor'] = _items_array[_i].complex_circle.fillcolor ;
                       _rec_chunk['opacity'] = DEFAULT_MAX_OPACITY ;
                       _rec_chunk['bordersize'] = _items_array[_i].complex_circle.bordersize ;
                       _rec_chunk['enabled'] = YES ;
                       _rec_chunk['label'] = "$" + _items_array[_i].symbol ;
                       _rec_chunk['myhash'] = "rec"+_glob_figures_array.length;
                       _rec_chunk['propertiesmask'] = 0 ;
                       _glob_figures_array.push( _rec_chunk );

                       if ( _cmd_params["copy"] )
                       {
                          _glob_storage['figures'].push( _rec_chunk );
                          _msg = "<green>Isometric circle '"+_word+"' copied into data storage space</green>" ;
                          circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                       }
                   }

                   var _b_go = ( _glob_figures_array.length == _items_array.length );
                       _msg = _b_go ? "All gens have been correctly registered into the figures list" : "Warning! Not all gens have been registered into the figures list" ;
    							 circles_lib_output( _out_channel, _b_go ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                }
                else { _b_fail = YES, _error_str = "Can't register as figures: the input items list is empty" ; }
            }
         }
    }
    else { _b_fail = YES, _error_str = "Missing input params" ; }
     
    if ( _glob_gens_set_to_init && !_cmd_params['action'].is_one_of_i( "bomb" ) && !_skip_final_warning )
    circles_lib_output( _out_channel, DISPATCH_WARNING, "Warning !"+_glob_crlf+"Generators need to be init: type 'gen init'.", _par_1, _cmd_tag );

    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
    circles_lib_output( _out_channel, _report.length > 0 ? DISPATCH_WARNING : DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}