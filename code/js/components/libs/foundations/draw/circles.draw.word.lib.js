function circles_lib_draw_orbit_from_word( _context, _mapper, _items_array,
																					 _clean, _x, _y,
																					 _input_word, _mark_points, _connect,
																					 _return_orbit, _drawcolor, _fillcolor,
																					 _plot_index, _silent, _drawentity, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } )
    if ( !_test ) return [ RET_ERROR, "Missing items entry", null ] ;

    _clean = safe_int( _clean, YES );
    _input_word = safe_string( _input_word.trim(), "" ), _mark_points = safe_int( _mark_points, NO );
    _return_orbit = safe_int( _return_orbit, YES ), _plot_index = safe_int( _plot_index, NO );
    _silent = safe_int( _silent, YES ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _glob_persistent_vars['orbit_array'] = [], _glob_persistent_vars['sd_n'] = circles_lib_count_seeds();
    _glob_persistent_vars['word_len'] = safe_size( _input_word, 0 );
    if ( is_string( _drawentity ) )
    {
        switch( _drawentity.toLowerCase() )
        {
           case "inversion": _drawentity = DRAWENTITY_INVERSION_CIRCLE; break ;
           case "isometric": _drawentity = DRAWENTITY_ISOMETRIC_CIRCLE; break ;
           case "point": default: _drawentity = DRAWENTITY_POINT; break ;
        }
    }

    _drawentity = safe_int( _drawentity, DRAWENTITY_POINT );
    if ( _glob_persistent_vars['sd_n'] == 0 )
    {
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _ERR_33_01, _glob_app );
        return [ RET_ERROR, _ERR_33_01, null ];
    }
    else if ( _glob_persistent_vars['word_len'] > 0 )
    {
        switch( _drawentity )
        {
           case DRAWENTITY_POINT:
           return circles_lib_draw_word_pointwise( _context, _mapper, _items_array, _clean, _input_word, _x, _y, _mark_points, _connect, _return_orbit, _drawcolor, _fillcolor, _plot_index, _silent, _out_channel );
           break ;
           case DRAWENTITY_ISOMETRIC_CIRCLE:
           return circles_lib_draw_word_circlewise( _context, _mapper, _items_array, _clean, _input_word, _return_orbit, _silent, _out_channel );
           break ;
           case DRAWENTITY_INVERSION_CIRCLE:
           return circles_lib_draw_word_inversion( _context, _mapper, _items_array, _clean, _input_word, _return_orbit, _silent, _out_channel ) ;
           break ;
           default: return [ RET_ERROR, "Missing draw entity specification" ]; break ;
        }
    }
    else
    {
        var _msg = "Can't draw the orbit: please type a word" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app );
        return [ RET_ERROR, _msg, null ] ;
    }
}

