function _canvas_draw_circle( _canvas, _center_x, _center_y, _radius, _draw, _bordercolor, _fill, _fillcolor, _line_thickness, _opacity )
{
     if ( !object_exists( _canvas ) || !( _canvas instanceof HTMLCanvasElement ) ) return NO ;

     if ( isNaN( _draw ) ) _draw = 0 ;
     if ( isNaN( _fill ) ) _fill = 0 ;
     if ( !object_exists( _bordercolor ) ) _bordercolor = "" ;
     if ( !object_exists( _fillcolor ) ) _fillcolor = "" ;

     _line_thickness = ( !object_exists( _line_thickness ) ) ? 0 : parseInt( _line_thickness, 10 ) ;
     if ( isNaN( _line_thickness ) ) _line_thickness = 0 ;

     if ( !object_exists( _opacity ) ) _opacity = 1.0 ;
     else _opacity = parseFloat( _opacity );
     if ( isNaN( _opacity ) || _opacity < 0.0 || _opacity > 1.0 ) _opacity = 1.0 ;

		 var _context = _canvas.getContext( "2d" ) ;
		 _context.globalAlpha = _opacity ;
     _context.beginPath();
     _context.lineWidth = _line_thickness ;
     _context.strokeStyle = ( _bordercolor.length > 0 ) ? _bordercolor : "black" ;
     if ( _draw )
     {
         _context.arc( _center_x, _center_y, _radius, 0, 2.0 * Math.PI );
         if ( _line_thickness > 0 ) _context.stroke();
     }
     else if ( _draw == 0 )
     {
         // _draw the dashed circle only in the source plane
         // no action in the image plane when _draw = 0
         if ( !context.setLineDash ) _context.dottedArc( _center_x, _center_y, _radius, 0, 2.0 * Math.PI );
         else
         {
              _context.setLineDash([2,2]);
              _context.arc( _center_x, center_y, _radius, 0, 2.0 * Math.PI ); 
              if ( _line_thickness > 0 ) _context.stroke();
              _context.setLineDash([]);
         }
     }
           
     if ( _fill && _fillcolor.length > 0 )
     {
          _context.fillStyle = _fillcolor ;
          _context.fill();
     }

     _context.closePath();
     return YES ;
}

function _canvas_draw_pixel( _canvas, _x, _y, _bordercolor, _size, _opacity )
{
     if ( !object_exists( _canvas ) || !( _canvas instanceof HTMLCanvasElement ) ) return NO ;
		 var _context = _canvas.getContext( "2d" ) ;

     if ( !object_exists( _opacity ) ) _opacity = 1.0 ;
     else _opacity = parseFloat( _opacity );
     if ( isNaN( _opacity ) || _opacity < 0.0 || _opacity > 1.0 ) _opacity = 1.0 ;

     if ( !object_exists( _bordercolor ) ) _bordercolor = "" ;
     _size = ( _size == null || _size == "undefined" ) ? 1 : parseInt( _size, 10 ) ;
     if ( isNaN( _size ) ) _size = 1 ;

     _context.globalAlpha = _opacity ;
     _context.beginPath();
     _context.fillStyle = _bordercolor ;
     _context.fillRect( _x, _y, _size, _size );
     _context.stroke();
     _context.closePath();
}

function _canvas_draw_line( _canvas, mapper, _from_x, _from_y, _to_x, _to_y, _bordercolor, _line_thickness, _opacity )
{
     if ( !object_exists( _canvas ) || !( _canvas instanceof HTMLCanvasElement ) ) return NO ;
		 var _context = _canvas.getContext( "2d" ) ;

     if ( !object_exists( _opacity ) ) _opacity = 1.0 ;
     else _opacity = parseFloat( _opacity );
     if ( isNaN( _opacity ) || _opacity < 0.0 || _opacity > 1.0 ) _opacity = 1.0 ;

     _line_thickness = ( !object_exists( _line_thickness ) ) ? 0 : parseInt( _line_thickness, 10 ) ;
     if ( isNaN( _line_thickness ) ) _line_thickness = 0 ;
     if ( !object_exists( _bordercolor ) ) _bordercolor = "" ;

     _context.globalAlpha = _opacity ;
     _context.beginPath();
     _context.lineWidth = _line_thickness ;
     _context.moveTo( _from_x, from_y );
     _context.lineTo( _to_x, _to_y );
     _context.strokeStyle = _bordercolor ;
     _context.stroke();
     _context.closePath();
}

function _canvas_polyline( _canvas, POINTSarray, _bordercolor, _line_thickness, _close, _opacity )
{
     if ( !object_exists( _canvas ) || !( _canvas instanceof HTMLCanvasElement ) ) return NO ;
		 var _context = _canvas.getContext( "2d" ) ;

     if ( !object_exists( _opacity ) ) _opacity = 1.0 ;
     else _opacity = parseFloat( _opacity );
     if ( isNaN( _opacity ) || _opacity < 0.0 || _opacity > 1.0 ) _opacity = 1.0 ;

     if ( _close == null || _close == "undefined" ) _close = 0 ;
     else _close = parseInt( _close, 10 );
     if ( isNaN( _close ) ) _close = 0 ;

     _line_thickness = ( !object_exists( _line_thickness ) ) ? 0 : parseInt( _line_thickness, 10 ) ;
     if ( isNaN( _line_thickness ) ) _line_thickness = 0 ;
     if ( !object_exists( _bordercolor ) ) _bordercolor = "" ;

     var _p_length = POINTSarray.length ;
     if ( _p_length > 0 )
     {
     		 var FROM_PT, TO_PT ;
         for( var i = 1 ; i < _p_length ; i++ )
         {
             FROM_PT = POINTSarray[i-1], TO_PT = POINTSarray[i] ;
             _canvas_draw_line( _canvas, FROM_PT.x, FROM_PT.y, TO_PT.x, TO_PT.y, _bordercolor, _line_thickness, _opacity ) ;
         }
           
         if ( _close )
         {
             FROM_PT = POINTSarray[_p_length-1], TO_PT = POINTSarray[0] ;
             _canvas_draw_line( _canvas, FROM_PT.x, FROM_PT.y, TO_PT.x, TO_PT.y, _bordercolor, _line_thickness, _opacity ) ;
         }
     }
}

