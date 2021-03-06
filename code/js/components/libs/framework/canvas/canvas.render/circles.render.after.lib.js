function circles_lib_canvas_after_render_main()
{
     _glob_last_pt = _glob_density_scan_flag ? CIRCLESmultithreadingDENSITYscanner(_glob_wplane_rendering_layer_pointer,_glob_density_weight_coeff) : _glob_rec_canvas_entities_array.get_last() ;
     // _glob_last_pt is returned as an object, not as a complex number
     _glob_last_pt = ( _glob_last_pt != null && _glob_last_pt.x != null ) ? new complex( _glob_last_pt.x, _glob_last_pt.y ) : null ;
     if ( _glob_scheduled_rendering_flag )
     {
         var _DIV_W = 120, _DIV_H = 115, _next_rendering_time = new Date() ;
         var _time = current_time().split( ":" );
         var _hh = safe_int( _time[0], 0 ) ; if ( _hh < 10 ) _hh = "0" + _hh ;
         var _mm = safe_int( _time[1], 0 ) ; if ( _mm < 10 ) _mm = "0" + _mm ;
         var _ss = safe_int( _time[2], 0 ) ; if ( _ss < 10 ) _ss = "0" + _ss ;
         _next_rendering_time.setHours( _hh );
         _next_rendering_time.setMinutes( _mm );
         _next_rendering_time.setSeconds( _ss );
         _next_rendering_time.setMinutes( _next_rendering_time.getMinutes() + _glob_scheduled_rendering_interval ) ;
         _hh = _next_rendering_time.getHours() ;	  if ( _hh < 10 ) _hh = "0" + _hh ;
         _mm = _next_rendering_time.getMinutes() ;	if ( _mm < 10 ) _mm = "0" + _mm ;
         _ss = _next_rendering_time.getSeconds() ;	if ( _ss < 10 ) _ss = "0" + _ss ;
         _next_rendering_time = _hh + ":" + _mm + ":" + _ss;
         var HTMLcode = "<table WIDTH=\""+_DIV_W+"\">" ;
         HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
         HTMLcode += "<tr><td ALIGN=\"center\" VALIGN=\"middle\"><IMG CLASS=\"label\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','general.options',YES,1);\" TITLE=\"Scheduled Rendering is on\" SRC=\""+_glob_path_to_img+"icons/clock/clock.48x48.png\"></td></tr>" ;
         HTMLcode += "<tr><td STYLE=\"font-size:7pt;\" ALIGN=\"center\">Last run on "+current_time()+"</td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
         HTMLcode += "<tr><td STYLE=\"font-size:7pt;\" ALIGN=\"center\">Next render scheduled at</td></tr>" ;
         HTMLcode += "<tr><td STYLE=\"font-size:7pt;\" ALIGN=\"center\">"+_next_rendering_time+" ("+_glob_scheduled_rendering_interval+" minute"+(_glob_scheduled_rendering_interval==1?"":"s")+")</td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
         HTMLcode += "<tr><td CLASS=\"link\" STYLE=\"color:#EA3800;\" ALIGN=\"center\" ONCLICK=\"javascript:if(confirm('Stop the timer ?')){clearTimeout(_glob_scheduled_rendering_timer);_glob_custom_div.style.display='none';}\">Stop the timer</td></tr>" ;
         HTMLcode += "</table>" ;

         _glob_custom_div.style.left = ( getViewportExtents()[0] - ( _DIV_W + 10 ) ) + "px" ;
         _glob_custom_div.style.top = ( getViewportExtents()[1] - ( _DIV_W + 10 ) ) + "px" ;
         _glob_custom_div.style.width = _DIV_W+"px" ;
         _glob_custom_div.style.height = _DIV_H+"px" ;
         _glob_custom_div.innerHTML = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
         _glob_custom_div.style.display = "block" ;
         _glob_custom_div.style.zIndex = "140" ;
         _glob_scheduled_rendering_timer = setTimeout( function() { circles_lib_canvas_process_ask( NO, YES, _glob_bip_use?BIP_BOX:_glob_target_plane, YES, _glob_use_last_pt ? NO : YES, CHECK, null, OUTPUT_SCREEN ) ; }, _glob_scheduled_rendering_interval * 60 * 1000 );
     }
     else clearTimeout( _glob_scheduled_rendering_timer );

     var input_layers_index_array = [];
     // takes all layers indexes coming after the W-plane rendering layer
     var _b_collect = 0, _layer_index, _pile_size = safe_size( _glob_wplane_layers_pile_role_array, 0 );
     for( var _i = 0 ; _i < _pile_size ; _i++ )
     {
         _layer_index = _glob_wplane_layers_pile_role_array[_i] ;
         if ( _layer_index == 1 ) _b_collect = YES ;
         else if ( _b_collect ) input_layers_index_array.push( _layer_index );
     }
     
	if (_glob_bip_use) _glob_target_plane = _glob_persistent_vars['old_plane_type'] ;
     var _canvas = null ; 
		 if (_glob_bip_use) _canvas = _glob_bipbox_canvas ;
		 else if ( _glob_target_plane == D_LOCUS ) _canvas = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0) ;
		 else if ( _glob_target_plane == W_PLANE ) _canvas = _glob_wplane_rendering_layer_pointer ;
		 else if ( _glob_target_plane == Z_PLANE ) _canvas = _glob_zplane_rendering_layer_pointer ;
		 else _canvas = _glob_wplane_rendering_layer_pointer ;
		 
     var _plane_type = safe_size( _canvas.get_type(), NO_PLANE ), _sm = _glob_bip_use ? bipbox_sm : wplane_sm ;
     
		 if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
		 {
				 circles_lib_canvas_layer_pile_init( Z_PLANE, NO );
				 circles_lib_canvas_layer_pile_init( W_PLANE, NO );
		 }

     switch( _glob_export_format )
     {
         case EXPORT_SVG:
         if ( _glob_comment.length > 0 )
         {
              _svg_comment( _glob_export_code_array, "COMMENT TO THIS PICTURE" );
              var _lines_array = _glob_comment.replaceAll( CRLF_WIN, CRLF_NOWIN ).split( CRLF_NOWIN ), _tokens_array ;
              var _y_pos = is_html_canvas( _canvas ) ? _canvas.get_height() : null, _font_size = 12 ;
                  _y_pos += 18 ;
              var _chars_per_line = Math.floor( 1.65 * _canvas.get_width() / _font_size );
              var _i, _t ;

              for( _i = 0 ; _i < _lines_array.length ; _i++ )
              {
                  _tokens_array = _lines_array[_i].tokenizer( _chars_per_line );
                  for( _t = 0 ; _t < _tokens_array.length ; _t++ )
                  {
                      if ( _tokens_array[_t].trim().length > 0 )
                      {
                          _svg_text( _glob_export_code_array, 4, _y_pos,
                                     _tokens_array[_t], DEFAULT_COLOR_STD, "courier", _font_size );
                          _y_pos += 18 ;
                      }
                  }
              }
         }
         _svg_close( _glob_export_code_array );
         break ;
         case EXPORT_PS:
         case EXPORT_EPS:
         _glob_js_e_ps_obj.comment( _glob_comment );
         _glob_js_e_ps_obj.close();
         break ;
         case EXPORT_LATEX:
         _glob_js_latex_obj.comment( _glob_comment );
         _glob_js_latex_obj.close();
         break ;
         case EXPORT_NONE: default: break ;
     }
     
     var _popups_msg = [] ;
     		 _popups_msg.push( [ 'forms', 'storage.space', POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS ] ) ;
     		 _popups_msg.push( [ 'forms', 'bip', POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS ] ) ;
     		 _popups_msg.push( [ 'forms', 'general.options', 2.1 ] ) ;
     		 _popups_msg.push( [ 'forms', 'method', POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS ] ) ;
     		 _popups_msg.push( [ 'tools', 'f.z', POPUP_DISPATCHER_UNICAST_EVENT_RELOAD ] ) ;

		 $.each( _popups_msg, function( _i, _chunk )
		 				 {
							 if ( circles_lib_plugin_find_index( { base_id : _chunk[1] }, POPUP_SEARCH_BY_BASE_ID ) != UNFOUND )
							 circles_lib_plugin_dispatcher_unicast_message( _chunk[1], _chunk[0], _chunk[2] );
						 }
		 			 ) ;

		 circles_lib_junctions_collection_run( 'after.render' ) ;
		 circles_lib_junctions_collection_destroy( 'after.render' ) ;
}

