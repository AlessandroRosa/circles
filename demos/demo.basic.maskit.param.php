<link rel="stylesheet" type="text/css" href="http://alessandrorosa.altervista.org/demo_n/demo_n.css">
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="http://alessandrorosa.altervista.org/demo_n/demo_n.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" defer>
var _demon = new demo_n();
    _demon.add( { ctrl_id : "alertYESbtn", time : 1.5, time_unit : "s",
                  action : "click", set_value : -1, highlight : false, desc_label : "" } );

    _demon.add( { pre_fn : function()
                  {
                     $( "<div ID=\"presentation_div\" CLASS=\"general_rounded_corners\" STYLE=\"position:absolute;z-index:5;font-size:14pt;font-family:arial;width:380px;height:50px;text-align:center;color:white;\"></div>" ).appendTo("body");
                     $( "#presentation_div" ).css( "background-color", "#9AD2FB" ) ;
                     $( "#presentation_div" ).html( "CIRCLES DEMO #1<br>Deterministic IFS example" ) ;
                     $( "#presentation_div" ).show() ;
                  },
                  ctrl_id : "presentation_div", time : 2, time_unit : "s",
                  action : "move", set_value : { to_x : "center", to_y : "center" }, highlight : false, desc_label : ""
                } );

    _demon.add( { ctrl_id : "presentation_div", time : 3, time_unit : "s",
                  action : "hide", set_value : null, highlight : false, desc_label : ""
                } );

    _demon.add( { ctrl_id : "plugin_maskitonce", time : 2, time_unit : "s",
                  action : "click", set_value : -1, highlight : true, desc_label : "Calling the 'Maskit embedding' form",
                  post_fn : function()
                  {
                    circles_lib_popup_load('embeddings','maskit.once','1','0','1');
                    circles_lib_menu_entries_update();
                  } } );
    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 1.5, time_unit : "s",
                  action : "focus", set_value : "", highlight : true, desc_label : "Focus on the parameter box" } );

    var _str = "1.61688i+0.70567" ;
    for( var _i = 0 ; _i < _str.length ; _i++ )
    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 130, time_unit : "ms",
                  action : "keypress", set_value : _str[_i], highlight : true, desc_label : "Writing down the parameter for the group"
                } );
                
    _demon.add( { ctrl_id : "STATUSBARdepthEDIT", time : 1.5, time_unit : "s",
                  action : "keydel", set_value : "", highlight : true, desc_label : "Deleting the old rendering depth"
                } );
    _demon.add( { ctrl_id : "STATUSBARdepthEDIT", time : 1.5, time_unit : "s",
                  action : "keypress", set_value : 10, highlight : true, desc_label : "Set the new rendering depth to 10",
                  post_fn : function()
                  {
                      var press = jQuery.Event("keypress");
                      press.ctrlKey = false;
                      press.altKey = false;
                      press.keyCode = 13 ;
                      press.stopPropagation = false 
                      press.cancelBubble = true ;
                      CIRCLESbarsSTATUSBAReventsKEYCODE( "STATUSBARdepthEDIT", press ) ;
                  }
                } );

    _demon.add( { ctrl_id : "PLUGIN_PARAM_MU", time : 1.5, time_unit : "s",
                  action : "focus", set_value : _str[_i], highlight : true, desc_label : "Group initialization",
                  post_fn : function(){
                        var press = jQuery.Event("keypress");
                        press.ctrlKey = false;
                        press.keyCode = 13;
                        _plugin_step_index = 0;
                        CIRCLESembeddingsMASKITONCE_EVENTS( 'PLUGIN_PARAM_MU', press );
                        _plugin_step_index = 0.1;
                        CIRCLESembeddingsMASKITONCE_EVENTS( 'PLUGIN_PARAM_MU', press );
                        _plugin_step_index = 1.1;
                        CIRCLESembeddingsMASKITONCE_EVENTS( 'PLUGIN_PARAM_MU', press );
                } } );
    _demon.add( { ctrl_id : "alertYESbtn", time : 2, time_unit : "s",
                  action : "click", set_value : -1, highlight : false, desc_label : "" } );

    _demon.run();
</SCRIPT>        