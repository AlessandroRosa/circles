function circles_lib_draw_all_screen_disks( _context, _mapper, _selected_items_array, _clean, _silent, _out_channel )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _silent = safe_int( _silent, YES ), _clean = safe_int( _clean, YES );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    if ( safe_size( _selected_items_array, 0 ) == 0 ) _selected_items_array = [];
    var _items_n = circles_lib_count_items( _items_array );
    if ( !is_html_context( _context ) ) return [ RET_ERROR, "Insufficient or invalid graphic resources" ] ;
    else if ( _items_n > 0 )
    {
        var _canvas = _context.canvas ;
        if ( _clean ) circles_lib_canvas_clean( _canvas, "transparent", _out_channel );
        if ( _glob_export_format == EXPORT_SVG ) _svg_comment( _glob_export_code_array, "Drawing the disks" );
      	var ITEM, complex_circle, screen_circle, fill, fillcolor, draw, drawcolor, linewidth, bFOUND ;
				var _opacity = DEFAULT_MAX_OPACITY ;
            _canvas = circles_lib_canvas_layer_find( _canvas.get_type(), FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
        var _pixel_size = _canvas.get_type().is_one_of( Z_PLANE, W_PLANE ) ? _glob_pixel_size : _glob_bip_pixel_size ;
        var _bip_area = _glob_bip_canvas.get_width() * _glob_bip_canvas.get_height();
				var _errors = 0, _errors_array = [] ;
        var _plane_type = _canvas.get_type() ;
				switch( _plane_type )
				{
						case Z_PLANE: case W_PLANE: _opacity = $("#"+_canvas.get_iddiv() ).css( "opacity" ); break ;
						case BIP_BOX: _opacity = _glob_bip_opacity ; break ;
						default:
						_opacity = DEFAULT_MAX_OPACITY ;
            _pixel_size = _glob_pixel_size ;
						break ;
		    }

        for( var i = 0 ; i < _items_n ; i++ )
        {
           ITEM = _items_array[ i ] ;
           if ( !is_item_obj( ITEM ) )
           {
              _errors++ ;
              _errors_array.push( _i );
				 			break ;
					 }
					 else
					 {
              screen_circle = ITEM.screen_circle ;
              complex_circle = ITEM.complex_circle ;
		          draw = ITEM.complex_circle.draw ;
		          drawcolor = ITEM.complex_circle.drawcolor ;
		          fill = ITEM.complex_circle.fill ;
		          fillcolor = ITEM.complex_circle.fillcolor ;
		          linewidth = _pixel_size ;
		          bFOUND = ( i == _glob_disk_sel_index || _selected_items_array.includes( ""+i ) ) ? YES : NO ;
		          if ( bFOUND ) linewidth = 3 * _pixel_size, drawcolor = DEFAULT_SELECTED_ITEM_COLOR ;
					 }
               
           if ( is_circle( screen_circle ) ) circles_lib_draw_screen_disk( _context, "", screen_circle, draw, drawcolor, fill, fillcolor, linewidth, _opacity );
        }

     	  var _msg = _errors == 0 ? "All disks drawn with success" : "Can't draw all screen disks: memory failure for item"+(_errors_array.length==1?"":"s")+" indexed at "+_errors_array.join( ", " );
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, _errors == 0 ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, _glob_app );
        return [ _errors == 0 ? RET_OK : RET_ERROR, _msg ] ;
    }
    else if ( _items_n == 0 )
    {
       var _ret_chunk = [] ;
       if ( _canvas.get_type() == Z_PLANE )
       return _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, _out_channel );
       else if ( _canvas.get_type() == W_PLANE )
       return _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, null, YES, YES, YES, YES, NO, YES, _out_channel );
    }
}

