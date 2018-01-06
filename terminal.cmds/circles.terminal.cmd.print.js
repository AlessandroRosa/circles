function circles_terminal_cmd_print()
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
         _cmd_params['var'] = [] ;
         _cmd_params['help'] = NO ;
         _cmd_params['keywords'] = NO ;
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
         // pre-scan for levenshtein correction
    		 var _cmd_terms_dict = [];
    				 _cmd_terms_dict.push( "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i] ;
              if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
              else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
              else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
              else if ( _p.trim().length == 1 ) _cmd_params['var'].push( _p.trim() );
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
             var _action = safe_string( _cmd_params['action'], "" ) ;
             switch( _action )
             {
                  case "release":
                  circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
                  if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
                  else
                  {
                      var _vars_array = _cmd_params['var'] ;
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
    
          		        // scan inside the generators set
                      var _gg_n = circles_lib_gens_count();
          		        if ( _gg_n > 0 )
          		        {
          				        _b_found = NO ;
          						    for( var _i = 0 ; _i < _vars_array.length ; _i++ )
          						    {
          						        _var_id = _vars_array[_i] ;
          						        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "scanning for '<white>"+_var_id+"</white>' inside the <lightblue>generators set</lightblue>", _par_1, _cmd_tag );
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

						if ( _items_found == 0 ) circles_lib_output( _out_channel, DISPATCH_WARNING, "no items found", _par_1, _cmd_tag );
                   }
                  break ;
             }
         }
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }
     
     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}