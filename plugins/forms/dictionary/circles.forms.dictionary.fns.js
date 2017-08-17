function CIRCLESformsDICTIONARYfindWORDcoords( PAGE_NUM, WORD ) { return [ PAGE_NUM, _glob_original_dict[PAGE_NUM].indexOf( WORD ) ] ; }
function CIRCLESformsDICTIONARYgetWORD() { return $('#CIRCLESdictUSERDEFINEDwordEDIT').val(); }
function CIRCLESformsDICTIONARYgetALPHABETcomboCODE( _input_letter )
{
     _input_letter = safe_string( _input_letter, "" );
     var ALPHABETcomboCODE = "<SELECT ID=\"CIRCLESdictionaryFROMalphabetCOMBO\" ONCHANGE=\"javascript:$('#CIRCLESformsDICTIONARYalphabetEDIT').val(this.value);\">" ;
         ALPHABETcomboCODE += "<OPTION "+( safe_size( _glob_alphabet, 0 ) == 0 ? "SELECTED=\"selected\"" : "" )+" VALUE=\"\">" ;
     $.each( _glob_alphabet, function( _i, _letter ) { ALPHABETcomboCODE += "<OPTION "+( _input_letter.strcmp( _letter ) ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+_letter+"\">" + _letter ; } );
     ALPHABETcomboCODE += "</SELECT>" ;
     return ALPHABETcomboCODE ;
}

function CIRCLESformsDICTIONARYalphabetADD( _letter )
{
     _letter = safe_string( _letter, "" ).trim();
     if ( _letter.length == 0 ) _letter = $( "#CIRCLESformsDICTIONARYalphabetEDIT" ).val();
		 if ( _letter.length >= 1 )
     {
				var _letter = _letter.replaceAll( _glob_punctuation.concat( [ " " ] ), "," );
				if ( !_letter.testME( "^([A-Za-z\,]{1,})$" ) )
				circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The input '"+_letter+"' includes invalid characters." + _glob_crlf + "Only letters and comma are allowed." );
				else
				{
				  var _letter_array = _letter.includes( "," ) ? _letter.split( "," ) : [ _letter ] ;
          var _warn = 0, _warn_array = [] ;
          for( var _l = 0 ; _l < _letter_array.length ; _l++ )
          {
          		_letter = _letter_array[_l].trim();
              if ( _glob_alphabet.includes( _letter ) )
              {
                  _warn = YES ;
                  _warn_array.push( "The input letter '"+_letter+"' is already included in the current alphabet" );
              }
              else if ( _letter.length > 0 )
              {
                  _glob_alphabet.push( _letter );
                  _glob_alphabet.sort();
                  $( "#CIRCLESformsDICTIONARYalphabetSYMBOL" ).html( ( safe_size( _glob_alphabet, 0 ) > 0 ? CIRCLESformsDICTIONARYgetALPHABETcomboCODE( _letter ) : "<SPAN STYLE=\"color:#909090;\">None</SPAN>" ) );
                  $( "#CIRCLESformsDICTIONARYalphabetEDIT" ).val( "" );
                  if ( safe_size( _glob_alphabet, 0 ) > 0 ) $( "#CIRCLESformsDICTIONARY" ).slideDown( "slow", function() {} );
              }
          }
          
          if ( _warn ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _warn_array.join( _glob_crlf ), _glob_app_title );
				}     			
     }
     else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The input letter must be of length one", _glob_app_title );
}

function CIRCLESformsDICTIONARYalphabetREMOVE( _letter, _all )
{
     _letter = safe_string( _letter, "" );
     _all = safe_int( _all, NO );
     if ( _letter.length == 0 && !_all ) _letter = $( "#CIRCLESformsDICTIONARYalphabetEDIT" ).val();
     var _alphabet_size = safe_size( _glob_alphabet, 0 );
     if ( _alphabet_size == 0 )
     circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't remove: the current alphabet is empty.", _glob_app_title );
		 else if ( _all )
     {
		 		  var MSG = "Confirm to erase the whole alphabet ?" ;
		 		  		MSG += _glob_crlf.repeat( 2 ) + "(This dictionary service will be disabled)" ;
		 		  if ( confirm( MSG ) ) _glob_alphabet.flush();
		 }
		 else if ( _letter.length >= 1 )
     {
				  var _letter = _letter.replaceAll( _glob_punctuation.concat( [ " " ] ), "," );
				  if ( !_letter.testME( "^([A-Za-z\,]{1,})$" ) )
				  circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The input '"+_letter+"' includes invalid characters." + _glob_crlf + "Only letters and comma are allowed.", _glob_app_title );
				  else
				  {
				  		 var _count = _letter.split( "," ).length ;
			         var MSG = "Confirm the removal of the letter"+(_count==1?'s':'')+" '"+_letter+"' from current alphabet ?" ;
			         if ( safe_size( _glob_alphabet, 0 ) == 1 )
			         {
			             MSG += _glob_crlf.repeat(2) + "This is the only letter left in the alphabet." ;
			             MSG += _glob_crlf + "If removed, this dictionary service will be disabled." ;
			         }
			
			         if ( confirm( MSG ) )
			         {
			             if ( _glob_alphabet.includes( _letter ) )
			             {
			                 _glob_alphabet.delete_entry( _letter );
			                 $( "#CIRCLESformsDICTIONARYalphabetSYMBOL" ).html( ( safe_size( _glob_alphabet, 0 ) > 0 ? CIRCLESformsDICTIONARYgetALPHABETcomboCODE() : "<SPAN STYLE=\"color:#909090;\">None</SPAN>" ) );
			             }
			             else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The current dictionary does not include the letter '"+_letter+"'", _glob_app_title );
			         }
					}
     }
     else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The input letter must be of length one", _glob_app_title );

     if ( safe_size( _glob_alphabet, 0 ) == 0 )
     $( "#CIRCLESformsDICTIONARY" ).slideUp( "slow", function() {} );
}

function CIRCLESformsDICTIONARYperformACTIONask( _caller_id, _opcode, _action_id, _question, _silent, _out_channel )
{
    _opcode = safe_float( _opcode, 0 ), _action_id = safe_float( _action_id, 0 );
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _msg = "" ;
    if ( _opcode == 0 )
    {
         _msg = "No action has been selected" ;
         if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         return [ RET_ERROR, _msg ] ;
    }
    else
    {
         circles_lib_depth_set( safe_int( $( "#CIRCLESdictionaryFORMdepthEDIT" ).val(), 0 ), YES );
         if ( _action_id == 0 ) _action_id = $( "#CIRCLESformsDICTIONARYactionCOMBO option:selected" ).val();
         _msg = "Selected procedure " + _glob_crlf ;
				 if ( _opcode.is_one_of( 0.1, 0.2 ) )
				 {
							switch( _opcode )
							{
				  			 case 0.1: _msg += "<b>building the dictionary</b>" ; break ;
			  				 case 0.2: _msg += "<b>destroying the dictionary</b>" ; break ;
	               default: break ;
							}
				 }
				 else if ( _opcode >= 1.1 && _opcode <= 3.3 )
				 {
              _msg += "<b>" ;
				 			if ( _action_id == 1 ) 			_msg += "Keep " ;
				 			else if ( _action_id == 2 ) _msg += "Remove " ;
				 			else if ( _action_id == 3 ) _msg += "Flip case " ;

							switch( _opcode )
							{
									case 1.1:
                  var _from = $( "#DICTIONARYPANELoptionsEDIT1" ).val();
                  var _to = $( "#DICTIONARYPANELoptionsEDIT2" ).val();
                  _msg += "entries whose length ranges from " + _from + " to " + _to ;
                  break ;
									case 2.1: _msg += "the first "+( $( "#DICTIONARYPANELoptionsEDIT3" ).val() )+" entries" ; break ;
									case 2.2: _msg += "the last "+( $( "#DICTIONARYPANELoptionsEDIT4" ).val() )+" entries" ; break ;
									case 3.1: _msg += "entries starting with '"+( $( "#DICTIONARYPANELoptionsEDIT5" ).val() )+"'" ; break ;
									case 3.2: _msg += "entries including '"+( $( "#DICTIONARYPANELoptionsEDIT6" ).val() )+"'" ; break ;
									case 3.3: _msg += "entries ending with '"+( $( "#DICTIONARYPANELoptionsEDIT7" ).val() )+"'" ; break ;
	                default: break ;
							}
              _msg += "</b>" ;
				 }
				 else if ( _opcode == 4 ) _msg += "<b>Inversion</b>" ;

				 _msg += _glob_crlf.repeat( 2 ) + "This procedure involves an irreversible modification, so current data will be lost." ;
         _msg += _glob_crlf.repeat( 2 ) + "Confirm ?" ;

         if ( _question )
         {
						 alert_plug_fn( ALERT_YES, "alertCLOSE();circles_lib_dict_run( '"+_caller_id+"', '"+_opcode+"', '"+_action_id+"', '"+_question+"', '"+_silent+"', '"+_out_channel+"' );" );
		         alert_plug_fn( ALERT_NO, "alertCLOSE();" );
		         circles_lib_output( OUTPUT_SCREEN, DISPATCH_QUESTION | DISPATCH_YESNO, _msg, _glob_app_title );
				 }
				 else circles_lib_dict_run( _caller_id, _opcode, _action_id, _question, _silent, _out_channel );
		}
}

function CIRCLESformsDICTIONARYpageRESIZE()
{
		 var _pagesize = CIRCLESformsDICTIONARYmax_entries_per_page = Math.max( 0, safe_int( $( "#CIRCLESformsDICTIONARYeachPAGEcardinality" ).val(), 0 ) );
		 if ( _pagesize == 0 )
		 {
		 		  CIRCLESformsDICTIONARYmax_entries_per_page = 100 ;
		 		  $( "#CIRCLESformsDICTIONARYeachPAGEcardinality" ).val( CIRCLESformsDICTIONARYmax_entries_per_page );
		 }

		 var PAGE_NUM = safe_int( _glob_dict_processor.sliced_dict_get_chunk_index_from_word( _word ), _glob_dict_selected_page );
		 var _dict_page_array = _glob_original_dict[PAGE_NUM] ;
		 var _word = is_array( _dict_page_array ) ? safe_string( _dict_page_array[0], "" ) : "" ;
		 
		 _glob_dict_processor.sliced_dict_resize( CIRCLESformsDICTIONARYmax_entries_per_page, YES );
		 CIRCLESformsDICTIONARYpagingPROCESS( PAGE_NUM );
		 CIRCLESformsDICTIONARYdisplayPAGE( PAGE_NUM, "", YES );
}

function CIRCLESformsDICTIONARYcrashstringsFORMimport( _action, _question, _silent )
{
		/* ACTION 1: import, 2: append */
    _action = safe_int( _action, 1 ), _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    var _text = $("#CIRCLESdictionaryCRASHSTRINGStext").val();
    if ( !( _action.is_one_of( 1, 2, 3 ) ) )
    {
        var _msg = "Action code "+_action+" is illegal" ;
            _msg += _glob_crlf + "This procedure has been halted" ;
        if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
    }
    else if ( _text.length > 0 )
    {
        var _current_crash_words_array = _dictionary_init_settings_array['crash_words_packed'].split( "|" );
        var _alphabet = circles_lib_alphabet_get();
        // normalize contents
        _text = _text.replaceAll( "\r\n", _glob_crlf ).replaceAll( _glob_crlf, "," );
        var _reg_ex_pattern = "^([" + _alphabet.join( "|" ) + "|,]){1,}$" ;
        var _legal_chars = _text.testME( _reg_ex_pattern );
        var _crash_words_array = _text.split( "," );
        if ( safe_size( _alphabet, 0 ) == 0 )
        {
             var _alert_msg = "Fail to "+( _action == 1 ? "import" : "append to" )+" crash words: " ;
                 _alert_msg += _glob_crlf + "no alphabet has been declared yet" ;
             if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _alert_msg, _glob_app_title );
				}
        else if ( !_legal_chars )
        {
             var _alert_msg = "Fail to "+( _action == 1 ? "import" : "append to" )+" crash words: " ;
                 _alert_msg += _glob_crlf + "the input may include illegal chars or words not matching the current alphabet" ;
             if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _alert_msg, _glob_app_title );
        }
        else if ( safe_size( _crash_words_array, 0 ) == 0 )
        {
             var _alert_msg = "Fail to "+( _action == 1 ? "import" : "append to" )+" crash words: the input is empty" ;
             if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _alert_msg, _glob_app_title );
        }
        else if ( _action == 3 && _text.length > 0 )
        {
             var _question = "Confirm to delete all crash words ?" ;
             var _b_go = !_question ? YES : confirm( _question );
             if ( _b_go )
             {
                 _crash_words_array.flush();
                 _glob_dict_processor.flush_crash_words();
                 $( "#CIRCLESdictionaryCRASHSTRINGStext" ).val( "" );
             }
        }
        else if ( _action.is_one_of( 1, 2 ) )
        {
             if ( _alphabet.length > 0 )
             {
                  var _b_go = YES, _word_error = "", _input_word = "" ;
                  var _err_id = 0, _ret_check, _ret_includes, _ret_length ;
                  var _csl = safe_size( _crash_words_array, 0 );
                  for( var _i = 0 ; _i < _csl ; _i++ )
                  {
                      _input_word = _crash_words_array[_i] ;
                      _ret_length = _input_word.length > 0 ? YES : NO ;
                      _ret_check = circles_lib_word_check( _input_word, _alphabet );
                      _ret_includes = _current_crash_words_array.includes( _input_word ) ? YES : NO ;
                      _b_go &= _ret_length > 0 ? YES : NO ;
                      _b_go &= _ret_check.is_one_of( CIRCLES_MISSING_INPUT, UNDET ) ? NO : YES ;
                      _b_go &= _ret_includes && _action == 2 ? NO : YES ;
                      if ( !_b_go )
                      {
                           _word_error = _input_word ;
                           break ;
                      }
                  }
                    
                  if ( _b_go )
                  {
                      // apply procedure
                      var _question = "" ;
                      if ( _action == 1 ) _question += "This process will replace the current crash words set" + _glob_crlf ;
                      else if ( _action == 2 ) _question += "This process will append the input to the current crash words set" + _glob_crlf ;
                      _question += _glob_crlf + "Confirm ?" ;
                      var _b_go = !_question ? YES : confirm( _question );
                      if ( _b_go )
                      {
                          _current_crash_words_array = _action == 1 ? _crash_words_array.clone() : _current_crash_words_array.concat( _crash_words_array );
                          _dictionary_init_settings_array['crash_words_packed'] = _current_crash_words_array.join( "|" );
                          var _alert_msg = _ERR_00_01 + _glob_crlf.repeat(2) + "Confirm to rebuild the dictionary ?" ;
                          alert_plug_fn( ALERT_YES, "alertCLOSE();CIRCLESformsDICTIONARYperformACTIONask(CIRCLESformsDICTIONARYbaseid,0.1,null,NO);" );
                          alert_plug_fn( ALERT_NO, "alertCLOSE();" );
                          circles_lib_output( OUTPUT_SCREEN, ALERT_QUESTION | ALERT_YESNO, _alert_msg, _glob_app_title );
                      }
                  }
                  else
                  {
                      var _alert_msg = "Fail to import the crash words: " ;
                      if ( !_ret_length ) _alert_msg += _glob_crlf + "there's one empty entry inside" ;
                      else if ( !_ret_check ) _alert_msg += _glob_crlf + "the word '"+_word_error+"' does not match the current alphabet: "+_alphabet.join(",")+"" ;
                      else if ( _ret_includes && _action == 2 ) _alert_msg += _glob_crlf + "the current crash words set already includes the word '"+_word_error+"'" ;
                      circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _alert_msg, _glob_app_title );
                  }
             }
             else
             {
                  var _alert_msg = "Fail to import crash words: no alphabet available" ;
                      _alert_msg += _glob_crlf.repeat(2) + "Set up gens first" ;
                  if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _alert_msg, _glob_app_title );
             }
        }
     }
     else
     {
        var _alert_option = _textbox != null ? DISPATCH_WARNING : DISPATCH_CRITICAL ;
        var _alert_msg = _textbox != null ? "Text box is not available: reload this app" : "The crash words set is empty" ;
        if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, _alert_option, _alert_msg, _glob_app_title );
     }
}

