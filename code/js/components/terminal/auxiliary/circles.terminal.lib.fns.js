function circles_lib_terminal_batch_script_exists() { return ( $("#CIRCLESbatchcompilerTEXT" + _glob_terminal_form_suffix ).get(0) != null ) ? ( ( $("#CIRCLESbatchcompilerTEXT" + _glob_terminal_form_suffix ).val().trim().length > 0 ) ? YES : NO ) : NO ; }
function circles_lib_terminal_html_display( _term, _html_code ) { _term.echo( _html_code, {raw: true} ); }
function circles_lib_terminal_close( _out_channel )
{
    if ( _glob_terminal_echo_flag ) circles_lib_output( _out_channel, DISPATCH_STANDARD, "close" );
    circles_lib_plugin_activate( YES, "terminal", "", "", "forms", CLOSE, CIRCLESformsTERMINALdivid );
}

function circles_lib_terminal_tabular_arrange_data( _array )
{
    if ( !is_array( _array ) || safe_size( _array, 0 ) == 0 ) return "" ;
    var _msg = "", _max_len = 0, _counter = 0, _row = "" ;
    $.each( _array, function( _i, _key ) { _max_len = Math.max( _key.length, _max_len ) ; } ) ;
    _max_len += 5 ;
    var _columns = Math.floor( _glob_terminal.cols() / _max_len );
    $.each( _array, function( _i, _key ) {
               _row += _key.rpad( " ", _max_len ), _counter++ ;
               if ( _counter == _columns ) { _msg += _row + _glob_crlf, _counter = 0, _row = "" ; }
            } ) ;
    if ( _counter != _columns ) { _msg += _row + _glob_crlf, _counter = 0, _row = "" ; }
    return _msg ;
}

function circles_lib_terminal_put_item_in( _obj, _symbol = "", _method = _glob_method, _op_mask, _bool_return = NO )
{
	/* op mask : 1 >> inverse
				 2 >> seed
				 4 >> generator
	*/
    _bool_return = safe_int( _bool_return, NO ), _symbol = safe_string( _symbol, circles_lib_alphabet_suggest_symbol() );
    _method = safe_int( _method, _glob_method );
	var _item = new item_obj() ;
 	if ( _op_mask & 1 ) _obj = _obj.inv();
    if ( _op_mask & 2 ) _glob_items_switch = ITEMS_SWITCH_SEEDS ;
    else if ( _op_mask & 4 ) _glob_items_switch = ITEMS_SWITCH_GENS ;
    _item.map = _obj.copy();
    _item.complex_circle = _obj.isometric_circle();
    _item.complex_circle.draw = YES;
    _item.complex_circle.bordercolor = circles_lib_alphabet_get_color_from_symbol( _symbol ) ;
    _item.complex_circle.fill = NO;
    _item.complex_circle.fillcolor = '' ;
    _item.complex_circle.bordersize = 1 ;
    var screen_CC = circles_lib_complex_to_screen_disk( _item.complex_circle, zplane_sm );
    _item.screen_circle = screen_CC.copy() ;
    _item.screen_circle.draw = YES ;
    _item.screen_circle.bordercolor = circles_lib_alphabet_get_color_from_symbol( _symbol );
    _item.screen_circle.fill = NO ;
    _item.screen_circle.fillcolor = '' ;
    _item.screen_circle.bordersize = 1 ;
		_item.original_word = _item.symbol = _symbol ;
    if ( _method.is_one_of( METHOD_ALGEBRAIC ) )
    _item.inverse_symbol = _symbol.length > 0 ? circles_lib_word_inverse_get( _symbol ) : circles_lib_alphabet_suggest_inverse_symbol() ; 

    _item.item_type = ITEM_TYPE_MOBIUS ;
    if ( !is_array( _glob_seeds_array ) ) circles_lib_items_switch_to( _glob_items_switch, YES );
    var _search_index = circles_lib_find_item_index_by_symbol( _glob_seeds_array, _symbol );
    _cmd = _search_index != UNFOUND ? _glob_seeds_array[ _search_index ] = _item.copy() : _glob_seeds_array.push( _item ) ;
		_glob_items_to_init = YES ; $('[id$=initBTN]').css('color',COLOR_ERROR) ;
    return _bool_return ? 1 : [ 1, ( _search_index == UNFOUND ? "A new " : "" )+"item, with symbol '"+_symbol+"', has been "+( _search_index != UNFOUND ? "updated" : "inserted" )+" with success" ] ;
}

