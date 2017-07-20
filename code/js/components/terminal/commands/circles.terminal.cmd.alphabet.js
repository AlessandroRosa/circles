function circles_terminal_cmd_alphabet()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose )
     circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _n_seeds = circles_lib_count_seeds();
     var _long_mode = 0, _help = 0, _cnt = 0 ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _error_str_array = [];
         _error_str_array['err1'] = "Memory failure: can't return the current alphabet" ;
         _error_str_array['err2'] = "Symbol '%symbol%' has%not%been added to current alphabet %success%" ;
         _error_str_array['err3'] = "Symbols can include alphabetic chars only" ;
         _error_str_array['err4'] = "Symbol '%symbol%' cannot be removed from alphabet because it's still in use for a seed" ;
         _error_str_array['err5'] = "Symbol '%symbol%' cannot be removed because not included inside the current alphabet" ;
         _error_str_array['err6'] = "Symbol '%symbol%' has%not%been deleted from current alphabet with success" ;
         _error_str_array['err7'] = "Alphabet %inclusor% symbol '%symbol%'" ;
         _error_str_array['err8'] = "Can't %action%: no input symbol" ;

         _error_str_array['info1'] = "Type 'alphabet regen' for reconstruction" ;

     var _params_assoc_array = [];
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
         _params_assoc_array['long'] = 0 ;
         _params_assoc_array['settings'] = [] ;
         _params_assoc_array['symbol'] = [] ;
         
     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "add", "check", "delete", "inv", "long", "regen", "help", "html",
                                            "release", "bomb", "show", "colorize", "decolorize" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.is_one_of_i( "long", "inv" ) ) _params_assoc_array['settings'].push( _p.toLowerCase() ) ;
            else if ( _p.is_one_of_i( "add", "bomb", "check", "colorize", "decolorize", "delete", "regen", "release", "show" ) ) _params_assoc_array['action'] = _p ;
            else if ( _p.stricmp( "seeds" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
            else if ( _p.stricmp( "gens" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_GENS ;
            else
            {
               if ( _params_assoc_array['action'].is_one_of( "add", "delete" ) )
               {
                  _p = _p.replaceAll( _glob_punctuation, "" );
                  if ( _p.length == 1 )
                  {
    									_params_assoc_array['symbol'].push( _p );
    									_cnt++ ;
                  }
                  else if ( _p.includes( "," ) )
                  {
                      var _tmp = _p.split( "," );
                      $.each( _tmp, function( _i, _symbol )
                      {
                         if ( _symbol.length == 1 ) _params_assoc_array['symbol'].push( _symbol );
                         else
                         {
             		           _b_fail = YES, _error_str = "Candidate symbol '"+_symbol+"' must be 1-char long" ;
                         }
                      }
                      );
                  }
                  else
                  {
     		             _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
                  }
							 }
							 else
							 {
                  _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
							 }
            }
         }
     }

     if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _out_channel );
     else if ( _params_assoc_array['keywords'] )
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
     		var _action = safe_string( _params_assoc_array['action'], "" ).trim();
        if ( safe_size( _action, 0 ) == 0 )
        {
           if ( safe_size( _glob_alphabet, 0 ) > 0 )
           circles_lib_output( _out_channel, DISPATCH_INFO, "Missing input action: alphabet will be shown below", _par_1, _cmd_tag );
           _action = "show" ;
        }

     		var _symbols_array = _params_assoc_array['symbol'] ;
        var _items_array = _params_assoc_array["item"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
	      var _items_n = circles_lib_count_items( _items_array );
        var _dest_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "seeds" : "gens" ;
        var _category_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "gen" ;
        switch( _action )
        {
					 case "add":
					 if( _glob_alphabet.includes( _symbol ) )
					 {
							 _b_fail = YES, _error_str = _error_str_array['err7'].replaceAll( [ "%inclusor%", "%symbol%" ], [ "already includes", _symbol ] );
					 }
					 else if ( safe_size( _symbols_array, 0 ) == 0 )
					 {
					 		 _b_fail = YES, _error_str = _error_str_array['err8'].replaceAll( "%action%", _action );
					 }
					 else
					 {
              var _out_id, _out_msg, _mask = 0, _symbol ;
              if ( _params_assoc_array['settings'].includes( "inv" ) )
						  circles_lib_output( _out_channel, DISPATCH_INFO, "Detected 'inv' option: symbols will be added together wth their inverses", _par_1, _cmd_tag );

							for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
							{
								 _symbol = safe_string( _symbols_array[_i], "" ) ;
                 if ( _symbol.length > 0 )
								 {
                    _mask = 0 ;
                    _mask |= _symbol.testME( _glob_symbol_regex_pattern ) ? 1 : 0 ;
                    _mask |= !_glob_alphabet.includes( _symbol ) ? 2 : 0 ;
									  if ( _mask == 3 )
										{
											 _glob_alphabet.push( _symbol );
											 circles_lib_output( _out_channel, DISPATCH_SUCCESS, _error_str_array['err2'].replaceAll( [ "%symbol%", "%not%", "%success%" ], [ _symbol, " ", "with success" ] ), _par_1, _cmd_tag );
											 if ( _params_assoc_array['settings'].includes( "inv" ) )
											 {
													 _glob_alphabet.push( _symbol.flipCase() );
													 circles_lib_output( _out_channel, DISPATCH_INFO, _error_str_array['err2'].replaceAll( [ "%symbol%", "%not%", "%success%" ], [ _symbol.flipCase(), " ", "with success" ] ), _par_1, _cmd_tag );
											 }
									  }
                    else circles_lib_output( _out_channel, DISPATCH_WARNING, _error_str_array['err2'].replaceAll( [ "%symbol%", "%not%", "%success%" ], [ _symbol, " not ", "" ] ), _par_1, _cmd_tag );
																 
                    if ( ( _mask & 1 ) == 0 )
                    circles_lib_output( _out_channel, DISPATCH_ERROR, _error_str_array['err3'], _par_1, _cmd_tag );
                    if ( ( _mask & 2 ) == 0 )
                    {
                       _error_str = _error_str_array['err7'].replaceAll( [ "%inclusor%", "%symbol%" ], [ "already includes", _symbol ] );
                       circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ), _par_1, _cmd_tag );
                    }
								 }	
							}
							
							_glob_alphabet = _glob_alphabet.unique();
							_glob_alphabet.sort() ;
		           var _size = safe_size( _glob_alphabet, 0 ) ;
		           circles_lib_output( _out_channel, DISPATCH_INFO, "Alphabet includes "+_size+" element"+(_size==1?"":"s"), _par_1, _cmd_tag );
					 }
           _fn_ret_val = _glob_alphabet.clone() ;
					 break ;
           case "bomb":
           if ( safe_size( _glob_alphabet, 0 ) == 0 )
           circles_lib_output( _out_channel, DISPATCH_INFO, "The current alphabet is still empty", _par_1, _cmd_tag );                   
           else
           {
               var _bomb_alphabet = function()
               {
                   _glob_alphabet.flush();
                   if ( safe_size( _glob_alphabet, 0 ) == 0 ) circles_lib_output( _out_channel, DISPATCH_SUCCESS, "All entries in the current alphabet have been deleted with success", _par_1, _cmd_tag );
                   else circles_lib_output( _out_channel, DISPATCH_WARNING, "Problems while trying to delete all entries in the current alphabet." + _glob_crlf + "Please, retry", _par_1, _cmd_tag );
				           var _size = safe_size( _glob_alphabet, 0 ) ;
				           circles_lib_output( _out_channel, DISPATCH_INFO, "Alphabet includes "+_size+" element"+(_size==1?"":"s"), _par_1, _cmd_tag );
               }
    
			     		 var _params_array = [] ;
							  	 _params_array['prepromptquestion'] = null ;
					     		 _params_array['promptquestion'] = "Confirm to delete all entries in the current alphabet ?" ;
									 _params_array['yes_fn'] = function() { _bomb_alphabet(); }
									 _params_array['ifquestiondisabled_fn'] = function() { _bomb_alphabet(); }
							 circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
           }
           _fn_ret_val = _glob_alphabet.clone() ;
           break ;
           case "check":
           circles_lib_output( _out_channel, DISPATCH_INFO, "Starting alphabet check", _par_1, _cmd_tag );
           var _size = safe_size( _glob_alphabet, 0 ) ;
           if ( !is_array( _glob_alphabet ) )
           {
		           circles_lib_output( _out_channel, DISPATCH_WARNING, "Memory failure: alphabet archive needs to be regenerated again", _par_1, _cmd_tag );
		           circles_lib_output( _out_channel, DISPATCH_INFO, _error_str_array['info1'], _par_1, _cmd_tag );
					 }
					 else if ( _size == 0 )
           		 circles_lib_output( _out_channel, DISPATCH_WARNING, "Check stopped: alphabet is empty", _par_1, _cmd_tag );
					 else if ( _n_seeds != _size )
					 {
					 		 if ( _n_seeds == 0 )
           		 circles_lib_output( _out_channel, DISPATCH_WARNING, "Check stopped: no seeds have been registered yet", _par_1, _cmd_tag );
           		 else if ( _size == 0 )
           		 {
		           		 circles_lib_output( _out_channel, DISPATCH_WARNING, "Size failure: alphabet archive is empty", _par_1, _cmd_tag );
				           circles_lib_output( _out_channel, DISPATCH_INFO, _error_str_array['info1'], _par_1, _cmd_tag );
							 }
		           else
		           {
									 circles_lib_output( _out_channel, DISPATCH_WARNING, "Size failure: alphabet archive needs to be regenerated again", _par_1, _cmd_tag );
				           circles_lib_output( _out_channel, DISPATCH_INFO, _error_str_array['info1'], _par_1, _cmd_tag );
							 }
					 }
					 else
					 {
					 		 var _report = [] ;
						 	 circles_lib_output( _out_channel, DISPATCH_INFO, "Found "+_size+" entr"+(_size==1?"y":"ies")+" in the alphabet: "+_glob_alphabet.join( ", " ), _par_1, _cmd_tag );
						 	 $.each( _glob_alphabet,
											 function( _i, _sym )
											 {
											 	  if ( circles_lib_find_item_index_by_symbol( _glob_seeds_array, _sym ) == UNFOUND )
											 	  _report.push( "'"+_sym+"' does not refer to any registered seed" );
											 }	
							 ) ;
							 var _n_report = safe_size( _report, 0 );
							 if ( _n_report == 0 )
							 {
									 circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Alphabet check has been passed with success", _par_1, _cmd_tag );
				           var _size = safe_size( _glob_alphabet, 0 ) ;
				           circles_lib_output( _out_channel, DISPATCH_INFO, "Alphabet includes "+_size+" element"+(_size==1?"":"s"), _par_1, _cmd_tag );
							 }
							 else
							 {
							 		 circles_lib_output( _out_channel, DISPATCH_WARNING, "Found "+_n_report+" errors", _par_1, _cmd_tag );
							 		 $.each( _report, function( _i, _rep ) { circles_lib_output( _out_channel, DISPATCH_WARNING, _rep, _par_1, _cmd_tag ); }
												 );
							 }
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
                  var _ret_chunk = circles_lib_colors_colorize( _dest_ref, YES, YES, _out_channel );
                  var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "33Unknown error" ;
                  circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
               }
    					 _params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_colorize( _dest_ref, YES, YES, _out_channel ); }
     			     circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
           }
           else
           {
               _b_fail = YES, _error_str = "The list of seeds is empty" ;
           }
           break ;
           case "decolorize":
           if ( _items_n > 0 )
           {
    	     		 var _params_array = [] ;
    					 _params_array['prepromptquestion'] = null ;
    					 _params_array['promptquestion'] = "Confirm to decolorize all "+_dest_ref+"? " ;
    					 _params_array['yes_fn'] = function()
               {
                  var _ret_chunk = circles_lib_colors_decolorize( _dest_ref, YES, YES, _out_channel );
                  var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "34Unknown error" ;
                  circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
               }
    					 _params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_decolorize( _dest_ref, YES, YES, _out_channel ); }
     			     circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
           }
           else
           {
               _b_fail = YES, _error_str = "The list of seeds is empty" ;
           }
           break ;
					 case "delete":
					 if (  _params_assoc_array['symbol'].length == 0 )
					 {
					 		 _b_fail = YES, _error_str = _error_str_array['err8'].replaceAll( "%action%", _action );
					 }
					 else
					 {
							var _symbol = _symbols_array[_i], _index, _mobius_map_index, _out_id, _out_msg ;
							for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
							{
									_symbol = safe_string( _symbols_array[_i], "" ) ;
									if ( _symbol.length > 0 )
									{
										 if( _glob_alphabet.includes( _symbol ) )
										 {
												 _index = _glob_alphabet.indexOf( _symbol );
												 _mobius_map_index = circles_lib_find_item_index_by_symbol( _glob_seeds_array, _symbol, _out_channel );
												 if ( _mobius_map_index != UNFOUND )
												 {
														 _b_fail = YES, _error_str = _error_str_array['err4'].replaceAll( "%symbol%", _symbol );
												 }
												 else if ( _index == UNFOUND )
												 {
												 		 _b_fail = YES, _error_str = _error_str_array['err5'].replaceAll( "%symbol%", _symbol );
												 }
												 else
												 {
														 _glob_alphabet.remove( _index, _index );
														 _out_id = !_glob_alphabet.includes( _symbol ) ? YES : NO ;
														 _out_msg = !_glob_alphabet.includes( _symbol ) ? _error_str_array['err6'].replaceAll( _symbol, " " ) : _error_str_array['err6'].replaceAll( _symbol, " not " );
														 circles_lib_output( _out_channel, _out_id ? DISPATCH_SUCCESS : DISPATCH_ERROR,
																															_out_msg, _par_1, _cmd_tag );
												 }
										 }
										 else
										 {
									  		 _b_fail = YES, _error_str = _error_str_array['err7'].replaceAll( [ "%inclusor%", "%symbol%" ], [ "does not include", _symbol ] );
										 }
									}
							}
							 
		          var _size = safe_size( _glob_alphabet, 0 ) ;
		          circles_lib_output( _out_channel, DISPATCH_INFO, "Alphabet includes "+_size+" element"+(_size==1?"":"s"), _par_1, _cmd_tag );
					 }
           _fn_ret_val = _glob_alphabet.clone() ;
					 break ;
           case "regen": // alphabet regeneration
           var _n_sd = circles_lib_count_seeds();
           if ( _n_sd > 0 )
           {
              circles_lib_output( _out_channel, DISPATCH_INFO, "Attempting to regenerate the alphabet from current seeds configuration", _par_1, _cmd_tag );
           		var ITEM, _symbol, _inv_symbol, _check, _out_array = [] ;
              circles_lib_output( _out_channel, DISPATCH_INFO, "Erasing current alphabet", _par_1, _cmd_tag );
              _glob_alphabet = [];
              circles_lib_output( _out_channel, DISPATCH_INFO, "Now checking "+_n_sd+" registered seed"+(_n_sd==1?"":"s")+" for alphabet regeneration", _par_1, _cmd_tag );
              for( var _i = 0 ; _i < _n_sd ; _i++ )
              {
                  ITEM = _glob_seeds_array[_i] ;
                  if ( is_item_obj( ITEM ) )
                  {
                      _symbol = ITEM.symbol.lpad( " ", _long_mode ? 5 : 0 );
                      _inv_symbol = ITEM.inverse_symbol.rpad( " ", _long_mode ? 5 : 0 );
                      if ( _symbol.length == 0 )
                      {
                          _out_array.push( "<orange>Seed #" + ( _i + 1 ) + " has not been matched with the symbol</orange>" );
                          _symbol = "(none)" ;
                      }
                      else if ( _inv_symbol.length == 0 )
                      {
                          _out_array.push( "<orange>Seed #" + ( _i + 1 ) + " has not been matched with the inverse symbol</orange>" );
                          _inv_symbol = "(none)" ;
                      }
                      else if ( _symbol.length > 0 && _inv_symbol.length > 0 )
                      {
                          if ( !_glob_alphabet.includes( ITEM.symbol ) ) _glob_alphabet.push( ITEM.symbol );
                          if ( !_glob_alphabet.includes( ITEM.inverse_symbol ) ) _glob_alphabet.push( ITEM.inverse_symbol );
                          _check = ( ITEM.symbol.length > 0 && ITEM.inverse_symbol.length > 0 && circles_lib_word_inverse_get( ITEM.symbol ).strcmp( ITEM.inverse_symbol.trim() ) ) ? "<greenshock>Passed</greenshock>" : "<red>Mismatch</red>" ;
                          if ( _long_mode ) _out_array.push( "<snow>"+_symbol + "</snow> <-> <lightblue>" + _inv_symbol + "</lightblue>          " + _check );
                          else _out_array.push( _symbol );
                      }
                      else circles_lib_output( _out_channel, DISPATCH_WARNING, "Warning ! Generator with index " + ( _i + 1 ) + " has not been tagged.\nTry to init all again", _par_1, _cmd_tag );
                  }
                  else circles_lib_output( _out_channel, DISPATCH_WARNING, "Warning ! Generator with index " + ( _i + 1 ) + " does not exist.\nTry to init all again", _par_1, _cmd_tag );
              }
      
              _glob_alphabet = circles_lib_alphabet_get();
              var _n_alpha = safe_size( _glob_alphabet, 0 );
              if ( _n_alpha > 0 )
              {
                  var _MSG = "" ;
                  if ( _long_mode )
                  {
                      _MSG += "Alphabet (long)" + _glob_crlf ;
                      _MSG += "<snow>Symbol</snow>     <lightblue>Inverse symbol</lightblue>  <white>Check status</white>" + _glob_crlf ;
                      _MSG += _out_array.join( _glob_crlf );
                  }
                  else  _MSG += "Alphabet is <lightblue>" + _glob_alphabet.join( ", " ) + "</lightblue>" ;
      
                  _out_text_string = _MSG ;
                  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _MSG, _par_1, _cmd_tag );

                  var _fail_array = [], _n = safe_size( _glob_alphabet, 0 );
                  for( var _i = 0 ; _i < _n ; _i++ )
                  {
                     if ( !_glob_alphabet.includes( circles_lib_word_inverse_get( _glob_alphabet[_i] ) ) )
                     _fail_array.push( _glob_alphabet[_i] + " >> missing inverse symbol " + circles_lib_word_inverse_get( _glob_alphabet[_i] ) );
                  }
      
                  if ( safe_size( _fail_array, 0 ) > 0 )
                  {
                     circles_lib_output( _out_channel, DISPATCH_ERROR, "Mismatch errors while regenerating the alphabet", _par_1, _cmd_tag );
                     circles_lib_output( _out_channel, DISPATCH_INFO, _fail_array.join( _glob_crlf ), _par_1, _cmd_tag );
                  }
                  else
									{
					           var _size = safe_size( _glob_alphabet, 0 ) ;
					           circles_lib_output( _out_channel, DISPATCH_INFO, "Alphabet includes "+_size+" element"+(_size==1?"":"s"), _par_1, _cmd_tag );
	 									 circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Alphabet has been completely regenerated with success", _par_1, _cmd_tag );
									}

                  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "Regenerated alphabet includes these "+_n_alpha+" entries <lightblue>" + _glob_alphabet.join( ", " ) + "</lightblue>", _par_1, _cmd_tag );
              }
              else circles_lib_output( _out_channel, DISPATCH_ERROR, "Fail to regenerate alphabet", _par_1, _cmd_tag );
           }
           else circles_lib_output( _out_channel, DISPATCH_WARNING, "Fail to regenerate alphabet: missing registered seeds", _par_1, _cmd_tag );
           _fn_ret_val = _glob_alphabet.clone() ;
           break ;
           case "release":
           circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
           break ;
           case "show":
           if ( !is_array( _glob_alphabet ) ) _glob_alphabet = [] ;
           if ( safe_size( _glob_alphabet, 0 ) == 0 ) $.each( _items_array, function( _i, _item ){ if ( is_item_obj( _item ) ) _glob_alphabet.push( _item.symbol ); } ) ;
           if ( safe_size( _glob_alphabet, 0 ) > 0 )
           circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "Alphabet is <lightblue>" + _glob_alphabet.join( ", " ) + "</lightblue>", _par_1, _cmd_tag );
           else circles_lib_output( _out_channel, DISPATCH_INFO, "Alphabet is empty", _par_1, _cmd_tag );
           _fn_ret_val = _glob_alphabet.clone() ;
           break ;
	         default: break ;
				}
     }

     if ( _b_fail && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}