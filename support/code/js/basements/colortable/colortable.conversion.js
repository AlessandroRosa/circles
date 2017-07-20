colortable.prototype.color_conversion = function()
{
     var r = 0 ;
     var g = 0 ;
     var b = 0 ;

     var CTRL_RED = document.getElementById( "clrtable_conversion_r" );
         if ( CTRL_RED != null ) r = CTRL_RED.value ;
     var CTRL_GREEN = document.getElementById( "clrtable_conversion_g" );
         if ( CTRL_GREEN != null ) g = CTRL_GREEN.value ;
     var CTRL_BLUE = document.getElementById( "clrtable_conversion_b" );
         if ( CTRL_BLUE != null ) b = CTRL_BLUE.value ;
     var CTRL_MAX_SCALE = document.getElementById( "clrtable_conversion_max_scale" );
         if ( CTRL_MAX_SCALE != null ) this.max_scale = CTRL_MAX_SCALE.value ;
         
     r = parseInt( r, 10 );       if ( isNaN( r ) ) r  = 0 ;      r = Math.max( r, 0 );      r = Math.min( r, 255 );     if ( CTRL_RED != null ) CTRL_RED.value = r ;
     g = parseInt( g, 10 );       if ( isNaN( g ) ) g  = 0 ;      g = Math.max( g, 0 );      g = Math.min( g, 255 );     if ( CTRL_GREEN != null ) CTRL_GREEN.value = g ;
     b = parseInt( b, 10 );       if ( isNaN( b ) ) b  = 0 ;      b = Math.max( b, 0 );      b = Math.min( b, 255 );     if ( CTRL_BLUE != null ) CTRL_BLUE.value = b ;

         var Rhex = this.d2h( r ) ;     if ( Rhex.length == 1 ) Rhex = "0" + Rhex ;
         var Ghex = this.d2h( g ) ;     if ( Ghex.length == 1 ) Ghex = "0" + Ghex ;
         var Bhex = this.d2h( b ) ;     if ( Bhex.length == 1 ) Bhex = "0" + Bhex ;
         var RGB_HEX = "#" + Rhex + "" + Ghex + "" + Bhex ;
     
     var clrtable_conversion_color = document.getElementById( "clrtable_conversion_color" );
         if ( clrtable_conversion_color != null ) clrtable_conversion_color.style.backgroundColor = RGB_HEX ;
          
     var IDS_ARRAY = this.IDS_ARRAY[ 0 ].split( "@" ) ;    var rgb_array = this.CMY( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 1 ].split( "@" ) ;    var rgb_array = this.HLS( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 2 ].split( "@" ) ;    var rgb_array = this.HSI( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 3 ].split( "@" ) ;    var rgb_array = this.HSV( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 4 ].split( "@" ) ;    var rgb_array = this.ITU( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 5 ].split( "@" ) ;    var rgb_array = this.SMPTECRGB( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 6 ].split( "@" ) ;    var rgb_array = this.SMPTE240M( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 7 ].split( "@" ) ;    var rgb_array = this.XYZ6011( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 8 ].split( "@" ) ;    var rgb_array = this.XYZ709( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 9 ].split( "@" ) ;    var rgb_array = this.YCbCr( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 10 ].split( "@" ) ;   var rgb_array = this.YCC( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 11 ].split( "@" ) ;   var rgb_array = this.YES( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 12 ].split( "@" ) ;   var rgb_array = this.YIQ( r, g, b, IDS_ARRAY );
         IDS_ARRAY = this.IDS_ARRAY[ 13 ].split( "@" ) ;   var rgb_array = this.YUV( r, g, b, IDS_ARRAY );
}

colortable.prototype.CMY = function( r , g , b, IDS_ARRAY )
{
    	var new_r = 255.0 - r ;
    	var new_g = 255.0 - g ;
    	var new_b = 255.0 - b ;
    
    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r ;
     	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g ;
     	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b ;
}

colortable.prototype.HLS = function( r , g , b, IDS_ARRAY )
{
	var norm_r = r / 255.0 , norm_g = g / 255.0 , norm_b = b / 255.0 ;
	
	var maximum = Math.max( norm_r , Math.max( norm_g , norm_b ) ) ;
	var minimum = Math.min( norm_r , Math.min( norm_g , norm_b ) ) ;

	var new_r = 0.0 ;
	var new_g = ( maximum + minimum ) / 2.0 ;
	var new_b = 0.0 ;

	var delta = maximum - minimum ;
	
	if ( maximum == minimum ) new_r = new_b = 0.0 ;
	else
	{
		new_b = ( new_g < 0.5 ) ? ( delta / ( maximum + minimum ) ) : ( delta / ( 2.0 - ( maximum + minimum ) ) ) ;
		
		var r_dist = ( maximum - norm_r ) / delta ;
		var g_dist = ( maximum - norm_g ) / delta ;
		var b_dist = ( maximum - norm_b ) / delta ;
				
		if ( norm_r == maximum  ) new_r = b_dist - g_dist ;
		else if ( norm_g == maximum ) new_r = 2.0 + r_dist - b_dist ; 
		else if ( norm_b == maximum ) new_r = 4.0 + g_dist - r_dist ; 
	
		new_r *= 60.0 ;
		if ( new_r < 0.0 ) new_r += 360.0 ;
	}
	
    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}

