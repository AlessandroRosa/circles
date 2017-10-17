function CIRCLESformsMETHOD_REMOTE_CTRL_KEYWORDS_INIT()
{

}

function CIRCLESformsMETHODremotectrl( _options, _return_fn, _ret_array, _out_channel )
{
		if ( !is_array( _options ) )
		{
       if ( typeof _return_fn === "function" ) _return_fn.call( this, "<orange>Invalid input data for remote control management</orange>" );
			 return 0 ;
		}

		var _out_msg = "" ;
    var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "method" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
		switch( _options[0].toLowerCase() )
		{
        case "close":
        GLOB_PLUGIN_DESTROY_POPUP_VARS();
        var _sub = "forms", _base_id = "method" ;
        circles_lib_plugin_activate( NO, _sub, '', '', _base_id, CLOSE, _plugin_tmp_vars_array[ _sub ][ _base_id.replace( /[\.\_\-]/g, '' ) ] );
        _ret_array.push( 1, "<green>Plug-in has been closed with success</green>" ) ;
        return 1 ;
        break ;
				case "focus":
        var _sub = "forms", _base_id = "method" ;
        circles_lib_plugin_focus( _div_id );
        _ret_array.push( 1, "<green>Plug-in has been focused with success</green>" ) ;
        return 1;
        break ;
				case "move":
        var _sub = "forms", _base_id = "method" ;
				var _ret = move_div( _plugin_tmp_vars_array[ _sub ][ _base_id ], _options[1] != null ? _options[1].toUpperCase() : "LEFT", _options[2] != null ? _options[2].toLowerCase() : "TOP" );
        _ret_array.push( 1, "<green>Plug-in has been moved with success</green>" ) ;
        return 1 ;
				break ;
				case "repetends":
        var DIV = $( "#CIRCLESMETHODmainDIV" ).get(0);
        if ( DIV != null ) DIV.tabber.tabShow(0);
		   _ret_array.push( 1, "<green>Tab has been switched to 'repetends'</green>" ) ;
        return 1;
        break ;
				case "generators":
        var DIV = $( "#CIRCLESMETHODmainDIV" ).get(0);
        if ( DIV != null ) DIV.tabber.tabShow(1);
		   _ret_array.push( 1, "<green>Tab has been switched to 'generators'</green>" ) ;
        return 1;
        break ;
				case "random":
        var DIV = $( "#CIRCLESMETHODmainDIV" ).get(0);
        if ( DIV != null ) DIV.tabber.tabShow(2);
		   _ret_array.push( 1, "<green>Tab has been switched to 'random'</green>" ) ;
        return 1;
        break ;
				case "points":
        var DIV = $( "#CIRCLESMETHODmainDIV" ).get(0);
        if ( DIV != null ) DIV.tabber.tabShow(3);
		   _ret_array.push( 1, "<green>Tab has been switched to 'points'</green>" ) ;
        return 1;
        break ;
				case "switchtab":
        switch( _options[1] )
        {
  				case "repetends":
          var DIV = $( "#CIRCLESMETHODmainDIV" ).get(0);
          if ( DIV != null ) DIV.tabber.tabShow(0);
		   _ret_array.push( 1, "<green>Tab has been switched to 'repetends'</green>" ) ;
          return 1;
          break ;
  				case "generators":
          var DIV = $( "#CIRCLESMETHODmainDIV" ).get(0);
          if ( DIV != null ) DIV.tabber.tabShow(1);
		   _ret_array.push( 1, "<green>Tab has been switched to 'generators'</green>" ) ;
          return 1;
          break ;
  				case "random":
          var DIV = $( "#CIRCLESMETHODmainDIV" ).get(0);
          if ( DIV != null ) DIV.tabber.tabShow(2);
		   _ret_array.push( 1, "<green>Tab has been switched to 'random'</green>" ) ;
          return 1;
          break ;
  				case "points":
          var DIV = $( "#CIRCLESMETHODmainDIV" ).get(0);
          if ( DIV != null ) DIV.tabber.tabShow(3);
		   _ret_array.push( 1, "<green>Tab has been switched to 'points'</green>" ) ;
          return 1;
          break ;
          default:break ;
        }
        break ;
				default:
				        _ret_array.push( 0, "<orange>Unknown remote control command '"+_options[0].toLowerCase()+"'</orange>" ) ;
        return 0 ;
				break ;
		}

		if ( typeof _return_fn === "function" && safe_size( _out_msg, 0 ) > 0 ) _return_fn.call( this, _out_msg );
}