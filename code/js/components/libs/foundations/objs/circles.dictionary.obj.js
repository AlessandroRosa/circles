var _DICTIONARY_NONE_PROCESS = 0 ;
var _DICTIONARY_PROGRESSIVE_PROCESS = 1 ;
var _DICTIONARY_AUTOMATON_PROCESS = 2 ;
var _DICTIONARY_NOT_REDUCED_WORDS = 0;
var _DICTIONARY_REDUCED_WORDS = 1 ;
var _DICTIONARY_BUILD_MODE_ALL = 1 ;
var _DICTIONARY_BUILD_MODE_LONGEST = 2 ;
var _DICTIONARY_ENABLE_REPETITION = 1 ;
var _DICTIONARY_DISABLE_REPETITION = 0 ;
if ( typeof UNDEF !== "number" ) var UNDEF = -1 ;

if ( typeof is_array != "function" ) function is_array( _a ) { return _a instanceof Array ? 1 : 0 ; }
if ( typeof is_string != "function" ) { function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; } }

if ( typeof safe_int != "function" )
{
    function safe_int( _val, _set_if_nan )
    {
        _val = parseInt( _val, 10 );
        return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ;
    }
}

if ( typeof safe_size != "function" )
{
		function safe_size( _obj, _ret_val )
		{
		    if ( _ret_val == "undefined" || _ret_val == null ) _ret_val = 0 ;
		    if ( _obj == null || _obj == "undefined" ) return _ret_val ;
		    else if ( typeof _obj == "string" || is_string( _obj ) || is_array( _obj ) || _obj instanceof Object ) return _obj.length ;
		    else return _ret_val ;
		}
}

if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ).trim() ; }

function dictionary()
{
    this.max_depth = 2 ;
    this.construction_mode = _DICTIONARY_BUILD_MODE_ALL ;
    this.word_type = _DICTIONARY_REDUCED_WORDS ;
    this.process = _DICTIONARY_PROGRESSIVE_PROCESS ;
    this.repetition = _DICTIONARY_DISABLE_REPETITION ;
    this.type = "dictionary" ;
    this.err = 0 ;
    this.error_log = [];

    this.MAPSarray = [];
    this.INVERSESarray = [];
    this.GROUParray = [];
    this.dictionary_array = [];
    this.crash_words_array = [];

    // internal use vars
		this.symbol_check_repeat_token = "" ;
    this.inverse = "" ;
    this.symbol_check_inverse = "" ;
    this.token = "";
    this.next_level = 0 ;
    this.running = 0 ;

    // sliced dictionary vars
    this.sliced_dictionary_upper_bound = Math.pow( 2, 13 );
    this.sliced_dictionary = [];
    this.sliced_dict_tmp_array = [];
    this.main_dictionary_read_runner = 0 ;
    this.token_dictionary_read_index = 0 ;

    this.automaton_table = [] ;
    this.alphabet = [ "a", "b", "A", "B" ] ; // default automaton alphabet fits for 2-gens groups

    this.caps_letters = [] ;
    this.small_letters = [] ;

    for( var ch = 65 ; ch <= 90 ; ch++ ) this.caps_letters.push( String.fromCharCode( ch ) );
    for( var ch = 97 ; ch <= 122 ; ch++ ) this.small_letters.push( String.fromCharCode( ch ) );

		// default automaton fits for punctured tori (i.e. free groups with reduced words)
		this.automaton_table[ "e" ] = [ "a", "b", "A", "B" ] ;
		this.automaton_table[ "a" ] = [ "a", "b", "e", "B" ] ;
		this.automaton_table[ "b" ] = [ "a", "b", "A", "e" ] ;
		this.automaton_table[ "A" ] = [ "e", "b", "A", "B" ] ;
		this.automaton_table[ "B" ] = [ "a", "e", "A", "B" ] ;
}

dictionary.prototype.error_log_flush = function()     { this.error_log = [] ; }
dictionary.prototype.error_log_rec = function( _msg ) { this.error_log.push( _msg ); }
dictionary.prototype.error_log_get = function()       { return this.error_log.clone(); }

