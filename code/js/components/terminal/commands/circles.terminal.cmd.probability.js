function circles_terminal_cmd_probability()
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
     var _items_n = circles_lib_count_items();
     var _help = 0 ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];
     var FULL_SUM = 1.0, _alphabet = circles_lib_gens_alphabet_get() ;
     var _decimals = 5 ;

	 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
       _params_assoc_array['action'] = "" ;
       _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
       _params_assoc_array['help'] = NO ;
       _params_assoc_array['keywords'] = NO ;
       _params_assoc_array['settings'] = [] ;
       _params_assoc_array['settings']['rng'] = "" ;
       _params_assoc_array['settings']['warmup'] = UNDET ;
       _params_assoc_array['settings']['repsthreshold'] = UNDET ;
       _params_assoc_array['settings']['repsdepth'] = UNDET ;

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " );       _params_array.clean_from( "" );
        // pre-scan for levenshtein correction
        var _local_cmds_params_array = [];
    	    _local_cmds_params_array.push( "clean", "default", "exact", "list", "set", "help",
                     "built-in", "uniform", "normal", "exponential", "poisson",
                     "gamma", "sine", "release", "html", "repsthreshold", "warmup", "repsdepth" );
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
        var _p ;
        params_loop:
	    for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
           _p = _params_array[_i] ;
           if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
           else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
           else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
           else if ( _p.is_one_of_i( "force", "lock", "silent" ) )
           {
             if ( !is_array( _params_assoc_array['settings']['options'] ) ) _params_assoc_array['settings']['options'] = [] ;
             _params_assoc_array['settings']['options'].push( _p.toLowerCase() );
           }
           else if ( _p.is_one_of_i( "exponential", "gamma", "gaussian", "normal", "poisson", "sine", "built-in", "uniform", "mersenne" ) )
           _params_assoc_array['settings']['rng'] = _p ;
              else if ( _p.start_with_i( "warmup:" ) )
              {
                  var _w = safe_int( _p.replaceAll( "warmup:", "" ), DEFAULT_RND_WARMUP );
                  if ( _w > 0 ) _params_assoc_array['settings']['warmup'] = _w ;
                  else 
                  {
                      _b_fail = YES, _error_str = "warm-up must be strictly positive" ;
                  }
              }
              else if ( _p.start_with_i( "repsthreshold:" ) )
              {
                  var _w = safe_float( _p.replaceAll( "repsthreshold:", "" ), DEFAULT_RND_REPS_THRESHOLD );
                  var _min = 0, _max = 1 ;
                  if ( _w.ranges_in( _min, _max, YES ) ) _params_assoc_array['settings']['repsthreshold'] = _w ;
                  else 
                  {
                      _b_fail = YES, _error_str = "repetends threshold must range from "+_min+" to " + _max ;
                  }
              }
              else if ( _p.start_with_i( "repsdepth:" ) )
              {
                  var _d = safe_int( _p.replaceAll( "repsdepth:", "" ), DEFAULT_RND_REPS_DEPTH );
                  if ( _d > 0 ) _params_assoc_array['settings']['repsdepth'] = _d ;
                  else 
                  {
                      _b_fail = YES, _error_str = "repetends depth must be strictly positive" ;
                  }
              }
              else if ( _p.is_one_of_i( "clean", "default", "exact", "list", "release", "set" ) ) _params_assoc_array['action'] = _p ;
              else if ( _p.testME( _glob_float_regex_pattern ) )
              {
                   if ( _p.includes(".") )
                   {
                      if ( ( _p.split(".")[1] ).length > _decimals )
                      circles_lib_output( _output_channel, DISPATCH_WARNING, "Probability "+_p+" will be rounded to default "+_decimals+" decimal"+(_decimals==1?"":"s"), _par_1, _cmd_tag );
                   }
                   _p = Math.max( safe_float( _p, 0 ), 0 ) ;
                   if ( _p > 0 && _p < FULL_SUM )
                   {
                       if ( !is_array( _params_assoc_array['settings']['probs'] ) ) _params_assoc_array['settings']['probs'] = [] ;
                       _params_assoc_array['settings']['probs'].push( _p ) ;
                   }
                   else
                   {
                       _b_fail = YES, _error_str = "The input probability "+_p+" is illegal: it has to be included inside the open unit interval ]0, "+FULL_SUM+"[" ;
                   }
              }
              else if ( _p.testME( _glob_word_regex_pattern ) )
              {
                       var _lock = is_array( _params_assoc_array['settings']['options'] ) ? ( _params_assoc_array['settings']['options'].includes( "lock" ) ? YES : NO ) : NO ;
                       if ( _lock )
                       {
                          if ( !is_array( _params_assoc_array['settings']['lockedletters'] ) ) _params_assoc_array['settings']['lockedletters'] = [] ;
                          if ( _params_assoc_array['settings']['lockedletters'].includes( _p ) )
                               circles_lib_output( _output_channel, DISPATCH_WARNING, "Word "+_p+" is already locked", _par_1, _cmd_tag );
                          else
                          {
                             _params_assoc_array['settings']['lockedletters'].push( _p ) ;
                             circles_lib_output( _output_channel, DISPATCH_INFO, "Word "+_p+" has been marked as 'locked'", _par_1, _cmd_tag );
                          }
                       }
                       else
                       {
                          if ( !is_array( _params_assoc_array['settings']['letters'] ) ) _params_assoc_array['settings']['letters'] = [] ;
                          if ( _params_assoc_array['settings']['letters'].includes( _p ) )
                               circles_lib_output( _output_channel, DISPATCH_WARNING, "Word "+_p+" has been already acquired", _par_1, _cmd_tag );
                          else
                          {
                             _params_assoc_array['settings']['letters'].push( _p ) ;
                             circles_lib_output( _output_channel, DISPATCH_INFO, "Word "+_p+" has been acquired", _par_1, _cmd_tag );
                          }
                       }
              }
              else
              {
                   _b_fail = YES, _error_str = "Unknown parameter '"+_p+"' : input has been halted" ;
                   break ;
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
              if ( _glob_method != METHOD_ALGEBRAIC || _glob_process != PROCESS_RANDOM )
              {
                   var _msg = "Warning! Probabilities can be managed if method is ALGEBRAIC and process is RANDOM" ;
                   circles_lib_output( _output_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
              }
              else
              {
                   var _action = _params_assoc_array['action'].toLowerCase();
                   switch( _action )
                   {
                        case "release":
                        circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                        break ;
                        case "clean":
                        var _force = is_array( _params_assoc_array['settings']['options'] ) ? ( _params_assoc_array['settings']['options'].includes_i( "force" ) ? YES : NO ) : NO ;
                        var _entries_n = safe_size( _glob_rnd_probability_array, 0 );
                        var removal_fn = function()
                        {
                           _glob_rnd_probability_array.flush();
                           var _new_counter = safe_size( _glob_rnd_probability_array, 0 );
                           var _b_go = _new_counter == 0 ? YES : NO ;
                           var _msg_type = _b_go ? DISPATCH_SUCCESS : DISPATCH_ERROR ;
                           var _msg = _b_go ? "The probability list is empty" : "Memory failure: can't clean values" ;
                           circles_lib_output( _output_channel, _msg_type, _msg, _par_1, _cmd_tag );
                        }

                        if ( _entries_n > 0 )
                        {
		                        if ( _force ) removal_fn();
                            else
                            {
                                var _prompt_question = "Are you sure to remove all values ?" ;
    									     		  var _params_array = [] ;
    											     	  	_params_array['prepromptquestion'] = null ;
    									             	_params_array['promptquestion'] = _prompt_question ;
    									             	_params_array['yes_fn'] = function() { removal_fn(); }
    									             	_params_array['ifquestiondisabled_fn'] = function() { removal_fn(); }
    									          circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                            }
                        }
                        else circles_lib_output( _output_channel, DISPATCH_INFO, "The probability list is already empty", _par_1, _cmd_tag );
                        break ;
                        case "default":
                        case "exact":
                        if ( circles_lib_gens_model_is_exact() )
                        {
                            var _label = _action.strcmp( "exact" ) ? "required" : _action ;
                            _msg = "The current gens config is already classified as 'exact', thus matching the "+_label+" settings." ;
                            circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
                        }
                        else
                        {
                            var default_fn = function()
                            {
                               circles_lib_gens_model_create_exact( _output_channel ) ;
                               _glob_rnd_probability_array = [] ;
                               var _default_value = FULL_SUM / _items_n ;
                               for( var _i = 0 ; _i < _items_n ; _i++ ) _glob_rnd_probability_array[_i] = _default_value ;
                               _glob_probabilityRNGmethod = RNG_BUILT_IN ;
                               _glob_rnd_reps_threshold = DEFAULT_RND_REPS_THRESHOLD ;
                               _glob_rnd_reps_depth = DEFAULT_RND_REPS_DEPTH ;
                               _glob_items_to_init=YES;$('[id$=initBTN]').css('color',COLOR_ERROR) ;
                               circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Random generators set to 'built-in'", _par_1, _cmd_tag );
                            }

                            if ( _items_n > 0 )
                            {
                               var _prompt_question = "Are you sure to restore default values ?" ;
   									     		   var _params_array = [] ;
    											       	 _params_array['prepromptquestion'] = "Default values refer to the 'exact' configuration, i.e. only one-letter gens" ;
    									             _params_array['promptquestion'] = _prompt_question ;
    									             _params_array['yes_fn'] = function()
    															 													 {
    														                                default_fn();
    															                              circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Probability values have been restored to default settings", _par_1, _cmd_tag );
    															                              circles_lib_output( _output_channel, DISPATCH_INFO, "Please, init gens for modifications to take effect", _par_1, _cmd_tag );
    																												 }
   									             	 _params_array['ifquestiondisabled_fn'] = function() { default_fn(); }
    									         circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                            }
                            else circles_lib_output( _output_channel, DISPATCH_INFO, _ERR_33_01, _par_1, _cmd_tag );
                        }
                        break ;
                        case "list":
                        var _pp_n = safe_size( _glob_rnd_probability_array, 0 );
                        var _gens_set_exists = circles_lib_gens_model_exists() ;
                        var _items_n = _gens_set_exists ? circles_lib_count_gens() : circles_lib_count_items() ;
												var _array = _gens_set_exists ? _glob_gens_array : _glob_seeds_array ;
                        if ( _pp_n == 0 )
                        {
														 _b_fail = YES, _error_str = "The probability table is empty" ;
						}
						else if ( _items_n != _pp_n )
                        {
							_b_fail = YES, _error_str = "Mismatch error: the number ("+_pp_n+") of entries in the probability table is not the same as of gens ("+_items_n+")" ;
                             if ( _glob_items_to_init ) _error_str += "\nTry to init gens again." ;
												}
												else
												{
														 if ( _gens_set_exists )
											 			 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Detected generators set with </lightgray><snow>"+_items_n+"</snow> <lightgray>entr"+(_items_n==1?"y":"ies")+"</lightgray>", _par_1, _cmd_tag );
														 
                             var _ks = _glob_gens_set_symbols_map_array.keys_associative();
                             var _vs = _glob_gens_set_symbols_map_array.values_associative();
                             var _rs = _glob_rnd_probability_array ;
                             var _msg, _sym, _original, _prob, _html, _sum = 0.0 ;
                             var _reverse_letters_map = _glob_gens_set_symbols_map_array.swap_keys_vals_associative() ;
                             _html = "<table>" ;
                             _html += "<tr><td HEIGHT=\"8\"></td></tr>" ;
                             _html += "<tr><td STYLE=\"color:white;\">Current symbol</td><td WIDTH=\"15\"></td><td STYLE=\"color:yellow;\">Original word</td><td WIDTH=\"10\"></td><td STYLE=\"color:lightblue;\">Probability</td><td WIDTH=\"15\"></td><td WIDTH=\"50\" STYLE=\"color:white;\">%</td></tr>" ;
                             _html += "<tr><td HEIGHT=\"2\"></td></tr>" ;
														 for( var _i = 0 ; _i < _items_n ; _i++ )
														 {
													 			 _sym = _ks[_i], _original = _vs[_i], _prob = _rs[_i] ;
                                 _sum += _prob ;
                                 _html += "<tr><td STYLE=\"color:white;\">"+_sym+"</td><td WIDTH=\"15\"></td><td STYLE=\"color:yellow;\">"+_original+"</td><td WIDTH=\"10\"></td><td STYLE=\"color:lightblue;\">"+_prob.roundTo(_decimals)+"</td><td WIDTH=\"15\"></td><td STYLE=\"color:white;\">"+(_prob*100.0).roundTo(_decimals)+" %</td></tr>" ;
														 }

                             _html += "<tr><td HEIGHT=\"2\"></td></tr>" ;
                             _html += "<tr><td STYLE=\"color:white;\"></td><td WIDTH=\"15\"></td><td STYLE=\"color:"+(_sum>FULL_SUM?COLOR_ERROR:COLOR_DISABLED)+";\" ALIGN=\"right\">Sum</td><td WIDTH=\"10\"></td><td STYLE=\"color:"+(_sum>FULL_SUM?COLOR_ERROR:"lightblue")+";\">" + _sum + "</td><td WIDTH=\"15\"></td><td STYLE=\"color:"+(_sum>FULL_SUM?COLOR_ERROR:"white")+";\">"+_sum*100.0+" %</td></tr>" ;
                             _html += "<tr><td HEIGHT=\"8\"></td></tr>" ;
                             _html += "</table>" ;
                             circles_lib_terminal_html_display( _glob_terminal, _html ) ;

														 var _msg = "Random numbers generator has been set to " ;
														 switch( _glob_probabilityRNGmethod )
														 {
																	case RNG_BUILT_IN:
                                  _msg += "BUILT-IN" ;
																	break ;
																	case RNG_UNIFORM:
                                  _msg += "UNIFORM" ;
																	break ;
																	case RNG_NORMAL:
                                  _msg += "NORMAL" ;
																	break ;
																	case RNG_EXPONENTIAL:
                                  _msg += "EXPONENTIAL" ;
																	break ;
																	case RNG_POISSON:
                                  _msg += "POISSON" ;
																	break ;
																	case RNG_GAMMA:
                                  _msg += "GAMMA" ;
																	break ;
																	case RNG_MERSENNE_TWISTER:
                                  _msg += "MERSENNE" ;
																	break ;
																	case RNG_COMPLEMENTARY_MULTIPLY_WITH_CARRY:
                                  _msg += "MULTIPLY WITH CARRY" ;
																	break ;
                                  case RNG_MARSAGLIA_ZAMAN:
                                  _msg += "MARSAGLIA-ZAMAN" ;
                                  break ;
																	case RNG_LINEAR_CONGRUENT:
                                  _msg += "LINEAR CONGRUENTIAL GENERATOR" ;
																	break ;
      				                    default: break ;
														 }

 														 circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
 														 circles_lib_output( _output_channel, DISPATCH_INFO, "Repetends threshold is "+_glob_rnd_reps_threshold.roundTo(_decimals)+" ("+(_glob_rnd_reps_threshold*100.0).roundTo(_decimals)+"%)", _par_1, _cmd_tag );
 														 circles_lib_output( _output_channel, DISPATCH_INFO, "Repetends depth is " + _glob_rnd_reps_depth, _par_1, _cmd_tag );
												}
                        break ;
                        case "set":
                        var _force = is_array( _params_assoc_array['settings']['options'] ) ? ( _params_assoc_array['settings']['options'].includes_i( "force" ) ? YES : NO ) : NO ;
                        var _gens_set_exists = circles_lib_gens_model_exists() ;
                        var _items_n = _gens_set_exists ? circles_lib_count_gens() : circles_lib_count_items() ;
                        var _ks = _glob_gens_set_symbols_map_array.keys_associative() ;
						if ( _ks == null ) _ks = [] ;
                        var _vs = _glob_gens_set_symbols_map_array.values_associative();

                        if ( _params_assoc_array['settings']['warmup'] != UNDET )
                        {
                            _glob_rnd_reps_warmup = _params_assoc_array['settings']['warmup'] ;
                            circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Warm-up set to " + _glob_rnd_reps_warmup.roundTo(_decimals), _par_1, _cmd_tag );
                        }

                        if ( _params_assoc_array['settings']['repsthreshold'] != UNDET )
                        {
                            _glob_rnd_reps_threshold = _params_assoc_array['settings']['repsthreshold'] ;
                            circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Repetends threshold set to " + _glob_rnd_reps_threshold.roundTo(_decimals), _par_1, _cmd_tag );
                        }

                        if ( _params_assoc_array['settings']['repsdepth'] != UNDET )
                        {
                            _glob_rnd_reps_depth = _params_assoc_array['settings']['repsdepth'] ;
                            circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Repetends depth set to " + _glob_rnd_reps_depth.roundTo(_decimals), _par_1, _cmd_tag );
                        }

                        if ( safe_size( _params_assoc_array['settings']['rng'], 0 ) > 0 )
                        {
							switch( _params_assoc_array['settings']['rng'] )
							{
								case "built-in": _glob_probabilityRNGmethod = RNG_BUILT_IN ; break ;
								case "uniform": _glob_probabilityRNGmethod = RNG_UNIFORM ; break ;
								case "normal": _glob_probabilityRNGmethod = RNG_NORMAL ; break ;
								case "exponential": _glob_probabilityRNGmethod = RNG_EXPONENTIAL; break ;
								case "poisson": _glob_probabilityRNGmethod = RNG_POISSON; break ;
								case "gamma": _glob_probabilityRNGmethod = RNG_GAMMA; break ;
								case "mersenne": _glob_probabilityRNGmethod = RNG_MERSENNE_TWISTER; break ;
								case "cmwc": _glob_probabilityRNGmethod = RNG_COMPLEMENTARY_MULTIPLY_WITH_CARRY; break ;
                                case "marz": _glob_probabilityRNGmethod = RNG_MARSAGLIA_ZAMAN ; break ;
								case "lcg": _glob_probabilityRNGmethod = RNG_LINEAR_CONGRUENT; break ;
								default:
								_glob_probabilityRNGmethod = RNG_BUILT_IN ;
                                _params_assoc_array['settings']['rng'] = "built-in" ;
                                var _msg = "" ;
                                if ( _params_assoc_array['settings']['rng'].length > 0 )
								_msg = "RNG method "+_params_assoc_array['settings']['rng']+" is not available. Reset to the default 'built-in' method" ;
                                else _msg = "Missing input RNG method. Reset to the default 'built-in' method" ;
                                circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
								break ;
							}
                            circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<green>RNG method has been set up to</green> <white>" + _params_assoc_array['settings']['rng'] + "</white> <green>with success</green>", _par_1, _cmd_tag );
                        }

                        var _letters_arr = _params_assoc_array['settings']['letters'] ;
                        if ( !is_array( _letters_arr ) ) _letters_arr = [] ;
						_alphabet = _letters_arr ;
                        var _locked_letters_arr = _params_assoc_array['settings']['lockedletters'] ;
                        if ( !is_array( _locked_letters_arr ) ) _locked_letters_arr = [] ;
                        var _probabilities_array = _params_assoc_array['settings']['probs'] ;
                        if ( !is_array( _probabilities_array ) ) _probabilities_array = [] ;

                        var _intersection_array = _letters_arr.intersection( _locked_letters_arr, function( a, b ) { return a == b ; } );

                        var _n_intersection = safe_size( _intersection_array, 0 );
                        var _n_locked = safe_size( _locked_letters_arr, 0 ) ;
                        var _n_letters = safe_size( _letters_arr, 0 ) ;
                        var _n_alphabet = safe_size( _alphabet, 0 ) ;
                        var _n_probabilities = safe_size( _probabilities_array, 0 ) ;
                        var _diff = _n_letters - _n_probabilities ;
                        var _min = Math.min( _n_letters, _n_probabilities ) ;
						
						if ( _ks.length == 0 )
						{
                            _b_fail = _glob_terminal_coderun_break = _glob_terminal_critical_halt = YES ;
							_error_str = "" ;
							var _msg = "Probabilities settings must follow after generators settings." ;
								_msg += "\nRefer to 'gensset' cmd with 'add' parameter" ;
								_msg += "\nType 'gensset /h' for full info" ;
                            circles_lib_output( _output_channel, DISPATCH_CRITICAL, _msg, _par_1, _cmd_tag );
						}
						else if ( _n_intersection > 0 )
                        {
                            circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning! Common entries ('"+_intersection_array.join(",")+"') in the entries to be set and to be locked.", _par_1, _cmd_tag );
                            circles_lib_output( _output_channel, DISPATCH_INFO, "Operation has been aborted", _par_1, _cmd_tag );
                        }
                        else if ( _n_locked > 0 && ( _n_locked + _n_letters ) == _n_alphabet && !_force )
                        {
                             circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning! No settings will be applied: all symbols in the generators set have been locked or set as candidates for changes", _par_1, _cmd_tag );
                             circles_lib_output( _output_channel, DISPATCH_INFO, "At least one entry shall be left free for probabilities management", _par_1, _cmd_tag );
                             circles_lib_output( _output_channel, DISPATCH_INFO, "Use 'force' param to skip this warning", _par_1, _cmd_tag );
                        }
                        else if ( _n_letters != _n_probabilities )
                             circles_lib_output( _output_channel, DISPATCH_WARNING, "Words ("+_n_letters+") must match probabilities ("+_n_probabilities+") in number", _par_1, _cmd_tag );
                        else if ( _n_letters > 0 && _n_probabilities > 0 )
                        {
                            if ( _force ) circles_lib_output( _output_channel, DISPATCH_INFO, "Detected 'force' param: attempting to build the probability table from input data ...", _par_1, _cmd_tag );
                            circles_lib_output( _output_channel, DISPATCH_INFO, "Attenpting to modify probability table ...", _par_1, _cmd_tag );
                            if ( safe_size( _glob_rnd_probability_array, 0 ) == 0 )
                            circles_lib_output( _output_channel, DISPATCH_INFO, "Missing probability table: attempting to recover it from input params", _par_1, _cmd_tag );
                            
                            var _input_rnd_array = is_consistent_array( _probabilities_array ) ? _probabilities_array.clone() : _glob_rnd_probability_array.clone() ;
                            if ( safe_size( _input_rnd_array, 0 ) == 0 )
                            {
                              _b_fail = YES, _error_str = "Missing input probabilities" ;
                              _glob_terminal_coderun_break = _glob_terminal_critical_halt = YES ;
                            }
                            else
                            {
                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Acquired "+_n_letters+" letter"+(_n_letters==1?"":"s")+" : <white>"+_letters_arr.join(", ")+"</white>", _par_1, _cmd_tag );
                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Acquired "+_n_probabilities+" probabilit"+(_n_letters==1?"y":"ies")+" : <white>"+_probabilities_array.join(", ")+"</white>", _par_1, _cmd_tag );

                                var _lock_sum = 0, _lock_n = _locked_letters_arr.length ;
                                if ( !_force )
                                $.each( _locked_letters_arr, function( _i, _letter ) { _lock_sum += _glob_rnd_probability_array[ _alphabet.indexOf( _letter ) ] ; } ) ;

                                var _new_prob_sum = 0 ;
                                _probabilities_array.work( function( _prob ){ _new_prob_sum += _prob ; } ) ;
                                _new_prob_sum = _new_prob_sum.roundTo(_decimals);

                                var _residue = FULL_SUM - _lock_sum -_new_prob_sum ;
                                    _residue = _residue.roundTo(_decimals);
                                var _unlocked_n = _n_alphabet - _lock_n - _n_letters ;
                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Resulting residue to recompute <white>"+_unlocked_n+"</white> unlocked value"+(_unlocked_n==1?"":"s")+" is <white>"+_residue+"</white>", _par_1, _cmd_tag );
                                var _rs = _input_rnd_array.clone() ;
                                if ( _diff != 0 )
                                {
                                   circles_lib_output( _output_channel, DISPATCH_WARNING, "Detected mismatch between input letters and probabilities", _par_1, _cmd_tag );
                                   circles_lib_output( _output_channel, DISPATCH_WARNING, "Associations will be set for the " + _min + " entries"+(_min==1?"":"s"), _par_1, _cmd_tag );
                                }
    
                                var _letter, _index, _prob ;
                                for( var _m = 0 ; _m < _min ; _m++ )
                                {
                                    _letter = _letters_arr[_m], _prob = _probabilities_array[_m], _index = _ks.indexOf( _letter );
                                    if ( _input_rnd_array[_m] == null )
                                    {
                                      circles_lib_output( _output_channel, DISPATCH_WARNING, "Reference warning: gen '"+_letter+"' can't be set to probability "+_prob.roundTo(_decimals), _par_1, _cmd_tag );
                                      break ;
                                    }
                                }
    
                                if ( _lock_sum > 0 )
                                {
                                    var _n_entries_to_change = _force ? _n_letters : ( safe_size( _alphabet, 0 ) - _n_letters - _n_locked ) ;
                                    circles_lib_output( _output_channel, DISPATCH_INFO, "Re-distributing the new probabilities to "+_n_entries_to_change+" unlocked entr"+(_n_entries_to_change==1?"y":"ies"), _par_1, _cmd_tag );
                                    var _new_prob = _n_entries_to_change > 0 ? _residue / _n_entries_to_change : UNDET ;
                                    if ( _new_prob != UNDET && _n_entries_to_change > 0 )
                                    {
                                        var _tmp_input = _input_rnd_array.clone();
                                        $.each( _alphabet, function ( _i, _letter )
                                                {
                                                     _index = _vs.indexOf( _letter ) ;
                                                     if ( !( _locked_letters_arr.includes( _letter ) ) )
                                                     {
                                                        _input_rnd_array[_index] = _new_prob ;
                                                        if ( !( _letters_arr.includes( _letter ) ) )
                                                        {
                                                          if ( _input_rnd_array[_index] == null )
                                                          circles_lib_output( _output_channel, DISPATCH_WARNING, "Reference warning: gen '"+_letter+"' can't be reset to probability "+_new_prob.roundTo(_decimals), _par_1, _cmd_tag );
                                                          else
                                                          {
                                                            _input_rnd_array[_index] = _new_prob ;
                                                            circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Gen '"+_letter+"' has been reset to probability "+_new_prob.roundTo(_decimals), _par_1, _cmd_tag );
                                                          }
                                                        }
                                                        else
                                                        {
                                                          var _tmp_i = _letters_arr.indexOf( _letter ) ;
                                                          var _prob = _tmp_i != -1 ? _tmp_input[_tmp_i] : 0.0 ;
                                                          _input_rnd_array[_index] = _prob ;
                                                        }
                                                     }
                                                     else
                                                     {
                                                        var _prob = _glob_rnd_probability_array[_index] ;
                                                        _input_rnd_array[_index] = _prob ;
                                                        circles_lib_output( _output_channel, DISPATCH_WARNING, "Gen '"+_letter+"' has been marked as 'locked' and its probability is kept up at "+_prob, _par_1, _cmd_tag );
                                                     }
                                                } ) ;
                                    }
                                    else if ( _n_entries_to_change == 0 )
                                    circles_lib_output( _output_channel, DISPATCH_WARNING, "No probabilities to change", _par_1, _cmd_tag );
                                    else
                                    {
                                        _b_fail = YES, _error_str = "Final probabilities assignment has been aborted: invalid input value" ;
                                    }
                                }
                            }

                            if ( !_b_fail )
                            {
                                var _checksum = 0, _diff = 0 ;
                                $.each( _alphabet, function( _i, _letter ) { _checksum += safe_float( _input_rnd_array[ _alphabet.indexOf( _letter ) ], 0 ) ; } ) ;
                                // check final sum to 1.0: if so, apply changes, otherwise don't
                                _diff = Math.abs( _checksum - FULL_SUM ) ;
                                if ( _diff > 0 )
                                {
                                    circles_lib_output( _output_channel, DISPATCH_INFO, "Applying final corrections to compensate decimals ...", _par_1, _cmd_tag );
                                    var _gens_left = circles_lib_count_gens_set_model() - _input_rnd_array.length ;
                                    // apply corrections to the remaining entries for compensating full sum
                                    if ( _gens_left > 0 && _diff > 0 )
                                    {
                                        var _quot = _diff / _gens_left ;
                                        for( var _g = 0 ; _g < _gens_left ; _g++ ) _input_rnd_array.push( _quot );
                                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Fixing probability at <white>"+_quot.roundTo(_decimals)+"</white> for each of <white>"+_gens_left+"</white> remaining entr"+(_gens_left==1?"y":"ies"), _par_1, _cmd_tag );
                                    }

                                    var _tmp_sum = 0 ;
                                    for( var _i = 0 ; _i < _input_rnd_array.length ; _i++ ) _tmp_sum += _input_rnd_array[_i] ;
                                    // ... and check it again
                                    _checksum = 0 ;
                                    $.each( _alphabet, function( _i, _letter ) { _checksum += _input_rnd_array[ _alphabet.indexOf( _letter ) ] ; } ) ;
                                }

                                if ( _checksum == FULL_SUM )
                                {
                                    _glob_rnd_probability_array = _input_rnd_array.clone();
                                    circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The probability table has been changed with success", _par_1, _cmd_tag );
                                    if ( circles_lib_plugin_is_visible( "method" ) ) circles_lib_plugin_dispatcher_unicast_message( 'method', 'forms', 3.31 ) ;
                                }
                                else
                                {
                                   _b_fail = YES, _error_str = "No changes applied: the sum "+_checksum+" of probabilities is not "+FULL_SUM ;
								   _glob_terminal_critical_halt = _glob_terminal_coderun_break = YES ;
								   _glob_terminal_critical_halt_msg = "Code run has been halted" ;
                                }
                            }
                        }
                        else if ( _n_letters == 0 && _diff != 0 )
                        circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't set match letters to probabilities: missing letters", _par_1, _cmd_tag );
                        else if ( _n_probabilities == 0 && _diff != 0 )
                        circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't set match letters to probabilities: missing probabilities", _par_1, _cmd_tag );
						
						if ( !_b_fail )
						{
							var _sch_n = circles_lib_count_gens_set_model(), _pp_n = safe_size( _params_assoc_array['settings']['probs'], 0 );
							if ( _sch_n == 0 )
							{
								circles_lib_output( _output_channel, DISPATCH_INFO, "Missing generators set: attempting default generation", _par_1, _cmd_tag );
								var _ret_chunk = circles_lib_gens_set_build( _output_channel, YES, YES, NO, YES );
								var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
								var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Memory failure : unknown response" ;
								if ( _ret_id == 0 )
								{
									_b_fail = YES, _error_str = _ret_msg ;
								}
								else
								{
									_pp_n = _sch_n ;
									circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
								}
							}
						}

                        break ;
	                    default: break ;
                   }
              }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
     }

     if ( _b_fail && _error_str.length > 0 && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}