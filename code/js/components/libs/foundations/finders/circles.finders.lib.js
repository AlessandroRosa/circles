function circles_lib_find_item_obj_main( _items_array = [], _token = null )
{
    if ( is_mobius_map( _token ) ) return circles_lib_find_item_obj_by_map( _items_array, _token ) ;
    else if ( is_string( _token ) ) return circles_lib_find_item_obj_by_symbol( _items_array, _token ) ;
    else if ( is_number( _token ) ) return circles_lib_find_item_obj_by_index( _items_array, _token ) ;
    else if ( is_circle( _token ) ) return circles_lib_find_item_obj_from_circle( _items_array, _token );
    else return null ;
}

function circles_lib_find_item_obj_by_index( _items_array = [], _index = UNDET )
{
    // no need to check array consistence here: the input array may be just a new one to fill later
	_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    return !_test ? null : _items_array[_index] ;
}

function circles_lib_find_item_obj_by_symbol( _items_array = [], _symbol = "" )
{
    // no need to check array consistence here: the input array may be just a new one to fill later
	_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( !_test ) return null ;
    _symbol = safe_string( _symbol, "" ).trim();
	var _items_n = safe_size( _items_array, 0 );
    for( var _i = 0 ; _i < _items_n ; _i++ ) if ( _items_array[ _i ].symbol == _symbol ) return _items_array[ _i ] ;
    return null ;
}

function circles_lib_find_item_index_by_symbol( _items_array = [], _symbol = "" )
{
    // no need to check array consistence here: the input array may be just a new one to fill later
	_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( !_test ) return UNFOUND ;
    _symbol = safe_string( _symbol, "" ).trim();
    var _items_n = safe_size( _items_array, 0 );
    for( var _i = 0 ; _i < _items_n ; _i++ ) if ( _items_array[ _i ].symbol.trim() == _symbol ) return _i ;
    return UNFOUND ;
}

function circles_lib_find_item_obj_by_inverse_symbol( _items_array = [], inv_symbol = "" )
{
    // no need to check array consistence here: the input array may be just a new one to fill later
	_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( !_test ) return null ;
    inv_symbol = safe_string( inv_symbol, "" ).trim();
    var _items_n = safe_size( _items_array, 0 ), _go = YES ;
    $.each( _items_array, function( _i, _chunk ){ if ( !is_item_obj( _chunk ) ) { _go = NO ; return NO ; } } ) ;
    if ( _go ) for( var _i = 0 ; _i < _items_n ; _i++ ) if ( _items_array[ _i ].inverse_symbol.strcmp( inv_symbol ) ) return _items_array[ _i ] ;
    return null ;
}

function circles_lib_find_item_index_by_inverse_symbol( _items_array = [], inv_symbol = "" )
{
	_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( !_test ) return UNFOUND ;
    inv_symbol = safe_string( inv_symbol, "" ).trim();
    var _items_n = safe_size( _items_array, 0 );
    for( var _i = 0 ; _i < _items_n ; _i++ ) if ( _items_array[ _i ].inverse_symbol == inv_symbol ) return _i ;
    return UNFOUND ;
}

function circles_lib_find_item_index_by_map( _items_array = [], _mm = null )
{
	_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( !_test || !is_mobius_map( _mm ) ) return UNFOUND ;
    var _items_n = safe_size( _items_array, 0 );
    for( var _i = 0 ; _i < _items_n ; _i++ ) if ( _items_array[ _i ].map.is_equal_to( _mm ) ) return _i ;
    return UNFOUND ;
}

function circles_lib_find_item_obj_by_map( _items_array = [], _mm = null )
{
	_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( !_test || !is_mobius_map( _mm ) ) return null ;
    var _items_n = safe_size( _items_array, 0 ), _index = UNDET ;
    for( var _i = 0 ; _i < _items_n ; _i++ ) if ( _items_array[ _i ].map.is_equal_to( _mm ) ) { _index = _i; break ; }
    return _items_array[ _index ] ;
}

function circles_lib_find_item_index_from_circle( _items_array = [], _circle = null )
{
	_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    if ( !_test ) return UNFOUND ;
    var CANDIDATEscreencircle, CANDIDATEcomplexcircle, _items_n = safe_size( _items_array, 0 ), _index = UNFOUND ;
    for( var _i = 0 ; _i < _items_n ; _i++ )
    {
       CANDIDATEscreencircle = _items_array[ _i ].screen_circle ;
       CANDIDATEcomplexcircle = _items_array[ _i ].complex_circle ;
       if ( is_circle( CANDIDATEscreencircle ) )
       {
          if ( CANDIDATEscreencircle.is_equal_to( _circle ) )
          {
             _index = _i ;
             break ;
          }
       }
       else if ( is_circle( CANDIDATEcomplexcircle ) )
       {
          if ( CANDIDATEcomplexcircle.is_equal_to( _circle ) )
          {
             _index = _i ;
             break ;
          }
       }
    }
    return _index ;
}

function circles_lib_find_item_obj_from_circle( _items_array = [], _circle = null )
{
    var _i = circles_lib_find_item_index_from_circle( _items_array, _circle );
    return _i == UNFOUND ? null : _items_array[_i] ;
}