function circles_lib_fixedpoints_draw( index, _canvas, _silent, _out_channel )
{
    index = safe_int( index, UNDET ), _silent = safe_int( _silent, YES );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var ITEM = _glob_seeds_array[index] ;
    var _b_exists = is_item_obj( ITEM );
    var complex_circle = _b_exists ? ITEM.complex_circle : null ;
    var PARAMSinputTYPEmask = _b_exists ? ITEM.params_mask : 0 ;
    var color = ( _b_exists && is_circle( complex_circle ) ) ? ITEM.complex_circle.fillcolor : "" ;
    var symbol = _b_exists ? ITEM.symbol : "" ;
    var inverse_symbol = _b_exists ? ITEM.inverse_symbol : "" ;
    var _fp_array = _b_exists ? ITEM.map.fixed_points() : [] ;
    var _n_limitset = safe_size( _fp_array, 0 ) ;
    var null_map_flag = _b_exists ? ( is_mobius_map( ITEM.map ) ? NO : YES ) : YES ;

    if ( !is_html_canvas( _canvas ) )
    {
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "No canvas available", _glob_app_title );
       return [ RET_ERROR, _msg ] ;
    }
    else if ( _n_limitset > 0 )
    {
       var _context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
       var _fp1 = _n_limitset > 0 ? _fp_array[0] : null, _fp1_type = "" ;
       if ( is_complex( _fp1 ) )
       {
           if ( ITEM.map.is_sink_pt( _fp1 ) ) _fp1_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SINK );
           else if ( ITEM.map.is_source_pt( _fp1 ) ) _fp1_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SOURCE ) ;
           else _fp1_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_NEUTRAL );
       }
       else _fp1_type = "Undetermined" ;

       var _fp2 = _n_limitset > 1 ? _fp_array[1] : null, _fp2_type = "" ;
       if ( is_complex( _fp2 ) )
       {
           if ( ITEM.map.is_sink_pt( _fp2 ) ) _fp2_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SINK );
           else if ( ITEM.map.is_source_pt( _fp2 ) ) _fp2_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SOURCE ) ;
           else _fp2_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_NEUTRAL );
       }
       else _fp2_type = "Undetermined" ;

       if ( is_complex( _fp1 ) )
       {
          _fp1 = new point( _fp1.real, _fp1.imag );
          var screen_center_pt = zplane_sm.from_cartesian_to_client( _fp1.x, _fp1.y );
          circles_lib_draw_point( _context, zplane_sm, _fp1.x, _fp1.y, YES, DEFAULT_PT_BORDER_COLOR, YES, DEFAULT_PT_INTERIOR_COLOR, _glob_pt_border, _glob_pt_radius );
          _context.font = DEFAULT_FONT_SIZE + " " + DEFAULT_FONT_FAMILY;
          _context.fillStyle = DEFAULT_PT_BORDER_COLOR ;
          _context.fillText( _fp1_type, screen_center_pt.x - 10, screen_center_pt.y - 12 );
       }

       if ( is_complex( _fp2 ) )
       {
          _fp2 = new point( _fp2.real, _fp2.imag );
          var screen_center_pt = zplane_sm.from_cartesian_to_client( _fp2.x, _fp2.y );
          circles_lib_draw_point( _context, zplane_sm, _fp2.x, _fp2.y, YES, DEFAULT_PT_BORDER_COLOR, YES, DEFAULT_PT_INTERIOR_COLOR, _glob_pt_border, _glob_pt_radius );
          _context.font = DEFAULT_FONT_SIZE + " " + DEFAULT_FONT_FAMILY;
          _context.fillStyle = DEFAULT_PT_BORDER_COLOR ;
          _context.fillText( _fp2_type, screen_center_pt.x - 10, screen_center_pt.y - 12 );
       }
           
       var _msg = "Fixed points have been marked with success" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ] ;
    }
    else
    {
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "No fixed points found for the selected Mobius map", _glob_app_title );
       return [ RET_ERROR, "No fixed points found for the selected Mobius map" ] ;
    }
}

