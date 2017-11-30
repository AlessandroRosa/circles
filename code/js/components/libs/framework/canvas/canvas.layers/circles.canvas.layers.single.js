function circles_lib_canvas_layer_mastertable_resize( _percentage ) { _glob_masterdiv_width_percentage = _percentage; $( "[id$=WORKAREAWIDTHcombo]" ).val( _percentage ); $(window).trigger('resize'); }
function circles_lib_canvas_layer_delete( _plane_type, _index )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    var _layers_array = null, _layers_role_array = null ;
    if ( _plane_type == Z_PLANE )
    {
       _layers_array = _glob_zplane_layers_pile_array ;
       _layers_role_array = _glob_zplane_layers_pile_role_array ;
    }
    else if ( _plane_type == W_PLANE )
    {
       _layers_array = _glob_wplane_layers_pile_array ;
       _layers_role_array = _glob_wplane_layers_pile_role_array ;
    }
    else return CIRCLE_UNDET ;

    if ( _layers_array[ _index ] != null )
    {
       if ( !_layers_array[ _index ].is_defaultcanvas() )
       {
          _layers_array.remove( _index, _index );
          _layers_role_array.remove( _index, _index );
          return YES ;
       }
       else return RET_UNAUTHORIZED ;
    }
    else return NO ;
}

function circles_lib_canvas_layer_update( _plane_type, _pos_index, _field_name, _field_value )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    var _layers_array = null ;
    if ( _plane_type == Z_PLANE ) _layers_array = _glob_zplane_layers_pile_array ;
    else if ( _plane_type == W_PLANE ) _layers_array = _glob_wplane_layers_pile_array ;
    else return CIRCLE_UNDET ;

    var _layer = _layers_array[ _pos_index ] ;
    if ( _layer != null )
    {
       var _ret = false ;
       switch( _field_name.toLowerCase() )
       {
           case "bkcolor":
           var _clr = new String( _field_value );
           if ( circles_lib_colors_is_def( _clr ) || _clr.length == 0 )
           {
               var _canvas = _layers_array[ _pos_index ] ;
               var W = is_html_canvas( _canvas ) ? _canvas.get_width() : 0 ;
               var H = is_html_canvas( _canvas ) ? _canvas.get_height() : 0 ;
               var _context =is_html_canvas( _canvas ) ? _canvas.getContext( _glob_canvas_ctx_2D_mode ) : null ;
               _context.clearRect( 0, 0, W, H );
               _context.fillStyle = _clr.length > 0 ? _clr : "rgba( 255, 255, 255, 0 )" ;
               _context.fillRect( 0, 0, W, H );
               _canvas.set_backgroundcolor( _clr ) ;
               return YES ;
           }
           break ;
           case "opacity": // ranging from 0 to 100
           _field_value = safe_int( _field_value, 100 );
           $("#"+_layer.get_iddiv() ).css( "opacity", _field_value );
           return YES ;
           break ;
           case "visible":
           _field_value = safe_int( $("#" + _layer.get_iddiv() ).val(), NO );
           _field_value = _field_value != NO ? YES : NO ;
           _field_value ? $("#" + _layer.get_iddiv() ).show() : $("#" + _layer.get_iddiv() ).hide();
           _layers_array[ _pos_index ].getContext( _glob_canvas_ctx_2D_mode ).visible = _field_value ;
           return YES ;
           break ;
           default: break ;
       }

       return _ret ;
    }
    else return NO ;
}

function circles_lib_canvas_layer_roledef_get( _canvas_id )
{
	var _canvas = $( "#"+_canvas_id ).get(0) ;
	if ( is_html_canvas( _canvas ) )
	{
		var _ctx = _canvas.getContext( _glob_canvas_ctx_2D_mode ) ;
		return _ctx != null ? _ctx.role_def : "" ;
	}
	else return "" ;
}

