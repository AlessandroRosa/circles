function CIRCLESembeddingsGENERALPURPOSE_EVENTS( ctrl_id, event )
{
	  if ( event.stopPropagation )      event.stopPropagation();
	  if ( event.cancelBubble != null ) event.cancelBubble = true;
    var _is_tab = event.keyCode == 9 ? YES : NO ;

    switch( event.type.toLowerCase() )
    {
        case "keyup":
        switch( event.target.id )
        {
            case "PLUGINvarvalueEDIT": $( "#PLUGINparam_declareBTN" ).css( "color", DEFAULT_COLOR_WARNING ); break ;
            default: break ;
        }
        break ;
        default: break ;
    }

		switch( event.keyCode )
		{
				case 9: // horz tab
				case 13: // return
				if ( ctrl_id.is_one_of( "PLUGIN_PARAM_A", "PLUGIN_PARAM_B", "PLUGIN_PARAM_C", "PLUGIN_PARAM_D" ) )
  			{
            if ( ctrl_id.start_with( "PLUGIN_PARAM_" ) )
            {
               if( CIRCLESembeddingsGENERALPURPOSEcurr_sel == UNDET )
               {
                   $( "#CIRCLESembeddingsGENERALPURPOSE_ADD_BTN" ).css( { "color" : DEFAULT_COLOR_WARNING } );
                   $( "#CIRCLESembeddingsGENERALPURPOSE_UPDATE_BTN" ).css( { "color" : DEFAULT_COLOR_STD } );
               }
               else
               {
                   $( "#CIRCLESembeddingsGENERALPURPOSE_ADD_BTN" ).css( { "color" : DEFAULT_COLOR_STD } );
                   $( "#CIRCLESembeddingsGENERALPURPOSE_UPDATE_BTN" ).css( { "color" : DEFAULT_COLOR_WARNING } );
               }
            }

            if ( ctrl_id.strcmp( "PLUGIN_PARAM_A" ) )
            {
               if ( !_is_tab ) $("#PLUGIN_PARAM_B").focus();
               var _a_text = $( "#PLUGIN_PARAM_A" ).val();
               if ( _a_text.includes( "," ) )
               {
                  var _entries = _a_text.replaceAll( ";", "," ).split( "," );
                  for( var _i = 0 ; _i < _entries.length ; _i++ )
                  {
                     if ( _i == 0 ) $("#PLUGIN_PARAM_A").val( _entries[_i].trim() );
                     else if ( _i == 1 ) $("#PLUGIN_PARAM_B").val( _entries[_i].trim() );
                     else if ( _i == 2 ) $("#PLUGIN_PARAM_C").val( _entries[_i].trim() );
                     else if ( _i == 3 ) $("#PLUGIN_PARAM_D").val( _entries[_i].trim() );
                  }
               }
            }
            else if ( ctrl_id.strcmp( "PLUGIN_PARAM_B" ) )
            {
               if ( !_is_tab ) $("#PLUGIN_PARAM_C").focus();
               var _b_text = $( "#PLUGIN_PARAM_B" ).val();
               if ( _b_text.includes( "," ) )
               {
                  var _entries = _b_text.replaceAll( ";", "," ).split( "," );
                  for( var _i = 0 ; _i < _entries.length ; _i++ )
                  {
                     if ( _i == 0 ) $("#PLUGIN_PARAM_A").val( _entries[_i].trim() );
                     else if ( _i == 1 ) $("#PLUGIN_PARAM_B").val( _entries[_i].trim() );
                     else if ( _i == 2 ) $("#PLUGIN_PARAM_C").val( _entries[_i].trim() );
                     else if ( _i == 3 ) $("#PLUGIN_PARAM_D").val( _entries[_i].trim() );
                  }
               }
            }
            else if ( ctrl_id.strcmp( "PLUGIN_PARAM_C" ) )
            {
               if ( !_is_tab ) $("#PLUGIN_PARAM_D").focus();
               var _c_text = $( "#PLUGIN_PARAM_C" ).val();
               if ( _c_text.includes( "," ) )
               {
                  var _entries = _c_text.replaceAll( ";", "," ).split( "," );
                  for( var _i = 0 ; _i < _entries.length ; _i++ )
                  {
                     if ( _i == 0 ) $("#PLUGIN_PARAM_A").val( _entries[_i].trim() );
                     else if ( _i == 1 ) $("#PLUGIN_PARAM_B").val( _entries[_i].trim() );
                     else if ( _i == 2 ) $("#PLUGIN_PARAM_C").val( _entries[_i].trim() );
                     else if ( _i == 3 ) $("#PLUGIN_PARAM_D").val( _entries[_i].trim() );
                  }
               }
            }
					  else if ( ctrl_id.strcmp( "PLUGIN_PARAM_D" ) )
            {
               var _d_text = $( "#PLUGIN_PARAM_D" ).val();
               if ( _d_text.includes( "," ) )
               {
                  var _entries = _d_text.replaceAll( ";", "," ).split( "," );
                  for( var _i = 0 ; _i < _entries.length ; _i++ )
                  {
                     if ( _i == 0 ) $("#PLUGIN_PARAM_A").val( _entries[_i].trim() );
                     else if ( _i == 1 ) $("#PLUGIN_PARAM_B").val( _entries[_i].trim() );
                     else if ( _i == 2 ) $("#PLUGIN_PARAM_C").val( _entries[_i].trim() );
                     else if ( _i == 3 ) $("#PLUGIN_PARAM_D").val( _entries[_i].trim() );
                  }
               }

               if ( !_is_tab ) CIRCLESembeddingsGENERALPURPOSE_GEN_UPDATE( CIRCLESembeddingsGENERALPURPOSEcurr_sel == UNDET ? CIRCLESembeddingsGENERALPURPOSE_ADD : CIRCLESembeddingsGENERALPURPOSE_UPDATE, YES );
               _glob_items_to_init = YES ;
               $('[id$=initBTN]').css('color',COLOR_ERROR) ;
               CIRCLESembeddingsGENERALPURPOSE_REGISTER_PARAMS();
            }
				}
        else if ( ctrl_id.stricmp( "PLUGINvaridEDIT" ) ) $( "#PLUGINvarvalueEDIT" ).focus();
        else if ( ctrl_id.stricmp( "PLUGINvarvalueEDIT" ) )
        {
             if ( safe_string( $( "#PLUGINvaridEDIT" ).val(), "" ).trim().length > 0 &&
                  safe_string( $( "#PLUGINvarvalueEDIT" ).val(), "" ).trim().length > 0 )
             CIRCLESembeddingsGENERALPURPOSE_VAR_DECLARE();
        }
				break ;
        default:
        _plugin_step_index = 0 ;
        GLOB_PLUGIN_WIZARD_STEP(0,NO);
        break ;
		}
}