function CIRCLESformsDICTIONARYinputformIMPORT( _action, _silent )
{
    /* ACTION 1: import, 2: append */
    _action = safe_int( _action, 1 ), _silent = safe_int( _silent, NO );
    var _text = $("#CIRCLESdictionaryINPUTtext").val();
    if ( !( _action.is_one_of( 1, 2 ) ) ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Action code is illegal."+_glob_crlf+"This procedure has been halted.", _glob_app_title );
    else if ( _text.length > 0 )
    {
        var _alphabet = circles_lib_alphabet_get(), _dict_size = circles_lib_count_dict();
        // normalize contents
        _text = _text.replaceAll( "\r\n", _glob_crlf ).replaceAll( _glob_crlf, "," );
        var _reg_ex_pattern = "^([" + _alphabet.join( "|" ) + "|,]){1,}$" ;
        var _legal_chars = _text.testME( _reg_ex_pattern );
        var _input_dict_array = _text.split( "," );
        if ( !_legal_chars )
        {
             var _alert_msg = "Fail to "+( _action == 1 ? "import" : "append to" )+" dictionary: " ;
                 _alert_msg += "the input may include illegal chars or words not matching the current alphabet" ;
             if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _alert_msg, _glob_app_title );
        }
        else if ( _dict_size == 0 )
        {
             var _alert_msg = "Fail to "+( _action == 1 ? "import" : "append to" )+" dictionary: the input is empty" ;
             if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _alert_msg, _glob_app_title );
        }
        else
        {
             if ( _alphabet.length > 0 )
             {
                 var _b_go = YES, _word_error = "", _input_word = "" ;
                 var _err_id = 0, _ret_check, _ret_includes, _ret_length, _dl = circles_lib_count_dict();
                 for( var _i = 0 ; _i < _dl ; _i++ )
                 {
                     _input_word = _input_dict_array[_i] ;
                     _ret_length = _input_word.length > 0 ? YES : NO ;
                     _ret_check = circles_lib_word_check( _input_word, _alphabet );
                     _ret_includes = _glob_original_dict.includes( _input_word ) ? YES : NO ;
                     _b_go &= _ret_length > 0 ? YES : NO ;
                     _b_go &= _ret_check.is_one_of( CIRCLES_MISSING_INPUT, UNDET ) ? NO : YES ;
                     _b_go &= ( _ret_includes && _action == 2 ) ? NO : YES ;
                     if ( !_b_go )
                     {
                         _word_error = _input_word ;
                         break ;
                     }
                 }
                    
                 if ( _b_go )
                 {
                     // apply procedure
                     var _question = "" ;
                     if ( _action == 1 ) _question += "This procedure will replace the current dictionary with the input text." ;
                     else if ( _action == 2 ) _question += "This procedure will append the input text to the current dictionary." ;
                     _question += _glob_crlf + "Confirm ?" ;
                     if ( !_question ? YES : confirm( _question ) )
                     {
                         _glob_original_dict = _action == 1 ? _input_dict_array.clone() : _glob_original_dict.push( _input_dict_array );
   		                   CIRCLESformsDICTIONARYapply();
                         if ( circles_lib_plugin_find_index( { base_id : 'dictionary' }, POPUP_SEARCH_BY_BASE_ID ) != UNFOUND )
												 circles_lib_plugin_dispatcher_unicast_message( 'storage.space', "forms", 4 );
                     }
                 }
                 else
                 {
                     var _alert_msg = "Fail to import the input dictionary: " ;
                         if ( !_ret_length ) _alert_msg += _glob_crlf + "there's one empty entry inside" ;
                         else if ( !_ret_check ) _alert_msg += _glob_crlf + "the word '"+_word_error+"' does not match the current alphabet: "+_alphabet.join(",")+"" ;
                         else if ( _ret_includes && _action == 2 ) _alert_msg += _glob_crlf + "the current dictionary already includes the word '"+_word_error+"'" ;
                     if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _alert_msg, _glob_app_title );
                 }
             }
             else
             {
                 var _alert_msg = "Fail to import dictionary: no alphabet available" ;
                     _alert_msg += _glob_crlf.repeat(2) + "Set up gens first" ;
                 if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _alert_msg, _glob_app_title );
             }
        }
    }
    else
    {
        var _alert_option = _textbox != null ? DISPATCH_WARNING : DISPATCH_CRITICAL ;
        var _alert_msg = _textbox != null ? "Text box is not available: reload this app" : "The input dictionary is empty" ;
        if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, _alert_option, _alert_msg, _glob_app_title );
    }
}

