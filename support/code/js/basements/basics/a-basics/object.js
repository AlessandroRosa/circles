if ( typeof is_object != "function" ) function is_object( _obj ) { return _obj instanceof Object ? 1 : 0 ; }
if( !Object.keys )
{
    Object.prototype.keys = function()
    {
        var _a = [] ;
        for ( var property in this )
        if ( this.hasOwnProperty( property ) && !( /^\d+$/.test( property ) ) ) _a.push( property ) ;
        return _a ;
    }
}

// DON'T add new methods or they'll get in conflict with jquery