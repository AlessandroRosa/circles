function CIRCLEStoolsFUNDAMENTALREGIONparamsCONTAINERcreate( POPUP_WIDTH )
{
		POPUP_WIDTH = safe_int( POPUP_WIDTH, 400 );
    var CONTAINER_WIDTH = POPUP_WIDTH - 16 ;
		var BOX_WIDTH = Math.floor( ( CONTAINER_WIDTH - 6 ) / 3 );
		var HTMLcode = "<table ID=\"CIRLEStoolsFUNDAMENTALREGIONcontainerTABLE\" WIDTH=\""+CONTAINER_WIDTH+"\" HEIGHT=\"100%\">" ;
				HTMLcode += "<tr>" ;
				HTMLcode += "<td ID=\"CIRLEStoolsFUNDAMENTALREGIONcontainerBOX1\" WIDTH=\""+BOX_WIDTH+"\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#FAFAFA;padding:3px;\"></td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
				HTMLcode += "<td ID=\"CIRLEStoolsFUNDAMENTALREGIONcontainerBOX2\" WIDTH=\""+BOX_WIDTH+"\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#FAFAFA;padding:3px;\"><CANVAS ID=\"CIRCLEStoolsFUNDAMENTALREGIONthumbCANVAS\" WIDTH=\""+BOX_WIDTH+"\" HEIGHT=\""+BOX_WIDTH+"\" STYLE=\"width:"+BOX_WIDTH+"px;height:"+BOX_HEIGHT+"px;\"></td>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
				HTMLcode += "<td ID=\"CIRLEStoolsFUNDAMENTALREGIONcontainerBOX3\" WIDTH=\""+BOX_WIDTH+"\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#FAFAFA;padding:3px;\"></td>" ;
				HTMLcode += "</tr>" ;
				HTMLcode += "</table>" ;
		return HTMLcode ;
}

function CIRCLEStoolsFUNDAMENTALREGIONparamsCONTAINERresize( POPUP_WIDTH )
{
		POPUP_WIDTH = safe_int( POPUP_WIDTH, 400 );
    var CONTAINER_WIDTH = POPUP_WIDTH - 16 ;
		var BOX_WIDTH = Math.floor( ( CONTAINER_WIDTH - 6 ) / 3 );
    $( "#CIRLEStoolsFUNDAMENTALREGIONcontainerTABLE" ).width( CONTAINER_WIDTH );
		$( "[id^=CIRLEStoolsFUNDAMENTALREGIONcontainerBOX]" ).width( BOX_WIDTH );
}

function CIRCLEStoolsFUNDAMENTALREGIONcurrentALPHABETupdate()
{
		var _alphabet = circles_lib_alphabet_get();
		$( "#CIRCLEStoolsFUNDAMENTALREGIONcurrentALPHABET" ).html( safe_size( _alphabet, 0 ) > 0 ? "Current alphabet is <b>" + _alphabet.join( ", " ) + "</b>" : "<SPAN STYLE=\"color:#D0D0D0;\">Current alphabet is empty</SPAN>" );
}

