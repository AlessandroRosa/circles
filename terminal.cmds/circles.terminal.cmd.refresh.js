function circles_terminal_cmd_refresh()
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

	if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 || _glob_target_plane != NO_PLANE )
    {
        _cmd_params['help'] = NO ;
        _cmd_params['keywords'] = NO ;
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['plane'] = _glob_target_plane ;
        _cmd_params['clean'] = NO ;
        _cmd_params['render'] = YES ;
        _cmd_params['createdict'] = YES ;
        _cmd_params['silent'] = _glob_terminal_echo_flag == DISABLED ? NO : _glob_terminal_echo_flag ;
         
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [];
    		_local_cmds_params_array.push( "all", "freedraw", "bip", "clean", "createdict", "keepdict",
			"freedraw", "grid", "wplane", "norender", "rendering", "silent",
            "wplane", "zplane", "work", "release", "html", "help" );
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i] ;
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = YES ;
            else if ( _p.is_one_of_i( "createdict", "keepdict" ) ) _glob_dict_create = _cmd_params['createdict'] = _p.stricmp( "createdict" );
            else if ( _p.stricmp( "all" ) ) _cmd_params['plane'] = ALL_PLANES ;
            else if ( _p.stricmp( "zplane" ) ) _cmd_params['plane'] = Z_PLANE ;
            else if ( _p.stricmp( "wplane" ) ) _cmd_params['plane'] = W_PLANE ;
            else if ( _p.stricmp( "bip" ) ) _cmd_params['plane'] = BIP_BOX ;
            else if ( _p.stricmp( "clean" ) ) _cmd_params['clean'] = YES ;
            else if ( _p.stricmp( "silent" ) ) _cmd_params['silent'] = YES ;
            else if ( _p.stricmp( "norender" ) ) _cmd_params['render'] = NO ;
            else if ( _p.stricmp( "nodict" ) ) _cmd_params['dict'] = YES ;
            else if ( _p.is_one_of_i( "grid", "rendering", "freedraw", "work" ) ) _cmd_params['layer'] = _p ;
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
        else if ( !_b_fail )
        {
            var _action = _cmd_params['action'], _clean = _cmd_params['clean'] ;
            switch( _action )
            {
                  case "release":
                  circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
                  var _plane = _cmd_params['plane'] ;
                  var _silent = _cmd_params['silent'] ;
                  var _render = _cmd_params['render'] ;
                  var _context_label = "", _plane_label = "" ;
    
                  if ( _glob_terminal_run_code_from == RUN_CODE_FROM_TERMINAL && _plane == BIP_BOX )
                  {
                       _plane = W_PLANE ;
                       circles_lib_output( _out_channel, DISPATCH_WARNING, "Warning: 'bip' param running in terminal mode: correction to W-plane", _par_1, _cmd_tag );
                  }
                  else if ( _glob_terminal_run_code_from == RUN_CODE_FROM_OUTER_SRC && _plane.is_one_of( W_PLANE, ALL_PLANES ) )
                       circles_lib_output( _out_channel, DISPATCH_WARNING, "Warning: 'wplane' param running in tiny rendering mode: correction to BIP box", _par_1, _cmd_tag );
                  
                  if ( _plane != NO_PLANE )
                  {
                       var _layer_ref = _cmd_params['layer'] ;
                       var _layer_input = object_exists( _layer_ref );
                       switch( _plane )
                       {
                          case Z_PLANE :
                          var _ret_chunk = null, _ret_id = YES, _ret_msg ;
                          if ( !_layer_input )
                          {
                               _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _out_channel );
                               _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                               _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                               circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                          }
                          else
                          {
                              // render flag shall be active for 'rendering' layer only, whereas all others must display the specific contents
                              if ( _layer_ref == "grid" )
                              {
                                  _ret_chunk = circles_lib_canvas_render_zplane( _glob_zplane_grid_layer_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _out_channel );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                              if ( _layer_ref == "rendering" )
                              {
                                  _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _out_channel );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                              if ( _layer_ref == "freedraw" )
                              {
                                  _ret_chunk = circles_lib_canvas_render_zplane( _glob_zplane_freedraw_layer_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _out_channel );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                              if ( _layer_ref == "work" )
                              {
                                  _ret_chunk = circles_lib_canvas_render_zplane( _glob_zplane_work_layer_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _out_channel );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                          }
    
                          $('[id$=renderBTN]').css('color',_ret_id ?DEFAULT_COLOR_STD:COLOR_ERROR);
                          break ;
                          case W_PLANE :
                          var _ret_chunk = null, _ret_id = YES, _ret_msg ;
                          if ( _glob_drawentity == DRAWENTITY_NONE && _glob_terminal_errors_switch )
                          {
                               _b_fail = YES, _error_str = "Missing input 'drawentity' parameter for W-plane" ;
                               _error_str += _glob_crlf + "Use cmd 'config' to set 'drawentity' param" ;
                               _glob_terminal_critical_halt = YES ;
                               _glob_terminal_critical_halt_msg = _error_str + _glob_crlf + "Insufficient params: refresh halted" ;
                          }
                          else if ( _glob_construction_mode == CONSTRUCTION_NONE && _glob_terminal_errors_switch )
                          {
                               _b_fail = YES, _error_str = "Missing input 'construction' parameter for W-plane" ;
                               _error_str += _glob_crlf + "Use cmd 'config' to set 'construction' param" ;
                               _glob_terminal_critical_halt = YES ;
                               _glob_terminal_critical_halt_msg = _error_str + _glob_crlf + "Insufficient params: refresh halted" ;
                          }
                          else if ( !_layer_input )
                          {
                              if ( _silent )
                              {
                                  _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _out_channel );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  if ( _ret_id )
                                  {
                                       circles_lib_canvas_after_render_main();
                                       circles_lib_canvas_afterrender_figures_draw( null, _clean, W_PLANE );
                                  }
                                  circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                              else
                              {
                                  _ret_chunk = circles_lib_canvas_process_ask( NO, YES, _plane, _render, _clean, CHECK );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
    
                              $('[id$=renderBTN]').css('color',_ret_id ?DEFAULT_COLOR_STD:COLOR_ERROR);
                          }
                          else
                          {
                              // render flag shall be active for 'rendering' layer only, whereas all others must display the specific contents
                              if ( _layer_ref == "grid" )
                              {
                                   _ret_chunk = circles_lib_canvas_render_wplane( _glob_wplane_grid_layer_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _out_channel );
                                   _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                   _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                   circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
    
                              if ( _layer_ref == "rendering" )
                              {
                                   _ret_chunk = circles_lib_canvas_render_wplane( _glob_wplane_rendering_layer_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _out_channel );
                                   _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                   _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                   if ( _ret_id ) circles_lib_canvas_after_render_main();
                                   circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                              
                              if ( _layer_ref == "freedraw" )
                              {
                                   _ret_chunk = circles_lib_canvas_render_wplane( _glob_wplane_freedraw_layer_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _out_channel );
                                   _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                   _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                   circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
    
                              if ( _layer_ref == "work" )
                              {
                                   _ret_chunk = circles_lib_canvas_render_wplane( _glob_wplane_work_layer_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _out_channel );
                                   _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                   _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                   if ( _ret_id ) circles_lib_canvas_afterrender_figures_draw( null, _clean, W_PLANE );
    
                                   circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
    
                              $('[id$=renderBTN]').css('color',_ret_id ?DEFAULT_COLOR_STD:COLOR_ERROR);
                          }
                          break ;
                          case BIP_BOX :
                          if ( _glob_drawentity == DRAWENTITY_NONE && _glob_terminal_errors_switch )
                          {
                               _b_fail = YES, _error_str = "Missing input 'drawentity' parameter for W-plane" ;
                               _error_str += _glob_crlf + "Use cmd 'config' to set 'drawentity' param" ;
                               _glob_terminal_critical_halt = YES ;
                               _glob_terminal_critical_halt_msg = _error_str + _glob_crlf + "Insufficient params: refresh halted" ;
                          }
                          else if ( _glob_construction_mode == CONSTRUCTION_NONE && _glob_terminal_errors_switch )
                          {
                               _b_fail = YES, _error_str = "Missing input 'construction' parameter for W-plane" ;
                               _error_str += _glob_crlf + "Use cmd 'config' to set 'construction' param" ;
                               _glob_terminal_critical_halt = YES ;
                               _glob_terminal_critical_halt_msg = _error_str + _glob_crlf + "Insufficient params: refresh halted" ;
                          }
                          else
                          {
                              var _ret_chunk = circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, null, _clean, YES, _render, YES, !_silent, _silent, _out_channel );
                              var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                              var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                              circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              $('[id$=renderBTN]').css('color',_ret_id ?DEFAULT_COLOR_STD:COLOR_ERROR);
                          }
                          break ;
                          case ALL_PLANES :
                          if ( _glob_drawentity == DRAWENTITY_NONE && _glob_terminal_errors_switch )
                          {
                               _b_fail = YES, _error_str = "Missing input 'drawentity' parameter for W-plane" ;
                               _error_str += _glob_crlf + "Use cmd 'config' to set 'drawentity' param" ;
                               _glob_terminal_critical_halt = YES ;
                               _glob_terminal_critical_halt_msg = _error_str + _glob_crlf + "Insufficient params: refresh halted" ;
                          }
                          else if ( _glob_construction_mode == CONSTRUCTION_NONE && _glob_terminal_errors_switch )
                          {
                               _b_fail = YES, _error_str = "Missing input 'construction' parameter for W-plane" ;
                               _error_str += _glob_crlf + "Use cmd 'config' to set 'construction' param" ;
                               _glob_terminal_critical_halt = YES ;
                               _glob_terminal_critical_halt_msg = _error_str + _glob_crlf + "Insufficient params: refresh halted" ;
                          }
                          else if ( !_layer_input )
                          {
                               var _final_ret = YES ;
                               var _ret_chunk_zplane = circles_lib_canvas_render_zplane( null, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _out_channel );
                               if ( _ret_chunk_zplane[0] != RET_IRRELEVANT )
                               _final_ret &= _ret_chunk_zplane != null ? safe_int( _ret_chunk_zplane[0], NO ) : 0 ;
                               var _ret_chunk_wplane = circles_lib_canvas_render_wplane( null, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _out_channel );
                               if ( _ret_chunk_wplane[0] != RET_IRRELEVANT )
                               _final_ret &= _ret_chunk_wplane != null ? safe_int( _ret_chunk_wplane[0], NO ) : 0 ;
                               var _ret_chunk_bip = circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, null, _clean, YES, _render, YES, !_silent, _silent, _out_channel );
                               if ( _ret_chunk_bip[0] != RET_IRRELEVANT )
                               _final_ret &= _ret_chunk_bip != null ? safe_int( _ret_chunk_bip[0], NO ) : 0 ;
    
                               var _ret_msg = [];
                               if ( _ret_chunk_zplane != null ) _ret_msg.push( _ret_chunk_zplane[1] );
                               if ( _ret_chunk_zplane != null ) _ret_msg.push( _ret_chunk_wplane[1] );
                               if ( _ret_chunk_bip != null ) _ret_msg.push( _ret_chunk_bip[1] );
                               _ret_msg = _ret_msg.join( _glob_crlf );
    
                               circles_lib_output( _out_channel, _final_ret ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_id ? "All planes rendered with success" : _ret_msg, _par_1, _cmd_tag );
                               $('[id$=renderBTN]').css('color',_final_ret?DEFAULT_COLOR_STD:COLOR_ERROR);
                          }
                          else
                          {
                              var _final_ret = YES ;
                              if ( _layer_ref == "grid" )
                              {
                                  var _ret_chunk_zplane = circles_lib_canvas_render_zplane( _glob_zplane_grid_layer_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _out_channel );
                                  if ( _ret_chunk_zplane[0] != RET_IRRELEVANT ) _final_ret &= _ret_chunk_zplane != null ? _ret_chunk_zplane[0] : 0 ;
                                  var _ret_chunk_wplane = circles_lib_canvas_render_wplane( _glob_wplane_grid_layer_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _out_channel );
                                  if ( _ret_chunk_wplane[0] != RET_IRRELEVANT ) _final_ret &= _ret_chunk_wplane != null ? _ret_chunk_wplane[0] : 0 ;
                              }
    
                              if ( _layer_ref == "rendering" )
                              {
                                  var _ret_chunk_zplane = circles_lib_canvas_render_zplane( null, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _out_channel );
                                  if ( _ret_chunk_zplane[0] != RET_IRRELEVANT ) _final_ret &= _ret_chunk_zplane != null ? _ret_chunk_zplane[0] : 0 ;
                                  var _ret_chunk_wplane = circles_lib_canvas_render_wplane( null, wplane_sm, null, _clean, YES, _render, YES, _silent, YES, _out_channel );
                                  if ( _ret_chunk_wplane[0] != RET_IRRELEVANT ) _final_ret &= _ret_chunk_wplane != null ? _ret_chunk_wplane[0] : 0 ;
                              }
    
                              if ( _layer_ref == "freedraw" )
                              {
                                  var _ret_chunk = circles_lib_canvas_render_zplane( _glob_zplane_freedraw_layer_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _out_channel );
                                  if ( _ret_chunk[0] != RET_IRRELEVANT ) _final_ret &= is_array( _ret_chunk ) ? _ret_chunk[0] : 0 ;
                                  var _ret_chunk = circles_lib_canvas_render_wplane( _glob_wplane_freedraw_layer_placeholder, zplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _out_channel );
                                  if ( _ret_chunk[0] != RET_IRRELEVANT ) _final_ret &= is_array( _ret_chunk ) ? _ret_chunk[0] : 0 ;
                              }
    
                              if ( _layer_ref == "work" )
                              {
                                  var _ret_chunk_zplane = circles_lib_canvas_render_zplane( _glob_zplane_work_layer_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _out_channel );
                                  if ( _ret_chunk_zplane[0] != RET_IRRELEVANT )
                                  _final_ret &= _ret_chunk_zplane != null ? _ret_chunk_zplane[0] : 0 ;
                                  var _ret_chunk_wplane = circles_lib_canvas_render_wplane( _glob_wplane_work_layer_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _out_channel );
                                  if ( _ret_chunk_wplane[0] != RET_IRRELEVANT )
                                  _final_ret &= _ret_chunk_wplane != null ? _ret_chunk_wplane[0] : 0 ;
                              }
    
                              $('[id$=renderBTN]').css('color',_final_ret?DEFAULT_COLOR_STD:COLOR_ERROR);
                          }
                          break ;
                          default: break ;
                       }
                            
                      var _plane_def = circles_lib_plane_def_get( _plane );
                      if ( _clean ) circles_lib_output( _out_channel, DISPATCH_INFO, _plane_def + " has been cleaned", _par_1, _cmd_tag );
                      circles_lib_output( _out_channel, DISPATCH_INFO, _plane_def + ( ( _layer_ref != null ) ? "/" + _layer_ref + " " : "" ) + " has been refreshed", _par_1, _cmd_tag );
                  }
                  else if ( _glob_terminal_errors_switch )
                  {
                      _b_fail = YES, _error_str = "Missing input plane" ;
                      _glob_terminal_critical_halt = YES ;
                      _glob_terminal_critical_halt_msg = _error_str ;
                  }
                  break ;
            }
        }
    }

    _error_str = $.terminal.escape_brackets( _error_str ) ;
    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}