function circles_lib_canvas_layer_find( _plane_type = NO_PLANE, _field_search_index, _field_value )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    var _array_scan = _plane_type == Z_PLANE ? _glob_zplane_layers_pile_array : ( _plane_type == W_PLANE ? _glob_wplane_layers_pile_array : null );
    var _array_length = safe_size( _array_scan, 0 ), _ret_layer = null ;
    if ( _array_length > 0 )
    {
       var _candidate_canvas = null ;
       for( var _i = 0 ; _i < _array_length ; _i++ )
       {
          _candidate_context = _array_scan[_i] != null ? _array_scan[_i].getContext( _glob_canvas_ctx_2D_mode ) : null ;
          if ( _candidate_context != null )
          {
             if ( _field_search_index == FIND_LAYER_BY_ROLE_INDEX && _candidate_context.role == _field_value )
             {
                _ret_layer = _array_scan[_i] ;
                break ;
             }
             else if ( _field_search_index == FIND_LAYER_BY_ROLE_DEF && _candidate_context.role_def.stricmp( _field_value ) )
             {
                _ret_layer = _array_scan[_i] ;
                break ;
             }
             else if ( _field_search_index == FIND_LAYER_BY_ROLE_CANVAS_ID && _candidate_context.idcanvas == _field_value )
             {
                _ret_layer = _array_scan[_i] ;
                break ;
             }
          }
       }
    }
    return _ret_layer ;
}

function circles_lib_canvas_layer_find_pos_index( _plane_type, _field_search_index, _field_value )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    // return zero-based index
    var _array_scan = _plane_type == Z_PLANE ? _glob_zplane_layers_pile_array : ( _plane_type == W_PLANE ? _glob_wplane_layers_pile_array : null );
    var _array_length = safe_size( _array_scan, 0 );
    var _ret_index = UNFOUND ;
    if ( _array_length > 0 )
    {
       var _candidate_context = null ;
       for( var _i = 0 ; _i < _array_length ; _i++ )
       {
          _candidate_context = _array_scan[_i] != null ? _array_scan[_i].getContext( _glob_canvas_ctx_2D_mode ) : null ;
          if ( _candidate_context != null )
          {
             if ( _field_search_index == 1 && _candidate_context.role == _field_value )
             {
                _ret_index = _i ;
                break ;
             }
             else if ( _field_search_index == 2 && _candidate_context.role_def.strcmp( _field_value ) )
             {
                _ret_index = _i ;
                break ;
             }
             else if ( _field_search_index == 3 && _candidate_context.idcanvas == _field_value )
             {
                _ret_index = _i ;
                break ;
             }
          }
       }
    }

    return _ret_index ;
}

function circles_lib_canvas_layer_swap( _plane_type, _layer_index1, _layer_index2 )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    var _layers_role_array = null ;
    if ( _plane_type == Z_PLANE ) _layers_role_array = _glob_zplane_layers_pile_role_array ;
    else if ( _plane_type == W_PLANE ) _layers_role_array = _glob_wplane_layers_pile_role_array ;
    else return NO ;

    var _L1 = _layers_role_array[_layer_index1] ;
    _layers_role_array[_layer_index1] = _layers_role_array[_layer_index2] ;
    _layers_role_array[_layer_index2] = _L1 ;
    //swap z-indexes via destructuring assignment
    [ _layers_role_array[_layer_index1].zIndex, _layers_role_array[_layer_index2].zIndex ] = [ _layers_role_array[_layer_index2].zIndex, _layers_role_array[_layer_index1].zIndex ] ;
    return YES ;
}

function circles_lib_canvas_layer_show( _plane_type, _role, _b_show )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE ) ;
    var _canvas = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _role );
    // do not replace with jquery selector
    if ( is_html_canvas( _canvas ) ) $( "#"+_canvas.get_iddiv() ).get(0).style.display = _b_show ? "block" : "none" ;
}

