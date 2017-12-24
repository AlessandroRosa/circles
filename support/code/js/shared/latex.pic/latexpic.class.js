if ( typeof is_array != "function" ) function is_array( _a ) 		{ return _a instanceof Array ? 1 : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj )  { return ( typeof _obj == "number" || _obj instanceof Number ) ; }

if ( typeof get_os != "function" )
function get_os()
{
    var _os = navigator.appVersion.toLowerCase();
    if ( _os.indexOf("win") != -1 || _os.indexOf("windows") != -1 ) return "windows" ;
    else if ( _os.indexOf("mac") != -1 ) return "macos";
    else if ( _os.indexOf("x11") != -1 ) return "unix";
    else if ( _os.indexOf("linux") != -1 ) return "linux";
}

if ( typeof is_win != "function" ) function is_win() { return ( get_os() == "windows" ) ? 1 : 0 ; }

if ( typeof swap != "function" )
{
    function swap( _a, _b )
    {
        var _x = _a ;
      	_a = _b, _b = _x ;
      	return [ _a, _b ] ;
    }
}

if ( typeof safe_int != "function" )
{
    function safe_int( _val, _set_if_nan )
    {
        _val = parseInt( _val, 10 );
        return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ;
    }
}

if ( typeof safe_float != "function" )
{
    function safe_float( _val, _set_if_nan )
    {
        _val = parseFloat( _val );
        return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ;
    }
}

if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ) ; }
// official 'xcolor' package shades table
var _latex_palette = [] ;
    _latex_palette['apricot'] = "#fbb982" ;
    _latex_palette['aquamarine'] = "#00b5be" ;
    _latex_palette['bittersweet'] = "#c04f17" ;
    _latex_palette['black'] = "#221e1f" ;
    _latex_palette['blue'] = "#2d2f92" ;
    _latex_palette['bluegreen'] = "#00b3b8" ;
    _latex_palette['blueviolet'] = "#473992" ;
    _latex_palette['brickred'] = "#b6321c" ;
    _latex_palette['brown'] = "#792500" ;
    _latex_palette['burntorange'] = "#f7921d" ;
    _latex_palette['cadetblue'] = "#74729a" ;
    _latex_palette['carnationpink'] = "#f282b4" ;
    _latex_palette['cerulean'] = "#00a2e3" ;
    _latex_palette['cornflowerblue'] = "#41b0e4" ;
    _latex_palette['cyan'] = "#00aeef" ;
    _latex_palette['dandelion'] = "#fdbc42" ;
    _latex_palette['darkorchid'] = "#a4538a" ;
    _latex_palette['emerald'] = "#00a99d" ;
    _latex_palette['forestgreen'] = "#009b55" ;
    _latex_palette['fuchsia'] = "#8c368c" ;
    _latex_palette['goldenrod'] = "#ffdf42" ;
    _latex_palette['gray'] = "#949698" ;
    _latex_palette['green'] = "#00a64f" ;
    _latex_palette['greenyellow'] = "#dfe674" ;
    _latex_palette['junglegreen'] = "#00a99a" ;
    _latex_palette['lavender'] = "#f49ec4" ;
    _latex_palette['limegreen'] = "#8dc73e" ;
    _latex_palette['magenta'] = "#ec008c" ;
    _latex_palette['mahogany'] = "#a9341f" ;
    _latex_palette['maroon'] = "#af3235" ;
    _latex_palette['melon'] = "#f89e7b" ;
    _latex_palette['midnightblue'] = "#006795" ;
    _latex_palette['mulberry'] = "#a93c93" ;
    _latex_palette['navyblue'] = "#006eb8" ;
    _latex_palette['olivegreen'] = "#3c8031" ;
    _latex_palette['orange'] = "#f58137" ;
    _latex_palette['orangered'] = "#ed135a" ;
    _latex_palette['orchid'] = "#af72b0" ;
    _latex_palette['peach'] = "#f7965a" ;
    _latex_palette['periwinkle'] = "#7977b8" ;
    _latex_palette['pinegreen'] = "#008b72" ;
    _latex_palette['plum'] = "#92268f" ;
    _latex_palette['processblue'] = "#00b0f0" ;
    _latex_palette['purple'] = "#99479b" ;
    _latex_palette['rawsienna'] = "#974006" ;
    _latex_palette['red'] = "#ed1b23" ;
    _latex_palette['redorange'] = "#f26035" ;
    _latex_palette['redviolet'] = "#a1246b" ;
    _latex_palette['rhodamine'] = "#ef559f" ;
    _latex_palette['royalblue'] = "#0071bc" ;
    _latex_palette['royalpurple'] = "#613f99" ;
    _latex_palette['rubinered'] = "#ed017d" ;
    _latex_palette['salmon'] = "#f69289" ;
    _latex_palette['seagreen'] = "#3fbc9d" ;
    _latex_palette['sepia'] = "#671800" ;
    _latex_palette['skyblue'] = "#46c5dd" ;
    _latex_palette['springgreen'] = "#c6dc67" ;
    _latex_palette['tan'] = "#da9d76" ;
    _latex_palette['tealblue'] = "#00aeb3" ;
    _latex_palette['thistle'] = "#d883b7" ;
    _latex_palette['turquoise'] = "#00b4ce" ;
    _latex_palette['violet'] = "#58429b" ;
    _latex_palette['violetred'] = "#ef58a0" ;
    _latex_palette['white'] = "#ffffff" ;
    _latex_palette['wildstrawberry'] = "#ee2967" ;
    _latex_palette['yellow'] = "#fff200" ;
    _latex_palette['yellowgreen'] = "#98cc70" ;
    _latex_palette['yelloworange'] = "#faa21a" ;

