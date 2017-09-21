function circles_lib_canvas_render_zplane( _canvas, _mapper, _selected_layers_array, _b_clean, _b_render_bk, _b_rendering, _question, _silent, _b_reset_coords, _out_channel )
{
		circles_lib_menu_entries_update() ;
		if ( _glob_interface_index == INTERFACE_EXTEND_WPLANE ) return [ RET_IRRELEVANT, "Z-plane rendering skipped for extended interface" ] ;
    // layers can be input as an array or a string of indexes separated by comma
    if ( !is_array( _selected_layers_array ) )
    {
       if ( is_string( _selected_layers_array ) )
       _selected_layers_array.includes( "," ) ? _selected_layers_array.split( "," ) : null ;
    }
    
    if ( safe_size( _selected_layers_array, 0 ) == 0 ) _selected_layers_array = null ;
    
    _b_clean = safe_int( _b_clean, NO );
    _b_render_bk = safe_int( _b_render_bk, YES ), _b_rendering = safe_int( _b_rendering, YES );
    _b_reset_coords = safe_int( _b_reset_coords, YES );
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    
    if ( _question && !_silent )
    {
			 if( !confirm( "Do you confirm to " + ( _b_clean ? "clean" : "render" ) + " the z-plane ?" ) )
			 return [ RET_IRRELEVANT, "Z-plane rendering aborted by user" ] ; 
		}
    
    var _items_n = circles_lib_count_items();
    if ( !is_screen_mapper( _mapper ) )
    {
       _mapper = zplane_sm.copy() ;
       circles_lib_canvas_coords_acquire( Z_PLANE ) ;
    }

    var _grid_canvas = null, _rendering_canvas = null, _freedraw_canvas = null, _work_canvas = null ;
    _grid_canvas = is_html_canvas( _canvas ) ? _canvas : ( circles_lib_canvas_get_exists( Z_PLANE, "grid" ) ? circles_lib_canvas_get_target( Z_PLANE, "grid" ) : _glob_zplane_grid_canvas_placeholder ) ;
    _rendering_canvas = is_html_canvas( _canvas ) ? _canvas : ( circles_lib_canvas_get_exists( Z_PLANE, "rendering" ) ? circles_lib_canvas_get_target( Z_PLANE, "rendering" ) : _glob_zplane_rendering_canvas_placeholder ) ;
    _freedraw_canvas = is_html_canvas( _canvas ) ? _canvas : ( circles_lib_canvas_get_exists( Z_PLANE, "freedraw" ) ? circles_lib_canvas_get_target( Z_PLANE, "freedraw" ) : _glob_zplane_freedraw_canvas_placeholder ) ;
    _work_canvas = is_html_canvas( _canvas ) ? _canvas : ( circles_lib_canvas_get_exists( Z_PLANE, "work" ) ? circles_lib_canvas_get_target( Z_PLANE, "work" ) : _glob_zplane_work_canvas_placeholder ) ;

    _glob_apply_dashed_border = YES ;
    if ( _b_reset_coords ) circles_lib_reset_coords();
    if ( _b_clean )
    {
        if ( _selected_layers_array != null )
        {
         		var _layer, _tmp_canvas ;
            $.each( _selected_layers_array, function( _i, _layer_role_index )
                    {
                       _layer = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, _layer_role_index );
                       if ( _layer != null )
                       {
                          _tmp_canvas = $( "#" + _layer.get_idcanvas() ).get(0);
                          if ( is_html_canvas( _tmp_canvas ) ) circles_lib_canvas_clean( _tmp_canvas, _layer.get_backgroundcolor(), _out_channel );
                       }
                    } );
        }
        else
        {
           circles_lib_canvas_clean( _grid_canvas, "", _out_channel );
           circles_lib_canvas_clean( _rendering_canvas, "", _out_channel );
           circles_lib_canvas_clean( _freedraw_canvas, "", _out_channel );
           circles_lib_canvas_clean( _work_canvas, "", _out_channel );
        }
    }

    if ( _b_render_bk ) circles_lib_canvas_layer_pile_init( Z_PLANE, _b_clean, NO );

    circles_lib_recalc_screen_disks_coords( _mapper );
      
    var _length = safe_size( _glob_zplane_layers_pile_role_array, 0 );
    var _layers_array = _selected_layers_array != null ? _selected_layers_array : _glob_zplane_layers_pile_role_array ;

    if ( _b_render_bk )
    {
        circles_lib_canvas_layer_pile_clean_per_plane( Z_PLANE, UNDET, _silent, _out_channel );
        circles_lib_canvas_layer_pile_reset( Z_PLANE, _b_clean, NO );
    }

    switch( _glob_export_format )
    {
        case EXPORT_SVG:
        if ( _glob_svg_open == 0 ) _glob_export_code_array = [];
        var _w = _canvas.get_width(), _h = _canvas.get_height();
        _svg_open( _glob_export_code_array, _w, _h, "Z-plane", _canvas );
        _svg_comment( _glob_export_code_array, "Exporting the Z-plane" );
        break ;
        case EXPORT_PS:
        if ( _glob_e_ps_open == 0 ) _glob_js_e_ps_obj.init( _glob_e_ps_language_level, NO, "", 0, 0, _canvas.get_width(), _canvas.get_height(), "Exporting the Z-plane", YES );
        break ;
        case EXPORT_EPS:
        if ( _glob_e_ps_open == 0 ) _glob_js_e_ps_obj.init( _glob_e_ps_language_level, YES, "", 0, 0, _canvas.get_width(), _canvas.get_height(), "Exporting the Z-plane", YES );
        break ;
        case EXPORT_LATEX:
        if ( _glob_latex_open == 0 ) _glob_js_latex_obj.init( _canvas.get_width(), _canvas.get_height(), _glob_latex_options, YES, YES, "Exporting the Z-plane" );
        break ;
        case EXPORT_NONE: default: break ;
    }

    var _layer_role_index ;
    for( var _i = 0 ; _i < _length ; _i++ )
    {
        _layer_role_index = safe_int( _layers_array[_i], 0 );
        switch( _layer_role_index )
        {
            case ROLE_GRID: // grid
            if ( _glob_show_grid_zplane && ( _glob_zplane_grid_canvas_placeholder.is_visible() || is_html_canvas( _grid_canvas ) ) )
            circles_lib_grid_draw( _grid_canvas, _mapper, Z_PLANE, YES, _glob_ticks_count, _out_channel );
            break ;
            case ROLE_RENDERING: // rendering
            if ( _b_rendering && ( _glob_zplane_rendering_canvas_placeholder.is_visible() || is_html_canvas( _rendering_canvas ) ) )
            circles_lib_draw_all_complex_disks( _rendering_canvas.getContext( _glob_canvas_ctx_2D_mode ), _mapper, _glob_zplane_selected_items_array, NO, _silent, _out_channel );
            break ;
            case ROLE_FREEDRAW: // free draw
            if ( _glob_zplane_freedraw_canvas_placeholder.is_visible() || is_html_canvas( _freedraw_canvas ) )
            {

            }
            break ;
            case ROLE_WORK: // work
            if ( _glob_zplane_work_canvas_placeholder.is_visible() || is_html_canvas( _work_canvas ) )
						{
                if ( _glob_show_symbols_zplane ) circles_lib_symbol_zplane_display( null, _work_canvas, null, NO, NO, YES, _out_channel );
                circles_lib_canvas_after_process_figures( null, NO, Z_PLANE );
						}
            break ;
		        default: break ;
        }
   }

   switch( _glob_export_format )
   {
       case EXPORT_SVG:
       _svg_close( _glob_export_code_array );
       break ;
       case EXPORT_PS:
       case EXPORT_EPS:
       if ( _glob_e_ps_open == 1 ) _glob_js_e_ps_obj.close();
       break ;
       case EXPORT_LATEX:
       if ( _glob_latex_open == 1 ) _glob_js_latex_obj.close();
       break ;
       case EXPORT_NONE: default: break ;
   }

   if ( _items_n > 0 && circles_lib_plugin_is_visible( "general.options", "forms" ) )
   {
      if ( CIRCLESformsGENERALOPTIONStabindex == 2 )
      {
         if($('#POPUPgeneraloptionsDIV').resizable('instance')!=undefined) $('#POPUPgeneraloptionsDIV').resizable('destroy');
         circles_lib_plugin_load('forms','general.options',NO,2);
      }
   }

   return [ RET_OK, "Z-plane rendered with success" ] ;
}

