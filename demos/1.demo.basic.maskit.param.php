<link rel="stylesheet" type="text/css" href="http://alessandrorosa.altervista.org/demo_n/demo_n.css">
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="http://alessandrorosa.altervista.org/demo_n/demo_n.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" defer>
var _demon = new demo_n();
    _demon.add( { ctrl_id : "alertYESbtn", time : 1.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "<div ID=\"presentation_div\" CLASS=\"general_rounded_corners\" STYLE=\"position:absolute;z-index:2000;font-size:14pt;font-family:arial;width:340px;height:auto;padding:6px;text-align:center;color:white;\"></div>" ).appendTo("body");
                     $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     $( "#presentation_div" ).html( "CIRCLES DEMO #<?php echo $GLOBALS["DEMO_IDX"]; ?><br>A simple example on<br>deterministic IFS" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadein", set_value : { to_x : "center", to_y : "center", speed : "slow" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "Plan : I'll call the Maskit T1,1 form, input the parameter \mu<br>and render the related limit set" ) ;
                  },
                  ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "plugin_maskitonce", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the 'Maskit T1,1 embedding' form",
                  post_fn : function()
                  {
                    circles_lib_plugin_load('embeddings','maskit.once','1','0','1');
                    circles_lib_menu_entries_update();
                  } } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 1.5, time_unit : "s",
                  action : "focus", set_value : "", showlabel : true, desclabel : "Focus on the parameter box" } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 130, time_unit : "ms",
                  action : "clean", set_value : "", showlabel : false, desclabel : ""
                } );

    var _str = "1.61688i+0.70567" ;
    for( var _i = 0 ; _i < _str.length ; _i++ )
    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 130, time_unit : "ms",
                  action : "keypress", set_value : _str[_i], showlabel : true, desclabel : "Writing down the parameter for the group"
                } );
                
    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "Now I'll set up some parameters to render the limit set" ) ;
                  },
                  ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "STATUSBARdepthEDIT", time : 1.5, time_unit : "s",
                  action : "keydel", set_value : "", showlabel : true, desclabel : "Deleting the old rendering depth"
                } );
    _demon.add( { ctrl_id : "STATUSBARdepthEDIT", time : 1.5, time_unit : "s",
                  action : "keypress", set_value : 10, showlabel : true, desclabel : "Set the new rendering depth to 10",
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

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#69D69A" ) ;
                     $( "#presentation_div" ).html( "Finally, I'm ready to initialize the group of Mobius Maps<br>and start the rendering via deterministic breadth first search" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 180 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 1.5, time_unit : "s",
                  action : "focus", set_value : _str[_i], showlabel : true, desclabel : "Group initialization",
                  post_fn : function(){
                        var press = jQuery.Event("keypress");
                        press.ctrlKey = false;
                        press.keyCode = 13;
                        _plugin_step_index = 0;
                        CIRCLESembeddingsMASKITONCE_EVENTS( 'PLUGIN_PARAM_MU', press );
                        _plugin_step_index = 0.1;
                        CIRCLESembeddingsMASKITONCE_EVENTS( 'PLUGIN_PARAM_MU', press );
                } } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#69D69A" ) ;
                     $( "#presentation_div" ).html( "First a dictionary of words of depth " + _glob_depth + " will be computed.<br>Then, the rendering will be perfomed." ) ;
                  },
                  ctrl_id : "presentation_div", time : 3.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 180 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 1.5, time_unit : "s",
                  action : "focus", set_value : _str[_i], showlabel : false, desclabel : "",
                  post_fn : function(){
                        var press = jQuery.Event("keypress");
                        press.ctrlKey = false;
                        press.keyCode = 13;

                        _plugin_step_index = 1.1;
                        CIRCLESembeddingsMASKITONCE_EVENTS( 'PLUGIN_PARAM_MU', press );
                } } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                    $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                    var _html = "END OF DEMO #<?php echo $DEMO_IDX ; ?><br>Pull your negative thoughts away !" ;
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