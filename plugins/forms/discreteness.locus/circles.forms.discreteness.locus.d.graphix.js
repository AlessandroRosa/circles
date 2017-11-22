function CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( _options_array, _silent )
{
    if( !is_array( _options_array ) ) _options_array = [] ;
    _silent = safe_int( _silent, NO );
    var _pleating_rays_flag = $( "#CIRCLESformsDISCRETENESSLOCUSpleatingraysCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    var _canvas_id = _glob_target_plane == BIP_BOX ? "CIRCLESbipCANVAS" : "CIRCLESdlocusdiagramCANVAS" ;
    var _out_canvas = $( "#" + _canvas_id ).get(0);
    var _canvas_sm = _glob_target_plane == BIP_BOX ? bipbox_sm.copy() : dlocus_sm.copy() ;
    var _diagram_canvas = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0);
    if ( _glob_target_plane.is_not_one_of( D_LOCUS, BIP_BOX ) ) _glob_target_plane = D_LOCUS ;

		if ( is_html_canvas( _out_canvas ) && is_html_canvas( _diagram_canvas ) )
    {
        var _canvas_w = safe_int( _out_canvas.get_width(), 0 ), _canvas_h = safe_int( _out_canvas.get_height(), 0 );
        if ( _canvas_w > 0 && _canvas_h > 0 )
        {
				    if ( _glob_target_plane == BIP_BOX )
				    {
						    _glob_bipLEFT = _glob_dlocusLEFT ;
						    _glob_bipTOP = _glob_dlocusTOP ;
						    _glob_bipRIGHT = _glob_dlocusRIGHT ;
						    _glob_bipBOTTOM = _glob_dlocusBOTTOM ;
							  circles_lib_bip_mapper_init();
						}
						else if ( _glob_target_plane == D_LOCUS ) circles_lib_dlocus_mapper_init();

				    if ( _glob_target_plane.is_one_of( D_LOCUS, BIP_BOX ) )
				    {
								CIRCLESformsDISCRETENESSLOCUSinitZOOMproc( NO ) ;
								CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX_CLICK( NO ) ;
		            // in canvas logical coords
		            CIRCLESformsDISCRETENESSLOCUSrect = new rect( 0, 0, _canvas_w, _canvas_h );
		            CIRCLESformsDISCRETENESSLOCUStmpVARS['aspectratio'] = CIRCLESformsDISCRETENESSLOCUSrect.get_aspect_ratio() ;
		            _canvas_sm.set_client_rect( CIRCLESformsDISCRETENESSLOCUSrect );
		            _canvas_sm.set_display_rect( CIRCLESformsDISCRETENESSLOCUSrect );
		            _options_array = _options_array.unique();
								$.each( _options_array, function( _i, _option )
		                    {
	                    		_option = safe_int( _option, 0 );
	                        if ( _option == 1 ) circles_lib_grid_draw( _out_canvas, _canvas_sm, D_LOCUS, YES, $( "#CIRCLESformsDISCRETENESSLOCUSticks" ).val(), OUTPUT_SCREEN );
	                        if ( _option == 2 ) { circles_lib_dlocus_mapper_init( _canvas_w, _canvas_h, YES ); _canvas_sm = dlocus_sm.copy() ; }
	                        if ( _option == 4 ) CIRCLESformsDISCRETENESSLOCUScomputeBOUNDARY( _out_canvas, CIRCLESformsDISCRETENESSLOCUSrect );
	                        if ( _option == 8 ) circles_lib_canvas_clean( _out_canvas, "white" );
	                        if ( _option == 16 && _pleating_rays_flag ) CIRCLESformsDISCRETENESSLOCUSplotRAYS();
	                        if ( _option == 32 ) CIRCLESformsDISCRETENESSLOCUSselectionlistDRAW();
	                        if ( _option == 64 ) CIRCLESformsDISCRETENESSLOCUSdrawBOUNDARY( _out_canvas, YES, _silent );
	                        if ( _option == 128 ) CIRCLESformsDISCRETENESSLOCUSviewportcoordsFIT();
		                    } );
						}
						
						if ( _glob_target_plane == BIP_BOX ) bipbox_sm = dlocus_sm.copy();
						
						if ( !_glob_target_plane.is_one_of( Z_PLANE, W_PLANE, D_LOCUS ) )
						{
				        var _canvas_w = safe_int( _diagram_canvas.get_width(), 0 ), _canvas_h = safe_int( _diagram_canvas.get_height(), 0 );
								_diagram_canvas.clean( "#EAEAEA" );
								var _target_plane_def = circles_lib_plane_def_get( _glob_target_plane ) ;
								var _textcolor = COLOR_DISABLED, _metrics ;
								var _font_size = Math.floor( _canvas_h / 16 ) ;
								var _font_style = _font_size + "px Arial" ;
								var _shift_x = 0, _shift_y = 0, _ctx = _diagram_canvas.getContext( HTML_CANVAS_ELEMENT_2D_MODE ) ;
								var TEXT = "Rendering of the discreteness locus\nwill be directed to the " + _target_plane_def ;
								var _row_height = _font_size * 1.5 ;
								var X = 0, Y = ( _ctx.get_height() - TEXT.count( "\n" ) * _row_height ) / 2.0 ;
								TEXT = TEXT.replaceAll( [ CRLF_WIN, CRLF_NO_WIN ], _glob_crlf ).split( _glob_crlf );
								$.each( TEXT, function( _i, _tok )
												{
														circles_lib_draw_text( _ctx, null, 0, Y, _tok, _textcolor, _font_style, _shift_x, _shift_y, NO, _glob_opacity, 0, "center" ) ;
														Y += Math.ceil( _row_height ) ;			
												} ) ;
						}
        }
    }
}

