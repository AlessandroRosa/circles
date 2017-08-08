if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

var ALERT_IMGFOLDER_PATH = "" ;
var ALERT_BODY_OVERFLOW_OLD = "" ;

var ALERT_OK = 1 ;
var ALERT_CANCEL = 2 ;
var ALERT_YES = 3 ;
var ALERT_NO = 4 ;

var ALERT_OK_LABEL = "OK" ;
var ALERT_CANCEL_LABEL = "Cancel" ;
var ALERT_YES_LABEL = "Yes" ;
var ALERT_NO_LABEL = "No" ;

var ALERT_OK_FN = "" ;
var ALERT_CANCEL_FN = "" ;
var ALERT_YES_FN = "" ;
var ALERT_NO_FN = "" ;
var ALERT_ONCLOSE_FN = "" ;

var ALERT_SUCCESS = 1 ;
var ALERT_YESNO = 2 ;
var ALERT_YESNOCANCEL = 4 ;
var ALERT_OKCANCEL = 8 ;
var ALERT_WARNING = 16 ;
var ALERT_QUESTION = 32 ;
var ALERT_CRITICAL = 64 ;
var ALERT_NOBUTTON = 128 ;
var ALERT_ONCLOSE = 256 ;
var ALERT_NOICON = 512 ;
var ALERT_NOCAPTION = 1024 ;
var ALERT_INFO = 2048 ;
var ALERT_HELP = 4096 ;
var ALERT_ERROR = 8192 ;
var ALERT_HALT = 16384 ;

var ALERT_RET_VALUE = 0 ;

var ALERT_FONTSIZE = 8 ;
var ALERT_DEFAULT_WIDTH = 460 ;
var ALERT_DEFAULT_ZINDEX = 4000 ;
var ALERT_BTNS_WIDTH = "auto" ;
var ALERT_DEFAULT_BTNS_HEIGHT = "26" ;
var ALERT_CURRENT_DISPLAY_FLAG = 0 ;

function alert_get_btns_width() { return ALERT_BTNS_WIDTH ; }
function alert_get_value()   { return ALERT_RET_VALUE ; }
function alert_set_btns_width( _w ) { ALERT_BTNS_WIDTH = ( _w == null || _w == "undefined" ) ? "auto" : ( _w + "" ).replaceAll( [ "px", "pt" ], "" ) ; }

function alert_set_imgfolder_path( path ) { ALERT_IMGFOLDER_PATH = path ; }

function alert_plug_label( labelid, label )
{
    switch( labelid )
    {
       case ALERT_OK : ALERT_OK_LABEL = label ; break ;
       case ALERT_CANCEL : ALERT_CANCEL_LABEL = label ; break ;
       case ALERT_YES : ALERT_YES_LABEL = label ; break ;
       case ALERT_NO : ALERT_NO_LABEL = label ; break ;
    }
}

function alert_enable_btn( btnid, enable )
{
    var _btn = $( "#"+btnid ).get(0) ;
    if ( _btn != null ) _btn.disabled = !enable ;
}

function alert_plug_fn( btnid, fn )
{
    switch( btnid )
    {
       case ALERT_HALT:
       case ALERT_CRITICAL:
       case ALERT_SUCCESS:
            ALERT_OK_FN = fn ;
       break ;
       case ALERT_CANCEL:
            ALERT_CANCEL_FN = fn ;
       break ;
       case ALERT_YES:
            ALERT_YES_FN = fn ;
       break ;
       case ALERT_NO:
            ALERT_NO_FN = fn ;
       break ;
       case ALERT_YESNO:
            ALERT_YESNO_FN = fn ;
       break ;
       case ALERT_YESNOCANCEL:
            ALERT_YESNOCANCEL_FN = fn ;
       break ;
       case ALERT_OKCANCEL:
            ALERT_OKCANCEL_FN = fn ;
       break ;
       case ALERT_ONCLOSE:
            ALERT_ONCLOSE_FN = fn ;
       break ;
       default:
       break ;
    }
}

