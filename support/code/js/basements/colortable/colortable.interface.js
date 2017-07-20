colortable.prototype.select_interface = function( s )
{
    s = parseInt( s, 10 );      if ( isNaN( s ) ) s = 1 ;
    if ( s != this.interface_selector )
    {
        this.interface_selector = s ;
        this.render();
    }
}

colortable.prototype.default_render = function()
{
     var COLUMNS = 8, HTMLcode = "", i, rgb_hex, rgb_array, r ;
     HTMLcode += "<table CLASS=\"colortable_shades_container\" ALIGN=\"center\">" ;
     HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
     for( i = 0 ; i < this.rgb_hex_array.length ; i++ )
     {
         if ( i % COLUMNS == 0 ) HTMLcode += "<tr><td WIDTH=\"2\"></td>" ;
         rgb_hex = this.rgb_hex_array[ i ] ;
         if ( rgb_hex.length > 0 )
         {
              rgb_array = this.get_rgb_dec_from_hex( rgb_hex );
              r = rgb_array[0], g = rgb_array[1], b = rgb_array[2] ;
              HTMLcode += "<td" ;
              HTMLcode += " ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"" ;
              HTMLcode += " ONCLICK=\"javascript:clrtable.selectCOLOR('"+rgb_hex+"', '"+r+"', '"+g+"', '"+b+"' );\"" ;
              HTMLcode += " CLASS=\"colortable_shadebox\" STYLE=\"background-color:"+rgb_hex+"\"> " ;
              HTMLcode += "</td>" ;
         }
           
         if ( i % COLUMNS == ( COLUMNS - 1 ) ) HTMLcode += "<td WIDTH=\"2\"></td></tr><tr><td HEIGHT=\"3\"></td></tr>" ;
         else HTMLcode += "<td WIDTH=\"2\"></td>" ;
     }

     if ( i % COLUMNS != ( COLUMNS - 1 ) ) HTMLcode += "</tr>" ;
     HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
     HTMLcode += "</table>" ;
     HTMLcode += "</td>" ;
     HTMLcode += "</tr>" ;
     HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;

     var GREYSCALEcode = this.render_gradient_code( "#000000", "#FFFFFF", COLORTABLE_GRADIENT_ORIENTATION_VERT ) ;
     var REDSCALEcode = this.render_gradient_code( "#000000", "#FF0000", COLORTABLE_GRADIENT_ORIENTATION_VERT ) ;
     var BLUESCALEcode = this.render_gradient_code( "#000000", "#00FF00", COLORTABLE_GRADIENT_ORIENTATION_VERT ) ;
     var GREENSCALEcode = this.render_gradient_code( "#000000", "#0000FF", COLORTABLE_GRADIENT_ORIENTATION_VERT ) ;
     var ONE_SCALEcode = this.render_gradient_code( "#8DC9E5", "#30E82F", COLORTABLE_GRADIENT_ORIENTATION_VERT ) ;
     var TWO_SCALEcode = this.render_gradient_code( "#FFFF00", "#FF8700", COLORTABLE_GRADIENT_ORIENTATION_VERT ) ;
     var THREE_SCALEcode = this.render_gradient_code( "#00FFFF", "#FF00FF", COLORTABLE_GRADIENT_ORIENTATION_VERT ) ;

     HTMLcode += "<tr>" ;
     HTMLcode += "<td VALIGN=\"top\">" ;
     HTMLcode += "<table CLASS=\"colortable_font\">" ;
     HTMLcode += "<tr>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td>RGB</td>" ;
     HTMLcode += "<td WIDTH=\"3\"></td>" ;
     HTMLcode += "<td ALIGN=\"center\" CLASS=\"colortable_rgb_out\" ID=\"default_rgb_out\"></td>" ;
     HTMLcode += "</tr>" ;
     HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
     HTMLcode += "<tr>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td>Hex</td>" ;
     HTMLcode += "<td WIDTH=\"3\"></td>" ;
     HTMLcode += "<td ALIGN=\"center\" CLASS=\"colortable_hex_out\" ID=\"default_hex_out\"></td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "</tr>" ;
     HTMLcode += "</table>" ;
     HTMLcode += "</td>" ;
     HTMLcode += "</tr>" ;
     HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;

     HTMLcode += "<tr>" ;
     HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding:4px;\">" ;
     HTMLcode += "<table CLASS=\"colortable_shades_container\">" ;
     HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
     HTMLcode += "<tr>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td VALIGN=\"top\">"+GREYSCALEcode+"</td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td VALIGN=\"top\">"+REDSCALEcode+"</td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td VALIGN=\"top\">"+GREENSCALEcode+"</td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td VALIGN=\"top\">"+BLUESCALEcode+"</td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td VALIGN=\"top\">"+ONE_SCALEcode+"</td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td VALIGN=\"top\">"+TWO_SCALEcode+"</td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "<td VALIGN=\"top\">"+THREE_SCALEcode+"</td>" ;
     HTMLcode += "<td WIDTH=\"2\"></td>" ;
     HTMLcode += "<td VALIGN=\"top\" ID=\"colortable_userdefined_scale\"></td>" ;
     HTMLcode += "<td WIDTH=\"5\"></td>" ;
     HTMLcode += "</tr>" ;
     HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
     HTMLcode += "</table>" ;
     
     return HTMLcode ;
}

