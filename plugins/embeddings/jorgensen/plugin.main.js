function CIRCLESembeddingsJORGENSEN_TIPS()
{
    var _index_ref = _plugin_main_ref + "";
    var _tips = [];
        _tips.push( "- For faster inputs, write one row with multiple params, separared by comma, and type enter." );
        _tips.push( "- Then press 'enter' multiple times to process along the init and rendering stages." );
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, _tips.join( "<br>" ), _glob_app + " - " + _plugin_definitions_array[_plugin_last_ref] + " - Tips" );
}

function CIRCLESembeddingsJORGENSEN_PARAMS_FILL()
{
    var _entries = 0 ;
    if ( arguments[0] != null )
    {
        $( "#PLUGIN_PARAM_ALPHA" ).val( is_complex( arguments[0] ) ? ( new complex( arguments[0].real, arguments[0].imag ) ).formula() : arguments[0] );
        _entries++ ;
    }

    if ( arguments[1] != null )
    {
        $( "#PLUGIN_PARAM_BETA" ).val( is_complex( arguments[1] ) ? ( new complex( arguments[1].real, arguments[1].imag ) ).formula() : arguments[1] );
        _entries++ ;
    }

    if ( _entries == 2 )
    {
        CIRCLESembeddingsJORGENSEN_INIT(NO,YES);
        GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
        CIRCLESembeddingsJORGENSEN_COMP();
        CIRCLESembeddingsJORGENSEN_CONFIG();
        GLOB_PLUGIN_WIZARD_STEP(1.1,YES);
    }
}

