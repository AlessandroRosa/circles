_glob_terminal_cmd_files_include[ "layer" ] = [ "keepcmd" ] ;

function circles_terminal_cmd_layer()
{
	var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
    var _params = arguments[0] ;
    var _output_channel = arguments[1] ;
    var _par_1 = arguments[2] ;
    var _cmd_mode = arguments[3] ;
    var _caller_id = arguments[4] ;
    _params = safe_string( _params, "" ).trim();

    if ( _glob_verbose && _glob_terminal_echo_flag )
    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

	var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _params_assoc_array = [];

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
        _params_assoc_array['html'] = _output_channel == OUTPUT_HTML ? YES : NO ;
        _params_assoc_array['keywords'] = NO ;
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); 
        // pre-scan for levenshtein correction
		var _local_cmds_params_array = [];
    	_local_cmds_params_array.push( "apply", "bip", "bkcolor", "clean", "close", "copy", "create",
                "default", "delete", "from", "hide", "info", "list", "merge",
                "open", "opacity", "rec", "redirect", "resize", "reversepile", "show", "split",
                "to", "thumbnail", "update", "visible", "wplane", "zplane", "html", "help" );
        circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _output_channel );

		var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
		_params_assoc_array['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
		_params_assoc_array['dump_operator_index'] = _dump_operator_index ;
		_params_assoc_array['dump_array'] = [];
				
		// gather all dump parameters into one array
        if ( _params_assoc_array['dump'] )
        {
    		for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
    		if ( _params_array[_i].trim().length > 0 ) _params_assoc_array['dump_array'].push( _params_array[_i] );
        }
				 
         // distribute all input values into arrays of categories
         _params_assoc_array['plane'] = _glob_target_plane != NO_PLANE ? circles_lib_plane_def_get( _glob_target_plane ) : "zplane" ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array['action'] = "" ;
         _params_assoc_array['params'] = [];
         var _p,  _b_cmd_open = NO ;
         // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
         var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
         var _index_associations = [];
         for( var _i = 0 ; _i < _up_to_index ; _i++ )
         {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.stricmp( "open" ) )
            {
                if ( _glob_storage[_cmd_tag] == null ) _glob_storage[_cmd_tag] = [] ;
                _glob_storage[_cmd_tag]['open'] = YES ;
                circles_lib_terminal_interpreter( "keepcmd "+_cmd_tag, _glob_terminal, _output_channel );

                if ( _output_channel == OUTPUT_TERMINAL )
                circles_lib_output( _output_channel, DISPATCH_STANDARD, "Open special mode: type action", _par_1, _cmd_tag );
            }
            else if ( _p.stricmp( "close" ) )
            {
                if ( _glob_storage[_cmd_tag] == null ) _glob_storage[_cmd_tag] = [] ;
                _glob_storage[_cmd_tag]['open'] = PENDING ;
                circles_lib_terminal_interpreter( "keepcmd off", _glob_terminal, _output_channel );
            }
            else if ( _p.is_one_of_i( "to" ) ) _index_associations[ "" + _p ] = _i ;
            else if ( _p.stricmp( "rec" ) ) _params_assoc_array['rec'] = YES ;
            else if ( _p.testME( _glob_percentage_regex_pattern ) ) _params_assoc_array['w'] = safe_int( _p, 0 );
            else if ( _p.testME( _glob_positive_integer_regex_pattern ) )
            {
                if ( _params_assoc_array['w'] == null ) _params_assoc_array['w'] = safe_int( _p, 0 );
                else if ( _params_assoc_array['h'] == null ) _params_assoc_array['h'] = safe_int( _p, 0 );
            }
            else if ( _p.is_one_of_i( "apply", "clean", "create", "default", "delete", "info", "list", "merge",
                                      "redirect", "release", "resize", "reversepile", "split", "thumbnail", "update" ) )
            {
				if ( _params_assoc_array['action'].strcmp( "redirect" ) && _p.stricmp( "list" ) ) _params_assoc_array['action'] += _p ;
				else
				{
					_params_assoc_array['action'] = _p ;
					_index_associations['action'] = _i ;
				}
            }
            else if ( _p.is_one_of_i( "copy" ) )
            {
                // works in special mode only
                if ( _glob_storage[_cmd_tag]['open'] )
                {
                    _glob_storage[_cmd_tag]['action'] = _p ;
                    if ( _output_channel == OUTPUT_TERMINAL )
                    circles_lib_output( _output_channel, DISPATCH_STANDARD, "Insert source layer for copy (e.g. 'zplane work')", _par_1, _cmd_tag );
                }
                else { _b_fail = YES ; _error = _p + " action works in special mode exclusively" ; break ; }
              }
              else if ( _glob_storage[_cmd_tag] != null )
              {
                if ( _glob_storage[_cmd_tag]['action'].strcmp( "copy" ) )
                {
                    if ( _p.is_one_of_i( "zplane", "wplane" ) )
                    {
                        if ( _glob_storage[_cmd_tag]['from_plane'] == null )
                        _glob_storage[_cmd_tag]['from_plane'] = _p ;
                        else if ( _glob_storage[_cmd_tag]['to_plane'] == null )
                        _glob_storage[_cmd_tag]['to_plane'] = _p ;
                    }
                    else
                    {
                        if ( _glob_storage[_cmd_tag]['from_layer'] == null )
                        {
                            _glob_storage[_cmd_tag]['from_layer'] = _p ;
                            if ( _output_channel == OUTPUT_TERMINAL )
                            circles_lib_output( _output_channel, DISPATCH_STANDARD, "Insert destination layer for copy (e.g. 'wplane work')", _par_1, _cmd_tag );
                        }
                        else if ( _glob_storage[_cmd_tag]['to_plane'] == null )
                        {
                            _glob_storage[_cmd_tag]['to_plane'] = _p ;
                            if ( _output_channel == OUTPUT_TERMINAL )
                            circles_lib_output( _output_channel, DISPATCH_STANDARD, "Type 'apply' to proceed", _par_1, _cmd_tag );
                        }
                    }
                }
            }
            else if ( _params_assoc_array['action'].strcmp( "redirect" ) )
            {
                if ( _params_assoc_array['from_plane'] == null )
                {
                    if ( _p.stricmp( "zplane" ) ) _params_assoc_array['from_plane'] = Z_PLANE ;
                    else if ( _p.stricmp( "wplane" ) ) _params_assoc_array['from_plane'] = W_PLANE ;
                    _index_associations['from_plane'] = _i ;
                }
                else if ( _i == _index_associations['from_plane'] + 1 )
                {
                    _params_assoc_array['from_service'] = _p ;
                    _index_associations['from_service'] = _i ;
                }
                else if ( _i == _index_associations[ "to" ] + 1 )
                {
                    if ( _p.stricmp( "zplane" ) ) _params_assoc_array['to_plane'] = Z_PLANE ;
                    else if ( _p.stricmp( "wplane" ) ) _params_assoc_array['to_plane'] = W_PLANE ;
                    else if ( _p.stricmp( "bip" ) ) _params_assoc_array['to_plane'] = BIP_BOX ;
                    _index_associations['to_plane'] = _i ;
                }
                else if ( _i == _index_associations['to_plane'] + 1 )
                {
                    _params_assoc_array['to_service'] = _p ;
                    _index_associations['to_service'] = _i ;
                }
            }
            else if ( !_p.testME( _glob_illegalchars_regex_pattern ) &&
                      _params_assoc_array['action'].is_one_of( "create", "delete", "list", "thumbnail", "update" ) )
            {
                if ( _p.is_one_of_i( "zplane", "wplane", "bip" ) )
                {
                    _params_assoc_array['plane'] = _p ;
                    _index_associations['plane'] = _i ;
					if ( _params_assoc_array['action'].is_one_of( "create", "delete", "update" ) )
                    {
                        _params_assoc_array['params'].push( _p );
                        _index_associations['params'] = _i ;
                    }
                }
                else
                {
                    _params_assoc_array['params'].push( _p );
                    _index_associations['params'] = _i ;
                }
            }
            else if ( _p.is_one_of_i( "zplane", "wplane" ) ) _params_assoc_array['plane'] = _p ;
         }
     }
     else { _b_fail = YES ; _error_str = "Missing input params" ; }
	 
     // elaborating the params
     if ( _params_assoc_array['help'] ) circles_lib_terminal_help_cmd( _params_assoc_array['html'], _cmd_tag, _par_1, _output_channel );
     else if ( _params_assoc_array['keywords'] )
     {
         var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
         if ( _msg.length == 0 ) circles_lib_output( _output_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
         else
         {
             _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
             circles_lib_output( _output_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
         }
     }
     else if ( !_b_fail )
     {
           var _params = _params_assoc_array['params'] ;
           var _action = safe_string( _params_assoc_array['action'], "" );
               _action = ( _action.strcmp( "apply" ) && _glob_storage[_cmd_tag] != null ) ? _glob_storage[_cmd_tag]['action'] : _action ;
               _action = safe_string( _action, "" ).trim();
           switch( _action )
           {
                case "clean":
                var _plane_type = circles_lib_plane_get_value( _params_assoc_array['plane'] );
                var _plane_def = circles_lib_plane_def_get( _plane_type );
                var _default_pile = circles_lib_canvas_layer_pile_default_get( _plane_type );
                var _layers_role_pile = [];
                if ( _default_pile != null )
                {
                    $.each( _default_pile, function( _i, _layer ) { _layers_role_pile.push( _layer.get_role_id() ); } );
                    if ( _plane_type == Z_PLANE )
                    {
	                    var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, _layers_role_pile.clone(), YES, YES, YES, NO, YES, YES, _output_channel );
					    var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
					    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
					    if ( _ret_id == RET_ERROR ) { _b_fail = YES, _error_str = _ret_msg ; }
					}
                    else if ( _plane_type == W_PLANE )
                    circles_lib_canvas_render_wplane( null, wplane_sm, _layers_role_pile.clone(), YES, NO, NO, YES, NO, YES, _output_channel );

					if ( !_b_fail )
                    circles_lib_output( _output_channel, DISPATCH_SUCCESS, _plane_def + " has been cleaned with success", _par_1, _cmd_tag );
                }
                else { _b_fail = YES ; _error_str = "Missing plane specification: allowed values are 'zplane', 'wplane'" ; }
                break ;
                case "copy":
                var _from_plane = _glob_storage[_cmd_tag]['from_plane'] ;
                    _from_plane = ( _from_plane.strcmp( "zplane" ) ) ? Z_PLANE : W_PLANE ;
                var _from_layer = _glob_storage[_cmd_tag]['from_layer'] ;

                var _to_plane = _glob_storage[_cmd_tag]['to_plane'] ;
                    _to_plane = ( _to_plane.strcmp( "zplane" ) ) ? Z_PLANE : W_PLANE ;
                var _to_plane = _glob_storage[_cmd_tag]['to_plane'] ;

                    _from_layer = circles_lib_canvas_layer_find( _from_plane, FIND_LAYER_BY_ROLE_DEF, _from_layer, _output_channel );
                var _from_canvas = ( _from_layer != null ) ? _from_layer.get_idcanvas() : "" ;
                    _from_canvas = $( "#" + _from_canvas ).get(0);
                    _to_plane = circles_lib_canvas_layer_find( _to_plane, FIND_LAYER_BY_ROLE_DEF, _to_plane, _output_channel );
                var _to_canvas = ( _to_plane != null ) ? _to_plane.get_idcanvas() : "" ;
                    _to_canvas = $( "#" + _to_canvas ).get(0);
                if ( is_html_canvas( _from_canvas ) && is_html_canvas( _to_canvas ) )
                {
                    var _ret = circles_lib_canvas_copy( _from_canvas, _to_canvas );
                    if ( _output_channel == OUTPUT_TERMINAL )
                    circles_lib_output( _output_channel, _ret ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret ? "Copy success" : "Copy failure", _par_1, _cmd_tag );
                }
                else { _b_fail = YES ; _error_str = "Invalid source / destination copy specifications" ; }
                _glob_storage[_cmd_tag]['open'] = PENDING ;
                break ;
                case "create":
                case "delete":
                case "update":
                var _required_n_params = _params.length ;
                if      ( _action.is_one_of( "create", "delete" ) ) _required_n_params = 2 ;
                else if ( _action.strcmp( "update" ) ) _required_n_params = 4 ; // 2 layer ref + 2 params values
                if ( _params.length == _required_n_params )
                {
                    var _action_params_array = [];
                    for( var _i = 0 ; _i < _required_n_params ; _i++ )
                    {
                        if ( _params[_i].is_one_of( "zplane", "wplane", "bip" ) ) _action_params_array['plane'] = _params[0] ;
                        else if ( _action_params_array['roledef'] == null ) _action_params_array['roledef'] = _params[_i] ;
                        else if ( _action_params_array['param_name'] == null ) _action_params_array['param_name'] = _params[_i] ;
                        else if ( _action_params_array['param_val'] == null ) _action_params_array['param_val'] = _params[_i] ;
                    }

                    var _candidate_plane = _action_params_array['plane'];
                    var _candidate_role_def = _action_params_array['roledef'] ;
                    if ( _action_params_array['plane'] == null )
                    {
                        _b_fail = YES ;
                        _error_str = "Missing plane specification: allowed values are 'zplane', 'wplane'" ;
                    }
                    else if ( _candidate_plane.length == 0 || _candidate_role_def.length == 0 )
                    {
                        _b_fail = YES ;
                        _error_str = "Missing input params: " ;
                        if ( _candidate_plane.length == 0 ) _error_str += " plane" ;
                        if ( _candidate_role_def.length == 0 ) _error_str += " role" ;
                    }
                    else if ( !_candidate_plane.is_one_of( "zplane", "wplane" ) )
                    {
                        _b_fail = YES ;
                        _error_str = "Allowed input plane tags: 'zplane', 'wplane'" ;
                    }
                    else if ( _action.strcmp( "create" ) )
                    {
                        var _plane_type = ( _action_params_array['plane'].stricmp( "zplane" ) ) ? Z_PLANE : W_PLANE ;
                        var _ret_layer = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_DEF, _action_params_array['roledef'], _output_channel );
                        if ( _ret_layer == null )
                        {
                            var _ret = circles_lib_canvas_layer_create( [ _action_params_array['plane'], _action_params_array['roledef'], NO, -1, _plane_type, YES ] );
                            if ( _ret == UNDET )
                            {
                                _b_fail = YES ;
                                _error_str = "Layer '"+_action_params_array['roledef']+"' already exists in the "+_action_params_array['plane']+" list" ;
                            }
                            else if ( _ret == null )
                            {
                                _b_fail = YES ;
                                _error_str = "Memory failure: can't create layer '"+_action_params_array['roledef']+"'" ;
                            }
                            else
                            {
                                var _msg = "Layer '"+_action_params_array['roledef']+"' has been created with success and heaped on the "+_action_params_array['plane']+" list" ;
                                circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                            }
                        }
                        else { _b_fail = YES ; _error_str = "The layer '"+_action_params_array['roledef']+"' already exists in the "+_action_params_array['plane']+" list" ; }
                    }
                    else if ( _action.strcmp( "delete" ) )
                    {
                          var _plane_type = ( _action_params_array['plane'].strcmp( "zplane" ) ) ? Z_PLANE : W_PLANE ;
                          var _ret_index = circles_lib_canvas_layer_find_pos_index( _plane_type, FIND_LAYER_BY_ROLE_DEF, _action_params_array['roledef'], _output_channel );
                          if ( _ret_index == UNFOUND )
                          {
                               _b_fail = YES ;
                               _error_str = "Deletion aborted: incorrect plane reference" ;
                          }
                          else
                          {
                            var _ret = UNDET, _delete_layer = function()
                            {
                                _ret = circles_lib_canvas_layer_delete( _plane_type, _ret_index, _output_channel );
                                if ( _ret == UNDET ) { _b_fail = YES ; _error_str = "Deletion aborted: incorrect plane reference" ; }
                                else if ( _ret == RET_UNAUTHORIZED ) { _b_fail = YES ; _error_str = "Deletion aborted: layer '"+_action_params_array['roledef']+"' is a default item and cannot be deleted" ; }
                                else { var _msg = "Layer '"+_action_params_array['roledef']+"' has been deleted with success from the "+_action_params_array['plane']+" list" ; circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag ); }
                            };

                            if ( _glob_terminal_echo_flag ) _delete_layer();
                            else if ( is_array( _glob_seeds_array ) )
                            {
								var _params_array = [] ;
								var _pre_prompt = null ;
								    _params_array['prepromptquestion'] = null ;
									_params_array['promptquestion'] = "Confirm to delete "+_action_params_array['plane']+" layer '"+_action_params_array['roledef']+"' ?" ;
									_params_array['yes_fn'] = function() { _delete_layer(); }
									_params_array['ifquestiondisabled_fn'] = function() { _delete_layer(); }
								if ( _glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
								else circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                            }
                          }
                    }
                    else if ( _action.strcmp( "update" ) )
                    {
                        var _plane_type = ( _action_params_array['plane'].strcmp( "zplane" ) ) ? Z_PLANE : W_PLANE ;
                        var _param_name = _action_params_array['param_name'] ;
                        var _param_val = _action_params_array['param_val'] ;
                        var _ret_index = circles_lib_canvas_layer_find_pos_index( _plane_type, FIND_LAYER_BY_ROLE_DEF, _action_params_array['roledef'], _output_channel );

                        if ( _param_name.strcmp( "bkcolor" ) && _param_val.strcmp( "transparent" ) ) _param_val = "" ;
                        else if ( _param_name.strcmp( "opacity" ) )
                        {
                            if ( _param_val.testME( _glob_float_regex_pattern ) )
                            {
                                _param_val = safe_float( _param_val, DEFAULT_MAX_OPACITY * 100.0 );
                                if ( _param_val.ranges_in( 0, DEFAULT_MAX_OPACITY, NO ) )
                                {
                                    _param_val *= 100, _param_val = _param_val.roundTo(0);
                                    var _msg = "Input opacity ranging in 0-"+DEFAULT_MAX_OPACITY+": corrected to range in 0-" + ( DEFAULT_MAX_OPACITY * 100.0 );
                                    circles_lib_output( _output_channel, DISPATCH_WARNING, _msg, _par_1, _cmd_tag );
                                }
                            }
                            else
                            {
                                _b_fail = YES ;
                                _error_str = "Update aborted: input opacity value is not a number (ranging from 0 to "+(DEFAULT_MAX_OPACITY*100.0)+")" ;
                            }
                        }
                        else if ( _param_name.strcmp( "visible" ) ) _param_val = _param_val.strcmp( "show" ) ? YES : NO ;

                        if ( _ret_index == UNDET ) { _b_fail = YES ; _error_str = "Update aborted: incorrect plane reference" ; }
                        else if ( !_b_fail )
                        {
                            var _ret = circles_lib_canvas_layer_update( _plane_type, _ret_index, _param_name, _param_val, _output_channel );
                            if ( _ret == UNDET ) { _b_fail = YES ; _error_str = "Update aborted: incorrect plane reference" ; }
                            else if ( !_ret ) { _b_fail = YES ; _error_str = "Update aborted: missing or invalid param" ; }
                            else
                            {
                                var _msg = "Layer '"+_action_params_array['roledef']+"' has been updated with success in the "+_action_params_array['plane']+" list" ;
                                circles_lib_output( _output_channel, DISPATCH_SUCCESS, _msg, _par_1, _cmd_tag );
                            }
                        }
                    }
                }
                else { _b_fail = YES ; _error_str = "Input failure: "+_required_n_params+" params are required for '"+_action+"' action" ; }
                break ;
                case "default":
                var _restore_defaults = function()
                {
                    circles_lib_output( _output_channel, DISPATCH_INFO, "Restoring layer properties", _par_1, _cmd_tag );
                    circles_lib_output( _output_channel, DISPATCH_INFO, "Restoring layer redirection assignments", _par_1, _cmd_tag );
                    circles_lib_reset_canvas();
                    circles_lib_output( _output_channel, DISPATCH_SUCCESS, "All default layer settings restored with success", _par_1, _cmd_tag );
                }

                if ( _glob_terminal_echo_flag ) _restore_defaults();
                else if ( is_array( _glob_seeds_array ) )
                {
					var _params_array = [] ;
					_params_array['prepromptquestion'] = null ;
					_params_array['promptquestion'] = "Restore default settings ?" ;
					_params_array['yes_fn'] = function() { _restore_defaults(); }
					_params_array['ifquestiondisabled_fn'] = function() { _restore_defaults(); }
					if ( _glob_terminal_echo_flag ) _params_array['yes_fn'].call(this);
					else circles_lib_terminal_cmd_ask_yes_no( _params_array, _output_channel );
                }
                break ;
                case "info":
                var _zplane_grid_label = ( _glob_zplane_grid_layer_placeholder != null ) ? _glob_zplane_grid_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ).label : "unknown" ;
                var _zplane_rendering_label = _glob_zplane_rendering_layer_placeholder != null ? _glob_zplane_rendering_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ).label : "unknown" ;
                var _zplane_freedraw_label = ( _glob_zplane_freedraw_layer_placeholder != null ) ? _glob_zplane_freedraw_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ).label : "unknown" ;
                var _zplane_work_label = ( _glob_zplane_work_layer_placeholder != null ) ? _glob_zplane_work_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ).label : "unknown" ;

                var _wplane_grid_label = ( _glob_wplane_grid_layer_placeholder != null ) ? _glob_wplane_grid_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ).label : "unknown" ;
                var _wplane_rendering_label = _glob_wplane_rendering_layer_placeholder != null ? _glob_wplane_rendering_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ).label : "unknown" ;
                var _wplane_freedraw_label = ( _glob_wplane_freedraw_layer_placeholder != null ) ? _glob_wplane_freedraw_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ).label : "unknown" ;
                var _wplane_work_label = ( _glob_wplane_work_layer_placeholder != null ) ? _glob_wplane_work_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ).label : "unknown" ;

                var _bip_rendering_label = "" ;
                if ( _glob_bip_original_plane_data == Z_PLANE ) _bip_rendering_label = "Z-plane type" ;
                else if ( _glob_bip_original_plane_data == W_PLANE ) _bip_rendering_label = "W-plane type" ;

                var _msg = "<lightgray>Information about association between default canvases and graphic services</lightgray>" ;
					_msg += "\n<khaki>Z-plane</khaki>" ;
                    _msg += "\n<cyan>Grid</cyan> redirected to <greenshock>" + _zplane_grid_label + "</greenshock>" ;
                    _msg += "\n<cyan>Rendering</cyan> redirected to <greenshock>" + _zplane_rendering_label + "</greenshock>" ;
                    _msg += "\n<cyan>Freedraw</cyan> redirected to <greenshock>" + _zplane_freedraw_label + "</greenshock>" ;
                    _msg += "\n<cyan>Work</cyan> redirected to <greenshock>" + _zplane_work_label + "</greenshock>" ;
                    _msg += "\n\n<khaki>W-plane</khaki>" ;
                    _msg += "\n<cyan>Grid</cyan> redirected to <greenshock>" + _wplane_grid_label + "</greenshock>" ;
                    _msg += "\n<cyan>Rendering</cyan> redirected to <greenshock>" + _wplane_rendering_label + "</greenshock>" ;
                    _msg += "\n<cyan>Freedraw</cyan> redirected to <greenshock>" + _wplane_freedraw_label + "</greenshock>" ;
                    _msg += "\n<cyan>Work</cyan> redirected to <greenshock>" + _wplane_work_label + "</greenshock>" ;
                    _msg += "\n\n<khaki>Bip box</khaki>" ;
                    _msg += "\n<cyan>Rendering</cyan> redirected from <greenshock>" + _bip_rendering_label + "</greenshock>" ;
                    circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
                break ;
                case "list":
                var _plane_type = _params_assoc_array['plane'] != null ? ( _params_assoc_array['plane'].stricmp( "zplane" ) ? Z_PLANE : W_PLANE ) : NO_PLANE ;
                if ( _plane_type != NO_PLANE )
                {
                    var _layers_list = circles_lib_canvas_layer_pile_per_plane_get( _plane_type );
                    if ( safe_size( _layers_list, 0 ) > 0 )
                    {
                        var _layer = null, _canvas = null, _clr_chunk = null ;
                        var _id = "", _canvas_id, _div_id, _index = 0.0, _role = "", _role_def, _output_row = "", _z_index = -1, _bkcolor = "" ;
						var _plane_def = circles_lib_plane_def_get( _plane_type ) ;                        
						
                        var _caption = "<khaki>Scanning the layers list on</khaki> <orange>"+_plane_def+"</orange>\n<white>Found " + _layers_list.length + " entr" + ( _layers_list.length == 1 ? "y" : "ies" ) + "</white>" ;
                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _caption, _par_1, _cmd_tag );
						var _max_len = 0 ; // compute max string length among the layer ids in the list, prior to display
						_layers_list.forEach( function( _layer ){
							if ( _layer != null )
							{
								_max_len = Math.max( _max_len, _layer.get_idcanvas().replaceAll( [ "_layer_canvas", "zplane", "wplane", "plane", "DIV", "_" ], "").trim().length ) ;
							} } );
						
						var COLSsizeARRAY = [ _max_len+2, 8, 6, 15, 8, 8, 10, 10 ] ;

                        _output_row  = ( new String( "ID" ) ).rpad( " ", COLSsizeARRAY[0] );
                        _output_row += ( new String( "DEFAULT" ) ).rpad( " ", COLSsizeARRAY[1] );
                        _output_row += ( new String( "LEVEL" ) ).rpad( " ", COLSsizeARRAY[2] );
                        _output_row += ( new String( "ROLE" ) ).rpad( " ", COLSsizeARRAY[3] );
                        _output_row += ( new String( "OPACITY" ) ).rpad( " ", COLSsizeARRAY[4] );
                        _output_row += ( new String( "VISIBLE" ) ).rpad( " ", COLSsizeARRAY[5] );
                        _output_row += ( new String( "DIMS" ) ).rpad( " ", COLSsizeARRAY[6] );
                        _output_row += ( new String( "BK COLOR" ) ).rpad( " ", COLSsizeARRAY[7] );
                        circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, "<lightblue>"+_output_row+"</lightblue>", _par_1, _cmd_tag );

                        _out_text_string = _output_row ;
                          
                        for( var _i = 0 ; _i < _layers_list.length ; _i++ )
                        {
                            _layer = _layers_list[_i] ;
                            if ( _layer != null )
                            {
                                _id = _layer.get_idcanvas().replaceAll( [ "_layer_canvas", "zplane", "wplane", "plane", "DIV", "_" ], "").trim();
                                _div_id = _layer.get_iddiv() ;
                                _canvas_id = _layer.get_idcanvas()
                                _z_index = $("#"+_div_id ).zIndex();
                                _role = _layer.get_role_id() ;
                                _role_def = _layer.get_role_def().trim();
                                _opacity = $("#"+_div_id ).css( "opacity" );
                                _bkcolor = $("#"+_div_id ).css( "background-color" );
								_clr_chunk = circles_lib_colors_get_formats( _bkcolor )
								if ( _clr_chunk[3].length > 0 ) _bkcolor = _clr_chunk[3] ;
                                _canvas = $("#"+_canvas_id ).get(0);
                                       
                                _output_row  = "<yellow>"+( ""+_id ).rpad( " ", COLSsizeARRAY[0] )+"</yellow>" ;
                                _output_row += _layer.is_defaultcanvas() ? "<green>"+("yes").rpad( " ", COLSsizeARRAY[1] )+"</green>" : "<red>"+("no").rpad( " ", 8 )+"</red>" ;
                                _output_row += ( "" + _z_index ).rpad( " ", COLSsizeARRAY[2] );
                                _output_row += ( "" + _role_def ).rpad( " ", COLSsizeARRAY[3] );
                                _output_row += ( ( _opacity * 100.0 ) + "%").rpad( " ", COLSsizeARRAY[4] );
                                _output_row += _layer.is_visible() ? "<green>"+("yes").rpad( " ", COLSsizeARRAY[5] )+"</green>" : "<red>"+("no").rpad( " ", COLSsizeARRAY[5] )+"</red>" ;
                                _output_row += is_html_canvas( _canvas ) ? ( _canvas.get_width()+"x"+_canvas.get_height() ).rpad( " ", COLSsizeARRAY[6] ) : "-------"
                                _output_row += ( "" + _bkcolor ).rpad( " ", COLSsizeARRAY[7] );

                                circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _output_row, _par_1, _cmd_tag );
                                _out_text_string += _glob_crlf + _output_row ;
                            }
                            else circles_lib_output( _output_channel, DISPATCH_WARNING, "Detected memory leak while returning layers list", _par_1, _cmd_tag );
                        }
                    }
                    else { _b_fail = YES ; _error_str = "No list returned: incoherent input plane type" ; }
                }
                else { _b_fail = YES ; _error_str = "No list returned: missing input plane type" ; }
                break ;
                case "merge":
                var _plane = NO_PLANE ;
                if ( _params_assoc_array['plane'].strcmp( "all" ) ) _plane = ALL_PLANES ;
                else if ( _params_assoc_array['plane'].strcmp( "zplane" ) ) _plane = Z_PLANE ;
                else if ( _params_assoc_array['plane'].strcmp( "wplane" ) ) _plane = W_PLANE ;

                if ( _plane == NO_PLANE )
                circles_lib_output( _output_channel, DISPATCH_WARNING, "Merge failure: missing selected plane", _par_1, _cmd_tag );

                var _zplane_already = ( _plane.is_one_of( Z_PLANE, ALL_PLANES ) && _glob_zplane_canvas_merge ) ? YES : NO ;
                var _wplane_already = ( _plane.is_one_of( W_PLANE, ALL_PLANES ) && _glob_wplane_canvas_merge ) ? YES : NO ;

                if ( _plane.is_one_of( Z_PLANE, ALL_PLANES ) )
                {
                    circles_lib_output( _output_channel, _zplane_already ? DISPATCH_INFO : DISPATCH_SUCCESS, "Z-plane canvases " + ( _zplane_already ? "are already merged" : "have been merged with success" ), _par_1, _cmd_tag );
                    _glob_zplane_canvas_merge = YES ;
                }

                if ( _plane.is_one_of( W_PLANE, ALL_PLANES ) )
                {
                    circles_lib_output( _output_channel, _zplane_already ? DISPATCH_INFO : DISPATCH_SUCCESS, "W-plane canvases " + ( _wplane_already ? "are already merged" : "have been merged with success" ), _par_1, _cmd_tag );
                    _glob_wplane_canvas_merge = YES ;
                }

                if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
				{
					_glob_terminal_change = YES ;
	                circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
				}
                break ;
                case "release":
                circles_lib_output( _output_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                case "redirect":
                var _candidate_from_layer = circles_lib_canvas_layer_find( _params_assoc_array['from_plane'], FIND_LAYER_BY_ROLE_DEF, _params_assoc_array['from_service'], _output_channel );
                if ( is_html_canvas( _candidate_from_layer ) )
                {
                    var _to_service = _params_assoc_array['to_service'] ;
                    switch( _params_assoc_array['to_plane'] )
                    {
                        case Z_PLANE:
                        if ( _to_service.stricmp( "grid" ) ) _glob_zplane_grid_layer_placeholder = _candidate_from_layer ;
                        else if ( _to_service.stricmp( "rendering" ) ) _glob_zplane_rendering_layer_placeholder = _candidate_from_layer ;
                        else if ( _to_service.stricmp( "freedraw" ) ) _glob_zplane_freedraw_layer_placeholder = _candidate_from_layer ;
                        else if ( _to_service.stricmp( "work" ) ) _glob_zplane_work_layer_placeholder = _candidate_from_layer ;
                        break ;
                        case W_PLANE:
                        if ( _to_service.stricmp( "grid" ) ) _glob_wplane_grid_layer_placeholder = _candidate_from_layer ;
                        else if ( _to_service.stricmp( "rendering" ) ) _glob_wplane_rendering_layer_placeholder = _candidate_from_layer ;
                        else if ( _to_service.stricmp( "freedraw" ) ) _glob_wplane_freedraw_layer_placeholder = _candidate_from_layer ;
                        else if ( _to_service.stricmp( "work" ) ) _glob_wplane_work_layer_placeholder = _candidate_from_layer ;
                        break ;
                        default:
                        _b_fail = YES ; _error_str = "Redirection assignment failure: inconsistent plane reference" ;
                        break ;
                    }

                    if ( !_b_fail ) circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Redirection assigned with success", _par_1, _cmd_tag );
                }
                else
                {
                    _b_fail = YES ;
                    _error_str = "Inconsistent layer references:" ;
                    _error_str += "\nmissing " + circles_lib_plane_def_get( _params_assoc_array['to_plane'] ) + " " + _params_assoc_array['to_plane'] ;
                }
                break ;
				case "redirectlist":
				switch( circles_lib_plane_get_value( _params_assoc_array['plane'] ) )
				{
					case Z_PLANE:
					circles_lib_output( _output_channel, DISPATCH_INFO, "Redirection list for Z-plane", _par_1, _cmd_tag );
					var _msg = "<white>Grid Layer</white> directed to service <yellow>"+circles_lib_canvas_layer_roledef_get( _glob_zplane_grid_layer_placeholder.id )+"</yellow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
						_msg = "<white>Rendering Layer</white> directed to service <yellow>"+circles_lib_canvas_layer_roledef_get( _glob_zplane_rendering_layer_placeholder.id )+"</yellow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
						_msg = "<white>Freedraw Layer</white> directed to service <yellow>"+circles_lib_canvas_layer_roledef_get( _glob_zplane_freedraw_layer_placeholder.id )+"</yellow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
						_msg = "<white>Work Layer</white> directed to service <yellow>"+circles_lib_canvas_layer_roledef_get( _glob_zplane_work_layer_placeholder.id )+"</yellow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					break ;
					case W_PLANE:
					circles_lib_output( _output_channel, DISPATCH_INFO, "Redirection list for W-plane", _par_1, _cmd_tag );
					var _msg = "<white>Grid Layer</white> directed to service <yellow>"+circles_lib_canvas_layer_roledef_get( _glob_wplane_grid_layer_placeholder.id )+"</yellow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
						_msg = "<white>Rendering Layer</white> directed to service <yellow>"+circles_lib_canvas_layer_roledef_get( _glob_wplane_rendering_layer_placeholder.id )+"</yellow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
						_msg = "<white>Freedraw Layer</white> directed to service <yellow>"+circles_lib_canvas_layer_roledef_get( _glob_wplane_freedraw_layer_placeholder.id )+"</yellow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
						_msg = "<white>Work Layer</white> directed to service <yellow>"+circles_lib_canvas_layer_roledef_get( _glob_wplane_work_layer_placeholder.id )+"</yellow>" ;
					circles_lib_output( _output_channel, DISPATCH_MULTICOLOR, _msg, _par_1, _cmd_tag );
					break ;
					default: break ;
				}
				break ;
                case "resize":
                var _plane = NO_PLANE, _default = safe_int( _params_assoc_array['default'], NO );
                if ( _params_assoc_array['plane'].stricmp( "zplane" ) ) _plane = Z_PLANE ;
                else if ( _params_assoc_array['plane'].stricmp( "wplane" ) ) _plane = W_PLANE ;
                var _width_percentage = safe_int( _params_assoc_array['w'], 50 );

                if ( _plane == NO_PLANE ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Resize failure: missing selected plane", _par_1, _cmd_tag );
                else if ( _default || _width_percentage == 50 )
                {
                    circles_lib_canvas_layer_pile_resize_to_default( NO, _output_channel );
                    circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Resize to default size completed", _par_1, _cmd_tag );
                }
                else
                {
                    circles_lib_canvas_layer_pile_resize( _plane, _width_percentage, YES, _output_channel );
                    circles_lib_output( _output_channel, DISPATCH_SUCCESS, "Resize to "+_width_percentage+"% completed", _par_1, _cmd_tag );
                }
                break ;
				case "reversepile":
                var _plane = NO_PLANE, _default = safe_int( _params_assoc_array['default'], NO );
                if ( _params_assoc_array['plane'].stricmp( "zplane" ) ) _plane = Z_PLANE ;
                else if ( _params_assoc_array['plane'].stricmp( "wplane" ) ) _plane = W_PLANE ;
				if ( _plane == NO_PLANE ) circles_lib_output( _output_channel, DISPATCH_ERROR, "Fail to reverse the layers pile: missing input plane specification", _par_1, _cmd_tag );
				else
				{
					var _layers_pile = circles_lib_canvas_layer_pile_get(_plane) ;
					if ( _layers_pile == null ) circles_lib_output( _output_channel, DISPATCH_ERROR, "Fail to reverse the layers pile: invalid data", _par_1, _cmd_tag );
					else
					{
						_layers_pile.reverse();
						var _plane_def = circles_lib_plane_def_get(_plane);
						circles_lib_output( _output_channel, DISPATCH_SUCCESS, "The layers pile, in the "+_plane_def+", has been reverted with success", _par_1, _cmd_tag );
					}
				}
				break ;
                case "split":
                var _plane = NO_PLANE ;
                if ( _params_assoc_array['plane'].strcmp( "all" ) ) _plane = ALL_PLANES ;
                else if ( _params_assoc_array['plane'].strcmp( "zplane" ) ) _plane = Z_PLANE ;
                else if ( _params_assoc_array['plane'].strcmp( "wplane" ) ) _plane = W_PLANE ;

                if ( _plane == NO_PLANE ) circles_lib_output( _output_channel, DISPATCH_WARNING, "Merge failure: missing selected plane", _par_1, _cmd_tag );
                var _zplane_already = ( _plane.is_one_of( Z_PLANE, ALL_PLANES ) && !_glob_zplane_canvas_merge ) ? YES : NO ;
                var _wplane_already = ( _plane.is_one_of( W_PLANE, ALL_PLANES ) && !_glob_wplane_canvas_merge ) ? YES : NO ;

                if ( _plane.is_one_of( Z_PLANE, ALL_PLANES ) )
                {
                    circles_lib_output( _output_channel, ( _zplane_already ) ? DISPATCH_INFO : DISPATCH_SUCCESS, "Z-plane canvases " + ( _zplane_already ? "are already split" : "have been split" ), _par_1, _cmd_tag );
                    _glob_zplane_canvas_merge = NO ;
                }

                if ( _plane.is_one_of( W_PLANE, ALL_PLANES ) )
                {
                    circles_lib_output( _output_channel, ( _zplane_already ) ? DISPATCH_INFO : DISPATCH_SUCCESS, "W-plane canvases " + ( _wplane_already ? "are already split" : "have been split" ), _par_1, _cmd_tag );
                    _glob_wplane_canvas_merge = NO ;
                }

                if ( circles_lib_terminal_batch_script_exists() && _output_channel == OUTPUT_TERMINAL )
        	 	{
        			_glob_terminal_change = YES ;
        		    circles_lib_output( _output_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
        		}
                break ;
                case "thumbnail":
                var MIN_CANVAS_SIDE = 120 ;
                var MAX_CANVAS_SIDE = 280 ;
                var _plane_type = _params_assoc_array['plane'].strcmp( "zplane" ) ? Z_PLANE : W_PLANE ;
                var _role_def = _params_assoc_array['params'][0] ;
                var _w = safe_int( _params_assoc_array['w'], 0 );
                var _h = safe_int( _params_assoc_array['h'], 0 );
                var _side = 0 ;
                if ( !_w.ranges_in( MIN_CANVAS_SIDE, MAX_CANVAS_SIDE ) ||
                     !_h.ranges_in( MIN_CANVAS_SIDE, MAX_CANVAS_SIDE ) )
                {
                    _w = Math.min( Math.max( _w, MIN_CANVAS_SIDE ), MAX_CANVAS_SIDE );
                    _h = Math.min( Math.max( _h, MIN_CANVAS_SIDE ), MAX_CANVAS_SIDE );
                    _side = Math.max( _w, _h );

                    circles_lib_output( _output_channel, DISPATCH_WARNING, "Thumbnail side is outside valid range "+MIN_CANVAS_SIDE+"-"+MAX_CANVAS_SIDE+". Reset to " + _side + "", _par_1, _cmd_tag );
                }
                else _side = Math.max( _w, _h );

                var _ret_layer = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_DEF, _role_def, _output_channel );
                if ( _ret_layer == null ) { _b_fail = YES ; _error_str = "Can't display thumbnail: incorrect layer reference" ; }
                else
                {
                    var _src_canvas_id = _ret_layer.get_idcanvas() ;
                    var _copy_canvas_id = "TERMINALcmdCANVAS" + unixtime();
                    circles_lib_terminal_html_display( _glob_terminal, "<table><tr><td HEIGHT=\"12\"></td></tr><tr><td><CANVAS ID=\""+_copy_canvas_id+"\" WIDTH=\""+CANVAS_SIZE+"\" HEIGHT=\""+CANVAS_SIZE+"\" STYLE=\"width:"+_side+"px;height:"+_side+"px;\"></CANVAS></td></tr><tr><td HEIGHT=\"12\"></td></tr></table>" );
                    var _ret_chunk = circles_lib_canvas_layer_copy( _src_canvas_id, _copy_canvas_id, _side, _side );
       				var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
          			var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to make a copy of input layer" ;
          			circles_lib_output( _output_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _par_1, _cmd_tag );
                }
                break ;
                default:
                if ( _glob_storage[_cmd_tag] == null ) { _b_fail = YES ; _error_str = "Missing action parameter" ; }
                break ;
           }
     }

     if ( _glob_storage[_cmd_tag] != null )
     {
        if ( _glob_storage[_cmd_tag]['open'] == PENDING )
        {
            circles_terminal_cmd_keepcmd( "off", _output_channel, YES );
            _glob_storage.remove_key( _cmd_tag );
        }
     }

     if ( _b_fail && _glob_terminal_errors_switch && _output_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _output_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _output_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _output_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _output_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}