colortable.prototype.custom_render = function()
{
     var HTMLcode = "<table><tr><td HEIGHT=\"2\"></td></tr>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\">" ;
         HTMLcode += "<table CLASS=\"colortable_font\">" ;

         this.custom_edit_id = "clrtable_custom_r" ;
         var REDSCALEcode = this.render_gradient_code( "#000000", "#FF0000", COLORTABLE_GRADIENT_ORIENTATION_HORZ ) ;

         this.custom_edit_id = "clrtable_custom_g" ;
         var GREENSCALEcode = this.render_gradient_code( "#000000", "#00FF00", COLORTABLE_GRADIENT_ORIENTATION_HORZ ) ;

         this.custom_edit_id = "clrtable_custom_b" ;
         var BLUESCALEcode = this.render_gradient_code( "#000000", "#0000FF", COLORTABLE_GRADIENT_ORIENTATION_HORZ ) ;

         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>Red</td>" ;
         HTMLcode += "<td WIDTH=\"2\"></td>" ;
         HTMLcode += "<td><INPUT CLASS=\"colortable_edit\" STYLE=\"width:30px;\" ONKEYUP=\"javascript:clrtable.custom_select_component(1);clrtable.custom_mix_components();\" ID=\"clrtable_custom_r\" TYPE=\"edit\"></td>" ;
         HTMLcode += "<td WIDTH=\"10\"></td>" ;
         HTMLcode += "<td>"+REDSCALEcode+"</td>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td WIDTH=\"25\" ID=\"custom_r_out\"></td>" ;
         HTMLcode += "</tr>" ;

         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>Green</td>" ;
         HTMLcode += "<td WIDTH=\"2\"></td>" ;
         HTMLcode += "<td><INPUT CLASS=\"colortable_edit\" STYLE=\"width:30px;\" ONKEYUP=\"javascript:clrtable.custom_select_component(2);clrtable.custom_mix_components();\" ID=\"clrtable_custom_g\" TYPE=\"edit\"></td>" ;
         HTMLcode += "<td WIDTH=\"10\"></td>" ;
         HTMLcode += "<td>"+GREENSCALEcode+"</td>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td WIDTH=\"25\" ID=\"custom_g_out\"></td>" ;
         HTMLcode += "</tr>" ;

         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>Blue</td>" ;
         HTMLcode += "<td WIDTH=\"2\"></td>" ;
         HTMLcode += "<td><INPUT CLASS=\"colortable_edit\" STYLE=\"width:30px;\" ONKEYUP=\"javascript:clrtable.custom_select_component(3);clrtable.custom_mix_components();\" ID=\"clrtable_custom_b\" TYPE=\"edit\"></td>" ;
         HTMLcode += "<td WIDTH=\"10\"></td>" ;
         HTMLcode += "<td>"+BLUESCALEcode+"</td>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td WIDTH=\"25\" ID=\"custom_b_out\"></td>" ;
         HTMLcode += "</tr>" ;

         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;

         HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\">" ;
         HTMLcode += "<table>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>RGB</td>" ;
         HTMLcode += "<td WIDTH=\"3\"></td>" ;
         HTMLcode += "<td ALIGN=\"center\" CLASS=\"colortable_rgb_out\" ID=\"custom_rgb_out\"></td>" ;
         HTMLcode += "<td WIDTH=\"15\"></td>" ;
         HTMLcode += "<td>Hex</td>" ;
         HTMLcode += "<td WIDTH=\"3\"></td>" ;
         HTMLcode += "<td ALIGN=\"center\" CLASS=\"colortable_hex_out\" ID=\"custom_hex_out\"></td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;

         HTMLcode += "</table>" ;
      
      return HTMLcode ;
}

