var _tmp_save_canvas_obj = null ;

function circles_lib_files_pix_quick_save_ask( _plane_type, _merge, _filename )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _merge = safe_int( _merge, NO );
    if ( safe_string( _filename, _glob_export_filename ).length == 0 )
    _filename = _glob_export_filename.length == 0 ? "circles.pix.png" : _glob_export_filename ;
    if ( !( _filename.trim().toLowerCase().right( 4 ).is_one_of( ".png", ".pdf", ".svg", ".eps", ".ps" ) ) ) _filename += ".png" ;
    circles_lib_files_pix_save_ask( _plane_type, _tmp_save_canvas_obj, _filename, _merge );
}

function circles_lib_files_pix_save( _plane_type, _filename, _merge, _silent, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _filename = safe_string( _filename, "circle.pix.png" ).toLowerCase();
    _merge = safe_int( _merge, NO );
    _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _index = _plane_type == Z_PLANE ? _glob_zplane_selected_canvas_index_for_merging : _glob_wplane_selected_canvas_index_for_merging ;
    if ( _merge ) _tmp_save_canvas_obj = circles_lib_canvas_merge_all_per_plane( _plane_type, _index );
    
    if ( _tmp_save_canvas_obj != null )
    {
        _tmp_save_canvas_obj.toBlob(
        function(blob, _filename)
        {
             saveAs( blob, _filename );
        }, _filename );

        var _msg = "Diagram has been saved into a file with success" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
        return [ RET_OK, _msg ];
    }
    else
    {
        var _msg = "Can't save this pix: a layer must be chosen first" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
        return [ RET_ERROR, _msg ];
    }
}

function circles_lib_files_pix_save_canvas_from_ref( _plane_type, _role, _filename )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    var _canvas = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _role );
    circles_lib_files_pix_save_ask( _plane_type, _canvas, _filename, NO, YES, OUTPUT_SCREEN );
}

