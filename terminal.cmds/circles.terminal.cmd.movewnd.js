function circles_terminal_cmd_movewnd()
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

	var _last_release_date = get_file_modify_date( _glob_paths['terminal_abs_cmds'], "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    else if ( _params.length > 0 )
    {
       _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
       _cmd_params['keywords'] = NO ;
       _cmd_params['help'] = NO ;
       _cmd_params['wnd'] = [] ;
       _cmd_params['coords'] = [] ;

       var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
       _params_array.clean_from( " " ); _params_array.clean_from( "" ); _params_array.clean_from( "" );
       // pre-scan for levenshtein correction
		var _cmd_terms_dict = [ "list", "release", "html", "help" ];
       circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
       var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
              else if ( _p.is_one_of_i( "list", "release" ) ) _cmd_params['action'] = _p ;
              else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
              else if ( /\d+/g.test( _p ) || _p.is_one_of( "left", "top", "right", "bottom" ) ) _cmd_params['coords'].push( _p ) ;
              else if ( /\w+/g.test( _p ) ) _cmd_params['wnd'].push( _p ) ;
              else { _b_fail = YES ; _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
         }
    }

    if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
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
    else if ( !_b_fail )
    {
        var _action = _cmd_params['action'] ;
        switch( _action )
        {
            case "release":
            circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
            break ;
            case "list":
            var _cols_width = [ 9, 14, 25, 30, 10 ], _startINDEX = 0, _row = "" ;
              	_row = "<lightgray>Currently open pop-up windows</lightgray>" ;
                _row += _glob_crlf + "<snow>"+( new String( "Visible" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</snow>" ;
                _startINDEX++ ;
                _row += "<lightblue>"+( "Subset" ).rpad( " ", _cols_width[_startINDEX] ) + "</lightblue>" ;
                _startINDEX++ ;
                _row += "<white>"+( "Name" ).rpad( " ", _cols_width[_startINDEX] ) + "</white>" ;
                _startINDEX++ ;
                _row += "<lightblue>"+( "Popup caption" ).rpad( " ", _cols_width[_startINDEX] ) + "</lightblue>" ;
                _startINDEX++ ;
                _row += "<lightblue>"+( "Active" ).rpad( " ", _cols_width[_startINDEX] ) + "</lightblue>" ;
            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
            var _subset, _base_id, _caption, _visible ;
            $.each( _glob_popups_array, function( _i, _chunk ) {
                    _base_id = _chunk[12], _caption = _chunk[2], _visible = _chunk[4], _subset = _chunk[8] ;
                    _startINDEX = 0 ;
                    _row = "<"+(_visible?"green":COLOR_ERROR)+">"+(_visible?"yes":"no").rpad( " ", _cols_width[_startINDEX] )+"</"+(_visible?"green":COLOR_ERROR)+">" ;
                    _startINDEX++ ;
  					_row += "<lightblue>"+_subset.rpad( " ", _cols_width[_startINDEX] )+"</lightblue>" ;
                    _startINDEX++ ;
  					_row += "<white>"+_base_id.rpad( " ", _cols_width[_startINDEX] )+"</white>" ;
                    _startINDEX++ ;
                    _row += "<lightblue>"+_caption.rpad( " ", _cols_width[_startINDEX] )+"</lightblue>" ;
                    _startINDEX++ ;
                    _row += ""+(_chunk[6]?"<lime>Yes</lime>":"<slategray>No</slategray>") ;
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                    } );
            break ;
            default:
            if ( _cmd_params['coords'].length == 2 && _cmd_params['wnd'].length == 2 )
            {
                var _subset = _cmd_params['wnd'][0], _base_id = _cmd_params['wnd'][1] ;
                var _popup_obj = circles_lib_plugin_find_wnd( { subset : _subset, base_id : _base_id }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID ) ;
                if ( _popup_obj != null )
                circles_lib_plugin_move_wnd( _popup_obj[1], _cmd_params['coords'][0], _cmd_params['coords'][1] );
                else
                circles_lib_output( _out_channel, DISPATCH_ERROR, "Fail to move: the input popup does not exist", _par_1, _cmd_tag );
            }
            else
            {
               _b_fail = YES, _error_str = "" ;
               if ( _cmd_params['coords'].length != 2 )
               _error_str += "Only two coordinates are required to move a window" ;
               if ( _cmd_params['wnd'].length != 2 )
               _error_str += "Please, input popup name specification according to syntax : <popup-subset> <popup-name>" ;
            }
            break ;
        }
    }

    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}