function CIRCLESmultithreadingADDdictionaryLISTENER()
{
		 _glob_worker.addEventListener( 'message', function(e)
		 {
		     var msg = e.data ;
		     switch( msg.id )
		     {
		        case "benchmark":
		        _glob_benchmark_start_microtime = msg.start ;
		        _glob_benchmark_end_microtime = msg.end ;
		        _glob_benchmark_operations = msg.operations ;
		        break ;
		        case "err":
		        var err_no = safe_float( msg.errno, 0 );
		        var err_text = msg.errtext ;
            var err_caller_id = msg.callerid ;
		        _glob_original_dict = _glob_dict_processor.sliced_dictionary = msg.dict.clone();
		        SPLASH( "", HIDE );
            circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, err_text, _glob_app );
            $('[id$=renderBTN]').css('color',DEFAULT_COLOR_STD);
            $("[id$=renderBTN]").filter( function(){ return !this.id.start_with( "PLUGIN" ) } ).attr( "class", "link_rounded" );
		        break ;
		        case "finish" :
		        SPLASH( "", HIDE );
		        var err_no = safe_float( msg.errno, 0 );
		        var err_text = safe_string( msg.errtext, "" );
            var err_caller_id = msg.callerid ;
		        _glob_worker_lock = NO ;

            _glob_dict_processor.sliced_dictionary = is_array( msg.dict ) ? ( msg.dict.is_multidimensional() ? msg.dict.clone() : msg.dict.dismember( CIRCLESformsDICTIONARYmax_entries_per_page ).clone() ) : [] ;
            _glob_original_dict = _glob_dict_processor.sliced_dictionary ;
            
		        if ( circles_lib_popup_exists( err_caller_id, POPUP_SEARCH_BY_CAPTION ) != UNFOUND )
						circles_lib_popup_dispatcher_unicast_message( 'dictionary', "forms", POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS );

            $('[id$=renderBTN]').css('color',DEFAULT_COLOR_STD);
            $("[id$=renderBTN]").filter( function(){ return !this.id.start_with( "PLUGIN" ) } ).attr( "class", "link_rounded" );
		        break ;
		        case "stop":
						_glob_worker.terminate();
						_glob_worker_lock = NO ;
            $('[id$=renderBTN]').css('color',DEFAULT_COLOR_STD);
            $("[id$=renderBTN]").filter( function(){ return !this.id.start_with( "PLUGIN" ) } ).attr( "class", "link_rounded" );
		        break ;
		        default: break ;
		     }
		
		 }, false );
}