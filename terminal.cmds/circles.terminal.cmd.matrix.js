function circles_terminal_cmd_matrix()
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
     var _help = NO ;
     var _params_assoc_array = [];
     var _sd_n = circles_lib_count_seeds();
     var _begin_flag = 0 ;
     var _fn_ret_val = null ;
     var _zero = new complex( 0, 0 ), _unit_real = new complex( 1, 0 ), _unit_imag = new complex( 0, 1 );

     _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
     _params_assoc_array['help'] = NO ;
     _params_assoc_array['keywords'] = NO ;
     _params_assoc_array['all'] = NO ;
     _params_assoc_array['silent'] = NO ;
     _params_assoc_array['action'] = "" ;
     _params_assoc_array['inputs'] = [] ;
     _params_assoc_array['complex'] = [] ;
     _params_assoc_array['symbols'] = [] ;
     _params_assoc_array['maps'] = [] ;
     _params_assoc_array['service'] = [] ;
     _params_assoc_array['roundto'] = _glob_accuracy ;

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "add", "adjoint", "check", "conjugate", "determinant", "sub", "inverse",
                                            "negative", "normalize", "sub", "prod", "pull", "trace", "transpose",
                                            "html", "help"
																					);
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
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
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
              else if ( _p.stricmp( "all" ) ) _params_assoc_array['all'] = YES ;
              else if ( _p.stricmp( "silent" ) ) _params_assoc_array['silent'] = YES ;
              else if ( _params_assoc_array['all'] && _p.stricmp( "dump" ) ) _params_assoc_array['dump'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "adjoint", "check", "conjugate", "inverse", "negative", "normalize", "transpose",
                                        "add", "prod", "sub", "div",
                                        "determinant", "trace", "power", "pull", "release" ) )
                  _params_assoc_array['action'] = _p.toLowerCase();
              else if ( _params_assoc_array['action'].is_one_of_i( "power" ) && _p.testME( _glob_integer_regex_pattern ) )
                  _params_assoc_array['inputs'].push( _p );
              else if ( _params_assoc_array['action'].is_one_of_i( "adjoint", "check", "conjugate", "inverse", "negative", "normalize", "transpose",
                                                                   "add", "prod", "sub", "div",
                                                                   "determinant", "trace", "power", "pull" ) )
              {
                  if( !circles_terminal_cmd_matrix_parse_str( _p, _params_assoc_array, _output_channel, _par_1 ) )
                  {
                      _b_fail = YES, _error_str = "Invalid input param '"+_p+"' for "+_params_assoc_array['action']+" action"  ;
                  }
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
           if ( _params_assoc_array['all'] ) _params_assoc_array['symbols'] = circles_lib_alphabet_get();
           var _round_to = _params_assoc_array['roundto'] ;
           var _action = _params_assoc_array['action'] ;
           var _symbols_n = safe_size( _params_assoc_array['symbols'], 0 );
           var _complex_n = safe_size( _params_assoc_array['complex'], 0 );
           switch( _action )
           {
                case "release":
                circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "adjoint":
                case "conjugate":
                case "inverse":
                case "negative":
                case "normalize":
                case "power":
                case "transpose":
                if ( !is_array( _glob_storage['matrix'] ) ) _glob_storage['matrix'] = [];
                if ( _symbols_n == 0 && _complex_n == 0 )
                {
                    _b_fail = YES, _error_str = "Can't "+_action+": missing complex entries of input letters referring to Mobius maps in the current group" ;
                }
                else if ( _action == "power" && safe_size( _params_assoc_array['inputs'], 0 ) == 0 )
                {
                    _b_fail = YES, _error_str = "Can't "+_action+": missing exponent" ;
                }
                else
                {
                    var _merge_array = [];
                    if ( _symbols_n > 0 ) _merge_array = _merge_array.concat( _params_assoc_array['symbols'] );
                    if ( _complex_n > 0 ) _merge_array = _merge_array.concat( _params_assoc_array['complex'] );

                    var _item_obj,_mm_params, _ret_action_label, _rows, _matrix, _ret_matrix, _dump_symbol ;
                    $.each( _merge_array,
                            function( _i, _input )
                            {
                                if ( is_array( _input ) )
                                {
                                     _mm_params = _input.clone();
                                     _input = _input.work( function( _v ) { return _v.formula(YES,YES,_round_to) ; } );
                                     _dump_symbol = _input.join( "," );
                                }
                                else if ( is_string( _input ) )
                                {
                                    _item_obj = circles_lib_find_item_obj_by_symbol( _glob_seeds_array, _input );
                                    _mm_params = is_item_obj( _item_obj ) ? _item_obj.map.get_params() : null ;
                                    _dump_symbol = ( _params_assoc_array['all'] ) ? _input : _params_assoc_array['dump_array'][_i] ;
                                }

                                if ( _mm_params != null )
                                {
                                    _rows = Math.ceil( safe_size( _mm_params, 0 ) / 2 );
                                    _matrix = new complex_matrix( _rows, _rows ); // square matrix
                                    _matrix.set_params( _mm_params );

                                    if ( !_params_assoc_array['silent'] )
                                    circles_lib_output( _output_channel, DISPATCH_INFO, "Input entry #" + ( _i + 1 ) + _glob_crlf + _matrix.output( "plain", _glob_crlf, [ "a", "b", "c", "d" ] ), _par_1, _cmd_tag );
                                    else
                                    circles_lib_output( _output_channel, DISPATCH_INFO, "Elaborating input entry #" + ( _i + 1 ) + " : " + _dump_symbol, _par_1, _cmd_tag );

                                    switch( _action )
                                    {
                                        case "adjoint":
                                        _ret_action_label = "Adjoint" ;
                                        _ret_matrix = _matrix.get_adjoint_matrix();
                                        break ;
                                        case "conjugate":
                                        _ret_action_label = "Conjugate" ;
                                        _ret_matrix = _matrix.get_conjugate_matrix();
                                        break ;
                                        case "inverse":
                                        _ret_action_label = "Inverse" ;
                                        _ret_matrix = _matrix.inv();
                                        break ;
                                        case "negative":
                                        _ret_action_label = "Negative" ;
                                        _ret_matrix = _matrix.get_negative_matrix();
                                        break ;
                                        case "normalize":
                                        _ret_action_label = "Normalization" ;
                                        _ret_matrix = _matrix.normalize();
                                        break ;
                                        case "power":
                                        _ret_action_label = "Power " + _params_assoc_array['inputs'][0] ;
                                        _ret_matrix = _matrix.pow( _params_assoc_array['inputs'][0] );
                                        break ;
                                        case "transpose":
                                        _ret_action_label = "Transpose" ;
                                        _ret_matrix = _matrix.get_transpose_matrix();
                                        break ;
																        default: break ;
                                    }

                                    circles_lib_output( _output_channel, DISPATCH_WARNING, _ret_action_label+" of entry #" + ( _i + 1 ) + " is " + _glob_crlf + _ret_matrix.output( "plain", _glob_crlf, [ "a", "b", "c", "d" ] ), _par_1, _cmd_tag );

                                    if ( _params_assoc_array['dump'] )
                                    {
                                        if ( _dump_symbol != null )
                                        {
                                             if ( is_string( _dump_symbol ) )
                                             {
                                                  if ( safe_size( _dump_symbol, 0 ) == 1 )
                                                  {
                                                       var _mm_index = circles_lib_find_item_index_by_symbol( _glob_seeds_array, _dump_symbol );
                                                       var _elements_init = _glob_init_mask & INIT_SINGLE_ITEMS ? INIT_SINGLE_ITEMS : INIT_PAIRED_ITEMS ;
                                                       if ( _mm_index != UNFOUND )
                                                       {
                                                            _glob_seeds_array[_mm_index].map.set_params( _ret_matrix.array() );
                                                            _glob_items_to_init = YES, _glob_init_mask = INIT_FROM_MAPS | _elements_init ;
                                                            circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, _glob_terminal_silent, _output_channel );
                                                            var _ret_chunk = circles_lib_items_init( null, NO, NO, _glob_init_mask, NO, NO, _output_channel );
                                                            var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                                                            var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "57Unknown error" ;
                                                            if ( _ret_id == RET_OK )
                                                            {
                                                                $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
                                                                $('[id$=renderBTN]').css('color',COLOR_ERROR) ;
                                                                circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Dumping "+_ret_action_label+" matrix into gen '"+_dump_symbol+"'", _par_1, _cmd_tag );
                                                            }
                                                            else
                                                            {
                                                                _b_fail = YES, _error_str = _ret_msg ;
                                                            }
                                                       }
                                                       else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid dumping symbol '"+_dump_symbol+"': it does not refer to any registered map", _par_1, _cmd_tag );
                                                  }
                                                  else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid dumping symbol '"+_dump_symbol+"': it must be one letter long", _par_1, _cmd_tag );
                                             }
                                             else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid dumping symbol '"+_dump_symbol+"': it must be of string type", _par_1, _cmd_tag );
                                        }
                                    }
                                }
                                else circles_lib_output( _output_channel, DISPATCH_WARNING, "Symbol '"+_input+"' does not refer to any registered map", _par_1, _cmd_tag );
                            }
                          );
                }
                break ;
                case "add":
                case "sub":
                case "div":
                case "prod":
                var _ret_matrix = new complex_matrix( 2, 2 );
                var _tmp_matrix = new complex_matrix( 2, 2 );
                if ( !is_array( _glob_storage['matrix'] ) ) _glob_storage['matrix'] = [];
                if ( _symbols_n == 0 && _complex_n == 0 )
                {
                    _b_fail = YES, _error_str = "Can't "+_action+": missing complex entries of input letters referring to Mobius maps in the current group" ;
                }
                else
                {
                    var _action_str, _unit = new complex( 1, 0 ), _zero = new complex( 0, 0 );
                    switch( _action )
                    {
                        case "add": _action_str = "sum" ; break ;
                        case "sub": _action_str = "difference" ; break ;
                        case "prod": _action_str = "product" ; break ;
                        case "div": _action_str = "division" ; break ;
								        default: break ;
                    }

                    var _merge_array = [];
                    if ( _symbols_n > 0 ) _merge_array = _merge_array.concat( _params_assoc_array['symbols'] );
                    if ( _complex_n > 0 ) _merge_array = _merge_array.concat( _params_assoc_array['complex'] );

                    var _item_obj,_mm_params, _rows, _matrix, _original_str, _tmp ;
                    // starting from neutral element (identity)
                    $.each( _merge_array,
                            function( _i, _input )
                            {
                                  _original_str = _input ;
                                  _tmp = parse_complex_from_string( circles_lib_math_parse_formula( _input ) );
                                  if ( is_complex( _tmp ) )
                                  {
                                       switch( _action )
                                       {
                                           case "add":
                                           _tmp_matrix.set_params( [ _tmp, _zero, _zero, _zero ] )
                                           if ( _i > 0 ) _ret_matrix = _ret_matrix.add( _tmp_matrix );
                                           else _ret_matrix = _tmp_matrix.copy();
                                           break ;
                                           case "sub":
                                           _tmp_matrix.set_params( [ _tmp, _zero, _zero, _zero ] )
                                           if ( _i > 0 ) _ret_matrix = _ret_matrix.sub( _tmp_matrix );
                                           else _ret_matrix = _tmp_matrix.copy();
                                           break ;
                                           case "prod":
                                           if ( _i > 0 ) _ret_matrix = _ret_matrix.mul_scalar( _tmp );
                                           else _ret_matrix = _tmp_matrix.copy();
                                           break ;
                                           case "div":
                                           if ( _i > 0 ) _ret_matrix = _ret_matrix.div_scalar( _tmp );
                                           else _ret_matrix = _tmp_matrix.copy();
                                           break ;
																	         default: break ;
                                       }

                                       if ( _i > 0 )
                                       circles_lib_output( _output_channel, DISPATCH_INFO, "Performing scalar "+_action_str+" by '"+_original_str+"'", _par_1, _cmd_tag );
                                  }
                                  else
                                  {
                                      if ( is_array( _input ) )
                                      {
                                          _mm_params = _input.clone();
                                          _input = _input.work( function( _v ) { return _v.formula(YES,YES,_round_to); } );
                                      }
                                      else
                                      {
                                          _item_obj = circles_lib_find_item_obj_by_symbol( _glob_seeds_array, _input );
                                          _mm_params = is_mobius_map( _item_obj ) ? _item_obj.map.get_params() : null ;
                                      }

                                      if ( _mm_params != null )
                                      {
                                          _rows = Math.ceil( safe_size( _mm_params, 0 ) / 2 );
                                          _matrix = new complex_matrix( _rows, _rows ); // square matrix
                                          _matrix.set_params( _mm_params );
                                          // perform matrix action here
                                          switch( _action )
                                          {
                                              case "add":
                                              if ( _i > 0 ) _ret_matrix = _ret_matrix.add( _matrix );
                                              else _ret_matrix = _matrix.copy();
                                              break ;
                                              case "sub":
                                              if ( _i > 0 ) _ret_matrix = _ret_matrix.sub( _matrix );
                                              else _ret_matrix = _matrix.copy();
                                              break ;
                                              case "prod":
                                              if ( _i > 0 ) _ret_matrix = _ret_matrix.mul( _matrix );
                                              else _ret_matrix = _matrix.copy();
                                              break ;
                                              case "div":
                                              if ( _i > 0 ) _ret_matrix = _ret_matrix.mul( _matrix.inv() );
                                              else _ret_matrix = _matrix.copy();
                                              break ;
																			        default: break ;
                                          }
                                          
                                          if ( _i > 0 )
                                          circles_lib_output( _output_channel, DISPATCH_INFO, "Performing matrix "+_action_str, _par_1, _cmd_tag );
                                      }
                                      else circles_lib_output( _output_channel, DISPATCH_WARNING, "Symbol '"+_input+"' does not refer to any registered map", _par_1, _cmd_tag );
                                  }
                            }
                          );

                    if ( is_complex_matrix( _ret_matrix ) )
                    circles_lib_output( _output_channel, DISPATCH_INFO, "Result from matrix "+_action_str+" is " + _glob_crlf + _ret_matrix.output( "plain", _glob_crlf, [ "a", "b", "c", "d" ] ), _par_1, _cmd_tag );
                    else
                    {
                        _b_fail = YES, _error_str = "Error detected during matrix "+_action_str+": check input maps" ;
                    }

                    if ( _params_assoc_array['dump'] )
                    {
                         var _dump_size = safe_size( _params_assoc_array['dump_array'], 0 );
                         var _dump_symbol = ( _dump_size > 0 ) ? ( _dump_size == 1 ? _params_assoc_array['dump_array'][0] : UNDET ) : null ;
                         if ( _dump_symbol == UNDET )
                         {
                             _dump_symbol = _params_assoc_array['dump_array'][0] ;
                             circles_lib_output( _output_channel, DISPATCH_WARNING, "Only one destination symbol can be input, thus '"+_dump_symbol+"' is assumed", _par_1, _cmd_tag );
                         }

                         if ( _dump_symbol != null )
                         {
                              if ( is_string( _dump_symbol ) )
                              {
                                   if ( safe_size( _dump_symbol, 0 ) == 1 )
                                   {
                                       var _mm_index = circles_lib_find_item_index_by_symbol( _glob_seeds_array, _dump_symbol );
                                       var _elements_init = _glob_init_mask & INIT_SINGLE_ITEMS ? INIT_SINGLE_ITEMS : INIT_PAIRED_ITEMS ;
                                       if ( _mm_index != UNFOUND )
                                       {
                                            _glob_seeds_array[_mm_index].map.set_params( _ret_matrix.array() );
                                            _glob_items_to_init = YES, _glob_init_mask = INIT_FROM_MAPS | _elements_init ;
                                            circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, _glob_terminal_silent, _output_channel );
                                            var _ret_chunk = circles_lib_items_init( null, NO, NO, _glob_init_mask, NO, NO, _output_channel );
                                            var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                                            var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "58Unknown error" ;
                                            if ( _ret_id == RET_OK )
                                            {
                                                $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
                                                $('[id$=renderBTN]').css('color',COLOR_ERROR) ;
                                                circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Dumping matrix "+_action+" into gen '"+_dump_symbol+"'", _par_1, _cmd_tag );
                                            }
                                            else
                                            {
                                                _b_fail = YES, _error_str = _ret_msg ;
                                            }
                                       }
                                       else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid dumping symbol '"+_dump_symbol+"': it does not refer to any registered map", _par_1, _cmd_tag );
                                   }
                                   else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid dumping symbol '"+_dump_symbol+"': it must be one letter long", _par_1, _cmd_tag );
                              }
                              else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid dumping symbol '"+_dump_symbol+"': it must be of string type", _par_1, _cmd_tag );
                         }
                         else circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing destination map tag", _par_1, _cmd_tag );
                    }
                }
                break ;
                case "check":
                if ( !is_array( _glob_storage['matrix'] ) ) _glob_storage['matrix'] = [];
                if ( _symbols_n == 0 && _complex_n == 0 )
                {
                    _b_fail = YES, _error_str = "Can't "+_action+": missing complex entries of input letters referring to Mobius maps in the current group" ;
                }
                else
                {
                    var _merge_array = [];
                    if ( _symbols_n > 0 ) _merge_array = _merge_array.concat( _params_assoc_array['symbols'] );
                    if ( _complex_n > 0 ) _merge_array = _merge_array.concat( _params_assoc_array['complex'] );
                    var _item_obj,_mm_params, _rows, _matrix, _det ;
                    $.each( _merge_array,
                            function( _i, _input )
                            {
                               if ( is_array( _input ) )
                               {
                                  _mm_params = _input.clone();
                                  _input = _input.work( function( _v ) { return _v.formula(YES,YES,_round_to); } );
                               }
                               else
                               {
                                  _item_obj = circles_lib_find_item_obj_by_symbol( _glob_seeds_array, _input );
                                  _mm_params = is_mobius_map( _item_obj ) ? _item_obj.map.get_params() : null ;
                               }

                               if ( _mm_params != null )
                               {
                                  _rows = Math.ceil( safe_size( _mm_params, 0 ) / 2 );
                                  _matrix = new complex_matrix( _rows, _rows ); // square matrix
                                  _matrix.set_params( _mm_params );
                                  circles_terminal_cmd_matrix_check_str( _input, _matrix, _output_channel, _par_1, _cmd_tag );
                               }
                               else circles_lib_output( _output_channel, DISPATCH_WARNING, "Symbol '"+_input+"' does not refer to any registered map", _par_1, _cmd_tag );
                            }
                          );
                }
                break ;
                case "determinant":
                case "trace":
                if ( !is_array( _glob_storage['matrix'] ) ) _glob_storage['matrix'] = [];
                if ( _symbols_n == 0 && _complex_n == 0 )
                {
                    _b_fail = YES, _error_str = "Can't "+_action+": missing complex entries of input letters referring to Mobius maps in the current group" ;
                }
                else
                {
                    var _merge_array = [];
                    if ( _symbols_n > 0 ) _merge_array = _merge_array.concat( _params_assoc_array['symbols'] );
                    if ( _complex_n > 0 ) _merge_array = _merge_array.concat( _params_assoc_array['complex'] );
                    var _item_obj,_mm_params, _ret_mm, _rows, _matrix, _ret_value ;
                    $.each( _merge_array,
                            function( _i, _input )
                            {
                                if ( is_array( _input ) )
                                {
                                    _mm_params = _input.clone();
                                    _input = _input.work( function( _v ) { return _v.formula(YES,YES,_round_to) } );
                                }
                                else
                                {
                                    _item_obj = circles_lib_find_item_obj_by_symbol( _glob_seeds_array, _input );
                                    _mm_params = is_mobius_map( _item_obj ) ? _item_obj.map.get_params() : null ;
                                }

                                if ( _mm_params != null )
                                {
                                    _rows = Math.ceil( safe_size( _mm_params, 0 ) / 2 );
                                    _matrix = new complex_matrix( _rows, _rows ); // square matrix
                                    _matrix.set_params( _mm_params );
                                    switch( _action )
                                    {
                                        case "determinant": _ret_value = _trace = _matrix.det(); break ;
                                        case "trace": _ret_value = _trace = _matrix.trace(); break ;
                                    }
                                    
                                    // perform matrix action here
                                    circles_lib_output( _output_channel, DISPATCH_WARNING, _action + " of map '"+_input+"' is " + _ret_value.formula(YES,YES,_round_to), _par_1, _cmd_tag );
                                }
                                else circles_lib_output( _output_channel, DISPATCH_WARNING, "Symbol '"+_input+"' does not refer to any registered map", _par_1, _cmd_tag );
                            }
                          );
                }
                break ;
                case "pull":
                if ( !is_array( _glob_storage['matrix'] ) ) _glob_storage['matrix'] = [];
                if ( _symbols_n == 0 && _complex_n == 0 )
                {
                    _b_fail = YES, _error_str = "Can't "+_action+": missing complex entries of input letters referring to Mobius maps in the current group" ;
                }
                else
                {
                    var _merge_array = [];
                    if ( _symbols_n > 0 ) _merge_array = _merge_array.concat( _params_assoc_array['symbols'] );
                    if ( _complex_n > 0 ) _merge_array = _merge_array.concat( _params_assoc_array['complex'] );

                    var _item_obj,_mm_params, _rows, _matrix ;
                    $.each( _merge_array,
                            function( _i, _input )
                            {
                               if ( is_array( _input ) )
                               {
                                  _mm_params = _input.clone();
                                  _input = _input.work( function( _v ) { return _v.formula(YES,YES,_round_to) } );
                               }
                               else
                               {
                                  _item_obj = circles_lib_find_item_obj_by_symbol( _glob_seeds_array, _input );
                                  _mm_params = is_mobius_map( _item_obj ) ? _item_obj.map.get_params() : null ;
                               }

                               if ( is_array( _mm_params ) )
                               {
                                  _rows = Math.ceil( safe_size( _mm_params, 0 ) / 2 );
                                  _matrix = new complex_matrix( _rows, _rows ); // square matrix
                                  _matrix.set_params( _mm_params );
                                  _glob_storage['matrix'].push( _matrix.copy() );
                                  circles_lib_output( _output_channel, DISPATCH_INFO, "Map '"+_input+"' stored into the storage space (subset 'matrix')", _par_1, _cmd_tag );
                               }
                            }
                          );
                }
                break ;
                default:
                _b_fail = YES, _error_str = _action.length > 0 ? "Unknown action '"+_action+"'" : "Missing input action specification" ;
                break ;
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

