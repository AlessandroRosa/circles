function CIRCLESformsCOORDINATESalphabetCOMBOonchange()
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ) ;
		var _symbol = safe_string( $( "#CIRCLESformsCOORDINATESalphabetCOMBO option:selected" ).val(), "" ) ;
		if ( _symbol.length > 0 )
		{
				_glob_persistent_vars['CIRCLESformsCOORDINATESsymbol'] = _symbol ;
				_glob_persistent_vars['CIRCLESformsCOORDINATESitemobj'] = circles_lib_find_item_obj_by_symbol( _items_array, _glob_persistent_vars['CIRCLESformsCOORDINATESsymbol'] ) ;
        var _index = circles_lib_find_item_index_by_symbol( _items_array, _glob_persistent_vars['CIRCLESformsCOORDINATESsymbol'] ) ;
        if ( _index != UNFOUND )
        {
           _glob_zplane_selected_items_array.flush();
           _glob_zplane_selected_items_array.push( _index );
        }
          
				if ( !is_item_obj( _glob_persistent_vars['CIRCLESformsCOORDINATESitemobj'] ) || _index == UNFOUND )
				{
		 		   circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Current symbol '"+_symbol+"' does not refer to any Mobius map.", _glob_app_title );
		 		 	 CIRCLESformsCOORDINATESmapTRACERhandler( "toggleoff" ) ;
				}
				else
        {
           _glob_persistent_vars['CIRCLESformsCOORDINATESmobiusmap'] = _glob_persistent_vars['CIRCLESformsCOORDINATESitemobj'].map ;
           var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, OUTPUT_SCREEN );
           var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
           var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown message" ;
        }
		}
}

function CIRCLESformsCOORDINATESinputMANAGER( _plane_type, _render, _callback_fn, _input_type, _center, _side, _question, _silent, _output_channel )
{
		_plane_type = circles_lib_return_plane_type( _plane_type ), _render = safe_int( _render, YES );
    _callback_fn = safe_string( _callback_fn, "" ), _side = safe_int( _side, 0 ) ;
    _input_type = safe_int( _input_type, ZOOM_PULL_COORDS );
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _plane_label = circles_lib_plane_get_def( _plane_type );
    var MSG = "Confirm to set these coordinates for the " + _plane_label + "? " ;
    var _b_go = !_question ? YES : confirm( MSG );
    if ( _b_go )
    {
				var LEFT = 0, TOP = 0, RIGHT = 0, BOTTOM = 0 ;
        if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
        {
		        if ( _input_type == ZOOM_PULL_COORDS )
		        {
		            LEFT = safe_float( $("#PLANEleft").val(), 0 );
		            TOP = safe_float( $("#PLANEtop").val(), 0 );
		            RIGHT = safe_float( $("#PLANEright").val(), 0 );
		            BOTTOM = safe_float( $("#PLANEbottom").val(), 0 );
		        }
		        else if ( _input_type == ZOOM_SET_COORDS )
		        {
		            var _half_side = _side / 2.0 ;
		            LEFT = _center.real - _half_side ; 
		            TOP = _center.imag + _half_side ;
		            RIGHT = _center.real + _half_side ; 
		            BOTTOM = _center.imag - _half_side ;
		        }
		          
		        if ( LEFT > RIGHT )
		        {
		            var _msg = _plane_label+_glob_crlf+"Horizonthal coordinates are not consistent" ;
		            if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
		            return [ RET_ERROR, _msg ] ;
		        }
		        else if ( BOTTOM > TOP )
		        {
		            var _msg = _plane_label+_glob_crlf+"Vertical coordinates are not consistent" ;
		            if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
		            return [ RET_ERROR, _msg ] ;
		        }
		        else
		        {
		            if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
		            {
		                _glob_zplaneLEFT = LEFT, _glob_zplaneRIGHT = RIGHT ;
		                _glob_zplaneTOP = TOP, _glob_zplaneBOTTOM = BOTTOM ;
		            }
		            else if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
		            {
		                _glob_wplaneLEFT = LEFT, _glob_wplaneRIGHT = RIGHT ;
		                _glob_wplaneTOP = TOP, _glob_wplaneBOTTOM = BOTTOM ;
		            }
		            else if ( _plane_type.is_one_of( BIP_BOX, ALL_PLANES ) )
		            {
		                _glob_bipLEFT = LEFT, _glob_bipRIGHT = RIGHT ;
		                _glob_bipTOP = TOP, _glob_bipBOTTOM = BOTTOM ;
		            }
		            else if ( _plane_type.is_one_of( D_LOCUS, ALL_PLANES ) )
		            {
		                _glob_dlocusLEFT = LEFT, _glob_dlocusRIGHT = RIGHT ;
		                _glob_dlocusTOP = TOP, _glob_dlocusBOTTOM = BOTTOM ;
		            }

                $("#CIRCLESformsCOORDINATESsetcoordsBTN").css("color","black");
		            var _ret_chunk = circles_lib_coordinates_set_core( null, null, _plane_type, _silent, _render, _output_channel );
		            if ( typeof _callback_fn === "function" ) eval( _callback_fn );
		            return _ret_chunk ;
		        }
				}
				else if ( _glob_interface_index.is_one_of( INTERFACE_EXTEND_ZPLANE, INTERFACE_EXTEND_WPLANE ) )
				{
						var _w = safe_float( $( "#CIRCLESformsCOORDINATESplaneWIDTH" ).val(), 0 );
						$( "#CIRCLESformsCOORDINATESplaneWIDTH" ).css( "color", _w <= 0 ? COLOR_ERROR : DEFAULT_COLOR_STD );
						var _h = safe_float( $( "#CIRCLESformsCOORDINATESplaneHEIGHT" ).val(), 0 );
						$( "#CIRCLESformsCOORDINATESplaneHEIGHT" ).css( "color", _h <= 0 ? COLOR_ERROR : DEFAULT_COLOR_STD );
						
						if ( _w <= 0 || _h <= 0 ) return [ RET_ERROR, "Invalid input coordinates" ] ;
						else
						{
								var _center_str = $( "#CIRCLESformsCOORDINATESplaneCENTER" ).val();
								var _center_pt = read_2D_point( _center_str );
								
								LEFT = _center_pt.x - _w / 2.0 ;
								TOP = _center_pt.y + _h / 2.0 ;
								RIGHT = _center_pt.x + _w / 2.0 ;
								BOTTOM = _center_pt.y - _h / 2.0 ;
								
								_glob_interface_index == INTERFACE_EXTEND_ZPLANE ? _glob_zplaneLEFT = LEFT : _glob_wplaneLEFT = LEFT ; 
								_glob_interface_index == INTERFACE_EXTEND_ZPLANE ? _glob_zplaneTOP = TOP : _glob_wplaneTOP = TOP ; 
								_glob_interface_index == INTERFACE_EXTEND_ZPLANE ? _glob_zplaneRIGHT = RIGHT : _glob_wplaneRIGHT = RIGHT ; 
								_glob_interface_index == INTERFACE_EXTEND_ZPLANE ? _glob_zplaneBOTTOM = BOTTOM : _glob_wplaneBOTTOM = BOTTOM ; 

                $("#CIRCLESformsCOORDINATESsetcoordsBTN").css("color","black");
		            var _ret_chunk = circles_lib_coordinates_set_core( null, null, _plane_type, _silent, _render, _output_channel );
		            if ( _callback_fn.length > 0 ) eval( _callback_fn );
		            return _ret_chunk ;
						}
				}
      }
      else return [ RET_ERROR, "coordinates process stopped by user" ] ;
}