colortable.prototype.HSI = function( r , g , b, IDS_ARRAY )
{
	var new_r = 0.0 ;
	var new_g = Math.pow( ( r * r + g * g + b * b - r * g - r * b - b * g ) , 0.5 );
	var new_b = ( r + g + b ) / 3.0 ;	
	
	var PI = 3.14159265 ; 
	
	var alpha = 0.0 ;
	if ( g > b )
	{
		alpha = PI / 2.0 ;
		new_r = alpha - ( Math.atan( ( r - new_b ) * ( Math.pow( 3.0 , 0.5 ) / g - b ) ) ) / ( 2.0 * PI );
	}
	else if ( g < b )
	{
		alpha = 3 * PI / 2.0 ;	
		new_r = alpha - ( Math.atan( ( r - new_b ) * ( Math.pow( 3.0 , 0.5 ) / g - b ) ) ) / ( 2.0 * PI );
	}
	else new_r = 255.0 ;

    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}

colortable.prototype.HSV = function( r , g , b, IDS_ARRAY )
{
	var maximum = Math.max( r , Math.max( g , b ) ) ;
	var minimum = Math.min( r , Math.min( g , b ) ) ;

	var delta = maximum - minimum ;
	
	var new_r = 0.0 ;
	var new_g = ( maximum != 0.0 ) ? ( ( maximum - minimum ) / maximum ) : 0.0 ;
	var new_b = 0 ;
	
	if ( new_g == 0.0 ) new_r = 0.0 ;
	else
	{
		var r_dist = ( maximum - r ) / delta ;
		var g_dist = ( maximum - g ) / delta ;
		var b_dist = ( maximum - b ) / delta ;
		
		if ( r == maximum )	new_r = b_dist - g_dist ;
		else if ( g == maximum ) new_r = 2.0 + r_dist - b_dist ;
		else if ( b == maximum ) new_r = 4.0 + g_dist - r_dist ;
	
		new_r *= 60.0 ;
		if ( new_r < 0.0 ) new_r += 360.0 ;
	}
		
    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b = maximum ;
}

colortable.prototype.ITU = function( r , g , b, IDS_ARRAY )
{
	var new_r = 0.431 * r + 0.342 * g + 0.178 * b ;
	var new_g = 0.222 * r + 0.707 * g + 0.071 * b ;
	var new_b = 0.020 * r + 0.130 * g + 0.939 * b ;
		
    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}

colortable.prototype.SMPTECRGB = function( r , g , b, IDS_ARRAY )
{
	var new_r = 0.3935 * r + 0.3653 * g + 0.1916 * b ;
	var new_g = 0.2124 * r + 0.7011 * g + 0.0866 * b ;
	var new_b = 0.0187 * r + 0.1119 * g + 0.9582 * b ;

    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}

colortable.prototype.SMPTE240M = function( r , g , b, IDS_ARRAY )
{
	var new_r = 0.2122 * r + 0.7013 * g + 0.0865 * b ;
	var new_g = -0.1162 * r - 0.3838 * g + 0.5000 * b ;
	var new_b = 0.5000 * r - 0.4451 * g - 0.0549 * b ;

    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
     	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}

colortable.prototype.XYZ6011 = function( r , g , b, IDS_ARRAY )
{
    	var new_r = 0.607 * r + 0.174 * g + 0.200 * b ;
    	var new_g = 0.299 * r + 0.587 * g + 0.114 * b ;
    	var new_b = 0.000 * r + 0.066 * g + 1.116 * b ;
    
    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}

colortable.prototype.XYZ709 = function( r , g , b, IDS_ARRAY )
{
    	var new_r = 0.412411 * r + 0.357585 * g + 0.180454 * b ;
    	var new_g = 0.212649 * r + 0.715169 * g + 0.072182 * b ;
    	var new_b = 0.019332 * r + 0.119195 * g + 0.950390 * b ;
    
    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}

colortable.prototype.YCbCr = function( r , g , b, IDS_ARRAY )
{
	var new_r = 0.2989 * r + 0.5866 * g + 0.1145 * b ;
	var new_g = -0.1687 * r - 0.3312 * g + 0.5000 * b ;
	var new_b = 0.5000 * r - 0.4183 * g - 0.0816 * b ;

    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}

colortable.prototype.YCC = function( r , g , b, IDS_ARRAY )
{
	var norm_r = r / 255.0 , norm_g = g / 255.0 , norm_b = b / 255.0 ;
	
	var new_r = 0.299 * norm_r + 0.587 * norm_g + 0.114 * norm_b ;
	var new_g = -0.299 * norm_r - 0.587 * norm_g + 0.886 * norm_b ;
	var new_b = 0.701 * norm_r - 0.587 * norm_g - 0.114 * norm_b ;

    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}

colortable.prototype.YES = function( x, y, z, IDS_ARRAY )
{
	// coordinates are previously trasformed from RGB into CIE XYZ ITU ( D65 )
	
	var new_r = 0.0 * x + 1.000 * y + 0.0 * z ;
	var new_g = -2.019 * x + 1.743 * y - 0.246 * z ;
	var new_b = 0.423 * x + 0.227 * y - 0.831 * z ;

    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}

colortable.prototype.YUV = function( r , g , b, IDS_ARRAY )
{
	var new_r = 0.299 * r + 0.587 * g + 0.114 * b ;
	var new_g = -0.147 * r - 0.289 * g + 0.437 * b ;
	var new_b = 0.615 * r - 0.515 * g - 0.100 * b ;

    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}

colortable.prototype.YIQ = function( r , g , b, IDS_ARRAY )
{
	var new_r = 0.299 * r + 0.587 * g + 0.114 * b ;
	var new_g = 0.596 * r - 0.274 * g - 0.322 * b ;
	var new_b = 0.212 * r - 0.523 * g + 0.311 * b ;

    	document.getElementById( IDS_ARRAY[0] + "_X" ).innerHTML = new_r.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Y" ).innerHTML = new_g.roundTo( 2 ) ;
    	document.getElementById( IDS_ARRAY[0] + "_Z" ).innerHTML = new_b.roundTo( 2 ) ;
}