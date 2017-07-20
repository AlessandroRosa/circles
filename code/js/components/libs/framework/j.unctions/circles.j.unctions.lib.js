// the "j-unctions" library manages points of code
// where a number of functions is collected and then run in sequence at a given point of code.
// J-unctions work to connect services of different areas of code at once
// and in a dynamical manner through the addition | erase | clearance of
// a multi-dimensional array
/*
         FN#1   #FN2
           \     |
           -----[J] ---> run all together at once
          /      |
        #FN3    #FN4
*/
// p.s. I liked the term 'j-unctions' because it sounds like "f-unctions"

/*
 * each entry consists of a packed array ( the separator is char '|' )
 * the indexed list of elements therein follows
 * 0 : function name
 * 1 - n : list of arguments
 */

function circles_lib_junctions_collection_create()
{
    var _collection_label = safe_size( arguments, 0 ) > 0 ? arguments[0] : "" ;
    if ( !is_array( _glob_junctions[ _collection_label ] ) )
    _glob_junctions[ _collection_label ] = [] ;
    return is_array( _glob_junctions[ _collection_label ] ) ? YES : NO ;
}

function circles_lib_junctions_collection_exists()
{
    var _collection_label = safe_size( arguments, 0 ) > 0 ? arguments[0] : "" ;
    return _collection_label.length > 0 ? ( is_array( _glob_junctions[ _collection_label ] ) ? YES : NO ) : NO ;
}

function circles_lib_junctions_add_to_collection()
{
    var _collection = [], _ret = NO ;
    for( var _a = 0 ; _a < arguments.length ; _a++ ) _collection.push( arguments[_a] );
    if ( is_array( _collection ) )
    {
         if ( safe_size( _collection, 0 ) > 2 )
         {
             var _collection_label = _collection[0] ;
             var _packed = _collection[1] + "|" + _collection.from_to( 2, _collection.length - 1 ).join( "|" );
             
             if ( !is_array( _glob_junctions[ _collection_label ] ) )
             circles_lib_junctions_collection_create( _collection_label ) ;
             
             if ( is_array( _glob_junctions[ _collection_label ] ) )
             {
                  var _pre_n = safe_size( _glob_junctions[ _collection_label ], 0 );
                  _glob_junctions[ _collection_label ].push( _packed );
                  var _post_n = safe_size( _glob_junctions[ _collection_label ], 0 );
                  if ( _post_n == _pre_n + 1 ) _ret = YES ;
             }
             else _ret = NO ;
         }
    }

    return _ret ;
}

function circles_lib_junctions_collection_get()
{
    var _collection_label = safe_size( arguments, 0 ) > 0 ? arguments[0] : "" ;
    return circles_lib_junctions_collection_exists( _collection_label ) ? _glob_junctions[ _collection_label ] : null ;
}

function circles_lib_junctions_delete_from_collection()
{
    var _collection_label = safe_size( arguments, 0 ) > 0 ? arguments[0] : "" ;
    var _fn_name = safe_size( arguments, 0 ) > 1 ? arguments[1] : "" ;
    var _ret = NO ;
    if ( safe_string( _collection_label, "" ).trim().length > 0 )
    {
         var _pre_n = safe_size( _glob_junctions[ _collection_label ], 0 );
         for( var _i = 0 ; _i < _pre_n ; _i++ )
         {
              if( _glob_junctions[ _collection_label ][_i].split( "|" ).find( _fn_name ) )
              {
                  _glob_junctions[ _collection_label ].remove( _i, _i );
                  var _post_n = safe_size( _glob_junctions[ _collection_label ], 0 );
                  _ret = _post_n == _pre_n - 1 ? YES : NO ;
                  break ;
              }
         }
    }

    return _ret ;
}

function circles_lib_junctions_collection_destroy()
{
    var _collection_label = safe_size( arguments, 0 ) > 0 ? arguments[0] : "", _ret = NO ;
    if ( is_array( _glob_junctions[ _collection_label ] ) )
    {
         _glob_junctions[ _collection_label ].flush();
         var _post_n = safe_size( _glob_junctions[ _collection_label ], 0 );
         if ( _post_n == 0 ) _ret = YES ;
    }

    return _ret ;
}

function circles_lib_junctions_collection_run()
{
    var _collection_label = safe_size( arguments, 0 ) > 0 ? arguments[0] : "" ;
    var _ret = NO, _args, _fn ;
    if ( safe_string( _collection_label, "" ).trim().length > 0 )
    {
        var _pre_n = safe_size( _glob_junctions[ _collection_label ], 0 ), _entry = null ;
        for( var _i = 0 ; _i < _pre_n ; _i++ )
        {
      			_entry = _glob_junctions[ _collection_label ][_i].split( "|" );
            if( is_array( _entry ) )
            {
               _args = _entry ;
               _fn = _args[0] + "( "+( _args.from_to( 1, _args.length - 1 ).work( function( _item )
																																								  {
																																								 	  if ( _item.length == 0 ) return "" ;
																																								 		else if ( _item == "this" ) return _item ;
																																								 		return "'"+_item+"'" ;
																																									} ).join( "," ) )+" )" ;
               try { eval( _fn ); } catch( _err ) { circles_lib_error_obj_handler( _err ) ; }
            }
        }
    }

    return _ret ;
}