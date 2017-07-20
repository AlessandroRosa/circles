function error_generic( MSG )
{
    MSG = MSG.replaceAll( [ CRLF_NO_WIN, CRLF_WIN ], "<br>" );
    var HTMLcode = "<table ALIGN=\"center\">" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td>"+MSG+"</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\"><INPUT TYPE=\"button\" CLASS=\"button\" VALUE=\"OK\" ONCLICK=\"javascript:SPLASH('',false)\"></td></tr>" ;
        HTMLcode += "</table>" ;

    SPLASH( HTMLcode, 1, 450, 350 ) ;
}

function error_404( MSG, actionCODE, FILEPATH )
{
    var actionCODE = parseFloat( actionCODE );              if ( isNaN( actionCODE ) ) actionCODE = 0 ;
    if ( actionCODE > 0 )
    {
        var MSG_ACTIONCODE = "Action code : " + actionCODE ;
            MSG = MSG.replaceAll( [ CRLF_NO_WIN, CRLF_WIN ], "<br>" ) ;

        var file = basename( FILEPATH );
        var dir = dirname( FILEPATH );
        
        var HTMLcode = "<table ALIGN=\"center\"  WIDTH=\"100%\">" ;
            if ( _glob_isDEVELOPER )
            {
                //var FNCALLER = arguments.callee.caller.arguments.callee.caller.toString() ;
                
                HTMLcode += "<tr><td COLSPAN=\"5\" STYLE=\"padding:4px;background-color:white;\">"+MSG_ACTIONCODE+"</td></tr>" ;
                HTMLcode += "<tr><td COLSPAN=\"5\" STYLE=\"font-size:7pt;padding:4px;background-color:white;\">"+file+"</td></tr>" ;
                HTMLcode += "<tr><td COLSPAN=\"5\" STYLE=\"font-size:7pt;padding:4px;background-color:white;\">"+dir+"</td></tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"1\" COLSPAN=\"5\" STYLE=\"background-color:#E7E7E7;\"></td></tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
            }
            
            HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td WIDTH=\"10\"></td>" ;
            HTMLcode += "<td VALIGN=\"top\"><IMG STYLE=\"border:1px solid #E0E0E0;padding:4px;background-color:white;\" SRC=\""+_glob_path_to_root+"img/errors/404/homer.404.png\"></td>" ;
            HTMLcode += "<td WIDTH=\"20\"></td>" ;
            HTMLcode += "<td VALIGN=\"top\" STYLE=\"font-size:12pt;color:red;\">"+SYSTEM_ERROR_404+"</td>" ;
            HTMLcode += "<td WIDTH=\"10\"></td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
            HTMLcode += "<tr><td ALIGN=\"center\" COLSPAN=\"5\"><INPUT TYPE=\"button\" STYLE=\"width:80px;\" CLASS=\"button\" VALUE=\"Chiudi\" ONCLICK=\"javascript:SPLASH('',0);\"></td></tr>" ;
            HTMLcode += "</table>" ;
    
        SPLASH( HTMLcode, 1, 470, 280 ) ;
    }
}

function error_701( MSG )
{
        MSG = MSG.replaceAll( [ CRLF_NO_WIN, CRLF_WIN ], "<br>" );

        var HTMLcode = "<table ALIGN=\"center\"  WIDTH=\"100%\">" ;
            HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td WIDTH=\"10\"></td>" ;
            HTMLcode += "<td VALIGN=\"top\"><IMG STYLE=\"border:1px solid #E0E0E0;padding:4px;background-color:white;\" SRC=\""+_glob_path_to_root+"img/errors/701/corrupted.table.png\"></td>" ;
            HTMLcode += "<td WIDTH=\"20\"></td>" ;
            HTMLcode += "<td VALIGN=\"top\" STYLE=\"font-size:12pt;color:red;\">"+SYSTEM_ERROR_701+"</td>" ;
            HTMLcode += "<td WIDTH=\"10\"></td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
            HTMLcode += "<tr><td ALIGN=\"center\" COLSPAN=\"5\"><INPUT TYPE=\"button\" STYLE=\"width:80px;\" CLASS=\"button\" VALUE=\"Chiudi\" ONCLICK=\"javascript:SPLASH('',false)\"></td></tr>" ;
            HTMLcode += "</table>" ;
    
        SPLASH( HTMLcode, 1, 470, 250 ) ;
}

function error_TIMEOUT( MSG, actionCODE )
{
    var MSG_ACTIONCODE = "Action code : " + actionCODE ;
    
    MSG = MSG.replaceAll( [ CRLF_NO_WIN, CRLF_WIN ], "<br>" );

    var HTMLcode = "<table ALIGN=\"center\" >" ;
        if ( _glob_isDEVELOPER )
        {
            HTMLcode += "<tr><td ALIGN=\"center\"  COLSPAN=\"5\" STYLE=\"padding:4px;background-color:white;\">"+MSG_ACTIONCODE+"</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        }
        
        HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\"><IMG SRC=\""+_glob_path_to_root+"img/errors/timeout/timeout.clock.broken.png\"></td>" ;
        HTMLcode += "<td WIDTH=\"20\"></td>" ;
        HTMLcode += "<td VALIGN=\"top\" STYLE=\"font-size:12pt;color:red;\">"+SYSTEM_ERROR_404+"</td>" ;
        HTMLcode += "<td WIDTH=\"10\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" COLSPAN=\"5\"><INPUT TYPE=\"button\" STYLE=\"width:80px;\" CLASS=\"button\" VALUE=\"OK\" ONCLICK=\"javascript:SPLASH('',false)\"></td></tr>" ;
        HTMLcode += "</table>" ;

    SPLASH( HTMLcode, 1, 340, 250 ) ;
}