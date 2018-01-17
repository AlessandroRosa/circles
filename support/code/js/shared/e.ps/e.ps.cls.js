////////// JS EPS GLOBAL VARS /////////////
var JSEPS_CRLF_WIN = "\r\n", JSEPS_CRLF_NO_WIN = "\n" ;
var JSEPS_VER = 0.1 ;
var JSEPS_NO_CAPS = -1, JSEPS_BUTT_CAPS = 0, JSEPS_ROUND_CAPS = 1, JSEPS_EXT_BUTT_CAPS = 2 ;
var _jseps_fonts = [ "Courier", "Courier-Bold", "Courier-Oblique", "Courier-BoldOblique",
                     "Helvetica", "Helvetica-Bold", "Helvetica-Narrow",
                     "Times-Bold", "Times-Italic", "Times-BoldItalic",
                     "Times-Roman" ] ;
var _jseps_palette = [] ;
    _jseps_palette['black'] = "#000000" ;
    _jseps_palette['blue'] = "#0000FF" ;
    _jseps_palette['cyan'] = "#00FFFF" ;
    _jseps_palette['gray'] = "#D0D0D0" ;
    _jseps_palette['green'] = "#00FF00" ;
    _jseps_palette['magenta'] = "#FF00FF" ;
    _jseps_palette['red'] = "#FF0000" ;
    _jseps_palette['white'] = "#FFFFFF" ;
    _jseps_palette['yellow'] = "#FFFF00" ;

// AUXILIARY FUNCTIONS
if ( typeof is_array != "function" ) function is_array( _a ) { return _a instanceof Array ? 1 : 0 ; }
if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ) ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof get_rgb_dec_triplet != "function" )
{
    function get_rgb_dec_triplet( _rgbhex )
    {
         _rgbhex = safe_string( _rgbhex, "" );
         if ( _rgbhex[0] == "#" )
         {
             _rgbhex = _rgbhex.replace( "#", "" ).trim() ;
              var _r = parseInt( _rgbhex.substr( 0, 2 ), 16 ) ;
              var _g = parseInt( _rgbhex.substr( 2, 2 ), 16 ) ;
              var _b = parseInt( _rgbhex.substr( 4, 2 ), 16 ) ;
              return [ _r, _g, _b ] ;
         }
         else if ( _rgbhex.toLowerCase().indexOf( "rgb" ) != -1 )
              return _rgbhex.replace( "rgb", "" ).replace( "(", "" ).replace( ")", "" ).trim().split( "," ) ;
         else return "" ;
    }
}

// JS EPS CLASS
function jseps( _language_level, _encapsulated = 1, _author, _bb_bottom, _bb_left, _bb_right, _bb_top, _desc, _flip_y )
{
    this.eps_code = [];
}

jseps.prototype.init = function( _language_level = 2, _encapsulated = 1, _author = "", _bb_bottom = 0, _bb_left = 0, _bb_right = 0, _bb_top = 0, _desc, _flip_y )
{
    _author = safe_string( _author, "" ) ;
    this.language_level = safe_int( _language_level, 2 );
    if ( this.language_level < 1 && this.language_level > 3 ) this.language_level = 2 ;
    this.eps_code = [];
    this.crlf = ( this.is_win() ) ? JSEPS_CRLF_WIN : JSEPS_CRLF_NO_WIN ;
    this.encapsulated = safe_int( _encapsulated, 0 ) ;
    this.flip_y = safe_int( _flip_y, 0 ) ;
    
    this.bb_bottom = safe_int( _bb_bottom, 0 );
    this.bb_left = safe_int( _bb_left, 0 );
    this.bb_right = safe_int( _bb_right, 0 );
    this.bb_top = safe_int( _bb_top, 0 );
    this.bb_width = Math.abs( this.bb_right - this.bb_left );
    this.bb_height = Math.abs( this.bb_top - this.bb_bottom );
    this.write_header( _author, this.bb_bottom, this.bb_left, this.bb_right, this.bb_top, _desc );
}

