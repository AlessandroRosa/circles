<link rel="stylesheet" type="text/css" href="http://alessandrorosa.altervista.org/demo_n/demo_n.css">
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="http://alessandrorosa.altervista.org/demo_n/demo_n.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" defer>
var _demon = new demo_n();
    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "<div ID=\"presentation_div\" CLASS=\"general_rounded_corners\" STYLE=\"position:absolute;z-index:5;font-size:14pt;font-family:arial;width:340px;height:50px;text-align:center;color:white;\"></div>" ).appendTo("body");
                     $( "#presentation_div" ).css( "background-color", "#9AD2FB" ) ;
                     $( "#presentation_div" ).html( "CIRCLES DEMO #8<br>The discreteness locus for Maskit T1,1" ) ;
                     $( "#presentation_div" ).show() ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "move", set_value : { to_x : "center", to_y : "center" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "hide", set_value : null, showlabel : false, desclabel : ""
                } );

    _demon.add( { post_fn : function() { circles_lib_popup_load('forms','terminal',YES,0,YES); circles_lib_popup_move_wnd( 'CIRCLESformsTERMINALpopupWND1', 'RIGHT', '' ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the Terminal console" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "new silent" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms discreteness.locus" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin open forms discreteness.locus move left top" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "console resize 450 450" ); _glob_terminal.exec( "console bottom right" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { ctrl_id : "CIRCLESformsDISCRETENESSLOCUSembeddingCOMBO", time : 2.0, time_unit : "s",
                  action : "select", set_text : "Maskit T1,1", showlabel : true, desclabel : "Select the embedding Maskit T1,1" } );

    _demon.add( { ctrl_id : "CIRCLESformsDISCRETENESSLOCUSrenderBTN", time : 7.0, time_unit : "s",
                  action : "click", set_text : null, showlabel : true, desclabel : "Render the embedding Maskit T1,1" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms terminal" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send focus" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set embeddings maskit.once" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin open" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set forms discreteness.locus" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send focus" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send get.point 1+1.73i" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin set embeddings maskit.once" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { post_fn : function() { _glob_terminal.exec( "plugin send focus" ); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 2.0, time_unit : "s",
                  action : "nothing", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.run();
</SCRIPT>