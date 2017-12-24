if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ) ; }
if ( typeof safe_int != "function" )
{
    function safe_int( _val, _set_if_nan )
    {
        _val = parseInt( _val, 10 );
        return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ;
    }
}

if ( typeof safe_float != "function" )
{
    function safe_float( _val, _set_if_nan )
    {
        _val = parseFloat( _val );
        return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ;
    }
}


if ( typeof JSONret_container == 'undefined' ) var JSONret_container = null ;
if ( typeof JSONclone !== "function" )
function JSONclone(obj)
{
    if (obj === null || typeof obj !== 'object') return obj;
    var _clone = obj.constructor();
    for ( var _prop in obj) if ( obj.hasOwnProperty(_prop) ) _clone[_prop] = JSONclone(obj[_prop]);
    return _clone;
}

if ( typeof JSONstringify !== "function" ) function JSONstringify( _obj ) { return is_json( _obj ) ? JSON.stringify( _obj ) : null ; }

if ( typeof is_json != "function" )
function is_json( _obj )
{
    var _has_keys = 0 ;
    for( var _pr in _obj )
    {
        if ( _obj.hasOwnProperty( _pr ) && !( /^\d+$/.test( _pr ) ) )
        {
            _has_keys = 1 ;
            break ;
        }
    }

    return ( _has_keys && _obj.constructor == Object && _obj.constructor != Array ) ? 1 : 0 ;
}

if ( typeof json_keys != "function" )
function json_keys( _obj )
{
    var _a = [] ;
    for ( var property in _obj )
    if ( _obj.hasOwnProperty( property ) && !( /^\d+$/.test( property ) ) ) _a.push( property ) ;
    return _a ;
}

if( typeof JSONlength !== "function" )
function JSONlength( _obj, _level )
{
    _level = safe_int( _level, 0 );
    if ( _level == 0 )
    {
        if ( !is_json( _obj ) ) return NO ;
    }

    var _cnt = 0 ;
    for( var _prop in _obj )
    {
       if ( is_json( _obj[ _prop ] ) )
       {
          ++_level ;
          _cnt += JSONlength( _obj[ _prop ], _level ) ;
       }
       else if ( _obj.hasOwnProperty( _prop ) ) _cnt++ ;
    }

    return _cnt ;
}

if( typeof JSONlevel_get !== "function" )
function JSONlevel_get( _obj, _input_level, _level, _arrived, _ret )
{
    _level = safe_int( _level, 0 );
    if ( _level == 0 ) _arr = [ "" ] ;

    _arrived = safe_int( _arrived, 0 );
    _input_level = safe_int( _input_level, 0 );
    _level = safe_int( _level, 0 );

    if ( _input_level == _level || _arrived == 1 )
    {
       _arrived = 1 ;
       _ret = {} ;
       for( var _prop in _obj )
       if ( _obj.hasOwnProperty( _prop )  )
       {
          _ret[ _prop ] = _obj[ _prop ] ;
          if ( is_json( _obj[ _prop ] ) ) JSONlevel_get( _obj[ _prop ], _input_level, _level, _arrived, _ret ) ;
       }

       JSONret_container = JSONclone( _ret ) ;
    }
    else if ( _level < _input_level )
    {
       for( var _prop in _obj )
       if ( is_json( _obj[ _prop ] ) )
       {
          ++_level, JSONlevel_get( _obj[ _prop ], _input_level, _level, _arrived, _ret ) ;
       }
    }  
}

if( typeof JSONcopy !== "function" )
function JSONcopy( _obj ) { return is_json( _obj ) ? JSON.parse(JSON.stringify(_obj)) : null ; }

if( typeof JSONmax_level !== "function" )
function JSONmax_level( _obj, _level, _arr )
{
   _level = safe_int( _level, 0 );
   if ( _level == 0 )
   {
      _arr = [0] ;
      if ( !is_json( _obj ) ) return NO ;
   }

   for( var _prop in _obj )
   {
      if ( is_json( _obj[ _prop ] ) )
      {
          ++_level ;
          _arr[0] = Math.max( _arr[0], _level );
          JSONmax_level( _obj[ _prop ], _level, _arr ) ;
      }
   }
   return _arr[0] ;
}