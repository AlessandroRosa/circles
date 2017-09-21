function circles_lib_colors_is_tag( _clr ) { return ( def_clrs_tags[ 'tag.' + _clr.toLowerCase() ] != null ) ? YES : NO ; }
function circles_lib_colors_get_def_from_tag( _clr ) { return def_clrs_tags[ 'tag.' + _clr.toLowerCase() ] ; }
function circles_lib_colors_is_def( _clr )
{
    _clr = safe_string( _clr, "" );
    return ( _clr.stricmp( "noclr" ) ||
             _clr.testME( _glob_rgbhex_regex_pattern, _glob_rgbdec_regex_pattern ) ||
             def_clrs_tags['tag.'+_clr.toLowerCase()] != null ) ? YES : NO ;
}

function circles_lib_colors_get_formats( _p_color )
{
    // return an array with rgb/hex color formats and tag
    _p_color = ( new String( _p_color ) ).toLowerCase().trim().replaceAll( " ", "" );
    if ( _p_color.length > 0 )
    {
       var _out_rgb_dec = "", _out_rgb_hex = "", _out_tag = "" ;
       var _final_array = [], _b_fail = 0, _b_tag_found = 0 ;
       var _is_tag = _p_color.testME( _glob_simple_string_regex_pattern );
       var _is_rgb_dec = _p_color.testME( _glob_rgbdec_regex_pattern, "^([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})$" ) ;
       var _is_rgb_hex = _p_color.testME( _glob_rgbhex_regex_pattern );
       if ( _is_rgb_dec ) // ex: rgb( 192, 201, 122 ) or 255,255,255
       {
            _out_rgb_dec = _p_color ;
            _out_rgb_hex = circles_lib_colors_rgb_dec_to_hex( _p_color );
            if ( _out_rgb_hex.length > 0 )
            {
                _is_rgb_hex = YES ;
                _p_color = _out_rgb_hex ; // we need the hex value to find out the related tag
            }
       }
       else if ( _is_rgb_hex )  // ex: #ABFF0D
       {
            _out_rgb_hex = _p_color ;
            _out_rgb_dec = circles_rgb_hex_to_dec( _p_color );
            if ( _out_rgb_dec.length > 0 ) _is_rgb_dec = YES ;
       }
          
       for( var _key in def_clrs_tags )
       {
          if ( _is_tag && _key.stricmp( "tag." + _p_color ) )
          {
             if ( !_key.start_with( "tag." ) ) _key = "tag." + _key ;
             _out_rgb_hex = def_clrs_tags[_key] ;
             _out_rgb_dec = circles_rgb_hex_to_dec( _out_rgb_hex );
             _out_tag = _key ;
             _b_tag_found = YES ;
             break ;
          }
          else if ( _is_rgb_hex )
          {
             if ( _key.start_with( "tag." ) )
             {
                if ( def_clrs_tags[ _key ].stricmp( _p_color ) )
                {
                   _out_rgb_hex = def_clrs_tags[_key] ;
                   _out_rgb_dec = circles_rgb_hex_to_dec( _out_rgb_hex );
                   _out_tag = _key.replaceAll( "tag.", "" );
                }
             }
          }
          else if ( _key.replaceAll( " ", "").stricmp( "rgba(0,0,0,0)" ) )
          {
             _out_tag = "transparent", _out_rgb_hex = "", _out_rgb_dec = "" ;
             _b_tag_found = YES ;
          }
        }
          
        if ( !_is_rgb_hex && _is_rgb_dec && !_is_tag ) _b_fail = YES ;
        if ( _b_fail ) _out_rgb_dec = _out_rgb_hex = _out_tag = "" ;
    }
    else _out_rgb_dec = _out_rgb_hex = _out_tag = "" ;
    return [ _b_fail ? RET_ERROR : RET_OK, _out_rgb_dec, _out_rgb_hex, _out_tag ];
}

