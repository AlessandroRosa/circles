function circles_lib_draw_arrow( _context, _from_x, _from_y, _to_x, _to_y, _head_len, _linesize, _drawcolor, _display_shaft )
{
    if ( !is_html_context( _context ) ) return NO ;
    _from_x = safe_float( _from_x, 0 ), _from_y = safe_float( _from_y, 0 );
    _to_x = safe_float( _to_x, 0 ), _to_y = safe_float( _to_y, 0 );
    _head_len = safe_int( _head_len, 16 );   // length of head in pixels
    _linesize = safe_int( _linesize, 1 );
    _drawcolor = safe_string( _drawcolor, "transparent" );
    _display_shaft = safe_int( _display_shaft, YES );
    _glob_persistent_vars['angle'] = Math.atan2( _to_y - _from_y , _to_x - _from_x );
    _context.beginPath();
    _context.strokeStyle = _drawcolor, _context.lineWidth = _linesize ;
    if ( _display_shaft )
    {
       _context.moveTo( _from_x, _from_y ), _context.lineTo( _to_x, _to_y );
    }
    else _context.moveTo( _to_x, _to_y );
    _context.lineTo( _to_x - _head_len * Math.cos( _glob_persistent_vars['angle'] - Math.PI/6 ), _to_y - _head_len * Math.sin( _glob_persistent_vars['angle'] - Math.PI/6 ) );
    _context.moveTo( _to_x, _to_y );
    _context.lineTo( _to_x - _head_len * Math.cos( _glob_persistent_vars['angle'] + Math.PI/6 ), _to_y - _head_len * Math.sin( _glob_persistent_vars['angle'] + Math.PI/6 ) );
    _context.stroke();
    _context.closePath();
    return YES ;
}

function circles_lib_draw_screen_disk( _context, _word, _scr_circle, _draw, _drawcolor, _fill, _fillcolor, _linewidth, _opacity, _properties_mask, _sector_rad_start, _sector_rad_end )
{
    if ( !is_html_context( _context ) ) return null ;
    _draw = safe_int( _draw, YES ), _fill = safe_int( _fill, NO );
    _properties_mask = safe_int( _properties_mask, 0 );
    _linewidth = safe_int( _linewidth, NO );
    _opacity = safe_float( _opacity, DEFAULT_MAX_OPACITY );
    _drawcolor = safe_string( _drawcolor, "transparent" );
    _fillcolor = safe_string( _fillcolor, "transparent" );
    _sector_rad_start = safe_float( _sector_rad_start, 0 ), _sector_rad_end = safe_float( _sector_rad_end, CIRCLES_TWO_PI ) ;

    _context.globalAlpha = _opacity ;
    _context.beginPath();
    _context.lineWidth = _linewidth ;
    _context.strokeStyle = safe_string( _drawcolor, _glob_draw_seed_color );
    if ( _draw )
    {
        _context.arc( _scr_circle.center.x, _scr_circle.center.y, _scr_circle.radius, 0, CIRCLES_TWO_PI );
        if ( _linewidth > 0 ) _context.stroke();
    }
    else if ( !_draw )
    {
        // the dashed region need to be set in anycase, otherwise the fill instruction won't display any disk,
        // because the region was not set at all, nor to be drawn, nor to be filled
        if ( !_context.setLineDash && _glob_apply_dashed_border ) _context.dottedArc( _scr_circle.center.x, _scr_circle.center.y, _scr_circle.radius, _sector_rad_start, _sector_rad_end );
        else
        {
           if ( _glob_apply_dashed_border ) _context.setLineDash([2,2]);
           _context.arc( _scr_circle.center.x, _scr_circle.center.y, _scr_circle.radius, _sector_rad_start, _sector_rad_end );
           if ( _glob_apply_dashed_border && _linewidth > 0 ) _context.stroke();
           if ( _glob_apply_dashed_border ) _context.setLineDash([]);
        }
    }

    if ( _fill && _fillcolor.length > 0 )
    {
        _context.fillStyle = _fillcolor ;
        _context.fill();
    }

    if ( _glob_symbols_display_wplane )
    {
        _glob_persistent_vars['x'] = _scr_circle.center.x - 10;
        _glob_persistent_vars['y'] = _scr_circle.center.y + 16 ;
        _context.font = DEFAULT_FONT_SIZE + " " + DEFAULT_FONT_FAMILY ;
        _context.fillStyle = "" ;
        _context.fillText( _word, _glob_persistent_vars['x'], _glob_persistent_vars['y'] );
        switch( _glob_export_format )
        {
            case EXPORT_SVG:
            _svg_text( _glob_export_code_array, _glob_persistent_vars['x'], _glob_persistent_vars['y'], _word, _drawcolor, DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE );
            break ;
            case EXPORT_PS:
            _glob_js_e_ps_obj.text( DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, _drawcolor, _glob_persistent_vars['x'], _glob_persistent_vars['y'], _word, "" );
            break ;
            case EXPORT_EPS:
            _glob_js_e_ps_obj.text( DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, _drawcolor, _glob_persistent_vars['x'], _glob_persistent_vars['y'], _word, "" );
            break ;
            case EXPORT_LATEX:
            _glob_js_latex_obj.text( _glob_persistent_vars['x'], _glob_persistent_vars['y'], _word, _drawcolor );
            break ;
            case EXPORT_NONE:
            default: break ;
        }
   }

   _context.closePath();
   return _scr_circle ;
}

