function circles_lib_extras_htmlctrl_enable( _ctrl_id, _b_enabled )
{
		$('#'+_ctrl_id).prop( "disabled", _b_enabled ? false : true );
		$('#'+_ctrl_id).css( "background-color", _b_enabled ? DEFAULT_EDIT_BKCOLOR_ENABLED : DEFAULT_EDIT_BKCOLOR_DISABLED );
		$('#'+_ctrl_id).css( "color", _b_enabled ? DEFAULT_EDIT_COLOR_ENABLED : DEFAULT_EDIT_COLOR_DISABLED );
}

function circles_lib_extras_button_enable( _ctrl_id, _checkvar, _focus )
{
    _checkvar = safe_int( _checkvar, 0 );
    if ( $("#"+_ctrl_id ).get(0) != null )
    {
       _ctrl.disabled = !_checkvar ;
       if ( _checkvar && _focus ) _ctrl.focus();
    }
}

function circles_lib_extras_canvas_dropdown_get_placeholder( _ctrl_id )
{
    var _dropdown_id = "CIRCLESchoose"+_ctrl_id.replace( /[\.\_\-]/g, "" ).toUpperCase()+"canvasDROPDOWN" ;
    if ( $( "#"+_dropdown_id ).get(0) != null )
    {
       var _canvas_id = $( "#"+_dropdown_id + " option:selected" ).val() ;
       return $( "#"+_canvas_id ).get(0) != null ? $( "#"+_canvas_id ).get(0) : null ;
    }
    else return null ;
}

function circles_lib_extras_canvas_dropdown( _ctrl_id )
{
		_glob_available_curr_canvas_array = [] ;
    var _dropdown_code = "", _ctx ;
    //scan the framework for currently available canvases
    $( "[id$=CANVAS]" ).each( function( _i, _canvas_obj )
  	{
 			_ctx = _canvas_obj.getContext( _glob_canvas_ctx_2D_mode ) ;
 			_glob_available_curr_canvas_array[ _canvas_obj.id ] = [ _canvas_obj.id, _canvas_obj.complex_rect, _ctx.label, _ctx.plane_def ] ;
    } );
    
    var _keys = _glob_available_curr_canvas_array.keys_associative(), _cnv_entry ;
    if ( is_consistent_array( _keys ) )
    {
			_dropdown_code = "<SELECT ID=\"CIRCLESchoose"+_ctrl_id.replace( /[\.\_\-]/g, "" ).toUpperCase()+"canvasDROPDOWN\">" ;
			_dropdown_code += "<OPTION VALUE=\"\" SELECTED=\"selected\">" ;
			_keys.work( function( _k )
			{
				if ( _glob_available_curr_canvas_array[_k] != null )
				{
					_cnv_entry = _glob_available_curr_canvas_array[_k] ;
          if ( _cnv_entry[0].trim().length > 0 ) _dropdown_code += "<OPTION VALUE=\""+_cnv_entry[0]+"\">"+_cnv_entry[2] ;
				}
			} ) ;
  		_dropdown_code += "</SELECT>" ;
		}
		
		return _dropdown_code ;
}