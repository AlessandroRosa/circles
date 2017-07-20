function CIRCLESformsSVGEDITORcodeINTEGRITYresponse( _integrity_array, _fn )
{
    if ( !object_exists( _fn ) ) _fn = null ;
    var _integrity_flag = is_array( _integrity_array ) ? safe_int( _integrity_array[0], null ) : null ;
    var _integrity_obj_1 = is_array( _integrity_array ) ? safe_int( _integrity_array[1], null ) : null ;
    var _canvas_width = 0, _canvas_height = 0 ;
    switch ( _svg_editor_coords_ref )
    {
       case Z_PLANE:
       _canvas_width = _glob_zplane_rendering_canvas_placeholder.get_width() ;
       _canvas_height = _glob_zplane_rendering_canvas_placeholder.get_height() ;
       break ;
       case W_PLANE:
       _canvas_width = _glob_wplane_rendering_canvas_placeholder.get_width() ;
       _canvas_height = _glob_wplane_rendering_canvas_placeholder.get_height() ;
       break ;
       case BIP_BOX:
       _canvas_width = _glob_bip_canvas.get_width();
       _canvas_height = _glob_bip_canvas.get_height();
       break ;
       default: break ;
    }

      var _msg = "" ;
      if ( _integrity_flag == 0 && _fn != null ) eval( _fn );
      else if ( _integrity_flag == null ) _msg = "Memory failure: svg integrity code check has failed" ;
      else if ( is_array( _glob_export_code_array ) )
      {
           if ( _integrity_flag & 1 )
           {
              _glob_export_code_array.push_first( "<svg version=\"1.1\" baseProfile=\"full\" width=\""+_canvas_width+"px\" height=\"auto\" xmlns=\"http://www.w3.org/2000/svg\">\r\n" );
              _msg += _glob_crlf + "- Missing SVG file opening tag: repaired" ;
           }

           if ( _integrity_flag & 2 )
           {
              _glob_export_code_array.push( "</svg>" );
              _msg += _glob_crlf + "- Missing SVG file closure tag: repaired" ;
           }

           if ( _integrity_flag & 4 )
           {
              var _errors_count = 0 ;
                        
              if ( _integrity_obj_1 != null ) // scan for blank lines
              {
                  var _chunk, _linenumber, _err_type, _err_sub, _base_index = CIRCLESformsSVGEDITORpageCOUNTER * CIRCLESformsSVGEDITORrowsPERpage ;
                  for( var _i = 0 ; _i < _integrity_obj_1.length ; _i++ )
                  {
                      _chunk = _integrity_obj_1[_i] ;
                      _linenumber = safe_int( _chunk['linenumber'], UNDET );
                      _err_type = safe_int( _chunk['err'], UNDET );
                      _err_sub = safe_int( _chunk['sub'], UNDET );
                                  
                      if ( _linenumber != UNDET && _err_type == 1 )
                      {
                          if ( _err_sub == 1 ) _glob_export_code_array[_i+_base_index] = "<" + _glob_export_code_array[_i+_base_index] ; 
                          else if ( _err_sub == 2 ) _glob_export_code_array[_i+_base_index] = _glob_export_code_array[_i+_base_index] + ">" ;
                          _errors_count++ ; 
                      }
                  }
              }
              else _msg += _glob_crlf + "- Missing backets: can't fix" ;
                        
              if ( _errors_count > 0 ) _msg += "Missing backets: entries fixed ("+_errors_count+")" ;
           }

           if ( _integrity_flag & 8 )
           {
                    var _errors_count = 0 ;
                        
                    if ( _integrity_obj_1 != null ) // scan for blank lines indexes
                    {
                         var _chunk, _linenumber, _err_type ;
                         for( var _i = 0 ; _i < _integrity_obj_1.length ; _i++ )
                         {
                             _chunk = _integrity_obj_1[_i] ;
                             _linenumber = safe_int( _chunk['linenumber'], UNDET );
                             _err_type = safe_int( _chunk['err'], UNDET );
                             if ( _linenumber != UNDET && _err_type == 2 )
                             {
                                _errors_count++ ;
                                _glob_export_code_array.remove( _linenumber, _linenumber );
                                _i = -1 ;
                             }
                         }
                    }
                    else _msg += _glob_crlf + "- Blank lines detected: can't erase" ;
                    if ( _errors_count > 0 ) _msg += _glob_crlf + "- Blank lines detected: entries erased ("+_errors_count+")" ;
           }

           if ( _integrity_flag & 16 )
           {
                        var _errors_count = 0 ;
                        
                        if ( _integrity_obj_1 != null ) // scan for broken tags and multiple spaces
                        {
                             var _chunk, _linenumber, _err_type, _line, _base_index = CIRCLESformsSVGEDITORpageCOUNTER * CIRCLESformsSVGEDITORrowsPERpage ;
                             for( var _i = 0 ; _i < _integrity_obj_1.length ; _i++ )
                             {
                                  _chunk = _integrity_obj_1[_i] ;
                                  _linenumber = safe_int( _chunk['linenumber'], UNDET );
                                  _err_type = safe_int( _chunk['err'], UNDET );
                                  if ( _linenumber != UNDET && _err_type == 3 )
                                  {
                                      _errors_count++ ;
                                      _line = new String( _glob_export_code_array[_i] );
                                      _line = _line.stripdoublespaces().trim().replaceAll( "< ", "<").replaceAll( "\t", " " );
                                      _line = _line.replaceAll( [ CRLF_WIN, CRLF_NO_WIN, '<br>' ], "" );
                                      _line += _glob_crlf ;
                                      _glob_export_code_array[_i+_base_index] = _line ; 
                                  }
                             }
                        }
                        else _msg += _glob_crlf + "- Broken tags or multiple spaces detected: can't correct" ;
                        
                        if ( _errors_count > 0 ) _msg += _glob_crlf + "- Blank lines detected or multiple spaces: entries corrected ("+_errors_count+")" ;
           }
      }
      else _msg += "Can't fix code: memory failure" ;
      return [ _integrity_flag, _msg ] ;
}

