function multithread_treescan_stop() { _glob_inline_worker_run_flag = 0 ; }

function multithread_treescan( _max_depth, _input_array, _alphabet, _letters_map, _reduced_flag )
{
    if ( _reduced_flag == null || _reduced_flag == "undefined" ) _reduced_flag = 0 ;
    if ( _input_array.length == 0 || _alphabet.length == 0 ) return [] ;
    else
    {
         var _tmp_array = [], _word, _last, _skip_this , _i, _a;
         for( _i = 0 ; _i < _input_array.length ; _i++ )
         {
            _word = _input_array[_i] ;
            _last = _word.right(1), _skip_this = _reduced_flag ? _letters_map[_last] : "" ;
            for( _a = 0 ; _a < _alphabet.length ; _a++ ) if ( _alphabet[_a] != _skip_this ) _tmp_array.push( _word + _alphabet[_a] );
            if ( _glob_inline_worker_run_flag == 0 ) break ; 
         }

         return _tmp_array ;
    }
}

function multithread_treescan_index_mapping_array( _seeds_array, _out_channel )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _sd_n = safe_size( _seeds_array, 0 );
    if ( _sd_n == 0 ) return null ;
    else
    {
        var _symbols_index_array = [];
        var ITEM ;
        for( var _i = 0 ; _i < _sd_n ; _i++ )
        {
             ITEM = _seeds_array[_i] ;
             if ( is_item_obj( ITEM ) ) _symbols_index_array[""+ITEM.symbol] = _i ;
        }
        return _symbols_index_array.clone_associative();
    }
}

function multithread_treescan_get_orbit_from_word( _word, _seeds_array, _startpt, _out_channel )
{
    _seeds_array = safe_size( _seeds_array, 0 ) == 0 ? null : _seeds_array ;
    _word = safe_string( _word, "" ).trim();
    if ( _word.length > 0 && is_array( _seeds_array ) )
    {
        var _symbols_index_array = multithread_treescan_index_mapping_array( _seeds_array, _out_channel );
        var _ret_orbit_array = [ _startpt ];
        var _ret_pt = new complex( _startpt.x, _startpt.y );
        var G = new mobius_map(), INDEX = _symbols_index_array[ _word[0] ] ;
        for( var _runner = 0 ; _runner < _word.length ; _runner++ )
        {
             INDEX = _symbols_index_array[ _word[_runner] ] ;
             G.init_from_obj( _seeds_array[INDEX].map );
             _ret_pt = G.compute( _ret_pt );
             _ret_orbit_array.push( new point( _ret_pt.real, _ret_pt.imag ) );
        }

        return _ret_orbit_array ;
    }
    else return null ;
}

function multithread_treescan_get_mobiusmap_from_word( _word, _seeds_array, _out_channel )
{
    _seeds_array = safe_size( _seeds_array, 0 ) == 0 ? null : _seeds_array ;
    _word = safe_string( _word, "" ).trim();
    if ( _word.length > 0 && is_array( _seeds_array ) )
    {
        var _symbols_index_array = multithread_treescan_index_mapping_array( _seeds_array, _out_channel );
        var INDEX = _symbols_index_array[ _word[0] ] ;
        var OBJ_MM = is_item_obj( _seeds_array[INDEX] ) ? _seeds_array[INDEX].map : null ;
        var G = new mobius_map(), M = new mobius_map();
            G.init_from_obj( OBJ_MM );
        if ( is_mobius_map( G ) )
        {
            for( var _runner = 1 ; _runner < _word.length ; _runner++ )
            {
                INDEX = _symbols_index_array[ _word[_runner] ] ;
                M.init_from_obj( _seeds_array[INDEX].map );
                G = G.composition( M );
            }

            return G ;
        }
    }

    return null ;
}

