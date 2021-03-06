function circles_lib_splash_screen_code()
{
    var _sw = $(window).width(), _sh = $(window).height() ;
    var _rnd = Math.max( 1, Math.round( Math.random() * 8 ) );
    var _splash_file = _glob_path_to_img + "splash/splash." + ( _rnd < 10 ? "0" + _rnd : _rnd ) + ".png" ;
    var mail1 = "zandor_zz", mail2 = "yahoo", mail3 = "it" ;
    
    var splashHTMLcode = "<table ALIGN=\"center\" ID=\"CIRCLESsplashMASTERTABLE\">" ;
    splashHTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
    splashHTMLcode += "<tr>" ;
    splashHTMLcode += "<td WIDTH=\"12\"></td>" ;
    splashHTMLcode += "<td VALIGN=\"top\" ALIGN=\"center\"><IMG ID=\"CIRCLESsplashPIX\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:white;padding:4px;display:"+(_sw > 540?"block":"none")+";\" WIDTH=\"200\" CLASS=\"general_rounded_corners\" SRC=\""+_splash_file+"\"></td>" ;
    splashHTMLcode += "<td ID=\"CIRCLESsplashPIXspacer\" WIDTH=\"24\"></td>" ;
    splashHTMLcode += "<td VALIGN=\"top\">" ;
    splashHTMLcode += "<table>" ;
    splashHTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    splashHTMLcode += "<tr><td><b STYLE=\"font-size:18pt;\">"+_glob_appTITLE+"</b></td></tr>" ;
    splashHTMLcode += "<tr><td STYLE=\"font-size:12pt;\">"+_glob_appSUBTITLE+"</td></tr>" ;

    splashHTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    splashHTMLcode += "<tr><td STYLE=\"font-size:12pt;\" ALIGN=\"center\">Last release date : "+_glob_appLASTreleaseDATE+"</td></tr>" ;
    splashHTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;

    splashHTMLcode += "<tr><td STYLE=\"font-size:12pt;\" ALIGN=\"center\">Coded by Alessandro Rosa - <a STYLE=\"color:blue;\" HREF=\"mailto:"+mail1+"@"+mail2+"."+mail3+"\">Contact me</a></td></tr>" ;
    splashHTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
    splashHTMLcode += "<tr>" ;
    splashHTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\" ALIGN=\"center\">" ;
    splashHTMLcode += "<table ALIGN=\"center\">" ;

    splashHTMLcode += "<tr>" ;
    splashHTMLcode += "<td WIDTH=\"32\" VALIGN=\"top\" ALIGN=\"center\" CLASS=\"general_rounded_corners\" STYLE=\"padding:6px;"+( isCHROME() ? "background-color:#D5E6F7;" : "" )+"\"><IMG SRC=\"%imgpath%icons/browsers/chrome/chrome.icon.01.32x32.png\"></td>" ;
    splashHTMLcode += "<td WIDTH=\"20\"></td>" ;
    splashHTMLcode += "<td WIDTH=\"32\" VALIGN=\"top\" ALIGN=\"center\" CLASS=\"general_rounded_corners\" STYLE=\"padding:6px;"+( isFIREFOX() ? "background-color:#D5E6F7;" : "" )+"\"><IMG SRC=\"%imgpath%icons/browsers/firefox/firefox.icon.01.32x32.png\"></td>" ;
    splashHTMLcode += "<td WIDTH=\"20\"></td>" ;
    splashHTMLcode += "<td WIDTH=\"32\" VALIGN=\"top\" ALIGN=\"center\" CLASS=\"general_rounded_corners\" STYLE=\"padding:6px;"+( isIE() ? "background-color:#D5E6F7;" : "" )+"\"><IMG SRC=\"%imgpath%icons/browsers/ie/ie.icon.01.32x32.png\"></td>" ;
    splashHTMLcode += "</tr>" ;
    splashHTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    splashHTMLcode += "<tr><td COLSPAN=\"5\" ALIGN=\"center\" STYLE=\"font-size:12pt;\">Detected <SPAN STYLE=\"color:blue;\">"+get_bits_system_architecture()+"-bits</SPAN> system architecture</td></tr>" ;
    splashHTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    splashHTMLcode += "<tr><td COLSPAN=\"5\" STYLE=\"font-size:12pt;"+( _glob_multithreading_compatible ? "color:#1FB954;" : "color:#EE0000;" )+"\" ALIGN=\"center\">"+( _glob_multithreading_compatible ? "Your" : "Sorry, but your" )+" browser "+( _glob_multithreading_compatible ? "supports" : "does not support" )+" multi-threading</td></tr>" ;
    if ( !_glob_multithreading_compatible )
    {
       splashHTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
       splashHTMLcode += "<tr><td COLSPAN=\"5\" ALIGN=\"center\">Sorry, this app requires your browser to support multi-threading</td></tr>" ;
    }

    if ( _demos_list.length > 0 )
    {
       splashHTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
       splashHTMLcode += "<tr><td VALIGN=\"top\" COLSPAN=\"5\"><table>" ;
       splashHTMLcode += "<tr><td STYLE=\"font-size:12pt;\">Select a demo</td><td WIDTH=\"6\"></td>";
       splashHTMLcode += "<td><SELECT STYLE=\"font-size:12pt;height:auto;\" ONCHANGE=\"javascript:var idx=this.value;window.location.href='?demo='+idx;\"><OPTION VALUE=\"0\" SELECTED=\"selected\">";
       _demos_list.forEach( function( _demo_chunk ){ splashHTMLcode += "<OPTION VALUE=\""+_demo_chunk[0]+"\">"+_demo_chunk[1] ; } );
       splashHTMLcode += "</SELECT></td>";
       splashHTMLcode += "</table></td></tr>" ;
    }
    splashHTMLcode += "</table>" ;
    splashHTMLcode += "</td>" ;
    splashHTMLcode += "</tr>" ;
    splashHTMLcode += "</table>" ;
    splashHTMLcode += "</td>" ;
    splashHTMLcode += "<td WIDTH=\"12\"></td>" ;
    splashHTMLcode += "</tr>" ;
    splashHTMLcode += "</table>" ;
    splashHTMLcode = splashHTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
    return splashHTMLcode ;
}