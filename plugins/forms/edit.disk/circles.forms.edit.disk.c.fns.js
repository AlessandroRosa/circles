function CIRCLESformsEDITDISKcreate_inverse_element( _items_array, _i, _silent, _out_channel )
{
		_silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ){ return is_item_obj( _obj ) ; } );
    if ( !_test )
    {
       var _msg = "Input container does not appear to be the items container" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "CIRCLESformsEDITDISKoutMSG" ) ;
       return [ RET_WARNING, _msg ];
    }
    
    var _mm = _items_array[_i].map ;
    if ( is_mobius_map( _mm ) )
    {
       var item_type = _items_array[_i].item_type ;
       var _symbol = _items_array[_i].symbol ;
       var _complex_circle = _items_array[i].complex_circle.copy() ;
       var draw = _items_array[_i].complex_circle.draw ;
       var fill = _items_array[_i].complex_circle.fill ;
       var drawcolor = _items_array[_i].complex_circle.drawcolor ;
       var fillcolor = _items_array[_i].complex_circle.fillcolor ;
       var linewidth = _items_array[_i].complex_circle.linewidth ;
       var inv_map = _mm.inv();
       var inverse_symbol = _symbol.length > 0 ? circles_lib_word_inverse_get( _symbol ) : "" ;
       if ( !is_item_obj( circles_lib_find_item_obj_by_symbol( _items_array, inverse_symbol ) ) ) // if it does not exist, it is created
       {
          _items_array.push( new item_obj( inv_map, null, null, inverse_symbol, 0, draw, drawcolor, fill, fillcolor, _symbol, linewidth, item_type, inverse_symbol ) );
          _items_array[ _i ].inverse_symbol = safe_string( inverse_symbol, "" ) ;
          if ( _out_channel == OUTPUT_SCREEN && !_silent )
          circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "The inverse item has been created with success", 'CIRCLESformsEDITDISKoutMSG' )
          return [ RET_OK, _items_array.length - 1 ] ;
       }
       else
       {
          var _msg = "The inverse map has been already created" ;
          if ( _out_channel == OUTPUT_SCREEN && !_silent )
          circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "CIRCLESformsEDITDISKoutMSG" ) ;
          return [ RET_WARNING, _msg ] ;
       }
    }
    else
    {
       var _msg = "The inverse map cannot be created" ;
       if ( _out_channel == OUTPUT_SCREEN && !_silent )
       circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "CIRCLESformsEDITDISKoutMSG" ) ;
       return [ RET_WARNING, _msg ];
    }
}

function CIRCLESformsEDITDISKdisk_from_equation()
{
    var ALPHA = safe_float( $("#CIRCLEselectedALPHA").val(), 0.0 );
    if ( ALPHA == 0.0 ) $("#CIRCLEselectedALPHA").val( ALPHA );
    var BETA = safe_float( $("#CIRCLEselectedBETA").val(), 0.0 );
    if ( BETA == 0.0 ) $("#CIRCLEselectedBETA").val( BETA );
    var GAMMA = safe_float( $("#CIRCLEselectedGAMMA").val(), 0.0 );
    if ( GAMMA == 0.0 ) $("#CIRCLEselectedGAMMA").val( GAMMA );

    var _center_x = -ALPHA / 2.0, _center_y = -BETA / 2.0 ;
    var _radicand = ( _center_x * _center_x ) + ( _center_y * _center_y ) - GAMMA ;
    var _radius = _radicand >= 0 ? Math.sqrt( _radicand ) : UNFOUND ;

    if ( _radius == UNFOUND )
    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Input params are invalid to compute a circle with positive radius", "CIRCLESformsEDITDISKoutMSG" ) ;
    else
    {
        $("#CIRCLEselectedCENTERx").val( _center_x );
        $("#CIRCLEselectedCENTERy").val( _center_y );
        $("#CIRCLEselectedCENTERradius").val( _radius );
        _glob_to_save = _glob_items_to_init = YES ;
        $('[id$=initBTN]').css('color',COLOR_ERROR) ;
        circles_lib_extras_button_enable( 'APPLYchangesBTN', _glob_to_save, 0 );
    }
}

