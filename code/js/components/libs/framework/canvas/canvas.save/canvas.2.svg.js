var _glob_svg_open = 0 ;

function circles_lib_canvas_save_to_svg( _filename, _silent = NO, _out_channel = OUTPUT_SCREEN )
{
     _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
     var _code_array = _glob_export_code_array ;
     if ( is_array( _code_array ) && _code_array != UNDEF )
     {
        var _c_n = safe_size( _code_array, 0 );
        if ( _c_n > 0 )
        {
            // remove extension if explictly mentioned inside input var
   			    var _extension = _filename.includes( "." ) ? _filename.split( ".").get_last() : "" ;
                _filename = _filename.replaceAll( [ "svg", _extension ], "" );
                _extension = "svg" ;
            var _filename = _glob_title.length > 0 ? ( _glob_title + "." + _filename ) : "circles." + _filename ;
                _filename += _extension ;
            var blob = new Blob( _code_array, { type: "text/html;charset=utf-8;" } );
            saveAs(blob, _filename );
            return [ 1, "success" ];
        }
        else
        {
            var _msg = "Code is not consistent to save the SVG file."+_glob_crlf+"Switch the export option to SVG, redraw the figure and try saving it again" ;
            if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
            else return [ 0, _msg ] ;
        }
     }
     else
     {
        var _msg = "Code is not available to save the SVG file" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
        else return [ 0, _msg ] ;
     }
}

