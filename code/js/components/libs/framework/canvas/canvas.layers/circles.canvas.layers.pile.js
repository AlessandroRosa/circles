function circles_lib_canvas_layer_pile_get( _plane_type ) { return _plane_type == Z_PLANE ? _glob_zplane_layers_pile_array : ( _plane_type == W_PLANE ? _glob_wplane_layers_pile_array : null ); }
function circles_lib_canvas_layer_create( _init_properties_array )
{
    /*  _init_properties_array
        defaultcanvas : yes | no
        role index : 1.1 ... 1.2 ...
        type : Z-plane | W-plane | bip
        visible : yes | no
    */
    var _startINDEX = 0 ;
    var _plane_def = _init_properties_array[_startINDEX];
    		_startINDEX++ ;
    var _role_def = _init_properties_array[_startINDEX] ;
    		_startINDEX++ ;
    var _default_canvas = _init_properties_array[_startINDEX] ;
    		_startINDEX++ ;
    var _role_index = _init_properties_array[_startINDEX] ;
    		_startINDEX++ ;
    var _plane_type = _init_properties_array[_startINDEX] ;
    		_startINDEX++ ;
    var _visible = _init_properties_array[_startINDEX] ;
    		_startINDEX++ ;
    var _layer = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_DEF, _role_def );
    if ( _layer != null ) return null ;
    else
    {
       var _div_id = "CANVAS"+_plane_def+"_"+_role_def+"_DIV" ;
       var _div = circles_lib_plugin_create( _div_id, null, null, "", "layer_canvas" );
       if ( _div == null ) return null ;
       else
       {
          _div.style.zIndex = ( circles_lib_canvas_layer_get_topmost( _plane_type ) )['zindex'] + 1 ;
          _div.style.display = "none" ;
          _div.style.backgroundColor = "transparent" ;
          _div.style.position = "absolute" ;
          _div.style.margin = "0px" ;
          _div.style.padding = "0px" ;
          _div.style.filter = "alpha(opacity="+safe_int(DEFAULT_MAX_OPACITY*100.0,100.0)+")" ;
          _div.style.KHTMLOpacity = DEFAULT_MAX_OPACITY ;
          _div.style.opacity = DEFAULT_MAX_OPACITY ;
          _div.style.MozOpacity = DEFAULT_MAX_OPACITY ;

          // pick the grid layer up for referencing the new layer dims
          var _grid_layer = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
          var _grid_canvas = _grid_layer != null ? $("#"+_grid_layer.get_idcanvas() ).get(0) : null ;
          var _grid_w = is_html_canvas( _grid_canvas ) ? _grid_canvas.get_width() : 0 ;
          var _grid_h = is_html_canvas( _grid_canvas ) ? _grid_canvas.get_height() : 0 ;
          var _canvas_id = "CIRCLES" + _plane_def + "_" + _role_def + "_layerCANVAS" ;
          var _STYLE = "background-color:transparent;" ;
              _STYLE += "display:"+( _visible ? "block" : "none" )+";" ;
          _div.innerHTML = "<CANVAS ID=\""+_canvas_id+"\" STYLE=\""+_STYLE+"\"></CANVAS>" ;

          var _new_layer = $("#"+_canvas_id ).get(0);
          if ( is_html_canvas( _new_layer ) )
          {
        	    if ( isNaN( _role_index ) ) _role_index = circles_lib_canvas_layer_with_max_role_get( _plane_type ) + 1 ;
              else if ( _role_index.is_one_of( 0, UNDET ) ) _role_index = circles_lib_canvas_layer_with_max_role_get( _plane_type ) + 1 ;

              _new_layer.set_width( _grid_w ) ;
              _new_layer.set_height( _grid_h ) ;
              _new_layer.getContext(_glob_canvas_ctx_2D_mode).idcanvas = _canvas_id ;
        	    _new_layer.getContext(_glob_canvas_ctx_2D_mode).iddiv = _div_id ;
        		  _new_layer.getContext(_glob_canvas_ctx_2D_mode).type = _plane_type ;
        		  _new_layer.getContext(_glob_canvas_ctx_2D_mode).role = _role_index ;
        		  _new_layer.getContext(_glob_canvas_ctx_2D_mode).role_def = _role_def ;
        		  _new_layer.getContext(_glob_canvas_ctx_2D_mode).label = _plane_def + " " + _role_def ;
        		  _new_layer.getContext(_glob_canvas_ctx_2D_mode).plane_def = _plane_def ;
        		  _new_layer.getContext(_glob_canvas_ctx_2D_mode).defaultcanvas = _default_canvas ;
        		  _new_layer.getContext(_glob_canvas_ctx_2D_mode).visible = _visible ;
              _new_layer.getContext(_glob_canvas_ctx_2D_mode).backgroundColor = "transparent" ;

              if ( _plane_type == Z_PLANE )
              {
            	   _new_layer.complex_rect = new rect( _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN );
                 _glob_zplane_layers_pile_role_array.push_safe( _role_index );
                 _glob_zplane_layers_pile_role_array.unique();
                 _glob_zplane_layers_pile_array.push( _new_layer );
                 _glob_zplane_topmost_canvas_placeholder = _new_layer ;
                 if ( function_exists( "circles_lib_statusbar_init" ) ) circles_lib_statusbar_init( NO ); // recomputes z-index
              }
              else if ( _plane_type == W_PLANE )
              {
            		 _new_layer.complex_rect = new rect( _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN );
                 _glob_wplane_layers_pile_role_array.push_safe( _role_index );
                 _glob_wplane_layers_pile_role_array.unique();
                 _glob_wplane_layers_pile_array.push( _new_layer );
                 _glob_wplane_topmost_canvas_placeholder = _new_layer ;
                 if ( function_exists( "circles_lib_statusbar_init" ) ) circles_lib_statusbar_init( NO ); // recomputes z-index
              }
              else return null ;
          }
          return _div ;
       }
    }
}