jseps.prototype.get_codelist_ref = function() { return this.eps_code ; }
jseps.prototype.get_codelist = function() { return this.eps_code.slice(0) ; }
jseps.prototype.close = function() { this.comment( "%%end of file" ); }
jseps.prototype.reset = function( _desc )
{
    _desc = safe_string( _desc, "" ).trim() ;
    this.eps_code.flush() ;
    this.write_header( _author, this.bb_bottom, this.bb_left, this.bb_right, this.bb_top, _desc );
}

jseps.prototype.set_rgb_color = function( _r, _g, _b )
{
    _r = safe_int( _r, 0 ), _g = safe_int( _g, 0 ), _b = safe_int( _b, 0 );
    _r /= 255.0, _g /= 255.0, _b /= 255.0 ;
    this.eps_code.push( _r.toFixed(2) + " " + _g.toFixed(2) + " " + _b.toFixed(2) + " setrgbcolor" );
}

jseps.prototype.export_eps = function( _crlf = JSEPS_CRLF_NO_WIN )
{
    // insert cmd at the beginning of the code
    if ( !this.encapsulated && this.eps_code.indexOf( "showpage" ) == -1 && this.eps_code.length > 0 )
    this.eps_code = new Array( "showpage" ).concat( this.eps_code ) ;

    _crlf = ( _crlf != null ) ? _crlf : this.crlf ;
    return is_array( this.eps_code ) ? this.eps_code.join( _crlf ) : [] ;
}

jseps.prototype.get_os = function()
{
    var _os = navigator.appVersion.toLowerCase();
    if ( _os.indexOf("win") != -1 || _os.indexOf("windows") != -1 ) return "windows" ;
    else if ( _os.indexOf("mac") != -1 ) return "macos";
    else if ( _os.indexOf("x11") != -1 ) return "unix";
    else if ( _os.indexOf("linux") != -1 ) return "linux";
}

jseps.prototype.is_win = function() { return ( this.get_os() == "windows" ) ? 1 : 0 ; }
jseps.prototype.is_mac = function() { return ( this.get_os() == "macos" ) ? 1 : 0 ; }
jseps.prototype.is_unix = function() { return ( this.get_os() == "unix" ) ? 1 : 0 ; }
jseps.prototype.is_linux = function() { return ( this.get_os() == "linux" ) ? 1 : 0 ; }

jseps.prototype.write_header = function( _author = "", _bb_bottom = 0, _bb_left = 0, _bb_right = 0, _bb_top = 0, _desc = "" )
{
    if ( this.encapsulated )
    {
		_desc = safe_string( _desc, "" ).trim() ;
        this.eps_code.push( "%!PS-Adobe-3.0 EPSF-3.0" );
        this.comment( "Creator: code generated by js eps class ver " + JSEPS_VER );
        if ( _author.length > 0 ) this.comment( "Author: " + _author );
        this.comment( "CreationDate: " + ( new Date() ) );
        this.comment( "LanguageLevel: " + this.language_level );
        this.comment( "DocumentData: Clean7Bit" );
        if ( _desc.length > 0 ) this.comment( _desc );

        var _bb_array = new Array();
        if ( _bb_bottom >= 0 ) _bb_array.push( _bb_bottom );
        if ( _bb_left >= 0 ) _bb_array.push( _bb_left );
        if ( _bb_right >= 0 ) _bb_array.push( _bb_right );
        if ( _bb_top >= 0 ) _bb_array.push( _bb_top );

        this.comment( "BoundingBox: " + ( ( _bb_array.length == 4 ) ? _bb_array.join( " " ) : "0 0 0 0" ) );
    }
    else this.eps_code.push( "%!PS" );
}

jseps.prototype.comment = function( _text )
{
    _text = safe_string( _text, "" );
    var _lines = null ;
    var _separator = "" ;
    if ( _text.toLowerCase().indexOf( "<br>" ) != -1 ) _separator = "<br>" ;
    else if ( _text.toLowerCase().indexOf( "<br/>" ) != -1 ) _separator = "<br/>" ;
    else if ( _text.indexOf( JSEPS_CRLF_WIN ) != -1 ) _separator = JSEPS_CRLF_WIN ;
    else if ( _text.indexOf( JSEPS_CRLF_NO_WIN ) != -1 ) _separator = JSEPS_CRLF_NO_WIN ;

    _lines = ( _separator.length > 0 ) ? _text.split( _separator ) : [ _text ] ;
    if ( _lines != null )
    {
        for( var _i = 0 ; _i < _lines.length ; _i++ )
        this.eps_code.push( "%%" + _lines[_i] );
    }
}

