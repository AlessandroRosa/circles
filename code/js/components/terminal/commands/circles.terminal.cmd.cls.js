_glob_terminal_cmd_files_include[ "cls" ] = [ "clean" ] ;

function circles_terminal_cmd_cls()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;

         _params = safe_string( _params, "" ).trim();
     var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" );

     var _params_assoc_array = [];
     if ( is_array( _params ) )
     {
        _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        if ( _params[0] == "/h" )
        return circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _out_channel );
     }
     else return circles_terminal_cmd_clean.apply( this, arguments );
}