function circles_lib_interface_default()
{
    var VIEWPORTscreenDIMS = getViewportExtents();
    var VIEWPORTwidth = VIEWPORTscreenDIMS[0], VIEWPORTheight = VIEWPORTscreenDIMS[1] ;
    var _menu_height = 48, _upper_labels_height = 28, _blank_heights = 8 ;
    var _heights_sum = _menu_height + _upper_labels_height + _blank_heights ;
    var candidateSIZE_1 = safe_int( VIEWPORTheight - _heights_sum, 0 );
    var candidateSIZE_2 = safe_int( VIEWPORTwidth / 2.0, 0 );
    var _canvas_side = Math.min( candidateSIZE_1, candidateSIZE_2 );
        _canvas_side -= 22 ;
    var PATH = 'interface/circles.interface.default.html' ;
    $('#interfacecontainer').hide().load( PATH, function()
                                                {
                                                   var _status = arguments[1].toLowerCase();
                                                   _glob_interface_index = _status.strcmp( "success" ) ? INTERFACE_DEFAULT : INTERFACE_NONE ;
                                                   if ( _glob_interface_index == INTERFACE_NONE ) _canvas_side = 0 ;
                                                }
                                                ).delay(1.5).show(0, function(){circles_lib_menu_entries_update();});
    return _canvas_side ;
}

