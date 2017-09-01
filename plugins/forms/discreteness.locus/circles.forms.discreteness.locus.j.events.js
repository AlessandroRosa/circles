function CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX_CLICK( _check )
{
   _check = safe_int( _check, UNDET );
 	 CIRCLESformsDISCRETENESSLOCUSplugin_pick = $('#CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX').prop( "checked" ) ;
   $('#CIRCLESformsDISCRETENESSLOCUSbuttonBARpickerICON').prop( "src", _glob_path_to_img + ( "icons/picker/picker.icon."+( CIRCLESformsDISCRETENESSLOCUSplugin_pick ? "02" : "00" )+".20x20.png" ) );
   if ( _check == YES ) CIRCLESformsDISCRETENESSLOCUSworkLAYERmanagement( CIRCLESformsDISCRETENESSLOCUSdiv_id, NO, YES ) ;
   CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch = _check ? MOUSE_PICK_POINTS_PROC_ID : MOUSE_NO_PROC_ID ;
}

function CIRCLESformsDISCRETENESSLOCUSinitZOOMproc( _check, _advice )
{
   _check = safe_int( _check, YES ), _advice = safe_int( _advice, NO ) ;
   CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX_CLICK( NO );
   if ( _check == YES ) CIRCLESformsDISCRETENESSLOCUSworkLAYERmanagement( CIRCLESformsDISCRETENESSLOCUSdiv_id, NO, YES ) ;
   CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch = _check ? MOUSE_ZOOM_PROC_ID : MOUSE_NO_PROC_ID ;
   $( "#CIRCLESformsDISCRETENESSLOCUSbuttonBARselectREGIONicon" ).prop( "src", _glob_path_to_img + "icons/lens/lens.icon."+( _check ? "02" : "01" )+".20x20.png" );
   if ( is_rect( CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect ) && _check == NO ) CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect = null ;
    
   if ( _advice )
   circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Drag the rect out of the diagram to cancel zoom selection", "CIRCLESformsDLOCUSmsgboxCONTAINER" ) ;
}

function CIRCLESformsDISCRETENESSLOCUSarrowsCHECKBOX_CLICK()
{
	 var _checked = $( "#CIRCLESformsDISCRETENESSLOCUSarrowsCHECKBOX" ).prop( "checked" ) ? YES : NO ;
	 $( "#CIRCLESformsDISCRETENESSLOCUSarrowstepsEDIT" ).prop( "disabled", _checked ? NO : YES );
	 $( "#CIRCLESformsDISCRETENESSLOCUSarrowstepsEDIT" ).css( "color", _checked ? DEFAULT_COLOR_STD : DEFAULT_EDIT_COLOR_DISABLED );

	 $( "#CIRCLESformsDISCRETENESSLOCUSarrowheadsizeEDIT" ).prop( "disabled", _checked ? NO : YES );
	 $( "#CIRCLESformsDISCRETENESSLOCUSarrowheadsizeEDIT" ).css( "color", _checked ? DEFAULT_COLOR_STD : DEFAULT_EDIT_COLOR_DISABLED );

	 $( "#CIRCLESformsDISCRETENESSLOCUSarrowlinewidth" ).prop( "disabled", _checked ? NO : YES );
	 $( "#CIRCLESformsDISCRETENESSLOCUSarrowlinewidth" ).css( "color", _checked ? DEFAULT_COLOR_STD : DEFAULT_EDIT_COLOR_DISABLED );
    
   $( "#CIRCLESformsDISCRETENESSLOCUSarrowsdrawshaftCHECKBOX" ).prop( "disabled", _checked ? NO : YES );
}

function CIRCLESformsDISCRETENESSLOCUSfracsCHECKBOX_CLICK()
{
	 var _checked = $( "#CIRCLESformsDISCRETENESSLOCUSdisplayfracsCHECKBOX" ).prop( "checked" ) ? YES : NO ;
	 $( "#CIRCLESformsDISCRETENESSLOCUSdisplayfracstepsEDIT" ).prop( "disabled", _checked ? NO : YES );
	 $( "#CIRCLESformsDISCRETENESSLOCUSdisplayfracstepsEDIT" ).css( "color", _checked ? DEFAULT_COLOR_STD : DEFAULT_EDIT_COLOR_DISABLED );
}

