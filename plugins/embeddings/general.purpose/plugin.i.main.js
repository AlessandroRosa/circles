function CIRCLESembeddingsGENERALPURPOSE_CALL_METHOD( fn ) { circles_lib_plugin_load('forms','method', YES, 0, _glob_method, fn ); }
function CIRCLESembeddingsGENERALPURPOSEclose() { return circles_lib_plugin_dispatcher_unicast_message( 'general.purpose', "embeddings", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESembeddingsGENERALPURPOSE_FOCUS() { var SW = $(window).width(), SH = $(window).height(); CIRCLESembeddingsGENERALPURPOSE_GEN_LIST( NO, NO, SH > 540 ? YES : NO ); }
function CIRCLESembeddingsGENERALPURPOSE_CONFIG( _base_id )
{
    _plugin_main_ref = safe_string( _base_id + "", _plugin_main_ref ) ;
    var _index_ref = _plugin_main_ref + "" ;
    _plugin_input_mode_mask_array[_index_ref] = 2 ; // FREE
    _plugin_method_array[_index_ref] = METHOD_ALGEBRAIC ;
    _plugin_definitions_array[_index_ref] = "General purpose" ;
    _plugin_info_array[_index_ref] = "Just input the coefficients of gens and pull your Mobius maps group out !" ;
    _plugin_run_fn_array[_index_ref] = "CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(NO,YES);CIRCLESembeddingsGENERALPURPOSE_GENERATE_GROUP(YES,NO);" ;
    _plugin_vars_array[_index_ref] = [] ;

    _glob_target_plane = W_PLANE ;
    _glob_init_mask = INIT_FROM_MAPS | INIT_PAIRED_ITEMS ;
    circles_lib_method_set( METHOD_ALGEBRAIC );
    
    _glob_submethod_desc = _plugin_definitions_array[_index_ref] ;
    _glob_submethod_desc = safe_string( _glob_submethod_desc, "" );
    if ( _glob_process == PROCESS_NONE ) _glob_process = PROCESS_BREADTHFIRST ;

    if ( _glob_drawentity == DRAWENTITY_NONE ) circles_lib_drawentity_set( DRAWENTITY_PIXEL );
    if ( _glob_depth <= 1 ) circles_lib_depth_set( DEFAULT_DEPTH, YES );
    _plugin_init_fns_array[_index_ref] = arguments.callee.name ;
    CIRCLESembeddingsGENERALPURPOSE_PRESETS_INIT();
}

function CIRCLESembeddingsGENERALPURPOSE_RECORD_PARAMS()
{
    var _index_ref = _plugin_last_ref ;
    var _ret_chunk = GLOB_PLUGIN_PARAMS_REGISTER( _index_ref, "#PLUGIN_PARAM_A", "#PLUGIN_PARAM_B", "#PLUGIN_PARAM_C", "#PLUGIN_PARAM_D",
                                                  $( "#PLUGIN_PARAM_A" ).val(), $( "#PLUGIN_PARAM_B" ).val(), $( "#PLUGIN_PARAM_C" ).val(), $( "#PLUGIN_PARAM_D" ).val() );
    var _ret_id = safe_int( _ret_chunk[0], RET_ERROR );
    var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
    var _html = GLOB_PLUGIN_PARAMS_COMBO_CODE_GET(_index_ref);
    if ( _ret_id == RET_OK ) $( "#PLUGINparamsCOMBOcontainer" ).html( _html );
    else if ( _ret_id == RET_ERROR ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, _ret_msg, 'PLUGIN_OUTMSG' ) ;
}

function CIRCLESembeddingsGENERALPURPOSEmain( _base_id, _move, _restore )
{
    _move = is_string( _move ) ? _move : safe_int( _move, YES ), _restore = safe_int( _restore, YES );
    var _clean_base_id = _base_id.replace( /[\.\_\-]/g, "" ) ;
    CIRCLESembeddingsGENERALPURPOSE_CONFIG( _base_id );
	_plugin_last_ref = _plugin_main_ref ;
    var _index_ref = _plugin_last_ref ;
    var _items_n = circles_lib_count_items();
    var this_fn_name = arguments.callee.name + "(NO,"+_restore+")" ;
    var SW = $(window).width(), SH = $(window).height();

    var _init_btn_clr = CELLgetCLR( "STATUSBARinitBTN" );
    var _draw_btn_clr = CELLgetCLR( "STATUSBARrenderBTN" );

    var _div_id = GLOB_PLUGIN_DIV_ID, _subset = "embeddings" ;
    var CLOSE_FN = "CIRCLES"+_subset+_clean_base_id.toUpperCase()+"close();" ;
    var WIDTH = 510, HEIGHT = "auto" ;
    GLOB_PLUGIN_BASE_ID = _clean_base_id, GLOB_PLUGIN_SUBSET = _subset ;

    var HTMLcode = "<table WIDTH=\""+WIDTH+"\" ID=\"PLUGINmasterTABLE\">" ;
    HTMLcode += circles_lib_plugin_caption_code( YES, _glob_submethod_desc, 1, YES, CLOSE_FN, WIDTH, HEIGHT,
                this_fn_name, 'general.purpose', _div_id, _subset, "plug/plug.icon.01.20x20.png", "", "", "CIRCLES"+_subset+"GENERALPURPOSE_",
								[ "CIRCLESembeddingsGENERALPURPOSE_NORMALIZE", _div_id, WIDTH, HEIGHT ],
								[ "CIRCLESembeddingsGENERALPURPOSE_MINIMIZE", _div_id, WIDTH, HEIGHT ],
								[ "CIRCLESembeddingsGENERALPURPOSE_MAXIMIZE", _div_id, WIDTH, HEIGHT ] );
    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;

    HTMLcode += "<td>" ;
    var _abs_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
    var _rel_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
    $.ajaxSetup( { async:false } );
    $.get( _rel_folder_path + "menu.html", function( response ) { HTMLcode += response.replaceAll( "%indexref%", "'"+_index_ref+"'" ) ; } );
    HTMLcode += "</td>" ;
    /*
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td STYLE=\"color:"+_init_btn_clr+";\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_CONFIG();GLOB_PLUGIN_WIZARD_STEP(1.1,YES);CIRCLESembeddingsGENERALPURPOSE_RECORD_PARAMS();\" ID=\"PLUGINinitBTN\">Init</td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td STYLE=\"color:"+_draw_btn_clr+";\" CLASS=\"link\" ONCLICK=\"javascript:GLOB_PLUGIN_WIZARD_STEP(2.1);\" ID=\"PLUGINrenderBTN\">Render</td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_RECORD_PARAMS();\">Register</td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:$('#customloader').val('');$('#customloader').trigger('click');\">Load</td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_SAVE_GROUP();\">Save</td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:if ( circles_lib_method_check() ) CIRCLESembeddingsGENERALPURPOSE_CALL_METHOD('"+this_fn_name+"'); else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _ERR_00_01, 'PLUGIN_OUTMSG' ) ;\">Method</td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td CLASS=\"link\">Comment</td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:GLOB_PLUGIN_DISPLAY_INFOS('"+_plugin_main_ref+"');\">Info</td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_TIPS();\">Tips</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    */
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"28\"><DIV ID=\"PLUGIN_OUTMSG\" CLASS=\"general_rounded_corners\" STYLE=\"height:28px;background-color:white;font-size:12pt;\" ALIGN=\"center\"></DIV></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"padding:5px;background-color:#E4EAF1;\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>Target canvas</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>"+circles_lib_extras_canvas_dropdown( _base_id.toUpperCase() )+"</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
	HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_render_preview('"+_clean_base_id.toUpperCase()+"','"+_subset+"',Z_PLANE);\" ID=\"PLUGINpreview_zplaneBTN\">Render Z-plane Objs</td>" ;
	HTMLcode += "<td WIDTH=\"3\"></td>" ;
	HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_render_preview('"+_clean_base_id.toUpperCase()+"','"+_subset+"',W_PLANE);\" ID=\"PLUGINpreview_wplaneBTN\">Render W-plane Objs</td>" ;
	HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\" ID=\"PLUGIN_INPUT_MASK\" CLASS=\"general_rounded_corners\" STYLE=\"padding:5px;background-color:#F0F0F0;\">" ;
    HTMLcode += "<table>" ;
    
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"7\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td>Presets</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td>"+CIRCLESembeddingsGENERALPURPOSE_PRESETS(1)+"</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_PRESETS(2);\">Apply</td>" ;
    HTMLcode += "<td WIDTH=\"25\"></td>" ;
    HTMLcode += "<td ID=\"PLUGINcomboLABEL\" STYLE=\"padding-top:3px;display:"+( GLOB_PLUGIN_PARAMS_EXIST(_index_ref) ? "block" : "none" )+";\">Latest params</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td ID=\"PLUGINparamsCOMBOcontainer\">"+GLOB_PLUGIN_PARAMS_COMBO_CODE_GET(_index_ref)+"</td>" ;
    HTMLcode += "<td WIDTH=\"13\"></td>" ;
    HTMLcode += "<td>Display</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td><table><tr><td><SELECT ID=\"PLUGINcircleCOMBO\" ONCHANGE=\"javascript:_glob_drawentity=this.value;circles_lib_menu_entries_update();\">" ;
	var _selected = _glob_drawentity == DRAWENTITY_ISOMETRIC_CIRCLE ? "SELECTED=\"selected\"" : "" ;
	HTMLcode += "<OPTION "+_selected+" VALUE=\""+DRAWENTITY_ISOMETRIC_CIRCLE+"\">Isometric" ;
		_selected = _glob_drawentity == DRAWENTITY_INVERSION_CIRCLE ? "SELECTED=\"selected\"" : "" ;
	HTMLcode += "<OPTION "+_selected+" VALUE=\""+DRAWENTITY_INVERSION_CIRCLE+"\">Inversion" ;
		_selected = _glob_drawentity == DRAWENTITY_PIXEL ? "SELECTED=\"selected\"" : "" ;
	HTMLcode += "<OPTION "+_selected+" VALUE=\""+DRAWENTITY_PIXEL+"\">Pixel" ;
		_selected = _glob_drawentity == DRAWENTITY_POINT ? "SELECTED=\"selected\"" : "" ;
	HTMLcode += "<OPTION "+_selected+" VALUE=\""+DRAWENTITY_POINT+"\">Point" ;
	HTMLcode += "</SELECT></td></tr></table></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\">circles</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    var _CANVAS_W = WIDTH - 34, _CANVAS_H = Math.floor( _CANVAS_W / 2 ) - 60 ;
    var TAB_H = _CANVAS_H + 50 ;

	HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\"100%\" ID=\"PLUGIN_TABS_CONTAINER\">" ;
    HTMLcode += "<div ID=\"CIRCLESGENERALPURPOSEmainDIV\" STYLE=\"position:relative;width:99%;height:"+(TAB_H+12)+"px;\" VALIGN=\"top\" class=\"tabber\">" ;

    HTMLcode += "<DIV class=\"tabbertab\" STYLE=\"width:99%;height:"+TAB_H+"px;\" VALIGN=\"top\" ID=\"CIRCLESGENERALPURPOSE_TAB_01\">" ;
    HTMLcode += "<h2>Input maps</h2>" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td COLSPAN=\"7\">Enter complex formula in the boxes below</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>a</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:380px;\" ID=\"PLUGIN_PARAM_A\" VALUE=\"\" ONKEYUP=\"javascript:CIRCLESembeddingsGENERALPURPOSE_EVENTS(this.id,event);\" ONFOCUS=\"javascript:$('#PLUGIN_OUTMSG').html( '' );\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_VAR_WATCH('A');\"><IMG TITLE=\"Watch variables in param A\" SRC=\"%imgpath%icons/binoculars/binoculars.icon.01.20x20.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_VAR_COMPUTE('A');\"><IMG TITLE=\"Compute param A\" SRC=\"%imgpath%icons/gearwheel/gearwheel.icon.01.20x20.png\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>b</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:380px;\" ID=\"PLUGIN_PARAM_B\" VALUE=\"\" ONKEYUP=\"javascript:CIRCLESembeddingsGENERALPURPOSE_EVENTS(this.id,event);\" ONFOCUS=\"javascript:$( '#PLUGIN_OUTMSG' ).html( '' );\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_VAR_WATCH('B');\"><IMG TITLE=\"Watch variables in param B\" SRC=\"%imgpath%icons/binoculars/binoculars.icon.01.20x20.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_VAR_COMPUTE('B');\"><IMG TITLE=\"Compute param B\" SRC=\"%imgpath%icons/gearwheel/gearwheel.icon.01.20x20.png\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>c</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:380px;\" ID=\"PLUGIN_PARAM_C\" VALUE=\"\" ONKEYUP=\"javascript:CIRCLESembeddingsGENERALPURPOSE_EVENTS(this.id,event);\" ONFOCUS=\"javascript:$( '#PLUGIN_OUTMSG' ).html( '' );\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_VAR_WATCH('C');\"><IMG TITLE=\"Watch variables in param C\" SRC=\"%imgpath%icons/binoculars/binoculars.icon.01.20x20.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_VAR_COMPUTE('C');\"><IMG TITLE=\"Compute param C\" SRC=\"%imgpath%icons/gearwheel/gearwheel.icon.01.20x20.png\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>d</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:380px;\" ID=\"PLUGIN_PARAM_D\" VALUE=\"\" ONKEYUP=\"javascript:CIRCLESembeddingsGENERALPURPOSE_EVENTS(this.id,event);\" ONFOCUS=\"javascript:$( '#PLUGIN_OUTMSG' ).html('');\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_VAR_WATCH('D');\"><IMG TITLE=\"Watch variables in param D\" SRC=\"%imgpath%icons/binoculars/binoculars.icon.01.20x20.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_VAR_COMPUTE('D');\"><IMG TITLE=\"Compute param D\" SRC=\"%imgpath%icons/gearwheel/gearwheel.icon.01.20x20.png\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td COLSPAN=\"8\"><SPAN STYLE=\"color:blue;\">Note #1</SPAN> The four params can be entered in the same row and separated by comma. Then press 'enter': they'll be spread over the four boxes.</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td COLSPAN=\"8\"><SPAN STYLE=\"color:blue;\">Note #2</SPAN> After entering the fourth param d, press 'enter' to save the Mobius map.</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</DIV>" ;

    HTMLcode += "<DIV class=\"tabbertab\" STYLE=\"width:99%;height:"+TAB_H+"px;\" VALIGN=\"top\" ID=\"CIRCLESGENERALPURPOSE_TAB_02\">" ;
    HTMLcode += "<h2>Maps List</h2>" ;
    HTMLcode += "<table WIDTH=\"100%\">" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td CLASS=\"general_rounded_corners\" ID=\"PLUGIN_LIST_CONTAINER\" VALIGN=\"top\" STYLE=\"background-color:#F2F6FB;padding:1px;\"></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</DIV>" ;

    HTMLcode += "<DIV class=\"tabbertab\" STYLE=\"width:99%;height:"+TAB_H+"px;\" VALIGN=\"top\" ID=\"CIRCLESGENERALPURPOSE_TAB_03\">" ;
    HTMLcode += "<h2>Custom vars</h2>" ;
	HTMLcode += "<table>" ;

    HTMLcode += "<tr><td VALIGN=\"top\" CLASS=\"general_rounded_corners_top\" STYLE=\"padding:5px;background-color:#F0F0F0;\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td>Var id</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"PLUGINvaridEDIT\" ONKEYUP=\"javascript:CIRCLESembeddingsGENERALPURPOSE_EVENTS(this.id,event);\"></td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td>Value</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"PLUGINvarvalueEDIT\" ONKEYUP=\"javascript:CIRCLESembeddingsGENERALPURPOSE_EVENTS(this.id,event);\" STYLE=\"width:240px;\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    var _n_registered_vars = _plugin_rec_var_vals != null ? safe_int( _plugin_rec_var_vals.size_associative(), 0 ) : 0 ;

    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" STYLE=\"padding:5px;background-color:#EBEBEB;\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td ID=\"PLUGINregisteredvaluesLABEL\">"+( _n_registered_vars == 0 ? "No" : _n_registered_vars )+" registered value"+( _n_registered_vars == 1 ? "" : "s" )+"</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td ID=\"PLUGINregisteredvaluesCOMBOcontainer\">"+CIRCLESembeddingsGENERALPURPOSE_VAR_REGISTER_COMBO_BUILD()+"</td>" ;
    HTMLcode += "<td WIDTH=\"8\"></td>" ;
    HTMLcode += "<td ID=\"PLUGINregisteredvaluesCOMBOoutput\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    
    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    
    HTMLcode += "<tr><td VALIGN=\"top\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"padding:5px;background-color:#EBEBEB;\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSEvar_check=CIRCLESembeddingsGENERALPURPOSE_VAR_CLEAN();\" ID=\"PLUGINparam_cleanBTN\">Clean</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSEvar_check=CIRCLESembeddingsGENERALPURPOSE_VAR_DELETE();\" ID=\"PLUGINparam_delete_idBTN\">Delete</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSEvar_check=CIRCLESembeddingsGENERALPURPOSE_VAR_BOMB();\" ID=\"PLUGINparam_bombBTN\">Bomb</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSEvar_check=CIRCLESembeddingsGENERALPURPOSE_REGISTERED_VAR_DELETE();\" ID=\"PLUGINparam_delete_valBTN\">Delete value</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSEvar_check=CIRCLESembeddingsGENERALPURPOSE_VAR_HELP(1);\">?</td>" ;
    HTMLcode += "<td WIDTH=\"25\"></td>" ;
    HTMLcode += "<td>Register</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSEvar_check=CIRCLESembeddingsGENERALPURPOSE_VAR_REGISTER();\" ID=\"PLUGINparam_registerBTN\">Value</td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSEvar_check=CIRCLESembeddingsGENERALPURPOSE_VAR_REGISTER_LIST_BUILD();\" ID=\"PLUGINparam_listBTN\">List</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
    HTMLcode += "<tr><td COLSPAN=\"8\"><SPAN STYLE=\"color:blue;\">Note #1</SPAN> Registered values can be used to input formulas in the generators parameters</td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
    HTMLcode += "<tr><td COLSPAN=\"8\"><SPAN STYLE=\"color:blue;\">Note #2</SPAN> If formulas are input into generators parameters, push 'update' button to get the related complex values</td></tr>" ;
    HTMLcode += "" ;
 
	HTMLcode += "</table>" ;
    HTMLcode += "</DIV>" ;

    HTMLcode += "<DIV class=\"tabbertab\" STYLE=\"width:99%;height:"+TAB_H+"px;\" VALIGN=\"top\" ID=\"CIRCLESGENERALPURPOSE_TAB_04\">" ;
    HTMLcode += "<h2>Comment</h2>" ;
    HTMLcode += "<table ALIGN=\"center\">" ;
    HTMLcode += "<tr><td ID=\"PLUGINcommentLABEL\" STYLE=\"padding-left:6px;\"></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
    HTMLcode += "<tr><td>Type comments about the working group here</td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
    HTMLcode += "<tr><td ALIGN=\"center\">" ;
    HTMLcode += "<TEXTAREA ID=\"PLUGINcommentTEXTAREA\" ALIGN=\"center\" STYLE=\"width:"+(WIDTH-30)+"px;height:130px;overflow:auto;\"></TEXTAREA>" ;
    HTMLcode += "</td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
    HTMLcode += "<tr><td ALIGN=\"center\">Comments will be kept up when exporting the group into a file</td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</DIV>" ;

    HTMLcode += "<DIV class=\"tabbertab\" STYLE=\"width:99%;height:"+TAB_H+"px;\" VALIGN=\"top\" ID=\"CIRCLESGENERALPURPOSE_TAB_05\">" ;
    HTMLcode += "<h2>Preview</h2>" ;
    HTMLcode += "<table WIDTH=\"100%\">" ;
    HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\"100%\" ALIGN=\"center\"><DIV ID=\"PLUGIN_PREVIEW\" STYLE=\"position:relative;height:auto;\" ALIGN=\"center\"><table ALIGN=\"center\"><tr><td VALIGN=\"top\" ALIGN=\"center\"><CANVAS CLASS=\"general_rounded_corners\" STYLE=\"border:1px solid #D0D0D0;width:"+_CANVAS_W+"px;height:"+_CANVAS_H+"px;\" WIDTH=\""+_CANVAS_W+"\" HEIGHT=\""+_CANVAS_H+"\" ID=\"CIRCLES"+_subset+(_clean_base_id.toUpperCase())+"_CANVAS\"></CANVAS></td></tr><tr><td HEIGHT=\"4\"></td></tr></table></DIV></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</DIV>" ;

	HTMLcode += "</div>" ;
	HTMLcode += "</td>" ;
	HTMLcode += "</tr>"

    HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    HTMLcode += "<tr><td ALIGN=\"center\"><SPAN STYLE=\"color:red;\">Don't input inverse gens</SPAN>: they'll be computed and inserted while generating the group</td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;

    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td ALIGN=\"right\" CLASS=\"popup_buttons_bar\" HEIGHT=\"18\">" ;
    HTMLcode += "<table ALIGN=\"right\">" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CIRCLESembeddingsGENERALPURPOSE_NEW_BTN\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_GEN_MANAGER(CIRCLESembeddingsGENERALPURPOSE_NEW,YES);\">New</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CIRCLESembeddingsGENERALPURPOSE_ADD_BTN\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_GEN_MANAGER(CIRCLESembeddingsGENERALPURPOSE_ADD,YES);\">Add</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CIRCLESembeddingsGENERALPURPOSE_UPDATE_BTN\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_GEN_MANAGER(CIRCLESembeddingsGENERALPURPOSE_UPDATE,YES);\">Update</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"PLUGIN_WHOLEGROUP_LIST_BTN\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(YES,NO,YES,_glob_seeds_array);\" WIDTH=\"90\">View whole group</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"PLUGIN_REFRESH_LIST_BTN\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_GEN_LIST(NO,YES);\">Refresh List</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"150\" CLASS=\"popup_buttons_bar\" HEIGHT=\"18\">" ;
    HTMLcode += "<table ALIGN=\"right\">" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"PLUGIN_CAPTURE_SEEDS_BTN\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_CAPTURE(ITEMS_SWITCH_SEEDS);\">Capture seeds</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"PLUGIN_CAPTURE_GENS_BTN\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_CAPTURE(ITEMS_SWITCH_GENS);\">Capture gens</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"PLUGIN_GENERATE_GROUP_BTN\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_GENERATE_GROUP(YES,NO);\">Generate group</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"PLUGIN_BOMB_BTN\" ONCLICK=\"javascript:CIRCLESembeddingsGENERALPURPOSE_BOMB();\">Bomb</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "</table>" ;
    HTMLcode += "<div STYLE=\"position:absolute;display:none;\"></DIV>";
    
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, 'embeddings', OPEN, _div.id, _glob_submethod_desc, [ "CIRCLESembeddingsGENERALPURPOSE_NORMALIZE", _div_id, WIDTH, HEIGHT ], [ "CIRCLESembeddingsGENERALPURPOSE_MINIMIZE", _div_id, WIDTH, HEIGHT ], [ "CIRCLESembeddingsGENERALPURPOSE_MAXIMIZE", _div_id ] );
    if ( _move && _div != null )
	{
		if ( is_string( _move ) )
		{
			_move = _move.replace( /[\|\;\:]/, "," );
			_move = _move.includes( "," ) ? _move.split( "," ) : [ _move, "TOP" ];
			move_div( _div.id, _move[0], _move[1] );
		}
		else move_div( _div.id, "LEFT", "TOP" );
	}

    tabberAutomatic( CIRCLESGENERALPURPOSEtabberOptions, "CIRCLESGENERALPURPOSE" );
    CIRCLESembeddingsGENERALPURPOSE_GEN_LIST( NO, _restore, YES );
    TABINDEXorderSET( "#PLUGIN_PARAM_A", "#PLUGIN_PARAM_B", "#PLUGIN_PARAM_C", "#PLUGIN_PARAM_D", "#PLUGINSconfigCOMBO" );
    $( "#PLUGINregisteredvarsLABEL" ).css( "color", _n_registered_vars == 0 ? "#909090" : DEFAULT_COLOR_STD );

    $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESembeddingsGENERALPURPOSE_LOADgroup ) } ;
    $("#"+_div_id).bind( "click", function() { GLOB_PLUGIN_FOCUS( _base_id ); } );
    GLOB_PLUGIN_EVENT_PROPAGATION_MANAGEMENT( 1 );

    var DROPDOWN = $( "#CIRCLESchoose"+_base_id.replace( /[\.\_\-]/g, "" ).toUpperCase()+"canvasDROPDOWN" ).get(0) ;
    if ( DROPDOWN != null ) DROPDOWN.options[0].text = "Preview canvas" ;

    if ( _plugin_tmp_vars_array['plugin_sel'] != null )
    {
        var _data = _plugin_tmp_vars_array['plugin_sel'], _store_gens = [], _var_id = "", _var_val = 0 ;
        $.each( _data.keys_associative(), function( _i, _key )
        {
            _var_id = _key, _var_val = _data[ _key ] ;
            if ( _var_id.start_with( "g" ) && _var_id.includes( "_" ) )
            {
                _var_id = _var_id.replace( "g", "" ).split( "_" ) ;
                var _g_name = safe_int( _var_id[0], 0 ), _g_index = safe_int( _var_id[1], 0 ) ;
                if ( _g_index >= 1 && _g_index <= 4 ) _store_gens.push( _var_val );
                if ( _store_gens.length == 4 )
                {
                   CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array = [ _store_gens[0], _store_gens[1], _store_gens[2], _store_gens[3] ] ;
                   $( "#PLUGIN_PARAM_A" ).val( _store_gens[0] );
                   $( "#PLUGIN_PARAM_B" ).val( _store_gens[1] );
                   $( "#PLUGIN_PARAM_C" ).val( _store_gens[2] );
                   $( "#PLUGIN_PARAM_D" ).val( _store_gens[3] );
                   _store_gens = [] ;
                   CIRCLESembeddingsGENERALPURPOSE_GEN_MANAGER( CIRCLESembeddingsGENERALPURPOSE_ADD, YES );
                   _glob_target_plane = W_PLANE ;
                }
            }
        } ) ;
        CIRCLESembeddingsGENERALPURPOSE_GENERATE_GROUP(YES,NO);
    }
}

