/*
    JS Discreteness locus class library is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Code by Alessandro Rosa - zandor_zz@yahoo.it

var _DLOCUS_NONE = 0 ;
var _DLOCUS_MASKIT = 1 ;
var _DLOCUS_GRANDMA = 2 ;
var _DLOCUS_EARLE = 3 ;
var _DLOCUS_JORGENSEN = 4 ;

var _DLOCUS_MAX_ITERATE = 20 ;
var _DLOCUS_DEFAULT_ACCURACY = Math.pow( 10, -3 ) ;

var _DLOCUS_PLEATING_RAY_MAX_STEPS = 30 ;
var _DLOCUS_PLEATING_RAY_POSITIVE_CLASS = 1 ;
var _DLOCUS_PLEATING_RAY_NEGATIVE_CLASS = 2 ;

var _DLOCUS_TRACE_FIX_DEFAULT_OP = -1 ;
var _DLOCUS_TRACE_FIX_A_OP = 0 ;
var _DLOCUS_TRACE_FIX_B_OP = 1 ;
var _DLOCUS_TRACE_FIX_ABab_OP = 2 ;

if ( typeof is_array != "function" ) function is_array( _obj ) { return _obj instanceof Array ? 1 : 0 ; }
if ( typeof is_complex != "function" ) function is_complex( _obj ) { return _obj instanceof complex ? 1 : 0 ; }
if ( typeof is_integer != "function" ) function is_integer( _obj ) { return is_number( _obj ) ? ( Math.floor( _obj ) == _obj ? 1 : 0 ) : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj ) { return ( _obj instanceof Number || typeof _obj == "number" ) ? 1 : 0 ; }
if ( typeof is_rational != "function" ) function is_rational( _obj ) { return is_number( _obj ) ? !is_integer( _obj ) : 0 ; }
if ( typeof is_string != "function" ) function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; }

if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

function discreteness_locus()
{
    this.zero = new complex( 0, 0 ) ;
    this.real_unit = new complex( 1.0, 0 ) ;
    this.imag_unit = new complex( 0, 1.0 ) ;
    this.real_two = new complex( 2.0, 0 ) ;
    this.imag_two = new complex( 0, 2.0 ) ;

    // default bounding farey fractions
    this.farey_seq_start = new farey( 0, 1 );
    this.p2q2 = new farey( 1, 0 );
    this.farey_seq_end = new farey( 1, 1 ) ;

    this.eq_solution = this.real_two ;

    this.accuracy = _DLOCUS_DEFAULT_ACCURACY ;
    this.dz = new complex( this.accuracy, this.accuracy ) ;
    this.max_iterate = _DLOCUS_MAX_ITERATE ;

    this.init_mode = _DLOCUS_MASKIT ;
    this.starting_pt = this.imag_two ;
    this.stop = 0 ;
    this.commutator_trace = new complex( -2.0, 0 ) ;    
    this.traces = null ;
    this.trace_fix_op = _DLOCUS_TRACE_FIX_DEFAULT_OP ;
    
    this.pleating_ray_max_steps = _DLOCUS_PLEATING_RAY_MAX_STEPS ;
    this.pleating_ray_threshold_accuracy = Math.pow( 10, -1 ) ;
    this.pleating_ray_step_rate = Math.pow( 10, -1 ) ;
    this.pleating_ray_forward_factor = 2.0 ;
    this.pleating_ray_backward_factor = 0.5 ;

    this.custom_params = [] ;
    /*  CUSTOM PARAMS
        index   role
        0       start pt
        1       trace (a)
        2       trace (b)
        3       trace (ABab)
        4       equation solution
    */

		this.p1q1 = new farey() ;
		this.p2q2 = new farey() ;
		this.p3q3 = new farey() ;
    
    this.sp = [] ;
    this.sp['2i'] = this.imag_unit.mul(2.0) ;
    this.sp['4i'] = this.imag_unit.mul(4.0) ;

    this.cm1 = new complex_matrix( 2, 2 );
    this.cm2 = new complex_matrix( 2, 2 );

    this.pq_newton_z1 = 0 ;
    this.pq_newton_step = 0 ;

    this.discreteness_locus_presets = [];
    /* index     role
		   0				 starting trace
		   1         trace a
		   2         trace b
		   3         solution of equation
		*/
    this.discreteness_locus_presets[ "maskit" ] = [ this.imag_two, this.real_two, this.real_two, this.commutator_trace, this.real_two ] ;
    this.discreteness_locus_presets[ "grandma" ] = [ this.real_two, this.real_two.add( 0.0000000000001 ), this.real_two.add( 0.0000000000001 ), this.commutator_trace, this.real_two.add( 0.0000000000001 ) ] ;
    this.discreteness_locus_presets[ "earle" ] = [ new complex( 0.00008682331672357299, 0.004129628846253897 ), this.real_two, this.real_two, this.commutator_trace, this.real_two ] ;
    this.discreteness_locus_presets[ "jorgensen" ] = [ this.real_two, this.real_two, this.real_two, this.commutator_trace, this.real_two ] ;
}

