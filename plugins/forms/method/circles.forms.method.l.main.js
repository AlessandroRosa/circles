function CIRCLESformsMETHODclose() { return circles_lib_plugin_dispatcher_unicast_message( "method", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsMETHODmain( _base_id, _move, _tab_index, _new_method, _caller_fn )
{
		if ( is_string( _tab_index ) )
		{
				if ( _tab_index.isAlpha() )
				{
						switch( _tab_index.toLowerCase() )
						{
								case "repetends": _tab_index = 0 ; break ;
								case "gens": _tab_index = 1 ; break ;
								case "ifs": _tab_index = 2 ; break ;
								case "fixedpoints": _tab_index = 3 ; break ;
				        default: break ;
						}
				}
				else _tab_index = safe_int( _tab_index, 0 );
		}
    else if ( !is_number( _tab_index ) ) _tab_index = safe_int( _tab_index, 0 );
console.log( arguments.callee.caller );
    CIRCLESformsMETHODbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    _new_method = safe_int( _new_method, METHOD_NONE );
    CIRCLESformsMETHODtabindex = _tab_index = safe_int( _tab_index, 0 );
    _caller_fn = safe_string( _caller_fn, "" );
    _glob_current_tab['method'] = _tab_index ;

    circles_lib_method_set( _new_method );
    var _items_array = _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ) ;
    var _old_method = _glob_method, old_method_str = "", new_method_str = "" ;
          
    old_method_str = circles_lib_method_get_def( _old_method );
    new_method_str = circles_lib_method_get_def( _glob_method );
      
    var WIDTH = _items_n > 0 ? 550 : 420, HEIGHT = $(window).height() * 0.82, _subset = "forms"  ;
    var _div_id = CIRCLESformsMETHODdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    if ( _caller_fn.length == 0 ) _caller_fn = arguments.callee.name.toString() + "( " + _base_id + ", " + _move + ", " + _glob_method + ")" ;
    var CLOSE_FN = "CIRCLESformsMETHODclose();" ;
    var CLICK_FN = "" ;
    var HTMLcode = "<INPUT TYPE=\"HIDDEN\" ID=\"CIRCLESpairingINDEX01\" VALUE=\""+UNDET+"\"><INPUT TYPE=\"HIDDEN\" ID=\"CIRCLESpairingINDEX02\" VALUE=\""+UNDET+"\">" ;
        HTMLcode += "<table WIDTH=\""+WIDTH+"\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsMETHODcaption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, _caller_fn, _base_id, _div_id, _subset, "tools/tools.01.16x16.png", CLICK_FN );
        HTMLcode += "<tr><td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F2F2F2;\"><table>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"5\"></td><td>Items are switched to <b>"+( _glob_items_switch == ITEMS_SWITCH_SEEDS ? "seeds" : "gens" )+"</b></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "</table></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;
        HTMLcode += "<table WIDTH=\"100%\">" ;
          
    switch ( _glob_method )
    {
        case METHOD_INVERSION:
        HTMLcode += CIRCLESformsMETHODmanagerNOALGEBRAIC( _new_method, _caller_fn );
        break ;
        default:
        HTMLcode += CIRCLESformsMETHODmanagerALGEBRAICpanelBUILD( _new_method, _caller_fn, WIDTH );
        break ;
    }

    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    if ( _div != null )
    {
        circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div.id, CIRCLESformsMETHODcaption );
        CIRCLESformsMETHODctrls( _new_method );
        if ( _move ) move_div( _div.id, "LEFT", "TOP" );
        // fill tab with boxes and fill through all stored repetends (if any)
        var _ctrl_id, _ctrl_edit, _repetend ;
        for( var _i = 0 ; _i < _items_n ; _i++ )
        {
            _repetend = _glob_repetends_array[_i] != null ? _glob_repetends_array[_i] : "" ;
            $("#ALGEBRAICrepetendWORD_" + _i ).val( _repetend );
        }
        CIRCLESformsMETHODmanagerPROCESS( YES, _glob_process );
        // gens table
        CIRCLESgenssetMANAGERgensCOMBOcreate();
        // input (fixed) points table
        if ( _glob_method == METHOD_ALGEBRAIC )
        {
            var _fp_n = circles_lib_count_fixed_points();
            if ( _fp_n > 0 && _glob_process.is_one_of( PROCESS_RANDOM, FIXEDPOINTS_IO_INPUT ) )
            {
               $( "#ALGEBRAICfixedpointsPANELcontainer" ).show();
               CIRCLESformsMETHODfixedpointsLIST();
            }
        }

		    var _len = safe_int( _glob_repetends_array.size_associative(), 0 );
		    if ( _len > 0 ) CIRCLESmethodMANAGERrepetendsLIST();
    }

    tabberAutomatic( CIRCLESMETHODtabberOptions, "CIRCLESMETHOD" );
    var DIV = $( "#CIRCLESMETHODmainDIV" ).get(0);
    if ( DIV != null ) DIV.tabber.tabShow( _tab_index );
    if ( _tab_index == 0 ) $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESmethodMANAGERrepetendsLOAD ) } ;
}

function CIRCLESformsMETHODctrls( _new_method )
{
    var _new_method = safe_int( _new_method, METHOD_NONE );
    if ( _new_method == METHOD_ALGEBRAIC ) $("#CIRCLEScheckboxKLEINIANfill").prop( "checked", NO );
    circles_lib_extras_htmlctrl_enable( "CIRCLEScheckboxKLEINIANfill", _new_method != METHOD_ALGEBRAIC ) ;
}