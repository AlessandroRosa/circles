/*
    JS probability class library is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Code by Alessandro Rosa - alessandro.a.rosa@gmail.com

if ( typeof is_array != "function" ) function is_array( _obj ) { return _obj instanceof Array ? 1 : 0 ; }
if ( typeof is_complex != "function" ) function is_complex( _obj ) { return _obj instanceof complex ? 1 : 0 ; }
if ( typeof is_integer != "function" ) function is_integer( _obj ) { return is_number( _obj ) ? ( Math.floor( _obj ) == _obj ? 1 : 0 ) : 0 ; }
if ( typeof is_number != "function" ) function is_number( _obj ) { return ( typeof _obj == "number" || _obj instanceof Number ) ; }
if ( typeof is_rational != "function" ) function is_rational( _obj ) { return is_number( _obj ) ? !is_integer( _obj ) : 0 ; }
if ( typeof is_string != "function" ) function is_string( _obj ) { return ( typeof _obj == "string" || _obj instanceof String ) ; }

if ( typeof safe_string != "function" ) function safe_string( _obj, _default_str ) { return ( typeof _obj == "string" || _obj instanceof String ) ? new String( _obj ).trim() : new String( _default_str + "" ) ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

function probability()
{
    this.symbols = [] ;
    this.probabilities = [] ;
    this.special_sequences = [];
    this.special_probabilities = [];
    this.collision_symbols_array = [];
}

probability.prototype.list_symbols = function( _sep )
{
    if ( _sep == null || _sep == "undefined" ) _sep = " " ;
    return this.symbols.join( _sep ) ;
}

probability.prototype.list_special_sequences = function( _sep )
{
    if ( _sep == null || _sep == "undefined" ) _sep = " " ;
    return this.special_sequences.join( _sep ) ;
}

probability.prototype.add_collision_symbols = function( _symbol, _against )
{
    if ( this.collision_symbols_array[ _symbol ] == null ) this.collision_symbols_array[ _symbol ] = [] ;
    {
        if ( this.collision_symbols_array[ _symbol ].indexOf( _against ) == -1 )
        this.collision_symbols_array[ _symbol ].push( _against ) ;
    }

    if ( this.collision_symbols_array[ _against ] == null ) this.collision_symbols_array[ _against ] = [] ;
    {
        if ( this.collision_symbols_array[ _against ].indexOf( _symbol ) == -1 )
        this.collision_symbols_array[ _against ].push( _symbol ) ;
    }
}

probability.prototype.add_symbol = function( _symbol, _prob )
{
    _symbol = new String( _symbol + "" );
    _prob = parseFloat( _prob ) ;     if ( isNaN( _prob ) ) _prob = -1 ;

    if ( ( new RegExp( "^[A-Za-z]{1}$" ) ).test( _symbol )
         && this.symbols.indexOf( _symbol ) == -1
         && _prob >= 0 && _prob <= 1 )
    {
        this.symbols.push( _symbol );
        this.probabilities[ "symb." + _symbol ] = _prob ;
        return true ;
    }
    else return false ;
}

probability.prototype.add_special_sequence = function( _symbol, _prob )
{
    _symbol = new String( _symbol + "" );
    _prob = parseFloat( _prob ) ;     if ( isNaN( _prob ) ) _prob = -1 ;

    if ( ( new RegExp( "^[A-Za-z]{1,}$" ) ).test( _symbol )
         && this.special_sequences.indexOf( _symbol ) == -1
         && _prob >= 0 && _prob <= 1 )
    {
        this.special_sequences.push( _symbol );
        this.special_probabilities[ "symb." + _symbol ] = _prob ;
        return true ;
    }
    else return false ;
}

probability.prototype.check_probabilities = function()
{
    var _p_sum = 0 ;
    for( var _symb in this.probabilities )
    if ( _symb.indexOf( "symb." ) != -1 ) _p_sum += this.probabilities[ _symb ] ;
    return ( _p_sum == 1 ) ;
}

probability.prototype.conditional_probability = function( _input_event_string, _input_condition_string )
{
    if ( _input_event_string == null || _input_event_string == "undefined" ) return NO ;
    if ( _input_condition_string == null || _input_condition_string == "undefined" ) return NO ;

    var _chunk = _input_condition_string + _input_event_string ;
    var _event = this.compute_probability( _chunk );
    var _condition = this.compute_probability( _input_condition_string );
    return ( _condition == 0 ) ? 0 : _event / _condition ;
}

probability.prototype.compute_probability = function( _input_string, _each_entry_once )
{
   /* example, computing probability of "ABab",
      where collisions are : Aa, aA, Bb, bB
      and special symbols are: Aa = aA = Bb = bB = 0
      var _p = 0.25 ;              // A
          _p *= ( 1.0 - 0.25 * 2 ) // ex: AB  (exclusion of A + a from ABab)
          _p *= ( 1.0 - 0.25 * 3 ) // ex: ABa (exclusion of A + B + b from ABab)
          _p *= ( 1.0 - 0.25 * 3 ) // ex: ABab (exclusion of A + B + a from ABab)

   */

   /* algorithm
       1. take n-th letter L from the input string I, if _p = -1 (default), then assign the prob of L to _p
       2. append L to a string S
       3. with regard to L, take
          3.1 >> all mutually excluded symbols;
          3.2 >> L itself ;
          3.3 >> all the preceding symbols ;
          then sum all related probabilities from 3.1 to 3.3 into _s
       4. compute _p * ( 1 - _s )
       5. get back to 1.
   */

   if ( _each_entry_once == null || _each_entry_once == "undefined" ) _each_entry_once = 1 ;

   var _p = 1, _start_flag = 1, _c, _sp, _ch, _x, _ch_x, _i ;
   var _exclusion_probability = 0, _mts_array = [] ;

   for( _c = 0 ; _c < this.special_sequences.length ; _c++ )
   {
        _sp = this.special_sequences[_c] ;
        if ( _input_string.indexOf( _sp ) != -1 )
        {
             _p *= this.special_probabilities[ "symb." + _sp ] ;
             _input_string = _input_string.replace( _sp, "" );
        }
   }

   if ( _input_string.length - 1 == 0 )
   {
        _ch = _input_string.charAt(0);
        if ( this.probabilities[ "symb." + _ch ] != null ) _p *= this.probabilities[ "symb." + _ch ] ;
   }
   else
   {
       for( _c = 0 ; _c < _input_string.length - 1 ; _c++ )
       {
            _ch = _input_string.charAt( _c ), _probability = 0 ;
            if ( _start_flag && this.probabilities[ "symb." + _ch ] != null )
            {
                 _start_flag = 0 ;
                 _p *= this.probabilities[ "symb." + _ch ] ;
            }

            _exclusion_probability = 0, _mts_array = [] ;
            if ( this.collision_symbols_array[ _ch ] != null )
            _mts_array = this.collision_symbols_array[ _ch ] ;

            if ( _each_entry_once )
            {
                _mts_array.push( _ch );
                for( _x = 0 ; _x < _c ; _x++ )
                {
                    _ch_x = _input_string.charAt( _x ) ;
                    if ( _mts_array.indexOf( _ch_x ) == -1 ) _mts_array.push( _ch_x );
                }

                // sum all related probabilities
                for( _i = 0 ; _i < _mts_array.length ; _i++ )
                _exclusion_probability += this.probabilities[ "symb." + _mts_array[_i] ] ;

                _probability = ( 1.0 - _exclusion_probability ) ;
            }
            else _probability = this.probabilities[ "symb." + _ch ] ;

            _p *= _probability ;
       }
   }

   return _p ;
}