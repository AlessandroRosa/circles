function circles_lib_canvas_coords_toggle_remap( _plane_type, _remap_category )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    switch( _plane_type )
    {
        case Z_PLANE:
        _glob_zplane_coords_map = _remap_category ;
        circles_lib_menu_entries_update();
        $( "#ZPLANEcoordsCATEGORY" ).html( _glob_zplane_coords_map == CANVAS_CARTESIAN_MAP ? "cartesian" : "screen" );
        break ;
        case W_PLANE:
        _glob_wplane_coords_map = _remap_category ;
        circles_lib_menu_entries_update();
        $( "#WPLANEcoordsCATEGORY" ).html( _glob_wplane_coords_map == CANVAS_CARTESIAN_MAP ? "cartesian" : "screen" );
        break ;
        default:
        break ;
    }
}

function circles_lib_canvas_coords_acquire( _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
    zplane_sm.set_coords_corners( new point( _glob_zplaneLEFT, _glob_zplaneTOP ), new point( _glob_zplaneRIGHT, _glob_zplaneBOTTOM ) );

    if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
    wplane_sm.set_coords_corners( new point( _glob_wplaneLEFT, _glob_wplaneTOP ), new point( _glob_wplaneRIGHT, _glob_wplaneBOTTOM ) );

    if ( _plane_type.is_one_of( BIP_BOX, ALL_PLANES ) )
    bipbox_sm.set_coords_corners( new point( _glob_bipLEFT, _glob_bipTOP ), new point( _glob_bipRIGHT, _glob_bipBOTTOM ) );
}

function circles_lib_canvas_coords_correct_aspectratio( _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    // 1. take global vars related to plane type
    // 2. take the grid layer of plane type to compute the aspect ratio,
    //    then recalculates global vars
    _plane_type = safe_int( _plane_type, NO_PLANE );
    var _layers_array = null, _coords = null ;
    if ( _plane_type == Z_PLANE )      { _layers_array = _glob_zplane_layers_pile_array ; _coords = [ _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM ] ; }
    else if ( _plane_type == W_PLANE ) { _layers_array = _glob_wplane_layers_pile_array ; _coords = [ _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM ] ; }

    // the bottom layer, just to return coords and size
    var _layer = is_array( _layers_array ) ? _layers_array[0] : null ;
    if ( _layer != null )
    {
         var _canvas = $( "#" + _layer.get_idcanvas() ).get(0);
         if ( !is_html_canvas( _canvas ) ) return [ RET_ERROR, "Invalid referenced data - 0.2" ] ;
         else
         {
              var _w = _canvas.get_width(), _h = _canvas.get_height();
              var _coords_extent_w = _coords[ 2 ] - _coords[ 0 ] ;
              var _coords_extent_h = _coords[ 1 ] - _coords[ 3 ] ;
              var _coords_center_x = ( _coords[ 2 ] + _coords[ 0 ] ) / 2.0 ;
              var _coords_center_y = ( _coords[ 1 ] + _coords[ 3 ] ) / 2.0 ;
              var _coords_ratio = _coords_extent_w / _coords_extent_h ;
              var _canvas_ratio = _w / _h ;
              
              if ( _coords_ratio != _canvas_ratio )
              {
                  var _new_coords_extent_w = _coords_extent_h * _canvas_ratio ;
                  var _new_coords_extent_h = _coords_extent_w / _canvas_ratio ;
                   _coords[ 0 ] = _coords_center_x - _new_coords_extent_w / 2.0 ;
                   _coords[ 2 ] = _coords_center_x + _new_coords_extent_w / 2.0 ;
                   _coords[ 1 ] = _coords_center_x + _new_coords_extent_h / 2.0 ;
                   _coords[ 3 ] = _coords_center_x - _new_coords_extent_h / 2.0 ;
                   if ( _plane_type == Z_PLANE )
                   {
                       _glob_zplaneLEFT = _coords[0] ;
                       _glob_zplaneTOP = _coords[1] ;
                       _glob_zplaneRIGHT = _coords[2] ;
                       _glob_zplaneBOTTOM = _coords[3] ;
                   }
                   else if ( _plane_type == W_PLANE )
                   {
                       _glob_wplaneLEFT = _coords[0] ;
                       _glob_wplaneTOP = _coords[1] ;
                       _glob_wplaneRIGHT = _coords[2] ;
                       _glob_wplaneBOTTOM = _coords[3] ;
                   }

                   return [ RET_OK, "Coords corrected to match canvas size" ] ;
              }
              else return [ RET_IRRELEVANT, "Coords already match canvas size" ] ;
         }
    }
    else return [ RET_ERROR, "Invalid referenced data - 0.1" ] ;
}