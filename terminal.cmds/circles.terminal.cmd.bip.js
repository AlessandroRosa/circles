_glob_terminal_cmd_files_include['bip'] = [];

function circles_terminal_cmd_bip()
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
    else if ( _params.length > 0 )
    {
        _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
        _params_assoc_array['keywords'] = NO ;
        _params_assoc_array['help'] = NO ;
        _params_assoc_array['dump'] = NO ;
        _params_assoc_array['dump_array'] = null ;
        _params_assoc_array['dump_operator_index'] = UNDET ;

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); 
        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [];
    	_local_cmds_params_array.push( "center", "clean", "close", "coords",
                                       "eps", "help", "html", "objects", "off", "on", "open", "ps",
                                       "render", "save", "settings", "shorterside", "silent", "svg", "bipbox",
									   "wplane", "xextent", "yextent", "zplane" );
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
		var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
		_params_assoc_array['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
		_params_assoc_array['dump_operator_index'] = _dump_operator_index ;
		_params_assoc_array['dump_array'] = [];

        // distribute all input values into arrays of categories
        var _p, _b_cmd_open = NO ;
		// gather all dump parameters into one array
        if ( _params_assoc_array['dump'] )
        {
            _params_assoc_array['coordsdiagram'] = "bipbox" ;
            circles_lib_output( _output_channel, DISPATCH_INFO, "BIP params are being set up according to user-defined input", _par_1, _cmd_tag );
            for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
    		if ( _params_array[_i].trim().length > 0 ) _params_assoc_array['dump_array'].push( _params_array[_i] );
        }

        // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
        var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
        for( var _i = 0 ; _i < _up_to_index ; _i++ )
        {
            _p = _params_array[_i];
            if ( _p.toLowerCase().is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
			else if ( _params_assoc_array['action'] == "save" ) _params_assoc_array['filename'] = safe_string( _p, "" );
            else if ( _p.is_one_of_i( "on", "open" ) )
            {
                _params_assoc_array['activation'] = YES ;
                _params_assoc_array['toggle'] = _p ;
            }
            else if ( _p.is_one_of_i( "close", "off" ) )
            {
                _params_assoc_array['activation'] = NO ;
                _params_assoc_array['toggle'] = _p.toLowerCase() ;
            }
            else if ( _p.stricmp( "silent" ) ) _params_assoc_array['silent'] = YES ;
            else if ( _p.is_one_of_i( "objects", "center", "coords", "xextent", "yextent", "shorterside", "background" ) )
                 _params_assoc_array['inputparamlabel'] = _p.toLowerCase() ;
            else if ( _p.is_one_of_i( "zplane", "wplane", "bipbox" ) )
            {
				switch( _params_assoc_array['action'] )
				{
					case "acquire":
					switch( _p.toLowerCase() )
					{
					   case "zplane": _glob_bip_original_plane_coords = _glob_bip_original_plane_data = Z_PLANE ; break ;
					   case "wplane": _glob_bip_original_plane_coords = _glob_bip_original_plane_data = W_PLANE ; break ;
					   case "bipbox": _glob_bip_original_plane_coords = _glob_bip_original_plane_data = BIP_BOX ; break ;
					   default: _glob_bip_original_plane_coords = NO_PLANE ; break ;
					}
					break ;
					default:
					if ( _params_assoc_array['inputparamlabel'] != null )
					{
						switch( _params_assoc_array['inputparamlabel'] )
						{
							case "coords":
							if ( _p.is_one_of_i( "zplane", "wplane", "bipbox" ) ) _params_assoc_array['coordsdiagram'] = _p.toLowerCase() ;
							break ;
							case "objects":
							if ( _p.is_one_of_i( "zplane", "wplane" ) ) _params_assoc_array['datadiagram'] = _p.toLowerCase() ;
							break ;
							default:
							if ( _p.is_one_of_i( "zplane", "wplane", "bipbox" ) ) _params_assoc_array['coordsdiagram'] = _p.toLowerCase() ;
							break ;
						}
					}

					if ( _params_assoc_array['datadiagram'] != null )
					{
						switch( _params_assoc_array['datadiagram'].toLowerCase() )
						{
						   case "zplane": _glob_bip_original_plane_data = Z_PLANE ; break ;
						   case "wplane": _glob_bip_original_plane_data = W_PLANE ; break ;
						   default: _glob_bip_original_plane_data = NO_PLANE ; break ;
						}
						_params_assoc_array['action'] = "apply" ;
					}

					if ( _params_assoc_array['coordsdiagram'] != null )
					{
						switch( _params_assoc_array['coordsdiagram'].toLowerCase() )
						{
						   case "zplane": _glob_bip_original_plane_coords = Z_PLANE ; break ;
						   case "wplane": _glob_bip_original_plane_coords = W_PLANE ; break ;
						   case "bipbox": _glob_bip_original_plane_coords = BIP_BOX ; break ;
						   default: _glob_bip_original_plane_coords = NO_PLANE ; break ;
						}
						_params_assoc_array['action'] = "apply" ;
					}
					break ;
				}
            }
            else if ( _p.stricmp( "svg" ) ) _params_assoc_array['svg'] = YES ;
            else if ( _p.stricmp( "ps" ) ) _params_assoc_array['ps'] = YES ;
            else if ( _p.stricmp( "eps" ) ) _params_assoc_array['eps'] = YES ;
            else if ( _p.testME( _glob_positive_float_regex_pattern ) )
            {
                if ( _params_assoc_array['inputparamlabel'] == "xextent" ) _params_assoc_array['xextent'] = safe_float( _p, 0 );
                else if ( _params_assoc_array['inputparamlabel'] == "yextent" ) _params_assoc_array['yextent'] = safe_float( _p, 0 );
                else if ( _params_assoc_array['inputparamlabel'] == "shorterside" ) _params_assoc_array['shorterside'] = safe_float( _p, 0 );
                _params_assoc_array['action'] = "apply" ;
            }
            else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
            {
                _params_assoc_array['center'] = _p ;
				console.log( _params_assoc_array['center'] );
                var _str = _params_assoc_array['center'].replaceAll( [ "(", ")" ], "" );
                var _separator = ( _str.includes( "," ) ) ? "," : ( _str.includes( ";" ) ? ";" : "" );
                if ( _separator.length == 1 )
                {
                    var _coords_array = _str.split( _separator );
                    if ( _coords_array != null )
                    {
                       _coords_array[0] = safe_float( _coords_array[0], 0 );
                       _coords_array[1] = safe_float( _coords_array[1], 0 );
                       _params_assoc_array['center'] = new point( _coords_array[0], _coords_array[1] );
                    }
                    else _params_assoc_array['center'] = null ;
                }
                _params_assoc_array['action'] = "apply" ;
            }
            else if ( circles_lib_colors_is_def( _p ) )
			{
				_params_assoc_array['background'] = _p ;
                _params_assoc_array['action'] = "apply" ;
			}
            else if ( _p.is_one_of_i( "acquire", "apply", "clean", "settings", "preview", "render", "release", "save" ) ) _params_assoc_array['action'] = _p ;
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 ); }
        }

        if ( _params_assoc_array['svg'] != null ) _glob_export_format = EXPORT_SVG ;
        else if ( _params_assoc_array['png'] != null ) _glob_export_format = EXPORT_PNG ;
        else if ( _params_assoc_array['ps'] != null ) _glob_export_format = EXPORT_PS ;
        else if ( _params_assoc_array['eps'] != null ) _glob_export_format = EXPORT_EPS ;
        else if ( _params_assoc_array['latex'] != null ) _glob_export_format = EXPORT_LATEX ;
        else _glob_export_format = EXPORT_NONE ;

        if ( _params_assoc_array['help'] )
		{
			circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _output_channel );
			_output_channel = OUTPUT_TERMINAL ;
		}
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
        else if ( _params_assoc_array['action'] != null )
        {
            var _action = _params_assoc_array['action'] ;
            if ( !_glob_bip_use && !_action.is_one_of( "settings", "preview" ) )
            {
                _b_fail = YES, _error_str = "BIP action '"+_params_assoc_array['action']+"' requires the flag 'on' to take effect" ;
            }
            else
            {
                switch( _action )
                {
                   case "acquire":
                   var _coords_rect = null, _display_rect = null ;
                   switch( _glob_bip_original_plane_coords )
                   {
                      case Z_PLANE:
                      _coords_rect = zplane_sm.get_coords_rect();
                      _display_rect = zplane_sm.get_display_rect();
					  _params_assoc_array['coordsdiagram'] = _glob_bip_original_plane_coords ;
                      break ;
                      case W_PLANE:
                      _coords_rect = wplane_sm.get_coords_rect();
                      _display_rect = wplane_sm.get_display_rect();
					  _params_assoc_array['coordsdiagram'] = _glob_bip_original_plane_coords ;
                      break ;
					  default: break ;
                   }
				   
                   if ( _coords_rect != null && _display_rect != null )
                   {
					  var _tmp_applied_settings_mask = 0 ;
					  if ( _params_assoc_array['coordsdiagram'] != null ) _tmp_applied_settings_mask |= 1 ;

					  var _corners = bipbox_sm.get_coords_corners();
                      _glob_bip_x_extent = _coords_rect.width();
                      _glob_bip_y_extent = _coords_rect.height();
                      _glob_bip_box_center_pt = _coords_rect.center_pt();
                      _glob_bip_shorterside_pixels = Math.min( _display_rect.width(), _display_rect.height() );
					  var _tmp_applied_settings_mask = 1|2|4|8|16|32 ; // all settings

                      var _ret_chunk = circles_lib_terminal_bip_apply( OUTPUT_TERMINAL, _tmp_applied_settings_mask, _par_1, _cmd_tag );
                      var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                      var _ret_msg = is_array( _ret_chunk ) ? new String( _ret_chunk[1] ).trim() : "Apply settings: memory failure" ;
						  circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                      var _ret_errmask = is_array( _ret_chunk ) ? _ret_chunk[2] : null ;
                          _ret_msg = circles_lib_terminal_bip_apply_error_manager( _tmp_applied_settings_mask, _ret_id, _ret_errmask );

					  circles_lib_output( _output_channel, DISPATCH_INFO, _ret_msg, _par_1, _cmd_tag );
                      circles_lib_output( _output_channel, DISPATCH_INFO, "Bip box coordinates has been acquired from " + circles_lib_plane_def_get( _glob_bip_original_plane_coords ) + " with success", _par_1, _cmd_tag );
                      circles_lib_output( _output_channel, DISPATCH_INFO, "Bip Box - cartesian X extent is "+_glob_bip_x_extent, _par_1, _cmd_tag );
                      circles_lib_output( _output_channel, DISPATCH_INFO, "Bip Box - cartesian Y extent is "+_glob_bip_y_extent, _par_1, _cmd_tag );
                      circles_lib_output( _output_channel, DISPATCH_INFO, "Bip Box - center at "+_glob_bip_box_center_pt.output(), _par_1, _cmd_tag );
                      circles_lib_output( _output_channel, DISPATCH_INFO, "Bip Box shorter side in pixels : "+_glob_bip_shorterside_pixels, _par_1, _cmd_tag );
                      circles_lib_output( _output_channel, DISPATCH_INFO, "Bip Box - left up corner : "+( _corners['lu'] != null ? ( ( _corners['lu'].x + ", " + _corners['lu'].y ) ) : "undefined" ), _par_1, _cmd_tag );
                      circles_lib_output( _output_channel, DISPATCH_INFO, "Bip Box - right down corner : "+( _corners['rd'] != null ? ( ( _corners['rd'].x + ", " + _corners['rd'].y ) ) : "undefined" ), _par_1, _cmd_tag );

					  _ret_msg = "<white>Type 'bip settings' to resume all settings</white>" ;
					  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _ret_msg, _par_1, _cmd_tag );
					  _ret_msg = "<white>Type 'bip render' to accomplish last changes</white>" ;
					  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _ret_msg, _par_1, _cmd_tag );
                   }
                   else if ( _glob_bip_original_plane_coords == BIP_BOX )
                       circles_lib_output( _output_channel, DISPATCH_WARNING, "Current coords are user defined, thus they have to be manually input", _par_1, _cmd_tag );
                   else { _b_fail = YES, _error_str = "Can't acquire coords because the BIP source for coords is not a conventional plane ('Z-plane' or 'W-plane')" ; }
                   break;
                   case "apply":
                   var _tmp_applied_settings_mask = 0 ;
                   if ( _params_assoc_array['coordsdiagram'] != null ) _tmp_applied_settings_mask |= 1 ;
                   if ( _params_assoc_array['datadiagram'] != null ) _tmp_applied_settings_mask |= 2 ;
                   if ( _params_assoc_array['center'] != null ) _tmp_applied_settings_mask |= 4 ;
                   if ( _params_assoc_array['background'] != null ) _tmp_applied_settings_mask |= 8 ;
                   if ( _params_assoc_array['xextent'] != null ) _tmp_applied_settings_mask |= 16 ;
                   if ( _params_assoc_array['yextent'] != null ) _tmp_applied_settings_mask |= 32 ;
                   if ( _params_assoc_array['shorterside'] != null ) _tmp_applied_settings_mask |= 64 ;

                   //_glob_bip_original_plane_coords ... already set up during params scan
                   //_glob_bip_original_plane_data ... already set up during params scan
				   if ( _params_assoc_array['coordsdiagram'] != null )
				   {
					  var _coords_rect = zplane_sm.get_coords_rect();
                      _glob_bip_x_extent = _coords_rect.width();
                      _glob_bip_y_extent = _coords_rect.height();
				   }
                   _glob_bip_box_center_pt = ( _params_assoc_array['center'] != null ) ? _params_assoc_array['center'] : _glob_bip_box_center_pt ;
                   _glob_bip_bk = ( _params_assoc_array['background'] != null ) ? _params_assoc_array['background'] : _glob_bip_bk ;
                   _glob_bip_x_extent = ( _params_assoc_array['xextent'] != null ) ? _params_assoc_array['xextent'] : _glob_bip_x_extent ;
                   _glob_bip_y_extent = ( _params_assoc_array['yextent'] != null ) ? _params_assoc_array['yextent'] : _glob_bip_y_extent ;
                   _glob_bip_shorterside_pixels = ( _params_assoc_array['shorterside'] != null ) ? _params_assoc_array['shorterside'] : _glob_bip_shorterside_pixels ;
                   if ( _tmp_applied_settings_mask > 0 )
                   {
                      var _ret_chunk = circles_lib_terminal_bip_apply( OUTPUT_TERMINAL, _tmp_applied_settings_mask, _par_1, _cmd_tag );
                      var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                      var _ret_msg = is_array( _ret_chunk ) ? new String( _ret_chunk[1] ).trim() : "Apply settings: memory failure" ;
						  circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                      var _ret_errmask = is_array( _ret_chunk ) ? _ret_chunk[2] : null ;
						  _ret_msg = circles_lib_terminal_bip_apply_error_manager( _tmp_applied_settings_mask, _ret_id, _ret_errmask );
						  _ret_msg = _ret_msg.trim();
					  circles_lib_output( _output_channel, DISPATCH_INFO, _ret_msg, _par_1, _cmd_tag );
					  _ret_msg = "<white>Type 'bip settings' to resume all settings</white>" ;
					  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _ret_msg, _par_1, _cmd_tag );
					  _ret_msg = "<white>Type 'bip render' to accomplish last changes</white>" ;
					  circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _ret_msg, _par_1, _cmd_tag );
                   }
                   else { _b_fail = YES, _error_str = "Missing or invalid input BIP params" ; }
                   break ;
                   case "clean":
                   if ( is_html_canvas( _glob_bip_canvas ) )
                   {
                      _glob_bip_canvas.getContext( _glob_canvas_ctx_2D_mode ).label = "bip" ;
                      var _canvas_width = _glob_bip_canvas.get_width(), _canvas_height = _glob_bip_canvas.get_height();
                      var _ret_chunk = circles_lib_canvas_clean( _glob_bip_canvas, _glob_bip_bk, _output_channel );
                      _glob_bip_bk = ( circles_lib_colors_get_formats( _glob_bip_bk ) )[COLOR_RGB_HEX] ;
                      _glob_bip_canvas.getContext( _glob_canvas_ctx_2D_mode ).backgroundColor = _glob_bip_bk ;

                      var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                      var _ret_msg = is_array( _ret_chunk ) ? new String( _ret_chunk[1] ).trim() : "Fail to clean" ;
                      circles_lib_output( _output_channel, _ret_id == 1 ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                   }
                   else { _b_fail = YES, _error_str = "Memory failure: cannot get the bip canvas to clean up" ; }
                   break ;
                   case "settings":
                   var _html = _params_assoc_array['html'] ;
				   var _is_canvas = is_html_canvas( _glob_bip_canvas ) ;
				   var _bk_color = _glob_bip_canvas.get_backgroundcolor() ;
                   var _canvas_w = _is_canvas ? _glob_bip_canvas.get_width() : 0 ;
                   var _canvas_h = _is_canvas ? _glob_bip_canvas.get_height() : 0 ;
                   var _canvas_bk = _is_canvas ? ( ( _bk_color != null && _bk_color != UNDEF ) ? _bk_color : "transparent" ) : "transparent" ;
                       _canvas_bk = _canvas_bk.replaceAll( " ", "").strcmp( "rgba(0,0,0,0)" ) ? "transparent" : _canvas_bk ;
                   var _bk_tag = ( circles_lib_colors_get_formats( _canvas_bk ) )[COLOR_TAG] ;
                   var _corners = bipbox_sm.get_coords_corners();
                   var _center_x = is_point( _glob_bip_box_center_pt ) ? _glob_bip_box_center_pt.x : "none" ;
                   var _center_y = is_point( _glob_bip_box_center_pt ) ? _glob_bip_box_center_pt.y : "none" ;
                   var _data_diagram_label = "" ;
                   var _coords_diagram_label = "" ;
                   switch( _glob_bip_original_plane_data )
                   {
                      case Z_PLANE: _data_diagram_label = "Z-plane" ; break ;
                      case W_PLANE: _data_diagram_label = "W-plane" ; break ;
                      default: _data_diagram_label = "Undetermined plane" ; break ;
                   }

                   switch( _glob_bip_original_plane_coords )
                   {
                      case Z_PLANE: _coords_diagram_label = "Z-plane" ; break ;
                      case W_PLANE: _coords_diagram_label = "W-plane" ; break ;
                      case BIP_BOX: _coords_diagram_label = "User-defined coords" ; break ;
                      case NO_PLANE: default: _coords_diagram_label = "Undetermined" ; break ;
                   }

                        var _open_fontcolor_tag = "", _close_fontcolor_tag = "", _MSG = "" ;
                        _MSG += "<snow>Bip box service activated</snow> " + ( _glob_bip_use ? "<greenshock>Yes</greenshock>" : "<orange>No</orange>" ) + _glob_crlf ;

                        _open_fontcolor_tag = _canvas_w == 0 ? "<red>" : "<greenshock>" ;
                        _close_fontcolor_tag = _canvas_w == 0 ? "</red>" : "</greenshock>" ;
                        _MSG += "<snow>BIP box logical width</snow> " + _open_fontcolor_tag + _canvas_w + " pixel" + ( ( _canvas_w == 1 ) ? "" : "s" ) + _close_fontcolor_tag + _glob_crlf;

                        _open_fontcolor_tag = _canvas_h == 0 ? "<red>" : "<greenshock>" ;
                        _close_fontcolor_tag = _canvas_h == 0 ? "</red>" : "</greenshock>" ;
                        _MSG += "<snow>BIP box logical height</snow> " + _open_fontcolor_tag + _canvas_h + " pixel" + ( ( _canvas_h == 1 ) ? "" : "s" ) + _close_fontcolor_tag + _glob_crlf ;

                        _open_fontcolor_tag = _glob_bip_shorterside_pixels == 0 ? "<red>" : "<greenshock>" ;
                        _close_fontcolor_tag = _glob_bip_shorterside_pixels == 0 ? "</red>" : "</greenshock>" ;
                        _MSG += "<snow>Bip box shorter logical side</snow> " + _open_fontcolor_tag + _glob_bip_shorterside_pixels + " pixel" + ( _canvas_w == 1 ? "" : "s" ) + _close_fontcolor_tag + _glob_crlf ;
                        
						_MSG += "<snow>Bip cartesian region - center at</snow> " + ( is_point( _glob_bip_box_center_pt ) ? ( "<greenshock>x:" + _center_x + ", y:" + _center_y + "</greenshock>" ) : "<red>none</red>" )  + _glob_crlf ;

                        _open_fontcolor_tag = _glob_bip_x_extent == 0 ? "<red>" : "<greenshock>" ;
                        _close_fontcolor_tag = _glob_bip_x_extent == 0 ? "</red>" : "</greenshock>" ;
                        _MSG += "<snow>Bip cartesian region - X-extent</snow> " + _open_fontcolor_tag + _glob_bip_x_extent + _close_fontcolor_tag + _glob_crlf ;

                        _open_fontcolor_tag = _glob_bip_y_extent == 0 ? "<red>" : "<greenshock>" ;
                        _close_fontcolor_tag = _glob_bip_y_extent == 0 ? "</red>" : "</greenshock>" ;
                        _MSG += "<snow>Bip cartesian region - Y-extent</snow> " + _open_fontcolor_tag + _glob_bip_y_extent + _close_fontcolor_tag + _glob_crlf ;

                        _MSG += "<snow>Bip cartesian region - cartesian Left-up corner</snow> " + ( _corners['lu'] != null ? ( "<greenshock>" + ( _corners['lu'].x + ", " + _corners['lu'].y ) + "</greenshock>" ) : "<red>Undetermined</red>" );
                        _MSG += _glob_crlf ;
                        _MSG += "<snow>Bip cartesian region - cartesian Right-down corner</snow> " + ( _corners['rd'] != null ? ( "<greenshock>" + ( _corners['rd'].x + ", " + _corners['rd'].y ) + "</greenshock>" ) : "<red>Undetermined</red>" );
                        _MSG += _glob_crlf ;
                        _MSG += "<snow>Bip cartesian region - Background color is</snow> " + (_canvas_bk=="transparent"?"<white>"+_canvas_bk+"</white>":_canvas_bk) + ( ( _bk_tag.length > 0 && _bk_tag != "tag.transparent" ) ? " ("+_bk_tag+")" : "" ) + _glob_crlf;

                        _open_fontcolor_tag = _glob_bip_original_plane_coords == NO_PLANE ? "<red>" : "<greenshock>" ;
                        _close_fontcolor_tag = _glob_bip_original_plane_coords == NO_PLANE ? "</red>" : "</greenshock>" ;
                        _MSG += "<snow>Pick coordinates from</snow> " + _open_fontcolor_tag + _coords_diagram_label + _close_fontcolor_tag + _glob_crlf ;

                        _open_fontcolor_tag = _glob_bip_original_plane_data == NO_PLANE ? "<red>" : "<greenshock>" ;
                        _close_fontcolor_tag = _glob_bip_original_plane_data == NO_PLANE ? "</red>" : "</greenshock>" ;
                        _MSG += "<snow>Pick objects from </snow> " + _open_fontcolor_tag + _data_diagram_label + _close_fontcolor_tag + _glob_crlf ;

                        switch( _glob_export_format )
                        {
                            case EXPORT_NONE: case EXPORT_PNG: _MSG += "<snow>Export to</snow> <green>PNG format (default)</green>" ; break ;
                            case EXPORT_SVG: _MSG += "<snow>Export to</snow> <green>SVG format</green>" ; break ;
                            case EXPORT_PS: _MSG += "<snow>Export to</snow> <green>PS format</green>" ; break ;
                            case EXPORT_EPS: _MSG += "<snow>Export to</snow> <green>EPS format</green>" ; break ;
                            case EXPORT_LATEX: _MSG += "<snow>Export to</snow> <green>LaTeX format</green>" ; break ;
                            default: _MSG += "<orange>Export to</snow> <gray>UNKNOWN format</gray>" ; break ;
                        }

                        if ( _html ) circles_lib_terminal_color_decode_htmltext( _MSG, 'bip', 'right', 'top' );
                        else circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _MSG, _par_1, _cmd_tag );

                    if ( _params_assoc_array['dump'] )
                    {
						_params_assoc_array['dump_array'] = is_array( _params_assoc_array['dump_array'] ) ? _params_assoc_array['dump_array'][0] : "circles.bip.list.txt" ;
                        var _ret_chunk = circles_lib_dump_data_to_format( _MSG.strip_tags(), _params_assoc_array['dump_array'] );
						var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
						var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
     					circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                    }
					_output_channel = OUTPUT_TERMINAL ;
                   break ;
                   case "preview":
                   var _canvas_id = "TERMINALbipCANVAS" + unixtime();
                   circles_lib_terminal_html_display( _glob_terminal, "<table><tr><td HEIGHT=\"12\"></td></tr><tr><td><CANVAS WIDTH=\""+CANVAS_SIZE+"\" HEIGHT=\""+CANVAS_SIZE+"\" STYLE=\"width:100%;height:70px;\" ID=\""+_canvas_id+"\"></CANVAS></td></tr><tr><td HEIGHT=\"12\"></td></tr></table>" );
                   var _ret_chunk = circles_lib_canvas_layer_copy( "CIRCLESbipCANVAS", _canvas_id, UNDET, 70 );
       			   var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
          		   var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
          		   if ( _ret_id == 0 ) { _b_fail = YES, _error_str = _ret_msg ; }
          		   else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                   break ;
                   case "release":
                   circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                   break ;
                   case "render":
                   _glob_persistent_vars['old_plane_type'] = _glob_target_plane ;
                   _glob_target_plane = BIP_BOX ;
                   var _silent = _params_assoc_array['silent'] != null ? _params_assoc_array['silent'] : _glob_terminal_silent ;
                   var _ret_chunk = circles_lib_bip_render( _silent, _output_channel );
                   var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                   var _ret_msg = is_array( _ret_chunk ) ? new String( _ret_chunk[1] ) : "Rendering: memory failure" ;
                       _ret_msg = _ret_msg.trim();
                   circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
				   if ( _ret_id )
				   {
					   _ret_msg = "Bip session has been closed after rendering, for data safety reasons." ;
					   circles_lib_output( _output_channel, DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
					   _ret_msg = "\nIf you want to save it, please open the bip session again" ;
					   circles_lib_output( _output_channel, DISPATCH_INFO, _ret_msg, _par_1, _cmd_tag );
				   }
                   else circles_lib_output( _output_channel, DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                   break ;
                   case "save":
                   var _err_mask = circles_lib_bip_check_params();
                   _glob_bip_halt = _err_mask ? YES : NO ;
                   if ( _glob_bip_halt ) { _b_fail = YES, _error_str = "An error occurred while setting params: please, check that all values are valid" ; }
				   else if ( _glob_worker_lock ) { _b_fail = YES, _error_str = "Fail to save BIP box data into a picture: a process is still running" ; }
                   else
                   {
                       var _filename = ""  ;
					   if ( _params_assoc_array['filename'] != null ) _filename = _params_assoc_array['filename'] ;
					   else
					   {
						   _filename = "circles.bip." ;
						   switch( _glob_export_format )
						   {
							  case EXPORT_NONE: case EXPORT_PNG: _filename += "png" ; break ;
							  case EXPORT_SVG: _filename += "svg" ; break ;
							  case EXPORT_PS: _filename += "ps" ; break ;
							  case EXPORT_EPS: _filename += "eps" ; break ;
							  case EXPORT_LATEX: _filename += "tex" ; break ;
							  default: break ;
						   }
					   }
                       var _ret_chunk = circles_lib_files_pix_save_ask( BIP_BOX, _glob_bip_canvas.id, _filename, YES, YES, _output_channel );
                       var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                       var _ret_msg = is_array( _ret_chunk ) ? new String( _ret_chunk[1] ).trim() : "Saving: Memory failure" ;
                       circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                   }
                   break ;
                }
            }
         }
         else if ( _params_assoc_array['toggle'] != null )
         {
            var _toggle = _params_assoc_array['toggle'] ;
            switch( _toggle )
            {
                case "on":
                case "off":
                var _items_n = circles_lib_count_items();
                if ( _items_n.is_one_of( 0, UNDET ) && _toggle.strcmp( "on" ) )
                {
                    _b_fail = YES, _error_str = "Can't toggle BIP on: no disks configuration detected" ;
                }
                else
                {
                    var _on = _toggle.strcmp( "on" ) ? YES : NO ;
                    var _activation = ( _params_assoc_array['activation'] != null ) ? ( _params_assoc_array['activation'] ? YES : NO ) : NO ;
                    var _already = ( _glob_bip_use == _activation ) ? YES : NO ;
                    _glob_bip_use = _activation ;
                    _glob_target_plane = _glob_bip_use ? _glob_bip_original_plane_data : W_PLANE ;
                    circles_lib_bip_activate( _glob_bip_use, _output_channel );
                    circles_lib_output( _output_channel, _already ? DISPATCH_INFO : DISPATCH_SUCCESS, "Bip session has been "+( _already ? "already " : "" )+( _glob_bip_use ? "opened" : "closed" )+"", _par_1, _cmd_tag );
                    if ( _glob_verbose && !_already )
                    {
                        if ( _on ) circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "A new BIP session has been opened for further operations.\n<yellow>Except saving</yellow>, BIP actions can take place only in opened sessions", _par_1, _cmd_tag );
                        else circles_lib_output( _output_channel, DISPATCH_INFO, "This BIP session has been closed.\nNo further BIP operations can be run", _par_1, _cmd_tag );
                    }
                }
                break ;
			    default: break ;
            }
         }
    }
    else { _b_fail = YES, _error_str = "Missing input params" ; }
     
    if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + _glob_crlf + "Type '"+_cmd_tag+" /h' for syntax help", _par_1, _cmd_tag );
    if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function circles_lib_terminal_bip_apply_error_manager( _tmp_applied_settings_mask, _ret_id, _ret_errmask )
{
      var _ret_msg = "" ;
      if ( _ret_id == 0 && _ret_errmask != null )
      {
          _ret_msg = _glob_crlf + "The following errors in the candidate settings have been detected:" ;
          if ( _ret_errmask & 1 ) _ret_msg += _glob_crlf + "- BIP box width is not positive" ;
          if ( _ret_errmask & 2 ) _ret_msg += _glob_crlf + "- BIP box height is not positive" ;
          if ( _ret_errmask & 4 ) _ret_msg += _glob_crlf + "- BIP box center has not been input" ;
          if ( _ret_errmask & 8 ) _ret_msg += _glob_crlf + "- BIP box shorter side has not been input" ;
          if ( _ret_errmask & 16 ) _ret_msg += _glob_crlf + "- BIP box plane has not been input" ;
          if ( _ret_errmask & 32 ) _ret_msg += _glob_crlf + "- BIP box diagram side has not been input" ;
      }
      else
      {
          _ret_msg = _glob_crlf + "The following settings have been applied:" ;
          if ( _tmp_applied_settings_mask & 1 ) _ret_msg += _glob_crlf + "* Coordinates plane" ;
          if ( _tmp_applied_settings_mask & 2 ) _ret_msg += _glob_crlf + "* Objects plane" ;
          if ( _tmp_applied_settings_mask & 4 ) _ret_msg += _glob_crlf + "* Center" ;
          if ( _tmp_applied_settings_mask & 8 ) _ret_msg += _glob_crlf + "* Background color" ;
          if ( _tmp_applied_settings_mask & 16 ) _ret_msg += _glob_crlf + "* X-extent" ;
          if ( _tmp_applied_settings_mask & 32 ) _ret_msg += _glob_crlf + "* Y-extent" ;
          if ( _tmp_applied_settings_mask & 64 ) _ret_msg += _glob_crlf + "* Shorter side" ;
      }

      return _ret_msg ;
}

function circles_lib_terminal_bip_apply( _output_channel = OUTPUT_TERMINAL, _par_1 )
{
    var _tmp_applied_settings_mask = 0 ;
    var _ret_chunk = circles_lib_bip_apply_settings( _output_channel, !_glob_terminal_silent, _glob_terminal_silent, NO,
        _glob_bip_box_center_pt, _glob_bip_x_extent, _glob_bip_y_extent,
        _glob_bip_shorterside_pixels, _glob_bip_original_plane_coords, _glob_bip_original_plane_data, _glob_bip_bk );
    return _ret_chunk ;
}