function circles_lib_draw_word_circlewise( _context, _mapper, _items_array, _clean, _input_word, _return_orbit, _silent, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } )
    if ( !_test ) return [ RET_ERROR, "Missing items entry", null ] ;

    _clean = safe_int( _clean, NO ), _input_word = safe_string( _input_word, "" ).trim();
    _return_orbit = safe_int( _return_orbit, YES );
    _silent = safe_int( _silent, YES ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _glob_symbols_index_array = circles_lib_symbol_get_indexes_mapping_array( null,  NO, _out_channel );
    var _cc = null, _b_check_word = circles_lib_word_check( _input_word, _glob_alphabet );
    if ( !is_array( _glob_symbols_index_array ) )
    {
        var _MSG = "Can't draw words: no seeds - letter association." + _glob_crlf ;
        if ( circles_lib_count_alphabet() == 0 )
        _MSG += _glob_crlf + "* Missing alphabet: no letters have been registered yet" ;
        if ( circles_lib_count_seeds() == 0 )
        _MSG += _glob_crlf + "* Missing input seeds: no Mobius map have been registered yet" ;
        
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _MSG, _glob_app );
        return [ RET_ERROR, _MSG, null ] ;
    }
    else if ( _b_check_word == NO )
    {
        var _MSG = "The input word does not match the current alphabet" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _MSG, _glob_app );
        return [ RET_ERROR, _MSG, null ] ;
    }
    else if ( _b_check_word.is_one_of( UNDET, CIRCLES_MISSING_INPUT ) )
    {
        var _MSG = "Word check failure: missing word or alphabet" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _MSG, _glob_app );
        return [ RET_ERROR, _MSG, null ] ;
    }
    else if ( _b_check_word == YES && is_html_canvas( _context.canvas ) && _mapper != null )
    {
        _glob_persistent_vars['orbit_array'] = [] ;
        _glob_persistent_vars['word'] = _input_word.length > 0 ? _input_word.charAt(0) : "" ;
        // create one associative array to keep the symbol-index connection
        // and consult it later, by inputting the symbol as the key to the array element
        if ( _clean ) circles_lib_canvas_clean( _context.canvas );
        var INDEX = circles_lib_find_item_index_by_symbol( _items_array, _glob_persistent_vars['word'] ) ;
        var ITEM = INDEX >= 0 ? _items_array[INDEX] : null ;
        var complex_circle = is_item_obj( ITEM ) ? ITEM.complex_circle : null ;
        var linewidth = _context.get_canvas().get_type().is_one_of( Z_PLANE, W_PLANE ) ? _glob_pixel_size : _glob_bip_pixel_size ;
        var fill = is_circle( complex_circle ) ? complex_circle.fill : NO ;
        var draw = is_circle( complex_circle ) ? complex_circle.draw : NO ;
        var drawcolor = is_circle( complex_circle ) ? complex_circle.drawcolor : "" ;
        var fillcolor = is_circle( complex_circle ) ? complex_circle.fillcolor : "" ;
        var depth = safe_int( _glob_depth, 1 );
        var RGBstart = _glob_orbit_rgb_start, RGBend = _glob_orbit_rgb_end ;
        var ORBITcolorsGRADIENT = _glob_orbit_palette_array ;
        if ( !is_array( ORBITcolorsGRADIENT ) )
        {
            var _ret_chunk = circles_lib_colors_compute_gradient( RGBstart, RGBend, depth, _silent, _out_channel );
            ORBITcolorsGRADIENT = _ret_chunk[1] ;
        }
        var _w_length = safe_size( _input_word, 0 ), subword, INDEX, _mm, FILLCLR, _screen_circle ;
        for( var w = 0 ; w < _w_length ; w++ )
        {
            _glob_persistent_vars['word'] = _input_word.charAt(w);
            subword = _input_word.substr( 0, w + 1 );
            INDEX = _glob_symbols_index_array[_glob_persistent_vars['word']] ;
            _mm = _items_array[INDEX].map ;
            _cc = w == 0 ? _items_array[INDEX].complex_circle : _mm.map_circle( _cc );
            if ( _return_orbit ) _glob_persistent_vars['orbit_array'].push( _cc.center );
            FILLCLR = w < ORBITcolorsGRADIENT.length ? ORBITcolorsGRADIENT[w] : ORBITcolorsGRADIENT[ORBITcolorsGRADIENT.length-1] ;
            _screen_circle = circles_lib_draw_complex_disk( _context, _mapper,
			                                                      _cc.center.x, _cc.center.y, _cc.radius,
			                                                      1, FILLCLR, 1, "", 2 * linewidth, _glob_opacity, null, null, _input_word, 0 );
            if ( _glob_symbols_display_wplane )
            {
               _context.font = DEFAULT_FONT_SIZE + " " + DEFAULT_FONT_FAMILY ;
               _context.fillStyle = "" ;
               _context.fillText( subword, _screen_circle.center.x - 10, _screen_circle.center.y + 16 );
            }
        }

        return [ RET_OK, "Word drawn circlewise", _glob_persistent_vars['orbit_array'] ];
    }
    else
    {
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ERR_26_00, _glob_app );
        return [ RET_ERROR, _ERR_26_00, null ];
    }
}

