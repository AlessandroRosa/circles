function CIRCLESformsSVGEDITORcodeSCANNER( _input_code )
{
    /*
        current interpreted commands are:
        <line ... >
        <circle ... >
        <rect ...>
        <text ...>
        
        * get the _input_code into a string with no carriage return
        * find the opening and closing tag sequence :        
    */
    
    circles_lib_canvas_clean( _glob_svg_canvas, "#FFFFFF" );
    _input_code = safe_string( _input_code, "" );
    var _code_array = _input_code.length == 0 ? _glob_export_code_array : _input_code.replaceAll( [ CRLF_WIN, CRLF_NO_WIN, '<br>' ], _glob_crlf ).split( _glob_crlf );
    var _line, _cl = safe_size( _code_array, 0 );
    for( var _c = 0 ; _c < _cl ; _c++ )
    {
        _line = _code_array[_c] ;
        // each cmd line starts with cmd label
        if ( _line.includes_i( "<line ", ">" ) )       CIRCLESformsSVGEDITORlinePROCESS( _line );
        else if ( _line.includes_i( "<circle", ">" ) ) CIRCLESformsSVGEDITORcirclePROCESS( _line );
        else if ( _line.includes_i( "<rect ", ">" ) )  CIRCLESformsSVGEDITORrectPROCESS( _line );
        else if ( _line.includes_i( "<text ", ">" ) )  CIRCLESformsSVGEDITORtextPROCESS( _line ); // this cmd consists of one opening and one closing tag
        else if ( _line.start_with( "<!" ) ) // comments
        {
            _line = safe_string( _line, "" ).replaceAll( [ "<!--", "-->" ], "" ).trim();
            if ( _line.toLowerCase().start_with( "plane" ) )
            {
                var _plane_type = safe_int( _line.replaceAll( "plane", "" ).trim(), NO_PLANE );
                if ( _plane_type == Z_PLANE ) $( "#CIRCLESformsSVGEDITORcoordsRADIO_01" ).get(0).checked = YES ;
                else if ( _plane_type == W_PLANE ) $( "#CIRCLESformsSVGEDITORcoordsRADIO_02" ).get(0).checked = YES ;
                else if ( _plane_type == BIP_BOX ) $( "#CIRCLESformsSVGEDITORcoordsRADIO_03" ).get(0).checked = YES ;
                CIRCLESformsSVGEDITORcanvasREF( _plane_type );
            }
        } 
    }
}

function CIRCLESformsSVGEDITORlinePROCESS( _cmd )
{
    _cmd = safe_string( _cmd, "" ).replaceAll( [ "<line ", "/>", ">" ], "" );
    var _attributes_array = _cmd.split( " " );
    var _drawcolor = "", _linewidth = 0 ;
    var _start_x = 0, _start_y = 0, _end_x = 0, _end_y = 0 ;
    var _attr, _params_array, _cmd, _val ;
    var _original_canvas_w = 0, _original_canvas_h = 0 ;
    switch ( _svg_editor_coords_ref )
    {
        case Z_PLANE:
        _original_canvas_w = _glob_zplane_rendering_canvas_placeholder.get_width() ;
        _original_canvas_h = _glob_zplane_rendering_canvas_placeholder.get_height() ;
        break ;
        case W_PLANE:
        _original_canvas_w = _glob_wplane_rendering_canvas_placeholder.get_width() ;
        _original_canvas_h = _glob_wplane_rendering_canvas_placeholder.get_height() ;
        break ;
        case BIP_BOX:
        _original_canvas_w = _glob_bip_canvas.get_width();
        _original_canvas_h = _glob_bip_canvas.get_height();
        break ;
        default: break ;
    }
      
    var _al = safe_size( _attributes_array, 0 );
    for( var _a = 0 ; _a < _al ; _a++ )
    {
           _attr = ( new String( _attributes_array[_a] ) ).trim();
           if ( _attr.length > 0 )
           {
                // read each attribute and extract parameters for drawing
                _attr = _attr.toLowerCase();
                if ( _attr.left( ( new String( "stroke-width=" ) ).length ) == "stroke-width=" )
                {
                     _params_array = _attr.split( "=" );
                     _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                     _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                     _linewidth = safe_int( _val, null );
                }
                else if ( _attr.left( ( new String( "stroke=" ) ).length ) == "stroke=" )
                {
                     _params_array = _attr.split( "=" );
                     _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                     _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                     _val = _val.trim();
                     _drawcolor = _val.length > 0 ? _val.toUpperCase() : null ;
                }
                else if ( _attr.left( ( new String( "x1=" ) ).length ) == "x1=" )
                {
                     _params_array = _attr.split( "=" );
                     _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                     _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                     _start_x = safe_int( _val, null );
                }
                else if ( _attr.left( ( new String( "y1=" ) ).length ) == "y1=" )
                {
                     _params_array = _attr.split( "=" );
                     _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                     _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                     _start_y = safe_int( _val, null );
                }
                else if ( _attr.left( ( new String( "x2=" ) ).length ) == "x2=" )
                {
                     _params_array = _attr.split( "=" );
                     _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                     _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                     _end_x = safe_int( _val, null );
                }
                else if ( _attr.left( ( new String( "y2=" ) ).length ) == "y2=" )
                {
                     _params_array = _attr.split( "=" );
                     _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                     _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                     _end_y = safe_int( _val, null );
                }
           }
    }
      
    // as we'are done with all attributes, let's draw the object
    if ( is_html_canvas( _glob_svg_canvas ) )
    {
       _start_x = _original_canvas_w > 0 ? ( _start_x / _original_canvas_w * _glob_svg_canvas.get_width() ) : 0 ;
       _start_y = _original_canvas_h > 0 ? ( _start_y / _original_canvas_h * _glob_svg_canvas.get_height() ) : 0 ;
       _end_x = _original_canvas_w > 0 ? ( _end_x / _original_canvas_w * _glob_svg_canvas.get_width() ) : 0 ;
       _end_y = _original_canvas_h > 0 ? ( _end_y / _original_canvas_h * _glob_svg_canvas.get_height() ) : 0 ;
                     
       var _svg_context = _glob_svg_canvas.getContext( _glob_canvas_ctx_2D_mode );
           _svg_context.beginPath();
           _svg_context.lineWidth = _linewidth ;
           _svg_context.moveTo( _start_x, _start_y );
           _svg_context.lineTo( _end_x, _end_y );
           _svg_context.strokeStyle = _drawcolor ;
           _svg_context.stroke();
           _svg_context.closePath();
    }
}

