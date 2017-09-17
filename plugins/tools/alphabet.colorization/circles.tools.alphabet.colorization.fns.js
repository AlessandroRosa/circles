function CIRCLEStoolsALPHABETCOLORIZATIONlist( case_id, _self_fill_container )
{
		case_id = safe_int( case_id, 0 ), _self_fill_container = safe_int( _self_fill_container, NO );
		var _array_ref = null ; 
		switch( case_id )
		{
				case 1: _array_ref = _glob_lower_alphabet_colorization_array ; break ;
				case 2: _array_ref = _glob_upper_alphabet_colorization_array ; break ;
        default: break ;
		}

		var HTMLcode = "<table ALIGN=\"center\">" ;

		HTMLcode += "<tr>" ;
 		HTMLcode += "<td VALIGN=\"top\">" ;
 		HTMLcode += "<table>" ;
 		HTMLcode += "<tr>" ;
 		HTMLcode += "<td WIDTH=\"5\"></td>" ;
 		HTMLcode += "<td>Case</td>" ;
 		HTMLcode += "<td WIDTH=\"5\"></td>" ;
 		HTMLcode += "<td><SELECT ID=\"CIRCLEStoolsALPHABETCOLORIZATIONlettercaseCOMBO\" ONCHANGE=\"javascript:CIRCLEStoolsALPHABETCOLORIZATIONcomboHANDLER();CIRCLEStoolsALPHABETCOLORIZATIONlist( $('#'+this.id).val(), YES );\"><OPTION "+( case_id == 0 ? "SELECTED=\"selected\"" : "" )+" VALUE=\"0\"><OPTION "+( case_id == 1 ? "SELECTED=\"selected\"" : "" )+" VALUE=\"1\">Lower</OPTION><OPTION "+( case_id == 2 ? "SELECTED=\"selected\"" : "" )+" VALUE=\"2\">Upper</OPTION></SELECT></td>" ;
 		HTMLcode += "<td WIDTH=\"10\"></td>" ;
 		HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLEStoolsALPHABETCOLORIZATIONapply(NO,YES);\">Apply</td>" ;
 		HTMLcode += "<td WIDTH=\"1\"></td>" ;
 		HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLEStoolsALPHABETCOLORIZATIONreset(NO,YES);\">Reset</td>" ;
 		HTMLcode += "<td WIDTH=\"10\"></td>" ;
 		HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLEStoolsALPHABETCOLORIZATIONcopy();\">Copy to</td>" ;
 		HTMLcode += "<td WIDTH=\"5\"></td>" ;
 		HTMLcode += "<td WIDTH=\"90\" ID=\"CIRCLEStoolsALPHABETCOLORIZATIONcopyLABEL\"></td>" ;
 		HTMLcode += "</tr>" ;
 		HTMLcode += "</table>" ;
 		HTMLcode += "</td>" ;
 		HTMLcode += "</tr>" ;

		if ( !is_array( _array_ref ) )
		{
			 HTMLcode += "<tr><td HEIGHT=\"20\"></td></tr>" ;
			 HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:"+DEFAULT_COLOR_ERROR+";\">Missing referencing seeds data</td></tr>" ;
			 HTMLcode += "<tr><td HEIGHT=\"20\"></td></tr>" ;
		}
		else
		{
         HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
     		 HTMLcode += "<tr>" ;
      	 HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:white;padding:3px;\">" ;
         var _keys = _array_ref.keys_associative(), _color, _COLOR_ID, MAX_ENTRIES = 7, COLUMNS = 3 ;
         var _n_keys = safe_size( _keys, 0 );
         if ( _n_keys > MAX_ENTRIES ) HTMLcode += "<DIV STYLE=\"position:relative;width:100%;height:180px;overflow:auto;\">" ;
		 		 HTMLcode += "<table>" ;
         HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;

				 for( var _k = 0 ; _k < _n_keys ; _k++ )
				 {
				 		_color = _array_ref[ _keys[_k] ] ;
				 		_COLOR_ID = "CIRCLEStoolsALPHABETCOLORIZATION_COLOR_" + _k ;
				 		if ( _k % COLUMNS == 0 ) HTMLcode += "<tr>" ;
			      HTMLcode += "<td WIDTH=\"3\"></td>";
			      HTMLcode += "<td WIDTH=\"55\" ALIGN=\"center\" STYLE=\"margin:0px;padding:0px;\" ID=\"CIRCLEStoolsALPHABETCOLORIZATION_RESPONSE_"+_keys[_k]+"\"></td>";
				 		HTMLcode += "<td WIDTH=\"3\"></td>" ;
				 		HTMLcode += "<td WIDTH=\"12\" ALIGN=\"center\">"+_keys[_k]+"</td>" ;
				 		HTMLcode += "<td WIDTH=\"5\"></td>" ;
			      HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:18px;width:18px;text-align:center;background-color:"+_color+";\" ID=\""+_COLOR_ID+"\">"+( _color.length == 0 ? "none" : "" )+"</td>" ;
			      HTMLcode += "<td WIDTH=\"5\"></td>" ;
	   	      HTMLcode += "<td ONCLICK=\"javascript:displayCOLORTABLE( '"+_COLOR_ID+"_ICON', '"+_COLOR_ID+"', function() { CIRCLEStoolsALPHABETCOLORIZATIONonselectCOLOR( "+case_id+", '"+_keys[_k]+"' ) } );\"";
			      HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\""+_COLOR_ID+"_ICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
				 		if ( _k % COLUMNS == ( COLUMNS - 1 ) ) HTMLcode += "</tr><tr><td HEIGHT=\"12\"></td></tr>" ;
				 }

         if ( _k % COLUMNS == ( COLUMNS - 1 ) ) HTMLcode += "</tr><tr><td HEIGHT=\"5\"></td></tr>" ;
		 		 HTMLcode += "</table>" ;
         if ( _n_keys > MAX_ENTRIES ) HTMLcode += "</DIV>" ;
       	 HTMLcode += "</td>" ;
       	 HTMLcode += "</tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
         HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
         if ( _self_fill_container ) $( "#CIRCLEStoolsALPHABETCOLORIZATIONlistCONTAINER" ).html( HTMLcode );
         
         CIRCLEStoolsALPHABETCOLORIZATIONcomboHANDLER();
		}

		HTMLcode += "</table>" ;
		HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
		return HTMLcode ;
}

