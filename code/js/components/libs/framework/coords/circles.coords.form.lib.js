function circles_lib_coordinates_shift( _where, _plane_type, _scalar_shift, _silent, _output_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _where = safe_string( _where, "" ).toLowerCase();
    var _plane_def = circles_lib_plane_get_def( _plane_type );
    _scalar_shift = safe_float( _scalar_shift, UNDET );
    _silent = safe_int( _silent, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var left = null, right = null, top = null, bottom = null ;
    var _form_panel_src = $("#PLANEleft").get(0) != null ? YES : NO ;
    if ( _form_panel_src )
    {
        left = safe_float( $("#PLANEleft").val(), null );
        right = safe_float( $("#PLANEright").val(), null );
        top = safe_float( $("#PLANEtop").val(), null );
        bottom = safe_float( $("#PLANEbottom").val(), null );
    }
    else
    {
        switch( _plane_type )
        {
            case Z_PLANE:
            left = _glob_zplaneLEFT, right = _glob_zplaneRIGHT ;
            top = _glob_zplaneTOP, bottom = _glob_zplaneBOTTOM ;
            break ;
            case W_PLANE:
            left = _glob_wplaneLEFT, right = _glob_wplaneRIGHT ;
            top = _glob_wplaneTOP, bottom = _glob_wplaneBOTTOM ;
            break ;
            case BIP_BOX:
            left = _glob_bipLEFT, right = _glob_bipRIGHT ;
            top = _glob_bipTOP, bottom = _glob_bipBOTTOM ;
            break ;
            default: break ;
        }
    }

    if ( left != null && right != null && top != null && bottom != null )
    {
        var _shift_rate = Math.pow( 2, 3 ), dX = 0 , dY = 0 ;
        if ( _scalar_shift != UNDET ) dX = dY = _shift_rate = _scalar_shift ;
        else
        {
            dX = right - left, dY = top - bottom ;
            dX = dX / _shift_rate, dY = dY / _shift_rate ;
        }
          
        if ( dX != 0 && dY != 0 )
        {
            switch( _where )
            {
               case "left" : left -= dX, right -= dX ; break ;
               case "right" : left += dX, right += dX ; break ;
               case "top" : top += dY, bottom += dY ; break ;
               case "bottom" : top -= dY, bottom -= dY ; break ;
               default: return [ RET_ERROR, "Can't shift coords: unknown parameter '"+_where+"'" ] ; break ;
            }

            if ( _form_panel_src )
            {
               $("#PLANEleft").val( left );
               $("#PLANEright").val( right );
               $("#PLANEtop").val( top );
               $("#PLANEbottom").val( bottom );
            }

            switch( _plane_type )
            {
                case Z_PLANE:
                distribute_vals( [ "_glob_zplaneLEFT", "_glob_zplaneRIGHT", "_glob_zplaneTOP", "_glob_zplaneBOTTOM" ],
                                 [ left, right, top, bottom ] );
                break ;
                case W_PLANE:
                distribute_vals( [ "_glob_wplaneLEFT", "_glob_wplaneRIGHT", "_glob_wplaneTOP", "_glob_wplaneBOTTOM" ],
                                 [ left, right, top, bottom ] );
                break ;
                case BIP_BOX:
                distribute_vals( [ "_glob_bipLEFT", "_glob_bipRIGHT", "_glob_bipTOP", "_glob_bipBOTTOM" ],
                                 [ left, right, top, bottom ] );
                break ;
                case D_LOCUS:
                distribute_vals( [ "_glob_dlocusLEFT", "_glob_dlocusRIGHT", "_glob_dlocusTOP", "_glob_dlocusBOTTOM" ],
                                 [ left, right, top, bottom ] );
                break ;
                default:
                break ;
            }
               
            if ( _where.is_one_of( "left", "right" ) ) _where = "to the " + _where ;
            return [ RET_OK, _plane_def + " coordinates shifted "+_where+" by "+_shift_rate+" with success" ] ;
       }
       else
       {
            if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
            {
                distribute_vals( [ "_glob_zplaneLEFT", "_glob_zplaneRIGHT", "_glob_zplaneTOP", "_glob_zplaneBOTTOM" ],
                                 [ -DEFAULT_PLANE_COORD, DEFAULT_PLANE_COORD, DEFAULT_PLANE_COORD, -DEFAULT_PLANE_COORD ] );
            }
            else if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
            {
                distribute_vals( [ "_glob_wplaneLEFT", "_glob_wplaneRIGHT", "_glob_wplaneTOP", "_glob_wplaneBOTTOM" ],
                                 [ -DEFAULT_PLANE_COORD, DEFAULT_PLANE_COORD, DEFAULT_PLANE_COORD, -DEFAULT_PLANE_COORD ] );
            }
            else if ( _plane_type == BIP_BOX )
            {
                distribute_vals( [ "_glob_bipLEFT", "_glob_bipRIGHT", "_glob_bipTOP", "_glob_bipBOTTOM" ],
                                 [ -DEFAULT_PLANE_COORD, DEFAULT_PLANE_COORD, DEFAULT_PLANE_COORD, -DEFAULT_PLANE_COORD ] );
            }
            else if ( _plane_type == D_LOCUS )
            {
                distribute_vals( [ "_glob_dlocusLEFT", "_glob_dlocusRIGHT", "_glob_dlocusTOP", "_glob_dlocusBOTTOM" ],
                                 [ -DEFAULT_PLANE_COORD, DEFAULT_PLANE_COORD, DEFAULT_PLANE_COORD, -DEFAULT_PLANE_COORD ] );
            }

            if ( _form_panel_src )
            {
                $("#PLANEleft").val( -DEFAULT_PLANE_COORD );
                $("#PLANEright").val( DEFAULT_PLANE_COORD );
                $("#PLANEtop").val( DEFAULT_PLANE_COORD );
                $("#PLANEbottom").val( -DEFAULT_PLANE_COORD );
            }

            var _msg = "Can't shift: input "+_plane_def+" coordinates are invalid and then reset to default values" ;
            if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
            return [ RET_ERROR, _msg ] ;
        }
    }
    else
    {
        if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, SYSTEM_ERROR_08, _glob_app_title );
        return [ RET_ERROR, SYSTEM_ERROR_08 ] ;
    }
}

