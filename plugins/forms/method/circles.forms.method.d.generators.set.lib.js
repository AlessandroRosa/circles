function CIRCLESgenssetMANAGERreload() { $( "#ALGEBRAICnewGENERATORStable" ).html( CIRCLESgenssetMANAGERshowGENStable() ); CIRCLESgenssetMANAGERgensCOMBOcreate(); }
function CIRCLESgenssetMANAGERgensSORT() { _glob_gens_set_model_array.sort(); CIRCLESgenssetMANAGERreload(); }
function CIRCLESgenssetMANAGERcountCANDIDATEentries() { return safe_int( CIRCLESgenssetMANAGERgetCANDIDATEentries().filtering( function( _v ) { return _v.length > 0 ? YES : NO ; } ).length, 0 ); }
function CIRCLESgenssetMANAGERgetCANDIDATEentries()
{
   var _tmp = [];
   $( "[id^=ALGEBRAICnewGENERATOR_]" ).each( function( _index, _element ) { _tmp.push( _element.value ); } );
   return _tmp ;
}

function CIRCLESgenssetMANAGERiconSETUP( _show )
{
   var _btn = $( "#ALGEBRAICgeneratorsSETsetupBTN" ).get(0);
   var _icon = $( "#ALGEBRAICgeneratorsSETsetupWARNINGicon" ).get(0);
   if ( _btn != null && _icon != null )
   {
       var _html = ( _glob_gens_set_to_init || _show ) ? "<IMG SRC=\"%imgpath%icons/exclamation/exclamation.01.icon.20x20.png\">" : "" ;
       _html = _html.replaceAll( "%imgpath%", _glob_path_to_img );
       _icon.innerHTML = _html ;
   }
     
   $('#ALGEBRAICgeneratorsSETsetupBTN').css('color',_show?COLOR_ERROR:DEFAULT_COLOR_STD);
}

function CIRCLESgenssetMANAGERgeneratorRESTOREfromRANDOMprobs( _question, _silent )
{
   _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
   var _b_go = !_question ? YES : confirm( "Confirm to restore the gens set from the current probabilities table ?" );
   if ( _b_go )
   {
       var _probs_n = safe_size( _glob_rnd_probability_array, 0 );
       if ( _probs_n > 0 )
       {
           circles_lib_gens_set_bomb();
           var _HIDDEN_EDIT = null, _n_restored = 0, _gen_word = "" ;
           for( var _i = 0 ; _i < _probs_n ; _i++ )
           {
              _HIDDEN_EDIT = $( "#PROBStableWORD." + _i ).get(0);
              if ( _HIDDEN_EDIT != null )
              {
                 _gen_word = ( new String( _HIDDEN_EDIT.value ) ).trim();
                 if ( _gen_word.length > 0 )
                 {
                    _glob_gens_set_model_array.push( _gen_word );
                    _n_restored++ ;
                 }
              }
           }
                
           if ( _n_restored > 0 )
           {
              CIRCLESgenssetMANAGERgensSETUP( _question, _silent );
              CIRCLESgenssetMANAGERreload();
              CIRCLESformsMETHODalgebraicCHANGEtab( 2 );
           }
           else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Gens set restoration from random table has failed.", _glob_app_title );
       }
       else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't restore: the random table is empty.", _glob_app_title );
   }
}

function CIRCLESgenssetMANAGERgensMODELScombo()
{
   var _chunk_index = $( "#ALGEBRAICgenssetPRESETScombo" ).val();
   _chunk_index = safe_int( _chunk_index, 0 );
   if ( _chunk_index > 0 )
   {
       var _chunk = _glob_presets['genssets'][_chunk_index-1] ;
       var _chunk_length = safe_size( _chunk, 0 );
       if ( _chunk_length > 0 )
       {
           var _sch_n = circles_lib_count_gens_set_model();
           var _b_go = _sch_n == 0 ? YES : confirm( "Do you want to overwrite the current gens set ?" );
           if ( _b_go )
           {
               circles_lib_gens_set_bomb();
               for( var _i = 1 ; _i < _chunk_length ; _i++ )
               _glob_gens_set_model_array.push( _chunk[_i] );
               CIRCLESgenssetMANAGERreload();
               CIRCLESgenssetMANAGERgensSETUP( NO, YES );
           }
       }
   }
}