jseps.prototype.rounded_rect = function( _start_x, _start_y, _width, _height, _corner_radius, _bordersize, _bordercolor, _fillcolor, _comment )
{
    if ( this.encapsulated )
    {
        _comment = safe_string( _comment, "" ) ;
        _bordercolor = safe_string( _bordercolor, "" ) ;
        _bordersize = safe_int( _bordersize, 0 );
        _corner_radius = safe_int( _corner_radius, 1 );
        if ( this.flip_y ) _start_y = this.bb_height - _start_y ;
        var _reduced_width = _width - 2 * _corner_radius ;
        var _reduced_height = _height - 2 * _corner_radius ;

        if ( _comment.length > 0 ) this.comment( _comment );
        this.eps_code.push( "newpath" );
        var _pt_1_left_bottom_x, _pt_1_left_bottom_y, _pt_2_left_bottom_x, _pt_2_left_bottom_y ;
        var _pt_1_left_top_x, _pt_1_left_top_y, _pt_2_left_top_x, _pt_2_left_top_y ;
        var _pt_1_right_top_x, _pt_1_right_top_y, _pt_2_right_top_x, _pt_2_right_top_y ;
        var _pt_1_right_bottom_x, _pt_1_right_bottom_y, _pt_2_right_bottom_x, _pt_2_right_bottom_y ;
        
        this.eps_code.push( "/r "+_corner_radius+" def" );
        this.eps_code.push( "/x "+_start_x+" def" );
        this.eps_code.push( "/y "+_start_y+" def" );
        this.eps_code.push( "/w "+_width+" def" );
        this.eps_code.push( "/h "+_height+" def" );

        this.eps_code.push( "newpath" );
        this.eps_code.push( "x r add y moveto" );
        this.eps_code.push( "x w add r sub y lineto" );
        this.eps_code.push( "r 0 gt { x w add y x w add y r add r arct } if" );
        this.eps_code.push( "x w add y h add r sub lineto" );
        this.eps_code.push( "r 0 gt { x w add y h add x r sub y h add r arct } if" );
        this.eps_code.push( "x r add y h add lineto" );
        this.eps_code.push( "r 0 gt { x y h add x r y h add sub r arct } if" );
        this.eps_code.push( "x y r add lineto" );
        this.eps_code.push( "r 0 gt { x y x r add y r arct } if" );
        this.eps_code.push( "closepath" );

        if ( _bordercolor.length > 0 )
        {
            if ( _bordercolor[0] != "#" && _jseps_palette[ "" + _bordercolor ] != null )
            _bordercolor = _jseps_palette[ "" + _bordercolor ] ;

            if ( _fillcolor.length > 0 ) this.eps_code.push( "gsave" );
            if ( _bordersize > 0 ) this.eps_code.push( _bordersize + " setlinewidth" );
            var _rgb_triplet = get_rgb_dec_triplet( _bordercolor ) ;
            this.set_rgb_color( _rgb_triplet[0], _rgb_triplet[1], _rgb_triplet[2] ) ;
            this.eps_code.push( "stroke" );
        }
    
        if ( _fillcolor.length > 0 )
        {
            if ( _fillcolor[0] != "#" && _jseps_palette[ "" + _fillcolor ] != null ) _fillcolor = _jseps_palette[ "" + _fillcolor ] ;
            if ( _bordercolor.length > 0 ) this.eps_code.push( "grestore" );
            var _rgb_triplet = get_rgb_dec_triplet( _fillcolor ) ;
            this.set_rgb_color( _rgb_triplet[0], _rgb_triplet[1], _rgb_triplet[2] ) ;
            this.eps_code.push( "fill" );
        }
    }
    else this.comment( "rounded rects are available for encapsulated formats exclusively" );
}

