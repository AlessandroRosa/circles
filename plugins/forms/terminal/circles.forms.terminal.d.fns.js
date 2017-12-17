function CIRCLESformsTERMINALhistorySETcmd( _cmd ) { _glob_terminal.exec( _cmd, 0 ); }
function CIRCLESformsTERMINALbatchcompilerFOCUS( _suffix ) { $("#CIRCLESbatchcompilerTEXT" + _suffix ).focus(); }
function CIRCLESformsTERMINALbatchcompilerCLOSE( _suffix ) { _glob_terminal_codelist = $("#CIRCLESbatchcompilerTEXT" + _suffix ).val(); }

function CIRCLESformsTERMINALpurgeCMDS( _suffix, _output_id )
{
	_output_id = safe_int( _output_id, 0 );
    _suffix = safe_string( _suffix, _glob_terminal_form_suffix );
	var _n_commands = safe_size( _glob_code_run_cmds_array, 0 );
	var _OUT_CTRLID = "" ;
	switch( _output_id )
	{
		case 0:
		_OUT_CTRLID = "CIRCLESTERMINAL_TAB_01_BAR_OUTPUT" ;
		break ;
		case 1:
		_OUT_CTRLID = "BATCHscriptOUTPUT" ;
		break ;
		case 2:
		_OUT_CTRLID = "CIRCLESTERMINAL_TAB_03_BAR_OUTPUT" ;
		break ;
		default:
		_OUT_CTRLID = "CIRCLESTERMINAL_TAB_01_BAR_OUTPUT" ;
		break ;
	}

	if( _n_commands > 0 )
	{
		var _btns_id = [ "CIRCLESTERMINAL_TAB_01_BAR_PURGE_BTN", "CIRCLESTERMINAL_TAB_02_BAR_PURGE_BTN", "CIRCLESTERMINAL_TAB_03_BAR_PURGE_BTN" ] ;
		$.each( _glob_code_run_cmds_array, function( _i, _cmd_tag ) { circles_lib_unload_cmd( _cmd_tag ) ; } );
        _glob_code_run_cmds_array.flush();
		_n_commands = safe_size( _glob_code_run_cmds_array, 0 );
		if ( _n_commands == 0 )
		{
			$.each( _btns_id, function( _i, _ctrl_id ) {
					if ( $( "#" + _ctrl_id + _suffix ).get(0) != null )
					{
				    	$( "#" + _ctrl_id + _suffix ).get(0).setAttribute( "class", _n_commands > 0 ? "link_rounded" : "linkdead" );
				        $( "#" + _ctrl_id + _suffix ).css( "display", _n_commands > 0 ? "block" : "none" ) ;
				        $( "#" + _ctrl_id + _suffix ).get(0).onclick = _n_commands > 0 ? function() { CIRCLESformsTERMINALpurgeCMDS(_suffix,_i); } : function() {} ;
					} } ) ;
			circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_SUCCESS, "All commands have been purged from memory", _OUT_CTRLID + _suffix ) ;
		}
		else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "Fail to purge all commands from memory", _OUT_CTRLID + _suffix ) ;
	}
	else circles_lib_output( OUTPUT_SPECIAL_FX, DISPATCH_WARNING, "No cmds saved in memory", _OUT_CTRLID + _suffix ) ;
}

function CIRCLESformsTERMINALpurgecmdUPDATEstatus( _suffix )
{
	var _n_commands = safe_size( _glob_code_run_cmds_array, 0 );
	var _btns_id = [ "CIRCLESTERMINAL_TAB_01_BAR_PURGE_BTN", "CIRCLESTERMINAL_TAB_02_BAR_PURGE_BTN", "CIRCLESTERMINAL_TAB_03_BAR_PURGE_BTN" ] ;
	$.each( _btns_id, function( _i, _ctrl_id ) {
			if ( $( "#" + _ctrl_id + _suffix ).get(0) != null )
		    {
		   	   $( "#" + _ctrl_id + _suffix ).get(0).setAttribute( "class", _n_commands > 0 ? "link_rounded" : "linkdead" );
		       $( "#" + _ctrl_id + _suffix ).css( "display", _n_commands > 0 ? "block" : "none" ) ;
	           $( "#" + _ctrl_id + _suffix ).get(0).onclick = _n_commands > 0 ? function() { CIRCLESformsTERMINALpurgeCMDS( _suffix, _i ); } : function() {} ;
		    } } ) ;
}

