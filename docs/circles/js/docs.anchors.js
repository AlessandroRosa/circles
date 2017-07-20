function anchorOVER( label, w, h )
{
      w = ( w == null || w == UNDEF ) ? 200 : parseInt( w, 10 ) ; 
      h = ( h == null || h == UNDEF ) ? 200 : parseInt( h, 10 ) ; 

      var _page_x = event.pageY, _page_y = event.pageY ;
      var x = window.event.clientX, y = window.event.clientY ;
      var _html = anchorDEF( label ) ;

      var xWithScroll = $("#contentsdiv").width() ;
      var yWithScroll = $("#contentsdiv").height() ;
      
      var _div_height = h ;
      var _div_width = w ;
      
      if ( ( x + _div_width ) > xWithScroll * 0.9 ) x -= _div_width * 0.8 ;
      if ( ( y + _div_height ) > yWithScroll * 0.9 ) y -= _div_height * 1.1 ;
      
      var _div = document.getElementById( "docsdiv" );
          if ( _div != null )
          {
              _div.style.left = x + "px" ;
              _div.style.top = y + "px" ;
              _div.style.backgroundColor = "white" ;
              _div.style.padding = "3px" ;
              _div.style.zIndex = 2 ;
              _div.setAttribute( "class", "general_rounded_corners" );
              
              _div.innerHTML = _html ;
              _div.style.width = _div_width + "px" ;
              _div.style.height = "auto" ;
              _div.style.overflow = "auto" ;
              _div.style.display = "block" ;
              _div.focus();
          }
}

function anchorOUT()
{
      var _div = document.getElementById( "docsdiv" );
          if ( _div != null ) _div.style.display = "none" ;
}

function anchorOVERimg( imgid, w )
{
      w = ( w == null || w == UNDEF ) ? 200 : parseInt( w, 10 ) ; 

      var _page_x = event.pageY, _page_y = event.pageY ;
      var x = window.event.clientX, y = window.event.clientY ;

      var xWithScroll = $("#contentsdiv").width() ;
      var yWithScroll = $("#contentsdiv").height() ;
      
      var _viewport_dims = getViewportExtents();
      var _mid_x = _viewport_dims[0] / 2 ;
      var _mid_y = _viewport_dims[1] / 2 ;
      
      var _div_width = w ;
      
      if ( ( x + _div_width ) > xWithScroll * 0.9 ) x -= _div_width * 0.8 ;
      
      var _div = document.getElementById( "docsdiv" );
      var _img = document.getElementById( imgid );
      
          if ( _div != null && _img != null )
          {
              var _htmlcode = "<table valign=\"top\">" ;
                  _htmlcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                  _htmlcode += "<tr><td ALIGN=\"right\" STYLE=\"cursor:pointer;\" ONCLICK=\"javascript:anchorOUT();\">Close Window</td></tr>" ;
                  _htmlcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                  _htmlcode += "<tr><td ALIGN=\"center\"><IMG ALIGN=\"center\" CLASS=\"zoomed\" SRC=\""+_img.src+"\" WIDTH=\""+(_div_width-20)+"\"></td></tr>" ;
                  _htmlcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                  _htmlcode += "</table>" ;
          
              _div.style.left = ( _mid_x - w / 2 ) + "px" ;
              _div.style.top = y + "px" ;
              _div.style.backgroundColor = "white" ;
              _div.style.border = "1px dotted #C0C0C0" ;
              _div.style.padding = "3px" ;
              _div.style.zIndex = 2 ;
              
              _div.innerHTML = _htmlcode ;
              _div.style.width = _div_width + "px" ;
              _div.style.height = "auto" ;
              _div.style.overflow = "auto" ;
              _div.style.display = "block" ;
              _div.focus();
          }
}

