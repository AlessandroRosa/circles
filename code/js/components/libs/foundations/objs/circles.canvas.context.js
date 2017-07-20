if ( typeof safe_int != "function" )
{
    function safe_int( _val, _set_if_nan )
    {
        _val = parseInt( _val, 10 );
        return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ;
    }
}

CanvasRenderingContext2D.prototype.complex_rect = new rect();
CanvasRenderingContext2D.prototype.backgroundColor = "" ;
CanvasRenderingContext2D.prototype.defaultcanvas = 0 ;
CanvasRenderingContext2D.prototype.id = "" ;
CanvasRenderingContext2D.prototype.idcanvas = "" ;
CanvasRenderingContext2D.prototype.iddiv = "" ;
CanvasRenderingContext2D.prototype.label = "" ;
CanvasRenderingContext2D.prototype.mapper = null ;
CanvasRenderingContext2D.prototype.plane_def = "" ;
CanvasRenderingContext2D.prototype.role = 0 ; 
CanvasRenderingContext2D.prototype.role_def = "" ;
CanvasRenderingContext2D.prototype.seconds = 0 ;
CanvasRenderingContext2D.prototype.type = 0 ;
CanvasRenderingContext2D.prototype.visible = 0 ;
CanvasRenderingContext2D.prototype.xpos = 0 ;
CanvasRenderingContext2D.prototype.ypos = 0 ;

CanvasRenderingContext2D.prototype.clear = CanvasRenderingContext2D.prototype.clear || function (preserveTransform)
{
    if (preserveTransform)
    {
       this.save();
       this.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.clearRect( 0, 0, this.get_width(), this.get_height() );
    if ( preserveTransform ) this.restore();
}


CanvasRenderingContext2D.prototype.get_canvas = function() { return this.canvas ; }
CanvasRenderingContext2D.prototype.get_width = function() { return this.canvas.clientWidth ; }
CanvasRenderingContext2D.prototype.get_height = function() { return this.canvas.clientHeight ; }

CanvasRenderingContext2D.prototype.get_aspect_ratio = function() { return this.get_width() / this.get_height() ; }
CanvasRenderingContext2D.prototype.area = function() { return this.get_width() * this.get_height() ; }
CanvasRenderingContext2D.prototype.is_square = function() { return this.get_width() == this.get_height() ; }
CanvasRenderingContext2D.prototype.is_rect = function() { return this.get_width() != this.get_height() ; }
CanvasRenderingContext2D.prototype.is_rect_vert = function() { return ( this.get_width() != this.get_height() && this.get_width() < this.get_height() ); }
CanvasRenderingContext2D.prototype.is_rect_horz = function() { return ( this.get_width() != this.get_height() && this.get_width() > this.get_height() ); }

CanvasRenderingContext2D.prototype.dashedLineTo = function(fromX, fromY, toX, toY, pattern) {
  // Our growth rate for our line can be one of the following:
  //   (+,+), (+,-), (-,+), (-,-)
  // Because of this, our algorithm needs to understand if the x-coord and
  // y-coord should be getting smaller or larger and properly cap the values
  // based on (x,y).
  var lt = function (a, b) { return a <= b; };
  var gt = function (a, b) { return a >= b; };
  var capmin = function (a, b) { return Math.min(a, b); };
  var capmax = function (a, b) { return Math.max(a, b); };
 
  var checkX = { thereYet: gt, cap: capmin };
  var checkY = { thereYet: gt, cap: capmin };
 
  if (fromY - toY > 0) {
    checkY.thereYet = lt;
    checkY.cap = capmax;
  }
  if (fromX - toX > 0) {
    checkX.thereYet = lt;
    checkX.cap = capmax;
  }
 
  this.moveTo(fromX, fromY);
  var offsetX = fromX;
  var offsetY = fromY;
  var idx = 0, dash = true;
  while (!(checkX.thereYet(offsetX, toX) && checkY.thereYet(offsetY, toY)))
	{
    var ang = Math.atan2(toY - fromY, toX - fromX);
    var len = pattern[idx];
 
    offsetX = checkX.cap(toX, offsetX + (Math.cos(ang) * len));
    offsetY = checkY.cap(toY, offsetY + (Math.sin(ang) * len));
 
    if (dash) this.lineTo(offsetX, offsetY);
    else this.moveTo(offsetX, offsetY);
 
    idx = (idx + 1) % pattern.length ;
    dash = !dash;
  }
}

CanvasRenderingContext2D.prototype.dottedArc = function(x,y,radius,startAngle,endAngle,anticlockwise)
{
    var g = Math.PI / radius / 2, sa = startAngle, ea = startAngle + g;
    while(ea < endAngle)
    {
        this.beginPath();
        this.arc(x,y,radius,sa,ea,anticlockwise);
        this.stroke();
        sa = ea + g, ea = sa + g;
    }
}

CanvasRenderingContext2D.prototype.invert_color_pix = function( _start_x, _start_y, _w, _h )
{
		_start_x = safe_int( _start_x, 0 ), _start_y = safe_int( _start_y, 0 );
		_w = safe_int( _w, this.get_width() ), _h = safe_int( _h, this.get_height() );
		var _img_data = this.getImageData(_start_x, _start_y, _w, _h );
		var pix = _img_data.data;
		for ( var i = 0, n = pix.length; i < n; i += 4)
		{
				pix[i  ] = 255 - pix[i  ] ; // red
			  pix[i+1] = 255 - pix[i+1] ; // green
			  pix[i+2] = 255 - pix[i+2] ; // blue
			  pix[i+3] = 255 - pix[i+3] ; // alpha
		}
		this.putImageData(_img_data, _start_x, _start_y);
}