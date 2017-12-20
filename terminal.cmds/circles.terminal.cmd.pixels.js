function circles_terminal_cmd_pixels()
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
     if ( _params.length > 0 )
     {
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _cmd_params['help'] = NO ;
         _cmd_params['keywords'] = NO ;
         _cmd_params['action'] = "" ;
         
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
         // pre-scan for levenshtein correction
    		 var _cmd_terms_dict = [];
    				 _cmd_terms_dict.push( "on", "off", "bomb", "size", "release", "html" );
         circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
				 var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
				 _cmd_params['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
				 _cmd_params['dump_operator_index'] = _dump_operator_index ;
				 _cmd_params['dump_array'] = [];
				
				 // gather all dump parameters into one array
         if ( _cmd_params['dump'] )
         {
    				 for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
    				 if ( _params_array[_i].trim().length > 0 ) _cmd_params['dump_array'].push( _params_array[_i] );
         }
				 
         var _p ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
              else if ( _p.is_one_of_i( "html", "silent" ) ) _cmd_params[_p] = YES ;
              else if ( _p.is_one_of_i( "bomb", "size", "release" ) ) _cmd_params['action'] = _p ;
              else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
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
 	  		 var _delete_pixels_array = function()
         {
            _glob_rec_canvas_entities_array.is_associative() ? _glob_rec_canvas_entities_array.flush_associative() : _glob_rec_canvas_entities_array.flush();
         };

				 switch( _action )
				 {
						case "bomb":
						var _size = safe_size( _glob_rec_canvas_entities_array, 0 );
						if ( _size == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "Pixels container is already empty", _par_1, _cmd_tag );
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
													                            if ( safe_size( _keys, 0 ) == 0 ) circles_lib_output( _out_channel, DISPATCH_SUCCESS, "All pixels have been deleted from memory", _par_1, _cmd_tag );
													                            else circles_lib_output( _out_channel, DISPATCH_WARNING, "Problems while deleting all pixels stored in memory. Please, retry.", _par_1, _cmd_tag );
																									}
					             	_params_array['ifquestiondisabled_fn'] = function() { _delete_pixels_array(); }
							if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
					        else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
						}
						break ;
            case "release":
            circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
            break ;
   					case "size":
						var _keys = _glob_rec_canvas_entities_array.keys_associative();
                var _size = 0 ;
                if ( safe_size( _keys ) > 0 )
                $.each( _keys, function( _i, _k ) { _size += _glob_rec_canvas_entities_array[ _k ].size_associative(); } );
								if ( _size == 0 )
							  circles_lib_output( _out_channel, DISPATCH_INFO, "No pixels are stored in memory", _par_1, _cmd_tag );
								else if ( _size > 0 )
							  circles_lib_output( _out_channel, DISPATCH_INFO, "There " + ( _size == 1 ? "is " : "are " ) + _size + " element" + ( _size == 1 ? "" : "s" ) + " stored in memory", _par_1, _cmd_tag );
					 break ;
           default: break ;
				 }
     }
     else if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );

     if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}