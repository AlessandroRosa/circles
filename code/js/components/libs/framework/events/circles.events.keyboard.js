function circles_lib_display_key_status()
{
		$("#STATUSBARaltKEY").html( _glob_alt_key ? "Alt" : "" );
		$("#STATUSBARctrlKEY").html( _glob_ctrl_key ? "Ctrl" : "" );
		$("#STATUSBARshiftKEY").html( _glob_shift_key ? "Shf" : "" );
}

function circles_lib_events_body_keyup( _event, _param1, _param2 ) // user releases a key
{
    if ( ( _glob_wnd_onkeyup_event_halt || !_glob_app_run ) && !( _event.keyCode.is_one_of( 116 ) ) /*allowed : F5*/ )
    {
        _event.preventDefault();
        return NO ;
    }

    var _body_obj_ref = _param1 ;
  	var _alt_pressed = _event.altKey ;
    var _del_pressed = _event.keyCode == 8 ? YES : NO ;
    var _canc_pressed = _event.keyCode == 46 ? YES : NO ;
	  var _ctrl_pressed = _event.ctrlKey ;
    var _esc_pressed = _event.keyCode == 27 ? YES : NO ;
		var _shift_pressed = _event.shiftKey ;
    var _return_pressed = _event.keyCode == 13 ? YES : NO ;

    _glob_alt_key = _alt_pressed ? YES : NO ;
    _glob_canc_key = _canc_pressed ? YES : NO ;
    _glob_ctrl_key = _ctrl_pressed ? YES : NO ;
    _glob_esc_key = _esc_pressed ? YES : NO ;
    _glob_shift_key = _shift_pressed ? YES : NO ;

    circles_lib_display_key_status();
    var _sel_length = _glob_zplane_selected_items_array.length ;

		if ( _esc_pressed ) // esc released
		{
		  	if ( ALERT_CURRENT_DISPLAY_FLAG ) alertCLOSE();
		}

    if ( !_ctrl_pressed && !_return_pressed ) // ctrl released
    {
        $("body").css('cursor', "default");
        _glob_zplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID ;
        circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
        circles_lib_statusbar_update_elements();

        if ( safe_size( _glob_zplane_selected_items_array, 0 ) > 0 )
        {
            var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    				for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
            {
                if ( is_circle( _items_array[ _i ].screen_circle ) )
        		    circles_lib_complexdisk_update( ITEMS_SWITCH_SEEDS, _items_array[ _i ].screen_circle, _i );
            }
        }

        _glob_items_to_init = YES ;
        $('[id$=initBTN]').css('color',COLOR_ERROR) ;
   			if ( _glob_show_symbols_zplane ) circles_lib_symbol_zplane_display(null,null,null,NO);
    }

    if ( !_shift_pressed && !_canc_pressed && !_glob_alt_key ) // shift released
    {
         if ( _glob_zplane_selected_items_array.length > 0 && _glob_disk_sel_locked )
		     {
		          if ( _glob_worker_lock )
              {
                  var _msg = "<table>" ;
                      _msg += "<tr><td>"+CIRCLES_WARNING_LABEL_02+"</td></tr>" ;
                      _msg += "<tr><td CLASS=\"link\" ONCLICK=\"javascript:_glob_process_running_flag=NO;CIRCLESmultithreadingPOSTMESSAGEworker( 'stop' );_glob_to_save=NO;\">Click here to force process to stop</td></tr>" ;
                      _msg += "<table>" ;
                  circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, _msg, _glob_app );
              }
         }
		     else
		     {
							var _screen_circle = null;
              if ( safe_size( _glob_zplane_selected_items_array, 0 ) > 0 )
              {
                    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
      							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
      							{
      									_screen_circle = _items_array[ _i ].screen_circle ;
      						    	circles_lib_complexdisk_update( ITEMS_SWITCH_SEEDS, _screen_circle, _i );
      							}
              }

				    	_glob_disk_sel_index = UNDET ;
				      _glob_disk_sel_locked = NO ;
				      _glob_zplane_selected_items_array.flush();
				    	_glob_screencircles_sel_array.flush();
				    	_glob_zplaneMOUSEleftBTNstatus = OFF ;
				    	_glob_zplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID ;
              if ( _glob_app_run && circles_lib_count_seeds() > 0 && _sel_length > 0 )
              {
                  var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, OUTPUT_SCRIPT_EDITOR );
                  circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
                  circles_lib_statusbar_update_elements();
              }
				 }
		}
		      
		if ( _canc_pressed && safe_size( _glob_zplane_selected_items_array, 0 ) > 0 )
		{
		      var _n_disks = safe_size( _glob_zplane_selected_items_array, 0 );
					var _question = "Confirm to remove the selected disk"+( _n_disks != 1 ? "s" : "" )+"? " ;
              _question += _glob_crlf + "This operation is irreversible and items can't be resumed" ;
		      if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
					else if ( confirm( _question ) )
		      {
              var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
              if ( _glob_zplane_rendering_canvas_placeholder.get_role_id() != ROLE_RENDERING )
		          _glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

              // gathering the hashtags of selected entries
              var _hashtags = [];
							for( var _i = 0 ; _i < _n_disks ; _i++ )
              {
                   if ( _items_array[ _glob_zplane_selected_items_array[_i] ] != null )
                   _hashtags.push( _items_array[ _glob_zplane_selected_items_array[_i] ].hashtag );
                   if ( _items_array[ _glob_zplane_selected_items_array[_i] ] != null )
                   _hashtags.push( _items_array[ _glob_zplane_selected_items_array[_i] ].hashtag );
              }

              _hashtags = _hashtags.unique();

							for( var _i = 0 ; _i < _items_array.length ; _i++ )
              if ( _hashtags.includes( _items_array[_i].hashtag ) ) _items_array.remove( _i, _i );

		          _glob_disk_sel_index = UNDET ;
		          _glob_zplane_selected_items_array.flush();
				    	_glob_screencircles_sel_array.flush();
		               
              circles_lib_helper_div_remove();
              circles_lib_draw_all_screen_disks( _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, _glob_zplane_selected_items_array, YES );
				 			if ( _glob_show_symbols_zplane ) circles_lib_symbol_zplane_display(null,null,null,NO);
              _glob_items_to_init = YES ;
		      }
		}

		if( _event.keyCode == 9 && _sel_length > 0 ) // tab key
		{
					if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
					else
					{
              var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
              if ( _glob_zplane_rendering_canvas_placeholder.get_role_id() != ROLE_RENDERING )
							_glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

				      _glob_disk_sel_index = ( _glob_disk_sel_index + 1 ) % _items_array.length ;
              circles_lib_draw_all_screen_disks( _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, _glob_zplane_selected_items_array, YES );
							_glob_zplane_grid_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_GRID );
				      circles_lib_grid_draw( _glob_zplane_grid_canvas_placeholder, zplane_sm, Z_PLANE, YES, _glob_ticks_count );
							if ( _glob_show_symbols_zplane ) circles_lib_symbol_zplane_display(null,null,null,NO);
					}
		}
		else if( _event.keyCode == 37 && _sel_length > 0 ) // left arrow key
		{
					if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
					else
					{
              var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
              if ( _glob_zplane_rendering_canvas_placeholder.get_role_id() != ROLE_RENDERING )
							_glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

							var _shift_x = Math.ceil( _glob_zplane_rendering_canvas_placeholder.get_width() / _glob_smpr );
							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
							_items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle.center.x -= _shift_x ;
				          
              circles_lib_draw_all_screen_disks( _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, _glob_zplane_selected_items_array, YES );

							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
				      circles_lib_complexdisk_update( ITEMS_SWITCH_SEEDS, _items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle, _glob_zplane_selected_items_array[_i] );

              _glob_seeds_array = _items_array.clone();

              _glob_items_to_init = YES, _glob_init_mask = circles_lib_items_verify_init_mask( INIT_FROM_DISKS );
              $('[id$=initBTN]').css('color',COLOR_ERROR) ;
							if ( _glob_show_symbols_zplane ) circles_lib_symbol_zplane_display(null,null,null,NO);
					}
		}
		else if( _event.keyCode == 39 && _sel_length > 0 ) // right arrow key
		{
					if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
					else
					{
              var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
              if ( _glob_zplane_rendering_canvas_placeholder.get_role_id() != ROLE_RENDERING )
							_glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

							var _shift_x = Math.ceil( _glob_zplane_rendering_canvas_placeholder.get_width() / _glob_smpr );
							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
							_items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle.center.x += _shift_x ;

				      circles_lib_draw_all_screen_disks( _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, _glob_zplane_selected_items_array, YES );

							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
				      circles_lib_complexdisk_update( ITEMS_SWITCH_SEEDS, _items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle, _glob_zplane_selected_items_array[_i] );

              _glob_seeds_array = _items_array.clone();

              _glob_items_to_init = YES, _glob_init_mask = circles_lib_items_verify_init_mask( INIT_FROM_DISKS );
              $('[id$=initBTN]').css('color',COLOR_ERROR) ;
							if ( _glob_show_symbols_zplane ) circles_lib_symbol_zplane_display(null,null,null,NO);
					}
		}
		else if( _event.keyCode == 38 && _sel_length > 0 ) // up arrow key
		{
					if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
					else
					{
              var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
              if ( _glob_zplane_rendering_canvas_placeholder.get_role_id() != ROLE_RENDERING )
							_glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

							var _shift_y = Math.ceil( _glob_zplane_rendering_canvas_placeholder.get_height() / _glob_smpr );
							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
							_items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle.center.y -= _shift_y ;

				      circles_lib_draw_all_screen_disks( _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, _glob_zplane_selected_items_array, YES );

							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
				      circles_lib_complexdisk_update( ITEMS_SWITCH_SEEDS, _items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle, _glob_zplane_selected_items_array[_i] );

              _glob_seeds_array = _items_array.clone();

              _glob_items_to_init = YES, _glob_init_mask = circles_lib_items_verify_init_mask( INIT_FROM_DISKS );
              $('[id$=initBTN]').css('color',COLOR_ERROR) ;
							if ( _glob_show_symbols_zplane ) circles_lib_symbol_zplane_display(null,null,null,NO);
					}
		}
		else if( _event.keyCode == 40 && _sel_length > 0 ) // down arrow key
		{
					if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
					else
					{
              var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
              if ( _glob_zplane_rendering_canvas_placeholder.get_role_id() != ROLE_RENDERING )
							_glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

							var _shift_y = Math.ceil( _glob_zplane_rendering_canvas_placeholder.get_height() / _glob_smpr );
							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
							_items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle.center.y += _shift_y ;

				      circles_lib_draw_all_screen_disks( _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, _glob_zplane_selected_items_array, YES );

							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
				      circles_lib_complexdisk_update( ITEMS_SWITCH_SEEDS, _items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle, _glob_zplane_selected_items_array[_i] );

              _glob_seeds_array = _items_array.clone();

              _glob_items_to_init = YES, _glob_init_mask = circles_lib_items_verify_init_mask( INIT_FROM_DISKS );
              $('[id$=initBTN]').css('color',COLOR_ERROR) ;
							if ( _glob_show_symbols_zplane ) circles_lib_symbol_zplane_display(null,null,null,NO);
					}
		}
		else if( _event.keyCode == 187 && _sel_length > 0 && !_alt_pressed ) // plus arrow key
		{
					if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
					else
					{
              var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
              if ( _glob_zplane_rendering_canvas_placeholder.get_role_id() != ROLE_RENDERING )
							_glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

							var _radius_increment = Math.floor( _glob_zplane_rendering_canvas_placeholder.get_height() / _glob_smpr );
							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
							_items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle.radius += _radius_increment ;

				      circles_lib_draw_all_screen_disks( _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, _glob_zplane_selected_items_array, YES );

							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
				      circles_lib_complexdisk_update( ITEMS_SWITCH_SEEDS, _items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle, _glob_zplane_selected_items_array[_i] );

              _glob_seeds_array = _items_array.clone();

              _glob_items_to_init = YES, _glob_init_mask = circles_lib_items_verify_init_mask( INIT_FROM_DISKS );
              $('[id$=initBTN]').css('color',COLOR_ERROR) ;
							if ( _glob_show_symbols_zplane ) circles_lib_symbol_zplane_display(null,null,null,NO);
					}
		}
		else if( _event.keyCode == 189 && _sel_length > 0 && !_alt_pressed ) // minus arrow key
		{
					if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
					else
					{
              var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
              if ( _glob_zplane_rendering_canvas_placeholder.get_role_id() != ROLE_RENDERING )
							_glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

							var _radius_increment = Math.floor( _glob_zplane_rendering_canvas_placeholder.get_height() / _glob_smpr );
							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
							_items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle.radius -= _radius_increment ;

				      circles_lib_draw_all_screen_disks( _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, _glob_zplane_selected_items_array, YES );

							for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
				      circles_lib_complexdisk_update( ITEMS_SWITCH_SEEDS, _items_array[ _glob_zplane_selected_items_array[_i] ].screen_circle, _glob_zplane_selected_items_array[_i] );

              _glob_seeds_array = _items_array.clone();

              _glob_items_to_init = YES, _glob_init_mask = circles_lib_items_verify_init_mask( INIT_FROM_DISKS );
              $('[id$=initBTN]').css('color',COLOR_ERROR) ;
							if ( _glob_show_symbols_zplane ) circles_lib_symbol_zplane_display(null,null,null,NO);
					}
		}
}

