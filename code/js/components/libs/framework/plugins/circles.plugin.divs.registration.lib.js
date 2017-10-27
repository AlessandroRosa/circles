/* POPUP OBJ FIELDS MAP
   0 : unique id        1 : div id             2 : caption             3 : status
   4 : visible          5 : height             6 : focus flag          7 : caption class
   8 : subset           9: calling fn (name)  10 : calling fn (params) 11: array of additional fns in the context menu
   12 : base_id (for dynamical reload of the pop-up wnd)
   13 : allow multiple instances of pop-up
   14 : rect obj for popup wnd pos and extents
*/

function circles_lib_set_caption_text( _div_id, _caption_text )
{
    _caption_text = safe_string( _caption_text, "" ).trim();
    if ( _caption_text.length == 0 ) return NO ;
    var _caption_id = "PLUGIN"+_div_id+"CAPTION" ;
    if ( $("#"+_caption_id).get(0) != null )
    {
       $("#"+_caption_id).html( _caption_text );
       return YES ;
    }
    else return -1 ;
}

function circles_lib_plugin_caption_code( _run, _title, _caption_colspan, _arrows,
				 _append_fns_at_close, _width, _height, _caller_fn,
				 _base_id, _div_id, _subset, _iconpath, _focus_fn,
				 _help_fn, _fns_group_label,
				 _normalize_fns, _minimize_fns, _maximize_fns )
{
    _run = safe_int( _run, NO ), _div_id = safe_string( _div_id, "" );
    _iconpath = safe_string( _iconpath, "" );
    _fns_group_label = safe_string( _fns_group_label, "" );
    var _popup_wnd_width = _width ; // save the original input data
    var _div_label = _div_id.replaceAll( [ "POPUP", "DIV" ], "" );
    if ( _width != "100%" ) _width = safe_int( _width, "100%" );
    if ( _height != "100%" ) _height = safe_int( _height, "100%" );
    if ( !is_array( _normalize_fns ) ) _normalize_fns = [ "", _div_id, _width, _height ] ;

    _glob_popup_divs_rec_default_metrics_array[''+_div_id] = [ _width ] ;
    
    _caption_colspan = safe_int( _caption_colspan, 1 ), _arrows = safe_int( _arrows, 1 );
    _caller_fn = safe_string( _caller_fn, "" );
    _focus_fn = safe_string( _focus_fn, "" );
    _append_fns_at_close = safe_string( _append_fns_at_close, "" );
    _help_fn = safe_string( _help_fn, "" );
		_title = _title.length > 70 ? _title.substr( 0, 65 ) + "&nbsp;.." : _title ;

		var _clean_base_id = safe_string( _base_id, "" ).replace( /[\.\_\-]/g, "" ).toUpperCase();
    var METHODstr = circles_lib_method_get_def( _glob_method );
    var _check_method = circles_lib_method_check();
    var _sub_method_desc = ( _glob_method == METHOD_ALGEBRAIC && _plugin_last_ref.length > 0 ) ? _plugin_definitions_array[_plugin_last_ref] : "" ;
    if ( !is_string( _sub_method_desc ) ) _sub_method_desc = "Description not available" ;
		else _sub_method_desc = _sub_method_desc.length > 30 ? _sub_method_desc.substr( 0, 34 ) + "&nbsp;.." : _sub_method_desc ;

    // if playing with inversion circle is active, then it is also switched off whenever a panel is displayed
    if ( _glob_play_inversion ) circles_lib_forms_play_inversion(NO,YES);
    var ONHIDE_FN = "_glob_popup_mask ^= 1;circles_lib_forms_show_panel( HIDE,'"+_div_id+"');" ;
    var ONCLOSE_FN = "circles_lib_plugin_activate( NO, '"+_base_id+"', '', '', '"+_subset+"',CLOSE,'"+_div_id+"','','"+_append_fns_at_close+"');" ;
    if ( _fns_group_label.length > 0 ) ONCLOSE_FN += "unload_fns( window, '', '"+_fns_group_label+"', NO );" ;
    var _caller_fn_name = _fns_group_label ;

    _width -= 8 ;
    var HTMLcode = "" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td ID=\""+_div_id+"_caption_container\" COLSPAN=\""+_caption_colspan+"\" VALIGN=\"top\" WIDTH=\"100%\" HEIGHT=\"28\">" ;
    HTMLcode += "<table ID=\""+_div_id+"_caption\" WIDTH=\"100%\" CLASS=\""+( _run ? "popup_caption_bk_enabled" : "popup_caption_bk_alert" )+"\">" ;
    HTMLcode += "<tr>" ;
    if ( _iconpath.length > 0 )
    {
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td WIDTH=\"20\"><IMG SRC=\"%imgpath%icons/"+_iconpath+"\"></td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
    }
    else HTMLcode += "<td WIDTH=\"3\"></td>" ;

    HTMLcode += "<td ID=\"PLUGIN"+_div_id+"CAPTION\" " ;
    HTMLcode += " ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"" ;
    if ( _focus_fn.not_includes( "circles_lib_plugin_focus" ) )
    _focus_fn = "circles_lib_plugin_focus('"+_div_id+"');" ;

    HTMLcode += " ONCLICK=\"javascript:"+_focus_fn+";\"" ;
    HTMLcode += " ONMOUSEDOWN=\"javascript:$('#"+_div_id+"').draggable('enable');\"" ;
    HTMLcode += " ONMOUSEUP=\"javascript:$('#"+_div_id+"').draggable('disable');\"" ;
    HTMLcode += " ONDBLCLICK=\"javascript:circles_lib_plugin_normalize('"+_div_id+"', '"+( is_array( _normalize_fns ) ? _normalize_fns.join("|") : "" )+"');\"" ;
    HTMLcode += " CLASS=\"popup_caption_label\">"+_title+"</td>" ;

    if ( _help_fn.length > 0 )
    {
       if ( !( _help_fn.includes( "(" ) ) && !( _help_fn.includes( ")" ) ) ) _help_fn += "()" ;
       HTMLcode += "<td CLASS=\"popup_caption_btn\" ONCLICK=\"javascript:"+_help_fn+";\"><IMG TITLE=\"Info\" SRC=\"%imgpath%icons/questionmark/question.mark.icon.01.20x20.png\"></td>" ;
       HTMLcode += "<td WIDTH=\"2\"></td>" ;
    }

 		HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"popup_caption_btn\" ONCLICK=\"javascript:circles_lib_plugin_maximize('"+_div_id+"', '"+( is_array( _maximize_fns ) ? _maximize_fns.join("|") : "" )+"');\"><IMG TITLE=\"Maximize Window\" SRC=\"%imgpath%icons/wnd/maximize.icon.01.20x20.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
		HTMLcode += "<td CLASS=\"popup_caption_btn\" ONCLICK=\"javascript:circles_lib_plugin_minimize('"+_div_id+"', '"+( is_array( _minimize_fns ) ? _minimize_fns.join("|") : "" )+"');\"><IMG TITLE=\"Minimize Window\" SRC=\"%imgpath%icons/wnd/minimize.icon.01.20x20.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
	  HTMLcode += "<td CLASS=\"popup_caption_btn\" ONCLICK=\"javascript:circles_lib_plugin_normalize('"+_div_id+"', '"+( is_array( _normalize_fns ) ? _normalize_fns.join("|") : "" )+"');\"><IMG TITLE=\"Normalize Window\" SRC=\"%imgpath%icons/wnd/normalize.icon.01.20x20.png\"></td>" ;

    if ( _arrows )
    {
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"popup_caption_btn\" ONCLICK=\"javascript:circles_lib_plugin_move_wnd( '"+_div_id+"', '', 'TOP' );\"><IMG TITLE=\""+_CAPTION_BTN_03+"\" SRC=\"%imgpath%icons/bullets/bullet.up.20x20.png\"></td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"popup_caption_btn\" ONCLICK=\"javascript:circles_lib_plugin_move_wnd( '"+_div_id+"', '', 'BOTTOM' );\"><IMG TITLE=\""+_CAPTION_BTN_04+"\" SRC=\"%imgpath%icons/bullets/bullet.down.20x20.png\"></td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"popup_caption_btn\" ONCLICK=\"javascript:circles_lib_plugin_move_wnd( '"+_div_id+"', 'LEFT', '' );\"><IMG TITLE=\""+_CAPTION_BTN_01+"\" SRC=\"%imgpath%icons/bullets/bullet.left.20x20.png\"></td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td CLASS=\"popup_caption_btn\" ONCLICK=\"javascript:circles_lib_plugin_move_wnd( '"+_div_id+"', 'RIGHT', '' );\"><IMG TITLE=\""+_CAPTION_BTN_02+"\" SRC=\"%imgpath%icons/bullets/bullet.right.20x20.png\"></td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
    }

    HTMLcode += "<td CLASS=\"popup_caption_btn\" ONCLICK=\"javascript:"+ONCLOSE_FN+"\"><IMG TITLE=\""+_CAPTION_BTN_07+"\" SRC=\"%imgpath%icons/close/close.icon.01.20x20.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\" HEIGHT=\"16\" ID=\""+_div_id+"_method\" COLSPAN=\""+_caption_colspan+"\" CLASS=\"popup_method\">" ;
    HTMLcode += "<table HEIGHT=\"16\">" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td ALIGN=\"center\">Method</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td ID=\""+_div_id+"_captionmethod\"><b STYLE=\"color:"+( _check_method ? DEFAULT_COLOR_STD : DEFAULT_COLOR_ERROR )+";\">"+METHODstr+"</b></td>" ;
    HTMLcode += "<td WIDTH=\"25\"></td>" ;
    HTMLcode += "<td ID=\""+_div_id+"_sliderbox\" WIDTH=\"80\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
    return HTMLcode ;
}

function circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, contents, _class, _zIndex, _bind_events, _top )
{
    _zIndex = safe_int( _zIndex, 10 ), _bind_events = safe_int( _bind_events, YES );
    _top = safe_int( _top, 100 ), _class = safe_string( _class, "popup_wnd" );
    WIDTH = Math.max( safe_int( WIDTH, 0 ), 0 ), HEIGHT = Math.max( safe_int( HEIGHT, 0 ), 0 ) ;
    var _div = $("#"+_div_id ).get(0);
        _div = _div == null ? document.createElement("div") : _div ;
    if ( _div != null )
    {
      _glob_wnd_id = _div_id, _glob_wnd = _div ;
      document.body.appendChild( _div );
      _div.id = _div_id ;
      _div.style.filter = "alpha(opacity="+DEFAULT_OPACITY*100+");" ;
      _div.style.position = "absolute" ;
      _div.style.padding = "4px" ;
      _div.setAttribute( "class", _class );

      $("#"+_div_id).prop( "opacity", DEFAULT_OPACITY );
      $("#"+_div_id).css( "width", safe_int( WIDTH, 0 ) > 0 ? WIDTH + "px" : "auto" );
      $("#"+_div_id).css( "height", safe_int( HEIGHT, 0 ) > 0 ? HEIGHT + "px" : "auto" );
      $("#"+_div_id).css( "background-color", "white" );
      $("#"+_div_id).css( "top", _top+"px" );
      $("#"+_div_id).zIndex( _zIndex );
      $("#"+_div_id).html( contents );
      $("#"+_div_id).prop( "display", "none" );

      if ( _bind_events )
      $("#"+_div_id).bind( 'mousedown focus', function(e)
      {
        if ( e != null )
        {
          if ( e.originalEvent != null )
          {
            var _tag = safe_string( e.originalEvent.srcElement.tagName, "" ).toLowerCase();
            var _type = safe_string( e.originalEvent.srcElement.type, "" ).toLowerCase();
            if ( !_tag.is_one_of( "input", "select", "textarea" ) && !_type.is_one_of( "checkbox", "textarea" ) )
            {
              e.stopPropagation();
              e.cancelBubble = true;
              e.preventDefault();
            }
            circles_lib_plugin_focus( _div_id, YES, e );
          }
        }
      } );
    }
    return _div ;
}

