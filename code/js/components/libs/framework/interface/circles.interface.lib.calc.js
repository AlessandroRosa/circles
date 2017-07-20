function circles_lib_interface_calc_aspect_ratio()
{
    switch( _glob_interface_index )
    {
         case INTERFACE_EXTEND_NONE:
         _glob_interface_aspect_ratio = 1 ;
         break ;
         case INTERFACE_EXTEND_ZPLANE:
         _glob_interface_aspect_ratio = zplane_sm.get_coords_rect().get_aspect_ratio() ;
         break ;
         case INTERFACE_EXTEND_WPLANE:
         _glob_interface_aspect_ratio = wplane_sm.get_coords_rect().get_aspect_ratio() ;
         break ;
         default: _glob_interface_aspect_ratio = 1 ; break ;
    }
    
    return _glob_interface_aspect_ratio ;
}

function circles_lib_interface_recalc_extents()
{
    /* args map
       0 : input type
       1 : if INPUT_WIDTH | INPUT_HEIGHT -> left | top
       2 : if INPUT_WIDTH | INPUT_HEIGHT -> right | bottom
    */
    
    var _input_type = safe_int( arguments[0], INTERFACE_INPUT_NONE );
    switch( _input_type )
    {
        case INTERFACE_INPUT_WIDTH:
        var _left = safe_float( arguments[1], -DEFAULT_PLANE_COORD );
        var _right = safe_float( arguments[2], DEFAULT_PLANE_COORD );
        var _extent_x = _right - _left ;
        var _extent_y = _glob_interface_aspect_ratio / _extent_x ;
        return [ _extent_x, _extent_y ] ;
        break ;
        case INTERFACE_INPUT_HEIGHT:
        var _aspect_ratio = circles_lib_interface_calc_aspect_ratio() ;
        var _top = safe_float( arguments[1], DEFAULT_PLANE_COORD );
        var _bottom = safe_float( arguments[2], -DEFAULT_PLANE_COORD );

        var _extent_y = _top - _bottom ;
        var _extent_x = _glob_interface_aspect_ratio * _extent_y ;
        return [ _extent_x, _extent_y ] ;
        break ;
        default: return [ 0, 0 ] ; break ;
    }
}

function circles_lib_interface_recalc_bounding_coords()
{
    /* args map
       0 : input type
       1 : top
       2 : left
       3 : right
       4 : bottom
       5 : center       
    */

    var _input_type = safe_int( arguments[0], INTERFACE_INPUT_NONE );
    var _left = safe_float( arguments[1], -DEFAULT_PLANE_COORD );
    var _top = safe_float( arguments[2], DEFAULT_PLANE_COORD );
    var _right = safe_float( arguments[3], DEFAULT_PLANE_COORD );
    var _bottom = safe_float( arguments[4], -DEFAULT_PLANE_COORD );
    var _center = is_point( arguments[5] ) ? arguments[5] : null ;

    var _ret_chunk = circles_lib_interface_recalc_extents( _input_type,
                                                    _input_type == INTERFACE_INPUT_HEIGHT ? arguments[2] : arguments[1],
                                                    _input_type == INTERFACE_INPUT_HEIGHT ? arguments[4] : arguments[3]
                                                  ) ;
    var _ret_w_extent = safe_float( _ret_chunk[0], 0 ) ;
    var _ret_h_extent = safe_float( _ret_chunk[1], 0 ) ;
    
    switch( _input_type )
    {
        case INTERFACE_INPUT_WIDTH:
        var _old_center_x = is_point( _center ) ? _center.x : ( _left + _right ) / 2.0 ;
        var _old_center_y = is_point( _center ) ? _center.y : ( _top + _bottom ) / 2.0 ;
        var _new_top = _old_center_y + _ret_w_extent / 2.0 ;
        var _new_bottom = _old_center_y - _ret_w_extent / 2.0 ;
        return [ _left, _new_top, _right, _new_bottom ] ;
        break ;
        case INTERFACE_INPUT_HEIGHT:
        var _old_center_x = is_point( _center ) ? _center.x : ( _left + _right ) / 2.0 ;
        var _old_center_y = is_point( _center ) ? _center.y : ( _top + _bottom ) / 2.0 ;
        var _new_left = _old_center_x - _ret_w_extent / 2.0 ;
        var _new_right = _old_center_x + _ret_w_extent / 2.0 ;
        return [ _new_left, _top, _new_right, _bottom ] ;
        break ;
        default: break ;
    }
}