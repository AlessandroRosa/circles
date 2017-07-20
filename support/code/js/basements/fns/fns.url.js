function $_GET( variable )
{ 
    var query = window.location.search.substring(1); 
    var vars = query.split("&"), pair ; 
    for ( var i = 0; i < vars.length; i++ )
    { 
        pair = vars[i].split( "=" ); 
        if ( pair[0] == variable ) return unescape( pair[1] ); 
    } 

    return "" ; 
}

function loadScript(url, callback)
{
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState)
		{  //IE
       script.onreadystatechange = function()
			 {
           if (script.readyState == "loaded" || script.readyState == "complete")
					 {
               script.onreadystatechange = null;
               callback();
           }
        };
    }
		else
		{  //Others
        script.onload = function(){ callback(); };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}