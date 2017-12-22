function circles_terminal_cmd_count()
{
    var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
    var _params = arguments[0] ;
    var _out_channel = arguments[1] ;
    var _par_1 = arguments[2] ;
    var _cmd_mode = arguments[3] ;
    var _caller_id = arguments[4] ;
    _params = safe_string( _params, "" ).trim();

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _glob_verbose && _glob_terminal_echo_flag )
    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

	var _last_release_date = get_file_modify_date( _glob_paths['terminal_abs_cmds'], "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

    _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
    _cmd_params['help'] = NO ;
    _cmd_params['keywords'] = NO ;
         
    var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
    _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
    _cmd_params['mask'] = RESET_NONE ;
    // pre-scan for levenshtein correction
	var _cmd_terms_dict = [];
    var _p ;
    for( var _i = 0 ; _i < _params_array.length ; _i++ )
    {
        _p = _params_array[_i].toLowerCase();
        if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
        else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
    }

         if ( !_b_fail )
         {
             var _action = _cmd_params['action'] ;
             switch( _action )
             {
                  case "release":
                  circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  default:
				  var _sd_n = circles_lib_count_seeds();
				  var _gens_n = circles_lib_count_items( _glob_gens_array, YES );
				  var _probs_n = circles_lib_count_rnd_probabilities();
				  var _reps_n = circles_lib_count_repetends();
				  var _fp_n = circles_lib_count_fixed_points();
				  var _figs_n = circles_lib_count_figures();
				  var _alpha_n = circles_lib_count_alphabet();
				  var _clrs_n = circles_lib_count_palette();
				  
				  circles_lib_output( _out_channel, DISPATCH_INFO, "Counting the elements for the current working group", _par_1, _cmd_tag );
				  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<snow>"+_sd_n+"</snow> <lightblue>seed"+(_sd_n==1?"":"s")+"</lightblue>", _par_1, _cmd_tag );
				  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightblue>"+_gens_n+"</lightblue> <snow>generator"+(_gens_n==1?"":"s")+"</snow>", _par_1, _cmd_tag );
				  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<snow>"+_probs_n+"</snow> <lightblue>probabilit"+(_probs_n==1?"y":"ies")+"</lightblue>", _par_1, _cmd_tag );
				  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightblue>"+_reps_n+"</lightblue> <snow>repetend"+(_reps_n==1?"":"s")+"</snow>", _par_1, _cmd_tag );
				  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<snow>"+_fp_n+"</snow> <lightblue>fixed point"+(_fp_n==1?"":"s")+"</lightblue>", _par_1, _cmd_tag );
				  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightblue>"+_figs_n+"</lightblue> <snow>figure"+(_figs_n==1?"":"s")+"</snow>", _par_1, _cmd_tag );
				  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<snow>"+_alpha_n+"</snow> <lightblue>alphabet symbol"+(_alpha_n==1?"":"s")+"</lightblue>", _par_1, _cmd_tag );
				  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightblue>"+_clrs_n+"</lightblue> <snow>palette color"+(_clrs_n==1?"":"s")+"</snow>", _par_1, _cmd_tag );
                  break ;
             }
     }

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
		 circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}