function CIRCLESformsEDITDISKbtnbarSHOW( _sel_id )
{
    _sel_id = safe_int( _sel_id, 0 );
    var _max_id = 4, _show ;
    for( var _i = 1 ; _i <= _max_id ; _i++ )
    {
        _show = _sel_id == _i ? YES : NO ;
        $("#CIRCLESeditBARMENUentry_" + _i ).css( "font-weight", _show ? "bold" : "normal" );
        $("#CIRCLESeditBARMENUentry_" + _i ).css( "color", _show ? "#00539A" : "#323232" );
        _show ? $( "#CIRCLESeditBARDIV_" + _i ).slideDown("slow") : $( "#CIRCLESeditBARDIV_" + _i ).slideUp("fast");
    }
}
function CIRCLESformsEDITDISKremoveMOBIUSfillCOLOR( _index, _question, _silent, _out_channel )
{
		// works with seeds
		var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    _silent = safe_int( _silent, NO ), _question = safe_int( _question, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN ), _index = safe_int( _index, UNFOUND );
    if ( _index != UNFOUND )
    {
       var _b_go = !_question ? YES : confirm( _QUESTION_29 );
       if ( _b_go )
       {
          if ( is_item_obj( _items_array[_index] ) )
          {
             if ( is_circle( _items_array[_index].complex_circle ) ) _items_array[_index].complex_circle.fillcolor = "" ;
             circles_lib_plugin_load('forms','edit.disk', NO, _index);

             var _msg = "Fill color removed with success" ;
             if ( _out_channel == OUTPUT_SCREEN && !_silent )
             circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, _msg, "CIRCLESformsEDITDISKoutMSG" ) ;
             return [ RET_OK, _msg ] ;
          }
          else
          {
             if ( _out_channel == OUTPUT_SCREEN && !_silent )
             circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _ERR_26_01, 'CIRCLESformsEDITDISKoutMSG' )
             return [ RET_ERROR, _ERR_26_01 ] ;
          }
        }
    }
    else
    {
        if ( _out_channel == OUTPUT_SCREEN && !_silent )
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _ERR_26_00, 'CIRCLESformsEDITDISKoutMSG' )
        return [ RET_ERROR, _ERR_26_00 ] ;
    }
}

function CIRCLESformsEDITDISKsuggestSYMBOL( _src )
{
		_src = safe_string( _src, "direct" ).toLowerCase() ;
		switch( _src )
		{
		 		case "inverse":
		 		var _suggested_inverse_symbol = circles_lib_alphabet_suggest_inverse_symbol() ;
		 		if ( _suggested_inverse_symbol.length == 0 )
		 		_suggested_inverse_symbol = circles_lib_alphabet_suggest_inverse_symbol( $('#CIRCLEselectedSYMBOL').val() ) ;
		 		$('#CIRCLEselectedINVERSESYMBOL').val( _suggested_inverse_symbol );
				_glob_to_save = YES;
				circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);
				break ;
		 		case "direct":
				default:
				var _suggest_direct_symbol = circles_lib_alphabet_suggest_symbol() ;
		 		$('#CIRCLEselectedSYMBOL').val( _suggest_direct_symbol );
				_glob_to_save = YES ;
				circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);
				break ;
		}
		
		$("#CIRCLESformsEDITDISKapplyBTN").css( "color", "red" );
}

