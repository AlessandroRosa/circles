function CIRCLESmultithreadingRNGfunctionGET( probability_rng_method )
{
		 var _rng_obj = new RNG(), _mt_obj = new MersenneTwister(), _marz_obj = new MarsagliaZamanRndGen(), _cmwc_obj = new CMWC();
     var _rnd = null ;
		 switch( probability_rng_method )
		 {
				 case RNG_BUILT_IN:
				 _rnd = function() { return Math.random(); }
				 break ;
				 case RNG_UNIFORM:
				 _rnd = function() { return _rng_obj.uniform(); }
				 break ;
				 case RNG_NORMAL:
				 // -6 ___/\___ +6 // this normal distribution ranges from -6 to +6
				 _rnd = function() { return ( _rng_obj.normal() + 6 ) / 12 ; }
				 break ;
				 case RNG_EXPONENTIAL:
				 // 0 ___/\___ 10 // this normal distribution ranges from 0 to 12
				 _rnd = function() { return _rng_obj.exponential() / 12 ; }
				 break ;
				 case RNG_POISSON:
				 // 0 ___/\___ 10 // this normal distribution ranges from 0 to 10
				 _rnd = function() { return _rng_obj.poisson() / 10.0 ; }
				 break ;
				 case RNG_GAMMA:
				 // 0 ___/\___ 13 // this normal distribution ranges from 0 to 13
				 _rnd = function() { return _rng_obj.gamma(1) / 13 ; }
				 break ;
				 case RNG_MERSENNE_TWISTER: // already normalized from 0 to 1
				 _rnd = function() { return _mt_obj.genrand_real1(); }
				 break ;
				 case RNG_SINE: // already normalized from 0 to 1
				 _rnd = function() { return _rng_obj.sin(); }
				 break ;
				 case RNG_COMPLEMENTARY_MULTIPLY_WITH_CARRY: // already normalized from 0 to 1
         _cmwc_obj.init_rand( ( new Date() ).getMilliseconds() );
				 _rnd = function() { return _cmwc_obj.rand(); }
				 break ;
         case RNG_MARSAGLIA_ZAMAN:
         _marz_obj.init();
				 _rnd = function() { return _marz_obj.rnd_gen(); }
         break ;
				 case RNG_LINEAR_CONGRUENT: // already normalized from 0 to 1
         var _seed = ( new Date() ).getMilliseconds();
				 _rnd = function() { _seed = _rng_obj.linear_congruential( _seed ); return _seed ; }
				 break ;
				 default: _rnd = function() { return Math.random(); } ; break ;
		 }

     return _rnd ;
}

function CIRCLESalgebraicPROCESSrandomPROBABILITY( _probability_array, _LUT_length )
{
    var LUT = [];
    for( var _l = 0 ; _l < _LUT_length ; _l++ ) LUT.push( 0 );

    var _runner = 0, _extent, _p, _e ;
    for( _p = 0 ; _p < _probability_array.length ; _p++ )
    {
         _extent = Math.floor( _probability_array[_p] * _LUT_length );
         for( _e = 0 ; _e < _extent ; _e++, _runner++ ) LUT[_runner] = _p ;
    }

    // fill if missing entries
    if ( _runner < _LUT_length ) for( var _e = _runner ; _e < _LUT_length ; _e++, _runner++ ) LUT[_runner] = _probability_array.length - 1 ;
    return LUT ;
}

function CIRCLESalgebraicSTART( objs, settings )
{
    var _config = settings['config'].split( "@" );
    var process = safe_int( _config[1], PROCESS_BREADTHFIRST );
    var fixedpoints_io = safe_int( _config[3], FIXEDPOINTS_IO_INPUT );
    switch( process )
    {
        case PROCESS_BREADTHFIRST:
        if ( fixedpoints_io == FIXEDPOINTS_IO_INPUT )
        CIRCLESalgebraicPROCESSdeterministicBREADTHFIRSTfixedpointsinput( objs, settings );
        break ;
        case PROCESS_INDEXSEARCH:
        if ( fixedpoints_io == FIXEDPOINTS_IO_INPUT )
        CIRCLESalgebraicPROCESSdeterministicINDEXSEARCHfixedpointsinput( objs, settings );
        break ;
        case PROCESS_RANDOM:
        if ( fixedpoints_io == FIXEDPOINTS_IO_INPUT )
        CIRCLESalgebraicPROCESSrandomINPUTFP( objs, settings );
        break ;
        default: break ;
    }
}

function CIRCLESalgebraicOPERATIONScount()
{
    var _count = circles_lib_count_dict();
    if ( _glob_process == PROCESS_BREADTHFIRST && _count == 0 ) _count = "(dictionary compilation required)" ;
    else if ( _glob_process == PROCESS_RANDOM && _count == 0 ) _count = Math.pow( 2, _glob_multithread_depth );
    return _count ;
}

function CIRCLESalgebraicMARK( _glob_limitset_array, index )
{
    _index = safe_int( index, UNDET );
    var _s = safe_size( _glob_limitset_array, 0 );
    if ( _s > 0 )
    {
        var CHUNK, _tmp_fp, _fp = new point(), _fp_label, _fp_type, obj, write ;
		  	for( var i = 0 ; i < _s ; i++ )
        {
             if ( index == -1 || index == i )
             {
                 CHUNK = _glob_limitset_array[i] ;
                 _tmp_fp = safe_size( CHUNK, 0 ) > 0 ? CHUNK : CHUNK[0] ;
                 _fp_label = ( CHUNK.length > 1 ) ? CHUNK[1] : "" ;
                 _fp_type = ( CHUNK.length > 2 ) ? CHUNK[3] : "" ;
                 _fp.real = _tmp_fp.real, _fp.imag = _tmp_fp.imag ;
                   
                 obj = { 'type' : '',
                         'x' : _fp.x, 'y' : _fp.y, 'r' : 3,
                         'draw_fn_id' : 2.4,
                         'draw' : YES, 'drawcolor' : DEFAULT_PT_BORDER_COLOR,
                         'fill' : YES, 'fillcolor' : DEFAULT_PT_INTERIOR_COLOR,
                         'linewidth' : 2, 'word' : WORD } ;
                                        
                 write = { "text_corpus" : _fp_type,
                           "text_fontcolor" : DEFAULT_TEXT_COLOR,
                           "text_fontsize" : "8pt",
                           "text_fontfamily" : "Arial",
                           "text_shift_x_canvas" : -10,
                           "text_shift_y_canvas" : -12
                         } ;
                            
                 self.postMessage( { 'id' : "draw",
                                     'obj' : obj,
                                     'method' : 2,
                                     'draw_fn_id' : 2.2,
                                     'counter' : _glob_multithread_operations_counter,
                                     'runner' : _glob_multithread_operations_runner,
                                     'level' : WORD.length
                                   } );
             }
        }
    }
}