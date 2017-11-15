function circles_terminal_cmd_target()
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
     var _long_mode = 0 ;
     var _help = NO ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];
     var _keywords_array = [ "grid", "figures", "rendering" ] ;
     
		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['layer'] = "" ;
         _params_assoc_array['plane'] = _glob_target_plane ;
         _params_assoc_array['service'] = "" ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); 

         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "assign", "create", "reset", "list", "zplane", "wplane", "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "assign", "create", "reset", "list", "release" ) ) _params_assoc_array['action'] = _p ;
              else if ( _p.is_one_of_i( "zplane", "wplane" ) ) _params_assoc_array['plane'] = _p ;
              else
              {
                   if ( _p.start_with_i( "service:" ) ) _params_assoc_array['service'] = _p.replaceAll( "service:", "" );
                   else if ( _p.start_with_i( "layer:" ) ) _params_assoc_array['layer'] = _p.replaceAll( "layer:", "" );
              }
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
             var _plane_ref = _params_assoc_array['plane'] ;
             var _plane_type = circles_lib_plane_get_def( _plane_ref );
             var _layer_ref = safe_string( _params_assoc_array['layer'], "" );
             var _service_ref = safe_string( _params_assoc_array['service'], "" );
             if ( _action.length > 0 )
             {
                  switch( _action )
                  {
                       case "release":
                       circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                       break ;
                       case "assign":
                       if ( _plane_type == NO_PLANE )
                       {
                            _b_fail = YES, _error_str = "Target assignment failure: missing input plane" ;
                       }
                       else if ( _layer_ref.length == 0 )
                       {
                            _b_fail = YES, _error_str = "Target assignment failure: missing input layer" ;
                       }
                       else if ( _service_ref.length == 0 )
                       {
                            _b_fail = YES, _error_str = "Target assignment failure: missing input service" ;
                       }
                       else if ( !circles_lib_canvas_get_exists( _plane_type, _service_ref ) )
                       {
                            _b_fail = YES, _error_str = "Target assignment failure: no service '"+_service_ref+"' found in the "+_plane_def+" services list" ;
                       }
                       else if ( !circles_lib_canvas_get_exists( _plane_type, _service_ref ) )
                       {
                            _b_fail = YES, _error_str = "Target assignment failure: no service '"+_service_ref+"' found in the "+_plane_def+" services list" ;
                       }
                       else
                       {
                            var _canvas = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_DEF, _layer_ref );
                            if ( is_html_canvas( _canvas ) )
                            {
                                if ( _plane_type == Z_PLANE ) _glob_target_zplane_layers_array[ _service_ref ] = _canvas ;
                                else if ( _plane_type == W_PLANE ) _glob_target_wplane_layers_array[ _service_ref ] = _canvas ;
                                circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Target for "+_plane_ref+"/"+_service_ref+" has been assigned to '"+_layer_ref+"' with success", _par_1, _cmd_tag );
                            }
                            else
                            {
                                _b_fail = YES, _error_str = "Target assignment failure: '"+_params_assoc_array['layer']+"' is not included inside the "+_plane_ref+" pile" ;
                            }
                       }
                       break;
                       case "create":
                       if ( _params_assoc_array['plane'] == NO_PLANE )
                       {
                            _b_fail = YES, _error_str = "Target creation failure: missing input plane" ;
                       }
                       else if ( _params_assoc_array['layer'].length == 0 )
                       {
                            _b_fail = YES, _error_str = "Target creation failure: Missing input layer" ;
                       }
                       else
                       {
                           if ( _keywords_array.includes( _service_ref ) )
                           {
                                _b_fail = YES, _error_str = "Target creation failure: '"+_service_ref+"' is a special keyword and can't be used for creating new targets" ;
                           }
                           else if ( !_service_ref.testME( _glob_varid_regex_pattern ) )
                           {
                                _b_fail = YES, _error_str = "Target creation failure: '"+_service_ref+"' includes illegal chars" ;
                           }
                           else
                           {
                                var _canvas = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_DEF, _layer_ref );
                                if ( is_html_canvas( _canvas ) )
                                {
                                     if ( _plane_type == Z_PLANE ) _glob_target_zplane_layers_array[ _service_ref ] = _canvas ;
                                     else if ( _plane_type == W_PLANE ) _glob_target_wplane_layers_array[ _service_ref ] = _canvas ;
                                     circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Target for "+_plane_ref+"/"+_service_ref+" has been set up with success", _par_1, _cmd_tag );
                                }
                                else
                                {
                                     _b_fail = YES, _error_str = "Target creation failure: '"+_service_ref+"' is not included inside the "+_plane_ref+" pile" ;
                                }
                           }
                       }
                       break ;
                       case "list":
                       var _keys, _values, _out_row ;
                       _keys = _glob_target_zplane_layers_array.keys_associative();
                       _values = _glob_target_zplane_layers_array.values_associative();
                       
                       var _html_table = "<table>" ;
                           _html_table += "<tr><td COLSPAN=\"5\">Current plane target is : "+circles_lib_plane_get_def( _glob_target_plane )+"</td></tr>" ;
                           _html_table += "<tr><td COLSPAN=\"5\" STYLE=\"color:lightblue;\">Target Z-plane layers list</td></tr>" ;
                           _html_table += "<tr>" ;
                           _html_table += "<td STYLE=\"color:yellow;\">Service</td>" ;
                           _html_table += "<td WIDTH=\"10\"></td>" ;
                           _html_table += "<td STYLE=\"color:yellow;\">Layer targets</td>" ;
                           _html_table += "<td WIDTH=\"10\"></td>" ;
                           _html_table += "<td STYLE=\"color:yellow;\">Default</td>" ;
                           _html_table += "</tr>" ;
                       for( var _i = 0 ; _i < _keys.length ; _i++ )
                       {
                           _html_table += "<tr>" ;
                           _html_table += "<td STYLE=\"color:lightblue;\">"+_keys[_i]+"</td>" ;
                           _html_table += "<td WIDTH=\"10\"></td>" ;
                           _html_table += "<td STYLE=\"color:snow;\">"+_values[_i].get_role_def()+"</td>" ;
                           _html_table += "<td WIDTH=\"10\"></td>" ;
                           _html_table += "<td STYLE=\"color:snow;\">"+( _values[_i].is_defaultcanvas() ? "yes" : "no" )+"</td>" ;
                           _html_table += "</tr>" ;
                       }
                           _html_table += "</table>" ;
                           circles_lib_terminal_html_display( _glob_terminal, _html_table );
                           
                       circles_lib_output( _output_channel, DISPATCH_INFO, _glob_crlf, _par_1, _cmd_tag );

                           _html_table = "<table>" ;
                           _html_table += "<tr><td COLSPAN=\"5\" STYLE=\"color:lightblue;\">Target W-plane layers list</td></tr>" ;
                           _html_table += "<tr>" ;
                           _html_table += "<td STYLE=\"color:yellow;\">Service</td>" ;
                           _html_table += "<td WIDTH=\"10\"></td>" ;
                           _html_table += "<td STYLE=\"color:yellow;\">Layer targets</td>" ;
                           _html_table += "<td WIDTH=\"10\"></td>" ;
                           _html_table += "<td STYLE=\"color:yellow;\">Default</td>" ;
                           _html_table += "</tr>" ;

                       _keys = _glob_target_wplane_layers_array.keys_associative();
                       _values = _glob_target_wplane_layers_array.values_associative();
                       for( var _i = 0 ; _i < _keys.length ; _i++ )
                       {
                           _html_table += "<tr>" ;
                           _html_table += "<td STYLE=\"color:lightblue;\">"+_keys[_i]+"</td>" ;
                           _html_table += "<td WIDTH=\"10\"></td>" ;
                           _html_table += "<td STYLE=\"color:snow;\">"+_values[_i].get_role_def()+"</td>" ;
                           _html_table += "<td WIDTH=\"10\"></td>" ;
                           _html_table += "<td STYLE=\"color:snow;\">"+( _values[_i].is_defaultcanvas() ? "yes" : "no" )+"</td>" ;
                           _html_table += "</tr>" ;
                       }
                           _html_table += "</table>" ;
                           circles_lib_terminal_html_display( _glob_terminal, _html_table );
                       break ;
                       case "reset":
                       var _pre_prompt = "Be careful: all previous settings will be definitely lost." + _glob_crlf ;
                       var _prompt_question = "Confirm to reset to default targets ?" ;
                       var reset_fn = function()
                       {
                            _glob_target_zplane_layers_array = [] ;
                            _glob_target_zplane_layers_array['grid'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
                            _glob_target_zplane_layers_array['rendering'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
                            _glob_target_zplane_layers_array['figures'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );

                            _glob_target_wplane_layers_array = [] ;
                            _glob_target_wplane_layers_array['grid'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
                            _glob_target_wplane_layers_array['rendering'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
                            _glob_target_wplane_layers_array['figures'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
                            circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Targets have been reset to default settings with success", _par_1, _cmd_tag );
                       }

						     		   var _params_array = [] ;
								     	  	 _params_array['prepromptquestion'] = _pre_prompt ;
							             _params_array['promptquestion'] = _prompt_question ;
							             _params_array['yes_fn'] = function() { reset_fn(); }
							             _params_array['ifquestiondisabled_fn'] = function() { reset_fn(); }
						           circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                       break ;
                       default: break ;
                  }
             }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
     }
     
     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}