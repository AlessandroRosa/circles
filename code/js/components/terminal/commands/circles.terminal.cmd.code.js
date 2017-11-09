function circles_terminal_cmd_code()
{
    var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
    var _params = arguments[0] ;
    var _output_channel = arguments[1] ;
    var _par_1 = arguments[2] ;
    var _cmd_mode = arguments[3] ;
    var _caller_id = arguments[4] ;

    if ( _glob_verbose && _glob_terminal_echo_flag )
    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _fn_ret_val = null ;

     var _params_assoc_array = [];
         _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['keywords'] = NO ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['dump'] = NO ;
         _params_assoc_array['dump_array'] = null ;
         _params_assoc_array['dump_operator_index'] = UNDET ;

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _output_channel == OUTPUT_SCRIPT )
     {
         _b_fail = YES, _error_str = "This command doesn't run in script mode, thus it will be skipped" ;
     }
     else
     {
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );

				 var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
				 _params_assoc_array['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
				 _params_assoc_array['dump_operator_index'] = _dump_operator_index ;
				 _params_assoc_array['dump_array'] = [];

				 // gather all dump parameters into one array
         if ( _params_assoc_array['dump'] )
         {
    				 for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
    				 if ( _params_array[_i].trim().length > 0 ) _params_assoc_array['dump_array'].push( _params_array[_i] );
         }

         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
						 _local_cmds_params_array.push( "html" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );

         var _p ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
         }
     }

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
         var _html = _params_assoc_array['html'] ;
         if ( _action == "run" )
         {
              _glob_terminal_run_code_from = RUN_CODE_FROM_TERMINAL ;
              circles_lib_batch_compiler_run();
         }
         else
         {
              /* code : generate a listing of current settings and flush'em into a file
                 1st step: new, method, construction, silent, tiling, drawentity,
                           echo, accuracy, auto setting, depth, layers
                 2nd step: coords, ticks, palette, repetends
                 3rd step: disk coords / mobius params
                 4th step: refresh zplane, refresh wplane
                 5th step: add filter (not implemented yet)
              */

              var code_fn = function( _opt, _output_channel )
              {
                  var _plain_code = _out_text_string = circles_terminal_cmd_code_assemble( _opt );
                  if ( _params_assoc_array['dump'] )
									{
											_params_assoc_array['dump_array'] = _params_assoc_array['dump_array'] != null ? _params_assoc_array['dump_array'][0] : "circles.code.txt" ;
											var _ret_chunk = circles_lib_dump_data_to_format( _plain_code, _params_assoc_array['dump_array'], "savepix" );
											var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
											var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation";
											if ( _ret_id == 0 )
  										{
													_b_fail = YES, _error_str = _ret_msg ;
											}
											else circles_lib_output( _output_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
									}

                  if ( _output_channel == OUTPUT_HTML ) circles_lib_terminal_color_decode_htmltext( "<gray>"+_plain_code+"</gray>", 'code', 'right', 'top' );
                  else if ( _output_channel == OUTPUT_TEXT ) return _plain_code ;
                  else if ( _output_channel.match_bit_mask( TERMINAL_SCRIPT_INPUT, OUTPUT_TERMINAL ) )
                  {
                      $( "#CIRCLESbatchcompilerTEXT" + _glob_terminal_form_suffix ).val( _plain_code );
                      if ( $( "#CIRCLESbatchcompilerTEXT" + _glob_terminal_form_suffix ).val().length == 0 )
                      circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't flush the resulting code into the script tab.\nPlease, close and re-open the terminal pop-up", _par_1, _cmd_tag );
                      else
                      circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The resulting code has been flushed into the script tab", _par_1, _cmd_tag );
                  }
              }

              if ( _plugin_last_ref == 0 ) code_fn( 1, _output_channel );
              else
              {
                   var _pre_prompt = "System detected one active gens plug-in." + _glob_crlf ;
                       _pre_prompt += "The related configuration code can be generated, depending to the choice below:" + _glob_crlf ;
                       _pre_prompt += "1. extract Mobius maps parameters" + _glob_crlf ;
                       _pre_prompt += "2. write the plug-in settings" + _glob_crlf ;
                   var _prompt_question  = "Select: " ;
                   var _question_counter = 1 ;

                        var _fn = function( command, _rows_of_code )
                        {
                            if (command.match(/\b(1)\b/g))
                            {
                                code_fn( 1, _output_channel );
                                for( var _i = 0 ; _i < _question_counter ; _i++ ) _glob_terminal_out_stream.pop();
                            }
                            else if (command.match(/\b(2)\b/g))
                            {
                                code_fn( 2, _output_channel );
                                for( var _i = 0 ; _i < _question_counter ; _i++ ) _glob_terminal_out_stream.pop();
                            }
                            else if (command.match(/\b(quit)\b/g))
                            {
                                circles_lib_terminal_info_echo('running code aborted by user');
                                for( var _i = 0 ; _i < _question_counter ; _i++ ) _glob_terminal_out_stream.pop();
                            }
                            else
                            {
                               var _response = "Please, reply with '1','2' or 'quit'" ;
                               circles_lib_terminal_info_echo( _response );
                               _glob_terminal_out_stream.push( _fn, { prompt: _prompt_question } );
                            }
                        } ;

                        if ( _glob_terminal_questions_enabled && _output_channel == OUTPUT_TERMINAL )
                        {
                           circles_lib_output( _output_channel, DISPATCH_INFO, _pre_prompt, _par_1, _cmd_tag );
                           _glob_terminal_out_stream.push( _fn, { prompt: _prompt_question });
                        }
                        else code_fn( 1, _output_channel );
              }
         }
     }

     if ( _b_fail && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}

