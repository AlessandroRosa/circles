function isSPLASHscreenDISPLAYED() { return $("#DIALOGMODALdiv").get(0) != null ? ( $( "#DIALOGMODALdiv" ).prop( 'display' ) == "none" ? 0 : 1 ) : 0 ; }
function getViewportExtents() { return [ $(window).width(), $(window).height() ]; }
function getHTMLpageExtents() { return [ $(document).width(), $(document).height() ]; }
function getViewportScrollOffset() { return $('body').scrollTop() ; }
function getCTRLScrollOffset( _ctrl_id ) { return $('#'+_ctrl_id).scrollTop() ; }
function reload_page( _question )
{
    _question = safe_int( _question, 0 );
    var _ret = _question ? confirm( "Do you want to reload this page ?" ) : 1 ;
    if ( _ret ) window.location.reload();
}

function center_div( _div_id )
{
    if ( $("#"+_div_id).get(0) != null )
    {
        var divWIDTH = safe_int( $("#"+_div_id).width(), 0 ) ;
        var X = safe_int( ( ( getViewportExtents() )[0] - divWIDTH ) / 2, 0 ) ;
        $("#"+_div_id).css( "left", X ) ;
        return 1 ;
    }
    else return 0 ;
}

function move_div( _div_id, POS_X_STR, POS_Y_STR, DIVw, DIVh, _animate )
{
    safe_int( _animate, 1 );
    var DIV = $( "#"+_div_id ).get(0) ;
    if ( DIV != null )
    {
        POS_X_STR += "", POS_Y_STR += "" ;
        POS_X_STR = safe_string( POS_X_STR, "" ).toLowerCase() ;
        POS_Y_STR = safe_string( POS_Y_STR, "" ).toLowerCase() ;

        DIVw = safe_int( DIVw, 0 ), DIVh = safe_int( DIVh, 0 ) ;
       
        var dimsARRAY = getViewportExtents() ;
        var PAGEwidth = dimsARRAY[0], PAGEheight = dimsARRAY[1] ;
        var divWIDTH = DIVw > 0 ? DIVw : $("#"+_div_id).width();
        var divHEIGHT = DIVh > 0 ? DIVh : $("#"+_div_id).height();
        var X = 0, Y = 0, _menu_height = 48, _labels_height = 24 ;
            
        if ( POS_X_STR == "left" ) X = 4 ;
        else if ( POS_X_STR == "center" ) X = safe_int( ( PAGEwidth - divWIDTH ) / 2, 0 ) ;
        else if ( POS_X_STR == "right" ) X = safe_int( PAGEwidth - divWIDTH, 0 ) - 15 ;
        else X = safe_int( POS_X_STR, 0 );

        if ( POS_Y_STR == "top" ) Y = _menu_height ;
        else if ( POS_Y_STR == "center" ) Y = safe_int( ( PAGEheight - divHEIGHT ) / 2, 0 ) ;
        else if ( POS_Y_STR == "bottom" ) Y = safe_int( ( PAGEheight - divHEIGHT ), 0 ) - 15 ;
        else Y = safe_int( POS_Y_STR, 0 );
                
        X = safe_int( X, 0 ) ;
        if ( POS_X_STR.length > 0 )
        {
            if ( _animate ) $('#'+_div_id).animate( {'left':X+"px"}, "slow" );
            else DIV.style.left = X + "px" ;
        }

        if ( isNaN( Y ) ) Y = 0 ;
        if ( POS_Y_STR.length > 0 )
        {
            if ( _animate ) $('#'+_div_id).animate( {'top':Y+"px"}, "slow" );
            else DIV.style.top = Y + "px" ;  
        }
        
        return 1 ;
    }
    else return 0 ;
}

function set_opacity( _obj_id, val ) // input val is normalized in [0,1]
{
    val = Math.abs( safe_float( val ) ) ;
    val = ( val >= 0 && val <= 1 ) ? val : val / 100 ;
    $( "#" + _obj_id ).css( "opacity", val ) ;
}

