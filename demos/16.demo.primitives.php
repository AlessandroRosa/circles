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
                     $( "#presentation_div" ).html( "CIRCLES DEMO #<?php echo $GLOBALS["DEMO_IDX"]; ?><br>Drawing primitives" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadein", set_value : { to_x : "center", to_y : "center", speed : "slow" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
					 var _msg = "In this example, we'll draw some primitive figures through the Terminal console" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 6.0, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 200 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );
				
	_demon.add( { post_fn : function() { circles_lib_plugin_load('forms','terminal',YES,0,YES); circles_lib_plugin_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'RIGHT', '' ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the Terminal console" } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "config set errors no" ); _glob_terminal.exec( "config set warnings no" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
					 var _msg = "We set auto refresh on, so to draw primitives soon after they have been input" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 3.0, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 150 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "auto refresh on" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

	_demon.add( { pre_fn : function()
                  {
					 var _msg = "We can draw a circle<br>(not to be confused with the 'disk' related to Mobius maps)" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 1.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 150 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "circle zplane (0,0) radius:0.5 drawcolor:blue fillcolor:transparent rec" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

	_demon.add( { pre_fn : function()
                  {
					 var _msg = "We can plot some points" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 1.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 150 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "point (-1,0) (-0.5,0) (0,0) (0.5,0) (1,0) radius:5 drawcolor:black fillcolor:lightgray opacity:0.7 rec" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

	_demon.add( { pre_fn : function()
                  {
					 var _msg = "A line" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 1.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 150 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "line zplane (0,0) (1,1) drawcolor:blue rec" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

	_demon.add( { pre_fn : function()
                  {
					 var _msg = "A broken line (i.e., including input multiple points)" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 1.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 150 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "line zplane (0,0) (-0.7,-0.5) (1,-1) drawcolor:red rec" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

	_demon.add( { pre_fn : function()
                  {
					 var _msg = "A broken and closed line" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 1.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 150 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "line zplane (-1,1) (-1.7,-1.5) (2,-2) (0.5,1.2) close drawcolor:lime rec" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "line zplane (-2,0.2) (-0.5,0.2) (-1.25,1) close thickness:7 drawcolor:orange $triangle fillcolor:yellow rec" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

	_demon.add( { pre_fn : function()
                  {
					 var _msg = "We can shift each of<br>the previous primitive objects" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 1.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 150 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "figures shift @5 (1,1)" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "figures shift @10 (1,-1)" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

	_demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

	_demon.add( { pre_fn : function()
                  {
					 var _msg = "... or update their properties" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 1.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 150 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "figures update @5 drawcolor:pink fillcolor:red" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "figures update @10 drawcolor:yellow fillcolor:orange" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

	_demon.add( { pre_fn : function()
                  {
					 var _msg = "All figure cmds include the param 'rec'\nto save the objects and plot them again at the next display refresh" ;
                     $( "#presentation_div" ).css( "background-color", "#68d77b" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 6.0, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 150 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

	_demon.add( { pre_fn : function()
                  {
                    $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                    var _html = "END OF DEMO #<?php echo $DEMO_IDX ; ?><br>Thanks for watching !" ;
                        _html += "<br><br><SPAN STYLE=\"font-size:11pt;\">To watch other demos" ;
                        _html += "<br>Open men&uacute; '?'" ;
                    $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "show", set_value : { to_x : "center", to_y : "center" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.run();
</SCRIPT>        