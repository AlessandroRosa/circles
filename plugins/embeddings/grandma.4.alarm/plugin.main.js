function CIRCLESembeddingsGRANDMA4ALARMclose() { return circles_lib_plugin_dispatcher_unicast_message( 'grandma.4.alarm', "embeddings", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESembeddingsGRANDMA4ALARM_TIPS()
{
    var _index_ref = _plugin_main_ref + "";
    var _tips = [];
        _tips.push( "- For faster inputs, write one row with multiple params, separared by comma, and type enter." );
        _tips.push( "- Then press 'enter' multiple times to process along the init and rendering stages." );
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, _tips.join( "<br>" ), _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] + " - Tips" );
}

function CIRCLESembeddingsGRANDMA4ALARM_PARAMS_FILL()
{
    var _entries = 0 ;
    if ( arguments[0] != null )
    {
        var _a = new complex( arguments[0].real, arguments[0].imag );
        $( "#PLUGIN_PARAM_A" ).val( _a.formula() );
        _entries++ ;
    }

    if ( arguments[1] != null )
    {
        var _b = new complex( arguments[1].real, arguments[1].imag );
        $( "#PLUGIN_PARAM_B" ).val( _b.formula() );
        _entries++ ;
    }

    if ( arguments[2] != null )
    {
        var _c = new complex( arguments[2].real, arguments[2].imag );
        $( "#PLUGIN_PARAM_AB" ).val( _c.formula() );
        _entries++ ;
    }

    if ( _entries == 3 )
    {
        CIRCLESembeddingsGRANDMA4ALARM_INIT(NO,YES);
        GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
        CIRCLESembeddingsGRANDMA4ALARM_COMP(0);
        CIRCLESembeddingsGRANDMA4ALARM_CONFIG();
        GLOB_PLUGIN_WIZARD_STEP(1.1,YES);
    }
}

function CIRCLESembeddingsGRANDMA4ALARM_EVENTS( ctrl_id, event )
{
	  if ( event.stopPropagation )      event.stopPropagation();
	  if ( event.cancelBubble != null ) event.cancelBubble = true;

		switch( event.keyCode )
		{
				case 13: // return
				if ( ctrl_id.is_one_of( "PLUGIN_PARAM_A", "PLUGIN_PARAM_B", "PLUGIN_PARAM_AB" ) )
				{
             if ( ctrl_id.strcmp( "PLUGIN_PARAM_A" ) )
             {
                  $("#PLUGIN_PARAM_B").focus();
                  var _a_text = $("#PLUGIN_PARAM_A").val();
                  if ( _a_text.includes( "," ) )
                  {
                      var _entries = _a_text.replaceAll( ";", "," ).split( "," );
                      for( var _i = 0 ; _i < _entries.length ; _i++ )
                      {
                           if ( _i == 0 ) $("#PLUGIN_PARAM_A").val( _entries[_i].trim() );
                           else if ( _i == 1 ) $("#PLUGIN_PARAM_B").val( _entries[_i].trim() );
                           else if ( _i == 2 ) $("#PLUGIN_PARAM_AB").val( _entries[_i].trim() );
                      }
                  }
             }
             else if ( ctrl_id.strcmp( "PLUGIN_PARAM_B" ) ) $("#PLUGIN_PARAM_AB").focus();
             else if ( ctrl_id.strcmp( "PLUGIN_PARAM_AB" ) )
             {
    						 if ( _plugin_step_index == 0 )
                 {
                     CIRCLESembeddingsGRANDMA4ALARM_INIT(NO,YES);
        						 CIRCLESembeddingsGRANDMA4ALARM_COMP(0);
                 }
                 if ( _plugin_step_index == 0 ) GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
                 else if ( _plugin_step_index == 0.1 ) { CIRCLESembeddingsGRANDMA4ALARM_CONFIG(); GLOB_PLUGIN_WIZARD_STEP(1.1,YES); GLOB_PLUGIN_GENS_SHOW(YES); }
                 else if ( _plugin_step_index.is_one_of( 1.1, 2.1 ) )
                 {
                    if ( _plugin_step_index == 1.1 ) CIRCLESembeddingsGRANDMA4ALARM_RECORD_PARAMS();
                    GLOB_PLUGIN_WIZARD_STEP(2.1);
                    GLOB_PLUGIN_GENS_SHOW(YES);
								    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;
                 }
             }
				}
				break ;
        default:
        if ( _plugin_step_index.is_one_of( UNDET, 2.1 ) ) GLOB_PLUGIN_WIZARD_STEP(0,NO);
        _plugin_step_index = 0 ;
        GLOB_PLUGIN_WIZARD_STEP(0,NO);
        break ;
		}
}

