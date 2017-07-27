function CIRCLESformsSCRIPTEDITORcodemanagerCOMPILEprocess( _silent )
{
		_silent = safe_int( _silent, NO );
    var _proj_array_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
		var _mod_label = CIRCLESformsSCRIPTEDITORmodulelabelCURRENT ;
		if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Module '"+(_mod_label.length>0?_mod_label:"unknown")+"' is currently pending.", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
    else if ( is_array( _proj_array_ref ) )
    {
        var _entries_n = safe_size( _proj_array_ref, 0 ), _selected_n = CIRCLESformsSCRIPTEDITORcodemanagerLISTcountSELECTED() ;
        var _all = _selected_n == _entries_n ? 1 : 0 ;
        if ( _entries_n > 0 && _selected_n > 0 )
        {
        		var _quantifier_str = _all ? "the whole" : _selected_n+" selected entr"+( _selected_n == 1 ? "y" : "ies" ) + " in " ;
            var _b_go = _silent ? YES : confirm( "Confirm to compile "+_quantifier_str+" project '"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"' ?" );
            if ( _b_go )
            {
               circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO, "--------- start of compiling proj '"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"' ---------", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
            	 CIRCLESformsSCRIPTEDITORcodemanagerDELETEcollectedOBJS( CIRCLESformsSCRIPTEDITORproject_collectedobjsCURRENT, YES ) ;

							 CIRCLESformsSCRIPTEDITORcompiledFLAG = CIRCLESformsSCRIPTEDITORcodemanagerCOMPILEloop();
							 $( "#CIRCLESformsSCRIPTEDITORcodeBTN" ).css( "color", CIRCLESformsSCRIPTEDITORcompiledFLAG ? "black" : "red" );
							 $( "#CIRCLESformsSCRIPTEDITORcompileBTN" ).css( "color", CIRCLESformsSCRIPTEDITORcompiledFLAG ? "black" : "red" );

							 CIRCLESformsSCRIPTEDITORcodemanagerCOLLECTIONprocess() ;
               circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO, "--------- end of compiling proj '"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"' ---------", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
						}
						else circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO, "Compiling has been halted by user", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
        }
        else if ( _selected_n == 0 ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Can't run: missing selected code files in proj '"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"'", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
        else if ( _entries_n == 0 ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Can't run: missing code files in proj '"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"'", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
    }
    else circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_CRITICAL, "Critical error: incoherent proj data", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerCOMPILEloop()
{
    var _proj_array_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
		var _label, _code, _run, _breakpoint, _msg, _compile_ret, _translated_code ;
		$.each( _proj_array_ref,
		        function( _i, _chunk )
		        {
		           _label = _chunk[0], _code = _chunk[1], _run = _chunk[2], _breakpoint = _chunk[3] ;
		           if ( _run )
		           {
		               _compile_ret = YES ;
		               CIRCLESformsSCRIPTEDITORglobalERRORflag = NO ;
                   _code = circles_lib_js_manager_pre_process_code( _code ) ;
                   if ( _breakpoint != UNFOUND )
                   {
                        _code = _code.split( /\r\n|\n/ ) ;
                        _code = _code.left( _breakpoint+1 ).join( _glob_crlf );
                        _msg = "<white>"+_label+"</white> <orange>compiled up to line breakpoint</orange> <white>"+(_breakpoint+1)+"</white>" ;
                        circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR, _msg, "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
                   }
							 		 _translated_code = circles_lib_js_manager_repo_code( _code ) ;
                   _translated_code = circles_lib_js_manager_post_process_code( _translated_code ) ;
                   _translated_code = _translated_code.replace( /([\;]{2,})+/gim, ";" );
                   // keep window.eval >> modules shall be compiled at the whole window/app context
		               try{ window.eval( _translated_code ) ; }
		               catch( _err )
		               {
		                  _msg = [ "<red>Fail to compile script  <snow>'"+_label+"' </snow></red>",
		                 					 "<red>Error " + _err.message + "</red>",
		                           _err.fileName ? "<red>Found in file '<white>"+err.fileName+"</white>' at line <white>" + _err.lineNumber + "</white></red>" : "",
                               "<orange>Translated code</orange>\n<gray>"+_translated_code+"</gray>"
														 ] ;
		                  circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR, _msg, "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		                  CIRCLESformsSCRIPTEDITORglobalERRORflag = YES, _compile_ret = NO ;
		               }

		               if ( !CIRCLESformsSCRIPTEDITORglobalERRORflag )
		               {
											$( "#CIRCLESformsSCRIPTEDITORstatus" + _i ).html( "" );
				              circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR, "<lime>File</lime> <white>"+_label+"</white> <lime>has been compiled with success</lime>", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
									 }
									 else
									 {
				              circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR, "<red>File</red> <white>"+_label+"</white> <red>includes errors</red>", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
 										  $( "#CIRCLESformsSCRIPTEDITORstatus" + _i ).html( "<IMG SRC=\""+_glob_path_to_img+"icons/halt/halt.icon.01.16x16.png\">" );
									 }
		           }
		        }
		      );
		if ( _compile_ret ) CIRCLESformsSCRIPTEDITORstatusCURRENT = PASSED ;
		return _compile_ret ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerCOMPILEflag( _checked, _entry_ref )
{
    var _proj_array_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
		var _index = circles_lib_js_manager_find_module_index( _entry_ref, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
		if ( _index != UNFOUND )
		{
				_proj_array_ref[_index][2] = _checked ? YES : NO ;
				var _all_selected = circles_lib_js_manager_scripts_all_modules_selected( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
				$( "#CIRCLESformsSCRIPTEDITORallCHECKBOX" ).prop( "checked", _all_selected ? true : false );
		}
		else
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_CRITICAL, "Critical error: incoherent data structure", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerCOLLECTIONprocess( _entry_label, _display_collection_list, _silent )
{
    _silent = safe_int( _silent, NO );
	  _entry_label = safe_string( _entry_label, "" ).trim() ;
		_display_collection_list = safe_int( _display_collection_list, NO );
		var _ret_chunk = circles_lib_js_manager_extract_code_from_proj( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT, _entry_label ) ;
		var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], 0 ) : 0, _whole_code = is_array( _ret_chunk ) ? _ret_chunk[1] : "" ;
		if ( _ret_id )
		{
		    var _whole_flag = _entry_label.length == 0 ? YES : NO ;
				if ( !_silent ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO, "Pre-processing "+(_entry_label.length>0? "entry "+_entry_label:" the whole code ")+" to collect objs", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		    var _vars_chunk = circles_lib_js_manager_detect_vars( _whole_code ) ;
		    var _vars = _vars_chunk[0], _possible_candidate_objs_count = _vars_chunk[1], _errors = _vars_chunk[2] ;
		    var _fns = circles_lib_js_manager_detect_fns( _whole_code ) ;
		    CIRCLESformsSCRIPTEDITORproject_collectedobjsCURRENT = _vars.concat( _fns ).clone();
		    var _objs_n = safe_size( CIRCLESformsSCRIPTEDITORproject_collectedobjsCURRENT, 0 );
				if ( !_silent )
				{
						var _msg = "" ;
						if ( _objs_n > 0 ) _msg = "<white>"+(_objs_n)+"</white> <green>obj"+(_objs_n==1?" has":"s have")+" been found and collected in " ;
						else _msg = "<orange>No objs have been detected in</orange>" ;
						
						_msg += _whole_flag ? "proj</green> <white>"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"</white>" : "file</green> <white>"+_entry_label+"</white>" ;
						circles_lib_output( OUTPUT_SCRIPT_EDITOR, _objs_n > 0 ? DISPATCH_MULTICOLOR : DISPATCH_INFO,
																_msg, "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
				}
		    if ( _objs_n > 0 && _display_collection_list ) CIRCLESformsSCRIPTEDITORcodemanagerDISPLAYcollectedOBJSlist( _entry_label ) ;
		    if ( _possible_candidate_objs_count > 0 && _possible_candidate_objs_count > _vars.length )
		    circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Warning ! There might be syntax errors or identifiers declaring inconsistent data", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		    if ( safe_size( _errors, 0 ) )
	   		$.each( _errors, function( _i, _err ) { circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_ERROR, "Error : " + _err, "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ; } ) ;
		}
		else if ( !_silent )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_CRITICAL, "Fail to parse input code for collecting objs", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		return _ret_id ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerDELETEcollectedOBJS( _array_ref, _silent )
{
		_silent = safe_int( _silent, NO );
    if ( !is_array( _array_ref ) ) _array_ref = CIRCLESformsSCRIPTEDITORproject_collectedobjsCURRENT ;
    if ( !is_array( _array_ref ) && !_silent ) 
    circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_ERROR, "Missing objs collection or invalid input data", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
    else
    {
    		var _n_entries = safe_size( _array_ref, 0 );
    		if ( _n_entries == 0 && !_silent )
    		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO, "Missing objs collection to be deleted", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
    		else
    		{
    				var _b_ok = _silent ? YES : confirm( "Confirm to delete the objs collection ?" ) ;
    				if ( _b_ok )
    				{
 						    if ( !_silent ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO, "Erasing "+_n_entries+" collected obj"+(_n_entries==1?"":"s"), "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
 								for( var _r = 0 ; _r < _array_ref.length ; _r++ ) eval( "window." + _array_ref[_r][1] + "=null;" );
 						    _array_ref.flush();
 						    if ( CIRCLESformsSCRIPTEDITORboxesCONTENTStypeARRAY['rightlower'] == CIRCLESformsSCRIPTEDITORcollectionCONSTANT )
 						    $( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).html( "" );
    				}
    		}
    }
}

function CIRCLESformsSCRIPTEDITORcodemanagerDUMPcollectedOBJ( _obj_id )
{
    var _out_text = "", _b_go = YES, _tmp_obj ;
    _obj_id = _obj_id.includes( "@" ) ? _obj_id.split( "@" ) : [ 0, _obj_id, 0 ] ;
    try{
          var _expr = "_tmp_obj = window." + _obj_id[1] + " ;" ;
          try { eval( _expr ) }
          catch( _err ){ circles_lib_error_obj_handler( _err ); } ;
          _out_text = dump( _tmp_obj, 0, YES ) ;
          _out_text = [ "<lightblue>"+_obj_id[1] + "</lightblue> <white>dumps to"+"</white>" ].concat( _out_text.split( "</br>" ).work( function( _e ) { return "<white>"+_e+"</white>" ; } ) ) ;
       }
    catch( _err )
		{
				_b_go = NO ;
				circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO, _err.message + "\nDump failure for collected obj " + _obj_id, "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		}
    if ( _b_go ) circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR, _out_text, "CIRCLESformsSCRIPTEDITORoutputTABLE", 1 ) ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerDISPLAYcollectedOBJSlist( _entry_label, _silent )
{
		_entry_label = safe_string( _entry_label, "" ).trim(), _silent = safe_int( _silent, NO );
		if ( safe_size( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT, 0 ) == 0 && !_silent )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO, "No project has been selected", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		else
		{
		    var _proj_array_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
		    if ( safe_size( _proj_array_ref, 0 ) == 0 && !_silent )
				circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO, "Can't display objs collection: the current project is empty", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
				else
				{
            var _objs_array_ref = CIRCLESformsSCRIPTEDITORproject_collectedobjsCURRENT ;
						var _objs_n = safe_size( _objs_array_ref, 0 );
						if ( _objs_n == 0 && !_silent )
            {
    						circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Missing objs collection", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
    						circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO, "Check objs collection again", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
            }
						else
            {
                var _whole_flag = _entry_label.length == 0 ? YES : NO, _tmp_data_container ;
                // entry selection yields a dump somewhere
                var _entry = [], _tmp_obj ;
                var HTMLcode = "<table>" ;
                    HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
                    HTMLcode += "<tr><td WIDTH=\"5\"></td><td COLSPAN=\"9\" STYLE=\"color:white;\"><span STYLE=\"color:yellow;\">"+_objs_n+"</SPAN> obj"+(_objs_n==1?" has":"s have")+" been found and collected in "+( _whole_flag ? "proj <span STYLE=\"color:yellow;\">"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"</SPAN>" : "file <span STYLE=\"color:yellow;\">"+_entry_label+"</SPAN>" )+"</td></tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                    HTMLcode += "<tr><td WIDTH=\"5\"></td><td COLSPAN=\"9\" STYLE=\"color:white;\">Select a row for dumping the obj</td></tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
                    HTMLcode += "<tr>" ;
                    HTMLcode += "<td COLSPAN=\"3\"></td>" ;
                    HTMLcode += "<td STYLE=\"color:lightblue;\">Type</td>" ;
                    HTMLcode += "<td></td>" ;
                    HTMLcode += "<td STYLE=\"color:white;\">ID</td>" ;
                    HTMLcode += "<td></td>" ;
                    HTMLcode += "<td STYLE=\"color:yellow;\">Class</td>" ;
                    HTMLcode += "<td></td>" ;
                    HTMLcode += "<td STYLE=\"color:orange;\">Init val/params</td>" ;
                    HTMLcode += "</tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                    
                for( var _i = 0 ; _i < _objs_n ; _i++ )
                {
                    HTMLcode += "<tr CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerDUMPcollectedOBJ('"+_objs_array_ref[_i].join("@")+"');\">" ;
                    HTMLcode += "<td WIDTH=\"5\"></td>" ;
                    HTMLcode += "<td STYLE=\"color:white;\" WIDTH=\"20\" ALIGN=\"right\">"+(_i+1)+")</td>" ;
                    HTMLcode += "<td WIDTH=\"5\"></td>" ;
                    HTMLcode += "<td STYLE=\"color:lightblue;\" WIDTH=\"50\">"+_objs_array_ref[_i][0]+"</td>" ;
                    HTMLcode += "<td WIDTH=\"5\"></td>" ;
                    HTMLcode += "<td STYLE=\"color:white;\" WIDTH=\"90\">"+_objs_array_ref[_i][1]+"</td>" ;
                    HTMLcode += "<td WIDTH=\"5\"></td>" ;
                    HTMLcode += "<td STYLE=\"color:yellow;\" WIDTH=\"90\">"+_objs_array_ref[_i][2]+"</td>" ;
                    HTMLcode += "<td WIDTH=\"5\"></td>" ;
                    HTMLcode += "<td STYLE=\"color:orange;\" WIDTH=\"90\">"+_objs_array_ref[_i][3]+"</td>" ;
                    HTMLcode += "</tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
                }

                HTMLcode += "</table>" ;

                $( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).html( HTMLcode );
                CIRCLESformsSCRIPTEDITORboxesCONTENTStypeARRAY['rightlower'] = CIRCLESformsSCRIPTEDITORcollectionCONSTANT ;
            }
				}
		}
}