function CIRCLEStoolsRAWPOINTSLISThelp()
{
    var _msg = [] ;
        _msg.push( "Input syntax for raw points list:" ) ;
        _msg.push( _glob_crlf ) ;
        _msg.push( "Syntax #1: 0,1 or (1,2) - syntax for cartesian/screen coordinates" ) ;
        _msg.push( "Syntax #2: 1+i - syntax for complex coordinates" ) ;
        _msg.push( "Syntax #3: 12,2,a - the cartesian point is with symbol 'a'" ) ;
        _msg.push( "Syntax #4: 1+i,b - the complex point is with symbol 'b'" ) ;
        _msg.push( _glob_crlf ) ;
        _msg.push( "You could input more than one point per line, separated by ';'" ) ;
        _msg.push( "Example #1: 0.2,-0.1;1,1;" ) ;
        _msg.push( "Example #2: (0.2,-0.1)(1,1)" ) ;
        _msg.push( "Example (mixed): (0.2,-0.1)1,1" ) ;
        _msg = _msg.join( _glob_crlf );
    circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, _msg, _glob_app_title );
}

function CIRCLEStoolsRAWPOINTSLISTload( _filename, _file_contents )
{
		var _file_rows = _file_contents.includes( CRLF_WIN ) ? _file_contents.split( CRLF_WIN ) : ( _file_contents.includes( CRLF_NOWIN ) ? _file_contents.split( CRLF_NOWIN ) : null );
		var _new_words_counter = 0, _text = [] ;
		$.each( _file_rows,
    				function( _i, _row )
    				{
               if ( _row.includes_i( "connect" ) )
               {
                  _row = safe_int( _row.replaceAll( [ "connect", ":", " " ], "" ), 0 ) ;
                  $( "#CIRCLEStoolsRAWPOINTSLISTconnectCHECKBOX" ).prop( "checked", _row == 0 ? false : true ) ;
               }
               else if ( _row.includes_i( "map" ) )
               {
                  _row = safe_int( _row.replaceAll( [ "map", ":", " " ], "" ), 0 ) ;
                  $( "#CIRCLEStoolsRAWPOINTSLISTmapCOMBO" ).val( _row );
               }
               else if ( _row.includes_i( "plane" ) )
               {
                  _row = safe_int( _row.replaceAll( [ "plane", ":", " " ], "" ), 0 ) ;
                  $( "#CIRCLEStoolsRAWPOINTSLISTplaneCOMBO" ).val( _row );
               }
               else _text.push( _row );
						}
					);

    if ( safe_size( _text, 0 ) )
    {
        $( "#CIRCLEStoolsRAWPOINTSLISTtextarea" ).val( _text.join( _glob_crlf ) ) ;
        CIRCLEStoolsRAWPOINTSLISTshowLOG( HIDE ) ;
    }
}

function CIRCLEStoolsRAWPOINTSLISTcleanTEXT()
{
    var _text = $( "#CIRCLEStoolsRAWPOINTSLISTtextarea" ).val() ;
    if ( _text.length > 0 )
    {
        CIRCLEStoolsRAWPOINTSLISTshowLOG( HIDE ) ;
        if ( confirm( "Do you confirm to clean the text above ?" ) )
        {
           circles_lib_canvas_clean( CIRCLEStoolsRAWPOINTSLISTcanvas, "transparent" ) ;
           $( "#CIRCLEStoolsRAWPOINTSLISTtextarea" ).val( "" ) ;
        }
    }
}

