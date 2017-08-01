function CIRCLESformsMETHODprobabilityDISTRIBUTIONprocessDISPLAY( _move )
{
		_move = safe_int( _move, YES );
    var _sch_n = circles_lib_count_gens_set_model();
    var _generators_exist = _sch_n == 0 ? NO : YES ;
		if ( _generators_exist )
		{
        var _probabilities_exist = safe_size( _glob_probability_showcase_array, 0 ) > 0 ? YES : NO ;
			  var WIDTH = Math.max( 430, _sch_n * 68 ), HEIGHT = "auto" ;
				var tryouts = 100, _subset = "forms"  ;
				var _graph_html_code = CIRCLESformsMETHODprobabilityDISTRIBUTIONmodelGRAPH( _glob_probabilityRNGmethod, _sch_n, tryouts, WIDTH - 10 );
        var _div_id = circles_lib_plugin_build_divid( 'forms', CIRCLESformsMETHODbaseid );
				var _caller_fn = arguments.callee.name.toString() + "( "+_move+" )";
	      var HTMLcode = "<INPUT TYPE=\"HIDDEN\" ID=\"CIRCLESpairingINDEX01\" VALUE=\""+UNDET+"\"><INPUT TYPE=\"HIDDEN\" ID=\"CIRCLESpairingINDEX02\" VALUE=\""+UNDET+"\">" ;
	          HTMLcode += "<table WIDTH=\""+WIDTH+"\">" ;
	          HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsMETHODcaption, 1, YES, "", WIDTH, HEIGHT, _caller_fn, 'method.probability.distribution', _div_id, _subset, "tools/tools.01.16x16.png", "" );
						HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
            HTMLcode += "<tr><td VALIGN=\"top\" ID=\"METHODprobabilityGRAPHtable\" ALIGN=\"center\"><table>" ;
	          HTMLcode += "<tr><td VALIGN=\"top\" ALIGN=\"center\">Statistics from last rendering</td></tr>" ;
						HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
				if ( !_probabilities_exist )
				{
 	          HTMLcode += "<tr><td VALIGN=\"top\" STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\" ALIGN=\"center\">No method was run yet</td></tr>" ;
						HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
 	          HTMLcode += "<tr><td VALIGN=\"top\" STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\" ALIGN=\"center\">No probability report is available</td></tr>" ;
						HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
				}
				else
				{
            var startINDEX = 0 ;
            var _probability_distribution_array = _glob_probability_showcase_array[startINDEX] ;
                startINDEX++ ;
						var _n_operations = _glob_probability_showcase_array[startINDEX] ;
                startINDEX++ ;
						var _stats_bunch = _glob_probability_showcase_array[startINDEX] ;

					  var _performed_operations = 0, _i, _m, _p ;
            var _entries_n = safe_size( _probability_distribution_array, 0 );
            for( _p = 0 ; _p < _entries_n ; _p++ )
            {
                _probability_distribution_array[_p] = safe_int( _probability_distribution_array[_p], 0 );
                _performed_operations += _probability_distribution_array[_p] ;
            }

            var _items_array = _glob_seeds_array ;
						var _symbols_array = [], _items_n = circles_lib_count_items( _items_array );
						for( _m = 0 ; _m < _items_n ; _m++ ) _symbols_array.push( _items_array[_m].symbol );

						var _chunk = "", _normalized_val = 0, _percentage_val = 0, _n_intervals = safe_size( _symbols_array, 0 );
            for( _i = 0 ; _i < _n_intervals ; _i++ )
						{
							 _normalized_val = _probability_distribution_array[_i] / _performed_operations ;
               _percentage_val = _normalized_val * 100.0 ;
               _symbols_array[_i] = [ _probability_distribution_array[_i], _normalized_val, _percentage_val.toFixed(2), _symbols_array[_i] ] ;
						}

						var _input_heights_array = [];
						var _original_values_array = [];
            for( _i = 0 ; _i < _n_intervals ; _i++ ) _input_heights_array.push(0);
            for( _i = 0 ; _i < _n_intervals ; _i++ )
            _input_heights_array[_i] = safe_int( _probability_distribution_array[_i], 0 );

						var _max_value = 0, _max_height = 120 ;
						for( _i = 0 ; _i < _n_intervals ; _i++ ) _max_value = Math.max( _input_heights_array[_i], _max_value );
						for( _i = 0 ; _i < _n_intervals ; _i++ ) _input_heights_array[_i] = Math.ceil( _input_heights_array[_i] / _max_value * _max_height );

						var _graph_width = 400 ;
						HTMLcode += "<tr><td VALIGN=\"top\">" + CIRCLESformsMETHODprobabilityDISTRIBUTIONmodelGRAPHconstruct( _graph_width, _max_height, _n_intervals, _input_heights_array, _symbols_array ) + "</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td VALIGN=\"top\" ALIGN=\"center\" STYLE=\"background-color:#F8F8F8;\" CLASS=\"general_rounded_corners\">" ;
            HTMLcode += "<table>" ;
            HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
            HTMLcode += "<tr><td COLSPAN=\"5\">Points not drawn because of</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
            HTMLcode += "<tr><td>&bull;&nbsp;falling outside the current region</td><td WIDTH=\"5\"></td><td ALIGN=\"right\">"+_stats_bunch['outer_pts_n']+"</td><td WIDTH=\"3\">/</td><td ALIGN=\"right\">"+_n_operations+"</td><td WIDTH=\"5\"></td><td>( "+( _stats_bunch['outer_pts_n'] / _n_operations * 100.0 )+" % )</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
            HTMLcode += "</table>" ;
            HTMLcode += "</td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
				}

			HTMLcode += "</table></td></tr>" ;
      if ( _probabilities_exist )
      {
         HTMLcode += "<tr><td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
         HTMLcode += "<table>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsMETHODprobabilityDISTRIBUTIONsaveGRAPH();\">Save Graph</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td></tr>" ;
      }
			HTMLcode += "</table>" ;
      HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

      var _div = circles_lib_plugin_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
      if ( _div != null )
      {
         var _x_tag = "LEFT", _y_tag = "TOP" ; // or whatever default tags have been already set in previous implementations
         if ( _glob_popup_divs_rec_positions_array[_div.id] == null )
         _glob_popup_divs_rec_positions_array[_div.id] = [ _x_tag , _y_tag ] ;
         else
         {
            _x_tag = _glob_popup_divs_rec_positions_array[_div.id][0].toUpperCase();
            _y_tag = _glob_popup_divs_rec_positions_array[_div.id][1].toUpperCase();
         }

         circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div.id, CIRCLESformsMETHODcaption );
         var _animate = _move & POPUP_REC_POSITION ? NO : YES ;
         if ( _move & POPUP_MOVE ) move_div( _div.id, _x_tag, _y_tag, null, null, _animate );
      }
		}
		else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't display the random generator graph: no gens available.", 'PROCESSrandomPROBABILITYoutput' ) ;
}