function CIRCLESgenssetMANAGERshowGENStable( _silent )
{
   _silent = safe_int( _silent, NO );
	 // if configuration is exact, no gens set was required
	 // but we need to display it explicitly now because probabilities are used
   var HTMLcode = "" , _set_exists = circles_lib_gens_model_exists();
   if ( _set_exists && _glob_method == METHOD_ALGEBRAIC )
   {
   	  HTMLcode += "<tr>" ;
	    HTMLcode += "<td WIDTH=\"5\"></td>" ;
	    HTMLcode += "<td WIDTH=\"40\"></td>" ;
	    HTMLcode += "<td WIDTH=\"5\"></td>" ;
	    HTMLcode += "<td STYLE=\"background-color:#EAEAF4;padding:3px;\" ALIGN=\"center\" CLASS=\"general_rounded_corners\">Symbol / Word</td>" ;
	    HTMLcode += "<td WIDTH=\"5\"></td>" ;
	    HTMLcode += "<td STYLE=\"background-color:#EAEAF4;padding:3px;\" ALIGN=\"center\" CLASS=\"general_rounded_corners\" WIDTH=\"60\">Type</td>" ;
	    HTMLcode += "<td WIDTH=\"5\"></td>" ;
	    HTMLcode += "<td STYLE=\"background-color:#EAEAF4;padding:3px;\" ALIGN=\"center\" CLASS=\"general_rounded_corners\" WIDTH=\"90\" COLSPAN=\"5\">Operations</td>" ;
   		HTMLcode += "<td WIDTH=\"5\"></td>" ;
   		HTMLcode += "<td ALIGN=\"center\" STYLE=\"background-color:#EAEAF4;padding:3px;\" CLASS=\"general_rounded_corners\" WIDTH=\"50\">New tag</b></td>" ;
   	  HTMLcode += "</tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;

      var _unsolved_gen_word, _resolved_gen_word, _unsolved_inverse_gen_word, _resolved_inverse_gen_word ;
      var _sch_n = circles_lib_count_gens_set_model(), _is_pqword = NO, _is_pqword_inv = NO, _is_repetend = NO, _type = "" ;
      for( var _i = 0 ; _i < _sch_n ; _i++ )
      {
		  	 _unsolved_gen_word = _glob_gens_set_model_array[_i] ;
         _is_pqword = _unsolved_gen_word.testME( _glob_pqword_regex_pattern );
         _is_pqword_inv = _unsolved_gen_word.testME( _glob_pqword_inv_regex_pattern );
         _is_repetend = circles_lib_repetends_check_syntax( null, _unsolved_gen_word );
         if ( _is_pqword ) _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.split( "/" ) )[0], ( _unsolved_gen_word.split( "/" ) )[1] );
         else if ( _is_pqword_inv )
         {
            _resolved_gen_word = circles_lib_word_pq_translate( ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[0], ( _unsolved_gen_word.replaceAll( "inv", "" ).split( "/" ) )[1] ) ;
            _resolved_gen_word = circles_lib_word_inverse_get( _resolved_gen_word );
         }
         else _resolved_gen_word =circles_lib_repetends_resolve( _unsolved_gen_word );

         if ( _is_pqword || _is_pqword_inv ) _unsolved_inverse_gen_word = _unsolved_gen_word.end_with( "inv" ) ? _unsolved_gen_word.replaceAll( "inv", "" ) : _unsolved_gen_word + "inv" ;
         else _unsolved_inverse_gen_word = circles_lib_word_inverse_get( _unsolved_gen_word );

         _type = _is_repetend ? "Repetend" : ( ( _is_pqword || _is_pqword_inv ) ? "P/Q word" : "Symbol" );

			   HTMLcode += "<tr>" ;
			   HTMLcode += "<td WIDTH=\"5\"></td>" ;
			   HTMLcode += "<td WIDTH=\"40\">"+(_i+1)+")</td>" ;
			   HTMLcode += "<td WIDTH=\"5\"></td>" ;
			   HTMLcode += "<td WIDTH=\"260\"><INPUT TYPE=\"edit\" ID=\"ALGEBRAICnewGENERATOR_"+_i+"\" STYLE=\"width:260px;\" VALUE=\""+_unsolved_gen_word+"\" ONKEYUP=\"javascript:CIRCLESformsMETHODeventsHANDLER( this.id, event, 2, this.id, "+_i+", this.value, NO, YES );\"></td>" ;
			   HTMLcode += "<td WIDTH=\"5\"></td>" ;
			   HTMLcode += "<td ALIGN=\"center\" ID=\"ALGEBRAICnewGENERATORTYPE_"+_i+"\">"+_type+"</td>" ;
			   HTMLcode += "<td WIDTH=\"5\"></td>" ;

         if ( !_glob_gens_set_model_array.includes( _unsolved_gen_word ) )
			   HTMLcode += "<td CLASS=\"link_rounded\" ID=\"ALGEBRAICaddGENERATOR_BTN_"+_i+"\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERgensADD("+_i+",NO,NO,NO);\">Add</td>" ;
         else HTMLcode += "<td></td>" ;
			   HTMLcode += "<td WIDTH=\"5\"></td>" ;

				 HTMLcode += "<td CLASS=\"link\" ID=\"ALGEBRAICupdateGENERATOR_BTN_"+_i+"\" WIDTH=\"40\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERgensUPDATE("+_i+");\">Update</td>" ;
 			   HTMLcode += "<td WIDTH=\"5\"></td>" ;
				 HTMLcode += "<td CLASS=\"link\" ID=\"ALGEBRAICdeleteGENERATOR_BTN_"+_i+"\" WIDTH=\"40\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERgensDELETE("+_i+",NO,YES);\">Delete</td>" ;
			   if ( _glob_gens_set_symbols_map_array[ _resolved_gen_word ] != null )
			   {
				   HTMLcode += "<td WIDTH=\"5\"></td>" ;
				   HTMLcode += "<td ALIGN=\"center\"><b>"+_glob_gens_set_symbols_map_array[ _resolved_gen_word ]+"</b></td>" ;
				 }
				 HTMLcode += "</tr>" ;
			}
          
      _glob_gens_set_rowcount = _i ;
   }
   else
   {
			HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
      var _text = !_set_exists ? "The gens set is empty" : "The gens set is available for 'algebraic' method exclusively" ;
      if ( !_set_exists ) _text += "<br><SPAN STYLE=\"color:darkgray;\">Try to fill it by inserting a new entry or to build the exact gens set</SPAN>"
      HTMLcode += "<tr><td STYLE=\"color:"+get_rgb_from_color_tag( "gray" )+";font-size:12pt;\" ALIGN=\"center\">"+_text+"</td></tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
   }
   return HTMLcode ;
}

