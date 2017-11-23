function circles_terminal_cmd_doctor()
{
    var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
    var _params = arguments[0] ;
    var _output_channel = arguments[1] ;
    var _par_1 = arguments[2] ;
    var _cmd_mode = arguments[3] ;
    var _caller_id = arguments[4] ;
    _params = safe_string( _params, "" ).trim();

    if ( _glob_verbose && _glob_terminal_echo_flag )
    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

	var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0, _cnt = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _index_array = UNDET ;
    var _symbols_array = null ;
    var _inv_symbols_array = null ;
    var _fn_ret_val = null ;

    var _params_assoc_array = [];
        _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
        _params_assoc_array['keywords'] = NO ;
        _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
        _params_assoc_array['help'] = NO ;

    var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); 
        // pre-scan for levenshtein correction
    var _local_cmds_params_array = [];
    	_local_cmds_params_array.push( "release", "seeds", "generators", "html", "help" );
    circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _params_assoc_array['action'] = _p ;
            else if ( _p.stricmp( "seeds" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
            else if ( _p.stricmp( "generators" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_GENS ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); }
        }
    }
     
    var _items_array = _params_assoc_array["item"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array );
	if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _output_channel );
    else if ( _params_assoc_array['keywords'] )
    {
        var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
        if ( _msg.length == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
        else
        {
            _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
            circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
        }
    }
    else if ( _items_n > 0 )
    {    
        if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _output_channel );
        else if ( _params_assoc_array['keywords'] )
        {
            var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
            if ( _msg.length == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
            else
            {
                _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
            }
        }
        else if ( !_b_fail )
        {
            var _action = _params_assoc_array['action'] ;
            switch( _action )
            {
                case "release":
                circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                default:
                var _dest_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
                var _category_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Performing doctor's scan on</lightblue> <white>"+_dest_ref+"</white>", _par_1, _cmd_tag );

                var _HALT = NO, _error_scan = 0, _error_counter = 0 ;
                // SCAN ITEMS INTEGRITY
                var _error_array = _doctor_scan_items_integrity( _items_array, _output_channel, _cmd_tag );
                _error_scan |= _error_array[0] ;
                _error_scan += safe_int( _error_array[1], 0 );
        
                // SCAN INIT OPTIONS
                _error_array = _doctor_scan_init_options( _items_array, _output_channel, _cmd_tag );
                _error_scan |= _error_array[0] ;
                _error_scan += safe_int( _error_array[1], 0 );
                if ( _error_counter == 0 ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "\nNo errors found", _par_1, _cmd_tag );
                circles_lib_output( _output_channel, DISPATCH_INFO, "Doctor's scan has finished", _par_1, _cmd_tag );
                break ;
            }
        }
    }
    else if ( _items_n == 0 ) circles_lib_output( _output_channel, DISPATCH_WARNING, _msg = "Doctor's scan can't start: " + _ERR_33_01, _par_1, _cmd_tag );

    if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function _doctor_scan_init_options( _items_array, _output_channel, _par_1, _src )
{
     if ( !is_array( _items_array ) ) _items_array = _glob_seeds_array ;
     var _HALT = NO, _error_scan = 0, _error_counter = 0 ;
     circles_lib_output( _output_channel, DISPATCH_INFO, "", _par_1, _src );
     circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<greenyellow>Start to scan init options</greenyellow>", _par_1, _src );
     if ( _glob_method == METHOD_NONE )
     {
        _error_counter++ ;
        circles_lib_output( _output_channel, DISPATCH_WARNING, "No selected method. Init options scan quits here.", _par_1, _src );
        return [ _error_scan, _error_counter ] ;
     }
     else
     {
        var _method_def = circles_lib_method_get_def( _glob_method ), _process_def = circles_lib_process_get_def( _glob_process );
        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Current method</lightblue> <snow>"+_method_def+"</snow>", _par_1, _src );
        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Current process</lightblue> <snow>"+_process_def+"</snow>", _par_1, _src );
        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Cleaning all init options</lightblue>", _par_1, _src );
        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Reset init options for</lightblue> <snow>"+_method_def+"</snow> <lightblue>method</lightblue>", _par_1, _src );
        _glob_init_mask = INIT_NONE ;

        if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) )
        {
           _glob_init_mask |= INIT_PAIRED_ITEMS ;
           _glob_init_mask |= INIT_FROM_MAPS ;
        }
        else if ( _glob_method == METHOD_INVERSION )
        {
           _glob_init_mask |= INIT_SINGLE_ITEMS ;
           _glob_init_mask |= INIT_FROM_DISKS ;
        }

        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>Dictionary settings optimized for</lightblue> <snow>"+_method_def+"</snow> <lightblue>method</lightblue>", _par_1, _src );
        circles_lib_method_set( _glob_method );
        return [ _error_scan, _error_counter ] ;
     }
}

