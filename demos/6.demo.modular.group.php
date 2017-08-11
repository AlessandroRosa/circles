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
                     $( "#presentation_div" ).html( "CIRCLES DEMO #<?php echo $GLOBALS["DEMO_IDX"]; ?><br>Plotting the Modular Group" ) ;
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
                     $( "#presentation_div" ).height( "auto" ) ;
                     var _html = "The modular group<br>includes Mobius Maps<br>with determinant 1<br>and integer coefficients" ;
                     $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 4, time_unit : "s",
                  action : "move", set_value : { to_x : $(window).width() - 460, to_y : "center" }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).css( "line-height", "22pt" ) ;
                     $( "#presentation_div" ).css( "padding", "8pt" ) ;
                     $( "#presentation_div" ).width( "auto" ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     var _html = "I'll input the (integer) coefficients of each generator" ;
                         _html += "<br>through a special mask, called '<SPAN STYLE=\"color:yellow;\">General Purpose</SPAN>'" ;
                         _html += "<br>because of the chance offered<br>to feed any value, not controlled" ;
                         _html += "<br>by special formulas, such as in the other embeddings" ;
                     $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 6, time_unit : "s",
                  action : "move", set_value : { to_x : $(window).width() - 570, to_y : 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { circles_lib_plugin_load('embeddings','general.purpose',YES,0,YES); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the General Purpose mask" } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_A", time : 1, time_unit : "s",
                  action : "keypress", set_value : "1", showlabel : true, desclabel : "Setting param A for 1st generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_B", time : 1, time_unit : "s",
                  action : "keypress", set_value : "0", showlabel : true, desclabel : "Setting param B for 1st generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_C", time : 1, time_unit : "s",
                  action : "keypress", set_value : "-2", showlabel : true, desclabel : "Setting param C for 1st generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_D", time : 1, time_unit : "s",
                  action : "keypress", set_value : "1", showlabel : true, desclabel : "Setting param D for 1st generator" } );
    _demon.add( { ctrl_id : "CIRCLESembeddingsGENERALPURPOSE_ADD_BTN", time : 1, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Insert the 1st generator" } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_A", time : 1, time_unit : "s",
                  action : "keypress", set_value : "1", showlabel : true, desclabel : "Setting param A for 2nd generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_B", time : 1, time_unit : "s",
                  action : "keypress", set_value : "2", showlabel : true, desclabel : "Setting param B for 2nd generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_C", time : 1, time_unit : "s",
                  action : "keypress", set_value : "0", showlabel : true, desclabel : "Setting param C for 2nd generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_D", time : 1, time_unit : "s",
                  action : "keypress", set_value : "1", showlabel : true, desclabel : "Setting param D for 2nd generator" } );
    _demon.add( { ctrl_id : "CIRCLESembeddingsGENERALPURPOSE_ADD_BTN", time : 2, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Insert the 2nd generator" } );

    _demon.add( { ctrl_id : "PLUGIN_GENERATE_GROUP_BTN", time : 2, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Generate the 2-generators group" } );

    _demon.add( { ctrl_id : "MENU_ENTITY_ISOMETRIC_CIRCLE", time : 2, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Draw entity is 'Isometric Circle'" } );

    _demon.add( { ctrl_id : "STATUSBARdepthEDIT", time : 1.5, time_unit : "s",
                  action : "keydel", set_value : "", showlabel : true, desclabel : "Deleting the old rendering depth"
                } );
    _demon.add( { ctrl_id : "STATUSBARdepthEDIT", time : 1.5, time_unit : "s",
                  action : "keypress", set_value : 6, showlabel : true, desclabel : "Set the new rendering depth to 6",
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

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : "",
                  post_fn : function()
                  {
                     circles_lib_plugin_dispatcher_unicast_message( 'general.purpose', "embeddings", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE );
                  }
                } );

    _demon.add( { ctrl_id : "STATUSBARrenderBTN", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                    $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                    var _html = "END OF DEMO #6<br>Forget the past, forgive the Present !" ;
                        _html += "<br><br><SPAN STYLE=\"font-size:11pt;\">To watch other demos" ;
                        _html += "<br>change n at ?demo=n inside the URL bar" ;
                        _html += "<br>where 1 <= n <= <?php echo $GLOBALS['MAX_IDX']; ?></SPAN>" ;
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