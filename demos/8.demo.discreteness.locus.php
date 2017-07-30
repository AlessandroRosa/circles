<link rel="stylesheet" type="text/css" href="../demo_n/demo_n.css">
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="../demo_n/demo_n.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" defer>
var _demon = new demo_n();
    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "<div ID=\"presentation_div\" CLASS=\"general_rounded_corners\" STYLE=\"position:absolute;z-index:2000;font-size:14pt;font-family:arial;width:340px;height:auto;padding:6px;text-align:center;color:white;\"></div>" ).appendTo("body");
                     $( "#presentation_div" ).css( "background-color", "#9AD2FB" ) ;
                     $( "#presentation_div" ).html( "CIRCLES DEMO #8<br/>Working with the discreteness locus<br/>for Maskit embedding T1,1" ) ;
                     $( "#presentation_div" ).show() ;
                  },
                  ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "move", set_value : { to_x : "center", to_y : "center" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.add( { post_fn : function() { circles_lib_popup_load('forms','terminal',YES,0,YES); circles_lib_popup_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'RIGHT', '' ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the Terminal console" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "new silent" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "depth 18" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms triggers" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin open" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "CIRCLESformsTRIGGERScheckbox1", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Boosting the commutator option",
                  post_fn : function(){ _glob_triggers_table['gens_set_01'][4] = 1 ; }
                } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms discreteness.locus" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin open" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "console resize 450 450" ); _glob_terminal.exec( "console bottom right" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO", time : 2.0, time_unit : "s",
                  action : "select", set_text : "Maskit T1,1", showlabel : true, desclabel : "Select the embedding Maskit T1,1" } );

    _demon.add( { ctrl_id : "CIRCLESformsDISCRETENESSLOCUSrenderBTN", time : 7.0, time_unit : "s",
                  action : "click", set_text : null, showlabel : true, desclabel : "Render the discreteness locus\nfor the embedding Maskit T1,1" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms terminal" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send focus" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set embeddings maskit.once" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin open" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send move right top" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms discreteness.locus" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send focus" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send get.point 0.09+1.85i" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 2.0, time_unit : "s",
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

    _demon.add( { ctrl_id : "PLUGINinitBTN", time : 2.0, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Push 'Init' for group initialization" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms triggers" ); _glob_terminal.exec( "plugin send close" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 1.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms terminal" ); _glob_terminal.exec( "plugin send close" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 1.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms discreteness.locus" ); _glob_terminal.exec( "plugin send close" ); },
                  ctrl_id : "CIRCLESformsTERMINALpopupWND1", time : 1.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "PLUGINrenderBTN", time : 2.0, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Push 'Render' for displaying the limit set" } );

    _demon.add( { ctrl_id : "alertYESbtn", time : 2.5, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : true, desclabel : "Let's render it !" } );

    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function() { $( "#presentation_div" ).html( "END OF DEMO #8" ) ; },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "show", set_value : null, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );

    _demon.run();
</SCRIPT>