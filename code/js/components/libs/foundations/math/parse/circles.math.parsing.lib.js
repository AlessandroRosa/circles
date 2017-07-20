function circles_lib_math_parse_formula( _frm )
{
   // return a string representing the complex number
   // p.s. to obtain the complex value, parse such string
   // via parse_complex_from_string included in the file complex.number.class.js
   _frm = safe_string( _frm, "" );
   if ( _frm[0] == "+" ) _frm = _frm.substr( 1, _frm.length );
   if ( _frm.length > 0 )
   {
      var _result = null ;
      if ( _frm.start_with_i( "complex(" ) && _frm.lastchar().strcmp( ")" ) && _frm.count( "complex(" ) == 1 )
      {
         _frm = _frm.replaceAll( "complex(", "" ) ;
         _frm = _frm.substr( 0, _frm.length - 1 ) ;
         var _c_comp = _frm.includes( "," ) ? _frm.split( "," ) : [ _c_comp, 0 ] ;
         var _c0 = _glob_parser.eval( _c_comp[0] ), _c1 = _glob_parser.eval( _c_comp[1] );
         _c0 = ( _c0.im != null ) ? new complex( _c0.re.sci_to_dec(), _c0.im.sci_to_dec() ) : new complex( safe_float( _c0, 0 ).sci_to_dec(), 0 );
         _c1 = ( _c1.im != null ) ? new complex( _c1.re.sci_to_dec(), _c1.im.sci_to_dec() ) : new complex( safe_float( _c1, 0 ).sci_to_dec(), 0 );
         _c1 = _c1.mul( new complex( 0, 1 ) );
         var _c = _c0.add( _c1 );
         _result = _c.formula( YES, YES, _glob_accuracy );
      }
      else
      {
         try { _result = _glob_parser.eval( _frm ); }
         catch( _err )
         {
            _error_str = _err.message ;
            _result = null ;
            circles_lib_error_obj_handler( _err );
         }
    
         if ( _result != null )
         {
            _result = _result.im != null ? new complex( safe_float( _result.re, 0 ).sci_to_dec(), safe_float( _result.im, 0 ).sci_to_dec() ) : new complex( safe_float( _result, 0 ).sci_to_dec(), 0 );
            _result = _result.formula( YES, YES, _glob_accuracy );
         }
      }

      return _result ;
   }
   else return null ;
}

function circles_lib_parse_fix_formula( _input )
{
   _input = safe_string( _input, "" );
   _input = _input.replace( /\bpi\b/i, "PI" );

   _input = _input.replace( /\bcos\b/i, "cos" );
   _input = _input.replace( /\bsin\b/i, "sin" );

   _input = _input.replace( /\btg\b/i, "tan" );

   _input = _input.replace( /\bctn\b/i, "cot" );
   _input = _input.replace( /\bctan\b/i, "cot" );
   _input = _input.replace( /\bctg\b/i, "cot" );
   _input = _input.replace( /\bcotg\b/i, "cot" );
   _input = _input.replace( /\bcotan\b/i, "cot" );

   _input = _input.replace( /\bctnh\b/i, "coth" );
   _input = _input.replace( /\bctanh\b/i, "coth" );
   _input = _input.replace( /\bcotanh\b/i, "coth" );
   _input = _input.replace( /\bctgh\b/i, "coth" );
   _input = _input.replace( /\bcotgh\b/i, "coth" );
   _input = _input.replace( /\bcotanh\b/i, "coth" );

   _input = _input.replace( /\bcosec\b/i, "csc" );
   _input = _input.replace( /\bcosech\b/i, "csch" );

   _input = _input.replace( /\barccos\b/i, "acos" );
   _input = _input.replace( /\barcsin\b/i, "asin" );

   _input = _input.replace( /\barctan\b/i, "atan" );
   _input = _input.replace( /\barctg\b/i, "atan" );
   _input = _input.replace( /\batg\b/i, "atan" );

   _input = _input.replace( /\barctan2\b/i, "atan2" );
   _input = _input.replace( /\barctg2\b/i, "atan2" );
   _input = _input.replace( /\batg2\b/i, "atan2" );

   _input = _input.replace( /\breal\b/i, "re" );
   _input = _input.replace( /\bimag\b/i, "im" );
   return _input ;
}