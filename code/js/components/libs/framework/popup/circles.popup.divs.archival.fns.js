/* POPUP OBJ FIELDS MAP
   0 : unique id        1 : div id             2 : caption             3 : status
   4 : visible          5 : height             6 : focus flag          7 : caption class
   8 : subset           9: calling fn (name)  10 : calling fn (params) 11: array of additional fns in the context menu
   12 : base_id (for dynamical reload of the pop-up wnd)
   13 : allow multiple instances of pop-up
   14 : rect obj for popup wnd pos and extents
*/

function circles_lib_popup_delete_from_archive( _index )
{
    _index = safe_int( _index, UNDET );
    var _size = safe_size( _glob_popups_array, 0 );
    if ( _size == 1 ) _glob_popups_array = [];
    else if ( _size > 1 && _index >= 0 ) _glob_popups_array.remove( _index, _index );
}

function circles_lib_popup_exists( _obj, _datatype_mask, _offset )
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = UNFOUND ;
    _datatype_mask = safe_int( _datatype_mask, POPUP_SEARCH_BY_UNIQUE_ID );
    _offset = Math.min( Math.max( safe_int( _offset, 0 ), 0 ), _len - 1 );
    if ( _datatype_mask == POPUP_SEARCH_BY_UNIQUE_ID ) _obj = _obj.replaceAll( [ "." ], "" ).toUpperCase() ;
    for( var _i = _offset ; _i < _len ; _i++ )
    {
       if ( is_array( _array[_i] ) )
       {
          if ( ( _datatype_mask & POPUP_SEARCH_BY_UNIQUE_ID && _array[_i][0].includes_i( _obj ) ) ||
               ( _datatype_mask & POPUP_SEARCH_BY_DIV_ID && _array[_i][1].includes_i( _obj ) ) ||
               ( _datatype_mask & POPUP_SEARCH_BY_CAPTION && _array[_i][2].includes_i( _obj ) ) ||
               ( _datatype_mask & POPUP_SEARCH_BY_SUBSET && _array[_i][8].includes_i( _obj ) ) ||
               ( _datatype_mask & POPUP_SEARCH_BY_BASE_ID && _array[_i][12].includes_i( _obj ) )
             )
          {
             _ret = _i ;
             break ;
          }
       }
    }
      
    return _ret ;
}

function circles_lib_popup_find_wnd( _prop_value, _datatype_mask, _by_ref, _offset )
{
    _by_ref = safe_int( _by_ref, NO );
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = null ;
    _datatype_mask = safe_int( _datatype_mask, POPUP_SEARCH_BY_UNIQUE_ID );
    _offset = Math.min( Math.max( safe_int( _offset, 0 ), 0 ), _len - 1 );
    for( var _i = _offset ; _i < _len ; _i++ )
    {
        if ( is_array( _array[_i] ) )
        {
            if ( ( _datatype_mask & POPUP_SEARCH_BY_UNIQUE_ID && _array[_i][0].includes( _prop_value ) ) ||
                 ( _datatype_mask & POPUP_SEARCH_BY_DIV_ID && _array[_i][1].includes( _prop_value ) ) ||
                 ( _datatype_mask & POPUP_SEARCH_BY_CAPTION && _array[_i][2].includes( _prop_value ) ) ||
                 ( _datatype_mask & POPUP_SEARCH_BY_SUBSET && _array[_i][8].includes_i( _prop_value ) ) ||
                 ( _datatype_mask & POPUP_SEARCH_BY_BASE_ID && _array[_i][12].includes( _prop_value ) )
               )
            {
                _ret = _by_ref ? _array[_i] : _array[_i].clone() ;
                break ;
            }
        }
    }
      
    return _ret ;
}

function circles_lib_popup_find_offset( _prop_value, _datatype_mask, _start_offset )
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = UNFOUND ;
    _datatype_mask = safe_int( _datatype_mask, POPUP_SEARCH_BY_UNIQUE_ID );
    _start_offset = Math.min( Math.max( safe_int( _start_offset, 0 ), 0 ), _len - 1 );
    for( var _i = _start_offset ; _i < _len ; _i++ )
    {
        if ( is_array( _array[_i] ) )
        {
            if ( ( _datatype_mask & POPUP_SEARCH_BY_UNIQUE_ID && _array[_i][0].includes( _prop_value ) ) ||
                 ( _datatype_mask & POPUP_SEARCH_BY_DIV_ID && _array[_i][1].includes( _prop_value ) ) ||
                 ( _datatype_mask & POPUP_SEARCH_BY_CAPTION && _array[_i][2].includes( _prop_value ) ) ||
                 ( _datatype_mask & POPUP_SEARCH_BY_SUBSET && _array[_i][8].includes_i( _prop_value ) ) ||
                 ( _datatype_mask & POPUP_SEARCH_BY_BASE_ID && _array[_i][12].includes( _prop_value ) )
               )
            {
                _ret = _i ;
                break ;
            }
        }
    }

    return _ret ;
}

function circles_lib_popup_match_count( _obj, _datatype_mask )
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = null, _count = 0 ;
    _datatype_mask = safe_int( _datatype_mask, POPUP_SEARCH_BY_UNIQUE_ID );
    for( var _i = 0 ; _i < _len ; _i++ )
    {
       if ( is_array( _array[_i] ) )
       {
          if ( ( _datatype_mask == POPUP_SEARCH_BY_UNIQUE_ID && _array[_i][0].includes( _obj ) ) ||
               ( _datatype_mask == POPUP_SEARCH_BY_DIV_ID && _array[_i][1].includes( _obj ) ) ||
               ( _datatype_mask == POPUP_SEARCH_BY_CAPTION && _array[_i][2].includes( _obj ) ) ||
               ( _datatype_mask == POPUP_SEARCH_BY_SUBSET && _array[_i][8].includes_i( _obj ) ) ||
               ( _datatype_mask == POPUP_SEARCH_BY_BASE_ID && _array[_i][12].includes( _obj ) )
             )
          _count++ ;
       }
    }

    return _count ;
}