_glob_circles_js_translation.push( ['special_syntax',
			[ // (a,b,c,d)=(1,2,3,4) ===> a=1,b=2,c=3,d=4
		    function( _code )
				{
							if ( is_string( _code ) )
							{
									var _re = /\(([\_\s\w\,]+)\)\s?\=\s?\(([\d\w\s\.\,]+)\)/gim ;
									var _pos_data = _code.matching_positions( _re, 1 ) ;
									if ( is_array( _pos_data ) )
									{
											var _start, _end, _match_str, _tokens, _left, _right, _left_array, _right_array, _out ;
											for( var _p = 0 ; _p < _pos_data.length ; _p++ )
											{
													if ( is_array( _pos_data[_p] ) )
													{
															_start = _pos_data[_p][0] ;
															_end = _pos_data[_p][1] ;
															_match_str = _pos_data[_p][2] ;
															_tokens = _match_str.replaceAll( [ "(", ")" ], "" ).split( "=" );
															_left = _tokens[0], _right = _tokens[1] ;
															_left_array = _left.indexOf( "," ) != -1 ? _left.split( "," ) : [ _left ] ;
															_right_array = _right.indexOf( "," ) != -1 ? _right.split( "," ) : [ _right ] ;
															
															_out = [] ;
															for( var _i = 0 ; _i < _left_array.length ; _i++ ) _out.push( _left_array[_i].trim()+" = eval( "+_right_array[_i].trim() + " )" );
															_code = _code.replaceAll( _match_str, _out.join( ", " ) );
													}
											}
									}
							}

							return _code ;
				}
			],
			[
				function( _code )
				{
				/* _a[x,y,z] for picking up single indexed entries
				or
				_a[x-y] for picking up an interval of indexed entries
				*/
						 var _re = /(\w*)\[([\d\.\,\-]*)\]/gim ;
						 var _tmp_array = [], _array_var, _range, _index, _new_code ;
						 while( ( _match_ret = _re.exec( _code ) ) != null )
						 {
						 		 _array_var = _match_ret[1] ;
						 		 _range = _match_ret[2] ;
						 		 _index = _match_index['index'] ;
						 		 _tmp_array = _tmp_array.concat( _array_var.extract( _range ) );
						 		 _new_code = _array_var + " = "+_array_var+".extract( '"+_range+"' ) ;" ;
						 		 
						 		 _code = _code.replace_between( _index, _index + _match_ret[0].length, _new_code );
						 }
				}
			]
	    [ // a < b < c < ... < z
        function ( _code )
				{
            var _re1 = /\(([\s\_A-Za-z0-9\<|\>|\>=|\<=]{1,})\)/gim ;
            var _match_ret = _re1.exec( _code );
            if ( _match_ret == null ) return _code ;
         		var _tmp_code = _code.substr( _match_ret['index'], _code.length - 1 ) ;
            var _re = /(\<|\>)/gim, _cnt = 0 ;
            while( true )
            {
                var _match_ret = _re.exec( _tmp_code );
                if ( _match_ret == null ) break ;
                _re.lastIndex = _match_ret['index']+1 ;
                _cnt++ ;
            }
						
						if ( _cnt > 1 )
						{
								var _re_operators = /\beq\b|\blt\b|\bleq\b|\bgt\b|\bgeq\b|\>|\<\=?|\>\=?|==|!=|\(|\)/gi ;
		            var _re_operands = /[\-\.\w\d\(\)]/gi ;
                var _operands = _tmp_code.split( _re_operators );
                var _operators = _tmp_code.split( _re_operands );
                
                var _tmp_operands = [], _tmp_operators = [] ;
                _operands.work( function( _op ) { if ( _op.length > 0 ) _tmp_operands.push( _op.trim() ); } );
                _operators.work( function( _op ) { if ( _op.length > 0 ) _tmp_operators.push( _op.trim() ); } );

							  var _tokens = [] ;
								for( var _i = 1 ; _i < _tmp_operands.length ; _i++ )
								_tokens.push( "("+_tmp_operands[_i-1]+" "+_tmp_operators[_i-1]+" "+_tmp_operands[_i]+")" );
                
								var _str = _tokens.join( " && " ) ;
								_code = _code.replaceAll( _tmp_code, "( "+_str+" )" ) ;
						}

            return _code ;
				}
			]
		]
);