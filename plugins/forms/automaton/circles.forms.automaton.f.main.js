function CIRCLESformsAUTOMATONclose()
{
		if ( !CIRCLESformsAUTOMATONpending )
		{
		    circles_lib_plugin_dispatcher_unicast_message( "automaton", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE );
				return YES ;
		}
		else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "There are pending entries needing to be filled and saved", _glob_app );		
}

function CIRCLESformsAUTOMATONmaximize()
{
    var _full_width = safe_int( arguments[1], 0 );
    var _full_height = safe_int( arguments[2], 0 );
    CIRCLESformsAUTOMATONresize( _full_width, _full_height );
    CIRCLESformsAUTOMATONstopresize();
    if ( $( "#" + CIRCLESformsAUTOMATONdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLESformsAUTOMATONdiv_id).resizable('enable');
}

function CIRCLESformsAUTOMATONminimize()
{
    var _original_width = safe_int( arguments[1], 0 ), _original_height = safe_int( arguments[2], 0 );
    var _min_width = safe_int( arguments[3], 0 );
    var _min_height = safe_int( arguments[4], 0 );
    CIRCLESformsAUTOMATONresize( _min_width, _min_height );
    CIRCLESformsAUTOMATONstopresize();
    if ( !( $( "#" + CIRCLESformsAUTOMATONdiv_id ).resizable( "option", "disabled" ) ) )
    $("#" + CIRCLESformsAUTOMATONdiv_id).resizable('disable');
}

function CIRCLESformsAUTOMATONnormalize()
{
    var _original_width = safe_int( arguments[1], 0 );
    var _original_height = safe_int( arguments[2], 0 );
    CIRCLESformsAUTOMATONresize( _original_width, _original_height );
    CIRCLESformsAUTOMATONstopresize();
    if ( $( "#" + CIRCLESformsAUTOMATONdiv_id ).resizable( "option", "disabled" ) )
    $("#" + CIRCLESformsAUTOMATONdiv_id).resizable('enable');
}

function CIRCLESformsAUTOMATONmain( _base_id, _move )
{
    CIRCLESformsAUTOMATONbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    _glob_dict_processor.set_process( _DICTIONARY_AUTOMATON_PROCESS );
    _glob_using_automaton = YES ;
		_glob_current_tab['automaton'] = 0 ;
    var CLOSE_FN = "CIRCLESformsAUTOMATONclose()" ;
    var WIDTH = Math.max( 500, $(window).width() * 0.38 ), HEIGHT = "auto" ;
    var _subset = "forms" ;
    var _div_id = CIRCLESformsAUTOMATONdiv_id = circles_lib_plugin_build_divid( _subset, _base_id ) ;
    var HTMLcode = "<table WIDTH=\"100%\" BORDER=\"0\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsAUTOMATONcaption, 3, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "gearwheel/gearwheel.icon.01.16x16.png",
																				 "", "", "CIRCLESformsAUTOMATON" );
        HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
				HTMLcode += "<tr>" ;
		    HTMLcode += "<td>" ;
		    var _abs_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
		    var _rel_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
		    $.ajaxSetup( { async:false } );
		    $.get( _rel_folder_path + "menu.html", function( response ) { HTMLcode += response ; } );
		    HTMLcode += "</td>" ;
				HTMLcode += "</tr>" ;
 
				HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\">" ;

        HTMLcode += CIRCLESformsAUTOMATONconstructorTABLE( _base_id, _subset );

        HTMLcode += "</td>" ;
        HTMLcode += "</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" ID=\"CIRCLESformsAUTOMATONlowerADVICE\" STYLE=\"font-size:12pt;color:#4EA0D2;\">This automaton will drive the dictionary generation<br>as long as this pop-up is open</td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" ID=\"CIRCLESformsAUTOMATONhiddenADVICE\" STYLE=\"display:none;font-size:16pt;color:#F5A02A;\">Enlarge this window<br>to let controls reappear</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;

        HTMLcode += "</table>" ;

        HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
    var _div = circles_lib_plugin_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsAUTOMATONcaption, CLOSE_FN,
                      [ "CIRCLESformsAUTOMATONnormalize", _div_id, WIDTH, HEIGHT ],
                      [ "CIRCLESformsAUTOMATONminimize", _div_id, WIDTH, HEIGHT ],
                      [ "CIRCLESformsAUTOMATONmaximize", _div_id, WIDTH, HEIGHT ] );
    if ( _move && _div != null ) move_div( _div.id, "CENTER", "TOP" );

    if ( $("#"+_div_id ).resizable('instance') != undefined )
    $("#"+_div_id).resizable('destroy').resizable(
    {
      start: function( event, ui ) { CIRCLESformsAUTOMATONstartresize( ui.size.width, ui.size.height ) },
      resize: function( event, ui ) { CIRCLESformsAUTOMATONresize( ui.size.width, ui.size.height ); },
      stop: function( event, ui )   { CIRCLESformsAUTOMATONstopresize( ui.size.width, ui.size.height ) }
    } );
    else
    {
       $("#"+_div_id).resizable(
       {
	      start: function( event, ui ) { CIRCLESformsAUTOMATONstartresize( ui.size.width, ui.size.height ) },
	      resize: function( event, ui ) { CIRCLESformsAUTOMATONresize( ui.size.width, ui.size.height ); },
	      stop: function( event, ui )   { CIRCLESformsAUTOMATONstopresize( ui.size.width, ui.size.height ) }
       } );
    }
    $("#"+_div_id).resizable().on('resize', function (event) { if ( event.stopPropagation ) event.stopPropagation(); if ( event.cancelBubble != null ) event.cancelBubble = true; });

    CIRCLESformsAUTOMATONtablePULLOUT( YES );
    circles_lib_plugin_dispatcher_unicast_message( 'dictionary', "forms", 2.1 );
    $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESformsAUTOMATONload ) } ;
}

