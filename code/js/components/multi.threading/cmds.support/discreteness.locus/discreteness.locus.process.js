function multithread_discreteness_locus_stop()
{
    _glob_inline_worker_discreteness_locus.run = _glob_inline_worker_run_flag = 0 ;
}

function multithread_discreteness_locus_process()
{
    var _zero_pq = new farey( 0, 1 ), _unit_pq = new farey( 1, 1 );
    var _append_count = 0, _input_seq = null, _n_keys ;
    var _out_queue_at_every_n_steps = 25 ;
    var _output_text = "", _output_data = [] ;

    var _output_channel = _glob_inline_workers_input_data.out_channel ;
    var _features = _glob_inline_workers_input_data.features ;
    var _accuracy = _features['accuracy'] ;
    var _maxiterate = _features['maxiterate'] ;
    var _bounding_rect = new rect( _features['boundingrect'][0], _features['boundingrect'][1],
								   _features['boundingrect'][2], _features['boundingrect'][3],
                                   _RECT_ORIENTATION_CARTESIAN, "" );
    var _init_discreteness_locus_mode = _features['initmode'] ;
    var _init_discreteness_locus_def = _features['boundarydef'] ;
    var _start_frac = _features['start_frac'] ;
        _start_frac = _start_frac == null ? _zero_pq : new farey( _start_frac.p, _start_frac.q );
    var _end_frac = _features['end_frac'] ;
        _end_frac = _end_frac == null ? _unit_pq : new farey( _end_frac.p, _end_frac.q );

    var _pq_for_cusp = _glob_inline_workers_input_data.pq_for_cusp ;
    var _upper_bound = _glob_inline_workers_input_data.upper_bound ;
    var _order = _glob_inline_workers_input_data.order ;
    var _service = _glob_inline_workers_input_data.service.toLowerCase();
    var _crlf = _glob_inline_workers_input_data.crlf ;
    var _data_storage_ref = _glob_inline_workers_input_data.data_storage_ref ;
    var _trace_fix_op = _features['trace_fix_op'] ;
    
    _output_text += "Input discreteness locus order " + _order + _crlf ;

    if ( _features['start_frac'] == null || _features['end_frac'] == null )
    {
        _output_text = "<orange>Missing bounding input fractions</orange>" + _crlf ;
        _output_text += "Automatic reset of bounding fractions to" + _crlf  ;
    }

    _output_text += "Start fraction " + _start_frac.output() + _crlf ;
    _output_text += "End fraction " + _end_frac.output();
        
    self.postMessage( { id : "output", ret : { out_channel : _output_channel, features : [],
                        text : _output_text, service : _service, save : 0 } } );

    _glob_inline_worker_discreteness_locus = new discreteness_locus();
    _glob_inline_worker_discreteness_locus.custom_flag = YES ;
    _glob_inline_worker_discreteness_locus.run = 1 ;
    _glob_inline_worker_run_flag = 1 ;
    _glob_inline_worker_discreteness_locus.set_trace_fix_op( _trace_fix_op );
    _glob_inline_worker_discreteness_locus.set_accuracy( _accuracy );
    _glob_inline_worker_discreteness_locus.set_max_iterate( _maxiterate );

    var _pleatingrays_flag = safe_int( _features['pleatingrays'][0], 0 );
    var _pleatingrays_mask = safe_int( _features['pleatingrays'][1], 0 );
    var _pleatingrays_max_steps = safe_int( _features['pleatingrays'][2], _glob_inline_worker_discreteness_locus.get_pleating_rays_max_iterate() );
    var _pleatingrays_step_rate = safe_float( _features['pleatingrays'][3], _glob_inline_worker_discreteness_locus.get_pleating_rays_step_rate() );
    var _pleatingrays_threshold_accuracy = safe_float( _features['pleatingrays'][4], _glob_inline_worker_discreteness_locus.get_pleating_rays_threshold_accuracy() );
    var _pleatingrays_forward_factor = safe_float( _features['pleatingrays'][5], _glob_inline_worker_discreteness_locus.get_pleating_rays_forward_factor() );
    var _pleatingrays_backward_factor = safe_float( _features['pleatingrays'][6], _glob_inline_worker_discreteness_locus.get_pleating_rays_backward_factor() );
    var _pleatingrays_correction = safe_int( _features['pleatingrays'][7], 0 );
    var _pleatingrays_keepgoing = safe_int( _features['pleatingrays'][8], 0 );

    _glob_inline_worker_discreteness_locus.set_pleating_rays_max_iterate( _pleatingrays_max_steps );
    _glob_inline_worker_discreteness_locus.set_pleating_rays_step_rate( _pleatingrays_step_rate );
    _glob_inline_worker_discreteness_locus.set_pleating_rays_threshold_accuracy( _pleatingrays_threshold_accuracy );
    _glob_inline_worker_discreteness_locus.set_pleating_rays_forward_factor( _pleatingrays_forward_factor );
    _glob_inline_worker_discreteness_locus.set_pleating_rays_backward_factor( _pleatingrays_backward_factor );

    switch( _service )
    {
       case "dlocus":
       _output_text = "<lightblue>Starting to compute "+_init_discreteness_locus_def+" discreteness locus up to order " + _order + " ...</lightblue>" ;
       _output_text += _crlf + "<snow>Type 'stop' to arrest this operation</snow>" ;
       break;
       case "cusp":
       _output_text = "<lightblue>Starting to compute the trace for cusp "+_pq_for_cusp+" on the "+_init_discreteness_locus_def+" discreteness locus ...</lightblue>" ;
       _output_text += _crlf + "<snow>Type 'stop' to arrest this operation</snow>" ;
       break;
       default: break ;
    }

    if( _glob_inline_worker_run_flag != 0 )
    self.postMessage( { id : "start", ret : { out_channel : _output_channel, features : _features, service : _service } } );

	self.postMessage( { id : "output", ret : { out_channel : _output_channel, features : [], text : _output_text, service : _service, save : 0 } } );
    _output_text = "" ;
    if ( _features['custom_params'] instanceof Array )
    {
        if ( _features['custom_params'].length == 5 )
        {
            _glob_inline_worker_discreteness_locus.set_custom_params( _features['custom_params'].subset( 5 ) );
            _glob_inline_worker_discreteness_locus.set_starting_pt( new complex( _features['custom_params'][0].real, _features['custom_params'][0].imag ) );
            _glob_inline_worker_discreteness_locus.set_commutator_trace( new complex( _features['custom_params'][3].real, _features['custom_params'][3].imag ) );
            _glob_inline_worker_discreteness_locus.set_eq_solution( new complex( _features['custom_params'][4].real, _features['custom_params'][4].imag ) );
        }
    }

    _glob_inline_worker_discreteness_locus.set_init_mode( _init_discreteness_locus_mode );
    // call to procedure
    switch( _service )
    {
        case "dlocus":
        var _start_pq = _start_frac, _end_pq = _end_frac ;
        _glob_inline_worker_discreteness_locus.farey_seq_start.copy( _start_pq );
        _glob_inline_worker_discreteness_locus.farey_seq_end.copy( _end_pq );

        var _pq_frac_array = _pq_for_cusp.split( "/" );
        var _pq_farey_obj = new farey( _pq_frac_array[0], _pq_frac_array[1] );
        var _chunk_counter = 0, _func, _out_str = "" ;

        // I copied here the original code of the discreteness locus from the tracer obj
        // because I can handle the output more properly for this multi-tasking environment
        var _pq = new farey(), _boundary = [];
      		_start_frac = _start_pq.p + "/" + _start_pq.q ;
       		_end_frac = _end_pq.p + "/" + _end_pq.q ;
        var _tr = _glob_inline_worker_discreteness_locus.starting_pt, _old_tr, _runner = 0 ;

        self.postMessage( { id : "output", ret : { out_channel : _output_channel,
                            features : _features, text : _output_text,
                            data : "Building Farey series of order " + _order,
                            service : _service, save : 0 } } );

        var _filter_seq = _pq.farey_sequence( _order, _start_pq, _end_pq );
        // preparation
        switch( _glob_inline_worker_discreteness_locus.get_init_mode() )
        {
            case _DLOCUS_EARLE:
            _filter_seq = _filter_seq.reverse();
            _start_pq = new farey( _filter_seq.get_first() );
            break ;
            default:
            break ;
        }
          
        var _max_str_len = 16, _keys, _pl_rays_array = [], _eq_solution = _glob_inline_worker_discreteness_locus.get_eq_solution();
        for( var _i = 0 ; _i < _filter_seq.length / 10 ; _i++ ) _max_str_len = Math.max( _max_str_len, _filter_seq[_i].length );

        _pq = _start_pq ;
        while( true )
        {
            _old_tr = _tr ;
            _func = _glob_inline_worker_discreteness_locus.pq_equation( _pq, _old_tr, _glob_inline_worker_discreteness_locus.get_eq_solution() );
            _tr = _glob_inline_worker_discreteness_locus.pq_newton( _func, _pq, _old_tr );
			if ( _start_pq.is_lesser_eq( _pq ) && _pq.is_lesser_eq( _end_pq ) )
            {
                _boundary[''+_pq.output()] = _glob_inline_worker_discreteness_locus.fix_discreteness_locus_pt( _pq, _tr );
                _append_count++ ;
            }

            if ( _append_count % _out_queue_at_every_n_steps == 0 && _glob_inline_worker_run_flag != 0 )
            {
                _output_text = multithread_discreteness_locus_output_discreteness_locus_chunk( _chunk_counter, _boundary, _crlf );
                _chunk_counter++ ;
                _out_str = "Discreteness locus rendering based upon a Farey sequence of order " + _order ;
                _out_str += _crlf+"Running " + ( _runner / _filter_seq.length * 100.0 ).roundTo(2) + " %" ;
                _out_str += _crlf+"Filtered " + _append_count + "/" + _filter_seq.length + " - " + ( _append_count / _filter_seq.length * 100.0 ).roundTo(2) + " %" ;
                _out_str += _crlf.repeat(2)+"Now processing " + _start_pq.output() + " < " + _pq.output().rpad( "&nbsp;", _max_str_len ) + " < " + _end_pq.output();

                self.postMessage( { id : "output", ret : { out_channel : _output_channel,
                                    features : _features, text : _output_text,
                                    data : _out_str, service : _service, save : 1 } } );

				if ( _pleatingrays_flag )
				{
					_keys = _boundary.keys_associative(), _pl_rays_array = [] ;
					_n_keys = is_array( _keys ) ? _keys.length : 0 ;
		            for( var _i = 0 ; _i < _keys.length ; _i++ )
		            {
						if ( _pleatingrays_mask & _DLOCUS_PLEATING_RAY_POSITIVE_CLASS )
						_pl_rays_array.push( _glob_inline_worker_discreteness_locus.pleating_positive_ray( new farey( _keys[_i] ), _boundary[ _keys[_i] ],
										     _pleatingrays_correction, _pleatingrays_keepgoing ) );
						if ( _pleatingrays_mask & _DLOCUS_PLEATING_RAY_NEGATIVE_CLASS )
						_pl_rays_array.push( _glob_inline_worker_discreteness_locus.pleating_negative_ray( new farey( _keys[_i] ), _boundary[ _keys[_i] ],
											 _eq_solution, _pleatingrays_correction, _pleatingrays_keepgoing ) );
					}

					self.postMessage( { id : "output", ret : { out_channel : _output_channel,
	                                    features : _features, text : _pl_rays_array.clone(),
	                                    data : "Computing the pleating rays",
	                                    service : "pleatingrays", save : 0 } } );
				}

                _boundary.flush_associative();
            }
            else if ( _append_count % _out_queue_at_every_n_steps == 1 && _glob_inline_worker_run_flag != 0 )
            {
                _out_str = "Discreteness locus rendering based upon a Farey sequence of order " + _order ;
                _out_str += "\nRunning " + ( _runner / _filter_seq.length * 100.0 ).roundTo(2) + " %" ;
                _out_str += "\nFiltered " + _append_count + "/" + _filter_seq.length + " - " + ( _append_count / _filter_seq.length * 100.0 ).roundTo(2) + " %" ;
                _out_str += "\n\nNow processing " + _start_pq.output() + " < " + _pq.output().rpad( " ", _max_str_len ) + " < " + _end_pq.output();
                self.postMessage( { id : "output", ret : { out_channel : _output_channel,
                                    features : [], text : _output_text,
                                    data : _out_str, service : _service, save : 0 } } );
            }

            _runner++ ;
            if ( _runner == _filter_seq.length || _pq.is_greater( _end_pq ) || _glob_inline_worker_discreteness_locus.stop == 1 ) break ;
            _pq.read_fraction( _filter_seq[ _runner ] );
         }
         break;
         case "cusp":
         var _pq_frac_array = _pq_for_cusp.split( "/" );
         var _pq_farey_obj = new farey( safe_int( _pq_frac_array[0], 0 ), safe_int( _pq_frac_array[1], 1 ) );
         var _reduced_farey = _pq_farey_obj.reduce();
         if ( _pq_farey_obj.is_equal_to( _reduced_farey ) &&
              !( _pq_farey_obj.match_signature( _reduced_farey ) ) )
         {
            self.postMessage( { id : "output", ret : { out_channel : _output_channel, features : [],
                                text : "Detected reducible fraction: " + _pq_farey_obj.output() + " turned into " + _reduced_farey.output(),
                                service : _service, save : 0 } } );
            _pq_farey_obj.set( _reduced_farey.p, _reduced_farey.q );
            _pq_for_cusp = _pq_farey_obj.output();
         }

         var _p = _pq_farey_obj.p, _q = _pq_farey_obj.q ;
         if ( _data_storage_ref["farey"] != null )
         {
              if ( _data_storage_ref["farey"][''+_q] != null )
              {
                self.postMessage( { id : "output", ret : { out_channel : _output_channel, features : [],
                                    text : "Found Farey sequence of order " + _q + " already stored in memory",
                                    service : _service, data : _output_data, save : 0 } } );
                _input_seq = _data_storage_ref["farey"][''+_q] ;
              }
       }

// callback fn for responses from each sequence of n-th order
var _callback_run_sequence_fn = function( _curr_frac, _curr_value, _upper_bound )
{
    var _dist = ( Math.abs( _upper_bound - _curr_value ) ).roundTo( 2 );
    self.postMessage( { id : "output", ret : { out_channel : _output_channel,
                        features : _features, text : _output_text,
                        data : "Running " + _curr_frac.join( "," ) + " - dist to upper bound " + _dist,
                        service : _service, save : 0 } } );
}

var _cusp_callback_fn = function( _current_frac, _runner, _sequence_length )
{
    var _out = ( _runner / _sequence_length * 100.0 ).roundTo( 2 ) + "" ;
    self.postMessage( { id : "output", ret : { out_channel : _output_channel, features : _features, text : _output_text,
                        data : "Resolving cusp at fraction " + _current_frac.lpad( " ", 6 ).rpad( " ", 6 ) + " - " + _out.rpad( " ", 5 ) + "%",
                        service : _service, save : 0 } } );
}

	_order = _order > 0 ? _order : _q ;
    _input_seq = _pq_farey_obj.farey_sequence( _order > 0 ? _order : _q, _start_frac, _end_frac, _callback_run_sequence_fn );
    self.postMessage( { id : "output", ret : { out_channel : _output_channel, features : _features, text : _output_text,
                        data : "Farey sequence completed: now processing the cusp",
                        service : _service, save : 0 } } );

         var _ret_trace = _glob_inline_worker_discreteness_locus.pq_cusp( _pq_farey_obj, _input_seq, _order, _start_frac.array(), _end_frac.array(), _cusp_callback_fn );
         var _pq_word = circles_lib_word_pq_translate( _p, _q );
         if ( _ret_trace == null ) _output_text = "<red>Error while computing the cusp "+_pq_for_cusp+"</red>" ;
         else _output_text = "<greenshock>Tr("+_pq_for_cusp+") = "+( _ret_trace.formula() )+"</greenshock>" ;
         break;
         default:
         break ;
    }

		if ( _pleatingrays_flag )
		{
			_keys = _boundary.keys_associative(), _pl_rays_array = [] ;
			_n_keys = is_array( _keys ) ? _keys.length : 0 ;
		    for( var _i = 0 ; _i < _n_keys ; _i++ )
		    {
				if ( _pleatingrays_mask & _DLOCUS_PLEATING_RAY_POSITIVE_CLASS )
				_pl_rays_array.push( _glob_inline_worker_discreteness_locus.pleating_positive_ray( new farey( _keys[_i] ), _boundary[ _keys[_i] ],
									 _eq_solution, _pleatingrays_max_steps, _bounding_rect, null ) );
         		if ( _pleatingrays_mask & _DLOCUS_PLEATING_RAY_NEGATIVE_CLASS )
				_pl_rays_array.push( _glob_inline_worker_discreteness_locus.pleating_negative_ray( new farey( _keys[_i] ), _boundary[ _keys[_i] ],
								     _eq_solution, _pleatingrays_max_steps, _bounding_rect, null ) );
			}

			self.postMessage( { id : "output", ret : { out_channel : _output_channel, features : _features,
		        text : _pl_rays_array.clone(), data : "Computing the pleating rays", service : "pleatingrays", save : 0 } } );
		}

    // in case, results have been accumulated but not posted yet
    if ( ( _append_count % _out_queue_at_every_n_steps ) != 0 || _glob_inline_worker_run_flag != 0 )
    {
        _append_count = 0 ;
        if ( _service.strcmp( "dlocus" ) )
        {
            _output_text = multithread_discreteness_locus_output_discreteness_locus_chunk( _chunk_counter, _boundary, _crlf );
            _chunk_counter++ ;
            _boundary.flush_associative();
        }
        else if ( _service.strcmp( "cusp" ) )
        {
            _features["farey"] = _input_seq.clone();
            _features['farey_q'] = _q ;
        }

        self.postMessage( { id : "output", ret : { out_channel : _output_channel, features : _features,
                            text : _output_text, data : _output_data,
                            service : _service, save : 1,
                            pq_trace : _ret_trace, pq_cusp : _pq_for_cusp } } );
        _output_text = "" ;
    }

    if( _glob_inline_worker_run_flag != 0 )
    self.postMessage( { id : "end", ret : { out_channel : _output_channel, features : _features, service : _service } } );
}

function multithread_discreteness_locus_output_discreteness_locus_chunk( _chunk_counter, _boundary, _crlf )
{
    var _output_text = [] ;
        _output_text.push( "key"+_chunk_counter );
    var _keys = _boundary != null ? _boundary.keys_associative() : [], _tr ;
    if ( is_array( _keys ) )
    {
        for( var _k = 0 ; _k < _keys.length ; _k++ )
        {
            _tr = _boundary[ _keys[_k] ] ;
            _output_text.push( "["+_keys[_k]+":"+_tr.formula()+"]" );
        }
    }
    return _output_text ;
}

function multithread_discreteness_locus_output_rays_chunk( _pl_rays )
{
	var _output_text = [], _ray ;
	for( var _i = 0 ; _i < _pl_rays.length ; _i++ )
	{
		_ray = _pl_rays[_i] ;
		_output_text.push( "["+( _ray.work( function( _pt ) { return _pt.formula(); } ).join( "," ) )+"]" );
	}
	return _output_text ;
}