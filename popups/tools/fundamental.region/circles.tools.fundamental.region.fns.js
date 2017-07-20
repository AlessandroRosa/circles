function CIRCLEStoolsFUNDAMENTALREGIONcustomLISTcheck()
{
    var _alphabet = circles_lib_alphabet_get();
    if ( safe_size( CIRCLEStoolsFUNDAMENTALREGIONwords, 0 ) == 0 ||
         safe_size( _alphabet, 0 ) == 0 ) return UNDET ;
    else
    {
        var _b_ok = YES ;
    	  $.each( CIRCLEStoolsFUNDAMENTALREGIONwords,
    						function( _i, _word )
    						{
    						 		if ( !circles_lib_word_check( _word, _alphabet ) )
                    {
                         _b_ok = NO ;
                         return ;
                    }
    						}
    					);
        return _b_ok ;
    }
}

function CIRCLEStoolsFUNDAMENTALREGIONcustomBOMB( _question, _silent, _callme_after_bomb )
{
	   _question = safe_int( _question, YES );
	   _silent = safe_int( _silent, NO );
     var _n_words = safe_size( CIRCLEStoolsFUNDAMENTALREGIONwords, 0 );
     if ( _n_words == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, "The words list is already empty", _glob_app );
     else
     {
          var _b_go = _question ? confirm( "Do you want to erase all words from this list ?" ) : YES ;
          if ( _b_go ) CIRCLEStoolsFUNDAMENTALREGIONwords.flush();
          _n_words = safe_size( CIRCLEStoolsFUNDAMENTALREGIONwords, 0 );
          if ( _n_words == 0 )
          {
               if ( typeof _callme_after_bomb === "function" ) _callme_after_bomb.call( this );
               var _msg = "The words list has been flushed away with success." ;
               if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
               return [ RET_OK, _msg ] ;
          }
          else
          {
               if ( typeof _callme_after_bomb === "function" ) _callme_after_bomb.call( this );
               var _msg = "Problems while flushing the words list away." ;
               if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
               return [ RET_ERROR, _msg ] ;
          }
     }
}

function CIRCLEStoolsFUNDAMENTALREGIONcustomADD( _silent )
{
	   _silent = safe_int( _silent, NO );
     var _alphabet = circles_lib_alphabet_get();
     var _new_word = safe_string( $( "#CIRCLEStoolsFUNDAMENTALREGIONcustomADDEDIT" ).val(), "" );
     if ( safe_size( _alphabet, 0 ) == 0 )
     {
          var _msg = "The current alphabet is empty."+_glob_crlf.repeat(2)+"Try to register some seeds first." ;
     		  if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app );
          return [ RET_ERROR, _msg ] ;
     }
     else if ( safe_size( _new_word, 0 ) > 0 )
     {
          _new_word = _new_word.replaceAll( " ", "" ).replaceAll( _glob_punctuation, "," ).trim();
          var _input_words = _new_word.includes( "," ) ? _new_word.split( "," ) : [ _new_word ] ;
          var _out_errors = [] ;
          $.each( _input_words,
                  function( _i, _word )
                  {
                        if ( CIRCLEStoolsFUNDAMENTALREGIONwords.includes( _word ) )
                        _out_errors.push( "The words list already includes the entry '"+_word+"'." );
                        else if ( !circles_lib_word_check( _word, _alphabet ) )
                        _out_errors.push( "The input word '"+_word+"' does not match the current alphabet." );
                        else
                        {
              							 CIRCLEStoolsFUNDAMENTALREGIONwords.push( _word );
              							 CIRCLEStoolsFUNDAMENTALREGIONwords.push( circles_lib_word_inverse_get( _word ) );
                        } 
                  }
                );

          CIRCLEStoolsFUNDAMENTALREGIONwords.sort();
				  CIRCLEStoolsFUNDAMENTALREGIONcustomLIST();
     
          if ( safe_size( _out_errors, 0 ) == 0 ) return [ RET_OK, "success" ] ;
          else
          {
         			 if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _out_errors.join( _glob_crlf ), _glob_app );
               return [ RET_ERROR, _out_errors.join( "@@@" ) ] ;
          }
		 }
}

function CIRCLEStoolsFUNDAMENTALREGIONcustomDELETE( _word, _question, _silent, _callme_after_deletion )
{
		 _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
		 if ( CIRCLEStoolsFUNDAMENTALREGIONwords.includes( _word ) )
		 {
					var _b_go = _question ? confirm( "Confirm to delete the word '"+_word+"' ?" ) : YES ;
					if ( _b_go )
					{
							 var _old_size = safe_size( CIRCLEStoolsFUNDAMENTALREGIONwords, 0 );
							 CIRCLEStoolsFUNDAMENTALREGIONwords.delete_entry( _word );
					 		 CIRCLEStoolsFUNDAMENTALREGIONwords.delete_entry( circles_lib_word_inverse_get( _word ) );
               CIRCLEStoolsFUNDAMENTALREGIONwords.sort();
					 		 var _new_size = safe_size( CIRCLEStoolsFUNDAMENTALREGIONwords, 0 );
					 		 var _msg_id = _old_size == _new_size + 2 ? DISPATCH_SUCCESS : DISPATCH_WARNING ;
					 		 var _msg = _old_size == _new_size + 2 ? "The word '"+_word+"' has been successfully deleted" : "Problems while deleting the word '"+_word+"'" ;
					 		 circles_lib_output( OUTPUT_SCREEN, _msg_id, _msg, _glob_app );
               if ( typeof _callme_after_bomb === "function" ) _callme_after_bomb.call( this );
					} 
		 }
		 else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The words list does not include the entry '"+_word+"'.", _glob_app );
}

function CIRCLEStoolsFUNDAMENTALREGIONcustomLIST( _request_id )
{
     _request_id = safe_int( _request_id, 0 );
		 var HTMLcode = "<table>" ;
	 		   HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
		 var _n = safe_size( CIRCLEStoolsFUNDAMENTALREGIONwords, 0 );
		 if ( _n > 0 )
		 {
		 		 HTMLcode += "<tr><td COLSPAN=\"5\">The words list includes "+_n+" entr"+( _n == 1 ? "y" : "ies" )+"</td></tr>" ;
		 		 HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
		 		 $.each( CIRCLEStoolsFUNDAMENTALREGIONwords,
								 function( _i, _word )
								 {
								 		CIRCLEStoolsFUNDAMENTALREGIONwords.push( _word );
										HTMLcode += "<tr><td WIDTH=\"15\" ALIGN=\"right\">"+( _i + 1 )+")</td><td WIDTH=\"3\"></td><td>"+_word+"</td><td WIDTH=\"3\"></td><td WIDTH=\"16\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLEStoolsFUNDAMENTALREGIONcustomDELETE( '"+_word+"', CIRCLEStoolsFUNDAMENTALREGIONcustomLIST );\"><IMG TITLE=\"Delete '"+_word+"'\" SRC=\"%imgpath%icons/delete/delete.icon.16x16.png\"></td></tr>" ;
								 }
							 );
		 }
		 else
		 {
				 HTMLcode += "<tr><td STYLE=\"font-size:12pt;color:#C0C0C0;\">The words list is empty</td></tr>" ;
		 }
				 HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
		 		 HTMLcode += "</table>" ;
         
         HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
		 $( "#CIRCLEStoolsFUNDAMENTALREGIONcustomCONTAINERLIST" ).html( HTMLcode );
}