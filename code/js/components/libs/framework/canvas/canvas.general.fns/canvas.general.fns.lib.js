function circles_lib_canvas_get_topmost( _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    var _layers_array = circles_lib_canvas_layer_pile_get_per_plane( _plane_type );
    var _L = safe_size( _layers_array, 0 ), _canvas, _z_index, _max = 0, _ret_canvas = null ;
    for( var i = 0 ; i < _L ; i++ )
    {
        _canvas = _layers_array[i] ;
        if ( is_html_canvas( _canvas ) )
        {
            _z_index = $("#"+_canvas.get_iddiv() ).get(0) != null ? safe_int( $("#"+_canvas.get_iddiv() ).zIndex(), 0 ) : 0 ;
            if ( _max == 0 || _z_index > _max )
            {
                _max = _z_index ;
                _ret_canvas = _canvas ;
            }
        }
    }
    return _ret_canvas ;
}

function circles_lib_canvas_get_from_role( _plane_type, _role )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _role = safe_float( _role, ROLE_NONE );
    return circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _role );
}

function circles_lib_canvas_clean( _canvas, _color, _out_channel )
{
    _color = safe_string( _color, "" ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _bk = is_html_canvas( _canvas ) ? safe_string( _canvas.get_backgroundcolor(), "" ) : "" ;
    var _context = is_html_canvas( _canvas ) ? _canvas.getContext( _glob_canvas_ctx_2D_mode ) : null ;
    if ( _context != null )
    {
       var W = is_html_canvas( _canvas ) ? _canvas.get_width() : 0, H = is_html_canvas( _canvas ) ? _canvas.get_height() : 0 ;
       _context.clearRect( 0, 0, W, H );
       _context.fillStyle = _color.length > 0 ? _color : ( _bk.length > 0 ? _bk : "rgba( 255, 255, 255, 0 )" ) ;
       _canvas.set_backgroundcolor( _context.fillStyle ) ;
       _context.fillRect( 0, 0, W, H );
       return [ RET_OK, "Canvas cleaned up to color: " + _context.fillStyle ];
    }
    else return [ RET_ERROR, "Canvas is not available" ];
}

function circles_lib_refresh_main_canvases( _out_channel )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _final_ret = YES ;
    var _ret_chunk_zplane = circles_lib_canvas_render_zplane( null, zplane_sm, null, NO, YES, YES, YES, YES, YES, _out_channel );
    var _ret_chunk_wplane = circles_lib_canvas_render_wplane( null, wplane_sm, null, NO, YES, NO, YES, NO, YES, _out_channel );
    if ( _ret_chunk_zplane[0] != RET_IRRELEVANT )
    _final_ret &= _ret_chunk_zplane != null ? _ret_chunk_zplane[0] : 0 ;
    if ( _ret_chunk_wplane[0] != RET_IRRELEVANT )
    _final_ret &= _ret_chunk_wplane != null ? _ret_chunk_wplane[0] : 0 ;
    return [ _final_ret, _final_ret ? "Top menu displayed with success" : "Errors while displaying top menu: check plane params" ] ;
}

function circles_lib_canvas_get_target( _plane_type, _target_service )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _target_service = safe_string( _target_service, "" );
    return _plane_type == Z_PLANE ? _glob_target_zplane_layers_array[_target_service] : _glob_target_wplane_layers_array[_target_service] ;
}

function circles_lib_canvas_get_exists( _plane_type, _target_service )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    var _target = _plane_type == Z_PLANE ? _glob_target_zplane_layers_array[_target_service] : _glob_target_wplane_layers_array[_target_service] ;
    return _target != null ? YES : NO ;
}

function circles_lib_canvas_set( _plane_type, _target_service, _layer )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    if ( !is_html_canvas( _layer ) ) return NO ;
    var _arr = _plane_type == Z_PLANE ? _glob_target_zplane_layers_array : _glob_target_wplane_layers_array ;
    _arr[_target_service] = _layer ;
		return is_html_canvas( _arr[_target_service] ) ? YES : NO ;    
}

