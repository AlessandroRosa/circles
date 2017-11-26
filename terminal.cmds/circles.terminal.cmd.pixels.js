function circles_terminal_cmd_pixels()
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
     if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['action'] = "" ;
         
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); 
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "on", "off", "bomb", "size", "release", "html" );
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
              else if ( _p.is_one_of_i( "bomb", "size", "release" ) ) _params_assoc_array['action'] = _p ;
              else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
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
     else if ( !_b_fail )
     {
				 var _action = _params_assoc_array['action'] ;
 	  		 var _delete_pixels_array = function()
         {
            _glob_rec_canvas_entities_array.is_associative() ? _glob_rec_canvas_entities_array.flush_associative() : _glob_rec_canvas_entities_array.flush();
         };

				 switch( _action )
				 {
						case "bomb":
						var _size = safe_size( _glob_rec_canvas_entities_array, 0 );
						if ( _size == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "Pixels container is already empty", _par_1, _cmd_tag );
					  else
					  {
                var _prompt_question = "Confirm to delete all pixels stored in memory ?" ;
			     		  var _params_array = [] ;
							     	  	_params_array['prepromptquestion'] = null ;
					             	_params_array['promptquestion'] = _prompt_question ;
					             	_params_array['yes_fn'] = function()
												 													{
													                            _delete_pixels_array();
													                            var _keys = _glob_rec_canvas_entities_array.keys_associative();
													                            if ( safe_size( _keys, 0 ) == 0 ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "All pixels have been deleted from memory", _par_1, _cmd_tag );
													                            else circles_lib_output( _output_channel, DISPATCH_WARNING, "Problems while deleting all pixels stored in memory. Please, retry.", _par_1, _cmd_tag );
																									}
					             	_params_array['ifquestiondisabled_fn'] = function() { _delete_pixels_array(); }
							if ( _glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
					        else circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
						}
						break ;
            case "release":
            circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
            break ;
   					case "size":
						var _keys = _glob_rec_canvas_entities_array.keys_associative();
                var _size = 0 ;
                if ( safe_size( _keys ) > 0 )
                $.each( _keys, function( _i, _k ) { _size += _glob_rec_canvas_entities_array[ _k ].size_associative(); } );
								if ( _size == 0 )
							  circles_lib_output( _output_channel, DISPATCH_INFO, "No pixels are stored in memory", _par_1, _cmd_tag );
								else if ( _size > 0 )
							  circles_lib_output( _output_channel, DISPATCH_INFO, "There " + ( _size == 1 ? "is " : "are " ) + _size + " element" + ( _size == 1 ? "" : "s" ) + " stored in memory", _par_1, _cmd_tag );
					 break ;
           default: break ;
				 }
     }
     else if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );

     if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}