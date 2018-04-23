function circles_lib_storage_reset()
{
    var _keys = is_array( _glob_storage ) ? _glob_storage.keys_associative() : [] ;
    if ( safe_size( _keys, 0 ) > 0 )
    $.each( _keys, function( _i, _key ){ _glob_storage[_key].flush() ; } ) ;
    _glob_storage = [];
    _glob_storage["circles"] = [];
    _glob_storage["dict"] = [];
    _glob_storage["farey"] = [];
    _glob_storage["figures"] = [];
    _glob_storage["lines"] = [];
    _glob_storage["matrix"] = [] ;
    _glob_storage["mobius"] = [] ;
    _glob_storage["points"] = [];
    _glob_storage["seeds"] = [];
    _glob_storage["words"] = [];
    return safe_size( _keys, 0 ) ;
}

function circles_lib_storage_parse_dependencies_syntax( _input_str = "", _action = "" )
{
		_input_str = safe_string( _input_str, "" ), _action = safe_string( _action, "" );
		if ( _action.stricmp( "all" ) ) return _glob_storage.keys_associative();
    var _storageref = _input_str.includes( "@" ) ? _input_str.split( "@" ) : ( _input_str.length > 0 && _input_str.testME( _glob_storage_key_regex_pattern ) ? [ _input_str ] : [] ) ;
		var _n_dependencies = safe_size( _storageref, 0 );
		if ( _n_dependencies == 0 || safe_size( _action, 0 ) == 0 ) return null ;
		else
		{
				 var _build_dependencies = [] ;
				 $.each( _storageref, function( _i, _tok ){ if ( _tok.testME( _glob_storage_key_regex_pattern ) ) _build_dependencies.push( "['"+_tok+"']" ) } ) ;
				 var _storage_cmd_init = "_glob_storage" + _build_dependencies.join( "" ), _storage_cmd_append ;
				 var _last_token = _storageref.get_last();

				 switch( _action )
				 {
				 			case "add":
				 			var _ret = YES, _cmd = "_dependency_exists = " + _storage_cmd_init + " != null ? YES : NO ;" ;
							try { eval( _cmd ) ; }
							catch( _err )
							{
								 _ret = NO ;
								 circles_lib_error_obj_handler( _err );
							}

							if ( !_dependency_exists ) return NO ;
							else
							{
									var _items = arguments[2] ;
									if ( _items == null ) return CIRCLES_MISSING_INPUT ;
									else
									{
											 _items = is_array( _items ) ? _items : [ _items ] ;
											 $.each( _items, function( _i, _item )
											 {
												_cmd = "_item = new " + _item + " ;" ;
												try { eval( _cmd ) ; }
												catch( _err ) { _ret = NO ; circles_lib_error_obj_handler( _err ); return _ret ; }

												if ( _ret )
												{
													_cmd = _storage_cmd_init + ".push( _item );" ;
													try { eval( _cmd ) ; }
													catch( _err ) { _ret = NO ; circles_lib_error_obj_handler( _err ); return _ret ; }
												}
											 }
											 ) ;
											 return _ret ;
									}  
							}
				 			break ;
							case "check": return _n_dependencies > 0 ? YES : NO ; break ;
							case "create":
							var _ret = YES, _dependency_exists ;
							if ( _n_dependencies == 1 )
							{
								  _cmd = "_dependency_exists = " + _storage_cmd_init + " != null ? YES : NO ;"
									try { eval( _cmd ) ; } catch( _err ) { _ret = NO ; circles_lib_error_obj_handler( _err ); }
								  if ( !_dependency_exists )
									{
											_cmd = _storage_cmd_init + " = [];" ;
											try { eval( _cmd ); _ret = YES ; } catch( _err ) { _ret = NO ; circles_lib_error_obj_handler( _err ); }
									}
									else _ret = EXISTS ;
							}
							else if ( _n_dependencies > 0 )
							{
									var _sub = "", _cmd ;
									for( var _i = 1 ; _i <= _n_dependencies ; _i++ )
									{
										 _sub = _build_dependencies.subset( _i ) ;
										 _storage_cmd_append = "_glob_storage" + _sub.join( "" ) ;
										 _cmd = "_dependency_exists = " + _storage_cmd_append + " != null ? YES : NO ;" ;
										 try { eval( _cmd ); } catch( _err ) { circles_lib_error_obj_handler( _err ); }
										 if ( !_dependency_exists )
										 {
										 		_cmd = _storage_cmd_append + " = [] ;" ;
										 		try { eval( _cmd ); _ret = YES ; } catch( _err ) { _ret = NO ; circles_lib_error_obj_handler( _err ); }
										 }
										 else _ret = EXISTS ;
									}
							}
							return _ret ;
							break ;
							case "exists":
							var _dependencies_ret_array = null ;
							_storage_cmd_append = "_dependencies_ret_array = "+_storage_cmd_init+";" ;
							try { eval( _storage_cmd_append ) ; } catch( _err ) { _dependencies_ret_array = null ; circles_lib_error_obj_handler( _err ); }
							return is_array( _dependencies_ret_array ) ? YES : NO ;
							break ;
							case "get":
							var _dependencies_ret_array = null ;
							_storage_cmd_append = "_dependencies_ret_array = "+_storage_cmd_init+";" ;
							try { eval( _storage_cmd_append ) ; } catch( _err ) { _dependencies_ret_array = null ; circles_lib_error_obj_handler( _err ); }
							return is_array( _dependencies_ret_array ) ? _dependencies_ret_array.clone() : null ;
							break ;
							case "purge":
							var _dependencies_ret_array = null ;
							_storage_cmd_append = "_dependencies_ret_array = "+_storage_cmd_init+";" ;
							try { eval( _storage_cmd_append ) ; } catch( _err ) { _dependencies_ret_array = null ; circles_lib_error_obj_handler( _err ); }
							var _exists = is_array( _dependencies_ret_array ) ? YES : NO ;
							if ( !_exists ) return NOT_EXISTS ;
							else
							{
									 var _size = -1 ;
									 _storage_cmd_append = _storage_cmd_init + ".flush() ;" ;
									 try
									 {
											 eval( _storage_cmd_append ) ;
											 _storage_cmd_append = "_size = safe_size( " + _storage_cmd_init + ", 0) ;" ;
											 eval( _storage_cmd_append ) ;
									 }
									 catch( _err ) { circles_lib_error_obj_handler( _err ); }
									 return _size == -1 ? NO : YES ;
							}
							break ;
							case "remove":
							var _ret = YES ;
							var _dependencies_ret_array = null ;
							_storage_cmd_append = "_dependencies_ret_array = "+_storage_cmd_init+";" ;
							try { eval( _storage_cmd_append ) ; } catch( _err ) { _dependencies_ret_array = null ; circles_lib_error_obj_handler( _err ); }
							var _exists = is_array( _dependencies_ret_array ) ? YES : NO ;
							if ( !_exists ) return NOT_EXISTS ;
							else
							{
                 var _pre = Math.max( 1, _storageref.length - 1 ) ;
								 var _root_array = _storageref.subset( _pre ) ;
								 var _key = _storageref.get_last() ;
								 var _root_cmd = [] ;
				 				 $.each( _root_array, function( _i, _tok ){ if ( _tok.testME( _glob_storage_key_regex_pattern ) ) _root_cmd.push( "['"+_tok+"']" ) } ) ;

								 _storage_cmd_append = "_glob_storage" + _root_cmd.join( "" ) + ".remove_key('"+_key+"');" ;
								 var _size = -1 ;
								 try { eval( _storage_cmd_append ) ; } catch( _err ) { _ret = NO ; circles_lib_error_obj_handler( _err ); }
								 if ( _ret )
								 {
									  _storage_cmd_append = "_size = safe_size( " + "_glob_storage" + _root_cmd.join( "" ) + "['"+_key+"']" + ", 0) ;" ;
									  try{ eval( _storage_cmd_append ) ; } catch( _err ) { _size = -1 ; circles_lib_error_obj_handler( _err ); }
								 }
								 return _size == -1 ? NO : YES ;
							}
							break ;
				 			case "search":
				 			var _ret = YES, _cmd = "_dependency_exists = " + _storage_cmd_init + " != null ? YES : NO ;" ;
              var _n_found = 0, _ret_array = [] ;
							try { eval( _cmd ) ; } catch( _err ) { _ret = NO ; circles_lib_error_obj_handler( _err ); }
							if ( !_dependency_exists ) return _ret_array ;
							else
							{
                  var _dependency = null ;
                      _cmd = "_dependency = " + _storage_cmd_init ;
        					try { eval( _cmd ) ; } catch( _err ) { circles_lib_error_obj_handler( _err ); }
                  var _items = arguments[2] ;
									if ( _items == null ) return _ret_array ;
									else
									{
										 _items = is_array( _items ) ? _items : [ _items ] ;
                     var _obj = null ;
                     _cmd = "_obj = new " + _items[0] + " ;" ;
        						 try { eval( _cmd ) ; } catch( _err ) { circles_lib_error_obj_handler( _err ); }

                     var _datatypes_table = circles_lib_datatype_get_table(), _ret_equal = NO, _datatype = "" ;
                     var _map_type_comparison = [] ;
                     $.each( _datatypes_table, function( _i, _chunk ){ _map_type_comparison[""+_chunk[1]] = _chunk[4] ; } ) ;

                     $.each( _dependency,
                               function( _i, _entry_obj )
                               {
                                 _datatype = circles_lib_datatype_detect_from_obj( _entry_obj );
                                 $.each( _items,
            										 				 function( _i, _item )
            										 				 {
                                            _cmd = "_ret_equal = _entry_obj." + _map_type_comparison[ _datatype ] + "( _obj );" ;
                               							try{ eval( _cmd ) ; } catch( _err ) { _ret_equal = NO ; circles_lib_error_obj_handler( _err ); }
                                            if( _ret_equal ) _n_found++ ;
                                         } ) ;
                                 _ret_array.push( [ _last_token, _datatype, _n_found ] );
                               }
                             ) ;
										return _ret_array ;
									}
							}
				 			break ;
							case "size":
							var _dependencies_ret_array = null ;
							_storage_cmd_append = "_dependencies_ret_array = "+_storage_cmd_init+";" ;
							try { eval( _storage_cmd_append ) ; } catch( _err ) { _dependencies_ret_array = null ; circles_lib_error_obj_handler( _err ); }
							return is_array( _dependencies_ret_array ) ? safe_size( _dependencies_ret_array, 0 ) : null ;
							break ;
							case "subkeys":
							var _dependencies_ret_array = null ;
				 			var _ret = YES, _cmd = "_dependency_exists = " + _storage_cmd_init + " != null ? YES : NO ;" ;
							try { eval( _cmd ) ; } catch( _err ) { _ret = NO ; circles_lib_error_obj_handler( _err ); }
							if ( !_dependency_exists ) return null ;
							else
							{
									var _dependencies_ret_array = null ;
									_storage_cmd_append = "_dependencies_ret_array = "+_storage_cmd_init+" ;" ;
									try { eval( _storage_cmd_append ) ; }
									catch( _err ) { circles_lib_error_obj_handler( _err ); }
									return is_array( _dependencies_ret_array ) ? _dependencies_ret_array.keys_associative() : null ;
							}
							break ;
							default: return null ; break ;
				 }
		}
}

