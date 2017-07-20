function CIRCLESembeddingsGENERALPURPOSE_COMMENT()
{
    $('#PLUGINcommentLABEL').html( CIRCLESembeddingsGENERALPURPOSEcomment.length > 0 ? 'Here\'s some comment' : 'Write some comment here below' );
    CIRCLESembeddingsGENERALPURPOSEcomment = $( "#PLUGINcommentTEXTAREA" ).val();
}

function CIRCLESembeddingsGENERALPURPOSE_TIPS()
{
    var _index_ref = _plugin_last_ref;
    var _tips = [];
        _tips.push( "- For faster inputs, write one row with multiple params,\nseparared by comma, and type enter." );
        _tips.push( _glob_crlf );
        _tips.push( "- Mathematical functions available here for input params formulas:" );
        _tips.push( ( [ "abs","acos","arg","asin","atan","atan2","conj","cos","cosh","cot" ] ).join( ", " ) );
        _tips.push( ( [ "coth","csc","csch", "exp", "log","log10","sec","sech","sin","sinh", "tan","tanh" ] ).join( ", " ) );
    alert_msg( ALERT_INFO, _tips.join( "<br>" ), _glob_app + " - " + _plugin_definitions_array[_plugin_last_ref] + " - Tips", 400 );
}

function CIRCLESembeddingsGENERALPURPOSE_DEFAULT( _initialize )
{
    var _index_ref = _plugin_last_ref;
    _initialize = safe_int( _initialize, NO );
		CIRCLESembeddingsGENERALPURPOSEcurr_sel = UNDET ;
    $("#PLUGIN_PARAM_A").val( "" );
    $("#PLUGIN_PARAM_B").val( "" );
    $("#PLUGIN_PARAM_C").val( "" );
    $("#PLUGIN_PARAM_D").val( "" );
    $("#PLUGIN_LIST_CONTAINER").html( "" );

    $("#PLUGIN_GENERATE_GROUP_BTN").css( "color", DEFAULT_COLOR_STD );
    if ( $("#PLUGINrenderBTN").get(0) != null ) $("#PLUGINrenderBTN").get(0).setAttribute( "class", "link" );
    $("[id$=initBTN]").css( "color", DEFAULT_COLOR_STD );
    $("[id$=renderBTN]").css( "color", DEFAULT_COLOR_STD );
    if ( is_array( CIRCLESembeddingsGENERALPURPOSE_gens_container ) && _initialize )
    {
        _plugin_rec_configs_array[ _index_ref ] = [] ;
        CIRCLESembeddingsGENERALPURPOSE_gens_container = [] ;
        circles_lib_reset_vars( RESET_PLUGINS, YES );
    }
}

function CIRCLESembeddingsGENERALPURPOSE_CLEAN( _question, _silent )
{
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
		if ( _question ? confirm( "Confirm to clean all input boxes ?" ) : YES )
    {
        CIRCLESembeddingsGENERALPURPOSE_VAR_REFRESH_PANEL();
        CIRCLESembeddingsGENERALPURPOSE_DEFAULT( NO );
    }
}

function CIRCLESembeddingsGENERALPURPOSE_BOMB( _question, _silent )
{
		_question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    if ( safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 ) > 0 )
    {
        var _question = "Confirm to delete all gens ?" + _glob_crlf + "(All data will be definitely lost)" ;
        if ( !_question ? YES : confirm( _question ) )
        {
            CIRCLESembeddingsGENERALPURPOSE_DEFAULT( YES );
            var _ok = safe_size( CIRCLESembeddingsGENERALPURPOSE_gens_container, 0 ) == 0 ? YES : NO ;
            var _msg = _ok ? "All gens have been deleted with success" : "Failure in deleting all gens" ;
					  circles_lib_output( OUTPUT_SPECIAL_FX, _ok ? DISPATCH_SUCCESS : DISPATCH_WARNING, _msg, 'PLUGIN_OUTMSG' ) ;
            return [ _ok ? RET_OK : RET_ERROR, _msg ] ;
        }
        else return [ RET_IRRELEVANT, "Gens bombing has been halted by user" ] ; 
    }
    else
    {
        var _msg = "Bombing failed: no gens have been registered yet" ;
        circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, _msg, 'PLUGIN_OUTMSG' ) ;
        return [ RET_WARNING, _msg ] ;
    }
}