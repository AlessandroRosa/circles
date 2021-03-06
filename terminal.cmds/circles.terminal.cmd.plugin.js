function circles_terminal_cmd_plugin()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose && _glob_terminal_echo_flag )
     circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

	 var _last_release_date = get_file_modify_date( _glob_paths['terminal_abs_cmds'], "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _help = NO ;
     var _fn_ret_val = null ;
     var _cmd_params = [];

	 if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     if ( _params.length > 0 )
     {
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['help'] = NO ;
        _cmd_params['keywords'] = NO ;
             
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _cmd_terms_dict = [];
			_cmd_terms_dict.push( "close", "current", "html", "list", "remotecmds", "open", "release", "run", "set", "send", "silent", "var" );
        circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else if ( _p.is_one_of_i( "available", "close", "current", "list", "remotecmds", "move",
				 "open", "set", "send", "target", "var", "varslist" ) ) _cmd_params['action'] = _p.toLowerCase();
            else if ( _p.is_one_of_i( "silent" ) ) _cmd_params.push( _p ) ;
            else
            {
                if ( _cmd_params['action'] != null )
                {
                    switch( _cmd_params['action'] )
                    {
                      case "available":
               		  if ( !is_array( _cmd_params[ _cmd_params['action'] ] ) ) _cmd_params[ _cmd_params['action'] ] = [] ;
      				  _cmd_params[ _cmd_params['action'] ].push( _p );
                      break ;
                      case "move":
                      if ( _cmd_params['send.params'] == null ) _cmd_params['send.params'] = [] ;
                      _cmd_params['send.params'].push( _p );
					  break ;
                      case "var": _cmd_params['var'] = _p ; break ;
                      case "open":
                      if ( _cmd_params['family'] == null ) _cmd_params['family'] = _p ;
                      else if ( _cmd_params['def'] == null ) _cmd_params['def'] = _p ;

                      if ( _cmd_params['send.params'] == null ) _cmd_params['send.params'] = [] ;
                      _cmd_params['send.params'].push( _p );
                      break ;
                      case "set":
                      case "target":
                      if ( _cmd_params['family'] == null ) _cmd_params['family'] = _p ;
                      else if ( _cmd_params['def'] == null ) _cmd_params['def'] = _p ;
                      break ;
                      case "send":
                      if ( _cmd_params['send.params'] == null ) _cmd_params['send.params'] = [] ;
                      _cmd_params['send.params'].push( _p );
                      break ;
                      default:
                      break ;
                    }
                }
                else circles_lib_output( _out_channel, DISPATCH_WARNING, "Unknown input parameter '"+_p+"'", _par_1, _cmd_tag );
            }
        }

        var _already = _glob_verbose == _cmd_params['mode'] ? YES : NO ;
        _glob_verbose = _cmd_params['mode'] ;

        if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
        else if ( _cmd_params['keywords'] )
        {
            var _msg = circles_lib_terminal_tabular_arrange_data( _cmd_terms_dict.sort() ) ;
            if ( _msg.length == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
            else
            {
                _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
            }
        }
        else if ( !_b_fail )
        {
            var _action = _cmd_params['action'] ;
            switch( _action )
            {
             	case "available" :
                var _settings = _cmd_params[ 'available' ] ;
                var _subset = is_array( _settings ) ? safe_string( _settings[0], "" ) : "" ;
				console.log( _subset );
					var vars = { tip: "",
					             folder : "plugins/" + (_subset.length>0?_subset+"/":""),
					             filter : "/^.*\.(ini)$/i",
							     exact : 0,
							     search_params : "1,1,1,0" } ;
					var _result = get_filedata_from_folder( "support/code/phpcode/svc/svc.filelist.php", "POST", false, vars );
                    if ( _result.includes( "@@" ) ) _result = _result.split( "@@" );
					if ( safe_size( _result, 0 ) == 0 )
						circles_lib_output( _out_channel, DISPATCH_WARNING, "No available plug-ins for subset '"+_subset+"'", _par_1, _cmd_tag );
					else
					{
						var _rows = null, _crlf = "", _item, _archive = [] ;
						var _extract_entries = [ "caption", "subset", "baseid" ] ;
						$.each( _result, function( _i, _data_chunk ) {
							// crlf detection
 							_crlf = _data_chunk.includes( CRLF_WIN ) ? CRLF_WIN : CRLF_NOWIN ;
							_rows = _data_chunk.split( _crlf );
							_item = [] ;
							$.each( _rows, function( _r, _row ) {
								if ( _row.count( "=" ) == 1 ) // check syntax
								{
									$.each( _extract_entries, function( _e, _ee ) {
										if ( _row.toLowerCase().start_with( _ee ) )
										_item[""+_ee] = ( _row.split( "=" ) )[1];
										} ) ;
								} } );
								_archive.push( _item ) ;
								} ) ;

		                 var _cols_width = [ 15, 25, 25, 36 ], _startINDEX = 0 ;
		                 	 _row = "<lightgray>Available plug-ins belonging to '"+_subset+"'</lightgray>" ;
		                 	 _row += _glob_crlf + "<gold>Open form syntax example</gold> <lightgreen>plugin open "+_subset+" general.options</lightgreen>" ;
		                     _row += _glob_crlf.repeat(2) + "<snow>"+( new String( "Subset" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</snow>" ;
		                     _startINDEX++ ;
		                     _row += "<white>"+( new String( "Opening id" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</white>" ;
		                     _startINDEX++ ;
		                     _row += "<lightblue>"+( new String( "plug-in caption" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</lightblue>" ;
						circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
						var _subset, _base_id, _caption, _visible ;
		                $.each( _archive, function( _i, _chunk ) {
								_subset = _chunk['subset'], _base_id = _chunk['baseid'], _caption = _chunk['caption'] ;
		                        _startINDEX = 0 ;
								_row  = "<snow>"+_subset.rpad( " ", _cols_width[_startINDEX] )+"</snow>" ;
		                        _startINDEX++ ;
								_row += "<lightblue>"+_base_id.rpad( " ", _cols_width[_startINDEX] )+"</lightblue>" ;
		                        _startINDEX++ ;
								_row += "<white>"+_caption.rpad( " ", _cols_width[_startINDEX] )+"</white>" ;
		                        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
		                    } );
					}
             	break ;
                case "close":
                if ( _plugin_tmp_vars_array['plugin_sel'] != null )
                {
                    var _src = _plugin_tmp_vars_array['plugin_sel']['orig_family_def'] ;
                    if ( _src != null )
                    {
                        var _famLC = _src.fam.toLowerCase(), _defUC = _src.def.toUpperCase().replace( /[\.\_\-]/g, "" ) ;
                        var _options = [ "close" ] ;
                        var _ret_array = [] ;
                        var _dispatcher_fn = "CIRCLES" + _famLC + _defUC + "remotectrl( _options, null, _ret_array, "+_out_channel+" )" ;
                        var _output = null ;
                        try{ eval( "_output = " + _dispatcher_fn + ";" ) }
                        catch( _err ) { circles_lib_error_obj_handler( _err ) ; }
						if ( _output && is_array( _ret_array ) )
						{
							if ( _ret_array.length == 2 )
							circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _ret_array[1], _par_1, _cmd_tag );
							else
							circles_lib_output( _out_channel, DISPATCH_WARNING, "Illegal response from event dispatching system", _par_1, _cmd_tag );
						}
						else circles_lib_output( _out_channel, DISPATCH_ERROR, "Failure", _par_1, _cmd_tag );
                    }
                    else circles_lib_output( _out_channel, DISPATCH_ERROR, "Please, use 'set' action to fix the working plug-in first or cmds wouldn't be accepted", _par_1, _cmd_tag );
                }
                else circles_lib_output( _out_channel, DISPATCH_ERROR, "Please, use 'set' action to fix the working plug-in first or cmds wouldn't be accepted", _par_1, _cmd_tag );
                case "current":
                if ( _plugin_tmp_vars_array['plugin_sel'] != null )
                {
					console.log( _plugin_tmp_vars_array['plugin_sel'] );
                    var _plugin_specs = _plugin_tmp_vars_array['plugin_sel']['packed_name'].split("@") ;
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "Current plug-in is <yellow>"+_plugin_specs[0]+ "</yellow> <white>"+_plugin_specs[1]+"</white>", _par_1, _cmd_tag );
                }
                else circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot get current plug-in: please, set it first", _par_1, _cmd_tag );
                break ;
                case "list":
                var _cols_width = [ 9, 14, 25, 30, 10 ], _startINDEX = 0, _row = "" ;
                 	 _row = "<lightgray>Currently open pop-up windows</lightgray>" ;
                     _row += _glob_crlf + "<snow>"+( new String( "Visible" ) ).rpad( " ", _cols_width[_startINDEX] ) + "</snow>" ;
                     _startINDEX++ ;
                     _row += "<lightblue>"+( "Subset" ).rpad( " ", _cols_width[_startINDEX] ) + "</lightblue>" ;
                     _startINDEX++ ;
                     _row += "<white>"+( "Name" ).rpad( " ", _cols_width[_startINDEX] ) + "</white>" ;
                     _startINDEX++ ;
                     _row += "<lightblue>"+( "Popup caption" ).rpad( " ", _cols_width[_startINDEX] ) + "</lightblue>" ;
                     _startINDEX++ ;
                     _row += "<lightblue>"+( "Active" ).rpad( " ", _cols_width[_startINDEX] ) + "</lightblue>" ;
                  circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                  var _subset, _base_id, _caption, _visible ;
                  $.each( _glob_popups_array, function( _i, _chunk )
                          {
                            _base_id = _chunk[12], _caption = _chunk[2], _visible = _chunk[4], _subset = _chunk[8] ;
                         	_startINDEX = 0 ;
                            _row = "<"+(_visible?"green":COLOR_ERROR)+">"+(_visible?"yes":"no").rpad( " ", _cols_width[_startINDEX] )+"</"+(_visible?"green":COLOR_ERROR)+">" ;
                            _startINDEX++ ;
  							_row += "<lightblue>"+_subset.rpad( " ", _cols_width[_startINDEX] )+"</lightblue>" ;
                            _startINDEX++ ;
  							_row += "<white>"+_base_id.rpad( " ", _cols_width[_startINDEX] )+"</white>" ;
                            _startINDEX++ ;
                            _row += "<lightblue>"+_caption.rpad( " ", _cols_width[_startINDEX] )+"</lightblue>" ;
							_startINDEX++ ;
							_row += ""+(_chunk[6]?"<lime>Yes</lime>":"<slategray>No</slategray>") ;
                            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row, _par_1, _cmd_tag );
                          }
                        );
                break ;
                case "open":
                case "move":
                      var _fam = "", _def = "" ;
                      var _json = {} ;
					  if ( _cmd_params['family'] != null && _cmd_params['def'] != null ) { _json.fam = _cmd_params['family'], _json.def = _cmd_params['def'] ; }
					  else _json = _plugin_tmp_vars_array['plugin_sel']['orig_family_def'] ;
                      if ( _json != null ) { _fam = _json.fam, _def = _json.def ; }
                      if ( _fam.length > 0 && _def.length > 0 )
                      {
                        	var _open_cmd = "circles_lib_plugin_load( '"+_fam+"', '"+_def+"' );" ;
                        	try{ eval( "var _return_open = " + _open_cmd + ";" ) }
                        	catch( _err ) { circles_lib_error_obj_handler( _err ) ; }
                          circles_lib_output( _out_channel, _return_open ? DISPATCH_SUCCESS : DISPATCH_ERROR, ( _return_open ? "Success" : "Failure" )+" in opening "+_fam+" "+_def, _par_1, _cmd_tag );

                          if ( !_return_open )
                          circles_lib_output( _out_channel, DISPATCH_WARNING, "Check whether input '"+_def+"' could have been mispelled or '"+_fam+"' is not the correct category, or mandatory params are missing", _par_1, _cmd_tag );
                          else
                          {
                            if ( _json != null )
                            {
								var _famLC = _json.fam.toLowerCase(), _defUC = _json.def.toUpperCase().replace( /[\.\_\-]/g, "" ) ;
								var _options = [_action] ;
								if ( is_array( _cmd_params['send.params'] ) ) _options = _options.concat( _cmd_params['send.params'] );
								var _ret_array = [] ;
								var _dispatcher_fn = "CIRCLES" + _famLC + _defUC + "remotectrl( _options, null, _ret_array, "+_out_channel+" )" ;
								var _output = null ;
							    setTimeout( function()
								{
									try{ eval( "_output = " + _dispatcher_fn + ";" ) }
									catch( _err ) { circles_lib_error_obj_handler( _err ) ; }
									
									if ( _output && is_array( _ret_array ) )
									{
										if ( _ret_array.length == 2 )
										{
										   _plugin_tmp_vars_array['plugin_sel']['orig_family_def'] = { fam : _fam, def : _def } ;
										   _plugin_tmp_vars_array['plugin_sel']['packed_name'] = _fam + "@" + _def ;
										   circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _ret_array[1], _par_1, _cmd_tag );
										}
										else
										circles_lib_output( _out_channel, DISPATCH_WARNING, "Illegal response from event dispatching system", _par_1, _cmd_tag );
									}
									else circles_lib_output( _out_channel, DISPATCH_ERROR, "Failure", _par_1, _cmd_tag );
								}, 700 );
                            }
                            else circles_lib_output( _out_channel, DISPATCH_ERROR, "Please, use 'set' action to fix the working plug-in first or cmds wouldn't be accepted", _par_1, _cmd_tag );
                          }
                      }
                      else circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot open the mask: please, set a plug-in first", _par_1, _cmd_tag );
                break ;
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "remotecmds":
                if ( _plugin_tmp_vars_array['plugin_sel'] != null )
                {
                    var _json = _plugin_tmp_vars_array['plugin_sel']['orig_family_def'] ;
                    var _path = "plugins/" + _json.fam + "/" + _json.def + "/remote.cmds.info" ;
                    var jqxhr = $.get( _path, function() {}).done(function( _data ) {
                        _data = _data.split( _glob_crlf ) ;
                        if ( _data.length > 0 )
                        {
                          circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "Remote control messages for plug-in <yellow>" + _json.fam + "</yellow> <white>" + _json.def + "</white>", _par_1, _cmd_tag );
                          for( var _i = 0 ; _i < _data.length ; _i++ )
                          {
                            if ( _data[_i].includes( "=" ) )
                            {
                              _data[_i] = _data[_i].split( "=" );
                              if ( _data[_i].length == 2 )
                              {
                                 _data[_i][0] = _data[_i][0].replace( /\"/g, "" ) ;
                                 _data[_i][1] = _data[_i][1].replace( /\"/g, "" ) ;
                                 circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<white>"+_data[_i][0]+"</white> <lightblue>"+_data[_i][1]+"</lightblue>", _par_1, _cmd_tag );
                              }
                            }
                          }
                        }
                        else circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot get current plug-in remote control lists: missing file remotecmds.info", _par_1, _cmd_tag );
                      })
                      .fail(function() {
                        circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot get current plug-in remote control lists: missing file remotecmds.info", _par_1, _cmd_tag );
                      })
                }
                else circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot get current plug-in remote control lists: please, set it first", _par_1, _cmd_tag );
                break ;
                case "send":
                if ( _plugin_tmp_vars_array['plugin_sel'] != null )
                {
                    if ( is_array( _cmd_params['send.params'] ) )
                    {
                       var _src = _plugin_tmp_vars_array['plugin_sel']['orig_family_def'] ;
                       if ( _src != null )
                       {
                          var _famLC = _src.fam.toLowerCase(), _defUC = _src.def.toUpperCase().replace( /[\.\_\-]/g, "" ) ;
                          var _options = _cmd_params['send.params'] ;
                          var _ret_array = [] ;
                          var _dispatcher_fn = "CIRCLES" + _famLC + _defUC + "remotectrl( _options, null, _ret_array, "+_out_channel+" )" ;
                          var _output = null ;
                          try{ eval( "_output = " + _dispatcher_fn + ";" ) }
                          catch( _err ) { circles_lib_error_obj_handler( _err ) ; }
						  if ( _output && is_array( _ret_array ) )
						  {
							if ( _ret_array.length == 2 )
							circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _ret_array[1], _par_1, _cmd_tag );
							else
							circles_lib_output( _out_channel, DISPATCH_WARNING, "Illegal response from event dispatching system", _par_1, _cmd_tag );
						  }
						  else circles_lib_output( _out_channel, DISPATCH_ERROR, "Failure", _par_1, _cmd_tag );
                       }
                       else circles_lib_output( _out_channel, DISPATCH_ERROR, "Please, use 'set' action to fix the working plug-in first or cmds wouldn't be accepted", _par_1, _cmd_tag );
                    }
                    else circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing params specification after 'send' action", _par_1, _cmd_tag );
                }
                else circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot send event to plug-in: please, set it first", _par_1, _cmd_tag );
                break ;
                case "set":
                case "target":
                if ( _plugin_tmp_vars_array['plugin_sel'] == null ) _plugin_tmp_vars_array['plugin_sel'] = [] ;
                var _fam = _cmd_params['family'] != null ? _cmd_params['family'] : "" ;
                var _def = _cmd_params['def'] != null ? _cmd_params['def'] : "" ;
                if ( is_consistent_string( _fam ) && is_consistent_string( _def ) )
                {
				   var _exists = check_file_exists( _glob_paths['plugins'] + _fam + "/" + _def + "/remote.cmds.info" ) ;
				   if ( _exists )
				   {
					   var _famLC = _fam.toLowerCase(), _famUC = _fam.toUpperCase();
					   var _defLC = _def.toLowerCase(), _defUC = _def.toUpperCase();
					   _plugin_tmp_vars_array['plugin_sel']['orig_family_def'] = { fam : _fam, def : _def } ;
					   _plugin_tmp_vars_array['plugin_sel']['packed_name'] = _fam + "@" + _def ;
					   circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<green>plug-in target has been correctly set to</green> <white>"+_cmd_params['family']+" "+_cmd_params['def']+"</white>", _par_1, _cmd_tag );
					   circles_lib_output( _out_channel, DISPATCH_INFO, "Next commands will be dispatched to this plug-in", _par_1, _cmd_tag );
				   }
				   else circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<orange>Fail to set plug-in</orange> <white>'"+_fam+"' '"+_def+"'</white><orange>: wrong definition or missing components</orange>", _par_1, _cmd_tag );
                }
                else circles_lib_output( _out_channel, DISPATCH_ERROR, "Cannot set plug-in: missing couple family specification / definition", _par_1, _cmd_tag );
                break ;
                case "varslist":
                if ( _plugin_tmp_vars_array['plugin_sel'] != null )
                {
                      var _src = _plugin_tmp_vars_array['plugin_sel']['orig_family_def'] ;
                      if ( _src != null )
                      {
                          var _famLC = _src.fam.toLowerCase(), _defUC = _src.def.toUpperCase().replace( /[\.\_\-]/g, "" ) ;
                          var _options = [ "vars.list" ] ;
                          var _dispatcher_fn = "CIRCLES" + _famLC + _defUC + "remotectrl( _options, null )" ;
                          var _output = null ;
                        	try{ eval( "_output = " + _dispatcher_fn + ";" ) }
                        	catch( _err ) { circles_lib_error_obj_handler( _err ) ; }
                          if ( is_string( _output ) )
                          {
                             circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _output, _par_1, _cmd_tag );
                          }
                      }
                      else circles_lib_output( _out_channel, DISPATCH_ERROR, "Please, use 'set' action to fix the working plug-in first or cmds wouldn't be accepted", _par_1, _cmd_tag );
                }
                else circles_lib_output( _out_channel, DISPATCH_ERROR, "Please, use 'set' action to fix the working plug-in first or cmds wouldn't be accepted", _par_1, _cmd_tag );
                break ;
                case "var":
                if ( _plugin_tmp_vars_array['plugin_sel'] != null )
                {
                      var _plugin_sel = _plugin_tmp_vars_array['plugin_sel']['orig_family_def'] ;
                      var _var_set = _cmd_params['var'] ;
                      if ( _var_set.includes( "=" ) )
                      {
                        _var_set = _var_set.split( "=" );
                        _var_set[0] = _var_set[0].trim(), _var_set[1] = _var_set[1].trim();
                        if ( _var_set[0].length > 0 && _var_set[1].length > 0 )
                        {
                          if ( _plugin_tmp_vars_array[ 'plugin_sel' ] == null ) _plugin_tmp_vars_array[ 'plugin_sel' ] = [] ;
                          _plugin_tmp_vars_array[ 'plugin_sel' ][ _var_set[0] ] = _var_set[1] ;
                          var _famLC = _plugin_sel.fam.toLowerCase(), _defUC = _plugin_sel.def.toUpperCase().replace( /[\.\_\-]/g, "" ) ;
                          var _options = [ "update.params", _var_set[1] ] ;
                          var _dispatcher_fn = "CIRCLES" + _famLC + _defUC + "remotectrl( _options, null )" ;
                          var _output = null ;
                        	try{ eval( "_output = " + _dispatcher_fn + ";" ) }
                        	catch( _err ) { circles_lib_error_obj_handler( _err ) ; }
                          var _b_ok = _output ? DISPATCH_SUCCESS : DISPATCH_ERROR ;
                          circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "Plugin <white>" + _plugin_sel.fam + " " + _plugin_sel.def + "</white> : var <white>" + _var_set[0] + "</white> "+(_b_ok?"correctly":"not")+" set to <white>" + _var_set[1] + "</white>", _par_1, _cmd_tag );
                        }
                        else
                        {
                          if ( _var_set[0].length == 0 )
                          circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing <var-id> specification", _par_1, _cmd_tag );
                          if ( _var_set[1].length == 0 )
                          circles_lib_output( _out_channel, DISPATCH_ERROR, "Missing <var-value> specification", _par_1, _cmd_tag );
                        }
                      }
                      else circles_lib_output( _out_channel, DISPATCH_ERROR, "var setting shall be in the form <var-id>=<var-value>", _par_1, _cmd_tag );
                }
                else circles_lib_output( _out_channel, DISPATCH_ERROR, "Please, use 'set' action to fix the working plug-in first or cmds wouldn't be accepted", _par_1, _cmd_tag );
                break ;
                default: break ;
            }
        }
     }
     else { _b_fail = YES, _error_str = "Missing input params" ; }

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION )
     circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}