function CIRCLESformsDISCRETENESSLOCUSunbindCANVASevents()
{
   var _diagram_layer_canvas = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0);
   if ( is_html_canvas( _diagram_layer_canvas ) && _glob_target_plane == D_LOCUS && _diagram_layer_canvas != null )
   {
     _diagram_layer_canvas.onmouseover = function( event ) {}
     _diagram_layer_canvas.onmouseout = function( event ) {}
     _diagram_layer_canvas.onmouseup = function( event )   {}
     _diagram_layer_canvas.onmousedown = function( event ) {}
     _diagram_layer_canvas.onmousemove = function( event ) {}
     _diagram_layer_canvas.onclick = function( event ) {}
     _diagram_layer_canvas.ondblclick = function( event ) {}
   }

   var _work_layer_canvas = $( "#CIRCLESdlocusworklayerCANVAS" ).get(0);
   if ( is_html_canvas( _work_layer_canvas ) && _glob_target_plane == D_LOCUS && _work_layer_canvas != null )
   {
     _work_layer_canvas.onmouseout = function( event ) {}
     _work_layer_canvas.onmouseup = function( event )   {}
     _work_layer_canvas.onmousedown = function( event ) {}
     _work_layer_canvas.onmousemove = function( event ) {}
     _work_layer_canvas.onmouseover = function( event ) {}
   }
}

function CIRCLESformsDISCRETENESSLOCUSbindCANVASevents()
{
   var _diagram_layer_canvas = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0);
   if ( is_html_canvas( _diagram_layer_canvas ) && _glob_target_plane == D_LOCUS && _diagram_layer_canvas != null )
   {
     _diagram_layer_canvas.onmouseover = function( event ) { CIRCLESformsDISCRETENESSLOCUS_canvas_onmouseover( _diagram_layer_canvas, event ); }
     _diagram_layer_canvas.onmouseout = function( event ) { CIRCLESformsDISCRETENESSLOCUS_canvas_onmouseout( _diagram_layer_canvas, event ); }
     _diagram_layer_canvas.onmouseup = function( event ) { CIRCLESformsDISCRETENESSLOCUS_canvas_onmouseup( _diagram_layer_canvas, event ); }
     _diagram_layer_canvas.onmousedown = function( event ) { CIRCLESformsDISCRETENESSLOCUS_canvas_onmousedown( _diagram_layer_canvas, event ); }
     _diagram_layer_canvas.onmousemove = function( event ) { CIRCLESformsDISCRETENESSLOCUS_canvas_onmousemove( _diagram_layer_canvas, event ); }
     _diagram_layer_canvas.onclick = function( event ) { CIRCLESformsDISCRETENESSLOCUS_canvas_onclick( _diagram_layer_canvas, event ); }
     _diagram_layer_canvas.ondblclick = function( event ) { CIRCLESformsDISCRETENESSLOCUS_canvas_ondblclick( _diagram_layer_canvas, event ); }
   }

   var _work_layer_canvas = $( "#CIRCLESdlocusworklayerCANVAS" ).get(0);
   if ( is_html_canvas( _work_layer_canvas ) && _glob_target_plane == D_LOCUS && _work_layer_canvas != null )
   {
     _work_layer_canvas.onmouseout = function( event ) { CIRCLESformsDISCRETENESSLOCUS_WORK_canvas_onmouseout( _work_layer_canvas, event ); }
     _work_layer_canvas.onmouseup = function( event ) { CIRCLESformsDISCRETENESSLOCUS_WORK_canvas_onmouseup( _work_layer_canvas, event ); }
     _work_layer_canvas.onmousedown = function( event ) { CIRCLESformsDISCRETENESSLOCUS_WORK_canvas_onmousedown( _work_layer_canvas, event ); }
     _work_layer_canvas.onmousemove = function( event ) { CIRCLESformsDISCRETENESSLOCUS_WORK_canvas_onmousemove( _work_layer_canvas, event ); }
     _work_layer_canvas.onmouseover = function( event ) { CIRCLESformsDISCRETENESSLOCUS_WORK_canvas_onmouseover( _work_layer_canvas, event ); }
   }
}