function CIRCLESformsEDITDISKswitchMOBIUSparams( _symbol, _type /* 1: orthogonal, 2: radial */ )
{
    _symbol = safe_string( _symbol, "" ), _type = safe_int( _type, 0 );
    var REALlabelID = "CIRCLEselectedREALsymbol" + _symbol ;
    var IMAGlabelID = "CIRCLEselectedIMAGsymbol" + _symbol ;
      
    $("#"+REALlabelID ).html( _type == 1 ? "Real" : "Radius" );
    $("#"+IMAGlabelID ).html( _type == 1 ? "Imag" : "Angle" );
      
    var _old_type = 0 ;
    var HIDDENeditID = "CIRCLEselectedMOBIUSMAPhidden" + _symbol ;
    var HIDDENedit = $("#" + HIDDENeditID ).get(0);
    if ( HIDDENedit != null )
    {
        _old_type = safe_int( HIDDENedit.value, 0 );
        HIDDENedit.value = _type ;
    }
          
    var ID1 = "CIRCLEselectedMOBIUSMAPparam"+_symbol+"real" ;
    var ID2 = "CIRCLEselectedMOBIUSMAPparam"+_symbol+"imag" ;
           
    if ( _old_type == 1 && _old_type != _type ) // old was orthogonal, so new is radial
    {
         var real = safe_float( $("#"+ID1 ).val(), 0 );
         var imag = safe_float( $("#"+ID2 ).val(), 0 );
         var c = new complex( real, imag ), radius = c.radius(), angle = c.angle();
         $("#"+ID1 ).val( radius );
         $("#"+ID1 ).val( angle );
    }
    else if ( _old_type == 2 && _old_type != _type ) // old was radial, so new is orthogonal
    {
         var radius = safe_float( $("#"+ID1 ).val(), 0 );
         var angle = safe_float( $("#"+ID2 ).val(), 0 );
         var c = new complex();
             c = c.frompolar( radius, angle );
         $("#"+ID1 ).val( c.real );
         $("#"+ID1 ).val( c.imag );
    }
}

