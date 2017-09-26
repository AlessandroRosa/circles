function CIRCLEStoolsFUNDAMENTALREGIONbindCANVASevents()
{
    var _diagram_canvas = $( "#CIRCLESfundamentalregiondiagramCANVAS" ).get(0);
    if ( is_html_canvas( _diagram_canvas ) )
    {
         _diagram_canvas.onmouseover = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_onmouseover( _diagram_canvas, event ); }
         _diagram_canvas.onmouseout = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_onmouseout( _diagram_canvas, event ); }
         _diagram_canvas.onmouseup = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_onmouseup( _diagram_canvas, event ); }
         _diagram_canvas.onmousedown = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_onmousedown( _diagram_canvas, event ); }
         _diagram_canvas.onmousemove = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_onmousemove( _diagram_canvas, event ); }
         _diagram_canvas.onclick = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_onclick( _diagram_canvas, event ); }
         _diagram_canvas.ondblclick = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_ondblclick( _diagram_canvas, event ); }
    }

    var _work_layer_canvas = $( "#CIRCLESfundamentalregionworklayerCANVAS" ).get(0);
    if ( is_html_canvas( _work_layer_canvas ) )
    {
         _work_layer_canvas.onmouseout = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_onmouseout( _work_layer_canvas, event ); }
         _work_layer_canvas.onmouseup = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_onmouseup( _work_layer_canvas, event ); }
         _work_layer_canvas.onmousedown = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_onmousedown( _work_layer_canvas, event ); }
         _work_layer_canvas.onmousemove = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_onmousemove( _work_layer_canvas, event ); }
         _work_layer_canvas.onmouseover = function( event ) { FUNDAMENTAL_REGION_WORK_canvas_onmouseover( _work_layer_canvas, event ); }
    }
}

function CIRCLEStoolsFUNDAMENTALREGIONlayerCOMBOonchange()
{
		var _entry = $( "#CIRCLEStoolsFUNDAMENTALREGIONlayerCOMBO" ).val();
		if ( _entry.includes( "@" ) && _entry.count( "@" ) == 4 )
		{
				 _entry = _entry.split( "@" );
				 var _startINDEX = 0 ;
				 var _plane_type = safe_int( _entry[_startINDEX], NO_PLANE );
				 		 _startINDEX++ ;
				 var _role = _entry[_startINDEX] ;
				 		 _startINDEX++ ;
				 var _idcanvas = _entry[_startINDEX] ;
				 		 _startINDEX++ ;
				 var _iddiv = _entry[_startINDEX] ;
				 		 _startINDEX++ ;
				 var _label = _entry[_startINDEX] ;
				 
				 if ( _plane_type.is_one_of( Z_PLANE, W_PLANE ) )
				 CIRCLEStoolsFUNDAMENTALREGIONlayerREF = circles_lib_canvas_layer_find( _plane_type, FIND_LAYER_BY_ROLE_INDEX, _role );
				 else _idcanvas = "CIRCLESfundamentalregiondiagramCANVAS" ;
				 
				 if ( is_html_canvas( CIRCLEStoolsFUNDAMENTALREGIONlayerREF ) )
				 {
				 			var _bCOPY = circles_lib_canvas_copy( $( "#" + _idcanvas ).get(0),
							 												 			  $( "#CIRCLEStoolsFUNDAMENTALREGIONthumbCANVAS" ).get(0) );
							
				 }
		}
}

function CIRCLEStoolsFUNDAMENTALREGIONeventsHANDLER( _event, _ctrl_id )
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

    if ( _return_pressed )
    {
         switch( _ctrl_id )
         {
             case "CIRCLEStoolsFUNDAMENTALREGIONcustomADDEDIT":
             var _silent = safe_int( arguments[2], NO );
             CIRCLEStoolsFUNDAMENTALREGIONcustomADD( _silent );
             break ;
             default: break ;
         }
    }
}

