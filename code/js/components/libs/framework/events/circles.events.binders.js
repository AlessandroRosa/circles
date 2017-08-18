function circles_lib_events_get_mouse_pos_abs( event ) { return { x: event.clientX, y: event.clientY }; }
function circles_lib_events_get_mouse_pos_rel( canvas, event )
{
    if ( is_html_canvas( canvas ) ) _glob_canvas_bounding_rect = canvas.getBoundingClientRect();
    return { x: safe_int( event.clientX - _glob_canvas_bounding_rect.left, 0 ),
             y: safe_int( event.clientY - _glob_canvas_bounding_rect.top, 0 ) };
}

function circles_lib_events_mouse_on_document_body( _event, _param_01, _param2 ) // user click on the body
{
    //var _body_obj_ref = _param_01 ;
		switch( _event.type.toLowerCase() )
		{
			 case "click":
       if ( event != null )
       {
         var target = event.target || event.srcElement ;
         if ( !_glob_wnd_onclick_event_halt || ( !is_html_image( target ) && !target.constructor == HTMLAnchorElement ) ) // prevent unselection when users shifts canvas
         _glob_wnd_onkeyup_event_halt = NO ;
       }
			 break ;
			 case "dblclick":
       circles_lib_items_unselect( NO,YES );
			 break ;
       default: break ;
		}
}

function circles_lib_events_bind_to_document_body()
{
    document.body.onkeydown = function( event ) { circles_lib_events_body_keydown(event,document.body,0); }
    document.body.onkeyup = function( event )    { circles_lib_events_body_keyup(event,document.body,0); }
    document.body.onclick = function( event )    { circles_lib_events_mouse_on_document_body(event,document.body,0); }
    document.body.ondblclick = function( event ) { circles_lib_events_mouse_on_document_body(event,document.body,0); }
}

function circles_lib_events_bind_to_zplane( canvas )
{
    if ( is_html_canvas( canvas ) )
    {
         canvas.onselectstart = function () { return false; }
         canvas.onmousedown = function( event )
         {
							if ( event.type.toLowerCase() == "click" )
							{   // prevent both event bubbling or propagation
								  if (event.stopPropagation)    event.stopPropagation();
								  if (event.cancelBubble!=null) event.cancelBubble = true;
							}
              if ( _glob_play_inversion == NO )
              {
                  //if ( _glob_src_canvas_mode == ZPLANE_CANVAS_CIRCLESDRAW_MODE )
                  Z_PLANE_work_layer_onmousedown( this, event );
              }
         }

         canvas.onmousemove = function( event )
         {
              if ( !is_html_canvas( _glob_zplane_rendering_canvas_placeholder ) )
              _glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}

              if ( _glob_play_inversion == NO )
              {
                  if ( _glob_src_canvas_mode == ZPLANE_CANVAS_CIRCLESDRAW_MODE )
                  Z_PLANE_work_canvas_onmousemove( this, event );
              }
              else Z_PLANE_rendering_layer_canvas_play_inversion_onmousemove( canvas, event );
         }
         
         canvas.onclick = function( event )
         {
							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}

              if ( _glob_play_inversion == NO )
              {
                  if ( _glob_src_canvas_mode == ZPLANE_CANVAS_CIRCLESDRAW_MODE )
                  Z_PLANE_work_canvas_onclick( this, event );
              }
         }

         canvas.onmouseup = function( event )
         {
              if ( !is_html_canvas( _glob_zplane_rendering_canvas_placeholder ) )
              _glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}
              
              if ( _glob_play_inversion == NO )
              {
                  if ( _glob_src_canvas_mode == ZPLANE_CANVAS_CIRCLESDRAW_MODE )
                  Z_PLANE_work_canvas_onmouseup( this, event );
              }

              _glob_zplaneMOUSEleftBTNstatus = OFF ;
         }

         canvas.ondblclick = function( event )
         {
              if ( !is_html_canvas( _glob_zplane_rendering_canvas_placeholder ) )
              _glob_zplane_rendering_canvas_placeholder = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );

							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}

              Z_PLANE_work_canvas_ondblclick( this, event );
         }

         canvas.onmouseover = function( event )
         {
							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}

              Z_PLANE_work_canvas_onmouseover( this, event );
         }

         canvas.onmouseout = function( event )
         {
							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}

              if ( _glob_play_inversion == NO )
              {
                  if ( _glob_src_canvas_mode == ZPLANE_CANVAS_CIRCLESDRAW_MODE )
                  Z_PLANE_work_canvas_onmouseout( this, event );
              }
              
							_glob_zplaneMOUSEleftBTNstatus = OFF ;
              circles_lib_canvas_zplane_stop_timer();
         }
    }
    else return [ RET_ERROR, "Missing Z-plane layer to bind" ] ;
}

function circles_lib_events_bind_to_wplane( canvas )
{
    if ( is_html_canvas( canvas ) )
    {
         canvas.onselectstart = function () { return false; }
         canvas.onmousedown = function( event )
         {
						if ( event.type.toLowerCase() == "click" )
						{ // prevent both event bubbling or propagation
						  if (event.stopPropagation)    event.stopPropagation();
							if (event.cancelBubble!=null) event.cancelBubble = true;
						}

            _glob_canvas_obj_ref = canvas ;
            W_PLANE_work_canvas_onmousedown( this, event );
         }

         canvas.onclick = function( event )
         {
							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}

              _glob_canvas_obj_ref = canvas ;
              W_PLANE_work_canvas_onclick( this, event );
         }

         canvas.onmousemove = function( event )
         {
							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}

              _glob_canvas_obj_ref = canvas ;
              W_PLANE_work_canvas_onmousemove( this, event );
         }

         canvas.onmouseover = function( event )
         {
							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}

              W_PLANE_work_canvas_onmouseover( this, event );
         }

         canvas.onmouseup = function( event )
         {
							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}

              W_PLANE_work_canvas_onmouseup( this, event );
         }

         canvas.onmouseout = function( event )
         {
							if ( event.type.toLowerCase() == "click" )
							{ // prevent both event bubbling or propagation
								if (event.stopPropagation)    event.stopPropagation();
								if (event.cancelBubble!=null) event.cancelBubble = true;
							}

              W_PLANE_work_canvas_onmouseout( this, event );
              circles_lib_canvas_wplane_stop_timer();
         }
    }
    else return [ RET_ERROR, "Missing W-plane layer to bind" ] ;
}