function CIRCLESmethodMANAGERrandomTABLEautocalc( _current_zero_based_index, _probabilities_amount )
{
		if ( !_glob_probabilityRNDrecalcAUTOMATICflag ) return ;
		var _p = safe_float( $("#PROCrndPROBABILITY_EDIT_" + _current_zero_based_index ).val(), UNDET ).clean_round_off( _glob_accuracy );
		if ( _p <= 0 && _p > 1 ) _p = UNDET ;
    var _edit, _checkbox, _label_box, _partial_sum = 0, _recalculable_index_array = [] ;
    var _sum = 0.0, _residual = 1.0, _diff, _val ;
    // 1. get the edit box where the resulting value will be accomodated
    $( "[id^=PROCrndPROBABILITY_CHECKBOX_]" ).each( function( _i, val )
    {
        if ( !$( val ).is( ":checked" ) && _i != _current_zero_based_index ) _recalculable_index_array.push( _i );
    } );

    // 2. get the value to fill the edit coming from 1.
    $( "[id^=PROCrndPROBABILITY_CHECKBOX_]" ).each( function( _i, val )
    {
        _edit = $("#PROCrndPROBABILITY_EDIT_" + _i ).get(0);
        _checkbox = $("#PROCrndPROBABILITY_CHECKBOX_" + _i ).get(0);
        _label_box = $( "#PROCrndPROBABILITY_LABEL_" + _i ).get(0);
        if ( _edit != null && _checkbox != null && _label_box != null &&
             !_recalculable_index_array.includes( _i ) )
        {
            _val = safe_float( _edit.value.replaceAll( ",", ".").replaceAll( [ "-", "+" ], "" ), 10 ).clean_round_off( _glob_accuracy );
            if ( !_checkbox.checked ) _sum += _val ;
            else _residual -= _val ;
        }

        if ( _edit != null )
        {
            _partial_sum += safe_float( _edit.value, 10 ).clean_round_off( _glob_accuracy );
            _label_box.innerHTML = _partial_sum.clean_round_off( _glob_accuracy );
        }
    });

    if ( _recalculable_index_array.length > 0 )
    {
       _diff = ( _residual - _sum ) / _recalculable_index_array.length ;
       $.each( _recalculable_index_array,
               function( _i, _val )
               {
                  _edit = $("#PROCrndPROBABILITY_EDIT_" + _val ).get(0);
                  _checkbox = $("#PROCrndPROBABILITY_CHECKBOX_" + _val ).get(0);
               	  if ( _edit != null && _checkbox != null )
                  {
                     if ( !_checkbox.checked ) _edit.value = _diff.clean_round_off( _glob_accuracy );
                  }
               }
             );
    }

  	if ( _p == UNDET )
		circles_lib_output( OUTPUT_SPECIAL_FX,DISPATCH_WARNING, "Probabilities must range in [0,1[", 'PROCESSrandomPROBABILITYoutput' )
		else
		circles_lib_output( OUTPUT_SPECIAL_FX,DISPATCH_WARNING, "Automatic calculation has been successful", 'PROCESSrandomPROBABILITYoutput' ) ;
}

function CIRCLESmethodMANAGERrandomtableCOMBOsave()
{
    var _pack = _glob_rnd_probability_array.length > 0 ? _glob_rnd_probability_array.join( "@" ) : "" ;
    if ( _pack.length == 0 )
    {
        CIRCLESmethodMANAGERrandomTABLEsave();
        _pack = _glob_rnd_probability_array.length > 0 ? _glob_rnd_probability_array.join( "@" ) : "" ;
    }
      
    if ( _pack.length > 0 && !_glob_rnd_probability_array.includes( _pack ) )
    {
        _glob_random_table_store.push( _pack );
        var _ret = CIRCLESmethodMANAGERrandomtableCOMBOcreate();
				circles_lib_output( OUTPUT_SPECIAL_FX, _ret ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret ? "Random IFS table saved with success" : "Can't save: current random table is empty", 'PROCESSrandomPROBABILITYoutput' ) ;
    }
    else if ( _glob_rnd_probability_array.length == 0 )
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't save: current random table is empty", 'PROCESSrandomPROBABILITYoutput' ) ;
}