function circles_lib_colors_rgb_dec_to_hex( rgb )
{
    var HEX = "", rgb = ( new String( rgb ) ).toLowerCase().trim().replaceAll( " ", "" );
    if ( rgb.testME( _glob_rgbdec_regex_pattern, "^([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})$" ) )
    {
       rgb = rgb.replaceAll( "rgb(", "" ).replaceAll( ")", "" ).replaceAll( " ", "" );
       var RGBarray = rgb.length > 0 ? ( rgb.includes( "," ) ? rgb.split( "," ) : [] ) : "" ;
       var RGBn = safe_size( RGBarray, 0 );
       if ( RGBn > 0 )
       {
          HEX = "#" ; var h ;
          for( var c = 0 ; c < RGBn ; c++ )
          {
             h = safe_int( RGBarray[c], 0 ).toString(16);
             HEX += h.length == 1 ? "0" + h : h ;
          }
       }
    }
    else if ( rgb.testME( _glob_rgbhex_regex_pattern ) ) HEX = rgb ;
    return HEX ;
}

function circles_rgb_hex_to_dec( hex )
{
    hex = ( new String( hex ) ).toLowerCase().trim();
    var RGB = "" ;
    if ( hex.testME( _glob_rgbhex_regex_pattern ) )
    {
       hex = hex.replaceAll( "#", "" );
       if ( hex.length == 6 )
       {
          RGB += "rgb(" ;
          RGB += parseInt( hex.substr( 0, 2 ), 16 );
          RGB += "," ;
          RGB += parseInt( hex.substr( 2, 2 ), 16 );
          RGB += "," ;
          RGB += parseInt( hex.substr( 4, 2 ), 16 );
          RGB += ") " ;
       }
       else RGB = "" ; 
    }
    else if ( hex.testME( _glob_rgbdec_regex_pattern ) ) RGB = hex ;
    return RGB ;
}