function CIRCLESformsDICTIONARYselectWORD( WORD )
{
    $("#CIRCLESformsDICTIONARYselectedWORD ").html( WORD );
    $("#CIRCLESdictUSERDEFINEDwordEDIT").val( WORD );
}

function CIRCLESformsDICTIONARYactionTABLECODE()
{
    var HTMLcode = "<table WIDTH=\"100%\">" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\" ID=\"CIRCLESformsDICTIONARYactionCONTAINER\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td>Action</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td><SELECT ONCHANGE=\"javascript:CIRCLESformsDICTIONARYactionCOMBOchange();\" ID=\"CIRCLESformsDICTIONARYactionCOMBO\"><OPTION VALUE=\"0\"><OPTION VALUE=\"1\">Keep<OPTION VALUE=\"2\">Remove<OPTION VALUE=\"3\">Flip</SELECT></td>" ;
        HTMLcode += "<td WIDTH=\"8\"></td>" ;
        HTMLcode += "<td>Filter</td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td><SELECT ONCHANGE=\"javascript:CIRCLESformsDICTIONARYfilterCOMBOchange();\" ID=\"CIRCLESformsDICTIONARYfilterCOMBO\"><OPTION VALUE=\"0\"><OPTION VALUE=\"1\">length<OPTION VALUE=\"2\">starting with<OPTION VALUE=\"3\">include<OPTION VALUE=\"4\">ending with</SELECT></td>" ;
        HTMLcode += "<td WIDTH=\"6\"></td>" ;
        HTMLcode += "<td ID=\"CIRCLESformsDICTIONARYactionCTRLcontainer\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        HTMLcode += "</table>" ;

        return HTMLcode ;
}

