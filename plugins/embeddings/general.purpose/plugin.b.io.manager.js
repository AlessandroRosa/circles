function CIRCLESembeddingsGENERALPURPOSE_LOADgroup( _filename, _file_contents )
{
    var _file_rows = _file_contents.replaceAll( [ CRLF_WIN, CRLF_NO_WIN ], _glob_crlf ).split( _glob_crlf );
    // remove blank entries
    _file_rows = _file_rows.work( function( _entry ) { return ( _entry + "" ).trim().replaceAll( _glob_crlf, "" ); } );
    _file_rows = _file_rows.filtering( function( _entry ) { return ( _entry + "" ).trim().length > 0 ; } ).reset_index();
    var _start_index = 0, _rows_len = safe_size( _file_rows, 0 );
    CIRCLESembeddingsGENERALPURPOSE_gens_container.flush();
    _plugin_user_vars.flush_associative();

    var _CHUNKS = [], _var, _val ;
    for( var _i = 0 ; _i < _rows_len ; _i++ )
    {
     		if ( _file_rows[_i].start_with( "/" ) || _file_rows[_i].start_with( "gens=" ) ) continue ;
     		else if ( _file_rows[_i].start_with( "depth=" ) )
        {
           _file_rows[_i] = _file_rows[_i].replaceAll( "depth=", "" ).trim();
           circles_lib_depth_set( safe_int( _file_rows[_i], 0 ), NO )
        }
    		else if ( _file_rows[_i].start_with( "circletype=" ) )
        {
           _file_rows[_i] = _file_rows[_i].replaceAll( "circletype=", "" ).trim();
           switch( _file_rows[_i] )
           {
              case DRAWENTITY_INVERSION_CIRCLE_DEF:
              GLOB_PLUGIN_CIRCLE_TYPE = DRAWENTITY_INVERSION_CIRCLE ;
              break ;
              case DRAWENTITY_ISOMETRIC_CIRCLE_DEF:
              GLOB_PLUGIN_CIRCLE_TYPE = DRAWENTITY_ISOMETRIC_CIRCLE ;
              break ;
              default:
              GLOB_PLUGIN_CIRCLE_TYPE = DRAWENTITY_ISOMETRIC_CIRCLE ;
              break ;
           }
        }
     		else if ( _file_rows[_i].start_with( "drawentity=" ) )
        {
           _file_rows[_i] = _file_rows[_i].replaceAll( "drawentity=", "" ).trim().toLowerCase();
           switch( _file_rows[_i] )
           {
              case DRAWENTITY_INVERSION_CIRCLE_DEF:
              _glob_drawentity = DRAWENTITY_INVERSION_CIRCLE ;
              break ;
              case DRAWENTITY_ISOMETRIC_CIRCLE_DEF:
              _glob_drawentity = DRAWENTITY_ISOMETRIC_CIRCLE ;
              break ;
              case DRAWENTITY_PIXEL_DEF:
              _glob_drawentity = DRAWENTITY_PIXEL ;
              break ;
              case DRAWENTITY_POINT_DEF:
              _glob_drawentity = DRAWENTITY_POINT ;
              break ;
              default:
              _glob_drawentity = DRAWENTITY_ISOMETRIC_CIRCLE ;
              break ;
           }
         }
         else if ( _file_rows[_i].start_with( "comment=" ) )
         {
           CIRCLESembeddingsGENERALPURPOSEcomment = _file_rows[_i].replaceAll( "comment=", "" ).replaceAll( "@@@", _glob_crlf ).trim();
           if ( CIRCLESembeddingsGENERALPURPOSEcomment.length > 0 ) $( "#PLUGINcommentTEXTAREA" ).val( CIRCLESembeddingsGENERALPURPOSEcomment );
         }
				 else if ( _file_rows[_i].includes( "=" ) && _file_rows[_i].count( "=" ) == 1 )
     		 {
    		 	 if ( _file_rows[_i].start_with( "var@" ) )
    		 	 {
    					_file_rows[_i] = _file_rows[_i].replaceAll( "var@", "" );
    					_var = ( _file_rows[_i].split( "=" ) )[0], _val = ( _file_rows[_i].split( "=" ) )[1] ;
    					if ( !_var.start_with( "_" ) ) _var = "_" + _var ;
    					_plugin_user_vars[ _var ] = _val ; 
    			 }
           else if ( _file_rows[_i].start_with( "rec@" ) )
           {
							_file_rows[_i] = _file_rows[_i].replaceAll( "rec@", "" );
							_var = ( _file_rows[_i].split( "=" ) )[0], _val = ( _file_rows[_i].split( "=" ) )[1] ;
							if ( !_var.start_with( "_" ) ) _var = "_" + _var ;
							if ( _plugin_rec_var_vals[ ''+_var ] == null ) _plugin_rec_var_vals[ ''+_var ] = [] ;
              _plugin_rec_var_vals[ ''+_var ].push( _val ); 
           }
           else
    			 {
    				   _CHUNKS.push( ( _file_rows[_i].split( "=" ) )[1] );
    				   if ( safe_size( _CHUNKS, 0 ) == 4 )
    				   {
    					    CIRCLESembeddingsGENERALPURPOSE_gens_container.push( [ _CHUNKS[0], _CHUNKS[1], _CHUNKS[2], _CHUNKS[3] ] );
    						  _CHUNKS.flush();
    					 }
    			 }
    		 }
     }
        
    $("#PLUGIN_GENERATE_GROUP_BTN").css( "color", DEFAULT_COLOR_GO );
    CIRCLESembeddingsGENERALPURPOSE_GEN_LIST( NO, NO, YES );
    CIRCLESembeddingsGENERALPURPOSE_VAR_REFRESH_PANEL();

    var _msg = "The generators have been correctly loaded." ;
        _msg += "\nNow press the button below to generate the whole group." ;
        _msg += "\n\nThen you can  render it." ;
    alert_msg( ALERT_SUCCESS, _msg, _glob_app_title + " - " + _plugin_definitions_array[_plugin_last_ref] + " - Tips", 440 );
}