function circles_lib_storage_parse_filter_syntax( _subset, _input_filter_str, _index )
{
		_input_filter_str = safe_string( _input_filter_str, "" );
    _index = safe_int( _index, 0 );
    if ( _index > 0 ) _input_filter_str = _index + "@dict" ;
		// active filter : it applies only if not empty, otherwise it does not
		if ( _input_filter_str.length == 0 ) return _glob_storage[_subset] != null ? [ RET_OK, "No filter: returning the whole storage space subset '"+_subset+"'", "empty", "empty", _glob_storage[_subset] ] : [ RET_ERROR, "Filter error: storage space subset '"+_subset+"' is empty", "none", "none", [] ] ;
    _subset = safe_string( _subset, "" ).toLowerCase();
    // parse input str and return a set of items, depending on storage space format
    /* tokens syntax: #1@#2
       #1: range: example a* -> all strings starting with 'a', see help file of storage cmd
       #2: storage space subset
    */
    var _input_chunks = is_string( _input_filter_str ) ? ( _input_filter_str.includes( "@" ) ? _input_filter_str.split( "@" ) : [] ) : [] ;
    if ( safe_size( _input_chunks, 0 ) == 0 ) return [ RET_ERROR, "Filter error: wrong syntax for filter", "none", "none", [] ] ;
    var _input_filter = safe_string( _input_chunks[0], "" );
    var _input_storage_ref = safe_string( _input_chunks[1], "" ).toLowerCase();
    var _regex = "" ;
    if ( _subset.strcmp( "dict" ) )
    {
         return[ RET_OK, "Displaying 'dict' subset of storage space",
				 				 _glob_storage['dict'][_index] != null ? "range" : "none",
                 _glob_storage['dict'][_index] != null ? "literal" : "none",
                 _glob_storage['dict'][_index] != null ? _glob_storage['dict'][_index] : [] ] ;
    }
    else if ( _subset == "words" ) _regex = ( new String( "^\\b("+_input_filter+")\\b$" ) ).replaceAll( "*", "[A-Za-z]{0,}" );
    else if ( _subset == "farey" ) _regex = ( new String( "^\\b("+_input_filter+")\\b$" ) ).replaceAll( "*", "[0-9\\/]{0,}" );
    else if ( _subset == "figures" ) _regex = ( new String( "^\\b("+_input_filter+")\\b$" ) ).replaceAll( "*", "[0-9\\/]{0,}" );
    
    if ( !is_array( _glob_storage[_subset] ) ) return [ RET_ERROR, "Filter error: storage space subset '"+_subset+"' is empty", "none", "none", [] ] ;
    else if ( safe_size( _input_filter, 0 ) == 0 ) return [ RET_ERROR, "Filter error: missing input filter", "none", "none", [] ] ;
    else
    {
         var _out_array = [];
         /*
          * syntax for datastorage access
            range@entity
            range: 1, 2-13, a*, *bba
         */
         if ( _subset == "farey" && _input_filter.includes( "-" ) )
         {
				 			var _farey_bounds = _input_filter.split( "-" );
				 			if ( _farey_bounds.length == 2 )
				 			{
								 var _farey_left = new farey( _farey_bounds[0] );
								 var _farey_left_ratio = _farey_left.ratio();
								 var _farey_right = new farey( _farey_bounds[1] );
								 var _farey_right_ratio = _farey_right.ratio();
								 var _farey_test = new farey(), _farey_test_ratio ;
									 
                 if ( ( new String( _farey_left_ratio ) ).stricmp( "error" ) )
                 return [ RET_ERROR, "Filter error: left bound '"+_farey_bounds[0]+"' is not a p/q fraction.", "none", "none", [] ];
                 else if ( ( new String( _farey_right_ratio ) ).stricmp( "error" ) )
                 return [ RET_ERROR, "Filter error: right bound '"+_farey_bounds[1]+"' is not a p/q fraction.", "none", "none", [] ];
                 else if ( _farey_left_ratio > _farey_right_ratio )
                 return [ RET_ERROR, "Filter error: bounding fractions are not coherent: "+_farey_bounds[0]+" is greater than "+_farey_bounds[1]+".", "none", "none", [] ];
                 else
                 {
  									 $.each( _glob_storage[_subset],
   					 				 function( _i, _frac )
   					 				 {
   											_farey_test.read_fraction( _frac );
   											_farey_test_ratio = _farey_test.ratio();
   								 			if ( _farey_test_ratio >= _farey_left_ratio && _farey_test_ratio <= _farey_right_ratio )
   											_out_array.push( _frac );
   									 }
   									 );
   									 return [ RET_OK, "Filtering '"+_subset+"' subset of storage space from "+_farey_bounds[0]+" to " + _farey_bounds[1], "range", "numeric", _out_array.clone() ];
                 }
							}
							else return [ RET_OK, "Filter error: missing both bounding farey fractions for input range", "none", "none", [] ] ;
				 }
         else if ( _subset == "figures" )
         {
						 if ( safe_size( _glob_storage[_subset], 0 ) > 0 )
             {
                 $.each( _glob_storage[_subset],
       								  function( _i, _fig_obj )
							 				  {
       											if ( circles_lib_figure_get_def( _fig_obj['class'] ).stricmp( _input_filter ) )
       											_out_array.push( _frac );
       									}
       									);
             }
    				 return [ RET_OK, "Filtering '"+_subset+"' subset of storage space of class '"+_input_filter+"'", "range", "numeric", _out_array.clone() ];
         }
         else if ( _input_filter.testME( _glob_positive_integer_regex_pattern ) ) // it's just one numeric index - example : 2
         {
       		  _input_filter = safe_int( _input_filter, 0 );
       		  if ( _input_filter == 0 ) _input_filter++ ;
            switch( _subset )
            {
								case "farey":
								case "words":
           			case "seeds":
	              if ( _glob_storage[_subset][_input_filter] != null ) _out_array.push( _glob_storage[_subset][_input_filter] );
								return [ RET_OK, "Filtering '"+_subset+"' subset of storage space", "single", "numeric", _out_array.clone() ] ;
								break ;
								default: return [ RET_ERROR, "Filter error: invalid '"+_subset+"' subset of storage space", "none", "none", [] ] ; break ;
						}
				 }
         else if ( /^([0-9]{1,})\-([0-9]{1,})$/.test( _input_filter ) ) // it's a numeric range - example : 3-8
         {
            switch( _subset )
            {
								case "farey":
								case "figures":
           			case "seeds":
								case "words":
	              var _arr = _input_filter.split( "-" );
	                  _arr[0] = safe_int( _arr[0], UNDET ), _arr[1] = safe_int( _arr[1], UNDET );
                    _arr[0] = Math.max( 0, _arr[0] - 1 ), _arr[1] = Math.max( 0, _arr[1] - 1 );
                var _min = Math.min( _arr[0], _arr[1] ), _max = Math.max( _arr[0], _arr[1] );
	              for( var _i = _min ; _i <= _max ; _i++ ) _out_array.push( _glob_storage[_subset][_i] );
	              return [ RET_OK, "Filtering '"+_subset+"' subset of storage space", "range", "numeric", _out_array.clone() ];
								break ;
								default: return [ RET_ERROR, "Filter error: invalid '"+_subset+"' subset of storage space", "none", "none", [] ] ; break ;
						}
         }
         else if ( _input_filter.includes( "*" ) ) // it's a wildcard - example : a*bbb ( for words ), 1/* (for farey sequences)
         {
            switch( _input_storage_ref )
            {
            		case "figures":
            		case "seeds":
			          $.each( _glob_storage[_subset], function( _i, _obj ) { _out_array.push( _obj ); } );
			          return [ RET_OK, "Filtering '"+_subset+"' subset of storage space", "range", "literal", _out_array.clone() ];
            		break ;
								case "farey":
								case "words":
								// turning input string into regex syntax
	              $.each( _glob_storage[_subset],
                        function( _i, _obj )
                        {
                           switch( _subset )
                           {
                              case "words": if ( _obj.testME( _regex ) ) _out_array.push( _obj ); break ;
                              case "farey":
                              if ( is_array( _obj ) )
                              {
                                 if ( _obj.join( "/" ).testME( _regex ) ) _out_array.push( _obj );
                              }
                              else
                              {
                                 if ( _obj.output().testME( _regex ) ) _out_array.push( _obj );
                              }
                              break ;
                           }
                        }
                       );
	              return [ RET_OK, "Filtering '"+_subset+"' subset of storage space", "range", "literal", _out_array.clone() ];
								break ;
								default: return [ RET_ERROR, "Filter error: invalid '"+_subset+"' subset of storage space", "none", "none", [] ] ; break ;
						}
         }
         else return [ RET_OK, "Filter error: invalid filter for '"+_subset+"' subset of storage space", "none", "none", [] ] ;
    }
}

