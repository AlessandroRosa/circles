function distribute_vals( _array_of_vars, _array_of_values )
{
    if ( !( _array_of_vars instanceof Array ) || !( _array_of_values instanceof Array ) ) return NO ;
    else if ( _array_of_vars.length != _array_of_values.length ) return NO ;
    var _expr = "" ;
    for( var _v = 0 ; _v < _array_of_vars.length ; _v++  )
    {
        _expr = _array_of_vars[_v] + " = " + _array_of_values[_v] ;
        try { eval( _expr ); }
        catch( err ) { console.log( err.message ); }
    }
}