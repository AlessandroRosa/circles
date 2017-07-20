function circles_lib_js_manager_repo_all_labels_get( _array_ref, _label )
{
    var _labels = [] ;
    $.each( _array_ref, function( _i, _chunk ) { if ( safe_size( _chunk[0], 0 ) > 0 ) _labels.push( _chunk[0] ) ; } );
    return _labels.clone() ;
}

function circles_lib_js_manager_repo_chunk_exists( _array_ref, _label )
{
    var _exists = NO, _index = UNFOUND ;
    $.each( _array_ref,
            function( _i, _chunk )
            {
                if ( _chunk[0].strcmp( _label ) )
                {
                    _exists = YES, _index = _i ;
                    return false ;
                }
            }
          );
    return [ _exists, _index ] ;
}

function circles_lib_js_manager_repo_entry_exists( _entry, _ret_data, _array_ref )
{
    var _exists = NO, _index = UNFOUND ;
    if ( !is_array( _array_ref ) ) return [ NO, UNDET ] ;
    if ( !is_array( _ret_data ) ) _ret_data = [] ;
    $.each( _array_ref,
            function( _i, _chunk )
            {
                if ( is_array( _chunk ) ) circles_lib_js_manager_repo_entry_exists( _entry, _ret_data, _chunk ) ;
                else
                {
                    $.each( _array_ref, function( _i, _piece ) { if ( _piece == _entry ){ _ret_data[ YES ] ; return false ; } } ) ;
                }
            }
          );
    return [ _exists, _index ] ;
}

function circles_lib_js_manager_repo_chunk_data_get( _array_ref, _label )
{
    var _exists = circles_lib_js_manager_repo_chunk_exists( _array_ref, _label ) ;
    if ( _exists[0] )
    {
        var _chunk = _array_ref[ _exists[1] ] ;
        _chunk = _chunk.from_to( 1, safe_size( _chunk, 0 ) ).clone() ;
        return _chunk.clone() ;
    }
    else return null ;
}

function circles_lib_js_manager_repo_code( _input_code )
{
		_input_code = safe_string( _input_code, "" );
		var _keys = [], _subset_label = "", _tokens = [] ;
				$.each( _glob_script_editor_builtin_data_types, function( _i, _chunk )
								{
										if ( _chunk[1].length > 0 ) _input_code = _input_code.replaceAll( _chunk[1], _chunk[0] );
								}
						  ) ;

		$.each( _glob_circles_js_translation,
						function( _i, _translation_chunk )
						{
								if ( is_array( _translation_chunk ) )
								$.each( _translation_chunk,
												function( _j, _data )
												{
														if ( _j == 0 )
														{
															 _keys.push( _data );
															 _subset_label = _data ;
														}
														else
														{
																switch( safe_size( _data, 0 ) )
																{
																		case 1:
				                            if ( is_function( _data[0] ) )
				                            {
																				_input_code = _data[0].call( this, _input_code ) ;
				                            }
																		break ;
																		case 2:
				                            if ( is_string( _data[0] ) && is_string( _data[1] ) )
				                            {
																				_input_code = _input_code.replaceAll( _data[0], _data[1] );
				                            }
																		break ;
																}
														}
														
														console.log( "-------------------------" ) ;
														console.log( _subset_label ) ;
														console.log( _input_code ) ;
														console.log( "-------------------------" ) ;
												}
											) ;
						}
					) ;

		return _input_code ;
}

function circles_lib_js_manager_repo_chunk_add( _label, _translation_dict )
{
		if ( is_array( _translation_dict ) && is_string( _label ) )
		{
				_glob_circles_js_translation.push( [ _label, _translation_dict ] ) ;
				return YES ;
		}
		else return NO ;
}
