var _glob_e_ps_open = 0 ;

function circles_lib_canvas_save_to_pdf( _canvas, _filename, _silent, _out_channel )
{
     if ( !is_html_canvas( _canvas ) ) _canvas = _glob_canvas_obj_ref ;
		 _filename = safe_string( _filename, "" );
     _silent = safe_int( _silent, NO );
     _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
     if ( is_html_canvas( _canvas ) )
     {
         // remove extension if explictly inside input var
		     var _extension = _filename.includes( "." ) ? _filename.split( ".").get_last() : "" ;
             _filename = _glob_title.length > 0 ? ( _glob_title + "." + _filename ) : "circles." + _filename ;
             _filename += _extension ;
             _filename = _filename.replaceAll( "..", "." );

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
          
         var pdf_pix = function( doc, _canvas, _left, _top, _pix_side )
         {
              var _tmp_canvas = document.createElement( "canvas" );
              _tmp_canvas.set_width( _canvas.get_width() );
              _tmp_canvas.set_height( _canvas.get_height() );
              var _tmp_context = _tmp_canvas.getContext( _glob_canvas_ctx_2D_mode );
              _tmp_context.rect( 0, 0, _tmp_canvas.get_width(), _tmp_canvas.get_height() );
              _tmp_context.fillStyle = "white" ;
              _tmp_context.fill();
              _tmp_context.drawImage( _canvas, 0, 0, _tmp_canvas.get_width(), _tmp_canvas.get_height() );
              var PIXDATA = _tmp_canvas.toDataURL( 'image/jpeg', 1.0 );
         			doc.addImage( PIXDATA, 'JPEG', _left, _top, _pix_side - 3, _pix_side - 3 );
              doc.setDrawColor(212, 212, 212);
              doc.roundedRect( _left - 2, _top - 2, _pix_side + 2, _pix_side + 2, 5, 5, 'D');

              var PIXDATA = null ;
              doc.setTextColor(0, 0, 0);
         }

         var doc = new jsPDF();
         _top = pdf_header( doc, 1 );
         				pdf_pix( doc, _canvas, 25, 25, 120 );
         doc.output( "save", _filename );
				 return [ 1, "Saving the "+_extension.toUpperCase()+" file: now wait for the dialog box to open" ];
     }
     else
     {
        var _msg = "Code is not available to save the PDF file" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
        else return [ 0, _msg ];
     }
}