function circles_lib_canvas_render_wplane( _canvas, _mapper, _selected_layers_array, _b_clean, _b_render_bk, _b_rendering, _b_init_items, _question, _silent, _out_channel )
{
		circles_lib_menu_entries_update() ;
		if ( _glob_interface_index == INTERFACE_EXTEND_ZPLANE ) return [ RET_IRRELEVANT, "W-plane rendering skipped for extended interface" ] ;
    // layers can be input as an array or a string of indexes separated by comma
    _selected_layers_array = ( is_array( _selected_layers_array ) || _selected_layers_array == null ) ? _selected_layers_array : ( _selected_layers_array.includes( "," ) ? _selected_layers_array.split( "," ) : _selected_layers_array );
    if ( safe_size( _selected_layers_array, 0 ) == 0 ) _selected_layers_array = null ;

    _b_clean = safe_int( _b_clean, NO );
    _b_render_bk = safe_int( _b_render_bk, YES ), _b_rendering = safe_int( _b_rendering, YES );
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _b_init_items = safe_int( _b_init_items, CHECK );
    if ( _b_init_items == CHECK ) _b_init_items = _glob_items_to_init ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );

    var _items_n = circles_lib_count_items();
    if ( _items_n == 0 ) _b_init_items = NO ;
    if ( !is_screen_mapper( _mapper ) )
    {
        _mapper = wplane_sm.copy() ;
        circles_lib_canvas_coords_acquire( W_PLANE ) ;
    }
    
    var _grid_canvas = null, _rendering_canvas = null, _freedraw_canvas = null, _work_canvas = null ;
    _grid_canvas = is_html_canvas( _canvas ) ? _canvas : ( circles_lib_canvas_get_exists( W_PLANE, "grid" ) ? circles_lib_canvas_get_target( W_PLANE, "grid" ) : _glob_wplane_grid_canvas_placeholder ) ;
    _rendering_canvas = is_html_canvas( _canvas ) ? _canvas : ( circles_lib_canvas_get_exists( W_PLANE, "rendering" ) ? circles_lib_canvas_get_target( W_PLANE, "rendering" ) : _glob_wplane_rendering_canvas_placeholder ) ;
    _freedraw_canvas = is_html_canvas( _canvas ) ? _canvas : ( circles_lib_canvas_get_exists( W_PLANE, "freedraw" ) ? circles_lib_canvas_get_target( W_PLANE, "freedraw" ) : _glob_wplane_freedraw_canvas_placeholder ) ;
    _work_canvas = is_html_canvas( _canvas ) ? _canvas : ( circles_lib_canvas_get_exists( W_PLANE, "work" ) ? circles_lib_canvas_get_target( W_PLANE, "work" ) : _glob_wplane_work_canvas_placeholder ) ;

    if ( _glob_items_to_init && !_silent )
    {
        var _msg = "Can't draw the W-plane."+_glob_crlf+"Please, init gens first" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ] ;
    }

    _glob_apply_dashed_border = _glob_activate_dashed_border ;
    if ( _b_clean )
    {
        if ( !is_array( _selected_layers_array ) )
        {
            if ( _b_render_bk && _glob_wplane_grid_canvas_placeholder.is_visible() ) circles_lib_canvas_layer_pile_init( W_PLANE, _b_clean, NO );
            circles_lib_canvas_layer_pile_clean_per_plane( W_PLANE, UNDET, _silent, _out_channel );
            circles_lib_canvas_layer_pile_reset( W_PLANE );
        }

        if ( is_html_canvas( _canvas ) ) circles_lib_canvas_clean( _canvas, "", _out_channel );

        // in any case, it cleans the basic layers, cause they stand behind the depth layers pile
        if ( is_array( _selected_layers_array ) )
        {
        	  var _layer, _tmp_canvas ;
            $.each( _selected_layers_array,
                    function( _i, _layer_role_index )
                    {
                       _layer = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, _layer_role_index );
                       if ( _layer != null )
                       {
                         _tmp_canvas = $( "#" + _layer.get_idcanvas() ).get(0);
                         if ( is_html_canvas( _tmp_canvas ) ) circles_lib_canvas_clean( _tmp_canvas, _layer.get_backgroundcolor(), _out_channel );
                       }
                    } );
        }
    }

    var _w = _rendering_canvas.get_width(), _h = _rendering_canvas.get_height();
    var _desc = "W-plane | " + circles_lib_method_get_def( _glob_method ) + ( _glob_submethod_desc.length > 0 ? " | " + _glob_submethod_desc : "" )  ;
    var _base_canvas = null ;
    if ( _glob_show_grid_wplane && _glob_wplane_grid_canvas_placeholder.is_visible() ) _base_canvas = _grid_canvas ;
    if ( _base_canvas == null ) _base_canvas = _grid_canvas ;
    switch( _glob_export_format )
    {
       case EXPORT_SVG:
       if ( _glob_svg_open == 0 ) _glob_export_code_array = [];
       _svg_open( _glob_export_code_array, _w, _h, _desc, _base_canvas );
       _svg_comment( _glob_export_code_array, "Rendering " + circles_lib_plane_get_def( _base_canvas.get_type() ) );
       break ;
       case EXPORT_PS:
       if ( _glob_e_ps_open == 0 ) _glob_js_e_ps_obj.init( _glob_e_ps_language_level, NO, "", 0, 0, _w, _h, "Exporting the W-plane", YES );
       _glob_js_e_ps_obj.comment( _desc );
       _glob_js_e_ps_obj.comment( "Rendering " + circles_lib_plane_get_def( _base_canvas.get_type() ) );
       break ;
       case EXPORT_EPS:
       if ( _glob_e_ps_open == 0 ) _glob_js_e_ps_obj.init( _glob_e_ps_language_level, YES, "", 0, 0, _w, _h, "Exporting the W-plane", YES );
       _glob_js_e_ps_obj.comment( _desc );
       _glob_js_e_ps_obj.comment( "Rendering " + circles_lib_plane_get_def( _base_canvas.get_type() ) );
       break ;
       case EXPORT_LATEX:
       if ( _glob_latex_open == 0 ) _glob_js_latex_obj.init( _w, _h, _glob_latex_options, YES, YES, "Exporting the W-plane" );
       _glob_js_latex_obj.comment( _desc );
       _glob_js_latex_obj.comment( "Rendering " + circles_lib_plane_get_def( _base_canvas.get_type() ) );
       break ;
       case EXPORT_NONE: default: break ;
    }

    // drawing inside the layers
    var _layers_array = is_array( _selected_layers_array ) ? _selected_layers_array : _glob_wplane_layers_pile_role_array ;
    // Layers piling needs to works synchroniously, i.e. each layer must be rendered after the previous one.
    // But this requirement crashes against multi-threading, which runs asynchronously and then
    // while the latter runs, the layers piling would keep on going too.
    // Thus I split the layers piling into two parts: (a) one before the multi-threading, (b) one after the multi-threading.
    // Part (a) runs up to the multi-threading process included.
    // Part (b) runs after the multi-threading process is over and it is called
    // in circles_lib_canvas_after_process_main() function
      
    if ( !is_array( _layers_array ) )
    {
       _layers_array = [] ;
       var _l = safe_size( _glob_wplane_layers_pile_role_array, 0 ), _layer_role_index ;
       for( var _i = 0 ; _i < _l ; _i++ )
       {
           _layer_role_index = _glob_wplane_layers_pile_role_array[_i] ;
           if ( _layer_role_index != ROLE_RENDERING ) _layers_array.push( _layer_role_index );
       }
          
       _layers_array.push( ROLE_RENDERING );
    }

		if ( _b_init_items )
    {
        circles_lib_items_switch_to( circles_lib_gens_model_exists() ? ITEMS_SWITCH_GENS : ITEMS_SWITCH_SEEDS, _silent, _out_channel );
        var _ret_chunk = circles_lib_items_init( null, _question, _silent, _glob_init_mask, NO, YES, _out_channel );
        if ( _ret_chunk[0] != RET_OK )
        {
           circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
           return _ret_chunk ;
        }
    }

    var _length = safe_size( _layers_array, 0 ), _layer_role_index, _ret_chunk, _ret_id, _ret_msg ;
    for( var i = 0 ; i < _length ; i++ )
    {
        _layer_role_index = safe_int( _layers_array[i], 0 );
        switch( _layer_role_index )
        {
            case ROLE_GRID: // grid
            if ( _glob_show_grid_wplane && _glob_wplane_grid_canvas_placeholder.is_visible() )
 						circles_lib_grid_draw( _grid_canvas, _mapper, W_PLANE, YES, _glob_ticks_count, _out_channel );
            break ;
            case ROLE_RENDERING: // rendering
            if ( _b_rendering && _glob_wplane_rendering_canvas_placeholder.is_visible() )
            {
                _ret_chunk = circles_lib_canvas_render_process( _rendering_canvas, _mapper, W_PLANE, _silent, _out_channel );
                circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, _silent, _out_channel );
                _ret_id = ( is_array( _ret_chunk ) || _ret_chunk == UNDEF ) ? safe_int( _ret_chunk[0], 0 ) : 0 ;
                _ret_msg = ( is_array( _ret_chunk ) || _ret_chunk == UNDEF ) ? _ret_chunk[1] : _ERR_00_00 ;
                if ( _ret_id == 0 )
                {
                   if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app_title );
                   return _ret_chunk ;
                }
            }
            break ;
            case ROLE_FREEDRAW: // freedraw layer
            if ( _glob_wplane_freedraw_canvas_placeholder.is_visible() )
            {

            }
            break ;
            case ROLE_WORK: // work layer
            if ( _glob_wplane_work_canvas_placeholder.is_visible() )
            {
                circles_lib_canvas_after_process_figures( null, NO, W_PLANE );
            }
            break ;
		        default: break ;
        }
    }

   return [ RET_OK, "W-plane rendered with success" ] ;
}

