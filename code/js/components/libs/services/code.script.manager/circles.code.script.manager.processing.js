function circles_lib_js_manager_pre_process_code( _code )
{
	   // pack all output commands into comment tokens
     // so that they are not run during the further parsing
     var _re = /((write|error|warning)\(([\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~\w\ \t]{1,})\)\s*\;*)/gim ;
     _code = _code.replace( _re, "/*[$1]*/" );
     return _code ;
}

function circles_lib_js_manager_post_process_code( _code )
{
	   // unpack all output commands from comment tokens for final parsing
	   _code = _code.replaceAll( [ "/*[", "]*/" ], "" ) ;
	   return _code ;
}

function circles_lib_js_manager_detect_vars( _code )
{
    var _vars = [], _possible_candidate_objs_count = 0 ;
    var _errors = [] ;
    if ( is_string( _code ) )
    {
         var _re_array = [ /([\w\d]*)\s*\=\s*(\s*\_*[\"|\w|\d\.]{1,})/gim // take var id and value
				 								 ] ;

         var _re, _dels = [], _match_ret ;
         var _reserved_words = _glob_script_editor_reserved_circles.concat( _glob_script_editor_reserved_javascript ) ;
         var _match_token, _match_var_id, _match_remainder, _rows = [], _toks ;
         for( var _step = 0 ; _step < _re_array.length ; _step++ )
         {
             _re = _re_array[_step] ;
             _rows = _code.split( /\r\n|\n/ ) ;
             for( var _r = 0 ; _r < _rows.length ; _r++ )
             {
                 _rows[_r] = _rows[_r].trim();
                 _toks = _rows[_r].split( /\;|\,/ );
								 _toks.clean_from( function( _obj ) { return _obj.trim().length == 0 ? 1 : 0 ; } ) ;
                 _possible_candidate_objs_count += _toks.length ;
                 if ( !_rows[_r].start_with_i( "var" ) ) continue ;

                 while( ( _match_ret = _re.exec( _rows[_r] ) ) != null )
                 {
                     _match_token = _match_ret[0] ;
                     if( _step == 0 )
                     {
                         _match_var_id = _match_ret[1], _match_var_value = _match_ret[2] ;
                         if ( !_reserved_words.includes( _match_var_id ) )
                         {
                         		 if ( _match_var_id.charAt(0).isNumber() )
                         		 {
																 _errors.push( "Inconsistent identifier " + _match_var_id + " : it cannot start with a digit"  ) ;
														 }
                         		 else if ( _match_var_value.trim().toLowerCase().strcmp( "new" ) )
                         		 {
    														 var _ret = _rows[_r].run_forward_up_to( /\(|\;/, _match_ret['index'] + _match_token.length, 1 );
    														 var _expr = "var _t1 = new " + ( ( is_array( _ret ) ) ? _ret[0] : "" ) ;
    														 		 _ret = _rows[_r].run_forward_up_to( /\)|\;/, _ret[2], 1 );
    														 var _params = is_array( _ret ) ? _ret[0] : "" ; 
    														 		 _expr += _params ;
    														 var _response = 1 ;
    														 try{ eval( _expr ) } catch( _err ) { _response = 0 ; _errors.push( _err ); } ;
    				                     if ( _response ) _vars.push( [ "var", _match_var_id,
																 																_t1.constructor.name.toLowerCase().replace( /[\.\_\-]/g, " " ),
																																_params.replace( /\(|\)/, "" )
																															] ) ;
    												 }
                         		 else if ( _match_var_value.toLowerCase().strcmp( "function" ) )
                         		 {
    														 var _ret = _rows[_r].run_forward_up_to( /\)/, _match_ret['index'] + _match_token.length, 1 );
    														 _args = _ret[0].trim().split( "," ).work( function( _a ) { return _a.trim() ; } ).join( "," ) ;
   															 _vars.push( [ "function",
																							 _match_var_id,
																							 "",
																							 _args.length > 0 ? "none" : _args
																						 ] ) ;
    												 }
    												 else
    												 {
    												 		 var _expr = "var _t1 = " + _match_var_value + ";" ;
    														 var _response = 1 ;
							                   var _run_chunk = _rows[_r].run_backward_up_to( /var/, _match_ret['index']+_match_var_id.length, 0 ) ;
							                   var _code_before_formula = _rows[_r].substring( 0, _run_chunk[2] ).trim() ;
							                   if ( _code_before_formula.length > 0 )
							                   {
							                   		 _code_before_formula = _code_before_formula.trim() ;
							                   		 if ( _code_before_formula.trim().toLowerCase().strcmp( "var" ) ) continue ;
							                   		 if ( !_code_before_formula.end_with( ";" ) )
																		 _code_before_formula = _code_before_formula.set_char_at( _code_before_formula.length - 1, ";" ) ;

																 		 try{ eval( _code_before_formula ) ; }
																 		 catch( _err ) { _errors.push( _err ); }
																 }
							                   
    														 try{ eval( _expr ) ; }
																 catch( _err )
																 {
																 		_errors.push( _err ) ;
																 		_response = 0 ;
																 }
    				                     
																 if ( _response )
																 {
																 		 var _kind = "var" ;
																 		 var _type = _t1.constructor ? _t1.constructor.name.toLowerCase() : ( typeof _t1 ).toLowerCase() ;
																 		 if ( _type.strcmp( "number" ) ) _kind = "constant" ;
																 		 else if ( _match_var_value.includes( _glob_crlf ) ) _kind = "text" ;
																		 _vars.push( [ _kind, _match_var_id, _type, _match_var_value ] ) ;
																 }
    												 }
    										 }
                     }
    
                     _re.lastIndex = _match_ret['index'] + _match_token.length ;
                 }
             }
         }
    }

    return [ _vars.unique().clone(), _possible_candidate_objs_count, _errors.clone() ] ;
}

function circles_lib_js_manager_detect_fns( _code )
{
    var _fns_id = [] ;
    if ( is_string( _code ) )
    {
         var _re_array = [ /(?:function)\s*(\_*[\w\d]{1,})\s*\(([\w\,\s]{0,})\)/gim
                         ] ;         

         var _reserved_words = _glob_script_editor_reserved_circles.concat( _glob_script_editor_reserved_javascript ) ;
         var _re, _match_token, _match_token, _match_fn_args ;
         for( var _step = 0 ; _step < _re_array.length ; _step++ )
         {
             _re = _re_array[_step] ;
             while( true )
             {
                 var _match_ret = _re.exec( _code ) ;
                 if ( _match_ret == null ) break ;
                 if( _step == 0 )
                 {
                     _match_token = _match_ret[0] ;
                     _match_fn_name = _match_ret[1].trim() ;
                     _match_fn_args = _match_ret[2].trim() ;
                     if ( !_reserved_words.includes( _match_fn_name ) )
										 _fns_id.push( [ "function", _match_fn_name, "", _match_fn_args ] ) ;
                 }

                 _re.lastIndex = _match_ret['index'] + _match_token.length ;
             }

             _step++ ;
         }
    }

    return _fns_id.unique().clone() ;
}