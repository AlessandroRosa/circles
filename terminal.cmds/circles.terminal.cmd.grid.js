function circles_terminal_cmd_grid()
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
     var _help = 0 ;
     var _ticks = 0 ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['all'] = NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['planeindex'] = _glob_target_plane ;
         _params_assoc_array['plane'] = circles_lib_plane_def_get( _glob_target_plane ) ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 

         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "all", "axes", "bip", "default", "hide", "wplane", "zplane",
                                            "show", "ticks", "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.stricmp( "all" ) ) _params_assoc_array['all'] = YES ;
              else if ( _p.stricmp( "default" ) ) _params_assoc_array['default'] = YES ;
              else if ( _p.is_one_of_i( "axes", "release", "ticks" ) ) _params_assoc_array['action'] = _p ;
              else if ( _p.stricmp( "zplane" ) )
              {
                  _params_assoc_array['plane'] = _p ;
                  _params_assoc_array['planeindex'] = Z_PLANE ;
              }
              else if ( _p.stricmp( "wplane" ) )
              {
                  _params_assoc_array['plane'] = _p ;
                  _params_assoc_array['planeindex'] = W_PLANE ;
              }
              else if ( _p.stricmp( "bip" ) )
              {
                  _params_assoc_array['plane'] = _p ;
                  _params_assoc_array['planeindex'] = BIP_BOX ;
              }
              else if ( _p.stricmp( "show" ) ) _params_assoc_array['mode'] = 1 ;
              else if ( _p.stricmp( "hide" ) ) _params_assoc_array['mode'] = 0 ;
              else if ( _p.testME( _glob_positive_integer_regex_pattern ) ) _params_assoc_array['ticks'] = safe_int( _p, 2 );
              else if ( circles_lib_colors_is_def( _p ) ) _params_assoc_array['color'] = _p ;
              else { _b_fail = YES, _error_str = "Unknown param '"+_p+"'" ; break ; }
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
             var _action = _params_assoc_array['action'], _all = _params_assoc_array['all'] ;
             if ( _all ) _params_assoc_array['plane'] = "all" ;

             if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _output_channel );
             else if ( _params_assoc_array['default'] != null )
             {
                  _glob_ticks_count = DEFAULT_TICKS ;
                  circles_lib_output( _output_channel, DISPATCH_INFO, "Ticks reset to " + _glob_ticks_count, _par_1, _cmd_tag );
                  
                  _glob_grid_color = DEFAULT_GRID_COLOR ;
                  var _tag = ( circles_lib_colors_get_formats( _glob_grid_color ) )[3] ;
                  circles_lib_output( _output_channel, DISPATCH_INFO, "Grid color reset to " + ( _tag ? _tag : _glob_grid_color ), _par_1, _cmd_tag );
                  
                  _glob_axis_color = DEFAULT_AXES_COLOR ;
                     _tag = ( circles_lib_colors_get_formats( _glob_axis_color ) )[3] ;
                  circles_lib_output( _output_channel, DISPATCH_INFO, "Axes color reset to " + ( _tag ? _tag : _glob_axis_color ), _par_1, _cmd_tag );
                  
                  _glob_show_grid_zplane = YES ;
                  circles_lib_output( _output_channel, DISPATCH_INFO, circles_lib_plane_def_get( Z_PLANE )+" grid reset to " + ( _glob_show_grid_zplane ? "visible" : "hidden" ), _par_1, _cmd_tag );
                  
                  _glob_show_grid_wplane = YES ;
                  circles_lib_output( _output_channel, DISPATCH_INFO, circles_lib_plane_def_get( W_PLANE )+"grid set to " + ( _glob_show_grid_zplane ? "visible" : "hidden" ), _par_1, _cmd_tag );
                  circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Default settings have been restored with success", _par_1, _cmd_tag );
             }
             else
             {
                 switch( _action )
                 {
                      case "axes":
                      if ( _params_assoc_array['color'] != null )
                      {
                          var _tag = ( circles_lib_colors_get_formats( _params_assoc_array['color'] ) )[3] ;
                          var _out_color_1 = ( _tag.strcmp( _params_assoc_array['color'] ) ) ? _tag : _params_assoc_array['color'] ;
                          var _out_color_2 = ( _tag.strcmp( _params_assoc_array['color'] ) ) ? "" : _tag ;

                          _glob_axis_color = _params_assoc_array['color'] ;
                          circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Axes color has been set to " + _out_color_1 + ( ( _out_color_2.length > 0 ) ? " ("+_out_color_2+")" : "" ), _par_1, _cmd_tag );
                      }
                      break ;
                      case "release":
                      circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                      break ;
                      default:
                      if ( _params_assoc_array['color'] != null )
                      {
                          var _tag = ( circles_lib_colors_get_formats( _params_assoc_array['color'] ) )[3] ;
                          var _out_color_1 = ( _tag.strcmp( _params_assoc_array['color'] ) ) ? _tag : _params_assoc_array['color'] ;
                          var _out_color_2 = ( _tag.strcmp( _params_assoc_array['color'] ) ) ? "" : _tag ;

                          _glob_grid_color = _params_assoc_array['color'] ;
                          circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Grid color has been set to " + _out_color_1 + ( ( _out_color_2.length > 0 ) ? " ("+_out_color_2+")" : "" ), _par_1, _cmd_tag );
                      }
                      
                      if ( _params_assoc_array['mode'] != null )
                      {
                          var _mode = _params_assoc_array['mode'] ;
                          var _working_plane = _all ? ALL_PLANES : _params_assoc_array['planeindex'] ;
                          var _plane_def = circles_lib_plane_def_get( _working_plane );
                          if ( _working_plane.is_one_of( Z_PLANE, ALL_PLANES ) ) _glob_show_grid_zplane = _mode ;
                          if ( _working_plane.is_one_of( W_PLANE, ALL_PLANES ) ) _glob_show_grid_wplane = _mode ;
                          circles_lib_output( _output_channel, DISPATCH_SUCCESS, _plane_def + " "+( _all ? "have" : "has" )+" been set to "+( _mode ? "visible" : "hidden" )+"", _par_1, _cmd_tag );
                      }

                      if ( _params_assoc_array['ticks'] != null )
                      {
                           _ticks = _params_assoc_array['ticks'] ;
                           if ( _ticks == 0 )
                           {
                               _b_fail = YES, _error_str = "The input value is not a number" ;
                           }
                           else if ( !_p.isNumber() )
                           {
                               _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1);
                           }
                           else if ( _ticks <= 3 )
                           {
                               _b_fail = YES, _error_str = "The input value must be greater than 3" ;
                           }
                           else
                           {
                               _glob_ticks_count = _ticks ;
                               if (_glob_bip_use) _glob_bip_ticks = _ticks ;
                               if ( _glob_terminal_autorefresh )
                               {
                                   var _params = "" ;
                                   switch( _params_assoc_array['planeindex'] )
                                   {
                                       case Z_PLANE: _params = "zplane" ; break ;
                                       case W_PLANE: _params = "wplane" ; break ;
                                       case BIP_BOX: _params = "bip" ; break ;
                                       case ALL_PLANES: _params = "all" ; break ;
                                       default: _params = "zplane" ; break ;
                                   }
                               }
     
                               circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Ticks have been set to " + _glob_ticks_count, _par_1, _cmd_tag );
                           }
                      }
                      break ;
                 }
             }

             if ( !_b_fail )
             {
                  var _final_ret = YES ;

                  if ( _glob_terminal_autorefresh == ENABLED && _params_assoc_array['planeindex'].is_one_of( Z_PLANE, ALL_PLANES ) )
                  {
                      var _canvas = circles_lib_canvas_get_exists( Z_PLANE, "grid" ) ? circles_lib_canvas_get_target( Z_PLANE, "fixedpoints" ) : _glob_zplane_grid_layer_placeholder ;
                      var _ret_chunk_zplane = circles_lib_canvas_render_zplane( _canvas, zplane_sm, null, YES, NO, NO, NO, YES, _output_channel );
                      if ( _ret_chunk_zplane[0] != RET_IRRELEVANT ) _final_ret &= _ret_chunk_zplane[0] ;
                  }

                  if ( _glob_terminal_autorefresh == ENABLED && _params_assoc_array['planeindex'].is_one_of( W_PLANE, ALL_PLANES ) )
                  {
                      var _canvas = circles_lib_canvas_get_exists( W_PLANE, "grid" ) ? circles_lib_canvas_get_target( W_PLANE, "fixedpoints" ) : _glob_wplane_grid_layer_placeholder ;
                      var _ret_chunk_wplane = circles_lib_canvas_render_wplane( _canvas, wplane_sm, [ ROLE_GRID ], YES, NO, NO, YES, NO, YES, _output_channel );
                      if ( _ret_chunk_wplane[0] != RET_IRRELEVANT ) _final_ret &= _ret_chunk_wplane[0] ;
                  }

                  if ( _final_ret == 0 )
                  {
                      _b_fail = YES, _error_str = "Fail to refresh plane. See this report:" + _glob_crlf ;
                      _error_str += _ret_chunk_zplane[1] + _glob_crlf ;
                      _error_str += _ret_chunk_wplane[1] + _glob_crlf ;
                  }
                  else
                  {
                      if ( _glob_verbose && _glob_terminal_autorefresh == DISABLED )
                      circles_lib_output( _output_channel, DISPATCH_WARNING, "Autorefresh is disabled: set it up or use 'refresh' cmd", _par_1, _cmd_tag );
                      if ( _params_assoc_array['planeindex'] == NO_PLANE )
                      circles_lib_output( _output_channel, DISPATCH_WARNING, "No plane selected yet: select one or both to refresh grid drawings", _par_1, _cmd_tag );
                  }
             }
         }
     }
     else if ( safe_size( _params, 0 ) == 0 )
     {
         var _msg = "Current grid settings" ;
             _msg += _glob_crlf + "Ticks : " + _glob_ticks_count ;
             _msg += _glob_crlf + "Grid color : " + _glob_grid_color ;
             _msg += _glob_crlf + "Axes color : " + _glob_axis_color ;
             _msg += _glob_crlf + "Z-plane grid : " + ( _glob_show_grid_zplane ? "visible" : "hidden" );
             _msg += _glob_crlf + "W-plane grid : " + ( _glob_show_grid_wplane ? "visible" : "hidden" );
         circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
     }
     
     if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}