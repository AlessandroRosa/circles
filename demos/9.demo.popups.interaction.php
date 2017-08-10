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
                     $( "#presentation_div" ).html( "CIRCLES DEMO #9<br/>Popups windows interaction" ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "fadein", set_value : { to_x : "center", to_y : "center", speed : "slow" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 1, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { circles_lib_plugin_load('forms','terminal',YES,0,YES); circles_lib_plugin_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'RIGHT', '' ); }
                } );

    _demon.add( { ctrl_id : "", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { _glob_terminal.exec( "plugin set forms anti.homography" ); _glob_terminal.exec( "plugin open" ); }
                } );

    _demon.add( { ctrl_id : "", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { _glob_terminal.exec( "movewnd forms anti.homography left bottom" ); }
                } );

    _demon.add( { ctrl_id : "", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { _glob_terminal.exec( "plugin set embeddings jorgensen" ); _glob_terminal.exec( "plugin open" ); }
                } );

    _demon.run();
</SCRIPT>