dictionary.prototype.reset = function()
{
    this.max_depth = 2 ;
    this.construction_mode = _DICTIONARY_BUILD_MODE_ALL ;
    this.word_type = _DICTIONARY_REDUCED_WORDS ;
    this.process = _DICTIONARY_PROGRESSIVE_PROCESS ;
    this.repetition = _DICTIONARY_DISABLE_REPETITION ;
    this.type = "dictionary" ;
    this.err = 0 ;

    this.MAPSarray = [];
    this.INVERSESarray = [];
    this.GROUParray = [];
    this.dictionary_array = [];
    this.crash_words_array = [];

    // internal use vars
		this.symbol_check_repeat_token = "" ;
    this.inverse = "" ;
    this.symbol_check_inverse = "" ;
    this.token = "";
    this.next_level = 0 ;
    this.running = 0 ;

    this.sliced_dictionary = [];
    this.sliced_dict_tmp_array = [];
    this.main_dictionary_read_runner = 0 ;
    this.token_dictionary_read_index = 0 ;

    this.automaton_table = [] ;
    this.automaton_states = [] ;
    this.automaton_index_version = [] ;
    this.alphabet = [ "a", "b", "A", "B" ] ; // default alphabet fits for 2-gens groups

		// default automaton is for punctured tori (i.e. free groups with reduced words)
		this.automaton_table[ "e" ] = [ "a", "b", "A", "B" ] ;
		this.automaton_table[ "a" ] = [ "a", "b", "e", "B" ] ;
		this.automaton_table[ "b" ] = [ "a", "b", "A", "e" ] ;
		this.automaton_table[ "A" ] = [ "e", "b", "A", "B" ] ;
		this.automaton_table[ "B" ] = [ "a", "e", "A", "B" ] ;
}

dictionary.prototype.init_from_obj = function( dict_obj )
{
    this.max_depth = dict_obj.max_depth ;
    this.construction_mode = dict_obj.construction_mode ; 
    this.word_type = dict_obj.word_type ;
    this.process = dict_obj.process ;
    this.repetition = dict_obj.repetition ;
    this.type = dict_obj.type ;

    this.MAPSarray = dict_obj.MAPSarray.clone(); 
    this.INVERSESarray = dict_obj.INVERSESarray.clone(); 
    this.GROUParray = dict_obj.GROUParray.clone(); 
    this.dictionary_array = dict_obj.dictionary_array.clone();
    this.crash_words_array = dict_obj.crash_words_array.clone();

		this.sliced_dictionary_upper_bound = dict_obj.sliced_dictionary_upper_bound ;
    this.sliced_dictionary = dict_obj.sliced_dictionary ;
    this.sliced_dict_tmp_array = dict_obj.sliced_dict_tmp_array ;
    this.main_dictionary_read_runner = dict_obj.main_dictionary_read_runner ;
    this.token_dictionary_read_index = dict_obj.token_dictionary_read_index ;

    this.automaton_table = dict_obj.automaton_table.clone_associative();
    this.alphabet = dict_obj.alphabet.clone();
    this.automaton_states = dict_obj.automaton_states ;
    this.automaton_index_version = dict_obj.automaton_index_version ;
}

dictionary.prototype.stop = function()                		 { this.running = 0 ; }
dictionary.prototype.start = function()                		 { this.running = 1 ; }
dictionary.prototype.add_word = function( w )              { this.dictionary_array.push( w ); }
dictionary.prototype.get_word = function( i )              { return this.dictionary_array[i] ; }
dictionary.prototype.set_repetition = function( r )        { this.repetition = r ; }
dictionary.prototype.get_repetition = function()           { return this.repetition ; }
dictionary.prototype.put_dictionary = function( _dict )    { if ( is_array( _dict ) ) this.sliced_dictionary = _dict.clone(); }
dictionary.prototype.get_dictionary = function()           { return this.sliced_dictionary.clone(); }
dictionary.prototype.set_process = function( p )           { this.process = safe_int( p, _DICTIONARY_NONE_PROCESS ) ; }
dictionary.prototype.get_process = function()              { return this.process ; }
dictionary.prototype.set_word_type = function( wt )        { this.word_type = wt ; }
dictionary.prototype.get_word_type = function()            { return this.word_type ; }
dictionary.prototype.set_max_depth = function( _d )        { this.max_depth = Math.max( 0, safe_int( _d, 0 ) ) ; }
dictionary.prototype.get_max_depth = function()            { return this.max_depth ; }
dictionary.prototype.get_crash_words = function()          { return this.crash_words_array.clone(); }
dictionary.prototype.set_crash_words = function( _cs_array )
{
    if ( is_array( _cs_array ) ) this.crash_words_array = _cs_array.clone();
    else error_log_rec( "crash word input is not of Array type" );
}

