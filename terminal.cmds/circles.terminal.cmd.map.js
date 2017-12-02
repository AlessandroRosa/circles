function circles_terminal_cmd_map()
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
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['class'] = FN_DEF_NONE ;
         _params_assoc_array['mobius'] = [] ;
         _params_assoc_array['formula'] = [] ;
         _params_assoc_array['service'] = [] ;
         _params_assoc_array['symbol'] = "" ;
         _params_assoc_array['notes'] = "" ;
         _params_assoc_array['tag'] = "" ;
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "add", "clean", "delete", "generator", "init", "symbol", "list", "modify", "tag", "newtag",
    				 																"direct", "inverse", "notes", "release", "class", "html", "help"
						 															);
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.start_with_i( "tag:" ) ) _params_assoc_array['tag'] = _p.replaceAll( "tag:", "" );
              else if ( _p.start_with_i( "newtag:" ) )
              {
                  _params_assoc_array['newtag'] = _p.replaceAll( "newtag:", "" ).trim();
                  _params_assoc_array['action'] = "newtag" ;
              }
              else if ( _p.start_with_i( "direct:" ) ) _params_assoc_array['formula']['direct'] = _p.replaceAll( "direct:", "" ).trim();
              else if ( _p.start_with_i( "inverse:" ) ) _params_assoc_array['formula']['inverse'] = _p.replaceAll( "inverse:", "" ).trim();
              else if ( _p.start_with_i( "notes:" ) ) _params_assoc_array['notes'] = _p.replaceAll( "notes:", "" );
              else if ( _p.is_one_of_i( "add", "clean", "delete", "generator", "list", "modify", "release" ) )
              {
                  _params_assoc_array['action'] = _p ;
                  if ( _p.stricmp( "generator" ) ) _params_assoc_array['class'] = FN_DEF_MOBIUS ;
              }
              else if ( _p.start_with_i( "symbol:" ) ) _params_assoc_array['symbol'] = _p.replaceAll( "symbol:", "" );
              else if ( _p.start_with_i( "class:" ) )
              {
                  var _class = _p.replaceAll( "class:", "" );
                  if ( _class.stricmp( "mobius" ) ) _params_assoc_array['class'] = FN_DEF_MOBIUS ;
                  else if ( _class.stricmp( "formula" ) ) _params_assoc_array['class'] = FN_DEF_FORMULA ;
                  else
                  {
                      _params_assoc_array['class'] = FN_DEF_NONE ;
                      _b_fail = YES, _error_str = "Undefined input class '" + _class + "'" ;
                      break ;
                  }
              }
              else if ( _params_assoc_array['action'].is_one_of( "add", "generator" ) && _p.is_one_of_i( "init" )  )
                  _params_assoc_array['service'].push( _p );
              else if ( _params_assoc_array['action'].is_one_of( "add", "generator" ) &&
                        _params_assoc_array['class'] == FN_DEF_MOBIUS )
              {
                   var _n = ( _p.includes_i( "," ) ) ? _p.split( "," ).length : 1 ;
                   if ( _n == 1 ) _params_assoc_array['formula'].push( _p );
                   else if ( _n == 4 )
                   {
                      var _arr = _p.split( "," );
                      _params_assoc_array['mobius']['a'] = _arr[0].trim();
                      _params_assoc_array['mobius']['b'] = _arr[1].trim();
                      _params_assoc_array['mobius']['c'] = _arr[2].trim();
                      _params_assoc_array['mobius']['d'] = _arr[3].trim();
                   }
              }
              else if ( _p.start_with_i( "a:" ) ) _params_assoc_array['mobius']['a'] = _p.replaceAll( "a:", "" ).trim();
              else if ( _p.start_with_i( "b:" ) ) _params_assoc_array['mobius']['b'] = _p.replaceAll( "b:", "" ).trim();
              else if ( _p.start_with_i( "c:" ) ) _params_assoc_array['mobius']['c'] = _p.replaceAll( "c:", "" ).trim();
              else if ( _p.start_with_i( "d:" ) ) _params_assoc_array['mobius']['d'] = _p.replaceAll( "d:", "" ).trim();
              else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
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
           var _action = safe_string( _params_assoc_array['action'], "" ).trim();
           var _class = safe_int( _params_assoc_array['class'], 0 );
           switch( _action )
           {
                case "add":
                var _warns_array = [] ;
                var _tag = safe_string( _params_assoc_array['tag'].trim(), "" );
                if ( _tag.length == 0 ) _warns_array.push( "Missing input tag" );
                else if ( !_tag.testME( _glob_simple_string_regex_pattern ) ) _warns_array.push( "Tag '"+_tag+"' includes illegal chars" );
                var _mobius_map_str = _params_assoc_array['formula'].join( "" );
                var _op_code = _glob_maps[ _tag ] == null ? 1 : 2 ;

                if ( safe_size( _tag, 0 ) == 0 )
                {
                    _b_fail = YES, _error_str = "Missing input tag" ;
                    break ;
                }
                else if ( _class == FN_DEF_NONE ) _warns_array.push( "Missing 'class' param" );
                else if ( _class == FN_DEF_MOBIUS )
                {
                    if ( _op_code == 2 ) circles_lib_output( _output_channel, DISPATCH_INFO, "Found one map already recorded and with symbol '"+_tag+"'", _par_1, _cmd_tag );
                    var _msg = "Attempt to "+( _op_code == 1 ? "add" : "update" )+" a new Mobius map '"+_tag+"'" ;
                    circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );

                    var _mob_n = _params_assoc_array['mobius'].size_associative();
                    if ( _mob_n == 4 )
                    {
                        if ( safe_size( _params_assoc_array['mobius']['a'], 0 ) == 0 ) _warns_array.push( "Missing param 'a' formula" );
                        if ( safe_size( _params_assoc_array['mobius']['b'], 0 ) == 0 ) _warns_array.push( "Missing param 'b' formula" );
                        if ( safe_size( _params_assoc_array['mobius']['c'], 0 ) == 0 ) _warns_array.push( "Missing param 'c' formula" );
                        if ( safe_size( _params_assoc_array['mobius']['d'], 0 ) == 0 ) _warns_array.push( "Missing param 'd' formula" );
                    }
                    else if ( safe_size( _mobius_map_str, 0 ) > 0 )
                    {
                        var _msg = "Parsing input Mobius map: " + _mobius_map_str + _glob_crlf + "for params detection and extraction" + _glob_crlf ;
                        circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );

                        var _mobius_params_array = circles_lib_mobius_mng_extract_params( _mobius_map_str );
                        var _is_dupl = circles_terminal_cmd_map_find_duplicates( _mobius_params_array );

                        if ( _is_dupl ) _warns_array.push( "found duplicate" );
                        else if ( safe_size( _mobius_params_array, 0 ) > 0 )
                        {
                            circles_lib_output( _output_channel, DISPATCH_INFO, "Found input param 'a' as " + _mobius_params_array[0], _par_1, _cmd_tag );
                            circles_lib_output( _output_channel, DISPATCH_INFO, "Found input param 'b' as " + _mobius_params_array[1], _par_1, _cmd_tag );
                            circles_lib_output( _output_channel, DISPATCH_INFO, "Found input param 'c' as " + _mobius_params_array[2], _par_1, _cmd_tag );
                            circles_lib_output( _output_channel, DISPATCH_INFO, "Found input param 'd' as " + _mobius_params_array[3], _par_1, _cmd_tag );

                            _params_assoc_array['mobius']['a'] = _mobius_params_array[0] ;
                            _params_assoc_array['mobius']['b'] = _mobius_params_array[1] ;
                            _params_assoc_array['mobius']['c'] = _mobius_params_array[2] ;
                            _params_assoc_array['mobius']['d'] = _mobius_params_array[3] ;
                        }
                        else _warns_array.push( "Syntax error in the input Mobius map" );
                    }
                    else _warns_array.push( "Missing 'input' for Mobius map" );
                }
                else if ( _params_assoc_array['class'] == FN_DEF_FORMULA )
                {
                    if ( safe_size( _params_assoc_array['formula']['direct'], 0 ) == 0 ) _warns_array.push( "Missing param 'a' formula" );
                    if ( safe_size( _params_assoc_array['formula']['inverse'], 0 ) == 0 ) _warns_array.push( "Missing param 'b' formula" );
                }

                if ( _warns_array.length > 0 )
                {
                    var _warning = "Can't add a new map : " + _warns_array.join( _glob_crlf );
                    circles_lib_output( _output_channel, DISPATCH_WARNING, _warning, _par_1, _cmd_tag );
                }
                else
                {
                    var _op_str = ( _glob_maps[ _tag ] != null ) ? "updated" : "added" ;
                    if ( _params_assoc_array['class'] == FN_DEF_MOBIUS )
                    _glob_maps[ _tag ] = [ NO, _params_assoc_array['class'],
                                               _params_assoc_array['mobius']['a'],
                                               _params_assoc_array['mobius']['b'],
                                               _params_assoc_array['mobius']['c'],
                                               _params_assoc_array['mobius']['d'],
                                               ( _params_assoc_array['notes'] != null ) ? _params_assoc_array['notes'] : ""
                                           ] ;
                    else if ( _params_assoc_array['class'] == FN_DEF_FORMULA )
                    _glob_maps[ _tag ] = [ NO, _params_assoc_array['class'],
                                               _params_assoc_array['formula']['direct'],
                                               _params_assoc_array['formula']['inverse'],
                                               ( _params_assoc_array['notes'] != null ) ? _params_assoc_array['notes'] : ""
                                           ] ;

                    circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Map '"+_tag+"' has been "+_op_str+" with success", _par_1, _cmd_tag );
                }
                break ;
                case "clean":
                function _clean_list()
                {
                    var _smaps_n = safe_int( _glob_maps.size_associative(), 0 );
                    if ( _smaps_n == 0 ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The maps list is already empty", _par_1, _cmd_tag );
                    else
                    {
                         var _keys_array = _glob_maps.keys_associative();
                         var _n_cleaned = 0 ;
                         $.each( _keys_array,
                                 function( _i, _key )
                                 {
                                      if ( _glob_maps[_key] != null )
                                      {
                                           if ( _glob_maps[_key][0] == NO )
                                           {
                                              _glob_maps.remove_key( _key );
                                              if ( _glob_maps[_key] == null ) _n_cleaned++ ;
                                           }
                                      }
                                 }
                               );

                         circles_lib_output( _output_channel, ( _n_cleaned == 0 ) ? DISPATCH_INFO : DISPATCH_SUCCESS, ( _n_cleaned == 0 ) ? "No maps cleaned" : ( _n_cleaned + " map" + ( _n_cleaned == 1 ? "" : "s" ) + " cleaned" ), _par_1, _cmd_tag );
                    }
                }

           		  var _params_array = [] ;
						     	  _params_array['prepromptquestion'] = null ;
             		 		_params_array['promptquestion'] = "Confirm to clean maps list ?" ;
             		 		_params_array['yes_fn'] = function() { _clean_list(); }
             		 		_params_array['ifquestiondisabled_fn'] = function() { _clean_list(); }
					if ( !_glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
             		else circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );

                if ( _output_channel == OUTPUT_TERMINAL )
                {
                       circles_lib_terminal_info_echo( "Cleaning applies to non-default entries exclusively." );
                       circles_lib_terminal_info_echo( "All entries to be cleaned will be unrecoverable." );
                       _glob_terminal_out_stream.push( _fn,
                       {
                           prompt: _prompt_question
                       });
                }
                else _clean_list();
                break ;
                case "delete":
                var _warns_array = [] ;
                var _tag = safe_string( _params_assoc_array['tag'].trim(), "" );
                if ( _tag.length == 0 ) _warns_array.push( "Missing input tag" );
                else if ( !_tag.testME( _glob_simple_string_regex_pattern ) ) _warns_array.push( "Tag '"+_tag+"' includes illegal chars" );
                else if ( _glob_maps[ _tag ] == null ) _warns_array.push( "Can't find '"+_tag+"' in the maps list." );
                else if ( _glob_maps[ _tag ][0] == YES ) _warns_array.push( "'"+_tag+"' refers to a default map, which can't be deleted" );

                if ( _warns_array.length > 0 )
                {
                    var _warning = "Can't delete map : " + _warns_array.join( _glob_crlf );
                    circles_lib_output( _output_channel, DISPATCH_WARNING, _warning, _par_1, _cmd_tag );
                }
                else
                {
                    var _old_n = _glob_maps.size_associative();
                        _glob_maps.remove_key( _tag );
                    var _new_n = _glob_maps.size_associative();
                    var _msg = ( _new_n == _old_n - 1 ) ? "Map '"+_tag+"' has been deleted with success" : "Fail to delete map '"+_tag+"'" ;
                    circles_lib_output( _output_channel, ( _new_n == _old_n - 1 ) ? DISPATCH_SUCCESS : DISPATCH_ERROR, _msg, _par_1, _cmd_tag );
                }
                break ;
                case "generator":
                var _formula = _params_assoc_array['formula'] ;
                var _symbol = _params_assoc_array['symbol'] ;
                // if more formulas are input, no need to declare their symbols
                var _auto_symbol = ( safe_size( _formula, 0 ) != 1 ) ? YES : NO ;
                if ( !_auto_symbol )
                {
                     _symbol = circles_lib_alphabet_suggest_symbol( _glob_seeds_array, CAPS_LETTER );
                     circles_lib_output( _output_channel, DISPATCH_INFO, "Missing input symbol: automatically assigned tag '"+_symbol+"'", _par_1, _cmd_tag );
                }

                if ( safe_size( _symbol, 0 ) == 0 && !_auto_symbol )
                {
                    _b_fail = YES, _error_str = "Can't declare a new gen: missing generator symbol" ;
                }
                else if ( circles_lib_find_item_obj_by_symbol( _glob_seeds_array, _symbol ) != null )
                {
                    _b_fail = YES, _error_str = "Can't declare a new gen: there's already one with symbol '"+_symbol+"'" ;
                }
                else if ( safe_size( _formula, 0 ) == 0 )
                {
                    _b_fail = YES, _error_str = "Can't declare a new gen: missing map formula" ;
                }
                else
                {
                    if ( _auto_symbol ) circles_lib_output( _output_channel, DISPATCH_INFO, "Found more input formulas: tags will be automatically assigned", _par_1, _cmd_tag );
                    $.each( _formula,
                            function( _i, _mobius_map_str )
                            {
                                var _mobius_params_array = circles_lib_mobius_mng_extract_params( _mobius_map_str );
                                if ( safe_size( _mobius_params_array, 0 ) > 0 )
                                {
                                     var _a = circles_lib_math_parse_formula( _mobius_params_array[0] );
                                         _a = parse_complex_from_string( _a );
                                     var _b = circles_lib_math_parse_formula( _mobius_params_array[1] );
                                         _b = parse_complex_from_string( _b );
                                     var _c = circles_lib_math_parse_formula( _mobius_params_array[2] );
                                         _c = parse_complex_from_string( _c );
                                     var _d = circles_lib_math_parse_formula( _mobius_params_array[3] );
                                         _d = parse_complex_from_string( _d );
                                     if ( _a != null && _b != null && _c != null && _d != null )
                                     {
                                         var _use_inverse = ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) ) ? YES : NO ;
                                         if ( _use_inverse )
                                         {
                                              circles_lib_output( _output_channel, DISPATCH_INFO, "Current method is " + circles_lib_method_get_def( _glob_method ), _par_1, _cmd_tag );
                                              circles_lib_output( _output_channel, DISPATCH_INFO, "Inverse maps will be attempted to be declared", _par_1, _cmd_tag );
                                         }

                                         var _mm = new mobius_map( _a, _b, _c, _d ), _inv_mm = _mm.inv();
                                         var _mm_index = circles_lib_find_item_index_by_map( _glob_seeds_array, _mm );
                                         var _inv_mm_index = circles_lib_find_item_index_by_map( _glob_seeds_array, _inv_mm );
                                         var _gen_dupl = ( _mm_index != UNFOUND ) ? YES : NO ;
                                         var _inv_dupl = ( _inv_mm_index != UNFOUND ) ? YES : NO ;
                                         var _inv_symbol, _new_n = 0 ;
                                         if ( _gen_dupl )
                                         {
                                              _symbol = _glob_seeds_array[_mm_index].symbol ;
                                              _error_str = "Can't declare the new gen '"+_mobius_map_str+"' "+_glob_crlf+"it's already included in the current group and with symbol '"+( _symbol )+"'" ;
                                              circles_lib_output( _output_channel, DISPATCH_WARNING, _error_str, _par_1, _cmd_tag );
                                         }
                                         else
                                         {
                                            if ( _auto_symbol )
                                            {
                                                _symbol = circles_lib_alphabet_suggest_symbol( _glob_seeds_array, CAPS_LETTER );
                                                circles_lib_output( _output_channel, DISPATCH_INFO, "Automatically assigned tag '"+_symbol+"'", _par_1, _cmd_tag );
                                            }

                                            _inv_symbol = _use_inverse ? circles_lib_word_inverse_get( _symbol ) : "" ;
                                            circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<peacock>>> Added a new generator with symbol '"+_symbol+"'</peacock>", _par_1, _cmd_tag );
                                            _new_n++ ;
                                            _glob_seeds_array.push( new item_obj( _mm, null, null, _symbol, 0,
                                                                                  YES, _glob_draw_seed_color, NO, "",
                                                                                  _inv_symbol, 1, ITEM_TYPE_MOBIUS ) );
                                         }

                                         if ( safe_size( _symbol, 0 ) == 0 && _mm_index != UNFOUND ) _symbol = _glob_seeds_array[_mm_index].symbol ;
                                         _inv_symbol = _use_inverse ? circles_lib_word_inverse_get( _symbol ) : "" ;
                                         if ( _inv_dupl )
                                         {
                                              _error_str = "Can't declare a new inverse gen: it's already included in the current group and with symbol '" + ( _glob_seeds_array[_inv_dupl].symbol )+"'" ;
                                              circles_lib_output( _output_channel, DISPATCH_WARNING, _error_str, _par_1, _cmd_tag );
                                         }
                                         else
                                         {
                                            if ( _use_inverse )
                                            {
                                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<peacock>>> Added a inverse generator with symbol '"+_inv_symbol+"'</peacock>", _par_1, _cmd_tag );
                                                _new_n++ ;
                                                _glob_seeds_array.push( new item_obj( _mm.inv(), null, null, _inv_symbol, 0,
                                                                                      YES, _glob_draw_seed_color, NO, "",
                                                                                      _symbol, 1, ITEM_TYPE_MOBIUS ) );
                                            }
                                         }
                                     }
                                     else
                                     {
                                         _b_fail = YES, _error_str = "Can't declare a new gen: found syntax errors while parsing formal input formulas" ;
                                     }
                                }
                                else
                                {
                                    _b_fail = YES, _error_str = "Can't declare a new gen: found syntax errors in formal input formulas" ;
                                }
                            }
                          );

                      if ( _params_assoc_array['service'].includes_i( "init" ) )
                      {
                          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<peacock>>>Gens have been init</peacock>", _par_1, _cmd_tag );
                          _map_cmd_init( _par_1, _output_channel );
                      }
                }
                break ;
                case "list":
                var _keys = _glob_maps.keys_associative(), _chunk, _notes ;
                if ( _keys.length > 0 )
                {
                    var _html = "<table>" ;
                        _html += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                        _html += "<tr>" ;
                        _html += "<td STYLE=\"color:lightblue;\" WIDTH=\"90\">Definition</td>" ;
                        _html += "<td WIDTH=\"5\"></td>" ;
                        _html += "<td STYLE=\"color:peacock;\">Default</td>" ;
                        _html += "<td WIDTH=\"15\"></td>" ;
                        _html += "<td STYLE=\"color:lightblue;\">Class</td>" ;
                        _html += "<td WIDTH=\"2\"></td>" ;
                        _html += "<td STYLE=\"color:snow;\" COLSPAN=\"8\" ALIGN=\"center\">Params</td>" ;
                        _html += "<td WIDTH=\"2\"></td>" ;
                        _html += "<td STYLE=\"color:snow;\" ALIGN=\"center\">Fn</td>" ;
                        _html += "<td WIDTH=\"2\"></td>" ;
                        _html += "<td STYLE=\"color:peacock;\" ALIGN=\"center\">Inv Fn</td>" ;
                        _html += "<td WIDTH=\"8\"></td>" ;
                        _html += "<td WIDTH=\"3\"></td>" ;
                        _html += "<td STYLE=\"color:lightgray;\">Notes</td>" ;
                        _html += "</tr>" ;
                        _html += "<tr><td HEIGHT=\"3\"></td></tr>" ;

                    for( var _i = 0 ; _i < _keys.length ; _i++ )
                    {
                        _chunk = _glob_maps[ _keys[_i] ] ;
                        _html += "<tr>" ;
                        _html += "<td VALIGN=\"top\" STYLE=\"color:lightblue;\" WIDTH=\"90\">"+_keys[_i] +"</td>" ;
                        _html += "<td WIDTH=\"5\"></td>" ;
                        _html += "<td VALIGN=\"top\" STYLE=\"color:peacock;\">"+( _chunk[0] ? "yes" : "no" )+"</td>" ;
                        _html += "<td WIDTH=\"15\"></td>" ;
                        _html += "<td VALIGN=\"top\" STYLE=\"color:lightblue;\">"+circles_lib_mobius_mng_category_get_def( _chunk[1] )+"</td>" ;
                        _html += "<td WIDTH=\"2\"></td>" ;
                        if ( _chunk[1] == FN_DEF_MOBIUS )
                        {
                            _html += "<td VALIGN=\"top\" STYLE=\"color:snow;border-left:1px solid #161616;padding-left:5px;\" ALIGN=\"center\">"+_chunk[2] +"</td>" ;
                            _html += "<td WIDTH=\"8\"></td>" ;
                            _html += "<td VALIGN=\"top\" STYLE=\"color:snow;\" ALIGN=\"center\">"+_chunk[3] +"</td>" ;
                            _html += "<td WIDTH=\"8\"></td>" ;
                            _html += "<td VALIGN=\"top\" STYLE=\"color:snow;\" ALIGN=\"center\">"+_chunk[4] +"</td>" ;
                            _html += "<td WIDTH=\"8\"></td>" ;
                            _html += "<td VALIGN=\"top\" STYLE=\"color:snow;\" ALIGN=\"center\">"+_chunk[5] +"</td>" ;
                            _html += "<td WIDTH=\"5\" STYLE=\"border-right:1px solid #161616;padding-right:5px;\"></td>" ;

                            _html += "<td COLSPAN=\"5\"></td>" ;
                        }
                        else if ( _chunk[1] == FN_DEF_FORMULA )
                        {
                            _html += "<td COLSPAN=\"8\" STYLE=\"border-right:1px solid #161616;padding-right:5px;\"></td>" ;

                            _html += "<td WIDTH=\"8\"></td>" ;
                            _html += "<td VALIGN=\"top\" STYLE=\"color:snow;\">"+_chunk[2] +"</td>" ;
                            _html += "<td WIDTH=\"8\"></td>" ;
                            _html += "<td VALIGN=\"top\" STYLE=\"color:royalblue;\">"+_chunk[3] +"</td>" ;
                            _html += "<td WIDTH=\"8\"></td>" ;
                        }
                        
                        _html += "<td WIDTH=\"3\" STYLE=\"border-left:1px solid #161616;padding-left:5px;\"></td>" ;
                        _notes = ( _chunk[1] == FN_DEF_MOBIUS ? _chunk[6] : _chunk[4] );
                        if ( _notes.trim().length == 0 ) _notes = "<i>empty</i>" ;
                        _html += "<td VALIGN=\"top\" STYLE=\"color:lightgray;\">"+_notes+"</td>" ;

                        _html += "</tr>" ;
                        _html += "<tr><td HEIGHT=\"2\"></td></tr>" ;
                        _html += "<tr><td HEIGHT=\"1\" STYLE=\"background-color:#161616;\" COLSPAN=\"20\"></td></tr>" ;
                        _html += "<tr><td HEIGHT=\"2\"></td></tr>" ;
                    }

                    _html += "</table>" ;
                    circles_lib_terminal_html_display( _glob_terminal, _html );
                }
                else
                {
                    if ( _b_fail ) circles_lib_output( _output_channel, DISPATCH_WARNING, "The maps list is empty", _par_1, _cmd_tag );
                }
                break ;
                case "modify":
                var _warns_array = [] ;
                var _tag = safe_string( _params_assoc_array['tag'].trim(), "" );

                if ( _tag.length == 0 ) _warns_array.push( "Missing input tag" );
                else if ( !_tag.testME( _glob_simple_string_regex_pattern ) ) _warns_array.push( "Tag '"+_tag+"' includes illegal chars" );
                else if ( _glob_maps[ _tag ] == null ) _warns_array.push( "Can't find '"+_tag+"' in the maps list" );
                else if ( _glob_maps[ _tag ][0] == YES ) _warns_array.push( "'"+_tag+"' refers to a default map, which can't be modified" );

                if ( _warns_array.length > 0 )
                {
                    var _warning = "Can't modify this map : " + _warns_array.join( _glob_crlf );
                    circles_lib_output( _output_channel, DISPATCH_WARNING, _warning, _par_1, _cmd_tag );
                }
                else
                {
                    var _sp = _glob_maps[ _tag ] ;
                    if ( _sp != null && _sp[1] == FN_DEF_MOBIUS )
                    {
                        if ( _params_assoc_array['mobius']['a'] != null )
                        _sp[2] = _params_assoc_array['mobius']['a'] ;
                        if ( _params_assoc_array['mobius']['b'] != null )
                        _sp[3] = _params_assoc_array['mobius']['b'] ;
                        if ( _params_assoc_array['mobius']['c'] != null )
                        _sp[4] = _params_assoc_array['mobius']['c'] ;
                        if ( _params_assoc_array['mobius']['d'] != null )
                        _sp[5] = _params_assoc_array['mobius']['d'] ;
                        if ( _params_assoc_array['notes'] != null )
                        _sp[6] = _params_assoc_array['notes'] ;
                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Map '"+_tag+"' has been modified with success", _par_1, _cmd_tag );
                    }
                    else if ( _sp != null && _sp[1] == FN_DEF_FORMULA )
                    {
                        if ( _params_assoc_array['formula']['direct'] != null )
                        _sp[2] = _params_assoc_array['formula']['direct'] ;
                        if ( _params_assoc_array['formula']['inverse'] != null )
                        _sp[3] = _params_assoc_array['formula']['inverse'] ;
                        if ( _params_assoc_array['notes'] != null )
                        _sp[4] = _params_assoc_array['notes'] ;
                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Map '"+_tag+"' has been modified with success", _par_1, _cmd_tag );
                    }
                    else
                    {
                        _b_fail = YES, _error_str = "Fail to modify: can't find '"+_tag+"' in the maps list" ;
                    }
                }
                break ;
                case "newtag":
                var _warns_array = [] ;
                var _tag = safe_string( _params_assoc_array['tag'].trim(), "" );

                if ( _tag.length == 0 ) _warns_array.push( "Missing input tag" );
                else if ( !_tag.testME( _glob_simple_string_regex_pattern ) ) _warns_array.push( "Tag '"+_tag+"' includes illegal chars" );
                else if ( _glob_maps[ _tag ] == null ) _warns_array.push( "Can't find '"+_tag+"' in the maps list" );
                else if ( _glob_maps[ _tag ][0] == YES ) _warns_array.push( "'"+_tag+"' refers to a default map,which can't be modified" );
                else if ( safe_string( _params_assoc_array['newtag'], "" ).length == 0 ) _warns_array.push( "new input tag is empty" );

                if ( _warns_array.length > 0 )
                {
                    var _warning = "Can't change tag for this map : " + _warns_array.join( _glob_crlf );
                    circles_lib_output( _output_channel, DISPATCH_WARNING, _warning, _par_1, _cmd_tag );
                }
                else
                {
                    var _sp = _glob_maps[ _tag ] ;
                    var _newtag = _params_assoc_array['newtag'] ;
                    _glob_maps[ _newtag ] = _sp.clone();
                    if ( _glob_maps[ _newtag ] != null )
                    {
                        _glob_maps.remove_key( _tag );
                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Map tag '"+_tag+"' has been turned to '"+_newtag+"'", _par_1, _cmd_tag );
                    }
                    else { _b_fail = YES, _error_str = "Fail to change tag to '"+_tag+"' map" ; }
                }
                break ;
                case "release":
                circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                default: _b_fail = YES, _error_str = "Unknown action '"+_action+"'" ; break ;
           }
         }
     }
     else { _b_fail = YES, _error_str = "Missing input action" ; }

     if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION )
     circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function circles_terminal_cmd_map_find_duplicates( _mobius_params_array )
{
     var _keys = _glob_maps.keys_associative(), bFOUND = NO ;
     if ( _keys.length > 0 )
     {
          for( var _i = 0 ; _i < _keys.length ; _i++ )
          {
              _chunk = _glob_maps[ _keys[_i] ] ;
              if ( _chunk[1] == FN_DEF_MOBIUS &&
                   _mobius_params_array[0].stricmp( _chunk[2] ) &&
                   _mobius_params_array[1].stricmp( _chunk[3] ) &&
                   _mobius_params_array[2].stricmp( _chunk[4] ) &&
                   _mobius_params_array[3].stricmp( _chunk[5] )
                 )
              {
                  bFOUND = YES ;
                  break ;
              }
          }
     }
     return bFOUND ;
}

function _map_cmd_init( _par_1, _output_channel )
{
     _glob_init_mask &= ~INIT_FROM_DISKS ;
     _glob_init_mask |= INIT_FROM_MAPS ;
     var _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, YES, YES, _output_channel );
     var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
     var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
		 if ( _ret_id == RET_OK )
		 {
     		 _b_fail = YES, _error_str = _ret_msg ;
     }
     else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _ret_msg, _par_1, _cmd_tag );
     return _ret_id ;
}