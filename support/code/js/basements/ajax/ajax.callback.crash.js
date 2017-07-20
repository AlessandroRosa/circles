function ajax_callback_crash( http_request, actionCODE, FILEPATH )
{
          if ( actionCODE != 0 && http_request.readyState == 4 ) // end of processing
          {
              var status = parseInt( http_request.status, 10 );       if ( isNaN( status ) ) status = -1 ;
              
              AJAXtrackENDtime();
              if ( !( AJAXcheckRUNNINGtime() ) )
              {
                   SPLASH( '', 0 );
                   error_generic( SYSTEM_ERROR_01 );
                   http_request.abort();
                   return false ;
              }
              else if ( status == 404 ) // file not found
              {
                   SPLASH( '', 0 );
                   error_404( SYSTEM_ERROR_404, actionCODE, FILEPATH );
                   http_request.abort();
                   return false ;
              }
              else if ( status == 701 ) // user-defined : DAMAGED TABLE
              {
                   SPLASH( '', 0 );
                   error_701( SYSTEM_ERROR_701 );
                   http_request.abort();
                   return false ;
              }
          }
          
          return true ;
}