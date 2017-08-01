function circles_lib_symbol_check( _input ) { return _input.testME( _glob_symbol_regex_pattern ) ? YES : NO ; }
function circles_lib_symbol_check_group( _items_array, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _ret = GROUP_TEST_ERR_OK, _items_n = safe_size( _items_array, 0 );
    if ( _items_n > 0 && _test )
    {
        var ITEM, _symbol, _inv_symbol, _candidate_inv_symbol ;
        for( var i = 0 ; i < _items_n ; i++ )
        {
            ITEM = _items_array[i] ;
            if ( !is_item_obj( ITEM ) )
            {
                _ret = GROUP_TEST_ERR_INCONSISTENT_ITEM_OBJ ;
                break ;
            }
            _symbol = safe_string( ITEM.symbol, "" ).trim() ;
            if ( _symbol.length == 0 )
            {
                _ret = GROUP_TEST_ERR_MISSING_ITEM_SYMBOL ;
                break ;
            }

            if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) )
            {
                // inverse symbol is required for this method
                _inv_symbol = ITEM.inverse_symbol ;
                if ( !is_string( _inv_symbol ) )
                {
                   _ret = GROUP_TEST_ERR_MISSING_ITEM_SYMBOL ;
                   break ;
                }
                else if ( _inv_symbol.length == 0 )
                {
                   _ret = GROUP_TEST_ERR_MISSING_ITEM_SYMBOL ;
                   break ;
                }
                else
                {
                   _candidate_inv_symbol = circles_lib_word_inverse_get( _symbol );
                   if ( _inv_symbol != _candidate_inv_symbol )
                   {
                       _ret = GROUP_TEST_ERR_UNMATCHING_ITEM_SYMBOL ;
                       break ;
                   }
                }
             }
        }
     }
     else _ret = GROUP_TEST_ERR_UNDET ;
     return _ret ;
}

function circles_lib_symbol_shift( _items_array, _fwd, _question, _silent, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _fwd = safe_int( _fwd, YES );
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _sd_n = circles_lib_count_items( _items_array );
    if ( _sd_n > 1 && _test )
    {
       var _msg = "Direction : " + ( _fwd ? "forward" : "backward" );
       _msg += _glob_crlf + _QUESTION_03 ;
       var _b_go = _question ? confirm( _msg ) : YES ;
       if ( _b_go )
       {
           var _tmp_array = [], _symbol, _inv_symbol ;
           if ( _fwd )
           {
              for( var i = 0 ; i < _sd_n ; i++ )
              {
                 _symbol = _items_array[ ( i + _sd_n - 1 ) % _sd_n ].symbol ;
                 _inv_symbol = _items_array[ ( i + _sd_n - 1 ) % _sd_n ].inverse_symbol ;
                 _tmp_array.push( [ _symbol, _inv_symbol ] );
              }
           }
           else
           {
              for( var i = 0 ; i < _sd_n ; i++ )
              {
                 _symbol = _items_array[ ( i + 1 ) % _sd_n ].symbol ;
                 _inv_symbol = _items_array[ ( i + 1 ) % _sd_n ].inverse_symbol ;
                 _tmp_array.push( [ _symbol, _inv_symbol ] );
              }
           }

           var _t = safe_size( _tmp_array, 0 );
           for( var i = 0 ; i < _t ; i++ )
           {
              _items_array[i].original_word = _items_array[i].symbol = _tmp_array[i][0] .trim();
              _items_array[i].inverse_symbol = _tmp_array[i][1].trim();
           }

           return _out_channel == OUTPUT_SCREEN ? 1 : [ 1, "Symbols shifted "+( !_fwd ? "backward " : "" )+"with success" ] ;
       }
       else
       {
           var MSG = "Symbols permutation aborted by user" ;
           if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, MSG, _glob_app );
           return [ RET_ERROR, MSG ] ;
       }
    }
    else
    {
       var MSG = "Can't perform cyclic permutation of group symbols" + _glob_crlf ;
           MSG += _sd_n == 1 ? "The group includes one only element" : "The group is empty" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, MSG, _glob_app );
       return [ RET_ERROR, MSG ] ;
    }
}

