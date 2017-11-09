_glob_terminal_cmd_files_include[ "init" ] = [ "figures" ] ;

function circles_terminal_cmd_isometric()
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
     var _symbols_array = [] ;
     var _inv_symbols_array = [] ;
     var _rotation_degree = 0, _rotation_radians = 0 ;
     var _items_n = circles_lib_count_items();
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['all'] = 0 ;
         _params_assoc_array["copy"] = NO ;
         _params_assoc_array['draw'] = NO ;
         _params_assoc_array['drawcolor'] = "" ;
         _params_assoc_array['dump'] = NO ;
         _params_assoc_array['dump_array'] = null ;
         _params_assoc_array['dump_operator_index'] = UNDET ;
         _params_assoc_array['fillcolor'] = "" ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['index'] = null ;
         _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
         _params_assoc_array['symbol'] = null ;
         _params_assoc_array['plane'] = _glob_target_plane ;
         _params_assoc_array['table'] = 0 ;
         _params_assoc_array['params'] = [] ;
         _params_assoc_array['roundto'] = _glob_accuracy ;
         _params_assoc_array['word'] = "" ;
         _params_assoc_array['rec'] = NO ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "show", "compute", "wplane", "zplane", "rec", "copy", "all",
                                            "draw", "table", "release", "html", "seeds", "generators" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );

				 var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
				 _params_assoc_array['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
				 _params_assoc_array['dump_operator_index'] = _dump_operator_index ;
				 _params_assoc_array['dump_array'] = [];
				
				 // gather all dump params into one array
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
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
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
              else if ( _p.stricmp( "all" ) ) _params_assoc_array['all'] = YES ;
              else if ( _p.stricmp( "draw" ) ) _params_assoc_array['draw'] = YES ;
              else if ( _p.stricmp( "table" ) ) _params_assoc_array['table'] = YES ;
              else if ( _p.is_one_of_i( "show", "compute" ) ) _params_assoc_array['action'] = _p.toLowerCase();
              else if ( _p.is_one_of_i( "wplane", "zplane" ) )
              {
                   if (  _p.stricmp( "zplane" ) ) _params_assoc_array['plane'] = Z_PLANE ;
                   else if (  _p.stricmp( "wplane" ) ) _params_assoc_array['plane'] = W_PLANE ;
              }
              else if ( _p.stricmp( "rec" ) ) _params_assoc_array['rec'] = YES ;
              else if ( _p.length == 1 && _p.isAlpha() ) _symbols_array.push( _p ); // assumed Mobius map symbol
              else if ( circles_lib_colors_is_def( _p ) )
              {
                   if ( _params_assoc_array['drawcolor'].length == 0 ) _params_assoc_array['drawcolor'] = _p ;
                   else if ( _params_assoc_array['fillcolor'].length == 0 ) _params_assoc_array['fillcolor'] = _p ;
              }
              else if ( _p.testME( _glob_simple_string_regex_pattern ) )
              {
                   _params_assoc_array['action'] = "compute" ;
                   _params_assoc_array['word'] = _p ;
              }
              else
              {
                   _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
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
             if ( _symbols_array.length > 0 && _params_assoc_array['action'].length == 0 ) _params_assoc_array['action'] = "compute" ;
             // convert input numbers or symbols into an array of indexes to be applied to next actions
             var _action = _params_assoc_array['action'] ;
             var _round_to = _params_assoc_array['roundto'] ;
             var _items_array = _params_assoc_array["item"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
             var _dest_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
             var _category_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
    		     var _items_n = circles_lib_count_items( _items_array );
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

             _symbols_array = is_array( _symbols_array ) ? _symbols_array.unique().sort() : [] ;
             circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Working on the current group of</lightgray> <white>"+_dest_ref+"</white>", _par_1, _cmd_tag );
             switch( _action )
             {
                case "release":
                circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "show":
                case "compute":
                  _glob_alphabet = circles_lib_alphabet_get();
                  if ( _items_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't "+_action+" the isometric circles: the list of registered items is empty", _par_1, _cmd_tag );
                  else if ( safe_size( _glob_alphabet, 0 ) == 0 )
                  {
                       _b_fail = YES, _error_str = "Current alphabet is empty" ;
                       if ( _params_assoc_array['word'].length > 0 ) _error_str += " : can't compute isometric circle from word '"+_params_assoc_array['word']+"'" ;
                  }
                  else if ( safe_size( _symbols_array, 0 ) == 0 && _params_assoc_array['word'].length == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't "+_action+" the isometric circles: missing input symbols", _par_1, _cmd_tag );
                  else if ( _params_assoc_array['word'].length > 0 )
                  {
                       var _word = _params_assoc_array['word'] ;
                       var _draw = ( _params_assoc_array['draw'] || _params_assoc_array['drawcolor'].length > 0 || _params_assoc_array['fillcolor'].length > 0 ) ? YES : NO ;
                       var G, _mm ;
                       circles_lib_output( _output_channel, DISPATCH_INFO, "Computing the isometric circle for word '"+_word+"' ", _par_1, _cmd_tag );
                       circles_lib_output( _output_channel, DISPATCH_INFO, "Checking '"+_word+"' for coherence with current alphabet ", _par_1, _cmd_tag );
                       for( var _runner = 0 ; _runner < _word.length ; _runner++ )
                       {
                            if ( !_glob_alphabet.includes( _word[_runner] ) )
                            {
                                _b_fail = YES, _error_str = "Letter '"+_word[_runner]+"' is not included in the current alphabet: " + _glob_alphabet.join( ", " );
                            }
                       }
                       
                       if ( !_b_fail ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Coherence test passed with success", _par_1, _cmd_tag );
                       if ( !_b_fail )
                       {
                           var _resolved_word = circles_lib_repetends_resolve( _word );
                           if ( !_word.strcmp( _resolved_word ) )
                           circles_lib_output( _output_channel, DISPATCH_INFO, "Input word"+_glob_crlf+_word+_glob_crlf+"has been resolved to"+_glob_crlf+_resolved_word, _par_1, _cmd_tag );

                           circles_lib_output( _output_channel, DISPATCH_INFO, "Mobius map composition from word '" + _word + "'", _par_1, _cmd_tag );
                           _mm = circles_lib_word_mobiusmap_get( _word, _glob_seeds_array, _output_channel );
                           var _isometric_cc = _mm.isometric_circle(YES);
                           circles_lib_output( _output_channel, DISPATCH_INFO, "Resulting isometric circle " + _glob_crlf + _isometric_cc.output( "", _round_to ), _par_1, _cmd_tag );
                           if ( _draw && _params_assoc_array['plane'] == NO_PLANE )
                           {
                                circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing input plane for drawing: 'zplane' is assumed by default", _par_1, _cmd_tag );
                                _params_assoc_array['plane'] = Z_PLANE ;
                           }

                           if ( _draw )
                           circles_terminal_cmd_isometric_draw( _params_assoc_array['plane'], _word, _isometric_cc,
                                                                 _params_assoc_array['drawcolor'], _params_assoc_array['fillcolor'],
                                                                 2, _output_channel, _par_1, _cmd_tag );

                           if ( _params_assoc_array['rec'] || _params_assoc_array["copy"] )
                           {
                                var _rec_chunk = [];
                                _rec_chunk['class'] = FIGURE_CLASS_CIRCLE ;
                                _rec_chunk['obj'] = new circle( _isometric_cc.center, _isometric_cc.radius );
                                _rec_chunk['plane'] = _plane ;
                                _rec_chunk['draw'] = _draw ;
                                _rec_chunk['drawcolor'] = _params_assoc_array['drawcolor'] ;
                                _rec_chunk['fill'] = _fill ;
                                _rec_chunk['fillcolor'] = _params_assoc_array['fillcolor'] ;
                                _rec_chunk['opacity'] = DEFAULT_MAX_OPACITY ;
                                _rec_chunk['linewidth'] = 1 ;
                                _rec_chunk['symbol'] = "$" + _word ;
                                _rec_chunk['myhash'] = "" ;
                                _rec_chunk['enabled'] = YES ;
                                _rec_chunk['propertiesmask'] = 0 ;

                               circles_lib_figures_add( _rec_chunk );
                               if ( _params_assoc_array["copy"] )
                               {
                                   _glob_storage['figures'].push( _rec_chunk );
                                   var _msg = "<green>Isometric circle '"+_word+"' copied into data storage space</green>" ;
                                   circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                               }

                               var _msg = "<green>Isometric circle '"+_word+"' recorded into figures set</green>" ;
                               if ( _glob_verbose && _glob_terminal_echo_flag ) _msg += _glob_crlf + "<lightgray>Use cmd 'figures' to manage this entry.</lightgray>" ;
                               circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                           }
                       }
                  }
                  else if ( _symbols_array.length > 0 )
                  {
                       var ITEM = null, ITEM_INV = null, _symbol, _inv_symbol, _out_str = "" ;
                       var _isometric_cc = null, _inv_isometric_cc = null ;
                       var _index = UNFOUND, _inverse_index = UNFOUND, _check = "" ;
                       var _cx_str, _cy_str, _rad_str ;
                       var sc_center_pt, sc_radius_pt, sc_radius = 0 ;
                       var _draw = ( _params_assoc_array['draw'] || _params_assoc_array['drawcolor'].length > 0 || _params_assoc_array['fillcolor'].length > 0 ) ? YES : NO ;
                       var _report = [];

                       for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
                       {
                            ITEM = circles_lib_find_item_obj_by_symbol( _items_array, _symbols_array[_i] );
                            ITEM_INV = circles_lib_find_item_obj_by_inverse_symbol( _items_array, circles_lib_word_inverse_get( _symbols_array[_i] ) );
                            _index = circles_lib_find_item_index_by_symbol( _items_array, _symbols_array[_i] );
                            _inverse_index = circles_lib_find_item_index_by_symbol( _items_array, circles_lib_word_inverse_get( _symbols_array[_i] ) );
                            _symbol = ITEM.symbol, _inv_symbol = ITEM.inverse_symbol ;
                            if ( is_item_obj( ITEM ) && _index != UNFOUND && _inverse_index != UNFOUND )
                            {
                                 _isometric_cc = ITEM.map.isometric_circle(YES);
                                 _inv_isometric_cc = ITEM_INV.map.isometric_circle(YES);
                                 if ( !_isometric_cc.is_equal_to( _inv_isometric_cc ) )
                                 _report.push( "<red>" + _symbol + "<--->" + _inv_symbol + "</red>" );

                                 if ( _action.stricmp( "show" ) )
                                 {
                                     _out_str += "<yellow>"+ITEM.symbol+"</yellow>" + ( new String( "" ) ).rpad( " ", 6 - ITEM.symbol.length );
                                     _cx_str = new String( _isometric_cc.center.x.roundTo(_round_to) );
                                     _out_str += "<lavender>"+_cx_str+"</lavender>" + ( new String( "" ) ).rpad( " ", _glob_accuracy + 6 - _cx_str.length );
                                     _cy_str = new String( _isometric_cc.center.y.roundTo(_round_to) );
                                     _out_str += "<lightblue>"+_cy_str +"</lightblue>"+ ( new String( "" ) ).rpad( " ", _glob_accuracy + 6 - _cy_str.length );
                                     _rad_str = new String( _isometric_cc.radius.roundTo(_round_to) );
                                     _out_str += "<skyblue>"+_rad_str +"</skyblue>"+ ( new String( "" ) ).rpad( " ", _glob_accuracy + 6 - _rad_str.length );
                                     _out_str += _glob_crlf ;
                                 }
                                 else if ( _action.stricmp( "compute" ) )
                                 {
                                     if ( is_circle( _isometric_cc ) )
                                     {
                                         _items_array[_index].complex_circle = _isometric_cc.copy();
                                         _check = is_circle( _items_array[_index].complex_circle ) ? YES : NO ;
                                         sc_center_pt = zplane_sm.from_cartesian_to_client( _isometric_cc.center.x, _isometric_cc.center.y );
                                         sc_radius_pt = zplane_sm.from_cartesian_to_client( _isometric_cc.center.x + _isometric_cc.radius, _isometric_cc.center.y );
                                         sc_radius = Math.abs( sc_radius_pt.x - sc_radius_pt.x );
                                         _items_array[_index].screen_circle = new circle( new point( sc_center_pt.x, sc_center_pt.y ), sc_radius );
                                         if ( !_check ) _b_fail = YES, circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Computing the isometric circle for map '"+ITEM.symbol+"'</lightgray> " + ( _check ? "<green>success</green>" : "<red>failed</red>" ), _par_1, _cmd_tag );
                                     }
                                     else
                                     {
                                         _b_fail = YES, _error_str = "Fail to compute the isometric circle for Mobius map with symbol '"+_symbols_array+"'" ;
                                         break ;
                                     }
                                 }

                                 if ( _draw && _params_assoc_array['plane'] == NO_PLANE )
                                 {
                                      circles_lib_output( _output_channel, DISPATCH_WARNING, "No input plane for drawing: 'zplane' is assumed by default", _par_1, _cmd_tag );
                                      _params_assoc_array['plane'] = Z_PLANE ;
                                 }

                                 if ( _draw )
                                 circles_terminal_cmd_isometric_draw( _params_assoc_array['plane'], ITEM.symbol, _isometric_cc,
                                                                      _params_assoc_array['drawcolor'], _params_assoc_array['fillcolor'],
                                                                      2, _output_channel, _par_1, _cmd_tag );

                                 if ( _params_assoc_array['rec'] || _params_assoc_array["copy"] )
                                 {
                                      var _rec_chunk = [];
                                      _rec_chunk['class'] = FIGURE_CLASS_CIRCLE ;
                                      _rec_chunk['obj'] = new circle( _isometric_cc.center, _isometric_cc.radius );
                                      _rec_chunk['plane'] = _plane ;
                                      _rec_chunk['draw'] = _draw ;
                                      _rec_chunk['drawcolor'] = _params_assoc_array['drawcolor'] ;
                                      _rec_chunk['fill'] = _fill ;
                                      _rec_chunk['fillcolor'] = _params_assoc_array['fillcolor'] ;
                                      _rec_chunk['opacity'] = DEFAULT_MAX_OPACITY ;
                                      _rec_chunk['linewidth'] = 1 ;
                                      _rec_chunk['enabled'] = YES ;
                                      _rec_chunk['myhash'] = "" ;
                                      _rec_chunk['symbol'] = "$" + _symbol ;
                                      _rec_chunk['propertiesmask'] = 0 ;

                                      circles_lib_figures_add( _rec_chunk );

                                      if ( _params_assoc_array["copy"] )
                                      {
                                          _glob_storage['figures'].push( _rec_chunk );
                                          var _msg = "<green>Isometric circle '"+_word+"' copied into data storage space</green>" ;
                                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                                      }

                                      var _msg = "<green>Isometric circle '"+ITEM.symbol+"' recorded into figures set</green>" ;
                                      if ( _glob_verbose && _glob_terminal_echo_flag ) _msg += _glob_crlf + "<lightgray>Use cmd 'figures' to manage this entry.</lightgray>" ;
                                      circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                                 }
                            }
                            else
                            {
                                 _b_fail = YES, _error_str = "There exists no Mobius map with symbol '"+_symbols_array+"' in the current archive" ;
                                 break ;
                            }
                       }


                       if ( _out_str.length > 0 && !_b_fail && _action.stricmp( "show" ) )
                       {
                          var _header =  new String( "<snow>Symbol</snow>" ) + ( new String() ).rpad( " ", 6 - new String( "Symbol").length );
                          _header += new String( "<snow>Center x</snow>" ) + ( new String() ).rpad( " ", _glob_accuracy + 6 - new String( "Center x").length );
                          _header += new String( "<snow>Center y</snow>" ) + ( new String() ).rpad( " ", _glob_accuracy + 6 - new String( "Center y").length );
                          _header += new String( "<snow>Radius</snow>" ) + ( new String() ).rpad( " ", _glob_accuracy + 6 - new String( "Radius").length );
                          _out_str = _header + _glob_crlf + _out_str ;
                          if ( _report.length > 0 )
                          {
                             _report = _report.push_first( "<violetred>Failed congruence test between these isometric circles</violetred>" );
                             _out_str += _report.join( _glob_crlf );
                          }
                          else _out_str += "<greenshock>Congruence test has passed with success</greenshock>" ;
                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _out_str, _par_1, _cmd_tag );
                       }
                       else if ( _action.stricmp( "compute" ) )
                       {
                          var _msg = "The isometric circles for " ;
                          _msg += ( _params_assoc_array['all'] ) ? "all maps " : "maps " + _symbols_array.join( ", " ) + " " ;
                          _msg += "have"+( _b_fail ? " not " : " " )+"been computed with success" ;
                          circles_lib_output( _output_channel, _b_fail ? DISPATCH_ERROR : DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                       }
                  }
                  else
                  {
                      _b_fail = YES, _error_str = _ERR_00_00 ;
                  }
                  break ;
                  default: _b_fail = YES, _error_str = "Missing input action" ; break ;
             }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
     }

     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function circles_terminal_cmd_isometric_draw( _plane_type, _word, _isometric_cc, _drawcolor, _fillcolor, _bordersize, _output_channel, _par_1 )
{
     var _draw = ( _drawcolor.length > 0 ) ? YES : NO ;
     var _fill = ( _fillcolor.length > 0 ) ? YES : NO ;
     if ( _plane_type.is_one_of( W_PLANE, Z_PLANE ) && ( _draw || _fill ) )
     {
        circles_lib_output( _output_channel, DISPATCH_INFO, "Plot circle '"+_word+"' on the " + circles_lib_plane_get_def( _plane ), _par_1, _cmd_tag );
        var _mapper = null ;
        var _canvas = circles_lib_canvas_get_exists( _plane_type, "work" ) ? circles_lib_canvas_get_target( _plane_type, "work" ) : ( _plane_type == Z_PLANE ? _glob_zplane_work_canvas_placeholder : _glob_wplane_work_canvas_placeholder );
        if ( _plane == W_PLANE ) _mapper = wplane_sm ;
        else if ( _plane == Z_PLANE ) _mapper = zplane_sm ;
        var _screen_circle = circles_lib_draw_complex_disk( _canvas.getContext( _glob_canvas_ctx_2D_mode ), _mapper,
                                                     _isometric_cc.center.x, _isometric_cc.center.y, _isometric_cc.radius,
                                                     _draw, _drawcolor, _fill, _fillcolor, _bordersize, null, null, null, _word, 0 );
     }
     else circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing color params: the isometric circle '"+_word+"' has not been plot", _par_1, _cmd_tag );
}