function circles_lib_coordinates_zoomtofit( _plane_type, _render, _question, _silent, _output_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
		_render = safe_int( _render, YES );
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var MAXleft = 0, MAXright = 0, MAXup = 0, MAXdown = 0, ERR = 0 ;
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
    {
        var _items_n = circles_lib_count_items(_items_array);
        if ( _items_n > 0 )
        {
           var ITEM, circle, center, radius, cross_left, cross_right, cross_up, cross_down, _mask ;
           for( var i = 0 ; i < _items_n ; i++ )
           {
               ITEM = _items_array[i] ;
               if ( !is_item_obj( ITEM ) ) continue ;
               _mask = is_circle( ITEM.complex_circle ) ? 1 : 0 ;
               circle = _mask & 1 ? ITEM.complex_circle : null ;
               if ( is_circle( circle ) )
               {
                  center = circle.center, radius = circle.radius ;
                  cross_left = center.x - radius, cross_right = center.x + radius ;
                  cross_up = center.y + radius, cross_down = center.y - radius ;
                  MAXleft = MAXleft == 0 ? cross_left : Math.min( MAXleft, cross_left );
                  MAXright = MAXright == 0 ? cross_right : Math.max( MAXright, cross_right );
                  MAXup = MAXup == 0 ? cross_up : Math.max( MAXup, cross_up );
                  MAXdown = MAXdown == 0 ? cross_down : Math.min( MAXdown, cross_down );
               }
               else
               {
                  ERR = 1 ;
                  break ;
               }
           }
        }
        else ERR = 2 ;
    }
    else if ( _plane_type == BIP_BOX )
    {
	      MAXleft = safe_int( _glob_bipLEFTtmp, 0 ), MAXright = safe_int( _glob_bipRIGHTtmp, 0 );
	      MAXup = safe_int( _glob_bipTOPtmp, 0 ), MAXdown = safe_int( _glob_bipBOTTOMtmp, 0 );
	      if ( MAXleft == MAXright || MAXup == MAXdown ) ERR = 3 ;
    }
    else return [ RET_ERROR, "'To fit' option does not work with the w-plane" ] ;

    if ( ERR != 0 )
    {
	      var MSG = "" ;
	      if ( ERR == 1 )      MSG = "Can't perform this operation."+_glob_crlf+"Circles shall be initialized first" ;
	      else if ( ERR == 2 ) MSG = "Can't perform this operation."+_glob_crlf+_ERR_33_01 ;
	      else if ( ERR == 3 ) MSG = "Can't perform this operation."+_glob_crlf+"It seems that no W-plane diagram has been processed yet" ;
	      if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, MSG, _glob_app_title );
	      return [ RET_ERROR, MSG ] ;
    }
    else if ( ERR == 0 )
    {
       var MIDpoint = new point( ( MAXleft + MAXright ) / 2.0, ( MAXup + MAXdown ) / 2.0 );
       var Xside = MAXright - MAXleft, Yside = MAXup - MAXdown ;
       var MAX = Math.max( Xside, Yside ) / 2.0 ;
       var _b_go = !_question ? YES : ( confirm( "Confirm to rescale this view to fit circles coordinates ?" ) ? YES : NO );
       if ( _b_go )
       {
           if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
           {
             _glob_zplaneLEFT = MIDpoint.x - MAX ;
             _glob_zplaneRIGHT = MIDpoint.x + MAX ;
             _glob_zplaneTOP = MIDpoint.y + MAX ;
             _glob_zplaneBOTTOM = MIDpoint.y - MAX ;
           }
           else if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
           {
             _glob_wplaneLEFT = MIDpoint.x - MAX ;
             _glob_wplaneRIGHT = MIDpoint.x + MAX ;
             _glob_wplaneTOP = MIDpoint.y + MAX ;
             _glob_wplaneBOTTOM = MIDpoint.y - MAX ;
           }
           else if ( _plane_type == BIP_BOX )
           {
             _glob_bipLEFT = MIDpoint.x - MAX ;
             _glob_bipRIGHT = MIDpoint.x + MAX ;
             _glob_bipTOP = MIDpoint.y + MAX ;
             _glob_bipBOTTOM = MIDpoint.y - MAX ;
           }
    
           return circles_lib_coordinates_set_core( null, null, _plane_type, _silent, _render, YES, _output_channel );
       }
       else return [ RET_ERROR, "Operation halted by user" ] ;
    }
}