function CIRCLESembeddingsGRANDMA4ALARM_PATTERNS()
{
    GLOB_PLUGIN_FLUSH_PATTERNS();
    _plugin_additional_html_text += "... too complicate to be shown here ... refer to Indra's Pearl book .." ;
}

function CIRCLESembeddingsGRANDMA4ALARM_CONFIG( _base_id )
{
    _plugin_main_ref = safe_string( _base_id + "", _plugin_main_ref ) ;
    var _index_ref = _plugin_main_ref + "";
    _plugin_input_mode_mask_array[_index_ref] = PLUGIN_INPUT_MODE_RIGID ;
    _plugin_method_array[_index_ref] = METHOD_ALGEBRAIC ; 
    _plugin_definitions_array[_index_ref] = "Grandma's special four-alarm two gens groups" ;
    _plugin_info_array[_index_ref] = "Refer to 'Indra's Pearls'" ;
    _plugin_info_array[_index_ref] += _glob_crlf + "by David Mumford, Caroline Series, David Wright" ;
    _plugin_info_array[_index_ref] += _glob_crlf + "Cambridge Press, 2002" ;
    _plugin_info_array[_index_ref] += _glob_crlf + "Generators can be found at p. 261" ;
    _plugin_vars_array[_index_ref] = { 'a' : { formula : 'CIRCLESembeddingsGRANDMA4ALARM_trA', label : 'CIRCLESembeddingsGRANDMA4ALARM_trA_complex', type : 'complex', role : 'trace', value : new complex( 0.0, 0.0 ) },
                                                          'b' : { formula : 'CIRCLESembeddingsGRANDMA4ALARM_trB', label : 'CIRCLESembeddingsGRANDMA4ALARM_trB_complex', type : 'complex', role : 'trace', value : new complex( 0.0, 0.0 ) },
                                                          'ab' : { formula : 'CIRCLESembeddingsGRANDMA4ALARM_trAB', label : 'CIRCLESembeddingsGRANDMA4ALARM_trAB_complex', type : 'complex', role : 'trace', value : new complex( 0.0, 0.0 ) },
                                                          'p' : { formula : 'CIRCLESembeddingsGRANDMA4ALARM_param', label : 'CIRCLESembeddingsGRANDMA4ALARM_param', type : 'integer', role : 'solutions switch param', value : 1 }
                                                        } ;
    _plugin_run_fn_array[_index_ref] = "CIRCLESembeddingsGRANDMA4ALARM_PARSE( CIRCLESembeddingsGRANDMA4ALARM_trA, CIRCLESembeddingsGRANDMA4ALARM_trB, CIRCLESembeddingsGRANDMA4ALARM_trAB );CIRCLESembeddingsGRANDMA4ALARM_COMP(0);" ;

    _glob_submethod_desc = _plugin_definitions_array[_index_ref] ;
    _glob_submethod_desc = safe_string( _glob_submethod_desc, "" );
    _plugin_init_fns_array[_index_ref] = "CIRCLESembeddingsGRANDMA4ALARM_CONFIG" ;
    _glob_target_plane = W_PLANE ;
		circles_lib_drawentity_set( DRAWENTITY_PIXEL );
    circles_lib_method_set( METHOD_ALGEBRAIC );
    if ( _glob_depth <= 1 ) circles_lib_depth_set( 8, YES );
    CIRCLESembeddingsGRANDMA4ALARM_PRESETS_INIT();
}

function CIRCLESembeddingsGRANDMA4ALARM_RECORD_PARAMS()
{
    var _index_ref = _plugin_last_ref;
    var _ret_chunk = GLOB_PLUGIN_PARAMS_REGISTER( _index_ref, "#PLUGIN_PARAM_A", "#PLUGIN_PARAM_B", "#PLUGIN_PARAM_AB",
                                                  $( "#PLUGIN_PARAM_A" ).val(), $( "#PLUGIN_PARAM_B" ).val(), $( "#PLUGIN_PARAM_AB" ).val() );
    var _ret_id = safe_int( _ret_chunk[0], RET_ERROR );
    var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
    _glob_target_plane = W_PLANE ;
    var _html = GLOB_PLUGIN_PARAMS_COMBO_CODE_GET(_index_ref);
    if ( _ret_id == RET_OK ) $( "#PLUGINparamsCOMBOcontainer" ).html( _html );
    else if ( _ret_id == RET_ERROR ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, _ret_msg, 'PLUGIN_OUTMSG' ) ;
}