function circles_lib_canvas_layer_init( _base_container_id, _recalc_coords, _div_id, _canvas_id, _visible, _role, bkcolor, _b_clean, _output_channel )
{
	_visible = safe_int( _visible, YES ), _role = safe_float( _role, 0 );
	_b_clean = safe_int( _b_clean, YES ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _div = $( "#"+_div_id ).get(0);
    var base_container = $("#"+_base_container_id ).get(0);
    var _canvas = $("#"+_canvas_id ).get(0);
    if ( _div != null && is_html_canvas( _canvas ) && base_container != null )
    {
        var _pos_chunk = $( "#" + _base_container_id ).offset();
        var LEFT = _visible ? _pos_chunk['left'] : 0 ;
        var TOP = _visible ? _pos_chunk['top'] + getViewportScrollOffset() : 0 ;
        _div.style.left = LEFT + "px", _div.style.top = TOP + "px" ;
        if ( _recalc_coords ) { _div.style.width = _glob_canvas_width + "px", _div.style.height = _glob_canvas_width + "px" ; }
        _canvas.left = LEFT + "px", _canvas.top = TOP + "px" ;
		_div.style.display = _visible ? "block" : "none" ;
        if ( _b_clean )
        {
           if ( _recalc_coords ) { _canvas.set_width( _glob_canvas_width ), _canvas.set_height( _glob_canvas_width ); }
           _canvas.set_visible( _visible ), _canvas.set_role_id( _role ) ;
           circles_lib_canvas_clean( _canvas, bkcolor, _output_channel );
           if ( _canvas.get_type().is_one_of( Z_PLANE ) ) circles_lib_zplane_mapper_init( _glob_canvas_width, DEFAULT_CANVAS_BORDER_SIZE, _recalc_coords );
           else if ( _canvas.get_type().is_one_of( W_PLANE ) ) circles_lib_wplane_mapper_init( _glob_canvas_width, DEFAULT_CANVAS_BORDER_SIZE, _recalc_coords );
		}
    }
}

function circles_lib_canvas_layer_with_max_role_get( _plane_type )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    var _layers_array = circles_lib_canvas_layer_pile_per_plane_get( _plane_type );
    var _L = safe_size( _layers_array, 0 ), _role = 0, _canvas ;
    for( var i = 0 ; i < _L ; i++ )
    {
      _canvas = _layers_array[i] ;
      if ( is_html_canvas( _canvas ) )
      {
        if ( _role == ROLE_NONE || safe_float( _canvas.get_role_id(), ROLE_NONE ) > _role )
        _role = safe_float( _canvas.get_role_id(), ROLE_NONE );
      }
    }
    return _role ;
}

function circles_lib_canvas_layer_with_min_role_get( _plane_type )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    var _layers_array = circles_lib_canvas_layer_pile_per_plane_get( _plane_type );
    var _L = safe_size( _layers_array, 0 ), _role = 0, _canvas ;
    for( var i = 0 ; i < _L ; i++ )
    {
       _canvas = _layers_array[i] ;
       if ( is_html_canvas( _canvas ) )
       {
           if ( _role == ROLE_NONE || safe_float(  _canvas.get_role_id(), ROLE_NONE ) < _role )
           _role = safe_float( _canvas.get_role_id(), ROLE_NONE );
       }
    }

    return _role ;
}

function circles_lib_canvas_layer_bottom_get( _plane_type )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    var _layers_array = circles_lib_canvas_layer_pile_per_plane_get( _plane_type );
    var _L = safe_size( _layers_array, 0 ), _canvas, _div_id, _div, _z_index ;
    var _min = 0, _ret_canvas_id = "", _ret_canvas_role = 0 ;
    for( var i = 0 ; i < _L ; i++ )
    {
        _canvas = _layers_array[i] ;
        if ( is_html_canvas( _canvas ) )
        {
            _z_index = safe_int( $("#"+_canvas.get_iddiv() ).zIndex(), 0 );
            if ( ( _min == 0 || _z_index < _min ) )
            {
               _min = _z_index ;
               _ret_canvas_id = _canvas.get_iddiv() ;
               _ret_canvas_role = _canvas.get_role_id() ;
            }
        }
    }

    return { _id : _ret_canvas_id, _role : _ret_canvas_role, _zindex : _min, idcanvas : _ret_canvas_id } ;
}

function circles_lib_canvas_layer_get_topmost( _plane_type )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    var _layers_array = circles_lib_canvas_layer_pile_per_plane_get( _plane_type );
    var _L = safe_size( _layers_array, 0 ), _layer, _div_id, _div, _z_index ;
    var _max = 0, _ret_div_id = "", _ret_canvas_id = "", _ret_canvas_role = 0 ;
    for( var i = 0 ; i < _L ; i++ )
    {
        _layer = _layers_array[i] ;
        if ( _layer != null )
        {
            _z_index = $("#"+_layer.get_iddiv() ).get(0) != null ? safe_int( $("#"+_layer.get_iddiv() ).zIndex(), 0 ) : 0 ;
            if ( _max == 0 || _z_index > _max )
            {
                _max = _z_index ;
                _ret_div_id = _layer.get_iddiv() ;
                _ret_canvas_role = _layer.get_role_id() ;
                _ret_canvas_id = _layer.get_idcanvas() ;
            }
        }
    }
    return { id : _ret_div_id, _role : _ret_canvas_role, zindex : _max, idcanvas : _ret_canvas_id } ;
}

