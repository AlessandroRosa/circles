function debug( _str ) { console.log( _str ) ; }
function object_exists( _obj ) { return ( _obj != null && _obj != "undefined" ) ? 1 : 0 ; }
function is_consistent_array( _a ) { return _a != null ? ( ( _a instanceof Array ) ? ( _a.length > 0 ? 1 : 0 ) : -2 ) : -1 ; }
function is_a_given_obj( _obj, _obj_tag )       { return ( window.eval( "_obj instanceof " + _obj_tag ) ) ? 1 : 0 ; }
function is_reg_ex( _obj ) { return ( _obj.exec && _obj.test ) ? 1 : 0 ; }
function safe_array( _obj, _ret_val )
{
    if ( _obj == null || _obj == "undefined" || _ret_val == "undefined" || _ret_val == null ) return new Array() ;
    else if ( _obj instanceof Array ) return _obj ;
    else if ( !_obj instanceof Array && !( _ret_val instanceof Array ) ) return new Array() ;
    else return _ret_val ;
}

function safe_size( _obj, _ret_val )
{
    if ( _ret_val == "undefined" || _ret_val == null ) _ret_val = 0 ;
    if ( _obj == null || _obj == "undefined" ) return _ret_val ;
    else if ( typeof _obj == "string" || _obj instanceof String || _obj instanceof Array || _obj instanceof Object ) return _obj.length ;
    else return _ret_val ;
}

function check_data_type( _obj, _datatype )
{
   if ( _obj == null || _obj == "undefined" ) return -1 ;
   var _constructor = _obj.constructor + "" ;
   return ( typeof _obj === _datatype.toLowerCase() || ( _constructor.toLowerCase().indexOf( _datatype.toLowerCase() ) != -1 ) ) ? 1 : 0 ;
}

function compare_objects( x, y )
{
    for (var p in x )
    {
        if(typeof(x[p]) !== typeof(x[p])) return 0;
        if((x[p]===null) !== (x[p]===null)) return 0;
        switch (typeof(x[p]))
        {
            case 'undefined':
            if (typeof(x[p]) != 'undefined') return 0;
            break;
            case 'object':
            if(x[p]!==null && x[p]!==null && (x[p].constructor.toString() !== x[p].constructor.toString() || !x[p].equals(x[p]))) return 0;
            break;
            case 'function':
            if (p != 'equals' && x[p].toString() != x[p].toString()) return 0;
            break;
            default:
            if (x[p] !== x[p]) return 0;
            break ;
        }
    }

    return 1;
}

function clone(src)
{
	function mixin(dest, source, copyFunc)
  {
		var name, s, i, empty = {};
		for(name in source)
    {
			// the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
			// inherited from Object.prototype.	 For example, if dest has a custom toString() method,
			// don't overwrite it with the toString() method that source inherited from Object.prototype
			s = source[name];
			if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s)))
      {
				dest[name] = copyFunc ? copyFunc(s) : s;
			}
		}
		return dest;
	}

	if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
		// null, undefined, any non-object, or function
		return src;	// anything
	}
	if(src.nodeType && "cloneNode" in src){
		// DOM Node
		return src.cloneNode(true); // Node
	}
	if(src instanceof Date){
		// Date
		return new Date(src.getTime());	// Date
	}
	if(src instanceof RegExp){
		// RegExp
		return new RegExp(src);   // RegExp
	}
	var r, i, l;
	if(src instanceof Array){
		// array
		r = [];
		for(i = 0, l = src.length; i < l; ++i){
			if(i in src){
				r.push(clone(src[i]));
			}
		}
		// we don't clone functions for performance reasons
		//		}else if(d.isFunction(src)){
		//			// function
		//			r = function(){ return src.apply(this, arguments); };
	}else{
		// generic objects
		r = src.constructor ? new src.constructor() : {};
	}
	return mixin(r, src, clone);
}

function get_methods( _obj )
{
    var _a = [], _b_method ;
    for ( var property in _obj )
    {
       window.eval( "_b_method = typeof this."+property+" === 'function'" );
       if ( _b_method ) _a.push( property ) ;
    }
    return _a ;
}

function get_properties( _obj )
{
    var _a = [], _b_method ;
    for ( var property in _obj )
    {
      window.eval( "_b_method = typeof this."+property+" === 'function'" );
       if ( !_b_method ) _a.push( property ) ;
    }
    return _a ;
}

function dump( _obj, _level, _html )
{
	var _output = "", _padding = "", _data ;
	_level = Math.abs( safe_int( _level, 0 ) ), _html = safe_int( _html, 0 ) ;

	var _linebreaker = _html ? "</br>" : "\n" ;
	var _marker1_open = _html ? "<yellow>" : "", _marker1_close = _html ? "</yellow>" : "" ;
	var _marker2_open = _html ? "<cyan>" : "", _marker2_close = _html ? "</cyan>" : "" ;
	
	for( var _p = 0; _p < _level + 1; _p++ ) _padding += _html ? "    " : "&nbsp;&nbsp;&nbsp;&nbsp;" ;

	if( typeof( _obj ) == 'object' )
	{
			for( var _item in _obj )
	    {
		      if ( _obj.hasOwnProperty( _item ) )
		      {
		    			_data = _obj[_item];
							_output += _padding + _marker2_open + _item + _marker2_close ; 
							if ( typeof( _data ) == 'object' ) _output += " is a " + _marker1_open + _data.constructor.name + _marker1_close + " object" + _linebreaker + dump( _data, _level + 1, _html ) + _linebreaker ;
							else _output += " : " + _data + _linebreaker ;
		      }
			}
	}
	else _output = _marker1_open + _obj + _marker1_close + " : " + typeof( _obj );
	return _output;
}