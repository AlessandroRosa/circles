function POPUPSDIVonmousedown( _unique_id, objid, event, _close_fns, _normalize_fns, _minimize_fns, _maximize_fns, _calling_fn, _calling_args )
{
    switch( event.which )
    {
        case 1: // left btn
				circles_lib_plugin_destroy_wnd( objid + "_menu_div" );
        break;
        case 2: // mid btn
	      break;
        case 3: // right btn
        break ;
        default: break ;
    }
}

function POPUPSDIVonmouseup( _unique_id, objid, event, _close_fns, _normalize_fns, _minimize_fns, _maximize_fns, _calling_fn, _calling_args )
{
    switch( event.which )
    {
        case 1: // left btn
        break;
        case 2: // mid btn
	      break;
        case 3: // right btn
        var _popup_rec = circles_lib_plugin_find_wnd( { unique_id : _unique_id }, POPUP_SEARCH_BY_UNIQUE_ID, YES ) ;
        var _unique_id = is_array( _popup_rec ) ? _popup_rec[0] : "" ;
        var _div_id = is_array( _popup_rec ) ? _popup_rec[1] : "" ;
        var _popup_caption = is_array( _popup_rec ) ? _popup_rec[2] : "" ;
        var _subset = is_array( _popup_rec ) ? _popup_rec[8] : "", _base_id = is_array( _popup_rec ) ? _popup_rec[12] : "" ;
        _calling_args = _calling_args.from_to( 1, _calling_args.length - 1 ) ;

			  var _contents = "<table WIDTH=\"100%\">" ;
			  		_contents += "<tr><td HEIGHT=\"2\"></td></tr>" ;
			  		_contents += "<tr><td WIDTH=\"3\"></td><td COLSPAN=\"3\" CLASS=\"general_rounded_corners\" STYLE=\"padding:2px;padding-left:10px;background-color:#DCE6F0;\">"+( _popup_caption.substr( 0, 16 ) + ( _popup_caption.length > 16 ? " ..." : "" ) )+"</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"10\"></td></tr>" ;
            
			  		_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Close this menu\" SRC=\"%imgpath%icons/hide/hide.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_destroy_wnd('"+objid+"_menu_div"+"');\">Close this menu</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			  		_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\""+_CAPTION_BTN_07+"\" SRC=\"%imgpath%icons/close/close.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_destroy_wnd( '"+objid+"' );circles_lib_plugin_destroy_wnd('"+objid+"_menu_div"+"');\">Close pop-up</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			  		_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Hide\" SRC=\"%imgpath%icons/ghost/ghost.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:_glob_popup_mask ^= 1;circles_lib_forms_show_panel( HIDE,'"+objid+"');circles_lib_plugin_destroy_wnd('"+objid+"_menu_div"+"');\">Hide pop-up</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			  		_contents += "<tr><td COLSPAN=\"5\" HEIGHT=\"1\" STYLE=\"background-color:#E0E0E0;\"></td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;

			  		_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Reload\" SRC=\"%imgpath%icons/wnd/reload.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:_glob_persistent_vars['reloaddiv']='"+_div_id+"';circles_lib_plugin_destroy_wnd('"+objid+"_menu_div"+"');circles_lib_plugin_load('"+_subset+"','"+_base_id+"'"+(_calling_args.length>0?','+_calling_args.join( "," ):'')+");\">Reload</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			  		_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Maximize Window\" SRC=\"%imgpath%icons/wnd/maximize.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_maximize( '"+objid+"', '"+( is_array( _maximize_fns ) ? _maximize_fns.join("|") : "" )+"' );circles_lib_plugin_destroy_wnd('"+objid+"_menu_div"+"');\">Maximize</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
						_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Minimize Window\" SRC=\"%imgpath%icons/wnd/minimize.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_minimize( '"+objid+"', '"+( is_array( _minimize_fns ) ? _minimize_fns.join("|") : "" )+"' );circles_lib_plugin_destroy_wnd('"+objid+"_menu_div"+"');\">Minimize</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
						_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Standard size\" SRC=\"%imgpath%icons/wnd/normalize.icon.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_normalize( '"+objid+"', '"+( is_array( _normalize_fns ) ? _normalize_fns.join("|") : "" )+"' );circles_lib_plugin_destroy_wnd('"+objid+"_menu_div"+"');\">Normalize</td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			  		_contents += "<tr><td COLSPAN=\"5\" HEIGHT=\"1\" STYLE=\"background-color:#E0E0E0;\"></td></tr>" ;
			  		_contents += "<tr><td HEIGHT=\"5\"></td></tr>" ;
						_contents += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"16\"><IMG TITLE=\"Screenshot\" SRC=\"%imgpath%icons/eye/eye.01.12x12.png\"></td><td WIDTH=\"3\"></td><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_extras_capture_wnd_screenshot( '"+objid+"', 'circles.popup.screenshot.png' );circles_lib_plugin_destroy_wnd('"+objid+"_menu_div"+"');\">Screenshot</td></tr>" ;
		var _entry_array_ref = circles_lib_plugin_find_wnd( { unique_id : _unique_id }, POPUP_SEARCH_BY_UNIQUE_ID, YES ) ;
		if ( is_array( _entry_array_ref ) )
		{
				 var _context_menu_entry_array = _entry_array_ref[11] ;
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
			  if ( $( "#" + objid + "_menu_div" ).get(0) == null )
			  {
            var zI = circles_lib_plugin_get_max_zindex() + 1 ;
						var _menudiv = circles_lib_plugin_create( objid + "_menu_div", objid + "_menu_div", '', 120, "auto", _contents, "", zI, NO );
						if ( _menudiv != null )
						{
								circles_lib_plugin_register( [ "", "" ], objid + "_menu_div", "", OPEN, SHOW, "", "", "" ) ;
								_menudiv.style.display = "block" ;
								_menudiv.oncontextmenu = function( event ) { return false; }
                $( "#" + objid + "_menu_div" ).get(0).setAttribute( "class", "popup_wnd" );
								$( "#" + objid + "_menu_div" ).css( "padding", "1px" );
						}
				}

				$( "#" + objid + "_menu_div" ).css( "left", event.clientX );
				$( "#" + objid + "_menu_div" ).css( "top", event.clientY );
        break;
        default:
        break ;
    }
}

function POPUPSDIVoncontextmenu( _unique_id, _obj_id, event ) { return false ; }