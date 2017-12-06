var _glob_latex_open = 0 ;

function circles_lib_canvas_save_to_latex( _filename, _silent, _out_channel )
{
     _filename = safe_string( _filename, "" );
     _silent = safe_int( _silent, NO );
     _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
     var _code = _glob_js_latex_obj.get_codelist().trim();
     if ( _code.length > 0 )
     {
          // remove extension if explictly inside input var
 			    var _extension = _filename.includes( "." ) ? _filename.split( ".").get_last() : "" ;
              _filename = _filename.replaceAll( [ "tex", _extension ], "" );
              _extension = "tex" ;
              _filename = _glob_title.length > 0 ? ( _glob_title + "." + _filename ) : "circles." + _filename ;
              _filename += _extension ;
              _filename = _filename.replaceAll( "..", "." );
          var blob = new Blob( [ _code ], { type: 'plain/text', endings: 'native' });
          saveAs( blob, _filename );
          return [ 1, "Saving the "+_extension.toUpperCase()+" file: now wait for the dialog box to open" ];
     }
     else
     {
        var _msg = "Code is not available to save the LaTeX file" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
        else return [ 0, _msg ];
     }
}

function _latex_open( _w, _h, _desc, _canvas )
{
     if ( _glob_latex_open == 0 )
     {
         _desc = safe_string( _desc, "" );
         _glob_js_latex_obj.init( _canvas.get_width(), _canvas.get_height(), _glob_latex_options, YES, YES, _glob_appTITLE + " " + _glob_appSUBTITLE + " " + _glob_appLASTreleaseDATE + _glob_crlf + _desc );
         _glob_latex_open = 1 ;

         var _bk = is_html_canvas( _canvas ) ? new String( _canvas.get_backgroundcolor() ) : "" ;
             _bk = _bk == UNDEF ? _bk = "" : _bk.trim();
         if ( _bk.length > 0 )
         _glob_js_latex_obj.rect( 0, 0, _canvas.get_width(), _canvas.get_height(), _canvas.get_width(), _canvas.get_height(), _bk, 100, "Background" );
     }

     return _glob_latex_open ;
}

function _latex_comment( _text )
{
     _text = safe_string( new String( _text ), "" ).trim();
     _glob_js_latex_obj.comment( _text );
}

function _latex_line( _screen_line, _dashed )
{
     if ( _glob_latex_open == 1 )
     {
         _dashed = safe_int( _dashed, 0 ); 
         var _x1 = _screen_line.start_pt.x, _y1 = _screen_line.start_pt.y ;
         var _x2 = _screen_line.end_pt.x, _y2 = _screen_line.end_pt.y ;
         var _bordersize = _screen_line.lw, _clr = _screen_line.bordercolor ;
    
         _glob_js_latex_obj.line( _x1, _y1, _x2, _y2, _clr );
     }
}

function _latex_point( _screen_pt, _border, _bordercolor, _fill, _fillcolor, _bordersize, _radius )
{
     if ( _glob_latex_open == 1 )
     {
          _border = safe_int( _border, NO );
          _bordercolor = safe_string( _bordercolor, "" ); 
          _fill = safe_int( _fill, NO );
          _fillcolor = safe_string( _fillcolor, "" ); 
          _bordersize = safe_int( _bordersize, 0 );
          _radius = safe_int( _radius, 0 );
          _glob_js_latex_obj.point( _screen_pt.x, _screen_pt.y, _bordersize, _fill, _fill ? _fillcolor : "" );
     }
}

function _latex_pixel( _screen_pt, _opacity, _border, _bordercolor, _fill, _fillcolor, _bordersize )
{
     if ( _glob_latex_open == 1 )
     {
          var _screen_rect = new rect( _screen_pt.x, _screen_pt.y, _screen_pt.x + 0.1, _screen_pt.y + 0.1 );
          _glob_js_latex_obj.pixel( _screen_pt.x, _screen_pt.y, _border ? _bordercolor : "", 100 );
     }
}

function _latex_circle( _screen_circle, _dashed, _opacity )
{
     if ( _glob_latex_open == 1 )
     {
         _dashed = safe_int( _dashed, NO );
         _opacity = safe_int( _opacity, DEFAULT_MAX_OPACITY );
    
         _dashed = ( ( _screen_circle.fill == 0 || _screen_circle.fillcolor.length == 0 || _screen_circle.fillcolor.stricmp( "transparent" ) ) && ( _screen_circle.draw == 0 || _screen_circle.bordercolor.length == 0 || _screen_circle.bordercolor.stricmp( "transparent" ) ) ) ? YES : NO ;
         if ( _dashed && _screen_circle.bordercolor.length == 0 ) _screen_circle.bordercolor = DEFAULT_EDIT_COLOR_DISABLED ;

         var _dash_attr = _dashed ? "[2,2]" : "" ;
         var _bordersize_attr = ( _screen_circle.draw && _screen_circle.bordersize > 0 ) ? " stroke-width=\""+_screen_circle.bordersize+"\"" : "" ;
         var _draw_attr = ( ( _screen_circle.draw || _dashed ) && _screen_circle.bordercolor.length > 0 ) ? " stroke=\""+_screen_circle.bordercolor+"\"" : "" ;
         var _fill_attr = ( _screen_circle.fill && _screen_circle.fillcolor.length > 0 ) ? " fill=\""+_screen_circle.fillcolor+"\"" : " fill=\"transparent\"" ;
         
         global_js_latex_obj.circle( _screen_circle.center.x, _screen_circle.center.y, _screen_circle.center.radius,
                                     _screen_circle.fill,
                                     _screen_circle.fill ? _screen_circle.fillcolor : "" );
     }
}

function _latex_rect( _screen_rect, _opacity, _border, _bordercolor, _fill, _fillcolor, _bordersize, _borderradius )
{
     if ( _glob_latex_open == 1 )
     {
         _opacity = safe_int( _opacity, DEFAULT_MAX_OPACITY );
         _border = safe_int( _border, 0 );
         _fill = safe_int( _fill, 0 );
         _borderradius = safe_int( _borderradius, 0 );
         _bordersize = safe_int( _bordersize, 0 );
         var _x = _screen_rect.x1, _y = _screen_rect.y1;
         var _w = _screen_rect.w, _h = _screen_rect.h;
         if ( _borderradius == 0 )
         global_js_latex_obj.rect( _x, _y, _x + _w, _y + _h, _fill ? _fillcolor : "", 100, "" );
         else
         global_js_latex_obj.rounded_rect( _x, _y, _w, _h, fill ? _fillcolor : "" );
     }
}

function _latex_text( _x, _y, _text, _clr, _font_family, _font_size )
{
     if ( _glob_latex_open == 1 )
     global_js_latex_obj.text( _x, _y, _text, _fontcolor );
}