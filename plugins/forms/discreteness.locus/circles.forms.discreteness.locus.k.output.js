function CIRCLESformsDISCRETENESSLOCUSpleatingrayLIST( _out_stream )
{
		_out_stream = safe_int( _out_stream, 1 );
    var cusp_value = safe_string( $( "#CIRCLESformsDISCRETENESSLOCUScuspVALUE" ).val(), "" );
    cusp_value = cusp_value.length > 0 ? parse_complex_from_string( cusp_value ) : null ;
    if ( is_complex( cusp_value ) )
    {
        var _tmp_discreteness_locus = new discreteness_locus();
        var _pq_farey = new farey( $( "#CIRCLESformsDISCRETENESSLOCUScuspFRAC" ).val() );
        var _bounding_rect = new rect( _glob_dlocusLEFT, _glob_dlocusTOP, _glob_dlocusRIGHT, _glob_dlocusBOTTOM, _RECT_ORIENTATION_CARTESIAN );
        var _pl_rays_keepgoing = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayskeepgoingCHECKBOX" ).prop( "checked" ) ? YES : NO ;
        var _pl_rays_correction = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayscorrectionCHECKBOX" ).prop( "checked" ) ? YES : NO ;
   		  var _pl_rays_max_steps = safe_int( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITmaxsteps" ).val(), _tmp_discreteness_locus.get_pleating_rays_max_iterate() );
   		 		  _pl_rays_max_steps = Math.max( _pl_rays_max_steps, _tmp_discreteness_locus.get_pleating_rays_max_iterate() );
   		  var _pl_rays_step_rate = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITsteprate" ).val(), _tmp_discreteness_locus.get_pleating_rays_step_rate() );
    		var _pl_rays_threshold_accuracy = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITaccuracy" ).val(), _tmp_discreteness_locus.get_pleating_rays_threshold_accuracy() );
    		var _pl_rays_forward_factor = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITforwardfactor" ).val(), _tmp_discreteness_locus.get_pleating_rays_forward_factor() );
    		var _pl_rays_backward_factor = safe_float( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITbackwardfactor" ).val(), _tmp_discreteness_locus.get_pleating_rays_backward_factor() );

        var _eq_solution = circles_lib_math_parse_formula( $( "#CIRCLESformsDISCRETENESSLOCUSeqSOLUTION" ).val() );
            _eq_solution = parse_complex_from_string( _eq_solution + "" );
    
        var _pl_ray_orbit = _tmp_discreteness_locus.pleating_positive_ray( _pq_farey, cusp_value,
                                                               _eq_solution,
                                                               _pl_rays_max_steps,
                                                               _bounding_rect, null,
                                                               _pl_rays_keepgoing, _pl_rays_correction );
        var _n_orbit = safe_size( _pl_ray_orbit, 0 );
				if ( _n_orbit > 0 )
        {
            switch( _out_stream )
            {
								case 1: // screen
								CIRCLESformsDISCRETENESSLOCUScomputeCUSPupdatePLEATINGrayORBITlist( $( "#CIRCLESformsDISCRETENESSLOCUScuspFRAC" ).val(), _pl_ray_orbit );
			          $( "#CIRCLESformsDISCRETENESSLOCUSmainDIV" ).get(0).tabber.tabShow(5);
			          $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).hide();
			          $( "#CIRCLESdlocusworklayerCANVAS" ).hide();
								break ;
								case 2: // text file
				        var _text = [], _behavior = "", _prev_distance = 0, _curr_distance = 0, _dist_from_prev_pt ;
				        var _embedding = $( '#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected' ).text();
				        if ( _embedding.length > 0 ) _text.push( "Embedding : " + _embedding );
				        _text.push( "" );
				        _text.push( "This is the orbit of "+_n_orbit+" point"+( _n_orbit == 1 ? "" : "s" )+" for the pleating ray departing from cusp " + _pq_farey.output() );
				        _text.push( "" );
						
				        $.each( _pl_ray_orbit,
				                function( _i, _complex_pt )
				                {
				                    _curr_distance = _dist_from_prev_pt = _i > 0 ? _complex_pt.distance( _pl_ray_orbit[_i-1] ) : 0 ;
				                    _behavior = _curr_distance < _prev_distance ? "convergence" : "divergence" ;
														_text.push( ( _i + 1 ) + ") " + _complex_pt.formula() + "\t" + _dist_from_prev_pt + "\t" + _behavior );
														_prev_distance = _curr_distance ;
				                }
				              );
						    
				        var _filename = "circles." + ( _embedding.length > 0 ? _embedding + "." : "" ) + "discreteness.locus.txt" ;
				        var _basename = basename( _filename );
				        var blob = new Blob( [ _text.join( _glob_crlf ) ], { type: 'plain/text', endings: 'native' });
				        saveAs( blob, _filename.replaceAll( " ", "" ).replaceAll( ",", "." ) );
								break ;
                default: break ;
						}
        }
    }
    else
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Missing cusp value: please, compute values first.", 'CIRCLESformsDLOCUSoutMSG' ) ;
}

function CIRCLESformsDISCRETENESSLOCUScomputeCUSPupdatePLEATINGrayORBITlist( _cusp_frac, _pl_ray_orbit )
{
    CIRCLESformsDISCRETENESSLOCUSplugin_pick = $( "#CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    var _n_pts = safe_size( _pl_ray_orbit, 0 );
    var TAB_HEIGHT = $( "#CIRCLESformsDISCRETENESSLOCUS_TAB_06" ).height();
    var ENTRYbkCOLOR = [ "#F0F0F7", "#FAFAFA" ] ;
    
    var HTMLcode = "" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr><td COLSPAN=\"18\" ALIGN=\"center\">This is the orbit of "+_n_pts+" point"+( _n_pts == 1 ? "" : "s" )+" for the pleating ray departing from cusp "+_cusp_frac+"</td></tr>" ;
        if ( !CIRCLESformsDISCRETENESSLOCUSplugin_pick )
        {
            HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
            HTMLcode += "<tr><td COLSPAN=\"18\" ALIGN=\"center\" STYLE=\"color:red;\">To enable the buttons on the right, flag &lsquo;Plug-in fill by click&rsquo; in the &lsquo;Tunings&rsquo; tab and reload this list</td></tr>" ;
        }
        HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\">" ;
        if ( _n_pts > 15 ) HTMLcode += "<DIV STYLE=\"position:relative;width:100%;height:"+( TAB_HEIGHT - 90 )+"px;overflow:auto;\">" ;
        HTMLcode += "<table WIDTH=\"100%\">" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"30\">Prog</td><td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td WIDTH=\"90\" ALIGN=\"center\">Real</td><td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td WIDTH=\"90\" ALIGN=\"center\">Imag</td><td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td WIDTH=\"90\" ALIGN=\"center\">Dist from prev point</td><td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td WIDTH=\"90\" ALIGN=\"center\">Orbit behavior</td><td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td COLSPAN=\"5\" ALIGN=\"center\">Group actions</td>" ;
        HTMLcode += "<td></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    var _curr_dist_from_prev_pt, _prev_dist_from_prev_pt ;
    var _cusp_value = "" ;
        $.each( _pl_ray_orbit,
                function( _i, _complex_pt )
                {
                    if ( _i == 0 ) _cusp_value = _complex_pt.formula();
                    _curr_dist_from_prev_pt = _i == 0 ? "0" : _complex_pt.distance( _pl_ray_orbit[_i-1] );
                    HTMLcode += "<tr STYLE=\"background-color:"+ENTRYbkCOLOR[_i%safe_size(ENTRYbkCOLOR,1)]+";\">" ;
										HTMLcode += "<td WIDTH=\"30\" ALIGN=\"right\">"+( _i + 1 )+")</td><td WIDTH=\"5\"></td>" ;
										HTMLcode += "<td WIDTH=\"90\" ALIGN=\"right\">"+_complex_pt.real+"</td><td WIDTH=\"5\"></td>" ;
										HTMLcode += "<td WIDTH=\"90\" ALIGN=\"right\">"+_complex_pt.imag+"</td><td WIDTH=\"5\"></td>" ;
										HTMLcode += "<td WIDTH=\"90\" ALIGN=\"right\">"+_curr_dist_from_prev_pt+"</td><td WIDTH=\"5\"></td>" ;
										HTMLcode += "<td WIDTH=\"90\" ALIGN=\"center\">"+( _i == 0 ? "" : ( _curr_dist_from_prev_pt < _prev_dist_from_prev_pt ? "convergent" : "divergent" ) )+"</td><td WIDTH=\"5\"></td>" ;
                    HTMLcode += "<td WIDTH=\"40\" CLASS=\""+( CIRCLESformsDISCRETENESSLOCUSplugin_pick ? "link_rounded" : "link_rounded_dead" )+"\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSinitGROUP( '"+_complex_pt.formula()+"' );\">Init</td><td WIDTH=\"2\"></td>" ;
                    HTMLcode += "<td WIDTH=\"40\" CLASS=\""+( CIRCLESformsDISCRETENESSLOCUSplugin_pick ? "link_rounded" : "link_rounded_dead" )+"\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSplotCOMPLEXPT(null,3,'"+_complex_pt.formula()+"');\">Plot</td><td WIDTH=\"2\"></td>" ;
                    HTMLcode += "<td WIDTH=\"40\" CLASS=\""+( CIRCLESformsDISCRETENESSLOCUSplugin_pick ? "link_rounded" : "link_rounded_dead" )+"\" ONCLICK=\"javascript:circles_lib_items_switch_to(_glob_items_switch,YES);circles_lib_canvas_process_ask(YES,NO,_glob_bip_use?BIP_BOX:_glob_target_plane,YES,YES,CHECK);\">Render</td>" ;
										HTMLcode += "</tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
                    
                    _prev_dist_from_prev_pt = _curr_dist_from_prev_pt ;
                }
              );

        HTMLcode += "</table>" ;
        if ( _n_pts > 15 ) HTMLcode += "</DIV>" ;
        HTMLcode += "</td></tr>" ;
        HTMLcode += "<tr><td><table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSpleatingrayDRAW( '"+_cusp_value+"' );\">Plot ray</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSpleatingrayLIST(1);\">Reload list</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSpleatingrayLIST(2);\">Save list</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table></td></tr>" ;
        HTMLcode += "</table>" ;
        
    $( "#CIRCLESformsDISCRETENESSLOCUSmiscCONTAINER" ).html( HTMLcode );
}

function CIRCLESformsDISCRETENESSLOCUSlistBOUNDARYtoken( _k_index )
{
    CIRCLESformsDISCRETENESSLOCUSplugin_pick = $( "#CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    var _keys = CIRCLESformsDISCRETENESSLOCUStmp_pts_array.keys_associative(), _n_previous_elements = 0 ;
    var _pts = is_array( _keys ) ? CIRCLESformsDISCRETENESSLOCUStmp_pts_array[ "" + _keys[ _k_index ] ] : null ;
    for( var _i = 0 ; _i < _k_index ; _i++ ) _n_previous_elements += safe_size( CIRCLESformsDISCRETENESSLOCUStmp_pts_array[ "" + _keys[ _i ] ], 0 );
    if ( is_array( _pts ) )
    {
         var _n_pts = safe_size( _pts, 0 );
         if ( _n_pts > 0 )
         {
             var TAB_HEIGHT = $( "#CIRCLESformsDISCRETENESSLOCUS_TAB_06" ).height();
             var ENTRYbkCOLOR = [ "#F0F0F7", "#FAFAFA" ] ;
             var HTMLcode = "" ;
             if ( _n_pts > 15 ) HTMLcode += "<DIV STYLE=\"position:relative;width:100%;height:"+( TAB_HEIGHT - 90 )+"px;overflow:auto;\">" ;
                 HTMLcode += "<table ALIGN=\"center\" WIDTH=\"100%\">" ;
                 HTMLcode += "<tr>" ;
                 HTMLcode += "<td WIDTH=\"30\">Abs Prog</td><td WIDTH=\"5\"></td>" ;
                 HTMLcode += "<td WIDTH=\"30\">Rel Prog</td><td WIDTH=\"5\"></td>" ;
                 HTMLcode += "<td WIDTH=\"50\">Farey p/q</td><td WIDTH=\"5\"></td>" ;
                 HTMLcode += "<td WIDTH=\"90\" ALIGN=\"center\">Real</td><td WIDTH=\"5\"></td>" ;
                 HTMLcode += "<td WIDTH=\"90\" ALIGN=\"center\">Imag</td><td WIDTH=\"5\"></td>" ;
                 HTMLcode += "<td COLSPAN=\"5\" ALIGN=\"center\">Actions</td>" ;
                 HTMLcode += "<td></td>" ;
                 HTMLcode += "</tr>" ;
                 HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
             $.each( _pts,
                     function( _i, _complex_pt )
                     {
                          HTMLcode += "<tr STYLE=\"background-color:"+ENTRYbkCOLOR[_i%safe_size(ENTRYbkCOLOR,1)]+";\">" ;
                          HTMLcode += "<td>"+( _n_previous_elements + _i + 1 )+")</td><td WIDTH=\"5\"></td>" ;
                          HTMLcode += "<td>"+( _i + 1 )+")</td><td WIDTH=\"5\"></td>" ;
                          HTMLcode += "<td WIDTH=\"50\">"+( CIRCLESformsDISCRETENESSLOCUSpq_fracs_array[ _n_previous_elements + _i ].output() )+"</td><td WIDTH=\"5\"></td>" ;
                          HTMLcode += "<td WIDTH=\"90\" ALIGN=\"right\">"+_complex_pt.real+"</td><td WIDTH=\"5\"></td>" ;
                          HTMLcode += "<td WIDTH=\"90\" ALIGN=\"right\">"+_complex_pt.imag+"</td><td WIDTH=\"5\"></td>" ;
                          HTMLcode += "<td WIDTH=\"40\" CLASS=\""+( CIRCLESformsDISCRETENESSLOCUSplugin_pick ? "link_rounded" : "link_rounded_dead" )+"\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSinitGROUP( '"+_complex_pt.formula()+"' );\">Init</td><td WIDTH=\"2\"></td>" ;
                          HTMLcode += "<td WIDTH=\"40\" CLASS=\""+( CIRCLESformsDISCRETENESSLOCUSplugin_pick ? "link_rounded" : "link_rounded_dead" )+"\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSplotCOMPLEXPT(null,3,'"+_complex_pt.formula()+"');\">Plot</td><td WIDTH=\"2\"></td>" ;
                          HTMLcode += "<td WIDTH=\"40\" CLASS=\""+( CIRCLESformsDISCRETENESSLOCUSplugin_pick ? "link_rounded" : "link_rounded_dead" )+"\" ONCLICK=\"javascript:circles_lib_items_switch_to(_glob_items_switch,YES);circles_lib_canvas_process_ask(YES,NO,_glob_bip_use?BIP_BOX:_glob_target_plane,YES,YES,CHECK);\">Render</td>" ;
                          HTMLcode += "</tr>" ;
                     }
                   );
                   
                 HTMLcode += "</table>" ;
             if ( _n_pts > 15 ) HTMLcode += "</DIV>" ;
             $( "#CIRCLESformsDISCRETENESSLOCUSboundaryTOKENlist" ).html( HTMLcode );
         }
    }
    else
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Invalid input data", "CIRCLESformsDLOCUSmsgboxCONTAINER" ) ;
}

function CIRCLESformsDISCRETENESSLOCUSlistBOUNDARY()
{
    if ( CIRCLESformsDISCRETENESSLOCUStmp_pts_array.size_associative() > 0 )
    {
         CIRCLESformsDISCRETENESSLOCUSplugin_pick = $( "#CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX" ).prop( "checked" ) ? YES : NO ;
         var _keys = CIRCLESformsDISCRETENESSLOCUStmp_pts_array.keys_associative();
         var _key_len = safe_size( _keys, 0 );
         var HTMLcode = "<table ALIGN=\"center\" WIDTH=\"100%\">" ;
         HTMLcode += "<tr><td ALIGN=\"center\">List of locus points from left to right<br>Select one of the indexes below to list a subset of the whole set</td></tr>" ;
         if ( !CIRCLESformsDISCRETENESSLOCUSplugin_pick )
         {
             HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
             HTMLcode += "<tr><td COLSPAN=\"18\" ALIGN=\"center\" STYLE=\"color:red;\">To enable the buttons on the right, flag &lsquo;Plug-in fill by click&rsquo; in the &lsquo;Tunings&rsquo; tab and reload this list</td></tr>" ;
         }
         HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td ALIGN=\"center\">" ;
         HTMLcode += "<table ALIGN=\"center\">" ;
         HTMLcode += "<tr>" ;
         for( var _k = 0 ; _k < _key_len ; _k++ ) HTMLcode += "<td CLASS=\"link\" ALIGN=\"center\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSlistBOUNDARYtoken('"+_k+"');\">"+( _k+1 )+"</td><td WIDTH=\"5\"></td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "<tr><td ID=\"CIRCLESformsDISCRETENESSLOCUSboundaryTOKENlist\" VALIGN=\"top\"></td></tr>" ;
         HTMLcode += "</table>" ;
            
         $( "#CIRCLESformsDISCRETENESSLOCUSmiscCONTAINER" ).html( HTMLcode );
         $( "#CIRCLESformsDISCRETENESSLOCUSmainDIV" ).get(0).tabber.tabShow(5);
         $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).hide();
         $( "#CIRCLESdlocusworklayerCANVAS" ).hide();
    }
    else
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Missing discreteness locus values: please, compute one embedding first.", "CIRCLESformsDLOCUSmsgboxCONTAINER" ) ;
}