function circles_lib_fixedpoints_is_duplicate( _pt, _out_channel )
{
     _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
     var _fp_n = circles_lib_count_fixed_points();
     if ( _fp_n == 0 ) return NO ;
     else
     {
         var _ret = NO ;
         for( var _i = 0 ; _i < _fp_n ; _i++ )
         {
            if ( _pt.is_equal_to( _glob_input_fixed_pts_array[_i][1] ) )
            {
               _ret = YES ;
               break ;
            }
         }

         return _ret ;
     }
}

function circles_lib_fixedpoints_add( _opcode = 0, _entity = "", _pt_coords = null, _list_row_index = UNDET, _limit_to = UNDET, _out_channel = OUTPUT_SCREEN, _reset = 0 )
{
    _opcode = safe_float( _opcode, 0 ), _entity = safe_string( _entity, "" );
    _limit_to = safe_int( _limit_to, UNDET ), _list_row_index = safe_float( _list_row_index, UNDET );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    if ( !is_point( _pt_coords ) ) _pt_coords = null ;
    var _sd_n = circles_lib_count_seeds();

    var _is_complex = _entity.testME( _glob_complex_number_regex_pattern );
    var _is_repetend = circles_lib_repetends_check_syntax( null, _entity );
    var _is_pqword = _entity.testME( _glob_pqword_regex_pattern );
    var _is_word = circles_lib_word_check( _entity, _glob_alphabet );
    
    if ( _opcode == 0 ) return [ RET_WARNING, "Missing operation code" ] ;
    else if ( _entity.length >= 0 && _pt_coords != null ) // matching pair consisting of one word (possibly, empty) and a point
    {
       var _complex_obj = new complex( _pt_coords.x, _pt_coords.y );
       if ( !circles_lib_fixedpoints_is_duplicate( _pt_coords ) )
       {
          if ( _entity.length == 0 ) _entity = _complex_obj.formula();
		  if ( _reset ) _glob_input_fixed_pts_array.flush();
          if ( _opcode == 1 )
          _glob_input_fixed_pts_array.push( [ _entity, _pt_coords, FIXEDPOINT_USERDEFINED, "HASH"+_glob_input_fixed_pts_array.length ] );
          else if ( _opcode == 2 && _glob_input_fixed_pts_array[ _list_row_index ] != null )
          _glob_input_fixed_pts_array[ _list_row_index ] = [ _entity, new point( _complex_obj.real, _complex_obj.imag ), FIXEDPOINT_USERDEFINED, "HASH"+_list_row_index ] ;
          return [ RET_OK, "Pair '"+_entity+"' | "+_complex_obj.formula()+" added with success" ];
       }
       else return [ RET_WARNING, "Duplicate input pair '"+_entity+"' | "+_complex_obj.formula()+" found" ];
    }
    else if ( _is_complex )
    {
       var _complex_num_data = _pt_coords != null ? _pt_coords.x+(_pt_coords.y > 0 ? "+" : "")+_pt_coords.y+"i" : circles_lib_math_parse_formula( _entity );
       if ( _complex_num_data == null ) return [ RET_WARNING, "Input data '"+_entity+"' is not congruent to complex numbers syntax" ];
       else
       {
          var _complex_obj = parse_complex_from_string( _complex_num_data + "" );
          if ( !circles_lib_fixedpoints_is_duplicate( new point( _complex_obj.real, _complex_obj.imag ) ) )
          {
			 if ( _reset ) _glob_input_fixed_pts_array.flush();
             if ( _opcode == 1 )
             _glob_input_fixed_pts_array.push( [ _entity, new point( _complex_obj.real, _complex_obj.imag ), FIXEDPOINT_USERDEFINED, "HASH"+_glob_input_fixed_pts_array.length ] );
             else if ( _opcode == 2 && _glob_input_fixed_pts_array[ _list_row_index ] != null )
             _glob_input_fixed_pts_array[ _list_row_index ] = [ _entity, new point( _complex_obj.real, _complex_obj.imag ), FIXEDPOINT_USERDEFINED, "HASH"+_list_row_index ] ;
             return [ RET_OK, "Fixed point '"+_entity+"' added with success" ];
          }
          else return [ RET_WARNING, "Duplicate input data '"+_entity+"' found" ];
       }
    }
    else if ( _sd_n == 0 ) return [ RET_ERROR, "Missing registered Mobius seed map: error while elaborating the input entity '"+_entity+"'" ] ;
    else if ( _sd_n > 0 && ( _is_word || _is_pqword || _is_repetend ) )
    {
	   var _solved_word, _symbols_index_array, _passed_1 ;
       if ( _is_pqword ) _solved_word = circles_lib_word_pq_translate( ( _entity.split( "/" ) )[0], ( _entity.split( "/" ) )[1] );
       else if ( _is_repetend ) _solved_word = circles_lib_repetends_resolve( _entity );
       else _solved_word = _entity ;

       _symbols_index_array = circles_lib_symbol_get_indexes_mapping_array( null,  NO, _out_channel );
       _passed_1 = circles_lib_word_check( _solved_word, _glob_alphabet );

       if ( !_passed_1 ) return [ RET_WARNING, "The input '"+_entity+"' does not match the current alphabet '"+_glob_alphabet.join(", ")+"'" ] ;
       else
       {
          var _index, _mm, _duplicate_found = 0, _pts_formula = []; _new_n = 0, _updated_n = 0 ;
          _mm = circles_lib_word_mobiusmap_get( _solved_word, _glob_seeds_array, _out_channel );
          if ( is_mobius_map( _mm ) )
          {
			if ( _reset ) _glob_input_fixed_pts_array.flush();
			var _fp_array = _mm.fixed_points(), _b_add_fp2 = NO ;
			if ( safe_size( _fp_array, 0 ) == 2 )
			{
				_b_add_fp2 = _fp_array[0].distance( _fp_array[1] ) < _glob_method_fp_dist_tolerance ? NO : YES ;
				if ( !_b_add_fp2 )
				{
					var _msg = "The distance between the returning fixed points is shorter than tolerance ("+_glob_method_fp_dist_tolerance+"),\n" ;
					_msg += "so they will be merged into one." ;
					circles_lib_output( _out_channel, DISPATCH_WARNING, _msg, "", "" );
				}
			}

			_fp_array.forEach( function( _f_pt ){
				 if ( is_complex( _f_pt ) )
				 {
					 var _type = FIXEDPOINT_NONE ;
					 if ( _mm.is_sink_pt( _f_pt ) ) _type = FIXEDPOINT_SINK ;
					 else if ( _mm.is_source_pt( _f_pt ) ) _type = FIXEDPOINT_SOURCE ;
					 else _type = FIXEDPOINT_NEUTRAL ;

					 if ( !circles_lib_fixedpoints_is_duplicate( new point( _f_pt.real, _f_pt.imag ) ) )
					 {
						if ( _opcode.is_one_of( 1, 3 ) )
						{
						   _glob_input_fixed_pts_array.push( [ _entity, new point( _f_pt.real, _f_pt.imag ), _type, "HASH"+_glob_input_fixed_pts_array.length ] );
						   _new_n++ ;
						}
						else if ( _opcode == 2 && _glob_input_fixed_pts_array[ _list_row_index ] != null )
						{
						   _glob_input_fixed_pts_array[ _list_row_index ] = [ _entity, new point( _f_pt.real, _f_pt.imag ), _type, "HASH"+_list_row_index ] ;
						   _updated_n++ ;
						}
					 }
					 else _duplicate_found++ ;

					_pts_formula.push( "- " + _f_pt.formula() );
				 }
			} );

             if ( _duplicate_found > 0 ) return [ RET_WARNING, "Found " + _duplicate_found + " duplicate" + ( _duplicate_found == 1 ? "" : "s" ) + " and not inserted:" + _glob_crlf.repeat(2) + _pts_formula.join( _glob_crlf ) ] ;
             else
                console.log( "ADD#1" );
				var _entries_n = safe_int( _fp_array.length, 0 );
                var _ret_id = _entries_n > 0 ? RET_OK : RET_WARNING;
                var _ret_msg = "" ;
				if ( _ret_id == RET_OK )
				{
					_ret_msg = _entries_n + " fixed point" + ( _entries_n == 1 ? " has" : "s have" ) + " been " ;
					_ret_msg += ( _opcode.is_one_of( 1, 3 ) ? "inserted" : "updated" ) + " with success" ;
					_ret_msg += _glob_crlf.repeat(2) + _pts_formula.join( _glob_crlf ) ;
                    
					if ( _is_word ) _ret_msg += _glob_crlf+"from word '"+_entity+"'" ;
                    else if ( _is_pqword ) _ret_msg += _glob_crlf+"from P/Q word '"+_entity+"'" ;
                    else if ( _is_repetend ) _ret_msg += _glob_crlf+"from repetend '"+_entity+"'" ;
				}
				else _ret_msg = "No fixed points to " + ( _opcode.is_one_of( 1, 3 ) ? "insert" : "update" ) ;
                return [ _entries_n > 0 ? RET_OK : RET_ERROR, _ret_msg ] ;
             }
          }
    }
    else return [ RET_ERROR, "Invalid input entity '"+_entity+"'" ] ;
}