function circles_lib_coordinates_reset( _plane_type, _render, _question, _silent, _output_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _render = safe_int( _render, YES );
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var MSG = "Confirm to reset coordinates for the " + circles_lib_plane_get_def( _plane_type ) + " plane ?";
    var _b_go = !_question ? YES : confirm( MSG );
    if ( _b_go )
    {
        $("#PLANEleft").val( -DEFAULT_PLANE_COORD );
        $("#PLANEtop").val( DEFAULT_PLANE_COORD );
        $("#PLANEright").val( DEFAULT_PLANE_COORD );
        $("#PLANEbottom").val( -DEFAULT_PLANE_COORD );
        return CIRCLESformsCOORDINATESinputMANAGER( _plane_type, _render );
    }
    else return [ RET_ERROR, "Operation halted by user" ] ;
}

function circles_lib_coordinates_set_core( _input_canvas, _mapper, _plane_type, _silent, _render, _output_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
		_silent = safe_int( _silent, NO ), _render = safe_int( _render, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _plane_label = circles_lib_plane_get_def( _plane_type );
    var LEFT, TOP, RIGHT, BOTTOM ;
    switch( _plane_type )
    {
       case Z_PLANE:
       LEFT = _glob_zplaneLEFT, TOP = _glob_zplaneTOP, RIGHT = _glob_zplaneRIGHT, BOTTOM = _glob_zplaneBOTTOM ;
       zplane_sm.set_coords_corners( new point( LEFT, TOP ), new point( RIGHT, BOTTOM ) );
       if ( !is_screen_mapper( _mapper ) ) _mapper = zplane_sm.copy() ;
       break ;
       case W_PLANE:
       LEFT = _glob_wplaneLEFT, TOP = _glob_wplaneTOP, RIGHT = _glob_wplaneRIGHT, BOTTOM = _glob_wplaneBOTTOM ;
       wplane_sm.set_coords_corners( new point( LEFT, TOP ), new point( RIGHT, BOTTOM ) );
       if ( !is_screen_mapper( _mapper ) ) _mapper = wplane_sm.copy() ;
       break ;
       case BIP_BOX:
       LEFT = _glob_bipLEFT, TOP = _glob_bipTOP, RIGHT = _glob_bipRIGHT, BOTTOM = _glob_bipBOTTOM ;
       bipbox_sm.set_coords_corners( new point( LEFT, TOP ), new point( RIGHT, BOTTOM ) );
       if ( !is_screen_mapper( _mapper ) ) _mapper = bipbox_sm.copy() ;
       break ;
       case D_LOCUS:
       LEFT = _glob_dlocusLEFT, TOP = _glob_dlocusTOP, RIGHT = _glob_dlocusRIGHT, BOTTOM = _glob_dlocusBOTTOM ;
       dlocus_sm.set_coords_corners( new point( LEFT, TOP ), new point( RIGHT, BOTTOM ) );
       if ( !is_screen_mapper( _mapper ) ) _mapper = dlocus_sm.copy() ;
       break ;
       default: break ;
    }

    if ( LEFT > RIGHT )
    {
       var _msg = _plane_label+_glob_crlf+"Horizonthal coordinates are not consistent" ;
       if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ] ;
    }
    else if ( BOTTOM > TOP )
    {
       var _msg = _plane_label+_glob_crlf+"Vertical coordinates are not consistent" ;
       if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ] ;
    }
    else
    {
       if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
       {
          var _canvas = is_html_canvas( _input_canvas ) ? _input_canvas : circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );
          var _items_n = circles_lib_count_items(_items_array);
			    var ITEM, complex_circle, X, Y, RADIUS, screen_center_pt, screen_radius_pt, screen_radius ;
          for( var i = 0 ; i < _items_n ; i++ )
          {
             ITEM = _items_array[i] ;
             complex_circle = is_circle( ITEM.complex_circle ) ? ITEM.complex_circle : null ;
             if ( is_circle( complex_circle ) )
             {
                 X = complex_circle.center.x, Y = complex_circle.center.y, RADIUS = complex_circle.radius ;
                 screen_center_pt = _mapper.from_cartesian_to_client( X, Y );
                 screen_radius_pt = _mapper.from_cartesian_to_client( X + RADIUS, Y );
                 screen_radius = Math.abs( screen_center_pt.x - screen_radius_pt.x );
                 _items_array[i].screen_circle.center.x = screen_center_pt.x ;
                 _items_array[i].screen_circle.center.y = screen_center_pt.y ;
                 _items_array[i].screen_circle.radius = screen_radius ;
             }
          }

          if ( _render )
          {
             var _ret_chunk = circles_lib_canvas_render_zplane( _canvas, _mapper, null, YES, YES, _render, !_silent, _silent, NO, _output_channel );
             _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
             _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
             return [ _ret_id, _ret_id == RET_OK ? "Coords set up and rendered with success" : "Problems while rendering new coords" ] ;
          }
          else return [ RET_OK, "Coords set up and rendered with success" ] ;
        }
        else if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
        {
            var wplane_left_up_pt = new point( LEFT, TOP );
            var wplane_right_down_pt = new point( RIGHT, BOTTOM );
            wplane_sm.set_coords_corners( wplane_left_up_pt, wplane_right_down_pt );
            /* don't draw anything now, this is a task accomplished by W-plane rendering functions*/
        }
        else if ( _plane_type == BIP_BOX )
        {
            var bip_left_up_pt = new point( LEFT, TOP );
            var bip_right_down_pt = new point( RIGHT, BOTTOM );
            bipbox_sm.set_coords_corners( bip_left_up_pt, bip_right_down_pt );
            /* don't draw anything now, this is a task accomplished by bip functions*/
        }
        else if ( _plane_type == D_LOCUS )
        {
            var discreteness_locus_left_up_pt = new point( LEFT, TOP );
            var discreteness_locus_right_down_pt = new point( RIGHT, BOTTOM );
            dlocus_sm.set_coords_corners( discreteness_locus_left_up_pt, discreteness_locus_right_down_pt );
            if ( circles_lib_plugin_find_index( { subset : "forms", base_id : "discreteness.locus" }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_SUBSET ) != UNFOUND )
            circles_lib_plugin_dispatcher_unicast_message( 'discreteness.locus', "forms", POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS );
        }

       var _msg = "Coords set up with success !" ;
       if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
       return [ RET_OK, _msg ] ;
    }
}

