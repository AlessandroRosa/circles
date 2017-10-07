function CIRCLESformsAUTOMATONload( _filename, _file_contents )
{
    var _automaton_rows = ( _file_contents.includes( CRLF_WIN ) ) ? _file_contents.split( CRLF_WIN ) : ( _file_contents.includes( CRLF_NO_WIN ) ? _file_contents.split( CRLF_NO_WIN ) : null );
    if ( _automaton_rows == null ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "'"+_filename+"' does not appear as a valid automaton data file.", _glob_app_title );
    else
    {
    		 var _b_go = YES, _row_array ;
				 CIRCLESformsAUTOMATONarray = [], CIRCLESformsAUTOMATONsrc_words_array = [] ;
         $.each( _automaton_rows, function( _i, _row )
         {
         			_row_array = ( _row.includes( "@" ) && _row.count( "@" ) == 1 ) ? _row.split( "@" ) : null ;
         			if ( is_array( _row_array ) && _row_array[1].includes( "|" ) )
         			{
						 		 CIRCLESformsAUTOMATONsrc_words_array.push( _row_array[0] );
								 CIRCLESformsAUTOMATONarray[ ""+_row_array[0] ] = _row_array[1].split( "|" );
							}
							else
							{
								_b_go = NO ;
								return ;
							}
         } );

         if ( _b_go )
				 {
		 				  CIRCLESformsAUTOMATONtableBUILD(YES);
							var _n_automaton = CIRCLESformsAUTOMATONarray.size_associative();
							$( "#CIRCLESformsAUTOMATONautomatonCOUNTER" ).html( _n_automaton + " entr" + ( _n_automaton == 1 ? "y" : "ies" ) );
							var _n_src_words = safe_size( CIRCLESformsAUTOMATONsrc_words_array, 0 );
							$( "#CIRCLESformsAUTOMATONsrcwordsCOUNTER" ).html( _n_src_words + " symbol" + ( _n_src_words == 1 ? "" : "s" ) );
				 }
         else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "'"+_filename+"' does not appear as a valid automaton data file.", _glob_app_title );
		}
}

function CIRCLESformsAUTOMATONsrcWORDadd()
{
		var _word = safe_string( $( "#CIRCLESformsAUTOMATONsrcWORD" ).val(), "" ).trim();
		if ( _word.length > 0 )
		{
				 _word = _word.replaceAll( " ", "," ).split( "," );
				 $.each( _word, function( _i, _w )
				 {
				 		 _w = _w.trim();
						 if ( !CIRCLESformsAUTOMATONsrc_words_array.includes( _w ) )
						 {
									CIRCLESformsAUTOMATONsrc_words_array.push( _w );
									CIRCLESformsAUTOMATONsrc_words_array.sort();
						 }
				 }
				 );
				 
				 if ( CIRCLESformsAUTOMATONsrc_words_array.not_includes( "e" ) ) CIRCLESformsAUTOMATONsrc_words_array.push( "e" );
				 CIRCLESformsAUTOMATONsrcwordCOMBOcreate();
		}
		else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't add word: missing input string", _glob_app_title );
}

function CIRCLESformsAUTOMATONsrcWORDdelete()
{
		var _word = safe_string( $( "#CIRCLESformsAUTOMATONsrcWORD" ).val(), "" ).trim();
		if ( _word.length > 0 )
		{
				 if ( CIRCLESformsAUTOMATONsrc_words_array.includes( _word ) )
				 {
					  CIRCLESformsAUTOMATONsrc_words_array.delete_entry( _word );
			 		  CIRCLESformsAUTOMATONsrc_words_array.sort();
				 }
				 CIRCLESformsAUTOMATONsrcwordCOMBOcreate();
		}
		else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't delete word: missing input string", _glob_app_title );
}

function CIRCLESformsAUTOMATONsrcwordCOMBOcreate( _input_src_words )
{
		if ( !is_array( _input_src_words ) ) _input_src_words = CIRCLESformsAUTOMATONsrc_words_array ;
		var _n_src_words = safe_size( _input_src_words, 0 );
		if ( _n_src_words > 0 )
		{
				 var HTMLcode = "<SELECT ID=\"CIRCLESformsAUTOMATONwordsCOMBO\" ONCHANGE=\"javascript:$('#CIRCLESformsAUTOMATONsrcWORD').val(this.value);\">" ;
				 		 HTMLcode += "<OPTION VALUE=\"\">" ;
				 _input_src_words = _input_src_words.unique();
				 $.each( _input_src_words, function( _i, _word )
								 {
								 		 _word = _word.trim();
										 HTMLcode += "<OPTION VALUE=\""+_word+"\">" + _word ;
								 }
							 );
				 		 HTMLcode += "</SELECT>" ;
				 $( "#CIRCLESformsAUTOMATONsrcwordsCOMBOcontainer" ).html( HTMLcode );
				 $( "#CIRCLESformsAUTOMATONsrcWORD" ).val( "" );
				 $( "#CIRCLESformsAUTOMATONwordsCOMBO option:eq("+( _n_src_words - 1 )+")" ).prop( "selected", true );
				 $( "#CIRCLESformsAUTOMATONsrcwordsCOUNTER" ).html( _n_src_words + " symbol" + ( _n_src_words == 1 ? "" : "s" ) );
		}
		else
		{
	 			 $( "#CIRCLESformsAUTOMATONsrcwordsCOMBOcontainer" ).html( "<SPAN STYLE=\"color:gray;\">no input words</SPAN>" );
		 		 $( "#CIRCLESformsAUTOMATONsrcwordsCOUNTER" ).html( "" );
		}
}

