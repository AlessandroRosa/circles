_glob_terminal_cmd_files_include[ "mobius" ] = [ "init", "refresh" ] ;

function circles_terminal_cmd_mobius()
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
    var _index_array = UNDET ;
    var _symbols_array = [] ;
    var _inv_symbols_array = null ;
    var _sd_n = circles_lib_count_seeds();
    var _fn_ret_val = null ;
    var _params_assoc_array = [];
    
    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
         _params_assoc_array['settings'] = [] ;
         _params_assoc_array['settings']['params'] = [] ;
         _params_assoc_array['settings']['action'] = "" ;
         _params_assoc_array['all'] = NO ;
         _params_assoc_array['draw'] = UNDET ;
         _params_assoc_array['drawcolor'] = null ;
         _params_assoc_array['dump'] = NO ;
         _params_assoc_array['dump_array'] = null ;
         _params_assoc_array['dump_operator_index'] = UNDET ;
         _params_assoc_array['extras'] = [] ;
         _params_assoc_array['fill'] = UNDET ;
         _params_assoc_array['fillcolor'] = null ;
		 _params_assoc_array['generator'] = NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['index'] = null ;
         _params_assoc_array['inv_symbol'] = null ;
         _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
         _params_assoc_array['symbol'] = null ;
         _params_assoc_array['linewidth'] = null ;
         _params_assoc_array['off'] = NO ;
         _params_assoc_array['on'] = NO ;
         _params_assoc_array['properties'] = [] ;
         _params_assoc_array['roundto'] = _glob_accuracy ;
         _params_assoc_array['settings']['storagequeue'] = [] ;
         _params_assoc_array['settings']['storagesubset'] = "seeds" ;
         _params_assoc_array['vars'] = [] ;
         _params_assoc_array['notes'] = [] ;

         _params_assoc_array['a'] = null ;
         _params_assoc_array['b'] = null ;
         _params_assoc_array['c'] = null ;
         _params_assoc_array['d'] = null ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    	 var _local_cmds_params_array = [];
    		 _local_cmds_params_array.push( "fill", "nofill", "draw", "nodraw", "on", "off", "disabled" );
    		 _local_cmds_params_array.push( "add", "check", "class", "copy", "delete", "generators", "notes", "find", "fixedpoints", "list",
				 							"generator", "group", "plot", "select", "seeds", "update", "help", "html", "colorize", "decolorize" );
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
            if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.stricmp( "seeds" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
            else if ( _p.stricmp( "generators" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_GENS ;
            else if ( _p.is_one_of_i( "storagein" ) ) _params_assoc_array['settings']['params'].push( _p ) ;
            else if ( _p.start_with( "storagesubset:" ) ) _params_assoc_array['settings']['storagesubset'] = _p.replaceAll( "storagesubset:", "" ) ;
            else if ( _p.stricmp( "all" ) ) _params_assoc_array['all'] = YES ;
            else if ( _p.stricmp( "fill" ) ) _params_assoc_array['fill'] = YES ;
            else if ( _p.stricmp( "nofill" ) ) _params_assoc_array['fill'] = NO ;
            else if ( _p.stricmp( "draw" ) ) _params_assoc_array['draw'] = YES ;
            else if ( _p.stricmp( "nodraw" ) ) _params_assoc_array['draw'] = NO ;
            else if ( _p.stricmp( "off" ) ) _params_assoc_array['off'] = YES ;
            else if ( _p.stricmp( "generator" ) ) _params_assoc_array['generator'] = YES ;
            else if ( _p.is_one_of_i( "add", "assemble", "changesymbol", "check", "colorize", "decolorize", "copy", "delete",
                                      "find", "inverse", "symbol", "list", "notes", "group", "release", "select", "update" ) )
            _params_assoc_array['settings']['action'] = _p.toLowerCase();
            else if ( _p.is_one_of_i( "characteristic", "class", "determinant", "fixedpoints", "circle", "multiplier", "normalize", "trace" ) )
            _params_assoc_array['properties'].push( _p.toLowerCase() );
            else if ( _p.is_one_of_i( "plot", "attr", "params" ) )
            _params_assoc_array['extras'].push( _p.toLowerCase() );
            else if ( ( _p.length == 1 && _p.isAlpha() ) || _p.isNumber() )
            _symbols_array.push( _p );
            else if ( ( ( _p.length == 1 && _p.isAlpha() ) || _p.isNumber() )
                      &&
                      !( _params_assoc_array['settings']['action'].stricmp( "notes" ) )
                    ) _symbols_array.push( _p );
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
            else if ( _p.toLowerCase().start_with( "linewidth:" ) )
            _params_assoc_array['linewidth'] = safe_int( _p.toLowerCase().replaceAll( "linewidth:", "" ), 1 );
			else if ( _p.toLowerCase().start_with( "drawcolor:" )  )
			{
               _p = _p.replaceAll( "drawcolor:", "" );
               if ( circles_lib_colors_is_def( _p ) )
               {
				 _params_assoc_array['drawcolor'] = _p ;
				 _msg = "<lightblue>Draw color has been set to</lightblue> <snow>"+_p+"</snow>" ;
				 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
               }
            }
			else if ( _p.toLowerCase().start_with( "fillcolor:" )  )
			{
               _p = _p.replaceAll( "fillcolor:", "" );
               if ( circles_lib_colors_is_def( _p ) )
               {
				  _params_assoc_array['fillcolor'] = _p ;
				  _msg = "<lightblue>Fill color has been set to</lightblue> <snow>"+_p+"</snow>" ;
				  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
               }
            }
            else if ( _p.includes_i( ":", "(", ",", ")" ) )
            {
               var _p_array = _p.split( ":" );
               var _letter = is_array( _p_array ) ? _p_array[0] : "" ;
               var _value = is_array( _p_array ) ? _p_array[1] : "" ;
               if ( _letter.length == 1 )
               {
                  _value = _value.replaceAll( "(", "").replaceAll( ")", "" );
                  var _v_array = _value.split( "," );
                  if ( ( _letter == "a" || _letter == "b" || _letter == "c" || _letter == "d" ) && is_array( _v_array ) )
                  _params_assoc_array[_letter] = new complex( parseFloat( _v_array[0] ), parseFloat( _v_array[1] ) );
                  else
                  {
                     _b_fail = YES, _error_str = "Input Mobius map param tag '"+_letter+"' is incorrect (ex. 'a','b','c','d')" ;
                  }
               }
               else
               {
                  _b_fail = YES, _error_str = "Input symbol shall be 1-letter long" ;
                  break ;
               }
            }
            else
            {
               if ( _params_assoc_array['settings']['action'].stricmp( "notes" ) ) _params_assoc_array['notes'].push( _p ) ;
               else
               {
                  _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
               }
            }
         }

         var _action = _params_assoc_array['settings']['action'] ;
         var _items_array = _params_assoc_array["item"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
		     var _items_n = circles_lib_count_items( _items_array );
         var _dest_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
         var _category_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
         var _round_to = _params_assoc_array['roundto'] ;
         var _mm = new mobius_map( _params_assoc_array['a'], _params_assoc_array['b'], _params_assoc_array['c'], _params_assoc_array['d'] );
         var _storage_queue_request = _params_assoc_array['settings']['params'].includes_i( "storagein" ) ? YES : NO ;
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
         else if ( !_b_fail )
         {
            // resolve "all" param in terms of alphabet letters
            if ( _params_assoc_array['all'] == YES ) _symbols_array = circles_lib_alphabet_get();
            // convert input numbers or symbols into an array of indexes applying to further actions
            var _selection_indexes_array = [], ITEM ;
            var _all = _params_assoc_array['all'] != null ? _params_assoc_array['all'] : NO ;
            if ( _all )
            {
                _symbols_array = [];
                for( var _i = 0 ; _i < _sd_n ; _i++ )
                {
                   ITEM = _items_array[_i] ;
                   if ( is_item_obj( ITEM ) )
                   {
                      _symbols_array.push( ITEM.symbol );
                      _selection_indexes_array.push( _i );
                   }
                }
            }

            _symbols_array = is_array( _symbols_array ) ? _symbols_array.unique() : null ;
            if ( is_array( _symbols_array ) )
            {
                if ( _symbols_array.length > 0 )
                {
                     var _candidate_index = 0, _candidate_symbol = "" ;
                     for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
                     {
                        if ( _symbols_array[_i].isNumber() )
                        {
                            _candidate_index = safe_int( _symbols_array[_i], UNDET );
                            if ( _candidate_index >= 0 )
                            {
                               if ( is_item_obj( _items_array[_candidate_index] ) )
                               {
                                  _selection_indexes_array.push( _candidate_index );
                                  _symbols_array[_i] = _items_array[_candidate_index].symbol ; // symbol is recovered from index for output messages
                               }
                            }
                        }
                        else if ( _symbols_array[_i].isAlpha() )
                        {
                            _l = circles_lib_find_item_index_by_symbol( _items_array, _symbols_array[_i] );
                            if ( _l != UNFOUND ) _selection_indexes_array.push( _l );
                        }
                     }
                }
                  
                _selection_indexes_array = _selection_indexes_array.unique();
            }

            if ( _action.stricmp( "delete" ) && _params_assoc_array['symbol'] == null )
            {
                // no indexes allowed, only symbols for deletion. So we try to recover symbols from indexes
                if ( _selection_indexes_array.length > 0 )
                {
                   _symbols_array = [];
                   for( var _i = 0 ; _i < _selection_indexes_array.length ; _i++ )
                   {
                       if ( is_item_obj( _items_array[ _selection_indexes_array[_i] ] ) )
                       _symbols_array.push( _items_array[ _selection_indexes_array[_i] ].symbol );
                   }
                }
            }

            switch( _action )
            {
                    case "add" :
                    if ( !is_array( _symbols_array ) ) _symbols_array = [];
                    if ( safe_size( _symbols_array, 0 ) == 0 )
                    {
                          _symbols_array.push( "auto" );
                          circles_lib_output( _output_channel, DISPATCH_INFO, "Missing input symbol: set to 'auto' definition", _par_1, _cmd_tag );
                    }
                    var _symbol = ( _symbols_array.includes_i( "auto" ) ) ? circles_lib_alphabet_suggest_symbol() : _symbols_array[0] ;
                    if ( _selection_indexes_array.length == 0 && is_array( _items_array ) && _symbol.length == 1 )
                    {
                         var _inv_symbol = ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) ) ? circles_lib_word_inverse_get( _symbol ) : "" ;
                         var _old_sd_n = circles_lib_count_items( _items_array );
                         var _cc = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? _mm.inversion_circle() : _mm.isometric_circle();
                         var _screen_cc = circles_lib_complex_to_screen_disk( _cc, zplane_sm );
                         _items_array.push( new item_obj( _mm, _cc, _screen_cc, _symbol, 0,
                                                               _params_assoc_array['draw'] != UNDET ? YES : NO, "",
                                                               _params_assoc_array['fill'] != UNDET ? YES : NO, "",
                                                               _inv_symbol, 1, ITEM_TYPE_MOBIUS ) );
    
                         var _new_sd_n = circles_lib_count_items( _items_array );
                         if ( _new_sd_n == _old_sd_n + 1 )
                         {
                             circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The new Mobius map"+( ( _symbol.length > 0 ) ? " '"+_symbol+"'" : "" )+" has been added", _par_1, _cmd_tag );
                             if ( _storage_queue_request ) _params_assoc_array['settings']['storagequeue'].push( _items_array[_obj_index].copy() );
                         }
                         
                         var _ret_chunk = circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _output_channel );
   										   var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
												 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to dump value" ;
                         if ( _ret_id )
                         {
                             //if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _output_channel );
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
                    else if ( _symbol.length == 0 )
                    {
                        _b_fail = YES, _error_str = "Can't add: symbol is missing" ;
                    }
                    else if ( !is_array( _items_array ) )
                    {
                        _b_fail = YES, _error_str = "Memory failure: can't get current items" ;
                    }
                    else 
                    {
                        var _msg = "Warning: there's already one element with that same symbol ("+_symbol+") or index ("+_selection_indexes_array+")" ;
                        circles_lib_output( _output_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                    }
                    
                    if ( _glob_method == METHOD_NONE ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: a method has to be set up", _par_1, _cmd_tag ); 
                    break ;
                    case "assemble" :
                    if ( is_array( _symbols_array ) && is_array( _symbols_array ) )
                    {
												 var ALPHABET = circles_lib_alphabet_get();
												 // repetends syntax is allowed
									 			 if ( is_array( ALPHABET ) ) ALPHABET.push( "[", ":", "]" );
                         else
                         {
                             _b_fail = YES, _error_str = "Alphabet is not available" ;
                             _sd_n = circles_lib_count_items( _items_array );
                             if ( _sd_n.is_one_of( 0, UNDET ) )
                             _error_str += "\nNo seeds have been input or initialized" ;
                         }
                         
												 if ( _symbols_array.length > 0 && !_b_fail )
												 {
								              var _words_array = [], _mobius_maps_array = [];
															var _passed, WORD, _resolved_gen ;
												 			// check valid syntax
															for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
												 			{
                                   // if the dump operator is met, then the arguments sequence is over
                                   if ( _symbols_array[_i].strcmp( TERMINAL_OPERATOR_DUMP_TO ) ) break ;
                                   
												 					 _resolved_gen = circles_lib_repetends_resolve( _symbols_array[_i] );
															 		 _passed = circles_lib_word_check( _resolved_gen, ALPHABET );
															 		 if ( _passed ) _words_array.push( _resolved_gen );
  																 else
																	 {
																			 _b_fail = YES, _error_str = "Syntax error in input word '"+_symbols_array[_i]+"'" ;
																	 }
															}
                              
															if ( !_b_fail )
															{
																	var G = null, _mm = null, INDEX = 0 ;
                                  for( _i = 0 ; _i < _words_array.length ; _i++ )
																	{
				 		                          WORD = ( new String( _words_array[_i] ) ).trim();
				 		                          if ( WORD.length > 0 )
				 		                          {
																					// construction must be pursued using seeds
                                          _mm = circles_lib_word_mobiusmap_get( WORD, _items_array, _output_channel );
								                          _mobius_maps_array.push( _mm );
																			}
																			else circles_lib_output( _output_channel, DISPATCH_WARNING, "An empty word has been detected", _par_1, _cmd_tag ); 
																	}
																	
																	var _work_mobius_map = new mobius_map();
																	_work_mobius_map = _work_mobius_map.advanced_composition( _mobius_maps_array );

                                  if ( _storage_queue_request )
                                  {
                                      var ITEM = new item_obj( _work_mobius_map ) ;
                                      ITEM.validate( INIT_FROM_MAPS );
                                      _params_assoc_array['settings']['storagequeue'].push( ITEM );
                                  }

                                  var _msg = "Word '"+( _words_array.join( "" ) )+"' was assembled into a Mobius map and params were calculated:" + _glob_crlf ;
                                      _msg += _work_mobius_map.output( null, null, _round_to );
   																circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );

																	if ( _params_assoc_array['dump'] )
																	{
																			 var _ret_chunk = circles_lib_dump_data_to_format( _work_mobius_map,
																		 																							  _params_assoc_array['dump_array'][0],
																																									  _params_assoc_array['dump_array'][1],
																																									  _params_assoc_array['dump_array'][2],
                                                                                    _params_assoc_array['dump_array'][3] );
																			 var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
																			 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to dump value" ;
																			 if ( _ret_id == 0 )
																			 {
																						_b_fail = YES, _error_str = _ret_msg ;
																			 }
																			 else circles_lib_output( _output_channel, ( _ret_id == UNDET ) ? DISPATCH_MULTICOLOR : DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
																	}
															}
												 }
										}
										else
										{
                        _b_fail = YES, _error_str = "No input Mobius maps" ;
										}
                    break ;
                    case "changesymbol":
                    if ( !is_array( _symbols_array ) )
                    {
                         _b_fail = YES, _error_str = "Missing input symbols" ;
                    }
                    else if ( _symbols_array.length == 0 )
                    {
                         _b_fail = YES, _error_str = "Missing input symbols" ;
                    }
                    else if ( _symbols_array.length != 2 )
                    {
                         _b_fail = YES, _error_str = "Two input symbols must be input" ;
                    }
                    else
                    {
                         var _old_symbol = _symbols_array[0], _new_symbol = _symbols_array[1] ;
                         var _index_old = _old_symbol.isNumber() ? safe_int( _old_symbol, UNDET ) : circles_lib_find_item_index_by_symbol( _items_array, _old_symbol );
                         if ( !is_item_obj( _items_array[_index_old] ) ) _index_old = UNDET ;
                         else _old_symbol = safe_string( _items_array[_index_old].symbol, "" ) ;

                         var _inverse_old_symbol = circles_lib_word_inverse_get( _old_symbol );
                         var _inverse_index_old = circles_lib_find_item_index_by_symbol( _items_array, _inverse_old_symbol );
                         var _index_new = circles_lib_find_item_index_by_symbol( _items_array, _new_symbol );
                         
                         if ( _index_old == UNDET )
                         {
                              _b_fail = YES, _error_str = "Can't change: the input source symbol '"+_old_symbol+"' does not exist in the current alphabet" ;
                         }
                         else if ( _inverse_index_old == UNDET )
                         {
                              _b_fail = YES, _error_str = "Can't change: the input source symbol '"+_old_symbol+"' has no inverse item '"+_inverse_old_symbol+"' in the current alphabet" ;
                         }
                         else if ( _index_new != UNDET )
                         {
                              _b_fail = YES, _error_str = "Can't change: the input destination symbol '"+_old_symbol+"' refers to an already existing item" ;
                         }
                         else
                         {
                             _items_array[_index_old].original_word = _items_array[_index_old].symbol = _new_symbol.trim();
                             _items_array[_index_old].inverse_symbol = circles_lib_word_inverse_get( _new_symbol );
                             _items_array[_inverse_index_old].original_word = _items_array[_inverse_index_old].symbol = _items_array[_index_old].inverse_symbol.trim();
                             _items_array[_inverse_index_old].inverse_symbol = _items_array[_index_old].symbol.trim();
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
                    case "check":
                    circles_lib_terminal_disks_check( _output_channel );
                    break ;
                    case "colorize":
                    if ( _items_n > 0 )
                    {
             	     		 var _params_array = [] ;
             					 _params_array['prepromptquestion'] = null ;
             					 _params_array['promptquestion'] = "Confirm to colorize all "+_dest_ref+"? " ;
             					 _params_array['yes_fn'] = function()
                       {
                          var _ret_chunk = circles_lib_colors_colorize( _dest_ref, YES, YES, _output_channel );
                          var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                          var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "47Unknown error" ;
                          circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                       }
             					 _params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_colorize( _dest_ref, YES, YES, _output_channel ); }
             			     circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                    }
                    else
                    {
                        _b_fail = YES, _error_str = "The list of seeds is empty" ;
                    }
                    break ;
                    case "copy":
                    if ( safe_size( _items_array, 0 ) > 0 )
                    {
                        _glob_storage['seeds'] = _items_array.clone();
                        var _check = 1 ;
                        _check &= is_array( _glob_storage['seeds'] ) ;
                        _check &= safe_size( _glob_storage['seeds'], 0 ) > 0 ;
                        var _msg = _check ? "All seeds have been copied into storage space with success" : "Storage destination error: can't perform copy of the seeds" ;
                        circles_lib_output( _output_channel, _check ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                    }
                    else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't copy seeds: " + _ERR_33_01, _par_1, _cmd_tag );
                    break ;
                    case "decolorize":
                    if ( _items_n > 0 )
                    {
            	     		 var _params_array = [] ;
            					 _params_array['prepromptquestion'] = null ;
            					 _params_array['promptquestion'] = "Confirm to decolorize all "+_dest_ref+"? " ;
            					 _params_array['yes_fn'] = function()
                       {
                          var _ret_chunk = circles_lib_colors_decolorize( _dest_ref, YES, YES, _output_channel );
                          var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                          var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "48Unknown error" ;
                          circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                       }
            					 _params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_decolorize( _dest_ref, YES, YES, _output_channel ); }
             			     circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                    }
                    else
                    {
                       _b_fail = YES, _error_str = "The list of seeds is empty" ;
                    }
                    break ;
                    case "delete" :
                    var _all = _params_assoc_array['all'] ;
                    var _old_sd_n = _sd_n ;
                    var _sel_n = safe_size( _selection_indexes_array, 0 );
                    var _prompt_question = "Confirm to delete "+( ( _sel_n == 1 && _all == NO ) ? "this Mobius map and its inverse " : ( ( _all ) ? "the whole group of maps" : "these Mobius maps and their inverse " ) )+"? " ;
                    
                    var _delete_map = function()
                    {
                        if ( _all == NO )
                        {
                        		var _obj_index, _inv_mm_index, _symbol, _new_sd_n, _index ;
                            // can't remove directly by index here, because array renumbering follows after each deletion
                            // so we pick symbols and find related indexes instead
                            for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
                            {
                                _obj_index = circles_lib_find_item_index_by_symbol( _items_array, _symbols_array[_i].trim() );
                                if ( _obj_index != UNDET )
                                {
                                    _old_sd_n = circles_lib_count_items( _items_array );
                                    _symbol = is_item_obj( _items_array[ _obj_index ] ) ? _items_array[ _obj_index ].symbol : "" ;
                                    if ( is_item_obj( _items_array[ _obj_index ] ) )
                                    {
                                        _items_array.remove( _obj_index, _obj_index );
                                        _new_sd_n = circles_lib_count_items( _items_array );
                                        
                                        if ( _new_sd_n < _old_sd_n ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Mobius map "+( safe_size( _symbol, 0 ) == 0 ? "#"+_i : "'"+_symbol+"'" )+" has been deleted with success", _par_1, _cmd_tag );
                                        if ( _new_sd_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Deletion: warning! The Mobius maps list is empty now", _par_1, _cmd_tag );
                                    }
                                    else circles_lib_output( _output_channel, DISPATCH_WARNING, "Deletion: warning! there's no element with symbol '"+_symbol+"'", _par_1, _cmd_tag );

                                    _inv_mm_index = circles_lib_find_item_index_by_inverse_symbol( _items_array, _symbols_array[_i].trim() );
                                    _symbol = is_item_obj( _items_array[ _inv_mm_index ] ) ? _items_array[ _inv_mm_index ].symbol : "" ;
                                    if ( is_item_obj( _items_array[ _inv_mm_index ] ) )
                                    {
                                        _items_array.remove( _inv_mm_index, _inv_mm_index );
                                        _new_sd_n = circles_lib_count_items( _items_array );
                                        if ( _new_sd_n < _old_sd_n ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Mobius map "+( safe_size( _symbol, 0 ) == 0 ? "#"+_i : "'"+_symbol+"'" )+" has been deleted with success", _par_1, _cmd_tag );
                                        if ( _new_sd_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Deletion: warning! The Mobius maps list is empty now", _par_1, _cmd_tag );
                                    }
                                    else circles_lib_output( _output_channel, DISPATCH_WARNING, "Deletion: warning! there's no element with symbol '"+_symbol+"'", _par_1, _cmd_tag );
                                }
                                else circles_lib_output( _output_channel, DISPATCH_WARNING, "Deletion: warning! there's no element with symbol '"+_symbol+"'", _par_1, _cmd_tag ); 
                            }
                        }
                        else if ( _all == YES )
                        {
                             _items_array.flush();
                             if ( _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ) _glob_seeds_array.flush();
                             _new_sd_n = circles_lib_count_items( _items_array );
                             if ( _new_sd_n == 0 ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The Mobius maps list has been emptied with success", _par_1, _cmd_tag );
                        }

                        var _ret_chunk = circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _output_channel );
 											  var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
											  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to dump value" ;
                        if( _ret_id )
                        {
                            _ret_chunk = circles_lib_items_init( null, !_glob_terminal_silent, _glob_terminal_silent, _glob_init_mask, NO, YES, _output_channel );
                            var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                            var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "49Unknown error" ;
                            if ( _ret_id == RET_OK )
                            {
                                if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _output_channel );
                                //if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _output_channel );
                            }
                            else
                            {
                                _b_fail = YES, _error_str = _ret_msg ;
                            }
                        }
                        else
                        {
                           _b_fail = YES, _error_str = _ret_msg ;
                        }
                    }

                    if ( _old_sd_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning! No deletion can be performed: the Mobius maps list is empty", _par_1, _cmd_tag );
                    else if ( _sel_n == 0 && _all == NO ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning! No Mobius map fits the input selection", _par_1, _cmd_tag );
                    else if ( _glob_terminal_silent ) _delete_map();
                    else if ( is_array( _items_array ) )
                    {
				           		  var _params_array = [] ;
										     	  _params_array['prepromptquestion'] = null ;
				             		 		_params_array['promptquestion'] = _prompt_question ;
				             		 		_params_array['yes_fn'] = function() { _delete_map(); }
				             		 		_params_array['ifquestiondisabled_fn'] = function() { _delete_map(); }
				             		circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                    }
                    else if ( !is_array( _items_array ) )
                    {
                        _b_fail = YES, _error_str = "Memory failure: can't get current items" ;
                    }
                    break ;
                    case "find":
                    var ITEM = null, a = [], _sel ;
                    if ( is_array( _items_array ) )
                    {
                        _glob_zplane_selected_items_array.flush();
                        circles_lib_helper_div_remove();
                        for( var _i = 0 ; _i < _selection_indexes_array.length ; _i++ )
                        {
                             _sel = _selection_indexes_array[_i];
                             ITEM = is_array( _items_array ) ? _items_array[ _sel ] : null ;
                             if ( is_item_obj( ITEM ) )
                             {
                                 circle_terminal_cmd_display_mobiusmap_item( ITEM, _sel, _glob_terminal_out_stream, _params_assoc_array );
                                 _glob_zplane_selected_items_array.push( _sel );
                             }
                        }
                        
                        if ( _glob_zplane_selected_items_array.length > 0 )
                        {
                            var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _output_channel );
		  										  var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
														var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to dump value" ;
                            if ( _ret_id ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't find the required map(s)", _par_1, _cmd_tag );
                            else
                            {
                                _b_fail = YES, _error_str = _ret_msg ;
                            }
                        }
                        else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't find the required map(s)", _par_1, _cmd_tag );
                    }
                    else
                    {
                        _b_fail = YES, _error_str = "Memory failure: can't get current items" ;
                    }
                    break ;
                    case "group":
                    var _ret_chunk = null ;
										if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) )
										_ret_chunk = circles_lib_items_init_group_from_maps( YES, YES, YES, YES, NO, _output_channel ) ;
										else if ( _glob_method.is_one_of( METHOD_INVERSION ) )
										_ret_chunk = circles_lib_items_init_group_from_disks( YES, YES, YES, YES, NO, _output_channel )
										else _ret_chunk = [ 0, "Current method does not support this feature" ] ;

                    var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Memory failure" ;
                    if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _output_channel );
                    //if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _output_channel );
                    if ( _ret_id == 0 ) circles_lib_output( _output_channel, DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                    else
                    {
    			              if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
    			  						{
    												_glob_terminal_change = YES ;
    				                circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
    										}

                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                    }
                    break ;
                    case "inverse" :
                    var _insert_inverse_mm_obj = function( ITEM, _cand_index, _output_channel )
                    {
                        _cand_index = safe_int( _cand_index, UNFOUND );
                        var _old_sd_n = circles_lib_count_items( _items_array );
                        var _inv_item_obj = ITEM.inv();
                        var _candidate_symbol = _inv_item_obj.symbol ;
                        
                        if ( _cand_index == UNFOUND ) _items_array.push( _inv_item_obj );
                        else _items_array[ _cand_index ] = _inv_item_obj ;
                            
                        var _new_sd_n = circles_lib_count_items( _items_array );
                        if ( ( _cand_index == UNFOUND && _new_sd_n == _old_sd_n + 1 ) ||
                             ( _cand_index != UNFOUND && _new_sd_n == _old_sd_n )
                           ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Inverse Mobius map with symbol '"+_candidate_symbol+"' has been "+( _cand_index == UNFOUND ? "added" : "replaced" )+" with success", _par_1, _cmd_tag );
                        else circles_lib_output( _output_channel, DISPATCH_ERROR, "Failure while inserting the inverse Mobius map", _par_1, _cmd_tag );

                        circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _output_channel );
                        if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
                 			  {
                         		_glob_terminal_change = YES ;
                            circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
                        }

                        if ( _storage_queue_request )
                        _params_assoc_array['settings']['storagequeue'].push( _inv_item_obj );
                    }

                    if ( _symbols_array.length == 0 && _selection_indexes_array.length > 0 )
                    {
                        _b_fail = YES, _error_str = "No action performed: here symbols are required here, in place of indexes" ;
                    }
                    else if ( is_array( _selection_indexes_array ) && is_array( _items_array ) )
                    {
                        var _sel_n = safe_size( _selection_indexes_array, 0 ), _symbol, _inv_symbol, _inverse_symbol_index, _prompt_question ;
                        if ( _sel_n > 0 )
                        {
                            var _entries_n = _sel_n, ITEM, _obj_index, _i, _c ;
                            for( _i = 0 ; _i < _entries_n; _i++ )
                            {
                                _obj_index = _selection_indexes_array[_i] ;
                                ITEM = is_array( _items_array ) ? _items_array[_obj_index] : null ;
                                if ( _obj_index != UNDET && is_item_obj( ITEM ) )
                                {
                                     _symbol = ITEM.symbol ;
                                     _inv_symbol = ITEM.inverse_symbol ;
                                     _inverse_symbol_index = circles_lib_find_item_index_by_symbol( _items_array, _inv_symbol );
                                     if ( _inverse_symbol_index == UNFOUND )
                                     _insert_inverse_mm_obj( ITEM, _inverse_symbol_index, _output_channel );
                                     else
                                     {
                                          _prompt_question = "An item with symbol '"+_inv_symbol+"' already exists. Replace ?" ;
													           		  var _params_array = [] ;
																			     	  _params_array['prepromptquestion'] = null ;
													             		 		_params_array['promptquestion'] = _prompt_question ;
													             		 		_params_array['yes_fn'] = function() { _insert_inverse_mm_obj( ITEM, _obj_index, _output_channel ); }
													             		 		_params_array['ifquestiondisabled_fn'] = function() { _insert_inverse_mm_obj( ITEM, _obj_index, _output_channel ); }
													             		circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                                     }
                                }
                            }
                        }
                        else circles_lib_output( _output_channel, DISPATCH_ERROR, "Error! No map selected for inverse: probably missing symbol", _par_1, _cmd_tag );
                    }
                    else if ( !is_array( _items_array ) )
                    {
                        _b_fail = YES, _error_str = "Memory failure: can't get current selection" ;
                    }
                    else circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: there's no map with that symbol or index", _par_1, _cmd_tag );
                    break ;
                    case "list" :
                    var _html = _params_assoc_array['html'] ;
                    if ( _sd_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "The "+( (  _glob_items_switch == ITEMS_SWITCH_SEEDS ) ? "Seeds" : "Generators" )+" maps list is empty", _par_1, _cmd_tag );
                    else if ( _sd_n > 0 && is_array( _items_array ) )
                    {
                        circles_lib_output( _output_channel, DISPATCH_STANDARD, "Retrieving the "+( (  _glob_items_switch == ITEMS_SWITCH_SEEDS ) ? "Seeds" : "Generators" )+" ..", _par_1, _cmd_tag );
                        var _out_file_txt = "Seeds list" ;
                    		var ITEM, _row, _exists, _print, _n_display ;
                        for( var _i = 0 ; _i < _sd_n ; _i++ )
                        {
                             ITEM = _items_array[_i];
                             _exists = is_item_obj( ITEM ) ? YES : NO ;
                             if ( _exists )
                             {
                                 _print = ( _symbols_array.length == 0 || ( _symbols_array.length > 0 && _symbols_array.includes( ITEM.symbol ) ) ) ? YES : NO ;
                                 if ( _print )
                                 {
         														 _row = circle_terminal_cmd_display_mobiusmap_item( ITEM, _i, _output_channel, _params_assoc_array );
                                     _out_file_txt += _row + _glob_crlf.repeat(2) ;
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
                        if ( _html ) circles_lib_terminal_color_decode_htmltext( "<gray>"+_out_file_txt+"</gray>", 'mobius', 'right', 'top' );
                        else if ( _params_assoc_array['dump'] )
                        {
                            if ( is_array( _params_assoc_array['dump_array'] ) ) _params_assoc_array['dump_array'].push( "circles.mobius.list.txt" );
														var _ret_chunk = circles_lib_dump_data_to_format( _out_file_txt.strip_tags(), _params_assoc_array['dump_array'][0], "savepix" );
														var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
														var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
														if ( _ret_id == 0 )
														{
																_b_fail = YES, _error_str = _ret_msg ;
														}
														else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                        }

                        _out_text_string = _out_file_txt ;
                    }
                    else if ( !is_array( _items_array ) )
                    {
                        _b_fail = YES, _error_str = "Memory failure: can't get current items" ;
                    }
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
                            _msg = "Invalid letter reference ("+_symbols_array[0]+") in seeds" ;
                            circles_lib_output( _output_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                        }
                        else
                        {
                            _items_array[_seeds_ret_i].notes = _params_assoc_array['notes'].join( " " );
                            _msg = "Notes have been saved for seed ("+_symbols_array[0]+") with success" ;
                            circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );

                            if ( _storage_queue_request )
                            _params_assoc_array['settings']['storagequeue'].push( _items_array[_seeds_ret_i].copy() );
                        }
                    }
                    break ;
                    case "release":
                    circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                    break ;
                    case "select":
                    var _ret_chunk = [];
                    if ( is_array( _selection_indexes_array ) ) _glob_zplane_selected_items_array = _selection_indexes_array.clone();
                    if ( _glob_zplane_selected_items_array.length > 0 && is_array( _items_array ) )
                    {
                        var _canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );
                        if ( is_html_canvas( _canvas_placeholder ) )
                        {
                             var _ret_chunk = circles_lib_canvas_render_zplane( _canvas_placeholder, zplane_sm, null, YES, YES, YES, NO, YES, _output_channel );
												     var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
													   var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "50Unknown error" ;
													   if ( _ret_id == RET_ERROR )
													   {
														 		 _b_fail = YES, _error_str = _ret_msg ;
														 }
														 
                             if ( _storage_queue_request ) $.each( _glob_zplane_selected_items_array, function( _i, _index ) { _params_assoc_array['settings']['storagequeue'].push( _items_array[_index].copy() ); } ) ;
                        }
                        else
                        {
                            _b_fail = YES, _error_str = "Memory failure" ;
                        }
                    }
                    else if ( !is_array( _items_array ) )
                    {
                        _b_fail = YES, _error_str = "Memory failure: can't get current items" ;
                    }
                    else
                    {
                        _b_fail = YES, _error_str = "No items selected" ;
                    }
                    break ;
                    case "symbol" :
                    _glob_show_symbols_zplane = _params_assoc_array['on'] ;
                    circles_lib_symbol_zplane_display(null,null, null, YES );
                    break ;
                    case "update" :
                    var _all = _params_assoc_array['all'] ;
                    if ( ( is_array( _selection_indexes_array ) || _all ) && is_array( _items_array ) )
                    {
                        var _sel_n = safe_size( _selection_indexes_array, 0 );
                        if ( _sel_n > 0 || _all )
                        {
                            var _entries_n = ( _all ) ? _sd_n : _sel_n, ITEM, _obj_index ;
                            for( var _i = 0 ; _i < _entries_n; _i++ )
                            {
                                _obj_index = ( _all ) ? _i : _selection_indexes_array[_i] ;
                                ITEM = ( is_array( _items_array ) ) ? _items_array[_obj_index] : null ;
                                if ( _obj_index != UNDET && is_item_obj( ITEM ) )
                                {
                                    //if ( _params_assoc_array['symbol'] != null ) _items_array[_obj_index].symbol = _params_assoc_array['symbol'][0] ;
                                    if ( _params_assoc_array['inv_symbol'] != null ) _items_array[_obj_index].inverse_symbol = _params_assoc_array['inv_symbol'][0] ;
                                    if ( _params_assoc_array['draw'] != UNDET ) _items_array[_obj_index].complex_circle.draw = _params_assoc_array['draw'] ;
                                    if ( _params_assoc_array['fill'] != UNDET ) _items_array[_obj_index].complex_circle.fill = _params_assoc_array['fill'] ;
                                    if ( _params_assoc_array['drawcolor'] != null )
                                    {
                                      _items_array[_obj_index].complex_circle.drawcolor = _params_assoc_array['drawcolor'] ;
                                      _items_array[_obj_index].complex_circle.draw = 1 ;
                                    }
                                    if ( _params_assoc_array['fillcolor'] != null ) { _items_array[_obj_index].complex_circle.fillcolor = _params_assoc_array['fillcolor'] ; _items_array[_obj_index].complex_circle.fill = 1 ; }
                                    if ( _params_assoc_array['linewidth'] != null ) _items_array[_obj_index].complex_circle.linewidth = _params_assoc_array['linewidth'] ;
                                    if ( _params_assoc_array['a'] != null ) _items_array[_obj_index].map.a = _params_assoc_array['a'] ;
                                    if ( _params_assoc_array['b'] != null ) _items_array[_obj_index].map.b = _params_assoc_array['b'] ;
                                    if ( _params_assoc_array['c'] != null ) _items_array[_obj_index].map.c = _params_assoc_array['c'] ;
                                    if ( _params_assoc_array['d'] != null ) _items_array[_obj_index].map.d = _params_assoc_array['d'] ;

                                    circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Mobius map '"+_items_array[_obj_index].symbol+"' has been updated", _par_1, _cmd_tag ); 
                                    if ( _storage_queue_request )
                                    _params_assoc_array['settings']['storagequeue'].push( _items_array[_obj_index].copy() );
                                }
                                else circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: there's no element with that symbol or index", _par_1, _cmd_tag );
                            }
                            
                            var _ret_chunk = circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _output_channel );
														var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
														var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
                            if ( _ret_id )
                            {
                                if ( _glob_terminal_autoinit_enable ) circles_lib_terminal_interpreter( "init all", _glob_terminal, _output_channel );
                                //if ( _glob_terminal_autorefresh ) circles_lib_terminal_interpreter( "refresh zplane clean silent", _glob_terminal, _output_channel );

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
                        else circles_lib_output( _output_channel, DISPATCH_ERROR, "Error: no chosen map for update. Possibly missing symbol", _par_1, _cmd_tag );
                    }
                    else if ( !is_array( _items_array ) )
                    {
                        _b_fail = YES, _error_str = "Memory failure: can't get current selection" ;
                    }
                    else circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: there's no map with that symbol or index", _par_1, _cmd_tag ); 

                    if ( _glob_method == METHOD_NONE ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: set up a method before continuing", _par_1, _cmd_tag ); 
                    break ;
                    default: break ;
            }

            if ( _storage_queue_request )
            {
                  var _n_queue = safe_size( _params_assoc_array['settings']['storagequeue'], 0 );
                  var _subset = safe_string( _params_assoc_array['settings']['storagesubset'], "seeds" ) ;
                  if ( _n_queue > 0 && is_array( _glob_storage[ _subset ] ) )
                  {
                      circles_lib_output( _output_channel, DISPATCH_INFO, "Found "+_n_queue+" candidate Mobius map"+(_n_queue==1?"":"s")+" in the storage queue", _par_1, _cmd_tag );
                      circles_lib_output( _output_channel, DISPATCH_INFO, "to be stored in the storage subset '"+_subset+"'", _par_1, _cmd_tag );
                      var _old_n = safe_size( _glob_storage[_subset], 0 ), _last_index ;
                      if ( _old_n == 0 && !is_array( _glob_storage[_subset] ) ) _glob_storage[_subset] = [] ;
                      $.each( _params_assoc_array['settings']['storagequeue'],
                              function( _i, _item_obj )
                              {
                                 switch ( _subset )
                                 {
                                    case "seeds":
                                    _glob_storage[_subset].push( _item_obj );
                                    break ;
                                    case "mobius":
                                    _glob_storage[_subset].push( _item_obj.map );
                                    _last_index = _glob_storage[_subset].length - 1 ;
                                    if ( _item_obj.notes.length > 0 ) _glob_storage[_subset][_last_index].notes = _item_obj.notes ;
                                    break ;
                                    case "circles":
                                    _glob_storage[_subset].push( _item_obj.complex_circle );
                                    _last_index = _glob_storage[_subset].length - 1 ;
                                    if ( _item_obj.notes.length > 0 ) _glob_storage[_subset][_last_index].notes = _item_obj.notes ;
                                    break ;
                                    default:
                                    circles_lib_output( _output_channel, DISPATCH_ERROR, "Invalid destination subset '"+_subset+"' for the storage queue: operation has been aborted", _par_1, _cmd_tag );
                                    return NO ;
                                    break ;
                                 }
                              }
                            ) ;   
                      var _new_n = safe_size( _glob_storage[_subset], 0 );
                      var _diff = _new_n - _old_n ;
                      if ( _diff == _n_queue )
                      circles_lib_output( _output_channel, DISPATCH_INFO, ( _n_queue == 1 ? "The only entry" : "All " + _n_queue + " entries" ) + " in this queue "+(_n_queue==1?"has":"have")+" been saved into the storage subset '"+_subset+"'", _par_1, _cmd_tag );
                      else if ( _diff < _n_queue )
                      circles_lib_output( _output_channel, DISPATCH_WARNING, "Just "+_n_queue+" entr"+(_n_queue==1?"y":"ies")+" in the queue have been saved into the storage subset '"+_subset+"'", _par_1, _cmd_tag );
                      
                      circles_lib_plugin_dispatcher_unicast_message('storage.space','forms',POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS);
                  }
                  else if ( !is_array( _glob_storage[ _subset ] ) )
                  circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid storage subset '"+_subset+"'", _par_1, _cmd_tag );
            }

            if ( _params_assoc_array['properties'].length > 0 )
            {
                if ( !is_array( _symbols_array ) ) _symbols_array = [];
                if ( _glob_items_to_init )
                circles_lib_output( _output_channel, DISPATCH_WARNING, "It looks like mobius maps need to be init", _par_1, _cmd_tag );

                if ( _symbols_array.length > 0 )
                {
            				 circles_lib_output( _output_channel, DISPATCH_INFO, "Checking the " + circles_lib_items_get_def() + " archive ..", _par_1, _cmd_tag );
                     var _out_text_array = [];
                     var _out_text_row = "", _symbol, ITEM, _mm, _pr, _prop, _det ;
                     var _work_array, _fp_array, _fp_n, _fp_1, _is_sink, _is_source, _desc ;
                     var _canvas, _opacity, _context, _ic, _w, _index, _tr ;
            				 for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
            		     {
            						 _symbol = _symbols_array[_i] ;
            						 ITEM = circles_lib_find_item_obj_by_symbol( _items_array, _symbol ); // scan seeds by default
            						 _mm = is_item_obj( ITEM ) ? ITEM.map : null ;
            						 if ( is_mobius_map( _mm ) )
            						 {
                              _out_text_array.push( ( _i == 0 ? "" : _glob_crlf ) + "Map '"+_symbol+"'" );
                              for( _pr = 0 ; _pr < _params_assoc_array['properties'].length ; _pr++ )
                              {
                                   _prop = _params_assoc_array['properties'][_pr] ;
                                   switch( _prop )
                                   {
                                      case "determinant":
                                      _det = _mm.det();
                                      _out_text_row = "Mobius map '"+_symbol+"' : determinant <snow>" + _det.formula()+"</snow>";
                                      _out_text_array.push( _out_text_row );
                                  		circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out_text_row, _par_1, _cmd_tag );
                                      break ;
                                      case "class":
                                      _out_text_row = "Mobius map '" + _symbol + "' is <snow>" + _mm.classification(NO)+"</snow>";
                                      _out_text_array.push( _out_text_row );
                                      circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out_text_row, _par_1, _cmd_tag );
                                      break ;
                                      case "circle":
                                      _ic = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? _mm.inversion_circle() : _mm.isometric_circle();
                                      _out_text_row = "Mobius map '" + _symbol + "' : <snow>"+( _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? "inversion" : "isometric" )+"</snow> circle " + _ic.output( null, _round_to );
                                      _out_text_array.push( _out_text_row );
                                  		circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out_text_row, _par_1, _cmd_tag );
                                      break ;
                                      case "kind":
                                      _out_text_row = "Mobius map '" + _symbol + "' : affine kind <snow>"+_mm.kind()+"</snow>";
                                      _out_text_array.push( _out_text_row );
                                  		circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out_text_row, _par_1, _cmd_tag );
                                      break ;
                                      case "characteristic":
                                      _out_text_row = "Mobius map '"+_symbol+"' : characteristic <snow>"+_mm.characteristic()+"</snow>";
                                      _out_text_array.push( _out_text_row );
                                  		circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out_text_row, _par_1, _cmd_tag );
                                      break ;
                                      case "multiplier":
                                      _out_text_row = "Mobius map '"+_symbol+"' : multiplier <snow>"+_mm.multiplier()+"</snow>";
                                      _out_text_array.push( _out_text_row );
                                  		circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out_text_row, _par_1, _cmd_tag );
                                      break ;
                                      case "fixedpoints":
                                      _work_array = [], _fp_array = _mm.fixed_points();
                                  		if ( !is_array( _fp_array ) )
                                  		circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning, memory lack! No fixed points found for map '"+_symbol+"'", _par_1, _cmd_tag );
                                  		else
                                  		{
                                  				_fp_n = safe_size( _fp_array, 0 );
                                  				if ( _fp_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: no fixed points found for map '"+_symbol+"'", _par_1, _cmd_tag );
                                  				else
                                  				{
                                 							circles_lib_output( _output_channel, DISPATCH_INFO, "Mobius map '"+_symbol+"': found "+_fp_n+" fixed point" + ( ( _fp_n == 1 ) ? "" : "s" ), _par_1, _cmd_tag );
                                 						  _fp_1 = _fp_array[0], _fp_2 = _fp_array[1] ;
                                              if ( is_complex( _fp_1 ) )
                                 							{
                                  								 _is_sink = _mm.is_sink_pt( _fp_array[0] );
                                  								 _is_source = _mm.is_source_pt( _fp_array[0] );
                                  								 _desc = "" ;
                                  								 if ( _is_sink ) _desc = circles_lib_fixedpoints_get_def( FIXEDPOINT_SINK );
                                  								 else if ( _is_source ) _desc = circles_lib_fixedpoints_get_def( FIXEDPOINT_SOURCE );
                                  								 else _desc = circles_lib_fixedpoints_get_def( FIXEDPOINT_NEUTRAL );

                                  								 _out_text_row = "Fixed point #1: <snow>" + ( new point( _fp_1.real, _fp_1.imag ) ).output( "cartesian", _round_to ) + " - " + _desc + "</snow>" ;
                                                   _out_text_array.push( _out_text_row );
                                  								 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out_text_row, _par_1, _cmd_tag );
                                                   _work_array.push( new point( _fp_1.real, _fp_1.imag ) );
                                 							}

                                              if ( is_complex( _fp_2 ) )
                                  						{
                                  							  _is_sink = _mm.is_sink_pt( _fp_array[1] );
                                  							  _is_source = _mm.is_source_pt( _fp_array[1] );
                                  								_desc = "" ;
                                  								if ( _is_sink ) _desc = circles_lib_fixedpoints_get_def( FIXEDPOINT_SINK );
                                  								else if ( _is_source ) _desc = circles_lib_fixedpoints_get_def( FIXEDPOINT_SOURCE );
                                  								else _desc = circles_lib_fixedpoints_get_def( FIXEDPOINT_NEUTRAL );

                	                  							_out_text_row = "Fixed point #2: <snow>" + ( new point( _fp_2.real, _fp_2.imag ) ).output( "cartesian", _round_to ) + " - " + _desc+"</snow>" ;
                                                  _out_text_array.push( _out_text_row );
                                  								circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out_text_row, _par_1, _cmd_tag );
                                                  _work_array.push( new point( _fp_2.real, _fp_2.imag ) );
                                  						}

                                              if ( _params_assoc_array['extras'].includes( "plot" ) )
                                              {
                                                  _canvas = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_WORK );
                                                  _opacity = $("#"+canvas.get_iddiv() ).css( "opacity" );
                                                  _context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
                                                  for( _w = 0 ; _w < _work_array.length ; _w++ )
                                                  if ( _work_array[_w] != null ) circles_lib_draw_point( _context, zplane_sm, _work_array[_w].x, _work_array[_w].y, YES, DEFAULT_PT_BORDER_COLOR, YES, DEFAULT_PT_INTERIOR_COLOR, _glob_pt_border, _glob_pt_radius, _opacity );
                                              }
                                  				}
                                  		}
                                      break;
                                      case "normalize":
                                      _index = circles_lib_find_item_index_by_symbol( _items_array, _symbol );
                                      if ( !( _items_array[_index].map.is_normalized() ) )
                                      {
                                         _items_array[_index].map = _mm.normalize();
                                         circles_lib_output( _output_channel, DISPATCH_INFO, "Map '"+_symbol+"' has been normalized", _par_1, _cmd_tag );
                                      }
                                      else circles_lib_output( _output_channel, DISPATCH_STANDARD, "Map '"+_symbol+"' is already normalized", _par_1, _cmd_tag );
                                      break ;
                                      case "trace":
                                      _tr = _mm.trace();
                                      _out_text_row = "Mobius map '" + _symbol + "' : trace <snow>"+_tr.formula()+"</snow>";
                                      _out_text_array.push( _out_text_row );
                                  		circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out_text_row, _par_1, _cmd_tag );
                                      break ;
															        default: break ;
                                   }
                              }
            						 }
            						 else circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing map with symbol '"+_symbol+"' was found in the archive", _par_1, _par_1, _cmd_tag );
                     }

                     if ( _params_assoc_array['dump'] && !_b_fail )
                     {
            						  var _ret_chunk = circles_lib_dump_data_to_format( _out_text_array.join( _glob_crlf ).strip_tags(), _params_assoc_array['dump_array'][0] );
            							var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO
            							var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
            							if ( _ret_id ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
            							else
                          {
                              _b_fail = YES, _error_str = _ret_msg ;
                          }
            				 }
            		}
            		else circles_lib_output( _output_channel, DISPATCH_ERROR, "Can't compute fixed points: missing input symbols", _par_1, _cmd_tag );
            }
         }
    }
    else
    {
        _b_fail = YES, _error_str = "Missing input params" ;
    }

    if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str )+_glob_crlf+"Type '"+_cmd_tag+" /h' for syntax help", _par_1, _cmd_tag );
    if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}