function circles_lib_storage_detect_dependency_datatype( _input_array = [] )
{
    if ( !is_array( _input_array ) ) _input_array = circles_lib_storage_parse_dependencies_syntax( _input_array, "get" ) ;
	var _datatype = [] ;
	if ( is_array( _input_array ) )
	{
		var _table = circles_lib_datatype_get_table(), _b_is = 0, _cmd = "" ;
		$.each( _input_array, function( _i, _item ) {
			$.each( _table, function( _t, _type ) {
				_cmd = "_b_is = "+_type['typizationmethod']+"( _item );" ;
				try{ eval( _cmd ); }
				catch( e ){ _b_is = NO ; }
				if ( _b_is )
				{
					_datatype.push( _type['datatype_public'] ) ;
					return false ;
				}
			} ) ;
		} ) ;
	}
	return _datatype.clone();
}

function circles_lib_storage_restore( _subset )
{
    _subset = safe_string( _subset, "" ).toLowerCase();
    var _elements = _glob_storage[_subset].size_recursive();
    if ( _elements > 0 )
    {
       var _label = "" ;
       switch( _subset )
       {
          case "seeds":
          _glob_seeds_array = [], _label = "seed" ;
          $.each( _glob_storage[_subset], function( _i, _seed_obj ) { _glob_seeds_array.push( _seed_obj ); } );
          var _n_copied = safe_size( _glob_seeds_array, 0 );
          var _msg = _n_copied == 0 ? "Fail to copy "+_label+"s to storage space" : _n_copied + " " + _label + ( _n_copied != 1 ? "s have" : " has" ) + " been copied to the proper container" ;
          return [ _n_copied == 0 ? RET_ERROR : RET_OK, _msg ] ;
          break ;
          default: return [ RET_ERROR, "Operation aborted: missing restoration handler for '"+_subset+"' storage subset" ] ; break ;
      }
    }
    else return [ RET_ERROR, "Fail to restore: the subset '"+_subset+"' of storage space is empty" ] ;
}

