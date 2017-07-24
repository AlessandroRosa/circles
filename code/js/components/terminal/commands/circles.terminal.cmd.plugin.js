function circles_terminal_cmd_plugin()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _help = NO ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

		 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['settings'] = [] ;
             
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "current", "html", "help", "list", "open", "release", "run", "set", "silent", "var" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = _help = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "current", "list", "open", "run", "set", "var" ) ) _params_assoc_array['action'] = _p.toLowerCase();
              else if ( _p.is_one_of_i( "silent" ) ) _params_assoc_array['settings'].push( _p ) ;
              else
              {
                  if ( _params_assoc_array['action'] != null )
                  {
                    switch( _params_assoc_array['action'] )
                    {
                      case "var": _params_assoc_array['settings']['var'] = _p ; break ;
                      case "open":
                      case "set":
                      if ( _params_assoc_array['settings']['family'] == null ) _params_assoc_array['settings']['family'] = _p ;
                      else if ( _params_assoc_array['settings']['def'] == null ) _params_assoc_array['settings']['def'] = _p ;
                      else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 ); }
                      break ;
                      default:
                      break ;
                    }
                  }
                  else circles_lib_output( _out_channel, DISPATCH_WARNING, "Unknown input parameter '"+_p+"'", _par_1, _cmd_tag );
              }
         }

         var _already = _glob_verbose == _params_assoc_array['mode'] ? YES : NO ;
         _glob_verbose = _params_assoc_array['mode'] ;

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
             var _action = _params_assoc_array['action'] ;
             switch( _action )
             {
                  case "current":
                  if ( _plugin_tmp_vars_config_array['plugin_sel'] != null )
                  {
                      var _plugin_specs = _plugin_tmp_vars_config_array['plugin_sel']['packed_name'].split( "@" ) ;
                      circles_lib_output( _out_channel, DISPATCH_INFO, "Current plug-in is "+_plugin_specs[0]+ " "+_plugin_specs[1], _par_1, _cmd_tag );
                  }
                  else circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot get current plug-in: please, set it first", _par_1, _cmd_tag );
                  break ;
                  case "list":
                  console.log( _plugin_definitions_array );
                  break ;
                  case "open":
                  if ( _plugin_tmp_vars_config_array['plugin_sel'] != null )
                  {
                      var _fam = "", _def = "" ;
                      var _json = _plugin_tmp_vars_config_array['plugin_sel']['orig_family_def'] ;
                      if ( _json != null ) { _fam = _json.fam, _def = _json.def ; }
                      if ( _fam.length > 0 && _def.length > 0 )
                      {
                        	var _open_cmd = "circles_lib_popup_load( '"+_fam+"', '"+_def+"' );" ;
                        	try{ eval( "var _return_open = " + _open_cmd + ";" ) }
                        	catch( _err ) { circles_lib_error_obj_handler( _err ) ; }
                          circles_lib_output( _out_channel, _return_open ? DISPATCH_SUCCESS : DISPATCH_ERROR, ( _return_open ? "Success" : "Failure" )+" in opening "+_fam+" "+_def, _par_1, _cmd_tag );
                          if ( !_return_open )
                          circles_lib_output( _out_channel, DISPATCH_WARNING, "Check whether input '"+_def+"' could have been mispelled or '"+_fam+"' is not the correct category, or mandatory params are missing", _par_1, _cmd_tag );
                      }
                      else circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot open the mask: please, set a plug-in first", _par_1, _cmd_tag );
                  }
                  else circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot get current plug-in: please, set it first", _par_1, _cmd_tag );
                  break ;
                  case "release":
                  circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  case "set":
                  if ( _plugin_tmp_vars_config_array['plugin_sel'] == null ) _plugin_tmp_vars_config_array['plugin_sel'] = [] ;
                  var _fam = _params_assoc_array['settings']['family'] != null ? _params_assoc_array['settings']['family'] : "" ;
                  var _def = _params_assoc_array['settings']['def'] != null ? _params_assoc_array['settings']['def'] : "" ;
                  if ( is_string( _fam ) && is_string( _def ) )
                  {
                    var _famLC = _fam.toLowerCase(), _famUC = _fam.toUpperCase();
                    var _defLC = _def.toLowerCase(), _defUC = _def.toUpperCase();

                    _plugin_tmp_vars_config_array['plugin_sel']['orig_family_def'] = { fam : _fam, def : _def } ;
                    _plugin_tmp_vars_config_array['plugin_sel']['packed_name'] = _famLC + "@" + _defLC ;
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "plugin has been correctly set to <white>"+_params_assoc_array['settings']['family']+" "+_params_assoc_array['settings']['def']+"</white>", _par_1, _cmd_tag );
                  }
                  else
                  {
                    if ( !is_string( _fam ) )
                    circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing plug-in family specification", _par_1, _cmd_tag );
                    if ( !is_string( _def ) )
                    circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing plug-in definition", _par_1, _cmd_tag );
                  }
                  break ;
                  case "var":
                  if ( _plugin_tmp_vars_config_array['plugin_sel'] != null )
                  {
                      var _plugin_sel = _plugin_tmp_vars_config_array['plugin_sel']['orig_family_def'] ;
                      var _var_set = _params_assoc_array['settings']['var'] ;
                      if ( _var_set.includes( "=" ) )
                      {
                        _var_set = _var_set.split( "=" );
                        _var_set[0] = _var_set[0].trim(), _var_set[1] = _var_set[1].trim();
                        if ( _var_set[0].length > 0 && _var_set[1].length > 0 )
                        {
                          if ( _plugin_tmp_vars_config_array[ 'plugin_sel' ] == null ) _plugin_tmp_vars_config_array[ 'plugin_sel' ] = [] ;
                          _plugin_tmp_vars_config_array[ 'plugin_sel' ][ _var_set[0] ] = _var_set[1] ;
                          circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "Plugin <white>" + _plugin_sel.fam + " " + _plugin_sel.def + "</white> : var <white>" + _var_set[0] + "</white> correctly set to <white>" + _var_set[1] + "</white>", _par_1, _cmd_tag );
                        }
                        else
                        {
                          if ( _var_set[0].length == 0 )
                          circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing <var-id> specification", _par_1, _cmd_tag );
                          if ( _var_set[1].length == 0 )
                          circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing <var-value> specification", _par_1, _cmd_tag );
                        }
                      }
                      else circles_lib_output( _out_channel, DISPATCH_ERROR, "var setting shall be in the form <var-id>=<var-value>", _par_1, _cmd_tag );
                  }
                  else circles_lib_output( _out_channel, DISPATCH_ERROR, "Please, use 'set' action to fix the working plug-in first or cmds wouldn't be accepted", _par_1, _cmd_tag );
                  break ;
                  default: break ;
             }
         }
     }
     else
     {
		 		 _b_fail = YES, _error_str = "Missing input params" ;
		 }

     if ( _b_fail )
     circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}