function CIRCLESformsDICTIONARYactionCOMBOchange()
{
}

function CIRCLESformsDICTIONARYfilterCOMBOchange()
{
    var _filter_id = safe_int( $( "#CIRCLESformsDICTIONARYfilterCOMBO option:selected" ).val(), 0 );
    var HTMLcode = "<table>" ;
    switch( _filter_id )
    {
        case 1:
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>from</td>";
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT ONKEYUP=\"javascript:CIRCLESformsDICTIONARYeventsHANDLER( this.id, event, 1.1, 0 );\" TYPE=\"edit\" ID=\"DICTIONARYPANELoptionsEDIT1\" NAME=\"DICTIONARYPANELoptionsEDIT1\" STYLE=\"width:25px;text-align:center;\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>to</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT ONKEYUP=\"javascript:CIRCLESformsDICTIONARYeventsHANDLER( this.id, event, 1.1, 0 );\" TYPE=\"edit\" ID=\"DICTIONARYPANELoptionsEDIT2\" NAME=\"DICTIONARYPANELoptionsEDIT2\" STYLE=\"width:25px;text-align:center;\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYperformACTIONask(CIRCLESformsDICTIONARYbaseid,1.1);\">Go</td>" ;
        HTMLcode += "</tr>" ;
        break ;
        case 2:
        HTMLcode += "<tr>" ;
        HTMLcode += "<td>with</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT ONKEYUP=\"javascript:CIRCLESformsDICTIONARYeventsHANDLER( this.id, event, 3.1, 0 );\" TYPE=\"edit\" ID=\"DICTIONARYPANELoptionsEDIT5\" NAME=\"DICTIONARYPANELoptionsEDIT5\" STYLE=\"width:60px;text-align:center;\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYperformACTIONask(CIRCLESformsDICTIONARYbaseid,3.1);\">Go</td>" ;
        break ;
        case 3:
        HTMLcode += "<td>this subword</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT ONKEYUP=\"javascript:CIRCLESformsDICTIONARYeventsHANDLER( this.id, event, 3.2, 0 );\" TYPE=\"edit\" ID=\"DICTIONARYPANELoptionsEDIT6\" NAME=\"DICTIONARYPANELoptionsEDIT6\" STYLE=\"width:60px;text-align:center;\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYperformACTIONask(CIRCLESformsDICTIONARYbaseid,3.2);\">Go</td>" ;
        break ;
        case 4:
        HTMLcode += "<td>with</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT ONKEYUP=\"javascript:CIRCLESformsDICTIONARYeventsHANDLER( this.id, event, 3.3, 0 );\" TYPE=\"edit\" ID=\"DICTIONARYPANELoptionsEDIT7\" NAME=\"DICTIONARYPANELoptionsEDIT7\" STYLE=\"width:60px;text-align:center;\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYperformACTIONask(CIRCLESformsDICTIONARYbaseid,3.3);\">Go</td>" ;
        HTMLcode += "</tr>" ;
        break ;
        default: break ;
    }

    HTMLcode += "</table>" ;
    $( "#CIRCLESformsDICTIONARYactionCTRLcontainer" ).html( HTMLcode );
}

