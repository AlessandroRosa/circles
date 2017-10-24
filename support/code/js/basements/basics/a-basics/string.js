/*
    JS String Library is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

  /* framework data type
     datatype_dev : String
     datatype_public : string
     constructor1 : String(string-between-quotes)
     notes_constructor1 : built-in number datatype
     constructor2 : String()
     notes_constructor2 : built-in number datatype
     output method:
     comparison method: =
     typization method : is_string
     notes: built-in string object
     framework data type */

if ( typeof is_array != "function" ) function is_array( _a ) 		 { return _a instanceof Array ? 1 : 0 ; }
if ( typeof is_string != "function" ) function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; }
if ( typeof is_consistent_string != "function" ) function is_consistent_string( _obj ) { return is_string( _obj ) ? ( _obj.length > 0 ? 1 : 0 ) : 0 ; }
if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof is_regex != "function" ) function is_regex( _obj ) { return ( typeof _obj === "object" && _obj.test ) ? 1 : 0 ; }

String.prototype.find_substring_pos = function( s )
{
    var _pos_array = [], _pos = this.indexOf( s ) ;
    while ( _pos != -1 )
    {
       _pos_array.push( _pos );
       _pos = this.indexOf( s, _pos + 1 );
    }
    
    return _pos_array ;
}

String.prototype.split_into_chunks = function( _lengths_array )
{
		if ( is_array( _lengths_array ) )
		{
			 for( var _j = 0 ; _j < _lengths_array.length ; _j++ ) _lengths_array[_j] = Math.abs( Math.floor( _lengths_array[_j] ) ) ;
			 var _str_len = this.length, _out = [], _progress = 0 ;
			 for( _j = 0 ; _j < _lengths_array.length ; _j++ )
			 {
				  _out.push( this.substr( _progress, _lengths_array[_j] ) ) ;
				  _progress += _lengths_array[_j] ;
				  if ( _progress >= _str_len ) break ;
			 }
				 
			 return _out ;
		}
		else return this ;
}

String.prototype.html_entity_decode = function()
{ 
    var str = this.replaceAll( [ "&lsquo;", "&nbsp;", "&rsquo;", "&ldquo;", "&rdquo;", "&amp;", "&quot;",
																 "&agrave;", "&aacute;", "&acirc;", "&#259;", "&auml;", "&#314;",
																 "&Agrave;", "&Aacute;", "&Acirc;", "&#258;", "&#Auml;", "&#313;",
																 "&#263;", "&#262;", "&ccedil;", "&Ccedil;", "&egrave;", "&eacute;",
																 "&#281;", "&euml;", "&Egrave;", "&Eacute;", "&#280;", "&Euml;", "&euro;", 
																 "&igrave;", "&iacute;", "&icirc;", "&#271;", "&Igrave;", "&Iacute;",
																 "&Icirc;", "&#270;", "&lt;", "&gt;", "&#272;", "&#324;", "&#323;",
																 "&oelig;", "&ograve;", "&oacute;", "&ocirc;", "&#337;", "&#ouml;", "&Ograve;",
																 "&Oacute;", "&Ocirc;", "&#336;", "&Ouml;", "&ugrave;", "&uacute;", "&ucirc;",
																 "&uuml;", "&Ugrave;", "&Uacute;", "&Ucirc;", "&Uuml;", "&bull;", "&#39;"
															 ],
															 [ "‘", " ", "’", "“", "”", "&", "\"",
																 "à","á","â","ã","ä","å","À","Á",
																 "Â","Ã","Ä","Å","æ","Æ","ç","Ç",
																 "è","é","ê","ë","È","É","Ê","Ë","€",
																 "ì","í","î","ï","Ì","Í","Î","Ï",
																 "<",">","Ð","ñ","Ñ","¶",
																 "ò","ó","ô","õ","ö","Ò","Ó","Ô","Õ","Ö",
																 "ù","ú","û","ü","Ù","Ú","Û","Ü",
																 "•","'"
															 ]
														 );
    return str + "" ;
}

