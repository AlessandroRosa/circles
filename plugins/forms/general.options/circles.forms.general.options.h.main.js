function CIRCLESformsGENERALOPTIONSclose() { return circles_lib_plugin_dispatcher_unicast_message( "general.options", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsGENERALOPTIONSmain( _base_id, _move, _tab_index )
{
    var _this_fn_name = "CIRCLESformsGENERALOPTIONSmain" ;
		if ( is_string( _tab_index ) )
		{
				if ( _tab_index.isAlpha() )
				switch( _tab_index.toLowerCase().replace( /[\.\_\-]/g, "" ) )
				{
						case "basics": _tab_index = 1 ; break ;
						case "z-plane": _tab_index = 2 ; break ;
						case "w-plane": _tab_index = 3 ; break ;
						case "options": _tab_index = 4 ; break ;
						case "extras": _tab_index = 5 ; break ;
						case "export": _tab_index = 6 ; break ;
		        default: break ;
				}
				else _tab_index = safe_int( _tab_index, 1 );
		}

    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ) ;
    _move = safe_int( _move, YES );

    CIRCLESformsGENERALOPTIONSbaseid = safe_string( _base_id, "" ) ;
    var _this_fn_name = arguments.callee.name + "('"+_base_id+"', "+_move+","+_tab_index+")" ;
    CIRCLESformsGENERALOPTIONStabindex = _tab_index = Math.max( 1, safe_int( _tab_index, 1 ) ) ;
    if ( _glob_smpr == 0 ) _glob_smpr = 120 ;

    _glob_current_tab['generaloptions'] = _tab_index ;
    var WIDTH = 450, HEIGHT = 0, CLOSE_FN = "CIRCLESformsGENERALOPTIONSclose();", _subset = "forms" ;
    if ( _tab_index == 1 ) { WIDTH = 430, HEIGHT = 420 ; }
    else if ( _tab_index.is_one_of( 2, 3 ) ) HEIGHT = 500 ;
    else if ( _tab_index == 4 ) { WIDTH = 400, HEIGHT = 300 ; }
    else if ( _tab_index == 5 ) HEIGHT = 346 ;
    else if ( _tab_index == 6 ) HEIGHT = 200 ;
    else HEIGHT = "auto" ;

    var _div_id = CIRCLESformsGENERALOPTIONSdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    var _caption = CIRCLESformsGENERALOPTIONScaption ;
    switch( _tab_index )
    {
       case 1: _caption += " - Basics" ; break ;
       case 2: _caption += " - Z-plane" ; break ;
       case 3: _caption += " - W-plane" ; break ;
       case 4: _caption += " - Colors" ; break ;
       case 5: _caption += " - Extras" ; break ;
       case 6: _caption += " - Export" ; break ;
       default: break ;
    }

     var HTMLcode = "<table WIDTH=\""+WIDTH+"\" ALIGN=\"center\" ID=\"GENERALoptionsMASTERtable\">" ;
         HTMLcode += circles_lib_plugin_caption_code( YES, _caption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, _this_fn_name, _base_id, _div_id, _subset, "tools/tools.01.20x20.png" );
         HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"18\" ID=\"CIRCLESformsGENERALOPTIONSoutputBOX\" ALIGN=\"center\"></td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;

         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
         HTMLcode += "<table>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>Show tab</td>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td>" ;
         HTMLcode += "<SELECT ID=\"GENERALOPTIONStabsCOMBO\" ONCHANGE=\"javascript:circles_lib_plugin_load('forms','general.options', NO, this.options[this.selectedIndex].value );\">" ;
         HTMLcode += "<OPTION "+( _tab_index == 1 ? "SELECTED" : "" )+" VALUE=\"1\">Basics" ;
         HTMLcode += "<OPTION "+( _tab_index == 2 ? "SELECTED" : "" )+" VALUE=\"2\">Z-plane" ;
         HTMLcode += "<OPTION "+( _tab_index == 3 ? "SELECTED" : "" )+" VALUE=\"3\">W-plane" ;
         HTMLcode += "<OPTION "+( _tab_index == 4 ? "SELECTED" : "" )+" VALUE=\"4\">Colors" ;
         HTMLcode += "<OPTION "+( _tab_index == 5 ? "SELECTED" : "" )+" VALUE=\"5\">Extras" ;
         HTMLcode += "<OPTION "+( _tab_index == 6 ? "SELECTED" : "" )+" VALUE=\"6\">Export" ;
         HTMLcode += "</SELECT>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "<td WIDTH=\"5\"></td>" ;
         HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','general.options', NO, $('#GENERALOPTIONStabsCOMBO option:selected').val() );\">Reload</td>" ;
         HTMLcode += "<td WIDTH=\"20\"></td>" ;
         if ( _tab_index.is_one_of( 4, 5 ) )
         {
             HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsGENERALOPTIONSapply();\">Apply changes</td>" ;
             HTMLcode += "<td WIDTH=\"1\"></td>" ;
         }
         HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsGENERALOPTIONSreset();\">Default settings</td>" ;
         HTMLcode += "<td WIDTH=\"1\"></td>" ;

         var _plane_type = NO_PLANE ;
         switch( _tab_index )
         {
             case 1:
             case 4:
             case 5:
             case 6: _plane_type = _glob_target_plane ; break ;
             case 2: _plane_type = Z_PLANE ; break ;
             case 3: _plane_type = W_PLANE ; break ;
             default: _plane_type = W_PLANE ; break ;
         }

         HTMLcode += "<td WIDTH=\"25\" CLASS=\"link_rounded\" ALIGN=\"center\" ID=\"GENERALOPTIONSrenderBTN\" ONCLICK=\"javascript:circles_lib_items_switch_to(_glob_items_switch,YES);circles_lib_canvas_process_ask(YES,NO,_glob_target_plane,YES,YES,CHECK);\">Render</td>" ;
         HTMLcode += "</tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += "</tr>" ;

         HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
         HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\" ID=\"GENERALOPTIONStabCONTAINER\">" ;

     switch( _tab_index )
     {
        case 1: HTMLcode += CIRCLESformsGENERALOPTIONSbasicsTAB(); break ;
        case 2: HTMLcode += CIRCLESformsGENERALOPTIONSzplanelayersTAB( _this_fn_name ); break ;
        case 3: HTMLcode += CIRCLESformsGENERALOPTIONSwplanelayersTAB( _this_fn_name ); break ;
        case 4: HTMLcode += CIRCLESformsGENERALOPTIONScolorsTAB(); break ;
        case 5: HTMLcode += CIRCLESformsGENERALOPTIONSextrasTAB(); break ;
        case 6: HTMLcode += CIRCLESformsGENERALOPTIONSexportTAB(); break ;
        default: break ;
     }

     HTMLcode += "</td>" ;
     HTMLcode += "</tr>" ;
     HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
     HTMLcode += "</table>" ;
     HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
     circles_lib_plugin_activate( NO, _base_id, _this_fn_name, arguments, _subset, OPEN, _div_id, _caption, CLOSE_FN );
     if ( _move && _div != null ) move_div( _div.id, "CENTER", "TOP" );
        
     if ( _tab_index == 2 )
     {
        CIRCLESformsGENERALOPTIONSlayersINITsliders( Z_PLANE );
        CIRCLESformsGENERALOPTIONSlayersINITcanvasTHUMBNAILS( Z_PLANE );
     }
     else if ( _tab_index == 3 )
     {
        CIRCLESformsGENERALOPTIONSlayersINITsliders( W_PLANE );
        CIRCLESformsGENERALOPTIONSlayersINITcanvasTHUMBNAILS( W_PLANE );
     }

     var _draw_color_check = 0, _fill_color_check = 0 ;
     for( var _i = 0 ; _i < _items_n ; _i++ )
     {
        if ( is_circle( _items_array[_i].complex_circle ) )
        {
           if ( _items_array[_i].complex_circle.draw ) _draw_color_check++ ;
           if ( _items_array[_i].complex_circle.fill ) _fill_color_check++ ;
        }
     }
              
     if ( _draw_color_check != _items_n && _draw_color_check > 0 && _items_n > 0 ) $("#CIRCLEScheckboxDISKSdraw").prop( "indeterminate", 1 );
     if ( _fill_color_check != _items_n && _fill_color_check > 0 && _items_n > 0 ) $("#CIRCLEScheckboxDISKSfill").prop( "indeterminate", 1 );

     if ( _tab_index.is_one_of( 2, 3 ) )
     {
         $("#"+_div_id ).resizable({ resize: function( event, ui ) { CIRCLESformsGENERALOPTIONSresize( ui.size.width, ui.size.height ); } });
         $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });
         CIRCLESformsGENERALOPTIONSresize( WIDTH, HEIGHT );
     }
}

function CIRCLESformsGENERALOPTIONSresize( _w, _h )
{
    _w = safe_int(_w,450), _h = safe_int(_h,300);
    $( "#GENERALoptionsMASTERtable" ).width( _w );
    $( "#GENERALOPTIONSlayerslistCONTAINER" ).height( _h );
    $( "[id$=_thumbnail]" ).css( "display", _w >= 340 ? "block" : "none" );
}