function circles_lib_plugin_destroy_wnd( _div_id )
{
    var _popup_chunk = circles_lib_plugin_find_wnd( { div_id : _div_id }, POPUP_SEARCH_BY_DIV_ID );
    if ( !is_array( _popup_chunk ) ) return NO ;
    else
    {
      var _ret_index = circles_lib_plugin_find_index( { div_id : _div_id }, POPUP_SEARCH_BY_DIV_ID ) ;
      if ( !_div_id.start_with( "#" ) ) _div_id = "#" + _div_id ;
      if ( $( _div_id ).get(0) != null )
      {
        var _node_obj = document.body.removeChild( $( _div_id ).get(0) ) ;
        if ( _node_obj == null ) return NO ;
        if ( _ret_index != UNFOUND )
        {
          circles_lib_plugin_delete_from_archive( _ret_index );
          _glob_wnd_id = "", _glob_wnd = null ;
          return YES ;
        }
        else return NO ;
      }
      else return NO ;
    }
}

function circles_lib_plugin_register( _calling_params, _div_id, _caption, _status, _visible, _caption_class, _subset, _base_id, _allow_multiple_instances )
{
    if ( !is_array( _calling_params ) ) _calling_params = [ "", "" ] ;
    _div_id = safe_string( _div_id, "" ).trim();
    _caption = safe_string( _caption, "" ).trim();
    _status = safe_int( _status, CLOSE ), _visible = safe_int( _visible, HIDE );
    _subset = safe_string( _subset, "forms" ).trim();
    _base_id = safe_string( _base_id, "" ).trim();
    _allow_multiple_instances = safe_int( _allow_multiple_instances, NO );
    var _unique_id = safe_string( "POPUP"+unixtime(), POPUP_NO_ID ).trim();
    var _focused = 0, _idx = circles_lib_plugin_find_index( _unique_id, POPUP_SEARCH_BY_UNIQUE_ID ) ;

    if ( _idx == UNFOUND || _allow_multiple_instances )
    _glob_popups_array.push( [ _unique_id, _div_id, _caption,
                               _status, _visible, 0, NO,
                               _caption_class, _subset,
                               _calling_params[0], _calling_params[1],
                               [ /*to keep context menu fns array*/ ],
                               _base_id,
                               _allow_multiple_instances,
                               new rect()
                             ]
                           );
    return _glob_popups_array.get_last() ;
}