function CIRCLESembeddingsGENERALPURPOSE_CAPTURE( _items_switch )
{
    var _chunk = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _chunk['count'], _items_array =  _chunk['array'], _items_array_label =  _chunk['label'], _items_switch = _chunk['switch'] ;
    var _test = is_array( _items_array ) ? _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) : NO ;
    if ( !_items_switch.is_one_of( ITEMS_SWITCH_SEEDS, ITEMS_SWITCH_GENS ) ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Invalid source items specification", 'PLUGIN_OUTMSG' ) ;
    else if ( !_test ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "The input container is not a valid "+_items_array_label+" container", 'PLUGIN_OUTMSG' ) ;
    else if ( _items_n == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Capturing aborted: the "+_items_array_label+" list is empty", 'PLUGIN_OUTMSG' ) ;
    else
    {
        var _b_go = YES ;
        if ( safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 ) > 0 )
        {
           var _question = "Another group, previously generated through this plug-in, had been already saved. Old entries would be lost." + _glob_crlf ;
               _question += "Do you want to replace it with the current "+_items_array_label+" set ?" ;
           if ( confirm( _question ) ) CIRCLESembeddingsGENERALPURPOSE_gens_container.flush();
           else _b_go = NO ;
        }

        if ( _b_go )
        {
           var _mobius_map = null, _symbol = "", _success_n = 0, _n = 0, _tmp_array ;
           for( var _m = 0 ; _m < _items_n ; _m++ )
           {
              _symbol = is_item_obj( _items_array[_m] ) ? _items_array[_m].symbol : "" ;
              if ( _symbol.isAlphaLower() && _symbol.length > 0 )
              {
                 _mobius_map = _items_array[_m].map ;
                 if ( is_mobius_map( _mobius_map ) )
                 {
                    _tmp_array = _mobius_map.get_params().clone();
                    $.each( _tmp_array, function( _i, _c ){ _tmp_array[_i] = _tmp_array[_i].formula() } );
                    CIRCLESembeddingsGENERALPURPOSE_gens_container.push( _tmp_array.clone() );
                    _n = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 );
                    if ( is_array( CIRCLESembeddingsGENERALPURPOSE_gens_container[_n-1] ) ) _success_n++ ;
                 }
              }
           }

       		 circles_lib_output( OUTPUT_SPECIAL_FX, (_success_n == _items_n/2) ? DISPATCH_SUCCESS : DISPATCH_WARNING, _success_n + " of " + _items_n/2 + " entries have been correctly processed", 'PLUGIN_OUTMSG' ) ;
           CIRCLESembeddingsGENERALPURPOSE_GEN_LIST( NO, NO );
           $("#CIRCLESGENERALPURPOSEmainDIV").get(0).tabber.tabShow(1);
        }
        else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Capturing has been aborted by user", 'PLUGIN_OUTMSG' ) ;
    }
}

