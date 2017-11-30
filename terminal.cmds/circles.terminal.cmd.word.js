function circles_terminal_cmd_word()
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
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _symbols_array = [] ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];
     var _sd_n = circles_lib_count_seeds();
     var _items_n = circles_lib_count_items();
     var _track_services_list = [ "orbit", "fixedpoints" ] ;
     var _treescan_services_list = [ "orbit", "" ] ;
     var _track_methods_list = [ circles_lib_method_get_def_for_cmds( METHOD_ALGEBRAIC ), circles_lib_method_get_def_for_cmds( METHOD_INVERSION ) ] ;

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array["copy"] = NO ;
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['all'] = NO ;
         _params_assoc_array['connect'] = NO ;
         _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
         _params_assoc_array['objectref'] = "" ;
         _params_assoc_array['list'] = NO ;
         _params_assoc_array['bordercolor'] = null ;
         _params_assoc_array['fillcolor'] = null ;
         _params_assoc_array['dump'] = NO ;
         _params_assoc_array['dump_array'] = null ;
         _params_assoc_array['dump_operator_index'] = UNDET ;
         _params_assoc_array['index'] = null ;
         _params_assoc_array['pts'] = [] ;
         _params_assoc_array['region'] = null ;
         _params_assoc_array['roundto'] = _glob_accuracy ;
         _params_assoc_array['service'] = "" ;
         _params_assoc_array['word'] = [] ;
         _params_assoc_array['extras'] = [] ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "all", "calc", "connect", "copy", "displacedset", "draw", "draworbits", "fixedpoints",
                                            "generator", "html", "list", "markpoints", "orbit", "rle", "resolve", "sink", "source",
                                            "lastpt", "test", "trace", "track", "treescan", "html", "release" );
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
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.stricmp( "seeds" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
              else if ( _p.stricmp( "generators" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_GENS ;
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
              else if ( _p.stricmp( "copy" ) ) _params_assoc_array["copy"] = YES ;
              else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
                   _params_assoc_array["pts"].push( read_2D_point( _p ) ) ;
              else if ( _p.is_one_of( "draworbits", "markpoints", "rle", "sink", "source" ) )
									 _params_assoc_array['extras'].push( _p.toLowerCase() );
              else if ( _p.stricmp( "trace" ) )
              {
                   _params_assoc_array['extras'].push( _p.toLowerCase() );
                   if ( _params_assoc_array['action'].length == 0 ) _params_assoc_array['action'] = _p.toLowerCase();
                   else if ( _params_assoc_array['action'].stricmp( "treescan" ) ) _params_assoc_array['service'] = _p.toLowerCase();
              }
              else if ( _p.includes( "@" ) && _p.count( "@" ) == 1 ) _params_assoc_array['objectref'] = _p ;
              else if ( _p.is_one_of_i( "calc", "displacedset", "draw", "generator", "resolve", "test", "track", "treescan", "release" ) )
									 _params_assoc_array['action'] = _p.toLowerCase();
              else if ( _p.is_one_of_i( "fixedpoints", "orbit", "lastpt" ) ) _params_assoc_array['service'] = _p.toLowerCase();
              else if ( _p.length > 0 && _params_assoc_array['action'].is_one_of_i( "trace" ) ) _symbols_array.push( _p );
              else if ( _p.is_one_of_i( "all", "connect", "html", "list" ) ) _params_assoc_array[''+_p.toLowerCase()] = YES ;
              else if ( _p.toLowerCase().start_with( "w:" ) || _p.testME( _glob_pqword_regex_pattern ) ) _params_assoc_array['word'].push( _p.replaceAll( "w:", "" ) );
              else if ( _p.testME( _glob_region_regex_pattern ) )
              {
                 _p = _p.replaceAll( [ "[", "]" ], "" ).split( "," );
                 if ( safe_size( _p, 0 ) != 4 )
                 {
                    _b_fail = YES, _error_str = "Invalid input region definition" ;
                    break ;
                 }
                 else
                 {
                    _params_assoc_array['service'] = "region" ;
                    _params_assoc_array['region'] = new rect( safe_float( _p[0], 0 ), safe_float( _p[1], 0 ),
                                                              safe_float( _p[2], 0 ), safe_float( _p[3], 0 ),
                                                              _RECT_ORIENTATION_CARTESIAN
                                                            );
                 }
              }
              else if ( circles_lib_colors_is_def( _p ) )
              {
                 if ( _params_assoc_array['bordercolor'] == null ) _params_assoc_array['bordercolor'] = _p ;
                 else if ( _params_assoc_array['fillcolor'] == null ) _params_assoc_array['fillcolor'] = _p ;
              }
              else if ( _p.toLowerCase().start_with( "startpt:" ) && _p.includes_i( "(", ",", ")" ) &&
                       ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) &&
                       _params_assoc_array['action'].stricmp( "track" ) )
                      )
              {
                  var _p_array = _p.split( ":" );
                  var _cmd = _p_array != null ? _p_array[0] : "" ;
                  var _value = _p_array != null ? _p_array[1] : "" ;
                      _value = _value.replaceAll( "(", "").replaceAll( ")", "" );
                  var _v_array = _value.split( "," );
                  var _x = ( _v_array != null ) ? safe_float( _v_array[0], 0 ) : 0 ;
                  var _y = ( _v_array != null ) ? safe_float( _v_array[1], 0 ) : 0 ;
                  _params_assoc_array['start'] = new point( _x, _y );
              }
              else
              {
                  if ( _params_assoc_array['action'].strcmp( "treescan" ) )
                  {
                     if ( _p.start_with_i( "startword:" ) ) _params_assoc_array['treescan_startword'] = _p.replaceAll( "startword:", "" );
                     else if ( _p.start_with_i( "startpt:" ) )
                     {
                       _p = _p.replaceAll( "startpt:", "" );
                       if ( _p.testME( _glob_cartesian_coords_regex_pattern ) ) _params_assoc_array['treescan_startpt'] = _p ;
                     }
                     else if ( _p.start_with_i( "tolerance:" ) ) _params_assoc_array['treescan_tolerance'] = safe_float( _p.replaceAll( "tolerance:", "" ), 0 );
                     else if ( _p.start_with_i( "depth:" ) )
                     {
                       _p = _p.replaceAll( "depth:", "" );
                       _params_assoc_array['treescan_depth'] = _p.stricmp( "loop" ) ? UNDET : safe_int( _p, 1 );
                     }
                     else if ( _p.start_with_i( "trace:" ) )
                     {
                       _params_assoc_array['treescan_trace'] = safe_float( _p.replaceAll( "trace:", "" ), 0 );
                       _params_assoc_array['service'] = "trace" ;
                     }
                  }
                  else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
              }
         }
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }

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
        var _dest_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
        var _category_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
		var _items_n = circles_lib_count_items( _items_array );
        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Working on the current group of</lightgray> <white>"+_dest_ref+"</white>", _par_1, _cmd_tag );
        // convert input indexes or symbols into an array of indexes to be applied to next actions
        var _selection_indexes_array = [] ;
        var _all = _params_assoc_array['all'] != null ? _params_assoc_array['all'] : NO ;
         if ( _all )
         {
             if ( is_array( _symbols_array ) ) _symbols_array.flush();
             else _symbols_array = [];
             for( var _i = 0 ; _i < _items_n ; _i++ )
             {
                ITEM = _items_array[_i] ;
                if ( is_item_obj( ITEM ) ) _symbols_array.push( ITEM.symbol );
             }
         }
         else if ( _params_assoc_array['word'].length > 0 ) _symbols_array = _params_assoc_array['word'].clone();

         _symbols_array = is_array( _symbols_array ) ? _symbols_array.unique().sort() : [] ;
         _symbols_array = _symbols_array.sort( function( a, b ) { return a > b ; } );

         var _lb_n = safe_size( _symbols_array, 0 );
         var _action = _params_assoc_array['action'] ;
         var _round_to = _params_assoc_array['roundto'] ;

         if ( _params_assoc_array['bordercolor'] == null ) _params_assoc_array['bordercolor'] = _glob_draw_seed_color ;
         if ( _params_assoc_array['fillcolor'] == null ) _params_assoc_array['fillcolor'] = _glob_fill_seed_color ;
         switch( _action )
         {
             case "release":
             circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
             break ;
             case "calc":
             if ( safe_size( _glob_alphabet, 0 ) == 0 )
             {
                _b_fail = YES, _error_str = "Missing alphabet: try init input seeds first" ;
             }
             else if ( _sd_n == 0 )
             {
                _b_fail = YES, _error_str = "Missing registered seeds" ;
             }
             else if ( _lb_n == 0 )
             {
                _b_fail = YES, _error_str = "Missing input words" ;
             }
             else
             {
                var _errors = [] ;
                $.each( _symbols_array, function( _i, _word )
                        {
                           // standard word syntax or p/q
                           if ( _word.testME( _glob_pqword_regex_pattern ) && circles_lib_alphabet_count_cap_symbols() != 2 )
                                _errors.push( "P/Q words can be computed only when two letters are declared (case-insensitively), that is, 'a' and 'b'" );
                           else
                           {
                               if ( !circles_lib_word_check( _solved_repetend, _glob_alphabet ) && !_is_repetend )
                               _errors.push( "Input word '"+_solved_repetend+"' does not match current alphabet ( "+_glob_alphabet.join(",")+" )" );
                           }
                        } );
                  if ( _errors.length > 0 )
                  {
                     _b_fail = YES, _error_str = _errors.join( _glob_crlf );
                  }
                  else
                  {
                  	 var _mm, p, _resolved_pq_word, _is_repetend, _solved_repetend, _msg ;
                     $.each( _symbols_array, function( _i, _word )
                             {
                                _mm = null ;
                                if ( _word.testME( _glob_pqword_regex_pattern ) )
                                {
                                   p = ( _word.split( "/" ) )[0], q = ( _word.split( "/" ) )[1];
                                   _resolved_pq_word = circles_lib_word_pq_translate( p, q );
                                   circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "input p/q word '<lightblue>"+_word+"</lightblue>' resolved into '<snow>"+_resolved_pq_word+"</snow>'", _par_1, _cmd_tag );
                                   _word = _resolved_pq_word
                                }
                                else
                                {
                                   _is_repetend = circles_lib_repetends_check_syntax( null, _word );
                                   _solved_repetend = _is_repetend ? circles_lib_repetends_resolve( _word ) : _word ;
                                   if ( _is_repetend )
                                   {
                                      circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Detected repetend '<lightblue>"+ $.terminal.escape_brackets(_word)+"</lightblue>' resolved into '<snow>"+_solved_repetend+"</snow>'", _par_1, _cmd_tag );
                                      _word = _solved_repetend ;
                                   }
                                }
                                  
                                _mm = circles_lib_word_mobiusmap_get( _word, _glob_seeds_array, _output_channel );
                                _msg = "<cadetblue>Calculating word '</cadetblue><yellow>"+_word+"</yellow><cadetblue>'</cadetblue>" ;
                                _msg += _glob_crlf + "<snow>a</snow> <lightblue>" + _mm.a.roundTo(_glob_accuracy-6).formula(YES,YES,_round_to).rpad( " ", _glob_accuracy + 3 ) + "</lightblue>" ;
                                _msg += "<snow>b</snow> <lightblue>" + _mm.b.roundTo(_glob_accuracy-6).formula(YES,YES,_round_to) + "</lightblue>" ;
                                _msg += _glob_crlf + "<snow>c</snow> <lightblue>" + _mm.c.roundTo(_glob_accuracy-6).formula(YES,YES,_round_to).rpad( " ", _glob_accuracy + 3 ) + "</lightblue>" ;
                                _msg += "<snow>d</snow> <lightblue>" + _mm.d.roundTo(_glob_accuracy-6).formula(YES,YES,_round_to) + "</lightblue>" ;
                                _msg += _glob_crlf + "<snow>Determinant</snow> <peacock>" + _mm.det().roundTo(_glob_accuracy-6).formula(YES,YES,_round_to) + "</peacock>" ;
                                _msg += _glob_crlf + "<greenyellow>Trace</greenyellow> <lightblue>" + _mm.trace().roundTo(_glob_accuracy-6).formula(YES,YES,_round_to).rpad( " ", _glob_accuracy + 2 ) + "</lightblue>" ;
                                _msg += _glob_crlf + "<greenyellow>Trace (squared)</greenyellow> <lightblue>" + _mm.trace().pow(2).roundTo(_glob_accuracy-6).formula(YES,YES,_round_to).rpad( " ", _glob_accuracy + 2 ) + "</lightblue>" ;
                                _msg += _glob_crlf + "<greenyellow>Classification</greenyellow> <lightblue>" + _mm.classification(NO).rpad( " ", _glob_accuracy + 2 ) + "</lightblue>" ;
                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                             } );
                  }
             }
             break ;
             case "displacedset":
             var _word = _params_assoc_array['word'][0] ;
             if ( safe_size( _glob_alphabet, 0 ) == 0 )
             {
                _b_fail = 1 ;
                _error_str = "Current alphabet is missing: please, init a group of Mobius maps first" ;
             }
             else if ( safe_size( _word, 0 ) == 0 )
             {
                _b_fail = 1 ;
                _error_str = "Missing input word" ;
             }
             else if ( !circles_lib_word_check( _word, _glob_alphabet ) )
             {
                _b_fail = 1 ;
                _error_str = "Word '"+_word+"' does not match current alphabet: " + _glob_alphabet.join( ", " );
             }
             else
             {
                circles_lib_output( _output_channel, DISPATCH_INFO, "The displaced set is the union of non-trivial orbits from all permutations of '"+_word+"'", _par_1, _cmd_tag );
                circles_lib_output( _output_channel, DISPATCH_INFO, "Computing the displaced set of input word '"+_word+"'", _par_1, _cmd_tag );
                var _start_pt = null, _orbit ;
                if ( safe_size( _params_assoc_array['pts'] ) == 0 )
                {
                   circles_lib_output( _output_channel, DISPATCH_INFO, "Missing explicit input start point: fixed point of '"+_word+"' will be assumed", _par_1, _cmd_tag );
                   circles_lib_output( _output_channel, DISPATCH_INFO, "Attempting to their computation", _par_1, _cmd_tag );
                   var _fp_def = "" ;
                   if ( _params_assoc_array['extras'].includes( "sink" ) ) _fp_def = "sink" ;
                   else if ( _params_assoc_array['extras'].includes( "source" ) ) _fp_def = "source" ;
                   else
                   {
                      _fp_def = "sink" ;
                      circles_lib_output( _output_channel, DISPATCH_INFO, "Missing input fixed point type: '"+_fp_def+"' will be assumed as default type", _par_1, _cmd_tag );
                   }
                   
                   var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
                   var _ret_chunk = circles_lib_word_fixedpoints_get( _word, _items_array, NO, _output_channel ) ;
                   var _ret_id = safe_int( _ret_chunk[0], RET_ERROR );
                   var _ret_pts = _ret_chunk[1] ;
                       
                   switch( _ret_id )
                   {
                       case CIRCLES_MISSING_SEEDS:
                       circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing seeds", _par_1, _cmd_tag );
                       break ;
                       case CIRCLES_MISSING_INPUT:
                       circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing input word", _par_1, _cmd_tag );
                       break ;
                       case CIRCLES_MISSING_SEEDS:
                       circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing alphabet", _par_1, _cmd_tag );
                       break ;
                       default:
                       $.each( _ret_pts, function( _i, _fp_chunk ) { if ( _fp_chunk[2].strcmp( _fp_def ) ) _start_pt = read_2D_point( _fp_chunk[0].real, _fp_chunk[0].imag ) ; } ) ;
                       if ( is_point( _start_pt ) )
                       {
                           circles_lib_output( _output_channel, DISPATCH_INFO, "Start point has been taken from the "+_fp_def+" fixed", _par_1, _cmd_tag );
                           circles_lib_output( _output_channel, DISPATCH_INFO, "point of the Mobius map of word '"+_word+"'", _par_1, _cmd_tag );
                           circles_lib_output( _output_channel, DISPATCH_INFO, "Now set to " + _start_pt.output( "cartesian" ), _par_1, _cmd_tag );
                           circles_lib_output( _output_channel, DISPATCH_INFO, _glob_crlf, _par_1, _cmd_tag );
                       }
                       else
                       {
                           circles_lib_output( _output_channel, DISPATCH_WARNING, "No "+_fp_def+" fixed point has been detected for the Mobius map of word '"+_word+"'", _par_1, _cmd_tag );
                           circles_lib_output( _output_channel, DISPATCH_WARNING, "The computation of the displaced set has been halted", _par_1, _cmd_tag );
                       }
                       break ;
                   }
                }
                else if ( is_point( _params_assoc_array['pts'][0] ) )
                {
                   _start_pt = _params_assoc_array['pts'][0] ;
                   circles_lib_output( _output_channel, DISPATCH_INFO, "Start point is " + _start_pt.output( "cartesian" ), _par_1, _cmd_tag );
                }
                  
                if ( is_point( _start_pt ) )
                {
                   // extract a palette from default colors palette, so that it includes as many shades as the input word letters
                   var _default_color_tags = _glob_lower_alphabet_colorization_array.keys_associative();
                   var _extracted_color_tags = [], _color, _html, _color_tag ;
                   var _displaced_set = [] ;
                   for( var _w = 0 ; _w < _word.length ; _w++ )
                   {
                      _color_tag = _glob_lower_alphabet_colorization_array[ _default_color_tags[ _w ] ] ;
                      _extracted_color_tags.push( _glob_def_clrs_tags[ "tag." + _color_tag ] ) ;
                   }
                      
                   var _context = _glob_wplane_work_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ) ;
                   if ( _params_assoc_array["copy"] ) _glob_storage["points"]["displacedset"] = [] ;

                   if ( _params_assoc_array["markpoints"] )
                   circles_lib_output( _output_channel, DISPATCH_INFO, "'Markpoint' flag is active", _par_1, _cmd_tag );
                      
                   for( var _w = 0 ; _w < _word.length ; _w++ )
                   {
                      _color = _extracted_color_tags[ _w ] ;
                      _orbit = circles_lib_word_orbit_calc( null, _word, _start_pt ) ;
                      _displaced_set = _displaced_set.concat( _orbit );
                      if ( _params_assoc_array['extras'].includes( "draworbits" ) )
                      circles_lib_draw_polyline( _context, wplane_sm, _orbit, _color, "", 1, NO, _glob_opacity, UNDET, 0, YES ) ;

                      // display orbit if 'draworbit' flag has been set, otherwise just list points coords in the terminal
                      _html = "<table>" ;
                      _html += "<tr><td COLSPAN=\"3\" STYLE=\"color:"+_color+";\">Orbit for word '"+_word+"'</td></tr>" ;
                      _html += "<tr><td HEIGHT=\"4\"></td></tr>" ;
                      $.each( _orbit, function( _i, _pt ) { _html += "<tr><td>"+( _i + 1 )+")</td><td WIDTH=\"5\"></td><td STYLE=\"color:"+_color+";\">"+_pt.output("cartesian")+"</td></tr>" ; } ) ;
                      _html += "<tr><td HEIGHT=\"8\"></td></tr>" ;
                      _html += "</table><br>" ;
                      circles_lib_terminal_html_display( _glob_terminal, _html );
                      // permute to have new word
                      _word = circles_lib_word_cyclic_permutation( _word ) ;
                   }
                      
		               if ( _params_assoc_array['extras'].includes( "markpoints" ) )
		               {
		               		 var _t = null ;
		               		 $.each( _displaced_set,
		               		 				 function( _i, _pt )
		               		 				 {
																	_t = circles_lib_draw_point( _context, wplane_sm, _pt.x, _pt.y,
																												 YES, DEFAULT_PT_BORDER_COLOR, YES, DEFAULT_PT_INTERIOR_COLOR,
																												 _glob_pt_border, _glob_pt_radius, _glob_opacity, 0, YES ) ;
															 }
											 			 ) ;
									 }

                   if ( _params_assoc_array["copy"] )
                   {
                   		_glob_storage["points"]["displacedset"] = _displaced_set.clone() ;
                      circles_lib_output( _output_channel, DISPATCH_INFO, "The displaced set has been copied into the storage space at 'points@displacedset'", _par_1, _cmd_tag );
									 }
                }
             }
             break ;
             case "draw":
             var _word = _params_assoc_array['word'][0] ;
             if ( safe_size( _glob_alphabet, 0 ) == 0 )
             {
                _b_fail = 1 ;
                _error_str = "Current alphabet is missing: please, init a group of Mobius maps first" ;
             }
             else if ( !circles_lib_word_check( _word, _glob_alphabet ) )
             {
                _b_fail = 1 ;
                _error_str = "Word '"+_word+"' does not match current alphabet: " + _glob_alphabet.join( ", " );
             }
             else if ( safe_size( _params_assoc_array['objectref'], 0 ) == 0 )
             {
                _b_fail = 1 ;
                _error_str = "Missing object reference" ;
             }
             else if ( safe_size( _word, 0 ) == 0 )
             {
                _b_fail = 1 ;
                _error_str = "Missing input word" ;
             }
             else
             {
                var _unpacked_ref = _params_assoc_array['objectref'].split( "@" );
                var _index = Math.max( 0, safe_int( _unpacked_ref[0], 0 ) );
                var _object_entity = ( _unpacked_ref[1] + "" ).trim().toLowerCase();
                var _mm = circles_lib_word_mobiusmap_get( _word, _glob_seeds_array, _output_channel );
                if ( !is_mobius_map( _mm ) )
                {
                   _b_fail = YES, _error_str = "System returned an invalid Mobius map: check the seeds first" ;
                }
                else if ( _index <= 0 )
                {
                   _b_fail = YES, _error_str = "Object index must be strictly positive" ;
                }
                else if ( safe_size( _object_entity, 0 ) == 0 )
                {
                   _b_fail = YES, _error_str = "Missing object entity" ;
                }
                else if ( _object_entity.stricmp( "figure" ) )
                {
                   var _rec_chunk = _rec_chunk = _glob_figures_array[_index-1] ;
                   var _canvas_context = null, _mapper = null ;
                   if ( _rec_chunk != null )
                   {
                       _class = _rec_chunk['class'] ;
                       _obj = _rec_chunk['obj'] ;
                       _draw = _rec_chunk['draw'] ;
                       _bordercolor = _rec_chunk['bordercolor'] ;
                       _fill = _rec_chunk['fill'] ;
                       _fillcolor = _rec_chunk['fillcolor'] ;
                       _opacity = _rec_chunk['opacity'] ;
                       _bordersize = _rec_chunk['bordersize'];
                       _borderradius = _rec_chunk['borderradius'];
                       _properties_mask = _rec_chunk['propertiesmask'];
                       _close = ( _rec_chunk['close'] != null ) ? _rec_chunk['close'] : NO ;

                       switch( _plane )
                       {
                          case Z_PLANE:
                          _canvas_context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
                          _mapper = zplane_sm ;
                          break ;
                          case W_PLANE:
                          _canvas_context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
                          _mapper = wplane_sm ;
                          break ;
                          case BIP_BOX:
                          _canvas_context = _glob_bipbox_canvas.getContext( _glob_canvas_ctx_2D_mode );
                          _mapper = bipbox_sm ;
                          break ;
					                default: break ;
                       }

                       // 1. plot original figure
                       // 2. de-construct each entity into a set of points to be
                       // mapped and finally glued back into the original object

                       var _pts_array = [];

                       switch( _class )
                       {
                          case FIGURE_CLASS_POINT:
                          _pts_array.push( _obj );
                          circles_lib_draw_point( _canvas_context, _mapper, _obj.x, _obj.y,
                                            _draw, _bordercolor, _fill, _fillcolor,
                                            _glob_pt_border, _glob_pt_radius,
                                            _opacity, _properties_mask );
                          break ;
                          case FIGURE_CLASS_LINE:
                          _pts_array.push( _obj.get_both_end_pts().clone() );
                          circles_lib_draw_polyline( _canvas_context, _mapper, _obj,
                                               _bordercolor, _fillcolor, _bordersize,
                                               _close, _opacity, UNDET,
                                               _properties_mask, YES );
                          break ;
                          case FIGURE_CLASS_RECT:
                          _pts_array.push( _obj.corners().clone() );
                          if ( _borderradius )
                          circles_lib_draw_rounded_rect( _canvas_context, _mapper, _obj,
                                                  _draw, _bordercolor, _fill, _fillcolor,
                                                  _bordersize, _borderradius, YES,
                                                  _opacity, _properties_mask );
                          else
                          circles_lib_draw_rect( _canvas_context, _mapper, _obj,
                                           _draw, _bordercolor, _fill, _fillcolor,
                                           _bordersize, YES, _opacity, _properties_mask );
                          break ;
                          case FIGURE_CLASS_CIRCLE:
                          _pts_array.push( _obj.get_representative_pts().clone() );
                          circles_lib_draw_complex_disk( _canvas_context, _mapper,
                                                  _obj.center.x, _obj.center.y, _obj.radius,
                                                  _draw, _bordercolor, _fill, _fillcolor,
                                                  _bordersize, _opacity, null, null, "", _properties_mask );
                          break ;
					                default: break ;
                      }

                      // remap all points through the Mobius map associated to input word
                      $.each( _pts_array, function( _i, _pt ) { _pts_array[ _i ] = _mm.compute( new complex( _pt.x, _pt.y ) ); } );
                            // re-construct the original object geometry from the resulting points
                            switch( _class )
                            {
                                case FIGURE_CLASS_POINT:
                                _obj = _pts_array[0] ;
                                circles_lib_draw_point( _canvas_context, _mapper, _obj.x, _obj.y,
                                                  _draw, _bordercolor, _fill, _fillcolor,
                                                  _glob_pt_border, _glob_pt_radius,
                                                  _opacity, _properties_mask );
                                break ;
                                case FIGURE_CLASS_LINE:
                                _obj.set_start_pt( _pts_array[0] );
                                _obj.set_end_pt( _pts_array[1] );
                                circles_lib_draw_polyline( _canvas_context, _mapper, _obj,
                                                     _bordercolor, _fillcolor, _bordersize,
                                                     _close, _opacity, UNDET,
                                                     _properties_mask, YES );
                                break ;
                                case FIGURE_CLASS_RECT:
                                _obj.set_left( _pts_array[0].x );
                                _obj.set_right( _pts_array[1].x );
                                _obj.set_top( _pts_array[0].y );
                                _obj.set_bottom( _pts_array[2].y );

                                if ( _borderradius )
                                circles_lib_draw_rounded_rect( _canvas_context, _mapper, _obj,
                                                        _draw, _bordercolor, _fill, _fillcolor,
                                                        _bordersize, _borderradius, YES,
                                                        _opacity, _properties_mask );
                                else
                                circles_lib_draw_rect( _canvas_context, _mapper, _obj,
                                                 _draw, _bordercolor, _fill, _fillcolor,
                                                 _bordersize, YES, _opacity, _properties_mask );
                                break ;
                                case FIGURE_CLASS_CIRCLE:
                                _obj.set_center( _pts_array[0] );
                                _obj.set_radius( _pts_array[1] );
                                circles_lib_draw_complex_disk( _canvas_context, _mapper,
                                                        _obj.center.x, _obj.center.y, _obj.radius,
                                                        _draw, _bordercolor, _fill, _fillcolor,
                                                        _bordersize, _opacity, null, null, "", _properties_mask );
                                break ;
								                default: break ;
                            }
                       }
                       else
                       {
                           _b_fail = YES, _error_str = "Index "+_index+" does not refer to any recorded figure." ;
                       }
                }
                else
                {
                    _b_fail = YES, _error_str = "Invalid object entity '"+_object_entity+"'" ;
                }
             }
             break ;
             case "generator":
             if ( safe_size( _glob_alphabet, 0 ) == 0 )
             {
                  _b_fail = YES, _error_str = "Missing alphabet: try init input seeds first" ;
             }
             else if ( _sd_n == 0 )
             {
                  _b_fail = YES, _error_str = "Missing registered seeds" ;
             }
             else if ( _lb_n == 0 )
             {
                  _b_fail = YES, _error_str = "Missing input words" ;
             }
             else
             {
                  var _errors = [] ;
                  $.each( _symbols_array, function( _i, _word )
                          {
                              // standard word syntax or p/q
                              if ( _word.testME( _glob_pqword_regex_pattern ) && circles_lib_alphabet_count_cap_symbols() != 2 )
                                   _errors.push( "P/Q words can be computed only when two letters are declared (case-insensitively), that is, 'a' and 'b'" );
                              else
                              {
                                  if ( !circles_lib_word_check( _solved_repetend, _glob_alphabet ) && !_is_repetend )
                                  _errors.push( "Input word '"+_solved_repetend+"' does not match current alphabet ( "+_glob_alphabet.join(",")+" )" );
                              }
                          } );
                  if ( _errors.length > 0 )
                  {
                      _b_fail = YES, _error_str = _errors.join( _glob_crlf );
                  }
                  else
                  {
                      var _added = 0, _mm = null ;
                      $.each( _symbols_array, function( _i, _word )
                              {
                                  if ( _word.testME( _glob_pqword_regex_pattern ) )
                                  {
                                      var p = ( _word.split( "/" ) )[0], q = ( _word.split( "/" ) )[1];
                                      var _resolved_pq_word = circles_lib_word_pq_translate( p, q );
                                      circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "input p/q word '<lightblue>"+_word+"</lightblue>' resolved into '<snow>"+_resolved_pq_word+"</snow>'", _par_1, _cmd_tag );
                                      _word = _resolved_pq_word
                                  }
                                  else
                                  {
                                      var _is_repetend = circles_lib_repetends_check_syntax( null, _word );
                                      var _solved_repetend = ( _is_repetend ) ? circles_lib_repetends_resolve( _word ) : _word ;
                                      if ( _is_repetend )
                                      {
                                           circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Detected repetend '<lightblue>"+_word+"</lightblue>' resolved into '<snow>"+_solved_repetend+"</snow>'", _par_1, _cmd_tag );
                                           _word = _solved_repetend ;
                                      }
                                  }
                                  
                                  _mm = circles_lib_word_mobiusmap_get( _word, _glob_seeds_array, _output_channel );
                                  
                                  if ( is_mobius_map( _mm ) )
                                  {
                                      var _cc = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? _mm.inversion_circle() : _mm.isometric_circle();
                                      var _sc = circles_lib_complex_to_screen_disk( _cc, zplane_sm );
                                      var _draw = is_circle( _cc ) ? _cc.draw : NO ;
                                      var _bordercolor = is_circle( _sc )  ? _sc.bordercolor : _glob_draw_seed_color ;
                                      var _fill = is_circle( _cc )  ? _cc.fill : YES ;
                                      var _fillcolor = is_circle( _sc )  ? _sc.fillcolor : "" ;
                                      if ( !_glob_gens_set_model_array.includes( _word ) && !_glob_gens_set_model_array.includes( circles_lib_word_inverse_get( _word ) ) )
                                      {
                                          _glob_gens_set_model_array.push( _word );
                                          _glob_gens_array.push( new item_obj( _mm, _cc, _sc, _word, 0,
                                      		                                           _draw, _bordercolor, _fill, _fillcolor,
                                      		                                           circles_lib_word_inverse_get( _word ), 1, ITEM_TYPE_MOBIUS ) );
    
                                          _glob_gens_set_model_array.push( circles_lib_word_inverse_get( _word ) );
                                          _mm = _mm.inv();
                                          _cc = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? _mm.inversion_circle() : _mm.isometric_circle();
                                          _sc = circles_lib_complex_to_screen_disk( _cc, zplane_sm );
                                          _draw = is_circle( _cc ) ? _cc.draw : NO ;
                                          _bordercolor = is_circle( _sc ) ? _sc.bordercolor : _glob_draw_seed_color ;
                                          _fill = is_circle( _cc ) ? _cc.fill : YES ;
                                          _fillcolor = is_circle( _sc ) ? _sc.fillcolor : "" ;
                                          _glob_gens_array.push( new item_obj( _mm, _cc, _sc, circles_lib_word_inverse_get( _word ), 0,
                                        		                                         _draw, _bordercolor, _fill, _fillcolor,
                                        		                                         _word, 1, ITEM_TYPE_MOBIUS ) )
                                           circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Generator has been computed from word '"+_word+"' with success", _par_1, _cmd_tag );
                                           circles_lib_output( _output_channel, DISPATCH_INFO, "Inverse generator has been also computed with success", _par_1, _cmd_tag );
                                           
                                           _added += 2 ;
                                           _glob_gens_set_to_init = YES ;
                                      }
                                      else circles_lib_output( _output_channel, DISPATCH_WARNING, "The word '"+_word+"' or '"+circles_lib_word_inverse_get(_word )+"' is already included in the generators set", _par_1, _cmd_tag );
                                  }
                                  else circles_lib_output( _output_channel, DISPATCH_WARNING, "Fail to compute generator from word '"+_input_word+"'", _par_1, _cmd_tag );
                              } );
                              
                        var _gg_n = circles_lib_count_gens(), _sch_n = circles_lib_count_gens_set_model();
                        if ( _gg_n > 0 && _added > 0 )
                        {
                             circles_lib_output( _output_channel, DISPATCH_INFO, _added + " gen"+(_added!=1?'s':'')+" ha"+(_added!=1?'ve':'s')+" been added to the generators set", _par_1, _cmd_tag );
                             circles_lib_output( _output_channel, DISPATCH_INFO, "The generators set includes " + _sch_n + " elements now", _par_1, _cmd_tag );
                             if ( _glob_gens_set_to_init )
                             {
                                 circles_lib_output( _output_channel, DISPATCH_WARNING, "", _par_1, _cmd_tag );
                                 circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning !"+_glob_crlf+"The generators set needs to be init", _par_1, _cmd_tag );
                             }
                        }
                        else if ( _added == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "No gen has been added: the generators set is empty", _par_1, _cmd_tag );
                  }
             }
             break ;
             case "resolve":
             if ( safe_size( _glob_alphabet, 0 ) == 0 )
             {
                  _b_fail = YES, _error_str = "Missing alphabet: try init input seeds first" ;
             }
             else if ( safe_size( _glob_alphabet, 0 ) != 4 )
             {
                  _b_fail = YES, _error_str = "This features is available for two-gens groups exclusively" ;
             }
             else if ( _lb_n == 0 )
             {
                  _b_fail = YES, _error_str = "Missing input words" ;
             }
             else
             {
                  var _errors = [], _original, _lengths_array, _chunks_array, _j, _word, _resolved, _case = 0 ;
                  $.each( _symbols_array, function( _i, _str )
                          {
                              _original = _str ;
                              if ( circles_lib_repetends_check_syntax( null, _str ) )
                              {
                              		_case = 1 ;
		                              _resolved = circles_lib_repetends_resolve( _str );
															}
                              else if ( _str.testME( _glob_pqword_regex_pattern ) )
                              {
                              		_case = 2 ;
                              		_str = _str.split( "/" );
		                              _word = circles_lib_word_pq_translate( _str[0], _str[1] );
															}
                              else if ( _str.testME( _glob_pqword_inv_regex_pattern ) )
                              {
                              		_case = 3 ;
                                  _str = _str.replaceAll( "inv", "" );
                              		_str = _str.split( "/" );
		                              _word = circles_lib_word_pq_translate( _str[0], _str[1] );
                              }

                              var _out = "<lightblue>"+$.terminal.escape_brackets( _original )+"</lightblue> resolved into <lightblue>"+_word+"</lightblue>" ;
                              circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out, _par_1, _cmd_tag );
                              if ( _params_assoc_array['extras'].includes( "rle" ) && _case.is_one_of( 2, 3 ) )
                              {
		                              _lengths_array = circles_lib_word_pq_find_powers( _str[0], _str[1] );
		                              _chunks_array = _word.split_into_chunks( _lengths_array ), _rle_word = "" ;
		                              for( _j = 0 ; _j < _lengths_array.length ; _j++ )
																	_rle_word += _chunks_array[_j][0] +( _lengths_array[_j] != 1 ? "<sup>" + _lengths_array[_j] + "</sup>" : "" );

		                              _out = "<table><tr><td STYLE=\"color:white;\"><SPAN STYLE=\"color:lightblue;\">"+$.terminal.escape_brackets( _original )+"</SPAN> resolved and packed into <SPAN STYLE=\"color:lightblue;\">"+_rle_word+"</SPAN></td></tr></table>" ;
																	circles_lib_terminal_html_display( _glob_terminal, _out );
															}

															if ( _params_assoc_array['extras'].includes( "trace" ) )
															{
																	 if ( _sd_n == 0 )
                                   circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't compute trace: missing registered seeds", _par_1, _cmd_tag );
																	 else
																	 {
		                                   _mm = circles_lib_word_mobiusmap_get( _word, _glob_seeds_array, _output_channel );
		                                   if ( is_mobius_map( _mm ) )
		                                   {
		                                        _tr = _mm.trace();
		                                        if ( _params_assoc_array['extras'].includes( "rle" ) )
		                                        {
									                              _out = "<table><tr><td STYLE=\"color:white;\">Trace of <SPAN STYLE=\"color:lightblue;\">"+_rle_word+"</SPAN> is "+_tr.formula(YES,YES,_round_to)+"</td></tr></table>" ;
																								circles_lib_terminal_html_display( _glob_terminal, _out );
																						}
																						else
																						{
				                                        _out_str = is_complex( _tr ) ? "Trace of '"+$.terminal.escape_brackets(_word)+"' is " + _tr.formula(YES,YES,_round_to) : "Can't compute trace: word '"+_word+"' returned error" ;
				                                        circles_lib_output( _output_channel, is_complex( _tr ) ? DISPATCH_INFO : DISPATCH_WARNING, _out_str, _par_1, _cmd_tag );
																						}
		                                   }
		                                   else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't compute trace: word '"+_word+"' returned error", _par_1, _cmd_tag );
																	 }
															}
                          } );
             }
             break ;
             case "test":
             var _word = _params_assoc_array['word'][0] ;
             if ( safe_size( _glob_alphabet, 0 ) == 0 )
             {
                  _b_fail = 1 ;
                  _error_str = "Current alphabet is missing: please, init a group of Mobius maps first" ;
             }
             else if ( safe_size( _word, 0 ) == 0 )
             {
                  _b_fail = 1 ;
                  _error_str = "Missing input word" ;
             }
             else if ( !circles_lib_word_check( _word, _glob_alphabet ) )
             {
                  _b_fail = 1 ;
                  _error_str = "Word '"+_word+"' does not match current alphabet: " + _glob_alphabet.join( ", " );
             }
             else
             {
                  circles_lib_output( _output_channel, DISPATCH_INFO, "Testing the input word '"+_word+"'", _par_1, _cmd_tag );
                  circles_lib_output( _output_channel, DISPATCH_INFO, "It is "+_word.length+" char"+( _word.length == 1 ? "" : "s" )+" long", _par_1, _cmd_tag );
                  var _is_cyclically_reduced = circles_lib_word_is_cyclically_reduced( _word );
                  circles_lib_output( _output_channel, DISPATCH_INFO, "It is "+( !_is_cyclically_reduced ? "not " : "" )+"cyclically reduced", _par_1, _cmd_tag );
                  var _is_reduced = circles_lib_word_is_reduced( _word, _glob_alphabet );
                  circles_lib_output( _output_channel, DISPATCH_INFO, "It is "+( !_is_reduced ? "not " : "" )+"reduced", _par_1, _cmd_tag );
                  
                  if ( !_is_reduced )
                  {
										  var _reduced_word = circles_lib_word_reduce( _word, _glob_alphabet );
		                  circles_lib_output( _output_channel, DISPATCH_INFO, "It can be reduced to '"+_reduced_word+"'", _par_1, _cmd_tag );
		                  circles_lib_output( _output_channel, DISPATCH_INFO, "The resulting reduced word '"+_reduced_word+"' is "+_reduced_word.length+" char"+( _reduced_word.length == 1 ? "" : "s" )+" long", _par_1, _cmd_tag );
		                  _word = _reduced_word ;
									}
									
									var _mm = circles_lib_word_mobiusmap_get( _word, _glob_seeds_array, _output_channel ) ;
                  var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
									var FF = circles_lib_word_fixedpoints_get( _word, _items_array, NO, _output_channel ) ;
									
                  circles_lib_output( _output_channel, DISPATCH_INFO, _glob_crlf.repeat(2), _par_1, _cmd_tag );
                  circles_lib_output( _output_channel, DISPATCH_INFO, "This is the resulting Mobius map from word '"+_word+"'", _par_1, _cmd_tag );
                  circles_lib_output( _output_channel, DISPATCH_INFO, _mm.output( _glob_crlf ), _par_1, _cmd_tag );
									
									var _ret_id = FF[0], _ret_pts = FF[1] ;
									if ( _ret_id == YES )
									{
			                 circles_lib_output( _output_channel, DISPATCH_INFO, _glob_crlf.repeat(2), _par_1, _cmd_tag );
											 var _n_pts = safe_size( _ret_pts, 0 ) ;
		                   circles_lib_output( _output_channel, DISPATCH_INFO, "Found " + _n_pts + " fixed point" + ( _n_pts == 1 ? "" : "s" ), _par_1, _cmd_tag );
											 $.each( _ret_pts,
											 				 function( _i, _chunk )
											 				 {
																		circles_lib_output( _output_channel, DISPATCH_INFO, "Fixed point #"+(_i+1) + " - " + _chunk[2], _par_1, _cmd_tag );
																		circles_lib_output( _output_channel, DISPATCH_INFO, _chunk[0].formula(YES,YES,_round_to), _par_1, _cmd_tag );
															 }
											 			 ) ;
									}
             }
             break ;
             case "trace":
             var _seeds_len = safe_size( _symbols_array, 0 );
             if ( _seeds_len > 0 )
             {
                  var _mm = null, _alphabet = circles_lib_alphabet_get(), _tr, _out_str, _is_rep = NO, _rep_str ;
                  if ( !is_array( _alphabet ) )
                  {
                      _b_fail = 1 ;
                      _error_str = "Can't compute trace: no group has been initialized yet" ;
                  }
                  else
                  {
                      $.each( _symbols_array,
                              function( _i, _symbol )
                              {
                                  _is_rep = circles_lib_repetends_check_syntax( _symbol );
                                  if ( _is_rep == YES )
                                  {
                                       _rep_str = circles_lib_repetends_resolve( _symbol );
                                       circles_lib_output( _output_channel, DISPATCH_INFO, "Detected repetend syntax in "+$.terminal.escape_brackets(_symbol)+": resolved to " + _rep_str, _par_1, _cmd_tag );
                                       _symbol = _rep_str ;
                                  }

                                  if ( circles_lib_word_check( _symbol, _alphabet ) )
                                  {
                                      _mm = circles_lib_word_mobiusmap_get( _symbol, _glob_seeds_array, _output_channel );
                                      if ( is_mobius_map( _mm ) )
                                      {
                                           _tr = _mm.trace();
                                           _out_str = ( is_complex( _tr ) ) ? "Trace of '"+$.terminal.escape_brackets(_symbol)+"' is " + _tr.formula(YES,YES,_round_to) : "Can't compute trace: word '"+_symbol+"' returned error" ;
                                           circles_lib_output( _output_channel, is_complex( _tr ) ? DISPATCH_SUCCESS : DISPATCH_WARNING, _out_str, _par_1, _cmd_tag );
                                      }
                                      else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't compute trace: word '"+_symbol+"' returned error", _par_1, _cmd_tag );
                                  }
                                  else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't compute trace: word '"+_symbol+"' does not match current alphabet ("+_alphabet.join(",")+")", _par_1, _cmd_tag );
                              }
                             );
                  }
             }
             else circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't compute trace: input is empty", _par_1, _cmd_tag );
             break ;
             case "track":
             var _bFOUND = 1 ;
             var _input_word = _params_assoc_array['word'][0], _symbol ;
             if ( _params_assoc_array['word'].length > 1 )
             {
                 circles_lib_output( _output_channel, DISPATCH_WARNING, "Just one word can be tracked at once", _par_1, _cmd_tag );
                 circles_lib_output( _output_channel, DISPATCH_INFO, "Now processing word '"+_input_word+"'", _par_1, _cmd_tag );
             }
             
             var _is_repetend = circles_lib_repetends_check_syntax( null, _input_word );
             var _solved_repetend = _is_repetend ? circles_lib_repetends_resolve( _input_word ) : _input_word ;
             if ( _is_repetend )
             {
                 var _encoded = $.terminal.escape_brackets( _input_word ); 
                 circles_lib_output( _output_channel, DISPATCH_INFO, "Detected repetend syntax in '"+_encoded+"'", _par_1, _cmd_tag );
                 circles_lib_output( _output_channel, DISPATCH_INFO, "Resolved repetend '"+_encoded+"' into '"+_solved_repetend+"'", _par_1, _cmd_tag );
             }
             
             var _check = circles_lib_word_check( _solved_repetend, _glob_alphabet );
             var _w_len = safe_size( _solved_repetend, 0 );
             if ( _sd_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't track: the list of registered items is empty", _par_1, _cmd_tag );
             else if ( _w_len == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't track: the input word is empty", _par_1, _cmd_tag );
             else if ( safe_size( _glob_alphabet, 0 ) == 0 )
             {
                  _b_fail = YES, _error_str = "Missing alphabet: try init input seeds first" ;
             }
             else if ( !_check )
             {
                  _b_fail = YES, _error_str = "The input word '"+_input_word+"' does not match the current alphabet ("+_glob_alphabet.join(",")+")" ;
             }
             else if ( _glob_method == METHOD_NONE )
             {
                  _b_fail = YES, _error_str += "Can't track."+_glob_crlf+"Choose one among these methods first: " + _track_methods_list.join( ", " );
             }
             else if ( _params_assoc_array['service'].length == 0 )
             {
                  _b_fail = YES, _error_str = "Missing service specification."+_glob_crlf+"Please, choose one among these options: "+_track_services_list.join( ", " )+"" ;
             }
             else if ( _params_assoc_array['service'].strcmp( "orbit" ) && _params_assoc_array['start'] == null )
             {
                  _b_fail = YES, _error_str = "Missing start point for orbit tracking" ;
             }
             else
             {
                 var _freedraw_canvas = circles_lib_canvas_get_from_role( W_PLANE, ROLE_FREEDRAW );
                 _input_word = _solved_repetend ;
                 switch( _params_assoc_array['service'] )
                 {
                       case "orbit":
                       if ( _glob_method == METHOD_INVERSION )
                       {
                           var _ret_chunk = circles_lib_draw_word_inversion( _freedraw_canvas.getContext( _glob_canvas_ctx_2D_mode ), wplane_sm, null, YES, _input_word, YES, _output_channel );
                           var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                           var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Memory failure - Err. 0.1" ;
                               if ( _ret_id == 0 ) circles_lib_output( _output_channel, DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                               else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                           var _ret_orbit = is_array( _ret_chunk ) ? _ret_chunk[2] : null ;

                           if ( _params_assoc_array['list'] && _ret_orbit != null )
                           {
                                var _padding_len = 24 ;
                                var _n_col = "N" ;          _n_col = _n_col.rpad( " ", 6 );
                                var _real_col = "Real" ;    _real_col = _real_col.rpad( " ", _padding_len );
                                var _imag_col = "Imag" ;    _imag_col = _imag_col.rpad( " ", _padding_len );

                                var _o = _ret_orbit.length ;
                                var _out_file_txt = _o + " point" + ( ( _o != 1 ) ? "s" : "" ) + " tracked" + _glob_crlf ;
                                    _out_file_txt += _n_col + _real_col + _imag_col + _glob_crlf ;

                                circles_lib_output( _output_channel, DISPATCH_INFO, _o + " point" + ( ( _o != 1 ) ? "s" : "" ) + " tracked", _par_1, _cmd_tag );
                                circles_lib_output( _output_channel, DISPATCH_INFO, _n_col + _real_col + _imag_col + _type_col, _par_1, _cmd_tag );
                                var _pt, _x, _y, _n ;
                                for( var _i = 0 ; _i < _o ; _i++ )
                                {
                                     _pt = _ret_orbit[_i], _x = new String( _pt.x ), _y = new String( _pt.y ), _n = new String( _i + 1 );
                                     _n = _n.rpad( " ", 6 );
                                     _x = _x.rpad( " ", _padding_len );
                                     _y = _y.rpad( " ", _padding_len );
                                     _out_file_txt += _n + _x + _y + _glob_crlf ;
                                     circles_lib_output( _output_channel, DISPATCH_INFO, _n + _x + _y, _par_1, _cmd_tag );
                                }

				                        if ( _params_assoc_array['dump'] &&
															 			 _params_assoc_array['dump_array'].length > 0 )
				                        {
				                      			var _filename = _params_assoc_array['dump_array'] ;
				                            var _basename = basename( _filename );
				                			      var _extension = ( _filename.includes( "." ) ) ? _filename.split( ".").get_last() : "" ;
																		_filename = ( _glob_title.length > 0 ) ? ( _glob_title + "." + _basename + "." +  _extension ) : "circles." + _filename ;

									 								  _params_assoc_array['dump_array'] = is_array( _params_assoc_array['dump_array'] ) ? _params_assoc_array['dump_array'][0] : "circles.track.word.txt" ;
																		var _ret_chunk = circles_lib_dump_data_to_format( _out_file_txt.strip_tags(), _params_assoc_array['dump_array'] );
																		var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
																		var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation";
																		if ( _ret_id == 0 )
																		{
																				_b_fail = YES, _error_str = _ret_msg ;
																		}
																		else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
				                        }
                           }
                       }
                       else if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) )
                       {
                           var _start_x = safe_float( _params_assoc_array['start'].x, 0 );
                           var _start_y = safe_float( _params_assoc_array['start'].y, 0 );
                           var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
                           var _ret_chunk = circles_lib_draw_orbit_from_word( _freedraw_canvas.getContext( _glob_canvas_ctx_2D_mode ), wplane_sm, _items_array,
													 																						YES, _start_x, _start_y,
                                                                      _input_word, YES, _params_assoc_array['connect'],
																																			YES, _params_assoc_array['bordercolor'], _params_assoc_array['fillcolor'],
                                                                      YES, _glob_terminal_echo_flag, _glob_drawentity, _output_channel );
                           var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                           var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Memory failure - Err. 0.2" ;
                               if ( _ret_id == 0 ) circles_lib_output( _output_channel, DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                               else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                           var _ret_orbit = is_array( _ret_chunk ) ? _ret_chunk[2] : null ;
                           if ( _params_assoc_array['list'] && _ret_orbit != null )
                           {
                                var _padding_len = 24 ;
                                var _n_col = "N" ;          _n_col = _n_col.rpad( " ", 6 );
                                var _real_col = "Real" ;     _real_col = _real_col.rpad( " ", _padding_len );
                                var _imag_col = "Imag" ;     _imag_col = _imag_col.rpad( " ", _padding_len );

                                var _o = _ret_orbit.length ;
                                var _out_file_txt = _o + " point" + ( ( _o != 1 ) ? "s" : "" ) + " tracked" + _glob_crlf ;
                                    _out_file_txt += _n_col + _real_col + _imag_col + _glob_crlf ;

                                circles_lib_output( _output_channel, DISPATCH_INFO, _o + " point" + ( ( _o != 1 ) ? "s" : "" ) + " tracked", _par_1, _cmd_tag );
                                circles_lib_output( _output_channel, DISPATCH_INFO, _n_col + _real_col + _imag_col, _par_1, _cmd_tag );
                                var _pt, _x, _y, _n ;
                                for( var _i = 0 ; _i < _o ; _i++ )
                                {
                                     _pt = _ret_orbit[_i] ;
                                     _x = new String( _pt.x ), _y = new String( _pt.y ), _n = new String( _i + 1 );
                                     _n = _n.rpad( " ", 6 );
                                     _x = _x.rpad( " ", _padding_len );
                                     _y = _y.rpad( " ", _padding_len );

                                     circles_lib_output( _output_channel, DISPATCH_INFO, _n + _x + _y, _par_1, _cmd_tag );
                                     _out_file_txt += _n + _x + _y + _glob_crlf ;
                                }

                                if ( _params_assoc_array['dump_array'].length > 0 )
                                {
                                    var _filename = _params_assoc_array['dump_array'] ;
                                    var _basename = basename( _filename );
                        			      var _extension = ( _filename.includes( "." ) ) ? _filename.split( ".").get_last() : "" ;
																		_filename = ( _glob_title.length > 0 ) ? ( _glob_title + "." + _basename + "." +  _extension ) : "circles." + _filename ;
                                    var blob = new Blob( [ _out_file_txt ], { type: 'plain/text', endings: 'native' });
                                    saveAs( blob, _filename );
                                }
                           }
                       }
                       break ;
                       case "fixedpoints":
                       var _ret = circles_lib_word_check( _input_word, _glob_alphabet );
                       if ( _ret == CIRCLES_MISSING_ALPHABET ) circles_lib_output( _output_channel, DISPATCH_ERROR, "The input word does not match the current alphabet", _par_1, _cmd_tag );
                       else if ( _ret == CIRCLES_MISSING_INPUT ) circles_lib_output( _output_channel, DISPATCH_ERROR, "Can't perform this operation.\nPlease, input a word", _par_1, _cmd_tag );
                       else
                       {
					                  var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
                            var _ret_chunk = circles_lib_word_fixedpoints_get( _input_word, _items_array, _params_assoc_array['all'], _output_channel );
                            var _ret_id = safe_int( _ret_chunk[0], RET_ERROR );
                            var _ret_data = _ret_id == RET_ERROR ? null : _ret_chunk[1] ;
                            if ( _ret_data == null )
                            {
                                 if ( _ret_data == CIRCLES_MISSING_ALPHABET ) circles_lib_output( _output_channel, DISPATCH_ERROR, "The input word does not match the current alphabet", _par_1, _cmd_tag );
                                 else if ( _ret_data == CIRCLES_MISSING_INPUT ) circles_lib_output( _output_channel, DISPATCH_ERROR, "Can't perform this operation.\nPlease, input a word", _par_1, _cmd_tag );
                            }
                            else
                            {
                                circles_lib_canvas_clean( _freedraw_canvas );
                                var S = safe_size( _ret_data, 0 );
                                if ( S > 0 )
                                {
                                    var _padding_len = 24 ;

                                    var context = _freedraw_canvas.getContext( _glob_canvas_ctx_2D_mode );
                                    var _n_col = "N" ;        _n_col = _n_col.rpad( " ", 6 );
                                    var _real_col = "Real" ;   _real_col = _real_col.rpad( " ", _padding_len );
                                    var _imag_col = "Imag" ;   _imag_col = _imag_col.rpad( " ", _padding_len );
                                    var _word_col = "Symbol" ; _word_col = _word_col.rpad( " ", _input_word.length + 3 );
                                    var _type_col = "Type" ;   _type_col = _type_col.rpad( " ", _padding_len );

                                    var _out_file_txt = "" ;
                                    var _header = S + " point" + ( ( S != 1 ) ? "s" : "" ) + " found" + _glob_crlf ;
                                        _header += _n_col + _word_col + _real_col + _imag_col + _type_col + _glob_crlf ;

                                    if ( _is_repetend )
                                    {
                                        var _msg = "Repetend found: resolved to " + _input_word ;
                                        circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
                                        _out_file_txt += _msg ;
                                    }

                                    _out_file_txt += _header ;

                                    if ( _params_assoc_array['list'] ) circles_lib_output( _output_channel, DISPATCH_INFO, _header, _par_1, _cmd_tag );

                                    var _freedraw_context = _freedraw_canvas.getContext( _glob_canvas_ctx_2D_mode );
                                    var _chunk, _fp, startINDEX, _symbol, _inv_symbol, _fp_type ;
                                    var screen_center_pt, _n, _fp_x, _fp_y, _list_entry ;
                                    var _palette_rows = [ "lightblue", "snow" ], _palette_index = 0, _palette_rec_label = "", _palette_color_def ;
                                    for( var s = 0 ; s < S ; s++ )
                                    {
                                         _chunk = _ret_data[s] ;
                                             startINDEX = 0 ;
                                         _fp = _chunk[startINDEX] ;
                                             startINDEX++ ;
                                         _symbol = _chunk[startINDEX].rpad( " ", _input_word.length + 3 );
                                         if ( !_palette_rec_label.strcmp( _symbol ) )
                                         {
                                             _palette_index++ ;
                                             _palette_index %= _palette_rows.length ;
                                             _palette_color_def = _palette_rows[ _palette_index ] ;
                                             _palette_rec_label = _symbol ;
                                         }
                                         _symbol =  "<"+_palette_color_def+">"+_symbol+"</"+_palette_color_def+">" ;
                                         
                                             startINDEX++ ;
                                         _fp_type = _chunk[startINDEX] ;

                                         screen_center_pt = wplane_sm.from_cartesian_to_client( _fp.real, _fp.imag );

                                         _n = ( s + 1 ) + "" ;          _n = _n.rpad( " ", 6 );
                                         _fp_x = _fp.real + "" ;        _fp_x = "<"+_palette_color_def+">"+_fp_x.rpad( " ", _padding_len )+"</"+_palette_color_def+">" ;
                                         _fp_y = _fp.imag + "" ;        _fp_y = "<"+_palette_color_def+">"+_fp_y.rpad( " ", _padding_len )+"</"+_palette_color_def+">" ;
                                         _fp_type = _fp_type + "" ;     _fp_type = "<"+_palette_color_def+">"+_fp_type.rpad( " ", _padding_len )+"</"+_palette_color_def+">" ;

                                         circles_lib_draw_point( _freedraw_context, wplane_sm,
                                                           _fp.real, _fp.imag,
                                                           YES, _glob_pt_border_color, YES, _glob_pt_interior_color,
                                                           _glob_pt_border, _glob_pt_radius );

                                         context.font = DEFAULT_FONT_SIZE + " " + DEFAULT_FONT_FAMILY;
                                         context.fillStyle = DEFAULT_PT_INTERIOR_COLOR ;
                                         context.fillText( "#" + ( s + 1 ) + " : " + _fp_type, screen_center_pt.x - 10, screen_center_pt.y - 12 );

                                         _list_entry = _n + _symbol + _fp_x + _fp_y + _fp_type + _glob_crlf ;
                                         _out_file_txt += _list_entry ;

                                         if ( _params_assoc_array['list'] )
                                         circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _list_entry, _par_1, _cmd_tag );
                                    }

                                    if ( _params_assoc_array['dump_array'].length > 0 )
                                    {
                                        var _filename = _params_assoc_array['dump_array'] ;
                                        var _basename = basename( _filename );
                              			    var _extension = ( _filename.includes( "." ) ) ? _filename.split( ".").get_last() : "" ;
    																		_filename = ( _glob_title.length > 0 ) ? ( _glob_title + "." + _basename + "." +  _extension ) : "circles." + _filename ;
                                        var blob = new Blob( [ _out_file_txt ], { type: 'plain/text', endings: 'native' });
                                        saveAs( blob,_filename );
                                    }
                                }
                            }
                       }
                       break ;
			                 default: break ;
                 }
             }
             break ;
             case "treescan":
             var _sd_n = circles_lib_count_seeds();
             var _err_array = [] ;
             if ( _sd_n == 0 ) _err_array.push( "Missing registered seeds for treescan" );
             if ( _params_assoc_array['treescan_startword'] == null ) _err_array.push( "Missing 'startword' param for treescan" );
             if ( _params_assoc_array['treescan_depth'] == null ) _err_array.push( "Missing 'depth' param for treescan" );
             if ( _params_assoc_array['service'].is_one_of_i( "orbit", "lastpt" ) )
             {
                 if ( _params_assoc_array['treescan_startpt'] == null ) _err_array.push( "Missing 'startpt' param for "+_params_assoc_array['service']+" treescan" );
             }
             else if ( _params_assoc_array['service'].is_one_of_i( "trace" ) )
             {
                 if ( _params_assoc_array['treescan_tolerance'] == null ) _err_array.push( "Missing 'tolerance' value for treescan" );
                 if ( _params_assoc_array['treescan_trace'] == null ) _err_array.push( "Missing 'trace' value for treescan" );
             }

             if ( _output_channel != OUTPUT_TERMINAL )
                  circles_lib_output( _output_channel, DISPATCH_WARNING, "Word treescan runs in console mode exclusively", _par_1, _cmd_tag );
             else if ( _err_array.length > 0 )
             {
                  _b_fail = YES, _error_str = _err_array.join( _glob_crlf );
             }
             else if ( _params_assoc_array['treescan_startword'].length >= _params_assoc_array['treescan_depth']
                       && _params_assoc_array['treescan_depth'] != UNDET )
             {
                  _b_fail = YES, _error_str = "Incoherent 'startword' length and 'depth' params: the former can't be equal or larger than the latter" ;
             }
             else if ( safe_string( _params_assoc_array['service'] ).length == 0 )
             {
                  _b_fail = YES, _error_str = "Missing service specification."+_glob_crlf+"Please, choose one among these options: "+_treescan_services_list.join( ", " );
             }
             else if ( safe_int( _params_assoc_array['treescan_depth'], UNDET ) == UNDET &&
                       safe_string( _params_assoc_array['service'] ).stricmp( "orbit" ) )
             {
                  _b_fail = YES, _error_str = "Incongruent params: 'loop' can't be set if service is 'orbit'" ;
                  _error_str += _glob_crlf + "Try to input a number instead" ;
             }
             else
             {
                  var _startword = _params_assoc_array['treescan_startword'] ;
                  var _startpt = _params_assoc_array['treescan_startpt'] ;
                  _startpt = _startpt == null ? "0,0" : _startpt.replaceAll( [ "(", ")" ], "" );
                  var _tolerance = _params_assoc_array['treescan_tolerance'] ;
                  var _depth = _params_assoc_array['treescan_depth'] ;
                  var _trace = _params_assoc_array['treescan_trace'] ;
                  var _list = safe_int( _params_assoc_array['list'], NO );

                  var _letters_map = [], _input_array = [ _startword ], _alphabet = circles_lib_alphabet_get();
                  var _symbols = [], _inverse_symbols = [];
                  for( var _i = 0 ; _i < _sd_n ; _i++ )
                  {
                       _letters_map[ _glob_seeds_array[_i].symbol ] = _glob_seeds_array[_i].inverse_symbol ;
                       _symbols.push( _glob_seeds_array[_i].symbol );
                       _inverse_symbols.push( _glob_seeds_array[_i].inverse_symbol );
                  }

                  circles_lib_output( _output_channel, DISPATCH_INFO, "Resuming input params", _par_1, _cmd_tag );
                  if ( _startpt != null )
                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>Start point</snow> <lightblue>"+_startpt+"</lightblue>", _par_1, _cmd_tag );
                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>Start word</snow> <lightblue>"+_startword+"</lightblue>", _par_1, _cmd_tag );
                  if ( _tolerance != null )
                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>Tolerance</snow> <lightblue>"+_tolerance+"</lightblue>", _par_1, _cmd_tag );
                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>Depth</snow> <lightblue>"+( _depth == UNDET ? "Loop" : _depth )+"</lightblue>", _par_1, _cmd_tag );
                  if ( _trace != null )
                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>Trace</snow> <lightblue>"+_trace+"</lightblue>", _par_1, _cmd_tag );
                  if ( _depth == UNDET ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Looping mode activated: type 'stop' to break the tree scan running", _par_1, _cmd_tag );
                  circles_lib_output( _output_channel, DISPATCH_INFO, "Treescan start ...", _par_1, _cmd_tag );
                  circles_lib_output( _output_channel, DISPATCH_WARNING, "Type 'stop' to terminate this process", _par_1, _cmd_tag );
                  if ( _params_assoc_array["copy"] && _params_assoc_array['service'].stricmp( "orbit" ) )
                  circles_lib_output( _output_channel, DISPATCH_INFO, "Copy option unavailable for 'orbit' service", _par_1, _cmd_tag );

                  var JS_FOLDER_COMPONENTS = "code/js/components/" ;
                  var MULTITHREAD_FOLDER = JS_FOLDER_COMPONENTS+"multi.threading/cmds.support/treescan/" ;
   		            var JS_FOLDER_SUPPORT = _glob_path_to_support + "code/js/basements/" ;
                  var JS_FOLDER_LIBS = JS_FOLDER_COMPONENTS + "libs/" ;
   		            var JS_FOLDER_CLASSES = JS_FOLDER_SUPPORT + "classes/load/" ;
                  $.ajaxSetup( {async:false} );
                  var _code_array = [], _load_failure = 0;
                  _code_array.push( $.getScript( MULTITHREAD_FOLDER + "multithread.treescan.worker.js", function( response, status, jqxhr ) { _load_failure = status.toLowerCase().stricmp( "success" ) ? NO : YES ; } ).responseText );
									if ( _load_failure )
									{
											 _b_fail = YES, _error_str = "Fail to load multithread component" ;
									}
									else
									{
		                  // join the above code into one piece and give it to the worker
		                  var _inline_worker_code = _code_array.join( _glob_crlf );
		
		                  // import this code for worker to process input data
		                  _glob_inline_worker = new inline_worker( _inline_worker_code,
		                                               [ MULTITHREAD_FOLDER + "multithread.treescan.process.js",
		                                                 JS_FOLDER_SUPPORT + "basics/a-basics/json.lib.js",
		                                                 JS_FOLDER_SUPPORT + "basics/a-basics/number.js",
		                                                 JS_FOLDER_SUPPORT + "basics/a-basics/string.js",
		                                                 JS_FOLDER_SUPPORT + "basics/array.js",
		                                                 JS_FOLDER_SUPPORT + "classes/load/a-primitives/2d.point.class.js",
		                                                 JS_FOLDER_SUPPORT + "classes/load/a-primitives/rect.class.js",
		                                                 JS_FOLDER_SUPPORT + "classes/load/b-basic.maths/complex.number.class.js",
		                                                 JS_FOLDER_SUPPORT + "classes/load/e-adv.maths/mobius.map.class.js",
		                                                 JS_FOLDER_SUPPORT + "fns/fns.generals.js",
		                                                 JS_FOLDER_SUPPORT + "fns/fns.math.js",
		                                                 JS_FOLDER_SUPPORT + "fns/fns.strings.js",
		                                                 JS_FOLDER_COMPONENTS + "globals/defs/circles.constants.js",
		                                                 JS_FOLDER_LIBS + "symbols/circles.lib.word.js"
		                                               ] );
		
		                  // feed some input vars
		                  _glob_inline_worker.init_vars( { out_channel : _output_channel,
		                                   param_01 : _par_1,
		                                   seeds: _glob_seeds_array.clone(),
		                                   startword : _startword,
		                                   startpt : _startpt,
		                                   depth : _depth,
		                                   tolerance : _tolerance,
		                                   trace : _trace,
		                                   region : _params_assoc_array['region'],
		                                   service : _params_assoc_array['service'],
		                                   symbols : _symbols.join( "@" ),
		                                   inverse_symbols : _inverse_symbols.join( "@" ),
		                                   alphabet : _alphabet.join( "@" ),
		                                   list : _list,
		                                   bordercolor : _params_assoc_array['bordercolor'],
		                                   fillcolor : _params_assoc_array['fillcolor'],
		                                   crlf : _glob_crlf,
		                                   copy : _params_assoc_array["copy"],
		                                   accuracy : _glob_accuracy } );
		
		                  // run the worker and output data to the DOM
		                  _glob_inline_worker.run();
									}
             }
             break ;
             default: break ;
         }
     }
     
     if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}