var HTML_CANVAS_ELEMENT_2D_MODE = "2d" ;

HTMLCanvasElement.prototype.set_dims = function( _w, _h ) { this.set_width( _w ); this.set_height( _h ) ; }
HTMLCanvasElement.prototype.get_dims = function() { return [ safe_int( this.width, 0 ), safe_int( this.height, 0 ) ]; }
HTMLCanvasElement.prototype.set_width = function( _w )    { this.style.width = safe_int( _w, 0 ) + "px" ; this.width = _w ; }
HTMLCanvasElement.prototype.set_height = function( _h )   { this.style.height = safe_int( _h, 0 ) + "px" ; this.height = _h ; }
HTMLCanvasElement.prototype.get_width = function()        { return safe_int( this.style.width, 0 ); }
HTMLCanvasElement.prototype.get_height = function()       { return safe_int( this.style.height, 0 ); }
HTMLCanvasElement.prototype.aspect_ratio = function() { return this.get_width() / this.get_height(); }
HTMLCanvasElement.prototype.area = function()             { return this.get_width() * this.get_height(); }
HTMLCanvasElement.prototype.diagonal = function()
{
    var _w = this.get_width(), _h = this.get_height();
    return Math.floor( Math.sqrt( _w * _w + _h * _h ) );
}

HTMLCanvasElement.prototype.square_it = function( _side ) { this.set_width( _side );  this.set_height( _side ); }
HTMLCanvasElement.prototype.resize = function( _w, _h )   { this.set_width( _w );  this.set_height( _h ); }
HTMLCanvasElement.prototype.clean = function( _color )
{
    _color = safe_string( _color, "transparent" );
    var _context = this.getContext( HTML_CANVAS_ELEMENT_2D_MODE );
    if ( _context != null )
    {
       var W = this.get_width(), H = this.get_height() ;
       _context.clearRect( 0, 0, W, H );
       _context.fillStyle =  _color.length > 0 ? _color : ( _bk.length > 0 ? _bk : "rgba( 255, 255, 255, 0 )" );
       this.set_backgroundcolor( _context.fillStyle ) ;
       _context.fillRect( 0, 0, W, H );
    }
}

HTMLCanvasElement.prototype.is_visible = function() { return this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).visible ; }

HTMLCanvasElement.prototype.get_type = function()            { return this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).type ; }
HTMLCanvasElement.prototype.get_idcanvas = function()        { return this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).idcanvas ; }
HTMLCanvasElement.prototype.get_iddiv = function() { return this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).iddiv ; }
HTMLCanvasElement.prototype.get_type = function()            { return this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).type ; }
HTMLCanvasElement.prototype.get_role_id = function() { return this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).role ; }
HTMLCanvasElement.prototype.get_role_def = function()        { return this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).role_def ; }
HTMLCanvasElement.prototype.get_label = function() { return this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).label ; }
HTMLCanvasElement.prototype.get_plane_def = function()       { return this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).plane_def ; }
HTMLCanvasElement.prototype.is_defaultcanvas = function()    { return this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).defaultcanvas ; }
HTMLCanvasElement.prototype.get_backgroundcolor = function() { return this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).backgroundColor ; }

HTMLCanvasElement.prototype.set_visible = function( _v ) { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).visible = _v ; }
HTMLCanvasElement.prototype.set_type = function( _t )              { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).type = _t ; }
HTMLCanvasElement.prototype.set_idcanvas = function( _id ) { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).idcanvas = _id ; }
HTMLCanvasElement.prototype.set_iddiv = function( _id )            { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).iddiv = _id ; }
HTMLCanvasElement.prototype.set_type = function( _t )              { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).type = _t ; }
HTMLCanvasElement.prototype.set_role_id = function( _id ) { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).role = _id ; }
HTMLCanvasElement.prototype.set_role_def = function( _def )        { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).role_def = _def ; }
HTMLCanvasElement.prototype.set_label = function( _l )             { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).label = _l ; }
HTMLCanvasElement.prototype.set_plane_def = function( _def )       { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).plane_def = _def ; }
HTMLCanvasElement.prototype.set_defaultcanvas = function( _dc )    { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).defaultcanvas = _dc ? 1 : 0 ; }
HTMLCanvasElement.prototype.set_backgroundcolor = function( _clr ) { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).backgroundColor = _clr ; }
HTMLCanvasElement.prototype.set_complex_rect = function( _cr ) { this.getContext(HTML_CANVAS_ELEMENT_2D_MODE).complex_rect = _cr ; }