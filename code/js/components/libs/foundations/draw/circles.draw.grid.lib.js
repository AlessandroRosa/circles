function circles_lib_grid_draw( _canvas, _mapper, _plane_type, _silent, _n_ticks, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _silent = safe_int( _silent, YES );
    _n_ticks = safe_int( _n_ticks, _glob_ticks_count ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
	  var _sd_n = circles_lib_count_seeds(), _plane_def = circles_lib_plane_def_get( _plane_type ), _max_tick_width = 24 ;
    if ( is_html_canvas( _canvas ) && _plane_type != NO_PLANE )
    {
        var _context = _canvas.getContext( _glob_canvas_ctx_2D_mode ), _corners = _mapper.get_coords_corners();
        var LEFT = _corners['lu'].x, TOP = _corners['lu'].y, RIGHT = _corners['rd'].x, BOTTOM = _corners['rd'].y ;
        if ( ( _glob_show_grid_zplane && _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) ) ||
             ( _glob_show_grid_wplane && _plane_type.is_one_of( W_PLANE, ALL_PLANES ) ) ||
             _plane_type.is_one_of( BIP_BOX, CUSTOM_PLANE, D_LOCUS ) )
        {
            if ( _plane_type.is_one_of( Z_PLANE, W_PLANE ) ) _canvas = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
			var _pixel_size = 1 ;
            switch( _plane_type )
            {
                case Z_PLANE: case W_PLANE: _pixel_size = _glob_pixel_size ; break ;
                case BIP_BOX: _pixel_size = _glob_bip_pixel_size ; break ;
                default: _pixel_size = 1 ; break ;
            }
            
            var _bip_area = _plane_type.is_one_of( BIP_BOX ) ? ( _glob_bipbox_canvas.getContext(_glob_canvas_ctx_2D_mode) != null ? _glob_bipbox_canvas.getContext(_glob_canvas_ctx_2D_mode).area() : 0 ) : 0 ;
            var _canvas_area = _canvas.area(), _ratio = _plane_type.is_one_of( BIP_BOX ) ? _bip_area / _canvas_area : 1 ;
			_mapper.set_client_rect( new rect( 0, 0, _canvas.get_width(), _canvas.get_height() ) );
            _mapper.set_display_rect( new rect( 0, 0, _canvas.get_width(), _canvas.get_height() ) );
            
            switch( _glob_export_format )
            {
                case EXPORT_SVG: _svg_comment( _glob_export_code_array, "Drawing the grid - " + _plane_def ); break ;
                case EXPORT_PS: _glob_js_e_ps_obj.comment( "Drawing the grid - " + _plane_def ); break ;
                case EXPORT_EPS: _glob_js_e_ps_obj.comment( "Drawing the grid - " + _plane_def ); break ;
                case EXPORT_LATEX: _glob_js_latex_obj.comment( "Drawing the grid - " + _plane_def ); break ;
                case EXPORT_NONE: default: break ;
            }

            var axis_left_pt = _mapper.from_cartesian_to_client( LEFT, TOP );
            var axis_right_pt = _mapper.from_cartesian_to_client( RIGHT, BOTTOM );
            var axis_mid_pt = _mapper.from_cartesian_to_client( ( RIGHT + LEFT ) / 2.0, ( TOP + BOTTOM ) / 2.0 );

            var _x_howmanyticks = _glob_bip_use ? ( _glob_bip_ticks > 0 ? _glob_bip_ticks : _n_ticks ) : _n_ticks ;
                _x_howmanyticks = Math.min( _x_howmanyticks, _max_tick_width );
            var _y_howmanyticks = _glob_bip_use ? ( _glob_bip_ticks > 0 ? _glob_bip_ticks : _n_ticks ) : _n_ticks ;
                _y_howmanyticks = Math.min( _y_howmanyticks, _max_tick_width );
            
            var _x_screen_dist = safe_int( _mapper.get_client_rect().width(), 0 );
            var _y_screen_dist = safe_int( _mapper.get_client_rect().height(), 0 );
            var _x_real_dist = Math.abs( safe_float( RIGHT - LEFT, 0 ) );
            var _y_real_dist = Math.abs( safe_float( TOP - BOTTOM, 0 ) );

            var dX = _x_real_dist > 1 ? _x_real_dist : 1 / _x_real_dist ;
            var _x_decimals_pos = Math.ceil( Math.log( dX ) / Math.log(10) ) + 1 ;
            var dY = _y_real_dist > 1 ? _y_real_dist : 1 / _y_real_dist ;
            var _y_decimals_pos = Math.ceil( Math.log( dY ) / Math.log(10) ) + 1 ;
            var _decimals_pos = Math.max( _x_decimals_pos, _y_decimals_pos );

            var _x_screen_tick_width = _x_screen_dist / _x_howmanyticks ;
            var _y_screen_tick_height = _y_screen_dist / _y_howmanyticks ;

            _x_screen_tick_width = _y_screen_tick_height = Math.min( _x_screen_tick_width, _y_screen_tick_height ) ;
            if ( _x_screen_tick_width < 28 )
            {
                _x_screen_tick_width = _y_screen_tick_height = 28 ;
                _x_howmanyticks = _y_howmanyticks = _x_screen_dist / _x_screen_tick_width ;
            }
            
            var _x_real_tick = _x_real_dist / _x_howmanyticks ;
            if ( !( _x_screen_tick_width * _x_howmanyticks ).tolerate( _x_screen_dist, 1 ) )
            {
               _x_howmanyticks = Math.floor( _x_screen_dist / _x_screen_tick_width );
               _x_real_tick = _x_real_dist / _x_howmanyticks ;
            }
                
            var _y_real_tick = _y_real_dist / _y_howmanyticks ;
            if ( !( _y_screen_tick_height * _y_howmanyticks ).tolerate( _y_screen_dist, 1 ) )
            {
               _y_howmanyticks = Math.floor( _y_screen_dist / _y_screen_tick_height );
               _y_real_tick = _y_real_dist / _y_howmanyticks ;
            }

            var axis_top_pt = _mapper.from_cartesian_to_client( 0, TOP );
            var axis_bottom_pt = _mapper.from_cartesian_to_client( 0, BOTTOM );
            var X_axis = _mapper.from_cartesian_to_client( LEFT, 0 );
            var Y_axis = _mapper.from_cartesian_to_client( 0, TOP );
            
            var _fontsize = Math.min( 12, Math.max( 5, safe_int( _x_screen_tick_width / 6, 10 ) ) );
            var _fontsize_shift = Math.ceil( _fontsize * 1.1 );
                
            _context.font = Math.floor( _fontsize * _ratio ) + "pt " + DEFAULT_FONT_FAMILY ;
    
            var Xaxis_y = 0, Yaxis_x = 0 ;
            var Xaxis_screen_y = 0, Yaxis_screen_x = 0 ;
            var Xaxis_nth_tick = 0, Yaxis_nth_tick = 0 ;
            var Xaxis_visible = 0, Yaxis_visible = 0 ;
            
            // draw HORIZONTHAL LINES (X axis)
            var _screenY, _next_screenY, cartesian_pt, _next_cartesian_pt, _screen_line ;
            for( var i = 0 ; i <= _y_howmanyticks ; i++ )
            {
                _screenY = safe_int( axis_left_pt.y + ( i * _y_screen_tick_height ), 0 );
                _next_screenY = axis_left_pt.y + ( ( i + 1 ) * _y_screen_tick_height );
                cartesian_pt = _mapper.from_client_to_cartesian( axis_left_pt.x, _screenY );
                _next_cartesian_pt = _mapper.from_client_to_cartesian( axis_left_pt.x, _next_screenY );
                
                if ( ( cartesian_pt.y >= 0 && _next_cartesian_pt.y <= 0 )
                     ||
                     ( cartesian_pt.y <= 0 && _next_cartesian_pt.y >= 0 ) ) Xaxis_visible = YES ;
                   
                _context.lineWidth = _pixel_size ;
                _context.beginPath();
                _context.moveTo( axis_left_pt.x, _screenY );
                _context.lineTo( axis_right_pt.x, _screenY );
                _context.closePath();
                _context.strokeStyle = _glob_grid_color ;
                _context.stroke();

                switch( _glob_export_format )
                {
                    case EXPORT_SVG:
                    _screen_line = new line( axis_left_pt.x, _screenY, axis_right_pt.x, _screenY, _pixel_size, '#E0E0E0' );
                    _svg_line( _glob_export_code_array, _screen_line, 0 );
                    break ;
                    case EXPORT_PS:
                    case EXPORT_EPS:
                    _glob_js_e_ps_obj.line( axis_left_pt.x, _screenY, axis_right_pt.x, _screenY, _pixel_size, '#E0E0E0', UNDET, "" );
                    break ;
                    case EXPORT_LATEX:
                    _glob_js_latex_obj.line( axis_left_pt.x, _screenY, axis_right_pt.x, _screenY, 'gray' );
                    break ;
	                case EXPORT_NONE: default: break ;
                }
            }
            
            var ticklength = _glob_grid_marker_len ;
            // draw VERTICAL LINES (Y axis)
            var next_x, curr_x = 0, _screenX, _next_screenX, cartesian_pt, _next_cartesian_pt, _screen_line ;
            for( var i = 0 ; i <= _x_howmanyticks ; i++ )
            {
                _screenX = safe_int( axis_left_pt.x + ( i * _x_screen_tick_width ), 0 );
                _next_screenX = axis_left_pt.x + ( ( i + 1 ) * _x_screen_tick_width );
                cartesian_pt = _mapper.from_client_to_cartesian( _screenX, axis_left_pt.y );
                _next_cartesian_pt = _mapper.from_client_to_cartesian( _next_screenX, axis_left_pt.y );
                // grid goes from left to right
                if ( ( cartesian_pt.x <= 0 && _next_cartesian_pt.x >= 0 )
                     ||
                     ( cartesian_pt.x >= 0 && _next_cartesian_pt.x <= 0 ) ) Yaxis_visible = YES ;

                _context.lineWidth = _pixel_size ;
                _context.beginPath();
                _context.moveTo( _screenX, axis_left_pt.y );
                _context.lineTo( _screenX, axis_right_pt.y );
                _context.closePath();
                _context.strokeStyle = _glob_grid_color ;
                _context.stroke();

                switch( _glob_export_format )
                {
                    case EXPORT_SVG:
                    _screen_line = new line( _screenX, axis_left_pt.y, _screenX, axis_right_pt.y, _pixel_size, '#E0E0E0' );
                    _svg_line( _glob_export_code_array, _screen_line, 0 );
                    break ;
                    case EXPORT_PS:
                    case EXPORT_EPS:
                    _glob_js_e_ps_obj.line( _screenX, axis_left_pt.y, _screenX, axis_right_pt.y, _pixel_size, '#E0E0E0', UNDET, "" );
                    break ;
                    case EXPORT_LATEX:
                    _glob_js_latex_obj.line( _screenX, axis_left_pt.y, _screenX, axis_right_pt.y, 'gray' );
                    break ;
                    case EXPORT_NONE: default: break ;
                }
            }
    
            // drawing the X ticks (X axis)
            axis_left_pt = _mapper.from_cartesian_to_client( LEFT, 0 );
            var _screenY = axis_left_pt.y, _screenX, _realX, _realY, _textclr, _out_x = 0, _out_y = 0 ;
            
            _context.fillStyle = !Xaxis_visible ? _glob_axis_color : _glob_default_text_clr ;
            for( var i = 0 ; i <= _x_howmanyticks ; i++ )
            {
               _screenX = safe_int( axis_left_pt.x + _x_screen_tick_width * i, 0 );
               _realX = LEFT + ( _x_real_tick * i );
               _realX = round_to_decimals( _realX, _decimals_pos );

               if ( i == 0 ) _screenX += _fontsize_shift ;
               else if ( i == _x_howmanyticks ) _screenX -= _fontsize_shift * 2 ;
               else if ( i > _x_howmanyticks / 2 && i <= _x_howmanyticks ) _screenX -= _fontsize_shift * 1.1 ;
               else _screenX -= safe_int( ticklength / 6, 0 );

               _out_y = _screenY + _fontsize_shift + 5 ;
               if ( Xaxis_visible && _out_y >= _canvas.get_height() ) _out_y = _canvas.get_height() - _fontsize_shift ;
               if ( _realX == 0 ) _screenX += safe_int( _fontsize_shift / 5, 0 );
               _context.fillText( _realX, _screenX, _out_y );

               switch( _glob_export_format )
               {
                   case EXPORT_SVG:
                   _textclr = _context.fillStyle ;
                   _svg_text( _glob_export_code_array, _screenX, _out_y, _realX, _textclr, DEFAULT_FONT_FAMILY, Math.floor( safe_int( DEFAULT_FONT_SIZE, 7 ) * _ratio ) );
                   break ;
                   case EXPORT_PS:
                   case EXPORT_EPS:
                   _glob_js_e_ps_obj.text( DEFAULT_FONT_FAMILY, Math.floor( safe_int( DEFAULT_FONT_SIZE, 7 ) * _ratio ), _textclr, _screenX, _out_y, _realX, "" );
                   break ;
                   case EXPORT_LATEX:
                   _glob_js_latex_obj.text( _screenX, _out_y, _realX, "gray" );
                   break ;
	                 case EXPORT_NONE: default: break ;
               }
            }
    
            // drawing the Y ticks (Y axis)
            axis_top_pt = _mapper.from_cartesian_to_client( 0, TOP );
            _screenX = axis_top_pt.x ;
            _context.fillStyle = !Yaxis_visible ? _glob_axis_color : _glob_default_text_clr ;
            for( var i = 0 ; i <= _y_howmanyticks ; i++ )
            {
               _screenY = safe_int( axis_top_pt.y + ( _y_screen_tick_height * i ), 0 );
               _realY = TOP - ( _y_real_tick * i ), _realY = round_to_decimals( _realY, _decimals_pos );

               if ( i == 0 ) _screenY += _fontsize_shift ;
               else if ( i == _y_howmanyticks ) _screenY -= _fontsize_shift ;
               else _screenY -= safe_int( ticklength / 6, 0 );

               if ( Yaxis_visible )
               {
                   _out_x = _screenX + _fontsize_shift ;
                   if ( _out_x >= _canvas.get_width() ) _out_x = _canvas.get_width() - _fontsize_shift ;
               }
               else _out_x = _screenX = _fontsize_shift + 1 ;

               if ( _realY == 0 ) _screenY -= safe_int( _fontsize_shift / 5, 0 );
               _context.fillText( _realY, _out_x, _screenY );

               switch( _glob_export_format )
               {
                   case EXPORT_SVG:
                   _textclr = _context.fillStyle ;
                   _svg_text( _glob_export_code_array, _out_x, _screenY, _realY, _textclr, DEFAULT_FONT_FAMILY, Math.floor( safe_int( DEFAULT_FONT_SIZE, 7 ) * _ratio ) );
                   break ;
                   case EXPORT_PS:
                   case EXPORT_EPS:
                   _glob_js_e_ps_obj.text( DEFAULT_FONT_FAMILY, Math.floor( safe_int( DEFAULT_FONT_SIZE, 7 ) * _ratio ), _textclr, _out_x, _screenY, _realY, "" );
                   break ;
                   case EXPORT_LATEX:
                   _glob_js_latex_obj.text( _out_x, _screenY, _realY, "gray" );
                   break ;
	                 case EXPORT_NONE: default: break ;
               }
            }

            if ( Xaxis_visible || Yaxis_visible )
            {
                switch( _glob_export_format )
                {
                   case EXPORT_SVG: _svg_comment( _glob_export_code_array, "Drawing the visible axes" ); break ;
                   case EXPORT_PS:
                   case EXPORT_EPS:
                   _glob_js_e_ps_obj.comment( "Drawing the visible axes" );
                   break ;
                   case EXPORT_LATEX:
                   _glob_js_latex_obj.comment( "Drawing the visible axes" );
                   break ;
	                 case EXPORT_NONE: default: break ;
                }
            }

            // drawing the X axis
            if ( Xaxis_visible )
            {
                var _screen_x_left = _mapper.from_cartesian_to_client( LEFT, 0 );
                var _screen_x_right = _mapper.from_cartesian_to_client( RIGHT, 0 );

                _context.lineWidth = _pixel_size ;
                _context.beginPath();
                _context.moveTo( _screen_x_left.x, _screen_x_left.y );
                _context.lineTo( _screen_x_right.x, _screen_x_right.y );
                _context.closePath();
                _context.strokeStyle = _glob_axis_color ;
                _context.stroke();

                switch( _glob_export_format )
                {
                   case EXPORT_SVG:
                   var _screen_line = new line( _screen_x_left.x, _screen_x_left.y, _screen_x_right.x, _screen_x_right.y, 2 * _pixel_size, _glob_axis_color );
                   _svg_line( _glob_export_code_array, _screen_line, 0 );
                   break ;
                   case EXPORT_PS:
                   case EXPORT_EPS:
                   _glob_js_e_ps_obj.line( _screen_x_left.x, _screen_x_left.y, _screen_x_right.x, _screen_x_right.y, 2 * _pixel_size, _glob_axis_color, "", UNDET, "" );
                   break ;
                   case EXPORT_LATEX:
                   _glob_js_latex_obj.line( _screen_x_left.x, _screen_x_left.y, _screen_x_right.x, _screen_x_right.y, "gray" );
                   break ;
                   case EXPORT_NONE:
                   default:
                   break ;
                }
            }

            // drawing the Y axis
            if ( Yaxis_visible )
            {
                var _screen_y_top = _mapper.from_cartesian_to_client( 0, TOP );
                var _screen_y_bottom = _mapper.from_cartesian_to_client( 0, BOTTOM );

                _context.lineWidth = _pixel_size ;
                _context.beginPath();
                _context.moveTo( _screen_y_top.x, _screen_y_top.y );
                _context.lineTo( _screen_y_bottom.x, _screen_y_bottom.y );
                _context.closePath();
                _context.strokeStyle = _glob_axis_color ;
                _context.stroke();

                switch( _glob_export_format )
                {
                   case EXPORT_SVG:
                   var _screen_line = new line( _screen_y_top.x, _screen_y_top.y, _screen_y_bottom.x, _screen_y_bottom.y, 2 * _pixel_size, _glob_axis_color );
                   _svg_line( _glob_export_code_array, _screen_line, 0 );
                   break ;
                   case EXPORT_PS:
                   case EXPORT_EPS:
                   _glob_js_e_ps_obj.line( _screen_y_top.x, _screen_y_top.y, _screen_y_bottom.x, _screen_y_bottom.y, 2 * _pixel_size, _glob_axis_color, "", UNDET, "" );
                   break ;
                   case EXPORT_LATEX:
                   _glob_js_latex_obj.line( _screen_y_top.x, _screen_y_top.y, _screen_y_bottom.x, _screen_y_bottom.y, 2 * _pixel_size, _glob_axis_color, "", UNDET, "" );
                   break ;
                   case EXPORT_NONE: default: break ;
                }
            }

            return [ RET_OK, "Grid has been drawn with success" ] ;
        }
        else return [ RET_ERROR, "Fail to draw the grid: unknown plane type" ] ;
    }
    else
    {
        var _errors = _sd_n == 0 ? "* No maps\n" : "" ;
        if ( _plane_type == NO_PLANE ) _errors += "* Missing plane reference" ;
        var _plane_def = circles_lib_plane_def_get( _plane_type );
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _errors, _glob_app_title );
        return [ RET_ERROR, _errors ] ;
    }
}