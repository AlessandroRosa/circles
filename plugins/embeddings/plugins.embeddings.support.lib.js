var GLOB_PLUGIN_BASE_ID = "" ;
var GLOB_PLUGIN_SUBSET = "" ;
var GLOB_PLUGIN_DIV_ID = "POPUPpluginDIV" ;
var GLOB_PLUGIN_CIRCLE_TYPE = DRAWENTITY_INVERSION_CIRCLE ;

function GLOB_PLUGIN_DESTROY_POPUP_VARS()
{
		// delete all vars, declared in the plugin pop-up window, from memory
		for( var _v in window ) if ( _v.start_with( "PLUGINglob_" ) ) eval( "window." + _v + " = null ;" );
		_plugin_main_ref = 0 ;
		return YES ;
}

function GLOB_PLUGIN_FOCUS( _base_id, _subset, _div_id )
{
    _base_id = safe_string( _base_id, "" ), _subset = safe_string( _subset, "embeddings" ).toLowerCase() ;
    var _fn_name = "CIRCLES"+_subset+_base_id.replace( /[\.\_\-]/g, "" ).toUpperCase()+"dispatcher" ;
    if ( _base_id.length > 0 && function_exists( _fn_name ) )
    {
      // dispatch notifications to pop-up
      try{eval( _fn_name+"(POPUP_DISPATCHER_UNICAST_EVENT_FOCUS);" );}
    	catch( _err ){ circles_lib_error_obj_handler( _err ); }
    }
}

function GLOB_PLUGIN_PARAMS_ALL_COMPILED( _query_expr )
{
    var _all = YES ;
    if ( !_query_expr.start_with( "#" ) ) _query_expr = "#" + _query_expr ;
    $( _query_expr ).each( function( _id, _item ) { if ( _item.value.length == 0 ) _all = NO ; } );
    return _all ;
}

function GLOB_PLUGIN_OPEN_METHOD_FORM( _fn_name )
{
    _fn_name = safe_string( _fn_name, "" );
    if ( circles_lib_method_check() ) circles_lib_plugin_load('forms','method', YES, 0, _glob_method, _fn_name );
    else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ERR_00_01, _glob_app_title );
}

function GLOB_PLUGIN_DISPLAY_INFOS( _plugin_ref )
{
    var _index_ref = _plugin_ref ;
		var _def = safe_string( _plugin_definitions_array[_index_ref], "none" );
		var _info = safe_string( _plugin_info_array[_index_ref], "none" );
		var _method = safe_int( _plugin_method_array[_index_ref], METHOD_NONE );
		var _method_str = circles_lib_method_get_def( _glob_method );
		var HTMLcode = "<table>" ;
		HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
		HTMLcode += "<tr>" ;
		HTMLcode += "<td WIDTH=\"5\"></td>" ;
		HTMLcode += "<td VALIGN=\"top\">Index</td>" ;
		HTMLcode += "<td WIDTH=\"10\"></td>" ;
		HTMLcode += "<td VALIGN=\"top\" STYLE=\"color:#5F819C;\">"+_plugin_ref+"</td>" ;
		HTMLcode += "</tr>" ;
		HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
		HTMLcode += "<tr>" ;
		HTMLcode += "<td WIDTH=\"5\"></td>" ;
		HTMLcode += "<td VALIGN=\"top\">Definition</td>" ;
		HTMLcode += "<td WIDTH=\"10\"></td>" ;
		HTMLcode += "<td VALIGN=\"top\" STYLE=\"color:#5F819C;\">"+_def+"</td>" ;
		HTMLcode += "</tr>" ;
		HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
		HTMLcode += "<tr>" ;
		HTMLcode += "<td WIDTH=\"5\"></td>" ;
		HTMLcode += "<td VALIGN=\"top\">Method</td>" ;
		HTMLcode += "<td WIDTH=\"10\"></td>" ;
		HTMLcode += "<td VALIGN=\"top\" STYLE=\"color:#5F819C;\">"+_method_str+"</td>" ;
		HTMLcode += "</tr>" ;
		HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
		HTMLcode += "<tr>" ;
		HTMLcode += "<td WIDTH=\"5\"></td>" ;
		HTMLcode += "<td VALIGN=\"top\">Info</td>" ;
		HTMLcode += "<td WIDTH=\"10\"></td>" ;
		HTMLcode += "<td VALIGN=\"top\" STYLE=\"color:#5F819C;\">"+_info+"</td>" ;
		HTMLcode += "</tr>" ;
		HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
		HTMLcode += "</table>" ;
		alert_msg( ALERT_INFO, HTMLcode, _def, 400, "auto", _glob_path_to_img + "icons/plug/plug.icon.01.64x64.png", 64, 200 );
}

