function circles_lib_items_copy_to_storage_space( _item_type, _question, _silent, _out_channel )
{
    if ( is_string( _item_type ) )
    {
		switch( _item_type.toLowerCase() )
		{
			case "generators": _item_type = ITEMS_SWITCH_GENS ; break ;
			case "seeds":
			default: _item_type = ITEMS_SWITCH_SEEDS ; break ;
		}
	}
    else _item_type = safe_int( _item_type, ITEMS_SWITCH_SEEDS );
    
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _items_array = _item_type == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    
	var _items_n = circles_lib_count_items( _items_array );
    var _symbol = _item_type == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
    var _storage_ref = _item_type == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
    if ( _items_n > 0 )
    {
       var _q = _item_type == ITEMS_SWITCH_SEEDS ? _QUESTION_18_05 : _QUESTION_18_06 ;
       if ( safe_size( _glob_storage[_storage_ref], 0 ) > 0 ) _q += _glob_crlf.repeat( 2 ) + "This operation overwrites previous data in the storage space." ;
       var _b_go = !_question ? YES : confirm( _q ), _ret_chunk ;
       if ( _b_go )
       {
           _glob_storage[_storage_ref] = [] ;
           $.each( _items_array, function( _i, _seed_obj ) { _glob_storage[_storage_ref].push( _seed_obj ) } );
           var _n_copied = safe_size( _glob_storage[_storage_ref], 0 );
           var _msg = ( _n_copied == 0 ) ? "Fail to copy "+_symbol+"s to storage space" : _n_copied + " " + _symbol + ( _n_copied != 1 ? "s have" : " has" ) + " been copied to storage space" ;
           if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, _n_copied == 0 ? DISPATCH_WARNING : DISPATCH_SUCCESS, _msg, _glob_app_title );
           return [ _n_copied == 0 ? RET_WARNING : RET_OK, _msg ] ;
       }
    }
    else
	{
		var _msg = "Fail to copy "+_symbol+"s to storage space." + _glob_crlf.repeat(2) + ( _item_type == ITEMS_SWITCH_SEEDS ? _ERR_33_01 : _ERR_33_02 ) ;
		if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
		return _msg ;
	}
}

function circles_lib_items_unselect( _question, _silent, _out_channel )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    if ( _glob_disk_sel_index != UNDET )
    {
		if ( circles_lib_count_items() > 0 )
		{
		    var _b_go = _question ? confirm( _QUESTION_04 ) : YES, _ret_chunk ;
		    if ( _b_go )
			{
		        _glob_disk_sel_index = UNDET ;
	        	_glob_zplane_selected_items_array = [];
				circles_lib_helper_div_remove();
				_ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _out_channel );
				if ( safe_int( _ret_chunk[ 0 ], 0 ) == RET_ERROR ) return _ret_chunk ;
			}
		    return _b_go ? [ 1, "All items have been unselected" ] : [ 0, "Unselection aborted" ] ;
		}
		else
		{
		    if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Fail to unselect: " + _ERR_33_01, _glob_app_title );
		    return [ RET_ERROR, "Fail to unselect: " + _ERR_33_01 ];
	    }
	}
	else
    {
        var _msg = "Fail to unselect: no item(s) selected" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ];
    }
}

function circles_lib_items_check_data_coherence( _items_array )
{
	_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
	if ( !_test ) return ITEM_ERR_UNDET ;
    else if ( circles_lib_method_check() )
    {
        var FAILerror = ITEM_ERR_NONE, _items_n = circles_lib_count_items( _items_array );
        for( var _i = 0 ; _i < _items_n ; _i++ )
        {
           ITEM = _items_array[_i] ;
           if ( is_item_obj( ITEM ) )
           {
              if ( !is_circle( ITEM.complex_circle ) ) FAILerror = ITEM_ERR_CIRCLE ;
              else if ( !is_mobius_map( ITEM.map ) ) FAILerror = ITEM_ERR_MOBIUS ;
              if ( FAILerror != ITEM_ERR_NONE ) break ;
           }
           else
           {
              FAILerror = ITEM_ERR_INCONSISTENT ;
              break ;
           }
        }

        return FAILerror ;
    }
    else return ITEM_ERR_UNDET ;
}

function circles_lib_items_verify_init_mask( _init_src_opt )
{
    _init_src_opt = safe_int( _init_src_opt, INIT_FROM_DISKS );
    if ( _init_src_opt.is_one_of( INIT_FROM_DISKS, INIT_FROM_MAPS ) )
    {
        var _init_mask = INIT_FROM_DISKS | ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) ? INIT_PAIRED_ITEMS : INIT_SINGLE_ITEMS );
        return _init_mask & ~INIT_LOCK ;
    }
    else return UNDET ;
}

