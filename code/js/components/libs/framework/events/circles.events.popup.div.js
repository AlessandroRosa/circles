function POPUPSDIVonmousedown( _div_id, event, _close_fns, _normalize_fns, _minimize_fns, _maximize_fns, _calling_fn, _calling_args )
{
    switch( event.which )
    {
        case 1: // left btn
        break;
        case 2: // mid btn
	      break;
        case 3: // right btn
        break ;
        default: break ;
    }
}

function POPUPSDIVonmouseup( _div_id, event, _close_fns, _normalize_fns, _minimize_fns, _maximize_fns, _calling_fn, _calling_args )
{
    switch( event.which )
    {
        case 1: // left btn
        break;
        case 2: // mid btn
	      break;
        case 3: // right btn
        var _popup_rec = circles_lib_plugin_find_wnd( { div_id : _div_id }, POPUP_SEARCH_BY_DIV_ID, YES ) ;
        var _unique_id = is_array( _popup_rec ) ? _popup_rec[0] : "" ;
        var _popup_caption = is_array( _popup_rec ) ? _popup_rec[2] : "" ;
        var _subset = is_array( _popup_rec ) ? _popup_rec[8] : "", _base_id = is_array( _popup_rec ) ? _popup_rec[12] : "" ;
        _calling_args = _calling_args.from_to( 1, _calling_args.length - 1 ) ;

			  var _contents = "<table WIDTH=\"100%\">" ;
			  		_contents += "<tr><td HEIGHT=\"2\"></td></tr>" ;
			  		_contents += "<tr><td WIDTH=\"3\"></td><td COLSPAN=\"3\" CLASS=\"general_rounded_corners\" STYLE=\"padding:2px;padding-left:10px;background-color:#DCE6F0;\">"+( _popup_caption.substr( 0, 16 ) + ( _popup_caption.length > 16 ? " ..." : "" ) )+"</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"10\"></td></tr>" ;
            
			  		_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Close this menu\" SRC=\"%imgpath%icons/hide/hide.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_destroy_wnd('"+_div_id+"');\">Close this menu</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			  		_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\""+_CAPTION_BTN_07+"\" SRC=\"%imgpath%icons/close/close.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_destroy_wnd('"+_div_id+"');circles_lib_plugin_destroy_wnd('"+_div_id+"');\">Close pop-up</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			  		_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Hide\" SRC=\"%imgpath%icons/ghost/ghost.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:_glob_popup_mask ^= 1;circles_lib_forms_show_panel( HIDE,'"+_div_id+"');circles_lib_plugin_destroy_wnd('"+_div_id+"');\">Hide pop-up</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			  		_contents += "<tr><td COLSPAN=\"5\" HEIGHT=\"1\" STYLE=\"background-color:#E0E0E0;\"></td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;

			  		_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Reload\" SRC=\"%imgpath%icons/wnd/reload.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:_glob_persistent_vars['reloaddiv']='"+_div_id+"';circles_lib_plugin_destroy_wnd('"+_div_id+"');circles_lib_plugin_load('"+_subset+"','"+_base_id+"'"+(_calling_args.length>0?','+_calling_args.join( "," ):'')+");\">Reload</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			  		_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Maximize Window\" SRC=\"%imgpath%icons/wnd/maximize.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_maximize( '"+_div_id+"', '"+( is_array( _maximize_fns ) ? _maximize_fns.join("|") : "" )+"' );circles_lib_plugin_destroy_wnd('"+_div_id+"');\">Maximize</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
						_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Minimize Window\" SRC=\"%imgpath%icons/wnd/minimize.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_minimize( '"+_div_id+"', '"+( is_array( _minimize_fns ) ? _minimize_fns.join("|") : "" )+"' );circles_lib_plugin_destroy_wnd('"+_div_id+"');\">Minimize</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
						_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Standard size\" SRC=\"%imgpath%icons/wnd/normalize.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_normalize( '"+_div_id+"', '"+( is_array( _normalize_fns ) ? _normalize_fns.join("|") : "" )+"' );circles_lib_plugin_destroy_wnd('"+_div_id+"');\">Normalize</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			  		_contents += "<tr><td COLSPAN=\"5\" HEIGHT=\"1\" STYLE=\"background-color:#E0E0E0;\"></td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
						_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Screenshot\" SRC=\"%imgpath%icons/eye/eye.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_extras_capture_wnd_screenshot( '"+_div_id+"', 'circles.popup.screenshot.png' );circles_lib_plugin_destroy_wnd('"+_div_id+"');\">Screenshot</td></tr>" ;
		if ( is_array( _popup_rec ) )
		{
				 var _context_menu_entry_array = _popup_rec[11] ;
				 if ( _context_menu_entry_array.length > 0 )
				 {
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			  		_contents += "<tr><td COLSPAN=\"5\" HEIGHT=\"1\" STYLE=\"background-color:#E0E0E0;\"></td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			 		  var _start_index = 0, _menu_entry_label, _menu_entry_fn, _menu_entry_args ;
			 		  $.each( _context_menu_entry_array,
			 		  				function( _i, _chunk )
			 		  				{
		 		  						_start_index = 0 ;
											_menu_entry_label = _chunk[_start_index] ;
											_start_index++ ;
											_menu_entry_fn = _chunk[_start_index] ;
											_start_index++ ;
											_menu_entry_args = _chunk[_start_index] ;
                      if ( !is_array( _menu_entry_args ) ) _menu_entry_args = [] ;
                      for( var _c = 0 ; _c < _menu_entry_args.length ; _c++ )
                      if ( is_string( _menu_entry_args[_c] ) ) _menu_entry_args[_c] = "'"+_menu_entry_args[_c]+"'" ;

                      if ( _menu_entry_label.length > 0 && _menu_entry_fn.length )
											{
													_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\""+_menu_entry_label+"\" SRC=\"%imgpath%icons/tools/tools.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:"+_menu_entry_fn+"("+_menu_entry_args.join( "," )+");\">"+_menu_entry_label+"</td></tr>" ;
										  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
											}
										}
						 			) ;
				 }
		}
			  		_contents += "<tr><td HEIGHT=\"2\"></td></tr>" ;
			  		_contents += "</table>" ;

        _contents = _contents.replaceAll( "%imgpath%", _glob_path_to_img );
			  if ( $("#"+_div_id).get(0) == null )
			  {
            var zI = circles_lib_plugin_get_max_zindex() + 1 ;
						var _menudiv = circles_lib_plugin_create( _div_id, 120, "auto", _contents, "", zI, NO );
						if ( _menudiv != null )
						{
								circles_lib_plugin_register( [ "", "" ], _div_id, "", OPEN, SHOW, "", "", "" ) ;
								_menudiv.style.display = "block" ;
								_menudiv.oncontextmenu = function( event ) { return false; }
                $("#"+_div_id).get(0).setAttribute( "class", "popup_wnd" );
								$("#"+_div_id).css( "padding", "1px" );
						}
				}

				$("#"+_div_id).css( "left", event.clientX );
				$("#"+_div_id).css( "top", event.clientY );
        break;
        default:
        break ;
    }
}

function POPUPSDIVoncontextmenu( _unique_id, _obj_id, event ) { return false ; }