jseps.prototype.rect = function( _start_x, _start_y, _width, _height, _bordersize, _bordercolor, _fillcolor, _comment )
{
    _comment = safe_string( _comment, "" ) ;
    _bordercolor = safe_string( _bordercolor, "" ) ;
    _bordersize = safe_int( _bordersize, 0 );
    if ( this.flip_y ) _start_y = this.bb_height - _start_y ;
    if ( _comment.length > 0 ) this.comment( _comment );
    this.eps_code.push( "newpath" );
    this.eps_code.push( _start_x + " " + _start_y + " moveto" );
    this.eps_code.push( ( _start_x + _width ) + " " + _start_y + " lineto" );
    this.eps_code.push( ( _start_x + _width ) + " " + ( _start_y + _height ) + " lineto" );
    this.eps_code.push( ( _start_x ) + " " + ( _start_y + _height ) + " lineto" );
    this.eps_code.push( "closepath" );

    if ( _bordercolor.length > 0 )
    {
        if ( _bordercolor[0] != "#" && _jseps_palette[ "" + _bordercolor ] != null )
        _bordercolor = _jseps_palette[ "" + _bordercolor ] ;

        if ( _fillcolor.length > 0 ) this.eps_code.push( "gsave" );
        if ( _bordersize > 0 ) this.eps_code.push( _bordersize + " setlinewidth" );
        var _rgb_triplet = get_rgb_dec_triplet( _bordercolor ) ;
        this.set_rgb_color( _rgb_triplet[0], _rgb_triplet[1], _rgb_triplet[2] ) ;
        this.eps_code.push( "stroke" );
    }

    if ( _fillcolor.length > 0 )
    {
        if ( _fillcolor[0] != "#" && _jseps_palette[ "" + _fillcolor ] != null ) _fillcolor = _jseps_palette[ "" + _fillcolor ] ;
        if ( _bordercolor.length > 0 ) this.eps_code.push( "grestore" );
        var _rgb_triplet = get_rgb_dec_triplet( _fillcolor ) ;
        this.set_rgb_color( _rgb_triplet[0], _rgb_triplet[1], _rgb_triplet[2] ) ;
        this.eps_code.push( "fill" );
    }
}

jseps.prototype.point = function( _x, _y, _bordersize, _bordercolor, _fillcolor, _comment )
{
    if ( this.flip_y ) _y = this.bb_height - _y ;
    this.circle( _x, _y, 3, _bordersize, _bordercolor, _fillcolor, _comment ) ;
}

jseps.prototype.pixel = function( _x, _y, _bordercolor, _comment )
{
    if ( this.flip_y ) _y = this.bb_height - _y ;
    this.rect( _x, _y, 0.3, 0.3, 1, _bordercolor, "", _comment ) ;
}

jseps.prototype.line = function( _from_x, _from_y, _to_x, _to_y, _bordersize, _bordercolor, _dash_values, _caps_style, _comment )
{
    _comment = safe_string( _comment, "" ) ;
    _bordersize = safe_int( _bordersize, 0 );
    _caps_style = safe_int( _caps_style, -1 );
    _dash_values = safe_string( _dash_values, "" ) ;
    if ( this.flip_y ) _from_y = this.bb_height - _from_y ;
    if ( this.flip_y ) _to_y = this.bb_height - _to_y ;
    if ( _comment.length > 0 ) this.comment( _comment );
    if ( _caps_style != -1 && _caps_style >= 0 && _caps_style <= 2 ) this.eps_code.push( _caps_style + " setlinecap" );
    if ( _dash_values.length > 0 ) this.eps_code.push( _dash_values + " 0 setdash" );
    this.eps_code.push( "newpath" );
    if ( _bordersize > 0 ) this.eps_code.push( _bordersize + " setlinewidth" );
    this.eps_code.push( _from_x + " " + _from_y + " moveto" );
    this.eps_code.push( _to_x + " " + _to_y + " lineto" );
    this.eps_code.push( "closepath" );
    if ( _bordercolor.length > 0 )
    {
        if ( _bordercolor[0] != "#" && _jseps_palette[ "" + _bordercolor ] != null )
        _bordercolor = _jseps_palette[ "" + _bordercolor ] ;

        var _rgb_triplet = get_rgb_dec_triplet( _bordercolor ) ;
        this.set_rgb_color( _rgb_triplet[0], _rgb_triplet[1], _rgb_triplet[2] ) ;
    }
    this.eps_code.push( "stroke" );
}

