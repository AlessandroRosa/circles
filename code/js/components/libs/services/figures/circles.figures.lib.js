function circles_lib_figures_rehash()
{
    if ( is_array( _glob_figures_array ) )
    {
		$.each( _glob_figures_array, function( _index, _chunk ) { _glob_figures_array[_index]['myhash'] = "rec" + ( _index + 1 ); } );
		return YES ;
	}
	else return NO ;
}

function circles_lib_figures_add( _rec_chunk )
{
    if ( is_array( _glob_figures_array ) )
    {
       _glob_figures_array.push( _rec_chunk );
       circles_lib_figures_rehash();
       return YES ;
    }
    else return NO ;
}

function circles_lib_figures_disconnect( _output_channel, _figures_array, _param_01 )
{
    var _rec_chunk, _obj, _class, _points, _new_entries = [], _i, _x, _tmp_chunk ;
    for( _i = 0 ; _i < _figures_array.length ; _i++ )
    {
        _rec_chunk = _figures_array[_i] ;
        if ( _rec_chunk != null )
        {
			_class = _rec_chunk['class'], _obj = _rec_chunk['obj'] ;
			if ( _obj != null )
			{
				switch( _class )
				{
					case FIGURE_CLASS_LINE:
					_points = _obj.clone(); // obj is already an array of points
					_tmp_chunk = null ;
					if ( is_array( _points ) )
					{
                      for( _x = 0 ; _x < _points.length ; _x++ )
                      {
                         _tmp_chunk = [];
                         _tmp_chunk['class'] = FIGURE_CLASS_POINT ;
                         _tmp_chunk['obj'] = new point( _points[_x].x, _points[_x].y );
                         _tmp_chunk['plane'] = _rec_chunk['plane'] ;
                         _tmp_chunk['draw'] = _rec_chunk['draw'] ;
                         _tmp_chunk['bordercolor'] = _rec_chunk['bordercolor'] ;
                         _tmp_chunk['fill'] = _rec_chunk['fill'] ;
                         _tmp_chunk['fillcolor'] = _rec_chunk['fillcolor'] ;
                         _tmp_chunk['opacity'] = _rec_chunk['opacity'] ;
                         _tmp_chunk['bordersize'] = _rec_chunk['bordersize'] ;
                         _tmp_chunk['enabled'] = _rec_chunk['enabled'] ;
                         _tmp_chunk['myhash'] = _rec_chunk['myhash'] ;
                         _tmp_chunk['label'] = "" ;
                         _tmp_chunk['propertiesmask'] = 0 ;
                         _new_entries.push( _tmp_chunk );
                      }
					}
					break ;
					case FIGURE_CLASS_RECT:
					_points = _obj.corners();
					_tmp_chunk = null ;
					if ( is_array( _points ) )
					{
						for( _x = 0 ; _x < _points.length ; _x++ )
						{
                        _tmp_chunk = [];
                        _tmp_chunk['class'] = FIGURE_CLASS_POINT ;
                        _tmp_chunk['obj'] = new point( _points[_x].x, _points[_x].y );
                        _tmp_chunk['plane'] = _rec_chunk['plane'] ;
                        _tmp_chunk['draw'] = _rec_chunk['draw'] ;
                        _tmp_chunk['bordercolor'] = _rec_chunk['bordercolor'] ;
                        _tmp_chunk['fill'] = _rec_chunk['fill'] ;
                        _tmp_chunk['fillcolor'] = _rec_chunk['fillcolor'] ;
                        _tmp_chunk['opacity'] = _rec_chunk['opacity'] ;
                        _tmp_chunk['bordersize'] = _rec_chunk['bordersize'] ;
                        _tmp_chunk['enabled'] = _rec_chunk['enabled'] ;
                        _tmp_chunk['myhash'] = _rec_chunk['myhash'] ;
                        _tmp_chunk['propertiesmask'] = 0 ;
                        _new_entries.push( _tmp_chunk );
						}
					}
					break ;
				    default: break ;
				}
			}
        }
    }
    return _new_entries.clone();
}