function GLOB_PLUGIN_ATTEMPT_TO_CLOSEST_INT( _n, accuracy )
{
    var _floor_n = Math.floor( _n ), _ceil_n = Math.ceil( _n );
    var _tenth_accuracy = Math.pow( 10, -accuracy );
    if ( Math.abs( _n - _floor_n ) <= _tenth_accuracy ) return _floor_n ;
    else if ( Math.abs( _n - _ceil_n ) <= _tenth_accuracy ) return _ceil_n ;
    else return _n ;
}

function GLOB_PLUGIN_TOGGLE_GENS() { $("#PLUGIN_CONTAINER").slideToggle( "slow", function() { $("#PLUGIN_GENSTOGGLE_BTN").html( $("#PLUGIN_CONTAINER").css( "display" ) == "none" ? "Show panel" : "Hide panel" ); } ); }
function GLOB_PLUGIN_FLUSH_PATTERNS() { _plugin_pattern_array.flush(); _plugin_additional_html_text = "" ; }
function GLOB_PLUGIN_ADD_PATTERN( obj ) { _plugin_pattern_array.push( obj ); }
function GLOB_PLUGIN_PARAMS_FILLER()
{
    _init = safe_int( arguments[1], NO );
    var _index_ref = safe_string( _plugin_main_ref, "" );
    var _popup_obj = circles_lib_plugin_find_wnd( { subset : "embeddings" }, POPUP_SEARCH_BY_SUBSET, NO ) ;
    var _subset = is_array( _popup_obj ) ? safe_string( _popup_obj[8], "" ).trim() : "" ;
    var _base_id = is_array( _popup_obj ) ? safe_string( _popup_obj[12], "" ).trim() : "" ;
    if ( _base_id.length > 0 )
    {
        var _filler_fn = null ;
        try{ eval( "_filler_fn = CIRCLES"+(_subset.toLowerCase())+(_base_id.replace( /[\.\_\-]/g, "" ).toUpperCase())+"_PARAMS_FILL ;" ) }
				catch( _err ){ circles_lib_error_obj_handler( _err ); }
        if ( function_exists( _filler_fn ) )
        {
            if ( is_complex( arguments[0] ) ) _filler_fn.apply( this, arguments );
            return YES ;
        }
        else return NO ;
    }
    else return NO ;
}

function GLOB_PLUGIN_EVENT_PROPAGATION_MANAGEMENT( _action )
{
    _action = safe_int( _action, 0 );
    switch( _action )
    {
        case 0:
        _glob_wnd_onclick_event_halt = _glob_wnd_onkeyup_event_halt = NO ;
        break ;
        case 1:
        $( "#"+GLOB_PLUGIN_DIV_ID ).bind('focus keydown keyup keypress', function(e)
        {
           _glob_wnd_onclick_event_halt = _glob_wnd_onkeyup_event_halt = YES ;
        }
        );
        break ;
        default: break ;
    }
}

function GLOB_PLUGIN_APPLY_SETTINGS(_index_ref)
{
    if ( _glob_process == PROCESS_NONE ) _glob_process = PROCESS_BREADTHFIRST ;
    _glob_init_mask = INIT_FROM_MAPS | INIT_PAIRED_ITEMS ;
    if ( _glob_drawentity == DRAWENTITY_NONE ) _glob_drawentity = DRAWENTITY_PIXEL ;
    _glob_construction_mode = _glob_dict_processor.construction_mode = CONSTRUCTION_LIMITSET;
    circles_lib_method_set( _plugin_method_array[_index_ref] );
}

function GLOB_PLUGIN_GENS_SHOW( bSHOW )
{
    bSHOW ? $( "#PLUGIN_CONTAINER" ).show() : $( "#PLUGIN_CONTAINER" ).hide();
    $("#PLUGIN_GENSTOGGLE_BTN").html( $("#PLUGIN_CONTAINER").css( "display" ) == "none" ? "Show panel" : "Hide panel" );
}

