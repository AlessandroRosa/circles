function CIRCLESformsGENERALOPTIONSclose() { hideCOLORTABLE(); return YES ; }
function CIRCLESformsGENERALOPTIONSmastertableRESIZE() { var _perc = safe_int( $( "#CIRCLESgeneraloptionsWORKAREAWIDTHcombo option:selected" ).val(), 100 ); circles_lib_canvas_layer_mastertable_resize( _perc ); }
function CIRCLESformsGENERALOPTIONSredirectCOMBOonchange()
{
    _glob_target_plane = $( "#CIRCLESplaneredirectCOMBO option:selected" ).val() ;
    if ( _glob_target_plane == BIP_BOX && !_glob_bip_use )
    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Bip box redirection requires to set bip flag on: <A HREF=\"#\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','bip');alertCLOSE();return false;\">open the &lsquo;Bip box&rsquo; form here</A>.", "CIRCLESformsGENERALOPTIONSoutputBOX" ) ;
}

function CIRCLESformsGENERALOPTIONSifsrandomOPTIONSmanager()
{
  	$( "#CIRCLESgeneraloptionsUSELASTPTcheckbox" ).prop( "disabled", _glob_use_last_pt ? false : true );
    if ( _glob_use_last_pt ) $( "#CIRCLESgeneraloptionsUSELASTPTcheckbox" ).prop( "checked", false );

	  $( "#CIRCLESgeneraloptionsSCHEDULEDRENDERINGcheckbox" ).prop( "disabled", _glob_density_scan_flag ? false : true );
    if ( _glob_density_scan_flag ) $( "#CIRCLESgeneraloptionsSCHEDULEDRENDERINGcheckbox" ).prop( "checked", false );

    circles_lib_extras_htmlctrl_enable( "CIRCLESgeneraloptionsLASTPTcoordsEDIT", _glob_use_last_pt ) ;
    circles_lib_extras_htmlctrl_enable( "CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeEDIT", _glob_scheduled_rendering_flag ) ;
    circles_lib_extras_htmlctrl_enable( "CIRCLESgeneraloptionsDENSITYWEIGHTcombo", _glob_density_scan_flag ) ;
    circles_lib_extras_htmlctrl_enable( "CIRCLESgeneraloptionsDENSITYWEIGHTcheckbox", _glob_density_scan_flag ) ;

    $("#CIRCLESgeneraloptionsPICKUPonepointBTN").css( "color", _glob_use_last_pt ? DEFAULT_EDIT_COLOR_ENABLED : DEFAULT_EDIT_COLOR_DISABLED );
    $("#CIRCLESgeneraloptionsIFSRANDOMlabel").css( "color", _glob_use_last_pt ? DEFAULT_EDIT_COLOR_ENABLED : DEFAULT_EDIT_COLOR_DISABLED );

    if ( _glob_scheduled_rendering_flag && _glob_custom_div.innerHTML.length > 0 ) $( "#CIRCLEScustomDIV" ).fadeIn( "slow", function(){} );
    else
    {
       $( "#CIRCLEScustomDIV" ).fadeOut( "fast", function(){} );
       _glob_custom_div.style.display = "none" ;
    }
      
    if ( !_glob_scheduled_rendering_flag ) clearTimeout( _glob_scheduled_rendering_timer );
}

function CIRCLESformsGENERALOPTIONSdensityCOMBOchange()
{
		var _data_entry = $('#CIRCLESgeneraloptionsDENSITYWEIGHTcombo option:selected').val() ;
		if ( _data_entry.length > 0 && _data_entry.count( "@" ) > 1 )
		{
				var _data_chunk = _data_entry.split( "@" ) ;
				_glob_density_weight_coeff = safe_float( _data_chunk[0], 0 ) ;
				_glob_density_rect_side = safe_float( _data_chunk[1], 0 ) ;
		}
}

function CIRCLESformsGENERALOPTIONSlayersTOGGLEvisibility( _plane_type, _role, _visible )
{
    _plane_type = safe_int( _plane_type, NO_PLANE ), _role = safe_float( _role, ROLE_NONE );
    _visible = safe_float( _visible, YES );
    var _index = circles_lib_canvas_layer_find_pos_index( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _role );
    var _layers = circles_lib_canvas_layer_pile_get_per_plane( _plane_type );
    var _layer = _layers[_index] ;
    if ( _layer != null )
    {
        _layer.getContext( _glob_canvas_ctx_2D_mode ).visible = _visible ;
        circles_lib_canvas_layer_show( _plane_type, _role, _visible );
    }
}

function CIRCLESformsGENERALOPTIONSlayersTOGGLEvisibilityALL( _plane_type, _visible )
{
    _plane_type = safe_int( _plane_type, NO_PLANE );
    _visible = safe_float( _visible, YES );
    var _layers_pile = _plane_type == Z_PLANE ? _glob_zplane_layers_pile_array : _glob_wplane_layers_pile_array ;
    for( var _i = 0 ; _i < _layers_pile.length ; _i++ )
    {
       if ( _layers_pile[_i] != null )
       {
          _layers_pile[_i].getContext( _glob_canvas_ctx_2D_mode ).visible = _visible ;
          circles_lib_canvas_layer_show( _plane_type, _layers_pile[_i].get_role_id(), _visible );
       }
    }
}

function CIRCLESformsGENERALOPTIONSlayersINITsliders( _plane_type )
{
    _plane_type = safe_int( _plane_type, NO_PLANE );
    var _layers = circles_lib_canvas_layer_pile_get_per_plane( _plane_type );
    if ( safe_size( _layers, 0 ) > 0 )
    {
        var _layer = null, _div, _label_index, _layer_sliderbox_id, _div_opacity ;
        for( var _i = 0 ; _i < _layers.length ; _i++ )
        {
           _layer = _layers[_i] ;
           _label_index = _layer.get_type() + "." + _layer.get_role_id() ;
           _layer_sliderbox_id = _layer.get_plane_def() + "_" + _layer.get_role_def() + "_layer_sliderbox" ;
           _div_opacity = $("#"+_layer.get_iddiv().replace(/\./g,'\\.') ).css( "opacity" ) * 100.0 ;
           _glob_layers_sliderCTRLarray[_label_index] = new dhtmlxSlider( _layer_sliderbox_id, 90, "ball", NO, 0, DEFAULT_MAX_OPACITY * 100, _div_opacity, 1, _label_index );
           if ( _glob_layers_sliderCTRLarray[_label_index] != null )
           {
              _glob_layers_sliderCTRLarray[_label_index].setImagePath( _glob_path_to_img + "ctrls/slider/");
              _glob_layers_sliderCTRLarray[_label_index].init();
              _glob_layers_sliderCTRLarray[_label_index].attachEvent( "onSlideEnd", function(){ circles_lib_extras_sliderctrl_set_wnd_opacity( this.label, YES ); } );
           }
        }
    }
}

