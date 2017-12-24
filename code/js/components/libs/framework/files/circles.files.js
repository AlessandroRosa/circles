function circles_lib_files_get_export_format()
{
		if ( is_array( _glob_export_code_array ) )
		{
				 var _chunk = _glob_export_code_array.left( 4 ) ;
				 var _export_format = EXPORT_NONE ;
				 $.each( _chunk,
				 				 function( _i, _item )
				 				 {
											if ( _item.includes( "<svg" ) )
											{
													 _export_format = EXPORT_SVG ;
													 return ;
											}
											else if ( _item.includes( "documentclass" ) )
											{
													 _export_format = EXPORT_LATEX ;
													 return ;
											}
											else if ( _item.includes( "EPS" ) )
											{
													 _export_format = EXPORT_EPS ;
													 return ;
											}
											else if ( _item.includes( "%!PS" ) )
											{
													 _export_format = EXPORT_PS ;
													 return ;
											}
								 }
				 			 ) ;
				 return _export_format ;
		}
		else return EXPORT_NONE ;
}

function circles_lib_files_load_environment( _filename, _file_contents )
{
    _file_contents = safe_string( _file_contents, "" );
    var _config_rows = _file_contents.includes( CRLF_WIN ) ? _file_contents.split( CRLF_WIN ) : ( _file_contents.includes( CRLF_NOWIN ) ? _file_contents.split( CRLF_NOWIN ) : null );
    if ( _config_rows == null ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "'"+_filename+"' does not appear as a valid config file.", _glob_app_title );
    else
    {
         // process file
         $.each( _config_rows,
                 function( _i, _row )
                 {
                      if ( _row.includes( "=" ) )
                      {
                          var _chunk = _row.split( "=" );
                          var _prop = _chunk[0] ;
                          var _val = _chunk[1] ;

                          switch( _prop.toLowerCase() )
                          {
                                case "accuracy":
                                _glob_accuracy = safe_int( _val, DEFAULT_MAX_ACCURACY );
                                break ;
                                case "canvasmode":
                                _glob_src_canvas_mode = safe_int( _val, ZPLANE_CANVAS_CIRCLESDRAW_MODE );
                                break ;
                                case "construction":
                                _glob_construction_mode = safe_int( _val, CONSTRUCTION_TILING );
                                break ;
                                case "crashstrings":
                                _glob_dict_processor.set_crash_words( _val.includes( "," ) ? _val.explode( "," ) : [] );
                                break ;
                                case "depth":
                                _glob_depth = safe_int( _val, DEFAULT_DEPTH );
                                break ;
                                case "diskdash":
                                _glob_activate_dashed_border = safe_int( _val, NO );
                                break ;
                                case "diskdrawzplane":
                                _glob_zplane_disk_draw = safe_int( _val, NO );
                                break ;
                                case "diskdrawwplane":
                                _glob_wplane_disk_draw = safe_int( _val, NO );
                                break ;
                                case "diskdash":
                                _glob_activate_dashed_border = safe_int( _val, 0 );
                                break ;
                                case "diskfill":
                                _glob_wplane_disk_fill = safe_int( _val, NO );
                                break ;
                                case "diskvisibilityradius":
                                _glob_disk_visibility_radius = safe_float( _val, Math.pow( 10, -3 ) );
                                break ;
                                case "diskthresholdradius":
                                _glob_disk_threshold_radius = safe_float( _val, 0 );
                                break ;
                                case "diskthresholdoperator":
                                _glob_disk_threshold_operator = safe_string( _val, "" );
                                break ;
                                case "distancetolerance":
                                _glob_distance_tolerance = safe_float( _val, DEFAULT_DISTANCE_TOLERANCE );
                                break ;
                                case "drawentity":
                                _glob_drawentity = safe_int( _val, DRAWENTITY_ISOMETRIC_CIRCLE );
                                break ;
                                case "interface":
                                _glob_interface_index = safe_int( _val, INTERFACE_DEFAULT );
                                circles_lib_interface_extend( _glob_interface_index, YES );
                                break ;
                                case "mapprecision":
                                _glob_smpr = safe_int( _val, 0 );
                                break ;
                                case "method":
                                circles_lib_method_set( safe_int( _val, _glob_method ) );
                                break ;
                                case "orbit_palette_start":
                                _glob_orbit_rgb_start = safe_string( _val, "rgb( 255, 192, 0 )" );
                                break ;
                                case "orbit_palette_end":
                                _glob_orbit_rgb_start = safe_string( _val, "rgb( 255, 218, 0 )" );
                                break ;
                                case "palette_start":
                                _glob_palette_start_rgb = safe_string( _val, "rgb( 255, 0, 0 )" );
                                break ;
                                case "palette_end":
                                _glob_palette_end_rgb = safe_string( _val, "rgb( 255, 255, 0 )" );
                                break ;
                                case "title":
                                _glob_title = _val;
                                break ;
                                case "usepalette":
                                _glob_palette_use = safe_int( _val, NO );
                                break ;
                                case "warnings":
                                _glob_terminal_warnings_switch = safe_int( _val, NO );
                                break ;
												        default: break ;
                          }
                      }
                 }
               );
    }
}