function CIRCLEStoolsFUNDAMENTALREGIONitemsCOMBOonchange()
{
		var _OPT = safe_int( $( "#CIRCLEStoolsFUNDAMENTALREGIONitemsCOMBO" ).val(), 0 );
		switch( _OPT )
		{
				case 1: // seeds
				var _alphabet = circles_lib_alphabet_get();
				var _n_seeds = circles_lib_count_seeds();
				var _n_alpha = safe_size( _alphabet, 0 );
				CIRCLEStoolsFUNDAMENTALREGIONwords = [] ;
 			  var HTMLcode = "<table "+( _n_alpha == 0 || _n_seeds == 0 ? "WIDTH=\"100%\"" : "" )+">" ;
			 		  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
				if ( _n_alpha > 0 && _n_seeds > 0 )
				{
				 		 HTMLcode += "<tr><td COLSPAN=\"3\" STYLE=\"font-size:12pt;\">The words list includes "+_n_alpha+" entr"+( _n_alpha == 1 ? "y" : "ies" )+"</td></tr>" ;
				 		 HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
				 		 $.each( _alphabet,
                     function( _i, _seed_word )
                     {
                        CIRCLEStoolsFUNDAMENTALREGIONwords.push( _seed_word );
                        HTMLcode += "<tr><td WIDTH=\"15\" STYLE=\"font-size:12pt;\" ALIGN=\"right\">"+( _i + 1 )+")</td><td WIDTH=\"3\"></td><td STYLE=\"font-size:12pt;\">"+_seed_word+"</td></tr>" ;
           				 		  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
                     }
                   );
				}
				else
				{
				 		 HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
				 		 HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:#C0C0C0;\">The words list<br>is empty</td></tr>" ;
             if ( _n_seeds == 0 )
             {
    				 		 HTMLcode += "<tr><td HEIGHT=\"16\"></td></tr>" ;
    				 		 HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:#C0C0C0;\">No seeds have been<br>registered yet</td></tr>" ;
             }
				 		 HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
				}
	 		  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
	 		  HTMLcode += "</table>" ;
			  $( "#CIRLEStoolsFUNDAMENTALREGIONcontainerBOX1" ).html( HTMLcode );
				break ;
				case 2: // gens
				var _n_gens = circles_lib_gens_model_exists();
				CIRCLEStoolsFUNDAMENTALREGIONwords = [] ;
 			  var HTMLcode = "<table "+( _n_gens == 0 ? "WIDTH=\"100%\"" : "" )+">" ;
			 		  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
				if ( _n_gens > 0 )
				{
						 var _gens_set = circles_lib_gens_model_get();
				 		 HTMLcode += "<tr><td COLSPAN=\"3\" STYLE=\"font-size:12pt;\">The words list includes "+_n_gens+" entr"+( _n_gens == 1 ? "y" : "ies" )+"</td></tr>" ;
				 		 HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
				 		 $.each( _gens_set,
                     function( _i, _gen_word )
                     {
                        CIRCLEStoolsFUNDAMENTALREGIONwords.push( _gen_word );
                        HTMLcode += "<tr><td WIDTH=\"15\" STYLE=\"font-size:12pt;\" ALIGN=\"right\">"+( _i + 1 )+")</td><td WIDTH=\"3\"></td><td STYLE=\"font-size:12pt;\">"+_gen_word+"</td></tr>" ;
           				 		  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
                     }
                   );
				}
				else
				{
				 		 HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
				 		 HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:#C0C0C0;\">The words list is empty then.</td></tr>" ;
				 		 HTMLcode += "<tr><td HEIGHT=\"16\"></td></tr>" ;
				 		 HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:#C0C0C0;\">The gens set includes no elements</td></tr>" ;
				 		 HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
				}
	 		  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
	 		  HTMLcode += "</table>" ;
			  $( "#CIRLEStoolsFUNDAMENTALREGIONcontainerBOX1" ).html( HTMLcode );
				break ;
				case 3: // custom
				var _alphabet = circles_lib_alphabet_get();
				var _n_seeds = circles_lib_count_seeds();
				var _n_alpha = safe_size( _alphabet, 0 );
 			  var HTMLcode = "<table WIDTH=\"100%\">" ;
 			 		  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        if ( _n_alpha > 0 && _n_seeds > 0 )
        {
    				CIRCLEStoolsFUNDAMENTALREGIONwords = [] ;
    			 		  HTMLcode += "<tr>" ;
    			 		  HTMLcode += "<td VALIGN=\"top\">" ;
    			 		  HTMLcode += "<table>" ;
    			 		  HTMLcode += "<tr>" ;
    			 		  HTMLcode += "<td>New word</td><td WIDTH=\"3\"></td>" ;
    			 		  HTMLcode += "<td><INPUT TYPE=\"edit\" ID=\"CIRCLEStoolsFUNDAMENTALREGIONcustomADDEDIT\" STYLE=\"width:80px;\" ONKEYUP=\"javascript:CIRCLEStoolsFUNDAMENTALREGIONeventsHANDLER( event, this.id, YES );\"></td><td WIDTH=\"3\"></td>" ;
                HTMLcode += "<td WIDTH=\"3\"></td>" ;
    			 		  HTMLcode += "<td ONCLICK=\"javascript:CIRCLEStoolsFUNDAMENTALREGIONcustomADD();\" CLASS=\"link_rounded\">Add</td>" ;
                HTMLcode += "<td WIDTH=\"1\"></td>" ;
    			 		  HTMLcode += "<td ONCLICK=\"javascript:CIRCLEStoolsFUNDAMENTALREGIONcustomBOMB(YES,YES,CIRCLEStoolsFUNDAMENTALREGIONcustomLIST);\" CLASS=\"link_rounded\">Bomb</td>" ;
    			 		  HTMLcode += "</tr>" ;
    			 		  HTMLcode += "</table>" ;
    			 		  HTMLcode += "</td>" ;
    			 		  HTMLcode += "</tr>" ;
    			 		  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    			 		  HTMLcode += "<tr><td ID=\"CIRCLEStoolsFUNDAMENTALREGIONcustomCONTAINERLIST\" VALIGN=\"top\"></td></tr>" ;
    			 		  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    			 		  HTMLcode += "</table>" ;
    					  $( "#CIRLEStoolsFUNDAMENTALREGIONcontainerBOX1" ).html( HTMLcode );
    					  
    					  CIRCLEStoolsFUNDAMENTALREGIONcustomLIST();
        }
        else
        {
 				 		 HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:#C0C0C0;\">Can't input custom entries</td></tr>" ;
 				 		 HTMLcode += "<tr><td HEIGHT=\"16\"></td></tr>" ;
 				 		 HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:#C0C0C0;\">No seeds have been<br>registered yet</td></tr>" ;
 				 		 HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
 			 		   HTMLcode += "</table>" ;
    				 $( "#CIRLEStoolsFUNDAMENTALREGIONcontainerBOX1" ).html( HTMLcode );
        }
				break ;
				default:
 			  var HTMLcode = "<table>" ;
			 		  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
			 		  HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"color:#D0D0D0;font-size:12pt;\">Unknown option</td></tr>" ;
			 		  HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
			 		  HTMLcode += "</table>" ;
				break ;
		}
}

