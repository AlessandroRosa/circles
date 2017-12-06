function circles_terminal_cmd_savepix()
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

	var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _help = NO ;
    var _out_text_string = "" ;
    var _fn_ret_val = null ;
    var _cmd_params = [];

	if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
        _cmd_params['help'] = NO ;
        _cmd_params['keywords'] = NO ;
        _cmd_params['plane'] = _glob_target_plane ;
         
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
    	var _local_cmds_params_array = [];
    	_local_cmds_params_array.push( "bip", "wplane", "zplane", "bipbox", "w-plane", "z-plane", "release", "html", "help" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );
        var _p ;
        for( var _i = 0 ; _i < _params_array.length ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = _help = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "release" ) ) _cmd_params['action'] = _p ;
            else if ( _p.start_with( "layer:" ) ) _cmd_params['layer'] = _p.replace( /layer:/g, "" ) ;
            else if ( _p.start_with( "export:" ) )
			{
				_p = _p.replace( /export:/g, "" ) ;
				if ( !( /^\.*?(pdf|svg|tex)$/.test( _p ) ) )
				{ _b_fail = YES ; _error_str = "Invalid export extension '"+_p+"': choose one among .pdf|.ps|.eps|.svg" ; }
				else _cmd_params['export'] = _p.replace( /\./g, "" ) ;
			}
            else if ( _p.stricmp( "html" ) ) _cmd_params['html'] = YES ;
            else if ( _p.stricmp( "bip", "bipbox" ) ) _cmd_params['plane'] = BIP_BOX ;
            else if ( _p.stricmp( "wplane", "w-plane" ) ) _cmd_params['plane'] = W_PLANE ;
            else if ( _p.stricmp( "zplane", "z-plane" ) ) _cmd_params['plane'] = Z_PLANE ;
            else if ( _p.stricmp( "dlocus", "d-locus" ) ) _cmd_params['plane'] = D_LOCUS ;
            else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
        }

        if ( _cmd_params['help'] ) circles_lib_terminal_help_cmd( _cmd_params['html'], _cmd_tag, _par_1, _out_channel );
        else if ( _cmd_params['keywords'] )
        {
            var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
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
                case "release":
                circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                break ;
                default:
                var _plane_type = safe_int( _cmd_params['plane'], NO_PLANE );
                var _plane_label = circles_lib_plane_def_get( _plane_type ).toLowerCase().replace( /[\.\-]/g, "" );
					_layer = _cmd_params['layer'] != null ? _cmd_params['layer'] : "" ;
				var _layer_label = _layer ;
				var _layer = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_DEF, _layer, _out_channel );
                var _canvas = null ;
				if ( is_html_canvas( _layer ) ) _canvas = _layer ;
				else
				{
					switch( _plane_type )
					{
						case Z_PLANE: _canvas = _glob_zplane_rendering_layer_placeholder; circles_lib_output( _out_channel, DISPATCH_INFO, "saving the z-plane rendering layer ...", _par_1, _cmd_tag ); break ;
						case W_PLANE: _canvas = _glob_wplane_rendering_layer_placeholder; circles_lib_output( _out_channel, DISPATCH_INFO, "saving the w-plane rendering layer ...", _par_1, _cmd_tag ); break ;
						case BIP_BOX: _canvas = _glob_bipbox_canvas ; circles_lib_output( _out_channel, DISPATCH_INFO, "saving the bip box ...", _par_1, _cmd_tag ); break ;
						case D_LOCUS: _canvas = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0);  circles_lib_output( _out_channel, DISPATCH_INFO, "saving the discreteness locus ...", _par_1, _cmd_tag ); break ;
						default: _b_fail = YES, _error_str = "Can't save: please, choose Z-plane or W-plane"; break ;
					}
				}
    
                var _ext = "" ;
				if ( _cmd_params['export'] != null ) _ext = _cmd_params['export'] ;
				else
				{
					if ( _glob_export_format == EXPORT_SVG ) _ext = ".svg" ;
					else if ( _glob_export_format == EXPORT_PS ) _ext = ".ps" ;
					else if ( _glob_export_format == EXPORT_EPS ) _ext = ".eps" ;
					else if ( _glob_export_format == EXPORT_LATEX ) _ext = ".tex" ;
					else if ( _glob_export_format == EXPORT_PDF ) _ext = ".pdf" ;
					else if ( _glob_export_format == EXPORT_PNG ) _ext = ".png" ;
					else _ext = ".png" ;
				}

                var _out_filename = _plane_label + (_layer_label.length>0?"."+_layer_label:"") + _ext ;
                if ( !_b_fail && !_help && is_html_canvas( _canvas ) )
                {
                    var _ret_chunk = circles_lib_files_pix_save_ask( _plane_type, _canvas.id, _out_filename, NO, YES, _out_channel );
                    var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                    var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Memory failure" ;
                    if ( _ret_id ) circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                    else { _b_fail = YES, _error_str = _ret_msg ; }
                }
				else if ( !is_html_canvas( _canvas ) ) { _b_fail = YES, _error_str = "Can't save: invalid source canvas" ; }
                break ;
            }
        }
    }
    else { _b_fail = YES, _error_str = "Missing input params" ; }
     
    if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
    if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
    else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}