function circles_lib_coordinates_reset_core( _plane_type, _render, _question, _silent, _output_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _render = safe_int( _render, YES );
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
    {
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
           _glob_zplaneLEFT = -DEFAULT_PLANE_COORD, _glob_zplaneRIGHT = DEFAULT_PLANE_COORD;
           _glob_zplaneTOP = DEFAULT_PLANE_COORD, _glob_zplaneBOTTOM = -DEFAULT_PLANE_COORD ;
        }
               
        var src_left_up_pt = new point( _glob_zplaneLEFT, _glob_zplaneTOP );
        var src_right_down_pt = new point( _glob_zplaneRIGHT, _glob_zplaneBOTTOM );
                
        zplane_sm.set_coords_corners( src_left_up_pt, src_right_down_pt );
                    
        var _items_n = circles_lib_count_items();
				var ITEM, complex_circle, X, Y, RADIUS, screen_center_pt, screen_radius_pt, screen_radius, _mask ;
        for( var i = 0 ; i < _items_n ; i++ )
        {
           ITEM = _items_array[i] ;
           if ( !is_item_obj( ITEM ) ) continue ;
           _mask |= is_circle( ITEM.complex_circle ) ? 1 : 0 ;
           complex_circle = _mask & 1 ? ITEM.complex_circle : null ;
           if ( is_circle( complex_circle ) )
           {
              X = complex_circle.center.x, Y = complex_circle.center.y, RADIUS = complex_circle.radius ;
              screen_center_pt = zplane_sm.from_cartesian_to_client( X, Y );
              screen_radius_pt = zplane_sm.from_cartesian_to_client( X + RADIUS, Y );
              screen_radius = Math.abs( screen_center_pt.x - screen_radius_pt.x );
                             
              _items_array[i].screen_circle.center.x = screen_center_pt.x ;
              _items_array[i].screen_circle.center.y = screen_center_pt.y ;
              _items_array[i].screen_circle.radius = screen_radius ;
           }
        }
                    
        if ( _render )
        return circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, _render, _question, _silent, NO, _output_channel );
        else return [ RET_ERROR, "Insufficient conditions to render the Z-plane: try checking seeds consistence and render flag" ] ;
    }
    else if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
    {
        var _canvas = null ;
        if ( _plane_type == BIP_BOX ) _canvas = _glob_bip_canvas ;
        else if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) ) _canvas = _glob_wplane_rendering_layer_placeholder ;
          
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
            _glob_wplaneLEFT = -DEFAULT_PLANE_COORD, _glob_wplaneRIGHT = DEFAULT_PLANE_COORD;
            _glob_wplaneTOP = DEFAULT_PLANE_COORD, _glob_wplaneBOTTOM = -DEFAULT_PLANE_COORD ;
        }

        var wplane_left_up_pt = new point( _glob_wplaneLEFT, _glob_wplaneTOP );
        var wplane_right_down_pt = new point( _glob_wplaneRIGHT, _glob_wplaneBOTTOM );
        wplane_sm.set_coords_corners( wplane_left_up_pt, wplane_right_down_pt );
                
        if ( circles_lib_count_items() > 0 && _render )
        return circles_lib_canvas_render_wplane( _canvas, wplane_sm, null, YES, YES, _render, YES, _question, _silent, _output_channel );
        else return [ RET_ERROR, "Insufficient conditions to render the W-plane: try checking seeds consistence and render flag" ] ;
    }
    else if ( _plane_type == BIP_BOX )
    {
        var _canvas = null ;
        if ( _plane_type == BIP_BOX ) _canvas = _glob_bip_canvas ;
        else if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) ) _canvas = BIP_BOX_rendering_layer_canvas ;
          
        _glob_bipLEFT = -DEFAULT_PLANE_COORD, _glob_bipRIGHT = DEFAULT_PLANE_COORD;
        _glob_bipTOP = DEFAULT_PLANE_COORD, _glob_bipBOTTOM = -DEFAULT_PLANE_COORD ;

        var bip_left_up_pt = new point( _glob_bipLEFT, _glob_bipTOP );
        var bip_right_down_pt = new point( _glob_bipRIGHT, _glob_bipBOTTOM );
        bipbox_sm.set_coords_corners( bip_left_up_pt, bip_right_down_pt );
                
        if ( circles_lib_count_items() > 0 && _render )
        return circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, null, YES, YES, _render, YES, _question, _silent, _output_channel );
        else return [ RET_ERROR, "Insufficient conditions to render the bip plane: try checking seeds consistence and render flag" ] ;
    }
    else return [ RET_ERROR, "Canvas type is unknown: cannot reset it" ] ;
}