function CIRCLESformsTERMINALextractLISTING( _suffix )
{
    var _code = $("#CIRCLESbatchcompilerTEXT" + _suffix ).val();
    if ( _code.length > 0 )
    {
        var _MSG = "Before extracting the listing from the current config," ;
            _MSG += _glob_crlf + "take care that there is already some text" ;
            _MSG += _glob_crlf + "in the BATCH COMPILER tab." ;
        alert_set_btns_width( 110 );
        alert_plug_label( ALERT_YES, "Save it" );
        alert_plug_label( ALERT_NO, "Extract listing" );
        alert_plug_fn( ALERT_YES, "CIRCLESformsTERMINALbatchcompilerSAVEFILE('"+_suffix+"');alertCLOSE();" );
        alert_plug_fn( ALERT_NO, "alertCLOSE();circles_lib_terminal_exec('code','',_glob_terminal,TERMINAL_SCRIPT_INPUT);" );
        alert_plug_fn( ALERT_CANCEL, "alertCLOSE();" );
        circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING | DISPATCH_YESNOCANCEL, _MSG, _glob_app_title );
    }
    else circles_lib_terminal_exec( 'code', '', _glob_terminal, TERMINAL_SCRIPT_INPUT );
}

function CIRCLESformsTERMINALhistoryGETHTML( _suffix )
{
	var _history_array = _glob_terminal.history().data().clone();
	_history_array = _history_array != null ? _history_array.reverse() : [] ;
	var _n_history = safe_size( _history_array, 0 ), HTMLcode = "", _cmd ;
	HTMLcode = "<table WIDTH=\"100%\">" ;
	if ( _n_history > 0 )
	{
		HTMLcode += "<tr><td STYLE=\"padding:3px;\">Last "+_n_history+" command"+( _n_history != 1 ? "s" : "" )+" - Click on for activation</td></tr>" ;
		HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\"100%\">" ;
		HTMLcode += "<DIV STYLE=\"position:relative;width:100%;height:84px;overflow:auto;background-color:#EAEAEA;padding:3px;\" CLASS=\"general_rounded_corners\">" ;
		HTMLcode += "<table>" ;
		for( var _i = 0 ; _i < _n_history ; _i++ )
		{
			_cmd = _history_array[_i].trim();
			if ( _cmd.length > 0 ) HTMLcode += "<tr><td CLASS=\"link\" STYLE=\"padding-left:5px;\" ONCLICK=\"javascript:event.stopPropagation();CIRCLESformsTERMINALhistorySETcmd( '"+_cmd+"' );\">"+_cmd+"</td></tr>" ;
		}

		HTMLcode += "</table>" ;
		HTMLcode += "</DIV>" ;
		HTMLcode += "</td>" ;
		HTMLcode += "</tr>" ;
	}
	else HTMLcode += "<tr><td STYLE=\"padding:3px;\">History is empty</td></tr>" ;

	HTMLcode += "</table>" ;
	$("#TERMINALhistoryCONTAINER" + _suffix ).html( HTMLcode );
}

function CIRCLESformsTERMINALbatchcompilerHELPcmd( _cmd_name )
{
    _cmd_name = _cmd_name.toLowerCase();
    var _cmd_string = "circles_terminal_cmd_"+_cmd_name+"( '/h', "+OUTPUT_HELP+" )" ;
    eval( _cmd_string );
}

function CIRCLESformsTERMINALbatchcompilerSAVEFILE( _suffix )
{
    var _code = $("#CIRCLESbatchcompilerTEXT" + _suffix ).val().trim();
    if ( _code.length > 0 )
    {
        var _filename = "listing.txt", _basename = basename( _filename );
  	    var _extension = _filename.includes( "." ) ? _filename.split( ".").get_last() : "" ;
  		    _filename = _glob_title.length > 0 ? ( _glob_title + "." + _basename + "." +  _extension ) : "circles." + _filename ;
        var blob = new Blob( [ _code ], { type: 'plain/text', endings: 'native' });
        saveAs( blob, _filename );
    }
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Fail to save code to a file: text is empty.", _glob_app_title );
}

