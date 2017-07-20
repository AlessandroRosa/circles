function CIRCLESformsMERGINGclose() { return YES ; }

function CIRCLESformsMERGINGmain( _base_id, _move, _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    CIRCLESformsMERGINGbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    if ( _plane_type == NO_PLANE ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing plane ref", _glob_app );
    else
    {
         var _plane_def = circles_lib_plane_get_def( _plane_type );
         var _layers_array = circles_lib_canvas_layer_pile_get_per_plane( _plane_type );
         var _n_layers = safe_size( _layers_array, 0 );
         var WIDTH = 260, HEIGHT = "auto", _subset = "forms" ;
         var _div_id = CIRCLESformsMERGINGdiv_id = circles_lib_popup_build_divid( _subset, _base_id ) ;
         var CLOSE_FN = "CIRCLESformsMERGINGclose()" ;
         var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
             HTMLcode += circles_lib_popup_caption_code( YES, CIRCLESformsMERGINGcaption + " - " + _plane_def, 1,
						 																	YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name,
																							_base_id, _div_id, _subset );
             HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

          var _checkbox_cmd = _plane_type == Z_PLANE ? "_glob_zplane_canvas_merge=this.checked?YES:NO;" : "_glob_wplane_canvas_merge=this.checked?YES:NO;" ;
              _checkbox_cmd += "CIRCLESformsMERGINGmergeCHECKBOX( this.checked, "+_plane_type+", "+_n_layers+" )" ;
          var _merge_status = _plane_type == Z_PLANE ? _glob_zplane_canvas_merge : _glob_wplane_canvas_merge ;
          var _tab_index = _plane_type == Z_PLANE ? 2 : 3 ;
          var _render_cmd = "CIRCLESformsMERGINGrender( "+_plane_type+", "+_n_layers+" )" ;

              HTMLcode += "<tr><td CLASS=\"general_rounded_corners\" STYLE=\"background-color:#FFEBB8;color:#505050;padding:6px;\"><A HREF=\"#\" ONCLICK=\"javascript:if($('#POPUPgeneraloptionsDIV').resizable('instance')!=undefined){$('#POPUPgeneraloptionsDIV').resizable('destroy');}circles_lib_popup_load('forms','general.options',YES,"+_tab_index+");return false;\">If you don't want transparency to be set as default background color, just open the '"+_plane_def+"' tab in the general options and change the backmost layer color</A></td></tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\">" ;
              HTMLcode += "<table>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td WIDTH=\"4\"></td>" ;
              HTMLcode += "<td><INPUT TYPE=\"checkbox\" "+( _merge_status ? "CHECKED" : "" )+" ONCLICK=\"javascript:"+_checkbox_cmd+"\"></td>" ;
              HTMLcode += "<td WIDTH=\"5\"></td>" ;
							HTMLcode += "<td>Merge all "+_plane_def+" layers</td>" ;
              HTMLcode += "</tr>" ;
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;
        
              HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
              HTMLcode += "<tr>" ;
              HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F3F3F3;padding:4px;\">" ;
              HTMLcode += "<table>" ;

              var _checked = NO, _role_index = 0 ;
              for( var _i = 0 ; _i < _n_layers ; _i++ )
              {
                   _role_index = _layers_array[_i].get_role_id() ;
                   _checked = _plane_type == Z_PLANE ? _glob_zplane_merging_array.includes( _role_index ) : _glob_wplane_merging_array.includes( _role_index );
                   HTMLcode += "<tr>" ;
                   HTMLcode += "<td><INPUT "+( _merge_status ? "DISABLED" : "" )+" ID=\"CIRCLESmergingRADIO_"+_i+"\" "+( _checked ? "CHECKED" : "" )+" TYPE=\"checkbox\" ONCLICK=\"javascript:CIRCLESformsMERGINGmanageCHECKBOX( this.checked?YES:NO, "+_plane_type+", '"+_role_index+"' );\"></td>" ;
                   HTMLcode += "<td WIDTH=\"5\"></td>" ;
                   HTMLcode += "<td STYLE=\"color:"+( _merge_status ? DEFAULT_EDIT_COLOR_DISABLED : "#000000" )+";\" ID=\"CIRCLESmergingRADIOLABEL_"+_i+"\">"+_layers_array[_i].get_role_def().ucfirst()+"</td>" ;
                   HTMLcode += "</tr>" ;
              }
              HTMLcode += "</table>" ;
              HTMLcode += "</td>" ;
              HTMLcode += "</tr>" ;

              HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
              HTMLcode += "<tr><td STYLE=\"display:"+(!_merge_status?'block':'none')+";\" CLASS=\"link_rounded\" ALIGN=\"center\" ID=\"CIRCLESmergingALLbtn\" ONCLICK=\"javascript:"+_render_cmd+";\">Merge selected layers for next rendering</td></tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;

          HTMLcode += "</table>" ;
          HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
          var _div = circles_lib_popup_create( _base_id, _div_id, _subset, WIDTH, HEIGHT, HTMLcode );
          circles_lib_popup_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsMERGINGcaption + " - " + _plane_def, CLOSE_FN );
          if ( _move && _div != null ) move_div( _div.id, _plane_type == Z_PLANE ? "RIGHT" : "LEFT", "TOP" );
     }
}