function circles_lib_items_switch_to( _switch_to_val = "", _silent = NO, _out_channel = OUTPUT_SCREEN )
{
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    if ( is_string( _switch_to_val ) )
    {
		switch( _switch_to_val.toLowerCase() )
		{
			case "generators": _switch_to_val = ITEMS_SWITCH_GENS ; break ;
			case "seeds":
			default: _switch_to_val = ITEMS_SWITCH_SEEDS ; break ;
		}
	}
    else if ( !is_number( _switch_to_val ) ) _switch_to_val = ITEMS_SWITCH_SEEDS ;
    else _switch_to_val = safe_int( _switch_to_val, ITEMS_SWITCH_SEEDS );
    if ( !_switch_to_val.is_one_of( ITEMS_SWITCH_SEEDS, ITEMS_SWITCH_GENS ) ) _switch_to_val = ITEMS_SWITCH_SEEDS ;

    _glob_items_switch = safe_int( _switch_to_val, ITEMS_SWITCH_SEEDS );
    var _zplane_items_desc = circles_lib_items_get_def();
    var _ret_msg = "Switch to "+_zplane_items_desc+" (items)" ;
    if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app_title + " - Items init" );
	return [ RET_OK, _ret_msg ] ;
}

function circles_lib_items_init_wrapper_fn( _index, _question, _silent, _init_mask, _out_channel )
{
    _index = safe_int( _index, UNDET ), _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _init_mask = safe_int( _init_mask, _glob_init_mask ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _items_n = _glob_items_switch == ITEMS_SWITCH_GENS ? circles_lib_gens_count() : circles_lib_count_seeds();
    if ( _glob_method == METHOD_NONE )
    {
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ERR_24_03, _glob_app_title );
        return [ RET_WARNING, _ERR_24_03 ];
    }
    else if ( _items_n == 0 )
    {
		var _msg = _ERR_33_02 ;
	    if ( _plugin_last_ref != 0 ) _msg += _glob_crlf+"Push 'set parameters' in the plug-in window" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ] ;
    }
    else if ( _items_n > 0 )
    {
       if ( !_question ? YES : confirm( _QUESTION_26_01 ) )
       {
          $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
          if ( _init_mask.match_bit_mask( INIT_NONE, INIT_AUTO_RECOGNITION ) ) _glob_init_mask = _init_mask = circles_lib_items_auto_recognition_group_params();
		  var _build_gens_set_opt = circles_lib_gens_model_exists();
          var _ret_chunk = circles_lib_items_init( _index, _question, _silent, _init_mask );
          var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
          var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
          if ( _out_channel != OUTPUT_SCREEN && is_array( _ret_chunk ) && _ret_id == 0 )
          {
              if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ret_chunk[0], _glob_app_title );
              return _ret_chunk ;
          }

          var _check_group = circles_lib_symbol_check_group( _glob_seeds_array, _out_channel ) ;
          var _items_error = circles_lib_items_check_data_coherence();
          if ( _check_group != GROUP_TEST_ERR_OK )
          {
             var errMSG = circles_lib_symbol_get_err_def( _check_group, _out_channel );
             if ( circles_lib_plugin_find_index( { subset : "forms", base_id : 'seeds.list' }, POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_SUBSET ) != UNFOUND )
             {
                if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, errMSG, _glob_app_title );
                return [ RET_ERROR, errMSG ];
             }
          }
          else if ( _items_error != ITEM_ERR_NONE )
          {
             var errMSG = "There is at least one item which has not been init or tagged" ;
             if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, errMSG, _glob_app_title );
             return [ RET_ERROR, errMSG ];
          }
          else return _ret_chunk ;
       }
       else
       {
          var _msg = "Items check halted by user" ;
          if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
          return [ RET_ERROR, _msg ];
       }
    }
}

