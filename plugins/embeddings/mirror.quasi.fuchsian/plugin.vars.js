var CIRCLESembeddingsMIRRORQUASIFUCHSIAN_active = 0 ;
var CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau = "" ;
var CIRCLESembeddingsMIRRORQUASIFUCHSIAN_tau_complex = new complex( 0, 0 );
var CIRCLESembeddingsMIRRORQUASIFUCHSIAN_PRESETSarray = [], CIRCLESembeddingsMIRRORQUASIFUCHSIAN_REMOTECTRLkeywords = [] ;
var CIRCLESembeddingsMIRRORQUASIFUCHSIAN_form_flag = 0 ; // MAXI = 0, MINI = 1

var CIRCLESformsGENERALOPTIONSremotectrlCOMMANDS = { "activateifs" : "<lightblue>activates all options for the IFS random process</lightblue>",
																										 "ifslastpt" : "<lightblue>set the complex coordinates of the last point returned from the current rendering</lightblue>",
																										 "ifstime" : "<lightblue>set the time interval, in minutes, for the next rendering</lightblue>",
																										 "ifsregion" : "<lightblue>set the density level to scan the diagram and pick up a region with the next last point</lightblue>"
																									 } ;

var CIRCLESembeddingsMIRRORQUASIFUCHSIANremotectrlCOMMANDS = { "move" : "<lightblue>move the popup to the input position: left, top, right, bottom</lightblue>" } ; // json entry key : desc string (with color tags)
var CIRCLESembeddingsMIRRORQUASIFUCHSIANopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' }
                                        } ;