function circles_lib_coordinates_zoom_out_plane( _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    var _form_panel_src = $("#PLANEleft").get(0) != null ? YES : NO ;
    var LEFT, TOP, RIGHT, BOTTOM ;
    if ( _form_panel_src )
    {
        LEFT = safe_float( $("#PLANEleft").val(), -DEFAULT_PLANE_COORD );
        TOP = safe_float( $("#PLANEtop").val(), DEFAULT_PLANE_COORD );
        RIGHT = safe_float( $("#PLANEright").val(), DEFAULT_PLANE_COORD );
        BOTTOM = safe_float( $("#PLANEbottom").val(), -DEFAULT_PLANE_COORD );
    }
    else
    {
        switch( _plane_type )
        {
           case Z_PLANE:
           LEFT = _glob_zplaneLEFT, RIGHT = _glob_zplaneRIGHT ;
           TOP = _glob_zplaneTOP, BOTTOM = _glob_zplaneBOTTOM ;
           break ;
           case W_PLANE:
           LEFT = _glob_wplaneLEFT, RIGHT = _glob_wplaneRIGHT ;
           TOP = _glob_wplaneTOP, BOTTOM = _glob_wplaneBOTTOM ;
           break ;
           case BIP_BOX:
           LEFT = _glob_bipLEFT, RIGHT = _glob_bipRIGHT ;
           TOP = _glob_bipTOP, BOTTOM = _glob_bipBOTTOM ;
           break ;
           default: break ;
        }
    }

    var dX = Math.abs( RIGHT - LEFT ), dY = Math.abs( TOP - BOTTOM );
    var midX = ( LEFT + RIGHT ) / 2.0, midY = ( TOP + BOTTOM ) / 2.0 ;
    LEFT = midX - dX, RIGHT = midX + dX ;
    TOP = midY + dY, BOTTOM = midY - dY ;

    if ( _form_panel_src )
    {
        $("#PLANEleft").val( LEFT );
        $("#PLANEright").val( RIGHT );
        $("#PLANEtop").val( TOP );
        $("#PLANEbottom").val( BOTTOM );
    }
    else
    {
        switch( _plane_type )
        {
            case Z_PLANE:
            _glob_zplaneLEFT = LEFT, _glob_zplaneRIGHT = RIGHT ;
            _glob_zplaneTOP = TOP, _glob_zplaneBOTTOM = BOTTOM ;
            break ;
            case W_PLANE:
            _glob_wplaneLEFT = LEFT, _glob_wplaneRIGHT = RIGHT ;
            _glob_wplaneTOP = TOP, _glob_wplaneBOTTOM = BOTTOM ;
            break ;
            case BIP_BOX:
            _glob_bipLEFT = LEFT, _glob_bipRIGHT = RIGHT ;
            _glob_bipTOP = TOP, _glob_bipBOTTOM = BOTTOM ;
            break ;
            default: break ;
        }
    }
}

