function CIRCLESformsPALETTEshow()
{
    var PALETTEhtmlCODE = CIRCLESformsPALETTEdisplayTABLE();
        PALETTEhtmlCODE = PALETTEhtmlCODE.replaceAll( "%imgpath%", _glob_path_to_img );
    $("#CIRCLEScolorsPALETTEcontainer").html( PALETTEhtmlCODE );
}

function CIRCLESformsPALETTEaddCOLOR( _question, _silent, _output_channel )
{
     _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
     _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
     var CLR = $("#CANVAScolorCELL").css( "background-color" );
     if ( CLR.length > 0 )
     {
         var _b_go = !_question ? YES : confirm( _QUESTION_11_03 );
         if ( _b_go )
         {
              _glob_palette_array.push( CLR );
              $("#CIRCLEScolorsPALETTEcontainer").html( CIRCLESformsPALETTEdisplayTABLE().replaceAll( "%imgpath%", _glob_path_to_img ) );

              var _msg = "New color added with success" ;
              if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
              return [ RET_WARNING, _msg ] ;
         }
     }
     else
     {
         var _msg = "Pick up a color first !" ;
         if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         return [ RET_IRRELEVANT, _msg ] ;
     }
}

function CIRCLESformsPALETTEupdateCOLOR( _question, _silent, _output_channel )
{
     _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
     _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
     var CLR = $("#CANVAScolorCELL").css( "background-color" );
     if ( CLR.length > 0 && _glob_palette_index_selection != UNDET )
     {
         var _b_go = !_question ? YES : confirm( _QUESTION_11_04 );
         if ( _b_go )
         {
              _glob_palette_array[_glob_palette_index_selection] = CLR ;
              $("#CIRCLEScolorsPALETTEcontainer").html( CIRCLESformsPALETTEdisplayTABLE().replaceAll( "%imgpath%", _glob_path_to_img ) );
              var _msg = "Color modified with success" ;
              if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_SUCCESS, _msg, _glob_app_title );
              return [ RET_WARNING, _msg ] ;
         }
     }
     else
     {
         var _msg = "Select a color from the palette first !" ;
         if ( _output_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         return [ RET_IRRELEVANT, _msg ] ;
     }
}

function CIRCLESformsPALETTEdisplayTABLE( divwidth )
{
     divwidth = safe_string( divwidth, "95%" );
     if ( !( new String( divwidth ).includes( "%" ) ) )
     {
         divwidth -= 20 ;
         divwidth += "px" ;
     }

     var N = safe_size( _glob_palette_array, 0 ), COLS = 12 ;
     var ROWS = safe_int( N / COLS, 0 );
         if ( N % COLS > 0 ) ROWS++ ;
         ROWS = Math.min( ROWS, 2 );
     var HTMLcode = N > 10 ? "<DIV STYLE=\"position:relative;width:"+divwidth+";height:"+( ROWS * 60 )+"px;overflow:auto;padding:2px;\">" : "" ;
         HTMLcode += "<table ALIGN=\"center\">" ;
     var CLR ;
     for( var i = 0 ; i < N ; i++ )
     {
         CLR = _glob_palette_array[i] ;
         if ( i % COLS == 0 ) HTMLcode += "<tr>" ;
         HTMLcode += "<td VALIGN=\"top\">" ;
         HTMLcode += "<table>" ;
         HTMLcode += "<tr><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_palette_delete_entry('"+i+"');\" ALIGN=\"center\"><SPAN STYLE=\"font-size:10pt;\">"+( i+1 )+"</SPAN><td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
         HTMLcode += "<tr><td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" ONCLICK=\"javascript:_glob_palette_index_selection="+i+";$('#CANVAScolorCELL').css( 'background-color', '"+CLR+"' );\" TITLE=\""+CLR+"\" STYLE=\"height:14px;width:14px;background-color:"+CLR+";\" CLASS=\"general_rounded_corners\"></td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
         HTMLcode += "<tr><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_palette_delete_entry('"+i+"');\" ALIGN=\"center\"><IMG SRC=\"%imgpath%icons/delete/delete.icon.20x20.png\"><td></tr>" ;
         HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
         HTMLcode += "</table>" ;
         HTMLcode += "</td>" ;
         HTMLcode += ( i % COLS == ( N - 1 ) ) ? "</tr><tr><td HEIGHT=\"3\"></td></tr>" : "<td WIDTH=\"6\"><td>" ;
     }

     HTMLcode += "</table>" ;
     HTMLcode += N > 10 ? "</DIV>" : "" ;
     HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
     _glob_palette_index_selection = UNDET ;
     $("#CIRCLEScolorPALETTEcount").html( "("+N+")" );
     return HTMLcode ;
}