function GLOB_PLUGIN_VARS_PATTERN_SAVE( _plugin_ref )
{
    var _index_ref = _plugin_ref ;
    _plugin_rec_configs_array[_index_ref] = [] ;
    for( var _k in _plugin_tmp_vars_array )
    _plugin_rec_configs_array[_index_ref][_k] = _plugin_tmp_vars_array[ _k ] ;
}

function GLOB_PLUGIN_VARS_PATTERN_RESTORE( _plugin_ref )
{
    var _index_ref = _plugin_ref ;
    if ( _plugin_rec_configs_array.size_associative() > 0 )
    {
       _plugin_tmp_vars_array = [] ;
       for( var _k in _plugin_rec_configs_array[_index_ref] )
       _plugin_tmp_vars_array[ _k ] = _plugin_rec_configs_array[_index_ref][_k] ;
    }

    return YES ;
}

function GLOB_PLUGIN_WIZARD_STEP( _step_index, _init_items, _clean, _target_plane )
{
		_step_index = safe_float( _step_index, UNDET ), _init_items = safe_int( _init_items, _glob_items_to_init ), _clean = safe_int( _clean, YES );
    _plugin_step_index = _step_index ;
    _target_plane = safe_int( _target_plane, _glob_target_plane );
    
    $('#PLUGINsetBTN').css('color',_step_index==0?COLOR_ERROR : DEFAULT_COLOR_STD);
    $('[id$=initBTN]').css('color',_step_index==0.1?COLOR_ERROR : DEFAULT_COLOR_STD);
    $('[id$=renderBTN]').css('color',_step_index==1.1?COLOR_ERROR : DEFAULT_COLOR_STD);
    if ( _step_index == 0.1 ) return [ RET_OK, "Step " + _step_index + " performed with success" ] ;
    else if ( _step_index == 1.1 )
    {
      _glob_alphabet.flush();
      GLOB_PLUGIN_GENS_SHOW( YES );
      circles_lib_plugin_dispatcher_unicast_message( 'alphabet.colorization', 'tools', POPUP_DISPATCHER_UNICAST_EVENT_UPDATE );
      circles_lib_items_switch_to( ITEMS_SWITCH_SEEDS, YES );
      if ( _init_items )
      {
        _ret_chunk = circles_lib_items_init( null, NO, YES, _glob_init_mask, NO, YES, OUTPUT_SCREEN );
        if ( _ret_chunk[0] != RET_OK )
        {
          circles_lib_log_add_entry( _ret_chunk[1], LOG_WARNING );
          return _ret_chunk ;
        }
      }
      _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, _clean, YES, YES, NO, YES, OUTPUT_SCREEN );
      var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
      var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
      return [ RET_OK, _ret_id == 0 ? _ret_msg : "Step " + _step_index + " performed with success" ] ;
    }
    else if ( _step_index == 2.1 )
    {
      GLOB_PLUGIN_GENS_SHOW( YES );
      _glob_dict_create = _glob_process == PROCESS_RANDOM ? NO : YES ;
      var _ret_chunk_ask = circles_lib_canvas_process_ask(YES,NO,_glob_bip_use?BIP_BOX:_target_plane,YES,_clean,_init_items);
      var _ret_id = _ret_chunk_ask != null ? safe_int( _ret_chunk_ask[0], 0 ) : 0 ;
      var _ret_msg = _ret_chunk_ask != null ? _ret_chunk_ask[1] : _ERR_00_00 ;
      return [ RET_OK, _ret_id == 0 ? _ret_msg : "Step " + _step_index + " performed with success" ] ;
    }
}

