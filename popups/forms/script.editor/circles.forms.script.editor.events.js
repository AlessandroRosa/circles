function CIRCLESformsSCRIPTEDITOReventsHANDLER( _event, _ctrl_id )
{
	  if ( _event.stopPropagation )      _event.stopPropagation();
	  if ( _event.cancelBubble != null ) _event.cancelBubble = true;

    var _event_type = _event.type.toLowerCase() ;
  	var _alt_pressed = _event.altKey ;
    var _del_pressed = _event.keyCode == 8 ? YES : NO ;
    var _canc_pressed = _event.keyCode == 46 ? YES : NO ;
	  var _ctrl_pressed = _event.ctrlKey ;
    var _esc_pressed = _event.keyCode == 27 ? YES : NO ;
		var _shift_pressed = _event.shiftKey ;
    var _return_pressed = _event.keyCode == 13 ? YES : NO ;
    var _arrow_pressed = ( _event.keyCode >= 37 && _event.keyCode <= 40 ) ? YES : NO ;
    _last_keycode = _event.keyCode ;

    if ( _del_pressed || _canc_pressed )
    {
       if ( _ctrl_id.start_with( "CIRCLESformsSCRIPTEDITORtextarea" ) )
       {
           switch( _event_type )
           {
              case "keydown":
              if ( _last_string == "//" ) _oneline_comment = 0 ;
              else if ( _last_string == "*/" ) _multiline_comment = 0 ;
              break ;
              case "keyup":
              break ;
           }

					 if ( CIRCLESformsSCRIPTEDITORcodemirrorOBJ.getValue().length > 0 )
					 CIRCLESformsSCRIPTEDITORstatusCURRENT = PENDING ;
       }
    }
    else if ( _return_pressed )
    {
       if ( _ctrl_id.start_with( "CIRCLESformsSCRIPTEDITORsearchlibEDIT" ) )
       {
            // search for terms through libs
            var _tmp_terms = $( "#" + _ctrl_id ).val().trim().split( /[\,|\;|\.|\:]/ );
            var _search_terms = [] ;
            _tmp_terms.work( function( _term ) { if ( _term.trim().length > 0 ) _search_terms.push( _term ) ; } ) ;
            if ( _search_terms.length > 0 ) CIRCLESformsSCRIPTEDITORlibsDOCSscan( _search_terms ) ;
       }
       else if ( _ctrl_id.start_with( "CIRCLESformsSCRIPTEDITORcodelistENTRYedit" ) )
			 {
			 		 var _iconsize = safe_string( arguments[2], "16x16" );
			 		 var _index = safe_int( _ctrl_id.replaceAll( "CIRCLESformsSCRIPTEDITORcodelistENTRYedit", "" ), UNDET ) ;
					 CIRCLESformsSCRIPTEDITORcodemanagerLISTrename( _index, 1, _iconsize ) ;
			 }
			 else if ( _ctrl_id.start_with( "CIRCLESformsSCRIPTEDITrenamePROJECTedit" ) )
			 {
			 		 var _new_proj_label = $( "#CIRCLESformsSCRIPTEDITrenamePROJECTedit" ).val().trim() ;
			 		 if ( _new_proj_label.length == 0 )
			 		 circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_ERROR, "Missing new label for project renaming", "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
			 		 else
			 		 {
							 var _ret_chunk = circles_lib_js_manager_scripts_rename_project( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT, _new_proj_label ) ;
							 var _ret_id = safe_int( _ret_chunk[0], NO ) ;
							 var _ret_old_label = safe_string( _ret_chunk[1], "" ).trim() ;	
							 var _ret_new_label = safe_string( _ret_chunk[2], "" ).trim() ;	
					 		 circles_lib_output( OUTPUT_SCRIPT_EDITOR, _ret_id ? DISPATCH_ERROR : DISPATCH_SUCCESS,
																	 "Rename '"+_ret_old_label+"' into '"+_ret_new_label+"' : " + ( _ret_id ? "success !" : "failure" ),
																	 "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
							 CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay();
					 }
			 }
       else if ( _ctrl_id.start_with( "CIRCLESformsSCRIPTEDITORtextarea" ) )
       {
           switch( _event_type )
           {
                case "keydown":
                break ;
                case "keyup":
                _oneline_comment = 0 ;
                break ;
           }

					 if ( CIRCLESformsSCRIPTEDITORcodemirrorOBJ.getValue().length > 0 )
					 CIRCLESformsSCRIPTEDITORstatusCURRENT = PENDING ;
       }
    }
    else if ( !_arrow_pressed )
    {
        if ( _ctrl_id.start_with( "CIRCLESformsSCRIPTEDITORtextarea" ) )
        {
            switch( _event_type )
            {
                case "keydown":
                if ( _last_string == "/" )
                {
                    switch( _event.keyCode )
                    {
                        case 42: _multiline_comment = 1 ; break ; // '*'
                        case 55: _oneline_comment = 1 ; break ; // '/'
                        default: break ;
                    }
                }
                break ;
                case "keyup":
                break ;
            }

					  if ( CIRCLESformsSCRIPTEDITORcodemirrorOBJ.getValue().length > 0 )
					  CIRCLESformsSCRIPTEDITORstatusCURRENT = PENDING ;
        }
		}

		if ( CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING )
		{
				var _index = circles_lib_js_manager_find_module_index( CIRCLESformsSCRIPTEDITORmodulelabelCURRENT, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
		 		$( "#CIRCLESformsSCRIPTEDITORrecordBTNID" ).css( "color", "red" );
			  if ( _index != UNFOUND ) $( "#CIRCLESformsSCRIPTEDITORstatus" + _index ).html( "<IMG TITLE=\"Pending: save it!\" SRC=\""+_glob_path_to_img+"icons/stop/stop.icon.16x16.png\">" );

				CIRCLESformsSCRIPTEDITORcompiledFLAG = NO ;
				$( "#CIRCLESformsSCRIPTEDITORcodeBTN" ).css( "color", "red" );
				$( "#CIRCLESformsSCRIPTEDITORcompileBTN" ).css( "color", "red" );
		}
}