function circles_lib_draw_complex_disk( _context, _mapper, _complex_x, _complex_y, _complex_radius, _draw, _drawcolor, _fill, _fillcolor, _linewidth, _opacity, _sector_rad_start, _sector_rad_end, _word, _properties_mask )
{
	 if ( !is_html_context( _context ) || !is_screen_mapper( _mapper ) ) return null ;
   _complex_x = safe_float( _complex_x, 0 ), _complex_y = safe_float( _complex_y, 0 );
   _complex_radius = safe_float( _complex_radius, 0 ) ;
   _linewidth = safe_int( _linewidth, 1 ), _draw = safe_int( _draw, YES ), _fill = safe_int( _fill, NO );
   _opacity = safe_float( _opacity, DEFAULT_MAX_OPACITY );
   _properties_mask = safe_int( _properties_mask, 0 );
   _drawcolor = safe_string( _drawcolor, "transparent" ), _fillcolor = safe_string( _fillcolor, "transparent" );
   _glob_persistent_vars['scr_center_pt'] = _mapper.from_cartesian_to_client( _complex_x, _complex_y );
   _glob_persistent_vars['scr_radius_pt'] = _mapper.from_cartesian_to_client( _complex_x + _complex_radius, _complex_y );
   _glob_persistent_vars['scr_circle'] = new circle( _glob_persistent_vars['scr_center_pt'], Math.abs( _glob_persistent_vars['scr_center_pt'].x - _glob_persistent_vars['scr_radius_pt'].x ), _draw, _fill, _drawcolor, _fillcolor, _linewidth );
   _sector_rad_start = safe_float( _sector_rad_start, 0 ), _sector_rad_end = safe_float( _sector_rad_end, CIRCLES_TWO_PI ) ;

   _context.globalAlpha = _opacity ;
   _context.beginPath();
   _context.lineWidth = _linewidth ;
   _context.strokeStyle = _drawcolor ;
   if ( _draw )
   {
       if ( _sector_rad_end != CIRCLES_TWO_PI )
       _context.moveTo( _glob_persistent_vars['scr_circle'].center.x, _glob_persistent_vars['scr_circle'].center.y );
       _context.arc( _glob_persistent_vars['scr_circle'].center.x, _glob_persistent_vars['scr_circle'].center.y,
                     _glob_persistent_vars['scr_circle'].radius, _sector_rad_start, _sector_rad_end );
       if ( _sector_rad_end != CIRCLES_TWO_PI )
           _context.lineTo( _glob_persistent_vars['scr_circle'].center.x, _glob_persistent_vars['scr_circle'].center.y );
       if ( _fill && _fillcolor.length > 0 )
       {
           _context.fillStyle = _fillcolor ;
           _context.fill();
       }
       if ( _linewidth > 0 ) _context.stroke();
   }
   else if ( !_draw )
   {
       // the dashed region need to be set in anycase, otherwise the fill instruction won't display any disk,
       // because the region was not set at all, nor to be drawn, nor to be filled
       if ( !_context.setLineDash && _glob_apply_dashed_border )
       {
          _context.dottedArc( _glob_persistent_vars['scr_circle'].center.x, _glob_persistent_vars['scr_circle'].center.y, _glob_persistent_vars['scr_circle'].radius, _sector_rad_start, _sector_rad_end );
       }
       else
       {
          if ( _glob_apply_dashed_border ) _context.setLineDash([2,2]);
          _context.arc( _glob_persistent_vars['scr_circle'].center.x, _glob_persistent_vars['scr_circle'].center.y, _glob_persistent_vars['scr_circle'].radius, _sector_rad_start, _sector_rad_end );
          if ( _fill && _fillcolor.length > 0 )
          {
             _context.fillStyle = _fillcolor ;
             _context.fill();
          }
          if ( _glob_apply_dashed_border && _linewidth > 0 ) _context.stroke();
          if ( _glob_apply_dashed_border ) _context.setLineDash([]);
       }
   }

   if ( _glob_symbols_display_wplane )
   {
       _glob_persistent_vars['x'] = _glob_persistent_vars['scr_center_pt'].x - 10, _glob_persistent_vars['y'] = _glob_persistent_vars['scr_center_pt'].y + 16 ;
       _context.font = DEFAULT_FONT_SIZE + " " + DEFAULT_FONT_FAMILY ;
       _context.fillStyle = "" ;
       _context.fillText( _word, _glob_persistent_vars['x'], _glob_persistent_vars['y'] );

       switch( _glob_export_format )
       {
           case EXPORT_SVG:
           _svg_text( _glob_export_code_array, _glob_persistent_vars['x'], _glob_persistent_vars['y'], _word, _drawcolor, DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE );
           break ;
           case EXPORT_PS:
           _glob_js_e_ps_obj.text( DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, _drawcolor, _glob_persistent_vars['x'], _context.canvas.clientHeight - _glob_persistent_vars['y'], _word, "" );
           break ;
           case EXPORT_EPS:
           _glob_js_e_ps_obj.text( DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, _drawcolor, _glob_persistent_vars['x'], _context.canvas.clientHeight - _glob_persistent_vars['y'], _word, "" );
           break ;
           case EXPORT_LATEX:
           _glob_js_latex_obj.text( _glob_persistent_vars['x'], _context.canvas.clientHeight - _glob_persistent_vars['y'], _word, _drawcolor );
           break ;
           case EXPORT_NONE: default: break ;
       }
   }

   _context.closePath();

   switch( _glob_export_format )
   {
       case EXPORT_SVG:
       _glob_persistent_vars['scr_circle'] = new circle( _glob_persistent_vars['scr_center_pt'], Math.abs( _glob_persistent_vars['scr_center_pt'].x - _glob_persistent_vars['scr_radius_pt'].x ), _draw, _fill, _drawcolor, _fillcolor, _linewidth );
       _glob_persistent_vars['scr_circle'].draw = _draw ;
       _glob_persistent_vars['scr_circle'].fill = _fill ;
       _glob_persistent_vars['scr_circle'].drawcolor = _drawcolor ;
       _glob_persistent_vars['scr_circle'].fillcolor = _fillcolor ;
       _glob_persistent_vars['scr_circle'].linewidth = _linewidth ;
           _svg_circle( _glob_export_code_array, _glob_persistent_vars['scr_circle'], _draw == 0 ? _svg_allow_dashline_for_border_off : NO, _opacity );
       break ;
       case EXPORT_PS:
       _glob_js_e_ps_obj.circle( _glob_persistent_vars['scr_center_pt'].x, _glob_persistent_vars['scr_center_pt'].y, Math.abs( _glob_persistent_vars['scr_center_pt'].x - _glob_persistent_vars['scr_radius_pt'].x ), _linewidth, _drawcolor, _fillcolor, "", "" );
       break ;
       case EXPORT_EPS:
       _glob_js_e_ps_obj.circle( _glob_persistent_vars['scr_center_pt'].x, _glob_persistent_vars['scr_center_pt'].y, Math.abs( _glob_persistent_vars['scr_center_pt'].x - _glob_persistent_vars['scr_radius_pt'].x ), _linewidth, _drawcolor, _fillcolor, "", "" );
       break ;
       case EXPORT_LATEX:
       _glob_js_latex_obj.circle( _glob_persistent_vars['scr_center_pt'].x, _glob_persistent_vars['scr_center_pt'].y, Math.abs( _glob_persistent_vars['scr_center_pt'].x - _glob_persistent_vars['scr_radius_pt'].x ), _fill, _fillcolor );
       break ;
       case EXPORT_NONE: break ;
       default:
       break ;
   }
     
   return _glob_persistent_vars['scr_circle'] ;
}

