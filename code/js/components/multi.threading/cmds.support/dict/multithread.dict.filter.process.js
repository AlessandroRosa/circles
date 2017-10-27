function multithread_dict_process()
{
     var _output_channel = _glob_inline_workers_input_data.out_channel ;
     var _dict_array = _glob_inline_workers_input_data.dict ;
     var _length_filter = _glob_inline_workers_input_data.length_filter ;
     var _page_filter = _glob_inline_workers_input_data.page_filter ;
     var _word_filter = _glob_inline_workers_input_data.word_filter ;
     var _cols = _glob_inline_workers_input_data.cols ;
     var _copy = _glob_inline_workers_input_data.copy ;
     var _display = _glob_inline_workers_input_data.display ;

     var _dump = _glob_inline_workers_input_data.dump ;
     var _dump_params = _glob_inline_workers_input_data.dump_params ;
     var _end_fn = _glob_inline_workers_input_data.end_fn ;

     var _word_max_length = _glob_inline_workers_input_data.word_max_length ;
     var _entries_per_page = _glob_inline_workers_input_data.entries_per_page ;
     var _filter_existence_mask = _glob_inline_workers_input_data.filter_existence_mask ;
         // 1: length, 2: page, 4: word
     var _data_chunk = [], _word = "", _append_count = 0, _found = 0, _mask = 0 ;

     var _subset = _filter_existence_mask & 2 ? _dict_array.slice( _entries_per_page * _page_filter, _entries_per_page * _page_filter + _entries_per_page + 1 ) : _dict_array ;
     var _length = _subset.length ;
     
     var _starting_with = /^([A-Za-z]{1,})\*+$/.test( _word_filter );
     var _ending_with = /^\*([A-Za-z]{1,})+$/.test( _word_filter );
     var _including_with = /^\*([A-Za-z]{1,})\*+$/.test( _word_filter );
     var _matching_with = /^([A-Za-z]{1,})+$/.test( _word_filter );

     var _word_check_fn = null, _chunk = [] ;
     _word_filter = _word_filter.replaceAll( "*", "" );
     
     if ( _starting_with ) _word_check_fn = function( _w, _substr ) { return _w.start_with( _substr ) ? 1 : 0 ; }
     else if ( _ending_with ) _word_check_fn = function( _w, _substr ) { return _w.end_with( _substr ) ? 1 : 0 ; }
     else if ( _including_with ) _word_check_fn = function( _w, _substr ) { return _w.includes( _substr ) ? 1 : 0 ; }
     else if ( _matching_with ) _word_check_fn = function( _w, _substr ) { return _w.strcmp( _substr ) ? 1 : 0 ; }
     else _word_check_fn = function( _w, _substr ) { return YES ; }
     
     _glob_inline_worker_run_flag = 1 ;
     
     for( var _i = 0 ; _i < _length ; _i++ )
     {
          _word = _subset[_i] ;
          if ( _filter_existence_mask & 1 && _word.length == _length_filter ) _mask |= 1 ;
          if ( _filter_existence_mask & 2 ) _mask |= 2 ;
          if ( _filter_existence_mask & 4 && _word_check_fn.call( this, _word, _word_filter ) ) _mask |= 4 ;

          _word = _subset[_i].rpad( " ", _word_max_length + 1 );
          if ( _mask & 4 ) _word = _word.replaceAll( _word_filter, "<yellow>"+_word_filter+"</yellow>" );

          if ( _mask == _filter_existence_mask )
          {
             _data_chunk.push( _word );
             _append_count++ ;
             _found++ ;
          }

          _mask = 0 ;

          if ( _append_count > 0 && _append_count % _cols == 0 )
          {
              _append_count = 0 ;
              self.postMessage( { id : "output",
                                  ret : { data : _data_chunk.join( "@" ),
                                          progress : Math.ceil( _i / _length * 100.0 ),
                                          copy : _copy,
                                          dump : _dump,
                                          display : _display,
                                          out_channel : _output_channel
                                        }
                                }
                              );
              _data_chunk.flush();
          }
          
          if ( _glob_inline_worker_run_flag == 0 ) break ;
     }

     // in case, results have been accumulated but the current row has not been filled, thu not displayed yet
     if ( _append_count % _cols != 0 )
     {
          _append_count = 0 ;
          self.postMessage( { id : "output",
                              ret : { data : _data_chunk.join( "@" ),
                                      progress : Math.ceil( _i / _length * 100.0 ),
                                      copy : _copy,
                                      dump : _dump,
                                      display : _display,
                                      out_channel : _output_channel
                                    }
                            }
                          );
          _data_chunk.flush();
     }
          
     self.postMessage( { id : "end", ret : { found : _found,
                                             word_filter : _word_filter,
                                             dump : _dump,
                                             end_fn : _end_fn,
                                             dump_params : _dump_params,
                                             out_channel : _output_channel } } );
}