function circles_lib_items_init( _index = UNDET, _question = YES, _silent = NO, _init_mask = _glob_init_mask, _report = NO, _force_init = NO, _out_channel = OUTPUT_SCREEN )
{
    _index = safe_int( _index, UNDET ), _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _init_mask = safe_int( _init_mask, _glob_init_mask );
    _report = safe_int( _report, NO ), _force_init = safe_int( _force_init, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
	if ( _force_init ) _glob_items_to_init = 1 ;
    if ( _init_mask & INIT_AUTO_RECOGNITION ) _init_mask = circles_lib_items_auto_recognition_group_params();
    var _report_text = "", _items_n = circles_lib_count_items();
    if ( _glob_method == METHOD_NONE )
    {
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ERR_24_03, _glob_app_title );
       return [ RET_WARNING, _ERR_24_03 ] ;
    }
    else if ( _items_n == 0 )
    {
	   var _msg = _ERR_33_02 ;
	   if ( _plugin_last_ref != 0 ) _msg += _glob_crlf + "Push 'set' in the plug-in window" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ] ;
    }
    else if ( !_glob_items_to_init && _items_n > 0 && !_force_init )
    {
       var _msg = "<gray>Items have been already initialized</gray>" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_MULTICOLOR, _msg, _glob_app_title );
       return [ RET_IRRELEVANT, _msg ] ;
    }
    else
    {
       if ( _report && ( _init_mask & INIT_SINGLE_ITEMS ) && _glob_method.is_one_of( METHOD_ALGEBRAIC ) )
       {
          _report_text += "Invalid 'group' option: detected conflict between 'singly' method " + circles_lib_method_get_def( _glob_method );
          _report_text += _glob_crlf + "Option has been reset to 'paired'" ;
          var _bit_pos = Math.log( INIT_SINGLE_ITEMS ) / Math.log( 2 );
          _init_mask = _init_mask.disable_bit_pos( _bit_pos );
          _bit_pos = Math.log( INIT_PAIRED_ITEMS ) / Math.log( 2 );
          _init_mask = _init_mask.enable_bit_pos( _bit_pos );
       }

       // 0. Check whether the group is consistent, otherwise try to fix it
       var _ret_chunk = null ;
       if ( _init_mask & INIT_SYMBOLS || _init_mask & INIT_AUTO_RECOGNITION )
       {
          _ret_chunk = circles_lib_alphabet_autoconfig_all_symbols( _question, _glob_terminal_echo_flag, YES, NO, _out_channel );
		  if ( _ret_chunk[0] == RET_ERROR ) return _ret_chunk ;
       }

	   if ( _init_mask & INIT_FROM_DISKS ) _ret_chunk = circles_lib_items_init_group_from_disks( _silent, _init_mask, _report, _force_init, _out_channel );
       else if ( _init_mask & INIT_FROM_MAPS ) _ret_chunk = circles_lib_items_init_group_from_maps( _silent, _init_mask, _report, _force_init, _out_channel );
       else if ( !_force_init )
       {
          var _msg = "Flag 'force' is off: skipped initialization of items" ;
          if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
          return [ RET_WARNING, _msg ] ;
       }
       else
       {
          var _msg = "Invalid init options for method '" + circles_lib_method_get_def( _glob_method ) + "'" ;
          if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
          return [ RET_ERROR, _msg ] ;
       }

		var _err_str = "" ;
        var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
		var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown response" ;

		if ( _ret_id == RET_IRRELEVANT )
		{
          if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, _ret_msg, _glob_app_title );
          return _ret_chunk ;
		}
		else if ( _ret_id == RET_ERROR )
		{
          if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ret_msg, _glob_app_title );
          return _ret_chunk ;
		}

		var _gens_exist = circles_lib_gens_model_exists();
		if ( !_gens_exist ) _ret_chunk = circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, _silent, _out_channel );
		else if ( _init_mask != IF_NOT_EXISTING )
		{
			_ret_chunk = circles_lib_items_switch_to( ITEMS_SWITCH_GENS, _silent, _out_channel );
			_ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], 0 ) : 0 ;
			_ret_msg += _glob_crlf + ( is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown response" );
			if ( _ret_id == RET_OK )
			{
				_ret_chunk = circles_lib_gens_build( OUTPUT_NONE, NO, YES, _question, _silent ) ;
			    _ret_id &= is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], 0 ) : 0 ;
			    _ret_msg += _glob_crlf + ( is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown response" );
			}
			else circles_lib_log_add_entry( _ret_msg, LOG_WARNING );
		}

        _glob_init_mask = _init_mask, _glob_items_to_init = _ret_id == RET_OK ? NO : YES ;
        _glob_dict_check = _glob_process == PROCESS_RANDOM ? SKIP : YES ;
        _glob_dict_create = _glob_process == PROCESS_BREADTHFIRST ? ( _ret_id ? YES : NO ) : NO ;
        if( _glob_process == PROCESS_INDEXSEARCH ) _glob_construction_mode = CONSTRUCTION_TILING ;

        $('[id$=initBTN]').css('color',_glob_items_to_init ?COLOR_ERROR:DEFAULT_COLOR_STD);
        _glob_alphabet = circles_lib_alphabet_get();
        if ( _ret_id == RET_OK )
        {
			if ( circles_lib_plugin_is_visible( "method", "forms" ) ) circles_lib_plugin_dispatcher_unicast_message( "method", "forms", 1.1 + _glob_current_tab['method'] / 100 );
			if ( circles_lib_plugin_is_visible( "method", "forms" ) ) circles_lib_plugin_dispatcher_unicast_message( "method", "forms", 1.1 + _glob_current_tab['method'] / 100 );
        }
        //circles_lib_plugin_dispatcher_multicast_message( POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL );
        return [ _ret_id, ( _report_text.length > 0 ? _report_text + _glob_crlf : "" ) + _ret_msg ] ;
    }
}

