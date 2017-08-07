/* POPUP OBJ FIELDS MAP
   0 : unique id        1 : div id             2 : caption             3 : status
   4 : visible          5 : height             6 : focus flag          7 : caption class
   8 : subset           9: calling fn (name)  10 : calling fn (params) 11: array of additional fns in the context menu
   12 : base_id (for dynamical reload of the pop-up wnd)
   13 : allow multiple instances of pop-up
   14 : rect obj for popup wnd pos and extents
*/

function circles_lib_plugin_clean_baseid( _id ) { return safe_string( _id, "" ).replaceAll( [ "_", ".", " " ], "" ).toUpperCase(); }
function circles_lib_plugin_build_divid( _subset, _base_id ) { return "CIRCLES"+( safe_string( _subset, "forms" ) )+( safe_string( _base_id, "" ).replaceAll( [ "_", ".", " " ], "" ).toUpperCase() )+"popupWND" ; }
function circles_lib_plugin_focus_wnd_from_inner_ctrl_id( _ctrl_id, _base_id, _subset )
{
    if ( $("#"+circles_lib_plugin_get_wnd_from_inner_ctrl_id( _ctrl_id ) ).length > 0 )
    circles_lib_plugin_focus( _based_id, subset );
}

function circles_lib_plugin_get_wnd_from_inner_ctrl_id( _ctrl_id )
{
    if ( !is_string( _ctrl_id ) ) return null ;
    else _ctrl_id = safe_string( _ctrl_id, "" ).trim();

    if ( _ctrl_id.length == 0 ) return null ;
    else
    {
        var _ctrl = $( "#"+_ctrl_id ).get(0), _parent_id = "", _parent_node, _parent_tag, _b_found = NO ;
        var _popup_obj = null ;
        while( _ctrl != null )
        {
            _parent_node = _ctrl.parentNode ;
            if ( _parent_node != null )
            {
                _parent_id = safe_string( _parent_node.id, "" ).trim();
                _parent_tag = safe_string( _parent_node.tagName, "" ).trim() ;
                if ( _parent_id.length > 0 && _parent_tag.length > 0 &&
                     circles_lib_plugin_get_datamask_from_property( _parent_id ) == POPUP_SEARCH_BY_DIV_ID )
                {
                   _b_found = YES ;
                   _popup_obj = circles_lib_plugin_find_wnd( { div_id : _parent_id }, POPUP_SEARCH_BY_DIV_ID, NO ) ;
                   break ;
                }
                else _ctrl = _parent_node.parentNode ;
            }
            else break ;
        }

        return _b_found ? _popup_obj : null ;
    }
}


function circles_lib_plugin_get_max_zindex()
{
    var zI = 0 ;
    $( "div[id^=CIRCLES]" ).each( function( _i, _obj ) { zI = Math.max( $( "#" + _obj.id ).zIndex(), zI ) ; } ) ;
    return zI ;
}

function circles_lib_plugin_get_topmost_wnd()
{
    var _div_id = "", zI = 0 ;
    $( "div[id^=CIRCLES]" ).each( function( _i, _obj ) { if ( $( "#" + _obj.id ).zIndex() > zI ) { zI = $( "#" + _obj.id ).zIndex(), _div_id = _obj.jd ; } } ) ;
    return _div_id ;
}