dictionary.prototype.set_construction_mode = function( cm ) { this.construction_mode = cm ; }
dictionary.prototype.get_construction_mode = function()      { return this.construction_mode ; }
dictionary.prototype.get_dictionary = function()             { return this.dictionary_array.clone(); }
dictionary.prototype.get_dictionary_size = function()        { return this.dictionary_array.length ; }
dictionary.prototype.get_alphabet = function()               { return this.alphabet.clone(); }
dictionary.prototype.set_alphabet = function( _alphabet, _compute_inv_symbol )
{
		_compute_inv_symbol = safe_int( _compute_inv_symbol, 0 );
    this.GROUParray = is_array( _alphabet ) ? _alphabet.clone() : null ;
    this.alphabet = is_array( _alphabet ) ? _alphabet.clone() : null ;
		if ( is_array( this.GROUParray ) )
		{
				 this.MAPSarray = [];
				 this.INVERSESarray = [];
         var _symbol ;
				 for( var _i = 0 ; _i < this.GROUParray.length ; _i++ )
				 {
				 			_symbol = ( this.GROUParray[_i] + "").trim();
				 			if ( _symbol.length > 0 ) this.add_symbol( _symbol, _compute_inv_symbol ? _symbol.reverse().flipCase() : "" );
				 }
		}
    else error_log_rec( "alphabet input is not of Array type" );
}

dictionary.prototype.alphabet_check = function( _word )
{
    if ( is_string( _word ) )
    {
        var _b_go = 1, _wl = safe_size( this.alphabet, 0 );
        for( var _i = 0 ; _i < _wl ; _i++ )
        {
            if ( !( this.alphabet.includes( _word.charAt( _i ) ) ) )
            {
               _b_go = 0 ;
               break ;
            }
        }

        return _b_go ;
    }
    else
    {
        error_log_rec( "alphabet check failure: input word is null" );
        return -1 ;
    }
}

dictionary.prototype.flush_crash_words = function()   { this.crash_words_array = [] ; }
dictionary.prototype.add_crash_word = function( _crash_word )
{
    if ( is_string( _crash_word ) )
    {
        _crash_word = safe_string( _crash_word, "" ).trim();
        if ( !( this.crash_words_array.includes( _crash_word ) ) && _crash_word.length > 0 )
        {
            this.crash_words_array.push( _crash_word );
            return 1 ;
        }
        else return 0 ;
    }
    else
    {
        error_log_rec( "input crash word is null" );
        return -1 ;
    }
}

dictionary.prototype.remove_crash_word = function( _crash_word )
{
    if ( is_string( _crash_word ) )
    {
        _crash_word = _crash_word.trim();
        if ( this.crash_words_array.includes( _crash_word ) && _crash_word.length > 0 )
        {
            this.crash_words_array.delete_entry( _crash_word );
            return 1 ;
        }
        else return 0 ;
    }
    else
    {
        error_log_rec( "input crash word is null" );
        return -1 ;
    }
}

dictionary.prototype.check_crash_word = function( _input_string )
{
    var _crash = 0, _w, _end = "" ;
    for( _w = 0 ; _w < this.crash_words_array.length ; _w++ )
    {
        _end = this.crash_words_array[_w] ;
        if( _input_string.right( _end.length ) == _end )
        {
            _crash = 1 ;
            break ;
        }
    }

    return _crash ;
}

dictionary.prototype.flush = function()
{
    this.MAPSarray = [];
    this.INVERSESarray = [];
    this.GROUParray = [];
    this.dictionary_array = [];
    this.crash_words_array = [] ;
}