function CIRCLESembeddingsGRANDMA4ALARMmain( _base_id, _move, _restore )
{
    _move = is_string( _move ) ? _move : safe_int( _move, YES ), _restore = safe_int( _restore, NO );
    var _clean_base_id = _base_id.replace( /[\.\_\-]/g, "" ) ;
    CIRCLESembeddingsGRANDMA4ALARM_CONFIG( _base_id );
		_plugin_last_ref = _plugin_main_ref ;
    _glob_palette_use = NO ;
    var _index_ref = _plugin_last_ref;
    var _items_n = circles_lib_count_items();
    var _this_fn_name = "CIRCLESembeddingsGRANDMA4ALARMmain" + "(NO,"+_restore+")" ;

    CIRCLESembeddingsGRANDMA4ALARM_PATTERNS();
    if ( _restore )
    {
         GLOB_PLUGIN_VARS_PATTERN_RESTORE(_index_ref);
         GLOB_PLUGIN_VARS_PATTERN_FILL(_index_ref);
    }
    else if ( _plugin_tmp_vars_array['embeddings@grandma4alarm'] != null )
    {
      if ( _plugin_tmp_vars_array['embeddings@grandma4alarm']['a'] != null )
      CIRCLESembeddingsGRANDMA4ALARM_trA = _plugin_tmp_vars_array['embeddings@grandma4alarm']['a'] ;

      if ( _plugin_tmp_vars_array['embeddings@grandma4alarm']['b'] != null )
      CIRCLESembeddingsGRANDMA4ALARM_trB = _plugin_tmp_vars_array['embeddings@grandma4alarm']['b'] ;

      if ( _plugin_tmp_vars_array['embeddings@grandma4alarm']['ab'] != null )
      CIRCLESembeddingsGRANDMA4ALARM_trAB = _plugin_tmp_vars_array['embeddings@grandma4alarm']['ab'] ;

      if ( _plugin_tmp_vars_array['embeddings@grandma4alarm']['p'] != null )
      CIRCLESembeddingsGRANDMA4ALARM_param = _plugin_tmp_vars_array['embeddings@grandma4alarm']['p'] ;
    }

    var SW = $(window).width(), SH = $(window).height();
    var _init_btn_clr = CELLgetCLR( "STATUSBARinitBTN" );
    var _draw_btn_clr = CELLgetCLR( "STATUSBARrenderBTN" );

    var _div_id = GLOB_PLUGIN_DIV_ID, _subset = "embeddings" ;
    var CLOSE_FN = "CIRCLES"+_subset+_clean_base_id.toUpperCase()+"close();" ;
    var WIDTH = 450, HEIGHT = "auto" ;
    GLOB_PLUGIN_BASE_ID = _clean_base_id, GLOB_PLUGIN_SUBSET = _subset ;

    var HTMLcode = "<table WIDTH=\""+WIDTH+"\" ID=\"PLUGINmasterTABLE\">" ;
    HTMLcode += circles_lib_plugin_caption_code( YES, _glob_submethod_desc, 1, YES, CLOSE_FN, WIDTH, HEIGHT,
                _this_fn_name, 'grandma.4.alarm', _div_id, _subset, "plug/plug.icon.01.20x20.png", "", "", "CIRCLES"+_subset+"GRANDMA4ALARM_",
																								[ "CIRCLESembeddingsGRANDMA4ALARM_NORMALIZE", _div_id, WIDTH, HEIGHT ],
																								[ "CIRCLESembeddingsGRANDMA4ALARM_MINIMIZE", _div_id, WIDTH, HEIGHT ],
																								[ "CIRCLESembeddingsGRANDMA4ALARM_MAXIMIZE", _div_id, WIDTH, HEIGHT ] );
    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<table WIDTH=\"100%\">" ;
    HTMLcode += "<tr>" ;

    HTMLcode += "<td>" ;
    var _abs_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
    var _rel_folder_path = "plugins/"+_subset+"/"+_base_id+"/" ;
    $.ajaxSetup( { async:false } );
    $.get( _rel_folder_path + "menu.html", function( response ) { HTMLcode += response.replaceAll( "%indexref%", "'"+_index_ref+"'" ) ; } );
    HTMLcode += "</td>" ;

    HTMLcode += "</tr>" ;
    
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"22\"><DIV ID=\"PLUGIN_OUTMSG\" CLASS=\"general_rounded_corners\" STYLE=\"height:18px;background-color:white;\" ALIGN=\"center\"></DIV></td></tr>" ;
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
    HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"padding:5px;background-color:#F0F0F0;\">" ;
    HTMLcode += "<table WIDTH=\"100%\">" ;
    
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\" ID=\"PLUGIN_PRESETS_CONTAINER\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td>Presets</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td>"+CIRCLESembeddingsGRANDMA4ALARM_PRESETS(1)+"</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsGRANDMA4ALARM_PRESETS(2);\">Apply</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_toggle_preview('"+_base_id+"','"+_subset+"',function(){ CIRCLES"+_subset.toLowerCase()+_clean_base_id.toUpperCase()+"_PRESETS(2,YES); });\" ID=\"PLUGIN_TOGGLE_PREVIEW_BTN\">Show preview</td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td ID=\"PLUGINcomboLABEL\" VALIGN=\"top\" STYLE=\"display:"+( GLOB_PLUGIN_PARAMS_EXIST(_index_ref) ? "block" : "none" )+";\">Latest params</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td ID=\"PLUGINparamsCOMBOcontainer\" VALIGN=\"top\">"+GLOB_PLUGIN_PARAMS_COMBO_CODE_GET(_index_ref)+"</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
    
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\" HEIGHT=\"22\" WIDTH=\"100%\">" ;
    HTMLcode += "<table HEIGHT=\"22\">" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td>Enter complex formula</td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td>Display</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td><table><tr><td><SELECT ID=\"PLUGINcircleCOMBO\" ONCHANGE=\"javascript:CIRCLESembeddingsGRANDMA4ALARM_INIT(NO,YES);GLOB_PLUGIN_WIZARD_STEP(0.1,NO);CIRCLESembeddingsGRANDMA4ALARM_COMP();CIRCLESembeddingsGRANDMA4ALARM_CONFIG();GLOB_PLUGIN_WIZARD_STEP(1.1,YES);CIRCLESembeddingsGRANDMA4ALARM_PRESETS(2,YES);\"><OPTION VALUE=\""+DRAWENTITY_ISOMETRIC_CIRCLE+"\">Isometric<OPTION VALUE=\""+DRAWENTITY_INVERSION_CIRCLE+"\">Inversion</SELECT></td></tr></table></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\">circles</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>Tr<sub>a</sub></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:300px;\" ID=\"PLUGIN_PARAM_A\" VALUE=\""+( CIRCLESembeddingsGRANDMA4ALARM_trA != null ? CIRCLESembeddingsGRANDMA4ALARM_trA : "0.0" )+"\" ONKEYUP=\"javascript:$('#PLUGINsetBTN').attr('class','link');$('#PLUGINsetBTN').css('color',COLOR_ERROR ) ;CIRCLESembeddingsGRANDMA4ALARM_EVENTS(this.id,event);\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>Tr<sub>b</sub></td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:300px;\" ID=\"PLUGIN_PARAM_B\" VALUE=\""+( CIRCLESembeddingsGRANDMA4ALARM_trB != null ? CIRCLESembeddingsGRANDMA4ALARM_trB : "0.0" )+"\" ONKEYUP=\"javascript:$('#PLUGINsetBTN').attr('class','link');$('#PLUGINsetBTN').css('color',COLOR_ERROR ) ;CIRCLESembeddingsGRANDMA4ALARM_EVENTS(this.id,event);\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>Tr<sub>ab</sub></td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:300px;\" ID=\"PLUGIN_PARAM_AB\" VALUE=\""+( CIRCLESembeddingsGRANDMA4ALARM_trAB != null ? CIRCLESembeddingsGRANDMA4ALARM_trAB : "0.0" )+"\" ONKEYUP=\"javascript:$('#PLUGINsetBTN').attr('class','link');$('#PLUGINsetBTN').css('color',COLOR_ERROR ) ;CIRCLESembeddingsGRANDMA4ALARM_EVENTS(this.id,event);\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    var _CANVAS_W = WIDTH - 10, _CANVAS_H = Math.floor( _CANVAS_W / 2 ) ;
    HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\"100%\"><DIV ID=\"PLUGIN_PREVIEW\" STYLE=\"position:relative;height:auto;display:none;\"><table><tr><td VALIGN=\"top\" ALIGN=\"center\"><CANVAS CLASS=\"general_rounded_corners\" STYLE=\"border:1px solid #D0D0D0;width:"+_CANVAS_W+"px;height:"+_CANVAS_H+"px;\" WIDTH=\""+_CANVAS_W+"\" HEIGHT=\""+_CANVAS_H+"\" ID=\"CIRCLESembeddings"+( _clean_base_id.toUpperCase() )+"_CANVAS\"></CANVAS></td></tr><tr><td HEIGHT=\"4\"></td></tr></table></DIV></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\"100%\"><DIV ID=\"PLUGIN_CONTAINER\" STYLE=\"position:relative;width:100%;height:auto;display:none;\"></DIV></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\"100%\"><DIV ID=\"PLUGIN_PATTERNS\" STYLE=\"position:relative;width:100%;height:auto;display:none;\"></DIV></td></tr>" ;
    HTMLcode += "</table>" ;
    
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, _this_fn_name, arguments, 'embeddings', OPEN, _div.id, _glob_submethod_desc, [ "CIRCLESembeddingsGRANDMA4ALARM_NORMALIZE", _div_id, WIDTH, HEIGHT ], [ "CIRCLESembeddingsGRANDMA4ALARM_MINIMIZE", _div_id, WIDTH, HEIGHT ], [ "CIRCLESembeddingsGRANDMA4ALARM_MAXIMIZE", _div_id ] );
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
          
	  $("#"+_div_id).bind( "click", function() { GLOB_PLUGIN_FOCUS( _base_id ); } );

    if ( CIRCLESembeddingsGRANDMA4ALARM_active )
    {
         CIRCLESembeddingsGRANDMA4ALARM_INIT(NO,YES);
         CIRCLESembeddingsGRANDMA4ALARM_COMP(0);
    }
    else
    {
        $( "#PLUGIN_GENSTOGGLE_BTN" ).html( "Show panel" );
        $( "#PLUGIN_CONTAINER" ).hide();
        $( "#PLUGIN_PATTERNS" ).hide();
    }

    TABINDEXorderSET( "#PLUGIN_PARAM_A", "#PLUGIN_PARAM_B", "#PLUGIN_PARAM_AB", "#PLUGINSconfigCOMBO" );
    GLOB_PLUGIN_EVENT_PROPAGATION_MANAGEMENT( 1 );

    var DROPDOWN = $( "#CIRCLESchoose"+_base_id.replace( /[\.\_\-]/g, "" ).toUpperCase()+"canvasDROPDOWN" ).get(0) ;
    if ( DROPDOWN != null ) DROPDOWN.options[0].text = "Preview canvas" ;
}