function CIRCLESformsMETHODprobabilityDISTRIBUTIONmodelDISPLAY( _move )
{
		_move = safe_int( _move, YES );
    var _sch_n = circles_lib_count_gens_set_model(), _generators_exist = _sch_n == 0 ? NO : YES ;
		if ( _generators_exist )
		{
			var _RNG_def = $("#RNGcombo option:selected").text();
		  var WIDTH = Math.max( 430, _sch_n * 68 ), HEIGHT = "auto" ;
			var tryouts = 100 ;
			var _graph_html_code = CIRCLESformsMETHODprobabilityDISTRIBUTIONmodelGRAPH( _glob_probabilityRNGmethod, _sch_n, tryouts, WIDTH - 10 );

			var _div_id = "POPUPrandomprobabilityprocessrunDIV" ;
      var _caption = "Rnd probability simulation" ;
      var HTMLcode = "<INPUT TYPE=\"HIDDEN\" ID=\"CIRCLESpairingINDEX01\" VALUE=\""+UNDET+"\"><INPUT TYPE=\"HIDDEN\" ID=\"CIRCLESpairingINDEX02\" VALUE=\""+UNDET+"\">" ;
      HTMLcode += "<table WIDTH=\""+WIDTH+"\">" ;
      HTMLcode += circles_lib_plugin_caption_code( YES, _caption, 1, YES, "", WIDTH, HEIGHT, "", 'method.probability.model', _div_id, "tools/tools.01.16x16.png", "" );
			HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
      HTMLcode += "<tr><td STYLE=\"padding-left:5px;\" VALIGN=\"top\">Simulation - Applying random number generator: <b>" + _RNG_def + "</b></td></tr>" ;
			HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
      HTMLcode += "<tr><td VALIGN=\"top\">" + _graph_html_code + "</td></tr>" ;
			HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
      HTMLcode += "</table>" ;

      HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

      var _div = circles_lib_plugin_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
      if ( _move && _div != null )
      {
          move_div( _div.id, "LEFT", "TOP" );
          circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div.id, _caption );
      }
		}
		else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't display the random generator graph: no gens available.", 'PROCESSrandomPROBABILITYoutput' ) ;
}