function CIRCLESformsGENERALOPTIONSlayersDELETE( _plane_type, _i )
{
    _plane_type = safe_int( _plane_type, NO_PLANE );
    var _layers = circles_lib_canvas_layer_pile_get_per_plane( _plane_type );
    if ( safe_size( _layers, 0 ) > 0 )
    {
       var _layer = _layers[_i] ;
       if ( _layer != null )
       {
          var _question = "Do you want to remove layer '" + _layer.get_role_def() + "' from the " + _layer.get_plane_def() + " layers list ?" ;
          var _reload_option = _plane_type == Z_PLANE ? 2 : 3 ;

          alert_plug_fn( ALERT_YES, "circles_lib_canvas_layer_delete( "+_plane_type+", "+_i+" );alertCLOSE();circles_lib_canvas_layer_pile_build("+_plane_type+");circles_lib_plugin_load('forms','general.options', NO, "+_reload_option+" );" );
          alert_plug_fn( ALERT_NO, "alertCLOSE();" );
          circles_lib_output( OUTPUT_SCREEN, DISPATCH_QUESTION | DISPATCH_YESNO, _question, _glob_app_title );

          var _top_canvas = circles_lib_canvas_get_topmost( _plane_type );
          if ( _plane_type == Z_PLANE && is_html_canvas( _top_canvas ) )
          {
             _glob_zplane_topmost_canvas_placeholder = _top_canvas ;
             circles_lib_events_bind_to_zplane( _top_canvas );
          }
          else if ( _plane_type == W_PLANE && is_html_canvas( _top_canvas ) )
          {
             _glob_wplane_topmost_canvas_placeholder = _top_canvas ;
             circles_lib_events_bind_to_wplane( _top_canvas );
          }
       }
       else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Memory leak: layer reference is inconsistent", "CIRCLESformsGENERALOPTIONSoutputBOX" ) ;
    }
    else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Layers list is empty", "CIRCLESformsGENERALOPTIONSoutputBOX" ) ;
}

function CIRCLESformsGENERALOPTIONSlayersINITcanvasTHUMBNAILS( _plane_type, _selected_layers_array )
{
    if ( !is_array( _selected_layers_array ) )
    {
        if ( is_string( _selected_layers_array ) )
        _selected_layers_array = _selected_layers_array.includes( "," ) ? _selected_layers_array.split( "," ) : [ _selected_layers_array ] ;
        else _selected_layers_array = [] ;
    }
    var _n_selected = safe_size( _selected_layers_array, 0 );
    _plane_type = safe_int( _plane_type, NO_PLANE );
    var _layers = circles_lib_canvas_layer_pile_get_per_plane( _plane_type );
    if ( safe_size( _layers, 0 ) > 0 )
    {
       var _layer = null, _div, _label_index, _thumbnail_canvas, _thumbnail_context, _idcanvas, _canvas ;
       for( var _i = 0 ; _i < _layers.length ; _i++ )
       {
         _layer = _layers[_i] ;
         if ( _n_selected == 0 || _selected_layers_array.includes( _layer.get_role_id() ) )
         {
           _idcanvas = _layer.get_idcanvas() ;
           _canvas = $( "#" + _idcanvas ).get(0);
           _label_index = _layer.get_type() + "." + _layer.get_role_id() ;
           _thumbnail_canvas = $("#"+_layer.get_plane_def() + "_" + _layer.get_role_def() + "_thumbnail" ).get(0);
           if ( is_html_canvas( _thumbnail_canvas ) && is_html_canvas( _canvas ) )
           {
              _thumbnail_canvas.getContext( _glob_canvas_ctx_2D_mode ).backgroundColor = _canvas.get_backgroundcolor() ;
              $("#"+_layer.get_plane_def() + "_" + _layer.get_role_def() + "_thumbnail" ).css( "background-color", _canvas.get_backgroundcolor() );
              _thumbnail_context = _thumbnail_canvas.getContext( _glob_canvas_ctx_2D_mode );
              if ( _thumbnail_context != null ) _thumbnail_context.drawImage( _canvas, 0, 0, _canvas.get_width(), _canvas.get_height(), 0, 0, _thumbnail_canvas.get_width(), _thumbnail_canvas.get_height() );
           }
         }
       }
    }
}

function CIRCLESformsGENERALOPTIONSlayersCREATE( _plane_type )
{
    _plane_type = safe_int( _plane_type, NO_PLANE );
    var _role_def = $("#CIRCLESgeneraloptionsNEWlayerROLEDEF").val();
    if ( _role_def.length == 0 )
    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Missing layer role definition", "CIRCLESformsGENERALOPTIONSoutputBOX" ) ;
    else if ( _role_def.testME( _glob_illegalchars_regex_pattern ) )
    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Detected illegal chars in input layer role definition.", "CIRCLESformsGENERALOPTIONSoutputBOX" ) ;
    else
    {
       var _plane_def = circles_lib_plane_get_def( _plane_type );
       var _ret = circles_lib_canvas_layer_create( [ _plane_def, _role_def, NO, null, _plane_type, YES ] );
       if ( _ret == UNDET )
       circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "There exists another layer with definition '"+_role_def+"' in the "+_plane_def+" layers list.", "CIRCLESformsGENERALOPTIONSoutputBOX" ) ;
       else if ( _ret == null )
       circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Memory failure: can't create this layer.", "CIRCLESformsGENERALOPTIONSoutputBOX" ) ;
       else
       {
          var _reload_option = _plane_type == Z_PLANE ? 2 : 3 ;
          alert_plug_fn( ALERT_SUCCESS, "alertCLOSE();circles_lib_plugin_load('forms','general.options', NO, "+_reload_option+" );", _glob_app_title );
          circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The layer with symbol '"+_role_def+"' has been created with success in the "+_plane_def+" layers list.", _glob_app_title );
       }
    }
}

