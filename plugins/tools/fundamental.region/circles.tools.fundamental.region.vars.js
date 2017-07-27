var CIRCLEStoolsFUNDAMENTALREGIONcaption = "Fundamental region" ;
var CIRCLEStoolsFUNDAMENTALREGIONbaseid = "" ;
var CIRCLEStoolsFUNDAMENTALREGIONdiv_id = "" ;
var CIRCLEStoolsFUNDAMENTALREGIONrect = null ;
var CIRCLEStoolsFUNDAMENTALREGIONwork_layer = null ;
var CIRCLEStoolsFUNDAMENTALREGIONlayerREF = null ;

var CIRCLEStoolsFUNDAMENTALREGIONwords = [] ;
var CIRCLEStoolsFUNDAMENTALREGIONisometric_circles = [] ;

var CIRCLEStoolsFUNDAMENTALREGIONmapper = new screen_mapper();
var CIRCLEStoolsFUNDAMENTALREGIONcanvas_mouse_proc_switch = MOUSE_NO_PROC_ID ;
var CIRCLEStoolsFUNDAMENTALREGIONwork_layer = null ;
var CIRCLEStoolsFUNDAMENTALREGIONwork_layer_canvas = null ;

var CIRCLEStoolsFUNDAMENTALREGION_PROC_NONE = 0 ;
var CIRCLEStoolsFUNDAMENTALREGION_PROC_STD = 1 ;
var CIRCLEStoolsFUNDAMENTALREGION_PROC_FORD = 2 ;

var CIRCLEStoolsFUNDAMENTALREGIONremotectrlCOMMANDS = { } ; // json entry key : desc string (with color tags)
var CIRCLEStoolsFUNDAMENTALREGIONopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' }
                                        } ;