function alert_reset_labels()
{
    ALERT_OK_LABEL = "OK" ;
    ALERT_CANCEL_LABEL = "Cancel" ;
    ALERT_YES_LABEL = "Yes" ;
    ALERT_NO_LABEL = "No" ;
}

function alert_reset_fn()
{
    ALERT_OK_FN = "" ;
    ALERT_CANCEL_FN = "" ;
    ALERT_YES_FN = "" ;
    ALERT_NO_FN = "" ;
    ALERT_YESNO_FN = "" ;
    ALERT_YESNOCANCEL_FN = "" ;
    ALERT_OKCANCEL_FN = "" ;
    ALERT_BTNS_WIDTH = "auto" ;
}

function alert_msg( mode, MSG, CAPTION, candidateW, candidateH, ICON, ICONwidth, TOP )
{
    if ( CAPTION == null ) CAPTION = "" ;
    if ( ICONwidth == null ) ICONwidth = 0 ;
    if ( TOP == null ) TOP = -1 ;
      
    var _viewport_h = $(window).height() ;

    mode = safe_int( mode, ALERT_SUCCESS );
    candidateW = safe_int( candidateW, 0 ), candidateH = safe_int( candidateH, 0 );
      
    ALERT_FONTSIZE = $(window).width() > 1100 ? 13 : 8 ;
    ALERT_DEFAULT_WIDTH = $(window).width() > 1100 ? 520 : 420 ;
    var W = candidateW > 0 ? candidateW : ALERT_DEFAULT_WIDTH, H = ( candidateH > 0 ) ? candidateH : "auto" ;
    if ( is_string( MSG ) )
    {
        MSG = MSG.replaceAll( [ "\r\n", "\n", "<br/>", "<br />" ], "<br>" );
        var _div_h = 0, _rows = MSG.count( "<br>" ) ;
        if ( H == "auto" )
        {
            if ( _rows > 0 && Math.ceil( _viewport_h / _rows ) < 15 ) _div_h = _viewport_h - 100 ;
            else _div_h = "auto" ;
        }
        else _div_h = Math.min( 250, _viewport_h );
				MSG = "<DIV STYLE=\"position:relative;padding2px;width:auto;height:"+_div_h+";overflow:auto;\">"+MSG+"</DIV>" ;
    }

    var ICONSIZE = "16x16", ICONWIDTH = 48 ;
    var ALERTICON = "", ALERTBTNS = "", ALERTiconSIZE = "64x64", ALERTbtnSIZE = "60" ;
    var EXTRAheight = 100 ; // this is the sum of caption height + button height + blank rows
      
    var BKCOLORclass = "" ;
    if ( mode & ALERT_HALT || mode & ALERT_CRITICAL || mode & ALERT_ERROR ) BKCOLORclass = "alert_error" ;
    else if ( mode & ALERT_SUCCESS ) BKCOLORclass = "alert_success" ;
    else if ( mode & ALERT_WARNING ) BKCOLORclass = "alert_warning" ;
    else if ( mode & ALERT_QUESTION ) BKCOLORclass = "alert_question" ;
    else if ( mode & ALERT_INFO ) BKCOLORclass = "alert_info" ;
    else if ( mode & ALERT_HELP ) BKCOLORclass = "alert_help" ;
    else BKCOLORclass = "alert_error" ;

    var _caption_colspan = 3 ;
    if ( mode == -1 || ( mode & ALERT_NOICON ) == 0 ) _caption_colspan += 2 ;
      
    if ( ICONWIDTH == 0 ) ICONWIDTH = 48 ;
    ICONWIDTH += 16 ; 

    var HTMLcode = "<table BORDER=\"0\" STYLE=\"padding:1px;\" "+( ( W > 0 ) ? "WIDTH=\""+W+"\"" : "" )+">" ;
    var bCAPTION = ( mode == ALERT_ERROR || ( mode & ALERT_NOCAPTION ) == 0 ) ? 1 : 0 ;
    if ( bCAPTION )
    {
        HTMLcode += "<tr>" ;
        HTMLcode += "<td HEIGHT=\"24\" COLSPAN=\""+_caption_colspan+"\" CLASS=\""+BKCOLORclass+"\" WIDTH=\""+W+"\">" ;
        HTMLcode += "<table BORDER=\"0\" WIDTH=\""+W+"\" STYLE=\"padding:2px;\">" ;
        HTMLcode += "<tr><td COLSPAN=\"4\" HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"8\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\" STYLE=\"color:white;\">"+( CAPTION.length > 0 ? "<b>"+CAPTION+"</b>" : "" )+"<td>" ;
        HTMLcode += "<td VALIGN=\"top\" WIDTH=\"16\" ALIGN=\"center\" ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" ONCLICK=\"javascript:"+ALERT_ONCLOSE_FN+";alertCLOSE();\"><IMG TITLE=\"Close\" SRC=\"%imgpath%icons/close/close.icon.01."+ICONSIZE+".png\"></td>" ;
        HTMLcode += "<td WIDTH=\"8\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"4\" HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td COLSPAN=\""+_caption_colspan+"\" HEIGHT=\"6\"></td></tr>" ;
    }
          
    // contents
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"12\"></td>" ;

    if ( mode == -1 || ( mode & ALERT_NOICON ) == 0 )
    {
        HTMLcode += "<td "+( ICONWIDTH > 0 ? "WIDTH=\""+ICONWIDTH+"\"" : "" )+" VALIGN=\"top\">%alerticon%</td>" ;
        HTMLcode += "<td WIDTH=\"12\" VALIGN=\"top\"></td>" ;
    }
    else HTMLcode += "<td COLSPAN=\"2\" WIDTH=\"0\"></td>" ;

    if ( H == "auto" ) HTMLcode += "<td VALIGN=\"top\" STYLE=\"font-size:"+safe_int(ALERT_FONTSIZE,8)+"pt;\">"+MSG+"</td>" ;
    else
    {
        var CONTENTS_WIDTH = W - ICONWIDTH - 12 ;
        HTMLcode += "<td VALIGN=\"top\" WIDTH=\""+CONTENTS_WIDTH+"\" HEIGHT=\""+( ( H == "auto" ) ? H : ( H - EXTRAheight ) )+"\">" ;
        HTMLcode += "<DIV STYLE=\"position:relative;font-size:"+safe_int(ALERT_FONTSIZE,8)+"pt;width:"+( CONTENTS_WIDTH > 0 ? CONTENTS_WIDTH + "px" : "98%" )+";height:"+( ( H - EXTRAheight ) + "px" )+";overflow:auto;padding:2px;\">"+MSG+"</DIV>" ;
        HTMLcode += "</td>" ;
    }
          
    HTMLcode += "<td WIDTH=\"12\"></td>" ;
    HTMLcode += "</tr>" ;
          
    HTMLcode += "<tr><td COLSPAN=\"5\" HEIGHT=\"20\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"12\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\" ALIGN=\"center\" COLSPAN=\"3\">" ;
    HTMLcode += "<table BORDER=\"0\" ALIGN=\"center\" WIDTH=\""+( W > 0 ? ( W - 30 ) + "px" : "100%" )+"\">%alertbtns%</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "<td WIDTH=\"12\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td COLSPAN=\""+_caption_colspan+"\" HEIGHT=\"12\">&nbsp;</td></tr>" ;
    HTMLcode += "</table>" ;

    if ( ALERT_OK_FN.length == 0 ) ALERT_OK_FN += "alertCLOSE();" ;
    if ( mode & ALERT_ERROR )
    {
       var ICONindex = randomFromTo( 1, 2 ) ;
       ICONindex = ( ICONindex < 10 ) ? "0" + ICONindex : ICONindex ;

       ALERTICON = "<IMG SRC=\"%imgpath%icons/bad/bad."+ICONindex+"."+ALERTiconSIZE+".png\">" ;
       ALERTBTNS = "<tr><td ALIGN=\"center\"><INPUT ID=\"alertDEFAULTbtn\" ALIGN=\"center\" TYPE=\"button\" CLASS=\"alert_btn\" VALUE=\"Close\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_ERROR;"+ALERT_OK_FN+";\"></td></tr>" ;
    }
    else if ( mode & ALERT_HALT )
    {
       if ( ALERT_OK_FN.length == 0 ) ALERT_OK_FN += "alertCLOSE();" ;

       ALERTICON = "<IMG SRC=\"%imgpath%icons/halt/halt.icon.01."+ALERTiconSIZE+".png\">" ;
       ALERTBTNS = "<tr><td ALIGN=\"center\"><INPUT ID=\"alertDEFAULTbtn\" ALIGN=\"center\" TYPE=\"button\" CLASS=\"alert_btn\" VALUE=\"Close\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_HALT;"+ALERT_OK_FN+";\"></td></tr>" ;
    }
    else if ( mode & ALERT_CRITICAL )
    {
       if ( ALERT_OK_FN.length == 0 ) ALERT_OK_FN += "alertCLOSE();" ;

       ALERTICON = "<IMG SRC=\"%imgpath%icons/stop/stop.icon."+ALERTiconSIZE+".png\">" ;
       ALERTBTNS = "<tr><td ALIGN=\"center\"><INPUT ID=\"alertDEFAULTbtn\" ALIGN=\"center\" TYPE=\"button\" CLASS=\"alert_btn\" VALUE=\"Close\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_CRITICAL;"+ALERT_OK_FN+";\"></td></tr>" ;
    }
    else if ( mode & ALERT_HELP )
    {
       if ( ALERT_OK_FN.length == 0 ) ALERT_OK_FN += "alertCLOSE();" ;

       ALERTICON = "<IMG SRC=\"%imgpath%icons/help/help.icon.01."+ALERTiconSIZE+".png\">" ;
       ALERTBTNS = "<tr><td ALIGN=\"center\"><INPUT ID=\"alertDEFAULTbtn\" ALIGN=\"center\" TYPE=\"button\" CLASS=\"alert_btn\" VALUE=\"Close\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_HELP;"+ALERT_OK_FN+";\"></td></tr>" ;
    }
    else if ( mode & ALERT_INFO )
    {
       if ( ALERT_OK_FN.length == 0 ) ALERT_OK_FN += "alertCLOSE();" ;

       ALERTICON = "<IMG SRC=\"%imgpath%icons/info/info.icon.01."+ALERTiconSIZE+".png\">" ;
       ALERTBTNS = "<tr><td ALIGN=\"center\"><INPUT ID=\"alertDEFAULTbtn\" ALIGN=\"center\" TYPE=\"button\" CLASS=\"alert_btn\" VALUE=\"Close\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_INFO;"+ALERT_OK_FN+";\"></td></tr>" ;
    }
    else
    {
       if ( ICON != null ) ALERTICON = "<IMG SRC=\"%imgpath%"+ICON+"\">" ;
       else
       {
           if ( mode & ALERT_QUESTION ) ALERTICON = "<IMG SRC=\"%imgpath%icons/questionmark/question.mark.icon.01."+ALERTiconSIZE+".png\">" ;
           else if ( mode & ALERT_WARNING )
           {
               var ALERTiconSIZE = "64x64" ;
               ALERTICON = "<IMG SRC=\"%imgpath%icons/exclamation/exclamation.01.icon."+ALERTiconSIZE+".png\">" ;
               ALERTBTNS = "<tr><td ALIGN=\"center\"><INPUT ID=\"alertDEFAULTbtn\" ALIGN=\"center\" TYPE=\"button\" CLASS=\"alert_btn\" VALUE=\"Close\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_WARNING;"+ALERT_OK_FN+";\"></td></tr>" ;
           }
           else if ( mode & ALERT_SUCCESS )
           {
               var ICONindex = randomFromTo( 2, 3 ) ;
               ICONindex = ( ICONindex < 10 ) ? "0" + ICONindex : ICONindex ;
               ALERTICON = "<IMG SRC=\"%imgpath%icons/ok/ok."+ICONindex+"."+ALERTiconSIZE+".png\">" ;
               ALERTBTNS = "<tr><td ALIGN=\"center\"><INPUT ID=\"alertDEFAULTbtn\" ALIGN=\"center\" TYPE=\"button\" CLASS=\"alert_btn\" VALUE=\""+ALERT_OK_LABEL+"\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_OK;"+ALERT_OK_FN+";\"></td></tr>" ;
           }
                  
           if ( mode & ALERT_NOBUTTON ) ALERTBTNS = "" ;
       }
    }
          
    if ( ( ( mode & ALERT_SUCCESS ) == 0 ) &&
         ( ( mode & ALERT_YESNO ) == 0 ) &&
         ( ( mode & ALERT_YESNOCANCEL ) == 0 ) &&
         ( ( mode & ALERT_OKCANCEL ) == 0 ) &&
         ALERT_NOBUTTON == 0
       ) mode = ALERT_SUCCESS ;

    if ( mode & ALERT_YESNO )
    {
       ALERTBTNS = "<tr>" ;
       ALERTBTNS += "<td ALIGN=\"center\"><INPUT VALUE=\""+ALERT_YES_LABEL+"\" TYPE=\"button\" CLASS=\"alert_btn\" ID=\"alertYESbtn\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_YES;"+( ( ALERT_YES_FN.length > 0 ) ? ALERT_YES_FN + ";" : "" )+"\"></td>" ;
       ALERTBTNS += "<td WIDTH=\"40\"></td>" ;
       ALERTBTNS += "<td ALIGN=\"center\"><INPUT VALUE=\""+ALERT_NO_LABEL+"\" TYPE=\"button\" CLASS=\"alert_btn\" ID=\"alertNObtn\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_NO;"+( ( ALERT_NO_FN.length > 0 ) ? ALERT_NO_FN + ";" : "" )+"\"></td>" ;
       ALERTBTNS += "</tr>" ;
    }
    else if ( mode & ALERT_YESNOCANCEL )
    {
       ALERTBTNS = "<tr>" ;
       ALERTBTNS += "<td ALIGN=\"center\"><INPUT VALUE=\""+ALERT_YES_LABEL+"\" TYPE=\"button\" CLASS=\"alert_btn\" ID=\"alertYESbtn\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_YES;"+( ( ALERT_YES_FN.length > 0 ) ? ALERT_YES_FN + ";" : "" )+"\"></td>" ;
       ALERTBTNS += "<td WIDTH=\"40\"></td>" ;
       ALERTBTNS += "<td ALIGN=\"center\"><INPUT VALUE=\""+ALERT_NO_LABEL+"\" TYPE=\"button\" CLASS=\"alert_btn\" ID=\"alertNObtn\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_NO;"+( ( ALERT_NO_FN.length > 0 ) ? ALERT_NO_FN + ";" : "" )+"\"></td>" ;
       ALERTBTNS += "<td WIDTH=\"40\"></td>" ;
       ALERTBTNS += "<td ALIGN=\"center\"><INPUT VALUE=\""+ALERT_CANCEL_LABEL+"\" TYPE=\"button\" CLASS=\"alert_btn\" ID=\"alertCANCELbtn\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=ALERT_CANCEL;"+( ( ALERT_CANCEL_FN.length > 0 ) ? ALERT_CANCEL_FN + ";" : "" )+"\"></td>" ;
       ALERTBTNS += "</tr>" ;
    }
    else if ( mode & ALERT_OKCANCEL )
    {
       ALERTBTNS = "<tr>" ;
       ALERTBTNS += "<td ALIGN=\"center\"><INPUT VALUE=\""+ALERT_OK_LABEL+"\" TYPE=\"button\" CLASS=\"alert_btn\" ID=\"alertOKbtn\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=1;"+ALERT_OK_FN+";\"></td>" ;
       ALERTBTNS += "<td WIDTH=\"40\"></td>" ;
       ALERTBTNS += "<td ALIGN=\"center\"><INPUT VALUE=\""+ALERT_CANCEL_LABEL+"\" TYPE=\"button\" CLASS=\"alert_btn\" ID=\"alertDEFAULTbtn\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=-1;"+( ( ALERT_CANCEL_FN.length > 0 ) ? ALERT_CANCEL_FN + ";" : "" )+"\"></td>" ;
       ALERTBTNS += "</tr>" ;
    }
    else
    {
       ALERTBTNS = "<tr>" ;
       ALERTBTNS += "<td ALIGN=\"center\"><INPUT VALUE=\""+ALERT_OK_LABEL+"\" TYPE=\"button\" CLASS=\"alert_btn\" ID=\"alertDEFAULTbtn\" STYLE=\"width:"+ALERT_BTNS_WIDTH+"px;height:"+ALERT_DEFAULT_BTNS_HEIGHT+"px;\" ONCLICK=\"javascript:ALERT_RET_VALUE=1;"+( ( ALERT_OK_FN.length > 0 ) ? ALERT_OK_FN + ";" : "" )+"\"></td>" ;
       ALERTBTNS += "</tr>" ;
    }
          
    if ( mode != -1 && ( mode & ALERT_NOICON ) != 0 ) ALERTICON = "" ;

    HTMLcode = HTMLcode.replaceAll( "%alerticon%", ALERTICON );
    HTMLcode = HTMLcode.replaceAll( "%alertbtns%", ALERTBTNS );
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", ALERT_IMGFOLDER_PATH );
          
    if ( W != "auto" ) W = parseInt( W, 10 ) ;
    if ( H != "auto" ) H = parseInt( H, 10 ) + 10 ;
          
    alertSPLASH( HTMLcode, 1, W, H, ALERT_DEFAULT_ZINDEX, TOP );

    if ( mode & ALERT_SUCCESS && $( "#alertDEFAULTbtn" ).get(0) != null ) alertBTNfocus( "DEFAULT" ) ;
    else if ( mode & ALERT_YESNO && $( "#alertYESbtn" ).get(0) != null ) alertBTNfocus( "YES" ) ;
    else if ( mode & ALERT_YESNOCANCEL && $( "#alertYESbtn" ).get(0) != null ) alertBTNfocus( "YES" ) ;
    else if ( mode & ALERT_OKCANCEL && $( "#alertOKbtn" ).get(0) != null ) alertBTNfocus( "OK" ) ;
}