function CIRCLESformsSVGEDITORcirclePROCESS( _cmd )
{
    var _fillcolor = "", _fill = 0, _drawcolor = "", _draw = 0 ;
    var _center_x = 0, _center_y = 0, _radius = 0, _dashed = 0, _linewidth = 0 ;
    var _attr, _params_array, _cmd, _val ;

    _cmd = _cmd.stripdoublespaces();
    _cmd = safe_string( _cmd, "" ).replaceAll( [ "<circle ", "/>", ">" ], "" );
    var _attributes_array = _cmd.split( " " );
    var _original_canvas_w = 0, _original_canvas_h = 0 ;
    switch ( _svg_editor_coords_ref )
    {
        case Z_PLANE:
        _original_canvas_w = _glob_zplane_rendering_canvas_placeholder.get_width() ;
        _original_canvas_h = _glob_zplane_rendering_canvas_placeholder.get_height() ;
        break ;
        case W_PLANE:
        _original_canvas_w = _glob_wplane_rendering_canvas_placeholder.get_width() ;
        _original_canvas_h = _glob_wplane_rendering_canvas_placeholder.get_height() ;
        break ;
        case BIP_BOX:
        _original_canvas_w = _glob_bip_canvas.get_width();
        _original_canvas_h = _glob_bip_canvas.get_height();
        break ;
        default: break ;
    }

    var _al = safe_size( _attributes_array, 0 );
    for( var _a = 0 ; _a < _al ; _a++ )
    {
       _attr = ( new String( _attributes_array[_a] ) ).trim();
       if ( _attr.length > 0 )
       {
          // read each attribute and extract parameters for drawing
          _attr = _attr.toLowerCase();
          if ( _attr.left( ( new String( "stroke-dasharray=" ) ).length ) == "stroke-dasharray=" )
          {
              _dashed = 1 ;
          }
          else if ( _attr.left( ( new String( "stroke-width=" ) ).length ) == "stroke-width=" )
          {
              _params_array = _attr.split( "=" );
              _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
              _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
              _linewidth = safe_int( _val, null );
          }
          else if ( _attr.left( ( new String( "fill=" ) ).length ) == "fill=" )
          {
              _params_array = _attr.split( "=" );
              _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
              _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
              _val = _val.trim();
              _fillcolor = _val.length > 0 ? _val.toUpperCase() : null ;
              if ( _fillcolor != null ) _fill = YES ;
          }
          else if ( _attr.left( ( new String( "stroke=" ) ).length ) == "stroke=" )
          {
              _params_array = _attr.split( "=" );
              _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
              _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
              _val = _val.trim();
              _drawcolor = _val.length > 0 ? _val.toUpperCase() : null ;
              _draw = _drawcolor != null ? YES : NO ;
          }
          else if ( _attr.left( ( new String( "cx=" ) ).length ) == "cx=" )
          {
              _params_array = _attr.split( "=" );
              _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
              _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
              _center_x = safe_int( _val, null );
          }
          else if ( _attr.left( ( new String( "cy=" ) ).length ) == "cy=" )
          {
              _params_array = _attr.split( "=" );
              _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
              _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
              _center_y = safe_int( _val, null );
          }
          else if ( _attr.left( ( new String( "r=" ) ).length ) == "r=" )
          {
              _params_array = _attr.split( "=" );
              _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
              _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
              _radius = safe_int( _val, null );
          }
        }
    }
      
    // as we'are done with all attributes, let's draw the object
    if ( is_html_canvas( _glob_svg_canvas ) )
    {
        _center_x = _original_canvas_w > 0 ? _center_x / _original_canvas_w * _glob_svg_canvas.get_width() : 0 ;
        _center_y = _original_canvas_h > 0 ? _center_y / _original_canvas_h * _glob_svg_canvas.get_height() : 0 ;
        var _dim = Math.max( _original_canvas_w, _original_canvas_h );
        var _resizing_dim = Math.max( _glob_svg_canvas.get_width(), _glob_svg_canvas.get_height() );
        _radius = _dim > 0 ? _radius / _dim * _resizing_dim : 0 ;

        var _svg_context = _glob_svg_canvas.getContext( _glob_canvas_ctx_2D_mode );
            _svg_context.beginPath();
            _svg_context.lineWidth = _linewidth ;
            _svg_context.strokeStyle = _drawcolor != null ? ( _drawcolor.length > 0 ? _drawcolor : _glob_draw_seed_color ) : "" ;
            if ( _draw )
            {
                _svg_context.arc( _center_x, _center_y, _radius, 0, CIRCLES_TWO_PI );
                _svg_context.stroke();
            }
            else if ( _draw == 0 )
            {
               // draw the dashed circle only in the Z-plane
               // no action in the W-plane when draw = 0
               if ( _svg_context.type == Z_PLANE )
               {
                    if ( !_svg_context.setLineDash )
                    _svg_context.dottedArc( _center_x, _center_y, _radius, 0, CIRCLES_TWO_PI );
                    else
                    {
                       _svg_context.setLineDash([2,2]);
                       _svg_context.arc( _center_x, _center_y, _radius, 0, CIRCLES_TWO_PI );
                       _svg_context.stroke();
                       _svg_context.setLineDash([]);
                    }
               }
               else _svg_context.arc( _center_x, _center_y, _radius, 0, CIRCLES_TWO_PI );
            }
                               
            if ( _fill )
            {
                 _svg_context.fillStyle = _fillcolor, _svg_context.fill();
            }
            _svg_context.lineWidth = 1 ;
            _svg_context.closePath();
      }
}