colortable.prototype.conversion_render = function()
{
      var HTMLcode = "<table WIDTH=\"360\" HEIGHT=\"90\"><tr><td HEIGHT=\"2\"></td></tr>" ;
      
          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\" HEIGHT=\"30\">" ;
          HTMLcode += "<table STYLE=\"font-family:arial;font-size:8pt;\">" ;

          HTMLcode += "<tr>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "<td>Red</td>" ;
          HTMLcode += "<td WIDTH=\"2\"></td>" ;
          HTMLcode += "<td><INPUT STYLE=\"font-size:8pt;\" ONKEYUP=\"javascript:clrtable.color_conversion();\" ID=\"clrtable_conversion_r\" TYPE=\"edit\" STYLE=\"border:1px solid #D7D7D7;width:32px;height:22px;text-align:center;background-color:white;padding:2px;\"></td>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;

          HTMLcode += "<td WIDTH=\"15\"></td>" ;
          HTMLcode += "<td>Green</td>" ;
          HTMLcode += "<td WIDTH=\"2\"></td>" ;
          HTMLcode += "<td><INPUT STYLE=\"font-size:8pt;\" ONKEYUP=\"javascript:clrtable.color_conversion();\" ID=\"clrtable_conversion_g\" TYPE=\"edit\" STYLE=\"border:1px solid #D7D7D7;width:32px;height:22px;text-align:center;background-color:white;padding:2px;\"></td>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;

          HTMLcode += "<td WIDTH=\"15\"></td>" ;
          HTMLcode += "<td>Blue</td>" ;
          HTMLcode += "<td WIDTH=\"2\"></td>" ;
          HTMLcode += "<td><INPUT STYLE=\"font-size:8pt;\" ONKEYUP=\"javascript:clrtable.color_conversion();\" ID=\"clrtable_conversion_b\" TYPE=\"edit\" STYLE=\"border:1px solid #D7D7D7;width:32px;height:22px;text-align:center;background-color:white;padding:2px;\"></td>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;

          HTMLcode += "<td WIDTH=\"25\"></td>" ;
          HTMLcode += "<td>Color</td>" ;
          HTMLcode += "<td WIDTH=\"2\"></td>" ;
          HTMLcode += "<td WIDTH=\"40\" ID=\"clrtable_conversion_color\"></td>" ;
          HTMLcode += "<td WIDTH=\"10\"></td>" ;
          HTMLcode += "</tr>" ;

          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          
          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\">" ;
          HTMLcode += "<table STYLE=\"font-family:arial;font-size:8pt;\">" ;
          
          var BKcolors = new Array();
              BKcolors.push( "#FAFAFA" ) ;
              BKcolors.push( "#F3F3F5" ) ;
              
          var BKlen = BKcolors.length, BK, ID ;
          
          for( var i = 0 ; i < this.IDS_ARRAY.length ; i++ )
          {
               BK = BKcolors[ i % BKlen ] ;
               ID = this.IDS_ARRAY[ i ].split( "@" ) ;
               HTMLcode += "<tr STYLE=\"background-color:"+BK+";\">" ;
               HTMLcode += "<td WIDTH=\"10\"></td>" ;
               HTMLcode += "<td VALIGN=\"top\">"+ID[0]+"</td>" ;
               HTMLcode += "<td WIDTH=\"30\"></td>" ;
               HTMLcode += "<td VALIGN=\"top\">"+ID[1]+"</td>" ;
               HTMLcode += "<td WIDTH=\"5\"></td>" ;
               HTMLcode += "<td WIDTH=\"50\" ID=\""+ID[0]+"_X\" STYLE=\"font-weight:bold;color:#545454;text-align:right;\"></td>" ;
               HTMLcode += "<td WIDTH=\"20\"></td>" ;
               HTMLcode += "<td VALIGN=\"top\">"+ID[2]+"</td>" ;
               HTMLcode += "<td WIDTH=\"5\"></td>" ;
               HTMLcode += "<td WIDTH=\"50\" ID=\""+ID[0]+"_Y\" STYLE=\"font-weight:bold;color:#545454;text-align:right;\"></td>" ;
               HTMLcode += "<td WIDTH=\"20\"></td>" ;
               HTMLcode += "<td VALIGN=\"top\">"+ID[3]+"</td>" ;
               HTMLcode += "<td WIDTH=\"5\"></td>" ;
               HTMLcode += "<td WIDTH=\"50\" ID=\""+ID[0]+"_Z\" STYLE=\"font-weight:bold;color:#545454;text-align:right;\"></td>" ;
               HTMLcode += "<td WIDTH=\"5\"></td>" ;
               HTMLcode += "</tr>" ;
          }

          
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          
          HTMLcode += "</table>" ;
      
      return HTMLcode ;
}

