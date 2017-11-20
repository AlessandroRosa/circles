function circles_lib_terminal_interpreter( _cmd, _terminal, _output_channel )
{
    _cmd = safe_string( _cmd, "" ).trim();
    _terminal = !object_exists( _terminal ) ? _glob_terminal : _terminal ;
    if ( safe_size( _cmd, 0 ) > 0 && _terminal != null )
    {
       var _cmd_array = circles_lib_terminal_parse_cmd( _cmd );
       var _cmd_tag = ( _glob_terminal_keepcmd.length > 0 && _cmd_array['cmd'].toLowerCase() != "keepcmd" ) ? _glob_terminal_keepcmd : _cmd_array['cmd'].trim();
       var _params_str = ( _glob_terminal_keepcmd.length > 0 && _cmd_tag.toLowerCase() != "keepcmd" ) ? ( _cmd_array['cmd'].trim() + " " + _cmd_array['params'].trim() ) : _cmd_array['params'].trim();
       _glob_terminal_current_cmd = _cmd_tag ;
       var _ret_cmd = circles_lib_terminal_exec( _cmd_tag, _params_str, _terminal, _output_channel );
         
       if ( function_exists( "CIRCLESformsTERMINALpurgecmdUPDATEstatus" ) )
			 CIRCLESformsTERMINALpurgecmdUPDATEstatus( _glob_terminal_form_suffix ) ;

       if ( _output_channel == OUTPUT_FUNCTION ) return _ret_cmd ;
    }
    else return null ;
}

function circles_lib_terminal_parse_cmd( _cmd )
{
    _cmd = safe_string( _cmd, "" ).trim();
    if ( safe_size( _cmd, 0 ) == 0 ) return [] ;
    var _cmd_array = [], _array = _cmd.includes( " " ) ? _cmd.split( " " ) : [ _cmd ] ;
    _cmd_array['cmd'] = _array[0] ;
    _array.remove( 0, 0 );
    _cmd_array['params'] = _array.length == 0 ? "" : _array.join( " " );
    return _cmd_array ;
}

function circles_lib_terminal_exec( _input_str_01, _input_str_02, _terminal, _output_channel )
{
    _input_str_01 = safe_string( _input_str_01, "" ).trim();
    _output_channel = safe_int( _output_channel, OUTPUT_TERMINAL );
    var _b_operator_found = _input_str_02.one_in( TERMINAL_TRANSFER_TO_OPERATOR, TERMINAL_TRANSFER_FROM_OPERATOR );
    _glob_terminal_out_stream = _terminal ;
    if ( _b_operator_found ) // operators have higher evaluation precedence than cmds
    {
       var _op = "" ;
       if ( _input_str_02.includes( TERMINAL_TRANSFER_TO_OPERATOR ) ) _op = TERMINAL_TRANSFER_TO_OPERATOR ;
       else if ( _input_str_02.includes( TERMINAL_TRANSFER_FROM_OPERATOR ) ) _op = TERMINAL_TRANSFER_FROM_OPERATOR ;
       _input_str_02 = _input_str_02.replaceAll( _op, "" );
       _input_str_02 = ( _input_str_01 + " " + _input_str_02 ).stripdoublespaces();
       _input_str_01 = _op ;
       // so we get the leading term in 01 and params in 02, like for cmds syntax
       var _cmd_tag = _input_str_01, _params_str = _input_str_02 ;
       // send cmd and params to the related operator handler
    }
    else
    {
       var _cmd_tag = _input_str_01, _params_str = _input_str_02 ;
	     if ( !_glob_code_run_cmds_array.includes( _cmd_tag ) )
	     {
          var _ret_chunk = circles_lib_terminal_load_cmd( _cmd_tag, _params_str, _output_channel, TERMINAL_CMD_MODE_ACTIVE );
		      var _ret_id = safe_int( _ret_chunk[0], 0 );
		      var _ret_msg = safe_string( _ret_chunk[1], "Memory failure: resource data for cmd '"+_cmd_tag+"' is not available." );
		      if ( !_ret_id ) circles_lib_terminal_error_echo( _ret_msg );
          if ( _output_channel == OUTPUT_FUNCTION ) return _ret_chunk ;
			 }
			 else
       {
          var _ret_cmd = circles_lib_process_cmd( _cmd_tag, _params_str, _output_channel, TERMINAL_CMD_MODE_ACTIVE );
          if ( _output_channel == OUTPUT_FUNCTION ) return _ret_cmd ;
       }
    }
}