function CIRCLEStoolsRAWPOINTSLISTcopyintoSTORAGE()
{
    var _map_type = safe_int( $( "#CIRCLEStoolsRAWPOINTSLISTmapCOMBO option:selected" ).val(), 0 ) ;
    var _plane_type = safe_int( $( "#CIRCLEStoolsRAWPOINTSLISTplaneCOMBO option:selected" ).val(), 0 ) ;
    var _text = $( "#CIRCLEStoolsRAWPOINTSLISTtextarea" ).val().replaceAll( [ CRLF_WIN, CRLF_NOWIN ], CRLF_NOWIN ) ;
    if ( _text.length > 0 )
    {
        var _rows = _text.split( CRLF_NOWIN ), _n_errors = 0, _pt, _params, _n_params = 0 ;
        CIRCLEStoolsRAWPOINTSLISTpoints = [], CIRCLEStoolsRAWPOINTSLISTreport = [] ;
        if ( safe_size( _rows, 0 ) > 0 )
        {
            // acquire
            $.each( _rows,
                    function( _i, _row )
                    {
                        _params = _row.split( "," );
                        _n_params = safe_size( _params, 0 ) ;
                        if ( _n_params.is_one_of( 2, 3 ) )
                        {
                            if ( _map_type.is_one_of( 1, 2 ) ) _pt = read_2D_point( _params ) ;
                            else
                            {
                                 _pt = parse_complex_from_string( _params[0] ) ;
                                 _pt = new point( _pt.real, _pt.imag, _POINT_2D_CLS_EUCLIDEAN_ENV, null, null, 0, _params[1] );
                            }
                             
                            if ( is_point( _pt ) )
                            {
                                 CIRCLEStoolsRAWPOINTSLISTpoints.push( _pt );
                                 CIRCLEStoolsRAWPOINTSLISTreport.push( "<SPAN STYLE=\"color:lime;\">Correctly parsed point syntax at row #"+(_i+1) + "</SPAN>" ) ;
                            }
                            else
                            {
                                 _n_errors++ ;
                                 CIRCLEStoolsRAWPOINTSLISTreport.push( "<SPAN STYLE=\"color:orange;\">Inconsistent point syntax at row #"+(_i+1) + "</SPAN>" ) ;
                            }
                        }
                        else
                        {
                            _n_errors++ ;
                            CIRCLEStoolsRAWPOINTSLISTreport.push( "<SPAN STYLE=\"color:orange;\">Missing point params at row #"+(_i+1) + "</SPAN>" ) ;
                        }
                    }
                  ) ;
                  
            var _errors_exist = _n_errors > 0 ? YES : NO ;
            $( "#CIRCLEStoolsRAWPOINTSLISTlogCONTAINER" ).html( CIRCLEStoolsRAWPOINTSLISTreport.join( "<br>" ) );
            
            _glob_storage['points'] = CIRCLEStoolsRAWPOINTSLISTpoints.clone();
            if ( !_errors_exist ) circles_lib_plugin_dispatcher_unicast_message( 'storage.space', "forms", 1 );

            var _msg = !_errors_exist ? "Points have been copied into storage subset with success" : "Encountered errors during the storage process" ;
            if ( _errors_exist ) _msg += " (open log for details)" ;
             
            circles_lib_output( OUTPUT_SPECIAL_FX, !_errors_exist ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, 'CIRCLESformsEDITDISKoutMSG' )
                  
            $( "#CIRCLEStoolsRAWPOINTSLISTlogBTN" ).html( "<IMG TITLE=\"Operation log\" SRC=\""+_glob_path_to_img+"icons/log/log.icon.01.20x20.png\">" );
            $( "#CIRCLEStoolsRAWPOINTSLISTlogBTN" ).get(0).onclick = function() { CIRCLEStoolsRAWPOINTSLISTshowLOG( $( "#CIRCLEStoolsRAWPOINTSLISTtextareaCONTAINER" ).css( "display" ) == "block" ? SHOW : HIDE ) ; } ;
        }
        else circles_lib_output( OUTPUT_SPECIAL_FX,DISPATCH_WARNING, "Fail to draw points: inconsistent input", 'CIRCLEStoolsRAWPOINTSLISToutputBOX' )
    }
    else circles_lib_output( OUTPUT_SPECIAL_FX,DISPATCH_WARNING, "Fail to copy into storage: input box is empty", 'CIRCLEStoolsRAWPOINTSLISToutputBOX' )
}

function CIRCLEStoolsRAWPOINTSLISTsaveTEXT()
{
    var _text = $( "#CIRCLEStoolsRAWPOINTSLISTtextarea" ).val() ;
    if ( _text.length > 0 )
    {
        var _data = [] ;
            _data.push( "connect:" + ( $( "#CIRCLEStoolsRAWPOINTSLISTconnectCHECKBOX" ).prop( "checked" ) ? "1" : "0" ) + _glob_crlf );
            _data.push( "map:" + $( "#CIRCLEStoolsRAWPOINTSLISTmapCOMBO option:selected" ).val() + _glob_crlf );
            _data.push( "plane:" + $( "#CIRCLEStoolsRAWPOINTSLISTplaneCOMBO option:selected" ).val() + _glob_crlf );
            _data.push( _text ) ;

        var blob = new Blob( _data, { type: 'plain/text', endings: 'native' });
        saveAs( blob, "circles.raw.points.txt" );
    }
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Fail to save: the input text box is empty", _glob_app_title );
}