function circles_lib_fixedpoints_create_figures_from( _index, _plane_type, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _index = safe_int( _index, UNDET ) ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _fp_n = circles_lib_count_fixed_points();
    if ( _fp_n == 0 ) return [ RET_WARNING, "The fixed points list is empty" ];
    else if ( !_plane_type.is_one_of( Z_PLANE, W_PLANE ) ) return [ RET_WARNING, "Missing input plane reference" ];
    else
    {
         var _b_fail = NO, _rec_chunk, _chunk, _entries = [];
         for( var _i = 0 ; _i < _fp_n ; _i++ )
         {
             if ( _index == UNDET || _index == _i )
             {
                 _chunk = _glob_input_fixed_pts_array[_i] ;
                 if ( !is_point( _chunk ) )
                 {
                     _b_fail = YES ;
                     return [ RET_WARNING, "Conversion has been halted: invalid object reference at entry #"+(_i+1) ];
                     break ;
                 }
                 else
                 {
                     _rec_chunk = [];
                     _rec_chunk['class'] = FIGURE_CLASS_POINT ;
                     _rec_chunk['obj'] = _chunk[1] ;
                     _rec_chunk['plane'] = _plane_type ;
                     _rec_chunk['border'] = YES ;
                     _rec_chunk['bordercolor'] = _glob_draw_seed_color ;
                     _rec_chunk['fill'] = YES ;
                     _rec_chunk['fillcolor'] = _glob_fill_seed_color ;
                     _rec_chunk['opacity'] = DEFAULT_MAX_OPACITY ;
                     _rec_chunk['bordersize'] = 1 ;
                     _rec_chunk['enabled'] = YES ;
                     _rec_chunk['label'] = _chunk[0] ;
                     _rec_chunk['myhash'] = "rec" + _glob_figures_array.length ;
                     _glob_figures_array.push( _rec_chunk );
                     _entries.push( _i + 1 );
                 }
             }
         }
         var _n_e = safe_size( _entries, 0 );
         if ( !_b_fail ) return [ RET_OK, "Conversion of "+_n_e+" entr"+( _n_e == 1 ? "y "+( _entries.join( "," ) ) : "ies" )+" has been completed with success" ];
    }
}