function CIRCLESembeddingsGENERALPURPOSE_CHECK_DUPLICATE( _a_formula, _b_formula, _c_formula, _d_formula )
{
  	var _N_GENS = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 ), GEN_CHUNK, _FOUND = NO ;
	for( var _i = 0 ; _i < _N_GENS ; _i++ )
	{
		GEN_CHUNK = CIRCLESembeddingsGENERALPURPOSE_gens_container[_i] ;
		if ( GEN_CHUNK != null )
		{
			if ( _a_formula.stricmp( GEN_CHUNK[0] ) && _b_formula.stricmp( GEN_CHUNK[1] ) &&
			 	 _c_formula.stricmp( GEN_CHUNK[2] ) && _d_formula.stricmp( GEN_CHUNK[3] ) )
			{
				_FOUND = YES ;
				break ;
			}
		}
	}
	return _FOUND ;
}

function CIRCLESembeddingsGENERALPURPOSE_FIND_INDEX( _a_formula, _b_formula, _c_formula, _d_formula )
{
	var _N_GENS = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 ), GEN_CHUNK, _INDEX = UNDET ;
	for( var _i = 0 ; _i < _N_GENS ; _i++ )
	{
		GEN_CHUNK = CIRCLESembeddingsGENERALPURPOSE_gens_container[_i] ;
		if ( GEN_CHUNK != null )
		{
			if ( _a_formula.stricmp( GEN_CHUNK[0] ) && _b_formula.stricmp( GEN_CHUNK[1] ) &&
				 _c_formula.stricmp( GEN_CHUNK[2] ) && _d_formula.stricmp( GEN_CHUNK[3] ) )
  			{
				_FOUND = _i ;
				break ;
			}
		}
	}
	return _FOUND ;
}