function CIRCLEStoolsFUNDAMENTALREGIONprocedureCOMBOonchange()
{
		var _OPT = safe_int( $( "#CIRCLEStoolsFUNDAMENTALREGIONprocedureCOMBO" ).val(), 0 );
		switch( _OPT )
		{
				case CIRCLEStoolsFUNDAMENTALREGION_PROC_STD:
				break ;
				case CIRCLEStoolsFUNDAMENTALREGION_PROC_FORD:
				break ;
				default: break ;
		}
}

function FUNDAMENTAL_REGION_WORK_canvas_onmouseover( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
}

function FUNDAMENTAL_REGION_WORK_canvas_onclick( obj, event )
{
    /*
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
    */
}

function FUNDAMENTAL_REGION_WORK_canvas_ondblclick( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
}

function FUNDAMENTAL_REGION_WORK_canvas_onmousedown( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
}

function FUNDAMENTAL_REGION_WORK_canvas_onmousemove( obj, event )
{
}

function FUNDAMENTAL_REGION_WORK_canvas_onmouseup( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
}

function FUNDAMENTAL_REGION_WORK_canvas_onmouseout( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
}

function FUNDAMENTAL_REGION_WORK_canvas_onmousedown( obj, event )
{
    if ( CIRCLEStoolsFUNDAMENTALREGIONcanvas_mouse_proc_switch == MOUSE_ZOOM_PROC_ID )
    {
       _glob_canvas_obj_ref = obj ;
       _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
       _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
     
       circles_lib_canvas_clean( obj );
       CIRCLEStoolsFUNDAMENTALREGIONmapperINIT( obj.get_width(), obj.get_height(), YES );
    }
}

function FUNDAMENTAL_REGION_WORK_canvas_onmousemove( obj, event )
{
		_glob_canvas_obj_ref = obj ;
    _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
    _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
    if ( CIRCLEStoolsFUNDAMENTALREGIONrect.includes_pt( _glob_mouse_x, _glob_mouse_y ) )
    {
        _mouse_event_curr_pt = CIRCLEStoolsFUNDAMENTALREGIONmapper.from_client_to_cartesian( _glob_mouse_x,
                                                                     _glob_mouse_y - 4 );
        $( "#CIRCLEStoolsFUNDAMENTALREGIONcoordsX" ).html( _mouse_event_curr_pt.x );
        $( "#CIRCLEStoolsFUNDAMENTALREGIONcoordsY" ).html( _mouse_event_curr_pt.y );
    }
}

function FUNDAMENTAL_REGION_WORK_canvas_onmouseover( obj, event ) {}

function FUNDAMENTAL_REGION_WORK_canvas_onmouseup( obj, event )
{
    if ( CIRCLEStoolsFUNDAMENTALREGIONcanvas_mouse_proc_switch == MOUSE_ZOOM_PROC_ID )
    {
    	 _glob_canvas_obj_ref = obj ;
       _glob_coords_array = circles_lib_events_get_mouse_pos_rel( obj, event );
       _glob_mouse_x = _glob_coords_array["x"], _glob_mouse_y = _glob_coords_array["y"] ;
       CIRCLEStoolsFUNDAMENTALREGIONcanvas_mouse_proc_switch = MOUSE_NO_PROC_ID ;
    }
}

function FUNDAMENTAL_REGION_WORK_canvas_onmouseout( obj, event )
{
    if ( CIRCLEStoolsFUNDAMENTALREGIONcanvas_mouse_proc_switch == MOUSE_ZOOM_PROC_ID )
    {
         // also refresh view
         circles_lib_canvas_clean( obj );
         CIRCLEStoolsFUNDAMENTALREGIONcanvas_mouse_proc_switch = MOUSE_NO_PROC_ID ;
    }

    $( "#CIRCLEStoolsFUNDAMENTALREGIONworkLAYER" ).css('cursor','default');
}