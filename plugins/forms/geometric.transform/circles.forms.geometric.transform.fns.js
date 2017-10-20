function CIRCLESformsGEOMETRICTRANSFORMselectALL( _c ) { $("[id^=CIRCLESLISTtransformLABELcheckbox]").prop( "checked", _c ); }
function CIRCLESformsGEOMETRICTRANSFORMshift( _question, _silent, _output_channel )
{
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
	  var _dest_ref = _glob_items_switch == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
	  var _category_ref = _glob_items_switch == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
	  var _items_n = circles_lib_count_items( _items_array ), _subset = "forms", ENTRIESarray = [] ;
    if ( _items_n > 0 )
    {
      var SHIFTx = safe_float( $("#TRANSFORMSshiftXedit").val(), 0.0 );
      var SHIFTy = safe_float( $("#TRANSFORMSshiftYedit").val(), 0.0 );
      _glob_transform_x_shift = SHIFTx, _glob_transform_y_shift = SHIFTy;
      for( var i = 0 ; i < _items_n ; i++ ) if ( $("#CIRCLESLISTtransformLABELcheckbox_" + i ).is( ":checked" ) ) ENTRIESarray.push( i );
                   
      if ( ENTRIESarray.length == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ERR_00_06, _glob_app_title );
      else if ( SHIFTx == 0.0 && SHIFTy == 0.0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ERR_00_07, _glob_app_title );
      else
      {
        var MSG = _items_n == 1 ? _QUESTION_18_01 : _QUESTION_18_02 ;
        var _b_go = !_question ? YES : confirm( MSG );
        if ( _b_go )
        {
           var _e_n = safe_size( ENTRIESarray, 0 ), INDEX, complex_circle, circle_center, _screen_circle, circle_radius, complexSHIFT ;
           for( i = 0 ; i < _e_n ; i++ )
           {
             INDEX = ENTRIESarray[i] ;
             complex_circle = _items_array[INDEX].complex_circle ;
             if ( is_circle( complex_circle ) )
             {
               circle_center = new complex( complex_circle.center.x, complex_circle.center.y );
               circle_radius = complex_circle.radius ;
               complexSHIFT = new complex( SHIFTx, SHIFTy );
               circle_center = circle_center.add( complexSHIFT );
               _items_array[INDEX].complex_circle.center.x = circle_center.r();
               _items_array[INDEX].complex_circle.center.y = circle_center.i();
               _screen_circle = circles_lib_get_screendisk_from_complexdisk( zplane_sm, new circle( new point( circle_center.r(), circle_center.i() ), circle_radius ), complex_circle.draw, complex_circle.fill, complex_circle.drawcolor, complex_circle.fillcolor, complex_circle.linewidth, complex_circle.notes );
               _items_array[INDEX].screen_circle = _screen_circle.copy();
             }
           }
                
           if ( circles_lib_count_seeds() > 0 )
           {
             var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _output_channel );
		         var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
		         var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "7Unknown error" ;
		         if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
					 }
        }
      }
    }
}

function CIRCLESformsGEOMETRICTRANSFORMrotate( _question, _silent, _output_channel )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
	  var _dest_ref = _glob_items_switch == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
	  var _category_ref = _glob_items_switch == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
	  var _items_n = circles_lib_count_items( _items_array ), _subset = "forms", ENTRIESarray = [] ;
    if ( _items_n > 0 )
    {
        var ROTATEangleDEC = safe_float( $("#TRANSFORMSrotateANGLEedit").val(), 0.0 );
        _glob_transform_rotate_angle = ROTATEangleDEC ;
        var ROTATEangleRAD = radians( ROTATEangleDEC ), _ctrl_id, _checkbox;
        for( var i = 0 ; i < _items_n ; i++ ) if ( $("#CIRCLESLISTtransformLABELcheckbox_" + i ).is( ":checked" ) ) ENTRIESarray.push( i );

        if ( safe_size( ENTRIESarray, 0 ) == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ERR_00_08, _glob_app_title );
        else if ( ROTATEangleDEC == 0.0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ERR_00_09, _glob_app_title );
        else
        {
          var MSG = _items_n == 1 ? _QUESTION_18_03 : _QUESTION_18_04 ;
          var _b_go = !_question ? YES : confirm( MSG );
          if ( _b_go )
          {
            var _e_n = safe_size( ENTRIESarray, 0 ), INDEX, complex_circle, _chunk, circle_center, circle_radius ;
            var screen_center_pt, screen_radius_pt, screen_radius ;
            for( var i = 0 ; i < _e_n ; i++ )
            {
               INDEX = ENTRIESarray[i], complex_circle = _items_array[INDEX].complex_circle ;
               if ( is_circle( complex_circle ) )
               {
                  circle_center = new complex( complex_circle.center.x, complex_circle.center.y );
                  circle_radius = complex_circle.radius ;
                  circle_center = circle_center.rotate( new complex( 0.0, 0.0 ), ROTATEangleRAD );
                  _items_array[INDEX].complex_circle.center.x = circle_center.r();
                  _items_array[INDEX].complex_circle.center.y = circle_center.i();

                  screen_center_pt = zplane_sm.from_cartesian_to_client( circle_center.r(), circle_center.i() );
                  screen_radius_pt = zplane_sm.from_cartesian_to_client( circle_center.r() + circle_radius, circle_center.i() );
                  screen_radius = Math.abs( screen_center_pt.x - screen_radius_pt.x );
                                        
                  _items_array[INDEX].screen_circle = new circle();
                  _items_array[INDEX].screen_circle.center.x = screen_center_pt.x ;
                  _items_array[INDEX].screen_circle.center.y = screen_center_pt.y ;
                  _items_array[INDEX].screen_circle.radius = screen_radius ;
                  _items_array[INDEX].screen_circle.draw = complex_circle.draw ;
                  _items_array[INDEX].screen_circle.fill = complex_circle.fill ;
                  _items_array[INDEX].screen_circle.drawcolor = complex_circle.drawcolor ;
                  _items_array[INDEX].screen_circle.fillcolor = complex_circle.fillcolor ;
                  _items_array[INDEX].screen_circle.linewidth = complex_circle.linewidth ;
                  _items_array[INDEX].screen_circle.notes = complex_circle.notes ;
               }
            }
                
            if ( circles_lib_count_seeds() > 0 )
            {
  		         var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
	   	         var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "8Unknown error" ;
			         if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
               var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _output_channel );
            }
          }
        }
    }
}