function COVERdiv( bSHOW, zINDEX )
{
    var dimsARRAY = getHTMLpageExtents() ;
    var PAGEwidth = dimsARRAY[0], PAGEheight = dimsARRAY[1] ;
    if ( $( "#DIALOGcoverDIV" ).get(0) != null )
    {
        $( "#DIALOGcoverDIV" ).css( "display", bSHOW ? "block" : "none" ) ;
        $( "#DIALOGcoverDIV" ).width( PAGEwidth - 2 ) ;
        $( "#DIALOGcoverDIV" ).height( PAGEheight - 2 ) ;
        set_opacity( "DIALOGcoverDIV", 0.74 ) ;
        $( "#DIALOGcoverDIV" ).zIndex( ( bSHOW && zINDEX > 2 ) ? zINDEX - 2 : 0 ) ;
    }
}

function SPLASH( HTMLcode, bSHOW, SPLASHwidth, SPLASHheight, zINDEX, SPLASHtop )
{
    if ( SPLASHtop == null ) SPLASHtop = -1 ;
      
    SPLASHwidth = SPLASHwidth == "auto" ? SPLASHwidth : safe_int( SPLASHwidth, 0 );
    SPLASHheight = SPLASHheight == "auto" ? SPLASHheight : safe_int( SPLASHheight, 0 );
    zINDEX = safe_int( zINDEX, 0 );
    if ( zINDEX == 0 ) zINDEX = 140 ;
      
    var VIEWPORTdimsARRAY = getViewportExtents() ;
    var dimsARRAY = getHTMLpageExtents() ;
    var PAGEwidth = dimsARRAY[0], PAGEheight = dimsARRAY[1] ;
    var VIEWPORTPAGEwidth = VIEWPORTdimsARRAY[0], VIEWPORTPAGEheight = VIEWPORTdimsARRAY[1] ;
    _old_body_overflow_css = document.body.style.overflow ;

    var DIALOGMODALdiv = $( "#DIALOGMODALdiv" ).get(0) ;
    var DIALOGMODALdivCONTAINER = $( "#DIALOGMODALdivCONTENTS" ).get(0) ;
    if ( bSHOW && PAGEwidth > 0 && PAGEheight > 0 &&
         VIEWPORTPAGEwidth > 0 && VIEWPORTPAGEheight > 0 )
    {
        document.body.style.overflow = "hidden" ;
        COVERdiv( bSHOW, zINDEX ) ;

        if ( DIALOGMODALdiv != null && DIALOGMODALdivCONTAINER != null )
        {
           DIALOGMODALdivCONTAINER.innerHTML = HTMLcode ;
           DIALOGMODALdiv.style.width = SPLASHwidth == "auto" ? SPLASHwidth : SPLASHwidth + "px" ;
           DIALOGMODALdiv.style.height = SPLASHheight == "auto" ? SPLASHheight : SPLASHheight + "px" ;
           var DIVwidth = safe_int( DIALOGMODALdiv.style.width, 0 ) ;
           var DIVheight = safe_int( DIALOGMODALdiv.style.height, 0 ) ;
              
           DIALOGMODALdiv.style.left = ( SPLASHheight == "auto" ? ( ( VIEWPORTPAGEwidth - 400 ) / 2 ) : ( ( VIEWPORTPAGEwidth - DIVwidth ) / 2 ) ) + "px" ;
           if ( SPLASHtop == -1 )
           {
              var ScrollTop = getViewportScrollOffset() ;
              DIALOGMODALdiv.style.top = ( ScrollTop + ( SPLASHheight == "auto" ? ( ( VIEWPORTPAGEheight - 300 ) / 2 ) : ( ( VIEWPORTPAGEheight - DIVheight ) / 2 ) ) ) + "px" ;
           }
           else
           {
              window.scrollTo(0, SPLASHtop - 30 );
              DIALOGMODALdiv.style.top = SPLASHtop + "px" ;
           }
              
           DIALOGMODALdiv.style.display = "block" ;
           DIALOGMODALdiv.style.zIndex = zINDEX + 1 ;
           center_div( "DIALOGMODALdiv" );
        }
      }
      else if ( !bSHOW )
      {
          COVERdiv( bSHOW, 0 ) ;
          if ( DIALOGMODALdiv != null ) DIALOGMODALdiv.style.display = "none" ;
          document.body.style.overflow = _old_body_overflow_css ;
      }
}