function CIRCLESembeddingsJORGENSEN_EVENTS( ctrl_id, event )
{
	  if ( event.stopPropagation )      event.stopPropagation();
	  if ( event.cancelBubble != null ) event.cancelBubble = true;

		switch( event.keyCode )
		{
				case 13: // return
				if ( ctrl_id.is_one_of( "PLUGIN_PARAM_ALPHA", "PLUGIN_PARAM_BETA" ) )
  			{
           if ( ctrl_id.strcmp( "PLUGIN_PARAM_ALPHA" ) )
           {
              $("#PLUGIN_PARAM_BETA").focus();
              var _a_text = $("#PLUGIN_PARAM_ALPHA").val();
              if ( _a_text.includes( "," ) )
              {
                 var _entries = _a_text.replaceAll( ";", "," ).split( "," );
                 for( var _i = 0 ; _i < _entries.length ; _i++ )
                 {
                    if ( _i == 0 ) $("#PLUGIN_PARAM_ALPHA").val( _entries[_i].trim() );
                    else if ( _i == 1 ) $("#PLUGIN_PARAM_BETA").val( _entries[_i].trim() );
                 }
              }
           }
           else if ( ctrl_id.strcmp( "PLUGIN_PARAM_BETA" ) )
           {
    				  if ( _plugin_step_index == 0 )
              {
                 CIRCLESembeddingsJORGENSEN_INIT(NO,YES);
        				 CIRCLESembeddingsJORGENSEN_COMP(CIRCLESembeddingsJORGENSEN_param);
              }
              if ( _plugin_step_index == 0 ) GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
              else if ( _plugin_step_index == 0.1 ) { CIRCLESembeddingsJORGENSEN_CONFIG(); GLOB_PLUGIN_WIZARD_STEP(1.1,_glob_items_to_init); GLOB_PLUGIN_GENS_SHOW( YES ); }
              else if ( _plugin_step_index.is_one_of( 1.1, 2.1 ) )
              {
                 if ( _plugin_step_index == 1.1 ) CIRCLESembeddingsJORGENSEN_RECORD_PARAMS();
                 GLOB_PLUGIN_WIZARD_STEP(2.1);
                 GLOB_PLUGIN_GENS_SHOW( YES );
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

function CIRCLESembeddingsJORGENSEN_CONFIG( _base_id )
{
    _plugin_main_ref = safe_string( _base_id + "", _plugin_main_ref ) ;
    var _index_ref = _plugin_main_ref + "";
    _plugin_input_mode_mask_array[_index_ref] = PLUGIN_INPUT_MODE_RIGID ;
    _plugin_method_array[_index_ref] = METHOD_ALGEBRAIC ; 
    _plugin_definitions_array[_index_ref] = "Jorgensen's embedding" ;
    _plugin_info_array[_index_ref] = "Refer to 'Indra's Pearls'" ;
    _plugin_info_array[_index_ref] += _glob_crlf + "by David Mumford, Caroline Series, David Wright" ;
    _plugin_info_array[_index_ref] += _glob_crlf + "Cambridge Press, 2002" ;
    _plugin_info_array[_index_ref] += _glob_crlf + "Generators can be found at p. 256" ;
    _plugin_vars_array[_index_ref] = { 'a' : { formula : 'CIRCLESembeddingsJORGENSEN_alpha', label : 'CIRCLESembeddingsJORGENSEN_alpha_complex', type : 'complex', role : 'trace', value : new complex( 0.0, 0.0 ) },
                                       'b' : { formula : 'CIRCLESembeddingsJORGENSEN_beta', label : 'CIRCLESembeddingsJORGENSEN_beta_complex', type : 'complex', role : 'trace', value : new complex( 0.0, 0.0 ) },
                                       'p' : { formula : 'CIRCLESembeddingsJORGENSEN_param', label : 'CIRCLESembeddingsJORGENSEN_param', type : 'integer', role : 'solutions switch param', value : 1 }
                                     } ;
    _plugin_run_fn_array[_index_ref] = "CIRCLESembeddingsJORGENSEN_PARSE( CIRCLESembeddingsJORGENSEN_alpha, CIRCLESembeddingsJORGENSEN_beta );CIRCLESembeddingsJORGENSEN_CALC( CIRCLESembeddingsJORGENSEN_alpha_complex, CIRCLESembeddingsJORGENSEN_beta_complex );CIRCLESembeddingsJORGENSEN_COMP( CIRCLESembeddingsJORGENSEN_param );" ;

    _glob_submethod_desc = _plugin_definitions_array[_index_ref] ;
    _glob_submethod_desc = safe_string( _glob_submethod_desc, "" );
    _plugin_init_fns_array[_index_ref] = arguments.callee.name ;
    _glob_target_plane = W_PLANE ;
		circles_lib_drawentity_set( DRAWENTITY_PIXEL );
    circles_lib_method_set( METHOD_ALGEBRAIC );
    if ( _glob_depth <= 1 ) circles_lib_depth_set( 8, YES );
    CIRCLESembeddingsJORGENSEN_PRESETS_INIT();
}

function CIRCLESembeddingsJORGENSEN_RECORD_PARAMS()
{
    var _index_ref = _plugin_last_ref;
    var _ret_chunk = GLOB_PLUGIN_PARAMS_REGISTER( _index_ref, "#PLUGIN_PARAM_ALPHA", "#PLUGIN_PARAM_BETA",
			                                            $( "#PLUGIN_PARAM_ALPHA" ).val(), $( "#PLUGIN_PARAM_BETA" ).val() );
    var _ret_id = safe_int( _ret_chunk[0], RET_ERROR );
    var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
    var _html = GLOB_PLUGIN_PARAMS_COMBO_CODE_GET(_index_ref);
    _glob_target_plane = W_PLANE ;
    if ( _ret_id == RET_OK ) $( "#PLUGINparamsCOMBOcontainer" ).html( _html );
    else if ( _ret_id == RET_ERROR ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, _ret_msg, 'PLUGIN_OUTMSG' ) ;
}

function CIRCLESembeddingsJORGENSENmain( _base_id, _move, _restore )
{
    _move = is_string( _move ) ? _move : safe_int( _move, YES ), _restore = safe_int( _restore, NO );
    var _clean_base_id = _base_id.replace( /[\.\_\-]/g, "" ) ;
    CIRCLESembeddingsJORGENSEN_CONFIG( _base_id );
		_plugin_last_ref = _plugin_main_ref ;
    _glob_palette_use = NO ;
    var _index_ref = _plugin_last_ref;
    var _items_n = circles_lib_count_items();
    var this_fn_name = arguments.callee.name + "(NO,"+_restore+")" ;

    CIRCLESembeddingsJORGENSEN_PATTERNS();
    if ( _restore )
    {
        GLOB_PLUGIN_VARS_PATTERN_RESTORE(_index_ref);
        GLOB_PLUGIN_VARS_PATTERN_FILL(_index_ref);
    }
    else if ( _plugin_tmp_vars_array['embeddings@jorgensen'] != null )
    {
      if ( _plugin_tmp_vars_array['embeddings@jorgensen']['a'] != null )
      CIRCLESembeddingsJORGENSEN_alpha = _plugin_tmp_vars_array['embeddings@jorgensen']['a'] ;

      if ( _plugin_tmp_vars_array['embeddings@jorgensen']['b'] != null )
      CIRCLESembeddingsJORGENSEN_beta = _plugin_tmp_vars_array['embeddings@jorgensen']['b'] ;

      if ( _plugin_tmp_vars_array['embeddings@jorgensen']['p'] != null )
      CIRCLESembeddingsJORGENSEN_param = _plugin_tmp_vars_array['embeddings@jorgensen']['p'] ;
    }

    var SW = $(window).width(), SH = $(window).height();
    var _init_btn_clr = CELLgetCLR( "STATUSBARinitBTN" );
    var _draw_btn_clr = CELLgetCLR( "STATUSBARrenderBTN" );
    var _div_id = GLOB_PLUGIN_DIV_ID, _subset = "embeddings" ;
    GLOB_PLUGIN_BASE_ID = _clean_base_id, GLOB_PLUGIN_SUBSET = _subset ;

    var WIDTH = 450, HEIGHT = "auto" ;
    var HTMLcode = "<table WIDTH=\""+WIDTH+"\" ID=\"PLUGINmasterTABLE\">" ;
    HTMLcode += circles_lib_plugin_caption_code( YES, _glob_submethod_desc, 1, YES, "GLOB_PLUGIN_DESTROY_POPUP_VARS();", WIDTH, HEIGHT, this_fn_name, 'jorgensen', _div_id, _subset, "plug/plug.icon.01.16x16.png", "", "", "CIRCLES"+_subset+"JORGENSEN_",
																								[ "CIRCLESembeddingsJORGENSEN_NORMALIZE", _div_id, WIDTH, HEIGHT ],
																								[ "CIRCLESembeddingsJORGENSEN_MINIMIZE", _div_id, WIDTH, HEIGHT ],
																								[ "CIRCLESembeddingsJORGENSEN_MAXIMIZE", _div_id, WIDTH, HEIGHT ] );
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
    HTMLcode += "<table>" ;
    
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\" ID=\"PLUGIN_PRESETS_CONTAINER\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td>Presets</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td>"+CIRCLESembeddingsJORGENSEN_PRESETS(1,NO)+"</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESembeddingsJORGENSEN_PRESETS(2,NO);\">Apply</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
    
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\" HEIGHT=\"22\">" ;
    HTMLcode += "<table HEIGHT=\"22\">" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td>Enter any complex formula</td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td>Display</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td><table><tr><td><SELECT ID=\"PLUGINcircleCOMBO\" ONCHANGE=\"javascript:CIRCLESembeddingsJORGENSEN_INIT(NO,YES);GLOB_PLUGIN_WIZARD_STEP(0.1,NO);CIRCLESembeddingsJORGENSEN_COMP();CIRCLESembeddingsJORGENSEN_CONFIG();GLOB_PLUGIN_WIZARD_STEP(1.1,YES);CIRCLESembeddingsJORGENSEN_PRESETS(2,YES);\"><OPTION VALUE=\""+DRAWENTITY_ISOMETRIC_CIRCLE+"\">Isometric<OPTION VALUE=\""+DRAWENTITY_INVERSION_CIRCLE+"\">Inversion</SELECT></td></tr></table></td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td WIDTH=\"3\">circles</td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td ID=\"PLUGINcomboLABEL\" VALIGN=\"top\" STYLE=\"display:"+( GLOB_PLUGIN_PARAMS_EXIST(_index_ref) ? "block" : "none" )+";\">Latest params</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td ID=\"PLUGINparamsCOMBOcontainer\" VALIGN=\"top\">"+GLOB_PLUGIN_PARAMS_COMBO_CODE_GET(_index_ref)+"</td>" ;
    HTMLcode += "<td WIDTH=\"2\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_toggle_preview('"+_base_id+"','"+_subset+"',function(){ CIRCLES"+_subset.toLowerCase()+_clean_base_id.toUpperCase()+"_PRESETS(2,YES); });\" ID=\"PLUGIN_TOGGLE_PREVIEW_BTN\">Show preview</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>&alpha;</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:300px;\" ID=\"PLUGIN_PARAM_ALPHA\" VALUE=\""+( CIRCLESembeddingsJORGENSEN_alpha != null ? CIRCLESembeddingsJORGENSEN_alpha : "0" )+"\" ONKEYUP=\"javascript:$('#PLUGINsetBTN').attr('class','link');$('#PLUGINsetBTN').css('color',COLOR_ERROR ) ;CIRCLESembeddingsJORGENSEN_EVENTS(this.id,event);\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>&beta;</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT TYPE=\"edit\" STYLE=\"width:300px;\" ID=\"PLUGIN_PARAM_BETA\" VALUE=\""+( CIRCLESembeddingsJORGENSEN_beta != null? CIRCLESembeddingsJORGENSEN_beta : "0" )+"\" ONKEYUP=\"javascript:$('#PLUGINsetBTN').attr('class','link');$('#PLUGINsetBTN').css('color',COLOR_ERROR ) ;CIRCLESembeddingsJORGENSEN_EVENTS(this.id,event);\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    var _CANVAS_W = WIDTH - 10, _CANVAS_H = Math.floor( _CANVAS_W / 2 ) ;
    HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\"100%\"><DIV ID=\"PLUGIN_PREVIEW\" STYLE=\"position:relative;height:auto;display:none;\"><table><tr><td VALIGN=\"top\" ALIGN=\"center\"><CANVAS CLASS=\"general_rounded_corners\" STYLE=\"border:1px solid #D0D0D0;width:"+_CANVAS_W+"px;height:"+_CANVAS_H+"px;\" WIDTH=\""+_CANVAS_W+"\" HEIGHT=\""+_CANVAS_H+"\" ID=\"CIRCLESembeddings"+( _clean_base_id.toUpperCase() )+"_CANVAS\"></CANVAS></td></tr></table></DIV></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\"100%\"><DIV ID=\"PLUGIN_CONTAINER\" STYLE=\"position:relative;width:100%;height:auto;display:none;\"></DIV></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\"100%\"><DIV ID=\"PLUGIN_PATTERNS\" STYLE=\"position:relative;width:100%;height:auto;display:none;\"></DIV></td></tr>" ;
    HTMLcode += "</table>" ;

    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
    var _div = circles_lib_plugin_create( _base_id, _div_id, 'embeddings', WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, 'embeddings', OPEN, _div.id, _glob_submethod_desc, [ "CIRCLESembeddingsJORGENSEN_NORMALIZE", _div_id, WIDTH, HEIGHT ], [ "CIRCLESembeddingsJORGENSEN_MINIMIZE", _div_id, WIDTH, HEIGHT ], [ "CIRCLESembeddingsJORGENSEN_MAXIMIZE", _div_id ] );
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

    if ( CIRCLESembeddingsJORGENSEN_active )
    {
        CIRCLESembeddingsJORGENSEN_INIT(YES,NO);
        CIRCLESembeddingsJORGENSEN_COMP(CIRCLESembeddingsJORGENSEN_param);
    }
    else
    {
        $( "#PLUGIN_GENSTOGGLE_BTN" ).html( "Show panel" );
        $( "#PLUGIN_CONTAINER" ).hide();
        $( "#PLUGIN_PATTERNS" ).hide();
    }

    TABINDEXorderSET( "#PLUGIN_PARAM_ALPHA", "#PLUGIN_PARAM_BETA", "#PLUGINSconfigCOMBO" );
    GLOB_PLUGIN_EVENT_PROPAGATION_MANAGEMENT( 1 );

    var DROPDOWN = $( "#CIRCLESchoose"+_base_id.replace( /[\.\_\-]/g, "" ).toUpperCase()+"canvasDROPDOWN" ).get(0) ;
    if ( DROPDOWN != null ) DROPDOWN.options[0].text = "Preview canvas" ;
}

function CIRCLESembeddingsJORGENSEN_PATTERNS()
{
    GLOB_PLUGIN_FLUSH_PATTERNS();
    GLOB_PLUGIN_ADD_PATTERN( { symbol : 'a', a : "&alpha;-(&beta;/&alpha;&beta;)", b : "&alpha;/(&alpha;&beta;<sup STYLE=\"font-size:8pt;\">2</sup>)", c : "&alpha;", d : "&alpha;/&alpha;&beta;" } );
    GLOB_PLUGIN_ADD_PATTERN( { symbol : 'b', a : "&beta;-(&alpha;/&alpha;&beta;)", b : "-&beta;/&alpha;&beta;<sup STYLE=\"font-size:8pt;\">2</sup>", c : "-&beta;", d : "&alpha;/&alpha;&beta;" } );
}

function CIRCLESembeddingsJORGENSEN_SHOW_GENERATORS_PANEL( trAB )
{
    if ( is_complex( trAB ) )
    {
        var HTMLcode  = "<table>" ;
            HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
            HTMLcode += "<tr><td>Current Trace : "+trAB.formula()+"</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
            HTMLcode += "<tr><td VALIGN=\"top\">" + GLOB_PLUGIN_GENS_TABLE_SHOW() + "</td></tr>" ;
            HTMLcode += "</table>" ;
    
        $("#GENERATORS").html( HTMLcode );
        $("#GENERATORS").show();
    }
}
function CIRCLESembeddingsJORGENSEN_MAXIMIZE( _div_id, WIDTH, HEIGHT )
{
		var _visible = $( "#PLUGIN_PREVIEW" ).is(":visible") ;
		var _plugin_width = $( "#"+GLOB_PLUGIN_DIV_ID ).width() ;
		var _canvas = $( "#CIRCLESembeddingsJORGENSEN_CANVAS" ).get(0) ;
		_canvas.set_width( _plugin_width - 5 );
    circles_lib_plugin_render_preview( "jorgensen", "embeddings" ) ;
}

function CIRCLESembeddingsJORGENSEN_MINIMIZE( _div_id, WIDTH, HEIGHT )
{
}

function CIRCLESembeddingsJORGENSEN_NORMALIZE( _div_id, WIDTH, HEIGHT )
{
		var _visible = $( "#PLUGIN_PREVIEW" ).is(":visible") ;
		var _plugin_width = $( "#"+GLOB_PLUGIN_DIV_ID ).width() ;
		var _canvas = $( "#CIRCLESembeddingsJORGENSEN_CANVAS" ).get(0) ;
		_canvas.set_width( _plugin_width - 5 );
    circles_lib_plugin_render_preview( "jorgensen", "embeddings" ) ;
}