function circles_lib_figures_output_text( _fig_obj, _separator )
{
    _separator = safe_string( _separator, _glob_crlf );
    if ( is_array( _fig_obj ) )
    {
        var _text_array = [], _clr_formats = null ;
        switch( _rec_chunk['class'] )
        {
            case FIGURE_CLASS_CIRCLE:
            _text_array.push( "Circle" );
            _text_array.push( _fig_obj['class'].output() );
            _text_array.push( "Plane " + circles_lib_plane_def_get( _fig_obj['plane'] ) );
            _text_array.push( "Draw " + ( _fig_obj['draw'] ? "yes" : "no" ) );
            _text_array.push( "Fill " + ( _fig_obj['fill'] ? "yes" : "no" ) );
            _clr_formats = circles_lib_colors_get_formats( _fig_obj['bordercolor'] );
            _text_array.push( "Draw color " + ( _clr_formats[0] == RET_OK ? ( safe_size( _clr_formats[3], 0 ) > 0 ? _clr_formats[3] : _clr_formats[1] ) : "none" ) );
            _clr_formats = circles_lib_colors_get_formats( _fig_obj['fillcolor'] );
            _text_array.push( "Fill color " + ( _clr_formats[0] == RET_OK ? ( safe_size( _clr_formats[3], 0 ) > 0 ? _clr_formats[3] : _clr_formats[1] ) : "none" ) );
            _text_array.push( "Opacity " + _fig_obj['opacity'] );
            _text_array.push( "Line width " + _fig_obj['bordersize'] );
            _text_array.push( "Enabled " + ( _fig_obj['enabled'] ? "yes" : "no" ) );
            break ;
            case FIGURE_CLASS_LINE:
            _text_array.push( "Line" );
            _text_array.push( _fig_obj['class'].output() );
            _text_array.push( "Plane " + circles_lib_plane_def_get( _fig_obj['plane'] ) );
            _text_array.push( "Draw " + ( _fig_obj['draw'] ? "yes" : "no" ) );
            _text_array.push( "Fill " + ( _fig_obj['fill'] ? "yes" : "no" ) );
            _clr_formats = circles_lib_colors_get_formats( _fig_obj['bordercolor'] );
            _text_array.push( "Draw color " + ( _clr_formats[0] == RET_OK ? ( safe_size( _clr_formats[3], 0 ) > 0 ? _clr_formats[3] : _clr_formats[1] ) : "none" ) );
            _clr_formats = circles_lib_colors_get_formats( _fig_obj['fillcolor'] );
            _text_array.push( "Fill color " + ( _clr_formats[0] == RET_OK ? ( safe_size( _clr_formats[3], 0 ) > 0 ? _clr_formats[3] : _clr_formats[1] ) : "none" ) );
            _text_array.push( "Enabled " + ( _fig_obj['enabled'] ? "yes" : "no" ) );
            break ;
            case FIGURE_CLASS_POINT:
            _text_array.push( "Point" );
            _text_array.push( _fig_obj['class'].output() );
            _text_array.push( "Plane " + circles_lib_plane_def_get( _fig_obj['plane'] ) );
            _text_array.push( "Draw " + ( _fig_obj['draw'] ? "yes" : "no" ) );
            _text_array.push( "Fill " + ( _fig_obj['fill'] ? "yes" : "no" ) );
            _clr_formats = circles_lib_colors_get_formats( _fig_obj['bordercolor'] );
            _text_array.push( "Draw color " + ( _clr_formats[0] == RET_OK ? ( safe_size( _clr_formats[3], 0 ) > 0 ? _clr_formats[3] : _clr_formats[1] ) : "none" ) );
            _clr_formats = circles_lib_colors_get_formats( _fig_obj['fillcolor'] );
            _text_array.push( "Fill color " + ( _clr_formats[0] == RET_OK ? ( safe_size( _clr_formats[3], 0 ) > 0 ? _clr_formats[3] : _clr_formats[1] ) : "none" ) );
            _text_array.push( "Enabled " + ( _fig_obj['enabled'] ? "yes" : "no" ) );
            break ;
            case FIGURE_CLASS_RECT:
            _text_array.push( "Rectangle" );
            _text_array.push( _fig_obj['class'].output() );
            _text_array.push( "Plane " + circles_lib_plane_def_get( _fig_obj['plane'] ) );
            _text_array.push( "Draw " + ( _fig_obj['draw'] ? "yes" : "no" ) );
            _text_array.push( "Fill " + ( _fig_obj['fill'] ? "yes" : "no" ) );
            _clr_formats = circles_lib_colors_get_formats( _fig_obj['bordercolor'] );
            _text_array.push( "Draw color " + ( _clr_formats[0] == RET_OK ? ( safe_size( _clr_formats[3], 0 ) > 0 ? _clr_formats[3] : _clr_formats[1] ) : "none" ) );
            _clr_formats = circles_lib_colors_get_formats( _fig_obj['fillcolor'] );
            _text_array.push( "Fill color " + ( _clr_formats[0] == RET_OK ? ( safe_size( _clr_formats[3], 0 ) > 0 ? _clr_formats[3] : _clr_formats[1] ) : "none" ) );
            _text_array.push( "Enabled " + ( _fig_obj['enabled'] ? "yes" : "no" ) );
            break ;
            default: return ""; break ;
        }
        return _text_array.join( _separator );
    }
}

