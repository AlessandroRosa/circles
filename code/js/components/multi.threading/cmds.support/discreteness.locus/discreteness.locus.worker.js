var _glob_inline_workers_input_data = [] ;
var _glob_inline_worker_run_flag = 0 ;
var _glob_inline_worker_discreteness_locus = null ;
var _glob_inline_worker_fn_pointer = 0 ;
var _glob_inline_worker_op_switch = 0 ;

onmessage = function(e)
{
    switch( e.data.id )
    {
        case "import":
        var _loc = e.data.location ;
        for( var _s = 0 ; _s < e.data.scripts.length ; _s++ ) importScripts( _loc + e.data.scripts[_s] );
        break ;
        case "init":
        for ( var _x in e.data.vars ) if ( e.data.vars.hasOwnProperty( _x ) ) _glob_inline_workers_input_data[ _x ] = e.data.vars[""+_x] ;
        break ;
        case "run":
        if ( _glob_inline_worker_op_switch == 0 ) multithread_discreteness_locus_process();
        else if ( _glob_inline_worker_op_switch == 1 ) multithread_discreteness_locus_pleating_rays_process();
        break ;
        case "stop":
        multithread_discreteness_locus_stop();
        break ;
        default:
        break ;
    }
}

function inline_worker_output_member( ret )
{
    var _out_channel = ret.out_channel, _data = ret.data, _text = ret.text ;
    var _coords = safe_int( ret.features['coords'], NO );
    var _copy = safe_int( ret.features['copy'], NO );
    var _border = safe_int( ret.features['border'], NO );
    var _fill = safe_int( ret.features['fill'], NO );
    var _init = safe_int( ret.features['init'], NO );
    var _save = safe_int( ret.save, NO );

    switch ( ret.service.toLowerCase() )
    {
        case "dlocus":
        if ( _out_channel == OUTPUT_TERMINAL )
        {
            if ( _border )
            {
                if ( safe_size( ret.features['draw_fn'], 0 ) > 0 && safe_size( _text, 0 ) > 0 )
                {
                    _glob_inline_worker_fn_pointer = eval( ret.features['draw_fn'] );
                    _glob_inline_worker_fn_pointer.call( null, _text );
                }
    
                if ( safe_size( ret.features['updates_fn'], 0 ) > 0 )
                {
                    _glob_inline_worker_fn_pointer = eval( ret.features['updates_fn'] );
                    _glob_inline_worker_fn_pointer.call( null, _data, ret.features, "", _fill, _init, _out_channel );
                }
            }

            if ( _text instanceof Array )
            {
                if ( safe_size( ret.features['updates_fn'], 0 ) > 0 )
                {
                    _glob_inline_worker_fn_pointer = eval( ret.features['updates_fn'] );
                    _glob_inline_worker_fn_pointer.call( null, _data, ret.features, "", _fill, _init, _out_channel );
                }
            }
            else if ( safe_size( _text, 0 ) > 0 ) circles_lib_terminal_multicolor_echo( _text );
        }
        else if ( _out_channel == OUTPUT_SCREEN && _border )
        {
            if ( safe_size( ret.features['draw_fn'], 0 ) > 0 && safe_size( _text, 0 ) > 0 )
            {
                _glob_inline_worker_fn_pointer = eval( ret.features['draw_fn'] );
                _glob_inline_worker_fn_pointer.call( null, _text );
            }

            if ( safe_size( ret.features['updates_fn'], 0 ) > 0 )
            {
                _glob_inline_worker_fn_pointer = eval( ret.features['updates_fn'] );
                _glob_inline_worker_fn_pointer.call( null, _data, ret.features, "", _fill, _init, _out_channel );
            }
        }
        break;
        case "cusp":
        var _boundary = ret.features["farey"], _q = ret.features['farey_q'] ;
        var _ret_pq_trace = ret.pq_trace, _ret_pq_cusp = ret.pq_cusp ;
        var _pq_word = is_array( _data ) ? _data[2] : "" ;
        if ( is_array( _boundary ) && _q > 0 )
        {
            if ( !is_array( _glob_storage["farey"] ) ) _glob_storage["farey"] = [];
            _glob_storage["farey"][''+_q] = _boundary.clone();
        }

        if ( _out_channel == OUTPUT_TERMINAL )
        {
            if ( function_exists( ret.features['updates_fn'] ) )
            {
                var _updates_fn_pointer = eval( ret.features['updates_fn'] );
				if ( _updates_fn_pointer != null )
                {
               		if ( ret.features['updates_fn'].start_with( "PLUGIN" ) && _ret_pq_trace != null )
  					_updates_fn_pointer.call( null, new complex( _ret_pq_trace.real, _ret_pq_trace.imag ), 0 );
                  	else if ( safe_size( _data, 0 ) > 0 )
					_updates_fn_pointer.call( null, _data, ret.features, "", _fill, _init, _out_channel );
				}
									
				if ( safe_size( _text, 0 ) > 0 ) circles_lib_terminal_multicolor_echo( _text );
            }
			else circles_lib_terminal_warning_echo( "No fill allowed: please, open a plug-in first" );
        }
        else if ( _out_channel == OUTPUT_SCREEN )
        {
             if ( safe_size( ret.features['updates_fn'], 0 ) > 0 && _ret_pq_trace != null )
             {
                 var _updates_fn_pointer = eval( ret.features['updates_fn'] );
                 _ret_pq_trace = new complex( _ret_pq_trace.real, _ret_pq_trace.imag );
                 _updates_fn_pointer.call( null, _ret_pq_trace.formula(), ret.features, _pq_word, _fill, _init, _out_channel );
             }
        }
        break;
        case "pleatingrays":
        if ( function_exists( "CIRCLESformsDISCRETENESSLOCUSstoreRAYS" ) ) CIRCLESformsDISCRETENESSLOCUSstoreRAYS( _text );
        break ;
        default: break ;
    }
}

