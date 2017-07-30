<link rel="stylesheet" type="text/css" href="http://alessandrorosa.altervista.org/demo_n/demo_n.css">
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="http://alessandrorosa.altervista.org/demo_n/demo_n.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" defer>
var _demon = new demo_n();
    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "<div ID=\"presentation_div\" CLASS=\"general_rounded_corners\" STYLE=\"position:absolute;z-index:2000;font-size:14pt;font-family:arial;width:340px;height:auto;padding:6px;text-align:center;color:white;\"></div>" ).appendTo("body");
                     $( "#presentation_div" ).css( "background-color", "#9AD2FB" ) ;
                     $( "#presentation_div" ).html( "CIRCLES DEMO #4<br>Group conjugations via console" ) ;
                     $( "#presentation_div" ).show() ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "move", set_value : { to_x : "center", to_y : "center" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "hide", set_value : null, showlabel : false, desclabel : ""
                } );

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

    _demon.add( { ctrl_id : "plugin_maskitonce", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Calling the 'Maskit punctured once' form",
                  post_fn : function()
                  {
                    circles_lib_popup_load('embeddings','maskit.once','1','0','1');
                    circles_lib_menu_entries_update();
                  }
                } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 2, time_unit : "s",
                  action : "focus", set_value : "", showlabel : true, desclabel : "Focus on the parameter box" } );

    var _str = "1.92i-0.03" ;
    for( var _i = 0 ; _i < _str.length ; _i++ )
    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 130, time_unit : "ms",
                  action : "keypress", set_value : _str[_i], showlabel : true, desclabel : "Writing down the parameter"
                } );
                
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

    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 2, time_unit : "s",
                  action : "focus", set_value : _str[_i], showlabel : true, desclabel : "Group initialization",
                  post_fn : function(){
                      circles_lib_canvas_coords_acquire( ALL_PLANES );
                      CIRCLESembeddingsMASKITONCE_INIT(NO,YES);
          					  CIRCLESembeddingsMASKITONCE_COMP(YES);
                      CIRCLESembeddingsMASKITONCE_CONFIG();
                      GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
                      GLOB_PLUGIN_WIZARD_STEP(1.1,YES);
          						circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;
                } } );
                
                
    _demon.add( { ctrl_id : "STATUSBARrenderBTN", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );
                
    _demon.add( { ctrl_id : "alertYESbtn", time : 18, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { circles_lib_popup_load('forms','terminal',YES,0,YES); circles_lib_popup_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'RIGHT', '' ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the Terminal console" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "dg conjugate map:D1toH apply init" ); circles_lib_popup_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'LEFT', '' ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : true, desclabel : "Conjugating the input group" } );

    _demon.add( { ctrl_id : "STATUSBARrenderBTN", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "Rendering ... go !" } );

    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.run();
</SCRIPT>        