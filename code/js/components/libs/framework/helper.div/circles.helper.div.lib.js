function circles_lib_helper_div_remove()
{
     var _helper_div = $( "#HELPERdiv" ).get(0);
     if ( _helper_div != null ) document.body.removeChild( _helper_div );
}

function circles_lib_helper_div_create( _plane_type, _title, _text, _force_width, _force_height )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _force_width = safe_int( _force_width, UNDET );
    _force_height = safe_int( _force_height, UNDET );
    _title = safe_string( _title, "<i>unknown title</i>" );
    _text = safe_string( _text, "<i STYLE=\"color:red;\">missing contents</i>" );
    var _helper_div_id = "HELPERdiv" ;
    var DIV = $( "#"+_helper_div_id ).get(0) ;
    if ( DIV == null ) DIV = document.createElement( "DIV" );
    
    if ( DIV != null )
    {
        var HTMLcode = "<table>" ;
            HTMLcode += "<tr><td CLASS=\"helper_div_caption\">" ;
            HTMLcode += "<table WIDTH=\"100%\">" ;
            HTMLcode += "<tr><td>Helper : "+_title+"</td>" ;
            HTMLcode += "<td WIDTH=\"5\"></td>" ;
            HTMLcode += "<td WIDTH=\"12\" CLASS=\"link\" ONCLICK=\"javascript:circles_lib_helper_div_remove()\"><IMG TITLE=\"Close\" SRC=\"%imgpath%icons/close/close.icon.01.12x12.png\"></td></tr>" ;
            HTMLcode += "</table>" ;
            
            HTMLcode += "<tr>" ;
            HTMLcode += "<td valign=\"top\" COLSPAN=\"4\">" ;
            HTMLcode += "<table>" ;
            HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
            HTMLcode += "<tr><td CLASS=\"helper_div_plane_ref_box\">"+( circles_lib_plane_get_def( _plane_type ) )+"</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
            HTMLcode += "<tr><td ID=\"ZOOMINGREGIONlabel\" CLASS=\"helper_div_plane_contents_box\">"+_text+"</td></tr>" ;
            HTMLcode += "</table>" ;
            HTMLcode += "</td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "</table>" ;
                    
        DIV.id = _helper_div_id ;
        DIV.setAttribute( "class", "helper_div_container" );
        DIV.style.width = _force_width == UNDET ? "auto" : _force_width + "px" ;
        DIV.style.height = _force_height == UNDET ? "auto" : _force_height + "px" ;
        
        HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
        DIV.innerHTML = HTMLcode ;
          
        document.body.appendChild(DIV);
        move_div( "HELPERdiv", _plane_type == Z_PLANE ? "RIGHT" : "LEFT", "BOTTOM" );
        DIV.style.display = "block" ;
    }
}