function circles_terminal_cmd_debug()
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
     var _file_type = 0 ; // 1 txt, 2 html
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

     var _out_file_contents = $("#CIRCLESdebugDIV").html();
         _out_text_string = _out_file_contents ;

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
             _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;
             _params_assoc_array['help'] = NO ;
             _params_assoc_array['action'] = "" ;
             _params_assoc_array['dump'] = NO ;
             _params_assoc_array['dump_array'] = null ;
             _params_assoc_array['dump_operator_index'] = UNDET ;
         
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "clean", "release", "html" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );

				 var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
				 _params_assoc_array['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
				 _params_assoc_array['dump_operator_index'] = _dump_operator_index ;
				 _params_assoc_array['dump_array'] = [];
				
				 // gather all dump parameters into one array
         if ( _params_assoc_array['dump'] )
         {
    				 for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
    				 if ( _params_array[_i].trim().length > 0 ) _params_assoc_array['dump_array'].push( _params_array[_i] );
         }
				 
         var _p ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "clean", "release" ) ) _params_assoc_array['action'] = _p ;
              else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
         }
         
         if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _output_channel );
         else if ( _params_assoc_array['keywords'] )
         {
             var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
             if ( _msg.length == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
             else
             {
                 _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                 circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
             }
         }
         else
         {
              var _action = _params_assoc_array['action'], _html = _params_assoc_array['html'] ;
              switch( _action.toLowerCase() )
              {
                  case "clean": CIRCLESformsTERMINALbatchcompilerCLEANdebug(YES); break ;
                  case "release":
                  circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
					        default: break ;
              }

              if ( _params_assoc_array['dump_array'].length > 0 || _html )
              {
                   _file_type = ( _params_assoc_array['dump_array'].includes_i( ".txt" ) ) ? 1 : 2 ; 
                   
                   if ( _html && _out_file_contents.length > 0 ) circles_lib_terminal_color_decode_htmltext( "<gray>" + _out_file_contents + "</gray>", 'debug', 'right', 'top' );
                   else
                   {
                           _file_type == ( _out_file_contents.includes( "</" ) ) ? 2 : 1 ;
                           if ( _file_type == 1 )
                           {
                                _out_file_contents = _out_file_contents.replaceAll( "<br>", _glob_crlf );
                                _out_file_contents = _out_file_contents.replaceAll( "&nbsp;", " " );
                                _out_file_contents = _out_file_contents.strip_tags();
                           }
                           else if ( _file_type == 2 ) // html
                           {
                                var HTMLcode = [] ;
                                    HTMLcode.push( "<html>", _par_1, _cmd_tag );
                                    HTMLcode.push( "<head>", _par_1, _cmd_tag );
                                    HTMLcode.push( "<title>Circles</title>", _par_1, _cmd_tag );
                                    HTMLcode.push( "</head>", _par_1, _cmd_tag );
                                    HTMLcode.push( "<body STYLE=\"margin:4px;background-color:#323232;color:lime;font-family:courier;font-size:8pt;\">", _par_1, _cmd_tag );
                                    HTMLcode.push( _out_file_contents );
                                    HTMLcode.push( "</body>", _par_1, _cmd_tag );
                                    HTMLcode.push( "</html>", _par_1, _cmd_tag );

                                _out_file_contents = HTMLcode.join( _glob_crlf );
                           }

                 			 var _filename = _params_assoc_array['dump_array'] ;

     								   _params_assoc_array['dump_array'] = is_array( _params_assoc_array['dump_array'] ) ? _params_assoc_array['dump_array'][0] : "debug.txt" ;
    									 var _ret_chunk = circles_lib_dump_data_to_format( _out_file_txt, _filename, ( _file_type == 2 ) ? "html" : "txt" );
    									 var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
    									 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation";
    									 if ( _ret_id == 0 )
    									 {
    												_b_fail = YES, _error_str = _ret_msg ;
    									 }
    									 else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                   }
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