function circles_lib_canvas_layer_pile_resize_to_default( _set_default_coords, _render, _out_channel )
{
    _set_default_coords = safe_int( _set_default_coords, NO );
    _render = safe_int( _render, YES ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _menu_height = $( "#menu" ).height(), _menu_width = $( "#menu" ).width();
    var _coords_height = $( "#ZplaneCOORDScontainer" ).height();
    var _extra_height = _menu_height + _coords_height + 22 ;
    var _sw = $(window).width(), _sh = $(window).height() ;

    if ( _set_default_coords )
    {
       _glob_wplaneLEFT = _glob_zplaneLEFT = -DEFAULT_PLANE_COORD ;
       _glob_wplaneRIGHT = _glob_zplaneRIGHT = DEFAULT_PLANE_COORD ;
       _glob_wplaneTOP = _glob_zplaneTOP = DEFAULT_PLANE_COORD ;
       _glob_wplaneBOTTOM = _glob_zplaneBOTTOM = -DEFAULT_PLANE_COORD ;
    }

    var _viewport_w = _menu_width, _viewport_h = _sh ;
    var _new_main_canvas_w = Math.floor( ( _viewport_w - 60 ) / 2 );
    var _new_main_canvas_h = _viewport_h - _extra_height ;

    var _dim = _glob_canvas_width = Math.min( _new_main_canvas_w, _new_main_canvas_h );

    _panel_left_width = _panel_left_height = _dim ;
    _panel_right_width = _panel_right_height = _dim ;

		$( "#PANELleft" ).show();
		$( "#PANELright" ).show();

    $( "#ZPLANEtd" ).width( _dim );
    $( "#WPLANEtd" ).width( _dim );

    $( "#ZplaneCOORDScontainer" ).width(_glob_canvas_width);
    $( "#WplaneCOORDScontainer" ).width(_glob_canvas_width);

    $("#PANELleft").width( _dim + 24 );
    $("#PANELright").width( _dim + 24 );
    $("#PANELleft").height( _dim - 4 );
    $("#PANELright").height( _dim - 4 );

    $("#ZPLANEtd").height( _dim + 40 );
    $("#WPLANEtd").height( _dim + 40 );

    $("#ZPLANElayers_pile").css( "left", 0 );
    $("#ZPLANElayers_pile").css( "top", 0 );

    $("#WPLANElayers_pile").css( "left", 0 );
    $("#WPLANElayers_pile").css( "top", 0 );

    $("#ZPLANElayers_pile").width( _dim );
    $("#ZPLANElayers_pile").height( _dim );

    $("#WPLANElayers_pile").width( _dim );
    $("#WPLANElayers_pile").height( _dim );

    var _z_pile_left = $("#ZPLANElayers_pile").position().left ;
    var _z_pile_top = $("#ZPLANElayers_pile").position().top ;
    var _w_pile_left = $("#WPLANElayers_pile").position().left ;
    var _w_pile_top = $("#WPLANElayers_pile").position().top ;

    var _w, _h ;
    var resize_pile_fn = function( _plane_type, _ref_array )
    {
        $.each( _ref_array,
                function( _index, _layer )
                {
                    $( "#" + _layer.get_iddiv() ).css( "left", _plane_type == Z_PLANE ? _z_pile_left : _w_pile_left );
                    $( "#" + _layer.get_iddiv() ).css( "top", _plane_type == W_PLANE ? _w_pile_top : _z_pile_top );
                    $( "#" + _layer.get_idcanvas() ).css( "left", _plane_type == Z_PLANE ? _z_pile_left : _w_pile_left );
                    $( "#" + _layer.get_idcanvas() ).css( "top", _plane_type == W_PLANE ? _w_pile_top : _z_pile_top );

                    _w = _plane_type == Z_PLANE ? _panel_left_width : _panel_right_width ;
                    _h = _plane_type == Z_PLANE ? _panel_left_height : _panel_right_height ;
                    $( "#" + _layer.get_idcanvas() ).get(0).set_width( _w );
                    $( "#" + _layer.get_idcanvas() ).get(0).set_height( _h );
                    $( "#" + _layer.get_idcanvas() ).get(0).set_visible( YES );

                    $( "#" + _layer.get_iddiv() ).width( _w );
                    $( "#" + _layer.get_iddiv() ).height( _h );
                } );
    }

    resize_pile_fn( Z_PLANE, _glob_zplane_layers_pile_array );
    resize_pile_fn( W_PLANE, _glob_wplane_layers_pile_array );

    _extent_x = _glob_zplaneRIGHT - _glob_zplaneLEFT ;
    _extent_y = _glob_zplaneTOP - _glob_zplaneBOTTOM ;

    var src_left_up_pt = new point( _glob_zplaneLEFT, _glob_zplaneTOP );
    var src_right_down_pt = new point( _glob_zplaneRIGHT, _glob_zplaneBOTTOM );

    var display_rect = new rect( 0, 0, _new_main_canvas_w, _new_main_canvas_w, _RECT_ORIENTATION_SCREEN, "display rect" );
    var client_rect = new rect( 0, 0, _new_main_canvas_w, _new_main_canvas_w, _RECT_ORIENTATION_SCREEN, "client rect" );

    zplane_sm.set_coords_corners( src_left_up_pt, src_right_down_pt );
    zplane_sm.set_client_rect( client_rect );
    zplane_sm.set_display_rect( display_rect );
    zplane_sm.accuracy = DEFAULT_MAX_ACCURACY ;

    _extent_x = _glob_wplaneRIGHT - _glob_wplaneLEFT ;
    _extent_y = _glob_wplaneTOP - _glob_wplaneBOTTOM ;

    src_left_up_pt = new point( _glob_wplaneLEFT, _glob_wplaneTOP );
    src_right_down_pt = new point( _glob_wplaneRIGHT, _glob_wplaneBOTTOM );

    display_rect = new rect( 0, 0, _new_main_canvas_w, _new_main_canvas_w, _RECT_ORIENTATION_SCREEN, "display rect" );
    client_rect = new rect( 0, 0, _new_main_canvas_w, _new_main_canvas_w, _RECT_ORIENTATION_SCREEN, "client rect" );

    wplane_sm.set_coords_corners( src_left_up_pt, src_right_down_pt );
    wplane_sm.set_client_rect( client_rect );
    wplane_sm.set_display_rect( display_rect );
    wplane_sm.accuracy = DEFAULT_MAX_ACCURACY ;

    if ( _render )
    {
       var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, _out_channel );
       var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
       var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown message" ;
       if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
       {
			 		 var _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, null, YES, YES, NO, YES, NO, YES, _out_channel );
		       var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
					 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "3Unknown error" ;
			 }
    }
}