function CIRCLESgenssetMANAGERgeneratorNEW( _new_word )
{
   _new_word = safe_string( _new_word, "" );
	 var table = $( "#ALGEBRAICnewGENERATORStable" ).get(0);
   if ( _glob_gens_set_to_init )
   circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't add a new entry: the gens set init is still pending.", _glob_app_title );
	 else if ( table != null )
	 {
       if ( circles_lib_count_gens_set_model() == 0 ) while( table.hasChildNodes() ) table.removeChild(table.firstChild);
       var _entries_n = $(":input[id^=ALGEBRAICnewGENERATOR_]").length ;
       var _index = Math.max( 0, _entries_n - 1 );
       var _id = "ALGEBRAICnewGENERATOR_" + _index ;
       var _last_edit_cell = $( "#"+_id ).get(0);
       var _gen_word = _last_edit_cell != null ? _last_edit_cell.value : _new_word ;
       if ( _index == 0 )
       {
      	  var HTMLcode = "<tr>" ;
    	    HTMLcode += "<td WIDTH=\"5\"></td>" ;
   		    HTMLcode += "<td></td>" ;
   		    HTMLcode += "<td WIDTH=\"5\"></td>" ;
   		    HTMLcode += "<td>Generator word</td>" ;
   		    HTMLcode += "<td WIDTH=\"12\"></td>" ;
   		    HTMLcode += "<td COLSPAN=\"7\" ALIGN=\"center\" STYLE=\"background-color:#EAEAF4;padding:3px;\" CLASS=\"general_rounded_corners\">Operations</td>" ;
     			HTMLcode += "<td WIDTH=\"12\"></td>" ;
     			HTMLcode += "<td ALIGN=\"center\" STYLE=\"background-color:#EAEAF4;padding:3px;\" CLASS=\"general_rounded_corners\">Out tag is</b></td>" ;
     		  HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
          $( "#ALGEBRAICnewGENERATORStable" ).html( HTMLcode );
       }

       var _rows_count = _entries_n + 2 ; // headers
       var row = table.insertRow(_rows_count);
     
       var startINDEX = 0 ;
			 var cell = row.insertCell(startINDEX);
           cell.style = "width:5px;" ;
    
           startINDEX++ ;
			     cell = row.insertCell(startINDEX);
           cell.innerHTML = (_entries_n+1)+")" ;
    
           startINDEX++ ;
       		 cell = row.insertCell(startINDEX);
           cell.style = "width:5px;" ;
    
           startINDEX++ ;
         	 cell = row.insertCell(startINDEX);
           cell.innerHTML = "<INPUT TYPE=\"edit\" VALUE=\""+_new_word+"\" STYLE=\"width:160px;\" ONKEYUP=\"javascript:CIRCLESformsMETHODeventsHANDLER( this.id, event, 0, "+_rows_count+", NO, NO, NO );CIRCLESgenssetMANAGERgeneratorUPDATEinverse(this.value,"+_rows_count+");\" ID=\"ALGEBRAICnewGENERATOR_"+_rows_count+"\">" ;
    
           startINDEX++ ;
         	 cell = row.insertCell(startINDEX);
           cell.style = "width:12px;" ;
    
           startINDEX++ ;
         	 cell = row.insertCell(startINDEX);
           cell.id = "ALGEBRAICaddGENERATOR_BTN_"+_rows_count ;
           cell.setAttribute( "class", "link_rounded" );
           cell.innerHTML = "Add" ;
           cell.onclick = function(){ CIRCLESgenssetMANAGERgensADD( _rows_count, NO, NO, NO ); };
    
           startINDEX++ ;
         	 cell = row.insertCell(startINDEX);
           cell.style = "width:12px;" ;

           var _edit_cell = $( "#ALGEBRAICnewGENERATOR_" + _rows_count ).get(0);
           if ( _edit_cell != null ) _edit_cell.focus();
                
       _glob_gens_set_rowcount = table.rows.length ;
       if ( _last_edit_cell != null && _edit_cell == null ) _last_edit_cell.focus();
	 }
	 else circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Can't add gen: memory failure", _glob_app_title );
}

