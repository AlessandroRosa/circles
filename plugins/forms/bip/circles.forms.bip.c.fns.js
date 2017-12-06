function CIRCLESformsBIPcanvasREALDIMS()
{
    var _bip_canvas = $( "#CIRCLESbipCANVAS" ).get(0) ;
    if ( is_html_canvas( _bip_canvas ) )
    {
        var _bip_w = _bip_canvas.get_width(), _bip_h = _bip_canvas.get_height() ;
        var _sw = $(window).width(), _sh = $(window).height() ;
        var _popup_w = Math.floor( _sw * 0.5 ), _popup_h = _sh - ( $( "#menu" ).height() + 100 ) ;
        var _html_code = "<CANVAS ID=\"CIRCLESbiprealdimsCANVAS\" STYLE=\"width:"+_bip_w+"px;height:"+_bip_h+"px;\" WIDTH=\""+_bip_w+"\" HEIGHT=\""+_bip_h+"\"></CANVAS>" ;
        CIRCLESgeneralpurposeFORM( "forms", "general.purpose", YES, _popup_w, _popup_h, "BIP box - Real dims",
                                   20, ( $( "#menu" ).height() + 20 ), "#FAFAFA", NO, _html_code, YES ) ;
        
        var _bip_realdims_canvas = $( "#CIRCLESbiprealdimsCANVAS" ).get(0) ;
        if ( is_html_canvas( _bip_realdims_canvas ) ) circles_lib_canvas_copy( _bip_canvas, _bip_realdims_canvas ) ;
        else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Critical failure while displaying the read dims bip box", 'CIRCLESformsBIPoutputMSG', 3000 ) ;
    }
    else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, "Missing BIP box data", "CIRCLESformsBIPoutputMSG", 3000 ) ;
}

function CIRCLESformsBIPtips( _silent, _out_channel )
{
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _msg = "Open menu entry : SETTINGS >> GENERAL >> OPTIONS >> Z-PLANE | W-PLANE" ;
        _msg += "<br>to select what canvas to render" ;
    if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, _msg, "CIRCLESformsBIPoutputMSG", 5000 ) ;
    return [ RET_OK, _msg ];
}