function CIRCLESformsMERGINGmanageCHECKBOX( _checked, _plane_type, _role )
{
    _checked = safe_int( _checked, NO );
    _role = safe_float( _role, 0 );
    _plane_type = safe_float( _plane_type, NO_PLANE );
    var _ref = _plane_type == Z_PLANE ? _glob_zplane_merging_array : _glob_wplane_merging_array ;
    if ( _checked && !_ref.includes( _role ) )
        _plane_type == Z_PLANE ? _glob_zplane_merging_array.push( _role ) : _glob_wplane_merging_array.push( _role );
    else if ( !_checked && _ref.includes( _role ) )
        _plane_type == Z_PLANE ? _glob_zplane_merging_array.delete_entry( _role ) : _glob_wplane_merging_array.delete_entry( _role );
}

function CIRCLESformsMERGINGmergeCHECKBOX( _checked, _plane_type, _n_layers )
{
    $( "[id^=CIRCLESmergingRADIO_]" ).prop( "checked", false );
    $( "[id^=CIRCLESmergingRADIO_]" ).prop( "disabled", _checked );
    $( "[id^=CIRCLESmergingRADIOLABEL_]" ).css( "color", _checked ? DEFAULT_EDIT_COLOR_DISABLED : "#000000" );
    if ( _checked ) _plane_type == Z_PLANE ? _glob_zplane_merging_array.flush() : _glob_wplane_merging_array.flush();
    !_checked ? $( "#CIRCLESmergingALLbtn" ).show() : $( "#CIRCLESmergingALLbtn" ).hide();
}

function CIRCLESformsMERGINGrender( _plane_type, _n_layers )
{
     var _ref = _plane_type == Z_PLANE ? _glob_zplane_merging_array : _glob_wplane_merging_array ;
     var _merge = _plane_type == Z_PLANE ? _glob_zplane_canvas_merge : _glob_wplane_canvas_merge ;
     if ( !_merge && safe_size( _ref, 0 ) == 0 )
         circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't render due to invalid selection: no input layers to merge" );     
     else
     {
         if ( _plane_type == Z_PLANE )
         {
		         var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, _glob_zplane_merging_array, YES, YES, YES, NO, YES, OUTPUT_SCREEN );
		         var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
		         var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "16Unknown error" ;
		         if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
				 }
         else if ( _plane_type == W_PLANE )
         circles_lib_canvas_process_ask( YES, NO, _plane_type, YES, YES, CHECK, _plane_type == Z_PLANE ? _glob_zplane_merging_array.clone() : _glob_wplane_merging_array.clone(), OUTPUT_SCREEN );
         else
         circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Invalid target of merging action." + _glob_crlf + "Please, switch to different options from &lsquo;general&rsquo; options form", _glob_app );
     }
}