function CIRCLESgenssetMANAGERcheckGENERATORsyntax( _gen )
{
	 if ( _gen.length == 0 ) return UNDET ;
	 else
	 {
      var _is_pqword = _gen.testME( _glob_pqword_regex_pattern );
      var _is_pqword_inv = _gen.testME( _glob_pqword_inv_regex_pattern );
      if ( _is_pqword || _is_pqword_inv ) return YES ;
      else
      {
    		 var _alphabet = circles_lib_alphabet_get();
    		 // include these chars too, so we can consider repetend-like gens symbols
    		 // for example [ab][AB*2] >> abABAB
    		 // they will be resolved right before the drawing process
    		 for( var _i = 0 ; _i <= 9 ; _i++ ) _alphabet.push( _i );
    					 
    		 _alphabet.push( "[", "*", "]" ); // include repetends inputs
    		 var _check = circles_lib_word_check( _gen, _alphabet );
         return _check.is_one_of( UNDET, CIRCLES_MISSING_INPUT ) ? NO : YES ;
      }
	 }
}

function CIRCLESgenssetMANAGERgensSAVE()
{
   var _pack = circles_lib_count_gens_set_model() > 0 ? _glob_gens_set_model_array.join( "@" ) : "" ;
   if ( _pack.length > 0 && !_glob_gens_set_store.includes( _pack ) )
   {
       _glob_gens_set_store.push( _pack );
       CIRCLESgenssetMANAGERgensCOMBOcreate();
   }
   else if ( _glob_gens_set_to_init ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't save: gens set shall be init first", _glob_app_title );
   else if ( circles_lib_count_gens_set_model() == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't save: current gens set is empty", _glob_app_title );
}

function CIRCLESgenssetMANAGERgensCOMBOcreate()
{
   if ( safe_size( _glob_gens_set_store, 0 ) > 0 )
   {
       var _html_code = "<SELECT ID=\"GENERATORSsetCOMBO\" ONCHANGE=\"javascript:CIRCLESgenssetMANAGERgensCOMBOselect();\">" ;
           _html_code += "<OPTION SELECTED=\"selected\" VALUE=\"\">" ;
       $.each( _glob_gens_set_store, function( _i, _packed_item ) { _html_code += "<OPTION VALUE=\""+_packed_item+"\">#" + ( _i + 1 ); } );
           _html_code += "</SELECT>" ;
       $( "#ALGEBRAICgeneratorsSETcomboCONTAINER" ).html( _html_code );
   }
}

function CIRCLESgenssetMANAGERgensCOMBOselect()
{
   var _sel_entry = $( "#GENERATORSsetCOMBO" ).val();
   if ( _sel_entry.length > 0 && _sel_entry.includes( "@" ) )
   {
      var _unpacked = _sel_entry.split( "@" );
      if ( _unpacked.length > 0 )
      {
         circles_lib_gens_set_bomb();
         _glob_gens_set_rowcount = 0 ;
         _glob_gens_set_model_array = _unpacked.clone();
         CIRCLESgenssetMANAGERreload();
         CIRCLESformsMETHODmanagerPROCESS( YES, _glob_process );
         $('[id$=initBTN]').css('color',COLOR_ERROR) ;
         _glob_items_to_init = _glob_gens_set_to_init = YES ;
         CIRCLESgenssetMANAGERiconSETUP(YES);
      }
   }
   else if ( _sel_entry.length > 0 && !_sel_entry.includes( "@" ) ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Invalid entry", _glob_app_title );
}

function CIRCLESgenssetMANAGERgensSETUP( _question, _silent )
{
   _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
	 var _entries_n = CIRCLESgenssetMANAGERcountCANDIDATEentries();
   if ( _entries_n > 0 )
   {
       for( var _i = 0 ; _i < _entries_n ; _i++ ) CIRCLESgenssetMANAGERgensUPDATE( _i, NO, YES );
			 var _question = "The current gens set includes " + _entries_n + " " + ( _entries_n == 1 ? "entry" : "entries" );
           _question += _glob_crlf + "Do you confirm to construct the gens from this current gens set ?" ;
       var _b_go = !_question ? YES : confirm( _question );
       if ( _b_go )
       {
           _glob_text = "" ;
           var _ret_chunk = circles_lib_gens_set_build( OUTPUT_TEXT, YES, YES, _question, _silent );
           _glob_gens_set_report = _glob_text ;
           var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
           var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation" ;
           if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, _ret_id ? DISPATCH_INFO : DISPATCH_ERROR, _ret_id ? _glob_gens_set_report : _ret_msg, _glob_app_title + " - Construct gens from current set", 520, "auto", null, 230 );

     			 if ( circles_lib_count_gens_set_model() != circles_lib_count_rnd_probabilities() ) _glob_rnd_probability_array.flush();

	         CIRCLESgenssetMANAGERreload();

           if ( _glob_process == PROCESS_RANDOM )
         	 {
              $("#ALGEBRAICrandomCONTAINER").html( CIRCLESmethodMANAGERrandomTABLEbuild() );
              CIRCLESmethodMANAGERrandomTABLEfill();
         	    CIRCLESmethodMANAGERrandomTABLEsave();
       		 	  CIRCLESmethodMANAGERrandomTABLEcheck();
       		 }

           _glob_gens_set_to_init = NO ;
           CIRCLESgenssetMANAGERiconSETUP( NO );
           $('[id$=renderBTN]').css('color',COLOR_ERROR) ;
           $('#ALGEBRAICgeneratorsSETreportBTN').css('color',_ret_id?COLOR_ERROR:DEFAULT_COLOR_STD);
           return _ret_chunk ;
       }
       else return [ RET_ERROR, "Init gens set aborted by user" ] ;
   }
   else if ( !_silent )
   {
      var _msg = "The gens set is empty."+_glob_crlf+"Can't build entries" ;
      if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
      return [ RET_ERROR, _msg ] ;
   }
}

function CIRCLESgenssetMANAGERgensEXACT( _question, _silent, _out_channel )
{
   _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
   var _items_array = _glob_seeds_array ;
   var _items_n = circles_lib_count_items( _items_array ), _sch_n = circles_lib_count_gens_set_model();
   if ( _items_n == 0 )
   {
       var _msg = "Can't build the exact gens set."+_glob_crlf+"The "+( _glob_items_switch == ITEMS_SWITCH_SEEDS ? "Seeds" : "Gens" )+" list is empty" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ] ;
   }
   else
   {
       var _question = "There already exists a gens set."+_glob_crlf+"Confirm to replace it ?" ;
       var _b_go = ( _sch_n > 0 && _question ) ? ( confirm( _question ) ) : YES ;
       if ( _b_go )
       {
           circles_lib_gens_model_create_exact( _out_channel );
           CIRCLESgenssetMANAGERreload();
           CIRCLESgenssetMANAGERgensSETUP( _question, _silent );
           var _msg = "The exact gens set has been built with success" ;
					 if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
           return [ RET_ERROR, _msg ] ;
       }
       else return [ RET_IRRELEVANT, "Operation aborted by user" ] ;
   }
}

function CIRCLESgenssetMANAGERgensADD( _row_index, _inverse, _question, _silent )
{
   _inverse = safe_int( _inverse, NO ), _question = safe_int( _question, NO ), _silent = safe_int( _silent, NO );
	 var _edit = $( "#ALGEBRAICnewGENERATOR_" + _row_index ).get(0);
   if ( _edit != null )
	 {
   		var _gen = _edit.value, _inverse_generator = "" ;
      var _is_pqword = _gen.testME( _glob_pqword_regex_pattern );
      var _is_pqword_inv = _gen.testME( _glob_pqword_inv_regex_pattern );
      if ( _is_pqword || _is_pqword_inv ) _inverse_generator = _gen.end_with( "inv" ) ? _gen.replaceAll( "inv", "" ) : _gen + "inv" ;
      else _inverse_generator = circles_lib_word_inverse_get( _gen );

      if ( _inverse ) _gen = _inverse_generator ;
   		var _ret_check = CIRCLESgenssetMANAGERcheckGENERATORsyntax( _gen );
			switch( _ret_check )
		 	{
					case NO:
					if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "This "+( _inverse ? "inverse" : "new" )+" gen '"+_gen+"' does not match the current alphabet.", _glob_app_title );
					break ;
					case YES:
          var _b_go = !_question ? YES : confirm( "Confirm to add the "+( _inverse ? "inverse" : "new" )+" gen '"+_gen+"' to the current set ?" );
				  if ( _b_go )
 					{
							var _table = $( "#ALGEBRAICnewGENERATORStable" ).get(0);
              // just a raw string check: no matter if word, pq-word or repetend
							var _b_found = _glob_gens_set_model_array.includes( _gen );
              if ( _gen.testME( _glob_pqword_regex_pattern ) && circles_lib_alphabet_count_cap_symbols() != 2 )
              {
                  var _msg = "P/Q words can be computed only when two letters"+_glob_crlf+"are declared (case-insensitively), that is, 'a' and 'b'" ;
                  circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
              }
							else if ( _b_found && !_silent )
              {
                  var _msg = "The "+( _inverse ? "inverse" : "new" )+" gen '"+_gen+"' already exists and can't be added again to the gens set." ;
                  if ( _glob_gens_set_to_init )
                  _msg += _glob_crlf.repeat(2) + "Please, init the gens set for changes to take effect." ;
                  circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
              }
              else if ( !_b_found )
					   	{
							    _glob_gens_set_model_array.push( _gen );
									if ( !_gen.testME( _glob_pqword_regex_pattern ) )
                  _glob_gens_set_model_array.push( circles_lib_word_inverse_get( _gen ) );

                  _glob_gens_set_rowcount++ ;
									if ( !_silent )
                  {
                      if ( !_gen.testME( _glob_pqword_regex_pattern ) )
                      circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Both gen '"+_gen+"', together with its inverse '"+_inverse_generator+"' have been added to the gens set up with success.", _glob_app_title );
                      else
                      circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The P/Q word '"+_gen+"' has been added to the gens set up with success.", _glob_app_title );
                  }

                  _edit.onkeyup = function() { CIRCLESformsMETHODeventsHANDLER( _edit.id, event, 1, _row_index, NO, YES ); }
								  _glob_gens_set_to_init = _glob_items_to_init = YES;
                  CIRCLESgenssetMANAGERiconSETUP(YES);
                  $('[id$=initBTN]').css('color',COLOR_ERROR) ;
                  $( "#ALGEBRAICnewGENERATORStable" ).html( CIRCLESgenssetMANAGERshowGENStable(YES) );
							}
					}
					break ;
					case -1:
					if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't add: the gen symbol is empty.", _glob_app_title );
					break ;
					case -2:
					if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't add: the current alphabet is empty and the candidate new gen can't be added to the gens set.", _glob_app_title );
					break ;
			}
	 }
	 else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Can't add gen to the gens set: memory failure", _glob_app_title );
}

