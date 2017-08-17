function CIRCLESformsSCRIPTEDITORcodemanagerBREAKPOINTremove( _silent )
{
    _silent = safe_int( _silent, NO );
    var _mod_label = CIRCLESformsSCRIPTEDITORmodulelabelCURRENT ;
    var _proj_label = CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ;
    var _mod_index = circles_lib_js_manager_find_module_index( _mod_label, _proj_label ) ;
    var _breakpoint_number = UNFOUND ;
    if ( _mod_index != UNFOUND ) _breakpoint_number = safe_int( _glob_js_code_projs_array[_proj_label][_mod_index][3], UNFOUND ) ;
    if ( _breakpoint_number == UNFOUND ) alert_msg( ALERT_INFO, "No break-point set for this module", _glob_app_title );
    else
    {
        var _bGO = _silent ? YES : confirm( "Confirm to remove the break-point at line " + _breakpoint_number + " ?" ); 
        if ( _mod_index != UNFOUND && _bGO )
        {
            CIRCLESformsSCRIPTEDITORcodemirrorOBJ.setGutterMarker(_breakpoint_number, "breakpoints", null );
            _glob_js_code_projs_array[_proj_label][_mod_index][3] = UNFOUND ;
        }
    }
}

function CIRCLESformsSCRIPTEDITORlibsDOCSscan( _terms )
{
		if ( !is_array( _terms ) ) _terms = [ _terms ] ;
		var _found_index_array = [] ;
		$.each( _glob_circles_js_translation_methods,
						function( _i, _method_chunk )
						{
							 for( var _t = 0 ; _t < _terms.length ; _t++ )
							 {
									 if ( _terms[_t].trim().length > 2 &&
                        (
                        _method_chunk[0].includes_i( _terms[_t] ) ||
                        _method_chunk[4].includes_i( _terms[_t] )
                        )
                      )
									 {
									 	   if ( !_found_index_array.includes( _i ) ) _found_index_array.push( _i );
											 break ;	
									 }
							 }
						}
					) ;
					
		var _found_n = safe_size( _found_index_array, 0 );
		if ( _found_n == 0 )
		{
				 var HTMLcode = "<table><tr><td HEIGHT=\"12\"></td></tr><tr><td ALIGN=\"center\" STYLE=\"color:red;font-size:12pt;\">The search term"+(_found_n==1?"":"s")+" matched no results</td></tr></table>" ;
				 $( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).html( HTMLcode );
		}
		else
		{
				 var WIDTH = $( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).width();
				 var HEIGHT = $( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).height();
				 var HTMLcode = "<table WIDTH=\""+(WIDTH-40)+"\">" ;
				 		 HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
				 		 HTMLcode += "<tr><td WIDTH=\"6\"></td><td STYLE=\"color:yellow;\">Found "+_found_n+" result"+(_found_n==1?"":"s")+" matching search data</td></tr>" ;
				 		 HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
				 		 HTMLcode += "<tr><td WIDTH=\"6\"></td><td VALIGN=\"top\"><DIV STYLE=\"width:"+WIDTH+"px;height:"+(HEIGHT-34)+"px;overflow:auto;\">";
						 HTMLcode += "<table>" ;
						 var _data_chunk, _tmp_fn, _tmp_args, _tmp_dox ;
						 for( var _i = 0 ; _i < _found_n ; _i++ )
						 {
					 			_chunk = _glob_circles_js_translation_methods[ _found_index_array[_i] ] ;
					 			_tmp_fn = _chunk[0], _tmp_args = _chunk[1], _tmp_dox = _chunk[5] ;
					 			for( var _t = 0 ; _t < _terms.length ; _t++ )
					 			{
						 			_tmp_fn = _tmp_fn.replace( new RegExp( "("+_terms[_t]+")" ), "<u>$1</u>" );
						 			_tmp_args = _tmp_args.replace( new RegExp( "("+_terms[_t]+")" ), "<u>$1</u>" );
						 			_tmp_dox = _tmp_dox.replace( new RegExp( "("+_terms[_t]+")" ), "<u>$1</u>" );
								}

							  _tmp_args = circles_lib_colors_decode_tags( _tmp_args ) ;
							  _tmp_args = circles_lib_colors_decode_tags( _tmp_args ) ;

							  _tmp_dox = circles_lib_colors_decode_tags( _tmp_dox ) ;
							  _tmp_dox = _tmp_dox.replaceAll( _glob_crlf, "<br>" )

					 			_data_chunk = "<tr>" ;
					 			_data_chunk += "<td VALIGN=\"top\">" ;
					 			_data_chunk += "<table>" ;
					 			_data_chunk += "<tr><td STYLE=\"color:cyan;\" VALIGN=\"top\">Fn</td><td WIDTH=\"5\"></td><td STYLE=\"color:lightblue;\">"+_tmp_fn+"</td></tr>" ;
						 		_data_chunk += "<tr><td HEIGHT=\"4\"></td></tr>" ;
					 			_data_chunk += "<tr><td STYLE=\"color:cyan;\" VALIGN=\"top\">Args</td><td WIDTH=\"5\"></td><td STYLE=\"color:white;\">"+_tmp_args+"</td></tr>" ;
						 		_data_chunk += "<tr><td HEIGHT=\"4\"></td></tr>" ;
					 			_data_chunk += "<tr><td STYLE=\"color:cyan;\" VALIGN=\"top\">Dox</td><td WIDTH=\"5\"></td><td STYLE=\"color:white;\">"+_tmp_dox+"</td></tr>" ;
					 			_data_chunk += "</table>" ;
								_data_chunk += "</td>" ;
					 			_data_chunk += "</tr>" ;
					 			if ( _i > 0 ) _data_chunk += "<tr><td HEIGHT=\"3\"></td></tr><tr><td HEIGHT=\"1\" STYLE=\"background-color:#F8F8F8;\"></td></tr><tr><td HEIGHT=\"3\"></td></tr>" ;
					 			HTMLcode += _data_chunk ;
						 }
						 HTMLcode += "</table>" ;
						 HTMLcode += "</DIV></td></tr>" ;
				 		 HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
				 		 HTMLcode += "</table>" ;
				 		 
				 		 $( "#CIRCLESformsSCRIPTEDITORrightboxLOWER" ).html( HTMLcode );
		}
}

