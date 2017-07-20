_glob_circles_js_translation.push( [ 'operators',
      	[
          // handles binary operators
          function( _code )
          {
      				if ( is_string( _code ) )
      				{
	               var _reserved_words = _glob_script_editor_reserved_circles.concat( _glob_script_editor_reserved_javascript ) ;
                 var _binary_operators = [ "+", "-", "*", "/", "==", "!=", "^", "/\\\\", "U", "°" ] ;
                 var _bin_str = _binary_operators.work( function( _o ) { return "\\" + _o ; } ).join( "|" );
                 var _reg_expr = "/(?:\\s|\\()?(\\w{1,})+\\s*("+_bin_str+")\\s*(\\w{1,})+(?:\\s|\\))?/gim" ;
	               var _re_fn = /([\w|\d]{1,})(?:\s*)(\(([\w\d\,\s]{1,})\))/gim, _op ; // fn(z1,z2,...)
                 eval( "_op = " + _reg_expr + " ;" );
                 while( true )
                 {
                    var _match_ret = _op.exec( _code ) ;
                    var _match_ret_fn = _re_fn.exec( _code ) ;
                    if ( _match_ret == null ) break ;
                    var _match_str = _match_ret[0].trim() ;
                    var _match_left_operand = _match_ret[1] ;
                    var _match_operator = _match_ret[2] ;
                    var _match_right_operand = _match_ret[3] ;
                    var _match_index = _match_ret['index'] ;
                    var _match_index_end = _match_index + _match_str.length ;

                    if ( _reserved_words.includes( _match_str ) )
                    {
												_op.lastIndex = _match_index_end ;
												continue ;
										}

                    var _left_op, _right_op, _translated ;
                    /* this function handles the code translation of a binary operation,
                       thus the strategy is :
                       1) to pull out all code before the input formula and compile it
                          in order to ...
                       2) ... detect both left and right operands, which will be casted
                          to objects, according to the given input code
                       3) to find proper object method to encode sum and translate into
                          new code
                       4) decomment formula in the new code for later compiling
                    */

										_code = _code.replace_between( _match_index, _match_index + _match_str.length, "0 /*"+_match_str+"*/" );
                    var _run_chunk = _code.run_backward_up_to( /\;|\n/, _match_index, 1 ) ;
                    var _code_before_formula = _code.substring( 0, _run_chunk[2] ) ;
                    eval( _code_before_formula );

                    var _test_left_op, _test_right_op ;
                    eval( "_test_left_op = " + _match_left_operand + ";" );
                    eval( "_test_right_op = " + _match_right_operand + ";" );

                    var _method = "" ;
                    switch( _match_operator )
                    {
                       case "==":
                       if ( is_complex( _test_left_op ) && is_complex( _test_right_op ) )
                       _method = "%left%.is_equal_to(%right%)" ;
                       else if ( is_farey( _test_left_op ) && is_farey( _test_right_op ) )
                       _method = "%left%.is_equal_to(%right%)" ;
                       else if ( is_fraction( _test_left_op ) && is_fraction( _test_right_op ) )
                       _method = "%left%.is_equal_to(%right%)" ;
                       else
                       _method = "%left% "+_match_operator+" %right%" ;
                       break ;
                       case "!=":
                       if ( is_complex( _test_left_op ) && is_complex( _test_right_op ) )
                       _method = "%left%.is_not_equal_to(%right%)" ;
                       else if ( is_farey( _test_left_op ) && is_farey( _test_right_op ) )
                       _method = "%left%.is_not_equal_to(%right%)" ;
                       else if ( is_fraction( _test_left_op ) && is_fraction( _test_right_op ) )
                       _method = "%left%.is_not_equal_to(%right%)" ;
                       else
                       _method = "%left% "+_match_operator+" %right%" ;
                       break ;
                       case "+":
                       if ( is_complex( _test_left_op ) && is_complex( _test_right_op ) )
                       _method = "%left%.add(%right%)" ;
                       else if ( is_mobius_map( _test_left_op ) && is_mobius_map( _test_right_op ) )
                       _method = "%left%.sum(%right%)" ;
                       else if ( ( is_mobius_map( _test_left_op ) || is_complex_matrix( _test_left_op ) ) &&
											 					 ( is_number( _test_right_op ) || is_complex( _test_right_op ) )
															 )
                       _method = "%left%.add_scalar(%right%)" ;
                       else if ( ( is_number( _test_left_op ) || is_complex( _test_left_op ) ) &&
											 					 ( is_mobius_map( _test_right_op ) || is_complex_matrix( _test_right_op ) )
															 )
                       {
                       		 var _tmp = _test_left_op.copy() ;
                       		 _test_left_op = _test_right_op.copy() ;
                       		 _test_right_op = _tmp.copy() ;

                           _tmp = _match_left_operand ;
                           _match_left_operand = _match_right_operand ;
                           _match_right_operand = _tmp ;
                            
 		                       _method = "%left%.add_scalar(%right%)" ;
											 }
                       else if ( is_complex_matrix( _test_left_op ) && is_complex_matrix( _test_right_op ) )
                       _method = "%left%.add(%right%)" ;
                       else if ( is_farey( _test_left_op ) && is_farey( _test_right_op ) )
                       _method = "%left%.sum(%right%)" ;
                       else if ( is_fraction( _test_left_op ) && is_fraction( _test_right_op ) )
                       _method = "%left%.sum(%right%)" ;
                       else
                       _method = "%left% "+_match_operator+" %right%" ;
                       break ;
                       case "-":
                       if ( is_complex( _test_left_op ) && is_complex( _test_right_op ) )
                       _method = "%left%.sub(%right%)" ;
                       else if ( is_mobius_map( _test_left_op ) && is_mobius_map( _test_right_op ) )
                       _method = "%left%.sub(%right%)" ;
                       else if ( ( is_mobius_map( _test_left_op ) || is_complex_matrix( _test_left_op ) ) &&
 											 					 ( is_number( _test_right_op ) || is_complex( _test_right_op ) )
															 )
                       _method = "%left%.sub_scalar(%right%)" ;
                       else if ( ( is_number( _test_left_op ) || is_complex( _test_left_op ) ) &&
											 					 ( is_mobius_map( _test_right_op ) || is_complex_matrix( _test_right_op ) )
															 )
                       {
                       		 var _tmp = _test_left_op.copy() ;
                       		 _test_left_op = _test_right_op.copy() ;
                       		 _test_right_op = _tmp.copy() ;

                           _tmp = _match_left_operand ;
                           _match_left_operand = _match_right_operand ;
                           _match_right_operand = _tmp ;
                            
		                       _method = "%left%.sub_scalar(%right%)" ;
											 }
                       else if ( is_complex_matrix( _test_left_op ) && is_complex_matrix( _test_right_op ) )
                       _method = "%left%.sub(%right%)" ;
                       else if ( is_fraction( _test_left_op ) && is_fraction( _test_right_op ) )
                       _method = "%left%.sub(%right%)" ;
                       else
                       _method = "%left% "+_match_operator+" %right%" ;
                       break ;
                       case "*":
                       if ( is_complex( _test_left_op ) && is_complex( _test_right_op ) )
                       _method = "%left%.mul(%right%)" ;
                       else if ( is_mobius_map( _test_left_op ) && is_mobius_map( _test_right_op ) )
                       _method = "%left%.mul(%right%)" ;
                       else if ( ( is_mobius_map( _test_left_op ) || is_complex_matrix( _test_left_op ) ) &&
											 					 ( is_number( _test_right_op ) || is_complex( _test_right_op ) )
															 )
                       _method = "%left%.mul_scalar(%right%)" ;
                       else if ( ( is_number( _test_left_op ) || is_complex( _test_left_op ) ) &&
											 					 ( is_mobius_map( _test_right_op ) || is_complex_matrix( _test_right_op ) )
															 )
                       {
                       		 var _tmp = _test_left_op.copy() ;
                       		 _test_left_op = _test_right_op.copy() ;
                       		 _test_right_op = _tmp.copy() ;

                           _tmp = _match_left_operand ;
                           _match_left_operand = _match_right_operand ;
                           _match_right_operand = _tmp ;
                            
		                       _method = "%left%.mul_scalar(%right%)" ;
											 }
                       else if ( is_complex_matrix( _test_left_op ) && is_complex_matrix( _test_right_op ) )
                       _method = "%left%.mul(%right%)" ;
                       else if ( is_fraction( _test_left_op ) && is_fraction( _test_right_op ) )
                       _method = "%left%.mul(%right%)" ;
                       else
                       _method = "%left% "+_match_operator+" %right%" ;
                       break ;
                       case "/":
                       if ( is_complex( _test_left_op ) && is_complex( _test_right_op ) )
                       _method = "%left%.div(%right%)" ;
                       else if ( is_mobius_map( _test_left_op ) && is_mobius_map( _test_right_op ) )
                       _method = "%left%.div(%right%)" ;
                       else if ( ( is_mobius_map( _test_left_op ) || is_complex_matrix( _test_left_op ) ) &&
											 					 ( is_number( _test_right_op ) || is_complex( _test_right_op ) )
															 )
                       _method = "%left%.div_scalar(%right%)" ;
                       else if ( ( is_number( _test_left_op ) || is_complex( _test_left_op ) ) &&
											 					 ( is_mobius_map( _test_right_op ) || is_complex_matrix( _test_right_op ) )
															 )
                       {
                       		 var _tmp = _test_left_op.copy() ;
                       		 _test_left_op = _test_right_op.copy() ;
                       		 _test_right_op = _tmp.copy() ;

                           _tmp = _match_left_operand ;
                           _match_left_operand = _match_right_operand ;
                           _match_right_operand = _tmp ;
                            
		                       _method = "%left%.div_scalar(%right%)" ;
											 }
                       else if ( is_fraction( _test_left_op ) && is_fraction( _test_right_op ) )
                       _method = "%left%.div(%right%)" ;
                       else
                       _method = "%left% "+_match_operator+" %right%" ;
                       break ;
                       case "^":
                       if ( is_complex( _test_left_op ) && is_complex( _test_right_op ) )
                       _method = "%left%.pow(%right%)" ;
                       else
                       _method = "Math.pow( %left%, %right% )" ;
                       break ;
                       case "/\\":
                       if ( is_rect( _test_left_op ) && is_rect( _test_right_op ) )
                       _method = "%left%.intersection(%right%)" ;
                       else if ( is_circle( _test_left_op ) && is_circle( _test_right_op ) )
                       _method = "%left%.intersection(%right%)" ;
                       else _method = "" ;
                       break ;
                       case "U":
                       if ( is_rect( _test_left_op ) && is_rect( _test_right_op ) )
                       _method = "%left%.union(%right%)" ;
                       else _method = "" ;
                       break ;
                       case "°":
                       if ( is_mobius_map( _test_left_op ) && is_mobius_map( _test_right_op ) )
                       _method = "%left%.composition(%right%)" ;
                       else if ( is_complex_matrix( _test_left_op ) && is_complex_matrix( _test_right_op ) )
                       _method = "%left%.dot_product(%right%)" ;
                       else _method = "" ;
                       break;
                       default: break ;
                    }

                    if ( _method.trim().length > 0 )
                    {
                        _translated = _method.replace( "%left%", _match_left_operand ).replace( "%right%", _match_right_operand ) ;
    										_code = _code.replace_between( _match_index, _match_index + ( "0 /*"+_match_str+"*/" ).length, _translated );
                        _op.lastIndex = _match_index + _translated.length ;
                    }
                 }

              }

              return _code ;
          }
        ],
        [
           // n-th args function fn(arg1,arg2)
           function translate( _code )
           {
                var _re = /(function)*\s*([\w|\d]{1,})(?:\s*)(\(([\w\d\,\s]{1,})\))/gim ;
                var _reserved_words = _glob_script_editor_reserved_circles.concat( _glob_script_editor_reserved_javascript ) ;
								var _ext_fn_name, _ext_fn_args, _int_fn_name, _int_fn_args, _args_mapping, _re, _match_ret, _method = "", _default_switch = NO ;
                while( true )
                {
                    var _match_ret = _re.exec( _code ) ;
                    if ( _match_ret == null ) break ;
                    var _match_str = _match_ret[0] ;
                    var _match_fn_name = safe_string( _match_ret[1], "" ).trim() ;
                    if ( _match_fn_name.toLowerCase().strcmp( "function" ) )
                    {
                    		 _re.lastIndex = _match_ret['index'] + _match_fn_name.length ;
												 continue ;
										}
                    var _match_args_bunch = safe_string( _match_ret[2], "" ).trim() ;
                    var _match_args_only = safe_string( _match_ret[3], "" ).replace( /\(|\)|\s/gmi, "" ) ;
                    var _match_index_main = _match_ret['index'] ;
                    var _match_index = _match_ret['index'] ;
                    
                    if ( _match_fn_name.length == 0 || _match_args_bunch.length == 0 || _reserved_words.includes( _match_fn_name ) )
										_re.lastIndex = _match_index + _match_fn_name.length + _match_args_bunch.length + 2 ;
										else
										{
 												var _args_array = _match_args_only.includes( "," ) ? _match_args_only.split( "," ) : [ _match_args_only ] ;
                        _default_switch = NO ;
  											var _fn_lib_index = safe_int( _glob_circles_js_translation_methods_index_map[ _match_fn_name.toLowerCase() ], -1 ) ;
                        if ( _fn_lib_index >= 0 )
                        {
                            /* room for further coding, if required */
                        }
                        else
                        {
    												_code = _code.replace_between( _match_index, _match_index + _match_str.length, "0 /*"+_match_str+"*/" );
    		                    var _run_chunk = _code.run_backward_up_to( /\;|\n/, _match_index, 1 ) ;
    		                    var _code_before_formula = _code.substring( 0, _run_chunk[2] ) ;
    		                    try{ eval( _code_before_formula ); }
    		                    catch( _err ) { }
    
    		                    var _test_left_op ;
    		                    var _obj = _args_array[0] ;
    		                    var _args = _args_array.length > 1 ? _args_array.from_to( 1, _args_array.length - 1 ).join( ", " ) : "" ;
    		                    try{ eval( "_test_left_op = " + _args_array[0] + ";" ); }
                            catch( err ){}
                        }

												switch( _match_fn_name.toLowerCase() )
												{
														case "calc":
														var _arg1 ;		eval( "_arg1 = " + _args_array[1] );
														if ( is_mobius_map( _test_left_op ) && is_complex( _arg1 ) )
														_method = "%left%."+"compute"+"( %args% )" ;
														else if ( is_mobius_map( _test_left_op ) && is_array( _arg1 ) )
														_method = "%left%."+"compute_multi_pt"+"( %args% )" ;
														break ;
		                        case "abs":
		                        case "acos":
		                        case "acosec":
		                        case "acosech":
		                        case "actg":
		                        case "actgh":
		                        case "arg":
		                        case "asec":
		                        case "asech":
		                        case "asin":
		                        case "atg":
		                        case "conj":
		                        case "cos":
		                        case "cosh":
		                        case "cosec":
		                        case "cosech":
		                        case "ctg":
		                        case "ctgh":
		                        case "exp":
		                        case "ln":
		                        case "log":
		                        case "norm":
		                        case "sec":
		                        case "sech":
		                        case "sin":
		                        case "sinh":
		                        case "sqrt":
		                        case "tg":
		                        case "tgh":
													  if ( is_complex( _test_left_op ) ) _method = "%left%."+_match_fn_name.toLowerCase()+"()" ;
														break ;
		                        case "antitrace":
		                        case "characteristic":
		                        case "commutrace":
														case "inversion_circle":
														case "isometric_circle":
		                        case "multiplier":
		                        case "polar":
		                        case "pole":
		                        case "sphere":
													  if ( is_mobius_map( _test_left_op ) ) _method = "%left%."+_match_fn_name.toLowerCase()+"()" ;
		                        break ;
		                        case "points":
													  if ( is_rect( _test_left_op ) ||
																 is_polygon( _test_left_op )
															 )
														_method = "%left%.array()" ;
		                        break ;
		                        case "inv":
													  if ( is_mobius_map( _test_left_op ) ||
                                 is_mobius_map( _test_left_op ) ||
                                 is_complex_matrix( _test_left_op ) ) _method = "%left%."+_match_fn_name.toLowerCase()+"()" ;
		                        break ;
		                        case "antitrace":
		                        case "normalize":
		                        case "trace":
													  if ( is_mobius_map( _test_left_op ) || is_complex_matrix( _test_left_op ) )
														_method = "%left%."+_match_fn_name.toLowerCase()+"()" ;
		                        break ;
		                        case "det":
													  if ( is_mobius_map( _test_left_op ) ) _method = "%left%."+_match_fn_name.toLowerCase()+"()" ;
													  else if ( is_complex_matrix( _arg_obj ) ) _method = "%left%."+_match_fn_name.toLowerCase()+"()" ;
														break ;
														default:
                            _default_switch = YES ;
														if ( _fn_lib_index >= 0 )
														{
																_translation_chunk = _glob_circles_js_translation_methods[_fn_lib_index] ;
																_ext_fn_name = _translation_chunk[0] ;
																_re = new RegExp( "("+_ext_fn_name+")", "gim" ) ;
																_re.lastIndex = 0 ;
																_match_ret = _re.exec( _code );
																if ( _match_ret != null )
																{
                                    _match_index = _match_ret['index'] ;

																		_ext_fn_args = _translation_chunk[1] ;
																		_int_fn_name = _translation_chunk[2] ;
																		_int_fn_args = _translation_chunk[3] ;
																		_args_mapping = _translation_chunk[4].split(",").work( function( _d ) { return _d.trim() ; } ) ;

																    var _ext_fn_args_array = _ext_fn_args.includes( "," ) ? _ext_fn_args.replace( /\(|\)/g, "" ).split( "," ) : [ _ext_fn_args ] ;
																    var _int_fn_args_array = _int_fn_args.includes( "," ) ? _int_fn_args.replace( /\(|\)/g, "" ).split( "," ) : [ _int_fn_args ] ;
																		for( var _s = 0 ; _s < _int_fn_args_array.length ; _s++ ) _int_fn_args_array[_s] = "null" ;

																		for( var _m = 0 ; _m < _args_array.length ; _m++ )
																		{
																				var _map_info = _args_mapping[_m].count(">>") == 1 ? _args_mapping[_m].split( ">>" ) : null ;
																				var _src =  safe_int( _map_info[0], -1 ) ;
																				var _dest =  safe_int( _map_info[1], -1 ) ;
																				_int_fn_args_array[ _dest ] = _args_array[ _src ] ; 
																		}
                                    
																		_code = _code.replace_between( _match_index, _match_index + _ext_fn_name.length, _int_fn_name ) ;
																		_re.lastIndex = 0 ;
																		_re = new RegExp( _match_args_bunch.replace( /\(/, "\\(" ).replace( /\)/, "\\)" ), "gim" ) ;
																		_match_ret = _re.exec( _code );

																		if ( _match_ret != null )
 																		_code = _code.replace_between( _match_ret['index'], _match_ret['index'] + _match_ret[0].length, "("+_int_fn_args_array.join( "," )+")" ) ;

																		_code = _code.replace( /([\,null]*\))/g, ")" ) ; // delete trailing null entries up to closing parenthesis
																}
														}
														break ;
												}

												if ( _method.trim().length > 0 )
												{
				                    _translated = _method.replace( "%left%", _obj ).replace( "%args%", _args ) ;
														_code = _code.replace_between( _match_index, _match_index + ( "0 /*"+_match_str+"*/" ).length, _translated );
				                    _re.lastIndex = _match_index + _translated.length ;
												}
                        else if ( !_default_switch )
                        {
                            _code = _code.replace_between( _match_index, _match_index + ( "0 /*"+_match_str+"*/" ).length, _match_str );
                        }
										}
								}

								return _code ;
           }
        ]
]
    );