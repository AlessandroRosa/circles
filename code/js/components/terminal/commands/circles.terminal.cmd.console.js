function circles_terminal_cmd_console()
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
     var _params_assoc_array = [];
     var _fn_ret_val = null ;

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
             _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
             _params_assoc_array['keywords'] = NO ;
             _params_assoc_array['x'] = null ;
             _params_assoc_array['y'] = null ;
             _params_assoc_array['w'] = null ;
             _params_assoc_array['h'] = null ;
             _params_assoc_array['reset'] = 0 ;
             _params_assoc_array['action'] = "" ;
             _params_assoc_array['history'] = 0 ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "bottom", "default", "history", "left", "nohelp",
                                            "right", "reset", "resize", "screenfit", "top",
                                            "maxi", "mini", "wide", "long", "release", "help", "html" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "history", "resize", "release" ) ) _params_assoc_array['action'] = _p ;
              else if ( _p.stricmp( "nohelp" ) ) _params_assoc_array['nohelp'] = YES ;
              else if ( _p.stricmp( "reset" ) )
              {
                   _params_assoc_array['reset'] = 1 ;
                   _params_assoc_array['color'] = DEFAULT_FONT_COLOR ;
                   _params_assoc_array['bk'] = DEFAULT_BK_COLOR ;
                   _params_assoc_array['family'] = DEFAULT_FONT_FAMILY ;
                   _params_assoc_array['size'] = DEFAULT_FONT_SIZE ;
              }
              else if ( _p.is_one_of_i( "left", "right" ) ) _params_assoc_array['x'] = _p ;
              else if ( _p.is_one_of_i( "maxi", "mini", "wide", "long" ) ) _params_assoc_array['consolesize'] = _p ;
              else if ( _p.is_one_of_i( "top", "bottom", "default", "screenfit" ) ) _params_assoc_array['y'] = _p ;
              else if ( _p.testME( _glob_percentage_regex_pattern ) )
              {
                   if ( _params_assoc_array['action'].includes( "resize" ) )
                   {
                        if ( _params_assoc_array['w'] == null ) _params_assoc_array['w'] = safe_string( _p, "" );
                        else if ( _params_assoc_array['h'] == null ) _params_assoc_array['h'] = safe_string( _p, "" );
                   }
              }
              else if ( _params_assoc_array['action'].stricmp( "history" ) )
              {
                   if ( _p.testME( _glob_integer_regex_pattern ) )
                   _params_assoc_array['history'] = safe_int( _p, 0 );
              }
              else
              {
                   _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
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
         else if ( !_b_fail )
         {
              var _move = YES ;
              if ( _params_assoc_array['x'] == null ) _params_assoc_array['x'] = "" ;
              if ( _params_assoc_array['y'] == null ) _params_assoc_array['y'] = "" ;
              if ( _params_assoc_array['consolesize'] != null )
              {
                   var _w = 0, _h = 0, _extras_menu_height = 52, _extras_statusbar_height = $( window ).height() - $("#STATUSBAR").position().top, _consolesize = _params_assoc_array['consolesize'] ;
                   switch( _consolesize )
                   {
                       case "maxi" :
                       _w = $( window ).width(), _h = $( window ).height() - ( _extras_menu_height + _extras_statusbar_height + 10 );
                       _w -= 20 ;
                       _params_assoc_array['x'] = "left", _params_assoc_array['y'] = "top" ;
                       break ;
                       case "mini" :
                       _w = Math.floor( $( window ).width() / 2 ), _h = Math.floor( ( $( window ).height() - _extras_menu_height ) / 2 );
                       break ;
                       case "wide" :
                       _w = $( window ).width(), _h = Math.floor( ( $( window ).height()- _extras_menu_height ) * 2 / 3 );
                       _w -= 20, _h = Math.min( 340, _h );
                       if ( _params_assoc_array['x'].length > 0 && !_params_assoc_array['x'].strcmp( "left" ) )
                       circles_lib_output( _output_channel, DISPATCH_INFO, "Invalid X-pos for '"+_consolesize+"' : reset to 'left'", _par_1, _cmd_tag );
                       _params_assoc_array['x'] = "left" ;
                       break ;
                       case "long" :
                       _w = Math.floor( $( window ).width() / 2 ), _h = $( window ).height() - ( _extras_menu_height + _extras_statusbar_height + 10 );
                       if ( _params_assoc_array['y'].length > 0 && !_params_assoc_array['y'].strcmp( "top" ) )
                       circles_lib_output( _output_channel, DISPATCH_INFO, "Invalid Y-pos for '"+_consolesize+"': reset to 'top'", _par_1, _cmd_tag );
                       _params_assoc_array['y'] = "top" ;
                       break ;
							         default: break ;
                   }

                   CIRCLESformsTERMINALresize( _w, _h, _glob_terminal_form_suffix, _output_channel );
              }
              else
              {
                   var _action = _params_assoc_array['action'].toLowerCase();
                   switch( _action )
                   {
                       case "history":
                       if ( _output_channel == OUTPUT_TERMINAL )
                       {
                           var _n_history = _params_assoc_array["history"] ;
                           var _h = _glob_terminal.history().data().clone();
                               _h.reverse();
                           var _h_n = safe_size( _h, 0 );
                           var _n_extract = Math.min( _n_history, _h_n );
                           $("#CIRCLESbatchcompilerTEXT" + _glob_terminal_form_suffix ).html( "" );
                           var _b_append = NO ;
                           for( var _i = 1 ; _i <= _n_extract + 1 ; _i++ )
                           {
                              _b_append = ( _params_assoc_array['nohelp'] != null ) ? ( !_h[_i].includes( "/h" ) && !_h[_i].includes( "/?" ) ) : YES ;
                              if ( _b_append ) $("#CIRCLESbatchcompilerTEXT" + _glob_terminal_form_suffix ).append( _h[_i] + _glob_crlf );
                           }

                           circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Last " + _n_extract + " cmd" + ( _n_extract != 1 ? "s have" : " has" ) + " been copied into the batch script tab", _par_1, _cmd_tag );
                       }
                       else 
                       circles_lib_output( _output_channel, DISPATCH_WARNING, "This option is available from the console input exclusively", _par_1, _cmd_tag );
                       break ;
                      case "release":
                      circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                      break ;
                       case "resize":
                       if ( _params_assoc_array['w'] != null && _params_assoc_array['h'] != null )
                       {
                            if ( _params_assoc_array['w'].length > 0 && _params_assoc_array['h'].length > 0 )
                            {
                                 var _viewport_w = $( window ).width(), _viewport_h = $( window ).height();
                                 var _bool_perc_w = _params_assoc_array['w'].includes( "%" );
                                     _params_assoc_array['w'] = Math.abs( safe_int( _params_assoc_array['w'], 0 ) );
                                     if ( _bool_perc_w ) _params_assoc_array['w'] = Math.min( _params_assoc_array['w'], 99.5 );
                                     else _params_assoc_array['w'] = Math.min( _params_assoc_array['w'], _viewport_w );
                                     _params_assoc_array['w'] = safe_int( _bool_perc_w ? _viewport_w * _params_assoc_array['w'] / 100 : _params_assoc_array['w'], 0 );
                                 var _bool_perc_h = _params_assoc_array['h'].includes( "%" );
                                     _params_assoc_array['h'] = Math.abs( safe_int( _params_assoc_array['h'], 0 ) );
                                     if ( _bool_perc_h ) _params_assoc_array['h'] = Math.min( _params_assoc_array['h'], 99.5 );
                                     else _params_assoc_array['h'] = Math.min( _params_assoc_array['h'], _viewport_h );
                                     _params_assoc_array['h'] = safe_int( _bool_perc_h ? _viewport_h * _params_assoc_array['h'] / 100 : _params_assoc_array['h'], 0 );

                                     var _extra_height = 58 ;
                                     _params_assoc_array['h'] -= _extra_height ;
                            
                                 var _ret_chunk = CIRCLESformsTERMINALresize( _params_assoc_array['w'], _params_assoc_array['h'], _glob_terminal_form_suffix, _output_channel );
                                 var _ret_id = safe_int( _ret_chunk[0], RET_ERROR );
                                 var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
                                 
                                 if ( _ret_id == RET_ERROR )
                                 {
                                      _b_fail = YES, _error_str = _ret_msg ;
                                 }
                                 else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg + " New width / height are " + _params_assoc_array['w'] + "px / " + _params_assoc_array['h'] + "px", _par_1, _cmd_tag );
                            }
                            else
                            {
                                 _b_fail = YES, _error_str = "Both input size params must be strictly positive" ;
                            }
                       }
                       else
                       {
                           _b_fail = YES, _error_str = "Missing input size params" ;
                       }
                       break ;
								       default:
                       if ( _params_assoc_array['x'].length > 0 || _params_assoc_array['y'].length > 0 )
                       move_div( circles_lib_plugin_build_divid( "forms", "terminal" ) + _glob_terminal_form_suffix, _params_assoc_array['x'], _params_assoc_array['y'] );
                       else circles_lib_output( _output_channel, DISPATCH_ERROR, "Fail to apply command 'console'.\nMissing action specification", _par_1, _cmd_tag );
                       break ;
                   }
              }

         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
     }

     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, "Fail to apply command 'console'.\nType '"+_cmd_tag+" /h' for syntax help", _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}