function circles_lib_files_load_default_fn_lib()
{
    var _abs_folder_path = "libs/default.load/" ;
    var vars = { tip: "",
                 folder : _abs_folder_path,
                 filter : "/[?.lib]$/",
				 exact : 0,
                 search_params : "0,0,1,0" } ;
    var _result = get_filedata_from_folder( "support/code/phpcode/svc/svc.filelist.php", "POST", false, vars );
    if ( _result.length > 0 )
    {
		var _res_array = _result.includes( "@@@" ) ? _result.split( "@@@" ) : [ _result ] ;
        var _rl = safe_size( _res_array, 0 ), _load_failure = NO, _src_code_load_failures = [] ;
        for( _i = 0 ; _i < _rl ; _i++ )
        {
           $.ajaxSetup( { async:false } );
           $.get( _abs_folder_path + _res_array[_i] ).done( function( data ){ circles_lib_files_parse_lib_file( data ); } ).fail( function(){ circles_lib_log_add_entry( "'"+_res_array[_i]+"' can't be loaded: suspected invalid filename or internal code error", LOG_ERROR ) ; _src_code_load_failures.push( _res_array[_i] ) ; } );
        }
        _load_failure = safe_size( _src_code_load_failures, 0 ) > 0 ? YES : NO ;
    }
}

function circles_lib_files_parse_js_file( _data )
{
	var _data_rows = _data.includes( CRLF_WIN ) ? _data.split( CRLF_WIN ) : ( _data.includes( CRLF_NOWIN ) ? _data.split( CRLF_NOWIN ) : [ _data ] );
	var _row, _ret_chunk = [ [], "" ] ;
    for( var _i = 0 ; _i < _data_rows.length ; _i++ )
    {
         _row = _data_rows[_i] ;
         if ( _row.trim().start_with( "@modulename:" ) ) _ret_chunk[1] = _row.trim().replaceAll( "@modulename:", "" );
         else _ret_chunk[0].push( _row );
    }

    if ( safe_size( _ret_chunk[0] ) == 0 ) _ret_chunk[0] = -1 ;
    return _ret_chunk ;
}

function circles_lib_files_parse_lib_file( _data )
{
    _data = _data.split( /\r\n|\n/ ) ;
    var _row, _lib_chunk, _def_flag = 0 ;
    var _re_fn = /([\w|\d]{1,})(?:\s*)\(([\w\d\,\s]{1,})\)/gim ;
    var _ext_fn_name = "", _int_fn_name = "" ;
    var _ext_fn_args = "", _int_fn_args = "" ;
    var _def = [] ;
    var _new_fns = 0 ;
    for( var _r = 0 ; _r < _data.length ; _r++ )
    {
        _row = _data[_r].trim() ;
        if ( _row.strcmp( "@beginlib" ) )
        {
            if ( is_array( _lib_chunk ) )
            {
               _lib_chunk.push( _def.join( _glob_crlf ) ) ;
               if ( _glob_circles_js_translation_methods_index_map[ _lib_chunk[0].toLowerCase() ] == null )
               {
		               _glob_circles_js_translation_methods.push( _lib_chunk );
		               _glob_circles_js_translation_methods_index_map[ _lib_chunk[0].toLowerCase() ] = _glob_circles_js_translation_methods.length - 1 ;
		               _new_fns++ ;
							 }
            }
            _lib_chunk = [] ;
            _def_flag = 0 ;
        }
        else if ( _row.strcmp( "@endlib" ) )
        {
            if ( is_array( _lib_chunk ) )
            {
               _lib_chunk.push( _def.join( _glob_crlf ) ) ;
               if ( _glob_circles_js_translation_methods_index_map[ _lib_chunk[0].toLowerCase() ] == null )
               {
		               _glob_circles_js_translation_methods.push( _lib_chunk );
		               _glob_circles_js_translation_methods_index_map[ _lib_chunk[0].toLowerCase() ] = _glob_circles_js_translation_methods.length - 1 ;
		               _new_fns++ ;
							 }
            }
            _lib_chunk = null ;
            _def_flag = 0 ;
        }
        else if ( _row.start_with( "external_def:" ) )
        {
            _row = _row.replaceAll( "external_def:", "" ).trim();
            var _match_ret = _re_fn.exec( _row );
            if ( _match_ret != null )
            {
                _ext_fn_name = _match_ret[1].trim(), _ext_fn_args = _match_ret[2].trim() ;
                _lib_chunk.push( _match_ret[1].trim(), _match_ret[2].trim() ) ;
            }
            _re_fn.lastIndex = 0 ;
        }
        else if ( _row.start_with( "internal_def:" ) )
        {
            _row = _row.replaceAll( "internal_def:", "" ).trim();
            var _match_ret = _re_fn.exec( _row );
            if ( _match_ret != null )
            {
                _int_fn_name = _match_ret[1].trim(), _int_fn_args = _match_ret[2].trim() ;
                _lib_chunk.push( _match_ret[1].trim(), _match_ret[2].trim() ) ;
            }
            _re_fn.lastIndex = 0 ;
        }
        else if ( _row.start_with( "args_mapping:" ) ) _lib_chunk.push( _row.replaceAll( "args_mapping:", "" ) ) ;
        else if ( _row.start_with( "dox:" ) ) _def_flag = 1 ;
        else if ( _def_flag ) _def.push( _row );
    }
    
    return _new_fns ;
}

