var _glob_array_recursive_run = 1 ;

Array.recursive_run = 1 ;

if ( typeof array_set_recursive_run != "function" ) function array_set_recursive_run( _r ) { _glob_array_recursive_run = _r ; }
if ( typeof array_default_settings != "function" ) function array_default_settings(){ _glob_array_recursive_run = 1 ; }
if ( typeof is_array != "function" ) function is_array( _a ) { return _a instanceof Array ? 1 : 0 ; }
if ( typeof is_consistent_array != "function" ) function is_consistent_array( _a ) { return is_array( _a ) ? ( ( _a.length > 0 || _a.size_associative() > 0 ) ? 1 : 0 ) : 0 ; }

if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

if ( !Array.reset_index ) { Array.prototype.reset_index = function() { return this.filter(function(){return true;}) ; } }
if ( !Array.flush ) { Array.prototype.flush = function() { while( this.length > 0 ) this.pop(); } }
if ( !Array.has_duplicates ) { Array.prototype.has_duplicates = function() { return this.length != this.unique().length ? 1 : 0 ; } }
if ( !Array.left ) { Array.prototype.left = function( n )  { return this.subset( n ); } }
if ( !Array.trunc ) { Array.prototype.trunc = function( n ) { return this.left( n ); } }
if ( !Array.from_to ) { Array.prototype.from_to = function( _from_index, _to_index ) { return arguments.length == 1 ? this.slice( _from_index, this.length ) : this.slice( _from_index, _to_index + 1 ); } }
if ( !Array.get_first ) { Array.prototype.get_first = function() { return this.length > 0 ? this[0] : null ; } }
if ( !Array.get_last )       { Array.prototype.get_last = function() { return this.length > 0 ? this[ this.length - 1 ] : null ; } }
if ( !Array.pop_first ) { Array.prototype.pop_first = function() { var _out = this[0] ; this.slice( 1, this.length - 1 ) ; return _out ; } }
if ( !Array.tail ) { Array.prototype.tail = function( _n ) { return this.slice( -_n ) ; } }
if ( !Array.push_safe )  { Array.prototype.push_safe = function( obj )    { if ( this.indexOf( obj ) == -1 ) this.push( obj ) ; } }
if ( !Array.push_first ) { Array.prototype.push_first = function( _item ) { return ( new Array( _item ) ).concat( this ) ; } }
if ( !Array.get_central )    { Array.prototype.get_central = function() { var _n = this.length ; return _n % 2 == 1 ? this[ Math.floor( _n / 2 ) ] : null ; } }
if ( !Array.right ) { Array.prototype.right = function( n ) { return this.subset( -n ); } }
if ( !Array.slide_back ) { Array.prototype.slide_back = function() { return ( this.slice(1) ).concat( this.slice( 0,1 ) ) ; } }
if ( !Array.slide_forward )  { Array.prototype.slide_forward = function() { return ( this.slice(this.length-1).concat( this.slice(0,this.length-1) ) ) ; } }

// methods for associative arrays
if ( !Array.insert_associative ) { Array.prototype.insert_associative = function( key, val ) { this[ key ] = val; }; }
if ( !Array.remove_key ){ Array.prototype.remove_key = function( key ) { if ( this.hasOwnProperty( key ) ) delete this[ key ] ; }; }

//////
if ( !Array.recursive_indexOf )
{
    Array.prototype.recursive_indexOf = function( obj, _level, _index_rec, _flag )
    {
       if ( _level == null || _level == "undefined" ) _level = 0 ;
       _b_found = 0 ;
       outer_loop:
       for ( var _i = 0; _i < this.length; _i++ )
       {
          if ( _level == 0 ) _flag = [] ;  // I create an array so I can use it as a call-by-reference var during recursion
      	  if ( is_array( this[_i] ) )
          {
             // it's required to record the downward path in a separate array,
             // when a nested array is detected and then recursion gets in
             if ( _level == 0 ) _index_rec = [ _i ] ;
             else _index_rec.push( _i ) ;
             this[_i].recursive_indexOf( obj, _level + 1, _index_rec, _flag ) ;
             if ( _flag[0] == 1 ) break outer_loop ;
          }
		      else
          {
             if( JSON.stringify( this[_i] ) == JSON.stringify( obj ) )
             {
                if ( _level == 0 || _index_rec == null ) _index_rec = [] ;
                _index_rec.push( _i ) ;
                _flag.push( 1 ) ;
                _b_found = 1 ;
                break outer_loop ;
             }
          } 
			 }
				 
			 if ( !_b_found )
			 {
					if ( _index_rec == null ) _index_rec = [] ;
					_index_rec.push( -1 ) ;
			 }
         
       // if index is found at level 0, the integer index is returned
       // otherwise this member returns an array collecting the indexes
       // leading download into the nested arrays
       return _index_rec == null ? -1 : ( _index_rec.length == 0 ? -1 : ( _index_rec.length == 1 ? _index_rec[0] : _index_rec ) ) ;
    }
}

if ( !Array.index_remap )
{
    Array.prototype.index_remap = function( _src_map, _new_array_size, _default_val )
    {
        if ( is_array( _src_map ) )
        {
            if ( _default_val == undefined ) _default_val = null ;
            _new_array_size = safe_int( _new_array_size, 0 );
            if ( _new_array_size == 0 ) _new_array_size = this.length ;
            _src_map = _src_map.work( function( _i ) { return safe_int( _i, -1 ) ; } ) ;
            var _ok_src_index = 1 ;
            _src_map.test( function( _i ) { if ( _i < 0 || _i > ( _new_array_size - 1 ) ) _ok_src_index = 0 ; } ) ;
            if ( !_ok_src_index ) return null ;

            var _new_array = [] ;
            for( var _i = 0 ; _i < _new_array_size ; _i++ ) _new_array.push( _default_val );
            for( _i = 0 ; _i < _src_map.length ; _i++ ) _new_array[ _src_map[_i] ] = this[_i];

            return _new_array.clone() ;
        }
        else return null ;
    }
}