if ( typeof get_rgb_dist != "function" )
{
    function get_rgb_dist( _r1, _g1, _b1, _r2, _g2, _b2 )
    {
         return Math.sqrt( Math.pow(Math.abs(_r1-_r2),2)+Math.pow(Math.abs(_g1-_g2),2)+Math.pow(Math.abs(_b1-_b2),2) ) ;
    }
}

var _latex_options = [] ;
    _latex_options['offset_x'] = 0;
    _latex_options['offset_y'] = 0;
    _latex_options['paperheight'] = '9.75in';
    _latex_options['paperwidth'] = '9.40in';
    _latex_options['margin'] = '1in';
    _latex_options['heightrounded'] = 1 ;
    _latex_options['left'] = '20mm';
    _latex_options['right'] = '20mm';
    _latex_options['top'] = '15mm';
    _latex_options['bottom'] = '20mm';
    _latex_options['customfonts'] = 0 ;

if ( typeof get_closest_color_tag != "function" )
{
    function get_closest_color_tag( _rgb /* it might be a rgbhex value (i.e. #90AA08) or a color tag */ )
    {
        _rgb = safe_string( _rgb, "" ).trim();
        if ( _rgb.length > 0 && _rgb.substr( 0, 1 ) == "#" )
        {
             _rgb = _rgb.replace( "#", "" );
             if ( _rgb.length == 6 )
             {
                 _rgb = _rgb.replace( "#", "" ).trim() ;
                  var _r = parseInt( _rgb.substr( 0, 2 ), 16 ) ;
                  var _g = parseInt( _rgb.substr( 2, 2 ), 16 ) ;
                  var _b = parseInt( _rgb.substr( 4, 2 ), 16 ) ;
                  var _keys = _latex_palette.keys_associative(), _color, _tmp_r, _tmp_g, _tmp_b, _min = 0, _dist = 0 ;
                  var _selected_key = "" ;
                  for( var _k = 0 ; _k < _keys.length ; _k++ )
                  {
                       _color = _latex_palette[ _keys[_k] ].replace( "#", "" ).trim() ;
                       _tmp_r = parseInt( _color.substr( 0, 2 ), 16 ) ;
                       _tmp_g = parseInt( _color.substr( 2, 2 ), 16 ) ;
                       _tmp_b = parseInt( _color.substr( 4, 2 ), 16 ) ;

                       _dist = get_rgb_dist( _r, _g, _b, _tmp_r, _tmp_g, _tmp_b ) ;
                       if ( _min == 0 || _dist <= _min )
                       {
                           _min = _dist, _selected_key = _k ;
                       }
                  }

                  return _selected_key ;
             }
             else return "" ;
        }
        else return ( _latex_palette[_rgb.toLowerCase()] != null ? _rgb.toLowerCase() : "" ) ;
    }
}

