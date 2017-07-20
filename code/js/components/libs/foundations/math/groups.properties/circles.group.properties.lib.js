function circles_lib_grp_props_test_upperhalfplane_automorphism( _items_array, _accuracy )
{
     // testing if the current group maps the upper half plane onto itself
     // refer to Magnus' Non-tesselations ... at the top of p. 20
     _accuracy = Math.min( safe_int( Math.abs( _accuracy ), DEFAULT_MAX_ACCURACY ), DEFAULT_MAX_ACCURACY );
     var _ret = YES, _g ;
     $.each( _items_array, function( _i, ITEM ) { _g = ITEM.map ; _ret &= ( _g.det().radius().clean_round_off( _accuracy ) == 1 && _g.a.is_real() && _g.b.is_real() && _g.c.is_real() && _g.d.is_real() ) ? YES : NO ; } );
     return _ret ;
}

function circles_lib_grp_props_test_unitdisk_automorphism( _items_array, _accuracy )
{
     // testing if the current group maps the bounded unit disk onto itself
     // refer to Magnus' Non-tesselations ... at the mid of p. 20
     _accuracy = Math.min( safe_int( Math.abs( _accuracy ), DEFAULT_MAX_ACCURACY ), DEFAULT_MAX_ACCURACY );
     var _ret = YES, _g ;
     $.each( _items_array, function( _i, ITEM ) { _g = ITEM.map ; _ret &= ( _g.det().radius().clean_round_off( _accuracy ) == 1 && _g.a == _g.d.conj() && _g.b == _g.c.conj() ) ? YES : NO ; } );
     return _ret ;
}

function circles_lib_grp_props_get_commutator_features( _items_array, _accuracy, _out_channel, _par_1 )
{
    _accuracy = Math.min( safe_int( Math.abs( _accuracy ), DEFAULT_MAX_ACCURACY ), DEFAULT_MAX_ACCURACY );
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _caps = circles_lib_alphabet_get_cap_symbols() ;
    var _small = circles_lib_alphabet_get_small_symbols() ;
    if ( safe_size( _small, 0 ) > 0 && safe_size( _caps, 0 ) > 0 && _test )
    {
        var _commutator_word = circles_lib_word_commutator_get( "A", _items_array ) ;
        circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<lightgray>Computing commutator</lightgray> <yellow>"+_commutator_word+"</yellow>", _par_1, "" );
        var _commutator_mm = circles_lib_word_mobiusmap_get( _commutator_word, _items_array, _out_channel );
        var _commutator_tr = _commutator_mm.trace();
        if ( _out_channel.match_bit_mask( OUTPUT_TERMINAL, OUTPUT_SCRIPT ) )
        {
            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "a = <snow>" + _commutator_mm.get_a().roundTo( _accuracy ).formula(YES,YES,_accuracy), _par_1, "" )+"</snow>";
            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "b = <snow>" + _commutator_mm.get_b().roundTo( _accuracy ).formula(YES,YES,_accuracy), _par_1, "" )+"</snow>";
            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "c = <snow>" + _commutator_mm.get_c().roundTo( _accuracy ).formula(YES,YES,_accuracy), _par_1, "" )+"</snow>";
            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "d = <snow>" + _commutator_mm.get_d().roundTo( _accuracy ).formula(YES,YES,_accuracy), _par_1, "" )+"</snow>";
            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "determinant = " + _commutator_mm.det().roundTo( _accuracy ).formula(YES,YES,_accuracy), _par_1, "" );
            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "trace = <snow>" + _commutator_tr.roundTo( _accuracy ).formula(YES,YES,_accuracy) + "</snow>" ) ;
            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "" ) ;
            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "<snow>Properties from commutator</snow> <yellow>"+_commutator_word+"</yellow>" ) ;
            circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "      >>" + ( _commutator_mm.is_identity() ? "<snow>Commutator map is identity</snow> <greenshock>items commute</greenshock>" : "<snow>Commutator map is not identity</snow> <orange>items do not commute</orange>" ), _par_1, "" );

            if ( _commutator_tr.roundTo( _accuracy ).is_real() )
            {
                circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "      >> trace is real", _par_1, "" );
                switch( _commutator_tr.roundTo( _accuracy ).r() )
                {
                    case 2:
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "      >> <white>"+_small[0]+"</white> <lightblue>and</lightblue> <white>"+_small[1]+"</white> <lightblue>share one fixed point</lightblue>", _par_1, "" );
                    break ;
                    case -2:
                    circles_lib_output( _out_channel, DISPATCH_MULTICOLOR, "      >> <white>"+_small[0]+"</white> <lightblue>and</lightblue> <white>"+_small[1]+"</white> <lightblue>do not share fixed points</lightblue>", _par_1, "" );
                    break ;
                }
            }
        }
        
        return { 'word' : _commutator_word, 'map' : _commutator_mm.copy(), 'trace' : _commutator_mm.trace() } ;
    }
    else return null ;
}

