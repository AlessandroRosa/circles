var CIRCLESembeddingsMASKITTWICE_active = 0 ;
var CIRCLESembeddingsMASKITTWICE_TAU_1 = "" ;
var CIRCLESembeddingsMASKITTWICE_TAU_2 = "" ;
var CIRCLESembeddingsMASKITTWICE_TAU_1_complex = new complex( 0, 0 );
var CIRCLESembeddingsMASKITTWICE_TAU_2_complex = new complex( 0, 0 );
var CIRCLESembeddingsMASKITTWICE_PRESETSarray = [], CIRCLESembeddingsMASKITTWICE_REMOTECTRLkeywords = [] ;
var CIRCLESembeddingsMASKITTWICE_form_flag = 0 ; // MAXI = 0, MINI = 1

var CIRCLESembeddingsMASKITTWICEremotectrlCOMMANDS = { "move" : "<lightblue>move the popup to the input position: left, top, right, bottom</lightblue>" } ; // json entry key : desc string (with color tags)
var CIRCLESembeddingsMASKITTWICEopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' }
                                        } ;