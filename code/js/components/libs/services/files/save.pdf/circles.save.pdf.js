function circles_lib_files_pdf_save_canvas() { var _caller_type = arguments[0] != null ? safe_int( arguments[0], CALLER_TYPE_NONE ) : CALLER_TYPE_NONE ; }
function circles_lib_files_pdf_save_ask( _fn = null, _silent = NO, _out_channel = OUTPUT_SCREEN )
{
     _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
     if ( !object_exists( _fn ) )
     {
         var _msg = "Missing parameters to save the PDF" ;
         if ( _out_channel == OUTPUT_SCREEN ) circles_lib_output( _out_channel, DISPATCH_CRITICAL, _msg, _glob_app_title );
         return [ RET_ERROR, _msg ] ;
     }
     else
     {
        var _args = [];
        for( var _i = 3 ; _i < arguments.length ; _i++ ) _args.push( arguments[_i] );
		_fn.apply(this,_args);
     }
}

function circles_lib_files_pdf_header( doc, _page_no = 0 )
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

function circles_lib_files_pdf_add_pix( doc, _left, _top, _display_zplane = NO, _display_wplane = NO )
{
     var _tmp_canvas = document.createElement( "canvas" );
         _left = 130, _top = 25 ;
     var _zplane_rendering_canvas = _glob_zplane_rendering_layer_pointer ;
     var _wplane_rendering_canvas = _glob_wplane_rendering_layer_pointer ;
     _display_zplane = safe_int( _display_zplane, NO );
     _display_wplane = safe_int( _display_wplane, NO );

     // display Z-plane on the pdf
     if ( _display_zplane )
     {
         doc.setTextColor(0, 0, 212);
         doc.setFontSize( 9 );
         doc.text( _left, _top, "Z-plane" );
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
    
     }

     if ( _display_wplane )
     {
         var PIXDATA = null ;
         if ( _display_zplane ) _top += 12 ;
    
         // display W-plane on the pdf
         doc.setFontSize( 9 );
         doc.text( _left, _top, "W-plane" );
         doc.setFontSize( 8 );
         _top += 3 ;
         _tmp_canvas.set_width( _wplane_rendering_canvas.get_width() );
         _tmp_canvas.get_height() = _wplane_rendering_canvas.get_height();
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
}

function circles_lib_files_pdf_save_text()
{
	var _caller_type = arguments[0] != null ? safe_int( arguments[0], CALLER_TYPE_NONE ) : CALLER_TYPE_NONE ;
    var _font_family = "", _font_style = "", _attributes = [] ;
     switch( _caller_type )
     {
          case CALLER_TYPE_CMD:
          var _textARRAY = ( arguments[1].includes( _glob_crlf ) ) ? arguments[1].split( _glob_crlf ) : [ arguments[1] ] ;
          var _filename = arguments[2] ;
          var _include_canvas = safe_int( arguments[3], NO );
          var _cmd_caller = arguments[4] ;
          if ( _cmd_caller.stricmp( "canvas" ) )
          {
              _font_family = "Courier" ;
              _font_style = "" ;
          }
		  if ( is_array( arguments[5] ) ) _attributes = arguments[5] ;
          break ;
          case CALLER_TYPE_NONE: break ;
	      default: break ;
     }
	 
     var doc = new jsPDF();

     if ( _font_family.length > 0 ) doc.setFont( _font_family, _font_style );
     doc.setFillColor( 244, 244, 244 );
     doc.rect( 0, 0, 70, 297, 'F');

     doc.setFontSize( 7 );
     doc.text( 140, 15, "Document printed on " + now() )

     doc.setFontSize( 14 );
     var _left = 10, _top = 15 ;
     doc.text( _left, _top, _glob_app_title );
     doc.setFontSize( 8 );
     _top += 4 ;
     doc.text( _left, _top, _glob_appSUBTITLE );
     _top += 10 ;

     doc.setFontSize( 8 );
     doc.setTextColor(0, 0, 0);
     var _row = "", _start_tag, _end_tag, _tag, _triplet ;

     for( _l = 0 ; _l < _textARRAY.length ; _l++ )
     {
         _row = _textARRAY[_l].trim();
         _start_tag = _row.indexOf( "<" ), _end_tag = _row.indexOf( ">" );
         if ( _start_tag != UNFOUND && _end_tag != UNFOUND )
         {
              _tag = _row.substr( _start_tag + 1, _end_tag - _start_tag - 1 );
              _triplet = circles_lib_colors_get_formats( _tag )[1] ;
              _triplet = _triplet.replaceAll( [ "rgb", "(", ")" ], "").split( "," );
              doc.setTextColor(_triplet[0], _triplet[1], _triplet[2]);
         }
         else doc.setTextColor(0, 0, 0);

         _top += 3 ;
         _row = ( _row.length > 0 ) ? _row.strip_tags() : " " ;
         if ( _row.length > 80 )
         {
              _row = _row.tokenizer( 80 );
              for( var _r = 0 ; _r < _row.length ; _r++ )
              {
                  doc.text( _left, _top, _row[_r] );
                  _top += 3 ;
              }
         }
         else doc.text( _left, _top, _row );
     }

     if ( _include_canvas )
     {
		 var _z_merge = _attributes.includes_i( "z-merge" ), _w_merge = _attributes.includes_i( "w-merge" );
		 var _z_layer = null ; _attributes.forEach( function( _cmd ){ if ( _cmd.start_with_i( "z-layer" ) ) _z_layer = _cmd.replace( /z-layer:/g, "" ) ; } ) ;
		 var _w_layer = null ; _attributes.forEach( function( _cmd ){ if ( _cmd.start_with_i( "w-layer" ) ) _w_layer = _cmd.replace( /w-layer:/g, "" ) ; } ) ;
         var _tmp_canvas = document.createElement( "canvas" );
              _left = 130, _top = 25 ;
         var _zplane_rendering_canvas = null ;
		     if ( _z_merge ) _zplane_rendering_canvas = circles_lib_canvas_merge_all_per_plane( Z_PLANE ) ;
			 else _zplane_rendering_canvas = _z_layer != null ? circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_DEF, _z_layer ) : _glob_zplane_rendering_layer_pointer ;
			 console.log( _zplane_rendering_canvas );
         var _wplane_rendering_canvas = null ;
			 if ( _w_merge ) _wplane_rendering_canvas = circles_lib_canvas_merge_all_per_plane( W_PLANE ) ;
			 else _wplane_rendering_canvas = _w_layer != null ? circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_DEF, _w_layer ) : _glob_wplane_rendering_layer_pointer ;

          // display Z-plane on the pdf
          doc.setTextColor(0, 0, 212);
          doc.setFontSize( 9 );
          doc.text( _left, _top, "Z-plane" );
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
          doc.text( _left, _top, "W-plane" );
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
          doc.roundedRect( _left, _top, 60, 60, 5, 5, 'D');
          _top += 66 ;
          doc.text( _left, _top, "Left : " + _glob_wplaneLEFT );
          _top += 4 ;
          doc.text( _left, _top, "Right : " + _glob_wplaneRIGHT );
          _top += 4 ;
          doc.text( _left, _top, "Top : " + _glob_wplaneTOP );
          _top += 4 ;
          doc.text( _left, _top, "Bottom : " + _glob_wplaneBOTTOM );
     }

     doc.output( "save", _filename );
}