function circles_lib_figures_find_duplicates( _class, _plane, _obj, _haystack )
{
    var _b_go = NO, _b_found = NO ;
    if ( !is_array( _haystack ) ) _haystack = _glob_figures_array ;
    if ( ( _class == FIGURE_CLASS_RECT && is_rect( _obj ) ) ||
		 ( _class == FIGURE_CLASS_CIRCLE && is_circle( _obj ) ) ||
		 ( _class == FIGURE_CLASS_LINE && is_line( _obj ) ) ||
		 ( _class == FIGURE_CLASS_POINT && is_point( _obj ) ) ) _b_go = YES ;
    if ( _b_go )
    {
       var _chunk = null ;
       for( var _i = 0 ; _i < _haystack.length ; _i++ )
       {
          _chunk = _haystack[_i] ;
          if ( _chunk != null )
          {
             if ( _chunk['class'] == _class && _chunk['plane'] == _plane && _chunk['obj'].is_equal_to( _obj ) )
             {
                _b_found = YES ;
                break ;
             }
          }
       }
    }
    return _b_found ;
}

function circles_lib_figures_update_manager( _output_channel = OUTPUT_SCREEN, _options = [], _param_01 = "", _refresh = YES )
{
    var _b_fail = 0, _ret_flag = 0, _error_str = "", _zerobased_index, _figure_label = "", _value = null, _rec_chunk = null ;
    var _n_update_values = Math.min( safe_size( _options['input_params'], 0 ), safe_size( _options['input_values'], 0 ) );
    if ( _options['input_values'] == null ) { _b_fail = YES ; _error_str = "Incomplete cmd: missing input value (uninitialized)" ; }
    else if ( _options['input_values'].length == 0 ) { _b_fail = YES ; _error_str = "Incomplete cmd: missing input value (empty)" ; }
    else if ( _n_update_values > 0 )
    {
        // separate entries of indexes from properties to be updated
        var _index_array = [], _other_params = [], _other_values = [];
        $.each( _options['input_params'], function( _i, _param ) {
                if ( _param.stricmp( "entryindex" ) ) _index_array.push( _options['input_values'][_i] );
                else { _other_params.push( _param ); _other_values.push( _options['input_values'][_i] ); } } );

        // check input params to be coherent with each obj properties
        var _point_params_table_array = [ 'coords', 'bordercolor', 'fillcolor', 'opacity', 'bordersize' ];
        var _rect_params_table_array = [ 'lefttop', 'rightbottom', 'center', 'width', 'height', 'draw', 'bordercolor', 'fill', 'fillcolor', 'opacity', 'bordersize', 'borderradius' ];
        var _line_params_table_array = [ 'coords', 'points', 'draw', 'fill', 'bordercolor', 'fillcolor', 'opacity', 'bordersize', 'mark', 'close' ];
        var _circle_params_table_array = [ 'center', 'radius', 'draw', 'fill', 'bordercolor', 'fillcolor', 'opacity', 'bordersize' ];
        var _i, _x ;

        for( _i = 0 ; _i < _index_array.length ; _i++ )
        {
            _zerobased_index = safe_int( _index_array[_i], 0 ) - 1 ;
            if ( _zerobased_index < 0 )
            {
                if ( _glob_terminal_echo_flag )
                circles_lib_output( _output_channel, DISPATCH_WARNING, "Skipped invalid index '"+_index_array[_i]+"'", _param_01 );
                continue ;
            }

            _rec_chunk = _glob_figures_array[ _zerobased_index ] ;
            _figure_label = "", _value = null ;
            _plane = _rec_chunk['plane'], _enabled = _rec_chunk['enabled'] ;
            _figure_label = circles_lib_figure_get_def( _rec_chunk['class'] );
            _ret_flag = YES ;
            for( _x = 0 ; _x < _other_params.length ; _x++ )
            {
                _param = _other_params[_x], _value = _other_values[_x] ;
                switch( _rec_chunk['class'] )
                {
                    case FIGURE_CLASS_POINT:
                    if ( !_point_params_table_array.includes( _param ) )
                    {
                        if ( _glob_terminal_echo_flag )
                        circles_lib_output( _output_channel, DISPATCH_WARNING, "Skipped invalid param '"+_param+"' for "+_figure_label+" obj", _param_01 );
                        continue ;
                    }

                    if ( _param.testME( _glob_cartesian_coords_regex_pattern ) ) _ret_flag &= 1 ;
                    else if ( _param.stricmp( "coords" ) )
                    {
                        if ( is_string( _value ) )
                        {
                            if ( _value.testME( _glob_cartesian_coords_regex_pattern ) )
                            {
                                _value = _value.replaceAll( [ "(", ")" ], "" );
                                var _pt_coords = _value.split( "," );
                                _rec_chunk['obj'] = new point( safe_float( _pt_coords[0], 0 ), safe_float( _pt_coords[1], 0 ) );
                                _ret_flag &= 1 ;
                            }
                        }
                    }
                    else if ( _param.stricmp( "opacity" ) )
                    {
                        _value = Math.min( safe_float( _value, DEFAULT_MAX_OPACITY ), DEFAULT_MAX_OPACITY );
                        _value = Math.max( 0, _value );
                        _rec_chunk['opacity'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "draw" ) )
                    {
                        _rec_chunk['draw'] = safe_int( _value, NO );
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "fill" ) )
                    {
                        _rec_chunk['fill'] = safe_int( _value, NO );
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "bordercolor" ) )
                    {
                        _rec_chunk['draw'] = _value.stricmp( "noclr" ) ? NO : YES ;
                        _rec_chunk['bordercolor'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "fillcolor" ) )
                    {
                        _rec_chunk['fill'] = _value.stricmp( "noclr" ) ? NO : YES ;
                        _rec_chunk['fillcolor'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "bordersize" ) )
                    {
                        _rec_chunk['bordersize'] = safe_int( _value, 0 );
                        _ret_flag &= 1 ;
                    }
                    else _ret_flag = 0 ;
                    break ;
                    case FIGURE_CLASS_CIRCLE:
                    if ( !_circle_params_table_array.includes( _param ) )
                    {
                         if ( _glob_terminal_echo_flag )
                         circles_lib_output( _output_channel, DISPATCH_WARNING, "Skipped invalid param '"+_param+"' for "+_figure_label+" obj", _param_01 );
                         continue ;
                    }

                    if ( _value.testME( _glob_cartesian_coords_regex_pattern ) ) _ret_flag &= 1 ;
                    else if ( _param.stricmp( "center" ) )
                    {
                        if ( is_string( _value ) )
                        {
                            if ( _value.testME( _glob_cartesian_coords_regex_pattern ) )
                            {
                                _value = _value.replaceAll( [ "(", ")" ], "" );
                                var _pt_coords = _value.split( "," );
                                _rec_chunk['obj'].center = new point( safe_float( _pt_coords[0], 0 ), safe_float( _pt_coords[1], 0 ) );
                                _ret_flag &= 1 ;
                            }
                        }
                    }
                    else if ( _param.stricmp( "radius" ) )
                    {
                        _rec_chunk['obj'].radius = safe_float( _value, 0 );
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "opacity" ) )
                    {
                        _value = Math.min( safe_float( _value, DEFAULT_MAX_OPACITY ), DEFAULT_MAX_OPACITY );
                        _value = Math.max( 0, _value );
                        _rec_chunk['opacity'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "draw" ) )
                    {
                        _rec_chunk['draw'] = safe_int( _value, YES );
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "fill" ) )
                    {
                        _rec_chunk['fill'] = safe_int( _value, YES );
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "bordercolor" ) )
                    {
                        _rec_chunk['draw'] = _value.stricmp( "noclr" ) ? NO : YES ;
                        _rec_chunk['bordercolor'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "fillcolor" ) )
                    {
                        _rec_chunk['fill'] = _value.stricmp( "noclr" ) ? NO : YES ;
                        _rec_chunk['fillcolor'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "bordersize" ) )
                    {
                        _rec_chunk['bordersize'] = safe_int( _value, 0 );
                        _ret_flag &= 1 ;
                    }
                    else _ret_flag = 0 ;
                    break ;
                    case FIGURE_CLASS_LINE:
                    if ( !_line_params_table_array.includes( _param ) )
                    {
                        if ( _glob_terminal_echo_flag )
                        circles_lib_output( _output_channel, DISPATCH_WARNING, "Skipped invalid param '"+_param+"' for "+_figure_label+" obj", _param_01 );
                        continue ;
                    }

                    if ( _param.testME( _glob_cartesian_coords_regex_pattern ) ) _ret_flag &= 1 ;
                    else if ( _param.stricmp( "close" ) )
                    {
                        _rec_chunk['close'] = safe_int( _value, NO );
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "mark" ) )
                    {
                        _rec_chunk['propertiesmask'] |= 1 ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "unmark" ) )
                    {
                        _rec_chunk['propertiesmask'] &= ~1 ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "points" ) )
                    {
                        if ( _value.length > 0 )
                        {
                            if ( safe_size( _rec_chunk['obj'], 0 ) == 0 ) _rec_chunk['obj'] = [] ;
                            else _rec_chunk['obj'].flush();
                            var _pt_coords ;
                            for( var _i = 0 ; _i < _options['input_values'].length ; _i++ )
                            {
                                _value = _options['input_values'][_i] ;
                                if ( is_string( _value ) )
                                {
                                    if ( _value.testME( _glob_cartesian_coords_regex_pattern ) )
                                    {
                                        _value = _value.replaceAll( [ "(", ")" ], "" );
                                        _pt_coords = _value.split( "," );
                                        _rec_chunk['obj'].push( new point( parseFloat( _pt_coords[0] ), parseFloat( _pt_coords[1] ) ) );
                                        _ret_flag &= 1 ;
                                    }
                                }
                            }
                        }
                    }
                    else if ( _param.stricmp( "opacity" ) )
                    {
                        _value = Math.min( safe_float( _value, DEFAULT_MAX_OPACITY ), DEFAULT_MAX_OPACITY );
                        _value = Math.max( 0, _value );
                        _rec_chunk['opacity'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "draw" ) )
                    {
                        _rec_chunk['draw'] = safe_int( _value, YES );
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "bordercolor" ) )
                    {
                        _rec_chunk['draw'] = _value.stricmp( "noclr" ) ? NO : YES ;
                        _rec_chunk['bordercolor'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "fillcolor" ) )
                    {
                        // for polylines
                        _rec_chunk['fill'] = _value.stricmp( "noclr" ) ? NO : YES ;
                        _rec_chunk['fillcolor'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "bordersize" ) )
                    {
                        _rec_chunk['bordersize'] = safe_int( _value, 0 );
                        _ret_flag &= 1 ;
                    }
                    else _ret_flag = 0 ;
                    break ;
                    case FIGURE_CLASS_RECT:
                    if ( !_rect_params_table_array.includes( _param ) )
                    {
                        if ( _glob_terminal_echo_flag )
                        circles_lib_output( _output_channel, DISPATCH_WARNING, "Skipped invalid param '"+_param+"' for "+_figure_label+" obj", _param_01 );
                        continue ;
                    }
                    if ( _param.testME( _glob_cartesian_coords_regex_pattern ) ) _ret_flag &= 1 ;
                    else if ( _param.stricmp( "lefttop" ) || _param.stricmp( "rightbottom" ) )
                    {
                        if ( is_string( _value ) )
                        {
                            if ( _value.testME( _glob_cartesian_coords_regex_pattern ) )
                            {
                                _value = _value.replaceAll( [ "(", ")" ], "" );
                                var _pt_coords = _value.split( "," );
                                if ( _param.strcmp( "lefttop" ) )
                                _rec_chunk['obj'].set_corner( "left", "top", _pt_coords[0], _pt_coords[1] );
                                else if ( _param.strcmp( "rightbottom" ) )
                                _rec_chunk['obj'].set_corner( "right", "bottom", _pt_coords[0], _pt_coords[1] );
                                _ret_flag &= 1 ;
                            }
                        }
                    }
                    else if ( _param.stricmp( "width" ) )
                    {
                        var _width = safe_float( _value, 0 );
                        var _obj = _rec_chunk['obj'] ;
                        var _height = _obj.height();
                        var _ret_chunk = _obj.get_corner( "left", "top" );
                        var _left = _ret_chunk['x'], _top = _ret_chunk['y'] ;
                        _obj.width_height_constructor( _left, _top, _width, _height, _RECT_ORIENTATION_CARTESIAN, _obj.notes );
                        _rec_chunk['obj'] = _obj ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "height" ) )
                    {
                        var _height = safe_float( _value, 0 );
                        var _obj = _rec_chunk['obj'] ;
                        var _width = _obj.width();
                        var _ret_chunk = _obj.get_corner( "left", "top" );
                        var _left = _ret_chunk['x'], _top = _ret_chunk['y'] ;
                        _obj.width_height_constructor( _left, _top, _width, _height, _RECT_ORIENTATION_CARTESIAN, _obj.notes );
                        _rec_chunk['obj'] = _obj ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "center" ) )
                    {
                        if ( is_string( _value ) )
                        {
                            if ( _value.testME( _glob_cartesian_coords_regex_pattern ) )
                            {
                                _value = _value.replaceAll( [ "(", ")" ], "" );
                                var _pt_coords = _value.split( "," );
                                var _new_center_pt = new point( parseFloat( _pt_coords[0] ), parseFloat( _pt_coords[1] ) );
                                var _obj = _rec_chunk['obj'] ;
                                    _obj.center_at( _new_center_pt.x, _new_center_pt.y );
                                _rec_chunk['obj'] = _obj ;
                                _ret_flag &= 1 ;
                            }
                        }
                    }
                    else if ( _param.stricmp( "opacity" ) )
                    {
                        _value = Math.min( safe_float( _value, DEFAULT_MAX_OPACITY ), DEFAULT_MAX_OPACITY );
                        _value = Math.max( 0, _value );
                        _rec_chunk['opacity'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "draw" ) )
                    {
                        _rec_chunk['draw'] = safe_int( _value, NO );
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "fill" ) )
                    {
                        _rec_chunk['fill'] = safe_int( _value, NO );
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "bordercolor" ) )
                    {
                        _rec_chunk['draw'] = _value.stricmp( "noclr" ) ? NO : YES ;
                        _rec_chunk['bordercolor'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "fillcolor" ) )
                    {
                        _rec_chunk['fill'] = _value.stricmp( "noclr" ) ? NO : YES ;
                        _rec_chunk['fillcolor'] = _value ;
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "bordersize" ) )
                    {
                        _rec_chunk['bordersize'] = safe_int( _value, 0 );
                        _ret_flag &= 1 ;
                    }
                    else if ( _param.stricmp( "borderradius" ) )
                    {
                        _rec_chunk['borderradius'] = safe_int( _value, 0 );
                        _ret_flag &= 1 ;
                    }
                    else _ret_flag = 0 ;
                    break ;
                    default:
                    _b_fail = YES ; _error_str = "Update failure: input obj "+_index+" is not of 'circle', 'line', 'point', 'rect' kind" ;
                    break ;
               }

               if ( !_ret_flag && _glob_terminal_echo_flag )
               circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: unknown param '"+_param+"' for " + _figure_label + " obj", _param_01 );
			   else
			   {
					_glob_figures_array[ _zerobased_index ] = _rec_chunk, _plane_def = circles_lib_plane_def_get( _plane );
					if ( _plane != NO_PLANE && _refresh )
					{
						var _layer = circles_lib_canvas_layer_find( _rec_chunk['plane'], FIND_LAYER_BY_ROLE_DEF, _rec_chunk['layer'] );
						if ( _glob_terminal_echo_flag )
						{
							circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<snow>("+_plane_def+")</snow> <green>obj "+_figure_label+" #"+( _i + 1 )+" updated</green>", _param_01 );
							circles_lib_output( _output_channel, DISPATCH_INFO, "Refreshing "+_plane_def, _param_01 );
						}
						circles_lib_canvas_afterrender_figures_draw( null, YES, _rec_chunk['plane'], _layer );
					}
			   }
           }

        }
    }

    if ( ( _b_fail || _ret_flag == 0 ) && _glob_terminal_echo_flag )
    circles_lib_output( _output_channel, DISPATCH_WARNING, _error_str, _param_01 );
    return [ _b_fail, _error_str ] ;
}