function circles_terminal_cmd_code_assemble( _opt, _settings_array )
{
    if ( !is_array( _settings_array ) ) _settings_array = [] ;
    _opt = safe_int( _opt, 1 );
    var _rows_of_code = [];
        _rows_of_code = circles_terminal_cmd_code_1st_step( _opt, _settings_array, _rows_of_code );
        _rows_of_code = circles_terminal_cmd_code_2nd_step( _opt, _settings_array, _rows_of_code );
        _rows_of_code = circles_terminal_cmd_code_3rd_step( _opt, _settings_array, _rows_of_code );
        _rows_of_code = circles_terminal_cmd_code_4th_step( _opt, _settings_array, _rows_of_code );
        _rows_of_code = circles_terminal_cmd_code_5th_step( _opt, _settings_array, _rows_of_code );
    return _rows_of_code.join( _glob_crlf );
}

function circles_terminal_cmd_code_1st_step( _opt, _settings_array, _rows_of_code )
{
    // opt : 1 disk declaration, 2 plug-in settings, 3 input fixed points (if any)
    opt = safe_int( _opt, 1 );
    if ( _opt == 2 )
    {
       var _plu_str = safe_float( _plugin_last_ref ).toFixed(2);
       var _desc = _plugin_definitions_array[_plu_str] ;
           if ( is_string( _desc ) ) _desc = _desc.strip_tags();
       var _info = _plugin_info_array[_plu_str] ;
           if ( is_string( _info ) ) _info = _info.strip_tags();
       _rows_of_code.push( "/*\n" + _desc + _glob_crlf + _info + "\n*/" );
    }

		if ( _glob_comment.length > 0 ) _rows_of_code.push( "comment:", "[", _glob_comment, "]", "" );

		// 1ST STEP
    var _params = "" ;
    var _target = _settings_array['target_plane_type'] != null ? _settings_array['target_plane_type'] : "" ;
    if ( _target.stricmp( "bip" ) ) _rows_of_code.push( "new generals coords terminal" );
    else _rows_of_code.push( "new" );

    if ( _glob_title ) _rows_of_code.push( "title " + _glob_title );

    if( _glob_terminal_silent == ENABLED ) _rows_of_code.push( "silent on" );
    else _rows_of_code.push( "silent off" );

    if( _glob_terminal_echo_flag == ENABLED ) _rows_of_code.push( "echo on" );
    else _rows_of_code.push( "echo off" );

    _rows_of_code.push( "symbol " + ( _glob_show_symbols_zplane ? "show" : "hide" ) );
    if ( _target.length > 0 )
       _rows_of_code.push( "grid "+_settings_array['target_plane_type']+" " + ( _glob_show_grid_wplane ? "show" : "hide" ) );
    else
    {
       _rows_of_code.push( "grid zplane " + ( _glob_show_grid_zplane ? "show" : "hide" ) );
       _rows_of_code.push( "grid wplane " + ( _glob_show_grid_wplane ? "show" : "hide" ) );
    }

    if ( _target.stricmp( "bip" ) ) _rows_of_code.push( "plane bip" );
    else
    {
       switch( _glob_target_plane )
       {
          case Z_PLANE : _rows_of_code.push( "plane zplane" ); break ;
          case W_PLANE : _rows_of_code.push( "plane wplane" ); break ;
          case BIP_BOX : _rows_of_code.push( "plane bip" ); break ;
	        default: _rows_of_code.push( "plane noplane" ) ; break ;
       }
    }

    _rows_of_code.push( "grid ticks " + _glob_ticks_count );
    _rows_of_code.push( "config set accuracy " + _glob_accuracy );
    _rows_of_code.push( "config set depth " + _glob_depth );

    return _rows_of_code ;
}

