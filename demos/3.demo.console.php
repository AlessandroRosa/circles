<link rel="stylesheet" type="text/css" href="http://alessandrorosa.altervista.org/demo_n/demo_n.css">
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="http://alessandrorosa.altervista.org/demo_n/demo_n.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" defer>
var _demon = new demo_n();
    _demon.add( { ctrl_id : "alertYESbtn", time : 1.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "<div ID=\"presentation_div\" CLASS=\"general_rounded_corners\" STYLE=\"position:absolute;z-index:2000;font-size:14pt;font-family:arial;width:340px;height:auto;padding:6px;text-align:center;color:white;\"></div>" ).appendTo("body");
                     $( "#presentation_div" ).css( "background-color", "#9AD2FB" ) ;
                     $( "#presentation_div" ).html( "CIRCLES DEMO #3<br>Console commands" ) ;
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
                     $( "#presentation_div" ).html( "We're are going to generate<br/>a group of Mobius transformations and<br>illustrate some console commands." ) ;
                  },
                  ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "plugin_maskitonce", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Calling the 'Maskit embedding' form",
                  post_fn : function()
                  {
                    circles_lib_plugin_load('embeddings','maskit.once','1','0','1');
                    circles_lib_menu_entries_update();
                  } } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 1.5, time_unit : "s",
                  action : "focus", set_value : "", showlabel : true, desclabel : "Focus on the parameter box" } );

    var _str = "1.61688i+0.70567" ;
    for( var _i = 0 ; _i < _str.length ; _i++ )
    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 130, time_unit : "ms",
                  action : "keypress", set_value : _str[_i], showlabel : true, desclabel : "Writing down the parameter for the group"
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

    _demon.add( { post_fn : function() { circles_lib_plugin_load('forms','terminal',YES,0,YES); circles_lib_plugin_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'RIGHT', '' ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the Terminal console" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "depth 9" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : true, desclabel : "Setting the depth to 9" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "info group" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : true, desclabel : "Retrieving current group info" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "region zplane yellow cyan 0,2,1,0 opaq:0.2" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : true, desclabel : "Drawing a region on the z-plane" } );

    _demon.add( { pre_fn : function() { $( "#presentation_div" ).html( "END OF DEMO #3" ) ; },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "show", set_value : null, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );
    _demon.run();
</SCRIPT>        