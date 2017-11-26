/*
    JS screen mapper class library is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Code by Alessandro Rosa - alessandro.a.rosa@gmail.com

var SCREEN_MAPPER_MAX_ACCURACY = 12 ; // suggested value for all accuracy tests. Never exceed 20, which is max value allowed by javascript .toPrecision built-in function

if ( typeof is_screen_mapper != "function" ) function is_screen_mapper( _obj ) { return ( _obj instanceof screen_mapper ) ; }
if ( typeof safe_int != "function" ) function safe_int( _val, _set_if_nan ) { _val = parseInt( _val, 10 ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }
if ( typeof safe_float != "function" ) function safe_float( _val, _set_if_nan ) { _val = parseFloat( _val ); return isNaN( _val ) ? ( isNaN( _set_if_nan ) ? 0 : _set_if_nan ) : _val ; }

function screen_mapper()
{
   this.lu = null ; // point coordinates at the Left-Up corner
   this.rd = null ; // point coordinates at the Right-Down corner
   this.client_rect = new rect() ;
   this.display_rect = new rect() ;
   this.coords_rect = new rect();
   this.label = "" ;
   this.accuracy = SCREEN_MAPPER_MAX_ACCURACY ;
   
   // private members for internal use
   this.coords_rect.set_orientation( _RECT_ORIENTATION_CARTESIAN );
   this.client_pt = new point();
   this.client_center = new point();
   this.display_to_client_pt = new point() ;
   this.cartesian_x_interval = 0 ;
   this.cartesian_y_interval = 0 ;
   this.error_mask = 0 ;
   this.center = new point() ;
}

screen_mapper.prototype.reset = function()
{
   this.lu = null ; // point coordinates at the Left-Up corner
   this.rd = null ; // point coordinates at the Right-Down corner
   this.client_rect = new rect() ;
   this.display_rect = new rect() ;
   this.coords_rect = new rect();
   this.coords_rect.set_orientation( _RECT_ORIENTATION_CARTESIAN );
   this.label = "" ;
   this.accuracy = SCREEN_MAPPER_MAX_ACCURACY ;
   this.client_pt = new point();
   this.client_center = new point();
   this.display_to_client_pt = new point() ;
   this.cartesian_x_interval = 0 ;
   this.cartesian_y_interval = 0 ;
   this.error_mask = 0 ;
   this.center = new point();
}

screen_mapper.prototype.copy = function()
{
   var _sm = new screen_mapper();
       _sm.acquire_from_sm( this );
   return _sm ;
}

screen_mapper.prototype.acquire_from_sm = function( _sm )
{
	 if ( _sm instanceof screen_mapper )
	 {
      this.lu = _sm.lu != null ? _sm.lu.copy() : new point(0,0) ; // point coordinates at the Left-Up corner
			this.rd = _sm.rd != null ? _sm.rd.copy() : new point(0,0) ; // point coordinates at the Right-Down corner
		  this.client_rect = _sm.client_rect.copy() ;
		  this.display_rect = _sm.display_rect.copy() ;
		  this.coords_rect = _sm.coords_rect.copy() ;
      this.coords_rect.set_orientation( _RECT_ORIENTATION_CARTESIAN );
		  this.label = _sm.label ;
		  this.accuracy = _sm.accuracy ;
		  this.client_pt = _sm.client_pt.copy() ;
		  this.client_center = _sm.client_center.copy() ;
		  this.display_to_client_pt = _sm.display_to_client_pt.copy() ;
		  this.cartesian_x_interval = _sm.cartesian_x_interval ;
		  this.cartesian_y_interval = _sm.cartesian_y_interval ;
		  this.error_mask = _sm.error_mask ;
		  this.center = _sm.center.copy() ;
			return true ;
	 }
	 else return false ;
}

screen_mapper.prototype.check = function()
{
   this.error_mask = 0 ;
   if ( this.lu == null || this.rd == null ) this.error_mask = -1 ;
   else if ( !this.client_rect.is_consistent() ) this.error_mask = -2 ;
   else if ( this.client_rect.is_empty() ) this.error_mask = -3 ;
   else if ( !this.display_rect.is_consistent() ) this.error_mask = -4 ;
   else if ( this.display_rect.is_empty() ) this.error_mask = -5 ;
   else if ( !this.coords_rect.is_consistent() ) this.error_mask = -6 ;
   else if ( this.coords_rect.is_empty() ) this.error_mask = -7 ;
   return this.error_mask <= 0 ? 0 : 1 ;
}

screen_mapper.prototype.reload = function() { this.set_coords_corners( this.lu, this.rd ); }

screen_mapper.prototype.write = function( _separator )
{
   if ( _separator == null || _separator == "undefined" ) _separator = "<br>" ;
   this.lu.write() ;   document.write( _separator ) ;
   this.rd.write() ;   document.write( _separator ) ;
   this.client_rect.write() ;  document.write( _separator ) ;
   this.display_rect.write() ;
}

screen_mapper.prototype.get_error = function() { return this.error_mask ; }
screen_mapper.prototype.output = function()             { return "Label: " + this.label + "\nLeft top: " + this.lu.output( "std", SCREEN_MAPPER_MAX_ACCURACY ) + "\nRight bottom: " + this.rd.output( "std", SCREEN_MAPPER_MAX_ACCURACY ) + "\nCoords Rect: " + this.coords_rect.output( "std", SCREEN_MAPPER_MAX_ACCURACY ) + "\nClient rect: " + this.client_rect.output( "std", SCREEN_MAPPER_MAX_ACCURACY ) + "\nDisplay rect: " + this.display_rect.output( "std", SCREEN_MAPPER_MAX_ACCURACY ); }
screen_mapper.prototype.roundVal = function( _n ) { return Math.round( _n * Math.pow( 10, this.accuracy ) ) / Math.pow( 10, this.accuracy ); /*return parseFloat( _n.toPrecision( this.accuracy ) ) ;*/ }
screen_mapper.prototype.get_accuracy = function() { return this.accuracy ; }
screen_mapper.prototype.set_accuracy = function( a ) { this.accuracy = Math.max( 0, Math.min( a, SCREEN_MAPPER_MAX_ACCURACY ) ) ; }
screen_mapper.prototype.get_coords_corners = function() { return { lu : this.lu, rd : this.rd } ; }
screen_mapper.prototype.set_coords_corners = function( left_up_pt, right_down_pt )
{
	 if ( left_up_pt instanceof point && right_down_pt instanceof point )
	 {
		   this.lu = left_up_pt.copy() ;
		   this.rd = right_down_pt.copy() ;
		   this.coords_rect.set_rect( this.lu.x, this.lu.y, this.rd.x, this.rd.y, _RECT_ORIENTATION_CARTESIAN );
		   this.center = this.coords_rect.center_pt();
			 // get the cartesian region width
			 this.cartesian_x_interval = Math.abs( this.roundVal( this.rd.x - this.lu.x ) ) ;
			 // ... and height
			 this.cartesian_y_interval = Math.abs( this.roundVal( this.lu.y - this.rd.y ) ) ;
	 }
}