colortable.prototype.render = function()
{
     var CTRLid = this.containerID ;
         var CTRL = document.getElementById( CTRLid );
     if ( CTRL != null ) CTRL.innerHTML = "" ;
     
     var HTMLcode = "<table STYLE=\"font-family:arial;background-color:white;\">" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\" CLASS=\"colortable_caption\" HEIGHT=\"20\">" ;
         HTMLcode += "<table WIDTH=\"100%\" HEIGHT=\"20\">" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td STYLE=\"font-size:8pt;color:white;padding:3px;\">Color table</td>" ;
         HTMLcode += "<td " ;
         HTMLcode += "ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" " ;
         HTMLcode += "ONCLICK=\"javascript:hideCOLORTABLE();\" " ;
         HTMLcode += "WIDTH=\"16\" ALIGN=\"center\"><IMG TITLE=\"Close\" SRC=\""+this.path_to_img+"btns/close.icon.01.12x12.png\"></td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\" STYLE=\"background-color:#F7F7F7;\">" ;
         HTMLcode += "<table><tr><td HEIGHT=\"2\"></td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
         HTMLcode += "<tr>" ;
         
         if ( this.interface_mode >= 1 )
         {
             HTMLcode += "<td WIDTH=\"5\"></td>" ;
             HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" ONCLICK=\"javascript:COLORTABLEchangeinterface(1);\" CLASS=\"colortable_link\">Default</td>" ;
         }

         if ( this.interface_mode >= 2 )
         {
             HTMLcode += "<td WIDTH=\"12\"></td>" ;
             HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" ONCLICK=\"javascript:COLORTABLEchangeinterface(2);\" CLASS=\"colortable_link\">Custom</td>" ;
         }
         
         if ( this.interface_mode >= 3 )
         {
             HTMLcode += "<td WIDTH=\"12\"></td>" ;
             HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" ONCLICK=\"javascript:COLORTABLEchangeinterface(3);\" CLASS=\"colortable_link\">Conversion</td>" ;
         }
         
         HTMLcode += "</tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "<tr><td VALIGN=\"top\">" ;

     switch( this.interface_selector )
     {
          case 1: // default
              HTMLcode += this.default_render();
          break ;
          case 2: // custom
              HTMLcode += this.custom_render();
          break ;
          case 3: // conversion
              HTMLcode += this.conversion_render();
          break ;
     }
     

     HTMLcode += "</td></tr>" ;
     HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
     HTMLcode += "</table>" ;
         
     if ( CTRL != null ) CTRL.innerHTML = HTMLcode ;
}