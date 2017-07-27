function CIRCLESformsSVGEDITORrenderSVG() { CIRCLESformsSVGEDITORcodeSCANNER(); }
function CIRCLESformsSVGEDITORcountLINES() { return safe_size( _glob_export_code_array, 0 ); }

function CIRCLESformsSVGEDITORreloadPAGE( _question )
{
		  _question = safe_int( _question, NO );
			var _b_go = _question ? confirm( "Do you want to read the contents of this page ?" ) : YES ;
			if ( _b_go )
			{
				  var _start = CIRCLESformsSVGEDITORpagesCOUNTER * CIRCLESformsSVGEDITORrowsPERpage ;
					var _end = _start + CIRCLESformsSVGEDITORrowsPERpage ;
					var _page_array = _glob_export_code_array.slice( _start, _end ) ;
					
					$('#CIRCLESformsSVGEDITORtextarea').val( _page_array.join( "" ) );
			}
}

function CIRCLESformsSVGEDITORdisplayPAGE( _page, _silent )
{
			_page = Math.max( 1, safe_int( _page, 1 ) ) - 1, _silent = safe_int( _silent, NO );
 			if ( ( _page < 0 || _page >= CIRCLESformsSVGEDITORpagesCOUNT ) && !_silent )
			circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Wrong page number at " + ( _page + 1 ) + _glob_crlf.repeat(2) + "Pages range from 1 to " + CIRCLESformsSVGEDITORpagesCOUNT, _glob_app );
 			else if ( _page >= 0 && _page < CIRCLESformsSVGEDITORpagesCOUNT )
 			{
					$( "#CIRCLESformsSVGEDITORcurrentPAGE" ).val( _page + 1 );
					CIRCLESformsSVGEDITORpagesCOUNTER = _page ;
					var _start = _page * CIRCLESformsSVGEDITORrowsPERpage ;
					var _end = _start + CIRCLESformsSVGEDITORrowsPERpage ;
					var _page_array = _glob_export_code_array.slice( _start, _end ) ;
				  $( "#CIRCLESformsSVGEDITORtextarea" ).val( _page_array.join( "" ) );
				  $( "#CIRCLESformsSVGEDITORlineSTART" ).val( _start );
				  $( "#CIRCLESformsSVGEDITORlineEND" ).val( _end );
			}
}

function CIRCLESformsSVGEDITORcanvasREF( _canvas_ref )
{
    _svg_editor_coords_ref = _canvas_ref = safe_int( _canvas_ref, NO_PLANE );
    _glob_svg_canvas.set_type( _canvas_ref ) ;
    if ( !is_array( _svg_editor_ref_canvas_dims_array ) ) _svg_editor_ref_canvas_dims_array = [];
    else _svg_editor_ref_canvas_dims_array.flush();

    switch( _canvas_ref )
    {
        case Z_PLANE:
        _svg_editor_ref_canvas_dims_array.push( circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID ).get_width() );
        _svg_editor_ref_canvas_dims_array.push( circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID ).get_height() );
        break ;
        case 0:
        case W_PLANE:
        _svg_editor_ref_canvas_dims_array.push( _glob_wplane_grid_canvas_placeholder.get_width() );
        _svg_editor_ref_canvas_dims_array.push( _glob_wplane_grid_canvas_placeholder.get_height() );
        break ;
        case BIP_BOX:
        _svg_editor_ref_canvas_dims_array.push( _glob_bip_canvas.get_width() );
        _svg_editor_ref_canvas_dims_array.push( _glob_bip_canvas.get_height() );
        break ;
        default: break ;
    }
}