jseps.prototype.broken_line = function( _pts_array, _bordersize, _close, _bordercolor, _fillcolor, _dash_values, _comment )
{
    if ( is_array( _pts_array ) )
    {
        if ( _pts_array.length > 0 )
        {
            _dash_values = safe_string( _dash_values, "" ) ;
            _comment = safe_string( _comment, "" ) ;
            _close = safe_int( _close, 0 );
            _bordersize = safe_int( _bordersize, 0 );
            if ( _comment.length > 0 ) this.comment( _comment );
            if ( _bordersize > 0 ) this.eps_code.push( _bordersize + " setlinewidth" );
            if ( _dash_values.length > 0 ) this.eps_code.push( _dash_values + " 0 setdash" );
            this.eps_code.push( "newpath" );
            for( var _i = 0 ; _i < _pts_array.length ; _i++ )
            {
                 if ( this.flip_y ) _pts_array[_i][1] = this.bb_height - _pts_array[_i][1] ;
                 if ( _i == 0 )
                 this.eps_code.push( _pts_array[_i][0] + " " + _pts_array[_i][1] + " moveto" );
                 else
                 this.eps_code.push( _pts_array[_i][0] + " " + _pts_array[_i][1] + " lineto" );
            }

            if ( _close ) this.eps_code.push( "closepath" );

            if ( _bordercolor.length > 0 )
            {
                 if ( _bordercolor[0] != "#" && _jseps_palette[ "" + _bordercolor ] != null )
                 _bordercolor = _jseps_palette[ "" + _bordercolor ] ;
                 if ( _fillcolor.length > 0 ) this.eps_code.push( "gsave" );
                 var _rgb_triplet = get_rgb_dec_triplet( _bordercolor ) ;
                 this.set_rgb_color( _rgb_triplet[0], _rgb_triplet[1], _rgb_triplet[2] ) ;
                 this.eps_code.push( "stroke" );
            }

            if ( _fillcolor.length > 0 )
            {
                if ( _fillcolor[0] != "#" && _jseps_palette[ "" + _fillcolor ] != null ) _fillcolor = _jseps_palette[ "" + _fillcolor ] ;
                if ( _bordercolor.length > 0 ) this.eps_code.push( "grestore" );
                var _rgb_triplet = get_rgb_dec_triplet( _fillcolor ) ;
                this.set_rgb_color( _rgb_triplet[0], _rgb_triplet[1], _rgb_triplet[2] ) ;
                this.eps_code.push( "fill" );
            }
         }
    }
}

jseps.prototype.arc = function( _center_x, _center_y, _radius, _start_degree, _end_degree, _bordersize, _bordercolor, _dash_values, _comment )
{
    _dash_values = safe_string( _dash_values, "" ) ;
    _comment = safe_string( _comment, "" ) ;
    _bordercolor = safe_string( _bordercolor, "" ) ;
    _bordersize = safe_int( _bordersize, 0 );
    if ( this.flip_y ) _center_y = this.bb_height - _center_y ;
    if ( _comment.length > 0 ) this.comment( _comment );
    if ( _dash_values.length > 0 ) this.eps_code.push( _dash_values + " 0 setdash" );
    this.eps_code.push( "newpath" );
    this.eps_code.push( _center_x + " " + _center_y + " moveto" );
    this.eps_code.push( _center_x + " " + _center_y + " " + _radius + " " + _start_degree + " " + _end_degree + " arc" );
    this.eps_code.push( "closepath" );
    if ( _bordercolor.length > 0 )
    {
        if ( _bordercolor[0] != "#" && _jseps_palette[ "" + _bordercolor ] != null ) _bordercolor = _jseps_palette[ "" + _bordercolor ] ;
        var _rgb_triplet = get_rgb_dec_triplet( _bordercolor ) ;
        this.set_rgb_color( _rgb_triplet[0], _rgb_triplet[1], _rgb_triplet[2] ) ;

        if ( _bordersize > 0 ) this.eps_code.push( _bordersize + " setlinewidth" );
        this.eps_code.push( "stroke" );
    }
}