function CIRCLESembeddingsGRANDMA4ALARM_CALL_METHOD( fn )
{
    if ( CIRCLESembeddingsGRANDMA4ALARM_param != 0 ) circles_lib_plugin_load('forms','method', YES, 1, _glob_method, fn );
    else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Please, apply a solution first.", 'PLUGIN_OUTMSG' ) ;
}
function CIRCLESembeddingsGRANDMA4ALARM_MAXIMIZE( _div_id, WIDTH, HEIGHT )
{
		var _visible = $( "#PLUGIN_PREVIEW" ).is(":visible") ;
		var _plugin_width = $( "#"+GLOB_PLUGIN_DIV_ID ).width() ;
		var _canvas = $( "#CIRCLESembeddingsGRANDMA4ALARM_CANVAS" ).get(0) ;
		_canvas.set_width( _plugin_width - 5 );
    circles_lib_plugin_render_preview( "grandma.4.alarm", "embeddings" ) ;
}

function CIRCLESembeddingsGRANDMA4ALARM_MINIMIZE( _div_id, WIDTH, HEIGHT )
{
}

function CIRCLESembeddingsGRANDMA4ALARM_NORMALIZE( _div_id, WIDTH, HEIGHT )
{
		var _visible = $( "#PLUGIN_PREVIEW" ).is(":visible") ;
		var _plugin_width = $( "#"+GLOB_PLUGIN_DIV_ID ).width() ;
		var _canvas = $( "#CIRCLESembeddingsGRANDMA4ALARM_CANVAS" ).get(0) ;
		_canvas.set_width( _plugin_width - 5 );
    circles_lib_plugin_render_preview( "grandma.4.alarm", "embeddings" ) ;
}