function CIRCLESformsBIPreviewSETTINGS( _silent, _out_channel )
{
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    if ( is_html_canvas( _glob_bipbox_canvas ) )
    {
        var _memo = [] ;
        if ( _glob_bip_original_plane_data == Z_PLANE ) _memo.push( "Objects to draw: from Z-plane." );
        else if ( _glob_bip_original_plane_data == W_PLANE ) _memo.push( "Objects to draw: from W-plane." );

        if ( _glob_bip_original_plane_coords == Z_PLANE ) _memo.push( "Coordinates from : Z-plane." );
        else if ( _glob_bip_original_plane_coords == W_PLANE ) _memo.push( "Coordinates from : W-plane." );
        else if ( _glob_bip_original_plane_coords == BIP_BOX ) _memo.push( "Coordinates from : user-defined region." );
        else if ( _glob_bip_original_plane_coords == NO_PLANE ) _memo.push( "Coordinates from : Undetermined." );

        var _canvas_width = _glob_bipbox_canvas.get_width(), _canvas_height = _glob_bipbox_canvas.get_height();
            _glob_bip_bk = _glob_bipbox_canvas.getContext( _glob_canvas_ctx_2D_mode ).backgroundColor ;
        var _bip_color_tag = ( circles_lib_colors_get_formats( _glob_bip_bk ) )[COLOR_TAG] ;
        var _open_fontcolor_tag = "", _close_fontcolor_tag = "" ;
        var _msg = "Settings applied.\n" ;
            _msg += _glob_crlf + _memo.join( _glob_crlf )  + _glob_crlf ;
        var _corners = bipbox_sm.get_coords_corners();
            _msg += "\nBip region coordinates:"
            _msg += "\nCenter (x,y): " + ( is_point( _glob_bip_box_center_pt ) ? ( _glob_bip_box_center_pt.x + "," + _glob_bip_box_center_pt.y ) : "none" );
            _msg += "\nLeft, Up: " + ( _corners['lu'] != null ? ( _corners['lu'].x + "," + _corners['lu'].y ) : "not set yet" );
            _msg += "\nRight, Down : " + ( _corners['rd'] != null ? ( _corners['rd'].x + "," + _corners['rd'].y ) : "not set yet" );

            _msg += "\n\n" + "Additional metrics : "  ;
            _open_fontcolor_tag = ( _canvas_width == 0 || _canvas_height == 0 ) ? "<SPAN STYLE=\"color:orange;\">" : "" ;
            _close_fontcolor_tag = ( _canvas_width == 0 || _canvas_height == 0 ) ? "</SPAN>" : "" ;
            _msg += "\nPixel size (in units) : " + _glob_bip_pixel_size ;
            _msg += "\nPixels: " + _open_fontcolor_tag + _canvas_width + " x " + _canvas_height + " pixels" + _close_fontcolor_tag ;

            _open_fontcolor_tag = ( _glob_bip_x_extent == 0 || _glob_bip_y_extent == 0 ) ? "<SPAN STYLE=\"color:orange;\">" : "" ;
            _close_fontcolor_tag = ( _glob_bip_x_extent == 0 || _glob_bip_y_extent == 0 ) ? "</SPAN>" : "" ;
            _msg += "\nX,Y extents: " + _open_fontcolor_tag + _glob_bip_x_extent + " x " + _glob_bip_y_extent + _close_fontcolor_tag ;

            _open_fontcolor_tag = _glob_bip_shorterside_pixels == 0 ? "<SPAN STYLE=\"color:orange;\">" : "" ;
            _close_fontcolor_tag = _glob_bip_shorterside_pixels == 0 ? "</SPAN>" : "" ;
            _msg += "\nShorter side (pixels): " + _open_fontcolor_tag + _glob_bip_shorterside_pixels + _close_fontcolor_tag ;

            _msg += "\nBackground color : " + _glob_bip_bk + ( _bip_color_tag.length > 0 ? " ("+_bip_color_tag+")" : "" );
            _msg += "\nTicks : " + _glob_bip_ticks + _glob_crlf ;

        switch( _glob_export_format )
        {
            case EXPORT_NONE: _msg += _glob_crlf + "Export to PNG format (default)" ; break ;
            case EXPORT_SVG: _msg += _glob_crlf + "Export to SVG format" ; break ;
            case EXPORT_PS: _msg += _glob_crlf + "Export to PS format" ; break ;
            case EXPORT_EPS: _msg += _glob_crlf + "Export to EPS format" ; break ;
            case EXPORT_LATEX: _msg += _glob_crlf + "Export to LaTeX format" ; break ;
            default: _msg += _glob_crlf + "Export to unknown option" ; break ;
        }

        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, _msg.replace( /\n/g, "<br>" ), "CIRCLESformsBIPoutputMSG", 8000 ) ;
        return [ RET_OK, _msg ];
    }
    else
    {
        var _msg = "Memory failure" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, _msg, "CIRCLESformsBIPoutputMSG", 1500 ) ;
        return [ RET_ERROR, _msg ];
    }
}

