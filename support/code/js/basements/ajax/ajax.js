var _glob_ajaxSTARTtime ;
var _glob_ajaxENDtime ;
var _glob_ajaxMAXseconds = 30 ;

function returnSTRfromSTATUScode( statusCODE )
{
    var STR = "" ;
    
    switch ( statusCODE )
    {
        case 200:
            STR = "operazione andata a buon fine" ;
        break;
    }
}

function AJAXtrackSTARTtime()
{
      var _glob_ajaxSTART = new Date();
      _glob_ajaxSTARTtime = _glob_ajaxSTART.getTime();
      _glob_ajaxSTARTtime /= 1000 ;
      _glob_ajaxSTARTtime = parseInt( _glob_ajaxSTARTtime, 10 );      if ( isNaN( _glob_ajaxSTARTtime ) ) _glob_ajaxSTARTtime = 0 ;
}

function AJAXtrackENDtime()
{
      var _glob_ajaxEND = new Date();
      _glob_ajaxENDtime = _glob_ajaxEND.getTime();
      _glob_ajaxENDtime /= 1000 ;
      _glob_ajaxENDtime = parseInt( _glob_ajaxENDtime, 10 );          if ( isNaN( _glob_ajaxENDtime ) ) _glob_ajaxENDtime = 0 ;
}

function AJAXcheckRUNNINGtime()
{
      if ( _glob_ajaxENDtime != undefined || _glob_ajaxSTARTtime != undefined ) return true ;
      else return ( ( _glob_ajaxENDtime - _glob_ajaxSTARTtime ) < _glob_ajaxMAXseconds ) ? 1 : 0 ;
}

function AJAXreturnRUNNINGtime()
{
      return ( _glob_ajaxENDtime != undefined || _glob_ajaxSTARTtime != undefined ) ? -1 : _glob_ajaxENDtime - _glob_ajaxSTARTtime ;
}

function createHTTPrequest()
{
        var http_request = false;

        if ( window.XMLHttpRequest ) 
        { // Mozilla, Safari,...
            http_request = new XMLHttpRequest();
            if ( http_request.overrideMimeType ) 
            {
                //http_request.overrideMimeType('text/xml');
                // See note below about this line
            }
        } 
        else if ( window.ActiveXObject )
        {   
            // IE
            /*            
            try
            {
                http_request = new ActiveXObject("MSXML2.XMLHTTP.3.0");
            } 
            catch (e) 
            {
                try 
                {
                    http_request = new ActiveXObject("Microsoft.XMLHTTP");
                } 
                catch (e) { alert(e) ; }
            }
            */            
            XMLHttpRequest = function () {
                try { http_request = new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
                  catch (e) {}
                try { http_request = new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
                  catch (e) {}
                try { http_request = new ActiveXObject("Microsoft.XMLHTTP"); }
                  catch (e) {}
                //Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
                throw new Error("This browser does not support XMLHttpRequest.");
              };
        }

        if (!http_request)
        {
            alert_msg( DISPATCH_SUCCESS, "Non riesco a creare un'istanza XMLHTTP.\nQuindi non posso elaborare la richiesta." );
            return false;
        }
        else return http_request;
}