function laTeXpic( _w, _h, _offset_x, _offset_y, _full_document, _landscape, _usecustomfonts, _comment )
{
    this.width = safe_int( _w, 0 ), this.height = safe_int( _h, 0 ) ;
    this.offset_x = safe_int( _offset_x, _latex_options['offset_x'] ) ;
    this.offset_y = safe_int( _offset_y, _latex_options['offset_y'] ) ;
    this.usecustomfonts = safe_int( _usecustomfonts, _latex_options['usecustomfonts'] ) ;
    this.code = [] ;
    this.crlf = is_win ? "\r\n" : "\n" ;
    this.closed = 0 ;
    this.landscape = safe_int( _landscape, 0 ) ;
    if ( arguments.length > 0 ) this.init( _w, _h, _offset_x, _offset_y, _full_document, _comment ) ;
    this.fontfamily = "" ;
    this.fontsize = "" ;
    this.round_digits = 4 ;
}

laTeXpic.prototype.init = function( _w, _h, _options, _full_document, _landscape, _usecustomfonts, _comment )
{
    _options['paperheight'] = safe_string( _options['paperheight'], _latex_options['paperheight'] ) ;
    _options['paperwidth'] = safe_string( _options['paperwidth'], _latex_options['paperwidth'] ) ;
    _options['margin'] = safe_string( _options['margin'], _latex_options['margin'] ) ;
    _options['heightrounded'] = safe_int( _options['heightrounded'], _latex_options['heightrounded'] ) ;
    _options['left'] = safe_string( _options['left'], _latex_options['left'] ) ;
    _options['right'] = safe_string( _options['right'], _latex_options['right'] ) ;
    _options['top'] = safe_string( _options['top'], _latex_options['top'] ) ;
    _options['bottom'] = safe_string( _options['bottom'], _latex_options['bottom'] ) ;
    _options['usecustomfonts'] = safe_int( _options['usecustomfonts'], _latex_options['usecustomfonts'] ) ;

    this.fulldoc = safe_int( _full_document, 0 ) ;
    if ( this.fulldoc != 0 && this.fulldoc != 1 ) this.fulldoc = 0 ;

    this.width = safe_int( _w, 0 ), this.height = safe_int( _h, 0 ) ;
    this.offset_x = safe_int( _options['offset_x'], _latex_options['offset_x'] );
    this.offset_y = safe_int( _options['offset_y'], _latex_options['offset_y'] ) ;
    this.usecustomfonts = safe_int( _options['usecustomfonts'], _latex_options['usecustomfonts'] ) ;
    this.code = [] ;
    this.crlf = is_win ? "\r\n" : "\n" ;
    this.closed = 0 ;
    this.landscape = safe_int( _landscape, 0 ) ;

    _comment = safe_string( _comment, "" ).trim() ;
    
    this.preamble = [], this.packages = [] ;

    if ( this.fulldoc )
    {
    		// build preamble
        this.preamble.push( "\\documentclass[11pt,"+( this.landscape ? "landscape" : "a4paper" )+"]{article}" );
			  if ( _comment.length > 0 ) this.preamble.push( this.comment( _comment, 1 ) );
        this.preamble.push( "\\parindent0em" );

        this.packages.push( "\\usepackage[utf8]{inputenc}" );
        if ( this.usecustomfonts )
        this.packages.push( "\\usepackage{anyfontsize}" );
        this.packages.push( "\\usepackage{graphicx}" );
        this.packages.push( "\\usepackage{xcolor}" );
        this.packages.push( "\\usepackage[T1]{fontenc}" );
        this.packages.push( "\\usepackage[paperheight="+_options['paperheight']+",paperwidth="+_options['paperwidth']+",margin="+_options['margin']+","+(_options['heightrounded']?'heightrounded':'')+",left="+_options['left']+",right="+_options['right']+",top="+_options['top']+",bottom="+_options['bottom']+"]{geometry}" );
    }

    this.code.push( "\\unitlength=1bp" );
    this.code.push( "\\begin{picture}( "+_w+", "+_h+" )( "+this.offset_x+", "+this.offset_y+" )" ) ;
}