function circles_lib_fixedpoints_connect( _plane_type, _clean, _showtext, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ), _clean = safe_int( _clean, YES );
    _showtext = safe_int( _showtext, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _fp_n = circles_lib_count_fixed_points();
    if ( _fp_n == 0 ) return [ RET_WARNING, "The fixed points list is empty" ];
    else if ( !_plane_type.is_one_of( Z_PLANE, W_PLANE ) ) return [ RET_WARNING, "Missing plane reference" ];
    else
    {
          var _b_fail = NO, POINTSarray = [], _context, _sm, _chunk, _pt, _word ;
          var _canvas = circles_lib_canvas_get_exists( _plane_type, "fixedpoints" ) ? circles_lib_canvas_get_target( _plane_type, "fixedpoints" ) : ( _plane_type == Z_PLANE ? _glob_zplane_freedraw_layer_placeholder : _glob_wplane_freedraw_layer_placeholder );
          var _fontsize = Math.min( 12, Math.max( 5, safe_int( _canvas.get_width() / 12, 10 ) ) );
          var _shift_x_canvas = 5, _shift_y_canvas = 5 ;
          var _fontstyle = _fontsize + + "pt " + DEFAULT_FONT_FAMILY ;

          if ( _clean )
          {
              if ( _plane_type == Z_PLANE ) circles_lib_canvas_clean( _glob_zplane_freedraw_layer_placeholder, "transparent" );
              if ( _plane_type == W_PLANE ) circles_lib_canvas_clean( _glob_wplane_freedraw_layer_placeholder, "transparent" );
          }

          for( var _x = 0 ; _x < _fp_n ; _x++ )
          {
               _chunk = _glob_input_fixed_pts_array[_x] ;
               _word = _chunk == null ? null : _chunk[0] ;
               _pt = _chunk == null ? null : _chunk[1] ;
               if ( _pt == null )
               {
                   _b_fail = YES ;
                   return [ RET_WARNING,"Fixed points connection has been aborted: missing point coords at archive entry #"+( _i+1 ) ];
                   break ;
               }
               else
               {
                   if ( _plane_type == Z_PLANE )
                   {
                       _context = _glob_zplane_freedraw_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode );
                       _sm = zplane_sm ;
                   }
                   else if ( _plane_type == W_PLANE )
                   {
                       _context = _glob_wplane_freedraw_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode );
                       _sm = wplane_sm ;
                   }

                   if ( _showtext )
                   circles_lib_draw_text( _context, _sm, _pt.x, _pt.y, _word, _glob_default_text_clr, _fontstyle,
                                    _shift_x_canvas, _shift_y_canvas, YES, DEFAULT_MAX_OPACITY, 0 );
                   POINTSarray.push( _pt );
               }
          }

          if ( safe_size( POINTSarray, 0 ) > 0 )
          {
               if ( _plane_type == Z_PLANE )
               {
                    _context = _glob_zplane_freedraw_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode );
                    circles_lib_draw_polyline( _context, zplane_sm, POINTSarray, DEFAULT_FREEDRAW_COLOR, "transparent", 1, YES, DEFAULT_MAX_OPACITY, UNDET, 0, YES );
               }
               else if ( _plane_type == W_PLANE )
               {
                    _context = _glob_wplane_freedraw_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode );
                    circles_lib_draw_polyline( _context, wplane_sm, POINTSarray, DEFAULT_FREEDRAW_COLOR, "transparent", 1, YES, DEFAULT_MAX_OPACITY, UNDET, 0, YES );
               }
          }

        return [ RET_OK, "Fixed points connected on the " + circles_lib_plane_def_get( _plane_type ) ];
    }
}

