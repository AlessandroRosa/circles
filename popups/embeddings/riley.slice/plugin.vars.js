var CIRCLESembeddingsRILEYSLICE_active = 0 ;
var CIRCLESembeddingsRILEYSLICE_rho = "" ;
var CIRCLESembeddingsRILEYSLICE_rho_complex = new complex( 0, 0 );
var CIRCLESembeddingsRILEYSLICE_PRESETSarray = [], CIRCLESembeddingsRILEYSLICE_REMOTECTRLkeywords = [] ;
var CIRCLESembeddingsRILEYSLICE_form_flag = 0 ; // MAXI = 0, MINI = 1

var CIRCLESembeddingsRILEYSLICEremotectrlCOMMANDS = { "move" : "<lightblue>move the popup to the input position: left, top, right, bottom</lightblue>" } ; // json entry key : desc string (with color tags)
var CIRCLESembeddingsRILEYSLICEopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' }
                                        } ;