function circles_lib_items_create_from_disk( _index, complex_circle, screen_circle )
{
    _index = safe_int( _index, UNDET );
    if ( !is_circle( complex_circle ) ) return null ;
    if ( !is_circle( screen_circle ) ) screen_circle = null ;
    var _mm = new mobius_map(), _index_inverse = UNDET ;
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _symbol = _index == UNDET ? "" : safe_string( _items_array[_index].symbol, "" ) ;
    var _inv_symbol = _index == UNDET ? "" : safe_string( _items_array[_index].inverse_symbol, "" ) ;
	switch( _glob_method )
	{
		case METHOD_ALGEBRAIC:
        _index_inverse = circles_lib_find_item_index_by_symbol( _items_array, _inv_symbol );
        var _cc = _index_inverse == UNFOUND ? null : _items_array[_index_inverse].complex_circle ;
        var _inv_cc = _index_inverse == UNFOUND ? null : _items_array[_index_inverse].complex_circle ;
        if ( is_circle( _cc ) && is_circle( _inv_cc ) ) _mm.init_inversion_from_two_circles( _cc, _inv_cc );
		break ;
		case METHOD_INVERSION: _mm.init_inversion_from_one_circle( complex_circle ); break ;
        default: break ;
	}
    
	var _check = _index == UNDET ;
    return new item_obj( _mm, complex_circle, screen_circle, _symbol,
						 _check ? 0 : _items_array[_index].params_mask,
						 _check ? complex_circle.draw : _items_array[_index].complex_circle.draw,
                         _check ? complex_circle.bordercolor : _items_array[_index].complex_circle.bordercolor,
                         _check ? complex_circle.fill : _items_array[_index].complex_circle.fill,
                         _check ? complex_circle.fillcolor : _items_array[_index].complex_circle.fillcolor,
						 _check ? _inv_symbol : _items_array[_index].inverse_symbol,
                         _check ? complex_circle.lineiwdth : _items_array[_index].complex_circle.bordersize,
                         ITEM_TYPE_CIRCLE, "", _symbol );
}

function circles_lib_items_auto_recognition_group_params()
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items(_items_array);
    var _wrong_entries_num = _items_n % 2 != 0 && _glob_method.is_one_of( METHOD_ALGEBRAIC );
    if ( _items_n == 0 || _wrong_entries_num ) return INIT_NONE ;
    else
    {
       var _ret_init_option = INIT_NONE, _m, _bool_maps = YES, _bool_disks = YES ;
       for( _m = 0 ; _m < _items_n ; _m++ )
       {
           ITEM = _items_array[_m] ;
           if ( !is_item_obj( ITEM ) ) { _bool_disks = _bool_maps = NO ; break ; }

           if ( !is_mobius_map( ITEM.map ) ) _bool_maps = NO ;
           if ( !ITEM.map.is_consistent() || ITEM.map.is_zero_map() ) _bool_maps = NO ;
            
           if ( !is_circle( ITEM.complex_circle ) ) _bool_disks = NO ;
           else if ( ITEM.complex_circle.is_null() ) _bool_disks = NO ;
       }

       var _ret_chunk = circles_lib_method_get() != METHOD_NONE ? [ RET_OK, _glob_method ] : circles_lib_method_guess() ;
       _glob_method = _ret_chunk[0] == RET_IRRELEVANT ? METHOD_NONE : _ret_chunk[1] ;
       _ret_init_option |= _glob_method.is_one_of( METHOD_ALGEBRAIC ) ? INIT_PAIRED_ITEMS : INIT_SINGLE_ITEMS ;
       // set data source for initialization
       if ( _bool_maps ) _ret_init_option |= INIT_FROM_MAPS ;
       else if ( _bool_disks ) _ret_init_option |= INIT_FROM_DISKS ;
       return _ret_init_option ;
    }
}