function circles_lib_files_load_default_datatypes()
{
   // INTERNAL COMMENTS FOR DATA TYPE RECOGNITION ARE PARSED AS FOLLOWS (including '/*' and '*/' )
  /* framework data type (EXAMPLE)
     name : point
     constructor1 : point(number,number)
     constructor2 : point(point)
     output method: output('std')
     notes: 2d point
     framework data type */

    var _scan_folders = [
    { abs : "code/js/basements/classes/load/a-primitives/",
      rel : "support/code/js/basements/classes/load/a-primitives/",
      filter : "/[?.js]$/"
    },
    { abs : "code/js/basements/classes/load/b-basic.maths",
      rel : "support/code/js/basements/classes/load/b-basic.maths/",
      filter : "/[?.js]$/"
    },
    { abs : "code/js/basements/classes/load/e-adv.maths",
      rel : "support/code/js/basements/classes/load/e-adv.maths/",
      filter : "/[?.js]$/"
    },
    { abs : "code/js/basements/basics",
      rel : "support/code/js/basements/basics/",
      filter : "/[?.js]$/"
    }
    ] ;

    var _result, _res_array, _r1 ;
    _glob_registered_datatypes = [] ;
    for( var _sf = 0 ; _sf < _scan_folders.length ; _sf++ )
    {
        vars = { tip: "",
                 folder : _scan_folders[_sf].abs,
                 filter : _scan_folders[_sf].filter,
    		     exact : 0,
                 search_params : "0,0,1,0" } ;
        _result = get_filedata_from_folder( "support/code/phpcode/svc/svc.filelist.php", "POST", false, vars );
        if ( _result.length > 0 )
        {
    				_res_array = _result.includes( "@@@" ) ? _result.split( "@@@" ) : [ _result ] ;
            _rl = safe_size( _res_array, 0 ), _load_failure = NO, _src_code_load_failures = [] ;
            var _chunk = [], _active = 0, _splits, _row ;
            for( _i = 0 ; _i < _rl ; _i++ )
            {
               $.ajaxSetup( { async:false } );
               $.get( _scan_folders[_sf].rel + _res_array[_i] ).done(
              function( _code )
              { 
                  _code = _code.split( CRLF_NOWIN );
                  _chunk = [] ;
                  for( var _c = 0 ; _c < _code.length ; _c++ )
                  {
											 _row = _code[_c].replace(/\s/g,'') ;
                  		 if ( _row.strcmp( "/*frameworkdatatype" ) )
											 {
											 		 if ( _chunk.size_associative() > 0 ) break ; // prevents multiple declarations inside the same file
													 _active = 1 ;
											 }
                  		 else if ( _row.strcmp( "frameworkdatatype*/" ) ) _active = 0 ;
                  		 else if ( _active )
                  		 {
													 if ( _row.start_with( "datatype_dev:", "comparisonmethod:",
                                "outputmethod:", "typizationmethod:" ) ||
                                /^constructor[1-9]+/.test( _row )
                                 )
                           {
													 		 _splits = _row.split(":") ;
															 _chunk[ _splits[0].trim() ] = _splits[1].trim() ;
                           }
													 else if ( /^notes_constructor[1-9]+/.test( _row ) ||
                                     _row.start_with( "datatype_public:", "notes:" ) )
                           {
													 		 _splits = _row.split(":") ;
                               _chunk[ _splits[0].trim() ] = ( _code[_c].split(":") )[1].trim() ;
                           }
											 }
									}

									if ( _chunk.size_associative() > 0 ) _glob_registered_datatypes.push( _chunk.clone_associative() );
              }
              ).fail( function(){ circles_lib_log_add_entry( "'"+_res_array[_i]+"' can't be loaded: suspected invalid filename or internal code error", LOG_ERROR ) ; _src_code_load_failures.push( _res_array[_i] ) ; } );
            }
    
            _load_failure = safe_size( _src_code_load_failures, 0 ) > 0 ? YES : NO ;
        }
    }
}
