function circles_terminal_cmd_refresh()
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
     if ( _params.length > 0 || _glob_target_plane != NO_PLANE )
     {
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['plane'] = _glob_target_plane ;
         _params_assoc_array['clean'] = NO ;
         _params_assoc_array['render'] = YES ;
         _params_assoc_array['createdict'] = YES ;
         _params_assoc_array['silent'] = _glob_terminal_silent == DISABLED ? NO : _glob_terminal_silent ;
         
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "all", "freedraw", "bip", "clean", "createdict", "keepdict",
                                            "freedraw", "grid", "wplane", "norender", "rendering", "silent",
                                            "wplane", "zplane", "work", "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i] ;
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = YES ;
              else if ( _p.is_one_of_i( "createdict", "keepdict" ) ) _glob_dict_create = _params_assoc_array['createdict'] = _p.stricmp( "createdict" );
              else if ( _p.stricmp( "all" ) ) _params_assoc_array['plane'] = ALL_PLANES ;
              else if ( _p.stricmp( "zplane" ) ) _params_assoc_array['plane'] = Z_PLANE ;
              else if ( _p.stricmp( "wplane" ) ) _params_assoc_array['plane'] = W_PLANE ;
              else if ( _p.stricmp( "bip" ) ) _params_assoc_array['plane'] = BIP_BOX ;
              else if ( _p.stricmp( "clean" ) ) _params_assoc_array['clean'] = YES ;
              else if ( _p.stricmp( "silent" ) ) _params_assoc_array['silent'] = YES ;
              else if ( _p.stricmp( "norender" ) ) _params_assoc_array['render'] = NO ;
              else if ( _p.stricmp( "nodict" ) ) _params_assoc_array['dict'] = YES ;
              else if ( _p.is_one_of_i( "grid", "rendering", "freedraw", "work" ) ) _params_assoc_array['layer'] = _p ;
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
         else if ( _glob_method == METHOD_NONE && !_clean )
         {
             _glob_terminal_critical_halt = _b_fail = YES ;
             _glob_terminal_critical_halt_msg = _error_str = "Missing method declaration" ;
				 }
         else if ( !_b_fail )
         {
             var _action = _params_assoc_array['action'] ;
             var _clean = _params_assoc_array['clean'] ;
             switch( _action )
             {
                  case "release":
                  circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
                  var _plane = _params_assoc_array['plane'] ;
                  var _silent = _params_assoc_array['silent'] ;
                  var _render = _params_assoc_array['render'] ;
                  var _context_label = "", _plane_label = "" ;
    
                  if ( circles_lib_count_dict() == 0 && _glob_dict_create == NO &&
                       _glob_method.is_one_of( METHOD_INVERSION, METHOD_ALGEBRAIC ) &&
                       _glob_process != PROCESS_RANDOM )
                  {
                      var _msg = "Current input dictionary is empty" ;
                      circles_lib_output( _output_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                  }
                  
                  if ( _glob_terminal_run_code_from == RUN_CODE_FROM_TERMINAL && _plane == BIP_BOX )
                  {
                       _plane = W_PLANE ;
                       circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: 'bip' param running in terminal mode: correction to W-plane", _par_1, _cmd_tag );
                  }
                  else if ( _glob_terminal_run_code_from == RUN_CODE_FROM_OUTER_SRC && _plane.is_one_of( W_PLANE, ALL_PLANES ) )
                  {
                       //_plane = BIP_BOX ;
                       circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: 'wplane' param running in tiny rendering mode: correction to BIP box", _par_1, _cmd_tag );
                  }
                  
                  if ( _plane != NO_PLANE )
                  {
                       var _layer_ref = _params_assoc_array['layer'] ;
                       var _layer_input = object_exists( _layer_ref );
                       switch( _plane )
                       {
                          case Z_PLANE :
                          var _ret_chunk = null, _ret_id = YES, _ret_msg ;
                          if ( !_layer_input )
                          {
                               _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _output_channel );
                               _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                               _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                               circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                          }
                          else
                          {
                              // render flag shall be active for 'rendering' layer only, whereas all others must display the specific contents
                              if ( _layer_ref == "grid" )
                              {
                                  _ret_chunk = circles_lib_canvas_render_zplane( _glob_zplane_grid_canvas_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _output_channel );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                              if ( _layer_ref == "rendering" )
                              {
                                  _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _output_channel );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                              if ( _layer_ref == "freedraw" )
                              {
                                  _ret_chunk = circles_lib_canvas_render_zplane( _glob_zplane_freedraw_canvas_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _output_channel );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                              if ( _layer_ref == "work" )
                              {
                                  _ret_chunk = circles_lib_canvas_render_zplane( _glob_zplane_work_canvas_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _output_channel );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                          }
    
                          $('[id$=renderBTN]').css('color',_ret_id ?DEFAULT_COLOR_STD:COLOR_ERROR);
                          break ;
                          case W_PLANE :
                          var _ret_chunk = null, _ret_id = YES, _ret_msg ;
                          if ( _glob_drawentity == DRAWENTITY_NONE )
                          {
                               _b_fail = YES, _error_str = "Missing input 'drawentity' parameter for W-plane" ;
                               _error_str += _glob_crlf + "Use cmd 'config' to set 'drawentity' param" ;
                               _glob_terminal_critical_halt = YES ;
                               _glob_terminal_critical_halt_msg = _error_str + _glob_crlf + "Insufficient params: refresh halted" ;
                          }
                          else if ( _glob_construction_mode == CONSTRUCTION_NONE )
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
                                  _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _output_channel );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  if ( _ret_id )
                                  {
                                       circles_lib_canvas_after_process_main();
                                       circles_lib_canvas_after_process_figures( null, _clean, W_PLANE );
                                  }
                                  circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                              else
                              {
                                  _ret_chunk = circles_lib_canvas_process_ask( NO, YES, _plane, _render, _clean, CHECK );
                                  _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                  _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                  circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
    
                              $('[id$=renderBTN]').css('color',_ret_id ?DEFAULT_COLOR_STD:COLOR_ERROR);
                          }
                          else
                          {
                              // render flag shall be active for 'rendering' layer only, whereas all others must display the specific contents
                              if ( _layer_ref == "grid" )
                              {
                                   _ret_chunk = circles_lib_canvas_render_wplane( _glob_wplane_grid_canvas_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _output_channel );
                                   _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                   _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                   circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
    
                              if ( _layer_ref == "rendering" )
                              {
                                   _ret_chunk = circles_lib_canvas_render_wplane( _glob_wplane_rendering_canvas_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _output_channel );
                                   _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                   _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                   if ( _ret_id ) circles_lib_canvas_after_process_main();
                                   circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
                              
                              if ( _layer_ref == "freedraw" )
                              {
                                   _ret_chunk = circles_lib_canvas_render_wplane( _glob_wplane_freedraw_canvas_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _output_channel );
                                   _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                   _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                   circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
    
                              if ( _layer_ref == "work" )
                              {
                                   _ret_chunk = circles_lib_canvas_render_wplane( _glob_wplane_work_canvas_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _output_channel );
                                   _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                                   _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                                   if ( _ret_id ) circles_lib_canvas_after_process_figures( null, _clean, W_PLANE );
    
                                   circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              }
    
                              $('[id$=renderBTN]').css('color',_ret_id ?DEFAULT_COLOR_STD:COLOR_ERROR);
                          }
                          break ;
                          case BIP_BOX :
                          if ( _glob_drawentity == DRAWENTITY_NONE )
                          {
                               _b_fail = YES, _error_str = "Missing input 'drawentity' parameter for W-plane" ;
                               _error_str += _glob_crlf + "Use cmd 'config' to set 'drawentity' param" ;
                               _glob_terminal_critical_halt = YES ;
                               _glob_terminal_critical_halt_msg = _error_str + _glob_crlf + "Insufficient params: refresh halted" ;
                          }
                          else if ( _glob_construction_mode == CONSTRUCTION_NONE )
                          {
                               _b_fail = YES, _error_str = "Missing input 'construction' parameter for W-plane" ;
                               _error_str += _glob_crlf + "Use cmd 'config' to set 'construction' param" ;
                               _glob_terminal_critical_halt = YES ;
                               _glob_terminal_critical_halt_msg = _error_str + _glob_crlf + "Insufficient params: refresh halted" ;
                          }
                          else
                          {
                              var _ret_chunk = circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, null, _clean, YES, _render, YES, !_silent, _silent, _output_channel );
                              var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                              var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                              circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                              $('[id$=renderBTN]').css('color',_ret_id ?DEFAULT_COLOR_STD:COLOR_ERROR);
                          }
                          break ;
                          case ALL_PLANES :
                          if ( _glob_drawentity == DRAWENTITY_NONE )
                          {
                               _b_fail = YES, _error_str = "Missing input 'drawentity' parameter for W-plane" ;
                               _error_str += _glob_crlf + "Use cmd 'config' to set 'drawentity' param" ;
                               _glob_terminal_critical_halt = YES ;
                               _glob_terminal_critical_halt_msg = _error_str + _glob_crlf + "Insufficient params: refresh halted" ;
                          }
                          else if ( _glob_construction_mode == CONSTRUCTION_NONE )
                          {
                               _b_fail = YES, _error_str = "Missing input 'construction' parameter for W-plane" ;
                               _error_str += _glob_crlf + "Use cmd 'config' to set 'construction' param" ;
                               _glob_terminal_critical_halt = YES ;
                               _glob_terminal_critical_halt_msg = _error_str + _glob_crlf + "Insufficient params: refresh halted" ;
                          }
                          else if ( !_layer_input )
                          {
                               var _final_ret = YES ;
                               var _ret_chunk_zplane = circles_lib_canvas_render_zplane( null, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _output_channel );
                               if ( _ret_chunk_zplane[0] != RET_IRRELEVANT )
                               _final_ret &= _ret_chunk_zplane != null ? safe_int( _ret_chunk_zplane[0], NO ) : 0 ;
                               var _ret_chunk_wplane = circles_lib_canvas_render_wplane( null, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _output_channel );
                               if ( _ret_chunk_wplane[0] != RET_IRRELEVANT )
                               _final_ret &= _ret_chunk_wplane != null ? safe_int( _ret_chunk_wplane[0], NO ) : 0 ;
                               var _ret_chunk_bip = circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, null, _clean, YES, _render, YES, !_silent, _silent, _output_channel );
                               if ( _ret_chunk_bip[0] != RET_IRRELEVANT )
                               _final_ret &= _ret_chunk_bip != null ? safe_int( _ret_chunk_bip[0], NO ) : 0 ;
    
                               var _ret_msg = [];
                               if ( _ret_chunk_zplane != null ) _ret_msg.push( _ret_chunk_zplane[1] );
                               if ( _ret_chunk_zplane != null ) _ret_msg.push( _ret_chunk_wplane[1] );
                               if ( _ret_chunk_bip != null ) _ret_msg.push( _ret_chunk_bip[1] );
                               _ret_msg = _ret_msg.join( _glob_crlf );
    
                               circles_lib_output( _output_channel, _final_ret ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_id ? "All planes rendered with success" : _ret_msg, _par_1, _cmd_tag );
                               $('[id$=renderBTN]').css('color',_final_ret?DEFAULT_COLOR_STD:COLOR_ERROR);
                          }
                          else
                          {
                              var _final_ret = YES ;
                              if ( _layer_ref == "grid" )
                              {
                                  var _ret_chunk_zplane = circles_lib_canvas_render_zplane( _glob_zplane_grid_canvas_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _output_channel );
                                  if ( _ret_chunk_zplane[0] != RET_IRRELEVANT ) _final_ret &= _ret_chunk_zplane != null ? _ret_chunk_zplane[0] : 0 ;
                                  var _ret_chunk_wplane = circles_lib_canvas_render_wplane( _glob_wplane_grid_canvas_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _output_channel );
                                  if ( _ret_chunk_wplane[0] != RET_IRRELEVANT ) _final_ret &= _ret_chunk_wplane != null ? _ret_chunk_wplane[0] : 0 ;
                              }
    
                              if ( _layer_ref == "rendering" )
                              {
                                  var _ret_chunk_zplane = circles_lib_canvas_render_zplane( null, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _output_channel );
                                  if ( _ret_chunk_zplane[0] != RET_IRRELEVANT ) _final_ret &= _ret_chunk_zplane != null ? _ret_chunk_zplane[0] : 0 ;
                                  var _ret_chunk_wplane = circles_lib_canvas_render_wplane( null, wplane_sm, null, _clean, YES, _render, YES, _silent, YES, _output_channel );
                                  if ( _ret_chunk_wplane[0] != RET_IRRELEVANT ) _final_ret &= _ret_chunk_wplane != null ? _ret_chunk_wplane[0] : 0 ;
                              }
    
                              if ( _layer_ref == "freedraw" )
                              {
                                  var _ret_chunk = circles_lib_canvas_render_zplane( _glob_zplane_freedraw_canvas_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _output_channel );
                                  if ( _ret_chunk[0] != RET_IRRELEVANT ) _final_ret &= is_array( _ret_chunk ) ? _ret_chunk[0] : 0 ;
                                  var _ret_chunk = circles_lib_canvas_render_wplane( _glob_wplane_freedraw_canvas_placeholder, zplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _output_channel );
                                  if ( _ret_chunk[0] != RET_IRRELEVANT ) _final_ret &= is_array( _ret_chunk ) ? _ret_chunk[0] : 0 ;
                              }
    
                              if ( _layer_ref == "work" )
                              {
                                  var _ret_chunk_zplane = circles_lib_canvas_render_zplane( _glob_zplane_work_canvas_placeholder, zplane_sm, null, _clean, YES, _render, !_silent, _silent, YES, _output_channel );
                                  if ( _ret_chunk_zplane[0] != RET_IRRELEVANT )
                                  _final_ret &= _ret_chunk_zplane != null ? _ret_chunk_zplane[0] : 0 ;
                                  var _ret_chunk_wplane = circles_lib_canvas_render_wplane( _glob_wplane_work_canvas_placeholder, wplane_sm, null, _clean, YES, _render, YES, !_silent, _silent, _output_channel );
                                  if ( _ret_chunk_wplane[0] != RET_IRRELEVANT )
                                  _final_ret &= _ret_chunk_wplane != null ? _ret_chunk_wplane[0] : 0 ;
                              }
    
                              $('[id$=renderBTN]').css('color',_final_ret?DEFAULT_COLOR_STD:COLOR_ERROR);
                          }
                          break ;
                          default: break ;
                       }
                            
                      var _plane_def = circles_lib_plane_get_def( _plane );
                      if ( _clean ) circles_lib_output( _output_channel, DISPATCH_INFO, _plane_def + " has been cleaned", _par_1, _cmd_tag );
                      circles_lib_output( _output_channel, DISPATCH_INFO, _plane_def + ( ( _layer_ref != null ) ? "/" + _layer_ref + " " : "" ) + " has been refreshed", _par_1, _cmd_tag );
                  }
                  else
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
     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}