function circles_lib_terminal_cmd_ask_for_value( _params_array, _reg_expression, _out_channel )
{
		if ( !is_array( _params_array ) )
		{
			 circles_lib_output( _out_channel, DISPATCH_ERROR, "Critical fail: no question process available", _param_01 );
			 return null ;
		}
    var _question_counter = 1 ;
    var _pre_prompt = safe_string( _params_array['prepromptquestion'], "" ) ;
    var _prompt_question = safe_string( _params_array['promptquestion'], "" ) ;
    var _yes_fn = _params_array['yes_fn'] ;
    var _ifquestiondisabled_fn = _params_array.associative_key_exists('ifquestiondisabled_fn') ? _params_array['ifquestiondisabled_fn'] : null ;
    var _reg_exp_obj = new RegExp( _reg_expression );
    var _fn = function(_command)
    {
       if ( _reg_exp_obj.test( _command ) )
       {
          for( var _i = 0 ; _i < _question_counter ; _i++ ) _glob_terminal_out_stream.pop();
       }
       else if (_command.match(/\b(skip)\b/g))
       {
          for( var _i = 0 ; _i < _question_counter ; _i++ ) _glob_terminal_out_stream.pop();
          circles_lib_terminal_info_echo('Question skipped by user');
       }
       else
       {
       	  var _response = "Please, enter a correct value or type 'skip'" ; _question_counter++ ;
          circles_lib_terminal_info_echo( _response );
          _glob_terminal_out_stream.push( _fn, { prompt: _prompt_question } );
       }
    };

    if ( _glob_terminal_questions_enabled && _out_channel == OUTPUT_TERMINAL )
    {
    	 if ( safe_size( _pre_prompt.trim(), 0 ) > 0 ) _glob_terminal.echo( _pre_prompt ) ;
       _glob_terminal_out_stream.push( _fn, { prompt: _prompt_question });
    }
}

function circles_lib_terminal_cmd_ask_yes_no( _params_array = [], _out_channel = OUTPUT_TERMINAL )
{
	if ( !is_array( _params_array ) )
	{
		circles_lib_output( _out_channel, DISPATCH_ERROR, "Critical fail: no question process available", _param_01 );
		return ;
	}
    var _question_counter = 1 ;
    var _pre_prompt = safe_string( _params_array['prepromptquestion'], "" ) ;
    var _prompt_question = safe_string( _params_array['promptquestion'], "" ) ;
    var _yes_fn = _params_array['yes_fn'] ;
    var _ifquestiondisabled_fn = _params_array.associative_key_exists('ifquestiondisabled_fn') ? _params_array['ifquestiondisabled_fn'] : null ;
    var _fn = function(_command)
    {
       if ( /\b(y)|(yes)\b/gi.test( _command ) )
       {
          if ( typeof _yes_fn === "function" ) _yes_fn.call( null );
          for( var _i = 0 ; _i < _question_counter ; _i++ ) _glob_terminal_out_stream.pop();
       }
       else if ( /\b(n)|(no)\b/gi.test( _command ) )
       {
          circles_lib_terminal_info_echo('Operation aborted by user');
          for( var _i = 0 ; _i < _question_counter ; _i++ ) _glob_terminal_out_stream.pop();
       }
       else
       {
       	  var _response = "Please, reply with 'yes | y' or 'no | n'" ; _question_counter++ ;
          circles_lib_terminal_info_echo( _response );
          _glob_terminal_out_stream.push( _fn, { prompt: _prompt_question } );
       }
    };

    if ( _glob_terminal_questions_enabled && _out_channel == OUTPUT_TERMINAL )
    {
    	if ( safe_size( _pre_prompt.trim(), 0 ) > 0 ) _glob_terminal.echo( _pre_prompt ) ;
        _glob_terminal_out_stream.push( _fn, { prompt: _prompt_question });
    }
    else if ( _ifquestiondisabled_fn != null ) _ifquestiondisabled_fn.call( null );
}

