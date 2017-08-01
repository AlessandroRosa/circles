function circles_lib_forms_adjust_position( _div_id )
{
		if ( $( "#" + _div_id ).get(0) == null ) return NO ;
    var _top = safe_int( $( "#" + _div_id ).css( "top" ), 90 ) ;
    var _left = safe_int( $( "#" + _div_id ).css( "left" ), 90 ) ;
    var _width = $( "#" + _div_id ).width();
    var _height = $( "#" + _div_id ).height();
    var _sw = $(window).width(), _sh = $(window).height() ;
    var _cross_h = ( ( _top + _height ) >= _sh ) ? YES : NO ;
    var _cross_w = ( ( _left + _width ) >= _sw ) ? YES : NO ;
    if ( _cross_h )
    {
        var _cross_dh = Math.abs( _top + _height - _sh ) ;
        $( "#" + _div_id ).css( "top", _top - _cross_dh - 25 ) ;
    }

    if ( _cross_w )
    {
        var _cross_dw = Math.abs( _left + _width - _sw ) ;
        $( "#" + _div_id ).css( "left", _left - _cross_dw - 25 ) ;
    }
    
    return ( _cross_h || _cross_w ) ? YES : NO ;
}

function circles_lib_forms_show_panel( bSHOW, _div_id ) // hide / show purposes
{
    circles_lib_plugin_set_property( _div_id, bSHOW , POPUP_SEARCH_BY_VISIBLE );
    var _id = !_div_id.start_with( "#" ) ? "#" + _div_id : _div_id ;
    bSHOW ? $( _id ).slideDown("slow") : $( _id ).slideUp("fast" );
    var _ret = circles_lib_plugin_get_list();
    $("#POPUPDIVSarrayDIV").html( _ret[0].replaceAll( "%imgpath%", _glob_path_to_img ) );
}