function circles_lib_progressbar_div_is_visible() { return ( $( "#PROGRESSbarDIV" ).get(0) != null ) ? ( $( "#PROGRESSbarDIV" ).is( ":visible" ) ? YES : NO ) : NO ; }
function circles_lib_progressbar_div_show_element( _element_id, _show ) { if ( $( "#" + _element_id ).get(0) != null ) _show ? $( "#" + _element_id ).show() : $( "#" + _element_id ).hide(); }
function circles_lib_progressbar_div_write_label( TEXT ) { if ( $( "#PROGRESSbarDIVtext" ).get(0) != null )    { $( "#PROGRESSbarDIVtext" ).html( TEXT ); return YES ; } else return NO ; }
function circles_lib_progressbar_div_append_label( TEXT ) { if ( $( "#PROGRESSbarDIVappend" ).get(0) != null ) { $( "#PROGRESSbarDIVappend" ).html( TEXT ); return YES ; } else return NO ; }
function circles_lib_progressbar_div_step_label( TEXT ) { if ( $( "#PROGRESSbarDIVstep" ).get(0) != null ) { $( "#PROGRESSbarDIVstep" ).html( TEXT ); return YES ; } else return NO ; }
function circles_lib_progressbar_set_value( ctrl_id, v, _force )
{
    _force = safe_int( _force, NO );
		var progressbar = $('#'+ctrl_id);
    if ( progressbar != null )
    {
       if ( v > progressbar.val() || _force )
       {
          addValue = progressbar.val( v );
          $('.progress-value').html( v + "%" );
       }
       return YES ;
    }
    else return NO ;
}

function circles_lib_progressbar_div_show( _show, _move )
{
    _show = safe_int( _show, YES ), _move = safe_int( _move, YES );
    if ( $("#PROGRESSbarDIV").get(0) != null )
    {
       if ( _show ) $("#PROGRESSbarDIV").draggable();
       _show ? $("#PROGRESSbarDIV").show() : $("#PROGRESSbarDIV").hide();
       if ( _show && _move ) move_div( "PROGRESSbarDIV", "center", "bottom" );
       return YES ;
    }
    else return NO ;
}