function CIRCLESformsGENERALOPTIONSlayersSWAP( _plane_type, _layer_pos_index1, _layer_pos_index2 )
{
    _plane_type = safe_int( _plane_type, NO_PLANE );
    _layer_pos_index1 = safe_int( _layer_pos_index1, UNDET );
    _layer_pos_index2 = safe_int( _layer_pos_index2, UNDET );
    circles_lib_canvas_layer_swap( _plane_type, _layer_pos_index1, _layer_pos_index2 );
    circles_lib_canvas_layer_pile_build( _plane_type );

    var _top_canvas = circles_lib_canvas_get_topmost( _plane_type );
    if ( _plane_type == NO_PLANE ) return NO ;
    else if ( _plane_type == Z_PLANE && is_html_canvas( _top_canvas ) )
    {
       _glob_zplane_topmost_canvas_placeholder = _top_canvas ;
       circles_lib_events_bind_to_zplane( _top_canvas );
    }
    else if ( _plane_type == W_PLANE && is_html_canvas( _top_canvas ) )
    {
       _glob_wplane_topmost_canvas_placeholder = _top_canvas ;
       circles_lib_events_bind_to_wplane( _top_canvas );
    }

    var _reload_option = _plane_type == Z_PLANE ? 2 : 3 ;
    circles_lib_plugin_load('forms','general.options', NO, _reload_option );
    return YES ;
}

function CIRCLESformsGENERALOPTIONSreloadLIST( _plane_type, _layer_role_index, _reloader_fn )
{
    var HTMLcode = CIRCLESformsGENERALOPTIONSlayersLIST( _plane_type, _reloader_fn );
    $( "#GENERALOPTIONStabCONTAINER" ).html( HTMLcode );
    CIRCLESformsGENERALOPTIONSlayersINITcanvasTHUMBNAILS( _plane_type, [] );
}

function CIRCLESformsGENERALOPTIONSlayersREFRESH( _plane_type, _layer_role_index, _layer_bkcolor_id, _reloader_fn )
{
    var _bkcolor = $( "#" + _layer_bkcolor_id ).get(0) != null ? $( "#" + _layer_bkcolor_id ).css( "background-color" ) : "" ;
    circles_lib_canvas_layer_refresh( _plane_type, _layer_role_index, _bkcolor );
    CIRCLESformsGENERALOPTIONSreloadLIST( _plane_type, _layer_role_index, _reloader_fn );
}

function CIRCLESformsGENERALOPTIONSlayersCLEANentry( _plane_type, _layer_role_index, _reloader_fn )
{
    var _render_fn = _plane_type == Z_PLANE ? "circles_lib_canvas_render_zplane(null,null,["+_layer_role_index+"],YES,NO,NO,NO,YES,YES,OUTPUT_SCREEN);" : "circles_lib_canvas_render_wplane(null,null,["+_layer_role_index+"],YES,NO,NO,YES,NO,YES);" ;
    try{ eval( _render_fn ) ; }
		catch( _err ) { circles_lib_error_obj_handler( _err, _linebreak_cmd, OUTPUT_SCRIPT_EDITOR ) ; }
    CIRCLESformsGENERALOPTIONSreloadLIST( _plane_type, _layer_role_index, _reloader_fn );
}

