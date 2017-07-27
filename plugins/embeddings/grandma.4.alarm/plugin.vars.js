var CIRCLESembeddingsGRANDMA4ALARM_active = 0 ;
var CIRCLESembeddingsGRANDMA4ALARM_trA = "" ;
var CIRCLESembeddingsGRANDMA4ALARM_trB = "" ;
var CIRCLESembeddingsGRANDMA4ALARM_trAB = "" ;
var CIRCLESembeddingsGRANDMA4ALARM_trA_complex = new complex( 0, 0 );
var CIRCLESembeddingsGRANDMA4ALARM_trB_complex = new complex( 0, 0 );
var CIRCLESembeddingsGRANDMA4ALARM_trAB_complex = new complex( 0, 0 );
var CIRCLESembeddingsGRANDMA4ALARM_param = 1 ;
var CIRCLESembeddingsGRANDMA4ALARM_PRESETSarray = [], CIRCLESembeddingsGRANDMA4ALARM_REMOTECTRLkeywords = [] ;
var CIRCLESembeddingsGRANDMA4ALARM_form_flag = 0 ; // MAXI = 0, MINI = 1

var CIRCLESembeddingsGRANDMA4ALARMremotectrlCOMMANDS = { "move" : "<lightblue>move the popup to the input position: left, top, right, bottom</lightblue>" } ; // json entry key : desc string (with color tags)
var CIRCLESembeddingsGRANDMA4ALARMopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' }
                                        } ;