//LOG
function circles_lib_log_add_entry( _log_str, _log_type ) { _glob_app_log.push( [ today_date() + " - "+ current_time(), _log_str, _log_type ] ) ; circles_lib_log_update_statusbar() ; }
function circles_lib_log_update_statusbar()
{
  circles_lib_statusbar_log_icon_show( safe_size( _glob_app_log, 0 ) > 0 ? YES : NO ) ;
  if ( circles_lib_plugin_find_index( { base_id : "log" }, POPUP_SEARCH_BY_BASE_ID ) != UNFOUND )
  {
     circles_lib_plugin_dispatcher_unicast_message('log','forms',POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS);
     return YES ;
  }
  else return NO ;
}

// COUNTING FNS
function circles_lib_count_seeds( _safe_count )
{
	if ( !is_array( _glob_seeds_array ) ) return 0 ;
  var _cnt = 0, _test = _glob_seeds_array.test( function( _obj ) { if ( is_item_obj( _obj ) ) _cnt++ ; return is_item_obj( _obj ) ; } ) ;
  return ( _test && _safe_count ) ? safe_size( _glob_seeds_array, 0 ) : _cnt ;
}

function circles_lib_count_gens( _safe_count )
{
	if ( !is_array( _glob_gens_array ) ) return 0 ;
  var _cnt = 0, _test = _glob_gens_array.test( function( _obj ) { if ( is_item_obj( _obj ) ) _cnt++ ; return is_item_obj( _obj ) ; } ) ;
  return ( _test && _safe_count ) ? safe_size( _glob_gens_array, 0 ) : _cnt ;
}

function circles_lib_count_items( _items_array, _safe_count )
{
  _safe_count = safe_int( _safe_count, NO ), _items_array = circles_lib_items_set( _items_array, NO ) ;
  var _cnt = 0, _test = _items_array.test( function( _obj ) { if ( is_item_obj( _obj ) ) _cnt++ ; return is_item_obj( _obj ) ; } ) ;
  return ( _test && _safe_count ) ? safe_size( _items_array, 0 ) : _cnt ;
}

function circles_lib_count_gens_set_model()   { return safe_size( _glob_gens_set_model_array, 0 ); }
function circles_lib_count_rnd_probabilities(){ return safe_size( _glob_rnd_probability_array, 0 ); }
function circles_lib_count_repetends()        { return safe_size( _glob_repetends_array, 0 ); }
function circles_lib_count_fixed_points()     { return safe_size( _glob_input_fixed_pts_array, 0 ); }
function circles_lib_count_figures()          { return safe_size( _glob_figures_array, 0 ); }
function circles_lib_count_alphabet()         { return safe_size( _glob_alphabet, 0 ); }
function circles_lib_count_palette()          { return safe_size( _glob_palette_array, 0 ); }
function circles_lib_count_dict() 				    {	return is_array( _glob_original_dict ) ? _glob_original_dict.size_recursive() : 0 ; }

// OUTPUT SELECTOR FNS
function circles_lib_samples_load( i, _silent )
{
  _silent = safe_int( _silent, YES );
  $.ajaxSetup( {async:false} );
  _filename = "code/js/components/samples/circles.samples.js" ;
  var _ret = NO ;
  if ( check_file_exists( _filename ) )
  {
    $.getScript( _filename ).done( function() { _ret = YES ; } ).fail( function(){ circles_lib_log_add_entry( 'Can\'t load samples component', LOG_ERROR ) ; } );
    CIRCLESsamplesOPEN( i, _silent );
    window.CIRCLESsamplesOPEN = null ;
  }
  else
  {
    var _msg = "Missing or corrupted component to open this sample" ;
    circles_lib_log_add_entry( _msg, LOG_ERROR ) ;
    if ( !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
  }
    
  return _ret ;
}

// CONFIG FNS
function circles_lib_drawentity_set( _drawentity ) { _glob_drawentity = safe_int( _drawentity, DRAWENTITY_NONE ); }
function circles_lib_drawentity_get() { return _glob_drawentity ; }
function circles_lib_depth_get() { return safe_int( _glob_depth, 0 ); }
function circles_lib_depth_set( _d, _force_dict )
{
    _d = safe_int( _d, UNDET ), _force_dict = safe_int( _force_dict, NO );
    if( _d > 0 )
    {
       if ( _force_dict ) { _glob_dict_check = SKIP ; _glob_dict_create = YES ; }
       if ( _glob_dict_check != SKIP ) _glob_dict_create = _d != _glob_depth ? YES : NO ;
       _glob_depth = _d ;
       $("[id$=depthEDIT]").val( _d );
       if ( _glob_dict_create ) $('[id$=renderBTN]').css('color',COLOR_ERROR) ;
    }
    else $("[id$=depthEDIT]").val( 1 );
}

function circles_lib_config_options_get()         { return [ _glob_method, _glob_process, _glob_construction_mode, _glob_fixedpt_io ]; }
function circles_lib_masterdiv_display( _b_show ) { _b_show ? $("#MASTERdiv").show() : $("#MASTERdiv").hide(); }
function circles_lib_construction_mode_get()      { return _glob_construction_mode ; }
function circles_lib_construction_mode_set( _cm )
{
    _cm = safe_int( _cm, CONSTRUCTION_TILING );
    if ( _glob_dict_check != SKIP ) _glob_dict_create = _cm != _glob_construction_mode ? YES : NO ;
    if ( _glob_dict_create ) $('[id$=renderBTN]').css('color',COLOR_ERROR) ;
    _glob_construction_mode = _glob_dict_processor.DISPLAYwordsMODE = _cm ;
    _glob_dict_create = YES ;
}

function circles_lib_operations_get_mask()
{
    var _mask = 0 ;
    if ( _glob_method == METHOD_ALGEBRAIC )
    {
       _mask = _glob_options_mask ;
       if ( $("#CIRCLESlistFIXEDPOINTSshowCHECKBOX").is( ":checked" ) ) _mask |= 8 ;
    }
    return _mask ;
}