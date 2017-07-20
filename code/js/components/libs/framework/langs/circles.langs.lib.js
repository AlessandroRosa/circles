function circles_lib_lang_init()
{
    // buttons
    var _btns_array = [];
        _btns_array.push( "SRCcleanviewBTN@@@" + _CANVAS_CLEANVIEW_BTN_LABEL );
    var _btn_length = safe_size( _btns_array, 0 ), ENTRYarray, CTRLID, CTRLID, CTRL_TEXT, startINDEX ;
    for( var i = 0 ; i < _btn_length ; i++ )
    {
       ENTRYarray = _btns_array[i].split( "@@@" );
       startINDEX = 0 ;
       CTRLID = ENTRYarray[startINDEX] ;
       startINDEX++ ;
       CTRL_TEXT = ENTRYarray[startINDEX] ;
       $("#"+CTRLID ).val( CTRL_TEXT );
    }
   
    // labels
    var _labels_array = [];
        _labels_array.push( "LANGUAGElabel@@@" + _CANVAS_LANG_LABEL );
    var _labels_length = safe_size( _labels_array, 0 ), startINDEX;
    for( i = 0 ; i < _labels_length ; i++ )
    {
       ENTRYarray = _labels_array[i].split( "@@@" );
       startINDEX = 0 ;
       CTRLID = ENTRYarray[startINDEX] ;
       startINDEX++ ;
       CTRL_TEXT = ENTRYarray[startINDEX] ;
       $("#"+CTRLID ).html( CTRL_TEXT );
    }
}