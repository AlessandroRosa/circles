function circles_terminal_cmd_export()
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
     var _help = NO ;
     var _fn_ret_val = null ;
     var _cmd_params = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
         _cmd_params['format'] = UNDET ;
         _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _cmd_params['keywords'] = NO ;

         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
         // pre-scan for levenshtein correction
    		 var _cmd_terms_dict = [];
    				 _cmd_terms_dict.push( "svg", "none", "eps", "ps", "latex", "release", "html" );
         circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else if ( _p.stricmp( "svg" ) ) _cmd_params['format'] = EXPORT_SVG ;
            else if ( _p.stricmp( "ps" ) ) _cmd_params['format'] = EXPORT_PS ;
            else if ( _p.stricmp( "eps" ) ) _cmd_params['format'] = EXPORT_EPS ;
            else if ( _p.stricmp( "latex" ) ) _cmd_params['format'] = EXPORT_LATEX ;
            else if ( _p.stricmp( "none" ) ) _cmd_params['format'] = EXPORT_NONE ;
            else { _b_fail = YES ; _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
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
         else
         {
             var _action = _cmd_params['action'] ;
             switch( _action )
             {
                  case "release":
                  circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
                  var _format = safe_int( _cmd_params['format'], EXPORT_NONE );
                  _glob_export_format = _format ;
                  var _format_str = "" ;
                  switch( _glob_export_format )
                  {
                       case EXPORT_SVG:
                       _b_fail = 0 ;
                       _format_str = "Export to SVG file format" ;
                       break ;
                       case EXPORT_PS:
                       _b_fail = 0 ;
                       _format_str = "Export to PS file format" ;
                       break ;
                       case EXPORT_EPS:
                       _b_fail = 0 ;
                       _format_str = "Export to EPS file format" ;
                       break ;
                       case EXPORT_LATEX:
                       _b_fail = 0 ;
                       _format_str = "Export to LATEX file format" ;
                       break ;
                       case EXPORT_NONE:
                       _b_fail = 0 ;
                       _format_str = "Export service has been disabled with success" ;
                       break ;
                       default:
                       _b_fail = YES, _error_str = "Fail to export: set the output file format" ;
                       break ;
                  }
                  break ;
             }
         }
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
     }

     if ( !_b_fail && !_help ) circles_lib_output( _out_channel, DISPATCH_SUCCESS, _format_str, _par_1, _cmd_tag );
     else if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}