laTeXpic.prototype.default_settings = function() { this.init( 640, 480, _latex_options, 1, 0, "" ); }

laTeXpic.prototype.use_package = function()
{
		for( var _i = 0 ; _i < arguments.length ; _i++ )
		this.packages.push( "\\usepackage{"+arguments[_i]+"}" );
}

laTeXpic.prototype.comment = function( _comment_text, _return )
{
		_return = safe_int( _return, 0 );
		var _out = _comment_text.split( this.crlf ) ;
		for( var _o = 0 ; _o < _out.length ; _o++ ) _out[_o] = "%" + _out[_o] ;

		if ( _return ) return _out.join( this.crlf ) ;
		else this.code.push( _out ) ;
}

laTeXpic.prototype.text = function( _pos_x, _pos_y, _text, _textcolor, _fontfamily, _fontsize, _fontshape )
{
    _textcolor = safe_string( _textcolor, "" ).trim();
    _fontfamily = safe_string( _fontfamily, "Bookman" ).trim();
    _fontshape = safe_string( _fontshape, "normal" ).trim().toLowerCase() ;
    _fontsize = safe_int( _fontsize, 7 );
    switch( _fontshape )
    {
					case "bold": _fontshape = "\\bfseries" ; break ;
					case "italic": _fontshape = "\\em" ; break ;
					case "lowercase": _fontshape = "\\lowercase" ; break ;
					case "teletype": _fontshape = "\\ttfamily" ; break ;
					case "uppercase": _fontshape = "\\uppercase" ; break ;
					default: _fontshape = "\\normalfont" ; break ;
		}
    
    if ( this.usecustomfonts )
    {
        var _changed = 0, _font_cmd = [] ;
        if ( !_fontfamily.toLowerCase().strcmp( this.fontfamily.toLowerCase() ) )
        {
            _font_cmd.push( "\\fontfamily{"+_fontfamily+"}" ) ;
            this.fontfamily = _fontfamily ;
            _changed = 1 ;
        }
    
        if ( _fontsize != this.fontsize )
        {
            _font_cmd.push( "\\fontsize{"+_fontsize+"}" ) ;
            this.fontsize = _fontsize ;
            _changed = 1 ;
        }
    
        if ( _changed )
        {
            _font_cmd.push( "\\selectfont" ) ;
            this.code.push( _font_cmd.join( "" ) ) ;
        }
    }
		
    this.code.push( "\\put("+_pos_x.roundTo(this.round_digits)+","+_pos_y.roundTo(this.round_digits)+"){"+( _textcolor.length > 0 ? "\\color{"+_textcolor+"}" : "" )+"\\makebox{"+_fontshape+" "+_text+"}}" );
}

laTeXpic.prototype.set_round_digits = function( _round_digits ) { this.round_digits = safe_int( _round_digits, 4 ); }
laTeXpic.prototype.get_round_digits = function() 								{ return this.round_digits ; }
laTeXpic.prototype.set_unitlength = function( _units, _metric ) { this.code.push( "\\setlength{\\unitlength}{"+_units+","+_metric+"}" ); }

