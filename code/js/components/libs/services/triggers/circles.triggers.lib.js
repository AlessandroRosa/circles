function circles_lib_triggers_open( _trigger_id, _silent, _out_channel )
{
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _trigger_chunk = _glob_triggers_table[''+_trigger_id], _msg, _ret ;
    if ( _trigger_chunk != null )
    {
       var _startINDEX = 0, _msg ;
       var _trigger_title = _trigger_chunk[_startINDEX] ;
           _startINDEX++ ;
       var _trigger_desc = _trigger_chunk[_startINDEX] ;
           _startINDEX++ ;
       var _trigger_fn = _trigger_chunk[_startINDEX] ;
           _startINDEX++ ;
       var _trigger_fullpath = _trigger_chunk[_startINDEX] ;
           _startINDEX++ ;
       var _trigger_automatic = safe_int( _trigger_chunk[_startINDEX], NO );
       if ( check_file_exists( _trigger_fullpath ) )
       {
          var _ret ;
          $.getScript( _trigger_fullpath, function( response, status )
                       {
                          if ( status.toLowerCase().stricmp( "success" ) )
                          {
                             if ( _trigger_fn.omits( "(" ) ) _trigger_fn += "( _silent, _out_channel )" ;
                             else if ( _trigger_fn.end_with( "()" ) ) _trigger_fn = _trigger_fn.replaceAll( "()", "( _silent, _out_channel )" );
                             eval( _trigger_fn );
                             _ret = RET_OK, _msg = "Trigger '"+_trigger_title+"' loaded and run with success" ;
                             if ( !_silent && _out_channel == OUTPUT_SCREEN )
														 circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, _msg, "circles_lib_triggers_outbox" ) ;
                          }
                          else
                          {
                             _ret = RET_ERROR, _msg = "Fail to load the trigger" ;
                             if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "circles_lib_triggers_outbox" ) ;
                          }
                       } );
          return [ _ret, _msg ] ;
       }
       else
       {
          _msg = "Archive error: unfound trigger resource" ;
          if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "circles_lib_triggers_outbox" ) ;
          return [ RET_ERROR, _msg ] ;
       }
    }
    else
    {
       _msg = "Archive error: invalid trigger reference" ;
       if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, _msg, "circles_lib_triggers_outbox" ) ;
       return [ RET_ERROR, _msg ] ;
    }
}

function circles_lib_triggers_open_all_automated_entries( _silent = NO, _out_channel = OUTPUT_SCREEN )
{
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _triggers_ids = _glob_triggers_table.keys_associative(), _ret = RET_OK, _ret_chunk = null ;
    var _fails = [], _report = [], _msg, _run_counter = 0, _auto ;
    $.each( _triggers_ids, function( _i, _trig_id )
            {
               _auto = safe_int( _glob_triggers_table[''+_trig_id][4], 0 ) ;
               _ret_chunk = _auto ? circles_lib_triggers_open( _trig_id, YES, _out_channel ) : null ;
               if ( is_array( _ret_chunk ) )
               {
                  _ret &= _ret_chunk[0] ;
                  if ( _ret_chunk[0] == RET_ERROR )
                  {
                     _fails.push( _glob_triggers_table[''+_trig_id][0] );
                  }
                  else _run_counter++ ;
                  _report.push( _ret_chunk[1] );
               } } );
    _msg = ( _run_counter == 0 ? "No" : ( _ret == RET_OK ? "All" : "Not all" ) ) + " automatic triggers have ben run with success" ;
    _msg += ( _ret == RET_ERROR ? ": " + _glob_crlf + _fails.join( ", " ) : "" ) ;
    if ( !_silent && _out_channel == OUTPUT_SCREEN )
	circles_lib_output( OUTPUT_SPECIAL_FX, _ret == RET_OK ? DISPATCH_SUCCESS : DISPATCH_ERROR, _msg, "circles_lib_triggers_outbox" ) ;
    return [ _ret, _msg, _fails, _run_counter, _report ] ;
}

function circles_lib_triggers_open_all( _silent = NO, _out_channel = OUTPUT_SCREEN )
{
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _triggers_ids = _glob_triggers_table.keys_associative(), _ret = RET_OK ;
    var _fails = [], _msg ;
    $.each( _triggers_ids, function( _i, _trig_id )
            {
               _ret_chunk = circles_lib_triggers_open( _trig_id, YES, _out_channel );
               _ret &= _ret_chunk[0] ;
               if ( _ret_chunk[0] == RET_ERROR ) _fails.push( _glob_triggers_table[''+_trig_id][0] );
            } );
    _msg = ( _ret == RET_OK ? "All" : "Not all" ) + " triggers have ben run with success" + ( _ret == RET_ERROR ? ": " + _glob_crlf + _fails.join( ", " ) : "" ) ;
    if ( !_silent && _out_channel == OUTPUT_SCREEN )
	circles_lib_output( OUTPUT_SPECIAL_FX, _ret == RET_OK ? DISPATCH_SUCCESS : DISPATCH_ERROR, _msg, "circles_lib_triggers_outbox" ) ;
    return [ _ret, _msg, _fails ] ;
}

function circles_lib_triggers_set_all_to_automated( _on, _silent, _out_channel )
{
    _on = safe_int( _on, YES ) ;
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _triggers_ids = _glob_triggers_table.keys_associative(), _msg ;
    $.each( _triggers_ids, function( _i, _trig_id ) { _glob_triggers_table[_trig_id][4] = _on ? YES : NO ; } ) ;
    _msg = "All triggers have ben switched "+( _on ? "on" : "off" )+" to 'auto' with success" ;
    if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, _msg, "circles_lib_triggers_outbox" ) ;
    return [ RET_OK, _msg ] ;
}