function circles_lib_canvas_layer_pile_resize( _plane_type, _width_percentage, _render, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _render = safe_int( _render, YES ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _width_percentage = Math.min( 100.0, Math.abs( safe_float( _width_percentage, 50 ) ) );
    if ( _width_percentage == 50 )
    {
       circles_lib_canvas_layer_pile_resize_to_default();
       return ;
    }

    var _new_other_canvas_w_percentage = 100.0 - _width_percentage ;
    var _main_ref_array = null, _other_ref_array ;
    var _main_coords = [], _other_coords = [], _center = new point(), _extent_x = 0, _extent_y = 0 ;
    var _original_main_canvas_w = 0, _original_main_canvas_h = 0 ;
    var _original_other_canvas_w = 0, _original_other_canvas_h = 0 ;
    var _panel_left_width = 0, _panel_right_width = 0, _panel_left_height = 0, _panel_right_height = 0 ;
        // computes new dims for canvases piles
    var _viewport_dims = getViewportExtents();
    var _viewport_w = _viewport_dims[0] - 20, _viewport_h = _viewport_dims[1] - 20 ;
    var _half_viewport_w = Math.floor( _viewport_w / 2 );
    var _new_main_canvas_w = Math.floor( _viewport_w * _width_percentage / 100 );
    var _new_other_canvas_w = _viewport_w - _new_main_canvas_w ;
        // collect data references and coords
    var _resize_zplane_mode = 0, _resize_wplane_mode = 0 ; // 1: square shape, 2: rectangle shape
    if ( _plane_type.is_one_of( Z_PLANE ) )
    {
       _main_ref_array = _glob_zplane_layers_pile_array ;
       _other_ref_array = _glob_wplane_layers_pile_array ;
       _main_coords = [ _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM ] ;
       _other_coords = [ _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM ] ;

       var _layer = _glob_zplane_layers_pile_array[0] ;
       _original_main_canvas_w = $( "#" + _layer.get_idcanvas() ).get(0).get_width();
       _original_main_canvas_h = $( "#" + _layer.get_idcanvas() ).get(0).get_height();

       _layer = _glob_wplane_layers_pile_array[0] ;
       _original_other_canvas_w = $( "#" + _layer.get_idcanvas() ).get(0).get_width();
       _original_other_canvas_h = $( "#" + _layer.get_idcanvas() ).get(0).get_height();

       _resize_zplane_mode = _new_main_canvas_w < _half_viewport_w ? 1 : 2 ;
       _resize_wplane_mode = _new_main_canvas_w < _half_viewport_w ? 2 : 1 ;
    }
    else if ( _plane_type.is_one_of( W_PLANE ) )
    {
       _main_ref_array = _glob_wplane_layers_pile_array ;
       _other_ref_array = _glob_zplane_layers_pile_array ;
       _main_coords = [ _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM ] ;
       _other_coords = [ _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM ] ;

       var _layer = _glob_wplane_layers_pile_array[0] ;
       _original_main_canvas_w = $( "#" + _layer.get_idcanvas() ).get(0).get_width();
       _original_main_canvas_h = $( "#" + _layer.get_idcanvas() ).get(0).get_height();

       _layer = _glob_zplane_layers_pile_array[0] ;
       _original_other_canvas_w = $( "#" + _layer.get_idcanvas() ).get(0).get_width();
       _original_other_canvas_h = $( "#" + _layer.get_idcanvas() ).get(0).get_height();

       _resize_zplane_mode = _new_main_canvas_w < _half_viewport_w ? 2 : 1 ;
       _resize_wplane_mode = _new_main_canvas_w < _half_viewport_w ? 1 : 2 ;
    }

    if ( _plane_type == Z_PLANE )
    {
       if ( _resize_zplane_mode == 1 )
       {
          _panel_left_width = _new_main_canvas_w ;
          _panel_left_height = _new_main_canvas_w ;
          _panel_right_width = _new_other_canvas_w ;
          _panel_right_height = _original_main_canvas_h ;
       }
       else if ( _resize_zplane_mode == 2 )
       {
          _panel_left_width = _new_main_canvas_w ;
          _panel_left_height = _original_main_canvas_h ;
          _panel_right_width = _new_other_canvas_w ;
          _panel_right_height = _new_other_canvas_w ;
       }
    }
    else if ( _plane_type == W_PLANE )
    {
       if ( _resize_wplane_mode == 1 )
       {
          _panel_right_width = _new_main_canvas_w ;
          _panel_right_height = _new_main_canvas_w ;
          _panel_left_width = _new_other_canvas_w ;
          _panel_left_height = _original_main_canvas_h ;
       }
       else if ( _resize_wplane_mode == 2 )
       {
          _panel_right_width = _new_main_canvas_w ;
          _panel_right_height = _original_main_canvas_h ;
          _panel_left_width = _new_other_canvas_w ;
          _panel_left_height = _new_other_canvas_w ;
       }
    }

    $("#PANELleft").width( _panel_left_width );
    $("#PANELleft").height( _panel_left_height );
    $("#PANELright").height( _panel_right_height );
    $("#PANELright").width( _panel_right_width );

    $("#ZPLANElayers_pile").css( "left", 0 );
    $("#ZPLANElayers_pile").css( "top", 0 );

    $("#WPLANElayers_pile").css( "left", 0 );
    $("#WPLANElayers_pile").css( "top", 0 );

    $("#ZPLANElayers_pile").width( _panel_left_width );
    $("#ZPLANElayers_pile").height( _panel_left_height );

    $("#WPLANElayers_pile").width( _panel_right_width );
    $("#WPLANElayers_pile").height( _panel_right_height );

    var _z_pile_left = $("#ZPLANElayers_pile").position().left ;
    var _z_pile_top = $("#ZPLANElayers_pile").position().top ;
    var _w_pile_left = $("#WPLANElayers_pile").position().left ;
    var _w_pile_top = $("#WPLANElayers_pile").position().top ;
    var _w, _h ;
    $.each( _main_ref_array,
            function( _index, _layer )
            {
                $( "#" + _layer.get_iddiv() ).css( "left", _plane_type == Z_PLANE ? _z_pile_left : _w_pile_left );
                $( "#" + _layer.get_iddiv() ).css( "top", _plane_type == W_PLANE ? _w_pile_top : _z_pile_top );
                $( "#" + _layer.get_idcanvas() ).css( "left", _plane_type == Z_PLANE ? _z_pile_left : _w_pile_left );
                $( "#" + _layer.get_idcanvas() ).css( "top", _plane_type == W_PLANE ? _w_pile_top : _z_pile_top );

                _w = _plane_type == Z_PLANE ? _panel_left_width : _panel_right_width ;
                _h = _plane_type == Z_PLANE ? _panel_left_height : _panel_right_height ;
                $( "#" + _layer.get_idcanvas() ).get(0).set_width( _w ) ;
                $( "#" + _layer.get_idcanvas() ).get(0).set_height( _h ) ;

                $( "#" + _layer.get_iddiv() ).width( _w ) ;
                $( "#" + _layer.get_iddiv() ).width( _h ) ;
            } );

    var _grid_zplane_canvas_id  = ( circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID ) ).id ;
    var _grid_wplane_canvas_id  = ( circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID ) ).id ;

    var _z_pile_left = $( "#" + _grid_zplane_canvas_id ).offset().left ;
    var _z_pile_top = $( "#" + _grid_zplane_canvas_id ).offset().top ;
    var _w_pile_left = $( "#" + _grid_wplane_canvas_id ).offset().left ;
    var _w_pile_top = $( "#" + _grid_zplane_canvas_id ).offset().top ;
    var _w, _h ;

    $.each( _other_ref_array,
            function( _index, _layer )
            {
                $( "#" + _layer.get_iddiv() ).css( "left", _plane_type == Z_PLANE ? _w_pile_left : _z_pile_left );
                $( "#" + _layer.get_iddiv() ).css( "top", _plane_type == W_PLANE ? _z_pile_top : _w_pile_top );
                $( "#" + _layer.get_idcanvas() ).css( "left", _plane_type == Z_PLANE ? _w_pile_left : _z_pile_left );
                $( "#" + _layer.get_idcanvas() ).css( "top", _plane_type == W_PLANE ? _z_pile_top : _w_pile_top );

                _w = _plane_type == Z_PLANE ? _panel_right_width : _panel_left_width ;
                _h = _plane_type == Z_PLANE ? _panel_right_height : _panel_left_height ;
                $( "#" + _layer.get_idcanvas() ).get(0).set_width( _w ) ;
                $( "#" + _layer.get_idcanvas() ).get(0).set_height( _h ) ;

                $( "#"+_chunk.get_iddiv() ).width( _w ) ;
                $( "#"+_chunk.get_iddiv() ).height( _h ) ;
            } );

     if ( _plane_type.is_one_of( Z_PLANE ) && _resize_zplane_mode == 2 )
     {
          _extent_x = _glob_zplaneRIGHT - _glob_zplaneLEFT ;
          _extent_y = _glob_zplaneTOP - _glob_zplaneBOTTOM ;
          _center.x = ( _glob_zplaneRIGHT + _glob_zplaneLEFT ) / 2.0 ;
          _center.y = ( _glob_zplaneTOP + _glob_zplaneBOTTOM ) / 2.0 ;
          var _canvas_w = $( "#" + _grid_zplane_canvas_id ).get(0).get_width();
          var _new_extent_x = _extent_x * _canvas_w / _original_main_canvas_w ;
          _glob_zplaneLEFT = _center.x - _new_extent_x / 2.0 ;
          _glob_zplaneRIGHT = _center.x + _new_extent_x / 2.0 ;

          var src_left_up_pt = new point( _glob_zplaneLEFT, _glob_zplaneTOP );
          var src_right_down_pt = new point( _glob_zplaneRIGHT, _glob_zplaneBOTTOM );

          var display_rect = new rect( 0, 0, _canvas_w, _panel_left_height, _RECT_ORIENTATION_SCREEN, "display rect" );
          var client_rect = new rect( 0, 0, _canvas_w, _panel_left_height, _RECT_ORIENTATION_SCREENN, "client rect" );

          zplane_sm.set_coords_corners( src_left_up_pt, src_right_down_pt );
          zplane_sm.set_client_rect( client_rect );
          zplane_sm.set_display_rect( display_rect );
          zplane_sm.accuracy = DEFAULT_MAX_ACCURACY ;

          //

          _extent_x = _glob_wplaneRIGHT - _glob_wplaneLEFT ;
          _extent_y = _glob_wplaneTOP - _glob_wplaneBOTTOM ;
          _center.x = ( _glob_wplaneRIGHT + _glob_wplaneLEFT ) / 2.0 ;
          _center.y = ( _glob_wplaneTOP + _glob_wplaneBOTTOM ) / 2.0 ;
          _canvas_w = $( "#" + _grid_wplane_canvas_id ).get(0).get_width();
          _new_extent_x = _extent_x * _canvas_w / _original_other_canvas_w ;
          _glob_wplaneLEFT = _center.x - _new_extent_x / 2.0 ;
          _glob_wplaneRIGHT = _center.x + _new_extent_x / 2.0 ;

          src_left_up_pt = new point( _glob_wplaneLEFT, _glob_wplaneTOP );
          src_right_down_pt = new point( _glob_wplaneRIGHT, _glob_wplaneBOTTOM );

          display_rect = new rect( 0, 0, _canvas_w, _panel_right_height, _RECT_ORIENTATION_SCREEN, "display rect" );
          client_rect = new rect( 0, 0, _canvas_w, _panel_right_height, _RECT_ORIENTATION_SCREEN, "client rect" );

          wplane_sm.set_coords_corners( src_left_up_pt, src_right_down_pt );
          wplane_sm.set_client_rect( client_rect );
          wplane_sm.set_display_rect( display_rect );
          wplane_sm.accuracy = DEFAULT_MAX_ACCURACY ;
     }

     if ( _plane_type.is_one_of( W_PLANE ) && _resize_wplane_mode == 2 )
     {
          _extent_x = _glob_wplaneRIGHT - _glob_wplaneLEFT ;
          _extent_y = _glob_wplaneTOP - _glob_wplaneBOTTOM ;
          _center.x = ( _glob_wplaneRIGHT + _glob_wplaneLEFT ) / 2.0 ;
          _center.y = ( _glob_wplaneTOP + _glob_wplaneBOTTOM ) / 2.0 ;
          var _canvas_w = $( "#" + _grid_wplane_canvas_id ).get(0).get_width();
          var _new_extent_x = _extent_x * _canvas_w / _original_main_canvas_w ;
          _glob_wplaneLEFT = _center.x - _new_extent_x / 2.0 ;
          _glob_wplaneRIGHT = _center.x + _new_extent_x / 2.0 ;

          var src_left_up_pt = new point( _glob_wplaneLEFT, _glob_wplaneTOP );
          var src_right_down_pt = new point( _glob_wplaneRIGHT, _glob_wplaneBOTTOM );

          var display_rect = new rect( 0, 0, _canvas_w, _panel_right_height, _RECT_ORIENTATION_SCREEN, "display rect" );
          var client_rect = new rect( 0, 0, _canvas_w, _panel_right_height, _RECT_ORIENTATION_SCREEN, "client rect" );

          wplane_sm.set_coords_corners( src_left_up_pt, src_right_down_pt );
          wplane_sm.set_client_rect( client_rect );
          wplane_sm.set_display_rect( display_rect );
          wplane_sm.accuracy = DEFAULT_MAX_ACCURACY ;

          $( "#WPLANElayers_pile" ).height( _panel_right_height );

          _extent_x = _glob_zplaneRIGHT - _glob_zplaneLEFT ;
          _extent_y = _glob_zplaneTOP - _glob_zplaneBOTTOM ;
          _center.x = ( _glob_zplaneRIGHT + _glob_zplaneLEFT ) / 2.0 ;
          _center.y = ( _glob_zplaneTOP + _glob_zplaneBOTTOM ) / 2.0 ;
          _canvas_w = $( "#" + _grid_zplane_canvas_id ).get(0).get_width();
          _new_extent_x = _extent_x * _canvas_w / _original_other_canvas_w ;
          _glob_zplaneLEFT = _center.x - _new_extent_x / 2.0 ;
          _glob_zplaneRIGHT = _center.x + _new_extent_x / 2.0 ;

          src_left_up_pt = new point( _glob_zplaneLEFT, _glob_zplaneTOP );
          src_right_down_pt = new point( _glob_zplaneRIGHT, _glob_zplaneBOTTOM );

          display_rect = new rect( 0, 0, _canvas_w, _panel_left_height, _RECT_ORIENTATION_SCREEN, "display rect" );
          client_rect = new rect( 0, 0, _canvas_w, _panel_left_height, _RECT_ORIENTATION_SCREEN, "client rect" );

          zplane_sm.set_coords_corners( src_left_up_pt, src_right_down_pt );
          zplane_sm.set_client_rect( client_rect );
          zplane_sm.set_display_rect( display_rect );
          zplane_sm.accuracy = DEFAULT_MAX_ACCURACY ;
     }

     if ( _render )
     {
         var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, _out_channel );
         var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
         var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown message" ;
         if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
         var _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, null, YES, YES, NO, YES, NO, YES, _out_channel );
         var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
				 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "4Unknown error" ;
         if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
     }
}