function SPLASHanimated( HTMLcode, bSHOW, SPLASHwidth, SPLASHheight, zINDEX, SPLASHtop )
{
		SPLASHtop = safe_int( SPLASHtop, -1 ) ;
    SPLASHwidth = SPLASHwidth == "auto" ? SPLASHwidth : safe_int( SPLASHwidth, 0 );
    SPLASHheight = SPLASHheight == "auto" ? SPLASHheight : safe_int( SPLASHheight, 0 );
    zINDEX = safe_int( zINDEX, 0 );     if ( zINDEX == 0 ) zINDEX = 140 ;
      
    var VIEWPORTdimsARRAY = getViewportExtents() ;
    var dimsARRAY = getHTMLpageExtents() ;
    var PAGEwidth = dimsARRAY[0], PAGEheight = dimsARRAY[1] ;
    var VIEWPORTPAGEwidth = VIEWPORTdimsARRAY[0], VIEWPORTPAGEheight = VIEWPORTdimsARRAY[1] ;

    _old_body_overflow_css = document.body.style.overflow ;

    var DIALOGMODALdiv = $( "#DIALOGMODALdiv" ).get(0) ;
    var DIALOGMODALdivCONTAINER = $( "#DIALOGMODALdivCONTENTS" ).get(0) ;
    if ( bSHOW && PAGEwidth > 0 && PAGEheight > 0 && VIEWPORTPAGEwidth > 0 && VIEWPORTPAGEheight > 0 )
    {
       document.body.style.overflow = "hidden" ;
       COVERdiv( bSHOW, zINDEX ) ;
       $( "#DIALOGMODALdivCONTENTS" ).html( HTMLcode ) ;
       $( "#DIALOGMODALdiv" ).width( SPLASHwidth == "auto" ? SPLASHwidth : SPLASHwidth + "px" ) ;
       $( "#DIALOGMODALdiv" ).height( SPLASHheight == "auto" ? SPLASHheight : SPLASHheight + "px" ) ;
       var DIVwidth = $( "#DIALOGMODALdiv" ).width(), DIVheight = $( "#DIALOGMODALdiv" ).width() ;
       var ScrollTop = getViewportScrollOffset() ;
                          
       DIALOGMODALdiv.style.left = ( SPLASHheight == "auto" ? ( ( VIEWPORTPAGEwidth - 400 ) / 2 ) : ( ( VIEWPORTPAGEwidth - DIVwidth ) / 2 ) ) + "px" ;
       DIALOGMODALdiv.style.top = ( ScrollTop + ( SPLASHheight == "auto" ? ( ( VIEWPORTPAGEheight - 300 ) / 2 ) : ( ( VIEWPORTPAGEheight - DIVheight ) / 2 ) ) ) + "px" ;
       DIALOGMODALdiv.style.zIndex = zINDEX + 1 ;
       center_div( "DIALOGMODALdiv" );
        
       $("#DIALOGMODALdiv").fadeIn("slow") ;

       if ( SPLASHtop == -1 )
       {
          var ScrollTop = getViewportScrollOffset() ;
          DIALOGMODALdiv.style.top = ( ScrollTop + ( SPLASHheight == "auto" ? ( ( VIEWPORTPAGEheight - 300 ) / 2 ) : ( ( VIEWPORTPAGEheight - DIVheight ) / 2 ) ) ) + "px" ;
       }
       else
       {
					if ( SPLASHtop > VIEWPORTPAGEheight ) window.scrollTo(0, SPLASHtop - 30 );
          DIALOGMODALdiv.style.top = SPLASHtop + "px" ;
       }
    }
    else if ( !bSHOW )
    {
				$("#DIALOGMODALdiv").fadeOut("slow") ;
        COVERdiv( bSHOW, 0 ) ;
        document.body.style.overflow = _old_body_overflow_css ;
		}
}