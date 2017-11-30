function circles_lib_gens_model_exists() { return circles_lib_count_gens_set_model() > 0 ? YES : NO ; }
function circles_lib_gens_set_initflag_get() { return _glob_gens_set_to_init ; }
function circles_lib_gens_set_initflag_set( _init ) { _glob_gens_set_to_init = safe_int( _init, YES ); }
function circles_lib_gens_model_get() { return _glob_gens_set_model_array.clone(); }
function circles_lib_gens_set_get() { return _glob_gens_array.clone() ; }
function circles_lib_gens_alphabet_get()
{
    var _alphabet = [] ;
    $.each( _glob_gens_array, function( _i, _item ) { _alphabet.push( _item.symbol ); } );
    return _alphabet.clone() ;
}
function circles_lib_gens_set_bomb()
{
    if ( !is_array( _glob_gens_set_model_array ) || !is_array( _glob_gens_array ) ) return NO ;
    _glob_gens_set_model_array.flush();
    _glob_gens_array = [];
    return YES ;
}

function circles_lib_gens_model_is_exact()
{
		if ( circles_lib_count_gens_set_model() == circles_lib_count_seeds() )
		{
			 var _b_go = YES, _candidate_symbol, _sd_n = circles_lib_count_seeds();
			 for( var _i = 0 ; _i < _sd_n ; _i++ )
			 {
					_candidate_symbol = _glob_gens_set_model_array[ _i ] ;
					if ( circles_lib_find_item_obj_by_symbol( _glob_seeds_array, _candidate_symbol ) == null )
					{
						_b_go = NO ;
						break ; 
					}
			 }
			 return _b_go ;
		}
		else return NO ;
}

function circles_lib_gens_model_create_exact( _output_channel )
{
    circles_lib_gens_set_bomb();
    var _sd_n = circles_lib_count_seeds(), _ret = YES, _symbol ;
    for( var _i = 0 ; _i < _sd_n ; _i++ )
    {
       _symbol = ( new String( _glob_seeds_array[_i].symbol ) ).trim();
       if ( _symbol.length > 0 ) _glob_gens_set_model_array.push( _symbol );
       else
       {
          _ret = NO ;
          break ;
       }
    }
      
    if ( _ret ) _glob_gens_set_to_init = YES ;
    return _ret ;
}

function circles_lib_gens_set_find_entry( _input_gen )
{
    var _b_found = NO, _gen, _sch_n = circles_lib_count_gens_set_model();
    for( var _i = 0 ; _i < _sch_n ; _i++ )
    {
       _gen = ( new String( _glob_gens_set_model_array[_i] ) ).trim();
       if ( _gen.strcmp( _input_gen ) )
       {
          _b_found = YES ;
          break ;
       }
    }

    return _b_found ;
}

