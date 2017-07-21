function CIRCLESmultithreadingDENSITYmetrics( _canvas, _rect_side )
{
    if ( !is_html_canvas( _canvas ) ) return null ;
    else
    {
       var _canvas_w = _canvas.width, _canvas_h =_canvas.height ;
       var _rect_w = _rect_side, _rect_h = _rect_side, _rects = [] ;
       var _nx = Math.floor( _canvas.width / _rect_w );
       		 if ( ( _canvas.width % _rect_w ) > 0 ) _nx++ ;
       var _ny = Math.floor( _canvas.height / _rect_h );
       		 if ( ( _canvas.height % _rect_h ) > 0 ) _ny++ ;
       var _x, _y ;
       for( _y = 1 ; _y <= _ny ; _y++ )
       {
		      for( _x = 1 ; _x <= _nx ; _x++ )
          {
             _rects.push( [ [ ( _x - 1 ) * _rect_w, ( _y - 1 ) * _rect_h,
                              _x * _rect_h, _y * _rect_h ], // rect points
                              0, // counting var
                              [] // last pt rec
                          ] );
          }
       }
       return [ _rects, _rect_w, _rect_h, _nx, _ny ] ;
    }
}

function CIRCLESmultithreadingDENSITYgridDISPLAY( _canvas )
{
    if ( is_html_canvas( _canvas ) )
    {
       var _ctx = _canvas.getContext( _glob_canvas_ctx_2D_mode ) ;
       var _metrics_array = CIRCLESmultithreadingDENSITYmetrics( _canvas, _glob_density_rect_side ) ;
       $.each( _metrics_array[0], function( _i, _rect ) { circles_lib_draw_rect( _ctx, wplane_sm, _rect, YES, "#898989", NO, "", 1, NO, _glob_opacity, 0 ) ; } ) ;
    }
}

function CIRCLESmultithreadingDENSITYscanner( _canvas, _density_coeff )
{
    if ( !is_html_canvas( _canvas ) ) return null ;
    else
    {
        _density_coeff = safe_float( _density_coeff, 0 ) ;
        var _canvas_w = _canvas.width, _canvas_h =_canvas.height ;
        var _ctx = _canvas.getContext( _glob_canvas_ctx_2D_mode ) ;
        var _canvas_data = _ctx.getImageData( 0, 0, _canvas_w, _canvas_h ).data ;
        // dividing canvas into smaller rects
        var _r, _g, _b, _alpha, _x, _y, _i = 0, _rect_index = 0, _count = 0 ;
        // initialization
        var _metrics_array = CIRCLESmultithreadingDENSITYmetrics( _canvas, _glob_density_rect_side ) ;
        var _rects = _metrics_array[0] ;
        var _rect_w = _metrics_array[1], _rect_h = _metrics_array[2] ;
        var _nx = _metrics_array[3], _ny = _metrics_array[4] ;
        var _area = _rect_w * _rect_h ;
        var _brightness = 0, _threshold = 0 ;

        // counting non-transparent pixels per each rect
        _x = 0, _y = 0 ;
        for( _y = 0 ; _y < _canvas_h ; _y++ )
        {
           for( _x = 0 ; _x < _canvas_w ; _x++ )
           {
              _i = ( _x + _y * _canvas_w ) * 4 ; // arithmetic pointer to the (x,y) pixel (each one is coded by r,g,b,alpha vector)
              // simplest brightness calculation by average formula
              _brightness = ( _canvas_data[_i] + _canvas_data[_i+1] + _canvas_data[_i+2] ) / 3.0 ;
              if ( _brightness > _threshold )
              {
                _rect_index = Math.floor( _x / _rect_w ) + Math.floor( _y / _rect_h ) * _nx ;
                if ( _rects[ _rect_index ] != null )
                {
                   _rects[ _rect_index ][1] = _rects[ _rect_index ][1] + 1 ;
                   _rects[ _rect_index ][2] = [ _x, _y ] ;
                }
              }
           }
        }

			  // recalc density of points per area in a normalized fashion (i.e. 0 <= density <= 1 )
        for( var _n = 0 ; _n < _rects.length ; _n++ ) _rects[_n][1] /= _area ; 
        // detecting rect with minimal number of points (density)
        // empty regions are discarded from detection
        var _min = 0, _max = 0, _mid = 0, _ref = null ;
        for( var _n = 0 ; _n < _rects.length ; _n++ )
        {
           if ( _rects[_n][1] > 0 )
           {
         		  if ( _min == 0 || _rects[_n][1] <= _min ) _min = _rects[_n][1] ;
						  else if ( _max == 0 || _rects[_n][1] >= _max ) _max = _rects[_n][1] ;
           }
        }

        _mid = ( _max + _min ) / 2.0 * Math.abs( _density_coeff ) ;

        var _dist_rec = 0, _index = 0 ;
        for( var _n = 0 ; _n < _rects.length ; _n++ )
        {
           if ( _rects[_n][1] > 0 && _glob_density_rect_lastindex != _n &&
					 			( _dist_rec == 0 || Math.abs( _mid - _rects[_n][1] ) <= _dist_rec ) )
           {
              _ref = _rects[_n], _index = _n ;
              _dist_rec = Math.abs( _mid - _rects[_n][1] ) ;
           }
        }

        _glob_density_rect_lastindex = _index ;
        var _pt = new point( safe_float( _ref[2][0] ), safe_float( _ref[2][1], 0 ) ) ;
        var _rect = new rect( _pt.x - _rect_w / 2, _pt.y - _rect_h / 2, _pt.x + _rect_w / 2, _pt.y + _rect_h / 2, _RECT_ORIENTATION_SCREEN, "" );
        _ctx = _glob_wplane_work_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ) ;
				circles_lib_draw_rect( _ctx, wplane_sm, _rect, NO, "", YES, "#C3C3FB", 0, NO, 0.70, 0 ) ;
        setTimeout( function(){ circles_lib_canvas_clean( _glob_wplane_work_canvas_placeholder ); }, 2500 ) ;
        // picking up the point stored in the resulting rect
        _pt = wplane_sm.from_client_to_cartesian( _pt.x, _pt.y );
        return _pt ;
    }
}