function circles_lib_canvas_layer_pile_init( _plane_type, _b_clean, _recalc_coords )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
		_b_clean = safe_int( _b_clean, YES ), _recalc_coords = safe_int( _recalc_coords, NO );
    if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
    {
        var _canvas = null, _div_id = "" ;
        for( var _i = 0 ; _i < _glob_zplane_layers_pile_array.length ; _i++ )
        {
             _canvas = _glob_zplane_layers_pile_array[_i] ;
             if ( is_html_canvas( _canvas ) )
             {
                  circles_lib_canvas_layer_init( Z_PLANE_LAYERS_PILE_ID, _recalc_coords,
                                    _canvas.get_iddiv(), _canvas.get_idcanvas(), _canvas.is_visible(), _canvas.get_role_id(), _canvas.get_backgroundcolor(), _b_clean );
             }
        }
    }

    if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
    {
        var _canvas = null, _div_id = "" ;
        for( var _i = 0 ; _i < _glob_wplane_layers_pile_array.length ; _i++ )
        {
             _canvas = _glob_wplane_layers_pile_array[_i] ;
             if ( is_html_canvas( _canvas ) )
             {
                  circles_lib_canvas_layer_init( W_PLANE_LAYERS_PILE_ID, _recalc_coords,
                                    _canvas.get_iddiv(), _canvas.get_idcanvas(), _canvas.is_visible(), _canvas.get_role_id(), _canvas.get_backgroundcolor(), _b_clean );
             }
        }
    }
}