laTeXpic.prototype.circle = function( _center_x, _center_y, _radius, _fill, _fillcolor )
{
    _fillcolor = safe_string( _fillcolor, "" ).trim() ;
    _fillcolor = get_closest_color_tag( _fillcolor ) ;

		_center_x = safe_int( _center_x, 0 );
		_center_y = safe_int( _center_y, 0 );
		_radius = safe_int( _radius, 0 );
		_fill = safe_int( _fill, 0 );
		_fillcolor = safe_string( _fillcolor, "" ).trim() ;
		this.code.push( "\\put("+_center_x.roundTo(this.round_digits)+","+_center_y.roundTo(this.round_digits)+"){"+( _fill ? "\\color{"+_fillcolor+"}" : "" )+"\\circle"+( _fill ? "*" : "" )+"{"+( _radius*2 ).roundTo(this.round_digits)+"}}" );		
}

laTeXpic.prototype.oval = function( _center_x, _center_y, _w, _h, _color )
{
    _color = safe_string( _color, "" ).trim() ;
    _color = get_closest_color_tag( _color ) ;
		_center_x = safe_int( _center_x, 0 );
		_center_y = safe_int( _center_y, 0 );
		this.code.push( "\\put("+_center_x.roundTo(this.round_digits)+","+_center_y.roundTo(this.round_digits)+"){"+( _color.length > 0 ? "\\color{"+_color+"}" : "" )+"\\oval( "+_w.roundTo(this.round_digits)+", "+_h.roundTo(this.round_digits)+" )}" );
}

laTeXpic.prototype.rounded_rect = function( _center_x, _center_y, _w, _h, _color )
{
    // this is an alias function
    this.oval( _center_x, _center_y, _w, _h, _color ) ;
}

laTeXpic.prototype.line = function( _from_x, _from_y, _to_x, _to_y, _color )
{
    _color = safe_string( _color, "" ).trim() ;
    _color = get_closest_color_tag( _color ) ;
		var _line_slope_x = ( _to_x > _from_x ) ? 1 : ( _to_x == _from_x ? 0 : -1 ) ;
		var _line_slope_y = ( _to_y > _from_y ) ? 1 : ( _to_y == _from_y ? 0 : -1 ) ;
		
		var _n_objects = Math.ceil( Math.sqrt( Math.pow( this.width, 2.0 ) + Math.pow( this.height, 2.0 ) ) ) ;
		var _x_length = _to_x - _from_x, _dx = _x_length / _n_objects ;
		var _y_length = _to_y - _from_y, _dy = _y_length / _n_objects ;
    var _slope_cmd = "" ;
    if ( _dx != 0 && _dy != 0 )
    {
        var _diff = _line_slope_x ? _dx : _dy ;
        if ( _dx > 0 && _dy > 0 ) _slope_cmd = "0,1" ;
        else if ( _dx > 0 && _dy < 0 ) _slope_cmd = "1,0" ;
        else if ( _dx < 0 && _dy > 0 ) _slope_cmd = "-1,0" ;
        else if ( _dx < 0 && _dy < 0 ) _slope_cmd = "-1,0" ;

    		this.code.push( "\\multiput("+_from_x.roundTo(this.round_digits)+","+_from_y.roundTo(this.round_digits)+")("+_dx.roundTo(this.round_digits)+","+_dy.roundTo(this.round_digits)+"){"+_n_objects+"}{"+( _color ? "\\color{"+_color+"}" : "" )+"\\line("+_slope_cmd+"){"+Math.abs(_diff).roundTo(this.round_digits)+"}}" );
    }
    else
    {
        if ( _dx == 0 ) _slope_cmd = "0,"+( _dy < 0 ? "-" : "" )+"1" ;
        else if ( _dy == 0 ) _slope_cmd = ( _dx < 0 ? "-" : "" )+"1,0" ;

    		this.code.push( "\\put("+_from_x.roundTo(this.round_digits)+","+_from_y.roundTo(this.round_digits)+"){"+( _color ? "\\color{"+_color+"}" : "" )+"\\line("+_slope_cmd+"){"+( _dx == 0 ? _y_length.roundTo(this.round_digits) : _x_length.roundTo(this.round_digits) )+"}}" );
    }
}

