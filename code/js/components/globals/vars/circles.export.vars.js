var _glob_export_format= EXPORT_NONE ;
var _glob_export_filename = "" ;
var _glob_export_code_array = [];

var _glob_js_e_ps_obj = new jseps();
var _glob_js_latex_obj = new laTeXpic();

var _glob_e_ps_language_level = 2 ;

// SVG EDITOR VARS
var _svg_editor_line_start = 1 ;
var _svg_editor_line_end = 1 ;

// don't put constant identifiers cause the interpreter won't recognize them at start-up
var _svg_editor_frozen_selection_start_pos = -1 ;
var _svg_editor_frozen_selection_end_pos = -1 ;
var _svg_editor_frozen_selection_text = "" ;
var _svg_editor_coords_ref = W_PLANE ;
var _svg_editor_ref_canvas_dims_array = null ;
var _svg_editor_updated = NO ;
var _svg_allow_dashline_for_border_off = NO ;

var _glob_latex_options = [] ;
    _glob_latex_options['offset_x'] = 0 ;
    _glob_latex_options['offset_y'] = 0 ;
    _glob_latex_options['paperheight'] = '9.75in' ;
    _glob_latex_options['paperwidth'] = '9.40in' ;
    _glob_latex_options['margin'] = '1in' ;
    _glob_latex_options['heightrounded'] = YES ;
    _glob_latex_options['left'] = '20mm' ;
    _glob_latex_options['right'] = '20mm' ;
    _glob_latex_options['top'] = '15mm' ;
    _glob_latex_options['bottom'] = '20mm' ;
    _glob_latex_options['usecustomfonts'] = 0 ;