function circles_lib_terminal_levenshtein( _params_array, _cmd_terms_dict, _param_01, _out_channel )
{
 		for( var _i = 0 ; _i < _params_array.length ; _i++ )
    {
 			_w = _levenshtein_search_for_closest( _params_array[_i], _cmd_terms_dict, 1 );
 			if ( _w.length > 0 && !( _w.stricmp( _params_array[_i] ) ) )
 			{
 				 _MSG = "Mismatch error: param '"+_params_array[_i]+"' has been corrected to '"+_w+"'" ;
 				 circles_lib_output( _out_channel, DISPATCH_STANDARD, _MSG, _param_01 );
 				 _params_array[_i] = _w ;
 			}
 		}
}

function circles_lib_terminal_wait_icon( _show = YES, _tab_index = 0, _suffix = "" )
{
	_show = safe_int( _show, YES );
    var CTRL_ID = "" ;
    if ( _tab_index == 0 ) CTRL_ID = "CIRCLESTERMINAL_TAB_01_BAR_BTN_03" + _suffix ;
    if ( CTRL_ID.length > 0 && $( "#" + CTRL_ID ).get(0) != null )
    $( "#" + CTRL_ID ).html( _show ? "<IMG SRC=\""+_glob_path_to_img+"wait/wait.icon.12x12.gif\">" : "" );
}

function circles_lib_terminal_help_cmd( _html_flag, _cmd_tag, _param_01, _out_channel )
{
    jQuery.get( _glob_paths['terminalhelp'] + _cmd_tag + ".cmd.hlp", function( _help_text ) {
        _help_text = $.terminal.escape_brackets( _help_text ) ;
        if ( _html_flag ) circles_lib_output( _out_channel, DISPATCH_INFO, LANG_MSG_00, _param_01, _cmd_tag, 1 );
        _html_flag ? circles_lib_terminal_color_decode_htmltext( _help_text, _cmd_tag ) : circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, _help_text, _param_01, _cmd_tag, 1 );
        }, 'html');
}

function circles_lib_terminal_color_decode_htmltext( _html_code = "", _cmd_tag = "", _x_pos = 0, _y_pos = 40, _bk = "#232323", _return_html = NO )
{
    _html_code = _html_code.replaceAll( [ CRLF_WIN, CRLF_NOWIN, '<br>' ], "<br>" );
    _cmd_tag = safe_string( _cmd_tag, "" ), _return_html = safe_int( _return_html, NO );
    var _color_tags_array = _glob_def_clrs_tags.keys_associative(), _color_tag = "", _color_def = "" ;
    for( var _x = 0 ; _x < _color_tags_array.length ; _x++ )
    {
       _color_tag = _color_tags_array[ _x ] ;
       _color_def = _glob_def_clrs_tags[ _color_tag ] ;
       _html_code = _html_code.replaceAll( "<" + _color_tag.replaceAll( "tag.", "" )+">", "<span STYLE=\"color:"+_color_def+";\">" );
       _html_code = _html_code.replaceAll( "</" + _color_tag.replaceAll( "tag.", "" ) + ">", "</span>" );
    }
    
    if ( _return_html ) return _html_code ;
    else if ( safe_size( _cmd_tag, 0 ) > 0 )
    {
       var _n_lines = Math.max( 16, _html_code.count( _glob_crlf ) );
       var _div_id = "POPUPgeneralpurposeDIV" ;
       var _check = $("#" + _div_id ).get(0) != null ? YES : NO ;
       var _popup_width = _check ? "auto" : 470 ;
       var _popup_height = _check ? Math.max( _n_lines > 0 ? _n_lines * 16 : 365, $("#" + _div_id ).height() ) : 365 ;
       var _popup_xpos = _check ? $("#" + _div_id ).css( "left" ) : UNDET ;
       var _popup_ypos = _check ? $("#" + _div_id ).css( "top" ) : UNDET ;

       _x_pos = !object_exists( _x_pos ) ? ( _popup_xpos == UNDET ? "LEFT" : _popup_xpos ) : _x_pos ;
       _y_pos = !object_exists( _y_pos ) ? ( _popup_ypos == UNDET ? "TOP" : _popup_ypos  ) : _y_pos ;
       _bk = safe_string( _bk, "#343434" ), _cmd_tag = safe_string( _cmd_tag, "" );
       CIRCLESgeneralpurposeFORM( 'forms', 'general.purpose', YES, _popup_width, _popup_height, "Help "+_cmd_tag+" (html version)",
								  _x_pos, _y_pos, _bk, YES, _html_code, YES );
    }
    else return "" ;
}

