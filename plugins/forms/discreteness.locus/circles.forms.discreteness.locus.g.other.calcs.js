function CIRCLESformsDISCRETENESSLOCUSinitGROUP( _complex_formula )
{
    if ( CIRCLESformsDISCRETENESSLOCUSplugin_pick )
    {
         var _complex = parse_complex_from_string( circles_lib_math_parse_formula( _complex_formula ) );
         CIRCLESformsDISCRETENESSLOCUSplotCOMPLEXPT( null, _complex_formula );
         var _trace_fix_op = $( "#FIXTRACECOMBO" ).get(0) != null ? $( "#FIXTRACECOMBO" ).val() : 0 ;
         var _t_a = new complex( 0, 0 ), _t_b = new complex( 0, 0 );
         if ( _trace_fix_op.is_one_of( _DLOCUS_TRACE_FIX_DEFAULT_OP, _DLOCUS_TRACE_FIX_B_OP, _DLOCUS_TRACE_FIX_ABab_OP ) ) // no trace fix
         {
             _t_a = _complex ;
             _t_b = $( "#CIRCLESformsDISCRETENESSLOCUStraceB" ).get(0) != null ? $( "#CIRCLESformsDISCRETENESSLOCUStraceB" ).val() : "0"
             _t_b = parse_complex_from_string( circles_lib_math_parse_formula( _t_b ) );
         }
         else if ( _trace_fix_op == _DLOCUS_TRACE_FIX_A_OP ) // fix trace A
         {
             _t_a = $( "#CIRCLESformsDISCRETENESSLOCUStraceA" ).get(0) != null ? $( "#CIRCLESformsDISCRETENESSLOCUStraceA" ).val() : "0"
             _t_a = parse_complex_from_string( circles_lib_math_parse_formula( _t_a ) );
             _t_b = _complex ;
         }

         var _ret_fill = GLOB_PLUGIN_PARAMS_FILLER( _t_a, _t_b );
    }
}