function circles_lib_draw_word_pointwise( _context, _mapper, _items_array, _clean, _input_word, _start_x, _start_y, _mark_points, _connect, _return_orbit, _drawcolor, _fillcolor, _plot_index, _silent, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } )
    if ( !_test ) return [ RET_ERROR, "Missing items entry", null ] ;

    _clean = safe_int( _clean, YES );
    _connect = safe_int( _connect, YES ), _input_word = safe_string( _input_word, "" ).trim();
    _return_orbit = safe_int( _return_orbit, YES ), _plot_index = safe_int( _plot_index, NO );
    _silent = safe_int( _silent, YES ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _glob_persistent_vars['orbit_array'] = [] ;
    _glob_symbols_index_array = circles_lib_symbol_get_indexes_mapping_array( null,  NO, _out_channel );
    var _cc = null, _b_check_word = circles_lib_word_check( _input_word, _glob_alphabet ) ;
    if ( !is_array( _glob_symbols_index_array ) )
    {
        var _MSG = "Can't draw words: no seeds - letter association." + _glob_crlf ;
        if ( circles_lib_count_alphabet() == 0 )
        _MSG += _glob_crlf + "* Missing alphabet: no letters have been registered yet" ;
        if ( circles_lib_count_seeds() == 0 )
        _MSG += _glob_crlf + "* Missing input seeds: no Mobius map have been registered yet" ;
        
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _MSG, _glob_app );
        return [ RET_ERROR, _MSG, null ] ;
    }
    else if ( _b_check_word == NO && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "The input word does not match the current alphabet.", _glob_app );
    else if ( _b_check_word.is_one_of( UNDET, CIRCLES_MISSING_INPUT ) && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Word check failure: missing input word or alphabet.", _glob_app );
    else
    {
        if ( _clean ) circles_lib_canvas_clean( _context.canvas );
        // create one associative array to keep the symbol-index connection
        // and consult it later, by inputting the symbol as the key to the array element
        var INDEX, _w_length = safe_size( _input_word, 0 );
        var _input_pt = new complex( _start_x, _start_y );
        var _next_pt = null, POINTSarray = [], _mm, SCREEN_PT ;
        if ( _return_orbit ) _glob_persistent_vars['orbit_array'].push( new point( _input_pt.real, _input_pt.imag ) );
        var _shift_x = _mapper.get_coords_rect().width() / ( _mapper.get_display_rect().width() - 80 );
        var _shift_y = _mapper.get_coords_rect().height() / ( _mapper.get_display_rect().height() - 80 );
        POINTSarray.push( new point( _input_pt.real, _input_pt.imag ) );
        for( _glob_persistent_vars['word_len'] = 0 ; _glob_persistent_vars['word_len'] < _w_length ; _glob_persistent_vars['word_len']++ )
        {
           _glob_persistent_vars['word'] = _input_word[_glob_persistent_vars['word_len']], subword = _input_word.substr( 0, _glob_persistent_vars['word_len'] + 1 );
           INDEX = _glob_symbols_index_array[_glob_persistent_vars['word']] ;
           _mm = _items_array[INDEX].map ;
           _next_pt = is_mobius_map( _mm ) ? _mm.compute( _input_pt ) : null ;
           if ( is_complex( _next_pt ) ) POINTSarray.push( new point( _next_pt.real, _next_pt.imag ) );
           _input_pt = _next_pt ;
        }

        for( _glob_persistent_vars['word_len'] = 0 ; _glob_persistent_vars['word_len'] < POINTSarray.length ; _glob_persistent_vars['word_len']++ )
        {
           _input_pt = POINTSarray[_glob_persistent_vars['word_len']] ;
           if ( _mark_points ) circles_lib_draw_point( _context, _mapper, _input_pt.x, _input_pt.y, YES, _drawcolor, YES, _fillcolor, _glob_pt_border, _glob_pt_radius );
           if ( _plot_index ) circles_lib_draw_text( _context, _mapper, _input_pt.x - _shift_x, _input_pt.y + _shift_y, "#" + ( _glob_persistent_vars['word_len'] + 1 ), DEFAULT_ORBIT_TEXT_COLOR, "" );
           if ( _return_orbit ) _glob_persistent_vars['orbit_array'].push( new point( _input_pt.x, _input_pt.y ) );
        }
           
        if ( _connect ) circles_lib_draw_polyline( _context, _mapper, POINTSarray, _drawcolor, "", 1, NO, DEFAULT_MAX_OPACITY, UNDET, 0, YES );
        return [ RET_OK, "Orbit plot for word '"+_input_word+"'", _glob_persistent_vars['orbit_array'] ];
    }
}