function CIRCLESformsAUTOMATONtableDESTROY()
{
		var _n_automaton = CIRCLESformsAUTOMATONarray.size_associative();
		if ( _n_automaton == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, "The current automaton is already empty", _glob_app_title );
		else
		{
				 var _msg = "Confirm to destroy the current automaton ?" ;
				 		 _msg += _glob_crlf + "(This operation is irreversible and the automaton table couldn't be recovered)" ;
				 if ( confirm( _msg ) )
				 {
						 CIRCLESformsAUTOMATONsrc_words_array = [], CIRCLESformsAUTOMATONarray = [] ;
						 var _n_automaton = CIRCLESformsAUTOMATONarray.size_associative();
						 $( "#CIRCLESformsAUTOMATONautomatonCOUNTER" ).html( _n_automaton + " entr" + ( _n_automaton == 1 ? "y" : "ies" ) );
						 var _n_src_words = safe_size( CIRCLESformsAUTOMATONsrc_words_array, 0 );
						 $( "#CIRCLESformsAUTOMATONsrcwordsCOUNTER" ).html( _n_src_words + " symbol" + ( _n_src_words == 1 ? "" : "s" ) );
				 		 $( "#CIRCLESformsAUTOMATONpanelCONTAINER" ).html( "" );
             $( "#CIRCLESformsAUTOMATONautomatonNAME" ).val( "" );
             $( "#CIRCLESformsAUTOMATONsrcwordsCOMBOcontainer" ).html( "" );
				 }
		}
}

function CIRCLESformsAUTOMATONtableBUILD( _create_new_table, _silent )
{
    _silent = safe_int( _silent, NO );
    _create_new_table = safe_int( _create_new_table, YES ) ;
		if ( _create_new_table ) CIRCLESformsAUTOMATONtableNEW(_silent);
		var _keys = CIRCLESformsAUTOMATONarray.keys_associative();
		var _n_keys = safe_size( _keys, 0 );
		if ( _n_keys > 0 ) $.each( _keys, function( _i, _key ) { CIRCLESformsAUTOMATONtableAPPENDENTRY( _key, _i, YES, YES ); if ( _key.toLowerCase() != "e" ) _glob_alphabet.push( _key ); } );
		var _n_automaton = CIRCLESformsAUTOMATONarray.size_associative();

		$( "#CIRCLESformsAUTOMATONautomatonCOUNTER" ).html( _n_automaton + " entr" + ( _n_automaton == 1 ? "y" : "ies" ) );
		$( "#CIRCLESformsAUTOMATONtableNEWwordEDIT" ).focus();
		$( "#CIRCLESformsAUTOMATONtableNEWwordEDIT" ).val( "" );
		CIRCLESformsAUTOMATONsrcwordCOMBOcreate();
}

function CIRCLESformsAUTOMATONtableCHECKprocessOUTPUT( _ret_chunk )
{
		switch( _ret_chunk[0] )
		{
				case CIRCLESformsAUTOMATONerrorEMPTYtable:
				circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't save: the current automaton table is empty", _glob_app_title );
				break ;
				case CIRCLESformsAUTOMATONerrorMISSINGsrcword:
				circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't save: missing source word", _glob_app_title );
				break ;
				case CIRCLESformsAUTOMATONerrorMISSINGidentity:
				circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't save: missing source word including the symbol 'I', standing for 'Identity'.", _glob_app_title );
				break ;
				case NO:
				circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The current automaton table is not consistent"+_glob_crlf+"the words '"+_ret_chunk.join( ", " )+"' have not been recorded as entries in the automaton table.", _glob_app_title );
				break ;
        default: break ;
		}
}

