function circles_terminal_cmd_ifs()
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
    var _b_fail = 0, _b_unfound = 0 ;
    var _error_str = "" ;
    var _plane = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

	if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _cmd_params['keywords'] = NO ;
         _cmd_params['help'] = NO ;
         _cmd_params['action'] = "" ;
         _cmd_params['values'] = [] ;
         
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
         // pre-scan for levenshtein correction
    		 var _cmd_terms_dict = [];
    				 _cmd_terms_dict.push( "all", "options", "panel", "release", "show", "densityscan", "mins", "timer", "uselastpt",
						 															  "html"
																					);
         circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "hide", "html", "show" ) ) _cmd_params[_p] = YES ;
            else if ( _p.is_one_of_i( "release", "options", "panel" ) ) _cmd_params['action'] = _p ;
            else if ( _p.is_one_of_i( "all", "densityscan", "mins", "timer", "uselastpt" ) ) _cmd_params.push( _p ) ;
            else if ( _p.strcmp( "on" ) )
            {
               var _cnt = 0 ;
               if ( _cmd_params.one_in_i( "uselastpt", "all" ) )
               {
                  _glob_use_last_pt = YES ;
                  _b_unfound = NO ;
                  _cnt++ ;
                  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<white>Use last pt</white> <green>for random IFS options has been flagged on</green>", _par_1, _cmd_tag );
               }

               if ( _cmd_params.one_in_i( "timer", "all" ) )
               {
                  _glob_scheduled_rendering_flag = YES ;
                  _b_unfound = NO ;
                  _cnt++ ;
                  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<white>Scheduled timer</white> <green>for random IFS options has been flagged on</green>", _par_1, _cmd_tag );
               }

               if ( _cmd_params.one_in_i( "densityscan", "all" ) )
               {
                  _glob_density_scan_flag = YES ;
                  _b_unfound = NO ;
                  _cnt++ ;
                  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<white>Density scan</white> <green>for random IFS options has been flagged on</green>", _par_1, _cmd_tag );
               }

               if ( _cnt == 0 )
               {
                  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<white>On</white> <orange>flag does not apply to any of the acknowledged settings</orange>", _par_1, _cmd_tag );
                  _b_unfound = YES ;
               }
               else if ( circles_lib_plugin_find_index( { subset : "forms", base_id : "general.options" }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_SUBSET ) ) circles_lib_plugin_load( 'forms', 'general.options', NO, 1 ) ;
				var _enable = _glob_use_last_pt || _glob_scheduled_rendering_flag || _glob_density_scan_flag ;
			    if ( $("#CIRCLESgeneraloptionsIFSRANDOMlabel").get(0) != null )
				$("#CIRCLESgeneraloptionsIFSRANDOMlabel").css( "color", _enable ? DEFAULT_EDIT_COLOR_ENABLED : DEFAULT_EDIT_COLOR_DISABLED );
            }
            else if ( _p.strcmp( "off" ) )
            {
               var _cnt = 0 ;
               if ( _cmd_params.one_in_i( "uselastpt", "all" ) )
               {
                  _glob_use_last_pt = NO ;
                  circles_lib_output( _out_channel, DISPATCH_SUCCESS, "'Use last pt' in random IFS options has been flagged off", _par_1, _cmd_tag );
                  _b_unfound = NO ;
                  _cnt++ ;
               }

               if ( _cmd_params.one_in_i( "timer", "all" ) )
               {
                  _glob_scheduled_rendering_flag = NO ;
                  circles_lib_output( _out_channel, DISPATCH_SUCCESS, "'Scheduled timer' for random IFS options has been flagged off", _par_1, _cmd_tag );
                  _b_unfound = NO ;
                  _cnt++ ;
               }

               if ( _cmd_params.one_in_i( "densityscan", "all" ) )
               {
                  _glob_density_scan_flag = NO ;
                  circles_lib_output( _out_channel, DISPATCH_SUCCESS, "'Density scan' for random IFS options has been flagged off", _par_1, _cmd_tag );
                  _b_unfound = NO ;
                  _cnt++ ;
               }

               if ( _cnt == 0 )
               {
                  circles_lib_output( _out_channel, DISPATCH_WARNING, "'Off' flag does not apply to any of the acknowledged settings", _par_1, _cmd_tag );
                  _b_unfound = YES ;
               }
               else if ( circles_lib_plugin_find_index( { subset : "forms", base_id : "general.options" }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_SUBSET ) ) circles_lib_plugin_load( 'forms', 'general.options', NO, 1 ) ;
				var _enable = _glob_use_last_pt || _glob_scheduled_rendering_flag || _glob_density_scan_flag ;
			    if ( $("#CIRCLESgeneraloptionsIFSRANDOMlabel").get(0) != null )
				$("#CIRCLESgeneraloptionsIFSRANDOMlabel").css( "color", _enable ? DEFAULT_EDIT_COLOR_ENABLED : DEFAULT_EDIT_COLOR_DISABLED );
            }
            else if ( _p.testME( _glob_positive_integer_regex_pattern ) )
            {
               if ( _cmd_params.includes( "mins" ) )
               {
                  _p = safe_int( _p, 0 );
                  if ( _p > 0 )
                  {
                      _glob_scheduled_rendering_interval = _cmd_params['values']['mins'] = safe_int( _p, 0 );
                      circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Found and set "+_p+" minute"+(_p==1?"":"")+" for time interval between two successive renderings", _par_1, _cmd_tag );
                      circles_lib_output( _out_channel, DISPATCH_INFO, "This setting will take effect after the next rendering", _par_1, _cmd_tag );
                      _b_unfound = NO ;
                      if ( circles_lib_plugin_find_index( { subset : "forms", base_id : "general.options" }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_SUBSET ) ) circles_lib_plugin_load( 'forms', 'general.options', NO, 1 ) ;
                  }
                  else
                  {
                      circles_lib_output( _out_channel, DISPATCH_WARNING, "Warning! The input quantifier ("+_p+") for minutes must be strictly positive", _par_1, _cmd_tag );
                      _b_unfound = YES ;
                  }
               }
               else _b_unfound = YES ;
            }
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
         }

		 if ( !_cmd_params['help'] && _params.length > 0 && !( _glob_method == METHOD_ALGEBRAIC && _glob_process == PROCESS_RANDOM ) )
		 {
			var _msg = "<orange>Sorry, this cmd run has been halted prematurely:"+_glob_crlf+"no further input option will take effect until</orange>"+_glob_crlf+"<white>method</white> is not <white>algebraic</white> <orange>and</orange> <white>process</white> is not <white>random</white>" ;
				_msg += _glob_crlf + "<lightgray>Hint: use 'method' cmd to set both method and process</lightgray>" ;
			circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
		 }
         else if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
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
           		case "options":
           		var _msg  = "<lightblue>Use last point feature</lightblue> "+( _glob_use_last_pt ? "<lime>Active</lime>" : "<lightgray>Inactive</lightgray>" )+ _glob_crlf ;
           			_msg += "<lightblue>Last recorded point</lightblue> <snow>"+_glob_last_pt.formula()+"</snow>" + _glob_crlf ;
           			_msg += "<lightblue>Scheduled rendering timer</lightblue> "+( _glob_scheduled_rendering_flag ? "<green>Active</green>" : "<lightgray>Inactive</lightgray>" )+ _glob_crlf ;
           			_msg += "<lightblue>Scheduled rendering interval</lightblue> "+( _glob_scheduled_rendering_interval + " minute" + ( _glob_scheduled_rendering_interval==1?"":"s" ) )+ _glob_crlf ;
           			_msg += "<lightblue>Density scanner</lightblue> "+( _glob_density_scan_flag ? "<green>Active</green>" : "<lightgray>Inactive</lightgray>" )+ _glob_crlf ;
   	            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
				var _enable = _glob_use_last_pt || _glob_scheduled_rendering_flag || _glob_density_scan_flag ;
				if ( $("#CIRCLESgeneraloptionsIFSRANDOMlabel").get(0) != null )
				$("#CIRCLESgeneraloptionsIFSRANDOMlabel").css( "color", _enable ? DEFAULT_EDIT_COLOR_ENABLED : DEFAULT_EDIT_COLOR_DISABLED );
           		break ;
           		case "panel":
				if ( _cmd_params['hide'] )
				{
					var _options = [ "close" ], _ret_array = [] ;
					var _dispatcher_fn = "CIRCLESformsGENERALOPTIONSremotectrl( _options, null, _ret_array, "+_out_channel+" )" ;
					var _output = null ;
					try{ eval( "_output = " + _dispatcher_fn + ";" ) }
					catch( _err ) { circles_lib_error_obj_handler( _err ) ; }
				}
				else circles_lib_plugin_load('forms','general.options',NO,YES) ;
           		break ;
   	            case "release":
   	            circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
   	            break ;
				default: break ;
            }
         }
     }
     else if ( _params.length == 0 ) { _b_fail = YES, _error_str = "Missing input params" ; }
     
     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
} 