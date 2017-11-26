function circles_lib_reset_coords()
{
    _glob_zplaneMOUSEleftBTNstatus = ON ;
    _glob_centerRADIUS = _glob_centerX = _glob_centerY = UNDET ;
    _glob_currentX = _glob_currentY = UNDET ;
    _glob_startX = _glob_startY = UNDET ;
    _glob_endX = _glob_endY = UNDET ;
}

function circles_lib_reset_canvas()
{
     _glob_bip_opacity = DEFAULT_MAX_OPACITY, _glob_context_dims = DIMS_2D ;
     var _layers = circles_lib_canvas_layer_pile_per_plane_get( Z_PLANE ), _ret_pos_index, _ret ;
     for( var _i = 0 ; _i < _layers.length ; _i++ )
     {
         _ret_pos_index = circles_lib_canvas_layer_find_pos_index( Z_PLANE, FIND_LAYER_BY_ROLE_DEF, _layers[_i].get_role_def() );
         _ret = circles_lib_canvas_layer_update( Z_PLANE, _ret_pos_index, "opacity", DEFAULT_MAX_OPACITY * 100.0 );
         _ret = circles_lib_canvas_layer_update( Z_PLANE, _ret_pos_index, "bkcolor", "transparent" );
         _ret = circles_lib_canvas_layer_update( Z_PLANE, _ret_pos_index, "visible", YES );
     }

     _layers = circles_lib_canvas_layer_pile_per_plane_get( W_PLANE );
     for( var _i = 0 ; _i < _layers.length ; _i++ )
     {
         _ret_pos_index = circles_lib_canvas_layer_find_pos_index( W_PLANE, FIND_LAYER_BY_ROLE_DEF, _layers[_i].get_role_def() );
         _ret = circles_lib_canvas_layer_update( W_PLANE, _ret_pos_index, "opacity", DEFAULT_MAX_OPACITY * 100.0 );
         _ret = circles_lib_canvas_layer_update( W_PLANE, _ret_pos_index, "bkcolor", "transparent" );
         _ret = circles_lib_canvas_layer_update( W_PLANE, _ret_pos_index, "visible", YES );
     }

     _glob_zplane_grid_layer_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
     _glob_zplane_rendering_layer_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
     _glob_zplane_freedraw_layer_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
     _glob_zplane_work_layer_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );

     _glob_wplane_grid_layer_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
     _glob_wplane_rendering_layer_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
     _glob_wplane_freedraw_layer_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
     _glob_wplane_work_layer_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );

     circles_lib_reset_colors();
     _glob_density_rect_lastindex = UNDET ;
}

function circles_lib_reset_colors()
{
    _glob_default_text_clr = DEFAULT_TEXT_COLOR ;
    _glob_draw_seed_color = DEFAULT_DRAW_SEED_COLOR ;
    _glob_fill_seed_color = DEFAULT_FILL_SEED_COLOR ;
    _glob_axis_color = DEFAULT_AXES_COLOR ;
    _glob_grid_color = DEFAULT_GRID_COLOR ;
    _glob_label_text_color = DEFAULT_LABEL_TEXT_COLOR ;
    _glob_label_dot_color = DEFAULT_LABEL_DOT_COLOR ;
    _glob_pt_border_color = DEFAULT_PT_BORDER_COLOR ;
    _glob_pt_interior_color = DEFAULT_PT_INTERIOR_COLOR ;
}