function circles_lib_plugin_load()
{
    var _args_n = arguments.length ;
    if ( _args_n > 0 )
    {
       var _subset = arguments[0], _base_id = arguments[1], _i, _params = [] ;
       for( _i = 2 ; _i < _args_n ; _i++ )
       {
          if ( ( "" + arguments[_i] ).length > 0 )
				  {
						 if ( ( safe_string( arguments[_i], "" ) ).start_with_i( "move:" ) )
						 {
						 		 var _tok = ( ( safe_string( arguments[_i], "" ).split( ":" ) )[1] ).toLowerCase() ;
								 switch( _tok )
								 {
										case "yes": _params['a'] = 1 ; break ;
										case "no": _params['a'] = 0 ; break ;
						        default: _params['a'] = _tok ; break ;
								 }
						 }
						 else if ( ( safe_string( arguments[_i], "" ) ).start_with_i( "items:", "plane:", "symbol", "tab:" ) )
						 {
						 		 _params['b'] = safe_string( ( ( safe_string( arguments[_i], "" ).split( ":" ) )[1] ), "" );
						 }
						 else if ( ( safe_string( arguments[_i], "" ) ).start_with_i( "src:" ) )
						 {
						 		 _params['c'] = safe_string( ( ( safe_string( arguments[_i], "" ).split( ":" ) )[1] ), "" );
						 }
             else if ( is_array( arguments[_i] ) )
             {
                _glob_persistent_vars['tmp_arg'+_i] = arguments[_i].clone();
                _params.push( "_glob_persistent_vars['tmp_arg"+_i+"']" );
             }
             else _params.push( ""+arguments[_i] );
					}
       }
       
       var _popup_base_id = circles_lib_plugin_clean_baseid( _base_id );
       var _main_opener_fn = "CIRCLES" + _subset + _popup_base_id + "main" ;
       var _main_opener_cmd = _main_opener_fn + "('"+_base_id+"'"+(_params.length>0?", "+_params.join(", "):"")+");" ;
       var _abs_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
       var _rel_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
       if ( _abs_folder_path.match( /[A-Za-z0-9\.\-\/]/g ).length != _abs_folder_path.length )
       {
					circles_lib_log_add_entry( "Incorrect input syntax", LOG_ERROR ) ;
          return NO ;
			 }
       
       var vars = { tip: "", folder : _abs_folder_path, filter : "/[?.js]$/",
									  exact : 0, search_params : "0,0,1,0" } ;
       var _result = get_filedata_from_folder( "support/code/phpcode/svc/svc.filelist.php", "POST", false, vars );
       if ( _result.length > 0 )
       {
       		var _old_title = document.title ;
         	document.title = "Loading module";
					var _res_array = _result.includes( "@@@" ) ? _result.split( "@@@" ) : [ _result ] ;
          var _rl = safe_size( _res_array, 0 ), _load_failure = NO, _src_code_load_failures = [] ;
          for( _i = 0 ; _i < _rl ; _i++ )
          {
              $.ajaxSetup( { async:false } );
              $.getScript( _rel_folder_path + _res_array[_i] ).done( function(){} ).fail( function(){ circles_lib_log_add_entry( "'"+_res_array[_i]+"' can't be loaded: suspected invalid filename or internal code error", LOG_ERROR ) ; _src_code_load_failures.push( _res_array[_i] ) ; } );
          }

          _load_failure = safe_size( _src_code_load_failures, 0 ) > 0 ? YES : NO ;
          if ( !_load_failure )
          {
          		var _ret = 1, _ret_msg = "" ;
					    try{ eval( _main_opener_cmd ) ; }
					    catch( _err )
							{
									_ret = 0, _ret_msg = _err.name + ": " + _err.message ;
									circles_lib_error_obj_handler( _err );
							}

              if ( !_ret )
              {
                 _ret_msg = "'"+_popup_base_id+"' service can't run because of internal code error(s)"+_glob_crlf+_ret_msg ;
						 		 circles_lib_log_add_entry( _ret_msg, LOG_ERROR ) ;
              }
            	document.title = _old_title ;
              return _ret ;
          }
          else
          {
							circles_lib_log_add_entry( "'"+_popup_base_id+"' service can't run due to invalid components" , LOG_ERROR ) ;
            	document.title = _old_title ;
              return NO ;
          }
       }
       else
			 {
          circles_lib_log_add_entry( "'"+_popup_base_id+"' service can't run due to invalid path: "+_abs_folder_path, LOG_ERROR ) ;
					return NO ;
			 }
    }
    else
		{
       circles_lib_log_add_entry( "'"+_popup_base_id+"' service can't run: missing input arguments" , LOG_ERROR ) ;
			 return NO ;
		}
}

// PROPERTIES
function circles_lib_plugin_set_property( _unique_id, _obj, _datatype_mask, _offset )
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = UNFOUND ;
    _offset = Math.min( Math.max( safe_int( _offset, 0 ), 0 ), _len - 1 ) ;
    for( var _i = _offset ; _i < _len ; _i++ )
    {
       if ( is_array( _array[_i] ) )
       {
          if ( _array[_i][0].strcmp( _unique_id ) )
          {
             if      ( _datatype_mask == POPUP_SEARCH_BY_UNIQUE_ID ) _array[_i][0] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_DIV_ID ) _array[_i][1] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_CAPTION ) _array[_i][2] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_STATUS ) _array[_i][3] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_VISIBLE ) _array[_i][4] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_HEIGHT ) _array[_i][5] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_SUBSET ) _array[_i][8] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_BASE_ID ) _array[_i][12] = _obj ;
             _glob_popups_array[_i] = _array[_i] ;
          }
       }
    }
}