function _svg_open( _code_array, _w, _h, _desc, _canvas )
{
     if ( _glob_svg_open == 0 )
     {
         _desc = safe_string( _desc, "" );
         
         if ( is_array( _code_array ) )
         {
             var _c_n = safe_size( _code_array, 0 );
             if ( _c_n > 0 ) _code_array.flush();
              
             _code_array.push( "<?xml version=\"1.0\" standalone=\"yes\" ?>" + _glob_crlf );
             _text = "SVG pix processed by Circles on " + today_date() + " at " + current_time();
             _svg_comment( _code_array, _text );
             
             _code_array.push( "<!DOCTYPE svg SYSTEM \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">" + _glob_crlf );
             _code_array.push( "<svg version=\"1.1\" baseProfile=\"full\" width=\""+_w+"px\" height=\""+_h+"\" xmlns=\"http://www.w3.org/2000/svg\">" + _glob_crlf );
             if ( _desc.length > 0 ) _code_array.push( "<desc>"+_desc+"</desc>" + _glob_crlf );
             
             var _style = "" ;

             var _bk = is_html_canvas( _canvas ) ? new String( _canvas.get_backgroundcolor() ) : "" ;
                 _bk = _bk == UNDEF ? "" : _bk.trim();
                 if ( _bk.length > 0 )
                 {
                      _style += "fill:" + _bk + ";" ;
                      _code_array.push( "<rect x=\"0\" y=\"0\" width=\""+_w+"\" height=\""+_h+"\" "+( _style.length > 0 ? ( "style=\"" + _style + "\" " ) : "" )+"/>" + _glob_crlf );
                 }
             
             _glob_svg_open = 1 ;
             return YES ;
         }
         else return NO ; 
     }
     else return NO ;
}

function _svg_comment( _code_array, _text )
{
     _text = safe_string( new String( _text ), "" ).trim();
     if ( _text.length > 0 ) _code_array.push( "<!-- "+_text+" -->" + _glob_crlf );
}

function _svg_line( _code_array, _screen_line, _dashed )
{
     if ( _glob_svg_open == 1 )
     {
         _dashed = safe_int( _dashed, 0 ); 
         var _x1 = _screen_line.start_pt.x, _y1 = _screen_line.start_pt.y ;
         var _x2 = _screen_line.end_pt.x, _y2 = _screen_line.end_pt.y ;
         var _bordersize = _screen_line.lw, _clr = _screen_line.bordercolor ;
    
         var _dash_attr = _dashed ? " stroke-dasharray=\"2,2,2\"" : "" ;
         var _draw_attr = _bordersize != 0 ? " stroke=\""+_clr+"\"" : " stroke=\"transparent\"" ;
         var _bordersize_attr = " stroke-width=\""+_bordersize+"\"" ;
         
         _code_array.push( "<line"+_bordersize_attr+_draw_attr+_dash_attr+" x1=\""+_x1+"\" y1=\""+_y1+"\" x2=\""+_x2+"\" y2=\""+_y2+"\" />" + _glob_crlf );
     }
}

function _svg_point( _code_array, _screen_pt, _border, _bordercolor, _fill, _fillcolor, _bordersize, _radius )
{
     if ( _glob_svg_open == 1 )
     {
          _border = safe_int( _border, NO );
          _bordercolor = safe_string( _bordercolor, "" ); 
          _fill = safe_int( _fill, NO );
          _fillcolor = safe_string( _fillcolor, "" ); 
          _bordersize = safe_int( _bordersize, 0 );
          _radius = safe_int( _radius, 0 );

          var _circle = new circle( _screen_pt, _radius, _bordercolor, _fillcolor, _bordersize );
          _circle.draw = _border, _circle.fill = _fill ;
          _svg_circle( _code_array, _circle, 0 );
     }
}

function _svg_pixel( _code_array, _screen_pt, _opacity, _border, _bordercolor, _fill, _fillcolor, _bordersize )
{
     if ( _glob_svg_open == 1 )
     {
          var _screen_rect = new rect( _screen_pt.x, _screen_pt.y, _screen_pt.x + 0.2, _screen_pt.y + 0.2 );
          _svg_rect( _code_array, _screen_rect, _opacity, _border, _bordercolor, _fill, _fillcolor, _bordersize, 0, YES );
     }
}

function _svg_circle( _code_array, _screen_circle, _dashed, _opacity )
{
     if ( _glob_svg_open == 1 )
     {
         _dashed = safe_int( _dashed, NO );
         _opacity = safe_int( _opacity, DEFAULT_MAX_OPACITY );
    
         _dashed = ( ( _screen_circle.fill == 0 || _screen_circle.fillcolor.length == 0 || _screen_circle.fillcolor.stricmp( "transparent" ) ) && ( _screen_circle.draw == 0 || _screen_circle.bordercolor.length == 0 || _screen_circle.bordercolor.stricmp( "transparent" ) ) ) ? YES : NO ;
         if ( _dashed && _screen_circle.bordercolor.length == 0 ) _screen_circle.bordercolor = DEFAULT_EDIT_COLOR_DISABLED ;

         var _dash_attr = _dashed ? " stroke-dasharray=\"2,2,2\"" : "" ;
         var _bordersize_attr = ( _screen_circle.draw && _screen_circle.bordersize > 0 ) ? " stroke-width=\""+_screen_circle.bordersize+"\"" : "" ;
         var _draw_attr = ( ( _screen_circle.draw || _dashed ) && _screen_circle.bordercolor.length > 0 ) ? " stroke=\""+_screen_circle.bordercolor+"\"" : "" ;
         var _fill_attr = ( _screen_circle.fill && _screen_circle.fillcolor.length > 0 ) ? " fill=\""+_screen_circle.fillcolor+"\"" : " fill=\"transparent\"" ;

         _code_array.push( "<circle"+_dash_attr+_bordersize_attr+_draw_attr+_fill_attr+" cx=\""+_screen_circle.center.x+"\" cy=\""+_screen_circle.center.y+"\" r=\""+_screen_circle.radius+"\" fill-opacity=\""+_opacity+"\" />" + _glob_crlf );
     }
}

function _svg_rect( _code_array, _screen_rect, _opacity, _border, _bordercolor, _fill, _fillcolor, _bordersize, _borderradius, _is_pixel )
{
     if ( _glob_svg_open == 1 )
     {
         _opacity = safe_int( _opacity, DEFAULT_MAX_OPACITY );
         _border = safe_int( _border, 0 );
         _fill = safe_int( _fill, 0 );
         _is_pixel = safe_int( _is_pixel, 0 );
         _borderradius = safe_int( _borderradius, 0 );
         _bordersize = safe_int( _bordersize, 0 );
         
         var _x = _screen_rect.x1, _y = _screen_rect.y1;
         var _w = _screen_rect.w, _h = _screen_rect.h;
         
         var _borderradius = _borderradius > 0 ? "rx=\""+_borderradius+"\" ry=\""+_borderradius+"\"" : "" ;
         var _style = "style=\"" ;
             if ( _border && _bordercolor.length > 0 ) _style += "stroke:" + _bordercolor + ";" ;
             if ( _fill && _fillcolor.length > 0 ) _style += "fill:" + _fillcolor + ";" ;
             if ( _bordersize )                _style += "stroke-width:" + _bordersize + ";" ;
             _style += "\"" ;

         _code_array.push( "<rect x=\""+_x.roundTo(2)+"\" y=\""+_y.roundTo(2)+"\" width=\""+_w.roundTo(2)+"\" height=\""+_h.roundTo(2)+"\" "+( _borderradius.length > 0 ? _borderradius + " " : "" )+""+_style+" fill-opacity=\""+_opacity+"\" />" + _glob_crlf );
     }
}

function _svg_text( _code_array, _x, _y, _text, _clr, _font_family, _font_size )
{
     if ( _glob_svg_open == 1 )
     _code_array.push( "<text x=\""+_x+"\" y=\""+_y+"\" fill=\""+_clr+"\" font-family=\""+_font_family+"\" font-size=\""+_font_size+"\">"+_text+"</text>" + _glob_crlf );
}

function _svg_close( _code_array )
{
     if ( _glob_svg_open == 1 )
     {
         _code_array.push( "</svg>" );
         _glob_svg_open = 0 ;
     }
}

function _svg_destroy( _code_array )
{
     if ( safe_size( _code_array, 0 ) > 0 ) _code_array.flush();
     _code_array = [];
     _glob_svg_open = 0 ;
     return _code_array.length > 0 ? NO : YES ;
}