function circles_lib_coordinates_zoom_in_plane( _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    var _form_panel_src = $("#PLANEleft").get(0) != null ? YES : NO ;
    var LEFT, TOP, RIGHT, BOTTOM ;
    if ( _form_panel_src )
    {
        LEFT = safe_float( $("#PLANEleft").val(), -DEFAULT_PLANE_COORD );
        TOP = safe_float( $("#PLANEtop").val(), DEFAULT_PLANE_COORD );
        RIGHT = safe_float( $("#PLANEright").val(), DEFAULT_PLANE_COORD );
        BOTTOM = safe_float( $("#PLANEbottom").val(), -DEFAULT_PLANE_COORD );
    }
    else
    {
        switch( _plane_type )
        {
            case Z_PLANE:
            LEFT = _glob_zplaneLEFT, RIGHT = _glob_zplaneRIGHT ;
            TOP = _glob_zplaneTOP, BOTTOM = _glob_zplaneBOTTOM ;
            break ;
            case W_PLANE:
            LEFT = _glob_wplaneLEFT, RIGHT = _glob_wplaneRIGHT ;
            TOP = _glob_wplaneTOP, BOTTOM = _glob_wplaneBOTTOM ;
            break ;
            case BIP_BOX:
            LEFT = _glob_bipLEFT, RIGHT = _glob_bipRIGHT ;
            TOP = _glob_bipTOP, BOTTOM = _glob_bipBOTTOM ;
            break ;
            default: break ;
        }
    }

    var dX = Math.abs( RIGHT - LEFT ), dY = Math.abs( TOP - BOTTOM );
    var midX = ( LEFT + RIGHT ) / 2.0, midY = ( TOP + BOTTOM ) / 2.0 ;
    LEFT = midX - ( dX / 4.0 ), RIGHT = midX + ( dX / 4.0 );
    TOP = midY + ( dY / 4.0 ), BOTTOM = midY - ( dY / 4.0 );

    if ( _form_panel_src )
    {
        $("#PLANEleft").val( LEFT );
        $("#PLANEright").val( RIGHT );
        $("#PLANEtop").val( TOP );
        $("#PLANEbottom").val( BOTTOM );
    }
    else
    {
        switch( _plane_type )
        {
            case Z_PLANE:
            _glob_zplaneLEFT = LEFT, _glob_zplaneRIGHT = RIGHT ;
            _glob_zplaneTOP = TOP, _glob_zplaneBOTTOM = BOTTOM ;
            break ;
            case W_PLANE:
            _glob_wplaneLEFT = LEFT, _glob_wplaneRIGHT = RIGHT ;
            _glob_wplaneTOP = TOP, _glob_wplaneBOTTOM = BOTTOM ;
            break ;
            case BIP_BOX:
            _glob_bipLEFT = LEFT, _glob_bipRIGHT = RIGHT ;
            _glob_bipTOP = TOP, _glob_bipBOTTOM = BOTTOM ;
            break ;
            default: break ;
        }
    }
}