discreteness_locus.prototype.reset = function()
{
    // default bounding farey fractions
    this.farey_seq_start = new farey( 0, 1 );
    this.p2q2 = new farey( 1, 0 );
    this.farey_seq_end = new farey( 1, 1 ) ;

    this.eq_solution = this.real_two ;

    this.accuracy = _DLOCUS_DEFAULT_ACCURACY ;
    this.dz = new complex( this.accuracy, this.accuracy ) ;
    this.max_iterate = _DLOCUS_MAX_ITERATE ;

    this.init_mode = _DLOCUS_MASKIT ;
    this.starting_pt = this.imag_two ;
    this.stop = 0 ;
    this.commutator_trace = new complex( -2.0, 0 ) ;    
    this.traces = null ;
    this.trace_fix_op = _DLOCUS_TRACE_FIX_DEFAULT_OP ;

    this.custom_flag = 0 ;
    this.custom_params = [] ;
    
    this.pleating_ray_max_steps = _DLOCUS_PLEATING_RAY_MAX_STEPS ;
    this.pleating_ray_threshold_accuracy = Math.pow( 10, -1 ) ;
    this.pleating_ray_step_rate = Math.pow( 10, -1 ) ;
    this.pleating_ray_forward_factor = 2.0 ;
    this.pleating_ray_backward_factor = 0.5 ;

		this.p1q1 = new farey() ;
		this.p2q2 = new farey() ;
		this.p3q3 = new farey() ;
    
    this.sp = [] ;
    this.sp['2i'] = this.imag_unit.mul(2.0) ;
    this.sp['4i'] = this.imag_unit.mul(4.0) ;

    this.cm1 = new complex_matrix( 2, 2 );
    this.cm2 = new complex_matrix( 2, 2 );

    this.pq_newton_z1 = 0 ;
    this.pq_newton_step = 0 ;
}

discreteness_locus.prototype.get_preset = function( _init_mode )
{
    switch( _init_mode )
    {
        case _DLOCUS_MASKIT: return this.discreteness_locus_presets[ "maskit" ] ; break ;
        case _DLOCUS_GRANDMA: return this.discreteness_locus_presets[ "grandma" ] ; break ;
        case _DLOCUS_EARLE: return this.discreteness_locus_presets[ "earle" ] ; break ;
        case _DLOCUS_JORGENSEN: return this.discreteness_locus_presets[ "jorgensen" ] ; break ;
        default: return null ; break ;
    }
}

discreteness_locus.prototype.set_pleating_rays_max_iterate = function( _m ) { this.pleating_ray_max_steps = _m ;   }
discreteness_locus.prototype.get_pleating_rays_max_iterate = function() { return this.pleating_ray_max_steps ; }

discreteness_locus.prototype.set_pleating_rays_step_rate = function( _sr ) { this.pleating_ray_step_rate = _sr ; }
discreteness_locus.prototype.get_pleating_rays_step_rate = function() { return this.pleating_ray_step_rate ; }

discreteness_locus.prototype.set_pleating_rays_threshold_accuracy = function( _a ) { _a = Math.abs( _a ) ; this.pleating_ray_threshold_accuracy = _a > 1 ? Math.pow( 10, _a ) : _a ; }
discreteness_locus.prototype.get_pleating_rays_threshold_accuracy = function() { return this.pleating_ray_threshold_accuracy ; }

discreteness_locus.prototype.set_pleating_rays_forward_factor = function( _f ) { this.pleating_ray_forward_factor = _f ;   }
discreteness_locus.prototype.get_pleating_rays_forward_factor = function() { return this.pleating_ray_forward_factor ; }

discreteness_locus.prototype.set_pleating_rays_backward_factor = function( _f ) { this.pleating_ray_backward_factor = _f ;   }
discreteness_locus.prototype.get_pleating_rays_backward_factor = function() { return this.pleating_ray_backward_factor ; }

discreteness_locus.prototype.set_trace_fix_op = function( _op ) { this.trace_fix_op = _op ;  }
discreteness_locus.prototype.get_trace_fix_op = function() { return this.trace_fix_op ; }

discreteness_locus.prototype.set_starting_pt = function( _mu ) { this.starting_pt = _mu ; }
discreteness_locus.prototype.get_starting_pt = function() { return this.starting_pt ; }

discreteness_locus.prototype.set_commutator_trace = function( _tr_comm ) { this.commutator_trace = _tr_comm ; }
discreteness_locus.prototype.get_commutator_trace = function() { return this.commutator_trace ; }

discreteness_locus.prototype.set_eq_solution = function( _eq_sol ) { this.eq_solution = _eq_sol ; }
discreteness_locus.prototype.get_eq_solution = function() { return this.eq_solution ; }

discreteness_locus.prototype.set_max_iterate = function( _steps ) { this.max_iterate = Math.max( 0, _steps ) ; }
discreteness_locus.prototype.get_max_iterate = function() { return this.max_iterate ; }

discreteness_locus.prototype.set_accuracy = function( accuracy ) { accuracy = Math.abs( accuracy ) ; this.accuracy = accuracy > 1 ? Math.pow( 10, -accuracy ) : accuracy ; }
discreteness_locus.prototype.get_accuracy = function() { return this.accuracy ; }

discreteness_locus.prototype.get_init_mode = function() { return this.init_mode ; }
discreteness_locus.prototype.set_init_mode = function( _init_mode )
{
    this.init_mode = safe_float( _init_mode, _DLOCUS_NONE );
    switch( this.init_mode )
    {
        case _DLOCUS_MASKIT:
        this.starting_pt = ( this.custom_params[0] != null ) ? this.custom_params[0] : this.imag_two ;
        this.set_eq_solution( this.custom_params[4] != null ? this.custom_params[4] : this.real_two );
        break ;
        case _DLOCUS_GRANDMA:
        this.starting_pt = ( this.custom_params[0] != null ) ? this.custom_params[0] : this.real_two ;
        this.set_eq_solution( this.custom_params[4] != null ? this.custom_params[4] : this.real_two );
        break ;
        case _DLOCUS_EARLE:
        this.starting_pt = ( this.custom_params[0] != null ) ? this.custom_params[0] : new complex( 0.00008682331672357299, 0.004129628846253897 ) ;
        this.set_eq_solution( this.custom_params[4] != null ? this.custom_params[4] : this.real_two );
        break ;
        case _DLOCUS_JORGENSEN:
        this.starting_pt = ( this.custom_params[0] != null ) ? this.custom_params[0] : this.real_two ;
        this.set_eq_solution( this.custom_params[4] != null ? this.custom_params[4] : this.real_two );
        break ;
        default:
        break ;
    }
    
    return [ this.starting_pt, this.eq_solution ] ;
}

