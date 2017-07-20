function circles_lib_extras_sliderctrl_set_layer_opacity( _plane_type, _role, _opacity )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _opacity = safe_float( _opacity, DEFAULT_MAX_OPACITY * 100.0 );
    var sliderCTRL = _glob_layers_sliderCTRLarray[ _plane_type + "." + _role ] ;
    if ( sliderCTRL != null ) sliderCTRL.setValue( _opacity );
}

function circles_lib_extras_sliderctrl_set_wnd_opacity( _obj_label, _change_opacity )
{
    _change_opacity = safe_int( _change_opacity, YES );
    if ( !is_string( _obj_label ) ) return NO ;
    else if ( _obj_label.includes( "." ) )
    {
        var _obj_label_array = _obj_label.split( "." );
        var _plane_type = safe_int( _obj_label_array[0], NO_PLANE );
        var _role = safe_int( _obj_label_array[1], ROLE_NONE );
        var sliderCTRL = _glob_layers_sliderCTRLarray[ _obj_label ] ;
        var _opacity = sliderCTRL != null ? sliderCTRL.getValue() : 0.0 ;
        if ( _change_opacity ) return circles_lib_canvas_layer_set_opacity( _plane_type, _role, _opacity );
        else return NO ;
    }
    else // it's a popup
    {
        var _div_id = _obj_label.replaceAll( "_sliderbox", "" );
        var sliderCTRL = _glob_popup_sliderCTRLarray[ _div_id ] ;
        if ( sliderCTRL != null && _change_opacity )
        {
            var _opacity = sliderCTRL != null ? sliderCTRL.getValue() : 0.0 ;
            set_opacity( _div_id, _opacity );
            return YES ;
        }
        else return NO ;
    }
}