function CIRCLEStoolsRAWPOINTSLISTdraw()
{
    var _map_type = safe_int( $( "#CIRCLEStoolsRAWPOINTSLISTmapCOMBO option:selected" ).val(), 0 ) ;
    var _plane_type = safe_int( $( "#CIRCLEStoolsRAWPOINTSLISTplaneCOMBO option:selected" ).val(), 0 ) ;
    var _text = $( "#CIRCLEStoolsRAWPOINTSLISTtextarea" ).val().replaceAll( [ CRLF_WIN, CRLF_NOWIN ], CRLF_NOWIN ) ;
    if ( _plane_type == NO_PLANE ) circles_lib_output( OUTPUT_SPECIAL_FX,DISPATCH_WARNING, "Please, choose input coords category", 'CIRCLEStoolsRAWPOINTSLISToutputBOX' ) ;
    else if ( _map_type == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX,DISPATCH_WARNING, "Please, choose input coords category", 'CIRCLEStoolsRAWPOINTSLISToutputBOX' ) ;
    else if ( _text.length > 0 )
    {
        if ( _text.includes( CRLF_NOWIN ) ) _text = _text.replaceAll( CRLF_NOWIN, ";" ) ;
        if ( _text.includes( ")(" ) ) _text = _text.replaceAll( ")(", ";" ).replaceAll( "(", "" ).replaceAll( ")", ";" ) ;
        else _text = _text.replaceAll( "(", "" ).replaceAll( ")", ";" ) ;

        var _pts_array = _text.split( ";" ), _n_errors = 0, _pt, _params, _n_params = 0 ;
        _pts_array.clean_from( function( _item ){ return _item.trim().length == 0 ; } );
        var _pts_n = safe_size( _pts_array, 0 ) ;
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Found "+_pts_n+" point"+(_pts_n==1?"":"s"), "CIRCLEStoolsRAWPOINTSLISToutputBOX" );
        CIRCLEStoolsRAWPOINTSLISTpoints = [], CIRCLEStoolsRAWPOINTSLISTreport = [] ;
        if ( safe_size( _pts_array, 0 ) > 0 )
        {
            // acquire
            $.each( _pts_array, function( _i, _pt )
                    {
                        _params = _pt.split( "," ), _n_params = safe_size( _params, 0 ) ;
                        if ( _n_params.is_one_of( 2, 3 ) )
                        {
                            if ( _map_type.is_one_of( 1, 2 ) ) _pt = read_2D_point( _params ) ;
                            else
                            {
                               _pt = parse_complex_from_string( _params[0] ) ;
                               _pt = new point( _pt.real, _pt.imag, _POINT_2D_CLS_EUCLIDEAN_ENV, null, null, 0, _params[1] );
                            }
                             
                            if ( is_point( _pt ) )
                            {
                                CIRCLEStoolsRAWPOINTSLISTpoints.push( _pt );
                                CIRCLEStoolsRAWPOINTSLISTreport.push( "<SPAN STYLE=\"color:lime;\">Correctly parsed point syntax at row #"+(_i+1) + "</SPAN>" ) ;
                            }
                            else
                            {
                                 _n_errors++ ;
                                 CIRCLEStoolsRAWPOINTSLISTreport.push( "<SPAN STYLE=\"color:orange;\">Inconsistent point syntax at row #"+(_i+1) + "</SPAN>" ) ;
                            }
                        }
                        else
                        {
                            _n_errors++ ;
                            CIRCLEStoolsRAWPOINTSLISTreport.push( "<SPAN STYLE=\"color:orange;\">Missing point params at row #"+(_i+1) + "</SPAN>" ) ;
                        }
                    } ) ;
            var _errors_exist = _n_errors > 0 ? YES : NO ;
            $( "#CIRCLEStoolsRAWPOINTSLISTlogCONTAINER" ).html( CIRCLEStoolsRAWPOINTSLISTreport.join( "<br>" ) );
            CIRCLEStoolsRAWPOINTSLISTdrawPOINTS( _plane_type, _map_type ) ;
             
            var _msg = !_errors_exist ? "Drawing process has been successful" : "Encountered errors during the drawing process" ;
            if ( _errors_exist ) _msg += " (open log for details)" ;
             
            circles_lib_output( OUTPUT_SPECIAL_FX, !_errors_exist ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, 'CIRCLESformsEDITDISKoutMSG' )
                  
            $( "#CIRCLEStoolsRAWPOINTSLISTlogBTN" ).html( "<IMG TITLE=\"Operation log\" SRC=\""+_glob_path_to_img+"icons/log/log.icon.01.20x20.png\">" );
            $( "#CIRCLEStoolsRAWPOINTSLISTlogBTN" ).get(0).onclick = function() { CIRCLEStoolsRAWPOINTSLISTshowLOG( $( "#CIRCLEStoolsRAWPOINTSLISTtextareaCONTAINER" ).css( "display" ) == "block" ? SHOW : HIDE ) ; } ;
        }
        else circles_lib_output( OUTPUT_SPECIAL_FX,DISPATCH_WARNING, "Fail to draw points: inconsistent input", 'CIRCLEStoolsRAWPOINTSLISToutputBOX' )
    }
    else circles_lib_output( OUTPUT_SPECIAL_FX,DISPATCH_WARNING, "Fail to draw points: input box is empty", 'CIRCLEStoolsRAWPOINTSLISToutputBOX' ) ;
}

