function CIRCLESmethodMANAGERrepetendsSTORE( _question, _silent )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    var _b_go = _question ? confirm( "This operation will erase all previously saved repetends. Continue ?" ) : YES ;
    if ( _b_go )
    {
        var _i = 0, _word, _termination ;
        _glob_repetends_array.flush_associative();
        while( $( "#ALGEBRAICrepetendWORD_" + _i ).get(0) != null )
        {
            _word = $( "#ALGEBRAICrepetendWORD_" + _i ).val();
            _termination = $( "#ALGEBRAICrepetendTERMINATION_" + _i ).val();
            _glob_repetends_array[ _termination ] = _word ;
            _i++ ;
        }

        var _new_n = safe_int( _glob_repetends_array.size_associative(), 0 );
        if ( _new_n == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "No repetends have been saved", _glob_app );
        else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _new_n + " repetend" + ( _new_n == 1 ? " has " : " have" )+ " been saved", _glob_app );
    }
}

function CIRCLESmethodMANAGERrepetendsCHECK()
{
    var _len = _glob_repetends_array.size_associative(), _unsolved_repetend, _solved_repetend ;
    if ( _len == 0 ) return YES ;
    else
    {
        var _ok = YES, _all_ok = YES, _index = 0 ;
        var _keys = _glob_repetends_array.keys_associative();
        for( var _i = 0 ; _i < _keys.length ; _i++ )
        {
						if ( is_array( _glob_repetends_array[ _keys[_i] ] ) )
						{
							  $.each( _glob_repetends_array[ _keys[_i] ],
												function( _r, _rep )
												{
						              _unsolved_repetend = _rep ;
													_solved_repetend = circles_lib_repetends_resolve( _unsolved_repetend );
													_ok = circles_lib_word_check( _solved_repetend, _glob_alphabet );
													if ( $( "#ALGEBRAICrepetendWORD_" + _index ).get(0) != null )
													{
														 if ( $( "#ALGEBRAICrepetendWORD_" + _index ).val().strcmp( _unsolved_repetend ) )
												 		 circles_lib_extras_htmlctrl_enable( "ALGEBRAICrepetendWORD_" + _index, _ok ) ;
													}
													_all_ok &= _ok ;			
													_index++ ;
												}
											); 
						}
				}
        return _all_ok ;
    }
}

function CIRCLESmethodMANAGERrepetendsSAVE()
{
  	var _N_REPS = _glob_repetends_array.size_recursive(), GEN_CHUNK, _FOUND = NO ;
    if ( _N_REPS == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't save: no repetends have been registered yet.", _glob_app + " - " + _plugin_definitions_array[_plugin_last_ref] );
    else
    {
        var _out_stream = [] ;
            _out_stream.push( "// Circles - Repetends table" + _glob_crlf  );
            _out_stream.push( "// Saved on " + today_date() + " - " + current_time() + _glob_crlf );
            _out_stream.push( "// Current alphabet is " + circles_lib_alphabet_get().join( ", " ) + _glob_crlf );

        var _keys = _glob_repetends_array.keys_associative();

        $.each( _keys,
                function( _i, _termination )
                {
                   var _chunk = _glob_repetends_array[_termination] ;
                   if ( _chunk != null )
                   {
                        $.each( _chunk, function( _j, _rep ) { _out_stream.push( _termination + "@" + _rep + _glob_crlf ) } );
                   }
                }
              );

        var blob = new Blob( _out_stream, { type: 'plain/text', endings: 'native' });
        saveAs( blob, "circles.repetends.txt" );
    }
}

function CIRCLESmethodMANAGERrepetendsBOMB( _question, _silent )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    var _b_go = ( !_question || _glob_repetends_array.size_associative() == 0 ) ? NO : confirm( "Do you confirm to clean the whole repetends list ?" );
    if ( _b_go )
    {
         _glob_repetends_array.flush_associative();
         CIRCLESmethodMANAGERrepetendsLIST();
    }
}

