function circles_terminal_cmd_bk()
{
    var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
    var _params = arguments[0] ;
    var _output_channel = arguments[1] ;
    var _par_1 = arguments[2] ;
    var _cmd_mode = arguments[3] ;
    var _caller_id = arguments[4] ;
    _params = safe_string( _params, "" ).trim();

    if ( _glob_verbose && _glob_terminal_echo_flag )
    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

	var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _params_assoc_array = [];

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    else if ( _params.length > 0 )
    {
        _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
        _params_assoc_array['keywords'] = NO ;
        _params_assoc_array['help'] = NO ;
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); 
        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [];
    	_local_cmds_params_array.push( "default", "release", "reset", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
            else if ( _p.is_one_of_i( "default", "reset" ) ) _params_assoc_array['bkcolor'] = DEFAULT_TERMINAL_BKCOLOR ;
            else if ( circles_lib_colors_is_def( _p ) ) _params_assoc_array['bkcolor'] = _p ;
            else
            {
                _b_fail = YES ;
                _error_str = "Unknown param '"+_p+"'" ;
            }
         }

         if ( _params_assoc_array['keywords'] )
         {
            var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
            if ( _msg.length == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
            else
            {
                _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
            }
         }
         else if ( _params_assoc_array['help'] )
         {
              jQuery.get( _glob_terminal_help_path + _cmd_tag + ".cmd.hlp", function( _help_text ) {
                          _help_text += _glob_crlf ;
                          var _columns = 5, _counter = 0, _color_name = "", _row = "" ;
                               for( var _key in def_clrs_tags )
                               {
                                   if ( _key.includes( "tag." ) )
                                   {
                                      _color_name = _key.replaceAll( "tag.", "" );
                                      _p_color = def_clrs_tags[_key] ;
                                      _color_tagged_entry = "<"+_color_name+">" + _color_name + "</"+_color_name+">" ;
                                      _color_name = _color_tagged_entry + ( new String( " ").repeat( 16 - _color_name.length ) );
                                      _row += _color_name ;
                                      _counter++ ;
                                      if ( _counter == _columns )
                                      {
                                         _help_text += _row + _glob_crlf ;
                                         _counter = 0 ;
                                         _row = "" ;
                                      }
                                   }
                               }

                               if ( _counter != _columns )
                               {
                                  _help_text += _row + _glob_crlf ;
                                  _counter = 0 ;
                                  _row = "" ;
                               }

                             if ( _params_assoc_array['html'] ) circles_lib_output( _output_channel, DISPATCH_INFO, LANG_MSG_00, _par_1, _cmd_tag );
                             _params_assoc_array['html'] ? circles_lib_terminal_color_decode_htmltext( _help_text, _cmd_tag ) : circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _help_text, _par_1, _cmd_tag );
                          },
                          'html');
         }
         else if ( !_b_fail )
         {
            var _action = _params_assoc_array['action'] ;
			console.log( _params_assoc_array );
            switch( _action )
            {
                case "release":
                circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                default:
                $("#"+_glob_terminal_current_id).css( "background-color", _params_assoc_array['bkcolor'] );
                $("#"+_glob_terminal_current_id).css( "opacity", DEFAULT_OPACITY );
                $("#"+_glob_terminal_current_id).css( "-moz-opacity", DEFAULT_OPACITY );
                $("#"+_glob_terminal_current_id).css( "filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity="+( DEFAULT_OPACITY * 100 )+")" );
                $("#"+_glob_terminal_current_id).css( "-ms-filter", "alpha(opacity="+( DEFAULT_OPACITY * 100 )+")" );
                break ;
            }
         }
    }
    else
    {
        _b_fail = YES ;
        _error_str = "Missing input params" ;
    }
    
    if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}