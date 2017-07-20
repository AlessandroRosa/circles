    var COLORSarray = new Array();
    var r = 128, g = 0, b = 0 ;
    var r_hex = "", g_hex = "", b_hex = "" ;
    var DIFF = 6, c ;
        // RED : from 128 to 255
        for( c = r ; c <= 255 ; c += DIFF )
        {
             r = Math.max( 0, Math.min( 255, c ) );
             r_hex = r.toString( 16 );      if ( r_hex.length == 1 ) r_hex = "0" + r_hex ;
             g_hex = g.toString( 16 );      if ( g_hex.length == 1 ) g_hex = "0" + g_hex ; 
             b_hex = b.toString( 16 );      if ( b_hex.length == 1 ) b_hex = "0" + b_hex ;
             
             COLORSarray.push( "#" + r_hex + "" + g_hex + "" + b_hex ) ;
        }        

        // GREEN : from 0 to 128 
        for( c = g ; c <= 128 ; c += DIFF )
        {
             g = Math.max( 0, Math.min( 255, c ) );
             r_hex = r.toString( 16 );      if ( r_hex.length == 1 ) r_hex = "0" + r_hex ;
             g_hex = g.toString( 16 );      if ( g_hex.length == 1 ) g_hex = "0" + g_hex ; 
             b_hex = b.toString( 16 );      if ( b_hex.length == 1 ) b_hex = "0" + b_hex ;
             
             COLORSarray.push( "#" + r_hex + "" + g_hex + "" + b_hex ) ;
        }

        // RED : from 255 to 128
        for( c = r ; c >= 128 ; c -= DIFF )
        {
             r = Math.max( 0, Math.min( 255, c ) );
             r_hex = r.toString( 16 );      if ( r_hex.length == 1 ) r_hex = "0" + r_hex ;
             g_hex = g.toString( 16 );      if ( g_hex.length == 1 ) g_hex = "0" + g_hex ; 
             b_hex = b.toString( 16 );      if ( b_hex.length == 1 ) b_hex = "0" + b_hex ;
             
             COLORSarray.push( "#" + r_hex + "" + g_hex + "" + b_hex ) ;
        }        

        // GREEN : from 128 to 255 
        for( c = g ; c <= 255 ; c += DIFF )
        {
             g = Math.max( 0, Math.min( 255, c ) );
             r_hex = r.toString( 16 );      if ( r_hex.length == 1 ) r_hex = "0" + r_hex ;
             g_hex = g.toString( 16 );      if ( g_hex.length == 1 ) g_hex = "0" + g_hex ; 
             b_hex = b.toString( 16 );      if ( b_hex.length == 1 ) b_hex = "0" + b_hex ;
             
             COLORSarray.push( "#" + r_hex + "" + g_hex + "" + b_hex ) ;
        }

        // BLUE : from 128 to 255 
        for( c = b ; c <= 255 ; c += DIFF )
        {
             b = Math.max( 0, Math.min( 255, c ) );
             r_hex = r.toString( 16 );      if ( r_hex.length == 1 ) r_hex = "0" + r_hex ;
             g_hex = g.toString( 16 );      if ( g_hex.length == 1 ) g_hex = "0" + g_hex ; 
             b_hex = b.toString( 16 );      if ( b_hex.length == 1 ) b_hex = "0" + b_hex ;
             
             COLORSarray.push( "#" + r_hex + "" + g_hex + "" + b_hex ) ;
        }

        // GREEN : from 255 to 0 
        for( c = g ; c >= 0 ; c -= DIFF )
        {
             g = Math.max( 0, Math.min( 255, c ) );
             r_hex = r.toString( 16 );      if ( r_hex.length == 1 ) r_hex = "0" + r_hex ;
             g_hex = g.toString( 16 );      if ( g_hex.length == 1 ) g_hex = "0" + g_hex ; 
             b_hex = b.toString( 16 );      if ( b_hex.length == 1 ) b_hex = "0" + b_hex ;
             
             COLORSarray.push( "#" + r_hex + "" + g_hex + "" + b_hex ) ;
        }

        // RED : from 128 to 0
        for( c = r ; c >= 0 ; c -= DIFF )
        {
             r = Math.max( 0, Math.min( 255, c ) );
             r_hex = r.toString( 16 );      if ( r_hex.length == 1 ) r_hex = "0" + r_hex ;
             g_hex = g.toString( 16 );      if ( g_hex.length == 1 ) g_hex = "0" + g_hex ; 
             b_hex = b.toString( 16 );      if ( b_hex.length == 1 ) b_hex = "0" + b_hex ;
             
             COLORSarray.push( "#" + r_hex + "" + g_hex + "" + b_hex ) ;
        }        

        // BLUE : from 255 to 0 
        for( c = b ; c >= 0 ; c -= DIFF )
        {
             b = Math.max( 0, Math.min( 255, c ) );
             r_hex = r.toString( 16 );      if ( r_hex.length == 1 ) r_hex = "0" + r_hex ;
             g_hex = g.toString( 16 );      if ( g_hex.length == 1 ) g_hex = "0" + g_hex ; 
             b_hex = b.toString( 16 );      if ( b_hex.length == 1 ) b_hex = "0" + b_hex ;
             
             COLORSarray.push( "#" + r_hex + "" + g_hex + "" + b_hex ) ;
        }

        // RED : from 0 to 128
        for( c = r ; c <= 128 ; c += DIFF )
        {
             r = Math.max( 0, Math.min( 255, c ) );
             r_hex = r.toString( 16 );      if ( r_hex.length == 1 ) r_hex = "0" + r_hex ;
             g_hex = g.toString( 16 );      if ( g_hex.length == 1 ) g_hex = "0" + g_hex ; 
             b_hex = b.toString( 16 );      if ( b_hex.length == 1 ) b_hex = "0" + b_hex ;
             
             COLORSarray.push( "#" + r_hex + "" + g_hex + "" + b_hex ) ;
        }        