function circles_lib_canvas_layer_pile_build( _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    var _role_array = _plane_type == Z_PLANE ? _glob_zplane_layers_pile_role_array : ( _plane_type == W_PLANE ? _glob_wplane_layers_pile_role_array : null );
    var _layers_array = _plane_type == Z_PLANE ? _glob_zplane_layers_pile_array : ( _plane_type == W_PLANE ? _glob_wplane_layers_pile_array : null );
    var _role_index, _layer_index, _layer ;
    for( var _i = 0 ; _i < _role_array.length ; _i++ )
    {
        _role_index = _role_array[_i] ;
        _layer_index = circles_lib_canvas_layer_find_pos_index( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _role_index );
        _layer = _layers_array[_layer_index] ;
        if ( _layer != null ) $("#"+_layer.get_iddiv() ).zIndex( _i + 1 );
    }
}

function circles_lib_canvas_layer_pile_reset( _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    var _role_array = _plane_type == Z_PLANE ? _glob_zplane_layers_pile_role_array : ( _plane_type == W_PLANE ? _glob_wplane_layers_pile_role_array : null );
    var _length = safe_size( _role_array, 0 );
    if ( !is_array( _role_array ) ) return NO ;

    var _layers_array = _plane_type == Z_PLANE ? _glob_zplane_layers_pile_array : ( _plane_type == W_PLANE ? _glob_wplane_layers_pile_array : null );
    var _layers_array_length = safe_size( _layers_array, 0 );
    if ( _layers_array_length == 0 ) return NO ;
    else
    {
        var _canvas = null, _role, _div_id, _div ;
        for( var _i = 0 ; _i < _layers_array_length ; _i++ )
        {
            // seek for default layer index, otherwise it's a custom array in the input pile
            _role = _role_array[_i] != null ? _role_array[_i] : 0 ;
            _canvas = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _role );
            _div_id = is_html_canvas( _canvas ) ? _canvas.get_iddiv() : null ;
            if ( $("#"+_div_id ).get(0) != null ) $("#"+_div_id ).zIndex( _i + 1 );
        }
    }

    var _top_canvas = circles_lib_canvas_get_topmost( _plane_type );
    if ( _plane_type == Z_PLANE && is_html_canvas( _top_canvas ) )
    {
        _glob_zplane_topmost_canvas_placeholder = _top_canvas ;
        circles_lib_events_bind_to_zplane( _top_canvas );
    }
    else if ( _plane_type == W_PLANE && is_html_canvas( _top_canvas ) )
    {
        _glob_wplane_topmost_canvas_placeholder = _top_canvas ;
        circles_lib_events_bind_to_wplane( _top_canvas );
    }

    return YES ;
}

