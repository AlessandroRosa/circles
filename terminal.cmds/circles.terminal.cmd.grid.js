function circles_terminal_cmd_grid()
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
    var _help = 0 ;
    var _ticks = 0 ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

	if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
         _cmd_params['all'] = NO ;
         _cmd_params['help'] = NO ;
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _cmd_params['keywords'] = NO ;
         _cmd_params['action'] = "" ;
         _cmd_params['planeindex'] = _glob_target_plane ;
         _cmd_params['plane'] = circles_lib_plane_def_get( _glob_target_plane ) ;

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 

        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [];
    	_local_cmds_params_array.push( "all", "axes", "bip", "default", "hide", "wplane", "zplane",
                                       "render", "show", "ticks", "release", "html", "help" );
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else if ( _p.stricmp( "all" ) ) _cmd_params['all'] = YES ;
            else if ( _p.is_one_of_i( "default", "render" ) ) _cmd_params[_p] = YES ;
            else if ( _p.is_one_of_i( "axes", "release", "ticks" ) ) _cmd_params['action'] = _p ;
            else if ( _p.is_one_of_i( "zplane", "z-plane" ) )
            {
                _cmd_params['plane'] = _p ;
                _cmd_params['planeindex'] = Z_PLANE ;
            }
            else if ( _p.is_one_of_i( "wplane", "w-plane" ) )
            {
                _cmd_params['plane'] = _p ;
                _cmd_params['planeindex'] = W_PLANE ;
            }
            else if ( _p.is_one_of_i( "bip", "bipbox" ) )
            {
                _cmd_params['plane'] = _p ;
                _cmd_params['planeindex'] = BIP_BOX ;
            }
            else if ( _p.stricmp( "show" ) ) _cmd_params['mode'] = 1 ;
            else if ( _p.stricmp( "hide" ) ) _cmd_params['mode'] = 0 ;
            else if ( _p.testME( _glob_positive_integer_regex_pattern ) ) _cmd_params['ticks'] = safe_int( _p, 2 );
            else if ( circles_lib_colors_is_def( _p ) ) _cmd_params['color'] = _p ;
            else { _b_fail = YES, _error_str = "Unknown param '"+_p+"'" ; break ; }
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
         else if ( !_b_fail )
         {
             var _action = _cmd_params['action'], _all = _cmd_params['all'] ;
             if ( _all ) _cmd_params['plane'] = "all" ;

             if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
             else if ( _cmd_params['default'] != null )
             {
                  _glob_ticks_count = DEFAULT_TICKS ;
                  circles_lib_output( _out_channel, DISPATCH_INFO, "Ticks reset to " + _glob_ticks_count, _par_1, _cmd_tag );
                  
                  _glob_grid_color = DEFAULT_GRID_COLOR ;
                  var _tag = ( circles_lib_colors_get_formats( _glob_grid_color ) )[3] ;
                  circles_lib_output( _out_channel, DISPATCH_INFO, "Grid color reset to " + ( _tag ? _tag : _glob_grid_color ), _par_1, _cmd_tag );
                  
                  _glob_axis_color = DEFAULT_AXES_COLOR ;
                     _tag = ( circles_lib_colors_get_formats( _glob_axis_color ) )[3] ;
                  circles_lib_output( _out_channel, DISPATCH_INFO, "Axes color reset to " + ( _tag ? _tag : _glob_axis_color ), _par_1, _cmd_tag );
                  
                  _glob_show_grid_zplane = YES ;
                  circles_lib_output( _out_channel, DISPATCH_INFO, circles_lib_plane_def_get( Z_PLANE )+" grid reset to " + ( _glob_show_grid_zplane ? "visible" : "hidden" ), _par_1, _cmd_tag );
                  
                  _glob_show_grid_wplane = YES ;
                  circles_lib_output( _out_channel, DISPATCH_INFO, circles_lib_plane_def_get( W_PLANE )+" grid set to " + ( _glob_show_grid_wplane ? "visible" : "hidden" ), _par_1, _cmd_tag );
                  circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Default settings have been restored with success", _par_1, _cmd_tag );
             }
             else
             {
                 switch( _action )
                 {
                      case "axes":
                      if ( _cmd_params['color'] != null )
                      {
                          var _tag = ( circles_lib_colors_get_formats( _cmd_params['color'] ) )[3] ;
                          var _out_color_1 = ( _tag.strcmp( _cmd_params['color'] ) ) ? _tag : _cmd_params['color'] ;
                          var _out_color_2 = ( _tag.strcmp( _cmd_params['color'] ) ) ? "" : _tag ;

                          _glob_axis_color = _cmd_params['color'] ;
                          circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Axes color has been set to " + _out_color_1 + ( ( _out_color_2.length > 0 ) ? " ("+_out_color_2+")" : "" ), _par_1, _cmd_tag );
                      }
                      break ;
                      case "release":
                      circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                      break ;
                      default:
                      if ( _cmd_params['color'] != null )
                      {
                          var _tag = ( circles_lib_colors_get_formats( _cmd_params['color'] ) )[3] ;
                          var _out_color_1 = ( _tag.strcmp( _cmd_params['color'] ) ) ? _tag : _cmd_params['color'] ;
                          var _out_color_2 = ( _tag.strcmp( _cmd_params['color'] ) ) ? "" : _tag ;

                          _glob_grid_color = _cmd_params['color'] ;
                          circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Grid color has been set to " + _out_color_1 + ( ( _out_color_2.length > 0 ) ? " ("+_out_color_2+")" : "" ), _par_1, _cmd_tag );
                      }
                      
                      if ( _cmd_params['mode'] != null )
                      {
                          var _mode = _cmd_params['mode'] ;
                          var _working_plane = _all ? ALL_PLANES : _cmd_params['planeindex'] ;
                          var _plane_def = circles_lib_plane_def_get( _working_plane );
                          if ( _working_plane.is_one_of( Z_PLANE, ALL_PLANES ) ) _glob_show_grid_zplane = _mode ;
                          if ( _working_plane.is_one_of( W_PLANE, ALL_PLANES ) ) _glob_show_grid_wplane = _mode ;
                          circles_lib_output( _out_channel, DISPATCH_SUCCESS, _plane_def + " "+( _all ? "have" : "has" )+" been set to "+( _mode ? "visible" : "hidden" )+"", _par_1, _cmd_tag );
                      }

                      if ( _cmd_params['ticks'] != null )
                      {
                           _ticks = safe_int( _cmd_params['ticks'], 0 ) ;
                           if ( _ticks <= 3 ) { _b_fail = YES, _error_str = "The input value must be greater than 3" ; }
                           else
                           {
                               _glob_ticks_count = _ticks ;
                               if (_glob_bip_use) _glob_bip_ticks = _ticks ;
                               if ( _glob_terminal_autorefresh )
                               {
                                   var _params = "" ;
                                   switch( _cmd_params['planeindex'] )
                                   {
                                       case Z_PLANE: _params = "zplane" ; break ;
                                       case W_PLANE: _params = "wplane" ; break ;
                                       case BIP_BOX: _params = "bip" ; break ;
                                       case ALL_PLANES: _params = "all" ; break ;
                                       default: _params = "zplane" ; break ;
                                   }
                               }
     
                               circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Ticks have been set to " + _glob_ticks_count, _par_1, _cmd_tag );
                           }
                      }
                      break ;
                 }
             }

            if ( !_b_fail )
            {
                var _final_ret = YES ;
                if ( ( _cmd_params['render'] || _glob_terminal_autorefresh == ENABLED ) && _cmd_params['planeindex'].is_one_of( Z_PLANE, ALL_PLANES ) )
                {
                    var _canvas = circles_lib_canvas_get_exists( Z_PLANE, "grid" ) ? circles_lib_canvas_get_target( Z_PLANE, "fixedpoints" ) : _glob_zplane_grid_layer_placeholder ;
                    var _ret_chunk_zplane = circles_lib_canvas_render_zplane( _canvas, zplane_sm, null, YES, NO, NO, NO, YES, _out_channel );
                    if ( _ret_chunk_zplane[0] != RET_IRRELEVANT ) _final_ret &= _ret_chunk_zplane[0] ;
                }

                if ( ( _cmd_params['render'] || _glob_terminal_autorefresh == ENABLED ) && _cmd_params['planeindex'].is_one_of( W_PLANE, ALL_PLANES ) )
                {
                    var _canvas = circles_lib_canvas_get_exists( W_PLANE, "grid" ) ? circles_lib_canvas_get_target( W_PLANE, "fixedpoints" ) : _glob_wplane_grid_layer_placeholder ;
                    var _ret_chunk_wplane = circles_lib_canvas_render_wplane( _canvas, wplane_sm, [ ROLE_GRID ], YES, NO, NO, YES, NO, YES, _out_channel );
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
                    circles_lib_output( _out_channel, DISPATCH_WARNING, "Autorefresh is disabled: set it up or use 'refresh' cmd", _par_1, _cmd_tag );
                    if ( _cmd_params['planeindex'] == NO_PLANE )
                    circles_lib_output( _out_channel, DISPATCH_WARNING, "No plane selected yet: select one or both to refresh grid drawings", _par_1, _cmd_tag );
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
        circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
    }
     
    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}