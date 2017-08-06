/* POPUP OBJ FIELDS MAP
   0 : unique id        1 : div id             2 : caption             3 : status
   4 : visible          5 : height             6 : focus flag          7 : caption class
   8 : subset           9: calling fn (name)  10 : calling fn (params) 11: array of additional fns in the context menu
   12 : base_id (for dynamical reload of the pop-up wnd)
   13 : allow multiple instances of pop-up
   14 : rect obj for popup wnd pos and extents
*/

function circles_lib_plugin_clean_baseid( _id ) { return safe_string( _id, "" ).replaceAll( [ "_", ".", " " ], "" ).toUpperCase(); }
function circles_lib_plugin_build_divid( _subset, _base_id ) { return "CIRCLES"+( safe_string( _subset, "forms" ) )+( safe_string( _base_id, "" ).replaceAll( [ "_", ".", " " ], "" ).toUpperCase() )+"popupWND" ; }
function circles_lib_plugin_focus_wnd_from_inner_ctrl_id( _ctrl_id, _base_id, _subset )
{
    if ( $("#"+circles_lib_plugin_get_wnd_from_inner_ctrl_id( _ctrl_id ) ).length > 0 )
    circles_lib_plugin_focus( _based_id, subset );
}

function circles_lib_plugin_get_wnd_from_inner_ctrl_id( _ctrl_id )
{
    if ( !is_string( _ctrl_id ) ) return null ;
    else _ctrl_id = safe_string( _ctrl_id, "" ).trim();

    if ( _ctrl_id.length == 0 ) return null ;
    else
    {
        var _ctrl = $( "#"+_ctrl_id ).get(0), _parent_id = "", _parent_node, _parent_tag, _b_found = NO ;
        var _popup_obj = null ;
        while( _ctrl != null )
        {
            _parent_node = _ctrl.parentNode ;
            if ( _parent_node != null )
            {
                _parent_id = safe_string( _parent_node.id, "" ).trim();
                _parent_tag = safe_string( _parent_node.tagName, "" ).trim() ;
                if ( _parent_id.length > 0 && _parent_tag.length > 0 &&
                     circles_lib_plugin_get_datamask_from_property( _parent_id ) == POPUP_SEARCH_BY_DIV_ID )
                {
                   _b_found = YES ;
                   _popup_obj = circles_lib_plugin_find_wnd( { div_id : _parent_id }, POPUP_SEARCH_BY_DIV_ID, NO ) ;
                   break ;
                }
                else _ctrl = _parent_node.parentNode ;
            }
            else break ;
        }

        return _b_found ? _popup_obj : null ;
    }
}


function circles_lib_plugin_get_max_zindex()
{
    var zI = 0 ;
    $( "div[id^=CIRCLES]" ).each( function( _i, _obj ) { zI = Math.max( $( "#" + _obj.id ).zIndex(), zI ) ; } ) ;
    return zI ;
}

function circles_lib_plugin_get_topmost_wnd()
{
    var _div_id = "", zI = 0 ;
    $( "div[id^=CIRCLES]" ).each( function( _i, _obj ) { if ( $( "#" + _obj.id ).zIndex() > zI ) { zI = $( "#" + _obj.id ).zIndex(), _div_id = _obj.jd ; } } ) ;
    return _div_id ;
}

