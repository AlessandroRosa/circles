function _window_resize_ext() { window.afterResizeHandler.call( this ); }

window.onresize = function( event )
{
    var _sw = $(window).width(), _sh = $(window).height() ;
    if ( !_glob_app_run )
    {
			$( "#ALERTdivCOVER" ).width( _sw );
			$( "#ALERTdivCOVER" ).height( _sh );

			if ( $( "#ALERTdivMODAL" ).get( 0 ) != null )
      {
         var _threshold = 630 ;
				 $( "#ALERTdivMODAL" ).width( Math.min( _sw, _threshold ) ) ;
				 $( "#CIRCLESsplashPIX" ).css( "display", _sw > _threshold ? "block" : "none" );
				 $( "#CIRCLESsplashPIXspacer" ).css( "display", _sw > _threshold ? "block" : "none" );
				 $( "#CIRCLESsplashPIXspacer" ).css( "width", _sw > _threshold ? 24 : 0 );
				 $( "#CIRCLESsplashMASTERTABLE" ).width( _sw > _threshold ? _threshold - 40 : _sw - 20 );
				 center_div( "ALERTdivMODAL" );
			}

			// it runs when splash appears for the first time exclusively
			if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
			{
		      circles_lib_canvas_layer_pile_init( Z_PLANE, YES, YES );
		      circles_lib_canvas_layer_pile_init( W_PLANE, YES, YES );
			}
			else if ( _glob_interface_index.is_one_of( INTERFACE_EXTEND_ZPLANE, INTERFACE_EXTEND_WPLANE ) )
			circles_lib_interface_extend( _glob_interface_index, YES ) ;

      _glob_zplane_grid_canvas_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
      _glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
      _glob_zplane_freedraw_canvas_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
      _glob_zplane_work_canvas_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );
    
      _glob_wplane_grid_canvas_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
      _glob_wplane_rendering_canvas_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
      _glob_wplane_freedraw_canvas_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
      _glob_wplane_work_canvas_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );
    
      _glob_target_zplane_layers_array['grid'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
      _glob_target_zplane_layers_array['rendering'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
      _glob_target_zplane_layers_array['figures'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
      _glob_target_zplane_layers_array['work'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );
    
      _glob_target_wplane_layers_array['grid'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
      _glob_target_wplane_layers_array['rendering'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
      _glob_target_wplane_layers_array['figures'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
      _glob_target_wplane_layers_array['work'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );
   }
   else
   {
      if ( _glob_custom_div.style.display.toLowerCase() == "block" )
      {
         _glob_custom_div.style.left = ( _sw - 60 ) + "px" ;
         _glob_custom_div.style.top = ( _sh - 60 ) + "px" ;
      }
        
      $( "#ZplaneCOORDScontainer" ).css( "display", _sw < 630 ? "none" : "block" );
      $( "#WplaneCOORDScontainer" ).css( "display", _sh < 630 ? "none" : "block" );
      $( "#CANVASzplaneBAR,#CANVASwplaneBAR" ).fadeOut( "slow", function(){} );
      $( "#PANELleft" ).hide();
      $( "#PANELright" ).hide();
      $.each( _glob_zplane_layers_pile_array, function( _i, _canvas ) { _canvas.getContext( _glob_canvas_ctx_2D_mode ).visible = NO ; circles_lib_canvas_layer_show( Z_PLANE, _canvas.get_role_id(), NO ); } ) ;
      $.each( _glob_wplane_layers_pile_array, function( _i, _canvas ) { _canvas.getContext( _glob_canvas_ctx_2D_mode ).visible = NO ; circles_lib_canvas_layer_show( W_PLANE, _canvas.get_role_id(), NO ); } ) ;
      $( "#MASTERdiv" ).width( _glob_masterdiv_width_percentage + "%" );

      circles_lib_statusbar_set_border_rects();

      var _delay = circles_lib_count_items() > 0 ? 800 : 200 ;
      clearTimeout( _glob_wnd_timer_id_array[ 'after_resize_timer' ] );
      //after window has been resized, this timer stops and inner handler is executed
      _glob_wnd_timer_id_array[ 'after_resize_timer' ] = setTimeout( function() { _window_resize_ext() ; }, _delay );
   }
}

window.onkeyup = function( event )
{
    if( event.keyCode == 122 ) // F11
    {
       _glob_fullscreen_mode = !_glob_fullscreen_mode ;
       if ( circles_lib_count_items() > 0 )
       var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, OUTPUT_SCREEN );

       var MSG = "Full screen mode "+( _glob_fullscreen_mode ? "enabled" : "disabled" )+"" ;
           MSG += "\n\nConfirm to redraw the W-plane diagram ?" ;
              
       if ( circles_lib_count_seeds() > 0 )
       {
          if ( confirm( MSG ) )
          {
             var _ret_chunk_ask = circles_lib_canvas_process_ask(NO,YES,W_PLANE,YES,YES,NO);
             var _ret_id = _ret_chunk_ask != null ? safe_int( _ret_chunk_ask[0], 0 ) : 0 ;
             var _ret_msg = _ret_chunk_ask != null ? _ret_chunk_ask[1] : _ERR_00_00 ;
             if ( _ret_id == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ret_msg, _glob_app );
          }
       }
    }
    else if ( event.keyCode == 116 ) // F5
    {
       // it should ask for saving and not dispatch the event if the user
       // chooses to get back to the app
       /* if ( _glob_to_save )
          var MSG = "Current configuration was not saved yet" ;
              MSG += "Confirm to leave and lose it ?" ;
          if ( !confirm( MSG ) )
          {
               // don't dispatch the event
          }
       */
    } 
}

window.onbeforeunload = function()
{
    if ( _glob_to_save )
    {
       var MSG = "This configuration has not been saved yet." + _glob_crlf ;
           MSG += "If you exit the application, all current settings will be definitely lost." + _glob_crlf.repeat(2) ;
           MSG += "Confirm to exit ?" ;
       return MSG ;
    }
} ;

window.afterResizeHandler = function()
{
    circles_lib_menu_resize_top() ;
    if ( _glob_process_running_flag )
    {
			 circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "A process is still running and the interface will be resized at its conclusion.", _glob_app );
			 circles_lib_junctions_collection_create( 'after.render' );
			 circles_lib_junctions_add_to_collection( 'after.render', '_window_resize_ext', 'YES' ) ;
			 center_div( "PROGRESSbarDIV" );
		}
		else
		{
			 alertCLOSE();
			 if ( _glob_app_run )
			 {
					if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
					{
				     circles_lib_canvas_layer_pile_resize_to_default( NO, NO );
				     circles_lib_canvas_layer_pile_init( Z_PLANE, YES, YES );
				     circles_lib_canvas_layer_pile_init( W_PLANE, YES, YES );

   	         $.each( _glob_zplane_layers_pile_array, function( _i, _canvas ) { _canvas.getContext( _glob_canvas_ctx_2D_mode ).visible = YES ; circles_lib_canvas_layer_show( Z_PLANE, _canvas.get_role_id(), YES ); } ) ;
   			     $.each( _glob_wplane_layers_pile_array, function( _i, _canvas ) { _canvas.getContext( _glob_canvas_ctx_2D_mode ).visible = YES ; circles_lib_canvas_layer_show( W_PLANE, _canvas.get_role_id(), YES ); } ) ;
    
			       $( "#PANELleft" ).show();
			       $( "#PANELright" ).show();
					   circles_lib_canvas_layer_pile_init( Z_PLANE, YES, YES );
					   circles_lib_canvas_layer_pile_init( W_PLANE, YES, YES );

    			   _glob_zplane_grid_canvas_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
    			   _glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
    			   _glob_zplane_freedraw_canvas_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
    			   _glob_zplane_work_canvas_placeholder = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );
    			
    			   _glob_wplane_grid_canvas_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
    			   _glob_wplane_rendering_canvas_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
    		     _glob_wplane_freedraw_canvas_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
    				 _glob_wplane_work_canvas_placeholder = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );
    				
    				 _glob_target_zplane_layers_array['grid'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
    				 _glob_target_zplane_layers_array['rendering'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
    				 _glob_target_zplane_layers_array['figures'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
    				 _glob_target_zplane_layers_array['work'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );
    				
    				 _glob_target_wplane_layers_array['grid'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
    				 _glob_target_wplane_layers_array['rendering'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
    				 _glob_target_wplane_layers_array['figures'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
    				 _glob_target_wplane_layers_array['work'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );

    				 var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, OUTPUT_SCREEN );
		         var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
						 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "5Unknown error" ;
						 if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
    				 var _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, null, YES, NO, NO, NO, NO, YES, OUTPUT_SCREEN );
		         		 _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
						 		 _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "6Unknown error" ;
						 if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );

    				 if ( _glob_target_plane == W_PLANE ) circles_lib_canvas_redraw_wplane_entities( NO, "Resizing - stage 1/2", OUTPUT_SCREEN ) ;
				  }
				  else if ( _glob_interface_index.is_one_of( INTERFACE_EXTEND_ZPLANE, INTERFACE_EXTEND_WPLANE ) )
				  circles_lib_interface_extend( _glob_interface_index, YES ) ;

				  var _w = $( "#" + _glob_custom_div.id ).width() ;
				  var _h = $( "#" + _glob_custom_div.id ).height() ;
		      _glob_custom_div.style.left = ( getViewportExtents()[0] - ( _w + 10 ) ) + "px" ;
		      _glob_custom_div.style.top = ( getViewportExtents()[1] - ( _h + 10 ) ) + "px" ;
		
			    circles_lib_popup_dispatcher_multicast_message( POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL );
		   }
		}
}

window.onerror = function( message, url, linenumber, colnumber, error )
{
      url = url.replaceAll( "http://", "" );
      var URLarray = url.split( "/" );
      var LASTindex = URLarray.length - 1 ;
          var filename = URLarray[ LASTindex ] ;
          var URLresidualARRAY = URLarray.clone();
              URLresidualARRAY.remove( LASTindex, LASTindex ) ;
          var path = URLresidualARRAY.join( "<br>" );
      
      var MSG = "<table>" ;
      MSG += "<tr><td COLSPAN=\"3\">"+SYSTEM_ERROR_06+"</td></tr>" ;
      if ( error != null )
      MSG += "<tr><td COLSPAN=\"3\">"+error+"</td></tr>" ;

      MSG += "<tr><td HEIGHT=\"12\"></td></tr>" ;
      MSG += "<tr><td VALIGN=\"top\">Javascript error</td><td WIDTH=\"5\"></td><td VALIGN=\"top\"><b>" + message + "</b></td></tr>" ;
      MSG += "<tr><td HEIGHT=\"8\"></td></tr>" ;
      MSG += "<tr><td VALIGN=\"top\">Row</td><td WIDTH=\"5\"></td><td VALIGN=\"top\"><b>" + linenumber + "</b></td></tr>" ;
      MSG += "<tr><td HEIGHT=\"8\"></td></tr>" ;
      MSG += "<tr><td VALIGN=\"top\">Col</td><td WIDTH=\"5\"></td><td VALIGN=\"top\"><b>" + colnumber + "</b></td></tr>" ;
      MSG += "<tr><td HEIGHT=\"8\"></td></tr>" ;
      MSG += "<tr><td VALIGN=\"top\">Url</td><td WIDTH=\"5\"></td><td VALIGN=\"top\"><b>" + filename + "</b></td></tr>" ;
      MSG += "<tr><td HEIGHT=\"8\"></td></tr>" ;
      MSG += "<tr><td VALIGN=\"top\">Path</td><td WIDTH=\"5\"></td><td VALIGN=\"top\"><b>" + path + "</b></td></tr>" ;
      MSG += "<tr><td HEIGHT=\"6\"></td></tr>" ;
          
      if ( _glob_worker_lock )
      {
          _glob_process_running_flag = _glob_worker_lock = NO ;
          MSG += "<tr><td HEIGHT=\"6\"></td></tr>" ;
          MSG += "<tr><td VALIGN=\"top\" STYLE=\"padding:6px;background-color:#FAFAFA;color:#C00000;\" COLSPAN=\"3\" ALIGN=\"center\" CLASS=\"general_rounded_corners\">Premature stop: process has been halted and reset.</td></tr>" ;
          MSG += "<tr><td HEIGHT=\"6\"></td></tr>" ;
      }
          
      MSG += "</table>" ;
      
      var PROGRESSbarDIV = $( "#PROGRESSbarDIV" ).get(0);
      if ( PROGRESSbarDIV != null ) PROGRESSbarDIV.style.display = "none" ;

      var WAITbarDIV = $( "#WAITbarDIV" ).get(0);
      if ( WAITbarDIV != null ) WAITbarDIV.style.display = "none" ;
      
      var _log_msg = message ;
      		_log_msg += "\nLine " + linenumber + ", col " + colnumber ;
      if ( error != null ) _log_msg += "\nError " + error ;
      circles_lib_log_add_entry( _log_msg, LOG_WARNING );

      var _caption = ( _glob_app != null && _glob_app != "undefined" ) ? _glob_app : "Circles" ;
      alert_msg( DISPATCH_CRITICAL, MSG, _caption, 450, "auto" );
      return false ;
}