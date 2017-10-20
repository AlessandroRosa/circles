var _glob_e_ps_open = 0 ;

function circles_lib_canvas_save_to_e_ps( _filename, _silent, _output_channel )
{
     _filename = safe_string( _filename, "" );
     _silent = safe_int( _silent, NO );
     _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
     var _code = _glob_js_e_ps_obj.get_codelist().join( _glob_crlf );       _code = _code.trim();
     if ( _code.length > 0 )
     {
          // remove extension if explictly inside input var
 			    var _extension = _filename.includes( "." ) ? _filename.split( ".").get_last() : "" ;
              _filename = _filename.replaceAll( [ ( _glob_export_format == EXPORT_PS ? ".ps" : ".eps" ), _extension ], "" );
              _extension = _glob_export_format == EXPORT_PS ? "ps" : "eps" ;
              _filename = _glob_title.length > 0 ? ( _glob_title + "." + _filename ) : "circles." + _filename ;
              _filename += _extension ;
              _filename = _filename.replaceAll( "..", "." );
          var blob = new Blob( [ _code ], { type: 'plain/text', endings: 'native' });
          saveAs( blob, _filename );
          return [ 1, "Saving the "+_extension.toUpperCase()+" file: now wait for the dialog box to open" ];
     }
     else
     {
        var _msg = "Code is not available to save the "+( _glob_export_format == EXPORT_PS ? "PS" : "EPS" )+" file" ;
        if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
        else return [ 0, _msg ];
     }
}

function _e_ps_open( _w, _h, _desc, _canvas )
{
     if ( _glob_e_ps_open == 0 )
     {
         _desc = safe_string( _desc, "" );
         _glob_js_e_ps_obj.init( _glob_ps_language_level, _glob_export_format == EXPORT_PS ? NO : YES,
                                 _glob_appTITLE + " " + _glob_appSUBTITLE + " " + _glob_appLASTreleaseDATE,
                                 0, 0, _canvas.get_width(), _canvas.get_height(), YES );
         _glob_e_ps_open = 1 ;

         var _bk = is_html_canvas( _canvas ) ? new String( _canvas.get_backgroundcolor() ) : "" ;
             _bk = _bk == UNDEF ? _bk = "" : _bk.trim();
         if ( _bk.length > 0 )
         _glob_js_e_ps_obj.rect( 0, 0, _canvas.get_width(), _canvas.get_height(), _canvas.get_width(), _canvas.get_height(), 0, "", _bk, "Background" );
     }

     return _glob_e_ps_open ;
}

function _e_ps_comment( _text )
{
     _text = safe_string( new String( _text ), "" ).trim();
     _glob_js_e_ps_obj.comment( _text );
}

function _e_ps_line( _screen_line, _dashed )
{
     if ( _glob_e_ps_open == 1 )
     {
         _dashed = safe_int( _dashed, 0 ); 
         var _x1 = _screen_line.start_pt.x, _y1 = _screen_line.start_pt.y ;
         var _x2 = _screen_line.end_pt.x, _y2 = _screen_line.end_pt.y ;
         var _linewidth = _screen_line.lw, _clr = _screen_line.drawcolor ;
    
         var _dash_attr = _dashed ? "[2,2]" : "" ;
         var _draw_attr = _linewidth != 0 ? " stroke=\""+_clr+"\"" : " stroke=\"transparent\"" ;
         
         _glob_js_e_ps_obj.line( _x1, _y1, _x2, _y2, _linewidth, _dash_attr, "" );
     }
}

function _e_ps_point( _screen_pt, _draw, _drawcolor, _fill, _fillcolor, _linewidth, _radius )
{
     if ( _glob_e_ps_open == 1 )
     {
          _draw = safe_int( _draw, NO );
          _drawcolor = safe_string( _drawcolor, "" ); 
          _fill = safe_int( _fill, NO );
          _fillcolor = safe_string( _fillcolor, "" ); 
          _linewidth = safe_int( _linewidth, 0 );
          _radius = safe_int( _radius, 0 );

          _glob_js_e_ps_obj.point( _screen_pt.x, _screen_pt.y, _linewidth, _draw ? _drawcolor : "", _fill ? _fillcolor : "", "" );
     }
}

