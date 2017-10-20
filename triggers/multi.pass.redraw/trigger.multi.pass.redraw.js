/* BOOST THE CONVERGENCE TO THE LIMIT SET OF A PARABOLIC GROUP
   This trigger sets:
   - generator set with all seeds + one commutator
   - sets the random table
   - set the fixed points of the commutators as the input ones
 */

function trigger_multi_pass_redraw( _silent, _output_channel )
{
    _silent = safe_int( _silent, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
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
            circles_lib_canvas_redraw_wplane_entities(NO,'Multi-pass redrawing');
            return [ RET_OK, "Trigger has been exec with success !" ] ;
        }
        else return [ RET_ERROR, "Trigger run has been halted by user" ] ;
    }
}