function CIRCLESformsTERMINALdebugSAVEFILE( _suffix )
{
    var _div = $( "#CIRCLESdebugDIV" + _suffix ).get(0);
    if ( _div != null )
    {
        var _code = _div.innerHTML ;       _code = _code.trim();
            _code = _code.replaceAll( "&nbsp;", " " );
            _code = _code.replaceAll( "<br>", _glob_crlf );
            _code = _code.strip_tags();
        if ( _code.length > 0 )
        {
            var _filename = "listing.debug.txt", _basename = basename( _filename );
	        var _extension = _filename.includes( "." ) ? _filename.split( ".").get_last() : "" ;
			    _filename = _glob_title.length > 0 ? ( _glob_title + "." + _basename + "." +  _extension ) : "circles." + _filename ;
            var blob = new Blob( [ _code ], { type: 'plain/text', endings: 'native' });
            saveAs( blob, _filename );
        }
        else
        circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Fail to save debug report to a file: text is empty", _glob_app_title );
    }
}

function CIRCLESformsTERMINALbatchcompilerCLEANall( _question = 1, _silent = 0, _suffix = "" )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, YES );
    var _b_go = !_question ? YES : confirm( "Confirm to clean everything (code and debug) ?" );
    if ( _b_go )
    {
        CIRCLESformsTERMINALbatchcompilerCLEANcode( NO, YES, _suffix );
        CIRCLESformsTERMINALbatchcompilerCLEANdebug( NO, YES, _suffix );
    }
}

function CIRCLESformsTERMINALbatchcompilerCLEANcode( _question = 1, _silent = 0, _suffix = "" )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    var _script_code = $("#CIRCLESbatchcompilerTEXT" + _suffix ).val();
    if ( _script_code.length > 0 )
    {
        var _b_go = !_question ? YES : confirm( "Confirm to clean the code box ?" );
        if ( _b_go ) $("#CIRCLESbatchcompilerTEXT" + _suffix ).val( "" );
    }
}

function CIRCLESformsTERMINALbatchcompilerCLEANdebug( _question = 1, _silent = 0, _suffix )
{
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    var _b_go = !_question ? YES : confirm( "Confirm to clean the debug box ?" );
    if ( _b_go )
    {
        if ( $("#CIRCLESdebugDIV" + _suffix ).get(0) != null ) $("#CIRCLESdebugDIV" + _suffix ).html( "" );
        $("#CIRCLESbatchcompilerOKlabel" + _suffix ).html( "" );
        $("#CIRCLESbatchcompilerERRORSlabel" + _suffix ).html( "" );
        $("#CIRCLESbatchcompilerWARNINGSlabel" + _suffix ).html( "" );
        _glob_terminal_errors_counter = _glob_terminal_warnings_counter = 0 ;
    }
}

function CIRCLESformsTERMINALhistoryDISPLAYtoggle( _suffix = "", _silent = 0, _out_channel = OUTPUT_SCREEN )
{
    _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    $("#TERMINALhistoryCONTAINER" + _suffix ).toggle();
    if ( $("#TERMINALhistoryCONTAINER" + _suffix ).is(":visible") )
    {
        var _h = _glob_terminal.history().data().reverse();
        var _h_n = safe_size( _h, 0 );
        if ( _h_n > 0 )
        {
            var _html = "<div STYLE=\"position:relative;width:98%;height:118px;overflow:auto;background-color:#E2E6F9;padding:5px;\" CLASS=\"general_rounded_corners\"><table>" ;
            for( var _i = 0 ; _i < _h_n ; _i++ )
            _html += "<tr><td CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsTERMINALhistorySETcmd( '"+_h[_i]+"' );\">"+_h[_i]+"</td></tr>" ;
            _html += "</table></div>" ;
            $("#TERMINALhistoryCONTAINER" + _suffix ).html( _html );
        }
        else
        {
            var _msg = "Terminal cmds history is empty" ;
            if ( _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
            return [ RET_WARNING, _msg ] ;
        }
    }
}

function CIRCLESformsTERMINALlistingsLOAD( _filename = "", _file_contents = "" )
{
    // take care of acquiring the current terminal #ID so put contents into the associated tab
    // use _glob_terminal_form_suffix
    var _id = "CIRCLESbatchcompilerTEXT" + _glob_terminal_form_suffix ;
    if ( $( "#"+_id).get(0) != null ) $("#"+_id).val( _file_contents );
}