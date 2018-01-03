function circles_terminal_cmd_palette()
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

    var bOUT = 0 ;
	var _last_release_date = get_file_modify_date( _glob_paths['terminal_abs_cmds'], "circles.terminal.cmd."+_cmd_tag+".js" ) ;
    var _b_fail = 0 ;
    var _error_str = "" ;
    var _out_text_string = "" ;
    var _index_array = UNDET ;
    var _selected_index = UNDET ;
    var _fn_ret_val = null ;
    var _cmd_params = [];
        _cmd_params['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
    var _palette_len = ( is_array( _glob_palette_array ) ) ? _glob_palette_array.length : 0 ;

    if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
    if ( _params.length > 0 )
    {
        _cmd_params['action'] = "" ;
        _cmd_params['color'] = "" ;
        _cmd_params['dump'] = NO ;
        _cmd_params['dump_array'] = null ;
        _cmd_params['dump_operator_index'] = UNDET ;
        _cmd_params['end'] = null ;
        _cmd_params['help'] = NO ;
        _cmd_params['keywords'] = NO ;
        _cmd_params["item"] = ITEMS_SWITCH_SEEDS ;
        _cmd_params['mode'] = UNDET ;
        _cmd_params['plain'] = 0 ;
        _cmd_params['steps'] = 0 ;
        _cmd_params['start'] = null ;
         
        var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
        _params_array.clean_from( " " ); _params_array.clean_from( "" ); 
        // pre-scan for levenshtein correction
		var _cmd_terms_dict = [ "on", "off", "adapt", "append", "create", "invert", "destroy",
                "list", "plain", "remove", "replace", "reverse", "size", "tags", "colorize", "decolorize" ];
        circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _par_1, _out_channel );

		var _dump_operator_index = _params_array.indexOf( TERMINAL_OPERATOR_DUMP_TO );
		_cmd_params['dump'] = _dump_operator_index != UNFOUND ? YES : NO ;
		_cmd_params['dump_operator_index'] = _dump_operator_index ;
		_cmd_params['dump_array'] = [];
				
		// gather all dump parameters into one array
        if ( _cmd_params['dump'] )
        {
    		for( var _i = _dump_operator_index + 1 ; _i < _params_array.length ; _i++ )
    		if ( _params_array[_i].trim().length > 0 ) _cmd_params['dump_array'].push( _params_array[_i] );
        }
				 
        var _p ;
        // if dumping is set on, then cmd params are processed up to the dump operator itself: dump params will be managed separately
        var _up_to_index = _dump_operator_index == UNFOUND ? _params_array.length : _dump_operator_index ;
        for( var _i = 0 ; _i < _up_to_index ; _i++ )
        {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/help", "--help", "/?" ) ) _cmd_params['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _cmd_params['keywords'] = YES ;
            else if ( _p.is_one_of_i( "html", "plain", "silent" ) ) _cmd_params[_p] = YES ;
            else if ( _p.stricmp( "seeds" ) ) _cmd_params["item"] = ITEMS_SWITCH_SEEDS ;
            else if ( _p.stricmp( "generators" ) ) _cmd_params["item"] = ITEMS_SWITCH_GENS ;
            else if ( _p.stricmp( "off" ) ) _cmd_params['mode'] = OFF ;
            else if ( _p.stricmp( "on" ) ) _cmd_params['mode'] = ON ;
            else if ( _p.is_one_of_i( "adapt", "append", "colorize", "decolorize", "create", "invert", "destroy", "list",
                    "remove", "replace", "reverse", "shuffle", "size", "tags", "release" ) ) _cmd_params['action'] = _p ;
            else
            {
                   if ( _p.start_with_i( "steps:" ) )
                   {
                        var _steps = safe_int( _p.toLowerCase().replace( /^steps:/, "" ), 0 );
                        _cmd_params['steps'] = _steps ;
                   }
                   else if ( _p.start_with_i( "start:" ) )
                   {
                        var _p_color = _p.toLowerCase().replace( /^start:/, "" );
                        var _color = ( circles_lib_colors_get_formats( _p_color ) )[COLOR_RGB_HEX] ;
                        _b_fail = _color.length == 0 ? YES : NO ;
                        if ( _b_fail ) _error_str = "start color format is not supported" ;
                        else _cmd_params['start'] = _color ;
                   }
                   else if ( _p.start_with_i( "end:" ) )
                   {
                        var _p_color = _p.toLowerCase().replace( /^end:/, "" );
                        var _color = ( circles_lib_colors_get_formats( _p_color ) )[COLOR_RGB_HEX] ;
                        _b_fail = _color.length == 0 ? YES : NO ;
                        if ( _b_fail ) _error_str = "end color format '"+_p_color+"' is not supported" ;
                        _cmd_params['end'] = _color ;
                   }
                   else if ( _p.start_with_i( "color:" ) )
                   {
                        var _p_color = _p.toLowerCase().replace( /^color:/, "" );
                        var _color = ( circles_lib_colors_get_formats( _p_color ) )[COLOR_RGB_HEX] ;
                        _b_fail = _color.length == 0 ? YES : NO ;
                        if ( _b_fail ) _error_str = "color format '"+_p_color+"' is not supported" ;
                        _cmd_params['color'] = _color ;
                   }
                   else if ( _p.start_with_i( "index:" ) )
                   {
                        var _index = _p.toLowerCase().replace( /^index:/, "" ) ;
                            _index_array = circles_lib_terminal_parse_input_index( _index );
                        var _index_array_ret = is_array( _index_array ) ? safe_int( _index_array[0], UNDET ) : UNDET ;
                        var _index_array_chunk = is_array( _index_array ) ? _index_array[1] : [] ;
                        if ( _index_array_ret == UNDET ) { _b_fail = YES, _error_str = "Memory failure" ; break ; }
                        else if ( _index_array_ret == 0 ) { _b_fail = YES, _error_str = _index_array_chunk ; break ; }
                        else if ( _index_array_ret == 1 ) _cmd_params['index'] = _index_array_chunk ;
                   }
                   else { _b_fail = YES, _error_str = "Unknown input param '"+_p+"' at token #"+(_i+1); break ; }
            }
        }

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
         else
         {
             if ( _cmd_params['mode'] != UNDET )
             {
               _glob_palette_use = _cmd_params['mode'] ;
               var _palette_label = "" ;
               switch( _glob_palette_use )
               {
                  case 1 : _palette_label = "Colors palette mode is on" ; break ;
                  default : _palette_label = "Colors palette mode is off" ; break ;
               }
               
               _palette_label = _palette_label.toLowerCase();
               circles_lib_output( _out_channel, DISPATCH_SUCCESS, _palette_label, _par_1, _cmd_tag );

				if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
				{
					_glob_terminal_change = YES ;
					circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
				}
             }
             else
             {
                var _items_array = _cmd_params["item"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
          		var _items_n = circles_lib_count_items( _items_array );
                var _dest_ref = _cmd_params["item"] == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
                var _category_ref = _cmd_params["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "generator" ;
                var _action = _cmd_params['action'] ;
                switch( _action )
                {
                  case "release":
                  circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
                  break ;
                  case "adapt":
                  if ( _palette_len > 0 )
                  {
                     if ( _glob_depth > 1 )
                     {
                        var _rgb_start = is_array( _glob_palette_array ) ? _glob_palette_array[0] : "" ;
                        var _rgb_end = is_array( _glob_palette_array ) ? _glob_palette_array[_palette_len-1] : "" ;
                        var _ret_chunk = circles_lib_colors_compute_gradient( _rgb_start, _rgb_end, _glob_depth, YES, _out_channel );
                        var _ret_id = _ret_chunk[0] ;
                            _glob_palette_array = _ret_chunk[1] ;
                        var _ret_msg = _ret_chunk[2] ;

                        if ( is_array( _glob_palette_array ) )
                        {
                            if ( _glob_palette_array.length > 0 )
                            circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Colors palette has been adapted to current depth ("+_glob_depth+")", _par_1, _cmd_tag );
							if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
          					{
          						_glob_terminal_change = YES ;
          						circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
          					}
                        }
                        else { _b_fail = YES, _error_str = "Fail to resize palette: " + _ret_msg ; }
                     }
                     else circles_lib_output( _out_channel, DISPATCH_WARNING, "Colors palette can be adapted only if depth is greater than 1", _par_1, _cmd_tag );
                  }
                  break ;
                  case "append":
                  case "create":
                  var _steps = safe_int( _cmd_params['steps'], 0 ) ;
                  var _rgb_start = _cmd_params['start'], _rgb_end = _cmd_params['end'] ;
                  if ( circles_lib_colors_is_def( _rgb_start ) && circles_lib_colors_is_def( _rgb_end ) )
                  {
                     if ( circles_lib_colors_is_tag( _rgb_start ) ) _rgb_start = circles_lib_colors_get_def_from_tag( _rgb_start );
                     if ( circles_lib_colors_is_tag( _rgb_end ) ) _rgb_end = circles_lib_colors_get_def_from_tag( _rgb_end );

		                 var _rgb_start_formats = circles_lib_colors_get_formats( _rgb_start ) ;
		                 var _rgb_end_formats = circles_lib_colors_get_formats( _rgb_end ) ;
		                 var _ret_chunk = circles_lib_colors_compute_gradient( _rgb_start_formats[COLOR_RGB_INT], _rgb_end_formats[COLOR_RGB_INT], _steps, YES, _out_channel );
						 var _ret_id = _ret_chunk[0], _ret_palette = _ret_chunk[1], _ret_msg = _ret_chunk[2] ;
	                     circles_lib_output( _out_channel, _ret_id ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );

		                 if ( _steps == 0 )
		                 {
		                    circles_lib_output( _out_channel, DISPATCH_WARNING, "No steps number set: current depth ("+_glob_depth+") is assumed", _par_1, _cmd_tag );
		                    _steps = _glob_depth ;
		                 }
		
		                 if ( _cmd_params['action'] == "create" ) _glob_palette_array = _ret_palette ;
		                 else if ( _cmd_params['action'] == "append" ) _glob_palette_array = _glob_palette_array.concat( _ret_palette );
		  
		                 if ( !is_array( _glob_palette_array ) ) { _b_fail = YES, _error_str = "Fail to perform '"+_action+"' action on current palette" ; }
		                 else if ( _glob_palette_array.length > 0 )
		                 {
		                    if ( _cmd_params['action'] == "create" )
		                    circles_lib_output( _out_channel, DISPATCH_SUCCESS, "A new colors palette has been created", _par_1, _cmd_tag );
		                    else if ( _cmd_params['action'] == "append" )
		                    circles_lib_output( _out_channel, DISPATCH_SUCCESS, "This new colors palette was appended", _par_1, _cmd_tag );
		  
		  						      if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
		  						  		{
		  										_glob_terminal_change = YES ;
		  							      circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
		  									}
		                 }
									}
									else
									{
										 var _msg = [] ;
										 if ( !circles_lib_colors_is_def( _rgb_start ) ) _msg.push( "* Unknown start color format" );
									   if ( !circles_lib_colors_is_def( _rgb_end ) ) _msg.push( "* Unknown end color format" );
										 circles_lib_output( _out_channel, DISPATCH_ERROR, _msg.join( _glob_crlf ), _par_1, _cmd_tag );
									}
                  break ;
                  case "colorize":
                  if ( _items_n > 0 )
                  {
           	     		 var _params_array = [] ;
           					 _params_array['prepromptquestion'] = null ;
           					 _params_array['promptquestion'] = "Confirm to colorize all "+_dest_ref+"? " ;
           					 _params_array['yes_fn'] = function()
                     {
                        var _ret_chunk = circles_lib_colors_colorize_group( _dest_ref, YES, YES, _out_channel );
                        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
                        circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                     }

          					 _params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_colorize_group( _dest_ref, YES, YES, _out_channel ); }
					 if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
           			 else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                  }
                  else { _b_fail = YES, _error_str = "The list of seeds is empty" ; }
                  break ;
                  case "decolorize":
                  if ( _items_n > 0 )
                  {
            	     	 var _params_array = [] ;
            				 _params_array['prepromptquestion'] = null ;
            				 _params_array['promptquestion'] = "Confirm to decolorize all "+_dest_ref+"? " ;
            				 _params_array['yes_fn'] = function()
                     {
                        var _ret_chunk = circles_lib_colors_decolorize_group( _dest_ref, YES, YES, _out_channel );
                        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
                        circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
                     }
            				 _params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_decolorize_group( _dest_ref, YES, YES, _out_channel ); }
					if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
             		else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                  }
                  else { _b_fail = YES, _error_str = "The list of seeds is empty" ; }
                  break ;
                  case "destroy":
                  if ( _palette_len > 0 )
                  {
           	     		var _params_array = [] ;
           				_params_array['prepromptquestion'] = null ;
           				_params_array['promptquestion'] = "Confirm to destroy the current palette (y|n) ? " ;
           				_params_array['yes_fn'] = function() {
								_glob_palette_array = [] ;
								if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
								{
   								  	_glob_terminal_change = YES ;
   							        circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
   								}
								circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Palette is now empty", _par_1, _cmd_tag );
							}
       					_params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_colorize_group( _dest_ref, YES, YES, _out_channel ); }
						if ( !_glob_terminal_echo_flag || _cmd_params['silent'] ) _params_array['yes_fn'].call(this);
						else circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
                  }
                  else { _b_fail = YES, _error_str = "The palette is already empty" ; }
                  break ;
                  case "invert":
                  if ( _palette_len > 0 )
                  {
                     var _clr, _clr_array ;
  									 for( var _i = 0 ; _i < _palette_len ; _i++ )
                     {
                        _clr = _glob_palette_array[_i].replaceAll( "rgb(", "").replaceAll( ")", "").replaceAll( " ", "" );
                        _clr_array = _clr.split( "," );
                        if ( _clr_array.length == 3 )
                        {
                           _clr_array[0] = safe_int( _clr_array[0], 0 ); _clr_array[0] = 255 - _clr_array[0] ;
                           _clr_array[1] = safe_int( _clr_array[1], 0 ); _clr_array[1] = 255 - _clr_array[1] ;
                           _clr_array[2] = safe_int( _clr_array[2], 0 ); _clr_array[2] = 255 - _clr_array[2] ;
                           _glob_palette_array[_i] = "rgb(" + _clr_array.join( "," ) + ")" ;
                        }
                        else
                        {
                           _b_fail = YES, _error_str = "Failed inversion: the color format is not correct (index "+(_i+1) + " )" ;
                           break ;
                        }
                     }
                             
                     if ( !_b_fail ) circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Colors palette inverted", _par_1, _cmd_tag );
  							     if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
  							  	 {
  											_glob_terminal_change = YES ;
  								      circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
  									 }
                  }
                  else circles_lib_output( _out_channel, DISPATCH_WARNING, "Colors palette size is empty", _par_1, _cmd_tag );
                  break ;
                  case "list":
                  var _digits = safe_int( Math.log( _palette_len ) / Math.log( 10 ), 0 ) + 3 ;
                  var _html = _cmd_params['html'] ;
                  if ( _palette_len > 0 )
                  {
                    circles_lib_output( _out_channel, DISPATCH_STANDARD, "Listing the palette ..", _par_1, _cmd_tag );
                    var _ordinal = "" ;
                    var _out_file_txt = "Current palette : "+_palette_len+" entr"+( _palette_len == 1 ? "y" : "ies" )+_glob_crlf ;
                    var _out_tagged_txt = "<snow>"+_out_file_txt+"</snow>" ;
                    var _hex, _line, _tag ;
  
                    for( var _i = 0 ; _i < _palette_len ; _i++ )
                    {
                        _hex = _glob_palette_array[_i] != null ? circles_lib_colors_rgb_dec_to_hex( _glob_palette_array[_i] ) : "" ;
                        if ( _hex.length > 0 )
                        {
                          _ordinal = (_i+1) + ") " ;
                          _ordinal = _ordinal.rpad( " ", _digits );
                          _tag = circles_lib_colors_get_formats( _hex )[3] ;
                          _line = _ordinal + _glob_palette_array[_i] + " " + _hex + " " + ( _tag.length > 0 ? _tag.lpad( " ", 10 ) : "" );
                          _out_file_txt += _line + _glob_crlf ;
                          _out_tagged_txt += "<span STYLE=\"color:"+_glob_palette_array[_i]+";\">"+_ordinal+"</span>" + _glob_crlf ;
                          if ( _cmd_params['plain'] ) circles_lib_output( _out_channel, DISPATCH_STANDARD, _line, _par_1, _cmd_tag );
                          else circles_lib_output( _out_channel, DISPATCH_TEXTCOLOR_TYPE, _line, _hex );
                        }
                    }
  
					_out_text_string = _out_file_text
  
                    if ( _html ) circles_lib_terminal_color_decode_htmltext( _out_tagged_txt, 'palette', 'right', 'top' );
                    else if ( _cmd_params['dump'] )
                    {
    					_cmd_params['dump_array'] = is_array( _cmd_params['dump_array'] ) ? _cmd_params['dump_array'][0] : "circles.palette.txt" ;
  						var _ret_chunk = circles_lib_dump_data_to_format( _out_file_txt.strip_tags(), _cmd_params['dump_array'] );
  						var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
  	   					var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation";
  		  				if ( _ret_id == 0 ) { _b_fail = YES, _error_str = _ret_msg ; }
  						else circles_lib_output( _out_channel, DISPATCH_SUCCESS, _ret_msg, _par_1, _cmd_tag );
                    }
                  }
                  else circles_lib_output( _out_channel, DISPATCH_WARNING, "Colors palette size is empty", _par_1, _cmd_tag );
                  break ;
                  case "remove":
                  if ( _palette_len == 0 ) { _b_fail = YES, _error_str = "No entries can be removed: palette is empty" ; }
                  else
                  {
                     if ( _index_array_chunk.length > 0 )
                     {
                        var _palette_len = _glob_palette_array.length, _cand_index ;
                        for( var _i = 0 ; _i < _index_array_chunk.length ; _i++ )
                        {
                           _cand_index = safe_int( _index_array_chunk[_i]-1, 0 );
                           if ( _cand_index < 0 || _cand_index > _palette_len )
                           {
                              _b_fail = YES, _error_str = "Index " + _cand_index + " is out of range (1-"+_palette_len+")" ;
                              break ;
                           }
                           else _glob_palette_array[ _cand_index ] = "kill." + _glob_palette_array[ _cand_index ] ;
                        }
                                 
                        // as rgb values are taken, they will be searched along the palette and then removed
                        var _p = _glob_palette_array.length, _clr, _search_token = "kill", _n_deleted = 0 ;
                        for( var _c = 0 ; _c < _p ; _c++ )
                        {
                           _clr = _glob_palette_array[_c] ;
                           if ( _clr != null )
                           {
                              if ( _clr.start_with( _search_token )  )
                              {
                                _glob_palette_array.remove( _c, _c );
                                _p = _glob_palette_array.length ;
								_c-- ;
								_n_deleted++ ;
                              }
                           }
                        }
                                 
                        if ( !_b_fail && _n_deleted > 0 ) circles_lib_output( _out_channel, DISPATCH_SUCCESS, _n_deleted+" entr"+(_n_deleted==1?"y":"ies")+" have been removed", _par_1, _cmd_tag );
						else circles_lib_output( _out_channel, DISPATCH_WARNING, "No entries have been removed", _par_1, _cmd_tag );
                     }
                     else { _b_fail = YES, _error_str = "No entries can be removed: no input index" ; }
                  }
                  break ;
                  case "reverse":
                  if ( _palette_len > 0 )
                  {
						_glob_palette_array.reverse();
						circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Colors palette reversed", _par_1, _cmd_tag );
        			    if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
      				  	{
      						_glob_terminal_change = YES ;
      					    circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
      					}
                  }
				  else { _b_fail = YES, _error_str = "Fail to reverse palette: it is empty" ; }
                  break ;
                  case "replace":
                  var _p_color = _cmd_params['color'] ;
                  if ( _p_color.length > 0 )
                  {
                     var _color = ( circles_lib_colors_get_formats( _p_color ) )[COLOR_RGB_HEX] ;
                     _b_fail = ( color.length == 0 ) ? YES : NO ;
                     if ( _b_fail ) _error_str = "color format is unknown" ;
                     else _cmd_params['color'] = color ;
                     if ( _selected_index != UNDET )
                     {
                        _glob_palette_array[_selected_index] = _cmd_params['color'] ;
                        circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Color replaced", _par_1, _cmd_tag );
                     }
                     else { _b_fail = YES, _error_str = "The input index ("+_selected_index+") for color replacement is not a number" ; }
                  }
                  else { _b_fail = YES, _error_str = "Please, input %color% parameter" ; }
                  break ;
                  case "shuffle":
                  if ( _palette_len > 0 )
                  {
						_glob_palette_array.shuffle();
						circles_lib_output( _out_channel, DISPATCH_SUCCESS, "Colors palette shuffled", _par_1, _cmd_tag );
        			    if ( circles_lib_terminal_batch_script_exists() && _out_channel == OUTPUT_TERMINAL )
      				  	{
      						_glob_terminal_change = YES ;
      					    circles_lib_output( _out_channel, DISPATCH_INFO, TERMINAL_LABEL_01, _par_1, _cmd_tag );
      					}
                  }
				  else { _b_fail = YES, _error_str = "Fail to reverse palette: it is empty" ; }
                  break ;
                  case "size":
                  if ( _palette_len > 0 )
                  circles_lib_output( _out_channel, DISPATCH_INFO, "Colors palette size is "+_glob_palette_array.length+"", _par_1, _cmd_tag );
                  else
                  circles_lib_output( _out_channel, DISPATCH_WARNING, "Colors palette size is empty", _par_1, _cmd_tag );
                  break ;
                  case "tags":
				  var _colors_defs = _glob_def_clrs_tags.keys_associative(), _cnt = 0, _cols = 5, _row = "", _max_len = 0 ;
				  _colors_defs.forEach( function( _def ){ _max_len = Math.max( _max_len, _def.length ) ; } ) ;
				  _colors_defs.forEach( function( _def )
				  {
					  _def = _def.replace( /^tag./, "" );
					  if ( _cnt % _cols == 0 && _row.length > 0 )
					  {
						circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _row+_glob_crlf, _par_1, _cmd_tag );
						_row = "" ;
					  }
					  else _row += "<"+_def+">CLR</"+_def+"> " + _def.rpad( " ", _max_len+1 ) + "  " ;
					  _cnt++ ;
				  }	) ;
                  break ;
				  default: break ;
               }
            }
         }
    }
    else
    {
        var _palette_label = "" ;
        switch( _glob_palette_use )
        {
            case 1 : _palette_label = "Current palette mode is on" ; break ;
            default : _palette_label = "Current palette mode is off" ; break ;
        }
        circles_lib_output( _out_channel, DISPATCH_INFO, _palette_label, _par_1, _cmd_tag );
    }

     if ( _b_fail && _glob_terminal_errors_switch && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}