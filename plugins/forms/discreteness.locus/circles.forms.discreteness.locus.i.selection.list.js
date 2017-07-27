function CIRCLESformsDISCRETENESSLOCUSselectionlistDRAW()
{
    var _size = safe_size( CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array, 0 ) ;
    if ( _size > 0 )
    {
        var _canvas = $( "#CIRCLESdlocusdiagramCANVAS" ).get(0);
        var _context = _canvas.getContext( _glob_canvas_ctx_2D_mode );
        var _screen_pts_array = [] ;
        $.each( CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array,
                function( _i, _complex_pt )
                {
                   _screen_pts_array.push( dlocus_sm.from_cartesian_to_client( _complex_pt.real, _complex_pt.imag ) );
                   circles_lib_draw_point( _context, dlocus_sm, _complex_pt.real, _complex_pt.imag,
                                     YES, _glob_pt_border_color, YES, DEFAULT_PT_INTERIOR_COLOR,
                                     DEFAULT_PT_BORDER, DEFAULT_PT_RADIUS, _glob_opacity, 0 );
                }
              );
    }
}

function CIRCLESformsDISCRETENESSLOCUSselectionlistDELETE( _pt_index )
{
    var _pt = CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array[ _pt_index ] ;
    if ( is_complex( _pt ) )
    {
        var _msg = "Do you confirm to remove the point " + _pt.formula() + " from the selection list ?" ;
        if ( confirm( _msg ) )
        {
            CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array.remove( _pt_index, _pt_index );
            CIRCLESformsDISCRETENESSLOCUSselectionlistUPDATE();
        }
    }
    else
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "This selection does not refer to any valid selection point.", "CIRCLESformsDLOCUSoutMSG" ) ;
}

function CIRCLESformsDISCRETENESSLOCUSselectionlistBOMB( _silent )
{
		_silent = safe_int( _silent, NO ) ;
    var _msg = "Do you confirm to delete all entries from the selection list ?" ;
    var _b_ok = _silent ? YES : confirm( _msg ) ;
    if ( _b_ok )
    {
       CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array = [] ;
       CIRCLESformsDISCRETENESSLOCUSselectionlistUPDATE();
	     var _canvas_id = _glob_target_plane == BIP_BOX ? "CIRCLESbipCANVAS" : "CIRCLESdlocusdiagramCANVAS" ;
		   var _out_canvas = $( "#" + _canvas_id ).get(0);
       CIRCLESformsDISCRETENESSLOCUSdrawBOUNDARY( _out_canvas, NO, YES );
    }
}

function CIRCLESformsDISCRETENESSLOCUSselectionlistAPPLY( _pt_index )
{
    if ( CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array[ _pt_index ] != null )
    {
       var _pt = CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array[ _pt_index ] ;
       if ( is_complex( _pt ) )
       {
			 	  CIRCLESformsDISCRETENESSLOCUSplugin_pick = $( "#CIRCLESformsDISCRETENESSLOCUSpickforpluginCHECKBOX" ).prop( "checked" ) ? YES : NO ;
          $( "#CIRCLESformsDISCRETENESSLOCUScuspVALUE" ).val( _pt.formula() );
          $( "#CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT" ).val( _pt.formula() );
          $( "#CIRCLESformsDISCRETENESSLOCUSpickedCOMPLEXPT" ).css( "background-color", "white" );
          var _trace_fix_op = $( "#FIXTRACECOMBO" ).get(0) != null ? $( "#FIXTRACECOMBO" ).val() : 0 ;
          if ( CIRCLESformsDISCRETENESSLOCUSplugin_pick )
          {
              var _t_a = new complex( 0, 0 ), _t_b = new complex( 0, 0 );
              if ( _trace_fix_op.is_one_of( 0, UNDET ) ) // fix trace B
              {
                  _t_a = _pt ;
                  _t_b = $( "#CIRCLESformsDISCRETENESSLOCUStraceB" ).get(0) != null ? $( "#CIRCLESformsDISCRETENESSLOCUStraceB" ).val() : "0"
                  _t_b = parse_complex_from_string( circles_lib_math_parse_formula( _t_b ) );
              }
              else if ( _trace_fix_op == 1 ) // fix trace A
              {
                  _t_a = $( "#CIRCLESformsDISCRETENESSLOCUStraceA" ).get(0) != null ? $( "#CIRCLESformsDISCRETENESSLOCUStraceA" ).val() : "0"
                  _t_a = parse_complex_from_string( circles_lib_math_parse_formula( _t_a ) );
                  _t_b = _pt ;
              }
                 
              var _ret_fill = GLOB_PLUGIN_PARAMS_FILLER( _t_a, _t_b );
					}
       }
    }
    else
		circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "This selection does not refer to a valid selection point any longer.", "CIRCLESformsDLOCUSoutMSG" ) ;
}

function CIRCLESformsDISCRETENESSLOCUSselectionlistUPDATE()
{
    var _size = safe_size( CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array, 0 );
    var HTMLcode = "<table ALIGN=\""+( _size > 0 ? "left" : "center" )+"\">" ;
    if ( _size > 0 )
    {
        HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" COLSPAN=\"9\">This list includes "+_size+" entr"+( _size == 1 ? "y" : "ies" )+"</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"right\" COLSPAN=\"9\" CLASS=\"link_rounded\" ONCLICK=\"javasript:CIRCLESformsDISCRETENESSLOCUSselectionlistBOMB();\">Delete all entries</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        $.each( CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array,
                function( _i, complex_pt )
                {
                   HTMLcode += "<tr>" ;
                   HTMLcode += "<td WIDTH=\"5\"></td>" ;
                   HTMLcode += "<td>"+( _i + 1 )+")</td>" ;
                   HTMLcode += "<td WIDTH=\"8\"></td>" ;
                   HTMLcode += "<td>"+( is_complex( complex_pt ) ? complex_pt.formula() : "<SPAN STYLE=\"color:#F7F7F7;\">invalid point coords</SPAN>" )+"</td>" ;
                   HTMLcode += "<td WIDTH=\"15\"></td>" ;
                   HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSselectionlistAPPLY( "+_i+" )\">Apply</td>" ;
                   HTMLcode += "<td WIDTH=\"5\"></td>" ;
                   HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsDISCRETENESSLOCUSselectionlistDELETE( "+_i+" )\">Delete</td>" ;
                   HTMLcode += "<td WIDTH=\"5\"></td>" ;
                   HTMLcode += "</tr>" ;
                   HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
               }
             );
    }
    else
    {
        HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:14pt;color:#C0C0C0;\">The list of selected points<br>is empty now</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td CLASS=\"link\" ONCLICK=\"javascript:$('#CIRCLESformsDISCRETENESSLOCUSmainDIV').get(0).tabber.tabShow(4);\" ALIGN=\"center\" STYLE=\"font-size:14pt;color:#D0D0D0;\">Check if the record option has been flagged</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
    }

    HTMLcode += "</table>" ;
    $( "#CIRCLESformsDISCRETENESSLOCUSselectionlistDIV" ).html( HTMLcode );
}