/* BOOST THE CONVERGENCE TO THE LIMIT SET OF A PARABOLIC GROUP
   This trigger sets:
   - generator set with all seeds + one commutator
   - sets the random table
   - set the fixed points of the commutators as the input ones
 */

function trigger_gens_set_01( _silent, _out_channel )
{
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _sd_n = circles_lib_count_seeds();
    var _gens_set_n = circles_lib_count_gens_set_model();
    var _fp_n = circles_lib_count_fixed_points();
    var _rnd_n = circles_lib_count_rnd_probabilities();
    if ( _sd_n == 0 ) return [ RET_ERROR, "Can't run this trigger: no seeds have been registered yet" ] ;
    else if ( _sd_n % 2 == 1 ) return [ RET_ERROR, "Can't run this trigger: seeds must be even in number" ] ;
    else
    {
				var _b_go = ( ( _gens_set_n > 0 || _fp_n > 0 ) && !_silent ) ? confirm( "Do you want to run this trigger ?" + _glob_crlf + "(All previous settings will be lost)" ) : YES ;
        if ( _b_go )
        {
            // destroy previous settings
            circles_lib_gens_set_bomb();
            if ( circles_lib_depth_get() < 16 ) circles_lib_depth_set( is_64bits_architecture() ? 21 : 18 );
            circles_lib_process_set( PROCESS_RANDOM );
            circles_lib_method_set( METHOD_ALGEBRAIC );
            _glob_fixedpt_io = FIXEDPOINTS_IO_INPUT ;
            if ( circles_lib_get_target_plane() == Z_PLANE ) circles_lib_set_target_plane( "wplane" ) ;
            circles_lib_menu_entries_init();
            circles_lib_menu_entries_update();

            // get alphabet
            var _alphabet = circles_lib_alphabet_get();
            // fill the gens set
            var _commutator_word = circles_lib_word_commutator_get( _alphabet[0], _glob_seeds_array );
            $.each( _alphabet, function( _i, _symbol ) { _glob_gens_set_model_array.push( _symbol ); } );
            _glob_gens_set_model_array.push( _commutator_word );
            _glob_gens_set_model_array.push( circles_lib_word_inverse_get( _commutator_word ) );
            circles_lib_gens_set_initflag_set( YES );
            
            // fill the gens set random table
            if ( safe_size( _glob_rnd_probability_array, 0 ) == 0 )
            {
	             var _commutator_probability = 0.029 ;
	             var _seed_probability = ( 1.0 - _commutator_probability * 2.0 ) / safe_size( _alphabet, 1 );
	             $.each( _alphabet, function( _i, _letter ) { _glob_rnd_probability_array.push( _seed_probability ); } );
	             _glob_rnd_probability_array.push( _commutator_probability, _commutator_probability );
	             if ( circles_lib_plugin_is_visible( "terminal" ) )
	             {
									_glob_terminal.echo( "Current random probabilities table is empty" );
									_glob_terminal.echo( "Attempting to its default generation" );
							 }
						}

            // computes all commutators and related fixed points, then put'em all into their proper array
            var _ret_chunk = circles_lib_fixedpoints_add_from_commutators( 1, _out_channel );
            		_ret_chunk = circles_lib_gens_set_build( _out_channel, YES, YES, NO, YES );
            $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
            $('[id$=renderBTN]').css('color',COLOR_ERROR);
            return [ RET_OK, "Trigger has been exec with success !" ] ;
        }
        else return [ RET_ERROR, "Trigger run has been halted by user" ] ;
    }
}