function circles_lib_storage_recognize_type( _data )
{
    var _array = is_array( _data ) ? _data : [ _data ], _ret_type = "", _mask = UNDET ;
    for( var _i = 0 ; _i < _array.length ; _i++ )
    {
        if ( object_exists( _array[ _i ] ) )
        {
           if ( is_number( _array[ _i ] ) ) _mask |= 1 ;
           else if ( is_complex( _array[ _i ] ) ) _mask |= 2 ;
           else if ( is_mobius_map( _array[ _i ] ) ) _mask |= 4 ;
           else if ( is_string( _array[ _i ] ) ) _mask |= 8 ;
           else if ( is_a_given_obj( _array[ _i ], "line" ) ||
                     is_a_given_obj( _array[ _i ], "rect" ) ||
                     is_a_given_obj( _array[ _i ], "line" ) ||
                     is_a_given_obj( _array[ _i ], "point" )
                   ) _mask |= 16 ;
           else if ( is_point( _array[ _i ] ) ) _mask |= 32 ;
           else if ( is_circle( _array[ _i ] ) ) _mask |= 64 ;
        }
        else
        {
           _mask = UNDET ;
           break ;
        }
    }

    if ( _mask == UNDET ) return "undetermined" ;
    else
    {
        var _log = Math.log( _mask );
        var _log2 = _log / Math.log( 2 );
        var _log2_rounded = Math.round( _log2, 2 );
        var _log2_int = Math.round( _log2, 0 );
        var _match = ( _log2_rounded == _log2_int );
        // match if _mask is a power of 2, i.e. log(_mask) is an integer
        return _match ? YES : NO ;
    }
}