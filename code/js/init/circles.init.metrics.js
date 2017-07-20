function CIRCLESgetMETRICS()
{
    var _a = [ "ZPLANEtd", "WPLANEtd",
               "PANELleft", "PANELright",
               "ZplaneCOORDScontainer", "WplaneCOORDScontainer",
               "ZPLANElayers_pile", "WPLANElayers_pile" ] ;
		var _dims = getViewportExtents();
		_glob_layer_metrics_array.flush_associative();
		_glob_layer_metrics_array[ "body" ] = [ 0, 0, _dims[0], _dims[1] ]  ;
    for( var _id in _a )
    {
        if ( $( "#"+_id ).get(0) != null )
        _glob_layer_metrics_array[ ""+_id ] = [ $( "#"+_id ).offset().left, $( "#"+_id ).offset().top,
                                          $( "#"+_id ).width(), $( "#"+_id ).height() ] ;
    }
}