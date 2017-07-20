var _glob_delayCNT = 0 ;

// a lower value is not recommended, cause the event listener won't manage to listen adequately the key press repetition
var _glob_delayTICKincrement = 0.75 ;
// last tick value
var _glob_delayTICKfinal = 0.0 ;

var _glob_delayMAX = 1 ;
var _glob_delayCMDSTRING = "" ;
var _glob_delayTIMEOUTid = null ;
var _glob_bKEYpress = false ;
var _glob_delayARGStmp = null ;

function delayed_cmd_halt()
{
      if ( _glob_delayTIMEOUTid )
      {
          window.clearInterval( _glob_delayTIMEOUTid );
          window.clearTimeout( _glob_delayTIMEOUTid );
          _glob_delayTIMEOUTid = null ;
          _glob_delayTICKincrement = 0.75;
      } 
}

function delayed_cmd_reset()
{
    _glob_delayTICKincrement = 0.75 ;
    _glob_delayMAX = 1 ;
    _glob_delayCMDSTRING = "" ;
    _glob_delayTIMEOUTid = null ;
    _glob_bKEYpress = false ;
    _glob_delayARGStmp = null ;
}

function delayed_cmd()
{
    var argv = delayed_cmd.arguments ;
    var argc = argv.length ;
        if ( argc > 0 )
        {
             // check the first parameter for keypress event
             _glob_bKEYpress = ( argv[0] == 0 ) ? 0 : 1 ;
             
             // check the second parameter for MAX delay time
             _glob_delayMAX = argv[1] ;
        }

        /*
             The _glob_bKEYpress flags instructs the system whether no 
             key has been currently pressed.
        */
        
        if ( _glob_bKEYpress )
        {
             /*
                  each time a key is pressed, the system checks whether a TIMER ID has been activated.
                  If so, the system stops the latest activated timer and start a new one.
             */
        
             var container = $( "#container" ).get(0);
             _glob_delayARGStmp = argv ;
             
             if ( _glob_delayTIMEOUTid != null )
             {
                  window.clearInterval( _glob_delayTIMEOUTid );
                  _glob_delayTIMEOUTid = null ;
             }
             
             _glob_bKEYpress = false ;
             _glob_delayTIMEOUTid = window.setInterval( "delayed_cmd()", _glob_delayTICKincrement * 1000 );
        }
        else
        {
             /*
                  Then the system keeps on listening to further keypress. If no key is pressed,
                  the timer keeps on going until a maximal delay is
                  reached and the given command is finally executed.
             */
        
             _glob_delayCNT += _glob_delayTICKincrement ;
             if ( _glob_delayCNT >= _glob_delayMAX )
             {
                  if ( _glob_delayCMDSTRING.length == 0 )
                  {
                      var howmany_args = ( _glob_delayARGStmp != null ) ? _glob_delayARGStmp.length : 0 ;
                      for ( var i = 0; i < howmany_args ; i++ )
                      {
                          //alert_msg( DISPATCH_SUCCESS, _glob_delayARGStmp[i].urlencode() );

                          if ( i == 0 ) // keypress (skip, already set)
                          {
                          }
                          else if ( i == 1 ) // max interval in seconds (skip, already set)
                          {
                          }
                          else if ( i == 2 ) // function name
                          {
                              _glob_delayCMDSTRING += "" + _glob_delayARGStmp[i] + "( " ;
                          }
                          else if ( i > 2 && i < howmany_args ) // arguments
                          {
                              var type = typeof( _glob_delayARGStmp[i] ) ;

                              if ( type == "boolean" || type == "number" )
                              _glob_delayCMDSTRING += _glob_delayARGStmp[i] ;
                              else if ( type == "string" )
                              {
                                  var str = "" + _glob_delayARGStmp[i] ;
                                  str = str.addslashes() ;
                                  _glob_delayCMDSTRING += "\"" + str + "\"" ;
                              }

                              if ( i < howmany_args - 1 ) _glob_delayCMDSTRING += "," ;
                              else _glob_delayCMDSTRING += " )" ;
                          }
                      }
                      
                      var LASTchar = _glob_delayCMDSTRING.charAt( _glob_delayCMDSTRING.length - 1 ) ;
                      if ( LASTchar != ")" ) _glob_delayCMDSTRING += ")" ;

                      _glob_delayCNT = 0 ;
                      
                      // just wait for another delay tick to go ...
                      window.setTimeout( _glob_delayCMDSTRING, _glob_delayTICKfinal * 1000 );
                      _glob_delayCMDSTRING = "" ;
                      
                      window.clearTimeout( _glob_delayTIMEOUTid );
                      _glob_delayTIMEOUTid = null ;
                  }
             }
        }
}

function fn_ex()
{
    var argv = fn_ex.arguments ;
    var argc = argv.length ;
    
    var output = "" ;
        for( var i = 0 ; i < argc ; i++ ) output += argv[i] + "\n" ;
        
    alert_msg( DISPATCH_SUCCESS, output );
}