function circles_terminal_cmd_code_2nd_step( _opt, _settings_array, _rows_of_code )
{
    // 2ND STEP
    if ( is_array( _glob_palette_array ) )
    {
        var _palette_len = _glob_palette_array.length ;
        if ( _palette_len > 0 )
        {
            _rows_of_code.push( "palette " + ( _glob_palette_use ? "on" : "off" ) );
            if ( _glob_palette_use )
            {
                var _color_start = ( new String( _glob_palette_array[0] ) ).replaceAll( " ", "" );
                var _color_start_def = ( circles_lib_colors_get_formats( _color_start ) )[COLOR_TAG] ;
                var _color_end = ( new String( _glob_palette_array[_palette_len-1] ) ).replaceAll( " ", "" );
                var _color_end_def = ( circles_lib_colors_get_formats( _color_end ) )[COLOR_TAG] ;
                if ( _color_start_def.length == 0 ) _color_start_def = _color_start ;
                if ( _color_end_def.length == 0 ) _color_end_def = _color_end ;
                _rows_of_code.push( "palette create start:" + _color_start_def + " end:" + _color_end_def + " steps:" + _palette_len );
            }
        }
    }

    return _rows_of_code ;
}

function circles_terminal_cmd_code_3rd_step( _opt, _settings_array, _rows_of_code )
{
    // opt : 1 = disk declaration, 2 = plug-in settings
    _opt = safe_int( _opt, 1 );
    // 3RD STEP
    var _items_n = circles_lib_count_items();
    switch( _glob_method )
    {
        case METHOD_INVERSION :
        _rows_of_code.push( "method " + circles_lib_method_get_def_for_cmds( _glob_method ) );
        break ;
        case METHOD_ALGEBRAIC :
        var _str = "method " + circles_lib_method_get_def_for_cmds( _glob_method );
        if ( _glob_process == PROCESS_BREADTHFIRST ) _str += " breadthfirst" ;
        else if ( _glob_process == PROCESS_INDEXSEARCH ) _str += " indexsearch" ;
        else if ( _glob_process == PROCESS_RANDOM ) _str += " random" ;
	      _rows_of_code.push( _str );
				break ;
        default: break ;
    }

    switch( _glob_drawentity )
    {
        case DRAWENTITY_ISOMETRIC_CIRCLE : _rows_of_code.push( "config set drawentity circle" ); break ;
        case DRAWENTITY_POINT : _rows_of_code.push( "config set drawentity point" ); break ;
        case DRAWENTITY_PIXEL : _rows_of_code.push( "config set drawentity pixel" ); break ;
        default :
        _rows_of_code.push( "// no geometric drawing object found: circle is set by default" );
        if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) ) _rows_of_code.push( "config set drawentity pixel" );
        else _rows_of_code.push( "config set drawentity circle" );
        break ;
    }

    var _cmd_str = "" ;
    if ( _glob_construction_mode == CONSTRUCTION_LIMITSET ) _cmd_str = "config set construction limitset" ;
    if ( _glob_construction_mode == CONSTRUCTION_TILING ) _cmd_str = "config set construction tiling" ;
    if ( _glob_disk_threshold_operator.length > 0 ) _cmd_str += " " + _glob_disk_threshold_operator ;
    if ( _glob_disk_threshold_operator.length > 0 ) _cmd_str += " " + _glob_disk_threshold_radius ;
    if ( _cmd_str.length > 0 ) _rows_of_code.push( _cmd_str );

    if ( _opt == 1 )
    {
        switch( _glob_method )
        {
            case METHOD_INVERSION :
            var ITEM, _mobius_map, _cc, _symbol, _inv_symbol, _cmd ;
            var _drawcolor_out, _drawcolor_chunk, _fillcolor_out, _fillcolor_chunk ;
            for( var _i = 0 ; _i < _items_n ; _i++ )
            {
                ITEM = _glob_seeds_array[_i] ;
                if ( is_item_obj( ITEM ) )
                {
                    _mobius_map = ITEM.map ;
                    _cc = ITEM.complex_circle ;
                    _symbol = ITEM.symbol ;
                    _inv_symbol = ITEM.inverse_symbol ;

                    _cmd = "disk add" ;
                    _cmd += " " + _symbol ;
                    _cmd += " center:" + _cc.center.x + "," + _cc.center.y ;
                    _cmd += " radius:" + _cc.radius ;

                    if ( _inv_symbol.length > 0 ) _cmd += " " + _inv_symbol ;
                    if ( _cc.draw == 0 ) _cmd += " nodraw" ;
                    if ( _cc.fill ) _cmd += " fill" ;
                    if ( _cc.linewidth != 1 ) _cmd += " linewidth:" + _cc.linewidth ;

                    _drawcolor_chunk = circles_lib_colors_get_formats( _cc.drawcolor );
                    _drawcolor_out = ( _drawcolor_chunk[3] != "no tag" ) ? _drawcolor_chunk[3] : _drawcolor_chunk[2] ;
                    _fillcolor_chunk = circles_lib_colors_get_formats( _cc.fillcolor );
                    _fillcolor_out = ( _fillcolor_chunk[3] != "no tag" ) ? _fillcolor_chunk[3] : _fillcolor_chunk[2] ;

                    if ( _cc.draw && _drawcolor_out.length > 0 ) _cmd += " drawcolor:" + _drawcolor_out ;
                    if ( _cc.fill && _fillcolor_out.length > 0 ) _cmd += " fillcolor:" + _fillcolor_out ;
                    _rows_of_code.push( _cmd );
                    if ( _cc.notes.length > 0 )
                    _rows_of_code.push( "disk " + _symbol + " notes:" + _notes );
                }
                else _rows_of_code.push( "Failure - no disk object resident in memory" );
            }
            break ;
            case METHOD_ALGEBRAIC :
            var ITEM, _mobius_map, _cc, _symbol, _inv_symbol, _cmd ;
            for( var _i = 0 ; _i < _items_n ; _i++ )
            {
                ITEM = _glob_seeds_array[_i] ;
                if ( is_item_obj( ITEM ) )
                {
                    _mobius_map = ITEM.map, _cc = ITEM.complex_circle ;
                    _symbol = ITEM.symbol, _inv_symbol = ITEM.inverse_symbol ;
                    _cmd = "mobius add" ;
                    _cmd += " " + _symbol ;
                    _cmd += " a:(" + _mobius_map.a.real + "," + _mobius_map.a.imag + ")" ;
                    _cmd += " b:(" + _mobius_map.b.real + "," + _mobius_map.b.imag + ")" ;
                    _cmd += " c:(" + _mobius_map.c.real + "," + _mobius_map.c.imag + ")" ;
                    _cmd += " d:(" + _mobius_map.d.real + "," + _mobius_map.d.imag + ")" ;
                    _rows_of_code.push( _cmd );
                    _cmd = "mobius update" ;
                    _cmd += " " + _symbol ;
                    if ( _inv_symbol.length > 0 ) _cmd += " " + _inv_symbol ;
                    if ( _cc.linewidth != 1 ) _cmd += " linewidth:" + _cc.linewidth ;
                    _cmd += _cc.draw == 0 ? " nodraw" : " draw" ;
                    if ( _cc.fill ) _cmd += " fill" ;

                    var _drawcolor_out = "" ;
                    var _drawcolor_chunk = circles_lib_colors_get_formats( _cc.drawcolor );
                        _drawcolor_out = ( _drawcolor_chunk[3] != "transparent" && _drawcolor_chunk[3].length > 0 ) ? _drawcolor_chunk[3] : _drawcolor_chunk[2] ;
                    var _fillcolor_out = "" ;
                    var _fillcolor_chunk = circles_lib_colors_get_formats( _cc.fillcolor );
                        _fillcolor_out = ( _fillcolor_chunk[3] != "transparent" && _fillcolor_chunk[3].length > 0 ) ? _fillcolor_chunk[3] : _fillcolor_chunk[2] ;

                    if ( _cc.draw && _drawcolor_out.length > 0 ) _cmd += " drawcolor:" + _drawcolor_out ;
                    if ( _cc.fill && _fillcolor_out.length > 0 ) _cmd += " fillcolor:" + _fillcolor_out ;
                    _rows_of_code.push( _cmd );
                }
                else _rows_of_code.push( "Failure - no disk object resident in memory" );
            }
            break ;
		        default: break ;
        }
    }

    return _rows_of_code ;
}

