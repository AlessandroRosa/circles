function is_canvas_supported() { return !!window.HTMLCanvasElement; } // yes, it runs this way !
function is_html_image( _obj ) { return _obj instanceof HTMLImageElement; }
function is_html_canvas( _obj )  { return _obj instanceof HTMLCanvasElement; }
function is_html_context( _obj ) { return _obj instanceof CanvasRenderingContext2D; }

function CELLgetCONTENTS( IDBTN )            { return $( "#"+IDBTN ).html() ; }
function CELLgetCLR( IDBTN )                 { return $( "#"+IDBTN ).css( "color" ) ; }

function CELLsetCLR( IDBTN, _color )
{
    var _wildcard_flag = IDBTN.one_in( "[", "]" ) ;
    var _selector = _wildcard_flag ? IDBTN : "#" + IDBTN ;
    $( _selector ).css( "color", _color ) ;
}

function CELLsetCONTENTS( IDBTN, _contents )
{
    var _type = $( "#"+IDBTN ).prop( 'type' ) ;
    if ( _type == "text" ) $( "#"+IDBTN ).val( _contents ) ;
    else $( "#"+IDBTN ).html( _contents ) ;
}

function TABINDEXorderSET()
{
    var _i = 0, _args_n = arguments.length ;
    if ( _args_n > 0 )
    {
       for( var _t = 0 ; _t < _args_n ; _t++ )
       {
          if ( arguments[_t].start_with( "#" ) ) arguments[_t] = arguments[_t].right( arguments[_t].length - 1 ) ;
          if ( $( "#" + arguments[_t] ).get(0) != null )
          {
             $( "#" + arguments[_t] ).attr('tabindex',_i+1) ;
             _i++ ;
          }
       }
    }
}