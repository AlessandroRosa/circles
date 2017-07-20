var CIRCLESembeddingsGENERALPURPOSE_gens_container = [] ;
var CIRCLESembeddingsGENERALPURPOSE_a_formula = "" ;
var CIRCLESembeddingsGENERALPURPOSE_b_formula = "" ;
var CIRCLESembeddingsGENERALPURPOSE_c_formula = "" ;
var CIRCLESembeddingsGENERALPURPOSE_d_formula = "" ;
var CIRCLESembeddingsGENERALPURPOSEcurr_sel = UNDET ;
var CIRCLESembeddingsGENERALPURPOSEresolved_mm_params_array = [];
var CIRCLESembeddingsGENERALPURPOSEvar_check = NO ;
var CIRCLESembeddingsGENERALPURPOSEcomment = "" ;
var CIRCLESembeddingsGENERALPURPOSEpresets = [], CIRCLESembeddingsGENERALPURPOSEremotectrl_keywords = [] ;
var CIRCLESembeddingsGENERALPURPOSEform_flag = 0 ; // MAXI = 0, MINI = 1
var CIRCLESembeddingsGENERALPURPOSE_ADD = 1, CIRCLESembeddingsGENERALPURPOSE_UPDATE = 2;
var CIRCLESembeddingsGENERALPURPOSE_DELETE = 3, CIRCLESembeddingsGENERALPURPOSE_NEW = 4 ;
var CIRCLESembeddingsGENERALPURPOSEremotectrlCOMMANDS = { "addmobius" : "<lightblue>Add a new mobius map</lightblue> <yellow>Example: addmobius 1 2+i 0 1</yellow>",
																													"bomb" : "<lightblue>delete the current list of mobius maps</lightblue>",
																													"capture.seeds" : "<lightblue>the seeds set is copied into this plug-in</lightblue>",
																													"capture.gens" : "<lightblue>the gens set is copied into this plug-in</lightblue>",
																													"generate.group" : "<lightblue>generate the group from the current input mobius maps</lightblue>",
																													"fullgroup" : "<lightblue>show the whole group, including the inverse maps</lightblue>",
																													"hidelist" : "<lightblue>hide the container including the list of mobius maps</lightblue>",
																													"showlist" : "<lightblue>show the container including the list of mobius maps</lightblue>",
																													"newmobius" : "<lightblue>clean edit boxes</lightblue>",
																													"refresh" : "<lightblue>refresh the current list of mobius maps</lightblue>"
																												} ;
var CIRCLESembeddingsGENERALPURPOSEopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' }
                                                } ;