function circles_terminal_cmd_code_4th_step( _opt, _settings_array, _rows_of_code )
{
    // 4TH STEP
    var _init_cmd_array = [];
        _init_cmd_array.push( "init" );
    if ( _glob_init_mask & INIT_AUTO_RECOGNITION || _glob_init_mask == INIT_NONE ) _init_cmd_array.push( "auto" );
    else
    {
       if ( _glob_init_mask & INIT_FROM_DISKS ) _init_cmd_array.push( "disks" );
       else if ( _glob_init_mask & INIT_FROM_MAPS ) _init_cmd_array.push( "maps" );

       if ( _glob_init_mask & INIT_SINGLE_ITEMS ) _init_cmd_array.push( "singly" );
       else if ( _glob_init_mask & INIT_PAIRED_ITEMS ) _init_cmd_array.push( "paired" );
    }

    if ( _glob_init_mask & INIT_LOCK ) _init_cmd_array.push( "lock" );
    var _init_cmd = _init_cmd_array.join( " " );

    _rows_of_code.push( _init_cmd );
    _rows_of_code.push( "config set diskfill " + ( _glob_wplane_disk_fill ? "yes" : "no" ) );
    _rows_of_code.push( "config set diskdraw " + ( _glob_wplane_disk_draw ? "yes" : "no" ) );
    _rows_of_code.push( "config set diskdash " + ( _glob_activate_dashed_border ? "yes" : "no" ) );

    if ( circles_lib_gens_model_exists() && !circles_lib_gens_model_is_exact() )
    {
        _rows_of_code.push( "gensset flush" );
		  	var _sch_n = circles_lib_count_gens_set_model(), _symbol ;
			  if ( _sch_n > 0 )
        {
            var _symbols_array = [];
            for( var _i = 0 ; _i < _sch_n ; _i++ )
        		{
       		     _symbol = _glob_gens_set_model_array[_i] ;
       		     if ( _symbol.length > 0 ) _symbols_array.push( _symbol );
        		}

            _rows_of_code.push( "gensset add " + _symbols_array.join( " " ) + " gens" );
        		_rows_of_code.push( "gensset init force" );
        }
    }

    if ( _glob_method == METHOD_ALGEBRAIC )
    {
        if ( _glob_process.is_one_of( PROCESS_BREADTHFIRST ) &&
             safe_size( _glob_repetends_array, 0 ) > 0 && _items_n > 0 )
        {
       		  var _symbol, _rep ;
            for( var _i = 0 ; _i < _glob_repetends_array.length ; _i++ )
            {
                _symbol = ( _glob_seeds_array[_i] != null ) ? _glob_seeds_array[_i].symbol.trim() : "" ;
                _rep = ( _glob_repetends_array[_i] != null ) ? _glob_repetends_array[_i] : "" ;
                if ( _symbol.length > 0 && _rep.length > 0 ) _rows_of_code.push( "repetends set "+_symbol+" " + _rep );
            }
        }

        if ( _glob_method == METHOD_ALGEBRAIC && _glob_process == PROCESS_RANDOM &&
             safe_size( _glob_rnd_probability_array, 0 ) > 0 )
        {
        		 var _rng_method = "" ;
    				 switch( _glob_probabilityRNGmethod )
    				 {
    						case RNG_BUILT_IN: _rng_method = "built-in" ; break ;
    						case RNG_UNIFORM: _rng_method = "uniform" ; break ;
    						case RNG_NORMAL: _rng_method = "normal" ; break ;
    						case RNG_EXPONENTIAL: _rng_method = "exponential" ; break ;
    					  case RNG_POISSON: _rng_method = "poisson" ; break ;
    						case RNG_GAMMA: _rng_method = "gamma" ; break ;
    						case RNG_MERSENNE_TWISTER: _rng_method = "mersenne" ; break ;
    						case RNG_SINE: _rng_method = "sine" ; break ;
    						case RNG_COMPLEMENTARY_MULTIPLY_WITH_CARRY: _rng_method = "cmwc" ; break ;
    						case RNG_LINEAR_CONGRUENT: _rng_method = "lcg" ; break ;
    						case RNG_MARSAGLIA_ZAMAN: _rng_method = "marz" ; break ;
    						default: _rng_method = "built-in" ; break ;
    				 }

             // arrays are passed / copied by reference in javascript
             var _rf_l = safe_size( _glob_rnd_probability_array, 0 );
             if ( _rf_l > 0 )
             {
                 for( var _p = 0 ; _p < _rf_l ; _p++ )
                 {
                     _glob_rnd_probability_array[_p] = safe_float( _glob_rnd_probability_array[_p], 0.0 );
                     _glob_rnd_probability_array[_p] = _glob_rnd_probability_array[_p].clean_round_off( _glob_accuracy );
                 }

                 var _str = [] ;
                 for( _p = 0 ; _p < _rf_l ; _p++ ) _str.push( _glob_rnd_probability_array[_p] + " " + _glob_gens_set_symbols_map_array[ _glob_gens_set_model_array[_p] ] ) ;
      					 _str = _str.join( " " );

                 var _set_cmd_string = _str + " " + _rng_method ;
                 if ( _glob_rnd_reps_threshold != DEFAULT_RND_REPS_THRESHOLD ) _set_cmd_string += " repsthreshold:" + _glob_rnd_reps_threshold ;
                 if ( _glob_rnd_reps_depth != DEFAULT_RND_REPS_DEPTH ) _set_cmd_string += " repsdepth:" + _glob_rnd_reps_depth ;
                 _set_cmd_string += " force" ;
                 _rows_of_code.push( "probability clean force" );
                 _rows_of_code.push( "probability set " + _set_cmd_string );
             }

             _rows_of_code.push( "probability repsthreshold:" + _glob_rnd_reps_threshold + " repsdepth:" + _glob_rnd_reps_depth );
        }
    }

    var _n_fp = circles_lib_count_fixed_points();
    if ( _n_fp > 0 && _glob_fixedpt_io == FIXEDPOINTS_IO_INPUT )
    {
         _rows_of_code.push( "fp bomb force" );
         $.each( _glob_input_fixed_pts_array,
         function( _i, _chunk )
         {
            var _word = _chunk[0] ;
            var _pt_formula = ( new complex( _chunk[1].x, _chunk[1].y ) ).formula();
            _rows_of_code.push( "fp add " + _pt_formula + " " + _word );
         }
       );
    }

    if ( _glob_terminal_autorefresh && _glob_terminal_autoinit_enable ) _rows_of_code.push( "auto all on" );
    _rows_of_code.push( "auto refresh " + ( _glob_terminal_autorefresh ? "on" : "off" ) );
    _rows_of_code.push( "auto init " + ( _glob_terminal_autoinit_enable ? "on" : "off" ) );

    if ( _settings_array['target_plane_type'] == null )
    {
        var _zplane_side = Math.abs( _glob_zplaneRIGHT - _glob_zplaneLEFT ) ;
        var _zplane_mid_pt_x = ( _glob_zplaneRIGHT + _glob_zplaneLEFT ) / 2.0 ;
        var _zplane_mid_pt_y = ( _glob_zplaneBOTTOM + _glob_zplaneTOP ) / 2.0 ;
        _rows_of_code.push( "zoom zplane ("+_zplane_mid_pt_x+","+_zplane_mid_pt_y+") side:" + _zplane_side + " silent" );

        var _wplane_side = _glob_wplaneRIGHT - _glob_wplaneLEFT ;
        var _wplane_mid_pt_x = ( _glob_wplaneRIGHT + _glob_wplaneLEFT ) / 2.0 ;
        var _wplane_mid_pt_y = ( _glob_wplaneBOTTOM + _glob_wplaneTOP ) / 2.0 ;
        _rows_of_code.push( "zoom wplane ("+_wplane_mid_pt_x+","+_wplane_mid_pt_y+") side:" + _wplane_side + " silent" );
    }
    else if ( _settings_array['target_plane_type'].stricmp( "bip" ) )
    {
        var _bip_side = _glob_bipRIGHT - _glob_bipLEFT ;
        var _bip_mid_pt_x = ( _glob_bipRIGHT + _glob_bipLEFT ) / 2.0 ;
        var _bip_mid_pt_y = ( _glob_bipBOTTOM + _glob_bipTOP ) / 2.0 ;
        _rows_of_code.push( "zoom "+_settings_array['target_plane_type']+" ("+_bip_mid_pt_x+","+_bip_mid_pt_y+") side:" + _bip_side + " silent" );
    }

    if ( _settings_array['target_plane_type'] != null )
    {
        _rows_of_code.push( "refresh "+_settings_array['target_plane_type']+" silent clean" );
    }
    else
    {
        _rows_of_code.push( "refresh zplane silent clean" );
        _rows_of_code.push( "refresh wplane silent clean" );
    }

    return _rows_of_code ;
}

function circles_terminal_cmd_code_5th_step( _opt, _settings_array, _rows_of_code )
{
  	if ( _glob_filter.length > 0 ) _rows_of_code.push( "", "filter:", "[", _glob_filter, "]" );
    return _rows_of_code ;
}