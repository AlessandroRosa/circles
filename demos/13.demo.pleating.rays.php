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
                     $( "#presentation_div" ).html( "CIRCLES DEMO #<?php echo $GLOBALS["DEMO_IDX"]; ?><br/>Displaying the pleating rays<br/>for Maskit embedding T1,1" ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "fadein", set_value : { to_x : "center", to_y : "center", speed : "slow" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 1, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "I'm opening the Terminal Console." ) ;
                  },
                  ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "move", set_value : { to_x : $(window).width() - 410, to_y : 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { circles_lib_plugin_load('forms','terminal',YES,0,YES); circles_lib_plugin_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'RIGHT', '' ); }
                }
              );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms discreteness.locus" ); _glob_terminal.exec( "plugin open" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "console resize 450 450" ); _glob_terminal.exec( "console bottom right" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#49D10F" ) ;
                     var _html = "Now I'll compute the discreteness locus,<br>" ;
                         _html += "without pleating rays" ;
                     $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 4, time_unit : "s",
                  action : "move", set_value : { to_x : $(window).width() - 410, to_y : 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).fadeIn( "fast" ) ; }
                } );

    _demon.add( { ctrl_id : "CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO", time : 2.0, time_unit : "s",
                  action : "select", set_text : "Maskit T1,1", showlabel : true, desclabel : "Select the embedding Maskit T1,1" } );

    _demon.add( { ctrl_id : "presentation_div", time : 1.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "CIRCLESformsDISCRETENESSLOCUSrenderBTN", time : 7.0, time_unit : "s",
                  action : "click", set_text : null, showlabel : true, desclabel : "Render a &lsquo;bare&rsquo; version of the discreteness locus\nfor the embedding Maskit T1,1" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms terminal" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 1, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send focus" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms discreteness.locus" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 1.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send focus" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send tab tunings" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#49D10F" ) ;
                     var _html = "Now I'll compute the discreteness locus,<br>" ;
                         _html += "with POSITIVE pleating rays" ;
                     $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 4, time_unit : "s",
                  action : "move", set_value : { to_x : $(window).width() - 410, to_y : 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).fadeIn( "fast" ) ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 1, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

	_demon.add( { ctrl_id : "CIRCLESformsDISCRETENESSLOCUSpleatingraysCHECKBOX", time : 3.0, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Set this flag on to include the pleating rays into the next locus rendering"
                } );

    _demon.add( { ctrl_id : "CIRCLESformsDISCRETENESSLOCUSpleatingrayspositiveCHECKBOX", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Choose to display positive rays only"
                } );

    _demon.add( { ctrl_id : "CIRCLESformsDISCRETENESSLOCUSrenderBTN", time : 60.0, time_unit : "s",
                  action : "click", set_text : null, showlabel : true, desclabel : "... there we go again !" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send tab tunings" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "CIRCLESformsDISCRETENESSLOCUScoloringCHECKBOX", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Add colors to the next rendering"
                } );

    _demon.add( { ctrl_id : "CIRCLESformsDISCRETENESSLOCUSrenderBTN", time : 60.0, time_unit : "s",
                  action : "click", set_text : null, showlabel : true, desclabel : "... enjoy the colors!" } );

	_demon.add( { pre_fn : function()
                  {
                    $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                    var _html = "END OF DEMO #<?php echo $DEMO_IDX ; ?><br>Patience will lead you everywhere" ;
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