function alertBTNfocus( BTN_ID )
{
		// BTN_ID >> 'OK', 'YES', 'NO', 'DEFAULT'
		BTN_ID = ( BTN_ID + "" ).toUpperCase() ;
		BTN_ID = "alert"+BTN_ID+"btn" ;
		var BTN = $( "#"+BTN_ID ).get(0);
		if ( BTN != null ) BTN.focus();
}

function alertSPLASH( HTMLcode, bSHOW, SPLASHwidth, SPLASHheight, zINDEX, TOP )
{
    zINDEX = safe_int( zINDEX, 0 );
    if ( zINDEX == 0 ) zINDEX = ALERT_DEFAULT_ZINDEX ;
    if ( ALERT_CURRENT_DISPLAY_FLAG != bSHOW )
    {
         ALERT_BODY_OVERFLOW_OLD = document.body.style.overflow ;
         if ( bSHOW )
         {
              document.body.style.overflow = "hidden" ;
    
              var dimsARRAY = getHTMLpageExtents() ;
              var VIEWPORTdimsARRAY = getViewportExtents() ;
              var PAGEwidth = dimsARRAY[0], PAGEheight = dimsARRAY[1] ;
              var VIEWPORTPAGEwidth = VIEWPORTdimsARRAY[0], VIEWPORTPAGEheight = VIEWPORTdimsARRAY[1] ;
              
              var COVERdiv = $( "#ALERTdivCOVER" ).get(0) ;
              var MODALdiv = $( "#ALERTdivMODAL" ).get(0) ;
              var CONTENTSbox = $( "#ALERTdivMODALcontents" ).get(0) ;
                      
              if ( COVERdiv != null )
              {
                  if ( zINDEX > 0 ) $( "#ALERTdivCOVER" ).zIndex( zINDEX - 1 ) ;
                  $( "#ALERTdivCOVER" ).css( "width", PAGEwidth + "px" ) ;
                  $( "#ALERTdivCOVER" ).css( "height", PAGEheight + "px" ) ;
                  $( "#ALERTdivCOVER" ).css( "opacity", "0.70" ) ;
                  $( "#ALERTdivCOVER" ).fadeIn( "slow" ) ;
              }
                      
              if ( MODALdiv != null && CONTENTSbox != null )
              {
                   if ( SPLASHheight != "auto" ) SPLASHheight += 5 ;
                   if ( SPLASHheight != "auto" ) SPLASHwidth += 2 ;

                   CONTENTSbox.style.verticalAlign = "top" ;
                   CONTENTSbox.innerHTML = HTMLcode ;
                   MODALdiv.style.width = ( SPLASHwidth == "auto" ) ? SPLASHwidth : SPLASHwidth + "px" ;
                   MODALdiv.style.height = ( SPLASHheight == "auto" ) ? SPLASHheight : SPLASHheight + "px" ;
                   var DIVwidth = parseInt( MODALdiv.style.width, 10 ) ;
                   var DIVheight = parseInt( MODALdiv.style.height, 10 ) ;
              
                   var ScrollTop = getViewportScrollOffset() ;
                          
                   MODALdiv.style.left = ( ( SPLASHheight == "auto" ) ? ( ( VIEWPORTPAGEwidth - 400 ) / 2 ) : ( ( VIEWPORTPAGEwidth - DIVwidth ) / 2 ) ) + "px" ;
                   MODALdiv.style.top = ( ScrollTop + ( ( SPLASHheight == "auto" ) ? ( ( VIEWPORTPAGEheight - 300 ) / 2 ) : ( ( VIEWPORTPAGEheight - DIVheight ) / 2 ) ) ) + "px" ;
                   MODALdiv.style.zIndex = zINDEX + 1 ;

                   $("#ALERTdivMODAL").fadeIn("slow") ;
                   _glob_idleCURRENTpopupWNDdivID = "ALERTdivMODAL" ;
              }
                      
              move_div( "ALERTdivMODAL", "CENTER", ( TOP == -1 ) ? 80 : TOP, SPLASHwidth, SPLASHheight, 0 );
            }
            else alertCLOSE() ;
            ALERT_CURRENT_DISPLAY_FLAG = bSHOW ;
    }
      
    if ( $( "#alertDEFAULTbtn" ).get(0) != null ) $( "#alertDEFAULTbtn" ).focus();
}

function alertCLOSE()
{
    if ( $( "#ALERTdivCOVER" ).get(0) != null ) $( "#ALERTdivCOVER" ).fadeOut("fast") ;
    $(document).ready(function() { $("#ALERTdivMODAL").fadeOut("fast"); });    
    document.body.style.overflow = ALERT_BODY_OVERFLOW_OLD ;
    ALERT_CURRENT_DISPLAY_FLAG = 0 ;
    alert_set_btns_width() ;
    alert_reset_labels();
    alert_reset_fn();
}