function circles_lib_items_init_group_from_disks( _silent = YES, _init_mask = _glob_init_mask, _report = NO, _force = YES, _out_channel = OUTPUT_SCREEN )
{
    _init_mask = safe_int( _init_mask, _glob_init_mask ), _silent = safe_int( _silent, YES ), _report = safe_int( _report, NO );
    _force = safe_int( _force, YES ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _locked = _glob_init_mask & INIT_LOCK ? YES : NO, _report_array = [] ;
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array );
    if ( !( _init_mask & INIT_FROM_DISKS ) ) return [ RET_ERROR, "Inconsistent input params to init group from disks" ] ;
    else if ( _items_n > 0 )
    {
        var _paired_disk_required = _glob_method.is_one_of( METHOD_ALGEBRAIC ) ? YES : NO ;
   		var _check_it = YES ;
		if ( _items_n % 2 != 0 && _paired_disk_required ) _check_it = NO ;
		else if ( _glob_method.is_one_of( METHOD_INVERSION ) ) _check_it = NO ;
		if ( _check_it )
        {
       		var _border, _fill, _bordercolor, _fillcolor ;
            var _inv_symbol, _final_inverse_symbol, _candidate_inv_symbol, _index_inverse, ITEM, ITEM_INV, _work_mm = new mobius_map() ;
            if ( _report )
            {
               if ( _glob_verbose && _glob_terminal_echo_flag ) _report_array.push( "<gray>Verbose mode is one: stages will be reported below</gray>" );
               _report_array.push( "<yellow>Starting data init from disks</yellow>" );
               _report_array.push( "<lightblue>" + _items_n + " element" + ( _items_n == 1 ? "" : "s" ) + " found</lightblue>" );
               _report_array.push( "<white>Scanning symbols</white>" );
            }
           
            var _failure_mask = 0 ;

           for( var _i = 0 ; _i < _items_n ; _i++ )
           {
               ITEM = _items_array[_i] ;
               if ( !is_item_obj( ITEM ) ) return [ RET_ERROR, "Inconsistent item data type at index #"+_i ] ;
               // checking and assigning symbols
               _symbol = safe_string( ITEM.symbol, "" ), _inv_symbol = safe_string( ITEM.inverse_symbol, "" ), _candidate_inv_symbol = circles_lib_word_inverse_get( _symbol ) ;
               _failure_mask = ( _paired_disk_required && ( _symbol.length == 0 || _inv_symbol.length == 0 || !_symbol.strcmp( _candidate_inv_symbol.flipCase() ) ) ) ? YES : NO ;
               if ( _failure_mask ) return [ RET_ERROR, "Inconsistent item symbols ("+_symbol+","+_inv_symbol+","+_candidate_inv_symbol+") pair at index #"+_i ] ;

               _failure_mask = ( !_paired_disk_required && _symbol.length == 0 ) ? YES : NO ;
               if ( _failure_mask ) return [ RET_ERROR, "Inconsistent item symbol at index #"+_i+"\n\nSet up the symbols <SPAN STYLE=\"cursor:pointer;font-weight:bold;color:blue;\" ONCLICK=\"javascript:alertCLOSE();circles_lib_plugin_load('forms','edit.disk',NO,UNDET,ITEMS_SWITCH_SEEDS);\">manually</SPAN> or click <SPAN STYLE=\"cursor:pointer;font-weight:bold;color:blue;\" ONCLICK=\"javascript:alertCLOSE();circles_lib_alphabet_autoconfig_all_symbols(!_glob_terminal_echo_flag,_glob_terminal_echo_flag,NO,YES,OUTPUT_SCREEN);\">here</SPAN> for &lsquo;auto-config&rsquo;" ] ;

               _final_inverse_symbol = _paired_disk_required ? ( _inv_symbol.strcmp( _candidate_inv_symbol ) ? _inv_symbol : _candidate_inv_symbol ) : "" ;
               _index_inverse = _paired_disk_required ? circles_lib_find_item_index_by_symbol( _items_array, _final_inverse_symbol ) : UNDET ;

               // computing disks
               if ( !is_circle( _items_array[_i].screen_circle ) && is_circle( _items_array[_i].complex_circle ) )
               _items_array[_i].screen_circle = circles_lib_get_screendisk_from_complexdisk( zplane_sm, _items_array[_i].complex_circle );
               else if ( is_circle( _items_array[_i].screen_circle ) && !is_circle( _items_array[_i].complex_circle ) )
               _items_array[_i].screen_circle = circles_lib_get_complexdisk_from_screen( zplane_sm, _items_array[_i].complex_circle );

               ITEM_INV = _index_inverse != UNDET ? _items_array[_index_inverse] : null ;
               if ( !is_item_obj( ITEM_INV ) && _paired_disk_required ) return [ RET_ERROR, "Inconsistent (inverse) item data type at index #"+_index_inverse ] ;

               if ( _report )
               {
                  _report_array.push( "" );
                  _report_array.push( "<lightblue>Scanning item '"+_symbol+"'</lightblue>" );
                  if ( _paired_disk_required )
                  {
                     if ( _inv_symbol.length > 0 )
                     {
                        _report_array.push( "<lightblue>Found inverse item '"+_final_inverse_symbol+"'</lightblue>" );
                        _report_array.push( "<snow>Assuming symbols connection : "+_symbol+" <--> "+_final_inverse_symbol+"</snow>" );
                     }
                     else _report_array.push( "<orange>Unfound inverse item '"+_final_inverse_symbol+"'</orange>" );
                  }
               }
               
               // computing coefficients for map
               if ( is_circle( ITEM.complex_circle ) && ( _init_mask & INIT_SINGLE_ITEMS ) )
               {
                  if ( _report ) _report_array.push( "<lightgray>Initialization of item '"+_symbol+"'</lightgray>" );
                  if ( !_locked )
                  {
                     _items_array[_i].map = _work_mm.get_inversion_from_one_circle( ITEM.complex_circle ).copy() ;
										 if ( is_mobius_map( _items_array[_i].map ) ) _items_array[_i].map.normalize();
                     else _report_array.push( "<red>Fail to create Mobius map for item '"+_symbol+"'</red>" );
                  }
               }
               else if ( is_circle( ITEM.complex_circle ) && is_circle( ITEM_INV.complex_circle ) && ( _init_mask & INIT_PAIRED_ITEMS ) )
               {
               		if ( _symbol.isAlphaLower() )
               		{
		                  if ( _report ) _report_array.push( "<aqua>Connecting items</aqua> '<lemon>"+_symbol+"</lemon>' <--> '<emerald>"+_final_inverse_symbol+"</emerald>'" );
		                  if ( !_locked )
		                  {
		                      _items_array[_i].map = _work_mm.get_inversion_from_two_circles( ITEM.complex_circle, ITEM_INV.complex_circle ).copy() ;
		                      if ( is_mobius_map( _items_array[_i].map ) ) _items_array[_i].map.normalize();
				                  if ( _index_inverse != UNFOUND )
				                  {
						                  _items_array[_index_inverse].map = _items_array[_i].map.inv().copy() ;
		                          if ( is_mobius_map( _items_array[_index_inverse].map ) )
		                          {
                                  _items_array[_index_inverse].map.normalize() ;
		    						              _items_array[_index_inverse].original_word = _items_array[_index_inverse].symbol = _final_inverse_symbol.trim();
		    						              _items_array[_index_inverse].inverse_symbol = _symbol ;
		                          }
		                          else _report_array.push( "<red>Fail to create Mobius map for (inverse) item '"+_final_inverse_symbol+"'</red>" );
													}
		                  }
		                  else _report_array.push( "<aqua>Connecting items</aqua> <orange>'"+_symbol+"' is locked</orange>" );
									}
               }
               else return [ RET_ERROR, "Missing or invalid circles data for item '"+_symbol+"'" ];
           }

           var _msg = "All items have been correctly initialized from disks" ;
           if ( _report ) { _report_array.push( "", _msg ); _msg = _report_array.join( _glob_crlf ); }
           if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
           return [ RET_OK, _msg ];
       }
       else if ( _items_n % 2 != 0 && _paired_disk_required )
       {
           if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( _out_channel, DISPATCH_WARNING, _ERR_33_06, _glob_app_title );
           return [ RET_ERROR, _ERR_33_06 ] ;
       }
	   else if ( _glob_method == METHOD_INVERSION ) return [ RET_IRRELEVANT, "Inversion method does not need disks to be initialized" ] ;
	   else return [ RET_ERROR, _ERR_00_00 + " during initialization" ] ;
    }
    else
    {
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( _out_channel, DISPATCH_WARNING, _ERR_33_01, _glob_app_title );
       return [ RET_ERROR, _ERR_33_01 ] ;
    }
}