function CIRCLESformsBIPtrigger( _opcode, _silent, _render, _update, _out_channel )
{
    _opcode = safe_int( _opcode, UNDET ), _silent = safe_int( _silent, UNDET );
    _render = safe_int( _render, NO ), _update = safe_int( _update, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    switch( _opcode )
    {
        case 1:
        var _ret_chunk = circles_lib_bip_apply_settings( OUTPUT_SCREEN, !_silent?YES:NO, _silent, _update );
      	var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO;
			  var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Fail to perform operation";
        if ( _ret_id == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, _ret_msg, "CIRCLESformsBIPoutputMSG" ) ;
        else if ( _ret_id == 1 && _render )
        {
           if ( _out_channel == OUTPUT_SCREEN ) circles_lib_canvas_process_ask( YES, _silent, BIP_BOX, _render, YES, CHECK, [], _out_channel );
           else circles_lib_bip_render( _silent, _out_channel );
        }
        break ;
        default: break ;
    }
}

function CIRCLESformsBIPticksGEToptimal()
{
    // settings extents and alia
    var _x_l10 = Math.log( _glob_bip_x_extent ) / Math.log( 10 );
        _x_l10 = Math.floor( _x_l10 );
    var _y_l10 = Math.log( _glob_bip_y_extent ) / Math.log( 10 );
        _y_l10 = Math.floor( _y_l10 );
    var _l10 = Math.min( _x_l10, _y_l10 );
        _l10++ ;
    var _10_x_extent = _glob_bip_x_extent * Math.pow( 10, _l10 );
    var _10_y_extent = _glob_bip_y_extent * Math.pow( 10, _l10 );
    var _side = gcd( _10_x_extent, _10_y_extent );
    var _interval = Math.max( _side * Math.pow( 10, -_l10 - 1 ), 0.22 );
    var _x_ticks = safe_int( _glob_bip_x_extent / _interval, 1 );
    var _y_ticks = safe_int( _glob_bip_y_extent / _interval, 1 );
    _glob_bip_ticks = Math.min( _x_ticks, _y_ticks );
    return _glob_bip_ticks < DEFAULT_TICKS ? DEFAULT_TICKS : _glob_bip_ticks  ;
}

function CIRCLESformsBIPcolorBTNS( _alert )
{
    _alert = safe_int( _alert, NO );
  	$('[id$=initBTN]').css('color',_alert?COLOR_ERROR:DEFAULT_COLOR_STD);
    if (_glob_bip_use)
    {
        if ( _glob_bip_original_plane_data.is_one_of( Z_PLANE, W_PLANE ) )
        $('[id$=renderBTN]').css('color',_alert?COLOR_ERROR:DEFAULT_COLOR_STD);
        else $('[id$=renderBTN]').css('color',DEFAULT_COLOR_STD);
    }
    else $('[id$=renderBTN]').css('color',_alert?COLOR_ERROR:DEFAULT_COLOR_STD);
}

function CIRCLESformsBIPcanvasmirrorSHOW( bSHOW, _silent, _out_channel )
{
    bSHOW = safe_int( bSHOW, YES ), _silent = safe_int( _silent, YES );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _copy_bip_width = $( "#copy_bip_canvasDIV" ).width();
    $( "#BIPBOX_EXTENT_W" ).html( "Width " + $( "#CIRCLESbipCANVAS" ).get(0).get_width() );
    $( "#BIPBOX_EXTENT_H" ).html( "Height " + $( "#CIRCLESbipCANVAS" ).get(0).get_height() );

    var _ret_chunk = bSHOW ? circles_lib_canvas_layer_copy( "CIRCLESbipCANVAS", "copy_bip_canvas", _copy_bip_width - 5, _copy_bip_width - 5 ) : null ;
    if ( bSHOW )
    {
       var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], UNDET ) : UNDET ;
       var _ret_msg = ( is_array( _ret_chunk ) && _ret_id != UNDET ) ? _ret_chunk[1] : _ERR_00_00 ;
       if ( _ret_id == UNDET )
       {
          var _msg = "Memory failure" ;
          if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, _ret_msg, "CIRCLESformsBIPoutputMSG" ) ;
          return [ RET_ERROR, _msg ] ;
       }
       else if ( _ret_id != YES )
       {
          if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_ERROR, _ret_msg, "CIRCLESformsBIPoutputMSG" ) ;
          return [ RET_ERROR, _ret_msg ] ;
       }
    }
      
    bSHOW ? $( "#copy_bip_canvasDIV" ).slideDown("slow") : $( "#copy_bip_canvasDIV" ).slideUp("fast");
    if ( !bSHOW ) return [ RET_OK, "No canvas mirrored" ] ;
}

