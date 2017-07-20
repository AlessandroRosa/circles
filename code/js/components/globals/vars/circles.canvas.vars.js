var _glob_svg_canvas = null ;
var _glob_custom_use_canvas = null ;
var _glob_redraw_pass_counter = 4 ;

var _glob_available_curr_canvas_array = [] ;
var _glob_rec_canvas_entities_array = [];
var _glob_zplane_merging_array = [];
var _glob_wplane_merging_array = [];
var _glob_target_zplane_layers_array = [] ;
var _glob_target_wplane_layers_array = [] ;

var _glob_src_canvas_mode = ZPLANE_CANVAS_CIRCLESDRAW_MODE ;
/* ZPLANE_CANVAS_CIRCLESDRAW_MODE : circles mode --> to plot circles and to set up Mobius maps
   ZPLANE_CANVAS_NULL_MODE
*/

var _glob_zplane_coords_map = CANVAS_CARTESIAN_MAP, _glob_wplane_coords_map = CANVAS_CARTESIAN_MAP ;
var _glob_context_dims = DIMS_2D ;
var _glob_target_plane = W_PLANE ;
var _glob_canvas_obj_ref = null ; // a temporary obj var
var _glob_disk_drag = NO ;
var _glob_last_pt = new complex(), _glob_use_last_pt = NO ;

var _glob_scheduled_rendering_flag = NO ;
var _glob_scheduled_rendering_milliseconds = 0 ;
var _glob_density_scan_flag = NO ;
var _glob_density_weight_coeff = 0 ;
var _glob_density_rect_side = 30 ;
var _glob_density_rect_lastindex = UNDET ;

// it manages the drawing of dashed borders, depending on the working plane
// refer to rendering lib function CIRCLESrender[Z_PLANE|W_PLANE|BIP_BOX] for specific settings
var _glob_apply_dashed_border = NO ;
// it (de)activates the dashed border in the whole application context
var _glob_activate_dashed_border = NO ;
var _glob_drawentity = DRAWENTITY_NONE ;
var _glob_zplane_disk_draw = YES, _glob_zplane_disk_fill = NO ;
var _glob_wplane_disk_draw = YES, _glob_wplane_disk_fill = NO ;

var _glob_mouse_x = 0, _glob_mouse_y = 0, _glob_coords_array = null ;
var _glob_mouse_prev = [ 0, 0 ], _glob_mouse_curr = [ 0, 0 ] ;
var _glob_mouse_dx = 0, _glob_mouse_dy = 0 ;
var _glob_canvas_bounding_rect = null ;

var _glob_zplane_topmost_canvas_placeholder = null ;
var _glob_wplane_topmost_canvas_placeholder = null ;

var _glob_zplane_grid_canvas_placeholder = null ;
var _glob_zplane_rendering_canvas_placeholder = null ;
var _glob_zplane_freedraw_canvas_placeholder = null ;
var _glob_zplane_work_canvas_placeholder = null ;

var _glob_wplane_grid_canvas_placeholder = null ;
var _glob_wplane_rendering_canvas_placeholder = null ;
var _glob_wplane_freedraw_canvas_placeholder = null ;
var _glob_wplane_work_canvas_placeholder = null ;

var _glob_canvas_width = 0 ;
var _glob_extra_height = 0 ;
var _glob_interface_index = 0, _glob_interface_show = YES ;
var _glob_interface_aspect_ratio = 1 ;
var _glob_smpr = 0 ;

var _glob_orbit_rgb_start = "rgb( 255, 192, 0 )" ;
var _glob_orbit_rgb_end = "rgb( 255, 218, 0 )" ;
var _glob_orbit_palette_array = null ;

var _glob_canvas_ctx_2D_mode = "2d" ;
var _glob_tiny_rendering_ref_id = 0 ;
var _glob_depth = 1 ;
var _glob_pt_border = DEFAULT_PT_BORDER, _glob_pt_radius = DEFAULT_PT_RADIUS ;
var _glob_line_width = DEFAULT_LINE_WIDTH ;
var _glob_opacity = DEFAULT_MAX_OPACITY ;
var _glob_distance_tolerance = DEFAULT_DISTANCE_TOLERANCE ;
var _glob_pixel_size = 1 ;

var _glob_zplane_canvas_timerID = null ;
var _glob_zplane_canvas_timerSECS = 0 ;

var _glob_wplane_canvas_timerID = null ;
var _glob_wplane_canvas_timerSECS = 0 ;

var _glob_zplaneMOUSEleftBTNstatus = OFF ;

var _glob_zplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID ;
var _glob_wplaneMOUSEprocSWITCH = MOUSE_NO_PROC_ID ;
var _glob_statusbarMOUSEprocSWITCH = MOUSE_NO_PROC_ID ;

var _glob_inversion_circle_pre = new circle();
var _glob_inversion_circle_post = new circle();

var _mouse_event_context = null ;
var _mouse_event_dx = 0, _mouse_event_dy ;
var _mouse_event_prev_pt = new point() ;
var _mouse_event_curr_pt = new point() ;
var _mouse_event_rect_left = 0 ;
var _mouse_event_rect_top = 0 ;
var _mouse_event_rect_width = 0 ;
var _mouse_event_rect_height = 0 ;
var _mouse_event_disk_sqrt_radius = 0 ;
var _mouse_event_zoom_rect_side_x = 0 ;
var _mouse_event_zoom_rect_side_y = 0 ;
var _mouse_event_zoom_rect_sign_x = 0 ;
var _mouse_event_zoom_rect_sign_y = 0 ;

var _glob_play_inversion = NO ;
var _glob_play_inversion_screen_pt, _glob_play_inversion_screen_pt_ret ;
var _glob_play_inversion_screen_pt1, _glob_play_inversion_screen_pt1_ret ;
var _glob_play_inversion_dx ;
var _glob_play_inversion_radius, _glob_play_inversion_radius_ret ;