function CIRCLESformsDISCRETENESSLOCUSeventsHANDLER( _event, _ctrl_id )
{
	 if ( _event.stopPropagation )      _event.stopPropagation();
	 if ( _event.cancelBubble != null ) _event.cancelBubble = true;

   var _alt_pressed = _event.altKey ;
   var _del_pressed = _event.keyCode == 8 ? YES : NO ;
   var _canc_pressed = _event.keyCode == 46 ? YES : NO ;
	 var _ctrl_pressed = _event.ctrlKey ;
   var _esc_pressed = _event.keyCode == 27 ? YES : NO ;
	 var _shift_pressed = _event.shiftKey ;
   var _return_pressed = _event.keyCode == 13 ? YES : NO ;

   if ( _return_pressed )
   {
      if ( _ctrl_id.is_one_of( "CIRCLESformsDISCRETENESSLOCUScuspFRAC" ) )
         CIRCLESformsDISCRETENESSLOCUScomputeCUSP();
      else if ( _ctrl_id.is_one_of( "CIRCLESformsDISCRETENESSLOCUSticks",
           "CIRCLESformsDISCRETENESSLOCUSstartFRAC",
           "CIRCLESformsDISCRETENESSLOCUSendFRAC",
           "CIRCLESformsDISCRETENESSLOCUSorder",
           "CIRCLESformsDISCRETENESSLOCUSaccuracy",
           "CIRCLESformsDISCRETENESSLOCUSmaxstep",
           "CIRCLESformsDISCRETENESSLOCUStraceSTART",
           "CIRCLESformsDISCRETENESSLOCUStraceA",
           "CIRCLESformsDISCRETENESSLOCUStraceB",
           "CIRCLESformsDISCRETENESSLOCUStraceCOMMUTATOR",
           "CIRCLESformsDISCRETENESSLOCUSeqSOLUTION",
					 "CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITmaxsteps",
           "CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITsteprate",
           "CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITaccuracy",
           "CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITforwardfactor",
           "CIRCLESformsDISCRETENESSLOCUSpleatingraysEDITbackwardfactor" ) ) CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( [ 4 ], YES );
      else if ( _ctrl_id.is_one_of( "CIRCLESformsDISCRETENESSLOCUSarrowstepsEDIT",
           "CIRCLESformsDISCRETENESSLOCUSarrowheadsizeEDIT",
           "CIRCLESformsDISCRETENESSLOCUSarrowsdrawshaftCHECKBOX",
           "CIRCLESformsDISCRETENESSLOCUSdisplayfracsCHECKBOX",
           "CIRCLESformsDISCRETENESSLOCUSdisplayfracstepsEDIT" ) )
      {
        _glob_current_tab['dlocus'] = 0 ;
	      $( "#CIRCLESformsDISCRETENESSLOCUSmainDIV" ).get(0).tabber.tabShow(0);
	      CIRCLESformsDISCRETENESSLOCUSdispatcher( POPUP_DISPATCHER_UNICAST_EVENT_FOCUS ) ;
        CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( [ 8, 1, 64, 16, 32 ], YES );
      }
   }
   else
   {
      if ( _ctrl_id.is_one_of( "CIRCLESformsDISCRETENESSLOCUScalcBOXtrA",
           "CIRCLESformsDISCRETENESSLOCUScalcBOXtrB",
           "CIRCLESformsDISCRETENESSLOCUScalcBOXtrAB",
           "CIRCLESformsDISCRETENESSLOCUScalcBOXtrABab" ) )
      CIRCLESformsDISCRETENESSLOCUScalcDISPATCHER( _ctrl_id );
   }
}

function CIRCLESformsDISCRETENESSLOCUS_canvas_onmouseover( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
}