function CIRCLESgenssetMANAGERgeneratorUPDATEinverse( _gen, _row_index )
{
   // try to recover old value before replacement
   var _old_generator = _glob_gens_set_model_array[_row_index], _old_inverse_generator = "" ;
   if ( _old_generator != null )
   {
       var _is_pqword = _old_generator.testME( _glob_pqword_regex_pattern );
       var _is_pqword_inv = _old_generator.testME( _glob_pqword_inv_regex_pattern );
       if ( _is_pqword || _is_pqword_inv ) _old_inverse_generator = _old_generator.end_with( "inv" ) ? _old_generator.replaceAll( "inv", "" ) : _old_generator + "inv" ;
       else _old_inverse_generator = circles_lib_word_inverse_get( _old_generator );
       var _old_inverse_gen_index = _glob_gens_set_model_array.find_it( _old_inverse_generator );
       if( _old_inverse_gen_index != UNDET && $( "#ALGEBRAICnewGENERATOR_" + _old_inverse_gen_index ).get(0) != null )
       {
   				 var _inverse_generator = "" ;
           var _is_pqword = _gen.testME( _glob_pqword_regex_pattern );
           var _is_pqword_inv = _gen.testME( _glob_pqword_inv_regex_pattern );
           if ( _is_pqword || _is_pqword_inv ) _inverse_generator = _gen.end_with( "inv" ) ? _gen.replaceAll( "inv", "" ) : _gen + "inv" ;
           else _inverse_generator = circles_lib_word_inverse_get( _gen );
           $( "#ALGEBRAICnewGENERATOR_" + _old_inverse_gen_index ).val( _inverse_generator );
       }
   }
}