function circles_lib_canvas_layer_pile_get_default( _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    var _layers_pile = circles_lib_canvas_layer_pile_get( _plane_type );
    if ( !is_array( _layers_pile ) ) return null ;
    else
    {
        var _default_layers_pile = [] ;
        $.each( _layers_pile, function( _i, _layer ) { if ( _layer.is_defaultcanvas() ) _default_layers_pile.push( _layer ); } );
        return _default_layers_pile.length == 0 ? null : _default_layers_pile.clone();
    }
}

function circles_lib_canvas_layer_pile_get_per_plane( _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    if ( _plane_type.is_one_of( Z_PLANE ) ) // Z-plane
    return _glob_zplane_layers_pile_array.clone();
    else if ( _plane_type.is_one_of( W_PLANE ) ) // W-plane
    return _glob_wplane_layers_pile_array.clone();
    else return null ;
}

function circles_lib_canvas_layer_pile_clean_per_plane( _plane_type, _role, _silent, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _role = safe_float( _role, UNDET ), _silent = safe_float( _silent, YES ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _layers_array = null ;
    if ( _plane_type == Z_PLANE ) _layers_array = _glob_zplane_layers_pile_array ;
    else if ( _plane_type == W_PLANE ) _layers_array = _glob_wplane_layers_pile_array ;
    else
    {
        var _msg = "Missing input plane type" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
        return [ RET_ERROR, _msg ] ;
    }

    var _L = safe_size( _layers_array, 0 );
    if ( _L > 0 )
    {
         var _canvas = null, _bkcolor ;
         for( var _i = 0 ; _i < _L ; _i++ )
         {
             _canvas = _layers_array[_i] ;
             _bkcolor = _canvas.get_backgroundcolor() != null ? _canvas.get_backgroundcolor() : "rgba( 255, 255, 255, 0 )" ;
             if ( is_html_canvas( _canvas ) && ( _role == UNDET || _canvas.get_role_id() == _role ) ) circles_lib_canvas_clean( _canvas, _bkcolor, _out_channel );
         }

         var _msg = "Layers have been cleaned with success" ;
         if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app );
         return [ RET_OK, _msg ] ;
    }
    else
    {
         var _msg = circles_lib_plane_get_def( _plane_type ) + " layers list is empty" ;
         if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
         return [ RET_ERROR, _msg ] ;
    }
}

