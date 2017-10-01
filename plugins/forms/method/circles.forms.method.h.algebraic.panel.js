function CIRCLESformsMETHODalgebraicCHANGEtab( tabindex )
{
    var CIRCLESMETHODmainDIV = $( "#CIRCLESMETHODmainDIV" ).get(0);
    if ( CIRCLESMETHODmainDIV != null ) CIRCLESMETHODmainDIV.tabber.tabShow( tabindex );
}

function CIRCLESformsMETHODmanagerPROCESS( _b_switch, _process_type )
{
    _b_switch = safe_int( _b_switch, YES );
    _process_type = safe_int( _process_type, PROCESS_NONE );
    if ( _process_type == PROCESS_NONE ) _process_type = _glob_process ;
    if ( _b_switch ) circles_lib_items_switch_to( _glob_items_switch, YES );
    switch( _process_type )
    {
        case PROCESS_BREADTHFIRST:
        case PROCESS_INDEXSEARCH:
        break ;
        case PROCESS_RANDOM:
        CIRCLESmethodMANAGERrandomTABLEbuild(YES);
        CIRCLESmethodMANAGERrandomTABLEfill();
   	    CIRCLESmethodMANAGERrandomTABLEsave();
 		 	  CIRCLESmethodMANAGERrandomTABLEcheck();
        CIRCLESmethodMANAGERrandomTABLEmultisliderINIT();
        break ;
        default: break ;
    }

    CIRCLESmethodMANAGERrepetendsPANEL();
    if ( _glob_fixedpt_io == FIXEDPOINTS_IO_INPUT ) CIRCLESformsMETHODfixedpointsLIST();
}