function CIRCLESembeddingsGENERALPURPOSE_MOBIUS_INFO( _index )
{
    _index = safe_int( _index, UNDET );
    var GEN_CHUNK = CIRCLESembeddingsGENERALPURPOSE_gens_container[_index] ;
    if ( is_array( GEN_CHUNK ) )
    {
		var _GEN_CHECK_MASK = 0, _mm = null ;
  		for( var _c = 0 ; _c < 4 ; _c++ ) if ( GEN_CHUNK[_c] != null ) _GEN_CHECK_MASK |= ( GEN_CHUNK[_c].length > 0 ) ? Math.pow( 2, _c ) : 0 ;
        if ( _GEN_CHECK_MASK == 15 )
        {
   			var _A_FORMULA = GEN_CHUNK[0], _B_FORMULA = GEN_CHUNK[1], _C_FORMULA = GEN_CHUNK[2], _D_FORMULA = GEN_CHUNK[3] ;
   			_A_FORMULA = circles_lib_math_parse_formula( _A_FORMULA );
   			_B_FORMULA = circles_lib_math_parse_formula( _B_FORMULA );
   			_C_FORMULA = circles_lib_math_parse_formula( _C_FORMULA );
     		_D_FORMULA = circles_lib_math_parse_formula( _D_FORMULA );

            _A_FORMULA = parse_complex_from_string( _A_FORMULA );
			_B_FORMULA = parse_complex_from_string( _B_FORMULA );
			_C_FORMULA = parse_complex_from_string( _C_FORMULA );
     		_D_FORMULA = parse_complex_from_string( _D_FORMULA );
            _mm = new mobius_map( _A_FORMULA, _B_FORMULA, _C_FORMULA, _D_FORMULA );
        }

        if ( is_mobius_map( _mm ) )
        {
            var _item_obj = circles_lib_find_item_obj_by_map( _glob_seeds_array.concat( _glob_gens_array ), _mm ) ;
            var _trace = _mm.trace(), _determinant = _mm.det();
            var _is_normalized = _mm.is_normalized(), _classification = _mm.classification( NO );
            var _features_html = "<table>" ;
            _features_html += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\">Generator #" + (_index+1) + "</td></tr>" ;
            if ( is_item_obj( _item_obj ) )
            {
                _features_html += "<tr><td HEIGHT=\"7\"></td></tr>" ;
                _features_html += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\">Symbol</td><td WIDTH=\"5\"></td><td VALIGN=\"top\">"+_item_obj.symbol+"</td></tr>" ;
            }
            _features_html += "<tr><td HEIGHT=\"7\"></td></tr>" ;
            _features_html += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\">param a</td><td WIDTH=\"5\"></td><td VALIGN=\"top\">"+_mm.get_a().formula()+"</td></tr>" ;
            _features_html += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\">param b</td><td WIDTH=\"5\"></td><td VALIGN=\"top\">"+_mm.get_b().formula()+"</td></tr>" ;
            _features_html += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\">param c</td><td WIDTH=\"5\"></td><td VALIGN=\"top\">"+_mm.get_c().formula()+"</td></tr>" ;
            _features_html += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\">param d</td><td WIDTH=\"5\"></td><td VALIGN=\"top\">"+_mm.get_d().formula()+"</td></tr>" ;
            _features_html += "<tr><td HEIGHT=\"7\"></td></tr>" ;
            _features_html += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\">Determinant</td><td WIDTH=\"5\"></td><td VALIGN=\"top\">"+( _determinant != null ? _determinant.formula() : "null" )+"</td></tr>" ;
            _features_html += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\">Normalized</td><td WIDTH=\"5\"></td><td VALIGN=\"top\">"+( _is_normalized ? "yes" : "<SPAN STYLE=\"red\">no</SPAN>" )+"</td></tr>" ;
            _features_html += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\">Trace</td><td WIDTH=\"5\"></td><td VALIGN=\"top\">"+( _trace != null ? _trace.formula() : "null" )+"</td></tr>" ;
            _features_html += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\">Classification</td><td WIDTH=\"5\"></td><td VALIGN=\"top\">"+_classification+"</td></tr>" ;
            _features_html += "<tr><td HEIGHT=\"7\"></td></tr>" ;

            if ( !_is_normalized )
            {
               var _copy_mm = new mobius_map();
                   _copy_mm.init_from_obj( _mm );
               _copy_mm.normalize();
               _features_html += "<tr><td HEIGHT=\"7\"></td></tr>" ;
               _features_html += "<tr><td WIDTH=\"3\"></td><td VALIGN=\"top\" COLSPAN=\"3\" STYLE=\"color:blue;\">If normalized</td></tr>" ;
               _features_html += "<tr><td HEIGHT=\"3\"></td></tr>" ;
               _features_html += "<tr><td WIDTH=\"3\"></td><td STYLE=\"color:blue;\" VALIGN=\"top\">New trace</td><td WIDTH=\"5\"></td><td STYLE=\"color:#000098;\" VALIGN=\"top\">"+( _copy_mm.trace().formula() )+"</td></tr>" ;
               _features_html += "<tr><td WIDTH=\"3\"></td><td STYLE=\"color:blue;\" VALIGN=\"top\">New classification</td><td WIDTH=\"5\"></td><td STYLE=\"color:#000098;\" VALIGN=\"top\">" + ( _copy_mm.classification( NO ) ) + "</td></tr>" ;
            }
            _features_html += "</table>" ;
            circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, _features_html, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
        }
        else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "The selected entry is not a consistent Mobius map", 'PLUGIN_OUTMSG' ) ;
    }
    else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Invalid referenced data", 'PLUGIN_OUTMSG' ) ;
}