function circles_lib_draw_segment( _context, _mapper, _from_x, _from_y, _to_x, _to_y, _drawcolor, _linewidth, _opacity, _properties_mask, _map_it )
{
   if ( !is_html_context( _context ) || !is_screen_mapper( _mapper ) ) return NO ;
   _from_x = safe_float( _from_x, 0 ), _from_y = safe_float( _from_y, 0 );
   _to_x = safe_float( _to_x, 0 ), _to_y = safe_float( _to_y, 0 );
   _opacity = safe_float( _opacity, DEFAULT_MAX_OPACITY );
   _linewidth = safe_int( _linewidth, 0 );
   _map_it = safe_int( _map_it, is_screen_mapper( _mapper ) ? YES : NO );
   _properties_mask = safe_int( _properties_mask, 0 );
   _drawcolor = safe_string( _drawcolor, _glob_draw_seed_color );
   if ( _map_it )
   {
       _glob_persistent_vars['from_scr_pt'] = _mapper.from_cartesian_to_client( _from_x, _from_y );
       _glob_persistent_vars['to_scr_pt'] = _mapper.from_cartesian_to_client( _to_x, _to_y );
   }
   else
   {
       _glob_persistent_vars['from_scr_pt'].x = _from_x, _glob_persistent_vars['from_scr_pt'].y = _from_y ;
       _glob_persistent_vars['to_scr_pt'].x = _to_x, _glob_persistent_vars['to_scr_pt'].y = _to_y ;
   }

   _drawcolor = safe_string( _drawcolor, "transparent" );

   _context.globalAlpha = _opacity ;
   _context.beginPath();
   _context.lineWidth = _linewidth ;
   _context.moveTo( _glob_persistent_vars['from_scr_pt'].x, _glob_persistent_vars['from_scr_pt'].y );
   _context.lineTo( _glob_persistent_vars['to_scr_pt'].x, _glob_persistent_vars['to_scr_pt'].y );
   _context.strokeStyle = _drawcolor ;
   _context.stroke();
   _context.closePath();
   switch( _glob_export_format )
   {
       case EXPORT_SVG:
       if ( _draw && is_point( _scr_start_pt ) && is_point( _scr_end_pt ) )
       {
          _scr_start_pt = _mapper.from_cartesian_to_client( _scr_start_pt.x, _scr_start_pt.y );
          _scr_end_pt = _mapper.from_cartesian_to_client( _scr_end_pt.x, _scr_end_pt.y );
          _scr_line.set_coords( _glob_persistent_vars['from_scr_pt'].x, _glob_persistent_vars['from_scr_pt'].y,
                                _glob_persistent_vars['to_scr_pt'].x, _glob_persistent_vars['to_scr_pt'].y,
                                _linewidth, _drawcolor );
          _svg_line( _glob_export_code_array, _scr_line, NO );
       }
       break ;
       case EXPORT_PS:
       if ( _draw && is_point( _scr_start_pt ) && is_point( _scr_end_pt ) )
       {
           _scr_start_pt = _mapper.from_cartesian_to_client( _scr_start_pt.x, _context.canvas.clientHeight - _scr_start_pt.y );
           _scr_end_pt = _mapper.from_cartesian_to_client( _scr_end_pt.x, _context.canvas.clientHeight - _scr_end_pt.y );
           _scr_line.set_coords( _glob_persistent_vars['from_scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['from_scr_pt'].y,
                                 _glob_persistent_vars['to_scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['to_scr_pt'].y,
                                 _linewidth, _drawcolor );
           _glob_js_e_ps_obj.line( _scr_start_pt.x, _context.canvas.clientHeight - _scr_start_pt.y,
                                   _scr_end_pt.x, _context.canvas.clientHeight - _scr_end_pt.y,
                                   _linewidth, _drawcolor, "", UNDET, "" );
       }
       break ;
       case EXPORT_EPS:
       if ( _draw && is_point( _scr_start_pt ) && is_point( _scr_end_pt ) )
       {
           _scr_start_pt = _mapper.from_cartesian_to_client( _scr_start_pt.x, _context.canvas.clientHeight - _scr_start_pt.y );
           _scr_end_pt = _mapper.from_cartesian_to_client( _scr_end_pt.x, _context.canvas.clientHeight - _scr_end_pt.y );
           _scr_line.set_coords( _glob_persistent_vars['from_scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['from_scr_pt'].y,
                                 _glob_persistent_vars['to_scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['to_scr_pt'].y,
                                 _linewidth, _drawcolor );
           _glob_js_e_ps_obj.line( _scr_start_pt.x, _context.canvas.clientHeight - _scr_start_pt.y,
                                   _scr_end_pt.x, _context.canvas.clientHeight - _scr_end_pt.y,
                                   _linewidth, _drawcolor, "", UNDET, "" );
       }
       break ;
       case EXPORT_LATEX:
       if ( _draw && is_point( _scr_start_pt ) && is_point( _scr_end_pt ) )
       {
           _scr_start_pt = _mapper.from_cartesian_to_client( _scr_start_pt.x, _context.canvas.clientHeight - _scr_start_pt.y );
           _scr_end_pt = _mapper.from_cartesian_to_client( _scr_end_pt.x, _context.canvas.clientHeight - _scr_end_pt.y );
           _scr_line.set_coords( _glob_persistent_vars['from_scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['from_scr_pt'].y,
                                 _glob_persistent_vars['to_scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['to_scr_pt'].y,
                                 _linewidth, _drawcolor );
           _glob_js_latex_obj.line( _scr_start_pt.x, _context.canvas.clientHeight - _scr_start_pt.y,
                                    _scr_end_pt.x, _context.canvas.clientHeight - _scr_end_pt.y, _drawcolor );
       }
       break ;
       case EXPORT_NONE: default: break ;
   }
   return YES ;
}

function circles_lib_draw_polyline( _context, _mapper, _pts_array, _drawcolor, _fillcolor, _linewidth, _close, _opacity, _tolerance, _properties_mask, _map_it )
{
   if ( !is_html_context( _context ) || !is_screen_mapper( _mapper ) ) return null ;
    _tolerance = safe_float( _tolerance, UNDET );
    _close = safe_int( _close, NO );
    _properties_mask = safe_int( _properties_mask, 0 );
    _drawcolor = safe_string( _drawcolor, "transparent" ), _fillcolor = safe_string( _fillcolor, "transparent" );
    _map_it = safe_int( _map_it, NO );
    _glob_persistent_vars['p_len'] = safe_size( _pts_array, 0 );
    _glob_persistent_vars['scr_pts_array'] = [];
    if ( _glob_persistent_vars['p_len'] > 1 )
    {
       _glob_persistent_vars['client_rect'] = _mapper.get_display_rect();
  		 _context.globalAlpha = _opacity ;
       _context.lineWidth = _linewidth ;
       _context.strokeStyle = safe_string( _drawcolor, "" );
       _context.fillStyle = safe_string( _fillcolor, "" );
       _context.beginPath();

       if ( _properties_mask & 2 )
       {
           _context.rect( _glob_persistent_vars['client_rect'].get_left(), _glob_persistent_vars['client_rect'].get_top(), _glob_persistent_vars['client_rect'].width(), _glob_persistent_vars['client_rect'].height() );
           _context.clip();
       }

       _glob_persistent_vars['to_scr_pt'] = _map_it ? _mapper.from_cartesian_to_client( _pts_array[0].x, _pts_array[0].y ) : _pts_array[0] ;
       _glob_persistent_vars['scr_pts_array'].push( _glob_persistent_vars['to_scr_pt'] );
       _context.moveTo( _glob_persistent_vars['scr_pts_array'][0].x, _glob_persistent_vars['scr_pts_array'][0].y );

       for( var _i = 1 ; _i < _glob_persistent_vars['p_len'] ; _i++ )
       {
           _glob_persistent_vars['to_scr_pt'] = _map_it ? _mapper.from_cartesian_to_client( _pts_array[_i].x, _pts_array[_i].y ) : _pts_array[_i] ;
           _glob_persistent_vars['scr_pts_array'].push( _glob_persistent_vars['to_scr_pt'] );
           if ( _tolerance == UNDET || ( _tolerance > 0.0 && _pts_array[_i].distance( _pts_array[_i-1] ) <= _tolerance ) )
           _context.lineTo( _glob_persistent_vars['to_scr_pt'].x, _glob_persistent_vars['to_scr_pt'].y );
       }

       if ( _close )
       {
           _glob_persistent_vars['to_scr_pt'] = _map_it ? _mapper.from_cartesian_to_client( _pts_array[0].x, _pts_array[0].y ) : _pts_array[0] ;
           _glob_persistent_vars['scr_pts_array'].push( _glob_persistent_vars['to_scr_pt'] );
           if ( _tolerance == UNDET || ( _tolerance > 0.0 && _glob_persistent_vars['scr_pts_array'][_i].distance( _glob_persistent_vars['scr_pts_array'][_i-1] ) <= _tolerance ) )
           _context.lineTo( _glob_persistent_vars['to_scr_pt'].x, _glob_persistent_vars['to_scr_pt'].y );
           _context.closePath();
       }

       if ( _drawcolor.length > 0 ) _context.stroke();
       if ( _fillcolor.length > 0 ) _context.fill();
       if ( _properties_mask & 1 ) // mark vertices
       {
           for( _i = 0 ; _i < _glob_persistent_vars['p_len'] ; _i++ )
           circles_lib_draw_point( _context, _mapper, _glob_persistent_vars['scr_pts_array'][_i].x, _glob_persistent_vars['scr_pts_array'][_i].y,
                             YES, _drawcolor, YES, _fillcolor,
                             _glob_pt_border, _glob_pt_radius, _opacity, _properties_mask, NO );
       }
    }

    switch( _glob_export_format )
    {
        case EXPORT_SVG:
        _glob_persistent_vars['pt_l'] = safe_size( _glob_persistent_vars['scr_pts_array'], 0 );
        for( var _i = 1 ; _i < _glob_persistent_vars['pt_l'] ; _i++ )
        {
            _glob_persistent_vars['scr_start_pt'] = _glob_persistent_vars['scr_pts_array'][_i-1] ;
            _glob_persistent_vars['scr_end_pt'] = _glob_persistent_vars['scr_pts_array'][_i] ;
            if ( is_point( _glob_persistent_vars['scr_start_pt'] ) && is_point( _glob_persistent_vars['scr_end_pt'] ) )
            {
               _glob_persistent_vars['scr_line'].set_coords( _glob_persistent_vars['scr_start_pt'].x, _glob_persistent_vars['scr_start_pt'].y,
                                                  _glob_persistent_vars['scr_end_pt'].x, _glob_persistent_vars['scr_end_pt'].y,
                                                  _linewidth, _drawcolor );
               _svg_line( _glob_export_code_array, _glob_persistent_vars['scr_line'], NO );
            }
        }
        break ;
        case EXPORT_PS:
        _glob_persistent_vars['pt_l'] = safe_size( _glob_persistent_vars['scr_pts_array'], 0 );
        _glob_persistent_vars['out_pts_array'] = [];
        for( var _i = 0 ; _i < _glob_persistent_vars['pt_l'] ; _i++ ) _glob_persistent_vars['out_pts_array'].push( [ _glob_persistent_vars['scr_pts_array'][_i].x, _context.canvas.clientHeight - _glob_persistent_vars['scr_pts_array'][_i].y ] );
        _glob_js_e_ps_obj.broken_line( _glob_persistent_vars['out_pts_array'], _linewidth, _close, _drawcolor, _fillcolor, "", "" );
        break ;
        case EXPORT_EPS:
        _glob_persistent_vars['pt_l'] = safe_size( _glob_persistent_vars['scr_pts_array'], 0 );
        _glob_persistent_vars['out_pts_array'] = [];
        for( var _i = 0 ; _i < _glob_persistent_vars['pt_l'] ; _i++ ) _glob_persistent_vars['out_pts_array'].push( [ _glob_persistent_vars['scr_pts_array'][_i].x, _context.canvas.clientHeight - _glob_persistent_vars['scr_pts_array'][_i].y ] );
        _glob_js_e_ps_obj.broken_line( _glob_persistent_vars['out_pts_array'], _linewidth, _close, _drawcolor, _fillcolor, "", "" );
        break ;
        case EXPORT_LATEX:
        _glob_persistent_vars['pt_l'] = safe_size( _glob_persistent_vars['scr_pts_array'], 0 );
        _glob_persistent_vars['out_pts_array'] = [];
        for( var _i = 0 ; _i < _glob_persistent_vars['pt_l'] ; _i++ ) _glob_persistent_vars['out_pts_array'].push( [ _glob_persistent_vars['scr_pts_array'][_i].x, _context.canvas.clientHeight - _glob_persistent_vars['scr_pts_array'][_i].y ] );
        _glob_js_latex_obj.broken_line( _glob_persistent_vars['out_pts_array'], _drawcolor, _close );
        break ;
        case EXPORT_NONE: default: break ;
    }
    return YES ;
}

function circles_lib_draw_rect( _context, _mapper, _rect_obj, _draw, _drawcolor, _fill, _fillcolor, _linewidth, _map_it, _opacity, _properties_mask )
{
   if ( !is_html_context( _context ) || !is_screen_mapper( _mapper ) ) return null ;
   _properties_mask = safe_int( _properties_mask, 0 );
   _map_it = safe_int( _map_it, NO ), _opacity = safe_float( _opacity, DEFAULT_MAX_OPACITY );
   _drawcolor = safe_string( _drawcolor, "transparent" ), _fillcolor = safe_string( _fillcolor, "transparent" );
   if ( _map_it && _mapper != null && is_rect( _rect_obj ) )
   {
      // remap _rect_obj if required
      _glob_persistent_vars['left_top_pt'] = _mapper.from_cartesian_to_client( _rect_obj.x1, _rect_obj.y1 );
      _glob_persistent_vars['right_bottom_pt'] = _mapper.from_cartesian_to_client( _rect_obj.x2, _rect_obj.y2 );
      _rect_obj = new rect( _glob_persistent_vars['left_top_pt'].x, _glob_persistent_vars['left_top_pt'].y,
                            _glob_persistent_vars['right_bottom_pt'].x, _glob_persistent_vars['right_bottom_pt'].y );
   }
    
   _context.globalAlpha = _opacity ;
   _context.beginPath();
   _glob_persistent_vars['height'] = _rect_obj.height(), _glob_persistent_vars['width'] = _rect_obj.width() ;
   if ( _fill )
   {
      _context.fillStyle = _fillcolor ;
      _context.fillRect( _rect_obj.x1, _rect_obj.y1, _glob_persistent_vars['width'], _glob_persistent_vars['height'] );
   }

   if ( _draw )
   {
      _context.rect( _rect_obj.x1, _rect_obj.y1, _glob_persistent_vars['width'], _glob_persistent_vars['height'] );
      _context.lineWidth = _linewidth ;
      _context.strokeStyle = _drawcolor ;
      _context.stroke();
   }
      
   _context.closePath();
   if ( _map_it ) _rect_obj.y1 = Math.abs( _rect_obj.y1 - _rect_obj.h );

   switch( _glob_export_format )
   {
       case EXPORT_SVG:
       _svg_rect( _glob_export_code_array, _rect_obj, _opacity, _draw, _drawcolor, _fill, _fillcolor, _linewidth );
       break ;
       case EXPORT_PS:
       _glob_js_e_ps_obj.rect( _rect_obj.x1, _context.canvas.clientHeight - _rect_obj.y1, _rect_obj.width(), _rect_obj,height, _linewidth, _draw ? _drawcolor : "", _fill ? _fillcolor : "", "" );
       break ;
       case EXPORT_EPS:
       _glob_js_e_ps_obj.rect( _rect_obj.x1, _context.canvas.clientHeight - _rect_obj.y1, _rect_obj.width(), _rect_obj,height, _linewidth, _draw ? _drawcolor : "", _fill ? _fillcolor : "", "" );
       break ;
       case EXPORT_LATEX:
       _glob_js_latex_obj.rect( _rect_obj.x1, _context.canvas.clientHeight - _rect_obj.y1, _rect_obj.width(), _rect_obj,height, _fill ? _fillcolor : "" );
       break ;
       case EXPORT_NONE: default: break ;
   }
    
   return _rect_obj ;
}

function circles_lib_draw_rounded_rect( _context, _mapper, _rect_obj, _draw, _drawcolor, _fill, _fillcolor, _linewidth, _radius, _map_it, _opacity, _properties_mask )
{
   if ( !is_html_context( _context ) || !is_screen_mapper( _mapper ) ) return null ;
    _map_it = safe_int( _map_it, NO );
    _opacity = safe_float( _opacity, DEFAULT_MAX_OPACITY ), _properties_mask = safe_int( _properties_mask, 0 );
    _drawcolor = safe_string( _drawcolor, "transparent" ), _fillcolor = safe_string( _fillcolor, "transparent" );
    if ( _map_it && _mapper != null && ( _rect_obj != null && _rect_obj != UNDEF ) )
    {
       // remap _rect_obj
       _glob_persistent_vars['left_top_pt'] = _mapper.from_cartesian_to_client( _rect_obj.x1, _rect_obj.y1 );
       _glob_persistent_vars['right_bottom_pt'] = _mapper.from_cartesian_to_client( _rect_obj.x2, _rect_obj.y2 );
       _rect_obj = new rect( _glob_persistent_vars['left_top_pt'].x, _glob_persistent_vars['left_top_pt'].y, _glob_persistent_vars['right_bottom_pt'].x, _glob_persistent_vars['right_bottom_pt'].y );
    }

    _context.globalAlpha = _opacity ;
    _glob_persistent_vars['height'] = _map_it ? -_rect_obj.height() : _rect_obj.height();
    _glob_persistent_vars['width'] = _drawcolor.length == 0 ? _rect_obj.width() + 1 : _rect_obj.width();
    _glob_persistent_vars['x'] = _rect_obj.x1, _glob_persistent_vars['y'] = _rect_obj.y1 ;
      
    _context.beginPath();
    _context.moveTo( _glob_persistent_vars['x'] + _radius, _glob_persistent_vars['y'] );
    _context.arcTo( _glob_persistent_vars['x'] + _glob_persistent_vars['width'], _glob_persistent_vars['y'], _glob_persistent_vars['x'] + _glob_persistent_vars['width'], _glob_persistent_vars['y'] - _radius, _radius );
  
    // draw right side and bottom right corner
    _context.arcTo( _glob_persistent_vars['x'] + _glob_persistent_vars['width'], _glob_persistent_vars['y'] + _glob_persistent_vars['height'], _glob_persistent_vars['x'] + _glob_persistent_vars['width'] - _radius, _glob_persistent_vars['y'] + _glob_persistent_vars['height'], _radius );
    // draw bottom and bottom left corner
    _context.arcTo( _glob_persistent_vars['x'], _glob_persistent_vars['y'] + _glob_persistent_vars['height'], _glob_persistent_vars['x'], _glob_persistent_vars['y'] + _glob_persistent_vars['height'] + _radius, _radius );
    // draw left and top left corner
    _context.arcTo( _glob_persistent_vars['x'], _glob_persistent_vars['y'], _glob_persistent_vars['x'] + _radius, _glob_persistent_vars['y'], _radius );

    if ( _draw )
    {
       _context.lineWidth = _linewidth ;
       _context.strokeStyle = _drawcolor ;
       _context.stroke();
    }
      
    if ( _fill )
    {
       _context.fillStyle = _fillcolor ;
       _context.fill();
    }
      
    _context.closePath();
    if ( _map_it ) _rect_obj.y1 = Math.abs( _rect_obj.y1 - _rect_obj.h );

    switch( _glob_export_format )
    {
       case EXPORT_SVG:
       _svg_rect( _glob_export_code_array, _rect_obj, _opacity, _draw, _drawcolor, _fill, _fillcolor, _linewidth, _radius );
       break ;
       case EXPORT_PS:
       _glob_js_e_ps_obj.rounded_rect( _rect_obj.x1, _context.canvas.clientHeight - _rect_obj.y1, _rect_obj.width(), _rect_obj,height, _radius, _linewidth, _draw ? _drawcolor : "", _fill ? _fillcolor : "", "" );
       break ;
       case EXPORT_EPS:
       _glob_js_e_ps_obj.rounded_rect( _rect_obj.x1, _context.canvas.clientHeight - _rect_obj.y1, _rect_obj.width(), _rect_obj,height, _radius, _linewidth, _draw ? _drawcolor : "", _fill ? _fillcolor : "", "" );
       break ;
       case EXPORT_LATEX:
       _glob_js_latex_obj.rounded_rect( _rect_obj.x1, _context.canvas.clientHeight - _rect_obj.y1, _rect_obj.width(), _rect_obj,height, _fill ? _fillcolor : "" );
       break ;
       case EXPORT_NONE: default: break ;
    }
    
    return _rect_obj ;
}

function circles_lib_draw_pixel( _context, _mapper, _pt_x, _pt_y, _drawcolor, _size, _opacity, _properties_mask, _map_it )
{
   if ( !is_html_context( _context ) || !is_screen_mapper( _mapper ) ) return null ;
    _pt_x = safe_float( _pt_x, 0 ), _pt_y = safe_float( _pt_y, 0 );
    _drawcolor = safe_string( _drawcolor, "transparent" );
    _opacity = safe_float( _opacity, DEFAULT_MAX_OPACITY );
    _size = safe_int( _size, 1 ), _map_it = safe_int( _map_it, is_screen_mapper( _mapper ) ? YES : NO ), _properties_mask = safe_int( _properties_mask, 0 );
    if ( _map_it ) _glob_persistent_vars['scr_pt'] = _mapper.from_cartesian_to_client( _pt_x, _pt_y ) ;
    else
    {
      _glob_persistent_vars['scr_pt'].x = _pt_x, _glob_persistent_vars['scr_pt'].y = _pt_y ;
    }

    _context.globalAlpha = _opacity ;
    _context.beginPath();
    _context.fillStyle = _drawcolor ;
    _context.fillRect( _glob_persistent_vars['scr_pt'].x - _size / 2, _glob_persistent_vars['scr_pt'].y - _size / 2, _size / 2, _size / 2 );
    _context.stroke();
    _context.closePath();

    switch( _glob_export_format )
    {
       case EXPORT_SVG:
       _svg_pixel( _glob_export_code_array, _glob_persistent_vars['scr_pt'], 1, YES, _drawcolor );
       break ;
       case EXPORT_PS:
       _glob_js_e_ps_obj.pixel( _glob_persistent_vars['scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['scr_pt'].y, _drawcolor, "" );
       break ;
       case EXPORT_EPS:
       _glob_js_e_ps_obj.pixel( _glob_persistent_vars['scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['scr_pt'].y, _drawcolor, "" );
       break ;
       case EXPORT_LATEX:
       _glob_js_latex_obj.pixel( _glob_persistent_vars['scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['scr_pt'].y, _drawcolor, "" );
       break ;
       case EXPORT_NONE: default: break ;
    }

    return _glob_persistent_vars['scr_pt'] ;
}

// in this config, the point is a different geometric object from the pixel
function circles_lib_draw_point( _context, _mapper, _pt_x, _pt_y, _draw, _drawcolor, _fill, _fillcolor, _linewidth, _radius, _opacity, _properties_mask, _map_it )
{
   if ( !is_html_context( _context ) || !is_screen_mapper( _mapper ) ) return null ;
    _pt_x = safe_float( _pt_x, 0 ), _pt_y = safe_float( _pt_y, 0 );
    _draw = safe_int( _draw, YES ), _fill = safe_int( _fill, YES );
    _drawcolor = safe_string( _drawcolor, "transparent" ), _fillcolor = safe_string( _fillcolor, "transparent" );
    _linewidth = safe_int( _linewidth, 0 ), _radius = safe_float( _radius, 1 );
    _properties_mask = safe_int( _properties_mask, 0 );
    _opacity = safe_float( _opacity, DEFAULT_MAX_OPACITY );
    _map_it = safe_int( _map_it, is_screen_mapper( _mapper ) ? YES : NO );
    if ( _map_it ) _glob_persistent_vars['scr_pt'] = _mapper.from_cartesian_to_client( _pt_x, _pt_y ) ;
    else
    {
       _glob_persistent_vars['scr_pt'].x = _pt_x, _glob_persistent_vars['scr_pt'].y = _pt_y ;
    }

    _context.globalAlpha = _opacity ;
    _context.beginPath();
    _context.lineWidth = _linewidth ;
    _context.arc( _glob_persistent_vars['scr_pt'].x, _glob_persistent_vars['scr_pt'].y, _radius, 0, CIRCLES_TWO_PI ); // goes along the line _drawing the arc
    if ( _draw && _drawcolor.length > 0 )
    {
       _context.strokeStyle = _drawcolor ;
       _context.stroke();
    }
    if ( _fill && _fillcolor.length > 0 )
    {
       _context.fillStyle = _fillcolor ;
       _context.fill();
    }
    
		_context.closePath();

    switch( _glob_export_format )
    {
       case EXPORT_SVG:
       _svg_point( _glob_export_code_array, _glob_persistent_vars['scr_pt'], _draw, _drawcolor, _fill, _fillcolor, _linewidth, _radius );
       break ;
       case EXPORT_PS:
       _glob_js_e_ps_obj.point( _glob_persistent_vars['scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['scr_pt'].y, _linewidth, _draw ? _drawcolor : "", _fill ? _fillcolor : "", "" );
       break ;
       case EXPORT_EPS:
       _glob_js_e_ps_obj.point( _glob_persistent_vars['scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['scr_pt'].y, _linewidth, _draw ? _drawcolor : "", _fill ? _fillcolor : "", "" );
       break ;
       case EXPORT_LATEX:
       _glob_js_latex_obj.point( _glob_persistent_vars['scr_pt'].x, _context.canvas.clientHeight - _glob_persistent_vars['scr_pt'].y, _linewidth, _fill, _fill ? _fillcolor : "" );
       break ;
       case EXPORT_NONE: default: break ;
    }

    return _glob_persistent_vars['scr_pt'] ;
}

function circles_lib_draw_text( _context, _mapper, X, Y, TEXT, _textcolor, _fontstyle, _shift_x, _shift_y, _map_it, _opacity, _properties_mask, _align )
{
   if ( !is_html_context( _context ) || !is_screen_mapper( _mapper ) ) return NO ;
    X = safe_float( X, 0 ), Y = safe_float( Y, 0 );
    _opacity = safe_float( _opacity, DEFAULT_MAX_OPACITY );
    _properties_mask = safe_int( _properties_mask, 0 );
    _map_it = safe_int( _map_it, is_screen_mapper( _mapper ) ? YES : NO );
    _shift_x = safe_float( _shift_x, 0 );
    _shift_y = safe_float( _shift_y, 0 );
    _textcolor = safe_string( _textcolor, "" );
    _fontstyle = safe_string( _fontstyle, "" );
    _align = safe_string( _align, "self" ).toLowerCase() ;
    TEXT = safe_string( TEXT, "" );
    if ( safe_size( TEXT, 0 ) == 0 ) return NO ;
		if ( !_align.is_one_of( "left", "center", "right", "self" ) ) _align = "left" ;
      
    _glob_persistent_vars['scr_center_pt'] = _map_it ? _mapper.from_cartesian_to_client( X, Y ) : new point( X, Y );

    _context.globalAlpha = _opacity ;
    _context.font = _fontstyle.length == 0 ? DEFAULT_FONT_SIZE + " " + DEFAULT_FONT_FAMILY : _fontstyle ;
    _context.fillStyle = _textcolor.length == 0 ? DEFAULT_COLOR_STD : _textcolor ;

		var _metrics = _context.measureText( TEXT );
		switch( _align )
		{
				case "left": _glob_persistent_vars['scr_center_pt'].x = 0 ; break ;
				case "center": _glob_persistent_vars['scr_center_pt'].x = ( _context.get_width() - _metrics.width ) / 2.0 ; break ;
				case "right": _glob_persistent_vars['scr_center_pt'].x = _context.get_width() - _metrics.width ; break ;
        default: break ;
		}

    _context.fillText( TEXT, _glob_persistent_vars['scr_center_pt'].x + _shift_x, _glob_persistent_vars['scr_center_pt'].y + _shift_y );
		
    switch( _glob_export_format )
    {
        case EXPORT_SVG:
        _svg_text( _glob_export_code_array,
                   _glob_persistent_vars['scr_center_pt'].x + _shift_x,
                   _glob_persistent_vars['scr_center_pt'].y + _shift_y,
                   TEXT, _textcolor, DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE );
        break ;
        case EXPORT_PS:
        _glob_js_e_ps_obj.text( DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, _textcolor,
                                _glob_persistent_vars['scr_center_pt'].x + _shift_x, _context.canvas.clientHeight - ( _glob_persistent_vars['scr_center_pt'].y + _shift_y ),
                                TEXT, "" );
        break ;
        case EXPORT_EPS:
        _glob_js_e_ps_obj.text( DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, _textcolor,
                                _glob_persistent_vars['scr_center_pt'].x + _shift_x, _context.canvas.clientHeight - ( _glob_persistent_vars['scr_center_pt'].y + _shift_y ),
                                TEXT, "" );
        break ;
        case EXPORT_LATEX:
        _glob_js_latex_obj.text( _glob_persistent_vars['scr_center_pt'].x + _shift_x, _context.canvas.clientHeight - ( _glob_persistent_vars['scr_center_pt'].y + _shift_y ),
                                 TEXT, _textcolor );
        break ;
        case EXPORT_NONE:
        default:
        break ;
    }
    
		return YES ;
}