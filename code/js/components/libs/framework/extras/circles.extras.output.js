function circles_lib_error_obj_handler( _err, _linebreak_cmd, _switch_output )
{
		if ( _err instanceof Error )
		{
				_switch_output = safe_int( _switch_output, OUTPUT_LOG );
				var _out = "" ;
        if ( _switch_output.is_one_of( OUTPUT_SCRIPT_EDITOR, OUTPUT_LOG ) ) _linebreak_cmd = "<br>" ;
				else _linebreak_cmd = safe_string( _linebreak_cmd, _glob_crlf );

				if ( _err.filename ) _out += ( _out.length == 0 ? "" : _glob_crlf ) + "Filename : " + _err.filename + _linebreak_cmd ;
				if ( _err.number ) _out += ( _out.length == 0 ? "" : _glob_crlf ) + "Run-time error : " + _err.number + _linebreak_cmd ;
				if ( _err.lineNumber ) _out += ( _out.length == 0 ? "" : _glob_crlf ) + "Line number : " + _err.lineNumber + _linebreak_cmd ;
				if ( _err.columnNumber ) _out += ( _out.length == 0 ? "" : _glob_crlf ) + "Column number : " + _err.columnNumber + _linebreak_cmd ;
				if ( _err.message ) _out += ( _out.length == 0 ? "" : _glob_crlf ) + _err.message + _linebreak_cmd ;
				if ( _err.description ) _out += ( _out.length == 0 ? "" : _glob_crlf ) + _err.description + _linebreak_cmd ;
				if ( _err.stack ) _out += ( _out.length == 0 ? "" : _glob_crlf ) + _err.stack + _linebreak_cmd ;

				switch( _switch_output )
				{
            case OUTPUT_LOG: circles_lib_log_add_entry( _out, LOG_ERROR ); break ;
						case OUTPUT_CONSOLE: break ;
						case OUTPUT_SCRIPT_EDITOR: // js-circles editor
						circles_lib_output( OUTPUT_SCRIPT_EDITOR, DISPATCH_ERROR, _out, "CIRCLESformsSCRIPTEDITORoutputTABLE" ) ;
						break ;
						default: _linebreak_cmd = _glob_crlf ; break ;
				}
		}
}

