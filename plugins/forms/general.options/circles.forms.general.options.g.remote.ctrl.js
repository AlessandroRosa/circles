function CIRCLESformsGENERALOPTIONSremotectrl( _options, _return_fn, _ret_array, _out_channel )
{
	if ( !is_array( _options ) )
	{
        if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
		return NO ;
	}

	var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "general.options" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
	switch( _options[0].toLowerCase() )
	{
        case "close":
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        var _sub = "forms", _base_id = "general.options".replace( /[\.\_\-]/g, '' );
        circles_lib_plugin_activate( NO, _base_id, '', '', _sub, CLOSE, _div_id );
        _ret_array.push( YES, "<green>Plug-in has been closed with success</green>" ) ;
		return YES ;
        break ;
		case "focus":
        var _sub = "forms", _base_id = "general.options" ;
        circles_lib_plugin_focus( _div_id );
        _ret_array.push( 1, "<green>Plug-in has been focused with success</green>" ) ;
        return 1;
        break ;
		case "random.ifs.last.pt":
		if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
		{
			if ( is_string( _options[1] ) )
			{
				$( "#CIRCLESgeneraloptionsLASTPTcoordsEDIT" ).val( _options[1] );
				CIRCLESformsGENERALOPTIONSeventHANDLER( "CIRCLESgeneraloptionsLASTPTcoordsEDIT", { keyCode : 13 } ) ;
				_ret_array.push( 1, "<green>Last point has been set up with success</green>" ) ;
                return YES ;
			}
            else { _ret_array.push( 0, "<orange>Fail to set up the last point</orange>" ) ; return NO ; }
		}
		else
		{
		   _ret_array.push( 0, "<orange>Last point coords can be input when the 'Basics' tab is visible</orange>" ) ;
		   return NO ;
		}
		break ;
		case "random.ifs.activate":
		if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
		{
			_out_msg = "<green>IFS random params have been activated with success</green>" ;
			_glob_scheduled_rendering_flag = _glob_density_scan_flag = _glob_use_last_pt = YES ;
			_glob_method = METHOD_ALGEBRAIC, _glob_process = PROCESS_RANDOM ;
			CIRCLESformsGENERALOPTIONSifsrandomOPTIONSmanager();
		    _ret_array.push( 1, _out_msg ) ;
            return YES ;
		}
		else
        {
			_out_msg = "<orange>IFS random params can be activated when the 'Basics' tab is visible</orange>" ;
			_ret_array.push( 0, _out_msg ) ;
			return NO ;
        }
		break ;
		case "random.ifs.deactivate":
		if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
		{
			_out_msg = "<green>IFS random params have been activated with success</green>" ;
			_glob_scheduled_rendering_flag = _glob_density_scan_flag = _glob_use_last_pt = NO ;
			_glob_method = METHOD_ALGEBRAIC, _glob_process = PROCESS_BREADTHFIRST ;
			CIRCLESformsGENERALOPTIONSifsrandomOPTIONSmanager();
		    _ret_array.push( 1, _out_msg ) ;
			return YES ;
		}
		else
        {
		    _out_msg = "<orange>IFS random params can be activated when the 'Basics' tab is visible</orange>" ;
			_ret_array.push( 0, _out_msg ) ;
			return NO ;
        }
		break ;
		case "random.ifs.region":
		if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
		{
			if ( is_string( _options[1] ) )
			{
				$("#CIRCLESgeneraloptionsDENSITYWEIGHTcombo option").each( function() { if( $(this).text().stricmp( _options[1] ) ) $(this).attr('selected', 'selected'); });
				_ret_array.push( YES, "<green>Region has been set up with success</green>" ) ;
                return YES ;
			}
            else
			{
				_ret_array.push( NO, "<orange>Failure</orange>" ) ;
				return NO ;
			}
		}
		else
        {
		    _out_msg = "<orange>Last point coords can be input when the 'Basics' tab is visible</orange>" ;
	        _ret_array.push( NO, _out_msg ) ;
			return NO ;
        }
		break ;
		case "ifs.time":
		if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
		{
			if ( is_string( _options[1] ) )
			{
				$( "#CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeEDIT" ).val( Math.max( 1, safe_int( _options[1], 0 ) ) );
				CIRCLESformsGENERALOPTIONSeventHANDLER( "CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeEDIT", { keyCode : 13 } ) ;
				_ret_array.push( YES, "<green>IFS time has been set up with success</green>" ) ;
                return YES ;
			}
            else { _ret_array.push( NO, "<orange>IFS time has not been set up with success</orange>" ) ; return NO ; }
		}
		else
        {
          _out_msg = "<orange>Rendering time can be input when the 'Basics' tab is visible</orange>" ;
		  _ret_array.push( NO, _out_msg ) ;
          return NO ;
        }
		break ;
		case "move":
        var _subset = "forms", _base_id = "general.options" ;
		var _ret = move_div( _plugin_tmp_vars_array[ _subset ][ _base_id.replace( /[\.\_\-]/g, '' ) ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toLowerCase() : "TOP" );
        _ret_array.push( YES, "<green>Plug-in has been moved with success</green>" ) ;
        return YES ;
		break ;
		case "open":
        _ret_array.push( 1, "<green>Plug-in has been opened with success</green>" ) ;
        return YES ;
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
          var _this_fn_name = "CIRCLESformsGENERALOPTIONSmain('general.options', 1, 2)" ;
          HTMLcode = CIRCLESformsGENERALOPTIONSzplanelayersTAB( _this_fn_name );
          circles_lib_set_caption_text( _div_id, "General Options - Z-plane" );
          CIRCLESformsGENERALOPTIONSresize( WIDTH - 20, HEIGHT );

          if ( $("#GENERALOPTIONStabCONTAINER").get(0) != null ) $("#GENERALOPTIONStabCONTAINER").html( HTMLcode );

          CIRCLESformsGENERALOPTIONSlayersINITsliders( Z_PLANE );
          CIRCLESformsGENERALOPTIONSlayersINITcanvasTHUMBNAILS( Z_PLANE );
          break ;
          case "wplane":
          WIDTH = 450, HEIGHT = Math.max( $(window).height() - 90, 260 ) ;
          var _this_fn_name = "CIRCLESformsGENERALOPTIONSmain('general.options', 1, 3)" ;
          HTMLcode = CIRCLESformsGENERALOPTIONSwplanelayersTAB( _this_fn_name );
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

	    _ret_array.push( 1, "<green>Tab has been switched to '"+_tabname+"'</green>" ) ;
        return YES ;
        break ;
		default:
        _ret_array.push( 0, "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ) ;
        return NO ;
		break ;
	}

	if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}