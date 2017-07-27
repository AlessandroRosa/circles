function CIRCLESformsEPSEDITORsavepage()
{
    CIRCLESformsEPSEDITOR_current_page = safe_int( CIRCLESformsEPSEDITOR_current_page, UNDET );
    if ( CIRCLESformsEPSEDITOR_current_page == UNDET ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Invalid page specification", _glob_app );
    else
    {
         var _codelist_ref = _glob_js_e_ps_obj.get_codelist_ref();
         var _index = CIRCLESformsEPSEDITOR_current_page * CIRCLESformsEPSEDITOR_max_entries_per_page - 1 ;
         var _before_code = _index >= 0 ? _codelist_ref.from_to( 0, _index ) : [] ;
         var _after_index = ( CIRCLESformsEPSEDITOR_current_page + 1 ) * CIRCLESformsEPSEDITOR_max_entries_per_page ; 
         var _after_code = _codelist_ref.from_to( _after_index, safe_size( _codelist_ref, UNDET ) );

         var _new_code = $( "#CIRCLESformsEPSEDITORtextarea" ).val().split( _glob_crlf );
         
         _before_code = _before_code.concat( _new_code, _after_code );
         _glob_js_e_ps_obj.eps_code = _before_code.clone();
         CIRCLESformsEPSEDITORcomputePAGES();
         circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Page "+( CIRCLESformsEPSEDITOR_current_page + 1 )+" has been save with success.", _glob_app );
    }
}

function CIRCLESformsEPSEDITORsavefile()
{
    var _code = _glob_js_e_ps_obj.get_codelist().join( _glob_crlf );       _code = _code.trim();
    if ( _code.length > 0 )
    {
         var _filename = "pix." + ( _glob_export_format == EXPORT_PS ? "ps" : "eps" );
         var _basename = basename( _filename );
			   var _extension = _filename.includes( "." ) ? _filename.split( ".").get_last() : "" ;
				 		 _filename = _glob_title.length > 0 ? ( _glob_title + "." + _basename + "." +  _extension ) : "circles." + _filename ;
         var blob = new Blob( [ _code ], { type: 'plain/text', endings: 'native' } );
         saveAs( blob, _filename );
    }
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't save code to a file: text is empty.", _glob_app );
}