function circles_lib_fixedpoints_locate( _i, _plane_type, _clean, _showtext, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _i = safe_int( _i, UNDET ), _clean = safe_int( _clean, YES );
    _showtext = safe_int( _showtext, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _fp_n = circles_lib_count_fixed_points(), _fp_coords = [] ;
    if ( _fp_n == 0 ) return [ RET_WARNING, "The fixed points list is empty" ];
    else if ( !_plane_type.is_one_of( Z_PLANE, W_PLANE ) ) return [ RET_WARNING, "Missing plane reference" ];
    else
    {
          if ( _plane_type == Z_PLANE && _clean ) circles_lib_canvas_clean( _glob_wplane_freedraw_layer_placeholder, "transparent" );
          if ( _plane_type == W_PLANE && _clean ) circles_lib_canvas_clean( _glob_zplane_freedraw_layer_placeholder, "transparent" );
          var chunk, _pt, _context, _shift_x_canvas = 5, _shift_y_canvas = 5, _word ;
          var _canvas = circles_lib_canvas_get_exists( _plane_type, "fixedpoints" ) ? circles_lib_canvas_get_target( _plane_type, "fixedpoints" ) : ( _plane_type == Z_PLANE ? _glob_zplane_freedraw_layer_placeholder : _glob_wplane_freedraw_layer_placeholder );
          var _fontsize = Math.min( 12, Math.max( 5, safe_int( _canvas.get_width() / 12, 10 ) ) );
          var _check_fp ;

          for( var _x = 0 ; _x < _fp_n ; _x++ )
          {
              if ( _x == _i || _i == UNDET )
              {
                  _chunk = _glob_input_fixed_pts_array[_x], _check_fp = _chunk == null ;
                  _word = _check_fp ? null : _chunk[0], _pt = _check_fp ? null : _chunk[1] ;
                  if ( !is_point( _pt ) )
                  {
                      return [ RET_WARNING, "Missing point coords" + ( _i == UNDET ? "at entry #"+( _i+1 ) : "" ) ];
                      break ;
                  }
                  else
                  {
                      _fp_coords.push( _pt );
                      if ( _plane_type == Z_PLANE )
                      {
                          _context = _glob_zplane_freedraw_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode );
                          circles_lib_draw_point( _context, zplane_sm, _pt.x, _pt.y,
                                            YES, _glob_draw_seed_color, YES, _glob_fill_seed_color,
                                            _glob_pt_border, _glob_pt_radius, DEFAULT_MAX_OPACITY, 0 );
                          if ( _showtext )
                          circles_lib_draw_text( _context, zplane_sm, _pt.x, _pt.y, _word,
                                           _glob_default_text_clr, _fontsize + + "pt " + DEFAULT_FONT_FAMILY,
                                           _shift_x_canvas, _shift_y_canvas,
                                           YES, DEFAULT_MAX_OPACITY, 0 );
                      }
                      else if ( _plane_type == W_PLANE )
                      {
                          _context = _glob_wplane_freedraw_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode );
                          circles_lib_draw_point( _context, wplane_sm, _pt.x, _pt.y,
                                            YES, _glob_draw_seed_color, YES, _glob_fill_seed_color,
                                            _glob_pt_border, _glob_pt_radius, DEFAULT_MAX_OPACITY, 0 );
                          if ( _showtext )
                          circles_lib_draw_text( _context, wplane_sm, _pt.x, _pt.y, _word,
                                           _glob_default_text_clr, _fontsize + + "pt " + DEFAULT_FONT_FAMILY,
                                           _shift_x_canvas, _shift_y_canvas,
                                           YES, DEFAULT_MAX_OPACITY, 0 );
                      }
                  }
              }
          }
          
        return [ RET_OK, "Fixed point #"+_i+" localized on the " + circles_lib_plane_def_get( _plane_type ), _fp_coords.clone() ];
    }
}