function circles_lib_terminal_cmdfile_exists( _expression )
{
    _expression = safe_string( _expression, "" ).trim();
    if ( safe_size( _expression, 0 ) == 0 ) return NO ;
    var _ret = false ;
    var _cmd_tag = _expression.includes( " " ) ? ( _expression.split( " " ) )[0] : _expression ;
    var _filename = "circles.terminal.cmd." + _cmd_tag.toLowerCase() + ".js" ;
    if ( _glob_code_run_cmds_array.includes_i( _cmd_tag ) ) return YES ;
    else if ( check_file_exists( _glob_paths['terminal_cmds_path'] + _filename ) )
    {
       $.ajaxSetup( {async:false} );
       $.getScript( _glob_paths['terminal_cmds_path'] + _filename ).done( function() { _ret = YES ; } ).fail( function(){ _ret = NO ; circles_lib_log_add_entry( "'"+_cmd_tag+"' cmd existence test failure" , LOG_ERROR ) ; } );
       return _ret ;
    }
    else
    {
       circles_lib_log_add_entry( "Missing or corrupted command '"+_cmd_tag+"'", LOG_ERROR );
       return NO ;
    }
}

function circles_lib_terminal_multicolor_echo( _colorcoded_message, _return_msg )
{
    _return_msg = safe_int( _return_msg, NO );
    _colorcoded_message += "" ;
    if ( !object_exists( _colorcoded_message ) ) return ;
	  var _keys_array = _glob_def_clrs_tags.keys_associative();
		_keys_array = _keys_array.map( function( _value ) { return _value.replaceAll( "tag.", "" ); } );
			
		var _clean_tag = "" ;
    for( var _i = 0 ; _i < _keys_array.length ; _i++ )
		{
			 _clean_tag = _keys_array[_i].trim();
       if ( _colorcoded_message.includes_i( _clean_tag ) )
       {
   		    _colorcoded_message = _colorcoded_message.replaceAll( "<"+_clean_tag+">", "[[;"+_glob_def_clrs_tags["tag."+_clean_tag]+";]" );
   		    _colorcoded_message = _colorcoded_message.replaceAll( "</"+_clean_tag+">", "]" );
       }
		}
			
    _colorcoded_message = _colorcoded_message.replace(/\\$/, '&#92;');
		if ( _return_msg ) return _colorcoded_message ;
    else if ( _glob_terminal != null ) _glob_terminal.echo( _colorcoded_message );
}

function circles_lib_terminal_text_echo( _message, _color, _return_msg )
{
    _return_msg = safe_int( _return_msg, NO );
	  _color = safe_string( _color, "" );
    _message = '[[;'+_color+';]' + _message.replace(/\\$/, '&#92;') + ']'
		if ( _return_msg ) return _message ;
    else if ( _glob_terminal != null ) _glob_terminal.echo( _message );
}

