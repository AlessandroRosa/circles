_glob_terminal_cmd_files_include[ "frm" ] = [] ;

function circles_terminal_cmd_frm()
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
     var _max_var_identifier_length = 12 ;
     var _help = 0 ;
     var _b_fail = 0, _error_str = "" ;
     var _fn_ret_val = null ;
     var _out_text_string = "" ;
     var _var_identifier = "" ;
     var _params_assoc_array = [];
     var _std_var_label = "z" ;
     var _fn_ret_val = null ;
     var _trace_entries = [ "tr(", "tr^", "tr[" ] ;
     var _determinant_entries = [ "det(", "det^", "det[" ] ;
     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['frm'] = [] ;
         _params_assoc_array['action'] = null ;
         _params_assoc_array[''+_std_var_label] = null ;
         _params_assoc_array['dump_array'] = null ;
         _params_assoc_array['dump_operator_index'] = UNDET ;
         _params_assoc_array['settings'] = [] ;
         _params_assoc_array['settings']['accuracy'] = _glob_accuracy ;
         _params_assoc_array['settings']['classification'] = NO ;
         _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
         
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "parse", "release", "html", "seeds", "generators", "classification" );
    		 var _magic_entries = [] ;
				 		 _magic_entries.push( "jorgensenineq" );
				 		 _local_cmds_params_array = _local_cmds_params_array.concat( _magic_entries );
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
         if ( _dump_operator_index != UNFOUND ) _params_assoc_array['settings'].push( "assign" ) ;

         var _p ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
            else if ( _magic_entries.includes_i( _p ) ) _params_assoc_array['settings']['magic'] = _p ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.stricmp( "seeds" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
            else if ( _p.stricmp( "generators" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_GENS ;
            else if ( _p.stricmp( "classification" ) ) _params_assoc_array["classification"] = YES ;
            else if ( _p.start_with_i( _std_var_label + ":" ) )
            _params_assoc_array[''+_std_var_label] = parse_complex_from_string( _p.replaceAll( _std_var_label+":" ) );
            else if ( _p.start_with_i( "approx:" ) ) _params_assoc_array['approx'] = safe_int( _p.replaceAll( "approx", "" ), DEFAULT_MAX_ACCURACY ); 
            else if ( _p.start_with_i( "roundto:" ) )
            {
				_p = safe_int( _p.replaceAll( "roundto:", "" ), 0 ) ;
			    if ( _p <= 0 || _p > DEFAULT_MAX_ACCURACY )
				{
					_p = _glob_accuracy ;
					if ( _p <= 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid value or zero detected for 'accuracy' param: reset to current setting ("+_glob_accuracy+")", _par_1, _cmd_tag );
					else circles_lib_output( _output_channel, DISPATCH_WARNING, "Maximum ("+DEFAULT_MAX_ACCURACY+") exceeded by 'accuracy' param: reset to current setting ("+_glob_accuracy+")", _par_1, _cmd_tag );
				}
				_params_assoc_array['settings']['accuracy'] = _p ;
            }
            else _params_assoc_array['frm'].push( _p.trim() );
         }
         
         if ( safe_string( _params_assoc_array['settings']['magic'], "" ).length > 0 )
				 {
         			var _label = "" ;
         		  switch( safe_string( _params_assoc_array['settings']['magic'], "" ) )
         		  {
						 			case "jorgensenineq":
						 			_label = "Jorgensen's inequality" ;
						 			_params_assoc_array['frm'] = [ "abs(tr^2(A)-4)+abs(tr[A,B]-2)>=1" ] ;
						 			break ;
							}
							
							if ( _params_assoc_array['frm'].length > 0 )
							{
									circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "Detected magic entry '<lightblue>"+_params_assoc_array['settings']['magic']+"</lightblue>' and", _par_1, _cmd_tag );
									var _frm = $.terminal.escape_brackets( _params_assoc_array['frm'][0] ) ;
									circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "turned to <yellow>"+_label+"</yellow> formula" );
									circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<white>"+_frm+"</white>", _par_1, _cmd_tag );
									circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "", _par_1, _cmd_tag );
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
         else
         {
             var _action = safe_string( _params_assoc_array['action'], "" ).trim() ;
             var _settings = _params_assoc_array['settings'] ;
             var _accuracy = _params_assoc_array['settings']['accuracy'] ;
             var _classification = _params_assoc_array["classification"] ;
             switch( _action )
             {
                 case "release":
                 circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                 break ;
                 default:
                 var _n_frm = safe_size( _params_assoc_array['frm'], 0 );
		             var _items_array = _params_assoc_array["item"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
		             var _dest_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
		             var _category_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
                 if ( _n_frm == 0 )
                 {
                    _b_fail = 1 ;
                    _error_str = "Missing input expression" ;
                 }
                 else
                 {
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Parsing input formula ...</lightblue>", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>All symbols will refer to the group of</lightgray> <white>"+_dest_ref+"</white>", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_INFO, "", 0, "frm" );
                    $.each( _params_assoc_array['frm'], function( _i, _tok ){ _params_assoc_array['frm'][_i] = _tok.trim() ; } ) ;
                    var _frm = _params_assoc_array['frm'].join( "" ) ;
                    var _is_var = _frm.testME( _glob_varid_regex_pattern ) ? YES : NO ;
                    var _illegals = _glob_punctuation.clone().remove( [ ".", "-", "^", "," ] ).concat( _glob_illegal_symbols ) ;
                    var _is_formula = YES, _is_illegal = NO, _what_illegals = [] ;
                    $.each( _params_assoc_array['frm'],
                            function( _i, _tok )
                            {
                               $.each( _illegals, function( _i, _punct )
                                       {
                                          if ( _tok.includes( _punct ) )
                                          {
                                             _is_illegal = YES, _what_illegals.push( _punct );
                                          }
                                       }
                                     );
                            }
                          ) ;

                    if ( _is_illegal )
                    {
                        _b_fail = YES, _error_str = "Input symbols '"+_what_illegals.join( ", " )+"' are illegal." ;
                    }
                    else if ( _is_var )
                    {
                    }
                    else if ( _is_formula )
                    {
                        var _frm = _params_assoc_array['frm'].join( "" ) ;
                        if ( _frm.includes_i( _std_var_label ) )
                        {
                            circles_lib_output( _output_channel, DISPATCH_INFO, "Detected polynomial in var '"+_std_var_label+"'", _par_1, _cmd_tag );
                            if ( _params_assoc_array[''+_std_var_label] == null )
                            {
                               _b_fail = YES, _error_str = "Missing input var '"+_std_var_label+"' value." ;
                            }
                            else
                            {
                               var _var_formula = _params_assoc_array[''+_std_var_label].formula(YES,YES,_accuracy);
                               _frm = _frm.replaceAll( _std_var_label, "("+_var_formula+")" );
                               circles_lib_output( _output_channel, DISPATCH_INFO, "Current var '"+_std_var_label+"' is " + _var_formula, _par_1, _cmd_tag );
                               circles_lib_output( _output_channel, DISPATCH_INFO, "Parsing the polynomial " + _frm, _par_1, _cmd_tag );
                            }
                        }
                        
                        var _mask = 0 ;
                        		_mask |= _frm.one_in_i( _trace_entries ) ? 1 : 0 ;
                        		_mask |= _frm.one_in_i( _determinant_entries ) ? 2 : 0 ;
                        if ( _mask & 1 )
                        {
                            var _ret_chunk = circles_terminal_cmd_frm_trace_resolver( _glob_terminal, _items_array, _frm, _accuracy, _output_channel, _classification, _cmd_tag );
                            var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                            var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                            if ( _ret_id == RET_ERROR )
                            {
                                _b_fail = YES, _error_str = _ret_msg ;
                            }
                            else _frm = _ret_msg ;
                        }
                        
												if ( _mask & 2 )
                        {
                        		if ( _classification ) circles_lib_output( _output_channel, DISPATCH_INFO, "'Classification' works for trace operator exclusively and it will be skipped", _par_1, _cmd_tag );
                            var _ret_chunk = circles_terminal_cmd_frm_determinant_resolver( _glob_terminal, _items_array, _frm, _accuracy, _output_channel, _par_1, _cmd_tag );
                            var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                            var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                            if ( _ret_id == RET_ERROR )
                            {
                                _b_fail = YES, _error_str = _ret_msg ;
                            }
                            else _frm = _ret_msg ;
                        }
                        
												if ( _mask == 0 )												
                        {
                        		if ( _classification ) circles_lib_output( _output_channel, DISPATCH_INFO, "'Classification' works for trace operator exclusively and it will be skipped", _par_1, _cmd_tag );
                            // after correction, let's solve the input expression
                            var _new_frm = circles_lib_parse_adjust_formula( _frm );
                            if ( !_new_frm.stricmp( _frm ) )
                            {
                               circles_lib_output( _output_channel, DISPATCH_INFO, "Input expression has been parsed and corrected into: " + _new_frm, _par_1, _cmd_tag );
                               _frm = _new_frm ;
                               circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightgray>Expression parsed into </lightgray> <yellow>"+_frm+"</yellow>", _par_1, _cmd_tag );
                            }
                        }
                        
                        // replace all kinds of parentheses by rounded ones
                        _frm = _frm.replaceAll( [ "[", "{" ], "(" ).replaceAll( [ "]", "}" ], ")" );
                        var _result = null, _complex_obj = null, _is_boolean = NO ;
                        if ( !_b_fail )
                        {
                           try
													 {
															 _result = _glob_parser.eval( _frm );
															 if ( _result != null )
															 {
																	if ( typeof _result === "boolean" ) _is_boolean = YES ;
																	else _complex_obj = _result['im'] != null ? new complex( safe_float( _result['re'], 0 ), safe_float( _result['im'], 0 ) ) : new complex( safe_float( _result, 0 ), 0 ) ;
															 }
													 }
                           catch( _err )
													 {
													 		_b_fail = YES, _error_str = _err ;
													 		circles_lib_error_obj_handler( _err ) ;
													 }
                            
                            _fn_ret_val = _is_boolean ? _result : ( is_complex( _complex_obj ) ? _complex_obj : null ) ;
                            if ( ( is_complex( _complex_obj ) || _is_boolean ) && !_b_fail && _settings.includes_i( "assign" ) )
                            {
                               if ( _params_assoc_array['dump'] && _params_assoc_array['dump_array'] != null )
                               {
                                  _var_identifier = _params_assoc_array['dump_array'][0] ;
                                  _var_identifier = is_string( _var_identifier ) ? _var_identifier.trim() : null;
                                  var _ret_chunk = circles_lib_dump_data_to_format( _complex_obj, _var_identifier, _frm );
   																var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
   																var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
  																if ( _ret_id == 0 )
   																{
   																		_b_fail = YES, _error_str = _ret_msg ;
   																}
   																else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                               }
                               else circles_lib_output( _output_channel, DISPATCH_ERROR, "Missing destination for dumping." + _result, _par_1, _cmd_tag );
                            }
                            else if ( ( !is_complex( _complex_obj ) && !_is_boolean ) || _b_fail ) circles_lib_output( _output_channel, DISPATCH_ERROR, "Fail to resolve input formula", _par_1, _cmd_tag );
                        }

                        var _n_detected = is_array( _extracted_vars_array ) ? safe_size( _extracted_vars_array, 0 ) : 0 ;
                        var _vars_detected = (_n_detected==0?"No":_n_detected)+" custom var" + ( ( _n_detected == 1 ) ? "" : "s" )+" detected" ;
                        if ( _n_detected > 0 ) _vars_detected += " : " + _extracted_vars_array.join( ", " ); 
                        circles_lib_output( _output_channel, DISPATCH_INFO, _vars_detected, _par_1, _cmd_tag );

												if ( is_complex( _complex_obj ) )
                        {
                           _fn_ret_val = _complex_obj = _complex_obj.roundTo( _params_assoc_array['approx'] != null ? _params_assoc_array['approx'] : _glob_accuracy );
                           _result = _complex_obj.formula(YES,YES,_accuracy);
                        }
												else if ( _is_boolean )
                        {
													 _fn_ret_val = _result ;
													 _result = _result ? "true" : "false" ;														
												}

                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Result is</lightblue> <yellow>" + _result + "</yellow>", _par_1, _cmd_tag );

                        if ( _settings.includes_i( "assign" ) && !_b_fail && _var_identifier.length > 0 )
                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Result has been flushed into var " + _var_identifier, _par_1, _cmd_tag );
                    }
                 }
                 break ;
             }
         }
     }
     else { _b_fail = YES, _error_str = "Missing input expression" ; }

     if ( _output_channel == OUTPUT_FUNCTION ) return _b_fail ? null : _fn_ret_val ;
     else if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
}