function CIRCLESgenssetMANAGERgensUPDATE( _row_index, _question, _silent )
{
   _row_index = safe_int( _row_index, 0 );
   _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
 	 var _edit = $( "#ALGEBRAICnewGENERATOR_" + _row_index ).get(0);
   if ( _edit != null )
	 {
       // try to recover old value before replacement
       var _old_generator = _glob_gens_set_model_array[_row_index], _old_inverse_generator = "" ;
       var _is_pqword = _old_generator.testME( _glob_pqword_regex_pattern );
       var _is_pqword_inv = _old_generator.testME( _glob_pqword_inv_regex_pattern );
       if ( _is_pqword || _is_pqword_inv ) _old_inverse_generator = _old_generator.end_with( "inv" ) ? _old_generator.replaceAll( "inv", "" ) : _old_generator + "inv" ;
       else _old_inverse_generator = circles_lib_word_inverse_get( _old_generator );
       var _old_inverse_gen_index = _glob_gens_set_model_array.find_it( _old_inverse_generator );
   		 var _gen = _edit.value.trim(), _inverse_generator = "" ;
       var _is_pqword = _gen.testME( _glob_pqword_regex_pattern );
       var _is_pqword_inv = _gen.testME( _glob_pqword_inv_regex_pattern );
       if ( _is_pqword || _is_pqword_inv ) _inverse_generator = _gen.end_with( "inv" ) ? _gen.replaceAll( "inv", "" ) : _gen + "inv" ;
       else _inverse_generator = circles_lib_word_inverse_get( _gen );

 			 var _ret_check = CIRCLESgenssetMANAGERcheckGENERATORsyntax( _gen );
	     switch( _ret_check )
			 {
					case NO:
					if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Gen '"+_gen+"' does not match the current alphabet.", _glob_app_title );
					break ;
					case YES:
          var _b_go = !_question ? YES : confirm( "Confirm to update the new gen '"+_gen+"' ?" );
					if ( _b_go )
					{
              // updates the gen entry
              _glob_gens_set_model_array[_row_index] = _gen ;
              // updates the inverse gen entry
              if ( _old_inverse_gen_index != UNDET )
              _glob_gens_set_model_array[_old_inverse_gen_index] = _inverse_generator ;
              else if ( !_glob_gens_set_model_array.includes( _inverse_generator ) )
              _glob_gens_set_model_array.push( _inverse_generator );

				      if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The gen '"+_gen+"' has been updated with success.", _glob_app_title );
              _glob_gens_set_to_init = YES ;
              CIRCLESgenssetMANAGERiconSETUP(YES);
    			}
					break ;
					case -1:
					if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't update: the gen symbol is empty.", _glob_app_title );
					break ;
					case -2:
					if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't update: the current alphabet is empty and the candidate new gen can't be added.", _glob_app_title );
					break ;
	        default: break ;
			 }
	 }
	 else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Controls memory failure: can't update gens set.", _glob_app_title );
}

