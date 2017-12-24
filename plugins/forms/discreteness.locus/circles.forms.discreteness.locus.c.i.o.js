function CIRCLESformsDISCRETENESSLOCUSsaveCONFIG()
{
    var _out_stream = [] ;
        _out_stream.push( "// Circles - Discreteness locus tuning options"  );
        _out_stream.push( "// data saved on " + today_date() + " - " + current_time() );
        
    var _embedding_chunk = $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).val();
    		if ( _embedding_chunk.includes( "@" ) && _embedding_chunk.count( "@" ) == 1 )
    		{
						_embedding_chunk = _embedding_chunk.split( "@" );
						_embedding_chunk[1] = $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).text();
				}
				else
				{
						_embedding_chunk = [ _embedding_chunk ] ;
						_embedding_chunk.push( $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).text() );
				}
				
		_out_stream.push( "embedding=" + _embedding_chunk.join( "@" ) );

		_out_stream.push( "fareyorder=" + $( "#CIRCLESformsDISCRETENESSLOCUSorder" ).val() );
		_out_stream.push( "fareystart=" + $( "#CIRCLESformsDISCRETENESSLOCUSstartFRAC" ).val() );
		_out_stream.push( "fareyend=" + $( "#CIRCLESformsDISCRETENESSLOCUSendFRAC" ).val() );
    
    _out_stream.push( "locusleft=" + _glob_dlocusLEFT );
    _out_stream.push( "locustop=" + _glob_dlocusTOP );
    _out_stream.push( "locusright=" + _glob_dlocusRIGHT );
    _out_stream.push( "locusbottom=" + _glob_dlocusBOTTOM );

    _out_stream.push( "ticks=" + safe_int( $( "#CIRCLESformsDISCRETENESSLOCUSticks" ).val(), 16 ) );
    _out_stream.push( "displayfracs=" + ( $( "#CIRCLESformsDISCRETENESSLOCUSdisplayfracsCHECKBOX" ).prop( "checked" ) ? "1" : "0" ) );
    _out_stream.push( "displayfracsteps=" + $( "#CIRCLESformsDISCRETENESSLOCUSdisplayfracstepsEDIT" ).val() );
    _out_stream.push( "showarrows=" + ( $( "#CIRCLESformsDISCRETENESSLOCUSarrowsCHECKBOX" ).prop( "checked" ) ? "1" : "0" ) );
    _out_stream.push( "arrowheadsize=" + $( "#CIRCLESformsDISCRETENESSLOCUSarrowheadsizeEDIT" ).val() );
    _out_stream.push( "arrowbordersize=" + $( "#CIRCLESformsDISCRETENESSLOCUSarrowbordersize" ).val() );
    _out_stream.push( "arrowdrawshaft=" + ( $( "#CIRCLESformsDISCRETENESSLOCUSarrowsdrawshaftCHECKBOX" ).prop( "checked" ) ? "1" : "0" ) );
    _out_stream.push( "arrowcolor=" + CIRCLESformsDISCRETENESSLOCUSarrow_color );
    
    _out_stream.push( "pleatingraysdisplay=" + ( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysCHECKBOX" ).prop( "checked" ) ? "1" : "0" ) );
    _out_stream.push( "pleatingraysdisplaypositive=" + ( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayspositiveCHECKBOX" ).prop( "checked" ) ? "1" : "0" ) );
    _out_stream.push( "pleatingraysdisplaynegative=" + ( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysnegativeCHECKBOX" ).prop( "checked" ) ? "1" : "0" ) );
    _out_stream.push( "pleatingrayscorrection=" + ( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayscorrectionCHECKBOX" ).prop( "checked" ) ? "1" : "0" ) );
    _out_stream.push( "pleatingrayskeepgoing=" + ( $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayskeepgoingCHECKBOX" ).prop( "checked" ) ? "1" : "0" ) );
    _out_stream.push( "pleatingraysmaxsteps=" + $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITmaxsteps" ).val() );
    _out_stream.push( "pleatingrayssteprate=" + $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITsteprate" ).val() );
    _out_stream.push( "pleatingraysaccuracy=" + $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITaccuracy" ).val() );
    _out_stream.push( "pleatingraysforwardfactor=" + $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITforwardfactor" ).val() );
    _out_stream.push( "pleatingraysbackwardfactor=" + $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITbackwardfactor" ).val() );
    
    _out_stream.push( "tracestart=" + $( "#CIRCLESformsDISCRETENESSLOCUStraceSTART" ).val() );
    _out_stream.push( "tracea=" + $( "#CIRCLESformsDISCRETENESSLOCUStraceA" ).val() );
    _out_stream.push( "traceb=" + $( "#CIRCLESformsDISCRETENESSLOCUStraceB" ).val() );
    _out_stream.push( "tracecommutator=" + $( "#CIRCLESformsDISCRETENESSLOCUStraceCOMMUTATOR" ).val() );
    _out_stream.push( "traceequationsolution=" + $( "#CIRCLESformsDISCRETENESSLOCUSeqSOLUTION" ).val() );
    
    _out_stream.push( "accuracy=" + $( "#CIRCLESformsDISCRETENESSLOCUSaccuracy" ).val() );
    _out_stream.push( "maxstep=" + $( "#CIRCLESformsDISCRETENESSLOCUSmaxstep" ).val() );

    _out_stream = _out_stream.work( function( _row ) { return _row + _glob_crlf } );
    var blob = new Blob( _out_stream, { type: 'plain/text', endings: 'native' });
    saveAs( blob, "circles.discreteness.locus.tunings.txt" );
}

function CIRCLESformsDISCRETENESSLOCUSloadCONFIG( _filename, _file_contents )
{
    var _tokens, _label, _value ;
    var _file_rows = _file_contents.replaceAll( [ CRLF_WIN, CRLF_NOWIN ], _glob_crlf ).split( _glob_crlf );
        // remove blank entries
        _file_rows = _file_rows.work( function( _entry ) { return ( _entry + "" ).trim().replaceAll( _glob_crlf, "" ); } );
        _file_rows = _file_rows.filtering( function( _entry ) { return ( _entry + "" ).trim().length > 0 ; } ).reset_index();
    var _start_index = 0, _rows_len = safe_size( _file_rows, 0 );
        
    for( var _i = 0 ; _i < _rows_len ; _i++ )
    {
    	 if ( _file_rows[_i].start_with( "/" ) ) continue ;
       else if ( _file_rows[_i].includes( "=" ) && _file_rows[_i].count( "=" ) == 1 )
       {
           _tokens = _file_rows[_i].split( "=" );
           _label = _tokens[0].toLowerCase(), _value = _tokens[1] ;
					 switch( _label )
					 {
							case "embedding":
							_value = _value.split( "@" ) ;
							_value = _value[1] ;
							$('#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option').filter(function() { return ( $(this).text() == _value ); }).prop('selected', true);
							break ;
							case "fareyorder": $( "#CIRCLESformsDISCRETENESSLOCUSorder" ).val( _value ) ; break ;
							case "fareystart": $( "#CIRCLESformsDISCRETENESSLOCUSstartFRAC" ).val( _value ) ; break ;
							case "fareyend": $( "#CIRCLESformsDISCRETENESSLOCUSendFRAC" ).val( _value ) ; break ;

							case "locusleft": $( "#CIRCLESformsDISCRETENESSLOCUSregionCOORDSleft" ).html( _value ) ; break ;
							case "locustop": $( "#CIRCLESformsDISCRETENESSLOCUSregionCOORDStop" ).html( _value ) ; break ;
							case "locusright": $( "#CIRCLESformsDISCRETENESSLOCUSregionCOORDSright" ).html( _value ) ; break ;
							case "locusbottom": $( "#CIRCLESformsDISCRETENESSLOCUSregionCOORDSbottom" ).html( _value ) ; break ;

              case "ticks": $( "#CIRCLESformsDISCRETENESSLOCUSticks" ).val( _value ); break ;
              case "displayfracs": $( "#CIRCLESformsDISCRETENESSLOCUSdisplayfracsCHECKBOX" ).prop( "checked", safe_int( _value, 0 ) ? true : false ); break ;
              case "displayfracsteps": $( "#CIRCLESformsDISCRETENESSLOCUSdisplayfracstepsEDIT" ).val( _value ); break ;
              case "showarrows": $( "#CIRCLESformsDISCRETENESSLOCUSarrowsCHECKBOX" ).prop( "checked", safe_int( _value, 0 ) ? true : false ); break ;
              case "arrowheadsize": $( "#CIRCLESformsDISCRETENESSLOCUSarrowheadsizeEDIT" ).val( _value ); break ;
              case "arrowbordersize": $( "#CIRCLESformsDISCRETENESSLOCUSarrowbordersize" ).val( _value ); break ;
              case "arrowdrawshaft": $( "#CIRCLESformsDISCRETENESSLOCUSarrowsdrawshaftCHECKBOX" ).prop( "checked", safe_int( _value, 0 ) ? true : false ); break ;
              case "arrowcolor":
                  $( "#CIRCLESformsDISCRETENESSLOCUSarrowcolor" ).css( "background-color", _value );
                  CIRCLESformsDISCRETENESSLOCUSarrow_color = _value ;
              break ;
                  
              case "pleatingraysdisplay": $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysCHECKBOX" ).prop( "checked", safe_int( _value, 0 ) ? true : false ); break ;
              case "pleatingraysdisplaypositive": $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayspositiveCHECKBOX" ).prop( "checked", safe_int( _value, 0 ) ? true : false ); break ;
              case "pleatingraysdisplaynegative": $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysnegativeCHECKBOX" ).prop( "checked", safe_int( _value, 0 ) ? true : false ); break ;
              case "pleatingrayscorrection": $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayscorrectionCHECKBOX" ).prop( "checked", safe_int( _value, 0 ) ? true : false ); break ;
              case "pleatingrayskeepgoing": $( "#CIRCLESformsDISCRETENESSLOCUSpleatingrayskeepgoingCHECKBOX" ).prop( "checked", safe_int( _value, 0 ) ? true : false ); break ;
              case "pleatingraysmaxsteps": $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITmaxsteps" ).val( _value ); break ;
              case "pleatingrayssteprate": $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITsteprate" ).val( _value ); break ;
              case "pleatingraysaccuracy": $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITaccuracy" ).val( _value ); break ;
              case "pleatingraysforwardfactor": $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITforwardfactor" ).val( _value ); break ;
              case "pleatingraysbackwardfactor": $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITbackwardfactor" ).val( _value ); break ;
                  
              case "tracestart": $( "#CIRCLESformsDISCRETENESSLOCUStraceSTART" ).val( _value ); break ;
              case "tracea": $( "#CIRCLESformsDISCRETENESSLOCUStraceA" ).val( _value ); break ;
              case "traceb": $( "#CIRCLESformsDISCRETENESSLOCUStraceB" ).val( _value ); break ;
              case "tracecommutator": $( "#CIRCLESformsDISCRETENESSLOCUStraceCOMMUTATOR" ).val( _value ); break ;
              case "traceequationsolution": $( "#CIRCLESformsDISCRETENESSLOCUSeqSOLUTION" ).val( _value ); break ;
                  
              case "accuracy": $( "#CIRCLESformsDISCRETENESSLOCUSaccuracy" ).val( _value ); break ;
              case "maxstep": $( "#CIRCLESformsDISCRETENESSLOCUSmaxstep" ).val( _value ); break ;
              default: break ;
					 }
			 }
    }
}

function CIRCLESformsDISCRETENESSLOCUSsaveEPSmaskGET()
{
    var _save_mask = 0 ;
    if ( $( "#CIRCLESformsDISCRETENESSLOCUSepsCHECKBOX01" ).prop( "checked" ) ) _save_mask |= 1 ;
    if ( $( "#CIRCLESformsDISCRETENESSLOCUSepsCHECKBOX02" ).prop( "checked" ) ) _save_mask |= 2 ;
    if ( $( "#CIRCLESformsDISCRETENESSLOCUSepsCHECKBOX03" ).prop( "checked" ) ) _save_mask |= 4 ;
    return _save_mask ;
}

function CIRCLESformsDISCRETENESSLOCUSsaveEPSask()
{
    var MSG  = "<table>" ;
        MSG += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        MSG += "<tr><td COLSPAN=\"3\">You're going to save the following contents into an EPS file.</td></tr>" ;
        MSG += "<tr><td COLSPAN=\"3\">Please select the ones you want</td></tr>" ;
        MSG += "<tr><td HEIGHT=\"15\"></td></tr>" ;
        if ( safe_size( CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array ) > 0 )
        {
            MSG += "<tr><td WIDTH=\"20\"><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSepsCHECKBOX01\" CHECKED></td><td WIDTH=\"5\"></td><td>Discreteness locus</td></tr>" ;
            MSG += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        }

        if ( safe_size( CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array ) > 0 )
        {
            MSG += "<tr><td WIDTH=\"20\"><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSepsCHECKBOX02\" CHECKED></td><td WIDTH=\"5\"></td><td>Pleating rays</td></tr>" ;
            MSG += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        }

        if ( safe_size( CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array ) > 0 )
        {
            MSG += "<tr><td WIDTH=\"20\"><INPUT TYPE=\"checkbox\" ID=\"CIRCLESformsDISCRETENESSLOCUSepsCHECKBOX03\" CHECKED></td><td WIDTH=\"5\"></td><td>Selected points</td></tr>" ;
            MSG += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        }

        MSG += "<tr><td HEIGHT=\"20\"></td></tr>" ;
        MSG += "<tr><td COLSPAN=\"3\">Proceed ?</td></tr>" ;
        MSG += "</table>" ;
    
    alert_plug_label( ALERT_YES, "Yes" );
    alert_plug_label( ALERT_NO, "No" );
    alert_plug_fn( ALERT_YES, "var _eps_save_mask = CIRCLESformsDISCRETENESSLOCUSsaveEPSmaskGET();alertCLOSE();CIRCLESformsDISCRETENESSLOCUSsaveEPS( _eps_save_mask );" );
    alert_plug_fn( ALERT_NO, "alertCLOSE();" );
    alert_set_btns_width( "70px" );
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_QUESTION | DISPATCH_YESNO, MSG, _glob_app_title );
}

function CIRCLESformsDISCRETENESSLOCUSsaveEPS( _save_mask )
{
    _save_mask = safe_int( _save_mask, 0 );
    if ( _save_mask == 0 )
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Fail to save the EPS file: no contents have been selected", "CIRCLESformsDLOCUSoutMSG" ) ;
    else
    {
       var _canvas_id = _glob_target_plane == BIP_BOX ? "CIRCLESbipCANVAS" : "CIRCLESdlocusdiagramCANVAS" ;
       var _canvas_sm = _glob_target_plane == BIP_BOX ? bipbox_sm.copy() : dlocus_sm.copy() ;
       var _canvas = $( "#" + _canvas_id ).get(0);
			 var _discreteness_locus_def = $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).text();
			 var _pts_array = CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array ;

			 var _canvas_w = is_html_canvas( _canvas ) ? _canvas.get_width() : 0 ;
			 var _canvas_h = is_html_canvas( _canvas ) ? _canvas.get_height() : 0 ;
	     _glob_js_e_ps_obj.init( _glob_e_ps_language_level, YES, "", 0, 0,
			 												 _canvas_w, _canvas_h, "Exporting "+_discreteness_locus_def+" embedding", YES );
			 _glob_js_e_ps_obj.comment( "Exporting "+_discreteness_locus_def+" slice" );

     	 if ( safe_size( CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array ) > 0 && ( _save_mask & 1 ) )
     	 {
    			 $.each( CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array,
     			         function( _i, _pt )
     			         {
     							 		 if ( _i > 0 )
     							 		 {
     												_glob_js_e_ps_obj.line( CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array[_i-1].x,
     														  									CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array[_i-1].y,
     																								_pt.x, _pt.y, 1, _glob_default_discreteness_locus_clr, "", "", "" );
     									 }
     							 }
     			 			 );
     	 }
      
			 if ( safe_size( CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array ) > 0 && ( _save_mask & 2 ) )
			 {
			 		 var _tmp_chunk ;
					 _glob_js_e_ps_obj.comment( "Exporting the pleating rays" );
				    $.each( CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array,
										function( _i, _ray_chunk )
										{
												_tmp_chunk = _ray_chunk.clone().work( function( _pt )
																															{
																														    _pt = dlocus_sm.from_cartesian_to_client( _pt.x, _pt.y ).trunc();
																															  return [ _pt.x, _pt.y ] ;
																															} );
								  		  _glob_js_e_ps_obj.broken_line( _tmp_chunk, 1, NO, _glob_default_pleating_ray_clr, "", "", "" );
										}
									);
			 }

			 if ( safe_size( CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array, 0 ) > 0 && ( _save_mask & 4 ) )
			 {
					 _glob_js_e_ps_obj.comment( "Exporting the recorded points" );
					 $.each( CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array, function( _i, _pt ) { if ( _i > 0 ) _glob_js_e_ps_obj.point( _pt.x, _pt.y, _POINT_2D_CLS_EUCLIDEAN_ENV, DEFAULT_PT_BORDER, _glob_pt_border_color, DEFAULT_PT_INTERIOR_COLOR, "" ); } );
			 }

			 _glob_js_e_ps_obj.close();
			 circles_lib_canvas_save_to_e_ps( "discreteness.locus."+_discreteness_locus_def.replaceAll( [ " ", "," ], "" ).toLowerCase()+".png", YES, OUTPUT_SCREEN );
    }
}

function CIRCLESformsDISCRETENESSLOCUSsaveLATEX( _save_mask )
{
    _save_mask = safe_int( _save_mask, 0 );
    if ( _save_mask == 0 )
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Fail to save the LATEX file: no contents have been selected.", "CIRCLESformsDLOCUSoutMSG" ) ;
    else
    {
			 var _discreteness_locus_def = $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).text();
			 var _pts_array = CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array ;
       var _canvas_id = _glob_target_plane == BIP_BOX ? "CIRCLESbipCANVAS" : "CIRCLESdlocusdiagramCANVAS" ;
       var _canvas_sm = _glob_target_plane == BIP_BOX ? bipbox_sm.copy() : dlocus_sm.copy() ;
       var _canvas = $( "#" + _canvas_id ).get(0);

			 var _canvas_w = is_html_canvas( _canvas ) ? _canvas.get_width() : 0 ;
			 var _canvas_h = is_html_canvas( _canvas ) ? _canvas.get_height() : 0 ;
	     _glob_js_latex_obj.init( _canvas_w, _canvas_h, _glob_latex_options, YES, YES, "Exporting "+_discreteness_locus_def+" embedding" );
			 _glob_js_latex_obj.comment( "Exporting "+_discreteness_locus_def+" slice" );

   		 if ( safe_size( CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array ) > 0 && ( _save_mask & 1 ) )
   		 {
   				 $.each( CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array,
   				         function( _i, _pt )
   				         {
   								 		 if ( _i > 0 )
 													_glob_js_latex_obj.line( CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array[_i-1].x,
 															  									 CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array[_i-1].y,
 																									 _pt.x, _pt.y, _glob_default_discreteness_locus_clr );
   								 }
   				 			 );
   		 }

			 if ( safe_size( CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array ) > 0 && ( _save_mask & 2 ) )
			 {
			 		 var _tmp_chunk ;
					 _glob_js_latex_obj.comment( "Exporting the pleating rays" );
				   $.each( CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array,
									 function( _i, _ray_chunk )
									 {
											_tmp_chunk = _ray_chunk.clone().work( function( _pt )
																														{
																													    _pt = dlocus_sm.from_cartesian_to_client( _pt.x, _pt.y ).trunc();
																														  return [ _pt.x, _pt.y ] ;
																														} );
							  		  _glob_js_latex_obj.broken_line( _tmp_chunk, _glob_default_pleating_ray_clr );
									 }
								 );
			 }

			 if ( safe_size( CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array, 0 ) > 0 && ( _save_mask & 4 ) )
			 {
					 _glob_js_latex_obj.comment( "Exporting the recorded points" );
					 $.each( CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array, function( _i, _pt ) { if ( _i > 0 ) _glob_js_latex_obj.point( _pt.x, _pt.y, _POINT_2D_CLS_EUCLIDEAN_ENV, DEFAULT_PT_BORDER, YES, DEFAULT_PT_INTERIOR_COLOR ); } );
			 }

			 _glob_js_latex_obj.close();
			 circles_lib_canvas_save_to_latex( "discreteness.locus."+_discreteness_locus_def.replaceAll( [ " ", "," ], "" ).toLowerCase()+".png", YES, OUTPUT_SCREEN );
    }
}

function CIRCLESformsDISCRETENESSLOCUSsaveCOORDS( _csv )
{
		_csv = safe_int( _csv, NO );
    if ( safe_size( CIRCLESformsDISCRETENESSLOCUSpq_fracs_array ) > 0 )
    {
        var _text = [] ;
        var _embedding = $( '#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected' ).text();
        if ( _embedding.length > 0 ) _text.push( "Embedding : " + _embedding );
        _text.push( "Interval : from " + CIRCLESformsDISCRETENESSLOCUSpq_fracs_array[0].output() + " to " + CIRCLESformsDISCRETENESSLOCUSpq_fracs_array.get_last().output() )

        $.each( CIRCLESformsDISCRETENESSLOCUScomplex_pts_array,
                function( _i, _chunk )
                {
                    if ( _csv ) _text.push( CIRCLESformsDISCRETENESSLOCUSpq_fracs_array[_i].output() + ";" + CIRCLESformsDISCRETENESSLOCUScomplex_pts_array[_i].formula() );
										else _text.push( "[" + CIRCLESformsDISCRETENESSLOCUSpq_fracs_array[_i].output() + ":" + CIRCLESformsDISCRETENESSLOCUScomplex_pts_array[_i].formula() + "]" );
                }
              );
    
    		var _extension = _csv ? "csv" : "txt" ;
        var _filename = ( _embedding.length > 0 ? _embedding + "." : "" ) + "discreteness.locus." + _extension ;
        var _basename = basename( _filename );
      	var _extension = _filename.includes( "." ) ? _filename.split( ".").get_last() : "" ;
      		  _filename = _glob_title.length > 0 ? ( _glob_title + "." + _basename + "." +  _extension ) : "circles." + _filename ;
        var blob = new Blob( [ _text.join( _glob_crlf ) ], { type: 'plain/text', endings: 'native' });
        saveAs( blob, _filename.replaceAll( " ", "" ) );
    }
    else
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Fail to save the coords file: no discreteness locus has been process yet.", "CIRCLESformsDLOCUSoutMSG" ) ;
}