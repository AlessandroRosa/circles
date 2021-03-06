<link rel="stylesheet" type="text/css" href="http://alessandrorosa.altervista.org/demo_n/demo_n.css">
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="http://alessandrorosa.altervista.org/demo_n/demo_n.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" defer>
var _demon = new demo_n();
    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "<div ID=\"presentation_div\" CLASS=\"general_rounded_corners\" STYLE=\"position:absolute;z-index:2000;font-size:14pt;font-family:arial;width:340px;height:auto;padding:6px;text-align:center;color:white;\"></div>" ).appendTo("body");
                     $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     $( "#presentation_div" ).html( "CIRCLES DEMO #<?php echo $GLOBALS["DEMO_IDX"]; ?><br>Group conjugations<br>via console commands" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadein", set_value : { to_x : "center", to_y : "center", speed : "slow" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     var _html = "We'll generate a group, show<br>how to conjugate and render it<br>" ;
                         _html += "<SPAN STYLE=\"font-size:10pt;\">(Random process will be applied)</SPAN>" ;
                     $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : $(window).width() - 500, to_y : $(window).height() - 130 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "MENU_PROCESS_RANDOM", time : 1, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { circles_lib_process_set(PROCESS_RANDOM);_glob_fixedpt_io=FIXEDPOINTS_IO_INPUT;circles_lib_menu_entries_update(); }
              } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     $( "#presentation_div" ).html( "So we first boost up the limit set generation !" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "move", set_value : { to_x : $(window).width() - 500, to_y : $(window).height() - 130 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { circles_lib_plugin_load('forms','triggers',YES); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the 'Triggers' form" } );

    _demon.add( { ctrl_id : "CIRCLESformsTRIGGERScheckbox1", time : 1.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Boosting the commutator option",
                  post_fn : function(){ _glob_triggers_table['gens_set_01'][4] = 1 ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     $( "#presentation_div" ).html( "Now we generate the group in the Earle embedding" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "move", set_value : { to_x : $(window).width() - 500, to_y : $(window).height() - 130 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "plugin_earle", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function()
                  {
                    circles_lib_plugin_load('embeddings','earle','1','0','1');
                    circles_lib_menu_entries_update();
                  }
                } );

    _demon.add( { ctrl_id : "PLUGINpresetsCOMBO", time : 2, time_unit : "s",
                  action : "select", set_value : 6, showlabel : true, desclabel : "Select a preset configuration" } );

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

    _demon.add( { ctrl_id : "PLUGIN_PARAM_D", time : 2, time_unit : "s",
                  action : "focus", set_value : null, showlabel : true, desclabel : "Group initialization",
                  post_fn : function(){
                      circles_lib_canvas_coords_acquire( ALL_PLANES );
                      CIRCLESembeddingsEARLE_INIT(NO,YES);
          			  CIRCLESembeddingsEARLE_COMP(YES);
                      CIRCLESembeddingsEARLE_CONFIG();
                      GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
                      GLOB_PLUGIN_WIZARD_STEP(1.1,YES);
  					  circles_lib_set_target_plane( "wplane" ) ;
          			  circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;
                } } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "Now we first render the limit set of the original group" ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "fadein", set_value : { to_x : $(window).width() - 380, to_y : $(window).height() - 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "STATUSBARrenderBTN", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );
                
    _demon.add( { ctrl_id : "alertYESbtn", time : 15, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "We open the terminal console<br>to compute the conjugation" ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "fadein", set_value : { to_x : "center", to_y : "center" }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { post_fn : function() { circles_lib_plugin_load('forms','terminal',YES,0,YES); circles_lib_plugin_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'RIGHT', '' ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#69D59E" ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     var _html = "The 'dg' command will conjugate the input group through" ;
                         _html += "<br>a Mobius transformation, mapping the unit disk to the upper half-plane (D1toH)" ;
                     $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 4, time_unit : "s",
                  action : "fadein", set_value : { to_x : $(window).width() - 400, to_y : "center" }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "dg conjugate map:D1toH apply init" ); circles_lib_plugin_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'LEFT', '' ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 4.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#69D59E" ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     var _html = "All generators in the current groups have been conjugated with success !" ;
                         _html += "<br>Let's see what happens to its limit set" ;
                     $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 4, time_unit : "s",
                  action : "fadein", set_value : { to_x : $(window).width() - 400, to_y : "center" }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "STATUSBARrenderBTN", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                    $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                    var _html = "END OF DEMO #<?php echo $DEMO_IDX ; ?><br>Have a nice day !" ;
                        _html += "<br><br><SPAN STYLE=\"font-size:11pt;\">To watch other demos" ;
                        _html += "<br>Open men&uacute; '?'" ;
                    $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 7, time_unit : "s",
                  action : "show", set_value : { to_x : "center", to_y : "center" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );
    _demon.run();
</SCRIPT>        