function CIRCLESformsSCRIPTEDITORcodemanagerOUTPUTclean() { if ( confirm( "Confirm to clean output contents ?" ) ) { $( "#CIRCLESformsSCRIPTEDITORoutputTABLE" ).html( "" ); } }
function CIRCLESformsSCRIPTEDITORcodemanagerLISTshowCODE( _index )
{
		if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Module '"+(_mod_label.length>0?_mod_label:"unknown")+"' is currently pending.", "CIRCLESformsSCRIPTEDITORoutputBOX" ) ;
		else
		{
				$( "[id^=CIRCLESformsSCRIPTEDITORcodelistENTRY]" ).css( "color", "#D6E6F1" );
				$( "#CIRCLESformsSCRIPTEDITORcodelistENTRY"+_index ).css( "color", "#F1E6D6" );
				var _label = circles_lib_js_manager_module_get_data( _index, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT, "label" ) ;
				var _code = circles_lib_js_manager_module_get_data( _index, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT, "code" ) ;
				CIRCLESformsSCRIPTEDITORcodemirrorOBJ.setValue( _code );
				CIRCLESformsSCRIPTEDITORmodulelabelCURRENT = circles_lib_js_manager_module_get_data( _index, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT, "label" );
				var _breakpoint = circles_lib_js_manager_module_get_data( _index, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT, "breakpoint" ) ;
        _breakpoint = safe_int( _breakpoint, UNFOUND );
        if ( _breakpoint < UNFOUND ) _breakpoint = UNFOUND ;
        if ( _breakpoint >= 0 )
        {
            var info = CIRCLESformsSCRIPTEDITORcodemirrorOBJ.lineInfo(_breakpoint);
            CIRCLESformsSCRIPTEDITORcodemirrorOBJ.setGutterMarker(_breakpoint, "breakpoints",
                                                                  info.gutterMarkers ? null : CIRCLESformsSCRIPTEDITORmakeMarker());
            circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR, "<orange>Breakpoint set at line</orange> <white>"+(_breakpoint+1)+"</white> <orange>for module</orange> <white>"+_label+"</white>", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
        }
		}
}

function CIRCLESformsSCRIPTEDITORcodemanagerOUTPUTsave()
{
		var _output_contents = $( "#CIRCLESformsSCRIPTEDITORoutputTABLE" ).html() ;
    var blob = new Blob( [ _output_contents.replace( /\&(?:nbsp)\;/gi, " " ).replace( /\<(?:\/?br|\/div)\>/gi, _glob_crlf ).strip_tags() ], { type: 'plain/text', endings: 'native' });
    saveAs( blob, ( CIRCLESformsSCRIPTEDITORmodulelabelCURRENT.replace( /\s+/g, "" ) )+".txt" );
}