function circles_lib_terminal_load_cmd( _expression, _params_str, _output_channel, _cmd_mode, _caller_id )
{
    _expression = safe_string( _expression, "" ).trim();
    var _cmd_tag = _expression.includes( " " ) ? ( _expression.split( " " ) )[0] : _expression ;
    $.ajaxSetup( {async:false} );
    var _filename = "circles.terminal.cmd." + _cmd_tag + ".js", _ret_cmd = false ;
    if ( _glob_code_run_cmds_array.includes( _cmd_tag ) )
	  return circles_lib_process_cmd( _cmd_tag, _params_str, _output_channel, _cmd_mode, _caller_id );
    else if ( check_file_exists( _glob_terminal_cmds_path + _filename ) )
    {
			 $.getScript( _glob_terminal_cmds_path + _filename ).done(
                    function()
                    {
                       var _include_files = is_array( _glob_terminal_cmd_files_include[ _cmd_tag ] ) ? _glob_terminal_cmd_files_include[ _cmd_tag ].clone() : [] ;
                       var _n_include = safe_size( _include_files, 0 );
                       // 1. load the list of additional files, if declared, for the cmd to run
											 if ( _n_include > 0 )
	                     {
		                      for( var _i = 0 ; _i < _n_include ; _i++ )
		                      {
                             if ( !_glob_code_run_cmds_array.includes( _include_files[_i] ) )
                             circles_lib_terminal_load_cmd( _include_files[_i], "", OUTPUT_FILE_INCLUSION, TERMINAL_CMD_MODE_INCLUSION, _caller_id ) ;
			                    }
		                   }
    
 											 // 2. process the cmd
                       _ret_cmd = circles_lib_process_cmd( _cmd_tag, _params_str, _output_channel, _cmd_mode, _caller_id );

                   } ).fail( function(){ _ret_cmd = [ RET_ERROR, "Fail to execute cmd " + _cmd_tag ] ; } );

       return _ret_cmd ;
    }
    else return [ RET_ERROR, "Fail to load cmd " + _cmd_tag + " : missing or corrupted command" ] ;
}

function circles_lib_process_cmd( _cmd_tag, _params_str, _output_channel, _cmd_mode, _caller_id )
{
    if ( _glob_terminal_keepcmd.length > 0 && !_cmd_tag.stricmp( "keepcmd" ) )
    _params_str = _glob_terminal_keepcmd.replaceAll( _cmd_tag, "" ).trim() + " " + _params_str ;
    else _params_str = safe_string( _params_str, "" ) ;

    var _sub_fn = "circles_terminal_cmd_" + _cmd_tag, _msg = "" ;
    if ( _params_str.match( /[^A-Za-z0-9\\"\@\$\^\[\]\?\+\-\*\#\:\%\/\_\.\,\(\)\<\>\=\ ]+/i ) != null )
    {
       _msg = "Syntax error: detected illegal chars inside input params."
       if ( _params_str.includes( "'" ) ) _msg += _glob_crlf + "Please, replace quotes with double quotes." ;
       return [ RET_ERROR, _msg ] ;
    }
    else if ( function_exists( _sub_fn ) )
    {
    	 var _full_cmd = _sub_fn + "( '"+_params_str+"', "+_output_channel+", '', "+_cmd_mode+", '"+_caller_id+"' )" ;
       var _out = "" ;
       try { _out = eval( _full_cmd ); }
			 catch( _err )
			 {
					_out = "Runtime error : "+_err+_glob_crlf+" fail to execute cmd '"+_cmd_tag+"'" ;
          _out += _glob_crlf + _err.message ;
			 }

       if ( !_glob_code_run_cmds_array.includes( _cmd_tag ) ) _glob_code_run_cmds_array.push( _cmd_tag );
       return [ RET_OK, _out ] ;
    }
    else
    {
       circles_lib_terminal_error_echo( "Memory failure: resource data for cmd '"+_cmd_tag+"' is not available." );
       return [ RET_ERROR, "Memory failure: resource data for cmd '"+_cmd_tag+"' is not available" ] ;
    }
}

function circles_lib_unload_cmd( _cmd )
{
    _cmd = safe_string( _cmd, "" ).trim();
		// release resources
    if ( safe_size( _glob_code_run_cmds_array, 0 ) > 0 )
    {
       if ( _cmd.stricmp( "all" ) || _cmd.length == 0 ) _glob_code_run_cmds_array.flush();
       else
       {
          var _l = safe_size( _glob_code_run_cmds_array, 0 ), _b_ok = YES ;
          for( var _i = 0 ; _i < _l ; _i++ )
          {
             if ( _cmd.stricmp( _glob_code_run_cmds_array[_i] ) )
             {
    						_sub_fn = "circles_terminal_cmd_" + _glob_code_run_cmds_array[_i] ;
                unload_fns( window, "", _sub_fn, NO );
						 }
          }
       }
    }
}