function CIRCLESformsDISCRETENESSLOCUSzoom( _zoom_direction )
{
    CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX_CLICK( NO );
    _zoom_direction = safe_int( _zoom_direction, 1 );
    // minimal square size for zooming in or out
    var _dz = Math.min( Math.abs( _glob_dlocusRIGHT - _glob_dlocusLEFT ), Math.abs( _glob_dlocusTOP - _glob_dlocusBOTTOM ) ) / 55 ;
    var _rect = dlocus_sm.get_coords_rect();
    if ( _zoom_direction == 1 ) _rect = _rect.implode( _dz, _dz );
    else if ( _zoom_direction == -1 ) _rect = _rect.explode( _dz, _dz );

    _glob_dlocusLEFT = _rect.get_left();
    _glob_dlocusTOP = _rect.get_bottom();
    _glob_dlocusRIGHT = _rect.get_right();
    _glob_dlocusBOTTOM = _rect.get_top();

		$( "#CIRCLESformsDISCRETENESSLOCUSfixregionCHECKBOX" ).prop( "checked", true );
    dlocus_sm.set_coords_rect( _rect );
    CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( [ 8, 1, 64, 16, 32 ] );
}

function CIRCLESformsDISCRETENESSLOCUSmoveCOORDS( _op )
{
    CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX_CLICK( NO );
    _op = safe_int( _op, 0 );
    var _rect = dlocus_sm.get_coords_rect();
    var _w = _rect.width(), _h = _rect.height();
    var _shift_x = _w / 20, _shift_y = _h / 20.0 ;
    switch( _op )
    {
        case 1: // top
        _rect = _rect.move( 0, _shift_y );
        break ;
        case -1: // bottom
        _rect = _rect.move( 0, -_shift_y );
        break ;
        case 2: // right
        _rect = _rect.move( _shift_x, 0 );
        break ;
        case -2: // left
        _rect = _rect.move( -_shift_x, 0 );
        break ;
        default: break ;
    }

    _glob_dlocusLEFT = _rect.get_left();
    _glob_dlocusTOP = _rect.get_bottom();
    _glob_dlocusRIGHT = _rect.get_right();
    _glob_dlocusBOTTOM = _rect.get_top();

    $( "#CIRCLESformsDISCRETENESSLOCUSfixregionCHECKBOX" ).prop( "checked", true );
    dlocus_sm.set_coords_rect( _rect );
    CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( [8, 1, 64, 16, 32] );
}

function CIRCLESformsDISCRETENESSLOCUScalcVIEWPORTextremals()
{
    var _keys = CIRCLESformsDISCRETENESSLOCUStmp_pts_array.keys_associative();
    var _keys_len = safe_size( _keys, 0 ), _pts;
    if ( _keys_len == 0 ) return [ RET_ERROR, [] ] ;

    var _left_end_pt = null, _right_end_pt = null ;
    var _top_end_pt = null, _bottom_end_pt = null ;
    var _left = null, _right = null, _top = null, _bottom = null ;
    // compute region boundaries
    for( var _k = 0 ; _k < _keys_len ; _k++ )
    {
       _pts = CIRCLESformsDISCRETENESSLOCUStmp_pts_array[ "" + _keys[ _k ] ] ;
       if ( is_array( _pts ) )
       {
          $.each( _pts,
                  function( _i, _pt )
                  {
                      if ( _left == null || _pt.real < _left )
                      {
                          _left_end_pt = _pt ;
                          _left = _pt.real ;
                      }
          
                      if ( _right == null || _pt.real > _right )
                      {
                          _right_end_pt = _pt ;
                          _right = _pt.real ;
                      }
          
                      if ( _top == null || _pt.imag > _top )
                      {
                          _top_end_pt = _pt ;
                          _top = _pt.imag ;
                      }
          
                      if ( _bottom == null || _pt.imag < _bottom )
                      {
                          _bottom_end_pt = _pt ;
                          _bottom = _pt.imag ;
                      }
                  }
                );
        }
    }

		_left = safe_float( _left, 0 ) ;		_top = safe_float( _top, 0 ) ;    
		_right = safe_float( _right, 0 ) ;  _bottom = safe_float( _bottom, 0 ) ;    
    return [ RET_OK, [ _left, _top, _right, _bottom ] ] ;
}