function CIRCLESformsMETHODmanagerALGEBRAICpanelBUILD( _new_method, caller_fn, WIDTH )
{
    var _items_array = _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ) ;
    var HTMLcode = "" ;
    if ( _items_n > 0 )
    {
      if ( _glob_options_mask == 0 ) _glob_options_mask = 2 ;
                   
      HTMLcode += "<tr>" ;
      HTMLcode += "<td VALIGN=\"top\" STYLE=\"padding:4px;\">" ;
      HTMLcode += "<div id=\"CIRCLESMETHODmainDIV\" STYLE=\"width:"+(WIDTH-20)+"px;\" class=\"tabber\">" ;

      HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:"+(WIDTH-20)+"px;\" VALIGN=\"top\" ID=\"CIRCLESMETHOD_TAB_01\">" ;
      HTMLcode += "<h2>Repetends</h2>" ;
      HTMLcode += "<table WIDTH=\"100%\">" ;
      HTMLcode += "<tr><td VALIGN=\"top\" ID=\"ALGEBRAICrepetendsPANELcontainer\"></td></tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</div>" ;

      HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:"+(WIDTH-20)+"px;\" VALIGN=\"top\" ID=\"CIRCLESMETHOD_TAB_02\">" ;
      HTMLcode += "<h2>Generators set</h2>" ;
      HTMLcode += "<table WIDTH=\"100%\">" ;
      HTMLcode += "<tr><td VALIGN=\"top\" ID=\"ALGEBRAICgeneratorsPANELcontainer\"></td></tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
      HTMLcode += "<tr>" ;
			HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
			HTMLcode += "<table cellpadding=\"0\" cellspacing=\"0\" VALIGN=\"top\">" ;
			HTMLcode += "<tr>" ;
			HTMLcode += "<td ID=\"ALGEBRAICgeneratorsSETaddBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERgeneratorNEW();\">New</td>" ;
      HTMLcode += "<td WIDTH=\"1\"></td>" ;
      HTMLcode += "<td ID=\"ALGEBRAICgeneratorsSETsetupBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERgensSETUP(NO,YES);\">Set up</td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td WIDTH=\"22\" HEIGHT=\"22\" ALIGN=\"center\" ID=\"ALGEBRAICgeneratorsSETsetupWARNINGicon\"></td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td ID=\"ALGEBRAICgeneratorsSETreportBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_output( OUTPUT_SCREEN, DISPATCH_INFO, _glob_gens_set_report, _glob_app_title );\">Report</td>" ;
      HTMLcode += "<td WIDTH=\"1\"></td>" ;
      HTMLcode += "<td ID=\"ALGEBRAICgeneratorsSETrestoreBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERgeneratorRESTOREfromRANDOMprobs(CIRCLESformsMETHODskipconfirm?0:1);\">Restore</td>" ;
      HTMLcode += "<td WIDTH=\"1\"></td>" ;
      HTMLcode += "<td ID=\"ALGEBRAICgeneratorsSETreloadBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERreload();\">Reload</td>" ;
      HTMLcode += "<td WIDTH=\"1\"></td>" ;
      HTMLcode += "<td ID=\"ALGEBRAICgeneratorsSETsortBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERgensSORT();\">Sort</td>" ;
      HTMLcode += "<td WIDTH=\"1\"></td>" ;
      HTMLcode += "<td ID=\"ALGEBRAICgeneratorsSETflushBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERgensBOMB(YES,CIRCLESformsMETHODskipconfirm?0:1);\">Bomb</td>" ;
      HTMLcode += "<td WIDTH=\"1\"></td>" ;
      HTMLcode += "<td ID=\"ALGEBRAICgeneratorsSETsaveBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERgensSAVE();\">Save</td>" ;
			HTMLcode += "</tr>" ;
			HTMLcode += "</table>" ;
			HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
      HTMLcode += "<tr>" ;
			HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
			HTMLcode += "<table cellpadding=\"0\" cellspacing=\"0\" VALIGN=\"top\">" ;
 		  HTMLcode += "<tr>" ;
 		  HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td ID=\"ALGEBRAICgeneratorsSETexactBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERgensEXACT(NO,YES);$('#ALGEBRAICgenssetPRESETScombo').val('');\">Exact</td>" ;
 		  HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td ID=\"ALGEBRAICgeneratorsSETrenderBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_canvas_process_ask(YES,NO,_glob_bip_use?BIP_BOX:_glob_target_plane,YES,YES,CHECK);\">Render</td>" ;
      HTMLcode += "<td WIDTH=\"20\"></td>" ;
 		  HTMLcode += "<td>Models</td>" ;
 		  HTMLcode += "<td WIDTH=\"3\"></td>" ;
 		  HTMLcode += "<td>" ;
 		  HTMLcode += "<SELECT ID=\"ALGEBRAICgenssetPRESETScombo\" ONCHANGE=\"javascript:CIRCLESgenssetMANAGERgensMODELScombo(CIRCLESformsMETHODskipconfirm?0:1);\">" ;
 		  HTMLcode += "<OPTION VALUE=\"0\"></OPTION>" ;
          var _ps_n = safe_size( _glob_presets['genssets'], 0 ), _chunk ;
          for( var _i = 0 ; _i < _ps_n ; _i++ )
          {
              _chunk = _glob_presets['genssets'][_i] ;
        		  HTMLcode += "<OPTION VALUE=\"1\">"+_chunk[0]+"</OPTION>" ;
          }
 		  HTMLcode += "</SELECT>" ;
 		  HTMLcode += "</td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td ID=\"ALGEBRAICgeneratorsBUILDmodelsBTN\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESgenssetMANAGERgensMODELScombo(CIRCLESformsMETHODskipconfirm?0:1);\">Build</td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td ID=\"ALGEBRAICgeneratorsSETcomboCONTAINER\"></td>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
			HTMLcode += "</tr>" ;
			HTMLcode += "</table>" ;
			HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;

      HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td valign=\"top\" ID=\"ALGEBRAICnewGENERATORStableCONTAINER\">" ;
      HTMLcode += "<table ID=\"ALGEBRAICnewGENERATORStable\" WIDTH=\"100%\">" ;
      HTMLcode += CIRCLESgenssetMANAGERshowGENStable();
      HTMLcode += "</table>" ;
      
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</div>" ;

      HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:"+(WIDTH-20)+"px;\" VALIGN=\"top\" ID=\"CIRCLESMETHOD_TAB_03\">" ;
      HTMLcode += "<h2>Random IFS table</h2>" ;
      HTMLcode += "<table WIDTH=\"100%\">" ;
      HTMLcode += "<tr>" ;
      HTMLcode += "<td WIDTH=\"5\"></td>" ;
      HTMLcode += "<td VALIGN=\"top\" VALIGN=\"top\" ID=\"ALGEBRAICrandomCONTAINER\" WIDTH=\"100%\"></td>" ;
      HTMLcode += "</tr>" ;
      HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</div>" ;

      HTMLcode += "<div class=\"tabbertab\" STYLE=\"width:"+(WIDTH-20)+"px;\" VALIGN=\"top\" ID=\"CIRCLESMETHOD_TAB_04\">" ;
      HTMLcode += "<h2>Input points</h2>" ;
      HTMLcode += "<table WIDTH=\"100%\">" ;
      HTMLcode += "<tr><td ID=\"ALGEBRAICfixedpointsPANELcontainer\" ALIGN=\"center\"></td></tr>" ;
      HTMLcode += "</table>" ;
      HTMLcode += "</div>" ;

      HTMLcode += "</div>" ;
      HTMLcode += "</td>" ;
      HTMLcode += "</tr>" ;
    }
    else
    {
      HTMLcode += "<tr><td STYLE=\"color:red;font-size:14pt;\" ALIGN=\"center\">"+_ERR_33_01+"</td></tr>" ;          
      HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
    }
              
    return HTMLcode ;
}