discreteness_locus.prototype.set_custom_params = function()
{
    if ( is_array( arguments[0] ) ) arguments = arguments[0] ;
    this.custom_params = [] ;
    for( var _i = 0 ; _i < arguments.length ; _i++ ) this.custom_params.push( new complex( arguments[_i].real, arguments[_i].imag ) );
}

discreteness_locus.prototype.init = function()
{
    switch( this.init_mode )
    {
        case _DLOCUS_MASKIT:
        return this.init_maskit( arguments[0] ) ;
        break ;
        case _DLOCUS_GRANDMA:
        return this.init_grandma( arguments[0] ) ;
        break ;
        case _DLOCUS_EARLE:
        return this.init_earle( arguments[0] ) ;
        break ;
        case _DLOCUS_JORGENSEN:
        return this.init_jorgensen( arguments[0] ) ;
        break ;
        default:
        return null ;
        break ;
    }
}

discreteness_locus.prototype.init_maskit = function( _mu )
{
    // remember we need tr a, tr b and tr aB, where B is the inverse of b
    // generator a
    this.cm1.set_params( [ _mu.opposite().mul( this.imag_unit ), this.imag_unit.opposite(),
                           this.imag_unit.opposite(), this.zero ] );
    // NOTE: it doesn't make sense to fix trace "a" for maskit slice construction
    if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_DEFAULT_OP ) // default behavior
    {
        // generator b
        this.cm2.set_params( [ this.real_unit, this.real_two,
                               this.zero, this.real_unit ] );
        return [ this.cm1.trace().mul( _mu.real < 0 ? -1 : 1 ), this.cm2.trace(), this.cm1.mul( this.cm2.inv() ).trace() ] ;
    }
    else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_ABab_OP ) // trace ABab is fixed
    {
        // generator b
        this.cm2.set_params( [ this.real_unit, this.real_two,
                               this.zero, this.real_unit ] );
        this.sp['t_a'] = this.cm1.trace() ;
        this.sp['t_b'] = this.cm2.trace() ;
        /* from markov identity : Tr_abAB = (tr_a)^2 + (tr_b)^2 + (tr_ab)^2 - tr_a * tr_b * tr_ab - 2
           and setting k : -(tr_a * tr_b),
                       j : (tr_a)^2 + (tr_b)^2 - 2 - Tr_abAB,
                       x : tr_ab
           we have x^2 + kx + j = 0
        */
        this.sp['k'] = this.sp['t_a'].mul( this.sp['t_b'] ).opposite();
        this.sp['j'] = this.sp['t_a'].pow( 2.0 ).add( this.sp['t_b'].pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
        this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
        this.sp['t_aB'] = this.sp['k'].opposite().sub( this.sp['delta'].sqrt() ).div( 2.0 ) ;
        return [ this.sp['t_a'], this.sp['t_b'], this.sp['t_aB'] ] ;
    }
    else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_B_OP ) // trace b is fixed
    {
        this.sp['t_a'] = this.cm1.trace() ;
        this.sp['t_b'] = this.custom_params[2] ;
        /* from markov identity : Tr_abAB = (tr_a)^2 + (tr_b)^2 + (tr_ab)^2 - tr_a * tr_b * tr_ab - 2
           and setting k : -(tr_a * tr_b),
                       j : (tr_a)^2 + (tr_b)^2 - 2 - Tr_abAB,
                       x : tr_ab
           we have x^2 + kx + j = 0
        */
        this.sp['k'] = this.sp['t_a'].mul( this.sp['t_b'] ).opposite();
        this.sp['j'] = this.sp['t_a'].pow( 2.0 ).add( this.sp['t_b'].pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
        this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
        this.sp['t_aB'] = this.sp['k'].opposite().sub( this.sp['delta'].sqrt() ).div( 2.0 ) ;
        return [ this.sp['t_a'], this.sp['t_b'], this.sp['t_aB'] ] ;
    }
}