function circles_lib_terminal_standard_echo( _message, _return_msg )
{
    _return_msg = safe_int( _return_msg, NO );
    _message = '[[;'+DEFAULT_COLOR_TERMINAL_STD+';]' + _message.replace(/\\$/, '&#92;') + ']' ;
		if ( _return_msg ) return _message ;
    else if ( _glob_terminal != null ) _glob_terminal.echo( _message );
}

function circles_lib_terminal_info_echo( _message, _return_msg )
{
    _return_msg = safe_int( _return_msg, NO );
    _message = '[[;'+get_rgb_from_color_tag( 'lightgray' )+';]' + _message.replace(/\\$/, '&#92;') + ']' ;
		if ( _return_msg ) return _message ;
    else if ( _glob_terminal != null ) _glob_terminal.echo( _message );
}

function circles_lib_terminal_error_echo( _message, _return_msg )
{
    _return_msg = safe_int( _return_msg, NO );
    _message = '[[;'+get_rgb_from_color_tag( 'rederror' )+';]' + _message.replace(/\\$/, '&#92;') + ']' ;
		if ( _return_msg ) return _message ;
    else if ( _glob_terminal != null ) _glob_terminal.echo( _message );
}

function circles_lib_terminal_success_echo( _message, _return_msg )
{
    _return_msg = safe_int( _return_msg, NO );
    _message = '[[;'+get_rgb_from_color_tag( 'green' )+';]' + _message.replace(/\\$/, '&#92;') + ']' ;
		if ( _return_msg ) return _message ;
    else if ( _glob_terminal != null ) _glob_terminal.echo( _message );
}

function circles_lib_terminal_warning_echo( _message, _return_msg )
{
    _return_msg = safe_int( _return_msg, NO );
    _message = '[[;'+get_rgb_from_color_tag( 'warning' )+';]' + _message.replace(/\\$/, '&#92;') + ']' ;
		if ( _return_msg ) return _message ;
    else if ( _glob_terminal != null ) _glob_terminal.echo( _message );
}