function CIRCLESformsAUTOMATONtableSAVE()
{
		var _keys = CIRCLESformsAUTOMATONarray.keys_associative();
		var _n_keys = safe_size( _keys, 0 );
		var _ret_chunk = CIRCLESformsAUTOMATONtableCHECK();
		switch( _ret_chunk[0] )
		{
				case YES:
				var _out_array = [] ;
						_out_array.push( CIRCLESformsAUTOMATONname );
				$.each( _keys, function( _i, _key ) { _out_array.push( _key + "@" + CIRCLESformsAUTOMATONarray[_key].join( "|" ) ); } );
				var _filename = "circles.automaton.scheme.txt" ;
				var blob = new Blob( [ _out_array.join( _glob_crlf != null ? _glob_crlf : "\r\n" ) ], { type: 'plain/text', endings: 'native' });
			  saveAs( blob, _filename );
				break ;
        default:
        CIRCLESformsAUTOMATONtableCHECKprocessOUTPUT( _ret_chunk ) ;
        break ;
		}
}     

function CIRCLESformsAUTOMATONtableRESET( _silent )
{
		_silent = safe_size( _silent, NO );
		var _msg = "Reset operation is irreversible and will definitely erase all automaton data." ;
				_msg += _glob_crlf.repeat(2) + "Confirm to reset the automaton ?" ;
		var _b_go = ( !_silent && safe_size( CIRCLESformsAUTOMATONarray, 0 ) > 0 ) ? confirm( _msg ) : YES ;
		if ( _b_go )
		{
			CIRCLESformsAUTOMATONarray = [], CIRCLESformsAUTOMATONsrc_words_array = [] ;
    	CIRCLESformsAUTOMATONname = "" ;
		}
}

function CIRCLESformsAUTOMATONtableCHECK()
{
		var _keys = CIRCLESformsAUTOMATONarray.keys_associative();
		if ( safe_size( _keys, 0 ) == 0 ) return [ CIRCLESformsAUTOMATONerrorMISSINGsrcword, null ] ;
		else
		{
				var _src_words = CIRCLESformsAUTOMATONsrc_words_array ;
				var _n_words = safe_size( _src_words, 0 );
				if ( _n_words == 0 ) return [ CIRCLESformsAUTOMATONerrorEMPTYtable, null ] ;
				else
				{
						var _b_go = YES, _ret_chunk = [] ;
						for( var _w = 0 ; _w < _n_words ; _w++ )
						{
								 if ( !_keys.includes( _src_words[_w] ) )
								 {
								 		 _b_go &= NO ;
								 		 _ret_chunk.push( _src_words[_w] );
								 }
						}
            
            var _symbols = [], _words = [] ;
            $( "[id^=AUTOMATON_ENTRY_SYMBOL_]" ).each( function( _counter, _item )
            {
                _symbols.push( $( "#"+_item.id ).html() ) ;
            }
            ) ;
            
            if ( _symbols.has_duplicates() )
            circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Found duplicate entries in the current automaton table", _glob_app_title );
            else
            {
                var _errors = [] ;
                $( "[id^=AUTOMATON_ENTRY_WORD_]" ).each( function( _counter, _item )
                {
                    if ( _symbols.not_includes( $( "#"+_item.id ).val() ) )
                    {
                        var COORDS = _item.id.replaceAll( "AUTOMATON_ENTRY_WORD_", "" ).split( "_" ) ;
                        var ROW_NTH = COORDS[0], COL_NTH = COORDS[1] ;
                        
                        var _MSG = "Word '"+$( "#"+_item.id ).val()+"' at row " + ROW_NTH + ", column " + COL_NTH ;
                            _MSG += "\ndoes not match announced entries" ;
                        $( "#" + _item.id ).css( "background-color", "#FFE997" );
                        _errors.push( _MSG ) ;
                    }
                    else $( "#" + _item.id ).css( "background-color", "white" );
                }
                ) ;

                if ( _errors.length > 0 )
                {
                    var _MSG = "Found "+_errors.length+" error"+( _errors.length == 1 ? "" : "s" ) + "\n\n"
                    _MSG += _errors.join( "\n\n" ) ;
                    circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _MSG, _glob_app_title );
                }
            }

						return [ _b_go, _ret_chunk.clone() ] ;
				}
		}
}

