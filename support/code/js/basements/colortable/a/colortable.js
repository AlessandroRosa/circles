var COLORTABLE_GRADIENT_ORIENTATION_HORZ = 1 ;
var COLORTABLE_GRADIENT_ORIENTATION_VERT = 2 ;

function colortable( _var_name )
{
    // _var_name is the variable name of the object color table
    // i.e. var _the_var_name = new colortable( '_the_var_name' );
    
    this.rgb_hex_array = new Array();
    this.rgb_hex_array.push( "#000000" ) ;
    this.rgb_hex_array.push( "#FF0000" ) ;
    this.rgb_hex_array.push( "#00FF00" ) ;
    this.rgb_hex_array.push( "#0000FF" ) ;
    this.rgb_hex_array.push( "#00FFFF" ) ;
    this.rgb_hex_array.push( "#00DFDF" ) ;
    this.rgb_hex_array.push( "#FF00FF" ) ;
    this.rgb_hex_array.push( "#CF00CF" ) ;
    this.rgb_hex_array.push( "#FFFF00" ) ;
    this.rgb_hex_array.push( "#FFC000" ) ;
    this.rgb_hex_array.push( "#FF61B5" ) ;
    this.rgb_hex_array.push( "#EF61B5" ) ;
    this.rgb_hex_array.push( "#A0A0A0" ) ;
    this.rgb_hex_array.push( "#D0D0D0" ) ;
    this.rgb_hex_array.push( "#E0E0E0" ) ;
    this.rgb_hex_array.push( "#F0F0F0" ) ;
    this.rgb_hex_array.push( "#FFFFFF" ) ;

    this.IDS_ARRAY = new Array();
    this.IDS_ARRAY.push( "CMY@C@M@Y" ) ;
    this.IDS_ARRAY.push( "HLS@H@L@S" ) ;
    this.IDS_ARRAY.push( "HSI@H@S@I" ) ;
    this.IDS_ARRAY.push( "HSV@H@S@V" ) ;
    this.IDS_ARRAY.push( "ITU@I@T@U" ) ;
    this.IDS_ARRAY.push( "SMPTECRGB@R@G@B" ) ;
    this.IDS_ARRAY.push( "SMPTE240M@R@G@B" ) ;
    this.IDS_ARRAY.push( "XYZ6011@X@Y@Z" ) ;
    this.IDS_ARRAY.push( "XYZ709@X@Y@Z" ) ;
    this.IDS_ARRAY.push( "YCbCr@Y@Cb@Cr" ) ;
    this.IDS_ARRAY.push( "YCC@Y@C@C" ) ;
    this.IDS_ARRAY.push( "YES@Y@E@S" ) ;
    this.IDS_ARRAY.push( "YIQ@Y@I@Q" ) ;
    this.IDS_ARRAY.push( "YUV@Y@U@V" ) ;

    this.returnCTRLid = "" ;
    this.containerID = "" ;
    this.custom_edit_id = "" ;
    
    this.var_name = ( typeof _var_name == "string" || _var_name instanceof String ) ? _var_name : "colortable" ;
    
    this.gradient_steps = 10 ;

    this.interface_selector = 1 ;   /* 1: default, 2: custom */
    this.scale_orientation = 1 ;
    
    this.selected_rgb_hex = "" ;
    this.selected_r = 0 ;
    this.selected_g = 0 ;
    this.selected_b = 0 ;
    
    this.max_scale = 255 ;
    
    this.interface_mode = 1 ; /* 1: basic, 2:advanced */
    this.path_to_img = "" ;
    
    this.onselectcolor_fn = null ;
}

colortable.prototype.selectCOLOR = function( rgb_hex, r, g, b )
{
    var CTRL = document.getElementById( this.returnCTRLid );
        if ( CTRL != null )
        {
            CTRL.style.backgroundColor = rgb_hex ;
            if ( CTRL.tagName.toLowerCase().indexOf( "td" ) != -1 ) CTRL.innerHTML = "" ;
        }

    this.selected_rgb_hex = rgb_hex ;
    this.selected_r = r ;
    this.selected_g = g ;
    this.selected_b = b ;

    var default_hex_out = document.getElementById( "default_hex_out" );
        if ( default_hex_out != null ) default_hex_out.innerHTML = rgb_hex ;

    var default_rgb_out = document.getElementById( "default_rgb_out" );
    if ( default_rgb_out != null ) default_rgb_out.innerHTML = r + "," + g + "," + b ;
    if ( typeof this.onselectcolor_fn === "function" ) this.onselectcolor_fn.call( null );
}

colortable.prototype.setHANDLERonselectcolor = function( _fn )
{
    this.onselectcolor_fn = _fn ;
}

colortable.prototype.setCONTAINERid = function( ctrlid )
{
    this.containerID = ctrlid ;
}

colortable.prototype.setRETURNctrlID = function( ctrlid )
{
    this.returnCTRLid = ctrlid ;
}

