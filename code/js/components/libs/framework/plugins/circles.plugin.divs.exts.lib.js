/* POPUP OBJ FIELDS MAP
   0 : unique id        1 : div id             2 : caption             3 : status
   4 : visible          5 : height             6 : focus flag          7 : caption class
   8 : subset           9: calling fn (name)  10 : calling fn (params) 11: array of additional fns in the context menu
   12 : base_id (for dynamical reload of the pop-up wnd)
   13 : allow multiple instances of pop-up
   14 : rect obj for popup wnd pos and extents
*/

function circles_lib_plugin_dragstart_override_fn() {}
function circles_lib_plugin_drag_override_fn() {}
function circles_lib_plugin_dragstop_override_fn() {}
function circles_lib_plugin_get_active_wnd()
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _div_id, _caption, _status, _div, _b_sel, startINDEX ;
    for( var _i = 0 ; _i < _len ; _i++ )
    {
        if ( is_array( _array[_i] ) )
        {
           startINDEX = 0 ;
           _unique_id = _array[_i][startINDEX].replaceAll( "#", "" );
           startINDEX++ ;
           _div_id = _array[_i][startINDEX].replaceAll( "#", "" );
           startINDEX++ ;
           _caption = _array[_i][startINDEX] ;
           startINDEX++ ;
           _status = safe_int( _array[_i][startINDEX], 0 ) ;
           if ( _status == OPEN )
           {
          		 return _array[_i] ;
							 break ;
					 }
        }
    }

    return null ;
}

function circles_lib_plugin_get_wnd_from_pos( _x, _y )
{
    var _zINDEX = 0, _rect, _popup_ref = null ;
    $.each( _glob_popups_array, function( _i, _popup )
            {
               _rect = _popup[14] ;
               if ( is_rect( _rect ) && $( "#" + _popup[0] ).zIndex() > _zINDEX )
               {
                   if ( _rect.includes( _x, _y ) ) _popup_ref = _popup ;
               }
            } ) ;
    return is_array( _popup_ref ) ? _popup_ref.clone() : null ;
}

function circles_lib_plugin_is_visible( _base_id, _subset )
{
    _base_id = safe_string( _base_id, "" ).trim(), _subset = safe_string( _subset, "forms" ).trim();
    var _b_visible = 0 ;
    $.each( _glob_popups_array, function( _i, _popup )
            {
               if ( _base_id == _popup[12] && _subset == _popup[8] )
               {
                  _b_visible = 1 ;
                  return false ;
               }
            } ) ;
    return _b_visible ;
}

function circles_lib_plugin_move_wnd( _div_id, _X_TAG, _Y_TAG )
{
    move_div( _div_id, _X_TAG, _Y_TAG );
   	if ( _glob_popup_divs_rec_positions_array[_div_id] != null )
    {
       if ( _X_TAG.length > 0 ) _glob_popup_divs_rec_positions_array[_div_id][0] = _X_TAG ;
       if ( _Y_TAG.length > 0 ) _glob_popup_divs_rec_positions_array[_div_id][1] = _Y_TAG ;
    }
    else _glob_popup_divs_rec_positions_array[_div_id] = [ _X_TAG, _Y_TAG ] ;
}

function circles_lib_plugin_reload_basic_forms( _param_01 )
{
    _param_01 = safe_int( _param_01, UNDET );
    var _base_ids = [ { id : "edit.disk", subset : "forms" }, { id : "seeds.list", subset : "forms" },
                      { id : "geometric.transform", subset : "forms" }, { id : "coordinates", subset : "forms" },
                      { id : "method", subset : "forms" }, { id : "panel.manager", subset : "forms" },
                      { id : "geometric.transform", subset : "forms" } ] ;
                      console.log( _base_ids );
    for( var _p = 0 ; _p < _base_ids.length ; _p++ )
    if ( circles_lib_plugin_find_index( { base_id : _base_ids[_p].id, subset : _base_ids[_p].subset }, POPUP_SEARCH_BY_BASE_ID ) != UNFOUND )
		circles_lib_plugin_load( _base_ids[_p].subset,_base_ids[_p].id, NO, _param_01 );
}