function CIRCLESformsEDITDISKobjectAPPLY( _item_index, _item_type, _items_switch, _question, _silent, _out_channel )
{
    var _chunk = circles_lib_items_set( _items_switch, YES ) ;
    var _items_n = _chunk['count'], _items_array = _chunk['array'], _caption = _chunk['label'], _items_switch = _chunk['switch'] ;
    _item_index = safe_int( _item_index, UNFOUND ), _item_type = safe_int( _item_type, ITEM_TYPE_CIRCLE );
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );

    var _b_colorize = $( "#CIRCLESformsEDITDISKcolorizeCHECKBOX" ).prop( "checked" ) ? YES : NO ;
    var X = safe_float( $("#CIRCLEselectedCENTERx").val(), 0 );
    var Y = safe_float( $("#CIRCLEselectedCENTERy").val(), 0 );
    var RADIUS = safe_float( $("#CIRCLEselectedCENTERradius").val(), 0 );
    var _symbol = safe_string( $("#CIRCLEselectedSYMBOL").val(), "" );
    if ( _symbol.length == 0 ) _symbol = circles_lib_alphabet_suggest_symbol( null, SMALL_LETTER );
    var _inv_symbol = safe_string($("#CIRCLEselectedINVERSESYMBOL").val(), _glob_method.is_one_of( METHOD_ALGEBRAIC ) ? circles_lib_word_inverse_get( _symbol ) : "" );
    var DRAWCOLOR = safe_string( $("#CIRCLEScircleSELECTEDdrawcolor").css( 'background-color' ), _glob_draw_seed_color );
    var FILLCOLOR = safe_string( $("#CIRCLEScircleSELECTEDfillcolor").css( 'background-color' ), _glob_fill_seed_color );
    var draw = $("#CIRCLEScirclesDRAWcheckbox").is( ":checked" ) ? YES : NO ;
    var fill = $("#CIRCLEScirclesFILLcheckbox").is( ":checked" ) ? YES : NO ;
    var linewidth = safe_int( $("#CIRCLEselectedLINETHICKNESS").val(), 1 );
    var PARAMSinputTYPEmask = 0 ; // bit : 0 --> orthogonal, 1 : radial
          
    // params a, b, c, d are complex numbers
    var _mm_Areal = safe_float( $("#CIRCLEselectedMOBIUSMAPparamAreal").val(), 0 );
    var _mm_Aimag = safe_float( $("#CIRCLEselectedMOBIUSMAPparamAimag").val(), 0 );
    var Atype = safe_int( $("#CIRCLEselectedMOBIUSMAPhiddenA").val(), 1 );
    if ( Atype == 2 ) PARAMSinputTYPEmask |= 1 ;

    var _mm_Breal = safe_float( $("#CIRCLEselectedMOBIUSMAPparamBreal").val(), 0 );
    var _mm_Bimag = safe_float( $("#CIRCLEselectedMOBIUSMAPparamBimag").val(), 0 );
    var Btype = safe_int( $("#CIRCLEselectedMOBIUSMAPhiddenB").val(), 1 );
    if ( Btype == 2 ) PARAMSinputTYPEmask |= 2 ;

    var _mm_Creal = safe_float( $("#CIRCLEselectedMOBIUSMAPparamCreal").val(), 0 );
    var _mm_Cimag = safe_float( $("#CIRCLEselectedMOBIUSMAPparamCimag").val(), 0 );
    var Ctype = safe_int( $("#CIRCLEselectedMOBIUSMAPhiddenC").val(), 1 );
    if ( Ctype == 2 ) PARAMSinputTYPEmask |= 4 ;

    var _mm_Dreal = safe_float( $("#CIRCLEselectedMOBIUSMAPparamDreal").val(), 0 );
    var _mm_Dimag = safe_float( $("#CIRCLEselectedMOBIUSMAPparamDimag").val(), 0 );
    var Dtype = safe_int( $("#CIRCLEselectedMOBIUSMAPhiddenD").val(), 1 );
    if ( Dtype == 2 ) PARAMSinputTYPEmask |= 8 ;

    _item_type = _item_index != UNFOUND ? _items_array[_item_index].item_type : _item_type ;
          
    // these are not geometric changes, thus they are not subjected to checking
    if ( _glob_method == METHOD_NONE )
    {
    		var _msg = "Missing method declaration" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent )
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "CIRCLESformsEDITDISKoutMSG" ) ;
        return [ RET_WARNING, _msg ] ;
    }
    else if( _symbol.length != 1 && !_symbol.isAlpha() )
    {
    		var _msg = "Can't apply values:"+_glob_crlf ;
				if ( _symbol.length != 1 ) _msg += "* symbol must be 1-char long" ;
				if ( !_symbol.isAlpha() ) _msg += "* symbol must be of alphabetic kind" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent )
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "CIRCLESformsEDITDISKoutMSG" ) ;
        return [ RET_ERROR, _msg ] ;
    }
    else if ( _item_type == ITEM_TYPE_CIRCLE && RADIUS <= 0 )
    {
    		var _msg = "Can't apply values."+_glob_crlf.repeat(2)+"Radius must be strictly positive" ;
        if ( _out_channel == OUTPUT_SCREEN && !_silent )
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "CIRCLESformsEDITDISKoutMSG" ) ;
        return [ RET_ERROR, _msg ] ;
    }
    else
    {
        var _msg = _item_type == ITEM_TYPE_MOBIUS ? _QUESTION_08_03 : ( _item_index == UNFOUND ? _QUESTION_08_01 : _QUESTION_08_02 );
        var _b_go = _question ? confirm( _msg ) : YES ;
        if ( _b_go )
        {
            var tmpMM = circles_lib_find_item_obj_by_symbol( _items_array, _symbol + "" );
            if ( _item_index == UNFOUND )
            _item_index = _symbol.length > 0 ? circles_lib_find_item_index_by_symbol( _items_array, _symbol + "" ) : _item_index ;
            
            if ( _symbol.length > 0 && _inv_symbol.length > 0 && _symbol == _inv_symbol )
            {
               var _msg = "Can't apply params: symbol and its inverse are the same" ;
               if ( _out_channel == OUTPUT_SCREEN && !_silent )
               circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, "CIRCLESformsEDITDISKoutMSG" ) ;
               return [ RET_ERROR, _msg ] ;
            }
            else if ( _item_index == UNFOUND )
            {
               var _item = null, _complex_circle = null, _screen_circle = null, _mm = null ;
               if ( _item_type == ITEM_TYPE_CIRCLE ) // recover all data from circle
               {
                  _complex_circle = new circle( new point( X, Y ), RADIUS );
		              _screen_circle = circles_lib_get_screendisk_from_complexdisk( zplane_sm, _complex_circle );
                  _item = circles_lib_items_create_from_disk( _item_index, _complex_circle, _screen_circle );
		              if ( is_item_obj( _item ) ) _items_array.push( _item );
               }
               else if ( _item_type == ITEM_TYPE_MOBIUS ) // recover all data from Mobius map
               {
                  var A = new complex( _mm_Areal, _mm_Aimag );
                  if ( Atype == 2 ) A = A.frompolar( _mm_Areal, _mm_Aimag ); // params were in polar coordinates
                  var B = new complex( _mm_Breal, _mm_Bimag );
                  if ( Btype == 2 ) B = B.frompolar( _mm_Breal, _mm_Bimag ); // params were in polar coordinates
                  var C = new complex( _mm_Creal, _mm_Cimag );
                  if ( Ctype == 2 ) C = C.frompolar( _mm_Creal, _mm_Cimag ); // params were in polar coordinates
                  var D = new complex( _mm_Dreal, _mm_Dimag );
                  if ( Dtype == 2 ) D = D.frompolar( _mm_Dreal, _mm_Dimag ); // params were in polar coordinates
                  _mm = new mobius_map( A, B, C, D );
                  
	                _items_array.push( new item_obj( _mm, _complex_circle, _screen_circle, _symbol, PARAMSinputTYPEmask,
	                   		                           draw, DRAWCOLOR, fill, FILLCOLOR, _inv_symbol, linewidth, _item_type, _symbol ) );
                  if ( _b_colorize ) circles_lib_colors_colorize( _items_array, YES, YES, _out_channel ) ;
               }

               _glob_disk_sel_index = _item_index = safe_int( circles_lib_count_items( _items_array ) - 1, UNFOUND );
               if ( _item_index != UNFOUND )
               {
                   if ( _ret_chunk[0] != RET_OK )
                   {
                      circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
                      return _ret_chunk ;
                   }

                   _msg = "A new "+( _item_type == ITEM_TYPE_CIRCLE ? "disk" : "map" )+" has been inserted with success", _b_go = YES ;
               }
               else
               {
                   _glob_zplane_selected_items_array.flush();
                   _glob_zplane_selected_items_array.push( _item_index );
                   circles_lib_helper_div_remove();
                   var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, _out_channel );
                   if ( _ret_chunk[0] != RET_OK )
                   {
                      circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
                      return _ret_chunk ;
                   }
                   _msg = "Fail to add a new disk", _b_go = NO ;
               }
            }
            else if ( _item_index > UNFOUND )
            {
                 var _complex_circle = new circle( new point( X, Y ), RADIUS );
                 if ( is_mobius_map( _mm ) ) _items_array[_item_index].map = _mm.copy() ;
                 _items_array[_item_index].item_type = _item_type ;

                 if ( !is_circle( _items_array[_item_index].complex_circle ) )
                 _items_array[_item_index].complex_circle = _complex_circle.copy() ;

                 if ( is_circle( _items_array[_item_index].complex_circle ) )
                 {
                    _items_array[_item_index].complex_circle.draw = draw ;
                    _items_array[_item_index].complex_circle.drawcolor = DRAWCOLOR ;
                    _items_array[_item_index].complex_circle.fill = fill ;
                    _items_array[_item_index].complex_circle.fillcolor = FILLCOLOR ;
                    _items_array[_item_index].complex_circle.linewidth = linewidth ;
                 }
  
	               if ( !is_circle( _items_array[_item_index].screen_circle ) )
                 {
                     var _screen_circle = circles_lib_get_screendisk_from_complexdisk( zplane_sm, _complex_circle );
                     _items_array[_item_index].screen_circle = _screen_circle.copy() ;
                 }
  
	               _items_array[_item_index].original_word = _items_array[_item_index].symbol = safe_string( _symbol.trim(), "" ) ;
                 _items_array[_item_index].inverse_symbol = safe_string( _inv_symbol, "" ) ;
                 _items_array[_item_index].params_mask = PARAMSinputTYPEmask ;
                 _glob_disk_sel_index = _item_index, _b_go = YES, _glob_to_save = NO ;
                  if ( _b_colorize ) circles_lib_colors_colorize( _items_array, YES, YES, _out_channel ) ;
                  
                 _msg = "Params have been applied with success" ;
            }

						if ( _b_go )
						{
                var _options = [ _b_colorize ] ;
                _glob_init_mask = INIT_FROM_DISKS | ( circles_lib_method_get() == METHOD_ALGEBRAIC ? INIT_PAIRED_ITEMS : INIT_SINGLE_ITEMS ) ;
                circles_lib_menu_entries_update();
								circles_lib_plugin_load('forms','edit.disk',NO,_item_index,_items_switch,_options);
								circles_lib_canvas_render_zplane( null, zplane_sm, null, YES, YES, YES, NO, YES, YES, OUTPUT_SCREEN );
                $('[id$=initBTN]').css('color',COLOR_ERROR) ;
		            _glob_to_save = NO, _glob_items_to_init = YES ;
		            $("#CIRCLESformsEDITDISKapplyBTN").css( "color", "black" );
						}

            if ( _out_channel == OUTPUT_SCREEN && !_silent )
            circles_lib_output( OUTPUT_SPECIAL_FX, _b_go ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, 'CIRCLESformsEDITDISKoutMSG' )
            return [ _b_go ? RET_OK : RET_ERROR, _msg ] ;
        }
    }
}