function CIRCLESformsDISCRETENESSLOCUS_canvas_onclick( obj, event )
{
    /*
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
    */
}

function CIRCLESformsDISCRETENESSLOCUS_canvas_ondblclick( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
}

function CIRCLESformsDISCRETENESSLOCUS_canvas_onmousedown( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
}

function CIRCLESformsDISCRETENESSLOCUS_canvas_onmousemove( obj, event )
{
}

function CIRCLESformsDISCRETENESSLOCUS_canvas_onmouseup( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
}

function CIRCLESformsDISCRETENESSLOCUS_canvas_onmouseout( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
}

function CIRCLESformsDISCRETENESSLOCUS_WORK_canvas_onmousedown( obj, event )
{
    if ( CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch == MOUSE_ZOOM_PROC_ID )
    {
       _glob_canvas_obj_ref = obj ;
       _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
       _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;

       circles_lib_canvas_clean( obj );
       circles_lib_dlocus_mapper_init( obj.get_width(), obj.get_height(), YES );
       CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect = new rect();
       CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_start'] = new point( _glob_mouse_x, _glob_mouse_y );
       CIRCLESformsDISCRETENESSLOCUSzoom_STARTpt = dlocus_sm.from_client_to_cartesian( _glob_mouse_x, _glob_mouse_y );
    }
    
    if ( CIRCLESformsDISCRETENESSLOCUSrect.includes_pt( _glob_mouse_x, _glob_mouse_y ) )
    {
           _mouse_event_curr_pt = dlocus_sm.from_client_to_cartesian( CIRCLESformsDISCRETENESSLOCUSplugin_pick ? _glob_mouse_x + 1 : _glob_mouse_x,
                                                                      CIRCLESformsDISCRETENESSLOCUSplugin_pick ? _glob_mouse_y + 14 : _glob_mouse_y - 4 );
       var _tr = new complex( _mouse_event_curr_pt.x, _mouse_event_curr_pt.y );
       $( "#CIRCLESformsDISCRETENESSLOCUScuspVALUE" ).val( _tr.formula() );
       if ( CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch == MOUSE_PICK_POINTS_PROC_ID )
       {
		       $( "#CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT" ).val( _tr.formula() );
		       $( "#CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT" ).css( "background-color", "white" );
			 }

       var _chunk_selection = $( "#CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO option:selected" ).val();
       var _init_mode = _chunk_selection.includes( "@" ) ? safe_int( ( _chunk_selection.split( "@" ) )[0], _DLOCUS_NONE ) : _DLOCUS_NONE ;
       var _b_collected = CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array.length == 0 ? 0 : CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array.test( function( _c ) { return _c.is_equal_to( _tr ) ; } ) ;
       if ( !_b_collected )
       {
          CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array.push( _tr );
          if ( _glob_storage['dlocus_selected_pts'] == null ) _glob_storage['dlocus_selected_pts'] = [] ;
          if ( is_array( _glob_storage['dlocus_selected_pts'] ) ) _glob_storage['dlocus_selected_pts'].push( _tr ) ;
          CIRCLESformsDISCRETENESSLOCUSselectionlistUPDATE();
       }
            
       if ( _chunk_selection.includes( "@" ) )
       {
          var _formula = ( _chunk_selection.split( "@" ) )[1] ;
              _formula = _formula.replace( "%mu%", "( "+_tr.formula()+" )" );
          _tr = parse_complex_from_string( circles_lib_math_parse_formula( _formula ) );
       }
    
       if ( _tr.formula().length > 0 )
       {
            var _transform_map = ( $( "#CIRCLESformsDISCRETENESSLOCUStraceTRANSFORMformula" ).val() + "" ).trim();
            if ( _transform_map.length == 0 ) _transform_map = "%mu%" ;
            _transform_map = _transform_map.replaceAll( "%mu%", "("+_tr.formula()+")" );
            var _ret_trace = circles_lib_math_parse_formula( _transform_map );
            _ret_trace = parse_complex_from_string( _ret_trace + "" );
    
            if ( !CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch.is_one_of( MOUSE_ZOOM_PROC_ID ) )
						CIRCLESformsDISCRETENESSLOCUSplotCOMPLEXPT( null, 1 );
            var _trace_fix_op = $( "#FIXTRACECOMBO" ).get(0) != null ? $( "#FIXTRACECOMBO" ).val() : 0 ;
            if ( CIRCLESformsDISCRETENESSLOCUSplugin_pick )
            {
                var _t_a = new complex( 0, 0 ), _t_b = new complex( 0, 0 );
                if ( _trace_fix_op.is_one_of( _DLOCUS_TRACE_FIX_DEFAULT_OP, _DLOCUS_TRACE_FIX_B_OP, _DLOCUS_TRACE_FIX_ABab_OP ) ) // no trace fix
                {
                     _t_a = _ret_trace ;
                     _t_b = $( "#CIRCLESformsDISCRETENESSLOCUStraceB" ).get(0) != null ? $( "#CIRCLESformsDISCRETENESSLOCUStraceB" ).val() : "0" ;
                     //_t_b = parse_complex_from_string( circles_lib_math_parse_formula( _t_b ) );
                }
                else if ( _trace_fix_op == _DLOCUS_TRACE_FIX_A_OP ) // fix trace A
                {
                     _t_a = $( "#CIRCLESformsDISCRETENESSLOCUStraceA" ).get(0) != null ? $( "#CIRCLESformsDISCRETENESSLOCUStraceA" ).val() : "0" ;
                     //_t_a = parse_complex_from_string( circles_lib_math_parse_formula( _t_a ) );
                     _t_b = _ret_trace ;
                }
    
                var _ret_fill = GLOB_PLUGIN_PARAMS_FILLER( _t_a, _t_b );
            }
       }
    }
}