laTeXpic.prototype.broken_line = function( _pts, _color, _close )
{
    if ( is_array( _pts ) )
    {
        _color = get_closest_color_tag( _color ) ;
        _close = safe_int( _close, 0 );
        for( var _i = 1 ; _i < _pts.length ; _i++ )
        this.line( _pts[_i-1].x, _pts[_i-1].y, _pts[_i].x, _pts[_i].y, _color ) ;

        if ( _close ) this.line( _pts[_i-1].x, _pts[_i-1].y, _pts[0].x, _pts[0].y, _color ) ;
    }
}

laTeXpic.prototype.rect = function( _left, _top, _right, _bottom, _fillcolor, _opacity, _comment )
{
		if ( _left > _right )
		{
				 var _ret = swap( _left, _right ) ;
				 _left = _ret[0], _right = _ret[1] ;
		}
		
		if ( _bottom > _top )
		{
				 var _ret = swap( _top, _bottom ) ;
				 _top = _ret[0], _bottom = _ret[1] ;
		}
		
		_fillcolor = safe_string( _fillcolor, "" ).trim() ;
    _fillcolor = get_closest_color_tag( _fillcolor ) ;
		var _x_side = ( _right - _left ).roundTo(this.round_digits), _y_side = ( _top - _bottom ).roundTo(this.round_digits) ;
		_opacity = safe_int( _opacity, 100 );			

		_comment = safe_string( _comment, "" ).trim() ;
		if ( _comment.length > 0 ) this.comment( _comment );
		var _cmd = "\\put("+_left+","+_top+"){%startcolorbox%%framebox%%endcolorbox%}" ;
				_cmd = _cmd.replace( "%startcolorbox%", ( _fillcolor.length > 0 ) ? "\\color{"+_fillcolor+"!"+_opacity+"}" : "" );
				_cmd = _cmd.replace( "%framebox%", "\\rule{"+_x_side.roundTo(this.round_digits)+"\\unitlength}{"+_y_side.roundTo(this.round_digits)+"\\unitlength}" );
				_cmd = _cmd.replace( "%endcolorbox%", ( _fillcolor.length > 0 ) ? "" : "" );

		this.code.push( _cmd );
}

laTeXpic.prototype.point = function( _x, _y, _pt_size, _fill, _fillcolor )
{
		_fillcolor = safe_string( _fillcolor, "" ).trim() ;
    _fillcolor = get_closest_color_tag( _fillcolor ) ;
    _pt_size = safe_int( _pt_size, 1 );
    _fill = safe_int( _fill, 1 );
    this.code.push( "\\put("+_x.roundTo(this.round_digits)+","+_y.roundTo(this.round_digits)+"){"+( _fillcolor.length > 0 ? "\\color{"+_fillcolor+"}" : "" )+"\\circle"+( _fill ? "*" : "" )+"{"+_pt_size.roundTo(this.round_digits)+"} }" ) ;
}

laTeXpic.prototype.pixel = function( _x, _y, _fillcolor, _opacity, _comment )
{
    var _left = _x, _top = _y, _right = _left + 0.7, _bottom = _y + 0.7 ;
    this.rect( _left, _top, _right, _bottom, _fillcolor, _opacity, _comment ) ;
}

laTeXpic.prototype.close = function()
{
    this.code.push( "\\end{picture}" ) ;

    if ( this.fulldoc )
    {
        this.code.push( "\\end{document}" );
    }
    
    this.closed = 1 ;
}

laTeXpic.prototype.get_codelist = function()
{
		if ( !this.closed ) this.close() ;
		var _out_array = [] ;
		_out_array = _out_array.concat( this.preamble ) ;
		_out_array = _out_array.concat( this.packages ) ;
		
		_out_array.push( "\\begin{document}" );
		_out_array = _out_array.concat( this.code ) ;
		return _out_array.join( this.crlf ) ;
} ;