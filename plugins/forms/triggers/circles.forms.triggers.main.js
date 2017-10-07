function CIRCLESformsTRIGGERSclose() { return circles_lib_plugin_dispatcher_unicast_message( "triggers", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsTRIGGERSmain( _base_id, _move )
{
    CIRCLESformsTRIGGERSbaseid = safe_string( _base_id, "" ) ;
    _move = safe_int( _move, YES );
    var _keys = _glob_triggers_table.is_associative() ? _glob_triggers_table.keys_associative() : _glob_triggers_table ;
    var _n_triggers = safe_size( _keys, 0 );
    var _extra_height = CIRCLES_POPUP_CAPTION_HEIGHT + CIRCLES_POPUP_SUB_CAPTION_HEIGHT + CIRCLES_POPUP_CAPTION_BORDER * 3 ;
    var _triggers_list_height = Math.min( _n_triggers * 40 + 24, 240 ) ;
  	var WIDTH = 320, HEIGHT = _triggers_list_height + 112 ;
    var CLOSE_FN = "CIRCLESformsTRIGGERSclose();", _subset = "forms" ;
    var _div_id = CIRCLESformsTRIGGERSdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
    var HTMLcode = "<table WIDTH=\""+WIDTH+"\">";
        HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsTRIGGERScaption, 1, YES, CLOSE_FN, WIDTH, HEIGHT, arguments.callee.name, _base_id, _div_id, _subset, "gearwheel/gearwheel.icon.01.20x20.png" );
        HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
    if ( _n_triggers > 0 )
    {
       HTMLcode += "<tr><td VALIGN=\"top\" ALIGN=\"center\">" ;
       HTMLcode += "<table>" ;
       HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
       HTMLcode += "<tr><td CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F1F1FC;padding:4px;\">" ;
       HTMLcode += "<table><tr>" ;
       HTMLcode += "<td WIDTH=\"5\"></td>" ;
       HTMLcode += "<td>All</td>" ;
       HTMLcode += "<td WIDTH=\"2\"></td>" ;
       HTMLcode += "<td><INPUT ID=\"CIRCLES"+_subset+"TRIGGERSallCHECKBOX\" TYPE=\"CHECKBOX\" ONCLICK=\"javascript:$('[id^=CIRCLES"+_subset+"TRIGGERScheckbox]').prop('checked',this.checked?1:0);circles_lib_triggers_set_all_to_automated(this.checked?1:0,YES);\"></td>" ;
       HTMLcode += "<td WIDTH=\"15\"></td>" ;
       HTMLcode += "<td>Run</td>" ;
       HTMLcode += "<td WIDTH=\"3\"></td>" ;
       HTMLcode += "<td WIDTH=\"20\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_triggers_open_all();\">All</td>" ;
       HTMLcode += "<td WIDTH=\"1\"></td>" ;
       HTMLcode += "<td WIDTH=\"50\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_triggers_open_all_automated_entries();\">Auto only</td>" ;
       HTMLcode += "<td WIDTH=\"10\"></td>" ;
       HTMLcode += "<td WIDTH=\"35\" CLASS=\"link_rounded\" ID=\"circles_lib_triggers__renderBTN\" ONCLICK=\"javascript:circles_lib_canvas_process_ask(YES,NO,_glob_target_plane,YES,YES,CHECK);\">Render</td>" ;
       HTMLcode += "</tr></table>" ;
			 HTMLcode += "</td>" ;
       HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
			 HTMLcode += "<tr><td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#EDEDF8;padding:4px;\">" ;
       HTMLcode += "<DIV STYLE=\"position:relative;width:"+(WIDTH-10)+"px;height:"+_triggers_list_height+"px;overflow:auto;\">" ;
       HTMLcode += "<table>" ;
       HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
			 HTMLcode += "<tr><td COLSPAN=\"2\">Title and action </td><td ALIGN=\"center\" WIDTH=\"50\">Auto run<br>at render</td></tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
       var _trigger_chunk, _title, _desc, _k ;
       for( _k = 0 ; _k < _n_triggers ; _k++ )
       {
         _trigger_chunk = _glob_triggers_table[ ''+_keys[_k] ] ;
         if ( _trigger_chunk != null )
         {
            _title = _trigger_chunk[0].stripslashes(), _desc = _trigger_chunk[1].stripslashes(), _auto = safe_int( _trigger_chunk[4], 0 );
            HTMLcode += "<tr><td ROWSPAN=\"2\" VALIGN=\"top\">"+(_k+1)+".&nbsp;"+"</td><td VALIGN=\"top\" CLASS=\"link\" ONCLICK=\"javascript:circles_lib_triggers_open('"+_keys[_k]+"');\"><b>"+_title+"</b></td><td ALIGN=\"center\"><INPUT ID=\"CIRCLES"+_subset+"TRIGGERScheckbox"+_k+"\" TYPE=\"checkbox\" "+( _auto ? "CHECKED" : "" )+" ONCLICK=\"javascript:_glob_triggers_table['"+_keys[_k]+"'][4] = this.checked?1:0;\"></td></tr>" ;
            HTMLcode += "<tr><td VALIGN=\"top\" STYLE=\"color:#606060;\" CLASS=\"link\" ONCLICK=\"javascript:circles_lib_triggers_open('"+_keys[_k]+"');\">"+_desc+"</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
         }
       }

       HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode += "</DIV>" ;
       HTMLcode += "</td></tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td VALIGN=\"top\"><table WIDTH=\"100%\"><tr>" ;
       HTMLcode += "<td WIDTH=\"2\"></td>" ;
       HTMLcode += "<td ID=\"circles_lib_triggers_outbox\" HEIGHT=\"22\"></td>" ;
       HTMLcode += "<td WIDTH=\"2\"></td>" ;
       HTMLcode += "</tr></table></td></tr>" ;
    }
    else
    {
        HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:#909090;\">No triggers found</td></tr>" ;
    }
    HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    HTMLcode += "</table>";

    GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
    if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
    _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

    var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
    circles_lib_plugin_activate( NO, _base_id, arguments.callee.name, arguments, _subset, OPEN, _div.id, CIRCLESformsTRIGGERScaption );
    if ( _move && _div != null ) move_div( _div.id, "LEFT", "BOTTOM", WIDTH, HEIGHT );

    CIRCLESformsTRIGGERSdispatcher();
}