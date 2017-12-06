function circles_terminal_cmd_env()
{
    var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
    var _params = arguments[0] ;
    var _out_channel = arguments[1] ;
    var _par_1 = arguments[2] ;
    var _cmd_mode = arguments[3] ;
    var _caller_id = arguments[4] ;
	var _params_array = _params.split( " " );
	if ( _params_array.includes( "/h" ) ) circles_lib_output( _out_channel, DISPATCH_INFO, "'"+_cmd_tag+"' is an alias of 'config' cmd\n", _par_1, _cmd_tag );
	circles_lib_terminal_interpreter( "config "+_params, _glob_terminal, _out_channel );
}