String.prototype.html_entity_encode = function()
{ 
    var str = this.replaceAll( [ "‘", " ", "’", "“", "”", "&", "\"",
																 "à","á","â","ã","ä","å","À","Á",
																 "Â","Ã","Ä","Å","æ","Æ","ç","Ç",
																 "è","é","ê","ë","È","É","Ê","Ë","€",
																 "ì","í","î","ï","Ì","Í","Î","Ï",
																 "<",">","Ð","ñ","Ñ","¶",
																 "ò","ó","ô","õ","ö","Ò","Ó","Ô","Õ","Ö",
																 "ù","ú","û","ü","Ù","Ú","Û","Ü","•","'"
															 ],
															 [ "&lsquo;", "&nbsp;", "&rsquo;", "&ldquo;", "&rdquo;", "&amp;", "&quot;",
																 "&agrave;", "&aacute;", "&acirc;", "&#259;", "&auml;", "&#314;",
																 "&Agrave;", "&Aacute;", "&Acirc;", "&#258;", "&#Auml;", "&#313;",
																 "&#263;", "&#262;", "&ccedil;", "&Ccedil;", "&egrave;", "&eacute;",
																 "&#281;", "&euml;", "&Egrave;", "&Eacute;", "&#280;", "&Euml;", "&euro;", 
																 "&igrave;", "&iacute;", "&icirc;", "&#271;", "&Igrave;", "&Iacute;",
																 "&Icirc;", "&#270;", "&lt;", "&gt;", "&#272;", "&#324;", "&#323;",
																 "&oelig;", "&ograve;", "&oacute;", "&ocirc;", "&#337;", "&#ouml;", "&Ograve;",
																 "&Oacute;", "&Ocirc;", "&#336;", "&Ouml;", "&ugrave;", "&uacute;", "&ucirc;",
																 "&uuml;", "&Ugrave;", "&Uacute;", "&Ucirc;", "&Uuml;", "&bull;", "&#39;"
															 ]
														 );
    return str + "" ;
}

String.prototype.tokenizer = function( token_length )
{
    token_length = safe_int( token_length, 0 ) ;
    if ( token_length == 0 || token_length >= this.length ) return [ this ] ;
    else
    {
        var tokensARRAY = [], token = "" ;
        for ( var _i = 0 ; _i < this.length ; _i++ )
        {
            tokensARRAY.push( this.substr( _i, token_length ) ) ;
            _i += token_length - 1 ;
        }
        
        return tokensARRAY ;
    }
}

String.prototype.reverse = function()
{
    var retSTR = "" ;
    for ( var i = ( this.length - 1 ) ; i >= 0 ; i-- ) retSTR += this.charAt( i );
    return retSTR ;
}

String.prototype.testME = function()
{
    // if one of the input reg exp is fulfilled, it returns 1 otherwise, if none fits, returns 0
    var _b_ok = 0, regularEXPR ;
    for( var _i = 0 ; _i < arguments.length ; _i++ )
    {
        regularEXPR = new RegExp( arguments[_i] ) ;
        _b_ok |= regularEXPR.test( this );
    }
    return _b_ok ? 1 : 0 ;
}

String.prototype.utf8_encode = function()
{
    string = this.replace(/\r\n/g,"\n");
    var utftext = "", c ;
    for (var n = 0; n < string.length; n++)
    {
         c = string.charCodeAt(n);
         if (c < 128) { utftext += String.fromCharCode(c); }
         else if ( ( c > 127 ) && ( c < 2048 ) )
         {
            utftext += String.fromCharCode((c>>6)|192);
            utftext += String.fromCharCode((c&63)|128);
         }
         else
         {
            utftext += String.fromCharCode((c>>12)|224);
            utftext += String.fromCharCode(((c>>6)&63)|128);
            utftext += String.fromCharCode((c&63)|128);
         }
    }

    return utftext + "" ;
}

