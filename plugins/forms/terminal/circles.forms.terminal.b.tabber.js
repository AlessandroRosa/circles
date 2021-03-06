var CIRCLESTERMINALtabberOptions = {

  /* Optional: instead of letting tabber run during the onload event,
     we'll start it up manually. This can be useful because the onload
     even runs after all the tabs have finished loading, and we can
     run tabber at the bottom of our page to start it up faster. See the
     bottom of this page for more info. Note: this variable must be set
     BEFORE you include tabber.js.
  */
  'manualStartup':1,
  'prefix':'CIRCLESTERMINAL' + _glob_terminal_form_suffix,

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

  'tabsmanager' : function( i )
  {
      var _idx = circles_lib_plugin_find_index( { subset : "forms", base_id : "terminal" }, POPUP_SEARCH_BY_SUBSET | POPUP_SEARCH_BY_BASE_ID, 0 ) ;
      var _div_id = _idx != UNFOUND ? _glob_popups_array[_idx][1] : "" ;
      switch( i )
      {
        case 0: // terminal console
        _glob_output_channel = OUTPUT_TERMINAL ;
       	circles_lib_statusbar_set_output_stream( _glob_output_channel );
        setTimeout( function() { _glob_terminal.enable(); _glob_terminal.resize(); }, 10 );
        circles_lib_plugin_focus( _div_id );
        break;
        case 1: // batch compiler
        _glob_terminal.disable();
        _glob_output_channel = OUTPUT_SCRIPT ;
        circles_lib_statusbar_set_output_stream( _glob_output_channel );
        _glob_delayTICKincrement = 0.12 ;
        setTimeout( function() { CIRCLESformsTERMINALbatchcompilerFOCUS( _glob_terminal_form_suffix ); }, 10 );
        circles_lib_plugin_focus( _div_id );
        break;
        case 2: // debug window
        _glob_terminal.disable();
        _glob_output_channel = OUTPUT_CONSOLE ;
        circles_lib_plugin_focus( _div_id );
        break;
	    default: break ;
      }
  },

  'onClick': function(argsObj)
  {
    var t = argsObj.tabber; /* Tabber object */
    var id = t.id; /* ID of the main tabber DIV */
    var i = argsObj.index; /* Which tab was clicked (0 is the first tab) */
    var e = argsObj.event; /* Event object */

    CIRCLESformsTERMINALform_tab_index = i ;
    t.tabsmanager( CIRCLESformsTERMINALform_tab_index );
    if (id == 'tab2') {
      return confirm("Switch to "+t.tabs[i].headingText+"?"+_glob_crlf+"Event type: "+e.type);
    }
  },

  /* Optional: set an ID for each tab navigation link */
  'addLinkId': 1
};