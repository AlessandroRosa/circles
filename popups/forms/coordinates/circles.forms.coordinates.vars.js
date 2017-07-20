var CIRCLESformsCOORDINATEScaption = "Coords" ;
var CIRCLESformsCOORDINATESdiv_id = "" ;
var CIRCLESformsCOORDINATESbaseid = "" ;
var CIRCLESformsCOORDINATESplane_type = NO_PLANE ;

var CIRCLESformsCOORDINATESsrc_pt = new point();
var CIRCLESformsCOORDINATESimage_pt = new point();

var CIRCLESformsCOORDINATESremotectrlCOMMANDS = { } ; // json entry key : desc string (with color tags)
var CIRCLESformsCOORDINATESopenPARAMS = { 'move' : { 'desc' : 'move the popup to the input position', 'values' : 'yes|no|left,top,right,bottom' },
                                          'plane type' : { 'desc' : 'specify the work-plane for coordinates', 'values' : 'z-plane|w-plane' }
                                        } ;