function CIRCLESformsEDITDISKsetTRANSPARENTfillcolor( _index )
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    _index = safe_int( _index, UNFOUND );
    if ( _index != UNFOUND && is_item_obj( _items_array[_index] ) )
    {
       if ( is_circle( _items_array[_index].complex_circle ) )
       {
          _items_array[_index].complex_circle.fill = NO;
          _items_array[_index].complex_circle.fillcolor = '' ;
          _glob_to_save = YES;
          circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);
          $('#CIRCLEScirclesFILLcheckbox').prop( "checked", NO );
          $('#CIRCLEScircleSELECTEDfillcolor').css( "background-color", "" );
          $('#CIRCLEScircleSELECTEDfillcolor').html( 'none' );
       }
       else
       circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't set the fill color: archival error 0.2", 'CIRCLESformsEDITDISKoutMSG' )
    }
    else
    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't set the fill color: archival error 0.1", 'CIRCLESformsEDITDISKoutMSG' )
}

function CIRCLESformsEDITDISKsetTRANSPARENTdrawcolor( _index )
{
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    _index = safe_int( _index, UNFOUND );
    if ( _index != UNFOUND && is_item_obj( _items_array[_index] ) )
    {
       if ( is_circle( _items_array[_index].complex_circle ) )
       {
          _items_array[_index].complex_circle.draw = NO;
          _items_array[_index].complex_circle.drawcolor = '' ;
          _glob_to_save = YES;
          circles_lib_extras_button_enable('APPLYchangesBTN', _glob_to_save,1);
          $('#CIRCLEScirclesDRAWcheckbox').prop( "checked", NO );
          $('#CIRCLEScircleSELECTEDdrawcolor').css( "background-color", "" );
          $('#CIRCLEScircleSELECTEDdrawcolor').html( 'none' );
       }
       else
       circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't set the draw color: archival error 0.1", 'CIRCLESformsEDITDISKoutMSG' )
    }
    else
    circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Can't set the fill color: archival error 0.1", 'CIRCLESformsEDITDISKoutMSG' )
}