String.prototype.utf8_decode = function()
{
    var string = "", i = 0, c = c1 = c2 = 0, utftext = this ;
    while ( i < utftext.length )
    {
        c = utftext.charCodeAt(i);
        if (c < 128)
        {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224))
        {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else
        {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }

    return string + "" ;
}

String.prototype.euclideandistancefrom = function( toSTR )
{
    var fromSTR = this ;
    if ( fromSTR.length != toSTR.length ) return -1 ;
    else
    {
        var sum = 0, fromCHARval, toCHARval ;
        for ( var i = 0; i < fromSTR.length ; i++ )
        {
            fromCHARval = fromSTR.charCodeAt( i ), toCHARval = toSTR.charCodeAt( i ) ;
            // compute distance in Euclidean metric
            sum += Math.abs( fromCHARval - toCHARval ) ;
        }
    
        return sum ;
    }
}

String.prototype.replaceAt = function(index, ch)
{
    var a = this.split("");
    a[index] = ch ;
    return a.join("") + "" ;
}

String.prototype.flipCase = function()
{
		var _str = "", _ch, _i ;
		for( _i = 0 ; _i < this.length ; _i++ )
		{
			 _ch = this.charAt( _i );
			 if ( _ch.isAlphaLower() ) _str += _ch.toUpperCase() ;
			 else if ( _ch.isAlphaUpper() ) _str += _ch.toLowerCase() ;
       else _str += _ch ;
		}

		return ( _str.trim() ) + "" ; // force to not return a String obj
}

//pads from left to right
String.prototype.lpad = function(padString, length)
{
		var str = this;
    while (str.length < length) str = padString + str;
    return str ;
}
 
//pads from right to left
String.prototype.rpad = function(padString, length)
{
		var str = this;
   	while (str.length < length) str += padString;
    return str ;
}

String.prototype.is_not_one_of = function( _input )
{
    var _test_array = is_array( _input ) ? _input : Array.prototype.slice.call(arguments, 0), _b_found = 0 ;
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found |= this == _test_array[_i] ? 1 : 0 ;
    return !_b_found ? 1 : 0 ;
}

String.prototype.is_one_of = function( _input )
{
    var _test_array = is_array( _input ) ? _input : Array.prototype.slice.call(arguments, 0), _b_found = 0 ;
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found |= this == _test_array[_i] ? 1 : 0 ;
    return _b_found ;
}

String.prototype.is_not_one_of_i = function( _input )
{
    var _test_array = is_array( _input ) ? _input : Array.prototype.slice.call(arguments, 0), _b_found = 0 ;
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found |= this.toLowerCase() == _test_array[_i].toLowerCase() ? 1 : 0 ;
    return !_b_found ? 1 : 0 ;
}

String.prototype.is_one_of_i = function( _input )
{
    var _test_array = is_array( _input ) ? _input : Array.prototype.slice.call(arguments, 0), _b_found = 0 ;
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found |= this.toLowerCase() == _test_array[_i].toLowerCase() ? 1 : 0 ;
    return _b_found ;
}

String.prototype.includes = function( _input )
{
    // return true if ALL input arguments are included inside this array
    var _test_array = is_array( _input ) ? _input : Array.prototype.slice.call(arguments, 0), _b_found = 1 ;
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found &= this.indexOf( _test_array[_i] ) != -1 ? 1 : 0 ;
    return _b_found ;
}

String.prototype.includes_one_of = function( _input )
{
    // return true if ALL input arguments are included inside this array
    var _test_array = is_array( _input ) ? _input : Array.prototype.slice.call(arguments, 0), _b_found = 0 ;
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found |= this.indexOf( _test_array[_i] ) != -1 ? 1 : 0 ;
    return _b_found ;
}

String.prototype.not_includes = function( _input ) { return !this.includes( _input ) ; }

String.prototype.includes_i = function( _input ) // case insensitive version
{
    // return true if ALL input arguments are included inside this array
    var _test_array = is_array( _input ) ? _input : Array.prototype.slice.call(arguments, 0);
    var _b_found = 1, _this_lower = this.toLowerCase();
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found &= _this_lower.indexOf( _test_array[_i].toLowerCase() ) != -1 ? 1 : 0 ;
    return _b_found ;
}

String.prototype.not_includes_i = function( _input ) { return !this.includes_i( _input ) ; }

String.prototype.one_in = function( _input )
{
    // return true if AT LEAST ONE of the input arguments are included inside this array
    var _test_array = is_array( _input ) ? _input : Array.prototype.slice.call(arguments, 0), _b_found = 0 ;
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found |= this.indexOf( _test_array[_i] ) != -1 ? 1 : 0 ;
    return _b_found ;
}

String.prototype.one_in_i = function( _input ) // case insensitive version
{
    // return true if ALL input arguments are included inside this array
    var _test_array = is_array( _input ) ? _input : Array.prototype.slice.call(arguments, 0);
    var _b_found = 0, _this_lower = this.toLowerCase();
    for( var _i = 0 ; _i < _test_array.length ; _i++ ) _b_found |= _this_lower.indexOf( _test_array[_i].toLowerCase() ) != -1 ? 1 : 0 ;
    return _b_found ;
}

String.prototype.indexed_remove = function( _start_i, _end_i )
{
    _start_i = Math.max( -1, safe_int( _start_i, -1 ) ) ;
    _end_i = Math.max( -1, safe_int( _end_i, -1 ) ) ;
    return ( _start_i > 0 && _end_i > 0 && _start_i < this.length && _end_i < this.length ) ? this.substring( 0, _start_i ) + this.substring( _end_i + 1, this.length ) : this ;
}

String.prototype.start_with = function()
{
    var _b_ok = 0 ;
		if ( !is_regex( arguments[0] ) )
    for( var _i = 0 ; _i < arguments.length ; _i++ ) _b_ok |= this.left( arguments[_i].length ) == arguments[_i] ? 1 : 0 ;
		else
		{
				var _re = arguments[0].toString().replace( /\//g, "" ) ;
				_re = ( _re.charAt(0) != "^" ) ? new RegExp( "^" + _re, "g" ) : arguments[0] ;
				_b_ok = _re.test( this ) ? 1 : 0 ;
		}
    return _b_ok ;
}

String.prototype.end_with = function()
{
    var _b_ok = 0 ;
		if ( !is_regex( arguments[0] ) )
    for( var _i = 0 ; _i < arguments.length ; _i++ ) _b_ok |= this.right( arguments[_i].length ) == arguments[_i] ? 1 : 0 ;
		else
		{
				var _re = arguments[0].toString().replace( /\//g, "" ) ;
				_re = ( _re.charAt(_re.length-1) != "$" ) ? new RegExp( _re+"$", "g" ) : arguments[0] ;
				_b_ok = _re.test( this ) ? 1 : 0 ;
		}
    return _b_ok ;
}

String.prototype.start_with_i = function()
{
    var _b_ok = 0 ;
		if ( !is_regex( arguments[0] ) )
    for( var _i = 0 ; _i < arguments.length ; _i++ ) _b_ok |= this.left( arguments[_i].length ).stricmp(arguments[_i]) ? 1 : 0 ;
		else
		{
				var _re = arguments[0].toString().replace( /\//g, "" ) ;
				_re = ( _re.charAt(0) != "^" ) ? new RegExp( "^" + _re, "gi" ) : arguments[0] ;
				_b_ok = _re.test( this ) ? 1 : 0 ;
		}
    return _b_ok ;
}

String.prototype.end_with_i = function()
{
    var _b_ok = 0 ;
		if ( !is_regex( arguments[0] ) )
    for( var _i = 0 ; _i < arguments.length ; _i++ ) _b_ok |= this.right( arguments[_i].length ).stricmp(arguments[_i]) ? 1 : 0 ;
		else
		{
				var _re = arguments[0].toString().replace( /\//g, "" ) ;
				_re = ( _re.charAt(_re.length-1) != "$" ) ? new RegExp( _re+"$", "gi" ) : arguments[0] ;
				_b_ok = _re.test( this ) ? 1 : 0 ;
		}
    return _b_ok ;
}

String.prototype.not_start_with = function() { return !this.start_with.apply( this, arguments ); }
String.prototype.not_start_with_i = function() { return !this.start_with_i.apply( this, arguments ); }
String.prototype.not_end_with = function() { return !this.end_with.apply( this, arguments ); }
String.prototype.not_end_with_i = function() { return !this.end_with_i.apply( this, arguments ); }


String.prototype.matching_positions = function( _expr, _include_string_match, _case_sensitive, _whole_words, _multiline )
{
    var _re ;
		if ( is_regex( _expr ) ) _re = new RegExp( _expr, _match_pattern );
		else if ( is_string( _expr ) )
		{
		    _case_sensitive = safe_int( _case_sensitive, 0 ) ;
		    _whole_words = safe_int( _whole_words, 0 ) ;
		    _multiline = safe_int( _multiline, 0 ) ;
		    var _match_pattern = "g"+(_case_sensitive?"i":"")+(_multiline?"m":"") ;
		    var _bound = _whole_words ? "\\b" : "" ;
				_re = new RegExp( _bound+_expr+_bound, _match_pattern );
		}
		else return -1 ;

    var _pos = [], _chunk ;
    while( true )
    {
       _chunk = _re.exec( this ) ;
       if ( _chunk == null ) break ;
       if ( _include_string_match )
       {
			 		_pos.push( [ _chunk['index'], _chunk['index'] + _chunk[0].length,
											 this.substring( _chunk['index'], _chunk['index'] + _chunk[0].length )
										 ] );
			 }
       else _pos.push( _chunk['index'] ) ;
       _re.lastIndex = _chunk['index']+1 ;
    }
    return _pos ;
}

String.prototype.match_and_replace = function( _reg_exp, _replace_with_str )
{
    var _ret = "", _token = "", _pos_array = this.matching_positions( _reg_exp, 0, 0, 0 ) ;
    for( var _i = 0 ; _i < _pos_array.length ; _i++ )
    {
       _curr_pos = _pos_array[_i] ;
       if ( _i == 0 ) _token = this.substring( 0, _curr_pos ) + _replace_with_str ;
       else
       {
           _prev_pos = _pos_array[_i-1] ;
           _token = this.substring( _prev_pos+1, _curr_pos ) + _replace_with_str ;
       }
       _ret += _token ;
    }

    _token = this.substring( _pos_array[_i-1]+1, this.length ) ;
    _ret += _token ;
    return _ret ;
}

String.prototype.replaceAll = function( _tok1, _tok2, ignorecase)
{
    if ( !is_array( _tok1 ) ) _tok1 = [ _tok1 ] ;
    if ( is_array( _tok2 ) && _tok1.length != _tok2.length ) return this ;
    else
    {
        var _str = this, _t2 ;
        for( var _s = 0 ; _s < _tok1.length ; _s++ )
        {
            _t2 = is_array( _tok2 ) ? _tok2[_s] : _tok2 ;
            _str = _str.replace(new RegExp(_tok1[_s].replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignorecase?"gi":"g")),(typeof(_t2)=="string")?_t2.replace(/\$/g,"$$$$"):_t2);
        }
        return _str ;
    }
}

String.prototype.addslashes = function() { return this.replace( /[\\"']/g, '\\$&' ).replace(/\"/g,'\\"') ; }
String.prototype.stripslashes = function() { return this.replace(/\\'/g,'\'').replace(/\\"/g,'"'); }
String.prototype.strip_tags = function()
{
    var _tags = [], _tag = "" ;
    for( var _a = 0 ; _a < arguments.length ; _a++ )
    {
        _tag = arguments[_a].replace( /<|>/g, '' ).trim() ;
        if ( arguments[_a].length > 0 ) _tags.push( _tag, "/"+_tag );
    }

    if ( _tags.length == 0 ) return this.replace( /<(\s*\/?)[^>]+>/g, "" ) ;
    else
    {
        var _re = new RegExp( "<(?!("+_tags.join("|")+")\s*\/?)[^>]+>", "g" );
        return this.replace( _re, '' );
    }
    
    return this.replace( /(<([^>]+)>)/ig, '') ;
}
String.prototype.count = function( _search )
{
		var _cnt = 0 ;
		if ( is_array( _search ) )
		{
				for( var _s = 0 ; _s < _search.length ; _s++ )
				_cnt += this.indexOf( _search[_s] ) != -1 ? ( this.split( _search[_s] ) ).length - 1 : 0 ;
		}
		else _cnt = this.indexOf( _search ) != -1 ? ( this.split( _search ) ).length - 1 : 0 ;
		return _cnt ;
}
String.prototype.strip_tags = function() { return this.replace( /(<([^>]+)>)/ig, '') ; }
String.prototype.stripdoublespaces = function() { return this.replace( /\s+/g, " " ); }
String.prototype.encode_utf8 = function() { return unescape( encodeURIComponent( this ) ); }
String.prototype.decode_utf8 = function() { return decodeURIComponent( escape( this ) ); }
String.prototype.embedQuotes = function() { return this.replaceAll( "\"", "\\\"" ).replaceAll( "'", "\'" ) ; }
String.prototype.onlyDigits = function() { return /^[0-9]{1,}$/.test( this ) ? 1 : 0 ; }
String.prototype.isNumber = function() { return /^[0-9\.\,\+\-]{1,}$/.test( this ) ? 1 : 0 ; }
String.prototype.isInteger = function() { return /^[0-9\+\-]{1,}$/.test( this ) ? 1 : 0 ; }
String.prototype.isNonInteger = function() { return ( this.isNumber() && !this.isInteger() ) ? 1 : 0 ; }
String.prototype.isAlpha = function() { return /^[a-zA-z]{1,}$/.test( this ) ? 1 : 0 ; }
String.prototype.isAlphaLower = function() { return /^[a-z]{1,}$/.test( this ) ? 1 : 0 ; }
String.prototype.isAlphaUpper = function() { return /^[A-Z]{1,}$/.test( this ) ? 1 : 0 ; }
String.prototype.isAlphanumeric = function() { return /^[a-zA-Z0-9]{1,}$/.test( this ) ? 1 : 0 ; }

String.prototype.accents_encode = function() { return this.replaceAll( [ "à", "è", "é", "ì", "ò", "ù" ], [ "a'", "e'", "e'", "i'", "o'", "u'" ] ); }
String.prototype.accents_decode = function() { return this.replaceAll( [ "a'", "e'", "e'", "i'", "o'", "u'" ], [ "à", "è", "é", "ì", "ò", "ù" ] ); }
String.prototype.left = function( n ) { return this.slice( 0, n ) } ;
String.prototype.right = function( n ) { return this.slice( this.length - n ) } ;
String.prototype.slide_back = function() { return ( this.slice(1) ).concat( this.slice( 0,1 ) ) ; }
String.prototype.slide_forward = function() { return ( this.slice(this.length-1).concat( this.slice(0,this.length-1) ) ) ; }
String.prototype.trim = function()  { return this.replace(/^\s+|\s+$/g,""); }
String.prototype.ltrim = function() { return this.replace(/^\s+/,""); }
String.prototype.rtrim = function() { return this.replace(/\s+$/,""); }

String.prototype.intME = function() { return safe_int( this, 0 ); }
String.prototype.floatME = function() { return safe_float( this, 0 ); }
String.prototype.percentage_encode = function() { return this.replaceAll( "%", "@perc@" ); }
String.prototype.percentage_decode = function() { return this.replaceAll( "@perc@", "%" ); }
String.prototype.firstchar = function() { return this.charAt(0) ; }
String.prototype.lastchar = function() { return this.charAt( this.length - 1 ) ; }
String.prototype.ucfirst = function() { return this.charAt(0).toUpperCase() + this.substr( 1, this.length ) ; }
String.prototype.is_equal_to = function( token2 ) { return this.strcmp( token2 ) ; }
String.prototype.repeat = function( num ) 		{ return new Array( ( isNaN( num ) ) ? 1 : ++num ).join( this ) ; }
String.prototype.fromURLtoSTRING = function() { return this.replaceAll( "&", "%46" ) ; }
String.prototype.fromSTRINGtoURL = function() { return this.replaceAll( "%46", "&" ) ; return s ; }
String.prototype.get_between = function(start_index, end_index) { return this.substring(start_index,end_index+1); };
String.prototype.replace_between = function(start, end, what) { return this.substring(0,start) + what + this.substring(end+1,this.length+1); };
String.prototype.set_char_at = function( _index , _chr )
{
		if( _index > this.length-1 ) return str ;
		return this.substr( 0,_index ) + _chr + this.substr( _index + 1 );
}
String.prototype.urlencode = function() { return encodeURIComponent( encodeURIComponent( this ) ) ; }
String.prototype.urldecode = function() { return decodeURIComponent( decodeURIComponent( this ) ) ; }
String.prototype.omits = function( _input ) { return !this.includes( _input ); }
String.prototype.omits_i = function( _input ) { return !this.includes_i( _input ); }

// case sensitive string comparison
String.prototype.strcmp = function( token2 ) { return this == ( token2 + "" ) ? 1 : 0 ; }
String.prototype.notstrcmp = function( token2 ) { return this != ( token2 + "" ) ? 1 : 0 ; }
// case insensitive string comparison
String.prototype.stricmp = function( token2 ) { return this.toLowerCase() == ( token2 + "" ).toLowerCase() ? 1 : 0 ; }
String.prototype.notstricmp = function( token2 ) { return this.toLowerCase() != ( token2 + "" ).toLowerCase() ? 1 : 0 ; }

String.prototype.run_forward_up_to = function( _stopper, _offset, _include_stopper, _stop_at_nth_match )
{
		_offset = safe_int( _offset, 0 ), _include_stopper = safe_int( _include_stopper, 0 ), _stop_at_nth_match = safe_int( _stop_at_nth_match, 1 ) ;
		var _start_from = ( _offset < 0 || this.length < _offset ) ? 0 : _offset ;
		var _str = "", _runner, _ret_str = "", _cnt_match = 0 ;
    if ( is_regex( _stopper ) )
    {
         _search_token = _stopper.source ;
         _stopper = new RegExp( _stopper.source, "gm" );
    }

    for( _runner = _start_from ; _runner < this.length ; _runner++ )
    {
         _ret_str += this.charAt( _runner );
         if ( is_string( _stopper ) )
         {
             if ( _ret_str.indexOf( _stopper ) != -1 )
             {
                 if ( !_include_stopper ) _runner -= _stopper.length ;
                 break ;
             }
         }
         else if ( is_regex( _stopper ) )
         {
             _match_ret = _stopper.exec( _ret_str );
             if ( _match_ret != null )
             {
								 _cnt_match++ ;
                 if ( _match_ret['index'] >= 0 )
                 {
                    if ( !_include_stopper ) _runner -= _match_ret[0].length ;
                    if ( _cnt_match == _stop_at_nth_match ) break ;
                 }
             }
         }
    }

    _str = _runner >= _start_from ? this.get_between( _start_from, _runner ) : "" ;
		return [ _str, _start_from, _runner ] ;
}

String.prototype.run_backward_up_to = function( _stopper, _from, _include_stopper, _stop_at_nth_match )
{
		_from = Math.max( 0, safe_int( _from, 0 ) ), _include_stopper = safe_int( _include_stopper, 0 ), _stop_at_nth_match = safe_int( _stop_at_nth_match, 1 ) ;
		var _str = "", _runner, _offset = 0, _ret_str = "", _cnt_match = 0 ;
		var _b_is_regex = is_regex( _stopper ), _b_is_string = is_string( _stopper ) ;
    if ( _b_is_regex )
    {
        _search_token = _stopper.source ;
        _stopper = new RegExp( _stopper.source, "gm" );
    }

    for( _runner = _from ; _runner >= 0 ; _runner-- )
    {
        _ret_str = this.charAt( _runner ) + _ret_str ;
        if ( _b_is_string )
        {
            if ( _ret_str.indexOf( _stopper ) == 0 )
            {
                if ( !_include_stopper ) _runner += _stopper.length ;
                break ;
            }
        }
        else if ( _b_is_regex )
        {
						_match_ret = _stopper.exec( _ret_str );
            if ( _match_ret != null )
            {
            		_cnt_match++ ;
                if ( _match_ret['index'] == 0 )
                {
                   if ( !_include_stopper ) _runner += _match_ret[0].length ;
                   if ( _cnt_match == _stop_at_nth_match ) break ;
                }
            }
        }
    }

    _str = ( _runner <= _from - 1 ) ? this.get_between( _runner, _from ) : "" ;
		return [ _str, _runner, _from ] ;
}