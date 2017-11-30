if ( typeof is_mobius_map != "function" ) function is_mobius_map( _obj ) { return _obj instanceof mobius_map ; }
if ( typeof is_item_obj != "function" ) function is_item_obj( _obj ) { return _obj instanceof item_obj ? 1 : 0 ; }

function item_obj( mobius_map,
                   complex_circle, screen_circle,
                   symbol, params_mask,
                   draw, bordercolor, fill, fillcolor,
                   inverse_symbol,
                   bordersize, item_type, notes, _original_word )
{
   this.map = is_mobius_map( mobius_map ) ? mobius_map.copy() : null ;
   this.complex_circle = new circle();
   if ( is_mobius_map( this.map ) && !is_circle( complex_circle ) )
   this.complex_circle.isometric_circle_from_matrix( this.map.a, this.map.b, this.map.c, this.map.d, YES );
   else if ( is_circle( complex_circle ) )
   {
      this.complex_circle = complex_circle.copy();
      this.complex_circle.bordercolor = safe_string( bordercolor, _glob_draw_seed_color );
      this.complex_circle.fillcolor = safe_string( fillcolor, _glob_fill_seed_color );
      this.complex_circle.draw = safe_int( draw, YES );
      this.complex_circle.fill = safe_int( fill, NO );
      this.complex_circle.bordersize = safe_int( bordersize, 1 );
      this.complex_circle.fixer( CIRCLES_MAX_COORD );
   }

   this.screen_circle = is_circle( screen_circle ) ? screen_circle : new circle( new point( 0, 0 ), 0 );
   this.screen_circle.fixer( CIRCLES_MAX_COORD );
   // Uppercase letters for direct maps, lowercase of related inverse maps
   this.symbol = safe_string( symbol, "" );
   this.inverse_symbol = safe_string( inverse_symbol, this.symbol.reverse().flipCase() );
   // item_type >> 0: circle, 1: map
   this.params_mask = safe_int( params_mask, 0 );
   this.item_type = safe_int( item_type, ITEM_TYPE_CIRCLE );
   this.notes = safe_string( notes, "" ) ;
   this.original_word = is_string( _original_word ) ? ( ( _original_word.length > 0 ) ? safe_string( _original_word, this.symbol ) : this.symbol ) : this.symbol ;
   this.hashtag = ( new Date() ).getTime() + "" ;
}

item_obj.prototype.copy = function()
{
	 var _item = new item_obj ;
	 		 _item.init_from_obj( this );
	 return _item ;
}

item_obj.prototype.init_from_obj = function( item )
{
   /* such a weak checking shall be used, because this function
      is called from the multi-tasking obj, which detach data from
      from their original instantiation, qualifying them as raw objects
   */
   if ( item != null )
   {
      this.map = new mobius_map();
      var _items_exists = item.map != null ? 1 : 0 ;
      this.complex_circle = new circle() ;
      this.screen_circle = new circle() ;
      if ( _items_exists )
      {
         this.map.init_from_obj( item.map );
         this.complex_circle.init_from_obj( item.complex_circle ) ;
         this.screen_circle.init_from_obj( item.screen_circle ) ;
         this.symbol = item.symbol.trim();
         this.inverse_symbol = item.inverse_symbol.trim();
         this.params_mask = item.params_mask ;
         this.item_type = item.item_type ;
         this.notes = item.notes ;
         this.original_word = is_string( item.original_word ) ? ( ( item.original_word.length > 0 ) ? safe_string( item.original_word, item.symbol ) : item.symbol ) : item.symbol ;
      }
      
      this.hashtag = ( ( new Date() ).getTime() ) + "" ;
   }
}

item_obj.prototype.output = function( _sep, _roundto )
{
   _sep = safe_string( _sep, " " );
   _roundto = safe_int( _roundto, _glob_accuracy );
   var _check_c = is_circle( this.complex_circle ) ;
   var _out = _sep + "Symbol : " + ( this.symbol.length > 0 ? this.symbol : "(empty)" ) + " - Inverse symbol : " + ( this.inverse_symbol.length > 0 ? this.inverse_symbol : "(empty)" ) ;
      _out += _sep + "Mobius map : " + ( is_mobius_map( this.map ) ? this.map.output( _sep, "coeffs", _roundto ) : "(none)" );
      _out += _sep + "Circle : " + ( _check_c ? this.complex_circle.output( "", _roundto ) : "(none)" );
      _out += _sep + "Draw : " + ( _check_c ? ( this.complex_circle.draw ? "yes" : "no" ) : "(invalid)" );
      _out += _sep + "Draw color : " + ( _check_c ? ( this.complex_circle.bordercolor ) : "(invalid)" );
      _out += _sep + "Fill : " + ( _check_c ? ( this.complex_circle.fill ? "yes" : "no" ) : "(invalid)" );
      _out += _sep + "Fill color : " + ( _check_c ? ( this.complex_circle.fillcolor ) : "(invalid)" );
      _out += _sep + "Line thickness : " + ( _check_c ? ( this.complex_circle.bordersize + " px" ) : "(invalid)" );
      _out += _sep + "Notes : " + ( safe_string( this.notes, 0 ).trim().length > 0 ? this.notes : "(none)" ) ;
   return _out ;
}

item_obj.prototype.inverse = function()
{
   var _inverse_item_obj = new item_obj();
       _inverse_item_obj.init_from_obj( this );
   var _inv_mm = is_mobius_map( this.map ) ? this.map.inv() : null ;
   _inverse_item_obj.map.init_from_obj( _inv_mm );
   _inverse_item_obj.original_word = _inverse_item_obj.symbol = this.inverse_symbol.trim();
   _inverse_item_obj.inverse_symbol = this.symbol.trim();
   return _inverse_mobius_map ;
}

item_obj.prototype.validate = function( _validation_mask )
{
   _validation_mask = safe_int( _validation_mask, INIT_NONE );
   if ( is_circle( this.complex_circle ) && !is_mobius_map( this.map ) && _validation_mask.is_one_of( INIT_FROM_DISKS, INIT_NONE ) )
   {
       this.map = new mobius_map();
       this.map.init_inversion_from_one_circle( this.complex_circle ) ;
   }
   else if ( is_mobius_map( this.map ) && !is_circle( this.complex_circle ) && _validation_mask.is_one_of( INIT_FROM_MAPS, INIT_NONE ) )
   {
       this.complex_circle = this.map.isometric_circle() ;
   }
   
   return ( is_circle( this.complex_circle ) && is_mobius_map( this.map ) ) ? 1 : 0 ;
}