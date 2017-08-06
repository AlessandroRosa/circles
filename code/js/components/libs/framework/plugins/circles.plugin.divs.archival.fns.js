/* POPUP OBJ FIELDS MAP
   0 : unique id        1 : div id             2 : caption             3 : status
   4 : visible          5 : height             6 : focus flag          7 : caption class
   8 : subset           9: calling fn (name)  10 : calling fn (params) 11: array of additional fns in the context menu
   12 : base_id (for dynamical reload of the pop-up wnd)
   13 : allow multiple instances of pop-up
   14 : rect obj for popup wnd pos and extents
*/

function circles_lib_plugin_delete_from_archive( _index )
{
    _index = safe_int( _index, UNDET );
    var _size = safe_size( _glob_popups_array, 0 );
    if ( _size == 1 ) _glob_popups_array = [];
    else if ( _size > 1 && _index >= 0 ) _glob_popups_array.remove( _index, _index );
}

function circles_lib_plugin_find_index( _json, _datatype_mask, _offset )
{
    var _popups = _glob_popups_array, _len = safe_size( _popups, 0 ), _ret = UNFOUND, _tmp_mask = 0 ;
    _datatype_mask = safe_int( _datatype_mask, POPUP_SEARCH_BY_UNIQUE_ID );
    _offset = Math.min( Math.max( safe_int( _offset, 0 ), 0 ), _len - 1 );
    if ( ( _datatype_mask & POPUP_SEARCH_BY_UNIQUE_ID ) && _json.unique_id != null )
    _json.unique_id = _json.unique_id.replace( /[\.\_\-]/g, "" ).toUpperCase() ;
    for( var _i = _offset ; _i < _len ; _i++ )
    {
       _tmp_mask = ( ( _datatype_mask & POPUP_SEARCH_BY_UNIQUE_ID ) && _json.unique_id != null && _popups[_i][0].includes_i( _json.unique_id ) ) ? POPUP_SEARCH_BY_UNIQUE_ID : 0 ;
       _tmp_mask |= ( ( _datatype_mask & POPUP_SEARCH_BY_DIV_ID ) && _json.div_id != null && _popups[_i][1].includes_i( _json.div_id ) ) ? POPUP_SEARCH_BY_DIV_ID : 0 ;
       _tmp_mask |= ( ( _datatype_mask & POPUP_SEARCH_BY_CAPTION ) && _json.caption != null && _popups[_i][2].includes_i( _json.caption ) ) ? POPUP_SEARCH_BY_CAPTION : 0 ;
       _tmp_mask |= ( ( _datatype_mask & POPUP_SEARCH_BY_SUBSET ) && _json.subset != null && _popups[_i][8].includes_i( _json.subset ) ) ? POPUP_SEARCH_BY_SUBSET : 0 ;
       _tmp_mask |= ( ( _datatype_mask & POPUP_SEARCH_BY_BASE_ID ) && _json.base_id != null && _popups[_i][12].includes_i( _json.base_id ) ) ? POPUP_SEARCH_BY_BASE_ID : 0 ;
       if ( _datatype_mask == _tmp_mask )
       {
         _ret = _i ;
         break ;
       }
    }
    return _ret ;
}

function circles_lib_plugin_find_wnd( _json, _datatype_mask, _by_ref, _offset )
{
    _by_ref = safe_int( _by_ref, NO );
    var _popups = _glob_popups_array, _len = safe_size( _popups, 0 ), _ret = null ;
    _datatype_mask = safe_int( _datatype_mask, POPUP_SEARCH_BY_UNIQUE_ID );
    _offset = Math.min( Math.max( safe_int( _offset, 0 ), 0 ), _len - 1 );
    _ret = circles_lib_plugin_find_index( _json, _datatype_mask, _offset ) ;
    return _ret != UNFOUND ? ( _by_ref ? _popups[_ret] : _popups[_ret].clone() ) : null ;
}