colortable.prototype.set_interface_mode = function( im )
{
    this.interface_mode = im ;
}

colortable.prototype.get_interface_mode = function()
{
    return this.interface_mode ;
}

colortable.prototype.get_selected_rgb_hex = function()
{
    return this.selected_rgb_hex ;
}

colortable.prototype.get_rgb_dec_from_hex = function( rgbhex )
{
    rgbhex = rgbhex.replace( "#", "" );
    var r_hex = rgbhex.substr( 0, 2 );
    var g_hex = rgbhex.substr( 2, 2 );
    var b_hex = rgbhex.substr( 4, 2 );

    var r_dec = parseInt( r_hex, 16 );
    var g_dec = parseInt( g_hex, 16 );
    var b_dec = parseInt( b_hex, 16 );
    
    var rgb_array = new Array();
        rgb_array.push( r_dec ) ;
        rgb_array.push( g_dec ) ;
        rgb_array.push( b_dec ) ;
        
    return rgb_array ;
}

colortable.prototype.d2h = function(d) { var hD="0123456789ABCDEF" ; var h = hD.substr(d&15,1);while(d>15) {d>>=4;h=hD.substr(d&15,1)+h;} return h ; }
colortable.prototype.h2d = function(h) { return parseInt(h,16); } 

colortable.prototype.custom_select_triplet = function( CTRLid, rgb_hex )
{
    var CTRL = document.getElementById( CTRLid );
    if ( CTRL != null )
    {
         var rgb_array = this.get_rgb_dec_from_hex( rgb_hex ), i, c, CTRLoutID, CTRLoutID;
         for( i = 0 ; i < rgb_array.length ; i++ )
         {
             c = parseInt( rgb_array[i], 10 ) ;        if ( isNaN( c ) ) c = 0 ;
             if ( c > 0 )
             {
                  CTRLoutID = "" ;
                  if ( i == 0 ) CTRLoutID = "custom_r_out" ;
                  else if ( i == 1 ) CTRLoutID = "custom_g_out" ;
                  else if ( i == 2 ) CTRLoutID = "custom_b_out" ;
                          
                  CTRLout = document.getElementById( CTRLoutID );
                  if ( CTRLout != null ) CTRLout.style.backgroundColor = rgb_hex ;
                      
                  CTRL.value = c ;
                  break ;
             }
         }
    }
          
    this.custom_mix_components();
}

colortable.prototype.custom_select_component = function( component_index )
{
      var CTRLid = "" ;       var CTRLoutID = "" ;
      if      ( component_index == 1 ) { CTRLid = "clrtable_custom_r" ; CTRLoutID = "custom_r_out" }
      else if ( component_index == 2 ) { CTRLid = "clrtable_custom_g" ; CTRLoutID = "custom_g_out" }
      else if ( component_index == 3 ) { CTRLid = "clrtable_custom_b" ; CTRLoutID = "custom_b_out" }
      
      var CTRLin = document.getElementById( CTRLid );
      var CTRLout = document.getElementById( CTRLoutID );
      if ( CTRLin != null && CTRLout != null )
      {
           var COMP = parseInt( CTRLin.value, 10 ) ;        if ( isNaN( COMP ) ) COMP = 0 ;
           COMP = Math.max( 0, COMP );          COMP = Math.min( COMP, 255 );
               
           var COMP_HEX = this.d2h( COMP );
           if ( COMP_HEX.length == 1 ) COMP_HEX = "0" + COMP_HEX ;
           if      ( component_index == 1 ) CTRLout.style.backgroundColor = "#" + COMP_HEX + "0000" ;
           else if ( component_index == 2 ) CTRLout.style.backgroundColor = "#00" + COMP_HEX + "00" ;
           else if ( component_index == 3 ) CTRLout.style.backgroundColor = "#0000" + COMP_HEX ;
      }
}

