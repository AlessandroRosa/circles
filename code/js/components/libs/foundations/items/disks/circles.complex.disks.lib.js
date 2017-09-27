function circles_lib_get_complexdisk_from_screen( _mapper, _screen_circle )
{
    if ( !is_screen_mapper( _mapper ) || !is_circle( _screen_circle ) ) return null ;
		var _radius_pt = new point( _screen_circle.center.x + _screen_circle.radius, _screen_circle.center.y );
    var complex_center_pt = _mapper.from_client_to_cartesian( _screen_circle.center.x, _screen_circle.center.y );
    var complex_radius_pt = _mapper.from_client_to_cartesian( _radius_pt.x, _radius_pt.y );
    var complex_radius = Math.abs( complex_center_pt.x - complex_radius_pt.x );
    return new circle( complex_center_pt, complex_radius, _screen_circle.draw, _screen_circle.fill, _screen_circle.drawcolor, _screen_circle.fillcolor, _screen_circle.linewidth, _screen_circle.notes );
}

function circles_lib_complexdisk_move_tangency( _items_array, _index1, _index2, _out_channel )
{
    if ( !is_array( _items_array ) )
    _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;

		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _index1 = safe_int( _index1, UNDET ), _index2 = safe_int( _index2, UNDET );
    var alwayexternal = $("#CORRECTtangencyCHECKBOX1").prop( "checked" ) ? YES : NO ;
    var MM_1 = _items_array[_index1], MM_2 = _items_array[_index2] ;
    var C1 = is_item_obj( MM_1 ) ? MM_1.complex_circle : null ;
    var C2 = is_item_obj( MM_2 ) ? MM_2.complex_circle : null ;
    if ( !_test ) return [ RET_ERROR, "Invalid input items container", UNDET ] ;
    else if ( is_circle( C1 ) && is_circle( C2 ) )
    {
        if ( C1.center.x > C2.center.x )
        {
          [ _items_array[_index1], _items_array[_index2] ] = [ _items_array[_index2], _items_array[_index1] ] ;
          [ C1, C2 ] = [ C2, C1 ] ;
        }

        var _corrected_circle1 = circle_move_to_tangency( C1, C2, alwayexternal );
        if ( is_circle( _corrected_circle1 ) )
        {
          _items_array[_index1].complex_circle = _corrected_circle1 ;
          var _ret_chunk = null ;
          if ( circles_lib_method_check() )
          {
             _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, NO, YES, _out_channel );
             if ( _ret_chunk[0] != RET_OK ) circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
          }

          _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _out_channel );
          if ( _ret_chunk[0] != RET_OK )
          {
             circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
             return NO ;
          }
          return YES ;
        }
        else return NO ;
    }
    else return NO ;
}

function circles_lib_complexdisk_resize_tangency( _items_array, _index1, _index2, _out_channel )
{
    if ( !is_array( _items_array ) )
    _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;

		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _index1 = safe_int( _index1, UNDET ), _index2 = safe_int( _index2, UNDET );
    var alwayexternal = $("#CORRECTtangencyCHECKBOX1").prop( "checked" ) ? YES : NO ;
    var MM_1 = _items_array[_index1], MM_2 = _items_array[_index2] ;
    var C1 = is_item_obj( MM_1 ) ? MM_1.complex_circle : null ;
    var C2 = is_item_obj( MM_2 ) ? MM_2.complex_circle : null ;
    if ( !_test ) return [ RET_ERROR, "Invalid input items container", UNDET ] ;
    else if ( is_circle( C1 ) && is_circle( C2 ) )
    {
        if ( C1.center.x > C2.center.x )
        {
          [ _items_array[_index1], _items_array[_index2] ] = [ _items_array[_index2], _items_array[_index1] ] ;
          [ C1, C2 ] = [ C2, C1 ] ;
        }

        var _corrected_circle1 = circle_resize_to_tangency( C1, C2, alwayexternal );
        if ( is_circle( _corrected_circle1 ) )
        {
          _items_array[_index1].complex_circle = _corrected_circle1 ;
          var _ret_chunk = null ;
          if ( circles_lib_method_check() )
          {
             _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, NO, YES, _out_channel );
             if ( _ret_chunk[0] != RET_OK ) circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
          }

          _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _out_channel );
          if ( _ret_chunk[0] != RET_OK )
          {
             circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
             return NO ;
          }
          return YES ;
        }
        else return NO ;
    }
    else return NO ;
}

