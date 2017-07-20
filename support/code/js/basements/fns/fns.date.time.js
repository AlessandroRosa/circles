function checkdate(m, d, y) { return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= ( new Date(y, m, 0 ) ).getDate() ; }
function unixtime() { return new Date().getTime(); }
function now() { return today_date() + ", " + current_time() ; }

function microtime(get_as_float)
{
    var unixtime_ms = new Date().getTime();
    var sec = parseInt(unixtime_ms / 1000);
    return get_as_float ? (unixtime_ms/1000) : (unixtime_ms - (sec * 1000))/1000 + ' ' + sec;
}

function today_date()
{
    var today = new Date() ;
    var day = today.getDate();   if ( parseInt( day ) < 10 ) day = "0" + parseInt( day ); 
    var year = today.getFullYear(); 
    var month = today.getMonth() + 1;    if ( parseInt( month ) < 10 ) month = "0" + parseInt( month ); 
    return month + "-" + day + "-" + year ;
}

function current_year() { return ( new Date() ).getFullYear(); }

function current_month()
{
    var today = new Date() ;
    var month = today.getMonth() + 1;    if ( parseInt( month ) < 10 ) month = "0" + parseInt( month ); 
    return month ;
}

function current_day()
{
    var today = new Date() ;
    var day = today.getDate();   if ( parseInt( day ) < 10 ) day = "0" + parseInt( day ); 
    return day ;
}

function current_time()
{
    var today = new Date() ;
    var h = parseInt( today.getHours(), 10 ) ;    if ( h < 10 ) h = "0" + h ;
    var m = parseInt( today.getMinutes(), 10 ) ;  if ( m < 10 ) m = "0" + m ;
    var s = parseInt( today.getSeconds(), 10 ) ;  if ( s < 10 ) s = "0" + s ;
    return h + ":" + m + ":" + s ;
}

function validate_date_format( dateFMT )
{
    dateFMT = dateFMT.replaceAll( "/", "-" );

    if ( dateFMT.testME( _glob_dateitREGEXpattern ) )
    {
          var d = dateFMT.split( "-" ) ;
          return d[2] + "-" + d[1] + "-" + d[0] ;
    }
    else if ( dateFMT.testME( _glob_dateusREGEXpattern ) )
    {
          var d = dateFMT.split( "-" ) ;
          return d[2] + "-" + d[1] + "-" + d[0] ;
    }
    else return "" ;
}

function month_difference(d1, d2)
{
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months ;
}

function findWEEKDAY( y, m, d )
{
    m = Math.max( 0, m - 1 ) ;
    var week_dayARRAY = new Array( "Sun", "Mon", "Tue", "Wed" , "Thu", "Fri", "Sat" );
    var date = new Date( y, m, d );
    var dayINDEX = date.getDay() ;
    return week_dayARRAY[ dayINDEX ] ;
}