screen_mapper.prototype.get_coords_rect = function() { return this.coords_rect.copy() ; }
screen_mapper.prototype.set_coords_rect = function( _rect )
{
   if ( _rect instanceof rect )
   {
      this.lu = new point( _rect.x1, _rect.y1 ) ;
      this.rd = new point( _rect.x2, _rect.y2 ) ;
      this.coords_rect.set_rect( _rect.x1, _rect.y1, _rect.x2, _rect.y2, _RECT_ORIENTATION_CARTESIAN );
		  this.center = this.coords_rect.center_pt();
			// get the cartesian region width
			this.cartesian_x_interval = Math.abs( this.roundVal( this.rd.x - this.lu.x ) ) ;
			// ... and height
			this.cartesian_y_interval = Math.abs( this.roundVal( this.lu.y - this.rd.y ) ) ;
   }
}

screen_mapper.prototype.set_client_rect = function( _cr )
{
	 this.client_rect.from_rect( _cr ) ;
	 this.client_center.acquire_from_coords( this.roundVal( this.client_rect.w / 2.0 ), this.roundVal( this.client_rect.h / 2.0 ) ) ;
}
screen_mapper.prototype.get_client_rect = function() { return this.client_rect.copy() ;  }

screen_mapper.prototype.set_display_rect = function( _dr ) { this.display_rect.from_rect( _dr ) ; }
screen_mapper.prototype.get_display_rect = function() { return this.display_rect.copy() ; }

// From Client -> Display -> Cartesian
screen_mapper.prototype.from_client_to_cartesian = function( x, y ) { return this.display_to_cartesian( this.client_to_display( new point( x, y ) ) ); }
screen_mapper.prototype.client_to_display = function( pt )
{
   // First reverse the Y axis, so to get the right cartesian plane orientation
   // from
   // Computer screen coords 	|    0
   //							            |
   //						             \|/   Y
   //
   // to
   // Cartesian coords 	     /|\   Y
   //						              |
   //					                |    0
	 pt.y = this.roundVal( this.client_rect.h - pt.y ) ;
	 // we shift the client region so that its center now matches the origin
   return new point( this.roundVal( pt.x - this.client_center.x ), this.roundVal( pt.y - this.client_center.y ) ) ;
}