function circles_lib_plugin_get_datamask_from_property( _prop_value, _offset )
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = UNFOUND ;
    _offset = Math.min( Math.max( safe_int( _offset, 0 ), 0 ), _len - 1 ) ;
    for( var _i = _offset ; _i < _len ; _i++ )
    {
       if ( is_array( _array[_i] ) )
       {
          if      ( _array[_i][0] == _prop_value ) _ret = POPUP_SEARCH_BY_UNIQUE_ID ;
          else if ( _array[_i][1] == _prop_value ) _ret = POPUP_SEARCH_BY_DIV_ID ;
          else if ( _array[_i][2] == _prop_value ) _ret = POPUP_SEARCH_BY_CAPTION ;
          else if ( _array[_i][3] == _prop_value ) _ret = POPUP_SEARCH_BY_STATUS ;
          else if ( _array[_i][4] == _prop_value ) _ret = POPUP_SEARCH_BY_VISIBLE ;
          else if ( _array[_i][5] == _prop_value ) _ret = POPUP_SEARCH_BY_HEIGHT ;
          else if ( _array[_i][8] == _prop_value ) _ret = POPUP_SEARCH_BY_SUBSET ;
          else if ( _array[_i][12] == _prop_value ) _ret = POPUP_SEARCH_BY_BASE_ID ;
             
          if ( _ret != UNFOUND ) return _ret ;
       }
    }
    
    return _ret ;
}

function circles_lib_plugin_check_property( _unique_id, _val, _datatype_mask, _offset )
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = NO ;
    _offset = Math.min( Math.max( safe_int( _offset, 0 ), 0 ), _len - 1 ) ;
    for( var _i = _offset ; _i < _len ; _i++ )
    {
       if ( is_array( _array[_i] ) )
       {
          if ( _array[_i][0].strcmp( _unique_id ) )
          {
             if      ( _datatype_mask == POPUP_SEARCH_BY_UNIQUE_ID && _array[_i][0] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_DIV_ID && _array[_i][1] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_CAPTION && _array[_i][2] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_STATUS && _array[_i][3] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_VISIBLE && _array[_i][4] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_HEIGHT && _array[_i][5] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_SUBSET && _array[_i][8] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_BASE_ID && _array[_i][12] == _val ) _ret = YES ;
             if ( _ret ) break ;
          }
       }
    }

    return _ret ;
}

function circles_lib_plugin_set_property_to_all_entries( _obj, _datatype_mask /* 1: unique id, 2: description, 3: status, 4: visible, 5: height */, _offset )
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = UNFOUND ;
    _offset = Math.max( safe_int( _offset, 0 ), 0 );
    for( var _i = _offset ; _i < _len ; _i++ )
    {
       if ( is_array( _array[_i] ) )
       {
          if ( _datatype_mask == POPUP_SEARCH_BY_STATUS ) _array[_i][3] = _obj ;
          else if ( _datatype_mask == POPUP_SEARCH_BY_VISIBLE ) _array[_i][4] = _obj ;
          else if ( _datatype_mask == POPUP_SEARCH_BY_HEIGHT ) _array[_i][5] = _obj ;
       }
    }
}

function circles_lib_plugin_toggle_preview( _base_id, _subset, _apply_fn_if_visible )
{
    _base_id = _base_id.replace( /[\.\_\-]/g, "" ).trim() ;
    $( "#PLUGIN_PREVIEW" ).toggle( "slow", function()
		{
      circles_lib_plugin_render_preview( _base_id, _subset, Z_PLANE );
			var _visible = $( "#PLUGIN_PREVIEW" ).is(":visible") ;
			$( "#PLUGIN_TOGGLE_PREVIEW_BTN" ).html( _visible ? "Hide preview" : "Show preview" );
			if ( _visible )
			{
				var _plugin_width = $( "#"+GLOB_PLUGIN_DIV_ID ).width() ;
				var _canvas = $( "#CIRCLES"+_subset.toLowerCase()+_base_id.toUpperCase()+"_CANVAS" ).get(0) ;
				_canvas.set_width( _plugin_width - 5 );
        if ( typeof _apply_fn_if_visible === "function" ) _apply_fn_if_visible.apply();
			}
    } );
}

