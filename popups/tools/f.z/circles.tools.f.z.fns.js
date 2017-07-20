function CIRCLEStoolsFZstop()
{
    _glob_inline_worker.stop();
    $( "#CIRCLEStoolsFZstopBTN" ).get(0).setAttribute( "class", "link_rounded_dead" );
    $( "#CIRCLEStoolsFZstopBTN" ).unbind( "click" ) ;

    $( "#CIRCLEStoolsFZprocessREPORT" ).html( "<SPAN STYLE=\"color:"+COLOR_INFO+";\">Process has been halted by user</SPAN>" ) ;
    setTimeout( function(){ $( "#CIRCLEStoolsFZprocessREPORT" ).html( "" ) ; }) ;
}

function CIRCLEStoolsFZrender() { circles_lib_canvas_process_ask(YES,NO,_glob_target_plane,YES,YES,CHECK); }
function CIRCLEStoolsFZapply()
{
    _glob_volatile_settings['f.z.formula'] = CIRCLEStoolsFZformula = $( "#CIRCLEStoolsFZformulaEDIT" ).val().trim() ;
    CIRCLEStoolsFZpack( CIRCLEStoolsFZformula ) ;
    if ( CIRCLEStoolsFZformula.length > 0 )
    {
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Formula has been input with success", "CIRCLEStoolsFZoutMSG" ) ;
        $( "#CIRCLEStoolsFZprocessREPORT" ).html( "Redraw is faster but returns rougher diagrams,<br>while Render is slower but guarantees finer results" ) ;
        setTimeout( function(){ $( "#CIRCLEStoolsFZprocessREPORT" ).html( "" ) ; }) ;
    }
    else
    {
        _glob_volatile_settings['fz.formula.packed'] = "" ;
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Formula has been erased with success", "CIRCLEStoolsFZoutMSG" ) ;
    }
    
    $( "#CIRCLEStoolsFZapplyBTN" ).css( "color", "black" );
    $( "#CIRCLEStoolsFZredrawBTN" ).css( "color", ( CIRCLEStoolsFZformula.length > 0 ? "red" : "black" ) );
    $( "#CIRCLEStoolsFZrenderBTN" ).css( "color", "red" );
}

function CIRCLEStoolsFZmemo()
{
    var _formula = $( "#CIRCLEStoolsFZformulaEDIT" ).val().trim() ;
    if ( _formula.length > 0 )
    {
        if ( !is_array( _glob_persistent_settings['f.z.memo'] ) ) _glob_persistent_settings['f.z.memo'] = [] ;
        if ( _glob_persistent_settings['f.z.memo'].includes( _formula ) )
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "This formula has already been saved", "CIRCLEStoolsFZoutMSG" ) ;
        else
        {
            _glob_volatile_settings['f.z.formula'] = CIRCLEStoolsFZformula = _formula ;
            _glob_persistent_settings['f.z.memo'].push( _formula );
            circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Formula has been saved with success", "CIRCLEStoolsFZoutMSG" ) ;
            $( "#CIRCLEStoolsFZapplyBTN" ).css( "color", "black" );
            $( "#CIRCLEStoolsFZredrawBTN" ).css( "color", "red" );
            $( "#CIRCLEStoolsFZrenderBTN" ).css( "color", "red" );
        }
    }
    else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Formula has been saved with success", "CIRCLEStoolsFZoutMSG" ) ;
}

function CIRCLEStoolsFZclean()
{
    if ( confirm( "Confirm to clean the textbox ?" ) )
    {
        $( "#CIRCLEStoolsFZformulaEDIT" ).val( "" ) ;
        $( "#CIRCLEStoolsFZapplyBTN" ).css( "color", "red" );
    }
}

function CIRCLEStoolsFZpack( _formula )
{
        _glob_volatile_settings['f.z.formula'] = _formula ;
        var _test = _glob_rec_canvas_entities_array.test( function( _obj ){ return _obj.center != null || _obj.x != null ; } );
        var _find_it = "z" ;
        var _pos_array = _formula.matching_positions( _find_it, NO, YES, NO, NO ) ;
        if ( _pos_array.length == 0 )
        {
            circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Missing unknown 'z' specification inside the input formula", "CIRCLEStoolsFZoutMSG" ) ;
            return NO ;
        }
        else if ( !_test )
        {
            circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Invalid input entities: they should be points or disks", "CIRCLEStoolsFZoutMSG" ) ;
            return NO ;
        }
        else
        {
						var _prev_pos = UNDET, _curr_pos = UNDET, _ret_formula = "", _token ;
            // prevent unparsable expression nz - where n is any given numerical constant - and turn it into n*z
            var _err_pos = _formula.matching_positions( "[0-9]\z+", NO, NO, NO, NO ) ;
            if ( safe_size( _err_pos, 0 ) > 0 )
            {
                _ret_formula = "" ;
                for( var _i = 0 ; _i < _pos_array.length ; _i++ )
                {
                    _curr_pos = _pos_array[_i] ;
                    if ( _i == 0 ) _token = _formula.substring( 0, _curr_pos ) + ( _curr_pos != 0 ? "*z" : "z" ) ;
                    else
                    {
                        _prev_pos = _pos_array[_i-1] ;
                        _token = _formula.substring( _prev_pos+1, _curr_pos ) + "*z" ;
                    }
                    _ret_formula += _token ;
                }
                
                _token = _formula.substring( _pos_array[_i-1]+1, _formula.length ) ;
                _ret_formula += _token ;
                _formula = _ret_formula ;
                _ret_formula = "" ;
            }
            
            // pack unknown "z" into "[z]": this expression can be easily and unambigously detected
            _find_it = "["+_find_it+"]" ;
            for( var _i = 0 ; _i < _pos_array.length ; _i++ )
            {
                _curr_pos = _pos_array[_i] ;
                if ( _i == 0 ) _token = _formula.substring( 0, _curr_pos ) + _find_it ;
                else
                {
                    _prev_pos = _pos_array[_i-1] ;
                    _token = _formula.substring( _prev_pos+1, _curr_pos ) + _find_it ;
                }
                _ret_formula += _token ;
            }

            _token = _formula.substring( _pos_array[_i-1]+1, _formula.length ) ;
            _ret_formula += _token ;
            _glob_volatile_settings['fz.formula.packed'] = CIRCLEStoolsFZformula = _ret_formula ;
            
            $( "#CIRCLEStoolsFZapplyBTN" ).css( "color", "black" );
            return YES ;
        }
}