discreteness_locus.prototype.init_grandma = function( _t_a, _t_b )
{
		if ( this.trace_fix_op.is_one_of( _DLOCUS_TRACE_FIX_DEFAULT_OP, _DLOCUS_TRACE_FIX_B_OP, _DLOCUS_TRACE_FIX_ABab_OP ) ) { _t_a = arguments[0], _t_b = this.custom_params[2] ; }
		else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_A_OP ) { _t_b = arguments[0], _t_a = this.custom_params[1] ; }

    // remember we need tr a, tr b and tr aB, where B is the inverse of b
    // Starting eq : x^2 - (tr_a * tr_b)x + tr^2_a + tr^2_b - 2 - tr_abAB
    this.sp['k'] = _t_a.mul( _t_b ).opposite() ;
    this.sp['j'] = _t_a.pow( 2.0 ).add( _t_b.pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
    // and it turns into : x^2 + kx + j = 0
    this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
    this.sp['t_ab'] = ( this.sp['k'].opposite().add( this.sp['delta'].sqrt() ) ).div( 2.0 ) ;
    
    this.sp['z0'] = ( this.sp['t_ab'].sub( 2.0 ) ).mul( _t_b ).div( _t_b.mul( this.sp['t_ab'] ).sub( _t_a.mul(2.0) ).add( this.sp['t_ab'].mul( this.imag_two ) ) ) ;

    this.sp['t_a_t_ab'] = _t_a.mul( this.sp['t_ab'] );
    this.sp['2t_b'] = _t_b.mul( 2.0 );
    this.sp['2t_ab'] = this.sp['t_ab'].mul( 2.0 );

    if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_DEFAULT_OP ) // default behavior
    {
        // generator a
        this.cm1.set_params( [ _t_a.div(2.0),
                               this.sp['t_a_t_ab'].sub(this.sp['2t_b']).add(this.sp['4i']).div( this.sp['2t_ab'].add(4.0).mul(this.sp['z0']) ),
                               this.sp['t_a_t_ab'].sub(this.sp['2t_b']).sub(this.sp['4i']).mul(this.sp['z0']).div(this.sp['2t_ab'].sub(4.0)),
                               _t_a.div(2.0)
                             ] );
        // generator b
        this.cm2.set_params( [ _t_b.sub(this.sp['2i']).div(2.0),
                               _t_b.div(2.0),
                               _t_b.div(2.0),
                               _t_b.add(this.sp['2i']).div(2.0)
                             ] );
        return [ this.cm1.trace(), this.cm2.trace(), this.cm1.mul( this.cm2.inv() ).trace() ] ;
    }
    else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_ABab_OP ) // trace ABab is fixed
    {
        // generator a
        this.cm1.set_params( [ _t_a.div(2.0),
                               this.sp['t_a_t_ab'].sub(this.sp['2t_b']).add(this.sp['4i']).div( this.sp['2t_ab'].add(4.0).mul(this.sp['z0']) ),
                               this.sp['t_a_t_ab'].sub(this.sp['2t_b']).sub(this.sp['4i']).mul(this.sp['z0']).div(this.sp['2t_ab'].sub(4.0)),
                               _t_a.div(2.0)
                             ] );
        // generator b
        this.cm2.set_params( [ _t_b.sub(this.sp['2i']).div(2.0),
                               _t_b.div(2.0),
                               _t_b.div(2.0),
                               _t_b.add(this.sp['2i']).div(2.0)
                             ] );
        this.sp['t_a'] = this.cm1.trace() ;
        this.sp['t_b'] = this.cm2.trace() ;
        /* from markov identity : Tr_abAB = (tr_a)^2 + (tr_b)^2 + (tr_ab)^2 - tr_a * tr_b * tr_ab - 2
           and setting k : -(tr_a * tr_b),
                       j : (tr_a)^2 + (tr_b)^2 - 2 - Tr_abAB,
                       x : tr_ab
           we have x^2 + kx + j = 0
        */
        this.sp['k'] = this.sp['t_a'].mul( this.sp['t_b'] ).opposite();
        this.sp['j'] = this.sp['t_a'].pow( 2.0 ).add( this.sp['t_b'].pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
        this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
        this.sp['t_aB'] = this.sp['k'].opposite().sub( this.sp['delta'].sqrt() ).div( 2.0 ) ;
        return [ this.sp['t_a'], this.sp['t_b'], this.sp['t_aB'] ] ;
    }
    else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_A_OP ) // trace a is fixed
    {
        // generator b
        this.cm2.set_params( [ _t_b.sub(this.sp['2i']).div(2.0),
                               _t_b.div(2.0),
                               _t_b.div(2.0),
                               _t_b.add(this.sp['2i']).div(2.0)
                             ] );
        this.sp['t_a'] = this.custom_params[1] ;
        this.sp['t_b'] = this.cm2.trace() ;
        /* from markov identity : Tr_abAB = (tr_a)^2 + (tr_b)^2 + (tr_ab)^2 - tr_a * tr_b * tr_ab - 2
           and setting k : -(tr_a * tr_b),
                       j : (tr_a)^2 + (tr_b)^2 - 2 - Tr_abAB,
                       x : tr_ab
           we have x^2 + kx + j = 0
        */
        this.sp['k'] = this.sp['t_a'].mul( this.sp['t_b'] ).opposite();
        this.sp['j'] = this.sp['t_a'].pow( 2.0 ).add( this.sp['t_b'].pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
        this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
        this.sp['t_aB'] = this.sp['k'].opposite().sub( this.sp['delta'].sqrt() ).div( 2.0 ) ;
        return [ this.sp['t_a'], this.sp['t_b'], this.sp['t_aB'] ] ;
    }
    else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_B_OP ) // trace b is fixed
    {
        // generator a
        this.cm1.set_params( [ _t_a.div(2.0),
                               this.sp['t_a_t_ab'].sub(this.sp['2t_b']).add(this.sp['4i']).div( this.sp['2t_ab'].add(4.0).mul(this.sp['z0']) ),
                               this.sp['t_a_t_ab'].sub(this.sp['2t_b']).sub(this.sp['4i']).mul(this.sp['z0']).div(this.sp['2t_ab'].sub(4.0)),
                               _t_a.div(2.0)
                             ] );
        this.sp['t_a'] = this.cm1.trace() ;
        this.sp['t_b'] = this.custom_params[2] ;
        /* from markov identity : Tr_abAB = (tr_a)^2 + (tr_b)^2 + (tr_ab)^2 - tr_a * tr_b * tr_ab - 2
           and setting k : -(tr_a * tr_b),
                       j : (tr_a)^2 + (tr_b)^2 - 2 - Tr_abAB,
                       x : tr_ab
           we have x^2 + kx + j = 0
        */
        this.sp['k'] = this.sp['t_a'].mul( this.sp['t_b'] ).opposite();
        this.sp['j'] = this.sp['t_a'].pow( 2.0 ).add( this.sp['t_b'].pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
        this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
        this.sp['t_aB'] = this.sp['k'].opposite().sub( this.sp['delta'].sqrt() ).div( 2.0 ) ;
        return [ this.sp['t_a'], this.sp['t_b'], this.sp['t_aB'] ] ;
    }
}

