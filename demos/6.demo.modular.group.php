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
                     $( "#presentation_div" ).html( "CIRCLES DEMO #6<br>Modular group" ) ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadein", set_value : { to_x : "center", to_y : "center", speed : "slow" }, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "hide", set_value : null, showlabel : false, desclabel : ""
                } );

    _demon.add( { post_fn : function() { circles_lib_plugin_load('embeddings','general.purpose',YES,0,YES); },
                  ctrl_id : "MENU_MAIN_EXTRAS", time : 3, time_unit : "s",
                  action : "click", set_value : -1, showlabel : true, desclabel : "Opening the General Purpose mask" } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_A", time : 1, time_unit : "s",
                  action : "keypress", set_value : "1", showlabel : true, desclabel : "Setting param A for 1st generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_B", time : 1, time_unit : "s",
                  action : "keypress", set_value : "0", showlabel : true, desclabel : "Setting param B for 1st generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_C", time : 1, time_unit : "s",
                  action : "keypress", set_value : "-2", showlabel : true, desclabel : "Setting param C for 1st generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_D", time : 1, time_unit : "s",
                  action : "keypress", set_value : "1", showlabel : true, desclabel : "Setting param D for 1st generator" } );
    _demon.add( { ctrl_id : "CIRCLESembeddingsGENERALPURPOSE_ADD_BTN", time : 1, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Insert the 1st generator" } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_A", time : 1, time_unit : "s",
                  action : "keypress", set_value : "1", showlabel : true, desclabel : "Setting param A for 2nd generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_B", time : 1, time_unit : "s",
                  action : "keypress", set_value : "2", showlabel : true, desclabel : "Setting param B for 2nd generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_C", time : 1, time_unit : "s",
                  action : "keypress", set_value : "0", showlabel : true, desclabel : "Setting param C for 2nd generator" } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_D", time : 1, time_unit : "s",
                  action : "keypress", set_value : "1", showlabel : true, desclabel : "Setting param D for 2nd generator" } );
    _demon.add( { ctrl_id : "CIRCLESembeddingsGENERALPURPOSE_ADD_BTN", time : 2, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Insert the 2nd generator" } );

    _demon.add( { ctrl_id : "PLUGIN_GENERATE_GROUP_BTN", time : 2, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Generate the 2-generators group" } );

    _demon.add( { ctrl_id : "MENU_ENTITY_ISOMETRIC_CIRCLE", time : 2, time_unit : "s",
                  action : "click", set_value : "1", showlabel : true, desclabel : "Draw entity is 'Isometric Circle'" } );

    _demon.add( { ctrl_id : "STATUSBARrenderBTN", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "Rendering ... go !" } );

    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, showlabel : false, desclabel : "" } );

    _demon.add( { pre_fn : function() { $( "#presentation_div" ).html( "END OF DEMO #6" ) ; },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "show", set_value : null, showlabel : false, desclabel : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "fadeout", set_value : "fast", showlabel : false, desclabel : ""
                } );
    _demon.run();
</SCRIPT>