dictionary.prototype.add_symbol = function( l, inv_l )
{
    if ( l.length > 0 && !( this.MAPSarray.includes( l ) ) ) this.MAPSarray.push( l );
    if ( inv_l.length > 0 && !( this.INVERSESarray.includes( inv_l ) ) ) this.INVERSESarray.push( inv_l );
}

dictionary.prototype.remove_symbol = function()
{
		this.err = 0 ;
    var _m_length = safe_size( this.MAPSarray, 0 );
    if ( _m_length == 0 )
		{
				this.err = 1 ;
        error_log_rec( "input maps array is empty or missing" );
				return 0 ;
		}
    else
    {
        var _a, _i ;
        for( _a = 0 ; _a < arguments.length ; _a++ )
        {
    		    for( _i = 0 ; _i < _m_length ; _i++ )
    		    {
    		         if ( this.MAPSarray[i] == arguments[_a] )
    		         {
    		              this.MAPSarray.remove( _i, _i );
                      _m_length = this.MAPSarray.length ;
                      _i = -1 ;
    		              break ;
    		         }
    		    }
        }

		    if ( this.MAPSarray.length == _m_length - 1 )
		    {
						 this.err = 0 ;
						 return 1 ;
				}
				else
				{
             error_log_rec( "error while removing crash word" );
						 this.err = 1 ;
						 return 0 ;
				}
		}
}

// AUTOMATON MEMBERS

dictionary.prototype.automaton_punctured_torus = function( _n_gens )
{
		var _caps = this.caps_letters.subset( _n_gens );
		var _small = this.small_letters.subset( _n_gens );
		var _full = _caps.concat( _small ), _j, _k, _automaton = [] ;
		for( _j = 0 ; _j < _full.length ; _j++ )
		{
				_automaton[ _full[_j] ] = [] ;
				for( _k = 0 ; _k < _full.length ; _k++ )
 			  _automaton[ _full[_j] ].push( _full[_j].reverse().flipCase().strcmp( _full[_k] ) ? "e" : _full[_k] );
		}

		return _automaton.clone();
}

dictionary.prototype.automaton_keys_count = function() { return this.automaton_table.size_associative(); }
dictionary.prototype.automaton_set_entry = function( _key, _array_of_vals ) { this.automaton_table[ _key ] = _array_of_vals ; }

dictionary.prototype.automaton_table_flush = function()
{
    if ( is_array( this.automaton_table ) )
    {
         this.automaton_table.flush_associative();
         return this.automaton_table.size_associative() == 0 ? 1 : 0 ;
    }
    else
    {
        error_log_rec( "error while removing crash word" );
        return 0 ;
    }
}

dictionary.prototype.automaton_table_read = function( _alphabet, _automaton_table )
{
		if ( is_array( _automaton_table ) && is_array( _alphabet ) )
		{
				this.automaton_table = _automaton_table.clone_associative();
				this.automaton_states = _automaton_table.keys_associative();
				this.alphabet = _alphabet.clone();
				if ( this.automaton_states.length == 0 || _alphabet.length == 0 ) return 0 ;

			  var _row, _state, _a, _j, _s ;
				this.automaton_index_version = [] ;

				this.automaton_index_version[ "e" ] = [] ;
				if ( !is_array( this.automaton_table[ "e" ] ) ) this.automaton_table[ "e" ] = [] ;
				for( _a = 0 ; _a < this.alphabet.length ; _a++ )
				{
						 this.automaton_table[ "e" ].push( this.alphabet[ _a ] );
						 this.automaton_index_version[ "e" ].push( _a );
				}

			  for( _s = 0 ; _s < this.automaton_states.length ; _s++ )
				{
						_state = this.automaton_states[_s], _row = _automaton_table[ _state ] ;
						this.automaton_index_version[ this.automaton_states[_s] ] = [] ;
					  if ( is_array( _row ) )
					  {
							 if ( _row.length > 0 )
							 {
							 			for( _j = 0 ; _j < _row.length ; _j++ )
									  this.automaton_index_version[ this.automaton_states[_s] ].push( this.automaton_states.indexOf( _row[_j] ) );
							 }
						}
				}

 			  return 1 ;
		}
		else
    {
        if ( !is_array( _automaton_table ) ) error_log_rec( "automaton table input is not of array type" );
        if ( !is_array( _alphabet ) ) error_log_rec( "alphabet input is not of array type" );
        return 0 ;
    }
}

