function CIRCLESformsMETHODeventsHANDLER( _ctrl_id, _event )
{
	  if ( _event.stopPropagation )      _event.stopPropagation();
	  if ( _event.cancelBubble != null ) _event.cancelBubble = true;

    var _return_pressed = _event.keyCode == 13 ? YES : NO ;
    var _param1 = arguments[2], _param2 = arguments[3] ;
    var _param3 = safe_int( arguments[4], 0 ), _param4 = safe_int( arguments[5], 0 );
    var _param5 = safe_int( arguments[6], 0 );
		if( _return_pressed )  // return key code
		{
				_event.preventDefault();
        if ( _glob_worker_lock ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, CIRCLES_WARNING_LABEL_02, _glob_app_title );
				else if ( _ctrl_id.includes( "DICTIONARYPANELoptionsEDIT" ) ) CIRCLESformsDICTIONARYperformACTIONask(CIRCLESformsDICTIONARYbaseid, _param1, _param2, YES );
		    else if ( _ctrl_id.start_with( "ALGEBRAICnewGENERATOR_" ) )
		    {
            _param1 = safe_int( _param1, 0 );
            _param2 = safe_int( _param2, 0 );

            // collecting tmp gens model
            var _tmp_gens_model = [], _l ;
 	          $( "[id^=ALGEBRAICnewGENERATOR_]" ).each( function( _i, _box ){ _l = $( "#" + _box.id ).val().trim() ; if ( _l.length > 0 ) _tmp_gens_model.push( _l ) } );
            var _is_new = !_tmp_gens_model.deep_compare_to( _glob_gens_model_array );

            if ( _is_new )
            {
                if ( _param1 == 0 ) CIRCLESgenssetMANAGERgensADD( _param2, _param3, _param4, _param5 );
    		        else if ( _param1 == 1 ) CIRCLESgenssetMANAGERgensUPDATE( _param2, _param3, _param4 );
                if ( !_glob_gens_set_to_init )
                {
                    _glob_gens_set_to_init = _glob_items_to_init = YES ;
                    $('[id$=initBTN]').css('color',COLOR_ERROR) ;
        		    	  CIRCLESgenssetMANAGERiconSETUP(YES);
                }
                else CIRCLESgenssetMANAGERgensSETUP( YES && CIRCLESformsMETHODskipconfirm?0:1, YES ) ;
            }
		    }
        else if ( _ctrl_id.stricmp( "ALGEBRAICfixedpointsINPUTedit" ) )
        {
            var _ret = CIRCLESformsMETHODfixedpointsADD( 1, '', 0, '', NO, NO, YES );
            if( _ret ) CIRCLESformsMETHODfixedpointsLIST();
        }
        else if ( _ctrl_id.start_with( "ALGEBRAICfixedpointsLISTedit" ) )
        {
            var _opcode = arguments[2], _edit_id = _ctrl_id ;
            var _list_row_index = safe_int( arguments[3], UNDET );
            var _word = safe_string( arguments[4], "" );
            var _ret = CIRCLESformsMETHODfixedpointsADD( _opcode, _edit_id, _list_row_index, _word, YES, OUTPUT_SCREEN );
            if( _ret ) CIRCLESformsMETHODfixedpointsLIST();
        }
        else if ( _ctrl_id.start_with( "ALGEBRAICrepetendWORD_" + _param1 ) )
        {
            _param1 = safe_int( _param1 );
            _param2 = safe_string( _param2 );
            CIRCLESmethodMANAGERrepetendsUPDATE( YES, _param1, _param2 );
        }
        else if ( _ctrl_id.start_with( "ALGEBRAICrepetendsINPUTword" ) ) $( "#ALGEBRAICrepetendsINPUTtermination" ).focus();
        else if ( _ctrl_id.start_with( "ALGEBRAICrepetendsINPUTtermination" ) ) CIRCLESmethodMANAGERrepetendsADD();
		    else if ( _ctrl_id.includes( "ALGEBRAICrepetendsLENGTH" ) ) CIRCLESmethodMANAGERrepetendsSTORE(NO,YES);
		}
    else
    {
		     if ( _ctrl_id.start_with( "ALGEBRAICnewGENERATOR_" ) )
		     {
             var _str, _index ;
             $( "[id^=ALGEBRAICnewGENERATOR_]" ).each( function( _i, _box )
                                                       {
                                                           _str = safe_string( $( "#" + _box.id  ).val(), "" ).trim() ;
                                                           _index = safe_int( _box.id .replaceAll( "ALGEBRAICnewGENERATOR_", "" ), 0 );
                                                           if ( _str.length == 0 ) $( "#ALGEBRAICnewGENERATORTYPE_" + _index ).html( "Empty" );
                                                           else if ( _str.testME( _glob_symbol_regex_pattern ) ) $( "#ALGEBRAICnewGENERATORTYPE_" + _index ).html( "Symbol" );
                                                           else if ( _str.testME( _glob_repetend_regex_pattern ) ) $( "#ALGEBRAICnewGENERATORTYPE_" + _index ).html( "Repetend" );
                                                           else $( "#ALGEBRAICnewGENERATORTYPE_" + _index ).html( "Word" );
                                                       }
                                                     ) ;
             _glob_gens_set_to_init = _glob_items_to_init = YES ;
             $('[id$=initBTN]').css('color',COLOR_ERROR) ;
 		    	   CIRCLESgenssetMANAGERiconSETUP(YES);
		     }
    }
}