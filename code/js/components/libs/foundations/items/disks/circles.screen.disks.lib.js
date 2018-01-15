function circles_lib_get_screendisk_from_complexdisk( _mapper, _complex_circle )
{
    var _radius_pt = new point( _complex_circle.center.x + _complex_circle.radius, _complex_circle.center.y );
    var screen_center_pt = _mapper.from_cartesian_to_client( _complex_circle.center.x, _complex_circle.center.y );
    var screen_radius_pt = _mapper.from_cartesian_to_client( _radius_pt.x, _radius_pt.y );
    var screen_radius = Math.abs( screen_center_pt.x - screen_radius_pt.x );
    return new circle( screen_center_pt, screen_radius, _complex_circle.draw, _complex_circle.fill, _complex_circle.bordercolor, _complex_circle.fillcolor, _complex_circle.bordersize, _complex_circle.notes );
}

function circles_lib_screendisk_add_from_coords( X, Y, RADIUS, _out_channel )
{
    var pt = new point( X, Y ), pt_radius = new point( X + RADIUS, Y );
    var _complex_radius = Math.abs( pt.x - pt_radius.x );
    var _complex_circle = new circle( pt, _complex_radius );
    var _mm = circles_lib_items_create_from_disk( null, _complex_circle );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    _items_array.push( new item_obj( _mm, _complex_circle, null, "", 0, YES, "", NO, "", "", 1, ITEM_TYPE_CIRCLE ) );
    var LASTindex = circles_lib_count_items() - 1 ;
    _glob_disk_sel_index = LASTindex = safe_int( LASTindex, UNDET );
    _glob_zplane_selected_items_array = [];
    _glob_zplane_selected_items_array.push( LASTindex );
    circles_lib_helper_div_remove();
    if ( circles_lib_count_items() > 0 )
    var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _out_channel);
    var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
    if ( _ret_id == RET_ERROR ) return _ret_chunk ;

    _glob_items_to_init = YES ;
    $('[id$=initBTN]').css('color',COLOR_ERROR) ;
    if ( circles_lib_method_check() )
    {
       _ret_chunk = circles_lib_items_init( ITEMindex, NO, YES, _glob_init_mask, NO, YES, _out_channel );
       if ( _ret_chunk[0] != RET_OK )
       {
         circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
         return _ret_chunk ;
       }
    }
    circles_lib_alphabet_autoconfig_all_symbols(NO,YES,NO,YES,_out_channel);
    circles_lib_plugin_load('forms','construct.tangent.circle');
    return [ RET_OK, "Screen disk has been added with success" ] ;
}

function circles_lib_screendisk_mark( _complex_x, _complex_y, _complex_radius )
{
    var context = _glob_zplane_rendering_layer_pointer.getContext( _glob_canvas_ctx_2D_mode );
    var _screen_circle = circles_lib_draw_complex_disk( context, zplane_sm,
                                                 _complex_x, _complex_y, _complex_radius,
                                                 1, _glob_fill_seed_color, 0, "", null, null, null, null, "", 2 );
    return { x : _screen_circle.center.x, y : _screen_circle.center.y, radius : _screen_circle.radius } ;
}

function circles_lib_screendisk_add( _items_array, _screen_circle, _init, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( !is_circle( _screen_circle ) ) return [ UNDET, "Missing input circle", circles_lib_count_items() ] ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _b_add = YES, _items_n = circles_lib_count_items( _items_array ), _init = safe_int( _init, NO );
    if ( !_test ) return [ RET_ERROR, "Invalid input items container", UNDET ] ;
    else if ( _items_n == 0 ) _b_add = YES ;
    else
    {
  		 var ITEM = null ;
       for( var _i = 0 ; _i < _items_n ; _i++ )
       {
           ITEM = _items_array[ _i ] ;
           if ( !is_item_obj( ITEM ) || !is_circle( ITEM.screen_circle ) ) break ;
           if ( ITEM.screen_circle.center.x == _screen_circle.center.x &&
                ITEM.screen_circle.center.y == _screen_circle.center.y &&
                ITEM.screen_circle.radius == _screen_circle.radius
              )
           {
              _b_add = NO ;
              break ;
           }
       }
    }

    if ( _b_add )
    {
        var _complex_circle = circles_lib_get_complexdisk_from_screen( zplane_sm, _screen_circle );
        _items_array.push( circles_lib_items_create_from_disk( UNDET, _complex_circle, _screen_circle ) );
        if ( _init )
        {
            _glob_items_to_init = YES ;
            $('[id$=initBTN]').css('color',COLOR_ERROR) ;
            circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, YES, _out_channel );
            var _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, NO, YES, _out_channel );
            var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
            if ( _ret_id != RET_OK )
            {
               _ret_chunk.push( UNDET );
               return _ret_chunk ;
            }
        }
        
        return [ RET_OK, "A new disk has been inserted with success", circles_lib_count_items() - 1 ] ;
    }
    else return [ RET_ERROR, "There exists another disk with the same coordinates.", UNDET ] ;
}