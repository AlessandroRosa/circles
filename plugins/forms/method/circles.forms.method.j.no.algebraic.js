function CIRCLESmethodMANAGERrepetendsPANEL()
{
    var HTMLcode = "" ;
    if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) && _glob_process.is_one_of( PROCESS_BREADTHFIRST ) )
    {
    	HTMLcode = "<table WIDTH=\"100%\">" ;
      HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
      HTMLcode += "<tr><td WIDTH=\"5\"></td><td ALIGN=\"center\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#EDEDED;padding:6px;\">Note: repetends are evaluated without affecting the original dictionary entries</td></tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F5F5F5;padding:4px;\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td>Repetends of length</td>" ;
      HTMLcode += "<td WIDTH=\"2\"></td>" ;
      HTMLcode += "<td><INPUT ID=\"ALGEBRAICrepetendsLENGTH\" ONKEYUP=\"javascript:CIRCLESformsMETHODeventsHANDLER( this.id, event, YES );\" TYPE=\"edit\" STYLE=\"width:40px;text-align:center;\"></td>" ;
      HTMLcode += "<td WIDTH=\"20\"></td>" ;
      HTMLcode += "<td>Pattern</td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td><INPUT CHECKED NAME=\"ALGEBRAICsuggestRADIO\" ID=\"ALGEBRAICsuggestRADIO_01\" TYPE=\"radio\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrepetendsSTORE(YES);\"></td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td>Symbol</td>" ;
      HTMLcode += "<td WIDTH=\"10\"></td>" ;
      HTMLcode += "<td><INPUT NAME=\"ALGEBRAICsuggestRADIO\" ID=\"ALGEBRAICsuggestRADIO_02\" TYPE=\"radio\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrepetendsSTORE(YES);\"></td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td>Commutator</td>" ;
      HTMLcode += "<td WIDTH=\"15\"></td>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrepetendsSTORE(NO);\">Suggest</td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;

      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F5F5F5;padding:4px;\">" ;
      HTMLcode += "<table>" ;
      HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td>Attach repetend</td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td>to words terminating with</td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td><INPUT ID=\"ALGEBRAICrepetendsINPUTword\" TYPE=\"edit\" STYLE=\"width:150px;\" ONKEYUP=\"javascript:CIRCLESformsMETHODeventsHANDLER( this.id, event );\"></td>" ;
      HTMLcode += "<td WIDTH=\"3\"></td>" ;
      HTMLcode += "<td><INPUT ID=\"ALGEBRAICrepetendsINPUTtermination\" TYPE=\"edit\" STYLE=\"width:150px;\" ONKEYUP=\"javascript:CIRCLESformsMETHODeventsHANDLER( this.id, event );\"></td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrepetendsADD();\">Add</td>" ;
      HTMLcode += "<td WIDTH=\"2\"></td>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrepetendsCLEAN();\">Clean</td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F5F5F5;padding:4px;\" ID=\"ALGEBRAICrepetendsCONTAINER\"></td>" ;
      HTMLcode += "</tr>" ;

      HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td VALIGN=\"top\" ALIGN=\"right\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F1F1F1;padding:4px;\">" ;
      HTMLcode += "<table ALIGN=\"right\">" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:$('#customloader').val('');$('#customloader').trigger('click');\">Load</td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrepetendsSAVE();\">Save</td>" ;
      HTMLcode += "<td WIDTH=\"10\"></td>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrepetendsBOMB();\">Bomb</td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESmethodMANAGERrepetendsLIST();\">List</td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;

      HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    }
    else
    {
   		HTMLcode = "<table WIDTH=\"100%\">" ;
      HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
      HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:"+get_color_tag_value( "gray" )+";\">The method '"+circles_lib_method_get_def( _glob_method )+"'<br>or the process '"+circles_lib_process_get_def( _glob_process )+"'<br>does not support repetends management</td></tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
      HTMLcode += "<tr><td CLASS=\"link\" ALIGN=\"center\" STYLE=\"font-size:12pt;color:#8FBAC8;\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','method',NO,0,_glob_method,null);\">Reload</td></tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
		}
      
    HTMLcode += "</table>" ;
    $( "#ALGEBRAICrepetendsPANELcontainer" ).html( HTMLcode );
}

function CIRCLESformsMETHODmanagerNOALGEBRAIC( new_method, caller_fn )
{
    var _items_array = _glob_seeds_array ;
    var HTMLcode = "", _items_n = circles_lib_count_items( _items_array );
    if ( _items_n > 0 )
    {
       HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
       HTMLcode += "<tr><td WIDTH=\"5\"></td><td>"+_QUESTION_28+"</td></tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td COLSPAN=\"3\" VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
       HTMLcode += "<table>" ;
       HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
       HTMLcode += "<tr>";
       HTMLcode += "<td WIDTH=\"5\"></td>" ;
       HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','seeds.list');\">List</td>" ;
       HTMLcode += "<td WIDTH=\"10\"></td>";
       HTMLcode += "<td ID=\"ALGEBRAICinitBTN\" CLASS=\"link\" ONCLICK=\"javascript:$('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);circles_lib_items_init();circles_lib_plugin_load('forms','method',YES,0,"+new_method+" );\">Init</td>";
       HTMLcode += "<td WIDTH=\"15\"></td>";
       HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_alphabet_autoconfig_all_symbols(YES,NO,NO);circles_lib_plugin_load('forms','method',YES,0,"+new_method+");\">Set symbols</td>" ;
       HTMLcode += "<td WIDTH=\"15\"></td>";
       HTMLcode += "<td ID=\"ALGEBRAICrenderBTN\" "+( !_glob_worker_lock ? " CLASS=\"link\" ONCLICK=\"javascript:circles_lib_method_set( _glob_method );circles_lib_canvas_process_ask(YES,NO,_glob_bip_use?BIP_BOX:_glob_target_plane,YES,YES,CHECK);\"" : " CLASS=\"linkdead\"" )+">Render</td>";
       HTMLcode += "<td WIDTH=\"10\"></td>";
       HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','help.items');\">Help</td>";
       HTMLcode += "<td WIDTH=\"10\"></td>";
       if ( caller_fn.length > 0 )
       HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:"+caller_fn+";\">Back</td>";
       HTMLcode += "</tr>";
       HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode += "</td>" ;
       HTMLcode += "</tr>" ;
    }
    else
    {
       HTMLcode += "<tr><td WIDTH=\"5\"></td><td ALIGN=\"center\" STYLE=\"color:red;font-size:10pt;\">"+_ERR_33_01+"</td></tr>" ;
       HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
       HTMLcode += "<tr>" ;
       HTMLcode += "<td COLSPAN=\"3\" VALIGN=\"top\" CLASS=\"popup_buttons_bar\" WIDTH=\"100%\">" ;
       HTMLcode += "<table>" ;
       HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
       HTMLcode += "<tr>";
       HTMLcode += "<td WIDTH=\"5\"></td>";
       HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','seeds.list');\">List</td>" ;
       HTMLcode += "<td WIDTH=\"15\"></td>" ;
       HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_load('terminal',NO);\">Add circle</td>";
       HTMLcode += "<td WIDTH=\"15\"></td>";
       HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_load('terminal',YES);\">Add map</td>";
       HTMLcode += "<td WIDTH=\"15\"></td>";
       HTMLcode += "<td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','help.items');\">Help</td>";
       HTMLcode += "</tr>";
       HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
       HTMLcode += "</table>" ;
       HTMLcode += "</td>" ;
       HTMLcode += "</tr>" ;
    }

    return HTMLcode ;
}