function circles_lib_items_init_group_from_maps( _silent, _init_mask, _report, _force, _out_channel )
{
    _silent = safe_int( _silent, YES ), _init_mask = safe_int( _init_mask, YES );
    _report = safe_int( _report, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _force = safe_int( _force, YES ) ;
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _locked = _glob_init_mask & INIT_LOCK ? YES : NO, _report_array = [] ;
    var _items_n = circles_lib_count_items( _items_array );
    var _zplane_items_desc = circles_lib_items_get_def();
    if ( !( _init_mask & INIT_FROM_MAPS ) )
    {
       var _msg = "Inconsistent params call to group init from Mobius maps" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ] ;
    }
    else if ( !_init_mask.match_bit_mask( INIT_SINGLE_ITEMS, INIT_PAIRED_ITEMS ) )
    {
       var _msg = "Fail to initialize items! Incoherent init option: missing 'single' or 'paired' attribute" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ];
    }
    else if ( _items_n > 0 )
    {
       if ( _items_n % 2 == 0 )
       {
        	 var ITEM = null, _symbol = "", _index, _index_inverse, _complex_circle, screen_circle ;
        	 var _border, _fill, _bordercolor, _fillcolor, _bordersize, _inv_symbol, coords ;
           if ( _report )
           {
              if ( _glob_verbose && _glob_terminal_echo_flag ) _report_array.push( "<gray>Verbose mode is one: init stages will be reported below</gray>" );
              _report_array.push( "<yellow>Starting data initialization from maps</yellow>" );
              _report_array.push( "<lightblue>" + _items_n + " element" + ( _items_n == 1 ? "" : "s" ) + " found</lightblue>" );
              _report_array.push( "<white>Scanning symbols</white>" );
              if ( _glob_verbose && _glob_terminal_echo_flag )
              {
                  if ( _init_mask & INIT_SINGLE_ITEMS ) _report_array.push( "<gray>Elements arrangement </gray> <white>singly</white>" );
                  else if ( _init_mask & INIT_PAIRED_ITEMS ) _report_array.push( "<gray>Elements arrangement </gray> <white>as pairs</white>" );
              }
           }

           for( var _i = 0 ; _i < _items_n ; _i++ )
           {
               ITEM = _items_array[_i], _symbol = safe_string( ITEM.symbol, "" );
               if ( !is_item_obj( ITEM ) ) return [ RET_ERROR, "Inconsistent item data at index #"+_i ] ;
               if ( _symbol.length > 0 && is_mobius_map( ITEM.map ) )
               {
                   if ( _report ) _report_array.push( "<lightgray>Initialization of item '"+_symbol+"'</lightgray>" );
                   // first save old values before initialization
                   _border = _items_array[_i].complex_circle.draw ;
                   _fill = _items_array[_i].complex_circle.fill ;
                   _bordercolor = _items_array[_i].complex_circle.bordercolor ;
                   _fillcolor = _items_array[_i].complex_circle.fillcolor ;
                   _bordersize = _items_array[_i].complex_circle.bordersize ;
                   if ( !_locked )
                   {
                       if ( _report ) _report_array.push( "<white>Calculating the isometric circle of map "+_symbol+"</white>" );
                       if ( _init_mask & INIT_CALC_CIRCLES )
                       {
                          _complex_circle = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? _items_array[_i].map.inversion_circle() : _items_array[_i].map.isometric_circle();
                          _items_array[_i].complex_circle = _complex_circle.copy();
                       }
                        
						// restore values
                        _items_array[_i].complex_circle.draw = _border ;
                        _items_array[_i].complex_circle.bordercolor = _bordercolor ;
                        _items_array[_i].complex_circle.fill = _fill ;
                        _items_array[_i].complex_circle.fillcolor = _fillcolor ;
                        _items_array[_i].complex_circle.bordersize = _bordersize ;
					    _items_array[_i].screen_circle = circles_lib_get_screendisk_from_complexdisk( zplane_sm, _items_array[_i].complex_circle );

                       if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) )
                       {
                           _inv_symbol = circles_lib_word_inverse_get( _symbol );
                           _items_array[_i].inverse_symbol = _inv_symbol ;
                           _index_inverse = circles_lib_find_item_index_by_symbol( _items_array, _inv_symbol );
                           if ( _index_inverse == UNFOUND && ( _init_mask & INIT_PAIRED_ITEMS ) )
                           {
                               // if not existing, a new inverse generator is attempted to creation
                               if ( _report ) _report_array.push( "<lightblue>Initialization/connection between items '"+_symbol+"' <--> '"+_inv_symbol+"'</lightblue>" );
                               _inverse_mm = ITEM.map.inv();
                               _complex_circle = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? _inverse_mm.inversion_circle() : _inverse_mm.isometric_circle();
  	  												 screen_circle = circles_lib_get_screendisk_from_complexdisk( zplane_sm, _complex_circle ) ;
                               _inverse_mm_obj = new item_obj( _inverse_mm, _complex_circle, screen_circle, _inv_symbol, 0,
                                                               _border, _bordercolor, _fill, _fillcolor,
                                                               _symbol, _bordersize, ITEM_TYPE_CIRCLE, "", _inv_symbol );
                               _items_array.push( _inverse_mm_obj );
                               _index_inverse = circles_lib_find_item_index_by_symbol( _items_array, _inv_symbol );
                               if ( _index_inverse != UNFOUND )
                               {
                                  if ( _items_array[_index_inverse].symbol.strcmp( _inv_symbol ) )
                                  {
                                     _items_array[_index_inverse].complex_circle.draw = _border ;
                                     _items_array[_index_inverse].complex_circle.bordercolor = _bordercolor ;
                                     _items_array[_index_inverse].complex_circle.fill = _fill ;
                                     _items_array[_index_inverse].complex_circle.fillcolor = _fillcolor ;
                                     _items_array[_index_inverse].complex_circle.bordersize = _bordersize ;
                                     _items_array[_index_inverse].complex_circle.label = _symbol ;
               					             _items_array[_index_inverse].screen_circle = circles_lib_get_screendisk_from_complexdisk( zplane_sm, _items_array[_index_inverse].complex_circle );
                                  }
                               }
                               else return [ RET_ERROR, "Fail to build inverse item for index #"+_i ] ;
                           }
                       }
                   }
               }
               else
               {
                   var _msg = "<red>Failure: can't init items. Some have not been correctly registered: symbols are missing</red>" ;
                   if ( _report )
                   {
                      _report_array.push( _msg );
                      _msg = _report_array.join( _glob_crlf )
                   }

                   if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg.strip_tags(), _glob_app_title );
                   return [ RET_ERROR, _msg ];
               }
           }

           var _msg = "Init options have been successfully set to maps" ;
           if ( _report )
           {
              _report_array.push( _msg );
              _msg = _report_array.join( _glob_crlf );
           }

           if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
           return [ RET_OK, _msg ];
       }
       else
       {
          if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Failure: " + _ERR_33_06, _glob_app_title );
          return [ RET_ERROR, "Failure: " + _ERR_33_06 ];
       }
    }
    else
    {
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ERR_00_10, _glob_app_title );
       return [ RET_ERROR, _ERR_00_10 ];
    }
}