function inline_worker_start_member( ret )
{
    var _out_channel = ret.out_channel ;
    if ( _out_channel.match_bit_mask( OUTPUT_TERMINAL, OUTPUT_SCREEN ) )
    {
       if ( function_exists( "CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYbegin" ) )
	   CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYbegin();
       if ( function_exists( "CIRCLESformsDISCRETENESSLOCUSdrawCANVAS" ) )
	   CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( [ 2, 8, 1 ] );
         
	   if ( safe_size( ret.features['start_fn'], 0 ) > 0 )
       eval( ret.features['start_fn'] ).call( null, ret.service.toLowerCase(), ret.features.boundarydef );
    }
}

function inline_worker_end_member( ret )
{
    var _out_channel = ret.out_channel ;
    var _pl_rays_flag = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    if ( _out_channel == OUTPUT_TERMINAL )
    {
         circles_lib_terminal_info_echo( "Discreteness locus computation is over" );
         circles_lib_terminal_wait_icon( NO, 0, _glob_terminal_form_suffix );
    }
    
    if ( _out_channel.match_bit_mask( OUTPUT_TERMINAL, OUTPUT_SCREEN ) )
    {
         if ( _pl_rays_flag ) CIRCLESformsDISCRETENESSLOCUSrecastdataRAYS();

         if ( safe_size( ret.features['end_fn'], 0 ) > 0 && 
              ret.features['end_fn'].strcmp( "CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYend" ) )
         {
             var _end_fn_pointer = eval( ret.features['end_fn'] );
             _end_fn_pointer.call( null, $( "#CIRCLESformsDISCRETENESSLOCUSrescaleCHECKBOX" ).prop( "checked" ) ? YES : NO );
         }
    }
}

function inline_worker_stop_member( ret )
{
    var _out_channel = ret.out_channel ;
    if ( _out_channel == OUTPUT_TERMINAL )
    {
        circles_lib_terminal_info_echo( "Computation has been aborted by user" );
        circles_lib_terminal_wait_icon( NO, 0, _glob_terminal_form_suffix );
    }

    if ( _out_channel == OUTPUT_SCREEN )
    {
        if ( safe_size( ret.features['stop_fn'], 0 ) > 0 )
        {
           var _stop_fn_pointer = eval( ret.features['stop_fn'] );
           _stop_fn_pointer.call( null );
        }
    }
}