function CIRCLESembeddingsGENERALPURPOSE_GENERATE_GROUP( _silent, _edit_acquisition, _output_channel )
{
    _silent = safe_int( _silent, NO ), _edit_acquisition = safe_int( _edit_acquisition, YES );
	_output_channel = safe_int( _output_channel, OUTPUT_SPECIAL_FX );
    var _index_ref = _plugin_last_ref, _N_GENS = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 );
	if ( _N_GENS == 0 )
	{
		circles_lib_output( _output_channel, DISPATCH_WARNING, "Can't generate the group: the generators list is empty", 'PLUGIN_OUTMSG' ) ;
		return NO ;
	}
	else
	{
        if ( _glob_method == METHOD_NONE ) { circles_lib_config_create_new_main(YES); circles_lib_method_set( _plugin_method_array[ _index_ref ] ); }
   	    if ( is_array( _glob_gens_array ) ) _glob_gens_array.flush();
        if ( is_array( _glob_seeds_array ) ) _glob_seeds_array.flush();
        if ( is_array( _glob_zplane_selected_items_array ) ) _glob_zplane_selected_items_array.flush();

        GLOB_PLUGIN_CIRCLE_TYPE = $( "#PLUGINcircleCOMBO option:selected" ).val();
        if ( !GLOB_PLUGIN_CIRCLE_TYPE.is_one_of( DRAWENTITY_ISOMETRIC_CIRCLE, DRAWENTITY_INVERSION_CIRCLE, DRAWENTITY_PIXEL, DRAWENTITY_POINT ) )
        GLOB_PLUGIN_CIRCLE_TYPE = DRAWENTITY_ISOMETRIC_CIRCLE ;

        _plugin_rec_configs_array[ _index_ref ] = [] ;

		var GEN_CHUNK = null, _symbol, _inv_symbol, _mm, _inv_mm, _mm_trace_squared ;
	 	var _A_COMPLEX = null, _B_COMPLEX = null, _C_COMPLEX = null, _D_COMPLEX = null, _CC = null, _INV_CC = null, _ret_scan ;
		var _CC_01, _IS_01, _circle01 ;
		var _INV_CC_01, _INV_IS_01, _inv_circle01 ;
		for( var _i = 0 ; _i < _N_GENS ; _i++ )
  		{
			GEN_CHUNK = CIRCLESembeddingsGENERALPURPOSE_gens_container[_i] ;
   			if ( GEN_CHUNK != null )
			{
				_symbol = _glob_caps_letters_array[_i], _inv_symbol = circles_lib_word_inverse_get( _symbol );
				_A_COMPLEX = GEN_CHUNK[0], _B_COMPLEX = GEN_CHUNK[1], _C_COMPLEX = GEN_CHUNK[2], _D_COMPLEX = GEN_CHUNK[3] ;
			    _ret_scan = CIRCLESembeddingsGENERALPURPOSE_SET_REGISTEREDVARS_IN_PARAMS( _edit_acquisition, GEN_CHUNK );
				if ( _A_COMPLEX != null && _B_COMPLEX != null && _C_COMPLEX != null && _D_COMPLEX != null )
				{
					_A_COMPLEX = circles_lib_math_parse_formula( CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array[0] );
					_A_COMPLEX = parse_complex_from_string( _A_COMPLEX + "" );
					_B_COMPLEX = circles_lib_math_parse_formula( CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array[1] );
					_B_COMPLEX = parse_complex_from_string( _B_COMPLEX + "" );
					_C_COMPLEX = circles_lib_math_parse_formula( CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array[2] );
					_C_COMPLEX = parse_complex_from_string( _C_COMPLEX + "" );
					_D_COMPLEX = circles_lib_math_parse_formula( CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array[3] );
					_D_COMPLEX = parse_complex_from_string( _D_COMPLEX + "" );

					if ( is_complex( _A_COMPLEX ) && is_complex( _B_COMPLEX ) && is_complex( _C_COMPLEX ) && is_complex( _D_COMPLEX ) )
					{
						_mm = new mobius_map( _A_COMPLEX, _B_COMPLEX, _C_COMPLEX, _D_COMPLEX );
						_inv_mm = _mm.inv();
						_CC_01 = _mm.inversion_circle(), _IS_01 = _mm.isometric_circle();
						_circle01 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _IS_01 : _CC_01 ;
						_INV_CC_01 = _inv_mm.inversion_circle(), _INV_IS_01 = _inv_mm.isometric_circle();
						_inv_circle01 = GLOB_PLUGIN_CIRCLE_TYPE == DRAWENTITY_ISOMETRIC_CIRCLE ? _INV_IS_01 : _INV_CC_01 ;
				      	_glob_seeds_array.push( new item_obj( _mm, _circle01, null, _symbol, 0,
                                                YES, _glob_draw_seed_color, NO, _glob_fill_seed_color,
                                                _inv_symbol, 1, 0 ) );
				      	_glob_seeds_array.push( new item_obj( _inv_mm, _inv_circle01, null, _inv_symbol, 0,
                                                YES, _glob_draw_inverse_seed_color, NO, _glob_fill_inverse_seed_color,
                                                _symbol, 1, 0 ) );
					}
					else
					{
						var _MSG = "Failure: parameters have not been correctly input in element #"+(_i+1)+"" ;
						if ( !is_complex(_A_COMPLEX ) ) _MSG += _glob_crlf+"Check param 'a'" ;
						if ( !is_complex(_B_COMPLEX ) ) _MSG += _glob_crlf+"Check param 'b'" ;
						if ( !is_complex(_C_COMPLEX ) ) _MSG += _glob_crlf+"Check param 'c'" ;
						if ( !is_complex(_D_COMPLEX ) ) _MSG += _glob_crlf+"Check param 'd'" ;
						_MSG += _glob_crlf+_glob_crlf + "Operation halted: can't generate the group" ;
						if ( !_silent )
						{
							circles_lib_output( _output_channel, DISPATCH_CRITICAL, _MSG, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
							return NO ;
						}
						break ;
					}
				}
				else
				{
					var _MSG = "Memory failure: parameters have not been correctly stored in element #"+(_i+1)+"" ;
						_MSG += _glob_crlf+"Operation halted: can't generate the group" ;
					if ( !_silent )
					{
						circles_lib_output( _output_channel, DISPATCH_CRITICAL, _MSG, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
						return NO ;
					}
					break ;
				}
			}
			else
			{
			    var _MSG = "Memory failure: one element has not been correctly stored" ;
				    _MSG += _glob_crlf+"Operation halted: can't generate the group" ;
			    if ( !_silent )
				{
				    circles_lib_output( _output_channel, DISPATCH_CRITICAL, _MSG, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] );
					return NO ;
				}
				break ;
			}
		}
					
		// take each entry, parse parameters, construct the Mobius map object
		// and fill the standard seeds generators list
      	_glob_dict_create = _glob_items_to_init = YES ;
        circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, YES, _glob_output_channel );
        var _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, NO, YES, _glob_output_channel );
        var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
        var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
        if ( _ret_id == RET_OK )
        {
            _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _glob_output_channel );
            _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
            _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
            if ( _ret_id == RET_OK )
            {
                $("#PLUGIN_GENERATE_GROUP_BTN").css( "color", DEFAULT_COLOR_STD );
                $("#PLUGIN_WHOLEGROUP_LIST_BTN").css( "color", DEFAULT_COLOR_STD );
                if ( $("#PLUGINrenderBTN").get(0) != null ) $("#PLUGINrenderBTN").get(0).setAttribute( "class", "link" );
                GLOB_PLUGIN_WIZARD_STEP(1);
              	circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "The group has been generated with success. Now render it !", 'PLUGIN_OUTMSG' ) ;
                CIRCLESembeddingsGENERALPURPOSE_GENS_REGISTER();
        			  
                $("[id$=initBTN]").css( "color", DEFAULT_COLOR_STD );
                $("[id$=renderBTN]").css( "color", DEFAULT_COLOR_ERROR );
            }
            else if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
		    return YES ;
        }
        else
        {
            $("[id$=initBTN]").css( "color", DEFAULT_COLOR_ERROR );
            $("[id$=renderBTN]").css( "color", DEFAULT_COLOR_STD );
			return NO ;
        }
	}
}