function GLOB_PLUGIN_GENS_PATTERN_SHOW( idcontainer )
{
    var _p = safe_size( _plugin_pattern_array, 0 );
    if ( _p > 0 )
    {
        $( "#"+idcontainer ).slideToggle();
        var HTMLcode = "<table>" ;
            HTMLcode += "<tr><td COLSPAN=\"5\">Generators patterns</td></tr>" ;
        var _pattern, _symbol, _a, _b, _c, _d ;
        for( var i = 0 ; i < _p ; i++ )
        {
            _pattern = _plugin_pattern_array[i], _symbol = _pattern['symbol'] ;
            _a = _pattern['a'], _b = _pattern['b'], _c = _pattern['c'], _d = _pattern['d'] ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td VALIGN=\"top\">" ;
            HTMLcode += "<table>" ;
            HTMLcode += "<tr>" ;
            HTMLcode += "<td VALIGN=\"bottom\">Generator "+(i+1)+"</td>" ;
            HTMLcode += "<td WIDTH=\"10\"></td>" ;
            HTMLcode += "<td VALIGN=\"bottom\" STYLE=\"font-size:44pt;\">(</td>" ;
            HTMLcode += "<td VALIGN=\"bottom\">" ;
            HTMLcode += "<table>" ;
            HTMLcode += "<tr><td STYLE=\"text-align:left;font-size:12pt;\">"+_a+"</td><td WIDTH=\"40\"></td><td STYLE=\"text-align:right;font-size:12pt;\">"+_b+"</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"20\"></td></tr>" ;
            HTMLcode += "<tr><td STYLE=\"text-align:left;font-size:12pt;\">"+_c+"</td><td WIDTH=\"40\"></td><td STYLE=\"text-align:right;font-size:12pt;\">"+_d+"</td></tr>" ;
            HTMLcode += "</table>" ;
            HTMLcode += "</td>" ;
            HTMLcode += "<td VALIGN=\"bottom\" STYLE=\"font-size:44pt;\">)</td>" ;
            HTMLcode += "<td WIDTH=\"10\"></td>" ;
            HTMLcode += "<td VALIGN=\"bottom\">Symbol <b>"+_symbol+"</b></td>" ;
            HTMLcode += "</tr>" ;
            HTMLcode += "</table>" ;
            HTMLcode += "</td>" ;
            HTMLcode += "</tr>" ;
        }

        if ( _plugin_additional_html_text.length > 0 )
        {
            HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
            HTMLcode += "<tr><td COLSPAN=\"5\" VALIGN=\"top\" STYLE=\"font-size:12pt;\">"+_plugin_additional_html_text+"</td></tr>" ;
            HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
        }

        HTMLcode += "</table>" ;
        $( "#"+idcontainer ).html( HTMLcode );
    }
}

function GLOB_PLUGIN_SEEDS_COMBO_SELECT()
{
    var _entry, _entryARRAY, startINDEX, _mobius_map_index, _mobius_map_n ;
    _entry = $("#PLUGINSseedsCOMBO").val();
    if ( _entry.length > 0 && _entry.includes( "|" ) )
    {
        _entryARRAY = _entry.split( "|" );
        if ( _entryARRAY.length > 0 )
        {
            startINDEX = 0 ;
            _mobius_map_index = safe_int( _entryARRAY[startINDEX], 0 );
            startINDEX++ ;
            _mobius_map_n = safe_int( _entryARRAY[startINDEX], 0 );
            GLOB_PLUGIN_GENS_DETAILS_SHOW( _mobius_map_index, _mobius_map_n );
        }
    }
}

