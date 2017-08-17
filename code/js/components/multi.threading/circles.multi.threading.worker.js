function CIRCLESmultithreadingPROCESSdictionary( _options_chunk, _silent, _out_channel )
{
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    return CIRCLESmultithreadingINITworker( [ MULTITHREADING_OBJ_WORKAREA_DICTIONARY,
                                              _options_chunk, _silent, _out_channel
                                            ] );
}

function CIRCLESmultithreadingPROCESSwindowresize( _options_chunk, _silent, _out_channel )
{
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    return CIRCLESmultithreadingINITworker( [ MULTITHREADING_OBJ_WORKAREA_CANVAS_REDRAWING,
                                            _options_chunk, _silent, _out_channel
                                            ] );
}

function CIRCLESmultithreadingPROCESSrendering( canvas, mapper, method, _process, _fixedpts_io, _working_plane, _silent, _out_channel )
{
    _working_plane = safe_int( _working_plane, _glob_target_plane != NO_PLANE ? _glob_target_plane : W_PLANE );
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
		if ( _working_plane > 0 )
    return CIRCLESmultithreadingINITworker( [ MULTITHREADING_OBJ_WORKAREA_RENDERING,
                                            [ method, _process, _fixedpts_io, _working_plane, canvas, mapper ],
                                            _silent, _out_channel
                                            ] );
    else return [ RET_ERROR, "It's impossible to start-up the rendering process: no plane selected yet" ] ;
}

function CIRCLESmultithreadingSTOPworker( _silent )
{
    _silent = safe_int( _silent, NO );
		if ( !_glob_worker_lock ) return ;
		
    _glob_worker.postMessage( { 'id' : 'stop' } );
    _glob_worker.terminate();
    _glob_worker_lock = NO ;
    circles_lib_progressbar_div_show( NO );
    circles_lib_progressbar_div_write_label( "Stopped by user" );
    
    if ( !_silent )
    {
        alert_plug_label( ALERT_OK, "Close" ) ;
        alert_set_btns_width( 70 ) ;
        circles_lib_output( OUTPUT_SCREEN, DISPATCH_HALT, "Current process has been stopped by user", _glob_app_title );
    }

    var BTN = $( "#refreshWPLANEbtn" ).get(0);
    if ( BTN != null ) BTN.disabled = NO ;

    $("[id$=renderBTN]").css( "color", DEFAULT_COLOR_STD );
    $("[id$=renderBTN]").filter( function(){ return !this.id.start_with( "PLUGIN" ) } ).attr( "class", "link_rounded" );
    $("[id$=stopBTN]").css( "color", DEFAULT_EDIT_COLOR_DISABLED );
    _glob_toSAVE = _glob_process_running_flag = NO ;

    if ( _glob_inline_worker != null )
    {
      _glob_inline_worker.stop();
      _glob_inline_worker = null ;
    }

    if ( _glob_last_pt && _glob_scheduled_rendering_timer )
    {
      clearTimeout( _glob_scheduled_rendering_timer );
      _glob_scheduled_rendering_timer = setTimeout( function() { circles_lib_canvas_process_ask( NO, YES, _glob_bip_use?BIP_BOX:_glob_target_plane, YES, _glob_use_last_pt ? NO : YES, CHECK, null, OUTPUT_SCREEN ) ; }, _glob_scheduled_rendering_interval * 60 * 1000 );
    }
}

function CIRCLESmultithreadingPOSTMESSAGEworker( msg_id )
{
    if ( _glob_worker != null ) _glob_worker.postMessage( { 'id' : msg_id } );
    if ( _glob_inline_worker != null )
    {
      _glob_inline_worker.stop();
      _glob_inline_worker = null ;
    }
}

