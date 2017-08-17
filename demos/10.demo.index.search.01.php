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
                     $( "#presentation_div" ).html( "CIRCLES DEMO #<?php echo $GLOBALS["DEMO_IDX"]; ?><br/>Index search method" ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "fadein", set_value : { to_x : "center", to_y : "center", speed : "slow" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).width( 260 ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     var _html = "This example will render an attractor" ;
                         _html += "<br>via 'index search' deterministic method" ;
                     $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 4, time_unit : "s",
                  action : "move", set_value : { to_x : 355, to_y : $(window).height() - 240 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 1, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).width( 260 ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     var _html = "Get the terminal console and open a popup window" ;
                     $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : "left", to_y : $(window).height()-140 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
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
                  post_fn : function() { _glob_terminal.exec( "method algebraic indexsearch" ); }
                } );

    _demon.add( { ctrl_id : "", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { _glob_terminal.exec( "depth 12" ); }
                } );

    _demon.add( { ctrl_id : "", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { _glob_terminal.exec( "plugin set embeddings maskit.once" ); _glob_terminal.exec( "plugin open" ); }
                } );

    _demon.add( { ctrl_id : "", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { _glob_terminal.exec( "console resize 450 400" ); }
                } );

    _demon.add( { ctrl_id : "", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { _glob_terminal.exec( "movewnd forms terminal left bottom" ); }
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).width( 260 ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     var _html = "Now we select a preset configuration.<br>" ;
                     $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : 355, to_y : $(window).height() - 240 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 1, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "PLUGINpresetsCOMBO", time : 2, time_unit : "s",
                  action : "select", set_value : 13, showlabel : true, desclabel : "Selection" } );

    _demon.add( { ctrl_id : "", time : 1.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { _glob_terminal.exec( "plugin set embeddings maskit.once" ); _glob_terminal.exec( "plugin close" ); }
                } );

    _demon.add( { ctrl_id : "", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { _glob_terminal.exec( "plugin set forms terminal" ); _glob_terminal.exec( "plugin close" ); }
                } );

    _demon.add( { ctrl_id : "STATUSBARrenderBTN", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "Rendering ... go !" } );

    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                    $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                    var _html = "END OF DEMO #<?php echo $DEMO_IDX ; ?><br>What's yours, it'll naturally come to you and you'll go to it !" ;
                        _html += "<br><br><SPAN STYLE=\"font-size:11pt;\">To watch other demos" ;
                        _html += "<br>change n at ?demo=n inside the URL bar" ;
                        _html += "<br>where 1 <= n <= <?php echo $GLOBALS['MAX_DEMO_IDX']; ?></SPAN>" ;
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