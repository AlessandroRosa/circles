function getMouseXY( e )
{
     tempX = isIE() ? event.clientX + document.body.scrollLeft : e.pageX ;
     tempY = isIE() ? event.clientY + document.body.scrollTop : e.pageY ;
     return [ tempX, tempY ];
}