function circles_lib_fixedpoints_add_from_seeds( _out_channel = OUTPUT_SCREEN, _reset = 0 )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN ), _reset = safe_int( _reset, 0 );
    var _sd_n = circles_lib_count_seeds(), fp_n = circles_lib_count_fixed_points();
    if ( _sd_n == 0 ) return [ RET_WARNING, "The fixed points list is empty" ];
    else
    {
       if ( _reset ) _glob_input_fixed_pts_array.flush();
       for( var _z = 0 ; _z < _sd_n ; _z++ ) circles_lib_fixedpoints_add( 1, _glob_seeds_array[_z].symbol, null, _z );
       var _n_fp = circles_lib_count_fixed_points();
       if ( _n_fp == 0 ) return [ RET_WARNING, "No fixed points have been pulled out from seeds" ];
       else return [ RET_OK, "New "+_n_fp+" fixed point"+(_n_fp!=1?"s have":" has")+" been pulled out from seeds" ];
    }
}

function circles_lib_fixedpoints_add_from_gens_set( _out_channel = OUTPUT_SCREEN, _reset = 0 )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN ), _reset = safe_int( _reset, 0 );
    var _gg_n = circles_lib_gens_count();
    if ( _gg_n == 0 ) return [ RET_WARNING, "The generators set is empty" ];
    else
    {
       if ( _reset ) _glob_input_fixed_pts_array.flush();
       for( var _z = 0 ; _z < _gg_n ; _z++ ) circles_lib_fixedpoints_add( 1, _glob_gens_model_array[_z], null, _z, YES );
       var _n_fp = circles_lib_count_fixed_points();
       if ( _n_fp == 0 ) return [ RET_WARNING, "No fixed points have been pulled out from the generators set" ];
       else return [ RET_OK, "New "+_n_fp+" fixed point"+(_n_fp!=1?"s have":" has")+" been pulled out from the generators set" ];
    }
}