function CIRCLESformsGENERALOPTIONSlayersLIST( _plane_type, _reloader_fn )
{
    _plane_type = safe_int( _plane_type, NO_PLANE );
    var HTMLcode = "" ;
    var _layers = circles_lib_canvas_layer_pile_get_per_plane( _plane_type );
    var _role_array = _plane_type == Z_PLANE ? _glob_zplane_layers_pile_role_array : ( _plane_type == W_PLANE ? _glob_wplane_layers_pile_role_array : null );
    var _err_count = 0 ;
    if ( safe_size( _layers, 0 ) > 0 && safe_size( _role_array, 0 ) > 0 )
    {
        var _layer = null, _div, _L = safe_size( _role_array, 0 );

        HTMLcode += "<table WIDTH=\"100%\">" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"background-color:#F0F0F0;\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>New layer label</td>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"CIRCLESgeneraloptionsNEWlayerROLEDEF\" STYLE=\"width:200px;\" ONKEYUP=\"javascript:CIRCLESformsMETHODeventsHANDLER( this.id, event, "+_plane_type+" );\"></td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsGENERALOPTIONSlayersCREATE( "+_plane_type+" );\">Create</td>" ;
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td><INPUT TYPE=\"CHECKBOX\" ID=\"CIRCLESgeneraloptionsALLVISIBLEcheckbox\" ONCLICK=\"javascript:$('[id$=_VISIBLE_CHECKBOX]').prop('checked',this.checked?1:0);CIRCLESformsGENERALOPTIONSlayersTOGGLEvisibilityALL("+_plane_type+",this.checked?1:0);\"></td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td>Visible</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\">" ;

        var _layer_role_index, _layer_pos_index, _layer_role_def ;
        var _defaultcanvas, _canvas_id, _label_index, _layer_sliderbox_id, _layer_thumbnail_id ;
        var _layer_opacity_id, _layer_bkcolor_id, _checkbox_id, _div_opacity ;

        if ( _L > 2 ) HTMLcode += "<DIV ID=\"GENERALOPTIONSlayerslistCONTAINER\" STYLE=\"position:relative;width:100%;height:290px;overflow:auto;\">" ;
        HTMLcode += "<table WIDTH=\"100%\">" ;
        for( var _i = 0 ; _i < _L ; _i++ )
        {
           _layer_role_index = _role_array[_i] ;
           _layer_pos_index = circles_lib_canvas_layer_find_pos_index( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _layer_role_index );
           _layer = _layers[_layer_pos_index] ;
           if ( _layer == null ) { _err_count++ ; continue ; }
           HTMLcode += "<tr>" ;
           HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"border:1px solid "+( _plane_type == Z_PLANE ? "#E5EEFB" : "#D5DEEB" )+";\">" ;
           HTMLcode += "<table WIDTH=\"100%\">" ;

           _defaultcanvas = _layers[_i].is_defaultcanvas() ;
           _canvas_id = _layers[_i].get_idcanvas() ;
           _layer_role_def = _layer.get_role_def().toUpperCase() ;
           _label_index = _layer.get_type() + "." + _layer.get_role_id() ;
           _layer_sliderbox_id = _layer.get_plane_def() + "_" + _layer.get_role_def() + "_layer_sliderbox" ;
           _layer_thumbnail_id = _layer.get_plane_def() + "_" + _layer.get_role_def() + "_thumbnail" ;
           _layer_opacity_id = _layer.get_plane_def().toUpperCase() + "_" + "layer" + _layer.get_role_def().toUpperCase() + "opacity" ;
           _layer_bkcolor_id = _layer.get_plane_def().toUpperCase() + "_" + _layer.get_role_def().toUpperCase() + "bkcolor" ;
           _checkbox_id = _layer.get_plane_def().toUpperCase() + "_" + _layer.get_role_def().toUpperCase() + "_VISIBLE_CHECKBOX" ;
           _div_opacity = $("#"+_layer.get_iddiv().replace(/\./g,'\\.') ).css( "opacity" ) * 100.0 ;

           HTMLcode += "<tr>" ;
           HTMLcode += "<td WIDTH=\"5\"></td>" ;
           HTMLcode += "<td VALIGN=\"top\">" ;
           HTMLcode += "<table>" ;
           HTMLcode += "<tr>" ;
           HTMLcode += "<td VALIGN=\"top\">" ;
           HTMLcode += "<table>" ;
           HTMLcode += "<tr>" ;
           HTMLcode += "<td WIDTH=\"90\" TITLE=\""+_layer_role_def+"\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:white;\" ALIGN=\"center\">"+( _layer_role_def.length > 14 ? _layer_role_def.substr( 0, 10 ) + "..." : _layer_role_def )+"</td>" ;
           HTMLcode += "<td WIDTH=\"2\"></td>" ;
           HTMLcode += "<td ID=\""+_layer_sliderbox_id+"\" WIDTH=\"100\"></td>" ;
           HTMLcode += "<td WIDTH=\"8\"></td>" ;
           HTMLcode += "<td ALIGN=\"center\"><INPUT ID=\""+_layer_opacity_id+"\" VALUE=\""+_div_opacity+"\" TYPE=\"edit\" STYLE=\"width:25px;text-align:center;\" ONKEYUP=\"javascript:_glob_layers_sliderCTRLarray['"+_label_index+"'].setValue(this.value);circles_lib_extras_sliderctrl_set_wnd_opacity( '"+_label_index+"', YES );\"></td>" ;
           HTMLcode += "<td WIDTH=\"8\"></td>" ;
           HTMLcode += "<td><INPUT ID=\""+_checkbox_id+"\" TYPE=\"checkbox\" "+( _layer.is_visible() ? "CHECKED" : "" )+" ONCLICK=\"javascript:CIRCLESformsGENERALOPTIONSlayersTOGGLEvisibility( "+_layer.get_type()+", "+_layer.get_role_id()+", this.checked?1:0 );\"></td>" ;
           HTMLcode += "<td STYLE=\"font-size:7pt;\">Visible</td>" ;
           HTMLcode += "</tr>" ;
           HTMLcode += "</table>" ;
           HTMLcode += "</td>" ;
           HTMLcode += "</tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;

           HTMLcode += "<tr>" ;
           HTMLcode += "<td VALIGN=\"top\">" ;
           HTMLcode += "<table>" ;
           HTMLcode += "<tr>" ;
           HTMLcode += "<td WIDTH=\"2\"></td>" ;
           if ( _defaultcanvas )
           HTMLcode += "<td VALIGN=\"top\" STYLE=\"font-size:7pt;\">This is a default layer</td>" ;
           else
           HTMLcode += "<td VALIGN=\"top\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsGENERALOPTIONSlayersDELETE( "+_plane_type+", "+_i+" );\"><IMG SRC=\"%imgpath%icons/delete/delete.icon.20x20.png\"></td>" ;
           HTMLcode += "</tr>" ;
           HTMLcode += "</table>" ;
           HTMLcode += "</td>" ;
           HTMLcode += "</tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;

           HTMLcode += "<tr>" ;
           HTMLcode += "<td VALIGN=\"top\">" ;
           HTMLcode += "<table>" ;
           HTMLcode += "<tr>" ;
           var _bk = _layer.get_backgroundcolor().trim() ;
           HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"height:18px;width:30px;text-align:center;background-color:"+_bk+";\" ID=\""+_layer_bkcolor_id+"\">"+( _bk.length == 0 ? "none" : "" )+"</td>";
           HTMLcode += "</tr>" ;
           HTMLcode += "</table>" ;
           HTMLcode += "</td>" ;
           HTMLcode += "</tr>" ;

           HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
           HTMLcode += "<tr>" ;
           HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:"+( _plane_type == Z_PLANE ? "#D5DEEB" : "#C2CBD8" )+";\">" ;
           HTMLcode += "<table>" ;
           HTMLcode += "<tr>" ;
           HTMLcode += "<td WIDTH=\"5\"></td>" ;
           HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
           HTMLcode += "    ONCLICK=\"javascript:displayCOLORTABLE('"+_layer_bkcolor_id+"ICON','"+_layer_bkcolor_id+"');\"";
           HTMLcode += "    WIDTH=\"16\" valign=\"middle\" ID=\""+_layer_bkcolor_id+"ICON\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
           HTMLcode += "<td WIDTH=\"12\"></td>" ;

           var _filename = _glob_export_filename.length == 0 ? "circles." + _layer.get_role_def() + ".png" : _glob_export_filename ;
           var _pdf_filename = _glob_export_filename.length == 0 ? "circles." + _layer.get_role_def() + ".pdf" : _glob_export_filename ;
           if ( !( _filename.trim().toLowerCase().right( 4 ).strcmp( ".png" ) ) ) _filename += ".png" ;
           if ( !( _pdf_filename.trim().toLowerCase().right( 4 ).strcmp( ".pdf" ) ) ) _pdf_filename += ".pdf" ;
           var _render_fn = _plane_type == Z_PLANE ? "circles_lib_canvas_render_zplane(null,null,["+_layer_role_index+"],NO,YES,YES,NO,YES,OUTPUT_SCREEN);" : "circles_lib_canvas_render_wplane(null,null,["+_layer_role_index+"],YES,YES,YES,YES,NO,YES,OUPUT_SCREEN);" ;
           var _refresh_fn = _plane_type == Z_PLANE ? "circles_lib_canvas_render_zplane(null,null,["+_layer_role_index+"],NO,YES,YES,NO,YES,OUTPUT_SCREEN);" : "circles_lib_canvas_render_wplane(null,null,["+_layer_role_index+"],YES,YES,NO,YES,NO,YES,OUPUT_SCREEN);" ;

           HTMLcode += "<td CLASS=\"link_smaller\" ONCLICK=\"javascript:circles_lib_files_pix_save_canvas_from_ref( "+_plane_type+", "+_layer.get_role_id()+", '"+_filename+"' );\">Export</td>" ;
           HTMLcode += "<td WIDTH=\"12\"></td>" ;
           HTMLcode += "<td CLASS=\"link_smaller\" ONCLICK=\"javascript:circles_lib_files_pix_save_canvas_from_ref( "+_plane_type+", "+_layer.get_role_id()+", '"+_pdf_filename+"' );\">PDF</td>" ;
           HTMLcode += "<td WIDTH=\"12\"></td>" ;
           HTMLcode += "<td CLASS=\"link_smaller\" ONCLICK=\"javascript:if ( confirm( 'Set the background color of "+_layer.get_label()+" layer to transparent ?' ) ) { $('#"+_layer_bkcolor_id+"').css('background-color','transparent');CIRCLESformsGENERALOPTIONSlayersREFRESH("+_plane_type+","+_layer_role_index+",'"+_layer_bkcolor_id+"');"+_render_fn+_reloader_fn+";}\">Transparent bk</td>" ;
           HTMLcode += "<td WIDTH=\"12\"></td>" ;
           HTMLcode += "<td CLASS=\"link_smaller\" ONCLICK=\"javascript:if ( confirm( 'Clean the "+_layer.get_label()+" layer ?' ) ) CIRCLESformsGENERALOPTIONSlayersCLEANentry( "+_plane_type+", "+_layer_role_index+", '"+_reloader_fn+"' );\">Clean</td>" ;
           HTMLcode += "<td WIDTH=\"12\"></td>" ;
           HTMLcode += "<td CLASS=\"link_smaller\" ONCLICK=\"javascript:if ( confirm( 'Refresh the "+_layer.get_label()+" layer ?' ) ) { CIRCLESformsGENERALOPTIONSlayersREFRESH("+_plane_type+","+_layer_role_index+",'"+_layer_bkcolor_id+"','"+_refresh_fn+"');}\">Refresh</td>" ;
           HTMLcode += "<td WIDTH=\"5\"></td>" ;
           HTMLcode += "</tr>" ;
           HTMLcode += "</table>" ;
           HTMLcode += "</td>" ;
           HTMLcode += "</tr>" ;

           HTMLcode += "</table>" ;
           HTMLcode += "</td>" ;

           HTMLcode += "<td WIDTH=\"10\"></td>" ;
           HTMLcode += "<td VALIGN=\"top\" WIDTH=\"90\"><CANVAS WIDTH=\"80\" HEIGHT=\"80\" STYLE=\"width:80px;height:80px;\" CLASS=\"general_rounded_corners\" ID=\""+_layer_thumbnail_id+"\"></CANVAS></td>" ;
           HTMLcode += "<td WIDTH=\"5\"></td>" ;
           HTMLcode += "</tr>" ;
           HTMLcode += "</table>" ;

           HTMLcode += "</td>" ;
           HTMLcode += "<td WIDTH=\"5\"></td>" ;
           HTMLcode += "<td VALIGN=\"top\" HEIGHT=\"100%\">" ;
           HTMLcode += "<table>" ;
           HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
           if ( _i > 0 )
           HTMLcode += "<tr><td HEIGHT=\"20\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsGENERALOPTIONSlayersSWAP( "+_plane_type+", "+_i+", "+(_i-1)+" );\"><IMG TITLE=\"Move to background\" SRC=\"%imgpath%icons/arrows/single/arrow.up.01.20x20.png\"></td></tr>" ;
           else HTMLcode += "<tr><td HEIGHT=\"20\"></td></tr>" ;
           if ( _i < ( _L - 1 ) )
           HTMLcode += "<tr><td HEIGHT=\"20\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsGENERALOPTIONSlayersSWAP( "+_plane_type+", "+_i+", "+(_i+1)+" );\"><IMG TITLE=\"Move to foregroud\" SRC=\"%imgpath%icons/arrows/single/arrow.down.01.20x20.png\"></td></tr>" ;
           else HTMLcode += "<tr><td HEIGHT=\"20\"></td></tr>" ;
           HTMLcode += "</table>" ;
           HTMLcode += "</td>" ;

           HTMLcode += "</tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        }

        HTMLcode += "</table>" ;
        if ( _L > 2 ) HTMLcode += "</DIV>" ;

        HTMLcode += "</tr>" ;
        if ( _err_count > 0 )
        {
            HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
            HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">Possible memory leaks found in this layers pile</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        }

        HTMLcode += "</td>" ;
        HTMLcode += "</table>" ;
    }
    else
    {
        HTMLcode += "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"42\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"color:red;font-size:12pt;\" ALIGN=\"center\">Critical error</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
        HTMLcode += "<tr><td STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\" ALIGN=\"center\">The layer list is empty</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"42\"></td></tr>" ;
        HTMLcode += "</table>" ;
    }
    
    return HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
}

function CIRCLESformsGENERALOPTIONSsmprMANAGER( _opcode, _silent )
{
		_opcode = safe_int( _opcode, 0 ), _silent = safe_int( _silent, NO );
    var _px_width = _glob_zplane_rendering_canvas_placeholder.get_width() ;
		switch( _opcode )
		{
				case 0:
				var _smpr = safe_float( $("#SETTINGSsmprEDIT").val(), 1 );
        if ( ( new String( _smpr ) ).length > 0 )
        {
           _smpr = safe_int( _smpr, 1 );
           _smpr = Math.max( 0, Math.min( _smpr, 100 ) );
           _glob_smpr = _smpr = Math.min( _smpr, _px_width );
           var _out = safe_int( Math.ceil( _glob_smpr / _px_width * 100.0 ), 0 );

           $("#SETTINGSsmprPERC").val( _out );
 					 $("#SETTINGSsmprEDIT").val( _glob_smpr );
        }
				break ;
				case 1:
				_glob_smpr = _px_width ;
        $("#SETTINGSsmprPERC").val( 100 );
				$("#SETTINGSsmprEDIT").val( _glob_smpr );
				break ;
				case 2:
				var _perc = safe_float( $("#SETTINGSsmprEDIT").val(), 1 );
        if ( ( "" + _perc ).length > 0 )
        {
            _perc = Math.max( 0, Math.min( safe_int( _perc, 1 ), 100 ) );
            var _out = safe_int( Math.ceil( _perc * _px_width / 100.0 ), 1 );
            $("#SETTINGSsmprPERC").val( _perc );
            $("#SETTINGSsmprEDIT").val( _out );
        }
				break ;
				case 3:
				var _perc = $("#SETTINGSsmprPERC").val();
				var _smpr = $("#SETTINGSsmprEDIT").val();
        if ( _edit != null && _smpr.length == 0 )
        {
           _edit.value = 50 ;
           CIRCLESformsGENERALOPTIONSsmprMANAGER( 0, _silent );
        }
        else if ( _perc_edit != null && _perc.length == 0 )
        {
           _perc_edit.value = 50 ;
           CIRCLESformsGENERALOPTIONSsmprMANAGER( 2, _silent );
        }
				break ;
        default: break ;
		}
}

function CIRCLESformsGENERALOPTIONSapply( _question, _silent )
{
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    var _b_go = !_question ? YES : confirm( "Confirm to apply new settings ?" );
    if ( _b_go )
    {
       var _assignment_array = [] ;
           _assignment_array.push( [ "DEFAULTtextcolor", "_glob_default_text_clr" ] );
           _assignment_array.push( [ "DEFAULTpointbordercolor", "_glob_pt_border_color" ] );
           _assignment_array.push( [ "DEFAULTpointinteriorcolor", "_glob_pt_interior_color" ] );
           _assignment_array.push( [ "DEFAULTdrawseedcolor", "_glob_draw_seed_color" ] );
           _assignment_array.push( [ "DEFAULTfillseedcolor", "_glob_fill_seed_color" ] );
           _assignment_array.push( [ "DEFAULTdrawinverseseedcolor", "_glob_draw_inverse_seed_color" ] );
           _assignment_array.push( [ "DEFAULTfillinverseseedcolor", "_glob_fill_inverse_seed_color" ] );
           _assignment_array.push( [ "DEFAULTaxiscolor", "_glob_axis_color" ] );

           _assignment_array.push( [ "DEFAULTlabeltextcolor", "_glob_label_text_color" ] );
           _assignment_array.push( [ "DEFAULTlabeldotcolor", "_glob_label_dot_color" ] );
           _assignment_array.push( [ "ZPLANECANVASbkcolor", "" ] );
           _assignment_array.push( [ "ZPLANEGRIDbkcolor", "_glob_zplane_grid_canvas_placeholder.get_backgroundcolor()" ] );
           _assignment_array.push( [ "ZPLANERENDERINGbkcolor", "_glob_zplane_rendering_canvas_placeholder.get_backgroundcolor()" ] );
           _assignment_array.push( [ "ZPLANEWORKbkcolor", "_glob_zplane_work_canvas_placeholder.get_backgroundcolor()" ] );
           _assignment_array.push( [ "WPLANECANVASbkcolor", "" ] );
           _assignment_array.push( [ "WPLANEGRIDbkcolor", "_glob_wplane_grid_canvas_placeholder.get_backgroundcolor()" ] );
           _assignment_array.push( [ "WPLANERENDERINGbkcolor", "_glob_wplane_grid_canvas_placeholder.get_backgroundcolor()" ] );
           _assignment_array.push( [ "WPLANEWORKbkcolor", "_glob_wplane_work_canvas_placeholder.get_backgroundcolor()" ] );

           _assignment_array.push( [ "DEFAULTboundarycolor", "_glob_default_discreteness_locus_clr" ] );
           _assignment_array.push( [ "DEFAULTpleatingraycolor", "_glob_default_pleating_ray_clr" ] );
           _assignment_array.push( [ "DEFAULTpleatingrayselectedcolor", "_glob_default_pleating_ray_selected_clr" ] );

       var _tmp_clr ;              
          $.each( _assignment_array,
                  function( _i, _chunk )
                  {
                      if ( $("#"+_chunk[0]).get(0) != null )
                      {
                          _tmp_clr = $("#"+_chunk[0]).css( "background-color" );
                          _tmp_clr = _tmp_clr.includes( "#" ) ? circles_rgb_hex_to_dec( _tmp_clr ) : _tmp_clr ;
                          if ( _tmp_clr.length > 0 && _chunk[1].length > 0 ) eval( _chunk[1] + " = '" + _tmp_clr + "' ;" );
                          
                          switch( _chunk[0] )
                          {
                              case "DEFAULTdrawseedcolor":
                              $.each( _glob_seeds_array,
                                      function( _i, _item_obj )
                                      {
                                          if( is_item_obj( _glob_seeds_array[_i] ) ) _glob_seeds_array[_i].complex_circle.drawcolor = _tmp_clr ;
                                      }
                                    ) ;
                              break ;
                              case "DEFAULTfillseedcolor":
                              $.each( _glob_seeds_array,
                                      function( _i, _item_obj )
                                      {
                                          if( is_item_obj( _glob_seeds_array[_i] ) ) _glob_seeds_array[_i].complex_circle.fillcolor = _tmp_clr ;
                                      }
                                    ) ;
                              break ;
											        default: break ;
                          }
                      }
                  }
                );

          zplane_sm.accuracy = wplane_sm.accuracy = bipbox_sm.accuracy = _glob_accuracy ;

          var _sd_n = circles_lib_count_seeds();
          if ( _sd_n > 0 )
          {
              _b_go = _question ? confirm( "Confirm to render both Z-plane and W-plane ?" ) : YES;
              var _final_ret = YES, _ret_msg = [];
              if ( _b_go )
              {
                  circles_lib_canvas_layer_pile_clean_per_plane( Z_PLANE, UNDET, YES, OUTPUT_SCREEN );
                  circles_lib_canvas_layer_pile_clean_per_plane( W_PLANE, UNDET, YES, OUTPUT_SCREEN );
                  var _ret_chunk_zplane = circles_lib_canvas_render_zplane( null, null, null, YES, YES, YES, NO, YES, OUTPUT_SCREEN );
                  if ( _ret_chunk_zplane != null ) _ret_msg.push( _ret_chunk_zplane[1] );
                  var _ret_chunk_ask = circles_lib_canvas_process_ask(NO, YES, _glob_bip_use?BIP_BOX:_glob_target_plane, YES, YES, CHECK, null, OUTPUT_SCREEN );
                  if ( _ret_chunk_ask != null ) _ret_msg.push( _ret_chunk_ask[1] );

                  _final_ret &= _ret_chunk_zplane != null ? safe_int( _ret_chunk_zplane[0], 0 ) : 0 ;
                  _final_ret &= _ret_chunk_ask != null ? safe_int( _ret_chunk_ask[0], 0 ) : 0 ;

                  if ( _final_ret == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _ret_msg.join( _glob_crlf ), _glob_app_title );
                  return [ _final_ret ? RET_OK : RET_ERROR, _ret_msg.join( _glob_crlf ) ] ;
              }
              else return [ RET_ERROR, "Operation halted by user" ] ;
          }
      }
      else return [ RET_ERROR, "Operation halted by user" ] ;
}

function CIRCLESformsGENERALOPTIONSdisksfillOPTIONSask( _question, _silent, _output_channel )
{
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
		_output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _sd_n = circles_lib_count_seeds();
    var _disk_draw = $("#CIRCLEScheckboxDISKSdraw").is(':checked');
    var _disk_fill = $("#CIRCLEScheckboxDISKSfill").is(':checked');
    
    if ( _sd_n > 0 )
    {
         var _warning_msg = "" ;
         if ( !_disk_draw && !_disk_fill )
         {
             _warning_msg += "Warning !" + _glob_crlf ;
             _warning_msg += "Both draw and fill options have been set off" ;
             _warning_msg += _glob_crlf + "Therefore all items won't be visible." + _glob_crlf ;
         }

         var MSG = _warning_msg + "Confirm to automatically set each 'disk fill' option "+( _glob_wplane_disk_fill ? "on" : "off" )+"? " ;
         var _b_go = !_question ? YES : confirm( MSG );
         if ( _b_go )
         {
             for( var _i = 0 ; _i < _sd_n ; _i++ )
             if ( _glob_seeds_array[_i].complex_circle != null ) _glob_seeds_array[_i].complex_circle.fill = _glob_wplane_disk_fill ;

             MSG = "The 'disk fill' option was set "+( _glob_wplane_disk_fill ? "on" : "off" )+" for all items" ;
             MSG += "Confirm to apply the current palette or the original fill color for each seed ?" ;
             if ( _output_channel == OUTPUT_SCREEN && !_silent && !_glob_palette_use )
             {
                 alert_plug_label( ALERT_YES, "Apply" );
                 alert_plug_label( ALERT_NO, "Don't" );
                 alert_plug_fn( ALERT_YES, "alertCLOSE();$('#CIRCLEScheckboxPALETTEuse').prop('checked',YES);_glob_palette_use=YES;" );
                 alert_plug_fn( ALERT_NO, "alertCLOSE();$('#CIRCLEScheckboxPALETTEuse').prop('checked',NO);_glob_palette_use=NO;" )
                 alert_set_btns_width( "70px" );
                 alert_msg( ALERT_YESNO | ALERT_QUESTION, MSG, _glob_app_title + " - " + circles_lib_plane_get_def( W_PLANE ) );
             }
             else
             {
                var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _output_channel );
   						  var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
   						  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                return _ret_id ? [ 1, "Disk fill option set up with success" ] : _ret_chunk ;
             }
         }
         else return [ RET_IRRELEVANT, "Operation halted by user" ] ;
    }
    else
    {
       var _msg = "Can't perform this operation."+_glob_crlf+"No items have been registered yet" ;
       if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title ) ;
       return [ RET_ERROR, _msg ] ;
    }
}

