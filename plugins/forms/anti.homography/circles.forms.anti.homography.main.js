function CIRCLESformsANTIHOMOGRAPHYclose() { return circles_lib_plugin_dispatcher_unicast_message( 'anti.homography', "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsANTIHOMOGRAPHYapply( _items_switch )
{
    _items_switch = safe_int( _items_switch, ITEMS_SWITCH_SEEDS ) ;
    var _items_info = circles_lib_items_set( _items_switch, YES ) ;
    _items_switch = _items_info['switch'];
    var _items_array = _items_info['array'], _items_n = _items_info['count'], _mask ;
    if ( _items_n > 0 )
    {
        _glob_items_anti_homography_mask_map = [] ;
		    $.each( _items_array,
		            function( _i, _item )
		            {
		               _mask = 0 ;
		               _mask |= $( "#CIRCLESformsANTIHOMOGRAPHYcheckbox_mask_num_" + _item.symbol ).prop( "checked" ) ? 1 : 0 ;
		               _mask |= $( "#CIRCLESformsANTIHOMOGRAPHYcheckbox_mask_den_" + _item.symbol ).prop( "checked" ) ? 2 : 0 ;
									 _items_array[_i].map.set_anti_homography_mask( _mask );
                   _glob_items_anti_homography_mask_map[_item.symbol] = _mask ;
		            }
		          ) ;
              
		    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Complex conjugation settings have been applied to var z", "CIRCLESformsANTIHOMOGRAPHYoutMSG") ;
		}
		else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, (_items_switch == ITEMS_SWITCH_SEEDS?"Seeds":"Gens")+" set is empty", 'CIRCLESformsANTIHOMOGRAPHYoutMSG' ) ;
}

function CIRCLESformsANTIHOMOGRAPHYlist( _items_switch, _update )
{
    _items_switch = safe_int( _items_switch, ITEMS_SWITCH_SEEDS ), _update = safe_int( _update, NO );
    var _items_info = circles_lib_items_set( _items_switch, YES ) ;
    _items_switch = _items_info['switch'];
    var _items_array = _items_info['array'], _items_label = _items_info['label'], _items_n = _items_info['count'], _mask ;
    var HTMLcode = "<table WIDTH=\"100%\" STYLE=\"color:white;\">" ;
    if ( _items_n == 0 )
    {
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        if ( _items_switch.is_one_of( ITEMS_SWITCH_SEEDS, ITEMS_SWITCH_GENS ) )
        HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"color:#D4E0EA;font-size:16pt;\">Source : "+_items_label+"</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
        HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"color:#EAEAEA;font-size:16pt;\">No items have been<br>registered yet</td></tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    }
    else
    {
        var _num_cnt = 0, _den_cnt = 0 ;
        $.each( _items_array, function( _i, _item )
                {
                    if ( _item.map.get_anti_homography_mask() & 1 ) _num_cnt++ ;
                    if ( _item.map.get_anti_homography_mask() & 2 ) _den_cnt++ ;
                } );

        var _b_all_num = safe_size( _items_array, 0 ) == _num_cnt ? YES : NO ;
        var _b_all_den = safe_size( _items_array, 0 ) == _den_cnt ? YES : NO ;

        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td ALIGN=\"center\">Item</td>" ;
        HTMLcode += "<td WIDTH=\"25\"></td>" ;
        HTMLcode += "<td ALIGN=\"center\" COLSPAN=\"3\">Check and apply complex conjugation to var z</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td ALIGN=\"center\">Symbol</td>" ;
        HTMLcode += "<td WIDTH=\"25\"></td>" ;
        HTMLcode += "<td ALIGN=\"center\" STYLE=\"color:lightblue;\">Z at numerator</td>" ;
        HTMLcode += "<td WIDTH=\"25\"></td>" ;
        HTMLcode += "<td ALIGN=\"center\" STYLE=\"color:lightblue;\">Z at denominator</td>" ;
        HTMLcode += "<td WIDTH=\"25\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td ALIGN=\"center\">All</td>" ;
        HTMLcode += "<td WIDTH=\"25\"></td>" ;
        HTMLcode += "<td ALIGN=\"center\"><INPUT "+(_b_all_num?"CHECKED":"")+" ID=\"CIRCLESformsANTIHOMOGRAPHYcheckbox_all_num\" TYPE=\"checkbox\" ONCLICK=\"javascript:$('[id^=CIRCLESformsANTIHOMOGRAPHYcheckbox_mask_1_]').prop('checked',this.checked?true:false);\"></td>" ;
        HTMLcode += "<td WIDTH=\"25\"></td>" ;
        HTMLcode += "<td ALIGN=\"center\"><INPUT "+(_b_all_den?"CHECKED":"")+" ID=\"CIRCLESformsANTIHOMOGRAPHYcheckbox_all_den\" TYPE=\"checkbox\" ONCLICK=\"javascript:$('[id^=CIRCLESformsANTIHOMOGRAPHYcheckbox_mask_2_]').prop('checked',this.checked?true:false);\"></td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;

        $.each( _items_array,
               function( _i, _item )
               {
                  HTMLcode += "<tr>" ;
                  HTMLcode += "<td WIDTH=\"5\"></td>" ;
                  HTMLcode += "<td ALIGN=\"center\" STYLE=\"color:yellow;\">"+_item.symbol+"</td>" ;
                  HTMLcode += "<td WIDTH=\"25\"></td>" ;
                  HTMLcode += "<td ALIGN=\"center\"><INPUT ID=\"CIRCLESformsANTIHOMOGRAPHYcheckbox_mask_num_"+_item.symbol+"\" TYPE=\"checkbox\" "+( _item.map.anti_homography_mask & 1 ? "CHECKED" : "" )+"></td>" ;
                  HTMLcode += "<td WIDTH=\"25\"></td>" ;
                  HTMLcode += "<td ALIGN=\"center\"><INPUT ID=\"CIRCLESformsANTIHOMOGRAPHYcheckbox_mask_den_"+_item.symbol+"\" TYPE=\"checkbox\" "+( _item.map.anti_homography_mask & 2 ? "CHECKED" : "" )+"></td>" ;
                  HTMLcode += "</tr>" ;
                  HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
               }
             ) ;
    }
    
    HTMLcode += "</table>" ;
    if ( _update ) $( "#CIRCLESformsANTIHOMOGRAPHYformCONTAINER" ).html( HTMLcode );
    else return HTMLcode ;
}

function CIRCLESformsANTIHOMOGRAPHYmain( _base_id, _move, _items_switch )
{
    var _items_info = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _items_info['count'], _items_array =  _items_info['array'], _caption = _items_info['label'], _items_switch = _items_info['switch'] ;
    CIRCLESformsANTIHOMOGRAPHYdata_src_type = _items_switch ;
    CIRCLESformsANTIHOMOGRAPHYbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    var WIDTH = 320, HEIGHT = "auto", _subset = "forms" ;

    var CLOSE_FN = "CIRCLESformsANTIHOMOGRAPHYclose();" ;
    var ONACTIVATEFN = "CIRCLESformsANTIHOMOGRAPHYlist("+_items_switch+");" ;
    var _div_id = CIRCLESformsANTIHOMOGRAPHYdiv_id = circles_lib_plugin_build_divid( _subset, _base_id ) ;
    var HTMLcode = "<INPUT TYPE=\"HIDDEN\" ID=\"CIRCLESpairingINDEX01\" VALUE=\""+UNDET+"\"><INPUT TYPE=\"HIDDEN\" ID=\"CIRCLESpairingINDEX02\" VALUE=\""+UNDET+"\">" ;
        HTMLcode += "<table WIDTH=\"100%\">" ;
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsANTIHOMOGRAPHYcaption + " - " + _caption, 5, YES, CLOSE_FN,
        WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "lens/lens.icon.01.16x16.png", ONACTIVATEFN );

    HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\"><table><tr>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td ALIGN=\"center\">Source</td>" ;
    HTMLcode += "<td WIDTH=\"3\"></td>" ;
    HTMLcode += "<td><SELECT ID=\"CIRCLESformsANTIHOMOGRAPHYitemsCOMBO\" ONCHANGE=\"javascript:CIRCLESformsANTIHOMOGRAPHYlist($('#'+this.id+' option:selected').val(),YES);\"><OPTION VALUE=\""+ITEMS_SWITCH_SEEDS+"\" "+(_items_switch==ITEMS_SWITCH_SEEDS?"SELECTED=\"selected\"":"")+">Seeds<OPTION VALUE=\""+ITEMS_SWITCH_GENS+"\""+(_items_switch==ITEMS_SWITCH_GENS?"SELECTED=\"selected\"":"")+">Gens</SELECT></td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsANTIHOMOGRAPHYapply( $('#CIRCLESformsANTIHOMOGRAPHYitemsCOMBO option:selected').val() );\">Apply</td>" ;
    HTMLcode += "<td WIDTH=\"5\"></td>" ;
    HTMLcode += "</tr></table></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
    HTMLcode += "<tr>" ;
    HTMLcode += "<td VALIGN=\"top\" ID=\"CIRCLESformsANTIHOMOGRAPHYformCONTAINER\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#454545;\">" ;
    HTMLcode += CIRCLESformsANTIHOMOGRAPHYlist(_items_switch) ;
    HTMLcode += "</td>" ;
    HTMLcode += "</tr>" ;

    if ( _items_n > 0 )
    {
        HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
        HTMLcode += "<table ALIGN=\"center\">" ;
        HTMLcode += "<tr><td HEIGHT=\"22\" ALIGN=\"center\" ID=\"CIRCLESformsANTIHOMOGRAPHYoutMSG\"></td></tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
    }

    HTMLcode += "</table>" ;
    HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;
    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div_id, CIRCLESformsANTIHOMOGRAPHYcaption + " - " + _caption, CLOSE_FN );
    if ( _move && _div != null ) move_div( _div.id, "LEFT", "TOP" );
}