function circles_terminal_cmd_frm_trace_resolver( _terminal, _items_array, _formula_in, _accuracy, _output_channel, _classification )
{
    _output_channel = safe_int( _output_channel, OUTPUT_TERMINAL );
    _classification = safe_int( _classification, NO );
    _formula_in = safe_string( _formula_in, "" ).trim();
 		var _items_n = circles_lib_count_items();
    if ( _formula_in.length == 0 ) return [ RET_ERROR, "Missing input formula" ] ;
    else if ( _items_n == 0 ) return [ RET_ERROR, "Traces can't be computed: missing registered items" ] ;
    else
    {
        var _formula_out = _formula_in ;
        var _parentheses_get_pattern = /\((.*?)\)/g ;
        var _brackets_get_pattern = /\[(.*?)\]/g ;
        var _mixed_get_pattern = /({|\[|\()(.*?)(}|\]|\))/g ; // get anything between parentheses|brackets|curly braces

        var _alphabet = circles_lib_alphabet_get( _items_array );
        var _ret_chunk = [] ;

        var _traces_word_matches = _formula_in.match( _glob_trace_word_regex_pattern );
        var _traces_commutator_matches = _formula_in.match( _glob_trace_commutator_regex_pattern );

        if ( safe_size( _alphabet, 0 ) == 0 ) return [ RET_ERROR, "Missing alphabet: register Mobius maps first" ] ;
        else if ( safe_size( _traces_word_matches, 0 ) > 0 )
        {
           circles_lib_terminal_multicolor_echo( "Detected <white>simple trace operator</white> in input formula" );
           circles_lib_terminal_info_echo( "Computation in progress" );
           var _word, _exponent ;
           $.each( _traces_word_matches,
                   function( _i, _trace )
                   {
                   		 _word = ( _trace.match( _parentheses_get_pattern ) )[0] ;
                       _exponent = _trace.match( _glob_exponent_regex_pattern );
                       if ( safe_size( _exponent, 0 ) > 1 )
                       {
                          _ret_chunk = [ RET_ERROR, "Syntax error: invalid exponent specification" ] ;
                          return NO ;
                       }
                       else if ( safe_size( _exponent, 0 ) == 1 )
                       {
                          _exponent = safe_float( _exponent[0].replaceAll( "^", "" ), 0 );
                          if ( _exponent == 0 )
                          {
                             _exponent = 1 ;
                             circles_lib_terminal_info_echo( "Detected exponent as zero ... skipped" );
                          }
                       }
                       else _exponent = 1 ;

                       var _resolved_word = circles_lib_repetends_resolve( _word.replaceAll( [ "(", ")" ], "" ) );
                       if ( !_word.strcmp( _resolved_word ) )
                       {
                           circles_lib_terminal_multicolor_echo( "<lightgray>Detected repetend expression in input string</lightgray>" );
                           circles_lib_terminal_multicolor_echo( "<lightgray>and resolved into</lightgray> <yellow>"+_resolved_word+"</yellow> " );
                           _word = _resolved_word ;
										   }
                       var _ret = circles_lib_word_check( _word, _alphabet );
                       if ( _ret == CIRCLES_MISSING_INPUT )
                       {
                          _ret_chunk = [ RET_ERROR, "Missing input word" ] ;
                          return _ret_chunk ;
                       }
                       else if ( _ret == CIRCLES_MISSING_ALPHABET )
                       {
                          _ret_chunk = [ RET_ERROR, "Missing alphabet" ] ;
                          return _ret_chunk ;
                       }
                       else if ( _ret == YES )
                       {
                          var _mm = circles_lib_word_mobiusmap_get( _word, _items_array, _output_channel );
                          if ( !is_mobius_map( _mm ) ) return [ RET_ERROR, "Error while computing '"+_trace+"'" ] ;
                          else
                          {
                             var _tr_complex = _mm.trace().pow(_exponent).formula( YES, YES, _accuracy );
                             _formula_out = _formula_out.replace( _trace, "("+_tr_complex+")" ) ;
                             _trace = $.terminal.escape_brackets( _trace );
                             circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>"+_trace+"</lightblue> evaluates to <yellow>"+_tr_complex+"</yellow>", 0, "frm" );
                             if ( _classification )
                             {
		                             circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>This trace is classified under 'standard test' as</lightblue> <yellow>"+_mm.classification(NO,_accuracy,NO)+"</yellow>", 0, "frm" );
		                             circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>This trace is classified under 'nearly test' as</lightblue> <yellow>"+_mm.classification(NO,_accuracy,YES)+"</yellow>", 0, "frm" );
														 }
                             circles_lib_output( _output_channel, DISPATCH_INFO, "", 0, "frm" );
                          }
                       }
                       else
                       {
                          _ret_chunk = [ RET_ERROR, $.terminal.escape_brackets( "The input trace '"+_trace+"' does not match the current alphabet '"+_alphabet.join(",")+"'" ) ] ;
                          return _ret_chunk ;
                       }
                   }
                 );
        }

        if ( safe_size( _traces_commutator_matches, 0 ) > 0 )
        {
            circles_lib_terminal_multicolor_echo( "Detected <white>commutator trace operator</white> in input formula" );
            circles_lib_terminal_info_echo( "Computation in progress" );
            var _ret_chunk = [], _word, _exponent ;
            $.each( _traces_commutator_matches,
                    function( _i, _trace )
                    {
                       _word = ( _trace.match( _brackets_get_pattern ) )[0] ;
                       _exponent = _trace.match( _glob_exponent_regex_pattern );
                       if ( safe_size( _exponent, 0 ) > 1 )
                       {
                          _ret_chunk = [ RET_ERROR, "Syntax error: invalid exponent specification" ] ;
                          return NO ;
                       }
                       else if ( safe_size( _exponent, 0 ) == 1 )
                       {
                          _exponent = safe_float( _exponent[0].replaceAll( "^", "" ), 0 );
                          if ( _exponent == 0 )
                          {
                             _exponent = 1 ;
                             circles_lib_terminal_info_echo( "Detected exponent as zero ... skipped" );
                          }
                       }
                       else _exponent = 1 ;

                       _word = _word.replaceAll( [ "[", "]" ], "" );
                       if ( _word.includes( "," ) )
                       {
                          var _symbols_array = _word.split( "," );
                          if ( safe_size( _symbols_array, 0 ) > 0 ) _symbols_array = _symbols_array.unique();
                          if ( safe_size( _symbols_array, 0 ) < 2 )
                          {
                              _ret_chunk = [ RET_ERROR, "Syntax error in commutator trace operator: at least 2 symbols are required" ] ;
                              return NO ;
                          }
                          else
                          {
                              var _word_array = _symbols_array.clone();
                              $.each( _symbols_array, function( _i, _sym ) { _word_array.push( circles_lib_word_inverse_get( _sym ) ); } );
                              var _commutator = _word_array.join( "" );
                              circles_lib_terminal_info_echo( "Resolved input '"+_word+"' into commutator '"+_commutator+"'" );

                              var _ret = circles_lib_word_check( _commutator, _alphabet );
                              if ( _ret == CIRCLES_MISSING_INPUT )
                              {
                                  _ret_chunk = [ RET_ERROR, "Missing input commutator" ] ;
                                  return _ret_chunk ;
                              }
                              else if ( _ret == CIRCLES_MISSING_ALPHABET )
                              {
                                  _ret_chunk = [ RET_ERROR, "Missing alphabet" ] ;
                                  return _ret_chunk ;
                              }
                              else if ( _ret == YES )
                              {
                                 var _mm = circles_lib_word_mobiusmap_get( _commutator, _items_array, _output_channel );
                                 if ( !is_mobius_map( _mm ) )
                                 {
                                    _ret_chunk = [ RET_ERROR, "Error while computing '"+_trace+"'" ] ;
                                    return _ret_chunk ;
                                 }
                                 else
                                 {
                                    var _tr_complex = _mm.trace().pow(_exponent).formula(YES,YES,_accuracy);
                                    _formula_out = _formula_out.replaceAll( _trace, "("+_tr_complex+")" );
		                                _trace = $.terminal.escape_brackets( _trace );
					                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>"+_trace+"</lightblue> evaluates to <yellow>"+_tr_complex+"</yellow>", 0, "frm" );
	                                  if ( _classification )
		                                {
				                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>This trace is classified under 'standard test' as</lightblue> <yellow>"+_mm.classification(NO,_accuracy,NO)+"</yellow>", 0, "frm" );
				                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>This trace is classified under 'nearly test' as</lightblue> <yellow>"+_mm.classification(NO,_accuracy,YES)+"</yellow>", 0, "frm" );
																		}
                                    circles_lib_output( _output_channel, DISPATCH_INFO, "", 0, "frm" );
                                 }
                              }
                              else
                              {
                                 _ret_chunk = [ RET_ERROR, $.terminal.escape_brackets( "The input trace '"+_trace+"' does not match the current alphabet '"+_alphabet.join(",")+"'" ) ] ;
                                 return _ret_chunk ;
                              }
                          }
                       }
                       else
                       {
                          _ret_chunk = [ RET_ERROR, "Syntax error in commutator trace operator" ] ;
                          return _ret_chunk ;
                       }
                    }
                  );
        }
        
        return ( _ret_chunk[0] == RET_ERROR ) ? _ret_chunk : [ RET_OK, _formula_out ] ;
    }
}