function circles_lib_symbol_get_err_def( _ret, _out_channel )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _ret = safe_int( _ret, GROUP_TEST_ERR_UNDET );
    var MSG = "" ;
    switch( _ret )
    {
    	 case GROUP_TEST_ERR_OK: MSG = "The current group data are consistent" ; break ;
    	 case GROUP_TEST_ERR_EMPTY_GROUP: MSG = "The input group is empty" ; break ;
       case GROUP_TEST_ERR_MISSING_ITEM_SYMBOL: MSG = "At least one symbol is missing" ; break ;
       case GROUP_TEST_ERR_UNPAIRED_GROUP_ITEMS: MSG = "At least one symbol is not paired" ; break ;
       case GROUP_TEST_ERR_MISSING_INVERSE_ITEM: MSG = "At least one inverse symbol is missing" ; break ;
       case GROUP_TEST_ERR_INCONSISTENT_ITEM_OBJ: MSG = "At least one entry is not a valid item" ; break ;
       case GROUP_TEST_ERR_UNMATCHING_ITEM_SYMBOL: MSG = "At least one symbol and its inverse symbol do not match" ; break ;
       default: MSG = "31Unknown error" ; break ;
    }

    if ( _ret != GROUP_TEST_ERR_OK && _out_channel == OUTPUT_SCREEN ) MSG += _glob_crlf + "Open the <a href=\"#\" ONCLICK=\"javascript:alertCLOSE();circles_lib_plugin_load('forms','seeds.list',NO,"+UNDET+");\">circles list</a> to set it" ;
    return MSG ;
}

function circles_lib_symbol_swap( _items_array, _index_array, _question, _silent, _caller, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _caller = safe_int( _caller, 0 ), _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _count_checked = 0, CHECKEDentriesINDEXarray = [], _items_n = circles_lib_count_items( _items_array );
    if ( _out_channel == OUTPUT_SCREEN )
    {
        var CTRLID, CHECKBOX ;
        for( var i = 0 ; i < _items_n ; i++ )
        {
           if ( $("#CIRCLESLISTinvertSYMBOLcheckbox." + i ).is( ":checked" ) )
           {
              _count_checked++ ;
              CHECKEDentriesINDEXarray.push( i );
           }
        }
    }
    else
    {
        CHECKEDentriesINDEXarray = is_array( index_array ) ? _index_array : null ;
        _count_checked = CHECKEDentriesINDEXarray != null ? CHECKEDentriesINDEXarray.length : 0 ;
    }

		if ( !_test )
		{
				var _ret_msg = "Input items set is not a valid container" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ret_msg, _glob_app );
        return [ RET_ERROR, _ret_msg ] ;
		}
    else if ( _items_n == 0 )
    {
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ERR_33_01, _glob_app );
        return [ RET_ERROR, _ERR_33_01 ] ;
    }
    else if ( _count_checked == 0 )
    {
        var _msg = "No selected entries to swap" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
        return [ RET_ERROR, _msg ] ;
    }
    else if ( _count_checked != 2 )
    {
        var _msg = "Select just 2 entries to swap symbols" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
        return [ RET_ERROR, _msg ] ;
    }
    else if ( _count_checked == 2 )
    {
        var _b_go = _question ? ( confirm( _QUESTION_09 ) ? YES : NO ) : YES ;
        if ( _b_go )
        {
           var _index_01 = safe_int( CHECKEDentriesINDEXarray[0], UNDET );
           var _index_02 = safe_int( CHECKEDentriesINDEXarray[1], UNDET );
           if ( _index_01 != UNDET && _index_02 != UNDET )
           {
              var MM_01 = _items_array[_index_01], MM_02 = _items_array[_index_02] ;
              var _sym_01 = safe_string( MM_01.symbol, "" ), _inverse_sym_01 = safe_string( MM_01.inverse_symbol, "" ) ;
              var _sym_02 = safe_string( MM_02.symbol, "" ), _inverse_sym_02 = safe_string( MM_02.inverse_symbol, "" ) ;

              _items_array[_index_01].original_word = _items_array[_index_01].symbol = _sym_02.trim();
              _items_array[_index_01].inverse_symbol = _inverse_sym_02.trim();
              _items_array[_index_02].original_word = _items_array[_index_02].symbol = _sym_01.trim();
              _items_array[_index_02].inverse_symbol = _inverse_sym_01.trim();

              if ( _caller == 1 ) circles_lib_plugin_load('forms','seeds.list');
              return circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, _out_channel );
           }
           else
           {
           	  var _msg = "Can't swap symbols.\n\nCoordinates are not consistent with archived data" ;
              if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app );
              return [ RET_ERROR, _msg ] ;
           }
        }
        else
        {
           var _msg = "Swap halted by user" ;
           if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
           return [ RET_ERROR, _msg ] ;
        }
    }
    else
    {
        var _msg = "An unknown exception has been caught" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
        return [ RET_ERROR, _msg ] ;
    }
}