discreteness_locus.prototype.init_earle = function( _d )
{
    // remember we need tr a, tr b and tr aB, where B is the inverse of b
    this.sp['d1'] = _d.pow(2.0).add( this.real_unit ).div( _d ) ;
    this.sp['d2'] = _d.pow(3.0).div( _d.pow(2.0).mul( 2.0 ).add( this.real_unit ) ) ;
    this.sp['d3'] = _d.pow(2.0).mul(2.0).add( this.real_unit ).div( _d ) ;
    this.sp['d4'] = _d ;
    if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_DEFAULT_OP ) // default behavior
    {
        // generator a
        this.cm1.set_params( [ this.sp['d1'], this.sp['d2'],
                               this.sp['d3'], this.sp['d4'] ] );
        // generator b
        this.cm2.set_params( [ this.sp['d1'], this.sp['d2'].opposite(),
                               this.sp['d3'].opposite(), this.sp['d4'] ] );
        return [ this.cm1.trace(), this.cm2.trace(), this.cm1.mul( this.cm2.inv() ).trace() ] ;
    }
    else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_ABab_OP ) // when trace ABab is fixed
    {
        // generator a
        this.cm1.set_params( [ this.sp['d1'], this.sp['d2'],
                               this.sp['d3'], this.sp['d4'] ] );
        // generator b
        this.cm2.set_params( [ this.sp['d1'], this.sp['d2'].opposite(),
                               this.sp['d3'].opposite(), this.sp['d4'] ] );
      	/*
        this.sp['t_a'] = this.cm1.trace() ;
        this.sp['t_b'] = this.cm2.trace() ;
           from markov identity : Tr_abAB = (tr_a)^2 + (tr_b)^2 + (tr_ab)^2 - tr_a * tr_b * tr_ab - 2
           and setting k : -(tr_a * tr_b),
                       j : (tr_a)^2 + (tr_b)^2 - 2 - Tr_abAB,
                       x : tr_ab
           we have x^2 + kx + j = 0
        this.sp['k'] = this.sp['t_a'].mul( this.sp['t_b'] ).opposite();
        this.sp['j'] = this.sp['t_a'].pow( 2.0 ).add( this.sp['t_b'].pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
        this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
        this.sp['t_aB'] = this.sp['k'].opposite().sub( this.sp['delta'].sqrt() ).div( 2.0 ) ;
        return [ this.sp['t_a'], this.sp['t_b'], this.sp['t_aB'] ] ;
        */
        return [ this.cm1.trace(), this.cm2.trace(), this.cm1.mul( this.cm2.inv() ).trace() ] ;
    }
    else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_A_OP ) // when trace a is fixed
    {
        // generator b
        this.cm2.set_params( [ this.sp['d1'], this.sp['d2'].opposite(),
                               this.sp['d3'].opposite(), this.sp['d4'] ] );
        this.sp['t_a'] = this.custom_params[1] ;
        this.sp['t_b'] = this.cm2.trace() ;
        /* from markov identity : Tr_abAB = (tr_a)^2 + (tr_b)^2 + (tr_ab)^2 - tr_a * tr_b * tr_ab - 2
           and setting k : -(tr_a * tr_b),
                       j : (tr_a)^2 + (tr_b)^2 - 2 - Tr_abAB,
                       x : tr_ab
           we have x^2 + kx + j = 0
        */
        this.sp['k'] = this.sp['t_a'].mul( this.sp['t_b'] ).opposite();
        this.sp['j'] = this.sp['t_a'].pow( 2.0 ).add( this.sp['t_b'].pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
        this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
        this.sp['t_aB'] = this.sp['k'].opposite().sub( this.sp['delta'].sqrt() ).div( 2.0 ) ;
        return [ this.sp['t_a'], this.sp['t_b'], this.sp['t_aB'] ] ;
    }
    else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_B_OP ) // when trace b is fixed
    {
        // generator a
        this.cm1.set_params( [ this.sp['d1'], this.sp['d2'],
                               this.sp['d3'], this.sp['d4'] ] );
        this.sp['t_a'] = this.cm1.trace() ;
        this.sp['t_b'] = this.custom_params[2] ;
        /* from markov identity : Tr_abAB = (tr_a)^2 + (tr_b)^2 + (tr_ab)^2 - tr_a * tr_b * tr_ab - 2
           and setting k : -(tr_a * tr_b),
                       j : (tr_a)^2 + (tr_b)^2 - 2 - Tr_abAB,
                       x : tr_ab
           we have x^2 + kx + j = 0
        */
        this.sp['k'] = this.sp['t_a'].mul( this.sp['t_b'] ).opposite();
        this.sp['j'] = this.sp['t_a'].pow( 2.0 ).add( this.sp['t_b'].pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
        this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
        this.sp['t_aB'] = this.sp['k'].opposite().sub( this.sp['delta'].sqrt() ).div( 2.0 ) ;
        return [ this.sp['t_a'], this.sp['t_b'], this.sp['t_aB'] ] ;
    }
}