function circles_lib_items_group_test( _silent, _out_channel ) // main function
{
    _silent = safe_int( _silent, YES ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _ret_chunk = circles_lib_items_group_consistence_test();
    var _ret_id = safe_int( _ret_chunk['ret'], UNDET ), _entries_n = safe_int( _ret_chunk['n'], 0 );
        _ret_chunk = circles_lib_items_group_return_msg( _ret_id, _entries_n );
        _ret_id = _ret_chunk[0] ;
    var _ret_msg = safe_string( _ret_chunk[1], "Unknown error" );
    if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, _ret_id >= 0 ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _glob_app_title );
    return [ _ret_id, _ret_msg ]
}

function circles_lib_items_group_consistence_test()
{
    // first, quantity: a group shall include an even number of elements
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var RET = GROUP_TEST_ERR_OK, _items_n = circles_lib_count_items( _items_array );
    if ( _items_n == 0 ) RET = GROUP_TEST_ERR_EMPTY_GROUP ;
    else if ( _items_n % 2 == 1 && _glob_method == METHOD_ALGEBRAIC ) RET = GROUP_TEST_ERR_UNPAIRED_GROUP_ITEMS ;
    else 
    {
    	 var ITEM, INV_ITEM, _symbol, _inv_symbol, _i ;
       for( i = 0 ; i < _items_n ; i++ )
       {
          ITEM = _items_array[ i ] ;
          if ( !is_item_obj( ITEM ) ) return GROUP_TEST_ERR_INCONSISTENT_ITEM_OBJ ;
          _symbol = safe_string( ITEM.symbol, "" ), _inv_symbol = safe_string( ITEM.inverse_symbol, "" ) ;
          INV_ITEM = circles_lib_find_item_obj_by_symbol( _items_array, _inv_symbol );
          if ( _glob_method == METHOD_ALGEBRAIC && !is_item_obj( INV_ITEM ) )
          {
             RET = GROUP_TEST_ERR_MISSING_INVERSE_ITEM ;
             break ;
          }
          else if ( !is_mobius_map( ITEM.map ) || !is_circle( ITEM.complex_circle ) )
          {
             RET = GROUP_TEST_ERR_INCONSISTENT_ITEM_MEMBERS ;
             break ;
          }
          else if ( _symbol.length == 0 )
          {
             RET = GROUP_TEST_ERR_MISSING_ITEM_SYMBOL ;
             break ;
          }
       }
    }
    return { ret : RET, n : _items_n } ;
}