function CIRCLEStoolsFUNDAMENTALREGIONdiagramBOX( POPUP_WIDTH, POPUP_HEIGHT )
{
    POPUP_WIDTH -= 4 ;
    var _coords_width = POPUP_WIDTH / 3 - 25 ;
    var _canvas_w = POPUP_WIDTH - 60, _canvas_h = POPUP_HEIGHT - 190 ;
    var HTMLcode = "<table ID=\"CIRCLEStoolsFUNDAMENTALREGIONleftPANEL\" WIDTH=\""+POPUP_WIDTH+"\">" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\">";
        HTMLcode += "<table>";
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td>Complex pt<td><td WIDTH=\"4\"></td><td HEIGHT=\"22\"><INPUT TYPE=\"edit\" STYLE=\"width:"+(POPUP_WIDTH-95)+"px;\" ID=\"CIRCLEStoolsFUNDAMENTALREGIONpickedCOMPLEXPT\"></td>";
        HTMLcode += "<td WIDTH=\"3\"></td>" ;
        HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:CIRCLEStoolsFUNDAMENTALREGIONplotCOMPLEXPT(1);\"><IMG TITLE=\"Plot point\" ID=\"CIRCLEStoolsFUNDAMENTALREGIONplotCOMPLEXPTicon\" SRC=\"%imgpath%icons/brush/brush.icon.01.16x16.png\"></td>" ;
        HTMLcode += "</tr>";
        HTMLcode += "</table>";
        HTMLcode += "</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\"><CANVAS ID=\"CIRCLESfundamentalregiondiagramCANVAS\" STYLE=\"width:"+_canvas_w+"px;height:"+_canvas_h+"px;background-color:white;\"></td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\">";
        HTMLcode += "<table ALIGN=\"center\">";
        HTMLcode += "<tr>" ;
        HTMLcode += "<td>X<td><td WIDTH=\"4\"></td><td CLASS=\"general_rounded_corners\" HEIGHT=\"16\" WIDTH=\""+_coords_width+"\" STYLE=\"background-color:#EAEAFB;font-size:7pt;padding:4px;\" ID=\"CIRCLEStoolsFUNDAMENTALREGIONcoordsX\"></td>";
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "<td>Y<td><td WIDTH=\"4\"></td><td CLASS=\"general_rounded_corners\" HEIGHT=\"16\" WIDTH=\""+_coords_width+"\" STYLE=\"background-color:#EAEAFB;font-size:7pt;padding:4px;\" ID=\"CIRCLEStoolsFUNDAMENTALREGIONcoordsY\"></td>";
        HTMLcode += "<td WIDTH=\"15\"></td>" ;
        HTMLcode += "</tr>";
        HTMLcode += "</table>";
        HTMLcode += "</td></tr>" ;
        HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLEStoolsFUNDAMENTALREGIONparamsBARcreate()
{
		 var HTMLcode = "<table>" ;
		 		 HTMLcode += "<tr>" ;
		 		 HTMLcode += "<td WIDTH=\"5\"></td>" ;
		 		 HTMLcode += "<td>Items</td>" ;
		 		 HTMLcode += "<td WIDTH=\"3\"></td>" ;
		 		 HTMLcode += "<td>" ;
		 		 HTMLcode += "<SELECT ID=\"CIRCLEStoolsFUNDAMENTALREGIONitemsCOMBO\" ONCHANGE=\"javascript:CIRCLEStoolsFUNDAMENTALREGIONitemsCOMBOonchange();\">" ;
		 		 HTMLcode += "<OPTION VALUE=\"\">" ;
		 		 HTMLcode += "<OPTION VALUE=\"1\">Seeds" ;
		 		 HTMLcode += "<OPTION VALUE=\"2\">Generators" ;
		 		 HTMLcode += "<OPTION VALUE=\"3\">Custom" ;
		 		 HTMLcode += "</SELECT>" ;
		 		 HTMLcode += "</td>" ;
		 		 HTMLcode += "<td WIDTH=\"15\"></td>" ;
		 		 HTMLcode += "<td>Procedure</td>" ;
		 		 HTMLcode += "<td WIDTH=\"3\"></td>" ;
		 		 HTMLcode += "<td>" ;
		 		 HTMLcode += "<SELECT ID=\"CIRCLEStoolsFUNDAMENTALREGIONprocedureCOMBO\" ONCHANGE=\"javascript:CIRCLEStoolsFUNDAMENTALREGIONprocedureCOMBOonchange();\">" ;
		 		 HTMLcode += "<OPTION VALUE=\"\">" ;
		 		 HTMLcode += "<OPTION VALUE=\"1\">Standard fundamental region" ;
		 		 HTMLcode += "<OPTION VALUE=\"2\">Ford fundamental region" ;
		 		 HTMLcode += "</SELECT>" ;
		 		 HTMLcode += "</td>" ;
		 		 HTMLcode += "<td WIDTH=\"15\"></td>" ;
		 		 HTMLcode += "<td>Send to</td>" ;
		 		 HTMLcode += "<td WIDTH=\"3\"></td>" ;
		 		 HTMLcode += "<td>" ;

		 		 HTMLcode += "<SELECT ID=\"CIRCLEStoolsFUNDAMENTALREGIONlayerCOMBO\" ONCHANGE=\"javascript:CIRCLEStoolsFUNDAMENTALREGIONlayerCOMBOonchange();\">" ;
		 		 HTMLcode += "<OPTION VALUE=\"-1\">" ;
		 		 HTMLcode += "<OPTION VALUE=\"0\">Default viewport" ;
		 		 
		 		 var _data_pack = [] ;
		 		 var _layers_list = circles_lib_canvas_layer_pile_get( Z_PLANE );
         if ( safe_size( _layers_list, 0 ) > 0 )
		 		 {
				 		 HTMLcode += "<OPTGROUP VALUE=\"-1\" LABEL=\"Z-plane layers\">" ;
				 		 $.each( _layers_list,
				 		 				 function( _i, _layer_item )
				 		 				 {
				 		 				 		 _data_pack = [] ;
				 		 				 		 _data_pack.push( _layer_item.plane_type, _layer_item.get_role_id(), _layer_item.get_idcanvas(), _layer_item.get_iddiv(), _layer_item.get_label() );
										 		 HTMLcode += "<OPTION VALUE=\""+_data_pack.join("@|@")+"\">" + _layer_item.get_label().replaceAll( "zplane", "" );
										 }
									 );
             HTMLcode += "</OPTGROUP>" ;
				 }

		 		 _layers_list = circles_lib_canvas_layer_pile_get( W_PLANE );
		 		 if ( safe_size( _layers_list, 0 ) > 0 )
		 		 {
				 		 HTMLcode += "<OPTGROUP VALUE=\"-1\" LABEL=\"W-plane layers\">" ;
				 		 $.each( _layers_list,
				 		 				 function( _i, _layer_item )
				 		 				 {
				 		 				 		 _data_pack = [] ;
				 		 				 		 _data_pack.push( _layer_item.plane_type, _layer_item.get_role_id(), _layer_item.get_idcanvas(), _layer_item.get_iddiv(), _layer_item.get_label() );
										 		 HTMLcode += "<OPTION VALUE=\""+_data_pack.join("@|@")+"\">" + _layer_item.get_label().replaceAll( "wplane", "" );
										 }
									 );
             HTMLcode += "</OPTGROUP>" ;
				 }
		 		 
				 HTMLcode += "</SELECT>" ;
				 HTMLcode += "</td>" ;
		 		 HTMLcode += "<td WIDTH=\"3\"></td>" ;
		 		 HTMLcode += "<td>Layer</td>" ;
		 		 HTMLcode += "<td WIDTH=\"15\"></td>" ;
		 		 HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"CIRCLEStoolsFUNDAMENTALREGIONdepth\" VALUE=\""+_glob_depth+"\" STYLE=\"width:30px;text-align:center;\"></td>" ;
		 		 HTMLcode += "<td WIDTH=\"3\"></td>" ;
		 		 HTMLcode += "<td>Depth</td>" ;
		 		 HTMLcode += "</tr>" ;
		 		 HTMLcode += "</table>" ;
		 return HTMLcode ;
}