function CIRCLESformsSVGEDITORsaveCODE()
{
     if( _svg_editor_updated ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Be careful !"+_glob_crlf+"Changes have not been updated yet, so they won't be saved to a file.", _glob_app );
     var _integrity_array = CIRCLESformsSVGEDITORcodeINTEGRITY();
     var _plane_label = circles_lib_plane_get_def( _svg_editor_coords_ref ).toLowerCase().replaceAll( [ ".", "-" ], "" );
     var _fn = "circles_lib_canvas_save_to_svg( '"+_plane_label+".svg' )" ;
     CIRCLESformsSVGEDITORcodeINTEGRITYresponse( _integrity_array, _fn );
}

function CIRCLESformsSVGEDITORupdated( _b_updated )
{
     _b_updated = safe_int( _b_updated, YES );
     $("#CIRCLESformsSVGEDITORcheckingLABEL").html( _b_updated ? "SVG code updated" : "" );
     _svg_editor_updated = _b_updated ;
}

function CIRCLESformsSVGEDITORupdateCOUNTboxes()
{
     var _n_lines = CIRCLESformsSVGEDITORcountLINES();
     $("#CIRCLESlinesLABELS").html( _n_lines +" line"+( _n_lines == 1 ? "" : "s" ) );
     $("#CIRCLESformsSVGEDITORlineSTART").html( 1 );
     $("#CIRCLESformsSVGEDITORlineEND").html( _n_lines );
}

function CIRCLESformsSVGEDITORupdateSVGcode()
{
     var _n_lines = CIRCLESformsSVGEDITORcountLINES();
     var _b_abort = ( _n_lines == UNDET || _n_lines == 0 ) ? YES : NO ;
     if ( !_b_abort )
     {
          var _new_lines = $('#CIRCLESformsSVGEDITORtextarea').val().trim();
          if ( _new_lines.length == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't update SVG code: the new text code is empty.", _glob_app );
          else
          {
              var _collection_array = [];
              var _new_lines_array = _new_lines.replaceAll( [ CRLF_WIN, CRLF_NO_WIN, '<br>' ], _glob_crlf ).split( _glob_crlf );
              var _new_lines_count = safe_size( _new_lines_array, 0 ), _new_line ;
    
              for( var _i = 0 ; _i < _new_lines_count ; _i++ )
              {
                  _new_line = _new_lines_array[_i].trim();
                  if ( _new_line.length > 0 ) _collection_array.push( _new_line );
              }
    
    					var _base_index = CIRCLESformsSVGEDITORpagesCOUNTER * CIRCLESformsSVGEDITORrowsPERpage ;
    					var _pre_chunk = _glob_export_code_array.left( _base_index );
    					var _post_chunk = _glob_export_code_array.slice( ( CIRCLESformsSVGEDITORpagesCOUNTER + 1 ) * CIRCLESformsSVGEDITORrowsPERpage );
    					_glob_export_code_array = [] ;
    					if ( is_array( _pre_chunk ) ) _glob_export_code_array = _glob_export_code_array.concat( _pre_chunk );
    					if ( is_array( _collection_array ) ) _glob_export_code_array = _glob_export_code_array.concat( _collection_array );
    					if ( is_array( _post_chunk ) ) _glob_export_code_array = _glob_export_code_array.concat( _post_chunk );
              CIRCLESformsSVGEDITORupdated(0);
              CIRCLESformsSVGEDITORupdateCOUNTboxes();
              circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "SVG code has been updated.", _glob_app );
          }
     }
     else if ( _n_lines == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't update SVG code: code is empty.", _glob_app );
     else if ( _n_line == UNDET ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, "Can't update SVG code: memory failure.", _glob_app );
}

function CIRCLESformsSVGEDITORcheckSVGcode( _silent )
{
		 _silent = safe_int( _silent, YES ), _code = $('#CIRCLESformsSVGEDITORtextarea').val().trim();
     if ( _code.length > 0 )
     {
          var _integrity_response = CIRCLESformsSVGEDITORcodeINTEGRITY();
          var _integrity_collection_array = CIRCLESformsSVGEDITORcodeINTEGRITYresponse( _integrity_response, null );
          var _integrity_ret_flag = _integrity_collection_array != null ? _integrity_collection_array[0] : 0 ;
          var _integrity_ret_msg = _integrity_collection_array != null ? _integrity_collection_array[1] : new String( "" );
          var _msg = _integrity_ret_flag == 0 ? "SVG code has been checked" : "SVG code has been checked and updated after the following corrections:\n" + ( ( _integrity_ret_msg.length > 0 ) ? _integrity_ret_msg : "" );
          if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, _integrity_ret_flag == 0 ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, _glob_app );
          // found errors, display corrected code
          if ( _integrity_ret_flag != 0 ) $('#CIRCLESformsSVGEDITORtextarea').val( _glob_export_code_array );
          CIRCLESformsSVGEDITORupdateCOUNTboxes();
     }
     else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The editor is empty: no code to update."+_glob_crlf+"Display lines first.", _glob_app );
}

function CIRCLESformsSVGEDITORreset()
{
    _svg_editor_line_start = _svg_editor_line_end = 1 ;
    // don't put constant identifiers cause the interpreter won't recognize them at start-up
    _svg_editor_coords_ref = 2 ;
    _svg_editor_ref_canvas_dims_array = null ;
    _svg_editor_updated = NO ;
    _svg_allow_dashline_for_border_off = NO ;
}

function CIRCLESformsSVGEDITORcleanCODE( _question, _silent )
{
    if ( $('#CIRCLESformsSVGEDITORtextarea').val().trim().length > 0 )
    {
         var _b_go = _question ? confirm( "Do you want to clean the code in the SVG editor text box ?" ) : YES ;
         if ( _b_go )
         {
              $('#CIRCLESformsSVGEDITORtextarea').val( "" );
              _glob_export_code_array.flush();
              CIRCLESformsSVGEDITORreset();
         }
    }
}

function CIRCLESformsSVGEDITORrenderPAGE()
{
    var _selected_text = $("#CIRCLESformsSVGEDITORtextarea").val().trim() ;
    if ( _selected_text.length > 0 )
    {
         CIRCLESformsSVGEDITORcodeSCANNER( _selected_text );
         // the selected text will be scanned and interpreted
         // resulting figures will be drawn upon the freedraw canvas
    }
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't render: code is empty.", _glob_app );
}

function CIRCLESformsSVGEDITORload( _filename, _file_contents )
{
    // take care of acquiring the current terminal #ID so put contents into the associated tab
    // use _glob_terminal_form_suffix
    if ( $( "#CIRCLESformsSVGEDITORtextarea").get(0) != null )
    {
        $("#CIRCLESformsSVGEDITORtextarea" ).val( _file_contents );
        CIRCLESformsSVGEDITORupdateCOUNTboxes();
        CIRCLESformsSVGEDITORrenderPAGE();
    }
}