function CIRCLESformsAUTOMATONstartresize( _new_width, _new_height ) { }
function CIRCLESformsAUTOMATONstopresize( _new_width, _new_height ) { }

function CIRCLESformsAUTOMATONresize( _new_width, _new_height )
{
    var _hide_word = _new_width < 470 || _new_height < 102 ;
    var _hide_preset = _new_width < 470 || _new_height < 132 ;
    var _hide_newword = _new_width < 470 || _new_height < 159 ;
    var _hide_automaton_table = _new_width < 420 || _new_height < 210 ;
    var _hide_lower_advice = _new_width < 470 || _new_height < 250 ;
    
    var _empty = _hide_word && _hide_preset && _hide_newword && _hide_automaton_table && _hide_lower_advice ? 1 : 0 ;
    
    $( "#CIRCLESformsAUTOMATONwordBAR" ).css( "display", _hide_word ? "none" : "block" );
    $( "#CIRCLESformsAUTOMATONpresetsBAR" ).css( "display", _hide_preset ? "none" : "block" );
    $( "#CIRCLESformsAUTOMATONnewwordBAR" ).css( "display", _hide_newword ? "none" : "block" );
    $( "#CIRCLESformsAUTOMATONpanelCONTAINER" ).css( "display", _hide_automaton_table ? "none" : "block" );
    $( "#CIRCLESformsAUTOMATONlowerADVICE" ).css( "display", _hide_lower_advice ? "none" : "block" );
    $( "#CIRCLESformsAUTOMATONhiddenADVICE" ).css( "display", _empty ? "block" : "none" );
    
    if ( !_hide_automaton_table )
    {
				 var _table_height = _new_height ;
				 		 _table_height -= 28 ; // caption
				 		 _table_height -= 28 ; // bar under caption
				 		 _table_height -= 28 ; // menu
				 		 _table_height -= !_hide_word ? 24 : 0 ;
				 		 _table_height -= !_hide_preset ? 24 : 0 ;
				 		 _table_height -= !_hide_newword ? 24 : 0 ;
				 		 _table_height -= !_hide_lower_advice ? 48 : 0 ;
				 $( "#CIRCLESformsAUTOMATONpanelCONTAINERwrappingDIV" ).height( _table_height );
		}
}