function CIRCLESformsDICTIONARYpagingPROCESS( PAGE_NUM )
{
    PAGE_NUM = safe_int( PAGE_NUM, _glob_dict_selected_page );
    if ( safe_size( _glob_original_dict, 0 ) == 0 ) _glob_original_dict = _glob_dict_processor.sliced_dictionary ;
    var _dict_size = _glob_original_dict != null ? circles_lib_count_dict() : 0 ;
    CIRCLESformsDICTIONARYPAGES = safe_int( _glob_dict_processor.sliced_dict_get_chunks_number(), 0 );
    $("#CIRCLESformsDICTIONARYfoundENTRIESlabel").html( "Found "+_dict_size+" "+( _dict_size == 1 ? "word" : "words" ) + " in " + CIRCLESformsDICTIONARYPAGES + " page" + ( CIRCLESformsDICTIONARYPAGES != 1 ? "s" : "" ) );

    var HTMLcode = "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
      
    var _overflow = CIRCLESformsDICTIONARYPAGES <= CIRCLESformsDICTIONARYpaging_half_interval * 2 ? 0 : 1 ;
    CIRCLESformsDICTIONARYmin_page = !_overflow ? 0 : Math.max( 0, PAGE_NUM - CIRCLESformsDICTIONARYpaging_half_interval );
    CIRCLESformsDICTIONARYmax_page = !_overflow ? CIRCLESformsDICTIONARYPAGES : PAGE_NUM == 0 ? CIRCLESformsDICTIONARYpaging_half_interval * 2 : Math.min( CIRCLESformsDICTIONARYPAGES, PAGE_NUM + CIRCLESformsDICTIONARYpaging_half_interval );
    
    if ( _overflow && CIRCLESformsDICTIONARYmin_page != 0 )
    {
        HTMLcode += "<td WIDTH=\"30\" ALIGN=\"center\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYdisplayPAGE(0);\">|<<</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
    }
      
    var _selected, _bold ;
    for( var _i = CIRCLESformsDICTIONARYmin_page ; _i < CIRCLESformsDICTIONARYmax_page ; _i++ )
    {
        _selected = _glob_dict_selected_page == _i ? YES : NO ;
        _bold = _selected ? "bold" : "normal" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td WIDTH=\"25\" STYLE=\"font-weight:"+_bold+";\" ID=\"DICTpagingLABEL_"+_i+"\" ALIGN=\"center\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYdisplayPAGE("+_i+");\">"+( _i + 1 )+"</td>" ;
    }
      
    if ( _overflow && _glob_dict_selected_page < ( CIRCLESformsDICTIONARYPAGES - 1 ) )
    {
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td WIDTH=\"30\" ALIGN=\"center\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYdisplayPAGE("+(CIRCLESformsDICTIONARYPAGES-1)+");\">>>|</td>" ;
    }
      
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:var _p=$('#DICTIONARYgotoPAGE').val();CIRCLESformsDICTIONARYdisplayPAGE(_p-1);\">Page</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ONKEYUP=\"javascript:CIRCLESformsDICTIONARYeventsHANDLER( event, this.id );\" TYPE=\"edit\" ID=\"DICTIONARYgotoPAGE\" STYLE=\"width:30px;text-align:center;\" VALUE=\""+(PAGE_NUM+1)+"\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
                       
    return HTMLcode ;
}

function CIRCLESformsDICTIONARYdisplayPAGE( PAGE_NUM, _selected_word, _silent )
{
    // page number starts from 0, not from 1 (outpage page numbering starts from 1)
    PAGE_NUM = safe_int( PAGE_NUM, _glob_dict_selected_page );
		_selected_word = safe_string( _selected_word, "" ), _silent = safe_int( _silent, NO );
    if ( PAGE_NUM < 0 || PAGE_NUM > ( CIRCLESformsDICTIONARYPAGES - 1 ) )
    {
        var _msg = "Sorry, page "+(PAGE_NUM+1)+" is out of range" ;
        if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
    }
    else if ( _glob_original_dict[PAGE_NUM] != null )
    {
        var _dict_page_array = _glob_original_dict[PAGE_NUM], _dict_page_size = _glob_dict_processor.sliced_dict_get_chunk_size();
        _glob_dict_selected_page = PAGE_NUM ;
        var _min_display_num = PAGE_NUM * _dict_page_size ;
        var _max_display_num = ( PAGE_NUM + 1 ) * _dict_page_size ;
        var _page_width = $( "#CIRCLESformsDICTIONARYpageDIV" ).width();
        var _max_word_length = 0 ;
        $.each( _dict_page_array, function( _i, _w ) { _max_word_length = Math.max( _max_word_length, _w.length ); } );
        var _max_digits = Math.log10( _max_display_num ) + 2 ;
        var COLUMNS = Math.ceil( ( _page_width - 36 ) / ( _max_word_length * 8 + _max_digits * 8 + 20 ) );
        var ARGS = "", startINDEX = 0, endINDEX = safe_size( _dict_page_array, 0 );
           CIRCLESformsDICTIONARYstart_index = startINDEX ;
           CIRCLESformsDICTIONARYend_index = endINDEX ;

        $("#PAGING_CONTAINER").html( CIRCLESformsDICTIONARYpagingPROCESS( PAGE_NUM ) );
        var WORD, _a_length, _symbol, _index, _row_counter = 0, _row_save = 0 ;
        var _u_in = "", _u_out = "", _i, _a, _a_length = safe_size( _glob_alphabet, 0 ), _words_coords ;
        var HTMLcode = "<table>" ;
        for( _i = startINDEX ; _i < endINDEX ; _i++, _min_display_num++ )
        {
            WORD = _dict_page_array[_i] ;
            /*
            for( _a = 0 ; _a < _a_length ; _a++ )
            {
                _symbol = _glob_alphabet[_a], _index = circles_lib_find_item_index_by_symbol( _glob_seeds_array, _symbol );
                // reset to original wording
                if ( _index != UNFOUND ) WORD = WORD.replaceAll( _index, _symbol );
            }
            */
              
            ARGS = "'"+WORD+"'" ;
            if ( WORD == _selected_word ) { _u_in = "<u STYLE=\"font-size:12pt;vertical-align:bottom;\" ID=\"target\">" ; _u_out = "</u>" ; _row_save = _row_counter ; }
            else { _u_in = _u_out = "" ; }
                    
            if ( _glob_method != METHOD_ALGEBRAIC ) ARGS += ", '"+_i+"'" ;
               
            _words_coords = CIRCLESformsDICTIONARYfindWORDcoords( PAGE_NUM, WORD );
               
            if ( _i % COLUMNS == 0 ) HTMLcode += "<tr>" ;
            HTMLcode += "<td STYLE=\"color:#84B5DF;\">"+(_min_display_num+1)+")</td>" ;
            HTMLcode += "<td WIDTH=\"2\"></td>" ;
            HTMLcode += "<td CLASS=\"dict_link\" ID=\"DICTIONARYword_label_"+_i+"\" ONMOUSEDOWN=\"javascript:CIRCLESformsDICTIONARYeventsHANDLER( event, this.id, "+ARGS+" );\">"+_u_in+WORD+_u_out+"</td>" ;
            HTMLcode += "<td WIDTH=\"3\"></td>" ;
            HTMLcode += "<td CLASS=\"dict_link\" ONCLICK=\"javascript:CIRCLESformsDICTIONARYdeleteASK('"+WORD+"',"+_words_coords[0]+","+_words_coords[1]+");\"><IMG SRC=\"%imgpath%icons/delete/delete.icon.12x12.png\"></td>" ;
            HTMLcode += "<td WIDTH=\"10\"></td>";
            if ( _i % COLUMNS == ( COLUMNS - 1 ) )
            {
                 HTMLcode += "</tr>" ;
                 _row_counter++ ;
            }
        }
                       
        HTMLcode += "</table>" ;
        HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
        $("#CIRCLESformsDICTIONARYpageDIV").html( HTMLcode );
        if ( _row_save > 4 ) $('#CIRCLESformsDICTIONARYpageDIV').scrollTop( _row_save * 13 );
    }
    else 
    {
        var _msg = "Sorry, page "+(PAGE_NUM+1)+" is not available due to a memory error." ;
        if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
    }
}

