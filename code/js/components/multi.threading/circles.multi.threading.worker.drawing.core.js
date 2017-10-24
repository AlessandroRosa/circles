var _glob_multithread_path_to_root = "../../../../" ;
var _glob_multithread_path_to_complex = _glob_multithread_path_to_root ;
var _glob_multithread_path_to_circles = _glob_multithread_path_to_complex ;

var _glob_multithread_accuracy = 0 ;
var _glob_multithread_bunch_limit = 100 ;
var _glob_multithread_canvas_size = null ;
var _glob_multithread_construction_mode = 0 ;
var _glob_multithread_crash_words_packed = "" ;
var _glob_multithread_depth = 1 ;
var _glob_multithread_dict = [] ;
var _glob_multithread_dictionary_obj = null ;
var _glob_multithread_dict_create = 0 ;
var _glob_multithread_drawentity = 0 ;
var _glob_multithread_fz_formula = "" ;
var _glob_multithread_last_pt = null ;
var _glob_multithread_method = 0 ;
var _glob_multithread_operations_counter = 0 ;
var _glob_multithread_operations_mask = 0 ;
var _glob_multithread_operations_runner = 0 ;
var _glob_multithread_process = 0 ;
var _glob_multithread_repetends_array = [] ;
var _glob_multithread_rnd_probability_array = [];
var _glob_multithread_rnd_proc_rng_method = 0 ;
var _glob_multithread_running = 0 ;
var _glob_multithread_symbols_index_array = null ;
var _glob_multithread_use_last_pt = 0 ;
var _glob_multithread_working_plane_def = "" ;

