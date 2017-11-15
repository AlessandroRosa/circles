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
    				 _local_cmds_params_array.push( "clean", "wplane", "list", "on", "off", "render", "save",
                                            "zplane", "silent", "svg", "eps", "ps", "userdef", "html", "help",
                                            "data", "center", "coords", "xextent", "yextent", "minside" );
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
             _params_assoc_array['coordsdiagram'] = "userdef" ;
             circles_lib_output( _output_channel, DISPATCH_INFO, "BIP params are being set up according to user-defined input", _par_1, _cmd_tag );
             for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
    				 if ( _params_array[_i].trim().length > 0 ) _params_assoc_array['dump_array'].push( _params_array[_i] );
         }

         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.stricmp( "on" ) )
              {
                 _params_assoc_array['activation'] = YES ;
                 _params_assoc_array['toggle'] = _p ;
              }
              else if ( _p.stricmp( "off" ) )
              {
                 _params_assoc_array['activation'] = NO ;
                 _params_assoc_array['toggle'] = _p ;
              }
              else if ( _p.stricmp( "silent" ) ) _params_assoc_array['silent'] = YES ;
              else if ( _p.is_one_of_i( "data", "center", "coords", "xextent", "yextent", "minside" ) )
              {
                 _params_assoc_array['inputparamlabel'] = _p ;
              }
              else if ( _p.is_one_of_i( "zplane", "wplane", "userdef" ) )
              {
                 if ( _params_assoc_array['inputparamlabel'] != null )
                 {
                    if ( _p.is_one_of_i( "zplane", "wplane" ) && _params_assoc_array['inputparamlabel'] == "data" )
                    _params_assoc_array['datadiagram'] = _p ;
                    else if ( _p.is_one_of_i( "zplane", "wplane", "userdef" ) && _params_assoc_array['inputparamlabel'] == "coords" )
                    _params_assoc_array['coordsdiagram'] = _p ;
                 }
                 else
                 {
                    if ( _p.is_one_of_i( "zplane", "wplane" ) && _params_assoc_array['datadiagram'] == null )
                    _params_assoc_array['datadiagram'] = _p ;
                    else if ( _p.is_one_of_i( "zplane", "wplane", "userdef" ) && _params_assoc_array['coordsdiagram'] == null )
                    _params_assoc_array['coordsdiagram'] = _p ;
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
                       case "userdef": _glob_bip_original_plane_coords = BIP_BOX ; break ;
                       default: _glob_bip_original_plane_coords = NO_PLANE ; break ;
                    }

                    _params_assoc_array['action'] = "apply" ;
                 }
              }
              else if ( _p.stricmp( "svg" ) ) _params_assoc_array['svg'] = YES ;
              else if ( _p.stricmp( "ps" ) ) _params_assoc_array['ps'] = YES ;
              else if ( _p.stricmp( "eps" ) ) _params_assoc_array['eps'] = YES ;
              else if ( _p.testME( _glob_positive_float_regex_pattern ) )
              {
                 if ( _params_assoc_array['xextent'] == null || _params_assoc_array['inputparamlabel'] == "xextent" ) _params_assoc_array['xextent'] = safe_float( _p, 0 );
                 else if ( _params_assoc_array['yextent'] == null || _params_assoc_array['inputparamlabel'] == "yextent" ) _params_assoc_array['yextent'] = safe_float( _p, 0 );
                 else if ( _params_assoc_array['minside'] == null || _params_assoc_array['inputparamlabel'] == "minside" ) _params_assoc_array['minside'] = safe_float( _p, 0 );
                 _params_assoc_array['action'] = "apply" ;
              }
              else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
              {
                 _params_assoc_array['center'] = _p ;

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
              else if ( circles_lib_colors_is_def( _p ) ) _params_assoc_array['bk'] = _p ;
              else if ( _p.is_one_of_i( "acquire", "apply", "clean", "list", "preview", "render", "release", "save" ) ) _params_assoc_array['action'] = _p ;
              else
              {
                 _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
              }
         }

        if ( _params_assoc_array['svg'] != null ) _glob_export_format = _params_assoc_array['svg'] ? EXPORT_SVG : EXPORT_NONE ;
        else if ( _params_assoc_array['ps'] != null ) _glob_export_format = _params_assoc_array['ps'] ? EXPORT_PS : EXPORT_NONE ;
        else if ( _params_assoc_array['eps'] != null ) _glob_export_format = _params_assoc_array['eps'] ? EXPORT_PS : EXPORT_NONE ;
        else if ( _params_assoc_array['latex'] != null ) _glob_export_format = _params_assoc_array['latex'] ? EXPORT_LATEX : EXPORT_NONE ;
        else _glob_export_format= EXPORT_NONE ;

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
        else if ( _params_assoc_array['action'] != null )
        {
            var _action = _params_assoc_array['action'] ;
            if ( !_glob_bip_use && !_action.is_one_of( "list", "preview" ) )
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
                      break ;
                      case W_PLANE:
                      _coords_rect = wplane_sm.get_coords_rect();
                      _display_rect = wplane_sm.get_display_rect();
                      break ;
									    default: break ;
                   }

                   if ( _coords_rect != null && _display_rect != null )
                   {
                      _glob_bip_x_extent = _coords_rect.width();
                      _glob_bip_y_extent = _coords_rect.height();
                      _glob_bip_box_center_pt = _coords_rect.center_pt();
                      _glob_bip_shorterside_pixels = Math.min( _display_rect.width(), _display_rect.height() );

                      circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Coords acquired from " + circles_lib_plane_get_def( _glob_bip_original_plane_coords ) + " with success", _par_1, _cmd_tag );

                      var _ret_chunk = circles_lib_terminal_bip_apply( _output_channel, _tmp_applied_settings_mask, _par_1, _cmd_tag );

                      var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                      var _ret_msg = is_array( _ret_chunk ) ? new String( _ret_chunk[1] ).trim() : "Apply settings: memory failure" ;
                      var _ret_errmask = is_array( _ret_chunk ) ? _ret_chunk[2] : null ;
                          _ret_msg += circles_lib_terminal_bip_apply_error_manager( _tmp_applied_settings_mask, _ret_id, _ret_errmask );
                          _ret_msg = _ret_msg.trim();

                      circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                   }
                   else if ( _glob_bip_original_plane_coords == BIP_BOX )
                       circles_lib_output( _output_channel, DISPATCH_WARNING, "Current coords are user defined, thus they have to be manually input", _par_1, _cmd_tag );
                   else
                   {
                       _b_fail = YES, _error_str = "Can't acquire coords because the BIP source for coords is not a conventional plane ('Z-plane' or 'W-plane')" ;
                   }
                   break;
                   case "apply":
                   var _tmp_applied_settings_mask = 0 ;
                   if ( _params_assoc_array['coordsdiagram'] != null ) _tmp_applied_settings_mask |= 1 ;
                   if ( _params_assoc_array['datadiagram'] != null ) _tmp_applied_settings_mask |= 2 ;
                   if ( _params_assoc_array['center'] != null ) _tmp_applied_settings_mask |= 4 ;
                   if ( _params_assoc_array['bk'] != null ) _tmp_applied_settings_mask |= 8 ;
                   if ( _params_assoc_array['xextent'] != null ) _tmp_applied_settings_mask |= 16 ;
                   if ( _params_assoc_array['yextent'] != null ) _tmp_applied_settings_mask |= 32 ;
                   if ( _params_assoc_array['minside'] != null ) _tmp_applied_settings_mask |= 64 ;

                   //_glob_bip_original_plane_coords ... already set up during params scan
                   //_glob_bip_original_plane_data ... already set up during params scan
                   _glob_bip_box_center_pt = ( _params_assoc_array['center'] != null ) ? _params_assoc_array['center'] : _glob_bip_box_center_pt ;
                   _glob_bip_bk = ( _params_assoc_array['bk'] != null ) ? _params_assoc_array['bk'] : _glob_bip_bk ;
                   _glob_bip_x_extent = ( _params_assoc_array['xextent'] != null ) ? _params_assoc_array['xextent'] : _glob_bip_x_extent ;
                   _glob_bip_y_extent = ( _params_assoc_array['yextent'] != null ) ? _params_assoc_array['yextent'] : _glob_bip_y_extent ;
                   _glob_bip_shorterside_pixels = ( _params_assoc_array['minside'] != null ) ? _params_assoc_array['minside'] : _glob_bip_shorterside_pixels ;

                   if ( _tmp_applied_settings_mask )
                   {
                      var _ret_chunk = circles_lib_terminal_bip_apply( _output_channel, _tmp_applied_settings_mask, _par_1, _cmd_tag );
                      var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                      var _ret_msg = is_array( _ret_chunk ) ? new String( _ret_chunk[1] ).trim() : "Apply settings: memory failure" ;
                      var _ret_errmask = is_array( _ret_chunk ) ? _ret_chunk[2] : null ;
                          _ret_msg += circles_lib_terminal_bip_apply_error_manager( _tmp_applied_settings_mask, _ret_id, _ret_errmask );
                          _ret_msg = _ret_msg.trim();

                      circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                   }
                   else
                   {
                      _b_fail = YES, _error_str = "Missing or invalid input BIP params" ;
                   }
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
                   else
                   {
                      _b_fail = YES, _error_str = "Memory failure: cannot get the bip canvas to clean up" ;
                   }
                   break ;
                   case "list":
                   var _html = _params_assoc_array['html'] != null ? YES : NO ;
                   var _canvas_w = is_html_canvas( _glob_bip_canvas ) ? _glob_bip_canvas.get_width() : 0 ;
                   var _canvas_h = is_html_canvas( _glob_bip_canvas ) ? _glob_bip_canvas.get_height() : 0 ;
                   var _canvas_bk = is_html_canvas( _glob_bip_canvas ) ? ( ( _glob_bip_canvas.get_backgroundcolor() != null && _glob_bip_canvas.get_backgroundcolor() != UNDEF ) ? _glob_bip_canvas.get_backgroundcolor() : "transparent" ) : "transparent" ;
                       _canvas_bk = ( _canvas_bk.replaceAll( " ", "").strcmp( "rgba(0,0,0,0)" ) ) ? "trasparent" : _canvas_bk ;
                   var _bk_tag = ( circles_lib_colors_get_formats( _canvas_bk ) )[COLOR_TAG] ;
                   var _corners = bipbox_sm.get_coords_corners();
                   var _center_x = ( is_point( _glob_bip_box_center_pt ) ) ? _glob_bip_box_center_pt.x : "none" ;
                   var _center_y = ( is_point( _glob_bip_box_center_pt ) ) ? _glob_bip_box_center_pt.y : "none" ;
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

                         var _open_fontcolor_tag = "", _close_fontcolor_tag = "" ;

                         var _MSG = "" ;
                         _MSG += "<snow>Activated</snow> " + ( _glob_bip_use ? "<greenshock>Yes</greenshock>" : "<orange>No</orange>" ) + _glob_crlf ;

                         _open_fontcolor_tag = ( _canvas_w == 0 ) ? "<red>" : "<greenshock>" ;
                         _close_fontcolor_tag = ( _canvas_w == 0 ) ? "</red>" : "</greenshock>" ;
                         _MSG += "<snow>BIP region width</snow> " + _open_fontcolor_tag + _canvas_w + " pixel" + ( ( _canvas_w == 1 ) ? "" : "s" ) + _close_fontcolor_tag + _glob_crlf;

                         _open_fontcolor_tag = ( _canvas_h == 0 ) ? "<red>" : "<greenshock>" ;
                         _close_fontcolor_tag = ( _canvas_h == 0 ) ? "</red>" : "</greenshock>" ;
                         _MSG += "<snow>BIP region height</snow> " + _open_fontcolor_tag + _canvas_h + " pixel" + ( ( _canvas_h == 1 ) ? "" : "s" ) + _close_fontcolor_tag + _glob_crlf ;

                         _open_fontcolor_tag = ( _glob_bip_shorterside_pixels == 0 ) ? "<red>" : "<greenshock>" ;
                         _close_fontcolor_tag = ( _glob_bip_shorterside_pixels == 0 ) ? "</red>" : "</greenshock>" ;
                         _MSG += "<snow>Minimum side</snow> " + _open_fontcolor_tag + _glob_bip_shorterside_pixels + " pixel" + ( ( _canvas_w == 1 ) ? "" : "s" ) + _close_fontcolor_tag + _glob_crlf ;
                         _MSG += "<snow>Plane centered at</snow> " + ( is_point( _glob_bip_box_center_pt ) ? ( "<greenshock>" + _center_x + "," + _center_y + "</greenshock>" ) : "<red>none</red>" )  + _glob_crlf ;

                         _open_fontcolor_tag = ( _glob_bip_x_extent == 0 ) ? "<red>" : "<greenshock>" ;
                         _close_fontcolor_tag = ( _glob_bip_x_extent == 0 ) ? "</red>" : "</greenshock>" ;
                         _MSG += "<snow>X-extent</snow> " + _open_fontcolor_tag + _glob_bip_x_extent + _close_fontcolor_tag + _glob_crlf ;

                         _open_fontcolor_tag = ( _glob_bip_y_extent == 0 ) ? "<red>" : "<greenshock>" ;
                         _close_fontcolor_tag = ( _glob_bip_y_extent == 0 ) ? "</red>" : "</greenshock>" ;
                         _MSG += "<snow>Y-extent</snow> " + _open_fontcolor_tag + _glob_bip_y_extent + _close_fontcolor_tag + _glob_crlf ;

                         _MSG += "<snow>Left-up corner</snow> " + ( ( _corners['lu'] != null ) ? ( "<greenshock>" + ( _corners['lu'].x + "," + _corners['lu'].y ) + "</greenshock>" ) : "<red>Undetermined</red>" );
                         _MSG += _glob_crlf ;
                         _MSG += "<snow>Right-down corner</snow> " + ( ( _corners['rd'] != null ) ? ( "<greenshock>" + ( _corners['rd'].x + "," + _corners['rd'].y ) + "</greenshock>" ) : "<red>Undetermined</red>" );
                         _MSG += _glob_crlf ;

                         _MSG += "<snow>Background color</snow> " + _canvas_bk + ( ( _bk_tag.length > 0 && _bk_tag != "transparent" ) ? " ("+_bk_tag+")" : "" ) + _glob_crlf;

                         _open_fontcolor_tag = ( _glob_bip_original_plane_data == NO_PLANE ) ? "<red>" : "<greenshock>" ;
                         _close_fontcolor_tag = ( _glob_bip_original_plane_data == NO_PLANE ) ? "</red>" : "</greenshock>" ;
                         _MSG += "<snow>Pick data from</snow> " + _open_fontcolor_tag + _data_diagram_label + _close_fontcolor_tag + _glob_crlf ;

                         _open_fontcolor_tag = ( _glob_bip_original_plane_coords == NO_PLANE ) ? "<red>" : "<greenshock>" ;
                         _close_fontcolor_tag = ( _glob_bip_original_plane_coords == NO_PLANE ) ? "</red>" : "</greenshock>" ;
                         _MSG += "<snow>Pick coords from</snow> " + _open_fontcolor_tag + _coords_diagram_label + _close_fontcolor_tag + _glob_crlf ;

                         switch( _glob_export_format )
                         {
                             case EXPORT_NONE: _MSG += "<snow>Export to PNG format (default)</snow>" ; break ;
                             case EXPORT_SVG: _MSG += "<snow>Export to SVG format</snow>" ; break ;
                             case EXPORT_PS: MSG += "<snow>Export to PS format</snow>" ; break ;
                             case EXPORT_EPS: MSG += "<snow>Export to EPS format</snow>" ; break ;
                             case EXPORT_LATEX: MSG += "<snow>Export to LaTeX format</snow>" ; break ;
                             default: _MSG += "<orange>Export to UNKNOWN format</orange>" ; break ;
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
                   break ;
                   case "preview":
                   var _canvas_id = "TERMINALbipCANVAS" + unixtime();
                   circles_lib_terminal_html_display( _glob_terminal, "<table><tr><td HEIGHT=\"12\"></td></tr><tr><td><CANVAS WIDTH=\""+CANVAS_SIZE+"\" HEIGHT=\""+CANVAS_SIZE+"\" STYLE=\"width:100%;height:70px;\" ID=\""+_canvas_id+"\"></CANVAS></td></tr><tr><td HEIGHT=\"12\"></td></tr></table>" );
                   var _ret_chunk = circles_lib_canvas_layer_copy( "CIRCLESbipCANVAS", _canvas_id, UNDET, 70 );
       						 var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
          				 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
          				 if ( _ret_id == 0 )
          				 {
        							_b_fail = YES, _error_str = _ret_msg ;
          				 }
          				 else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                   break ;
                   case "release":
                   circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                   break ;
                   case "render":
                   _glob_persistent_vars['old_plane_type'] = _glob_target_plane ;
                   _glob_target_plane = BIP_BOX ;
                   var _silent = ( _params_assoc_array['silent'] != null ) ? _params_assoc_array['silent'] : _glob_terminal_silent ;
                   var _ret_chunk = circles_lib_bip_render( _silent, _output_channel );
                   var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                   var _ret_msg = is_array( _ret_chunk ) ? new String( _ret_chunk[1] ) : "Rendering: memory failure" ;
                       _ret_msg = _ret_msg.trim();
                   circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                   if ( _ret_id ) circles_lib_output( _output_channel, DISPATCH_INFO, "Bip session has been closed after rendering", _par_1, _cmd_tag );
                   break ;
                   case "save":
                   var _err_mask = circles_lib_bip_check_params();
                   _glob_bip_halt = ( _err_mask ) ? YES : NO ;
                   if ( _glob_bip_halt )
                   {
                       _b_fail = YES, _error_str = "An error occurred while setting params: please, check that all values are valid" ;
                   }
                   else
                   {
                       var _filename = "circles.bip."  ;
                       switch( _glob_export_format )
                       {
                          case EXPORT_SVG: _filename += "svg" ; break ;
                          case EXPORT_PS: _filename += "ps" ; break ;
                          case EXPORT_EPS: _filename += "eps" ; break ;
                          case EXPORT_LATEX: _filename += "tex" ; break ;
									        default: break ;
                       }

                       var _ret_chunk = circles_lib_files_pix_save_ask( BIP_BOX, _glob_bip_canvas, _filename );
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
                    circles_lib_output( _output_channel, _already ? DISPATCH_INFO : DISPATCH_SUCCESS, "Bip session is "+( _already ? "already " : "" )+( _glob_bip_use ? "open" : "closed" )+"", _par_1, _cmd_tag );
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
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
     }
     
     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + _glob_crlf + "Type '"+_cmd_tag+" /h' for syntax help", _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function circles_lib_terminal_bip_apply_error_manager( _tmp_applied_settings_mask, _ret_id, _ret_errmask )
{
      var _ret_msg = "" ;
      if ( _ret_id == 0 && _ret_errmask != null )
      {
          _ret_msg = "The following errors in the candidate settings have been detected:" ;
          if ( _ret_errmask & 1 ) _ret_msg += _glob_crlf + "- BIP box width is not positive" ;
          if ( _ret_errmask & 2 ) _ret_msg += _glob_crlf + "- BIP box height is not positive" ;
          if ( _ret_errmask & 4 ) _ret_msg += _glob_crlf + "- BIP box center has not been input" ;
          if ( _ret_errmask & 8 ) _ret_msg += _glob_crlf + "- BIP box minimum side has not been input" ;
          if ( _ret_errmask & 16 ) _ret_msg += _glob_crlf + "- BIP box plane has not been input" ;
          if ( _ret_errmask & 32 ) _ret_msg += _glob_crlf + "- BIP box diagram side has not been input" ;
      }
      else
      {
          if ( _tmp_applied_settings_mask & 1 ) _ret_msg += _glob_crlf + "- Diagram applied" ;
          if ( _tmp_applied_settings_mask & 2 ) _ret_msg += _glob_crlf + "- Plane applied" ;
          if ( _tmp_applied_settings_mask & 4 ) _ret_msg += _glob_crlf + "- Center applied" ;
          if ( _tmp_applied_settings_mask & 8 ) _ret_msg += _glob_crlf + "- Background applied" ;
          if ( _tmp_applied_settings_mask & 16 ) _ret_msg += _glob_crlf + "- X extent applied" ;
          if ( _tmp_applied_settings_mask & 32 ) _ret_msg += _glob_crlf + "- Y extent applied" ;
          if ( _tmp_applied_settings_mask & 64 ) _ret_msg += _glob_crlf + "- Minimum side applied" ;
      }

      return _ret_msg ;
}

function circles_lib_terminal_bip_apply( _output_channel, _par_1 )
{
    var _tmp_applied_settings_mask = 0 ;
    var _ret_chunk = circles_lib_bip_apply_settings( _output_channel, !_glob_terminal_silent, _glob_terminal_silent, NO,
                     _glob_bip_box_center_pt, _glob_bip_x_extent, _glob_bip_y_extent,
                     _glob_bip_shorterside_pixels, _glob_bip_original_plane_coords, _glob_bip_original_plane_data, _glob_bip_bk );
    return _ret_chunk ;
}