function circles_lib_output( _out_channel_type, _out_msg_type, _out_msg_text /*more arguments follow, depending on the channel type */ )
{
    _out_channel_type = safe_int( _out_channel_type, OUTPUT_NONE );
    _out_msg_type = safe_int( _out_msg_type, DISPATCH_INFO );
    _out_msg_text = is_array( _out_msg_text ) ? _out_msg_text.work( function( _t ) { return safe_string( _t, "" ) ; } ) : safe_string( _out_msg_text, "" ) ;
    
    if ( _out_channel_type & OUTPUT_SPECIAL_FX )
    {
   		 var _color = "" ;
   		 var _ctrl_id = arguments[3] ;
   		 var _milliseconds_duration = arguments[4] ;
   		 var _mutex = arguments[5] ;
   		 switch( _out_msg_type )
   		 {
		 			case DISPATCH_WARNING: _color = "orange" ; break ;
		 			case DISPATCH_SUCCESS: _color = "greensuccess" ; break ;
		 			case DISPATCH_CRITICAL: case DISPATCH_ERROR: _color = "rederror" ; break ;
		 			case DISPATCH_INFO: default: _color = "lightgray" ; break ;
			 }
			 _color = get_rgb_from_color_tag( _color ) ;
			 circles_lib_extras_special_fx_msg( _ctrl_id, _out_msg_text, _color, _milliseconds_duration, _mutex ) ;
		}
    
    if ( _out_channel_type & OUTPUT_SCREEN )
    {
    		var _alert_type = 0, _caption = safe_string( arguments[3], _glob_app_title ) ;
    		if ( _out_msg_type & DISPATCH_SUCCESS ) _alert_type |= ALERT_SUCCESS ;
    		if ( _out_msg_type & DISPATCH_YESNO ) _alert_type |= ALERT_YESNO ;
				if ( _out_msg_type & DISPATCH_YESNOCANCEL ) _alert_type |= ALERT_YESNOCANCEL ;
				if ( _out_msg_type & DISPATCH_OKCANCEL ) _alert_type |= ALERT_OKCANCEL ;
				if ( _out_msg_type & DISPATCH_WARNING ) _alert_type |= ALERT_WARNING ;
				if ( _out_msg_type & DISPATCH_QUESTION ) _alert_type |= ALERT_QUESTION ;
				if ( _out_msg_type & DISPATCH_CRITICAL ) _alert_type |= ALERT_CRITICAL ;
				if ( _out_msg_type & DISPATCH_NOBUTTON ) _alert_type |= ALERT_NOBUTTON ;
				if ( _out_msg_type & DISPATCH_ONCLOSE ) _alert_type |= ALERT_ONCLOSE ;
				if ( _out_msg_type & DISPATCH_NOICON ) _alert_type |= ALERT_NOICON ;
				if ( _out_msg_type & DISPATCH_NOCAPTION ) _alert_type |= ALERT_NOCAPTION ;
				if ( _out_msg_type & DISPATCH_INFO ) _alert_type |= ALERT_INFO ;
				if ( _out_msg_type & DISPATCH_HELP ) _alert_type |= ALERT_HELP ;
				if ( _out_msg_type & DISPATCH_ERROR ) _alert_type |= ALERT_ERROR ;
				if ( _out_msg_type & DISPATCH_HALT ) _alert_type |= ALERT_HALT ;

        alert_msg( _alert_type, _out_msg_text, _caption );
    }

    if ( _out_channel_type & OUTPUT_TERMINAL && _glob_terminal_echo_flag ) // console terminal
    {
       switch( _out_msg_type )
       {
          case DISPATCH_STANDARD: circles_lib_terminal_standard_echo( _out_msg_text ); break ;
          case DISPATCH_ERROR:
          circles_lib_terminal_error_echo( _out_msg_text );
          _glob_terminal_errors_counter++ ;
          break ;
          case DISPATCH_WARNING:
          if ( _glob_terminal_warnings_switch )
          {
             circles_lib_terminal_warning_echo( _out_msg_text );
             _glob_terminal_warnings_counter++ ;
          }
          break ;
          case DISPATCH_SUCCESS: circles_lib_terminal_success_echo( _out_msg_text ); break ;
          case DISPATCH_INFO: circles_lib_terminal_info_echo( _out_msg_text ); break ;
          case DISPATCH_TEXTCOLOR_TYPE: circles_lib_terminal_text_echo( _out_msg_text, arguments[3] ); break ;
          case DISPATCH_MULTICOLOR: circles_lib_terminal_multicolor_echo( _out_msg_text ); break ;
          case DISPATCH_CRITICAL: circles_lib_terminal_error_echo( _out_msg_text ); break ;
          default: break ;
       }
    }
      
    if ( _out_channel_type & OUTPUT_SCRIPT ) // batch processing output
    {
         var _textcolor = "" ;
         switch( _out_msg_type )
         {
            case DISPATCH_STANDARD: _textcolor = DEFAULT_COLOR_STD ; break ;
            case DISPATCH_ERROR: _textcolor = DEFAULT_COLOR_ERROR ; break ;
            case DISPATCH_WARNING: _textcolor = DEFAULT_COLOR_WARNING ; break ;
            case DISPATCH_SUCCESS: _textcolor = DEFAULT_COLOR_SUCCESS ; break ;
            case DISPATCH_INFO: _textcolor = _out_channel_type == OUTPUT_TEXT ? DEFAULT_COLOR_INFO_FOR_TEXT : DEFAULT_COLOR_INFO_FOR_TERMINAL ; break ;
            case DISPATCH_TEXTCOLOR_TYPE: _textcolor = arguments[3] ; break ;
            default: break ;
         }

         var _div_id = !is_string( arguments[3] ) ? "CIRCLESdebugDIV" : ( arguments[3].length == 0 ? "CIRCLESdebugDIV" : arguments[3] );
         if ( _out_msg_type == DISPATCH_ERROR )
         {
            _glob_terminal_errors_counter++ ;
            _textcolor = DEFAULT_COLOR_ERROR ;
         }
         else if ( _glob_terminal_warnings_switch == ON && _out_msg_type == DISPATCH_WARNING )
         {
            _glob_terminal_warnings_counter++ ;
            _textcolor = DEFAULT_COLOR_WARNING ;
         }

         if ( $("#"+_div_id ).get(0) != null )
         {
            var _br = $("#"+_div_id ).html().length > 0 ? "<br>" : "" ;
            var _cmd_timelabel = current_time() + ( _glob_terminal_current_cmd.length > 0 ? "&nbsp;[Line <SPAN STYLE=\"color:white;\">"+_glob_terminal_current_line_number+"</SPAN>][<SPAN STYLE=\"color:white;\">"+_glob_terminal_current_cmd+"</SPAN>]" : "" );
            var _html = _cmd_timelabel ;
            if ( _textcolor.length > 0 && !_out_msg_text.includes( "</" ) )
            {
               _html += "&nbsp;<SPAN STYLE=\"color:"+_textcolor+";\">" + _out_msg_text + "</SPAN>" ;
               _html = _html.replaceAll( [ CRLF_WIN, CRLF_NO_WIN, '<br>' ], "<br>" );
            }
            else if ( _out_msg_text.includes( "</" ) )
            {
               _out_msg_text = circles_lib_terminal_color_decode_htmltext( _out_msg_text, "", "", "", "", YES );
               _html += "&nbsp;" + _out_msg_text ;
            }

            $("#"+_div_id ).append( _br + _html );
            $("#debugtextareahidden").append( _glob_crlf + _html.strip_tags() );
         }
    }
    
    if ( _out_channel_type & OUTPUT_TEXT )
    _glob_text += "<SPAN STYLE=\"color:"+_textcolor+";\">" + _out_msg_text + "</SPAN>" + _glob_crlf ;

    if ( _out_channel_type & OUTPUT_FILE )
    _glob_text += "<SPAN STYLE=\"color:"+_textcolor+";\">" + _out_msg_text + "</SPAN>" + _glob_crlf ;

    if ( _out_channel_type & OUTPUT_HELP )
    $("#CIRCLESformsTERMINALbatchcompilerHELPdiv").html( _out_msg_text.replaceAll( [ CRLF_WIN, CRLF_NO_WIN, '<br>' ], "<br>" ) );

    if ( _out_channel_type & OUTPUT_SCRIPT_EDITOR )
    {
       var _color = "", _output_ctrl_id = safe_string( arguments[3], "" ).trim() ;
       var _showtime_at_firstrow_only = safe_int( arguments[4], NO );
       switch( _out_msg_type )
       {
          case DISPATCH_CRITICAL: case DISPATCH_ERROR: _color = COLOR_ERROR ; _out_msg_text = "<SPAN STYLE=\"color:"+_color+";\">"+_out_msg_text+"</SPAN>" ; break ;
          case DISPATCH_WARNING: _color = COLOR_WARNING ; _out_msg_text = "<SPAN STYLE=\"color:"+_color+";\">"+_out_msg_text+"</SPAN>" ; break ;
          case DISPATCH_SUCCESS: _color = COLOR_SUCCESS ; _out_msg_text = "<SPAN STYLE=\"color:"+_color+";\">"+_out_msg_text+"</SPAN>" ; break ;
          case DISPATCH_INFO: _color = COLOR_INFO ; _out_msg_text = "<SPAN STYLE=\"color:"+_color+";\">"+_out_msg_text+"</SPAN>" ; break ;
          case DISPATCH_MULTICOLOR: _color = "" ; break ;
          case DISPATCH_TEXTCOLOR_TYPE: case DISPATCH_STANDARD: default: _color = "#CDCDDF" ; break ;
       }

       if ( is_string( _out_msg_text ) ) _out_msg_text = [ _out_msg_text ] ;
       // it's an object, endowed with a method for retrieving internal data
       else if ( _out_msg_text.output ) _out_msg_text = [ _out_msg_text.output() ] ;

       $.each( _out_msg_text, function( _i, _msg )
       				 {
                   if ( _msg.length > 0 )
                   {
    									 _msg = "<lightblue>"+( ( ( _i == 0 && _showtime_at_firstrow_only ) || !_showtime_at_firstrow_only ) ? current_time() : ( new String( "&nbsp;" ) ).repeat(14) )+"</lightblue>&nbsp;&nbsp;" + _msg ;
    									 _msg = circles_lib_colors_decode_tags( _msg ) ;
                   }
                   $( "#" + _output_ctrl_id ).append( "<div>"+_msg+"</div>" );
							 }
			 			 ) ;

        $( "#" + _output_ctrl_id ).animate( { scrollTop:safe_int($("#"+_output_ctrl_id).prop("scrollHeight"),0)+10 }, 1000 );
    }
}

