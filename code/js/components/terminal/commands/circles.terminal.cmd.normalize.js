function circles_terminal_cmd_normalize()
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

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0, _cnt = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _symbols_array = [] ;
     var _inv_symbols_array = [] ;
     var _rotation_degree = 0, _rotation_radians = 0 ;
     var _sd_n = circles_lib_count_seeds();
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['all'] = 0 ;
         _params_assoc_array['dump'] = NO ;
         _params_assoc_array['dump_array'] = null ;
         _params_assoc_array['dump_operator_index'] = UNDET ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['index'] = null ;
         _params_assoc_array['roundto'] = _glob_accuracy ;
         _params_assoc_array['symbol'] = null ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "show", "compute", "release", "help", "html" );
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
				 
         var _p ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "seeds" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
            else if ( _p.stricmp( "generators" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_GENS ;
            else if ( _p.toLowerCase().start_with( "roundto:" ) )
            {
              _p = safe_int( _p.replaceAll( "roundto:", "" ), 0 ) ;
              if ( _p <= 0 )
              {
                 _p = _glob_accuracy ;
                 circles_lib_output( _out_channel, DISPATCH_WARNING, "Invalid value or zero detected for 'roundto' param: reset to current setting ("+_glob_accuracy+")", _par_1, _cmd_tag );
              }
              else if ( _p > DEFAULT_MAX_ACCURACY )
              {
                 _p = _glob_accuracy ;
                 circles_lib_output( _out_channel, DISPATCH_WARNING, "Maximum ("+DEFAULT_MAX_ACCURACY+") exceeded by 'roundto' param: reset to current setting ("+_glob_accuracy+")", _par_1, _cmd_tag );
              }
                   
              _params_assoc_array['roundto'] = _p ;
            }
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.stricmp( "all" ) ) _params_assoc_array['all'] = YES ;
            else if ( _p.is_one_of_i( "show", "compute", "release" ) ) _params_assoc_array['action'] = _p.toLowerCase();
            else if ( _p.length == 1 && _p.isAlpha() ) _symbols_array.push( _p );
            else
            {
               _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
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
             var _action = safe_string( _params_assoc_array['action'], "" ).trim() ;
             if ( _action.length == 0 ) _action = "compute" ;
             var _round_to = _params_assoc_array['roundto'] ;
             var _items_array = _params_assoc_array["item"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    		     var _items_n = circles_lib_count_items( _items_array );
             var _dest_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
             var _category_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
             // convert input numbers or symbols into an array of indexes to be applied to next actions
             var _selection_indexes_array = [] ;
             var _all = _params_assoc_array['all'] != null ? _params_assoc_array['all'] : NO ;
             if ( _all )
             {
                if ( is_array( _symbols_array ) ) _symbols_array.flush();
                else _symbols_array = [];
                for( var _i = 0 ; _i < _sd_n ; _i++ )
                {
                   ITEM = _items_array[_i] ;
                   if ( is_item_obj( ITEM ) ) _symbols_array.push( ITEM.symbol );
                }
             }

             _symbols_array = ( is_array( _symbols_array ) ) ? _symbols_array.unique().sort() : [] ;

              switch( _action )
              {
                  case "show":
                  var _sel_n = safe_size( _symbols_array, 0 );
                  if ( _sd_n == 0 ) circles_lib_output( _out_channel, DISPATCH_WARNING, "Can't "+_action+": the list of registered items is empty", _par_1, _cmd_tag );
                  else if ( _sel_n == 0 ) circles_lib_output( _out_channel, DISPATCH_WARNING, "Can't "+_action+": missing input symbols", _par_1, _cmd_tag );
                  else
                  {
                       var ITEM = null, _out_str = "", _index = UNFOUND ;
                       var _a_str, _b_str, _c_str, _d_str, _det_str, _check, _check_str ;
                       for( var _i = 0 ; _i < _sel_n ; _i++ )
                       {
                            ITEM = circles_lib_find_item_obj_by_symbol( _items_array, _symbols_array[_i] );
                            _index = circles_lib_find_item_index_by_symbol( _items_array, _symbols_array[_i] );
                            if ( is_item_obj( ITEM ) && _index != UNFOUND )
                            {
                                 _check = ITEM.map.is_normalized();
                                 _out_str += "<yellow>"+ITEM.symbol+"</yellow>" + ( new String( "" ) ).rpad( " ", 6 - ITEM.symbol.length );
                                 _a_str = new String( ITEM.map.get_a().formula(1,1,_round_to) );
                                 _out_str += "<lightblue>"+_a_str+"</lightblue>" + ( new String( "" ) ).rpad( " ", ( _glob_accuracy + 6 ) - _a_str.length );
                                 _b_str = new String( ITEM.map.get_b().formula(1,1,_round_to) );
                                 _out_str += "<lightblue>"+_b_str +"</lightblue>"+ ( new String( "" ) ).rpad( " ", ( _glob_accuracy + 6 ) - _b_str.length );
                                 _c_str = new String( ITEM.map.get_c().formula(1,1,_round_to) );
                                 _out_str += "<lightblue>"+_c_str +"</lightblue>"+ ( new String( "" ) ).rpad( " ", ( _glob_accuracy + 6 ) - _c_str.length );
                                 _d_str = new String( ITEM.map.get_d().formula(1,1,_round_to) );
                                 _out_str += "<lightblue>"+_d_str +"</lightblue>"+ ( new String( "" ) ).rpad( " ", ( _glob_accuracy + 6 ) - _d_str.length );
                                 _det_str = new String( ITEM.map.det().formula(1,1,_round_to) );
                                 _out_str += "<lightblue>"+_det_str +"</lightblue>"+ ( new String( "" ) ).rpad( " ", ( _glob_accuracy + 6 ) - _det_str.length );
                                 _check_str = ( _check ) ? "yes" : "no" ;
                                 _out_str += ( _check ) ? "<green>"+_check_str+"</green>" : "<red>"+_check_str+"</red>"+ ( new String( "" ) ).rpad( " ", 6 );
                                 _out_str += _glob_crlf ;
                            }
                            else
                            {
                                 _b_fail = YES, _error_str = "There exists no Mobius map with symbol '"+_symbols_array[_i]+"' in the current archive" ;
                                 break ;
                            }
                       }

                       if ( _out_str.length > 0 && !_b_fail && _action.stricmp( "show" ) )
                       {
                            var _header =  new String( "<snow>Symbol</snow>" ) + ( new String() ).rpad( " ", 6 - ( new String( "symbol" ) ).length );
                                _header += new String( "<snow>A</snow>" ) + ( new String() ).rpad( " ", ( _glob_accuracy + 6 ) - ( new String( "A" ) ).length );
                                _header += new String( "<snow>B</snow>" ) + ( new String() ).rpad( " ", ( _glob_accuracy + 6 ) - ( new String( "B" ) ).length );
                                _header += new String( "<snow>C</snow>" ) + ( new String() ).rpad( " ", ( _glob_accuracy + 6 ) - ( new String( "C" ) ).length );
                                _header += new String( "<snow>D</snow>" ) + ( new String() ).rpad( " ", ( _glob_accuracy + 6 ) - ( new String( "D" ) ).length );
                                _header += new String( "<snow>Determinant</snow>" ) + ( new String() ).rpad( " ", ( _glob_accuracy + 6 ) - ( new String( "Determinant" ) ).length );
                                _header += new String( "<snow>Normalized</snow>" ) + ( new String() ).rpad( " ", 6 );
                                _header += _glob_crlf ;
                                _out_str = _header + _out_str ;
                            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _out_str, _par_1, _cmd_tag );
                       }
                       else if ( !_b_fail && _action.stricmp( "compute" ) )
                       {
                            var _msg = "Normalization for " ;
                                _msg += ( _params_assoc_array['all'] ) ? "all maps " : "maps " + _symbols_array.join( ", " ) + " " ;
                                _msg += "have been computed with success" ;
                            circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                       }
                  }
                  break ;
                  case "compute":
                  var _sel_n = safe_size( _symbols_array, 0 );
                  if ( _sd_n == 0 ) circles_lib_output( _out_channel, DISPATCH_WARNING, "Can't "+_action+": the list of registered items is empty", _par_1, _cmd_tag );
                  else if ( _sel_n == 0 ) circles_lib_output( _out_channel, DISPATCH_WARNING, "Can't "+_action+": missing input symbols", _par_1, _cmd_tag );
                  else
                  {
                       var _prompt_question = "Confirm to normalize "+( ( _sel_n == 1 && _all == 0 ) ? "this map" : ( ( _all ) ? "all maps" : "these maps" ) )+"? " ;
                       var _normalize_maps = function( _symbols_array )
                       {
                           var ITEM = null, _out_str = "", _index = UNFOUND ;
                           var _a_str, _b_str, _c_str, _d_str, _check ;
                           for( var _i = 0 ; _i < _symbols_array.length ; _i++ )
                           {
                                ITEM = circles_lib_find_item_obj_by_symbol( _items_array, _symbols_array[_i] );
                                _index = circles_lib_find_item_index_by_symbol( _items_array, _symbols_array[_i] );
                                if ( is_item_obj( ITEM ) && _index != UNFOUND )
                                {
                                     ITEM.map.normalize();
                                     if ( _action.stricmp( "compute" ) )
                                     {
                                         _items_array[_i].map.init_from_obj( ITEM.map );
                                         _check = _items_array[_i].map.is_normalized();
                                         circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightgray>Attempting to normalize map '"+ITEM.symbol+"'</lightgray> " + ( _check ? "<green>success</green>" : "<red>failed</red>" ), _par_1, _cmd_tag );
                                     }
                                }
                                else
                                {
                                     _b_fail = YES, _error_str = "There exists no Mobius map with symbol '"+_symbols_array[_i]+"' in the current archive" ;
                                     break ;
                                }
                           }
                       }

						          var _prompt_question = "Are you sure to set up a new config ?" ;
						     		  var _params_array = [] ;
						          var _pre_prompt = "Normalization will definitely change maps coefficients," + _glob_crlf ;
						              _pre_prompt += "which could not be recovered later" ;
								     	  	_params_array['prepromptquestion'] = _pre_prompt ;
						             	_params_array['promptquestion'] = _prompt_question ;
						             	_params_array['yes_fn'] = function() { _normalize_maps( _symbols_array ); }
						             	_params_array['ifquestiondisabled_fn'] = function() { _normalize_maps( _symbols_array ); }
						          circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                  }
                  break ;
                  case "release":
                  circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
                  _b_fail = YES, _error_str = "Missing input action" ;
                  break ;
              }
         }
     }
     else
     {
         _b_fail = YES ;
         _error_str = "Missing input params" ;
     }

     if ( _b_fail && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}