function CIRCLESformsGENERALOPTIONSaccuracyMANAGE()
{
		_glob_accuracy = safe_int( Math.abs( $( "#CIRCLESgeneraloptionsSETTINGSaccuracyEDIT" ).val() ), DEFAULT_MAX_ACCURACY ) ;
		_glob_accuracy = Math.min( _glob_accuracy, DEFAULT_MAX_ACCURACY );
		if ( _glob_accuracy == 0 ) _glob_accuracy = DEFAULT_MAX_ACCURACY ;
		$( "#CIRCLESgeneraloptionsSETTINGSaccuracyEDIT" ).val( _glob_accuracy );
		var _n_seeds = circles_lib_count_seeds(), _n_gens = circles_lib_count_gens();
		if ( _n_seeds > 0 ) $.each( _glob_seeds_array, function( _i, _seed ){ _glob_seeds_array[_i].map.accuracy = _glob_accuracy ; } ) ;
		if ( _n_gens > 0 ) $.each( _glob_gens_array, function( _i, _gen ){ _glob_gens_array[_i].map.accuracy = _glob_accuracy ; } ) ;
}

function CIRCLESformsGENERALOPTIONSdisksdrawOPTIONSask( _question, _silent, _output_channel )
{
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
		_output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _sd_n = circles_lib_count_seeds();
    var _disk_draw = $("#CIRCLEScheckboxDISKSdraw").is(':checked');
    var _disk_fill = $("#CIRCLEScheckboxDISKSfill").is(':checked');
    if ( _sd_n > 0 )
    {
         var _warning_msg = "" ;
         if ( !_disk_draw && !_disk_fill )
         {
             _warning_msg += "Warning !" + _glob_crlf ;
             _warning_msg += "Both draw and fill options have been set off" ;
             _warning_msg += _glob_crlf + "Therefore all items won't be visible." + _glob_crlf ;
         }

         var MSG = _warning_msg + "Confirm to set all disks draw flag "+( _glob_wplane_disk_draw ? "on" : "off" )+"? " ;
         var _b_go = !_question ? YES : confirm( MSG );
         if ( _b_go )
         {
            for( var _i = 0 ; _i < _sd_n ; _i++ )
            if ( _glob_seeds_array[_i].complex_circle != null ) _glob_seeds_array[_i].complex_circle.draw = _glob_wplane_disk_draw ;

            MSG = "The disk draw option was set "+( _glob_wplane_disk_draw ? "on" : "off" )+" for all items" ;
            if ( _output_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, MSG, _glob_app_title ) ;
            return circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _output_channel );
         }
         else return [ RET_IRRELEVANT, "Operation halted by user" ] ;
    }
    else
    {
       var _msg = "Can't perform this operation."+_glob_crlf+"No items have been registered yet" ;
       if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title ) ;
       return [ RET_ERROR, _msg ] ;
    }
}