function circles_lib_dump_data_to_format( /* additional arguments will be processed further, separately*/ )
{
    var _obj = arguments[0], _destination = "", _cols = 1 ;
    var _is_txtfile = NO, _is_pdffile = NO, _save_pix = NO ;
    // scan for _destination param
    for ( var _i = 1 ; _i < arguments.length ; _i++ )
    {
        arguments[_i] = ( arguments[_i] + "" ).trim();
        if ( /.pdf$/.test( arguments[_i] ) )
        {
           _destination = arguments[_i] ;
           _is_pdffile = YES ;
           break ;
        }
        else if ( /.txt$/.test( arguments[_i] ) )
        {
           _destination = arguments[_i] ;
           _is_txtfile = YES ;
           break ;
        }
        else if ( arguments[_i].stricmp( "savepix" ) )
        {
           _save_pix = YES ;
           break ;
        }
        else if ( arguments[_i].toLowerCase().start_with( "cols:" ) )
        {
           _cols = safe_int( arguments[_i].toLowerCase().replace( "cols:", "" ), 1 );
           _cols = Math.max( _cols, 1 );
        }
    }

    // dump operator "->" management: return 1 (success) or 0 (failure)
    var _b_fail = 0 ;
    if ( _is_pdffile )
    {
        // write code
        var _out_obj_data = "" ;
        if ( is_number( _obj ) ) _out_obj_data = _obj.roundTo( _glob_accuracy ) + "" ;
        else if ( is_complex( _obj ) ) _out_obj_data = _obj.formula( 0, YES, _glob_accuracy );
        else if ( is_mobius_map( _obj ) ) _out_obj_data = _obj.output( " ", "coeffs", _glob_accuracy );
        else if ( is_array( _obj ) ) $.each( _obj, function( _i, _chunk ) { _out_obj_data += _glob_crlf + _chunk ; } );
        else _out_obj_data = _obj ;

        var pdf_header = function( doc, _page_no )
        {
             doc.setFillColor( 244, 244, 244 );
             doc.rect( 0, 0, 70, 297, 'F');

             doc.setFontSize( 7 );
             doc.text( 130, 15, "Page "+_page_no+" - Document printed on " + now() )

             doc.setFontSize( 14 );
             var _left = 10, _top = 15 ;
             doc.text( _left, _top, _glob_app_title );
             doc.setFontSize( 8 );
             _top += 4 ;
             doc.text( _left, _top, _glob_appSUBTITLE );
             _top += 10 ;

             doc.setFontSize( 8 );
             doc.setTextColor(0, 0, 0);
             return _top ;
        }

        var pdf_pix = function( doc, _left, _top )
        {
            var _tmp_canvas = document.createElement( "canvas" );
                _left = 130, _top = 25 ;
            var _zplane_rendering_canvas = _glob_zplane_rendering_canvas_placeholder ;
            var _wplane_rendering_canvas = _glob_wplane_rendering_canvas_placeholder ;
              // display Z-plane on the pdf
            doc.setTextColor(0, 0, 212);
            doc.setFontSize( 9 );
            doc.text( _left, _top, "Z-plane configuration (isometric circles)" );
            doc.setFontSize( 8 );
            _top += 3 ;
            _tmp_canvas.set_width( _zplane_rendering_canvas.get_width() );
            _tmp_canvas.set_height( _zplane_rendering_canvas.get_height() );
            var _tmp_context = _tmp_canvas.getContext( _glob_canvas_ctx_2D_mode );
            _tmp_context.rect( 0, 0, _tmp_canvas.get_width(), _tmp_canvas.get_height() );
            _tmp_context.fillStyle = "white" ;
            _tmp_context.fill();
            _tmp_context.drawImage( _zplane_rendering_canvas, 0, 0, _tmp_canvas.get_width(), _tmp_canvas.get_height() );
            var PIXDATA = _tmp_canvas.toDataURL( 'image/jpeg', 1.0 );
         		doc.addImage( PIXDATA, 'JPEG', _left, _top, 60, 60 );
            doc.setDrawColor(212, 212, 212);
            doc.roundedRect( _left, _top, 60, 60, 5, 5, 'D');
            _top += 66 ;
            doc.text( _left, _top, "Left : " + _glob_zplaneLEFT );
            _top += 4 ;
            doc.text( _left, _top, "Right : " + _glob_zplaneRIGHT );
            _top += 4 ;
            doc.text( _left, _top, "Top : " + _glob_zplaneTOP );
            _top += 4 ;
            doc.text( _left, _top, "Bottom : " + _glob_zplaneBOTTOM );

            var PIXDATA = null ;
            _top += 12 ;

            // display W-plane on the pdf
            doc.setFontSize( 9 );
            doc.text( _left, _top, "W-plane rendering" );
            doc.setFontSize( 8 );
            _top += 3 ;
            _tmp_canvas.set_width( _wplane_rendering_canvas.get_width() );
            _tmp_canvas.set_height( _wplane_rendering_canvas.get_height() );
            var _tmp_context = _tmp_canvas.getContext( _glob_canvas_ctx_2D_mode );
            _tmp_context.rect( 0, 0, _tmp_canvas.get_width(), _tmp_canvas.get_height() );
            _tmp_context.fillStyle = "white" ;
            _tmp_context.fill();
            _tmp_context.drawImage( _wplane_rendering_canvas, 0, 0, _tmp_canvas.get_width(), _tmp_canvas.get_height() );
            PIXDATA = _tmp_canvas.toDataURL( 'image/jpeg', 1.0 );
            doc.addImage( PIXDATA, 'JPEG', _left, _top, 60, 60 );
            doc.setDrawColor(212, 212, 212);
            _top += 66 ;
            doc.text( _left, _top, "Left : " + _glob_wplaneLEFT );
            _top += 4 ;
            doc.text( _left, _top, "Right : " + _glob_wplaneRIGHT );
            _top += 4 ;
            doc.text( _left, _top, "Top : " + _glob_wplaneTOP );
            _top += 4 ;
            doc.text( _left, _top, "Bottom : " + _glob_wplaneBOTTOM );
            doc.setTextColor(0, 0, 0);
        }

        if ( _out_obj_data.length > 0 )
        {
            //save pdf
            var _left = 10, _top = 0, _page_no = 1 ;
            var doc = new jsPDF();
            _top = pdf_header( doc, _page_no );
            if ( _save_pix ) pdf_pix( doc, 50, 20 );

            var _rows_array = is_array( _out_obj_data ) ? _out_obj_data : _out_obj_data.split( _glob_crlf );
            var _max_length = 1 ;
            _rows_array.work( function( _w ) { _max_length = Math.max( _max_length, _w.length ); } );
            var _shift_x = _max_length * 3.5, _count = 0 ;
            $.each( _rows_array,
                    function( _i, _row )
                    {
                       if ( _row.trim().length > 0 )
                       {
                          doc.text( _left, _top, _row );
                          if ( _count % _cols == ( _cols - 1 ) )
                          {
                              _top += 4, _left = 10 ;
                          }
                          else _left += _shift_x ;
                          _count++ ;
                          if ( _top > 280 )
                          {
                             _top = 0, _left = 10 ;
                             doc.addPage();
                             _page_no++ ;
                             _top = pdf_header( doc, _page_no );
                          }
                       }
                    }
                  );

            doc.output( "save", _destination );
            return [ RET_OK, "Output data exported to the pdf file '"+_destination+"'" ] ;
        }
        else return [ RET_ERROR, "Missing data or file path" ] ;
    }
    else if ( _is_txtfile )
    {
       var _out_obj_data = "" ;
       if ( is_number( _obj ) ) _out_obj_data = _obj.roundTo( _glob_accuracy ) + "" ;
       else if ( is_complex( _obj ) ) _out_obj_data = _obj.formula( 0, YES, _glob_accuracy );
       else if ( is_mobius_map( _obj ) ) _out_obj_data = _obj.output( " ", "coeffs", _glob_accuracy );
       else if ( is_string( _obj ) ) _out_obj_data = _obj ;
       else if ( is_array( _obj ) ) $.each( _obj, function( _i, _chunk ) { _out_obj_data += _glob_crlf + _chunk ; } );
       else _out_obj_data = _obj ;

       if ( _out_obj_data.length > 0 )
       {
           var blob = new Blob( [ _out_obj_data.strip_tags() ], { type: 'plain/text', endings: 'native' });
           saveAs( blob, _destination );
           return [ RET_OK, "File '"+_destination+"' has been dumped with success" ] ;
       }
       else return [ RET_ERROR, "Missing data or file path" ] ;
    }
    else return [ RET_ERROR, "\nFirst dump parameter must be a filename or a custom var identifier" ] ;
}