function circles_lib_reset_vars( _reset_mask, _silent, _output_channel )
{
    _reset_mask = safe_int( _reset_mask, ~RESET_NONE );
    _silent = safe_int( _silent, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _reset_report_array = [];
    _glob_items_to_init = NO ;
    $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);

    if ( _reset_mask & RESET_GENERALS )
    {
        _reset_report_array.push( "General options" );
        _glob_init_mask = INIT_FROM_DISKS | INIT_PAIRED_ITEMS ;
        circles_lib_method_set( METHOD_NONE );
        _glob_submethod_desc = "" ;
        circles_lib_process_set( PROCESS_NONE );
        _glob_fixedpt_io = FIXEDPOINTS_IO_INPUT ;
        _glob_alphabet.flush();
        _glob_to_save = NO ;
        _glob_last_pt = null ;
        _glob_use_last_pt = NO ;
        _glob_src_canvas_mode = ZPLANE_CANVAS_CIRCLESDRAW_MODE ;
        _glob_items_switch = ITEMS_SWITCH_SEEDS | ITEM_BYVAL ;
        _glob_text = _glob_comment = _glob_filter = _glob_title = "" ;

        _glob_opacity = DEFAULT_OPACITY ;
        _glob_distance_tolerance = DEFAULT_DISTANCE_TOLERANCE ;
        _glob_pixel_size = 1 ;
        _glob_pt_border = DEFAULT_PT_BORDER, _glob_pt_radius = DEFAULT_PT_RADIUS ;
        _glob_target_plane = W_PLANE ;

        _glob_construction_mode = _glob_dict_processor.construction_mode = CONSTRUCTION_TILING ;
        _glob_disk_threshold_radius = 0 ;
        _glob_disk_threshold_operator = "" ;
        
        _glob_play_inversion = NO ;
        _glob_word_orbit = "" ;
        _glob_popup_mask = UNDET ;
        _glob_zplane_canvas_merge = _glob_wplane_canvas_merge = NO ;
        _glob_depth = is_32bits_architecture() ? 8 : 10 ;
        circles_lib_depth_set( _glob_depth, YES );
		    _glob_drawentity = DRAWENTITY_NONE ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_disk_sel_index = UNDET ;

        _glob_options_mask = 0 ;
        _glob_current_tab = [] ;
        _glob_repetendsAPPLY = DISABLED ;

        _glob_worker_lock = NO ;

        _glob_volatile_settings = [] ;
        _glob_multithread_vars = [];
        _glob_multithread_canvas = null ;
        _glob_multithread_mapper = null ;
        _glob_multithread_context = null ;

        _glob_rnd_reps_threshold = DEFAULT_RND_REPS_THRESHOLD ;
        _glob_rnd_reps_depth = DEFAULT_RND_REPS_DEPTH ;

        _glob_seeds_array = [];
        _glob_symbols_index_array = [];
        _glob_zplane_selected_items_array = [];
        circles_lib_helper_div_remove();
        _glob_wplane_selected_items_array.flush();
        _glob_rnd_probability_array.flush();
        _glob_limitset_array.flush();
        _glob_zplane_layers_pile_role_array = [ ROLE_GRID, ROLE_RENDERING, ROLE_FREEDRAW, ROLE_WORK ];
        /* 1: grid, 2: circles, 3: free draw, 4: work */
    
        _glob_wplane_layers_pile_role_array = [ ROLE_GRID, ROLE_RENDERING, ROLE_FREEDRAW, ROLE_WORK ];
        /* 1: grid, 2: rendering, 3: free draw, 4: work */
        circles_lib_items_switch_to(ITEMS_SWITCH_SEEDS,YES,_output_channel );
        circles_lib_statusbar_set_config_icon( _glob_bip_use ? CONFIG_BIPBOX : CONFIG_STD );
    }
    
    if ( _reset_mask & RESET_PLUGINS )
    {
        _glob_tmp_gens_container = [] ;
        var _plugin_index_ref = _plugin_last_ref;
            _plugin_rec_configs_array[ _plugin_index_ref ] = [] ;
            
        var _keys = array_keys( _plugin_vars_array[ _plugin_index_ref ] );
        $.each( _keys, function( _i, _key ){ _plugin_vars_array[ _plugin_index_ref ][_key] = "" ; } ) ;

        _plugin_tmp_vars_array.flush();
        _plugin_import_mask = 0 ;
        _plugin_import_chunk = [];
        _plugin_import_gens = [];
        _plugin_step_index = UNDET ;
        _plugin_main_ref = 0 ;
    }

    if ( _reset_mask & RESET_COORDS )
    {
        _reset_report_array.push( "Z-plane / W-plane / BIP box - Coords" );

        _glob_bipLEFTtmp = _glob_bipRIGHTtmp = 0 ;
        _glob_bipTOPtmp = _glob_bipBOTTOMtmp = 0 ;

        _glob_bipLEFT = -DEFAULT_PLANE_COORD ;
        _glob_bipRIGHT = DEFAULT_PLANE_COORD ;
        _glob_bipTOP = DEFAULT_PLANE_COORD ;
        _glob_bipBOTTOM = -DEFAULT_PLANE_COORD ;

        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
            _glob_zplaneLEFT = -DEFAULT_PLANE_COORD ;
            _glob_zplaneRIGHT = DEFAULT_PLANE_COORD ;
            _glob_zplaneTOP = DEFAULT_PLANE_COORD ;
            _glob_zplaneBOTTOM = -DEFAULT_PLANE_COORD ;
    
            _glob_wplaneLEFT = -DEFAULT_PLANE_COORD ;
            _glob_wplaneRIGHT = DEFAULT_PLANE_COORD ;
            _glob_wplaneTOP = DEFAULT_PLANE_COORD ;
            _glob_wplaneBOTTOM = -DEFAULT_PLANE_COORD ;
        }
        else
        {
            _glob_zplaneTOP = DEFAULT_PLANE_COORD ;
            _glob_zplaneBOTTOM = -DEFAULT_PLANE_COORD ;
            zplane_sm.set_coords_rect( new rect( _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;

            _glob_wplaneTOP = DEFAULT_PLANE_COORD ;
            _glob_wplaneBOTTOM = -DEFAULT_PLANE_COORD ;
            wplane_sm.set_coords_rect( new rect( _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
            circles_lib_interface_extend( _glob_interface_index, YES, new point( 0, 0 ) ) ;
        }

    }
    
		if ( _reset_mask & RESET_DICT )
    {
		    _glob_dict_selected_page = 0 ;
		    _glob_dict_create = YES ;
		    _glob_original_dict.flush();
    }
    
		if ( _reset_mask & RESET_TERMINAL )
    {
        _reset_report_array.push( "Terminal console" );
        _glob_terminal_autorefresh = DISABLED ;
        _glob_terminal_autoinit_enable = DISABLED ;
        _glob_terminal_codelist = "" ;
        _glob_terminal_critical_halt = NO ;
        _glob_terminal_critical_halt_msg = "" ;
        _glob_terminal_current_cmd = "" ;
        _glob_terminal_echo_flag = ENABLED ;
        _glob_terminal_errors_counter = 0 ;
        _glob_terminal_keepcmd = "" ;
    		_glob_terminal_change = NO ;
    		_glob_terminal_questions_enabled = YES ;
        _glob_terminal_echo_flag = DISABLED ;
        _glob_terminal_user_halt = NO ;
        _glob_terminal_warnings_counter = 0 ;
        _glob_terminal_warnings_switch = ON ;
    }

    if ( _reset_mask & RESET_BIP )
    {
        _reset_report_array.push( "Batch Image Processing" );
        _glob_bip_opacity = DEFAULT_MAX_OPACITY ;
        _glob_bip_original_plane_data = Z_PLANE ;
    }

    if ( _reset_mask & RESET_GENS_SET )
    {
		    _glob_gens_set_model_array.flush();
		    _glob_gens_set_symbols_map_array.flush();
		    _glob_gens_array = [];

    		_glob_probabilityRNDrecalcAUTOMATICflag = YES ;
    		_glob_probabilityRNGmethod = RNG_BUILT_IN ;
		}

    var _reset_report = "The following components have been reset:" + _glob_crlf.repeat(2) + _reset_report_array.join( _glob_crlf );
    if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _reset_report, _glob_app_title );
    else return [ RET_OK, _reset_report ] ;
}