function _canvas_draw_rect( _canvas, _rect_obj, _draw, _bordercolor, _fill, _fillcolor, _line_thickness, _map_it, _opacity )
{
     if ( !object_exists( _canvas ) || !( _canvas instanceof HTMLCanvasElement ) ) return NO ;
		 var _context = _canvas.getContext( "2d" ) ;

     if ( !object_exists( _map_it ) ) _map_it = 0 ;
     else _map_it = parseInt( _map_it, 10 );
     if ( isNaN( _map_it ) ) _map_it = 0 ;

     if ( isNaN( _draw ) ) _draw = 0 ;
     if ( isNaN( _fill ) ) _fill = 0 ;
     if ( !object_exists( _bordercolor ) ) _bordercolor = "" ;
     if ( !object_exists( _fillcolor ) ) _fillcolor = "" ;

     _line_thickness = ( !object_exists( _line_thickness ) ) ? 0 : parseInt( _line_thickness, 10 ) ;
     if ( isNaN( _line_thickness ) ) _line_thickness = 0 ;

     if ( !object_exists( _opacity ) ) _opacity = 1.0 ;
     else _opacity = parseFloat( _opacity );
     if ( isNaN( _opacity ) || _opacity < 0.0 || _opacity > 1.0 ) _opacity = 1.0 ;
      
     _context.globalAlpha = _opacity ;
     _context.beginPath();
     _context.rect( _rect_obj.x1, _rect_obj.y1, _rect_obj.width(), _rect_obj.height() ) ;
     if ( _draw )
     {
          _context.lineWidth = _line_thickness ;
          _context.strokeStyle = _bordercolor ;
          _context.stroke();
     }
     if ( _fill )
     {
          _context.fillStyle = _fillcolor ;
          _context.fill();
     }

     _context.closePath();
}

function _canvas_draw_point( _canvas, _x, _y, _draw, _bordercolor, _fill, _fillcolor, _line_thickness, radius, _opacity )
{
     if ( !object_exists( _canvas ) || !( _canvas instanceof HTMLCanvasElement ) ) return NO ;
		 var _context = _canvas.getContext( "2d" ) ;

     if ( _draw == null || _draw == "undefined" ) _draw = YES ;
     if ( _fill == null || _fill == "undefined" ) _fill = NO ;

     if ( !object_exists( _bordercolor ) ) _bordercolor = "" ;
     if ( !object_exists( _fillcolor ) ) _fillcolor = "" ;
     if ( radius == null || radius == "undefined" ) radius = 0 ;

     if ( !object_exists( _line_thickness ) ) _line_thickness = 0 ;
     _line_thickness = parseInt( _line_thickness, 10 );
     if ( isNaN( _line_thickness ) ) _line_thickness = 0 ;
       
     if ( _bordercolor.length == 0 ) _bordercolor = "black" ;
     if ( _bordercolor.length > 0 || _fillcolor.length > 0 )
     {
          _context.globalAlpha = _opacity ;
          _context.beginPath();
          _context.lineWidth = _line_thickness ;
          _context.arc( _x, _y, radius, 0, 2.0 * Math.PI ); // goes along the line _drawing the arc

          if ( _fillcolor.length > 0 ) _context.fillStyle = _fillcolor ;
          if ( _fill ) _context.fill();

          if ( _bordercolor.length > 0 ) _context.strokeStyle = _bordercolor ;
          if ( _draw ) _context.stroke();

          _context.closePath();
      }
       
      return screen_pt ;
}

function CIRCLESdrawTEXT( _canvas, _x, _y, _text, _textcolor, _fontstyle, _shift_x_canvas, _shift_y_canvas, _map_it, _opacity )
{
     if ( !object_exists( _canvas ) || !( _canvas instanceof HTMLCanvasElement ) ) return NO ;
		 var _context = _canvas.getContext( "2d" ) ;

     if ( !object_exists( _map_it ) ) _map_it = 1 ;
     if ( _shift_x_canvas == null || _shift_x_canvas == "undefined" ) _shift_x_canvas = 0 ;
     if ( _shift_y_canvas == null || _shift_y_canvas == "undefined" ) _shift_y_canvas = 0 ;

     if ( !object_exists( _opacity ) ) _opacity = 1.0 ;
     else _opacity = parseFloat( _opacity );
     if ( isNaN( _opacity ) || _opacity < 0.0 || _opacity > 1.0 ) _opacity = 1.0 ;

     if ( _textcolor == null || _textcolor == "undefined" ) _textcolor = "" ;
     if ( _fontstyle == null || _fontstyle == "undefined" ) _fontstyle = "" ;
      
     _context.globalAlpha = _opacity ;
     _context.font = ( _fontstyle.length == 0 ) ? "10pt Arial" : _fontstyle ;
     _context.fillStyle = ( _textcolor.length == 0 ) ? "black" : _textcolor ;
     _context.fillText( _text, _x + _shift_x_canvas, _y + _shift_y_canvas );
}