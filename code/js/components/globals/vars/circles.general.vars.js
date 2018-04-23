var _glob_appTITLE = "", _glob_appSUBTITLE = "", _glob_appLASTreleaseDATE = "" ;
var _glob_app_run = NO ;
var _glob_to_save = NO ;
var _glob_fullscreen_mode = NO ;
var _glob_title = "" ;
var _glob_text = "" ; // text var for general use
var _glob_comment = "" ; // comment to the current configuration
var _glob_filter = "" ; // filter for the current configuration
var _glob_verbose = NO ;
var _glob_fn_handler = null ;

var _glob_accuracy = DEFAULT_MAX_ACCURACY ;     // negative powers of 10 
var _glob_show_symbols_zplane = NO ;
var _glob_symbols_display_wplane = NO ;
var _glob_masterdiv_width_percentage = 100.0 ;
var _glob_status_bar_settings = { "orientation" : "", "xloc" : "", "yloc" : "" } ;

var _glob_popup_sel_unique_id = "" ;
var _glob_process_running_flag = NO ;
var _glob_options_mask = 0 ;

var _glob_popup_sliderCTRLarray = [] ;
var _glob_layers_sliderCTRLarray = [];
var _glob_custom_div = null ;
var _glob_last_focus_divid = "" ;

var _glob_popup_mask = 0 ;
    /*
        flag 1: stay always on top
    */

var _glob_mathjs = math, _glob_parser = _glob_mathjs.parser();

var _glob_current_tab = [] ;
var _glob_output_channel = OUTPUT_SCREEN ;
var _glob_crlf = is_win() ? CRLF_WIN : CRLF_NOWIN ;

var _glob_alt_key = NO ;
var _glob_canc_key = NO ;
var _glob_ctrl_key = NO ;
var _glob_esc_key = NO ;
var _glob_shift_key = NO ;

var _glob_benchmark_start_microtime = 0 ;
var _glob_benchmark_end_microtime = 0 ;
var _glob_benchmark_operations = 0 ;

var _glob_scheduled_rendering_timer = null ;
var _glob_scheduled_rendering_interval = 5 ; // in minutes