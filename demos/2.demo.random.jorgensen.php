<link rel="stylesheet" type="text/css" href="http://alessandrorosa.altervista.org/demo_n/demo_n.css">
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="http://alessandrorosa.altervista.org/demo_n/demo_n.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" defer>
var _demon = new demo_n();
    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "<div ID=\"presentation_div\" CLASS=\"general_rounded_corners\" STYLE=\"position:absolute;z-index:5;font-size:14pt;font-family:arial;width:340px;height:50px;text-align:center;color:white;\"></div>" ).appendTo("body");
                     $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     $( "#presentation_div" ).html( "CIRCLES DEMO #<?php echo $GLOBALS["DEMO_IDX"]; ?><br>Random IFS example<br>based upon Jorsensen's slice" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadein", set_value : { to_x : "center", to_y : "center", speed : "slow" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "Plan : I'll call the Jorgensen's slice form, input the parameters Alpha and Beta<br>and render the related limit set" ) ;
                  },
                  ctrl_id : "presentation_div", time : 3.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "MENU_PROCESS_RANDOM", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Setting the rendering process to RANDOM generators",
                  post_fn : function() { circles_lib_process_set(PROCESS_RANDOM);_glob_fixedpt_io=FIXEDPOINTS_IO_INPUT;circles_lib_menu_entries_update(); }
              } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "To speed-up the whole process,<br>I'll drop the deterministic approach in favor of a RANDOM IFS" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2.5, time_unit : "s",
                  action : "move", set_value : { to_x : $(window).width() - 420, to_y : 80 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { circles_lib_plugin_load('forms','triggers',YES); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the 'Triggers' form" } );

    _demon.add( { ctrl_id : "CIRCLESformsTRIGGERScheckbox1", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Boosting the commutator option",
                  post_fn : function(){ _glob_triggers_table['gens_set_01'][4] = 1 ; }
                } );

    _demon.add( { ctrl_id : "plugin_jorgensen", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the 'Jorgensen slice' form",
                  post_fn : function()
                  {
                    circles_lib_plugin_load('embeddings','jorgensen','1','0','1');
                    circles_lib_menu_entries_update();
                  }
                } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_ALPHA", time : 130, time_unit : "ms",
                  action : "clean", set_value : "", showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_ALPHA", time : 2, time_unit : "s",
                  action : "focus", set_value : "", showlabel : true, desclabel : "Focus on the 'Alpha' parameter box" } );

    _demon.add( { ctrl_id : "PLUGINpresetsCOMBO", time : 2, time_unit : "s",
                  action : "select", set_value : 15, showlabel : true, desclabel : "Select a preset parameters configuration" } );

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

    _demon.add( { ctrl_id : "PLUGIN_PARAM_BETA", time : 2, time_unit : "s",
                  action : "focus", set_value : "", showlabel : true, desclabel : "Group initialization",
                  post_fn : function(){
                      circles_lib_canvas_coords_acquire( ALL_PLANES );
                      CIRCLESembeddingsJORGENSEN_INIT(NO,YES);
          					  CIRCLESembeddingsJORGENSEN_COMP(YES);
                      CIRCLESembeddingsJORGENSEN_CONFIG();
                      GLOB_PLUGIN_WIZARD_STEP(0.1,NO);
                      GLOB_PLUGIN_WIZARD_STEP(1.1,YES);
          						circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "Group has been init with success", 'PLUGIN_OUTMSG') ;
                } } );

    _demon.add( { ctrl_id : "STATUSBARrenderBTN", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );
                
    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                    $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                    var _html = "END OF DEMO #<?php echo $DEMO_IDX ; ?><br>Thanks for watching !" ;
                        _html += "<br><br><SPAN STYLE=\"font-size:11pt;\">To watch other demos" ;
                        _html += "<br>Open men&uacute; '?'" ;
                    $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 7, time_unit : "s",
                  action : "show", set_value : { to_x : "center", to_y : "center" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.run();
</SCRIPT>        