function circles_lib_grp_props_is_classical_schottky( _items_array, _accuracy )
{
    _accuracy = Math.min( safe_int( Math.abs( _accuracy ), DEFAULT_MAX_ACCURACY ), DEFAULT_MAX_ACCURACY );
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    var _items_n = circles_lib_count_items( _items_array );
    if ( _items_n == 0 || _items_n % 2 != 0 || !_test ) return NO ;
    else
    {
       /*
       ref. Boundaries for two-parabolic Schottky groups (Jane Gilman)
       Theorem 1.2
       */
       var _symbols_array = [], _map = new mobius_map( 1, 0, 0, 1 ) ;
       for( var _i = 0 ; _i < _items_n ; _i++ ) if ( _items_array[_i].symbol.isAlphaLower() ) _symbols_array.push( _items_array[_i].symbol );
           
       for( _i = 0 ; _i < _symbols_array.length ; _i++ )
       _map = _map.composition( circles_lib_find_item_obj_by_symbol( _items_array, _symbols_array[_i] ).map );
           
       var _trace = _map.trace();
       var _condition_1 = ( ( _trace.roundTo(_accuracy).sub( 2 ).radius() + Math.abs( _trace.roundTo(_accuracy).i() ) ) >= 4 ) ? YES : NO ;
       var _condition_2 = YES, _condition_3 = YES ;
       // these loops extend the originals test for two-gens groups
       for( _i = 0 ; _i < _symbols_array.length ; _i++ )
       {
          _map = circles_lib_find_item_obj_by_symbol( _items_array, _symbols_array[_i] ).map ;
          if ( _map.is_identity() )
          {
             _condition_2 = NO ;
             break ;
          }
       }

       for( _i = 0 ; _i < _symbols_array.length ; _i++ )
       {
          _map = circles_lib_find_item_obj_by_symbol( _items_array, _symbols_array[_i] ).map ;
          if ( !_map.trace().is_real() || _map.trace().r() != 2 )
          {
             _condition_3 = NO ;
             break ;
          }
       }
           
       return ( _condition_1 && _condition_2 && _condition_3 ) ? YES : NO ;
    }
}

function circles_lib_grp_props_is_reducible( _items_array, _accuracy )
{
    _accuracy = Math.min( safe_int( Math.abs( _accuracy ), DEFAULT_MAX_ACCURACY ), DEFAULT_MAX_ACCURACY );
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    var _items_n = circles_lib_count_items( _items_array );
    if ( _items_n == 0 || _items_n % 2 != 0 || !_test ) return NO ;
    else
    {
        /* Maclachlan C., Reid A.W.
           The arithmetic of hyperbolic 3-manifolds
           p. 52 - Lemma 1.2.3
        */
        var _commutator_word = circles_lib_word_commutator_get( _items_array[0], _items_array ), _commutator_map = new mobius_map( 1, 0, 0, 1 ) ;
        for( var _c = 0 ; _c < _commutator_word.length ; _c++ )
        _commutator_map = _commutator_map.composition( circles_lib_find_item_obj_by_symbol( _items_array, _commutator_word.charAt( _c ) ).map );
        return _commutator_map.trace().roundTo(_accuracy).radius() == 2.0 ? YES : NO ;
    }
}

function circles_lib_grp_props_get_maps_classes( _items_array, _accuracy )
{
		_items_array = circles_lib_items_set( _items_array ) ;
    var _test = _items_array.test( function( _obj ) { return is_item_obj( _obj ) ; } ) ;
    var _items_n = circles_lib_count_items( _items_array );
    if ( _items_n == 0 || _items_n % 2 != 0 || !_test ) return [ "unknown" ] ;
    else
    {
        var _category_array = [], _map ;
        for( var _i = 0 ; _i < _items_n ; _i++ )
        {
           _map = circles_lib_find_item_obj_by_symbol( _items_array, _items_array[_i].symbol ).map ;
           _category_array.push( _map.classification( NO, _accuracy, YES ) ) ;
        }

        _category_array = _category_array.unique();
        return safe_size( _category_array, 0 ) > 0 ? _category_array.clone() : [ "unknown" ] ;
    }
}