function anchorDEF( label )
{
      var _html = "" ;

          _html = "<table CLASS=\"docsinfo\" valign=\"top\" ALIGN=\"center\">" ;
          _html += "<tr><td HEIGHT=\"2\"></td></tr>" ;
      switch( label )
      {
            case "attractor#01":
            _html += "<tr><td CLASS=\"docslabel\">Attractor (IFS)</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td CLASS=\"docslabel\"><A CLASS=\"info\" TARGET=\"_blank\" HREF=\"http://en.wikipedia.org/wiki/Attractor\">Open this link</A></td></tr>" ;
            break ;
            case "earlydays#01":
            _html += "<tr><td CLASS=\"docslabel\">Early days in complex dynamics</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\"><IMG SRC=\"../docs/pix/circles/docs.pix.05.png\"></td></tr>" ;
            break ;
            case "fricke":
            _html += "<tr><td CLASS=\"docslabel\">Robert Fricke (1861-1930)</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\"><IMG SRC=\"../docs/pix/basic.terminology/fricke.png\"></td></tr>" ;
            break ;
            case "fuchs":
            _html += "<tr><td CLASS=\"docslabel\">Lazarus Fuchs (1833-1902)</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\"><IMG SRC=\"../docs/pix/basic.terminology/fuchs.png\"></td></tr>" ;
            break ;
            case "grammar#01":
            _html += "<tr><td CLASS=\"docslabel\">Letters</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\">Or the generators.<br>Letter is a indecomposible element anyway.<br>Does there exist a prime Mobius Map? Or is there some sort of infinite genealogy tree of Kleinian groups?</td></tr>" ;
            break ;
            case "grammar#02":
            _html += "<tr><td CLASS=\"docslabel\">Alphabet</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\">The collection of all letters.</td></tr>" ;
            break ;
            case "grammar#03":
            _html += "<tr><td CLASS=\"docslabel\">Words</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\">Any nth-length composition of letters.</td></tr>" ;
            break ;
            case "grammar#04":
            _html += "<tr><td CLASS=\"docslabel\">Dictionary</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\">The collections of all words (those making sense).</td></tr>" ;
            break ;
            case "grammar#05":
            _html += "<tr><td CLASS=\"docslabel\">Language and Memory</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\">People with low memory use almost often the same words. Whereas high memory minds can use longer set of words: joint to a cultural basis, this renders sentences more meaningful and precise.</td></tr>" ;
            break ;
            case "hausdorff":
            _html += "<tr><td CLASS=\"docslabel\">Felix Hausdorff (1868-1942)</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td CLASS=\"docslabel\"><IMG SRC=\"../docs/pix/basic.terminology/hausdorff.png\"></td></tr>" ;
            break ;
            case "ifs#01":
            _html += "<tr><td CLASS=\"docslabel\">Iterated Functions systems</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td CLASS=\"docslabel\"><A CLASS=\"info\" TARGET=\"_blank\" HREF=\"http://en.wikipedia.org/wiki/Iterated_function_system\">Open this link</A></td></tr>" ;
            break ;
            case "inversion#01":
            _html += "<tr><td CLASS=\"docslabel\">(Complex) Inversion</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\">When a,d = 0, b,c <> 0, Mobius maps turn upside down the Riemann sphere: the origin and the point at infinity swap.</td></tr>" ;
            break ;
            case "iteration#01":
            _html += "<tr><td CLASS=\"docslabel\">Iteration</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\">Iterating a function refers to its repeated application, so that the returning output value is applied to input again the same function for the next stage, over and over again.</td></tr>" ;
            break ;
            case "klein":
            _html += "<tr><td CLASS=\"docslabel\">Felix Klein (1849-1925)</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\"><IMG SRC=\"../docs/pix/basic.terminology/klein.png\"></td></tr>" ;
            break ;
            case "kleiniangroup#01":
            _html += "<tr><td CLASS=\"docslabel\">Kleinian group</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td>The number of elements into a Kleinian group is often infinite (recall that &lsquo;infinite&rsquo; does not mean that &lsquo;countless&rsquo; for mathematicians)</td></tr>" ; 
            break ;
            case "kleiniangroup#02":
            _html += "<tr><td CLASS=\"docslabel\">Draw or compute ?</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td>This is a sort of classification, which really exists in the history of Kleinian groups and can be regarded as the (early) geometric and (later) arithmetic approach respectively.</td></tr>" ; 
            break ;
            case "mobiusmaps#01":
            _html += "<tr><td CLASS=\"docslabel\">Mobius Map</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\">Also defined linear fractional (LFT) or homographic transformations</td></tr>" ;
            break ;
            case "riemannsphere#01":
            _html += "<tr><td CLASS=\"docslabel\">Riemann sphere</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\">It is a model of the extended complex plane, i.e. the complex plane plus the point at infinity.</td></tr>" ;
            _html += "<tr><td HEIGHT=\"8\"></td></tr>" ;
            _html += "<tr><td><IMG SRC=\"../docs/pix/basic.terminology/docs.pix.04.png\"></td></tr>" ;
            break ;
            case "poincare":
            _html += "<tr><td CLASS=\"docslabel\">Henri Poincar&eacute; (1854-1912)</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\"><IMG SRC=\"../docs/pix/basic.terminology/poincare.png\"></td></tr>" ;
            break ;
            case "schottky":
            _html += "<tr><td CLASS=\"docslabel\">Friedrich Schottky (1851-1935)</td></tr>" ;
            _html += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            _html += "<tr><td VALIGN=\"top\"><IMG SRC=\"../docs/pix/basic.terminology/schottky.png\"></td></tr>" ;
            break ;
            // construct HTMLcode to fill the div in
      }
            _html += "<tr><td HEIGHT=\"2\"></td></tr>" ;
            _html += "</table>" ;
      
      return _html ;
}