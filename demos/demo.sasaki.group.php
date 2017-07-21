<link rel="stylesheet" type="text/css" href="http://alessandrorosa.altervista.org/demo_n/demo_n.css">
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="http://alessandrorosa.altervista.org/demo_n/demo_n.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" defer>
var _demon = new demo_n();
    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "<div ID=\"presentation_div\" CLASS=\"general_rounded_corners\" STYLE=\"position:absolute;z-index:5;font-size:14pt;font-family:arial;width:340px;height:50px;text-align:center;color:white;\"></div>" ).appendTo("body");
                     $( "#presentation_div" ).css( "background-color", "#9AD2FB" ) ;
                     $( "#presentation_div" ).html( "CIRCLES DEMO #7<br>An example of Sasaki group<br>via general purpose mask" ) ;
                     $( "#presentation_div" ).show() ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "move", set_value : { to_x : "center", to_y : "center" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "hide", set_value : null, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "MENU_ENTITY_PIXEL", time : 2, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Draw entity is 'Pixel'" } );

    _demon.add( { ctrl_id : "MENU_PROCESS_RANDOM", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Setting the process to RANDOM generators",
                  post_fn : function() { circles_lib_process_set(PROCESS_RANDOM);_glob_fixedpt_io=FIXEDPOINTS_IO_INPUT;circles_lib_menu_entries_update(); }
              } );

    _demon.add( { post_fn : function() { circles_lib_popup_load('forms','triggers',YES); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the 'Triggers' form" } );

    _demon.add( { ctrl_id : "CIRCLESformsTRIGGERScheckbox1", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Boosting the commutator option",
                  post_fn : function(){ _glob_triggers_table['gens_set_01'][4] = 1 ; }
                } );
                
    _demon.add( { post_fn : function() { circles_lib_popup_load('embeddings','general.purpose',YES,0,YES); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the General Purpose mask" } );

    _demon.add( { post_fn : function(){ $("#CIRCLESGENERALPURPOSEmainDIV").get(0).tabber.tabShow(3) ; },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2, time_unit : "s",
                  action : "nothing", set_value : "0", showlabel : false, desclabel : "" } );
      
    // registering the param values
    _demon.add( { ctrl_id : "PLUGINvaridEDIT", time : 1.5, time_unit : "s",
                  action : "keypress", set_value : "_a", showlabel : true, desclabel : "Setting id for param _a" } );
    _demon.add( { ctrl_id : "PLUGINvarvalueEDIT", time : 1.5, time_unit : "s",
                  action : "keypress", set_value : "1+i/2", showlabel : true, desclabel : "Setting value #1 for param _a" } );
    _demon.add( { ctrl_id : "PLUGINparam_declareBTN", time : 1.5, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Declaring the param _a" } );
    _demon.add( { ctrl_id : "PLUGINparam_registerBTN", time : 1.5, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Registering the param _a" } );
    _demon.add( { ctrl_id : "PLUGINparam_cleanBTN", time : 1.5, time_unit : "s",
                  action : "click", set_value : null, showlabel : true, desclabel : "Clean the param _a entries" } );
    //              
    _demon.add( { post_fn : function(){ $("#CIRCLESGENERALPURPOSEmainDIV").get(0).tabber.tabShow(0) ; },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2, time_unit : "s",
                  action : "nothing", set_value : "0", showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_A", time : 1, time_unit : "s",
                  action : "keypress", set_value : "_a", showlabel : true, desclabel : "Setting param A for 1st generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_B", time : 1, time_unit : "s",
                  action : "keypress", set_value : "0", showlabel : true, desclabel : "Setting param B for 1st generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_C", time : 1, time_unit : "s",
                  action : "keypress", set_value : "0", showlabel : true, desclabel : "Setting param C for 1st generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_D", time : 1, time_unit : "s",
                  action : "keypress", set_value : "1/_a", showlabel : true, desclabel : "Setting param D for 1st generator" } );
    _demon.add( { ctrl_id : "CIRCLESembeddingsGENERALPURPOSE_ADD_BTN", time : 1, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Insert the 1st generator" } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_A", time : 1, time_unit : "s",
                  action : "keypress", set_value : "(_a^2+1)/(_a^2-1)", showlabel : true, desclabel : "Setting param A for 2nd generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_B", time : 1, time_unit : "s",
                  action : "keypress", set_value : "(4*_a^2)/(_a^4-1)", showlabel : true, desclabel : "Setting param B for 2nd generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_C", time : 1, time_unit : "s",
                  action : "keypress", set_value : "(_a^2+1)/(_a^2-1)", showlabel : true, desclabel : "Setting param C for 2nd generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_D", time : 1, time_unit : "s",
                  action : "keypress", set_value : "(_a^2+1)/(_a^2-1)", showlabel : true, desclabel : "Setting param D for 2nd generator" } );
    _demon.add( { ctrl_id : "CIRCLESembeddingsGENERALPURPOSE_ADD_BTN", time : 2, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Insert the 2nd generator" } );

    _demon.add( { ctrl_id : "PLUGIN_GENERATE_GROUP_BTN", time : 2, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Generate the 2-generators group" } );

    _demon.add( { ctrl_id : "STATUSBARdepthEDIT", time : 2, time_unit : "s",
                  action : "keydel", set_value : "", showlabel : true, desclabel : "Deleting the old rendering depth"
                } );
    _demon.add( { ctrl_id : "STATUSBARdepthEDIT", time : 2, time_unit : "s",
                  action : "keypress", set_value : 18, showlabel : true, desclabel : "Set the new rendering depth to 18",
                  post_fn : function()
                  {
                      var press = jQuery.Event("keypress");
                      press.ctrlKey = false;
                      press.altKey = false;
                      press.keyCode = 13 ;
                      press.stopPropagation = false 
                      press.cancelBubble = true ;
                      CIRCLESbarsSTATUSBAReventsKEYCODE( "STATUSBARdepthEDIT", press ) ;
                  }
                } );

    _demon.add( { ctrl_id : "STATUSBARrenderBTN", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "Rendering ... go !" } );

    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.run();
</SCRIPT>