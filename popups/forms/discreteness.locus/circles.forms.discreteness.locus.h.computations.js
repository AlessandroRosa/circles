function CIRCLESformsDISCRETENESSLOCUSbenchmark()
{
		var _s_time = CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['start_time'] ;
		var _e_time = CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['end_time'] ;
		var _errors = safe_int( CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_errors'], "None" );
		var _left = safe_float( CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_left'], "Invalid value" ) ;
		var _top = safe_float( CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_top'], "Invalid value" ) ;
		var _right = safe_float( CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_right'], "Invalid value" ) ;
		var _bottom = safe_float( CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_bottom'], "Invalid value" ) ;
		var _diff_secs = ( _e_time - _s_time ) / 1000 ;
		var _n_complex_pts = safe_size( CIRCLESformsDISCRETENESSLOCUScomplex_pts_array, "Invalid" );
		var _n_screen_pts = safe_size( CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array, "Invalid" );

		var HTMLcode = "<table>" ;
				HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"color:#6485A8;\" COLSPAN=\"3\">Current locus tracing features</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:#545454;\">Rendering time</td><td WIDTH=\"5\"></td><td STYLE=\"font-size:10pt;color:#89AACD;\">"+_diff_secs+" second"+( _diff_secs == 1 ? "" : "s" )+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:#545454;\">Errors</td><td WIDTH=\"5\"></td><td STYLE=\"font-size:10pt;color:#89AACD;\">"+_errors+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:#545454;\">Max left</td><td WIDTH=\"5\"></td><td STYLE=\"font-size:10pt;color:#89AACD;\">"+_left+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:#545454;\">Max right</td><td WIDTH=\"5\"></td><td STYLE=\"font-size:10pt;color:#89AACD;\">"+_right+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:#545454;\">Max top</td><td WIDTH=\"5\"></td><td STYLE=\"font-size:10pt;color:#89AACD;\">"+_top+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:#545454;\">Max bottom</td><td WIDTH=\"5\"></td><td STYLE=\"font-size:10pt;color:#89AACD;\">"+_bottom+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:#545454;\">Input complex points</td><td WIDTH=\"5\"></td><td STYLE=\"font-size:10pt;color:#89AACD;\">"+_n_complex_pts+"</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
				HTMLcode += "<tr><td STYLE=\"font-size:10pt;color:#545454;\">Output screen points</td><td WIDTH=\"5\"></td><td STYLE=\"font-size:10pt;color:#89AACD;\">"+_n_screen_pts+"</td></tr>" ;
				HTMLcode += "</table>" ;

		$( "#CIRCLESformsDISCRETENESSLOCUSbenchmarkCONTAINER" ).html( HTMLcode );
}

function CIRCLESformsDISCRETENESSLOCUSgetFAREYFRACS()
{
    var _farey_start = new farey();
        _farey_start.read_fraction( $( "#CIRCLESformsDISCRETENESSLOCUSstartFRAC" ).val() );
        _farey_start.self_reduce(); $( "#CIRCLESformsDISCRETENESSLOCUSstartFRAC" ).val( _farey_start.output() );
    var _farey_end = new farey();
        _farey_end.read_fraction( $( "#CIRCLESformsDISCRETENESSLOCUSendFRAC" ).val() );
        _farey_end.self_reduce(); $( "#CIRCLESformsDISCRETENESSLOCUSendFRAC" ).val( _farey_end.output() );
    return ( [ _farey_start, _farey_end ] ).clone();
}

function CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYstop() { _glob_inline_worker.stop(); SPLASHanimated( "", NO ); }

function CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYprogressive( _data_array )
{
    var _pieces_array, _complex_pt, _farey_frac = new farey() ;
    // first store into separate arrays, so that a same index matches the triplet
    // p/q fraction <---> complex trace <---> screen pt
    
    $.each( _data_array,
            function( _index, _chunk )
            {
                _chunk += "" ;
                if ( _index == 0 )
                {
                    _ref = _chunk ;
                    CIRCLESformsDISCRETENESSLOCUStmp_pts_array[ _ref ] = [];
                }
                else if( _chunk.includes( "[", ":", "]" ) )
                {
                    _pieces_array = _chunk.replaceAll( [ "[", "]" ], "" ).split( ":" );
                    _farey_frac.read_fraction( _pieces_array[0] );
                    _complex_pt = parse_complex_from_string( _pieces_array[1] );
                    if ( !_farey_frac.is_indeterminate() && is_complex( _complex_pt ) )
                    {
                        CIRCLESformsDISCRETENESSLOCUSoriginal_fracs_pts_array[ _farey_frac.output() ] = _complex_pt ;
                        CIRCLESformsDISCRETENESSLOCUSpq_fracs_array.push( _farey_frac );
                        CIRCLESformsDISCRETENESSLOCUStmp_pts_array[ _ref ].push( _complex_pt );
                        CIRCLESformsDISCRETENESSLOCUScomplex_pts_array.push( _complex_pt );
                    }
                    else
                    {
												if ( CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_errors'] == null )
												CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_errors'] = 0 ;
												else CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_errors']++ ;
										}
                }
            }
          );
}

function CIRCLESformsDISCRETENESSLOCUScomputeCUSP()
{
    var _tmp_discreteness_locus = new discreteness_locus();
    var _order = Math.max( 0, safe_int( $( "#CIRCLESformsDISCRETENESSLOCUSorder" ).val(), 0 ) );
    var _chunk_selection = $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).val();
    var _init_mode = _chunk_selection.includes( "@" ) ? safe_int( ( _chunk_selection.split( "@" ) )[0], _DLOCUS_NONE ) : _DLOCUS_NONE ;
    var _pq_for_cusp = $( "#CIRCLESformsDISCRETENESSLOCUScuspFRAC" ).val();

    var _pl_rays_flag = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    var _pl_rays_keepgoing = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayskeepgoingCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    var _pl_rays_correction = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayscorrectionCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    var _pl_rays_mask = 0 ;
     		_pl_rays_mask |= $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayspositiveCHECKBOX" ).prop( "checked" ) ? 1 : 0 ;
     		_pl_rays_mask |= $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysnegativeCHECKBOX" ).prop( "checked" ) ? 2 : 0 ;
		var _pl_rays_max_steps = safe_int( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITmaxsteps" ).val(), _tmp_discreteness_locus.get_pleating_rays_max_iterate() );
				_pl_rays_max_steps = Math.max( _pl_rays_max_steps, _tmp_discreteness_locus.get_pleating_rays_max_iterate() );
		var _pl_rays_step_rate = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITsteprate" ).val(), _tmp_discreteness_locus.get_pleating_rays_step_rate() );
		var _pl_rays_threshold_accuracy = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITaccuracy" ).val(), _tmp_discreteness_locus.get_pleating_rays_threshold_accuracy() );
		var _pl_rays_forward_factor = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITforwardfactor" ).val(), _tmp_discreteness_locus.get_pleating_rays_forward_factor() );
		var _pl_rays_backward_factor = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITbackwardfactor" ).val(), _tmp_discreteness_locus.get_pleating_rays_backward_factor() );

    if ( _init_mode == _DLOCUS_NONE ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Missing slice selection", "CIRCLESformsDLOCUSoutMSG" ) ;
    else if ( _order == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Order must be greater than zero", "CIRCLESformsDLOCUSoutMSG" ) ;
    else
    {
				if ( CIRCLESformsDISCRETENESSLOCUScustomPARAMSset( YES ) )
				{
        		CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['start_time'] = unixtime() ;
						var _pq_farey_for_cusp = new farey( _pq_for_cusp );
            var _start_frac = new farey( 0, 1 ), _end_frac = _pq_farey_for_cusp.ratio() > 1 ? _pq_farey_for_cusp.clone() : new farey( 1, 1 );
            var PQword = circles_lib_word_pq_translate( _pq_farey_for_cusp.p, _pq_farey_for_cusp.q );
                $( "#CIRCLESformsDISCRETENESSLOCUScuspWORD" ).val( PQword );
            CIRCLESformsDISCRETENESSLOCUStrace_fix_op = safe_int( CIRCLESformsDISCRETENESSLOCUStrace_fix_op, _DLOCUS_TRACE_FIX_DEFAULT_OP );

            var _features = [];
		            _features['custom'] = YES ;
		            _features['initmode'] = _init_mode ;
		            _features['draw'] = NO ;
		            _features['boundingrect'] = [ _glob_dlocusLEFT, _glob_dlocusTOP, _glob_dlocusRIGHT, _glob_dlocusBOTTOM ] ;
		            _features['pleatingrays'] = [ _pl_rays_flag, _pl_rays_mask, _pl_rays_max_steps, _pl_rays_step_rate, _pl_rays_threshold_accuracy, _pl_rays_forward_factor, _pl_rays_backward_factor, _pl_rays_correction, _pl_rays_keepgoing ] ;
                _features['accuracy'] = $( "#CIRCLESformsDISCRETENESSLOCUSaccuracy" ).val();
                $( "#CIRCLESformsDISCRETENESSLOCUSaccuracy" ).val( _features['accuracy'] );
                _features['maxiterate'] = $( "#CIRCLESformsDISCRETENESSLOCUSmaxstep" ).val();
		            _features['start_frac'] = _start_frac ;
		            _features['end_frac'] = _end_frac ;
                _features['trace_fix_op'] = CIRCLESformsDISCRETENESSLOCUStrace_fix_op ;
		            _features['start_fn'] = CIRCLESformsDISCRETENESSLOCUSpopupPROCESSstart.myname();
		            _features['end_fn'] = CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYend.myname();
		            _features['stop_fn'] = CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYstop.myname();
		            _features['draw_fn'] = "" ;
		            _features['updates_fn'] = CIRCLESformsDISCRETENESSLOCUScomputeCUSPupdateTEXT.myname();
		            _features['fill'] = $( "#CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX" ).prop( "checked" ) ? YES : NO ;
		            _features['copy'] = $( "#CIRCLESformsDISCRETENESSLOCUSclipboardcopyCHECKBOX" ).prop( "checked" ) ? YES : NO ;
		            _features['custom_params'] = [ CIRCLESformsDISCRETENESSLOCUSstarting_value,
																							 CIRCLESformsDISCRETENESSLOCUStr_A, CIRCLESformsDISCRETENESSLOCUStr_B,
																							 CIRCLESformsDISCRETENESSLOCUStr_ABab, CIRCLESformsDISCRETENESSLOCUSeq_solution ] ;
		            var JS_FOLDER_COMPONENTS = "code/js/components/" ;
                var MULTITHREAD_FOLDER = JS_FOLDER_COMPONENTS + "multi.threading/cmds.support/discreteness.locus/" ;
		            var JS_FOLDER_ALL_PROJECTS = _glob_path_to_support + "code/js/all.projects/" ;
		            var JS_FOLDER_CLASSES = JS_FOLDER_ALL_PROJECTS + "classes/load/" ;
		
		            $.ajaxSetup( {async:false} );
                if ( check_file_exists( MULTITHREAD_FOLDER + "discreteness.locus.worker.js" ) )
                {
    		            var _code_array = [];
    		            // load the multi-tasking obj code
    		            _code_array.push( $.getScript( MULTITHREAD_FOLDER + "discreteness.locus.worker.js",
    																		function( response, status, jqxhr )
    				                            { 
    				                                if ( status.toLowerCase().stricmp( "success" ) ) return response ;
    				                                else return NO ;
    				                            } ).responseText
    																);
    		            // join the above code into one piece and give it to the worker
    		            var _inline_worker_code = _code_array.join( _glob_crlf );
    		            // import this code for worker obj to process input data
    		            _glob_inline_worker = new inline_worker( _inline_worker_code,
    		                                                     [ JS_FOLDER_COMPONENTS + "globals/defs/circles.constants.js",
    		                                                       MULTITHREAD_FOLDER + "discreteness.locus.process.js",
    		                                                       JS_FOLDER_ALL_PROJECTS + "basics/a-basics/number.js",
    		                                                       JS_FOLDER_ALL_PROJECTS + "basics/a-basics/string.js",
																													     JS_FOLDER_ALL_PROJECTS + "basics/a-basics/json.lib.js",
    		                                                       JS_FOLDER_ALL_PROJECTS + "basics/array.js",
    		                                                       JS_FOLDER_CLASSES + "a-primitives/2d.point.class.js",
    		                                                       JS_FOLDER_CLASSES + "a-primitives/rect.class.js",
    		                                                       JS_FOLDER_CLASSES + "b-basic.maths/complex.number.class.js",
    		                                                       JS_FOLDER_CLASSES + "e-adv.maths/complex.matrix.class.js",
    		                                                       JS_FOLDER_CLASSES + "b-basic.maths/fraction.class.js",
    		                                                       JS_FOLDER_CLASSES + "b-basic.maths/farey.class.js",
    		                                                       JS_FOLDER_CLASSES + "e-adv.maths/discreteness.locus.class.js",
    		                                                       JS_FOLDER_COMPONENTS + "libs/foundations/symbols/circles.word.lib.js"
    		                                                     ] );
                    // feed input data
    		            _glob_inline_worker.init_vars( { out_channel : OUTPUT_SCREEN,
    		                                             locus_obj : _glob_inline_worker_discreteness_locus,
    		                                             param_01 : "",
    		                                             features : _features,
    		                                             order : _order,
    		                                             pq_for_cusp : _pq_for_cusp,
    		                                             service : "cusp",
    		                                             data_storage_ref : _glob_storage,
    		                                             crlf : _glob_crlf
    		                                           } );
    		            // go !
    		            _glob_inline_worker.run();
                }
                else
                {
                    var _msg = "Discreteness locus component is missing or corrupted" ;
                    circles_lib_log_add_entry( _msg, LOG_ERROR ) ;
                }
				}
				else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't render the selected cusp: invalid input params", "CIRCLESformsDLOCUSoutMSG" ) ; 
    }
}

function CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYbegin()
{
    var _chunk = [] ;
        _chunk.push( CIRCLESformsDISCRETENESSLOCUSoriginal_fracs_pts_array );
        _chunk.push( CIRCLESformsDISCRETENESSLOCUSpq_fracs_array );
        _chunk.push( CIRCLESformsDISCRETENESSLOCUScomplex_pts_array );
        _chunk.push( CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array );
        _chunk.push( CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array );
        _chunk.push( CIRCLESformsDISCRETENESSLOCUStmp_pts_array );
        _chunk.push( CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array );
    $.each( _chunk, function( _i, _arr ) { _arr.is_associative() ? _arr.flush_associative() : _arr.flush(); } );
}

function CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARY( _canvas, _screen_rect )
{
    CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYbegin();
    var _tmp_discreteness_locus = new discreteness_locus();
    var _order = Math.max( 0, safe_int( $( "#CIRCLESformsDISCRETENESSLOCUSorder" ).val(), 0 ) );
    var _chunk_selection = $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).val();
    var _init_mode = _chunk_selection.includes( "@" ) ? safe_int( ( _chunk_selection.split( "@" ) )[0], _DLOCUS_NONE ) : _DLOCUS_NONE ;
    var _farey_fracts = CIRCLESformsDISCRETENESSLOCUSgetFAREYFRACS();
    var _farey_start = _farey_fracts[0], _farey_end = _farey_fracts[1] ;

    var _pl_rays_flag = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    var _pl_rays_correction = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayscorrectionCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    var _pl_rays_keepgoing = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayskeepgoingCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    var _pl_rays_mask = 0 ;
     		_pl_rays_mask |= $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayspositiveCHECKBOX" ).prop( "checked" ) ? 1 : 0 ;
     		_pl_rays_mask |= $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysnegativeCHECKBOX" ).prop( "checked" ) ? 2 : 0 ;
		var _pl_rays_max_steps = safe_int( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITmaxsteps" ).val(), _tmp_discreteness_locus.get_pleating_rays_max_iterate() );
				_pl_rays_max_steps = Math.max( _pl_rays_max_steps, _tmp_discreteness_locus.get_pleating_rays_max_iterate() );
		var _pl_rays_step_rate = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITsteprate" ).val(), _tmp_discreteness_locus.get_pleating_rays_step_rate() );
		var _pl_rays_threshold_accuracy = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITaccuracy" ).val(), _tmp_discreteness_locus.get_pleating_rays_threshold_accuracy() );
		var _pl_rays_forward_factor = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITforwardfactor" ).val(), _tmp_discreteness_locus.get_pleating_rays_forward_factor() );
		var _pl_rays_backward_factor = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITbackwardfactor" ).val(), _tmp_discreteness_locus.get_pleating_rays_backward_factor() );

		if ( _pl_rays_flag && _pl_rays_mask == 0 )
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Missing both input pleating rays classes: please, choose at least one", "CIRCLESformsDLOCUSoutMSG" ) ;
    else if ( _farey_start.is_indeterminate() )
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Missing or invalid starting fraction: can't compute the slice", "CIRCLESformsDLOCUSoutMSG" ) ;
    else if ( _farey_start.is_lesser_eq( _farey_end ) )
    {
				var _max_order = Math.max( _farey_start.get_den(), _farey_end.get_den() );
        if ( _order < _max_order )
        {
            _order = Math.ceil( _max_order * 1.3 );
            $( "#CIRCLESformsDISCRETENESSLOCUSorder" ).val( _order );
        }

        $( "#CIRCLESformsDISCRETENESSLOCUSendFRAC" ).html( _farey_fracts[1].output() );
				
				if ( CIRCLESformsDISCRETENESSLOCUScustomPARAMSset( YES ) )
				{
        		CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['start_time'] = unixtime() ;
            CIRCLESformsDISCRETENESSLOCUStrace_fix_op = safe_int( CIRCLESformsDISCRETENESSLOCUStrace_fix_op, _DLOCUS_TRACE_FIX_DEFAULT_OP );

		    var _features = [];
		        _features['custom'] = YES ;
		        _features['initmode'] = _init_mode ;
		        _features['draw'] = YES ;
		        _features['boundingrect'] = [ _glob_dlocusLEFT, _glob_dlocusTOP, _glob_dlocusRIGHT, _glob_dlocusBOTTOM ] ;
		        _features['pleatingrays'] = [ _pl_rays_flag, _pl_rays_mask, _pl_rays_max_steps, _pl_rays_step_rate, _pl_rays_threshold_accuracy, _pl_rays_forward_factor, _pl_rays_backward_factor, _pl_rays_correction, _pl_rays_keepgoing ] ;
            _features['accuracy'] = $( "#CIRCLESformsDISCRETENESSLOCUSaccuracy" ).val();
            $( "#CIRCLESformsDISCRETENESSLOCUSaccuracy" ).val( _features['accuracy'] );
            _features['maxiterate'] = $( "#CIRCLESformsDISCRETENESSLOCUSmaxstep" ).val();
		        _features['start_frac'] = _farey_start ;
		        _features['end_frac'] = _farey_end ;
            _features['trace_fix_op'] = CIRCLESformsDISCRETENESSLOCUStrace_fix_op ;
		        _features['start_fn'] = CIRCLESformsDISCRETENESSLOCUSpopupPROCESSstart.myname();
		        _features['draw_fn'] = CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYprogressive.myname();
		        _features['end_fn'] = CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYend.myname();
		        _features['stop_fn'] = CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYstop.myname();
		        _features['updates_fn'] = CIRCLESformsDISCRETENESSLOCUSpopupPROCESSupdateTEXT.myname();
		        _features['fill'] = $( "#CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX" ).prop( "checked" ) ? YES : NO ;
		        _features['copy'] = $( "#CIRCLESformsDISCRETENESSLOCUSclipboardcopyCHECKBOX" ).prop( "checked" ) ? YES : NO ;
		        _features['custom_params'] = [ CIRCLESformsDISCRETENESSLOCUSstarting_value, CIRCLESformsDISCRETENESSLOCUStr_A, CIRCLESformsDISCRETENESSLOCUStr_B, CIRCLESformsDISCRETENESSLOCUStr_ABab, CIRCLESformsDISCRETENESSLOCUSeq_solution ] ;

		        if ( _init_mode == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Select a slice first, then redraw", "CIRCLESformsDLOCUSoutMSG" ) ;
		        else if ( _order == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Order must be greater than zero", "CIRCLESformsDLOCUSoutMSG" ) ;
		        else
		        {
		            _glob_current_tab['dlocus'] = 0 ;
		            $( "#CIRCLESformsDISCRETENESSLOCUSmainDIV" ).get(0).tabber.tabShow(0);
		            CIRCLESformsDISCRETENESSLOCUSdispatcher( POPUP_DISPATCHER_UNICAST_EVENT_FOCUS ) ;

		            var JS_FOLDER_COMPONENTS = "code/js/components/" ;
                var MULTITHREAD_FOLDER = JS_FOLDER_COMPONENTS + "multi.threading/cmds.support/discreteness.locus/" ;
		            var JS_FOLDER_ALL_PROJECTS = _glob_path_to_support + "code/js/all.projects/" ;
		            var JS_FOLDER_CLASSES = JS_FOLDER_ALL_PROJECTS + "classes/load/" ;
		        
		            $.ajaxSetup( {async:false} );
                if ( check_file_exists( MULTITHREAD_FOLDER + "discreteness.locus.worker.js" ) )
                {
    		            var _code_array = [];
    		            // load the main multi-tasking code
    		            _code_array.push( $.getScript( MULTITHREAD_FOLDER + "discreteness.locus.worker.js", function( response, status ){ return response ; } ).responseText );
    		            // join the above code into one piece and give it to the worker
    		            var _inline_worker_code = _code_array.join( _glob_crlf );
    		            // import this code for worker to process input data
    		            _glob_inline_worker = new inline_worker( _inline_worker_code,
    		                                                     [ JS_FOLDER_COMPONENTS + "globals/defs/circles.constants.js",
    		                                                       MULTITHREAD_FOLDER + "discreteness.locus.process.js",
    		                                                       JS_FOLDER_ALL_PROJECTS + "basics/a-basics/number.js",
    		                                                       JS_FOLDER_ALL_PROJECTS + "basics/a-basics/string.js",
																													     JS_FOLDER_ALL_PROJECTS + "basics/a-basics/json.lib.js",
    		                                                       JS_FOLDER_ALL_PROJECTS + "basics/array.js",
    		                                                       JS_FOLDER_CLASSES + "a-primitives/2d.point.class.js",
    		                                                       JS_FOLDER_CLASSES + "a-primitives/rect.class.js",
    		                                                       JS_FOLDER_CLASSES + "b-basic.maths/complex.number.class.js",
    		                                                       JS_FOLDER_CLASSES + "e-adv.maths/complex.matrix.class.js",
    		                                                       JS_FOLDER_CLASSES + "b-basic.maths/fraction.class.js",
    		                                                       JS_FOLDER_CLASSES + "b-basic.maths/farey.class.js",
    		                                                       JS_FOLDER_CLASSES + "e-adv.maths/discreteness.locus.class.js",
    		                                                       JS_FOLDER_COMPONENTS + "libs/foundations/symbols/circles.word.lib.js"
    		                                                     ] );
    		            // feed some input vars
    		            _glob_inline_worker.init_vars( { out_channel : OUTPUT_SCREEN,
    		                                             locus_obj : _glob_inline_worker_discreteness_locus,
    		                                             param_01 : "",
    		                                             features : _features,
    		                                             order : _order,
    		                                             pq_for_cusp : "",
    		                                             service : "dlocus",
    		                                             data_storage_ref : _glob_storage,
    		                                             crlf : _glob_crlf,
    		                                             upper_bound : 1.0
    		                                           } );
    		            // go !
    		            _glob_inline_worker.run();
                }
                else
                {
                    var _msg = "Discreteness locus component is missing or corrupted" ;
                    circles_lib_log_add_entry( _msg, LOG_ERROR ) ;
                }
		        }
				}
				else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't render the selected slice: invalid input params", "CIRCLESformsDLOCUSoutMSG" ) ;
    }
    else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't compute the slice: fractions or params are not congruent.", "CIRCLESformsDLOCUSoutMSG" ) ;
}

function CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARYend( _adapt_view )
{
    _adapt_view = safe_int( _adapt_view, YES );
    SPLASHanimated( "", NO );
    var _canvas_id = _glob_target_plane == BIP_BOX ? "CIRCLESbipCANVAS" : "CIRCLESdlocusdiagramCANVAS" ;
    var _canvas_sm = _glob_target_plane == BIP_BOX ? bipbox_sm.copy() : dlocus_sm.copy() ;
    var _canvas = $( "#" + _canvas_id ).get(0);
    if ( is_html_canvas( _canvas ) && safe_size( CIRCLESformsDISCRETENESSLOCUScomplex_pts_array, 0 ) > 0 )
    {
	   		var _options = [] ;
	   		if ( !$( "#CIRCLESformsDISCRETENESSLOCUSfixregionCHECKBOX" ).prop( "checked" ) ) _options.push( 128 );
	   		_options = _options.concat( [ 2, 8, 1, 64, 16, 32 ] );
	      CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( _options, YES );
	      if ( function_exists( "CIRCLESformsCOORDINATESfillINTOedits" ) )
	      CIRCLESformsCOORDINATESfillINTOedits( D_LOCUS );
    }
    else
    {
	      var _msg = "Missing" ;
	      var _mask = 0 ;
						_mask |= !is_html_canvas( _canvas ) ? 1 : 0 ;
						_mask |= safe_size( CIRCLESformsDISCRETENESSLOCUScomplex_pts_array, 0 ) == 0 ? 2 : 0 ;
	      if ( _mask & 1 ) _msg += " canvas component" ;
	      if ( _mask & 2 ) _msg += ( _mask & 1 ? " and " : "" ) + " locus output points" ;
	      circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "CIRCLESformsDLOCUSoutMSG" ) ;
    }

    CIRCLESformsDISCRETENESSLOCUSdisplayBOUNDARYcoords();
 		CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['end_time'] = unixtime() ;
    CIRCLESformsDISCRETENESSLOCUSbenchmark();

    if ( circles_lib_popup_exists( "bip", POPUP_SEARCH_BY_BASE_ID ) != UNFOUND )
    circles_lib_popup_dispatcher_unicast_message( "bip", "forms", POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS );
}