dictionary.prototype.automaton_get_indexed_word_path = function( _input_word )
{
		var _index_array = [] ;
		_input_word = safe_string( _input_word, "" ).trim();
		var _w_len = _input_word.length, _w, _state, _indexed_char, _last_state ;
		// encode alphabet in the indexed version
		var _alphabet_index_version = [] ;
		for( var _a = 0 ; _a < this.alphabet.length ; _a++ ) _alphabet_index_version[ this.alphabet[_a] ] = _a ;

		for( _w = 0 ; _w < _w_len ; _w++ )
		{
				_state = _input_word[_w] ;
				_index_array.push( this.automaton_index_version[ _w == 0 ? "e" : _last_state ][ _alphabet_index_version[ _state ] ] );
				_last_state = this.automaton_table[ _w == 0 ? "e" : _last_state ][ _alphabet_index_version[ _state ] ] ;
		}

		return _index_array.clone();
}

// PROCESSING

dictionary.prototype.create_rules = function()
{
		this.err = 0 ;
    // merge maps and inverse array
    var _m_length = safe_size( this.MAPSarray, 0 );
    if ( _m_length == 0 )
		{
				this.err = 2 ;
        error_log_rec( "maps input is not of array type or missing" );
				return 0 ;
		}
    else
    {
		    var L, I ;
		    for( var i = 0 ; i < _m_length ; i++ )
		    {
		        L = this.MAPSarray[i], I = this.INVERSESarray[i] ;
		        if ( !( this.GROUParray.includes( L ) ) && is_string( L ) ) this.GROUParray.push( L );
		        if ( !( this.GROUParray.includes( I ) ) && is_string( I ) ) this.GROUParray.push( I );
		        if ( this.repetition == _DICTIONARY_DISABLE_REPETITION && is_string( L ) ) this.add_crash_word( L + L );
						if ( this.word_type == _DICTIONARY_REDUCED_WORDS && is_string( L ) && is_string( I ) ) this.add_crash_word( L + I );
		    }
		}
}

dictionary.prototype.create_dictionary = function()
{
    if ( this.err == 0 )
    {
		    this.dictionary_array = [];
        switch( this.get_process() )
        {
             case _DICTIONARY_PROGRESSIVE_PROCESS:
             if ( is_string( arguments[0] ) && this.construction_mode == _DICTIONARY_BUILD_MODE_ALL )
             this.dictionary_array.push( arguments[0] );
             this.progressive_dict_generation();
             break ;
             case _DICTIONARY_AUTOMATON_PROCESS: this.automaton_dict_generation(); break ;
             default: break ;
        }

				return 1 ;    
		}
		else
    {
        error_log_rec( "dictionary can't be created due to a previous error detection" );
        return 0 ;
    }
}