jseps.prototype.circle = function( _center_x, _center_y, _radius, _bordersize, _bordercolor, _fillcolor, _dash_values, _comment )
{
    _dash_values = safe_string( _dash_values, "" ) ;
    _comment = safe_string( _comment, "" ) ;
    _bordercolor = safe_string( _bordercolor, "" ) ;
    _fillcolor = safe_string( _fillcolor, "" ) ;
    _bordersize = safe_int( _bordersize, 0 );
    if ( this.flip_y ) _center_y = this.bb_height - _center_y ;
    if ( _comment.length > 0 ) this.comment( _comment );
    if ( _dash_values.length > 0 ) this.eps_code.push( _dash_values + " 0 setdash" );
    this.eps_code.push( "newpath" );
    this.eps_code.push( _center_x + " " + _center_y + " " + _radius + " 0 360 arc" );
    this.eps_code.push( "closepath" );
	console.log( "EPS CIRCLE", _bordercolor, _fillcolor );
    if ( _bordercolor.length > 0 )
    {
        if ( _bordercolor[0] != "#" && _jseps_palette[ "" + _bordercolor ] != null ) _bordercolor = _jseps_palette[ "" + _bordercolor ] ;

        if ( _fillcolor.length > 0 ) this.eps_code.push( "gsave" );
        if ( _bordersize > 0 ) this.eps_code.push( _bordersize + " setlinewidth" );
        var _rgb_triplet = get_rgb_dec_triplet( _bordercolor ) ;
        this.set_rgb_color( _rgb_triplet[0], _rgb_triplet[1], _rgb_triplet[2] ) ;
        this.eps_code.push( "stroke" );
    }

    if ( _fillcolor.length > 0 )
    {
        if ( _fillcolor[0] != "#" && _jseps_palette[ "" + _fillcolor ] != null ) _fillcolor = _jseps_palette[ "" + _fillcolor ] ;
        if ( _bordercolor.length > 0 ) this.eps_code.push( "grestore" );
        var _rgb_triplet = get_rgb_dec_triplet( _fillcolor ) ;
        this.set_rgb_color( _rgb_triplet[0], _rgb_triplet[1], _rgb_triplet[2] ) ;
        this.eps_code.push( "fill" );
    }
}

jseps.prototype.text = function( _fontfamily, _fontsize, _fontcolor, _x, _y, _text, _comment )
{
    _comment = safe_string( _comment, "" ) ;
    _fontfamily = safe_string( _fontfamily, "" ) ;
    if ( _fontfamily.length == 0 || _jseps_fonts.indexOf( _fontfamily ) == -1 ) _fontfamily = _jseps_fonts[0] ;
    _fontcolor = safe_string( _fontcolor, "" ) ;
    if ( _fontcolor.length > 0 )
    {
         if ( _fontcolor.length > 0 && _fontcolor[0] != "#" )
         {
             _fontcolor = _jseps_palette[ "" + _fontcolor ] ;
             if ( _fontcolor == null ) _fontcolor = "#000000" ;
         }
         var _rgb_triplet = get_rgb_dec_triplet( _fontcolor ) ;
         this.set_rgb_color( _rgb_triplet[0], _rgb_triplet[1], _rgb_triplet[2] ) ;
    }
    _fontsize = safe_int( _fontsize, 12 );
    _x = safe_int( _x, 0 ), _y = safe_int( _y, 0 );
    if ( this.flip_y ) _y = this.bb_height - _y ;
    
    if ( _comment.length > 0 ) this.comment( _comment );
    this.eps_code.push( "/" + _fontfamily + " findfont" );
    this.eps_code.push( _fontsize + " scalefont" );
    this.eps_code.push( "setfont" );
    this.eps_code.push( "newpath" );
    this.eps_code.push( _x + " " + _y + " moveto" );
    this.eps_code.push( "(" + _text + ") show" );
}