function circles_lib_canvas_layer_pile_build_dropdown( _dropdown_id, _onchangecode, _plane_type )
{
    /*
      _new_layer.getContext(_glob_canvas_ctx_2D_mode).idcanvas = _canvas_id ;
      _new_layer.getContext(_glob_canvas_ctx_2D_mode).iddiv = _div_id ;
      _new_layer.getContext(_glob_canvas_ctx_2D_mode).type = _plane_type ;
      _new_layer.getContext(_glob_canvas_ctx_2D_mode).role = _role_index ;
      _new_layer.getContext(_glob_canvas_ctx_2D_mode).role_def = _role_def ;
      _new_layer.getContext(_glob_canvas_ctx_2D_mode).label = _plane_def + " " + _role_def ;
      _new_layer.getContext(_glob_canvas_ctx_2D_mode).plane_def = _plane_def ;
      _new_layer.getContext(_glob_canvas_ctx_2D_mode).defaultcanvas = _default_canvas ;
      _new_layer.getContext(_glob_canvas_ctx_2D_mode).visible = _visible ;
      _new_layer.getContext(_glob_canvas_ctx_2D_mode).backgroundColor = "transparent" ;
    */
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _dropdown_id = safe_string( _dropdown_id, "" ).trim() ;
    _onchangecode = safe_string( _onchangecode, "" ).trim() ;
    if ( _plane_type.is_one_of( Z_PLANE, W_PLANE ) && _dropdown_id.length > 0 )
    {
         var _layers_pile = circles_lib_canvas_layer_pile_get( _plane_type ), _ctx, _chunk ;
         var HTMLcode = "<SELECT ID=\""+_dropdown_id+"\" "+( _onchangecode.length > 0 ? "ONCHANGE=\"javascript:"+_onchangecode+"\"" : "" )+">" ;
         $.each( _layers_pile,
                 function( _i, _layer )
                 {
                    _ctx = _layer.getContext( _glob_canvas_ctx_2D_mode );
                    _chunk = [ _ctx.idcanvas, _ctx.type, _ctx.role_def ] ;
                    HTMLcode += "<OPTION STYLE=\"color:"+( _ctx.visible ? DEFAULT_COLOR_STD : "#D0D0D0" )+";\" ; VALUE=\""+_chunk.join( "@" )+"\">" + _ctx.role_def ;
                 }
               ) ;
         HTMLcode += "</SELECT>" ;
         return HTMLcode ;
    }
    else return "" ;
}