function circles_lib_plugin_render_preview( _clean_base_id, _subset, _plane_type )
{
		var _b_found = NO, _canvas ;
    _clean_base_id = safe_string( _clean_base_id, "" ).replace( /[\.\_\-]/g, "" ).toLowerCase();
    _subset = safe_string( _subset, "embeddings" ).toLowerCase();
  	_plane_type = safe_int( _plane_type, W_PLANE );
		if ( $( "#CIRCLESchoose"+_clean_base_id.toUpperCase()+"canvasDROPDOWN" ).get(0) != null )
		{
			var _key = $( "#CIRCLESchoose"+_clean_base_id.toUpperCase()+"canvasDROPDOWN option:selected" ).val();
			var _entry = _glob_available_curr_canvas_array[_key] ;
			if ( _entry != null )
			{
			  _plane_type = circles_lib_return_plane_type( _plane_type );
			  if ( _plane_type != NO_PLANE )
			  {
				  _b_found = YES, _canvas = $( "#"+_key ).get(0)
				}
			}
		}

		if ( !_b_found ) _canvas = $( "#CIRCLES"+_subset+_clean_base_id.toUpperCase()+"_CANVAS" ).get(0) ;
		if ( is_html_canvas( _canvas ) )
		{
			var _mapper = null ;
			switch( _plane_type ) // just to start from something we already have ...
			{
				case Z_PLANE: _mapper = zplane_sm.copy(); break ;
				case W_PLANE: _mapper = wplane_sm.copy(); break ;
				default: break ;
			}

			if ( _mapper == null ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Missing Mapper component: try to reload this plug-in again", 'PLUGIN_OUTMSG' )
			else
			{
		    var _aspect_ratio = _canvas.getContext( _glob_canvas_ctx_2D_mode ).get_aspect_ratio() ;
		    var _coords_rect = _mapper.get_coords_rect();
		    var _center = _coords_rect.center(), _coords_w = _coords_rect.width(), _coords_h = _coords_rect.height();
		    var _new_coords_w = ( _aspect_ratio * _coords_h ).roundTo(2) ;
		    var _new_left_top = new point( _center.x - _new_coords_w / 2.0, _center.y + _coords_h / 2.0 ) ;
		    var _new_right_bottom = new point( _center.x + _new_coords_w / 2.0, _center.y - _coords_h / 2.0 ) ;
		    var _new_rect = new rect( _new_left_top, _new_right_bottom, _RECT_ORIENTATION_CARTESIAN );
        var _display_rect = new rect( 0, 0, _canvas.get_width(), _canvas.get_height() ) ;
        _mapper.label = "Plug-in screen mapper" ;
        _mapper.set_coords_rect( _new_rect );
        _mapper.set_client_rect( _display_rect );
        _mapper.set_display_rect( _display_rect );
				switch( _plane_type )
				{
					case Z_PLANE:
          _canvas.set_type( Z_PLANE );
          _canvas.clean();
          circles_lib_grid_draw( _canvas, _mapper, CUSTOM_PLANE, YES, _glob_ticks_count, OUTPUT_SCREEN ) ;
          if ( circles_lib_count_seeds() > 0 )
          circles_lib_draw_all_complex_disks( _canvas.getContext( _glob_canvas_ctx_2D_mode ), _mapper, null, NO, YES, OUTPUT_SCREEN );
					break ;
					case W_PLANE:
          _canvas.set_type( W_PLANE );
          _canvas.clean();
          circles_lib_grid_draw( _canvas, _mapper, CUSTOM_PLANE, YES, _glob_ticks_count, OUTPUT_SCREEN ) ;
          if ( circles_lib_count_seeds() > 0 )
          {
						 circles_lib_triggers_open_all_automated_entries();
             _ret_chunk = circles_lib_canvas_render_process( _canvas, _mapper, CUSTOM_PLANE, NO, OUTPUT_SCREEN );
					}
					break ;
					default: break ;
				}
			}
		}
		else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Missing canvas component: try to reload this plug-in again", 'PLUGIN_OUTMSG' )
}