function CIRCLESformsDISCRETENESSLOCUScalcDISPATCHER( _caller_id )
{
		var _calc_switch = 0 ;
    if ( $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXradioA" ).prop( "checked" ) ) _calc_switch = 1 ;
    else if ( $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXradioB" ).prop( "checked" ) ) _calc_switch = 2 ;
    else if ( $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXradioAB" ).prop( "checked" ) ) _calc_switch = 3 ;
    else if ( $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXradioABab" ).prop( "checked" ) ) _calc_switch = 4 ;
    
    var _tr_a = parse_complex_from_string( circles_lib_math_parse_formula( $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrA" ).val() ) );
        $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrA" ).css( "background-color", is_complex( _tr_a ) ? "white" : "#FFF2C6" );
    var _tr_b = parse_complex_from_string( circles_lib_math_parse_formula( $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrB" ).val() ) );
        $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrB" ).css( "background-color", is_complex( _tr_b ) ? "white" : "#FFF2C6" );
    var _tr_ab = parse_complex_from_string( circles_lib_math_parse_formula( $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrAB" ).val() ) );
        $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrAB" ).css( "background-color", is_complex( _tr_ab ) ? "white" : "#FFF2C6" );
    var _tr_ABab = parse_complex_from_string( circles_lib_math_parse_formula( $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrABab" ).val() ) );
        $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrABab" ).css( "background-color", is_complex( _tr_ABab ) ? "white" : "#FFF2C6" );

    var _input_mask  = 0 ;
    // singleton errors
    if ( is_complex( _tr_a ) ) _input_mask |= 1 ;
    if ( is_complex( _tr_b ) ) _input_mask |= 2 ;
    if ( is_complex( _tr_ab ) ) _input_mask |= 4 ;
    if ( is_complex( _tr_ABab ) ) _input_mask |= 8 ;

    $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXoutMSG" ).html( "" );
    var _apply_eq_op = safe_int( $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXcombo" ).val(), 0 );
    var _ret_chunk = null ;
    switch( _apply_eq_op )
    {
        case 1: // Markov identity
        _ret_chunk = CIRCLESformsDISCRETENESSLOCUScalcMARKOVidentity( _tr_a, _tr_b, _tr_ab, _tr_ABab, _input_mask, _calc_switch );
        break ;
        default: break ;
    }

    var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Invalid output data" ;
    var _ret_val = is_array( _ret_chunk ) ? _ret_chunk[2] : new complex( 0.0 );
    $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXoutMSG" ).css( "color", _ret_id == RET_OK ? DEFAULT_COLOR_SUCCESS : DEFAULT_COLOR_ERROR );
    $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXoutMSG" ).html( _ret_msg );
        
    if ( _ret_id == RET_OK )
    {
        if ( _calc_switch == 1 ) $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrA" ).val( _ret_val.formula() );
        else if ( _calc_switch == 2 ) $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrB" ).val( _ret_val.formula() );
        else if ( _calc_switch == 3 ) $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrAB" ).val( _ret_val.formula() );
        else if ( _calc_switch == 4 ) $( "#CIRCLESformsDISCRETENESSLOCUScalcBOXtrABab" ).val( _ret_val.formula() );
		}
}

function CIRCLESformsDISCRETENESSLOCUScalcMARKOVidentity( _tr_a, _tr_b, _tr_ab, _tr_ABab, _input_mask, _calc_switch )
{
		// (tr a)^2 + (tr b)^2 + (tr ab)^2 - (tr a)*(tr b)*(tr ab) - 2 - (tr ABab)
		var _real_two = new complex( 2.0, 0.0 );
		switch( _calc_switch )
		{
				case 1: // compute trace a
				if ( ( _input_mask & ( 2 | 4 | 8 ) ) == 14 )
				{
						// x^2 + (tr b)^2 + (tr ab)^2 - x*(tr b)*(tr ab) - 2 - (tr ABab)
						var _k = _tr_b.mul( _tr_ab ).opposite();
						var _j = _tr_b.pow(2.0).add( _tr_ab.pow(2.0) ).sub( _real_two ).sub( _tr_ABab );
						// x^2 + kx + j = 0
						var _delta = _k.pow( 2.0 ).sub( _j.pow( 4.0 ) );
						_tr_a = _k.opposite().add( _delta.sqrt( 2.0 ) ).div( 2.0 );
						return [ RET_OK, "Tr a has been calculated with success", _tr_a ] ;
				}
				else return [ RET_ERROR, "Tr a can't be calculated due to a lack of input params", _tr_a ] ;
				break ;
				case 2: // compute trace b
				if ( ( _input_mask & ( 1 | 4 | 8 ) ) == 13 )
				{
						// (tr a)^2 + x^2 + (tr ab)^2 - (tr a)*x*(tr ab) - 2 - (tr ABab)
						var _k = _tr_a.mul( _tr_ab ).opposite();
						var _j = _tr_a.pow(2.0).add( _tr_ab.pow(2.0) ).sub( _real_two ).sub( _tr_ABab );
						// x^2 + kx + j = 0
						var _delta = _k.pow( 2.0 ).sub( _j.pow( 4.0 ) );
						_tr_b = _k.opposite().add( _delta.sqrt( 2.0 ) ).div( 2.0 );
						return [ RET_OK, "Tr b has been calculated with success", _tr_b ] ;
				}
				else return [ RET_ERROR, "Tr b can't be calculated due to a lack of input params", _tr_b ] ;
				break ;
				case 3: // compute trace ab
				if ( ( _input_mask & ( 1 | 2 | 8 ) ) == 11 )
				{
						// (tr a)^2 + (tr b)^2 + x^2 - (tr a)*(tr b)*x - 2 - (tr ABab)
						var _k = _tr_a.mul( _tr_b ).opposite();
						var _j = _tr_a.pow(2.0).add( _tr_b.pow(2.0) ).sub( _real_two ).sub( _tr_ABab );
						var _delta = _k.pow( 2.0 ).sub( _j.pow( 4.0 ) );
						_tr_ab = _k.opposite().add( _delta.sqrt( 2.0 ) ).div( 2.0 );
						return [ RET_OK, "Tr ab has been calculated with success", _tr_ab ] ;
				}
				else return [ RET_ERROR, "Tr ab can't be calculated due to a lack of input params", _tr_ab ] ;
				break ;
				case 4: // compute trace ABab
				if ( ( _input_mask & ( 1 | 2 | 4 ) ) == 7 )
				{
						// (tr a)^2 + (tr b)^2 + (tr ab)^2 - (tr a)*(tr b)*(tr ab) - 2 - (tr ABab)
						tr_ABab = _tr_a.pow(2.0).add( _tr_b.pow(2.0) ).add( _tr_ab.pow( 2.0 ) ).sub( _tr_a.mul( _tr_b ).mul( _tr_ab ) ).sub( _real_two );
						return [ RET_OK, "Tr ABab has been calculated with success", tr_ABab ] ;
				}
				else return [ RET_ERROR, "Tr ABab can't be calculated due to a lack of input params", _tr_ABab ] ;
				break ;
				default:
				return [ RET_ERROR, "Insufficient parameters to compute", new complex( 0, 0 ) ] ;
				break ;
		}
}