function circles_lib_canvas_render_bipbox( _plane_type, _selected_layers_array, _b_clean, _b_render_bk, _b_rendering, _b_init_items, _question, _silent, _out_channel )
{
		circles_lib_menu_entries_update() ;
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    // layers can be input as an array or a string of indexes separated by comma
    _selected_layers_array = ( is_array( _selected_layers_array ) || _selected_layers_array == null ) ? _selected_layers_array : ( _selected_layers_array.includes( "," ) ? _selected_layers_array.split( "," ) : _selected_layers_array );
    if ( safe_size( _selected_layers_array, 0 ) == 0 ) _selected_layers_array = null ;

    _b_clean = safe_int( _b_clean, YES ), _b_init_items = safe_int( _b_init_items, CHECK );
    if ( _b_init_items == CHECK ) _b_init_items = _glob_items_to_init ;
    _b_render_bk = safe_int( _b_render_bk, YES ), _b_rendering = safe_int( _b_rendering, YES );
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, YES );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );

    if ( !_plane_type.is_one_of( Z_PLANE, W_PLANE ) ) return [ RET_ERROR, "Unknown source plane" ] ;

    var _canvas = _glob_bip_canvas, _mapper = bipbox_sm.copy() ;
    var bip_left_up_pt = new point( _glob_bipLEFT, _glob_bipTOP );
    var bip_right_down_pt = new point( _glob_bipRIGHT, _glob_bipBOTTOM );
    _mapper.set_coords_corners( bip_left_up_pt, bip_right_down_pt );

    _glob_apply_dashed_border = _glob_bip_original_plane_data == Z_PLANE ? YES : _glob_activate_dashed_border ;

    var _plane_def = circles_lib_plane_get_def( _plane_type );
    var _w = _canvas.get_width(), _h = _canvas.get_height();
    var _label = "Exporting " + _plane_def ;
    switch( _glob_export_format )
    {
        case EXPORT_SVG:
        if ( _glob_svg_open == 0 ) _glob_export_code_array = [];
        _svg_open( _glob_export_code_array, _w, _h, _plane_def + "|" + _plane_def, _canvas );
        _svg_comment( _glob_export_code_array, _label );
        break ;
        case EXPORT_PS:
        if ( _glob_e_ps_open == 0 ) _glob_js_e_ps_obj.init( _glob_e_ps_language_level, NO, "", 0, 0, _w, _h, YES );
        _glob_js_e_ps_obj.comment( _label );
        break ;
        case EXPORT_EPS:
        if ( _glob_e_ps_open == 0 ) _glob_js_e_ps_obj.init( _glob_e_ps_language_level, YES, "", 0, 0, _w, _h, YES );
        _glob_js_e_ps_obj.comment( _label );
        break ;
        case EXPORT_LATEX:
        if ( _glob_latex_open == 0 ) _glob_js_latex_obj.init( _w, _h, _glob_latex_options, YES, YES, "" );
        _glob_js_latex_obj.comment( _label );
        break ;
        case EXPORT_NONE: default: break ;
    }

    if ( _b_clean ) circles_lib_canvas_clean( _glob_bip_canvas, _glob_bip_canvas.get_backgroundcolor(), _out_channel );
    if ( _plane_type == Z_PLANE )
    {
        if ( safe_size( _glob_seeds_array, 0 ) > 0 ) circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, _silent, _out_channel );
        circles_lib_recalc_screen_disks_coords( _mapper );
        var _length = safe_size( _glob_zplane_layers_pile_role_array, 0 );
        var _layers_array = _glob_zplane_layers_pile_role_array ;
        var _layer_role_index ;
        for( var _i = 0 ; _i < _length ; _i++ )
        {
            _layer_role_index = safe_int( _layers_array[_i], 0 );
            switch( _layer_role_index )
            {
                case ROLE_GRID: // grid
                if ( _glob_show_grid_zplane )
                circles_lib_grid_draw( _canvas, _mapper, Z_PLANE, YES, _glob_ticks_count, _out_channel );
                break ;
                case ROLE_RENDERING: // rendering
                if ( _b_rendering && _glob_zplane_rendering_canvas_placeholder.is_visible() )
                circles_lib_draw_all_complex_disks( _canvas.getContext( _glob_canvas_ctx_2D_mode ), _mapper, _glob_zplane_selected_items_array, NO, _silent, _out_channel );
                break ;
                case ROLE_FREEDRAW: // free draw
                if ( _glob_zplane_freedraw_canvas_placeholder.is_visible() )
                {

                }
                break ;
                case ROLE_WORK: // work
                if ( _glob_zplane_work_canvas_placeholder.is_visible() )
    						{
    						}
                break ;
				        default: break ;
            }
        }
    }
    else if ( _plane_type == W_PLANE )
    {
        var _layer_role_index ;
        if ( !is_array( _selected_layers_array ) )
        {
            _layers_array = [] ;
            var _l = safe_size( _glob_wplane_layers_pile_role_array, 0 );
            for( var _i = 0 ; _i < _l ; _i++ )
            {
                 _layer_role_index = _glob_wplane_layers_pile_role_array[_i] ;
                 if ( _layer_role_index != ROLE_RENDERING ) _layers_array.push( _layer_role_index );
                 else break ;
            }

            _layers_array.push( ROLE_RENDERING );
        }

        if ( _b_init_items )
        {
            circles_lib_items_switch_to( circles_lib_gens_model_exists() ? ITEMS_SWITCH_GENS : ITEMS_SWITCH_SEEDS, _silent, _out_channel );
            var _ret_chunk = circles_lib_items_init( null, _question, _silent, _glob_init_mask, NO, YES, _out_channel );
            if ( _ret_chunk[0] != RET_OK )
            {
               circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
               return _ret_chunk ;
            }
        }

        var _length = safe_size( _layers_array, 0 ), _ret_chunk, _ret_id, _ret_msg ;
        for( var i = 0 ; i < _length ; i++ )
        {
             _layer_role_index = safe_int( _layers_array[i], 0 );
             switch( _layer_role_index )
             {
                  case 1: // grid
                  if ( _glob_show_grid_wplane && _glob_wplane_grid_canvas_placeholder.is_visible() )
                  circles_lib_grid_draw( _canvas, _mapper, BIP_BOX, YES, _glob_ticks_count, _out_channel );
                  break ;
                  case 2: // rendering
                  if ( _b_rendering && _glob_wplane_rendering_canvas_placeholder.is_visible() )
                  {
                      _ret_chunk = circles_lib_canvas_render_process( _canvas, _mapper, BIP_BOX, _silent, _out_channel );
                      _ret_id = ( is_array( _ret_chunk ) || _ret_chunk == UNDEF ) ? safe_int( _ret_chunk[0], 0 ) : 0 ;
                      _ret_msg = ( is_array( _ret_chunk ) || _ret_chunk == UNDEF ) ? _ret_chunk[1] : _ERR_00_00 ;
                      if ( _ret_id == 0 )
                      {
                          if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app_title );
                          return _ret_chunk ;
                      }
                  }
                  break ;
                  case 3: // freedraw layer
                  if ( _glob_wplane_freedraw_canvas_placeholder.is_visible() )
                  {

                  }
                  break ;
                  case 4: // work layer
                  if ( _glob_wplane_work_canvas_placeholder.is_visible() )
                  {
                       // for further developments
                  }
                  break ;
					        default: break ;
             }
        }
    }

    return [ RET_OK, "BIP box rendered with success" ] ;
}