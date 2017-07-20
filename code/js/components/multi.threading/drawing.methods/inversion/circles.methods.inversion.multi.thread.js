function CIRCLESdrawPROCESSbyINVERSIONcountOPERATIONS()
{
    var _count = circles_lib_count_dict();
    if ( _glob_process == PROCESS_RANDOM && _count == 0 ) _count = "(random process not supported)" ;
    else if ( _count == 0 ) _count = "(dictionary compilation required)" ;
    return _count ;
}

function CIRCLESdrawPROCESSbyINVERSION( objs, settings )
{
    _glob_multithread_running = 1 ;
    _glob_to_save = YES;
    _glob_multithread_operations_runner = 0 ;

    var _benchmark_start = microtime(1);
    var _depth = safe_int( settings['depth'], 1 );
    var _config = settings['config'].split( "@" );
    var _method_def = circles_lib_method_get_def( safe_int( _config[0], METHOD_NONE ) );
    var _process_def = circles_lib_process_get_def( safe_int( _config[1], PROCESS_NONE ) );
    var _construction_mode_def = circles_lib_construction_mode_get_def( safe_int( _config[2], CONSTRUCTION_NONE ) );
    var _fixedpoints_io_def = circles_lib_fixedpoints_io_get_def( safe_int( _config[3], FIXEDPOINTS_IO_NONE ) );
    var _disk_visibility_radius = safe_float( settings['disk_visibility_radius'], DEFAULT_VISIBILITY_RADIUS );
    var dict_create = safe_int( settings['dict_create'], YES );
    var dict = is_array( settings['input_dict'] ) ? settings['input_dict'] : settings['input_dict'].split( "@" );
 	  var _current_rect = new rect( settings.left_up_pt.x, settings.left_up_pt.y, settings.right_down_pt.x, settings.right_down_pt.y, _RECT_ORIENTATION_CARTESIAN, "" );

    if ( _glob_multithread_dict_create )
    {
			 self.postMessage( { "id" : "update", "text" : "Params changed: re-computing dictionary" } );
			 _glob_original_dict = CIRCLESunpairedinversionDICTIONARYcreate( objs, settings );
       self.postMessage( { "id" : "ret_dict",
                           "dict" : _glob_original_dict.join( "@" ),
                           "crash_words_packed" : _glob_multithread_crash_words_packed,
                           "depth" : settings['depth']
                         }
                       );
    }
    else
    {
       self.postMessage( { "id" : "update", "text" : "No changes: dictionary remains the same" } );
       _glob_original_dict = dict ;
       self.postMessage( { "id" : "ret_dict",
                           "dict" : _glob_original_dict.join( "@" ),
                           "crash_words_packed" : _glob_multithread_crash_words_packed,
                           "depth" : settings['depth']
                         }
                       );
    }
    
    _glob_multithread_operations_counter = CIRCLESdrawPROCESSbyINVERSIONcountOPERATIONS( settings );
    self.postMessage( { "id" : "append", "text" : _glob_multithread_operations_counter + " circle" + ( _glob_multithread_operations_counter == 1 ? "" : "s" ) } );
    self.postMessage( { "id" : "update", "text" : "["+_glob_multithread_working_plane_def+"] - " + _method_def + " / " + _process_def + " / " + _construction_mode_def + " / " + _fixedpoints_io_def } );
    var G = null, GM = null, complex_circle = null, runner = 0 ;
    var _items_array = objs['items'] ;
    var W, obj, i, _O = circles_lib_count_dict();
    var WORD, INDEX, complex_circle, first_complex_circle ;
    var pts_array = [], words_array = [], circles_array = [];
    var _bunch_limit = _glob_multithread_bunch_limit, _bunch_counter = 0 ;

    // resolving repetends
    var _keys = _glob_multithread_repetends_array.keys_associative();
    var _keys_len = safe_size( _keys, 0 ), _i, _k, _rep_index = 0 ;
    var _len_array = [], _indexes_array = [] ;
    if ( _keys_len > 0 )
    {
         self.postMessage( { "id" : "update", "text" : "Resolving repetends" } );
         for( _k = 0 ; _k < _keys_len ; _k++ )
         {
           		_indexes_array[ _keys[_k] ] = 0 ;
					    for( _i = 0 ; _i < _glob_multithread_repetends_array[ _keys[_k] ].length ; _i++ )
							_glob_multithread_repetends_array[ _keys[_k] ][_i] = circles_lib_repetends_resolve( _glob_multithread_repetends_array[ _keys[_k] ][_i] );
				 }

         for( _k = 0 ; _k < _keys_len ; _k++ ) _len_array[ _keys[_k] ] = _glob_multithread_repetends_array[ _keys[_k] ].length ;
    }
              
    // configure repetends function handler
    var reps_apply_fn, _r, _last ;
    if ( _keys_len > 0 )
    reps_apply_fn = function( WORD )
                    {
                     		_last = WORD.lastchar();
                     		if ( _glob_multithread_repetends_array[ _last ] != null )
                     		{
		                     		WORD += _glob_multithread_repetends_array[ _last ][ _indexes_array[ _last ] ] ;
		                     		_indexes_array[ _last ] = _indexes_array[ _last ] + 1 ;
		                     		_indexes_array[ _last ] = _indexes_array[ _last ] % _len_array[ _last ] ;
										    }
                        return WORD ;
                    } ;
    else reps_apply_fn = function( WORD ) { return WORD ; } ;

    _glob_multithread_operations_runner = 0 ;
    _glob_multithread_dictionary_obj.sliced_dictionary = _glob_original_dict ;
    _glob_multithread_operations_counter = _glob_multithread_dictionary_obj.sliced_dict_size();

    while( ( WORD = _glob_multithread_dictionary_obj.sliced_dict_read_runner() ) != "" )
    {
         if ( !_glob_multithread_running ) break ;
         _found_repetends_index = _glob_multithread_symbols_index_array[WORD.lastchar()] ;
         if ( WORD.length == _depth && _keys_len > 0 ) WORD = reps_apply_fn( WORD );

         _glob_multithread_operations_runner++ ;
         INDEX = _glob_multithread_symbols_index_array[ WORD[0] ] ;
         first_complex_circle = complex_circle = _items_array[INDEX].complex_circle ;
         // computing current word
         for( runner = 1 ; runner < WORD.length ; runner++ )
         {
             INDEX = _glob_multithread_symbols_index_array[ WORD[runner] ] ;
             complex_circle = _items_array[INDEX].map.invert_circle( complex_circle );
         }

         if ( ( _current_rect.is_pt_inside( complex_circle.center.x + complex_circle.radius, complex_circle.center.y ) ||
                _current_rect.is_pt_inside( complex_circle.center.x - complex_circle.radius, complex_circle.center.y ) ||
                _current_rect.is_pt_inside( complex_circle.center.x, complex_circle.center.y + complex_circle.radius ) ||
                _current_rect.is_pt_inside( complex_circle.center.x, complex_circle.center.y - complex_circle.radius ) ) &&
                complex_circle.radius > 0 && complex_circle.radius > _disk_visibility_radius )
         {
             _bunch_counter++ ;
             pts_array.push( new point( complex_circle.center.x, complex_circle.center.y,
             														_POINT_2D_CLS_EUCLIDEAN_ENV,
             														_items_array[INDEX].complex_circle.drawcolor,
             														_items_array[INDEX].complex_circle.fillcolor,
             														_items_array[INDEX].complex_circle.linewidth
						 													) );
             words_array.push( WORD );
             circles_array.push( complex_circle );
             if ( _bunch_counter == _bunch_limit )
             {
                 obj = { 'circles_array' : circles_array,
                         'pts_array' : pts_array,
                         'words_array' : words_array,
                         'draw_fn_id' : 2.2,
                         'counter' : _glob_multithread_operations_counter,
                         'runner' : _glob_multithread_operations_runner
                       } ;

                 self.postMessage( { 'id' : "draw",
                                     'obj' : obj
                                   } );

                 _bunch_counter = 0 ;
      					 pts_array.flush();
                 words_array.flush();
                 circles_array.flush();
             }
        }
    }

    obj = { 'circles_array' : circles_array,
            'pts_array' : pts_array,
            'words_array' : words_array,
            'draw_fn_id' : 2.2,
            'counter' : _glob_multithread_operations_counter,
            'runner' : _glob_multithread_operations_runner
          } ;

    self.postMessage( { 'id' : "draw",
                        'obj' : obj
                      } );

    var _benchmark_end = microtime(1);
    self.postMessage( { 'id': "benchmark",
                        'start': _benchmark_start,
                        'end': _benchmark_end,
                        'operations' : circles_lib_count_dict()
                      } );
}