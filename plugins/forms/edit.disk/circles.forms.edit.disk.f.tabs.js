function CIRCLESformsEDITDISKcoordinatesCODE( _index, _items_switch )
{
    _index = safe_int( _index, UNDET );
    if ( _index < UNDET ) _index = UNDET ; // no way for candidate negative indexes
    var _chunk = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _chunk['count'], _items_array =  _chunk['array'], _caption = _chunk['label'], _items_switch = _chunk['switch'] ;
    var ITEM = _index < 0 ? null : ( _index.ranges_in( 0, _items_n - 1, YES ) ? _items_array[_index] : null );
    var _b_exists = is_item_obj( ITEM );
    var _b_circle_exists = _b_exists && is_circle( ITEM.complex_circle ) ;
    var complex_circle = _b_circle_exists ? ITEM.complex_circle : new circle( new point( 0, 0 ), 0 );
    var complex_center_pt = _b_circle_exists ? complex_circle.center : new point( 0, 0 );
    var complex_radius = _b_circle_exists ? complex_circle.radius : 0 ;
    
    var HTMLcode = "<table>" ;
    HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td WIDTH=\"55\">Center (x)</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ID=\"CIRCLEselectedCENTERx\" ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" TYPE=\"edit\" ONKEYUP=\"javascript:_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,0);CIRCLESformsEDITDISKeventsHANDLER( this.id, event, "+_index+", 0 );\" STYLE=\"width:110px;\" VALUE=\""+complex_center_pt.x+"\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td WIDTH=\"55\">Center (y)</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ID=\"CIRCLEselectedCENTERy\" ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" TYPE=\"edit\" ONKEYUP=\"javascript:_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,0);CIRCLESformsEDITDISKeventsHANDLER( this.id, event, "+_index+", 0 );\" STYLE=\"width:110px;\" VALUE=\""+complex_center_pt.y+"\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td WIDTH=\"55\">Radius</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ID=\"CIRCLEselectedCENTERradius\" ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" TYPE=\"edit\" ONKEYUP=\"javascript:_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,0);CIRCLESformsEDITDISKeventsHANDLER( this.id, event, "+_index+", 0 );\" STYLE=\"width:110px;\" VALUE=\""+complex_radius+"\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"3\">" ;
    HTMLcode += "<table>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td>Shift disk</td>" ;
    HTMLcode += "<td WIDTH=\"10\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_complexdisk_shift('up');\"><IMG SRC=\"%imgpath%icons/bullets/bullet.up.20x20.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_complexdisk_shift('down');\"><IMG SRC=\"%imgpath%icons/bullets/bullet.down.20x20.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_complexdisk_shift('left');\"><IMG SRC=\"%imgpath%icons/bullets/bullet.left.20x20.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_complexdisk_shift('right');\"><IMG SRC=\"%imgpath%icons/bullets/bullet.right.20x20.png\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "</table>" ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    HTMLcode += "</table>" ;
    return HTMLcode ;
}