function _e_ps_pixel( _screen_pt, _opacity, _draw, _drawcolor, _fill, _fillcolor, _linewidth )
{
     if ( _glob_e_ps_open == 1 )
     {
          var _screen_rect = new rect( _screen_pt.x, _screen_pt.y, _screen_pt.x + 0.1, _screen_pt.y + 0.1 );
          _glob_js_e_ps_obj.pixel( _screen_pt.x, _screen_pt.y, _draw ? _drawcolor : "", "" );
     }
}

function _e_ps_circle( _screen_circle, _dashed, _opacity )
{
     if ( _glob_e_ps_open == 1 )
     {
         _dashed = safe_int( _dashed, NO );
         _opacity = safe_int( _opacity, DEFAULT_MAX_OPACITY );
    
         _dashed = ( ( _screen_circle.fill == 0 || _screen_circle.fillcolor.length == 0 || _screen_circle.fillcolor.stricmp( "transparent" ) ) && ( _screen_circle.draw == 0 || _screen_circle.drawcolor.length == 0 || _screen_circle.drawcolor.stricmp( "transparent" ) ) ) ? YES : NO ;
         if ( _dashed && _screen_circle.drawcolor.length == 0 ) _screen_circle.drawcolor = DEFAULT_EDIT_COLOR_DISABLED ;

         var _dash_attr = _dashed ? "[2,2]" : "" ;
         var _linewidth_attr = ( _screen_circle.draw && _screen_circle.linewidth > 0 ) ? " stroke-width=\""+_screen_circle.linewidth+"\"" : "" ;
         var _draw_attr = ( ( _screen_circle.draw || _dashed ) && _screen_circle.drawcolor.length > 0 ) ? " stroke=\""+_screen_circle.drawcolor+"\"" : "" ;
         var _fill_attr = ( _screen_circle.fill && _screen_circle.fillcolor.length > 0 ) ? " fill=\""+_screen_circle.fillcolor+"\"" : " fill=\"transparent\"" ;
         
         global_js_e_ps_obj.circle( _screen_circle.center.x, _screen_circle.center.y, _screen_circle.center.radius,
                                    _screen_circle.linewidth,
                                    _screen_circle.draw ? _screen_circle.drawcolor : "",
                                    _screen_circle.fill ? _screen_circle.fillcolor : "",
                                    _dash_attr, "" );
     }
}

function _e_ps_rect( _screen_rect, _opacity, _draw, _drawcolor, _fill, _fillcolor, _linewidth, _borderradius )
{
     if ( _glob_e_ps_open == 1 )
     {
         _opacity = safe_int( _opacity, DEFAULT_MAX_OPACITY );
         _draw = safe_int( _draw, 0 );
         _fill = safe_int( _fill, 0 );
         _borderradius = safe_int( _borderradius, 0 );
         _linewidth = safe_int( _linewidth, 0 );
         
         var _x = _screen_rect.x1, _y = _screen_rect.y1;
         var _w = _screen_rect.w, _h = _screen_rect.h;
         
         if ( _borderradius == 0 )
         global_js_e_ps_obj.rect( _x, _y, _w, _h, _linewidth, _draw ? _drawcolor : "", _fill ? _fillcolor : "", "" );
         else
         global_js_e_ps_obj.rounded_rect( _x, _y, _w, _h, _borderradius, _linewidth, _draw ? _drawcolor : "", _fill ? _fillcolor : "", "" );
     }
}

function _e_ps_text( _x, _y, _text, _clr, _font_family, _font_size )
{
     if ( _glob_e_ps_open == 1 )
     global_js_e_ps_obj.text( _font_family, _font_size, _fontcolor, _x, _y, _text, "" );
}