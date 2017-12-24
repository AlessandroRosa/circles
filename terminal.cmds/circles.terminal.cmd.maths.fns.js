function circles_terminal_cmd_deg()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose && _glob_terminal_echo_flag )
     circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _cmd_params = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length == 0 )
     circles_lib_output( _out_channel, DISPATCH_WARNING, "Please, input the value in radians for conversion into degrees", _par_1, _cmd_tag );
     else
     {
             _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _cmd_params['help'] = NO ;
         _cmd_params['keywords'] = NO ;
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
             _p = _params_array[_i];
            switch( _p.toLowerCase() )
            {
                case "/h" : _cmd_params['help'] = YES ; break ;
                case "html" : _cmd_params['html'] = YES ; break ;
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
				default: break ;
            }
         }

         if ( _cmd_params['help'] )
         {
              var _MSG = "<banana>return the value in degrees for the input value in radians</banana>" + _glob_crlf ;
              _MSG += "<lightblue>usage</lightblue> <snow>deg(radians)</snow>" ;
              if ( _cmd_params['html'] ) circles_lib_output( _out_channel, DISPATCH_INFO, LANG_MSG_00, _par_1, _cmd_tag );
              _cmd_params['html'] ? circles_lib_terminal_color_decode_htmltext( _MSG ) : circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _MSG, _par_1, _cmd_tag );
         }
         else if ( _cmd_params['keywords'] )
         {
             var _msg = circles_lib_terminal_tabular_arrange_data( _cmd_terms_dict.sort() ) ;
             if ( _msg.length == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
             else
             {
                 _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                 circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
             }
         }
         else
         {
              var _rad = ( _params.toUpperCase() == "PI" ) ? Math.PI : safe_float( _params, 0.0 );
              var _deg = _rad / ( 2.0 * Math.PI ) * 360.0 ;
              circles_lib_output( _out_channel, DISPATCH_INFO, _rad + ( ( _rad == 1 ) ? " radiant" : " radians" ) + "</lightblue>"+_glob_crlf+"<cadetblue>" + _deg + ( ( _deg == 1 ) ? " degree" : " degrees" ), _par_1, _cmd_tag );
         }
     }

     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function circles_terminal_cmd_rad()
{
     var _out_text_string = "" ;
     var _cmd_params = [];
     _params = safe_string( _params, "" ).trim();
     if ( _params.length == 0 )
     circles_lib_output( _out_channel, DISPATCH_WARNING, "Please, input the value in degrees for conversion into radians", _par_1, _cmd_tag );
     else
     {
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i];
              switch( _p.toLowerCase() )
              {
                   case "/h" : _cmd_params['help'] = YES ; break ;
                   default: break ;
              }
         }

         if ( _cmd_params['help'] )
         {
              var _MSG = "<quartz>rad</quartz>" + _glob_crlf ;
              _MSG += "<lightblue>usage</lightblue> <snow>rad(degrees)</snow>" + _glob_crlf ;
              _MSG += "<banana>return the value in radians for the input value in degrees</snow>" ;
              if ( _cmd_params['html'] ) circles_lib_output( _out_channel, DISPATCH_INFO, LANG_MSG_00, _par_1, _cmd_tag );
              _cmd_params['html'] ? circles_lib_terminal_color_decode_htmltext( _MSG ) : circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _MSG, _par_1, _cmd_tag );
         }
         else
         {
              var _deg = safe_float( _params, 0 );
              var _rad = _deg / 360.0 * ( 2.0 * Math.PI );
              var _MSG = _deg + ( ( _deg == 1 ) ? " degree" : " degrees" ) + "</lightblue>"+_glob_crlf+"<cadetblue>" + _rad + ( ( _rad == 1 ) ? " radiant" : " radians", _par_1, _cmd_tag );
              circles_lib_output( _out_channel, DISPATCH_INFO, _MSG, _par_1, _cmd_tag );
         }
     }

     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
}