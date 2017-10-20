function circles_lib_update_menu_grid_entries( _type )
{
    var _items_array = [];
    if ( _type.is_one_of( Z_PLANE, ALL_PLANES ) )
    _items_array.push( "" + "MENU_SHOW_HIDE_AXES" );
    else if ( _type.is_one_of( BIP_BOX, W_PLANE ) )
    _items_array.push( "" + "MENU_SHOW_HIDE_SYMBOLS_WPLANE" );

    var _switch_var = 0 ;
    if ( _type.is_one_of( Z_PLANE, ALL_PLANES ) ) _switch_var = _glob_show_grid_zplane ;
    else if ( _type.is_one_of( BIP_BOX, W_PLANE ) ) _switch_var = _glob_show_grid_wplane ;

    var _items_array_length = safe_size( _items_array, 0 ), ID, _label ;
    for( var d = 0 ; d < _items_array_length ; d++ )
    ID = _items_array[d], _label = $("#"+ID ).html( "<a>" + ( _switch_var ? "Hide Axes" : "Show Axes" ) + "</a>" );
}

function circles_lib_menu_resize_top()
{
    var _box_n = $("[id^=MENU_MAIN_]").length, _sw = $(window).width() * _glob_masterdiv_width_percentage / 100.0 ;
    var _box_w = _box_n > 0 ? Math.floor( _sw / _box_n ) : 80 ;
    var _flag = _sw < 670 ? 1 : 0 ;
    var _font_size = _flag ? 7 : 8 ;
    
    $("#menu").width( _sw );
    $("[id^=MENU_MAIN_]").each( function( _i, _tok )
		{
				if ( _tok.innerText.trim().length > 0 )
				{
						$( "#" + _tok.id ).css( "padding", _flag ? "5 5" : "5 18" ) ;
						if ( _flag ) $( "#" + _tok.id ).width( "auto" );
				}
		} );

    $("[id^=MENU_MAIN_]").css( "font-size", _font_size + "pt" );
    $("[id^=MENU_MAIN_INFOS]").width( _sw < 730 ? 20 : 30 );
    
    if ( _sw < 310 ) $( "#nav" ).css( "height", 64 ) ;
    else if ( _sw < 580 ) $( "#nav" ).css( "height", 44 ) ;
    else $( "#nav" ).css( "height", 24 ) ;
}

function circles_lib_menu_show_top( _output_channel )
{
    _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _b_show = $("#CIRCLEScheckboxMENU").is( ":checked" ) ? YES : NO ;
    _b_show ? $("#menu").slideDown("slow", function() { circles_lib_refresh_main_canvases(); } ) : $("#menu").slideUp("slow", function() { circles_lib_refresh_main_canvases(); } );
    $("#menucontainer").css( "height", ( _b_show ? "26" : "0" ) + "px" );
    return [ RET_OK, "Top menu is " + ( _b_show ? "" : "not " ) + "visible" ];
}

