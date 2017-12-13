function circles_terminal_cmd_fp()
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

	var _last_release_date = get_file_modify_date( _glob_paths['terminal_abs_cmds'], "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0, _cnt = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _symbols_array = [] ;
    var _inv_symbols_array = [] ;
    var _items_n = circles_lib_count_items();
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    else if ( _params.length > 0 )
    {
        _cmd_params['action'] = "" ;
        _cmd_params['all'] = NO ;
        _cmd_params['category'] = "" ;
        _cmd_params['clean'] = NO ;
        _cmd_params['dump'] = NO ;
        _cmd_params['dump_array'] = null ;
        _cmd_params['dump_operator_index'] = UNDET ;
        _cmd_params['help'] = NO ;
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['inputfp'] = [] ;
        _cmd_params['index'] = [] ;
        _cmd_params['keywords'] = NO ;
        _cmd_params['plane'] = _glob_target_plane ;
        _cmd_params['roundto'] = _glob_accuracy ;
        _cmd_params['showtext'] = NO ;
        _cmd_params['straight'] = NO ;
        _cmd_params['source'] = [] ;
        _cmd_params['words'] = [];

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
  		var _local_cmds_params_array = [];
    	_local_cmds_params_array.push( "add", "all", "bomb", "clean", "connect", "commutator", "default", "delete",
                                       "figures", "force", "gensset", "list", "showtext",
                                       "localize", "sink", "neutral", "source", "zplane", "wplane", "release", "html", "help" );
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );

		var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
		_cmd_params['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
		_cmd_params['dump_operator_index'] = _dump_operator_index ;
		_cmd_params['dump_array'] = [];
				
		// gather all dump params into one array
        if ( _cmd_params['dump'] )
        {
    		for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
			if ( _params_array[_i].trim().length > 0 ) _cmd_params['dump_array'].push( _params_array[_i] );
        }
				 
        var _p ;
        // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
        var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
        for( var _i = 0 ; _i < _up_to_index ; _i++ )
        {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "force" ) )
            {
                if ( !is_array( _cmd_params['options'] ) ) _cmd_params['options'] = [] ;
                _cmd_params['options'].push( _p );
            }
            else if ( _p.is_one_of_i( "all", "clean", "html", "reset", "showtext" ) ) _cmd_params[_p] = YES ;
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
                   
                _cmd_params['roundto'] = _p ;
            }
            else if ( _p.toLowerCase() == "zplane" ) _cmd_params['plane'] = Z_PLANE ;
            else if ( _p.toLowerCase() == "wplane" ) _cmd_params['plane'] = W_PLANE ;
            else if ( _p.is_one_of_i( "add", "bomb", "connect", "delete", "figures", "list", "localize", "release" ) ) _cmd_params['action'] = _p.toLowerCase();
            else if ( _p.is_one_of_i( "neutral", "sink", "source" ) ) _cmd_params['category'] = _p.toLowerCase();
            else if ( _p.is_one_of_i( "commutator", "default", "gensset" ) ) _cmd_params['source'].push( _p.toLowerCase() );
            else if ( _p.testME( _glob_positive_integer_regex_pattern ) &&
                      _cmd_params['action'].is_one_of( "connect", "delete", "localize" ) )
                      _cmd_params['index'].push( _p );
            else if ( _p.testME( _glob_word_regex_pattern ) && _cmd_params['action'].is_one_of( "add" ) )
            {
                var _n_fp = safe_size( _cmd_params['inputfp'], 0 ), _n_words = safe_size( _cmd_params['words'], 0 );
                if ( _n_words < ( _n_fp - 1 ) )
                for( var _m = _n_words ; _m < ( _n_fp - 1 ); _m++ ) _cmd_params['words'].push( "" );
                   
                _n_words = safe_size( _cmd_params['words'], 0 );
                _cmd_params['words'].push( _p );
            }
            else if ( _p.testME( _glob_complex_number_regex_pattern ) || _p.testME( _glob_pqword_regex_pattern ) ||
                      circles_lib_repetends_check_syntax( null, _p ) ||
                      ( _p.testME( _glob_word_regex_pattern ) && circles_lib_word_check( _p, _glob_alphabet ) ) )
            {
                if ( _p.testME( _glob_complex_number_regex_pattern ) )
                {
                    var _n_fp = safe_size( _cmd_params['inputfp'], 0 ), _n_words = safe_size( _cmd_params['words'], 0 );
                    if ( _n_fp < ( _n_words - 1 ) ) for( var _m = _n_fp ; _m < ( _n_words - 1 ); _m++ ) _cmd_params['inputfp'].push( null );
                    _n_fp = safe_size( _cmd_params['inputfp'], 0 );
                    _cmd_params['inputfp'].push( _p );
                }
                 else if ( _p.testME( _glob_pqword_regex_pattern ) || circles_lib_repetends_check_syntax( null, _p ) )
                 _cmd_params['words'].push( _p );
            }
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
        }

         if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
         else if ( _cmd_params['keywords'] )
         {
             var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
             if ( _msg.length == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
             else
             {
                 _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                 circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
             }
         }
         else if ( _cmd_params['action'].length == 0 ) { _b_fail = YES, _error_str = "Missing action specification" ; }
         else if ( _cmd_params['action'].length > 0 && !_b_fail )
         {
            var _round_to = _cmd_params['roundto'], _options = _cmd_params['options'] ;
            var _action = _cmd_params['action'] ;
            if ( _action.length == 0 ) _action == "list" ;
            var _fp_n = circles_lib_count_fixed_points() ;
            var _force = ( !is_array( _options ) || _fp_n == 0 ) ? YES : ( _options.one_in_i( "force" ) ? YES : NO ) ;
            if ( _cmd_params['all'] && _fp_n > 0 )
            {
               _cmd_params['index'].flush();
               $.each( _glob_input_fixed_pts_array, function( _i, _val ) { _cmd_params['index'].push( _i + 1 ); } );
               _cmd_params['index'].push( _p );
            }

            switch( _action )
            {
                case "add":
                var _n_source = safe_size( _cmd_params['source'], 0 );
                var _n_inputfp = safe_size( _cmd_params['inputfp'], 0 );
                var _n_words = safe_size( _cmd_params['words'], 0 );
				if ( _cmd_params['reset'] )
                circles_lib_output( _out_channel, DISPATCH_INFO, "Fixed points list will be deleted before add new elements", _par_1, _cmd_tag );
			
                if ( _n_source > 0 )
                {
                    var _add_sources = function()
                    {
                        $.each( _cmd_params['source'], function( _index, _val ) {
                                var _ret_chunk ;
                                if ( _val.strcmp( "commutator" ) ) _ret_chunk = circles_lib_fixedpoints_add_from_commutators( 0, _out_channel, _cmd_params['reset'] );
                                else if ( _val.strcmp( "default" ) ) _ret_chunk = circles_lib_fixedpoints_add_from_seeds( _out_channel, _cmd_params['reset'] );
                                else if ( _val.strcmp( "gensset" ) ) _ret_chunk = circles_lib_fixedpoints_add_from_gens_set( _out_channel, _cmd_params['reset'] );
                                else
                                {
                                    circles_lib_output( _out_channel, DISPATCH_WARNING, "Invalid input source", _par_1, _cmd_tag );
                                    return ;
                                }
    
                                var _ret_id = safe_int( _ret_chunk[0], RET_WARNING ), _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                        } );
                        _fp_n = circles_lib_count_fixed_points();
                        var _ret_msg = ( _fp_n == 0 ) ? "The input fixed points list is empty" : "The fixed points list includes " + _fp_n + " element" + (_fp_n!=1?"s":"")+" now" ;
                        circles_lib_output( _out_channel, _fp_n > 0 ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
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
					$.each( _cmd_params['inputfp'], function( _index, _complex_pt ) {
                            var _complex_obj = parse_complex_from_string( _complex_pt + "" );
                            var _word = safe_string( _cmd_params['words'][_index], "" );
                            var _ret_chunk = circles_lib_fixedpoints_add( 1, _word, new point( _complex_obj.real, _complex_obj.imag ), UNDET, _out_channel );
                            var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
                            var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                            circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                    } );
                }
                else if ( _n_inputfp > 0 && _n_words == 0 )
                {
                    $.each( _cmd_params['inputfp'], function( _index, _complex_pt ) {
                            var _complex_obj = parse_complex_from_string( _complex_pt + "" );
                            var _word = safe_string( _cmd_params['words'][_index], "" );
                            var _ret_chunk = circles_lib_fixedpoints_add( 1, "", new point( _complex_obj.real, _complex_obj.imag ), UNDET, _out_channel );
                            var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
                            var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                            circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                    } );
                }
                else if ( _n_inputfp == 0 && _n_words > 0 )
                {
					$.each( _cmd_params['words'], function( _index, _word ) {
                            var _ret_chunk = circles_lib_fixedpoints_add( 1, _word, null, UNDET, _out_channel );
                            var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
                            var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                            circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                    } );
                }
				else if ( _n_source == 0 ) { _b_fail = YES, _error_str = "Can't add fixed points: missing input entries" ;  }
                break ;
				case "bomb":
				if ( _fp_n == 0 )  circles_lib_output( _out_channel, DISPATCH_WARNING, "Can't perform "+_action+" action: the fixed points list is empty ", _par_1, _cmd_tag );
				else
				{
                   	var _params_array = [], _pre_prompt = null ;
					_params_array['prepromptquestion'] = null ;
                   	_params_array['promptquestion'] = _prompt_question = "Confirm to delete all fixed points ("+_fp_n+") ? " ;
                   	_params_array['yes_fn'] = function() { _ret_chunk = circles_lib_fixedpoints_bomb( _out_channel );
					    var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
					    var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
						circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
					}
                   	_params_array['ifquestiondisabled_fn'] = function() { _ret_chunk = circles_lib_fixedpoints_bomb( _out_channel ); }
					if ( !_glob_terminal_echo_flag || _cmd_params["silent"] ) _params_array['yes_fn'].call(this);
                   	else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
				}
				break ;
                 case "connect":
                 if ( _fp_n == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "The input fixed points list is empty", _par_1, _cmd_tag );
                 else if ( _cmd_params['plane'] == NO_PLANE ) circles_lib_output( _out_channel, DISPATCH_INFO, "Missing input plane for fixed points to connect", _par_1, _cmd_tag );
                 else
                 {
                      var _ret_chunk = circles_lib_fixedpoints_connect( _cmd_params['plane'], _cmd_params['clean'], _cmd_params['showtext'], _out_channel );
                      if ( is_array( _ret_chunk ) )
                      {
                          var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
                          var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                          circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                      }
                      else circles_lib_output( _out_channel, DISPATCH_WARNING, "Unknown response", _par_1, _cmd_tag );
                 }
                 break ;
                 case "delete":
                 var _n_index = safe_size( _cmd_params['index'], 0 );
                 if ( _n_index == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "Missing input index for fixed points to delete", _par_1, _cmd_tag );
                 else
                 {
                     var _delete_fp = function()
                     {
                         var _hashes = [], _ret_chunk, _zero_based, _ret_id, _ret_msg ;
                         // loading hashes related to elements to be deleted                       
                         $.each( _cmd_params['index'],
                                 function( _i, _fp_index )
                                 {
                                     _zero_based = _fp_index - 1, _ret_chunk = _glob_input_fixed_pts_array[_zero_based] ;
                                     if ( _ret_chunk != null ) _hashes.push( _ret_chunk[3] );
                                     else circles_lib_output( _out_channel, DISPATCH_WARNING, "Invalid input index #"+(_fp_index), _par_1, _cmd_tag );
                                 } );

                         if ( safe_size( _hashes, 0 ) > 0 )
                         {
                              $.each( _hashes,
                                      function( _i, _hash )
                                      {
                                          _ret_chunk = circles_lib_fixedpoints_find( _hash, _out_channel );
                                          _zero_based = _ret_chunk[1] ;
                                          _ret_chunk = circles_lib_fixedpoints_delete( _zero_based, _out_channel );
                                          _ret_id = safe_int( _ret_chunk[0], RET_WARNING ), _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                          circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                                      } );
                         }
                         else circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing valid input indexes for fixed points deletion", _par_1, _cmd_tag );

                         _fp_n = circles_lib_count_fixed_points();
                         var _ret_msg = ( _fp_n == 0 ) ? "The input fixed points list is empty now" : "The fixed points list includes " + _fp_n + " element" + (_fp_n!=1?"s":"")+" now" ;
                         circles_lib_output( _out_channel, DISPATCH_INFO, _ret_msg, _par_1, _cmd_tag );
                     }

						     		 var _params_array = [] ;
								     	   _params_array['prepromptquestion'] = null ;
					     		 			 _params_array['promptquestion'] = "This operation will erase "+_n_index+" element"+(_n_index!=1?"s":"")+" from fixed points list. Proceed ?" ;
									     	 _params_array['yes_fn'] = function() { _delete_fp(); }
									     	 _params_array['ifquestiondisabled_fn'] = function() { _delete_fp(); }
                 }
                 break ;
                 case "figures":
                 var _n_index = safe_size( _cmd_params['index'], 0 );
                 if ( _n_index == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "Missing input index for fixed points to turn into figures", _par_1, _cmd_tag );
                 else if ( _cmd_params['plane'] == NO_PLANE ) circles_lib_output( _out_channel, DISPATCH_INFO, "Missing input plane for fixed points to turn into figures", _par_1, _cmd_tag );
                 else
                 {
                      var _hashes = [], _ret_chunk, _zero_based, _ret_id, _ret_msg ;
                      // loading hashes related to elements to be deleted
                      $.each( _cmd_params['index'],
                              function( _i, _fp_index )
                              {
                                  _zero_based = _fp_index - 1, _ret_chunk = _glob_input_fixed_pts_array[_zero_based] ;
                                  if ( _ret_chunk != null ) _hashes.push( _ret_chunk[3] );
                                  else circles_lib_output( _out_channel, DISPATCH_WARNING, "Invalid input index #"+(_fp_index), _par_1, _cmd_tag );
                              } );

                      if ( safe_size( _hashes, 0 ) > 0 )
                      {
                           $.each( _hashes,
                                   function( _i, _hash )
                                   {
                                      _ret_chunk = circles_lib_fixedpoints_find( _hash, _out_channel );
                                      _zero_based = _ret_chunk[1] ;
                                      _ret_chunk = circles_lib_fixedpoints_create_figures_from( _i, _cmd_params['plane'], _out_channel );
                                      _ret_id = safe_int( _ret_chunk[0], RET_WARNING ), _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                      circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                                   } );
                      }
                      else circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing valid input indexes for fixed points localization", _par_1, _cmd_tag );
                 }
                 break ;
                 case "list":
                 var _n_source = safe_size( _cmd_params['source'], 0 );
                 if ( _fp_n == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "The input fixed points list is empty", _par_1, _cmd_tag );
                 else
                 {
                      if ( _cmd_params['dump'] ) _glob_text = "" ;
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
                      if ( _cmd_params['dump'] ) _glob_text = _row ;
                      if ( _out_channel == OUTPUT_TERMINAL )
                      {
                          var _found_str = "Found " + _fp_n + " entr" + ( _fp_n == 1 ? "y" : "ies" );
                          if ( _cmd_params['dump'] ) _glob_text += _glob_crlf + _found_str ;

                          circles_lib_output( _out_channel, DISPATCH_INFO, _found_str, _par_1, _cmd_tag );
                          circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<yellow>" + _row + "</yellow>", _par_1, _cmd_tag );
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
                                  if ( _out_channel == OUTPUT_TERMINAL )
                                  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _open_tag + _row + _close_tag, _par_1, _cmd_tag );

                                  if ( _cmd_params['dump'] ) _glob_text += _glob_crlf + _row ;
                              }
                            );

                      if ( _cmd_params['dump'] )
                      {
            						  _cmd_params['dump_array'] = _cmd_params['dump_array'] != null ? _cmd_params['dump_array'][0] : "circles.benchmark.txt" ;
            						  var _ret_chunk = circles_lib_dump_data_to_format( _glob_text.strip_tags(), _cmd_params['dump_array'] );
            						  var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
            							var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
            							if ( _ret_id == 0 )
            							{
            									_b_fail = YES, _error_str = _ret_msg ;
            							}
            							else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                      }
                 }
                 break ;
                 case "localize":
                 var _n_index = safe_size( _cmd_params['index'], 0 );
                 if ( _n_index == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "Missing input index for fixed points to localize", _par_1, _cmd_tag );
                 else if ( _cmd_params['plane'] == NO_PLANE ) circles_lib_output( _out_channel, DISPATCH_INFO, "Missing input plane for fixed points to localize", _par_1, _cmd_tag );
                 else
                 {
                      var _hashes = [], _ret_chunk, _zero_based, _ret_id, _ret_msg ;
                      // loading hashes related to elements to be deleted                       
                      $.each( _cmd_params['index'],
                              function( _i, _fp_index )
                              {
                                  _zero_based = _fp_index - 1, _ret_chunk = _glob_input_fixed_pts_array[_zero_based] ;
                                  if ( _ret_chunk != null ) _hashes.push( _ret_chunk[3] );
                                  else circles_lib_output( _out_channel, DISPATCH_WARNING, "Invalid input index #"+(_fp_index), _par_1, _cmd_tag );
                              } );

                      if ( safe_size( _hashes, 0 ) > 0 )
                      {
                           $.each( _hashes,
                                   function( _i, _hash )
                                   {
                                      _ret_chunk = circles_lib_fixedpoints_find( _hash, _out_channel );
                                      _zero_based = _ret_chunk[1] ;
                                      _ret_chunk = circles_lib_fixedpoints_locate( _i, _cmd_params['plane'], _cmd_params['clean'], _cmd_params['showtext'], _out_channel );
                                      _ret_id = safe_int( _ret_chunk[0], RET_WARNING ), _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                      circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                                   } );
                      }
                      else circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing valid input indexes for fixed points localization", _par_1, _cmd_tag );
                 }
                 break ;
                 case "release":
                 circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                 break ;
				default: break ;
            }
             
            if ( _glob_fixedpt_io != FIXEDPOINTS_IO_INPUT )
            circles_lib_output( _out_channel, DISPATCH_WARNING, "Warning! Fixed point option is not flagged to 'input' category", _par_1, _cmd_tag );
         }
    }
    else { _b_fail = YES, _error_str = "Missing input params" ; }

    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}