function circles_lib_canvas_layer_explain_role( _plane_type, _role )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    var _canvas = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _role );
    return is_html_canvas( _canvas ) ? _canvas.get_role_def() : "unfound layer" ;
}

function circles_lib_canvas_layer_refresh( _plane_type, _layer_role_index, _bkcolor, _output_channel )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _sm = null, _layers_pile_ref ;
    if ( _plane_type == Z_PLANE ) { _sm = zplane_sm ; _layers_pile_ref = _glob_zplane_layers_pile_array ; }
    else if ( _plane_type == W_PLANE ) { _sm = wplane_sm ; _layers_pile_ref = _glob_wplane_layers_pile_array ; }

    var _layer_pos_index = circles_lib_canvas_layer_find_pos_index( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _layer_role_index );
    var _layer = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _layer_role_index );
    if ( _layers_pile_ref[ _layer_pos_index ] != null )
    {
        _layers_pile_ref[ _layer_pos_index ].getContext( _glob_canvas_ctx_2D_mode ).backgroundColor = _bkcolor ;
        $( "#" + _layer.get_idcanvas() ).css( {'background-color': _bkcolor } );
        return _plane_type == Z_PLANE ? circles_lib_canvas_render_zplane( null, _sm, [ _layer_role_index ], YES, NO, YES, NO, YES, YES, _output_channel ) : circles_lib_canvas_render_wplane( null, _sm, [ _layer_role_index ], YES, YES, YES, YES, NO, YES, _output_channel );
    }
    else return [ RET_ERROR, "missing plane ref" ] ;
}

function circles_lib_canvas_layer_set_opacity( _plane_type, _role, _opacity )
{
    _plane_type = safe_int( circles_lib_return_plane_type( _plane_type, NO ), Z_PLANE );
    var _layer = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _role );
    if ( _layer != null )
    {
        var _div_id = _layer.get_iddiv(), _canvas_id = _layer.get_idcanvas() ;
        var _edit_id = ( _plane_type == Z_PLANE ? "Z_PLANE" : "W_PLANE" ) + "layer" + _layer.get_role_def().toUpperCase() + "opacity" ;
        set_opacity( _div_id, _opacity );
        $("#"+_edit_id ).val( _opacity );
    }
}

function circles_lib_canvas_layer_copy( _src_canvas_id, _copy_canvas_id, _limit_width, _limit_height )
{
    _limit_width = safe_int( _limit_width, UNDET ), _limit_height = safe_int( _limit_height, UNDET );
    var _src_canvas = $("#"+_src_canvas_id ).get(0);
    var _copy_canvas = $("#"+_copy_canvas_id ).get(0);
    if ( _src_canvas_id != null && is_html_canvas( _copy_canvas ) )
    {
       var _src_width = _src_canvas.get_width(), _src_height = _src_canvas.get_height();
       var _src_canvas_ratio = _src_width / _src_height ;
       var _new_width = 0, _new_height = 0 ;
       if ( _src_canvas_ratio > 1 )
       {
          _new_width = _copy_canvas.get_width();
          _new_height = _new_width / _src_canvas_ratio ;
          _new_height = safe_int( _new_height, 0 );
          _new_height = Math.max( 0, _new_height );
          if ( _limit_height != UNDET ) _limit_height = Math.min( _limit_height, _new_height );
       }
       else
       {
          _new_height = _copy_canvas.get_height();
          _new_width = _new_height * _src_canvas_ratio ;
          _new_width = safe_int( _new_width, 0 );
          _new_width = Math.max( 0, _new_width );
          if ( _limit_width != UNDET ) _limit_width = Math.min( _limit_width, _new_width );
       }

       _copy_canvas.set_width( _new_width ), _copy_canvas.set_height( _new_height );

       var _src_ctx = _src_canvas.getContext( _glob_canvas_ctx_2D_mode );
       var _copy_bip_ctx = _copy_canvas.getContext( _glob_canvas_ctx_2D_mode );
       var _wplane_data = _src_ctx != null ? _src_ctx.getImageData( 0, 0, _src_width, _src_height ) : null ;
       if ( _wplane_data != null )
       {
          _copy_bip_ctx.drawImage( _src_canvas, 0, 0, _new_width, _new_height );
          return [ RET_OK, "Display went ok" ];
       }
       else return [ RET_ERROR, "Error: memory failure" ];
    }
    else return [ RET_ERROR, "Component missing: memory failure" ];
}