function circles_lib_complexdisk_remove_all( _items_array, _question, _silent, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
   	_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    var _items_n = circles_lib_count_items();
    if ( !_test ) return [ RET_ERROR, "Invalid input items container", UNDET ] ;
    else if ( _items_n > 0 )
    {
       var _b_go = !_question ? YES : confirm( _QUESTION_05 );
       if ( _b_go )
       {
           _items_array.flush();
           var _ret_chunk_zplane= circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _out_channel );
           var _ret_chunk_wplane = circles_lib_canvas_render_wplane( null, wplane_sm, null, YES, YES, YES, YES, NO, YES, _out_channel );
           var _ret_chunk_zplane = circles_lib_coordinates_reset_core( Z_PLANE, YES, _question, _silent, _out_channel );
           var _ret_chunk_wplane = circles_lib_coordinates_reset_core( W_PLANE, YES, _question, _silent, _out_channel );
           var _ret_chunk_bip = circles_lib_coordinates_reset_core( BIP_BOX, YES, _question, _silent, _out_channel );
           var _ret_id = _ret_chunk_zplane[0] & _ret_chunk_wplane[0] & _ret_chunk_bip[0] ;
           if ( _ret_id )
           {
              circles_lib_reset_coords();
              if ( _out_channel == OUTPUT_SCREEN ) circles_lib_plugin_dispatcher_multicast_message( POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL );
              _glob_disk_sel_index = UNDET, _glob_items_to_init = NO ;
              $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
              var _msg = "All disks have been removed with success" ;
              if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
              return [ RET_OK, _msg ];
           }
           else
           {
              var _msg = "Problems in coords reset while removing the disks" ;
              if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
              return [ RET_ERROR, _msg ];
           }
       }
    }
    else
    {
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Missing input circles to remove", _glob_app_title );
        return [ RET_ERROR, "Missing input circles to remove" ];
    }
}

function circles_lib_complexdisk_select_all( _out_channel )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _items_n = circles_lib_count_items();
    _glob_zplane_selected_items_array.flush();
    circles_lib_helper_div_remove();
    for( var _i = 0 ; _i < _items_n ; _i++ ) _glob_zplane_selected_items_array.push( _i );
    circles_lib_canvas_clean( _glob_zplane_rendering_canvas_placeholder );
    return circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _out_channel );
}

function circles_lib_complexdisk_shift( where, _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    where = safe_string( where, "" ).toLowerCase();
    var left = _glob_zplaneLEFT, right = _glob_zplaneRIGHT ;
    var up = _glob_zplaneTOP, down = _glob_zplaneBOTTOM ;
    var dX = right - left , dY = up - down, factor = Math.pow( 2, 6 );
    var center_x = safe_float( $("#CIRCLEselectedCENTERx").val(), 0.0 );
    var center_y = safe_float( $("#CIRCLEselectedCENTERy").val(), 0.0 );
    if ( dX != 0 && dY != 0 )
    {
       switch( where.toLowerCase() )
       {
          case "left" : center_x -= dX / factor ; break ;
          case "right" : center_x += dX / factor ; break ;
          case "up" : center_y += dY / factor ; break ;
          case "down" : center_y -= dY / factor ; break ;
          default: return NO ; break ;
       }

       $("#CIRCLEselectedCENTERx").val( center_x ), $("#CIRCLEselectedCENTERy").val( center_y );
       _glob_to_save = YES;
    }
    return YES ;
}

function circles_lib_complexdisk_addfrom_screendisk( X, Y, RADIUS, _out_channel )
{
    X = safe_int( X, 0 ), Y = safe_int( Y, 0 ), RADIUS = safe_int( RADIUS, 0 ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var screen_pt = new point( X, Y ), screen_pt_radius = new point( X + RADIUS, Y );
    var pt = zplane_sm.from_client_to_cartesian( screen_pt.x, screen_pt.y );
    var pt_radius = zplane_sm.from_client_to_cartesian( screen_pt_radius.x, screen_pt_radius.y );
    var _complex_radius = Math.abs( pt.x - pt_radius.x );
    var _complex_circle = new circle( pt, _complex_radius );
    var _mm = circles_lib_items_create_from_disk( null, _complex_circle );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    _items_array.push( new item_obj( _mm, _complex_circle, null, "", 0, YES, _glob_draw_seed_color, NO, _glob_fill_seed_color,
                                     "", 1, ITEM_TYPE_CIRCLE ) );

    var LASTindex = circles_lib_count_items() - 1, _ret_chunk ;
    _glob_disk_sel_index = LASTindex = safe_int( LASTindex, UNDET );
    _glob_zplane_selected_items_array.flush();
    _glob_zplane_selected_items_array.push( LASTindex );
    circles_lib_helper_div_remove();
    $('[id$=initBTN]').css('color',COLOR_ERROR) ;
    if ( circles_lib_method_check() )
    {
		    _glob_items_to_init = YES ;
				_ret_chunk = circles_lib_items_init( ITEMindex, NO, YES, _glob_init_mask, NO, YES, _out_channel );
        if ( _ret_chunk[0] != RET_OK )
        {
           circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
           return NO ;
        }
		}
    circles_lib_alphabet_autoconfig_all_symbols( NO, YES, NO, YES, _out_channel );

    if ( circles_lib_count_items() > 0 )
    {
       _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _out_channel);
       if ( _ret_chunk[0] != RET_OK )
       {
          circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
          return NO ;
       }
    }

    return YES ;
}