dictionary.prototype.automaton_dict_generation = function( _alphabet, _max_level )
{
    if ( !is_array( _alphabet ) ) _alphabet = this.get_alphabet();
    if ( _alphabet.length == 0 ) // attempt to extract from current automaton
    {
         if ( this.automaton_table.size_associative() > 0 )
         {
             _alphabet = this.automaton_table.keys_associative();
             _alphabet.delete_entry( "e" );
             this.alphabet = _alphabet.clone();
         }
    }
    
    _max_level = Math.max( 0, safe_int( _max_level, 0 ) );
    if ( _alphabet.length == 0 || this.automaton_table.size_associative() == 0 ) this.dictionary_array.flush();
    else
    {
				 var _alphabet_index_version = [], _depth = _max_level > 0 ? _max_level : this.get_max_depth(), _a, _i, _r ;
         this.dictionary_array = [], this.sliced_dictionary = [] ;
         this.sliced_dict_tmp_array = [] ;
         // first, init the dictionary through the input alphabet
         for( var _i = 0 ; _i < _alphabet.length ; _i++ )
         {
             this.dictionary_array.push( _alphabet[_i] );
             _alphabet_index_version[ _alphabet[_i] ] = _i ;
         }

         var _state, _tmp_state_array = [], _state_array = [] ;
         for( var _d = 0 ; _d < this.dictionary_array.length ; _d++ )
         {
             this.sliced_dict_tmp_array.push( this.dictionary_array[_d] );
             _state_array.push( [ this.dictionary_array[_d], // current word (standard dictionary)
						 											this.dictionary_array[_d], // current automaton state
																	this.dictionary_array[_d] ] // current extended word (after automaton table transformation)
															);
         }

				 var STEPcounter = 1, startINDEX = 0, endINDEX = safe_size( this.dictionary_array, 0 ) - 1 ;
         var WORD = "", EXT_WORD = "", str1 = "", OLDlevelCOUNT = safe_size( this.dictionary_array, 0 ), NEWlevelCOUNT = 0 ;

				 this.running = 1 ;
				 // create a standard dictionary and then remap each dictionary word through the input automaton table
         outer_loop:
         for( _i = startINDEX ; _i <= endINDEX ; _i++ )
         {
					   WORD = _state_array[_i][0], _state = _state_array[_i][1], EXT_WORD = _state_array[_i][2] ;
             inner_loop:
             for( _a = 0 ; _a < _alphabet.length ; _a++ )
             {
                 if ( this.running == 0 ) break inner_loop ;
								 str1 = WORD + _alphabet[_a] ; // simply append symbol as in the standard formal construction for the new extended word
                 if ( !( this.automaton_table[ ""+_state ][ _a ].strcmp( "e" ) ) )
                 {
                     if ( str1.length <= _depth ) // record the last standard word and related state in the automaton
                     {
												 _tmp_state_array.push( [ str1,
												 													this.automaton_table[ ""+_state ][ _a ],
																									EXT_WORD + this.automaton_table[ ""+_state ][ _a ]
																								] );
										 }

                     if ( ( this.construction_mode == _DICTIONARY_BUILD_MODE_LONGEST && str1.length == _depth )
                          ||
                          ( this.construction_mode == _DICTIONARY_BUILD_MODE_ALL && str1.length <= _depth ) )
                     {
                     		// pick up the word, translate
                        NEWlevelCOUNT++ ;
                        this.sliced_dict_tmp_array.push( EXT_WORD + this.automaton_table[ ""+_state ][ _a ] );
                        if ( this.sliced_dict_tmp_array.length == this.sliced_dictionary_upper_bound )
                        {
                             this.sliced_dictionary.push( this.sliced_dict_tmp_array.clone() );
                             this.sliced_dict_tmp_array = [];
                        }
                     }
                 }
             }

             if ( this.running == 0 ) break ;

             if ( _i == endINDEX )
             {
                 STEPcounter++ ;
                 startINDEX = 0, endINDEX = _tmp_state_array.length - 1 ;
                 _i = -1 ;
                 OLDlevelCOUNT = NEWlevelCOUNT, NEWlevelCOUNT = 0 ;
                 _state_array = _tmp_state_array.clone(); // rewind arrays ...
                 _tmp_state_array = [] ; // ... for the next step
                 if ( STEPcounter > _depth ) break ;
             }
         }

         if( safe_size( this.sliced_dict_tmp_array, 0 ) > 0 )
         this.sliced_dictionary.push( this.sliced_dict_tmp_array.clone() );

         this.dictionary_array = [] ;
    }
}

