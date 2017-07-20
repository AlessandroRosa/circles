function circles_lib_js_manager_projs_count() { return safe_size( _glob_js_code_projs_array, 0 ) ; }
function circles_lib_js_manager_scripts_project_add( _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
		if ( safe_size( _proj_label, 0 ) == 0 )
		{
				 var _keys = _glob_js_code_projs_array.keys_associative() ;
				 _proj_label = "Proj "+( is_array( _keys ) ? _keys.length + 1 : 1 ) ;
		}

	  if ( !is_array( _proj_label ) )
	  {
				_glob_js_code_projs_array[ _proj_label ] = [] ;
		 	  return [ YES, _proj_label ] ;
		}
		else return [ NO, _proj_label ] ;
}

function circles_lib_js_manager_scripts_project_remove( _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
		if ( safe_size( _proj_label, 0 ) == 0 ) return [ NO, _proj_label ] ;
		else
		{
				var _old_size = safe_size( _glob_js_code_projs_array.keys_associative(), 0 ) ;
			  _glob_js_code_projs_array.remove_key( _proj_label ) ;
				var _new_size = safe_size( _glob_js_code_projs_array.keys_associative(), 0 ) ;
				return [ _new_size < _old_size ? YES : NO, _proj_label ] ;
		}
}

function circles_lib_js_manager_scripts_rename_project( _old_proj_label, _new_proj_label )
{
		_old_proj_label = safe_string( _old_proj_label, "" ).trim() ;
		_new_proj_label = safe_string( _new_proj_label, "" ).trim() ;
		if ( safe_size( _old_proj_label, 0 ) == 0 || safe_size( _new_proj_label, 0 ) == 0 ) return [ NO, _old_proj_label, _new_proj_label ] ;
		else
		{
				if ( !is_array( _glob_js_code_projs_array[ _old_proj_label ] ) ) return [ NO, _old_proj_label, _new_proj_label ] ;
				else
				{
						var _tmp = _glob_js_code_projs_array[ _old_proj_label ].clone() ;
						_glob_js_code_projs_array.remove_key( _old_proj_label );
						_glob_js_code_projs_array[ _new_proj_label ] = _tmp.clone() ;
				}
				return [ YES, _old_proj_label, _new_proj_label ] ;
		}
}

function circles_lib_js_manager_scripts_count( _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
		return safe_size( _proj_label, 0 ) > 0 ? safe_size( _array_ref, 0 ) : UNDET ;
}

function circles_lib_js_manager_scripts_count_selected( _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
    _array_ref.recursive_run = 0 ;
    var _cnt = 0 ;
    is_array( _array_ref ) ? _array_ref.work( function( _entry ) { if ( _entry[2] ) _cnt++ ; } ) : 0 ;
		return _cnt ;
}

function circles_lib_js_manager_scripts_all_modules_selected( _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
    if ( is_array( _array_ref ) )
    {
				var _check = 1, _old = _array_ref.recursive_run ;
				_array_ref.recursive_run = 0 ;
				_array_ref.work( function( _entry ){ _check &= _entry[2] ; } ) ;
				_array_ref.recursive_run = _old ;
				return _check ;
		}
		else return NO ;
}

function circles_lib_js_manager_find_module_index( _entry_label, _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
		if ( is_number( _entry_label ) ) _entry_label += "" ;
    if ( !is_array( _array_ref ) ) return UNFOUND ;
		else if ( is_string( _entry_label ) )
		{
				var _index = UNFOUND ;
		    if ( _entry_label.isNumber() ) return safe_int( _entry_label, UNFOUND );
		    $.each( _array_ref,
		            function( _i, _chunk )
		            {
	                 if ( is_array( _chunk ) )
		               {
		                  if ( _entry_label.strcmp( _chunk[0] ) )
		                  {
		                     _index = _i ;
		                     return false ;
		                  }
		               }
		            }
		          ) ;
		          
		    return _index ;
		}
		else return UNFOUND ;
}

function circles_lib_js_manager_module_exists( _entry_label, _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
    if ( !is_array( _array_ref ) ) return NO ;
    var _exists = NO ;
    $.each( _array_ref,
            function( _i, _chunk )
            {
                if ( is_array( _chunk ) )
                {
                    if ( _entry_label.strcmp( _chunk[0] ) )
                    {
                         _exists = YES ;
                         return false ;
                    }
                }
            }
          ) ;
          
    return _exists ;
}

