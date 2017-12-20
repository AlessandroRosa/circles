function circles_terminal_cmd_dev()
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
     var _plane = "" ;
     var _fn_ret_val = null ;
     var _cmd_params = [];
     var _out_stream = [] ;

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
        _cmd_params['help'] = NO ;
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['keywords'] = NO ;
        _cmd_params['all'] = NO ;
        _cmd_params['action'] = "" ;
        _cmd_params['extras'] = [] ;
        _cmd_params['index'] = [] ;
        _cmd_params['labels'] = [] ;
        _cmd_params['roundto'] = _glob_accuracy ;

        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 

 			  var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
	 		  _cmd_params['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
			  _cmd_params['dump_operator_index'] = _dump_operator_index ;
			  _cmd_params['dump_array'] = [];

         // pre-scan for levenshtein correction
    		 var _cmd_terms_dict = [];
    				 _cmd_terms_dict.push( "datatypes" );
         _cmd_terms_dict = _cmd_terms_dict.concat( _glob_storage.keys_associative() );
         circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
         var _p ;
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
            _p = _params_array[_i].trim() ;
            if ( safe_size( _p, 0 ) == 0 ) continue ;
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "datatypes" ) ) _cmd_params['action'] = _p.toLowerCase();
			else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
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
                    case "datatypes":
                    circles_lib_files_load_default_datatypes();
                    circles_lib_output( _out_channel, DISPATCH_INFO, "Currently registered datatypes", _par_1, _cmd_tag );
                    circles_lib_output( _out_channel, DISPATCH_INFO, "\n", _par_1, _cmd_tag );
                    var _datatypes = circles_lib_datatype_get_table(YES), _notes_rows, _keys ;
                    var _columns = [], _out, _keys, _startINDEX = 0 ;
                        _columns.push( [ "Datatype", 12, "white" ] );
                        _columns.push( [ "Constructor", 40, "lightblue" ] );
                        _columns.push( [ "Notes (constructor)", 24, "white" ] );
                        _columns.push( [ "Notes (object)", 35, "lightgray" ] );

  									// compute max length per each column
                    $.each( _datatypes, function( _i, _item ) {
                        _keys = _item.keys_associative();
                        for( var _k = 0 ; _k < _keys.length ; _k++ )
                        {
                            if ( _keys[_k].toLowerCase() == "datatype_public" )
                            _columns[0][1] = Math.max( _columns[0][1], _item['datatype_public'].trim().length );
                            else if ( /^constructor[0-9]+/.test( _keys[_k] ) )
                            _columns[1][1] = Math.max( _columns[1][1], _item[ _keys[_k] ].trim().length );
                            else if ( /^notes_constructor[0-9]+/.test( _keys[_k] ) )
                            _columns[2][1] = Math.max( _columns[2][1], _item[ _keys[_k] ].trim().length );
                        }
                    } );
                    
                    var _full_width = 0 ;
                    _columns[0][1] += 2 ;
                    _full_width += _columns[0][1] ;
                    _columns[1][1] += 2 ;
                    _full_width += _columns[1][1] ;
                    _columns[2][1] += 2 ;
                    _full_width += _columns[2][1] ;
                    _full_width += _columns[3][1] ;
                    
                    _out = "<"+_columns[0][2]+">" + ( _columns[0][0] ).rpad( " ", _columns[0][1] ) + "</"+_columns[0][2]+">" ;
                    _out += "<"+_columns[1][2]+">" + ( _columns[1][0] ).rpad( " ", _columns[1][1] ) + "</"+_columns[1][2]+">" ;
                    _out += "<"+_columns[2][2]+">" + ( _columns[2][0] ).rpad( " ", _columns[2][1] ) + "</"+_columns[2][2]+">" ;
                    _out += "<"+_columns[3][2]+">" + ( _columns[3][0] ).rpad( " ", _columns[3][1] ) + "</"+_columns[3][2]+">" ;
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _out, _par_1, _cmd_tag );
                    circles_lib_output( _out_channel, DISPATCH_INFO, "\n", _par_1, _cmd_tag );

  									$.each( _datatypes,
										function( _i, _item )
										{
                        _startINDEX = 0 ;
                        if ( _item['datatype_public'] != null )
                        _out =  "<"+_columns[_startINDEX][2]+">" + _item['datatype_public'].trim().rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                        else
                        _out = "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                        
                        _startINDEX++ ;
                        if ( _item['constructor1'] != null )
                        _out += "<"+_columns[_startINDEX][2]+">" + _item['constructor1'].trim().rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                        else
                        _out += "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;

                        _startINDEX++ ;
                        if ( _item['notes_constructor1'] != null )
                        _out += "<"+_columns[_startINDEX][2]+">" + _item['notes_constructor1'].trim().rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                        else
                        _out += "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;

                        _startINDEX++ ;
                        if ( _item['notes'] != null )
                        {
                             _notes_rows = _item['notes'].length > _columns[3][1] ? _item['notes'].match(new RegExp( ".{1,"+_columns[_startINDEX][1]+"}", "g" )) : [ _item['notes'] ] ;
                             _out += "<"+_columns[_startINDEX][2]+">" + _notes_rows[0].trim().rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                        }
                        else
                        _out += "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                        
                        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _out, _par_1, _cmd_tag );
                        
                        // count more constructor keys
                        _keys = _item.keys_associative();
                        var _k = 0, _k_cnt = 0 ;
                        for( _k = 0 ; _k < _keys.length ; _k++ ) if ( _keys[_k].start_with( "constructor" ) ) _k_cnt++ ;
                        
                        _k_cnt = Math.max( _k_cnt, _notes_rows.length );
                        
                        for( _k = 1 ; _k < _k_cnt ; _k++ )
                        {
                            _startINDEX = 0 ;
                            _out =  "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;

                            _startINDEX++ ;
                            if ( _item['constructor'+(_k+1)] != null )
                            _out += "<"+_columns[_startINDEX][2]+">" + _item['constructor'+(_k+1)].trim().rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                            else
                            _out += "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;

                            _startINDEX++ ;
                            if ( _item['notes_constructor'+(_k+1)] != null )
                            _out += "<"+_columns[_startINDEX][2]+">" + _item['notes_constructor'+(_k+1)].trim().rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                            else
                            _out += "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;

                            _startINDEX++ ;
                            if ( _notes_rows[_k] != null )
                            _out += "<"+_columns[_startINDEX][2]+">" + _notes_rows[_k].trim().rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                            else
                            _out += "<"+_columns[_startINDEX][2]+">" + ( new String( "" ) ).rpad( " ", _columns[_startINDEX][1] ) + "</"+_columns[_startINDEX][2]+">" ;
                            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _out, _par_1, _cmd_tag );
                        }
                        
                        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, ("<lightgray>"+ new String( "" ) ).rpad( "-", _full_width )+"</lightgray>", _par_1, _cmd_tag );
                    }
                    );
                    break ;
                    default:
                    if ( !_extras.includes( "export" ) ) { _b_fail = YES, _error_str = "Unknown action '"+_action+"'" ; }
                    break ;
              }
         }
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}