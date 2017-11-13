<link rel="stylesheet" type="text/css" href="http://alessandrorosa.altervista.org/demo_n/demo_n.css">
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="../demo_n/demo_n.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" defer>
var _demon = new demo_n();
    _demon.add( { ctrl_id : "alertYESbtn", time : 1.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "<div ID=\"presentation_div\" CLASS=\"general_rounded_corners\" STYLE=\"position:absolute;z-index:2000;font-size:14pt;font-family:arial;width:340px;height:auto;padding:6px;text-align:center;color:white;\"></div>" ).appendTo("body");
                     $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                     $( "#presentation_div" ).height( "auto" ) ;
                     $( "#presentation_div" ).html( "CIRCLES DEMO #<?php echo $GLOBALS["DEMO_IDX"]; ?><br>Building up the modular group<br>via Terminal and<br>General Purpose plug-in" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadein", set_value : { to_x : "center", to_y : "center", speed : "slow" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "We're are going to build up the classical modular group<br>through terminal commands and &lsquo;General Purpose&rsquo; plug-in" ) ;
                  },
                  ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { circles_lib_plugin_load('forms','terminal',YES,0,YES); circles_lib_plugin_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'RIGHT', '' ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the Terminal console" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "method algebraic" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

				  _demon.add( { post_fn : function() { _glob_terminal.exec( "process breadthfirst" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "config set drawentity isometric" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "config set fixedpoints input" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "config set construction tiling" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "dict createflag on" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

				  _demon.add( { post_fn : function() { _glob_terminal.exec( "depth 8" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set embeddings general.purpose" ); _glob_terminal.exec( "plugin open" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "The generators modular group are g<sub>1</sub>(z):&nbsp;-1/z and g<sub>2</sub>(z):&nbsp;z+1" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "Here we will use a parameter<br>-- say &lsquo;_a = 1&rsquo; --<br>to build the generators of the modular group" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send tab custom.vars" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send var.register _a 1" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send var.select 1" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "Let's input the parameters A, B, C, D for each mobius map generator" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send tab input.maps" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

				  _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     var _code = "1st generator: -1/z<br>Method 1: the argument &lsquo;add&rsquo; immediately registers the mobius map" ;
                     $( "#presentation_div" ).html( _code ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : 30, to_y : $(window).height() - 110 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send type 0 -_a _a 0 addmap" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     var _code = "2nd generator: z+1<br>Method 2: type the parameters and add the mobius map in two separated steps" ;
                     $( "#presentation_div" ).html( _code ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : 30, to_y : $(window).height() - 110 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send type _a _a 0 _a" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send addmap" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

	_demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send tab maps.list" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

				  _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     var _code = "... and now we can generate the group" ;
                     $( "#presentation_div" ).html( _code ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : 30, to_y : $(window).height() - 110 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send generate.group" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin close" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms terminal" ); _glob_terminal.exec( "plugin close" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     var _code = "We're ready for the final rendering" ;
                     $( "#presentation_div" ).html( _code ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : 30, to_y : $(window).height() - 110 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "STATUSBARrenderBTN", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "Rendering ... go !" } );

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