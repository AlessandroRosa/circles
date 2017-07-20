function circles_lib_canvas_update_icons_bar( _bar_ctrl_id )
{
    var _bar = $( "#" + _bar_ctrl_id ).get(0), _ctrl ;
    var _disks_icons_id = [
                            [ "drawdisks", _glob_zplaneMOUSEprocSWITCH, MOUSE_DRAWDISKS_PROC_ID, "#F0F0F0", "transparent" ],
                            [ "selectdisks", _glob_zplaneMOUSEprocSWITCH, MOUSE_SELECTDISKS_PROC_ID, "#F0F0F0", "transparent" ]
                          ] ;
    $.each( _disks_icons_id,
            function( _i, _val )
            {
                _ctrl = $( "#" + _bar_ctrl_id + _val[0] ).get(0);
                if ( _ctrl != null ) $( "#" + _bar_ctrl_id + _val[0] ).css( "background-color", ( _val[1] == _val[2] ) ? _val[3] : _val[4] );
            } );
}