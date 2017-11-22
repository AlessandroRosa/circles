function CIRCLESobjectsINIT( _mask )
{
		if ( _mask == 0 || _mask & 1 )
		{
        circles_lib_events_bind_to_document_body();
		    _glob_word_orbit_pt = new point( null, null );
		    _glob_bip_box_center_pt = new point( 0, 0 );
		}

		if ( _mask == 0 || _mask & 2 ) _glob_dict_processor = new dictionary();
		if ( _mask == 0 || _mask & 4 )
		{
		    zplane_sm = new screen_mapper();
		    zplane_sm.label = circles_lib_plane_def_get_for_cmds( Z_PLANE );
		    wplane_sm = new screen_mapper();
		    wplane_sm.label = circles_lib_plane_def_get_for_cmds( W_PLANE );
		    bipbox_sm = new screen_mapper();
		    bipbox_sm.label = circles_lib_plane_def_get_for_cmds( BIP_BOX );
		    dlocus_sm = new screen_mapper();
		    dlocus_sm.label = circles_lib_plane_def_get_for_cmds( D_LOCUS );
		}

    CIRCLESinitLETTERS( _mask );
    CIRCLESinitLAYERS( _mask );
    CIRCLESinitCOLORS();
}

function CIRCLESinitLAYERS( _mask )
{
    if ( _mask == 0 )
    {
        circles_lib_canvas_layer_create( [ "zplane", "grid", YES, ROLE_GRID, Z_PLANE, YES ] );
        circles_lib_canvas_layer_create( [ "zplane", "rendering", YES, ROLE_RENDERING, Z_PLANE, YES ] );
        circles_lib_canvas_layer_create( [ "zplane", "freedraw", YES, ROLE_FREEDRAW, Z_PLANE, YES ]);
        circles_lib_canvas_layer_create( [ "zplane", "work", YES, ROLE_WORK, Z_PLANE, YES ] );

        circles_lib_canvas_layer_create( [ "wplane", "grid", YES, ROLE_GRID, W_PLANE, YES ] );
        circles_lib_canvas_layer_create( [ "wplane", "rendering", YES, ROLE_RENDERING, W_PLANE, YES ] );
        circles_lib_canvas_layer_create( [ "wplane", "freedraw", YES, ROLE_FREEDRAW, W_PLANE, YES ] );
        circles_lib_canvas_layer_create( [ "wplane", "work", YES, ROLE_WORK, W_PLANE, YES ] );

    		_glob_bip_canvas = $("#CIRCLESbipCANVAS").get(0);
    		_glob_bip_canvas.set_type( BIP_BOX ) ;
    		_glob_bip_canvas.set_role_id( ROLE_BIP ) ;
    		_glob_bip_canvas.set_role_def( "BIP canvas" ) ;
    		_glob_bip_canvas.set_label( "BIP canvas" ) ;
	      _glob_bip_canvas.set_plane_def( "bip" ) ;
	      _glob_bip_canvas.set_defaultcanvas( NO ) ;
	      _glob_bip_canvas.set_visible( NO ) ;
        _glob_bip_canvas.set_backgroundcolor( "transparent" ) ;
	      _glob_bip_canvas.set_complex_rect( new rect() );

    		_glob_svg_canvas = null ;

        _glob_target_zplane_layers_array['grid'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
        _glob_target_zplane_layers_array['rendering'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
        _glob_target_zplane_layers_array['figures'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
        _glob_target_zplane_layers_array['work'] = circles_lib_canvas_layer_find( Z_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );

        _glob_target_wplane_layers_array['grid'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_GRID );
        _glob_target_wplane_layers_array['rendering'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_RENDERING );
        _glob_target_wplane_layers_array['figures'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_FREEDRAW );
        _glob_target_wplane_layers_array['work'] = circles_lib_canvas_layer_find( W_PLANE, FIND_LAYER_BY_ROLE_INDEX, ROLE_WORK );
    }
}

function CIRCLESinitLETTERS( _mask )
{
		if ( _mask == 0 || _mask & 8 )
		{
		    for( var ch = 65 ; ch <= 90 ; ch++ ) _glob_caps_letters_array.push( String.fromCharCode( ch ) );
		    for( var ch = 97 ; ch <= 122 ; ch++ ) _glob_small_letters_array.push( String.fromCharCode( ch ) );
		}
}

function CIRCLESinitCOLORS()
{
    COLOR_STD = _glob_def_clrs_tags['tag.black'] ;
    COLOR_DISABLED = _glob_def_clrs_tags['tag.disabled'] ;
    COLOR_INFO = _glob_def_clrs_tags['tag.info'] ;
    COLOR_ERROR = _glob_def_clrs_tags['tag.error'] ;
    COLOR_SUCCESS = _glob_def_clrs_tags['tag.success'] ;
    COLOR_WARNING = _glob_def_clrs_tags['tag.warning'] ;
    def_clrs_tags_keys = _glob_def_clrs_tags.keys_associative().work( function( _key ){ return _key.replaceAll( "tag.", "" ) ; } ) ;
}