function CIRCLESformsMETHODprobabilityDISTRIBUTIONmodelGRAPH( _method_index, _n_intervals, tryouts, _graph_width )
{
		var _rng_obj = new RNG();
		var _mt_obj = new MersenneTwister();
		var _marz_obj = new MarsagliaZamanRndGen();
		var _cmwc_obj = new CMWC();
		var _rnd = null ;
    _method_index = safe_int( _method_index, RNG_BUILT_IN );
    switch( _method_index )
    {
    		case RNG_BUILT_IN:
    		_rnd = function() { return Math.random(); }
    		break ;
    		case RNG_UNIFORM:
    		_rnd = function() { return _rng_obj.uniform(); }
    		break ;
    		case RNG_COMPLEMENTARY_MULTIPLY_WITH_CARRY:
        _cmwc_obj.init_rand( ( new Date() ).getMilliseconds() );
			  _rnd = function() { return _cmwc_obj.rand(); }
    		break ;
    		case RNG_LINEAR_CONGRUENT:
        var _seed = ( new Date() ).getMilliseconds();
 			  _rnd = function() { _seed = _rng_obj.linear_congruential( _seed ); return _seed ; }
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
        case RNG_MARSAGLIA_ZAMAN:
        _marz_obj.init();
 			  _rnd = function() { return _marz_obj.rnd_gen(); }
        break ;
    		default:
    		_rnd = function() { return Math.random(); }
    		break ;
    }

  	var _min = 0, _max = 0, _x = 0, _interval_index = 0, _i ;
  	var _input_heights_array = [] ;
  	for( _i = 0 ; _i < _n_intervals ; _i++ ) _input_heights_array.push( 0 );
		for( _i = 0 ; _i < tryouts ; _i++ )
		{
			 _x = _rnd();
       _interval_index = Math.floor( _x * _n_intervals );
       _input_heights_array[_interval_index] = _input_heights_array[_interval_index] + 1 ;
			 _min = Math.min( _min, _x ), _max = Math.max( _max, _x );
		}

		var _max_value = 0, _max_height = 120 ;
    for( _i = 0 ; _i < _n_intervals ; _i++ ) _max_value = Math.max( _input_heights_array[_i], _max_value );
    for( _i = 0 ; _i < _n_intervals ; _i++ ) _input_heights_array[_i] = Math.ceil( _input_heights_array[_i] / _max_value * _max_height );

		return CIRCLESformsMETHODprobabilityDISTRIBUTIONmodelGRAPHconstruct( _graph_width, _max_height, _n_intervals, _input_heights_array );
}