function CIRCLESformsAUTOMATONtableNEW( _silent )
{
    _silent = safe_int( _silent, NO );
		var _n_src_words = safe_size( CIRCLESformsAUTOMATONsrc_words_array, 0 );
    var _b_go = ( _n_src_words > 0 && !_silent ) ? confirm( "Do you want to clean the current table ?" ) : YES ;
		if ( _b_go )
		{
        $( "#CIRCLESformsAUTOMATONautomatonNAME" ).val( "" );
        var HTMLcode = "<table CLASS=\"general_rounded_corners\" STYLE=\"padding:4px;background-color:#F0F0FE;\" ID=\"CIRCLESformsAUTOMATONmasterTABLE\" ALIGN=\"center\">" ;
						HTMLcode += "<thead>" ;
						HTMLcode += "<tr><td COLSPAN=\"14\" CLASS=\"general_rounded_corners\" STYLE=\"padding:8px;background-color:#DAE2EB;font-size:12pt;\" ALIGN=\"center\">Cayley table</td></tr>" ;
						HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
						HTMLcode += "<tr>" ;
						HTMLcode += "<td WIDTH=\"15\"></td>" ;
						HTMLcode += "<td WIDTH=\"30\">Entry</td>" ;
						HTMLcode += "<td WIDTH=\"5\"></td>" ;
				for( var _cols = 0 ; _cols < _n_src_words ; _cols++ ) HTMLcode += "<td WIDTH=\"60\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:white;padding:4px;\" ALIGN=\"center\">"+CIRCLESformsAUTOMATONsrc_words_array[_cols]+"</td>" ;
						HTMLcode += "<td WIDTH=\"2\"></td>" ;
						HTMLcode += "<td COLSPAN=\"3\" CLASS=\"general_rounded_corners\" STYLE=\"padding:4px;background-color:#E6EBF0;\" ALIGN=\"center\">Action</td>" ;
						HTMLcode += "</tr>" ;
						HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
						HTMLcode += "</thead>" ;
						HTMLcode += "<tbody>" ;
						HTMLcode += "</tbody>" ;
						HTMLcode += "</table>" ;
				$( "#CIRCLESformsAUTOMATONpanelCONTAINER" ).html( HTMLcode );
		}
}