function CIRCLESembeddingsGENERALPURPOSE_SAVE_GROUP()
{
  	var _N_GENS = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 ), GEN_CHUNK, _FOUND = NO ;
    if ( _N_GENS == 0 ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't save: no gens have been registered yet.", 'PLUGIN_OUTMSG' ) ;
    else
    {
        var _out_stream = [] ;
            _out_stream.push( "// Circles - general purpose plug-in"  );
            _out_stream.push( "// Group data saved on " + today_date() + " at " + current_time() );
            _out_stream.push( "gens=" + _N_GENS  );
            _out_stream.push( "depth=" + _glob_depth );

        switch( GLOB_PLUGIN_CIRCLE_TYPE )
        {
            case DRAWENTITY_INVERSION_CIRCLE:
            _out_stream.push( "circletype=" + DRAWENTITY_INVERSION_CIRCLE_DEF );
            break ;
            case DRAWENTITY_ISOMETRIC_CIRCLE:
            _out_stream.push( "circletype=" + DRAWENTITY_ISOMETRIC_CIRCLE_DEF );
            break ;
            default:
            _out_stream.push( "circletype=" + DRAWENTITY_ISOMETRIC_CIRCLE_DEF );
            break ;
        }

        switch( _glob_drawentity )
        {
            case DRAWENTITY_INVERSION_CIRCLE:
            _out_stream.push( "drawentity=" + DRAWENTITY_INVERSION_CIRCLE_DEF );
            break ;
            case DRAWENTITY_ISOMETRIC_CIRCLE:
            _out_stream.push( "drawentity=" + DRAWENTITY_ISOMETRIC_CIRCLE_DEF );
            break ;
            case DRAWENTITY_PIXEL:
            _out_stream.push( "drawentity=" + DRAWENTITY_PIXEL_DEF );
            break ;
            case DRAWENTITY_POINT:
            _out_stream.push( "drawentity=" + DRAWENTITY_POINT_DEF );
            break ;
            default:
            _out_stream.push( "drawentity=" + DRAWENTITY_ISOMETRIC_CIRCLE_DEF );
            break ;
        }
            
        CIRCLESembeddingsGENERALPURPOSEcomment = $( "#PLUGINcommentTEXTAREA" ).val();
        _out_stream.push( "comment=" + CIRCLESembeddingsGENERALPURPOSEcomment.replaceAll( [ _glob_crlf, CRLF_WIN, CRLF_NO_WIN ], "@@@" ) );
        $.each( CIRCLESembeddingsGENERALPURPOSE_gens_container, function( _i, _gen_chunk )
                {
                   _out_stream.push( "a"+_i+"=" + _gen_chunk[0] );
                   _out_stream.push( "b"+_i+"=" + _gen_chunk[1] );
                   _out_stream.push( "c"+_i+"=" + _gen_chunk[2] );
                   _out_stream.push( "d"+_i+"=" + _gen_chunk[3] );
                }
              );

    		var _keys = _plugin_user_vars.keys_associative();
        if ( is_array( _keys ) )
        {
        		if ( _keys.length > 0 )
            {
               _out_stream.push( "// Registered variables" );
               $.each( _keys, function( _i, _key ) { _out_stream.push( "var@"+_key+"=" + _plugin_user_vars[ _key ] ); } );
            }
        }

    		var _keys = _plugin_rec_var_vals.keys_associative();
        if ( is_array( _keys ) )
        {
        		if ( _keys.length > 0 )
            {
               _out_stream.push( "// Registered values" );
               var _chunk = null ;
               for( var _k = 0 ; _k < _keys.length ; _k++ )
               {
                  _chunk = _plugin_rec_var_vals[ ""+_keys[_k] ] ;
               		$.each( _chunk,
               		        function( _i, _key )
                          {
                              if ( safe_string( _chunk[ _i ], "" ).trim().length > 0 )
                              _out_stream.push( "rec@"+_keys[_k]+"=" + _chunk[ _i ] );
                          }
              					);
               }
            }
        }
        
        _out_stream = _out_stream.work( function( _row ) { return _row + _glob_crlf } );
        var blob = new Blob( _out_stream, { type: 'plain/text', endings: 'native' });
        saveAs( blob, "circles.general.purpose.plugin.txt" );
    }
}