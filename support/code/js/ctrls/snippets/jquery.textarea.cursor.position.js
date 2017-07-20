function getCursorXY( _ctrl_id )
{  
    var col = 0, row = 0, _index = 0;
 
    for( index=0;
         ( index = $('#'+_ctrl_id).val().indexOf("\n", index)) != -1 && index <  $('#'+_ctrl_id)[0].selectionStart ;
         index++, row++, _index = index
       );
 
    col = $('#'+_ctrl_id)[0].selectionStart - _index;

    return [ col, row ] ;
}