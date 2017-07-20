var CIRCLESembeddingsMASKITONCE_active = 0 ;
var CIRCLESembeddingsMASKITONCE_mu = "" ;
var CIRCLESembeddingsMASKITONCE_mu_complex = new complex( 0, 0 );
var CIRCLESembeddingsMASKITONCE_PRESETSarray = [], CIRCLESembeddingsMASKITONCE_REMOTECTRLkeywords = [] ;
var CIRCLESembeddingsMASKITONCE_form_flag = 0 ; // MAXI = 0, MINI = 1

var CIRCLESembeddingsMASKITONCEremotectrlCOMMANDS = { "move" : "<lightblue>move the popup to the input position: left, top, right, bottom</lightblue>" } ; // json entry key : desc string (with color tags)
var CIRCLESembeddingsMASKITONCEopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' }
                                        } ;