function CIRCLESformsCOORDINATESclose() { return circles_lib_plugin_dispatcher_unicast_message( 'coordinates', "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsCOORDINATESform( _plane_type, _return_html, coords_array )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
		var LEFT = is_array( coords_array ) ? coords_array[0] : ( _plane_type == Z_PLANE ? _glob_zplaneLEFT : _glob_wplaneLEFT ) ;
		var TOP = is_array( coords_array ) ? coords_array[1] : ( _plane_type == Z_PLANE ? _glob_zplaneTOP : _glob_wplaneTOP ) ;
		var RIGHT = is_array( coords_array ) ? coords_array[2] : ( _plane_type == Z_PLANE ? _glob_zplaneRIGHT : _glob_wplaneRIGHT ) ;
		var BOTTOM = is_array( coords_array ) ? coords_array[3] : ( _plane_type == Z_PLANE ? _glob_zplaneBOTTOM : _glob_wplaneBOTTOM ) ;
		var WIDTH = is_array( coords_array ) ? coords_array[4] : RIGHT - LEFT ;
		var HEIGHT = is_array( coords_array ) ? coords_array[5] : TOP - BOTTOM ;

		_return_html = safe_int( _return_html, NO );
    switch( _plane_type )
    {
       case Z_PLANE: _corners_array = zplane_sm.get_coords_corners(); break ;
       case W_PLANE: _corners_array = wplane_sm.get_coords_corners(); break ;
       case BIP_BOX: _corners_array = bipbox_sm.get_coords_corners(); break ;
       case D_LOCUS: _corners_array = dlocus_sm.get_coords_corners(); break ;
       default: break ;
    }

		var HTMLcode = "" ;
		if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
		{
		    HTMLcode += "<table>" ;
		    HTMLcode += "<tr><td WIDTH=\"5\"><td>Left</td><td WIDTH=\"5\"></td><td><INPUT ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" TYPE=\"edit\" ID=\"PLANEleft\" STYLE=\"width:"+( WIDTH - 50 )+"px;\" VALUE=\""+LEFT+"\"></td></tr>" ;
		    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
		    HTMLcode += "<tr><td WIDTH=\"5\"><td>Top</td><td WIDTH=\"5\"></td><td><INPUT ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" TYPE=\"edit\" ID=\"PLANEtop\" STYLE=\"width:"+( WIDTH - 50 )+"px;\" VALUE=\""+TOP+"\"></td></tr>" ;
		    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
		    HTMLcode += "<tr><td WIDTH=\"5\"><td>Right</td><td WIDTH=\"5\"></td><td><INPUT ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" TYPE=\"edit\" ID=\"PLANEright\" STYLE=\"width:"+( WIDTH - 50 )+"px;\" VALUE=\""+RIGHT+"\"></td></tr>" ;
		    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
		    HTMLcode += "<tr><td WIDTH=\"5\"><td>Bottom</td><td WIDTH=\"5\"></td><td><INPUT ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" TYPE=\"edit\" ID=\"PLANEbottom\" STYLE=\"width:"+( WIDTH - 50 )+"px;\" VALUE=\""+BOTTOM+"\"></td></tr>" ;
		    HTMLcode += "</table>" ;
		}
		else if ( _glob_interface_index.is_one_of( INTERFACE_EXTEND_ZPLANE, INTERFACE_EXTEND_WPLANE ) )
		{
				var _mapper = null ;
				if ( _glob_interface_index == INTERFACE_EXTEND_ZPLANE ) _mapper = zplane_sm ;
				else if ( _glob_interface_index == INTERFACE_EXTEND_WPLANE ) _mapper = wplane_sm ;
				
				var _coords_rect = _mapper.get_coords_rect();
				var _w = _coords_rect.width(), _h = _coords_rect.height(), _center = _coords_rect.center_pt().output( "cartesian" ) ;
		
		    HTMLcode += "<table>" ;
		    HTMLcode += "<tr><td WIDTH=\"5\"><td>Width</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsCOORDINATESeventsHANDLER( this.id, event );\" ID=\"CIRCLESformsCOORDINATESplaneWIDTH\" STYLE=\"width:"+(WIDTH-50)+"px;\" VALUE=\""+_w+"\"></td></tr>" ;
		    HTMLcode += "<tr><td WIDTH=\"5\"><td>Height</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsCOORDINATESeventsHANDLER( this.id, event );\" ID=\"CIRCLESformsCOORDINATESplaneHEIGHT\" STYLE=\"width:"+(WIDTH-50)+"px;\" VALUE=\""+_h+"\"></td></tr>" ;
		    HTMLcode += "<tr><td WIDTH=\"5\"><td>Center</td><td WIDTH=\"5\"></td><td><INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsCOORDINATESeventsHANDLER( this.id, event );\" ID=\"CIRCLESformsCOORDINATESplaneCENTER\" STYLE=\"width:"+(WIDTH-50)+"px;\" VALUE=\""+_center+"\"></td></tr>" ;
		    HTMLcode += "</table>" ;
		}
		
		if ( _return_html ) return HTMLcode ;
		else $( "#CIRCLESformsCOORDINATESformCONTAINER" ).html( HTMLcode );
}

function CIRCLESformsCOORDINATESmain( _base_id, _move, _plane_type )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    CIRCLESformsCOORDINATESbaseid = safe_string( _base_id, "" ) ;
    CIRCLESformsCOORDINATESplane_type = _plane_type ;
    _move = safe_int( _move, YES );
    var WIDTH = 280, HEIGHT = _glob_interface_index == INTERFACE_EXTEND_NONE ? 216 : 140 ;
		var _label = "", _corners_array = null, _subset = "forms" ;

    switch( _plane_type )
    {
      case Z_PLANE: _label = "Z-plane", _corners_array = zplane_sm.get_coords_corners(), HEIGHT += 32 ; break ;
      case W_PLANE: _label = "W-plane", _corners_array = wplane_sm.get_coords_corners(); break ;
      case BIP_BOX: _label = "Bip box", _corners_array = bipbox_sm.get_coords_corners(); break ;
      case D_LOCUS: _label = "Discreteness locus", _corners_array = dlocus_sm.get_coords_corners(); break ;
      default: _label = "Z-plane", _corners_array = zplane_sm.get_coords_corners(), HEIGHT += 32 ; break ;
    }

    if ( !is_point( _corners_array['lu'] ) || !is_point( _corners_array['rd'] ) )
    _corners_array = { 'lu' : new point( 0, 0 ), 'rd' : new point( 0, 0 ) } ;

    var CLOSE_FN = "CIRCLESformsCOORDINATESclose();" ;
    var ONACTIVATEFN = "CIRCLESformsCOORDINATESfillINTOedits( "+_plane_type+" );" ;
    var _div_id = CIRCLESformsCOORDINATESdiv_id = circles_lib_plugin_build_divid( _subset, _base_id ) ;
    var HTMLcode = "<INPUT TYPE=\"HIDDEN\" ID=\"CIRCLESpairingINDEX01\" VALUE=\""+UNDET+"\"><INPUT TYPE=\"HIDDEN\" ID=\"CIRCLESpairingINDEX02\" VALUE=\""+UNDET+"\">" ;
        HTMLcode += "<table WIDTH=\"100%\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsCOORDINATEScaption, 5, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "lens/lens.icon.01.16x16.png", ONACTIVATEFN );

    var _left_up = _corners_array['lu'], _right_down = _corners_array['rd'] ;
    var LEFT = _left_up.x, TOP = _left_up.y, RIGHT = _right_down.x, BOTTOM = _right_down.y ;

    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
    HTMLcode += "<tr><td STYLE=\"padding-left:3px;color:#454545;\">"+_label+"</td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;


    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESformsCOORDINATESformCONTAINER\">" ;
    HTMLcode += CIRCLESformsCOORDINATESform( _plane_type, YES, [ LEFT, TOP, RIGHT, BOTTOM, WIDTH, HEIGHT ] ) ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_coordinates_shift('top',"+_plane_type+",null);\"><IMG TITLE=\"Shift to the top\" SRC=\"%imgpath%icons/bullets/bullet.up.16x16.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_coordinates_shift('bottom',"+_plane_type+",null);\"><IMG TITLE=\"Shift to the bottom\" SRC=\"%imgpath%icons/bullets/bullet.down.16x16.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_coordinates_shift('left',"+_plane_type+",null);\"><IMG TITLE=\"Shift to the left\" SRC=\"%imgpath%icons/bullets/bullet.left.16x16.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_coordinates_shift('right',"+_plane_type+",null);\"><IMG TITLE=\"Shift to the right\" SRC=\"%imgpath%icons/bullets/bullet.right.16x16.png\"></td>" ;

    if ( _plane_type.is_one_of( Z_PLANE, W_PLANE, BIP_BOX ) )
    {
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" ONCLICK=\"javascript:circles_lib_coordinates_zoom_in_plane();\"><IMG TITLE=\"Zoom in\" SRC=\"%imgpath%icons/zoom.in/zoom.in.icon.01.16x16.png\"></td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" ONCLICK=\"javascript:circles_lib_coordinates_zoom_out_plane();\"><IMG TITLE=\"Zoom out\" SRC=\"%imgpath%icons/zoom.out/zoom.out.icon.01.16x16.png\"></td>" ;

		    if ( _plane_type.is_one_of( Z_PLANE, W_PLANE ) )
		    {
		        HTMLcode += "<td WIDTH=\"5\"></td>" ;
		        HTMLcode += "<td ONCLICK=\"javascript:circles_lib_coords_pickupyours_open_proc( "+_plane_type+" );\"><IMG CLASS=\"link\" TITLE=\"Pick up your coordinates\" SRC=\"support/img/icons/lens/lens.icon.01.16x16.png\"></td>" ;
		    }
    }

    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CIRCLESformsCOORDINATESsetcoordsBTN\" ONCLICK=\"javascript:CIRCLESformsCOORDINATESinputMANAGER( "+_plane_type+", "+_render+", '"+REFRESH_FN+"', ZOOM_GET_COORDS, null, null, "+_question+", "+_silent+" );\">Set coords</td>" ;
    if ( _plane_type == W_PLANE )
    {
        HTMLcode += "<td WIDTH=\"1\"></td>" ;
    	  HTMLcode += "<td CLASS=\"link_rounded\" ID=\"CIRCLESformCOORDSrenderBTN\" ONCLICK=\"javascript:circles_lib_canvas_process_ask(YES,NO,_glob_bip_use?BIP_BOX:_glob_target_plane,YES,YES,CHECK);\">Render</td>" ;
		}

    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

		if ( _glob_interface_index == INTERFACE_EXTEND_NONE )
		{
		    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
		    HTMLcode += "<tr>" ;
		    HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
		    HTMLcode += "<table>" ;
		    HTMLcode += "<tr>" ;
		
		    var REFRESH_FN = "" ;
		    switch( _plane_type )
		    {
		        case Z_PLANE: REFRESH_FN = "circles_lib_canvas_process_ask(YES,NO,"+Z_PLANE+",YES,YES,CHECK);" ; break ;
		        case W_PLANE: REFRESH_FN = "circles_lib_canvas_process_ask(YES,NO,"+W_PLANE+",YES,YES,CHECK);" ; break ;
            default: break ;
		    }
		
		    var _render = _plane_type == Z_PLANE ? YES : NO, _question = _plane_type == Z_PLANE ? NO : YES, _silent = YES ;
		    if ( _plane_type.is_one_of( Z_PLANE, W_PLANE, BIP_BOX, D_LOCUS ) )
		    {
		        HTMLcode += "<td WIDTH=\"5\"></td>" ;
		        HTMLcode += "<td>Presets</td>" ;
		        HTMLcode += "<td WIDTH=\"5\"></td>" ;
		        HTMLcode += "<td>" ;
		        HTMLcode += "<SELECT ONCHANGE=\"javascript:CIRCLESformsCOORDINATESpresetsCOMBO( this.value, "+_plane_type+", "+_render+", '"+REFRESH_FN+"', "+_question+", "+_silent+" );\">" ;
		        HTMLcode += "<OPTION VALUE=\"0\">" ;
		        if ( _plane_type.is_one_of( Z_PLANE, W_PLANE, BIP_BOX ) )
		        {
		           HTMLcode += "<OPTION VALUE=\"1\">Default coords" ;
		           HTMLcode += "<OPTION VALUE=\"2\">Unit square" ;
		        }
		        else if ( _plane_type.is_one_of( D_LOCUS ) )
		        {
		           HTMLcode += "<OPTION VALUE=\"3\">Maskit slice" ;
		           HTMLcode += "<OPTION VALUE=\"4\">Earle slice" ;
		        }
		        HTMLcode += "</SELECT>" ;
		        HTMLcode += "</td>" ;
		        if ( _plane_type == Z_PLANE )
		        {
		            HTMLcode += "<td WIDTH=\"5\"></td>" ;
		            HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_coordinates_zoomtofit( "+_plane_type+", "+_render+", "+_question+", "+_silent+" );CIRCLESformsCOORDINATESmain( '"+CIRCLESformsCOORDINATESbaseid+"', "+_move+", "+_plane_type+" );\">Zoom to fit</td>" ;
		        }
		    }
		
		    HTMLcode += "</tr>" ;
		    HTMLcode += "</table>" ;
		    HTMLcode += "</td>" ;
		    HTMLcode += "</tr>" ;
		}

    HTMLcode += "</table>" ;
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsCOORDINATEScaption, CLOSE_FN );
    if ( _move && _div != null ) move_div( _div.id, _plane_type == Z_PLANE ? "RIGHT" : "LEFT", "TOP" );
}