function CIRCLESembeddingsGENERALPURPOSE_PARSE( a_formula, b_formula, c_formula, d_formula )
{
    var _entries = $( "[id^=PLUGIN_PARAM_]" );
    $.each( _entries, function( _i, _id ) { $( _id ).val( $( _id ).val().replaceAll( ",", "." ) ); } );

    var _index_ref = _plugin_last_ref;
    var _a_complex = circles_lib_math_parse_formula( a_formula + "" );
    var _b_complex = circles_lib_math_parse_formula( b_formula + "" );
    var _c_complex = circles_lib_math_parse_formula( c_formula + "" );
    var _d_complex = circles_lib_math_parse_formula( d_formula + "" );
      
    var _RET_MASK = 0 ;
    if ( _a_complex != null ) _RET_MASK |= 1 ;
    if ( _b_complex != null ) _RET_MASK |= 2 ;
    if ( _c_complex != null ) _RET_MASK |= 4 ;
    if ( _d_complex != null ) _RET_MASK |= 8 ;

    if ( _plugin_rec_configs_array[ _index_ref ] == null ) _plugin_rec_configs_array[ _index_ref ] = [];
    _plugin_rec_configs_array[ _index_ref ].push( [ a_formula, b_formula, c_formula, d_formula ] );

    return [ _RET_MASK, _a_complex, _b_complex, _c_complex, _d_complex ] ;
}