function CIRCLEStoolsALPHABETCOLORIZATIONcopy( _silent, _question )
{
    _silent = safe_int( _silent, NO ), _question = safe_int( _question, YES );
    var _case_id = safe_int( $( "#CIRCLEStoolsALPHABETCOLORIZATIONlettercaseCOMBO" ).val(), 1 );
    if ( !is_array( _glob_lower_alphabet_colorization_array ) || !is_array( _glob_upper_alphabet_colorization_array ) )
    {
        var _msg = "Can't perform the copy: invalid input data." ;
            _msg += _glob_crlf.repeat( 2 );
            _msg += "Try to reset, update entries as you will and then copy again." ;
        circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
    }
    else
    {
        var _question_msg = "", _direction = "" ;
        if ( _case_id == 1 ) _direction = "from LOWER case colors set to UPPER case colors set" ;
        else _direction = "from UPPER case colors set to LOWER case colors set" ;
        
        _question_msg = "Confirm the copy "+_direction+" ?" ;

        var _b_go = _question ? confirm( _question_msg ) : YES ;
        if ( _b_go )
        {
             if ( _case_id == 1 ) // from lower to upper
             {
                  var _tmp = _glob_upper_alphabet_colorization_array.clone_associative();
                  _glob_upper_alphabet_colorization_array = _glob_lower_alphabet_colorization_array.clone_associative();
                  _glob_lower_alphabet_colorization_array = _tmp.clone_associative();
                  CIRCLEStoolsALPHABETCOLORIZATIONlist();
             }
             else if ( _case_id == 2 ) // from upper to lower
             {
                  var _tmp = _glob_lower_alphabet_colorization_array.clone_associative();
                  _glob_lower_alphabet_colorization_array = _glob_upper_alphabet_colorization_array.clone_associative();
                  _glob_upper_alphabet_colorization_array = _tmp.clone_associative();
                  CIRCLEStoolsALPHABETCOLORIZATIONlist();
                  
             }
             
             circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Copy "+_direction+" has been performed with success.", _glob_app_title );
        }
    }
}

