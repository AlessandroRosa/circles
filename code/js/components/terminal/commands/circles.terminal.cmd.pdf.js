function circles_terminal_cmd_pdf()
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
     var _context_plane_label = "" ;
     var _help = NO ;
     var _fn_ret_val = null ;
     var _out_text_string = "" ;

     var _params_assoc_array = [];
         _params_assoc_array['dump'] = NO ;
         _params_assoc_array['dump_array'] = null ;
         _params_assoc_array['dump_operator_index'] = UNDET ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "bip", "wplane", "zplane", "none", "showcanvas", "silent", "release", "html" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );

				 var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_FROM );
				 _params_assoc_array['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
				 _params_assoc_array['dump_operator_index'] = _dump_operator_index ;
				 _params_assoc_array['dump_array'] = [];
				 _params_assoc_array['dump_cmd_mode'] = TERMINAL_CMD_MODE_PASSIVE ;

         var _p ;
         var _limit = ( _params_assoc_array['dump'] ) ? _dump_operator_index : _params_array.length ;
         for( var _i = 0 ; _i < _limit ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.stricmp( "showcanvas" ) ) _params_assoc_array['showcanvas'] = YES ;
              else if ( _p.stricmp( "silent" ) ) _params_assoc_array['silent'] = YES ;
         }

         if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
         else if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _output_channel );
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
         else if ( !_params_assoc_array['dump'] && !_b_fail )
         {
             _b_fail = YES, _error_str = "Syntax error: no dump-from (<-) operator input" ;
         }
         else
         {
             var _action = _params_assoc_array['action'] ;
             switch( _action )
             {
                 case "release":
                 circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                 break ;
                 default:
        				 // gather all dump parameters into one array
                 var _token ;
                 var _caller_type = CALLER_TYPE_CMD ;
         				 for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
                 {
                     _token = _params_array[_i].trim();
             				 if ( _token.length > 0 )
                     {
                          if ( !_token.is_one_of( "html", "zplane", "wplane" ) )
                              _params_assoc_array['dump_array'].push( _token );
                          else if ( _token.is_one_of( "zplane", "wplane" ) )
                          {
                              _caller_type = CALLER_TYPE_CANVAS ;
                              _params_assoc_array['dump_array'].push( _token );
                          }
                          else circles_lib_output( _output_channel, DISPATCH_INFO, "Detected and skipped '"+_p+"' tag", _par_1, _cmd_tag );
                     }
                 }

                 if ( _params_assoc_array['dump_array'].length > 0 )
                 {
                       switch( _caller_type )
                       {
                            case CALLER_TYPE_CMD:
                            var _cmd = _params_assoc_array['dump_array'].join( " " );
                            var _parsed_array = circles_lib_terminal_parse_cmd( _cmd );
                            var _ret_chunk = circles_lib_terminal_load_cmd( _parsed_array['cmd'], _parsed_array['params'], OUTPUT_TEXT, TERMINAL_CMD_MODE_PASSIVE, "pdf" );
                            if ( safe_size( _ret_chunk, 0 ) > 0 )
                            {
                                 var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO
                                 var _ret_data = _ret_chunk[1] ;
                                 var _cmd_ref = _params_assoc_array['dump_array'][0].toLowerCase();
                                 circles_lib_output( _output_channel, DISPATCH_INFO, "processing "+_cmd_ref+" cmd", _par_1, _cmd_tag );
                                 var _filename = "" ;
                                 if ( _ret_id )
                                 {
                                     var _return_datatype = "" ;
                                     _filename = ( _glob_export_filename.length == 0 ) ? "circles." + _cmd_ref + ".pdf" : _glob_export_filename ;
                                     if ( !( _glob_export_filename.toLowerCase().right( 4 ).strcmp( ".pdf" ) ) ) _filename += ".pdf" ;
                                     switch( _cmd_ref )
                                     {
                                         case "canvas":
                                         _return_datatype = "text" ;
                                         _ret_data = "Canvas list" + _glob_crlf + _ret_data ;
                                         // turn all colors tag to 'black'
                                         _ret_data = _ret_data.replace( /<([A-Z]{1,})>/ig, "<black>" );
                                         _ret_data = _ret_data.replace( /<\/([A-Z]{1,})>/ig, "</black>" );
                                         break ;
                                         case "debug":
                                         _return_datatype = "text" ;
                                         _ret_data = "Debug<br>" + _ret_data ;
                                         _ret_data = _ret_data.replaceAll( "<br>", _glob_crlf );
                                         _ret_data = _ret_data.replaceAll( "&nbsp;", " " );
                                         break ;
                                         case "dict":
                                         _return_datatype = "text" ;
                                         _ret_data = _ret_data.replaceAll( "yellow", DEFAULT_COLOR_STD );
                                         break ;
                                         case "config":
                                         _return_datatype = "text" ;
                                         _ret_data = _ret_data.replaceAll( "lightblue", DEFAULT_COLOR_STD).replaceAll( "lavender", DEFAULT_COLOR_STD).replaceAll( "banana", "blue" );
                                         break ;
																         default: break ;
                                     }
    
                                     var _silent = _params_assoc_array['silent'] != null ? _params_assoc_array['silent'] : _glob_terminal_silent ;
                                     var _include_canvas = _params_assoc_array['showcanvas'] != null ? YES : NO
                                     _glob_text = _ret_data ;
                                     if ( _glob_text.length > 0 )
                                     {
                                         circles_lib_output( _output_channel, DISPATCH_INFO, "saving code into pdf file", _par_1, _cmd_tag );
                                         if ( _return_datatype == "text" )
                                         circles_lib_files_pdf_save_ask( circles_lib_files_pdf_save_text, _silent, _output_channel, CALLER_TYPE_CMD, '_glob_text', _filename, _include_canvas,_cmd_ref );
                                     }
                                     else
                                     {
                                         _b_fail = YES, _error_str = "Returning empty data: no PDF will be generated" ;
                                         if ( _glob_verbose && circles_lib_count_items() == 0 )
                                         _error_str += _glob_crlf + _ERR_33_01 + ": no maps, no disks" ;
                                     }
                                 }
                                 else
                                 {
                                     _b_fail = YES, _error_str = _ret_data ;
                                 }
                            }
                            else
                            {
                               _b_fail = YES, _error_str = "Return data failure" ;
                            }
                            break ;
                            case CALLER_TYPE_CANVAS:
                            var _dump_params_array = _params_assoc_array['dump_array'] ;
                            var _plane_def = _dump_params_array[0], _plane_type = NO_PLANE ;
                            var _layer_role_def = _dump_params_array[1] ;
                                if ( _plane_def.stricmp( "zplane" ) ) _plane_type = Z_PLANE ;
                                else if ( _plane_def.stricmp( "wplane" ) ) _plane_type = W_PLANE ;
                            var _filename = ( _glob_export_filename.length == 0 ) ? "circles."+_plane_def+".canvas.pdf" : _glob_export_filename ;
                                if ( !( _glob_export_filename.toLowerCase().right( 4 ).strcmp( ".pdf" ) ) ) _filename += ".pdf" ;
                            var _cmd_ref = "" ; // leave it blank here
                            var _canvas_role = "" ; // find role
    
                            var _ret_layer = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_DEF, _layers_role_def );
                            if ( _ret_layer == null )
                            {
                                _b_fail = YES, _error_str = "Missing canvas role reference" ;
                            }
                            else
                            {
                                 var _canvas_role = _ret_layer.get_role_id() ;
                                 circles_lib_files_pdf_save_ask( circles_lib_files_pdf_save_canvas, _silent, _output_channel, CALLER_TYPE_CANVAS, _filename, _canvas_role, _cmd_ref );
                            }
                            break ;
										        default: break ;
                       }
                 }
                 else
                 {
                    _b_fail = YES, _error_str = "Missing data origin on the right of dump-from operator" ;
                 }
                 break ;
             }
         }
         

     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}