if ( !Array.getAt )
{
    Array.prototype.getAt = function()
    {
        var _cmd = "this", _ret, _indexes = [], _a ;
        if ( is_array( arguments[0] ) ) _indexes = arguments[0] ;
        else for( _a = 0 ; _a < arguments.length ; _a++ ) _indexes.push( safe_int( arguments[_a], 0 ) ) ;

        for( _a = 0 ; _a < _indexes.length ; _a++ ) _cmd += "["+_indexes[_a]+"]" ;
				try { _ret = eval( _cmd ) ; } catch( err ) {}
        return _ret ;
    }
}

if( !Array.count )
{
    // counts recursively how many elements of the same input type have been stored inside the array
    Array.prototype.count = function( obj )
    {
       var _c = 0, _ref = arguments[1] == null ? this : arguments[1] ;
     	 for ( var _property in _ref )
     	 {
     			if ( _ref.hasOwnProperty( _property ) )
          {
             if ( is_array( _ref[_property] ) && this.recursive_run ) _c += _ref[_property].count( obj, _ref[_property] ) ;
             else if( JSON.stringify( _ref[_property] ) === JSON.stringify( obj ) ) _c++ ;
          }
     	 }
       return _c ;
    }
}

if ( !Array.is_multidimensional )
{
    Array.prototype.is_multidimensional = function()
    {
       var _b_multi = 0 ;
   		 for ( var _property in this )
   		 {
           if ( this.hasOwnProperty( _property ) )
           {
     					if ( is_array( this[_property] ) && this.recursive_run )
              {
								 _b_multi = 1 ;
								 break ;
              }
           }
   		 }
			 return _b_multi ;
    }
}

if ( !Array.multidimensional_depth_count )
{
		// get the lowest depth (or maximal nesting level) for sub arrays
    Array.prototype.multidimensional_depth_count = function()
		{
       var _ref = arguments[0] == null ? this : arguments[0] ;
       var _data = arguments[1] == null ? [ 1 ] : arguments[1] ;
       var _level = arguments[0] == null ? 0 : arguments[2] ;
   		 for ( var _property in this )
   		 {
 					if ( this.hasOwnProperty( _property ) )
          {
             if ( is_array( this[_property] ) && this.recursive_run )
             {
								 if ( _level > _data[0] ) _data[0]++ ;
                 this[_property].multidimensional_depth_count( this[_property], _data, _level + 1 ) ;
             }
          }
   		 }
			 return _data[0] ;
		}
}

if ( !Array.multidimensional_level_get )
{
    // return all entries at the input level, i.e. calling multidimensional_level_get(3) returns all entries at level 3
		Array.prototype.multidimensional_level_get = function()
		{
       var _input_level = arguments[0] == null ? 1 : arguments[0] ;
       var _curr_level = arguments[1] == null ? 1 : arguments[1] ;
       var _ref = arguments[2] == null ? this : arguments[2] ;
       var _data = arguments[3] == null ? [] : arguments[3] ;

   		 for ( var _property in _ref )
   		 {
           if ( _ref.hasOwnProperty( _property ) )
           {
               if ( _curr_level == _input_level ) _data.push( _ref[_property] );
               if ( is_array( _ref[_property] ) && this.recursive_run )
               this[_property].multidimensional_level_get( _input_level, _curr_level+1, _ref[_property], _data ) ;
           }
   		 }
       return _data ;
		}
}

if ( !Array.size_recursive )
{
		Array.prototype.size_recursive = function()
		{
				 var _size = 0 ;
         var _ref = arguments[0] == null ? this : arguments[0] ;
         for ( var _property in _ref )
         {
              if ( _ref.hasOwnProperty( _property ) )
              _size += ( is_array( _ref[_property] ) ) ? _ref[_property].size_recursive( _ref[_property] ) : 1 ;
         }
				 return _size ;
		}
}

if ( !Array.append )
{
		// #1 .append( [ 1, 2, 3 ] ) --> append an array
		// #2 .append( _obj1, _obj2 ) --> append _obj1 and _obj2
		Array.prototype.append = function()
		{
				 var _arr = this ;
				 for( var _a = 0 ; _a < arguments.length ; _a++ )
				 {
						 if ( is_array( arguments[_a] ) ) _arr = _arr.concat( arguments[_a] ) ;
						 else _arr.push( arguments[_a] );
				 }
				 
				 return _arr ;
		}
}

if ( !Array.push_at )
{
      Array.prototype.push_at = function( _item, _pos )
      {
          var _len = this.length ;
          _pos = Math.max( 0, safe_int( _pos, -1 ) );
          if ( _pos == -1 || _pos < 0 || _pos > _len ) return [] ;
          else return [].concat( this.slice( 0, _pos ) ).concat( [ _item ] ).concat( this.slice( _pos, _len ) ) ;
      }
}

if ( !Array.prototype.fill )
{
    Array.prototype.fill = function( _obj )
    {
         var _ref = arguments[1] == null ? this : arguments[1] ;
         for ( var _property in _ref )
         {
              if ( _ref.hasOwnProperty( _property ) )
              {
                   if ( is_array( _ref[_property] ) && this.recursive_run ) _ref[_property].fill( _obj, _ref[_property] ) ;
                   else _ref[_property] = _obj ;
              }
         }
    }
}

