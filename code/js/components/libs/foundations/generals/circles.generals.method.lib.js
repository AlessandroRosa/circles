function circles_lib_process_get()	 { return safe_int( _glob_process, PROCESS_NONE ); }
function circles_lib_process_set( _process ) { _glob_process = safe_int( _process, PROCESS_NONE ); }
function circles_lib_method_check() { return _glob_method.is_one_of( METHOD_INVERSION, METHOD_ALGEBRAIC ) ? YES : NO ; }
function circles_lib_method_get()	   { return safe_int( _glob_method, METHOD_NONE ); }
function circles_lib_method_guess( _items_array )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } )
    var _items_n = _test ? circles_lib_count_items( _items_array ) : 0 ;
    if ( !_test ) return [ RET_ERROR, METHOD_NONE ] ;
    else if ( _items_n <= 0 ) return [ RET_IRRELEVANT, METHOD_NONE ] ;
    else if ( _items_n > 0 )
    {
       var _mm_01, _mm_02, _i, _k, _count_inv = 0 ;
       for( _i = 0 ; _i < _items_n ; _i++ )
       {
          _mm_01 = _items_array[_i].map ;
          if ( is_mobius_map( _mm_01 ) )
          {
            for( _k = 0 ; _k < _items_n ; _k++ )
            {
               _mm_02 = _items_array[_k].map ;
               if ( _mm_01.inv().is_equal_to( _mm_02 ) && _i != _k )
               {
                   _count_inv++ ;
                   break ;
               }
            }
          }
          else return [ RET_ERROR, METHOD_NONE ] ;
       }
       
       return [ RET_OK, _count_inv > 0 ? METHOD_ALGEBRAIC : METHOD_INVERSION ] ;
    }
}

function circles_lib_method_set( _new_method )
{
    _new_method = safe_int( _new_method, METHOD_NONE );
    if ( _glob_dict_check != SKIP ) _glob_dict_create = _new_method != _glob_last_method ? YES : NO ;
    _glob_method = _new_method ;
    if ( $( "#STATUSBARcounting_entity_leftLABEL" ).get(0) != null )
    {
        $( "#STATUSBARcounting_entity_leftLABEL" ).html( _glob_process == PROCESS_RANDOM ? "2<sup>^</sup>" : "Depth" );
        $( "#STATUSBARcounting_entity_rightLABEL" ).html( _glob_process == PROCESS_RANDOM ? "steps" : "" );
        $( "#STATUSBARcounting_entity_rightLABEL" ).width( _glob_process == PROCESS_RANDOM ? 30 : 0 ) ;
    }

    switch( _glob_method )
    {
       case METHOD_ALGEBRAIC:
       _dictionary_init_settings_array['use_reduced_words'] = YES ;
       _dictionary_init_settings_array['allow_repetition'] = YES ;
       _dictionary_init_settings_array['compute_inv_symbol'] = YES ;
       _dictionary_init_settings_array['longest_words_only'] = YES ;
       _dictionary_init_settings_array['crash_words_packed'] = "" ;
       _glob_init_mask = INIT_FROM_MAPS | INIT_PAIRED_ITEMS ;
       if ( _glob_process != PROCESS_RANDOM ) _glob_use_last_pt = NO ;
       if ( _glob_process == PROCESS_NONE ) circles_lib_process_set( PROCESS_BREADTHFIRST ) ;
       break ;
       case METHOD_INVERSION:
       _dictionary_init_settings_array['use_reduced_words'] = NO ;
       _dictionary_init_settings_array['allow_repetition'] = NO ;
       _dictionary_init_settings_array['compute_inv_symbol'] = NO ;
       _dictionary_init_settings_array['longest_words_only'] = NO ;
       _dictionary_init_settings_array['crash_words_packed'] = "" ;
       _glob_init_mask = INIT_FROM_DISKS | INIT_SINGLE_ITEMS ;
       _glob_use_last_pt = NO ;
       break ;
       case METHOD_NONE:
       default:
       _dictionary_init_settings_array['use_reduced_words'] = NO ;
       _dictionary_init_settings_array['allow_repetition'] = NO ;
       _dictionary_init_settings_array['compute_inv_symbol'] = NO ;
       _dictionary_init_settings_array['longest_words_only'] = NO ;
       _dictionary_init_settings_array['crash_words_packed'] = "" ;
       _glob_use_last_pt = NO ;
       break ;
   }

   var _method_def = circles_lib_method_get_def( _glob_method );
   CELLsetCONTENTS('[id$=captionmethod]', "<b>"+_method_def+"</b>" );
   $('[id$=renderBTN]').css('color',COLOR_ERROR) ;
}