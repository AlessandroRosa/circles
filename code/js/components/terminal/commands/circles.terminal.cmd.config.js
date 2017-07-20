_glob_terminal_cmd_files_include['config'] = [ 'init', 'refresh' ];

function circles_terminal_cmd_config()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose )
     circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode by '"+_caller_id+"' )</slategray>", _par_1, _cmd_tag );

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var Y = "yes", N = "no" ;

     var _params_assoc_array = [];
         _params_assoc_array['params'] = [] ;
         _params_assoc_array['group'] = "" ;
     var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;

     var _keywords = [ 'accuracy', 'automaton', 'canvasmode', 'circle', 'construction', 'depth', 'diskdash', 'diskdraw', 'diskfill',
                       'drawentity', 'fixedpoint', 'gens', 'init', 'interface', 'items', 'mapprecision', 'menu', 'method', 'os',
                       'pixel', 'plugin', 'point', 'save', 'html', 'help', 'release',
                       'terminal', 'title', 'usepalette', 'warnings' ] ;
     var _readonly = [ 'gens', 'init', 'method', 'os', 'plugin', 'terminal' ] ;
     var _groups = [ "generals", "graphix", "rendering", "terminal" ] ;
     var _adds = [ "seeds", "byref", "byval" ] ;

         _params_assoc_array['help'] = NO ;
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;

         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array = _keywords.concat( _readonly ).concat( _groups ).concat( _adds );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );

 		 var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
   		   _params_assoc_array['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
   		   _params_assoc_array['dump_array'] = [];
    		 _params_assoc_array['dump_operator_index'] = _dump_operator_index ;

	 		  _params_assoc_array['transfer_to'] = ( _params_array.indexOf( TERMINAL_TRANSFER_TO_OPERATOR ) != UNFOUND ) ? YES : NO ;
	 		  _params_assoc_array['transfer_from'] = ( _params_array.indexOf( TERMINAL_TRANSFER_FROM_OPERATOR ) != UNFOUND ) ? YES : NO ;

			  // gather all dump parameters into one array
        if ( _params_assoc_array['dump'] )
        {
  				 for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
  				 if ( _params_array[_i].trim().length > 0 ) _params_assoc_array['dump_array'].push( _params_array[_i] );
        }

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         var _p, _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
             _p = _params_array[_i] ;
             if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
             else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
             else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
             else if ( _p.is_one_of_i( "get", "keywords", "save", "set", "release" ) )
             {
                 if ( _p.stricmp( "save" ) ) _params_assoc_array['dump'] = YES ;
                 _params_assoc_array['action'] = _p.toLowerCase() ;
             }
             else if ( _p.is_one_of_i( "rendering", "generals", "terminal", "graphix", "all" ) ) _params_assoc_array['group'] = _p ;
             else if ( _params_assoc_array['action'] != null )
             {
                 if ( _params_assoc_array['action'].is_one_of( "get", "set" ) )
                 _params_assoc_array['params'].push( _p );
             }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
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
     else if ( !_b_fail && !is_string( _params_assoc_array['action'] ) )
     {
       if ( _params_assoc_array['group'].length == 0 ) _params_assoc_array['group'] = "all" ;
			 if ( !_params_assoc_array['help'] )
       {
           var _method = circles_lib_method_get_def( _glob_method ).toLowerCase();
           var _row_array = [];
               _row_array.push( "<lightblue>Config parameters list</lightblue>", _par_1, _cmd_tag );
  
           if ( _params_assoc_array['group'].is_one_of( "all", "generals" ) )
           {
              _row_array.push( "<banana>Generals</banana>" );
              _row_array.push( "<lavender>operating system</lavender> <skyblue>" + get_os() + "</skyblue>" );
              _row_array.push( "<lavender>title</lavender> <skyblue>" + ( _glob_title.length == 0 ? "untitled" : _glob_title ) + "</gray>" );
  
              var _menu =  $("#CIRCLEScheckboxMENU").is( ":checked" ) ? YES : NO ;
              _row_array.push( "<lavender>top menu</lavender> <skyblue>" + ( _menu ? "visible" : "hidden" ) + "</gray>" );
              if ( _plugin_last_ref != 0 )
              {
                  var _plugin_def = _plugin_definitions_array[ _plugin_last_ref ], _max = 20 ;
                  _row_array.push( "<lavender>Plug-in</lavender> <skyblue>" + _plugin_def.left( _max ) + ( _plugin_def.length > _max ? " ..." : "" ) + "</skyblue>" );
              }
           }

           if ( _params_assoc_array['group'].is_one_of( "all", "rendering" ) )
           {
                   _row_array.push( "<banana>Rendering</banana>" );
                   _row_array.push( "<lavender>method</lavender> " + ( _method.strcmp( "unknown" ) ? "<gray>"+_method+"</gray>" : "<skyblue>"+_method+"</skyblue>" ) );
                   _row_array.push( "<lavender>process</lavender> " + ( _glob_process == PROCESS_NONE ? "<gray>none</gray>" : "<skyblue>"+circles_lib_process_get_def( _glob_process )+"</skyblue>" ) );
                   _row_array.push( "<lavender>using automaton</lavender> " + ( _glob_using_automaton ? "<greenshock>yes</greenshock>" : "<gray>no</gray>" ) );
                   _row_array.push( "<lavender>fixed points input/output</lavender> " + ( _glob_fixedpt_io == FIXEDPOINTS_IO_NONE ? "<gray>none</gray>" : "<skyblue>"+circles_lib_fixedpoints_io_get_def( _glob_fixedpt_io )+"</skyblue>" ) );
                   _row_array.push( "<lavender>depth</lavender> <skyblue>" + _glob_depth + "</skyblue>" );
  
                   var _append = ( _glob_disk_threshold_operator.length > 0 ) ? " (threshold radius "+_glob_disk_threshold_operator+" "+_glob_disk_threshold_radius+")" : "" ;
                   switch( _glob_construction_mode )
                   {
                        case CONSTRUCTION_TILING: _row_array.push( "<lavender>construction</lavender> <skyblue>tiling</skyblue>" + _append ); break ;
                        case CONSTRUCTION_LIMITSET: _row_array.push( "<lavender>construction</lavender> <skyblue>limit set</skyblue>" + _append ); break ;
                        default: _row_array.push( "<lavender>construction</lavender> <gray>unknown</gray>" ); break ;
                   }
  
                   switch( _glob_items_switch )
                   {
                        case ITEMS_SWITCH_SEEDS: _row_array.push( "<lavender>items</lavender> <skyblue>seeds</skyblue>" ); break ;
                        case ITEMS_SWITCH_GENS: _row_array.push( "<lavender>items</lavender> <skyblue>gens</skyblue>" ); break ;
                        default: _row_array.push( "<lavender>items</lavender> <gray>unknown</gray>" ); break ;
                   }
  
                   _row_array.push( "<lavender>gens to init</lavender> <skyblue>" + ( _glob_items_to_init ? Y : N ) + "</skyblue>" );
                   _row_array.push( "<lavender>accuracy</lavender> <skyblue>10E(" + (-_glob_accuracy) + ")</skyblue>" );
  
                   var _init_from = "", _init_paired = "" ;
                   if ( _glob_init_mask & INIT_FROM_DISKS ) _init_from = "disks" ;
                   else if ( _glob_init_mask & INIT_FROM_MAPS ) _init_from = "disks" ;
                   if ( _glob_init_mask & INIT_SINGLE_ITEMS ) _init_paired = "no" ;
                   else if ( _glob_init_mask & INIT_PAIRED_ITEMS ) _init_paired = "yes" ;
  
                   _row_array.push( "<lavender>init options</lavender> >> compute from <skyblue>"+_init_from+"</skyblue> | paired elements <skyblue>"+_init_paired+"</skyblue>" );
           }
  
           if ( _params_assoc_array['group'].is_one_of( "all", "terminal" ) )
           {
                   _row_array.push( "<banana>Terminal</banana>" );
                   _row_array.push( "<lavender>show warnings</lavender> <skyblue>" + ( _glob_terminal_warnings_switch ? "on" : "off" ) + "</skyblue>" );
                   switch( _glob_output_channel )
                   {
                        case OUTPUT_SCREEN: _row_array.push( "<lavender>Current output</lavender> <skyblue>screen</skyblue>" ); break ;
                        case OUTPUT_TERMINAL: _row_array.push( "<lavender>Current output</lavender> <skyblue>console</skyblue>" ); break ;
                        case OUTPUT_SCRIPT: _row_array.push( "<lavender>Current output</lavender> <skyblue>batch script compiler</skyblue>" ); break ;
                        case OUTPUT_HELP: _row_array.push( "<lavender>Current output</lavender> <skyblue>help</skyblue>" ); break ;
                        default: _row_array.push( "<lavender>Current output</lavender> <gray>unknown</gray>" ); break ;
                   }
           }
  
           if ( _params_assoc_array['group'].is_one_of( "all", "graphix" ) )
           {
          				 var _smpr_perc = safe_int( _glob_smpr / _glob_zplane_rendering_canvas_placeholder.get_width() * 100.0, 1 );
                   _row_array.push( "<banana>Graphix</banana>" );
                   _row_array.push( "<lavender>disk dashed border (non-Z-planes)</lavender> <skyblue>" + ( _glob_activate_dashed_border ? Y : N ) + "</skyblue>" );
                   _row_array.push( "<lavender>use palette</lavender> <skyblue>" + ( _glob_palette_use ? Y : N ) + "</skyblue>" );
                   _row_array.push( "<lavender>draw entity</lavender> <skyblue>" + circles_lib_drawentity_get_def( _glob_drawentity ) + "</skyblue>" );
                   _row_array.push( "<lavender>disk draw (W-plane)</lavender> <skyblue>" + ( _glob_wplane_disk_draw ? Y : N ) + "</skyblue>" );
                   _row_array.push( "<lavender>disk fill (W-plane)</lavender> <skyblue>" + ( _glob_wplane_disk_fill ? Y : N ) + "</skyblue>" );
                   _row_array.push( "<lavender>Map draw precision</lavender> <skyblue>" + _smpr_perc + "%</skyblue>" );
  
                   switch( _glob_src_canvas_mode )
                   {
                        case ZPLANE_CANVAS_CIRCLESDRAW_MODE: _row_array.push( "<lavender>canvas mode</lavender> <skyblue>circlesdraw</skyblue>" ); break ;
                        default: _row_array.push( "<lavender>canvas mode</lavender> <gray>unknown</gray>" ); break ;
                   }
           }
  
           var _config_str = _row_array.join( _glob_crlf );
               _out_text_string = _config_str ;
  
           var _html = _params_assoc_array['html'] ;
  
           if ( _html ) circles_lib_terminal_color_decode_htmltext( _config_str, 'config', 'right', 'top' );
           else circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _config_str, _par_1, _cmd_tag );
  
           if ( _params_assoc_array['dump'] )
           {
               _config_str = _config_str.replaceAll( "</lavender>", " : " );
               _config_str = _config_str.strip_tags();
           		 _params_assoc_array['dump_array'] = is_array( _params_assoc_array['dump_array'] ) ? _params_assoc_array['dump_array'][0] : "circles.config.txt" ;
               var _ret_chunk = circles_lib_dump_data_to_format( _config_str, _params_assoc_array['dump_array'] );
  						 var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
  						 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation";
  						 if ( _ret_id == 0 )
  						 {
  						 		_b_fail = YES, _error_str = _ret_msg ;
  						 }
  						 else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
           }
       }
     }
     else if ( is_string( _params_assoc_array['action'] ) )
     {
           var _action = _params_assoc_array['action'] ;
           switch( _action )
           {
                case "keywords":
                var _cols = 6 ;
                var _colors = [ "cadetblue", "lightblue", "snow" ] ;
                var _MSG = "<yellow>Read/write keywords to get/set</yellow> <snow>values via config cmd:</snow>" + _glob_crlf ;
                var _runner = 0 ;
                for( var _i = 0 ; _i < _keywords.length ; _i++ )
                {
                    if ( !_readonly.includes( _keywords[_i] ) )
                    {
                        _runner++ ;
                        _MSG += "<"+_colors[_i%_colors.length]+">" + _keywords[_i] + "</"+_colors[_i%_colors.length]+">  "  ;
                        if ( _i != 0 && _runner % _cols == 0 )
                        {
                            _MSG += "" + _glob_crlf ;
                            _runner = 0 ;
                        }
                    }
                }
  
                _colors = [ "orange", "salmon" ] ;
                _MSG += "\n\n<yellow>Read-only keywords</yellow> <snow>to get values via config cmd:</snow>" + _glob_crlf ;
                _runner = 0 ;
                for( var _i = 0 ; _i < _readonly.length ; _i++ )
                {
                     _runner++ ;
                     _MSG += "<"+_colors[_i%_colors.length]+">" + _readonly[_i] + "</"+_colors[_i%_colors.length]+">  "  ;
                     if ( _i != 0 && _runner % _cols == 0 )
                     {
                        _MSG += "" + _glob_crlf ;
                        _runner = 0 ;
                     }
                }
  
                _out_text_string = _MSG ;
  
                if ( _params_assoc_array['html'] ) circles_lib_output( _out_channel, DISPATCH_INFO, LANG_MSG_00, _par_1, _cmd_tag );
                _params_assoc_array['html'] ? circles_lib_terminal_color_decode_htmltext( _MSG ) : circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _MSG, _par_1, _cmd_tag );
                break ;
                case "get":
                if ( _params_assoc_array['params'].length == 0 )
                {
    						 		_b_fail = YES, _error_str = "Please, enter at least one param to get" ;
                }
                else
                {
                    var _param = "", _outlabel = "", _outval = "" ;
                    for( var _k = 0 ; _k < _params_assoc_array['params'].length ; _k++ )
                    {
                         _param = _params_assoc_array['params'][_k] ;
                         if ( _keywords.includes( _param ) )
                         {
                             switch( _param )
                             {
                                  case "accuracy":
                                  _outlabel = "Accuracy" ;
                                  _outval = "10E" + ( -_glob_accuracy );
                                  break ;
                                  case "automaton":
                                  _outlabel = "Using automaton" ;
                                  _outval = _glob_using_automaton ? "<greenshock>yes</greenshock>" : "<gray>no</gray>" ;
                                  break ;
                                  case "canvasmode":
                                  _outlabel = "Canvas mode" ;
                                  switch( _glob_src_canvas_mode )
                                  {
                                       case ZPLANE_CANVAS_CIRCLESDRAW_MODE: _outval = "circlesdraw" ; break ;
                                       default: _outval = "unknown" ; break ;
                                  }
                                  break ;
                                  case "construction":
                                  _outlabel = "Rendering construction" ;
                                  _outval = circles_lib_construction_mode_get_def( _glob_construction_mode );
  
                                  if ( _glob_disk_threshold_operator.length > 0 )
                                  _outval += " (threshold radius "+_glob_disk_threshold_operator+" "+_glob_disk_threshold_radius+")" ;
                                  break ;
                                  case "depth":
                                  _outlabel = "Rendering depth" ;
                                  _outval = _glob_depth ;
                                  break ;
                                  case "diskdash":
                                  _outlabel = "Disk dash border" ;
                                  _outval = _glob_activate_dashed_border ? Y : N ;
                                  break ;
                                  case "diskdraw":
                                  _outlabel = "Disk draw (W-plane)" ;
                                  _outval = _glob_wplane_disk_draw ? Y : N ;
                                  break ;
                                  case "diskfill":
                                  _outlabel = "Disk fill (W-plane)" ;
                                  _outval = _glob_wplane_disk_fill ? Y : N ;
                                  break ;
                                  case "drawentity":
                                  _outlabel = "Rendered items are drawn by" ;
                                  _outval = circles_lib_drawentity_get_def( _glob_drawentity );
                                  break ;
                                  case "fixedpoints":
                                  _outlabel = "Fixed points" ;
                                  _outval = circles_lib_fixedpoints_io_get_def( _glob_fixedpt_io );
                                  break ;
                                  case "gens":
                                  _outlabel = "Generators to init" ;
                                  _outval = _glob_items_to_init ? Y : N ;
                                  break ;
                                  case "items":
                                  _outlabel = "Selected items options" ;
                                  var _out_array = [];
                                  if ( _glob_items_switch == ITEM_NONE ) _out_array.push( "no options" );
                                  else
                                  {
                                      if ( _glob_items_switch == ITEMS_SWITCH_SEEDS ) _out_array.push( "seeds" );
                                      else if ( _glob_items_switch == ITEMS_SWITCH_GENS ) _out_array.push( "gens" );
      
                                      if ( _glob_items_switch & ITEM_BYREF ) _out_array.push( "byref" );
                                      else if ( _glob_items_switch & ITEM_BYVAL ) _out_array.push( "byval" );
                                  }
                                  
                                  _outval = _out_array.join( ", " );
                                  break ;
                                  case "os":
                                  _outlabel = "Operating system" ;
                                  _outval = get_os();
                                  break ;
                                  case "mapprecision":
                         				  var _smpr_perc = safe_int( _glob_smpr / _glob_zplane_rendering_canvas_placeholder.get_width() * 100.0, 1 );
                                  _outlabel = "Map precision" ;
                                  _outval = _smpr_perc + "%" ;
                                  break ;
                                  case "menu":
                                  _outlabel = "Top menu" ;
                                  var _menu =  $("#CIRCLEScheckboxMENU").is( ":checked" ) ? YES : NO ;
                                  _outval = ( _menu ) ? "Visible" : "Hidden" ;
                                  break ;
                                  case "method":
                                  _outlabel = "Method" ;
                                  _outval = circles_lib_method_get_def( _glob_method ).toLowerCase();
                                  break ;
                                  case "usepalette":
                                  _outlabel = "Use palette" ;
                                  _outval = _glob_palette_use ? Y : N ;
                                  break ;
                                  case "plugin":
                                  _outlabel = "Last plug-in" ;
                                  _outval = ( _plugin_last_ref != 0 ) ? _plugin_definitions_array[ parseFloat( _plugin_last_ref ).toFixed( 2 ) ] : "unknown" ;
                                  break ;
                                  case "terminal":
                                  _outlabel = "Terminal output" ;
                                  switch( _glob_output_channel )
                                  {
                                      case OUTPUT_SCREEN: _outval = "screen" ; break ;
                                      case OUTPUT_TERMINAL: _outval = "console" ; break ;
                                      case OUTPUT_SCRIPT: _outval = "batch script compiler" ; break ;
                                      case OUTPUT_HELP: _outval = "help" ; break ;
                                      default: _outval = "unknown" ; break ;
                                  }
                                  break ;
                                  case "title":
                                  _outlabel = "Title" ;
                                  _outval = _glob_title.length == 0 ? "untitled" : _glob_title ;
                                  break ;
                                  case "warnings":
                                  _outlabel = "show warnings (terminal)" ;
                                  _outval = _glob_terminal_warnings_switch ? Y : N ;
                                  break ;
													        default: break ;
                             }
  
                             circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightblue>"+_outlabel+"</lightblue> "+( _outval.includes( "</" ) ? _outval : "<snow>" + _outval + "</snow>" ), _par_1, _cmd_tag );
                         }
                         else circles_lib_output( _out_channel, DISPATCH_WARNING, "Unknown param '"+_p+"'", _par_1, _cmd_tag );
                    }
                }
                break ;
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "save":
                var _config_list = circles_lib_config_list_generate();
                if ( _params_assoc_array['dump'] )
                {
                    if ( is_array( _params_assoc_array['dump_array'] ) ) _params_assoc_array['dump_array'].push( "circles.config.list.txt" );
      							var _ret_chunk = circles_lib_dump_data_to_format( _config_list, _params_assoc_array['dump_array'][0] );
  									var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
  									var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
  									if ( _ret_id == 0 )
  									{
  											_b_fail = YES, _error_str = _ret_msg ;
  									}
  									else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                }
                else circles_lib_output( _out_channel, DISPATCH_INFO, _config_list, _par_1, _cmd_tag );
                break ;
                case "set":
                if ( _params_assoc_array['params'].length == 0 )
                {
    						 		_b_fail = YES, _error_str = "Please, enter one param to set" ;
                }
                else if ( _params_assoc_array['params'].length == 1 )
                {
    						 		_b_fail = YES, _error_str = "Incomplete set syntax" ;
                }
                else
                {
                    var _resp = [], _param = _params_assoc_array['params'][0], _value = _params_assoc_array['params'][1] ;
  
                    if ( _readonly.includes( _param ) )
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<orange>Param '"+_param+"' is read-only here.</orange>\n<gray>Use specific command '"+_param+"' instead.</gray>", _par_1, _cmd_tag );
                    else if ( _keywords.includes( _param ) )
                    {
                        if ( _param.strcmp( "accuracy" ) )
                        {
                            if ( _value.strcmp( "reset" ) )
                            {
                                _glob_accuracy = DEFAULT_MAX_ACCURACY ;
                                _resp = [ 1, "<greenshock>Accuracy reset to default value " + _glob_accuracy + "</greenshock>" ] ;
                            }
                            else if ( _value.testME( _glob_positive_integer_regex_pattern ) )
                            {
                                _glob_accuracy = safe_int( _value, DEFAULT_MAX_ACCURACY );
                                _resp = [ 1, "<greenshock>Accuracy is " + _glob_accuracy + "</greenshock>" ] ;
                            }
                            else
                            {
                                _resp = [ 0, "<orange>Fail to set accuracy to '" + _value + "'</orange>" ] ;
                                if ( _glob_verbose )
                                _resp[1] += "\n<gray>The input accuracy value shall be a positive integer</gray>" ;
                            }
                        }
  
                        if ( _param.strcmp( "canvasmode" ) )
                        {
                            if ( _value.strcmp( "circlesdraw" ) ) _glob_src_canvas_mode = ZPLANE_CANVAS_CIRCLESDRAW_MODE ;
                            else _glob_src_canvas_mode = ZPLANE_CANVAS_NULL_MODE ;
  
                            if ( _glob_src_canvas_mode == ZPLANE_CANVAS_NULL_MODE ) _resp = [ 0, "<orange>Failure: input canvas mode is unknown</orange>" ] ;
                            else _resp = [ 1, "<greenshock>Canvasmode is "+_value+"</greenshock>" ] ;
                        }
  
                        if ( _param.strcmp( "fixedpoints" ) )
                        {
                            if ( _value.strcmp( "input" ) )
                            {
                                _glob_fixedpt_io = FIXEDPOINTS_IO_INPUT;
                                _resp = [ 1, "<greenshock>Fixed point i/o is 'fixed point' now</greenshock>" ] ;
                            }
                        }
  
                        if ( _param.strcmp( "construction" ) )
                        {
                            if ( _value.strcmp( "limitset" ) )
                            {
                                circles_lib_construction_mode_set( CONSTRUCTION_LIMITSET );
                                _resp = [ 1, "<greenshock>Construction is limitset now</greenshock>" ] ;
                            }
                            else if ( _value.strcmp( "tiling" ) )
                            {
                                circles_lib_construction_mode_set( CONSTRUCTION_TILING );
                                _resp = [ 1, "<greenshock>Construction is tiling now</greenshock>" ] ;
                            }
  
                            for( var _d = 2 ; _d < _params_assoc_array['params'].length ; _d++ )
                            {
                                if ( _d == 2 ) _params_assoc_array['operator'] = _params_assoc_array['params'][_d] ;
                                else if ( _d == 3 ) _params_assoc_array['diskthresholdradius']  = _params_assoc_array['params'][_d] ;
                            }
  
                            var _mask = 0 ;
                            var _op = ( _params_assoc_array['operator'] != null ) ? _params_assoc_array['operator'] : "" ;
                            var _th = ( _params_assoc_array['diskthresholdradius'] != null ) ? _params_assoc_array['diskthresholdradius'] : "" ;
  
                            if ( _op.length > 0 ) _mask++ ;
                            if ( _th.length > 0 ) _mask++ ;
                            if ( _op.strcmp( "reset" ) )
                            {
                                _resp = [ 1, "Threshold has been disabled" ] ;
                                _glob_disk_threshold_radius = 0 ;
                                _glob_disk_threshold_operator = "" ;
                            }
                            else if ( !_mask.is_one_of( 0, 2 ) )
                            {
                               _resp = [ 0, "Incomplete assignment syntax for threshold disk radius" ] ;
                               _glob_disk_threshold_radius = 0 ;
                               _glob_disk_threshold_operator = "" ;
                            }
                            else if ( _mask == 2 )
                            {
                                if ( !_op.testME( "^<|>|=$" ) )
                                {
                                   _resp = [ 0, "Incoherent comparison operator '"+_op+"'" ] ;
                                   _glob_disk_threshold_radius = 0 ;
                                   _glob_disk_threshold_operator = "" ;
                                }
                                else if ( !_th.testME( _glob_positive_float_regex_pattern ) )
                                {
                                   _resp = [ 0, "Incoherent threshold value '"+_th+"'" ] ;
                                   _b_fail = YES ;
                                   _glob_disk_threshold_radius = 0 ;
                                   _glob_disk_threshold_operator = "" ;
                                }
                                else
                                {
                                   _glob_disk_threshold_operator = _op ;
                                   _glob_disk_threshold_radius = _th ;
                                   if ( _glob_disk_threshold_radius > 0 && _glob_disk_threshold_operator.length > 0 )
                                   {
                                        if ( _op == "<" ) _op = "less than" ;
                                        else if ( _op == "=" ) _op = "equal to" ;
                                        else if ( _op == ">" ) _op = "greater than" ;
  
                                        _msg = "<greenshock>Threshold disk radius is " + _op + " " + _glob_disk_threshold_radius + "</greenshock>" ;
                                        _resp = [ 1, _msg ] ;
                                   }
  
                                   circles_lib_menu_entries_update();
                                }
                            }
                        }
  
                        if ( _param.strcmp( "depth" ) )
                        {
                            if ( _value.testME( _glob_positive_integer_regex_pattern ) )
                            {
                                circles_lib_depth_set( _value )
                                _resp = [ 1, "<greenshock>Depth is " + _glob_depth + "</greenshock>" ] ;
                            }
                            else
                            {
                                _resp = [ 0, "<orange>Fail to set depth to '" + _value + "'</orange>" ] ;
                                if ( _glob_verbose )
                                _resp[1] += "\n<gray>The input depth value shall be a positive integer</gray>" ;
                            }
                        }
  
                        if ( _param.strcmp( "diskdash" ) )
                        {
                            if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                _glob_activate_dashed_border = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = ( _value.is_one_of( "yes", "y" ) ? "yes" : ( _value.is_one_of( "no", "n" ) ? "no" : "???" ) );
                                _resp = [ 1, "<greenshock>Disk dashed border use is '" + _value + "'</greenshock>" ] ;
                            }
                            else
                            {
                                _resp = [ 0, "<orange>Fail to set param 'diskdash' to '" + _value + "'</orange>" ] ;
                                if ( _glob_verbose )
                                _resp[1] += "\n<gray>The input value should be 'yes' or 'no'</gray>" ;
                            }
                        }
  
                        if ( _param.strcmp( "diskdraw" ) )
                        {
                            if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                _glob_wplane_disk_draw = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = ( _value.is_one_of( "yes", "y" ) ? "yes" : ( _value.is_one_of( "no", "n" ) ? "no" : "???" ) );
                                _resp = [ 1, "<greenshock>Disk draw (W-plane) has been set to '" + _value + "'</greenshock>" ] ;
                            }
                            else
                            {
                                _resp = [ 0, "<orange>Fail to set param 'diskdraw' to '" + _value + "'</orange>" ] ;
                                if ( _glob_verbose )
                                _resp[1] += "\n<gray>The input value should be 'yes' or 'no'</gray>" ;
                            }
                        }
  
                        if ( _param.strcmp( "diskfill" ) )
                        {
                            if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                _glob_wplane_disk_fill = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = ( _value.is_one_of( "yes", "y" ) ? "yes" : ( _value.is_one_of( "no", "n" ) ? "no" : "???" ) );
                                _resp = [ 1, "<greenshock>Disk fill (W-plane) is '" + _value + "'</greenshock>" ] ;
                            }
                            else
                            {
                                _resp = [ 0, "<orange>Fail to set param 'diskfill' to '" + _value + "'</orange>" ] ;
                                if ( _glob_verbose )
                                _resp[1] += "\n<gray>The input value should be 'yes' or 'no'</gray>" ;
                            }
                        }
  
                        if ( _param.strcmp( "drawentity" ) )
                        {
                            var _d, _p, _MSG ;
                            for( _d = 1 ; _d < _params_assoc_array['params'].length ; _d++ )
                            {
                                _p = _params_assoc_array['params'][_d] ;
                                if ( _p.stricmp( DRAWENTITY_ISOMETRIC_CIRCLE_CMD ) ) _p = DRAWENTITY_ISOMETRIC_CIRCLE ;
                                else if ( _p.stricmp( DRAWENTITY_INVERSION_CIRCLE_CMD ) ) _p = DRAWENTITY_INVERSION_CIRCLE ;
                                else if ( _p.stricmp( DRAWENTITY_POINT_CMD ) ) _p = DRAWENTITY_POINT ;
                                else if ( _p.stricmp( DRAWENTITY_PIXEL_CMD ) ) _p = DRAWENTITY_PIXEL ;
  
                                if ( _p.is_one_of( DRAWENTITY_ISOMETRIC_CIRCLE, DRAWENTITY_INVERSION_CIRCLE, DRAWENTITY_POINT, DRAWENTITY_PIXEL ) )
                                {
                                    _glob_drawentity = _params_assoc_array['drawentity'] = _p ;
                                    _resp = [ 1, "<greenshock>Draw entity is now</greenshock> <snow>" + circles_lib_drawentity_get_def( _glob_drawentity ) + "</snow>" ] ;
                                }
                                
                                if ( _value.stricmp( DRAWENTITY_PIXEL_CMD ) )
                                {
                                     if ( _d == 2 )
                                     {
                                         _glob_pixel_size = safe_int( _p, 1 );
                                         if ( _glob_pixel_size < 0 )
                                         {
                                             _glob_pixel_size = 1 ;
                                             var _MSG = "Incorrect value: reset to " + _glob_pixel_size ;
                                             _resp = [ 0, _MSG ] ;
                                         }
                                     }
                                     
                                     circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Pixel size is now " + _glob_pixel_size, _par_1, _cmd_tag );
                                }
                            }
  
                            if ( !_resp[0] && _glob_verbose )
                            {
                                 _resp[1] += "\n<gray>The input value should be set to one of the following values:</gray>" ;
                                 _resp[1] += "\n<snow>"+DRAWENTITY_ISOMETRIC_CIRCLE+" "+DRAWENTITY_POINT+" "+DRAWENTITY_PIXEL+" "+DRAWENTITY_PIXEL+" "+DRAWENTITY_POLYLINE+"</snow>" ;
                            }
                        }
  
                        if ( _param.strcmp( "interface" ) )
                        {
                            if ( !_value.testME( "^default$" ) )
                            {
                                _resp = [ 0, "<orange>Inconsistent input value '" + _value + "'</orange>" ] ;
                                if ( _glob_verbose ) _resp[1] += "\n<gray>The input value should be 'default'</gray>" ;
                            }
                            else
                            {
                                if ( _value.strcmp( "default" ) ) { _glob_interface_index = INTERFACE_DEFAULT ; circles_lib_interface_default(); }
                                _resp = [ 1, "<greenshock>Interface layout has been correctly set to '" + _value + "'</greenshock>" ] ;
                            }
                        }
  
                        if ( _param.strcmp( "items" ) )
                        {
                            if ( !_value.testME( "^seeds|gens$" ) )
                            {
                                _resp = [ 0, "<orange>Inconsistent input value '" + _value + "'</orange>" ] ;
                                if ( _glob_verbose )
                                _resp[1] += "\n<gray>The input value should be 'seeds' or 'gens'</gray>" ;
                            }
                            else
                            {
                                _glob_items_switch = ITEM_NONE ;
                                if ( _value.strcmp( "seeds" ) ) _glob_items_switch |= ITEMS_SWITCH_SEEDS ;
                                else if ( _value.strcmp( "gens" ) ) _glob_items_switch |= ITEMS_SWITCH_GENS ;
  
                                if ( _params_assoc_array['params'].includes( "byref" ) ) _glob_items_switch |= ITEM_BYREF ;
                                else if ( _params_assoc_array['params'].includes( "byval" ) ) _glob_items_switch |= ITEM_BYVAL ;
  
                                var _resume_params_array = [];
                                if ( _glob_items_switch == INIT_NONE ) _resume_params_array.push( "No input params." );
                                if ( _glob_items_switch == ITEMS_SWITCH_SEEDS ) _resume_params_array.push( "Seeds" );
                                else if ( _glob_items_switch & INIT_GENERATORS ) _resume_params_array.push( "Generators" );
  
                                if ( _glob_items_switch & ITEM_BYREF ) _resume_params_array.push( "by reference" );
                                else if ( _glob_items_switch & ITEM_BYVAL ) _resume_params_array.push( "by value" );
  
                                var _ret_chunk = circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_silent, _out_channel );
         										    var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
       												  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to dump value" ;
                                _resp = [ _ret_id, _ret_id ? "<greenshock>Items switch params have been correctly set to '" + _resume_params_array.join( "," ) + "'</greenshock>" : "<red>"+_ret_msg+"</red>" ] ;
                            }
                        }
  
                        if ( _param.strcmp( "mapprecision" ) )
                        {
                            if ( _value.testME( _glob_percentage_regex_pattern ) )
                            {
                                _value = safe_float( _value, 0 );
                                if ( _value.ranges_in( 1, 100, YES ) )
                                {
                                   _glob_smpr = _value * _glob_zplane_rendering_canvas_placeholder.get_width() / 100.0 ;
                                   _resp = [ 1, "<lime>Map draw precision is " + _value + "%</lime>" ] ;
                                }
                                else _resp = [ 0, "<orange>Input value must range from 1 to 100 %.</orange>" ] ;
                            }
                            else _resp = [ 0, "<orange>Syntax error: input value isn't of percentage type.</orange>" ] ;
                        }
  
                        if ( _param.strcmp( "menu" ) )
                        {
                            if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                var _menu = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = ( _value.is_one_of( "yes", "y" ) ? "visible" : ( _value.is_one_of( "no", "n" ) ? "hidden" : "???" ) );
                                $("#CIRCLEScheckboxMENU").prop( ":checked", ( _menu ) ? YES : NO );
                                circles_lib_menu_show_top( _out_channel );
                                _resp = [ 1, "<greenshock>Top menu is '" + _value + "'</greenshock>" ] ;
                            }
                            else
                            {
                                _resp = [ 0, "<orange>Fail to set param 'menu' to '" + _value + "'</orange>" ] ;
                                if ( _glob_verbose )
                                _resp[1] += "\n<gray>The input value should be 'yes' or 'no'</gray>" ;
                            }
                        }
  
                        if ( _param.strcmp( "title" ) )
                        {
                        		_value = _params_assoc_array['params'].from_to( 1, _params_assoc_array['params'].length ).join( " " ) ;
                            if ( _value.testME( _glob_illegalchars_regex_pattern ) )
                            {
                                _resp = [ 0, "<orange>Illegal chars found: fail to set param 'title' to '" + _value + "'</orange>" ] ;
                                if ( _glob_verbose ) _resp[1] += "\n<gray>Only alphanumeric chars are allowed.</gray>" ;
                            }
                            else
                            {
                                _glob_title = _value ;
                                _resp = [ 1, "<greenshock>Current configuration title is '" + _value + "'</greenshock>" ] ;
                            }
                        }
  
                        if ( _param.strcmp( "usepalette" ) )
                        {
                            if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                _glob_palette_use = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = ( _value.is_one_of( "yes", "y" ) ? "yes" : ( _value.is_one_of( "no", "n" ) ? "no" : "???" ) );
                                _resp = [ 1, "<greenshock>Palette use is '" + _value + "'</greenshock>" ] ;
                            }
                            else
                            {
                                _resp = [ 0, "<orange>Fail to set param 'usepalette' to '" + _value + "'</orange>" ] ;
                                if ( _glob_verbose )
                                _resp[1] += "\n<gray>The input value should be 'yes' or 'no'</gray>" ;
                            }
                        }
  
                        if ( _param.strcmp( "warnings" ) )
                        {
                            if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                _glob_terminal_warnings_switch = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = ( _value.is_one_of( "yes", "y" ) ? "yes" : ( _value.is_one_of( "no", "n" ) ? "no" : "???" ) );
                                _resp = [ 1, "<greenshock>Terminal warning switch has been set to '" + _value + "'</greenshock>" ] ;
                            }
                            else
                            {
                                _resp = [ 0, "<orange>Fail to set param 'warnings' to '" + _value + "'</orange>" ] ;
                                if ( _glob_verbose ) _resp[1] += "\n<gray>The input value should be 'yes' or 'no'</gray>" ;
                            }
                        }
  
                        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _resp[1], _par_1, _cmd_tag );
                        if ( circles_lib_terminal_batch_script_exists() && _glob_verbose && _out_channel == OUTPUT_TERMINAL )
             						{
           									_glob_terminal_change = YES ;
           	                circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
           							}
                    }
                    else circles_lib_output( _out_channel, DISPATCH_WARNING, "Param '"+_param+"' is unknown", _par_1, _cmd_tag );
                }
                break ;
				        default: break ;
           }
     }

     if ( _b_fail && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}