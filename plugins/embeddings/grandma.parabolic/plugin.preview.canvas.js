function CIRCLESembeddingsGRANDMAPARABOLIC_TOGGLE_PREVIEW()
{
		$( "#PLUGIN_PREVIEW" ).toggle( "slow",
																	 function()
																	 {
																	 		circles_lib_plugin_render_preview( "grandma.parabolic", "embeddings", Z_PLANE );
																	 		var _visible = $( "#PLUGIN_PREVIEW" ).is(":visible") ;
																			$( "#PLUGIN_TOGGLE_PREVIEW_BTN" ).html( _visible ? "Hide preview" : "Show preview" );
																			if ( _visible )
																			{
																					var _plugin_width = $( "#"+GLOB_PLUGIN_DIV_ID ).width() ;
																					var _canvas = $( "#CIRCLESembeddingsGRANDMAPARABOLIC_CANVAS" ).get(0) ;
																					_canvas.set_width( _plugin_width - 5 );
                                          CIRCLESembeddingsGRANDMAPARABOLIC_PRESETS(2,YES);
																			}
																	 } );
}