function CIRCLEStoolsRAWPOINTSLISTdrawPOINTS( _plane_type, _map_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ), _map_type = safe_int( _map_type, 0 );
    if ( _plane_type == NO_PLANE ) circles_lib_output( OUTPUT_SPECIAL_FX,DISPATCH_WARNING, "Fail to draw points: missing output plane", 'CIRCLEStoolsRAWPOINTSLISToutputBOX' ) ;
    else if ( safe_size( CIRCLEStoolsRAWPOINTSLISTpoints, 0 ) == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX,DISPATCH_WARNING, "Fail to draw points: missing input", 'CIRCLEStoolsRAWPOINTSLISToutputBOX' ) ;
    else
    {
         var _mapper = _plane_type == Z_PLANE ? zplane_sm : wplane_sm, _screen_pt ;
         CIRCLEStoolsRAWPOINTSLISTcanvas = _plane_type == Z_PLANE ? circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK ) : circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );
         circles_lib_canvas_clean( CIRCLEStoolsRAWPOINTSLISTcanvas, "transparent" ) ;
         var _context = CIRCLEStoolsRAWPOINTSLISTcanvas.getContext( _glob_canvas_ctx_2D_mode );
         if ( $( "#CIRCLEStoolsRAWPOINTSLISTconnectCHECKBOX" ).prop( "checked" ) )
         circles_lib_draw_polyline( _context, _mapper, CIRCLEStoolsRAWPOINTSLISTpoints,
                              _glob_default_line_clr, "",
                              _glob_line_width, YES, _glob_opacity, UNDET, 0, _map_type.is_one_of( 1, 3 ) ? YES : NO ) ;

         $.each( CIRCLEStoolsRAWPOINTSLISTpoints,
                 function( _i, _pt )
                 {
                     _screen_pt = circles_lib_draw_point( _context, _mapper, _pt.x, _pt.y,
                                                    YES, _glob_pt_border_color, YES, _glob_pt_interior_color,
                                                    _glob_pt_border, _glob_pt_radius, _glob_opacity, 0, _map_type.is_one_of( 1, 3 ) ? YES : NO ) ;
                     if ( safe_string( _pt.label, "" ).trim().length > 0 )
                     {
                          circles_lib_draw_text( _context, _mapper, _screen_pt.x, _screen_pt.y, _pt.label,
                                           _glob_label_text_color, "12pt " + DEFAULT_FONT_FAMILY,
                                           5, 4, NO, _glob_opacity, 0 ) ;
                     }
                 }
               ) ;
    }
}

function CIRCLEStoolsRAWPOINTSLISTshowLOG( _action_on_log )
{
		_action_on_log = safe_int( _action_on_log, HIDE );
    if ( _action_on_log == HIDE )
    {
         $( "#CIRCLEStoolsRAWPOINTSLISTtextareaCONTAINER" ).slideDown( "slow", function(){} ) ;
         $( "#CIRCLEStoolsRAWPOINTSLISTlogCONTAINER" ).slideUp( "fast", function(){} ) ;
    }
    else if ( _action_on_log == SHOW )
    {
         $( "#CIRCLEStoolsRAWPOINTSLISTlogCONTAINER" ).slideDown( "slow", function(){} ) ;
         $( "#CIRCLEStoolsRAWPOINTSLISTtextareaCONTAINER" ).slideUp( "fast", function(){} ) ;
    }
}