function CIRCLESformsDISCRETENESSLOCUS_WORK_canvas_onmousemove( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
    if ( CIRCLESformsDISCRETENESSLOCUSrect.includes_pt( _glob_mouse_x, _glob_mouse_y ) )
    {
				_mouse_event_curr_pt = dlocus_sm.from_client_to_cartesian( CIRCLESformsDISCRETENESSLOCUSplugin_pick ? _glob_mouse_x + 1 : _glob_mouse_x,
                                                                     CIRCLESformsDISCRETENESSLOCUSplugin_pick ? _glob_mouse_y + 15 : _glob_mouse_y - 4 );
        $( "#CIRCLESformsDISCRETENESSLOCUScoordsX" ).html( _mouse_event_curr_pt.x );
        $( "#CIRCLESformsDISCRETENESSLOCUScoordsY" ).html( _mouse_event_curr_pt.y );
    }

    if ( CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch == MOUSE_ZOOM_PROC_ID &&
         is_rect( CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect ) )
    {
       CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_end'] = new point( _glob_mouse_x, _glob_mouse_y );
       CIRCLESformsDISCRETENESSLOCUStmpVARS['zoomw'] = Math.abs( CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_end'].x - CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_start'].x ) ;
       CIRCLESformsDISCRETENESSLOCUStmpVARS['zoomh'] = Math.abs( CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_end'].y - CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_start'].y ) ;
       if ( CIRCLESformsDISCRETENESSLOCUStmpVARS['zoomw'] / CIRCLESformsDISCRETENESSLOCUStmpVARS['zoomh'] > 1 )
       {
           CIRCLESformsDISCRETENESSLOCUStmpVARS['sign_y'] = CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_end'].y < CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_start'].y ? -1 : 1 ;
		       CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_end'].y = CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_start'].y + CIRCLESformsDISCRETENESSLOCUStmpVARS['zoomw'] / CIRCLESformsDISCRETENESSLOCUStmpVARS['aspectratio'] * CIRCLESformsDISCRETENESSLOCUStmpVARS['sign_y'] ;
			 }
			 else
			 {
		       CIRCLESformsDISCRETENESSLOCUStmpVARS['sign_x'] = CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_end'].x < CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_start'].x ? -1 : 1 ;
		       CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_end'].x = CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_start'].x + CIRCLESformsDISCRETENESSLOCUStmpVARS['zoomh'] * CIRCLESformsDISCRETENESSLOCUStmpVARS['aspectratio'] * CIRCLESformsDISCRETENESSLOCUStmpVARS['sign_x'] ;
			 }

			 CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_rect'].set_corners( CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_start'], CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_end'] ) ;
       CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_rect'].correct(1);

       circles_lib_canvas_clean( obj );
       circles_lib_draw_polyline( obj.getContext( _glob_canvas_ctx_2D_mode ), dlocus_sm,
			 											CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_rect'].corners(),
														"#45D845", "", 2, YES, DEFAULT_MAX_OPACITY, UNDET, 0, NO );
       /*
       circles_lib_draw_polyline( obj.getContext( _glob_canvas_ctx_2D_mode ), dlocus_sm,
			 											CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect.corners(),
														"#45D845", "", 2, YES, DEFAULT_MAX_OPACITY, UNDET, 0, YES );
                            */
    }
}

