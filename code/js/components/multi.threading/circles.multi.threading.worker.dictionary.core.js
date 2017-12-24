var _glob_original_dict = [] ;
var _glob_multithread_running = 0 ;
var _glob_multithread_path_to_root = "../../../../" ;
var _glob_multithread_path_to_complex = _glob_multithread_path_to_root ;
var _glob_multithread_path_to_circles = _glob_multithread_path_to_complex ;
var _glob_multithread_crash_words_packed = "" ;
var _glob_multithread_dictionary_obj = null ;

self.addEventListener( 'message', function(e)
{
      var JS_FOLDER_SUPPORT = _glob_multithread_path_to_complex + "support/code/js/basements/" ;
      var JS_FOLDER_COMPONENTS = _glob_multithread_path_to_circles + "code/js/components/" ;
      var data = e.data ;
      var msg_id = data.id ;
      var msg_lang = data.lang ;

    importScripts( JS_FOLDER_COMPONENTS + "globals/defs/circles.constants.js" );
    importScripts( JS_FOLDER_COMPONENTS + "globals/defaults/circles.defaults.js" );
      importScripts( JS_FOLDER_SUPPORT + "basics/a-basics/number.js" );
      importScripts( JS_FOLDER_SUPPORT + "basics/a-basics/string.js" );
      importScripts( JS_FOLDER_SUPPORT + "basics/a-basics/json.lib.js" );
      importScripts( JS_FOLDER_SUPPORT + "basics/array.js" );
      importScripts( JS_FOLDER_SUPPORT + "fns/fns.date.time.js" );
      importScripts( JS_FOLDER_SUPPORT + "fns/fns.math.js" );
      importScripts( JS_FOLDER_SUPPORT + "fns/fns.generals.js" );
      importScripts( JS_FOLDER_SUPPORT + "fns/fns.strings.js" );
    importScripts( JS_FOLDER_SUPPORT + "fns/fns.system.js" );
      importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/objs/circles.dictionary.obj.js" );

      importScripts( JS_FOLDER_COMPONENTS + "globals/defs/circles.colors.palette.js" );
      importScripts( JS_FOLDER_COMPONENTS + "globals/vars/circles.colors.vars.js" );
      importScripts( JS_FOLDER_COMPONENTS + "globals/vars/circles.dictionary.vars.js" );
      importScripts( JS_FOLDER_COMPONENTS + "globals/vars/circles.general.vars.js" );

      importScripts( JS_FOLDER_COMPONENTS + "globals/init/circles.init.objs.js" );
      importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/dict/circles.dict.lib.js" );
      importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/generals/circles.generals.misc.lib.js" );
      importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/items/init/circles.items.init.lib.js" );
      importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/symbols/circles.repetends.lib.js" );
      importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/symbols/circles.alphabet.lib.js" );
      importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/symbols/circles.symbols.lib.js" );
      importScripts( JS_FOLDER_COMPONENTS + "libs/foundations/symbols/circles.word.lib.js" );

      switch ( msg_id )
      {
          case "start" :
          var _ret_chunk = null ;
          var _workarea = safe_float( data.workarea, 0 );
          var _opcode = safe_float( data.opcode, 0 );
          var _dict_size_before = is_array( _glob_original_dict ) ? circles_lib_count_dict() : 0 ;
				  var _benchmark_start = microtime(1);
          var _caller_id = data.callerid ;
  				CIRCLESobjectsINIT(2);
		
					if ( _opcode == 0.1 ) // dictionary generation
					{
							var _depth = safe_int( data.depth, 1 );
							var _method = safe_int( data.method, METHOD_NONE );
							var _dict_process = safe_int( data.dict_process, _DICTIONARY_NONE_PROCESS );
							var _word_type = safe_int( data.wordtype, _DICTIONARY_NOT_REDUCED_WORDS );
							var _process = safe_int( data.process, PROCESS_BREADTHFIRST );
							var _construction_mode = safe_int( data.constructionmode, CONSTRUCTION_NONE );
							var _packedalphabet = data.packedalphabet ;
							var _alphabet = ( _packedalphabet.length > 0 && _packedalphabet.includes( "@" ) ) ? _packedalphabet.split( "@" ) : [] ;
							var _allow_repetition = safe_int( data.allow_repetition, 0 );
							var _compute_inverse = safe_int( data.compute_inverse, 0 );
							var _dict_init_settings_array = data.dict_init_settings.split( "@" );
	            		_glob_original_dict = data.dict ;

							_glob_multithread_dictionary_obj = new dictionary();
							_glob_multithread_dictionary_obj.init_from_obj( data.dictionary );
								 
              var _startINDEX = 0 ;
              var _use_reduced_words = safe_int( _dict_init_settings_array[_startINDEX], 0 );
                  _startINDEX++ ;
              var _allow_repetition = safe_int( _dict_init_settings_array[_startINDEX], 0 );
                  _startINDEX++ ;
              var _compute_inv_symbol = safe_int( _dict_init_settings_array[_startINDEX], 0 );
                  _startINDEX++ ;
              var _longest_words_only = safe_int( _dict_init_settings_array[_startINDEX], 0 );
                  _startINDEX++ ;
              var _crash_words_packed = _dict_init_settings_array[_startINDEX] ;
              var _dict = circles_lib_dict_progressive_generation( _glob_multithread_dictionary_obj, _alphabet, _depth, _use_reduced_words, _construction_mode, _allow_repetition, _compute_inv_symbol, _crash_words_packed, 1 );
								 
							_ret_chunk = [ RET_OK, "Build complete", _dict ] ;
					}
          else if ( _opcode >= 1.1 && _opcode <= 3.3 )
          {
		          var _action_id = safe_float( data.actionid, UNDET );
		          var _length_from = safe_int( data.lengthfrom, UNDET );
		          var _length_to = safe_int( data.lengthto, UNDET );
		          var _first_n = safe_int( data.first_n, UNDET );
		          var _last_n = safe_int( data.last_n, UNDET );
		          var _start_with = data.start_with ;
		          var _includes = data.includes ;
		          var _end_with = data.end_with ;
		          var _token_str = data.token_str ;
		          		_glob_original_dict = data.dict ;
		            
							if ( _opcode == 1.1 ) _ret_chunk = circles_lib_dict_work_on_length( _glob_original_dict, _opcode, _action_id, _length_from, _length_to, 1 );
		          else if ( _opcode.is_one_of ( 3.1, 3.2, 3.3 ) ) _ret_chunk = circles_lib_dict_work_on_words( _glob_original_dict, _opcode, _action_id, _start_with, _includes, _end_with, 1 );
					}
					else if ( _opcode == 4.0 )
					{
		          var _action_id = safe_float( data.actionid, UNDET );
		          		_glob_original_dict = data.dict ;
							_ret_chunk = circles_lib_dict_invert_words( _glob_original_dict, _opcode, _action_id, 1 );
					}

					var _benchmark_end = microtime(1);
          var _dict_size_after = is_array( _glob_original_dict ) ? circles_lib_count_dict() : 0 ;
          self.postMessage( { 'id': "benchmark",
                              'start': _benchmark_start,
                              'end': _benchmark_end,
                              'operations' : Math.abs( _dict_size_before - _dict_size_after )
                            } );

				  var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], UNDET ) : UNDET ;
					var _ret_text = is_array( _ret_chunk ) ? _ret_chunk[1] : "Error unknown" ;
          var _ret_dict = is_array( _ret_chunk ) ? _ret_chunk[2] : [] ;
					var _message_id = _ret_id < 0 ? "err" : "finish" ;
          self.postMessage( { 'id' : _message_id,
                              'callerid' : _caller_id,
                              'errno' : _ret_id,
                              'errtext' : _ret_text,
                              'dict' : _ret_dict
                            } );
          break ;
          case "stop" :
          _glob_multithread_running = 0 ;
          _glob_multithread_operations_counter = _glob_multithread_operations_runner = 0 ;
          _glob_multithread_dictionary_obj.stop();
          $("[id$=renderBTN]").css( { "color" : DEFAULT_COLOR_STD } );
          $("[id$=renderBTN]").filter( function(){ return !this.id.start_with( "PLUGIN" ) } ).attr( "class", "link_rounded" );
          self.postMessage( { 'id' : 'stop',
                              'callerid' : _caller_id,
                              'method' : method,
                              'console' : NO
                            } );
          break ;
          case "console.stop" :
          _glob_multithread_running = 0 ;
          _glob_multithread_operations_counter = _glob_multithread_operations_runner = 0 ;
          _glob_multithread_dictionary_obj.stop();
          $("[id$=renderBTN]").css( { "color" : DEFAULT_COLOR_STD } );
          $("[id$=renderBTN]").filter( function(){ return !this.id.start_with( "PLUGIN" ) } ).attr( "class", "link_rounded" );
          self.postMessage( { 'id' : 'stop',
                              'callerid' : _caller_id,
                              'method' : method,
                              'console' : NO
                            } );
          break ;
	        default: break ;
     }
}, false);