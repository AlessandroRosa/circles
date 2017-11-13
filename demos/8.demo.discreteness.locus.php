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
                     $( "#presentation_div" ).html( "CIRCLES DEMO #<?php echo $GLOBALS["DEMO_IDX"]; ?><br/>Working with the discreteness locus<br/>for Maskit embedding T1,1" ) ;
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
                     $( "#presentation_div" ).html( "I'm opening the Terminal Console.<br/>I will input settings for the group configuration to be rendered" ) ;
                  },
                  ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "MENU_MAIN_EXTRAS", time : 2.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { circles_lib_plugin_load('forms','terminal',YES,0,YES); circles_lib_plugin_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'RIGHT', '' ); }
                }
              );

    _demon.add( { ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { _glob_terminal.exec( "new silent" ); }
                } );

    _demon.add( { ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { _glob_terminal.exec( "depth 18" ); }
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "Open the Triggers form to boost up the rendering" ) ;
                  },
                  post_fn : function() { _glob_terminal.exec( "plugin set forms triggers" ); _glob_terminal.exec( "plugin open" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "CIRCLESformsTRIGGERScheckbox1", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Boosting up the commutator option",
                  post_fn : function(){ _glob_triggers_table['gens_set_01'][4] = 1 ; }
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 1.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

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
                         _html += "pick up a value from its boundary and<br>" ;
                         _html += "put it as parameter into the Maskit embedding T1,1 mask" ;
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
                  action : "click", set_text : null, showlabel : true, desclabel : "Render the discreteness locus\nfor the embedding Maskit T1,1" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms terminal" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 1, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send focus" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set embeddings maskit.once" ); _glob_terminal.exec( "plugin open" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send move right top" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms triggers" ); _glob_terminal.exec( "plugin send close" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 1.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms discreteness.locus" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 1.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send focus" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send get.point 0.09+1.85i" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 3.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : true, desclabel : "The parameter is displayed over\nthe diagram and input into the plug-in mask." } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send close" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set embeddings maskit.once" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

	_demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send focus" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send move left top" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : true, desclabel : "This value was brought from the<br>discreteness locus mask" } );

    _demon.add( { pre_fn : function()
                  {
                    $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                    var _html = "When this value was picked from the discreteness locus mask," ;
                        _html += "<br>it was also copied into the currently available plug-in (MASKIT T1,1)" ;
                        _html += "<br>for further initialization" ;
                    $( "#presentation_div" ).html( _html ) ;
                  },
                  ctrl_id : "presentation_div", time : 7, time_unit : "s",
                  action : "show", set_value : { to_x : "left", to_y : $(window).height() - 150 }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "PLUGINinitBTN", time : 2.0, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Push 'Init' for group initialization" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms terminal" ); _glob_terminal.exec( "plugin send close" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 1.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms discreteness.locus" ); _glob_terminal.exec( "plugin send close" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 1.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "PLUGINrenderBTN", time : 2.0, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Push 'Render' for displaying the limit set" } );

    _demon.add( { ctrl_id : "alertYESbtn", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : true, desclabel : "Let's render it !" } );

    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                    $( "#presentation_div" ).css( "background-color", "#538BB4" ) ;
                    var _html = "END OF DEMO #<?php echo $DEMO_IDX ; ?><br>Wishes of a peaceful day !" ;
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