function CIRCLESmethodMANAGERrandomtableCOMBOcreate()
{
    if ( safe_size( _glob_random_table_store, 0 ) > 0 )
    {
        var _html_code = "<SELECT ID=\"RANDOMtableCOMBO\" ONCHANGE=\"javascript:CIRCLESmethodMANAGERrandomtableCOMBOselect();\">" ;
            _html_code += "<OPTION SELECTED=\"selected\" VALUE=\"\">" ;
            $.each( _glob_random_table_store,
            function( _i, _packed_item ) { _html_code += "<OPTION VALUE=\""+_packed_item+"\">#" + ( _i + 1 ); } );
            _html_code += "</SELECT>" ;

        $( "#ALGEBRAICrandomTABLEcomboCONTAINER" ).html( _html_code );
        return YES ;
    }
    else return NO ;
}

function CIRCLESmethodMANAGERrandomtableCOMBOselect()
{
    var _sel_entry = $( "#RANDOMtableCOMBO" ).val();
    if ( _sel_entry.length > 0 && _sel_entry.includes( "@" ) )
    {
        var _unpacked = _sel_entry.split( "@" );
        if ( _unpacked.length > 0 )
        {
            _glob_rnd_probability_array = _glob_random_table_store.clone();
            CIRCLESmethodMANAGERrandomTABLEbuild( YES );
        }
    }
    else if ( _sel_entry.length > 0 && !_sel_entry.includes( "@" ) )
  	circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Invalid entry selection", 'PROCESSrandomPROBABILITYoutput' ) ;
}

function CIRCLESmethodMANAGERrandomTABLEcheck( _silent )
{
    _silent = safe_int( _silent, NO );
    var _p_sum = 0.0 ;
    $( "[id^=PROCrndPROBABILITY_EDIT_]" ).each( function( _i, _id )
    {
        _p_sum += safe_float( $( _id ).val().replaceAll( ",", ".").replaceAll( [ "-", "+" ], "" ), 0 ).clean_round_off( _glob_accuracy );
        $( "#PROCrndPROBABILITY_LABEL_" + _i ).html( _p_sum );
    }
    );

    var _candidate_sum = safe_float( _p_sum.toFixed( _glob_accuracy ), 0 ).clean_round_off( 2 );
    var _ok = _candidate_sum == 1.0 ? YES : NO ;
 	  $("#PROCESSrandomPROBABILITYsumCONTAINER").html( _candidate_sum.toFixed( 3 ) );
	  $("#PROCESSrandomPROBABILITYsumCONTAINER").css( "color", _ok ? "#00AB00" : "#AB0000" );
    if ( !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, _ok ? DISPATCH_SUCCESS : DISPATCH_WARNING, "Distribution sum ("+_candidate_sum+") is " + ( _ok ? "" : "not" ) + " correct" + ( _ok ? "" : ": it must be 1" ), 'PROCESSrandomPROBABILITYoutput' ) ;
    return ( _glob_method == METHOD_ALGEBRAIC && _glob_process == PROCESS_RANDOM ) ? _ok : NO ;
}

function CIRCLESmethodMANAGERrandomTABLEfill()
{
		if ( !_glob_probabilityRNDrecalcAUTOMATICflag ) return ;
    var _rr_n = safe_size( _glob_rnd_probability_array, 0 ), _edit, _p ;
    if ( _rr_n > 0 ) for( var _i = 0 ; _i < _rr_n ; _i++ ) $( "#PROCrndPROBABILITY_EDIT_" + _i ).val( safe_float( _glob_rnd_probability_array[_i], 0 ) );
}

function CIRCLESmethodMANAGERrandomTABLEsave()
{
		if ( !_glob_probabilityRNDrecalcAUTOMATICflag ) return ;
    if ( _glob_rnd_probability_array != null ) _glob_rnd_probability_array = [];
    else _glob_rnd_probability_array.flush();
    var _p, _str ;
    $( "[id^=PROCrndPROBABILITY_EDIT_]" ).each( function( _i, _id )
    {
        _p = safe_float( $( _id ).val().replaceAll( ",", ".").replaceAll( [ "-", "+" ], "" ), 0 );
        _glob_rnd_probability_array.push( _p );
    }
    );
}

function CIRCLESmethodMANAGERrandomTABLElockallCHECK()
{
    var _sch_n = circles_lib_count_gens_set_model();
    var _checkbox_n = $( "[id^=PROCrndPROBABILITY_CHECKBOX_]" ).filter( ":checked" ).length ;
    $( "#PROCrndCHECKBOXall" ).prop( "checked", _sch_n == _checkbox_n );
}

