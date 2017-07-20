function circles_terminal_cmd_print()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose )
     circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['var'] = [] ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.trim().length > 0 ) _params_assoc_array['var'].push( _p.trim() );
         }

         if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _out_channel );
         else if ( _params_assoc_array['keywords'] )
         {
             var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
             if ( _msg.length == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
             else
             {
                 _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                 circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
             }
         }
         else if ( !_b_fail )
         {
             var _action = safe_string( _params_assoc_array['action'], "" ) ;
             switch( _action )
             {
                  case "release":
                  circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
                  if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _out_channel );
                  else
                  {
                      var _vars_array = _params_assoc_array['var'] ;
                   		if ( _vars_array.length == 1 && _vars_array[0].includes( "," ) ) _vars_array = _vars_array[0].split( "," );
                   		else if ( _vars_array.length == 1 && _vars_array[0].includes( ";" ) ) _vars_array = _vars_array[0].split( ";" );
                   		_vars_array = _vars_array.unique();
                   		_vars_array.sort();
                      // scan among seeds
                      var _items_found = 0 ;
                      var _b_found = NO, _var_id = "", _item_output = "", _custom_var = null ;
                      var _sd_n = circles_lib_count_seeds();
                      if ( _sd_n > 0 )
                      {
                          var _seeds_count = 0, _i, _m ;
    											_b_found = NO ;
    				              for( _i = 0 ; _i < _vars_array.length ; _i++ )
    				              {
          						        _var_id = _vars_array[_i] ;
          						        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "scanning for '<white>"+_var_id+"</white>' among <lightblue>seeds</lightblue>", _par_1, _cmd_tag );
                              for( _m = 0 ; _m < _sd_n ; _m++  )
                              {
                                  if ( _glob_seeds_array[_m].symbol.strcmp( _var_id ) )
                                  {
                                      circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Found seed '"+_var_id+"'", _par_1, _cmd_tag );
                                      _b_found = YES, _items_found++ ;
                                      _item_output = _glob_seeds_array[_m].map.output();
                                      circles_lib_output( _out_channel, DISPATCH_INFO, _item_output, _par_1, _cmd_tag );
                                  }
                              }
          						    }
                      }
    
          		        // scan inside the gens set
                      var _gg_n = circles_lib_count_gens();
          		        if ( _gg_n > 0 )
          		        {
          				        _b_found = NO ;
          						    for( var _i = 0 ; _i < _vars_array.length ; _i++ )
          						    {
          						        _var_id = _vars_array[_i] ;
          						        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "scanning for '<white>"+_var_id+"</white>' inside the <lightblue>gens set</lightblue>", _par_1, _cmd_tag );
          				            for( var _m = 0 ; _m < _gg_n ; _m++  )
          				            {
          				                if ( _glob_gens_array[_m].symbol.strcmp( _var_id ) )
          				                {
          				                     circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Found generator '"+_var_id+"'", _par_1, _cmd_tag );
          				                     _b_found = YES, _items_found++ ;
          				                     _item_output = _glob_gens_array[_m].map.output();
          				                     circles_lib_output( _out_channel, DISPATCH_INFO, _item_output, _par_1, _cmd_tag );
          				                }
          				            }
          						    }
          						}
    
                      // scan among custom vars
                      _gg_n = is_array( _glob_terminal_vars_catalogue ) ? _glob_terminal_vars_catalogue.size_associative() : 0 ;
          		        if ( _gg_n > 0 )
          		        {
                           var _custom_var_type, _custom_var_value, _custom_var_formula ;
          						     for( var _i = 0 ; _i < _vars_array.length ; _i++ )
          						     {
          						          _var_id = _vars_array[_i] ;
          				              circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "scanning for '<white>"+_var_id+"</white>' among <lightblue>custom vars</lightblue>", _par_1, _cmd_tag );
          				              _custom_var = _glob_terminal_vars_catalogue[ "var."+_var_id ] ;
          				              if ( _custom_var != null )
          				              {
        				                   _items_found++ ;
        				                   circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Found custom var '"+_var_id+"'", _par_1, _cmd_tag );
        				                   _custom_var_type = _custom_var['type'] ;
        				                   _custom_var_value = _custom_var['value'] ;
        				                   _custom_var_formula = _custom_var['formula'] ;
    
         				                   circles_lib_output( _out_channel, DISPATCH_INFO, "type: " + _custom_var_type, _par_1, _cmd_tag );
         				                   switch( _custom_var_type )
         				                   {
          				                     case "integer":
          				                     case "float":
          				                     if ( _custom_var_formula.length > 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "formula: " + _custom_var_formula, _par_1, _cmd_tag );
          				                     circles_lib_output( _out_channel, DISPATCH_INFO, "value: " + _custom_var_value, _par_1, _cmd_tag );
          				                     break ;
          				                     case "complex":
          				                     var _custom_var_obj = _custom_var['obj'] ;
          				                     if ( _custom_var_formula.length > 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "formula: " + _custom_var_formula, _par_1, _cmd_tag );
          				                     circles_lib_output( _out_channel, DISPATCH_INFO, "value: " + _custom_var_obj.formula(), _par_1, _cmd_tag );
          				                     break ;
          				                     case "mobius":
          				                     var _custom_var_obj = _custom_var['obj'] ;
          				                     circles_lib_output( _out_channel, DISPATCH_INFO, _custom_var_obj.output(), _par_1, _cmd_tag );
          				                     break ;
          				                     default: break ;
          				                 }
          				              }
          						     }
          		        }
    
                      if ( _items_found == 0 ) circles_lib_output( _out_channel, DISPATCH_WARNING, "no items found", _par_1, _cmd_tag );
                   }
                  break ;
             }
         }
     }
     else
     {
		 		 _b_fail = YES, _error_str = "Missing input params" ;
		 }
     
     if ( _b_fail && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}