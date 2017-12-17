function CIRCLESformsSCRIPTEDITORactivateLOAD()
{
		if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING )
		{
				circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING,
														"Code file '"+CIRCLESformsSCRIPTEDITORmodulelabelCURRENT+"' is still pending." + _glob_crlf + "Please, record it first.",
														"CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		}
		else
		{
				CIRCLESformsSCRIPTEDITORcodemanagerSETloadACTION();
				$('#customloader').val('');$('#customloader').trigger('click');
		}
}
function CIRCLESformsSCRIPTEDITORcodemanagerSETloadACTION() { $("#customloader").get(0).onchange = function() { CIRCLESformsSCRIPTEDITORloadFILES() ; } ; }
function CIRCLESformsSCRIPTEDITORparseJSFILE( _file_contents, _filename )
{
    var _ret_chunk = circles_lib_files_parse_js_file( _file_contents );
    if ( _ret_chunk[0] == -1 )
    {
				circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR,
														"<red>Fail to load module</red> <white>"+_filename+"</white> : <red>suspected libs to be corrupted</red>",
														"CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
        return { 'contents' : "", 'label' : _ret_chunk[1] } ;
    }
    else
    {
        return { 'contents' : _file_contents, 'label' : _ret_chunk[1] } ;
    }
}