function circles_terminal_cmd_frm_determinant_resolver( _terminal, _items_array, _formula_in, _accuracy, _output_channel, _par_1 )
{
    _output_channel = safe_int( _output_channel, OUTPUT_TERMINAL );
    _formula_in = safe_string( _formula_in, "" ).trim();
    if ( _formula_in.length == 0 ) return [ RET_ERROR, "" ] ;
    else
    {
        var _formula_out = _formula_in ;
        var _parentheses_get_pattern = /\((.*?)\)/g ;
        var _brackets_get_pattern = /\[(.*?)\]/g ;
        var _mixed_get_pattern = /({|\[|\()(.*?)(}|\]|\))/g ; // get anything between parentheses|brackets|curly braces

        var _alphabet = circles_lib_alphabet_get( _items_array );
        var _ret_chunk = [] ;

        var _determinant_word_matches = _formula_in.match( _determinant_word_pattern );
        var _determinant_commutator_matches = _formula_in.match( _determinant_commutator_pattern );

        if ( safe_size( _alphabet, 0 ) == 0 ) return [ RET_ERROR, "Missing alphabet. Register Mobius map first" ] ;
        
        if ( safe_size( _determinant_word_matches, 0 ) > 0 )
        {
             circles_lib_terminal_info_echo( "Detected determinant operator in input formula" );
             circles_lib_terminal_info_echo( "Computation in progress" );
             var _word, _exponent ;
             $.each( _determinant_word_matches,
                     function( _i, _determinant )
                     {
                          _word = ( _determinant.match( _parentheses_get_pattern ) )[0] ;
                          _exponent = _determinant.match( _glob_exponent_regex_pattern );
                          if ( safe_size( _exponent, 0 ) > 1 )
                          {
                              _ret_chunk = [ RET_ERROR, "Syntax error: invalid exponent specification" ] ;
                              return NO ;
                          }
                          else if ( safe_size( _exponent, 0 ) == 1 )
                          {
                              _exponent = safe_float( _exponent[0].replaceAll( "^", "" ), 0 );
                              if ( _exponent == 0 )
                              {
                                  _exponent = 1 ;
                                  circles_lib_terminal_info_echo( "Detected exponent as zero ... skipped" );
                              }
                          }
                          else _exponent = 1 ;

                              _word = _word.replaceAll( [ "(", ")" ], "" );
                              _word = circles_lib_repetends_resolve( _word );
                          var _ret = circles_lib_word_check( _word, _alphabet );
                          if ( _ret == CIRCLES_MISSING_INPUT )
                          {
                              _ret_chunk = [ RET_ERROR, "Missing input word" ] ;
                              return NO ;
                          }
                          else if ( _ret == CIRCLES_MISSING_ALPHABET )
                          {
                              _ret_chunk = [ RET_ERROR, "Missing alphabet" ] ;
                              return NO ;
                          }
                          else if ( _ret == YES )
                          {
                               var _mm = circles_lib_word_mobiusmap_get( _word, _items_array, _output_channel );
                               if ( !is_mobius_map( _mm ) ) return [ RET_ERROR, "Error while computing '"+_determinant+"'" ] ;
                               else
                               {
                                   var _tr_complex = _mm.det().pow(_exponent).formula(YES,YES,_accuracy ) ;
                                   _formula_out = _formula_out.replaceAll( _determinant, "("+_tr_complex+")" );
	                                 circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>"+_determinant+"</lightblue> evaluates to <yellow>"+_tr_complex+"</yellow>", _par_1, "frm" );
                               }
                          }
                          else
                          {
                               _ret_chunk = [ RET_ERROR, $.terminal.escape_brackets( "The input determinant '"+_determinant+"' does not match the current alphabet '"+_alphabet.join(",")+"'" ) ] ;
                               return NO ;
                          }

                     }
                   );
        }
        
        if ( safe_size( _determinant_commutator_matches, 0 ) > 0 )
        {
            circles_lib_terminal_info_echo( "Detected commutator determinant operator" );
            circles_lib_terminal_info_echo( "Computation in progress" );
            var _ret_chunk = [], _word, _exponent ;
             $.each( _determinant_commutator_matches,
                     function( _i, _determinant )
                     {
                          _word = ( _determinant.match( _brackets_get_pattern ) )[0] ;
                          _exponent = _determinant.match( _glob_exponent_regex_pattern );
                          if ( safe_size( _exponent, 0 ) > 1 )
                          {
                              _ret_chunk = [ RET_ERROR, "Syntax error: invalid exponent specification" ] ;
                              return NO ;
                          }
                          else if ( safe_size( _exponent, 0 ) == 1 )
                          {
                              _exponent = safe_float( _exponent[0].replaceAll( "^", "" ), 0 );
                              if ( _exponent == 0 )
                              {
                                  _exponent = 1 ;
                                  circles_lib_terminal_info_echo( "Detected exponent as zero ... skipped" );
                              }
                          }
                          else _exponent = 1 ;

                              _word = _word.replaceAll( [ "[", "]" ], "" );
                          if ( _word.includes( "," ) )
                          {
                               var _symbols_array = _word.split( "," );
                               if ( safe_size( _symbols_array, 0 ) > 0 ) _symbols_array = _symbols_array.unique();
                               if ( safe_size( _symbols_array, 0 ) < 2 )
                               {
                                  _ret_chunk = [ RET_ERROR, "Syntax error in commutator determinant operator: at least 2 symbols are required" ] ;
                                  return NO ;
                               }
                               else
                               {
                                    var _word_array = _symbols_array.clone();
                                    $.each( _symbols_array, function( _i, _sym ) { _word_array.push( circles_lib_word_inverse_get( _sym ) ); } );
                                    var _commutator = _word_array.join( "" );
                                    circles_lib_terminal_info_echo( "Resolved input '"+_word+"' into commutator '"+_commutator+"'" );

                                    var _ret = circles_lib_word_check( _commutator, _alphabet );
                                    if ( _ret == CIRCLES_MISSING_INPUT )
                                    {
                                        _ret_chunk = [ RET_ERROR, "Missing input commutator" ] ;
                                        return NO ;
                                    }
                                    else if ( _ret == CIRCLES_MISSING_ALPHABET )
                                    {
                                        _ret_chunk = [ RET_ERROR, "Missing alphabet" ] ;
                                        return NO ;
                                    }
                                    else if ( _ret == YES )
                                    {
                                        var _mm = circles_lib_word_mobiusmap_get( _commutator, _items_array, _output_channel );
                                        if ( !is_mobius_map( _mm ) )
                                        {
                                           _ret_chunk = [ RET_ERROR, "Error while computing '"+_determinant+"'" ] ;
                                           return NO ;
                                        }
                                        else
                                        {
                                           var _tr_complex = _mm.det().pow(_exponent).formula(YES,YES,_accuracy);
                                           _formula_out = _formula_out.replaceAll( _determinant, "("+_tr_complex+")" );
				                                   circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>"+_determinant+"</lightblue> evaluates to <yellow>"+_tr_complex+"</yellow>", _par_1, "frm" );
                                           circles_lib_output( _output_channel, DISPATCH_INFO, "", 0, "frm" );
                                        }
                                    }
                                    else
                                    {
                                        _ret_chunk = [ RET_ERROR, $.terminal.escape_brackets( "The input determinant '"+_determinant+"' does not match the current alphabet '"+_alphabet.join(",")+"'" ) ] ;
                                        return NO ;
                                    }
                               }
                          }
                          else
                          {
                              _ret_chunk = [ RET_ERROR, "Syntax error in commutator determinant operator" ] ;
                              return NO ;
                          }
                     }
                   );
        }

        return ( _ret_chunk[0] == RET_ERROR ) ? _ret_chunk : [ RET_OK, _formula_out ] ;
    }
}