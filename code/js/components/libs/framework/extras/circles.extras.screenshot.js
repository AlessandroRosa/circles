function circles_lib_extras_capture_full_screenshot() { html2canvas( document.body, { onrendered: function(canvas) { circles_lib_files_pix_save( NO_PLANE, canvas, "circles.screenshot.png" ); } }); }
function circles_lib_extras_capture_wnd_screenshot( _div_id, _filename, _silent, _out_channel )
{
    _div_id = safe_string( _div_id, "" ).trim() ;
    _filename = safe_string( _filename, "circles.screenshot.png" );
    _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _msg = "" ;
    if ( $( "#" + _div_id ).get(0) != null )
    {
        html2canvas( $( "#" + _div_id ).get(0), { onrendered: function(canvas) { circles_lib_files_pix_save( NO_PLANE, canvas, _filename ); } });
        _msg = "Screenshot has been captured with success" ;
        if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
        return [ RET_ERROR, _msg ] ;
    }
    else
    {
        _msg = "Invalid target for obtaining a screenshot" ;
        if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app );
        return [ RET_ERROR, _msg ] ;
    }
}