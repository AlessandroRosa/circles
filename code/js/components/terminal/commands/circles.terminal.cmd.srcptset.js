function circles_terminal_cmd_srcptset()
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
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['plane'] = UNDET ;
         _params_assoc_array['shape'] = "" ;
         _params_assoc_array['word'] = "" ;
         _params_assoc_array['complex'] = "" ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "init", "destroy", "add", "del", "shape", "html", "release", "word" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.stricmp( "zplane" ) ) { _params_assoc_array['plane'] = Z_PLANE ; _params_assoc_array['action'] = "plane" ; }
            else if ( _p.stricmp( "wplane" ) ) { _params_assoc_array['plane'] = W_PLANE ; _params_assoc_array['action'] = "plane" ; }
            else if ( _p.is_one_of_it( "init", "destroy", "add", "del", "shape", "run" ) ) _params_assoc_array['action'] = _p.toLowerCase() ;
            else if ( _p.is_one_of_it( "circle", "disk", "line", "rect" ) ) _params_assoc_array['shape'] = _p.toLowerCase() ;
            else if ( _p.testME( _glob_complex_number_regex_pattern ) ) _params_assoc_array['complex'] = _p ;
            else if ( _p.start_with( "word:" ) )
            {
               _params_assoc_array['action'] = "word" ;
               _params_assoc_array['word'] = _p.replaceAll( "word:", _p ) ;
            }
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
         else
         {
             switch( _action )
             {
               case "add":
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _out_channel, DISPATCH_ERROR, "Please, init the source point set to perform the action '"+_action+"'", _par_1, _cmd_tag );
               else if ( _params_assoc_array['complex'].length == 0 )
               circles_lib_output( _out_channel, DISPATCH_ERROR, "Please, missing input complex point for action '"+_action+"'", _par_1, _cmd_tag );
               else
               {
                 var _c = parse_complex_from_string( _params_assoc_array['complex'] ) ;
                 if ( is_complex( _c ) )
                 {
                   _glob_storage['srcptset']['pts'].push( _c );
                   circles_lib_output( _out_channel, DISPATCH_SUCCESS, "The complex value "+_params_assoc_array['complex']+" has been successfully added.", _par_1, _cmd_tag );
                 }
                 else
                 {
                   circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot perform the action '"+_action+"': the input parameter '"+_params_assoc_array['complex']+"' is not a valid complex number", _par_1, _cmd_tag );
                 }
               }
               break ;
               case "init":
               if ( _glob_storage['srcptset'] == null )
               {
                 _glob_storage['srcptset'] = [] ;
                 _glob_storage['srcptset']['pts'] = [] ;
                 _glob_storage['srcptset']['plane'] = null ;
                 _glob_storage['srcptset']['shape'] = null ;
                 _glob_storage['srcptset']['word'] = null ;
                 var _msg = "Source points set has been initialized with success." ;
                     _msg += _glob_crlf + "You are now enabled to actions." ;
                 circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
               }
               else
               {
                   var _msg = "Source points set has been already initialized." ;
                       _msg += _glob_crlf + "Destroy old data before going on." ;
                   circles_lib_output( _out_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
               }
               break ;
               case "destroy":
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _out_channel, DISPATCH_WARNING, "Cannot '"+_action+"' the source point set, because no initialization has been made.", _par_1, _cmd_tag );
               else
               {
                   _glob_storage['srcptset'] = null ;
                   var _msg = "Source points set has been destroyed with success." ;
                   circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
               }
               break ;
               case "plane":
               var _plane = _params_assoc_array['plane'] ;
               var _plane_def = circles_lib_plane_get_def_for_cmds( _plane ) ;
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _out_channel, DISPATCH_WARNING, "Cannot set the plane '"+_plane_def+"' for the source point set, because no initialization has been made.", _par_1, _cmd_tag );
               else
               {
                 var _msg = "The plane '"+_plane_def+"' has been successfully set up." ;
                 _glob_storage['srcptset']['plane'] = _plane ;
                 circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
               }
               break ;
               case "release":
               circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
               break ;
               case "run":
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _out_channel, DISPATCH_WARNING, "Cannot run, because no initialization has been made.", _par_1, _cmd_tag );
               else
               {
                 var _run_mask = 0 ;
                 _run_mask |= _glob_storage['srcptset']['plane'] == null ? 1 : 0 ;
                 _run_mask |= _glob_storage['srcptset']['shape'] == null ? 2 : 0 ;
                 _run_mask |= _glob_storage['srcptset']['word'] == null ? 4 : 0 ;
                 if ( _run_mask == (1|2|4) )
                 {
                    var _shape = _glob_storage['srcptset']['shape'], _plane = _glob_storage['srcptset']['plane'], _word = _glob_storage['srcptset']['word'] ;
                 }
                 else
                 {
                    var _msg = "Cannot run, due to missing data:" ;
                    if ( ( _run_mask & 1 ) == 0 ) _msg += "\nMissing input plane specification" ;
                    if ( ( _run_mask & 2 ) == 0 ) _msg += "\nMissing input shape specification" ;
                    if ( ( _run_mask & 4 ) == 0 ) _msg += "\nMissing word shape specification" ;
                 }
               }
               break ;
               case "shape":
               var _shape = _params_assoc_array['shape'] ;
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _out_channel, DISPATCH_WARNING, "Cannot set the shape '"+_shape+"' for the source point set, because no initialization has been made.", _par_1, _cmd_tag );
               else
               {
                 var _msg = "The shape '"+_shape+"' has been successfully set up." ;
                 _glob_storage['srcptset']['shape'] = _shape ;
                 circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
               }
               break ;
               case "word":
               var _input_word = _params_assoc_array['word'] ;
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _out_channel, DISPATCH_WARNING, "Cannot set the word for the source point set, because no initialization has been made.", _par_1, _cmd_tag );
               else
               {
                 _glob_storage['srcptset']['action'] = _action ;
                 if ( _glob_storage['srcptset'].length > 0 )
                 {
                   if ( _glob_alphabet.length == 0 )
                   {
                     _glob_storage['srcptset']['word'] = "" ;
                     circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot input the word '"+_input_word+"': missing registered group", _par_1, _cmd_tag );
                   }
                   else if ( _input_word.length == 0 )
                   circles_lib_output( _out_channel, DISPATCH_ERROR, "The input word is empty", _par_1, _cmd_tag );
                   else if ( _input_word.length > 0 )
                   {
                     var _b_check_word = circles_lib_word_check( _input_word, _glob_alphabet );
                     if ( _b_check_word )
                     {
                       var _msg = "The word '"+_word+"' has been set for the source points set with success." ;
                       _glob_storage['srcptset']['word'] = _input_word ;
                       circles_lib_output( _out_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                     }
                     else
                     {
                       _glob_storage['srcptset']['word'] = "" ;
                       circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot input the word '"+_input_word+"': it does not match the current alphabet "+_glob_alphabet.join( ", " ), _par_1, _cmd_tag );
                     }
                   }
                 }
               }
               break ;
               default: break ;
             }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
     }

     if ( _b_fail && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function circles_lib_terminal_all_action_check( _action )
{
      var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
      _action = safe_string( _action, "" ).trim();
      var _items_n = circles_lib_count_items();
      if ( _action.length == 0 || _items_n == 0 ) return UNDET ;
      else
      {
          var _n_affected = 0, _cc ;
          for( var _i = 0 ; _i < _items_n ; _i++ )
          {
              _cc = _items_array[_i].complex_circle ;
              if ( is_circle( _cc ) )
              {
                  switch( _action )
                  {
                      case "draw": if ( _items_array[_i].complex_circle.draw ) _n_affected++ ; break ;
                      case "fill": if ( _items_array[_i].complex_circle.fill ) _n_affected++ ; break ;
							        default: break ;
                  }
              }
          }
            
          return _n_affected == 0 ? 0 : 1 ;
      }
}

function circles_lib_terminal_all_fillcolor_not_set_check()
{
      var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
      var _items_n = circles_lib_count_items( _items_array );
      if ( _items_n == 0 ) return UNDET ;
      else
      {
          var _n_fillcolor_not_set = 0 ;
          for( var _i = 0 ; _i < _items_n ; _i++ )
          if ( _items_array[_i].complex_circle.fillcolor.length == 0 ) _n_fillcolor_not_set++ ;
          return _n_fillcolor_not_set ;
      }
}