screen_mapper.prototype.display_to_cartesian = function( pt )
{
	 // x, y normalization and rescaling to the input interval.
	 // Either display and cartesian rectangle are centered to the origin now
   pt.x = pt.x / this.display_rect.w * this.cartesian_x_interval ;
   pt.y = pt.y / this.display_rect.h * this.cartesian_y_interval ;
	 // shift to the input cartesian region
	 pt.x += this.roundVal( this.center.x ) ;
	 pt.y += this.roundVal( this.center.y ) ;
 	 return pt ;
}

// From Cartesian -> Display -> Client
screen_mapper.prototype.from_cartesian_to_client = function( x, y )
{
   // current region mid-point is computed
   // input x,y coords are shifted as if the 'center' of the input rectangle matches the origin
   // and then get back to the original center
   this.client_pt.acquire_from_coords( this.roundVal( x - this.center.x ), this.roundVal( y - this.center.y ) ) ;
   return this.display_to_client( this.cartesian_to_display( this.client_pt ) );
}

screen_mapper.prototype.cartesian_to_display = function( pt )
{
	 pt.x = pt.x / this.cartesian_x_interval * this.display_rect.w ;
	 pt.y = pt.y / this.cartesian_y_interval * this.display_rect.h ;
	 return pt ;
}

screen_mapper.prototype.display_to_client = function( _display_pt )
{
	 this.display_to_client_pt.acquire_from_coords( _display_pt.x + this.client_rect.w / 2.0,
	                          											_display_pt.y + this.client_rect.h / 2.0 ) ;
	 this.display_to_client_pt.y = this.roundVal( this.client_rect.h - this.display_to_client_pt.y ) ;
	 this.display_to_client_pt.x = ( 0.5 + this.display_to_client_pt.x ) << 0 ;
	 this.display_to_client_pt.y = ( 0.5 + this.display_to_client_pt.y ) << 0 ;
	 return this.display_to_client_pt.copy() ;
}

////////////////////////////////////////////////////////////////////////////////
//																			                                      //
//				Coordinates Transformations									                        //
//				( From video screen resolution to cartesian plane )			            //
//																			                                      //
////////////////////////////////////////////////////////////////////////////////

/*
Below I explain how to work out the transformation from screen to cartesian coords
We start by checking that we have two regions in screen coordinates :
* the whole client rectangle
* the restricted subset rectangle to draw in

They could match anyway.

The inner region bounds are required to be assumed in cartesian coordinates
for example. : A( -1.5 , 1.5 ) which is the left-up corner,
			         B ( 1.5 , -1.5 ) which is the right-down corner


  0,0
  ----------------------------------------------------
  |                        													 |
  |		the client rectangle ( CLIENT REGION )		     |
  |													                         |
  |			   Y									                       |
  |			   X --------------------------|             |
  |			   |						               |			       |
  |			   |	The region to	           |        		 |
  |			   |		plot			             |        		 |
  |			   |		inside			           |         		 |
  |			   |						               |       			 |
  |			   |	( INNER REGION )	       |       			 |
  |			   |						               |X + Iwidth   |
  |			   ----------------------------|Y + Iheight  |
  |									                    	           |
  |													                         |
  |													                         |
  --------------------------------------------------- C width, Cheight

It's important to define the relations between the inner region and the client
region because the former lies inside the latter.

First let's move the client and the inner region at ( 0,0 ).
Use function "ClientToDisplay" here.
We obtain :

  			   		( Cheight / 2.0 ) 							
					-------------------------- 		    
  	       -    (Cwidth / 2.0)       |						 |			
  				   |	----------------     |			
  				   |	|		(0,0)	           |	 |			
  				   |	|	    *		           |	 |			
  				   |	|				             |	 |			
  				   |	-----------------	   |			
  				   |						           |Cwidth / 2.0 
  				   -------------------------- 		    
  									 		- ( Cheight / 2.0 )

Then, we transform the resulting point (in display coords) to a new one in
cartesian coordinates. It's easy : just normalize display coords and rescale
to cartesian plane.
Use "display_to_cartesian" here.

Moreover , this last function shifts the new cartesian rectangle region to the center
point of region being delimited by the left-up and right-down corners I mentioned above.

  LU : left-up corner point in cartesian coordinates
  RD : Right corner point in cartesian coordinates
  CN : center point
  
  The formula is : CNx = [ absolute value of ( LUx + RDx ) ] / 2.0 ;
  The formula is : CNy = [ absolute value of ( LUy + RDy ) ] / 2.0 ;

  -------------------------					-----------------------------
  |						             |				|							               |
  |						             |				|							               |
  |						             |				|							               |
  |			( 0,0 )		         |				|	        ( CNx , CNy )		   |
  |			 *			           | ----->	|			           *			     |
  |						             |				|						                 |
  |						             |				|							               |
  |						             |				|							               |
  |						             |				|							               |
  -------------------------					------------------------------

*/