function circles_lib_plugin_activate( _allow_multiple_instances, _base_id, _calling_fn, _calling_args,
								_subset, _b_open, _div_id, _caption, _append_fns_at_close,
					      _normalize_fns, _minimize_fns, _maximize_fns, _caption_class )
{
		var _tmp_args = [] ; for( var _a = 0 ; _a < _calling_args.length ; _a++ ) _tmp_args.push( _calling_args[_a] );
				_calling_args = _tmp_args.work( function( _tok ) { return "'"+( ( new String( _tok ) ).addslashes() )+"'" ; } ) ;
		var _calling_params = [ _calling_fn, _calling_args.join( "," ) ] ;

    _b_open = safe_int( _b_open, OPEN );
    if ( !_b_open ) _glob_popup_mask ^= 1;
    _allow_multiple_instances = safe_int( _allow_multiple_instances, NO );
    _base_id = safe_string( _base_id, "" ).trim();
    _div_id = safe_string( _div_id, "" );
    _caption = safe_string( _caption, "" ).trim();
    _append_fns_at_close = safe_string( _append_fns_at_close, "" ).trim();
    _subset = safe_string( _subset, "forms" ).trim();
    _caption_class = safe_string( _caption_class, "popup_caption_bk_enabled" ).trim();
    var _close = ( !_b_open && _append_fns_at_close.length > 0 ) ? eval( _append_fns_at_close ) : YES ;
    if ( !_close ) return ;

    _div_id = _div_id.replaceAll( "#", "" ) ;
    var _fn = function() { circles_lib_plugin_destroy_wnd( _div_id ) } ;
    _b_open ? $("#"+_div_id).slideDown("slow") : $("#"+_div_id).slideUp("fast", _fn );

    if ( !_b_open ) hideCOLORTABLE();
    else _glob_popup_sel_unique_id = _div_id ;

    var _index = circles_lib_plugin_find_index( { div_id : _div_id }, POPUP_SEARCH_BY_DIV_ID, _caption );
    var _popup_obj = null ;
    if ( _b_open )
    {
      if ( _index == UNFOUND || _allow_multiple_instances )
      {
        circles_lib_plugin_set_property_to_all_entries( 0, POPUP_SEARCH_BY_STATUS );
        _popup_obj = circles_lib_plugin_register( _calling_params, _div_id, _caption, OPEN, SHOW, _caption_class, _subset, _base_id, _allow_multiple_instances );
      }
      else
      {
        _glob_popups_array[_index][2] = _caption ;
        _glob_popups_array[_index][3] = OPEN ;
        _glob_popups_array[_index][4] = SHOW ;
        _popup_obj = _glob_popups_array[_index].clone() ;
      }
    }
    else if ( _index != UNFOUND )
    {
      _popup_obj = is_array( _glob_popups_array[_index] ) ? _glob_popups_array[_index].clone() : null ;
      circles_lib_plugin_delete_from_archive( _index );
    }

    var _unique_id = safe_string( is_array( _popup_obj ) ? _popup_obj[0] : POPUP_NO_ID, POPUP_NO_ID );
    circles_lib_statusbar_update_list_icon();
    if ( _b_open ) circles_lib_plugin_focus_render( YES, YES );

    $("#"+_div_id).draggable(
    {
        start: function() { circles_lib_plugin_dragstart_override_fn(); },
        drag: function() { circles_lib_plugin_drag_override_fn(); },
        stop: function()
              {
                 var _left = $("#"+_div_id).css( "left" );
                 var _top = $("#"+_div_id).css( "top" );
                 var _width = $("#"+_div_id).width();
                 var _height = $("#"+_div_id).height();
                 _index = circles_lib_plugin_find_index( _div_id, POPUP_SEARCH_BY_DIV_ID | POPUP_SEARCH_BY_BASE_ID | POPUP_SEARCH_BY_UNIQUE_ID, _caption );
                 if ( _index != UNFOUND ) _glob_popups_array[_index][14].width_height_constructor( _left, _top, _width, _height, _RECT_ORIENTATION_SCREEN );
                 circles_lib_plugin_dragstop_override_fn();
              }
    } );

    $("#"+_div_id).draggable('disable');
		if ( _b_open )
		{
			_glob_popup_sliderCTRLarray[_div_id] = new dhtmlxSlider( _div_id+"_sliderbox", 80, "ball", NO, 30, DEFAULT_MAX_OPACITY * 100.0, DEFAULT_MAX_OPACITY * 100.0, 1 );
	    if ( _glob_popup_sliderCTRLarray[_div_id] != null )
	    {
        _glob_popup_sliderCTRLarray[_div_id].setImagePath( _glob_path_to_img + "ctrls/slider/" );
        _glob_popup_sliderCTRLarray[_div_id].init();
        _glob_popup_sliderCTRLarray[_div_id].attachEvent( "onSlideEnd", function() { circles_lib_extras_sliderctrl_set_wnd_opacity( _div_id+"_sliderbox", YES ) } );
	    }
		}
    else if ( !_b_open && _glob_popup_divs_rec_positions_array[ _div_id ] != null ) _glob_popup_divs_rec_positions_array.remove_key( _div_id );

    // bind events
    if ( $("#"+_div_id).get(0) != null && _b_open )
    {
  	  $("#"+_div_id).get(0).onmousedown = function( event ) { POPUPSDIVonmousedown( _div_id, event, _append_fns_at_close, _normalize_fns, _minimize_fns, _maximize_fns, _calling_fn, _calling_args ); }
  	  $("#"+_div_id).get(0).onmouseup = function( event ) { POPUPSDIVonmouseup( _div_id, event, _append_fns_at_close, _normalize_fns, _minimize_fns, _maximize_fns, _calling_fn, _calling_args ); }
  	  $("#"+_div_id).get(0).oncontextmenu = function( event ) { return POPUPSDIVoncontextmenu( _unique_id, this.id, event ); }
		}

    if ( !_b_open && $( "#"+_div_id ).get(0) != null )
    circles_lib_plugin_destroy_wnd( _div_id );
    var _n = circles_lib_plugin_find_index( { base_id : _base_id }, POPUP_SEARCH_BY_BASE_ID, 0 ) ;
    // de-allocates all functions associated to the pop-up
    // (if multiple instances have been init, then the removal process applies to the last instance)
    // (so that it always applies for all single instance pop-ups)
    if ( !_b_open && _n != UNFOUND )
    {
      var PREFIX = "CIRCLES" + _subset.toLowerCase() + _base_id.toUpperCase();
      for( var _v in window ) if ( _v.start_with( PREFIX ) ) { eval( "window." + _v + " = null ;" ); }
    }

    if ( !_b_open ) GLOB_PLUGIN_SUBSET = GLOB_PLUGIN_BASE_ID = "" ;
}