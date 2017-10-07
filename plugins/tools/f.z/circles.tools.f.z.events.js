function CIRCLEStoolsFZeventsHANDLER( _event, _ctrl_id )
{
	  if ( _event.stopPropagation )      _event.stopPropagation();
	  if ( _event.cancelBubble != null ) _event.cancelBubble = true;

  	var _alt_pressed = _event.altKey ;
    var _del_pressed = _event.keyCode == 8 ? YES : NO ;
    var _canc_pressed = _event.keyCode == 46 ? YES : NO ;
	  var _ctrl_pressed = _event.ctrlKey ;
    var _esc_pressed = _event.keyCode == 27 ? YES : NO ;
		var _shift_pressed = _event.shiftKey ;
    var _return_pressed = _event.keyCode == 13 ? YES : NO ;

		switch( _ctrl_id )
		{
				case "CIRCLEStoolsFZformulaEDIT":
        switch( safe_string( _event.type, "" ).toLowerCase() )
        {
            case "focus":
            if ( is_array( _glob_persistent_vars['f.z.memo'] ) )
            {
                var _n = safe_size( _glob_persistent_vars['f.z.memo'], 0 );
                if ( _n > 0 )
                {
                    var _h = Math.min( _n * 20 + 20, 80 ) ;
                
                    var _pos = $( "#CIRCLEStoolsFZformulaEDIT" ).offset();
                    var HTMLcode = "<table WIDTH=\"100%\"><tr><td VALIGN=\"top\"><DIV STYLE=\"position:relative;width:100%;height:"+_h+"px;overflow:auto;cursor:pointer;\"><table WIDTH=\"100%\">" ;
                    $.each( _glob_persistent_vars['f.z.memo'], function( _i, _expr )
                            {
                                HTMLcode += "<tr><td WIDTH=\"1\"></td><td ID=\"CIRCLEStoolsFZsuggestion_"+_i+"\" STYLE=\"padding:4px;\" data-expr=\""+_expr+"\" ONCLICK=\"javascript:$('#CIRCLEStoolsFZformulaEDIT').val( $('#'+this.id).data('expr') );\" ONMOUSEOUT=\"javascript:this.style.backgroundColor='white';\" ONMOUSEOVER=\"javascript:this.style.backgroundColor='#E6EBF8';\">"+_expr+"</td></tr>" ;
                            }
                          ) ;
                    HTMLcode += "</table></DIV></td></tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>";
                    HTMLcode += "<tr><td><table><tr>" ;
                    HTMLcode += "<td WIDTH=\"5\"></td>" ;
                    HTMLcode += "<td STYLE=\"color:"+COLOR_INFO+";\">Found "+_n+" entr"+(_n==1?"y":"ies")+"</td>" ;
                    HTMLcode += "<td WIDTH=\"25\"></td>" ;
                    HTMLcode += "<td ALIGN=\"right\" ONCLICK=\"javascript:$('#popup_floating_box').hide();\" ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\">Close</td>";
                    HTMLcode += "</tr></table></td></tr>" ;
                    HTMLcode += "</table>" ;
                    $( "#popup_floating_box" ).html( HTMLcode );
                    $( "#popup_floating_box" ).css( "top", _pos.top + $( "#CIRCLEStoolsFZformulaEDIT" ).height() + 7 );
                    $( "#popup_floating_box" ).css( "left", _pos.left );
                    $( "#popup_floating_box" ).height( _h + 20 ) ;
                    $( "#popup_floating_box" ).width( $( "#CIRCLEStoolsFZformulaEDIT" ).width() ) ;
                    $( "#popup_floating_box" ).css( "z-index", 40 );
                    $( "#popup_floating_box" ).show();
                }
            }
            break ;
            case "keyup":
    				if ( _return_pressed ) CIRCLEStoolsFZapply() ;
            break ;
        }
				break ;
        default: break ;
		}
}