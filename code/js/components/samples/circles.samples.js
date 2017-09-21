function CIRCLESsamplesOPEN( i, _silent, _out_channel )
{
		_silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _items_n = circles_lib_count_items();
    if (_glob_bip_use)
    {
        var _msg = "BIP flag is still on.\n" ;
        _msg += "Confirm to switch it off and draw this sample on the screen ?" ;
        var _b_go = _silent ? YES : confirm( _msg );
        if ( _b_go ) _glob_bip_use = NO ;
    }
    
    var _msg = "A previous diagram configuration was detected." + _glob_crlf.repeat(2) ;
        _msg += "Would you like to clean the W-plane ?" ;
    var _b_clean = ( _silent || _items_n == 0 ) ? YES : ( confirm( _msg ) ? YES : NO );

    var _drop_additional_figures = NO ;
    var _n_additional_figures = safe_size( _glob_figures_array, 0 );
    if ( _n_additional_figures > 0 )
    {
        var _msg = "There are " + _n_additional_figures + " figure" ;
            _msg += _n_additional_figures == 1 ? "" : "s" ;
            _msg += " recorded.\n\nDo you want to drop'em ?" ;
        _drop_additional_figures = _silent ? YES : confirm( _msg );
        _b_clean = _b_clean ? YES : NO ;
    }

    var _zplane_canvas = _glob_zplane_rendering_canvas_placeholder != null ? _glob_zplane_rendering_canvas_placeholder : _glob_zplane_rendering_canvas_placeholder;
    var _zplane_mapper = zplane_sm ;
    var _wplane_canvas = _glob_bip_use ? _glob_bip_canvas : _glob_wplane_rendering_canvas_placeholder ;
    var _wplane_mapper = _glob_bip_use ? bipbox_sm : wplane_sm ;

    var _reset_mask = ( ~RESET_NONE ) & ( ~RESET_BIP );
    circles_lib_config_create_new_main( ( _silent || _items_n == 0 ) ? YES : NO, _silent, _reset_mask, _drop_additional_figures, _b_clean, _out_channel );

    var _ret_chunk = null ;
    switch( i )
    {
        case METHOD_INVERSION + 0.1:
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -1, _glob_zplaneTOP = 1 ;
		        _glob_zplaneRIGHT = 1, _glob_zplaneBOTTOM = -1 ;

		        _glob_bipLEFT = _glob_wplaneLEFT = -3, _glob_bipTOP = _glob_wplaneTOP = 3 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 3, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -3 ;
				}

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, 0.038 ), 0.865 ), null, "A", 0, NO, circles_lib_alphabet_get_color_from_symbol('A'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.4, -0.2 ), 0.4 ), null, "B", 0, NO, circles_lib_alphabet_get_color_from_symbol('B'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -0.4, -0.2 ), 0.4 ), null, "C", 0, NO, circles_lib_alphabet_get_color_from_symbol('C'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.0, 0.497 ), 0.402 ), null, "D", 0, NO, circles_lib_alphabet_get_color_from_symbol('D'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 255,0,0 )", "rgb( 255,255,0 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( is_32bits_architecture() ? 7 : 9 );
        break ;
        case METHOD_INVERSION+0.2:
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
	        _glob_bipLEFT = _glob_wplaneLEFT = _glob_zplaneLEFT = -1.4 ;
          _glob_bipTOP = _glob_wplaneTOP = _glob_zplaneTOP = 1.4 ;
	        _glob_bipRIGHT = _glob_wplaneRIGHT = _glob_zplaneRIGHT = 1.4 ;
          _glob_bipBOTTOM = _glob_wplaneBOTTOM = _glob_zplaneBOTTOM = -1.4 ;
        }

        _glob_show_grid_wplane = YES ;

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.0, 100000 ), 100000 ), null, "A", 0, NO, circles_lib_alphabet_get_color_from_symbol('A'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, -0.25 ), 0.25 ), null,"B", 0, NO, circles_lib_alphabet_get_color_from_symbol('B'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -1, -1 ), 1 ), null, "C", 0, NO, circles_lib_alphabet_get_color_from_symbol('C'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 1, -1 ), 1 ), null, "D", 0, NO, circles_lib_alphabet_get_color_from_symbol('D'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 0,56,85 )", "rgb( 139,203,255 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( is_32bits_architecture() ? 7 : 9 );
        break ;
        case METHOD_INVERSION+0.3:
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -1.4, _glob_zplaneTOP = 1.4 ;
		        _glob_zplaneRIGHT = 1.4, _glob_zplaneBOTTOM = -1.4 ;
		
		        _glob_bipLEFT = _glob_wplaneLEFT = -1.4, _glob_bipTOP = _glob_wplaneTOP = 1.4 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 1.4, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -1.4 ;
        }

        _glob_show_grid_wplane = YES ;

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.0, 100000 ), 100000 ), null, "A", 0, NO, circles_lib_alphabet_get_color_from_symbol('A'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, -0.4 ), 0.3083045973594573 ), null,"B", 0, NO, circles_lib_alphabet_get_color_from_symbol('B'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -1.1, -0.9 ), 0.9 ), null, "C", 0, NO, circles_lib_alphabet_get_color_from_symbol('C'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 1.1, -0.9 ), 0.9 ), null, "D", 0, NO, circles_lib_alphabet_get_color_from_symbol('D'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 0,56,85 )", "rgb( 139,203,255 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( is_32bits_architecture() ? 7 : 9 );
        break ;
        case METHOD_INVERSION+0.4:
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -2.2, _glob_zplaneTOP = 2.2 ;
		        _glob_zplaneRIGHT = 2.2, _glob_zplaneBOTTOM = -2.2 ;
		
		        _glob_bipLEFT = _glob_wplaneLEFT = -2.2, _glob_bipTOP = _glob_wplaneTOP = 2.2 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 2.2, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -2.2 ;
        }

        _glob_show_grid_wplane = YES ;

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 10000, 0 ), 9999 ), null, "A", 0, NO, circles_lib_alphabet_get_color_from_symbol('A'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -10000, 0 ), 9999 ), null,"B", 0, NO, circles_lib_alphabet_get_color_from_symbol('B'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, 1 ), 1 ), null, "C", 0, NO, circles_lib_alphabet_get_color_from_symbol('C'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, -1 ), 1 ), null, "D", 0, NO, circles_lib_alphabet_get_color_from_symbol('D'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 0,191,0 )", "rgb( 229,248,229 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( is_32bits_architecture() ? 7 : 9 );
        break ;
        case METHOD_INVERSION+0.5:
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -2.2, _glob_zplaneTOP = 2.2 ;
		        _glob_zplaneRIGHT = 2.2, _glob_zplaneBOTTOM = -2.2 ;
		
		        _glob_bipLEFT = _glob_wplaneLEFT = -2.2, _glob_bipTOP = _glob_wplaneTOP = 2.2 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 2.2, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -2.2 ;
        }

        _glob_show_grid_wplane = YES ;

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 10000, 0 ), 9999.5 ), null, "A", 0, NO, circles_lib_alphabet_get_color_from_symbol('A'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -10000, 0 ), 9999.5 ), null,"B", 0, NO, circles_lib_alphabet_get_color_from_symbol('B'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, 0.5 ), 0.5 ), null, "C", 0, NO, circles_lib_alphabet_get_color_from_symbol('C'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, -0.5 ), 0.5 ), null, "D", 0, NO, circles_lib_alphabet_get_color_from_symbol('D'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, 1.5 ), 0.5 ), null, "E", 0, NO, _glob_draw_seed_color, YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, -1.5 ), 0.5 ), null, "F", 0, NO, _glob_draw_seed_color, YES, "", "", 1, ITEM_TYPE_CIRCLE ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 0,191,0 )", "rgb( 229,248,229 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( is_32bits_architecture() ? 7 : 9 );
        break ;
        case METHOD_INVERSION+0.6:
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -2.2, _glob_zplaneTOP = 2.2 ;
		        _glob_zplaneRIGHT = 2.2, _glob_zplaneBOTTOM = -2.2 ;
		
		        _glob_bipLEFT = _glob_wplaneLEFT = -2.2, _glob_bipTOP = _glob_wplaneTOP = 2.2 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 2.2, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -2.2 ;
        }

        _glob_show_grid_wplane = YES ;

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, 4 ), 3.5 ), null, "A", 0, NO, circles_lib_alphabet_get_color_from_symbol('A'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, -4 ), 3.5 ), null,"B", 0, NO, circles_lib_alphabet_get_color_from_symbol('B'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.6, 0 ), 0.54 ), null, "C", 0, NO, circles_lib_alphabet_get_color_from_symbol('C'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -0.6, 0 ), 0.54 ), null, "D", 0, NO, circles_lib_alphabet_get_color_from_symbol('D'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 0,191,0 )", "rgb( 229,248,229 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( is_32bits_architecture() ? 7 : 9 );
        break ;
        case METHOD_INVERSION+0.7:
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -2.2, _glob_zplaneTOP = 2.2 ;
		        _glob_zplaneRIGHT = 2.2, _glob_zplaneBOTTOM = -2.2 ;
		
		        _glob_bipLEFT = _glob_wplaneLEFT = -2.2, _glob_bipTOP = _glob_wplaneTOP = 2.2 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 2.2, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -2.2 ;
        }

        _glob_show_grid_wplane = YES ;

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 1000, 0 ), 999.5 ), null, "A", 0, NO, circles_lib_alphabet_get_color_from_symbol('A'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -0.15714285714285714,0.3494792 ), 0.337202380952381 ), null,"B", 0, NO, circles_lib_alphabet_get_color_from_symbol('B'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -1000, 0 ), 999.5 ), null, "C", 0, NO, circles_lib_alphabet_get_color_from_symbol('C'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.27172619047619045,0.7390625 ), 0.2324404761904762 ), null, "D", 0, NO, circles_lib_alphabet_get_color_from_symbol('D'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 179,144,63 )", "rgb( 229,248,229 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( is_32bits_architecture() ? 7 : 9 );
        break ;
        case METHOD_INVERSION+0.8:
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -1.8, _glob_zplaneTOP = 1.8 ;
		        _glob_zplaneRIGHT = 1.8, _glob_zplaneBOTTOM = -1.8 ;
		
		        _glob_bipLEFT = _glob_wplaneLEFT = -1.8, _glob_bipTOP = _glob_wplaneTOP = 1.8 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 1.8, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -1.8 ;
        }

        _glob_show_grid_wplane = YES ;

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, 100000 ), 100000 ), null, "A", 0, NO, circles_lib_alphabet_get_color_from_symbol('A'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -0.0004784971644612476,-0.2529389177693762 ), 0.25168950850661626 ), null,"B", 0, NO, circles_lib_alphabet_get_color_from_symbol('B'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point(-0.8829268292682927,-0.7658536585365853), 0.7658536585365853 ), null, "C", 0, NO, circles_lib_alphabet_get_color_from_symbol('C'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point(0.8829268292682927,-0.7658536585365853), 0.7658536585365853 ), null, "D", 0, NO, circles_lib_alphabet_get_color_from_symbol('D'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 191,0,0 )", "rgb( 255,192,0 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( is_32bits_architecture() ? 7 : 9 );
        break ;
        case METHOD_INVERSION+0.9:
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -1.8, _glob_zplaneTOP = 1.8 ;
		        _glob_zplaneRIGHT = 1.8, _glob_zplaneBOTTOM = -1.8 ;
		
		        _glob_bipLEFT = _glob_wplaneLEFT = -1.8, _glob_bipTOP = _glob_wplaneTOP = 1.8 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 1.8, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -1.8 ;
        }

        _glob_show_grid_wplane = YES ;

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, 100000 ), 100000 ), null, "A", 0, NO, circles_lib_alphabet_get_color_from_symbol('A'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.0012892666594076646, -1.4871583732578397 ), 0.3988703179442508 ), null,"B", 0, NO, circles_lib_alphabet_get_color_from_symbol('B'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point(-0.6609210396477568,-0.6595582756015897), 0.6595582756015897 ), null, "C", 0, NO, circles_lib_alphabet_get_color_from_symbol('C'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point(0.6609210396477568,-0.6595582756015897), 0.6595582756015897 ), null, "D", 0, NO, circles_lib_alphabet_get_color_from_symbol('D'), YES, "", "", 1, ITEM_TYPE_CIRCLE ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 215,115,0 )", "rgb( 244,224,91 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( is_32bits_architecture() ? 7 : 9 );
        break ;
        case METHOD_INVERSION + 1.0 :
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -1.0, _glob_zplaneTOP = 1.0 ;
		        _glob_zplaneRIGHT = 1.0, _glob_zplaneBOTTOM = -1.0 ;
		
		        _glob_bipLEFT = _glob_wplaneLEFT = -1.0, _glob_bipTOP = _glob_wplaneTOP = 1.0 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 1.0, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -1.0 ;
        }

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.61, 0 ), 0.4 ), null, "A", 0, YES, _glob_draw_seed_color, NO, "", "a", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -0.61, 0 ), 0.4 ), null, "a", 0, YES, _glob_draw_seed_color, NO, "", "A", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, 0.61 ), 0.4 ), null, "B", 0, YES, _glob_draw_seed_color, NO, "", "b", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, -0.61 ), 0.4 ), null, "b", 0, YES, _glob_draw_seed_color, NO, "", "B", 1, 0 ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 21,80,150 )", "rgb( 135,235,170 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( 4 );
        break ;
        case METHOD_INVERSION + 1.1 :
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -1.0, _glob_zplaneTOP = 1.0 ;
		        _glob_zplaneRIGHT = 1.0, _glob_zplaneBOTTOM = -1.0 ;
		
		        _glob_bipLEFT = _glob_wplaneLEFT = -1.0, _glob_bipTOP = _glob_wplaneTOP = 1.0 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 1.0, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -1.0 ;
        }

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.4, 0 ), 0.4 ), null, "A", 0, YES, _glob_draw_seed_color, NO, "", "a", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -0.4, 0 ), 0.4 ), null, "a", 0, YES, _glob_draw_seed_color, NO, "", "A", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, 0.4 ), 0.4 ), null, "B", 0, YES, _glob_draw_seed_color, NO, "", "b", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0, -0.4 ), 0.4 ), null, "b", 0, YES, _glob_draw_seed_color, NO, "", "B", 1, 0 ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 21,80,150 )", "rgb( 135,235,170 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( 4 );
        break ;
        case METHOD_INVERSION + 1.2:
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -1.0, _glob_zplaneTOP = 1.0 ;
		        _glob_zplaneRIGHT = 1.0, _glob_zplaneBOTTOM = -1.0 ;
		
		        _glob_bipLEFT = _glob_wplaneLEFT = -1.0, _glob_bipTOP = _glob_wplaneTOP = 1.0 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 1.0, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -1.0 ;
        }

        _glob_show_grid_wplane = YES ;

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.4, 0.4 ), 0.4 ), null, "A", 0, NO, circles_lib_alphabet_get_color_from_symbol('A'), YES, "", "a", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -0.4, 0.4 ), 0.4 ), null, "b", 0, NO, circles_lib_alphabet_get_color_from_symbol('b'), YES, "", "B", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -0.4, -0.4 ), 0.4 ), null,"B", 0, NO, circles_lib_alphabet_get_color_from_symbol('B'), YES, "", "b", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.4, -0.4 ), 0.4 ), null, "a", 0, NO, circles_lib_alphabet_get_color_from_symbol('a'), YES, "", "A", 1, 0 ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 0,56,85 )", "rgb( 139,203,255 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_options_mask = 0 ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( is_32bits_architecture() ? 7 : 9 );
        break ;
        case METHOD_INVERSION + 1.3:
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        _glob_zplaneLEFT = -1.0, _glob_zplaneTOP = 1.0 ;
		        _glob_zplaneRIGHT = 1.0, _glob_zplaneBOTTOM = -1.0 ;
		
		        _glob_bipLEFT = _glob_wplaneLEFT = -1.0, _glob_bipTOP = _glob_wplaneTOP = 1.0 ;
		        _glob_bipRIGHT = _glob_wplaneRIGHT = 1.0, _glob_bipBOTTOM = _glob_wplaneBOTTOM = -1.0 ;
        }

        _glob_show_grid_wplane = YES ;

        _glob_seeds_array.flush();
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0.3987789203084833,-0.0006426735218508997 ), 0.16323907455012854 ), null, "a", 0, NO, circles_lib_alphabet_get_color_from_symbol('a'), YES, "", "A", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( -0.3982969151670951,-0.0006426735218508997 ), 0.16323907455012854 ), null, "A", 0, NO, circles_lib_alphabet_get_color_from_symbol('A'), YES, "", "a", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0,0.4 ), 0.4 ), null,"B", 0, NO, circles_lib_alphabet_get_color_from_symbol('B'), YES, "", "b", 1, 0 ) );
        _glob_seeds_array.push( new item_obj( null, new circle( new point( 0,-0.4 ), 0.4 ), null, "b", 0, NO, circles_lib_alphabet_get_color_from_symbol('b'), YES, "", "B", 1, 0 ) );

        var _ret_chunk = circles_lib_colors_compute_gradient( "rgb( 0,192,85 )", "rgb( 255,255,49 )", 10, _silent, _out_channel );
        _glob_palette_array = _ret_chunk[1] ;

        _glob_construction_mode = CONSTRUCTION_TILING ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_palette_use = _glob_wplane_disk_fill = YES ;

        circles_lib_drawentity_set( DRAWENTITY_ISOMETRIC_CIRCLE );
        circles_lib_method_set( METHOD_INVERSION );
        circles_lib_depth_set( is_32bits_architecture() ? 7 : 9 );
        break ;
        default: break ;
    }

    _glob_items_to_init = _glob_dict_create = YES ;
    if ( _glob_interface_index == INTERFACE_EXTEND_NONE ) circles_lib_canvas_coords_acquire( ALL_PLANES );
    CIRCLESsamplesCTRLmanager();
    var _ret_msg = [], _final_ret = YES ;
    var _init_mask = circles_lib_items_verify_init_mask( INIT_FROM_DISKS );
    circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, YES, _out_channel );
    var _ret_chunk = circles_lib_items_init( null, NO, YES, _init_mask, NO, YES, _out_channel );
    if ( _ret_chunk[0] != RET_IRRELEVANT )
    {
       _final_ret &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
       if ( is_array( _ret_chunk ) ) _ret_msg.push( _ret_chunk[1] );
    }

    var new_method_str = circles_lib_method_get_def( _glob_method );
    _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, _silent, YES, _out_channel );
    if ( _ret_chunk[0] != RET_IRRELEVANT )
    {
       _final_ret &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
       if ( is_array( _ret_chunk ) ) _ret_msg.push( _ret_chunk[1] );
    }

		circles_lib_set_target_plane( W_PLANE ) ;
    _ret_chunk = circles_lib_canvas_process_ask( NO, _silent, _glob_bip_use ? BIP_BOX : _glob_target_plane,
																								 YES, _b_clean, NO, null, _out_channel );
    if ( _ret_chunk[0] != RET_IRRELEVANT )
    {
        _final_ret &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
        if ( is_array( _ret_chunk ) ) _ret_msg.push( _ret_chunk[1] );
    }

    if ( _final_ret == RET_ERROR && _out_channel == OUTPUT_SCREEN && !_silent )
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ret_msg.join( _glob_crlf ), _glob_app_title );
    else
    {
       circles_lib_menu_entries_update();
       if ( _glob_terminal_popup_active > 0 )
       {
          if ( is_array( _ret_chunk ) )
          {
             if ( _ret_msg.length > 0 && is_array( _ret_msg ) ) _ret_msg = _ret_msg.push_first( "Loading sample ..." );
             var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
             var _ret_msg = _ret_msg.length > 0 ? _ret_msg.join( _glob_crlf ) : _ERR_00_00 ;
             if ( _ret_id ) circles_lib_terminal_multicolor_echo( _ret_msg );
             else circles_lib_terminal_error_echo( _ret_msg );
          }
       }
    }
}

function CIRCLESsamplesCTRLmanager()
{
    $("#CIRCLEScheckboxSYMBOLSdisplayZPLANE").prop( "checked", _glob_show_symbols_zplane ? YES : NO );
    $("#CIRCLEScheckboxPALETTEuse").prop( "checked", _glob_palette_use ? YES : NO );
    $("#CIRCLEScheckboxDISKSfill").prop( "checked", _glob_wplane_disk_fill ? YES : NO );
}