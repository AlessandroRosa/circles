function CIRCLEStoolsGROUPTABLEfill_div_with_mobius_maps( _items_mask, _fontsize, _round_to )
{
    _items_mask = safe_int( _items_mask, _glob_items_switch );
    _fontsize = safe_int( _fontsize, CIRCLEStoolsGROUPTABLEfontsize );
    _round_to = safe_int( _round_to, CIRCLEStoolsGROUPTABLEroundto );
    var _switch_label = _items_mask == ITEMS_SWITCH_SEEDS ? "Seeds" : "Generators" ;
		var _items_n = _items_mask == ITEMS_SWITCH_SEEDS ? circles_lib_count_seeds() : circles_lib_count_gens();
		var _array_ref = _items_mask == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
		
		$( "#CIRCLEStoolsGROUPTABLElabel" ).html( "Displaying <b>" + _switch_label + "</b>" );
    var _map = null, _symbol, _word, _html_code = "<table "+( _items_n == 0 ? "WIDTH=\"100%\"" : "" )+">" ;
    if ( _items_n > 0 )
    {
        _html_code += "<tr><td HEIGHT=\"8\"></td></tr><tr>" ;
        var _keys = _glob_gens_set_symbols_map_array.keys_associative();
        var _values = _glob_gens_set_symbols_map_array.values_associative();
        for( var _i = 0 ; _i < _items_n ; _i++ )
        {
            _map = _array_ref[_i].map, _symbol = _array_ref[_i].symbol ;
            _word = _items_mask == ITEMS_SWITCH_SEEDS ? "" : _keys[ _values.indexOf( _symbol ) ] ;
            if ( is_mobius_map( _map ) )
            _html_code += "<td WIDTH=\"55\"></td><td VALIGN=\"top\"><table><tr><td HEIGHT=\"60\" ALIGN=\"center\" STYLE=\"color:white;\">"+_map.output( "<br>", "html", _round_to, "font-size:"+_fontsize+"pt;" )+"</td></tr><tr><td HEIGHT=\"4\"></td></tr><tr><td HEIGHT=\"8\"></td></tr><tr><td ALIGN=\"center\" STYLE=\"color:yellow;font-size:"+_fontsize+"pt;\"><b>"+_symbol+( ( !_symbol.strcmp( _word ) && _word.length > 0 ) ? "&nbsp;("+_word+")" : "" )+"</b></td></tr></table></td>"
        }
        _html_code += "</tr>" ;
    }
    else _html_code += "<tr><td HEIGHT=\"8\"></td></tr><tr><td ALIGN=\"center\" STYLE=\"font-size:16pt;color:#FAFAFA;\">The current group of "+_switch_label+" is empty</td></tr>" ;

    _html_code += "</table>" ;
    $( "#CIRCLEStoolsGROUPTABLEdiv" ).html( _html_code );
}