function GLOB_PLUGIN_GENS_TABLE_SHOW( _base_id )
{
    _base_id = _base_id.replace( /[\.\_\-]/g, "" );
    var HTMLcode = "", _sd_n = circles_lib_count_seeds();
    if ( _sd_n > 0 )
    {
        var COLS = 4 ;
        HTMLcode += "<table WIDTH=\"100%\" >" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td VALIGN=\"top\" CLASS=\"popup_buttons_bar\">" ;
        HTMLcode += "<table>" ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td WIDTH=\"2\"></td>" ;
        HTMLcode += "<td>Show seed</td>" ;
        HTMLcode += "<td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td>" ;
        HTMLcode += "<SELECT ID=\"PLUGINSseedsCOMBO\" ONCHANGE=\"javascript:GLOB_PLUGIN_SEEDS_COMBO_SELECT();\">" ;
        HTMLcode += "<OPTION VALUE=\"\">" ;
        var ITEM, _symbol, _mobius_map ;
        for( var i = 0 ; i < _sd_n ; i++ )
        {
            ITEM = _glob_seeds_array[i] ;
            if ( is_item_obj( ITEM ) )
            {
                _symbol = ITEM.symbol, _mobius_map = ITEM.map ;
                HTMLcode += "<OPTION VALUE=\""+i+"|"+_sd_n+"\">" + _symbol ;
            }
        }

        HTMLcode += "</SELECT>" ;
        HTMLcode += "</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "</table>" ;
        HTMLcode += "</tr>" ;
              
        var ITEM, _symbol, _mobius_map, fixed_points_array, _n_fixed_points, G1 ;
        var _fp1, _fp1_type, _fp2, _fp2_type ;
        for( var i = 0 ; i < _sd_n ; i++ )
        {
            ITEM = _glob_seeds_array[i] ;
            if ( is_item_obj( ITEM ) )
            {
                _symbol = ITEM.symbol, _mobius_map = ITEM.map ;
                if ( is_mobius_map( _mobius_map ) && _symbol.length > 0 )
                {
          HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\" ID=\"PLUGINS_SEEDS_CONTAINER_"+i+"\" STYLE=\"display:none;\">" ;

          HTMLcode += "<table WIDTH=\"100%\">" ;

          HTMLcode += "<tr><td VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"padding:6px;background-color:#454545;color:#00F000;\">" ;
          HTMLcode += "<table WIDTH=\"100%\">" ;
          HTMLcode += "<tr><td><b>Generator "+_symbol+"</b></td></tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
          HTMLcode += "<tr><td>Mobius map parameters</td></tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
          HTMLcode += "<tr><td>a: "+_mobius_map.get_a().formula()+"</td></tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
          HTMLcode += "<tr><td>b: "+_mobius_map.get_b().formula()+"</td></tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
          HTMLcode += "<tr><td>c: "+_mobius_map.get_c().formula()+"</td></tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
          HTMLcode += "<tr><td>d: "+_mobius_map.get_d().formula()+"</td></tr>" ;
          // fixed points Generator #1
          fixed_points_array = _mobius_map.fixed_points();
          _n_fixed_points = safe_size( fixed_points_array, 0 ) ;
          G1 = ITEM.map ;
          
          _fp1 = _n_fixed_points > 0 ? fixed_points_array[0] : null ;
          _fp1_type = "" ;
          if ( is_complex( _fp1 ) )
          {
              if ( G1.is_sink_pt( _fp1 ) ) _fp1_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SINK );
              else if ( G1.is_source_pt( _fp1 ) ) _fp1_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SOURCE );
              else _fp1_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_NEUTRAL );
          }
          else _fp1_type = "Undetermined" ;
                            
          _fp2 = _n_fixed_points > 0 ? fixed_points_array[1] : null ;
          _fp2_type = "" ;
          if ( is_complex( _fp2 ) )
          {
              if ( G1.is_sink_pt( _fp2 ) ) _fp2_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SINK );
              else if ( G1.is_source_pt( _fp2 ) ) _fp2_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_SOURCE );
              else _fp2_type = circles_lib_fixedpoints_get_def( FIXEDPOINT_NEUTRAL );
          }
          else _fp2_type = "Undetermined" ;

          HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
          HTMLcode += "<tr><td>Fixed points: "+_n_fixed_points+"</td></tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"8\"></td></tr>" ;
          if ( is_complex( _fp1 ) )
          {
              HTMLcode += "<tr><td>Fixed point #1: "+_fp1.formula()+"</td></tr>" ;
              HTMLcode += "<tr><td>Type #1: "+_fp1_type+"</td></tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
          }
          
          if ( is_complex( _fp2 ) )
          {
              HTMLcode += "<tr><td>Fixed point #2: "+_fp2.formula()+"</td></tr>" ;
              HTMLcode += "<tr><td>Type #2: "+_fp2_type+"</td></tr>" ;
              HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
          }

          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td VALIGN=\"top\" ALIGN=\"right\" COLSPAN=\"4\" CLASS=\"popup_buttons_bar\">" ;
          HTMLcode += "<table>" ;
          HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
          HTMLcode += "<tr>" ;
          HTMLcode += "<td "+( _n_fixed_points == 0 ? "CLASS=\"linkdead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_fixedpoints_draw("+i+", circles_lib_extras_canvas_dropdown_get_placeholder('"+_base_id+"') );\"" )+">Mark Fixed Points</td>" ;
          HTMLcode += "<td WIDTH=\"15\"></td>" ;
          HTMLcode += "<td "+( i == UNDET ? "CLASS=\"linkdead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','edit.disk',NO,"+i+");\"" )+">Edit</td>" ;
          HTMLcode += "<td WIDTH=\"15\"></td>" ;
          HTMLcode += "<td "+( i == UNDET ? "CLASS=\"linkdead\"" : "CLASS=\"link_rounded\" ONCLICK=\"javascript:circles_lib_plugin_load('forms','watch.formula',NO,"+i+");\"" )+">Watch formula</td>" ;
          HTMLcode += "<td WIDTH=\"5\"></td>" ;
          HTMLcode += "</tr>" ;
          HTMLcode += "<tr><td HEIGHT=\"2\"></td></tr>" ;
          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;

          HTMLcode += "</table>" ;
          HTMLcode += "</td>" ;
          HTMLcode += "</tr>" ;
                      } 
            }
        }

        HTMLcode += "</table>" ;
    }
          
    return HTMLcode ;
}