function CIRCLESformsDISCRETENESSLOCUSviewportcoordsFIT()
{
    CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array.flush();
    var _ret_chunk = CIRCLESformsDISCRETENESSLOCUScalcVIEWPORTextremals();
    var _ret_id = _ret_chunk[0], _ret_coords = _ret_chunk[1] ;
    if ( _ret_id == RET_OK )
    {
		    var _left = _ret_coords[0], _top = _ret_coords[1], _right = _ret_coords[2], _bottom = _ret_coords[3] ;
		    var _dz = Math.max( _right - _left, _top - _bottom ) / 50 ;
		    _glob_dlocusLEFT = _left - _dz ;
		    _glob_dlocusTOP = _top + _dz ;
		    _glob_dlocusRIGHT = _right + _dz ;
		    _glob_dlocusBOTTOM = _bottom - _dz ;
		
		    CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_left'] = _glob_dlocusLEFT ;
		    CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_top'] = _glob_dlocusTOP ;
		    CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_right'] = _glob_dlocusRIGHT ;
		    CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE['discreteness_locus_bottom'] = _glob_dlocusBOTTOM ;
		
		    $( "#CIRCLESformsDISCRETENESSLOCUSboundaryCOORDSleft" ).html( _glob_dlocusLEFT );
		    $( "#CIRCLESformsDISCRETENESSLOCUSboundaryCOORDStop" ).html( _glob_dlocusTOP );
		    $( "#CIRCLESformsDISCRETENESSLOCUSboundaryCOORDSright" ).html( _glob_dlocusRIGHT );
		    $( "#CIRCLESformsDISCRETENESSLOCUSboundaryCOORDSbottom" ).html( _glob_dlocusBOTTOM );
		}
}