function circles_lib_files_pix_save_ask( _plane_type, _canvas, _filename, _merge, _silent, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
		if ( _merge ) _tmp_save_canvas_obj = circles_lib_canvas_merge_all_per_plane( _plane_type, 0 );
    else if ( is_html_canvas( _canvas ) ) _tmp_save_canvas_obj = _canvas ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _silent = safe_int( _silent, NO );
    _merge = safe_int( _merge, NO );
    _filename = safe_string( _filename, "circles.pix" ).replaceAll( [ "..", "-", "_" ], "." ) ;
    var _export_format = circles_lib_files_get_export_format() ;
    
    var _param_add_01 = arguments[6] ;

    var _is_png = _export_format == EXPORT_PNG || _filename.toLowerCase().right(4).stricmp( ".png" );
    var _is_svg = _export_format == EXPORT_SVG || _filename.toLowerCase().right(4).stricmp( ".svg" );
    var _is_ps = _export_format == EXPORT_PS || _filename.toLowerCase().right(3).stricmp( ".ps" );
    var _is_eps = _export_format == EXPORT_EPS || _filename.toLowerCase().right(4).stricmp( ".eps" );
    var _is_pdf = _filename.toLowerCase().right(4).stricmp( ".pdf" );
    var _save_fn = "" ;

    if ( ( _is_svg || _is_ps || _is_eps ) && safe_size( _glob_export_code_array, 0 ) == 0 )
    {
        var _FMT = "" ;
        if ( _is_svg ) _FMT = "SVG" ;
        else if ( _is_ps ) _FMT = "PS" ;
        else if ( _is_eps ) _FMT = "EPS" ;
        else if ( _is_pdf ) _FMT = "PDF" ;
        var _msg = "Can't export to "+_FMT+" format: data are empty." ;
            _msg += _glob_crlf + "Please, rendering the picture again." ;
        circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
        return NO ;
    }

    if ( _is_svg ) _save_fn += "circles_lib_canvas_save_to_svg( '" + _filename + "' )"
    else if ( _is_ps || _is_eps ) _save_fn += "circles_lib_canvas_save_to_e_ps( '" + _filename + "' )"
    else if ( _is_pdf )
    {
    		if ( _merge ) _glob_canvas_obj_ref = _tmp_save_canvas_obj ;
				else if ( is_html_canvas( _canvas ) ) _glob_canvas_obj_ref = _canvas ;
				_save_fn += "circles_lib_canvas_save_to_pdf( _glob_canvas_obj_ref, '" + _filename + "', "+_silent+", "+_out_channel+" );" ;
		}
    else if ( _is_png ) _save_fn += "circles_lib_files_pix_save( "+_plane_type+", '"+_tmp_save_canvas_obj.id+"', '" + _filename + "', "+_merge+", "+_silent+", "+_out_channel+" )" ;
    else
    {
         var _ext = _filename.includes( "." ) ? _filename.trim().split( "." ) : [];
         circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Unable to save: " + ( _ext.length > 0 ) ? "unknown format '"+_ext+"'" : "missing file format", _glob_app_title );
         return ;
    }

    var HTMLcode = "<table>" ;
        HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;

        var _merge_switch_plane = circles_lib_plane_get_def( _plane_type );
        if ( !_is_svg && !_glob_bip_use )
        {
             if ( _plane_type.is_one_of( Z_PLANE, W_PLANE ) )
             {
                  var _checkbox_cmd = "alertCLOSE();circles_lib_files_pix_save_ask( "+_plane_type+",null,'"+_filename+"',this.checked?YES:NO,"+_silent+","+_out_channel+" );" ;

                  HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
                  HTMLcode += "<tr><td CLASS=\"general_rounded_corners\" STYLE=\"color:orange;background-color:white;padding:6px;\">If merge option is checked, the background color shall be set in the backmost layer, otherwise it will be transparent in the resulting pix.</td></tr>" ;
                  HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
                  HTMLcode += "<tr><td STYLE=\"font-size:12pt;color:#434343;\">"+_merge_switch_plane+"</td></tr>" ;
                  HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;

                  HTMLcode += "<tr>" ;
                  HTMLcode += "<td VALIGN=\"top\">" ;
                  HTMLcode += "<table>" ;
                  HTMLcode += "<tr>" ;
                  HTMLcode += "<td><INPUT TYPE=\"checkbox\" "+( _merge ? "CHECKED" : "" )+" ONCLICK=\"javascript:"+_checkbox_cmd+"\"></td>" ;
                  HTMLcode += "<td WIDTH=\"5\"></td>" ;
									HTMLcode += "<td>Merge layers "+( _merge ? "(the selection below will be used for merging)" : "" )+"</td>" ;
                  HTMLcode += "</tr>" ;
                  HTMLcode += "</table>" ;
                  HTMLcode += "</td>" ;
                  HTMLcode += "</tr>" ;
                  HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
        
                  if ( _plane_type.is_one_of( Z_PLANE, W_PLANE ) )
                  {
                      var _layers_array = circles_lib_canvas_layer_pile_get_per_plane( _plane_type );
                      if ( !_merge )
                      {
                          HTMLcode += "<tr>" ;
                          HTMLcode += "<td VALIGN=\"top\">" ;
                          HTMLcode += "<table>" ;
    
                          var _checked = NO, _zplane_sel, _wplane_sel ;
                          var _var_ref = _plane_type == Z_PLANE ? "_glob_zplane_selected_canvas_index_for_merging" : "_glob_wplane_selected_canvas_index_for_merging" ;
                          for( var _i = 0 ; _i < _layers_array.length ; _i++ )
                          {
                              _zplane_sel = ( _glob_zplane_selected_canvas_index_for_merging == _i || safe_int( _tmp_save_canvas_obj.get_role_id(), 0 ) == safe_int( _layers_array[_i].get_role_id(), 0 ) );
                              _wplane_sel = ( _glob_wplane_selected_canvas_index_for_merging == _i || safe_int( _tmp_save_canvas_obj.get_role_id(), 0 ) == safe_int( _layers_array[_i].get_role_id(), 0 ) );
                              _checked = _plane_type == Z_PLANE ? _zplane_sel : _wplane_sel ;
                              HTMLcode += "<tr>" ;
                              HTMLcode += "<td><INPUT "+( _checked ? "CHECKED" : "" )+" TYPE=\"radio\" NAME=\"CIRCLESsavePIXradio\" ID=\"CIRCLESsavePIXradio."+( _i < 10 ? "0"+_i : _i )+"\" ONCLICK=\"javascript:"+_var_ref+"="+_i+";circles_lib_files_pix_save_set_canvas( "+_plane_type+", "+_layers_array[_i].get_role_id()+" );\"></td>" ;
                              HTMLcode += "<td WIDTH=\"5\"></td>" ;
                              HTMLcode += "<td>"+_layers_array[_i].get_role_def()+"</td>" ;
                              HTMLcode += "</tr>" ;
                          }
    
                          HTMLcode += "</table>" ;
                          HTMLcode += "</td>" ;
                          HTMLcode += "</tr>" ;
                      }
                      else
                      {
                          var _index = _plane_type == Z_PLANE ? _glob_zplane_selected_canvas_index_for_merging : _glob_wplane_selected_canvas_index_for_merging ;
                              _index = safe_int( _index, UNDET );
                          var _layer_for_merging = _layers_array[ _index ] ;
                          if ( _layer_for_merging != null )
                               HTMLcode += "<tr><td>The layer selected for merging is "+_layer_for_merging.label+"</td></tr>" ;                          
                          else
                          {
                               HTMLcode += "<tr><td>The layer selected for merging is unknown</td></tr>" ;
                               HTMLcode += "<tr><td>Please, uncheck the above option, choose the correct layer and check merge again</td></tr>" ;
                          }
                      }
                  }
             }
        }

    HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    HTMLcode += "<tr><td>Confirm to save "+( _merge ? "it all" : "this layer" )+" into a pix ?</td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    HTMLcode += "</table>" ;

    if ( _out_channel == OUTPUT_SCREEN )
    {
        alert_plug_label( ALERT_YES, "Yes" );
        alert_plug_label( ALERT_NO, "No" );
        alert_plug_fn( ALERT_YES, _save_fn+";alertCLOSE();" );
        alert_plug_fn( ALERT_NO, "alertCLOSE();" );
        alert_set_btns_width( "70px" );
        alert_msg( ALERT_QUESTION | ALERT_YESNO, HTMLcode, _glob_app_title, 480 );
        return YES ;
    }
    else return eval( _save_fn );
}