function circles_lib_items_group_return_msg( RET, _entries_n )
{
    RET = safe_int( RET, GROUP_TEST_ERR_UNDET );
    var MSG = "" ;
    if ( RET == GROUP_TEST_ERR_EMPTY_GROUP ) MSG += _ERR_00_02 ;
    else if ( RET == GROUP_TEST_ERR_UNPAIRED_GROUP_ITEMS ) MSG += "Group consistence failure: this group does not include an even number of elements ( currently " + _entries_n + " )" ;
    else if ( RET == GROUP_TEST_ERR_MISSING_INVERSE_ITEM ) MSG += "Group consistence failure: at least one entry does not include its inverse" ;
    else if ( RET == GROUP_TEST_ERR_MISSING_ITEM_SYMBOL ) MSG += "Group consistence failure: at least one missing symbol" ;
    else if ( RET == GROUP_TEST_ERR_INCONSISTENT_ITEM_OBJ ) MSG += "Group consistence failure: at least one seed has not been correctly generated" ;
    else if ( RET == GROUP_TEST_ERR_INCONSISTENT_ITEM_MEMBERS ) MSG += "Group consistence failure: at least one element does not include proper data" ;
    else if ( RET == GROUP_TEST_ERR_OK ) MSG += "Group consistence test has been passed with success !" ;
    else if ( RET == GROUP_TEST_ERR_UNDET ) MSG += "Group consistence failure: unknown error" ;
    return [ RET, MSG ] ;
}