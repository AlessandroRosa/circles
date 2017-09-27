function circles_terminal_cmd_color()
{
     var _cmd_tag = arguments.callee.myname().replaceAll( "circles_terminal_cmd_", "" );
     var _params = arguments[0] ;
     var _out_channel = arguments[1] ;
     var _par_1 = arguments[2] ;
     var _cmd_mode = arguments[3] ;
     var _caller_id = arguments[4] ;
     _params = safe_string( _params, "" ).trim();

     if ( _glob_verbose )
     circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<slategray>cmd '"+_cmd_tag+"' running in "+( _cmd_mode == TERMINAL_CMD_MODE_ACTIVE ? "active" : "passive" )+" mode</slategray>", _par_1, _cmd_tag );

     var _color_tag_entry_max_length = 0 ;

     for( var _key in def_clrs_tags )
     {
       if ( _key.includes( "tag." ) )
       {
         _color_name = _key.replaceAll( "tag.", "" );
         _color_tag_entry_max_length = Math.max( _color_tag_entry_max_length, _color_name.length );
       }
     }

     _color_tag_entry_max_length += 2 ;

		 var _last_release_date = get_file_modify_date( _glob_terminal_abs_cmds_path, "circles.terminal.cmd."+_cmd_tag+".js" ) ;
     var _b_fail = 0 ;
     var _error_str = "" ;
     var _out_text_string = "" ;
     var _params_assoc_array = [];
     var _fn_ret_val = null ;

     if ( _cmd_mode == TERMINAL_CMD_MODE_INCLUSION ) return null ;
     else if ( _params.length > 0 )
     {
         _params_assoc_array['html'] = _out_channel == OUTPUT_HTML ? YES : NO ;
         _params_assoc_array['help'] = NO ;
         _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
         _params_assoc_array['keywords'] = NO ;
         
         var _params_array = _params.includes( " " ) ? _params.split( " " ) : [ _params ] ;
         _params_array.clean_from( " " );       _params_array.clean_from( "" );
         // pre-scan for levenshtein correction
    		 var _local_cmds_params_array = [];
    				 _local_cmds_params_array.push( "default", "reset", "show", "bk", "release", "html", "help", "colorize", "decolorize" );
         circles_lib_terminal_levenshtein( _params_array, _local_cmds_params_array, _par_1, _out_channel );

         var _p ;
         for( var _i = 0 ; _i < _params_array.length ; _i++ )
         {
            _p = _params_array[_i].toLowerCase();
            if ( _p.is_one_of_i( "/h", "/?" ) ) _params_assoc_array['help'] = YES ;
            else if ( _p.is_one_of_i( "/k" ) ) _params_assoc_array['keywords'] = YES ;
            else if ( _p.stricmp( "html" ) ) _params_assoc_array['html'] = YES ;
            else if ( _p.is_one_of_i( "bk", "colorize", "decolorize", "release", "show" ) ) _params_assoc_array['action'] = _p ;
            else if ( _p.is_one_of_i( "default", "reset" ) ) _params_assoc_array['color'] = DEFAULT_FONT_COLOR ;
            else if ( _p.stricmp( "seeds" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_SEEDS ;
            else if ( _p.stricmp( "gens" ) ) _params_assoc_array["item"] = ITEMS_SWITCH_GENS ;
            else if ( circles_lib_colors_is_def( _p ) ) _params_assoc_array['color'] = _p ;
            else
            {
                _b_fail = YES, _error_str = "Unknown param '"+_p+"'" ;
            }
         }

         var _action = _params_assoc_array['action'] ;
         var _items_array = _params_assoc_array["item"] == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
 		     var _items_n = circles_lib_count_items( _items_array );
         var _dest_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "Seeds" : "Gens" ;
         var _category_ref = _params_assoc_array["item"] == ITEMS_SWITCH_SEEDS ? "seed" : "gen" ;

         switch( _action )
         {
              case "bk":
              if ( _params_assoc_array['color'] == null )
              {
                  _b_fail = YES, _error_str = "Missing input color" ;
              }
              else
              {
                  $("#"+_glob_terminal_current_id).css( "background-color", _params_assoc_array['color'] );
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
                  var _ret_chunk = circles_lib_colors_colorize( _dest_ref, YES, YES, _out_channel );
                  var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "29Unknown error" ;
                  circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
               }
    					 _params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_colorize( _dest_ref, YES, YES, _out_channel ); }
     			     circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
           }
           else
           {
               _b_fail = YES, _error_str = "The list of seeds is empty" ;
           }
           break ;
           case "decolorize":
           if ( _items_n > 0 )
           {
    	     		 var _params_array = [] ;
    					 _params_array['prepromptquestion'] = null ;
    					 _params_array['promptquestion'] = "Confirm to decolorize all "+_dest_ref+"? " ;
    					 _params_array['yes_fn'] = function()
               {
                  var _ret_chunk = circles_lib_colors_decolorize( _dest_ref, YES, YES, _out_channel );
                  var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
                  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "30Unknown error" ;
                  circles_lib_output( _out_channel, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _par_1, _cmd_tag );
               }
    					 _params_array['ifquestiondisabled_fn'] = function() { circles_lib_colors_decolorize( _dest_ref, YES, YES, _out_channel ); }
     			     circles_lib_terminal_cmd_ask_yes_no( _params_array, _out_channel );
           }
           else
           {
               _b_fail = YES, _error_str = "The list of seeds is empty" ;
           }
           break ;
              case "release":
              circles_lib_output( _out_channel, DISPATCH_INFO, _cmd_tag + " cmd - last release date is " + _last_release_date, _par_1, _cmd_tag );
              break ;
              case "show":
              if ( _params_assoc_array['color'] == null )
              {
                   _b_fail = YES, _error_str = "Missing input color" ;
              }
              else
              {
                  var _color_chunk = circles_lib_colors_get_formats( _params_assoc_array['color'] ) ;
                  var _color_hex = _color_chunk[2], _color_tag = _color_chunk[3] ;
                  var HTMLcode = "<table>" ;
                  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
                  HTMLcode += "<tr><td WIDTH=\"60\" HEIGHT=\"12\" STYLE=\"background-color:"+_color_hex+"\"></td></tr>" ;
                  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
                  HTMLcode += "<tr><td WIDTH=\"60\" HEIGHT=\"12\">"+_params_assoc_array['color']+"</td></tr>" ;
                  if ( _color_tag.length > 0 && !( _color_tag.stricmp( _params_assoc_array['color'] ) ) )
                  HTMLcode += "<tr><td WIDTH=\"60\" HEIGHT=\"12\">"+_color_tag+"</td></tr>" ;
                  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
                  HTMLcode += "</table>" ;
                  circles_lib_terminal_html_display( _glob_terminal, HTMLcode ) ;
              }
              break ;
			        default: break ;
         }
         
         if ( _params_assoc_array['help'] )
         {
              var _MSG = "<banana>set console font color</banana>" + _glob_crlf ;
              _MSG += "<lightblue>usage</lightblue> <snow>bk %color% %action%</snow>" + _glob_crlf ;
              _MSG += "<lightblue>%action%</lightblue> <snow>default | reset | show</snow>" + _glob_crlf ;
              _MSG += "<lightblue>color show rgb(82,150,81)</lightblue>" + _glob_crlf ;
              _MSG += "<cadetblue>display the input color shade on the terminal viewport</cadetblue>" + _glob_crlf ;
              _MSG += "<lightblue>color reset</lightblue>" + _glob_crlf ;
              _MSG += "<cadetblue>restore default settings</cadetblue>" + _glob_crlf ;
              _MSG += "<lightblue>color violet</lightblue>" + _glob_crlf ;
              _MSG += "<cadetblue>set font color to yellow (tag version)</cadetblue>" + _glob_crlf ;
              _MSG += "<lightblue>color #FF0000</lightblue>" + _glob_crlf ;
              _MSG += "<cadetblue>set font color to rgb hex triplet</cadetblue>" + _glob_crlf ;
              _MSG += "<lightblue>color rgb(82,150,81)</lightblue>" + _glob_crlf ;
              _MSG += "<cadetblue>set bk color to rgb int triplet</cadetblue>" + _glob_crlf ;
              _MSG += "\nSupported color tags are:" + _glob_crlf ;

              var _columns = Math.floor( _glob_terminal.cols() / _color_tag_entry_max_length );
              var _counter = 0, _color_name = "", _color_tagged_entry, _row = "" ;
              for( var _key in def_clrs_tags )
              {
                 if ( _key.includes( "tag." ) )
                 {
                     _color_name = _key.replaceAll( "tag.", "" );
                     _p_color = def_clrs_tags[_key] ;
                     _color_tagged_entry = "<"+_color_name+">" + _color_name.rpad( " ", 2 ) + "</"+_color_name+">" ;
                     _color_name = _color_tagged_entry + ( new String( " ").repeat( _color_tag_entry_max_length - _color_name.length ) );
                     _row += _color_name ;
                     _counter++ ;
                     if ( _counter == _columns )
                     {
                         _MSG += _row + _glob_crlf ;
                         _counter = 0 ;
                         _row = "" ;
                     }
                 }
              }

              if ( _counter != _columns )
              {
                 _MSG += _row + _glob_crlf, _counter = 0, _row = "" ;
              }

              circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _MSG, _par_1, _cmd_tag );         
         }
         else if ( _params_assoc_array['keywords'] )
         {
             var _msg = circles_lib_terminal_tabular_arrange_data( _local_cmds_params_array.sort() ) ;
             if ( _msg.length == 0 ) circles_lib_output( _out_channel, DISPATCH_INFO, "No keywords for cmd '"+_cmd_tag+"'", _par_1, _cmd_tag );
             else
             {
                 _msg = "Keywords for cmd '"+_cmd_tag+"'" + _glob_crlf + "Type '/h' for help about usage" + _glob_crlf.repeat(2) + _msg ;
                 circles_lib_output( _out_channel, DISPATCH_INFO, _msg, _par_1, _cmd_tag );
             }
         }
         else if ( !_b_fail ) $("#"+_glob_terminal_current_id).css( "color", _params_assoc_array['color'] );
     }
     else
     {
         _b_fail = YES, _error_str = "Missing input params" ;
     }
     
     if ( _b_fail && _out_channel != OUTPUT_FILE_INCLUSION ) circles_lib_output( _out_channel, DISPATCH_ERROR, $.terminal.escape_brackets( _error_str ) + ( _out_channel == OUTPUT_TERMINAL ? _glob_crlf + "Type '" +_cmd_tag+" /h' for syntax help" : "" ), _par_1, _cmd_tag );
     if ( _out_channel == OUTPUT_TEXT ) return _out_text_string ;
     else if ( _out_channel == OUTPUT_FUNCTION ) return _fn_ret_val ;
}