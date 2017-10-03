function CIRCLEStoolsFUNDAMENTALREGIONprocessSTART()
{

}

function CIRCLEStoolsFUNDAMENTALREGIONprocessEND()
{

}

function CIRCLEStoolsFUNDAMENTALREGIONprocessSTOP()
{

}

function CIRCLEStoolsFUNDAMENTALREGIONprocessUPDATE()
{

}

function CIRCLEStoolsFUNDAMENTALREGIONprocess()
{
    var _features = [];
        _features['start_fn'] = CIRCLEStoolsFUNDAMENTALREGIONprocessSTART.myname();
        _features['end_fn'] = CIRCLEStoolsFUNDAMENTALREGIONprocessEND.myname();
        _features['stop_fn'] = CIRCLEStoolsFUNDAMENTALREGIONprocessSTOP.myname();
        _features['updates_fn'] = CIRCLEStoolsFUNDAMENTALREGIONprocessUPDATE.myname();

    var _array = [] ;
    $.each( _glob_seeds_array, function ( _i, _item_obj ) { _array.push( _item_obj.map.pack() + "@" + _item_obj.symbol ) ; } ) ;
        _features['seeds'] = _array.join( "#" ) ;

        _features['words'] = CIRCLEStoolsFUNDAMENTALREGIONwords.join( "@" ) ;
        _features['proc'] = $( "#CIRCLEStoolsFUNDAMENTALREGIONprocedureCOMBO" ).val() ;
    var _depth = safe_int( $( "#CIRCLEStoolsFUNDAMENTALREGIONdepth" ).val(), _glob_depth ) ;
        _features['depth'] = Math.max( 0, _depth ) ;

    var MULTITHREAD_OBJ_PATH = "plugins/tools/fundamental.region/" ;
    var JS_FOLDER_SUPPORT = "support/code/js/basements/" ;
    var JS_FOLDER_CLASSES = JS_FOLDER_SUPPORT + "classes/load/" ;

    if ( check_file_exists( MULTITHREAD_FOLDER + "fundamental.region.worker.mltsk" ) )
    {
        $.ajaxSetup( {async:false} );
        var _code_array = [];
        // load the multi-tasking obj code
        _code_array.push( $.getScript( MULTITHREAD_FOLDER + "fundamental.region.worker.mltsk",
    																		function( response, status, jqxhr )
    				                            { 
    				                                if ( status.toLowerCase().stricmp( "success" ) ) return response ;
    				                                else return NO ;
    				                            }
    											           ).responseText
    										);
        // join the above code into one piece and give it to the worker
        var _inline_worker_code = _code_array.join( _glob_crlf );
        // import this code for worker obj to process input data
        _glob_inline_worker = new inline_worker( _inline_worker_code,
                                                 [ JS_FOLDER_COMPONENTS + "globals/defs/circles.constants.js",
                                                   MULTITHREAD_FOLDER + "discreteness.locus.process.mltsk",
                                                   JS_FOLDER_SUPPORT + "fns/fns.math.js",
                                                   JS_FOLDER_SUPPORT + "basics/a-basics/number.js",
                                                   JS_FOLDER_SUPPORT + "basics/a-basics/string.js",
																							     JS_FOLDER_SUPPORT + "basics/a-basics/json.lib.js",
                                                   JS_FOLDER_SUPPORT + "basics/array.js",
                                                   JS_FOLDER_CLASSES + "a-primitives/2d.point.class.js",
                                                   JS_FOLDER_CLASSES + "a-primitives/circle.class.js",
                                                   JS_FOLDER_CLASSES + "b-basic.maths/complex.number.class.js",
                                                   JS_FOLDER_CLASSES + "e-adv.maths/mobius.map.class.js",
                                                   JS_FOLDER_COMPONENTS + "libs/foundations/symbols/circles.word.lib.js"
                                                ] );
        // feed input data
        _glob_inline_worker.init_vars( { out_channel : OUTPUT_SCREEN,
                                         features : _features,
                                         crlf : _glob_crlf } );
        // go !
    		_glob_inline_worker.run();
    }
    else
    {
       var _msg = "Discreteness locus component is missing or corrupted component" ;
       circles_lib_log_add_entry( _msg, LOG_ERROR );
    }
}