function circles_terminal_cmd_fp()
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
     var _items_n = circles_lib_count_items();
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['all'] = NO ;
         _params_assoc_array['category'] = "" ;
         _params_assoc_array['clean'] = NO ;
         _params_assoc_array['dump'] = NO ;
         _params_assoc_array['dump_array'] = null ;
         _params_assoc_array['dump_operator_index'] = UNDET ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['inputfp'] = [] ;
         _params_assoc_array['index'] = [] ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['plane'] = _glob_target_plane ;
         _params_assoc_array['roundto'] = _glob_accuracy ;
         _params_assoc_array['showtext'] = NO ;
         _params_assoc_array['straight'] = NO ;
         _params_assoc_array['source'] = [] ;
         _params_assoc_array['words'] = [];
         _params_assoc_array['settings'] = [] ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "add", "all", "bomb", "clean", "connect", "commutator", "default", "delete",
                                            "figures", "force", "gensset", "list", "showtext",
                                            "localize", "sink", "neutral", "source", "zplane", "wplane", "release", "html", "help" );
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
              else if ( _p.is_one_of_i( "force" ) )
              {
                   if ( !is_array( _params_assoc_array['settings']['options'] ) ) _params_assoc_array['settings']['options'] = [] ;
                   _params_assoc_array['settings']['options'].push( _p );
              }
              else if ( _p.stricmp( "all" ) ) _params_assoc_array['all'] = YES ;
              else if ( _p.stricmp( "clean" ) ) _params_assoc_array['clean'] = YES ;
              else if ( _p.stricmp( "showtext" ) ) _params_assoc_array['showtext'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
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
              else if ( _p.toLowerCase() == "zplane" ) _params_assoc_array['plane'] = Z_PLANE ;
              else if ( _p.toLowerCase() == "wplane" ) _params_assoc_array['plane'] = W_PLANE ;
              else if ( _p.toLowerCase().is_one_of( "add", "bomb", "connect", "delete", "figures", "list", "localize", "release" ) ) _params_assoc_array['action'] = _p.toLowerCase();
              else if ( _p.toLowerCase().is_one_of( "neutral", "sink", "source" ) ) _params_assoc_array['category'] = _p.toLowerCase();
              else if ( _p.toLowerCase().is_one_of( "commutator", "default", "gensset" ) ) _params_assoc_array['source'].push( _p.toLowerCase() );
              else if ( _p.testME( _glob_positive_integer_regex_pattern ) &&
                        _params_assoc_array['action'].is_one_of( "connect", "delete", "localize" ) )
                        _params_assoc_array['index'].push( _p );
              else if ( _p.testME( _glob_word_regex_pattern ) &&
                        _params_assoc_array['action'].is_one_of( "add" ) )
              {
                 var _n_fp = safe_size( _params_assoc_array['inputfp'], 0 );
                 var _n_words = safe_size( _params_assoc_array['words'], 0 );
                 if ( _n_words < ( _n_fp - 1 ) )
                 for( var _m = _n_words ; _m < ( _n_fp - 1 ); _m++ ) _params_assoc_array['words'].push( "" );
                   
                 _n_words = safe_size( _params_assoc_array['words'], 0 );
                 _params_assoc_array['words'].push( _p );
              }
              else if ( _p.testME( _glob_complex_number_regex_pattern ) ||
                        _p.testME( _glob_pqword_regex_pattern ) ||
                        circles_lib_repetends_check_syntax( null, _p ) ||
                        ( _p.testME( _glob_word_regex_pattern ) && circles_lib_word_check( _p, _glob_alphabet ) ) )
              {
                 if ( _p.testME( _glob_complex_number_regex_pattern ) )
                 {
                    var _n_fp = safe_size( _params_assoc_array['inputfp'], 0 );
                    var _n_words = safe_size( _params_assoc_array['words'], 0 );
    
                    if ( _n_fp < ( _n_words - 1 ) )
                    for( var _m = _n_fp ; _m < ( _n_words - 1 ); _m++ ) _params_assoc_array['inputfp'].push( null );
    
                    _n_fp = safe_size( _params_assoc_array['inputfp'], 0 );
                    _params_assoc_array['inputfp'].push( _p );
                 }
                 else if ( _p.testME( _glob_pqword_regex_pattern ) || circles_lib_repetends_check_syntax( null, _p ) )
                 _params_assoc_array['words'].push( _p );
              }
              else
              {
                 _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1);
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
         else if ( _params_assoc_array['action'].length == 0 )
         {
             _b_fail = YES, _error_str = "Missing action specification" ;
         }
         else if ( _params_assoc_array['action'].length > 0 && !_b_fail )
         {
             var _round_to = _params_assoc_array['roundto'], _options = _params_assoc_array['settings']['options'] ;
             var _action = _params_assoc_array['action'] ;
             if ( _action.length == 0 ) _action == "list" ;
             var _fp_n = circles_lib_count_fixed_points() ;
             var _force = ( !is_array( _options ) || _fp_n == 0 ) ? YES : ( _options.one_in_i( "force" ) ? YES : NO ) ;
             if ( _params_assoc_array['all'] && _fp_n > 0 )
             {
               _params_assoc_array['index'].flush();
               $.each( _glob_input_fixed_pts_array, function( _i, _val ) { _params_assoc_array['index'].push( _i + 1 ); } );
               _params_assoc_array['index'].push( _p );
             }

             switch( _action )
             {
                 case "add":
                 var _n_source = safe_size( _params_assoc_array['source'], 0 );
                 var _n_inputfp = safe_size( _params_assoc_array['inputfp'], 0 );
                 var _n_words = safe_size( _params_assoc_array['words'], 0 );
                 if ( _n_source > 0 )
                 {
                      var _add_sources = function()
                      {
                          $.each( _params_assoc_array['source'],
                                  function( _index, _val )
                                  {
                                      var _ret_chunk ;
                                      if ( _val.strcmp( "commutator" ) ) _ret_chunk = circles_lib_fixedpoints_add_from_commutators( 0, _output_channel );
                                      else if ( _val.strcmp( "default" ) ) _ret_chunk = circles_lib_fixedpoints_add_from_seeds( _output_channel );
                                      else if ( _val.strcmp( "gensset" ) ) _ret_chunk = circles_lib_fixedpoints_add_from_gens_set( _output_channel );
                                      else
                                      {
                                           circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid input source", _par_1, _cmd_tag );
                                           return ;
                                      }
    
                                      var _ret_id = safe_int( _ret_chunk[0], RET_WARNING ), _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                      circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                                  } );
                          _fp_n = circles_lib_count_fixed_points();
                          var _ret_msg = ( _fp_n == 0 ) ? "The input fixed points list is empty" : "The fixed points list includes " + _fp_n + " element" + (_fp_n!=1?"s":"")+" now" ;
                          circles_lib_output( _output_channel, _fp_n > 0 ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                      }
                      
                      if ( _force ) _add_sources();
                      else
                      {
								     		 var _params_array = [] ;
								     	   _params_array['prepromptquestion'] = null ;
					     		 			 _params_array['promptquestion'] = "This operation will overwrite the current fixed points list. Proceed ?" ;
									     	 _params_array['yes_fn'] = function() { _add_sources(); }
									     	 _params_array['ifquestiondisabled_fn'] = function() { _add_sources(); }
                      }
                 }

                 if ( _n_inputfp > 0 && _n_words > 0 )
                 {
                      $.each( _params_assoc_array['inputfp'],
                              function( _index, _complex_pt )
                              {
                                  var _complex_obj = parse_complex_from_string( _complex_pt + "" );
                                  var _word = safe_string( _params_assoc_array['words'][_index], "" );
                                  var _ret_chunk = circles_lib_fixedpoints_add( 1, _word, new point( _complex_obj.real, _complex_obj.imag ), UNDET, _output_channel );
                                  var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
                                  var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                  circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                              } );
                 }
                 else if ( _n_inputfp > 0 && _n_words == 0 )
                 {
                      $.each( _params_assoc_array['inputfp'],
                              function( _index, _complex_pt )
                              {
                                  var _complex_obj = parse_complex_from_string( _complex_pt + "" );
                                  var _word = safe_string( _params_assoc_array['words'][_index], "" );
                                  var _ret_chunk = circles_lib_fixedpoints_add( 1, "", new point( _complex_obj.real, _complex_obj.imag ), UNDET, _output_channel );
                                  var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
                                  var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                  circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                              } );
                 }
                 else if ( _n_inputfp == 0 && _n_words > 0 )
                 {
                      $.each( _params_assoc_array['words'],
                              function( _index, _word )
                              {
                                  var _ret_chunk = circles_lib_fixedpoints_add( 1, _word, null, UNDET, _output_channel );
                                  var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
                                  var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                  circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                              } );
                 }
                 break ;
                 case "bomb":
                 var _ret_chunk = null ;
                 if ( _fp_n == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "The fixed points list is already empty", _par_1, _cmd_tag );
                 else if ( _force ) _ret_chunk = circles_lib_fixedpoints_bomb( _output_channel );
                 else
                 {
						     		  var _params_array = [] ;
												  _params_array['prepromptquestion'] = null ;
								     		 	_params_array['promptquestion'] = "This operation will erase the current fixed points list. Proceed ?" ;
												  _params_array['yes_fn'] = function()
																										{
													                             _ret_chunk = circles_lib_fixedpoints_bomb( _output_channel );
													                             if ( is_array( _ret_chunk ) )
													                             {
													                                var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
													                                var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
													                                circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
													                             }
																										}
												  _params_array['ifquestiondisabled_fn'] = function() { _ret_chunk = circles_lib_fixedpoints_bomb( _output_channel ); }
                 }
                 
                 break ;
                 case "connect":
                 if ( _fp_n == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "The input fixed points list is empty", _par_1, _cmd_tag );
                 else if ( _params_assoc_array['plane'] == NO_PLANE ) circles_lib_output( _output_channel, DISPATCH_INFO, "Missing input plane for fixed points to connect", _par_1, _cmd_tag );
                 else
                 {
                      var _ret_chunk = circles_lib_fixedpoints_connect( _params_assoc_array['plane'], _params_assoc_array['clean'], _params_assoc_array['showtext'], _output_channel );
                      if ( is_array( _ret_chunk ) )
                      {
                          var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
                          var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                          circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                      }
                      else circles_lib_output( _output_channel, DISPATCH_WARNING, "Unknown response", _par_1, _cmd_tag );
                 }
                 break ;
                 case "delete":
                 var _n_index = safe_size( _params_assoc_array['index'], 0 );
                 if ( _n_index == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "Missing input index for fixed points to delete", _par_1, _cmd_tag );
                 else
                 {
                     var _delete_fp = function()
                     {
                         var _hashes = [], _ret_chunk, _zero_based, _ret_id, _ret_msg ;
                         // loading hashes related to elements to be deleted                       
                         $.each( _params_assoc_array['index'],
                                 function( _i, _fp_index )
                                 {
                                     _zero_based = _fp_index - 1, _ret_chunk = _glob_input_fixed_pts_array[_zero_based] ;
                                     if ( _ret_chunk != null ) _hashes.push( _ret_chunk[3] );
                                     else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid input index #"+(_fp_index), _par_1, _cmd_tag );
                                 } );

                         if ( safe_size( _hashes, 0 ) > 0 )
                         {
                              $.each( _hashes,
                                      function( _i, _hash )
                                      {
                                          _ret_chunk = circles_lib_fixedpoints_find( _hash, _output_channel );
                                          _zero_based = _ret_chunk[1] ;
                                          _ret_chunk = circles_lib_fixedpoints_delete( _zero_based, _output_channel );
                                          _ret_id = safe_int( _ret_chunk[0], RET_WARNING ), _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                          circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                                      } );
                         }
                         else circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing valid input indexes for fixed points deletion", _par_1, _cmd_tag );

                         _fp_n = circles_lib_count_fixed_points();
                         var _ret_msg = ( _fp_n == 0 ) ? "The input fixed points list is empty now" : "The fixed points list includes " + _fp_n + " element" + (_fp_n!=1?"s":"")+" now" ;
                         circles_lib_output( _output_channel, DISPATCH_INFO, _ret_msg, _par_1, _cmd_tag );
                     }

						     		 var _params_array = [] ;
								     	   _params_array['prepromptquestion'] = null ;
					     		 			 _params_array['promptquestion'] = "This operation will erase "+_n_index+" element"+(_n_index!=1?"s":"")+" from fixed points list. Proceed ?" ;
									     	 _params_array['yes_fn'] = function() { _delete_fp(); }
									     	 _params_array['ifquestiondisabled_fn'] = function() { _delete_fp(); }
                 }
                 break ;
                 case "figures":
                 var _n_index = safe_size( _params_assoc_array['index'], 0 );
                 if ( _n_index == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "Missing input index for fixed points to turn into figures", _par_1, _cmd_tag );
                 else if ( _params_assoc_array['plane'] == NO_PLANE ) circles_lib_output( _output_channel, DISPATCH_INFO, "Missing input plane for fixed points to turn into figures", _par_1, _cmd_tag );
                 else
                 {
                      var _hashes = [], _ret_chunk, _zero_based, _ret_id, _ret_msg ;
                      // loading hashes related to elements to be deleted
                      $.each( _params_assoc_array['index'],
                              function( _i, _fp_index )
                              {
                                  _zero_based = _fp_index - 1, _ret_chunk = _glob_input_fixed_pts_array[_zero_based] ;
                                  if ( _ret_chunk != null ) _hashes.push( _ret_chunk[3] );
                                  else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid input index #"+(_fp_index), _par_1, _cmd_tag );
                              } );

                      if ( safe_size( _hashes, 0 ) > 0 )
                      {
                           $.each( _hashes,
                                   function( _i, _hash )
                                   {
                                      _ret_chunk = circles_lib_fixedpoints_find( _hash, _output_channel );
                                      _zero_based = _ret_chunk[1] ;
                                      _ret_chunk = circles_lib_fixedpoints_create_figures_from( _i, _params_assoc_array['plane'], _output_channel );
                                      _ret_id = safe_int( _ret_chunk[0], RET_WARNING ), _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                      circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                                   } );
                      }
                      else circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing valid input indexes for fixed points localization", _par_1, _cmd_tag );
                 }
                 break ;
                 case "list":
                 var _n_source = safe_size( _params_assoc_array['source'], 0 );
                 if ( _fp_n == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "The input fixed points list is empty", _par_1, _cmd_tag );
                 else
                 {
                      if ( _params_assoc_array['dump'] ) _glob_text = "" ;
                      // pre-scan for columns width optimization
                      var _cols = [ 8, 0, 0 ] ;
                      $.each( _glob_input_fixed_pts_array,
                              function( _index, _chunk )
                              {
                                  _cols[0] = Math.max( _chunk[0].length + 2, _cols[0] );
                                  _cols[1] = Math.max( ( _chunk[1].x + "" ).length + 2, ( _chunk[1].y + "" ).length + 2, _cols[1] );
                                  _cols[2] = Math.max( _chunk[2].length + 2, _cols[2] );
                              }
                            );

                      var _entity = ( new String( "Entity" ) ).rpad( " ", _cols[0] );
                      var _pt_x = "X", _pt_y = "Y" ;
                      var _type = "Type" ;
                      var _row = _entity + new String( _pt_x ).rpad( " ", _cols[1] ) + new String( _pt_y ).rpad( " ", _cols[1] ) + _type ;
                      if ( _params_assoc_array['dump'] ) _glob_text = _row ;
                      if ( _output_channel == OUTPUT_TERMINAL )
                      {
                          var _found_str = "Found " + _fp_n + " entr" + ( _fp_n == 1 ? "y" : "ies" );
                          if ( _params_assoc_array['dump'] ) _glob_text += _glob_crlf + _found_str ;

                          circles_lib_output( _output_channel, DISPATCH_INFO, _found_str, _par_1, _cmd_tag );
                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<yellow>" + _row + "</yellow>", _par_1, _cmd_tag );
                      }
                      
                      var _palette = [ "lightblue", "snow" ], _entity, _pt, _type, _open_tag, _close_tag ;

                      $.each( _glob_input_fixed_pts_array,
                              function( _index, _chunk )
                              {
                                  _entity = _chunk[0].rpad( " ", _cols[0] );
                                  _pt = _chunk[1] ;
                                  _type = circles_lib_fixedpoints_get_def( _chunk[2] ).rpad( " ", _cols[2] );
                                  _row = _entity + new String( _pt.x.roundTo(_round_to) ).rpad( " ", _cols[1] ) + new String( _pt.y.roundTo(_round_to) ).rpad( " ", _cols[1] ) + _type ;
                                  _open_tag = "<"+_palette[ _index % _palette.length ]+">" ;
                                  _close_tag = "</"+_palette[ _index % _palette.length ]+">" ;
                                  if ( _output_channel == OUTPUT_TERMINAL )
                                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _open_tag + _row + _close_tag, _par_1, _cmd_tag );

                                  if ( _params_assoc_array['dump'] ) _glob_text += _glob_crlf + _row ;
                              }
                            );

                      if ( _params_assoc_array['dump'] )
                      {
            						  _params_assoc_array['dump_array'] = _params_assoc_array['dump_array'] != null ? _params_assoc_array['dump_array'][0] : "circles.benchmark.txt" ;
            						  var _ret_chunk = circles_lib_dump_data_to_format( _glob_text.strip_tags(), _params_assoc_array['dump_array'] );
            						  var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
            							var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
            							if ( _ret_id == 0 )
            							{
            									_b_fail = YES, _error_str = _ret_msg ;
            							}
            							else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                      }
                 }
                 break ;
                 case "localize":
                 var _n_index = safe_size( _params_assoc_array['index'], 0 );
                 if ( _n_index == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "Missing input index for fixed points to localize", _par_1, _cmd_tag );
                 else if ( _params_assoc_array['plane'] == NO_PLANE ) circles_lib_output( _output_channel, DISPATCH_INFO, "Missing input plane for fixed points to localize", _par_1, _cmd_tag );
                 else
                 {
                      var _hashes = [], _ret_chunk, _zero_based, _ret_id, _ret_msg ;
                      // loading hashes related to elements to be deleted                       
                      $.each( _params_assoc_array['index'],
                              function( _i, _fp_index )
                              {
                                  _zero_based = _fp_index - 1, _ret_chunk = _glob_input_fixed_pts_array[_zero_based] ;
                                  if ( _ret_chunk != null ) _hashes.push( _ret_chunk[3] );
                                  else circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid input index #"+(_fp_index), _par_1, _cmd_tag );
                              } );

                      if ( safe_size( _hashes, 0 ) > 0 )
                      {
                           $.each( _hashes,
                                   function( _i, _hash )
                                   {
                                      _ret_chunk = circles_lib_fixedpoints_find( _hash, _output_channel );
                                      _zero_based = _ret_chunk[1] ;
                                      _ret_chunk = circles_lib_fixedpoints_locate( _i, _params_assoc_array['plane'], _params_assoc_array['clean'], _params_assoc_array['showtext'], _output_channel );
                                      _ret_id = safe_int( _ret_chunk[0], RET_WARNING ), _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                      circles_lib_output( _output_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                                   } );
                      }
                      else circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing valid input indexes for fixed points localization", _par_1, _cmd_tag );
                 }
                 break ;
                 case "release":
                 circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                 break ;
				         default: break ;
             }
             
             if ( _glob_fixedpt_io != FIXEDPOINTS_IO_INPUT )
             circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning! Fixed point option is not flagged to 'input' category", _par_1, _cmd_tag );
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