function CIRCLESformsCOORDINATESpresetsCOMBO( _selection, _plane_type, _render, _refresh_fn, _question, _silent )
{
    _selection = safe_int( _selection, 0 );
    switch( _selection )
    {
        case 1: // default
        $("#PLANEleft").val( -DEFAULT_PLANE_COORD );
        $("#PLANEright").val( DEFAULT_PLANE_COORD );
        $("#PLANEtop").val( DEFAULT_PLANE_COORD );
        $("#PLANEbottom").val( -DEFAULT_PLANE_COORD );
        break ;
        case 2: // unit square
        $("#PLANEleft").val( -1 );
        $("#PLANEright").val( 1 );
        $("#PLANEtop").val( 1 );
        $("#PLANEbottom").val( -1 );
        break ;
        case 3: // Maskit slice
        $("#PLANEleft").val( 0 );
        $("#PLANEright").val( 2 );
        $("#PLANEtop").val( 2 );
        $("#PLANEbottom").val( 0 );
        break ;
        case 3: // Maskit slice
        $("#PLANEleft").val( 0 );
        $("#PLANEright").val( 1 );
        $("#PLANEtop").val( 1 );
        $("#PLANEbottom").val( 0 );
        break ;
        default:
        break ;
    }
}

function CIRCLESformsCOORDINATESfillINTOedits( _plane_type )
{
    _plane_type = safe_int( _plane_type, NO_PLANE );
    if ( _plane_type == Z_PLANE )
    {
        $("#PLANEleft").val( _glob_zplaneLEFT );
        $("#PLANEright").val( _glob_zplaneRIGHT );
        $("#PLANEtop").val( _glob_zplaneTOP );
        $("#PLANEbottom").val( _glob_zplaneBOTTOM );
    }
    else if ( _plane_type == W_PLANE )
    {
        $("#PLANEleft").val( _glob_wplaneLEFT );
        $("#PLANEright").val( _glob_wplaneRIGHT );
        $("#PLANEtop").val( _glob_wplaneTOP );
        $("#PLANEbottom").val( _glob_wplaneBOTTOM );
    }
    else if ( _plane_type == BIP_BOX )
    {
        $("#PLANEleft").val( _glob_bipLEFT );
        $("#PLANEright").val( _glob_bipRIGHT );
        $("#PLANEtop").val( _glob_bipTOP );
        $("#PLANEbottom").val( _glob_bipBOTTOM );
    }
    else if ( _plane_type == D_LOCUS )
    {
        $("#PLANEleft").val( _glob_dlocusLEFT );
        $("#PLANEright").val( _glob_dlocusRIGHT );
        $("#PLANEtop").val( _glob_dlocusTOP );
        $("#PLANEbottom").val( _glob_dlocusBOTTOM );
    }
}