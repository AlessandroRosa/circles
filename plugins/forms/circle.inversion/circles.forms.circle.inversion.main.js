function CIRCLESformsCIRCLEINVERSIONclose() { return circles_lib_plugin_dispatcher_unicast_message( "circle.inversion", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsCIRCLEINVERSIONmain( _base_id, _move )
{
    var CLOSE_FN = "CIRCLESformsCIRCLEINVERSIONclose();" ;

    CIRCLESformsCIRCLEINVERSIONbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    var _items_n = circles_lib_count_itemms(_items_array);
    var _run = _items_n > 0, _subset = "forms" ;
    var WIDTH = 400, HEIGHT = 300 ;
    var _div_id = CIRCLESformsCIRCLEINVERSIONdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    var HTMLcode = "<table WIDTH=\""+WIDTH+"\">" ;
        HTMLcode += circles_lib_plugin_caption_code( _run, CIRCLESformsCIRCLEINVERSIONcaption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset );

    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>From</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<SELECT ID=\"fromCIRCLEScombo\">" ;
    HTMLcode += "<OPTION VALUE=\"\">" ;

    var SELECTED = "", ITEM, _symbol ;
    for( var i = 0 ; i < _items_n ; i++ )
    {
        ITEM = _items_array[i] ;
        _symbol = is_item_obj( ITEM ) ? ITEM.symbol.trim() : "" ;
        if ( _symbol.length > 0 ) HTMLcode += "<OPTION "+SELECTED+" VALUE=\""+_symbol+"\">" + ( _symbol.length == 0 ? "< unknown >" : "" );
    }

    HTMLcode += "</SELECT>" ;
    HTMLcode += "</td>" ;

    HTMLcode += "<td WIDTH=\"35\"></td>" ;
    HTMLcode += "<td>To</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\">" ;
    HTMLcode += "<SELECT ID=\"toCIRCLEScombo\">" ;
    HTMLcode += "<OPTION VALUE=\"\">" ;

    for( var i = 0 ; i < _items_n ; i++ )
    {
        ITEM = _items_array[i] ;
        _symbol = is_item_obj( ITEM ) ? ITEM.symbol.trim() : "" ;
        HTMLcode += "<OPTION "+SELECTED+" VALUE=\""+_symbol+"\">" + ( _symbol.length == 0 ? "< unknown >" : "" );
    }

    HTMLcode += "</SELECT>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</table>" ;
}