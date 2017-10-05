var _glob_multithread_tmp_array_len = 0 ;
var _glob_multithread_obj = null ;
var _glob_multithread_obj_draw = 0 ;
var _glob_multithread_obj_fill = 0 ;
var _glob_multithread_obj_drawcolor = "" ;
var _glob_multithread_obj_fillcolor = "" ;
var _glob_multithread_obj_linewidth = 0 ;
var _glob_multithread_obj_word = "" ;
var _glob_multithread_obj_screen_pt = null ;
var _glob_multithread_obj_screen_circle = null ;
var _glob_multithread_obj_settings = [] ;

function CIRCLESmultithreadingADDdrawingLISTENER()
{
		_glob_worker.addEventListener( 'message', function(e)
		{
         var msg = e.data ;
         switch( msg.id )
         {
		        case "append": circles_lib_progressbar_div_append_label( msg.text ); break ;
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
		        case "draw" :
   	        _glob_multithread_obj = msg.obj ;
		        _glob_multithread_vars['progress_value'] = ( msg.obj.counter == 0 ) ? 0 : safe_int( msg.obj.runner / msg.obj.counter * 100.0, 0 );
						circles_lib_progressbar_set_value( 'progressbar', _glob_multithread_vars['progress_value'], 1 );
            if ( _glob_context_dims == DIMS_3D )
            {

            }
            else if ( _glob_multithread_canvas != null && _glob_context_dims == DIMS_2D )
            {
		             if ( msg.obj.draw_fn_id == 2.2 )
		             {
                     _glob_multithread_tmp_array_len = 0 ;
                     switch( _glob_multithread_obj_settings['drawentity'] )
                     {
                        case DRAWENTITY_ISOMETRIC_CIRCLE:
												_glob_multithread_tmp_array_len = safe_size( _glob_multithread_obj.circles_array, 0 );
												break ;
                        case DRAWENTITY_POINT:
                        case DRAWENTITY_PIXEL:
                        _glob_multithread_tmp_array_len = safe_size( _glob_multithread_obj.pts_array, 0 );
                        break ;
								        default: break ;
                     }

                     for( var _i = 0 ; _i < _glob_multithread_tmp_array_len ; _i++ )
                     {
                 				if ( !_glob_multithread_running ) break ;
                        else if ( _glob_multithread_obj.words_array != undefined )
                        _glob_multithread_obj_word = safe_string( _glob_multithread_obj.words_array[_i], "" );

       		              switch( _glob_multithread_obj_settings['drawentity'] )
       		              {
            		            case DRAWENTITY_ISOMETRIC_CIRCLE :
            		            case DRAWENTITY_INVERSION_CIRCLE :
                            _glob_multithread_vars['ok_draw'] = ( _glob_disk_threshold_radius > 0 && _glob_disk_threshold_operator.length > 0 ) ? eval( _glob_multithread_obj.circles_array[_i].radius + "" + _glob_disk_threshold_operator + " " + _glob_disk_threshold_radius ) : YES ;
                            if ( _glob_multithread_vars['ok_draw'] )
             		            {
                                if ( safe_size( _glob_volatile_settings['fz.formula.packed'], 0 ) > 0 )
                                {
    																_glob_multithread_vars['fz.formula.translated'] = _glob_volatile_settings['fz.formula.packed'].replaceAll( "[z]", "("+( new complex( _glob_multithread_obj.circles_array[_i].x, _glob_multithread_obj.circles_array[_i].y ) ).formula()+")" );
    																_glob_multithread_vars['fz.formula.center'] = _glob_parser.eval( _glob_multithread_vars['fz.formula.translated'] ) ;
    															  _glob_multithread_vars['fz.formula.center.complex'] = _glob_multithread_vars['fz.formula.center']['im'] != null ? new complex( safe_float( _glob_multithread_vars['fz.formula.center']['re'], 0 ), safe_float( _glob_multithread_vars['fz.formula.center']['im'], 0 ) ) : new complex( safe_float( _glob_multithread_vars['fz.formula.center'], 0 ), 0 ) ;

    																_glob_multithread_vars['fz.formula.translated'] = _glob_volatile_settings['fz.formula.packed'].replaceAll( "[z]", "("+( new complex( _glob_multithread_obj.circles_array[_i].x+_glob_multithread_obj.circles_array[_i].radius, _glob_multithread_obj.pts_array[_i].y ) ).formula()+")" );
    																_glob_multithread_vars['fz.formula.pt'] = _glob_parser.eval( _glob_multithread_vars['fz.formula.translated'] ) ;
    															  _glob_multithread_vars['fz.formula.pt.complex'] = _glob_multithread_vars['fz.formula.pt']['im'] != null ? new complex( safe_float( _glob_multithread_vars['fz.formula.pt']['re'], 0 ), safe_float( _glob_multithread_vars['fz.formula.pt']['im'], 0 ) ) : new complex( safe_float( _glob_multithread_vars['fz.formula.pt'], 0 ), 0 ) ;

                                    _glob_multithread_obj.circles_array[_i].center.x = _glob_multithread_vars['fz.formula.center.complex'].real ;
                                    _glob_multithread_obj.circles_array[_i].center.y = _glob_multithread_vars['fz.formula.center.complex'].imag ;
                                    _glob_multithread_obj.circles_array[_i].radius = _glob_multithread_vars['fz.formula.center.complex'].distance( _glob_multithread_vars['fz.formula.pt.complex'] );
                                }

				                 	      if ( _glob_palette_use )
				                 	      {
																	 _glob_multithread_obj.circles_array[_i].drawcolor = _glob_palette_array[ _glob_multithread_obj_word.length % _glob_palette_array.length ] ;
																	 _glob_multithread_obj.circles_array[_i].fillcolor = _glob_palette_array[ _glob_multithread_obj_word.length % _glob_palette_array.length ] ;
																}
        		                    _glob_multithread_obj_screen_circle = circles_lib_draw_complex_disk( _glob_multithread_context, _glob_multithread_mapper,
                                                        _glob_multithread_obj.circles_array[_i].center.x,
                                                        _glob_multithread_obj.circles_array[_i].center.y,
                                                        _glob_multithread_obj.circles_array[_i].radius,
   		                                                  _glob_multithread_obj.circles_array[_i].draw, _glob_multithread_obj.circles_array[_i].drawcolor,
																												_glob_multithread_obj.circles_array[_i].fill, _glob_multithread_obj.circles_array[_i].fillcolor,
                                                        _glob_multithread_obj.circles_array[_i].linewidth, _glob_opacity, null, null, _glob_multithread_obj_word, 0 );
                                _glob_rec_canvas_entities_array[ _glob_multithread_obj_screen_circle.output('plain',0,NO) ] = _glob_multithread_obj.circles_array[_i] ;
             		            }
                            break ;
                            case DRAWENTITY_PIXEL :
                            if ( safe_size( _glob_volatile_settings['fz.formula.packed'], 0 ) > 0 )
                            {
																_glob_multithread_vars['fz.formula.translated'] = _glob_volatile_settings['fz.formula.packed'].replaceAll( "[z]", "("+( new complex( _glob_multithread_obj.pts_array[_i].x, _glob_multithread_obj.pts_array[_i].y ) ).formula()+")" );
																_glob_multithread_vars['fz.formula.result'] = _glob_parser.eval( _glob_multithread_vars['fz.formula.translated'] ) ;
															  _glob_multithread_vars['fz.formula.result.complex'] = _glob_multithread_vars['fz.formula.result']['im'] != null ? new complex( safe_float( _glob_multithread_vars['fz.formula.result']['re'], 0 ), safe_float( _glob_multithread_vars['fz.formula.result']['im'], 0 ) ) : new complex( safe_float( _glob_multithread_vars['fz.formula.result'], 0 ), 0 ) ;
																_glob_multithread_obj.pts_array[_i].x = _glob_multithread_vars['fz.formula.result.complex'].real ;
																_glob_multithread_obj.pts_array[_i].y = _glob_multithread_vars['fz.formula.result.complex'].imag ;
                            }

		                   	    if ( _glob_palette_use ) _glob_multithread_obj.pts_array[_i].drawcolor = _glob_palette_array[ _glob_multithread_obj_word.length % _glob_palette_array.length ] ;
                            _glob_multithread_obj_screen_pt = circles_lib_draw_pixel( _glob_multithread_context, _glob_multithread_mapper,
                                         _glob_multithread_obj.pts_array[_i].x, _glob_multithread_obj.pts_array[_i].y,
                                         _glob_multithread_obj.pts_array[_i].drawcolor,
																				 _glob_multithread_pixelsize, _glob_opacity );
                            _glob_rec_canvas_entities_array[ _glob_multithread_obj_screen_pt.output('plain',0,NO) ] = _glob_multithread_obj.pts_array[_i] ;
                            break ;
                            case DRAWENTITY_POINT :
		                   	    if ( _glob_palette_use )
		                   	    {
															 _glob_multithread_obj.circles_array[_i].drawcolor = _glob_palette_array[ _glob_multithread_obj_word.length % _glob_palette_array.length ] ;
															 _glob_multithread_obj.circles_array[_i].fillcolor = _glob_palette_array[ _glob_multithread_obj_word.length % _glob_palette_array.length ] ;
														}

                            if ( safe_size( _glob_volatile_settings['fz.formula.packed'], 0 ) > 0 )
                            {
																_glob_multithread_vars['fz.formula.translated'] = _glob_volatile_settings['fz.formula.packed'].replaceAll( "[z]", "("+( new complex( _glob_multithread_obj.pts_array[_i].x, _glob_multithread_obj.pts_array[_i].y ) ).formula()+")" );
																_glob_multithread_vars['fz.formula.result'] = _glob_parser.eval( _glob_multithread_vars['fz.formula.translated'] ) ;
															  _glob_multithread_vars['fz.formula.result.complex'] = _glob_multithread_vars['fz.formula.result']['im'] != null ? new complex( safe_float( _glob_multithread_vars['fz.formula.result']['re'], 0 ), safe_float( _glob_multithread_vars['fz.formula.result']['im'], 0 ) ) : new complex( safe_float( _glob_multithread_vars['fz.formula.result'], 0 ), 0 ) ;
																_glob_multithread_obj.pts_array[_i].x = _glob_multithread_vars['fz.formula.result.complex'].real ;
																_glob_multithread_obj.pts_array[_i].y = _glob_multithread_vars['fz.formula.result.complex'].imag ;
                            }

                            _glob_multithread_obj_screen_pt = circles_lib_draw_point( _glob_multithread_context, _glob_multithread_mapper,
                                                 _glob_multithread_obj.pts_array[_i].x, _glob_multithread_obj.pts_array[_i].y,
                                                 1, _glob_multithread_obj.pts_array[_i].drawcolor,
																								 _glob_multithread_obj.pts_array[_i].fill, _glob_multithread_obj.pts_array[_i].fillcolor,
                                                 _glob_multithread_pixelsize, _glob_pt_radius * _glob_multithread_pixelsize, _glob_opacity );
                            _glob_rec_canvas_entities_array[ _glob_multithread_obj_screen_pt.output('plain',0,NO) ] = _glob_multithread_obj.pts_array[_i] ;
         		                break ;
										        default: break ;
                        }
                     }
		             }
		             else if ( draw_fn_id == 2.4 )
		             {
		                 _glob_multithread_vars['screen_pt'] = circles_lib_draw_point( _glob_multithread_context, _glob_multithread_mapper,
		                                                                         _glob_multithread_obj.x, _glob_multithread_obj.y,
                                                                             _glob_multithread_obj.draw, _glob_multithread_obj_drawcolor, _glob_multithread_obj.fill, _glob_multithread_obj_fillcolor,
                                                                             _glob_pt_border, _glob_pt_radius, _glob_opacity );
		                 circles_lib_draw_text( _glob_multithread_canvas, _glob_multithread_mapper,
		                                  _glob_multithread_vars['screen_pt'].x, _glob_multithread_vars['screen_pt'].y,
		                                  msg.write['text_corpus'],
		                                  msg.write['text_fontcolor'],
		                                  msg.write['text_fontsize'] + " " + msg.write['text_fontfamily'],
		                                  msg.write['text_shift_x_canvas'], msg.write['text_shift_y_canvas'],
		                                  YES, _glob_opacity
		                                );
		             }
		        }
		        break ;
		        case "err":
		        var err_no = safe_float( msg.errno, 0 );
		        var err_text = msg.errtext ;
            var err_callerid = msg.caller_id ;
		        switch( err_no )
		        {
                case 2.1:
                case 2.2:
                case 2.3:
                case 3.1:
                case 3.2:
                case 3.3:
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, err_text, _glob_app_title );
                break ;
                case 4.1:
                var MSG = "Coordinates are not consistent for rasterization" ;
                    if ( safe_int( msg.w, 0 ) == 0 ) MSG += "\n* Check width ;" ;
                    if ( safe_int( msg.h, 0 ) == 0 ) MSG += "\n* Check height ;" ;
                    if ( safe_int( msg.d, 0 ) == 0 ) MSG += "\n* Check density ;" ;
                    circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, MSG, _glob_app_title );
                break ;
                case 4.2:
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Please, input a word or make another choice for perfoming 'algebraic' method.", _glob_app_title );
                break ;
                case 4.3:
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "The input word does not match the current alphabet", _glob_app_title );
                break ;
                case 4.4:
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ERR_33_03, _glob_app_title );
                break ;
                case 4.5:
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Can't start: no sinks found", _glob_app_title );
                break ;
                case 4.6:
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ERR_33_04, _glob_app_title );
                break ;
                case 4.7:
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ERR_33_01, _glob_app_title );
                break ;
                default:
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, err_text, _glob_app_title );
                break ;
		        }

            $('[id$=renderBTN]').css('color',DEFAULT_COLOR_STD);
            $("[id$=renderBTN]").filter( function(){ return !this.id.start_with( "PLUGIN" ) } ).attr( "class", "link_rounded" );
		        break ;
		        case "finish" :
            var _caller_id = msg.caller_id, _dict = msg.dict ;
            var _layers_pile = circles_lib_canvas_layer_pile_get( _glob_target_plane );
            switch( _glob_target_plane )
            {
                case Z_PLANE:
                $.each( _layers_pile, function( _i, _layer ) { _layers_pile[_i].complex_rect = new rect( _glob_zplaneLEFT, _glob_zplaneTOP, _glob_zplaneRIGHT, _glob_zplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ); } );
                break ;
                case W_PLANE:
                $.each( _layers_pile, function( _i, _layer ) { _layers_pile[_i].complex_rect = new rect( _glob_wplaneLEFT, _glob_wplaneTOP, _glob_wplaneRIGHT, _glob_wplaneBOTTOM, _RECT_ORIENTATION_CARTESIAN ); } );
                break ;
                case BIP_BOX:
                _glob_bip_canvas.getContext( _glob_canvas_ctx_2D_mode ).complex_rect = new rect( _glob_bipLEFT, _glob_bipTOP, _glob_bipRIGHT, _glob_bipBOTTOM, _RECT_ORIENTATION_CARTESIAN );
                break ;
				        default: break ;
            }
            
            circles_lib_progressbar_div_show(0);
            circles_lib_progressbar_div_write_label( "Finish" );
            
            _glob_original_dict = _glob_dict_processor.sliced_dictionary = msg.dict.clone();
		        _glob_process_running_flag = _glob_multithread_running = _glob_worker_lock = NO ;
		        var BTN = $( "#refreshWPLANEbtn" ).get(0);        if ( BTN != null ) BTN.disabled = 0 ;
		        circles_lib_canvas_after_process_main();
					  // last method shall be recorded after the process has started
						_glob_last_method = _glob_method ;
            $('[id$=renderBTN]').css('color',DEFAULT_COLOR_STD);
            $("[id$=renderBTN]").filter( function(){ return !this.id.start_with( "PLUGIN" ) } ).attr( "class", "link_rounded" );

            if ( circles_lib_plugin_is_visible( "general.options", "forms" ) )
            {
              if ( CIRCLESformsGENERALOPTIONStabindex == 3 )
              {
                if($('#POPUPgeneraloptionsDIV').resizable('instance')!=undefined) $('#POPUPgeneraloptionsDIV').resizable('destroy');
                circles_lib_plugin_load('forms','general.options',NO,3);
              }
            }
		        break ;
		        case "init":
            circles_lib_progressbar_set_value( 'progressbar', 0, YES );
		        circles_lib_progressbar_div_append_label( "" );
            circles_lib_progressbar_div_write_label( "Initialization" );
		        _glob_worker_lock = YES ;
		        var BTN = $( "#refreshWPLANEbtn" ).get(0);
		        if ( BTN != null ) BTN.disabled = 1 ;
		        break ;
		        case "start":
            circles_lib_progressbar_set_value( 'progressbar', 0, YES );
            _glob_process_running_flag = _glob_multithread_running = YES ;
            _glob_multithread_obj_settings = msg.settings ;
            circles_lib_progressbar_div_write_label( "Drawing ..." );
		        break ;
		        case "step":
		        circles_lib_progressbar_div_step_label( msg.text );
		        break ;
		        case "resetbar":
            circles_lib_progressbar_set_value( 'progressbar', 0, YES );
            circles_lib_progressbar_div_append_label ( msg.text );
		        break ;
		        case "ret_dict" :
            var _dict = msg.dict.split( "@" );
            _glob_original_dict = _glob_dict_processor.sliced_dictionary = _dict.clone();
            var _depth = safe_int( msg.depth, 1 );
            var _crash_words_packed = msg.crash_words_packed ;
                _dictionary_init_settings_array['crash_words_packed'] = _crash_words_packed ;
                _glob_multithread_depth = _depth ;
		        break ;
		        case "stop":
            // last method shall be recorded after the process has started
            _glob_process_running_flag = NO ;
 						_glob_multithread_running = 0 ;
						_glob_worker_lock = NO ;
						_glob_last_method = _glob_method ;
            $('[id$=renderBTN]').css('color',DEFAULT_COLOR_STD);
            $("[id$=renderBTN]").filter( function(){ return !this.id.start_with( "PLUGIN" ) } ).attr( "class", "link_rounded" );
		        break ;
		        case "update" :
            circles_lib_progressbar_div_write_label( msg.text );
		        break ;
		     }
		}, false );
}