function CIRCLESformsEDITDISKgraphixCODE( _index, _items_switch )
{
    _index = safe_int( _index, UNDET );
    if ( _index < UNDET ) _index = UNDET ; // no way for candidate negative indexes
    var _chunk = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _chunk['count'], _items_array = _chunk['array'], _caption = _chunk['label'], _items_switch = _chunk['switch'] ;
    var ITEM = _index < 0 ? null : ( ( _index.ranges_in( 0, circles_lib_count_seeds(), YES ) ) ? _items_array[_index] : null );
    var _b_exists = is_item_obj( ITEM );
    var complex_circle = _b_exists ? ITEM.complex_circle : null ;
    var _b_circle_exists = _b_exists && is_circle( complex_circle ) ;
    var linewidth = _b_circle_exists ? ITEM.complex_circle.linewidth : 1 ;
    var fill = _b_circle_exists ? ITEM.complex_circle.fill : NO ;
    var draw = _b_circle_exists ? ITEM.complex_circle.draw : NO ;
    var drawcolor = _b_circle_exists ? ITEM.complex_circle.drawcolor : _glob_draw_seed_color ;
    var fillcolor = _b_circle_exists ? ITEM.complex_circle.fillcolor : _glob_fill_seed_color ;
    
    var HTMLcode = "<table>" ;
    HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td ID=\"drawcolorLABEL\">Border color</td>";
    HTMLcode += "<td WIDTH=\"5\"></td>";
    HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"text-align:center;height:24px;width:20px;background-color:"+drawcolor+";\" ID=\"CIRCLEScircleSELECTEDdrawcolor\">"+( ( draw == 0 && drawcolor.length == 0 ) ? "<span STYLE=\"font-size:7pt;color:#808080;\">none</span>" : "" )+"</td>";
    HTMLcode += "<td WIDTH=\"5\"></td>";
    HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
    HTMLcode += "    ONCLICK=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);displayCOLORTABLE( 'CIRCLEScircleSELECTEDdrawcolorICON', 'CIRCLEScircleSELECTEDdrawcolor' );\"";
    HTMLcode += "    WIDTH=\"16\" valign=\"middle\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
    HTMLcode += "<td WIDTH=\"25\"></td>";
    HTMLcode += "<td>Draw Border</td>";
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT "+( ( draw || _index == UNDET ) ? "CHECKED" : "" )+" ID=\"CIRCLEScirclesDRAWcheckbox\" TYPE=\"checkbox\" ONCLICK=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);\"></td>";
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');CIRCLESformsEDITDISKsetTRANSPARENTdrawcolor( "+_index+" );\">Transparent</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td ID=\"fillcolorLABEL\">Fill color</td>";
    HTMLcode += "<td WIDTH=\"5\"></td>";
    HTMLcode += "<td CLASS=\"general_rounded_corners\" STYLE=\"text-align:center;height:24px;width:20px;background-color:"+fillcolor+";\" ID=\"CIRCLEScircleSELECTEDfillcolor\">"+( ( fill == 0 && fillcolor.length == 0 ) ? "<span STYLE=\"font-size:7pt;color:#808080;\">none</span>" : "" )+"</td>";
    HTMLcode += "<td WIDTH=\"5\"></td>";
    HTMLcode += "<td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"";
    HTMLcode += "    ONCLICK=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);displayCOLORTABLE( 'CIRCLEScircleSELECTEDfillcolorICON', 'CIRCLEScircleSELECTEDfillcolor' );\"";
    HTMLcode += "    WIDTH=\"16\" valign=\"middle\"><IMG SRC=\"%imgpath%colortable/img/btns/spectrum16x16.png\"></td>";
    HTMLcode += "<td WIDTH=\"25\"></td>";
    HTMLcode += "<td>Fill interior</td>";
    HTMLcode += "<td WIDTH=\"5\"></td>";
    HTMLcode += "<td><INPUT "+( fill ? "CHECKED" : "" )+" ID=\"CIRCLEScirclesFILLcheckbox\" TYPE=\"checkbox\" ONCLICK=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);\"></td>";
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');CIRCLESformsEDITDISKsetTRANSPARENTfillcolor( "+_index+" );\">Transparent</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>Line thickness</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td WIDTH=\"25\"><INPUT ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);\" TYPE=\"edit\" STYLE=\"width:42px;text-align:center;\" ID=\"CIRCLEselectedLINETHICKNESS\" VALUE=\""+linewidth+"\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
    HTMLcode += "</table>" ;
        
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
    return HTMLcode ;
}

