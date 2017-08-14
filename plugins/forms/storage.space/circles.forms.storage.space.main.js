function CIRCLESformsSTORAGESPACEclose() { return circles_lib_plugin_dispatcher_unicast_message( "storage.space", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsSTORAGESPACEmain( _base_id, _move )
{
    _move = safe_int( _move, YES );
    CIRCLESformsSTORAGESPACEbaseid = safe_string( _base_id, "" ) ;
    var CLOSE_FN = "CIRCLESformsSTORAGESPACEclose()" ;
    var WIDTH = 370, HEIGHT = "auto", _subset = "forms"  ;
    var _div_id = CIRCLESformsSTORAGESPACEdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );

		var HTMLcode = "<table WIDTH=\""+WIDTH+"\" HEIGHT=\"100%\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsSTORAGESPACEcaption, 5, 1, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "box/box.01.icon.16x16.png" );
        HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
			  HTMLcode += "<tr>" ;
			  HTMLcode += "<td ID=\"CIRCLESformsSTORAGESPACElistCONTAINER\" VALIGN=\"top\" HEIGHT=\"100%\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F1F1F5;padding:5px;\">" ;
        HTMLcode += CIRCLESformsSTORAGESPACElist();
				HTMLcode += "</td>" ;
		 		HTMLcode += "</tr>" ;
		 		HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
		 		HTMLcode += "</table>" ;
    
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsSTORAGESPACEcaption, CLOSE_FN );
    if ( _move && _div != null ) move_div( _div.id, "LEFT", "MIDDLE" );
}

function CIRCLESformsSTORAGESPACElist()
{
    var HTMLcode = "", _keys = _glob_storage.keys_associative(), _n_keys = safe_size( _keys, 0 );
    		HTMLcode += "<table WIDTH=\"100%\">" ;
		 		HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
    		HTMLcode += "<tr><td VALIGN=\"top\">The storage space includes "+_n_keys+" entr"+( _n_keys == 1 ? "y" : "ies" )+"</td></tr>" ;
		 		HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
				HTMLcode += "<tr><td VALIGN=\"top\">" ;
        if ( _n_keys > 6 ) HTMLcode += "<DIV STYLE=\"position:relative;width:100%;height:240px;overflow:auto;\">" ;
		 		HTMLcode += "<table>" ;
		 		HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
        HTMLcode += "<tr><td WIDTH=\"5\"></td><td STYLE=\"color:#ADB8D4;font-size:14pt;\">Subset</td><td WIDTH=\"5\"></td><td STYLE=\"color:#ADB8D4;font-size:14pt;\">Elements</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
    var _elements = 0, _class, _onclick_flush, _total = 0 ;
    $.each( _keys,
            function( _i, _key )
            {
               _elements = _key.toLowerCase() == "dict" ? _glob_storage[_key].size_recursive() : safe_size( _glob_storage[_key], 0 );
               _total += _elements ;
               _class = _elements == 0 ? "" : "CLASS=\"link\"" ;
               _onclick_flush = _elements == 0 ? "" : "ONCLICK=\"javascript:CIRCLESformsSTORAGESPACEpurge( '"+_key+"' );\"" ;
               _onclick_restore = _elements == 0 ? "" : "ONCLICK=\"javascript:CIRCLESformsSTORAGESPACErestore( '"+_key+"' );\"" ;
               if ( _elements == 0 ) _elements = "<SPAN STYLE=\"color:#C0C0C0;\">empty</SPAN>" ;
               HTMLcode += "<tr>" ;
               HTMLcode += "<td WIDTH=\"5\"></td><td "+_class+" VALIGN=\"top\" STYLE=\"font-size:14pt;color:"+(_elements==0?DEFAULT_EDIT_COLOR_DISABLED:"#434343")+";\">"+_key+"</td><td WIDTH=\"25\"></td><td "+_class+" VALIGN=\"top\" STYLE=\"font-size:14pt;color:#434343;\">"+_elements+"</td>" ;
               if ( safe_int( _elements, 0 ) > 0 )
               {
                  HTMLcode += "<td WIDTH=\"25\"></td><td "+_class+" "+_onclick_restore+" STYLE=\"font-size:14pt;color:#434343;\">Restore</td>" ;
                  HTMLcode += "<td WIDTH=\"15\"></td><td "+_class+" "+_onclick_flush+" STYLE=\"font-size:14pt;color:#434343;\">Purge</td>" ;
               }
               HTMLcode += "</tr>" ;
               HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
            }
          );

	 	HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
	 	HTMLcode += "</table>" ;
    if ( _n_keys > 5 ) HTMLcode += "</DIV>" ;
    HTMLcode += "</td></tr>" ;
		HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsSTORAGESPACEpurge( _subset, _question, _silent, _out_channel )
{
    _subset = safe_string( _subset, "" ).toLowerCase();
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    if ( _subset.length > 0 )
    {
        var _b_go = _question ? confirm( "Confirm to purge all data away from subset '"+_subset+"' of storage space ?" ) : YES ;
        if ( _b_go )
        {
            var _ret_id = circles_lib_storage_parse_dependencies_syntax( _subset, "purge" );
                _ret_id = safe_int( _ret_id, RET_ERROR );
            var _elements = _glob_storage[_subset].size_recursive();
            if ( _elements == 0 ) $( "#CIRCLESformsSTORAGESPACElistCONTAINER" ).html( CIRCLESformsSTORAGESPACElist() );
            if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, _elements > 0 ? DISPATCH_WARNING : DISPATCH_SUCCESS, _ret_msg, _glob_app );
            return _ret_id ;
        }
    }
    return RET_ERROR ;
}

function CIRCLESformsSTORAGESPACErestore( _subset, _question, _silent, _out_channel )
{
    _subset = safe_string( _subset, "" ).toLowerCase();
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    if ( _subset.length > 0 )
    {
       var _b_go = _question ? confirm( "Confirm to restore all data from subset '"+_subset+"' of storage space to the proper container ?" ) : YES ;
       if ( _b_go )
       {
          var _elements = _glob_storage[_subset].size_recursive();
          var _ret_chunk = circles_lib_storage_restore( _subset );
          var _ret_id = safe_int( _ret_chunk[0], RET_ERROR );
          var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
          if ( _elements > 0 )
          {
              var _label = "" ;
              switch( _subset )
              {
                 case "seeds":
                 _glob_seeds_array = _glob_storage[_subset].clone();
                 if ( !_silent && _out_channel == OUTPUT_SCREEN )
                 circles_lib_output( OUTPUT_SCREEN, _ret_id == RET_ERROR ? DISPATCH_WARNING : DISPATCH_SUCCESS, _ret_msg, _glob_app );
                 break ;
                 case "gens":
                 _glob_gens_array = _glob_storage[_subset].clone();
                 if ( !_silent && _out_channel == OUTPUT_SCREEN )
                 circles_lib_output( OUTPUT_SCREEN, _ret_id == RET_ERROR ? DISPATCH_WARNING : DISPATCH_SUCCESS, _ret_msg, _glob_app );
                 break ;
                 default: if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app ); break ;
              }
          }
          else if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't restore: the subset '"+_subset+"' of storage space is empty.", _glob_app );
          return _ret_id ;
       }
    }

    return NO ;
}