function circles_lib_canvas_plane_refresh( _plane_type, _question, _out_channel )
{
		if ( circles_lib_count_seeds() == 0 ) return ;
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
		var _plane_def = circles_lib_plane_get_def( _plane_type ) ;
    _question = safe_int( _question, YES );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _b_go = _question ? ( confirm( "Confirm to update the " + _plane_def + " ?" ) ) : YES ;
    if ( _b_go )
    {
        if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
        {
					 if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
           {
               var _ret_chunk = circles_lib_canvas_render_zplane(null,null,null,YES,NO,NO,NO,YES,YES,_out_channel);
               var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
               var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown message" ;
               if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
           }
					 else circles_lib_interface_extend( _plane_type, YES, null, _out_channel ) ;
        }

        if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
        {
					 if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
					 {
						  var _ret_chunk = circles_lib_canvas_render_wplane(null,null,null,YES,NO,NO,NO,NO,YES,_out_channel);
				      var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
					    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "14Unknown error" ;
					 }
					 else circles_lib_interface_extend( _plane_type, YES, null, _out_channel ) ;
        }

        if ( _plane_type.is_one_of( BIP_BOX, ALL_PLANES ) )
        {
					 circles_lib_canvas_render_bipbox(null,null,YES,NO,NO,NO,NO,YES,_out_channel);
        }
		}
}

function circles_lib_canvas_zplane_hide_bar() { $("#CANVASzplaneBAR").fadeOut( "slow" ); }
function circles_lib_canvas_wplane_hide_bar() { $("#CANVASwplaneBAR").fadeOut( "slow" ); }
function circles_lib_canvas_zplane_start_timer() { _glob_zplane_canvas_timerID = setInterval( "circles_lib_canvas_zplane_manage_timer(1)", 500 ); }
function circles_lib_canvas_wplane_start_timer() { _glob_wplane_canvas_timerID = setInterval( "circles_lib_canvas_wplane_manage_timer(1)", 500 ); }
function circles_lib_canvas_zplane_manage_timer( _index )
{
    _index = safe_int( _index, 0 ), _glob_zplane_canvas_timerSECS += 0.5 ;
		if ( _glob_zplane_canvas_timerSECS == 1.0 )
		{
       switch( _index )
       {
          case 1:
   		    var _pos = $( "#ZPLANElayers_pile" ).offset();
   			  $("#CANVASzplaneBAR").css( "left", ( _pos.left + 3 ) + "px" );
   			  $("#CANVASzplaneBAR").css( "top", ( _pos.top + 4 ) + "px" );
    			$("#CANVASzplaneBAR").fadeIn( "slow" );
          circles_lib_canvas_zplane_stop_timer();
          break ;
          default:
          break ;
       }
		}
}

function circles_lib_canvas_wplane_manage_timer( _index )
{
    _index = safe_int( _index, 0 ), _glob_wplane_canvas_timerSECS += 0.5 ;
		if ( _glob_wplane_canvas_timerSECS == 1 )
		{
       switch( _index )
       {
          case 1:
    		  var _pos = $( "#WPLANElayers_pile" ).offset();
    			$("#CANVASwplaneBAR").css( "left", ( _pos.left + 3 ) + "px" );
    			$("#CANVASwplaneBAR").css( "top", ( _pos.top + 4 ) + "px" );
    			$("#CANVASwplaneBAR").fadeIn( "slow" );
          circles_lib_canvas_wplane_stop_timer();
          break ;
          default:
          break ;
       }
		}
}

function circles_lib_canvas_zplane_stop_timer()
{
		clearInterval( _glob_zplane_canvas_timerID );
		_glob_zplane_canvas_timerID = null, _glob_zplane_canvas_timerSECS = 0 ;
}

function circles_lib_canvas_wplane_stop_timer()
{
		clearInterval( _glob_wplane_canvas_timerID );
		_glob_wplane_canvas_timerID = null, _glob_wplane_canvas_timerSECS = 0 ;
}

// copy fns
function circles_lib_canvas_copy( _src_canvas, _dest_canvas )
{
    if ( is_html_canvas( _src_canvas ) && is_html_canvas( _dest_canvas ) )
    {
        _dest_canvas.getContext( _glob_canvas_ctx_2D_mode ).drawImage( _src_canvas,
                                 0, 0, _src_canvas.get_width(), _src_canvas.get_height(),
                                 0, 0, _dest_canvas.get_width(), _dest_canvas.get_height() );
        return YES ;
    }
    else return NO ;
}