function multithread_treescan_process()
{
    var _out_channel = _glob_inline_workers_input_data.out_channel ;
    var _seeds_array = _glob_inline_workers_input_data.seeds ;
    var _startword = _glob_inline_workers_input_data.startword ;
    var _startpt = _glob_inline_workers_input_data.startpt ;
        _startpt = new point( parseFloat( ( _startpt.split( "," ) )[0] ),
                              parseFloat( ( _startpt.split( "," ) )[1] )
                            );
    var _depth = _glob_inline_workers_input_data.depth ;
    var _tolerance = _glob_inline_workers_input_data.tolerance ;
    var _region = _glob_inline_workers_input_data.region == null ? null : new rect( _glob_inline_workers_input_data.region.x1, _glob_inline_workers_input_data.region.y1, _glob_inline_workers_input_data.region.x2, _glob_inline_workers_input_data.region.y2, _RECT_ORIENTATION_CARTESIAN );
    var _trace = _glob_inline_workers_input_data.trace ;
    var _service = _glob_inline_workers_input_data.service.toLowerCase();
    var _list = _glob_inline_workers_input_data.list ;
    var _alphabet = _glob_inline_workers_input_data.alphabet.split( "@" );
    var _symbols = _glob_inline_workers_input_data.symbols.split( "@" );
    var _inverse_symbols = _glob_inline_workers_input_data.inverse_symbols.split( "@" );
    var _drawcolor = _glob_inline_workers_input_data.drawcolor ;
    var _fillcolor = _glob_inline_workers_input_data.fillcolor ;
    var _crlf = _glob_inline_workers_input_data.crlf ;
    var _copy = _glob_inline_workers_input_data.copy ;
    var _accuracy = _glob_inline_workers_input_data.accuracy ;

    _glob_inline_worker_run_flag = 1 ;
    var _loop = _depth == UNDET ? 1 : 0 ;
    var _end = _loop ? _startword.length + 1 : _depth ;

    var _output_data = "", _word = "", _append_count = 0, _found = 0, _mask = 0, _passed_cnt = 0 ;
    var _cols = 1, _row, _mm, _word, _found, _dist, _passed, _check, _mobius, _orbit, _last_pt ;

    var _letters_map = [], _input_array = [ _startword ];
    for( var _i = 0 ; _i < _symbols.length ; _i++ ) _letters_map[ _symbols[_i] ] = _inverse_symbols[_i] ;

    _found = 0 ;
    
    var _cols_width = [ Math.max( new String( "Word" ).length, _depth + 1 ),
                        Math.max( new String( "Trace" ).length, _accuracy + 1 ),
                        Math.max( new String( "Tolerance" ), _accuracy + 1 ) ]
    
    switch( _service )
    {
        case "lastpt":
        case "orbit":
        break;
        case "trace":
        _output_data = ( new String( "Word" ) ).rpad( " ", _cols_width[0] );
        _output_data += ( new String( "Trace" ) ).rpad( " ", _cols_width[1] );
        _output_data += ( new String( "Tolerance" ) ).rpad( " ", _cols_width[2] );
        break;
        default: break ;
    }

    self.postMessage( { id : "output",
                        ret : { data : _output_data,
                                lastpt : _last_pt,
                                progress : 0,
                                service : _service,
                                startpt : _startpt,
                                drawcolor : _drawcolor,
                                fillcolor : _fillcolor,
                                out_channel : _out_channel,
                                stage : 1
                              }
                      }
                    );

    var _i, _w ;

    outer_loop:
    for( _i = _startword.length ; _i <= _end ; _i++ )
    {
         _mobius = new mobius_map();
         switch( _service )
         {
             case "trace":
             _output_data = "Scanning words long <snow>" + _i + " char" + ( _i == 1 ? "" : "s" ) + "</snow>"+_crlf ;
             break;
             default: break ;
         }
         
         inner_loop:
         for( _w = 0 ; _w < _input_array.length ; _w++ )
         {
             _word = _input_array[_w] ;
             switch( _service )
             {
                  case "lastpt":
                  case "orbit":
                  _check = _passed = 1 ;
                  break ;
                  case "region":
                  _check = 1 ;
                  _orbit = multithread_treescan_get_orbit_from_word( _word, _seeds_array, _startpt, _out_channel );
                  _last_pt = _orbit[ _orbit.length - 1 ] ;
                  _passed = _region.includes_pt( _last_pt.x, _last_pt.y );
                  break ;
                  case "trace":
                  _mm = multithread_treescan_get_mobiusmap_from_word( _word, _seeds_array, _out_channel );
                  _mobius.init_from_obj( _mm );
                  _dist = Math.abs( _mobius.trace().radius() - _trace );
                  _check = _dist <= _tolerance ? 1 : 0 ;
                  _passed = ( _check || _list ) ? 1 : 0 ;
                  break ;
                  default: break ;
             }

             if ( _passed )
             {
                 _output_data += "<lemon>"+_word.rpad( " ", _cols_width[0] )+"</lemon> " ;
                 switch( _service )
                 {
                      case "lastpt":
                      _output_data = _word ;
                      _orbit = multithread_treescan_get_orbit_from_word( _word, _seeds_array, _startpt, _out_channel );
                      _last_pt = _orbit[ _orbit.length - 1 ] ;
                      break ;
                      case "orbit":
                      _output_data = _word ;
                      break ;
                      case "region":
                      _output_data = _word ;
                      break ;
                      case "trace":
                      _output_data += "<lightgray>"+( new String( _mm.trace().radius() ) ).rpad( " ", _cols_width[1] )+"</lightgray> " ;
                      _output_data += "<lightblue>"+( new String( _dist ) ).rpad( " ", _cols_width[2] )+"</lightblue> " ;
                      if ( _list ) _output_data += _check ? "<greenshock>accepted</greenshock>" : "<orange>discarded</orange>" ;
                      break ;
                      default: break ;
                 }

                 _append_count++ ;
                 _passed_cnt++ ;

                 if ( _append_count > 0 && _append_count % _cols == 0 )
                 {
                     _append_count = 0 ;
                     self.postMessage( { id : "output",
                                         ret : { data : _output_data,
                                                 lastpt : _last_pt,
                                                 progress : _loop ? "Loop" : Math.ceil( _i / _depth * 100.0 ),
                                                 service : _service,
                                                 startpt : _startpt,
                                                 drawcolor : _drawcolor,
                                                 fillcolor : _fillcolor,
                                                 out_channel : _out_channel,
                                                 stage : 2,
                                                 copy : _copy
                                               }
                                       }
                                     );
                     _output_data = "" ;
                 }
             }
             
             if ( _glob_inline_worker_run_flag == 0 ) break outer_loop ;
             _found++ ;
         }

         if ( _glob_inline_worker_run_flag == 0 )
         {
              self.postMessage( { id : "output",
                                  ret : { data : "<orange>The process has been stopped by user</orange>",
                                          lastpt : _last_pt,
                                          progress : 0,
                                          service : _service,
                                          startpt : _startpt,
                                          drawcolor : _drawcolor,
                                          fillcolor : _fillcolor,
                                          out_channel : _out_channel,
                                          stage : 3
                                        }
                                }
                              );
              break outer_loop ;
         }
         _input_array = multithread_treescan( _depth, _input_array, _alphabet, _letters_map, YES );
         if ( _depth == UNDET ) _end = _end + 1 ;
    }

    // in case, results have been accumulated but not posted yet
    if ( _append_count % _cols != 0 && _glob_inline_worker_run_flag != 0 )
    {
        _append_count = 0 ;
        self.postMessage( { id : "output",
                            ret : { data : _output_data,
                                    lastpt : _last_pt,
                                    progress : 0,
                                    service : _service,
                                    startpt : _startpt,
                                    drawcolor : _drawcolor,
                                    fillcolor : _fillcolor,
                                    out_channel : _out_channel
                                  }
                          }
                        );
        _output_data = "" ;
    }

    if( _glob_inline_worker_run_flag != 0 )
    self.postMessage( { id : "end", ret : { found : _found, passed : _passed_cnt } } );
}