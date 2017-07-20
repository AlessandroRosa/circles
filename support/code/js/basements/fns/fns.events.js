function getMouseXY( e )
{
    tempX = isIE() ? event.clientX + document.body.scrollLeft : e.pageX ;
    tempY = isIE() ? event.clientY + document.body.scrollTop : e.pageY ;
    return [ tempX, tempY ];
}

function addEventHandler( _obj, _event, _handler )
{
    if( _obj.addEventListener ) _obj.addEventListener(_event, _handler, false); // W3C
    else if( _obj.attachEvent ) _obj.attachEvent('on'+_event, _handler); // IE
    else _obj['on'+_event] = _handler; // otherwise
}

function removeEventHandler()
{

}

function EVENTSstopDISPATCHING( _event )
{
    if ( _event.stopPropagation ) _event.stopPropagation() ;
    if ( _event.cancelBubble ) _event.cancelBubble = true ;
    if ( _event.preventDefault ) event.preventDefault() ;
}