function CIRCLEStoolsFZredraw()
{
    var _formula = CIRCLEStoolsFZformula = $( "#CIRCLEStoolsFZformulaEDIT" ).val();
    if ( safe_size( _formula, 0 ) == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Missing input complex formula", "CIRCLEStoolsFZoutMSG" ) ;
    else if ( _glob_rec_canvas_entities_array.size_associative() == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Missing input entities: please, render something first", "CIRCLEStoolsFZoutMSG" ) ;
    else
    {
        if ( CIRCLEStoolsFZpack( _formula ) )
        {
        		var _find_it = "[z]" ;
            circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Running the re-mapping process", "CIRCLEStoolsFZoutMSG" ) ;
            var JS_FOLDER_COMPONENTS = "code/js/components/" ;
            var JS_FOLDER_FZ = "popups/tools/f.z/" ;
            var MULTITHREAD_FOLDER = JS_FOLDER_FZ + "multi.threading/" ;
		        var JS_FOLDER_ALL_PROJECTS = _glob_path_to_support + "code/js/all.projects/" ;
		        var JS_FOLDER_SHARED = _glob_path_to_support + "code/js/shared/" ;
		        var JS_FOLDER_CLASSES = JS_FOLDER_ALL_PROJECTS + "classes/load/" ;
             // multi-tasking custom obj
            $.ajaxSetup( {async:false} );
            if ( check_file_exists( JS_FOLDER_FZ + "circles.tools.f.z.worker.mtsk" ) )
            {
 		            var _code_array = [];
 		            // load the multi-tasking obj code
 		            _code_array.push( $.getScript( JS_FOLDER_FZ + "circles.tools.f.z.worker.mtsk",
																	function( response, status, jqxhr )
			                            { 
				                             if ( status.toLowerCase().stricmp( "success" ) ) return response ;
 				                             else return NO ;
			                            } ).responseText
 																);

    		        // join the above code into one piece and give it to the worker
    		        var _inline_worker_code = _code_array.join( _glob_crlf );
    		        // import this code for worker obj to process input data
    		        _glob_inline_worker = new inline_worker( _inline_worker_code,
    		                                                 [ JS_FOLDER_COMPONENTS + "globals/defs/circles.constants.js",
    		                                                   JS_FOLDER_FZ + "circles.tools.f.z.process.mtsk",
    		                                                   JS_FOLDER_ALL_PROJECTS + "basics/a-basics/number.js",
    		                                                   JS_FOLDER_ALL_PROJECTS + "basics/a-basics/string.js",
																											     JS_FOLDER_ALL_PROJECTS + "basics/a-basics/json.lib.js",
                                                           JS_FOLDER_ALL_PROJECTS + "basics/array.js",
    		                                                   JS_FOLDER_CLASSES + "a-primitives/2d.point.class.js",
    		                                                   JS_FOLDER_CLASSES + "b-basic.maths/complex.number.class.js",
                                                           JS_FOLDER_SHARED + "math.js/math.min.js"
    		                                                  ] );
                // feed input data
 		            _glob_inline_worker.init_vars( { out_channel : OUTPUT_SCREEN,
 		                                             formula : _glob_volatile_settings['fz.formula.packed'],
                                                 find_it : _find_it,
 		                                             complex_pts_array : _glob_rec_canvas_entities_array,
                                                 output_ctrl_id : "CIRCLEStoolsFZprocessREPORT"
 		                                           } );
 		            // go !
                $( "#CIRCLEStoolsFZstopBTN" ).get(0).setAttribute( "class", "link_rounded" );
                $( "#CIRCLEStoolsFZstopBTN" ).bind( "click", function(){ CIRCLEStoolsFZstop() ; } ) ;
 		            _glob_inline_worker.run();
            }
            else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Missing critical code component for re-mapping", "CIRCLEStoolsFZoutMSG" ) ;
        }
    }
}