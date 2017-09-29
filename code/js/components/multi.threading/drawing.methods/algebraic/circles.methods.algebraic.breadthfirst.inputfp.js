function CIRCLESalgebraicPROCESSdeterministicBREADTHFIRSTfixedpointsinput( objs, settings )
{
     var _items_array = objs['items'], _items_n = safe_size( _items_array, 0 );
     if ( _items_n > 0 )
     {
        if ( circles_lib_symbol_check_group( _items_array ) == GROUP_TEST_ERR_OK )
        {
           var _gens_model = settings['gens_model'] ;
           var _gens_symbols_map = settings['gens_symbols_map'] ;
           var left_up_pt = settings.left_up_pt, right_down_pt = settings.right_down_pt ;
					 var _current_region = new rect( left_up_pt.x, left_up_pt.y, right_down_pt.x, right_down_pt.y, _RECT_ORIENTATION_CARTESIAN, "" );
					 var _benchmark_start = microtime(1), _input_fixed_pts = [] ;
           var _tmp_input_fixed_pts = settings['inputfixedpts'].split( "|" ), _tmp_pt ;
           for( var _t = 0 ; _t < _tmp_input_fixed_pts.length ; _t++ )
           {
              _tmp_pt = _tmp_input_fixed_pts[_t].split( "@" );
              _input_fixed_pts.push( new complex( safe_float( _tmp_pt[0] ), safe_float( _tmp_pt[1] ) ) );
           }

           var _drawentity = safe_int( settings['drawentity'], DRAWENTITY_ISOMETRIC_CIRCLE );
           var _depth = safe_int( settings['depth'], 1 );
           var _config = settings['config'].split( "@" );
           var _method_def = circles_lib_method_get_def( safe_int( _config[0], _glob_method ) );
           var _process_def = circles_lib_process_get_def( safe_int( _config[1], PROCESS_NONE ) );
           var _construction_mode_def = circles_lib_construction_mode_get_def( safe_int( _config[2], CONSTRUCTION_NONE ) );
           var _fixedpoints_io_def = circles_lib_fixedpoints_io_get_def( safe_int( _config[3], FIXEDPOINTS_IO_NONE ) );
           var dict_create = safe_int( settings['dict_create'], YES );
           var dict = settings['input_dict'] ;
					 if ( dict_create )
					 {
						 self.postMessage( { "id" : "update", "text" : "Params changed: re-computing the dictionary" } );
 					   _glob_original_dict = dict_create ? CIRCLESalgebraicDICTIONARYcreate( objs, settings ) : dict ;
	           self.postMessage( { "id" : "ret_dict",
		                             "dict" : _glob_original_dict.join( "@" ),
                                 "crash_words_packed" : _glob_multithread_crash_words_packed,
		                             "depth" : settings['depth']
		                           } );
					 }
					 else
					 {
				     _glob_original_dict = dict ;
				     self.postMessage( { "id" : "update", "text" : "No changes: dictionary has been kept up" } );
				     self.postMessage( { "id" : "ret_dict",
				                         "dict" : _glob_original_dict.join( "@" ),
                                 "crash_words_packed" : _glob_multithread_crash_words_packed,
				                         "depth" : settings['depth']
				                        } );
					 }

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
              self.postMessage( { "id" : "append", "text" : _glob_multithread_operations_counter + " operations" } );
              
              if ( _glob_multithread_operations_counter > 0 )
              {
                    self.postMessage( { "id" : "update", "text" : "["+_glob_multithread_working_plane_def+"] - " + _method_def + " / " + _process_def + " / " + _construction_mode_def + " / " + _fixedpoints_io_def } );

                    var WORD = "", INDEX = 0, _p, _i, runner ;
                    var drawcolor = "", draw = 0 ;
                    var _bunch_limit = _glob_multithread_bunch_limit, _bunch_counter = 0 ;
                    var i = 0, _found_repetends_index = 0, runner = 0, _dict_size = _glob_original_dict.size_recursive();
                    var complex_circle = null, first_circle = _items_array[0].complex_circle ;
                    var pts_array = [], words_array = [], circles_array = [] ;
                    var G = null, GM = null ;
                    var _fp = null, obj ;
                    
                    for( _p = 0 ; _p < _input_fixed_pts.length ; _p++ )
                    {
                        self.postMessage( { "id" : "step", "text" : "Pass " + ( _p + 1 ) + " of " + _input_fixed_pts.length } );
                        _glob_multithread_operations_runner = 0 ;
                        for( i = 0 ; i < _dict_size ; i++ )
                        {
                             if ( !_glob_multithread_running ) break ;

    												 WORD = _glob_multithread_dictionary_obj.sliced_dict_read_runner();
                             if ( WORD.length == _depth && _keys_len > 0 ) WORD = reps_apply_fn( WORD );

                             _fp = _input_fixed_pts[_p] ;
                             _glob_multithread_operations_runner++ ;
                             for( runner = 0 ; runner < WORD.length ; runner++ )
                             {
                                 INDEX = _glob_multithread_symbols_index_array[ WORD[runner] ] ;
                                 switch( _drawentity )
                                 {
                                    case DRAWENTITY_PIXEL:
                                    G = _items_array[INDEX].map ;
                                    _fp = G.compute( _fp );
                                    break ;
                                    case DRAWENTITY_ISOMETRIC_CIRCLE:
                                    case DRAWENTITY_INVERSION_CIRCLE:
                                    G = G.composition( _items_array[INDEX].map );
                                    break ;
                                    default: break ;
                                 }
                             }
                             
                             complex_circle = _drawentity == DRAWENTITY_INVERSION_CIRCLE ? G.inversion_circle() : G.isometric_circle();
                             if( _current_region.is_pt_inside( _fp.real, _fp.imag ) )
                             {
                                 pts_array.push( new point( _fp.real, _fp.imag,
                                 														_POINT_2D_CLS_EUCLIDEAN_ENV,
                                 														_items_array[INDEX].complex_circle.drawcolor,
                                 														_items_array[INDEX].complex_circle.fillcolor,
                                 														_items_array[INDEX].complex_circle.linewidth
																 													) );
                                 words_array.push( WORD );
                                 circles_array.push( complex_circle );
                             }

                             if ( pts_array.length >= _bunch_limit )
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
     														 pts_array = [];
                                 words_array = [];
                                 circles_array = [];
                             }
                        }

                        obj = { 'circles_array' : circles_array,
                                'pts_array' : pts_array,
                                'words_array' : words_array,
                                'draw_fn_id' : 2.2,
                                'counter' : 0,
                                'runner' : _glob_multithread_operations_runner
                              } ;

                        self.postMessage( { 'id' : "draw",
                                            'obj' : obj
                                          } );
                    }
              }
              else self.postMessage( { "id" : "err", "errno" : 4.6 } );
                            
              var _benchmark_end = microtime(1);
              self.postMessage( { 'id': "benchmark",
                                  'start': _benchmark_start,
                                  'end': _benchmark_end,
                                  'operations' : _dict_size
                                } );

              if ( _glob_multithread_operations_mask & 8 ) CIRCLESalgebraicMARK( _glob_limitset_array );
        }
        else self.postMessage( { "id" : "err", "errno" : 4.6 } );
      }
      else self.postMessage( { "id" : "err", "errno" : 4.7 } );
}