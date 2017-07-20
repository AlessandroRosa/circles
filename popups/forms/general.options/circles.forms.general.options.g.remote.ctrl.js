function CIRCLESformsGENERALOPTIONSremotectrl( _options, _return_fn )
{
		if ( !is_array( _options ) )
		{
				if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
				return ;
		}
	  
		var _out_msg = "" ;
		switch( _options[0].toLowerCase() )
		{
				case "activateifs":
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
				}
				else _out_msg = "<orange>IFS random params can be activated when the 'Basics' tab is visible</orange>" ;
				break ;
				case "ifslastpt":
				if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
				{
						if ( is_string( _options[1] ) )
						{
								$( "#CIRCLESgeneraloptionsLASTPTcoordsEDIT" ).val( _options[1] );
								CIRCLESformsGENERALOPTIONSeventHANDLER( "CIRCLESgeneraloptionsLASTPTcoordsEDIT", { keyCode : 13 } ) ;
						}
				}
				else _out_msg = "<orange>Last point coords can be input when the 'Basics' tab is visible</orange>" ;
				break ;
				case "ifstime":
				if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
				{
						if ( is_string( _options[1] ) )
						{
								$( "#CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeEDIT" ).val( Math.max( 1, safe_int( _options[1], 0 ) ) );
								CIRCLESformsGENERALOPTIONSeventHANDLER( "CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeEDIT", { keyCode : 13 } ) ;
						}
				}
				else _out_msg = "<orange>Last point coords can be input when the 'Basics' tab is visible</orange>" ;
				break ;
				case "ifsregion":
				if ( CIRCLESformsGENERALOPTIONStabindex == 1 )
				{
						if ( is_string( _options[1] ) )
						{
								$("#CIRCLESgeneraloptionsDENSITYWEIGHTcombo option").each( function() { if( $(this).text().stricmp( _options[1] ) ) $(this).attr('selected', 'selected'); });
						}
				}
				else _out_msg = "<orange>Last point coords can be input when the 'Basics' tab is visible</orange>" ;
				break ;
				default:
				_out_msg = "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}