function CIRCLESformsEDITDISKmobiusmapCODE( _index, _items_switch )
{
    _index = safe_int( _index, UNDET );
    if ( _index < UNDET ) _index = UNDET ; // no way for candidate negative indexes
    var _chunk = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _chunk['count'], _items_array = _chunk['array'], _caption = _chunk['label'], _items_switch = _chunk['switch'] ;
    var ITEM = _index < 0 ? null : ( ( _index.ranges_in( 0, circles_lib_count_seeds(), YES ) ) ? _items_array[_index] : null );
    var _b_exists = is_item_obj( ITEM );
    var PARAMSinputTYPEmask = _b_exists ? ITEM.params_mask : 0 ;
    var _mm = is_item_obj( ITEM ) ? ITEM.map : null ;
    var bMMexists = is_mobius_map( _mm );
    // parameters a,b,c,d are of complex class
    var MOBIUSparamA = bMMexists ? _mm.get_a() : new complex( 0.0, 0.0 );
    var MOBIUSparamB = bMMexists ? _mm.get_b() : new complex( 0.0, 0.0 );
    var MOBIUSparamC = bMMexists ? _mm.get_c() : new complex( 0.0, 0.0 );
    var MOBIUSparamD = bMMexists ? _mm.get_d() : new complex( 0.0, 0.0 );

    var HTMLcode = "<table>" ;
    if ( !bMMexists && _index >= 0 )
    {
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
        HTMLcode += "<tr><td COLSPAN=\"14\" ALIGN=\"center\" CLASS=\"popup_buttons_bar\" STYLE=\"background-color:#E80000;color:white;\" ALIGN=\"center\">Alert ! This Mobius map has not been initialized</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    }

    HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td COLSPAN=\"9\"></td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td>Orthogonal</td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td>Radial</td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"4\" COLSPAN=\"3\"></td></tr>" ;

    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>A</td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td WIDTH=\"25\" ID=\"CIRCLEselectedREALsymbolA\">"+( PARAMSinputTYPEmask & 1 ? "Radius" : "Real" )+"</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ID=\"CIRCLEselectedMOBIUSMAPparamAreal\" TYPE=\"edit\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,0);CIRCLESformsEDITDISKeventsHANDLER( this.id, event, "+_index+", 0 );\" STYLE=\"width:110px;\" VALUE=\""+( PARAMSinputTYPEmask & 1 ? MOBIUSparamA.radius().sci_to_dec() : MOBIUSparamA.real.sci_to_dec() )+"\"></td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td WIDTH=\"25\" ID=\"CIRCLEselectedIMAGsymbolA\">"+( PARAMSinputTYPEmask & 1 ? "Angle" : "Imag" )+"</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ID=\"CIRCLEselectedMOBIUSMAPparamAimag\" TYPE=\"edit\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\" ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,0);CIRCLESformsEDITDISKeventsHANDLER( this.id, event, "+_index+", 0 );\" STYLE=\"width:110px;\" VALUE=\""+( PARAMSinputTYPEmask & 1 ? MOBIUSparamA.angle().sci_to_dec() : MOBIUSparamA.imag.sci_to_dec() )+"\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ONCLICK=\"javascript:CIRCLESformsEDITDISKswitchMOBIUSparams('A',1);_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);\" NAME=\"CIRCLEselectedMOBIUSMAPparamAradio\" ID=\"CIRCLEselectedMOBIUSMAPparamAorthoRADIO_01\" TYPE=\"radio\" "+( PARAMSinputTYPEmask & 1 ? "" : "CHECKED" )+"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ONCLICK=\"javascript:CIRCLESformsEDITDISKswitchMOBIUSparams('A',2);_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);\" NAME=\"CIRCLEselectedMOBIUSMAPparamAradio\" ID=\"CIRCLEselectedMOBIUSMAPparamAorthoRADIO_02\" TYPE=\"radio\" "+( PARAMSinputTYPEmask & 1 ? "CHECKED" : "" )+"></td>" ;
    HTMLcode += "<INPUT TYPE=\"hidden\" ID=\"CIRCLEselectedMOBIUSMAPhiddenA\" VALUE=\"1\">" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>B</td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td WIDTH=\"25\" ID=\"CIRCLEselectedREALsymbolB\">"+( PARAMSinputTYPEmask & 2 ? "Radius" : "Real" )+"</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ID=\"CIRCLEselectedMOBIUSMAPparamBreal\" TYPE=\"edit\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\"  ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,0);CIRCLESformsEDITDISKeventsHANDLER( this.id, event, "+_index+", 0 );\" STYLE=\"width:110px;\" VALUE=\""+( PARAMSinputTYPEmask & 2 ? MOBIUSparamB.radius().sci_to_dec() : MOBIUSparamB.real.sci_to_dec() )+"\"></td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td WIDTH=\"25\" ID=\"CIRCLEselectedIMAGsymbolB\">"+( PARAMSinputTYPEmask & 2 ? "Angle" : "Imag" )+"</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ID=\"CIRCLEselectedMOBIUSMAPparamBimag\" TYPE=\"edit\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\"  ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,0);CIRCLESformsEDITDISKeventsHANDLER( this.id, event, "+_index+", 0 );\" STYLE=\"width:110px;\" VALUE=\""+( PARAMSinputTYPEmask & 2 ? MOBIUSparamB.angle().sci_to_dec() : MOBIUSparamB.imag.sci_to_dec() )+"\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ONCLICK=\"javascript:CIRCLESformsEDITDISKswitchMOBIUSparams('B',1);_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);\" NAME=\"CIRCLEselectedMOBIUSMAPparamBradio\" ID=\"CIRCLEselectedMOBIUSMAPparamBorthoRADIO_01\" TYPE=\"radio\" "+( PARAMSinputTYPEmask & 2 ? "" : "CHECKED" )+"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ONCLICK=\"javascript:CIRCLESformsEDITDISKswitchMOBIUSparams('B',2);_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);\" NAME=\"CIRCLEselectedMOBIUSMAPparamBradio\" ID=\"CIRCLEselectedMOBIUSMAPparamBorthoRADIO_02\" TYPE=\"radio\" "+( PARAMSinputTYPEmask & 2 ? "CHECKED" : "" )+"></td>" ;
    HTMLcode += "<INPUT TYPE=\"hidden\" ID=\"CIRCLEselectedMOBIUSMAPhiddenB\" VALUE=\"1\">" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>C</td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td WIDTH=\"25\" ID=\"CIRCLEselectedREALsymbolC\">"+( PARAMSinputTYPEmask & 4 ? "Radius" : "Real" )+"</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ID=\"CIRCLEselectedMOBIUSMAPparamCreal\" TYPE=\"edit\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\"  ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,0);CIRCLESformsEDITDISKeventsHANDLER( this.id, event, "+_index+", 0 );\" STYLE=\"width:110px;\" VALUE=\""+( PARAMSinputTYPEmask & 4 ? MOBIUSparamC.radius().sci_to_dec() : MOBIUSparamC.real.sci_to_dec() )+"\"></td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td WIDTH=\"25\" ID=\"CIRCLEselectedIMAGsymbolC\">"+( PARAMSinputTYPEmask & 4 ? "Angle" : "Imag" )+"</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ID=\"CIRCLEselectedMOBIUSMAPparamCimag\" TYPE=\"edit\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\"  ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,0);CIRCLESformsEDITDISKeventsHANDLER( this.id, event, "+_index+", 0 );\" STYLE=\"width:110px;\" VALUE=\""+( PARAMSinputTYPEmask & 4 ? MOBIUSparamC.angle().sci_to_dec() : MOBIUSparamC.imag.sci_to_dec() )+"\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ONCLICK=\"javascript:CIRCLESformsEDITDISKswitchMOBIUSparams('C',1);_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);\" NAME=\"CIRCLEselectedMOBIUSMAPparamCradio\" ID=\"CIRCLEselectedMOBIUSMAPparamCorthoRADIO_01\" TYPE=\"radio\" "+( PARAMSinputTYPEmask & 4 ? "" : "CHECKED" )+"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ONCLICK=\"javascript:CIRCLESformsEDITDISKswitchMOBIUSparams('C',2);_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);\" NAME=\"CIRCLEselectedMOBIUSMAPparamCradio\" ID=\"CIRCLEselectedMOBIUSMAPparamCorthoRADIO_02\" TYPE=\"radio\" "+( PARAMSinputTYPEmask & 4 ? "CHECKED" : "" )+"></td>" ;
    HTMLcode += "<INPUT TYPE=\"hidden\" ID=\"CIRCLEselectedMOBIUSMAPhiddenC\" VALUE=\"1\">" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td>D</td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td WIDTH=\"25\" ID=\"CIRCLEselectedREALsymbolD\">"+( PARAMSinputTYPEmask & 8 ? "Radius" : "Real" )+"</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ID=\"CIRCLEselectedMOBIUSMAPparamDreal\" TYPE=\"edit\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\"  ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,0);CIRCLESformsEDITDISKeventsHANDLER( this.id, event, "+_index+", 0 );\" STYLE=\"width:110px;\" VALUE=\""+( PARAMSinputTYPEmask & 8 ? MOBIUSparamD.radius().sci_to_dec() : MOBIUSparamD.real.sci_to_dec() )+"\"></td>" ;
    HTMLcode += "<td WIDTH=\"15\"></td>" ;
    HTMLcode += "<td WIDTH=\"25\" ID=\"CIRCLEselectedIMAGsymbolD\">"+( PARAMSinputTYPEmask & 8 ? "Angle" : "Imag" )+"</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ID=\"CIRCLEselectedMOBIUSMAPparamDimag\" TYPE=\"edit\" ONBLUR=\"javascript:this.value=this.value.replaceAll(',','.');\"  ONKEYUP=\"javascript:$('#CIRCLESformsEDITDISKapplyBTN').css('color','red');_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,0);CIRCLESformsEDITDISKeventsHANDLER( this.id, event, "+_index+", 0 );\" STYLE=\"width:110px;\" VALUE=\""+( PARAMSinputTYPEmask & 8 ? MOBIUSparamD.radius().sci_to_dec() : MOBIUSparamD.imag.sci_to_dec() )+"\"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ONCLICK=\"javascript:CIRCLESformsEDITDISKswitchMOBIUSparams('D',1);_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);\" NAME=\"CIRCLEselectedMOBIUSMAPparamDradio\" ID=\"CIRCLEselectedMOBIUSMAPparamDorthoRADIO_01\" TYPE=\"radio\" "+( PARAMSinputTYPEmask & 8 ? "" : "CHECKED" )+"></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td><INPUT ONCLICK=\"javascript:CIRCLESformsEDITDISKswitchMOBIUSparams('D',2);_glob_to_save=YES;circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);\" NAME=\"CIRCLEselectedMOBIUSMAPparamDradio\" ID=\"CIRCLEselectedMOBIUSMAPparamDorthoRADIO_02\" TYPE=\"radio\" "+( PARAMSinputTYPEmask & 8 ? "CHECKED" : "" )+"></td>" ;
    HTMLcode += "<INPUT TYPE=\"hidden\" ID=\"CIRCLEselectedMOBIUSMAPhiddenD\" VALUE=\"1\">" ;
    HTMLcode += "</tr>" ;

    HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
    HTMLcode += "</table>" ;

    return HTMLcode ;
}

function CIRCLESformsEDITDISKpropertiesCODE( _index, _items_switch )
{
    _index = safe_int( _index, UNDET );
    if ( _index < UNDET ) _index = UNDET ; // no way for candidate negative indexes
    var _chunk = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _chunk['count'], _items_array = _chunk['array'], _caption = _chunk['label'], _items_switch = _chunk['switch'] ;
    var ITEM = _index < 0 ? null : ( ( _index.ranges_in( 0, _items_n - 1, YES ) ) ? _items_array[_index] : null );
    var _b_exists = is_item_obj( ITEM );
    var bISNULL = _b_exists ? ( is_mobius_map( ITEM.map ) ? NO : YES ) : YES ;

    var _symbol = ( _b_exists ) ? ITEM.symbol : "" ;
    var inv_symbol = _b_exists ? ITEM.inverse_symbol : "" ;
    var complex_circle = _b_exists ? ITEM.complex_circle : null ;
    var PARAMSinputTYPEmask = _b_exists ? ITEM.params_mask : 0 ;
    var color = ( _b_exists && is_circle( complex_circle ) ) ? ITEM.complex_circle.fillcolor : "" ;
    var _fp_array = _b_exists ? ITEM.map.fixed_points() : [] ;
    var _n_limitset = safe_size( _fp_array, 0 ) ;
    var null_map_flag = !is_mobius_map( ITEM.map ) ? YES : NO ;
    var tr = _b_exists ? ITEM.map.trace() : 0 ;
    var det = _b_exists ? ITEM.map.det() : 0 ;
    var MASK = 0 ;
        MASK |= ( ITEM.map.get_a().is_real() || ITEM.map.get_a().is_zero() ) ? YES : NO ;
        MASK |= ( ITEM.map.get_b().is_real() || ITEM.map.get_b().is_zero() ) ? 2 : 0 ;
        MASK |= ( ITEM.map.get_c().is_real() || ITEM.map.get_c().is_zero() ) ? 4 : 0 ;
        MASK |= ( ITEM.map.get_d().is_real() || ITEM.map.get_d().is_zero() ) ? 8 : 0 ;
    var GROUP = det == 1 ? ( MASK == 15 ? "SL(2,R)" : "SL(2,C)" ) : ( det == 0 ? "Constant map" : ( ( ( MASK == 15 ) ? "GL(2,R)" : "GL(2,C)" ) ) );
    var circumference = ( _b_exists && is_circle( complex_circle ) ) ? complex_circle.circumference() : 0 ;
    var area = ( _b_exists && is_circle( complex_circle ) ) ? complex_circle.area() : 0 ;
  
       var HTMLcode = "<td WIDTH=\"5\"></td>" ;
           HTMLcode += "<td VALIGN=\"top\">" ;
           HTMLcode += "<table>" ;

           HTMLcode += "<tr>" ;
           HTMLcode += "<td VALIGN=\"top\">" ;
           HTMLcode += "<table>" ;
           HTMLcode += "<tr>" ;
           HTMLcode += "<td WIDTH=\"5\"></td>" ;
           HTMLcode += "<td>Circumference</td>" ;
           HTMLcode += "<td WIDTH=\"15\"></td>" ;
           HTMLcode += "<td>Area</td>" ;
           HTMLcode += "</tr>" ;
           HTMLcode += "<tr>" ;
           HTMLcode += "<td WIDTH=\"5\"></td>" ;
           HTMLcode += "<td>"+circumference+"</td>" ;
           HTMLcode += "<td WIDTH=\"15\"></td>" ;
           HTMLcode += "<td>"+area+"</td>" ;
           HTMLcode += "</tr>" ;
           HTMLcode += "</table>" ;
           HTMLcode += "</td>" ;
           HTMLcode += "</tr>" ;

           HTMLcode += "<tr>" ;
           HTMLcode += "<td VALIGN=\"top\">" ;
           HTMLcode += "<table>" ;
           HTMLcode += "<tr>" ;
           HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;

        if ( null_map_flag == 0 )
        {
            HTMLcode += "<tr>" ;
            HTMLcode += "<td WIDTH=\"5\"></td>" ;
            HTMLcode += "<td>"+_n_limitset+" fixed point"+( _n_limitset == 1 ? "" : "s" )+"</td>" ;
            HTMLcode += "<td WIDTH=\"5\"></td>" ;
            HTMLcode += "<td>Coordinates</td>" ;
            HTMLcode += "<td WIDTH=\"5\"></td>" ;
            HTMLcode += "<td>Type</td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;

            var _fp1 = _n_limitset > 0 ? _fp_array[0] : null ;
            var _fp1_type = "" ;
                if ( is_complex( _fp1 ) )
                {
                    if ( ITEM.map.is_sink_pt( _fp1 ) ) _fp1_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SINK );
                    else if ( ITEM.map.is_source_pt( _fp1 ) ) _fp1_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SOURCE );
                    else _fp1_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_NEUTRAL );
                }
                else _fp1_type = "Undetermined" ;

            var _fp2 = _n_limitset > 1 ? _fp_array[1] : null ;
            var _fp2_type = "" ;
                if ( is_complex( _fp2 ) )
                {
                    if ( ITEM.map.is_sink_pt( _fp2 ) ) _fp2_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SINK );
                    else if ( ITEM.map.is_source_pt( _fp2 ) ) _fp2_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SOURCE );
                    else _fp2_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_NEUTRAL );
                }
                else _fp2_type = "Undetermined" ;

            if ( is_complex( _fp1 ) )
            {
                HTMLcode += "<tr>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "<td WIDTH=\"5\" VALIGN=\"top\">Fp<sub>1</sub></td>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "<td VALIGN=\"top\">"+_fp1.roundTo(_glob_accuracy).formula()+"</td>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "<td VALIGN=\"top\">"+_fp1_type+"</td>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "</tr>" ;
            }

            if ( is_complex( _fp2 ) )
            {
                HTMLcode += "<tr>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "<td WIDTH=\"5\" VALIGN=\"top\">Fp<sub>2</sub></td>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "<td VALIGN=\"top\">"+_fp2.roundTo(_glob_accuracy).formula()+"</td>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "<td VALIGN=\"top\">"+_fp2_type+"</td>" ;
                HTMLcode += "<td WIDTH=\"5\"></td>" ;
                HTMLcode += "</tr>" ;
            }
        }
        else
        {
            HTMLcode += "<tr>" ;
            HTMLcode += "<td WIDTH=\"5\"></td>" ;
            HTMLcode += "<td COLSPAN=\"3\" STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">The associated Mobius map has not been initialized</td>" ;
            HTMLcode += "<td WIDTH=\"5\"></td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td WIDTH=\"5\"></td>" ;
            HTMLcode += "<td COLSPAN=\"3\" STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">Please, set the parameters below</td>" ;
            HTMLcode += "<td WIDTH=\"5\"></td>" ;
            HTMLcode += "</tr>" ;
        }
                     
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;

        if ( null_map_flag == 0 )
        {
            HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding:4px;\" COLSPAN=\"8\">" ;
            HTMLcode += "<table>" ;
            HTMLcode += "<tr><td>Trace : <b>"+( tr.is_real() ? ( tr.r() ) : ( tr.formula() ) )+"</b></td></tr>" ;
            HTMLcode += "<tr><td>Determinant (complex): <b>"+( det.is_real() ? det.r() : det.formula() )+"</b></td></tr>" ;
            HTMLcode += "<tr><td>Determinant (radius): <b>"+det.radius()+"</b></td></tr>" ;
            HTMLcode += "<tr><td>Group : <b>"+GROUP+"</b></td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;

         var MAP_TYPE = "" ;
         var copyITEM = ITEM.map.copy();
             copyITEM.normalize();

         if ( copyITEM.is_parabolic() ) MAP_TYPE = "Parabolic" ;
         else if ( copyITEM.is_elliptic() ) MAP_TYPE = "Elliptic" ;
         else if ( copyITEM.is_hyperbolic() ) MAP_TYPE = "Hyperbolic" ;
         else if ( copyITEM.is_loxodromic() ) MAP_TYPE = "Loxodromic" ;
         else MAP_TYPE =  "of unknown type" ;

             HTMLcode += "<tr><td>This (normalized) Mobius map is <b>"+MAP_TYPE+"</b></td></tr>" ;
             HTMLcode += "</table>" ;
             HTMLcode += "</td>" ;
             HTMLcode += "</tr>" ;
        }

      HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td VALIGN=\"top\" COLSPAN=\"4\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td "+( ( !_b_exists || bISNULL ) ? "CLASS=\"linkdead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmarklimitset("+_index+", _glob_zplane_rendering_canvas_placeholder );\"" )+">Mark fixed points</td>" ;
      HTMLcode += "<td WIDTH=\"10\"></td>" ;
      HTMLcode += "<td "+( _index == UNDET ? "CLASS=\"linkdead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','edit.disk',NO,"+_index+");\"")+">Edit</td>" ;
      HTMLcode += "<td WIDTH=\"10\"></td>" ;
      HTMLcode += "<td "+( _index == UNDET ? "CLASS=\"linkdead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','watch.formula',NO,"+_index+");\"")+">Watch formula</td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;

      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;

      return HTMLcode ;
}