function circles_lib_js_manager_module_get_data( _referrer, _proj_label, _datatype )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
		_datatype = safe_string( _datatype, "" ).trim().toLowerCase() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
		if ( is_number( _referrer ) ) _referrer += "" ;
    if ( !is_array( _array_ref ) || _datatype.length == 0 ) return null ;
		if ( is_string( _referrer ) )
		{
				var _chunk = null ;
				if ( _referrer.isNumber() )
				{
						_referrer = safe_int( _referrer, UNFOUND );
            if ( _referrer == UNFOUND || _array_ref[ _referrer ] == null ) return null ;
            else if ( _datatype == "label" ) return _array_ref[ _referrer ][0] ;
            else if ( _datatype == "code" ) return _array_ref[ _referrer ][1] ;
            else if ( _datatype == "selected" ) return _array_ref[ _referrer ][2] ;
            else if ( _datatype == "breakpoint" ) return _array_ref[ _referrer ][3] ;
				}
				else
				{
						var _ret_data = null ;
						$.each( _array_ref,
										function( _i, _chunk )
										{
												if ( _chunk.strcmp( _referrer ) )
												{
														if ( _datatype.strcmp( "label" ) ) _ret_data = _array_ref[_i][0] ;
														else if ( _datatype.strcmp( "code" ) ) _ret_data = _array_ref[_i][1] ;
														else if ( _datatype.strcmp( "selected" ) ) _ret_data = _array_ref[_i][2] ;
														else if ( _datatype.strcmp( "breakpoint" ) ) _ret_data = _array_ref[_i][3] ;
														return false ;
												}
										}
									) ;
						return _ret_data ;
				}
		}
		else return null ;
}

function circles_lib_js_manager_module_heal( _entry_label, _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
    if ( !is_array( _array_ref ) ) return UNDET ;
    for( var _i = 0 ; _i < safe_size( _array_ref ) ; _i++ )
    {
        _array_ref[_i][0] = safe_string( _array_ref[_i][0], "" ).trim() ;
        _array_ref[_i][1] = safe_string( _array_ref[_i][1], "" ).trim() ;
        _array_ref[_i][3] = -1 ;
        if ( safe_size( _array_ref[_i][0], 0 ) == 0 ) _array_ref[_i][0] = "module" + ( safe_size( _array_ref, 0 ) + 1 ) ;
        else if ( safe_size( _array_ref[_i][1], 0 ) == 0 )
        {
            _array_ref.remove( _i, _i );
            _i = -1 ;
        }
    }
    
    return safe_size( _array_ref, 0 );
}

