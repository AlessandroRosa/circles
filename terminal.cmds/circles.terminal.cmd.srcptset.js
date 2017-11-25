function circles_terminal_cmd_srcptset()
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
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['plane'] = "" ;
         _params_assoc_array['shape'] = "" ;
         _params_assoc_array['word'] = "" ;
         _params_assoc_array['center'] = null ;
         _params_assoc_array['radius'] = null ;
         _params_assoc_array['start_pt'] = null ;
         _params_assoc_array['end_pt'] = null ;
         _params_assoc_array['width'] = null ;
         _params_assoc_array['height'] = null ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "init", "destroy", "ins", "del", "shape", "html", "release", "word" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.is_one_of_i( "zplane", "wplane" ) ) { _params_assoc_array['plane'] = _p ; _params_assoc_array['action'] = "plane" ; }
            else if ( _p.is_one_of_i( "ins", "config", "del", "destroy", "init", "plane", "run", "shape" ) ) _params_assoc_array['action'] = _p.toLowerCase() ;
            else if ( _p.is_one_of_i( "circle", "disk", "line", "rect" ) ) _params_assoc_array['shape'] = _p.toLowerCase() ;
            else if ( _p.testME( _glob_complex_number_regex_pattern ) )
            {
               switch( _params_assoc_array['shape'] )
               {
                 case "circle":
                 case "disk":
                 if ( _params_assoc_array['center'] == null ) _params_assoc_array['center'] = _p ;
                 else if ( _params_assoc_array['radius'] == null ) _params_assoc_array['radius'] = _p ;
                 break ;
                 case "rect":
                 if ( _params_assoc_array['center'] == null ) _params_assoc_array['center'] = _p ;
                 else if ( _params_assoc_array['width'] == null ) _params_assoc_array['width'] = _p ;
                 else if ( _params_assoc_array['height'] == null ) _params_assoc_array['height'] = _p ;
                 break ;
                 case "line":
                 if ( _params_assoc_array['start_pt'] == null ) _params_assoc_array['start_pt'] = _p ;
                 else if ( _params_assoc_array['end_pt'] == null ) _params_assoc_array['end_pt'] = _p ;
                 break ;
                 default: break ;
               }
            }
            else if ( _p.start_with( "word:" ) )
            {
               _params_assoc_array['action'] = "word" ;
               _params_assoc_array['word'] = _p.replaceAll( "word:", "" ) ;
            }
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
         else
         {
             var _action = _params_assoc_array['action'] ;
             switch( _action )
             {
               case "config":
               var _msg = "Current configuration for cmd "+_cmd_tag ;
               if ( _glob_storage['srcptset'] != null )
               {
                  var _plane = _glob_storage['srcptset']['plane'] ;
                  var _shape = _glob_storage['srcptset']['shape'] ;
                  var _word = _glob_storage['srcptset']['word'] ;
                  var _pts = _glob_storage['srcptset']['pts'] ;
                  _msg += "\n<white>Word</white> : " + ( _word != null ? "<green>"+_word+"</green>" : "<lightgray>not set up yet</lightgray>" ) ;
                  _msg += "\n<white>Points</white> : " + ( _pts.length > 0 ? "<green>set up</green>" : "<lightgray>not set up yet</lightgray>" ) ;
                  _msg += "\n<white>Plane</white> : " + ( _plane != null ? "<green>"+_plane+"</green>" : "<lightgray>not set up yet</lightgray>" ) ;
                  _msg += "\n<white>Shape</white> : " + ( _shape != null ? "<green>"+_shape+"</green>" : "<lightgray>not set up yet</lightgray>" ) ;

                  switch( _shape )
                  {
                    case "circle":
                    case "disk":
                    var _center = _glob_storage['srcptset']['center'] ;
                    var _radius = _glob_storage['srcptset']['radius'] ;
                    _msg += "\n<white>Center</white> for <green>"+_shape+"</green> <white>shape</white> : " + ( _center != null ? "<green>"+_center+"</green>" : "<lightgray>not set up yet</lightgray>" ) ;
                    _msg += "\n<white>Radius</white> for <green>"+_shape+"</green> <white>shape</white> : " + ( _radius != null ? "<green>"+_radius+"</green>" : "<lightgray>not set up yet</lightgray>" ) ;
                    break ;
                    case "line":
                    var _start_pt = _glob_storage['srcptset']['start_pt'] ;
                    var _end_pt = _glob_storage['srcptset']['end_pt'] ;
                    _msg += "\n<white>Start point</white> for <green>"+_shape+"</green> <white>shape</white> : " + ( _start_pt != null ? "<green>"+_start_pt+"</green>" : "<lightgray>not set up yet</lightgray>" ) ;
                    _msg += "\n<white>End point</white> for <green>"+_shape+"</green> <white>shape</white> : " + ( _end_pt != null ? "<green>"+_end_pt+"</green>" : "<lightgray>not set up yet</lightgray>" ) ;
                    break ;
                    case "rect":
                    var _center = _glob_storage['srcptset']['center'] ;
                    var _width = _glob_storage['srcptset']['width'] ;
                    var _height = _glob_storage['srcptset']['height'] ;
                    _msg += "\n<white>Center</white> for <green>"+_shape+"</green> <white>shape</white> : " + ( _center != null ? "<green>"+_center+"</green>" : "<lightgray>not set up yet</lightgray>" ) ;
                    _msg += "\n<white>Width</white> for <green>"+_shape+"</green> <white>shape</white> : " + ( _width != null ? "<green>"+_width+"</green>" : "<lightgray>not set up yet</lightgray>" ) ;
                    _msg += "\n<white>Height</white> for <green>"+_shape+"</green> <white>shape</white> : " + ( _height != null ? "<green>"+_height+"</green>" : "<lightgray>not set up yet</lightgray>" ) ;
                    break ;
                    default: break ;
                  }
                  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
               }
               else
               {
                 var _msg = "Cannot return the current configuration because";
                     _msg += "\nthe source points set has not been initialized." ;
                 circles_lib_output( _output_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
               }
               break ;
               case "del":
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _output_channel, DISPATCH_ERROR, "Please, init the source points set to perform point deletion", _par_1, _cmd_tag );
               else if ( _params_assoc_array['complex'].length == 0 )
               circles_lib_output( _output_channel, DISPATCH_ERROR, "Please, missing input complex point for point deletion", _par_1, _cmd_tag );
               else
               {
                 var _c = parse_complex_from_string( _params_assoc_array['complex'] ) ;
                 if ( is_complex( _c ) )
                 {
                   _c = _c.formula() ;
                   var _len = _glob_storage['srcptset']['pts'].length ;
                   if ( _glob_storage['srcptset']['pts'].includes( _c ) )
                   {
                     var _idx = _glob_storage['srcptset']['pts'].indexOf( _c ) ;
                     _glob_storage['srcptset']['pts'].remove( _idx, _idx );
                     if ( _glob_storage['srcptset']['pts'].length == _len - 1 )
                     circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The complex value "+_params_assoc_array['complex']+" has been successfully deleted.", _par_1, _cmd_tag );
                     else
                     circles_lib_output( _output_channel, DISPATCH_ERROR, "The complex value "+_params_assoc_array['complex']+" has not been deleted.", _par_1, _cmd_tag );
                   }
                 }
                 else
                 {
                   circles_lib_output( _output_channel, DISPATCH_ERROR, "Cannot perform point deletion: the input parameter '"+_params_assoc_array['complex']+"' is not a valid complex number", _par_1, _cmd_tag );
                 }
               }
               break ;
               case "destroy":
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _output_channel, DISPATCH_WARNING, "Cannot '"+_action+"' the source points set, because no initialization has been made yet.", _par_1, _cmd_tag );
               else
               {
                 _glob_storage['srcptset'] = null ;
                 var _msg = "Source points set has been destroyed with success." ;
                     _msg += _glob_crlf + "Initialize it again for new actions." ;
                 circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
               }
               break ;
               case "ins":
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _output_channel, DISPATCH_ERROR, "Please, init the source points set to perform point insertion", _par_1, _cmd_tag );
               else if ( _params_assoc_array['complex'].length == 0 )
               circles_lib_output( _output_channel, DISPATCH_ERROR, "Please, missing input complex point for point insertion", _par_1, _cmd_tag );
               else
               {
                 var _c = parse_complex_from_string( _params_assoc_array['complex'] ) ;
                 if ( is_complex( _c ) )
                 {
                   _c = _c.formula() ;
                   var _len = _glob_storage['srcptset']['pts'].length ;
                   if ( _glob_storage['srcptset']['pts'].not_includes( _c ) )
                   {
                     _glob_storage['srcptset']['pts'].push( _c );
                     if ( _glob_storage['srcptset']['pts'].length == _len + 1 )
                     circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The complex value "+_params_assoc_array['complex']+" has been successfully added.", _par_1, _cmd_tag );
                     else
                     circles_lib_output( _output_channel, DISPATCH_ERROR, "The complex value "+_params_assoc_array['complex']+" has not been added.", _par_1, _cmd_tag );
                   }
                 }
                 else
                 {
                   circles_lib_output( _output_channel, DISPATCH_ERROR, "Cannot perform point insertion: the input parameter '"+_params_assoc_array['complex']+"' is not a valid complex number", _par_1, _cmd_tag );
                 }
               }
               break ;
               case "init":
               if ( _glob_storage['srcptset'] == null )
               {
                 _glob_storage['srcptset'] = [] ;
                 _glob_storage['srcptset']['pts'] = [] ;
                 _glob_storage['srcptset']['settings'] = [] ;
                 _glob_storage['srcptset']['plane'] = null ;
                 _glob_storage['srcptset']['shape'] = null ;
                 _glob_storage['srcptset']['word'] = null ;
                 var _msg = "Source points set has been initialized with success." ;
                     _msg += _glob_crlf + "You are now enabled to manage actions." ;
                 circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
               }
               else
               {
                 var _msg = "Source points set has been already initialized." ;
                     _msg += _glob_crlf + "Destroy old data before going on." ;
                 circles_lib_output( _output_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
               }
               break ;
               case "plane":
               var _plane = _params_assoc_array['plane'], _plane_def = circles_lib_return_plane_type( _plane ) ;
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _output_channel, DISPATCH_WARNING, "Cannot set the plane '"+_plane_def+"', because no initialization has been made.", _par_1, _cmd_tag );
               else if ( _plane.length == 0 || _plane_def == 0 )
               circles_lib_output( _output_channel, DISPATCH_WARNING, "Invalid input plane", _par_1, _cmd_tag );
               else
               {
                 var _msg = "The plane '"+_plane+"' has been successfully set up." ;
                 _glob_storage['srcptset']['plane'] = _plane ;
                 circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
               }
               break ;
               case "release":
               circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
               break ;
               case "run":
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _output_channel, DISPATCH_WARNING, "Cannot run, because no initialization has been made.", _par_1, _cmd_tag );
               else
               {
                 var _run_mask = 0 ;
                 _run_mask |= _glob_storage['srcptset']['plane'] != null ? 1 : 0 ;
                 _run_mask |= _glob_storage['srcptset']['shape'] != null ? 2 : 0 ;
                 _run_mask |= _glob_storage['srcptset']['word'] != null ? 4 : 0 ;
                 if ( _run_mask == (1|2|4) )
                 {
                    var _shape = _glob_storage['srcptset']['shape'], _plane = _glob_storage['srcptset']['plane'], _word = _glob_storage['srcptset']['word'] ;
                 }
                 else
                 {
                    var _msg = "Cannot run, due to missing data:" ;
                    if ( ( _run_mask & 1 ) == 0 ) _msg += "\n* Missing input plane specification" ;
                    if ( ( _run_mask & 2 ) == 0 ) _msg += "\n* Missing input shape specification" ;
                    if ( ( _run_mask & 4 ) == 0 ) _msg += "\n* Missing word shape specification" ;
                    circles_lib_output( _output_channel, DISPATCH_ERROR, _msg, _par_1, _cmd_tag );
                 }
               }
               break ;
               case "shape":
               var _shape = _params_assoc_array['shape'] ;
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _output_channel, DISPATCH_WARNING, "Cannot set the shape '"+_shape+"', because no initialization has been made.", _par_1, _cmd_tag );
               else
               {
                 var _msg = "The shape '"+_shape+"' has been successfully set up." ;
                 _glob_storage['srcptset']['shape'] = _shape ;
                 switch( _shape )
                 {
                    case "circle":
                    case "disk":
                    _glob_storage['srcptset']['center'] = _params_assoc_array['center'] ;
                    _glob_storage['srcptset']['radius'] = _params_assoc_array['radius'] ;
                    break ;
                    case "line":
                    _glob_storage['srcptset']['start_pt'] = _params_assoc_array['start_pt'] ;
                    _glob_storage['srcptset']['end_pt'] = _params_assoc_array['end_pt'] ;
                    break ;
                    case "rect":
                    _glob_storage['srcptset']['center'] = _params_assoc_array['center'] ;
                    _glob_storage['srcptset']['width'] = _params_assoc_array['width'] ;
                    _glob_storage['srcptset']['height'] = _params_assoc_array['height'] ;
                    break ;
                    default: break ;
                 }

                 circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
               }
               break ;
               case "word":
               var _input_word = _params_assoc_array['word'] ;
               if ( _glob_storage['srcptset'] == null )
               circles_lib_output( _output_channel, DISPATCH_WARNING, "Cannot set up the word, because no initialization has been made.", _par_1, _cmd_tag );
               else
               {
                 if ( _glob_alphabet.length == 0 )
                 {
                    _glob_storage['srcptset']['word'] = "" ;
                    var _msg = "Cannot input the word '"+_input_word+"': missing registered group and no alphabet available." ;
                        _msg += "\nThe latter is required for check consistenceo of the input word" ;
                    circles_lib_output( _output_channel, DISPATCH_ERROR, _msg, _par_1, _cmd_tag );
                 }
                 else if ( _input_word.length == 0 )
                 circles_lib_output( _output_channel, DISPATCH_ERROR, "The input word is empty", _par_1, _cmd_tag );
                 else if ( _input_word.length > 0 )
                 {
                   var _b_check_word = circles_lib_word_check( _input_word, _glob_alphabet );
                   if ( _b_check_word )
                   {
                     var _msg = "The word '"+_input_word+"' has been set with success." ;
                     _glob_storage['srcptset']['word'] = _input_word ;
                     circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                   }
                   else
                   {
                     _glob_storage['srcptset']['word'] = "" ;
                     circles_lib_output( _output_channel, DISPATCH_ERROR, "Cannot input the word '"+_input_word+"':\nit does not match the current alphabet {"+_glob_alphabet.join( "," )+"}", _par_1, _cmd_tag );
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

     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}