function circles_terminal_cmd_info()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;

     if ( _glob_verbose && _glob_terminal_echo_flag )
     circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _params_assoc_array = [];
     var _fn_ret_val = null ;
     var _accuracy = "" ;

         _params_assoc_array['help'] = NO ;
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['accuracy'] = _glob_accuracy ;
         _params_assoc_array['settings'] = [] ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "show", "reset", "release", "seeds", "generators", "help", "html", "group", "properties", "extras", "normalize" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );

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
				 
         var _p, _max = _dump_operator_index != UNFOUND ? _dump_operator_index : _params_array.length ;
         for( var _i = 0 ; _i < _max ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.stricmp( "seeds" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
              else if ( _p.stricmp( "generators" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_GENS ;
              else if ( _p.is_one_of_i( "all", "extras", "group", "properties" ) )
              {
                  if ( !is_array( _params_assoc_array['settings']['features'] ) ) _params_assoc_array['settings']['features'] = [] ;
                  _params_assoc_array['settings']['features'].push( _p ) ;
              }
              else if ( _p.is_one_of_i( "normalize" ) )
              {
                  if ( !is_array( _params_assoc_array['settings']['management'] ) ) _params_assoc_array['settings']['management'] = [] ;
                  _params_assoc_array['settings']['management'].push( _p ) ;
              }
              else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.testME( _glob_positive_integer_regex_pattern ) ) _params_assoc_array['accuracy'] = Math.max( 0, Math.min( safe_int( _p, _glob_accuracy ), DEFAULT_MAX_ACCURACY ) );
              else if ( _p.testME( _glob_filename_regex_pattern ) ) _params_assoc_array['settings']['filename'] = _p ;
              else
              {
                  _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
              }
         }

         if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
         else if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _out_channel );
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
             var _action = _params_assoc_array['action'] ;
             var _accuracy = _params_assoc_array['accuracy'] ;
             var _querying_gens = _params_assoc_array["item"] == ITEMS_SWITCH_GENS ? YES : NO ;
             var _items_array = _querying_gens ? _glob_gens_array : _glob_seeds_array ;
             var _dest_ref = _querying_gens ? "generators" : "seeds" ;
             var _category_ref = _querying_gens ? "generator" : "seed" ;
             switch( _action )
             {
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                default:
                var _sd_n = circles_lib_count_items( _items_array ) ;
                if ( _params_assoc_array['dump'] )
                {
                    _glob_text = "" ;
                    _out_channel |= OUTPUT_TEXT ;
                }

                if ( _sd_n == 0 ) circles_lib_output( _out_channel, DISPATCH_ERROR, "Can't retrieve info: missing registered group", _par_1, _cmd_tag );
                else
                {
                    var _features = _params_assoc_array['settings']['features'] ;
                    if ( !is_array( _features ) ) _features = [] ;
                    if ( safe_size( _features, 0 ) == 0 ) _features.push( "all" );
                    
                    var _management = _params_assoc_array['settings']['management'] ;
                    if ( !is_array( _management ) ) _management = [] ;
                    if ( is_array( _management ) && safe_size( _management, 0 ) > 0 ) circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightgray>Further data management</lightgray> <yellow>"+_management.join(", ")+"</yellow>", _par_1, _cmd_tag );

                    _row = "<lightblue>Both decimals and tests will be approximated to</lightblue> <white>10e-" + _accuracy + "</white>" ;
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                    
                    var _max_dec_length = 0, _approx_dec_length = 14 ;
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightgray>Retrieving infos on the current group of</lightgray> <white>"+_dest_ref+"</white>", _par_1, _cmd_tag );
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "This group includes <lightblue>" + _sd_n + " generator" + ( _sd_n == 1 ? "" : "s" ), _par_1 ) + "</lightblue>";
                    $.each( _items_array,
                            function( _i, ITEM )
                            {
                                _max_dec_length = Math.max( _max_dec_length, ITEM.map.trace().formula(YES,YES,DEFAULT_MAX_ACCURACY).length );
                                _approx_dec_length = Math.max( _approx_dec_length, ITEM.map.trace().formula(YES,YES,_accuracy).length );
                            }
                          );

                    if ( _features.one_in_i( "all", "group" ) )
                    {
                        var _columns = [ 3, 8, 16, _max_dec_length + 2, 12, 18, _approx_dec_length + 2 ], _row = "", _prog_num = 0 ;
                        var _classification, _nearly_test, _symbol, _tr, _tr_approx, _max_row_length = 0, _normalized, _do_normalization = _management.includes( "normalize" ) ? YES : NO, _kind = "" ;

                        var _header = "" ;
                        _header  = "<snow>" ;
                        _header += ( new String( "#" ) ).rpad( " ", _columns[0] );
                        _header += ( "Symbol" ).rpad( " ", _columns[1] );
                        _header += ( new String( "Category" ) ).rpad( " ", _columns[4] );
                        _header += ( new String( "Classification" ) ).rpad( " ", _columns[2] );
                        _header += ( new String( "Nearly test" ) ).rpad( " ", _columns[5] );
                        _header += ( new String( "Kind" ) ).rpad( " ", _columns[2] );
                        _header += ( new String( "Normalized" ) ).rpad( " ", _columns[4] );
                        _header += ( new String( "Trace (approx)" ) ).rpad( " ", _columns[6] );
                        _header += ( new String( "Trace" ) ).rpad( " ", _columns[3] );
                        _header += "</snow>" ;
                        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _header, _par_1, _cmd_tag );

                        $.each( _items_array,
                                function( _i, ITEM )
                                {
                                   if ( _do_normalization ) ITEM.map.normalize(_accuracy);
                                   _symbol = safe_string( ITEM.symbol, "unknown" );
                                   _classification = ITEM.map.classification(NO,_accuracy,NO);
                                   _nearly_test = ITEM.map.classification(NO,_accuracy,YES);
                                   _kind = ITEM.map.kind(NO,_accuracy);
                                   _tr_approx = ITEM.map.trace().roundTo( _max_dec_length );
                                   _tr = ITEM.map.trace();
                                   _prog_num++ ;

                                   _row  = "<lightblue>"+( new String( _prog_num ) ).trim().rpad( " ", _columns[0] )+"</lightblue>" ;
                                   _row += "<orange>"+_symbol.rpad( " ", _columns[1] )+"</orange>" ;
                                   _row += "<yellow>"+( new String( _category_ref ) ).trim().rpad( " ", _columns[4] )+"</yellow>" ;
                                   _row += "<yellow>"+( new String( _classification ) ).trim().rpad( " ", _columns[2] )+"</yellow>" ;
                                   _row += "<banana>"+( new String( _nearly_test ) ).trim().rpad( " ", _columns[5] )+"</banana>" ;
                                   _row += "<yellow>"+( new String( _kind ) ).rpad( " ", _columns[2] )+"</yellow>" ;
                                   _normalized = ( ITEM.map.is_normalized(_accuracy) ? "yes" : "no" ).rpad( " ", _columns[4] ) ;
                                   _row += ITEM.map.is_normalized(_accuracy) ? "<green>"+_normalized+"</green>" : "<red>"+_normalized+"</red>" ;
                                   _row += "<yellow>"+( new String( _tr_approx.formula(YES,YES,_accuracy) ) ).trim().rpad( " ", _columns[6] )+"</yellow>" ;
                                   _row += "<yellow>"+( new String( _tr.formula(YES,YES,DEFAULT_MAX_ACCURACY) ) ).trim().rpad( " ", _columns[3] )+"</yellow>" ;
                                   _max_row_length = Math.max( _max_row_length, _row.strip_tags().length + 2 );
                                   circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                                }
                              );
                    }

                    var _sep = "-" ;    _sep = _sep.repeat( _max_row_length );
                    if ( _features.one_in_i( "all", "properties" ) )
                    {
                        circles_lib_output( _out_channel, DISPATCH_INFO, "", _par_1, _cmd_tag );
                        _prog_num++ ;
                        var _commutator_word = circles_lib_word_commutator_get( _items_array[0].symbol, _items_array ), _commutator_map = new mobius_map( 1, 0, 0, 1 ) ;
                        for( var _c = 0 ; _c < _commutator_word.length ; _c++ )
                        _commutator_map = _commutator_map.composition( circles_lib_find_item_obj_by_symbol( _items_array, _commutator_word.charAt( _c ) ).map );
                        if ( _do_normalization ) _commutator_map.normalize(_accuracy);
                        _classification = _commutator_map.classification(NO,_accuracy);
                        _nearly_test = _commutator_map.classification(NO,_accuracy,YES);
                        var _commutator_tr_approx = _commutator_map.trace().roundTo( _accuracy );
                        var _commutator_tr = _commutator_map.trace();

                        _row  = "<lightblue>"+( new String( _prog_num ) ).trim().rpad( " ", _columns[0] )+"</lightblue>" ;
                        _row += "<orange>"+_commutator_word.trim().rpad( " ", _columns[1] )+"</orange>" ;
                        _row += "<yellow>"+( new String( "commutator" ) ).rpad( " ", _columns[4] )+"</yellow>" ;
                        _row += "<yellow>"+( new String( _classification ) ).trim().rpad( " ", _columns[2] )+"</yellow>" ;
                        _row += "<banana>"+( new String( _nearly_test ) ).trim().rpad( " ", _columns[5] )+"</banana>" ;
                        _normalized = ( _commutator_map.is_normalized(_accuracy) ? "yes" : "no" ).rpad( " ", _columns[4] ) ;
                        _row += "<yellow>"+( new String( _kind ) ).trim().rpad( " ", _columns[2] )+"</yellow>" ;
                        _row += _commutator_map.is_normalized(_accuracy) ? "<green>"+_normalized+"</green>" : "<red>"+_normalized+"</red>" ;
                        _row += "<yellow>"+( new String( _commutator_tr_approx.formula(YES,YES,_accuracy) ) ).trim().rpad( " ", _columns[6] )+"</yellow>" ;
                        _row += "<yellow>"+( new String( _commutator_tr.formula(YES,YES,DEFAULT_MAX_ACCURACY) ) ).trim().rpad( " ", _columns[3] )+"</yellow>" ;
                        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );

                        if ( _features.includes( "all" ) ) circles_lib_output( _out_channel, DISPATCH_INFO, _sep, _par_1, _cmd_tag );
                        circles_lib_output( _out_channel, DISPATCH_INFO, "Properties", _par_1, _cmd_tag );
                        circles_lib_output( _out_channel, DISPATCH_INFO, "", _par_1, _cmd_tag );

                        if ( is_string( _accuracy ) )
                        {
                            circles_lib_output( _out_channel, DISPATCH_INFO, "Missing decimal accuracy input: reset to default", _par_1, _cmd_tag );
                            _accuracy = DEFAULT_MAX_ACCURACY ;
                        }

var _ret_chunk = circles_lib_terminal_interpreter( "frm jorgensenineq roundto:"+_accuracy, null, OUTPUT_FUNCTION ) ;
if ( is_array( _ret_chunk ) )
{
    if ( _ret_chunk[0] )
    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "Jorgensen's discreteness inequality test : "+( _ret_chunk[1] ? "<green>passed</green>" : "<red>failed</red>" ), _par_1, _cmd_tag );
}

                        var _is_classicalschottkygrp = circles_lib_grp_props_is_classical_schottky( _items_array );
                        _row = "<lightblue>Is classical schottky group ?</lightblue> " + ( _is_classicalschottkygrp ? "<greenshock>Yes</greenshock>" : "<coral>No</coral>" );
                        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );

                        var _is_reduciblegrp = circles_lib_grp_props_is_reducible( _items_array );
                        _row = "<lightblue>Is reducible group ?</lightblue> " + ( _is_reduciblegrp ? "<greenshock>Yes</greenshock>" : "<coral>No</coral>" );
                        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );

                        if ( circles_lib_grp_props_test_upperhalfplane_automorphism( _items_array, _accuracy ) )
                        circles_lib_output( _out_channel, DISPATCH_INFO, "- This group is a circle one, mapping the upper half plane onto itself", _par_1, _cmd_tag );

                        if ( circles_lib_grp_props_test_unitdisk_automorphism( _items_array, _accuracy ) )
                        circles_lib_output( _out_channel, DISPATCH_INFO, "- This group is a circle one, mapping the bounded unit disk onto itself", _par_1, _cmd_tag );
                    }

                    if ( _features.one_in_i( "all", "extras" ) )
                    {
                        if ( _features.includes( "all" ) ) circles_lib_output( _out_channel, DISPATCH_INFO, _sep, _par_1, _cmd_tag );
                        circles_lib_output( _out_channel, DISPATCH_INFO, "Extras", _par_1, _cmd_tag );
                        circles_lib_output( _out_channel, DISPATCH_INFO, "", _par_1, _cmd_tag );

                        var _json_chunk = circles_lib_grp_props_get_commutator_features( _items_array, _accuracy, _out_channel, _par_1, _cmd_tag );
                        var _comm_word = _json_chunk['word'] ;
                        var _comm_map = _json_chunk['map'] ;
												var _small_s = circles_lib_alphabet_get_small_symbols() ;
                    }
                    
                    if ( _params_assoc_array['dump'] )
                    {
                       _params_assoc_array['dump_array'] = is_array( _params_assoc_array['dump_array'] ) ? _params_assoc_array['dump_array'][0] : ( _params_assoc_array['settings']['filename'].length > 0 ? _params_assoc_array['settings']['filename'] : "circles.info.grp.txt" ) ;
											 var _ret_chunk = circles_lib_dump_data_to_format( _glob_text.strip_tags(), _params_assoc_array['dump_array'] );
											 var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
											 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                       circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                    }
                }
                break ;
             }
         }

     if ( _b_fail && _out_channel & OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}