function CIRCLEStoolsALPHABETCOLORIZATIONonselectCOLOR( case_id, _LETTER )
{
		case_id = safe_int( case_id, 0 );
		var _COLOR_ID = "CIRCLEStoolsALPHABETCOLORIZATION_" + _LETTER ;
		var _clr = $( "#" + _COLOR_ID ).css( "background-color" );
		var _array_ref = null ; 
		switch( case_id )
		{
				case 1: _array_ref = _glob_lower_alphabet_colorization_array ; break ;
				case 2: _array_ref = _glob_upper_alphabet_colorization_array ; break ;
        default: break ;
		}
		
		if ( _array_ref == null ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't match the color to letter: missing referenced data", _glob_app_title );
		else
		{
				$( "#CIRCLEStoolsALPHABETCOLORIZATION_RESPONSE_" + _LETTER ).css( "color", DEFAULT_COLOR_SUCCESS );
				$( "#CIRCLEStoolsALPHABETCOLORIZATION_RESPONSE_" + _LETTER ).html( "Set !" );
			  _array_ref[ _LETTER ] = _clr ;
			  setTimeout( function() { $( "#CIRCLEStoolsALPHABETCOLORIZATION_RESPONSE_" + _LETTER ).html( "" ) }, 1500 );
		}
}

function CIRCLEStoolsALPHABETCOLORIZATIONreset( _silent, _question )
{
    _silent = safe_int( _silent, NO ), _question = safe_int( _question, YES );
    var _arr = _glob_seeds_array, _n_seeds = circles_lib_count_seeds();
    if ( _n_seeds == 0 )
    {
         var _msg = "Can't reset alphabet colorization: no seed has been registered yet" ;
         if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         return [ RET_WARNING, _msg ] ;
    }
    else
    {
         var _b_ok = _question ? confirm( "Confirm to reset all settings ?" ) : YES ;
         if ( !_b_ok ) return [ RET_IRRELEVANT, "Alphabet colorization reset has been skipped by user" ] ;

         var _count = 0 ;
         for( var _i = 0 ; _i < _n_seeds ; _i++ )
         {
              ITEM = _arr[_i] ;
              if ( is_item_obj( ITEM ) )
              {
                   ITEM.complex_circle.drawcolor = _glob_draw_seed_color ;
                   _count++ ;
              }
         }

         CIRCLESinitCOLORS();
         
         var _msg = "" ;
         if ( _count == _n_seeds ) _msg = "Alphabet colorization has been reset with success to all seeds" ;
         else if ( _count == 0 ) _msg = "Alphabet colorization reset didn't affect any seed" ;
         else
         {
             _msg = "Alphabet colorization has been applied to " + _count + " entr" + ( _count == 1 ? "y" : "ies" ) + " over seed" + ( _n_seeds == 1 ? "" : "s" ) + " with success." ;
             var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, OUTPUT_SCREEN );
				     var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
					   var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "67Unknown error" ;
				     if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
         }
         circles_lib_output( OUTPUT_SCREEN, _count == _n_seeds ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, _glob_app_title );
    }
}

function CIRCLEStoolsALPHABETCOLORIZATIONapply( _silent, _question )
{
    _silent = safe_int( _silent, NO ), _question = safe_int( _question, YES );
    var _arr = _glob_seeds_array, _n_seeds = circles_lib_count_seeds();
    if ( _n_seeds == 0 )
    {
         var _msg = "Can't apply alphabet colorization: no seed has been registered yet" ;
         if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         return [ RET_WARNING, _msg ] ;
    }
    else
    {
         var _b_ok = _question ? confirm( "Confirm to apply current alphabet colorization to seeds ?" ) : YES ;
         if ( !_b_ok ) return [ RET_IRRELEVANT, "Alphabet colorization has been skipped by user" ] ;

         var ITEM = null, _symbol, _count = 0 ;
         for( var _i = 0 ; _i < _n_seeds ; _i++ )
         {
              ITEM = _arr[_i] ;
              if ( is_item_obj( ITEM ) )
              {
                   _symbol = ITEM.symbol ;
                   ITEM.complex_circle.drawcolor = _symbol.isAlphaLower() ? _glob_lower_alphabet_colorization_array[_symbol] : _glob_upper_alphabet_colorization_array[_symbol] ;
                   _count++ ;
              }
         }
         
         var _msg = "" ;
         if ( _count == 0 )
         {
            _msg += "Sorry, no seed letter seems to match the alphabet." ;
            _msg += _glob_crlf + "Thus this action has failed" ;
         }
         else
         {
            _msg = "Alphabet colorization has been applied to " ;
            _msg += _count + " entr" + ( _count == 1 ? "y" : "ies" );
            _msg += " over " + _n_seeds + " seed" + ( _n_seeds == 1 ? "" : "s" );
            var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, OUTPUT_SCREEN );
	     		  var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
						var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "68Unknown error" ;
			      if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
         }
         
         circles_lib_output( OUTPUT_SCREEN, _count != _n_seeds ? DISPATCH_WARNING : DISPATCH_SUCCESS, _msg, _glob_app_title )  ;
    }
}