function CIRCLESformsSCRIPTEDITORcodemanagerADDproject()
{
		var _mod_label = CIRCLESformsSCRIPTEDITORmodulelabelCURRENT ;
		if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Module '"+(_mod_label.length>0?_mod_label:"unknown")+"' is currently pending.", "CIRCLESformsSCRIPTEDITORoutputBOX" ) ;
    else
		{
				var _ret_chunk = circles_lib_js_manager_scripts_project_add() ;
				var _ret_id = safe_int( _ret_chunk[0], NO );
				var _ret_proj_label = safe_string( _ret_chunk[1], "" );
				if ( _ret_id )
				{
						CIRCLESformsSCRIPTEDITORprojectlabelCURRENT = _ret_proj_label ;
						CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay() ;
				}
				else circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_ERROR, "Fail to create a new project '"+_ret_proj_label+"'", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		}
}

function CIRCLESformsSCRIPTEDITORcodemanagerREMOVEproject( _silent )
{
		_silent = safe_int( _silent, NO ) ;
		var _mod_label = CIRCLESformsSCRIPTEDITORmodulelabelCURRENT ;
		if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Module '"+(_mod_label.length>0?_mod_label:"unknown")+"' is currently pending.", "CIRCLESformsSCRIPTEDITORoutputBOX" ) ;
		else if ( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT.length > 0 )
		{
				var _b_go = _silent ? YES : confirm( "Confirm to delete the whole project '"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"' ?" ) ;
				if ( _b_go )
				{
						var _ret_chunk = circles_lib_js_manager_scripts_project_remove( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
						var _ret_id = safe_int( _ret_chunk[0], NO );
						var _ret_proj_label = safe_string( _ret_chunk[1], "" );
						if ( _ret_id )
						{
								circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR, "<greensuccess>Project</greensuccess> <white>"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"</white> <greensuccess>has been removed with success</greensuccess>", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
								CIRCLESformsSCRIPTEDITORcodemirrorOBJ.setValue( "" );
								CIRCLESformsSCRIPTEDITORprojectlabelCURRENT = "" ;
								$( "#CIRCLESformsSCRIPTEDITORrecordBTNID" ).css( "color", "black" );
								CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay() ;
						}
						else circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_ERROR, "Fail to remove project '"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"'", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
				}
				else circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_ERROR, "Removal aborted by user", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		}
		else circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_ERROR, "Fail to remove project : missing reference", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerRENAMEproject( _silent )
{
		var _mod_label = CIRCLESformsSCRIPTEDITORmodulelabelCURRENT ;
		if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Module '"+(_mod_label.length>0?_mod_label:"unknown")+"' is currently pending.", "CIRCLESformsSCRIPTEDITORoutputBOX" ) ;
		else
		{
				var HTMLcode = "<table>" ;
				HTMLcode += "<tr>" ;
				HTMLcode += "<td STYLE=\"color:white;\">Rename to</td>" ;
				HTMLcode += "<td WIDTH=\"3\"></td>" ;
				HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"CIRCLESformsSCRIPTEDITrenamePROJECTedit\" ONKEYUP=\"javascript:CIRCLESformsSCRIPTEDITOReventsHANDLER( event, this.id );\" STYLE=\"width:130px;\"></td>" ;
				HTMLcode += "</tr>" ;
				HTMLcode += "</table>" ;
				$( "#CIRCLESformsSCRIPTEDITORprojectCONTAINER" ).html( HTMLcode );
		}
}

function CIRCLESformsSCRIPTEDITORcodemanagerLISTselectALL( _checked )
{
    var _proj_array_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
    if ( is_array( _proj_array_ref ) )
    {
				$( "[id^=CIRCLESformsSCRIPTEDITORcodeCHECKBOX]" ).each( function( _i, _ctrl )
		    {
		        $( "#"+_ctrl.id ).prop( "checked", _checked ? YES : NO );
		        if ( is_array( _proj_array_ref[_i] ) ) _proj_array_ref[_i][2] = _checked ? YES : NO ;
		    }
		    ) ;
		    return YES ;
		}
		else return NO ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerLISTmergeSELECTED()
{
		var _mod_label = CIRCLESformsSCRIPTEDITORmodulelabelCURRENT ;
    var _proj_array_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
		if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Module '"+(_mod_label.length>0?_mod_label:"unknown")+"' is currently pending.", "CIRCLESformsSCRIPTEDITORoutputBOX" ) ;
    else if ( is_array( _proj_array_ref ) )
    {
         var _entries_n = safe_size( _proj_array_ref );
         if ( _entries_n > 0 )
         {
              var _label, _code, _run, _msg ;
              $.each( _proj_array_ref,
                      function( _i, _chunk )
                      {
                          _label = _chunk[0], _code = _chunk[1], _selected = _chunk[2] ;
                      }
                    );
         }
         else
				 circles_lib_output( OUTPUT_SCRIPT_EDITOR, "Can't merge: the scripts list is empty", DISPATCH_WARNING, "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
    }
    else circles_lib_output( OUTPUT_SCRIPT_EDITOR, "Critical error: incoherent archive structure", DISPATCH_CRITICAL, "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerLISTdeleteSELECTED()
{
    var _proj_array_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
		var _mod_label = CIRCLESformsSCRIPTEDITORmodulelabelCURRENT ;
		if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Module '"+(_mod_label.length>0?_mod_label:"unknown")+"' is currently pending.", "CIRCLESformsSCRIPTEDITORoutputBOX" ) ;
    else if ( is_array( _proj_array_ref ) )
    {
         var _entries_n = safe_size( _proj_array_ref );
         var _count_selected = CIRCLESformsSCRIPTEDITORcodemanagerLISTcountSELECTED() ;
         if ( _entries_n > 0 && _count_selected > 0 )
         {
              if ( confirm( "Confirm to delete all selections ?" ) )
              {
									var _label, _code, _run, _msg, _chunk, _len = _proj_array_ref.length ;
									for( var _i = 0 ; _i < _len ; _i++ )
									{
											_chunk = _proj_array_ref[ _i ], _label = _chunk[0], _code = _chunk[1], _selected = _chunk[2] ;
                      if ( _selected )
                      {
                      		_ret = CIRCLESformsSCRIPTEDITORcodemanagerLISTdeleteCODE( _i, YES, NO ) ;
                          if ( _ret )
													{
															_len = _proj_array_ref.length, _i = -1 ;
		                          circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR, "<white>"+_label+"</white> <lime>has been deleted with success</lime>", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
													}
													else circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR, "<red>Fail to remove</red> <white>"+_label+"</white>", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
											}
									}
		              CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay();
							}
         }
         else if ( _count_selected == 0 )
				 circles_lib_output( OUTPUT_SCRIPT_EDITOR, "Can't delete: missing selected entries", DISPATCH_WARNING, "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
         else if ( _entries_n == 0 )
				 circles_lib_output( OUTPUT_SCRIPT_EDITOR, "Can't delete: the scripts list is empty", DISPATCH_WARNING, "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
    }
    else circles_lib_output( OUTPUT_SCRIPT_EDITOR, "Critical error: incoherent archive structure", DISPATCH_CRITICAL, "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerLISTdeleteCODE( _index, _silent, _update_list )
{
		var _mod_label = CIRCLESformsSCRIPTEDITORmodulelabelCURRENT ;
		if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Module '"+(_mod_label.length>0?_mod_label:"unknown")+"' is currently pending.", "CIRCLESformsSCRIPTEDITORoutputBOX" ) ;
		else
		{
				_index = safe_int( _index, 0 ), _silent = safe_int( _silent, NO ), _update_list = safe_int( _update_list, 1 ) ;
				var _entry_label = circles_lib_js_manager_module_get_data( _index, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT, "label" ) ;
				var _b_go = !_silent ? confirm( "Confirm to delete module '"+_entry_label+"' ?" ) : YES ;
				if ( _b_go )
				{
				    var _proj_array_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
						var _old_n = safe_size( _proj_array_ref, 0 );
						circles_lib_js_manager_module_delete( _index, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
						var _new_n = safe_size( _proj_array_ref, 0 );
						if ( _new_n < _old_n )
						{
								if ( _update_list ) CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay();
								if ( _entry_label.strcmp( CIRCLESformsSCRIPTEDITORmodulelabelCURRENT ) )
								CIRCLESformsSCRIPTEDITORcodemanagerCLEAN( YES ) ;
								return YES ;
						}
						else return NO ;
				}
				else return NO ;
		}
}

function CIRCLESformsSCRIPTEDITORcodemanagerNEW()
{
    var _code = CIRCLESformsSCRIPTEDITORcodemirrorOBJ.getValue();
    if ( _code.trim().length > 0 )
    {
      	var _b_go = confirm( "Confirm to clean all contents inside the code editor box ?" ) ;
        if ( _b_go )
        {
            CIRCLESformsSCRIPTEDITORcodemanagerCLEAN( YES, YES ) ;
            CIRCLESformsSCRIPTEDITORmodulelabelCURRENT = "" ;
            CIRCLESformsSCRIPTEDITORstatusCURRENT = PASSED ;
        }
    }
}

function CIRCLESformsSCRIPTEDITORcodemanagerCLEAN( _silent, _force )
{
		_silent = safe_int( _silent, NO ), _force = safe_int( _force, NO );
		if ( _force ) _silent = YES ;
		if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING && !_force )
		{
				alert_plug_label( DISPATCH_YES, "Yes, clean" );
				alert_plug_label( DISPATCH_NO, "No, abort" );
				alert_plug_fn( DISPATCH_YES, "CIRCLESformsSCRIPTEDITORcodemanagerCLEAN(1,1);alertCLOSE();" );
				alert_plug_fn( DISPATCH_NO, "alertCLOSE();" );
				var _msg = CIRCLESformsSCRIPTEDITORmodulelabelCURRENT.length > 0 ? "File '"+CIRCLESformsSCRIPTEDITORmodulelabelCURRENT+"'" : "This code" ;
						_msg += " has not been recorded yet." ;
						_msg += _glob_crlf.repeat(2) + "Do you want to clean it anyway ?" ;
				circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING | DISPATCH_YESNO, _msg, "CIRCLESformsSCRIPTEDITORoutputBOX" ) ;
		}
		else
		{
				var _code = CIRCLESformsSCRIPTEDITORcodemirrorOBJ.getValue().trim() ;
				if ( _code.length > 0 )
				{
						var _b_go = !_silent ? confirm( "Confirm to clean all contents inside the code editor box ?" ) : YES ;
						if ( _b_go ) CIRCLESformsSCRIPTEDITORcodemirrorOBJ.setValue( "" );
				}
		}
}

function CIRCLESformsSCRIPTEDITORcodemanagerLISTadd( _silent )
{
		_silent = safe_int( _silent, NO );
		var _code = CIRCLESformsSCRIPTEDITORcodemirrorOBJ.getValue().trim() ;
		if ( _code.length > 0 )
		{
		    var _proj_array_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
				var _index = circles_lib_js_manager_find_module_index( CIRCLESformsSCRIPTEDITORmodulelabelCURRENT, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
				var _action = _index == UNFOUND ? "add" : "update" ;
				var _action_1 = _index == UNFOUND ? "adding" : "updating" ;
				var _pre = _index == UNFOUND ? "" : "You're current operating on file '"+CIRCLESformsSCRIPTEDITORmodulelabelCURRENT+"'." + _glob_crlf.repeat(2) ;
				var _b_go = !_silent ? confirm( "Confirm to "+_action+" code ?" ) : YES ;
				if ( _b_go )
				{
								if ( safe_size( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT, 0 ) == 0 )
								CIRCLESformsSCRIPTEDITORprojectlabelCURRENT = "Proj " + ( _glob_js_code_projs_array.size_associative() + 1 ) ;
				
								var _ret_chunk = circles_lib_js_manager_module_add( _code, CIRCLESformsSCRIPTEDITORmodulelabelCURRENT,
																																		CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
                var _ret_id = _ret_chunk[0], _ret_entry_label = _ret_chunk[1], _ret_proj_label = _ret_chunk[2] ;
								if ( _ret_id )
								{
                    CIRCLESformsSCRIPTEDITORmodulelabelCURRENT = _ret_entry_label ;
                    CIRCLESformsSCRIPTEDITORprojectlabelCURRENT = _ret_proj_label ;
										circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_SUCCESS, "Success in "+_action_1+" code to module <white>"+CIRCLESformsSCRIPTEDITORmodulelabelCURRENT+"</white> in project <white>"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"</white>", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
										CIRCLESformsSCRIPTEDITORstatusCURRENT = PASSED ;
										$( "#CIRCLESformsSCRIPTEDITORrecordBTNID" ).css( "color", "black" );
										CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay();
								}
								else
								circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_CRITICAL, "Fail to "+_action+" code to project '"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"'", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
				}
		}
		else circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Can't add: the code box is empty", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
}