function circles_lib_plugin_hide_all()
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 );
    if ( _len > 0 )
    {
      var startINDEX, _unique_id, _div_id, _caption, _status, _visible, _height ;
      for( var _i = 0 ; _i < _len ; _i++ )
      {
        if ( is_array( _array[_i] ) )
        {
           startINDEX = 0 ;
           _unique_id = _array[_i][startINDEX].replaceAll( "#", "" );
           startINDEX++ ;
           _div_id = _array[_i][startINDEX].replaceAll( "#", "" );
           startINDEX++ ;
           _caption = _array[_i][startINDEX] ;
           startINDEX++ ;
           _status = safe_int( _array[_i][startINDEX], CLOSE );
           startINDEX++ ;
           _visible = safe_int( _array[_i][startINDEX], HIDE );
           startINDEX++ ;
           _height = safe_int( _array[_i][startINDEX], 0 );
           if ( _visible ) circles_lib_forms_show_panel( HIDE, _div_id );
        }
      }
    }
}

function circles_lib_plugin_close_all()
{
    var _array = _glob_popups_array, _len = safe_size( _array, 0 );
    if ( _len > 0 )
    {
        var _unique_id, _caption, _status, _visible, _height, _candidate_close_fn, _subset, _div_id ;
        for( var _i = 0 ; _i < _len ; _i++ )
        {
            if ( is_array( _array[_i] ) )
            {
               startINDEX = 0 ;
               _unique_id = _array[_i][startINDEX].replace(/([A-Z0-9\#])/g, '');
               startINDEX++ ;
               _div_id = _array[_i][startINDEX].replace(/([A-Z0-9\#])/g, '');
               startINDEX = 8 ;
               _subset = _array[_i][startINDEX].replace(/([A-Z0-9\#])/g, '');
               startINDEX = 12 ;
               _base_id = _array[_i][startINDEX] ;
               startINDEX++ ;
               _allow_multiple_instances = _array[_i][startINDEX] ;

               _candidate_close_fn = "CIRCLES" + _subset.toLowerCase() + _base_id.toUpperCase() + "close" ;
               if ( function_exists( _candidate_close_fn ) ) circles_lib_plugin_activate( _allow_multiple_instances, _base_id, "", "", _subset, CLOSE, _array[_i], '', _candidate_close_fn );
               else if ( _subset.stricmp( "embeddings" ) ) circles_lib_plugin_activate( _allow_multiple_instances, _base_id, "", "", _subset, CLOSE, GLOB_PLUGIN_DIV_ID, '', 'PLUGINSpopupCLOSE' );
            }
        }
    }
}

function circles_lib_plugin_deactivate_all( _close )
{
		_close = safe_int( _close, YES );
    var _array = _glob_popups_array, _len = safe_size( _array, 0 );
    var _div_id, _caption, _status, _height, _unknown, _focus_flag, _div, _b_sel, startINDEX, _caption_class, _subset ;
    for( var _i = 0 ; _i < _len ; _i++ )
    {
        if ( is_array( _array[_i] ) )
        {
           /* POPUP OBJ FIELDS MAP
              0 : unique id        1 : div id             2 : caption             3 : status
              4 : visible          5 : height             6 : focus flag          7 : caption class
              8 : subset           9: calling fn (name)  10 : calling fn (params) 11: array for additional fns in the context menu
              12 : base_id (for dynamical reload of the pop-up wnd)
              13 : allow multiple instances of pop-up
           */
           startINDEX = 0 ;
           _unique_id = _array[_i][startINDEX].replaceAll( "#", "" );
           startINDEX++ ;
           _div_id = _array[_i][startINDEX].replaceAll( "#", "" );
           startINDEX++ ;
           _caption = _array[_i][startINDEX] ;
           startINDEX++ ;
           _status = _array[_i][startINDEX] ;
           startINDEX++ ;
           _visible = _array[_i][startINDEX] ;
           startINDEX++ ;
           _height = _array[_i][startINDEX] ;
           startINDEX++ ;
           _focus_flag = _array[_i][startINDEX] ;
           _glob_popups_array[_i][startINDEX] = 0 ; // not focused
           startINDEX++ ;
           _caption_class = _array[_i][startINDEX] ;
           startINDEX++ ;
           _subset = _array[_i][startINDEX] ;
           startINDEX = 12 ;
           _base_id = _array[_i][startINDEX] ;
           startINDEX++ ;
           _allow_multiple_instances = _array[_i][startINDEX] ;
           if ( _close ) circles_lib_plugin_activate( _allow_multiple_instances, _base_id, "", "", _subset, CLOSE, _div_id, _caption );
           _glob_popups_array[_i][startINDEX] = 0 ; // status inactive
        }
    }
}

function circles_lib_plugin_get_list( _fn_str, _html )
{
    _fn_str = safe_string( _fn_str, "" ), _html = safe_int( _html, YES ) ;
    var _array = _glob_popups_array, _len = safe_size( _array, 0 ), _list = _html ? "" : [] ;
    if ( _len > 0 )
    {
       if ( _html )
       {
       _list += "<table WIDTH=\"100%\">" ;
       _list += "<tr><td HEIGHT=\"2\"></td></tr>" ;
       _list += "<tr>" ;
       _list += "<td COLSPAN=\"4\">" ;
       _list += "<table WIDTH=\"100%\">" ;
       _list += "<tr>" ;
       _list += "<td STYLE=\"padding-left:2px;\">Open pop-ups list</td>" ;
       _list += "<td ALIGN=\"right\" TITLE=\"Close\" CLASS=\"link\" STYLE=\"padding-right:2px;\" ONCLICK=\"javascript:circles_lib_plugin_show_list(HIDE);\" WIDTH=\"35\"><IMG SRC=\"%imgpath%icons/close/close.icon.01.12x12.png\"></td>" ;
       _list += "</tr>" ;
       _list += "</table>" ;
       _list += "</td>" ;
       _list += "</tr>" ;
       _list += "<tr><td HEIGHT=\"4\"></td></tr>" ;
       }
       var startINDEX = 0, _chunk, _unique_id, _div_id, _caption, _status, _visible, _height, _unknown, _caption_class, _subset ;
       for( var _i = 0 ; _i < _len ; _i++ )
       {
           _chunk = _array[_i] ;
           if ( _chunk != null )
           {
              startINDEX = 0 ;
              _unique_id = _chunk[startINDEX].replaceAll( "#", "" );
              startINDEX++ ;
              _div_id = _chunk[startINDEX].replaceAll( "#", "" );
              startINDEX++ ;
              _caption = _chunk[startINDEX] ;
              startINDEX++ ;
              _status = safe_int( _chunk[startINDEX], CLOSE );
              startINDEX++ ;
              _visible = safe_int( _chunk[startINDEX], HIDE );
              startINDEX++ ;
              _height = safe_int( _chunk[startINDEX], 0 );
              startINDEX++ ;
              _unknown = safe_int( _chunk[startINDEX], 0 );
              startINDEX++ ;
              _caption_class = _chunk[startINDEX] ;
              startINDEX++ ;
              _subset = _chunk[startINDEX] ;
              startINDEX = 12 ;
              _base_id = _array[_i][startINDEX] ;
              startINDEX++ ;
              _allow_multiple_instances = _array[_i][startINDEX] ;

              if ( _status == OPEN ) _glob_popup_sel_unique_id = _unique_id ;
              if ( _html )
              {
              _list += "<tr STYLE=\"background-color:"+( _status == OPEN ? "#476BAD" : "#EAEAEA" )+";\">" ;
              _list += "<td STYLE=\"padding:4px;color:"+( _status == OPEN ? "white" : "#B0B0B0" )+";\" " ;
              _list += "ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"" ;
              _list += "ONCLICK=\"javascript:circles_lib_plugin_focus('"+_div_id+"',YES,event);\"" ;
              _list += ">"+_caption+"</td>" ;
              if ( _visible ) _list += "<td WIDTH=\"20\" CLASS=\"link\" ONCLICK=\"javascript:circles_lib_forms_show_panel(HIDE,'"+_div_id+"');\"><IMG SRC=\"%imgpath%icons/hide/hide.icon.01.16x16.png\"></td>" ;
              else _list += "<td WIDTH=\"20\" CLASS=\"link\" ONCLICK=\"javascript:circles_lib_forms_show_panel(SHOW,'"+_div_id+"');\"><IMG SRC=\"%imgpath%icons/eye/eye.01.16x16.png\"></td>" ;
              _list += "<td WIDTH=\"20\" CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_activate( "+_allow_multiple_instances+", '"+_base_id+"', '', '', '"+_subset+"', CLOSE, '"+_div_id+"','');\"><IMG SRC=\"%imgpath%icons/delete/delete.icon.16x16.png\"></td>" ;
              _list += "</tr><tr><td HEIGHT=\"1\"></td></tr>" ;
              }
              else _list.push( _caption ) ;
           }
       }

       if ( _html )
       {
          _list += "</table>" ;
          _list = _list.replaceAll( "%imgpath%", _glob_path_to_img );
       }
    }

    return [ _list, _len ] ;
}

function circles_lib_plugin_show_list( bSHOW )
{
    var _statusbar_popup_id = "STATUSBARpopuplist" ;
    var _status_box = $("#" + _statusbar_popup_id ).get(0);
    if ( _status_box != null )
    {
       var _ret_chunk = circles_lib_plugin_get_list( "circles_lib_plugin_focus_render( YES, YES )" );
       var _ret_html = is_array( _ret_chunk ) ? _ret_chunk[0] : "" ;
       var _ret_popups_n = is_array( _ret_chunk ) ? Math.max( 0, safe_int( _ret_chunk[1], 0 ) ) : "" ;
       if ( bSHOW && _ret_popups_n > 0 )
       {
       		 var _div = $("#POPUPDIVSarrayDIV").get(0) != null ? $("#POPUPDIVSarrayDIV").get(0) : document.createElement('div');
           var _top = ( $( "#" + _statusbar_popup_id ).offset() )["top"] ;
           var _left = ( $( "#" + _statusbar_popup_id ).offset() )["left"] ;
           if ( _div != null )
           {
               document.body.appendChild( _div );
               var _div_height = 110, _div_width = "auto" ;
               _div.id = "POPUPDIVSarrayDIV" ;
               _div.style.position = "absolute" ;
               _div.style.opacity = DEFAULT_OPACITY ;
               _div.style.filter = "alpha(opacity="+DEFAULT_OPACITY*100+");" ;
               _div.style.left = _left + "px" ;
               _div.style.top = ( _top - ( 5 + _div_height ) ) + "px" ;
               _div.style.height = _div_height + "px" ;
               _div.style.width = _div_width + "px" ;
               _div.style.backgroundColor = "white" ;
               _div.style.zIndex = circles_lib_plugin_get_max_zindex() + 1 ;
               _div.style.padding = "1px" ;
               _div.style.overflow = "auto" ;
               _div.innerHTML = _ret_code[0] ;
               _div.setAttribute( "class", "popup_wnd" );
               _div.style.display = "block" ;
           }
       }
       else if ( $("#POPUPDIVSarrayDIV").get(0) != null ) document.body.removeChild( $("#POPUPDIVSarrayDIV").get(0) );
    }
}

function circles_lib_plugin_normalize( _div_id, _resize_fns )
{
    var _resize_fns_array = _resize_fns.includes( "|" ) ? _resize_fns.split( "|" ) : [] ;
    var _fn_name = _resize_fns_array[0] != null ? safe_string( _resize_fns_array[0], "" ) : "" ;
    var _calling_div_id = _resize_fns_array[1] != null ? safe_string( _resize_fns_array[1], "" ) : "" ;
    var _w_type = "", _h_type = "" ;
    var _div_w = _resize_fns_array[2] != null ? safe_string( _resize_fns_array[2], "" ) : "0" ;
 		if ( !_div_w.end_with( "%" ) && !_div_w.stricmp( "auto" ) )
		{
				_div_w += "px" ;
				_w_type = "num" ;
 	  }
		else _w_type = "not_num" ;
    var _div_h = _resize_fns_array[3] != null ? safe_string( _resize_fns_array[3], "" ) : "0" ;
 		if ( !_div_h.end_with( "%" ) && !_div_h.stricmp( "auto" ) )
		{
				_div_h += "px" ;
				_h_type = "num" ;
		}
		else _w_type = "not_num" ;
    if ( _w_type == "num" && _div_w == 0 ) _div_w = _glob_popup_divs_rec_default_metrics_array[''+_div_id] != null ? _glob_popup_divs_rec_default_metrics_array[''+_div_id][0] : 0 ;
    if ( _h_type == "num" && _div_h == 0 ) _div_h = _glob_popup_divs_rec_default_metrics_array[''+_div_id] != null ? _glob_popup_divs_rec_default_metrics_array[''+_div_id][1] : 0 ;
    
    var _jquery_id = "#"+_div_id ;

    $(_jquery_id).css( "overflow", "hidden" );
    $(_jquery_id).css( "width", _div_w );
    $(_jquery_id).css( "height", _div_h );
    $(_jquery_id+"_caption_container" ).css( "width", _div_w );
    $(_jquery_id+"_caption" ).css( "width", _div_w );
    _resize_fns = safe_string( _resize_fns, "" );
    if ( safe_size( _resize_fns, 0 ) > 0 && _resize_fns.includes( "|" ) )
    {
        var _args = _resize_fns.split( "|" ).concat( [ $( _jquery_id ).css( "width" ), $( _jquery_id ).css( "height" ) ] );
        if ( is_array( _args ) )
        {
           var _fn = _args[0] + "( "+( _args.from_to( 1, _args.length - 1 ).work( function( _item ) { return "'"+_item+"'" ; } ).join( "," ) )+" )" ;
           //if ( typeof _args[0] === "function" )
           try { eval( _fn ); } catch( _err ) { circles_lib_error_obj_handler( _err ); }
        }
    }
}

function circles_lib_plugin_minimize( _div_id, _resize_fns )
{
    _div_id = safe_string( _div_id, "" );
    var _jquery_id = "#" + _div_id ;
    $( _jquery_id ).css( "width", CIRCLES_POPUP_MINIMIZE_WIDTH + "px" );
    $( _jquery_id ).css( "height", CIRCLES_POPUP_MINIMIZE_HEIGHT + "px" );
    $( _jquery_id +"_caption_container" ).css( "width", CIRCLES_POPUP_MINIMIZE_WIDTH + "px" );
    $( _jquery_id +"_caption" ).css( "width", ( CIRCLES_POPUP_MINIMIZE_WIDTH ) + "px" );
    $( _jquery_id ).css( "overflow", "hidden" );
    _resize_fns = safe_string( _resize_fns, "" );
    if ( safe_size( _resize_fns, 0 ) > 0 && _resize_fns.includes( "|" ) )
    {
         var _args = _resize_fns.split( "|" ).concat( [ $( _jquery_id ).css( "width" ), $( _jquery_id ).css( "height" ) ] );
         if ( is_array( _args ) )
         {
              var _fn = _args[0] + "( "+( _args.from_to( 1, _args.length - 1 ).work( function( _item ) { return "'"+_item+"'" ; } ).join( "," ) )+" )" ;
              try { eval( _fn ); } catch( _err ){ circles_lib_error_obj_handler( _err ); }
         }
    }
}

function circles_lib_plugin_maximize( _div_id, _resize_fns )
{
    _div_id = safe_string( _div_id, "" );
    var _jquery_id = "#" + _div_id, _viewport_dims = getViewportExtents();
    $( _jquery_id ).css( "left", CIRCLES_VIEWPORT_LEFT_MARGIN + "px" );
    $( _jquery_id ).css( "width", ( _viewport_dims[0] - CIRCLES_VIEWPORT_LEFT_MARGIN * 4 ) + "px" );
    $( _jquery_id ).css( "height", "auto" );
    $( _jquery_id + "_caption_container" ).css( "width", ( _viewport_dims[0] - CIRCLES_VIEWPORT_LEFT_MARGIN * 4 ) + "px" );
    $( _jquery_id + "_caption" ).css( "width", ( _viewport_dims[0] - CIRCLES_VIEWPORT_LEFT_MARGIN * 4 ) + "px" );
    $( _jquery_id ).css( "overflow", "hidden" );
    _resize_fns = safe_string( _resize_fns, "" );
    if ( safe_size( _resize_fns, 0 ) > 0 && _resize_fns.includes( "|" ) )
    {
        var _args = _resize_fns.split( "|" ).concat( [ $( _jquery_id ).css( "width" ), $( _jquery_id ).css( "height" ) ] );
        if ( is_array( _args ) )
        {
            var _fn = _args[0] + "( "+( _args.from_to( 1, _args.length - 1 ).work( function( _item ) { return "'"+_item+"'" ; } ).join( "," ) )+" )" ;
            try { eval( _fn ); } catch( _err ){ circles_lib_error_obj_handler( _err ); }
        }
    }
}

function circles_lib_plugin_add_contextmenu_entry( _base_id, _menu_label_entry, _fn_name, _fn_args_array )
{
		_base_id = safe_string( _base_id, POPUP_NO_ID );
		_menu_label_entry = safe_string( _menu_label_entry, "" );
		_fn_name = safe_string( _fn_name, "" ) ;
    if ( !is_array( _fn_args_array ) ) _fn_args_array = [] ;
		var _entry_array_ref = circles_lib_plugin_find_wnd( { base_id : _base_id }, POPUP_SEARCH_BY_BASE_ID, YES ) ;
		var _context_menu_entry_array = _entry_array_ref[11] ;
		if ( is_array( _context_menu_entry_array ) && _menu_label_entry.length > 0 && _fn_name.length > 0 )
		{
				var _b_ok = NO, _entries_n = safe_size( _context_menu_entry_array, 0 ) ;
        if ( _entries_n > 0 )
        {
  				$.each( _context_menu_entry_array,
  								function( _i, _chunk )
  								{
  									if ( _chunk[0].stricmp( _menu_label_entry ) )
  									{
  										_b_ok = YES;
  										return NO ;
  									}
  								} ) ;
        }
				if ( !_b_ok ) _context_menu_entry_array.push( [ _menu_label_entry, _fn_name, _fn_args_array.clone() ] );
		}
}