function circles_lib_extras_special_fx_msg( _ctrl_id, _text, _color, _milliseconds_duration, _mutex )
{
    _milliseconds_duration = Math.abs( safe_int( _milliseconds_duration, 2000 ) );
		_ctrl_id = safe_string( _ctrl_id, "" ), _text = safe_string( _text, "" ), _color = safe_string( _color, DEFAULT_COLOR_STD );
    _mutex = safe_int( _mutex, UNDET );
    if ( _glob_mutex['specialfxmsg'] == null )
    {
        _glob_mutex['specialfxmsg'] = [] ;
        _glob_mutex['specialfxmsg'].push( 1 ) ;
        _mutex = 1 ;
    }

    if ( _mutex != UNDET && !_glob_mutex['specialfxmsg'].includes( _mutex ) )
    _glob_mutex['specialfxmsg'].push( _mutex ) ;

    if ( _glob_mutex['specialfxmsg'].includes( _mutex ) )
    {
    		$( "#" + _ctrl_id ).css( "color", _color );
    		$( "#" + _ctrl_id ).hide().html(_text).fadeIn('slow').delay(_milliseconds_duration).fadeOut('slow',function(){ _glob_mutex['specialfxmsg'].delete_entry( _mutex ) ; } ).hide(1);
    }
    else
    {
        var _a = _glob_mutex['specialfxmsg'], _top = 0 ;
        _a.work( function( _m ){ _top = Math.max( _top, _m ) ; } );
        _top++ ;
        circles_lib_extras_special_fx_msg( _ctrl_id, _text, _color, _milliseconds_duration + 2000, _top ) ;
    }
}