colortable.prototype.custom_mix_components = function()
{
     var r = 0, g = 0, b = 0 ;

     var CTRL_RED = document.getElementById( "clrtable_custom_r" );
         if ( CTRL_RED != null ) r = CTRL_RED.value ;
     var CTRL_GREEN = document.getElementById( "clrtable_custom_g" );
         if ( CTRL_GREEN != null ) g = CTRL_GREEN.value ;
     var CTRL_BLUE = document.getElementById( "clrtable_custom_b" );
         if ( CTRL_BLUE != null ) b = CTRL_BLUE.value ;
         
     r = parseInt( r, 10 );       if ( isNaN( r ) ) r  = 0 ;      r = Math.max( r, 0 );      r = Math.min( r, 255 );     if ( CTRL_RED != null ) CTRL_RED.value = r ;
     g = parseInt( g, 10 );       if ( isNaN( g ) ) g  = 0 ;      g = Math.max( g, 0 );      g = Math.min( g, 255 );     if ( CTRL_GREEN != null ) CTRL_GREEN.value = g ;
     b = parseInt( b, 10 );       if ( isNaN( b ) ) b  = 0 ;      b = Math.max( b, 0 );      b = Math.min( b, 255 );     if ( CTRL_BLUE != null ) CTRL_BLUE.value = b ;

     var Rhex = this.d2h( r ) ;     if ( Rhex.length == 1 ) Rhex = "0" + Rhex ;
     var Ghex = this.d2h( g ) ;     if ( Ghex.length == 1 ) Ghex = "0" + Ghex ;
     var Bhex = this.d2h( b ) ;     if ( Bhex.length == 1 ) Bhex = "0" + Bhex ;
     var RGB_HEX = "#" + Rhex + "" + Ghex + "" + Bhex ;
          
     this.selectCOLOR( RGB_HEX, r, g, b );
     
     var custom_hex_out = document.getElementById( "custom_hex_out" );
     if ( custom_hex_out != null ) custom_hex_out.innerHTML = RGB_HEX ;

     var custom_rgb_out = document.getElementById( "custom_rgb_out" );
     if ( custom_rgb_out != null ) custom_rgb_out.innerHTML = r + "," + g + "," + b ;
}

colortable.prototype.render_gradient_code = function( rgbhex_min, rgbhex_max, orientation )
{
     this.scale_orientation = orientation ;
     
     var RGB_MIN_ARRAY = this.get_rgb_dec_from_hex( rgbhex_min ) ;
     var RGB_MAX_ARRAY = this.get_rgb_dec_from_hex( rgbhex_max ) ;
     
     var r_min = RGB_MIN_ARRAY[0] ;         var r_max = RGB_MAX_ARRAY[0] ;
     var g_min = RGB_MIN_ARRAY[1] ;         var g_max = RGB_MAX_ARRAY[1] ;
     var b_min = RGB_MIN_ARRAY[2] ;         var b_max = RGB_MAX_ARRAY[2] ;
     
     var n_steps = this.gradient_steps ;

     var r_step = ( r_max - r_min ) / n_steps ;
     var g_step = ( g_max - g_min ) / n_steps ;
     var b_step = ( b_max - b_min ) / n_steps ;
     
     var HTMLcode = "<table STYLE=\"background-color:white;\">" ;
     if ( orientation == 1 ) HTMLcode += "<tr>" ;
     
     var Rnew, Gnew, Bnew, Rhex, Ghex, Bhex, RGB_HEX ;
     
     for( var i = 0 ; i <= n_steps ; i++ )
     {
          Rnew = r_min + ( i * r_step ) ;       Rnew = parseInt( Rnew, 10 );      r = Math.max( Rnew, 0 );      Rnew = Math.min( Rnew, 255 );
          Gnew = g_min + ( i * g_step ) ;       Gnew = parseInt( Gnew, 10 );      g = Math.max( Gnew, 0 );      Gnew = Math.min( Gnew, 255 );
          Bnew = b_min + ( i * b_step ) ;       Bnew = parseInt( Bnew, 10 );      b = Math.max( Bnew, 0 );      Bnew = Math.min( Bnew, 255 );
          
          Rhex = this.d2h( Rnew ) ;     if ( Rhex.length == 1 ) Rhex = "0" + Rhex ;
          Ghex = this.d2h( Gnew ) ;     if ( Ghex.length == 1 ) Ghex = "0" + Ghex ;
          Bhex = this.d2h( Bnew ) ;     if ( Bhex.length == 1 ) Bhex = "0" + Bhex ;
          RGB_HEX = "#" + Rhex + "" + Ghex + "" + Bhex ;

          if ( orientation == 2 ) HTMLcode += "<tr>" ;

          HTMLcode += "<td " ;
          switch ( this.interface_selector )
          {
              case 1: // default interface
              HTMLcode += " ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"" ;
              HTMLcode += " ONCLICK=\"javascript:"+this.var_name+".selectCOLOR( '"+RGB_HEX+"', '"+Rnew+"', '"+Gnew+"', '"+Bnew+"');\"" ;
              break ;
              case 2: // custom interface
              HTMLcode += " ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"" ;
              HTMLcode += " ONCLICK=\"javascript:"+this.var_name+".custom_select_triplet('"+this.custom_edit_id+"', '"+RGB_HEX+"' );\"" ;
              break ;
          }

          HTMLcode += "CLASS=\"colortable_shadebox\" STYLE=\"background-color:"+RGB_HEX+";\">" ;
          HTMLcode += "</td>" ;
          
          switch( orientation ) 
          {
              case 1:
              HTMLcode += "<td WIDTH=\"1\"></td>" ;
              break ;
              case 2:
              HTMLcode += "</tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
              break ;
          }
     }

     if ( orientation == 1 ) HTMLcode += "</tr>" ;
     HTMLcode += "</table>" ;
     return HTMLcode ;
}