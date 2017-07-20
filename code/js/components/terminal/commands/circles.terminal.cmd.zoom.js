var _glob_terminal_zoom_side_Z_PLANE_last = UNDET ;
_glob_terminal_cmd_files_include[ "zoom" ] = [ "refresh" ] ;

function circles_terminal_cmd_zoom()
{
  var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
  var _params = arguments[0] ;
  var _out_channel = arguments[1] ;
  var _par_1 = arguments[2] ;
  var _cmd_mode = arguments[3] ;
  var _caller_id = arguments[4] ;
  _params = safe_string( _params, "" ).trim();

  if ( _glob_verbose )
  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

	var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
  var _b_fail = 0 ;
  var _error_str = "", _undef_plane = "undefined plane" ;
  var _out_text_string = "" ;
  var _params_assoc_array = [];
  var _planeLEFT, _planeRIGHT, _planeTOP, _planeBOTTOM ;
  var _fn_ret_val = null ;
  var _zoom_rate = 0.3 ;

	if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
  if ( _params.length > 0 )
  {
    _params_assoc_array['action'] = "" ;
    _params_assoc_array['all'] = NO ;
    _params_assoc_array['center'] = null ;
    _params_assoc_array['default'] = NO ;
    _params_assoc_array['help'] = NO ;
    _params_assoc_array['keywords'] = NO ;
    _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
    _params_assoc_array['params'] = [] ;
    _params_assoc_array['planes'] = [] ;
    _params_assoc_array['side'] = 0 ;
    _params_assoc_array['tofit'] = NO ;
    _params_assoc_array['viewportXrange'] = UNDET ;
    _params_assoc_array['zoomfactor'] = 0 ;
         
    var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
    _params_array.clean_from( " " );       _params_array.clean_from( "" );
    // pre-scan for levenshtein correction
    var _local_cmds_params_array = [];
    	  _local_cmds_params_array.push( "all", "bip", "copy", "clean", "down", "default",
        "wplane", "left", "norender", "right", "release", "html", "help",
        "zplane", "render", "shift", "silent", "tofit", "top" );
    circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
    var _p ;
    for( var _i = 0 ; _i < _params_array.length ; _i++ )
    {
      _p = _params_array[_i];
      if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
      else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
      else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
      else if ( _p.stricmp( "all" ) )
      {
         circles_lib_output( _out_channel, DISPATCH_INFO, "'All' param found: subsequent operation(s) will involve all plane environments", _par_1, _cmd_tag );
         _params_assoc_array['all'] = YES ;
         _params_assoc_array['planes'].push ( ALL_PLANES ) ;
      }
      else if ( _p.is_one_of_i( "copy", "shift", "release" ) ) _params_assoc_array['action'] = _p ;
      else if ( _p.is_one_of_i( "left", "top", "right", "bottom" ) ) _params_assoc_array['params'].push( _p );
      else if ( _p.stricmp( "bip" ) ) _params_assoc_array['planes'].push( BIP_BOX ) ;
      else if ( _p.is_one_of_i( "clean", "render", "silent" ) ) _params_assoc_array['params'].push( _p ) ;
      else if ( _p.stricmp( "default" ) )
      {
        circles_lib_output( _out_channel, DISPATCH_INFO, "'Default' param detected: coords will be restored to original values", _par_1, _cmd_tag );
			  _params_assoc_array['default'] = YES ;
        _planeLEFT = -DEFAULT_PLANE_COORD ;
        _planeRIGHT = DEFAULT_PLANE_COORD ;
        _planeTOP = DEFAULT_PLANE_COORD ;
        _planeBOTTOM = -DEFAULT_PLANE_COORD ;
   		}
      else if ( _p.stricmp( "silent" ) ) _params_assoc_array['silent'] = YES ;
      else if ( _p.stricmp( "tofit" ) ) _params_assoc_array['tofit'] = YES ;
      else if ( _p.stricmp( "wplane" ) ) _params_assoc_array['planes'].push( W_PLANE ) ;
      else if ( _p.stricmp( "zplane" ) ) _params_assoc_array['planes'].push( Z_PLANE ) ;
      else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
      {
        _p = _p.replaceAll( "(", "").replaceAll( ")", "", _par_1, _cmd_tag );
        var _c_array = _p.split( "," );
        _c_array[0] = safe_float( _c_array[0].trim(), 0 );
        _c_array[1] = safe_float( _c_array[1].trim(), 0 );
        _params_assoc_array['center'] = new point( _c_array[0], _c_array[1] );
        circles_lib_output( _out_channel, DISPATCH_INFO, "Detected center coords at " + _c_array.join(","), _par_1, _cmd_tag );
   		}
      else if ( _p.testME( _glob_positive_float_regex_pattern, _glob_negative_float_regex_pattern ) )
      {
        if ( _params_assoc_array['action'].stricmp( "shift" ) ) _params_assoc_array['zoomfactor'] == safe_float( _p, 0 );
        else _params_assoc_array['zoomfactor'] = safe_float( _p, 0 ) ;
      }
      else if ( _p.start_with_i( "side:" ) ) _params_assoc_array['side'] = safe_float( _p.replace( "side:", "" ), 0 );
      else
      {
        _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1);
      }
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
    else
    {
      if ( safe_size( _params_assoc_array['planes'], 0 ) == 0 ) _params_assoc_array['planes'].push( _glob_target_plane ) ;
      var _action = safe_string( _params_assoc_array['action'], "" ) ;
      var _plane_type = safe_int( _params_assoc_array['planes'][0], NO_PLANE );
      var _plane_def = circles_lib_plane_get_def( _plane_type );
      var _plane_cmd = circles_lib_plane_get_def_for_cmds( _plane_type );
      var _tofit = safe_int( _params_assoc_array['tofit'], NO ) ;
      var _zf = safe_float( _params_assoc_array['zoomfactor'], 0 );
      var _clean = _params_assoc_array['params'].includes( "clean" ) ;
      var _render = _params_assoc_array['params'].includes( "render" ) ;
      var _silent = _params_assoc_array['params'].includes( "silent" ) ? YES : ( _glob_terminal_silent == DISABLED ? NO : _glob_terminal_silent ) ;
      var _side = safe_float( _params_assoc_array['side'], 0 );
      var _center_pt = is_point( _params_assoc_array['center'] ) ? _params_assoc_array['center'] : new point( 0, 0 ) ;
      var _src_plane_def = _params_assoc_array['planes'][0] != null ? circles_lib_plane_get_def( _params_assoc_array['planes'][0] ) : _undef_plane ;
      var _src_plane_cmd = _params_assoc_array['planes'][0] != null ? circles_lib_plane_get_def_for_cmds( _params_assoc_array['planes'][0] ) : _undef_plane ;
      var _dest_plane_def = _params_assoc_array['planes'][1] != null ? circles_lib_plane_get_def( _params_assoc_array['planes'][1] ) : _undef_plane ;
      var _dest_plane_cmd = _params_assoc_array['planes'][1] != null ? circles_lib_plane_get_def_for_cmds( _params_assoc_array['planes'][1] ) : _undef_plane ;
             
      if ( _glob_terminal_run_code_from == RUN_CODE_FROM_OUTER_SRC && _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
      {
        //_plane_type = BIP_BOX ;
        circles_lib_output( _out_channel, DISPATCH_WARNING, "Warning: 'wplane' param running in tiny rendering mode: correction to BIP box", _par_1, _cmd_tag );
      }

      switch( _action )
		  {
        case "copy":
        var _old_n_planes = safe_size( _params_assoc_array['planes'], 0 );
        _params_assoc_array['planes'] = _params_assoc_array['planes'].unique();
        var _n_planes = safe_size( _params_assoc_array['planes'], 0 );
        if ( _n_planes < _old_n_planes )
        circles_lib_output( _out_channel, DISPATCH_WARNING, "Found and deleted duplicates of plane inputs", _par_1, _cmd_tag );

        if ( _n_planes > 2 )
        {
           _params_assoc_array['planes'] = _params_assoc_array['planes'].subset(2);
    	     circles_lib_output( _out_channel, DISPATCH_WARNING, "Copy accepts only two input planes: more inputs will be ignored", _par_1, _cmd_tag );
        }
                 
        if ( _n_planes == 0 )
	      circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing both source and destination plane for coords copy", _par_1, _cmd_tag );
        else if ( _n_planes == 1 )
	      circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing destination plane for coords copy", _par_1, _cmd_tag );
        else
        {
                      var _src_coords = [] ;
                      switch( _params_assoc_array['planes'][0] )
                      {
                          case Z_PLANE: _src_coords = [ _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM ] ; break ;                       
                          case W_PLANE: _src_coords = [ _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM ] ; break ;                       
                          case BIP_BOX: _src_coords = [ _glob_bipLEFT, _glob_bipTOP, _glob_bipRIGHT, _glob_bipBOTTOM ] ; break ;                       
					                default: break ;
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
					                default: break ;
                      }
                      
     		              circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Coords have been copied from "+_src_plane_def+" to "+_dest_plane_def + " with success", _par_1, _cmd_tag );
        }
        break ;
		    case "release":
		    circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
		    break ;
		    case "shift":
		    var _p_len = safe_size( _params_assoc_array['params'], 0 );
		    if ( _p_len == 0 )
		    {
	         _b_fail = YES, _error_str = "Can't shift coords: no input params" ;
		    }
		    else if ( _plane_type.is_one_of( NO_PLANE, ALL_PLANES ) )
		    {
	         _b_fail = YES, _error_str = "Can't shift coords: no specific input plane" ;
		    }
		    else
		    {
       		 var _ret_chunk = null ;
	         for( var _i = 0 ; _i < _p_len ; _i++ )
	         {
             _ret_chunk = circles_lib_coordinates_shift( _params_assoc_array['params'][_i], _plane_type, Math.abs( _zf ), _glob_terminal_silent, _out_channel );
             _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
             _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error while shifting coords" ;
             circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
	         }
		    }
		    break ;
		    default: // set coords
		    if ( _tofit == NO && _side == 0 && _zf == 0 )
		    {
		      _b_fail = YES, _error_str = "Can't zoom: invalid 'side' param and zoom factor" ;
		    }
		    else if ( _plane_type.is_one_of( NO_PLANE, ALL_PLANES ) )
		    {
		      _b_fail = YES, _error_str = "Can't perform zoom: no specific input plane" ;
		    }
		    else
		    {
		      var _ret_chunk, _ret_id, _ret_msg ;
		      if ( _tofit )
		      {
				     circles_lib_output( _out_channel, DISPATCH_INFO, "Detected 'to fit' input param", _par_1, _cmd_tag );
		         _ret_chunk = circles_lib_coordinates_zoomtofit( _plane_type, YES, NO, YES, _out_channel );
		         _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], RET_ERROR ) : RET_ERROR ;
		         _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
		         if ( _ret_id == RET_ERROR )
		         {
							 _b_fail = YES, _error_str = _ret_msg ;
						 }
						 else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
		      }
		      else
		      {
						 if ( _params_assoc_array['default'] )
						 {
							 if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
							 {
                 _glob_zplaneLEFT = _planeLEFT ;
                 _glob_zplaneRIGHT = _planeRIGHT ;
                 _glob_zplaneTOP = _planeTOP ;
                 _glob_zplaneBOTTOM = _planeBOTTOM ;
                 zplane_sm.set_coords_rect( new rect( _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
							 }
											              
							 if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
							 {
                 _glob_wplaneLEFT = _planeLEFT ;
                 _glob_wplaneRIGHT = _planeRIGHT ;
                 _glob_wplaneTOP = _planeTOP ;
                 _glob_wplaneBOTTOM = _planeBOTTOM ;
                 wplane_sm.set_coords_rect( new rect( _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
							 }
											              
							 if ( _plane_type.is_one_of( BIP_BOX, ALL_PLANES ) )
							 {
                 _glob_bipLEFT = _planeLEFT ;
                 _glob_bipRIGHT = _planeRIGHT ;
                 _glob_bipTOP = _planeTOP ;
                 _glob_bipBOTTOM = _planeBOTTOM ;
                 bipbox_sm.set_coords_rect( new rect( _glob_bipLEFT, _glob_bipLEFT, _glob_bipRIGHT, _glob_bipBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
							 }

						   circles_lib_output( _out_channel, DISPATCH_SUCCESS, _plane_def + ": coords restored to default values with success", _par_1, _cmd_tag );
						 }

		         var _abs_zf = Math.abs( _zf ), _viewport_width = 0;
		         if ( _zf != 0 )
		         {
			         var _zoom_str = ( _zf > 0 ? "Zoomin' in the " : "Zoomin' out the " ) + _plane_def + " by factor " + _abs_zf;
			         circles_lib_output( _out_channel, DISPATCH_INFO, _zoom_str, _par_1, _cmd_tag );
			         switch( _plane_type )
			         {
						 			case Z_PLANE:
                  _viewport_width = zplane_sm.get_coords_rect().width();
                  _viewport_width -= _zoom_rate * _zf ;
                  if ( !is_point( _center_pt ) ) _center_pt = zplane_sm.get_coords_rect().center_pt();
						 			break ;
						 			case W_PLANE:
                  _viewport_width = wplane_sm.get_coords_rect().width();
                  _viewport_width -= _zoom_rate * _zf ;
                  if ( !is_point( _center_pt ) ) _center_pt = wplane_sm.get_coords_rect().center_pt();
						 			break ;
						 			case BIP_BOX:
                  _viewport_width = bipbox_sm.get_coords_rect().width();
                  _viewport_width -= _zoom_rate * _zf ;
                  if ( !is_point( _center_pt ) ) _center_pt = bipbox_sm.get_coords_rect().center_pt();
						 			break ;
	                default: break ;
							 }
						 }
						 else
             {
               _viewport_width = _side ;
							 if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
							 {
                 _glob_zplaneLEFT = _center_pt.x - _side / 2.0 ;
                 _glob_zplaneRIGHT = _center_pt.x + _side / 2.0 ;
                 _glob_zplaneTOP = _center_pt.y + _side / 2.0 ;
                 _glob_zplaneBOTTOM = _center_pt.y - _side / 2.0 ;
                 zplane_sm.set_coords_rect( new rect( _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
							 }

							 if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
							 {
                 _glob_wplaneLEFT = _center_pt.x - _side / 2.0 ;
                 _glob_wplaneRIGHT = _center_pt.x + _side / 2.0 ;
                 _glob_wplaneTOP = _center_pt.y + _side / 2.0 ;
                 _glob_wplaneBOTTOM = _center_pt.y - _side / 2.0 ;
                 wplane_sm.set_coords_rect( new rect( _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
							 }

							 if ( _plane_type.is_one_of( BIP_BOX, ALL_PLANES ) )
							 {
                 _glob_bipLEFT = _center_pt.x - _side / 2.0 ;
                 _glob_bipRIGHT = _center_pt.x + _side / 2.0 ;
                 _glob_bipTOP = _center_pt.y + _side / 2.0 ;
                 _glob_bipBOTTOM = _center_pt.y - _side / 2.0 ;
                 bipbox_sm.set_coords_rect( new rect( _glob_bipLEFT, _glob_bipLEFT, _glob_bipRIGHT, _glob_bipBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
							 }
             }

             _ret_chunk = function_exists( "CIRCLESformsCOORDINATESinputMANAGER" ) ? CIRCLESformsCOORDINATESinputMANAGER( _plane_type, _render, null,
													ZOOM_SET_NEW_COORDS, new complex( _center_pt.x, _center_pt.y ), _viewport_width, NO, YES, _out_channel ) : null ;
             if ( is_array( _ret_chunk ) )
             {
               _ret_id = safe_int( _ret_chunk[0], NO ), _ret_msg = _ret_chunk[1] ;
  			       circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_WARNING, _plane_def + " : " + _ret_msg, _par_1, _cmd_tag );
  						 if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
  						 {
  							 _glob_terminal_change = YES ;
  						   circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
  						 }
             }
					}
				}
		    break ;
		  }

      if ( _render )
      {
        var _sd_n = circles_lib_count_seeds();
        if ( _sd_n > 0 )
        {
          var _new_params = ( _dest_plane_cmd.length == 0 || _dest_plane_cmd.strcmp( _undef_plane ) ) ? _src_plane_cmd : _dest_plane_cmd ;
          if ( _clean )  _new_params += " clean" ;
          if ( _silent ) _new_params += " silent" ;
          circles_lib_terminal_interpreter( "refresh " + _new_params, _glob_terminal, _out_channel );
          circles_lib_output( _out_channel, DISPATCH_INFO, "Now render the " + _plane_def, _par_1, _cmd_tag );
        }
        else circles_lib_output( _out_channel, DISPATCH_WARNING, "Rendering has been skipped: no registered seeds", _par_1, _cmd_tag );
      }
		}
  }
  else
  {
    _b_fail = YES, _error_str = "Missing input params" ;
  }
     
  if ( _b_fail && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + _glob_crlf + "Type '"+_cmd_tag+" /h' for syntax help", _par_1, _cmd_tag );
  if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
  else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}