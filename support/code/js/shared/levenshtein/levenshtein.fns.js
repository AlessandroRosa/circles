if ( typeof is_array != "function" ) function is_array( _a ) 		{ return _a instanceof Array ? 1 : 0 ; }

function levenshtein(str1, str2)
{
    var m = str1.length,
        n = str2.length,
        d = [],
        i, j;
 
    if (!m) return n;
    if (!n) return m;
 
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 0; j <= n; j++) d[0][j] = j;
 
    for (j = 1; j <= n; j++) {
        for (i = 1; i <= m; i++) {
            if (str1[i-1] == str2[j-1]) d[i][j] = d[i - 1][j - 1];
            else d[i][j] = Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]) + 1;
        }
    }
    return d[m][n];
}

function _levenshtein_search_for_closest( _needle, _haystack, _tolerance )
{
			if ( _tolerance == null || _tolerance == "undefined" ) _tolerance = 1 ;
			if ( _needle == null || _needle == "undefined" || !is_array( _haystack ) ) return "" ;
			var _min = -1, _ret_word = "", _d = 0 ;
			for( var _i = 0 ; _i < _haystack.length ; _i++ )
			{
					 _d = levenshtein( _needle, _haystack[_i] + "" ), 10 ;
					 if ( _min == -1 || _d < _min )
           {
               _ret_word = _haystack[_i] ;
               _min = _d ;
           }
			}
			
			// very close words are taken as real candidates
			return ( _min <= _tolerance ) ? _ret_word : "" ;
}