function circles_lib_plugin_load()
{
    var _args_n = arguments.length ;
    if ( _args_n > 0 )
    {
       var _subset = arguments[0], _base_id = arguments[1], _i, _params = [] ;
       for( _i = 2 ; _i < _args_n ; _i++ )
       {
          if ( ( "" + arguments[_i] ).length > 0 )
				  {
						 if ( ( safe_string( arguments[_i], "" ) ).start_with_i( "move:" ) )
						 {
						 		 var _tok = ( ( safe_string( arguments[_i], "" ).split( ":" ) )[1] ).toLowerCase() ;
								 switch( _tok )
								 {
										case "yes": _params['a'] = 1 ; break ;
										case "no": _params['a'] = 0 ; break ;
						        default: _params['a'] = _tok ; break ;
								 }
						 }
						 else if ( ( safe_string( arguments[_i], "" ) ).start_with_i( "items:", "plane:", "symbol", "tab:" ) )
						 {
						 		 _params['b'] = safe_string( ( ( safe_string( arguments[_i], "" ).split( ":" ) )[1] ), "" );
						 }
						 else if ( ( safe_string( arguments[_i], "" ) ).start_with_i( "src:" ) )
						 {
						 		 _params['c'] = safe_string( ( ( safe_string( arguments[_i], "" ).split( ":" ) )[1] ), "" );
						 }
             else if ( is_array( arguments[_i] ) )
             {
                _glob_persistent_vars['tmp_arg'+_i] = arguments[_i].clone();
                _params.push( "_glob_persistent_vars['tmp_arg"+_i+"']" );
             }
             else _params.push( ""+arguments[_i] );
					}
       }
       
       var _popup_base_id = circles_lib_plugin_clean_baseid( _base_id );
       var _main_opener_fn = "CIRCLES" + _subset + _popup_base_id + "main" ;
       var _main_opener_cmd = _main_opener_fn + "('"+_base_id+"'"+(_params.length>0?", "+_params.join(", "):"")+");" ;
       var _abs_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
       var _rel_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
       if ( _abs_folder_path.match( /[A-Za-z0-9\.\-\/]/g ).length != _abs_folder_path.length )
       {
					circles_lib_log_add_entry( "Incorrect input syntax", LOG_ERROR ) ;
          return NO ;
			 }
       
       var vars = { tip: "", folder : _abs_folder_path, filter : "/[?.js]$/",
									  exact : 0, search_params : "0,0,1,0" } ;
       var _result = get_filedata_from_folder( "support/code/phpcode/svc/svc.filelist.php", "POST", false, vars );
       if ( _result.length > 0 )
       {
       		var _old_title = document.title ;
         	document.title = "Loading module";
					var _res_array = _result.includes( "@@@" ) ? _result.split( "@@@" ) : [ _result ] ;
          var _rl = safe_size( _res_array, 0 ), _load_failure = NO, _src_code_load_failures = [] ;
          for( _i = 0 ; _i < _rl ; _i++ )
          {
              $.ajaxSetup( { async:false } );
              $.getScript( _rel_folder_path + _res_array[_i] ).done( function(){} ).fail( function(){ circles_lib_log_add_entry( "'"+_res_array[_i]+"' can't be loaded: suspected invalid filename or internal code error", LOG_ERROR ) ; _src_code_load_failures.push( _res_array[_i] ) ; } );
          }

          _load_failure = safe_size( _src_code_load_failures, 0 ) > 0 ? YES : NO ;
          if ( !_load_failure )
          {
          		var _ret = 1, _ret_msg = "" ;
					    try{ eval( _main_opener_cmd ) ; }
					    catch( _err )
							{
									_ret = 0, _ret_msg = _err.name + ": " + _err.message ;
									circles_lib_error_obj_handler( _err );
							}

              if ( !_ret )
              {
                 _ret_msg = "'"+_popup_base_id+"' service can't run because of internal code error(s)"+_glob_crlf+_ret_msg ;
						 		 circles_lib_log_add_entry( _ret_msg, LOG_ERROR ) ;
              }
            	document.title = _old_title ;
              return _ret ;
          }
          else
          {
							circles_lib_log_add_entry( "'"+_popup_base_id+"' service can't run due to invalid components" , LOG_ERROR ) ;
            	document.title = _old_title ;
              return NO ;
          }
       }
       else
			 {
          circles_lib_log_add_entry( "'"+_popup_base_id+"' service can't run due to invalid path: "+_abs_folder_path, LOG_ERROR ) ;
					return NO ;
			 }
    }
    else
		{
       circles_lib_log_add_entry( "'"+_popup_base_id+"' service can't run: missing input arguments" , LOG_ERROR ) ;
			 return NO ;
		}
}

