var CIRCLESMETHODtabberOptions = {

  /* Optional: instead of letting tabber run during the onload event,
     we'll start it up manually. This can be useful because the onload
     even runs after all the tabs have finished loading, and we can
     run tabber at the bottom of our page to start it up faster. See the
     bottom of this page for more info. Note: this variable must be set
     BEFORE you include tabber.js.
  */
  'manualStartup':1,
  'prefix':'CIRCLESMETHOD',

  /* Optional: code to run after each tabber object has initialized */

  'onLoad': function(argsObj) {
    /* Display an alert only after tab2 */
    if (argsObj.tabber.id == 'tab2') {
      alert('Finished loading tab2!');
    }
  },

  /* Optional: code to run when the user clicks a tab. If this
     function returns boolean 0 then the tab will not be changed
     (the click is canceled). If you do not return a value or return
     something that is not boolean 0, */

  'onClick': function(argsObj) {
    var t = argsObj.tabber; /* Tabber object */
    var id = t.id; /* ID of the main tabber DIV */
    var i = argsObj.index; /* Which tab was clicked (0 is the first tab) */
    var e = argsObj.event; /* Event object */

    _glob_current_tab['method'] = i ;

    switch( i )
    {
       case 0: // repetends table - tab
       CIRCLESmethodMANAGERrepetendsPANEL();
       $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESmethodMANAGERrepetendsLOAD ) } ;
       break ;
       case 1: // generators set - tab
       if ( circles_lib_gens_initflag_get() && circles_lib_gens_model_count() > 0 ) CIRCLESgenssetMANAGERiconSETUP(YES);
       CIRCLESgenssetMANAGERreload();
       break ;
       case 2: // random table - tab
       CIRCLESmethodMANAGERrandomTABLEbuild(YES);
       CIRCLESmethodMANAGERrandomTABLEmultisliderINIT();
       break;
       case 3: // fixed points table - tab
       CIRCLESformsMETHODfixedpointsLIST();
       break ;
       default: break ;
    }

    if (id == 'tab2') {
      return confirm("Switch to "+t.tabs[i].headingText+"?"+_glob_crlf+"Event type: "+e.type);
    }
  },

  /* Optional: set an ID for each tab navigation link */
  'addLinkId': 1
};