function circles_lib_files_pdf_save_report()
{
		if ( is_string( arguments[0] ) )
		{
				switch( arguments[0].toLowerCase() )
				{
						case "zplane": case "z-plane": _plane_type = Z_PLANE ; break ;
						case "wplane": case "w-plane": _plane_type = W_PLANE ; break ;
						default: _plane_type = Z_PLANE ; break ;
				}
		}
    _plane_type = safe_int( _plane_type, Z_PLANE );

    var _caller_type = arguments[0] != null ? safe_int( arguments[0], CALLER_TYPE_NONE ) : CALLER_TYPE_NONE ;
    var _plane_type = arguments[1] != null ? safe_int( arguments[1], NO_PLANE ) : NO_PLANE ;
    var _canvas_id = arguments[2] != null ? ( new String( arguments[2] ).replace( "#", "" ) ) : "" ;
    var _display_zplane = arguments[3] != null ? safe_int( arguments[3], YES ) : YES ;
    var _display_wplane = arguments[4] != null ? safe_int( arguments[4], YES ) : YES ;
    
    var _zplane_rendering_canvas = null, _wplane_rendering_canvas = null, _bip_canvas = null ;
    var _str = circles_lib_plane_def_get( _plane_type );

    _zplane_rendering_canvas = _glob_zplane_rendering_layer_pointer ;
    _wplane_rendering_canvas = _plane_type.is_one_of( W_PLANE ) ? _glob_wplane_rendering_layer_pointer : ( $("#" + _canvas_id ).get(0) != null ? $("#" + _canvas_id ).get(0) : _glob_bip_layer_pointer );
			
		var _alphabet =  circles_lib_alphabet_get();
		var _reduced_words = _dictionary_init_settings_array['use_reduced_words'] ;
    var _allow_repetitions = _dictionary_init_settings_array['allow_repetition'] ;
    var _inversel_symbols = _dictionary_init_settings_array['compute_inv_symbol'] ;
    var _only_longest = _dictionary_init_settings_array['longest_words_only'] ;
		var _crash_words_packed = _dictionary_init_settings_array['crash_words_packed'] ;
		var _process = _glob_dict_processor.get_process(), _process_str = "" ;
				switch( _process )
				{
						case _DICTIONARY_PROGRESSIVE_PROCESS: _process_str = "progressive" ; break ;
						case _DICTIONARY_AUTOMATON_PROCESS: _process_str = "by automaton" ; break ;
		        default: break ;
				}

		var _generators_set_array = circles_lib_gens_get ? _glob_gens_model_array : null ;
		var _generators_set_packed = is_array( _generators_set_array ) ? _generators_set_array.join( "," ) : "" ;

    var _filename = _str + !( _str.toLowerCase().right(4).stricmp( ".pdf" ) ) ? ".pdf" : "" ;
    		_filename = _filename.replaceAll( "..", "." );
    var _basename = basename( _filename );
    var _extension = ( _filename.includes( "." ) ) ? _filename.split( ".").get_last() : "" ;
		_filename = ( _glob_title.length > 0 ) ? ( _glob_title + "." + _basename + "." +  _extension ) : "circles." + _filename ;

    var doc = new jsPDF();
        doc.setFillColor( 244, 244, 244 );
        doc.rect( 0, 0, 70, 297, 'F');
          
        doc.setFontSize( 7 );
        doc.text( 140, 15, "Document printed on " + now() )

    doc.setFontSize( 14 );
    var _left = 10, _top = 15 ;
    doc.text( _left, _top, _glob_app_title );
    doc.setFontSize( 8 );
    doc.text( _left + 18, _top, _glob_appSUBTITLE );

    doc.setFontSize( 6 );
    _glob_text = "" ;
    circles_lib_terminal_load_cmd( "config", OUTPUT_TEXT, OUTPUT_TEXT, TERMINAL_CMD_MODE_ACTIVE );

    _glob_text = _glob_text.replaceAll( "<lightblue>", "" );
    _glob_text = _glob_text.replaceAll( "</lightblue>", "" );
    _glob_text = _glob_text.replaceAll( " <skyblue>", "@@@" );
    _glob_text = _glob_text.replaceAll( " <gray>", "@@@" );
    _glob_text = _glob_text.replaceAll( "</skyblue>", "" );
    _glob_text = _glob_text.replaceAll( "</gray>", "" );
    _glob_text = _glob_text.replaceAll( "<lavender>", "" );
    _glob_text = _glob_text.replaceAll( "</lavender>", "" );
      
    _glob_text = _glob_text.strip_tags();
      
    _glob_textARRAYperROWS = _glob_text.split( _glob_crlf );
    for( var _l = 0 ; _l < _glob_textARRAYperROWS.length ; _l++ ) _glob_textARRAYperROWS[_l] = _glob_textARRAYperROWS[_l].split( "@@@" );

    for( var _l = 0 ; _l < _glob_textARRAYperROWS.length ; _l++ )
    {
        if ( _glob_textARRAYperROWS[_l][0].length == 0 )
        {
            _glob_textARRAYperROWS.remove( _l, _l );
            _l = -1 ;
        }
    }
      
      var _text_array = _glob_text.split( _glob_crlf ), _entry ;
      _top += 8 ;
      doc.setFontSize( 9 );
      doc.setTextColor(0, 0, 255);
      _entry = _text_array[0] ;
      doc.text( _left, _top, _entry );
      doc.setFontSize( 6 );
      doc.setTextColor(0, 0, 0);
      for( _l = 1 ; _l < _glob_textARRAYperROWS.length ; _l++ )
      {
           doc.setTextColor(0, 0, 0);
           _entry = _glob_textARRAYperROWS[_l].subset( _glob_textARRAYperROWS[_l].length - 1 );
           _entry = _entry.join( " ").trim();
           _top += 3 ;
           if ( _entry.length == 0 ) // in case of groups title, this string is empty
           {
               doc.setTextColor(255,171,78);
               _entry = _glob_textARRAYperROWS[_l].get_last();
               doc.text( _left, _top, _entry );
               doc.setTextColor(0, 0, 0);
           }
           else
           {
               doc.text( _left, _top, _entry );
               doc.setTextColor(0, 0, 212);
               _entry = _glob_textARRAYperROWS[_l].get_last();
               doc.text( _left + 53, _top, _entry );
           }
      }
      
      doc.setFontSize( 9 );
      doc.setTextColor(0, 0, 255);
      _top += 7 ;
      doc.text( _left, _top, "Main features" );
      doc.setTextColor(0, 0, 0);
      doc.setFontSize( 6 );
      _top += 3 ;
      doc.text( _left, _top, "Method : " + circles_lib_method_get_def( _glob_method ) );
      _top += 3 ;
      doc.text( _left, _top, "Process : " + circles_lib_process_get_def( _glob_process ) );
      _top += 3 ;
      doc.text( _left, _top, "Draw entity : " + circles_lib_drawentity_get_def( _glob_drawentity ) );
      _top += 3 ;
      doc.text( _left, _top, "Construction : " + circles_lib_construction_mode_get_def( _glob_construction_mode ) );

      _top += 6 ;
      doc.setFontSize( 9 );
      doc.setTextColor(0, 0, 255);
      doc.text( _left, _top, "Dictionary" );
      doc.setTextColor(0, 0, 0);
      doc.setFontSize( 6 );
      _top += 3 ;
      doc.text( _left, _top, "Alphabet : " + ( is_array( _alphabet ) ? _alphabet.join( "," ) : "none" ) );
      if ( _crash_words_packed.length > 0 )
      {
           _top += 3 ;
           doc.text( _left, _top, "Crash words : " + _crash_words_packed.replaceAll( "|", "," ) );
      }
      
      _top += 3 ;
      doc.text( _left, _top, "Dictionary generation : " + _process_str );
      _top += 3 ;
      doc.text( _left, _top, "Use reduced words : " + ( _reduced_words ? "yes" : "no" ) );
      _top += 3 ;
      doc.text( _left, _top, "Allow repetitions : " + ( _allow_repetitions ? "yes" : "no" ) );
      _top += 3 ;
      doc.text( _left, _top, "Compute inverse symbols : " + ( _inversel_symbols ? "yes" : "no" ) );
      _top += 3 ;
      doc.text( _left, _top, "Keep longest words only : " + ( _only_longest ? "yes" : "no" ) );
      if ( _generators_set_packed.length > 0 )
      {
         _top += 3 ;
         doc.text( _left, _top, "Generators : " + _generators_set_packed );
      }

      var _items_n = circles_lib_count_items();
      _top += 8 ;
      doc.setFontSize( 9 );
      doc.setTextColor(0, 0, 255);
      doc.text( _left, _top, _items_n + " generator" + ( _items_n == 1 ? "" : "s" ) );
      doc.setTextColor(0, 0, 0);
      doc.setFontSize( 6 );
      if ( _items_n > 0 )
      {
           var _gens_array = [], ITEM, _symbol, _inv_symbol;
           for( var _i = 0 ; _i < _items_n ; _i++ )
           {
                ITEM = _glob_seeds_array[_i] ;
                if ( is_item_obj( ITEM ) )
                {
                    _symbol = ITEM.symbol, _inv_symbol = ITEM.inverse_symbol.trim();
                    _gens_array.push( "--STARTNEWGEN--" );
                    _gens_array.push( _symbol + ( ( _inv_symbol.length > 0 ) ? " (inverse map is with symbol '" + _inv_symbol + "')" : "" )  );
                    $.each( ITEM.map.output().split( _glob_crlf ), function( _i, _param ) { _gens_array.push( _param ); } );
                    _gens_array.push( "--FEATURES--" );
                    _gens_array.push( "Trace: " + ITEM.map.trace().pow(2).formula() );
                    _gens_array.push( "Determinant: " + ITEM.map.det().formula() );
                    _gens_array.push( "Normalized: " + ( ITEM.map.is_normalized() ? "yes" : "no" ) );
                    if ( ITEM.map.is_normalized() )
                    {
                        _gens_array.push( "Classification: " + ITEM.map.classification(0) );
                        _gens_array.push( "Kind: " + ITEM.map.kind(0) );
                    }
                    else _gens_array.push( "not normalized: gens can't be classified" );
                }
           }

           _gens_array.push( "--CLOSE--" );

           var _gg_n = safe_size( _gens_array, 0 );
           for( _i = 0 ; _i < _gg_n ; _i++ )
           {
               if ( _gens_array[_i].strcmp( "--CLOSE--" ) )
               {
                   _top += 6 ;
                   break ;
               }
               else if ( _gens_array[_i].strcmp( "--FEATURES--" ) )
               {
                   doc.setTextColor(0, 0, 0);
                   continue ;
               }
               else if ( _gens_array[_i].strcmp( "--STARTNEWGEN--" ) )
               {
                   doc.setTextColor(0, 0, 0);
                   _i++ ;
                   _top += 4 ;
                   doc.text( _left, _top, _gens_array[_i] );
                   doc.setTextColor(0, 0, 212);
                   continue ;
               }
               else if ( _gens_array[_i].strcmp( "--STARTNEWGEN--" ) )
               {
                   doc.setTextColor(0, 0, 212);
                   continue ;
               }

               _top += ( _gens_array[_i].strcmp( "--NEWGEN--" ) ) ? 4 : ( _gens_array[_i].strcmp( "--CLOSE--" ) ? 6 : 3 );
               if ( !( _gens_array[_i].strcmp( "--NEWGEN--" ) ) ) doc.text( _left, _top, _gens_array[_i] );
           }
      }

      if ( _plugin_last_ref != 0 )
      {
           var _index_ref = _plugin_last_ref, _vars_array = _plugin_rec_configs_array[ _index_ref ] ;
		   console.log( _vars_array );
           if ( is_consistent_array( _vars_array ) )
           {
                var _plugin_def = _plugin_definitions_array[_index_ref] ;
                var _entry = "" ;
                doc.setTextColor(0, 0, 0);
                _top = 145, _left = 130 ;
                doc.text( _left, _top, "Plug-in configuration" );
                _top += 3 ;
                doc.setTextColor(0, 0, 212);
                doc.text( _left, _top, "Definition : " + _plugin_def );

                var _keys = _vars_array.keys_associative(), _role = "" ;
                $.each( _keys, function( _i, _key )
                        {
                           _top += 3 ;
                           _role = _plugin_vars_array[_index_ref][_key]['role'] ;
                           _entry = _key + " : " + _vars_array[''+_key] + ( _role != null ? " - ("+_role+")" : "" );
                           doc.text( _left, _top, _entry );
                        } );
           }
      }

      var _tmp_canvas = document.createElement( "canvas" );
          _left = 100, _top = 25 ;

      // display Z-plane on the pdf
      if ( _display_zplane )
      {
          doc.setTextColor(0, 0, 212);
          doc.text( _left, _top, "Z-plane configuration (isometric circles)" );
          _top += 3 ;
              _tmp_canvas.set_width( _zplane_rendering_canvas.get_width() );
              _tmp_canvas.set_height( _zplane_rendering_canvas.get_height() );
          var _tmp_context = _tmp_canvas.getContext( _glob_canvas_ctx_2D_mode );
              _tmp_context.rect( 0, 0, _tmp_canvas.get_width(), _tmp_canvas.get_height() );
              _tmp_context.fillStyle = "white" ;
              _tmp_context.fill();
              _tmp_context.drawImage( _zplane_rendering_canvas, 0, 0, _tmp_canvas.get_width(), _tmp_canvas.get_height() );
          var PIXDATA = _tmp_canvas.toDataURL( 'image/jpeg', 1.0 );
    			doc.addImage( PIXDATA, 'JPEG', _left, _top, 90, 90 );
          doc.setDrawColor(212, 212, 212);
          doc.roundedRect( _left, _top, 90, 90, 5, 5, 'D');
          _top += 91 ;
          doc.roundedRect( _left, _top, 90, 20, 5, 5, 'D');
          doc.text( _left + 4, _top + 5, "Left : " + _glob_zplaneLEFT );
          _top += 4 ;
          doc.text( _left + 4, _top + 5, "Right : " + _glob_zplaneRIGHT );
          _top += 4 ;
          doc.text( _left + 4, _top + 5, "Top : " + _glob_zplaneTOP );
          _top += 4 ;
          doc.text( _left + 4, _top + 5, "Bottom : " + _glob_zplaneBOTTOM );
          _top += 12 ;
      }

      if ( _plane_type.is_one_of( W_PLANE, BIP_BOX ) && _display_wplane )
      {
          var PIXDATA = null, _construction = "" ;
          if ( _glob_construction_mode == CONSTRUCTION_TILING ) _construction = "Rendering - Tiling" ;
          else if ( _glob_construction_mode == CONSTRUCTION_LIMITSET ) _construction = "Rendering - Limit set" ;

          doc.setTextColor(0, 0, 212);
          doc.text( _left, _top, _construction );
          _top += 3 ;

              _tmp_canvas.set_width( _wplane_rendering_canvas.get_width() );
              _tmp_canvas.set_height( _wplane_rendering_canvas.get_height() );
          var _tmp_context = _tmp_canvas.getContext( _glob_canvas_ctx_2D_mode );
              _tmp_context.rect( 0, 0, _tmp_canvas.get_width(), _tmp_canvas.get_height() );
              _tmp_context.fillStyle = "white" ;
              _tmp_context.fill();
              _tmp_context.drawImage( _wplane_rendering_canvas, 0, 0, _tmp_canvas.get_width(), _tmp_canvas.get_height() );
          PIXDATA = _tmp_canvas.toDataURL( 'image/jpeg', 1.0 );
    			doc.addImage( PIXDATA, 'JPEG', _left, _top, 90, 90 );
          doc.setDrawColor(212, 212, 212);
          doc.roundedRect( _left, _top, 90, 90, 5, 5, 'D');
          _top += 91 ;
          doc.roundedRect( _left, _top, 90, 20, 5, 5, 'D');
          doc.text( _left + 4, _top + 5, "Left : " + _glob_wplaneLEFT );
          _top += 4 ;
          doc.text( _left + 4, _top + 5, "Right : " + _glob_wplaneRIGHT );
          _top += 4 ;
          doc.text( _left + 4, _top + 5, "Top : " + _glob_wplaneTOP );
          _top += 4 ;
          doc.text( _left + 4, _top + 5, "Bottom : " + _glob_wplaneBOTTOM );
      }

      doc.output( "save", _filename );
}