function CIRCLEStoolsRAWPOINTSLISTlatticeFORM( _action )
{
		_action = safe_int( _action, HIDE );
    if ( _action == SHOW )
    {
         $( "#" + CIRCLEStoolsRAWPOINTSLISTdiv_id ).fadeOut( "slow", function(){} );
         var _latticetype = safe_int( CIRCLEStoolsRAWPOINTSLISToptions['lattice'], 1 ) ;
         var HTMLcode = "<table WIDTH=\"100%\">" ;
             HTMLcode += "<tr>" ;
             HTMLcode += "<td VALIGN=\"top\" ALIGN=\"right\" CLASS=\"popup_caption_bk_enabled\" STYLE=\"background-color:blue;\">" ;
             HTMLcode += "<table WIDTH=\"100%\" HEIGHT=\"20\">" ;
             HTMLcode += "<tr>" ;
             HTMLcode += "<td WIDTH=\"5\"></td>" ;
             HTMLcode += "<td STYLE=\"color:white;\"><b>Construct a point lattice</b> (Raw points list)</td>" ;
             HTMLcode += "<td></td>" ;
             HTMLcode += "<td WIDTH=\"12\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTlatticeFORM("+HIDE+");\"><IMG TITLE=\"Close Pop-up\" SRC=\""+_glob_path_to_img+"/icons/close/close.icon.01.12x12.png\"></td>" ;
             HTMLcode += "<td WIDTH=\"5\"></td>" ;
             HTMLcode += "</tr>" ;
             HTMLcode += "</table>" ;
             HTMLcode += "</td>" ;
             HTMLcode += "</tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
             HTMLcode += "<tr>" ;
             HTMLcode += "<td VALIGN=\"top\">" ;
             HTMLcode += "<table>" ;
             HTMLcode += "<tr>" ;
             HTMLcode += "<td WIDTH=\"10\"></td>" ;
             HTMLcode += "<td>Orthogonal</td>" ;
             HTMLcode += "<td WIDTH=\"2\"></td>" ;
             HTMLcode += "<td><INPUT TYPE=\"radio\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTlatticeFORMboxSWITCH(1);\" "+( _latticetype == 1 ? "CHECKED" : "" )+" NAME=\"CIRCLEStoolsRAWPOINTSLISTlatticeRADIO\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeRADIO01\"></td>" ;
             HTMLcode += "<td WIDTH=\"20\"></td>" ;
             HTMLcode += "<td>Circular</td>" ;
             HTMLcode += "<td WIDTH=\"2\"></td>" ;
             HTMLcode += "<td><INPUT TYPE=\"radio\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTlatticeFORMboxSWITCH(2);\" "+( _latticetype == 2 ? "CHECKED" : "" )+" NAME=\"CIRCLEStoolsRAWPOINTSLISTlatticeRADIO\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeRADIO02\"></td>" ;
             HTMLcode += "</tr>" ;
             HTMLcode += "</table>" ;
             HTMLcode += "</td>" ;
             HTMLcode += "</tr>" ;

             HTMLcode += "<tr>" ;
             HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding-left:10px;\">" ;
             HTMLcode += "<DIV STYLE=\"position:relative;display:none;width:100%;height:auto;\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeORTHObox\">" ;
             HTMLcode += "<table WIDTH=\"100%\">" ;
             HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
             HTMLcode += "<tr><td><b STYLE=\"color:#565656;\">Parameters for orthogonal lattices</b></td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
             HTMLcode += "<tr><td VALIGN=\"top\">" ;
             HTMLcode += "<table>" ;
             HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
             HTMLcode += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"90\">Center</td><td WIDTH=\"3\"></td><td><INPUT STYLE=\"width:80px;\" TYPE=\"edit\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeORTHOcenter\"></td><td WIDTH=\"5\"></td><td>(cartesian or complex coords)</td></tr>" ;
             HTMLcode += "</table></td></tr>" ;

             HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
             HTMLcode += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"90\">Points per width</td><td WIDTH=\"3\"></td><td><INPUT STYLE=\"width:50px;\" TYPE=\"edit\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeORTHOnx\"></td></tr>" ;
             HTMLcode += "</table></td></tr>" ;

             HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
             HTMLcode += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"90\">Points per height</td><td WIDTH=\"3\"></td><td><INPUT STYLE=\"width:50px;\" TYPE=\"edit\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeORTHOny\"></td></tr>" ;
             HTMLcode += "</table></td></tr>" ;

             HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
             HTMLcode += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"90\">Shift per width</td><td WIDTH=\"3\"></td><td><INPUT STYLE=\"width:50px;\" TYPE=\"edit\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeORTHOshiftx\"></td></tr>" ;
             HTMLcode += "</table></td></tr>" ;

             HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
             HTMLcode += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"90\">Shift per height</td><td WIDTH=\"3\"></td><td><INPUT STYLE=\"width:50px;\" TYPE=\"edit\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeORTHOshifty\"></td></tr>" ;
             HTMLcode += "</table></td></tr>" ;

             HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
             HTMLcode += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"90\">X-displacement</td><td WIDTH=\"3\"></td><td><INPUT STYLE=\"width:50px;\" TYPE=\"edit\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeORTHOxdisplacement\"></td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"checkbox\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeORTHOxdisplacementALTERNATEcheckbox\"></td><td WIDTH=\"5\"></td><td>Alternate cols</td></tr>" ;
             HTMLcode += "</table></td></tr>" ;

             HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
             HTMLcode += "<tr><td WIDTH=\"3\"></td><td WIDTH=\"90\">Y-displacement</td><td WIDTH=\"3\"></td><td><INPUT STYLE=\"width:50px;\" TYPE=\"edit\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeORTHOydisplacement\"></td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"checkbox\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeORTHOydisplacementALTERNATEcheckbox\"></td><td WIDTH=\"5\"></td><td>Alternate rows</td></tr>" ;
             HTMLcode += "</table></td></tr>" ;

             HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
             HTMLcode += "</table>" ;
             HTMLcode += "</td></tr>" ;

             HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
             HTMLcode += "<tr><td ALIGN=\"right\">" ;
             HTMLcode += "<table>" ;
             HTMLcode += "<tr>" ;
             HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:50px;\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTlatticeAPPLY(1);\">Get points</td>" ;
             HTMLcode += "<td WIDTH=\"1\"></td>" ;
             HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:50px;\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTlatticeCLEAN(1);\">Clean</td>" ;
             HTMLcode += "<td WIDTH=\"1\"></td>" ;
             HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:50px;\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTlatticeFORM("+HIDE+");\";\">Exit</td>" ;
             HTMLcode += "<td WIDTH=\"5\"></td>" ;
             HTMLcode += "</tr>" ;
             HTMLcode += "</table>" ;
             HTMLcode += "</td></tr>" ;

             HTMLcode += "</table>" ;
             HTMLcode += "</DIV>" ;
             HTMLcode += "</td>" ;
             HTMLcode += "</tr>" ;

             HTMLcode += "<tr>" ;
             HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding-left:10px;\">" ;
             HTMLcode += "<DIV STYLE=\"position:relative;display:none;width:100%;height:auto;\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeCIRCbox\">" ;
             HTMLcode += "<table WIDTH=\"100%\">" ;
             HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
             HTMLcode += "<tr><td><b STYLE=\"color:#565656;\">Parameters for circular lattices</b></td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
             HTMLcode += "<tr><td VALIGN=\"top\">" ;
             HTMLcode += "<table>" ;
             HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Center</td><td WIDTH=\"3\"></td><td><INPUT STYLE=\"width:80px;\" TYPE=\"edit\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeCIRCcenter\"></td><td WIDTH=\"5\"></td><td>(cartesian or complex coords)</td></tr>" ;
             HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Sectors</td><td WIDTH=\"3\"></td><td><INPUT STYLE=\"width:50px;\" TYPE=\"edit\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeCIRCsectors\"></td></tr>" ;
             HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Concentric circles</td><td WIDTH=\"3\"></td><td><INPUT STYLE=\"width:50px;\" TYPE=\"edit\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeCIRCcircles\"></td></tr>" ;
             HTMLcode += "<tr><td WIDTH=\"3\"></td><td>Shift</td><td WIDTH=\"3\"></td><td><INPUT STYLE=\"width:50px;\" TYPE=\"edit\" ID=\"CIRCLEStoolsRAWPOINTSLISTlatticeCIRCshift\"></td></tr>" ;
             HTMLcode += "</table>" ;
             HTMLcode += "</td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;

             HTMLcode += "<tr><td ALIGN=\"right\">" ;
             HTMLcode += "<table>" ;
             HTMLcode += "<tr>" ;
             HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:50px;\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTlatticeAPPLY(2);\">Get points</td>" ;
             HTMLcode += "<td WIDTH=\"1\"></td>" ;
             HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:50px;\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTlatticeCLEAN(2);\">Clean</td>" ;
             HTMLcode += "<td WIDTH=\"1\"></td>" ;
             HTMLcode += "<td CLASS=\"link_rounded\" STYLE=\"width:50px;\" ONCLICK=\"javascript:CIRCLEStoolsRAWPOINTSLISTlatticeFORM("+HIDE+");\";\">Exit</td>" ;
             HTMLcode += "<td WIDTH=\"5\"></td>" ;
             HTMLcode += "</tr>" ;
             HTMLcode += "</table>" ;
             HTMLcode += "</td></tr>" ;

             HTMLcode += "</table>" ;
             HTMLcode += "</DIV>" ;
             HTMLcode += "</td>" ;
             HTMLcode += "</tr>" ;

             HTMLcode += "</table>" ;
         SPLASHanimated( HTMLcode, YES, 370, 260, 10, 100 ) ;
         CIRCLEStoolsRAWPOINTSLISTlatticeFORMboxSWITCH( safe_int( CIRCLEStoolsRAWPOINTSLISToptions['lattice'], 1 ) ) ;
    }
    else if ( _action == HIDE )
    {
         SPLASHanimated( "", NO ) ;
         $( "#" + CIRCLEStoolsRAWPOINTSLISTdiv_id ).fadeIn( "slow", function(){} );

    		 var _text = [] ;
    		 $.each( CIRCLEStoolsRAWPOINTSLISTpoints, function( _i, _pt ) { _text.push( _pt.output( "cartesian" ).replaceAll( [ "(", ")" ], "" ) ) ; } ) ;
			   $( "#CIRCLEStoolsRAWPOINTSLISTtextarea" ).val( _text.join( _glob_crlf ) ) ;
    }
}

