function CIRCLESmultithreadingADDresizingLISTENER()
{
		_glob_worker.addEventListener( 'message', function(e)
		{
         var msg = e.data ;
         switch( msg.id )
         {
		        case "append": break ;
		        case "benchmark":
		        _glob_benchmark_start_microtime = msg.start ;
		        _glob_benchmark_end_microtime = msg.end ;
		        _glob_benchmark_operations = msg.operations ;
		        if ( msg.probability_distribution != null && msg.probability_distribution != UNDEF )
						{
		 						_glob_probability_showcase_array = []; 
                _glob_probability_showcase_array.push( msg.probability_distribution.includes( "@" ) ? msg.probability_distribution.split( "@" ) : [ msg.probability_distribution ] );
                _glob_probability_showcase_array.push( _glob_benchmark_operations );
                _glob_probability_showcase_array.push( msg.stats_bunch );
						}
		        break ;
		        case "debug" : debug( msg.text ); break ;
		        case "draw" : break ;
		        case "err":
		        var err_no = safe_float( msg.errno, 0 );
		        var err_text = msg.errtext ;
            var err_callerid = msg.caller_id ;
		        switch( err_no )
		        {
                default:
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, err_text, _glob_app_title );
                break ;
		        }
		        break ;
		        case "finish" :
            _glob_worker_lock = _glob_process_running_flag = NO ;
		        break ;
		        case "init": break ;
		        case "start": break ;
		        case "step":
            var _opcode = safe_float( msg.opcode );
            switch( _opcode )
            {
                case 0.1: // start
                $( "#CIRCLESmultitaskingREDRAWsplashACTIONlabel" ).html( msg.label ) ;
                break ;
                case 0.2: // refresh percentage
                $( "#CIRCLESmultitaskingREDRAWsplashPROGRESSlabel" ).html( ( safe_int( msg.counter, 0 ) / safe_int( msg.entities_n, 1 ) * 100.0 ).roundTo(2) + " %" ) ;
                break ;
                case 0.3: // pre-draw
                $( "#CIRCLESmultitaskingREDRAWsplashACTIONlabel" ).html( msg.label ) ;
                break ;
                case 0.31: // draw
                var _entities_array = msg.entities_array ;
                var _canvas = $( "#" + msg.canvas_id ).get(0) ;
                var _plane_type = safe_int( msg.plane_type, NO_PLANE ) ;
                var _draw_entity = safe_int( msg.draw_entity, DRAWENTITY_NONE ) ;
                var _mapper = null ;
                switch( _plane_type )
                {
                   case Z_PLANE: _mapper = zplane_sm ; break ;
                   case W_PLANE: _mapper = wplane_sm ; break ;
                   case BIP_BOX: _mapper = bipbox_sm ; break ;
                   case D_LOCUS: _mapper = dlocus_sm ; break ;
                   default: break ;
                }
                
                if ( is_html_canvas( _canvas ) && is_screen_mapper( _mapper ) )
                {
                   var _context = _canvas.getContext( _glob_context_dims + "d" );
                   switch( _draw_entity )
                   {
                      case DRAWENTITY_PIXEL:
                      for( var _i = 0 ; _i < _glob_redraw_pass_counter ; _i++ )
                      $.each( _entities_array,
                              function( _i, _pixel ) { circles_lib_draw_pixel( _context, _mapper, _pixel.x, _pixel.y, _pixel.drawcolor, 1, _glob_opacity, 0, NO ) ; }
                            );
                      break ;
                      case DRAWENTITY_POINT:
                      for( var _i = 0 ; _i < _glob_redraw_pass_counter ; _i++ )
                      $.each( _entities_array,
                              function( _i, _point ) { circles_lib_draw_point( _context, _mapper, _point.x, _point.y, YES, _point.drawcolor, YES, _point.fillcolor, _glob_pt_border, _point.radius, _glob_opacity, 0, NO ) ; }
                            );
                      break ;
                      case DRAWENTITY_ISOMETRIC_CIRCLE:
                      for( var _i = 0 ; _i < _glob_redraw_pass_counter ; _i++ )
                      $.each( _entities_array,
                              function( _i, _circle )
                              {
                                 circles_lib_draw_screen_disk( _context, "", _circle,
                                                        _circle.draw, _circle.drawcolor,
                                                        _circle.fill, _circle.fillcolor, _circle.linethick, _glob_opacity, 0 ) ;
                              }
                            );
                      break ;
                   }
               }

                SPLASH( "", HIDE );
                _glob_process_running_flag = _glob_worker_lock = NO ;
                break ;
            }
		        break ;
		        case "resetbar": break ;
		        case "stop":
            _glob_worker_lock = _glob_process_running_flag = NO ;
            SPLASH( "", HIDE );
		        break ;
		        case "update" : break ;
		        default: break ;
		     }
		}, false );
}