function CIRCLESformsSCRIPTEDITORreadFILES( _readers )
{
		var _file_contents = "", _label, _cnt = 0, _chunk ;
		$.each( _readers,
						function( _r, _reader )
						{
                if ( /^.*\.(lib)$/i.test( _reader.filename ) )
                {
										_file_contents = _reader.result ;
                    var _n = circles_lib_files_parse_lib_file( _file_contents ) ;
                    if ( _n > 0 )
										circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR,
																				"<lime>"+_n+"</lime> <white>function"+(_n==1?"":"s")+"</white> <lime>"+(_n==1?"has":"have")+" been read</lime>",
																				"CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
										else
										circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR,
																				"<orange>No new functions have been read from lib file</orange> <white>"+_reader.filename+"</white>",
																				"CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
                }
								else if ( /^.*\.(js)$/i.test( _reader.filename ) )
								{
										_file_contents = _reader.result ;
		                _chunk = CIRCLESformsSCRIPTEDITORparseJSFILE( _file_contents, _reader.filename ) ;
		                _file_contents = _chunk['contents'], _label = _chunk['label'] ;
		                if ( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT.trim().length == 0 )
		                {
				                CIRCLESformsSCRIPTEDITORprojectlabelCURRENT = "Proj " + ( safe_size( _glob_js_code_projs_array, 0 ) + 1 ) ;
												circles_lib_js_manager_scripts_project_add( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
										}
		                
								    if ( safe_size( _file_contents, 0 ) > 0 )
								    {
								        if ( _cnt == 0 )
		                    {
		                       CIRCLESformsSCRIPTEDITORmodulelabelCURRENT = _label ;
		  						         CIRCLESformsSCRIPTEDITORcodemirrorOBJ.setValue( _file_contents );
		                    }

								        circles_lib_js_manager_module_add( _file_contents, _label, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
								        if ( _label == undefined )
								        {
														var _last_index = circles_lib_js_manager_scripts_count( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) - 1 ;
														_entry_label = circles_lib_js_manager_module_get_data( _last_index, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT, "label" ) ;
												}
												
		                    _cnt++ ;
								    }
								}
								else if ( /^.*\.(zip)$/i.test( _reader.filename ) )
								{
										_file_contents = _reader.result ;
										CIRCLESformsSCRIPTEDITORprojectlabelCURRENT = _reader.filename.replaceAll( ".zip", "" ) ;
										var _ret_chunk = circles_lib_js_manager_scripts_project_add( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
										if ( _ret_chunk[0] )
										circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR,
																				"<lime>Project</lime> <white>"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"</white> <lime>has been created with success</lime>",
																				"CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
										else
										circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR,
																				"<orange>Project</orange> <white>"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"</white> <orange>already exists</orange>",
																				"CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
										
										var _zip_obj = new JSZip( _file_contents ), _filename, _file_contents, _label ;
										for( _fileobj in _zip_obj.files )
										{
												if ( _fileobj.end_with_i( ".js" ) )
												{
														_filename = _fileobj.split( "/" ).get_last();
														circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR,
																								"<lime>File</lime> <white>"+_fileobj+"</white> <lime>has been unpacked with success</lime>",
																								"CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		                        var _chunk = CIRCLESformsSCRIPTEDITORparseJSFILE( _zip_obj.files[ _fileobj ].asText(), _reader.filename ) ;
		                        _file_contents = _chunk['contents'], _label = _chunk['label'] ;
										        circles_lib_js_manager_module_add( _file_contents, _label.length > 0 ? _label : _filename, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
												}
										}
										
										CIRCLESformsSCRIPTEDITORprojectlabelCURRENT = "" ;
								}
						}
					) ;

    CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay();
    var _proj_array_ref = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
		CIRCLESformsSCRIPTEDITORcodemanagerLISTshowCODE( _proj_array_ref.length - 1 );
		
		CIRCLESformsSCRIPTEDITORcompiledFLAG = NO ;
		$( "#CIRCLESformsSCRIPTEDITORcodeBTN" ).css( "color", CIRCLESformsSCRIPTEDITORcompiledFLAG ? "black" : "red" );
		$( "#CIRCLESformsSCRIPTEDITORcompileBTN" ).css( "color", CIRCLESformsSCRIPTEDITORcompiledFLAG ? "black" : "red" );
}

function CIRCLESformsSCRIPTEDITORloadFILES( _drag_files )
{
    var files = _drag_files != null ? _drag_files : $( '#customloader' ).get(0).files ;
    var _readers = [], _code = [], _file_format, _read = 0 ;
    var _proj_files = 0, _read_n = 0 ;
    for (var i = 0, f; f = files[i]; i++)
    {
				_readers.push( new FileReader() ) ;
		    if ( /^.*\.(zip)$/i.test( f.name ) ) { _file_format = "ZIP archive", _read = 1 ; _proj_files++ ; _read_n++ ; }
		    else if ( /^.*\.(js)$/i.test( f.name ) ) { _file_format = "JS code", _read = 1 ; _proj_files++ ; _read_n++ ; }
		    else if ( /^.*\.(lib)$/i.test( f.name ) ) { _file_format = "LIB collection", _read = 1 ; _read_n++ ; }
				else { _file_format = "Unknown code file", _read = 0 ; }
				
				if ( _read )
				{
			      _readers[i].onload = ( function( f )
																	 {
																			circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO,
																													"<lightblue>"+_file_format+"</lightblue> <white>"+f.name+"</white> <lime>has been loaded with success</lime>",
																													"CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
																	 } )( f );
		
			      _readers[i].readAsBinaryString( f );
			      _readers[i].filename = files[i].name ;
				}
				else
				{
						circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_MULTICOLOR,
																"<orange>"+_file_format+"</orange> <white>"+f.name+"</white> <orange>has been skipped</orange>",
																"CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
				}
    }
    
		if ( _proj_files > 0 )
		{
				circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_INFO,
														"A new proj is attempted to be created",
														"CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		}

		if ( _read_n > 0 )
		setTimeout( function(){ CIRCLESformsSCRIPTEDITORreadFILES( _readers ) ; }, 1500 ) ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerSAVEfile()
{
		var _code = CIRCLESformsSCRIPTEDITORcodemirrorOBJ.getValue().trim() ;
		if ( _code.length > 0 )
		{
		    var blob = new Blob( [ _code ], { type: 'plain/text', endings: 'native' });
		    saveAs( blob, CIRCLESformsSCRIPTEDITORmodulelabelCURRENT+".txt" );
		}
		else
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING, "Fail to save data into a file: the input code box is empty", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerSAVEprojectZIPFILE( _silent )
{
		_silent = safe_int( _silent, NO ) ;
	  var _keys = _glob_js_code_projs_array.keys_associative() ;
	  var _keys_n = is_array( _keys ) ? _keys.length : 0 ;
		if ( _keys_n == 0 )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_ERROR, 
												"Fail to create a zip archive from the current proj: missing reference",
												"CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		else if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING )
		circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_WARNING,
												"Fail to save the current proj into a zip archive."+_glob_crlf+"Code file '"+CIRCLESformsSCRIPTEDITORmodulelabelCURRENT+"' is still pending." + _glob_crlf + "Please, record it first.",
												"", "" ) ;
		else
		{
				var _b_go = _silent ? YES : confirm( "Confirm to save the current proj '"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"' into a zip archive ?" ) ;
				if ( _b_go )
				{
					 var _zip_obj = new JSZip(), _key = CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ;
					 var _scripts = _glob_js_code_projs_array[_key], _chunk, _label, _code, _selected ;
					 for( var _i = 0 ; _i < _scripts.length ; _i++ )
					 {
				 			_chunk = _scripts[_i], _label = _chunk[0], _code = _chunk[1], _selected = _chunk[2] ;
				 			if ( _selected )
							_zip_obj.file( _key + "/" + _label + ( _label.end_with_i( ".js" ) ? "" : ".js" ), _code );
					 }
											
					 var _blob = _zip_obj.generate( {type:"blob"} );
					 var _filename = safe_string( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT.replace( /\s+/g, "" ), "" ).trim() ;
					 if ( _filename.length == 0 ) _filename = "project" ;
					 saveAs( _blob, _filename+".zip" );
				}
				else circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_ERROR, "Zipping has been aborted by user", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
		}
}