function circles_lib_draw_all_complex_disks( _context, _mapper, _selected_items_array, _init, _silent, _out_channel )
{
    _init = safe_int( _init, YES ), _silent = safe_int( _silent, YES );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    if ( safe_size( _selected_items_array, 0 ) == 0 ) _selected_items_array = [];
    var _canvas = _context != null ? _context.canvas : null ;
    if ( _init ) circles_lib_items_switch_to( _glob_items_switch, YES, _out_channel );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array );
    if ( _items_n > 0 && _context != null )
    {
     		var ITEM, complex_circle = new circle(), fill, fillcolor, draw, drawcolor, linewidth, bFOUND ;
				var _opacity = DEFAULT_OPACITY ;
        if ( _canvas.get_type().is_one_of( Z_PLANE, W_PLANE ) ) _canvas = circles_lib_canvas_layer_find( _canvas.get_type(), FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
        var _pixel_size = _canvas.get_type().is_one_of( Z_PLANE, W_PLANE ) ? _glob_pixel_size : _glob_bip_pixel_size ;
        var _bip_area = _glob_bip_canvas.get_width() * _glob_bip_canvas.get_height();
        var _plane_type = _canvas.get_type() ;
				switch( _plane_type )
				{
 						case Z_PLANE: case W_PLANE: _opacity = $("#"+_canvas.get_iddiv() ).css( "opacity" ); break ;
						case BIP_BOX: _opacity = _glob_bip_opacity ; break ;
						default: _opacity = _glob_opacity ; break ;
				}
          
        if ( _glob_export_format == EXPORT_SVG ) _svg_comment( _glob_export_code_array, "Drawing the complex disks over the "+circles_lib_plane_get_def( _canvas.get_type() ) );
        for( var _i = 0 ; _i < _items_n ; _i++ )
        {
            ITEM = _items_array[_i] ;
            if ( !is_item_obj( ITEM ) ) continue ;

            draw = ITEM.complex_circle.draw ;
            drawcolor = ITEM.complex_circle.drawcolor ;
            fill = ITEM.complex_circle.fill ;
            fillcolor = ITEM.complex_circle.fillcolor ;
            linewidth = safe_int( ITEM.complex_circle.linewidth, 1 );
            bFOUND = _selected_items_array.includes( _i ) ? YES : NO ;
            if ( bFOUND )
            {
                linewidth = 3 * _pixel_size, drawcolor = DEFAULT_SELECTED_ITEM_COLOR ;
            }

            if ( is_circle( ITEM.complex_circle ) && is_point( ITEM.complex_circle.center ) )
            {
               _items_array[ _i ].screen_circle = circles_lib_draw_complex_disk( _context, _mapper,
																								                                 ITEM.complex_circle.center.x, ITEM.complex_circle.center.y,
																																								 ITEM.complex_circle.radius,
                                   																							 draw, drawcolor, fill, fillcolor,
																																								 linewidth, _opacity, null, null, "", 0 );
            }
        }
          
        _glob_disk_sel_index = safe_size( _selected_items_array, 0 ) == 0 ? UNDET : _selected_items_array[0] ;
        var _msg = "Disks drawn with success" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app );
        return [ RET_OK, _msg ] ;
    }
    else if ( _items_n == 0 ) return [ RET_ERROR, "Missing input items" ] ;
    else if ( _context == null ) return [ RET_ERROR, "Missing canvas component for drawing" ] ;
}

function circles_lib_recalc_screen_disks_coords( _mapper )
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    if ( !is_screen_mapper( _mapper ) ) _mapper = null ;
    if ( is_screen_mapper( _mapper ) )
    {
       var _items_n = circles_lib_count_items(), complex_circle, screen_center_pt, screen_radius_pt, screen_radius, screen_circle ;
       for( var _i = 0 ; _i < _items_n ; _i++ )
       {
          complex_circle = _items_array[ _i ] != null ? _items_array[ _i ].complex_circle : null ;
          if ( is_circle( complex_circle ) && is_point( complex_circle.center ) )
          {
             _items_array[ _i ].complex_circle = complex_circle.copy() ;
             screen_center_pt = _mapper.from_cartesian_to_client( complex_circle.center.x, complex_circle.center.y );
             screen_radius_pt = _mapper.from_cartesian_to_client( complex_circle.center.x + complex_circle.radius, complex_circle.center.y );
             screen_radius = Math.abs( screen_center_pt.x - screen_radius_pt.x );
             screen_circle = new circle( screen_center_pt, screen_radius, complex_circle.draw, complex_circle.fill, complex_circle.drawcolor, complex_circle.fillcolor, complex_circle.linewidth, complex_circle.notes );
             _items_array[_i].screen_circle = screen_circle ;
          }
       }
       return YES ;
    }
    else return NO ;
}

function circles_lib_complex_to_screen_disk( _complex_circle, _mapper, _drawcolor )
{
    if ( !is_screen_mapper( _mapper ) ) _mapper = null ;
    if ( is_screen_mapper( _mapper ) )
    {
       _drawcolor = safe_string( _drawcolor, "" );
       var screen_center_pt, screen_radius_pt, screen_radius, screen_circle ;
           screen_center_pt = _mapper.from_cartesian_to_client( _complex_circle.center.x, _complex_circle.center.y );
           screen_radius_pt = _mapper.from_cartesian_to_client( _complex_circle.center.x + _complex_circle.radius, _complex_circle.center.y );
           screen_radius = Math.abs( screen_center_pt.x - screen_radius_pt.x );
           screen_circle = new circle( screen_center_pt, screen_radius, _complex_circle.draw, _complex_circle.fill, _drawcolor, _complex_circle.fillcolor, _complex_circle.linewidth, _complex_circle.notes );
       return screen_circle ;
    }
    else return null ;
}

function circles_lib_pickup_disk_index_from_complex_pt( pt )
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var retINDEX = UNFOUND, minDISTANCE = 0, _items_n = circles_lib_count_items(), CANDIDATEcircle, distSQUARED ;
    for( var _i = 0 ; _i < _items_n ; _i++ )
    {
       CANDIDATEcircle = _items_array[ _i ].screen_circle ;
       distSQUARED = Math.pow( pt.x - CANDIDATEcircle.center.x, 2 ) + Math.pow( pt.y - CANDIDATEcircle.center.y, 2 );
       distance = Math.ceil( Math.sqrt( distSQUARED ) );
       if ( distance > 0 && CANDIDATEcircle.radius > 0 && distance <= CANDIDATEcircle.radius )
       {
          if ( minDISTANCE == 0 || distance < minDISTANCE )
          {
             minDISTANCE = distance ;
             retINDEX = i ;
          }
       }
    }
      
    return retINDEX ;
}