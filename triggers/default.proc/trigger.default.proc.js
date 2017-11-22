/* DEFAULT SETTINGS
   Reset to some default settings in order to render diagrams
 */

function trigger_default_proc( _silent, _output_channel )
{
    _silent = safe_int( _silent, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
    var _sd_n = circles_lib_count_seeds();
    var _b_go = !_silent ? confirm( "Do you want to run this trigger ?" + _glob_crlf + "(All previous settings will be lost)" ) : YES ;
    if ( _b_go )
    {
       // reset to default settings
       circles_lib_reset_vars( RESET_GENERALS | RESET_COORDS | RESET_DICT | RESET_GENS_SET, YES, _output_channel ) ;
       circles_lib_menu_entries_update();
       var _ret_chunk = circles_lib_canvas_render_zplane(null,null,null,YES,YES,YES,NO,YES);
       var _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
       var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "Unknown error" ;
	     if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
	     else
	     {
		       $('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);
		       return [ RET_OK, "Trigger has been run with success !" ] ;
			 }
    }
    else return [ RET_ERROR, "Trigger run has been halted by user" ] ;
}