discreteness_locus.prototype.init_jorgensen = function( _t_a, _t_b )
{
		if ( this.trace_fix_op.is_one_of( _DLOCUS_TRACE_FIX_DEFAULT_OP, _DLOCUS_TRACE_FIX_B_OP, _DLOCUS_TRACE_FIX_ABab_OP ) ) { _t_a = arguments[0], _t_b = this.custom_params[2] ; }
		else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_A_OP ) { _t_b = arguments[0], _t_a = this.custom_params[1] ; }
    
    // remember we need tr a, tr b and tr aB, where B is the inverse of b
    // Starting eq : x^2 - (tr_a * tr_b)x + tr^2_a + tr^2_b - 2 - tr_abAB
    this.sp['k'] = _t_a.mul( _t_b ).opposite() ;
    this.sp['j'] = _t_a.pow( 2.0 ).add( _t_b.pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
    // and it turns into : x^2 + kx + j = 0
    this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
    this.sp['t_ab'] = ( this.sp['k'].opposite().add( this.sp['delta'].sqrt() ) ).div( 2.0 ) ;
    
    if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_DEFAULT_OP ) // default behavior
    {
        // generator a
        this.cm1.set_params( [ _t_a.sub( _t_b.div( this.sp['t_ab'] ) ), _t_a.div( this.sp['t_ab'].pow( 2.0 ) ),
                               _t_a, _t_b.div( this.sp['t_ab'] ) ] );
        // generator b
        this.cm2.set_params( [ _t_b.sub( _t_a.div( this.sp['t_ab'] ) ), _t_b.div( this.sp['t_ab'].pow( 2.0 ) ).opposite(),
                               _t_b.opposite(), _t_a.div( this.sp['t_ab'] ) ] );
        return [ this.cm1.trace(), this.cm2.trace(), this.cm1.mul( this.cm2.inv() ).trace() ] ;
    }
    else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_ABab_OP ) // trace ABab is fixed
    {
        // generator a
        this.cm1.set_params( [ _t_a.sub( _t_b.div( this.sp['t_ab'] ) ), _t_a.div( this.sp['t_ab'].pow( 2.0 ) ),
                               _t_a, _t_b.div( this.sp['t_ab'] ) ] );
        // generator b
        this.cm2.set_params( [ _t_b.sub( _t_a.div( this.sp['t_ab'] ) ), _t_b.div( this.sp['t_ab'].pow( 2.0 ) ).opposite(),
                               _t_b.opposite(), _t_a.div( this.sp['t_ab'] ) ] );
        this.sp['t_a'] = this.cm1.trace() ;
        this.sp['t_b'] = this.cm2.trace() ;
        /* from markov identity : Tr_abAB = (tr_a)^2 + (tr_b)^2 + (tr_ab)^2 - tr_a * tr_b * tr_ab - 2
           and setting k : -(tr_a * tr_b),
                       j : (tr_a)^2 + (tr_b)^2 - 2 - Tr_abAB,
                       x : tr_ab
           we have x^2 + kx + j = 0
        */
        this.sp['k'] = this.sp['t_a'].mul( this.sp['t_b'] ).opposite();
        this.sp['j'] = this.sp['t_a'].pow( 2.0 ).add( this.sp['t_b'].pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
        this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
        this.sp['t_aB'] = this.sp['k'].opposite().sub( this.sp['delta'].sqrt() ).div( 2.0 ) ;
        return [ this.sp['t_a'], this.sp['t_b'], this.sp['t_aB'] ] ;
    }
    else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_A_OP ) // trace a is fixed
    {
        // generator b
        this.cm2.set_params( [ _t_b.sub( _t_a.div( this.sp['t_ab'] ) ), _t_b.div( this.sp['t_ab'].pow( 2.0 ) ).opposite(),
                               _t_b.opposite(), _t_a.div( this.sp['t_ab'] ) ] );
        this.sp['t_a'] = this.custom_params[1] ;
        this.sp['t_b'] = this.cm2.trace() ;
        /* from markov identity : Tr_abAB = (tr_a)^2 + (tr_b)^2 + (tr_ab)^2 - tr_a * tr_b * tr_ab - 2
           and setting k : -(tr_a * tr_b),
                       j : (tr_a)^2 + (tr_b)^2 - 2 - Tr_abAB,
                       x : tr_ab
           we have x^2 + kx + j = 0
        */
        this.sp['k'] = this.sp['t_a'].mul( this.sp['t_b'] ).opposite();
        this.sp['j'] = this.sp['t_a'].pow( 2.0 ).add( this.sp['t_b'].pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
        this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
        this.sp['t_aB'] = this.sp['k'].opposite().sub( this.sp['delta'].sqrt() ).div( 2.0 ) ;
        return [ this.sp['t_a'], this.sp['t_b'], this.sp['t_aB'] ] ;
    }
    else if ( this.trace_fix_op == _DLOCUS_TRACE_FIX_B_OP ) // trace b is fixed
    {
        // generator a
        this.cm1.set_params( [ _t_a.sub( _t_b.div( this.sp['t_ab'] ) ), _t_a.div( this.sp['t_ab'].pow( 2.0 ) ),
                               _t_a, _t_b.div( this.sp['t_ab'] ) ] );
        this.sp['t_a'] = this.cm1.trace() ;
        this.sp['t_b'] = this.custom_params[2] ;
        /* from markov identity : Tr_abAB = (tr_a)^2 + (tr_b)^2 + (tr_ab)^2 - tr_a * tr_b * tr_ab - 2
           and setting k : -(tr_a * tr_b),
                       j : (tr_a)^2 + (tr_b)^2 - 2 - Tr_abAB,
                       x : tr_ab
           we have x^2 + kx + j = 0
        */
        this.sp['k'] = this.sp['t_a'].mul( this.sp['t_b'] ).opposite();
        this.sp['j'] = this.sp['t_a'].pow( 2.0 ).add( this.sp['t_b'].pow( 2.0 ) ).sub( 2.0 ).sub( this.commutator_trace ) ;
        this.sp['delta'] = this.sp['k'].pow( 2.0 ).sub( this.sp['j'].mul( 4.0 ) );
        this.sp['t_aB'] = this.sp['k'].opposite().sub( this.sp['delta'].sqrt() ).div( 2.0 ) ;
        return [ this.sp['t_a'], this.sp['t_b'], this.sp['t_aB'] ] ;
    }
}