function CIRCLESformsPALETTEcomputeGRADIENTpre( _silent, _output_channel )
{
     _silent = safe_int( _silent, NO ), _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
     var RGBintSTART = $("#CANVAScolorCELLgradientSTART").css( 'background-color' );
     var RGBintEND = $("#CANVAScolorCELLgradientEND").css( 'background-color' );
     var STEPS = safe_int( $("#CANVAScolorCELLgradientSTEPS").val(), 0 );
     if ( STEPS <= 0 )
     {
         STEPS = 10 ;
         $("#CANVAScolorCELLgradientSTEPS").val( STEPS );
         var _msg = "The input entries value is not positive: corrected to the default value ("+STEPS+")." ;
         if ( !_silent && _output_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
         else circles_lib_output( _output_channel, _msg, DISPATCH_INFO ) ;
     }

     _glob_palette_start_rgb = RGBintSTART, _glob_palette_end_rgb = RGBintEND ;
     _glob_palette_steps = STEPS ;

     var _ret_chunk = circles_lib_colors_compute_gradient( RGBintSTART, RGBintEND, STEPS, _silent, _output_channel );
     var _ret_id = _ret_chunk[0], _tmp_array = _ret_chunk[1] ;
     var _msg = _ret_chunk[2] ;
     if ( _ret_id == RET_ERROR ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg + _glob_crlf + "Can't compute the color gradient." + _glob_crlf + _ERR_00_05, _glob_app_title );
     else CIRCLESformsPALETTEshow();

     $("#CANVASpaletteLABEL_01").html( _glob_palette_steps > _glob_depth ? "<span STYLE=\"color:red;\">exceeding current depth : "+_glob_depth+"</span>" : "" );
}

function CIRCLESformsPALETTEswapCOLORS()
{
     var RGBintSTART = $("#CANVAScolorCELLgradientSTART").css( "background-color" );
     var RGBintEND = $("#CANVAScolorCELLgradientEND").css( "background-color" );
     $("#CANVAScolorCELLgradientSTART").css( "background-color", RGBintEND );
     $("#CANVAScolorCELLgradientEND").css( "background-color", RGBintSTART );
}

function CIRCLESformsPALETTEpreviewAPPEND( _question, _silent, _output_channel )
{
     _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
     _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
     hideCOLORTABLE();
     var RGBintSTART = $("#CANVAScolorCELLgradientSTART").css( "background-color" );
     var RGBintEND = $("#CANVAScolorCELLgradientEND").css( "background-color" );
     var STEPS = safe_int( $("#CANVAScolorCELLgradientSTEPS").val(), 0 );
     if ( STEPS <= 0 )
     {
         if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The entries number was not positive: thus it is corrected to the default value.", _glob_app_title );
         STEPS = 10, $("#CANVAScolorCELLgradientSTEPS").val( STEPS );
     }

     var GRADIENTdataCHUNK = circles_lib_colors_compute_gradient( RGBintSTART, RGBintEND, STEPS, _silent, _output_channel );
     var _ret_id = GRADIENTdataCHUNK[0], _ret_palette_array = GRADIENTdataCHUNK[1], _ret_msg = GRADIENTdataCHUNK[2] ;
     if ( !_ret_id ) alert_msg( ALERT, _ret_msg, GLOBALpathTOroot );
     else
     {
         var HTMLcode = "" ;
         if ( STEPS > 40 ) HTMLcode += "<DIV ALIGN=\"center\" STYLE=\"position:relative;width:300px;height:110px;padding:3px;overflow:auto;\">" ;
         HTMLcode += "<table ALIGN=\"center\">" ;
         var CLR, COLS = 10 ;
         for( var i = 0 ; i < STEPS ; i++ )
         {
             CLR = _ret_palette_array[i] ;
             if ( i % COLS == 0 ) HTMLcode += "<tr>" ;

             HTMLcode += "<td VALIGN=\"top\">" ;
             HTMLcode += "<table>" ;
             HTMLcode += "<tr><td ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\" ONCLICK=\"javascript:_glob_palette_index_selection="+i+";$('#CANVAScolorCELL').css( 'background-color', '"+CLR+"' );\" TITLE=\""+CLR+"\" STYLE=\"height:16px;width:16px;background-color:"+CLR+";\" CLASS=\"general_rounded_corners\"></td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
             HTMLcode += "</table>" ;
             HTMLcode += "</td>" ;
             HTMLcode += ( i % COLS == ( STEPS - 1 ) ) ? "</tr><tr><td HEIGHT=\"4\"></td></tr>" : "<td WIDTH=\"3\"><td>" ;
         }

         HTMLcode += "</table>" ;
         if ( STEPS > 40 ) HTMLcode += "</DIV>" ;

         $("#CIRCLESpaletteGRADIENTpreview").html( HTMLcode );
         $("#CIRCLESpaletteGRADIENTpreview").slideDown( "slow" );
     }
}

function CIRCLESformsPALETTEappend( _question, _silent, _output_channel )
{
     _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
     _output_channel = safe_int( _output_channel, OUTPUT_SCREEN );
     var _b_go = !_question ? YES : confirm( "Confirm to append the input gradient to the current palette ?" );
     if ( _b_go )
     {
         var RGBintSTART = $("#CANVAScolorCELLgradientSTART").css( "background-color" );
         var RGBintEND = $("#CANVAScolorCELLgradientEND").css( "background-color" );
         var STEPS = safe_int( $("#CANVAScolorCELLgradientSTEPS").val(), 0 );
         if ( STEPS <= 0 )
         {
             if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The entries number was not positive: thus it is corrected to the default value.", _glob_app_title );
             STEPS = 10, $("#CANVAScolorCELLgradientSTEPS").val( STEPS );
         }

         _glob_palette_start_rgb = RGBintSTART, _glob_palette_end_rgb = RGBintEND ;
         _glob_palette_steps = STEPS ;
         var _ret_chunk = circles_lib_colors_compute_gradient( RGBintSTART, RGBintEND, STEPS, _silent, _output_channel );
         var appendPALETTEarray = _ret_chunk[1] ;
         if ( !is_array( appendPALETTEarray ) && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, "Can't compute the color gradient." + _glob_crlf + _ret_chunk[1] + _glob_crlf + _ERR_00_05, _glob_app_title );
         else
         {
             if ( !is_array( _glob_palette_array ) ) _glob_palette_array = [] ;
             _glob_palette_array = _glob_palette_array.concat( appendPALETTEarray );
             hideCOLORTABLE();
             CIRCLESformsPALETTEshow();
         }
     }
}