function CIRCLESembeddingsGENERALPURPOSE_MAXIMIZE( _div_id, WIDTH, HEIGHT )
{
	var _visible = $( "#PLUGIN_PREVIEW" ).is(":visible") ;
	var _plugin_width = $( "#"+GLOB_PLUGIN_DIV_ID ).width() ;
	var _canvas = $( "#CIRCLESembeddingsGENERALPURPOSE_CANVAS" ).get(0) ;
	_canvas.set_width( _plugin_width - 5 );
    circles_lib_plugin_render_preview( "general.purpose", "embeddings" ) ;
}

function CIRCLESembeddingsGENERALPURPOSE_MINIMIZE( _div_id, WIDTH, HEIGHT )
{
	// further development
}

function CIRCLESembeddingsGENERALPURPOSE_NORMALIZE( _div_id, WIDTH, HEIGHT )
{
	var _visible = $( "#PLUGIN_PREVIEW" ).is(":visible") ;
	var _plugin_width = $( "#"+GLOB_PLUGIN_DIV_ID ).width() ;
	var _canvas = $( "#CIRCLESembeddingsGENERALPURPOSE_CANVAS" ).get(0) ;
	_canvas.set_width( _plugin_width - 5 );
    circles_lib_plugin_render_preview( "general.purpose", "embeddings" ) ;
}