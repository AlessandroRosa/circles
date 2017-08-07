var CIRCLESembeddingsRILEY_active = 0 ;
var CIRCLESembeddingsRILEY_rho = "" ;
var CIRCLESembeddingsRILEY_rho_complex = new complex( 0, 0 );
var CIRCLESembeddingsRILEY_PRESETSarray = [], CIRCLESembeddingsRILEY_REMOTECTRLkeywords = [] ;
var CIRCLESembeddingsRILEY_form_flag = 0 ; // MAXI = 0, MINI = 1

var CIRCLESembeddingsRILEYremotectrlCOMMANDS = { "move" : "<lightblue>move the popup to the input position: left, top, right, bottom</lightblue>" } ; // json entry key : desc string (with color tags)
var CIRCLESembeddingsRILEYopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' }
                                        } ;