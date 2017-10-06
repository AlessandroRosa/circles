function circles_lib_drawentity_get_def( _drawentity ) { return _glob_drawentity_defs_array[''+_drawentity] != null ? _glob_drawentity_defs_array[''+_drawentity] : "unknown" ; }
function circles_lib_figure_get_def( _figure_class )       { return _glob_figures_defs_array[''+_figure_class] != null ? _glob_figures_defs_array[''+_figure_class] : "unknown" ; }
function circles_lib_fixedpoints_get_def( _def_type ) { return _glob_fixedpoints_defs_array[''+_def_type] != null ? _glob_fixedpoints_defs_array[''+_def_type] : "unknown" ; }
function circles_lib_fixedpoints_io_get_def( _fc_type )    { return _glob_fixedpt_io_defs_array[''+_fc_type] != null ? _glob_fixedpt_io_defs_array[''+_fc_type] : "unknown" ; }
function circles_lib_construction_mode_get_def( _cm_type ) { return _glob_constr_mode_defs_array[''+_cm_type] != null ? _glob_constr_mode_defs_array[''+_cm_type] : "unknown" ; }
function circles_lib_process_get_def( _proc_type ) { return _glob_proc_defs_array[''+_proc_type] != null ? _glob_proc_defs_array[''+_proc_type] : "unknown" ; }
function circles_lib_method_get_def( _m_type ) { return _glob_method_defs_array[''+_m_type] != null ? _glob_method_defs_array[''+_m_type] : "unknown" ; }
function circles_lib_method_get_def_for_cmds( _m_type ) { return _glob_method_cmd_defs_array[''+_m_type] != null ? _glob_method_cmd_defs_array[''+_m_type] : "unknown" ; }
function circles_lib_get_target_plane()                 { return _glob_target_plane ; }
function circles_lib_set_target_plane( _plane_type )    { return circles_lib_return_plane_type( _plane_type, YES ) ; }
function circles_lib_return_plane_type( _plane_def, _set_target )
{
    if ( is_string( _plane_def ) )
    {
				if ( _plane_def.isAlpha() )
				{	
						_plane_def = _plane_def.replace( /[\_\-\.\s+]/, "" ).toLowerCase();
		        switch( _plane_def )
						{
								case "zplane": _plane_def = Z_PLANE ; break ;
								case "wplane": _plane_def = W_PLANE ; break ;
								case "dlocus": _plane_def = D_LOCUS ; break ;
								case "bipbox": _plane_def = BIP_BOX ; break ;
								case "all": case "allplanes": _plane_def = ALL_PLANES ; break ;
								case "custom": case "customplane": _plane_def = CUSTOM_PLANE ; break ;
		            default: _plane_def = NO_PLANE ; break ;
						}
				}
        else _plane_def = safe_int( _plane_def, NO_PLANE ) ;
		}
    else if ( is_number( _plane_def ) ) _plane_def = safe_int( _plane_def, NO_PLANE ) ;
    else _plane_def = NO_PLANE ;
    _set_target = safe_int( _set_target, YES ) ;
    if ( _set_target ) _glob_target_plane = _plane_def ;
    return _plane_def ;
}

function circles_lib_plane_get_value( _plane_def )
{
    _plane_def = safe_string( _plane_def, "").toLowerCase();
    if ( _plane_def.includes_i( _glob_plane_cmd_defs_array[''+Z_PLANE] ) ) return Z_PLANE ;
    else if ( _plane_def.includes_i( _glob_plane_cmd_defs_array[''+W_PLANE] ) ) return W_PLANE ;
    else if ( _plane_def.includes_i( _glob_plane_cmd_defs_array[''+BIP_BOX] ) ) return BIP_BOX ;
    else return NO_PLANE ;
}

function circles_lib_plane_get_def( _plane_type ) { return _glob_plane_defs_array[''+_plane_type] != null ? _glob_plane_defs_array[''+_plane_type] : "unknown" ; }
function circles_lib_plane_get_def_for_cmds( _plane_type ) { return _glob_plane_cmd_defs_array[''+_plane_type] != null ? _glob_plane_cmd_defs_array[''+_plane_type] : "unknown" ; }
function circles_lib_items_get_def()
{
    if ( _glob_items_switch & ITEMS_SWITCH_SEEDS ) return "seeds" ;
    else if ( _glob_items_switch & ITEMS_SWITCH_GENS ) return "generators" ;
    else return "unknown" ;
}

function circles_lib_items_set( _items_array, _more_infos )
{
    _more_infos = safe_int( _more_infos, NO ) ;
    var _items_label = "", _items_n = 0 ;
    if ( is_string( _items_array ) )
    {
				switch( _items_array.toLowerCase() )
				{
						case "generators": _items_label = "generators" ; _items_array = _glob_gens_array ; _items_switch = ITEMS_SWITCH_GENS ; break ;
						case "seeds": default: _items_label = "seeds" ; _items_array = _glob_seeds_array ; _items_switch = ITEMS_SWITCH_SEEDS ; break ;
				}
		}
    else if ( is_number( _items_array ) )
    {
        _items_switch = _items_array ;
        _items_label = _items_array == ITEMS_SWITCH_GENS ? "generators" : "seeds" ;
        _items_array = _items_array == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    }
    else if ( !is_array( _items_array ) )
    {
        _items_switch = ITEMS_SWITCH_SEEDS ;
        _items_label = "seeds" ;
        _items_array = _glob_seeds_array ;
    }
    _items_n = _more_infos ? circles_lib_count_items( _items_array ) : 0 ;
    return _more_infos ? { 'array' : _items_array, 'switch' : _items_switch, 'label' : _items_label, 'count' : _items_n } : _items_array ;
}

function circles_lib_screen_mapper_get( _plane_type )
{
		_plane_type = circles_lib_return_plane_type( _plane_type, NO ) ;
		var _mapper = null ;
		switch( _plane_type )
		{
				case Z_PLANE: return _mapper = zplane_sm.copy() ; break ;
				case W_PLANE: return _mapper = wplane_sm.copy() ; break ;
				case BIP_BOX: return _mapper = bipbox_sm.copy() ; break ;
				case D_LOCUS: return _mapper = dlocus_sm.copy() ; break ;
				default: break ;
		}
		
		return _mapper ;
}

function circles_lib_context_get( _plane_type, _canvas_def )
{
		_plane_type = circles_lib_return_plane_type( _plane_type, NO ) ;
		var _layer = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_DEF, _role_def ) ;
		return _layer != null ? _layer.getContext(_glob_canvas_ctx_2D_mode) : null ;
}

function circles_lib_mobius_mng_category_get_def( _fn_index )
{
		_fn_index = safe_int( _fn_index, FN_DEF_NONE );
    var _fn_def = "" ;
    switch( _fn_index )
    {
       case FN_DEF_NONE : _fn_def = "none" ; break ;
       case FN_DEF_MOBIUS : _fn_def = "Mobius map" ; break ;
       case FN_DEF_FORMULA : _fn_def = "formula" ; break ;
       default : _fn_def = "none" ; break ;
    }
      
    return _fn_def ;
}