function CIRCLESformsMETHODprobabilityDISTRIBUTIONsaveGRAPH()
{
    html2canvas( $('#METHODprobabilityGRAPHtable').get(0),
    {
       onrendered: function(canvas)
       {
          circles_lib_files_pix_save( NO_PLANE, canvas, "random.distribution.png" );
       }
    });
}

function CIRCLESformsMETHODprobabilityDISTRIBUTIONmodelGRAPHconstruct( _graph_width, _max_height, _n_intervals, _input_heights_array, _statistics_array )
{
		_n_intervals = safe_int( _n_intervals, 0 );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var HTMLcode = "" ;
		if ( _n_intervals == 0 )
    {
   		 HTMLcode = "<table ALIGN=\"center\" STYLE=\"border-collapse:collapse;height:"+(_max_height+40)+"px;width:"+_graph_width+"px;\">" ;
       HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
       HTMLcode += "<tr><td ALIGN=\"center\">Can't render this graph because no rendering has been performed yet</td></tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
       HTMLcode += "</table>" ;
    }
    else
    {
   		 var _statistics_exist = safe_size( _statistics_array ) > 0 ? YES : NO, _i ;
       var _column_width = Math.floor( _graph_width / _n_intervals ) - ( 5 * ( _n_intervals - 1 ) ), _height = 0 ;
       HTMLcode += "<table ALIGN=\"center\" STYLE=\"border-collapse:collapse;height:"+(_max_height+40)+"px;width:"+_graph_width+"px;\">" ;
    	 if ( _statistics_exist )
    	 {
    			 var _how_many = 0, _perc = 0 ;
    		 	 HTMLcode += "<tr>" ;
    			 for( _i = 0 ; _i < _n_intervals ; _i++ )
    			 {
              _how_many = safe_int( _statistics_array[_i][0], 0 );
              _perc = safe_float( _statistics_array[_i][2], 0 );
    	        HTMLcode += "<td VALIGN=\"bottom\" WIDTH=\""+_column_width+"\" ALIGN=\"center\">"+_how_many+"<br>("+_perc+"%)</td>" ;
    		      if ( _i < ( _n_intervals - 1 ) ) HTMLcode += "<td WIDTH=\"5\"></td>" ;
    			 }
    
   			 	 HTMLcode += "</tr>" ;
    	 }
    
   	   HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>";
    	 HTMLcode += "<tr>" ;
    
       for( _i = 0 ; _i < _n_intervals ; _i++ )
    	 {
    			_height = safe_int( _input_heights_array[_i], 0 );
    			if ( _height == 0 ) HTMLcode += "<td VALIGN=\"bottom\" WIDTH=\""+_column_width+"\"><DIV CLASS=\"vertical_bk_gradient\" STYLE=\"position:relative;background-color:blue;width:100%;height:"+_height+"px;\"></DIV></td>" ;
    			else HTMLcode += "<td VALIGN=\"bottom\" WIDTH=\""+_column_width+"\"><DIV CLASS=\"vertical_bk_gradient\" STYLE=\"position:relative;background-color:blue;width:100%;height:"+_height+"px;\"></DIV></td>" ;
    		  if ( _i < ( _n_intervals - 1 ) ) HTMLcode += "<td WIDTH=\"5\"></td>" ;
    	 }
    
    	 HTMLcode += "</tr>" ;
    	 HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>";
    
    	 var _symbol, _gen_word ;
    	 for( _i = 0 ; _i < _n_intervals ; _i++ )
    	 {
          _symbol = _items_array[_i].symbol ;
     	    _gen_word = _glob_gens_set_symbols_map_array.get_key_from_val_associative( _symbol );
    			HTMLcode += "<td ALIGN=\"center\"><b>"+_gen_word+"</b></td>" ;
    		  if ( _i < ( _n_intervals - 1 ) ) HTMLcode += "<td WIDTH=\"5\"></td>" ;
    	 }
    
       HTMLcode += "</tr>";
    	 HTMLcode += "</table>" ;
    }

		return HTMLcode ;
}