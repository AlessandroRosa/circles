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
                     $( "#presentation_div" ).html( "CIRCLES DEMO #<?php echo $GLOBALS["DEMO_IDX"]; ?><br>How to build a Fuchsian group<br>through the Terminal console" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadein", set_value : { to_x : "center", to_y : "center", speed : "slow" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
					 var _msg = "In this example, we'll build a 2-generators Fuchsian group by constructing the pairs of disks" ;
						 _msg += "\nGroups are Fuchsian when their limit set is a circle." ;
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

    _demon.add( { pre_fn : function()
                  {
					 var _msg = "We input the basic settings to tell that we need to work with inversion method." ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 3.0, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 200 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "method inversion" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "depth 6" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
					 var _msg = "We show each symbol per disk" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 3.0, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 200 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "symbol show" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "config set drawentity isometric" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
					 var _msg = "'Autorefresh' option will let each disk be drawn immediately, after the terminal input" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 3.0, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 200 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "auto refresh zplane on" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

	_demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
					 var _msg = "Now we draw the first pair of inversion disks, labelled as 'a' and 'A'" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 3.0, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 200 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );
				
	_demon.add( { post_fn : function() { _glob_terminal.exec( "disk add a center:0.7,0.7 radius:0.7 drawcolor:blue" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "disk add b center:-0.7,-0.7 radius:0.7 drawcolor:blue" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
					 var _msg = "And this is the second pair of inversion disks, labelled as 'b' and 'B'" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 3.0, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 200 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );
				
    _demon.add( { post_fn : function() { _glob_terminal.exec( "disk add c center:-0.7,0.7 radius:0.7 drawcolor:red" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "disk add d center:0.7,-0.7 radius:0.7 drawcolor:red" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "render wplane silent clean" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "close silent" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

	_demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
					 var _msg = "And now more fun !" ;
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( _msg ) ;
                  },
                  ctrl_id : "presentation_div", time : 3.0, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 200 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );
				
	_demon.add( { post_fn : function() { circles_lib_plugin_load('forms','terminal',YES,0,YES); circles_lib_plugin_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'RIGHT', '' ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the Terminal console" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "disk add e center:0,0 radius:0.3 drawcolor:lime" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "render wplane silent clean" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "close silent" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

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