function CIRCLESmethodMANAGERsetVALUESfromMULTISLIDER( _input_array )
{
    var _sum = 0 ;
    $.each( _input_array, function( _i, _val )
            {
               $( "#PROCrndPROBABILITY_EDIT_" + _i ).val( _val );
               _sum += _val ;
               $( "#PROCrndPROBABILITY_LABEL_" + _i ).html( _sum.clean_round_off(_glob_accuracy) );
            } );

    CIRCLESmethodMANAGERrandomTABLEcheck( YES );
}

function CIRCLESmethodMANAGERsetVALUEStoMULTISLIDER()
{
    var _tmp = [];
    $( "[id^=PROCrndPROBABILITY_EDIT_]" ).each( function( _index, _element ) { _tmp.push( _element.value * 100 ); } );
    var _input_values = _tmp.from_to( 0, _tmp.length - 1 );
    var _out_values = [];
    $.each( _input_values,
            function( _i, _v )
            {
                if ( _i == 0 ) _out_values.push( _v );
                else _out_values.push( _out_values[_i-1] + _v )
            }
    );

    MULTISLIDERctrlACTIVATE( "multislider1", _out_values );
}

function CIRCLESmethodMANAGERrandomTABLEuniformDISTRIBUTION()
{
    var _sch_n = circles_lib_count_gens_set_model(), _items_exist = _sch_n == 0 ? NO : YES ;
    var _free_indexes = [], _locked_entries = [], _residual = 1.0 ;
    for( var _i = 0 ; _i < _sch_n ; _i++ )
    {
	 		 _checkbox = $("#PROCrndPROBABILITY_CHECKBOX_" + _i );
       _val = safe_float( $("#PROCrndPROBABILITY_EDIT_" + _i ).val() ).clean_round_off( _glob_accuracy, DEFAULT_MAX_ACCURACY );
       if ( $("#PROCrndPROBABILITY_CHECKBOX_" + _i ).prop( "checked" ) )
       {
          _locked_entries.push( _i );
          _residual -= _val ;
       }
       else _free_indexes.push( _i );
    }

    if ( _free_indexes.length > 0 )
    {
        var _uniform_probability = _items_exist ? round_to_decimals( _residual / _free_indexes.length, _glob_accuracy ) : 0 ;
        if ( _uniform_probability > 0 )
        for( var _i = 0 ; _i < _free_indexes.length ; _i++ ) $("#PROCrndPROBABILITY_EDIT_" + _free_indexes[_i] ).val( _uniform_probability );
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "All probabilities reset in uniform distribution", 'PROCESSrandomPROBABILITYoutput' ) ;
    }
    else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "No free index to set: uncheck some entries", 'PROCESSrandomPROBABILITYoutput' ) ;
}

function CIRCLESmethodMANAGERrandomTABLEmultisliderINIT()
{
    if ( _glob_process == PROCESS_RANDOM )
    {
       var _init_array = _glob_rnd_probability_array.clone();
       $.each( _init_array, function( _i, _val ) { if ( _i > 0 ) _init_array[_i] += _init_array[_i-1] ; } );
       $.each( _init_array, function( _i, _val ) { _init_array[_i] *= 100.0 ; } );
       var _out_array = [];
       $.each( _init_array, function( _i, _val ) { if ( _i < ( _init_array.length - 1 ) ) _out_array.push( _init_array[_i] ); } );
       MULTISLIDERctrlACTIVATE( "multislider1", _out_array );
    }
}

function CIRCLESmethodMANAGERrandomMODELScombo()
{
    var _chunk_index = $( "#ALGEBRAICrndPRESETScombo" ).val();
        _chunk_index = safe_int( _chunk_index, 0 );
    var _gs_n = circles_lib_count_gens_set_model();
    if ( _chunk_index > 0 )
    {
       var _chunk = _glob_presets['rnd'][_chunk_index-1] ;
       var _chunk_length = safe_size( _chunk, 0 );
       if ( _chunk_length == 0 )
			 circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "The selected preset is empty", 'PROCESSrandomPROBABILITYoutput' ) ;
       else if ( _gs_n == 0 )
			 circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Cannot set up the selected preset because the gens set is empty.", 'PROCESSrandomPROBABILITYoutput' ) ;
       else if ( _gs_n != _chunk_length - 1 )
			 circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "The number of probabilities in the selected preset is not equal to the cardinality of the gens set.", 'PROCESSrandomPROBABILITYoutput' ) ;
       else if ( _chunk_length > 0 && _gs_n == _chunk_length - 1 )
       {
          var _rnd_n = circles_lib_count_rnd_probabilities(), _b_go = _rnd_n == 0 ? YES : confirm( "Do you want to overwrite the current random table ?" );
          if ( _b_go )
          {
             _glob_rnd_probability_array.flush();
             for( var _i = 1 ; _i < _chunk_length ; _i++ ) _glob_rnd_probability_array.push( _chunk[_i] );
             CIRCLESmethodMANAGERrandomTABLEbuild(YES);
             CIRCLESmethodMANAGERrandomTABLEmultisliderINIT();
          }
       }
    }
}