function CIRCLESformsGENERALOPTIONSscheduledrenderingAPPLY()
{
		if ( confirm( "Confirm to apply all settings for scheduled renderings ?" ) )
		{
       var _ctrl_id = "CIRCLESgeneraloptionsSETTINGSpixelsizeEDIT" ;
              $( "#" + _ctrl_id ).val( _glob_pixel_size );
              		_ctrl_id = "CIRCLESgeneraloptionsSETTINGSlinewidthEDIT" ;
              $( "#" + _ctrl_id ).val( _glob_line_width );
              		_ctrl_id = "CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeEDIT" ;
              var _min_t = 1, _max_t = 15 ;
              var _t = Math.max( 0, safe_int( $( "#" + _ctrl_id ).val(), 0 ) ) ;
              var _fail = ( _t < _min_t || _t > _max_t ) ? 1 : 0 ;
              if ( _fail ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Time interval does not range from 1 to 15", 'CIRCLESgeneraloptionsLASTPT_OUTMSGlabel' ) ;
              else
              {
                  _glob_scheduled_rendering_interval = _t ;
                  $( "#CIRCLESgeneraloptionsSCHEDULEDRENDERINGtimeMINUTESlabel" ).html( "minute" + ( _t == 1 ? "" : "s" ) );
                  setTimeout( function() { circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "These settings will be applied after the next rendering", 'CIRCLESgeneraloptionsLASTPT_OUTMSGlabel' ) }, 3500 ) ;
              }

           		_ctrl_id = "CIRCLESgeneraloptionsLASTPTcoordsEDIT" ;
              var _c = parse_complex_from_string( $( "#" + _ctrl_id ).val() );
              _b_fail = !is_complex( _c ) ;
              if ( !_b_fail ) _glob_last_pt = _c ;
              circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Last point coords do not assemble into a complex value", 'CIRCLESgeneraloptionsLASTPT_OUTMSGlabel' ) ;
              
       if ( !_b_fail )
			 circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "All settings have been applied with success", "CIRCLESgeneraloptionsLASTPT_OUTMSGlabel" ) ;
		}
}