function circles_lib_js_manager_module_add( _code_script_text, _entry_label, _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
		_entry_label = safe_string( _entry_label, "" ).trim() ;
		_code_script_text = safe_string( _code_script_text, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
    var _exists = circles_lib_js_manager_module_exists( _entry_label, _proj_label ) ;
    if ( !is_array( _array_ref ) )
    {
        if ( _proj_label.length == 0 ) _proj_label = "Proj " + ( _glob_js_code_projs_array.keys_associative().length + 1 ) ; 
				_glob_js_code_projs_array[_proj_label] = [] ;
				_array_ref = _glob_js_code_projs_array[_proj_label] ;
		}
		
		if ( _code_script_text.trim().length > 0 )
		{
				if ( _entry_label.length == 0 ) _entry_label = "module" + ( safe_size( _array_ref, 0 ) + 1 ) ;
				if ( !_exists ) _array_ref.push( [ _entry_label, _code_script_text,
                                          1, /* selection flag */
                                          -1 /* breakpoint row number */
                                         ] ) ;
				else
				{
						var _index = circles_lib_js_manager_find_module_index( _entry_label, _proj_label ) ;
						if ( is_array( _array_ref[_index] ) ) _array_ref[_index][1] = _code_script_text ;
						else return [ NO, _entry_label, _proj_label ]
				}
				return [ YES, _entry_label, _proj_label ] ;
		}
		else return [ NO, _entry_label, _proj_label ] ;
}

function circles_lib_js_manager_update_entry_code( _entry_label, _code_script_text, _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
    var _index = circles_lib_js_manager_find_module_index( _old_label, _proj_label ) ;
    if ( !is_array( _array_ref ) ) return NO ;
		else if ( _index != UNFOUND )
		{
        _array_ref[_index][1] = _code_script_text ;
        return YES ;
		}
		else return NO ;
}

function circles_lib_js_manager_module_rename( _old_label, _new_label, _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
    var _index = circles_lib_js_manager_find_module_index( _old_label, _proj_label ) ;
    if ( !is_array( _array_ref ) ) return NO ;
		else if ( _index != UNFOUND )
    {
       _array_ref[_index][0] = _new_label ;
       return YES ;
    }
    else return NO ;
}

function circles_lib_js_manager_module_delete( _entry_label, _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
    var _index = circles_lib_js_manager_find_module_index( _entry_label, _proj_label ) ;
    if ( !is_array( _array_ref ) ) return NO ;
		else if ( _index != UNFOUND )
		{
				var _old_size = safe_size( _array_ref );
        _array_ref.remove( _index, _index );
				var _new_size = safe_size( _array_ref );
				return _old_size == _new_size + 1 ? YES : NO ;
		}
		else return NO ;
}

function circles_lib_js_manager_module_compile( _entry_label, _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
    var _index = circles_lib_js_manager_find_module_index( _entry_label, _proj_label ) ;
    if ( !is_array( _array_ref ) ) return [ NO, "Invalid project data" ] ;
		else if ( _index != UNFOUND )
		{
				 var _ret = YES, _msg = _entry_label + " has been run with success" ;
				 try{ window.eval( _array_ref[_index][1] ) }
				 catch( _err ){ _ret = NO ; _msg = _err.message ; circles_lib_error_obj_handler( _err ); }
				 return [ _ret, _msg ] ;
		}
		else return [ NO, "Unfound code file" ] ;
}

function circles_lib_js_manager_module_merge( _label_1, _label_2, _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
		var _index_1 = circles_lib_js_manager_find_module_index( _label_1, _proj_label ) ;
		var _index_2 = circles_lib_js_manager_find_module_index( _label_2, _proj_label ) ;
    if ( !is_array( _array_ref ) ) return NO ;
    else if ( _index_1 != UNFOUND && _index_2 != UNFOUND )
		{
				_array_ref[_index_1][1] += _glob_crlf.repeat(2) + "//Start of appended entry code '"+_label_2+"'" + _glob_crlf.repeat(2) ;
				_array_ref[_index_1][1] += _array_ref[_index_2][1] ;

				var _old_size = safe_size( _array_ref );
        _array_ref.remove( _index_2, _index_2 );
				var _new_size = safe_size( _array_ref );
				return _old_size == _new_size + 1 ? YES : NO ;
		}
		else return NO ;
}

function circles_lib_js_manager_extract_code_from_proj( _proj_label, _entry_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
		_entry_label = safe_string( _entry_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
    if ( !is_array( _array_ref ) ) return [ NO, "" ] ;
    else
    {
        var _code = "" ;
        for( var _i = 0 ; _i < safe_size( _array_ref ) ; _i++ )
        {
            if ( _entry_label.length == 0 || _entry_label.strcmp( _array_ref[_i][0] ) )
            _code += safe_string( _array_ref[_i][1], "" ).trim() ;
        }
        return [ _code.length > 0 ? YES : NO, _code ] ;
    }
}

function circles_lib_js_manager_module_move( _index, _action_str, _proj_label )
{
		_proj_label = safe_string( _proj_label, "" ).trim() ;
    var _array_ref = _glob_js_code_projs_array[_proj_label] ;
    _index = Math.max( 0, safe_int( _index, 0 ) ), _action_str = safe_string( _action_str, "" ).toLowerCase() ;
    if ( !is_array( _array_ref ) ) return NO ;
    else if ( _action_str.length == 0 || !is_array( _array_ref[_index] ) ) return NO ;
    else
    {
         if ( _action_str.is_one_of( "up", "down" ) )
         {
              var _entries_n = safe_size( _array_ref, 0 );
              switch( _action_str )
              {
                  case "up":
                  if ( _index == 0 ) return NO ;
                  else
                  {
                      var _new_index = _index - 1 ;
                      var TMP = _array_ref[_new_index] ;
                      _array_ref[_new_index] = _array_ref[_index] ;
                      _array_ref[_index] = TMP ;
                  }
                  break ;
                  case "down":
                  if ( _index == ( _entries_n - 1 ) ) return NO ;
                  else
                  {
                      var _new_index = _index + 1 ;
                      var TMP = _array_ref[_new_index] ;
                      _array_ref[_new_index] = _array_ref[_index] ;
                      _array_ref[_index] = TMP ;
                  }
                  break ;
              }
              return YES ;
         }
         else return NO ;
    }
}