if ( !Array.prototype.get_linear_array )
{
    Array.prototype.get_linear_array = function()
    {
         // returns a one dimensional (or linear) array
 				 var _ref = arguments[0] == null ? this : arguments[0] ;
         var _level = arguments[1] == null ? 0 : arguments[1] ;
 				 var _ret = arguments[2] == null ? [] : arguments[2] ;
         if ( !_ref.is_multidimensional() && _level == 0 ) return this ;
         else
         {
     				for ( var _property in _ref )
     				{
     					  if ( _ref.hasOwnProperty( _property ) )
                {
                    if ( is_array( _ref[_property] ) && this.recursive_run ) _ref[_property].get_linear_array( _ref[_property], _level + 1, _ret ) ;
                    else _ret.push( _ref[_property] ) ;
                }
     				}
            return _ret ;
         }
    }
}

if ( !Array.prototype.clean_from )
{
    Array.prototype.clean_from = function()
    {
    		var _ret, _i ;
				var _is_fn = typeof arguments[0] === "function" ? 1 : 0, _ret = 0 ;
        var _arg = arguments[0] ;
			  var _ref = arguments[1] == null ? this : arguments[1] ;
			  var _parent_ref = arguments[2] == null ? this : arguments[2] ;
			  var _prop_key = arguments[3] == null ? "" : arguments[3] ;
				for ( var _property in _ref )
        {
            if ( _ref.hasOwnProperty( _property ) )
            {
           		 if ( is_array( _ref[_property] ) && this.recursive_run ) this.clean_from( _arg, _ref[_property], _ref, _property ) ;
           		 else
           		 {
  		             _ret = _is_fn ? _arg.call( null, _ref[_property] ) : ( JSON.stringify( _ref[_property] ) === JSON.stringify( _arg ) ) ;
   		             if ( _ret )
   		             {
 		                  _ref.delete_entry( _ref[_property] ) ;
                      if ( _ref.size_recursive() == 0 ) _parent_ref.remove_key( _prop_key );
    
                      _ref.clean_from( _arg );
  		             }
   						 }
            }
        }
    }
}

if ( !Array.prototype.purge ) // removes undefined elements
{
    Array.prototype.purge = function( _self )
    {
  			_self = safe_int( _self, 1 );  	
    		if ( _self ) this.clean_from( function( _obj ) { return _obj === undefined ; } ) ;
    		else
    		{
						var _obj = this.clone();		_obj.purge();
						return _obj ;
				}
		}
}

if ( !Array.prototype.find_it )
{
    Array.prototype.find_it = function()
    {
	      var _is_fn = typeof arguments[0] === "function" ? 1 : 0, _ret = 0 ;
			  var _tester = arguments[0] ;			if ( _tester == null ) return null ;
			  var _ref = arguments[1] == null ? this : arguments[1] ;
				for ( var _property in _ref )
        {
             if ( _ref.hasOwnProperty( _property ) )
             {
		        		 if ( is_array( _ref[_property] ) && this.recursive_run ) _ret = _ref[_property].find_it( _tester, _ref[_property] ) ;
		        		 else
		        		 {
	 		               _ret = _is_fn ? _tester.call( null, _ref[_property] ) : ( JSON.stringify( _ref[_property] ) === JSON.stringify( _tester ) ) ;
				             if ( _ret )
				             {
				                  _ret = _property ;
				                  break ;
				             }
								 }
             }
        }
        
        return _ret ;
    }
}

if ( !Array.prototype.check_descendent_properties )
{
  Array.prototype.check_descendent_properties = function()
  {
       // it goes all the way down along the arguments list of properties of sub-arrays, if existing
       // example #1 : check_descendent_properties( 0, 1 )
       //              >> check item indexed as 0 and, if the latter is a sub-array, checks for sub-items indexed as 1
       // example #2 : check_descendent_properties( 0, 'prop1' )
       //              >> check item indexed as 0 and, if the latter is a sub-array, checks for sub-items tagged as 'prop1'
       // example #3 : check_descendent_properties( 'level1', 'level2' )
       //              >> check item tagged as 'level1' and, if the latter is a sub-array, checks for sub-items tagged as 'level2'
       var _bookmark = null, _ret = 1, _i ;
       for( _i = 0 ; _i < arguments.length ; _i++ )
       {
           _bookmark = _i == 0 ? this[ arguments[_i] ] : _bookmark[ arguments[_i] ] ;
           if ( _bookmark == null )
           {
                _ret = 0 ;
                break ;
           }
           else _ret = 1 ;
       }
       
       return _ret ;
  }
}