dictionary.prototype.progressive_dict_generation = function()
{
    var _alphabet = this.get_alphabet();
    if ( _alphabet.length == 0 ) this.dictionary_array = [];
    else
    {
         var WORD = "", _str1 = "", _add_counter = 0 ;
		     var depth = this.get_max_depth(), _i, _a, _r ;
         this.dictionary_array = [], this.sliced_dictionary = [] ;
         this.sliced_dict_tmp_array = [] ;
         // first, add the original alphabet
         for( _i = 0 ; _i < _alphabet.length ; _i++ )
         {
             this.dictionary_array.push( _alphabet[_i] );
             _add_counter++ ;
             if ( ( this.construction_mode == _DICTIONARY_BUILD_MODE_LONGEST && _alphabet[_i].length == depth )
                    ||
                  ( this.construction_mode == _DICTIONARY_BUILD_MODE_ALL && _alphabet[_i].length <= depth ) )
             {
                  this.sliced_dict_tmp_array.push( _alphabet[_i] );
                  if ( this.sliced_dict_tmp_array.length == this.sliced_dictionary_upper_bound )
                  {
                      this.sliced_dictionary.push( this.sliced_dict_tmp_array.clone() );
                      this.sliced_dict_tmp_array = [] ;
                  }
             }
         }
           
         var startINDEX = 0, endINDEX = safe_size( this.dictionary_array, 0 ) - 1 ;
         _add_counter = 0 ;
         // 0. the official var dictionary_array is used for storage and transverse tree walking
         // 1. all words being shorter or equal to input depth are computed
         // 2. allowed values (not matching the crash words array or
         //    the longest ones if the limit set is optioned) are put into a temporary array
         // 3. finally _tmp_array is flushed back into (the official) dictionary_array
         outer_loop:
         for( _i = startINDEX ; _i <= endINDEX ; _i++ )
         {
					   WORD = this.dictionary_array[_i];
             inner_loop:
             for( _a = 0 ; _a < _alphabet.length ; _a++ )
             {
                 _str1 = WORD + _alphabet[_a] ;
                 if ( !this.check_crash_word( _str1 ) )
                 {
                     this.dictionary_array.push( _str1 );
                     _add_counter++ ;
                     if ( ( this.construction_mode == _DICTIONARY_BUILD_MODE_LONGEST && _str1.length == depth )
                          ||
                          ( this.construction_mode == _DICTIONARY_BUILD_MODE_ALL && _str1.length <= depth ) )
                     {
                        this.sliced_dict_tmp_array.push( _str1 );
                        if ( this.sliced_dict_tmp_array.length == this.sliced_dictionary_upper_bound )
                        {
                             this.sliced_dictionary.push( this.sliced_dict_tmp_array.clone() );
                             this.sliced_dict_tmp_array = [] ;
                        }
                     }
                 }
             }
    
             if ( this.running == 0 ) break ;

             if ( _i == endINDEX )
             {
                 if ( this.dictionary_array.get_last().length > depth ) break ;
                 this.dictionary_array = this.dictionary_array.right( _add_counter );
                 startINDEX = 0, endINDEX = this.dictionary_array.length - 1 ;
                 _i = startINDEX - 1 ;
                 _add_counter = 0 ;
             }
         }

         if( safe_size( this.sliced_dict_tmp_array, 0 ) > 0 )
         {
		         this.sliced_dictionary.push( this.sliced_dict_tmp_array.clone() );
		         this.sliced_dict_tmp_array = [];
				 }

         this.dictionary_array = [] ;
    }
}

dictionary.prototype.sort_length_asc = function(a, b)
{
    if (a.length > b.length) return 1;
    else if (a.length < b.length) return -1;
    return 0;
}

dictionary.prototype.sliced_dict_size = function( _sliced_input_array )
{
		var _arr = is_array( _sliced_input_array ) ? _sliced_input_array : this.sliced_dictionary ;
		if ( !is_array( _arr ) ) return 0 ;
		var _s = 0 ;
		for( var _t = 0 ; _t < _arr.length ; _t++ ) _s += _arr[_t] != null ? _arr[_t].length : 0 ;
		return _s ;
}

dictionary.prototype.sliced_dict_flush = function()
{
		if ( is_array( this.sliced_dictionary ) )
		{
				 for( var _i = 0 ; _i < this.sliced_dictionary.length ; _i++ )
				 this.sliced_dictionary[_i] = [] ;
		}
		
		this.sliced_dictionary = [] ;
}