function GLOB_PLUGIN_GENS_DETAILS_SHOW( _mobius_map_index, _mobius_map_count )
{
    var CONTAINERID, PLUGIN_CONTAINER, _d, _new_d, a, _canvas, _ret_chunk, _ret_id, _ret_msg ;
    for( var i = 0 ; i < _mobius_map_count ; i++ )
    {
       if ( i == _mobius_map_index )
       {
          $("#PLUGINS_SEEDS_CONTAINER_" + i ).show();
          a = [];
          a.push( _mobius_map_index );
          _canvas = circles_lib_canvas_get_from_role( Z_PLANE, ROLE_RENDERING );
          circles_lib_canvas_clean( _canvas );
          _ret_chunk = circles_lib_canvas_render_zplane( _canvas, zplane_sm, null, YES, YES, YES, NO, YES,OUTPUT_SCREEN );
          _ret_id = is_array( _ret_chunk ) ? _ret_chunk[0] : RET_ERROR ;
          _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : "70Unknown error" ;
			    if ( _ret_id == RET_ERROR ) circles_lib_log_add_entry( _ret_msg, LOG_ERROR );
       }
       else $("#PLUGINS_SEEDS_CONTAINER_" + i ).hide();
    }
}

function GLOB_PLUGIN_VARS_PATTERN_FILL( _index )
{
    var _index_ref = _index + "" ;
    var _keys = [], _values = [];
    var _chunk, _input_formula, _memory_formula, _memory_variable, _memory_default_value, _type_variable ;
    var _set_formula_cmd_step_1, _set_formula_cmd_step_2, _set_value_cmd, _store_value_cmd, _parsed_formula_cmd ;
    for( var _k in _plugin_tmp_vars_array )
    {
        _keys.push( _k );
        _values.push( _plugin_tmp_vars_array[ _k ] );
    }
    
    for( var _param in _plugin_vars_array[ _index_ref ] )
    {
        _chunk = _plugin_vars_array[ _index_ref ][_param] ;
        _input_formula = _plugin_tmp_vars_array[_param] ;
        _memory_formula = _chunk['formula'] ;
        _memory_variable = _chunk['label'] ;
        _memory_default_value = _chunk['value'] ;
        _type_variable = _chunk['type'] ;
        _set_formula_cmd_step_1 = _set_formula_cmd_step_2 = "" ;
        _parsed_formula_cmd = _store_value_cmd = _set_value_cmd = "" ;

        if ( is_string( _memory_formula ) )
        {
            switch( _type_variable.toLowerCase() )
            {
                case "complex":
                // the memory variable just store the input formula, not the value in itself
                _set_formula_cmd_step_1 = _memory_formula + " = '"+( is_string( _input_formula ) ? _input_formula : _memory_default_value.formula() )+"' ; ";
                _set_formula_cmd_step_2 = _memory_formula + " = circles_lib_parse_fix_formula( "+_memory_formula+" )" ;
                _parsed_formula_cmd = _memory_variable + " = circles_lib_math_parse_formula( "+_memory_formula+" );"
                break ;
                case "integer":
                _set_formula_cmd_step_1 = _memory_formula + "='"+( is_string( _input_formula ) ? _input_formula : _memory_default_value )+"';";
                _set_value_cmd = _memory_variable + "=safe_int( '"+( is_string( _input_formula ) ? _input_formula : _memory_default_value )+"', 0 );";
                _store_value_cmd = "safe_int( '"+( is_string( _input_formula ) ? _input_formula : _memory_default_value )+"', 0 );";
                break ;
                case "float":
                default:
                _set_formula_cmd_step_1 = _memory_formula + "='"+( is_string( _input_formula ) ? _input_formula : _memory_default_value )+"';";
                _set_value_cmd = _memory_variable + "=safe_float( '"+( is_string( _input_formula ) ? _input_formula : _memory_default_value )+"', 0 );";
                _store_value_cmd = "safe_float( '"+( is_string( _input_formula ) ? _input_formula : _memory_default_value )+"', 0 );";
                break ;
            }

            eval( _set_formula_cmd_step_1 );
            if ( _set_formula_cmd_step_2.length > 0 ) eval( _set_formula_cmd_step_2 );
            if ( _parsed_formula_cmd.length > 0 ) eval( _parsed_formula_cmd );
        }
    }
}