if ( !Array.prototype.shuffle )
{
	// no need to shuffle it recursively
  Array.prototype.shuffle = function()
  {
      var array = this, j, temp ;
      for ( var i = array.length - 1; i > 0; i--)
			{
          j = Math.floor(Math.random() * (i + 1));
          temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }
}

if ( !Array.prototype.test )
{
  Array.prototype.test = function()
  {
      var _is_fn = typeof arguments[0] === "function" ? 1 : 0 ;
		  var _tester = arguments[0] ; if ( !_is_fn ) return 0 ;
		  var _ref = arguments[1] == null ? this : arguments[1], _b_ok = 1 ;
			for ( var _property in _ref )
      {
          if ( _ref.hasOwnProperty( _property ) )
          {
        		 	if ( is_array( _ref[_property] ) && this.recursive_run ) _b_ok &= _ref[_property].test( _tester, _ref[_property] ) ;
        		 	else
		        	{
				          if ( !_tester.call( null, _ref[_property] ) )
				          {
				              _b_ok = 0 ;
				              break ;
				          }
							}
          }
      }

      return _b_ok ;
  };
}

if ( !Array.prototype.work )
{
  Array.prototype.work = function()
  {
      var _is_fn = typeof arguments[0] === "function" ? 1 : 0 ;
      if ( !_is_fn ) return 0 ;
		  var _tester = arguments[0] ;
      _recursive = safe_int( arguments[1], 0 );
		  var _ref = arguments[2] == null ? this : arguments[2], _out_array = [], _ret ;
			for ( var _property in _ref )
      {
          if ( _ref.hasOwnProperty( _property ) )
          {
        		 	if ( is_array( _ref[_property] ) && this.recursive_run )
							_ret = _ref[_property].work( _tester, _recursive, _ref[_property], _property );
        		 	else
						  _ret = _tester.call( null, _ref[_property], _property ) ;
						  
							if ( _ret === false ) break ;
 						  _out_array[_property] = _ret ;
          }
      }
      return _out_array ;
  };
}

if ( !Array.prototype.filtering )
{
    Array.prototype.filtering = function()
    {
  			// filters and preserves structure
        var _is_fn = typeof arguments[0] === "function" ? 1 : 0 ;
        if ( !_is_fn ) return 0 ;
  		  var _tester = arguments[0] ;
  		  var _ref = arguments[1] == null ? this : arguments[1];
  		  var _level = arguments[2] == null ? 0 : arguments[2];
  			var _out_array = [], _ret ;
  			for ( var _property in _ref )
        {
            if ( _ref.hasOwnProperty( _property ) )
            {
          		 	if ( is_array( _ref[_property] ) && this.recursive_run )
          		 	{
  		 							 _ret = _ref[_property].filtering( _tester, _ref[_property], _level + 1 );
  		 							 if ( _ret.size_recursive() > 0 ) _out_array[_property] = _ret ;
  							}
          		 	else if ( typeof _tester === "function" )
                {
                     if ( _tester.call( null, _ref[_property] ) ) _out_array[_property] = _ref[_property] ;
                } 
            }
        }
  			_out_array.purge() ;
        return _out_array.clone() ;
    };
}

if ( !Array.print_r )
{
    Array.prototype.print_r = function( _row_sep, _spacer, _b_display_key, _level, _node )
    {
        if ( _row_sep == null ) _row_sep = "\r\n" ;
        if ( _spacer == null ) _spacer = "&nbsp;" ;
        if ( _b_display_key == null ) _b_display_key = 1 ;
        if ( _level == null ) _level = -1 ;
        var _output = "" ;
          
        _level++ ;
        var _sp = _spacer.repeat(_level), _obj = this ;
        if( is_array( _obj ) || typeof( _obj ) == "object" )
        {
						for( var _p = 0 ; _p < _obj.length ; _p++ )
						{
								if ( is_array( _obj[_p] ) && this.recursive_run ) _output += _obj[_p].print_r( _row_sep, _spacer, _b_display_key, _level + 1, _node );
								else _output += _sp + ( _node != null ? _node : "" ) + _spacer + ( _obj[_p] + "" ) ; 
								_output += _row_sep ;
						}
        }
        else _output += _sp + ( _obj + "" ) ;
    
		    return _output;
    }
}

if ( !Array.clone )
{
		Array.prototype.clone = function()
		{
		    var _clone = [] ;
		    for ( var _prop in this )
				{
						if ( this.hasOwnProperty(_prop) )
						{
								if ( is_json( this[_prop] ) ) _clone[_prop] = JSONclone( this[_prop] );
								else if ( is_array( this[_prop] ) ) _clone[_prop] = this[_prop].clone() ;
								else _clone[_prop] = this[_prop] ;
						}
				}
		    return _clone;
		}
}

if ( !Array.dismember )
{
    Array.prototype.dismember = function( _token_size )
    {
        _token_size = safe_int( _token_size, 0 );
        if ( _token_size <= 1 ) return this ;
        var _arr = [], _tmp = [], _i = 0 ;
        for( var _p = 0 ; _p < this.length ; _p++ )
        {
            if ( _tmp.length == _token_size )
            {
                _arr.push( _tmp.clone() );
                _tmp = [] ;
            }

            _tmp.push( this[_p] );
        }
        
        if ( _tmp.length > 0 ) _arr.push( _tmp.clone() );
        return _arr ;
    }
}

if ( !Array.prototype.extract )
{
    Array.prototype.extract = function()
    {
    		var _out = [], _arg, _chunk ;
    		for( var _a = 0 ; _a < arguments.length ; _a++ )
    		{
						 _arg = arguments[_a] + "" ;
						 _arg = _arg.replace( /\;/, "," ) ;
						 if ( /^\d+\-\d+$/g.test( _arg ) )
						 {
						 		 _chunk = _arg.split( "-" );
								 _out = _out.concat( this.from_to( safe_int( _chunk[0], 0 ), safe_int( _chunk[1], 0 ) ) ) ;		
						 }
						 else if ( _arg.includes( "," ) )
						 {
						 		 _chunk = _arg.split( "," );
						 		 for( var _i = 0 ; _i < _chunk.length ; _i++ )
								 _out.push( this[ safe_int( _chunk[_i], 0 ) ] );	
						 }
						 else if ( /^\d+/.test( _arg ) ) _out.push( this[ safe_int( _arg, 0 ) ] );
				}
				
				return _out.clone();
    }
}

if ( !Array.set_central )
{
    Array.prototype.set_central = function( _c )
    {
        var _n = this.length, _a = [] ;
        if ( _n % 2 == 0 ) return _a.concat( this.slice(0, _n / 2 ), _c, this.slice( -_n / 2 ) ) ; // insert in the middle
        else
        {
             _a = this.clone();
             _a[ Math.floor( _n / 2 ) ] = _c ; // replace the middle element ;
             return _a ;
        }
    }
}

if ( !Array.includes )
{
    Array.prototype.includes = function()
    {
    		// it works recursively if sub-arrays are included
        // return true if ALL input arguments are included inside this array
        var _b_found = 0, _input = arguments[0] ;
		  	if ( _input == null ) return 0 ;
		  	var _ref = arguments[1] == null ? this : arguments[1];
				for ( var _property in _ref )
	      {
	          if ( _ref.hasOwnProperty( _property ) )
	          {
	        		 	if ( is_array( _ref[_property] ) && this.recursive_run ) _b_found = _ref[_property].includes( _input, _ref[_property] );
	        		 	else if ( _ref[_property] === _input ) _b_found = 1 ;
							  if ( _b_found ) break ;
	        	}
	      }
	      
        return _b_found ;
    }
}

if ( !Array.includes_i ) // case insensitive version
{
    Array.prototype.includes_i = function( _input )
    {
    		// it works recursively if sub-arrays are included
        // return true if ALL input arguments are included inside this array
        var _b_found = 0 ;
  	  	var _input = arguments[0] ;
		  	if ( _input == null ) return 0 ;
		  	var _ref = arguments[1] == null ? this : arguments[1];
				for ( var _property in _ref )
	      {
	          if ( _ref.hasOwnProperty( _property ) )
	          {
	        		 	if ( is_array( _ref[_property] ) && this.recursive_run ) _b_found = _ref[_property].includes_i( _input, _ref[_property] );
	        		 	else if ( new String( _ref[_property] ).toLowerCase() === new String( _input ).toLowerCase() ) _b_found = 1 ;
							  if ( _b_found ) break ;
	        	}
	      }
	      
        return _b_found ;
    }
}


if ( !Array.not_includes ) { Array.prototype.not_includes = function() { return !this.includes.apply( this, arguments ) ; } }
if ( !Array.not_includes_i ) { Array.prototype.not_includes_i = function() { return !this.includes_i.apply( this, arguments ) ; } }

if ( !Array.all_in )
{
    Array.prototype.all_in = function( _input )
    {
        // return true if ALL input arguments are included inside this array (case sensitive)
        var _b_found = 1, _test_array = ( is_array( _input ) && this.recursive_run ) ? _input : Array.prototype.slice.call(arguments, 0);
        for( var _i = 0 ; _i < _test_array.length ; _i++ )
				_b_found &= this.includes( _test_array[_i] ) != -1 ? 1 : 0 ;
        return _b_found ;
    }
}

if ( !Array.one_in )
{
    Array.prototype.one_in = function( _input )
    {
        // return true if AT LEAST ONE of the input arguments are included inside this array (case sensitive)
        var _b_found = 0, _test_array = ( is_array( _input ) && this.recursive_run ) ? _input : Array.prototype.slice.call(arguments, 0);
        for( var _i = 0 ; _i < _test_array.length ; _i++ )
				_b_found |= this.indexOf( _test_array[_i] ) != -1 ? 1 : 0 ;
        return _b_found ;
    }
}

if ( !Array.one_in_i )
{
    Array.prototype.one_in_i = function( _input )
    {
        // return true if AT LEAST ONE of the input arguments are included inside this array (case insensitive)
        var _test_array = ( is_array( _input ) && this.recursive_run ) ? _input : Array.prototype.slice.call(arguments, 0);
        var _b_found = 0, _tmp_array = [], _i ;
        for( _i = 0 ; _i < this.length ; _i++ ) _tmp_array.push( ( new String( this[_i] ) ).toLowerCase() );
        for( _i = 0 ; _i < _test_array.length ; _i++ ) _b_found |= this.indexOf( _test_array[_i].toLowerCase() ) != -1 ? 1 : 0 ;
        return _b_found ;
    }
}

if ( !Array.subset )
{
    Array.prototype.subset = function( _subset_length )
		{
			 _subset_length = safe_int( _subset_length, 0 );
 			 var _n_array = this.length ;
			 if ( _subset_length == 0 || _n_array == 0 ) return [] ;
		   else
			 {
					var _n_out = Math.min( Math.abs( _subset_length ), _n_array ) ;
					return _subset_length > 0 ? this.slice( 0, _n_out ) : this.slice( _n_array - Math.abs( _n_out ), _n_array );
			 }
		}
}


if ( !Array.compare_to )
{
		Array.prototype.compare_to = function( _compare )
		{
				if ( !is_array( _compare ) ) return 0 ;
				else return this.join("").localeCompare( _compare.join("") ) == 0 ? 1 : 0 ;
		}
}

if ( !Array.deep_compare_to )
{
		Array.prototype.deep_compare_to = function( _compare, _index_match )
		{
				if ( !is_array( _compare ) ) return 0 ;
				else if ( this.length != _compare.length ) return 0 ;
        else
        {
             var _ret = 1 ;
             _index_match = safe_int( _index_match, 0 );
             if ( _index_match )
             {
                 for( var _i = 0 ; _i < this.length ; _i++ ) _ret &= this[_i].localeCompare( _compare[_i] ) == 0 ? 1 : 0 ;
             }
             else
             {
                 for( var _i = 0 ; _i < this.length ; _i++ ) _ret &= _compare.includes( this[_i] ) ;
             }

             return _ret ;
        }
		}
}

if( !Array.pick_at_random )
{
    Array.prototype.pick_at_random = function( _exclude_choices_array )
    {
    		 var _v = null ;
    		 if ( _exclude_choices_array == null ) _exclude_choices_array = [];
    		 if ( this.compare_to( _exclude_choices_array ) ) return null ;
    		 while( true )
    		 {
  			 			_v = this[ Math.floor( Math.random() * this.length ) ] ;
  						if ( !_exclude_choices_array.includes( _v ) ) break ;
  			 }

         return _v ;
    }
}

if ( !Array.swap )
{
    Array.prototype.swap = function( i1, i2 )
    {
        if ( i1 != i2 && i1 >= 0 && i2 >= 0 &&
             i1 < this.length && i2 < this.length )
        {
            var TMP = this[i1] ;
            this[i1] = this[i2] ;
            this[i2] = TMP ;
        }
    }
}

if ( !Array.remove )
{
    Array.prototype.remove = function()
    {
				if ( is_array( arguments[0] ) )
				{
						for( var _a = 0 ; _a < arguments[0].length ; _a++ )
						{
		    				var from = this.indexOf( arguments[0][_a] ), to = this.indexOf( arguments[0][_a] ) ;
				        var rest = this.slice( ( to || from ) + 1 || this.length ) ;
				        this.length = from < 0 ? this.length + from : from ;
				        this.push.apply( this, rest ) ;
						}
						
						return this ;
				}
        else // from-index-to-index syntax
    		{
    				var from, to ;
            if ( arguments.length == 2 )
            {
                from = safe_int( arguments[0], -1 ), to = safe_int( arguments[1], -1 ) ;
            }
            else if ( arguments.length == 1 ) from = to = safe_int( arguments[0], -1 ) ;

            if ( from != -1 && to != -1 && from <= to )
            {
    		        var rest = this.slice( ( to || from ) + 1 || this.length ) ;
    		        this.length = from < 0 ? this.length + from : from ;
    		        return this.push.apply( this, rest ) ;
            }
            else return this ;
				}
    }
}

if ( !Array.delete_entry )
{
    Array.prototype.delete_entry = function( entry )
    {
    		if ( is_array( entry ) )
    		{
						 var _i = -1 ;
						 for( var _d = 0 ; _d < entry.length ; _d++ )
						 {
						 		 _i = this.indexOf( entry[_d] ) ;
						 		 if ( _i != -1 ) this.remove( _i, _i );
						 }				
				}
				else
				{
		        var _ref = this.indexOf( entry ) ;
		        if ( is_array( _ref ) )
		        {
		             var _cmd = "this" ;
		             for( _a = 0 ; _a < _ref.length - 1 ; _a++ ) _cmd += "["+_ref[_a]+"]" ;
		             var _from = _ref.pick_last(), _to = _from ;
		             _cmd += ".remove( "+_from+", "+_to+" )" ;
		   					 try { _ret = eval( _cmd ) ; } catch( err ) {}
		        }
		        else if ( _ref != -1 ) this.remove( _ref, _ref );
				}
        
        return this ;
    }
}

if ( !Array.keep_length )
{
		Array.prototype.keep_length = function( length_from, length_to )
		{
				var _l_from = length_from <= length_to ? length_from : length_to ;
				var _l_to = length_from >= length_to ? length_from : length_to ;
				var _mark = 0, _i ;
				for( _i = 0 ; _i < this.length ; _i++ )
				{
						 if ( this[_i].length < _l_from || this[_i].length > _l_to )
						 {
								 this.remove( _i, _i );
								 _i = _mark - 1 ;
						 }
						 else _mark = _i ;
				}
		}
}

if ( !Array.sort_adv )
{
    Array.prototype.sort_adv = function( _reverse )
    {
        _reverse = safe_int( _reverse, 0 ) ;
        return _reverse == 0 ? this.sort() : this.sort().reverse() ;
    }
}

if ( !Array.ksort )
{
    Array.prototype.ksort = function( _reverse )
    {
        _reverse = safe_int( _reverse, 0 ) ;
        //separate the keys into an array
        var keys = [], sortedArray = [];
        for(var k in this) { keys.push(k); }
        keys.sort();
        for( var _i=0; _i < keys.length ; _i++ ) sortedArray[keys[_i]] = this[keys[_i]];
        return _reverse == 0 ? sortedArray : sortedArray.reverse() ;
    }
}

if ( !Array.asort )
{
    Array.prototype.asort = function( _reverse )
    {
        _reverse = safe_int( _reverse, 0 ) ;
        var values = [], sortedArray = [], _i, _v, _key;
        for( var _p in this ) { values.push(this[_p]); }
        values.sort();
        for( _i = 0; _i < values.length ; _i++ )
        {
             _v = values[_i], _key = "" ;
             for( var _k in this )
             {
                  if ( this[_k] == _v )
                  {
                       _key = _k ;
                       break ;
                  }
             }    
             
             sortedArray[_key] = _v ;  
        }

        return _reverse == 0 ? sortedArray : sortedArray.reverse() ;
    }
}

if ( !Array.unique )
{
    Array.prototype.unique = function()
    {
        var tmp = {}, out = [], _i, _n ;
        for( _i = 0, _n = this.length; _i < _n; ++_i ) if(!tmp[this[_i]]) { tmp[this[_i]] = true; out.push(this[_i]); }
        return out;
    }
}

if ( !Array.get_duplicates )
{
    Array.prototype.get_duplicates = function()
    {
        var _dups = [], _i = 0, _c ;
        while ( _i < this.length )
        {
            _c = this.indexOf( this[_i], _i+1 ) ;
            if ( _c != _i && _c != -1 ) _dups.push( this[_c] ) ;
            _i++ ;
        }
        return _dups.unique() ;
    }
}

if ( !Array.get_duplicates_index )
{
    Array.prototype.get_duplicates_index = function()
    {
        var _dups = [], _i = 0, _c ;
        while ( _i < this.length )
        {
            _c = this.indexOf( this[_i], _i+1 ) ;
            if ( _c != _i && _c != -1 ) _dups.push( _c ) ;
            _i++ ;
        }
        return _dups ;
    }
}

if ( !Array.prototype.sum ) // float-version
{
    Array.prototype.sum = function()
    {
        var _sum = 0 ;
        for( var _i = 0 ; _i < this.length ; _i++ ) _sum += !isNaN( this[_i] ) ? safe_float( this[_i], 0 ) : 0 ;
        return _sum ;
    }
}

if ( !Array.prototype.permute ) // yields an multi-dimensional array including all permutations of the original one
{
    Array.prototype.permute = function()
    {
        // refer to http://www.quickperm.org/
        var _objects_list = this.clone();
        var _n = _objects_list.length, _results = [] ;
        var _p = [], _i = 0, _j = 0, _tmp ;
        for( _i = 0 ; _i <= _n ; _i++ ) _p.push( 0 );
        _i = 1 ;
        _results.push( _objects_list.clone() );
        while( _i < _n )
        {
            if ( _p[_i] < _i )
            {
                _j = _i % 2 == 1 ? _p[_i] : 0 ;
                _tmp = _objects_list[_j];
                _objects_list[_j] = _objects_list[_i];
                _objects_list[_i] = _tmp ;
                _results.push( _objects_list.clone() );
                _p[_i] += 1 ;
                _i = 1 ;
            }
            else
            {
                _p[_i] = 0 ;
                _i++ ;
            }
        }
        
        return _results ;
    }
}

if ( !Array.subtract )
{
    Array.prototype.subtract = function( _arr, _sub )
    {
    		 if ( is_array( _arr ) && is_array( _sub ) )
    		 {
						 var _both_standard = !this.is_associative() && !_arr.is_associative() ? 1 : 0 ;
						 if ( _both_standard )
						 {
								  if ( this.length > _arr.length )
									{
											 _sub = [] ;
											 var _a, _b, _found = 0 ;
											 for( _a = 0 ; _a < this.length ; _a++ )
											 {
											 		  _found = 0 ;
											 		  for( _b = 0 ; _b < _arr.length ; _b++ )
											 		  {
														 		 if ( this[_a] == _arr[_b] )
														 		 {
																		 _found = 1 ;
																		 break ;	
																 }
														}
														
														if ( !_found ) _sub.push( this[_a] );
											 }
									}
									else return -3 ;						 			
						 }
						 else return -2 ;
				 }
				 else return -1 ;
		}
}

if ( !Array.intersection )
{
    Array.prototype.intersection = function( _arr, _comparison_fn )
    {
    			if ( is_array( _arr ) && typeof _comparison_fn === "function" )
    			{
							 var _both_standard = !this.is_associative() && !_arr.is_associative() ? 1 : 0 ;
							 var _both_associative = this.is_associative() && _arr.is_associative() ? 1 : 0 ;
							 if ( _both_standard || _both_associative )
							 {
							 		 var _intersection_arr = [] ;
									 var _n_entries_1 = _both_standard ? this.length : this.keys_associative().length ;
									 		 var _keys1 = this.keys_associative() ;
									 var _n_entries_2 = _both_standard ? _arr.length : _arr.keys_associative().length ;
									 		 var _keys2 = _arr.keys_associative() ;
									 var _i1, _i2, _item1, _item2 ;
									 for( _i1 = 0 ; _i1 < _n_entries_1 ; _i1++ )
									 {
									 		 _item1 = _both_standard ? this[_i1] : this[ _keys1[_i1] ] ;
											 for( _i2 = 0 ; _i2 < _n_entries_2 ; _i2++ )
											 {
											 		 _item2 = _both_standard ? _arr[_i2] : _arr[ _keys2[_i2] ] ;
											 		 if ( _comparison_fn.call( null, _item1, _item2 ) )
											 		 {
																if ( _both_standard ) _intersection_arr.push( _item1 );
																else if ( _both_associative ) _intersection_arr[ _keys1[_i1] ] = _item1 ;
																break ;
													 }
											 }
									 }
									 
									 return _intersection_arr.clone();
							 }
							 else return -2 ;
							 
					}
    			else return -1 ;
    }
}

if ( !Array.difference )
{
    Array.prototype.difference = function( _arr, _comparison_fn )
    {
    			if ( is_array( _arr ) && typeof _comparison_fn === "function" )
    			{
							 var _both_standard = !this.is_associative() && !_arr.is_associative() ? 1 : 0 ;
							 var _both_associative = this.is_associative() && _arr.is_associative() ? 1 : 0 ;
							 if ( _both_standard || _both_associative )
							 {
							 		 var _difference_arr = [] ;
									 var _n_entries_1 = _both_standard ? this.length : this.keys_associative().length ;
									 		 var _keys1 = this.keys_associative() ;
									 var _n_entries_2 = _both_standard ? _arr.length : _arr.keys_associative().length ;
									 		 var _keys2 = _arr.keys_associative() ;
									 var _i1, _i2, _item1, _item2, _b_incommon ;
									 for( _i1 = 0 ; _i1 < _n_entries_1 ; _i1++ )
									 {
									 		 _item1 = _both_standard ? this[_i1] : this[ _keys1[_i1] ] ;
									 		 _b_incommon = 0 ;
											 for( _i2 = 0 ; _i2 < _n_entries_2 ; _i2++ )
											 {
											 		 _item2 = _both_standard ? _arr[_i2] : _arr[ _keys2[_i2] ] ;
											 		 if ( _comparison_fn.call( null, _item1, _item2 ) )
											 		 {
																_b_incommon = 1 ;
																break ;
													 }
											 }
											 
											 if ( !_b_incommon )
											 {
											 		  if ( _both_standard ) _difference_arr.push( _item1 );
											 		  else if ( _both_associative ) _difference_arr[ _keys1[_i1] ] = _item1 ;
											 }
									 }
									 
									 return _difference_arr.clone();
							 }
							 else return -2 ;
							 
					}
    			else return -1 ;
    }
}

// methods for associative arrays
if ( !Array.is_associative )
{
    Array.prototype.is_associative = function()
    {
         var _b_ok = 0 ;
         for ( var property in this )
         {
            if ( this.hasOwnProperty( property ) && !( /^\d+$/.test( property ) ) )
            {
								_b_ok = 1 ;
                break ;
            }
         }
  
         return _b_ok ;
    }
}

if( !Array.flush_associative )
{
    Array.prototype.flush_associative = function()
    {
       if ( this.is_associative() )
       {
          for ( var property in this ) if ( this.hasOwnProperty( property ) && !( /^\d+$/.test( property ) ) ) delete this[ property ] ;
          return 1 ;
       }
       else return 0 ;
    }
}

if( !Array.join_associative ) // join the values of the associative entries in the array through the input string
{
    Array.prototype.join_associative = function( _str )
    {
       var _a = [];
       if ( this.is_associative() )
       {
           for ( var property in this ) if ( this.hasOwnProperty( property ) && !( /^\d+$/.test( property ) ) ) _a.push( this[ property ] ) ;
           return _a.join( _str ) ;
       }
       else return null ;
    }
}

if( !Array.clone_associative ) // return a copy of the associative array
{
    Array.prototype.clone_associative = function()
    {
			 var _arr = arguments[0] == null ? this : arguments[0], _ret = [] ;
			 for ( var _property in _arr )
			 {
				  if ( _arr.hasOwnProperty( _property ) )
				  _ret[_property] = ( is_array( _arr[_property] ) ) ? this.clone_associative( _arr[_property] ) : _arr[_property] ;
			 }

			 return _ret ;
    }
}

if( !Array.associative_key_exists )
{
		Array.prototype.associative_key_exists = function( _key )
		{
			 var _type = typeof( this[ _key ] ) ;
			 return ( _type == null || _type === "undefined" ) ? 0 : 1 ;
		}
}

if( !Array.keys_associative ) // return a new array with the keys of the associative array
{
    Array.prototype.keys_associative = function()
    {
       var _a = [], _is_key = 0 ;
       if ( this.is_associative() )
       {
           for ( var property in this )
           {
							 if ( this.hasOwnProperty( property ) && !( /^\d+$/.test( property ) ) )
							 {
									 try{ eval( "_is_key = typeof( this['" + property + "'] ) === 'function' ? 0 : 1" ); }
									 catch( err )
									 {
								 			_is_key = 0 ;
									 }
									 if ( _is_key ) _a.push( property ) ;
							 }
					 }
           return _a ;
       }
       else return null ;
    }
}

if( !Array.values_associative ) // return a new array with the values of the associative array
{
    Array.prototype.values_associative = function()
    {
       var _a = [];
       if ( this.is_associative() )
       {
           for ( var property in this ) if ( this.hasOwnProperty( property ) && !( /^\d+$/.test( property ) ) ) _a.push( this[property] ) ;
           return _a ;
       }
       else return null ;
    }
}

if( !Array.swap_keys_vals_associative ) // return a new array with keys <---> values
{
    Array.prototype.swap_keys_vals_associative = function()
    {
       if ( this.is_associative() )
       {
           var _ks = this.keys_associative(), _vs = this.values_associative(), _a = [] ;
           for( var _k = 0 ; _k < _ks.length ; _k++ ) _a[ _vs[_k] ] = _ks[_k] ;
           return _a ;
       }
       else return null ;
    }
}

if( !Array.size_associative )
{
		// counts the keys recursively
    Array.prototype.size_associative = function()
    {
         var _size = 0, _ref = arguments[0] == null ? this : arguments[0] ;
         if ( this.is_associative() )
         {
		         for ( var _property in this )
		         {
								 if ( this.hasOwnProperty( _property ) && !( /^\d+$/.test( _property ) ) )
					 			 _size += is_array( this[ _property ] ) ? this[ _property ].size_associative( this[ _property ] ) : 1 ;
						 }
				 }
				 else _size += this.recursive_run ? this.size_recursive() : this.length ;
         return _size ;
    }
}

if( !Array.includes_associative ) // return a new array with the keys of the associative array
{
    Array.prototype.includes_associative = function( _entry )
    {
         var _b_found = 0 ;
         if ( this.is_associative() )
         {
             for ( var property in this )
             if ( this.hasOwnProperty( property ) && this[ property ] == _entry && !( /^\d+$/.test( property ) ) )
             {
                  _b_found = 1 ;
                  break ;
             }
         }

         return _b_found ;
    }
}

if( !Array.get_key_from_val_associative )
{
    Array.prototype.get_key_from_val_associative = function( _entry )
    {
         var _key = null ;
         if ( this.is_associative() )
         {
             for ( var property in this )
             if ( this.hasOwnProperty( property ) && this[ property ] == _entry && !( /^\d+$/.test( property ) ) )
             {
                  _key = property ;
                  break ;
             }
         }

         return _key ;
    }
}

if( !Array.toJSON )
{
    Array.prototype.toJSON = function()
    {
       // declare a inner fn so we can perform recursive calls
        var _from_arr_to_json = function( _input_obj )
        {
            var _obj = new Object(), _entry ;
            if( is_array( _input_obj ) )
            {
                for( var _prop in _input_obj )
                {
                    if ( _input_obj.hasOwnProperty( _prop ) && !( /^\d+$/.test( _prop ) ) )
                    {
                        _entry = _from_arr_to_json( _input_obj[_prop] );
                        _obj[_prop] = _entry;
                    }
                }
            }
            else _obj = _input_obj ;
            return _obj ;
        };

       return _from_arr_to_json( this );
    }
}