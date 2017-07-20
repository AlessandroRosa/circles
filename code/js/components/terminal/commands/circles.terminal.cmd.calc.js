function circles_terminal_cmd_calc()
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
     var _plane = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;
     var _params_assoc_array = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['settings'] = [] ;
         _params_assoc_array['roundto'] = _glob_accuracy ;
         
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "all", "bip", "crossratio", "convergents", "release",
						 																"wplane", "zplane", "center", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
              _p = _params_array[_i].toLowerCase();
              if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
              else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
              else if ( _p.is_one_of_i( "html", "fraction" ) ) _params_assoc_array['html'] = YES ;
              else if ( _p.is_one_of_i( "convergents", "crossratio", "release" ) ) _params_assoc_array['action'] = _p ;
              else if ( circles_lib_colors_is_def( _p ) ) _params_assoc_array['settings']['color'] = _p ;
              else if ( _p.testME( _glob_fraction_regex_pattern ) || _p.testME( _glob_float_regex_pattern ) )
              {
                 _params_assoc_array['settings']['frac'] = _p ;
                 if ( eval( _p ) < 0 || eval( _p ) > 1 && _params_assoc_array['action'] == "cusp" )
                 {
                    _b_fail = YES ;
                    _error_str = "P/Q word for cusp computation shall range from 0 to 1" ;
                 }
              }
              else if ( _p.toLowerCase().start_with( "roundto:" ) )
              {
                   _p = safe_int( _p.replaceAll( "roundto:", "" ), 0 ) ;
                   if ( _p <= 0 )
                   {
                       _p = _glob_accuracy ;
                       circles_lib_output( _out_channel, DISPATCH_WARNING, "Invalid value or zero detected for 'roundto' param: reset to current setting ("+_glob_accuracy+")", _par_1, _cmd_tag );
                   }
                   else if ( _p > DEFAULT_MAX_ACCURACY )
                   {
                       _p = _glob_accuracy ;
                       circles_lib_output( _out_channel, DISPATCH_WARNING, "Maximum ("+DEFAULT_MAX_ACCURACY+") exceeded by 'roundto' param: reset to current setting ("+_glob_accuracy+")", _par_1, _cmd_tag );
                   }
                   
                   _params_assoc_array['roundto'] = _p ;
              }
              else if ( _p.testME( _glob_cartesian_coords_regex_pattern ) )
              {
									if ( !is_array( _params_assoc_array['settings']['points'] ) ) _params_assoc_array['settings']['points'] = [] ;
                  var _p = _p.replaceAll( [ "(", ")" ], "" );
                  var _pt_array = _p.split( "," );
                  var _x = parseFloat( _pt_array[0] ), _y = parseFloat( _pt_array[1] ) ; 
                  var _new_pt = ( !isNaN( _x ) && !isNaN( _y ) ) ? new complex( _x, _y ) : null ;
                  if ( is_complex( _new_pt ) )
                  {
		                   var _b_found = NO ;
		                   $.each( _params_assoc_array['settings']['points'],
			                 			   function( _i, _pt )
			                  			 {
																	if ( _pt.is_equal_to( _new_pt ) )
																	{
																		 _b_found = YES ;
																		 return NO ;
																	}
															 }
															) ;

											 if ( _b_found )
											 circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "'" + _p + "' skipped: it has been already registered as point", _par_1, _cmd_tag );
											 else _params_assoc_array['settings']['points'].push( _new_pt );
									}
									else circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "'" + _p + "' skipped: it's not a valid point signature", _par_1, _cmd_tag );
              }
              else
              {
                  _b_fail = YES ;
                  _error_str = "Unknown input param '"+_p+"' at token #" + ( _i + 1 );
              }
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
		         var _action = _params_assoc_array['action'] ;
		         var _round_to = _params_assoc_array['roundto'] ;
		         switch( _action )
		         {
		              case "convergents":
		              var _frac_str = _params_assoc_array['settings']['frac'] ;
                  var _color = safe_string( _params_assoc_array['settings']['color'], "yellow" );
		              if ( is_string( _frac_str ) )
		              {
                      var _f = new farey( _frac_str );
				              var _out_frac = _f.output( "std", "/" );
                      if ( _frac_str.testME( _glob_float_regex_pattern ) )
				              circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<white>"+_frac_str+"</white> <lightgray>has been turned to fraction</lightgray> <white>"+_out_frac+"</white>", _par_1, _cmd_tag );
				              
                      if ( _frac_str.testME( _glob_fraction_regex_pattern ) && !_out_frac.strcmp( _frac_str ) )
				              circles_lib_output( _out_channel, DISPATCH_INFO, _frac_str+" has been reduced to "+_out_frac, _par_1, _cmd_tag );
				                 
				              var _convergents = _f.convergents();
				              _fn_ret_val = _convergents.clone();
				              if ( safe_size( _convergents, 0 ) > 0 )
				              {
				              	 if ( _params_assoc_array['html'] )
				              	 {
								             circles_lib_output( _out_channel, DISPATCH_INFO, "Displaying the convergents in the continued fraction format", _par_1, _cmd_tag );
								             circles_lib_output( _out_channel, DISPATCH_INFO, "", _par_1, _cmd_tag );
														 circles_lib_terminal_html_display( _glob_terminal, _f.continued_frac_html( _color ) ) ;
								             circles_lib_output( _out_channel, DISPATCH_INFO, "", _par_1, _cmd_tag );
												 }
												 else
						             circles_lib_output( _out_channel, DISPATCH_INFO, "Displaying the convergents sequence: "+_convergents.join(","), _par_1, _cmd_tag );
				              }
									}
				          else circles_lib_output( _out_channel, DISPATCH_WARNING, "Can't compute convergents: missing input fraction", _par_1, _cmd_tag );
		              break ;
		         			case "crossratio":
						 		  circles_lib_output( OUTPUT_TERMINAL, DISPATCH_MULTICOLOR, "<lightgray>Selected calculation</lightgray> <yellow>cross-ratio</yellow>", _par_1, _cmd_tag );
		         			var _n_pts = safe_size( _params_assoc_array['settings']['points'], 0 );
									if ( _n_pts == 0 ) circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Can't calc cross-ratio: missing input points (4 are required)", _par_1, _cmd_tag );
		         			else if ( _n_pts < 4 ) circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Can't calc cross-ratio: just " + _n_pts + " input point" + ( _n_pts == 1 ? "" : "s" ) + ", bur 4 are required", _par_1, _cmd_tag );
		         			else
		         			{
											 var _pts = null ;
											 if ( _n_pts > 4 ) circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "More than 4 input points have been acquired, thus only\nthe first ones will be kept up for cross-ratio: namely, ...", _par_1, _cmd_tag );
											 else circles_lib_output( OUTPUT_TERMINAL, DISPATCH_WARNING, "Resuming the 4 input points acquired for cross-ratio calculation", _par_1, _cmd_tag );
		
								 		   _pts = _params_assoc_array['settings']['points'].subset( 4 ) ;
											 $.each( _pts, function( _i, _pt ) { circles_lib_output( OUTPUT_TERMINAL, DISPATCH_INFO, "#"+(_i+1)+") " + ( new point( _pt.real, _pt.imag ) ).output( "cartesian" ), _par_1, _cmd_tag ); } ) ;
											 
											 var _cr = cross_ratio( _pts[0], _pts[1], _pts[2], _pts[3] ) ;
											 _fn_ret_val = _cr ;
											 circles_lib_output( OUTPUT_TERMINAL, DISPATCH_SUCCESS, "Cross-ratio is " + _cr.formula(1,1,_round_to ), _par_1, _cmd_tag );
											 circles_lib_output( OUTPUT_TERMINAL, DISPATCH_INFO, "Performing circle test ...", _par_1, _cmd_tag );
											 if ( on_a_same_circle_test( _pts[0], _pts[1], _pts[2], _pts[3] ) )
											 circles_lib_output( OUTPUT_TERMINAL, DISPATCH_INFO, "Cross-ratio is a real value: the 4 points lie a upon a same circle", _par_1, _cmd_tag );
											 else
											 circles_lib_output( OUTPUT_TERMINAL, DISPATCH_INFO, "Cross-ratio is not a real value: the 4 points don't lie a upon a same circle", _par_1, _cmd_tag );
									}
		         			break ;
			            case "release":
			            circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
			            break ;
					        default: break ;
		         }
		     }
     }
     else if ( _params.length == 0 )
     {
         _b_fail = YES ;
         _error_str = "Missing input params" ;
     }
     
     if ( _b_fail && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
} 