function circles_lib_canvas_blowup( _src_canvas, _dest_canvas, srcX, srcY, srcWIDTH, srcHEIGHT )
{
    var _src = is_array( _src_canvas ) ? _src_canvas : [ _src_canvas ], _ret = 0 ;
    _src.forEach( function( _canvas )
    {
      if ( is_html_canvas( _canvas ) && is_html_canvas( _dest_canvas ) )
      {
          var _context = _dest_canvas.getContext( _glob_canvas_ctx_2D_mode );
          var _src_viewport_aspect_ratio = srcWIDTH / srcHEIGHT ;
          var _dest_aspect_ratio = _dest_canvas.get_width() / _dest_canvas.get_height();
          _context.drawImage( _canvas, srcX, srcY, srcWIDTH, srcHEIGHT, 0, 0, _dest_canvas.get_width(), _dest_canvas.get_height() );
          _ret |= 1 ;
      }
      else _ret &= 0 ;
    } );
    return _ret ;
}

// merge canvas
function circles_lib_canvas_merge_all_per_plane( _plane_type, _layer_ref_index )
{
    _plane_type = safe_int( _plane_type, NO_PLANE ), _layer_ref_index = safe_int( _layer_ref_index, 0 );
    var _canvas_array = [], _layers_array_ref = circles_lib_canvas_layer_pile_get( _plane_type );
    var _canvas_w = 0, _canvas_h = 0, _bk_color = "transparent", _idcanvas ;
    _layers_array_ref.sort( function( l1, l2 ){ return l1.zIndex - l2.zIndex ; } );
    $.each( _layers_array_ref, function( _i, _chunk )
    {
       _idcanvas = _chunk.get_idcanvas() ;
       if ( $( "#" + _idcanvas ).get(0) != null )
       {
          _canvas_w = $( "#"+_idcanvas ).get(0).get_width() ;
          _canvas_h = $( "#"+_idcanvas ).get(0).get_height() ;
          _canvas_array.push( $( "#"+_idcanvas ).get(0) );
          if ( _layer_ref_index == _i ) _bk_color = $( "#"+_idcanvas ).get(0).get_backgroundcolor() ;
       }
    } );

    if ( safe_size( _canvas_array, 0 ) > 0 )
    {
       _glob_custom_use_canvas = document.createElement('canvas');
       _glob_custom_use_canvas.set_width( _canvas_w );
       _glob_custom_use_canvas.set_height( _canvas_h );
       _glob_custom_use_canvas.set_backgroundcolor( _bk_color ) ;
       if ( is_html_canvas( _glob_custom_use_canvas ) )
       {
          var _custom_use_context = _glob_custom_use_canvas.getContext( _glob_canvas_ctx_2D_mode );
          if ( _custom_use_context != null )
          {
              for( var _i = 0 ; _i < _canvas_array.length ; _i++ )
              _custom_use_context.drawImage( _canvas_array[_i], 0, 0, _canvas_w, _canvas_h, 0, 0, _canvas_w, _canvas_h );
              return _glob_custom_use_canvas ;
          }
          else return null ;
       }
       else return null ;
    }
    else return null ;
}

function circles_lib_canvas_merge_selected()
{
    var _canvas_array = [], _c, _input_array = null ;
    if ( is_array( arguments[0] ) ) _input_array = arguments[0] ;
    else for( _c = 0 ; _c < arguments.length ; _c++ ) if ( is_html_canvas( arguments[ _c ] ) ) _input_array.push( arguments[ _c ] );

		var _max_w = 0, _max_h = 0 ;

    for( _c = 0 ; _c < _input_array.length ; _c++ )
		{
				 if ( is_html_canvas( _input_array[ _c ] ) )
				 {
						 _canvas_array.push( _input_array[ _c ] );
						 _max_w = Math.max( _max_w, _input_array[ _c ].get_width() );
						 _max_h = Math.max( _max_h, _input_array[ _c ].get_height() );
				 }
		}

    if ( safe_size( _canvas_array, 0 ) > 0 )
    {
         _glob_custom_use_canvas = document.createElement("canvas");
         if ( is_html_canvas( _glob_custom_use_canvas ) )
         {
         		  _glob_custom_use_canvas.set_width( _max_w );
         		  _glob_custom_use_canvas.set_height( _max_h );
              // the backmost layer background color applies to the resulting image
              _glob_custom_use_canvas.set_backgroundcolor( _canvas_array[0].backgroundColor ) ;
              var _custom_use_context = _glob_custom_use_canvas.getContext( _glob_canvas_ctx_2D_mode );
              if ( _custom_use_context != null )
              {
                   for( var _i = 0 ; _i < _canvas_array.length ; _i++ ) _custom_use_context.drawImage( _canvas_array[_i], 0, 0);
                   return _glob_custom_use_canvas ;
              }
              else return null ;
         }
         else return null ;
    }
    else return null ;
}