function circles_lib_gens_set_build( _output_channel, _init_gens, _reset_gens_set, _question, _silent )
{
    if ( !_glob_method.is_one_of( METHOD_ALGEBRAIC ) )
    return [ RET_ERROR, "Generators set is available for algebraic method exclusively" ] ;
    _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    _init_gens = safe_int( _init_gens, YES );
    _reset_gens_set = safe_int( _reset_gens_set, YES );
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    
    // the generators set construction begins from seeds
    var _old_items_switch = _glob_items_switch ;
    var _ret_chunk = circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, _silent, _output_channel );

    if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_STANDARD, "--- start of generators set construction ---" );
    if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_INFO, "Step 1/2: constructing the generators set" );
 	  var _unsolved_gen_word, _unsolved_inverse_gen_word, _resolved_gen_word, _resolved_inverse_gen_word, _msg ;
 	  var _cc, _sc, _draw, _fill, _bordercolor, _fillcolor, INDEX = UNDET, _is_pqword = NO, _is_pqword_inv = NO ;
    var _sch_n = circles_lib_count_gens_set_model(), _sd_n = circles_lib_count_seeds();
    var _mm = null, _b_fail = NO, _symbol, _msg, _first_item_letter, _first_item_index, _first_item_obj ;
    if ( _sd_n > 0 )
    {
				var _invert_gens = [];
				_glob_symbols_index_array = [];
				// mapping the seeds index <-> symbol connection
        _msg = "Mapping index-symbol connection: " ;
				for( var _m = 0 ; _m < _sd_n ; _m++ )
        {
            if ( is_item_obj( _glob_seeds_array[_m] ) ) _glob_symbols_index_array[ _glob_seeds_array[_m].symbol ] = _m ;
            else
            {
               _b_fail = YES ;
               break ;
            }
        }
  									 		
        _msg += _b_fail ? "failed" : " ok" ;
    		if ( !_silent ) circles_lib_output( _output_channel, _b_fail ? DISPATCH_ERROR : DISPATCH_SUCCESS, _msg );
        // exact configuration built by default, if required
  			if ( _sch_n == 0 && !_b_fail )
  			{
						if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_INFO, "Missing generators set: the exact generators set is built"  );
 						_glob_gens_set_model_array.flush();
            circles_lib_gens_model_create_exact( _output_channel );
            if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_INFO, _sd_n + " generator"+( _sd_n == 1 ? "" : "s" )+" "+( _sd_n == 1 ? "has" : "have" )+" been added to generators set." );
				}

        _sch_n = circles_lib_count_gens_set_model();
        if ( _b_fail ) return [ RET_ERROR, "Missing symbols: memory failure" ] ;
        else if ( _sch_n == 0 )
        {
            var _msg = "No generators set available: can't set up elements as required" ;
            if ( _output_channel != OUTPUT_SCREEN && !_silent ) circles_lib_output( _output_channel, DISPATCH_ERROR, _msg );
            return [ RET_ERROR, _msg ] ;
        }
        else
        {
            if ( _reset_gens_set )
            {
							 _glob_gens_array = [];
	             _glob_gens_set_symbols_map_array.flush_associative();
						}

						// check seeds to exist, so that all entries will be correctly processed
    				for( var _g = 0 ; _g < _sch_n ; _g++ )
    				{
               _unsolved_gen_word = _glob_gens_set_model_array[_g] ;
               _is_pqword = _unsolved_gen_word.testME( _glob_pqword_regex_pattern );
               _is_pqword_inv = _unsolved_gen_word.testME( _glob_pqword_inv_regex_pattern );
               if ( _is_pqword ) _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.split( "/" ) )[0], ( _unsolved_gen_word.split( "/" ) )[1] );
               else if ( _is_pqword_inv )
               {
                  _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[0], ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[1] ) ;
                  _resolved_gen_word = circles_lib_word_inverse_get( _resolved_gen_word ) ;
               }
               else _resolved_gen_word = circles_lib_repetends_resolve( _unsolved_gen_word );

               for( var w = 0 ; w < _resolved_gen_word.length ; w++ )
	             {
				    	    INDEX = _glob_symbols_index_array[ _resolved_gen_word[ w ] ] ;
					   	    if ( !is_item_obj( _glob_seeds_array[INDEX] ) )
					   	    {
										_b_fail = YES ;
										break ;
									}
            	 }
						}

					  if ( _b_fail )
					  {
		            var _msg = "Generators set can't be built up: check input entries sequence" ;
		            		_msg += _glob_crlf.repeat(2) + "Suggestion: there could be symbols addressing to null objects" ;
		            if ( _output_channel != OUTPUT_SCREEN && !_silent ) circles_lib_output( _output_channel, DISPATCH_ERROR, _msg );
		            return [ RET_ERROR, _msg ] ;
						}

            if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_INFO, "Step 2/2: gens maps init from input gens words set" );
            _sch_n = circles_lib_count_gens_set_model();

    				for( var _g = 0 ; _g < _sch_n ; _g++ )
    				{
               _unsolved_gen_word = _glob_gens_set_model_array[_g] ;
               _first_item_letter = _unsolved_gen_word[0] ;
		    	     _first_item_index = _glob_symbols_index_array[ _first_item_letter ] ;
               _first_item_obj = _glob_seeds_array[ _first_item_index ] ;
               _is_pqword = _unsolved_gen_word.testME( _glob_pqword_regex_pattern );
               _is_pqword_inv = _unsolved_gen_word.testME( _glob_pqword_inv_regex_pattern );
               if ( _is_pqword ) _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.split( "/" ) )[0], ( _unsolved_gen_word.split( "/" ) )[1] );
               else if ( _is_pqword_inv )
               {
                  _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[0], ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[1] ) ;
                  _resolved_gen_word = circles_lib_word_inverse_get( _resolved_gen_word ) ;
               }
               else _resolved_gen_word =circles_lib_repetends_resolve( _unsolved_gen_word );
               _mm = circles_lib_word_mobiusmap_get( _resolved_gen_word, _glob_seeds_array, _output_channel );

               _resolved_inverse_gen_word = circles_lib_word_inverse_get( _resolved_gen_word );
               if ( _is_pqword || _is_pqword_inv ) _unsolved_inverse_gen_word = _unsolved_gen_word.end_with( "inv" ) ? _unsolved_gen_word.replaceAll( "inv", "" ) : _unsolved_gen_word + "inv" ;
               else _unsolved_inverse_gen_word = circles_lib_word_inverse_get( _unsolved_gen_word );
               
               _cc = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? _mm.inversion_circle() : _mm.isometric_circle();
               _sc = circles_lib_complex_to_screen_disk( _cc, zplane_sm );

               _draw = _first_item_obj.complex_circle.draw ;
               _bordercolor = _first_item_obj.complex_circle.bordercolor ;
               _fill = _first_item_obj.fill ;
               _fillcolor = _first_item_obj.complex_circle.fillcolor ;
               _cc.draw = _draw, _cc.bordercolor = _bordercolor ;
               _cc.fill = _fill, _cc.fillcolor = _fillcolor ;
               _sc.draw = _draw, _sc.bordercolor = _bordercolor ;
               _sc.fill = _fill, _sc.fillcolor = _fillcolor ;

							 // add map to generators set, if not already included yet
               _ret = circles_lib_find_item_index_by_symbol( _glob_gens_array, _resolved_gen_word );
				       if ( _ret == UNFOUND )
					     {
                  _glob_gens_array.push( new item_obj( _mm, _cc, _sc, _resolved_gen_word, 0,
 		                                     _draw, _bordercolor, _fill, _fillcolor,
 		                                     _resolved_inverse_gen_word, 1, ITEM_TYPE_MOBIUS ) );
		    			    _glob_gens_array[_glob_gens_array.length-1].map = _mm ;
		    			    _glob_gens_array[_glob_gens_array.length-1].complex_circle = _cc ;
		    			    _glob_gens_array[_glob_gens_array.length-1].notes = "" ;
        					if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "A new generator '" + _unsolved_gen_word + "' has been init" );

                  if ( !_glob_gens_set_model_array.includes( _unsolved_gen_word ) )
                  _glob_gens_set_model_array.push( _unsolved_gen_word );
							 }

    				    // fill both inverse entries
    					  _invert_gens[ _resolved_gen_word ] = _resolved_inverse_gen_word ;
    					  _invert_gens[ _resolved_inverse_gen_word ] = _resolved_gen_word ;
    						
    						// add inverse map
                _ret = circles_lib_find_item_index_by_symbol( _glob_gens_array, _resolved_inverse_gen_word );
					      if ( _ret == UNFOUND )
					      {
        						if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Inverse generator</lightblue> <snow>"+_resolved_inverse_gen_word+"</snow> not registered yet" );
        						if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Attempting to creation from map</lightgray> <snow>"+_resolved_gen_word+"</snow>" );
                    _cc = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? _mm.inv().inversion_circle() : _mm.inv().isometric_circle();
                    _sc = circles_lib_complex_to_screen_disk( _cc, zplane_sm );
                    _cc.draw = _draw, _cc.bordercolor = _bordercolor ;
                    _cc.fill = _fill, _cc.fillcolor = _fillcolor ;
                    _sc.draw = _draw, _sc.bordercolor = _bordercolor ;
                    _sc.fill = _fill, _sc.fillcolor = _fillcolor ;

										_glob_gens_array.push( new item_obj( _mm.inv(), _cc, _sc, _resolved_inverse_gen_word, 0,
  		                                                   _draw, _bordercolor, _fill, _fillcolor,
  		                                                   _resolved_gen_word, 1, ITEM_TYPE_MOBIUS, "", _resolved_gen_word ) );
		    				    _glob_gens_array[_glob_gens_array.length-1].map = _mm.inv().copy() ;
		    				    _glob_gens_array[_glob_gens_array.length-1].complex_circle = _cc.copy() ;
		    				    _glob_gens_array[_glob_gens_array.length-1].notes = "" ;

                    if ( !_glob_gens_set_model_array.includes( _unsolved_inverse_gen_word ) )
                    _glob_gens_set_model_array.push( _unsolved_inverse_gen_word );

        						if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The inverse generator '"+_resolved_inverse_gen_word+"' has been init" + _glob_crlf );
					      }
    				}
    				
            _sch_n = circles_lib_count_gens_set_model();
            var _new_n = circles_lib_count_gens();
            _msg = ( _new_n != 0 ? "Ok" : "Failure" ) + ", " + _new_n + " generator" + ( _new_n == 1 ? "" : "s" ) + " over "+_sch_n+" input"+(_sch_n==1?"":"s")+" have been init with success" ;

            // Let's check it again for inverse Mobius maps
            if ( _new_n == 0 ) return [ RET_ERROR, "Fail to populate the generators set" ] ;
            else if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) )
            {
                 if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_INFO, _msg );
                 _msg = "Attempting to initialize inverse gens from the current generators set" ;
            		 if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_STANDARD, _msg );
                 _sch_n = circles_lib_count_gens_set_model();
        				 for( var _g = 0 ; _g < _sch_n ; _g++ )
        				 {
                    _unsolved_gen_word = _glob_gens_set_model_array[_g] ;
                    _first_item_letter = _unsolved_gen_word[0] ;
      		    	    _first_item_index = _glob_symbols_index_array[ _first_item_letter ] ;
                    _first_item_obj = _glob_seeds_array[ _first_item_index ] ;

                    _is_pqword = _unsolved_gen_word.testME( _glob_pqword_regex_pattern );
                    _is_pqword_inv = _unsolved_gen_word.testME( _glob_pqword_inv_regex_pattern );
                    if ( _is_pqword ) _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.split( "/" ) )[0], ( _unsolved_gen_word.split( "/" ) )[1] );
                    else if ( _is_pqword_inv )
                    {
                        _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[0], ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[1] ) ;
                        _resolved_gen_word = circles_lib_word_inverse_get( _resolved_gen_word );
                    }
                    else _resolved_gen_word =circles_lib_repetends_resolve( _unsolved_gen_word );
      
                    _resolved_inverse_gen_word = circles_lib_word_inverse_get( _resolved_gen_word );
                    if ( _is_pqword || _is_pqword_inv ) _unsolved_inverse_gen_word = _unsolved_gen_word.end_with( "inv" ) ? _unsolved_gen_word.replaceAll( "inv", "" ) : _unsolved_gen_word + "inv" ;
                    else _unsolved_inverse_gen_word = circles_lib_word_inverse_get( _unsolved_gen_word );

        						_resolved_inverse_gen_word = _invert_gens[_resolved_gen_word] ;

                    //_resolved_inverse_gen_word = circles_lib_repetends_resolve( _unsolved_inverse_gen_word );
                    _ret = circles_lib_find_item_index_by_symbol( _glob_gens_array, _resolved_inverse_gen_word );
                    if ( _ret != UNFOUND )
                    {
                        if ( _is_pqword || _is_pqword_inv ) _msg = "Inverse generator of P/Q word '"+_unsolved_gen_word+"' has been already init" ;
                        else _msg = "Inverse generator '"+_unsolved_inverse_gen_word+"' of '"+circles_lib_word_inverse_get(_unsolved_inverse_gen_word )+"' has been already init" ;
         						    if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_INFO, _msg );
                    }
                    else
                    {
                        if ( !_glob_gens_set_model_array.includes( _unsolved_inverse_gen_word ) )
                        _glob_gens_set_model_array.push( _unsolved_inverse_gen_word );
        
                        _mm = circles_lib_word_mobiusmap_get( _resolved_inverse_gen_word, _glob_seeds_array, _output_channel );
                        _cc = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? _mm.inversion_circle() : _mm.isometric_circle();
                        _sc = circles_lib_get_screendisk_from_complexdisk( zplane_sm, _cc );

                        _draw = _first_item_obj.complex_circle.draw ;
                        _bordercolor = _first_item_obj.complex_circle.bordercolor ;
                        _fill = _first_item_obj.fill ;
                        _fillcolor = _first_item_obj.complex_circle.fillcolor ;
                        _cc.draw = _draw, _cc.bordercolor = _bordercolor ;
                        _cc.fill = _fill, _cc.fillcolor = _fillcolor ;
                        _sc.draw = _draw, _sc.bordercolor = _bordercolor ;
                        _sc.fill = _fill, _sc.fillcolor = _fillcolor ;

         					      _glob_gens_array.push( new item_obj( _mm, _cc, _sc, _resolved_inverse_gen_word, 0,
                                                             _draw, _bordercolor, _fill, _fillcolor,
                                                             _resolved_gen_word, 1, ITEM_TYPE_MOBIUS, "", _resolved_gen_word ) );
            					  _glob_gens_array[_glob_gens_array.length-1].map = _mm ;
                       	_glob_gens_array[_glob_gens_array.length-1].notes = "generator" ;
            						if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "New generator " + _unsolved_inverse_gen_word + " (inverse of '"+_unsolved_gen_word+"' ) is in" );
                    }
        				 }
            }

            if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_STANDARD, "Attempting to tag generators set words to one-letter entries." );
            // finally, build a new alphabet from the previous generators set, where each entry is announced by one letter
            var _free_symbol = "", _generators_inverses_map = [];
    				for( var _g = 0 ; _g < _sch_n ; _g++ )
            {
               _unsolved_gen_word = _glob_gens_set_model_array[_g] ;
               _is_pqword = _unsolved_gen_word.testME( _glob_pqword_regex_pattern );
               _is_pqword_inv = _unsolved_gen_word.testME( _glob_pqword_inv_regex_pattern );
               if ( _is_pqword || _is_pqword_inv ) _unsolved_inverse_gen_word = _unsolved_gen_word.end_with( "inv" ) ? _unsolved_gen_word.replaceAll( "inv", "" ) : _unsolved_gen_word + "inv" ;
               else _unsolved_inverse_gen_word = circles_lib_word_inverse_get( _unsolved_gen_word );
               _generators_inverses_map[ _unsolved_gen_word ] = _unsolved_inverse_gen_word ;
            }
            
    				for( _g = 0 ; _g < _sch_n ; _g++ )
    				{
    					 _unsolved_gen_word = _glob_gens_set_model_array[_g] ;
               _is_pqword = _unsolved_gen_word.testME( _glob_pqword_regex_pattern );
               _is_pqword_inv = _unsolved_gen_word.testME( _glob_pqword_inv_regex_pattern );
               if ( _is_pqword ) _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.split( "/" ) )[0], ( _unsolved_gen_word.split( "/" ) )[1] );
               else if ( _is_pqword_inv )
               {
                   _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[0], ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[1] ) ;
                   _resolved_gen_word = circles_lib_word_inverse_get( _resolved_gen_word );
               }
               else _resolved_gen_word =circles_lib_repetends_resolve( _unsolved_gen_word );

               if ( _unsolved_gen_word.length == 1 && _glob_gens_set_symbols_map_array[_resolved_gen_word] == null ) _glob_gens_set_symbols_map_array[_resolved_gen_word] = _unsolved_gen_word ;
               else if ( _unsolved_gen_word.length > 1 &&
                         _glob_gens_set_symbols_map_array[_resolved_gen_word] == null &&
                         _glob_gens_set_symbols_map_array[ circles_lib_word_inverse_get( _resolved_gen_word ) ] == null )
               {
                  // search for a candidate letter, not used yet
                  var _l_n = safe_size( _glob_caps_letters_array, 0 );
                  for( var a = 0 ; a < _l_n ; a++ )
                  {
                     _free_symbol = _glob_caps_letters_array[a] ;
                     if ( !( _glob_gens_set_symbols_map_array.includes_associative( _free_symbol ) ) &&
                          !( _glob_gens_set_symbols_map_array.includes_associative( circles_lib_word_inverse_get( _free_symbol ) ) )
                        )
                     {
                        // candidate letter is free for use, so join it !
                        _glob_gens_set_symbols_map_array[_resolved_gen_word] = _free_symbol ;
                        _glob_gens_set_symbols_map_array[circles_lib_word_inverse_get(_resolved_gen_word )] = circles_lib_word_inverse_get(_free_symbol);
                        break ;
                     }
                  }
                }
                else if ( _unsolved_gen_word.length == 0 )
                {
                  var _msg = "There exists one element in the generators set without symbol" ;
                  if ( _output_channel != OUTPUT_SCREEN && !_silent ) circles_lib_output( _output_channel, DISPATCH_ERROR, _msg );
                  return [ RET_ERROR, _msg ] ;
                }
            }
            
            if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "One-symbol-reparsing has been completed with success." );

            // replace gens symbols with new ones from the _glob_gens_set_symbols_map_array
            // so we have all gens associated to one letter (together with the benefit of having a 'compressed' alphabet)
            var _symbol = "", _single_symbol = "", _color, _gg_n = circles_lib_count_gens();
            for( _g = 0 ; _g < _gg_n ; _g++ )
            {
							 _symbol = safe_string( _glob_gens_array[_g].symbol, "" );
               if ( _symbol.length > 0 )
               {
  								_single_symbol = _glob_gens_array[_g].symbol = _glob_gens_set_symbols_map_array[ _symbol ].trim();
                  _color = circles_lib_alphabet_get_color_from_symbol( _single_symbol ) ;
   								_glob_gens_array[_g].inverse_symbol = circles_lib_word_inverse_get( _glob_gens_array[_g].symbol ) ;
   								_glob_gens_array[_g].complex_circle.bordercolor = _glob_gens_array[_g].complex_circle.bordercolor = _color ;
   								_glob_gens_array[_g].screen_circle.bordercolor = _glob_gens_array[_g].screen_circle.bordercolor = _color ;
               }
               else
               {
                  _b_fail = YES ;
                  if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_ERROR, "Symbol '"+_symbol+"' not found: memory failure" );
                  break ;
               }
						}

            if ( _b_fail ) return [ RET_ERROR, "Symbol not found: memory failure" ] ;
            else
            {
               _sch_n = circles_lib_count_gens_set_model();
               var _ret_msg = "", _ret_id = 0 ;
               if ( _sch_n > 0 )
               {
                  _glob_items_to_init = NO ;
                  $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
                  _ret_id = 1, _ret_msg = "The generators set finally includes "+_sch_n+" generator" + ( _sch_n == 1 ? "" : "s" );
          				if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg );
               }
               else
               {
                  _glob_items_to_init = YES ;
                  $('[id$=initBTN]').css('color',COLOR_ERROR) ;
                  _ret_id = 0, _ret_msg = "No gens have been computed" ;
                  if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_ERROR, _ret_msg );
               }

            	 if ( !_silent ) circles_lib_output( _output_channel, DISPATCH_STANDARD, "--- end of generators set construction ---" );
               if ( _init_gens )
               {
		              var _old_selector = _glob_output_channel ;
                  _glob_output_channel = OUTPUT_TEXT ;
		
		              if ( !_silent )
                  {
                      circles_lib_output( _output_channel, DISPATCH_INFO, "Pointing source items to generators set" );
    		              circles_lib_output( _output_channel, DISPATCH_INFO, "Try to initialize the items for drawing" );
                  }
		              circles_lib_items_switch_to( ITEMS_SWITCH_GENS, _silent, _output_channel );
                  var _ret_chunk = circles_lib_items_init( null, _question, _silent, _glob_init_mask, NO, YES, _output_channel );
		              _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], 0 ) : 0 ;
		              _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Memory failure: unknown response" ;

		              if ( !_silent ) circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg );
		              _glob_output_channel = _old_selector ;
                  
                  if ( _ret_id != RET_OK ) return _ret_chunk ;
							 }

               _glob_gens_set_to_init = NO ;
               var _b_ok = safe_size( _glob_gens_array, 0 ) > 0 ? YES : NO ;
               var _msg = _b_ok ? "Generators set has been built up with success" : "Fail to build up the generators set" ;
               _glob_items_switch = ITEMS_SWITCH_GENS ;
               if ( !_silent ) circles_lib_output( _output_channel, _b_ok ? DISPATCH_SUCCESS : DISPATCH_ERROR, _msg );
               return [ RET_OK, _msg ] ;
            }
        }
		}
    else
    {
        var _msg = "Can't build up the generators set: missing items declaration" ;
        if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( _output_channel, DISPATCH_ERROR, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ] ;
    }
}