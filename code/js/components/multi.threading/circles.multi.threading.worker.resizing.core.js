var _glob_multithread_path_to_root = "../../../../" ;
var _glob_multithread_path_to_complex = _glob_multithread_path_to_root ;
var _glob_multithread_path_to_circles = _glob_multithread_path_to_complex ;

var _glob_multithread_running = 0 ;

self.addEventListener( 'message', function(e)
{
    var JS_FOLDER_SUPPORT = _glob_multithread_path_to_complex + "support/code/js/basements/" ;
    var JS_FOLDER_ALL_SHARED = _glob_multithread_path_to_complex + "support/code/js/shared/" ;
    var JS_FOLDER_COMPONENTS = _glob_multithread_path_to_circles + "code/js/components/" ;

    var data = e.data ;

    importScripts( JS_FOLDER_COMPONENTS + "globals/defaults/circles.defaults.js" );
    importScripts( JS_FOLDER_COMPONENTS + "globals/defs/circles.constants.js" );
    importScripts( JS_FOLDER_SUPPORT + "basics/a-basics/number.js" );
    importScripts( JS_FOLDER_SUPPORT + "basics/a-basics/string.js" );
    importScripts( JS_FOLDER_SUPPORT + "basics/a-basics/json.lib.js" );
    importScripts( JS_FOLDER_SUPPORT + "basics/array.js" );
    importScripts( JS_FOLDER_SUPPORT + "fns/fns.generals.js" );
    importScripts( JS_FOLDER_SUPPORT + "fns/fns.math.js" );
    importScripts( JS_FOLDER_SUPPORT + "fns/fns.strings.js" );
    importScripts( JS_FOLDER_SUPPORT + "fns/fns.system.js" );

    var msg_id = data.id, msg_lang = safe_string( data.lang, "en" ) ;

    importScripts( JS_FOLDER_SUPPORT + "classes/load/a-primitives/circle.class.js" );
    importScripts( JS_FOLDER_SUPPORT + "classes/load/a-primitives/line.class.js" );
    importScripts( JS_FOLDER_SUPPORT + "classes/load/a-primitives/2d.point.class.js" );
    importScripts( JS_FOLDER_SUPPORT + "classes/load/a-primitives/rect.class.js" );
    importScripts( JS_FOLDER_SUPPORT + "classes/load/b-basic.maths/complex.number.class.js" );
    importScripts( JS_FOLDER_SUPPORT + "classes/load/d-draw/screen.mapper.class.js" );
    importScripts( JS_FOLDER_COMPONENTS + "langs/" + msg_lang + "/circles.lang.js" );

    switch ( msg_id )
    {
         case "init" :
         _glob_multithread_running = 1 ;
         break ;
         case "start" :
         // such data are collected to be later transported to the end of the resizing process
         var PROGRESS_REFRESH_AT_EACH = 100 ;
         var _plane_type = data.plane_type ;
         var _canvas_id = data.canvas_id ;
         var _canvas_w = data.canvas_dims[0] ;
         var _canvas_h = data.canvas_dims[1] ;
         var _left_up_pt = new point( data.left_up_pt.x, data.left_up_pt.y ) ;
         var _right_down_pt = new point( data.right_down_pt.x, data.right_down_pt.y ) ;
         var _entities_n = data.entities_array.size_associative() ;
         var _entities_array = data.entities_array.toJSON() ; // input is an "associative" array
         var _drawentity = data.drawentity ;
         var _process_title = data.process_title ;

         var display_rect = new rect( 0, 0, _canvas_w, _canvas_h, _RECT_ORIENTATION_CARTESIAN, "display rect" );
         var client_rect = new rect( 0, 0, _canvas_w, _canvas_h, _RECT_ORIENTATION_SCREEN, "client rect" );
         var _sm = new screen_mapper();
         _sm.accuracy = DEFAULT_MAX_ACCURACY ;
         _sm.set_coords_corners( _left_up_pt, _right_down_pt );
         _sm.set_client_rect( client_rect );
         _sm.set_display_rect( display_rect );
         
         var _tmp_entities = [] ;
         
         var _complex_pt, _screen_pt, _counter = 0 ;
         self.postMessage( { 'id' : 'step',
                             'opcode' : 0.1,
                             'label' : _process_title
                           }
                         );

         switch( _drawentity )
         {
    				 case DRAWENTITY_PIXEL:
    				 case DRAWENTITY_POINT:
    				 if ( _entities_n > 0 )
    				 {
                 var _screen_pt, _pt ;
                 for( var _i in _entities_array )
                 {
                      if ( _glob_multithread_running == 0 ) break ;
                      _pt = _sm.from_cartesian_to_client( _entities_array[_i].x, _entities_array[_i].y ) ;
                      _pt.bordercolor = _entities_array[_i].bordercolor ;
                      _pt.fillcolor = _entities_array[_i].fillcolor ;
                      _pt.radius = _entities_array[_i].radius ;
                      _tmp_entities.push( _pt );
                      _counter++ ;
                      if ( _counter % PROGRESS_REFRESH_AT_EACH == 0 )
                      {
                          self.postMessage( { 'id' : 'step',
                                              'opcode' : 0.2,
                                              'counter' : _counter,
                                              'entities_n' : _entities_n
                                            }
                                          );

													if ( _tmp_entities.length > 0 )
								          self.postMessage( { 'id' : 'step',
									                            'opcode' : 0.31,
									                            'plane_type' : _plane_type,
									                            'canvas_id' : _canvas_id,
									                            'draw_entity' : _drawentity,
									                            'entities_array' : _tmp_entities.clone()
									                          }
									                        );
									                        
									       _tmp_entities = [] ;
                      }
                 }
    				 }
    				 break ;
             case DRAWENTITY_INVERSION_CIRCLE:
             case DRAWENTITY_ISOMETRIC_CIRCLE:
    				 if ( _entities_n > 0 )
    				 {
                 var _center_pt, _radius_pt ;
                 for( var _i in _entities_array )
                 {
                      if ( _glob_multithread_running == 0 ) break ;
                      _center_pt = _sm.from_cartesian_to_client( _entities_array[_i].center.x, _entities_array[_i].center.y ) ;
                      _radius_pt = _sm.from_cartesian_to_client( _entities_array[_i].center.x + _entities_array[_i].radius, _entities_array[_i].center.y ) ;
                      _tmp_entities.push( new circle( _center_pt, Math.abs( _center_pt.x - _radius_pt.x ),
                                                      _entities_array[_i].draw, _entities_array[_i].fill,
                                                      _entities_array[_i].bordercolor, _entities_array[_i].fillcolor,
                                                      _entities_array[_i].bordersize, _entities_array[_i].label ) ) ;
                      _counter++ ;
                      if ( _counter % PROGRESS_REFRESH_AT_EACH == 0 )
                      {
                          self.postMessage( { 'id' : 'step',
                                              'opcode' : 0.2,
                                              'counter' : _counter,
                                              'entities_n' : _entities_n
                                            }
                                          );
                      }
                 }
    				 }
             break ;
			       default: break ;
    		 }

				 if ( _tmp_entities.length > 0 )
         self.postMessage( { 'id' : 'step',
                             'opcode' : 0.31,
                             'plane_type' : _plane_type,
                             'canvas_id' : _canvas_id,
                             'draw_entity' : _drawentity,
                             'entities_array' : _tmp_entities.clone()
                           }
                         );
         break ;
         case "stop" :
         _glob_multithread_running = 0 ;
         self.postMessage( { 'id' : 'stop' } );
  			 self.close();
				 self.terminate();
         break ;
         case "console.stop" :
         _glob_multithread_running = 0 ;
         self.postMessage( { 'id' : 'stop' } );
         break ;
         default: break ;
    }
}, false);