function CIRCLESmultithreadingPREcheck()
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _ret = YES, _item, _items_n = circles_lib_count_items(_items_array), _i ;
    for( _i = 0 ; _i < _items_n ; _i++ )
    {
      _item = _items_array[_i] ;
      if ( !is_item_obj( _item ) ) { _ret = -1 ; break ; }
      else if ( _item.symbol.length == 0 ) { _ret = -2 ; break ; }
      else if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) && _item.inverse_symbol.length == 0 ) { _ret = -3 ; break ; }
      else if ( !is_mobius_map( _item.map ) ) { _ret = -4 ; break ; }
      else if ( !is_complex( _item.map.a ) || !is_complex( _item.map.a ) || !is_complex( _item.map.c ) || !is_complex( _item.map.d ) ) { _ret = -5 ; break ; }
    }

    if ( circles_lib_count_dict() == 0 && !_glob_dict_create &&
         _glob_method == METHOD_ALGEBRAIC && _glob_process == PROCESS_BREADTHFIRST )
    _ret = -6 ;

    if ( _glob_dict_processor.get_process() == _DICTIONARY_AUTOMATON_PROCESS &&
         _glob_dict_processor.automaton_keys_count() == 0 )
    _ret = -7 ;
     
    return _ret ;
}

function CIRCLESmultithreadingINITworker( _input_chunk )
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _startINDEX = 0 ;
    var _workarea = safe_float( _input_chunk[ _startINDEX ], 0 );
        _startINDEX++ ;
 		var _options_chunk = _input_chunk[ _startINDEX ] ;
        _startINDEX++ ;
 		var _silent = safe_int( _input_chunk[ _startINDEX ], NO );
        _startINDEX++ ;
 		var _out_channel = safe_int( _input_chunk[ _startINDEX ], OUTPUT_SCREEN );
    var _items_n = circles_lib_count_items();
    var _pre_check_ret = CIRCLESmultithreadingPREcheck();
    if ( _workarea == MULTITHREADING_OBJ_WORKAREA_NONE )
    {
       var _msg = "This multi-tasking thread initialization has failed: missing workarea." ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ] ;
    }
    else if ( _pre_check_ret < 0 )
    {
       var _msg = "" ;
       if ( _pre_check_ret < 0 && _pre_check_ret >= -5 ) _msg = "Errors found in items data." + _glob_crlf + "Please, init them again and retry the rendering" ;
       else if ( _pre_check_ret == -6 ) _msg = "The current dictionary is empty." + _glob_crlf + "Please, check both symbols and dict filters, then try to build it again" ;
       else if ( _pre_check_ret == -7 ) _msg = "The automaton table is empty." ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ] ;
    }
		else if ( _workarea == MULTITHREADING_OBJ_WORKAREA_RENDERING ) // rendering
    {
       _glob_worker = new Worker( "code/js/components/multi.threading/circles.multi.threading.worker.drawing.core.js" );
 			 CIRCLESmultithreadingADDdrawingLISTENER();

       _startINDEX = 0 ;
       circles_lib_progressbar_div_show_element( "PROGRESSbarDIVcloseICON", YES );
       circles_lib_progressbar_div_show_element( "PROGRESSBARdivEXTRAS", YES );
       circles_lib_progressbar_div_show( YES );

       var PROGRESSbarDIVappend = $( "#PROGRESSbarDIVappend" ).get(0);
       var _canvas_w = 0, _canvas_h = 0 ;
  		 var _method = safe_int( _options_chunk[ _startINDEX ], METHOD_NONE );
           _startINDEX++ ;
  		 var _process = safe_int( _options_chunk[ _startINDEX ], PROCESS_NONE );
           _startINDEX++ ;
  		 var _fixedpts_io = safe_int( _options_chunk[ _startINDEX ], FIXEDPOINTS_IO_INPUT );
           _startINDEX++ ;
  		 var _working_plane = safe_int( _options_chunk[ _startINDEX ], _glob_target_plane );
           _startINDEX++ ;
  		 var _canvas = _options_chunk[ _startINDEX ];     if ( !is_html_canvas( _canvas ) ) _canvas = _glob_wplane_rendering_canvas_placeholder ;
           _startINDEX++ ;
  		 var _mapper = _options_chunk[ _startINDEX ];
       
 			 var _depth = safe_int( _glob_depth, 1 );
 			 
 			 if ( _glob_process == PROCESS_BREADTHFIRST &&
            circles_lib_plugin_find_index( { base_id : 'dictionary' }, POPUP_SEARCH_BY_BASE_ID ) != UNFOUND )
 			 circles_lib_plugin_dispatcher_unicast_message( 'dictionary', "forms", 3 );

       _glob_symbols_index_array = circles_lib_symbol_get_indexes_mapping_array( null,  NO );
       if ( !_glob_use_last_pt ) _glob_rec_canvas_entities_array = [] ;
       var _tmp_array = [];
       for( var _key in _glob_symbols_index_array )
       {
         if ( _glob_symbols_index_array.hasOwnProperty( _key ) )
         _tmp_array.push( _key + "|" + _glob_symbols_index_array[_key] );
       }
		        
 			 switch( _working_plane )
			 {
				 case Z_PLANE:
				 _glob_opacity = $( "#"+_glob_zplane_rendering_canvas_placeholder.get_iddiv() ).get(0).style.opacity ;
         _canvas_w = is_html_canvas( _glob_zplane_rendering_canvas_placeholder ) ? _glob_zplane_rendering_canvas_placeholder.get_width() : 0 ;
         _canvas_h = is_html_canvas( _glob_zplane_rendering_canvas_placeholder) ? _glob_zplane_rendering_canvas_placeholder.get_height() : 0 ;
         _glob_multithread_canvas = _glob_zplane_rendering_canvas_placeholder ;
         _glob_multithread_mapper = zplane_sm.copy() ;
         _glob_multithread_pixelsize = 1 ;
				 break ;
				 case W_PLANE:
				 _glob_opacity = $( "#"+_glob_wplane_rendering_canvas_placeholder.get_iddiv() ).get(0).style.opacity ;
         _canvas_w = is_html_canvas( _glob_wplane_rendering_canvas_placeholder ) ? _glob_wplane_rendering_canvas_placeholder.get_width() : 0 ;
         _canvas_h = is_html_canvas( _glob_wplane_rendering_canvas_placeholder ) ? _glob_wplane_rendering_canvas_placeholder.get_height() : 0 ;
         _glob_multithread_canvas = _glob_wplane_rendering_canvas_placeholder ;
         _glob_multithread_mapper = wplane_sm.copy() ;
         _glob_multithread_pixelsize = 1 ;
				 break ;
				 case BIP_BOX:
				 _glob_opacity = _glob_bip_opacity ;
         _canvas_w = is_html_canvas( _glob_bip_canvas ) ? _glob_bip_canvas.get_width() : 0 ;
         _canvas_h = is_html_canvas( _glob_bip_canvas ) ? _glob_bip_canvas.get_height() : 0 ;
         _glob_multithread_canvas = _glob_bip_canvas ;
         _glob_multithread_mapper = bipbox_sm.copy() ;
         _glob_multithread_pixelsize = _glob_bip_pixel_size ;
				 break ;
         case CUSTOM_PLANE:
				 _glob_opacity = DEFAULT_OPACITY ;
         _canvas_w = is_html_canvas( _canvas ) ? _canvas.get_width() : 0 ;
         _canvas_h = is_html_canvas( _canvas ) ? _canvas.get_height() : 0 ;
         _glob_multithread_canvas = _canvas ;
         _glob_multithread_mapper = _mapper.copy() ;
         _glob_multithread_pixelsize = 1 ;
				 break ;
	       default: break ;
 			 }
 			 
       if ( _working_plane.is_one_of( NO_PLANE, ALL_PLANES ) )
       {
         circles_lib_progressbar_div_show( NO );
         var _MSG = "Can't run the rendering process." + _glob_crlf.repeat(2) ;
             _MSG += "Plane selection has been previously switched to : <b>" + circles_lib_plane_get_def( _working_plane ) + "</b>" + _glob_crlf ;
             _MSG += "and thus rendering destination is not well determined." + _glob_crlf.repeat(2) ;
             _MSG += "Please, select the destination plane from buttons below" ;
                
         if ( _out_channel == OUTPUT_SCREEN )
         {
           alert_set_btns_width( 70 );
           alert_plug_label( ALERT_YES, "W-plane" );
           alert_plug_label( ALERT_NO, "Bip plane" );
           alert_plug_fn( ALERT_YES, "_glob_target_plane=W_PLANE;alertCLOSE();CIRCLESmultithreadingPROCESSrendering( null, wplane_sm, _glob_method, _glob_process, _glob_target_plane );" );
           alert_plug_fn( ALERT_NO, "_glob_target_plane=BIP_BOX;_glob_bip_use=YES;alertCLOSE();CIRCLESmultithreadingPROCESSrendering( null, bipbox_sm, _glob_method, _glob_process, _glob_target_plane );" );
           alert_plug_fn( ALERT_CANCEL, "alertCLOSE();" );
           circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING | DISPATCH_YESNOCANCEL, _MSG, _glob_app_title );
         }
            
         return [ RET_ERROR, _MSG ] ;
       }
       else
       {
         _glob_multithread_context = is_html_canvas( _glob_multithread_canvas ) ? _glob_multithread_canvas.getContext( _glob_canvas_ctx_2D_mode ) : null ;
         _glob_worker.postMessage( { 'id' : 'init', 'action' : 0,
 																	   'method' : _method, 'process' : _process, 'lang' : LANG,
                                     'w' : _canvas_w, 'h' : _canvas_h } );
  		   var _probability_array_pack = _glob_rnd_probability_array.join( "@" );
         var _dict_init_settings = _dictionary_init_settings_array.join_associative( "@" );
         _glob_process_running_flag = YES ;
         _glob_rec_canvas_entities_array.flush_associative();
         if ( _glob_export_format == EXPORT_SVG ) _svg_comment( _glob_export_code_array, "RENDERING THE CURRENT CONFIGURATION" );
         circles_lib_items_switch_to( circles_lib_gens_model_exists() ? ITEMS_SWITCH_GENS : ITEMS_SWITCH_SEEDS, YES, _out_channel );
			   _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
         $("[id$=renderBTN]").filter( function(){ return !this.id.start_with( "PLUGIN" ) } ).attr( "class", "link_rounded_dead" );
         $("[id$=renderBTN]").css( { "color" : "#D0D0D0" } );
         $("#STATUSBARstopBTN").css( { "color" : DEFAULT_COLOR_STD } );

				 var _fz_formula = safe_string( _glob_volatile_settings['fz.formula.packed'], "" ) ;
         var _dict = _glob_dict_processor.sliced_dictionary ;
         var _reps_array = [], _reps_keys = _glob_repetends_array.keys_associative();
         if ( !is_array( _reps_keys ) ) _reps_keys = [];
         for( var _k = 0 ; _k < _reps_keys.length ; _k++ )
         {
           _glob_repetends_array[ _reps_keys[_k] ] = _glob_repetends_array[ _reps_keys[_k] ].sort( function(a, b){ return b.length - a.length; /* ASC -> a - b; DESC -> b - a */ } );
	         $.each( _glob_repetends_array[ _reps_keys[_k] ], function( _i, _rep ) { _reps_array.push( _reps_keys[_k]+"@"+_rep ); } );
				 }
         var _reps = safe_size( _reps_array, 0 ) > 0 ? _reps_array.join( "|" ) : "" ;
         var inputfixedpts = [], _fp_n = circles_lib_count_fixed_points();
         if ( _glob_use_last_pt )
         {
            if ( _fp_n == 0 ) // default filling of the array through the fixed points of the seeds
            {
              var GM, _fp_array, _type ;
              for( var _z = 0 ; _z < _items_n ; _z++ )
              {
                GM = _glob_seeds_array[_z].map, _fp_array = GM.fixed_points();
                if ( is_complex( _fp_array[0] ) )
                {
                  _type = FIXEDPOINT_NONE ;
                  if ( GM.is_sink_pt( _fp_array[0] ) ) _type = FIXEDPOINT_SINK ;
                  else if ( GM.is_source_pt( _fp_array[0] ) ) _type = FIXEDPOINT_SOURCE ;
                  else _type = FIXEDPOINT_NEUTRAL ;
                  _glob_input_fixed_pts_array.push( [ _glob_seeds_array[_z].symbol, new point( _fp_array[0].real, _fp_array[0].imag ), _type, "HASH"+_glob_input_fixed_pts_array.length ] );
                  inputfixedpts.push( new point( _fp_array[0].real, _fp_array[0].imag ) );
                }
                    
                if ( is_complex( _fp_array[1] ) )
                {
                  _type = FIXEDPOINT_NONE ;
                  if ( GM.is_sink_pt( _fp_array[1] ) ) _type = FIXEDPOINT_SINK ;
                  else if ( GM.is_source_pt( _fp_array[1] ) ) _type = FIXEDPOINT_SOURCE ;
                  else _type = FIXEDPOINT_NEUTRAL ;
                  _glob_input_fixed_pts_array.push( [ _glob_seeds_array[_z].symbol, new point( _fp_array[1].real, _fp_array[1].imag ), _type, "HASH"+_glob_input_fixed_pts_array.length ] );
                  inputfixedpts.push( new point( _fp_array[1].real, _fp_array[1].imag ) );
                }
              }
            }
            else for( var _i = 0 ; _i < _fp_n ; _i++ ) inputfixedpts.push( _glob_input_fixed_pts_array[_i][1] );
         }
         
         clearTimeout( _glob_scheduled_rendering_timer );
         
         // init anti-homography masks
         var _anti_homography_mask_keys = _glob_items_anti_homography_mask_map.keys_associative(), _mask, _mm_index ;
         if ( is_array( _anti_homography_mask_keys ) )
         {
             $.each( _anti_homography_mask_keys, function( _i, _symbol )
                     {
                        _mm_index = circles_lib_find_item_index_by_symbol( _items_array, _symbol ) ;
                        if ( _mm_index != UNFOUND )
                        {
                           _mask = _glob_items_anti_homography_mask_map[ _symbol ] ;
                           _items_array[_mm_index].map.set_anti_homography_mask( _mask );
                        }
                     } ) ;
         }
         
         var _json = { 'id' : 'start',
            'accuracy' : _glob_accuracy,
            'alphabet_packed' : _glob_alphabet.join( "@" ),
            'callerid' : _caller_id,
            'canvas_size' : [ _glob_multithread_canvas.get_width(), _glob_multithread_canvas.get_height() ],
            'config' : circles_lib_config_options_get().join( "@" ),
            'depth' : _depth,
            'dict' : _dict,
            'dictionary' : _glob_dict_processor,
            'dict_create' : _glob_dict_create,
            'dict_init_settings' : _dict_init_settings,
            'dict_process' : _glob_dict_processor.get_process(),
            'disk_visibility_radius' : _glob_disk_visibility_radius,
            'dist_tolerance' : _glob_distance_tolerance,
            'drawentity' : _glob_drawentity,
            'fz_formula' : _fz_formula,
            'gens_model' : _glob_gens_set_model_array,
            'gens_symbols_map' : _glob_gens_set_symbols_map_array.swap_keys_vals_associative(),
            'inputfixedpts' : inputfixedpts,
            'items': _items_array,
            'symbols_index_array' : _tmp_array.join( "@" ),
            'lang' : LANG,
            'last_pt' : _glob_last_pt,
            'left_up_pt' : ( _glob_multithread_mapper.get_coords_corners() )['lu'],
            'operations_mask' : _glob_options_mask,
            'probability_pack' : _probability_array_pack,
            'probability_rng_method' : _glob_probabilityRNGmethod,
            'repetends' : _reps,
            'rnd_warmup' : _glob_rnd_warmup,
            'rnd_reps_threshold' : _glob_rnd_reps_threshold,
            'rnd_reps_depth' : _glob_rnd_reps_depth,
            'right_down_pt' : ( _glob_multithread_mapper.get_coords_corners() )['rd'],
            'use_last_pt' : _glob_use_last_pt,
            'workingplane_def' : circles_lib_plane_get_def( _working_plane ) } ;
  		   _glob_worker.postMessage( _json );

         if ( _glob_dict_check != SKIP ) _glob_dict_create = NO ;
         return [ RET_OK, "Rendering in action" ] ;
       }
		}
		else if ( _workarea == MULTITHREADING_OBJ_WORKAREA_DICTIONARY ) // dictionary operations
		{
		   _glob_worker = new Worker( "code/js/components/multi.threading/circles.multi.threading.worker.dictionary.core.js" );
 			 CIRCLESmultithreadingADDresizingLISTENER();
			 _startINDEX = 0;
       _glob_process_running_flag = YES ;
       var _caller_id = _options_chunk[ _startINDEX ] ;
			 _startINDEX++ ;
       _opcode = safe_float( _options_chunk[ _startINDEX ], 0 );

			 CIRCLESmultithreadingADDdictionaryLISTENER();
			 var _msg = "" ;
			 if( _opcode == 0.1 ) _msg = "Building the dictionary" ;
			 else if ( _opcode >= 1.1 && _opcode <= 3.3 ) _msg = "Filtering the dictionary" ;
			 else if( _opcode == 4.0 ) _msg = "Inversion of the dictionary" ;
			 else _msg = "Unknown operation" ;

 			 if ( _out_channel == OUTPUT_SCREEN )
       {
           var HTMLcode = "<table STYLE=\"background-color:white;width:100%;\" ALIGN=\"center\">" ;
							 HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
    					 HTMLcode += "<tr><td WIDTH=\"15\"></td><td VALIGN=\"top\"><IMG SRC=\""+_glob_path_to_support+"img/wait/wait.animated.gif\"></td><td WIDTH=\"25\"></td><td VALIGN=\"middle\">"+_msg+"</td></tr>" ;
							 HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
							 HTMLcode += "<tr><td COLSPAN=\"3\" ALIGN=\"center\"><INPUT TYPE=\"button\" VALUE=\"Stop process\" ONCLICK=\"javascript:_glob_process_running_flag=NO;CIRCLESmultithreadingPOSTMESSAGEworker( 'stop' );\"></td></tr>" ;
    					 HTMLcode += "</table>" ;
    			 SPLASH( HTMLcode, SHOW, 480, 180 );
       }
       else circles_lib_output( _out_channel, DISPATCH_INFO, _msg, "" );
						
			 _glob_worker_lock = YES ;
       
			 if ( _opcode.is_one_of( 0.1 ) )
			 {
						_startINDEX++ ;
						var _depth = safe_int( _options_chunk[ _startINDEX ], 1 );
						_startINDEX++ ;
						var _method = safe_int( _options_chunk[ _startINDEX ], 1 );
						_startINDEX++ ;
						var _packed_alphabet = _options_chunk[ _startINDEX ] ;
						_startINDEX++ ;
						var _dict = _options_chunk[ _startINDEX ] ;
						var _word_type = _method.is_one_of( METHOD_ALGEBRAIC ) ? YES : NO ;
            var _dict_init_settings = _dictionary_init_settings_array.join_associative( "@" );
						_glob_worker.postMessage( { 'id' : 'start',
     		                                'callerid' : _caller_id,
						                            'workarea' : _workarea,
						                            'opcode' : _opcode,
						                            'method' : _method,
						                            'process' : _glob_process,
							                          'wordtype' : _word_type,
							                          'constructionmode': _glob_construction_mode, 
							                          'depth' : _depth,
				  		                          'dictionary' : _glob_dict_processor,
          		                          'dict_process' : _glob_dict_processor.get_process(),
				  		                          'dict' : _dict,
                                        'dict_init_settings' : _dict_init_settings,
							                          'packedalphabet' : _packed_alphabet
				  			                      } );
				}
				else if ( _opcode >= 1.1 && _opcode <= 3.3 )
			  {
             _startINDEX++ ;
						 var _action_id = _options_chunk[ _startINDEX ];
						 _startINDEX++ ;
						 var _length_from = _options_chunk[ _startINDEX ] ;
						 _startINDEX++ ;
						 var _length_to = _options_chunk[ _startINDEX ] ;
						 _startINDEX++ ;
						 var _first_n = _options_chunk[ _startINDEX ] ;
						 _startINDEX++ ;
						 var _last_n = _options_chunk[ _startINDEX ] ;
						 _startINDEX++ ;
						 var _start_with = _options_chunk[ _startINDEX ] ;
						 _startINDEX++ ;
						 var _includes = _options_chunk[ _startINDEX ] ;
						 _startINDEX++ ;
						 var _end_with = _options_chunk[ _startINDEX ] ;
						 _startINDEX++ ;
						 var _dict = _options_chunk[ _startINDEX ] ;
				     _glob_worker.postMessage( { 'id' : 'start',
      		                               'callerid' : _caller_id,
						                             'workarea' : _workarea,
						                             'opcode' : _opcode,
						                             'actionid' : _action_id,
						                             'lengthfrom' : _length_from,
						                             'lengthto' : _length_to,
						                             'first_n' : _first_n,
						                             'last_n' : _last_n,
						                             'start_with' : _start_with,
						                             'includes' : _includes,
						                             'end_with' : _end_with,
				  	                             'dict' : _dict
				  	                           } );
				}
				else if ( _opcode == 4 )
			  {
						_startINDEX++ ;
						var _depth = safe_int( _options_chunk[ _startINDEX ], 1 );
						_startINDEX++ ;
						var _method = safe_int( _options_chunk[ _startINDEX ], 1 );
						_startINDEX++ ;
						var _packed_alphabet = _options_chunk[ _startINDEX ] ;
						_startINDEX++ ;
						var _dict = _options_chunk[ _startINDEX ] ;
				    _glob_worker.postMessage( { 'id' : 'start',
      		                              'callerid' : _caller_id,
						                            'workarea' : _workarea,
						                            'opcode' : _opcode,
						                            'actionid' : _action_id,
				  	                            'dict' : _dict
				  	                          } );
			  }

        return [ RET_OK, "Processing the dictionary" ] ;
		}
    else if ( _workarea == MULTITHREADING_OBJ_WORKAREA_CANVAS_REDRAWING )
    {
				var _plane_type = safe_int( _options_chunk[ 'plane_type' ], NO_PLANE );
				var _canvas_id = safe_string( _options_chunk[ 'canvas_id' ], "" );
        var _canvas = $( "#" + _canvas_id ).get(0) ;
        if ( is_html_canvas( _canvas ) )
        {
            _glob_process_running_flag = YES ;
     			  _glob_worker_lock = YES ;
    		    _glob_worker = new Worker( "code/js/components/multi.threading/circles.multi.threading.worker.resizing.core.js" );
    			  CIRCLESmultithreadingADDresizingLISTENER();

     			  if ( _out_channel == OUTPUT_SCREEN )
            {
               var HTMLcode = "<table STYLE=\"background-color:white;width:100%;\" ALIGN=\"center\" BORDER=\"0\">" ;
 							 HTMLcode += "<tr><td HEIGHT=\"20\"></td></tr>" ;
     					 HTMLcode += "<tr><td ROWSPAN=\"6\" WIDTH=\"25\"></td>" ;
     					 HTMLcode += "<td VALIGN=\"top\" ROWSPAN=\"6\"><IMG SRC=\""+_glob_path_to_support+"img/wait/wait.animated.gif\"></td>" ;
     					 HTMLcode += "<td ROWSPAN=\"6\" WIDTH=\"15\"></td>" ;
     					 HTMLcode += "<td VALIGN=\"middle\" ALIGN=\"center\" STYLE=\"font-size:16pt;color:#343434;\" ID=\"CIRCLESmultitaskingREDRAWsplashACTIONlabel\">"+_options_chunk['process_title']+"</td></tr>" ;
 							 HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
     					 HTMLcode += "<tr><td VALIGN=\"middle\" ALIGN=\"center\" HEIGHT=\"30\" STYLE=\"font-size:16pt;color:#343434;\" ID=\"CIRCLESmultitaskingREDRAWsplashPROGRESSlabel\"></td></tr>" ;
 							 HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
 							 HTMLcode += "<tr><td ALIGN=\"center\"><INPUT TYPE=\"button\" STYLE=\"height:26px;width:110px;\" VALUE=\"Stop process\" ONCLICK=\"javascript:_glob_process_running_flag=NO;CIRCLESmultithreadingPOSTMESSAGEworker( 'stop' );\"></td></tr>" ;
 							 HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
     					 HTMLcode += "</table>" ;
       			   SPLASH( HTMLcode, SHOW, 380, 150 );
            }
            else circles_lib_output( _out_channel, DISPATCH_INFO, _msg, "Resizing stage 1/2" );

    		    _glob_worker.postMessage( { 'id' : 'init' } ) ;

    				var _left_up_pt = _options_chunk[ 'left_up_pt' ] ;
    				var _right_down_pt = _options_chunk[ 'right_down_pt' ] ;
    				var _entities_array = _options_chunk[ 'entities_array' ] ;
    				var _canvas_dims = _options_chunk[ 'canvas_dims' ] ;
    		    _glob_worker.postMessage( { 'id' : 'start',
       		                              'callerid' : _caller_id,
                                        'plane_type' : _plane_type,
    				                            'workarea' : _workarea,
    			                              'canvas_id' : _canvas_id,
    				  	                        'left_up_pt' : _left_up_pt,
    				  	                        'right_down_pt' : _right_down_pt,
    				  	                        'entities_array' : _entities_array,
                                        'drawentity' : _glob_drawentity,
                                        'canvas_dims' : _canvas_dims,
                                        'process_title' : _options_chunk['process_title']
    				  	                      } );
            return [ RET_OK,_options_chunk['process_title'] ] ;
        }
        else return [ RET_ERROR, "Fail while resizing canvas" ] ;
    }
    else return [ RET_OK, "Invalid workarea" ] ;
}