function circles_lib_terminal_disks_check( _items_array = null, _out_channel = OUTPUT_SCREEN )
{
    var _err_mask_whole = 0 ; // keeps track of which errors have been found
    var _row = "", _items_n = circles_lib_count_items(), ITEM ;
    if ( _items_n > 0 )
    {
       var _items_array = is_array( _items_array ) ? _items_array : ( _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ) ;
       var OKcode = "OK", FAILcode = "NO", DISABLEDcode = "DISABLED" ;
       var COLUMNSpaddingARRAY = [ 5, 8, 12, 8, 12, 8, 12 ];
       _row = "Ref" ;
       _row += ( new String( " ").repeat( 5 ) );
       _row += "Symbols" ;
       _row += ( new String( " ").repeat( 14 ) );
       _row += "Formula" ;
       _row += ( new String( " ").repeat( 13 ) );
       _row += "Generators" ;
       circles_lib_output( _out_channel, DISPATCH_INFO, _row );

       _row = ( new String( " " ) ).rpad( " ", COLUMNSpaddingARRAY[0] );
       _row += ( new String( "Gen" ) ).rpad( " ", COLUMNSpaddingARRAY[1] );
       _row += ( new String( "Inverse" ) ).rpad( " ", COLUMNSpaddingARRAY[2] );
       _row += ( new String( "Circle" ) ).rpad( " ", COLUMNSpaddingARRAY[3] );
       _row += ( new String( "Map" ) ).rpad( " ", COLUMNSpaddingARRAY[4] );
       _row += ( new String( "Circle" ) ).rpad( " ", COLUMNSpaddingARRAY[5] );
       _row += ( new String( "Map" ) ).rpad( " ", COLUMNSpaddingARRAY[6] );
       circles_lib_output( _out_channel, DISPATCH_INFO, _row );

       var _symbol, _inv_symbol, _complex_circle, _mobius_map, _generator_mobius_map, _generator_circle, _err_mask, _startINDEX ;

       for( var i = 0 ; i < _items_n ; i++ )
       {
           ITEM = _items_array[i] ;
           if ( is_item_obj( ITEM ) )
           {
               _err_mask = 0 ;
               _symbol = safe_string( ITEM.symbol, "" );
               _inv_symbol = safe_string( ITEM.inverse_symbol, "" );
               _complex_circle = ITEM.complex_circle, _mobius_map = ITEM.map ;
               if ( _symbol.length == 0 ) _err_mask |= 1 ;
               if ( ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) ) && _inv_symbol.length == 0 ) _err_mask |= 2 ;
               if ( !is_circle( _complex_circle ) ) _err_mask |= 4 ;
               if ( !is_mobius_map( _mobius_map ) ) _err_mask |= 16 ;

               _row = "", _startINDEX = 0 ;
               _row += _symbol.rpad( " ", COLUMNSpaddingARRAY[_startINDEX] );
               _startINDEX++ ;
               _row += ( _err_mask & 1 ? FAILcode : OKcode ).rpad( " ", COLUMNSpaddingARRAY[_startINDEX] );
               _startINDEX++ ;
               _row += ( ( circles_lib_method_check() && ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) ) ) ? ( ( _err_mask & 2 ) ? FAILcode : OKcode + " ("+_inv_symbol+")" ) : DISABLEDcode ).rpad( " ", COLUMNSpaddingARRAY[_startINDEX] );
               _startINDEX++ ;
               _row += ( _err_mask & 16 ? FAILcode : OKcode ).rpad( " ", COLUMNSpaddingARRAY[_startINDEX] );
               _startINDEX++ ;
               _row += ( ( _err_mask & 4 || _err_mask & 8 ) ? FAILcode : OKcode ).rpad( " ", COLUMNSpaddingARRAY[_startINDEX] );
               _startINDEX++ ;
               _row += ( _err_mask & 64 ? FAILcode : OKcode ).rpad( " ", COLUMNSpaddingARRAY[_startINDEX] );
               _startINDEX++ ;
               _row += ( _err_mask & 32 ? FAILcode : OKcode ).rpad( " ", COLUMNSpaddingARRAY[_startINDEX] );

               if ( _err_mask & 1 ) _err_mask_whole |= 1 ;
               if ( _err_mask & 2 ) _err_mask_whole |= 2 ;
               if ( _err_mask & 4 ) _err_mask_whole |= 4 ;
               if ( _err_mask & 8 ) _err_mask_whole |= 8 ;
               if ( _err_mask & 16 ) _err_mask_whole |= 16 ;
               if ( _err_mask & 32 ) _err_mask_whole |= 32 ;
               if ( _err_mask & 64 ) _err_mask_whole |= 64 ;
                                        
               circles_lib_output( _out_channel, _err_mask ? DISPATCH_ERROR : DISPATCH_STANDARD, _row );
          }
          else
          {
             _row = "This Mobius map is null" ;
             circles_lib_output( _out_channel, DISPATCH_ERROR, _row );
          }
       }
          
       return _row ;
    }
    else
    {
       _b_fail = YES ;
       circles_lib_output( _out_channel, DISPATCH_ERROR, _ERR_33_01 );
       return _ERR_33_01 ;
    }
}

