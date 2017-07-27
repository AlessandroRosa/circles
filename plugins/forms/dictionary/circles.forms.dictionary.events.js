function CIRCLESformsDICTIONARYeventsHANDLER( _event, _ctrl_id )
{
	  if ( _event.stopPropagation )      _event.stopPropagation();
	  if ( _event.cancelBubble != null ) _event.cancelBubble = true;

  	var _alt_pressed = _event.altKey ;
    var _del_pressed = _event.keyCode == 8 ? YES : NO ;
    var _canc_pressed = _event.keyCode == 46 ? YES : NO ;
	  var _ctrl_pressed = _event.ctrlKey ;
    var _esc_pressed = _event.keyCode == 27 ? YES : NO ;
		var _shift_pressed = _event.shiftKey ;
    var _return_pressed = _event.keyCode == 13 ? YES : NO ;

		switch( _ctrl_id )
		{
				case "DICTIONARYgotoPAGE":
				if ( _return_pressed )
				CIRCLESformsDICTIONARYdisplayPAGE( safe_int( $('#'+_ctrl_id).val(), 1 ) - 1 );
				break ;
        case "CIRCLESformsDICTIONARYalphabetEDIT":
				if ( _return_pressed )
				CIRCLESformsDICTIONARYalphabetADD( safe_string( $('#'+_ctrl_id).val(), "" ) );
        break ;
        case "CIRCLESdictionaryFORMdepthEDIT":
				if ( _return_pressed )
	      circles_lib_depth_set( safe_int( $( "#CIRCLESdictionaryFORMdepthEDIT" ).val(), 0 ), YES );
        break ;
        case "CIRCLESformsDICTIONARYeachPAGEcardinality":
        if ( _return_pressed )
        CIRCLESformsDICTIONARYpageRESIZE();
        break ;
        default: break ;
		}
		
    if ( _ctrl_id.includes( "DICTIONARYword_edit_" ) )
    {
        if ( _event.keyCode == 13 ) // return key
        {
            var oldWORD = arguments[2].trim(), newWORD = $("#"+_ctrl_id ).val();
            var INDEX = safe_int( arguments[3], UNDET );
         	  if ( newWORD.length == 0 )
            {
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The new word is empty.", _glob_app );
                newWORD = oldWORD ;
            }
            else if ( newWORD == oldWORD ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The word remains the same."+_glob_crlf.repeat(2)+"No change.", _glob_app );
            else
            {
                var _ok = circles_lib_word_check( newWORD, _glob_alphabet );
                    _ok = _ok.is_one_of( CIRCLES_MISSING_INPUT, UNDET ) ? NO : YES ;
                var _msg = _ok ? "The word '"+oldWORD+"' has been updated to '"+newWORD+"'" : "The new word '"+newWORD+"' doesn't match the current alphabet" ;
                circles_lib_output( OUTPUT_SCREEN, _ok ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, _glob_app );
                if ( _ok )
                {
                    var _MEM_CHUNK = _glob_original_dict[ _glob_dict_selected_page ][INDEX] ;
                    if ( _MEM_CHUNK != null ) // thus, there exists some dedicated memory space in memory for that index
                    _glob_original_dict[ _glob_dict_selected_page ][INDEX] = newWORD ;
                    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Memory failure: can't store the new word '"+newWORD+"'.", _glob_app );
                }  
            }
                    
            $("#DICTIONARYword_label_" + INDEX ).html( newWORD );
         }
    }
    else if ( _ctrl_id.includes( "DICTIONARYword_label_" ) )
    {
         var _additional_code = _event.button ;
         if ( _additional_code.is_one_of( 0, 1, 2 ) )
         {
             var WORD = safe_string( arguments[2], "" ).trim();
             switch( _additional_code )
             {
                 case 0: // left mouse button
                 CIRCLESformsDICTIONARYselectWORD( WORD );
                 if ( _glob_method == METHOD_INVERSION )
                 circles_lib_draw_word_inversion( _glob_wplane_freedraw_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), wplane_sm, null, YES, WORD );
                 else if ( _glob_method == METHOD_ALGEBRAIC )
                 {
                     // left blank for further implementations
                 }
                 else circles_lib_draw_word_circlewise( _glob_wplane_freedraw_canvas_placeholder.getContext( _glob_canvas_ctx_2D_mode ), wplane_sm, null, YES, WORD );
                 break ;
                 case 1: // mid button
                 break ;
                 case 2: // right button
                 var INDEX = arguments[3] ;
                 var WORD = $("#DICTIONARYword_label_" + INDEX ).html().strip_tags();
                 var _INPUT_LEN = Math.max( 12, WORD.length * 11 );
                 var _INPUT_LABEL = "DICTIONARYword_edit_" + INDEX ;
                 $("#DICTIONARYword_label_" + INDEX ).html( "<INPUT TYPE=\"edit\" ID=\""+_INPUT_LABEL+"\" ONKEYUP=\"javascript:CIRCLESformsDICTIONARYeventsHANDLER( event, '"+_INPUT_LABEL+"', '"+WORD+"', '"+INDEX+"' );\" STYLE=\"text-align:center;width:"+_INPUT_LEN+"px;\" VALUE=\""+WORD+"\">" );
                 break ;
                 default: break ;
            }
        }
    }
}