function CIRCLEStoolsRAWPOINTSLISTlatticeFORMboxSWITCH( _action )
{
    _action = safe_int( _action, 1 );
    CIRCLEStoolsRAWPOINTSLISToptions['lattice'] = _action ;
    switch( _action )
    {
        case 1:
        $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHObox" ).slideDown( "slow", function() { CIRCLEStoolsRAWPOINTSLISTlatticeFORMboxFILL( _action ) } );
        $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCbox" ).slideUp( "slow", function() {} );
        break ;
        case 2:
        $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCbox" ).slideDown( "slow", function() { CIRCLEStoolsRAWPOINTSLISTlatticeFORMboxFILL( _action ) } );
        $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHObox" ).slideUp( "slow", function() {} );
        break ;
        default: break ;
    }
}

function CIRCLEStoolsRAWPOINTSLISTlatticeFORMboxFILL( _action )
{
    _action = safe_int( _action, 1 );
    switch( _action )
    {
         case 1:
         var _params = CIRCLEStoolsRAWPOINTSLISToptions['ortholattice'] ;
         if ( is_array( _params ) )
         {
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOcenter" ).val( is_point( _params[0] ) ? _params[0].output("cartesian").replaceAll( [ "(", ")" ], "" ) : "" ) ;
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOnx" ).val( _params[1] ) ;
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOny" ).val( _params[2] ) ;
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOshiftx" ).val( _params[3] ) ;
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOshifty" ).val( _params[4] ) ;
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOxdisplacement" ).val( _params[5] ) ;
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOydisplacement" ).val( _params[6] ) ;
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOxdisplacementALTERNATEcheckbox" ).prop( "checked", _params[7] ? true : false ) ;
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOydisplacementALTERNATEcheckbox" ).prop( "checked", _params[8] ? true : false ) ;
         }
         break ;
         case 2:
         var _params = CIRCLEStoolsRAWPOINTSLISToptions['circlattice'] ;
         if ( is_array( _params ) )
         {
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCcenter" ).val( is_point( _params[0] ) ? _params[0].output("cartesian").replaceAll( [ "(", ")" ], "" ) : "" ) ;
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCsectors" ).val( _params[1] ) ;
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCcircles" ).val( _params[2] ) ;
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCshift" ).val( _params[3] ) ;
         }
         break ;
         default: break ;
    }
}

