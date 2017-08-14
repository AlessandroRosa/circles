function CIRCLESformsGENERALOPTIONSremotectrl( _options, _return_fn, _out_channel )
{
		if ( !is_array( _options ) )
		{
       if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
			 return 0 ;
		}

		var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "general.options" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popup_array[_idx][1] : "" ;
		switch( _options[0].toLowerCase() )
		{
				case "activate.ifs":
				if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
				{
					_out_msg = "<green>IFS random params have been activated with success</green>" ;
					_glob_scheduled_rendering_flag = _glob_density_scan_flag = _glob_use_last_pt = YES ;
					_glob_method = METHOD_ALGEBRAIC, _glob_process == PROCESS_RANDOM ;
					$( "#CIRCLESgeneraloptionsUSELASTPTcheckbox" ).prop( "disabled", false );
					$( "#CIRCLESgeneraloptionsUSELASTPTcheckbox" ).prop( "checked", "checked" );
					$( "#CIRCLESgeneraloptionsSCHEDULEDRENDERINGcheckbox" ).prop( "disabled", false );
					$( "#CIRCLESgeneraloptionsSCHEDULEDRENDERINGcheckbox" ).prop( "checked", "checked" );
						
					$( "#CIRCLESgeneraloptionsDENSITYWEIGHTcheckbox" ).prop( "disabled", false );
					$( "#CIRCLESgeneraloptionsDENSITYWEIGHTcheckbox" ).prop( "checked", "checked" );
						
					circles_lib_extras_htmlctrl_enable( "CIRCLESgeneraloptionsDENSITYWEIGHTcombo", YES ) ;
					CIRCLESformsGENERALOPTIONSifsrandomOPTIONSmanager();
          return 1 ;
				}
				else
        {
          _out_msg = "<orange>IFS random params can be activated when the 'Basics' tab is visible</orange>" ;
          return 0 ;
        }
				break ;
        case "close":
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        var _sub = "forms", _base_id = "general.options" ;
        circles_lib_plugin_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ] );
          return 1 ;
        break ;
				case "focus":
        var _sub = "forms", _base_id = "general.options" ;
        circles_lib_plugin_focus( _div_id );
        return 1;
        break ;
				case "ifs.last.pt":
				if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
				{
						if ( is_string( _options[1] ) )
						{
								$( "#CIRCLESgeneraloptionsLASTPTcoordsEDIT" ).val( _options[1] );
								CIRCLESformsGENERALOPTIONSeventHANDLER( "CIRCLESgeneraloptionsLASTPTcoordsEDIT", { keyCode : 13 } ) ;
                return 1 ;
						}
            else return 0 ;
				}
				else
        {
           _out_msg = "<orange>Last point coords can be input when the 'Basics' tab is visible</orange>" ;
           return 0 ;
        }
				break ;
				case "ifs.region":
				if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
				{
						if ( is_string( _options[1] ) )
						{
								$("#CIRCLESgeneraloptionsDENSITYWEIGHTcombo option").each( function() { if( $(this).text().stricmp( _options[1] ) ) $(this).attr('selected', 'selected'); });
                return 1 ;
						}
            else return 0 ;
				}
				else
        {
          _out_msg = "<orange>Last point coords can be input when the 'Basics' tab is visible</orange>" ;
          return 0 ;
        }
				break ;
				case "ifs.time":
				if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
				{
						if ( is_string( _options[1] ) )
						{
							 $( "#CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeEDIT" ).val( Math.max( 1, safe_int( _options[1], 0 ) ) );
							 CIRCLESformsGENERALOPTIONSeventHANDLER( "CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeEDIT", { keyCode : 13 } ) ;
               return 1 ;
						}
            else return 0 ;
				}
				else
        {
          _out_msg = "<orange>Last point coords can be input when the 'Basics' tab is visible</orange>" ;
          return 0 ;
        }
				break ;
				case "move":
        var _subset = "forms", _base_id = "general.options" ;
				var _ret = move_div( _plugin_tmp_vars_array[ _subset ][ _base_id.replace( /[\.\_\-]/g, '' ) ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toLowerCase() : "TOP" );
        return 1 ;
				break ;
        case "tab":
        var _subset = "forms", _base_id = "general.options" ;
        var _tabname = _options[1] != null ? _options[1].toLowerCase() : "basics" ;
            _tabname = _tabname.replace( /[\.\_\-]/g, "" );
        var HTMLcode = "", WIDTH = 450, HEIGHT = 0 ;
        var _idx = circles_lib_plugin_find_index( { subset : 'forms', base_id : 'general.options' }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID ) ;
        var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;

        switch( _tabname )
        {
          case "basics":
          WIDTH = 430, HEIGHT = 384 ;
          HTMLcode = CIRCLESformsGENERALOPTIONSbasicsTAB();
          circles_lib_set_caption_text( _div_id, "General Options - basics" );

          if ( $("#GENERALOPTIONStabCONTAINER").get(0) != null ) $("#GENERALOPTIONStabCONTAINER").html( HTMLcode );
          break ;
          case "zplane":
          HEIGHT = Math.max( $(window).height() - 90, 260 ) ;
          var this_fn_name = "CIRCLESformsGENERALOPTIONSmain('general.options', 1, 2)" ;
          HTMLcode = CIRCLESformsGENERALOPTIONSzplanelayersTAB( this_fn_name );
          circles_lib_set_caption_text( _div_id, "General Options - Z-plane" );
          CIRCLESformsGENERALOPTIONSresize( WIDTH - 20, HEIGHT );

          if ( $("#GENERALOPTIONStabCONTAINER").get(0) != null ) $("#GENERALOPTIONStabCONTAINER").html( HTMLcode );

          CIRCLESformsGENERALOPTIONSlayersINITsliders( Z_PLANE );
          CIRCLESformsGENERALOPTIONSlayersINITcanvasTHUMBNAILS( Z_PLANE );
          break ;
          case "wplane":
          WIDTH = 450, HEIGHT = Math.max( $(window).height() - 90, 260 ) ;
          var this_fn_name = "CIRCLESformsGENERALOPTIONSmain('general.options', 1, 3)" ;
          HTMLcode = CIRCLESformsGENERALOPTIONSwplanelayersTAB( this_fn_name );
          circles_lib_set_caption_text( _div_id, "General Options - W-plane" );
          CIRCLESformsGENERALOPTIONSresize( WIDTH - 20, HEIGHT );

          if ( $("#GENERALOPTIONStabCONTAINER").get(0) != null ) $("#GENERALOPTIONStabCONTAINER").html( HTMLcode );

          CIRCLESformsGENERALOPTIONSlayersINITsliders( W_PLANE );
          CIRCLESformsGENERALOPTIONSlayersINITcanvasTHUMBNAILS( W_PLANE );
          break ;
          case "colors":
          WIDTH = 430, HEIGHT = 280 ;
          CIRCLESformsGENERALOPTIONSresize( WIDTH, HEIGHT );
          HTMLcode = CIRCLESformsGENERALOPTIONScolorsTAB();
          circles_lib_set_caption_text( _div_id, "General Options - Colors" );
          if ( $("#GENERALOPTIONStabCONTAINER").get(0) != null ) $("#GENERALOPTIONStabCONTAINER").html( HTMLcode );
          break ;
          case "extras":
          WIDTH = 430, HEIGHT = 346 ;
          CIRCLESformsGENERALOPTIONSresize( WIDTH, HEIGHT );
          HTMLcode = CIRCLESformsGENERALOPTIONSextrasTAB();
          circles_lib_set_caption_text( _div_id, "General Options - Extras" );
          if ( $("#GENERALOPTIONStabCONTAINER").get(0) != null ) $("#GENERALOPTIONStabCONTAINER").html( HTMLcode );
          break ;
          case "export":
          WIDTH = 430, HEIGHT = 200 ;
          CIRCLESformsGENERALOPTIONSresize( WIDTH, HEIGHT );
          HTMLcode = CIRCLESformsGENERALOPTIONSexportTAB();
          circles_lib_set_caption_text( _div_id, "General Options - Export" );
          if ( $("#GENERALOPTIONStabCONTAINER").get(0) != null ) $("#GENERALOPTIONStabCONTAINER").html( HTMLcode );
          break ;
          default: break ;
        }

        return 1 ;
        break ;
				default:
				_out_msg = "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ;
        return 0 ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}