var CIRCLESembeddingsJORGENSEN_active = 0 ;
var CIRCLESembeddingsJORGENSEN_alpha = "" ;
var CIRCLESembeddingsJORGENSEN_beta = "" ;
var CIRCLESembeddingsJORGENSEN_param = 1 ;
var CIRCLESembeddingsJORGENSEN_alpha_complex = new complex(0,0);
var CIRCLESembeddingsJORGENSEN_beta_complex = new complex(0,0);
var CIRCLESembeddingsJORGENSEN_alphabeta = "" ;
var CIRCLESembeddingsJORGENSEN_alphabeta_1 = new complex(0,0) ;
var CIRCLESembeddingsJORGENSEN_alphabeta_2 = new complex(0,0) ;
var CIRCLESembeddingsJORGENSEN_PRESETSarray = [], CIRCLESembeddingsJORGENSEN_REMOTECTRLkeywords = [] ;
var CIRCLESembeddingsJORGENSEN_form_flag = 0 ; // MAXI = 0, MINI = 1
var CIRCLESembeddingsJORGENSEN_APPROXplaces = 10 ;

var CIRCLESembeddingsJORGENSENremotectrlCOMMANDS = { "move" : "<lightblue>move the popup to the input position: left, top, right, bottom</lightblue>" } ; // json entry key : desc string (with color tags)
var CIRCLESembeddingsJORGENSENopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' }
                        		                } ;