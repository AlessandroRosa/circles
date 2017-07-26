var _glob_caps_letters_array = [];
var _glob_small_letters_array = [];
// default piling sequence
// from bottom (0-index) to topmost layer (max index)
var _glob_zplane_layers_pile_role_array = [ ROLE_GRID, ROLE_RENDERING, ROLE_FREEDRAW, ROLE_WORK ];
var _glob_wplane_layers_pile_role_array = [ ROLE_GRID, ROLE_RENDERING, ROLE_FREEDRAW, ROLE_WORK ];

var _glob_alphabet = [];
var _glob_app_log = [];
var _glob_code_run_cmds_array = [];
var _glob_figures_array = [];
var _glob_gens_array = [];
var _glob_gens_set_model_array = [];
var _glob_gens_set_symbols_map_array = [];
var _glob_gens_set_store = [] ;
var _glob_input_fixed_pts_array = [];
var _glob_js_code_projs_array = [];
var _glob_limitset_array = [];
var _glob_menu_entries_array = [];
var _glob_mutex = [] ;
var _glob_palette_array = [];
var _glob_persistent_vars = [] ;
var _glob_popups_array = [];
var _glob_popup_divs_rec_positions_array = [];
var _glob_popup_divs_rec_default_metrics_array = [];
var _glob_presets = [] ;
var _glob_random_table_store = [];
var _glob_registered_datatypes = [];
var _glob_repetends_array = [];
var _glob_rnd_probability_array = [];
var _glob_screencircles_sel_array = [] ;
var _glob_script_editor_highlights = [] ;
var _glob_script_editor_reserved_words = [] ;
var _glob_seeds_array = [];
var _glob_storage = [];
var _glob_symbols_index_array = [];
var _glob_terminal_vars_array = [];
var _glob_tinyrender_code_array = [];
var _glob_volatile_settings = []; // vars that are to be erased after reset
var _glob_wplane_selected_items_array = [];
var _glob_zplane_selected_items_array = [];

var _glob_circles_js_translation = [] ;
var _glob_circles_js_translation_methods = [] ;
var _glob_circles_js_translation_methods_index_map = [] ;

var _glob_maps = [];
    _glob_maps["real"] = [ YES, FN_DEF_MOBIUS, "1", "0", "-1", "1", "bijection from the unit disk to the plane Re(w) > -1/2" ] ;
    _glob_maps["unitdisk"] = [ YES, FN_DEF_MOBIUS, "e^(i*$theta)", "-e^(i*$theta)*$a", "-conj($a)", "1", "bijection from the unit disk to itself" ] ;
    _glob_maps["cayley"] = [ YES, FN_DEF_MOBIUS, "1", "-i", "1", "i", "real axis to unit circle" ] ;
    _glob_maps["cayleyinverse"] = [ YES, FN_DEF_MOBIUS, "i", "i", "-1", "1", "unit circle to real axis" ] ;
    _glob_maps["cubic"] = [ YES, FN_DEF_FORMULA, "z^3", "z^(1/3)", "" ] ;
    _glob_maps["D1toH"] = [ YES, FN_DEF_MOBIUS, "1", "i", "i", "1", "bijection from the unit disk to the upper half-plane" ] ;
    _glob_maps["inverse"] = [ YES, FN_DEF_MOBIUS, "1", "0", "1", "0", "Flip the Riemann sphere upside down" ] ;
    _glob_maps["square"] = [ YES, FN_DEF_FORMULA, "z^2", "sqrt(z)", "" ] ;
    _glob_maps["turnleft"] = [ YES, FN_DEF_MOBIUS, "i", "0", "0", "1", "Counter-clockwise rotation of 90 degress" ] ;
    _glob_maps["turnright"] = [ YES, FN_DEF_MOBIUS, "-i", "0", "0", "1", "Clockwise rotation of 90 degress" ] ;

var _glob_groups_table = [];
var _glob_triggers_table = [];

// this is a multi-dimensional array including functions to be executed at a certain
// portions of code, for example after the rendering of the given plane
var _glob_junctions = [] ;
    _glob_junctions['z_plane_afterrender'] = [] ;
    _glob_junctions['w_plane_afterrender'] = [] ;