function circle_terminal_cmd_display_mobiusmap_item( ITEM, _i = UNDET, _out_channel = OUTPUT_TERMINAL, _params_assoc_array = [] )
{
	var _is_item_obj = is_item_obj( ITEM ) ;
    var _symbol = _is_item_obj ? ITEM.symbol : "";
    var _inv_symbol = _is_item_obj ? ITEM.inverse_symbol.trim() : "";
    var _cc = _is_item_obj ? ITEM.complex_circle : null, _cc_check = _cc != null ? YES : NO ;
    var _bordersize = _cc_check ? _cc.bordersize : 0 ;
    var _fill = _cc_check ? _cc.fill : UNDET ;
    var _border = _cc_check ? _cc.draw : UNDET ;
    var _mm = _is_item_obj ? ITEM.map : null ;
	var _anti_homography_mask = _is_item_obj ? ITEM.map.anti_homography_mask : UNDET ;

    var _bordercolor = _cc_check ? _cc.bordercolor.trim() : "";
    if ( _bordercolor.length == 0 ) _bordercolor = "none" ;
    var _fillcolor = _cc_check ? _cc.fillcolor.trim() : "";
    if ( _fillcolor.length == 0 ) _fillcolor = "none" ;
    var _notes = safe_string( ITEM.notes, "" ).trim() ;
    var _original_word = safe_string( ITEM.original_word, "" ).trim() ;

    var _roundto = Math.min( safe_int( _params_assoc_array['roundto'], _glob_accuracy ), DEFAULT_MAX_ACCURACY ) ;
    var _short = safe_int( _params_assoc_array['short'], NO ) ;
    var _extras = safe_size( _params_assoc_array['extras'], 0 ) > 0 ? _params_assoc_array['extras'] : [] ;
    var _what = _extras.one_in( "attr", "params" ) ? _extras[0] : "all" ; // only one attribute, if mentioned

    var _out_string = "<yellow>Mobius map</yellow> <snow>" + ( _symbol.length == 0 ? "(unknown)" : _symbol ) + "</snow>" ;
    if ( _glob_method != METHOD_INVERSION && !_short )
    _out_string += " - inverse symbol <lightblue>" + ( _inv_symbol.length == 0 ? "(unknown inverse)" : _inv_symbol ) + "</lightblue>" ;
    _out_string += " - Index <snow>" + _i + "</snow>" + _glob_crlf ;

    if ( is_mobius_map( _mm ) )
    {
       if ( !_mm.is_consistent() ) _out_string += _glob_crlf + "This Mobius map is not consistent: at least one param has not been initialized" ;
       else
       {
          var _params = "" ;
          if ( _what.is_one_of( "all", "params" ) ) _params += _mm.output( _glob_crlf, "coeffs", _roundto ) ;
          if ( _what.is_one_of( "all", "attr" ) && !_short )
          {
             if ( _params.length > 0 ) _params += _glob_crlf ;
             _params += "Complex circle <snow>" + ( is_circle( ITEM.complex_circle ) ? ITEM.complex_circle.output( _glob_crlf, _roundto ) : "" ) + "</snow>"+_glob_crlf ;
             _params += "Trace <snow>" + ( ( is_complex( _mm.a ) && is_complex( _mm.d ) ) ? _mm.trace().roundTo( _roundto ).formula() : UNDEF ) + "</snow>"+_glob_crlf ;
             _params += " Normalized <snow>" + ( _mm.is_normalized() ? "yes" : "no" ) + "</snow>"+_glob_crlf ;
             _params += "Class <snow>" + _mm.classification(NO) + "</snow>  Kind <snow>" + _mm.kind(NO) + "</snow>"+_glob_crlf ;

             var _bordercolor_array = _bordercolor != "none" ? circles_lib_colors_get_formats( _bordercolor ) : null ;
             var _bordercolor_tag = _bordercolor_array != null ? _bordercolor_array[3] : "" ;
             var _fillcolor_array = _fillcolor != "none" ? circles_lib_colors_get_formats( _fillcolor ) : null ;
             var _fillcolor_tag = _fillcolor_array != null ? _fillcolor_array[3] : "" ;

             _params += "Draw <snow>" + ( _border == UNDET ? "? " : ( _border ? "yes" : "no" ) ) + "</snow>"+_glob_crlf ;
             _params += "  Color: " + _bordercolor + ( _bordercolor_tag.length > 0 ? " ( "+_bordercolor_tag+" )" : "" )+_glob_crlf;
             _params += "Fill <snow>" + ( _fill == UNDET ? "? " : ( _fill ? "yes" : "no" ) ) + "</snow>"+_glob_crlf ;
             _params += "  Color: " + _fillcolor + ( _fillcolor_tag.length > 0 ? " ( "+_fillcolor_tag+" )" : "" )+_glob_crlf;
             _params += "Border size <snow>" + _bordersize + " pixel" + ( _bordersize == 1 ? "" : "s" ) + "</snow>"+_glob_crlf ;
             _params += "Original word <snow>" + _original_word + "</snow>" ;
          }

        _out_string += _params ;
        if ( _anti_homography_mask == UNDET ) _out_string += _glob_crlf + "undetermined z computation" ;
        else
		{
			_out_string += _glob_crlf + "<lightgray>Var z management in Mobius map</lightgray>" ;
			_out_string += _glob_crlf + "Numerator : <white>z is applied as " + ( _anti_homography_mask & 1 ? "conjugated" : "identical" ) + "</white>" ;
			_out_string += _glob_crlf + "Denominator : <white>z is applied as " + ( _anti_homography_mask & 2 ? "conjugated" : "identical" ) + "</white>" ;
		}
        if ( safe_size( _notes, 0 ) > 0 ) _out_string += _glob_crlf + "<gray>Notes</gray> <lightgray>" + _notes + "</lightgray>" ;
       }
    }
    else _out_string += _glob_crlf + "No Mobius map" ;
    _out_string = _symbol + _glob_crlf + _out_string ;
    if ( _out_channel != OUTPUT_TEXT ) circles_lib_terminal_multicolor_echo( _out_string );
    return _out_string ;
}

