function circles_terminal_cmd_coords()
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
     var _plane = "" ;
     var _out_text_string = "" ;
     var _params_assoc_array = [];
     var _fn_ret_val = null ;

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
         _params_assoc_array['all'] = NO ;
         _params_assoc_array['center'] = NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['params'] = [] ;
         _params_assoc_array['planes'] = [] ;
         
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "all", "bip", "wplane", "zplane", "center", "copy", "release",
						 																"clean", "render", "silent", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
             _p = _params_array[_i].toLowerCase();
             if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
             else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
             else if ( _p.stricmp( "all" ) ) { _params_assoc_array['planes'].flush() ; _params_assoc_array['planes'].push( Z_PLANE, W_PLANE, BIP_BOX ) ; }
             else if ( _p.stricmp( "bip" ) && _params_assoc_array['planes'].not_includes( _BIP_BOX ) ) _params_assoc_array['planes'].push( BIP_BOX ) ;
             else if ( _p.stricmp( "center" ) ) _params_assoc_array['center'] = YES ;
             else if ( _p.is_one_of_i( "copy", "release" ) ) _params_assoc_array['action'] = _p ;
             else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
             else if ( _p.is_one_of_i( "clean", "render", "silent" ) ) _params_assoc_array['params'].push( _p ) ;
             else if ( _p.stricmp( "wplane" ) && _params_assoc_array['planes'].not_includes( W_PLANE ) ) _params_assoc_array['planes'].push( W_PLANE ) ;
             else if ( _p.stricmp( "zplane" ) && _params_assoc_array['planes'].not_includes( Z_PLANE ) ) _params_assoc_array['planes'].push( Z_PLANE ) ;
             else
             {
                 _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
             }
         }

         if ( safe_size( _params_assoc_array['planes'], 0 ) == 0 ) _params_assoc_array['planes'].push( _glob_target_plane ) ;

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
             var _action = _params_assoc_array['action'] ;
             var _clean = _params_assoc_array['params'].includes( "clean" ) ;
             var _render = _params_assoc_array['params'].includes( "render" ) ;
             var _silent = _params_assoc_array['params'].includes( "silent" ) ? YES : ( _glob_terminal_silent == DISABLED ? NO : _glob_terminal_silent ) ;
             var _src_plane_def = _params_assoc_array['planes'][0] != null ? circles_lib_plane_get_def( _params_assoc_array['planes'][0] ) : "undefined plane" ;
             var _dest_plane_def = _params_assoc_array['planes'][1] != null ? circles_lib_plane_get_def( _params_assoc_array['planes'][1] ) : "undefined plane" ;
             switch( _action )
             {
                  case "copy":
                  var _old_n_planes = safe_size( _params_assoc_array['planes'], 0 );
                  _params_assoc_array['planes'] = _params_assoc_array['planes'].unique();
                  var _n_planes = safe_size( _params_assoc_array['planes'], 0 );
                  if ( _n_planes < _old_n_planes )
    	            circles_lib_output( _output_channel, DISPATCH_WARNING, "Found and deleted duplicates of plane inputs", _par_1, _cmd_tag );
    
                  if ( _n_planes > 2 )
                  {
                       _params_assoc_array['planes'] = _params_assoc_array['planes'].subset(2);
        	             circles_lib_output( _output_channel, DISPATCH_WARNING, "Copy accepts only two input planes: more inputs will be ignored", _par_1, _cmd_tag );
                  }
                     
                  if ( _n_planes == 0 )
    	            circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing both source and destination plane for coords copy", _par_1, _cmd_tag );
                  else if ( _n_planes == 1 )
    	            circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing destination plane for coords copy", _par_1, _cmd_tag );
                  else
                  {
                      var _src_coords = [] ;
                      switch( _params_assoc_array['planes'][0] )
                      {
                          case Z_PLANE: _src_coords = [ _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM ] ; break ;                       
                          case W_PLANE: _src_coords = [ _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM ] ; break ;                       
                          case BIP_BOX: _src_coords = [ _glob_bipLEFT, _glob_bipTOP, _glob_bipRIGHT, _glob_bipBOTTOM ] ; break ;                       
                      }
                          
                      switch( _params_assoc_array['planes'][1] )
                      {
                          case Z_PLANE:
                          distribute_vals( [ "_glob_zplaneLEFT", "_glob_zplaneTOP", "_glob_zplaneRIGHT", "_glob_zplaneBOTTOM" ],
                                           [ _src_coords[0], _src_coords[1], _src_coords[2], _src_coords[3] ] );
    				              zplane_sm.set_coords_rect( new rect( _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
                          break ;
                          case W_PLANE:
                          distribute_vals( [ "_glob_wplaneLEFT", "_glob_wplaneTOP", "_glob_wplaneRIGHT", "_glob_wplaneBOTTOM" ],
                                           [ _src_coords[0], _src_coords[1], _src_coords[2], _src_coords[3] ] );
    				              wplane_sm.set_coords_rect( new rect( _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
                          break ;
                          case BIP_BOX:
                          distribute_vals( [ "_glob_bipLEFT", "_glob_bipTOP", "_glob_bipRIGHT", "_glob_bipBOTTOM" ],
                                           [ _src_coords[0], _src_coords[1], _src_coords[2], _src_coords[3] ] );
    				              bipbox_sm.set_coords_rect( new rect( _glob_bipLEFT, _glob_bipLEFT, _glob_bipRIGHT, _glob_bipBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
                          break ;
                      }

         		          circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Coords have been copied from "+_src_plane_def+" to "+_dest_plane_def + " with success", _par_1, _cmd_tag );
                  }
                  break ;
                  case "release":
                  circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
                  var _curr_plane = _params_assoc_array['planes'][0] ;
                  var _plane_def = circles_lib_plane_get_def( _curr_plane );
                  if ( _curr_plane == NO_PLANE )
                  {
                       _b_fail = YES, _error_str = "Select a valid plane to return its coords info" ;
                  }
                  
                  if ( _params_assoc_array['center'] || _params_assoc_array['all'] )
                  {
                      var _left = 0, _top = 0, _right = 0, _bottom = 0 ;
                      switch( _curr_plane )
                      {
                           case Z_PLANE:
                           _left = _glob_zplaneLEFT, _top = _glob_zplaneTOP, _right = _glob_zplaneRIGHT, _bottom = _glob_zplaneBOTTOM ;
                           break ;
                           case W_PLANE:
                           _left = _glob_wplaneLEFT, _top = _glob_wplaneTOP, _right = _glob_wplaneRIGHT, _bottom = _glob_wplaneBOTTOM ;
                           break ;
                           case BIP_BOX:
                           _left = _glob_bipLEFT, _top = _glob_bipTOP, _right = _glob_bipRIGHT, _bottom = _glob_bipBOTTOM ;
                           break ;
                      }
                          
                      var _x = ( _right + _left ) / 2.0, _y = ( _top + _bottom ) / 2.0 ;
                      var _MSG = "" ;
                      _MSG += "The "+_plane_def+" region is centered at" + _glob_crlf ;
                      _MSG += "<lightblue>X</lightblue> <white>" + _x + "</white>" + _glob_crlf ;
                      _MSG += "<lightblue>Y</lightblue> <white>" + _y + "</white>" + _glob_crlf ;
                      circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _MSG, _par_1, _cmd_tag );
                  }
    
                  for( var _pl = 0 ; _pl < _params_assoc_array['planes'].length ; _pl++ )
                  {
                    if ( _params_assoc_array['planes'][_pl] != NO_PLANE )
                    {
                      var _MSG = "", _left = 0, _top = 0, _right = 0, _bottom = 0 ;
                      switch( _params_assoc_array['planes'][_pl] )
                      {
                          case Z_PLANE:
                          _MSG = "Z-plane coords" ;
                          _left = _glob_zplaneLEFT, _top = _glob_zplaneTOP, _right = _glob_zplaneRIGHT, _bottom = _glob_zplaneBOTTOM ;
                          break ;
                          case W_PLANE:
                          _MSG = "W-plane coords" ;
                          _left = _glob_wplaneLEFT, _top = _glob_wplaneTOP, _right = _glob_wplaneRIGHT, _bottom = _glob_wplaneBOTTOM ;
                          break ;
                          case BIP_BOX:
                          _MSG = "BIP BOX coords" ;
                          _left = _glob_bipLEFT, _top = _glob_bipTOP, _right = _glob_bipRIGHT, _bottom = _glob_bipBOTTOM ;
                          break ;
  									      default:
                          break ;
                      }

                      circles_lib_output( _output_channel, DISPATCH_INFO, _MSG, _par_1, _cmd_tag );
                      if ( _params_assoc_array['center'] ) circles_lib_output( _output_channel, DISPATCH_INFO, _glob_crlf, _par_1, _cmd_tag );

                      var _MSG = "" ;
                      _MSG += "<lightblue>Top</lightblue> <white>" + _top + "</white>" + _glob_crlf ;
                      _MSG += "<lightblue>Left</lightblue> <white>" + _left + "</white>" + _glob_crlf ;
                      _MSG += "<lightblue>Right</lightblue> <white>" + _right + "</white>" + _glob_crlf ;
                      _MSG += "<lightblue>Bottom</lightblue> <white>" + _bottom  + "</white>" + _glob_crlf ;
                      circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _MSG, _par_1, _cmd_tag );
                    }
                  }
                  break ;
             }

             if ( _render )
             {
                 var _sd_n = circles_lib_count_seeds();
                 if ( _sd_n > 0 )
                 {
                     var _new_params = _plane_def ;
                         _new_params += " " + _dest_plane_def ;
                     if ( _clean )  _new_params += " clean" ;
                     if ( _silent ) _new_params += " silent" ;
                     circles_lib_terminal_interpreter( "refresh "+_new_params, _glob_terminal, _output_channel );
    		             circles_lib_output( _output_channel, DISPATCH_INFO, "Now render the " + _plane_def, _par_1, _cmd_tag );
                 }
                 else circles_lib_output( _output_channel, DISPATCH_WARNING, "Rendering has been skipped: no registered seeds", _par_1, _cmd_tag );
             }
         }
     }
     else if ( _params.length == 0 || _glob_target_plane == NO_PLANE )
     {
         _b_fail = YES, _error_str = "Select a plane to return coords info" ;
     }
     
     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
} 