function circles_lib_colors_colorize( _items_array, _update, _silent, _out_channel )
{
    _update = safe_int( _update, NO );
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
		_items_array = circles_lib_items_set( _items_array ) ;
    if ( !_items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ) return [ RET_ERROR, "Invalid input items container" ] ;
    else if ( !_items_array.test( function( _obj ) { return _obj.symbol.length > 0 ? YES : NO ; } ) ) return [ RET_ERROR, "Missing symbols" ] ;
    else
    {
         var _color = "" ;
         $.each( _items_array, function( _i, _item )
                 {
                     _color = circles_lib_alphabet_get_color_from_symbol( _item.symbol ) ;
                     if ( _item.complex_circle.draw ) _items_array[_i].complex_circle.drawcolor = _color ;
                     if ( _item.screen_circle.draw ) _items_array[_i].screen_circle.drawcolor = _color ;
                     if ( _item.complex_circle.fill ) _items_array[_i].complex_circle.fillcolor = _color ;
                     if ( _item.screen_circle.fill ) _items_array[_i].screen_circle.cillcolor = _color ;
                 }
               );

         if ( _update ) circles_lib_canvas_process_ask(NO,YES,Z_PLANE,YES,YES,CHECK);
         var _msg = "All items have been colorized with success" ;
         if ( !_silent && _out_channel != OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         return [ RET_OK, _msg ] ;
    }
}

function circles_lib_colors_decolorize( _items_array, _update, _silent, _out_channel )
{
    _update = safe_int( _update, NO );
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( !_test ) return [ RET_ERROR, "Invalid input items container" ] ;
    else
    {
         var _color = "" ;
         $.each( _items_array, function( _i, _item )
                 {
                     if ( _item.complex_circle.draw ) _items_array[_i].complex_circle.drawcolor = DEFAULT_DRAW_SEED_COLOR ;
                     if ( _item.screen_circle.draw ) _items_array[_i].screen_circle.drawcolor = DEFAULT_DRAW_SEED_COLOR ;
                     if ( _item.complex_circle.fill ) _items_array[_i].complex_circle.fillcolor = DEFAULT_FILL_SEED_COLOR ;
                     if ( _item.screen_circle.fill ) _items_array[_i].screen_circle.cillcolor = DEFAULT_FILL_SEED_COLOR ;
                 }
               );

         if ( _update ) circles_lib_canvas_process_ask(NO,YES,Z_PLANE,YES,YES,CHECK);
         var _msg = "All items have been decolorized with success" ;
         if ( !_silent && _out_channel != OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         return [ RET_OK, _msg ] ;
    }
}

function circles_lib_colors_decode_tags( _data )
{
    var _color ;
		$.each( def_clrs_tags_keys, function( _i, _key )
            {
                _color = def_clrs_tags['tag.'+_key] ;
                _data = _data.replaceAll( "color:"+_key, "color:"+_color, YES ) ;
    					  _data = _data.replaceAll( "<"+_key+">", "<SPAN STYLE=\"color:"+_color+"\">", YES ) ;
    					  _data = _data.replaceAll( "</"+_key+">", "</SPAN>", YES ) ;
    				}
    			) ;
    				
    return _data ;
}

function circles_lib_colors_compute_gradient( RGBintSTART, RGBintEND, nSTEPS, _silent, _out_channel )
{
		nSTEPS = safe_int( nSTEPS, 1 ) - 1 ;
    RGBintSTART = safe_string( RGBintSTART, _glob_palette_array[0] );
    if ( RGBintSTART.length == 0 ) RGBintSTART = _glob_palette_array[0] ;
    RGBintEND = safe_string( RGBintEND, _glob_palette_array.get_last() );
    if ( RGBintEND.length == 0 ) RGBintEND = _glob_palette_array.get_last() ;
		_silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );

    RGBintSTART = RGBintSTART.replaceAll( "rgb(", "" );
    RGBintSTART = RGBintSTART.replaceAll( [ "(", ")", " " ], "" );
    RGBintSTARTarray = RGBintSTART.split( "," );
    RGBintEND = RGBintEND.replaceAll( "rgb(", "" );
    RGBintSTART = RGBintSTART.replaceAll( [ "(", ")", " " ], "" );
    RGBintENDarray = RGBintEND.split( "," );

    var tmpPALETTE = [] ;
    if ( RGBintSTARTarray.length == 3 && RGBintENDarray.length == 3 )
    {
       var RintSTART = safe_int( RGBintSTARTarray[0], 0 );
       var GintSTART = safe_int( RGBintSTARTarray[1], 0 );
       var BintSTART = safe_int( RGBintSTARTarray[2], 0 );

       var RintEND = safe_int( RGBintENDarray[0], 0 );
       var GintEND = safe_int( RGBintENDarray[1], 0 );
       var BintEND = safe_int( RGBintENDarray[2], 0 );

       var BstepLENGTH = ( BintEND - BintSTART ) / nSTEPS ;
       var GstepLENGTH = ( GintEND - GintSTART ) / nSTEPS ;
       var RstepLENGTH = ( RintEND - RintSTART ) / nSTEPS ;
       var R, G, B ;
       for( var i = 0 ; i <= nSTEPS ; i++ )
       {
          R = Math.min( 255, safe_int( RintSTART + RstepLENGTH * i, 0 ) );
          G = Math.min( 255, safe_int( GintSTART + GstepLENGTH * i, 0 ) );
          B = Math.min( 255, safe_int( BintSTART + BstepLENGTH * i, 0 ) );
          tmpPALETTE.push( "rgb( "+R+","+G+","+B+" )" );
       }

       var _msg = "Colors palette has been resized to " + nSTEPS + " entr" + ( nSTEPS == 1 ? "y" : "ies" ) ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
			 return [ RET_OK, tmpPALETTE, _msg ] ;
    }
    else
		{
       var _msg = "Can't resize the colors palette : invalid input RGB colors" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
	 		 return [ RET_ERROR, null, _msg ] ;
		}
}