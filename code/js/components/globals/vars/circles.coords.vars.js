var _glob_show_grid_zplane = YES, _glob_show_grid_wplane = YES ;
var zplane_sm = null, wplane_sm = null, bipbox_sm = null, dlocus_sm = null ;
var _glob_zoomRECT = null, _glob_zoomSTARTpt = null, _glob_zoomENDpt = null ;

var _glob_zplaneLEFT = -DEFAULT_PLANE_COORD ;
var _glob_zplaneRIGHT = DEFAULT_PLANE_COORD ;
var _glob_zplaneTOP = DEFAULT_PLANE_COORD ;
var _glob_zplaneBOTTOM = -DEFAULT_PLANE_COORD ;

var _glob_wplaneLEFT = -DEFAULT_PLANE_COORD ;
var _glob_wplaneRIGHT = DEFAULT_PLANE_COORD ;
var _glob_wplaneTOP = DEFAULT_PLANE_COORD ;
var _glob_wplaneBOTTOM = -DEFAULT_PLANE_COORD ;

var _glob_bipLEFT = -DEFAULT_PLANE_COORD ;
var _glob_bipRIGHT = DEFAULT_PLANE_COORD ;
var _glob_bipTOP = DEFAULT_PLANE_COORD ;
var _glob_bipBOTTOM = -DEFAULT_PLANE_COORD ;

var _glob_dlocusLEFT = -DEFAULT_PLANE_COORD ;
var _glob_dlocusRIGHT = DEFAULT_PLANE_COORD ;
var _glob_dlocusTOP = DEFAULT_PLANE_COORD ;
var _glob_dlocusBOTTOM = -DEFAULT_PLANE_COORD ;

var _glob_bipLEFTtmp = 0 ;
var _glob_bipRIGHTtmp = 0 ;
var _glob_bipTOPtmp = 0 ;
var _glob_bipBOTTOMtmp = 0 ;

var _glob_ticks_count = DEFAULT_TICKS ;
var _glob_grid_marker_len = 8 ;

var _glob_centerX = -2 ;
var _glob_centerY = -2 ;
var _glob_centerRADIUS = -2 ;
var _glob_currentX = -1 ;
var _glob_currentY = -1 ;
var _glob_inversionX = -1 ;
var _glob_inversionY = -1 ;

var _glob_startX = -2, _glob_startY = -2 ;
var _glob_endX = -2, _glob_endY = -2 ;

var _glob_left_border_rect = new rect();
var _glob_right_border_rect = new rect();
var _glob_top_border_rect = new rect();
var _glob_bottom_border_rect = new rect();