dictionary.prototype.sliced_dict_get_chunks_number = function() { return is_array( this.sliced_dictionary ) ? safe_size( this.sliced_dictionary, 0 ) : 0 ; }
dictionary.prototype.sliced_dict_get_chunk_size = function() { return is_array( this.sliced_dictionary ) ? safe_size( this.sliced_dictionary[0], 0 ) : 0 ; }

dictionary.prototype.sliced_dict_resize = function( _chunk_size, _self_resize )
{
    _chunk_size = safe_int( _chunk_size, 0 );
    _self_resize = safe_int( _self_resize, 0 );
    if ( _chunk_size == 0 ) return null ;
		var _new_main_sliced_dict = [], _new_sliced_dict_tmp_array = [],  _word ;
    this.sliced_dict_reset_runner();
    while( ( _word = this.sliced_dict_read_runner() ) != "" )
    {
        _new_sliced_dict_tmp_array.push( _word );
        if ( _new_sliced_dict_tmp_array.length == _chunk_size )
        {
             _new_main_sliced_dict.push( _new_sliced_dict_tmp_array.clone() );
             _new_sliced_dict_tmp_array = [] ;
        }
    }

    if ( _new_sliced_dict_tmp_array.length > 0 )
    {
         _new_main_sliced_dict.push( _new_sliced_dict_tmp_array.clone() );
         _new_sliced_dict_tmp_array = [] ;
    }
    
		if ( _self_resize ) this.sliced_dictionary = _new_main_sliced_dict.clone(); 
		return _self_resize ? this.sliced_dictionary : _new_main_sliced_dict.clone();
}

dictionary.prototype.sliced_dict_get_linear_array = function()
{
		var _arr = this.sliced_dictionary ;
		if ( !is_array( _arr ) ) return 0 ;
		var _out_array = [] ;
		for( var _t = 0 ; _t < _arr.length ; _t++ ) _out_array = _out_array.concat( _arr[_t] );
		return _out_array.clone();
}

dictionary.prototype.sliced_dict_includes = function( _sliced_input_array, _word )
{
		var _arr = is_array( _sliced_input_array ) ? _sliced_input_array : this.sliced_dictionary ;
		if ( !is_array( _arr ) ) return 0 ;
		var _incl = 0 ;
		for( var _t = 0 ; _t < _arr.length ; _t++ )
    {
         if ( _arr[_t].includes( _word ) )
         {
              _incl = 1 ;
              break ;
         }
    }
		return _incl ;
}

dictionary.prototype.sliced_dict_get_chunk_index_from_word = function( _sliced_input_array, _word )
{
		var _arr = is_array( _sliced_input_array ) ? _sliced_input_array : this.sliced_dictionary ;
		if ( !is_array( _arr ) ) return 0 ;
		var _index = 0 ;
		for( var _t = 0 ; _t < _arr.length ; _t++ )
    {
         if ( _arr[_t].includes( _word ) )
         {
              _index = _t ;
              break ;
         }
    }
		return _index ;
}

dictionary.prototype.sliced_dict_read_runner = function()
{
    if ( !is_array( this.sliced_dictionary[ this.token_dictionary_read_index ] ) ) return "" ;
    var _word = this.sliced_dictionary[ this.token_dictionary_read_index ][this.main_dictionary_read_runner] ;
    this.main_dictionary_read_runner++ ;
    if ( this.main_dictionary_read_runner == safe_size( this.sliced_dictionary[ this.token_dictionary_read_index ] ) )
    {
        this.token_dictionary_read_index++ ;
        this.main_dictionary_read_runner = 0 ;
    }

    return _word ;
}

dictionary.prototype.sliced_dict_set_runner = function( _i )
{
    this.token_dictionary_read_index = safe_int( _i / this.sliced_dictionary_upper_bound, 0 );
    this.main_dictionary_read_runner = _i % this.sliced_dictionary_upper_bound ;
    if ( !is_array( this.sliced_dictionary[ this.token_dictionary_read_index ] ) ) return 0 ;
    else return this.sliced_dictionary[ this.token_dictionary_read_index ][this.main_dictionary_read_runner] == null ? 0 : 1 ;
}

dictionary.prototype.sliced_dict_reset_runner = function() { this.token_dictionary_read_index = this.main_dictionary_read_runner = 0 ; }