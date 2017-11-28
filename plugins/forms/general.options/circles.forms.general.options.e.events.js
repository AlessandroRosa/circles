function CIRCLESformsGENERALOPTIONSeventHANDLER( _ctrl_id, _event )
{
	  if ( _event.stopPropagation )      _event.stopPropagation();
	  if ( _event.cancelBubble != null ) _event.cancelBubble = true;

    var _return_pressed = _event.keyCode == 13 ? YES : NO ;
    var _param_01 = arguments[2], _param2 = arguments[3] ;
		if( _return_pressed )  // return key code
		{
				event.preventDefault();
        switch( _ctrl_id )
        {
              case "CIRCLESgeneraloptionsSETTINGSpixelsizeEDIT":
              $( "#" + _ctrl_id ).val( _glob_pixel_size );
              break ;
              case "CIRCLESgeneraloptionsSETTINGSlinethickEDIT":
              $( "#" + _ctrl_id ).val( _glob_line_width );
              break ;
              case "CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeEDIT":
              var _min_t = 1, _max_t = 15 ;
              var _t = Math.max( 0, safe_int( $( "#" + _ctrl_id ).val(), 0 ) ) ;
              var _fail = ( _t < _min_t || _t > _max_t ) ? 1 : 0 ;
              $( "#" + _ctrl_id ).css( "background-color", _fail ? DEFAULT_COLOR_WARNING : "#73EA73" ) ;
              $( "#" + _ctrl_id ).css( "color", "white" ) ;
              if ( _fail ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Time interval does not range from 1 to 15", 'CIRCLESgeneraloptionsLASTPT_OUTMSGlabel' ) ;
              else
              {
                  circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Time interval has been set up", 'CIRCLESgeneraloptionsLASTPT_OUTMSGlabel' ) ;
                  _glob_scheduled_rendering_interval = _t ;
                  $( "#CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeMINUTESlabel" ).html( "minute" + ( _t == 1 ? "" : "s" ) );
                  setTimeout( function() { circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "These settings will be applied after the next rendering", 'CIRCLESgeneraloptionsLASTPT_OUTMSGlabel' ) }, 3500 ) ;                  
              }
              setTimeout( function() { $( "#" + _ctrl_id ).css( "background-color", "white" ) ; $( "#" + _ctrl_id ).css( "color", DEFAULT_COLOR_STD ) ; if ( _fail ) $( "#" + _ctrl_id ).val( _glob_scheduled_rendering_interval ); }, 2000 ) ;
              break ;
              case "CIRCLESgeneraloptionsLASTPTcoordsEDIT":
              var _c = parse_complex_from_string( $( "#" + _ctrl_id ).val() );
              var _b_fail = !is_complex( _c ) ;
              $( "#" + _ctrl_id ).css( "background-color", _b_fail ? DEFAULT_COLOR_WARNING : "#73EA73" ) ;
              $( "#" + _ctrl_id ).css( "color", "white" ) ;
              if ( !_b_fail )
              {
                  circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Last point coords have been set up with success", 'CIRCLESgeneraloptionsLASTPT_OUTMSGlabel' ) ;
                  _glob_last_pt = _c ;
                  setTimeout( function() { circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "These settings will be applied after the next rendering", 'CIRCLESgeneraloptionsLASTPT_OUTMSGlabel' ) }, 3500 ) ;                  
              }
              circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Last point coords do not assemble into a complex value", 'CIRCLESgeneraloptionsLASTPT_OUTMSGlabel' ) ;
              setTimeout( function() { $( "#" + _ctrl_id ).css( "background-color", "white" ) ; $( "#" + _ctrl_id ).css( "color", DEFAULT_COLOR_STD ) ; if ( _fail ) $( "#" + _ctrl_id ).val( _glob_last_pt.formula() ); }, 2000 ) ;
              break ;
              default: CIRCLESformsGENERALOPTIONSapply(); break ;
        }
    }
}