function GLOB_PLUGIN_PARAMS_REGISTER()
{
    var _args_n = arguments.length, _plugin_ref ;
    if ( _args_n > 0 )
    {
        var _params = [], _plugin_ref = safe_string( arguments[0], "" );
        for( var _i = 1 ; _i < _args_n ; _i++ ) _params.push( ""+arguments[_i] );

        if ( _plugin_ref.length > 0 && _plugin_configs_list[ ""+_plugin_ref ] == null )
        _plugin_configs_list[ ""+_plugin_ref ] = [];

        if ( _plugin_ref.length > 0 && _plugin_configs_list[ ""+_plugin_ref ] != null )
        {
            // check for duplicates
            var _p_ref_array = _plugin_configs_list[ ""+_plugin_ref ] ;
            var _b_found = NO ;
            for( var _p = 0 ; _p < _p_ref_array.length ; _p++ )
            {
                if ( _p_ref_array[ _p ].compare_to( _params ) )
                {
                    _b_found = YES ;
                    break ;
                }
            }

            var _old_n = safe_size( _plugin_configs_list[ ""+_plugin_ref ], 0 );
            if ( !_b_found ) _plugin_configs_list[ ""+_plugin_ref ].push( _params );
            var _new_n = safe_size( _plugin_configs_list[ ""+_plugin_ref ], 0 );
            if ( _b_found ) return [ RET_IRRELEVANT, "These params have been already registered" ] ;
            else return [ _new_n == _old_n + 1 ? RET_OK : RET_ERROR, ( _new_n == _old_n + 1 ) ? "New params config registered with success" : "Memory failure while trying to save this new params config" ] ;
        }
        else return[ RET_ERROR, "Memory failure while saving current params config" ] ;
    }
    else return[ RET_ERROR, "Missing inputs to save params config" ] ;
    // _plugin_configs_list
}

function GLOB_PLUGIN_PARAMS_EXIST()
{
    var _plugin_ref = safe_string( arguments[0], "" );
    return ( _plugin_ref.length > 0 && _plugin_configs_list[ ""+_plugin_ref ] != null );
}

function GLOB_PLUGIN_PARAMS_COMBO_CODE_GET()
{
    var _plugin_ref = safe_string( arguments[0], "" );
    if ( _plugin_ref.length > 0 && _plugin_configs_list[ ""+_plugin_ref ] != null )
    {
        var _html = "<SELECT ID=\"PLUGINSconfigCOMBO\" ONCHANGE=\"javascript:GLOB_PLUGIN_PARAMS_COMBO_GET();\">" ;
            _html += "<OPTION VALUE=\"\" SELECTED=\"selected\">" ;
        var _p_ref_array = _plugin_configs_list[ ""+_plugin_ref ] ;
        var _b_found = NO, _chunk ;
        for( var _p = 0 ; _p < _p_ref_array.length ; _p++ ) _html += "<OPTION VALUE=\""+_p_ref_array[_p].join( "@" )+"\">#" + ( _p + 1 );
        _html += "</SELECT>" ;

        $( "#PLUGINcomboLABEL" ).show();
        return _html ;
    }
    else
    {
        $( "#PLUGINcomboLABEL" ).hide();
        return "" ;
    }
}

function GLOB_PLUGIN_PARAMS_COMBO_GET()
{
    var _combo = $( "#PLUGINSconfigCOMBO" ).get(0);
    if ( _combo != null )
    {
       var _chunk = safe_string( _combo.options[ _combo.selectedIndex ].value, "" );
       if ( _chunk.length > 0 )
       {
          var _chunk_array = _chunk.includes( "@" ) ? _chunk.split( "@" ) : [];
          var _ctrl_ids = [], _ctrl_values = [];
          $.each( _chunk_array, function( _i, _v ) { _v.start_with( "#" ) ? _ctrl_ids.push( _v ) : _ctrl_values.push( _v ); } );
          if ( _ctrl_ids.length > 0 && _ctrl_ids.length == _ctrl_values.length )
          		for( var _i = 0 ; _i < _ctrl_ids.length ; _i++ ) $( _ctrl_ids[_i] ).val( _ctrl_values[_i] );
          else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Mismatch count while loading plugin config", _glob_app_title );
       }
    }
}