discreteness_locus.prototype.pq_trace_polynomial = function( _pq, _tr_a, _tr_B, _tr_aB )
{
    // the correct construction of polynomials, through farey sequence, needs
    // these three vars to be set to the specific bounding fractions
    // don't change'em in future
    var _pq_ratio = _pq.ratio(), _cnt = 0, _den = Math.max( _pq.get_den(), 10 ) + 1 ;
    if ( _pq_ratio.ranges_in( 0, 1, true ) )
    {
        this.p1q1 = new farey( 0, 1 ), this.p2q2 = new farey( 1, 0 ), this.p3q3 = new farey( 1, 1 ) ;
        this.tr_u = _tr_a, this.tr_v = _tr_B, this.tr_uv = _tr_aB ;
        if ( _pq.is_equal_to( this.p1q1 ) ) return _tr_a ;
        else if ( _pq.is_equal_to( this.p2q2 ) ) return _tr_B ;
        else if ( _pq.is_equal_to( this.p3q3 ) ) return _tr_aB ;
    }
    else if ( _pq_ratio > 1 )
    {
        this.p1q1 = new farey( 1, 1 ), this.p2q2 = new farey( 0, 1 ), this.p3q3 = new farey( 1, 0 ) ;
        this.tr_u = _tr_aB, this.tr_v = _tr_a, this.tr_uv = _tr_B ;
        if ( _pq.is_equal_to( this.p1q1 ) ) return _tr_aB ;
        else if ( _pq.is_equal_to( this.p2q2 ) ) return _tr_a ;
        else if ( _pq.is_equal_to( this.p3q3 ) ) return _tr_B ;
    }
    else if ( _pq_ratio.ranges_in( -1, 0, true ) )
    {
        this.p1q1 = new farey( -1, 1 ), this.p2q2 = new farey( -1, 0 ), this.p3q3 = new farey( 0, 1 ) ;
        this.tr_u = _tr_aB, this.tr_v = _tr_B, this.tr_uv = _tr_a ;
        if ( _pq.is_equal_to( this.p1q1 ) ) return _tr_aB ;
        else if ( _pq.is_equal_to( this.p2q2 ) ) return _tr_B ;
        else if ( _pq.is_equal_to( this.p3q3 ) ) return _tr_a ;
    }
    else if ( _pq_ratio < -1 )
    {
        this.p1q1 = new farey( -1, 0 ), this.p2q2 = new farey( 0, 1 ), this.p3q3 = new farey( -1, 1 ) ;
        this.tr_u = _tr_B, this.tr_v = _tr_a, this.tr_uv = _tr_aB ;
        if ( _pq.is_equal_to( this.p1q1 ) ) return _tr_B ;
        else if ( _pq.is_equal_to( this.p2q2 ) ) return _tr_a ;
        else if ( _pq.is_equal_to( this.p3q3 ) ) return _tr_aB ;
    }

    while( this.p3q3.is_not_equal_to( _pq ) )
    {
				if ( _pq.is_lesser_eq( this.p3q3 ) )
        {
           this.p2q2 = this.p3q3 ;
           this.p3q3 = this.p3q3.sum( this.p1q1 ) ;
           this.temp = this.tr_uv ;
           this.tr_uv = this.tr_u.mul( this.tr_uv ).sub( this.tr_v ) ;
           this.tr_v = this.temp ;
        }
        else
        {
           this.p1q1 = this.p3q3 ;
           this.p3q3 = this.p3q3.sum( this.p2q2 ) ;
           this.temp = this.tr_uv ;
           this.tr_uv = this.tr_v.mul( this.tr_uv ).sub( this.tr_u ) ;
           this.tr_u = this.temp ;
        }
        
        _cnt++ ;
        if ( _cnt == _den ) break ;
    }
    return this.tr_uv ;
}

discreteness_locus.prototype.pq_equation = function( _pq, _param_01, eq_solution )
{
    return ( function( _pq, _param_01 )
             {
               this.traces = this.init( _param_01 ) ;
               return this.pq_trace_polynomial( _pq, this.traces[0], this.traces[1], this.traces[2] ).sub( eq_solution ) ;
             } ) ;
}

discreteness_locus.prototype.pq_numerical_derivative = function( _func, _pq, _z0 )
{
		this.sp['h_rate'] = _func.call( this, _pq, _z0.add( this.dz.real ) ).sub( _func.call( this, _pq, _z0.sub( this.dz.real ) ) ).div( this.dz.real * 2.0 ) ;
		this.sp['v_rate'] = _func.call( this, _pq, _z0.add( this.dz.imag ) ).sub( _func.call( this, _pq, _z0.sub( this.dz.imag ) ) ).div( this.dz.imag * 2.0 ) ;
		return this.sp['h_rate'].add( this.sp['v_rate'] ).div(2.0) ;
}

discreteness_locus.prototype.pq_newton = function( _func, _pq, _z0 )
{
    this.pq_newton_step = 1 ;
    while( true )
    {
       _z0 = this.pq_newton_z1 = _z0.sub( _func.call( this, _pq, _z0 ).div( this.pq_numerical_derivative( _func, _pq, _z0 ) ) ) ;
       //_z0 = this.pq_newton_z1 ;
       this.pq_newton_step++ ;
       if ( this.pq_newton_z1.distance( _z0 ) < this.accuracy || this.pq_newton_step >= this.max_iterate || this.stop == 1 ) break ;
    }
    return this.pq_newton_z1 ;
}

discreteness_locus.prototype.pq_boundary = function( _den, _input_seq, _start_farey, _end_farey, _callback_fn )
{
    var _boundary = [] ;
		var _start_pq = is_array( _start_farey ) ? _ext_farey_return( _start_farey ) : ( _start_farey instanceof farey ? _start_farey : this.farey_seq_start ) ;
				this.farey_seq_start = _start_pq ;
		var _end_pq = is_array( _end_farey ) ? _ext_farey_return( _end_farey ) : ( _end_farey instanceof farey ? _end_farey : this.farey_seq_end ) ;
				this.farey_seq_end = _end_pq ;
		var _st = this.starting_pt, _func, _pq = _start_pq ;
    var _input_seq_len = is_array( _input_seq ) ? _input_seq.length : 0, _runner = 1, _curr_index = -1, _pq_chunk, _farey_seq ;
		while( _pq.is_lesser_eq( _end_pq ) )
    {
        _func = this.pq_equation( _pq, _st, this.eq_solution ) ;
        _st = this.pq_newton( _func, _pq, _st ) ;
        _boundary[''+_pq.output()] = _st ;
        _pq_chunk = _pq.next_term_params( _pq, _den, _farey_seq, _curr_index ) ;
        _curr_index = _pq_chunk[0] ;
        _pq = _pq_chunk[1] ;
        if ( _pq == null || this.stop == 1 ) break ;
        if ( typeof _callback_fn == "function" ) _callback_fn.call( this, _pq.output(), _runner, _input_seq_len ) ;
    }

    return _boundary ;
}

