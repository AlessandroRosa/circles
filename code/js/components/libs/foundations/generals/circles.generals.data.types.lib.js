function circles_lib_datatype_get_table( _clone ) { _clone = safe_int( _clone, 0 ) ; return _clone ? _glob_registered_datatypes.clone() : _glob_registered_datatypes ; }
function circles_lib_datatype_is_string( _item )
{
    var _datatype = "" ;
		$.each( circles_lib_datatype_get_table(),
		function( _t, _type )
		{
				if ( _type[0].call( this, _item ) )
        {
    				_datatype = _type[1] ;
            return NO ; // it just breaks the $.each loop, not returning the including function
        }
		}
		) ;
                            
    return _datatype.stricmp( "string" ) ? YES : NO ;
}

function circles_lib_datatype_detect_from_obj( _obj )
{
    var _datatype = "" ;
		$.each( circles_lib_datatype_get_table(),
		function( _t, _type )
		{
				if ( _type[0].call( this, _obj ) )
        {
    				_datatype = _type[5] ;
            return null ; // it just breaks the $.each loop, not returning the including function
        }
		}
		) ;
                            
    return _datatype ;
}

function circles_lib_datatype_detect_from_expression( _expr )
{
    _expr = safe_string( _expr, "" );
    if ( safe_size( _expr, 0 ) == 0 ) return "" ;
    var _datatype = "" ;
		$.each( circles_lib_datatype_get_table(),
		function( _t, _type )
		{
        if ( _expr.toLowerCase().includes_i( _type[1] ) )
        {
  					_datatype = _type[1] ;
            return null ; // it just breaks the $.each loop, not returning the including function
        }
		}
		) ;
                            
    return _datatype ;
}