function circles_lib_terminal_parse_input_index( _str )
{
    _str = _str.trim();
    var _b_go = _str.testME( "^[0-9\,\-]{1,}$" ), _refs_array = [], _token, _i, _t ;
    var _ends_array, _start_symbol, _end_symbol, _start_index, _end_index ;
    
    if ( _str.length == 0 ) return [ RET_ERROR, "Fail to parse this index: it is empty" ] ;
    else if ( !_b_go ) return [ RET_ERROR, "Fail to parse this index: detected syntax error or illegal chars" ] ;
    
    var _tokens_array = _str.includes( "," ) ? _str.split( "," ) : [ _str ];
    var _t_l = safe_size( _tokens_array, 0 );
    if ( _t_l > 0 )
    {
        for( _i = 0 ; _i < _t_l ; _i++ )
        {
           _token = new String( _tokens_array[_i] ).trim();
           if ( _token.length > 0 && _str.includes( "-" ) )
           {
              _ends_array = _token.split( "-" );
              _start_symbol = ( _ends_array[0]+"" ).trim();
              _end_symbol = ( _ends_array[1]+"" ).trim();
              _start_index = _start_symbol.length > 0 ? safe_int( _start_symbol.trim(), UNDET ) : UNDET;
              _end_index = _end_symbol.length > 0 ? safe_int( _end_symbol.trim(), UNDET ) : UNDET;
              // one-line swap
              if ( _start_index > _end_index ) _start_index = [_end_index, _end_index = _start_index][0];
              if ( _start_index == UNDET || _end_index == UNDET ) return [ RET_ERROR, "Fail to parse this symbol: missing interval bounds" ] ;
              else for( _t = _start_index ; _t <= _end_index ; _t++ ) _refs_array.push( _t );
           }
           else if ( _token.length > 0 ) _refs_array.push( _token );
        }
         
        return [ RET_OK, _refs_array ];
    }
    else return [ RET_OK, _str ] ;
}

function circles_lib_terminal_is_mobius_map_param( _input_param )
{
    _input_param = !object_exists( _input_param ) ? NO : ( new String( _input_param ) ).toLowerCase().trim();
    return _input_param.testME( "^[a|b|c|d]{1}$" ) ? YES : NO ; 
}