discreteness_locus.prototype.fix_discreteness_locus_pt = function( _pq_frac, _pt )
{
    switch( this.init_mode )
    {
        case _DLOCUS_MASKIT:
        return _pq_frac.ratio() < 0 ? new complex( -Math.abs( _pt.real ), _pt.imag ) : _pt ;
        break ;
        default: return _pt ; break ;
    }
}

discreteness_locus.prototype.pleating_positive_ray = function( _pq, _ray_start_pt, _step_start, _max_steps, _bounding_rect, _callback_fn, _correct, _keep_going )
{
    _correct = safe_int( _correct, 0 ), _keep_going = safe_int( _keep_going, 0 );
		var _ray_pts_array = [], _ray_pt = _ray_start_pt, _new_ray_pt, _func ;
		var _steps = safe_int( _max_steps, this.get_pleating_rays_max_iterate() ), _counter = 0 ;
		var _threshold_accuracy = this.get_pleating_rays_threshold_accuracy(), _dist ;
		var _step_rate = this.get_pleating_rays_step_rate(), _go = 1 ;
				_ray_pts_array.push( _ray_pt );
		while( true )
		{
				_func = this.pq_equation( _pq, _ray_pt, _step_start ) ;
				_new_ray_pt = this.pq_newton( _func, _pq, _ray_pt ) ;
				_dist = _new_ray_pt.distance( _ray_pt ) ;
        if ( _correct && _dist > _step_rate )
        {
					  _ray_pts_array.push( _ray_pts_array.get_last() );
						_step_rate *= this.pleating_ray_backward_factor ;
						_step_start = _step_start.sub( _step_rate );
				}
				if ( !_go || _counter > _steps || ( _dist > _step_rate && _keep_going ) ) break ;
				if ( _dist < _threshold_accuracy ) _step_rate *= this.pleating_ray_forward_factor ;
				else if ( _dist > _threshold_accuracy ) _step_rate *= this.pleating_ray_backward_factor ;
				_step_start = _step_start.add( _step_rate );
				_counter++ ;
				_ray_pt = _new_ray_pt ;
				_ray_pts_array.push( _ray_pt );
				_go = _bounding_rect != null ? ( _bounding_rect.is_pt_inside( _ray_pt.real, _ray_pt.imag ) ? 1 : 0 ) : 1 ;
		}
		return _ray_pts_array ;
}

discreteness_locus.prototype.pleating_negative_ray = function( _pq, _ray_start_pt, _step_start, _max_steps, _bounding_rect, _callback_fn, _correct, _keep_going )
{
    _correct = safe_int( _correct, 0 );
    _keep_going = safe_int( _keep_going, 0 );
		var _ray_pts_array = [], _func, _ray_pt = _ray_start_pt, _new_ray_pt ;
		var _steps = safe_int( _max_steps, this.get_pleating_rays_max_iterate() ), _counter = 0 ;
		var _threshold_accuracy = this.get_pleating_rays_threshold_accuracy(), _dist ;
		var _step_rate = this.get_pleating_rays_step_rate(), _go = 1 ;
				_ray_pts_array.push( _ray_pt );
		while( true )
		{
				_func = this.pq_equation( _pq, _ray_pt, _step_start ) ;
				_new_ray_pt = this.pq_newton( _func, _pq, _ray_pt ) ;
				_dist = _new_ray_pt.distance( _ray_pt ) ;
        if ( _correct && _dist > _step_rate )
        {
					  _ray_pts_array.push( _ray_pts_array.get_last() );
						_step_rate *= this.pleating_ray_backward_factor ;
						_step_start = _step_start.sub( _step_rate );
				}
				if ( !_go || _counter > _steps || ( _dist > _step_rate && _keep_going ) ) break ;
				if ( _dist < _threshold_accuracy ) _step_rate *= this.pleating_ray_forward_factor ;
				else if ( _dist > _threshold_accuracy ) _step_rate *= this.pleating_ray_backward_factor ;
				_step_start = _step_start.sub( _step_rate );
				_counter++ ;
				_ray_pt = _new_ray_pt ;
				_ray_pts_array.push( _ray_pt );
				_go = _bounding_rect != null ? ( _bounding_rect.is_pt_inside( _ray_pt.real, _ray_pt.imag ) ? 1 : 0 ) : 1 ;
		}
		return _ray_pts_array ;
}

discreteness_locus.prototype.pq_cusp = function( _pq, _seq, _order, _start_frac, _end_frac, _callback_fn )
{
    if ( _pq instanceof farey )
    {
        _order = safe_int( _order, 0 );
        var _den = _pq.q, _pq_str = _pq.output();
        if ( _seq == null ) _seq = _pq.farey_sequence( _order == 0 ? _den : _order, _start_frac, _end_frac, _callback_fn ) ;
        else if ( _seq.length == 0 ) _seq = _pq.farey_sequence( _order == 0 ? _den : _order, _start_frac, _end_frac, _callback_fn ) ;
        var _boundary = this.pq_boundary( _order == 0 ? _den : _order, _seq, _start_frac, _end_frac, _callback_fn );
				var _cusp = _boundary[''+_pq_str] ;
        if ( _cusp == null )
        {
            var _keys = _boundary.keys_associative() ;
            var _embedding_len = _keys.length, _closest_frac = "", _min_dist = -1, _dist, _tr = null ;
            for( var _i = 0 ; _i < _embedding_len ; _i++ )
            {
                _dist = Math.abs( eval( _keys[_i] ) - _pq.p / _pq.q ) ;
                if ( _min_dist == -1 || _dist < _min_dist )
                {
                   _closest_frac = _keys[_i] ;
                   _min_dist = _dist ;
                }
            }
            if ( _closest_frac.length > 0 ) _cusp = _boundary[''+_closest_frac] ;
        }
        return _cusp ;
    }
    else return null ;
}