function circles_lib_events_body_keydown( _event, _param1, _param2 ) // user is pressing a key
{
    if ( !_glob_app_run && !( _event.keyCode.is_one_of( 116 ) ) )
    {
        _event.preventDefault();
        return NO ;
    }

    var _sd_n = circles_lib_count_seeds();
    var _body_obj_ref = _param1 ;
	  var _ctrl_pressed = _event.ctrlKey ;
		var _shift_pressed = _event.shiftKey ;
		var _alt_pressed = _event.altKey ;
    var _esc_pressed = _event.keyCode == 27 ? YES : NO ;
    var _canc_pressed = _event.keyCode == 46 ? YES : NO ;

    _glob_alt_key = _alt_pressed ? YES : NO ;
    _glob_canc_key = _canc_pressed ? YES : NO ;
    _glob_ctrl_key = _ctrl_pressed ? YES : NO ;
    _glob_esc_key = _esc_pressed ? YES : NO ;
    _glob_shift_key = _shift_pressed ? YES : NO ;

		circles_lib_display_key_status();

    if ( _ctrl_pressed )
    {
         _glob_mouse_prev = [ _glob_mouse_x, _glob_mouse_y ] ;
         if ( zplane_sm.check() ) _mouse_event_prev_pt = zplane_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
    }

      if ( _shift_pressed )
      {
				   if( _event.keyCode == 9 && _glob_disk_sel_index != UNDET && _sd_n > 0 ) // tab key
				   {
							if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
							else
							{
                  if ( _glob_zplane_rendering_canvas_placeholder.get_role_id() != ROLE_RENDERING )
									_glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

						   		_glob_disk_sel_index = ( _glob_disk_sel_index - 1 ) % _sd_n ;
						   		if ( _glob_disk_sel_index < 0 ) _glob_disk_sel_index = _sd_n - 1 ;

						      circles_lib_draw_all_screen_disks( _glob_zplane_rendering_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), zplane_sm, null, YES );
							    if ( _glob_show_symbols_zplane ) circles_lib_symbol_zplane_display(null,null,null,NO);
							}
					 }
      }
      else if ( _ctrl_pressed )
      {
					switch( _event.keyCode )
		      {
		            case 65: // key 'A' // select all isometric disks
							  if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
                else circles_lib_complexdisk_select_all();
            	  _event.preventDefault(); // prevent standard behavior of selecting all elements in the viewport
                return NO ;
		            break ;
		            case 66: // key 'B'
								if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else if ( _alt_pressed ) circles_lib_popup_load('forms','terminal',YES,1);
		            break ;
		            case 67: // key 'C'
		            if ( _glob_disk_sel_index != UNDET || safe_size( _glob_zplane_selected_items_array, 0 ) > 0 )
                {
                     var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
                     var _c_array = [];
                     if ( _glob_disk_sel_index != UNDET ) _c_array.push( _glob_disk_sel_index );
                     if ( safe_size( _glob_zplane_selected_items_array, 0 ) > 0 ) _c_array = _c_array.concat( _glob_zplane_selected_items_array );
                     _c_array = _c_array.unique();

                     var _item_obj = new item_obj(), _old_n, _new_n ;
                     var _shift_x = _glob_zplane_rendering_canvas_placeholder.get_width() / 22 ;

                     for( var _c = 0 ; _c < _c_array.length ; _c++ )
                     {
                        _item_obj = _items_array[ _c_array[ _c ] ] ;
                        // x,y and radius are not mapped to the complex plane,
                        // just given according to the canvas coordinates
                        var center = new point( _item_obj.screen_circle.center.x, _item_obj.screen_circle.center.y );
                            center.x += _shift_x, center.y += _shift_x ;
                        var c = new circle( center, _item_obj.screen_circle.radius );
                        var _items_array =_glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
                        if ( !is_array( _items_array ) ) _items_array = _glob_seeds_array ;
                        var _ret_chunk = circles_lib_screendisk_add( _items_array, c, YES ), _inserted_id = _ret_chunk[2] ;
                        _glob_disk_sel_index = _inserted_id ;

                 				if ( !( _glob_zplane_selected_items_array.includes( _glob_disk_sel_index ) ) )
                        {
                            _glob_zplane_selected_items_array.flush();
                						_glob_zplane_selected_items_array.push( _glob_disk_sel_index );
                        }

                        /* the following cmd preserves the new circle to be requested for moving
                           as onmousemove is intercepted right after this add-on
                        */
                        circles_lib_canvas_clean( _glob_zplane_rendering_canvas_placeholder );
                        $('[id$=initBTN]').css('color',COLOR_ERROR) ;
                        var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, OUTPUT_SCRIPT_EDITOR );
                        if ( _glob_popup_mask == 0 ) // if it is 1, no action is performed cause windows remains on top
                        {
                            // if the pop-up window is displayed, update it
                            circles_lib_popup_reload_basic_forms( _inserted_id );
                            _glob_disk_sel_index = _inserted_id ;
                        }
                     }
                }
                break ;
		            case 68: // key 'D'
		            if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else if ( _alt_pressed ) circles_lib_popup_load('forms','dictionary');
		            break ;
		            case 69: // key 'E'
		            if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else if ( _alt_pressed ) circles_lib_popup_load('forms','edit.disk');
		            break ;
		            case 70: // key 'F'
		            if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else if ( _alt_pressed )
                {
                     var _ret_chunk_ask = circles_lib_canvas_process_ask(NO,YES,W_PLANE,YES,YES,CHECK);
                     var _ret_id = _ret_chunk_ask != null ? safe_int( _ret_chunk_ask[0], 0 ) : 0 ;
                     var _ret_msg = _ret_chunk_ask != null ? _ret_chunk_ask[1] : _ERR_00_00 ;
                     if ( _ret_id == 0 ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_ERROR, _ret_msg, _glob_app );
                }
		            break ;
		            case 71: // key 'G'
							  if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else if ( _shift_pressed ) circles_lib_popup_load('forms','edit.disk',NO,ITEM_TYPE_CIRCLE);
		            else if ( _alt_pressed ) circles_lib_popup_load('forms','tiny.rendering');
		            break ;
		            case 72: // key 'H'
		            if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else circles_lib_popup_load('forms','help.items');
		            break ;
		            case 73: // key 'I'
								if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else if ( _alt_pressed ) circles_lib_files_pix_save_ask( W_PLANE, _glob_wplane_rendering_canvas_placeholder, 'wplane.png' );
		            break ;
		            case 74: // key 'J'
		            if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else circles_lib_popup_load('forms','automaton');
		            break ;
		            case 76: // key 'L'
		            if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else circles_lib_popup_load('forms','seeds.list');
		            break ;
		            case 77: // key 'M'
		            if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else 
								{
										if ( _shift_pressed ) circles_lib_popup_load('forms','edit.disk',NO,ITEM_TYPE_MOBIUS);
				            if ( _alt_pressed ) circles_lib_popup_load('forms','method',NO,_glob_method,0);
								}
		            break ;
		            case 78: // key 'N'
		            if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else if ( _alt_pressed )
                {
                     var _ret_chunk = circles_lib_config_create_new_main();
                }
		            break ;
		            case 82: // key 'R'
		            if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else if ( _alt_pressed )
                     var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, OUTPUT_SCRIPT_EDITOR );
		            break ;
		            case 83: // key 'S'
								if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else if ( _alt_pressed ) circles_lib_files_pix_save_ask( Z_PLANE, _glob_zplane_rendering_canvas_placeholder, 'zplane.png' );
		            break ;
		            case 84: // key 'T'
								if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else if ( _alt_pressed ) circles_lib_popup_load('forms','terminal',YES,0);
		            break ;
		            case 85: // key 'U'
								if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		            else circles_lib_items_unselect();
		            break ;
                default:
                if ( _glob_disk_sel_index != UNDET && _sd_n > 0 )
  					    {
                    if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
  									else
  									{
                        $("body").css('cursor', "move");
  									 		_glob_zplaneMOUSEprocSWITCH = MOUSE_DRAGDISKS_PROC_ID ;
  									 		_glob_screencircles_sel_array.flush();
  											for( var _i = 0 ; _i < _glob_zplane_selected_items_array.length ; _i++ )
  				  				 		_glob_screencircles_sel_array.push( _glob_zplane_selected_items_array[_i].screen_circle );
  									 		_glob_disk_sel_locked = YES ;
                        circles_lib_canvas_update_icons_bar( "CANVASzplaneBAR" );
                        circles_lib_statusbar_update_elements();
  									}
  						  }
                break ;
		      }
			}
			else if ( _alt_pressed )
			{
					switch( _event.keyCode )
				  {
				      case 73: // 'I'
				      if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		          else
							{
                   var _build_gens_set_opt = _plugin_last_ref != 0 ? IF_ANY : NO ;
                   circles_lib_items_switch_to( _glob_items_switch, _silent, _glob_output_channel );
                   var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
                   var _sd_n = circles_lib_count_items( _items_array );
                   var _silent = _glob_method != METHOD_NONE ? YES : NO ;
                   _glob_items_to_init = YES ;
                   var _ret_chunk = circles_lib_items_init( null, !_silent, _silent, _glob_init_mask, NO, YES, _glob_output_channel );
                   if ( _ret_chunk[0] != RET_OK ) circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
                   var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                   var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] + "" : "" ;
                   if ( _ret_id != YES ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, _ret_msg, _glob_app );
                   else _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, OUTPUT_SCRIPT_EDITOR );
                   if ( _ret_chunk[0] != RET_OK ) circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
							}
				      break ;
				      case 83: // 'S'
				      CIRCLESmultithreadingPOSTMESSAGEworker( 'stop' );
							_glob_to_save = YES;
				      break ;
							case 187: // key '+'
				      if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		          else
		          {
						       _glob_depth = Math.max(1,safe_int(_glob_depth,0)+1);
		         			 circles_lib_depth_set( _glob_depth, YES );
							}
				      break ;
				      case 189: // key '-'
				      if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app );
		          else
		          {
						       _glob_depth = Math.max(1,safe_int(_glob_depth,2)-1);
		         			 circles_lib_depth_set( _glob_depth, YES );
							}
				      break ;
				  }
			}
}