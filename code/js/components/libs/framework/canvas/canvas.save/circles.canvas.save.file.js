function circles_lib_canvas_save_to_file( _plane_type, _canvas, _filename, _merge, _silent, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _silent = safe_int( _silent, NO ), _merge = safe_int( _merge, NO );
    if ( !is_html_canvas( _canvas ) ) return [ 0, "Can't save: missing canvas reference" ] ;
    _filename = safe_string( _filename, "circles.pix.png" );
    if ( _glob_export_format == EXPORT_PNG ) _filename = !_filename.includes( ".png" ) ? _filename + ".png" : _filename ;
    else if ( _glob_export_format == EXPORT_SVG ) _filename = _filename.replaceAll( ".png", ".svg" );
    else if ( _glob_export_format == EXPORT_PS ) _filename = _filename.replaceAll( ".png", ".ps" );
    else if ( _glob_export_format == EXPORT_EPS ) _filename = _filename.replaceAll( ".png", ".eps" );
    else if ( _glob_export_format == EXPORT_LATEX ) _filename = _filename.replaceAll( ".png", ".tex" );
    var _ret = circles_lib_files_pix_save_ask( _plane_type, _canvas, _filename, _merge, _silent, _out_channel );
    return _ret ;
}