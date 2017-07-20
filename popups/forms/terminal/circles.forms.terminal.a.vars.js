var CIRCLESformsTERMINALtab_container = null ;
var CIRCLESformsTERMINALtab_01 = null ;
var CIRCLESformsTERMINALtab_02 = null ;
var CIRCLESformsTERMINALtab_03 = null ;
var CIRCLESformsTERMINALform_div = null ;
var CIRCLESformsTERMINALform_width_px = null, CIRCLESformsTERMINALform_height_px = null ;
var CIRCLESformsTERMINALform_magnified = NO ;
var CIRCLESformsTERMINALform_original_width = 0 ;
var CIRCLESformsTERMINALform_tab_index = UNDET ;
var CIRCLESformsTERMINALcaption = "Terminal" ;
var CIRCLESformsTERMINALdiv_id = "" ;
var CIRCLESformsTERMINALbaseid = "" ;

var CIRCLESformsTERMINALremotectrlCOMMANDS = { } ; // json entry key : desc string (with color tags)
var CIRCLESformsTERMINALopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' },
      'tab' : { 'desc' : 'open that tab at form show-up', 'values' : 'console|batch|debug' },
      'width' : { 'desc' : 'set the form width at opening (not exceeding the viewport width)', 'values' : 'positive integer' },
      'height' : { 'desc' : 'set the form height at opening (not exceeding the viewport height)', 'values' : 'positive integer' }
    } ;