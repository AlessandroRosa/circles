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
                     $( "#presentation_div" ).html( "CIRCLES DEMO #<?php echo $GLOBALS["DEMO_IDX"]; ?><br>Building a Random IFS" ) ;
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
                     $( "#presentation_div" ).html( "We're are going to explain<br/>how to build a Random IFS<br>step by step, without triggers" ) ;
                  },
                  ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "plugin_maskitonce", time : 1.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Calling the 'Maskit T1,1 embedding' form",
                  post_fn : function()
                  {
                    circles_lib_plugin_load('embeddings','maskit.once','1','0','1');
                    circles_lib_menu_entries_update();
                  } } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 1.5, time_unit : "s",
                  action : "focus", set_value : "", showlabel : true, desclabel : "Focus on the parameter box" } );

    var _str = "1.95i-0.02" ;
    for( var _i = 0 ; _i < _str.length ; _i++ )
    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 130, time_unit : "ms",
                  action : "keypress", set_value : _str[_i], showlabel : true, desclabel : "Writing down the parameter for the group"
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
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the Terminal console" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set embeddings maskit.once" ); _glob_terminal.exec( "plugin close" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     $( "#presentation_div" ).html( "Current method has been already set to 'Algebraic'<br>Now set the process to 'random'" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2.5, time_unit : "s",
                  action : "move", set_value : { to_x : 40, to_y : $(window).height() - 100 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "process random" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "depth 20" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.2, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "presentation_div", time : 0.5, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     var _code = "Now open the 'Method' plug-in<br>" ;
                     $( "#presentation_div" ).html( _code ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : 30, to_y : $(window).height() - 110 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms method" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin open generators" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     var _code = "Select the preset configuration<br>for random IFS,<br>adding commutators to original generators" ;
                     $( "#presentation_div" ).html( _code ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : 30, to_y : $(window).height() - 110 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "ALGEBRAICgeneratorsSKIPconfirmCHECKBOX", time : 1.5, time_unit : "s",
                  action : "check", set_value : -1, showlabel : false, desclabel : "",
                  post_fn : function() { CIRCLESformsMETHODskipconfirm = $("#ALGEBRAICgeneratorsSKIPconfirmCHECKBOX").prop("checked")?1:0; } } );

    _demon.add( { ctrl_id : "ALGEBRAICgenssetPRESETScombo", time : 1.5, time_unit : "s",
                  action : "select", set_value : 1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     var _code = "Now we set the random probability<br>for each generator to be picked up<br>during the process" ;
                     $( "#presentation_div" ).html( _code ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : 30, to_y : $(window).height() - 110 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send switchtab random" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "#presentation_div" ).css( "background-color", "#699ED6" ) ;
                     var _code = "In this demo, we will use a preset distribution" ;
                     $( "#presentation_div" ).html( _code ) ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : 30, to_y : $(window).height() - 110 }, showlabel : false, desclabel : "",
                  post_fn : function() { $( "#presentation_div" ).show() ; }
                } );

    _demon.add( { ctrl_id : "ALGEBRAICrndPRESETScombo", time : 1.5, time_unit : "s",
                  action : "select", set_value : 1, showlabel : false, desclabel : "" } );

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