function CIRCLESalgebraicPROCESSrandomINPUTFP( objs, settings )
{
     var _items_array = objs['items'], _items_n = safe_size( _items_array, 0 );
     if ( _items_n > 0 )
     {
         var _gens_model = settings['gens_model'] ;
         var _gens_symbols_map = settings['gens_symbols_map'] ;

         var _repetends_warmup = safe_float( settings['rnd_warmup'], DEFAULT_RND_WARMUP );
         var _repetends_threshold = safe_float( settings['rnd_reps_threshold'], DEFAULT_RND_REPS_THRESHOLD );
         var _repetends_depth = safe_int( settings['rnd_reps_depth'], DEFAULT_RND_REPS_DEPTH );
         var _repetends_depth_tmp = _repetends_depth, _rnd_num = 0 ;

         var _drawentity = safe_int( settings['drawentity'], DRAWENTITY_ISOMETRIC_CIRCLE );
         var _depth = safe_int( settings['depth'], 1 );
         var _config = settings['config'].split( "@" );
         var _method_def = circles_lib_method_get_def( safe_int( _config[0], _glob_method ) );
         var _process_def = circles_lib_process_get_def( safe_int( _config[1], PROCESS_NONE ) );
         var _construction_mode_def = circles_lib_construction_mode_get_def( safe_int( _config[2], CONSTRUCTION_NONE ) );
         var _fixedpoints_io_def = circles_lib_fixedpoints_io_get_def( safe_int( _config[3], FIXEDPOINTS_IO_NONE ) );
         
         var _last_pt = !is_point( settings['last_pt'] ) ? null : new complex( settings['last_pt'].x, settings['last_pt'].y ) ;
         var _use_last_pt = safe_int( settings['use_last_pt'], 0 );

         var _disk_visibility_radius = safe_float( settings['_disk_visibility_radius'], DEFAULT_VISIBILITY_RADIUS );
 				 var probability_rng_method = safe_int( settings['probability_rng_method'], RNG_BUILT_IN );
         var _base = 2, _n_operations = Math.pow( _base, _depth );
		 		 var _current_region = new rect( settings.left_up_pt.x, settings.left_up_pt.y, settings.right_down_pt.x, settings.right_down_pt.y, _RECT_ORIENTATION_CARTESIAN, "" );
         var pts_array = [], _inverses = [], circles_array = [];
         var G = new mobius_map( 1, 0, 0, 1 ), G_COMP = new mobius_map( 1, 0, 0, 1 ), G_COMP_CIRCLE ;
				 var _fp = null, obj, _symbol ;
         var _bunch_pts_limit = _glob_multithread_bunch_limit ;
         var INDEX = 0 ;

         for( var _i = 0 ; _i < _items_n ; _i++ ) _inverses[ _items_array[_i].symbol ] = _items_array[_i].inverse_symbol ;

 				 var probability_distribution_array = [];
         var _rnd = CIRCLESmultithreadingRNGfunctionGET( probability_rng_method ) ;
         var _benchmark_start = microtime(1);

				 _glob_multithread_running = YES ;
				 for( var _i = 0 ; _i < _items_n ; _i++ ) probability_distribution_array.push(0);

         var _min_prob = 1, _rnd_val ;
         for( var _p = 0 ; _p < _glob_multithread_rnd_probability_array.length ; _p++ )
         _min_prob = Math.min( _glob_multithread_rnd_probability_array[_p], _min_prob );
				 var _LUT_length = safe_int( 1.0 / _min_prob, 100 ) * 100 ;

         var LUTarray = CIRCLESalgebraicPROCESSrandomPROBABILITY( _glob_multithread_rnd_probability_array, _LUT_length );
         var _LUT_range = _LUT_length - 1 ;
         var _n_canvas_grid = _glob_multithread_canvas_size[0] * _glob_multithread_canvas_size[1] ;
         var _out_text = _base+"^"+_depth+" : "+_n_operations+" operations" ;
         var _stats_bunch = [] ;
             _stats_bunch['outer_pts_n'] = 0 ;

         _glob_multithread_operations_runner = 0 ;
         _glob_multithread_operations_counter = _n_operations ;
         self.postMessage( { "id" : "resetbar", "text" : "Reset progress bar" } );
         self.postMessage( { "id" : "append", "text" : _out_text } );
         self.postMessage( { "id" : "update", "text" : "["+_glob_multithread_working_plane_def+"] - " + _method_def + " / " + _process_def + " / " + _construction_mode_def + " / " + _fixedpoints_io_def } );

         var _input_fixed_pts = [] ;
         if ( _use_last_pt && is_point( _last_pt ) ) _input_fixed_pts.push( _last_pt );
         else
         {
						 var _tmp_input_fixed_pts = settings['inputfixedpts'].split( "|" ), _tmp_pt ;
		         for( var _t = 0 ; _t < _tmp_input_fixed_pts.length ; _t++ )
		         {
		            _tmp_pt = _tmp_input_fixed_pts[_t].split( "@" );
		            _input_fixed_pts.push( new complex( safe_float( _tmp_pt[0] ), safe_float( _tmp_pt[1] ) ) );
		         }
				 }
				 
         var _i_len = _input_fixed_pts.length, _p, _wm, _r = 0 ;
         for( _p = 0 ; _p < _i_len ; _p++ )
         {
              INDEX = 0, _fp = _input_fixed_pts[_p] ;
              // WARM_UP [TEST]
              self.postMessage( { "id" : "append", "text" : "Warm-up " + ( _p + 1 ) + " of " + _i_len } );
              for( _wm = 0 ; _wm < _repetends_warmup ; _wm++ )
              {
                 if ( _repetends_depth_tmp <= 0 )
                 {
                    _r = _rnd() ;
                    INDEX = LUTarray[ ( _LUT_range * _r ) | 0 ] ;
                    _repetends_depth_tmp = _r <= _repetends_threshold ? 0 : ( _r * _repetends_depth ) | 0 ;
                 }
                 else _repetends_depth_tmp-- ;

                 G = _items_array[INDEX] ;
         				 _fp = G.map.compute( _fp );
       					 G_COMP = G_COMP.composition( G.map );
              }
              
              _symbol = is_item_obj( G_COMP ) ? G_COMP.symbol : _items_array[0].symbol ;
              self.postMessage( { "id" : "append", "text" : "Step " + ( _p + 1 ) + " of " + _i_len + " x " + _n_operations + " operations" } );

      				for( _glob_multithread_operations_runner = 0 ; _glob_multithread_operations_runner <= _n_operations ; _glob_multithread_operations_runner++ )
              {
      						if ( !_glob_multithread_running ) break ;
                  if ( pts_array.length >= _bunch_pts_limit )
                  {
                       obj = { 'circles_array' : circles_array,
                               'words_array' : [],
                               'pts_array' : pts_array,
                               'draw_fn_id' : 2.2,
                               'runner' : _glob_multithread_operations_runner,
                               'counter' : _glob_multithread_operations_counter } ;
                                                                
                       self.postMessage( { 'id': "draw",
                                           'obj': obj
                                         } );
      								 pts_array = [];
                       circles_array = [];
                  }

                  if ( _repetends_depth_tmp <= 0 )
                  {
                      INDEX = LUTarray[ _LUT_range * _rnd() | 0 ] ;
                      _r = _rnd() ;
                      _repetends_depth_tmp = _r <= _repetends_threshold ? 0 : ( _r * _repetends_depth ) | 0 ;
                  }
                  else _repetends_depth_tmp-- ;

                  G = _items_array[INDEX] ;
                  //if ( _inverses[ _symbol ] == G.symbol ) { _glob_multithread_operations_runner-- ; _symbol = G.symbol ; continue ; }
                  if ( _gens_symbols_map[ _symbol ].lastchar() == _inverses[ G.symbol ] ) { _glob_multithread_operations_runner -= 2 ; _symbol = G.symbol ; continue ; }
                  else _symbol = G.symbol ;

                  probability_distribution_array[INDEX]++ ;
      						if ( _current_region.is_pt_inside( _fp.real, _fp.imag ) )
      						{
		 									pts_array.push( new point( _fp.real, _fp.imag,
		 																						 _POINT_2D_CLS_EUCLIDEAN_ENV,
		 									 													 G.complex_circle.drawcolor,
		 									 													 G.complex_circle.fillcolor,
																								 G.complex_circle.linewidth
																							 ) );
                      G_COMP_CIRCLE = _drawentity == DRAWENTITY_INVERSION_CIRCLE ? G_COMP.inversion_circle() : G_COMP.isometric_circle();
											G_COMP_CIRCLE.draw = G.complex_circle.draw ;
											G_COMP_CIRCLE.drawcolor = G.complex_circle.drawcolor ;
											G_COMP_CIRCLE.fill = G.complex_circle.fill ;
											G_COMP_CIRCLE.fillcolor = G.complex_circle.fillcolor ;
		                  circles_array.push( G_COMP_CIRCLE );
									}

     						  _fp = G.map.compute( _fp );
     						  G_COMP = G_COMP.composition( G.map );
      						if ( !_glob_multithread_running ) break ;
              }
              
              _glob_multithread_operations_runner = 0 ;
              if ( !_glob_multithread_running ) break ;
         }

         obj = { 'circles_array' : circles_array,
                 'words_array' : [],
                 'pts_array' : pts_array,
                 'draw_fn_id' : 2.2,
                 'runner' : _glob_multithread_operations_runner,
                 'counter' : _glob_multithread_operations_counter } ;
                                                      
         self.postMessage( { 'id': "draw",
                             'obj': obj
                           } );

				 var _benchmark_end = microtime(1);
         self.postMessage( { 'id': "benchmark",
                             'start': _benchmark_start,
                             'end': _benchmark_end,
                             'operations' : _n_operations,
													   'probability_distribution' : probability_distribution_array.join( "@" ),
                             'stats_bunch' : _stats_bunch
                           } );

         if ( _glob_multithread_operations_mask & 8 ) CIRCLESalgebraicMARK( _glob_limitset_array );
      }
      else self.postMessage( { "id" : "err", "errno" : 4.7 } );
}