function circles_lib_draw_word_inversion( _context, _mapper, _items_array, _clean, _input_word, _return_orbit, _silent, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } )
    if ( !_test ) return [ RET_ERROR, "Missing items entry", null ] ;

    _clean = safe_int( _clean, YES );
    _input_word = safe_string( _input_word, "" ).trim(), _return_orbit = safe_int( _return_orbit, NO );
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _glob_symbols_index_array = circles_lib_symbol_get_indexes_mapping_array( null,  NO, _out_channel );
    var _cc = null, _b_check_word = circles_lib_word_check( _input_word, _glob_alphabet );
    if ( !is_array( _glob_symbols_index_array ) )
    {
        var _MSG = "Can't draw words: no seeds - letter association." + _glob_crlf ;
        if ( circles_lib_count_alphabet() == 0 )
        _MSG += _glob_crlf + "* Missing alphabet: no letters have been registered yet" ;
        if ( circles_lib_count_seeds() == 0 )
        _MSG += _glob_crlf + "* Missing input seeds: no Mobius map have been registered yet" ;
        
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _MSG, _glob_app );
        return [ RET_ERROR, _MSG, null ] ;
    }
    else if ( _b_check_word == NO )
    {
        var _MSG = "The input word does not match the current alphabet" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _MSG, _glob_app );
        return [ RET_ERROR, _MSG, null ] ;
    }
    else if ( _b_check_word.is_one_of( UNDET, CIRCLES_MISSING_INPUT ) )
    {
        var _MSG = "Word check failure: missing word or alphabet" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _MSG, _glob_app );
        return [ RET_ERROR, _MSG, null ] ;
    }
    else if ( _b_check_word == YES && is_html_canvas( _context.canvas ) && _mapper != null )
    {
        if ( _clean ) circles_lib_canvas_clean( _context.canvas );
        // create one associative array to keep the symbol-index connection
        // and consult it later, by inputting the symbol as the key to the array element
        _glob_symbols_index_array = circles_lib_symbol_get_indexes_mapping_array( null,  NO, _out_channel );
        _glob_persistent_vars['word'] = _input_word.charAt(0);
        var linewidth = _items_array[INDEX]._cc.linewidth ;
        var fill = _items_array[INDEX]._cc.fill ;
        var draw = _items_array[INDEX]._cc.draw ;
        var drawcolor = _items_array[INDEX]._cc.drawcolor ;
        var fillcolor = _items_array[INDEX]._cc.fillcolor ;
        var depth = safe_int( _glob_depth, 1 );
        var RGBstart = _glob_orbit_rgb_start, RGBend = _glob_orbit_rgb_end ;
        var ORBITcolorsGRADIENT = _glob_orbit_palette_array ;
        if ( !is_array( ORBITcolorsGRADIENT ) )
        {
            var _ret_chunk = circles_lib_colors_compute_gradient( RGBstart, RGBend, depth, _silent, _out_channel );
            ORBITcolorsGRADIENT = _ret_chunk[1] ;
        }
        var _w_length = _input_word.length, subword, INDEX, FILLCLR, _screen_circle, INDEX ;
        for( var w = 0 ; w < _w_length ; w++ )
        {
            _glob_persistent_vars['word'] = _input_word.charAt(w);
            subword = _input_word.substr( 0, w + 1 );
            INDEX = _glob_symbols_index_array[_glob_persistent_vars['word']] ;
            _cc = w == 0 ? _items_array[INDEX].complex_circle : _items_array[INDEX].map.invert_circle( _cc );
            if ( _return_orbit ) _glob_persistent_vars['orbit_array'].push( _cc.center );
            FILLCLR = w < ORBITcolorsGRADIENT.length ? ORBITcolorsGRADIENT[w] : ORBITcolorsGRADIENT[ORBITcolorsGRADIENT.length-1] ;
            _screen_circle = circles_lib_draw_complex_disk( _context, _mapper,
			                                                      _cc.center.x, _cc.center.y, _cc.radius,
			                                                      1, FILLCLR, 1, "", 2, _glob_opacity, null, null, _input_word, 0 );
            if ( _glob_symbols_display_wplane )
            {
               _context.font = DEFAULT_FONT_SIZE + " " + DEFAULT_FONT_FAMILY ;
               _context.fillStyle = DEFAULT_COLOR_STD ;
               _context.fillText( subword, _screen_circle.center.x - 10, _screen_circle.center.y + 16 );
            }
        }
                
        return [ RET_OK, "Word / Orbit tracked and drawn", _glob_persistent_vars['orbit_array'] ];
    }
    else
    {
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ERR_26_00, _glob_app );
        return [ RET_ERROR, _ERR_26_00, null ];     
    }
}