function CIRCLESformsDICTIONARYapply()
{
    _glob_dict_processor.dictionary_array.flush();
    _glob_dict_processor.dictionary_array = _glob_original_dict.clone();
    _glob_dict_check = SKIP, _glob_dict_create = NO ;
    var _b_go = circles_lib_count_dict() > 0 ? YES : NO ;
    var _msg = _b_go ? "Dictionary applied with success !"+_glob_crlf+"Confirm to redraw the W-plane ?" : "Dictionary has not been applied" ;
    if ( _b_go )
    {
 				if ( _apply_btn_td != null )
        {
             $("#CIRCLESdictionaryFORMbtn5").attr( "class", "link_rounded_dead" );
             $("#CIRCLESdictionaryFORMbtn5").bin( "click", function() {} );
        }

				alert_plug_label( ALERT_YES, "Close" );
        alert_plug_label( ALERT_NO, "Redraw" );
        alert_plug_fn( ALERT_YES, "alertCLOSE();" );
        alert_plug_fn( ALERT_NO, "alertCLOSE();circles_lib_canvas_render_wplane( null, wplane_sm, null, YES, YES, YES, YES, NO, YES, OUTPUT_SCREEN );" );
        alert_set_btns_width( "70px" );
		}
      
		circles_lib_output( OUTPUT_SCREEN, _b_go ? ( DISPATCH_QUESTION | DISPATCH_YESNO ) : DISPATCH_ERROR, _msg, _glob_app_title );
    return [ _b_go ? RET_OK : RET_ERROR, _msg ] ;
}

function CIRCLESformsDICTIONARYdeleteASK( WORD, PAGENUM, INDEX, _out_channel )
{
	  WORD = safe_string( WORD, "" ).trim(), PAGENUM = safe_int( PAGENUM, UNDET ), INDEX = safe_int( INDEX, UNDET );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    if ( ( PAGENUM == UNDET || INDEX == UNDET || WORD.length == 0 ) && _out_channel == OUTPUT_SCREEN )
    {
        var _MSG = "" ;
			  if ( WORD.length == 0 ) _MSG = "Can't delete: the input word is empty" ;
			  else "Can't delete word '"+WORD+"': coordinates are inconsistent" ;
        circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _MSG, _glob_app_title );
        return [ RET_ERROR, _MSG ] ;
    }
    else
    {
        var MSG = "The deletion of word '"+WORD+"' is not reversible," + _glob_crlf ;
            MSG += "unless you restore it by generating the whole dictionary again." ;
            MSG += _glob_crlf.repeat(2) + "Proceed to deletion ?" ;
        
        alert_plug_label( ALERT_YES, "Yes" );
        alert_plug_label( ALERT_NO, "No" );
        alert_plug_fn( ALERT_YES, "alertCLOSE();var d=circles_lib_dict_delete_word('"+WORD+"',"+PAGENUM+","+INDEX+");if(d)CIRCLESformsDICTIONARYdisplayPAGE(_glob_dict_selected_page);" );
        alert_plug_fn( ALERT_NO, "alertCLOSE();" );
        alert_set_btns_width( "70px" );
        circles_lib_output( OUTPUT_SCREEN, DISPATCH_QUESTION | DISPATCH_YESNO, MSG, _glob_app_title );
        return [ RET_OK, "Word deletion" ] ;
    }
}

function CIRCLESformsDICTIONARYtrackorbitVIAterminal()
{
    if ( circles_lib_plugin_find_index( { div_id : "POPUPterminalDIV" + _glob_terminal_form_suffix }, POPUP_SEARCH_BY_DIV_ID ) == UNFOUND )
		circles_lib_plugin_load('forms','terminal',YES,0,YES,370,240);
		if ( _glob_terminal != null ) _glob_terminal.exec( "word track orbit startpt:(0,0) w:"+CIRCLESformsDICTIONARYgetWORD()+" connect",0 );
}