function CIRCLESformsBIPbuttons( _b_enable )
{
    $("#CIRCLESbipLISTbtn").attr( "class", _glob_bip_use ? "link_rounded" : "link_rounded_dead" );
    $("#CIRCLESbipLISTbtn").bind( "click", _glob_bip_use ? function() { CIRCLESformsBIPreviewSETTINGS() } : function() {} );

    $("#CIRCLESbipTIPSbtn").attr( "class", _glob_bip_use ? "link_rounded" : "link_rounded_dead" );
    $("#CIRCLESbipTIPSbtn").bind( "click", _glob_bip_use ? function() { CIRCLESformsBIPtips() } : function() {} );

    $("#BIPinitBTN").attr( "class", _glob_bip_use ? "link_rounded" : "link_rounded_dead" );
    $("#BIPinitBTN").bind( "click", _glob_bip_use ? function() { _glob_items_to_init=NO;$('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);CIRCLESformsBIPtrigger(1,YES,NO,YES);circles_lib_items_init(null,NO,YES); } : function() {} );

    $("#BIPrenderBTN").attr( "class", _glob_bip_use ? "link_rounded" : "link_rounded_dead" );
    $("#BIPrenderBTN").bind( "click", _glob_bip_use ? function() { CIRCLESformsBIPcanvasmirrorSHOW(HIDE);CIRCLESformsBIPtrigger(1,YES,YES,NO); } : function() {} );

    $("#BIPsaveBTN").attr( "class", _glob_bip_use ? "link_rounded" : "link_rounded_dead" );
    $("#BIPsaveBTN").bind( "click", _glob_bip_use ? function() { CIRCLESformsBIPsavePIX(); } : function() {} );

    $("#BIPpreviewBTN").attr( "class", _glob_bip_use ? "link_rounded" : "link_rounded_dead" );
    $("#BIPpreviewBTN").bind( "click", _glob_bip_use ? function() { CIRCLESformsBIPcanvasmirrorSHOW(SHOW); } : function() {} );

    $("#BIPrealdimsBTN").attr( "class", _glob_bip_use ? "link_rounded" : "link_rounded_dead" );
    $("#BIPrealdimsBTN").bind( "click", _glob_bip_use ? function() { CIRCLESformsBIPcanvasREALDIMS(); } : function() {} );
}

function CIRCLESformsBIPcoordsMANAGER( _diagram_type, _compute )
{
    _compute = safe_int( _compute, NO );
    var LEFT, TOP, RIGHT, BOTTOM ;
    switch( _glob_target_plane )
    {
        case Z_PLANE: LEFT = _glob_zplaneLEFT, TOP = _glob_zplaneTOP, RIGHT = _glob_zplaneRIGHT, BOTTOM = _glob_zplaneBOTTOM ; break ;
        case W_PLANE: LEFT = _glob_wplaneLEFT, TOP = _glob_wplaneTOP, RIGHT = _glob_wplaneRIGHT, BOTTOM = _glob_wplaneBOTTOM ; break ;
        case D_LOCUS: LEFT = _glob_dlocusLEFT, TOP = _glob_dlocusTOP, RIGHT = _glob_dlocusRIGHT, BOTTOM = _glob_dlocusBOTTOM ; break ;
        case BIP_BOX: LEFT = _glob_bipLEFT, TOP = _glob_bipTOP, RIGHT = _glob_bipRIGHT, BOTTOM = _glob_bipBOTTOM ; break ;
        default: break ;
    }
      
		circles_lib_extras_htmlctrl_enable( "BIPcanvasPIXELsize", _diagram_type == BIP_BOX ? NO : YES ) ;
    if ( _compute ) $("#BIPcanvasPIXELsize").val( _glob_bip_pixel_size );

		circles_lib_extras_htmlctrl_enable( "BIPcanvasSHORTERSIDEpixels", _diagram_type == BIP_BOX ? NO : YES ) ;
    if ( _compute ) $("#BIPcanvasSHORTERSIDEpixels").val( _glob_bip_shorterside_pixels );

		circles_lib_extras_htmlctrl_enable( "BIPcanvasTICKS", _diagram_type == BIP_BOX ? NO : YES ) ;
    if ( _compute ) $("#BIPcanvasTICKS").val( _glob_bip_ticks );

		circles_lib_extras_htmlctrl_enable( "BIPcanvasCENTERx", _diagram_type == BIP_BOX ? NO : YES ) ;
    if ( _compute ) $("#BIPcanvasCENTERx").val( ( LEFT + RIGHT ) / 2.0 );

		circles_lib_extras_htmlctrl_enable( "BIPcanvasCENTERy", _diagram_type == BIP_BOX ? NO : YES ) ;
    if ( _compute ) $("#BIPcanvasCENTERy").val( ( TOP + BOTTOM ) / 2.0 );

		circles_lib_extras_htmlctrl_enable( "BIPcanvasEXTENTx", _diagram_type == BIP_BOX ? NO : YES ) ;
    if ( _compute ) $("#BIPcanvasEXTENTx").val( ( RIGHT - LEFT ) / 2.0 );

		circles_lib_extras_htmlctrl_enable( "BIPcanvasEXTENTy", _diagram_type == BIP_BOX ? NO : YES ) ;
    if ( _compute ) $("#BIPcanvasEXTENTy").val( ( TOP - BOTTOM ) / 2.0 );
}

function CIRCLESformsBIPsavePIX()
{
    var _canvas_w = safe_int( _glob_bipbox_canvas.get_width(), 0 ), _canvas_h = safe_int( _glob_bipbox_canvas.get_height(), 0 );
    var _aspect_ratio = _canvas_w / _canvas_h ;
    var _bip_thumb_canvas_w = 200, _bip_thumb_canvas_h = Math.ceil( _bip_thumb_canvas_w / _aspect_ratio );
    var HTMLcode = "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\">Confirm to save this pix ?</td>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\"><CANVAS ID=\"CIRCLESbipthumbCANVAS\" WIDTH=\""+_bip_thumb_canvas_w+"\" HEIGHT=\""+_bip_thumb_canvas_w+"\" STYLE=\"width:"+_bip_thumb_canvas_w+"px;height:"+_bip_thumb_canvas_h+"px;\"></CANVAS></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "</table>" ;

    alert_plug_fn( ALERT_YES, "_glob_export_format=EXPORT_NONE;circles_lib_files_pix_save_ask( BIP_BOX, _glob_bipbox_canvas.id, 'circles.bip.png', NO, YES, OUTPUT_NONE );" );
    alert_plug_fn( ALERT_NO, "alertCLOSE();" );

    circles_lib_output( OUTPUT_SCREEN, DISPATCH_YESNO | DISPATCH_QUESTION, HTMLcode, _glob_app_title + " - " + circles_lib_plane_def_get( BIP_BOX ) );
    circles_lib_canvas_blowup( _glob_bipbox_canvas, $('#CIRCLESbipthumbCANVAS').get(0), 0, 0, _canvas_w, _canvas_h );
}

function CIRCLESformsBIPupdateCOORDS()
{
    var LEFT, TOP, RIGHT, BOTTOM ;
    switch( _glob_target_plane )
    {
       case Z_PLANE: LEFT = _glob_zplaneLEFT, TOP = _glob_zplaneTOP, RIGHT = _glob_zplaneRIGHT, BOTTOM = _glob_zplaneBOTTOM ; break ;
       case W_PLANE: LEFT = _glob_wplaneLEFT, TOP = _glob_wplaneTOP, RIGHT = _glob_wplaneRIGHT, BOTTOM = _glob_wplaneBOTTOM ; break ;
       case D_LOCUS: LEFT = _glob_dlocusLEFT, TOP = _glob_dlocusTOP, RIGHT = _glob_dlocusRIGHT, BOTTOM = _glob_dlocusBOTTOM ; break ;
       case BIP_BOX: LEFT = _glob_bipLEFT, TOP = _glob_bipTOP, RIGHT = _glob_bipRIGHT, BOTTOM = _glob_bipBOTTOM ; break ;
       default: break ;
    }

    $("#BIPcanvasCENTERx").val( ( LEFT + RIGHT ) / 2.0 ), $("#BIPcanvasCENTERy").val( ( TOP + BOTTOM ) / 2.0 );
    _glob_bip_box_center_pt = new point( safe_float( $("#BIPcanvasCENTERx").val(), 0 ), safe_float( $("#BIPcanvasCENTERy").val(), 0 ) );

    $("#BIPcanvasEXTENTx").val( Math.abs( ( RIGHT - LEFT ) ) );
    $("#BIPcanvasEXTENTy").val( Math.abs( TOP - BOTTOM ) );
    _glob_bip_x_extent = safe_float( $("#BIPcanvasEXTENTx").val(), 0 );
    _glob_bip_y_extent = safe_float( $("#BIPcanvasEXTENTy").val(), 0 );
}