// PROPERTIES
function circles_lib_plugin_set_property( _unique_id, _obj, _datatype_mask, _offset )
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = UNFOUND ;
    _offset = Math.min( Math.max( safe_int( _offset, 0 ), 0 ), _len - 1 ) ;
    for( var _i = _offset ; _i < _len ; _i++ )
    {
       if ( is_array( _array[_i] ) )
       {
          if ( _array[_i][0].strcmp( _unique_id ) )
          {
             if      ( _datatype_mask == POPUP_SEARCH_BY_UNIQUE_ID ) _array[_i][0] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_DIV_ID ) _array[_i][1] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_CAPTION ) _array[_i][2] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_STATUS ) _array[_i][3] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_VISIBLE ) _array[_i][4] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_HEIGHT ) _array[_i][5] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_SUBSET ) _array[_i][8] = _obj ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_BASE_ID ) _array[_i][12] = _obj ;
             _glob_popups_array[_i] = _array[_i] ;
          }
       }
    }
}

function circles_lib_plugin_get_datamask_from_property( _prop_value, _offset )
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = UNFOUND ;
    _offset = Math.min( Math.max( safe_int( _offset, 0 ), 0 ), _len - 1 ) ;
    for( var _i = _offset ; _i < _len ; _i++ )
    {
       if ( is_array( _array[_i] ) )
       {
          if      ( _array[_i][0] == _prop_value ) _ret = POPUP_SEARCH_BY_UNIQUE_ID ;
          else if ( _array[_i][1] == _prop_value ) _ret = POPUP_SEARCH_BY_DIV_ID ;
          else if ( _array[_i][2] == _prop_value ) _ret = POPUP_SEARCH_BY_CAPTION ;
          else if ( _array[_i][3] == _prop_value ) _ret = POPUP_SEARCH_BY_STATUS ;
          else if ( _array[_i][4] == _prop_value ) _ret = POPUP_SEARCH_BY_VISIBLE ;
          else if ( _array[_i][5] == _prop_value ) _ret = POPUP_SEARCH_BY_HEIGHT ;
          else if ( _array[_i][8] == _prop_value ) _ret = POPUP_SEARCH_BY_SUBSET ;
          else if ( _array[_i][12] == _prop_value ) _ret = POPUP_SEARCH_BY_BASE_ID ;
             
          if ( _ret != UNFOUND ) return _ret ;
       }
    }
    
    return _ret ;
}

function circles_lib_plugin_check_property( _unique_id, _val, _datatype_mask, _offset )
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = NO ;
    _offset = Math.min( Math.max( safe_int( _offset, 0 ), 0 ), _len - 1 ) ;
    for( var _i = _offset ; _i < _len ; _i++ )
    {
       if ( is_array( _array[_i] ) )
       {
          if ( _array[_i][0].strcmp( _unique_id ) )
          {
             if      ( _datatype_mask == POPUP_SEARCH_BY_UNIQUE_ID && _array[_i][0] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_DIV_ID && _array[_i][1] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_CAPTION && _array[_i][2] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_STATUS && _array[_i][3] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_VISIBLE && _array[_i][4] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_HEIGHT && _array[_i][5] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_SUBSET && _array[_i][8] == _val ) _ret = YES ;
             else if ( _datatype_mask == POPUP_SEARCH_BY_BASE_ID && _array[_i][12] == _val ) _ret = YES ;
             if ( _ret ) break ;
          }
       }
    }

    return _ret ;
}

function circles_lib_plugin_set_property_to_all_entries( _obj, _datatype_mask /* 1: unique id, 2: description, 3: status, 4: visible, 5: height */, _offset )
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _ret = UNFOUND ;
    _offset = Math.max( safe_int( _offset, 0 ), 0 );
    for( var _i = _offset ; _i < _len ; _i++ )
    {
       if ( is_array( _array[_i] ) )
       {
          if ( _datatype_mask == POPUP_SEARCH_BY_STATUS ) _array[_i][3] = _obj ;
          else if ( _datatype_mask == POPUP_SEARCH_BY_VISIBLE ) _array[_i][4] = _obj ;
          else if ( _datatype_mask == POPUP_SEARCH_BY_HEIGHT ) _array[_i][5] = _obj ;
       }
    }
}