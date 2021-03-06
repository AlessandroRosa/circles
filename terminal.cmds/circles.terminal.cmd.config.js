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

    if ( _glob_verbose && _glob_terminal_echo_flag )
    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

	var _last_release_date = get_file_modify_date( _glob_paths['terminal_abs_cmds'], "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var Y = "yes", N = "no" ;

    var _cmd_params = [];
        _cmd_params['params'] = [] ;
        _cmd_params['group'] = "" ;
    var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;

    var _keywords = [ 'accuracy', 'automaton', 'canvasmode', 'circle', 'construction', 'depth', 'diskdash', 'diskdraw', 'diskfill',
                      'drawentity', 'fixedpoints', 'gens', 'init', 'interface', 'items', 'mapprecision', 'menu', 'method', 'os',
                      'groups', 'pixel', 'plugin', 'point', 'save', 'html', 'help', 'release',
                      'terminal', 'title', 'usepalette', 'warnings', 'errors' ] ;
    var _readonly = [ 'gens', 'init', 'method', 'os', 'plugin', 'terminal' ] ;
    var _groups = [ "generals", "graphix", "rendering", "terminal" ] ;
    var _adds = [ "seeds", "byref", "byval" ] ;

    _cmd_params['help'] = NO ;
    _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
    _cmd_params['keywords'] = NO ;
    _cmd_params['reset'] = NO ;

    // pre-scan for levenshtein correction
    var _cmd_terms_dict = [];
    _cmd_terms_dict = _keywords.concat( _readonly ).concat( _groups ).concat( _adds );
    circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );

 	var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
   	_cmd_params['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
   	_cmd_params['dump_array'] = [];
    _cmd_params['dump_operator_index'] = _dump_operator_index ;

	_cmd_params['transfer_to'] = ( _params_array.indexOf( TERMINAL_TRANSFER_TO_OPERATOR ) != UNFOUND ) ? YES : NO ;
	_cmd_params['transfer_from'] = ( _params_array.indexOf( TERMINAL_TRANSFER_FROM_OPERATOR ) != UNFOUND ) ? YES : NO ;
	// gather all dump parameters into one array
    if ( _cmd_params['dump'] )
    {
		for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
  		if ( _params_array[_i].trim().length > 0 ) _cmd_params['dump_array'].push( _params_array[_i] );
    }

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        var _p, _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
        for( var _i = 0 ; _i < _up_to_index ; _i++ )
        {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else if ( _p.stricmp( "reset" ) ) { _cmd_params['reset'] = YES ; _cmd_params['action'] = "set" ; }
            else if ( _p.is_one_of_i( "get", "groups", "keywords", "release", "save", "set" ) )
            {
               if ( _p.stricmp( "save" ) ) _cmd_params['dump'] = YES ;
               _cmd_params['action'] = _p.toLowerCase() ;
            }
            else if ( _p.is_one_of_i( "rendering", "generals", "terminal", "graphix", "all" ) ) _cmd_params['group'] = _p ;
            else if ( _cmd_params['action'] != null )
            {
               if ( _cmd_params['action'].is_one_of( "get", "set" ) )
               _cmd_params['params'].push( _p );
            }
        }
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }

     if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
     else if ( _cmd_params['keywords'] )
     {
         var _msg = circles_lib_terminal_tabular_arrange_data( _cmd_terms_dict.sort() ) ;
         if ( _msg.length == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
         else
         {
             _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
             circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
         }
     }
     else if ( !_b_fail && !is_string( _cmd_params['action'] ) )
     {
       if ( _cmd_params['group'].length == 0 ) _cmd_params['group'] = "all" ;
			 if ( !_cmd_params['help'] )
       {
           var _method = circles_lib_method_get_def( _glob_method ).toLowerCase();
           var _row_array = [];
               _row_array.push( "<lightblue>Config parameters list</lightblue>", _par_1, _cmd_tag );
  
           if ( _cmd_params['group'].is_one_of( "all", "generals" ) )
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

           if ( _cmd_params['group'].is_one_of( "all", "rendering" ) )
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
  
           if ( _cmd_params['group'].is_one_of( "all", "terminal" ) )
           {
                   _row_array.push( "<banana>Terminal</banana>" );
                   _row_array.push( "<lavender>show errors</lavender> <skyblue>" + ( _glob_terminal_errors_switch ? "on" : "off" ) + "</skyblue>" );
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
  
           if ( _cmd_params['group'].is_one_of( "all", "graphix" ) )
           {
          		var _smpr_perc = safe_int( _glob_smpr / _glob_zplane_rendering_layer_pointer.get_width() * 100.0, 1 );
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
  
           var _html = _cmd_params['html'] ;
           if ( _html ) circles_lib_terminal_color_decode_htmltext( _config_str, 'config', 'right', 'top' );
           else circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _config_str, _par_1, _cmd_tag );
  
           if ( _cmd_params['dump'] )
           {
               _config_str = _config_str.replaceAll( "</lavender>", " : " );
               _config_str = _config_str.strip_tags();
           	   _cmd_params['dump_array'] = is_array( _cmd_params['dump_array'] ) ? _cmd_params['dump_array'][0] : "circles.config.txt" ;
               var _ret_chunk = circles_lib_dump_data_to_format( _config_str, _cmd_params['dump_array'] );
  			   var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
  			   var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation";
  			   if ( _ret_id == 0 ) { _b_fail = YES, _error_str = _ret_msg ; }
  			   else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
           }
       }
     }
     else if ( is_string( _cmd_params['action'] ) )
     {
           var _action = _cmd_params['action'] ;
           switch( _action )
           {
			   case "groups":
			   circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightblue>Config groups are</lightblue> <white>"+_groups.join(", ")+"</white>", _par_1, _cmd_tag );
			   break ;
                case "get":
                if ( _cmd_params['params'].length == 0 ) { _b_fail = YES, _error_str = "Please, enter at least one param to get" ; }
                else
                {
                    var _param = "", _outlabel = "", _outval = "" ;
                    for( var _k = 0 ; _k < _cmd_params['params'].length ; _k++ )
                    {
                         _param = _cmd_params['params'][_k] ;
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
                                  case "errors":
                                  _outlabel = "show errors (terminal)" ;
                                  _outval = _glob_terminal_errors_switch ? Y : N ;
                                  break ;
                                  case "fixedpoints":
                                  _outlabel = "Fixed points" ;
                                  _outval = circles_lib_fixedpoints_io_get_def( _glob_fixedpt_io );
                                  break ;
                                  case "generators":
                                  _outlabel = "Generators to init" ;
                                  _outval = _glob_items_to_init ? Y : N ;
                                  break ;
                                  case "items":
                                  _outlabel = "Selected items options" ;
                                  var _out_array = [];
                                  if ( _glob_items_switch == ITEM_SWITCH_TO_NONE ) _out_array.push( "no options" );
                                  else
                                  {
                                      if ( _glob_items_switch == ITEMS_SWITCH_SEEDS ) _out_array.push( "seeds" );
                                      else if ( _glob_items_switch == ITEMS_SWITCH_GENS ) _out_array.push( "generators" );
      
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
                         		  var _smpr_perc = safe_int( _glob_smpr / _glob_zplane_rendering_layer_pointer.get_width() * 100.0, 1 );
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
                if ( _cmd_params['dump'] )
                {
                    if ( is_array( _cmd_params['dump_array'] ) ) _cmd_params['dump_array'].push( "circles.config.list.txt" );
      				var _ret_chunk = circles_lib_dump_data_to_format( _config_list, _cmd_params['dump_array'][0] );
  					var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
  					var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
  					if ( _ret_id == 0 ) { _b_fail = YES, _error_str = _ret_msg ; }
  					else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                }
                else circles_lib_output( _out_channel, DISPATCH_INFO, _config_list, _par_1, _cmd_tag );
                break ;
                case "set":
                if ( _cmd_params['params'].length == 0 && !_cmd_params['reset'] ) { _b_fail = YES, _error_str = "Please, enter one param to set" ; }
                else if ( _cmd_params['params'].length == 1 ) { _b_fail = YES, _error_str = "Incomplete set syntax" ; }
                else
                {
                    var _resp = [], _param = safe_string( _cmd_params['params'][0], "" ), _value = safe_string( _cmd_params['params'][1], "" ) ;
                    if ( _readonly.includes( _param ) && !_cmd_params['reset'] )
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<orange>Param '"+_param+"' is read-only here.</orange>"+_glob_crlf+"<gray>Use specific command '"+_param+"' instead.</gray>", _par_1, _cmd_tag );
                    else if ( _keywords.includes( _param ) || _cmd_params['reset'] )
                    {
                        if ( _param.strcmp( "accuracy" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
                                _glob_accuracy = DEFAULT_MAX_ACCURACY ;
                                _resp.push( [ 1, "<greenshock>Accuracy reset to default value " + _glob_accuracy + "</greenshock>" ] ) ;
                            }
                            else if ( _value.testME( _glob_positive_integer_regex_pattern ) )
                            {
                                _glob_accuracy = safe_int( _value, DEFAULT_MAX_ACCURACY );
                                _resp.push( [ 1, "<greenshock>Accuracy is " + _glob_accuracy + "</greenshock>" ] ) ;
                            }
                            else
                            {
								var _msg = "<orange>Fail to set accuracy to '" + _value + "'</orange>" ;
                                if ( _glob_verbose && _glob_terminal_echo_flag )
                                _msg += _glob_crlf+"<gray>The input accuracy value shall be a positive integer</gray>" ;
                                _resp.push( [ 0, _msg ] ) ;
                            }
                        }
  
                        if ( _param.strcmp( "canvasmode" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
                                _glob_src_canvas_mode = FIXEDPOINTS_IO_NONE ;
                                _resp.push( [ 1, "<greenshock>Canvas mode reset to default value 'none'</greenshock>" ] ) ;
                            }
							else
							{
								if ( _value.strcmp( "circlesdraw" ) ) _glob_src_canvas_mode = ZPLANE_CANVAS_CIRCLESDRAW_MODE ;
								else _glob_src_canvas_mode = ZPLANE_CANVAS_NULL_MODE ;
	  
								if ( _glob_src_canvas_mode == ZPLANE_CANVAS_NULL_MODE )
									_resp.push( [ 0, "<orange>Failure: input canvas mode is unknown</orange>" ] ) ;
								else _resp.push( [ 1, "<greenshock>Canvasmode is "+_value+"</greenshock>" ] ) ;
							}
                        }
  
                        if ( _param.strcmp( "fixedpoints" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
                                _glob_fixedpt_io = FIXEDPOINTS_IO_NONE ;
                                _resp.push( [ 1, "<greenshock>Fixed points mode reset to default value 'none'</greenshock>" ] ) ;
                            }
                            else if ( _value.strcmp( "input" ) )
                            {
                                _glob_fixedpt_io = FIXEDPOINTS_IO_INPUT;
                                _resp.push( [ 1, "<greenshock>Fixed point i/o has been set to '"+_value+"' with success</greenshock>" ] ) ;
                            }
							else _resp.push( [ 0, "<orange>Invalid parameter value '"+_value+"' for fixed points settings</orange>" ] ) ;
                        }
  
                        if ( _param.strcmp( "construction" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
                                circles_lib_construction_mode_set( CONSTRUCTION_NONE );
                                _resp.push( [ 1, "<greenshock>Construction mode reset to default value 'none'</greenshock>" ] ) ;
                            }
                            else if ( _value.strcmp( "limitset" ) )
                            {
                                circles_lib_construction_mode_set( CONSTRUCTION_LIMITSET );
                                _resp.push( [ 1, "<greenshock>Construction is limitset now</greenshock>" ] ) ;
                            }
                            else if ( _value.strcmp( "tiling" ) )
                            {
                                circles_lib_construction_mode_set( CONSTRUCTION_TILING );
                                _resp.push( [ 1, "<greenshock>Construction is tiling now</greenshock>" ] ) ;
                            }
  
                            for( var _d = 2 ; _d < _cmd_params['params'].length ; _d++ )
                            {
                                if ( _d == 2 ) _cmd_params['operator'] = _cmd_params['params'][_d] ;
                                else if ( _d == 3 ) _cmd_params['diskthresholdradius']  = _cmd_params['params'][_d] ;
                            }
  
                            var _mask = 0 ;
                            var _op = ( _cmd_params['operator'] != null ) ? _cmd_params['operator'] : "" ;
                            var _th = ( _cmd_params['diskthresholdradius'] != null ) ? _cmd_params['diskthresholdradius'] : "" ;
  
                            if ( _op.length > 0 ) _mask++ ;
                            if ( _th.length > 0 ) _mask++ ;
                            if ( _op.strcmp( "reset" ) )
                            {
                                _glob_disk_threshold_radius = 0, _glob_disk_threshold_operator = "" ;
                                _resp.push( [ 1, "Threshold has been disabled" ] ) ;
                            }
                            else if ( !_mask.is_one_of( 0, 2 ) )
                            {
                               _glob_disk_threshold_radius = 0, _glob_disk_threshold_operator = "" ;
                               _resp.push( [ 0, "Incomplete assignment syntax for threshold disk radius" ] ) ;
                            }
                            else if ( _mask == 2 )
                            {
                                if ( !_op.testME( "^<|>|=$" ) )
                                {
                                   _glob_disk_threshold_radius = 0, _glob_disk_threshold_operator = "" ;
                                   _resp.push( [ 0, "Incoherent comparison operator '"+_op+"'" ] ) ;
                                }
                                else if ( !_th.testME( _glob_positive_float_regex_pattern ) )
                                {
                                   _b_fail = YES ;
                                   _glob_disk_threshold_radius = 0, _glob_disk_threshold_operator = "" ;
                                   _resp.push( [ 0, "Incoherent threshold value '"+_th+"'" ] ) ;
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
                                        _resp.push( [ 1, _msg ] ) ;
                                   }
  
                                   circles_lib_menu_entries_update();
                                }
                            }
                        }
  
                        if ( _param.strcmp( "depth" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
                                circles_lib_depth_set( DEFAULT_DEPTH );
                                _resp.push( [ 1, "<greenshock>Depth value reset to default value '"+DEFAULT_DEPTH+"'</greenshock>" ] ) ;
                            }
                            else if ( _value.testME( _glob_positive_integer_regex_pattern ) )
                            {
                                circles_lib_depth_set( _value );
                                _resp.push( [ 1, "<greenshock>Depth is " + _glob_depth + "</greenshock>" ] ) ;
                            }
                            else
                            {
								var _msg = "<orange>Fail to set depth to '" + _value + "'</orange>" ;
                                if ( _glob_verbose && _glob_terminal_echo_flag )
                                _msg += _glob_crlf+"<gray>The input depth value shall be a positive integer</gray>" ;
                                _resp.push( [ 0, _msg ] ) ;
                            }
                        }
  
                        if ( _param.strcmp( "diskdash" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
                                _glob_activate_dashed_border = YES ;
                                _resp.push( [ 1, "<greenshock>Dashed border reset to default value 'yes'</greenshock>" ] ) ;
                            }
                            else if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                _glob_activate_dashed_border = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = ( _value.is_one_of( "yes", "y" ) ? "yes" : ( _value.is_one_of( "no", "n" ) ? "no" : "???" ) );
                                _resp.push( [ 1, "<greenshock>Disk dashed border use is '" + _value + "'</greenshock>" ] ) ;
                            }
                            else
                            {
								var _msg = "<orange>Fail to set param 'diskdash' to '" + _value + "'</orange>" ;
                                if ( _glob_verbose && _glob_terminal_echo_flag ) _msg += _glob_crlf+"<gray>The input value should be 'yes' or 'no'</gray>" ;
                                _resp.push( [ 0, _msg ] ) ;
                            }
                        }
  
                        if ( _param.strcmp( "diskdraw" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
                                _glob_wplane_disk_draw = YES ;
                                _resp.push( [ 1, "<greenshock>W-plane diskdraw reset to default value 'yes'</greenshock>" ] ) ;
                            }
                            else if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                _glob_wplane_disk_draw = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = ( _value.is_one_of( "yes", "y" ) ? "yes" : ( _value.is_one_of( "no", "n" ) ? "no" : "???" ) );
                                _resp.push( [ 1, "<greenshock>Disk draw (W-plane) has been set to '" + _value + "'</greenshock>" ] ) ;
                            }
                            else
                            {
								var _msg = "<orange>Fail to set param 'diskdraw' to '" + _value + "'</orange>" ;
                                if ( _glob_verbose && _glob_terminal_echo_flag )
                                _msg += _glob_crlf+"<gray>The input value should be 'yes' or 'no'</gray>" ;
                                _resp.push( [ 0, _msg ] ) ;
                            }
                        }
  
                        if ( _param.strcmp( "diskfill" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
                                _glob_wplane_disk_fill = YES ;
                                _resp.push( [ 1, "<greenshock>Diskfill reset to default value 'yes'</greenshock>" ] ) ;
                            }
                            else if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                _glob_wplane_disk_fill = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = ( _value.is_one_of( "yes", "y" ) ? "yes" : ( _value.is_one_of( "no", "n" ) ? "no" : "???" ) );
                                _resp.push( [ 1, "<greenshock>Disk fill (W-plane) is '" + _value + "'</greenshock>" ] ) ;
                            }
                            else
                            {
								var _msg = "<orange>Fail to set param 'diskfill' to '" + _value + "'</orange>" ;
                                if ( _glob_verbose && _glob_terminal_echo_flag ) _msg += _glob_crlf+"<gray>The input value should be 'yes' or 'no'</gray>" ;
                                _resp.push( [ 0, _msg ] ) ;
                            }
                        }
  
                        if ( _param.strcmp( "drawentity" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
                                _glob_drawentity = DRAWENTITY_NONE ;
                                _resp.push( [ 1, "<greenshock>Draw entity reset to default value 'none'</greenshock>" ] ) ;
                            }
							else
							{
								var _d, _p, _MSG ;
								for( _d = 1 ; _d < _cmd_params['params'].length ; _d++ )
								{
									_p = _cmd_params['params'][_d] ;
									if ( _p.stricmp( DRAWENTITY_ISOMETRIC_CIRCLE_CMD ) ) _p = DRAWENTITY_ISOMETRIC_CIRCLE ;
									else if ( _p.stricmp( DRAWENTITY_INVERSION_CIRCLE_CMD ) ) _p = DRAWENTITY_INVERSION_CIRCLE ;
									else if ( _p.stricmp( DRAWENTITY_POINT_CMD ) ) _p = DRAWENTITY_POINT ;
									else if ( _p.stricmp( DRAWENTITY_PIXEL_CMD ) ) _p = DRAWENTITY_PIXEL ;
	  
									if ( _p.is_one_of( DRAWENTITY_ISOMETRIC_CIRCLE, DRAWENTITY_INVERSION_CIRCLE, DRAWENTITY_POINT, DRAWENTITY_PIXEL ) )
									{
										_glob_drawentity = _cmd_params['drawentity'] = _p ;
										var _msg = "<greenshock>Draw entity is now</greenshock> <snow>" + circles_lib_drawentity_get_def( _glob_drawentity ) + "</snow>" ;
										_resp.push( [ 1, _msg ] ) ;
									}
									
									if ( _value.stricmp( DRAWENTITY_PIXEL_CMD ) )
									{
										if ( _d == 2 )
										{
											_glob_pixel_size = safe_int( _p, 1 );
											if ( _glob_pixel_size < 0 )
											{
												_glob_pixel_size = 1 ;
												_resp.push( [ 0, "Incorrect value: reset to " + _glob_pixel_size ] ) ;
											}
										}
										circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Pixel size is now " + _glob_pixel_size, _par_1, _cmd_tag );
									}
								}
	  
								circles_lib_menu_entries_update();
							}
                        }
  
                        if ( _param.strcmp( "interface" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
                                if ( _value.is_one_of_i( "default", "reset" ) ) { _glob_interface_index = INTERFACE_DEFAULT ; circles_lib_interface_default(); }
                                _resp.push( [ 1, "<greenshock>Interface layout has been correctly set to '" + _value + "'</greenshock>" ] ) ;
                            }
                            else if ( !_value.testME( "^default$" ) )
                            {
								var _msg = "<orange>Inconsistent input value '" + _value + "'</orange>" ;
                                if ( _glob_verbose && _glob_terminal_echo_flag )
									_msg += _glob_crlf+"<gray>The input value should be 'default'</gray>" ;
                                _resp.push( [ 0, _msg ] ) ;
                            }
                        }
  
                        if ( _param.strcmp( "items" ) || _cmd_params['reset'] )
                        {
							if ( _cmd_params['reset'] )
							{
                                _glob_items_switch = ITEM_SWITCH_TO_NONE ;
                                var _ret_chunk = circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_echo_flag, _out_channel );
         						var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
       							var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to dump value" ;
								var _msg = _ret_id ? "<greenshock>Items switch params have been correctly set to 'none'</greenshock>" : "<red>"+_ret_msg+"</red>" ;
                                _resp.push( [ _ret_id, _msg ] ) ;
							}
                            else if ( !_value.testME( "^seeds|gens$" ) )
                            {
								var _msg = "<orange>Inconsistent input value '" + _value + "'</orange>" ;
                                if ( _glob_verbose && _glob_terminal_echo_flag )
									_msg += _glob_crlf+"<gray>The input value should be 'seeds' or 'gens'</gray>" ;
                                _resp.push( [ 0, _msg ] ) ;
                            }
                            else
                            {
                                _glob_items_switch = ITEM_SWITCH_TO_NONE ;
                                if ( _value.strcmp( "seeds" ) ) _glob_items_switch |= ITEMS_SWITCH_SEEDS ;
                                else if ( _value.strcmp( "generators" ) ) _glob_items_switch |= ITEMS_SWITCH_GENS ;
  
                                if ( _cmd_params['params'].includes( "byref" ) ) _glob_items_switch |= ITEM_BYREF ;
                                else if ( _cmd_params['params'].includes( "byval" ) ) _glob_items_switch |= ITEM_BYVAL ;
  
                                var _resume_params_array = [];
                                if ( _glob_items_switch == INIT_NONE ) _resume_params_array.push( "No input params." );
                                if ( _glob_items_switch == ITEMS_SWITCH_SEEDS ) _resume_params_array.push( "Seeds" );
                                else if ( _glob_items_switch & INIT_GENERATORS ) _resume_params_array.push( "Generators" );
  
                                if ( _glob_items_switch & ITEM_BYREF ) _resume_params_array.push( "by reference" );
                                else if ( _glob_items_switch & ITEM_BYVAL ) _resume_params_array.push( "by value" );
  
                                var _ret_chunk = circles_lib_items_switch_to( _glob_items_switch, _glob_terminal_echo_flag, _out_channel );
         						var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
       							var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to dump value" ;
								var _msg = _ret_id ? "<greenshock>Items switch params have been correctly set to '" + _resume_params_array.join( "," ) + "'</greenshock>" : "<red>"+_ret_msg+"</red>" ;
                                _resp.push( [ _ret_id, _msg ] ) ;
                            }
                        }
  
                       if ( _param.strcmp( "mapprecision" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
								_glob_smpr = 100.0 ;
                                _resp.push( [ 1, "<greenshock>Map precision reset to default value '100%'</greenshock>" ] ) ;
                            }
							else if ( _value.testME( _glob_percentage_regex_pattern ) )
                            {
                                _value = safe_float( _value, 0 );
                                if ( _value.ranges_in( 1, 100, YES ) )
                                {
                                   _glob_smpr = _value * _glob_zplane_rendering_layer_pointer.get_width() / 100.0 ;
                                   _resp.push( [ 1, "<lime>Map draw precision is " + _value + "%</lime>" ] ) ;
                                }
                                else _resp.push( [ 0, "<orange>Input value must range from 1 to 100 %.</orange>" ] ) ;
                            }
                            else _resp.push( [ 0, "<orange>Syntax error: input value isn't of percentage type.</orange>" ] ) ;
                        }
  
                        if ( _param.strcmp( "menu" ) || _cmd_params['reset'] )
                        {
							if ( _cmd_params['reset'] )
							{
                                $("#CIRCLEScheckboxMENU").prop( ":checked", YES );
                                circles_lib_menu_show_top( _out_channel );
                                _resp.push( [ 1, "<greenshock>Top menu is 'visible'</greenshock>" ] ) ;
							}
                            else if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                var _menu = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = ( _value.is_one_of( "yes", "y" ) ? "visible" : ( _value.is_one_of( "no", "n" ) ? "hidden" : "???" ) );
                                $("#CIRCLEScheckboxMENU").prop( ":checked", _menu ? YES : NO );
                                circles_lib_menu_show_top( _out_channel );
                                _resp.push( [ 1, "<greenshock>Top menu is '" + _value + "'</greenshock>" ] ) ;
                            }
                            else
                            {
								var _msg = "<orange>Fail to set param 'menu' to '" + _value + "'</orange>" ;
                                if ( _glob_verbose && _glob_terminal_echo_flag ) _msg += _glob_crlf+"<gray>The input value should be 'yes' or 'no'</gray>" ;
                                _resp.push( [ 0, _msg ] ) ;
                            }
                        }
  
                        if ( _param.strcmp( "title" ) || _cmd_params['reset'] )
                        {
                        	if ( _cmd_params['reset'] )
                            {
								_glob_title = "" ;
                                _resp.push( [ 1, "<greenshock>Title reset to default empty value</greenshock>" ] ) ;
                            }
							else
							{
								_value = _cmd_params['params'].from_to( 1, _cmd_params['params'].length ).join( " " ) ;
								if ( _value.testME( _glob_illegalchars_regex_pattern ) )
								{
									var _msg = "<orange>Illegal chars found: fail to set param 'title' to '" + _value + "'</orange>" ;
									if ( _glob_verbose && _glob_terminal_echo_flag )
										_msg += _glob_crlf+"<gray>Only alphanumeric chars are allowed.</gray>" ;
									_resp.push( [ 0, _msg ] ) ;
								}
								else
								{
									_glob_title = _value ;
									_resp.push( [ 1, "<greenshock>Current configuration title is '" + _value + "'</greenshock>" ] ) ;
								}
							}
                        }
  
                        if ( _param.strcmp( "usepalette" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
								_glob_palette_use = NO ;
                                _resp.push( [ 1, "<greenshock>Palette use reset to default value 'no'</greenshock>" ] ) ;
                            }
							else if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                _glob_palette_use = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = ( _value.is_one_of( "yes", "y" ) ? "yes" : ( _value.is_one_of( "no", "n" ) ? "no" : "???" ) );
                                _resp.push( [ 1, "<greenshock>Palette use is '" + _value + "'</greenshock>" ] ) ;
                            }
                            else
                            {
								var _msg =  "<orange>Fail to set param 'usepalette' to '" + _value + "'</orange>"
                                if ( _glob_verbose && _glob_terminal_echo_flag )
									_msg += _glob_crlf+"<gray>The input value should be 'yes' or 'no'</gray>" ;
                                _resp.push( [ 0, _msg ] ) ;
                            }
                        }
  
                        if ( _param.strcmp( "errors" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
								_glob_terminal_errors_switch = YES ;
                                _resp.push( [ 1, "<greenshock>Errors use reset to default value 'yes'</greenshock>" ] ) ;
                            }
							else if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                _glob_terminal_errors_switch = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = _value.is_one_of( "yes", "y" ) ? "yes" : ( _value.is_one_of( "no", "n" ) ? "no" : "???" ) ;
                                _resp.push( [ 1, "<greenshock>Terminal errors switch has been set to '" + _value + "'</greenshock>" ] ) ;
                            }
                            else
                            {
								var _msg = "<orange>Fail to set param 'errors' to '" + _value + "'</orange>" ;
                                if ( _glob_verbose && _glob_terminal_echo_flag )
									_msg += _glob_crlf+"<gray>The input value should be 'yes' or 'no'</gray>" ;
                                _resp.push( [ 0, _msg ] ) ;
                            }
                        }
  
                        if ( _param.strcmp( "warnings" ) || _cmd_params['reset'] )
                        {
                            if ( _cmd_params['reset'] )
                            {
								_glob_terminal_warnings_switch = YES ;
                                _resp.push( [ 1, "<greenshock>Warnings use reset to default value 'yes'</greenshock>" ] ) ;
                            }
							else if ( _value.testME( "^yes|no|y|n$" ) )
                            {
                                _glob_terminal_warnings_switch = ( _value.is_one_of( "yes", "y" ) ? YES : NO );
                                _value = _value.is_one_of( "yes", "y" ) ? "yes" : ( _value.is_one_of( "no", "n" ) ? "no" : "???" ) ;
                                _resp.push( [ 1, "<greenshock>Terminal warning switch has been set to '" + _value + "'</greenshock>" ] ) ;
                            }
                            else
                            {
								var _msg = "<orange>Fail to set param 'warnings' to '" + _value + "'</orange>" ;
                                if ( _glob_verbose && _glob_terminal_echo_flag ) _msg += _glob_crlf+"<gray>The input value should be 'yes' or 'no'</gray>" ;
                                _resp.push( [ 0, _msg ] ) ;
                            }
                        }
  
						if ( _resp.length > 0 )
						_resp.forEach( function( _chunk ) { circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _chunk[1], _par_1, _cmd_tag ); } ) ;

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

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
		 circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}