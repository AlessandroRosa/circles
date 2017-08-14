function CIRCLESalgebraicPROCESSdeterministicINDEXSEARCHfixedpointsinput( objs, settings )
{
     var _items_array = objs['items'], _items_n = safe_size( _items_array, 0 );
     if ( _items_n > 0 )
     {
        if ( circles_lib_symbol_check_group( _items_array ) == GROUP_TEST_ERR_OK )
        {
           var _repetends_warmup = safe_float( settings['rnd_warmup'], DEFAULT_RND_WARMUP );
           var _repetends_threshold = safe_float( settings['rnd_reps_threshold'], DEFAULT_RND_REPS_THRESHOLD );
           var _repetends_depth = safe_int( settings['rnd_reps_depth'], DEFAULT_RND_REPS_DEPTH );
           var _repetends_depth_tmp = _repetends_depth, _rnd_num = 0 ;

           var _gens_model = settings['gens_model'] ;
           var _gens_symbols_map = settings['gens_symbols_map'] ;
           var _cs_mode = settings['construction_mode'] ;
           var left_up_pt = settings.left_up_pt, right_down_pt = settings.right_down_pt ;
					 var _current_region = new rect( left_up_pt.x, left_up_pt.y, right_down_pt.x, right_down_pt.y, _RECT_ORIENTATION_CARTESIAN, "" );
					 var _benchmark_start = microtime(1), _input_fixed_pts = [] ;
           var _tmp_input_fixed_pts = settings['inputfixedpts'].split( "|" ), _tmp_pt ;
           for( var _t = 0 ; _t < _tmp_input_fixed_pts.length ; _t++ )
           {
              _tmp_pt = _tmp_input_fixed_pts[_t].split( "@" );
              _input_fixed_pts.push( new complex( safe_float( _tmp_pt[0] ), safe_float( _tmp_pt[1] ) ) );
           }

           var _rnd = Math.random ;
           var _drawentity = safe_int( settings['drawentity'], DRAWENTITY_ISOMETRIC_CIRCLE );
           var _depth = safe_int( settings['depth'], 1 );
           var _config = settings['config'].split( "@" );
           var _method_def = circles_lib_method_get_def( safe_int( _config[0], METHOD_NONE ) );
           var _process_def = circles_lib_process_get_def( safe_int( _config[1], PROCESS_NONE ) );
           var _construction_mode_def = circles_lib_construction_mode_get_def( safe_int( _config[2], CONSTRUCTION_NONE ) );
           var _fixedpoints_io_def = circles_lib_fixedpoints_io_get_def( safe_int( _config[3], FIXEDPOINTS_IO_NONE ) );
           var _n_entries = 0 ;
           switch( _cs_mode )
           {
              case CONSTRUCTION_LIMITSET:
              _n_entries = Math.pow( _items_array.length-1, _depth ) * _input_fixed_pts.length * _items_array.length ;
              break ;
              case CONSTRUCTION_TILING:
              default:
              for( var _d = 0 ; _d <= _depth ; _d++ ) // we compute the number of nodes per each branch / generator
              _n_entries += Math.pow( _items_array.length-1, _d ) ;

              _n_entries *= _items_array.length ; // multiply for the number of generators
              _n_entries *= _input_fixed_pts.length ; // multiply for the number of input fixed points to start from
              break ;
           }

           _glob_multithread_operations_counter = _n_entries ;
           self.postMessage( { "id" : "update", "text" : "["+_glob_multithread_working_plane_def+"] - " + _method_def + " / " + _process_def + " / " + _construction_mode_def + " / " + _fixedpoints_io_def } );

           var WORD = "", INDEX = 0, _p, drawcolor = "", draw = 0, i = 0 ;
           var _fp = null, obj = null, G = null, GM = null ;
           var _bunch_limit = _glob_multithread_bunch_limit, _bunch_counter = 0 ;
           var complex_circle = null, first_circle = _items_array[0].complex_circle ;
           var pts_array = [], words_array = [], circles_array = [] ;
           var _based_n_num = "", _proc_str = "", _v = 0, _abs_runner = 0 ;
           var _commutator = "ABab", _based_n_commutator = "" ;
           for( var _c1 = 0 ; _c1 < _commutator.length ; _c1++ )
           {
             for( var _cr2 = 0 ; _cr2 < _items_array.length ; _cr2++ )
             {
               if ( _items_array[_cr2].symbol == _commutator[_c1] ) _based_n_commutator += _cr2+"" ;
             }
           }

           //console.log( "BASED-N COMMUTATOR", _based_n_commutator );
           var _crash_words = [] ;
           for( var _cr1 = 0 ; _cr1 < _items_array.length ; _cr1++ )
           {
             var _sym = _items_array[_cr1].symbol, _inv_sym = _items_array[_cr1].inverse_symbol ;
             for( var _cr2 = 0 ; _cr2 < _items_array.length ; _cr2++ )
             {
                 if ( _items_array[_cr2].symbol == _inv_sym )
                 _crash_words.push( _cr1+""+_cr2 );
             }
           }
           //console.log( "CRASH WORDS", _crash_words );

           self.postMessage( { "id" : "append", "text" : _n_entries + " operations" } );
           for( _p = 0 ; _p < _input_fixed_pts.length ; _p++ )
           {
              _fp = _input_fixed_pts[_p] ;
              self.postMessage( { "id" : "step", "text" : "Pass " + ( _p + 1 ) + " of " + _input_fixed_pts.length } );
              var _word_runner = 0, _n_next = 0, _word ;
              for( var _d = 0 ; _d <= _depth ; _d++ )
              {
                  _n_next = _d == 0 ? _items_array.length : Math.pow( _items_array.length-1, _d ) * _items_array.length ;
                  //console.log( "-------DEPTH", _d, "---- NEXT", _n_next, "--------" );
                  inner_while_loop:
                  for( var _n = 0 ; _n < _n_next ; _n++, _abs_runner++ )
                  {
                     _based_n_num = _n.toString( _items_array.length ) ;
                     //console.log( "N", _n, "DEPTH", _d, "PRE BASED-N", _based_n_num, "LEN", _based_n_num.length, "PAD", _d+1 );
                     _proc_str = _based_n_num.lpad( ( ( ( _n / _items_array.length ) >> 0 ) % _items_array.length ) +"", _d+1 );
                     _proc_str = _proc_str.reverse();
                     /*
                     if ( _repetends_depth_tmp <= 0 )
                     {
                         var _r = (Math.random()*(_items_array.length+1)) | 0 ;
                         _proc_str = ( _r >= _items_array.length ? _based_n_commutator : _r + "" ) + _proc_str ;
                         _repetends_depth_tmp = _r <= _repetends_threshold ? 0 : ( _r * _repetends_depth ) | 0 ;
                         console.log( _repetends_depth_tmp );
                     }
                     else _repetends_depth_tmp-- ;
                     */

                     INDEX = safe_int( _proc_str[0], 0 ) ;
    			           G = _items_array[INDEX].map ;

                     _word = INDEX + "" ;
                     for( _word_runner = 1 ; _word_runner < _proc_str.length ; _word_runner++ )
                     {
                       INDEX = safe_int( _proc_str[_word_runner], 0 ) ;
                       _word += INDEX ;
                     }

                     if ( _word.includes_one_of( _crash_words ) ) continue ;
                     for( _word_runner = 1 ; _word_runner < _proc_str.length ; _word_runner++ )
                     {
                       INDEX = safe_int( _proc_str[_word_runner], 0 ) ;
                       _word += INDEX+"" ;
                       // GM = _items_array[INDEX].map ;
                       G = G.composition( _items_array[INDEX].map );
                       // reminder: if something goes wrong, uncomment this line
                       // complex_circle = G.isometric_circle();
                       _fp = G.compute( _fp );
                     }

                     //console.log( "N", _n, "RET BASED-N", _based_n_num+"", "PADDED", _proc_str+"", "WORD", _word );
                     complex_circle = _drawentity == DRAWENTITY_INVERSION_CIRCLE ? G.inversion_circle() : G.isometric_circle();
                     if( _current_region.is_pt_inside( _fp.real, _fp.imag ) )
                     {
                        pts_array.push( new point( _fp.real, _fp.imag,
                        													 _POINT_2D_CLS_EUCLIDEAN_ENV,
                                     							 _items_array[INDEX].complex_circle.drawcolor,
                                     							 _items_array[INDEX].complex_circle.fillcolor,
                                     							 _items_array[INDEX].complex_circle.linewidth ) );
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
                                'runner' : _abs_runner } ;
                        self.postMessage( { 'id' : "draw", 'obj' : obj } );
                        _bunch_counter = 0 ;
        								pts_array = [];
                        words_array = [];
                        circles_array = [];
                     }
                  }
              }

              obj = { 'circles_array' : circles_array,
                      'pts_array' : pts_array,
                      'words_array' : words_array,
                      'draw_fn_id' : 2.2,
                      'counter' : 0, 'runner' : _abs_runner } ;
              self.postMessage( { 'id' : "draw", 'obj' : obj } );
           }

           var _benchmark_end = microtime(1);
           self.postMessage( { 'id': "benchmark", 'start': _benchmark_start,
                               'end': _benchmark_end, 'operations' : _n_entries } );

           if ( _glob_multithread_operations_mask & 8 ) CIRCLESalgebraicMARK( _glob_limitset_array );
        }
        else self.postMessage( { "id" : "err", "errno" : 4.6 } );
      }
      else self.postMessage( { "id" : "err", "errno" : 4.7 } );
}