function circles_lib_canvas_afterrender_figures_draw( _filter_array = [], _b_clean = NO, _plane_type = NO_PLANE, _layer = null )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ), _b_clean = safe_int( _b_clean, NO );
    if ( !is_array( _filter_array ) ) _filter_array = [] ;
    if ( _b_clean && _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
	{
		if ( _layer == null ) _layer = _glob_zplane_work_layer_pointer ;
		circles_lib_canvas_clean( _layer, _layer.get_backgroundcolor() );
	}
    if ( _b_clean && _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
	{
		if ( _layer == null ) _layer = _glob_wplane_work_layer_pointer ;
		circles_lib_canvas_clean( _layer, _layer.get_backgroundcolor() );
	}
    if ( _b_clean && _plane_type.is_one_of( BIP_BOX, ALL_PLANES ) )
		circles_lib_canvas_clean( _glob_bipbox_canvas, _glob_bipbox_canvas.get_backgroundcolor() );

    if ( safe_size( _glob_figures_array, 0 ) > 0 )
    {
        switch( _glob_export_format )
        {
            case EXPORT_SVG: _svg_comment( _glob_export_code_array, "DRAWING ADDITIONAL FIGURES" ); break ;
            case EXPORT_PS: case EXPORT_EPS: _glob_js_e_ps_obj.comment( "DRAWING ADDITIONAL FIGURES" ); break ;
            case EXPORT_LATEX: _glob_js_latex_obj.comment( "DRAWING ADDITIONAL FIGURES" ); break ;
		    default: break ;
        }

        var _rec_chunk, _plane, _enabled, _filtered, _canvas = null ;
        var _class, _obj, _border, _bordercolor, _fill, _fillcolor, _opacity, _bordersize, _borderradius, _properties_mask, _close, _canvas_context, _mapper ;
        for( var _x = 0 ; _x < _glob_figures_array.length ; _x++ )
        {
            _rec_chunk = _glob_figures_array[_x], _plane = safe_int( _rec_chunk['plane'], NO_PLANE ) ;
            _enabled = _rec_chunk != null ? safe_int( _rec_chunk['enabled'], NO ) : NO ;
            _filtered = ( _filter_array.length == 0 || _filter_array.includes( _rec_chunk['myhash'] ) ) ? YES : NO ;
            if ( _enabled && _filtered && _plane_type.is_one_of( _plane, ALL_PLANES ) )
            {
                _class = _rec_chunk['class'], _obj = _rec_chunk['obj'] ;
                _border = safe_int( _rec_chunk['border'], 0 ), _bordercolor = safe_string( _rec_chunk['bordercolor'], "" ) ;
                _fill = safe_int( _rec_chunk['fill'], 0 ), _fillcolor = safe_string( _rec_chunk['fillcolor'], "" ) ;
                _opacity = safe_float( _rec_chunk['opacity'], 1.0 ) ;
                _bordersize = safe_int( _rec_chunk['bordersize'], 1 );
                _properties_mask = _rec_chunk['propertiesmask'];
                _close = _rec_chunk['close'] != null ? safe_int( _rec_chunk['close'], 0 ) : NO ;
                _canvas_context = null, _mapper = null ;
                _radius = safe_float( _rec_chunk['radius'], 0 );
				_canvas = circles_lib_canvas_layer_find( _plane, FIND_LAYER_BY_ROLE_DEF, _rec_chunk['layer'] );

                switch( _plane )
                {
                    case Z_PLANE:
                    _canvas_context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
                    _mapper = zplane_sm ;
                    break ;
                    case W_PLANE:
                    _canvas_context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
                    _mapper = wplane_sm ;
                    break ;
                    case BIP_BOX:
                    _canvas_context = _glob_bipbox_canvas.getContext( _glob_canvas_ctx_2D_mode );
                    _mapper = bipbox_sm ;
                    break ;
				    default: break ;
                }

                switch( _class )
                {
                    case FIGURE_CLASS_POINT:
                    circles_lib_draw_point( _canvas_context, _mapper, _obj.x, _obj.y,
                    _bordercolor.length>0, _bordercolor, _fillcolor.length>0, _fillcolor, _bordersize, _radius, _opacity, _properties_mask );
                    break ;
                    case FIGURE_CLASS_LINE:
                    circles_lib_draw_polyline( _canvas_context, _mapper, _obj,
                    _bordercolor, _fillcolor, _bordersize, _close, _opacity, UNDET, _properties_mask, YES );
                    break ;
                    case FIGURE_CLASS_POLYGON:
                    circles_lib_draw_polyline( _canvas_context, _mapper, _obj,
                    _bordercolor, _fillcolor, _bordersize, YES, _opacity, UNDET, _properties_mask, YES );
                    break ;
                    case FIGURE_CLASS_RECT:
                    if ( _borderradius )
                    circles_lib_draw_rounded_rect( _canvas_context, _mapper,
                    _obj, _border, _bordercolor, _fill, _fillcolor, _bordersize, _borderradius, YES, _opacity, _properties_mask );
                    else
                    circles_lib_draw_rect( _canvas_context, _mapper, _obj, _border, _bordercolor, _fill, _fillcolor, _bordersize, YES, _opacity, _properties_mask );
                    break ;
                    case FIGURE_CLASS_CIRCLE:
                    circles_lib_draw_complex_disk( _canvas_context, _mapper,
                    _obj.center.x, _obj.center.y, _obj.radius,
                    _border, _bordercolor, _fill, _fillcolor, _bordersize, _opacity, null, null, "", _properties_mask );
                    break ;
				    default: break ;
                }
            }
        }
    }
	else return NO ;
	return YES ;
}