function CIRCLESformsDISCRETENESSLOCUS_WORK_canvas_onmouseover( obj, event )
{
    $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).css('cursor', $( "#CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX" ).prop( "checked" ) ? "url("+_glob_path_to_img+"icons/picker/picker.icon.01.20x20.png), auto" : "pointer" );
}

function CIRCLESformsDISCRETENESSLOCUS_WORK_canvas_onmouseup( obj, event )
{
    if ( CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch == MOUSE_ZOOM_PROC_ID )
    {
    	 _glob_canvas_obj_ref = obj ;
       _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
       _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;

       if ( is_rect(  CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect ))
       {
           CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_end'] = new point( _glob_mouse_x, _glob_mouse_y );
           CIRCLESformsDISCRETENESSLOCUSzoom_STARTpt = dlocus_sm.from_client_to_cartesian( CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_start'].x,
                                                                                          CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_start'].y );
           CIRCLESformsDISCRETENESSLOCUSzoom_ENDpt = dlocus_sm.from_client_to_cartesian( CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_end'].x,
                                                                                        CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_end'].y );
    			 
           CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect.set_corners( CIRCLESformsDISCRETENESSLOCUSzoom_STARTpt, CIRCLESformsDISCRETENESSLOCUSzoom_ENDpt ) ;
           CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect.correct();
           dlocus_sm.set_coords_rect( CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect );

           _glob_dlocusLEFT = CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect.get_left();
           _glob_dlocusTOP = CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect.get_bottom();
           _glob_dlocusRIGHT = CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect.get_right();
           _glob_dlocusBOTTOM = CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect.get_top();

           circles_lib_canvas_clean( obj );
           $( "#CIRCLESformsDISCRETENESSLOCUSfixregionCHECKBOX" ).prop( "checked", true );
           CIRCLESformsDISCRETENESSLOCUSdrawCANVAS( [8, 1, 64, 16, 32], YES );
           CIRCLESformsDISCRETENESSLOCUSinitZOOMproc(NO) ;
       }

       CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch = MOUSE_NO_PROC_ID ;
    }
}

function CIRCLESformsDISCRETENESSLOCUS_WORK_canvas_onmouseout( obj, event )
{
    if ( CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch == MOUSE_ZOOM_PROC_ID )
    {
         // also refresh view
         circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Pointer is out: zoom selection has been cancelled", "CIRCLESformsDLOCUSmsgboxCONTAINER" ) ;
         circles_lib_canvas_clean( obj );
         CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch = MOUSE_NO_PROC_ID ;
         if ( is_rect(  CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect )) CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect = null ;
		     $( "#CIRCLESformsDISCRETENESSLOCUSbuttonBARselectREGIONicon" ).prop( "src", _glob_path_to_img + "icons/lens/lens.icon.01.20x20.png" );
         $( "#CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT" ).focus();
    }

    $( "#CIRCLESformsDISCRETENESSLOCUSworkLAYER" ).css('cursor','default');
}