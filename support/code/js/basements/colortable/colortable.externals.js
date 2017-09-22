var _glob_colortableOFFSETx = 0 ;
var _glob_colortableOFFSETy = 0 ;

function getViewportExtents()
{
    var intH = 0, intW = 0 ;
    if( self.innerHeight )
    {
       intH = window.innerHeight;
       intW = window.innerWidth;
    } 
    else
    {
        if(document.documentElement && document.documentElement.clientHeight)
        {
            intH = document.documentElement.clientHeight;
            intW = document.documentElement.clientWidth;
        }
        else
        {
            if( document.body )
            {
                intH = document.body.clientHeight;
                intW = document.body.clientWidth;
            }
        }
    }

    return [ intW, intH ];
}

function displayCOLORTABLE( _inputCTRLid, inputCOLORid, _on_select_color_fn, _on_show_table_fn )
{
    var _pos_chunk = $( "#" + _inputCTRLid ).offset();
    var top = safe_int( _pos_chunk['top'], 0 ) + $(window).scrollTop() ;
    var left = safe_int( _pos_chunk['left'], 0 ) + $(window).scrollLeft() ;
    clrtable.setRETURNctrlID( inputCOLORid );
    var colortableDIV = document.getElementById( "colortableDIV" ) ;
    if ( colortableDIV != null )
    {
        var viewportDIMS = getViewportExtents() ;
     
        var sW = viewportDIMS[0], sH = viewportDIMS[1] ;
        var l = parseInt( left, 10), t = parseInt( top, 10 );
          
        var colortableWIDTH = parseInt( colortableDIV.style.width ) + 25 ;
        var colortableHEIGHT = parseInt( colortableDIV.style.height ) ;

        var newLEFT = ( l + colortableWIDTH ) > sW ? ( sW - colortableWIDTH ) : l ;
      
        var newTOP = t % sH ; // it maps Y coordinate to the viewport as if left/top corner is 0,0
        newTOP = ( newTOP + colortableHEIGHT ) > sH ? ( sH - colortableHEIGHT ) : t ;
          
        colortableDIV.style.zIndex = 10001 ;
        colortableDIV.style.display = "block" ;
        colortableDIV.style.top = ( newTOP + _glob_colortableOFFSETy ) + "px" ;
        colortableDIV.style.left = ( newLEFT + _glob_colortableOFFSETx ) + "px" ;
        colortableDIV.style.border = "1px solid #D0D0D0" ;
        
        if ( typeof _on_select_color_fn === "function" ) clrtable.setHANDLERonselectcolor( _on_select_color_fn ) ;
        if ( typeof _on_show_table_fn === "function" ) _on_show_table_fn.call( this );
    }
}

function hideCOLORTABLE()
{
    var colortableDIV = document.getElementById( "colortableDIV" ) ;
    if ( colortableDIV != null ) colortableDIV.style.display = "none" ;
}

function COLORTABLEchangeinterface( i ) { clrtable.select_interface( i ); }