function _doctor_scan_items_integrity( _items_array, _output_channel, _par_1, _src )
{
     if ( !is_array( _items_array ) ) _items_array = _glob_seeds_array ;

     var _HALT = NO, _error_scan = 0, _error_counter = 0 ;
     circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<greenyellow>Start to scan items integrity</greenyellow>", _par_1, _src );
     var _items_n = circles_lib_count_items( _items_array ), _i, ITEM, _current_symbol, _label_str, _params_array, _cc_chunk, _mask ;
     var _n_items_safe = circles_lib_count_items( _items_array, YES ) ;
     
     if ( _items_n != _n_items_safe )
     {
         var _entries_n = Math.max( _items_n, _n_items_safe );
         circles_lib_output( _output_channel, DISPATCH_WARNING, "Detected possible memory leak in items archive", _par_1, _src );
         circles_lib_output( _output_channel, DISPATCH_INFO, "Cleaning incoherent entries", _par_1, _src );
         var _method = circles_lib_method_get(), _n_incoherent = 0 ;
         // circles_lib_find_item_index_by_symbol( _items_array, _symbol )
         for( _i = 0 ; _i < _items_n ; _i++ )
         {
            if ( !is_item_obj( _items_array[_i] ) )
            {
                _items_array.remove( _i, _i ) ;
                _i = -1 ; // restart
                _n_incoherent++ ;
            }
            else if ( circles_lib_find_item_index_by_symbol( _items_array, _items_array[_i].inv_symbol ) == UNFOUND )
            {
                _items_array.remove( _i, _i ) ;
                _i = -1 ; // restart
                _n_incoherent++ ;
            }
         }
         circles_lib_output( _output_channel, DISPATCH_INFO, _n_incoherent+" incoherent entr"+(_n_incoherent==1?"y has":"ies have")+" been found and removed", _par_1, _src );
         _items_n = circles_lib_count_items( _items_array ) ;
         circles_lib_output( _output_channel, DISPATCH_INFO, "The items archive now includes "+_items_n+" entr"+(_items_n==1?"y":"ies"), _par_1, _src );
     }
     
     for( _i = 0 ; _i < _items_n ; _i++ )
     {
        ITEM = _items_array[_i], _mask = 0 ;
        if ( !is_item_obj( ITEM ) )
        {
            circles_lib_output( _output_channel, DISPATCH_WARNING, "Severe memory error: doctor scan has been halted", _par_1, _src );
            _HALT = YES ;
        }
        else
        {
            _error_scan = 0 ;
            // scan for alphabet errors
            /* - missing direct symbols
               - if ALGEBRAIC, check inverse maps
            */
            _current_symbol = ITEM.symbol ;
            _symbol = " - symbol '" + ( ITEM.symbol.length == 0 ? "missing" : _current_symbol )+"'" ;

            circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, ( _i > 0 ? _glob_crlf : "" ) + "<yellow>Item #"+(_i+1)+"</yellow>" + _symbol, _par_1, _src );
            circles_lib_output( _output_channel, DISPATCH_INFO, "* scan for alphabet errors", _par_1, _src );
            if ( ITEM.symbol.length == 0 || ITEM.symbol.length != 1 )
            {
               _error_counter++ ;
               circles_lib_output( _output_channel, DISPATCH_WARNING, "Incorrect symbol: attempting to set up a new one", _par_1, _src );
               _items_array[_i].original_word = _items_array[_i].symbol = circles_lib_alphabet_suggest_symbol();
               if ( _items_array[_i].symbol.length > 0 )
               {
                  circles_lib_output( _output_channel, DISPATCH_INFO, "New symbol '"+_items_array[_i].symbol+"' has been set", _par_1, _src );
                  if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) )
                  {
                     _items_array[_i].inverse_symbol = circles_lib_word_inverse_get( ITEM.symbol );
                     circles_lib_output( _output_channel, DISPATCH_INFO, "New inverse symbol '"+_items_array[_i].inverse_symbol+"' has been set", _par_1, _src );
                  }
               }
            }

            circles_lib_output( _output_channel, DISPATCH_INFO, "* scan for geometry errors", _par_1, _src );
            // scan for Mobius maps errors (missing Mobius map / circle)
            _mask |= is_mobius_map( ITEM.map ) ? 0 : 1 ;
            _mask |= is_circle( ITEM.complex_circle ) ? 0 : 2 ;
            if ( _mask & 2 )
            {
                _error_counter++ ;
                circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing Mobius map for item '"+_current_symbol+"'", _par_1, _src );
                circles_lib_output( _output_channel, DISPATCH_INFO, "Attempting to recover map from associated disk", _par_1, _src );
                _params_array = is_circle( ITEM.complex_circle ) ? ITEM.complex_circle.get_square_matrix() : null ;
                _items_array[_i].map = is_array( _params_array ) ? new mobius_map( _params_array[0], _params_array[1], _params_array[2], _params_array[3] ) : null ;
                if ( is_mobius_map( _items_array[_i].map ) )
                circles_lib_output( _output_channel, DISPATCH_INFO, "Mobius map has been recovered with success", _par_1, _src );
                else
                {
                    circles_lib_output( _output_channel, DISPATCH_WARNING, "Fail to recover Mobius map for item '"+_items_array[_i].symbol+"'", _par_1, _src );
                    _HALT = YES ;
                }
            }
            else if ( _mask & 1 )
            {
                _error_counter++ ;
                circles_lib_output( _output_channel, DISPATCH_WARNING, "Missing disk for item '"+_current_symbol+"'", _par_1, _src );
                circles_lib_output( _output_channel, DISPATCH_INFO, "Attempt to recover it from related Mobius map in the default isometric type", _par_1, _src );
                _cc_chunk = is_mobius_map( ITEM.map ) ? ITEM.map.isometric_circle() : null ;
                _items_array[_i].complex_circle = is_circle( _cc_chunk ) ? new circle( new point( _cc_chunk['cx'], _cc_chunk['cy'] ), _cc_chunk['r'] ) : null ;
                _items_array[_i].screen_circle = is_circle( _cc_chunk ) ? circles_lib_complex_to_screen_disk( _items_array[_i].complex_circle, zplane_sm ) : null ;

                if ( is_circle( _items_array[_i].complex_circle ) )
                circles_lib_output( _output_channel, DISPATCH_INFO, "Disk has been recovered with success", _par_1, _src );
                else
                {
                    circles_lib_output( _output_channel, DISPATCH_WARNING, "Fail to recover disk map for item '"+_items_array[_i].symbol+"'", _par_1, _src );
                    _HALT = YES ;
                }
            }
            else if ( _mask & (1|2) )
            {
                circles_lib_output( _output_channel, DISPATCH_WARNING, "Severe data error: no disk and Mobius map for item '"+_items_array[_i].symbol+"'", _par_1, _src );
                _HALT = YES ;
            }
            
            if ( !is_circle( _items_array[_i].complex_circle ) ) _items_array[_i].complex_circle = new circle( 0, 0, 0 ) ;
            if ( !is_circle( _items_array[_i].screen_circle ) ) _items_array[_i].screen_circle = new circle( 0, 0, 0 ) ;

            if ( ITEM.complex_circle.radius == 0 )
            {
                _error_scan |= 2 ;
                _error_counter++ ;
                circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: disk '"+_current_symbol+"' has zero radius", _par_1, _src );
                circles_lib_output( _output_channel, DISPATCH_INFO, "Manual setting needed", _par_1, _src );
            }
            else if ( isNaN( ITEM.complex_circle.center.x ) || isNaN( ITEM.complex_circle.center.y ) )
            {
                _error_scan |= 4 ;
                _error_counter++ ;
                circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: disk '"+_current_symbol+"' center coords are invalid", _par_1, _src );
                circles_lib_output( _output_channel, DISPATCH_INFO, "Manual setting needed", _par_1, _src );
            }
            else if ( ITEM.complex_circle.drawcolor.length == 0 &&
                      ITEM.complex_circle.fillcolor.length == 0 && !_glob_palette_use )
            {
                _error_scan |= 4 ;
                _error_counter++ ;
                circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning: disk '"+_current_symbol+"' colors are empty and palette is not flagged for use", _par_1, _src );
                circles_lib_output( _output_channel, DISPATCH_WARNING, "Draw color reset to 'black'. Fill color, if required, could be manually set", _par_1, _src );
                _items_array[_i].complex_circle.drawcolor = DEFAULT_COLOR_STD ;
            }

            circles_lib_output( _output_channel, DISPATCH_INFO, "* scan for draw errors", _par_1, _src );
            // scan for drawing property conflicts (i.e. draw but no color, fill but no color)
            _error_scan = 0 ;
            if ( ITEM.complex_circle.draw && ITEM.complex_circle.drawcolor.length == 0 ) _error_scan |= 1 ;
            if ( !( ITEM.complex_circle.draw ) && ITEM.complex_circle.drawcolor.length > 0 ) _error_scan |= 2 ;
            if ( _error_scan & 1 || _error_scan & 2 )
            {
                _error_counter++ ;
                circles_lib_output( _output_channel, DISPATCH_WARNING, "Found incongruent draw settings for item '"+_current_symbol+"'", _par_1, _src );
                if ( _error_scan & 1 ) _items_array[_i].screen_circle.drawcolor = _items_array[_i].complex_circle.drawcolor = _glob_draw_seed_color ;
                if ( _error_scan & 2 ) _items_array[_i].screen_circle.draw = _items_array[_i].complex_circle.draw = YES ;
                circles_lib_output( _output_channel, DISPATCH_INFO, "Fixed", _par_1, _src );
            }
        }

        if ( _HALT ) break ;
      }

      // check whether all maps are zero
      var _is_zero_group = _items_array.test( function( _item ){ return _item.map.is_zero_map() ? 1 : 0 ; } ) ;
      if ( _is_zero_group && _error_counter == 0 )
      {
          circles_lib_output( _output_channel, DISPATCH_WARNING, "", _par_1, _src );
          circles_lib_output( _output_channel, DISPATCH_WARNING, "Warning! All maps have been found to be zero!", _par_1, _src );
          circles_lib_output( _output_channel, DISPATCH_WARNING, "Attempting to recover coefficients from circles", _par_1, _src );
          var _ret_chunk = circles_lib_method_guess( _items_array ) ;
          if ( _ret_chunk[0] == RET_OK ) circles_lib_method_set( _ret_chunk[1] ) ;

          _glob_init_mask = INIT_FROM_DISKS | INIT_PAIRED_ITEMS ;
          _ret_chunk = circles_lib_items_init_group_from_disks( YES, _glob_init_mask, YES, YES, _output_channel ) ;

          if ( _ret_chunk[0] == RET_OK )
          circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _ret_chunk[1], _par_1, _src );
          else
          circles_lib_output( _output_channel, DISPATCH_ERROR, _ret_chunk[1], _par_1, _src );
      }

      return [ _error_scan, _error_counter ] ;
}