circles_lib_menu_entries_init();
circles_lib_menu_entries_update();
circles_lib_palette_init(YES);
circles_lib_statusbar_set_output_stream();
circles_lib_statusbar_set_config_icon( CONFIG_STD );
circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, YES );
circles_lib_storage_reset();

_glob_redraw_pass_counter = is_64bits_architecture() ? 12 : 6 ;

_glob_zplane_grid_layer_pointer = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
_glob_zplane_rendering_layer_pointer = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
_glob_zplane_freedraw_layer_pointer = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
_glob_zplane_work_layer_pointer = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );

_glob_wplane_grid_layer_pointer = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
_glob_wplane_rendering_layer_pointer = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
_glob_wplane_freedraw_layer_pointer = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
_glob_wplane_work_layer_pointer = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );

_glob_bip_layer_pointer = _glob_bipbox_canvas ;

var _glob_custom_div = document.createElement("div");

_glob_custom_div.style.backgroundColor = "#ABC7EC" ;
_glob_custom_div.style.border = "1px solid #F4F4F4" ;
_glob_custom_div.style.position = "absolute" ;
_glob_custom_div.id = "CIRCLEScustomDIV" ;
_glob_custom_div.style.display = "none" ;
_glob_custom_div.style.zIndex = 2 ;
_glob_custom_div.setAttribute( "class", "popup_wnd" );
    $( "#" + _glob_custom_div.id ).draggable(
    {
        start: function() { circles_lib_plugin_dragstart_override_fn(); },
        drag: function() { circles_lib_plugin_drag_override_fn(); },
        stop: function()
              {
                 var _left = $( "#" + _glob_custom_div.id ).css( "left" );
                 var _top = $( "#" + _glob_custom_div.id ).css( "top" );
                 var _width = $( "#" + _glob_custom_div.id ).width();
                 var _height = $( "#" + _glob_custom_div.id ).height();
                 _index = circles_lib_plugin_find_index( { div_id : _glob_custom_div.id }, POPUP_SEARCH_BY_DIV_ID, _caption );
                 _glob_popups_array[_index][14].width_height_constructor( _left, _top, _width, _height, _RECT_ORIENTATION_SCREEN );
                 circles_lib_plugin_dragstop_override_fn();
              }
    } );

    $( "#" + _glob_custom_div.id ).draggable('disable');
                   
document.body.appendChild(_glob_custom_div);