function CIRCLESformsDICTIONARYfindWORD( _word, _silent, _out_channel )
{
    _word = safe_string( _word, "" );
    _word = ( _word.length > 0 ? _word : $('#CIRCLESdictUSERDEFINEDwordEDIT').val() ).trim();
    _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    if ( _word.length > 0 )
    {
        var INDEX_ARRAY = _glob_original_dict.includes( _word ) ? _glob_original_dict.indexOf( _word ) : [ 0, UNFOUND ] ;
        var _b_found = is_array( INDEX_ARRAY ) ? ( INDEX_ARRAY[1] != UNDET ? 1 : 0 ) : 0 ;
        if ( _b_found )
        {
             var _candidate_dict_page = INDEX_ARRAY[0] ;
             if ( _out_channel == OUTPUT_SCREEN && !_silent )
             CIRCLESformsDICTIONARYdisplayPAGE( _candidate_dict_page, _word );
             return [ YES, "Found '"+_word+"' at index " + ( INDEX_ARRAY[1] + 1 ) + " / page " + INDEX_ARRAY[0] ] ;
        }
        else
        {
             var _msg = "The dictionary does not include the word '"+_word+"'" ;
             if ( _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
             return [ NO, _msg ] ;
        }
    }
    else
    {
        var _msg = "Can't find : please, input a word first" ;
        circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
        return [ UNDET, _msg ] ;
    }
}

function CIRCLESformsDICTIONARYappendWORD( _word, _out_channel )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _word = safe_string( _word, "" );
    _word = ( _word.length > 0 ? _word : $('#CIRCLESdictUSERDEFINEDwordEDIT').val() ).trim();
    if ( safe_size( _glob_original_dict, 0 ) == 0 ) _glob_original_dict = _glob_dict_processor.sliced_dictionary ;
    var _candidate_word_resolved = circles_lib_repetends_resolve( _word );
    var _alphabet = circles_lib_alphabet_get();
    if ( !circles_lib_word_check( _candidate_word_resolved, _alphabet ) )
		circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't append word '"+_word+"' : it's not coherent to current alphabet ( "+_alphabet.join(", ")+" ).", _glob_app_title );
    else
    {
        var _ret_chunk = _glob_original_dict.indexOf( _candidate_word_resolved );
        var _page_num = safe_int( _ret_chunk[0], 0 );
        var _index = safe_int( _ret_chunk[1], UNDET );
        if ( _index != UNDET )
        circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The word '"+_word+"' is already in the current dictionary.", _glob_app_title );
        else if ( _word.length > 0 )
    		{
    				var _pages = safe_size( _glob_original_dict, 1 );
    				var _candidate_page = _pages - 1 ;
    				if ( _glob_original_dict[ _candidate_page ] == null ) _candidate_page = 0 ;
    				if ( _glob_original_dict[ _candidate_page ] != null )
    				{
    						_glob_original_dict[ _candidate_page ].push( _candidate_word_resolved );
    						CIRCLESformsDICTIONARYdisplayPAGE( CIRCLESformsDICTIONARYPAGES - 1, _candidate_word_resolved );
    						circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "'" + _word + "' has been appended to page " + ( _candidate_page + 1 ) , _glob_app_title );
    				}
    				else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't append word '"+_word+"' : page number is not coherent to current dictionary size.", _glob_app_title );
    		}
        else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The input word to append is empty.", _glob_app_title );
    }
}

function CIRCLESformsDICTIONARYcopyPAGE( PAGE_NUM )
{
		PAGE_NUM = safe_int( PAGE_NUM, _glob_dict_selected_page );
    // put all current page words into storage space
    if ( circles_lib_count_dict() == 0 )
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Current dictionary is empty: can't perform copy", _glob_app_title );
    else if ( _glob_original_dict[ PAGE_NUM ][ CIRCLESformsDICTIONARYstart_index ] == null ||
              _glob_original_dict[ PAGE_NUM ][ CIRCLESformsDICTIONARYend_index - 1 ] == null )
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing refs: can't perform copy of page " + ( PAGE_NUM + 1 ), _glob_app_title );
    else
    {
        var _chunk = _glob_original_dict[ PAGE_NUM ].from_to( CIRCLESformsDICTIONARYstart_index, CIRCLESformsDICTIONARYend_index );
        if ( _chunk != null )
        {
             _glob_storage['words'] = _chunk.clone();
             var _check = 1 ;
             _check &= is_array( _glob_storage['words'] ) ;
             _check &= _glob_storage['words'].size_recursive() > 0 ;

             if ( _check )
             {
                  circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "All words ("+safe_size(_chunk,0)+") of page " + ( PAGE_NUM + 1 ) + " have been copied into storage space with success", _glob_app_title );
                  circles_lib_plugin_dispatcher_unicast_message( 'storage.space', "forms", 1 );
             }
             else
             circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Storage destination error: can't perform copy of page " + ( PAGE_NUM + 1 ), _glob_app_title );
        }
        else circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Input archive error: can't perform copy of page " + ( PAGE_NUM + 1 ), _glob_app_title );
    }
}

function CIRCLESformsDICTIONARYcopyDICT()
{
    // put all current page words into storage space
    if ( circles_lib_count_dict() == 0 )
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Current dictionary is empty: can't perform copy of the whole dictionary", _glob_app_title );
    else
    {
         _glob_storage['dict'] = _glob_original_dict.clone();
         var _check = 1 ;
         _check &= is_array( _glob_storage['dict'] ) ;
         _check &= _glob_storage['dict'].size_recursive() > 0 ;
         if ( _check )
         {
             circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "All words in the dictionary have been copied into storage space with success", _glob_app_title );
             circles_lib_plugin_dispatcher_unicast_message( 'storage.space', "forms", 1 );
         }
         else
         circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Storage destination error: can't perform copy of the whole dictionary", _glob_app_title );
    }
}

function CIRCLESformsDICTIONARYrestoreDICT()
{
    if ( !is_array( _glob_storage['dict'] ) ) _glob_storage['dict'] = [] ;
    if ( _glob_storage['dict'].size_recursive() == 0 )
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "No dict has been saved into the storage space: can't perform restoration", _glob_app_title );
    else
    {
         _glob_original_dict = _glob_storage['dict'].clone();
         var _check = 1 ;
         _check &= is_array( _glob_original_dict ) ;
         _check &= _glob_original_dict.size_recursive() > 0 ;
         if ( _check )
         {
             circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "All words in the dictionary have been restored from storage space to current dictionary with success", _glob_app_title );
             circles_lib_plugin_dispatcher_unicast_message( 'storage.space', "forms", 1 );
         }
         else
         circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Storage destination error: can't perform dictionary restoration", _glob_app_title );
    }
}

