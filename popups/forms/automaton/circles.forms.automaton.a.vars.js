var CIRCLESformsAUTOMATONcaption = "Automaton" ;
var CIRCLESformsAUTOMATONsrc_words_array = [] ;
var CIRCLESformsAUTOMATONarray = [] ;
var CIRCLESformsAUTOMATONname = "" ;
var CIRCLESformsAUTOMATONdiv_id = "" ;
var CIRCLESformsAUTOMATONbaseid = "" ;
var CIRCLESformsAUTOMATONremotectrlCOMMANDS = { } ; // json entry key : desc string (with color tags)
var CIRCLESformsAUTOMATONpending = 0 ;

var CIRCLESformsAUTOMATONopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' }
                                      } ;
                                      
var CIRCLESformsAUTOMATONerrorFOUNDduplicateENTRIES = -4 ;
var CIRCLESformsAUTOMATONerrorEMPTYtable = -3 ;
var CIRCLESformsAUTOMATONerrorMISSINGsrcword = -2 ;
var CIRCLESformsAUTOMATONerrorMISSINGidentity = -1 ;