function circles_lib_interface_reset( _opt, _clean, _question, _silent, _output_channel )
{
		_opt = safe_int( _opt, INTERFACE_EXTEND_NONE );
		_clean = safe_int( _clean, NO );
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _q_text = "" ;
    if ( _opt.is_one_of( INTERFACE_EXTEND_ZPLANE, INTERFACE_EXTEND_WPLANE ) )
    _q_text = "Confirm to reset coordinates for the extended "+(_opt==INTERFACE_EXTEND_ZPLANE?"Z":"W")+"-plane ?" ;
    else if ( _opt == INTERFACE_EXTEND_NONE )
    _q_text = "Confirm to reset coordinates for the both Z-plane and W-plane ?" ;
    else return [ NO, "Invalid interface option" ] ;

    var _b_go = !_question ? YES : ( confirm( _q_text ) ? YES : NO );
    var _ret_id = NO, _ret_msg = "" ;
    switch( _opt )
    {
				case INTERFACE_EXTEND_NONE:
        // reset to default settings : z-plane w/ w-plane
        _glob_zplaneTOP = DEFAULT_PLANE_COORD, _glob_zplaneLEFT = -DEFAULT_PLANE_COORD ;
        _glob_zplaneRIGHT = DEFAULT_PLANE_COORD, _glob_zplaneBOTTOM = -DEFAULT_PLANE_COORD ;
        _glob_wplaneTOP = DEFAULT_PLANE_COORD, _glob_wplaneLEFT = -DEFAULT_PLANE_COORD ;
        _glob_wplaneRIGHT = DEFAULT_PLANE_COORD, _glob_wplaneBOTTOM = -DEFAULT_PLANE_COORD ;
        circles_lib_interface_extend( _opt, _clean, new point( 0, 0 ) ) ;
				_msg = "Interface has been reset to default configuration" ;
				break ;
				case INTERFACE_EXTEND_ZPLANE:
        _glob_zplaneTOP = DEFAULT_PLANE_COORD ;
        _glob_zplaneBOTTOM = -DEFAULT_PLANE_COORD ;
        zplane_sm.set_coords_rect( new rect( _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
        circles_lib_interface_extend( _opt, _clean, new point( 0, 0 ) ) ;
        _ret_id = YES ;
        _ret_msg = "Z-plane extended interface has been reset to with success" ;
        break ;
				case INTERFACE_EXTEND_WPLANE:
        _glob_wplaneTOP = DEFAULT_PLANE_COORD ;
        _glob_wplaneBOTTOM = -DEFAULT_PLANE_COORD ;
        wplane_sm.set_coords_rect( new rect( _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ) ) ;
        circles_lib_interface_extend( _opt, _clean, new point( 0, 0 ) ) ;
        _ret_id = YES ;
        _ret_msg = "W-plane extended interface has been reset to with success" ;
        break ;
        default:
        _ret_id = NO ;
        _msg = "Invalid interface option" ;
        break ;
    }
    
    circles_lib_menu_entries_update() ;

    if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, _ret_id ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _glob_app_title );
    return [ _ret_id, _ret_msg ] ;
}

function circles_lib_interface_extend( _opt, _clean, _center_pt, _render, _output_channel )
{
		_opt = safe_int( _opt, INTERFACE_EXTEND_NONE ), _clean = safe_int( _clean, NO ), _render = safe_int( _render, YES );
		_output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    if ( !is_point( _center_pt ) ) _center_pt = null ;
		var _menu_width = $( "#menu" ).width();
		var _zplane_def = circles_lib_plane_get_def_for_cmds( Z_PLANE ), _wplane_def = circles_lib_plane_get_def_for_cmds( W_PLANE );
		var _layers_ref = null ;
		_glob_interface_index = _opt ;
    switch( _opt )
    {
				case INTERFACE_EXTEND_NONE:
        // reset to default settings : z-plane w/ w-plane
        circles_lib_canvas_layer_pile_resize_to_default( YES, YES, _output_channel );
        if ( _render )
        {
            var _ret_chunk = circles_lib_canvas_render_wplane(null,null,null,_clean,NO,NO,NO,NO,YES,_output_channel);
	          var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
					  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "24Unknown error" ;
					  if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
    				circles_lib_canvas_redraw_wplane_entities( YES, null, _output_channel ) ;
        }
				break ;
				case INTERFACE_EXTEND_ZPLANE:
				$( "#WPLANEtd" ).width(0);
				$( "#PANELright" ).width(0);
				$( "#PANELright" ).hide();
				$( "[id^=CANVAS"+_wplane_def+"]" ).width(0) ;
				$( "[id^=CANVAS"+_wplane_def+"]" ).hide() ;
				
				_layers_ref = _glob_zplane_layers_pile_array ;
				$( "#ZPLANEtd" ).width(_menu_width);
				$( "#PANELleft" ).show();
				$( "#PANELleft" ).width(_menu_width);
				$( "#ZplaneCOORDScontainer" ).width(_menu_width);
				$( "[id^=CANVAS"+_zplane_def+"]" ).width(_menu_width) ;
				
				var _old_client_w = $("#ZPLANElayers_pile").width();
				$("#ZPLANElayers_pile").width(_menu_width-12);
				var _new_client_w = $("#ZPLANElayers_pile").width();
				var _new_client_h = $("#WPLANElayers_pile").height();

		    var _z_pile_left = $("#ZPLANElayers_pile").offset().left ;
		    var _z_pile_top = $("#ZPLANElayers_pile").offset().top ;

		    $.each( _layers_ref,
		            function( _index, _layer )
		            {
	                $( "#" + _layer.get_iddiv() ).css( "left", _w_pile_left );
	                $( "#" + _layer.get_iddiv() ).css( "top", _w_pile_top );
	                $( "#" + _layer.get_idcanvas() ).css( "left", _w_pile_left );
	                $( "#" + _layer.get_idcanvas() ).css( "top", _w_pile_top );
	                $( "#" + _layer.get_iddiv() ).css( "display", "block" );
		
	                $( "#" + _layer.get_iddiv() ).width( _new_client_w ) ;
	                $( "#" + _layer.get_idcanvas() ).get(0).set_width( _new_client_w ) ;
                  $( "#" + _layer.get_idcanvas() ).get(0).set_visible(YES);
		            } );
		            
		    var _coords_rect = zplane_sm.get_coords_rect();
		    var _center = is_point( _center_pt ) ? _center_pt : _coords_rect.center();
		    var _client_rect = zplane_sm.get_client_rect();
		    var _coords_w = _coords_rect.width(), _coords_h = _coords_rect.height() ;
		    var _client_w = _client_rect.width() ;
        var _aspect_ratio = _new_client_w / _new_client_h ;
		    var _new_coords_w = ( _aspect_ratio * _coords_h ).roundTo(2) ;

		    var _new_left_top = new point( _center.x - _new_coords_w / 2.0, _center.y + _coords_h / 2.0 ) ;
		    var _new_right_bottom = new point( _center.x + _new_coords_w / 2.0, _center.y - _coords_h / 2.0 ) ;
		    var _new_rect = new rect( _new_left_top, _new_right_bottom, _RECT_ORIENTATION_CARTESIAN );

        _glob_zplaneLEFT = _new_left_top.x ;
        _glob_zplaneTOP = _new_left_top.y ;
        _glob_zplaneRIGHT = _new_right_bottom.x ;
        _glob_zplaneBOTTOM = _new_right_bottom.y ;
        
		    circles_lib_coordinates_set_core( null, null, Z_PLANE, YES, YES ) ;
		    circles_lib_plugin_dispatcher_unicast_message( "coordinates", "forms", POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS ) ;
        var _ret_chunk = circles_lib_canvas_render_zplane(null,null,null,_clean,YES,_render,NO,YES,YES,_output_channel);
	      var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
	      var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "25Unknown error" ;
	      if ( _ret_id == RET_ERROR ) CIRCLESaddLOG( _ret_msg, LOG_ERROR );
				break ;
				case INTERFACE_EXTEND_WPLANE:
        $( "#ZPLANEtd" ).width(0);
				$( "#PANELleft" ).width(0);
				$( "#PANELleft" ).hide();
				$( "[id^=CANVAS"+_zplane_def+"]" ).width(0) ;
				$( "[id^=CANVAS"+_zplane_def+"]" ).hide() ;
				
				_layers_ref = _glob_wplane_layers_pile_array ;
				$( "#WPLANEtd" ).width(_menu_width);
				$( "#PANELright" ).show();
				$( "#PANELright" ).width(_menu_width);
				$( "#WplaneCOORDScontainer" ).width(_menu_width);
				$( "[id^=CANVAS"+_wplane_def+"]" ).width(_menu_width) ;
				
				var _old_client_w = $("#WPLANElayers_pile").width();
				$("#WPLANElayers_pile").width(_menu_width-12);
				var _new_client_w = $("#WPLANElayers_pile").width();
				var _new_client_h = $("#ZPLANElayers_pile").height();

		    var _w_pile_left = $("#WPLANElayers_pile").offset().left ;
		    var _w_pile_top = $("#WPLANElayers_pile").offset().top ;

		    $.each( _layers_ref,
		            function( _index, _layer )
		            {
	                $( "#" + _layer.get_iddiv() ).css( "left", _w_pile_left );
	                $( "#" + _layer.get_iddiv() ).css( "top", _w_pile_top );
	                $( "#" + _layer.get_idcanvas() ).css( "left", _w_pile_left );
	                $( "#" + _layer.get_idcanvas() ).css( "top", _w_pile_top );
	                $( "#" + _layer.get_iddiv() ).css( "display", "block" );
		
	                $( "#" + _layer.get_iddiv() ).width( _new_client_w ) ;
	                $( "#" + _layer.get_idcanvas() ).get(0).set_width( _new_client_w ) ;
                  $( "#" + _layer.get_idcanvas() ).get(0).set_visible(YES);
		            } );
		            
		    var _coords_rect = wplane_sm.get_coords_rect();
		    var _center = is_point( _center_pt ) ? _center_pt : _coords_rect.center();
		    var _client_rect = wplane_sm.get_client_rect();
		    var _coords_w = _coords_rect.width() ;
		    var _coords_h = _coords_rect.height() ;
		    var _client_w = _client_rect.width() ;
        var _aspect_ratio = _new_client_w / _new_client_h ;
		    var _new_coords_w = ( _aspect_ratio * _coords_h ).roundTo(2) ;

		    var _new_left_top = new point( _center.x - _new_coords_w / 2.0, _center.y + _coords_h / 2.0 ) ;
		    var _new_right_bottom = new point( _center.x + _new_coords_w / 2.0, _center.y - _coords_h / 2.0 ) ;
		    var _new_rect = new rect( _new_left_top, _new_right_bottom, _RECT_ORIENTATION_CARTESIAN );

        _glob_wplaneLEFT = _new_left_top.x ;
        _glob_wplaneTOP = _new_left_top.y ;
        _glob_wplaneRIGHT = _new_right_bottom.x ;
        _glob_wplaneBOTTOM = _new_right_bottom.y ;
        
		    circles_lib_coordinates_set_core( null, null, W_PLANE, YES, YES ) ;
        var _ret_chunk = circles_lib_canvas_render_wplane(null, null, [ ROLE_GRID ], _clean,_clean,_render,NO,NO,YES,_output_channel);
        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
			  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "26Unknown error" ;
			  if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
        if ( _render ) circles_lib_canvas_redraw_wplane_entities( YES, null, _output_channel ) ;
				break ;
        default: break ;
		}

		circles_lib_interface_calc_aspect_ratio() ;
    circles_lib_menu_entries_update() ;
}

function circles_lib_interface_toggle( _force_action, _output_channel )
{
    _force_action = safe_int( _force_action, INTERFACE_FORCE_NONE );
    _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _show = $( "#interfacecontainer" ).css( "display" ).toLowerCase() ;
    if ( !_show.is_one_of_i( "block", "none" ) ) _show = "block" ;

    // force reverse display status, so subsequent code manages it as usual
    if ( _force_action == INTERFACE_FORCE_SHOW ) _show = "none" ;
    else if ( _force_action == INTERFACE_FORCE_HIDE ) _show = "block" ;

    _show.strcmp( "block" ) ? $( "#interfacecontainer" ).fadeOut( "fast", function() {} ) : $( "#interfacecontainer" ).fadeIn( "slow", function(){} ) ;
    _glob_interface_show = !_glob_interface_show ;
    circles_lib_menu_entries_update();
    switch( _glob_interface_index )
    {
       case INTERFACE_EXTEND_NONE:
       var _all_layers_pile = circles_lib_canvas_layer_pile_get( Z_PLANE ).concat( circles_lib_canvas_layer_pile_get( W_PLANE ) ) ;
       $.each( _all_layers_pile, function( _i, _layer ) { _show.strcmp( "block" ) ? $( "#" + _layer.get_iddiv() ).hide() : $( "#" + _layer.get_iddiv() ).show() ; } ) ;
       if ( _glob_interface_show ) circles_lib_canvas_layer_pile_resize_to_default( NO, YES, _output_channel ) ;
       break ;
       case INTERFACE_EXTEND_ZPLANE:
       var _all_layers_pile = circles_lib_canvas_layer_pile_get( Z_PLANE ) ;
       $.each( _all_layers_pile, function( _i, _layer ) { _show.strcmp( "block" ) ? $( "#" + _layer.get_iddiv() ).hide() : $( "#" + _layer.get_iddiv() ).show() ; } ) ;
       break ;
       case INTERFACE_EXTEND_WPLANE:
       var _all_layers_pile = circles_lib_canvas_layer_pile_get( W_PLANE ) ;
       $.each( _all_layers_pile, function( _i, _layer ) { _show.strcmp( "block" ) ? $( "#" + _layer.get_iddiv() ).hide() : $( "#" + _layer.get_iddiv() ).show() ; } ) ;
       break ;
       default: break ;
    }
}

function circles_lib_interface_render()
{
    var VIEWPORTscreenDIMS = getViewportExtents();
    var VIEWPORTwidth = VIEWPORTscreenDIMS[0], VIEWPORTheight = VIEWPORTscreenDIMS[1] ;
    var SIZE = _glob_canvas_width ;

    $("#"+Z_PLANE_LAYERS_PILE_ID ).css( "width", _glob_canvas_width + "px" );
    $("#"+Z_PLANE_LAYERS_PILE_ID ).css( "height", _glob_canvas_width + "px" );
    $("#"+W_PLANE_LAYERS_PILE_ID ).css( "width", _glob_canvas_width + "px" );
    $("#"+W_PLANE_LAYERS_PILE_ID ).css( "height", _glob_canvas_width + "px" );
    
    var MASTER_SIDE = _glob_zplane_rendering_canvas_placeholder != null ? _glob_zplane_rendering_canvas_placeholder.get_width() : _glob_canvas_width ;
    var MASTER_BORDER = 0 ;
    
    circles_lib_zplane_mapper_init( _glob_canvas_width, MASTER_BORDER, YES );
    circles_lib_wplane_mapper_init( _glob_canvas_width, MASTER_BORDER, YES );
    
    $("#PANELleft").slideDown("fast");
    $("#PANELright").slideDown("fast");
    var SIDE = _glob_canvas_width ;
    var _index = circles_lib_canvas_layer_find_pos_index( Z_PLANE, FIND_LAYER_BY_ROLE_DEF, "rendering" );
    if ( _glob_zplane_layers_pile_array[_index] != null )
    {
       _glob_zplane_layers_pile_array[_index].set_width( SIDE );
       _glob_zplane_layers_pile_array[_index].set_height( SIDE ) ;
    }

    _index = circles_lib_canvas_layer_find_pos_index( W_PLANE, FIND_LAYER_BY_ROLE_DEF, "rendering" );
    if ( ( _glob_wplane_layers_pile_array[_index] != null ) )
    {
       _glob_wplane_layers_pile_array[_index].set_width( SIDE );
       _glob_wplane_layers_pile_array[_index].set_height( SIDE );
    }

    $("#"+Z_PLANE_LAYERS_PILE_ID ).css( "width", SIDE + "px" );
    $("#"+Z_PLANE_LAYERS_PILE_ID ).css( "height", SIDE + "px" );

    $("#"+W_PLANE_LAYERS_PILE_ID ).css( "width", SIDE + "px" );
    $("#"+W_PLANE_LAYERS_PILE_ID ).css( "height", SIDE + "px" );

    // set up the map according to canvas size
    var src_left_up_pt = new point( _glob_zplaneLEFT, _glob_zplaneTOP );
    var src_right_down_pt = new point( _glob_zplaneRIGHT, _glob_zplaneBOTTOM );
              
    var wplane_left_up_pt = new point( _glob_wplaneLEFT, _glob_wplaneTOP );
    var wplane_right_down_pt = new point( _glob_wplaneRIGHT, _glob_wplaneBOTTOM );
              
    var MASTER_SIDE = SIDE, MASTER_BORDER = 0 ;
              
    var display_rect = new rect( MASTER_BORDER, MASTER_BORDER, MASTER_SIDE - MASTER_BORDER, MASTER_SIDE - MASTER_BORDER, _RECT_ORIENTATION_SCREEN, "display rect" );
    var client_rect = new rect( 0, 0, MASTER_SIDE, MASTER_SIDE, _RECT_ORIENTATION_SCREEN, "client rect" );
              
    zplane_sm.set_coords_corners( src_left_up_pt, src_right_down_pt );
    zplane_sm.set_client_rect( client_rect );
    zplane_sm.set_display_rect( display_rect );
    
    wplane_sm.set_coords_corners( wplane_left_up_pt, wplane_right_down_pt );
    wplane_sm.set_client_rect( client_rect );
    wplane_sm.set_display_rect( display_rect );
      
    $("#ZplaneCOORDScontainer").show();
    $("#WplaneCOORDScontainer").show();
                  
    _glob_smpr = Math.ceil( SIDE / 3 );
}

function circles_lib_interface_prepare()
{
    $("#"+Z_PLANE_LAYERS_PILE_ID ).css( "width", _glob_canvas_width + "px" );
    $("#"+Z_PLANE_LAYERS_PILE_ID ).css( "height", _glob_canvas_width + "px" );

    $("#"+W_PLANE_LAYERS_PILE_ID ).css( "width", _glob_canvas_width + "px" );
    $("#"+W_PLANE_LAYERS_PILE_ID ).css( "height", _glob_canvas_width + "px" );

    var MASTER_SIDE = _glob_zplane_rendering_canvas_placeholder != null ? _glob_zplane_rendering_canvas_placeholder.get_width() : _glob_canvas_width ;
    var MASTER_BORDER = 0 ;
    
    circles_lib_zplane_mapper_init( _glob_canvas_width, MASTER_BORDER, YES );
    circles_lib_wplane_mapper_init( _glob_canvas_width, MASTER_BORDER, YES );
}