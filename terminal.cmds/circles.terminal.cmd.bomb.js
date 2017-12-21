function circles_terminal_cmd_bomb()
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
    var _curr_autorefresh_set = _glob_terminal_autorefresh ;
    var _curr_autoinit_set = _glob_terminal_autoinit_enable ;
    var _fail_flag_array = [];
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    else if ( _params.length > 0 )
    {
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['keywords'] = NO ;
        _cmd_params['bomb'] = [] ;
        _cmd_params['all'] = NO ;

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _cmd_terms_dict = [];
    	_cmd_terms_dict.push( "disks", "everything", "figures", "freedraw", "generators", "all",
                                       "html", "items", "symbols", "seeds", "probabilities", "repetends" );
        circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
            else if ( _p.is_one_of_i( "html", "silent" ) ) _cmd_params[_p] = YES ;
            else if ( _p.is_one_of_i( "all", "figures", "symbols", "disks", "freedraw", "seeds", "items", "repetends", "generators", "gensmodel", "probabilities", "everything" ) )
            _cmd_params['bomb'].push( _p );
            else { _b_fail = YES ; _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
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
            var _action = _cmd_params['action'] ;
            switch( _action )
            {
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                default:
                var _bomb_mask = 0 ;
				console.log( _cmd_params['bomb'] );
                if ( _cmd_params['bomb'].length > 0 )
                {
                    var _prompt_question = "<lightblue>The following objects have been selected for bombing:</lightblue>" + _glob_crlf ;
                        _prompt_question += "<snow>"+_cmd_params['bomb'].join( _glob_crlf )+"</snow>" ;
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _prompt_question, _par_1, _cmd_tag );
                    _prompt_question = "Confirm to bomb the above entries ? " ;
  
                    for( var _i = 0 ; _i < _cmd_params['bomb'].length ; _i++ )
                    {
                        switch( _cmd_params['bomb'][_i] )
                        {
                           case "disks": _bomb_mask |= 1 ; break ;
                           case "figures": _bomb_mask |= 2; break ;
                           case "items": _bomb_mask |= 4 ; break ;
                           case "symbols": _bomb_mask |= 8 ; break ;
                           case "all": case "everything": _bomb_mask |= 16 ; break ;
                           case "seeds": _bomb_mask |= 32 ; break ;
                           case "probabilities": _bomb_mask |= 64 ; break ;
                           case "gensmodel": _bomb_mask |= 128 ; break ;
                           case "freedraw": _bomb_mask |= 256 ; break ;
                           case "repetends": _bomb_mask |= 512 ; break ;
				           default: break ;
                        }
                    }
                     
                     if ( _bomb_mask > 0 )
                     {
                          var _bombing = function( _bomb_mask )
                          {
                              _bomb_mask = safe_int( _bomb_mask, 0 );
                              if ( _bomb_mask.match_bit_mask( 1, 16 ) ) // disks
                              {
                                 var _items_n = circles_lib_count_items();
                                 if ( _items_n == 0 ) circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Fail to bomb disks: no entries found", _par_1, _cmd_tag );
                                 else
                                 {
                                    for( var _i = 0 ; _i < _glob_seeds_array.length ; _i++ )
                                    {
                                       if ( is_item_obj( _glob_seeds_array[_i] ) ) _glob_seeds_array[_i].complex_circle = null ;
                                       else circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Missing item at index "+_i+"", _par_1, _cmd_tag );
                                    }
                                    circles_lib_output( OUTPUT_TERMINAL, DISPATCH_SUCCESS, "Disks entries have been bombed with success", _par_1, _cmd_tag );
                                 }
                              }
  
                              if ( _bomb_mask.match_bit_mask( 2, 16 ) ) // figures
                              {
                                 var _items_n = safe_size( _glob_figures_array, 0 );
                                 if ( _items_n == 0 ) circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Fail to bomb figures: no entries found", _par_1, _cmd_tag );
                                 else
                                 {
                                    if ( is_array( _glob_figures_array ) ) _glob_figures_array.flush();
                                    circles_lib_output( OUTPUT_TERMINAL, DISPATCH_SUCCESS, "Figures entries have been bombed with success", _par_1, _cmd_tag );
                                 }
                              }
  
                              if ( _bomb_mask.match_bit_mask( 4, 16 ) ) // items
                              {
                                 var _items_n = circles_lib_count_items();
                                 if ( _items_n == 0 ) circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Fail to bomb items: " + _ERR_33_01, _par_1, _cmd_tag );
                                 else
                                 {
                             	     if ( is_array( _glob_gens_array ) ) _glob_gens_array = [];
                                    if ( is_array( _glob_seeds_array ) ) _glob_seeds_array = [];
                                    circles_lib_output( OUTPUT_TERMINAL, DISPATCH_SUCCESS, "Items (seeds and generators) have been bombed with success", _par_1, _cmd_tag );
                                 }
                              }
  
                              if ( _bomb_mask.match_bit_mask( 8, 16 ) ) // symbols
                              {
                                   var _items_n = circles_lib_count_items();
                                   if ( _items_n == 0 ) circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Fail to bomb symbols: no entries found", _par_1, _cmd_tag );
                                   else
                                   {
                                       var _sd_n = circles_lib_count_seeds() ;
                                       for( var _i = 0 ; _i < _sd_n ; _i++ )
                                       {
                                          if ( is_item_obj( _glob_seeds_array[_i] ) ) _glob_seeds_array[_i].original_word = _glob_seeds_array[_i].symbol = _glob_seeds_array[_i].inverse_symbol = "" ;
                                          else circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Missing item at index "+_i+"", _par_1, _cmd_tag );
                                       }
  
                                       circles_lib_output( OUTPUT_TERMINAL, DISPATCH_SUCCESS, "Symbols have been bombed with success", _par_1, _cmd_tag );
                                   }
                              }
  
                              if ( _bomb_mask.match_bit_mask( 32, 16 ) ) // seeds
                              {
                                   var _items_n = circles_lib_count_items();
                                   if ( _items_n == 0 ) circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Fail to bomb seeds: no entries found", _par_1, _cmd_tag );
                                   else
                                   {
                                       if ( is_array( _glob_seeds_array ) ) _glob_seeds_array = [];
                                       circles_lib_output( OUTPUT_TERMINAL, DISPATCH_SUCCESS, "Seeds have been bombed with success", _par_1, _cmd_tag );
                                   }
                              }
  
                              if ( _bomb_mask.match_bit_mask( 64, 16 ) ) // rnd process probabilities
                              {
                                   var _probs_n = safe_size( _glob_rnd_probability_array, 0 );
                                   if ( _probs_n == 0 ) circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Fail to bomb random process probabilities: no entries found", _par_1, _cmd_tag );
                                   else
                                   {
                                       if ( is_array( _glob_rnd_probability_array ) ) _glob_rnd_probability_array.flush();
                                       circles_lib_output( OUTPUT_TERMINAL, DISPATCH_SUCCESS, "Random process probabilities objects have been bombed with success", _par_1, _cmd_tag );
                                   }
                              }
  
                              if ( _bomb_mask.match_bit_mask( 128, 16 ) ) // generators model
                              {
                                    var _sch_n = circles_lib_gens_model_count();
                                    if ( _sch_n == 0 ) circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Fail to bomb generators list and model: no entries found", _par_1, _cmd_tag );
                                    else
                                    {
                                        if ( is_array( _glob_gens_model_array ) )
                                        {
											_glob_gens_model_array.flush();
		                                    circles_lib_output( OUTPUT_TERMINAL, DISPATCH_SUCCESS, "Generators list and model have been bombed with success", _par_1, _cmd_tag );
										}
                                        else circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Generators list and model are of invalid type", _par_1, _cmd_tag );

                                        if ( is_array( _glob_gens_set_symbols_map_array ) )
                                        {
											_glob_gens_set_symbols_map_array.flush() ;
		                                    circles_lib_output( OUTPUT_TERMINAL, DISPATCH_SUCCESS, "Generators list and model have been bombed with success", _par_1, _cmd_tag );
										}
                                        else circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Generators list and model are of invalid type", _par_1, _cmd_tag );
                                    }
                              }

                              if ( _bomb_mask.match_bit_mask( 512, 16 ) ) // repetends
                              {
                                   var _rep_n = safe_size( _glob_repetends_array, 0 );
                                   if ( _rep_n == 0 ) circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Fail to bomb repetends: no entries found", _par_1, _cmd_tag );
                                   else
                                   {
                                       if ( is_array( _glob_repetends_array ) ) _glob_repetends_array.flush();
                                       circles_lib_output( OUTPUT_TERMINAL, DISPATCH_SUCCESS, "Repetends have been bombed with success", _par_1, _cmd_tag );
                                   }
                              }
							
							if ( _glob_terminal_autorefresh )
							{
								circles_lib_output( OUTPUT_TERMINAL, DISPATCH_INFO, "Detected auto-refresh on", _par_1, _cmd_tag );
								circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _out_channel );
								circles_lib_terminal_interpreter( "refresh wplane clean silent", _glob_terminal, _out_channel );
							}
                          }
  
						var _params_array = [], _pre_prompt = null ;
						_params_array['prepromptquestion'] = null ;
						_params_array['promptquestion'] = _prompt_question ;
						_params_array['yes_fn'] = function() { _bombing( _bomb_mask ); }
						_params_array['ifquestiondisabled_fn'] = function() { _bombing( _bomb_mask ); }
						if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
						else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                     }
                }
				else { _b_fail = YES, _error_str = "Missing input params" ; }
                break ;
            }
        }
    }
    else { _b_fail = YES ; _error_str = "Missing input params" ; }

    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
		circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}