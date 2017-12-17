function CIRCLEStoolsCANVASCOMPOSITIONactionCOMBOselect( _plane_type, _silent )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ), _silent = safe_int( _silent, NO );
    var _plane_def = circles_lib_plane_def_get_for_cmds( _plane_type ) ;
		var _ctrl_id = "CIRCLEStoolsCANVASCOMPOSITION"+_plane_def+"actionCOMBO" ;
		var _sel = safe_int( $( "#" + _ctrl_id + " option:selected" ).val(), 0 );
		if ( _plane_type == Z_PLANE )
		{
			 switch( _sel )
			 {
		 			case 1: CIRCLEStoolsCANVASCOMPOSITIONaddto( Z_PLANE ); break ;
		 			case 2: CIRCLEStoolsCANVASCOMPOSITIONpreview( Z_PLANE ); break ;
          default: break ;
			 }
		}
		else if ( _plane_type == W_PLANE )
		{
			 switch( _sel )
			 {
		 			case 1: CIRCLEStoolsCANVASCOMPOSITIONaddto( W_PLANE ); break ;
		 			case 2: CIRCLEStoolsCANVASCOMPOSITIONpreview( W_PLANE ); break ;
          default: break ;
			 }
		}

		setTimeout( function() { $( "#" + _ctrl_id ).get(0).selectedIndex = 0 ; }, 2500 ) ;
}

function CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUupdate()
{
    var _layers_array = CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY ;
    if ( safe_size( _layers_array, 0 ) > 0 )
    {
        var _chunk = null ;
        var HTMLcode = "<SELECT ID=\"CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBO\">" ;
        $.each( _layers_array, function( _i, _layer_chunk )
                {
                    if ( _layer_chunk.includes( "@" ) )
                    {
                        _chunk = _layer_chunk.split( "@" );
                        // 0: idcanvas, 1 : role def, 2: plane type
                        HTMLcode += "<OPTION VALUE=\""+_layer_chunk+"\">" + circles_lib_plane_def_get( _chunk[1] ) + " - " + _chunk[2] ;
                    } } ) ;
        HTMLcode += "</SELECT>" ;
        $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBOcontainer" ).html( HTMLcode );
        $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBOpanel" ).css( "display", "block" ) ;
    }
    else
    {
        $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBOcontainer" ).html( "" );
        $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBOpanel" ).css( "display", "none" ) ;
    }
}

function CIRCLEStoolsCANVASCOMPOSITIONactionSELECT()
{
		var _sel = safe_int( $( "#CIRCLEStoolsCANVASCOMPOSITIONactionCOMBO option:selected" ).val(), 0 ) ;
		switch( _sel )
		{
				case 1: CIRCLEStoolsCANVASCOMPOSITIONcompositionCLEAN() ; break ;
				case 2: CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUswapup() ; break ;
				case 3: CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUswapdown() ; break ;
				case 4: CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUremove() ; break ;
				case 5: CIRCLEStoolsCANVASCOMPOSITIONcompositionRENDER() ; break ;
				case 6: CIRCLEStoolsCANVASCOMPOSITIONcanvasSAVEASform() ; break ;
				case 7: CIRCLEStoolsCANVASCOMPOSITIONcompositionDELETE(YES,NO) ; break ;
				case 8: CIRCLEStoolsCANVASCOMPOSITIONcompositionREVERSE(YES,NO) ; break ;
        default: break ;
		}

		if ( $( "#CIRCLEStoolsCANVASCOMPOSITIONactionCOMBO" ).get(0) != null )
    setTimeout( function() { $( "#CIRCLEStoolsCANVASCOMPOSITIONactionCOMBO" ).get(0).selectedIndex = 0 ; }, 2000 ) ;
}

function CIRCLEStoolsCANVASCOMPOSITIONcompositionDELETE( _question, _silent )
{
		_question = safe_int( _question, NO ), _silent = safe_int( _silent, NO );
		var _b_go = _question ? confirm( "Confirm to delete the layers composition ?" ) : YES ;
		if ( _b_go )
		{
				CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY = [] ;
				if ( safe_size( CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY, 0 ) == 0 )
				{
						CIRCLEStoolsCANVASCOMPOSITIONcompositionCLEAN(YES) ;
						CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUupdate();
				    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Layers composition has been deleted with success", "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
				}
				else
				    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Problems while deleting the layers composition", "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
		}
}

