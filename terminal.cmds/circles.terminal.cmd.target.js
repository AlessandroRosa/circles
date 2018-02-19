function circles_terminal_cmd_target()
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
     var _long_mode = 0 ;
     var _help = NO ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _cmd_params = [];
     var _keywords_array = [ "grid", "figures", "rendering" ] ;
     
		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _cmd_params['help'] = NO ;
         _cmd_params['keywords'] = NO ;
         _cmd_params['action'] = "" ;
         _cmd_params['layer'] = "" ;
         _cmd_params['plane'] = _glob_target_plane ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 

         // pre-scan for levenshtein correction
    		 var _cmd_terms_dict = [];
    				 _cmd_terms_dict.push( "assign", "reset", "list", "zplane", "wplane", "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
              else if ( _p.is_one_of_i( "html", "silent" ) ) _cmd_params[_p] = YES ;
              else if ( _p.is_one_of_i( "assign", "reset", "list", "release" ) ) _cmd_params['action'] = _p ;
              else if ( _p.is_one_of_i( "zplane", "wplane" ) ) _cmd_params['plane'] = _p ;
              else if ( _p.start_with_i( "layer:" ) ) _cmd_params['layer'] = _p.replaceAll( "layer:", "" );
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
             var _plane_ref = _cmd_params['plane'] ;
             var _plane_type = circles_lib_plane_def_get( _plane_ref );
             var _layer_ref = safe_string( _cmd_params['layer'], "" );
             if ( _action.length > 0 )
             {
                  switch( _action )
                  {
                       case "release":
                       circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                       break ;
                       case "list":
                       var _keys, _values, _out_row ;
                       _keys = _glob_target_zplane_layers_array.keys_associative();
                       _values = _glob_target_zplane_layers_array.values_associative();
                       
                       var _html_table = "<table>" ;
                           _html_table += "<tr><td COLSPAN=\"5\">Current plane target is : "+circles_lib_plane_def_get( _glob_target_plane )+"</td></tr>" ;
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
                           
                       circles_lib_output( _out_channel, DISPATCH_INFO, _glob_crlf, _par_1, _cmd_tag );

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
                            _glob_target_zplane_layers_array['work'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );

                            _glob_target_wplane_layers_array = [] ;
                            _glob_target_wplane_layers_array['grid'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
                            _glob_target_wplane_layers_array['rendering'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
                            _glob_target_wplane_layers_array['figures'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
                            _glob_target_wplane_layers_array['work'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );
                            circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Targets have been reset to default settings with success", _par_1, _cmd_tag );
                       }

						var _params_array = [] ;
						_params_array['prepromptquestion'] = _pre_prompt ;
						_params_array['promptquestion'] = _prompt_question ;
						_params_array['yes_fn'] = function() { reset_fn(); }
						_params_array['ifquestiondisabled_fn'] = function() { reset_fn(); }
					   if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
					   circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                       break ;
                       default:
					   var _mask = _cmd_params['plane'].is_one_of( Z_PLANE, W_PLANE ) ? 1 : 0 ;
					   var _layer = _mask == 1 ? circles_lib_canvas_layer_find( _cmd_params['plane'], FIND_LAYER_BY_ROLE_DEF, _cmd_params['layer'] ) : null ;
					   if ( _layer != null ) _mask |= 2 ;
					   if ( _mask == (1|3) )
					   {
						   _glob_target_plane = _layer ;
						   circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Target for plane "+_cmd_params['plane']+" has been set with success to '"+_cmd_params['layer']+"'", _par_1, _cmd_tag );
					   }
					   else
					   {
						   if ( ( _mask & 1 ) == 0 )
						   circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing plane input to set the target", _par_1, _cmd_tag );
						   if ( ( _mask & 2 ) == 0 )
						   circles_lib_output( _out_channel, DISPATCH_WARNING, "Missing layer input to set the target", _par_1, _cmd_tag );
					   }
					   break ;
                  }
             }
         }
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }
     
     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}