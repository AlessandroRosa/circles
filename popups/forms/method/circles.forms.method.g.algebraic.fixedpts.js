function CIRCLESformsMETHODvalDISPLAY( _i, _trace, _label ) { $( "#ALGEBRAICfixedpointsLISTwork" + _i ).html( _label+" is <b STYLE=\"color:#6F6FF5;\">" + _trace + "</b>" ).fadeIn( "slow" ); }
function CIRCLESformsMETHODfixedpointsRESOLVEword( _i, _question, _silent, _out_channel )
{
    _i = safe_int( _i, UNDET ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    var _fp_n = circles_lib_count_fixed_points();
    if ( _fp_n == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The fixed points list is empty", _glob_app );
    else
    {
       var _chunk = _glob_input_fixed_pts_array[_i] ;
       if ( _chunk == null ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Invalid object reference", _glob_app );
       else
       {
          var _word = _chunk[0] ;
          if ( _word.length == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing word string", _glob_app );
          else
          {
             var _is_repetend = circles_lib_repetends_check_syntax( null, _word ) ? YES : NO ;
             var _is_pqword = _word.testME( _glob_pqword_regex_pattern );
             var _is_word = circles_lib_word_check( _word, _glob_alphabet );
             var _solved_word = "" ;
             if ( _is_pqword ) _solved_word = circles_lib_word_pq_translate( ( _word.split( "/" ) )[0], ( _word.split( "/" ) )[1] );
             else if ( _is_repetend ) _solved_word = circles_lib_repetends_resolve( _word );
             else if ( _is_word ) _solved_word = _word ;
             else _solved_word = "Invalid input" ;
             $( "#ALGEBRAICfixedpointsLISTwork" + _i ).html( "Repetend <b STYLE=\"color:#6F6FF5;\">" + _word + "</b> is resolved to <b STYLE=\"color:#4B4BD1;\">" + _solved_word + "</b>" ).fadeIn( "slow" );
          }
       }
    }
}

function CIRCLESformsMETHODfixedpointsFIGURES( _plane_type, _question, _silent, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _fp_n = circles_lib_count_fixed_points();
    if ( _fp_n == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The fixed points list is empty", _glob_app );
    else if ( !_plane_type.is_one_of( Z_PLANE, W_PLANE ) ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing input plane reference", _glob_app );
    else
    {
       var _b_go = confirm( "Fixed points will be converted into 'figure' objects for further managing. Confirm ?" );
       if ( _b_go )
       {
          var _ret_chunk = circles_lib_fixedpoints_create_figures_from( UNDET, _plane_type, _out_channel );
          var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
          var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
          circles_lib_output( OUTPUT_SCREEN, _ret_id == RET_OK ? DISPATCH_SUCCESS : DISPATCH_WARNING, _ret_msg, _glob_app );
       }
    }
}

function CIRCLESformsMETHODfixedpointsSEEDS( _question, _silent, _out_channel )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _items_array = _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ), _fp_n = circles_lib_count_fixed_points();
    if ( _items_n == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The fixed points list is empty", _glob_app );
    else
    {
       var _b_go = _fp_n > 0 ? confirm( "The default seeds words list will overwrite current settings. Confirm ?" ) : YES ;
       if ( _b_go )
       {
          var _ret_chunk = circles_lib_fixedpoints_add_from_seeds( _out_channel );
          var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
          var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
          if ( _ret_id == RET_OK ) CIRCLESformsMETHODfixedpointsLIST();
          else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app );
       }
    }
}

function CIRCLESformsMETHODfixedpointsWORDSfromGENERATORSSET( _question, _silent, _out_channel )
{
     _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
     _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
     var _gg_n = circles_lib_count_gens(), _fp_n = circles_lib_count_fixed_points();
     if ( _gg_n == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The gens set is empty", _glob_app );
     else
     {
        var _b_go = _fp_n > 0 ? confirm( "The gens set words list will overwrite current settings. Confirm ?" ) : YES ;
        if ( _b_go )
        {
            var _ret_chunk = circles_lib_fixedpoints_add_from_gens_set( _out_channel );
            var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
            var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
            if ( _ret_id == RET_OK ) CIRCLESformsMETHODfixedpointsLIST();
            else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app );
        }
     }
}

function CIRCLESformsMETHODfixedpointsCOMMUTATORS( _question, _silent, _out_channel )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _items_array = _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ) ;
    var _fp_n = circles_lib_count_fixed_points();
    if ( _items_n == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't retrieve the commutators list: missing gens", _glob_app );
    else if ( safe_size( _glob_alphabet ) == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't retrieve the commutators list: no alphabet available", _glob_app );
    else
    {
       var _b_go = _fp_n > 0 ? confirm( "The commutators words list will overwrite current settings. Confirm ?" ) : YES ;
       if ( _b_go )
       {
          var _ret_chunk = circles_lib_fixedpoints_add_from_commutators( 0, _out_channel );
          var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
          var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
          if ( _ret_id == RET_OK ) CIRCLESformsMETHODfixedpointsLIST();
          else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app );
       }
    }
}

function CIRCLESformsMETHODfixedpointsBOMB( _question, _silent, _out_channel )
{
     _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
     _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
     var _fp_n = circles_lib_count_fixed_points();
     if ( _fp_n == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "The list of input fixed points is already empty", _glob_app );
     else
     {
          var _b_go = _question ? confirm( "Confirm to delete all entries of this list ?" ) : YES ;
          if ( _b_go )
          {
              var _ret_chunk = circles_lib_fixedpoints_bomb( _out_channel );
              var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
              var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
              if ( _ret_id == RET_OK ) CIRCLESformsMETHODfixedpointsLIST();
              else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app );
          }
     }
}

function CIRCLESformsMETHODfixedpointsADD( _opcode, _edit_id, _list_row_index, _input_entity, _silent, _out_channel )
{
     _opcode = safe_float( _opcode, 0 );
     _input_entity = safe_string( _input_entity, "" );
     _silent = safe_int( _silent, NO );
     _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
     var ENTITY = "" ; // it might be a word or a complex number
     if ( _opcode == 1 ) // from the edit at the top | ADD
     ENTITY = $( "#ALGEBRAICfixedpointsINPUTedit" ).val();
     else if ( _opcode == 2 ) // from the edit at each row | UPDATE
     ENTITY = $( "#" + _edit_id ).val();
     else if ( _opcode == 3 ) // from input param
     ENTITY = _input_entity ;
     if ( _opcode == 0 )
     {
         var _msg = "Missing operation code" ;
         if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
         return [ RET_MSG_ID_WARNING, _msg ] ;
     }
     else if ( _opcode == 2 && _glob_input_fixed_pts_array[ _list_row_index ] == null )
     {
         var _msg = "Missing element reference" ;
         if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
         return [ RET_MSG_ID_WARNING, _msg ] ;
     }
     else if ( ENTITY.length == 0 )
     {
         var _msg = "Missing input word" ;
         if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
         return [ RET_MSG_ID_WARNING, _msg ] ;
     }
     else
     {
         var _ret_chunk = circles_lib_fixedpoints_add( _opcode, ENTITY, null, _list_row_index, _out_channel );
         var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
         var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
         if ( _ret_id == RET_OK ) CIRCLESformsMETHODfixedpointsLIST();
         else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app );
     }
}

function CIRCLESformsMETHODfixedpointsDELETE( _index, _question, _silent, _out_channel )
{
    _index = safe_int( _index, UNDET );
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _fp_n = circles_lib_count_fixed_points();
    if ( _fp_n == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't delete: the list of input fixed points is already empty", _glob_app );
    else if ( _index == UNDET ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't delete: invalid entry reference", _glob_app );
    else
    {
        var _word = _glob_input_fixed_pts_array[_index][0] ;
        var _b_go = _question ? confirm( "Confirm to delete the entry '"+_word+"' of this list ?" ) : YES ;
        if ( _b_go )
        {
            var _ret_chunk = circles_lib_fixedpoints_delete( _index, _out_channel );
            var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
            var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
            if ( _ret_id == RET_OK ) CIRCLESformsMETHODfixedpointsLIST();
            else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app );
        }
    }
}

function CIRCLESformsMETHODfixedpointsCONNECT( _plane_type, _clean, _showtext, _question, _silent, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    var _ret_chunk = circles_lib_fixedpoints_connect( _plane_type, _clean, _showtext, _out_channel )
    var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
    var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
    if ( _ret_id != RET_OK ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app );
}

function CIRCLESformsMETHODfixedpointsLOCALIZE( _i, _plane_type, _clean, _showtext, _question, _silent, _out_channel )
{
    _plane_type = circles_lib_return_plane_type( _plane_type ) ;
    var _ret_chunk = circles_lib_fixedpoints_locate( _i, _plane_type, _clean, _showtext, _out_channel );
    var _ret_id = safe_int( _ret_chunk[0], RET_WARNING );
    var _ret_msg = safe_string( _ret_chunk[1], _ERR_00_00 );
    if ( _ret_id != RET_OK ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ret_msg, _glob_app );
}

function CIRCLESformsMETHODfixedpointsDELETEfixedPTS( _type, _question, _silent, _out_channel )
{
    _type = safe_int( _type, FIXEDPOINT_SINK );
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _def = circles_lib_fixedpoints_get_def(_type);
    var _fp_n = circles_lib_count_fixed_points();
    if ( _fp_n == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't remove "+_def+" fixed points: the list is empty.", _glob_app );
    else
    {
        var _msg = "Do you confirm to remove all "+_def+" fixed points from this list ?" ;
        if ( confirm( _msg ) )
        {
             var _n_removed = 0 ;
             for( var _i = 0 ; _i < _fp_n ; _i++ )
             {
                 if ( _glob_input_fixed_pts_array[_i][2] == _type )
                 {
                     _n_removed++ ;
                     _glob_input_fixed_pts_array.remove( _i, _i );
                     _i = -1 ;
                     _fp_n = circles_lib_count_fixed_points();
                 }
             }

             var _n_kept = circles_lib_count_fixed_points();
             if ( _n_removed == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "No "+_def+" fixed points type have been removed", _glob_app );
             else
             {
                 var _msg = _n_kept + " fixed point" + ( _n_kept == 1 ? "" : "s" ) + " ha" + ( _n_kept == 1 ? "s" : "ve" ) + " been kept" ;
                     _msg += _glob_crlf + _n_removed + " " + _def + " fixed point" + ( _n_removed == 1 ? "" : "s" ) + " ha" + ( _n_kept == 1 ? "s" : "ve" ) + " been removed" ;
                 circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
                 CIRCLESformsMETHODfixedpointsLIST();
             }
        }
    }
}

function CIRCLESformsMETHODfixedpointsKEEPfixedPTS( _type, _question, _silent, _out_channel )
{
    _type = safe_int( _type, FIXEDPOINT_SINK );
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _def = circles_lib_fixedpoints_get_def(_type);
    var _fp_n = circles_lib_count_fixed_points();
    if ( _fp_n == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Can't keep "+_def+" fixed points: the list is empty.", _glob_app );
    else
    {
         var _msg = "Do you confirm to keep all "+_def+" fixed points in this list ?" ;
         var _n_removed = 0 ;
         if ( confirm( _msg ) )
         {
            for( var _i = 0 ; _i < _fp_n ; _i++ )
            {
                if ( _glob_input_fixed_pts_array[_i][2] != _type )
                {
                    _n_removed++ ;
                    _glob_input_fixed_pts_array.remove( _i, _i );
                    _i = -1 ;
                    _fp_n = circles_lib_count_fixed_points();
                }
            }
               
            var _n_kept = circles_lib_count_fixed_points();
            if ( _n_kept == 0 ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "No "+_def+" fixed points type have been kept", _glob_app );
            else
            {
                 var _msg = _n_kept + " " + _def + " fixed point" + ( _n_kept == 1 ? "" : "s" ) + " ha" + ( _n_kept == 1 ? "s" : "ve" ) + " been kept" ;
                 _msg += _glob_crlf + _n_removed + " fixed point" + ( _n_removed == 1 ? "" : "s" ) + " ha" + ( _n_kept == 1 ? "s" : "ve" ) + " been removed" ;
                 circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app );
                 CIRCLESformsMETHODfixedpointsLIST();
            }
         }
    }
}

function CIRCLESformsMETHODfixedpointsDELETESELECTED( _question, _silent, _out_channel )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _selected_array = $( "[id^=FIXEDPOINTScheckboxENTRY_]" ).filter( ":checked" ), _c ;
    var _n_sel = safe_size( _selected_array, 0 ), _fp_n = circles_lib_count_fixed_points();
    if ( _n_sel > 0 )
    {
        var _b_go = _question ? confirm( "Do you confirm the deletion of "+_n_sel+" selected item"+( _n_sel == 1 ? "" : "s" )+" ?" ) : YES ;
        if ( _b_go )
        {
            $.each( _selected_array,
                    function( _i, _checkbox )
                    {
                        var _index = safe_int( _checkbox.id.replaceAll( "FIXEDPOINTScheckboxENTRY_", "" ), UNDET );
                        var _hash = $( "#ALGEBRAICfixedpointsHASH" + _index ).val();
                        _fp_n = circles_lib_count_fixed_points();
                        for( _c = 0 ; _c < _fp_n ; _c++ )
                        {
                             if ( _glob_input_fixed_pts_array[_c][3].strcmp( _hash ) )
                             {
                                  _glob_input_fixed_pts_array.remove( _c, _c );
                                  _c = -1 ;
                                  break ;
                             }
                        }
                    } );

            CIRCLESformsMETHODfixedpointsLIST();
        }
    }
    else if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing selected items to delete", _glob_app );
}

function CIRCLESformsMETHODfixedpointsKEEPSELECTED( _question, _silent, _out_channel )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _selected_array = $( "[id^=FIXEDPOINTScheckboxENTRY_]" ).filter( ":checked" );
    var _n_sel = safe_size( _selected_array, 0 );
    var _fp_n = circles_lib_count_fixed_points();
    if ( _n_sel > 0 )
    {
        var _b_go = _question ? confirm( "Do you confirm to keep "+_n_sel+" selected item"+( _n_sel == 1 ? "" : "s" )+" ?" ) : YES ;
        if ( _b_go )
        {
            // gather all hashings to keep into one array
            var _hashes = [], _hash ;
            $.each( _selected_array,
                    function( _i, _checkbox )
                    {
                        var _index = _checkbox.id.replaceAll( "FIXEDPOINTScheckboxENTRY_", "" );
                        _hashes.push( "HASH" + _index );
                    }
                  );

            for( var _i = 0 ; _i < _fp_n ; _i++ )
            {
                 _hash = _glob_input_fixed_pts_array[_i][3] ;
                 if ( !_hashes.includes( _hash ) )
                 {
                      _glob_input_fixed_pts_array.remove( _i, _i );
                      _i = -1 ;
                      _fp_n = circles_lib_count_fixed_points();
                 }
            }

            CIRCLESformsMETHODfixedpointsLIST();
        }
    }
    else if ( !_silent && _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Missing selected items to keep", _glob_app );
}

function CIRCLESformsMETHODfixedpointsDELETEcombo( _index )
{
    _index = safe_int( _index, 0 );
    switch( _index )
    {
        case 1: CIRCLESformsMETHODfixedpointsDELETESELECTED(); break ;
        case 2: CIRCLESformsMETHODfixedpointsDELETEfixedPTS(FIXEDPOINT_SINK); break ;
        case 3: CIRCLESformsMETHODfixedpointsDELETEfixedPTS(FIXEDPOINT_SOURCE); break ;
        case 4: CIRCLESformsMETHODfixedpointsDELETEfixedPTS(FIXEDPOINT_NEUTRAL); break ;
        default: break ;
    }
}

function CIRCLESformsMETHODfixedpointsKEEPcombo( _index )
{
    _index = safe_int( _index, 0 );
    switch( _index )
    {
        case 1: CIRCLESformsMETHODfixedpointsKEEPSELECTED(); break ;
        case 2: CIRCLESformsMETHODfixedpointsKEEPfixedPTS(FIXEDPOINT_SINK); break ;
        case 3: CIRCLESformsMETHODfixedpointsKEEPfixedPTS(FIXEDPOINT_SOURCE); break ;
        case 4: CIRCLESformsMETHODfixedpointsKEEPfixedPTS(FIXEDPOINT_NEUTRAL); break ;
        default: break ;
    }
}

function CIRCLESformsMETHODfixedpointsFIGUREScombo( _index )
{
    _index = safe_int( _index, 0 );
    switch( _index )
    {
        case 1: CIRCLESformsMETHODfixedpointsFIGURES(Z_PLANE); break ;
        case 2: CIRCLESformsMETHODfixedpointsFIGURES(W_PLANE); break ;
        default: break ;
    }
}

function CIRCLESformsMETHODfixedpointsCONNECTcombo( _index )
{
    _index = safe_int( _index, 0 );
    var _clean = $( "#ALGEBRAICfixedpointsCLEANcheckbox" ).is( ":checked" ) ? YES : NO ;
    var _showtext = $( "#ALGEBRAICfixedpointsSHOWTEXTcheckbox" ).is( ":checked" ) ? YES : NO ;
    switch( _index )
    {
        case 1: CIRCLESformsMETHODfixedpointsCONNECT(Z_PLANE,_clean,_showtext); break ;
        case 2: CIRCLESformsMETHODfixedpointsCONNECT(W_PLANE,_clean,_showtext); break ;
        default: break ;
    }
}

function CIRCLESformsMETHODfixedpointsLOCALIZEcombo( _index )
{
    _index = safe_int( _index, 0 );
    var _clean = $( "#ALGEBRAICfixedpointsCLEANcheckbox" ).is( ":checked" ) ? YES : NO ;
    var _showtext = $( "#ALGEBRAICfixedpointsSHOWTEXTcheckbox" ).is( ":checked" ) ? YES : NO ;
    switch( _index )
    {
        case 1: CIRCLESformsMETHODfixedpointsLOCALIZE(UNDET,Z_PLANE,_clean,_showtext); break ;
        case 2: CIRCLESformsMETHODfixedpointsLOCALIZE(UNDET,W_PLANE,_clean,_showtext); break ;
        default: break ;
    }
}

function CIRCLESformsMETHODfixedpointsFILLcombo( _index )
{
    _index = safe_int( _index, 0 );
    switch( _index )
    {
        case 1: CIRCLESformsMETHODfixedpointsCOMMUTATORS(); break ;
        case 2: CIRCLESformsMETHODfixedpointsWORDSfromGENERATORSSET(); break ;
        case 3: CIRCLESformsMETHODfixedpointsSEEDS(); break ;
        default: break ;
    }
}

function CIRCLESformsMETHODfixedpointsBUTTONBAR1( _mask )
{
     _mask = safe_int( _mask, 0 );
     var _html_code = "" ;
     if ( _mask == 0 || _mask & 1 )
     {
        _html_code += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        _html_code += "<tr><td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"padding:5px;background-color:#EAEAEA;\">" ;
        _html_code += "<table>" ;
        _html_code += "<tr>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td>Word, P/Q word, Repetend or Complex number</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td><INPUT ID=\"ALGEBRAICfixedpointsINPUTedit\" TYPE=\"edit\" STYLE=\"width:160px;\" ONKEYUP=\"javascript:CIRCLESformsMETHODeventsHANDLER( this.id, event,1,'',0,'',NO);\"></td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:var _ret=CIRCLESformsMETHODfixedpointsADD(1,'',0,'',NO);if(_ret)CIRCLESformsMETHODfixedpointsLIST();\">Add</td>" ;
        _html_code += "</tr>" ;
        _html_code += "</table>" ;
        _html_code += "</td></tr>" ;
     }

     if ( _mask == 0 || _mask & 2 || _mask & 4 )
     {
        _html_code += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        _html_code += "<tr><td VALIGN=\"top\" ALIGN=\"right\" CLASS=\"general_rounded_corners\" STYLE=\"padding:5px;background-color:#E8E8E8;\">" ;
        _html_code += "<table ALIGN=\"right\">" ;
        _html_code += "<tr>" ;
        _html_code += "<td>Keep</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td><SELECT ID=\"ALGEBRAICfixedpointsKEEPcombo\" ONCHANGE=\"javascript:CIRCLESformsMETHODfixedpointsKEEPcombo( this.value );\">" ;
        _html_code += "<OPTION VALUE=\"0\"></OPTION>" ;
        _html_code += "<OPTION VALUE=\"1\">Selected</OPTION>" ;
        _html_code += "<OPTION VALUE=\"2\">Sinks</OPTION>" ;
        _html_code += "<OPTION VALUE=\"3\">Sources</OPTION>" ;
        _html_code += "<OPTION VALUE=\"4\">Neutrals</OPTION>" ;
        _html_code += "</SELECT></td>" ;
        _html_code += "<td WIDTH=\"15\"></td>" ;
        _html_code += "<td>Delete</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td><SELECT ID=\"ALGEBRAICfixedpointsDELETEcombo\" ONCHANGE=\"javascript:CIRCLESformsMETHODfixedpointsDELETEcombo( this.value );\">" ;
        _html_code += "<OPTION VALUE=\"0\"></OPTION>" ;
        _html_code += "<OPTION VALUE=\"1\">Selected</OPTION>" ;
        _html_code += "<OPTION VALUE=\"2\">Sinks</OPTION>" ;
        _html_code += "<OPTION VALUE=\"3\">Sources</OPTION>" ;
        _html_code += "<OPTION VALUE=\"4\">Neutrals</OPTION>" ;
        _html_code += "</SELECT></td>" ;
        _html_code += "<td WIDTH=\"15\"></td>" ;
        _html_code += "<td>Figures</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td><SELECT ID=\"ALGEBRAICfixedpointsFIGUREScombo\" ONCHANGE=\"javascript:CIRCLESformsMETHODfixedpointsFIGUREScombo( this.value );\">" ;
        _html_code += "<OPTION VALUE=\"0\"></OPTION>" ;
        _html_code += "<OPTION VALUE=\"1\">Z-plane</OPTION>" ;
        _html_code += "<OPTION VALUE=\"2\">W-plane</OPTION>" ;
        _html_code += "</SELECT></td>" ;
        if ( _mask == 0 || _mask & 4 )
        {
          _html_code += "<td WIDTH=\"15\"></td>" ;
          _html_code += "<td>Fill</td>" ;
          _html_code += "<td WIDTH=\"3\"></td>" ;
          _html_code += "<td><SELECT ID=\"ALGEBRAICfixedpointsFILLcombo\" ONCHANGE=\"javascript:CIRCLESformsMETHODfixedpointsFILLcombo( this.value );\">" ;
          _html_code += "<OPTION VALUE=\"0\"></OPTION>" ;
          _html_code += "<OPTION VALUE=\"1\">Commutators</OPTION>" ;
          _html_code += "<OPTION VALUE=\"2\">Gens set</OPTION>" ;
          _html_code += "<OPTION VALUE=\"3\">Seeds</OPTION>" ;
          _html_code += "</SELECT></td>" ;
        }
        _html_code += "</tr>" ;
        _html_code += "</table>" ;
        _html_code += "</td></tr>" ;

        _html_code += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        _html_code += "<tr><td VALIGN=\"top\" ALIGN=\"right\" CLASS=\"general_rounded_corners\" STYLE=\"padding:5px;background-color:#E8E8E8;\">" ;
        _html_code += "<table ALIGN=\"right\">" ;
        _html_code += "<tr>" ;
        _html_code += "<td>Add both fixed pts if distance is &gt;</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td><INPUT TYPE=\"edit\" ONBLUR=\"javascript:this.value=_glob_method_fp_dist_tolerance;\" ONKEYUP=\"javascript:_glob_method_fp_dist_tolerance=Math.abs(safe_float(this.value,0));\" STYLE=\"width:70px;\" VALUE=\""+_glob_method_fp_dist_tolerance+"\"></td>" ;
        _html_code += "<td WIDTH=\"25\"></td>" ;
        _html_code += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsMETHODfixedpointsSORTcircularPATH();CIRCLESformsMETHODfixedpointsLIST(YES);\">Circular sort</td>" ;
        _html_code += "<td WIDTH=\"25\"></td>" ;
        _html_code += "<td>List</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsMETHODfixedpointsLIST(YES);\">Short</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsMETHODfixedpointsLIST(NO);\">Full</td>" ;
        _html_code += "<td WIDTH=\"15\"></td>" ;
        _html_code += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsMETHODfixedpointsBOMB();\">Bomb</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "</tr>" ;
        _html_code += "</table>" ;
        _html_code += "</td></tr>" ;
     }

    return _html_code ;
}

function CIRCLESformsMETHODfixedpointsBUTTONBAR2()
{
    var _html_code  = "<tr><td HEIGHT=\"1\"></td></tr>" ;
        _html_code += "<tr><td VALIGN=\"top\" ALIGN=\"right\" CLASS=\"general_rounded_corners\" STYLE=\"padding:5px;background-color:#E8E8E8;\">" ;
        _html_code += "<table>" ;
        _html_code += "<tr>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td>Show text</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td><INPUT TYPE=\"checkbox\" ID=\"ALGEBRAICfixedpointsSHOWTEXTcheckbox\" ONCLICK=\"javascript:CIRCLESformsMETHODfixedpointsLOCALIZEcombo( $('#ALGEBRAICfixedpointsLOCALIZEcombo').val() );CIRCLESformsMETHODfixedpointsCONNECTcombo( $('#ALGEBRAICfixedpointsCONNECTcombo').val() );\"></td>" ;
        _html_code += "<td WIDTH=\"25\"></td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td>Clean</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td><INPUT TYPE=\"checkbox\" ID=\"ALGEBRAICfixedpointsCLEANcheckbox\" ONCLICK=\"javascript:CIRCLESformsMETHODfixedpointsLOCALIZEcombo( $('#ALGEBRAICfixedpointsLOCALIZEcombo').val() );CIRCLESformsMETHODfixedpointsCONNECTcombo( $('#ALGEBRAICfixedpointsCONNECTcombo').val() );\"></td>" ;
        _html_code += "<td WIDTH=\"25\"></td>" ;
        _html_code += "<td>Localize</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td><SELECT ID=\"ALGEBRAICfixedpointsLOCALIZEcombo\" ONCHANGE=\"javascript:CIRCLESformsMETHODfixedpointsLOCALIZEcombo( this.value );\">" ;
        _html_code += "<OPTION VALUE=\"0\"></OPTION>" ;
        _html_code += "<OPTION VALUE=\"1\">All / Z-plane</OPTION>" ;
        _html_code += "<OPTION VALUE=\"2\">All / W-plane</OPTION>" ;
        _html_code += "</SELECT></td>" ;
        _html_code += "<td WIDTH=\"15\"></td>" ;
        _html_code += "<td>Connect</td>" ;
        _html_code += "<td WIDTH=\"3\"></td>" ;
        _html_code += "<td><SELECT ID=\"ALGEBRAICfixedpointsCONNECTcombo\" ONCHANGE=\"javascript:CIRCLESformsMETHODfixedpointsCONNECTcombo( this.value );\">" ;
        _html_code += "<OPTION VALUE=\"0\"></OPTION>" ;
        _html_code += "<OPTION VALUE=\"1\">All / Z-plane</OPTION>" ;
        _html_code += "<OPTION VALUE=\"2\">All / W-plane</OPTION>" ;
        _html_code += "</SELECT></td>" ;
        _html_code += "<td WIDTH=\"15\"></td>" ;
        _html_code += "<td CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsMETHODfixedpointsLOCALIZEcombo( $('#ALGEBRAICfixedpointsLOCALIZEcombo').val() );CIRCLESformsMETHODfixedpointsCONNECTcombo( $('#ALGEBRAICfixedpointsCONNECTcombo').val() );\">Draw</td>" ;
        _html_code += "</tr>" ;
        _html_code += "</table>" ;
        _html_code += "</td></tr>" ;
        _html_code += "<tr><td HEIGHT=\"3\"></td></tr>" ;
    return _html_code ;
}

function CIRCLESformsMETHODfixedpointsSORTcircularPATH()
{
    var _points = _glob_input_fixed_pts_array, _i ;
    var _n = safe_size( _points, 0 ), _pt, _angle ;
    var _original_pts = [], _radians_array = [], _circular_path = [];
    for( _i = 0 ; _i < _n ; _i++ )
    {
        _pt = new complex( _points[_i][1].x, _points[_i][1].y );
        _angle = _pt.angle();
        _radians_array.push( _angle );
        _original_pts.push( [ _pt, _angle, _i ] );
    }

    _radians_array = _radians_array.sort( function( a, b ) { return b - a ; } );

    while( _radians_array.length > 0 )
    {
        var _rad = _radians_array[0], _pos ;
        for( _i = 0 ; _i < _original_pts.length ; _i++ )
        {
            if ( _original_pts[_i][1] == _rad )
            {
                 _pos = _original_pts[_i][2] ;
                 _circular_path.push( _glob_input_fixed_pts_array[_pos] );
                 break ;
            }
        }

        _radians_array.remove( 0, 0 );
    }

    _glob_input_fixed_pts_array = _circular_path.clone();
}

function CIRCLESformsMETHODfixedpointsLIST( _short )
{
    var _items_array = _glob_seeds_array ;
    var _items_n = circles_lib_count_items( _items_array ) ;
    var _short = safe_int( _short, YES );
    var _fp_n = circles_lib_count_fixed_points(), _html_code ;
    if ( _glob_fixedpt_io == FIXEDPOINTS_IO_INPUT )
    {
        _html_code = "<table WIDTH=\"auto\">" ;
        _html_code += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        _html_code += CIRCLESformsMETHODfixedpointsBUTTONBAR1( _fp_n == 0 ? 1 : 0 );
        _html_code += "<tr><td HEIGHT=\"1\"></td></tr>" ;
        _html_code += "<tr><td VALIGN=\"top\">" ;
        if ( _fp_n > 8 ) _html_code += "<DIV STYLE=\"position:relative;width:auto;height:150px;overflow:auto;padding:2px;\">" ;
        if ( _fp_n == 0 )
        {
           _html_code = "<table WIDTH=\"100%\" ALIGN=\"center\">" ;
           _html_code += "<tr><td HEIGHT=\"1\"></td></tr>" ;
           _html_code += CIRCLESformsMETHODfixedpointsBUTTONBAR1(1|4);
           _html_code += "<tr><td HEIGHT=\"12\"></td></tr>" ;
           _html_code += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:"+DEFAULT_COLOR_INFO_FOR_TEXT+";\" ALIGN=\"center\">The fixed points list is empty</td></tr>" ;
           _html_code += "<tr><td HEIGHT=\"12\"></td></tr>" ;
           _html_code += "<tr><td CLASS=\"link\" ALIGN=\"center\" STYLE=\"font-size:12pt;color:lightblue;\" ONCLICK=\"javascript:_glob_process=PROCESS_RANDOM;_glob_fixedpt_io=FIXEDPOINTS_IO_INPUT;circles_lib_popup_load('forms','method',NO,3,_glob_method,null);\">Reload or fill it</td></tr>" ;
           _html_code += "<tr><td HEIGHT=\"12\"></td></tr>" ;
           _html_code += "</table>" ;
        }
        else
        {
           _html_code += "<table WIDTH=\"auto\">" ;
           _html_code += "<tr><td HEIGHT=\"4\"></td></tr>" ;
           _html_code += "<tr>" ;
           _html_code += "<td COLSPAN=\"4\"></td>" ;
           _html_code += "<td WIDTH=\"160\">Word, P/Q word, Repetend or Complex number</td>" ;
           if ( !_short )
           {
              _html_code += "<td WIDTH=\"3\"></td>" ;
              _html_code += "<td ALIGN=\"center\" STYLE=\"color:#0080DC;\">Trace</td>" ;
              _html_code += "<td WIDTH=\"3\"></td>" ;
              _html_code += "<td ALIGN=\"center\" STYLE=\"color:#0080DC;\">Value</td>" ;
           }
           _html_code += "<td WIDTH=\"8\"></td>" ;
           _html_code += "<td ALIGN=\"center\">Type</td>" ;
           _html_code += "<td WIDTH=\"8\"></td>" ;
           _html_code += "<td ALIGN=\"center\" COLSPAN=\"5\">Actions</td>" ;
           _html_code += "<td COLSPAN=\"3\"></td>" ;
           _html_code += "<td ALIGN=\"center\"><INPUT TYPE=\"checkbox\" ID=\"FIXEDPOINTScheckboxALL\" ONCLICK=\"javascript:$( '[id^=FIXEDPOINTScheckboxENTRY_]' ).prop( 'checked', this.checked );\"></td>" ;
           _html_code += "</tr>" ;
           _html_code += "<tr><td HEIGHT=\"3\"></td></tr>" ;
           $.each( _glob_input_fixed_pts_array,
                   function( _i, _val )
                   {
                      if ( is_array( _val ) )
                      {
                          var _is_repetend = circles_lib_repetends_check_syntax( null, _val[0] ) ? YES : NO ;
                          var _is_pqword = _val[0].testME( _glob_pqword_regex_pattern );
                          var _is_word = circles_lib_word_check( _val[0], _glob_alphabet );
                          var _WORD = "" ;
                          if ( _is_repetend ) _WORD = circles_lib_repetends_resolve( _val[0] );
                          else if ( _is_pqword ) _WORD = circles_lib_word_pq_translate( ( _val[0].split( "/" ) )[0], ( _val[0].split( "/" ) )[1] );
                          else _WORD = _val[0] ;

                          var _type = safe_int( _val[2], 0 );
                          var _type_def = circles_lib_fixedpoints_get_def( _type );
                          var _mm = ( _is_repetend || _is_pqword || _is_word ) ? circles_lib_word_mobiusmap_get( _WORD, _items_array ) : null ;
                          var _trace = is_mobius_map( _mm ) ? _mm.trace().formula() : parse_complex_from_string( _WORD + "" ).formula();

                          _html_code += "<tr>" ;
                          _html_code += "<INPUT TYPE=\"hidden\" VALUE=\""+_val[3]+"\"ID=\"ALGEBRAICfixedpointsHASH"+_i+"\">" ;
                          _html_code += "<td VALIGN=\"top\" WIDTH=\"10\" ID=\"ALGEBRAICfixedpointsLISTresponse"+_i+"\"></td>" ;
                          _html_code += "<td WIDTH=\"3\"></td>" ;
                          _html_code += "<td VALIGN=\"middle\">#"+(_i+1)+"</td>" ;
                          _html_code += "<td WIDTH=\"3\"></td>" ;
                          _html_code += "<td VALIGN=\"top\"><INPUT TYPE=\"edit\" ID=\"ALGEBRAICfixedpointsLISTedit"+_i+"\" ONKEYUP=\"javascript:CIRCLESformsMETHODeventsHANDLER( this.id, event, 2, "+_i+", this.value, YES );\" STYLE=\"width:160px;\" VALUE=\""+_val[0]+"\"></td>" ;
                          if ( !_short )
                          {
                             _html_code += "<td WIDTH=\"3\"></td>" ;
                             _html_code += "<td VALIGN=\"middle\" CLASS=\"link\" STYLE=\"font-size:7pt;color:#0080DC;\" ONCLICK=\"javascript:CIRCLESformsMETHODvalDISPLAY('"+_i+"','"+_trace+"','Trace');\">display</td>" ;
                             _html_code += "<td WIDTH=\"3\"></td>" ;
                             _html_code += "<td VALIGN=\"middle\" CLASS=\"link\" STYLE=\"font-size:7pt;color:#0080DC;\" ONCLICK=\"javascript:CIRCLESformsMETHODvalDISPLAY('"+_i+"','"+_val[1].x+"i"+_val[1].y+"','Fixed point');\">display</td>" ;
                          }
                          _html_code += "<td WIDTH=\"8\"></td>" ;
                          _html_code += "<td VALIGN=\"middle\" STYLE=\"font-size:7pt;\">"+_type_def+"</td>" ;
                          _html_code += "<td WIDTH=\"4\"></td>" ;
                          _html_code += "<td VALIGN=\"middle\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsMETHODfixedpointsLOCALIZE("+_i+",Z_PLANE);\"><IMG TITLE=\"Localize on the Z-plane\" SRC=\"support/img/icons/target/target.icon.01.12x12.png\"></td>" ;
                          _html_code += "<td WIDTH=\"3\"></td>" ;
                          _html_code += "<td VALIGN=\"middle\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsMETHODfixedpointsLOCALIZE("+_i+",W_PLANE);\"><IMG TITLE=\"Localize on the W-plane\" SRC=\"support/img/icons/target/target.icon.02.12x12.png\"></td>" ;
                          _html_code += "<td WIDTH=\"3\"></td>" ;
                          _html_code += "<td VALIGN=\"middle\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsMETHODfixedpointsDELETE("+_i+");\"><IMG TITLE=\"Delete\" SRC=\"support/img/icons/delete/delete.icon.12x12.png\"></td>" ;
                          _html_code += "<td WIDTH=\"3\"></td>" ;
                          _html_code += "<td VALIGN=\"middle\" WIDTH=\"12\">"+( ( _is_repetend || _is_pqword || _is_word ) ? "<IMG CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsMETHODfixedpointsRESOLVEword("+_i+");\" TITLE=\"Resolve repetend '"+_val[0]+"'\" SRC=\"support/img/icons/binoculars/binoculars.icon.01.16x16.png\">" : "" )+"</td>" ;
                          _html_code += "<td WIDTH=\"8\"></td>" ;
                          _html_code += "<td ALIGN=\"center\"><INPUT TYPE=\"checkbox\" ID=\"FIXEDPOINTScheckboxENTRY_"+_i+"\" ONCLICK=\"javascript:if(!this.checked)$( '#FIXEDPOINTScheckboxALL' ).prop( 'checked', false );\"></td>" ;
                          _html_code += "<td WIDTH=\"8\"></td>" ;
                          if ( _i > 0 && _i < _fp_n )
                             _html_code += "<td WIDTH=\"16\" ALIGN=\"center\" CLASS=\"link\" ONCLICK=\"javascript:_glob_input_fixed_pts_array.swap( "+(_i-1)+", "+(_i)+" );CIRCLESformsMETHODfixedpointsLIST( "+_short+" )\"><IMG TITLE=\"Swap up\" SRC=\"support/img/icons/arrows/single/arrow.up.01.16x16.png\"></td>" ;
                          else _html_code += "<td WIDTH=\"16\"></td>" ;

                                    _html_code += "<td WIDTH=\"8\"></td>" ;
                                if ( _i >= 0 && _i < _fp_n - 1 )
                                    _html_code += "<td WIDTH=\"16\" ALIGN=\"center\" CLASS=\"link\" ONCLICK=\"javascript:_glob_input_fixed_pts_array.swap( "+(_i)+", "+(_i+1)+" );CIRCLESformsMETHODfixedpointsLIST( "+_short+" )\"><IMG TITLE=\"Swap down\" SRC=\"support/img/icons/arrows/single/arrow.down.01.16x16.png\"></td>" ;
                                else _html_code += "<td WIDTH=\"16\"></td>" ;
                                
                                _html_code += "</tr>" ;
                                _html_code += "<tr><td HEIGHT=\"1\"></td></tr>" ;
                                _html_code += "<tr><td COLSPAN=\"4\"></td><td COLSPAN=\"16\" ID=\"ALGEBRAICfixedpointsLISTwork"+_i+"\" STYLE=\"display:none;\"></td></tr>" ;
                                _html_code += "<tr><td HEIGHT=\"1\"></td></tr>" ;
                      }
                      else _html_code += "<tr><td>Invalid entry #"+ ( _i + 1 ) + "</td></tr>" ;
                   }
             );

             _html_code += "</td></tr>" ;
             _html_code += "<tr><td HEIGHT=\"1\"></td></tr>" ;
             _html_code += "</table>" ;
             _html_code += CIRCLESformsMETHODfixedpointsBUTTONBAR2();
        }

        if ( _fp_n > 8 ) _html_code += "</DIV>" ;
        _html_code += "</table>" ;
     }

     $( "#ALGEBRAICfixedpointsPANELcontainer" ).css( "color", DEFAULT_COLOR_STD ).html( _html_code ).show();
}