function circles_lib_figures_action( _output_channel = OUTPUT_SCREEN, _action = "", _index_vals_array = [], _plane_type = NO_PLANE, _refresh = YES, _param_01 = 0 )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ), _refresh = safe_int( _refresh, YES );
    var _n_input_index = safe_size( _index_vals_array, 0 ), _b_fail = NO, _error_str = "" ;
    if ( _n_input_index > 0 )
    {
        var _n = safe_size( _glob_figures_array, 0 );
        if ( _n > 0 )
        {
             var _myhash, _hash_table = [], _plane = safe_int( _plane_type, NO_PLANE ), _p ;
             for( var _h = 0 ; _h < _index_vals_array.length ; _h++ )
             {
                _p = safe_int( _index_vals_array[_h], 0 );
                if ( _glob_figures_array[ _h ] != null )
                _hash_table.push( _glob_figures_array[_p-1]['myhash'] );
             }

             for( var _x = 0 ; _x < _glob_figures_array.length ; _x++ )
             {
                   _myhash = _glob_figures_array[_x]['myhash'] ; // zero-based index
                   if ( _hash_table.includes( _myhash ) )
                   {
                        _myhash = safe_int( _myhash.replaceAll( "rec", "" ), UNDET );
                        switch( _action )
                        {
                            case "delete":
                            _glob_figures_array.remove( _x, _x );
                            if ( _glob_terminal_echo_flag )
                            circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Item #"+_myhash+" deleted", _param_01 );
                            _x = -1 ;
                            _refresh = YES ;
                            break ;
                            case "disable":
                            case "hide":
                            _glob_figures_array[_x]['enabled'] = NO ;
                            if ( _glob_terminal_echo_flag ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Item #"+_myhash+" disabled", _param_01 );
                            _refresh = YES ;
                            break ;
                            case "enable":
                            case "show":
                            _glob_figures_array[_x]['enabled'] = YES ;
                            if ( _glob_terminal_echo_flag ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Item #"+_myhash+" enabled", _param_01 );
                            _refresh = YES ;
                            break ;
                            case "transfer":
                            _glob_figures_array[_x]['plane'] = _plane ;
                            if ( _glob_terminal_echo_flag ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Item #"+_myhash+" transfered to " + circles_lib_plane_def_get(_plane), _param_01 );
                            _refresh = YES ;
                            break ;
						    default: break ;
                        }
                   }
                   else { _b_fail = YES ; _error_str = "Can't "+_action+": index must be greater than zero" ; }
             }

             if ( _action.stricmp( "delete" ) && _glob_figures_array.length > 0 )
             {
                 // rebuild hash tags after previous operations
                 if ( _glob_terminal_echo_flag ) circles_lib_output( _output_channel, DISPATCH_INFO, "Rebuilding hash tags", _param_01 );
                 for( var _i = 0 ; _i < _glob_figures_array.length ; _i++ ) _glob_figures_array[_i]['myhash'] = "rec"+(_i+1);
             }

             circles_lib_canvas_afterrender_figures_draw( null, YES, _plane_type );
        }
        else { _b_fail = YES ; _error_str = "Can't "+_action+": the list of figures is empty" ; }
    }
    else { _b_fail = YES ; _error_str = "Can't "+_action+": missing index to candidate item" ; }

    if ( _refresh )
    {
        var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _output_channel );
        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown message" ;
        if ( _ret_id == RET_OK )
        {
           // no render, just draw other stuff
           _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, null, YES, YES, NO, YES, NO, YES, _output_channel );
           _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
           _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown message" ;
           if ( _ret_id == RET_ERROR ) { _b_fail = YES, _error_str = _ret_msg ; }
        }
        else { _b_fail = YES, _error_str = _ret_msg ; }
    }
    return [ _b_fail, _error_str ] ;
}