function CIRCLESformsAUTOMATONtableAPPENDENTRY( _key, _prog_num, _silent, _force )
{
		_key = safe_string( _key, "" ).trim();
		_prog_num = safe_int( _prog_num, UNDET );
		_silent = safe_int( _silent, NO ), _force = safe_int( _force, NO );
		var _input_key_exists = ( _key.length > 0 && CIRCLESformsAUTOMATONarray[_key] != null ) ? YES : NO ;
		var _new_word = _input_key_exists ? _key : $( "#CIRCLESformsAUTOMATONtableNEWwordEDIT" ).val();
    var _n_src_words = safe_size( CIRCLESformsAUTOMATONsrc_words_array, 0 );
    var _w_sz = safe_size( _new_word, 0 );
    if ( _n_src_words == 0 && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't append a new entry : missing source alphabet", _glob_app_title );
    else if ( $( "#CIRCLESformsAUTOMATONpanelCONTAINER" ).html().length == 0 && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't append a new entry : please build a new Cayley table", _glob_app_title );
    else if ( _w_sz == 0 && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't append a new entry : missing new input word", _glob_app_title );
    else if ( !_force && CIRCLESformsAUTOMATONpending ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "There are pending entries needing to be filled and saved", _glob_app_title );
    //else if ( _input_key_exists ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The entry '"+_key+"' already exists in the current Cayley table", _glob_app_title );
		else if ( _w_sz > 0 )
		{
				var _single_letter_alphabet = [], _w_array ;
				$.each( CIRCLESformsAUTOMATONsrc_words_array, function( _i, _word )
								{
								 		_w_array = _word.split( "" );
								 		$.each( _w_array, function( _j, _w ) { if ( !_single_letter_alphabet.includes( _w ) ) _single_letter_alphabet.push( _w ); } );
								} );
		
				if ( !_single_letter_alphabet.includes( "e" ) ) _single_letter_alphabet.push( "e" );
				var _check_passed = circles_lib_word_check( _new_word, _single_letter_alphabet ) == YES ? YES : NO ;
				if ( _check_passed )
				{
						var _row_exists = NO, _entry_ctrl_id = "" ;
						$( "[id^=AUTOMATON_ENTRY_SYMBOL_]" ).each( function( _i, _ctrl )
						{
								if ( $( "#" + _ctrl.id ).html().strcmp( _new_word ) )
								{
										_row_exists = YES, _entry_ctrl_id = _ctrl.id ;
										return ;
								}
						} );
						var _insert = _input_key_exists ? true : CIRCLESformsAUTOMATONarray[ _new_word ] == null ;
						if ( _insert && _row_exists == NO )
						{
								var _n_src_words = safe_size( CIRCLESformsAUTOMATONsrc_words_array, 0 );
								var _n_automaton = CIRCLESformsAUTOMATONarray.size_associative();
								var ONKEYUP = "", _n = _prog_num == UNDET ? _n_automaton : _prog_num ;
								var HTMLcode = "<tr>" ;
										HTMLcode += "<td WIDTH=\"2\"></td>" ;
										HTMLcode += "<td WIDTH=\"30\" ID=\"AUTOMATON_ENTRY_SYMBOL_"+_n+"\">"+_new_word+"</td>" ;
										HTMLcode += "<td WIDTH=\"5\"></td>" ;
										for( var _cols = 0 ; _cols < _n_src_words ; _cols++ )
										{
												ONKEYUP = _cols == _n_src_words - 1 ? "ONKEYUP=\"javascript:CIRCLESformsAUTOMATONeventsHANDLER(event, this.id, "+_n+");\"" : "" ;
												HTMLcode += "<td><INPUT "+ONKEYUP+" STYLE=\"width:60px;\" VALUE=\""+( _input_key_exists ? CIRCLESformsAUTOMATONarray[_key][ _cols ] : "" )+"\" ID=\"AUTOMATON_ENTRY_WORD_"+_n+"_"+_cols+"\" TYPE=\"edit\"></td>" ;
										}
										HTMLcode += "<td WIDTH=\"2\"></td>" ;
										HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsAUTOMATONtableSAVEENTRY("+_n+");\">Save</td>" ;
										HTMLcode += "<td WIDTH=\"1\"></td>" ;
										HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsAUTOMATONtableDELETEENTRY("+_n+");\">Delete</td>" ;
										HTMLcode += "<td WIDTH=\"2\"></td>" ;
										HTMLcode += "<td COLSPAN=\"3\" WIDTH=\"70\" ALIGN=\"center\" ID=\"AUTOMATON_ENTRY_OUTPUT_"+_n+"\"></td>" ;
										HTMLcode += "</tr>" ;
								$('#CIRCLESformsAUTOMATONmasterTABLE tbody').append( HTMLcode );

								var innerTABLEcode = $( "#CIRCLESformsAUTOMATONpanelCONTAINER" ).find( "div" ).contents().unwrap().end().end().html();
								if ( _n_automaton > 10 )
										innerTABLEcode = "<div ID=\"CIRCLESformsAUTOMATONpanelCONTAINERwrappingDIV\" STYLE=\"position:relative;width:100%;height:200px;overflow:auto;\">"+innerTABLEcode+"</div>" ;
								$( "#CIRCLESformsAUTOMATONpanelCONTAINER" ).html( innerTABLEcode );
								$( "#AUTOMATON_ENTRY_WORD_" + _n_automaton + "_" + 0 ).focus();
								
								CIRCLESformsAUTOMATONpending = _force ? 0 : 1 ;
								$( "#CIRCLESformsAUTOMATONglobalSTATUS" ).html( _force ? "" : "<SPAN STYLE=\"color:orange;\">Pending</SPAN>" );
						}
				}
				else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The word entry '"+_new_word+"' does not match the current automaton alphabet: " + CIRCLESformsAUTOMATONsrc_words_array.join( ", " ), _glob_app_title );
		}
}

function CIRCLESformsAUTOMATONtableDELETEENTRY( _row_index )
{
		var _key = $( "#AUTOMATON_ENTRY_SYMBOL_" + _row_index ).html();
		if ( _key.length == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing entry reference for deletion", _glob_app_title );
		else
		{
  		 if ( confirm( "Confirm to delete the entry announced by word '"+_key+"' ?" ) )
			 {
			 		CIRCLESformsAUTOMATONarray.remove_key(_key);
			 		CIRCLESformsAUTOMATONtableBUILD(YES);
			 }
		}
}

function CIRCLESformsAUTOMATONtableSAVEENTRY( _row_index )
{
		var _w = "", _check_passed, _alphabet, _b_go = YES ;
		var _key = $( "#AUTOMATON_ENTRY_SYMBOL_" + _row_index ).html(), _token = [] ;
				_key = safe_string( _key, "" );
		if ( _key.length == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing entry reference for deletion", _glob_app_title );
		else
		{
				var _src_words_array = CIRCLESformsAUTOMATONsrc_words_array.clone();
						_src_words_array.push( "e" ); // includes the identity element
				$( "#AUTOMATON_ENTRY_OUTPUT_" + _row_index ).html( "" );
				$( "#AUTOMATON_ENTRY_OUTPUT_" + _row_index ).css( "color", DEFAULT_COLOR_STD );
				$.each( $( "[id^=AUTOMATON_ENTRY_WORD_" + _row_index + "_]" ), function( _i, _chunk )
								{
										_w = $( "#" + _chunk.id ).val(); // no entry shall include 'identity' symbols
										_check_passed = safe_size( _w, 0 ) == 0 ? NO : circles_lib_word_check( _w, _src_words_array );
										circles_lib_extras_htmlctrl_enable( _chunk.id, _check_passed ) ;
										if ( !_check_passed )
										{
												_b_go = NO ;
												return ;
										}
										else _token.push( _w );
								}
							);

				if ( _b_go && safe_size( _token, 0 ) > 0 )
				{
						CIRCLESformsAUTOMATONarray[''+_key] = _token.clone();		
						$( "#AUTOMATON_ENTRY_OUTPUT_" + _row_index ).css( "color", DEFAULT_COLOR_SUCCESS );
						$( "#AUTOMATON_ENTRY_OUTPUT_" + _row_index ).html( "Entry saved" );
						var _n_automaton = CIRCLESformsAUTOMATONarray.size_associative();
						$( "#CIRCLESformsAUTOMATONautomatonCOUNTER" ).html( _n_automaton + " entr" + ( _n_automaton == 1 ? "y" : "ies" ) );
						var _n_src_words = safe_size( CIRCLESformsAUTOMATONsrc_words_array, 0 );
						$( "#CIRCLESformsAUTOMATONsrcwordsCOUNTER" ).html( _n_src_words + " symbol" + ( _n_src_words == 1 ? "" : "s" ) );
				}
					
				$( "#CIRCLESformsAUTOMATONtableNEWwordEDIT" ).focus();
				$( "#CIRCLESformsAUTOMATONtableNEWwordEDIT" ).val( "" );
				setTimeout( function(){ $( "#AUTOMATON_ENTRY_OUTPUT_" + _row_index ).html( "" ) }, 1800 );

				CIRCLESformsAUTOMATONpending = 0 ;
				$( "#CIRCLESformsAUTOMATONglobalSTATUS" ).html( "" );
		}
}

function CIRCLESformsAUTOMATONconstructorTABLE( _base_id, _subset )
{
		var HTMLcode = "<table WIDTH=\"100%\">" ;
				HTMLcode += "<tr>" ;
				HTMLcode += "<td CLASS=\"popup_buttons_bar\" ID=\"CIRCLESformsAUTOMATONwordBAR\">" ;
				HTMLcode += "<table>" ;
				HTMLcode += "<tr>" ;
				HTMLcode += "<td WIDTH=\"5\"></td>" ;
				HTMLcode += "<td>Symbol(s)</td>" ;
				HTMLcode += "<td WIDTH=\"3\"></td>" ;
				HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"CIRCLESformsAUTOMATONsrcWORD\" STYLE=\"width:50px;\" ONKEYUP=\"javascript:CIRCLESformsAUTOMATONeventsHANDLER(event, this.id);\"></td>" ;
				HTMLcode += "<td WIDTH=\"3\"></td>" ;
				HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsAUTOMATONsrcWORDadd();\">Add</td>" ;
				HTMLcode += "<td WIDTH=\"3\"></td>" ;
				HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsAUTOMATONsrcWORDdelete();\">Delete</td>" ;
				HTMLcode += "<td WIDTH=\"3\"></td>" ;
				HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsAUTOMATONsrcWORDextractFROMgroup();\">Pull out of current config</td>" ;
				HTMLcode += "<td WIDTH=\"3\"></td>" ;
				HTMLcode += "<td ID=\"CIRCLESformsAUTOMATONsrcwordsCOMBOcontainer\"></td>" ;
				HTMLcode += "<td WIDTH=\"8\"></td>" ;
				HTMLcode += "<td ID=\"CIRCLESformsAUTOMATONsrcwordsCOUNTER\"></td>" ;
				HTMLcode += "<td WIDTH=\"8\"></td>" ;
				HTMLcode += "<td ID=\"CIRCLESformsAUTOMATONglobalSTATUS\"></td>" ;
				HTMLcode += "</tr>" ;
				HTMLcode += "</table>" ;
				HTMLcode += "</td>" ;
				HTMLcode += "</tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;

				HTMLcode += "<tr>" ;
				HTMLcode += "<td CLASS=\"popup_buttons_bar\" ID=\"CIRCLESformsAUTOMATONpresetsBAR\">" ;
				HTMLcode += "<table>" ;
				HTMLcode += "<tr>" ;
				HTMLcode += "<td WIDTH=\"5\"></td>" ;
				HTMLcode += "<td>Preset table</td>" ;
				HTMLcode += "<td WIDTH=\"3\"></td>" ;
				HTMLcode += "<td><SELECT ID=\"CIRCLESformsAUTOMATONpresetsCOMBO\" ONCHANGE=\"javascript:CIRCLESformsAUTOMATONtableLOADpreset();\">" ;
				HTMLcode += "<OPTION VALUE=\"\">" ;
				var _keys = _glob_preset_automatons_array.keys_associative();
				$.each( _keys, function( _i, _key ){ HTMLcode += "<OPTION VALUE=\""+_key+"\">" + _key ; } );
				HTMLcode += "</SELECT></td>" ;
				HTMLcode += "<td WIDTH=\"12\"></td>" ;
				HTMLcode += "<td>Symbol</td>" ;
				HTMLcode += "<td WIDTH=\"5\"></td>" ;
				HTMLcode += "<td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsAUTOMATONname=this.value;\" ID=\"CIRCLESformsAUTOMATONautomatonNAME\" STYLE=\"width:140px;\"></td>" ;
				HTMLcode += "<td WIDTH=\"8\"></td>" ;
				HTMLcode += "<td ID=\"CIRCLESformsAUTOMATONautomatonCOUNTER\"></td>" ;
				HTMLcode += "</tr>" ;
				HTMLcode += "</table>" ;
				HTMLcode += "</td>" ;
				HTMLcode += "</tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td COLSPAN=\"3\" CLASS=\"general_rounded_corners\" STYLE=\"padding:4px;background-color:#F3F3FE;\" ID=\"CIRCLESformsAUTOMATONnewwordBAR\">" ;
				HTMLcode += "<table>" ;
				HTMLcode += "<tr>" ;
				HTMLcode += "<td WIDTH=\"5\"></td>" ;
			  HTMLcode += "<td>New word</td>" ;
				HTMLcode += "<td WIDTH=\"5\"></td>" ;
				HTMLcode += "<td><INPUT ID=\"CIRCLESformsAUTOMATONtableNEWwordEDIT\" TYPE=\"edit\" STYLE=\"width:60px;\" ONKEYUP=\"javascript:CIRCLESformsAUTOMATONeventsHANDLER(event, this.id);\"></td>" ;
				HTMLcode += "<td WIDTH=\"5\"></td>" ;
				HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsAUTOMATONtableAPPENDENTRY('','',NO,NO);\">Add entry</td>" ;
        HTMLcode += "</tr>" ;
				HTMLcode += "</table>" ;
				HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
				HTMLcode += "<tr><td COLSPAN=\"3\" ID=\"CIRCLESformsAUTOMATONpanelCONTAINER\"></td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

				HTMLcode += "</table>" ;
		return HTMLcode ;
}

function CIRCLESformsAUTOMATONsrcWORDextractFROMgroup()
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array );
    if ( _items_n > 0 )
    {
   		 var _input_src_words = [] ;
			 $.each( _items_array,
			 				 function( _i, _item )
			 				 {
									if ( is_item_obj( _item ) )
									{
										 _item.symbol = safe_string( _item.symbol, "" ).trim();
										 if ( _item.symbol.length > 0 ) _input_src_words.push( _item.symbol );
									}
							 }
			 			 );

		 	 if ( _input_src_words.length > 0 ) CIRCLESformsAUTOMATONsrcwordCOMBOcreate( _input_src_words );
			 else circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "The current group includes no symbols yet.", _glob_app_title );
		}
		else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't extract: no group has been declared yet", _glob_app_title );
}

function CIRCLESformsAUTOMATONtableLOADpreset()
{
		var _key = $( "#CIRCLESformsAUTOMATONpresetsCOMBO option:selected" ).val();
    if ( safe_string( _key, "" ).trim().length > 0 )
    {
    		CIRCLESformsAUTOMATONarray = _glob_preset_automatons_array[_key].clone_associative();
    		CIRCLESformsAUTOMATONsrc_words_array = _glob_automatons_src_words_array[_key] ;
    		CIRCLESformsAUTOMATONtableBUILD(YES);
    		$( "#CIRCLESformsAUTOMATONautomatonNAME" ).val( _key );
    		var _n_automaton = CIRCLESformsAUTOMATONarray.size_associative();
    		$( "#CIRCLESformsAUTOMATONautomatonCOUNTER" ).html( _n_automaton + " entr" + ( _n_automaton == 1 ? "y" : "ies" ) );
    		var _n_src_words = safe_size( CIRCLESformsAUTOMATONsrc_words_array, 0 );
    		$( "#CIRCLESformsAUTOMATONsrcwordsCOUNTER" ).html( _n_src_words + " symbol" + ( _n_src_words == 1 ? "" : "s" ) );
    		
    		CIRCLESformsAUTOMATONresize( $("#"+CIRCLESformsAUTOMATONdiv_id).width(), $("#"+CIRCLESformsAUTOMATONdiv_id).height() );
    }
}

function CIRCLESformsAUTOMATONtablePULLOUT( _silent )
{
    _silent = safe_int( _silent, YES );
    CIRCLESformsAUTOMATONarray = _glob_dict_processor.automaton_table.clone_associative();
    var _n_keys = CIRCLESformsAUTOMATONarray.size_associative();
    if ( _n_keys == 0 )
    {
        if ( !_silent )
        {
            var _msg = "Can't pull out the automaton from the current configuration." ;
            circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
        }
        return NO ;
    }
    else
    {
        $( "#CIRCLESformsAUTOMATONpanelCONTAINER" ).html( "" );
        CIRCLESformsAUTOMATONsrc_words_array.flush();
        
        var _keys = CIRCLESformsAUTOMATONarray.keys_associative();
        for( var _k = 0 ; _k < _keys.length ; _k++ )
			  if ( !_keys[ _k ].stricmp( "e" ) ) CIRCLESformsAUTOMATONsrc_words_array.push( _keys[ _k ] );

        CIRCLESformsAUTOMATONtableBUILD(YES,_silent);

    		$( "#CIRCLESformsAUTOMATONautomatonNAME" ).val( "" );
    		var _n_automaton = CIRCLESformsAUTOMATONarray.size_associative();
    		$( "#CIRCLESformsAUTOMATONautomatonCOUNTER" ).html( _n_automaton + " entr" + ( _n_automaton == 1 ? "y" : "ies" ) );
    		var _n_src_words = safe_size( CIRCLESformsAUTOMATONsrc_words_array, 0 );
    		$( "#CIRCLESformsAUTOMATONsrcwordsCOUNTER" ).html( _n_src_words + " symbol" + ( _n_src_words == 1 ? "" : "s" ) );

        if ( !_silent )
        {
            var _msg = "The automaton has been pulled out from current configuration with success." ;
            circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
        }
        return NO ;
    }
}

function CIRCLESformsAUTOMATONtableSET( _silent )
{
		var _ret_chunk = CIRCLESformsAUTOMATONtableCHECK();
		switch( _ret_chunk[0] )
		{
				case YES:
        _silent = safe_int( _silent, YES ), _glob_dict_processor.automaton_table_flush();
        var _n_keys = _glob_dict_processor.automaton_keys_count();
        if ( _n_keys == 0 )
        {
            var _keys = CIRCLESformsAUTOMATONarray.keys_associative();
            for( var _k = 0 ; _k < _keys.length ; _k++ )
            _glob_dict_processor.automaton_set_entry( _keys[ _k ], CIRCLESformsAUTOMATONarray[ _keys[ _k ] ] );
    
            var _n_keys = _glob_dict_processor.automaton_keys_count();
            if ( !_silent )
            {
                var _msg = _n_keys > 0 ? "The new automaton has been set up with success" : "Problems while setting up the new automaton" ;
                if ( _n_keys == 0 ) _msg += _glob_crlf.repeat(2) + "No keys have been added" ;
                else _msg += _glob_crlf.repeat(2) + _n_keys+ " key" + ( _n_keys == 1 ? " has" : "s have" ) + " been added." ;
                circles_lib_output( OUTPUT_SCREEN, _n_keys > 0 ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, _glob_app_title );
            }
            return _n_keys > 0 ? YES : NO ;
        }
        else
        {
            if ( !_silent )
            {
                var _msg = "Can't set up the new automaton: it's not possible to erase the previous settings." ;
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
            }
            return NO ;
        }
				break ;
        default:
        CIRCLESformsAUTOMATONtableCHECKprocessOUTPUT( _ret_chunk ) ;
        break ;
		}

}

function CIRCLESformsAUTOMATONtablePULLOUTask()
{
    if ( _glob_dict_processor.automaton_table.size_associative() > 0 )
    {
         if ( CIRCLESformsAUTOMATONarray.size_associative() > 0 )
         {
             var _msg = "Operation <b>pulling out the dictionary automaton into a table</b>" ;
                 _msg += _glob_crlf.repeat(2) + "This operation will erase the current settings." ;
                 _msg += _glob_crlf.repeat(2) + "Confirm and proceed ?" ;
             alert_plug_fn( ALERT_YES, "alertCLOSE();CIRCLESformsAUTOMATONtablePULLOUT(NO);" );
             alert_plug_fn( ALERT_NO, "alertCLOSE();" );
             circles_lib_output( OUTPUT_SCREEN, DISPATCH_QUESTION | DISPATCH_YESNO, _msg, _glob_app_title, 480 );
         }
         else CIRCLESformsAUTOMATONtablePULLOUT(NO);
    }
    else
    {
         var _msg = "Can't pull out the automaton from current group configuration." ;
             _msg += _glob_crlf.repeat(2) + "Please load a preset or fill it manually." ;
         circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
    }
}

function CIRCLESformsAUTOMATONtableSETask()
{
    if ( CIRCLESformsAUTOMATONarray.size_associative() > 0 )
    {
         var _msg = "You are going to <b>set the table below into the dictionary automaton</b>" ;
             _msg += _glob_crlf.repeat(2) + "This operation will erase the current settings." ;
             _msg += _glob_crlf.repeat(2) + "Confirm and proceed ?" ;
         alert_plug_fn( ALERT_YES, "alertCLOSE();CIRCLESformsAUTOMATONtableSET(NO);" );
         alert_plug_fn( ALERT_NO, "alertCLOSE();" );
         circles_lib_output( OUTPUT_SCREEN, DISPATCH_QUESTION | DISPATCH_YESNO, _msg, _glob_app_title );
    }
    else
    {
         var _msg = "Can't set it: the current automaton table is empty." ;
             _msg += _glob_crlf.repeat(2) + "Please load a preset or fill it manually." ;
         circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
    }
}