// put the following code in the function to know the caller:
// arguments.callee.caller.callername(1)
// put the following code in the function to retrieve the name of the function itself
// arguments.callee.myname()

if ( typeof is_function != "function" ) function is_function( _fn ) { return typeof _fn == "function" ? 1 : 0 ; }
if ( typeof function_exists != "function" ) 
function function_exists( fn_obj )
{
    var _fn_exists = typeof fn_obj == "function" ? 1 : 0 ;
    if ( !_fn_exists && fn_obj != null )
    {
        if ( fn_obj.includes( "window." ) ) fn_obj = fn_obj.replaceAll( "window.", "" );
        eval( " _fn_exists = ( typeof window."+fn_obj+" == 'function' ) ? 1 : 0 ;" ) ;
    }
    return _fn_exists ;
}

if ( typeof unload_fn != "function" )
function unload_fn( _fn_name ) { if ( function_exists( _fn_name ) ) { eval( _fn_name + " = null ;" ); return 1 ; } else return 0 ; }

if ( typeof unload_fns != "function" )
function unload_fns( _obj, _obj_ref_name, _fn_name, _exact_match )
{
    // unload all embedded fns in an object, either matching the full input fn name or starting with it
    _exact_match = safe_int( _exact_match, 0 );
    var _join_expr = _obj_ref_name.length > 0 ? _obj_ref_name+"."+_fn_name : _fn_name ;
    var _pattern = _exact_match ? "^"+_join_expr+"$" : "^"+_join_expr ;
    var _r = new RegExp( _pattern ), _expr ;
    for( var _a in _obj )
    {
       if ( _r.test( _a + "" ) ) // force string casting
       {
       		_expr = ( _obj_ref_name.length > 0 ? _obj_ref_name + "." : "" ) + _a ;
          try{ eval( _expr + "=null;" ) ; }
          catch( err ) { console.log( err.message ); }
       }
    }
}

Function.prototype.myname = function() { return this.name ; }
Function.prototype.callername = function( _level )
{
     // level 0 is this function
     _level = parseInt( _level, 10 );      if ( isNaN( _level ) || _level < 0 ) _level = 0 ;
     var _eval_str = "arguments.callee" ;
     for( var _l = 0 ; _l <= _level ; _l++ ) _eval_str += ".caller" ;
     
     _eval_str += ".myname();" ;
     return eval( _eval_str ) ;
}

Function.prototype.pass = function(){ return function(){ this.apply(this,arguments);} };