function CIRCLESmethodMANAGERrandomTABLEresetREPS()
{
    $('#PROCrndREPSthreshold').val(DEFAULT_RND_REPS_THRESHOLD);
    _glob_rnd_reps_threshold = DEFAULT_RND_REPS_THRESHOLD;
    $('#PROCrndREPSdepth').val(DEFAULT_RND_REPS_DEPTH);
    _glob_rnd_reps_depth = DEFAULT_RND_REPS_DEPTH;
    $('#PROCrndWARMUP').val(DEFAULT_RND_WARMUP);
    _glob_rnd_warmup = DEFAULT_RND_WARMUP;
}

function CIRCLESmethodMANAGERrandomTABLEbuild( _show )
{
		var HTMLcode = "" ;
    if ( _glob_process != PROCESS_RANDOM )
    {
       HTMLcode = "<table WIDTH=\"100%\">" ;
       HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
       HTMLcode += "<tr><td STYLE=\"color:"+get_rgb_from_color_tag( "gray" )+";font-size:12pt;\" ALIGN=\"center\">The probabilities manager is available<br>only when random process is chosen</td></tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
       HTMLcode += "<tr><td CLASS=\"link\" ALIGN=\"center\" STYLE=\"font-size:12pt;color:#8FBAC8;\" ONCLICK=\"javascript:_glob_process=PROCESS_RANDOM;_glob_fixedpt_io=FIXEDPOINTS_IO_INPUT;circles_lib_plugin_load('forms','method',2,NO,_glob_method,null);CIRCLESmethodMANAGERrandomTABLEmultisliderINIT();circles_lib_menu_entries_update();\">Set process to random and Reload</td></tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
       HTMLcode += "</table>" ;
       $("#ALGEBRAICrandomCONTAINER").show();
       $("#ALGEBRAICrandomCONTAINER").html( HTMLcode );
       return ;
    }

    _show = safe_int( _show, NO );
    var _sch_n = circles_lib_count_gens_set_model();
    var _items_exist = _sch_n == 0 ? NO : YES ;
    var _edit, _checkbox, _max = 1.0, _residual = 1.0, _val ;
    var _default_probability = _items_exist ? round_to_decimals( 1.0 / _sch_n, _glob_accuracy ) : 0 ;
    var probability_array_exists = safe_size( _glob_rnd_probability_array, 0 ) > 0 ? YES : NO ;
    var _save = !probability_array_exists ;
    var _sum = 0 ;
    HTMLcode = "<table WIDTH=\"100%\">" ;
    HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    HTMLcode += "<tr>" ;
 		HTMLcode += "<td VALIGN=\"top\" "+( _items_exist ? "CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F8F8F8;\"" : "" )+">" ;
    HTMLcode += "<table WIDTH=\"100%\">" ;

    if ( _items_exist )
    {
      HTMLcode += "<tr>" ;
      HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"9\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F8F8F8;\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td>RNG</td>" ;
      HTMLcode += "<td WIDTH=\"2\"></td>" ;
      HTMLcode += "<td>" ;
      HTMLcode += "<SELECT ID=\"RNGcombo\" ONCHANGE=\"javascript:_glob_probabilityRNGmethod=this.options[this.selectedIndex].value\">" ;
			HTMLcode += "<OPTION "+( _glob_probabilityRNGmethod == RNG_BUILT_IN ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+RNG_BUILT_IN+"\">Standard" ;
			HTMLcode += "<OPTION "+( _glob_probabilityRNGmethod == RNG_UNIFORM ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+RNG_UNIFORM+"\">Uniform" ;
			HTMLcode += "<OPTION "+( _glob_probabilityRNGmethod == RNG_COMPLEMENTARY_MULTIPLY_WITH_CARRY ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+RNG_COMPLEMENTARY_MULTIPLY_WITH_CARRY+"\">Complementary Multiply-with-carry" ;
			HTMLcode += "<OPTION "+( _glob_probabilityRNGmethod == RNG_LINEAR_CONGRUENT ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+RNG_LINEAR_CONGRUENT+"\">Linear congruential" ;
			HTMLcode += "<OPTION "+( _glob_probabilityRNGmethod == RNG_MARSAGLIA_ZAMAN ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+RNG_MARSAGLIA_ZAMAN+"\">Marsaglia-Zaman" ;
			HTMLcode += "<OPTION "+( _glob_probabilityRNGmethod == RNG_NORMAL ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+RNG_NORMAL+"\">Normal/Gaussian" ;
  		HTMLcode += "<OPTION "+( _glob_probabilityRNGmethod == RNG_EXPONENTIAL ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+RNG_EXPONENTIAL+"\">Exponential" ;
			HTMLcode += "<OPTION "+( _glob_probabilityRNGmethod == RNG_POISSON ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+RNG_POISSON+"\">Poisson" ;
			HTMLcode += "<OPTION "+( _glob_probabilityRNGmethod == RNG_GAMMA ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+RNG_GAMMA+"\">Gamma" ;
			HTMLcode += "<OPTION "+( _glob_probabilityRNGmethod == RNG_MERSENNE_TWISTER ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+RNG_MERSENNE_TWISTER+"\">Mersenne" ;
			HTMLcode += "<OPTION "+( _glob_probabilityRNGmethod == RNG_SINE ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+RNG_SINE+"\">Sine" ;
      HTMLcode += "</SELECT>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "<td WIDTH=\"15\"></td>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrandomTABLEuniformDISTRIBUTION();\">Uniform</td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:_glob_rnd_probability_array=CIRCLESmethodMANAGERrandomTABLEoptimize(YES);\">Optimize</td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
			HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsMETHODprobabilityDISTRIBUTIONmodelDISPLAY();\">Simulate</td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
		  HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsMETHODprobabilityDISTRIBUTIONprocessDISPLAY();\">Last distribution</td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;

      HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
      if ( _sch_n > 0 )
      {
         HTMLcode += "<tr><td VALIGN=\"top\" COLSPAN=\"8\">" ;
         HTMLcode += "<table><tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td STYLE=\"padding-top:6px;\">Tune' em</td>" ;
         HTMLcode += "<td WIDTH=\"3\"></td>" ;
         HTMLcode += "<td><div STYLE=\"position:relative;\" class=\"slide\" id=\"multislider1\"></div></td>" ;
         HTMLcode += "</tr></table>" ;
         HTMLcode += "</td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
      }

      HTMLcode += "<tr>" ;
      HTMLcode += "<td COLSPAN=\"8\" VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#EBEBEB;padding:4px;\">" ;
  		HTMLcode += "<table>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td>Repetends threshold ></td>" ;
      HTMLcode += "<td WIDTH=\"4\"></td>" ;
      HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"PROCrndREPSthreshold\" STYLE=\"width:30px;text-align:center;\" VALUE=\""+_glob_rnd_reps_threshold+"\" ONBLUR=\"javascript:_glob_rnd_reps_threshold=Math.abs(safe_float(this.value,DEFAULT_RND_REPS_THRESHOLD));this.value=_glob_rnd_reps_threshold;\"></td>" ;
      HTMLcode += "<td WIDTH=\"10\"></td>" ;
      HTMLcode += "<td>Repetends depth</td>" ;
      HTMLcode += "<td WIDTH=\"4\"></td>" ;
      HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"PROCrndREPSdepth\" STYLE=\"width:30px;text-align:center;\" VALUE=\""+_glob_rnd_reps_depth+"\" ONBLUR=\"javascript:_glob_rnd_reps_depth=Math.abs(safe_int(this.value,DEFAULT_RND_REPS_DEPTH));this.value=_glob_rnd_reps_depth;\"></td>" ;
      HTMLcode += "<td WIDTH=\"10\"></td>" ;
      HTMLcode += "<td>Warm-up</td>" ;
      HTMLcode += "<td WIDTH=\"4\"></td>" ;
      HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"PROCrndWARMUP\" STYLE=\"width:30px;text-align:center;\" VALUE=\""+_glob_rnd_warmup+"\" ONBLUR=\"javascript:_glob_rnd_warmup=Math.abs(safe_int(this.value,DEFAULT_RND_WARMUP));this.value=_glob_rnd_warmup;\"></td>" ;
      HTMLcode += "<td WIDTH=\"10\"></td>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrandomTABLEresetREPS();\">Reset</td>" ;
      HTMLcode += "</tr>" ;
  		HTMLcode += "</table>" ;
      HTMLcode += "</td>";
      HTMLcode += "</tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
      HTMLcode += "<tr><td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F0F0F0;padding:4px;\">" ;

      var _word, _candidate_probability, _gen_word, _bulk_of_fns, _out_val ;
			var _original_bulk_of_fns = "if(this.value.length==0){this.value='0';CIRCLESmethodMANAGERrandomTABLEautocalc();}" ;
          _original_bulk_of_fns += "if(this.value.length!=0)CIRCLESmethodMANAGERrandomTABLEautocalc(%index%,"+_sch_n+");" ;
          _original_bulk_of_fns += "CIRCLESmethodMANAGERrandomTABLEsave();";
          _original_bulk_of_fns += "CIRCLESmethodMANAGERrandomTABLEcheck();";
          _original_bulk_of_fns += "$('[id$=renderBTN]').css('color',COLOR_ERROR);CIRCLESmethodMANAGERsetVALUEStoMULTISLIDER();" ;
			if ( _sch_n > 4 )
			HTMLcode += "<div ID=\"CIRCLESformsMETHODrandomtableDIV\" STYLE=\"position:relative;width:100%;height:160px;overflow:auto;padding:2px;\">" ;
		  HTMLcode += "<table WIDTH=\"100%\">" ;

      HTMLcode += "<tr>" ;
      HTMLcode += "<td COLSPAN=\"8\">" ;

			HTMLcode += "<table cellpadding=\"0\" cellspacing=\"0\" VALIGN=\"top\">" ;
 		  HTMLcode += "<tr>" ;
 		  HTMLcode += "<td WIDTH=\"5\"></td>" ;
 		  HTMLcode += "<td>Models</td>" ;
 		  HTMLcode += "<td WIDTH=\"3\"></td>" ;
 		  HTMLcode += "<td>" ;
 		  HTMLcode += "<SELECT ID=\"ALGEBRAICrndPRESETScombo\" ONCHANGE=\"javascript:CIRCLESmethodMANAGERrandomMODELScombo();\">" ;
 		  HTMLcode += "<OPTION></OPTION>" ;
      var _ps_n = safe_size( _glob_presets['rnd'], 0 ), _chunk ;
      for( var _i = 0 ; _i < _ps_n ; _i++ )
      {
         _chunk = _glob_presets['rnd'][_i] ;
    		 HTMLcode += "<OPTION VALUE=\"1\">"+_chunk[0]+"</OPTION>" ;
      }
 		  HTMLcode += "</SELECT>" ;
 		  HTMLcode += "</td>" ;
      HTMLcode += "<td WIDTH=\"15\"></td>" ;
      HTMLcode += "<td><INPUT TYPE=\"checkbox\" "+( _glob_probabilityRNDrecalcAUTOMATICflag ? "CHECKED" : "" )+" ONCLICK=\"javascript:_glob_probabilityRNDrecalcAUTOMATICflag=((this.checked)?1:0);if(_glob_probabilityRNDrecalcAUTOMATICflag)CIRCLESmethodMANAGERrandomTABLEcheck(YES);\"></td>" ;
      HTMLcode += "<td WIDTH=\"2\"></td>" ;
      HTMLcode += "<td>Recalculate</td>" ;
			HTMLcode += "</tr>" ;
			HTMLcode += "</table>" ;

      HTMLcode += "</td>" ;
      HTMLcode += "<td>Lock all</td>";
      HTMLcode += "<td WIDTH=\"2\"></td>" ;
      HTMLcode += "<td><INPUT ID=\"PROCrndCHECKBOXall\" TYPE=\"checkbox\" ONCLICK=\"javascript:$('[id^=PROCrndPROBABILITY_CHECKBOX_]').prop('checked',this.checked);$('[id^=PROCrndPROBABILITY_EDIT_]').prop('disabled', this.checked);\"></td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;

      var _unsolved_gen_word, _resolved_gen_word, _is_pqword = NO, _is_pqword_inv = NO ;
      for( var _i = 0 ; _i < _sch_n ; _i++ )
      {
         if ( _glob_gens_set_model_array[_i] != null )
         {
            _unsolved_gen_word = _glob_gens_set_model_array[_i] ;
            _is_pqword = _unsolved_gen_word.testME( _glob_pqword_regex_pattern );
            _is_pqword_inv = _unsolved_gen_word.testME( _glob_pqword_inv_regex_pattern );
            if ( _is_pqword ) _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.split( "/" ) )[0], ( _unsolved_gen_word.split( "/" ) )[1] );
            else if ( _is_pqword_inv )
            {
               _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[0], ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[1] ) ;
               _resolved_gen_word = circles_lib_word_inverse_get( _resolved_gen_word );
            }
            else _resolved_gen_word =circles_lib_repetends_resolve( _unsolved_gen_word );
            _word = _glob_gens_set_symbols_map_array[ _resolved_gen_word ] ;

						_gen_word = _glob_gens_set_symbols_map_array.get_key_from_val_associative( _word );
            _bulk_of_fns = _original_bulk_of_fns.replaceAll( "%index%", _i );

            _out_val = _glob_rnd_probability_array[ _i ] != null ? _glob_rnd_probability_array[ _i ] : _default_probability ;
            _out_val = safe_float( _out_val, 0 );
            _sum += _out_val ;
            _out_val = safe_float( _out_val, 0 ).clean_round_off( _glob_accuracy );

            HTMLcode += "<INPUT TYPE=\"hidden\" VALUE=\""+_gen_word+"\" ID=\"PROBStableWORD."+_i+"\">" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td>"+( _i + 1 )+")</td>" ;
            HTMLcode += "<td WIDTH=\"2\"></td>" ;
            HTMLcode += "<td WIDTH=\"60\">Probability</td>" ;
            HTMLcode += "<td WIDTH=\"2\"></td>" ;
            HTMLcode += "<td WIDTH=\"150\"><INPUT ID=\"PROCrndPROBABILITY_EDIT_"+_i+"\" STYLE=\"width:150px;\" TYPE=\"edit\" VALUE=\""+_out_val+"\" ONKEYUP=\"javascript:"+_bulk_of_fns+"\" ONBLUR=\"javascript:"+_bulk_of_fns+"\"></td>" ;
            HTMLcode += "<td WIDTH=\"2\"></td>" ;
            HTMLcode += "<td>for map <b>"+_word+"</b></td>" ;
            HTMLcode += "<td WIDTH=\"12\"></td>" ;
            HTMLcode += "<td></td>" ;
            HTMLcode += "<td WIDTH=\"2\"></td>" ;
            HTMLcode += "<td><INPUT TYPE=\"checkbox\" ID=\"PROCrndPROBABILITY_CHECKBOX_"+_i+"\" ONCLICK=\"javascript:$('#PROCrndPROBABILITY_EDIT_"+_i+"').prop('disabled', this.checked);CIRCLESmethodMANAGERrandomTABLElockallCHECK();\"></td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
            HTMLcode += "<tr STYLE=\"color:#AEAEDF;\">" ;
            HTMLcode += "<td COLSPAN=\"2\"></td>" ;
            HTMLcode += "<td STYLE=\"\">"+( _i < _sch_n - 1 ? "Partial sum" : "Final sum" )+"</td>" ;
            HTMLcode += "<td WIDTH=\"2\"></td>" ;
            HTMLcode += "<td ID=\"PROCrndPROBABILITY_LABEL_"+_i+"\" STYLE=\"padding-left:5px;\">"+_sum.clean_round_off(_glob_accuracy)+"</td>" ;
            HTMLcode += "<td WIDTH=\"2\"></td>" ;
            HTMLcode += "<td>originally with symbol <b>"+( _glob_gens_set_model_array[_i] )+"</b></td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
         }
         else
         {
           	HTMLcode += "<tr>" ;
            HTMLcode += "<td>"+( _i + 1 )+")</td>" ;
            HTMLcode += "<td WIDTH=\"5\"></td>" ;
            HTMLcode += "<td COLSPAN=\"5\" STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">Memory error with this generator: can't return infos</td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
         }
      }

			HTMLcode += "</table>" ;
			if ( _sch_n > 6 ) HTMLcode += "</div>" ;
      HTMLcode += "</td></tr>" ;
    }
    else
    {
        HTMLcode += "<tr><td HEIGHT=\"20\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"font-size:12pt;color:"+DEFAULT_COLOR_INFO_FOR_TEXT+";\" ALIGN=\"center\">The gens set has not been initialized yet</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"font-size:12pt;color:"+DEFAULT_COLOR_INFO_FOR_TEXT+";\" ALIGN=\"center\">The probability table is currently empty</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td CLASS=\"link\" ALIGN=\"center\" STYLE=\"font-size:12pt;color:lightblue;\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrandomTABLEbuild(YES);\">Reload</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    }

    if ( _items_exist )
    {
       HTMLcode += "<tr>" ;
       HTMLcode += "<td VALIGN=\"top\" STYLE=\"background-color:#F8F8F8;\" CLASS=\"general_rounded_corners\">" ;
       HTMLcode += "<table>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td WIDTH=\"15\"></td>" ;
     	 HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsMETHODmanagerPROCESS( "+PROCESS_RANDOM+" );\">Reload</td>" ;
       HTMLcode += "<td WIDTH=\"5\"></td>" ;
			 HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrandomtableCOMBOsave();\">Save</td>" ;
       HTMLcode += "<td WIDTH=\"5\"></td>" ;
			 HTMLcode += "<td ID=\"ALGEBRAICrandomTABLEcomboCONTAINER\"></td>" ;

       var _candidate_sum = safe_float( _sum.toFixed( _glob_accuracy ), 0 ).clean_round_off( _glob_accuracy );
       var _ok = _candidate_sum == 1.0 ? YES : NO ;
       var _output = "Distribution sum ("+_candidate_sum+") is " + ( _ok ? "" : "not" ) + " correct" + ( _ok ? "" : ": it must be 1" );
       HTMLcode += "<td WIDTH=\"25\"></td>" ;
       HTMLcode += "<td>Probability sum</td>" ;
       HTMLcode += "<td WIDTH=\"2\"></td>" ;
       HTMLcode += "<td STYLE=\"color:"+( _ok ? "#00AB00" : "#AB0000" )+"\" ID=\"PROCESSrandomPROBABILITYsumCONTAINER\">"+(_sum.toFixed(3))+"</td>" ;
       HTMLcode += "<td WIDTH=\"24\"></td><td STYLE=\"color:"+( _ok ? "#00AB00" : "#AB0000" )+"\" COLSPAN=\"3\" ALIGN=\"center\" ID=\"PROCESSrandomPROBABILITYoutput\">"+_output+"</td>";

       HTMLcode += "</tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode += "</td>" ;
       HTMLcode += "</tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    }

    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    HTMLcode += "</table>" ;

    if ( _show )
    {
       $("#ALGEBRAICrandomCONTAINER").show();
       $("#ALGEBRAICrandomCONTAINER").html( HTMLcode );
       $( "#CIRCLESformsMETHODrandomtableDIV" ).height( $( "#"+CIRCLESformsMETHODdiv_id ).height() - 270 );
       CIRCLESmethodMANAGERrandomtableCOMBOcreate();
    }

    return HTMLcode ;
}

function CIRCLESmethodMANAGERrandomTABLEoptimize( _fill )
{
    _fill = safe_int( _fill, NO );
    var _items_array = _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ) ;
    var _probs_array = [], _det = null, _denominator = 0;
    var _edit, _checkbox, ITEM;
    // compute denominator
    for( var _i = 0 ; _i < _items_n ; _i++ )
    {
       ITEM = _items_array[_i] ;
       if ( is_item_obj( ITEM ) )
       {
          _det = is_mobius_map( ITEM.map ) ? ITEM.map.det() : new complex( 0, 0 );
          _denominator += _det.norm();
       }
    }

    for( _i = 0 ; _i < _items_n ; _i++ )
    {
       ITEM = _items_array[_i] ;
       if ( is_item_obj( ITEM ) )
       {
          _det = is_mobius_map( ITEM.map ) ? ITEM.map.det() : new complex( 0, 0 );
          _probs_array.push( _denominator != 0 ? _det.norm() / _denominator : ( 1.0 / _items_n ) );
       }
    }

		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Optimization has been completed with success", 'PROCESSrandomPROBABILITYoutput' ) ;
    
    if ( _fill )
    {
       for( _i = 0 ; _i < _items_n ; _i++ )
       {
         _edit = $("#PROCrndPROBABILITY_EDIT_" + _i ).get(0);
         _checkbox = $("#PROCrndPROBABILITY_CHECKBOX_" + _i ).get(0);
         if ( _edit != null && _checkbox != null )
         {
              if ( !_checkbox.checked ) _edit.value = _probs_array[_i] ;
         }
       }
    }

    return _probs_array ;
}