function CIRCLESformsDISCRETENESSLOCUSdrawBOUNDARY( _canvas, _remap_pts, _silent )
{
    _remap_pts = safe_int( _remap_pts, YES ), _silent = safe_int( _silent, NO );
    var _canvas_sm = dlocus_sm.copy() ;
    if ( _remap_pts )
    {
       CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array.flush();
       if ( CIRCLESformsDISCRETENESSLOCUStmp_pts_array.size_associative() > 0 )
       {
           var _pts = null, _keys = CIRCLESformsDISCRETENESSLOCUStmp_pts_array.keys_associative();
           for( var _k = 0 ; _k < _keys.length ; _k++ )
           {
              _pts = CIRCLESformsDISCRETENESSLOCUStmp_pts_array[ "" + _keys[ _k ] ] ;
              if ( is_array( _pts ) )
							$.each( _pts, function( _i, _complex ) { CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array.push( _canvas_sm.from_cartesian_to_client( _complex.real, _complex.imag ) ); } );
           }
       }
    }
    
    if ( safe_size( CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array, 0 ) > 0 )
    {
		    var _context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
				circles_lib_draw_polyline( _context, _canvas_sm, CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array,
                             _glob_default_discreteness_locus_clr, "", 1, NO, DEFAULT_MAX_OPACITY, UNDET, 0, NO );
				var _display_arrows = $( "#CIRCLESformsDISCRETENESSLOCUSarrowsCHECKBOX" ).prop( "checked" );
        var _display_fracs = $( "#CIRCLESformsDISCRETENESSLOCUSdisplayfracsCHECKBOX" ).prop( "checked" ) ? YES : NO ;
        var _draw_arrow_mod = _display_arrows ? $( "#CIRCLESformsDISCRETENESSLOCUSarrowstepsEDIT" ).val() : 0 ;
        var _display_fracs_mod = _display_fracs ? $( "#CIRCLESformsDISCRETENESSLOCUSdisplayfracstepsEDIT" ).val() : 0 ;
        _draw_arrow_mod = Math.abs( safe_int( _draw_arrow_mod, 0 ) );
        _display_fracs_mod = Math.abs( safe_int( _display_fracs_mod, 0 ) );
     		var _pts_array = CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array ;
        if ( _draw_arrow_mod > 0 )
        {
        		$( "#CIRCLESformsDISCRETENESSLOCUSarrowstepsEDIT" ).val( _draw_arrow_mod );
        		var _arrow_head_size = $( "#CIRCLESformsDISCRETENESSLOCUSarrowheadsizeEDIT" ).val();
        				_arrow_head_size = Math.max( 1, _arrow_head_size );
        				$( "#CIRCLESformsDISCRETENESSLOCUSarrowheadsizeEDIT" ).val( _arrow_head_size );
            var _arrow_color = $( "#CIRCLESformsDISCRETENESSLOCUSarrowcolor" ).css( "background-color" );
            var _arrow_linewidth = $( "#CIRCLESformsDISCRETENESSLOCUSarrowlinewidth" ).val();
        				_arrow_linewidth = Math.max( 1, _arrow_linewidth );
            var _draw_shaft = $( "#CIRCLESformsDISCRETENESSLOCUSarrowsdrawshaftCHECKBOX" ).prop( "checked" ) ? YES : NO ;
				}

        if ( _display_arrows || _display_fracs )
        {
        		var _fontstyle = DEFAULT_FONT_SIZE + " " + DEFAULT_FONT_FAMILY ;
            // CIRCLESformsDISCRETENESSLOCUSpq_fracs_array
						$.each( _pts_array,
		                function( _i, _screen_pt )
		                {
	                     if ( _display_arrows && ( _i % _draw_arrow_mod == 0 ) && _i > 0 )
	                     {
													 circles_lib_draw_arrow( _context,
													 									 _pts_array[_i-1].x, _pts_array[_i-1].y,
																						 _screen_pt.x, _screen_pt.y,
																						 _arrow_head_size, _arrow_linewidth, _arrow_color, _draw_shaft );
											 }
												 
											 if ( _display_fracs && ( _i % _display_fracs_mod == 0 ) && _i > 0 )
											 {
										 			 circles_lib_draw_text( _context, null, _screen_pt.x, _screen_pt.y,
													 								  CIRCLESformsDISCRETENESSLOCUSpq_fracs_array[_i].output( "std", "/" ),
																						DEFAULT_COLOR_STD, _fontstyle,
																						( ( _context.canvas.get_width() - _screen_pt.x ) < 6 ) ? -10 : ( _screen_pt.x < 6 ? 2 : 0 ),
																						( ( _context.canvas.get_height() - _screen_pt.y ) < 6 ) ? -10 : ( _screen_pt.y < 6 ? 10 : 0 ),
																						NO, 1.0, 0 );
											 }
		                }
		              );
				}

        _canvas.getContext( _glob_canvas_ctx_2D_mode ).complex_rect = new rect( _glob_dlocusLEFT, _glob_dlocusTOP, _glob_dlocusRIGHT, _glob_dlocusBOTTOM, _RECT_ORIENTATION_CARTESIAN );
    }
    else if ( !_silent )
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "The slice needs to be rendered first", "CIRCLESformsDLOCUSoutMSG" ) ;
}

function CIRCLESformsDISCRETENESSLOCUSplotCOMPLEXPT( _canvas, _src_index )
{
		if ( !is_html_canvas( _canvas ) ) _canvas = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0) ;
    _src_index = safe_int( _src_index, 1 );
    var _complex_pt_str = "", _complex_pt = null ;
    if ( _src_index == 1 )
    {
        _complex_pt_str = $( "#CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT" ).val();
        _complex_pt = parse_complex_from_string( _complex_pt_str );
    }
    else if ( _src_index == 2 )
    {
        _complex_pt_str = $( "#CIRCLESformsDISCRETENESSLOCUScuspVALUE" ).val();
        _complex_pt = parse_complex_from_string( _complex_pt_str );
    }
    else if ( _src_index == 3 )
    {
        _complex_pt = parse_complex_from_string( _complex_pt_str );
        _complex_pt_str = _complex_pt.formula();
    }

    if ( is_complex( _complex_pt ) )
    {
        $( "#CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT" ).css( "background-color", "white" );
        circles_lib_draw_point( _canvas.getContext( _glob_canvas_ctx_2D_mode ),
													dlocus_sm, _complex_pt.real, _complex_pt.imag,
                          YES, _glob_pt_border_color, YES, DEFAULT_PT_INTERIOR_COLOR,
                          DEFAULT_PT_BORDER, DEFAULT_PT_RADIUS,
                          _glob_opacity, 0 );
    }
    else $( "#CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT" ).css( "background-color", DEFAULT_COLOR_ERROR );
}