function circles_lib_coordinates_zoom_in_disk( _render, _index, _question, _silent, _output_channel )
{
		_render = safe_int( _render, YES ), _index = safe_int( _index, UNDET );
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    if ( _index != UNDET )
    {
       var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
       var _item_obj = _items_array[_index] ;
       var _symbol = is_item_obj( _item_obj ) ? _item_obj.symbol : "" ;
       if ( _symbol.length > 0 )
       {
          var _msg = "Disk '"+_symbol+"' has been selected." + _glob_crlf + _QUESTION_25 ;
          var _b_go = !_question ? YES : confirm( _msg );
          if ( _b_go )
          {
             var _cc = _items_array[_index].complex_circle ;
             if ( is_circle( _cc ) )
             {
                 var TOP = _cc.center.y + _cc.radius ;
                 var BOTTOM = _cc.center.y - _cc.radius ;
                 var LEFT = _cc.center.x - _cc.radius ;
                 var RIGHT = _cc.center.x + _cc.radius ;
                           
                 var dX = RIGHT - LEFT, dY = TOP - BOTTOM ;
                 var shift = dX / 10 ;
                 _glob_zplaneLEFT = LEFT - shift ;
                 _glob_zplaneRIGHT = RIGHT + shift ;
                 _glob_zplaneTOP = TOP + shift ;
                 _glob_zplaneBOTTOM = BOTTOM - shift ;
                           
                 src_left_up_pt = new point( _glob_zplaneLEFT, _glob_zplaneTOP );
                 src_right_down_pt = new point( _glob_zplaneRIGHT, _glob_zplaneBOTTOM );
                        
                 zplane_sm.set_coords_corners( src_left_up_pt, src_right_down_pt );
                            
                 var _items_n = circles_lib_count_items(), _cc = null, X, screen_center_pt, screen_radius_pt, screen_radius ;
                 for( var i = 0 ; i < _items_n ; i++ )
                 {
                    _cc = _items_array[ i ].complex_circle ;
                    X = _cc.center.x, Y = _cc.center.y, RADIUS = _cc.radius ;
                    screen_center_pt = zplane_sm.from_cartesian_to_client( X, Y );
                    screen_radius_pt = zplane_sm.from_cartesian_to_client( X + RADIUS, Y );
                    screen_radius = Math.abs( screen_center_pt.x - screen_radius_pt.x );
                    _items_array[ i ].screen_circle.center.x = screen_center_pt.x ;
                    _items_array[ i ].screen_circle.center.y = screen_center_pt.y ;
                    _items_array[ i ].screen_circle.radius = screen_radius ;
                }
                            
                 // highlight the selected object on the screen as its data
                 // are displayed in this pop-up window
                 var i = _index ;
                 _glob_zplane_selected_items_array = [];
                 circles_lib_helper_div_remove();
                 _glob_zplane_selected_items_array.push( i );
                 _glob_disk_sel_index = i ;
                 var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, _render, NO, YES, NO, _output_channel );
                 var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown message" ;
                 if ( _ret_id == RET_OK )
                 {
                    circles_lib_plugin_dispatcher_multicast_message( POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL );
                    var _msg = "Zoom-in performed with success" ;
                    if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
                    return [ RET_OK, _msg ] ;
                 }
                 else
                 {
                    circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
                    return _ret_chunk ;
                 }
             }
             else
             {
                 var _msg = "Zoom-in: found memory leak" ;
                 if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
                 return [ RET_ERROR, _msg ] ;
             }
          }
          else
          {
             var _msg = "Zoom-in halted by user" ;
             if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
             return [ RET_ERROR, _msg ] ;
          }
       }
       else
       {
          var _msg = "Zoom-in: missing item coords" ;
          if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
          return [ RET_ERROR, _msg ] ;
       }
    }
    else
    {
        if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Coordinates are not consistent with archived data", _glob_app_title );
        return [ RET_ERROR, "Coordinates are not consistent with archived data" ] ;
    }
}