function circles_lib_complexdisk_find_index_from_pt( _pt )
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items(_items_array), _sel_index = UNDET ;
    if ( _items_n > 0 && check_data_type( _pt, "point" ) )
    {
        var _min_dist = 0, _cc, _dist = 0 ;
        for( var _i = 0 ; _i < _items_n ; _i++ )
        {
           _cc = _items_array[_i].complex_circle ;
           _dist = is_circle( _cc ) ? _pt.distance( _cc.center ) : UNDET ;
           if ( _dist <= _cc.radius && ( ( _min_dist == 0 && _sel_index == UNDET ) || _dist < _min_dist ) )
           {
              _min_dist = _dist ;
              _sel_index = _i ;
           }
        }
    }
    
		return _sel_index ;
}

function circles_lib_complexdisk_update( _items_array, _screen_circle, _index, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _index = safe_int( _index, UNDET ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    if ( !_test ) return [ RET_ERROR, "Invalid input items container", UNDET ] ;
    else if ( _index == UNDET ) return [ RET_ERROR, "Missing disk index reference" ] ;
    else
    {
       if ( !is_circle( _screen_circle ) ) _screen_circle = new circle( new point( 0, 0 ), 0 );
       var _linewidth = safe_int( _screen_circle.linewidth, 0 );
       var _complex_circle = circles_lib_get_complexdisk_from_screen( zplane_sm, _screen_circle );
       _items_array[_index] = circles_lib_items_create_from_disk( _index, _complex_circle, _screen_circle );
       _glob_items_to_init = YES ;
       $('[id$=initBTN]').css('color',COLOR_ERROR) ;
       return [ RET_OK, "Disk has been updated with success" ] ;
    }
}

function circles_lib_complexdisk_add( _items_array, _complex_circle, _symbol, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _b_add = YES, _sd_n = circles_lib_count_items( _items_array ), ITEM ;
    var _test = _sd_n > 0 ? _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) : YES ;
    if ( !is_circle( _complex_circle ) ) _complex_circle = new circle( new point( 0, 0 ), 0 );
    _symbol = safe_string( _symbol, "" ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    if ( !_test ) return [ RET_ERROR, "Invalid input items container", UNDET ] ;
    else if ( _sd_n == 0 ) _b_add = YES ;
    else if ( _sd_n > 0 )
    {
       for( var _i = 0 ; _i < _sd_n ; _i++ )
       {
          ITEM = _items_array[ _i ] ;
          if ( !is_item_obj( ITEM ) )
          {
             _b_add = NO ;
             break ;
          }
                
          if ( is_circle( ITEM.complex_circle ) )
          {
             if ( ITEM.complex_circle.is_equal_to( _complex_circle ) )
             {
                _b_add = NO ;
                break ;
             }
          }
       }
    }
    
    if ( _b_add )
    {
       var _screen_circle = circles_lib_get_screendisk_from_complexdisk( zplane_sm, _complex_circle );
       var _item_new = circles_lib_items_create_from_disk( UNDET, _complex_circle, _screen_circle ) ;
       if ( !is_item_obj( _item_new ) ) return [ RET_ERROR, "Invalid input complex disk: can't register seed", UNDET ] ;
       _items_array.push( _item_new );
       var _new_sd_n = circles_lib_count_items( _items_array );
       var _last_index = _new_sd_n == _sd_n + 1 ? _new_sd_n - 1 : UNDET ;
       if ( _last_index == UNDET ) return [ RET_ERROR, "Memory failure while trying to add a new complex disk.", UNDET ] ;
       else
       {
          _items_array[_last_index].original_word = _items_array[_last_index].symbol = _symbol.length > 0 ? _symbol.trim() : "" ;
          _items_array[_last_index].item_type = ITEM_TYPE_CIRCLE ;
          _items_array[_last_index].complex_circle.linewidth = 1 ;
          _glob_items_to_init = YES ;
          $('[id$=initBTN]').css('color',COLOR_ERROR) ;
          return [ RET_OK, "A new disk has been added with success", _last_index ] ;
       }
    }
    else return [ RET_ERROR, "There exists already another disk with same coordinates.", UNDET ] ;
}

function circles_lib_complexdisk_remove( _items_array, _question, _silent, _force_output, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
   	_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _force_output = safe_int( _force_output, NO ), _item_type = safe_int( _item_type, ITEMS_SWITCH_SEEDS );
    _out_channel = _force_output ? OUTPUT_SCREEN : safe_int( _out_channel, OUTPUT_SCREEN );
    var _i = safe_int( _glob_disk_sel_index, UNDET );
    if ( !_test ) return [ RET_ERROR, "Invalid input items container", UNDET ] ;
    else if ( circles_lib_count_seeds() == 0 )
    {
    	 var _msg = "The figures list is empty" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ];
    }
    else if ( _i == UNDET )
    {
    	 var _msg = "Select (double click on) a circle for deletion" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ];
    }
    else
    {
       var _msg = _QUESTION_06 + _glob_crlf + "This operation is irreversible and items can't be resumed" ;
       if ( !_question ? YES : confirm( _msg ) )
       {
          var _removed_symbols_array = [], _ret_chunk ;
          var _remove_inverse = _glob_method.is_one_of( METHOD_ALGEBRAIC ) ? YES : NO ;
          var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
          var _n_disks_before = circles_lib_count_items( _items_array );
          var _symbol = safe_string( _items_array[_i].symbol, "" ), _inv_symbol = circles_lib_word_inverse_get( _symbol );

          if ( _items_array[_i] != null )
          {
             _removed_symbols_array.push( _symbol );
             _items_array.remove( _i, _i );
          }
          _i = circles_lib_find_item_index_by_symbol( _glob_items_switch, _symbol );
          if ( is_item_obj( _items_array[_i] ) ) _glob_items_switch.remove( _i, _i );

          if ( _remove_inverse )
          {
                 var _inv_map_index = circles_lib_find_item_index_by_symbol( _items_array, _inv_symbol );
                 if ( _items_array[_inv_map_index] != null )
                 {
                     _removed_symbols_array.push( _inv_symbol );
                     _items_array.remove( _inv_map_index, _inv_map_index );
                 }
                 
                 _inv_map_index = circles_lib_find_item_index_by_symbol( _items_array, _inv_symbol );
                 if ( is_item_obj( _items_array[_inv_map_index] ) ) _items_array.remove( _inv_map_index, _inv_map_index );
          }

          _glob_items_to_init = YES ;
          var _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, NO, YES, _out_channel );
          if ( _ret_chunk[0] != RET_OK )
          {
             circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
             return _ret_chunk ;
          }
          circles_lib_items_switch_to( _item_type, YES, _out_channel );
          _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
          _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _out_channel );
          if ( _ret_chunk[0] != RET_OK )
          {
             circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
             return _ret_chunk ;
          }
          var _n_disks_after = circles_lib_count_items( _items_array ) ;
          var _last_index = _n_disks_after - 1 ;
          if ( _last_index >= 0 && _out_channel == OUTPUT_SCREEN )
          {
             if ( circles_lib_plugin_find_index( { base_id : 'edit.disk' }, POPUP_SEARCH_BY_BASE_ID ) != UNFOUND )
             circles_lib_plugin_dispatcher_unicast_message( 'edit.disk', "forms", POPUP_DISPATCHER_UNICAST_EVENT_UPDATE );
          }
          else if ( _n_disks == 0 ) circles_lib_plugin_activate( NO, "edit.disk", "", "", "forms", CLOSE, "POPUPeditdiskDIV", "" );

          var _success = _n_disks_before > _n_disks_after ? YES : NO ;
          var _n_removed = safe_size( _removed_symbols_array, 0 ), _msg = "" ;
          if ( _remove_inverse ) _msg += "Detected pairing circles method." + _glob_crlf ;
          if ( _success )
          {
						 $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
						 _msg += "Disk"+( _n_removed == 1 ? "" : "s" )+" '"+_removed_symbols_array.join( ", " )+"' "+( _n_removed == 1 ? "has" : "have" )+" been removed with success from " + ( _item_type == ITEMS_SWITCH_SEEDS ? "Seeds" : "Gens" );
					}
					else _msg += "Can't remove disk"+( _n_removed == 1 ? "" : "s" )+" '"+_removed_symbols_array.join( ", " )+"'" ;
          if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, _success ? DISPATCH_SUCCESS : DISPATCH_ERROR, _msg, _glob_app_title );
          return [ _success ? RET_OK : RET_ERROR, _msg ];
       }
    }
}