function CIRCLESgenssetMANAGERgensDELETE( _row_index, _force, _b_switch, _question, _silent )
{
   _row_index = safe_int( _row_index, UNDET ), _force = safe_int( _force, NO );
   _b_switch = safe_int( _b_switch, YES );
   _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
	 var _edit = $( "#ALGEBRAICnewGENERATOR_" + _row_index ).get(0);
   if ( _glob_gens_set_to_init && !_force )
   {
       if ( !_silent )
       {
           alert_plug_label( ALERT_OK, "Force deletion" );
           alert_plug_fn( ALERT_OK, "CIRCLESgenssetMANAGERgensDELETE( "+_row_index+", YES, YES, "+_question+", "+_silent+" );alertCLOSE();" );
           alert_plug_fn( ALERT_CANCEL, "alertCLOSE();" );
           circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING | DISPATCH_OKCANCEL, "Can't delete this entry: the gens set init is still pending.", _glob_app_title );
       }
   }
	 else if ( _edit != null )
	 {
  		 var _gen_symbol = _edit.value, _inv_gen_symbol = circles_lib_word_inverse_get( _gen_symbol );
  		 var _b_go = _gen_symbol.length == 0 ? YES : ( !_question ? YES : confirm( "Confirm to delete the gen '"+_gen_symbol+"' from the gens set ?" ) );
			 if ( _b_go )
			 {
					 var _table = $( "#ALGEBRAICnewGENERATORStable" ).get(0);
					 var _old_rows = safe_size( _table.rows, 0 );
					 if ( _table != null && _row_index < _old_rows ) _table.deleteRow( _row_index );
					 var _new_rows = safe_size( _table.rows, 0 );
					 if ( _new_rows == _old_rows - 1 )
					 {
							 var _candidate_gen, _container, _btn, _n_removed = 0 ;
               var _sch_n = circles_lib_count_gens_set_model();
		           for( var _i = 0 ; _i < _sch_n ; _i++ )
		           {
									 _candidate_gen = _glob_gens_set_model_array[_i] ;
									 if ( _gen_symbol.stricmp( _candidate_gen ) ||
                        _inv_gen_symbol.stricmp( _candidate_gen ) )
                   {
							      _glob_gens_set_model_array.remove( _i, _i );
		                  _glob_gens_set_rowcount-- ;
                      _n_removed++ ;
                      _i = -1 ;
                      _sch_n = circles_lib_count_gens_set_model();
                   }
							 }

               if ( _n_removed > 0 )
               {
                   CIRCLESgenssetMANAGERreload();
                   _glob_gens_set_to_init = YES ;
                   CIRCLESgenssetMANAGERiconSETUP(YES);
               }

               if ( _glob_gens_set_rowcount == 0 && _b_switch ) circles_lib_items_switch_to(ITEMS_SWITCH_SEEDS,YES);
					 }
					 else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Can't delete gen '"+_gen_symbol+"' from the current set: code failure", _glob_app_title );
			 }
	 }
	 else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Can't delete gen '"+_gen_symbol+"' from the current set: memory failure", _glob_app_title );
}

function CIRCLESgenssetMANAGERgensBOMB( _b_switch, _question, _silent )
{
   _b_switch = safe_int( _b_switch, YES ), _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
	 var _entries_n = CIRCLESgenssetMANAGERcountCANDIDATEentries();
   if ( _entries_n > 0 )
   {
       var _question = "The gens set includes " + _entries_n + " gen" + ( _entries_n == 1 ? "" : "s" ) + "" ;
           _question += "\nConfirm to delete them all ?" ;
       var _b_go = !_question ? YES : confirm( _question );
       if ( _b_go )
       {
           circles_lib_gens_set_bomb();
           _glob_gens_set_rowcount = 0 ;
           _glob_gens_set_to_init = _glob_items_to_init = NO ;
           $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
           CIRCLESgenssetMANAGERreload();
           CIRCLESformsMETHODmanagerPROCESS( YES, _glob_process );
           if ( _glob_gens_set_rowcount == 0 && _b_switch ) circles_lib_items_switch_to(ITEMS_SWITCH_SEEDS,YES);
           CIRCLESgenssetMANAGERiconSETUP(NO);
       }
   }
   else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The gens set is already empty.", _glob_app_title );
}