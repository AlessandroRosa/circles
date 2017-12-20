function circles_terminal_cmd_help()
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
     var _cmd_params = [];
         _cmd_params['tip'] = [];
         _cmd_params['exec'] = [];
         _cmd_params['exact'] = NO ;
         _cmd_params['action'] = "" ;
     var _index_associations = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length == 0 )
     {
         circles_lib_output( _out_channel, DISPATCH_INFO, "No command specified for help.\nThis is the list of all available commands", _par_1, _cmd_tag );
         circles_lib_output( _out_channel, DISPATCH_INFO, "Type: help %cmd% or %cmd% /h for command help text", _par_1, _cmd_tag );
         var vars = { tip: "",
                      folder : "terminal.cmds/help/",
                      filter : "/[?.hlp]$/",
                      exact : 0,
                      search_params : "0,0,1,0"
                    } ;
         var _result = get_filedata_from_folder( "support/code/phpcode/svc/svc.filelist.php", "POST", false, vars );
         _result = _result.split( "@@@").sort();
         var _max_entry_length = 0 ;
         $.each( _result, function( _index, _value ) { _max_entry_length = Math.max( _max_entry_length, _value.replaceAll( ".cmd.hlp", "").length );} );
         _max_entry_length += 2 ;
         var _columns = Math.floor( _glob_terminal.cols() / _max_entry_length );
         var _out_row = "", _counter = 0, _row = 0, _color, _row_colors = [ "lightblue", "skyblue", "lightgray", "snow" ] ;
         $.each( _result, function( _index, _value )
                 {
                    _value = _value.replaceAll( ".cmd.hlp", "" );
                    _counter++ ;
                    _out_row += _value + ( new String( " ").repeat( _max_entry_length - _value.length ) );
                    if ( _counter % _columns == 0 )
                    {
                        _color = _row_colors[ _row % _row_colors.length ] ;
                        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<"+_color+">"+_out_row+"</"+_color+">", _par_1, _cmd_tag );
                        _counter = 0, _out_row = "", _row++ ;
                    }
                 }
               );

         if ( _counter % _columns != 0 )
         {
             var _color = _row_colors[ _row % _row_colors.length ] ;
             circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<"+_color+">"+_out_row+"</"+_color+">", _par_1, _cmd_tag );
             _counter = 0, _out_row = "", _row++ ;
         }
     }
     else
     {
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _cmd_params['keywords'] = NO ;
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
         // pre-scan for levenshtein correction
    		 var _cmd_terms_dict = [];
    				 _cmd_terms_dict.push( "html", "tip", "exact", "release", "html" );
         circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
              else if ( _p.stricmp( "exact" ) ) _cmd_params['exact'] = YES ;
              else if ( _p.stricmp( "html" ) ) _cmd_params['exec'].push( "html" );
              else if ( _p.is_one_of_i( "release", "tip" ) ) _cmd_params['action'] = _p ;
              else if ( _cmd_params['action'].strcmp( "tip" ) )
              {
                  if ( _p.trim().length > 3 )
                  {
                      _cmd_params['tip'].push( _p );
                      _index_associations['tip'] = _i ;
                  }
              }
              else if ( _cmd_params['action'].length == 0 ) _cmd_params['exec'].push( _p );
         }

         if ( _cmd_params['help'] != null )
         {
              jQuery.get( _glob_paths['terminalhelp'] + _cmd_tag + ".cmd.hlp",
                          function( help_text ) { circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, help_text, _par_1, _cmd_tag ); },
                         'html');
         }
         else if ( _cmd_params['exec'].length > 0 )
         {
              if ( !( _cmd_params['exec'].includes( "/h" ) ) ) _cmd_params['exec'].push( "/h" );
              _cmd_params['exec'].sort_adv(YES);
              var _cmd = ( _cmd_params['exec'].join( " " ) );
              circles_lib_terminal_interpreter( _cmd, _glob_terminal, _out_channel );
         }
         else
         {
             var _action = _cmd_params['action'] ;
             switch( _action )
             {
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "tip":
                   if ( _cmd_params['tip'].length > 0 )
                   {
                       circles_lib_output( _out_channel, DISPATCH_INFO, "Processing request ... please wait ..", _par_1, _cmd_tag );
                       var vars = { tip: _cmd_params['tip'].join("|"),
                                    exact : _cmd_params['exact'],
                                    folder : "terminal.cmds/help/",
                                    filter : "/[?.hlp]$/"
                                  } ;
                       var _result = get_filedata_from_folder( "support/code/phpcode/svc/svc.filelist.php", "POST", false, vars );
                       if ( _result.length == 0 )
                       {
                           var _plural = _cmd_params['tip'].length != 1 ? YES : NO ;
                           circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "The term"+(_plural?"s":"")+" '<lightblue>"+_cmd_params['tip'].join(", ")+"</lightblue>' ha"+(_plural?"ve":"s")+" not been found", _par_1, _cmd_tag );
                       }
                       else if ( _result.length > 0 )
                       {
                            var _plural = _cmd_params['tip'].length != 1 ? YES : NO ;
                            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "The term"+(_plural?"s":"")+" '<lightblue>"+_cmd_params['tip'].join(", ")+"</lightblue>' ha"+(_plural?"ve":"s")+" been found inside the help file of these cmds:", _par_1, _cmd_tag );

                            _result = ( _result.includes( "@@@" ) ) ? _result.split( "@@@" ) : [ _result ];
                            var _max_entry_length = 0 ;
                            $.each( _result, function( _index, _value ) { _max_entry_length = Math.max( _max_entry_length, _value.replaceAll( ".cmd.hlp", "").length );} );
                                _max_entry_length += 2 ;
                            var _columns = Math.floor( _glob_terminal.cols() / _max_entry_length );
                            var _out_row = "", _counter = 0, _row = 0 ;
                            var _row_colors = [ "snow", "lightblue", COLOR_DISABLED ] ;

                            $.each( _result, function( _index, _value )
                                    {
                                       _value = _value.replaceAll( ".cmd.hlp", "" );
                                       _counter++ ;
                                       _out_row += _value + ( new String( " ").repeat( _max_entry_length - _value.length ) );
                                       if ( _counter % _columns == 0 )
                                       {
                                           var _color = _row_colors[ _row % _row_colors.length ] ;
                                           circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<"+_color+">"+_out_row+"</"+_color+">", _par_1, _cmd_tag );
                                           _counter = 0, _out_row = "", _row++ ;
                                       }
                                   }
                                 );

                            if ( _counter % _columns != 0 )
                            {
                                var _color = _row_colors[ _row % _row_colors.length ] ;
                                circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<"+_color+">"+_out_row+"</"+_color+">", _par_1, _cmd_tag );
                                _counter = 0, _out_row = "", _row++ ;
                            }

                            circles_lib_output( _out_channel, DISPATCH_INFO, "Type '%cmd% /h' to return help text of the related %cmd% tag", _par_1, _cmd_tag );
                       }
                   }
                   else circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing input tips to search for", _par_1, _cmd_tag );
                break ;
				        default: break ;
             }
         }
     }

    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
    circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + "\nPlease, just type 'help' for commands list", _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}