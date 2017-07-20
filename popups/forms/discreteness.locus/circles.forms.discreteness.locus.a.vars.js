var CIRCLESformsDISCRETENESSLOCUSoriginal_fracs_pts_array = [];
var CIRCLESformsDISCRETENESSLOCUSdisplay_fracs_array = [];
var CIRCLESformsDISCRETENESSLOCUSpq_fracs_array = [];
var CIRCLESformsDISCRETENESSLOCUScomplex_pts_array = [];
var CIRCLESformsDISCRETENESSLOCUSpleating_rays_pts_array = [];
var CIRCLESformsDISCRETENESSLOCUSscreen_locus_pts_array = [];
var CIRCLESformsDISCRETENESSLOCUSscreen_selected_pts_array = [];
var CIRCLESformsDISCRETENESSLOCUStmp_pts_array = [];
var CIRCLESformsDISCRETENESSLOCUSbenchmarkTABLE = [] ;
var CIRCLESformsDISCRETENESSLOCUStmpVARS = [] ;
    CIRCLESformsDISCRETENESSLOCUStmpVARS['screen_rect'] = new rect();

var CIRCLESformsDISCRETENESSLOCUSright_panel_w = 20 ;
var CIRCLESformsDISCRETENESSLOCUSarrow_color = "#1D63AB" ;
var CIRCLESformsDISCRETENESSLOCUSplugin_pick = false ;
var CIRCLESformsDISCRETENESSLOCUStr_A = new complex( 0, 0 );
var CIRCLESformsDISCRETENESSLOCUStr_B = new complex( 0, 0 );
var CIRCLESformsDISCRETENESSLOCUStr_ABab = new complex( -2, 0 );
var CIRCLESformsDISCRETENESSLOCUSstarting_value = new complex( 0, 0 );
var CIRCLESformsDISCRETENESSLOCUSeq_solution = new complex( 0, 0 );

var CIRCLESformsDISCRETENESSLOCUStrace_fix_op = _DLOCUS_TRACE_FIX_DEFAULT_OP ;
var CIRCLESformsDISCRETENESSLOCUScanvas_mouse_proc_switch = MOUSE_NO_PROC_ID ;

var CIRCLESformsDISCRETENESSLOCUSrect = null ;
var CIRCLESformsDISCRETENESSLOCUSzoom_complex_rect = null ;
var CIRCLESformsDISCRETENESSLOCUSzoom_screen_rect = null ;
var CIRCLESformsDISCRETENESSLOCUSzoom_STARTpt = null ;
var CIRCLESformsDISCRETENESSLOCUSzoom_ENDpt = null ;
var CIRCLESformsDISCRETENESSLOCUSwork_layer = null ;
var CIRCLESformsDISCRETENESSLOCUSwork_layer_canvas = null ;

var CIRCLESformsDISCRETENESSLOCUScaption = "Discreteness locus" ;
var CIRCLESformsDISCRETENESSLOCUSdiv_id = "" ;
var CIRCLESformsDISCRETENESSLOCUSbaseid = "" ;

var CIRCLESformsDISCRETENESSLOCUSremotectrlCOMMANDS = { } ; // json entry key : desc string (with color tags)
var CIRCLESformsDISCRETENESSLOCUSopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' }
			                                        } ;