function CIRCLESmethodMANAGERrepetendsCLEAN( _question )
{
    if ( $( "#ALGEBRAICrepetendsINPUTword" ).val().length > 0 ||
         $( "#ALGEBRAICrepetendsINPUTtermination" ).val().length > 0 )
    {
        _question = safe_int( _question, YES );
        var _b_go = _question ? confirm( "Clean input repetend list ?" ) : YES ;
        if ( _b_go )
        {
             $( "#ALGEBRAICrepetendsINPUTword" ).val( "" );
             $( "#ALGEBRAICrepetendsINPUTtermination" ).val( "" );
        }
    }
}

function CIRCLESmethodMANAGERrepetendsADD( _question, _i, _old_rep, _old_termination )
{
    _question = safe_int( _question, YES ), _i = safe_int( _i, UNDET );
    var _word_ctrl_id = _i == UNDET ? "ALGEBRAICrepetendsINPUTword" : "ALGEBRAICrepetendWORD_" + _i ;
    var _termination_ctrl_id = _i == UNDET ? "ALGEBRAICrepetendsINPUTtermination" : "ALGEBRAICrepetendTERMINATION_" + _i ;
    var _rep = safe_string( $( "#" + _word_ctrl_id ).val(), "" );
    var _termination = safe_string( $( "#" + _termination_ctrl_id ).val(), "" );
    if ( _rep.length > 0 && _termination.length > 0 )
    {
        var _check_rep = circles_lib_repetends_check_syntax( null, _rep );
        var _solved_rep = _check_rep ? circles_lib_repetends_resolve( _rep ) : _rep ;
        var _check_termination = _termination.testME( _glob_word_regex_pattern );
		    circles_lib_extras_htmlctrl_enable( _word_ctrl_id, _check_rep ) ;
		    circles_lib_extras_htmlctrl_enable( _termination_ctrl_id, _check_termination ) ;
        if ( !_check_rep )
        {
             var _msg = "Error input repetend: syntax error, probably invalid characters" ;
                 _msg += _glob_crlf.repeat( 2 ) + "Allowed characters for repetends are:" ;
                 _msg += _glob_crlf + "* western alphabet ;" ;
                 _msg += _glob_crlf + "* arabic numbers ;" ;
                 _msg += _glob_crlf + "* punctuations : [, ], * ;" ;
             circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
        }
        else if ( !_check_termination ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Error input repetend: invalid termination", _glob_app );
        else if ( !circles_lib_word_check( _solved_rep, _glob_alphabet ) ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The input repetend '"+_rep+"' does not match the current alphabet ("+_glob_alphabet.join(",")+")", _glob_app );
        else if ( !circles_lib_word_check( _termination, _glob_alphabet ) ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The input termination '"+_termination+"' does not match the current alphabet ("+_glob_alphabet.join(",")+")", _glob_app );
        else
        {
            if ( _rep.includes( "*" ) )
            {
                if ( !_rep.start_with( "[" ) ) _rep = "[" + _rep ;
                if ( !_rep.end_with( "]" ) ) _rep = _rep + "]" ;
            }
    
            var _msg = "", _stored_termination = safe_string( _termination, "" );
            var _exists = _glob_repetends_array[ _termination ] != null ? _glob_repetends_array[ _termination ].includes( _rep ) : NO ;
            if ( _exists )
            {
                _msg = "The termination '"+_termination+"' already includes the repetend '"+_rep+"'." + _glob_crlf ;
                circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
            }
            else
            {
            		if ( !is_array( _glob_repetends_array[_termination] ) ) _glob_repetends_array[_termination] = [] ;
                _glob_repetends_array[_termination].push( _rep );
                CIRCLESmethodMANAGERrepetendsLIST();
            }
        }
    }
    else
    {
        var _msg = "It's impossible to add the repetends:" ;
        if ( _word.length > 0 ) _msg += _glob_crlf + "* missing input word" ;
        if ( _termination.length > 0 ) _msg += _glob_crlf + "* missing input termination" ;
    }
}

function CIRCLESmethodMANAGERrepetendsUPDATE( _question, _index, _old_value )
{
    _question = safe_int( _question, YES ), _index = safe_int( _index, UNDET );
    if ( _index == UNDET ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing entry reference to perform the update", _glob_app );
    else
    {
         var _new_value = $( "#ALGEBRAICrepetendWORD_" + _index ).val();
         var _termination = $( "#ALGEBRAICrepetendTERMINATION_" + _index ).val();
         var _check_rep = circles_lib_repetends_check_syntax( null, _new_value );
         if ( !_check_rep ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't update: wrong repetend syntax for entry '"+_new_value+"'", _glob_app );
         else
         {
             var _b_go = _question ? confirm( "Confirm to update repetend '"+_old_value+"' with new value '"+_new_value+"' ?" ) : YES ;
             if ( _b_go )
             {
                 var _chunk = _glob_repetends_array[ _termination ] ;
                 if ( _chunk == null ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Invalid termination letter '"+_termination+"' to perform the update", _glob_app );
                 else
                 {
                      var _b_found = NO ;
                      $.each( _chunk,
                              function( _i, _word )
                              {
                                   if ( _word.strcmp( _old_value ) )
                                   {
                                       _chunk[_i] = _new_value, _b_found = YES ;
                                       return NO ;
                                   }
                              }
                            );

                      if ( _b_found )
                      {
                          CIRCLESmethodMANAGERrepetendsLIST();
                          $( "#ALGEBRAICrepetendWORD_" + _index ).css( "background-color", "#A5F5A5" );
                          $( "#ALGEBRAICrepetendTERMINATION_" + _index ).css( "background-color", "#A5F5A5" );
                          setTimeout( function()
                                      {
                                          $( "#ALGEBRAICrepetendWORD_" + _index ).css( "background-color", "white" );
                                          $( "#ALGEBRAICrepetendTERMINATION_" + _index ).css( "background-color", "white" );
                                      }, 1000 );
                      }
                      else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't find out the correct entry to update.", _glob_app );
                 }
             }
         }
    }
}

function CIRCLESmethodMANAGERrepetendsDELETE( _question, _termination, _rep )
{
    _question = safe_int( _question, YES ), _termination = safe_string( _termination, "" );
    _rep = safe_string( _rep, "" );
    if ( _termination.length == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing input termination for performing deletion", _glob_app );
    else if ( _termination.length == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing input repetend for performing deletion", _glob_app );
    else if ( !is_array( _glob_repetends_array[_termination] ) )
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Invalid data type for termination '"+_termination+"'."+_glob_crlf+"Can't perform deletion", _glob_app );
    else if ( !_glob_repetends_array[_termination].includes( _rep ) )
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Incoherent data reference: entry '"+_rep+"' is not listed among repetends with termination '"+_termination+"'."+_glob_crlf+"Can't perform deletion", _glob_app );
    else
    {
        var _b_go = _question ? confirm( "Attempting to delete repetend '"+_rep+"' for termination '"+_termination+"'."+_glob_crlf.repeat(2)+"Continue ?" ) : YES ;
        if ( _b_go )
        {
         		 _glob_repetends_array[_termination].delete_entry( _rep );
         		 if ( _glob_repetends_array[_termination].size_recursive() == 0 )
             _glob_repetends_array.remove_key( _termination );
             
             var _removed = !_glob_repetends_array[ _termination ].includes( _rep ) ? YES : NO ;
             if ( _removed ) CIRCLESmethodMANAGERrepetendsLIST();
             else circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Deletion error", _glob_app );
        }
    }
}

function CIRCLESmethodMANAGERrepetendsLIST()
{
    var _len = safe_int( _glob_repetends_array.size_associative(), 0 );
    var _overflow_count = 7 ;
    var HTMLcode = "" ;
 		if ( _len > _overflow_count ) HTMLcode += "<DIV STYLE=\"position:relative;width:auto;height:180px;overflow:auto;\">" ;
				HTMLcode += "<table VALIGN=\"top\">" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;

    if ( _len > 0 )
    {
        HTMLcode += "<tr><td WIDTH=\"5\"></td><td ALIGN=\"center\" COLSPAN=\""+( _len > 0 ? 8 : 1 )+"\">Entries are sorted according to their evaluation sequence,<br>that is, to the length of terminator word on the right</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>Attach repetend</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td>to words terminating with</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;

        var _candidate_termination, _candidate_rep, _row_code, _keys = _glob_repetends_array.keys_associative(), _chunk ;
				var _index = 0, _c, _n ;
        _keys = _keys.sort( function(a, b){ return b.length - a.length; /* ASC -> a - b; DESC -> b - a */ } );
        for( var _i = 0 ; _i < _keys.length ; _i++ )
        {
        		 _chunk = _glob_repetends_array[ _keys[_i] ] ;
        		 if ( is_array( _glob_repetends_array[ _keys[_i] ] ) )
        		 {
		              _candidate_termination = _keys[_i] ;
		              _n = _chunk.length ;
					        _row_code  = "<tr><td HEIGHT=\"3\"></td></tr>" ;
		              _row_code += "<tr>" ;
		              _row_code += "<td WIDTH=\"5\"></td>" ;
									_row_code += "<td COLSPAN=\"8\"><b>"+_n+"</b> repetend"+(_n==1?"":"s")+" for words terminating with letter <b>" + _candidate_termination + "</b></td></tr>" ;
		              for( _c = 0 ; _c < _n ; _c++, _index++ )
		              {
					             _candidate_rep = safe_string( _chunk[_c], "" );
					             _row_code += "<tr>" ;
                       _row_code += "<INPUT ID=\"ALGEBRAICrepetendTERMINATION_"+_index+"\" TYPE=\"HIDDEN\" VALUE=\""+_candidate_termination+"\">"
                       _row_code += "<INPUT ID=\"ALGEBRAICrepetendSTORE_"+_index+"\" TYPE=\"HIDDEN\" VALUE=\""+_candidate_rep+"\">"
					             _row_code += "<td WIDTH=\"5\"></td>" ;
					             _row_code += "<td><INPUT ID=\"ALGEBRAICrepetendWORD_"+_index+"\" TYPE=\"edit\" STYLE=\"width:150px;\" VALUE=\""+_candidate_rep+"\" ONKEYUP=\"javascript:CIRCLESformsMETHODeventsHANDLER( this.id, event, "+_index+", $('#ALGEBRAICrepetendSTORE_"+_index+"').val() );\"></td>" ;
					             _row_code += "<td WIDTH=\"3\"></td>" ;
					             _row_code += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrepetendsUPDATE( YES, '"+_index+"', '"+_candidate_rep+"' );\">Update</td>" ;
					             _row_code += "<td WIDTH=\"2\"></td>" ;
					             _row_code += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrepetendsDELETE( YES, '"+_candidate_termination+"', '"+_candidate_rep+"' );\">Delete</td>" ;
					             _row_code += "<td WIDTH=\"2\"></td>" ;
					             _row_code += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrepetendsRESOLVE( "+_index+", '"+_candidate_termination+"', '"+_candidate_rep+"' );\">Resolve</td>" ;
					             _row_code += "</tr>" ;
					             _row_code += "<tr><td WIDTH=\"5\"></td><td  COLSPAN=\"6\" ID=\"ALGEBRAICrepetendSOLVED_"+_index+"\" STYLE=\"display:none;\"></td></tr>" ;
									}

                  HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
		              HTMLcode += _row_code ;
						 }
        }

        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    }
    else
    {
        HTMLcode += "<tr><td ALIGN=\"center\" COLSPAN=\""+( _len > 0 ? 6 : 1 )+"\" STYLE=\"color:"+get_color_tag_value( "gray" )+";font-size:12pt;\" ALIGN=\"center\">The repetends list is empty</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td CLASS=\"link\" COLSPAN=\""+( _len > 0 ? 6 : 1 )+"\" ALIGN=\"center\" STYLE=\"font-size:12pt;color:lightblue;\" ONCLICK=\"javascript:circles_lib_popup_load('forms','method',NO,0,_glob_method,null);\">Reload</td></tr>" ;
    }

    HTMLcode += "</table>" ;
 		if ( _len > _overflow_count ) HTMLcode += "</DIV>" ;
    $( "#ALGEBRAICrepetendsCONTAINER" ).html( HTMLcode );
}

function CIRCLESmethodMANAGERrepetendsRESOLVE( _i, _termination, _unsolved_rep )
{
    _unsolved_rep = safe_string( _unsolved_rep, "" );
    if ( _unsolved_rep.length > 0 )
    {
         var _solved_rep = circles_lib_repetends_resolve( _unsolved_rep );
         $( "#ALGEBRAICrepetendSOLVED_" + _i ).html( _solved_rep );
         $( "#ALGEBRAICrepetendSOLVED_" + _i ).show(); 
    }
}

function CIRCLESmethodMANAGERrepetendsHELPword()
{
    var _nbsp = "&nbsp;" ;
    var _text_array = [];
        _text_array.push( "Compendium for user-defined words grammar:" + _glob_crlf );
        _text_array.push( "1. Word letters must belong to current alphabet for being successfully validated." );
        _text_array.push( "2. Repeating sub-strings can be coded through the following" );
        _text_array.push( _nbsp.repeat(3) + "RLE short-cuts/tokens inside the brackets:" + _glob_crlf );
        _text_array.push( _nbsp.repeat(3) + "abAB[B:20] >> append the letter 'B' for 20 times" );
        _text_array.push( _nbsp.repeat(3) + "abAB[aB:6][ab:3] >> append the string 'aB' and 'ab' for 6 and 3 times respectively" );
        _text_array.push( _nbsp.repeat(3) + "ABa[aB:5]bb >> repeat the string 'aB' for 5 times then append the rest of the string" );
        _text_array.push( _nbsp.repeat(3) + "AbaB[aB:5]baBA[baBA:4] >> ... and I'm sure you got it !" );
        _text_array.push( _glob_crlf.repeat(2) );
        _text_array.push( "p.s.: 'RLE' stands for the old-fashioned expression 'run length encoding'" );
    var _text = _text_array.join( _glob_crlf );
    alert_msg( ALERT_HELP, _text, _glob_app, 540, 300 );
}

function CIRCLESmethodMANAGERrepetendsLOAD( _filename, _file_contents )
{
    _glob_repetends_array.flush_associative();
    var _alphabet = circles_lib_alphabet_get();
		var _reps_rows = ( _file_contents.includes( CRLF_WIN ) ) ? _file_contents.split( CRLF_WIN ) : ( _file_contents.includes( CRLF_NO_WIN ) ? _file_contents.split( CRLF_NO_WIN ) : null );
    var _row_array, _termination ;
		$.each( _reps_rows,
    				function( _i, _row )
    				{
                  if ( !_row.start_with( "//" ) && _row.count( "@" ) == 1 )
                  {
                      _row_array = _row.split( "@" );
                      _termination = _row_array[0], _repetend = _row_array[1] ;
                      if ( _alphabet.includes( _termination ) )
                      {
                          if ( _glob_repetends_array[ _termination ] == null ) _glob_repetends_array[_termination] = [] ;
                          _glob_repetends_array[_termination].push( _repetend );
                      }
                  }
            }
          );

      if ( _glob_repetends_array.size_recursive() > 0 ) CIRCLESmethodMANAGERrepetendsLIST();
      else
      {
           var _msg = "No repetends table has been loaded." ;
               _msg += _glob_crlf.repeat( 2 ) + "Try checking file contents for syntax error:" ;
               _msg += _glob_crlf + "each entry shall be announced in this format : 'termination@repetend'" ;
           circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
      }
}