function circles_lib_figures_rehash()
{
    if ( is_array( _glob_figures_array ) )
    {
		$.each( _glob_figures_array, function( _index, _chunk ) { _glob_figures_array[_index]['myhash'] = "rec" + _index; } );
		return YES ;
	}
	else return NO ;
}

function circles_lib_figures_add( _rec_chunk )
{
    if ( is_array( _glob_figures_array ) )
    {
       _glob_figures_array.push( _rec_chunk );
       return circles_lib_figures_rehash();
    }
    else return NO ;
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
            _text_array.push( "Draw " + ( _fig_obj['border'] ? "yes" : "no" ) );
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
            _text_array.push( "Draw " + ( _fig_obj['border'] ? "yes" : "no" ) );
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
            _text_array.push( "Draw " + ( _fig_obj['border'] ? "yes" : "no" ) );
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
            _text_array.push( "Draw " + ( _fig_obj['border'] ? "yes" : "no" ) );
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
		 ( _class == FIGURE_CLASS_POLYGON && is_array( _obj ) ) ||
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

function circles_lib_figures_update_manager( _output_channel = OUTPUT_SCREEN, _upd_props = [] )
{
    // separate entries of indexes from properties to be updated
	var _all = _upd_props['all'] ? 1 : 0 ;
	var _figures_ref = _all ? _glob_figures_array : _upd_props['figures_ref'] ;
    // check input params to be coherent with each obj properties
    var _point_props_tarray = [ 'bordersize', 'bordercolor', 'fillcolor', 'opacity', 'plane', 'enabled' ];
    var _rect_props_array = [ 'bordersize', 'bordercolor', 'fillcolor', 'opacity', 'borderradius', 'plane', 'enabled' ];
    var _line_props_array = [ 'bordersize', 'bordercolor', 'fillcolor', 'opacity', 'mark', 'close', 'plane', 'enabled' ];
    var _circle_props_array = [ 'center', 'radius', 'bordersize', 'bordercolor', 'fillcolor', 'opacity', 'plane', 'enabled' ];
    var _polygon_props_array = [ 'bordersize', 'bordercolor', 'fillcolor', 'opacity', 'borderradius', 'plane', 'enabled' ];
    var _x, _virtual_index, _zerobased_index, _rec_chunk, _prop_array_ref = null ;
    for( var _i = 0 ; _i < _figures_ref.length ; _i++ )
    {
		if ( !_all )
		{
			_virtual_index = _figures_ref[_i] ;
			_zerobased_index = _virtual_index - 1 ;
			_rec_chunk = _glob_figures_array[_zerobased_index] ;
		}
		else { _virtual_index = _i + 1; _rec_chunk = _glob_figures_array[_i] ; }

		_prop_array_ref = null ;
		switch( _rec_chunk['class'] )
		{
            case FIGURE_CLASS_POINT: _prop_array_ref = _point_props_array ; break ;
            case FIGURE_CLASS_RECT: _prop_array_ref = _rect_props_array ; break ;
            case FIGURE_CLASS_CIRCLE: _prop_array_ref = _circle_props_array ; break ;
            case FIGURE_CLASS_LINE: _prop_array_ref = _line_props_array ; break ;
            case FIGURE_CLASS_POLYGON: _prop_array_ref = _polygon_props_array ; break ;
			default: break ;
		}

		if ( is_array( _prop_array_ref ) )
		_prop_array_ref.forEach( function( _prop )
		{
			if ( _rec_chunk[_prop] != null && _upd_props[_prop] != null ) _rec_chunk[_prop] = _upd_props[_prop] ;
		} );
    }
}

function circles_lib_figures_action( _output_channel = OUTPUT_SCREEN, _action = "", _index_array = [], _plane_type = NO_PLANE, _refresh = YES, _param_01 = 0 )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ), _refresh = safe_int( _refresh, YES );
    var _n_input_index = safe_size( _index_array, 0 ), _b_fail = NO, _error_str = "" ;
    if ( _n_input_index > 0 )
    {
        var _n = safe_size( _glob_figures_array, 0 );
        if ( _n > 0 )
        {
            var _myhash, _hash_table = [], _plane = safe_int( _plane_type, NO_PLANE ), _p ;
            for( var _h = 0 ; _h < _index_array.length ; _h++ )
            {
                _p = safe_int( _index_array[_h]-1, 0 );
                if ( _glob_figures_array[ _p ] != null ) _hash_table.push( _glob_figures_array[_p]['myhash'] );
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
                        circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Item @"+(_myhash+1)+" deleted", _param_01 );
                        _x = -1 ;
                        _refresh = YES ;
                        break ;
                        case "disable":
                        case "hide":
                        _glob_figures_array[_x]['enabled'] = NO ;
                        if ( _glob_terminal_echo_flag ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Item @"+(_myhash+1)+" disabled", _param_01 );
                        _refresh = YES ;
                        break ;
                        case "enable":
                        case "show":
                        _glob_figures_array[_x]['enabled'] = YES ;
                        if ( _glob_terminal_echo_flag ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Item @"+(_myhash+1)+" enabled", _param_01 );
                        _refresh = YES ;
                        break ;
                        case "transfer":
                        _glob_figures_array[_x]['plane'] = _plane ;
                        if ( _glob_terminal_echo_flag ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Item @"+(_myhash+1)+" transfered to " + circles_lib_plane_def_get(_plane), _param_01 );
                        _refresh = YES ;
                        break ;
					    default: break ;
                    }
                }
            }

            if ( _action.stricmp( "delete" ) && _glob_figures_array.length > 0 )
            {
                // rebuild hash tags after previous operations
                if ( _glob_terminal_echo_flag ) circles_lib_output( _output_channel, DISPATCH_INFO, "Rebuilding hash tags", _param_01 );
                for( var _i = 0 ; _i < _glob_figures_array.length ; _i++ ) _glob_figures_array[_i]['myhash'] = "rec"+_i;
            }

            if ( _refresh ) circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
        }
        else { _b_fail = YES ; _error_str = "Can't "+_action+": the list of figures is empty" ; }
    }
    else { _b_fail = YES ; _error_str = "Can't "+_action+": missing index to candidate item" ; }

    if ( _refresh ) circles_lib_canvas_afterrender_figures_draw( null, YES, ALL_PLANES );
    return [ _b_fail, _error_str ] ;
}