function circles_lib_files_pix_save( _plane_type, _canvas, _filename, _out_channel, _silent )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN ), _silent = safe_int( _silent, NO ) ;
    if ( is_string( _canvas ) ) _canvas = $( "#"+_canvas ).get(0) ;
		if ( is_html_canvas( _canvas ) )
    {
       _canvas.toBlob( function(blob, _filename) { saveAs( blob, _filename ); }, _filename );
       return [ RET_OK, "Saving the picture file: now wait for the dialog box to open" ];
    }
    else
    {
       var _msg = "Can't save the picture file: a canvas must be chosen first" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
       return [ RET_ERROR, _msg ];
    }
}

function circles_lib_files_pix_save_enable_radio_ctrls( _b_enable )
{
    var _max = 3, CTRLid ;
    for( var i = 1 ; i <= _max ; i++ )
    {
        CTRLid = "#CIRCLESsavePIXradio." + ( i < 10 ? "0" + i : i );
        _b_enable ? $( CTRLid ).hide() : $( CTRLid ).show();
    }
}

function circles_lib_files_pix_save_set_canvas( _plane_type, _role_index, _silent, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _role_index = safe_int( _role_index, ROLE_NONE );
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _role_ref = safe_float( _plane_type + "." + _role_index, ROLE_NONE );
    if ( _plane_type == NO_PLANE )
    {
         var _msg = "Can't save the pix: missing layer ref" ;
         if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         return [ RET_ERROR, _msg ];
    }
    else if ( _role_ref == ROLE_NONE )
    {
         var _msg = "Can't save the pix: missing layer ref" ;
         if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         return [ RET_ERROR, _msg ];
    }
    else
    {
         _tmp_save_canvas_obj = circles_lib_canvas_get_from_role( _plane_type, _role_index );
         return [ RET_OK, "Layer has been set up for saving" ];
    }
}