function CIRCLESformsSVGEDITORcodeINTEGRITY( _input_code, _check_full_integrity )
{
			_input_code = safe_string( _input_code, "" );
			_check_full_integrity = safe_int( _check_full_integrity, YES );
			var _code_array = _input_code.length > 0 ? _input_code.replaceAll( [ CRLF_WIN, CRLF_NO_WIN, '<br>' ], _glob_crlf ).split( _glob_crlf ) : _glob_export_code_array ;
      var _code_lines_n = safe_size( _code_array, 0 );
      var _lines_errors_array = [];
      if ( _code_lines_n > 0 )
      {
          var _errors_mask = 0, _b_passed = NO, _line ;
          // check for closure tag
          if ( _check_full_integrity )
          {
              var _excerpt = _glob_export_code_array.subset( 10 ) ;
              $.each( _excerpt,
                      function( _i, _line )
                      {
                            if ( _line.start_with_i( "<svg" ) )
                            {
                                 _b_passed = YES ;
                                 return ;
                            }
                      }
                    ) ;
          
						  if ( !_b_passed ) _errors_mask |= 1 ;

		          if ( _glob_export_code_array.get_last().toLowerCase().includes( "</svg>" ) ) _b_passed = YES ;
		          else _errors_mask |= 2 ;
				  }

          // check for blank lines
          _b_passed = YES ;
          $.each( _glob_export_code_array,
          				function( _i, _line )
          				{
          						 // check for blank lines
				               if ( _line.length == 0 )
				               {
				                   _lines_errors_array.push( { "linenumber" : _l, "err" : 2 } );
				                   _b_passed = NO ;
													 _errors_mask |= 8 ;
				               }

											 // check for double spaces
                       if ( _line.one_in( "< ", "\t" ) || _line.testME( "/\s+/g" ) )
                       {
                           _lines_errors_array.push( { "linenumber" : _l, "err" : 3 } );
                           _b_passed = NO ;
                           _errors_mask |= 16 ;
		                   }
									}
								) ;
      }

      return [ _errors_mask, _lines_errors_array ] ;
}