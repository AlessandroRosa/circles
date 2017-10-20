function circles_lib_config_create_new_main( _question, _silent, _reset, _drop_additional_figures, _clean, _output_channel )
{
		_question = safe_int( _question, NO ), _silent = safe_int( _silent, NO );
    _reset = safe_int( _reset, ~RESET_NONE ), _clean = safe_int( _clean, YES );
		_drop_additional_figures = safe_int( _drop_additional_figures, NO );
    var _items_n = circles_lib_count_items();
    var _b_go = ( _question || _items_n == 0 ) ? YES : ( confirm( _QUESTION_27 ) ? YES : NO );
    return _b_go ? circles_lib_config_create_new_proc( _reset, _drop_additional_figures, _clean, _question, _silent, _output_channel ) : ( _items == 0 ? [ YES, "cmd skipped: no registered config" ] : [ NO, "Fail to set a new config" ] ) ;
}

function circles_lib_config_create_new_proc( _reset_mask, _drop_additional_figures, _clean, _question, _silent, _output_channel )
{
    _drop_additional_figures = safe_int( _drop_additional_figures, NO );
    _reset_mask = safe_int( _reset_mask, RESET_NONE ), _clean = safe_int( _clean, YES );
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    var _reset_filter = "", _final_ret = YES, _ret_chunk_zplane, _ret_chunk_wplane ;
    var _items_n = circles_lib_count_items();

    circles_lib_reset_coords();
    var _ret_chunk = circles_lib_reset_vars( _reset_mask, _silent, _output_channel );
    if ( is_array( _ret_chunk ) ) _reset_filter = _ret_chunk[1] ;
	  circles_lib_depth_set( _glob_depth, YES );

    if ( _clean && _items_n > 0 )
    {
		    _ret_chunk_zplane = circles_lib_coordinates_reset_core( Z_PLANE, YES, _question, _silent, _output_channel );
        _ret_chunk_zplane = circles_lib_canvas_render_zplane( null, zplane_sm, null, _clean, YES, NO, _question, _silent, YES, _output_channel );
        _ret_chunk_wplane = circles_lib_canvas_render_wplane( null, wplane_sm, null, _clean, YES, NO, YES, _question, _silent, _output_channel );
		    _ret_chunk_wplane = circles_lib_coordinates_reset_core( W_PLANE, YES, _question, _silent, _output_channel );
		    if ( _ret_chunk_zplane[0] != RET_IRRELEVANT )
		    _final_ret &= _ret_chunk_zplane != null ? _ret_chunk_zplane[0] : 0 ;
		    if ( _ret_chunk_wplane[0] != RET_IRRELEVANT )
		    _final_ret &= _ret_chunk_wplane != null ? _ret_chunk_wplane[0] : 0 ;
    }
    else _final_ret = 1 ;
    circles_lib_plugin_dispatcher_multicast_message( POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL );

    if ( _drop_additional_figures ) _glob_figures_array.flush();
    return [ _final_ret, _final_ret ? "New config set up with success " + ( !_silent && _reset_filter.length > 0 ? "('"+_reset_filter+"')" : "" ) : "Fail to set a new config" ] ;
}

function circles_lib_config_list_generate()
{
    var _keywords = [ 'accuracy', 'canvasmode', 'circle', 'construction', 'crashstrings',
                      'diskvisibilityradius', 'diskthresholdradius', 'diskthresholdoperator',
                      'depth', 'diskdash', 'diskdraw', 'diskfill',
                      'drawentity', 'gens', 'init', 'interface', 'items', 'mapprecision', 'menu', 'method',
                      'os', 'orbit_palette_start', 'orbit_palette_end',
                      'pixelsize', 'palette_start', 'palette_end',
                      'save', 'title', 'usepalette', 'warnings' ] ;
    var _config_array = [];
    for( var _i = 0 ; _i < _keywords.length ; _i++ )
    {
        switch( _keywords[_i] )
        {
            case "accuracy":
            _config_array.push( _keywords[_i] + "=" + _glob_accuracy );
            break ;
            case "canvasmode":
            _config_array.push( _keywords[_i] + "=" + _glob_src_canvas_mode );
            break ;
            case "construction":
            _config_array.push( _keywords[_i] + "=" + _glob_construction_mode );
            break ;
            case "crashstrings":
            var _crash_words = _glob_dict_processor.get_crash_words().join( "," );
            _config_array.push( _keywords[_i] + "=" + _crash_words );
            break ;
            case "depth":
            _config_array.push( _keywords[_i] + "=" + _glob_depth );
            break ;
            case "diskdraw":
            _config_array.push( _keywords[_i]+"zplane" + "=" + ( _glob_zplane_disk_draw ? YES : NO ) );
            _config_array.push( _keywords[_i]+"wplane" + "=" + ( _glob_wplane_disk_draw ? YES : NO ) );
            break ;
            case "diskdash":
            _config_array.push( _keywords[_i] + "=" + ( _glob_activate_dashed_border ? YES : NO ) );
            break ;
            case "diskfill":
            _config_array.push( _keywords[_i] + "=" + ( _glob_wplane_disk_fill ? YES : NO ) );
            break ;
            case "diskvisibilityradius":
            _config_array.push( _keywords[_i] + "=" + _glob_disk_visibility_radius );
            break ;
            case "diskthresholdradius":
            _config_array.push( _keywords[_i] + "=" + _glob_disk_threshold_radius );
            break ;
            case "diskthresholdoperator":
            _config_array.push( _keywords[_i] + "=" + _glob_disk_threshold_operator );
            break ;
            case "distancetolerance":
            _config_array.push( _keywords[_i] + "=" + _glob_distance_tolerance );
            break ;
            case "drawentity":
            _config_array.push( _keywords[_i] + "=" + _glob_drawentity );
            break ;
            case "interface":
            _config_array.push( _keywords[_i] + "=" + _glob_interface_index );
            break ;
            case "mapprecision":
            _config_array.push( _keywords[_i] + "=" + _glob_smpr );
            break ;
            case "method":
            _config_array.push( _keywords[_i] + "=" + _glob_method );
            break ;
            case "orbit_palette_start":
            _config_array.push( _keywords[_i] + "=" + _glob_orbit_rgb_start );
            break ;
            case "orbit_palette_end":
            _config_array.push( _keywords[_i] + "=" + _glob_orbit_rgb_end );
            break ;
            case "palette_start":
            _config_array.push( _keywords[_i] + "=" + _glob_palette_start_rgb );
            break ;
            case "palette_end":
            _config_array.push( _keywords[_i] + "=" + _glob_palette_end_rgb );
            break ;
            case "pixelsize":
            _config_array.push( _keywords[_i] + "=" + _glob_pixel_size );
            break ;
            case "title":
            _config_array.push( _keywords[_i] + "=" + _glob_title );
            break ;
            case "usepalette":
            _config_array.push( _keywords[_i] + "=" + _glob_palette_use );
            break ;
            case "warnings":
            _config_array.push( _keywords[_i] + "=" + _glob_terminal_warnings_switch );
            break ;
		        default: break ;
        }
    }

    return _config_array.join( _glob_crlf );
}

function circles_lib_config_save()
{
    var _config = circles_lib_config_list_generate();
    var blob = new Blob( [ _config ], { type: 'plain/text', endings: 'native' });
    saveAs( blob, "circles.config.txt" );
}