self.addEventListener( 'message', function(e)
{
    var JS_FOLDER_SUPPORT = _glob_multithread_path_to_complex + "support/code/js/basements/" ;
    var JS_FOLDER_ALL_SHARED = _glob_multithread_path_to_complex + "support/code/js/shared/" ;
    var JS_FOLDER_COMPONENTS = _glob_multithread_path_to_circles + "code/js/components/" ;

    var data = e.data ;
    var msg_id = data.id, msg_lang = data.lang ;
    
    importScripts( JS_FOLDER_SUPPORT + "basics/a-basics/number.js" );
    importScripts( JS_FOLDER_SUPPORT + "basics/a-basics/string.js" );
    importScripts( JS_FOLDER_SUPPORT + "basics/a-basics/json.lib.js" );
    importScripts( JS_FOLDER_SUPPORT + "basics/array.js" );
    importScripts( JS_FOLDER_SUPPORT + "fns/fns.date.time.js" );
    importScripts( JS_FOLDER_SUPPORT + "fns/fns.math.js" );
    importScripts( JS_FOLDER_SUPPORT + "fns/fns.generals.js" );
    importScripts( JS_FOLDER_SUPPORT + "fns/fns.strings.js" );
    
    msg_lang = safe_string( msg_lang, "en" );

    importScripts( JS_FOLDER_SUPPORT + "classes/load/a-primitives/circle.class.js" );
    importScripts( JS_FOLDER_SUPPORT + "classes/load/a-primitives/line.class.js" );
    importScripts( JS_FOLDER_SUPPORT + "classes/load/a-primitives/2d.point.class.js" );
    importScripts( JS_FOLDER_SUPPORT + "classes/load/a-primitives/rect.class.js" );
    importScripts( JS_FOLDER_SUPPORT + "classes/load/b-basic.maths/complex.number.class.js" );
    importScripts( JS_FOLDER_SUPPORT + "classes/load/e-adv.maths/mobius.map.class.js" );
    importScripts( JS_FOLDER_ALL_SHARED + "math.js/math.min.js" );
    importScripts( JS_FOLDER_ALL_SHARED + "random.gens/rng.lib.js" );
    importScripts( JS_FOLDER_ALL_SHARED + "random.gens/mersenne.twister.lib.js" );
    importScripts( JS_FOLDER_ALL_SHARED + "random.gens/marsaglia.zaman.lib.js" );
    importScripts( JS_FOLDER_ALL_SHARED + "random.gens/cmwc.lib.js" );
    importScripts( JS_FOLDER_COMPONENTS + "langs/" + msg_lang + "/circles.lang.js" );
    importScripts( JS_FOLDER_COMPONENTS + "globals/defaults/circles.defaults.js" );
    importScripts( JS_FOLDER_COMPONENTS + "globals/defs/circles.constants.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/objs/circles.dictionary.obj.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/objs/circles.item.obj.js" );
    importScripts( JS_FOLDER_COMPONENTS + "globals/defs/circles.colors.palette.js" );

    importScripts( JS_FOLDER_COMPONENTS + "globals/vars/circles.array.vars.js" );
    importScripts( JS_FOLDER_COMPONENTS + "globals/vars/circles.colors.vars.js" );
    importScripts( JS_FOLDER_COMPONENTS + "globals/vars/circles.dictionary.vars.js" );
    importScripts( JS_FOLDER_COMPONENTS + "globals/vars/circles.general.vars.js" );
    importScripts( JS_FOLDER_COMPONENTS + "globals/vars/circles.items.vars.js" );

    importScripts( JS_FOLDER_COMPONENTS + "globals/init/circles.init.objs.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/framework/bars/progress.bar/circles.forms.progress.bar.lib.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/dict/circles.dict.lib.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/finders/circles.finders.lib.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/generals/circles.generals.misc.lib.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/generals/circles.generals.defs.lib.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/items/gens.set/circles.gens.set.lib.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/items/init/circles.items.init.lib.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/symbols/circles.repetends.lib.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/symbols/circles.alphabet.lib.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/symbols/circles.symbols.lib.js" );
    importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/symbols/circles.word.lib.js" );

    switch ( msg_id )
    {
         case "init" :
         var method = safe_int( data.method, METHOD_NONE ), process = safe_int( data.process, PROCESS_NONE );
         var w = safe_int( data.w, 0 ), h = safe_int( data.h, 0 );
         CIRCLESobjectsINIT(2);
         switch( method )
         {
            case METHOD_INVERSION:
            importScripts( JS_FOLDER_COMPONENTS + "multi.threading/drawing.methods/inversion/circles.methods.inversion.dictionary.multi.thread.js" );
            importScripts( JS_FOLDER_COMPONENTS + "multi.threading/drawing.methods/inversion/circles.methods.inversion.multi.thread.js" );
            break ;
            case METHOD_ALGEBRAIC:
            importScripts( JS_FOLDER_COMPONENTS + "multi.threading/drawing.methods/algebraic/circles.methods.algebraic.fns.multi.thread.js" );
            importScripts( JS_FOLDER_COMPONENTS + "multi.threading/drawing.methods/algebraic/circles.methods.algebraic.dictionary.multi.thread.js" );
            importScripts( JS_FOLDER_COMPONENTS + "multi.threading/drawing.methods/algebraic/circles.methods.algebraic.breadthfirst.inputfp.js" );
            importScripts( JS_FOLDER_COMPONENTS + "multi.threading/drawing.methods/algebraic/circles.methods.algebraic.indexsearch.inputfp.js" );
            importScripts( JS_FOLDER_COMPONENTS + "multi.threading/drawing.methods/algebraic/circles.methods.algebraic.random.inputfp.multi.thread.js" );
            break ;
         }
            
         _glob_multithread_running = 1 ;
         _glob_multithread_operations_counter = _glob_multithread_operations_runner = 0 ;
         self.postMessage( { 'id' : 'init',
                             'method' : method, 'process' : process,
                             'w' : w, 'h' : h } );
         break ;
         case "start" :
         var _config = data.config.split( "@" );
         var _items_array = [];

				 _glob_multithread_fz_formula = safe_string( data.fz_formula, "" ) ;
         _glob_multithread_dictionary_obj = new dictionary();
				 _glob_multithread_dictionary_obj.init_from_obj( data.dictionary );
         _glob_multithread_crash_words_packed = ( data.dict_init_settings.split( "@" ) )[4] ;
         _glob_multithread_canvas_size = data.canvas_size ;
         _glob_multithread_running = YES ;
         _glob_multithread_method = safe_int( _config[0], METHOD_NONE );
         _glob_multithread_process = safe_int( _config[1], PROCESS_BREADTHFIRST );
         _glob_multithread_construction_mode = safe_int( _config[2], CONSTRUCTION_TILING );
         _glob_multithread_dict_create = safe_int( data.dict_create, NO );
         _glob_multithread_operations_counter = _glob_multithread_operations_runner = 0 ;
         _glob_multithread_working_plane_def = data.workingplane_def ;
         _glob_multithread_last_pt = data.last_pt == null ? null : new point( data.last_pt.real, data.last_pt.imag ) ;
         _glob_multithread_use_last_pt = safe_int( data.use_last_pt, 0 ) ;
            
         _glob_multithread_symbols_index_array = [] ;
         var _tmp_array = data.symbols_index_array.split( "@" ), _chunk_array, _symbol, _index;
         for( var _i = 0 ; _i < _tmp_array.length ; _i++ )
         {
             _chunk_array = _tmp_array[_i].split( "|" );
             _symbol = _chunk_array[0], _index = _chunk_array[1] ;
             _glob_multithread_symbols_index_array[_symbol] = _index ;
         }

         _glob_multithread_accuracy = safe_int( data.accuracy, 2 ) ;
         _glob_multithread_depth = safe_int( data.depth, 1 );
         _glob_multithread_drawentity = safe_int( data.drawentity, DRAWENTITY_ISOMETRIC_CIRCLE );

         // need to instantiate objects again to use their member functions
         var _n_data = data.items.length, ITEM ;
         for( var i = 0 ; i < _n_data ; i++ )
         {
              ITEM = new item_obj();
              if ( data.items[i] != null )
              {
                  ITEM.init_from_obj( data.items[i] );
                  _items_array.push( ITEM );
              }
         }
         
         var probability_pack = data.probability_pack ;
         _glob_multithread_rnd_proc_rng_method = data.probability_rng_method ;
         _glob_multithread_rnd_probability_array = ( probability_pack.includes( "@" ) ) ? probability_pack.split( "@" ) : [] ;
         if ( _glob_multithread_rnd_probability_array.length == 0 )
         {
              var _items_n = circles_lib_count_items();
              var _p = 1.0 / _items_n ;
              for( var _i = 0 ; _i < _items_n ; _i++ ) _glob_multithread_rnd_probability_array.push( _p );
         }

         var objs = { 'items' : _items_array, 'palette' : _glob_palette_array } ;
         var _packing_tmp = [];
         for( var _i = 0 ; _i < data.inputfixedpts.length ; _i++ ) _packing_tmp.push( data.inputfixedpts[_i].x + "@" + data.inputfixedpts[_i].y );
         _packing_tmp = _packing_tmp.unique();
         var _packed_inputfixedpts = _packing_tmp.join( "|" );

         _glob_multithread_operations_mask = data.operations_mask ;
         _glob_multithread_repetends_array = [] ;
         // arranging repetends data
         if ( data.repetends.includes( "|" ) )
         {
		         var _packed_reps_chunks = data.repetends.split( "|" ), _token_array ;
		         var _termination, _rep, _array_ref = [] ;
		         for( var _c = 0 ; _c < _packed_reps_chunks.length ; _c++ )
		         {
		             _token_array = _packed_reps_chunks[ _c ].split( "@" );
		             _termination = _token_array[0], _rep = _token_array[1] ;
		             if ( !is_array( _array_ref[ _termination ] ) ) _array_ref[ _termination ] = [] ;
								 _array_ref[ _termination ].push( _rep );
						 }
		         _glob_multithread_repetends_array = _array_ref.clone_associative();
         }

         var settings = { 'alphabet_packed' : data.alphabet_packed,
                          'config' : data.config,
                          'construction_mode' : _glob_multithread_construction_mode,
                          'depth' : safe_int( data.depth, 1 ),
                          'dict_create' : _glob_multithread_dict_create,
                          'dict_init_settings_packed' : data.dict_init_settings,
						  'dict_process' : data.dict_process,
                          'dist_tolerance' : safe_float( data.dist_tolerance, DEFAULT_DISTANCE_TOLERANCE ),
                          'disk_visibility_radius' : data.disk_visibility_radius,
                          'drawentity' : _glob_multithread_drawentity,
                          'inputfixedpts' : _packed_inputfixedpts,
                          'input_dict' : data.dict,
                          'gens_model' : data.gens_model,
                          'gens_symbols_map' : data.gens_symbols_map,
                          'last_pt' : _glob_multithread_last_pt,
                          'left_up_pt' : data.left_up_pt,
                          'operations_mask' : _glob_multithread_operations_mask,
                          'probability_rng_method' : _glob_multithread_rnd_proc_rng_method,
                          'right_down_pt' : data.right_down_pt,
                          'rnd_warmup' : data.rnd_warmup,
                          'rnd_reps_threshold' : data.rnd_reps_threshold,
                          'rnd_reps_depth' : data.rnd_reps_depth,
                          'use_last_pt' : _glob_multithread_use_last_pt
                        } ;

         self.postMessage( { 'id' : 'start', 'method' : safe_int( _config[0], METHOD_NONE ), 'settings': settings } );

         switch( safe_int( _config[0], METHOD_NONE ) )
         {
             case METHOD_INVERSION: CIRCLESdrawPROCESSbyINVERSION( objs, settings ); break ;
             case METHOD_ALGEBRAIC: CIRCLESalgebraicSTART( objs, settings ); break ;
         }
         
         self.postMessage( { 'id' : 'finish',
                             'callerid' : data.callerid,
				 										 'method' : safe_int( _config[0], METHOD_NONE ),
														 'depth' : safe_int( data.depth, 1 ),
														 'dict' : _glob_multithread_dictionary_obj.sliced_dictionary } );
         break ;
         case "stop" :
         _glob_multithread_running = 0 ;
         _glob_multithread_operations_counter = _glob_multithread_operations_runner = 0 ;
         _glob_multithread_dictionary_obj.stop();
         self.postMessage( { 'id' : 'stop', 'method' : method, 'console' : 0 } );
  			 self.close();
				 self.terminate();
         break ;
         case "console.stop" :
         _glob_multithread_running = 0 ;
         _glob_multithread_operations_counter = _glob_multithread_operations_runner = 0 ;
         _glob_multithread_dictionary_obj.stop();
         self.postMessage( { 'id' : 'stop', 'method' : method, 'console' : 1 } );
         break ;
	       default: break ;
    }
}, false);