function CIRCLEStoolsCANVASCOMPOSITIONcompositionREVERSE( _question = YES, _silent = NO )
{
    _question = safe_int( _silent, NO ), _question = safe_int( _silent, NO );
    var _layers_array = CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY ;
    if ( safe_size( _layers_array, 0 ) > 0 )
    {
         var _combo = $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBO" ).get(0) ;
         if ( _combo != null )
         {
            _layers_array.reverse();
            CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUupdate();
            CIRCLEStoolsCANVASCOMPOSITIONcompositionCLEAN(NO) ;
            CIRCLEStoolsCANVASCOMPOSITIONcompositionRENDER(YES) ;
         }
    }
    else if ( !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Fail to swap layers up: the composition pile is empty", "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
}

function CIRCLEStoolsCANVASCOMPOSITIONcanvasSAVEASform() { circles_lib_canvas_save_to_file( NO_PLANE, "CIRCLEStoolsCANVASCOMPOSITIONcanvas", "circles.composition.png", NO, NO ) ; }
function CIRCLEStoolsCANVASCOMPOSITIONcompositionCLEAN( _silent = NO )
{
    _silent = safe_int( _silent, NO );
	$( "#CIRCLEStoolsCANVASCOMPOSITIONcanvas" ).get(0).clean();
    if ( !_silent )
    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Layers composition has been cleaned with success", "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
}

function CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUswapup( _silent = NO )
{
    _silent = safe_int( _silent, NO );
    var _layers_array = CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY ;
    if ( safe_size( _layers_array, 0 ) > 0 )
    {
         var _combo = $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBO" ).get(0) ;
         if ( _combo != null )
         {
              var _n_options = _combo.options.length ;
              var _last_index = _n_options - 1 ;
              var _sel_index = _combo.selectedIndex ;
              if ( _sel_index > 0 )
              {
                   _layers_array.swap( _sel_index - 1, _sel_index );
                   CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUupdate();
                   CIRCLEStoolsCANVASCOMPOSITIONcompositionCLEAN(NO) ;
                   CIRCLEStoolsCANVASCOMPOSITIONcompositionRENDER(YES) ;
              }
         }
    }
    else if ( !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Fail to swap layers up: the composition pile is empty", "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
}

function CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUswapdown( _silent )
{
    _silent = safe_int( _silent, NO );
    var _layers_array = CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY ;
    if ( safe_size( _layers_array, 0 ) > 0 )
    {
         var _combo = $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBO" ).get(0) ;
         if ( _combo != null )
         {
              var _n_options = _combo.options.length, _last_index = _n_options - 1, _sel_index = _combo.selectedIndex ;
              if ( _sel_index < _last_index )
              {
                   _layers_array.swap( _sel_index, _sel_index - 1 );
                   CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUupdate();
                   CIRCLEStoolsCANVASCOMPOSITIONcompositionCLEAN( NO ) ;
                   CIRCLEStoolsCANVASCOMPOSITIONcompositionRENDER(YES) ;
              }
         }
    }
    else if ( !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX,  DISPATCH_ERROR, "Fail to swap layers down: the composition pile is empty", "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
}

function CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUremove()
{
    var _chunk = $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBO option:selected" ).val();
    if ( _chunk.length > 0 && _chunk.includes( "@" ) )
    {
         var _unpacked = _chunk.split( "@" );
         if ( confirm( "Confirm to remove the layer " + circles_lib_plane_def_get( _unpacked[1] ) + " - " + _unpacked[2] + " from canvas composition ?" ) )
         CIRCLEStoolsCANVASCOMPOSITIONremovefrom() ;
    }
}

function CIRCLEStoolsCANVASCOMPOSITIONaddto( _plane_type, _silent )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ), _silent = safe_int( _silent, NO );
    if ( _plane_type.is_one_of( Z_PLANE, W_PLANE ) )
    {
         var _plane_def = circles_lib_plane_def_get_for_cmds( _plane_type ) ;
         var _id = "CIRCLEStoolsCANVASCOMPOSITION"+_plane_def+"COMBO" ;
         var _sel = $( "#" + _id + " option:selected" ).val() ;
         if ( !CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY.includes( _sel ) )
         {
             var _old_size = safe_size( CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY, 0 ) ;
             CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY.push( _sel );
             var _new_size = safe_size( CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY, 0 ) ;
             var _ok = _new_size == _old_size + 1 ;
             if ( !_silent )
             circles_lib_output( OUTPUT_SPECIAL_FX, _ok ? DISPATCH_SUCCESS : DISPATCH_WARNING,
					 										   _ok ? "Layer has been added with success" : "Fail to add layer",
                                 "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
             CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUupdate() ;
         }
    }
}

function CIRCLEStoolsCANVASCOMPOSITIONpreview( _plane_type, _silent )
{
    _plane_type = safe_int( _plane_type, NO_PLANE );
    _silent = safe_int( _silent, NO );
    if ( _plane_type.is_one_of( Z_PLANE, W_PLANE ) )
    {
        var _plane_def = circles_lib_plane_def_get_for_cmds( _plane_type ) ;
        var _id = "CIRCLEStoolsCANVASCOMPOSITION"+_plane_def+"COMBO" ;
        var _chunk_packed = $( "#" + _id + " option:selected" ).val() ;
        if ( _chunk_packed.includes( "@" ) )
        {
			 		  var _chunk = _chunk_packed.split( "@" );
			 		  var _canvas = $( "#" + _chunk[0] ).get(0) ;
			 		  if ( is_html_canvas( _canvas ) )
			 		  {
                var _ret_copy = circles_lib_canvas_copy( _canvas, $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvas" ).get(0) ) ;
                if ( !_silent )
                circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Layer has been previewed with success", "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
						}
  		  }
    }
}

function CIRCLEStoolsCANVASCOMPOSITIONremovefrom( _update_combo )
{
    _update_combo = safe_int( _update_combo, YES );
    var _id = "CIRCLEStoolsCANVASCOMPOSITIONcanvasCOMBO" ;
    var _sel = $( "#" + _id + " option:selected" ).val() ;
    if ( CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY.includes( _sel ) )
    {
         CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY.delete_entry( _sel );
         if ( _update_combo ) CIRCLEStoolsCANVASCOMPOSITIONdropdownMENUupdate() ;
    }
}

function CIRCLEStoolsCANVASCOMPOSITIONcompositionRENDER( _silent )
{
		_silent = safe_int( _silent, NO );
    var _n_layers = safe_size( CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY, 0 );
    if ( _n_layers > 0 )
    {
         var _n_fix = 0, _input_array = [], _canvas, _chunk ;
         $.each( CIRCLEStoolsCANVASCOMPOSITIONlayersARRAY,
                 function( _i, _chunk_layer )
                 {
                     if ( _chunk_layer.includes( "@" ) )
                     {
                          _chunk = _chunk_layer.split( "@" ), _canvas = $( "#" + _chunk[0] ).get(0) ;
                          if ( is_html_canvas( _canvas ) )
                          {
                              _input_array.push( _canvas );
                              _n_fix++ ;
                          }
                     }
                 }
               ) ;

         if ( _n_fix > 0 )
         {
              var _resulting_canvas = circles_lib_canvas_merge_selected( _input_array ) ;
              if ( is_html_canvas( _resulting_canvas ) )
              {
                   var _ret_copy = circles_lib_canvas_copy( _resulting_canvas, $( "#CIRCLEStoolsCANVASCOMPOSITIONcanvas" ).get(0) ) ;
              }
              else _n_fix = UNDET ;
         }

				 if ( !_silent )
				 {
		         if ( _n_fix == UNDET )
             circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR,
					 											 "Canvas composition has failed during the rendering stage", "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
		         else if ( _n_fix == 0 )
             circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR,
					 											 "Canvas composition has failed during the input stage", "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
		         else if ( _n_fix > 0 && _n_fix < _n_layers )
             circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING,
				 											   "Canvas composition has been rendered with success<br>for "+_n_fix+" elements of "+_n_layers, "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
		         else if ( _n_fix == _n_layers )
             circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS,
				 											  "Canvas composition has been rendered with success", "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
				 }
    }
    else if ( !_silent )
    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "No canvas composition available: missing input layers.", "CIRCLEStoolsCANVASCOMPOSITIONoutputBOX" ) ;
}