function CIRCLESformsDISCRETENESSLOCUSrecastdataRAYS()
{
    $.each( CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array,
						function( _i, _ray_chunk )
						{
								$.each( _ray_chunk, function( _i, _ray_pt ) { _ray_chunk[_i] = new point( _ray_chunk[_i].real, _ray_chunk[_i].imag ); } );
                CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array[_i] = _ray_chunk.clone();
						}
					);
}

function CIRCLESformsDISCRETENESSLOCUSplotRAYS()
{
    var _canvas_id = _glob_target_plane == BIP_BOX ? "CIRCLESbipCANVAS" : "CIRCLESdlocusdiagramCANVAS" ;
    var _canvas_sm = dlocus_sm.copy() ;
    var _canvas = $( "#" + _canvas_id ).get(0);
    var _context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
    var _spectrum = CIRCLESformsDISCRETENESSLOCUSspectrumARRAY ;
    var _spectrum_len = _spectrum.length ;
    var _n_rays = CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array.length ;
    var _coloring = $("#CIRCLESformsDISCRETENESSLOCUScoloringCHECKBOX").prop("checked")?1:0, _clr ;
		$.each( CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array, function( _i, _ray_chunk )
            {
              _clr = _coloring ? _spectrum[ Math.floor( _i / _n_rays * _spectrum_len ) ] : _glob_default_pleating_ray_clr ;
              circles_lib_draw_polyline( _context, _canvas_sm, _ray_chunk, _clr, "", 1, NO, DEFAULT_MAX_OPACITY, UNDET, 0, YES );
            }
					);
}

function CIRCLESformsDISCRETENESSLOCUSpleatingrayDRAW( _cusp_value )
{
    _cusp_value = safe_string( _cusp_value, "" );
    _cusp_value = _cusp_value.length > 0 ? _cusp_value : safe_string( $( "#CIRCLESformsDISCRETENESSLOCUScuspVALUE" ).val(), "" );
    _cusp_value = _cusp_value.length > 0 ? parse_complex_from_string( _cusp_value ) : null ;
    var _chunk_selection = $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).val();
    var _init_mode = _chunk_selection.includes( "@" ) ? safe_int( ( _chunk_selection.split( "@" ) )[0], _DLOCUS_NONE ) : _DLOCUS_NONE ;
    if ( _init_mode == DISCRETENESS_LOCUS_NONE ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Missing slice specification", "CIRCLESformsDLOCUSoutMSG" ) ;
    else if ( is_complex( _cusp_value ) )
    {
         var _tmp_discreteness_locus = new discreteness_locus();
             _tmp_discreteness_locus.set_init_mode( _init_mode );
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
    
         var _pl_ray_orbit = _tmp_discreteness_locus.pleating_positive_ray( _pq_farey, _cusp_value, _eq_solution,
                                                                _pl_rays_max_steps, _bounding_rect, null,
                                                                _pl_rays_keepgoing, _pl_rays_correction );
         if ( safe_size( _pl_ray_orbit, 0 ) > 0 )
         {
            var _canvas_id = _glob_target_plane == BIP_BOX ? "CIRCLESbipCANVAS" : "CIRCLESdlocusdiagramCANVAS" ;
            var _canvas_sm = dlocus_sm.copy() ;
            var _canvas = $( "#" + _canvas_id ).get(0);
		        var _context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
		        _pl_ray_orbit = _pl_ray_orbit.work( function( _pt ){ return new point( _pt.real, _pt.imag ); } );
						circles_lib_draw_polyline( _context, _canvas_sm, _pl_ray_orbit,
		                             _glob_default_pleating_ray_clr, "", 1, NO, DEFAULT_MAX_OPACITY, UNDET, 0, YES );

            _glob_current_tab['dlocus'] = 0 ;
            $( "#CIRCLESformsDISCRETENESSLOCUSmainDIV" ).get(0).tabber.tabShow(0);
            CIRCLESformsDISCRETENESSLOCUSdispatcher( POPUP_DISPATCHER_UNICAST_EVENT_FOCUS ) ;
         }
         else
				 circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Returning invalid data output while computing the pleating ray", "CIRCLESformsDLOCUSoutMSG" ) ;
    }
    else
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Missing or invalid input cusp value. Please, compute it first.", "CIRCLESformsDLOCUSoutMSG" ) ;
}