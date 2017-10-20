function circles_lib_palette_init( _silent, _output_channel )
{
    _silent = safe_int( _silent, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    if ( safe_size( _glob_palette_array, 0 ) > 0 ) _glob_palette_array.flush();
    var _ret_chunk = circles_lib_colors_compute_gradient( _glob_palette_start_rgb, _glob_palette_end_rgb, _glob_palette_steps, _silent, _output_channel );
    _glob_palette_array = _ret_chunk[1] ;
    if ( !is_array( _glob_palette_array ) )
    {
      var _msg = "Can't compute the color gradient." + _glob_crlf + _ret_chunk + _glob_crlf + _ERR_00_05 ;
      if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
      return [ RET_ERROR, _msg ] ;
    }
    else if ( typeof CIRCLESformsPALETTEshow === "function" ) CIRCLESformsPALETTEshow();
    return [ RET_OK, "Palette init with success" ] ;
}

function circles_lib_palette_destroy( _question, _silent, _output_channel )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    if ( safe_size( _glob_palette_array, 0 ) > 0 )
    {
       var _b_go = !_question ? YES : confirm( _QUESTION_11_01 );
       if ( _b_go )
       {
          _glob_palette_array.flush();
          if ( safe_size( _glob_palette_array, 0 ) == 0 )
          {
             var _msg = "Palette has been correctly flushed away" ;
             if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
             return [ RET_OK, _msg ] ;
          }
          else
          {
             var _msg = "Memory error: can't flush this palette away" ;
             if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
             return [ RET_ERROR, _msg ] ;
          }
       }
    }
    else
    {
       var _msg = "Palette is already empty" ;
       if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, _msg, _glob_app_title );
       return [ RET_IRRELEVANT, _msg ] ;
    }
}

function circles_lib_palette_delete_interval( _range_str, _question, _silent, _output_channel )
{
     _range_str = safe_string( _range_str, "" ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
     _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
     if ( _range_str.length > 0 )
     {
          var _ask = "Do you confirm colors deletion for this input range '"+_range_str+"' ?" ;
          var _b_go = !_question ? YES : confirm( _ask );
          if ( _b_go )
          {
              var _check_fns = [];
              var _range_toks = _range_str.replaceAll( [ " ", ";" ], ",").split( "," ), _tok = "" ;
              var _palette_size = safe_size( _glob_palette_array, 0 );
              $.each( _range_toks, function( i, value ) { _range_toks[i] = value.trim(); } ) // clean from blank spaces
              for( var _i = 0 ; _i < _range_toks.length ; _i++ )
              {
                   _tok = _range_toks[_i] ;
                   if ( _tok.includes( "-" ) && _tok.count( "-" ) == 1 )
                   {
                        var _micro_range = _tok.split( "-" );
                        var _tok_from = safe_int( _micro_range[0], 0 ), _tok_to = safe_int( _micro_range[1], 0 );
                        if ( _tok_from < 0 || _tok_to < 0 || _tok_from > _palette_size || _tok_to > _palette_size )
                        {
                            var _msg = "Range values are incompatible with palette length:" ;
                                if ( _tok_from < 0 ) _msg += _glob_crlf + "* " + _tok_from + " is negative;" ;
                                if ( _tok_to < 0 ) _msg += _glob_crlf + "* " + _tok_to + " is negative;" ;
                                if ( _tok_from > _palette_size ) _msg += _glob_crlf + "* " + _tok_from + " is larger than palette size ("+_palette_size+");" ;
                                if ( _tok_to > _palette_size ) _msg += _glob_crlf + "* " + _tok_to + " is larger than palette size ("+_palette_size+");" ;
                            if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
                            else return [ RET_ERROR, _msg ] ;
                        }
                        else if ( _tok_from >= _tok_to )
                        {
                            var _msg = "Range values are coherent" ;
                            if ( _tok_from > _tok_to ) _msg += _glob_crlf + "Candidate lower bound exceeds candidate upper bound: " + _tok ;
                            else if ( _tok_from == _tok_to ) _msg += _glob_crlf + "Candidate lower and bounds match" ;
                            
                            if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
                            return [ RET_ERROR, _msg ] ;
                        }
                        else _check_fns.push( function( _x ) { return ( _x >= _tok_from && _x <= _tok_to ) ? YES : NO ; } );
                   }
                   else if ( _tok.onlyDigits() )
                   {
                        _check_fns.push( function( _x ) { return _x == _tok ? YES : NO ; } );
                   }
                   else
                   {
                        var _msg = "Syntax error in range definition" ;
                        if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
                        return [ RET_ERROR, _msg ] ;
                   }
              }
              
              var _copy_array = [], _to_delete = NO, _fn ;
              for( var _i = 0 ; _i < _glob_palette_array.length ; _i++ )
              {
                   _to_delete = NO ;
                   for( var _x = 0 ; _x < _check_fns.length ; _x++ )
                   {
                        _fn = _check_fns[ _x ] ;
                        if ( _check_fns[_x]( _i + 1 ) ) _to_delete = YES ;
                   }
                   
                   if ( !_to_delete ) _copy_array.push( _glob_palette_array[_i] );
              }
              
              _glob_palette_array = _copy_array.clone();
              CIRCLESformsPALETTEshow();
              $("#CANVAScolorCELLgradientSTEPS").val( _glob_palette_array.length );
              _msg = "Items deleted from palette with success" ;
              if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
              return [ RET_OK, _msg ] ;
          }
     }
     else
     {
         var _msg = "Missing range for colors deletion" ;
         if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         return [ RET_WARNING, _msg ] ;
     }
}

function circles_lib_palette_delete_entry( _delete_index, _question, _silent, _output_channel )
{
   _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
   _delete_index = safe_int( _delete_index, 0 ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
   var _b_go = !_question ? YES : confirm( _QUESTION_11_02 );
   if ( _b_go )
   {
   		var _old_size = safe_size( _glob_palette_array, 0 );
      _glob_palette_array.remove( _delete_index, _delete_index );
   		var _new_size = safe_size( _glob_palette_array, 0 );
      if ( $("#CIRCLEScolorsPALETTEcontainer").get(0) != null )
      $("#CIRCLEScolorsPALETTEcontainer").html( CIRCLESformsPALETTEdisplayTABLE().replaceAll( "%imgpath%", _glob_path_to_img ) );
      return _new_size < _old_size ? YES : NO ;
   }
   else return NO ;
}