function circles_lib_fixedpoints_add_from_commutators( _keep_up_n_items = 0, _out_channel = OUTPUT_SCREEN, _reset = 0 )
{
	_keep_up_n_items = Math.max( 0, safe_int( _keep_up_n_items, 0 ) );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN ), _reset = safe_int( _reset, 0 );
    var _sd_n = circles_lib_count_seeds();
    if ( _sd_n == 0 ) return [ RET_WARNING, "Fail to retrieve the commutators list: missing gens" ];
    else if ( safe_size( _glob_alphabet, 0 ) == 0 ) return [ RET_WARNING, "Fail to retrieve the commutators list: no alphabet available" ];
    else
    {
       if ( _reset ) _glob_input_fixed_pts_array.flush();
       var _alphabet = circles_lib_alphabet_get();
       var _small_letters = circles_lib_alphabet_get_small_symbols();
       var _caps_letters = circles_lib_alphabet_get_cap_symbols();
       var _commutator = _small_letters.join( "" ) + _caps_letters.join( "" );
       var _how_many = _keep_up_n_items == 0 ? 1 : _keep_up_n_items ;

       for( var _l = 0 ; _l < _how_many ; _l++ )
       {
          circles_lib_fixedpoints_add( 1, _commutator, null, _l, 1 );
          _commutator = _commutator.slide_forward();
       }
          
       var _n_fp = circles_lib_count_fixed_points();
       if ( _n_fp == 0 ) return [ RET_WARNING, "No fixed points have been pulled out commutators" ];
       else return [ RET_OK, _n_fp+" fixed point"+(_n_fp!=1?"s have":" has")+" been pulled out from commutators" ];
    }
}

function circles_lib_fixedpoints_bomb( _out_channel = OUTPUT_SCREEN )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _fp_n = circles_lib_count_fixed_points();
    if ( _fp_n == 0 ) return [ RET_WARNING, "The input fixed points list is already empty" ];
    else
    {
       _glob_input_fixed_pts_array.flush();
       if ( circles_lib_count_fixed_points() == 0 ) return [ RET_OK, "The input fixed points list is empty" ];
       else return [ RET_WARNING, "Bombing has failed" ];
    }
}

function circles_lib_fixedpoints_find( _hash, _out_channel )
{
    var _fp_n = circles_lib_count_fixed_points();
    if ( _fp_n == 0 ) return [ RET_WARNING, "Fail to find: the list of input fixed points is already empty" ];
    else
    {
        var _ret_index = UNDET, _chunk_hash ;
        $.each( _glob_input_fixed_pts_array, function( _i, _chunk ) {
                if ( _chunk != null )
                {
                    _chunk_hash = _chunk[3] ;
                    if ( _hash.strcmp( _chunk_hash ) )
                    {
                        _ret_index = _i ;
                        return false ;
                    }
                } } );
        return [ RET_OK, _ret_index ] ;
    }
}

function circles_lib_fixedpoints_delete( _index = UNDET, _out_channel = OUTPUT_SCREEEN )
{
    _index = safe_int( _index, UNDET ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _fp_n = circles_lib_count_fixed_points();
    if ( _fp_n == 0 ) return [ RET_WARNING, "Fail to delete: the list of input fixed points is already empty" ];
    else if ( _index < 0 ) return [ RET_WARNING, "Fail to delete: invalid entry index" ] ;
    else if ( _glob_input_fixed_pts_array[_index] != null )
    {
        var _word = _glob_input_fixed_pts_array[_index][0] ;
        var _old_n = circles_lib_count_fixed_points();
        _glob_input_fixed_pts_array.remove( _index, _index );
        var _new_n = circles_lib_count_fixed_points();
        if ( _new_n != _old_n - 1 ) return [ RET_WARNING, "Problems while trying to delete entry at index #"+(_index+1)+"" ];
        else return [ RET_OK, "The input point, indexed at '"+(_index+1)+"' and associated to word '"+_word+"', has been deleted with success" ];
    }
    else return [ RET_WARNING, "Missing element to delete at index #"+(_index+1)+"" ];
}