function circles_lib_symbol_remove_all( _items_array, _caller, _question, _silent, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _caller = safe_int( _caller, 0 );
    _question = safe_int( _question, NO ), _silent = safe_int( _silent, YES );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _array = [], _items_n = circles_lib_count_items( _items_array );
    for( var _i = 0 ; _i < _items_n ; _i++ ) _array.push( _i );
    var MSG = _QUESTION_10_03 ;
    var _b_go = _question ? ( confirm( MSG ) ? YES : NO ) : YES ;
    if ( _b_go )
    {
       circles_lib_symbol_remove( _array, 0, NO, YES );
       circles_lib_symbol_remove( _array, _caller, YES, YES );
       return [ RET_OK, "Symbols removed with success" ] ;
    }
    else return [ RET_IRRELEVANT, "Operation aborted by user" ] ;
}

function circles_lib_symbol_remove( _items_array, a, _caller, _b_inverse, _question, _silent, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _b_inverse = safe_int( _b_inverse, NO );
    _question = safe_int( _question, NO ), _silent = safe_int( _silent, YES );
    _caller = safe_int( _caller, 0 ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _a_length = safe_size( a, 0 );
    if ( _a_length > 0 && _test )
    {
       var MSG = _a_length == 1 ? _QUESTION_10_01 : _QUESTION_10_02 ;
       var _b_go = _question ? confirm( MSG ) : YES ;
       if ( _b_go )
       {
          for( var i = 0 ; i < _a_length ; i++ )
          {
             if ( _b_inverse ) _items_array[ a[i] ].inverse_symbol = "" ;
             else _items_array[ a[i] ].original_word = _items_array[ a[i] ].symbol = "" ;
          }

          if ( _caller == 1 ) circles_lib_plugin_load('forms','seeds.list');
       }
    }
    else return NO ;
    
    return YES ;
}

function circles_lib_symbol_zplane_display( _items_array, _canvas, _symbol, _b_invert, _refresh_zplane, _silent, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _canvas = !is_html_canvas( _canvas ) ? _glob_zplane_work_canvas_placeholder : _canvas ;
    _symbol = safe_string( _symbol, "" ), _b_invert = safe_int( _b_invert, NO );
    _refresh_zplane = safe_int( _refresh_zplane, YES );
    _silent = safe_int( _silent, YES ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var zplane_context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
    var _inv_symbol = _symbol.length > 0 ? circles_lib_word_inverse_get( _symbol ) : "" ;
    var _items_n = circles_lib_count_items( _items_array );
    if ( _items_n > 0 && _test )
    {
        if ( _b_invert ) _glob_show_symbols_zplane = !_glob_show_symbols_zplane ;
        CELLsetCONTENTS('[id$=symbolsBTN]', _glob_show_symbols_zplane ? "Hide symbols" : "Show symbols" );
    
        if ( _refresh_zplane && !( arguments.callee.caller.callername(1).strcmp( "circles_lib_canvas_render_zplane" ) ) ) // prevent looping in any case
        var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, _out_channel );
		    var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
		    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "32Unknown error" ;
        if ( _ret_id == RET_ERROR )
        {
						 circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
						 return _ret_chunk ;
				}
				if ( _glob_show_symbols_zplane )
        {
           var ITEM, _circle_obj, _center_pt, _radius, _symbol, _linewidth, _check_sc ;
           for( var i = 0 ; i < _items_n ; i++ )
           {
              ITEM = _items_array[i] ;
              _circle_obj = is_item_obj( ITEM ) ? ITEM.complex_circle : null ;
              if ( !is_circle( _circle_obj ) ) continue ;
              _check_sc = is_circle( ITEM.screen_circle ) ;
              _center_pt = _check_sc ? ITEM.screen_circle.center : new point( 0, 0 );
              _radius = _check_sc ? safe_int( ITEM.screen_circle.radius, 0 ) : 0 ;
              _linewidth = _check_sc ? safe_int( ITEM.screen_circle.linewidth, 0 ) : 0 ;
              _symbol = safe_string( ITEM.symbol, "N/D" );
              if ( _symbol.length > 0 && is_circle( _circle_obj ) )
              {
                 // display lines crossing the center in order to lock the selected circle to view
                 zplane_context.beginPath();
                 if ( isCHROME() || isIE() ) zplane_context.setLineDash([4,6]);
                 zplane_context.lineWidth = 1 ;
                 zplane_context.strokeStyle = _glob_label_text_color ;
                 zplane_context.moveTo( _center_pt.x - ( _radius + _linewidth ), _center_pt.y );
                 zplane_context.lineTo( _center_pt.x + ( _radius - _linewidth ), _center_pt.y );
                 zplane_context.moveTo( _center_pt.x, _center_pt.y - ( _radius + _linewidth ) );
                 zplane_context.lineTo( _center_pt.x, _center_pt.y + ( _radius - _linewidth ) );
                 zplane_context.stroke();
                 if ( isCHROME() || isIE() ) zplane_context.setLineDash([0,0]);
                 zplane_context.closePath();
    
                 zplane_context.fillStyle = _glob_label_text_color ;
                 zplane_context.fillText( _symbol, _center_pt.x + 6, _center_pt.y - 2 );
                    
                 zplane_context.beginPath();
                 zplane_context.lineWidth = 2 ;
                 zplane_context.arc( _center_pt.x, _center_pt.y, 4, 0, CIRCLES_TWO_PI ); // goes along the line drawing the arc
                 zplane_context.strokeStyle = _glob_label_dot_color ;
                 zplane_context.fillStyle = _glob_label_dot_color ;
                 zplane_context.stroke();
                 zplane_context.fill();
                 zplane_context.closePath();
              }
           }
        }
         
        circles_lib_menu_entries_update();
        return [ RET_OK, _glob_show_symbols_zplane ? "Symbols are visible" : "Symbols are hidden" ];
    }
    else
    {
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ERR_00_04, _glob_app );
        return [ RET_ERROR, _ERR_00_04 ];
    }
}

function circles_lib_symbol_get_indexes_mapping_array( _items_array, _init_items, _out_channel )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    _init_items = safe_int( _init_items, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    var _sd_n = circles_lib_count_items( _items_array );
    if ( _sd_n == 0 || !_test ) return null ;
    else
    {
        var _symbols_index_array = [];
        var _ret_chunk = _init_items ? circles_lib_items_switch_to( _glob_init_mask, YES, _out_channel ) : [ RET_OK, "success" ] ;
        if ( _ret_chunk[0] == RET_ERROR ) return null ;
        else
        {
            var ITEM ;
            for( var _i = 0 ; _i < _sd_n ; _i++ )
            {
               ITEM = _items_array[_i] ;
               if ( is_item_obj( ITEM ) ) _symbols_index_array[""+ITEM.symbol] = _i ;
            }
            return _symbols_index_array.clone_associative();
        }
    }
}