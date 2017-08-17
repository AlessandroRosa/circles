function CIRCLESformsEPSEDITOR_EVENTS( ctrl_id, event )
{
	  if ( event.stopPropagation )      event.stopPropagation();
	  if ( event.cancelBubble != null ) event.cancelBubble = true;

		switch( event.keyCode )
		{
				case 13: // return
        if ( ctrl_id.strcmp( "CIRCLESepseditorPAGEedit" ) )
        CIRCLESformsEPSEDITORopenPAGE( $( '#CIRCLESepseditorPAGEedit' ).val(), CIRCLESformsEPSEDITOR_pages );
        else if ( ctrl_id.strcmp( "CIRCLESepseditorSEARCHstr" ) )
        CIRCLESformsEPSEDITORsearch( $('#CIRCLESepseditorSEARCHstr').val() );
        break ;
        default: break ;
    }
}

function CIRCLESformsEPSEDITORreloadPAGE()
{
    if ( CIRCLESformsEPSEDITOR_current_page == 0 ) CIRCLESformsEPSEDITOR_current_page = 1 ;
    CIRCLESformsEPSEDITORopenPAGE( CIRCLESformsEPSEDITOR_current_page, CIRCLESformsEPSEDITOR_pages );
}

function CIRCLESformsEPSEDITORforwardPAGE()
{
    if ( ( CIRCLESformsEPSEDITOR_current_page + 1 ) < CIRCLESformsEPSEDITOR_pages )
    {
         CIRCLESformsEPSEDITOR_current_page++ ;
         CIRCLESformsEPSEDITORopenPAGE( CIRCLESformsEPSEDITOR_current_page, CIRCLESformsEPSEDITOR_pages );
    }
    
    var _class = ( CIRCLESformsEPSEDITOR_current_page + 1 ) == CIRCLESformsEPSEDITOR_pages ? "link_rounded_dead" : "link_rounded" ;
    $( "#CIRCLESepseditorPAGESforwardLABEL" ).get(0).setAttribute( "class", _class );
}

function CIRCLESformsEPSEDITORbackwardPAGE()
{
    if ( ( CIRCLESformsEPSEDITOR_current_page - 1 ) > 0 )
    {
         CIRCLESformsEPSEDITOR_current_page-- ;
         CIRCLESformsEPSEDITORopenPAGE( CIRCLESformsEPSEDITOR_current_page, CIRCLESformsEPSEDITOR_pages );
    }
    
    var _class = CIRCLESformsEPSEDITOR_current_page == 0 ? "link_rounded_dead" : "link_rounded" ;
    $( "#CIRCLESepseditorPAGESbackwardLABEL" ).get(0).setAttribute( "class", _class );
}

function CIRCLESformsEPSEDITORcomputePAGES( _update_form )
{
    _update_form = safe_int( _update_form, NO );
    var _codelist_ref = _glob_js_e_ps_obj.get_codelist_ref();
    CIRCLESformsEPSEDITOR_pages = Math.floor( safe_size( _codelist_ref, 0 ) / CIRCLESformsEPSEDITOR_max_entries_per_page );
    if ( safe_size( _codelist_ref, 0 ) % CIRCLESformsEPSEDITOR_max_entries_per_page > 0 ) CIRCLESformsEPSEDITOR_pages++ ;

    var _new_code = safe_string( $( "#CIRCLESformsEPSEDITORtextarea" ).val(), "" ).trim();
    if ( safe_string( _new_code, "" ).length == 0 ) CIRCLESformsEPSEDITORopenPAGE( CIRCLESformsEPSEDITOR_current_page + 1, CIRCLESformsEPSEDITOR_pages );
    if ( _update_form ) $( "#CIRCLESepseditorPAGESrangeLABEL" ).html( "(1-" + CIRCLESformsEPSEDITOR_pages+")" );
}

function CIRCLESformsEPSEDITORsearch( _search_str )
{
      _search_str = safe_string( _search_str, "" ).trim();
      if ( _search_str.length >= 3 )
      {
          var _found_in_pages = [] ;
          var _codelist_ref = _glob_js_e_ps_obj.get_codelist();
          $.each( _codelist_ref,
                  function( _i, _row )
                  {
                      if ( _row.includes_i( _search_str ) )
                      {
                          var _page = Math.floor( _i / CIRCLESformsEPSEDITOR_max_entries_per_page );
                          if ( ( _i % CIRCLESformsEPSEDITOR_max_entries_per_page ) > 0 ) _page++ ;
                          _found_in_pages.push( _page );
                      }
                  }
                );
          
          _found_in_pages = _found_in_pages.unique();
          var _pages_n = safe_size( _found_in_pages, 0 );
          if ( _pages_n > 0 )
          {
               var _code = "<table>" ;
                   _code += "<tr>" ;
                   _code += "<td>Found in "+( _pages_n == 1 ? "page 1" : "pages" )+"</td>" ;
               if ( _pages_n == 1 )
               {
                    $( "#CIRCLESepseditorSEARCHcombo" ).get(0).selectedIndex = 1 ;
                    CIRCLESformsEPSEDITORopenPAGE( 1, CIRCLESformsEPSEDITOR_pages );
               }
               else if ( _pages_n > 1 )
               {
                   _code += "<td WIDTH=\"2\"></td>" ;
                   _code += "<td>" ;
                   _code += "<SELECT ID=\"CIRCLESepseditorSEARCHcombo\" ONCHANGE=\"javascript:var t = safe_int(this.options[this.selectedIndex].value,0);if(t!=UNDET)CIRCLESformsEPSEDITORopenPAGE( t, CIRCLESformsEPSEDITOR_pages );\">" ;
                   _code += "<OPTION VALUE=\""+UNDET+"\">" ;
                   for( var _i = 0 ; _i < _pages_n ; _i++ ) _code += "<OPTION VALUE=\""+( _i + 1 )+"\">" + ( _i + 1 );
                   _code += "</SELECT>" ;
                   _code += "</td>" ;
               }

               _code += "</tr>" ;
               _code += "</table>" ;
               $( "#CIRCLESepseditorSEARCHoutput" ).html( _code );
          }
          else $( "#CIRCLESepseditorSEARCHoutput" ).html( "<SPAN STYLE=\"color:#909090;\">Found no matches</SPAN>" );
      }
      else circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, "Search strings must be 3 chars long at least.", _glob_app_title );
}