function circles_terminal_cmd_matrix_check_str( _input_str, _input_matrix, _output_channel, _par_1 )
{
     if ( is_complex_matrix( _input_matrix ) )
     {
          circles_lib_output( _output_channel, DISPATCH_INFO, "Checking matrix '"+_input_str+"'", _par_1, _cmd_tag );
          circles_lib_output( _output_channel, DISPATCH_INFO, _input_matrix.output( "plain", _glob_crlf, [ "a", "b", "c", "d" ] ), _par_1, _cmd_tag );
          if ( _input_matrix.is_logical_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is an identity matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_row_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a row matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_column_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a column matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_square_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a square matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_rectangular_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a rectangular matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_symmetric_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a symmetric matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_skewsymmetric_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a skew symmetric matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_hermitian_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a hermitian matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_antihermitian_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a anti-hermitian matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_involutive_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a involutive matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_orthogonal_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a orthogonal matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_normal_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a normal matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_zero_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a zero matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_identity_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a boolean matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_diagonal_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a diagonal matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_antidiagonal_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a anti-diagonal matrix", _par_1, _cmd_tag );
          if ( _input_matrix.is_scalar_matrix() ) circles_lib_output( _output_channel, DISPATCH_INFO, "This is a scalar matrix", _par_1, _cmd_tag );
     }
     else circles_lib_output( _output_channel, DISPATCH_WARNING, "Detected invalid input matrix '"+_input_str+"' to check", _par_1, _cmd_tag );
}

function circles_terminal_cmd_matrix_parse_str( _input_str, _params_assoc_array, _output_channel, _par_1 )
{
    if ( _input_str.testME( _glob_complex_number_regex_pattern ) ||
         is_complex( _tmp = parse_complex_from_string( circles_lib_math_parse_formula( _input_str ) ) ) )
    {
         _params_assoc_array['complex'].push( _input_str );
         circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<yellow>"+_input_str + "</yellow> <greenshock>has been parsed as a complex number</greenshock>", _par_1, _cmd_tag );
         return YES ;
    }
    else if ( safe_size( _input_str, 0 ) == 1 && _input_str.isAlpha() )
    {
        _params_assoc_array['symbols'].push( _input_str );
        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<yellow>"+_input_str + "</yellow> <greenshock>has been parsed as map symbol</greenshock>", _par_1, _cmd_tag );
        return YES ;
    }
    else if ( _input_str.includes( "@" ) && _input_str.count( "@" ) == 1 )
    {
        var _input_chunks = _input_str.split( "@" );
        var _input_index = safe_int( _input_chunks[0], UNDET );
        var _input_storage_ref = ( _input_chunks[1] + "" ).toLowerCase();
        var _mask  = _input_storage_ref.strcmp( "matrix" ) ? 0 : 1 ;
            _mask |= ( _input_index >= 0 ) ? 0 : 2 ;
        if ( _mask == 0 )
        {
             var _data = _glob_storage['matrix'][_input_index] ;
             if ( is_complex_matrix( _data ) )
             {
                  _params_assoc_array['complex'].push( complex_matrix.array() );
                  circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Stored matrix has been parsed with success", _par_1, _cmd_tag );
             }
             else
             {
                  circles_lib_output( _output_channel, DISPATCH_WARNING, "Data storage space ref '"+_input_index+"' is not a valid matrix", _par_1, _cmd_tag );
                  return NO ;             
             }
        }
        else
        {
            if ( _mask & 1 == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Storage space reference does not point to 'matrix' storage", _par_1, _cmd_tag );
            if ( _mask & 2 == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Storage space reference does not include a valid index", _par_1, _cmd_tag );
            return NO ;
        }
    }
    else if ( _input_str.includes( "," ) )
    {
        var _a = _input_str.split( "," );
        if ( is_array( _a ) )
        {
            if ( safe_size( _a, 0 ) == 4 )
            {
               for( var _i = 0 ; _i < 4 ; _i++ )
               {
                    _a[ _i ] = circles_lib_math_parse_formula( _a[ _i ] );
                    if ( _a[ _i ] == null )
                    {
                        circles_lib_output( _output_channel, DISPATCH_WARNING, _a[ _i ] + " can't be parsed as complex number", _par_1, _cmd_tag );
                        return NO ;
                    }
                    _a[ _i ] = parse_complex_from_string( _a[ _i ] + "" );
                    if ( _a[ _i ] == null )
                    {
                        circles_lib_output( _output_channel, DISPATCH_WARNING, _a[ _i ] + " can't be parsed as complex number", _par_1, _cmd_tag );
                        return NO ;
                    }
               }

               _params_assoc_array['complex'].push( _a );
               circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<yellow>"+_input_str + "</yellow> <greenshock>has been parsed as a matrix of complex entries</greenshock>", _par_1, _cmd_tag );
               return YES ;
            }
            else
            {
               circles_lib_output( _output_channel, DISPATCH_WARNING, _input_str + " must include 4 entries separated by comma", _par_1, _cmd_tag );
               return NO ;
            }
        }
        else
        {
            circles_lib_output( _output_channel, DISPATCH_WARNING, _input_str + " must include 4 entries separated by comma", _par_1, _cmd_tag );
            return NO ;
        }
    }
    else
    {
        circles_lib_output( _output_channel, DISPATCH_WARNING, _input_str + " is invalid", _par_1, _cmd_tag );
        return NO ;
    }
}