function circles_lib_menu_entries_init()
{
    _glob_menu_entries_array = [];
    
    _glob_menu_entries_array.push( { id : "MENU_INTERFACE_TOGGLE", cmp1 : "_glob_interface_show", cmp2 : YES, toggleOn : "Hide interface", toggleOff : "Show interface", mask : 0, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_COSTRUCTION_MODE_TILING", cmp1 : "_glob_construction_mode", cmp2 : CONSTRUCTION_TILING, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_COSTRUCTION_MODE_LIMITSET", cmp1 : "_glob_construction_mode", cmp2 : CONSTRUCTION_LIMITSET, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_METHOD_INVERSION", cmp1 : "_glob_method", cmp2 : METHOD_INVERSION, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_METHOD_ALGEBRAIC", cmp1 : "_glob_method", cmp2 : METHOD_ALGEBRAIC, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ENTITY_ISOMETRIC_CIRCLE", cmp1 : "_glob_drawentity", cmp2 : DRAWENTITY_ISOMETRIC_CIRCLE, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ENTITY_INVERSION_CIRCLE", cmp1 : "_glob_drawentity", cmp2 : DRAWENTITY_INVERSION_CIRCLE, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ENTITY_PIXEL", cmp1 : "_glob_drawentity", cmp2 : DRAWENTITY_PIXEL, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ENTITY_POINT", cmp1 : "_glob_drawentity", cmp2 : DRAWENTITY_POINT, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_SHOW_HIDE_AXES_ZPLANE", cmp1 : "_glob_show_grid_zplane", cmp2 : YES, toggleOn : "Show grid", toggleOff : "Show grid", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_SHOW_HIDE_AXES_WPLANE", cmp1 : "_glob_show_grid_wplane", cmp2 : YES, toggleOn : "Show grid", toggleOff : "Show grid", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_SHOW_HIDE_SYMBOLS_ZPLANE", cmp1 : "_glob_show_symbols_zplane", cmp2 : YES, toggleOn : "Show symbols", toggleOff : "Show symbols", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_SHOW_HIDE_SYMBOLS_WPLANE", cmp1 : "_glob_symbols_display_wplane", cmp2 : YES, toggleOn : "Show symbols", toggleOff : "Show symbols", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_FIXEDPOINTS_IO_INPUT", cmp1 : "_glob_fixedpt_io", cmp2 : FIXEDPOINTS_IO_INPUT, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ITEM_SEEDS", cmp1 : "_glob_items_switch", cmp2 : ITEMS_SWITCH_SEEDS, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ITEM_GENS", cmp1 : "_glob_items_switch", cmp2 : ITEMS_SWITCH_GENS, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENUPROCESS_BREADTHFIRST", cmp1 : "_glob_process", cmp2 : PROCESS_BREADTHFIRST, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_PROCESS_INDEXSEARCH", cmp1 : "_glob_process", cmp2 : PROCESS_INDEXSEARCH, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_PROCESS_RANDOM", cmp1 : "_glob_process", cmp2 : PROCESS_RANDOM, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_NOFORMAT_EXPORT", cmp1 : "_glob_export_format", cmp2 : EXPORT_NONE, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_SVG_EXPORT", cmp1 : "_glob_export_format", cmp2 : EXPORT_SVG, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_PS_EXPORT", cmp1 : "_glob_export_format", cmp2 : EXPORT_PS, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_EPS_EXPORT", cmp1 : "_glob_export_format", cmp2 : EXPORT_EPS, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_LATEX_EXPORT", cmp1 : "_glob_export_format", cmp2 : EXPORT_LATEX, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_INITMASK_DISKS", cmp1 : "_glob_init_mask", cmp2 : INIT_FROM_DISKS, toggleOn : "", toggleOff : "", mask : 1, operator : " & " } );
    _glob_menu_entries_array.push( { id : "MENU_INITMASK_MAPS", cmp1 : "_glob_init_mask", cmp2 : INIT_FROM_MAPS, toggleOn : "", toggleOff : "", mask : 1, operator : " & " } );
    _glob_menu_entries_array.push( { id : "MENU_INITMASK_SINGLY", cmp1 : "_glob_init_mask", cmp2 : INIT_SINGLE_ITEMS, toggleOn : "", toggleOff : "", mask : 1, operator : " & " } );
    _glob_menu_entries_array.push( { id : "MENU_ITEM_DISKS_DRAW", cmp1 : "_glob_zplaneMOUSEprocSWITCH", cmp2 : MOUSE_DRAWDISKS_PROC_ID, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ITEM_DISKS_SEL", cmp1 : "_glob_zplaneMOUSEprocSWITCH", cmp2 : MOUSE_SELECTDISKS_PROC_ID, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ITEM_ZPLANE_CARTESIAN_MAP", cmp1 : "_glob_zplane_coords_map", cmp2 : CANVAS_CARTESIAN_MAP, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ITEM_ZPLANE_SCREEN_MAP", cmp1 : "_glob_zplane_coords_map", cmp2 : CANVAS_SCREEN_MAP, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ITEM_WPLANE_CARTESIAN_MAP", cmp1 : "_glob_wplane_coords_map", cmp2 : CANVAS_CARTESIAN_MAP, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ITEM_WPLANE_SCREEN_MAP", cmp1 : "_glob_wplane_coords_map", cmp2 : CANVAS_SCREEN_MAP, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_INTERFACE_EXTEND_NONE", cmp1 : "_glob_interface_index", cmp2 : INTERFACE_EXTEND_NONE, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_INTERFACE_EXTEND_ZPLANE", cmp1 : "_glob_interface_index", cmp2 : INTERFACE_EXTEND_ZPLANE, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_INTERFACE_EXTEND_WPLANE", cmp1 : "_glob_interface_index", cmp2 : INTERFACE_EXTEND_WPLANE, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_STATUSBAR_TOGGLE", cmp1 : "$('#CIRCLESbarsSTATUSBARdiv').css('display')", cmp2 : "'block'", toggleOn : "Hide status bar", toggleOff : "Show status bar", mask : 0, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_ZPLANE_TARGET", cmp1 : "_glob_target_plane", cmp2 : Z_PLANE, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
    _glob_menu_entries_array.push( { id : "MENU_WPLANE_TARGET", cmp1 : "_glob_target_plane", cmp2 : W_PLANE, toggleOn : "", toggleOff : "", mask : 1, operator : "==" } );
}

function circles_lib_menu_entries_update()
{
    var _e_n = safe_size( _glob_menu_entries_array, 0 );
    var _chunk, _entry_id, _cmp1, _cmp2, _toggleOn, _toggleOff, _mask, _operator, _entry, _text, _cmd, _ret_cmd, HTMLcode ;
    var _style_open, _style_close ;
    for( var _i = 0 ; _i < _e_n ; _i++ )
    {
       _chunk = _glob_menu_entries_array[_i], _entry_id = _chunk['id'] ;
       _cmp1 = _chunk['cmp1'], _cmp2 = _chunk['cmp2'] ;
       _toggleOn = _chunk['toggleOn'], _toggleOff = _chunk['toggleOff'] ;
       _mask = _chunk['mask'], _operator = _chunk['operator'] ;
       _style_open = _mask & 1 ? "<b STYLE=\"color:yellow;\">" : "" ;
       _style_close = _mask & 1 ? "</b>" : "" ;
       if ( $("#" + _entry_id ).get(0) != null )
       {
          _text = $("#" + _entry_id ).html().strip_tags();
          _cmd = _cmp1 + _operator + _cmp2 ;
          try{ _ret_cmd = eval( _cmd ) ? YES : NO ; }
          catch( _err ) { circles_lib_error_obj_handler( _err ); _ret_cmd = NO ; }
          if ( _toggleOn.length > 0 && _toggleOff.length > 0 ) HTMLcode = "<a>" + ( _ret_cmd ? _style_open+_toggleOn+_style_close : _toggleOff ) + "</a>" ;
          else HTMLcode = "<a>" + ( _ret_cmd ? _style_open+_text+_style_close : _text ) + "</a>" ;
          $("#" + _entry_id ).html( HTMLcode );
       }
    }
}