function CIRCLESformsGENERALOPTIONSreset( _question, _silent, _output_channel )
{
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
		_output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _b_go = !_question ? YES : confirm( "Confirm to restore the original settings ?" );
    if ( _b_go )
    {
        _glob_ticks_count = DEFAULT_TICKS ;
        _glob_wplane_disk_fill = _glob_palette_use = NO ;
        _glob_accuracy = DEFAULT_MAX_ACCURACY ;
        _glob_wplane_disk_draw = YES ;

        circles_lib_reset_colors();

        var _sd_n = circles_lib_count_seeds();
        if ( _sd_n > 0 )
        {
            for( var _i = 0 ; _i < _sd_n ; _i++ )
            {
               if ( _glob_seeds_array[_i].complex_circle != null )
               {
                  _glob_seeds_array[_i].complex_circle.draw = _glob_wplane_disk_draw ;
                  _glob_seeds_array[_i].complex_circle.fill = _glob_wplane_disk_fill ;
               }
            }
        }

        $("#CIRCLESgeneraloptionsSETTINGSaccuracyEDIT").val( _glob_accuracy );
        $("#CIRCLESgeneraloptionsSETTINGSticksEDIT").val( _glob_ticks_count );

        circles_lib_plugin_load('forms','general.options', NO, 0 );
        circles_lib_canvas_layer_pile_clean_per_plane( Z_PLANE, UNDET, YES, _output_channel );
        circles_lib_canvas_layer_pile_clean_per_plane( W_PLANE, UNDET, YES, _output_channel );
          
        var _ret_chunk_zplane= circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _output_channel );
        var _ret_chunk_wplane = circles_lib_canvas_render_wplane( null, wplane_sm, null, YES, YES, YES, YES, NO, YES, _output_channel );

        var _final_ret = YES ;
        if ( _ret_chunk_zplane[0] != RET_IRRELEVANT )
        _final_ret &= _ret_chunk_zplane != null ? _ret_chunk_zplane[0] : 0 ;
        if ( _ret_chunk_wplane[0] != RET_IRRELEVANT )
        _final_ret &= _ret_chunk_wplane != null ? _ret_chunk_wplane[0] : 0 ;

        zplane_sm.accuracy = _glob_accuracy, wplane_sm.accuracy = _glob_accuracy, bipbox_sm.accuracy = _glob_accuracy ;
        return [ _final_ret ? RET_OK : RET_ERROR, _final_ret ? "General options reset with success" : "Fail to reset general options" ] ;
    }
    else return [ RET_ERROR, "Reset halted by user" ] ;
}