function CIRCLEStoolsRAWPOINTSLISTlatticeAPPLY( _lattice_type )
{
    _lattice_type = safe_int( _lattice_type, 0 );
    if ( _lattice_type == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Fail to apply lattice params: invalid input option" );
    else
    {
         if ( _lattice_type == 1 ) // rect
         {
         			var _center = read_2D_point( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOcenter" ).val() );
         			if ( !is_point( _center ) )
              {
                   _center = parse_complex_from_string( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOcenter" ).val() );
                   _center = new point( _center.real, _center.imag );
              }

              var _n_x = Math.max( 0, safe_int( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOnx" ).val(), 0 ) );
              var _n_y = Math.max( 0, safe_int( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOny" ).val(), 0 ) );
              var _shift_x = Math.max( 0, safe_float( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOshiftx" ).val(), 0 ) );
              var _shift_y = Math.max( safe_float( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOshifty" ).val(), 0 ) );
              var _x_displacement = safe_float( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOxdisplacement" ).val(), 0 );
              var _y_displacement = safe_float( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOydisplacement" ).val(), 0 );
              var _x_alternate = safe_int( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOxdisplacementALTERNATEcheckbox" ).prop( "checked" ) ? 1 : 0, 0 );
              var _y_alternate = safe_int( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOydisplacementALTERNATEcheckbox" ).prop( "checked" ) ? 1 : 0, 0 );
              
              CIRCLEStoolsRAWPOINTSLISToptions['ortholattice'] = [ _center,
																																	_n_x, _n_y,
																																	_shift_x, _shift_y,
																																	_x_displacement, _y_displacement,
																																	_x_alternate, _y_alternate ] ;
              
              $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOnx" ).css( "background-color", _n_x == 0 ? "#FFEA77" : "white" ) ;
              $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOny" ).css( "background-color", _n_y == 0 ? "#FFEA77" : "white" ) ;
              $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOshiftx" ).css( "background-color", _shift_x == 0 ? "#FFEA77" : "white" ) ;
              $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOshifty" ).css( "background-color", _shift_y == 0 ? "#FFEA77" : "white" ) ;
              
              var _b_ok = ( _n_x == 0 || _n_y == 0 || _shift_x == 0 || _shift_y == 0 || !is_point( _center ) ) ? NO : YES ;
              var _lattice = _b_ok ? _center.ortho_lattice( _n_x, _n_y, _shift_x, _shift_y, _x_displacement, _y_displacement, _x_alternate, _y_alternate ) : null ;
              if ( is_array( _lattice ) )
              {
									 CIRCLEStoolsRAWPOINTSLISTpoints = _lattice.clone() ;
									 CIRCLEStoolsRAWPOINTSLISTlatticeFORM( HIDE ) ; 
							}
							else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Fail to compute the required lattice: some input data are invalid", _glob_app_title );
         }
         else if ( _lattice_type == 2 ) // circ
         {
         			var _center = read_2D_point( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCcenter" ).val() );
         			if ( !is_point( _center ) )
              {
                   _center = parse_complex_from_string( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCcenter" ).val() );
                   _center = new point( _center.real, _center.imag );
              }
              var _n_sectors = Math.max( 0, safe_int( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCsectors" ).val(), 0 ) );
              var _n_circles = Math.max( 0, safe_int( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCcircles" ).val(), 0 ) );
              var _shift = Math.max( 0, safe_float( $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCshift" ).val(), 0 ) ) ;

              CIRCLEStoolsRAWPOINTSLISToptions['circlattice'] = [ _center, _n_sectors, _n_circles, _shift ] ;

              $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCsectors" ).css( "background-color", _n_sectors == 0 ? "#FFEA77" : "white" ) ;
              $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCcircles" ).css( "background-color", _n_circles == 0 ? "#FFEA77" : "white" ) ;
              $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCshift" ).css( "background-color", _shift == 0 ? "#FFEA77" : "white" ) ;

              var _b_ok = ( _n_sectors == 0 || _n_circles == 0 || _shift == 0 || !is_point( _center ) ) ? NO : YES ;
              var _lattice = _b_ok ? _center.circ_lattice( _n_sectors, _n_circles, _shift, 0, CIRCLES_TWO_PI ) : null ;
              if ( is_array( _lattice ) )
              {
									 CIRCLEStoolsRAWPOINTSLISTpoints = _lattice.clone() ;
									 CIRCLEStoolsRAWPOINTSLISTlatticeFORM( HIDE ) ; 
							}
							else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Fail to compute the required lattice: some input data are invalid", _glob_app_title );
         }
    }
}

function CIRCLEStoolsRAWPOINTSLISTlatticeCLEAN( _lattice_type )
{
    _lattice_type = safe_int( _lattice_type, 0 );
    if ( _lattice_type == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Fail to clean lattice params: invalid input option" );
    else 
    {
         var _type = _lattice_type == 1 ? "rectangular" : "circular" ;
         if ( confirm( "Confirm to clean "+_type+" lattice params ?" ) )
         {
             if ( _lattice_type == 1 )
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeORTHOnx, #CIRCLEStoolsRAWPOINTSLISTlatticeORTHOny, #CIRCLEStoolsRAWPOINTSLISTlatticeORTHOshiftx, #CIRCLEStoolsRAWPOINTSLISTlatticeORTHOshifty" ).val( "" );
             else if ( _lattice_type == 2 )
             $( "#CIRCLEStoolsRAWPOINTSLISTlatticeCIRCsectors, #CIRCLEStoolsRAWPOINTSLISTlatticeCIRCcircles, #CIRCLEStoolsRAWPOINTSLISTlatticeCIRCshift" ).val( "" );
         }
    }
}