function CIRCLESformsSVGEDITORrectPROCESS( _cmd )
{
    _cmd = safe_string( _cmd, "" ).replaceAll( [ "<rect ", "/>", ">" ], "" );
    var _attributes_array = _cmd.split( " " );
    var _original_canvas_w = 0, _original_canvas_h = 0 ;
    switch ( _svg_editor_coords_ref )
    {
        case Z_PLANE:
        _original_canvas_w = _glob_zplane_rendering_canvas_placeholder.get_width() ;
        _original_canvas_h = _glob_zplane_rendering_canvas_placeholder.get_height() ;
        break ;
        case W_PLANE:
        _original_canvas_w = _glob_wplane_rendering_canvas_placeholder.get_width() ;
        _original_canvas_h = _glob_wplane_rendering_canvas_placeholder.get_height() ;
        break ;
        case BIP_BOX:
        _original_canvas_w = _glob_bip_canvas.get_width();
        _original_canvas_h = _glob_bip_canvas.get_height();
        break ;
        default: break ;
    }

    var _x = 0, _y = 0, _width = 0, _height = 0, _opacity = _glob_opacity ;
    var _draw = 0, _drawcolor = "" ;
    var _fill = 0, _fillcolor = 0 ;
    var _linewidth = 0, _attr ;
    var _params_array, _cmd, _val, _style, _style_array, _style_attr, _style_attr_array, _style_attr_cmd, _style_attr_val ;

    var _al = safe_size( _attributes_array, 0 ), _sl, _st, _props ;
    for( var _a = 0 ; _a < _al ; _a++ )
    {
         _attr = ( new String( _attributes_array[_a] ) ).trim();
         if ( _attr.length > 0 )
         {
             // read each attribute and extract parameters for drawing
             _attr = _attr.toLowerCase();
             if ( _attr.start_with( "x=" ) )
             {
                 _params_array = _attr.split( "=" );
                 _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                 _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                 _x = safe_float( _val, null );
             }
             else if ( _attr.start_with( "y=" ) )
             {
                 _params_array = _attr.split( "=" );
                 _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                 _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                 _y = safe_float( _val, null );
             }
             else if ( _attr.start_with( "width=" ) )
             {
                 _params_array = _attr.split( "=" );
                 _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                 _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                 _width = safe_float( _val, null );
             }
             else if ( _attr.start_with( "height=" ) )
             {
                 _params_array = _attr.split( "=" );
                 _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                 _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                 _height = safe_float( _val, null );
             }
             else if ( _attr.start_with( "style=" ) )
             {
                 _params_array = _attr.split( "=" );
                 _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                 _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                 _style = _val ;
                 if ( _style.length > 0 )
                 {
                      _style_array = _style.includes( ";" ) ? _style.split( ";" ) : [ _style ];
                      _sl = safe_size( _style_array, 0 );
                      for( _st = 0 ; _st < _sl ; _st++ )
                      {
                           _style_attr = _style_array[_st] ;
                           if ( _style_attr.length > 0 )
                           {
                               _style_attr_array = _style_attr.split( ":" );
                               _style_attr_cmd = is_array( _style_attr_array ) ? _style_attr_array[0] : "" ;
                               _style_attr_val = is_array( _style_attr_array ) != null ? ( new String( _style_attr_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                                             
                               if ( _style_attr_cmd == "stroke" )
                               {
                                   _draw = YES ;
                                   _drawcolor = _style_attr_val ;
                               }
                               else if ( _style_attr_cmd == "fill" )
                               {
                                   _fill = YES ;
                                   _fillcolor = _style_attr_val ;
                               }
                               else if ( _style_attr_cmd == "stroke-width" )
                               {
                                   _linewidth = safe_int( _style_attr_val, null );
                               }
                               else if ( _style_attr_cmd == "fill-opacity" )
                               {
                                   _opacity = safe_float( _style_attr_val, 10 );
                                   _opacity = Math.max( 0.0, Math.min( 1.0, _opacity ) );
                               }
                           }
                      }                        
                 }
             }
           }
    }

    // as we'are done with all attributes, let's draw the object
    if ( is_html_canvas( _glob_svg_canvas ) )
    {
       _x = _original_canvas_w > 0 ? _x / _original_canvas_w * _glob_svg_canvas.get_width() : 0 ;
       _y = _original_canvas_h > 0 ? _y / _original_canvas_h * _glob_svg_canvas.get_height() : 0 ;
       _width = _width < 1 ? _width : ( _original_canvas_w > 0 ? _width / _original_canvas_h * _glob_svg_canvas.get_width() : 0 ) ;
       _height = _height < 1 ? _width : ( _original_canvas_h > 0 ? _height / _original_canvas_h * _glob_svg_canvas.get_height() : 0 ) ;

       var _rect_obj = new rect();
           _rect_obj.width_height_constructor( _x, _y, _width, _height );
       var _svg_context = _glob_svg_canvas.getContext( _glob_canvas_ctx_2D_mode );
       if ( _width < 1 && _height < 1 ) circles_lib_draw_pixel( _svg_context, null, _x, _y, _drawcolor, 1, _opacity, 0, NO ) ;
       else circles_lib_draw_rect( _svg_context, null, _rect_obj, _draw, _drawcolor, _fill, _fillcolor, _linewidth, 0, _opacity );
    }
}

function CIRCLESformsSVGEDITORtextPROCESS( _cmd )
{
    var _text = ( _cmd != null && _cmd != UNDEF ) ? _cmd.strip_tags() : new String( "" );
    _cmd = safe_string( _cmd, "" ).toLowerCase().replaceAll( [ "<text ", "/>", ">", "</text>" ], " " );
    var _attributes_array = _cmd.split( " " );
    var _original_canvas_w = 0, _original_canvas_h = 0 ;
    switch ( _svg_editor_coords_ref )
    {
        case Z_PLANE:
        _original_canvas_w = _glob_zplane_rendering_canvas_placeholder.get_width() ;
        _original_canvas_h = _glob_zplane_rendering_canvas_placeholder.get_height() ;
        break ;
        case W_PLANE:
        _original_canvas_w = _glob_wplane_rendering_canvas_placeholder.get_width() ;
        _original_canvas_h = _glob_wplane_rendering_canvas_placeholder.get_height() ;
        break ;
        case BIP_BOX:
        _original_canvas_w = _glob_bip_canvas.get_width();
        _original_canvas_h = _glob_bip_canvas.get_height();
        break ;
        default: break ;
    }
      
    var _x = 0, _y = 0, _font_color = "", _font_family = "", _font_size = 0, _opacity = _glob_opacity ;
    var _attr, _params_array, _cmd, _val, _style, _style_array, _style_attr, _style_attr_array, _style_attr_cmd, _style_attr_val ;
    var _al = safe_size( _attributes_array, 0 );
    for( var _a = 0 ; _a < _al ; _a++ )
    {
           _attr = ( new String( _attributes_array[_a] ) ).trim();
           if ( _attr.length > 0 )
           {
                // read each attribute and extract parameters for drawing
                _attr = _attr.toLowerCase();
                if ( _attr.left( ( new String( "x=" ) ).length ) == "x=" )
                {
                     _params_array = _attr.split( "=" );
                     _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                     _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                     _x = safe_int( _val, null );
                }
                else if ( _attr.left( ( new String( "y=" ) ).length ) == "y=" )
                {
                     _params_array = _attr.split( "=" );
                     _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                     _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                     _y = safe_int( _val, null );
                }
                else if ( _attr.left( ( new String( "font-family=" ) ).length ) == "font-family=" )
                {
                     _params_array = _attr.split( "=" );
                     _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                     _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                     _val = _val.trim();
                     _font_family = _val ;
                }
                else if ( _attr.left( ( new String( "font-size=" ) ).length ) == "font-size=" )
                {
                     _params_array = _attr.split( "=" );
                     _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                     _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                     _font_size = safe_int( _val, null );
                }
                else if ( _attr.left( ( new String( "style=" ) ).length ) == "style=" )
                {
                     _params_array = _attr.split( "=" );
                     _cmd = is_array( _params_array ) ? _params_array[0] : "" ;
                     _val = is_array( _params_array ) ? ( new String( _params_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                     _style = _val ;
                     if ( _style.length > 0 )
                     {
                         _style_array = _style.includes( ";" ) ? _style.split( ";" ) : [ _style ];
                         var _sl = safe_size( _style_array, 0 );
                         for( var _st = 0 ; _st < _sl ; _st++ )
                         {
                              _style_attr = _style_array[_st] ;
                              if ( _style_attr.length > 0 )
                              {
                                   _style_attr_array = _style_attr.split( ":" );
                                   _style_attr_cmd = _style_attr_array != null ? _style_attr_array[0] : "" ;
                                   _style_attr_val = _style_attr_array != null ? ( new String( _style_attr_array[1] ) ).replaceAll( ["\"", "'"], "" ) : "" ;
                                             
                                   if ( _style_attr_cmd == "stroke" )
                                   {
                                        _draw = YES ;
                                        _font_color = _style_attr_val ;
                                   }
                                   else if ( _style_attr_cmd == "fill" )
                                   {
                                        _fill = YES ;
                                        _font_color = _style_attr_val ;
                                   }
                                   else if ( _style_attr_cmd == "fill-opacity" || _style_attr_cmd == "stroke-opacity" )
                                   _opacity = Math.max( 0.0, Math.min( 1.0, safe_float( _style_attr_val, 10 ) ) );
                              }
                         }
                     }
                }
           }
    }
      
    // as we'are done with all attributes, let's draw the object
    if ( is_html_canvas( _glob_svg_canvas ) )
    {
        _x = _original_canvas_w > 0 ? _x / _original_canvas_w * _glob_svg_canvas.get_width() : 0 ;
        _y = _original_canvas_h > 0 ? _y / _original_canvas_h * _glob_svg_canvas.get_height() : 0 ;
        _font_size = _original_canvas_h > 0 ? ( _font_size / _original_canvas_h * _glob_svg_canvas.get_height() ) : 0 ;
        _font_size = Math.floor( _font_size ) - 1 ;

        var _font_style = _font_size + "pt " + _font_family  ;
        var _svg_context = _glob_svg_canvas.getContext( _glob_canvas_ctx_2D_mode );
        circles_lib_draw_text( _svg_context, null, _x, _y, _text, _font_color, _font_style, 0, 0, 0 );
    }
}