function CIRCLESformsDICTIONARYbuildPALETTEcode( ORBITcolorsGRADIENT, PALETTEcontainerWIDTH, _out_channel )
{
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var HTMLcode = "", _n = ORBITcolorsGRADIENT.length ;
    if ( _n > 0 )
    {
         var _div_height = $( "#CIRCLESformsDICTIONARYpageDIV" ).height();
         _div_height = safe_int( _div_height, 260 );
         if ( _n > 7 )
         {
             HTMLcode += "<DIV STYLE=\"position:relative;width:"+PALETTEcontainerWIDTH+"px;height:"+_div_height+"px;overflow:auto;\">" ;
             PALETTEcontainerWIDTH -= 20 ;
         }
           
         HTMLcode += "<table WIDTH=\""+PALETTEcontainerWIDTH+"\">" ;
         HTMLcode += "<tr><td WIDTH=\""+PALETTEcontainerWIDTH+"\" STYLE=\"font-size:7pt;\" ALIGN=\"center\">Orbit palette</td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

         var _gr_length = ORBITcolorsGRADIENT.length, RGB ;
         for( var i = 0 ; i < _gr_length ; i++ )
         {
              RGB = ORBITcolorsGRADIENT[i] ;
              HTMLcode += "<tr><td WIDTH=\""+PALETTEcontainerWIDTH+"\" HEIGHT=\"18\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:"+RGB+";\"></td></tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
         }
           
         HTMLcode += "</table>" ;
         if ( _n > 7 ) HTMLcode += "</DIV>" ;
    }
                   
    return HTMLcode ;
}

function CIRCLESformsDICTIONARYcomputeGRADIENT( PALETTEcontainerWIDTH, _silent, _out_channel )
{
    _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var HEXstart = $("#CANVAScolorCELLgradientSTART").css( "background-color" );
    var HEXend = $("#CANVAScolorCELLgradientEND").css( "background-color" );
    if ( HEXstart.length > 0 && HEXend.length > 0 )
    {
         var RGBstart = HEXstart.includes( "#" ) ? circles_rgb_hex_to_dec( HEXstart ) : HEXstart ;
         var RGBend = HEXend.includes( "#" ) ? circles_rgb_hex_to_dec( HEXend ) : HEXend ;
         _glob_palette_start_rgb = RGBstart, _glob_palette_end_rgb = RGBend ;
         var _palette = circles_lib_colors_compute_gradient( RGBstart, RGBend, _glob_depth, _silent, _out_channel );
         if ( _palette[0] != null ) _palette = _palette[0] ;
         var _msg = _palette[0] ;
         if ( _palette.length > 0 )
         {
             _glob_orbit_palette_array = _palette.clone();
             $("#PALETTEcontainer").html( CIRCLESformsDICTIONARYbuildPALETTEcode( _palette, PALETTEcontainerWIDTH ) );
         }
         
         hideCOLORTABLE();

         if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_OK, _msg, _glob_app_title );
         return [ RET_OK, _msg ] ;
    }
    else
    {
         var _msg = "Both colors shall be set for computing the gradient." ;
         if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         return [ RET_ERROR, _msg ] ;
    }
}

function CIRCLESformsDICTIONARYload( _filename, _file_contents )
{
    _glob_dict_processor.sliced_dict_flush();
    _glob_dict_processor.sliced_dict_tmp_array = [] ;
    var _alphabet = circles_lib_alphabet_get();
		var _dictionary_rows = ( _file_contents.includes( CRLF_WIN ) ) ? _file_contents.split( CRLF_WIN ) : ( _file_contents.includes( CRLF_NO_WIN ) ? _file_contents.split( CRLF_NO_WIN ) : null );
		var _new_words_counter = 0 ;
		$.each( _dictionary_rows,
    				function( _i, _row )
    				{
             			var _row_array = _row.includes( "," ) ? _row.split( "," ) : [ _row ] ;
             			if ( is_array( _row_array ) )
             			{
											 $.each( _row_array,
											 				 function( _r, _word )
											 				 {
						                        if ( circles_lib_word_check( _word, _alphabet ) )
						                        {
																				_glob_dict_processor.sliced_dict_tmp_array.push( _word );
																				_new_words_counter++ ;
								                        if ( _glob_dict_processor.sliced_dict_tmp_array.length == _glob_dict_processor.sliced_dictionary_upper_bound )
								                        {
								                             _glob_dict_processor.sliced_dictionary.push( _glob_dict_processor.sliced_dict_tmp_array.clone() );
								                             _glob_dict_processor.sliced_dict_tmp_array = [] ;
								                        }
																		}
															 }
											 			 );
									}
						}
					);

    if( safe_size( _glob_dict_processor.sliced_dict_tmp_array, 0 ) > 0 )
    {
        _glob_dict_processor.sliced_dictionary.push( _glob_dict_processor.sliced_dict_tmp_array.clone() );
        _glob_dict_processor.sliced_dict_tmp_array = [];
	  }

		var _msg = _new_words_counter +  " word"+( _new_words_counter == 1 ? "" : "s" )+" ha" +  ( _new_words_counter == 1 ? "s" : "ve" ) + " been imported into the dictionary" ;
		circles_lib_output( OUTPUT_SCREEN, _new_words_counter == 0 ? DISPATCH_WARNING : DISPATCH_SUCCESS, _msg, _glob_app_title );

		if ( _new_words_counter > 0 )
		{
		    var _dict_size = circles_lib_count_dict();

				if ( _dict_size < 5000 && _glob_dict_processor.sliced_dict_get_chunk_size() != CIRCLESformsDICTIONARYmax_entries_per_page )
				_glob_original_dict = _glob_dict_processor.sliced_dict_resize( CIRCLESformsDICTIONARYmax_entries_per_page, YES );

        CIRCLESformsDICTIONARYPAGES = safe_int( _glob_dict_processor.sliced_dict_get_chunks_number(), 0 );

			  if ( function_exists( "CIRCLESformsDICTIONARYpagingPROCESS" ) )
			  $( "#PAGING_CONTAINER" ).html( CIRCLESformsDICTIONARYpagingPROCESS(0) );

				if ( function_exists( "CIRCLESformsDICTIONARYdisplayPAGE" ) ) CIRCLESformsDICTIONARYdisplayPAGE(0);
		}
}